import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createTTSHandler } from '../server/api-lib/ttsHandler';
import { handleSitesApi, allowedArtworkUrl } from '../server/sites-api';
import { MUSE_ART_CATALOG } from '../server/api-lib/museArtCatalog';
import { resolveArtworkImage } from '../src/utils/artworkImage';

const env = { gemini: 'test-private-key' };
const request = (route: string, body: unknown) => new Request(`https://audit.invalid${route}`, { method: 'POST', body: JSON.stringify(body) });
const oracle = Object.fromEntries(['diagnosis', 'luckyNumber', 'luckyColor', 'remedy', 'symbol', 'frequency', 'spiritualEnergy', 'blessingMessage', 'focusPlaylist'].map(key => [key, `${key} 내용`]));
const cases: [string, any, any, (body: any) => void][] = [
  ['/api/ai', { prompt: '안녕' }, '안녕하세요', body => assert.equal(body.text, '안녕하세요')],
  ['/api/ai/analyze-entry', { content: '기쁜 하루' }, { keywords: ['하루'], emotions: ['기쁨'] }, body => assert.deepEqual(body.emotions, ['기쁨'])],
  ['/api/ai/recommend-art', { currentMood: '평온', dateKey: '2026-10-26' }, { whyRecommended: '마음의 여유', challenges: '색을 살펴보기\n음악 감상하기' }, body => { assert.ok(body.catalogId); assert.equal(body.challenges.length, 2); assert.equal(body.generationSource, 'gemini'); }],
  ['/api/ai/daily-tarot', { card: { nameKo: '별', reversed: true } }, oracle, body => { assert.ok(body.diagnosis); assert.equal('frequency' in body, false); }],
  ['/api/ai/daily-sedona', { card: { nameKo: '허용' } }, oracle, body => { assert.ok(body.remedy); assert.equal('frequency' in body, false); }],
  ['/api/ai/secret-blessing', { content: '마음이 무거워요' }, { comfortMantra: '잠시 쉬어도 괜찮아요.' }, body => assert.ok(body.comfortMantra)],
  ['/api/ai/secret-mood-recommend', { content: '고맙습니다' }, { moodTag: 'gratitude', reason: '감사의 표현' }, body => assert.equal(body.moodLabel, '비밀 감사')],
  ['/api/muse/docent', { title: '별이 빛나는 밤', creator: '반 고흐', messages: [{ role: 'user', content: '색을 설명해 주세요.' }], mode: 'audio' }, '작품의 푸른 하늘을 살펴보세요.', body => assert.ok(body.reply)],
  ['/api/bluebird/docent', { title: '숲', theme: '차분함', prompt: '숲 풍경' }, '숲의 초록색이 인상적입니다.', body => assert.ok(body.reply)],
];
for (const [route, body, answer, check] of cases) test(`native contract: ${route}`, async () => {
  const fetcher = async (url: any, options: any) => {
    assert.equal(String(url), 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-private-key');
    const payload = JSON.parse(options.body);
    assert.ok(payload.messages.length);
    assert.equal(payload.reasoning_effort, 'minimal');
    return Response.json({ choices: [{ message: { content: typeof answer === 'string' ? answer : JSON.stringify(answer) } }] });
  };
  const response = await handleSitesApi(request(route, body), env, fetcher as any);
  assert.equal(response?.status, 200); check(await response!.json());
});

test('Sites narration returns Edge MP3 and forwards both role-specific voices', async () => {
  const synthesize = createTTSHandler(async (speech, voice) => {
    assert.equal(speech, '안녕하세요.');
    return { audioContent: 'SUQzAQID', encoding: 'mp3', sampleRate: 24000, voice: voice || '', provider: 'edge-neural' };
  });
  for (const voice of ['Aoede', 'Charon']) {
    const response = await handleSitesApi(request('/api/ai/tts', { text: '<system>명령문</system>안녕하세요.', voice }), {}, fetch, synthesize);
    assert.equal(response?.status, 200);
    const result = await response!.json();
    assert.equal(result.encoding, 'mp3');
    assert.equal(result.provider, 'edge-neural');
    assert.equal(result.voice, voice);
    assert.equal(Buffer.from(result.audioContent, 'base64').toString('ascii', 0, 3), 'ID3');
  }
});

test('generated image returns real provider bytes and is labelled a replica for artwork', async () => {
  for (const route of ['/api/ai/image', '/api/muse/artwork-image']) {
    const response = await handleSitesApi(request(route, { prompt: '꽃', title: '새로운 꽃', creator: '테스트' }), env, (async () => Response.json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: 'iVBORw0KGgo=' } }] } }] })) as any);
    const result: any = await response!.json();
    assert.equal(result.imageUrl || result.url, 'data:image/png;base64,iVBORw0KGgo=');
    if (result.url) assert.equal(result.source, 'ai_replica');
  }
});

