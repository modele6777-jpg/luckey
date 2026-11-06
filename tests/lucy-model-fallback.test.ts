import test from 'node:test';
import assert from 'node:assert/strict';
import { LUCY_MASTER_MODEL, LUCY_MASTER_FALLBACK_MODELS, requestWithModelFallback } from '../src/lib/lucyModelPolicy';

test('master survives primary and first fallback failure without downgrading to Lite', async () => {
  const tried: string[] = [];
  const result = await requestWithModelFallback(LUCY_MASTER_MODEL, LUCY_MASTER_FALLBACK_MODELS, async model => {
    tried.push(model);
    if (tried.length < 3) throw new Error('provider unavailable');
    return 'verified response';
  });
  assert.deepEqual(tried, [LUCY_MASTER_MODEL, ...LUCY_MASTER_FALLBACK_MODELS]);
  assert.equal(result.modelUsed, LUCY_MASTER_FALLBACK_MODELS[1]);
  assert.equal(result.response, 'verified response');
  assert.ok(tried.every(model => !model.includes('lite')));
});
test('all unavailable models fail explicitly instead of fabricating a response', async () => {
  const error = new Error('provider unavailable');
  let attempts = 0;
  await assert.rejects(requestWithModelFallback('primary', ['primary', 'backup'], async () => { attempts++; throw error; }), error);
  assert.equal(attempts, 2);
});
