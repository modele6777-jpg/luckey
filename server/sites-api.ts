import { getSitesAIConfig, describeOpenAIFailure } from '../scripts/sites-ai-provider.mjs';
import { stripInternalSpeechDirectives } from '../src/utils/speechText';
import { buildDailyBgmRecipe, renderDailyBgmBytes } from './api-lib/generateDailyBgm';
import { buildVerifiedArtRecommendation, MUSE_ART_CATALOG } from './api-lib/museArtCatalog';
import { handleSitesGeminiChat } from '../scripts/sites-gemini-chat.mjs';
export { handleSitesGeminiChat };

type Runtime = Record<string, string | undefined>;
type Fetcher = typeof fetch;
const routes = new Set([
  '/api/ai', '/api/ai/image', '/api/ai/tts', '/api/ai/analyze-entry',
  '/api/ai/daily-bgm', '/api/ai/recommend-art', '/api/ai/daily-tarot',
  '/api/ai/daily-sedona', '/api/ai/secret-blessing', '/api/ai/secret-mood-recommend',
  '/api/muse/docent', '/api/bluebird/docent', '/api/muse/artwork-image',
  '/api/muse/artwork-image/proxy', '/api/health',
]);
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
class ApiError extends Error { constructor(public status: number, message: string, public retryAfterSeconds?: number, public code?: string, public providerDetails?: { providerCode: string; limitKind?: string; limit?: number }) { super(message); } }
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

export function pcmToWav(base64: string, sampleRate: number): Uint8Array {
  const pcm = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
  if (!pcm.length || pcm.length % 2 || !Number.isFinite(sampleRate) || sampleRate < 8000 || sampleRate > 96000) throw new ApiError(502, '음성 데이터를 확인하지 못했습니다.');
  const wav = new Uint8Array(44 + pcm.length);
  const view = new DataView(wav.buffer);
  for (const [offset, word] of [[0, 'RIFF'], [8, 'WAVE'], [12, 'fmt '], [36, 'data']] as const) for (let i = 0; i < word.length; i++) wav[offset + i] = word.charCodeAt(i);
  view.setUint32(4, 36 + pcm.length, true); view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); view.setUint32(40, pcm.length, true);
  wav.set(pcm, 44); return wav;
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

