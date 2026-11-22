import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { after, before, beforeEach, test } from 'node:test';
import express from 'express';
import handler, { ttsWantsBinaryResponse } from '../api/ai/tts.ts';
import { parseTTSAudioResponse, detectAudioEncoding } from '../src/utils/ttsBinaryResponse.ts';

/**
 * 📉 TTS 응답 바이너리 전환 회귀 기준 (v1.7.622)
 * - base64 JSON(+33%) 대신 원본 오디오 바이트를 돌려주되, 기존 JSON 호출은 그대로 동작한다.
 * - 재생·오디오 세션 로직은 손대지 않고, 클라이언트 파서가 두 형식을 같은 모양으로 읽는다.
 */

const WAV = Buffer.concat([
  Buffer.from('RIFF'),
  Buffer.from([0x24, 0x00, 0x00, 0x00]),
  Buffer.from('WAVEfmt '),
  Buffer.from([0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00]),
  Buffer.from([0x80, 0x3e, 0x00, 0x00, 0x00, 0x7d, 0x00, 0x00]),
  Buffer.from([0x02, 0x00, 0x10, 0x00]),
  Buffer.from('data'),
  Buffer.from([0x00, 0x00, 0x00, 0x00]),
]);

const ENV_NAMES = ['GEMINI_API_KEY', 'GOOGLE_GENAI_API_KEY', 'GOOGLE_API_KEY', 'AI_API_KEY', 'API_KEY'] as const;
const savedEnv = Object.fromEntries(ENV_NAMES.map((name) => [name, process.env[name]]));
const realFetch = globalThis.fetch;

let server: Server;
let base = '';
let providerCalls = 0;
const providerModels: string[] = [];

function stubProvider() {
  globalThis.fetch = (async (input: any, init?: any) => {
    const target = typeof input === 'string' ? input : String(input?.url || '');
    if (!target.includes('generativelanguage.googleapis.com')) return realFetch(input, init);
    providerCalls++;
    providerModels.push(JSON.parse(String(init?.body)).model);
    return Response.json({
      output_audio: { data: WAV.toString('base64'), mime_type: 'audio/wav' },
    });
  }) as typeof fetch;
}

before(async () => {
  process.env.GEMINI_API_KEY = 'test-only-tts-binary-key';
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.all('/api/ai/tts', (req, res) => handler(req as never, res as never));
  server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no test port');
  base = `http://127.0.0.1:${address.port}`;
});

beforeEach(() => {
  providerCalls = 0;
  providerModels.length = 0;
  stubProvider();
});

after(async () => {
  globalThis.fetch = realFetch;
  for (const name of ENV_NAMES) {
    if (savedEnv[name] === undefined) delete process.env[name];
    else process.env[name] = savedEnv[name];
  }
  if (server) await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

function ttsPost(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return fetch(`${base}/api/ai/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

test('responseFormat: "binary" returns raw audio bytes with TTS metadata headers', async () => {
  const response = await ttsPost({ text: '안녕하세요. 루시입니다.', voice: 'Aoede', emotion: '차분', responseFormat: 'binary' },
    { Accept: 'audio/wav, audio/mpeg' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'audio/wav');
  assert.equal(Number(response.headers.get('content-length')), WAV.length);
  assert.equal(response.headers.get('x-tts-encoding'), 'wav');
  assert.equal(response.headers.get('x-tts-sample-rate'), '24000');
  assert.equal(response.headers.get('x-tts-voice'), 'Aoede');
  assert.ok(['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'].includes(response.headers.get('x-tts-model') || ''));
  assert.match(response.headers.get('cache-control') || '', /no-store/, 'narration must not land in shared caches');
  assert.match(response.headers.get('access-control-expose-headers') || '', /X-TTS-Encoding/);

  const bytes = Buffer.from(await response.arrayBuffer());
  assert(bytes.equals(WAV));
  assert.equal(providerCalls, 1);
});

test('a pinned model is honored and returned with binary audio metadata', async () => {
  const response = await ttsPost({
    text: '같은 목소리로 이어서 읽습니다.',
    preferredModel: 'gemini-3.8-flash-lite-tts',
    responseFormat: 'binary',
  }, { Accept: 'audio/wav' });
  assert.equal(response.status, 200);
  assert.deepEqual(providerModels, ['gemini-3.8-flash-lite-tts']);
  assert.equal(response.headers.get('x-tts-model'), 'gemini-3.8-flash-lite-tts');
  assert.match(response.headers.get('access-control-expose-headers') || '', /X-TTS-Model/);
});

test('Accept: audio/* also selects the binary path, without a 405 on POST', async () => {
  const response = await ttsPost({ text: '두 번째 문장입니다.' }, { Accept: 'audio/mpeg' });
  assert.equal(response.status, 200);
  assert.equal((response.headers.get('content-type') || '').startsWith('audio/'), true);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert(bytes.equals(WAV));
});

test('legacy callers without audio markers still receive base64 JSON', async () => {
  const response = await ttsPost({ text: '기존 호출입니다.' }, { Accept: '*/*' });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') || '', /application\/json/);
  const data: any = await response.json();
  assert.equal(data.audioContent, WAV.toString('base64'));
  assert.equal(data.encoding, 'wav');
  assert.equal(data.sampleRate, 24000);
});

test('?format=binary works for POST urls as well', async () => {
  const response = await fetch(`${base}/api/ai/tts?format=binary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '쿼리 형식 지정입니다.' }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'audio/wav');
});