test('catalog artwork resolves without generating a replica', async () => {
  const art = MUSE_ART_CATALOG[0];
  const response = await handleSitesApi(request('/api/muse/artwork-image', { title: art.title, creator: art.creator }), env, (async () => { throw Error('No generation expected'); }) as any);
  const result: any = await response!.json();
  assert.equal(result.url, art.imageUrl); assert.match(result.displayUrl, /^\/api\/muse\/artwork-image\/proxy/);
});

test('BGM returns an actual 48 second stereo WAV without any API key', async () => {
  const response = await handleSitesApi(request('/api/ai/daily-bgm', { focusPlaylist: '평온', dateKey: '2026-10-26', trackKey: 'test' }), {});
  const result: any = await response!.json();
  const bytes = Buffer.from(result.audioContent, 'base64');
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF'); assert.equal(bytes.toString('ascii', 8, 12), 'WAVE');
  assert.equal(bytes.readUInt32LE(24), 22050); assert.equal(bytes.readUInt16LE(22), 2);
  assert.equal(bytes.readUInt32LE(40), 48 * 22050 * 4); assert.equal(result.durationSec, 48);
});

test('proxy blocks private addresses, userinfo, unexpected hosts and unsafe redirects', async () => {
  for (const url of ['http://upload.wikimedia.org/a.png', 'https://127.0.0.1/a', 'https://example.com/a', 'https://upload.wikimedia.org.evil.test/a', 'https://user@upload.wikimedia.org/a', 'https://upload.wikimedia.org:8443/a']) assert.equal(allowedArtworkUrl(url), null);
  const response = await handleSitesApi(new Request('https://audit.invalid/api/muse/artwork-image/proxy?url=https://upload.wikimedia.org/a.png'), env, (async (_url, options) => {
    assert.equal(options.headers.Authorization, undefined); assert.equal(options.headers.Cookie, undefined);
    return new Response(null, { status: 302, headers: { Location: 'https://127.0.0.1/private' } });
  }) as any);
  assert.equal(response?.status, 400);
});

test('proxy serves image bytes and rejects non-images', async () => {
  const req = () => new Request('https://audit.invalid/api/muse/artwork-image/proxy?url=https://upload.wikimedia.org/a.png');
  const good = await handleSitesApi(req(), env, (async () => new Response(new Uint8Array([1, 2, 3]), { headers: { 'Content-Type': 'image/png' } })) as any);
  assert.equal(good?.status, 200); assert.equal(good?.headers.get('Content-Type'), 'image/png');
  const bad = await handleSitesApi(req(), env, (async () => new Response('<html>', { headers: { 'Content-Type': 'text/html' } })) as any);
  assert.equal(bad?.status, 502);
});

test('invalid input, missing keys, bad AI schemas and provider errors stay explicit', async () => {
  assert.equal((await handleSitesApi(request('/api/ai/daily-tarot', {}), env))?.status, 400);
  assert.equal((await handleSitesApi(request('/api/ai/image', { prompt: 'hello' }), {}))?.status, 503);
  assert.equal((await handleSitesApi(new Request('https://audit.invalid/api/ai', { method: 'POST', body: '{' }), env))?.status, 400);
  assert.equal((await handleSitesApi(new Request('https://audit.invalid/api/ai/tts'), env))?.status, 405);
  const invalid = await handleSitesApi(request('/api/ai/secret-mood-recommend', { content: '마음' }), env, (async () => Response.json({ choices: [{ message: { content: '{"moodTag":"invalid","reason":"test"}' } }] })) as any);
  assert.equal(invalid?.status, 502);
  for (const status of [403, 429, 500]) {
    const response = await handleSitesApi(request('/api/ai/image', { prompt: '꽃' }), env, (async () => new Response('test-private-key', { status })) as any);
    assert.equal(response?.status, status === 500 ? 502 : status);
    assert.ok(!(await response!.text()).includes('test-private-key'));
  }
  assert.equal(await handleSitesApi(new Request('https://audit.invalid/api/sync/relay/consume'), env), null);
});

