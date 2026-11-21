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

test('Chirp 3 HD request sends the API key as the key parameter and returns mp3', async () => {
  let seen: any = null;
  const fetchApi = (async (url: string, init: any) => { seen = { url, init }; return new Response(JSON.stringify({ audioContent: mp3 }), { status: 200 }); }) as typeof fetch;
  const result = await synthesizeChirpSpeech('안녕, 루시야.', 'Kore', { GOOGLE_CLOUD_TTS_API_KEY: 'k' }, fetchApi);
  assert.equal(result.encoding, 'mp3');
  assert.equal(result.voice, 'ko-KR-Chirp3-HD-Kore');
  assert.match(seen.url, /texttospeech\.googleapis\.com\/v1\/text:synthesize\?key=k$/);
  assert.equal(JSON.parse(seen.init.body).voice.name, 'ko-KR-Chirp3-HD-Kore');
});

const geminiOk = () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ inlineData: { data: btoa('\u0000\u0000\u0000\u0000'), mimeType: 'audio/L16;rate=24000' } }] } }] }), { status: 200 });
const geminiDaily = () => new Response(JSON.stringify({ error: { code: 429, details: [
  { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier' }] },
  { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '3600s' },
] } }), { status: 429 });
const chirpOk = () => new Response(JSON.stringify({ audioContent: mp3 }), { status: 200 });

test('Gemini reads first while it has quota', async () => {
  resetCloudTtsCooldown();
  const calls: string[] = [];
  const fetchApi = (async (url: string) => { calls.push(String(url)); return String(url).includes('texttospeech') ? chirpOk() : geminiOk(); }) as typeof fetch;
  const result = await synthesizePreferredSpeech('안녕.', 'Aoede', { GEMINI_API_KEY: 'g' }, fetchApi);
  assert.equal(result.provider, 'gemini');
  assert.ok(calls.every(url => !url.includes('texttospeech')));
});

test('when Gemini runs out of quota, Chirp 3 HD reads and Gemini is skipped until its retry time', async () => {
  resetCloudTtsCooldown();
  const calls: string[] = [];
  const fetchApi = (async (url: string) => { calls.push(String(url)); return String(url).includes('texttospeech') ? chirpOk() : geminiDaily(); }) as typeof fetch;
  const env = { GEMINI_API_KEY: 'g' };
  const first = await synthesizePreferredSpeech('안녕.', 'Kore', env, fetchApi);
  assert.equal(first.provider, 'google-cloud-chirp3-hd');
  assert.equal(first.voice, 'ko-KR-Chirp3-HD-Kore');
  assert.ok(cloudTtsStatus().geminiSkippedSeconds > 3000);
  calls.length = 0;
  const second = await synthesizePreferredSpeech('또 안녕.', 'Kore', env, fetchApi);
  assert.equal(second.provider, 'google-cloud-chirp3-hd');
  assert.ok(calls.every(url => url.includes('texttospeech')), 'Gemini is not asked again during its cooldown');
  resetCloudTtsCooldown();
});

test('if both engines fail, the app hears Gemini\'s reason (e.g. daily quota)', async () => {
  resetCloudTtsCooldown();
  const fetchApi = (async (url: string) => String(url).includes('texttospeech')
    ? new Response(JSON.stringify({ error: { status: 'UNAUTHENTICATED', details: [{ reason: 'CREDENTIALS_MISSING' }] } }), { status: 401 })
    : geminiDaily()) as typeof fetch;
  const error = await synthesizePreferredSpeech('안녕.', 'Aoede', { GEMINI_API_KEY: 'g' }, fetchApi).catch(e => e);
  assert.equal(error.providerCode, 'DAILY_LIMIT_EXCEEDED');
  assert.equal(cloudTtsStatus().skipped, true);
  resetCloudTtsCooldown();
});
