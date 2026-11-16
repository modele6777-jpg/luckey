const GEMINI_OPENAI_CHAT_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
const MAX_BODY_BYTES = 48_000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_PER_MINUTE = 20;
const recentRequests = new Map<string, number[]>();

export interface CloudflareGeminiSideEnv {
  GEMINI_API_KEY?: string;
}

const MOODS = [
  { id: 'confession', label: '밤의 고백', emoji: '🌙' },
  { id: 'release', label: '놓아주는 마음', emoji: '🕊️' },
  { id: 'tears', label: '남모를 눈물', emoji: '💧' },
  { id: 'wish', label: '숨겨둔 소망', emoji: '✨' },
  { id: 'letter', label: '파랑새에게 부치는 편지', emoji: '✉️' },
  { id: 'gratitude', label: '비밀 감사', emoji: '🤍' },
] as const;

export function isCloudflareGeminiSidePath(pathname: string): boolean {
  return pathname === '/api/ai/analyze-entry'
    || pathname === '/api/ai/secret-blessing'
    || pathname === '/api/ai/secret-mood-recommend';
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

function jsonResponse(request: Request, body: unknown, status = 200, extra?: HeadersInit): Response {
  return Response.json(body, { status, headers: responseHeaders(request, extra) });
}

// Best-effort per-isolate memory limit; this is not a global quota across Worker isolates.
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

async function readJsonBody(request: Request): Promise<{ body?: Record<string, any>; tooLarge: boolean; invalid: boolean }> {
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return { tooLarge: true, invalid: false };
  if (!request.body) return { tooLarge: false, invalid: true };
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
        return { tooLarge: true, invalid: false };
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { tooLarge: false, invalid: true };
    return { body: parsed as Record<string, any>, tooLarge: false, invalid: false };
  } catch {
    return { tooLarge: false, invalid: true };
  }
}

function parseJson(raw: unknown): Record<string, unknown> | null {
  const text = typeof raw === 'string' ? raw.trim() : '';
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const candidates = [fenced, start >= 0 && end > start ? text.slice(start, end + 1) : '', text].filter((value): value is string => Boolean(value));
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch { /* Try the next candidate. */ }
  }
  return null;
}

async function geminiJson(
  request: Request,
  env: CloudflareGeminiSideEnv,
  prompt: string,
  options: { jsonMode?: boolean; timeoutMs?: number } = {},
): Promise<Record<string, unknown> | null> {
  if (!env.GEMINI_API_KEY) return null;
  try {
    const upstream = await fetch(GEMINI_OPENAI_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemini-flash-lite-latest',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        ...(options.jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
      redirect: 'manual',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(options.timeoutMs || 8_000)]),
    });
    if (!upstream.ok) {
      await upstream.body?.cancel();
      return null;
    }
    const completion = await upstream.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    return parseJson(completion.choices?.[0]?.message?.content);
  } catch {
    return null;
  }
}

function parseAnalysisJson(raw: unknown): { keywords: string[]; emotions: string[] } | null {
  const parsed = raw && typeof raw === 'object' && !Array.isArray(raw)
    ? raw as Record<string, unknown>
    : parseJson(raw);
  if (!Array.isArray(parsed?.keywords) || !Array.isArray(parsed?.emotions)) return null;
  return {
    keywords: parsed.keywords.filter((item): item is string => typeof item === 'string').slice(0, 5),
    emotions: parsed.emotions.filter((item): item is string => typeof item === 'string').slice(0, 3),
  };
}

function heuristicDiaryAnalysis(content: string): { keywords: string[]; emotions: string[]; source: 'engine' } {
  const emotions: string[] = [];
  const lower = content.toLowerCase();
  const dictionary = [
    { keys: ['기쁨', '행복', '감사', '사랑', '설렘', '즐거', 'happy', 'love', 'joy'], tag: '평온/기쁨' },
    { keys: ['슬픔', '우울', '눈물', '외롭', '쓸쓸', 'sad', 'blue', 'lonely'], tag: '내면의 슬픔' },
    { keys: ['불안', '걱정', '두려', '초조', '긴장', 'scared', 'anxious', 'worry'], tag: '정서적 초조' },
    { keys: ['분노', '화가', '짜증', '억울', '미움', 'angry', 'irritated'], tag: '의식의 마찰' },
    { keys: ['지침', '피곤', '소진', '번아웃', '무기력', 'tired', 'exhausted'], tag: '에너지 소진' },
  ];
  for (const entry of dictionary) if (entry.keys.some((key) => lower.includes(key))) emotions.push(entry.tag);
  if (!emotions.length) emotions.push('미묘한 중립');
  const words = content.split(/\s+/).filter((word) => word.length > 1 && !word.startsWith('#'));
  const keywords = [...new Set(words)].slice(0, 4);
  if (!keywords.length) keywords.push('내면 기록', '일상');
  return { keywords, emotions, source: 'engine' };
}