test('text interpretation does not send profile photos and keeps relevant context', async () => {
  const response = await handleSitesApi(request('/api/ai/daily-tarot', { card: { nameKo: '별' }, profile: { basic: { nickname: '테스트', birthdate: '2000-01-01', avatarUrl: 'data:image/png;base64,PRIVATE_PHOTO' } } }), env, (async (_url, options) => {
    const payload = JSON.parse(options.body);
    assert.ok(!payload.messages[1].content.includes('PRIVATE_PHOTO'));
    assert.ok(payload.messages[1].content.includes('2000-01-01'));
    return Response.json({ choices: [{ message: { content: JSON.stringify(oracle) } }] });
  }) as any);
  assert.equal(response?.status, 200);
});

test('generic API preserves schema and explicit image inputs', async () => {
  const response = await handleSitesApi(request('/api/ai', { prompt: '이미지 확인', systemInstruction: '짧게 답하세요', responseSchema: { type: 'OBJECT' }, imageData: 'iVBORw0KGgo=', mimeType: 'image/png' }), env, (async (_url, options) => {
    const payload = JSON.parse(options.body);
    assert.equal(payload.response_format.type, 'json_object');
    assert.ok(payload.messages.some(message => Array.isArray(message.content) && message.content[1]?.image_url?.url === 'data:image/png;base64,iVBORw0KGgo='));
    return Response.json({ choices: [{ message: { content: '{"ok":true}' } }] });
  }) as any);
  assert.equal((await response!.json() as any).text, '{"ok":true}');
});

test('oversize requests fail before any provider call', async () => {
  const req = new Request('https://audit.invalid/api/ai', { method: 'POST', headers: { 'Content-Length': '9000000' }, body: '{}' });
  const response = await handleSitesApi(req, env, (async () => { throw Error('Must not call Google'); }) as any);
  assert.equal(response?.status, 413);
});

test('transient text-provider failures retry once, quota errors never retry', async () => {
  let calls = 0;
  const response = await handleSitesApi(request('/api/ai', { prompt: '안녕' }), env, (async () => {
    calls++;
    return calls === 1 ? new Response('', { status: 503 }) : Response.json({ choices: [{ message: { content: '안녕하세요' } }] });
  }) as any);
  assert.equal(response?.status, 200); assert.equal(calls, 2);
  calls = 0;
  const quota = await handleSitesApi(request('/api/ai', { prompt: '안녕' }), env, (async () => { calls++; return new Response('', { status: 429 }); }) as any);
  assert.equal(quota?.status, 429); assert.equal(calls, 1);
});

test('image client exposes a quota error instead of inventing a fallback URL', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => Response.json({ error: '이미지 생성 한도를 확인해 주세요.' }, { status: 429 })) as any;
  try {
    await assert.rejects(() => resolveArtworkImage({ title: '꽃', creator: '테스트', artworkType: '그림', era: '현대', description: '파란 꽃', aestheticTone: '파랑' }), /이미지 생성 한도/);
  } finally { globalThis.fetch = original; }
});


test('instructions-only speech is rejected before synthesis', async () => {
  const synthesize = createTTSHandler(async () => { assert.fail('unexpected synthesis'); });
  const response = await handleSitesApi(request('/api/ai/tts', { text: '<system>명령문만</system>' }), {}, fetch, synthesize);
  assert.equal(response?.status, 400);
});

