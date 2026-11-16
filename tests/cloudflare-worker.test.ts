import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/cloudflare-worker.ts';

type AssetEnv = { ASSETS: { fetch(request: Request): Promise<Response> } };
const env = (asset: (request: Request) => Promise<Response> | Response = () => new Response('asset')): AssetEnv => ({
  ASSETS: { fetch: async (request) => asset(request) },
});

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('rejects an Origin that is not the Worker URL origin', async () => {
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response('unexpected');
  }) as typeof fetch;
  const response = await worker.fetch(new Request('https://preview.example/api/health', {
    headers: { Origin: 'https://evil.example' },
  }), env());
  assert.equal(response.status, 403);
  assert.equal(called, false);
});

test('serves health endpoints directly without forwarding to Vercel', async () => {
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response('unexpected');
  }) as typeof fetch;

  const apiHealth = await worker.fetch(new Request('https://preview.example/api/health', {
    headers: { Origin: 'https://preview.example' },
  }), env());
  assert.equal(apiHealth.status, 200);
  assert.deepEqual(await apiHealth.json(), { status: 'ok' });
  assert.equal(apiHealth.headers.get('X-Luckey-API-Backend'), 'cloudflare-worker');
  assert.equal(apiHealth.headers.get('Access-Control-Allow-Origin'), 'https://preview.example');

  const healthAlias = await worker.fetch(new Request('https://preview.example/health'), env());
  assert.equal(healthAlias.status, 200);
  assert.deepEqual(await healthAlias.json(), { status: 'ok' });

  const head = await worker.fetch(new Request('https://preview.example/api/health', { method: 'HEAD' }), env());
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');

  const preflight = await worker.fetch(new Request('https://preview.example/api/health', { method: 'OPTIONS' }), env());
  assert.equal(preflight.status, 204);

  const unsupported = await worker.fetch(new Request('https://preview.example/api/health', { method: 'POST' }), env());
  assert.equal(unsupported.status, 405);
  assert.equal(unsupported.headers.get('Allow'), 'GET, HEAD, OPTIONS');
  assert.equal(called, false);
});

test('proxies API method, query, body, authorization and stream while filtering forwarding headers', async () => {
  let seenRequest: Request | undefined;
  globalThis.fetch = (async (input) => {
    seenRequest = input as Request;
    return new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('streamed'));
        controller.close();
      },
    }), { status: 207, headers: { 'Content-Type': 'text/plain' } });
  }) as typeof fetch;
  const response = await worker.fetch(new Request('https://preview.example/api/pending-route?x=1', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer keep-me',
      Cookie: 'private=do-not-forward',
      Origin: 'https://preview.example',
      'X-Forwarded-For': '1.2.3.4',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  }), env());
  assert.ok(seenRequest);
  assert.equal(seenRequest!.url, 'https://luckey-six.vercel.app/api/pending-route?x=1');
  assert.equal(seenRequest!.method, 'POST');
  assert.equal(seenRequest!.headers.get('Authorization'), 'Bearer keep-me');
  assert.equal(seenRequest!.headers.get('Cookie'), null);
  assert.equal(seenRequest!.headers.get('X-Forwarded-For'), null);
  assert.equal(seenRequest!.headers.get('Origin'), 'https://luckey-six.vercel.app');
  assert.deepEqual(await seenRequest!.json(), { ok: true });
  assert.equal(response.status, 207);
  assert.equal(await response.text(), 'streamed');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://preview.example');
});

test('rewrites same-origin upstream redirects without following them', async () => {
  globalThis.fetch = (async () => new Response(null, {
    status: 302,
    headers: { Location: 'https://luckey-six.vercel.app/chat?next=1' },
  })) as typeof fetch;
  const response = await worker.fetch(new Request('https://preview.example/api/login'), env());
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), 'https://preview.example/chat?next=1');
});

test('maps chat, Lucy, handbook and ReBible routes to their HTML assets and falls back to index', async () => {
  const seen: string[] = [];
  const assetEnv = env((request) => {
    seen.push(new URL(request.url).pathname);
    return new Response(new URL(request.url).pathname);
  });
  for (const route of ['/chat', '/chat/room', '/lucy', '/handbook', '/rebible/verse', '/settings']) {
    const response = await worker.fetch(new Request(`https://preview.example${route}`), assetEnv);
    assert.equal(response.status, 200);
  }
  assert.deepEqual(seen, ['/chat.html', '/chat.html', '/chat.html', '/handbook.html', '/handbook.html', '/index.html']);
});

test('does not let non-API methods reach static assets', async () => {
  const response = await worker.fetch(new Request('https://preview.example/settings', { method: 'POST' }), env());
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'GET, HEAD');
});