async function analyzeEntry(request: Request, env: CloudflareGeminiSideEnv, body: Record<string, any>): Promise<Response> {
  const title = String(body.title || '');
  const content = String(body.content || '');
  const type = String(body.type || '');
  if (!content && !title) return jsonResponse(request, { keywords: [], emotions: [] });
  if (!env.GEMINI_API_KEY) {
    return jsonResponse(request, { error: 'GEMINI_API_KEY가 설정되지 않았습니다.', code: 'GEMINI_API_KEY_MISSING' }, 503);
  }

  const prompt = `기록의 유형: ${type}\n기록의 제목: ${title}\n기록의 내용:\n${content}\n\n위 내면의 기록을 섬세하게 메타 분석하여:\n1. 기록의 핵심 주제와 생각, 관련 사물을 관통하는 대표 키워드 3~5개 (배열로 추출)\n2. 글쓴이의 주된 마음 상태, 미묘한 어조, 에너지 흐름을 정확히 묘사하는 감정/심리 상태 태그 1~3개 (배열로 추출)\n\n오직 다음 JSON 스키마 형식의 유효한 JSON 결과만 반환해 주세요: {"keywords":["키워드1","키워드2","키워드3"],"emotions":["감정태그1","감정태그2"]}`;
  const structured = parseAnalysisJson(await geminiJson(request, env, prompt, { jsonMode: true }));
  if (structured?.keywords.length && structured.emotions.length) return jsonResponse(request, { ...structured, source: 'model' });
  const plain = await geminiJson(request, env, `${prompt}\n\nJSON 객체만 반환하세요. 키는 keywords와 emotions 입니다.`, { jsonMode: false });
  const parsed = parseAnalysisJson(plain);
  if (parsed?.keywords.length && parsed.emotions.length) return jsonResponse(request, { ...parsed, source: 'model' });
  return jsonResponse(request, heuristicDiaryAnalysis(content || title));
}

function comfortFor(text: string, name = '당신'): string {
  const lower = text.toLowerCase();
  if (/회사|직장|야근|업무|상사|퇴사|이직|동료/.test(lower)) return `${name} 님, 일터의 무거운 책임감을 잠시 내려놓고, 오늘 밤은 오직 당신만을 위한 따뜻하고 포근한 쉼을 누리세요.`;
  if (/친구|인간관계|상처|서운|배신|오해|눈치/.test(lower)) return `${name} 님의 마음의 평화가 가장 소중합니다. 타인의 시선에 휘둘리지 않고 당신만의 맑은 온기를 지키세요.`;
  if (/사랑|연애|이별|그리움|보고싶|짝사랑/.test(lower)) return `누군가를 진심으로 아끼고 사랑했던 ${name} 님의 순수한 온기는 그 자체로 눈부시게 아름답습니다.`;
  if (/불안|걱정|두려|시험|취업|면접|재정|합격/.test(lower)) return `조급해하지 않아도 괜찮아요, ${name} 님. 모든 순리는 가장 알맞고 아름다운 때에 당신 편이 되어줍니다.`;
  if (/외로|혼자|쓸쓸|우울|눈물|피곤|힘들|지쳐/.test(lower)) return `숨을 깊게 들이쉬고 내쉬어 보세요. 무거운 짐을 견뎌온 ${name} 님이라는 존재 자체로 이미 귀하고 충분합니다.`;
  if (/감사|행복|고마|희망|소망|축복|기쁨/.test(lower)) return `세상에 띄워 보낸 ${name} 님의 다정한 감사의 파동은 머지않아 더 커다란 행운과 평온으로 되돌아옵니다.`;
  return `${name} 님, 흘러간 것은 흘러간 대로 두고, 지금 이 순간의 나를 온전히 안아줍니다.`;
}

