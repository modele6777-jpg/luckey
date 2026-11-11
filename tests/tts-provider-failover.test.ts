import { test } from 'node:test';
import assert from 'node:assert/strict';
import { synthesizeWithGemini } from '../api/ai/tts';
import { createTTSHandler } from '../server/api-lib/ttsHandler';

test('Gemini requires configured credentials and does not retry account quota failures across models', async () => {
  let requests = 0;
  const quota = async () => { requests++; return new Response('{}', { status: 429 }); };
  assert.equal(await synthesizeWithGemini('설명', 'Aoede', { request: quota as typeof fetch }), null);
  assert.equal(requests, 0, 'no source-embedded/demo credential may trigger a request');
  assert.equal(await synthesizeWithGemini('설명', 'Aoede', { apiKey: 'test-only', request: quota as typeof fetch, models: ['configured-a', 'configured-b'] }), null);
  assert.equal(requests, 1, 'account quota affects all models, so do not try another model');
});

test('Gemini 3.8 Interactions TTS returns WAV from the documented REST audio step', async () => {
  const audio = Buffer.from('RIFF\u0000\u0000\u0000\u0000WAVEtest').toString('base64');
  const result = await synthesizeWithGemini('안녕하세요.', 'Aoede', {
    apiKey: 'test-only',
    models: ['gemini-3.8-flash-tts'],
    request: async (url, init) => {
      assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
      const headers = new Headers(init?.headers);
      assert.equal(headers.get('x-goog-api-key'), 'test-only');
      assert(!String(url).includes('test-only'), 'credentials must not be placed in the URL');
      const body = JSON.parse(String(init?.body));
      assert.equal(body.model, 'gemini-3.8-flash-tts');
      assert.equal(body.input[0].content[0].text, '안녕하세요.');
      assert.match(body.input[0].content[0].annotations[0].style, /natural/i);
      assert.equal(body.generation_config.speech_config[0].voice, 'Aoede');
      return Response.json({ steps: [{ type: 'model_output', content: [{ type: 'audio', mime_type: 'audio/wav', data: audio }] }] });
    },
  });
  assert.deepEqual(result, { audioContent: audio, encoding: 'wav', sampleRate: 24000, voice: 'Aoede', provider: 'gemini' });
});

test('Gemini raw Linear PCM is wrapped as WAV for the shared audio player', async () => {
  const pcm = Buffer.from([0, 0, 1, 0, 2, 0, 3, 0]).toString('base64');
  const result = await synthesizeWithGemini('짧은 테스트', 'Charon', {
    apiKey: 'test-only',
    models: ['gemini-3.8-flash-lite-tts'],
    request: async () => Response.json({ output_audio: { data: pcm, mime_type: 'audio/l16;rate=24000' } }),
  });
  assert.equal(result?.encoding, 'wav');
  assert.equal(result?.voice, 'Charon');
  const wav = Buffer.from(result!.audioContent, 'base64');
  assert.equal(wav.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(wav.subarray(8, 12).toString('ascii'), 'WAVE');
});

test('backup authorization failures surface as non-retryable provider unavailability', async () => {
  let requests = 0;
  const handle = createTTSHandler(async () => { requests++; throw Object.assign(new Error('access denied'), { status: 403 }); });
  await assert.rejects(handle({ text: '낭독 문장' }), error => (error as any).code === 'TTS_PROVIDER_UNAVAILABLE');
  await assert.rejects(handle({ text: '다음 문장' }), error => (error as any).code === 'TTS_PROVIDER_UNAVAILABLE');
  assert.equal(requests, 1);
});

test('browser speech synthesis and translator TTS remain excluded', async () => {
  const fs = await import('node:fs');
  const client = fs.readFileSync(new URL('../src/utils/tts.ts', import.meta.url), 'utf8');
  const server = fs.readFileSync(new URL('../api/ai/tts.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(client, /speechSynthesis\.speak\s*\(|new\s+SpeechSynthesisUtterance/);
  assert.doesNotMatch(server, /translate_tts|google-tts-api|translate\.google\.com/i);
});
