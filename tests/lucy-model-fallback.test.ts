import test from 'node:test';
import assert from 'node:assert/strict';
import { LUCY_MASTER_MODEL, LUCY_MASTER_FALLBACK_MODELS, requestWithModelFallback, getLucyRequestFallbacks, LUCY_REVIEW_MODEL } from '../src/lib/lucyModelPolicy';

test('master recovers only within its configured non-Lite candidate tier', async () => {
  const tried: string[] = [];
  const candidates = [LUCY_MASTER_MODEL, ...LUCY_MASTER_FALLBACK_MODELS];
  const result = await requestWithModelFallback(LUCY_MASTER_MODEL, LUCY_MASTER_FALLBACK_MODELS, async model => {
    tried.push(model);
    if (model !== candidates.at(-1)) throw new Error('provider unavailable');
    return 'verified response';
  });
  assert.deepEqual(tried, candidates);
  assert.equal(result.modelUsed, candidates.at(-1));
  assert.equal(result.response, 'verified response');
  assert.ok(tried.every(model => !model.includes('lite')));
});
test('all unavailable models fail explicitly instead of fabricating a response', async () => {
  const error = new Error('provider unavailable');
  let attempts = 0;
  await assert.rejects(requestWithModelFallback('primary', ['primary', 'backup'], async () => { attempts++; throw error; }), error);
  assert.equal(attempts, 2);
});

test('general review may fall back to a separate Lite review request while master stays in its tier', () => {
  assert.ok(getLucyRequestFallbacks(LUCY_REVIEW_MODEL, 'general').includes('gemini-flash-lite-latest'));
  assert.ok(!getLucyRequestFallbacks(LUCY_MASTER_MODEL, 'master').some(model => model.includes('lite')));
  assert.ok(!getLucyRequestFallbacks(LUCY_REVIEW_MODEL).some(model => model.includes('lite')));
});

test('a hanging review model is aborted and the next candidate can finish', async () => {
  let aborted = false;
  const result = await requestWithModelFallback('hung', ['available'], (model, signal) => {
    if (model === 'available') return Promise.resolve('reviewed');
    signal!.addEventListener('abort', () => { aborted = true; }, { once:true });
    return new Promise<string>(() => {});
  }, { attemptTimeoutMs: 20 });
  assert.equal(aborted, true);
  assert.equal(result.modelUsed, 'available');
  assert.equal(result.response, 'reviewed');
});
