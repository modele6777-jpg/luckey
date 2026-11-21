import { synthesizeChirpSpeech, synthesizeCloudGeminiSpeech, cloudGeminiTtsStatus, type CloudTtsRuntime } from './googleCloudTts.ts';
import { readServiceAccount } from './googleServiceAccount.ts';
import { synthesizeGeminiSpeech } from './geminiMedia.ts';

/**
 * 🔊 App speech: Gemini TTS first (Lucy's usual voice). When Gemini refuses (quota or rate
 * limit) or fails, the same text is read by Google Cloud Chirp 3 HD with the same-named
 * voice. After a Gemini daily-quota answer, Gemini is skipped until Google's retry time so
 * readings don't wait on a request that will be refused. Cloud TTS setup failures (API off,
 * no billing, refused key) skip Chirp for 10 minutes.
 */
const CLOUD_TTS_COOLDOWN_MS = 10 * 60 * 1000;
const GEMINI_DEFAULT_COOLDOWN_MS = 60 * 1000;
let cloudTtsSkippedUntil = 0;
let geminiSkippedUntil = 0;
let cloudGeminiSkippedUntil = 0;
let lastCloudTtsFailure: { status?: number; providerCode?: string } | null = null;
let lastGeminiFailure: { status?: number; providerCode?: string } | null = null;

export function cloudTtsStatus(env: CloudTtsRuntime = {}) {
  const now = Date.now();
  return {
    order: ['gemini', 'cloud-gemini-tts', 'chirp3-hd'],
    cloudGemini: { ...cloudGeminiTtsStatus(env), skippedSeconds: Math.max(0, Math.ceil((cloudGeminiSkippedUntil - now) / 1000)) },
    skipped: now < cloudTtsSkippedUntil,
    lastFailure: lastCloudTtsFailure,
    geminiSkippedSeconds: Math.max(0, Math.ceil((geminiSkippedUntil - now) / 1000)),
    lastGeminiFailure,
  };
}

export function resetCloudTtsCooldown() {
  cloudTtsSkippedUntil = 0;
  geminiSkippedUntil = 0;
  cloudGeminiSkippedUntil = 0;
  lastCloudTtsFailure = null;
  lastGeminiFailure = null;
}

function failureSummary(error: any) {
  const status = Number(error?.providerStatus ?? error?.status);
  return { ...(Number.isFinite(status) ? { status } : {}), ...(error?.providerCode ? { providerCode: String(error.providerCode) } : {}) };
}

/**
 * Cloud backup reader: the same Gemini voice through Cloud TTS (natural, billed quota) first,
 * then Chirp 3 HD as the last resort.
 */
async function tryChirp(text: string, voice: string | undefined, env: CloudTtsRuntime, fetchApi: typeof fetch, signal?: AbortSignal) {
  if (env.CLOUD_GEMINI_TTS !== 'off' && readServiceAccount(env.GOOGLE_CLOUD_TTS_CREDENTIALS) && Date.now() >= cloudGeminiSkippedUntil) {
    try {
      const result = await synthesizeCloudGeminiSpeech(text, voice, env, fetchApi, signal);
      lastCloudTtsFailure = null;
      return result;
    } catch (error: any) {
      if (signal?.aborted) throw error;
      const summary = failureSummary(error);
      // Permission/auth problems need a settings change: don't pay for them on every reading.
      if ([401, 403].includes(Number(summary.status))) cloudGeminiSkippedUntil = Date.now() + CLOUD_TTS_COOLDOWN_MS;
      console.warn('[tts] Cloud Gemini-TTS unavailable, trying Chirp 3 HD:', summary);
    }
  }
  try {
    const result = await synthesizeChirpSpeech(text, voice, env, fetchApi, signal);
    lastCloudTtsFailure = null;
    return result;
  } catch (error: any) {
    lastCloudTtsFailure = failureSummary(error);
    if ([400, 401, 403, 404, 503].includes(Number(lastCloudTtsFailure.status)) || error?.code === 'TTS_NOT_CONFIGURED') {
      cloudTtsSkippedUntil = Date.now() + CLOUD_TTS_COOLDOWN_MS;
    }
    throw error;
  }
}

export async function synthesizePreferredSpeech(
  text: string,
  voice: string | undefined,
  env: CloudTtsRuntime,
  fetchApi: typeof fetch = fetch,
  signal?: AbortSignal,
) {
  const chirpAllowed = env.TTS_PROVIDER !== 'gemini' && Date.now() >= cloudTtsSkippedUntil;
  if (Date.now() < geminiSkippedUntil && chirpAllowed) {
    try { return await tryChirp(text, voice, env, fetchApi, signal); }
    catch (error) { if (signal?.aborted) throw error; /* fall through to Gemini */ }
  }
  try {
    const result = await synthesizeGeminiSpeech(text, voice, env, fetchApi, signal);
    lastGeminiFailure = null;
    return result;
  } catch (geminiError: any) {
    if (signal?.aborted) throw geminiError;
    lastGeminiFailure = failureSummary(geminiError);
    const status = Number(geminiError?.status);
    if (status === 400) throw geminiError; // the text itself was refused; another voice won't help
    if (status === 429) {
      const retry = Number(geminiError?.retryAfterSeconds);
      geminiSkippedUntil = Date.now() + (Number.isFinite(retry) && retry > 0 ? retry * 1000 : GEMINI_DEFAULT_COOLDOWN_MS);
    }
    if (env.TTS_PROVIDER === 'gemini' || Date.now() < cloudTtsSkippedUntil) throw geminiError;
    try {
      return await tryChirp(text, voice, env, fetchApi, signal);
    } catch (chirpError) {
      console.warn('[tts] Gemini and Chirp 3 HD both failed:', lastGeminiFailure, lastCloudTtsFailure);
      throw geminiError; // report the primary engine's reason (e.g. daily quota) to the app
    }
  }
}
