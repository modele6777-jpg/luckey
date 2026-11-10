import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer, type Server } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import app from '../api/index.ts';
import { evaluateMcpAuth, logRejectedMcpAuth, redactMcpSecrets, verifyMcpBearer } from '../server/api-lib/mcpAuth.ts';
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

    process.env.LUCKEY_MCP_TOKEN = 'ab+cd-efghijklmnop';
    try {
      const plus = await post('/api/mcp?key=ab+cd-efghijklmnop', SAJU, { accept: ACCEPT });
      assert.equal(plus.status, 200, plus.text);
      assert.match(plus.text, /FROM-API/);
    } finally {
      process.env.LUCKEY_MCP_TOKEN = TOKEN;
    }
  });

  test('wrong, short, and missing tokens are rejected and redacted', async () => {
    const warnings: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => { warnings.push(args); };
    const rendered = () => warnings
      .filter((args) => args.some((arg) => String(arg).includes('[mcp] auth rejected')))
      .map((args) => args.map((arg) => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '))
      .join('\n');
    try {
      const wrong = await post(`/api/mcp?key=${encodeURIComponent(WRONG)}`, SAJU, { accept: ACCEPT });
      assert.equal(wrong.status, 401);
      assert.equal(wrong.body.error.code, -32001);
      assert.equal(wrong.text.includes(WRONG), false);
      const logged = rendered();
      assert.match(logged, /\[redacted\]/);
      assert.match(logged, /"reason":"mismatch"/);
      assert.match(logged, /"source":"query-key"/);
      assert.equal(logged.includes(WRONG), false);
      assert.equal(logged.includes(createHash('sha256').update(WRONG).digest('hex')), false);
      const redactedUrl = redactMcpSecrets(`https://luckey-six.vercel.app/api/mcp?key=${WRONG}&token=${TOKEN}`);
      assert.equal(redactedUrl.includes(WRONG), false);
      assert.equal(redactedUrl.includes(TOKEN), false);
      assert.equal(redactMcpSecrets(`Authorization: Bearer ${TOKEN}`).includes(TOKEN), false);

      warnings.length = 0;
      process.env.LUCKEY_MCP_TOKEN = 'short-token';
      const shortEnv = await post(`/api/mcp?key=${encodeURIComponent('short-token')}`, SAJU, { accept: ACCEPT });
      assert.equal(shortEnv.status, 401);
      assert.match(rendered(), /"reason":"env_too_short"/);
      assert.match(rendered(), /"matchesAfterNormalization":true/);
      assert.equal(rendered().includes('short-token'), false);

      warnings.length = 0;
      delete process.env.LUCKEY_MCP_TOKEN;
      const missing = await post('/api/mcp', SAJU, { accept: ACCEPT, authorization: `Bearer ${TOKEN}` });
      assert.equal(missing.status, 401);
      assert.match(rendered(), /"reason":"env_missing"/);
      assert.match(rendered(), /"source":"bearer"/);
      assert.equal(rendered().includes(TOKEN), false);
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

  test('copy-paste damage still matches and rejection logs stay secret', () => {
    const secret = 'H4k9vN8sR1wLm2Qp';
    const previous = process.env.LUCKEY_MCP_TOKEN;
    process.env.LUCKEY_MCP_TOKEN = `  "${secret}"  `;
    try {
      assert.equal(verifyMcpBearer(secret), true);
      assert.equal(verifyMcpBearer(`  ${secret}  `), true);
      assert.equal(verifyMcpBearer(`'${secret}'`), true);
      assert.equal(verifyMcpBearer(encodeURIComponent(`"${secret}"`)), true);
      assert.equal(verifyMcpBearer('not-the-configured-secret'), false);
      assert.equal(evaluateMcpAuth('%').reason, 'mismatch');
      assert.equal(evaluateMcpAuth(null).reason, 'no_credential');
      assert.equal(evaluateMcpAuth(null).presentedLength, 0);
      assert.equal(evaluateMcpAuth(null).matchesAfterNormalization, false);

      process.env.LUCKEY_MCP_TOKEN = 'ab+cd-efghijklmnop';
      assert.equal(verifyMcpBearer('ab cd-efghijklmnop'), true);
      assert.equal(verifyMcpBearer('  "ab cd-efghijklmnop"  '), true);
      assert.equal(verifyMcpBearer(encodeURIComponent('ab+cd-efghijklmnop')), true);

      process.env.LUCKEY_MCP_TOKEN = secret.slice(0, 15);
      const short = evaluateMcpAuth(secret.slice(0, 15));
      assert.equal(short.ok, false);
      assert.equal(short.reason, 'env_too_short');
      assert.equal(short.expectedLength, 15);
      assert.equal(short.presentedLength, 15);
      assert.equal(short.matchesAfterNormalization, true);

      process.env.LUCKEY_MCP_TOKEN = secret;
      const exact = evaluateMcpAuth(secret);
      assert.equal(exact.ok, true);
      assert.equal(exact.expectedLength, 16);
      assert.equal(exact.matchesAfterNormalization, true);

      const warnings: unknown[][] = [];
      const original = console.warn;
      console.warn = (...args: unknown[]) => { warnings.push(args); };
      try {
        logRejectedMcpAuth({
          headers: {},
          url: `/api/mcp?key=${secret}-wrong`,
          originalUrl: `/api/mcp?key=${secret}-wrong`,
          query: { key: `${secret}-wrong` },
        });
        logRejectedMcpAuth({ headers: { authorization: `Bearer ${secret}-wrong` }, url: '/api/mcp', originalUrl: '/api/mcp', query: {} });
        logRejectedMcpAuth({ headers: {}, url: `/api/mcp?token=${secret}-wrong`, originalUrl: `/api/mcp?token=${secret}-wrong`, query: { token: `${secret}-wrong` } });
        logRejectedMcpAuth({ headers: {}, url: '/api/mcp', originalUrl: '/api/mcp', query: {} });
        delete process.env.LUCKEY_MCP_TOKEN;
        logRejectedMcpAuth({ headers: {}, url: '/api/mcp', originalUrl: '/api/mcp', query: {} });
      } finally {
        console.warn = original;
      }
      const logged = warnings.map((args) => args.map((arg) => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')).join('\n');
      const hashes = [secret, `${secret}-wrong`, secret.slice(0, 15)].map((value) => createHash('sha256').update(value).digest('hex'));
      assert.match(logged, /"reason":"mismatch"/);
      assert.match(logged, /"source":"query-key"/);
      assert.match(logged, /"source":"bearer"/);
      assert.match(logged, /"source":"query-token"/);
      assert.match(logged, /"reason":"no_credential"/);
      assert.match(logged, /"reason":"env_missing"/);
      assert.match(logged, /"source":"none"/);
      assert.equal(logged.includes(secret), false);
      assert.equal(logged.includes(secret.slice(0, 4)), false);
      assert.equal(logged.includes(secret.slice(-4)), false);
      for (const hash of hashes) assert.equal(logged.includes(hash), false);
    } finally {
      if (previous === undefined) delete process.env.LUCKEY_MCP_TOKEN;
      else process.env.LUCKEY_MCP_TOKEN = previous;
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
