import { synthesizeChirpSpeech, type CloudTtsRuntime } from './googleCloudTts.ts';
import { synthesizeGeminiSpeech } from './geminiMedia.ts';

/**
 * 🔊 App speech: Google Cloud Chirp 3 HD first (fast start, generous quota), Gemini TTS as
 * the fallback. When Cloud TTS is not set up (API disabled, billing missing, key refused),
 * it is skipped for a while so every reading doesn't pay for a failed attempt.
 */
const CLOUD_TTS_COOLDOWN_MS = 10 * 60 * 1000;
let cloudTtsSkippedUntil = 0;
let lastCloudTtsFailure: { status?: number; providerCode?: string } | null = null;

export function cloudTtsStatus() {
  return { skipped: Date.now() < cloudTtsSkippedUntil, lastFailure: lastCloudTtsFailure };
}

export function resetCloudTtsCooldown() {
  cloudTtsSkippedUntil = 0;
  lastCloudTtsFailure = null;
}

export async function synthesizePreferredSpeech(
  text: string,
  voice: string | undefined,
  env: CloudTtsRuntime,
  fetchApi: typeof fetch = fetch,
  signal?: AbortSignal,
) {
  if (Date.now() >= cloudTtsSkippedUntil && env.TTS_PROVIDER !== 'gemini') {
    try {
      const result = await synthesizeChirpSpeech(text, voice, env, fetchApi, signal);
      lastCloudTtsFailure = null;
      return result;
    } catch (error: any) {
      if (signal?.aborted) throw error;
      const status = Number(error?.providerStatus ?? error?.status);
      lastCloudTtsFailure = { ...(Number.isFinite(status) ? { status } : {}), ...(error?.providerCode ? { providerCode: String(error.providerCode) } : {}) };
      // Setup problems (disabled API, no billing, refused key, no key) won't fix themselves soon.
      if ([400, 401, 403, 404, 503].includes(status) || error?.code === 'TTS_NOT_CONFIGURED') {
        cloudTtsSkippedUntil = Date.now() + CLOUD_TTS_COOLDOWN_MS;
      }
      console.warn('[tts] Chirp 3 HD unavailable, using Gemini:', lastCloudTtsFailure);
    }
  }
  return synthesizeGeminiSpeech(text, voice, env, fetchApi, signal);
}
