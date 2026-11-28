/**
 * Google Cloud Text-to-Speech · Chirp 3 HD (Korean).
 * Fetch-only so it runs on the Node server and on Sites Workers.
 *
 * Chirp 3 HD voices share their names with the Gemini voices the app already uses
 * (Aoede, Kore, Charon, ...), so Lucy keeps the same character: `ko-KR-Chirp3-HD-<name>`.
 * Key: GOOGLE_CLOUD_TTS_API_KEY, or the existing Google/Gemini API key when the
 * Text-to-Speech API is enabled on that key's project.
 */
import { getServiceAccountToken, readServiceAccount, serviceAccountProblem } from './googleServiceAccount.ts';

export type CloudTtsRuntime = Record<string, string | undefined>;

const CHIRP_VOICES = ['Aoede', 'Kore', 'Leda', 'Zephyr', 'Puck', 'Charon', 'Fenrir', 'Orus'];
/** Cloud TTS accepts at most 5000 bytes per request; Korean is ~3 bytes a character. */
const MAX_REQUEST_CHARS = 1400;
/**
 * 🔊 Lossless 24 kHz: the backup readers used to ask for the default `MP3`, which Cloud TTS
 * synthesises at 32 kbps mono — Korean came back muffled and fizzy (a 4-second sentence was
 * only 16 KB). `LINEAR16` at 24 kHz is the voice's own 16-bit PCM, so the app now hears the
 * full-quality reading and only the transport gets bigger.
 */
const WAV_SAMPLE_RATE = 24000;
const CLOUD_AUDIO_CONFIG = { audioEncoding: 'LINEAR16', sampleRateHertz: WAV_SAMPLE_RATE } as const;

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

function ascii(bytes: Uint8Array, offset: number, length: number): string {
  let value = '';
  for (let i = 0; i < length; i++) value += String.fromCharCode(bytes[offset + i] ?? 0);
  return value;
}

/**
 * The PCM samples of one Cloud TTS answer. A `LINEAR16` answer arrives as a RIFF/WAVE container
 * (44-byte header and, for longer text, extra `LIST`/`fact` chunks), so the header is walked and
 * only the `data` chunk is kept. An answer without that header is already raw PCM.
 */
export function pcmBytesOfPiece(piece: Uint8Array): Uint8Array {
  if (piece.length < 12 || ascii(piece, 0, 4) !== 'RIFF' || ascii(piece, 8, 4) !== 'WAVE') return piece;
  const view = new DataView(piece.buffer, piece.byteOffset, piece.byteLength);
  let offset = 12;
  while (offset + 8 <= piece.length) {
    const id = ascii(piece, offset, 4);
    const size = view.getUint32(offset + 4, true);
    const start = offset + 8;
    if (id === 'data') return piece.subarray(start, Math.min(piece.length, start + size));
    offset = start + size + (size % 2);
  }
  // A container we cannot read: keep it whole rather than dropping the reading.
  return piece;
}

/** Standard 44-byte RIFF/WAVE header for mono 16-bit PCM (same shape geminiMedia writes). */
export function wavHeader(dataLength: number, sampleRate = WAV_SAMPLE_RATE): Uint8Array {
  const header = new Uint8Array(44);
  const view = new DataView(header.buffer);
  const write = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) header[offset + i] = value.charCodeAt(i); };
  write(0, 'RIFF'); view.setUint32(4, 36 + dataLength, true); write(8, 'WAVE'); write(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, 'data');
  view.setUint32(40, dataLength, true);
  return header;
}

/** Join every answer's samples behind one WAV header, so the app can play it as one file. */
export function mergePiecesAsWav(pieces: Uint8Array[], sampleRate = WAV_SAMPLE_RATE) {
  const samples = pieces.map(pcmBytesOfPiece);
  const total = samples.reduce((sum, piece) => sum + piece.length, 0) & ~1; // whole 16-bit samples only
  const wav = new Uint8Array(44 + total);
  wav.set(wavHeader(total, sampleRate), 0);
  let offset = 44;
  for (const piece of samples) {
    if (offset >= wav.length) break;
    const room = Math.min(piece.length, wav.length - offset);
    wav.set(piece.subarray(0, room), offset);
    offset += room;
  }
  return { audioContent: encode(wav), encoding: 'wav' as const, sampleRate };
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
      body: JSON.stringify({ input: { text: piece }, voice: { languageCode: 'ko-KR', name }, audioConfig: CLOUD_AUDIO_CONFIG }),
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
  return { ...mergePiecesAsWav(pieces), provider: 'google-cloud-chirp3-hd', voice: name };
}

/* ── Cloud Gemini-TTS: the same Gemini voices through Cloud Text-to-Speech (billed project quota). ── */
const CLOUD_GEMINI_TTS_MODELS = ['gemini-3.8-flash-tts', 'gemini-2.5-flash-tts'];
const CLOUD_GEMINI_STYLE = '다정하고 차분한 한국어 친구의 말투로, 자연스럽게 읽어 주세요.';
let workingCloudGeminiModel = '';
let lastCloudGeminiModelError: { model: string; status?: number; providerCode?: string } | null = null;

export function cloudGeminiTtsStatus(env: CloudTtsRuntime = {}) {
  return {
    serviceAccount: Boolean(readServiceAccount(env.GOOGLE_CLOUD_TTS_CREDENTIALS)),
    serviceAccountState: serviceAccountProblem(env.GOOGLE_CLOUD_TTS_CREDENTIALS),
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
            audioConfig: CLOUD_AUDIO_CONFIG,
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
      return { ...mergePiecesAsWav(pieces), provider: 'google-cloud-gemini-tts', voice: name, model };
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
