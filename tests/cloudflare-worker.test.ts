import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/cloudflare-worker.ts';
import { sajuChartFromInput } from '../server/api-lib/sajuChartApi.ts';

type AssetEnv = { ASSETS: { fetch(request: Request): Promise<Response> }; GEMINI_API_KEY?: string };
const env = (asset: (request: Request) => Promise<Response> | Response = () => new Response('asset'), apiKey?: string): AssetEnv => ({
  ASSETS: { fetch: async (request) => asset(request) },
  ...(apiKey === undefined ? {} : { GEMINI_API_KEY: apiKey }),
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

test('handles chat completions directly through Gemini with model fallback and a bounded OpenAI-compatible payload', async () => {
  const received: Array<{ url: string; headers: Headers; payload: any }> = [];
  globalThis.fetch = (async (input, init) => {
    const upstreamRequest = new Request(input, init);
    received.push({ url: upstreamRequest.url, headers: upstreamRequest.headers, payload: await upstreamRequest.json() });
    if (received.length === 1) return new Response('provider details are not relayed', { status: 404 });
    return Response.json({
      id: 'chatcmpl-test',
      object: 'chat.completion',
      model: 'gemini-flash-lite-latest',
      choices: [{ message: { role: 'assistant', content: '{"ok":true}' }, finish_reason: 'stop' }],
    });
  }) as typeof fetch;

  const response = await worker.fetch(new Request('https://preview.example/api/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://preview.example',
      'CF-Connecting-IP': '198.51.100.101',
    },
    body: JSON.stringify({
      model: 'gemini-3.6-flash',
      review_mode: 'general',
      max_tokens: 9000,
      thinking_level: 'medium',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Answer in JSON.' },
        { role: 'assistant', content: 'Ready.' },
        { role: 'user', content: 'Return a JSON object.' },
      ],
    }),
  }), env(undefined, 'test-only-not-a-real-key'));

  assert.equal(received.length, 2);
  assert.equal(received[0].url, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
  assert.equal(received[0].headers.get('Authorization'), 'Bearer test-only-not-a-real-key');
  assert.equal(received[0].payload.model, 'gemini-3.6-flash');
  assert.equal(received[1].payload.model, 'gemini-flash-lite-latest');
  assert.equal(received[1].payload.max_tokens, 2048);
  assert.equal(received[1].payload.reasoning_effort, 'medium');
  assert.deepEqual(received[1].payload.response_format, { type: 'json_object' });
  assert.deepEqual(received[1].payload.messages, [
    { role: 'system', content: 'Answer in JSON.' },
    { role: 'assistant', content: 'Ready.' },
    { role: 'user', content: 'Return a JSON object.' },
  ]);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-AI-Provider'), 'gemini');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://preview.example');
  assert.equal((await response.json()).id, 'chatcmpl-test');
});

test('returns the existing missing-key error without contacting Gemini', async () => {
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response('unexpected');
  }) as typeof fetch;
  const response = await worker.fetch(new Request('https://preview.example/api/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.102' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }),
  }), env());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'GEMINI_API_KEY_MISSING');
  assert.equal(called, false);
});

test('rejects oversized chat bodies and histories before contacting Gemini', async () => {
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response('unexpected');
  }) as typeof fetch;
  const response = await worker.fetch(new Request('https://preview.example/api/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.103' },
    body: JSON.stringify({ messages: Array.from({ length: 21 }, () => ({ role: 'user', content: 'hi' })) }),
  }), env(undefined, 'test-only-not-a-real-key'));
  assert.equal(response.status, 413);
  assert.equal((await response.json()).code, 'BODY_TOO_LARGE');

  const declaredTooLarge = await worker.fetch(new Request('https://preview.example/api/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': '48001', 'CF-Connecting-IP': '198.51.100.104' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }),
  }), env(undefined, 'test-only-not-a-real-key'));
  assert.equal(declaredTooLarge.status, 413);
  assert.equal(called, false);
});

test('passes Gemini SSE streams through and enforces the per-isolate request limit', async () => {
  let calls = 0;
  globalThis.fetch = (async (_input, init) => {
    calls++;
    if (JSON.parse(String(init?.body)).stream) {
      return new Response('data: {"choices":[]}\n\ndata: [DONE]\n\n', {
        headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
      });
    }
    return Response.json({ choices: [{ message: { content: 'ok' } }] });
  }) as typeof fetch;
  const base = 'https://preview.example/api/openai/v1/chat/completions';
  const streamResponse = await worker.fetch(new Request(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.105' },
    body: JSON.stringify({ stream: true, messages: [{ role: 'user', content: 'hello' }] }),
  }), env(undefined, 'test-only-not-a-real-key'));
  assert.equal(streamResponse.headers.get('Content-Type'), 'text/event-stream; charset=utf-8');
  assert.match(await streamResponse.text(), /data: \[DONE\]/);

  let lastResponse: Response | undefined;
  for (let index = 0; index < 20; index++) {
    lastResponse = await worker.fetch(new Request(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.106' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }),
    }), env(undefined, 'test-only-not-a-real-key'));
  }
  const limited = await worker.fetch(new Request(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.106' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }),
  }), env(undefined, 'test-only-not-a-real-key'));
  assert.equal(lastResponse?.status, 200);
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).code, 'RATE_LIMITED');
  assert.equal(calls, 21);
});

