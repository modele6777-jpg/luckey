import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { synthesizePreferredSpeech } from './preferredSpeech.ts';
import { getGeminiApiKey } from '../geminiKey.ts';
const synthesizeDefault = (text: string, voice?: string) => synthesizePreferredSpeech(text, voice, speechRuntimeEnv());

/**
 * Environment for speech, with the service-account JSON also read from a file when it was
 * added as a Render Secret File or via GOOGLE_APPLICATION_CREDENTIALS.
 */
export function speechRuntimeEnv(): Record<string, string | undefined> {
  const env: Record<string, string | undefined> = { ...process.env, GEMINI_API_KEY: getGeminiApiKey() };
  if (!String(env.GOOGLE_CLOUD_TTS_CREDENTIALS || '').trim()) {
    const fromFile = readCredentialsFile(env);
    if (fromFile) env.GOOGLE_CLOUD_TTS_CREDENTIALS = fromFile;
  }
  return env;
}

function readCredentialsFile(env: Record<string, string | undefined>): string {
  const candidates = [
    env.GOOGLE_APPLICATION_CREDENTIALS,
    '/etc/secrets/GOOGLE_CLOUD_TTS_CREDENTIALS',
    '/etc/secrets/GOOGLE_CLOUD_TTS_CREDENTIALS.json',
  ].filter(Boolean) as string[];
  try {
    for (const path of candidates) {
      if (existsSync(path)) return readFileSync(path, 'utf8');
    }
    if (existsSync('/etc/secrets')) {
      for (const name of readdirSync('/etc/secrets')) {
        if (!name.endsWith('.json')) continue;
        const text = readFileSync(`/etc/secrets/${name}`, 'utf8');
        if (text.includes('"service_account"')) return text;
      }
    }
  } catch { /* unreadable: treat as not configured */ }
  return '';
}
import { classifyTtsError, createTtsDiagnosticId, logTtsDiagnostic } from './ttsDiagnostics.ts';

export interface TTSHandlerOptions {
  text: string;
  voice?: string;
  emotion?: string;
  rate?: string;
  pitch?: string;
  speed?: number;
  language?: string;
  requestId?: string;
}

export interface TTSHandlerResult {
  audioContent: string;
  encoding: "mp3" | "pcm" | "wav";
  sampleRate?: number;
  voice?: string;
  provider?: string;
}

/**
 * 내부 제어 지시문(frontend src/ 의존성 없이 서버 자체 완결)을 제거합니다.
 * 이전에는 src/utils/speechText를 import했는데, Vercel 서버리스 런타임 번들에
 * 프론트엔드 경로가 존재하지 않아 `Cannot find module '/var/task/src/utils/speechText'`
 * 로 함수 전체가 크래시했습니다. 그래서 필요한 정규식 처리를 여기에 인라인으로 옮겼습니다.
 */
function stripInternalSpeechDirectives(text: string): string {
  return String(text || '')
    .replace(/<(think|analysis|system|developer|internal|instructions)(?:\s[^>]*)?>[\s\S]*?(?:<\/\1\s*>|$)/gi, ' ')
    .replace(/```(?:system|developer|prompt|instructions|internal|analysis)\s*\n[\s\S]*?(?:```|$)/gi, ' ')
    .replace(/\[(SYSTEM|DEVELOPER|INTERNAL|PROMPT|INSTRUCTIONS|ANALYSIS)\]([\s\S]*?)(?:\[\/\1\]|$)/gi, ' ')
    .replace(/\[(?:SYSTEM|DEVELOPER|INTERNAL|PROMPT|INSTRUCTIONS|ANALYSIS|EMOTION|SUGGESTIONS|TOOL|IMAGE|STAGE|SOUL_UPDATE|CARD_DRAWN|YOUTUBE)\s*:[\s\S]*?(?:\]|$)/gi, ' ')
    .trim();
}

