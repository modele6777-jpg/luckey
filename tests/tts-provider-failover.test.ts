import { test } from 'node:test';
import assert from 'node:assert/strict';
import { synthesizeWithGemini } from '../api/ai/tts';
import { createTTSHandler } from '../server/api-lib/ttsHandler';

test('Gemini requires configured credentials and does not retry account failures across models', async () => {
  let requests = 0;
  const quota = async () => { requests++; return new Response('{}', { status: 429 }); };
  assert.equal(await synthesizeWithGemini('설명', 'Aoede', { request: quota as typeof fetch }), null);
  assert.equal(requests, 0, 'no source-embedded/demo credential may trigger a request');
  assert.equal(await synthesizeWithGemini('설명', 'Aoede', { apiKey: 'test-only', request: quota as typeof fetch, models: ['configured-a', 'configured-b'] }), null);
  assert.equal(requests, 1, 'account quota affects all models, so do not try another model');
  await synthesizeWithGemini('다음 구간', 'Aoede', { apiKey: 'test-only', request: quota as typeof fetch, models: ['configured-a'] });
  assert.equal(requests, 1, 'the unavailable provider must cool down instead of failing every chunk');
});

test('backup authorization failures surface as non-retryable provider unavailability', async () => {
  let requests = 0;
  const handle = createTTSHandler(async () => { requests++; throw Object.assign(new Error('access denied'), { status: 403 }); });
  await assert.rejects(handle({ text: '낭독 문장' }), error => (error as any).code === 'TTS_PROVIDER_UNAVAILABLE');
  await assert.rejects(handle({ text: '다음 문장' }), error => (error as any).code === 'TTS_PROVIDER_UNAVAILABLE');
  assert.equal(requests, 1);
});
