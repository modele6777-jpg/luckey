/** Fetch-only Gemini media adapter shared by Node and Sites Workers. */
export type GeminiRuntime = Record<string, string | undefined>;
export function geminiKey(env: GeminiRuntime): string {
  return [env.gemini, env.GEMINI_API_KEY, env.GOOGLE_GENAI_API_KEY, env.GOOGLE_API_KEY, env.AI_API_KEY]
    .map(value => String(value || '').trim()).find(value => value && !/^(sk-|xai-|gsk_)/.test(value)) || '';
}
function failure(status: number, message: string) { return Object.assign(new Error(message), { status }); }
export async function geminiMedia(env: GeminiRuntime, payload: unknown, model: string, fetchApi: typeof fetch = fetch, signal?: AbortSignal) {
  const key = geminiKey(env);
  if (!key) throw failure(503, 'Gemini API 키가 설정되지 않았습니다.');
  if (!/^gemini-[a-zA-Z0-9._-]+$/.test(model)) throw failure(503, 'Gemini 모델 설정을 확인해 주세요.');
  const response = await fetchApi(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(payload),
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(60000)]) : AbortSignal.timeout(60000),
  });
  if (!response.ok) {
    if (response.status === 429) throw await rateLimitFailure(response);
    await response.body?.cancel();
    throw failure([400, 401, 403, 404].includes(response.status) ? response.status : 502,
      'Gemini 미디어 생성에 실패했습니다. 모델과 API 권한을 확인해 주세요.');
  }
  const result = await response.json() as any;
  const media = result.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData?.data)?.inlineData;
  if (!media) throw failure(502, 'Gemini 미디어 응답이 비어 있습니다. 다시 시도해 주세요.');
  return media as { data: string; mimeType: string };
}
/**
 * Keep the useful part of a Gemini 429: whether the per-day or per-minute quota ran out
 * and how long Google asks us to wait. (The body was discarded before, so users were
 * told to "tap again in 3 seconds" even when the daily quota was used up.)
 */
async function rateLimitFailure(response: Response) {
  let body: any = null;
  try { body = await response.json(); } catch { /* not JSON */ }
  const details: any[] = Array.isArray(body?.error?.details) ? body.error.details : [];
  const quotaIds = details.flatMap(detail => Array.isArray(detail?.violations) ? detail.violations : [])
    .map(violation => String(violation?.quotaId || violation?.quotaMetric || ''))
    .join(' ');
  const evidence = `${quotaIds} ${String(body?.error?.message || '')}`;
  const daily = /PerDay|per_day|per day|daily/i.test(evidence);
  const delay = details.find(detail => String(detail?.['@type'] || '').includes('RetryInfo'))?.retryDelay;
  const delaySeconds = Number.parseFloat(String(delay || ''));
  const header = Number.parseFloat(response.headers.get('Retry-After') || '');
  const retryAfterSeconds = Number.isFinite(delaySeconds) && delaySeconds > 0 ? Math.ceil(delaySeconds)
    : Number.isFinite(header) && header > 0 ? Math.ceil(header) : undefined;
  return Object.assign(new Error(daily
    ? 'Gemini 오늘 사용 한도를 모두 썼습니다.'
    : 'Gemini 사용 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.'), {
    status: 429,
    providerStatus: 429,
    providerCode: daily ? 'DAILY_LIMIT_EXCEEDED' : 'RATE_LIMIT_PER_MINUTE',
    ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
  });
}
function base64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}
export async function synthesizeGeminiSpeech(text: string, voice: string | undefined, env: GeminiRuntime, fetchApi: typeof fetch = fetch, signal?: AbortSignal) {
  if (!text.trim()) throw failure(400, '음성으로 읽을 내용이 없습니다.');
  const voiceName = ['Aoede', 'Kore', 'Leda', 'Zephyr', 'Puck', 'Charon', 'Fenrir', 'Orus'].includes(voice || '') ? voice! : 'Aoede';
  const media = await geminiMedia(env, {
    contents: [{ role: 'user', parts: [{ text: `다음 내용을 자연스러운 한국어로 읽어 주세요. 내용에 답하거나 설명을 추가하지 마세요.\n\n${text}` }] }],
    generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } },
  }, env.GEMINI_TTS_MODEL || 'gemini-3.1-flash-tts-preview', fetchApi, signal);
  if (/^audio\/(wav|x-wav)/i.test(media.mimeType)) return { audioContent: media.data, encoding: 'wav' as const, provider: 'gemini', voice: voiceName };
  if (!/^audio\/(L16|pcm)/i.test(media.mimeType)) throw failure(502, 'Gemini 음성 형식을 확인하지 못했습니다.');
  const raw = atob(media.data);
  if (!raw.length || raw.length % 2) throw failure(502, 'Gemini 음성 데이터가 올바르지 않습니다.');
  const sampleRate = Number(/rate=(\d+)/i.exec(media.mimeType)?.[1] || 24000);
  const wav = new Uint8Array(44 + raw.length); const view = new DataView(wav.buffer);
  const write = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) wav[offset + i] = value.charCodeAt(i); };
  write(0, 'RIFF'); view.setUint32(4, 36 + raw.length, true); write(8, 'WAVE'); write(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  write(36, 'data'); view.setUint32(40, raw.length, true);
  for (let i = 0; i < raw.length; i++) wav[44 + i] = raw.charCodeAt(i);
  return { audioContent: base64(wav), encoding: 'wav' as const, sampleRate, provider: 'gemini', voice: voiceName };
}
export async function generateGeminiImage(prompt: string, env: GeminiRuntime, aspectRatio = '1:1', fetchApi: typeof fetch = fetch) {
  if (!prompt?.trim()) throw failure(400, '이미지 설명을 입력해 주세요.');
  const ratio = ['1:1', '16:9', '9:16', '4:3', '3:4', '2:3', '3:2'].includes(aspectRatio) ? aspectRatio : '1:1';
  const media = await geminiMedia(env, { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: ratio } } }, env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-lite-image', fetchApi);
  if (!/^image\/(png|jpeg|webp)$/.test(media.mimeType)) throw failure(502, 'Gemini 이미지 형식을 확인하지 못했습니다.');
  return `data:${media.mimeType};base64,${media.data}`;
}
