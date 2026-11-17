import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { allowsSandboxRequest, installFullAppSandbox, FULL_APP_TEST_HOST } from '../src/debug/fullAppSandbox.ts';
test('isolated full app allows assets but denies APIs, writes and external data services', () => {
  const origin = 'https://' + FULL_APP_TEST_HOST;
  for (const url of ['/assets/App.js', '/version.json', '/calm/index.html']) assert.equal(allowsSandboxRequest(url, 'GET', origin), true);
  for (const [url, method] of [['/api/sync/vault', 'GET'], ['/api/ai/tts', 'POST'], ['/trpc/messages', 'GET'], ['/sharedState', 'POST'], ['https://firestore.googleapis.com/v1/test', 'GET']]) assert.equal(allowsSandboxRequest(url, method, origin), false);
});
test('sandbox cannot activate on the production app origin', () => {
  assert.throws(() => installFullAppSandbox({ location: { hostname: 'luckey.thezeze.chatgpt.site' } } as any), /restricted/);
  const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
  assert.ok(!main.includes('fullAppSandbox'));
  assert.ok(!main.includes('fullAppTest'));
});
test('installed request boundary denies network writes before invoking the transport', async () => {
  let calls = 0;
  class FakeXHR { open(..._args: any[]) { calls++; } }
  const saved: Record<string, string> = {};
  const win: any = {
    location: { hostname: FULL_APP_TEST_HOST, origin: 'https://' + FULL_APP_TEST_HOST },
    fetch: async () => { calls++; return new Response('asset'); },
    XMLHttpRequest: FakeXHR,
    localStorage: { setItem: (k: string, v: string) => { saved[k] = v; } },
    sessionStorage: { setItem: (k: string, v: string) => { saved[k] = v; } },
    document: { documentElement: { dataset: {} } },
  };
  installFullAppSandbox(win);
  assert.equal((await win.fetch('/api/sync/vault', { method: 'POST', body: 'test' })).status, 503);
  assert.equal((await win.fetch('https://firestore.googleapis.com/v1/test')).status, 503);
  assert.equal(calls, 0);
  assert.equal(await (await win.fetch('/assets/app.js')).text(), 'asset');
  assert.equal(calls, 1);
  assert.throws(() => new FakeXHR().open('POST', '/api/sync/vault'), /disabled/);
  assert.equal(calls, 1);
});
