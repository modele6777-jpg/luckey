import { test } from 'node:test';
import assert from 'node:assert/strict';
import { synthesizeSpeechWithFallback, synthesizeWithGemini } from '../api/ai/tts';
import { createTTSHandler } from '../server/api-lib/ttsHandler';

test('Gemini requires configured credentials and reports rate limits after bounded model failover', async () => {
  let requests = 0;
  const quota = async () => { requests++; return new Response('{}', { status: 429 }); };
  await assert.rejects(
    synthesizeWithGemini('설명', 'Aoede', { request: quota as typeof fetch }),
    error => (error as any).status === 503 && (error as any).code === 'TTS_NOT_CONFIGURED',
  );
  assert.equal(requests, 0, 'no source-embedded/demo credential may trigger a request');
  await assert.rejects(
    synthesizeWithGemini('설명', 'Aoede', { apiKey: 'test-only', request: quota as typeof fetch, models: ['configured-a', 'configured-b'] }),
    error => (error as any).status === 429 && (error as any).code === 'MEDIA_RATE_LIMIT',
  );
  assert.equal(requests, 2, 'try one alternate model, then surface the provider rate limit');
});

test('Gemini 429 falls through to Edge, but an Edge failure does not mask the rate-limit cause', async () => {
  const attempts: string[] = [];
  const edge = createTTSHandler(async () => {
    attempts.push('edge');
    throw Object.assign(new Error('private Edge response'), { status: 403 });
  });

  await assert.rejects(
    synthesizeSpeechWithFallback('낭독 문장', 'Aoede', '차분', {
      synthesizeGemini: async () => {
        attempts.push('gemini');
        throw Object.assign(new Error('quota'), { status: 429, code: 'MEDIA_RATE_LIMIT' });
      },
      synthesizeEdge: edge,
    }),
    error => {
      assert.equal((error as any).status, 429);
      assert.equal((error as any).code, 'MEDIA_RATE_LIMIT');
      assert.doesNotMatch((error as Error).message, /private Edge response/);
      return true;
    },
  );
  assert.deepEqual(attempts, ['gemini', 'edge']);
});

test('Gemini invalid-key and model-permission responses are classified without exposing the key', async () => {
  const cases = [
    { status: 401, payload: { error: { status: 'UNAUTHENTICATED', details: [{ reason: 'API_KEY_INVALID' }] } }, code: 'GEMINI_API_KEY_INVALID' },
    { status: 400, payload: { error: { status: 'INVALID_ARGUMENT', message: 'API key not valid. Please pass a valid API key.' } }, code: 'GEMINI_API_KEY_INVALID' },
    { status: 403, payload: { error: { status: 'PERMISSION_DENIED', details: [{ reason: 'API_KEY_SERVICE_BLOCKED' }] } }, code: 'GEMINI_TTS_ACCESS_DENIED' },
  ];
  for (const item of cases) {
    await assert.rejects(
      synthesizeWithGemini('확인 문장', 'Aoede', {
        apiKey: 'test-only-secret', models: ['model'],
        request: async () => Response.json(item.payload, { status: item.status }),
      }),
      error => {
        assert.equal((error as any).status, item.status);
        assert.equal((error as any).code, item.code);
        assert.doesNotMatch((error as Error).message, /test-only-secret/);
        return true;
      },
    );
  }
});

test('Gemini retries a transient server error once, then returns neural audio', async () => {
  const audio = Buffer.from('RIFF\u0000\u0000\u0000\u0000WAVEtest').toString('base64');
  let requests = 0, waited = 0;
  const result = await synthesizeWithGemini('짧은 확인', 'Aoede', {
    apiKey: 'test-only', models: ['model'], delay: async ms => { waited += ms; },
    request: async () => {
      requests++;
      if (requests === 1) return Response.json({}, { status: 503 });
      return Response.json({ output_audio: { data: audio, mime_type: 'audio/wav' } });
    },
  });
  assert.equal(requests, 2);
  assert.equal(waited, 250);
  assert.equal(result?.provider, 'gemini');
});

test('Gemini 429 can recover through successful Edge audio', async () => {
  const result = await synthesizeSpeechWithFallback('낭독 문장', 'Aoede', '차분', {
    synthesizeGemini: async () => { throw Object.assign(new Error('quota'), { status: 429, code: 'MEDIA_RATE_LIMIT' }); },
    synthesizeEdge: async () => ({ audioContent: 'ZWRnZQ==', encoding: 'mp3', sampleRate: 24000, provider: 'edge-neural' }),
  });
  assert.equal(result.provider, 'edge-neural');
  assert.equal(result.audioContent, 'ZWRnZQ==');
});

test('Gemini Lite neural TTS can serve when the preferred model is rate-limited', async () => {
  const audio = Buffer.from('RIFF\u0000\u0000\u0000\u0000WAVEtest').toString('base64');
  const attemptedModels: string[] = [];
  const result = await synthesizeWithGemini('안녕하세요.', 'Aoede', {
    apiKey: 'test-only',
    models: ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'],
    request: async (_url, init) => {
      const model = JSON.parse(String(init?.body)).model;
      attemptedModels.push(model);
      if (model === 'gemini-3.8-flash-tts') return new Response('{}', { status: 429 });
      return Response.json({ output_audio: { data: audio, mime_type: 'audio/wav' } });
    },
  });
  assert.deepEqual(attemptedModels, ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts']);
  assert.equal(result?.audioContent, audio);
  assert.equal(result?.provider, 'gemini');
});

test('Gemini 3.8 Interactions TTS returns WAV from the REST audio step', async () => {
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
