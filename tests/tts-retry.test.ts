import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retrySpeechRequest } from '../src/utils/ttsRetry';

test('temporary failures wait and eventually return the same chunk', async () => {
  let calls = 0, waited = 0;
  const result = await retrySpeechRequest(async () => {
    if (++calls < 7) throw Object.assign(new Error('temporary'), { status: calls % 2 ? 502 : 429 });
    return 'original chunk audio';
  }, { isActive: () => true, waitUntilResumed: async () => true, delay: async ms => { waited += ms; } });
  assert.equal(calls, 7); assert.ok(waited > 0); assert.equal(result, 'original chunk audio');
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