test('binary preference detection keeps browser defaults on JSON', () => {
  assert.equal(ttsWantsBinaryResponse({ acceptHeader: '*/*' }), false);
  assert.equal(ttsWantsBinaryResponse({ acceptHeader: 'application/json' }), false);
  assert.equal(ttsWantsBinaryResponse({ acceptHeader: 'audio/wav, audio/mpeg' }), true);
  assert.equal(ttsWantsBinaryResponse({ responseFormat: 'binary' }), true);
  assert.equal(ttsWantsBinaryResponse({ format: 'binary' }), true);
  assert.equal(ttsWantsBinaryResponse({ responseFormat: 'json', acceptHeader: 'audio/wav' }), false);
  assert.equal(ttsWantsBinaryResponse({}), false);
});

test('client parser reads both binary and legacy JSON responses identically', async () => {
  const binaryResponse = new Response(WAV, {
    status: 200,
    headers: { 'Content-Type': 'audio/wav', 'X-TTS-Encoding': 'wav', 'X-TTS-Sample-Rate': '24000', 'X-TTS-Model': 'gemini-3.8-flash-tts' },
  });
  const parsedBinary = await parseTTSAudioResponse(binaryResponse);
  assert(parsedBinary);
  assert.equal(parsedBinary!.encoding, 'wav');
  assert.equal(parsedBinary!.sampleRate, 24000);
  assert.equal(parsedBinary!.model, 'gemini-3.8-flash-tts');
  assert(Buffer.from(parsedBinary!.bytes).equals(WAV));
  assert.equal(parsedBinary!.audioContent, WAV.toString('base64'));

  const jsonResponse = Response.json({ audioContent: WAV.toString('base64'), encoding: 'wav', sampleRate: 24000, model: 'gemini-3.8-flash-lite-tts' });
  const parsedJson = await parseTTSAudioResponse(jsonResponse);
  assert(parsedJson);
  assert.equal(parsedJson!.audioContent, parsedBinary!.audioContent);
  assert.equal(parsedJson!.encoding, 'wav');
  assert.equal(parsedJson!.sampleRate, 24000);
  assert.equal(parsedJson!.model, 'gemini-3.8-flash-lite-tts');

  const empty = await parseTTSAudioResponse(new Response(null, { status: 200, headers: { 'Content-Type': 'audio/wav' } }));
  assert.equal(empty, null);
  assert.equal(detectAudioEncoding(new Uint8Array([0xff, 0xfa, 0x00])), 'mp3');
  assert.equal(detectAudioEncoding(new Uint8Array(WAV)), 'wav');
});

test('provider failures still return explicit JSON errors for binary requests', async () => {
  globalThis.fetch = (async (input: any, init?: any) => {
    const target = typeof input === 'string' ? input : String(input?.url || '');
    if (!target.includes('generativelanguage.googleapis.com')) return realFetch(input, init);
    return Response.json({ error: { status: 'PERMISSION_DENIED', details: [{ reason: 'API_KEY_SERVICE_BLOCKED' }] } }, { status: 403 });
  }) as typeof fetch;
  const response = await ttsPost({ text: '실패 확인 문장입니다.', responseFormat: 'binary' }, { Accept: 'audio/wav' });
  assert.equal(response.status, 403);
  assert.match(response.headers.get('content-type') || '', /application\/json/);
  const data: any = await response.json();
  assert.equal(data.code, 'GEMINI_TTS_ACCESS_DENIED');
  assert.equal(typeof data.diagnosticId, 'string');
});

test('empty text is rejected before any provider call', async () => {
  const response = await ttsPost({ text: '   ', responseFormat: 'binary' });
  assert.equal(response.status, 400);
  assert.equal(providerCalls, 0);
});
