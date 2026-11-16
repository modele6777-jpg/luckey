import { getSitesAIConfig } from './sites-ai-provider.mjs';
// Server-only adapter: use Google's OpenAI-compatible API so conversation
// history, image parts and SSE keep the format expected by the chat client.
export async function handleSitesGeminiChat(request, env, fetchApi = fetch) {
  const pathname = new URL(request.url).pathname;
  if (pathname !== '/api/openai/v1/chat/completions') return null;
  if (request.method !== 'POST') {
    return Response.json({ error: 'POST 요청을 사용해 주세요.' }, { status: 405, headers: { Allow: 'POST' } });
  }
  const { provider, key } = getSitesAIConfig(env);
  const providerName = 'Gemini';
  if (!key) return Response.json({ error: `${providerName} API 키가 설정되지 않았습니다.` }, { status: 503 });
  let input;
  try { input = await request.json(); }
  catch { return Response.json({ error: '올바른 JSON 요청이 필요합니다.' }, { status: 400 }); }
  if (!Array.isArray(input?.messages) || !input.messages.length || input.messages.some(message =>
    !message || !['system', 'developer', 'user', 'assistant'].includes(message.role) ||
    !(typeof message.content === 'string' || Array.isArray(message.content)))) {
    return Response.json({ error: '대화 내용을 확인해 주세요.' }, { status: 400 });
  }
  const model = String(env.GEMINI_MODEL || 'gemini-3.1-flash-lite').trim();
  if (!/^gemini-[a-zA-Z0-9._-]+$/.test(model)) return Response.json({ error: 'Gemini 모델 설정을 확인해 주세요.' }, { status: 503 });
  const payload = {
    model,
    messages: input.messages.map(({ role, content }) => ({ role: role === 'developer' ? 'system' : role, content })),
    stream: input.stream === true,
  };
  if (Number.isFinite(input.temperature)) payload.temperature = Math.max(0, Math.min(2, input.temperature));
  if (Number.isFinite(input.max_tokens) && input.max_tokens > 0) payload.max_tokens = Math.min(32768, Math.floor(input.max_tokens));
  if (input.response_format?.type === 'json_object') payload.response_format = { type: 'json_object' };
  const thinking = input.thinking_level || input.reasoning_effort;
  if (['minimal', 'low', 'medium', 'high'].includes(thinking)) payload.reasoning_effort = thinking;
  const models = [...new Set([model, String(env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite').trim()])].filter(value => /^gemini-[a-zA-Z0-9._-]+$/.test(value));
  try {
    let upstream;
    for (let attempt = 0; attempt < models.length; attempt++) {
      if (request.signal.aborted) throw new Error('Request aborted');
      const attemptPayload = { ...payload, model: models[attempt] };
      // The fallback may support different thinking controls; retain conversation and output format.
      if (attempt > 0) delete attemptPayload.reasoning_effort;
      try {
        upstream = await fetchApi('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify(attemptPayload),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(25000)]),
    });
      } catch (error) {
        if (request.signal.aborted || attempt === models.length - 1) throw error;
        continue;
      }
      if ((upstream.status >= 500 || upstream.status === 404) && attempt < models.length - 1) {
        await upstream.body?.cancel();
        continue;
      }
      break;
    }
    if (!upstream.ok) {
      // Never echo raw provider messages or secret/request details.
      const status = upstream.status;
      const error = status === 429 ? `${providerName} 요청이 일시적으로 제한됐습니다. 잠시 후 다시 시도해 주세요.`
        : status === 401 || status === 403 ? `등록된 ${providerName} API 키의 유효성과 사용 권한을 확인해 주세요.`
        : status === 404 ? `설정된 ${providerName} 모델을 사용할 수 없습니다.`
        : status === 400 ? `${providerName}가 요청을 처리하지 못했습니다. 대화 내용을 확인해 주세요.`
        : `${providerName} 서버에 일시적인 오류가 발생했습니다. 다시 시도해 주세요.`;
      return Response.json({ error }, { status: [400, 401, 403, 404, 429].includes(status) ? status : 502 });
    }
    return new Response(upstream.body, {
      headers: {
        'Content-Type': payload.stream ? 'text/event-stream; charset=utf-8' : 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-AI-Provider': provider,
      },
    });
  } catch {
    return Response.json({ error: `${providerName} 연결이 중단되었습니다. 다시 시도해 주세요.` }, { status: 502 });
  }
}
