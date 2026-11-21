import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geminiMedia } from '../server/api-lib/geminiMedia';
import { classifyTtsError } from '../server/api-lib/ttsDiagnostics';

const env = { GEMINI_API_KEY: 'test-key' };
const reply = (body: unknown) => (async () => new Response(JSON.stringify(body), { status: 429, headers: { 'Content-Type': 'application/json' } })) as typeof fetch;

test('a per-day Gemini 429 is reported as an exhausted daily quota', async () => {
  const body = { error: { code: 429, message: 'You exceeded your current quota.', details: [
    { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier' }] },
    { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '41s' },
  ] } };
  const error = await geminiMedia(env, {}, 'gemini-tts-test', reply(body)).catch(e => e);
  assert.equal(error.providerCode, 'DAILY_LIMIT_EXCEEDED');
  assert.equal(error.retryAfterSeconds, 41);
  assert.equal(classifyTtsError(error, 'gemini').errorType, 'quota_exhausted');
});

test('a per-minute Gemini 429 stays a short rate limit with Google\'s wait time', async () => {
  const body = { error: { code: 429, message: 'Resource exhausted.', details: [
    { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId: 'GenerateRequestsPerMinutePerProjectPerModel-FreeTier' }] },
    { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '7s' },
  ] } };
  const error = await geminiMedia(env, {}, 'gemini-tts-test', reply(body)).catch(e => e);
  assert.equal(error.providerCode, 'RATE_LIMIT_PER_MINUTE');
  assert.equal(error.retryAfterSeconds, 7);
  assert.equal(classifyTtsError(error, 'gemini').errorType, 'rate_limited');
});
