import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyTtsError, createTtsDiagnosticId, logTtsDiagnostic } from '../server/api-lib/ttsDiagnostics';

test('TTS failures distinguish invalid key, permission denial, quota, rate limit, and chunk failure', () => {
  assert.equal(classifyTtsError({ status: 400, code: 'GEMINI_API_KEY_INVALID' }, 'gemini').errorType, 'invalid_key');
  assert.equal(classifyTtsError({ status: 403, code: 'GEMINI_TTS_ACCESS_DENIED' }, 'gemini').errorType, 'permission_denied');
  assert.equal(classifyTtsError({ status: 404, code: 'GEMINI_TTS_MODEL_UNAVAILABLE' }, 'gemini').errorType, 'model_unavailable');
  assert.equal(classifyTtsError({ status: 429, code: 'MEDIA_QUOTA_EXHAUSTED' }, 'gemini').errorType, 'quota_exhausted');
  assert.equal(classifyTtsError({ status: 429, code: 'MEDIA_RATE_LIMIT' }, 'gemini').errorType, 'rate_limited');

  const chunkFailure = classifyTtsError({
    status: 502,
    providerStatus: 403,
    providerCode: 'HTTP_403',
    code: 'TTS_CHUNK_FAILED',
    chunkIndex: 2,
    chunkCount: 4,
  }, 'edge-neural');
  assert.equal(chunkFailure.errorType, 'chunk_failure');
  assert.equal(chunkFailure.causeType, 'permission_denied');
  assert.equal(chunkFailure.chunkIndex, 2);
  assert.equal(chunkFailure.chunkCount, 4);
});

test('structured TTS logs are aggregatable and exclude provider message contents', () => {
  let line = '';
  const record = logTtsDiagnostic({
    event: 'provider_failure',
    requestId: 'iad1::req-12345678',
    provider: 'gemini',
    model: 'gemini-3.8-flash-tts',
    error: Object.assign(new Error('secret-key=do-not-log; private narration text'), {
      status: 401,
      code: 'GEMINI_API_KEY_INVALID',
      providerCode: 'API_KEY_INVALID',
    }),
    durationMs: 42,
  }, value => { line = value; });

  assert.match(line, /^\[tts_diagnostic\] /);
  const parsed = JSON.parse(line.replace(/^\[tts_diagnostic\] /, ''));
  assert.equal(parsed.event, 'tts.provider_failure');
  assert.equal(parsed.requestId, 'iad1::req-12345678');
  assert.equal(parsed.provider, 'gemini');
  assert.equal(parsed.errorType, 'invalid_key');
  assert.equal(parsed.providerCode, 'API_KEY_INVALID');
  assert.equal(parsed.durationMs, 42);
  assert.equal(record.errorType, 'invalid_key');
  assert.doesNotMatch(line, /do-not-log|private narration text/);
});

test('diagnostic IDs accept safe request IDs and replace malformed values', () => {
  assert.equal(createTtsDiagnosticId('iad1::req-12345678'), 'iad1::req-12345678');
  assert.match(createTtsDiagnosticId('user text with spaces'), /^[0-9a-f-]{36}$/);
});
