import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleSitesApi, allowedArtworkUrl, pcmToWav } from '../server/sites-api';
import { MUSE_ART_CATALOG } from '../server/api-lib/museArtCatalog';
import { resolveArtworkImage } from '../src/utils/artworkImage';

const env = { gemini: 'test-private-key' };
const request = (route: string, body: unknown) => new Request(`https://audit.invalid${route}`, { method: 'POST', body: JSON.stringify(body) });
const oracle = Object.fromEntries(['diagnosis', 'luckyNumber', 'luckyColor', 'remedy', 'symbol', 'frequency', 'spiritualEnergy', 'blessingMessage', 'focusPlaylist'].map(key => [key, `${key} 내용`]));
const cases: [string, any, any, (body: any) => void][] = [
  ['/api/ai', { prompt: '안녕' }, '안녕하세요', body => assert.equal(body.text, '안녕하세요')],
  ['/api/ai/analyze-entry', { content: '기쁜 하루' }, { keywords: ['하루'], emotions: ['기쁨'] }, body => assert.deepEqual(body.emotions, ['기쁨'])],
  ['/api/ai/recommend-art', { currentMood: '평온', dateKey: '2026-10-26' }, { whyRecommended: '마음의 여유', challenges: '색을 살펴보기\n음악 감상하기' }, body => { assert.ok(body.catalogId); assert.equal(body.challenges.length, 2); assert.equal(body.generationSource, 'gemini'); }],
  ['/api/ai/daily-tarot', { card: { nameKo: '별', reversed: true } }, oracle, body => assert.ok(body.diagnosis)],
  ['/api/ai/daily-sedona', { card: { nameKo: '허용' } }, oracle, body => assert.ok(body.remedy)],
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

test('TTS wraps PCM in a playable WAV for both narration engines', async () => {
  const response = await handleSitesApi(request('/api/ai/tts', { text: '안녕하세요', voice: 'Aoede' }), env, (async (_url, options) => {
    const payload = JSON.parse(options.body);
    assert.equal(payload.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName, 'Aoede');
    assert.deepEqual(payload.contents, [{ parts: [{ text: '안녕하세요' }] }], 'only the literal reply is sent to the voice model, no spoken instruction prefix');
    return Response.json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/L16;codec=pcm;rate=24000', data: 'AAAAAA==' } }] } }] });
  }) as any);
  const result: any = await response!.json();
  const wav = Buffer.from(result.audioContent, 'base64');
  assert.equal(result.encoding, 'wav'); assert.equal(result.sampleRate, 24000); assert.equal(result.voice, 'Aoede');
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF'); assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
  assert.equal(wav.readUInt32LE(24), 24000); assert.equal(wav.readUInt16LE(22), 1);
  assert.equal(wav.subarray(44).toString('base64'), 'AAAAAA==');
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
  assert.equal((await handleSitesApi(request('/api/ai/tts', { text: 'hello' }), {}))?.status, 503);
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


test('TTS accepts the actual packaged WAV response from the current model unchanged', async () => {
  const wav = Buffer.from(pcmToWav('AAAAAA==', 24000));
  const response = await handleSitesApi(request('/api/ai/tts', { text: '안녕하세요', voice: 'Aoede' }), env, (async () => Response.json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/wav', data: wav.toString('base64') } }] } }] })) as any);
  assert.equal(response?.status, 200);
  const result = await response!.json() as any;
  assert.equal(result.encoding, 'wav');
  assert.equal(result.sampleRate, 24000);
  assert.deepEqual(Buffer.from(result.audioContent, 'base64'), wav);
  const bad = await handleSitesApi(request('/api/ai/tts', { text: '안녕하세요' }), env, (async () => Response.json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/wav', data: 'AAAAAA==' } }] } }] })) as any);
  assert.equal(bad?.status, 502);
});


test('TTS removes explicit internal instructions server-side before calling the provider', async () => {
  let called = 0;
  const fetcher = async (_url: any, options: any) => {
    called++;
    assert.equal(JSON.parse(options.body).contents[0].parts[0].text, '안녕하세요.');
    return Response.json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/L16;rate=24000', data: 'AAAAAA==' } }] } }] });
  };
  assert.equal((await handleSitesApi(request('/api/ai/tts', { text: '<system>명령문</system>안녕하세요.' }), env, fetcher as any))?.status, 200);
  assert.equal((await handleSitesApi(request('/api/ai/tts', { text: '<system>명령문만</system>' }), env, fetcher as any))?.status, 400);
  assert.equal(called, 1, 'instruction-only text must not create provider audio');
});
