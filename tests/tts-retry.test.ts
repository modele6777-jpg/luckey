import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retrySpeechRequest } from '../src/utils/ttsRetry';

test('a transient failure retries once and returns the same chunk', async () => {
  let calls = 0, waited = 0;
  const result = await retrySpeechRequest(async () => {
    if (++calls < 2) throw Object.assign(new Error('temporary'), { status: 502 });
    return 'original chunk audio';
  }, { isActive: () => true, waitUntilResumed: async () => true, delay: async ms => { waited += ms; } });
  assert.equal(calls, 2); assert.equal(waited, 2000); assert.equal(result, 'original chunk audio');
});

test('transient network failures are bounded to two retries then surface the last failure', async () => {
  let calls = 0, waited = 0;
  await assert.rejects(retrySpeechRequest(async () => {
    calls++; throw Object.assign(new Error('temporary'), { status: 502 });
  }, { isActive: () => true, waitUntilResumed: async () => true, delay: async ms => { waited += ms; } }), /temporary/);
  assert.equal(calls, 3);
  assert.equal(waited, 6000);
});

test('manual stop cancels during delay without another request', async () => {
  let active = true, calls = 0;
  await assert.rejects(retrySpeechRequest(async () => { calls++; throw new TypeError('network'); }, {
    isActive: () => active, waitUntilResumed: async () => true, delay: async () => { active = false; },
  }), /취소/);
  assert.equal(calls, 1);
});

test('permanent quota errors do not loop', async () => {
  let calls = 0;
  await assert.rejects(retrySpeechRequest(async () => {
    calls++; throw Object.assign(new Error('quota'), { status: 429, code: 'MEDIA_QUOTA_EXHAUSTED' });
  }, { isActive: () => true, waitUntilResumed: async () => true }));
  assert.equal(calls, 1);
});

test('provider unavailable and exhausted rate-limit errors do not auto-retry', async () => {
  for (const failure of [
    Object.assign(new Error('provider unavailable'), { status: 503, code: 'TTS_PROVIDER_UNAVAILABLE' }),
    Object.assign(new Error('rate limited'), { status: 429, code: 'MEDIA_RATE_LIMIT' }),
  ]) {
    let calls = 0;
    await assert.rejects(retrySpeechRequest(async () => { calls++; throw failure; }, {
      isActive: () => true, waitUntilResumed: async () => true, delay: async () => {},
    }));
    assert.equal(calls, 1);
  }
});