function publicFailure(errorType: string): { status: number; code: string; message: string } {
  switch (errorType) {
    case 'invalid_key': return { status: 503, code: 'TTS_INVALID_KEY', message: '서버 음성 인증 설정을 확인해 주세요.' };
    case 'permission_denied': return { status: 503, code: 'TTS_ACCESS_DENIED', message: '서버 음성 제공자의 접근이 거부되었습니다. 잠시 후 다시 시도해 주세요.' };
    case 'model_unavailable': return { status: 503, code: 'TTS_MODEL_UNAVAILABLE', message: '요청한 음성 모델을 사용할 수 없습니다.' };
    case 'quota_exhausted': return { status: 429, code: 'TTS_QUOTA_EXHAUSTED', message: '음성 제공자의 사용 한도가 소진되었습니다.' };
    case 'rate_limited': return { status: 429, code: 'TTS_RATE_LIMITED', message: '음성 요청이 일시적으로 제한되었습니다. 잠시 후 다시 시도해 주세요.' };
    case 'chunk_failure': return { status: 502, code: 'TTS_CHUNK_FAILED', message: '음성의 일부 구간을 생성하지 못했습니다. 다시 시도해 주세요.' };
    case 'configuration_missing': return { status: 503, code: 'TTS_NOT_CONFIGURED', message: '서버 음성 설정이 완료되지 않았습니다.' };
    case 'timeout': return { status: 504, code: 'TTS_TIMEOUT', message: '음성 생성 요청 시간이 초과되었습니다. 다시 시도해 주세요.' };
    case 'empty_response': return { status: 502, code: 'TTS_EMPTY_RESPONSE', message: '음성 제공자가 오디오를 반환하지 않았습니다. 다시 시도해 주세요.' };
    default: return { status: 502, code: 'TTS_PROVIDER_UNAVAILABLE', message: '음성 생성에 일시적인 오류가 발생했습니다. 잠시 후 다시 눌러 주세요.' };
  }
}

/** Synthesize with Edge Neural TTS and retain diagnostic categories at the API boundary. */
export function createTTSHandler(synthesize: (text: string, voice?: string) => Promise<TTSHandlerResult> = synthesizeDefault) {
  let providerUnavailableUntil = 0;
  return async function handleTTS(options: TTSHandlerOptions): Promise<TTSHandlerResult> {
    const requestId = createTtsDiagnosticId(options.requestId);
    const model = options.voice || 'Aoede';
    if (Date.now() < providerUnavailableUntil) {
      const failure = Object.assign(new Error('Gemini TTS access was recently denied.'), {
        status: 503,
        providerStatus: 403,
        code: 'TTS_ACCESS_DENIED',
        diagnosticId: requestId,
      });
      logTtsDiagnostic({ event: 'provider_cooldown', requestId, provider: 'gemini', model, error: failure });
      throw Object.assign(new Error('서버 음성 제공자의 접근이 잠시 제한되어 있습니다.'), {
        status: 503,
        code: 'TTS_ACCESS_DENIED',
        diagnosticId: requestId,
        providerStatus: 403,
      });
    }

    const speech = stripInternalSpeechDirectives(String(options.text || '')).trim();
    const startedAt = Date.now();
    try {
      return await synthesize(speech, options.voice);
    } catch (error) {
      const diagnosis = classifyTtsError(error, 'gemini');
      const upstreamStatus = diagnosis.providerStatus ?? diagnosis.status;
      if (upstreamStatus === 401 || upstreamStatus === 403 || diagnosis.errorType === 'permission_denied') {
        providerUnavailableUntil = Date.now() + 60_000;
      }
      logTtsDiagnostic({
        event: 'provider_failure',
        requestId,
        provider: 'gemini',
        model,
        error,
        durationMs: Date.now() - startedAt,
      });
      const publicError = publicFailure(diagnosis.errorType);
      throw Object.assign(new Error(publicError.message), {
        status: publicError.status,
        code: publicError.code,
        diagnosticId: requestId,
        ...(diagnosis.providerStatus !== undefined ? { providerStatus: diagnosis.providerStatus } : {}),
        ...(diagnosis.providerCode ? { providerCode: diagnosis.providerCode } : {}),
        ...(diagnosis.chunkIndex !== undefined ? { chunkIndex: diagnosis.chunkIndex } : {}),
        ...(diagnosis.chunkCount !== undefined ? { chunkCount: diagnosis.chunkCount } : {}),
        ...(diagnosis.retryAfterSeconds ? { retryAfterSeconds: diagnosis.retryAfterSeconds } : {}),
      });
    }
  };
}

export const handleTTS = createTTSHandler();
