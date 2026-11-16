import { getLucyRequestFallbacks } from './lib/lucyModelPolicy.ts';

const GEMINI_OPENAI_CHAT_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const MAX_BODY_BYTES = 48_000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CONTENT_LENGTH = 8_000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_PER_MINUTE = 20;
const recentRequests = new Map<string, number[]>();

export interface CloudflareGeminiChatEnv {
  GEMINI_API_KEY?: string;
}

export function isChatCompletionsPath(pathname: string): boolean {
  return pathname === '/api/openai/v1/chat/completions'
    || pathname === '/openai/v1/chat/completions'
    || pathname.endsWith('/chat/completions');
}

function responseHeaders(request: Request, extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  if (request.headers.has('Origin')) {
    headers.set('Access-Control-Allow-Origin', new URL(request.url).origin);
    headers.set('Vary', 'Origin');
  }
  return headers;
}

function jsonResponse(request: Request, body: unknown, status: number, extra?: HeadersInit): Response {
  return Response.json(body, { status, headers: responseHeaders(request, extra) });
}

// Best-effort per-isolate limit; global enforcement would require shared durable storage.
function overRateLimit(request: Request): boolean {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const recent = (recentRequests.get(ip) || []).filter((stamp) => now - stamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_PER_MINUTE) {
    recentRequests.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentRequests.set(ip, recent);
  if (recentRequests.size > 2_000) {
    for (const [key, stamps] of recentRequests) {
      if (!stamps.some((stamp) => now - stamp < RATE_WINDOW_MS)) recentRequests.delete(key);
      if (recentRequests.size <= 1_500) break;
    }
  }
  return false;
}

async function readBoundedBody(request: Request): Promise<{ text?: string; tooLarge: boolean }> {
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return { tooLarge: true };
  if (!request.body) return { text: '', tooLarge: false };

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return { tooLarge: true };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { text, tooLarge: false };
  } finally {
    reader.releaseLock();
  }
}

function extractText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map((part: any) => typeof part === 'string' ? part : String(part?.text || '')).join(' ');
}

function buildMessages(rawMessages: any[]): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const systemPrompt = rawMessages
    .filter((message) => message?.role === 'system' || message?.role === 'developer')
    .map((message) => extractText(message.content))
    .filter(Boolean)
    .join('\n');
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = rawMessages
    .filter((message) => ['user', 'assistant', 'model'].includes(message?.role))
    .map((message) => ({
      role: message.role === 'user' ? 'user' as const : 'assistant' as const,
      content: extractText(message.content),
    }))
    .filter((message) => message.content.trim().length > 0);
  if (systemPrompt) messages.unshift({ role: 'system', content: systemPrompt });
  return messages;
}

function normalizeRequestedModel(value: unknown): string {
  const raw = String(value || '');
  if (!/^gemini-[a-zA-Z0-9._-]+$/.test(raw)) return 'gemini-flash-lite-latest';
  if (raw === 'gemini-4-argon' || raw.includes('argon') || raw.includes('2.5') || raw.includes('2.0')) {
    return 'gemini-flash-lite-latest';
  }
  return raw;
}

function getReasoningEffort(input: Record<string, any>): string | undefined {
  const value = String(input.reasoning_effort || input.thinking_level || '').toLowerCase();
  return ['minimal', 'low', 'medium', 'high'].includes(value) ? value : undefined;
}

function buildUpstreamPayload(input: Record<string, any>, messages: Array<{ role: string; content: string }>, model: string) {
  const payload: Record<string, any> = {
    model,
    messages,
    stream: input.stream === true,
    max_tokens: Number.isInteger(input.max_tokens) ? Math.min(2_048, Math.max(1, input.max_tokens)) : 1_024,
  };
  if (Number.isFinite(input.temperature)) payload.temperature = Math.max(0, Math.min(2, input.temperature));
  if (input.response_format?.type === 'json_object') payload.response_format = { type: 'json_object' };
  const reasoningEffort = getReasoningEffort(input);
  if (reasoningEffort) payload.reasoning_effort = reasoningEffort;
  return payload;
}

