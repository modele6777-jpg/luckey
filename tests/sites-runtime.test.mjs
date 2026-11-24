import assert from 'node:assert/strict';
import { test } from 'node:test';
import { gzipSync } from 'node:zlib';
import { readSitesLegacyMemory } from '../public/sites-sync-client.mjs';
import { createSitesWorker } from '../scripts/sites/runtime.mjs';

test('Sites adapter handles its D1 route and serves shared routes without an upstream', async () => {
  const html = 'LucKey portable';
  const worker = createSitesWorker({
    assets: { '/index.html': ['text/html', gzipSync(html).toString('base64')] },
    firebaseAuthOrigin: 'https://sample.firebaseapp.com',
    sitesSyncApi: {
      handleSitesSync(request, env) {
        return new URL(request.url).pathname === '/api/sites-sync/state' ? Response.json({ configured: Boolean(env.DB) }) : null;
      },
    },
    sitesNativeApi: {
      handleSitesGeminiChat: () => null,
      handleSitesApi: () => null,
    },
  });
  const call = path => worker.fetch(new Request('https://luckey.example' + path), { DB: {} });
  assert.deepEqual(await (await call('/api/sites-sync/state')).json(), { configured: true });
  assert.equal(await (await call('/voice')).text(), html);
  assert.equal((await call('/api/missing')).status, 503);
});

test('legacy adapter rejects a Sites account switch and ignores deleted or non-data keys', async () => {
  const request = () => Response.json({ account: 'sites-owner', entries: [
    { key: 'lucy_long_term_memory_v1:account-1', value: '[{"id":"from-d1"}]' },
    { key: 'lucy_soul_memories_archive:account-1', value: null },
    { key: 'prism_auth_token', value: 'never-copy' },
  ] });
  const client = { account: 'sites-owner', request };
  assert.deepEqual([...await readSitesLegacyMemory(client)], [
    ['lucy_long_term_memory_v1:account-1', '[{"id":"from-d1"}]'],
  ]);
  await assert.rejects(readSitesLegacyMemory({ account: 'old-owner', request }));
});
