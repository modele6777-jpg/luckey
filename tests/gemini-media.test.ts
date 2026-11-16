import assert from 'node:assert/strict';
import test from 'node:test';
import { geminiKey, generateGeminiImage, synthesizeGeminiSpeech } from '../server/api-lib/geminiMedia.ts';
import { handleSitesApi } from '../server/sites-api.ts';
const env = { gemini: 'test-secret', OPENAI_API_KEY: 'ignored', AI_PROVIDER: 'openai' };
test('Gemini credentials ignore other provider configuration', () => {
  assert.equal(geminiKey(env), 'test-secret');
  assert.equal(geminiKey({ AI_API_KEY: 'sk-foreign' }), '');
});
test('TTS converts Gemini PCM to playable mono WAV without Vercel relay', async () => {
  const fetchApi: typeof fetch = async (url, options) => {
    assert.match(String(url), /^https:\/\/generativelanguage.googleapis.com\/.*tts(?:-preview)?:generateContent$/);
    assert.equal((options?.headers as any)['x-goog-api-key'], 'test-secret');
    assert.equal((options?.headers as any).Cookie, undefined);
    const body = JSON.parse(String(options?.body));
    assert.deepEqual(body.generationConfig.responseModalities, ['AUDIO']);
    assert.equal(body.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName, 'Aoede');
    return Response.json({ candidates: [{ content: { parts: [{ inlineData: { data: 'AAABAA==', mimeType: 'audio/L16;codec=pcm;rate=24000' } }] } }] });
  };
  const response = await handleSitesApi(new Request('https://example.test/api/ai/tts', { method: 'POST', headers: { Cookie: 'private' }, body: JSON.stringify({ text: '안녕하세요.', voice: 'ko-KR-SunHiNeural' }) }), env, fetchApi);
  assert.equal(response!.status, 200);
  const audio = await response!.json() as any;
  assert.equal(audio.provider, 'gemini'); assert.equal(audio.encoding, 'wav');
  const wav = Buffer.from(audio.audioContent, 'base64');
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.readUInt32LE(24), 24000);
  assert.equal(wav.readUInt32LE(40), 4);
  assert.deepEqual([...wav.subarray(44)], [0, 0, 1, 0]);
});
test('Gemini TTS errors and malformed audio never return fake sound', async () => {
  await assert.rejects(synthesizeGeminiSpeech('hello', undefined, env, async () => new Response('secret', { status: 429 })), /Gemini 사용 한도/);
  await assert.rejects(synthesizeGeminiSpeech('hello', undefined, env, async () => Response.json({ candidates: [] })), /비어/);
});
test('Image creation uses Gemini only and preserves aspect ratio', async () => {
  const url = await generateGeminiImage('clover', env, '16:9', async (target, options) => {
    assert.match(String(target), /^https:\/\/generativelanguage.googleapis.com\/.*image:generateContent$/);
    assert.equal(JSON.parse(String(options?.body)).generationConfig.imageConfig.aspectRatio, '16:9');
    return Response.json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: 'aGVsbG8=' } }] } }] });
  });
  assert.equal(url, 'data:image/png;base64,aGVsbG8=');
});
