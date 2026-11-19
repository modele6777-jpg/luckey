import { randomUUID } from 'node:crypto';

export type TTSFailureType =
  | 'invalid_key'
  | 'permission_denied'
  | 'model_unavailable'
  | 'quota_exhausted'
  | 'rate_limited'
  | 'chunk_failure'
  | 'configuration_missing'
  | 'timeout'
  | 'empty_response'
  | 'provider_unavailable'
  | 'unknown';

export type TTSDiagnosticEvent =
  | 'provider_failure'
  | 'primary_failure'
  | 'fallback_success'
  | 'fallback_chain_failure'
  | 'request_failure'
  | 'provider_cooldown';

export interface TTSFailureClassification {
  errorType: TTSFailureType;
  causeType?: TTSFailureType;
  code?: string;
  status?: number;
  providerStatus?: number;
  providerCode?: string;
  chunkIndex?: number;
  chunkCount?: number;
  retryAfterSeconds?: number;
  retryable: boolean;
}

export interface TTSDiagnosticInput {
  event: TTSDiagnosticEvent;
  requestId?: string;
  provider: string;
  model?: string;
  error?: unknown;
  primaryError?: unknown;
  fallbackError?: unknown;
  durationMs?: number;
}

export type TTSDiagnosticSink = (line: string) => void;

type ErrorRecord = Record<string, unknown>;

function asRecord(error: unknown): ErrorRecord {
  return error && typeof error === 'object' ? error as ErrorRecord : {};
}

function numeric(value: unknown): number | undefined {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : undefined;
}

function safeToken(value: unknown, maxLength = 96): string | undefined {
  if (typeof value !== 'string') return undefined;
  const token = value.trim();
  return /^[A-Za-z0-9_.:-]+$/.test(token) ? token.slice(0, maxLength) : undefined;
}

export function createTtsDiagnosticId(candidate?: unknown): string {
  if (typeof candidate === 'string') {
    const value = candidate.trim();
    if (value.length >= 8 && value.length <= 128 && /^[A-Za-z0-9_.:-]+$/.test(value)) return value;
  }
  return randomUUID();
}

function categorize(code: string, providerCode: string, status: number | undefined, provider: string, message: string): TTSFailureType {
  const evidence = `${code} ${providerCode} ${message}`.toUpperCase();
  const isGemini = provider.toLowerCase().includes('gemini');

  if (
    code === 'GEMINI_API_KEY_INVALID' || code === 'TTS_INVALID_KEY' ||
    /API.?KEY.{0,32}(INVALID|NOT VALID)|INVALID.{0,32}API.?KEY/.test(evidence) ||
    ((status === 401) && (isGemini || !provider.toLowerCase().includes('edge')))
  ) return 'invalid_key';

  if (code === 'GEMINI_TTS_MODEL_UNAVAILABLE' || code === 'TTS_MODEL_UNAVAILABLE' || /MODEL[_ -]?(NOT[_ -]?FOUND|UNAVAILABLE)/.test(evidence)) return 'model_unavailable';

  if (
    code === 'GEMINI_TTS_ACCESS_DENIED' || code === 'TTS_EDGE_ACCESS_DENIED' ||
    /PERMISSION_DENIED|ACCESS_DENIED|MODEL_ACCESS_DENIED|SERVICE_BLOCKED|IP_ADDRESS_BLOCKED|HTTP_403/.test(evidence) ||
    status === 403
  ) return 'permission_denied';

  if (
    code === 'MEDIA_QUOTA_EXHAUSTED' || code === 'TTS_QUOTA_EXHAUSTED' ||
    /QUOTA[_ -](EXHAUSTED|EXCEEDED)|DAILY[_ -]LIMIT|LIMIT[_ -]EXCEEDED/.test(evidence)
  ) return 'quota_exhausted';

  if (code === 'MEDIA_RATE_LIMIT' || code === 'TTS_RATE_LIMITED' || status === 429 || /RATE[_ -]LIMIT/.test(evidence)) return 'rate_limited';
  if (code === 'TTS_NOT_CONFIGURED' || /MISSING[_ -]CONFIGURATION|API KEY.{0,32}(?:NOT CONFIGURED|MISSING)|API 키가 설정되지/.test(evidence)) return 'configuration_missing';
  if (status === 504 || /TIMEOUT|TIMED OUT|DEADLINE_EXCEEDED/.test(evidence)) return 'timeout';
  if (/EMPTY[_ -](AUDIO|RESPONSE)|NO_AUDIO_RESPONSE/.test(evidence)) return 'empty_response';
  if (status !== undefined && status >= 500 || /PROVIDER[_ -]UNAVAILABLE|TEMPORARY/.test(evidence)) return 'provider_unavailable';
  return 'unknown';
}

export function classifyTtsError(error: unknown, provider = 'unknown'): TTSFailureClassification {
  const record = asRecord(error);
  const code = safeToken(record.code);
  const providerCode = safeToken(record.providerCode ?? record.reason);
  const status = numeric(record.status ?? (record.response as ErrorRecord | undefined)?.status);
  const providerStatus = numeric(record.providerStatus ?? record.causeStatus);
  const classificationStatus = providerStatus ?? status;
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  const causeType = categorize(code || '', providerCode || '', classificationStatus, provider, message);
  const chunkIndex = numeric(record.chunkIndex);
  const chunkCount = numeric(record.chunkCount);
  const isChunkFailure = code === 'TTS_CHUNK_FAILED' || chunkIndex !== undefined;
  const errorType = isChunkFailure ? 'chunk_failure' : causeType;
  const retryAfterSeconds = numeric(record.retryAfterSeconds);
  const retryable = errorType === 'rate_limited' || errorType === 'timeout' || errorType === 'provider_unavailable' || causeType === 'rate_limited';

  return {
    errorType,
    ...(isChunkFailure ? { causeType } : {}),
    ...(code ? { code } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(providerStatus !== undefined ? { providerStatus } : {}),
    ...(providerCode ? { providerCode } : {}),
    ...(chunkIndex !== undefined ? { chunkIndex } : {}),
    ...(chunkCount !== undefined ? { chunkCount } : {}),
    ...(retryAfterSeconds !== undefined ? { retryAfterSeconds } : {}),
    retryable,
  };
}

/** Log stable, aggregatable fields only; never include provider messages, audio text, or credentials. */
export function logTtsDiagnostic(
  input: TTSDiagnosticInput,
  sink: TTSDiagnosticSink = line => console.error(line),
): Record<string, unknown> {
  const record: Record<string, unknown> = {
    event: `tts.${input.event}`,
    requestId: createTtsDiagnosticId(input.requestId),
    provider: safeToken(input.provider, 48) || 'unknown',
  };
  const model = safeToken(input.model, 96);
  if (model) record.model = model;
  const durationMs = numeric(input.durationMs);
  if (durationMs !== undefined) record.durationMs = durationMs;

  if (input.error !== undefined) Object.assign(record, classifyTtsError(input.error, input.provider));
  if (input.primaryError !== undefined) {
    record.primaryErrorType = classifyTtsError(input.primaryError, 'gemini').errorType;
  }
  if (input.fallbackError !== undefined) {
    record.fallbackErrorType = classifyTtsError(input.fallbackError, 'edge-neural').errorType;
  }

  sink(`[tts_diagnostic] ${JSON.stringify(record)}`);
  return record;
}