test('analyzes diary entries directly with Gemini JSON and preserves the existing response fields', async () => {
  let calls = 0;
  globalThis.fetch = (async (input, init) => {
    calls++;
    const request = new Request(input, init);
    assert.equal(request.url, 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
    assert.equal(request.headers.get('Authorization'), 'Bearer test-only-not-a-real-key');
    const payload = await request.json() as Record<string, any>;
    assert.deepEqual(payload.response_format, { type: 'json_object' });
    return Response.json({ choices: [{ message: { content: '{"keywords":["산책","비","마음"],"emotions":["평온"]}' } }] });
  }) as typeof fetch;
  const response = await worker.fetch(new Request('https://preview.example/api/ai/analyze-entry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.201' },
    body: JSON.stringify({ title: '비 온 뒤', content: '저녁에 걸으며 마음을 정리했다.', type: 'daily' }),
  }), env(undefined, 'test-only-not-a-real-key'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { keywords: ['산책', '비', '마음'], emotions: ['평온'], source: 'model' });
  assert.equal(calls, 1);
});

test('returns the existing local comfort fallback for a Bluebird blessing without calling Gemini', async () => {
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response('unexpected');
  }) as typeof fetch;
  const response = await worker.fetch(new Request('https://preview.example/api/ai/secret-blessing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.202' },
    body: JSON.stringify({ content: '회사 일이 너무 힘들다', userName: '쭈' }),
  }), env());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    comfortMantra: '쭈 님, 일터의 무거운 책임감을 잠시 내려놓고, 오늘 밤은 오직 당신만을 위한 따뜻하고 포근한 쉼을 누리세요.',
    source: 'engine',
  });
  assert.equal(called, false);
});

test('recommends a Bluebird note mood from the Gemini JSON contract', async () => {
  globalThis.fetch = (async () => Response.json({
    choices: [{ message: { content: '{"moodTag":"tears","reason":"남모르게 삼킨 슬픔이 담겨 있습니다."}' } }],
  })) as typeof fetch;
  const response = await worker.fetch(new Request('https://preview.example/api/ai/secret-mood-recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '198.51.100.203' },
    body: JSON.stringify({ content: '오늘은 눈물이 났다.' }),
  }), env(undefined, 'test-only-not-a-real-key'));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    moodTag: 'tears',
    moodLabel: '남모를 눈물',
    emoji: '💧',
    reason: '남모르게 삼킨 슬픔이 담겨 있습니다.',
    source: 'model',
  });
});

test('calculates saju locally with the existing response contract and no upstream request', async () => {
  let forwarded = false;
  globalThis.fetch = (async () => {
    forwarded = true;
    throw new Error('Saju must not contact an upstream');
  }) as typeof fetch;
  const input = { year: 1990, month: 5, day: 15, birthtime: '13:30', isLunar: false };
  const response = await worker.fetch(new Request('https://preview.example/api/saju/chart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://preview.example' },
    body: JSON.stringify(input),
  }), env());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), sajuChartFromInput(input));
  assert.equal(forwarded, false);

  const invalid = await worker.fetch(new Request('https://preview.example/api/saju/chart', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
  }), env());
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).code, 'invalid_year');

  const oversized = await worker.fetch(new Request('https://preview.example/api/saju/chart', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ extra: 'x'.repeat(17 * 1024) }),
  }), env());
  assert.equal(oversized.status, 413);
});

test('redirects artwork requests only to the existing allowlist without proxying bytes', async () => {
  let fetched = false;
  globalThis.fetch = (async () => {
    fetched = true;
    throw new Error('The Worker returns a redirect instead of fetching the image');
  }) as typeof fetch;
  const source = 'https://upload.wikimedia.org/wikipedia/commons/1/12/sample.jpg?width=800';
  const url = `https://preview.example/api/muse/artwork-image/proxy?url=${encodeURIComponent(source)}`;
  const response = await worker.fetch(new Request(url), env());
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), source);
  assert.match(response.headers.get('Cache-Control') || '', /s-maxage=86400/);
  assert.equal(fetched, false);

  for (const unsafe of ['http://upload.wikimedia.org/a.png', 'https://127.0.0.1/a.png', 'https://example.com/a.png', 'https://user@upload.wikimedia.org/a.png']) {
    const rejected = await worker.fetch(new Request(`https://preview.example/api/muse/artwork-image/proxy?url=${encodeURIComponent(unsafe)}`), env());
    assert.equal(rejected.status, 400);
  }
  const method = await worker.fetch(new Request(url, { method: 'POST' }), env());
  assert.equal(method.status, 405);
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
