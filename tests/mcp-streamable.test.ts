import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { after, before, describe, test } from 'node:test';
import express from 'express';
import { handleMCPDirectPost, handleMCPSseStream, handleStreamableMethodNotAllowed } from '../server/api-lib/mcpHandler';
import { setReadingApiFetchForTests } from '../server/api-lib/readingApiClient';

const TOKEN = 'luckey-mcp-test-token-0123456789';
const ACCEPT = 'application/json, text/event-stream';
let server: Server;
let base = '';
const calls: { url: string; body: any; authorization?: string }[] = [];

function installFetch() {
  setReadingApiFetchForTests(async (input, init) => {
    const headers = new Headers(init?.headers);
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    calls.push({ url, body: JSON.parse(String(init?.body)), authorization: headers.get('authorization') || undefined });
    const path = new URL(url).pathname;
    if (path === '/api/saju/chart') {
      return new Response(JSON.stringify({ pillars: { day: 'FROM-API' }, note: 'api' }), { status: 200 });
    }
    if (path === '/api/ai/daily-tarot') {
      return new Response(JSON.stringify({ diagnosis: 'API 진단', luckyNumber: '3' }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'unexpected path' }), { status: 500 });
  });
}

async function rpc(method: string, params?: Record<string, unknown>, options: { token?: string; accept?: string } = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json', accept: options.accept || ACCEPT };
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  const response = await fetch(`${base}/api/mcp`, {
    method: 'POST', headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const text = await response.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text }; }
  return { status: response.status, body, text };
}

describe('streamable MCP reading API gateway', { concurrency: false }, () => {
  before(async () => {
    process.env.LUCKEY_MCP_TOKEN = TOKEN;
    process.env.LUCKEY_API_ORIGIN = 'http://127.0.0.1:9';
    installFetch();
    const app = express();
    app.use(express.json());
    app.get(['/api/mcp', '/api/mcp/sse'], (req, res) => handleMCPSseStream(req, res));
    app.post('/api/mcp', (req, res) => void handleMCPDirectPost(req, res));
    app.delete('/api/mcp', (req, res) => handleStreamableMethodNotAllowed(req, res));
    server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    base = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    setReadingApiFetchForTests(null);
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  test('initialize and tools/list do not call a reading API', async () => {
    calls.length = 0;
    const initialized = await rpc('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'test', version: '0' } });
    assert.equal(initialized.status, 200);
    assert.equal(initialized.body.result.serverInfo.name, 'luckey-readings');
    const listed = await rpc('tools/list');
    const names = listed.body.result.tools.map((tool: { name: string }) => tool.name).sort();
    assert.deepEqual(names, ['list_tarot_spreads', 'read_saju', 'read_tarot']);
    assert.equal(calls.length, 0);
  });

  test('daily tarot and saju post to fixed origin without forwarding the MCP token', async () => {
    calls.length = 0;
    const tarot = await rpc('tools/call', { name: 'read_tarot', arguments: { theme: 'daily', cards: [{ id: 'major_0', reversed: false }], question: '오늘의 일' } }, { token: TOKEN });
    assert.equal(tarot.status, 200);
    const tarotBody = JSON.parse(tarot.body.result.content[0].text);
    assert.equal(tarotBody.endpoint, '/api/ai/daily-tarot');
    assert.equal(tarotBody.reading.diagnosis, 'API 진단');
    assert.equal(calls[0].url, 'http://127.0.0.1:9/api/ai/daily-tarot');
    assert.equal(calls[0].body.card.id, 'major_0');
    assert.equal(calls[0].body.card.reversed, false);
    assert.equal(calls[0].body.profile.fate.currentWorry, '오늘의 일');
    assert.equal(calls[0].authorization, undefined);

    const saju = await rpc('tools/call', { name: 'read_saju', arguments: { year: 2000, month: 1, day: 1, birthtime: '12:00', isLunar: false } }, { token: TOKEN });
    const chart = JSON.parse(saju.body.result.content[0].text);
    assert.equal(chart.chart.pillars.day, 'FROM-API');
    assert.equal(calls[1].url, 'http://127.0.0.1:9/api/saju/chart');
    assert.equal(calls[1].body.birthtime, '12:00');
    assert.equal(calls[1].authorization, undefined);
  });

  test('spread tarot reports the missing API and does not call chat completions or Gemini', async () => {
    calls.length = 0;
    const response = await rpc('tools/call', {
      name: 'read_tarot',
      arguments: { theme: 'yes_no', cards: [{ id: 'major_0' }, { id: 'major_1' }, { id: 'major_19' }] },
    });
    assert.equal(response.body.result.isError, true);
    assert.match(response.body.result.content[0].text, /전용 HTTP API가 없습니다/);
    assert.equal(calls.length, 0);
  });

  test('unauthorized and upstream failures do not invent a reading', async () => {
    calls.length = 0;
    const denied = await rpc('tools/call', { name: 'read_saju', arguments: { year: 1994, month: 1, day: 24 } });
    assert.equal(denied.status, 401);
    assert.equal(denied.text.includes('1994'), false);
    assert.equal(calls.length, 0);
    setReadingApiFetchForTests(async () => new Response(JSON.stringify({ error: 'quota exceeded' }), { status: 429 }));
    const failed = await rpc('tools/call', { name: 'read_tarot', arguments: { theme: 'daily', cards: [{ id: 'major_0' }] } }, { token: TOKEN });
    assert.equal(failed.body.result.isError, true);
    assert.match(failed.body.result.content[0].text, /리딩 API 429/);
    assert.doesNotMatch(failed.body.result.content[0].text, /광대/);
    installFetch();
  });

  test('tool arguments and Host cannot redirect the reading origin', async () => {
    calls.length = 0;
    const response = await fetch(`${base}/api/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: ACCEPT, authorization: `Bearer ${TOKEN}`, 'x-forwarded-host': 'evil.example' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'read_saju', arguments: { year: 2000, month: 1, day: 1, origin: 'https://evil.example/api/mcp' } } }),
    });
    assert.equal(response.status, 200);
    assert.equal(calls[0].url, 'http://127.0.0.1:9/api/saju/chart');
    assert.equal(calls[0].body.origin, undefined);
  });

  test('MCP reading modules do not call Gemini or calculate a chart themselves', () => {
    const files = ['mcpHandler.ts', 'mcpStreamable.ts', 'mcpReadingGateway.ts', 'readingApiClient.ts'].map((name) => readFileSync(new URL(`../server/api-lib/${name}`, import.meta.url), 'utf8')).join('\n');
    assert.equal(files.includes('@google/genai'), false);
    assert.equal(files.includes('generateContent'), false);
    assert.equal(files.includes('calculateDetailedSaju'), false);
    assert.equal(files.includes('buildLocalTarotReading'), false);
    assert.equal(files.includes('buildSpecificTarotDailyOracle'), false);
  });

  test('legacy art tool stays local and streamable GET stays closed', async () => {
    calls.length = 0;
    const art = await rpc('tools/call', { name: 'get_art_prescription', arguments: {} }, { accept: 'application/json' });
    assert.equal(art.status, 200);
    assert.ok(JSON.parse(art.body.result.content[0].text).artwork.title);
    assert.equal(calls.length, 0);
    const stream = await fetch(`${base}/api/mcp`, { headers: { accept: 'text/event-stream' } });
    assert.equal(stream.status, 405);
    await stream.body?.cancel();
  });
});
