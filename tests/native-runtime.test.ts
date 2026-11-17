import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { Capacitor } from '@capacitor/core';
import { nativeApiUrl } from '../src/native/apiRouting.ts';
import { installNativeRuntime, nativeImpact } from '../src/native/runtime.ts';

const origin = 'capacitor://localhost';
const remote = 'https://luckey-six.vercel.app';
test('only local API routes map to the configured HTTPS server', () => {
  assert.equal(nativeApiUrl('/api/ai/tts?format=binary', origin, remote), remote + '/api/ai/tts?format=binary');
  assert.equal(nativeApiUrl(origin + '/api/openai/v1/chat/completions', origin, remote), remote + '/api/openai/v1/chat/completions');
  assert.equal(nativeApiUrl('/openai/v1/chat/completions', origin, remote), remote + '/openai/v1/chat/completions');
  for (const url of ['/assets/engine.js', '/tarot-backs/lucky_clover.svg', 'https://google.com/api/ai', 'custom://other/api/ai']) {
    assert.equal(nativeApiUrl(url, origin, remote), url);
  }
  for (const invalid of ['http://server.example', 'https://user:password@server.example', 'https://server.example/path']) {
    assert.throws(() => nativeApiUrl('/api/ai', origin, invalid), /HTTPS origin/);
  }
});
test('browser builds do not install fetch hooks or trigger native haptics', () => {
  assert.equal(Capacitor.isNativePlatform(), false);
  installNativeRuntime();
  assert.equal(nativeImpact(), false);
});
test('native fetch preserves POST body, bearer headers, cancellation and SSE response', async () => {
  const original = Capacitor.isNativePlatform;
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const captured: { input: RequestInfo | URL; init?: RequestInit }[] = [];
  const response = new Response('data: hello\n\ndata: [DONE]\n\n', { headers: { 'Content-Type': 'text/event-stream' } });
  const browser = { location: { origin }, fetch: async (input: RequestInfo | URL, init?: RequestInit) => { captured.push({ input, init }); return response; } };
  try {
    Capacitor.isNativePlatform = () => true;
    Object.defineProperty(globalThis, 'window', { value: browser, configurable: true });
    Object.defineProperty(globalThis, 'document', { value: { documentElement: { classList: { add() {} } } }, configurable: true });
    installNativeRuntime();
    const controller = new AbortController();
    const req = new Request(origin + '/api/ai', { method: 'POST', headers: { Authorization: 'Bearer test' }, body: 'reading', signal: controller.signal });
    const result = await browser.fetch(req);
    const forwarded = captured[0].input as Request;
    assert.equal(forwarded.url, remote + '/api/ai');
    assert.equal(forwarded.method, 'POST');
    assert.equal(forwarded.headers.get('Authorization'), 'Bearer test');
    assert.equal(await forwarded.text(), 'reading');
    controller.abort(); assert.equal(forwarded.signal.aborted, true);
    assert.equal(result, response);
    assert.match(result.headers.get('Content-Type')!, /text\/event-stream/);
    const before = browser.fetch; installNativeRuntime(); assert.equal(browser.fetch, before);
  } finally {
    Capacitor.isNativePlatform = original;
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow); else delete (globalThis as any).window;
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else delete (globalThis as any).document;
  }
});
test('native app remains bundled, with streaming-safe networking and rotations', () => {
  const config = readFileSync(new URL('../capacitor.config.ts', import.meta.url), 'utf8');
  assert.match(config, /webDir: 'dist'/);
  assert.doesNotMatch(config, /url:\s*['"]https?:/);
  assert.doesNotMatch(config, /CapacitorHttp:\s*\{\s*enabled:\s*true/);
  const plist = readFileSync(new URL('../ios/App/App/Info.plist', import.meta.url), 'utf8');
  assert.match(plist, /UIInterfaceOrientationLandscapeLeft/);
  assert.match(plist, /UIInterfaceOrientationLandscapeRight/);
  assert.match(plist, /UIRequiresFullScreen<\/key>\s*<false/);
});
