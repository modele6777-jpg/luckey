import { TAROT_READING_VOICE } from '../src/lib/tarotReadingVoice.ts';
import { synthesizeGeminiSpeech } from './api-lib/geminiMedia.ts';
import { getSitesAIConfig } from '../scripts/sites-ai-provider.mjs';
import type { handleTTS } from './api-lib/ttsHandler.ts';
import { stripInternalSpeechDirectives } from '../src/utils/speechText.ts';
import { buildDailyBgmRecipe, renderDailyBgmBytes } from './api-lib/generateDailyBgm.ts';
import { buildVerifiedArtRecommendation, MUSE_ART_CATALOG } from './api-lib/museArtCatalog.ts';
import { handleSitesGeminiChat } from '../scripts/sites-gemini-chat.mjs';
import { SajuInputError, sajuChartFromInput } from './api-lib/sajuChartApi.ts';
export { handleSitesGeminiChat };

type Runtime = Record<string, string | undefined>;
type Fetcher = typeof fetch;
const routes = new Set([
  '/api/ai', '/api/ai/image', '/api/ai/tts', '/api/ai/analyze-entry',
  '/api/ai/daily-bgm', '/api/ai/recommend-art', '/api/ai/daily-tarot', '/api/saju/chart',
  '/api/ai/daily-sedona', '/api/ai/secret-blessing', '/api/ai/secret-mood-recommend',
  '/api/muse/docent', '/api/bluebird/docent', '/api/muse/artwork-image',
  '/api/muse/artwork-image/proxy', '/api/health',
]);
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
class ApiError extends Error { constructor(public status: number, message: string, public retryAfterSeconds?: number, public code?: string, public providerDetails?: { providerCode: string; limitKind?: string; limit?: number }, public diagnosticId?: string) { super(message); } }
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const keyFor = (env: Runtime) => text(env.gemini || env.GEMINI_API_KEY || env.GOOGLE_GENAI_API_KEY);
const required = (value: unknown, label: string, max = 12000) => {
  const result = text(value);
  if (!result) throw new ApiError(400, `${label}을 입력해 주세요.`);
  if (result.length > max) throw new ApiError(413, `${label}이 너무 깁니다. 나누어 요청해 주세요.`);
  return result;
};
const strings = (value: unknown, max = 30): string[] => Array.isArray(value) ? value.filter(v => typeof v === 'string').slice(0, max) : [];
const context = (value: unknown) => JSON.stringify(value ?? {}, (key, item) => {
  if (['avatarUrl', 'photoURL', 'imageUrl', 'dailyArtImageUrl', 'imageData', 'audioContent'].includes(key)) return undefined;
  return typeof item === 'string' && item.startsWith('data:') ? undefined : item;
}).slice(0, 16000);

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}