test('Sites Gemini TTS maps provider authentication and permission failures to safe app-level codes', async () => {
  for (const scenario of [
    { status: 401, code: 'GEMINI_API_KEY_INVALID' },
    { status: 403, code: 'GEMINI_TTS_ACCESS_DENIED' },
  ]) {
    const response = await handleSitesApi(request('/api/ai/tts', { text: '안녕하세요.' }), env, async () =>
      Response.json({ error: { message: 'private provider response' } }, { status: scenario.status }));
    assert.equal(response?.status, 503);
    const result = await response!.json();
    assert.equal(result.code, scenario.code);
    assert.doesNotMatch(JSON.stringify(result), /private provider response|test-private-key/);
  }
});

test('Sites reports a rejected speech provider without retrying it or exposing its response', async () => {
  let calls = 0;
  const synthesize = createTTSHandler(async () => {
    calls++;
    throw Object.assign(new Error('private upstream details'), { status: 403 });
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await handleSitesApi(request('/api/ai/tts', { text: '안녕하세요.' }), {}, fetch, synthesize);
    assert.equal(response?.status, 503);
    const result = await response!.json();
    assert.equal(result.code, 'TTS_ACCESS_DENIED');
    assert.ok(result.diagnosticId);
    assert.equal(response!.headers.get('X-TTS-Diagnostic-ID'), result.diagnosticId);
    assert.ok(!JSON.stringify(result).includes('private upstream details'));
  }
  assert.equal(calls, 1);
});

test('image rate limits preserve provider RetryInfo', async () => {
  const response = await handleSitesApi(request('/api/ai/image', { prompt: '꽃' }), env, async () =>
    Response.json({ error: { details: [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '7.2s' }] } }, { status: 429 }));
  assert.equal(response?.status, 429);
  assert.equal(response?.headers.get('Retry-After'), '8');
  assert.equal((await response!.json()).code, 'MEDIA_RATE_LIMIT');
});

test('daily and zero image quotas do not promise recovery after a minute', async () => {
  const response = await handleSitesApi(request('/api/ai/image', { prompt: '꽃' }), env, async () =>
    Response.json({ error: { details: [{ '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId: 'GenerateRequestsPerDay', quotaValue: '0' }] }] } }, { status: 429 }));
  assert.equal(response?.status, 429);
  assert.equal(response?.headers.get('Retry-After'), null);
  assert.equal((await response!.json()).code, 'MEDIA_QUOTA_EXHAUSTED');
});

test('health reports the configured AI provider and independent speech provider', async () => {
  const response = await handleSitesApi(new Request('https://test.invalid/api/health'), { gemini: 'gemini-test-secret', 'open ai': 'openai-test-secret' });
  const health = await response!.json();
  assert.equal(health.provider, 'gemini');
  assert.equal(health.speechProvider, 'gemini');
  assert.ok(!JSON.stringify(health).includes('openai-test-secret'));
});

test('Sites issues only a single-use Live token through Gemini v1beta', async () => {
  const response = await handleSitesApi(request('/api/ai/live-token', { orb: true, voice: 'Aoede' }), env, async (url, init) => {
    assert.equal(String(url), 'https://generativelanguage.googleapis.com/v1beta/auth_tokens');
    assert.equal(new Headers(init?.headers).get('x-goog-api-key'), env.gemini);
    const body = JSON.parse(String(init?.body));
    assert.equal(body.uses, 1);
    assert.equal(body.bidiGenerateContentSetup.model, 'models/gemini-3.8-live');
    assert.ok(body.bidiGenerateContentSetup.tools[0].functionDeclarations.length > 0);
    return Response.json({ name: 'auth_tokens/test-session' });
  });
  assert.equal(response?.status, 200);
  assert.equal(response?.headers.get('Cache-Control'), 'no-store');
  const body = await response!.json();
  assert.equal(body.token, 'auth_tokens/test-session');
  assert.ok(!JSON.stringify(body).includes(env.gemini));
});

test('Sites reports missing Live credentials without calling Gemini', async () => {
  const response = await handleSitesApi(request('/api/ai/live-token', {}), {}, async () => assert.fail('unexpected request'));
  assert.equal(response?.status, 503);
  assert.equal((await response!.json()).code, 'GEMINI_API_KEY_MISSING');
});