export async function handleCloudflareGeminiChat(request: Request, env: CloudflareGeminiChatEnv): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: responseHeaders(request, {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }),
    });
  }
  if (request.method !== 'POST') {
    return jsonResponse(request, { error: 'POST 요청을 사용해 주세요.' }, 405, { Allow: 'POST, OPTIONS' });
  }
  if (overRateLimit(request)) {
    return jsonResponse(request, { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.', code: 'RATE_LIMITED' }, 429, { 'Retry-After': '60' });
  }

  const boundedBody = await readBoundedBody(request);
  if (boundedBody.tooLarge) {
    return jsonResponse(request, { error: '요청이 너무 큽니다.', code: 'BODY_TOO_LARGE' }, 413);
  }
  let input: Record<string, any>;
  try {
    input = JSON.parse(boundedBody.text || '') as Record<string, any>;
  } catch {
    return jsonResponse(request, { error: '올바른 JSON 요청이 필요합니다.', code: 'INVALID_JSON' }, 400);
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return jsonResponse(request, { error: '대화 내용을 확인해 주세요.' }, 400);
  }

  const rawMessages = Array.isArray(input.messages) ? input.messages : [];
  if (rawMessages.length > MAX_MESSAGES || rawMessages.some((message) => {
    try { return JSON.stringify(message?.content ?? '').length > MAX_MESSAGE_CONTENT_LENGTH; }
    catch { return true; }
  })) {
    return jsonResponse(request, { error: '메시지가 너무 깁니다.', code: 'BODY_TOO_LARGE' }, 413);
  }
  const messages = buildMessages(rawMessages);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return jsonResponse(request, { error: 'A final user message is required' }, 400);
  }
  if (!env.GEMINI_API_KEY) {
    return jsonResponse(request, { error: 'GEMINI_API_KEY가 설정되지 않았습니다.', code: 'GEMINI_API_KEY_MISSING' }, 503);
  }

  const primaryModel = normalizeRequestedModel(input.model);
  const models = [...new Set([primaryModel, ...getLucyRequestFallbacks(primaryModel, input.review_mode)])];
  const timeoutMs = input.review_mode === 'general' ? 25_000 : 15_000;
  let lastStatus = 0;
  for (const model of models) {
    if (request.signal.aborted) break;
    const payload = buildUpstreamPayload(input, messages, model);
    try {
      const timeoutController = new AbortController();
      const timeoutHandle = setTimeout(() => timeoutController.abort(), timeoutMs);
      let upstream: Response;
      try {
        upstream = await fetch(GEMINI_OPENAI_CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.GEMINI_API_KEY}`,
          },
          body: JSON.stringify(payload),
          redirect: 'manual',
          signal: AbortSignal.any([request.signal, timeoutController.signal]),
        });
      } finally {
        // Stop the header wait timeout once the response begins; keep client-abort propagation for SSE.
        clearTimeout(timeoutHandle);
      }
      if (upstream.ok) {
        return new Response(upstream.body, {
          status: upstream.status,
          statusText: upstream.statusText,
          headers: responseHeaders(request, {
            'Content-Type': upstream.headers.get('Content-Type') || (input.stream ? 'text/event-stream; charset=utf-8' : 'application/json; charset=utf-8'),
            'X-AI-Provider': 'gemini',
          }),
        });
      }
      lastStatus = upstream.status;
      await upstream.body?.cancel();
    } catch {
      if (request.signal.aborted) break;
      lastStatus = 0;
    }
  }

  if (lastStatus === 429) {
    return jsonResponse(request, { error: 'AI 제공자의 사용 한도에 도달했습니다. 잠시 후 다시 시도하거나 연결된 Gemini 프로젝트의 할당량을 확인해 주세요.', code: 'AI_QUOTA_EXCEEDED' }, 429);
  }
  return jsonResponse(request, { error: 'AI 응답을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.', code: 'AI_PROVIDER_UNAVAILABLE' }, lastStatus === 503 ? 503 : 500);
}
