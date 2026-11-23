import assert from 'node:assert/strict';
import test from 'node:test';
import { createOrbSessionMetrics, parseOrbLivePrices } from '../src/lib/orb/orbSessionMetrics.ts';

const prices = { inputText: 1, inputAudio: 4, outputText: 2, outputAudio: 8 };

test('uses reported token counts and separate modality rates', () => {
  const metrics = createOrbSessionMetrics();
  metrics.setConnection('test-model', parseOrbLivePrices(prices));
  metrics.recordUsage({
    promptTokenCount: 30, responseTokenCount: 40, totalTokenCount: 70,
    promptTokensDetails: [{ modality: 'TEXT', tokenCount: 10 }, { modality: 'AUDIO', tokenCount: 20 }],
    responseTokensDetails: [{ modality: 'AUDIO', tokenCount: 40 }],
  });
  metrics.setConnection('test-model', prices);
  metrics.recordUsage({
    prompt_token_count: 10, response_token_count: 5,
    prompt_tokens_details: [{ modality: 'text', token_count: 10 }],
    response_tokens_details: [{ modality: 'text', token_count: 5 }],
  });
  const snapshot = metrics.snapshot();
  assert.equal(snapshot.reports, 2);
  assert.deepEqual([snapshot.input, snapshot.output, snapshot.total], [40, 45, 85]);
  assert.ok(Math.abs(snapshot.estimatedUsd! - 0.00043) < 1e-12);
});

test('never estimates unknown rates or missing modality data', () => {
  assert.equal(parseOrbLivePrices({ ...prices, inputAudio: -4 }), null);
  const metrics = createOrbSessionMetrics();
  assert.equal(metrics.snapshot().reports, 0);
  metrics.setConnection('model', prices);
  metrics.recordUsage({ totalTokenCount: 20 });
  assert.equal(metrics.snapshot().total, 20);
  assert.equal(metrics.snapshot().estimatedUsd, null);
});

test('measures the first scheduled audio once and preserves duration across reconnects', () => {
  let now = 0;
  const metrics = createOrbSessionMetrics(() => now);
  now = 300;
  metrics.startTurn('hold');
  now = 500;
  metrics.startTurn('realtime');
  now = 900;
  metrics.responseAudio(20);
  metrics.responseAudio(30);
  metrics.setConnection('reconnected', null);
  now = 1100;
  metrics.startTurn('text');
  now = 1300;
  metrics.responseAudio(20);
  now = 3000;
  metrics.finish();
  now = 3500;
  const snapshot = metrics.snapshot();
  assert.equal(snapshot.durationMs, 3000);
  assert.equal(snapshot.responses, 2);
  assert.equal(snapshot.lastLatencyMs, 220);
  assert.equal(snapshot.averageLatencyMs, 420);
});
