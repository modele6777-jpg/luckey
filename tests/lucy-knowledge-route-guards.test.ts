import assert from 'node:assert/strict';
import test from 'node:test';
import { getBudgetConfig, verifyFirebaseIdToken } from '../server/api-lib/lucyKnowledgeRoute.ts';

const budgetEnv = [
  'LUCY_KNOWLEDGE_HARD_MAX_DAILY_USD',
  'LUCY_KNOWLEDGE_HARD_MAX_RUN_USD',
  'LUCY_KNOWLEDGE_INPUT_USD_PER_MILLION',
  'LUCY_KNOWLEDGE_OUTPUT_USD_PER_MILLION',
  'LUCY_KNOWLEDGE_MAX_INPUT_TOKENS',
  'LUCY_KNOWLEDGE_MAX_OUTPUT_TOKENS',
] as const;

test('AI generation budget is closed unless every hard limit and price input is configured', () => {
  const saved = new Map(budgetEnv.map((key) => [key, process.env[key]]));
  try {
    for (const key of budgetEnv) delete process.env[key];
    assert.equal(getBudgetConfig({ dailyBudgetUsd: 10, maxPerRunUsd: 1 }), null);

    process.env.LUCY_KNOWLEDGE_HARD_MAX_DAILY_USD = '2';
    process.env.LUCY_KNOWLEDGE_HARD_MAX_RUN_USD = '0.5';
    process.env.LUCY_KNOWLEDGE_INPUT_USD_PER_MILLION = '0.2';
    process.env.LUCY_KNOWLEDGE_OUTPUT_USD_PER_MILLION = '0.4';
    process.env.LUCY_KNOWLEDGE_MAX_INPUT_TOKENS = '1000';
    process.env.LUCY_KNOWLEDGE_MAX_OUTPUT_TOKENS = '500';
    assert.deepEqual(getBudgetConfig({ dailyBudgetUsd: 1, maxPerRunUsd: 0.4 }), {
      dailyCap: 1, runCap: 0.4, inputUsdPerMillion: 0.2, outputUsdPerMillion: 0.4,
      maxInputTokens: 1000, maxOutputTokens: 500,
    });
    assert.equal(getBudgetConfig({ dailyBudgetUsd: 0.4, maxPerRunUsd: 1 }), null);
    assert.equal(getBudgetConfig({ dailyBudgetUsd: -1, maxPerRunUsd: 0.2 }), null);
  } finally {
    for (const key of budgetEnv) {
      const value = saved.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test('malformed or non-RS256 identity tokens are rejected without external verification', async () => {
  assert.equal(await verifyFirebaseIdToken('not-a-jwt'), null);
  const header = Buffer.from(JSON.stringify({ alg: 'none', kid: 'not-real' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: 'user', exp: 9999999999 })).toString('base64url');
  assert.equal(await verifyFirebaseIdToken(`${header}.${payload}.signature`), null);
});
