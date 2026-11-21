/**
 * Google Cloud Text-to-Speech · Chirp 3 HD (Korean).
 * Fetch-only so it runs on the Node server and on Sites Workers.
 *
 * Chirp 3 HD voices share their names with the Gemini voices the app already uses
 * (Aoede, Kore, Charon, ...), so Lucy keeps the same character: `ko-KR-Chirp3-HD-<name>`.
 * Key: GOOGLE_CLOUD_TTS_API_KEY, or the existing Google/Gemini API key when the
 * Text-to-Speech API is enabled on that key's project.
 */
import { getServiceAccountToken, readServiceAccount } from './googleServiceAccount.ts';

export type CloudTtsRuntime = Record<string, string | undefined>;

const CHIRP_VOICES = ['Aoede', 'Kore', 'Leda', 'Zephyr', 'Puck', 'Charon', 'Fenrir', 'Orus'];
/** Cloud TTS accepts at most 5000 bytes per request; Korean is ~3 bytes a character. */
const MAX_REQUEST_CHARS = 1400;

export function cloudTtsKey(env: CloudTtsRuntime): string {
  return [env.GOOGLE_CLOUD_TTS_API_KEY, env.gemini, env.GEMINI_API_KEY, env.GOOGLE_GENAI_API_KEY, env.GOOGLE_API_KEY]
    .map(value => String(value || '').trim().replace(/^['"]|['"]$/g, ''))
    .find(value => value && !/^(sk-|xai-|gsk_)/.test(value)) || '';
}

/** Which setting supplies the Cloud TTS key (the name only, never the value). */
export function cloudTtsKeySource(env: CloudTtsRuntime): string {
  const names = ['GOOGLE_CLOUD_TTS_API_KEY', 'gemini', 'GEMINI_API_KEY', 'GOOGLE_GENAI_API_KEY', 'GOOGLE_API_KEY'] as const;
  for (const name of names) {
    const value = String(env[name] || '').trim().replace(/^['"]|['"]$/g, '');
    if (value && !/^(sk-|xai-|gsk_)/.test(value)) return name;
  }
  return 'none';
}

export function chirpVoiceName(voice?: string): string {
  const name = CHIRP_VOICES.includes(String(voice || '')) ? String(voice) : 'Aoede';
  return `ko-KR-Chirp3-HD-${name}`;
}

/** Split long text on sentence ends (then spaces) so every request stays under the byte limit. */
export function splitForCloudTts(text: string, max = MAX_REQUEST_CHARS): string[] {
  const parts: string[] = [];
  let rest = text.trim();
  while (rest.length > max) {
    const window = rest.slice(0, max);
    const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '), window.lastIndexOf('! '), window.lastIndexOf('\n'));
    const space = window.lastIndexOf(' ');
    const cut = sentenceEnd > max / 2 ? sentenceEnd + 1 : space > max / 2 ? space : max;
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

function failure(status: number, message: string, extra: Record<string, unknown> = {}) {
  return Object.assign(new Error(message), { status, ...extra });
}

function decode(base64: string): Uint8Array {
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}

export async function synthesizeChirpSpeech(text: string, voice: string | undefined, env: CloudTtsRuntime, fetchApi: typeof fetch = fetch, signal?: AbortSignal) {
  const speech = String(text || '').trim();
  if (!speech) throw failure(400, '음성으로 읽을 내용이 없습니다.');
  const key = cloudTtsKey(env);
  if (!key) throw failure(503, 'Google Cloud TTS 키가 설정되지 않았습니다.', { code: 'TTS_NOT_CONFIGURED' });
  const name = chirpVoiceName(voice);
  const pieces: Uint8Array[] = [];
  for (const piece of splitForCloudTts(speech)) {
    // Cloud TTS documents API keys as the `key` query parameter (the header form was refused
    // with 401 CREDENTIALS_MISSING on the deployed server).
    const response = await fetchApi(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: { text: piece }, voice: { languageCode: 'ko-KR', name }, audioConfig: { audioEncoding: 'MP3' } }),
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      let reason = '';
      try {
        const body = await response.json() as any;
        reason = String(body?.error?.details?.find((d: any) => d?.reason)?.reason || body?.error?.status || '');
      } catch { /* not JSON */ }
      throw failure(response.status, 'Google Cloud TTS 요청이 거부되었습니다.', {
        providerStatus: response.status,
        ...(reason ? { providerCode: reason.slice(0, 60) } : {}),
      });
    }
    const body = await response.json() as { audioContent?: string };
    if (!body.audioContent) throw failure(502, 'Google Cloud TTS 응답이 비어 있습니다.', { code: 'TTS_EMPTY_RESPONSE' });
    pieces.push(decode(body.audioContent));
  }
  const total = pieces.reduce((sum, piece) => sum + piece.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const piece of pieces) { merged.set(piece, offset); offset += piece.length; }
  return { audioContent: encode(merged), encoding: 'mp3' as const, sampleRate: 24000, provider: 'google-cloud-chirp3-hd', voice: name };
}

/* ── Cloud Gemini-TTS: the same Gemini voices through Cloud Text-to-Speech (billed project quota). ── */
const CLOUD_GEMINI_TTS_MODELS = ['gemini-3.8-flash-tts', 'gemini-2.5-flash-tts'];
const CLOUD_GEMINI_STYLE = '다정하고 차분한 한국어 친구의 말투로, 자연스럽게 읽어 주세요.';
let workingCloudGeminiModel = '';
let lastCloudGeminiModelError: { model: string; status?: number; providerCode?: string } | null = null;

export function cloudGeminiTtsStatus(env: CloudTtsRuntime = {}) {
  return {
    serviceAccount: Boolean(readServiceAccount(env.GOOGLE_CLOUD_TTS_CREDENTIALS)),
    model: workingCloudGeminiModel || null,
    lastModelError: lastCloudGeminiModelError,
  };
}

export function resetCloudGeminiTts() {
  workingCloudGeminiModel = '';
  lastCloudGeminiModelError = null;
}

/** Read with a Gemini voice (Aoede, Kore, ...) through Cloud TTS; the first model that answers is remembered. */
export async function synthesizeCloudGeminiSpeech(text: string, voice: string | undefined, env: CloudTtsRuntime, fetchApi: typeof fetch = fetch, signal?: AbortSignal) {
  const speech = String(text || '').trim();
  if (!speech) throw failure(400, '음성으로 읽을 내용이 없습니다.');
  // Cloud Gemini-TTS refuses plain API keys (403 IAM_PERMISSION_DENIED): it needs a service account.
  const account = readServiceAccount(env.GOOGLE_CLOUD_TTS_CREDENTIALS);
  if (!account) throw failure(503, 'Cloud Gemini-TTS용 서비스 계정이 설정되지 않았습니다.', { code: 'TTS_NOT_CONFIGURED' });
  const token = await getServiceAccountToken(account, fetchApi);
  const authHeaders: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  if (account.project_id) authHeaders['x-goog-user-project'] = account.project_id;
  const name = CHIRP_VOICES.includes(String(voice || '')) ? String(voice) : 'Aoede';
  const configured = String(env.CLOUD_GEMINI_TTS_MODEL || '').trim();
  const models = [...new Set([workingCloudGeminiModel, configured, ...CLOUD_GEMINI_TTS_MODELS].filter(Boolean))];
  let lastError: unknown = null;
  for (const model of models) {
    try {
      const pieces: Uint8Array[] = [];
      for (const piece of splitForCloudTts(speech)) {
        const response = await fetchApi('https://texttospeech.googleapis.com/v1/text:synthesize', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            input: { prompt: CLOUD_GEMINI_STYLE, text: piece },
            voice: { languageCode: 'ko-KR', name, model_name: model },
            audioConfig: { audioEncoding: 'MP3' },
          }),
          signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(45000)]) : AbortSignal.timeout(45000),
        });
        if (!response.ok) {
          let reason = '';
          try {
            const body = await response.json() as any;
            reason = String(body?.error?.details?.find((d: any) => d?.reason)?.reason || body?.error?.status || '');
          } catch { /* not JSON */ }
          throw failure(response.status, 'Cloud Gemini-TTS 요청이 거부되었습니다.', { providerStatus: response.status, ...(reason ? { providerCode: reason.slice(0, 60) } : {}) });
        }
        const body = await response.json() as { audioContent?: string };
        if (!body.audioContent) throw failure(502, 'Cloud Gemini-TTS 응답이 비어 있습니다.', { code: 'TTS_EMPTY_RESPONSE' });
        pieces.push(decode(body.audioContent));
      }
      workingCloudGeminiModel = model;
      const total = pieces.reduce((sum, p) => sum + p.length, 0);
      const merged = new Uint8Array(total);
      let offset = 0;
      for (const p of pieces) { merged.set(p, offset); offset += p.length; }
      return { audioContent: encode(merged), encoding: 'mp3' as const, sampleRate: 24000, provider: 'google-cloud-gemini-tts', voice: name, model };
    } catch (error: any) {
      lastError = error;
      lastCloudGeminiModelError = { model, ...(error?.providerStatus ? { status: error.providerStatus } : {}), ...(error?.providerCode ? { providerCode: error.providerCode } : {}) };
      if (signal?.aborted) throw error;
      // Only an unknown/unsupported model is worth trying the next name for.
      if (![400, 404].includes(Number(error?.providerStatus))) throw error;
      if (workingCloudGeminiModel === model) workingCloudGeminiModel = '';
    }
  }
  throw lastError;
}
