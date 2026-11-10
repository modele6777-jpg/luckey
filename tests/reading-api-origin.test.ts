import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import { after, describe, test } from 'node:test';
import express from 'express';
import { guardRestrictedRoute } from '../server/api-lib/publicAccess.ts';
import { postReadingApi, readingApiOrigin, setReadingApiFetchForTests } from '../server/api-lib/readingApiClient.ts';

const ENV_NAMES = ['LUCKEY_API_ORIGIN', 'VERCEL_PROJECT_PRODUCTION_URL', 'VERCEL_URL'] as const;
const saved = Object.fromEntries(ENV_NAMES.map((name) => [name, process.env[name]]));

function restoreEnv(): void {
  for (const name of ENV_NAMES) {
    if (saved[name] === undefined) delete process.env[name];
    else process.env[name] = saved[name];
  }
}

function useEnv(values: Partial<Record<(typeof ENV_NAMES)[number], string>>): void {
  for (const name of ENV_NAMES) delete process.env[name];
  for (const [name, value] of Object.entries(values)) {
    if (value !== undefined) process.env[name] = value;
  }
}

async function listen(handler: express.Express): Promise<{ server: Server; base: string }> {
  const server = createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  return { server, base: `http://127.0.0.1:${address.port}` };
}

describe('reading API origin fallback', { concurrency: false }, () => {
  after(() => {
    setReadingApiFetchForTests(null);
    restoreEnv();
  });

  test('falls back from the production host, then the deployment host, then the public app', () => {
    useEnv({
      LUCKEY_API_ORIGIN: 'https://override.example/path',
      VERCEL_PROJECT_PRODUCTION_URL: 'production.example',
      VERCEL_URL: 'preview.example',
    });
    assert.equal(readingApiOrigin(), 'https://override.example');

    useEnv({ VERCEL_PROJECT_PRODUCTION_URL: 'luckey-six.vercel.app', VERCEL_URL: 'preview.example' });
    assert.equal(readingApiOrigin(), 'https://luckey-six.vercel.app');

    useEnv({ VERCEL_PROJECT_PRODUCTION_URL: 'http://evil.example', VERCEL_URL: 'luckey-preview.vercel.app' });
    assert.equal(readingApiOrigin(), 'https://luckey-preview.vercel.app');

    useEnv({ VERCEL_URL: 'https://current-deployment.vercel.app/api' });
    assert.equal(readingApiOrigin(), 'https://current-deployment.vercel.app');

    useEnv({});
    assert.equal(readingApiOrigin(), 'https://luckey-six.vercel.app');
  });

  test('an invalid override is rejected and does not use the fallback', () => {
    useEnv({ LUCKEY_API_ORIGIN: 'http://evil.example', VERCEL_PROJECT_PRODUCTION_URL: 'luckey-six.vercel.app' });
    assert.throws(() => readingApiOrigin(), /https 또는 로컬 http만 허용/);
    useEnv({ LUCKEY_API_ORIGIN: 'not a url', VERCEL_URL: 'luckey-six.vercel.app' });
    assert.throws(() => readingApiOrigin(), /올바른 URL이 아닙니다/);
    useEnv({ LUCKEY_API_ORIGIN: 'https://user:secret@luckey-six.vercel.app' });
    assert.throws(() => readingApiOrigin(), /https 또는 로컬 http만 허용/);
    useEnv({ LUCKEY_API_ORIGIN: 'http://127.0.0.1:9/ignored' });
    assert.equal(readingApiOrigin(), 'http://127.0.0.1:9');
  });

  test('the server-to-server call sends no Origin header', async () => {
    const seen: Array<string | undefined> = [];
    const inbound = createServer((req, res) => {
      seen.push(req.headers.origin);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{"ok":true}');
    });
    await new Promise<void>((resolve) => inbound.listen(0, '127.0.0.1', () => resolve()));
    const address = inbound.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    useEnv({ LUCKEY_API_ORIGIN: `http://127.0.0.1:${address.port}` });
    try {
      const result = await postReadingApi('/api/ai/daily-tarot', { card: { id: 'major_0' } });
      assert.equal(result.status, 200);
      assert.deepEqual(seen, [undefined]);
    } finally {
      setReadingApiFetchForTests(null);
      await new Promise<void>((resolve, reject) => inbound.close((error) => error ? reject(error) : resolve()));
    }
  });

  test('daily tarot and saju chart accept a request with no Origin and are not rate limited', async () => {
    const app = express();
    app.use(express.json());
    app.use(guardRestrictedRoute(48_000));
    app.post(['/api/ai/daily-tarot', '/api/saju/chart'], (_req, res) => res.json({ ok: true }));
    const started = await listen(app);
    try {
      for (const route of ['/api/ai/daily-tarot', '/api/saju/chart']) {
        for (let i = 0; i < 25; i += 1) {
          const response = await fetch(`${started.base}${route}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: '{}',
          });
          assert.equal(response.status, 200, route);
        }
        const foreign = await fetch(`${started.base}${route}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', origin: 'https://evil.example' },
          body: '{}',
        });
        assert.equal(foreign.status, route === '/api/ai/daily-tarot' ? 403 : 200);
      }
    } finally {
      await new Promise<void>((resolve, reject) => started.server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