export async function handleSitesApi(request: Request, env: Runtime, fetchApi: Fetcher = fetch): Promise<Response | null> {
  const route = new URL(request.url).pathname;
  if (!routes.has(route)) return null;
  const method = route === '/api/health' || route.endsWith('/proxy') ? 'GET' : 'POST';
  if (request.method !== method) return Response.json({ error: `${method} 요청을 사용해 주세요.` }, { status: 405, headers: { Allow: method, 'Cache-Control': 'no-store' } });
  try {
    if (route === '/api/health') return json({ status: 'ok', aiConfigured: Boolean(getSitesAIConfig(env).key), provider: getSitesAIConfig(env).provider, speechConfigured: Boolean(getSitesAIConfig(env).key), runtime: 'sites' });
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
    if (route === '/api/ai/daily-bgm') {
      const input = { ...body, focusPlaylist: required(body.focusPlaylist, '재생 목록', 1000), dateKey: required(body.dateKey, '날짜', 40), trackKey: required(body.trackKey, '트랙', 300) };
      const bytes = renderDailyBgmBytes(buildDailyBgmRecipe(input), 48, 22050);
      return json({ audioContent: bytesToBase64(bytes), encoding: 'wav', sampleRate: 22050, durationSec: 48, trackKey: input.trackKey });
    }
    if (route === '/api/ai/tts') {
      const speech = required(stripInternalSpeechDirectives(required(body.text, '낭독할 문장', 4000)), '낭독할 문장', 4000);
      const voice = ['Kore', 'Aoede', 'Puck', 'Charon', 'Fenrir', 'Leda', 'Zephyr'].includes(body.voice) ? body.voice : 'Kore';
      const config = getSitesAIConfig(env);
      if (!config.key) throw new ApiError(503, 'AI 음성 API 키가 설정되지 않았습니다.', undefined, 'TTS_NOT_CONFIGURED');
      if (config.provider === 'openai') {
        if (!config.key) throw new ApiError(503, 'OpenAI API 키가 설정되지 않았습니다.');
        const male = voice === 'Charon';
        const openaiVoice = male ? 'cedar' : 'marin';
        let audio: Response;
        try {
          audio = await fetchApi('https://api.openai.com/v1/audio/speech', {
            method: 'POST', headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts', voice: openaiVoice, input: speech, response_format: 'mp3', instructions: 'Read the input text exactly as written in natural, warm Korean. Do not add explanations, answer questions, or read these instructions aloud.' }),
            signal: AbortSignal.any([request.signal, AbortSignal.timeout(60000)]),
          });
        } catch { throw new ApiError(504, 'OpenAI 음성 생성 연결이 중단되었습니다. 다시 눌러 주세요.'); }
        if (!audio.ok) {
          let failure: any = null;
          try { failure = await audio.json(); } catch (_) {}
          const diagnosis = describeOpenAIFailure(audio, failure);
          const details = { providerCode: diagnosis.code, ...(diagnosis.kind ? { limitKind: diagnosis.kind } : {}), ...(diagnosis.limit !== undefined ? { limit: diagnosis.limit } : {}) };
          if (audio.status === 429 && (diagnosis.quota || diagnosis.zeroLimit)) throw new ApiError(429, 'OpenAI API 잔액 또는 프로젝트 사용 한도를 확인해 주세요.', undefined, 'MEDIA_QUOTA_EXHAUSTED', details);
          if (audio.status === 429) throw new ApiError(429, 'OpenAI 음성 요청이 일시적으로 제한됐습니다. 잠시 후 다시 눌러 주세요.', diagnosis.retryAfterSeconds, 'MEDIA_RATE_LIMIT', details);
          if ([401, 403].includes(audio.status)) throw new ApiError(audio.status, 'OpenAI 키의 음성 생성 권한을 확인해 주세요.');
          if ([400, 404].includes(audio.status)) throw new ApiError(audio.status, 'OpenAI 음성 모델 또는 요청 설정을 확인해 주세요.');
          throw new ApiError(502, 'OpenAI 음성 생성에 일시적인 오류가 발생했습니다.');
        }
        const bytes = new Uint8Array(await audio.arrayBuffer());
        if (bytes.length < 4) throw new ApiError(502, 'OpenAI 음성 응답이 비어 있습니다.');
        return json({ audioContent: bytesToBase64(bytes), encoding: 'mp3', sampleRate: 24000, voice, provider: 'openai' });
      }
      const candidateModels = Array.from(new Set([
        env.GEMINI_TTS_MODEL,
        'gemini-3.8-flash-lite-tts',
        'gemini-3.1-flash-tts-preview',
        'gemini-3.8-flash-tts',
      ].filter(Boolean))) as string[];
      let media: any;
      let lastErr: any;
      for (const model of candidateModels) {
        try {
          media = await generateMedia(request, env, fetchApi, model, {
            // Pass only the utterance: instructions in the text part can themselves be spoken.
            contents: [{ parts: [{ text: speech }] }],
            generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
          });
          if (media) break;
        } catch (err: any) {
          lastErr = err;
          // If transient short rate-limit with small Retry-After (<= 60s), do not burn candidate quota
          if (err?.retryAfterSeconds && err.retryAfterSeconds <= 60 && err?.code === 'MEDIA_RATE_LIMIT') {
            throw err;
          }
          // Otherwise (daily quota exhaustion, long wait, model 404/503), try next available TTS model
          continue;
        }
      }
      if (!media) throw lastErr || new ApiError(502, '미디어를 생성하지 못했습니다.');
      if (/^audio\/(?:x-)?wav(?:;|$)/i.test(media.mimeType)) {
        const wav = Uint8Array.from(atob(media.data), char => char.charCodeAt(0));
        const signature = (offset: number, length: number) => String.fromCharCode(...wav.subarray(offset, offset + length));
        if (wav.length < 44 || signature(0, 4) !== 'RIFF' || signature(8, 4) !== 'WAVE') throw new ApiError(502, 'WAV 음성 데이터를 확인하지 못했습니다.');
        const view = new DataView(wav.buffer);
        const sampleRate = view.getUint32(24, true);
        if (sampleRate < 8000 || sampleRate > 96000) throw new ApiError(502, '음성 샘플 주파수를 확인하지 못했습니다.');
        // Newer TTS models already return a WAV container; never wrap its header as PCM.
        return json({ audioContent: media.data, encoding: 'wav', sampleRate, voice });
      }
      if (!/^audio\/(L16|pcm)/i.test(media.mimeType)) throw new ApiError(502, '음성 형식을 확인하지 못했습니다.');
      const sampleRate = Number(/rate=(\d+)/i.exec(media.mimeType)?.[1] || 24000);
      return json({ audioContent: bytesToBase64(pcmToWav(media.data, sampleRate)), encoding: 'wav', sampleRate, voice });
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
      const result = await objectReply(request, env, fetchApi,
        sedona ? '선택한 카드와 테마를 중심으로 감정을 허용하고 놓아버리는 세도나 질문, 차분한 확언과 구체적인 실천을 안내하세요. 의학적 진단이나 치유 보장은 하지 마세요.'
          : '선택한 카드의 정역 방향과 고유 상징을 중심으로 오늘의 타로 리딩을 작성하세요. diagnosis에는 최상단 핵심 3줄 요약과 중복 없는 다섯 개의 마크다운 절을 포함하세요. 미래나 운세를 사실로 확정하지 말고 성찰과 실천을 돕는 관점으로 쓰세요.',
        body, ['diagnosis', 'luckyNumber', 'luckyColor', 'remedy', 'symbol', 'frequency', 'spiritualEnergy', 'blessingMessage', 'focusPlaylist']);
      return json(result);
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
      return response;
    }
    return json({ error: '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, 502);
  }
}