async function secretBlessing(request: Request, env: CloudflareGeminiSideEnv, body: Record<string, any>): Promise<Response> {
  const text = String(body.content || '').trim();
  const name = String(body.userName || '당신').trim() || '당신';
  if (!text) return jsonResponse(request, { error: '쪽지 내용이 비어 있습니다.' }, 400);
  const prompt = `당신은 비밀 쪽지를 읽고 2문장 이내의 한국어 위로(comfortMantra)만 JSON으로 전하는 파랑새입니다.\n[닉네임] ${name}\n[테마] ${String(body.moodTag || 'confession')}\n[쪽지]\n${text.slice(0, 4000)}\nJSON 객체만 반환하세요.`;
  const parsed = await geminiJson(request, env, prompt);
  const mantra = typeof parsed?.comfortMantra === 'string' ? parsed.comfortMantra.trim() : '';
  if (mantra) return jsonResponse(request, { comfortMantra: mantra, source: 'model' });
  return jsonResponse(request, { comfortMantra: comfortFor(text, name), source: 'engine' });
}

async function secretMood(request: Request, env: CloudflareGeminiSideEnv, body: Record<string, any>): Promise<Response> {
  const text = String(body.content || '').trim();
  if (!text) return jsonResponse(request, { error: '쪽지 내용이 비어 있습니다.' }, 400);
  const prompt = `비밀 쪽지에 가장 맞는 moodTag를 confession, release, tears, wish, letter, gratitude 중 하나와 reason 한 문장으로 JSON에 적으세요.\n${text.slice(0, 4000)}\nJSON 객체만 반환하세요.`;
  const parsed = await geminiJson(request, env, prompt);
  const matched = MOODS.find((mood) => mood.id === parsed?.moodTag);
  if (matched && typeof parsed?.reason === 'string' && parsed.reason.trim()) {
    return jsonResponse(request, { moodTag: matched.id, moodLabel: matched.label, emoji: matched.emoji, reason: parsed.reason.trim(), source: 'model' });
  }
  const lower = text.toLowerCase();
  let best: (typeof MOODS)[number] = MOODS[0];
  let reason = '진솔한 마음을 담은 고백입니다.';
  if (/눈물|슬프|상처|외로|우울|힘들/.test(lower)) { best = MOODS[2]; reason = '남모르게 홀로 삼켜온 슬픔과 눈물의 온기가 느껴집니다.'; }
  else if (/놓아|비우|미련|용서|정리/.test(lower)) { best = MOODS[1]; reason = '무거운 짐을 내려놓고 마음을 비워내려는 용기가 돋보입니다.'; }
  else if (/소원|소망|꿈|희망/.test(lower)) { best = MOODS[3]; reason = '가슴 깊이 간직한 빛나는 소망과 바람이 담겨 있습니다.'; }
  else if (/감사|고마|축복/.test(lower)) { best = MOODS[5]; reason = '세상을 밝히는 순수한 감사의 파동이 느껴집니다.'; }
  else if (/파랑새|편지|들어줘/.test(lower)) { best = MOODS[4]; reason = '파랑새에게 다정하게 띄워 보내는 마음의 편지입니다.'; }
  return jsonResponse(request, { moodTag: best.id, moodLabel: best.label, emoji: best.emoji, reason, source: 'engine' });
}

export async function handleCloudflareGeminiSideRoute(request: Request, env: CloudflareGeminiSideEnv): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: responseHeaders(request, {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }),
    });
  }
  if (request.method !== 'POST') return jsonResponse(request, { error: 'POST 요청을 사용해 주세요.' }, 405, { Allow: 'POST, OPTIONS' });
  if (overRateLimit(request)) return jsonResponse(request, { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.', code: 'RATE_LIMITED' }, 429, { 'Retry-After': '60' });
  const parsed = await readJsonBody(request);
  if (parsed.tooLarge) return jsonResponse(request, { error: '요청이 너무 큽니다.', code: 'BODY_TOO_LARGE' }, 413);
  if (parsed.invalid || !parsed.body) return jsonResponse(request, { error: '올바른 JSON 요청이 필요합니다.' }, 400);

  const pathname = new URL(request.url).pathname;
  if (pathname === '/api/ai/analyze-entry') return analyzeEntry(request, env, parsed.body);
  if (pathname === '/api/ai/secret-blessing') return secretBlessing(request, env, parsed.body);
  if (pathname === '/api/ai/secret-mood-recommend') return secretMood(request, env, parsed.body);
  return jsonResponse(request, { error: 'Not found' }, 404);
}