async function chat(request: Request, env: Runtime, fetchApi: Fetcher, messages: any[], structured = false, maxTokens = 4096) {
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(45000)]);
  let response: Response; let result: any;
  for (let attempt = 0; attempt < 2; attempt++) {
    response = await handleSitesGeminiChat(new Request(new URL('/api/openai/v1/chat/completions', request.url), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
      body: JSON.stringify({ messages, max_tokens: maxTokens, reasoning_effort: 'minimal', ...(structured ? { response_format: { type: 'json_object' } } : {}) }),
    }), env, fetchApi);
    result = await response.json();
    if (attempt === 0 && response.status >= 500 && response.status !== 503 && !signal.aborted) continue;
    break;
  }
  if (signal.aborted) throw new ApiError(504, 'AI 연결 시간이 초과되었습니다. 다시 시도해 주세요.');
  if (!response.ok) throw new ApiError(response.status, text(result.error) || 'AI 요청에 실패했습니다.');
  const answer = text(result.choices?.[0]?.message?.content);
  if (!answer) throw new ApiError(502, 'AI 응답이 비어 있습니다. 다시 시도해 주세요.');
  if (!structured) return answer;
  try { return JSON.parse(answer.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')); }
  catch { throw new ApiError(502, 'AI 응답 형식을 읽지 못했습니다. 다시 시도해 주세요.'); }
}

async function objectReply(request: Request, env: Runtime, fetchApi: Fetcher, instruction: string, input: unknown, fields: string[], maxTokens = 4096) {
  const result = await chat(request, env, fetchApi, [
    { role: 'system', content: `한국어로 답하세요. ${instruction}\nJSON 객체만 반환하세요. 필요한 필드: ${fields.join(', ')}. 각 필드는 비어 있지 않은 문자열입니다.` },
    { role: 'user', content: context(input) },
  ], true, maxTokens);
  if (!result || fields.some(field => !text(result[field]))) throw new ApiError(502, 'AI 응답에 필요한 항목이 없습니다. 다시 시도해 주세요.');
  return result;
}

async function generateMedia(request: Request, env: Runtime, fetchApi: Fetcher, model: string, payload: unknown) {
  const key = keyFor(env);
  if (!key) throw new ApiError(503, 'Gemini API 키가 설정되지 않았습니다.');
  if (!/^[a-zA-Z0-9._-]+$/.test(model)) throw new ApiError(503, '미디어 모델 설정을 확인해 주세요.');
  let response: Response;
  try {
    response = await fetchApi(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(payload), signal: AbortSignal.any([request.signal, AbortSignal.timeout(60000)]),
    });
  } catch { throw new ApiError(504, '미디어 생성 연결 시간이 초과되었습니다. 다시 시도해 주세요.'); }
  if (!response.ok) {
    const status = response.status;
    if (status === 429) {
      let provider: any = null;
      try { provider = await response.json(); } catch (_) {}
      const details = Array.isArray(provider?.error?.details) ? provider.error.details : [];
      const retry = details.find((item: any) => String(item?.['@type'] || '').endsWith('RetryInfo'));
      const duration = /^([0-9]+(?:\.[0-9]+)?)s$/.exec(String(retry?.retryDelay || ''));
      const header = response.headers.get('Retry-After');
      const seconds = header && /^\d+(?:\.\d+)?$/.test(header) ? Number(header)
        : header && Number.isFinite(Date.parse(header)) ? (Date.parse(header) - Date.now()) / 1000
        : duration ? Number(duration[1]) : 15;
      const violations = details.flatMap((item: any) => Array.isArray(item?.violations) ? item.violations : []);
      const isDailyViolation = violations.some((item: any) => /per.?day|daily/i.test(String(item?.quotaId || item?.quotaMetric || item?.description || '')) || String(item?.quotaValue) === '0');
      const isDailyExhausted = /per.?day|daily/i.test(String(provider?.error?.message || ''));
      const exhausted = !retry && (isDailyViolation || isDailyExhausted);
      if (exhausted) throw new ApiError(429, 'AI 제공자의 사용 한도가 소진되었습니다. API 결제·한도 설정 확인이 필요합니다.', undefined, 'MEDIA_QUOTA_EXHAUSTED');
      const retryAfter = Math.max(1, Math.min(86400, Math.ceil(seconds)));
      throw new ApiError(429, `AI 생성 요청이 일시적으로 제한됐습니다. 약 ${retryAfter}초 뒤 다시 눌러 주세요.`, retryAfter, 'MEDIA_RATE_LIMIT');
    }
    await response.body?.cancel();
    throw new ApiError([400, 401, 403, 404, 429].includes(status) ? status : 502,
      status === 429 ? '미디어 생성 사용 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.'
        : status === 401 || status === 403 ? 'Gemini 미디어 모델 사용 권한을 확인해 주세요.'
        : status === 404 ? '설정된 미디어 모델을 사용할 수 없습니다.' : '미디어를 생성하지 못했습니다. 다시 시도해 주세요.');
  }
  const data = await response.json() as any;
  const parts = data.candidates?.[0]?.content?.parts;
  const media = Array.isArray(parts) ? parts.find(part => part.inlineData?.data)?.inlineData : null;
  if (!media) throw new ApiError(502, '미디어 응답이 비어 있습니다. 요청 내용을 바꾸어 다시 시도해 주세요.');
  return media;
}

