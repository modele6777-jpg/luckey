import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import app from '../api/index.ts';
import { redactMcpSecrets } from '../server/api-lib/mcpAuth.ts';
import { setReadingApiFetchForTests } from '../server/api-lib/readingApiClient.ts';

const TOKEN = 'luckey-mcp-query-token-0123456789';
const WRONG = 'wrong-mcp-query-token-0123456789';
const ACCEPT = 'application/json, text/event-stream';
const SAJU = { jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'read_saju', arguments: { year: 2000, month: 1, day: 1 } } };
const LEGACY = { jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'get_saju_fortune', arguments: { year: 2000, month: 1, day: 1 } } };

let server: Server;
let base = '';
const savedToken = process.env.LUCKEY_MCP_TOKEN;
const savedOrigin = process.env.LUCKEY_API_ORIGIN;

async function listen(): Promise<void> {
  server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  base = `http://127.0.0.1:${address.port}`;
}

async function post(route: string, body: unknown, headers: Record<string, string> = {}) {
  const response = await fetch(`${base}${route}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let parsed: any = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = { raw: text }; }
  return { status: response.status, body: parsed, text };
}

describe('MCP query token', { concurrency: false }, () => {
  before(async () => {
    process.env.LUCKEY_MCP_TOKEN = TOKEN;
    process.env.LUCKEY_API_ORIGIN = 'http://127.0.0.1:9';
    setReadingApiFetchForTests(async (input) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (new URL(url).pathname === '/api/saju/chart') {
        return new Response(JSON.stringify({ pillars: { day: 'FROM-API' } }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: 'unexpected' }), { status: 500 });
    });
    await listen();
  });

  after(async () => {
    setReadingApiFetchForTests(null);
    if (savedToken === undefined) delete process.env.LUCKEY_MCP_TOKEN;
    else process.env.LUCKEY_MCP_TOKEN = savedToken;
    if (savedOrigin === undefined) delete process.env.LUCKEY_API_ORIGIN;
    else process.env.LUCKEY_API_ORIGIN = savedOrigin;
    if (server) await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  test('Bearer header and query key or token authorize saju calls', async () => {
    const header = await post('/api/mcp', SAJU, { accept: ACCEPT, authorization: `Bearer ${TOKEN}` });
    assert.equal(header.status, 200);
    assert.match(header.text, /FROM-API/);
    assert.equal(header.text.includes(TOKEN), false);

    const key = await post(`/api/mcp?key=${encodeURIComponent(TOKEN)}`, SAJU, { accept: ACCEPT });
    assert.equal(key.status, 200);
    assert.match(key.text, /FROM-API/);

    const alias = await post(`/mcp?token=${encodeURIComponent(TOKEN)}`, LEGACY, { accept: 'application/json' });
    assert.equal(alias.status, 200);
    assert.match(alias.text, /FROM-API/);
  });

  test('wrong, short, and missing tokens are rejected and redacted', async () => {
    const warnings: string[] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => { warnings.push(args.map(String).join(' ')); };
    try {
      const wrong = await post(`/api/mcp?key=${encodeURIComponent(WRONG)}`, SAJU, { accept: ACCEPT });
      assert.equal(wrong.status, 401);
      assert.equal(wrong.body.error.code, -32001);
      assert.equal(wrong.text.includes(WRONG), false);
      const logged = warnings.filter((line) => line.includes('[mcp] auth rejected')).join('\n');
      assert.match(logged, /\[redacted\]/);
      assert.equal(logged.includes(WRONG), false);
      const redactedUrl = redactMcpSecrets(`https://luckey-six.vercel.app/api/mcp?key=${WRONG}&token=${TOKEN}`);
      assert.equal(redactedUrl.includes(WRONG), false);
      assert.equal(redactedUrl.includes(TOKEN), false);
      assert.equal(redactMcpSecrets(`Authorization: Bearer ${TOKEN}`).includes(TOKEN), false);

      process.env.LUCKEY_MCP_TOKEN = 'short-token';
      const shortEnv = await post(`/api/mcp?key=${encodeURIComponent('short-token')}`, SAJU, { accept: ACCEPT });
      assert.equal(shortEnv.status, 401);

      delete process.env.LUCKEY_MCP_TOKEN;
      const missing = await post('/api/mcp', SAJU, { accept: ACCEPT, authorization: `Bearer ${TOKEN}` });
      assert.equal(missing.status, 401);
    } finally {
      console.warn = original;
      process.env.LUCKEY_MCP_TOKEN = TOKEN;
    }
  });

  test('SSE opened with key authorizes the session without echoing the token', async () => {
    const stream = await fetch(`${base}/api/mcp/sse?key=${encodeURIComponent(TOKEN)}`, { headers: { accept: 'text/event-stream' } });
    assert.equal(stream.status, 200);
    const reader = stream.body?.getReader();
    if (!reader) throw new Error('no sse body');
    try {
      const { value } = await reader.read();
      const chunk = new TextDecoder().decode(value);
      assert.equal(chunk.includes(TOKEN), false);
      const endpoint = chunk.match(/data:\s*(\S+)/)?.[1];
      assert.ok(endpoint);
      assert.equal(endpoint.includes('key='), false);
      const target = new URL(endpoint, base);
      const posted = await fetch(`${base}${target.pathname}${target.search}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(LEGACY),
      });
      const text = await posted.text();
      assert.equal(posted.status, 200, text);
      assert.match(text, /FROM-API/);
      assert.equal(text.includes(TOKEN), false);
    } finally {
      await reader.cancel();
    }
  });

  test('Vercel MCP rewrites keep the original query string', () => {
    const config = JSON.parse(readFileSync(path.resolve(import.meta.dirname, '../vercel.json'), 'utf8')) as {
      rewrites: Array<{ source: string; destination: string }>;
    };
    const mcp = config.rewrites.filter((rule) => rule.source === '/api/mcp' || rule.source === '/api/mcp/(.*)' || rule.source === '/api/(.*)');
    assert.deepEqual(mcp.map((rule) => rule.destination), ['/api', '/api', '/api']);
    assert.equal(mcp.every((rule) => !rule.destination.includes('?')), true);
  });
});
