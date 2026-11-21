import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chirpVoiceName, splitForCloudTts, synthesizeChirpSpeech } from '../server/api-lib/googleCloudTts';
import { synthesizePreferredSpeech, resetCloudTtsCooldown, cloudTtsStatus } from '../server/api-lib/preferredSpeech';

const mp3 = btoa('ID3fake-mp3');

test('Lucy voices map to the same-named Korean Chirp 3 HD voices', () => {
  assert.equal(chirpVoiceName('Aoede'), 'ko-KR-Chirp3-HD-Aoede');
  assert.equal(chirpVoiceName('Charon'), 'ko-KR-Chirp3-HD-Charon');
  assert.equal(chirpVoiceName('unknown'), 'ko-KR-Chirp3-HD-Aoede');
});

test('long text is split under the request size limit without losing words', () => {
  const text = ('오늘 하루를 천천히 돌아보며 마음을 정리해 봐요. ').repeat(120);
  const parts = splitForCloudTts(text);
  assert.ok(parts.length > 1);
  assert.ok(parts.every(part => part.length <= 1400));
  assert.equal(parts.join(' ').replace(/\s/g, ''), text.replace(/\s/g, ''));
});

test('Chirp 3 HD request uses the key header and returns mp3', async () => {
  let seen: any = null;
  const fetchApi = (async (url: string, init: any) => { seen = { url, init }; return new Response(JSON.stringify({ audioContent: mp3 }), { status: 200 }); }) as typeof fetch;
  const result = await synthesizeChirpSpeech('안녕, 루시야.', 'Kore', { GOOGLE_CLOUD_TTS_API_KEY: 'k' }, fetchApi);
  assert.equal(result.encoding, 'mp3');
  assert.equal(result.voice, 'ko-KR-Chirp3-HD-Kore');
  assert.match(seen.url, /texttospeech\.googleapis\.com\/v1\/text:synthesize$/);
  assert.equal(seen.init.headers['x-goog-api-key'], 'k');
  assert.equal(JSON.parse(seen.init.body).voice.name, 'ko-KR-Chirp3-HD-Kore');
});

test('a disabled Cloud TTS API falls back to Gemini and is skipped for a while', async () => {
  resetCloudTtsCooldown();
  const calls: string[] = [];
  const fetchApi = (async (url: string) => {
    calls.push(String(url));
    if (String(url).includes('texttospeech')) {
      return new Response(JSON.stringify({ error: { status: 'PERMISSION_DENIED', details: [{ reason: 'SERVICE_DISABLED' }] } }), { status: 403 });
    }
    const pcm = btoa('\u0000\u0000\u0000\u0000');
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ inlineData: { data: pcm, mimeType: 'audio/L16;rate=24000' } }] } }] }), { status: 200 });
  }) as typeof fetch;
  const env = { GEMINI_API_KEY: 'g' };
  const first = await synthesizePreferredSpeech('안녕.', 'Aoede', env, fetchApi);
  assert.equal(first.provider, 'gemini');
  assert.deepEqual(cloudTtsStatus().lastFailure, { status: 403, providerCode: 'SERVICE_DISABLED' });
  assert.equal(cloudTtsStatus().skipped, true);
  calls.length = 0;
  await synthesizePreferredSpeech('또 안녕.', 'Aoede', env, fetchApi);
  assert.ok(calls.every(url => !url.includes('texttospeech')), 'Cloud TTS is skipped during the cooldown');
  resetCloudTtsCooldown();
});
