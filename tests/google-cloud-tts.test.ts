import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chirpVoiceName, splitForCloudTts, synthesizeChirpSpeech } from '../server/api-lib/googleCloudTts';
import { synthesizePreferredSpeech, resetCloudTtsCooldown, cloudTtsStatus } from '../server/api-lib/preferredSpeech';
import { resetCloudGeminiTts } from '../server/api-lib/googleCloudTts';
import { signServiceAccountJwt, getServiceAccountToken, readServiceAccount, resetServiceAccountTokenCache } from '../server/api-lib/googleServiceAccount';
import { generateKeyPairSync, createVerify } from 'node:crypto';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const credentials = JSON.stringify({
  type: 'service_account', project_id: 'lucky-test', client_email: 'tts@lucky-test.iam.gserviceaccount.com',
  private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
});
const tokenOk = () => new Response(JSON.stringify({ access_token: 'ya29.test', expires_in: 3600 }), { status: 200 });

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

const isCloudGemini = (init: any) => String(init?.body || '').includes('model_name');

test('when Gemini runs out of quota, the same Gemini voice reads through Cloud TTS and Gemini is skipped', async () => {
  resetCloudTtsCooldown(); resetCloudGeminiTts();
  const calls: { url: string; cloudGemini: boolean }[] = [];
  const fetchApi = (async (url: string, init: any) => {
    if (String(url).includes('oauth2')) return tokenOk();
    calls.push({ url: String(url), cloudGemini: isCloudGemini(init) });
    if (isCloudGemini(init)) assert.equal(init.headers.Authorization, 'Bearer ya29.test');
    return String(url).includes('texttospeech') ? chirpOk() : geminiDaily();
  }) as typeof fetch;
  const env = { GEMINI_API_KEY: 'g', GOOGLE_CLOUD_TTS_API_KEY: 'c', GOOGLE_CLOUD_TTS_CREDENTIALS: credentials };
  resetServiceAccountTokenCache();
  const first = await synthesizePreferredSpeech('안녕.', 'Kore', env, fetchApi);
  assert.equal(first.provider, 'google-cloud-gemini-tts');
  assert.equal(first.voice, 'Kore');
  assert.ok(cloudTtsStatus().geminiSkippedSeconds > 3000);
  calls.length = 0;
  const second = await synthesizePreferredSpeech('또 안녕.', 'Kore', env, fetchApi);
  assert.equal(second.provider, 'google-cloud-gemini-tts');
  assert.ok(calls.every(call => call.url.includes('texttospeech')), 'AI Studio Gemini is not asked again during its cooldown');
  resetCloudTtsCooldown(); resetCloudGeminiTts();
});

test('an unknown Cloud Gemini model name tries the next one, and Chirp 3 HD is the last resort', async () => {
  resetCloudTtsCooldown(); resetCloudGeminiTts();
  const models: string[] = [];
  resetServiceAccountTokenCache();
  const fetchApi = (async (url: string, init: any) => {
    if (String(url).includes('oauth2')) return tokenOk();
    if (!String(url).includes('texttospeech')) return geminiDaily();
    if (isCloudGemini(init)) {
      const model = JSON.parse(init.body).voice.model_name;
      models.push(model);
      return new Response(JSON.stringify({ error: { status: 'INVALID_ARGUMENT' } }), { status: 400 });
    }
    return chirpOk();
  }) as typeof fetch;
  const result = await synthesizePreferredSpeech('안녕.', 'Aoede', { GEMINI_API_KEY: 'g', GOOGLE_CLOUD_TTS_API_KEY: 'c', GOOGLE_CLOUD_TTS_CREDENTIALS: credentials }, fetchApi);
  assert.equal(result.provider, 'google-cloud-chirp3-hd');
  assert.ok(models.length >= 2, 'tries more than one model name');
  resetCloudTtsCooldown(); resetCloudGeminiTts();
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

test('the service-account JWT is RS256-signed and verifiable, and the token is reused', async () => {
  const account = readServiceAccount(credentials)!;
  const jwt = await signServiceAccountJwt(account, 1_800_000_000);
  const [header, claims, signature] = jwt.split('.');
  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${header}.${claims}`);
  assert.ok(verifier.verify(publicKey, Buffer.from(signature, 'base64url')));
  const payload = JSON.parse(Buffer.from(claims, 'base64url').toString());
  assert.equal(payload.iss, 'tts@lucky-test.iam.gserviceaccount.com');
  assert.equal(payload.scope, 'https://www.googleapis.com/auth/cloud-platform');
  resetServiceAccountTokenCache();
  let tokenCalls = 0;
  const fetchApi = (async () => { tokenCalls++; return tokenOk(); }) as typeof fetch;
  assert.equal(await getServiceAccountToken(account, fetchApi), 'ya29.test');
  assert.equal(await getServiceAccountToken(account, fetchApi), 'ya29.test');
  assert.equal(tokenCalls, 1);
  resetServiceAccountTokenCache();
});

test('without a service account, Cloud Gemini-TTS is not attempted', async () => {
  resetCloudTtsCooldown(); resetCloudGeminiTts();
  const calls: boolean[] = [];
  const fetchApi = (async (url: string, init: any) => {
    if (!String(url).includes('texttospeech')) return geminiDaily();
    calls.push(isCloudGemini(init));
    return chirpOk();
  }) as typeof fetch;
  const result = await synthesizePreferredSpeech('안녕.', 'Aoede', { GEMINI_API_KEY: 'g', GOOGLE_CLOUD_TTS_API_KEY: 'c' }, fetchApi);
  assert.equal(result.provider, 'google-cloud-chirp3-hd');
  assert.deepEqual(calls, [false]);
  resetCloudTtsCooldown(); resetCloudGeminiTts();
});
