import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { after, before, test } from 'node:test';
import express from 'express';
import handler from '../api/ai/daily-bgm.ts';

/**
 * 📉 Fast Origin Transfer 절감 회귀 기준 (v1.7.622)
 * - `GET /api/ai/daily-bgm?...&format=wav`는 base64 JSON이 아니라 바이너리 audio/wav를
 *   Edge CDN 캐시 헤더와 함께 돌려준다.
 * - 같은 파라미터는 항상 같은 바이트 → 같은 URL은 CDN/브라우저 캐시에서 재사용된다.
 * - 기존 `POST` base64 JSON 응답은 하위 호환으로 그대로 유지된다.
 */

const SAMPLE_RATE = 44100;
const CHANNELS = 2;
const DURATION_SEC = 48;
const EXPECTED_BYTES = 44 + SAMPLE_RATE * CHANNELS * 2 * DURATION_SEC;

const QUERY = {
  focusPlaylist: 'Calm Ocean Meditation',
  dateKey: '2026-11-16',
  trackKey: 'daily:trinity:2026-11-16:calm-ocean-meditation',
};

let server: Server;
let base = '';

before(async () => {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.all('/api/ai/daily-bgm', (req, res) => handler(req as never, res as never));
  server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no test port');
  base = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

function url(params: Record<string, string> = QUERY): string {
  const search = new URLSearchParams(params);
  if (!search.has('format')) search.set('format', 'wav');
  return `${base}/api/ai/daily-bgm?${search.toString()}`;
}

test('GET returns raw WAV bytes with Edge CDN cache headers', async () => {
  const response = await fetch(url(), { method: 'GET', headers: { Accept: 'audio/wav' } });
  assert.equal(response.status, 200);
  assert.equal((response.headers.get('content-type') || '').startsWith('audio/wav'), true);

  const cacheControl = response.headers.get('cache-control') || '';
  assert.match(cacheControl, /public/);
  assert.match(cacheControl, /max-age=86400/);
  assert.match(cacheControl, /s-maxage=604800/);
  assert.match(cacheControl, /stale-while-revalidate=86400/);
  assert.equal(response.headers.get('set-cookie'), null, 'CDN cacheable responses must not set cookies');
  assert.equal(response.headers.get('vary'), null, 'no Vary header for a parameter-keyed cache');

  assert.equal(Number(response.headers.get('content-length')), EXPECTED_BYTES);
  assert.equal(response.headers.get('x-bgm-encoding'), 'wav');
  assert.equal(response.headers.get('x-bgm-duration-sec'), String(DURATION_SEC));

  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.length, EXPECTED_BYTES, 'no base64 padding overhead on the wire');
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WAVE');
  assert.equal(bytes.readUInt32LE(24), SAMPLE_RATE);
  assert.equal(bytes.readUInt16LE(22), CHANNELS);
  assert.equal(bytes.readUInt32LE(40), SAMPLE_RATE * CHANNELS * 2 * DURATION_SEC);
});

test('GET is deterministic for the same query so the CDN key stays valid', async () => {
  const first = Buffer.from(await (await fetch(url())).arrayBuffer());
  const second = Buffer.from(await (await fetch(url())).arrayBuffer());
  assert.equal(first.length, second.length);
  assert(first.equals(second), 'same trackKey/dateKey/mood must render identical bytes');
});

test('GET defaults to binary WAV without a format parameter', async () => {
  const response = await fetch(`${base}/api/ai/daily-bgm?${new URLSearchParams(QUERY).toString()}`);
  assert.equal(response.status, 200);
  assert.equal((response.headers.get('content-type') || '').startsWith('audio/wav'), true);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
});

test('GET supports JSON opt-out for debugging without breaking clients', async () => {
  const search = new URLSearchParams({ ...QUERY, format: 'json' });
  const response = await fetch(`${base}/api/ai/daily-bgm?${search.toString()}`);
  assert.equal(response.status, 200);
  const data: any = await response.json();
  assert.equal(data.encoding, 'wav');
  assert.equal(data.trackKey, QUERY.trackKey);
  assert.equal(data.durationSec, DURATION_SEC);
  assert.equal(Buffer.from(data.audioContent, 'base64').length, EXPECTED_BYTES);
});

test('POST keeps the legacy base64 JSON response byte-identical to the binary path', async () => {
  const binary = Buffer.from(await (await fetch(url())).arrayBuffer());
  const response = await fetch(`${base}/api/ai/daily-bgm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(QUERY),
  });
  assert.equal(response.status, 200);
  const data: any = await response.json();
  assert.equal(data.encoding, 'wav');
  assert.equal(data.sampleRate, SAMPLE_RATE);
  assert.equal(data.trackKey, QUERY.trackKey);
  assert(Buffer.from(data.audioContent, 'base64').equals(binary), 'legacy JSON must keep the same audio');
});

test('POST can request the binary body explicitly', async () => {
  const response = await fetch(url(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...QUERY, responseFormat: 'binary' }),
  });
  assert.equal(response.status, 200);
  assert.equal((response.headers.get('content-type') || '').startsWith('audio/wav'), true);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.length, EXPECTED_BYTES);
});

test('missing parameters are rejected without poisoning the cache', async () => {
  const missing = await fetch(url({ dateKey: '', trackKey: 'x', focusPlaylist: 'y' }));
  assert.equal(missing.status, 400);
  assert.equal(missing.headers.get('cache-control'), 'no-store');
  const payload: any = await missing.json();
  assert.match(payload.error, /required/);

  const badMethod = await fetch(url(), { method: 'PUT' });
  assert.equal(badMethod.status, 405);
  assert.equal(badMethod.headers.get('allow'), 'GET, HEAD, POST, OPTIONS');

  const options = await fetch(url(), { method: 'OPTIONS' });
  assert.equal(options.status, 200);
});