async function makeImage(request: Request, env: Runtime, fetchApi: Fetcher, prompt: string, aspect: unknown) {
  const aspectRatio = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9'].includes(String(aspect)) ? String(aspect) : '1:1';
  const media = await generateMedia(request, env, fetchApi, env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-lite-image', {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio } },
  });
  if (!/^image\/(png|jpeg|webp)$/.test(media.mimeType)) throw new ApiError(502, '이미지 형식을 확인하지 못했습니다.');
  return `data:${media.mimeType};base64,${media.data}`;
}

const imageHosts = ['wikimedia.org', 'wikipedia.org', 'gstatic.com', 'googleusercontent.com', 'dailyartmagazine.com', 'artic.edu', 'metmuseum.org'];
export function allowedArtworkUrl(raw: unknown): URL | null {
  try {
    const url = new URL(text(raw));
    if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) return null;
    return imageHosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`)) ? url : null;
  } catch { return null; }
}

async function proxyImage(request: Request, fetchApi: Fetcher) {
  let url = allowedArtworkUrl(new URL(request.url).searchParams.get('url'));
  if (!url) throw new ApiError(400, '지원되는 작품 이미지 주소를 사용해 주세요.');
  for (let redirects = 0; redirects <= 3; redirects++) {
    let response: Response;
    try { response = await fetchApi(url.href, { redirect: 'manual', headers: { Accept: 'image/*', 'User-Agent': 'LucKey/1.0 (artwork viewer)' }, signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]) }); }
    catch { throw new ApiError(502, '작품 이미지 서버에 연결하지 못했습니다.'); }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('Location');
      await response.body?.cancel();
      url = location ? allowedArtworkUrl(new URL(location, url).href) : null;
      if (!url) throw new ApiError(400, '작품 이미지의 이동 주소를 허용할 수 없습니다.');
      continue;
    }
    const mime = response.headers.get('Content-Type')?.split(';')[0] || '';
    if (!response.ok || !/^image\/(jpeg|png|webp|gif)$/.test(mime)) {
      await response.body?.cancel(); throw new ApiError(502, '원본 작품 이미지를 불러오지 못했습니다.');
    }
    if (Number(response.headers.get('Content-Length')) > 8 * 1024 * 1024) { await response.body?.cancel(); throw new ApiError(413, '작품 이미지가 너무 큽니다.'); }
    const reader = response.body?.getReader();
    if (!reader) throw new ApiError(502, '작품 이미지가 비어 있습니다.');
    const chunks: Uint8Array[] = []; let size = 0;
    try {
      while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 8 * 1024 * 1024) { await reader.cancel(); throw new ApiError(413, '작품 이미지가 너무 큽니다.'); } chunks.push(part.value); }
    } finally { reader.releaseLock(); }
    if (!size) throw new ApiError(502, '작품 이미지가 비어 있습니다.');
    return new Response(new Blob(chunks as BlobPart[]), { headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
  }
  throw new ApiError(502, '작품 이미지의 이동 횟수가 너무 많습니다.');
}

export async function handleSitesApi(request: Request, env: Runtime, fetchApi: Fetcher = fetch, synthesize?: typeof handleTTS): Promise<Response | null> {
  const route = new URL(request.url).pathname;
  if (!routes.has(route)) return null;
  const method = route === '/api/health' || route.endsWith('/proxy') ? 'GET' : 'POST';
  if (request.method !== method) return Response.json({ error: `${method} 요청을 사용해 주세요.` }, { status: 405, headers: { Allow: method, 'Cache-Control': 'no-store' } });
  try {
    // TTS는 무료·무제한 Edge TTS로 전면 교체되어 API 키가 전혀 필요 없습니다.
    if (route === '/api/health') return json({ status: 'ok', aiConfigured: Boolean(getSitesAIConfig(env).key), provider: getSitesAIConfig(env).provider, speechConfigured: Boolean(getSitesAIConfig(env).key), speechProvider: 'gemini', runtime: 'sites' });
    if (route.endsWith('/proxy')) return await proxyImage(request, fetchApi);
    const limit = 8 * 1024 * 1024;
    if (Number(request.headers.get('Content-Length')) > limit) throw new ApiError(413, '요청이 너무 큽니다.');
    const reader = request.body?.getReader();
    const decoder = new TextDecoder(); let raw = ''; let size = 0;
    if (reader) {
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break;
          size += chunk.value.length;
          if (size > limit) { await reader.cancel(); throw new ApiError(413, '요청이 너무 큽니다.'); }
          raw += decoder.decode(chunk.value, { stream: true });
        }
        raw += decoder.decode();
      } finally { reader.releaseLock(); }
    }
    let body: any;
    try { body = JSON.parse(raw); } catch { throw new ApiError(400, '올바른 JSON 요청이 필요합니다.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new ApiError(400, '요청 내용을 확인해 주세요.');
    if (route === '/api/saju/chart') {
      try { return json(sajuChartFromInput(body)); }
      catch (error) { throw new ApiError(error instanceof SajuInputError ? error.status : 400, error instanceof Error ? error.message : '사주 계산에 실패했습니다.', undefined, error instanceof SajuInputError ? error.code : undefined); }
    }
    if (route === '/api/ai/daily-bgm') {
      const input = { ...body, focusPlaylist: required(body.focusPlaylist, '재생 목록', 1000), dateKey: required(body.dateKey, '날짜', 40), trackKey: required(body.trackKey, '트랙', 300) };
      const bytes = renderDailyBgmBytes(buildDailyBgmRecipe(input), 48, 22050);
      return json({ audioContent: bytesToBase64(bytes), encoding: 'wav', sampleRate: 22050, durationSec: 48, trackKey: input.trackKey });
    }
    if (route === '/api/ai/tts') {
      const speech = required(stripInternalSpeechDirectives(required(body.text, '낭독할 문장', 4000)), '낭독할 문장', 4000);
      if (!synthesize) {
        try { return json(await synthesizeGeminiSpeech(speech, body.voice, env, fetchApi, request.signal)); }
        catch (error: any) { throw new ApiError(error.status || 502, error.message || 'Gemini 음성 생성에 실패했습니다.'); }
      }

      try {
        return json(await synthesize({ text: speech, voice: body.voice, requestId: request.headers.get('x-vercel-id') || undefined }));
      } catch (edgeError) {
        const failure = edgeError as { status?: number; code?: string; retryAfterSeconds?: number; diagnosticId?: string };
        if (request.signal.aborted) throw new ApiError(504, '음성 생성 요청이 취소되었습니다. 다시 눌러 주세요.', undefined, 'TTS_TIMEOUT', undefined, failure?.diagnosticId);
        const suppliedStatus = Number(failure?.status);
        const status = Number.isInteger(suppliedStatus) && suppliedStatus >= 400 && suppliedStatus <= 599 ? suppliedStatus : 502;
        throw new ApiError(status, edgeError instanceof Error ? edgeError.message : '음성 생성에 일시적인 오류가 발생했습니다. 잠시 후 다시 눌러 주세요.', failure?.retryAfterSeconds, failure?.code || 'TTS_PROVIDER_UNAVAILABLE', undefined, failure?.diagnosticId);
      }
    }
    if (route === '/api/ai/image') return json({ imageUrl: await makeImage(request, env, fetchApi, required(body.prompt, '이미지 설명', 8000), body.aspectRatio) });
    if (route === '/api/muse/artwork-image') {
      const title = required(body.title, '작품 제목', 1000);
      const match = MUSE_ART_CATALOG.find(entry => [entry.title, entry.titleOriginal].some(name => name.toLowerCase() === title.toLowerCase()) && (!body.creator || [entry.creator, entry.creatorOriginal].some(name => name.toLowerCase() === text(body.creator).toLowerCase())));
      const source = allowedArtworkUrl(body.dailyArtImageUrl) || allowedArtworkUrl(match?.imageUrl);
      if (source && !body.forcePollinations) {
        const origin = source.hostname.endsWith('wikimedia.org') ? 'wikimedia' : source.hostname.endsWith('wikipedia.org') ? 'wikipedia' : source.hostname.endsWith('artic.edu') ? 'artic' : source.hostname.endsWith('metmuseum.org') ? 'met' : source.hostname.endsWith('dailyartmagazine.com') ? 'dailyart' : 'google';
        return json({ url: source.href, displayUrl: `/api/muse/artwork-image/proxy?url=${encodeURIComponent(source.href)}`, source: origin });
      }
      const url = await makeImage(request, env, fetchApi, `Create an artistic reinterpretation, not an authenticated original. Artwork context: ${context(body)}.`, '4:3');
      return json({ url, displayUrl: url, source: 'ai_replica' });
    }
    if (route === '/api/ai/recommend-art') {
      const dateKey = text(body.dateKey) || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
      const base = buildVerifiedArtRecommendation(dateKey, text(body.currentMood), text(body.moodId), Number(body.randomOffset) || 0, strings(body.excludeCatalogIds), strings(body.excludePoemTitles), strings(body.excludeSongTitles));
      const result = await objectReply(request, env, fetchApi, '제공된 실제 작품·시·음악 정보는 변경하지 말고 사용자의 마음에 맞는 추천 이유와 오늘 실천할 두 가지 짧은 감상 활동을 설명하세요. challenges는 두 문장을 담은 문자열 배열입니다.', { artwork: base, userConcern: body.userConcern, userContext: body.userContext }, ['whyRecommended'], 1024);
      const challenges = Array.isArray(result.challenges) ? strings(result.challenges, 2) : text(result.challenges).split('\n').filter(Boolean).slice(0, 2);
      if (challenges.length !== 2) throw new ApiError(502, '추천 활동을 완성하지 못했습니다. 다시 시도해 주세요.');
      return json({ ...base, whyRecommended: result.whyRecommended, challenges, generationSource: 'gemini' });
    }
    if (route === '/api/ai/analyze-entry') {
      const content = text(body.content) || text(body.title);
      if (!content) return json({ keywords: [], emotions: [] });
      const result = await chat(request, env, fetchApi, [{ role: 'system', content: '기록의 키워드 3~5개와 감정 태그 1~3개를 한국어로 분석하세요. 진단이나 사실 확정은 하지 마세요. JSON 형식: {"keywords":["키워드"],"emotions":["감정"]}.' }, { role: 'user', content: context({ title: body.title, content, type: body.type }) }], true, 768);
      if (!Array.isArray(result?.keywords) || !Array.isArray(result?.emotions)) throw new ApiError(502, '기록 분석 형식이 올바르지 않습니다.');
      return json({ keywords: strings(result.keywords, 5), emotions: strings(result.emotions, 3) });
    }
    if (route === '/api/ai/daily-tarot' || route === '/api/ai/daily-sedona') {
      if (!body.card || typeof body.card !== 'object' || Array.isArray(body.card)) throw new ApiError(400, '선택한 카드 정보가 필요합니다.');
      const sedona = route.endsWith('sedona');
      const fields = ['diagnosis', 'luckyNumber', 'luckyColor', 'remedy', 'symbol', 'spiritualEnergy', 'blessingMessage', 'focusPlaylist'];
      const result = await objectReply(request, env, fetchApi,
        sedona ? '선택한 카드와 테마를 중심으로 감정을 허용하고 놓아버리는 세도나 질문, 차분한 확언과 구체적인 실천을 안내하세요. 의학적 진단이나 치유 보장은 하지 마세요.'
          : `선택한 카드의 정역방향과 고유 의미를 오늘의 상황에 연결하세요. diagnosis는 1. 오늘의 첫 인상, 2. 카드가 들려주는 이야기, 3. 주의할 점, 4. 오늘 해볼 한 가지, 5. 생각해 볼 질문의 다섯 마크다운 절로 나누되 첫인상·주의점·행동·질문은 각각 1~2문장만 쓰세요. 2번 절에서만 해석의 근거를 충분히 풀고 다른 절은 같은 뜻을 반복하지 마세요. ${TAROT_READING_VOICE}`,
        body, fields);
      return json(Object.fromEntries(fields.map(field => [field, result[field]])));
    }
    if (route === '/api/ai/secret-blessing') {
      required(body.content, '쪽지 내용');
      return json(await objectReply(request, env, fetchApi, '쪽지의 구체적인 상황에 공감하는 따뜻한 한국어 위로 1~2문장을 comfortMantra로 작성하세요.', body, ['comfortMantra'], 384));
    }
    if (route === '/api/ai/secret-mood-recommend') {
      required(body.content, '쪽지 내용');
      const tags = { confession: ['밤의 고백', '🌙'], release: ['놓아주는 마음', '🕊️'], tears: ['남모를 눈물', '💧'], wish: ['숨겨둔 소망', '✨'], letter: ['파랑새에게 부치는 편지', '✉️'], gratitude: ['비밀 감사', '🤍'] };
      const result = await objectReply(request, env, fetchApi, `쪽지에 맞는 감정 태그를 ${Object.keys(tags).join(', ')} 중 하나만 고르고 이유를 한 문장으로 쓰세요.`, body, ['moodTag', 'reason'], 384);
      if (!Object.hasOwn(tags, result.moodTag)) throw new ApiError(502, '감정 태그 형식을 확인하지 못했습니다.');
      return json({ ...result, moodLabel: tags[result.moodTag][0], emoji: tags[result.moodTag][1] });
    }
    if (route.endsWith('/docent')) {
      required(body.title, '작품 제목', 1000);
      const history = Array.isArray(body.messages) ? body.messages.filter(message => message && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string').slice(-20).map(({ role, content }) => ({ role, content })) : [];
      const input: any[] = [{ type: 'text', text: `작품 정보와 사용자 맥락: ${context({ ...body, imageUrl: undefined, messages: undefined })}` }];
      const image = text(body.imageUrl);
      if (image && (image.startsWith('data:image/') || allowedArtworkUrl(image))) input.push({ type: 'image_url', image_url: { url: image } });
      const reply = await chat(request, env, fetchApi, [
        { role: 'system', content: `당신은 ${route.includes('/muse/') ? '품위 있고 차분한 미술관 수석 도슨트 뮤즈' : '따뜻하고 공감적인 예술 도슨트 루미'}입니다. 제공된 작품·작가·음악·시 정보를 우선하고 확인되지 않은 사실은 만들지 마세요. 시 인용은 짧게 하세요. 한국어로 답하고 후속 질문에도 작품 맥락을 유지하세요.${body.mode === 'audio' ? ' 음성 낭독용 한국어 본문 600자 안팎으로 쓰며 마크다운·제목·지시문은 제외하세요.' : ''}` },
        { role: 'user', content: input }, ...history,
      ]);
      return json({ reply });
    }
    // Legacy generic text API uses the same private Gemini connection.
    const prompt = text(body.prompt);
    const messages = Array.isArray(body.messages) && body.messages.length ? [...body.messages] : [{ role: 'user', content: required(prompt, '질문') }];
    if (text(body.systemInstruction)) messages.unshift({ role: 'system', content: text(body.systemInstruction) });
    if (body.imageData) {
      if (!/^image\/(png|jpeg|webp)$/.test(text(body.mimeType))) throw new ApiError(400, '지원되는 이미지 형식을 사용해 주세요.');
      messages.push({ role: 'user', content: [{ type: 'text', text: prompt || '이미지를 설명해 주세요.' }, { type: 'image_url', image_url: { url: `data:${body.mimeType};base64,${body.imageData}` } }] });
    }
    if (body.responseSchema) messages.unshift({ role: 'system', content: `JSON 객체만 반환하세요. 요청한 스키마: ${context(body.responseSchema)}` });
    const answer = await chat(request, env, fetchApi, messages, Boolean(body.responseSchema));
    return json({ text: typeof answer === 'string' ? answer : JSON.stringify(answer) });
  } catch (error) {
    if (error instanceof ApiError) {
      const response = json({ error: error.message, ...error.providerDetails, ...(error.code ? { code: error.code } : {}), ...(error.retryAfterSeconds ? { retryAfterSeconds: error.retryAfterSeconds } : {}) }, error.status);
      if (error.retryAfterSeconds) response.headers.set('Retry-After', String(error.retryAfterSeconds));
      if (error.diagnosticId) {
        response.headers.set('X-TTS-Diagnostic-ID', error.diagnosticId);
        return Response.json({ error: error.message, ...error.providerDetails, ...(error.code ? { code: error.code } : {}), ...(error.retryAfterSeconds ? { retryAfterSeconds: error.retryAfterSeconds } : {}), diagnosticId: error.diagnosticId }, { status: error.status, headers: response.headers });
      }
      return response;
    }
    return json({ error: '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, 502);
  }
}
