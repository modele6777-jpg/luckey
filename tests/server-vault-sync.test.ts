import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import { getVaultData, ifNoneMatchMatches, saveVaultData } from '../server/api-lib/syncRelay';
import { readServerVaultPullResponse } from '../src/lib/serverVaultProtocol';
import { createServerVaultPollBackoff, SERVER_VAULT_POLL_BASE_MS, SERVER_VAULT_POLL_MAX_MS } from '../src/lib/serverVaultPollBackoff';
import type { SharedState } from '../src/lib/sharedState';
import app from '../api/index';

const testUid = () => `test-vault-${randomUUID()}`;

test('unchanged vault keeps the same ETag and round-trips all private state', () => {
  const uid = testUid();
  const payload = {
    clientUpdatedAt: 100,
    userProfile: { basic: { nickname: 'Synthetic' } },
    chatHistory: [{ id: 'message-1', role: 'user', content: 'synthetic test content', timestamp: 100 }],
    userGoals: [{ id: 'goal-1', title: 'synthetic goal' }],
  } as unknown as SharedState;

  const first = saveVaultData(uid, payload);
  const unchanged = saveVaultData(uid, structuredClone(payload));
  const stored = getVaultData(uid);

  assert.equal(unchanged.etag, first.etag);
  assert.equal(unchanged.updatedAt, first.updatedAt);
  assert.equal(ifNoneMatchMatches(first.etag, unchanged.etag), true);
  assert.deepEqual(stored.data, payload);
});

test('changed vault gets a new ETag and the stored state includes the complete update', () => {
  const uid = testUid();
  const original = {
    clientUpdatedAt: 100,
    chatHistory: [{ id: 'local-message', role: 'user', content: 'kept', timestamp: 100 }],
    userGoals: [{ id: 'goal-local', title: 'kept goal' }],
  };
  const first = saveVaultData(uid, original);
  const changed = {
    ...original,
    clientUpdatedAt: 200,
    chatHistory: [...original.chatHistory, { id: 'remote-message', role: 'model', content: 'new', timestamp: 200 }],
  };
  const next = saveVaultData(uid, changed);

  assert.notEqual(next.etag, first.etag);
  assert.equal(ifNoneMatchMatches(first.etag, next.etag), false);
  assert.deepEqual(getVaultData(uid).data, changed);
});

test('a 304 pull yields no replacement state, preserving the client state; a changed 200 yields the new state', async () => {
  const uid = testUid();
  const existing = {
    clientUpdatedAt: 300,
    userProfile: { basic: { nickname: 'Local profile' } },
    chatHistory: [{ id: 'local-message', role: 'user', content: 'keep this', timestamp: 300 }],
    userGoals: [{ id: 'local-goal', title: 'keep this goal' }],
  } as unknown as SharedState;
  const etags = new Map<string, string>([[uid, '"vault-a"']]);
  const unchanged = await readServerVaultPullResponse(
    uid,
    new Response(null, { status: 304, headers: { ETag: '"vault-a"' } }),
    etags,
  );
  const afterUnchanged = unchanged ? { ...existing, ...unchanged } : existing;
  assert.equal(unchanged, null);
  assert.deepEqual(afterUnchanged, existing);

  const remote = {
    ...existing,
    clientUpdatedAt: 400,
    chatHistory: [...existing.chatHistory, { id: 'remote-message', role: 'model', content: 'new remote record', timestamp: 400 }],
  } as unknown as SharedState;
  const changed = await readServerVaultPullResponse(
    uid,
    new Response(JSON.stringify({ success: true, data: remote }), { status: 200, headers: { 'Content-Type': 'application/json', ETag: '"vault-b"' } }),
    etags,
  );
  assert.deepEqual(changed, remote);
  assert.equal(etags.get(uid), '"vault-b"');
  assert.equal(changed?.chatHistory?.length, 2);
  assert.equal(changed?.userGoals?.[0]?.title, 'keep this goal');
});

test('a malformed full response does not replace the last good ETag', async () => {
  const uid = testUid();
  const etags = new Map<string, string>([[uid, '"last-good"']]);
  const result = await readServerVaultPullResponse(
    uid,
    new Response('{broken', { status: 200, headers: { ETag: '"new-but-unreadable"' } }),
    etags,
  );
  assert.equal(result, null);
  assert.equal(etags.get(uid), '"last-good"');
});

test('polling backs off while unchanged and resets on realtime reconnect or new data', () => {
  const backoff = createServerVaultPollBackoff();
  assert.equal(backoff.current(), SERVER_VAULT_POLL_BASE_MS);
  assert.equal(backoff.afterPoll(false), 30_000);
  assert.equal(backoff.afterPoll(false), 60_000);
  assert.equal(backoff.afterPoll(false), SERVER_VAULT_POLL_MAX_MS);
  assert.equal(backoff.afterPoll(false), SERVER_VAULT_POLL_MAX_MS);
  assert.equal(backoff.reset(), SERVER_VAULT_POLL_BASE_MS);
  assert.equal(backoff.afterPoll(false), 30_000);
  assert.equal(backoff.afterPoll(true), SERVER_VAULT_POLL_BASE_MS);
});

test('If-None-Match supports weak validators, lists and wildcard without exposing vault data', () => {
  const etag = '"opaque-private-revision"';
  assert.equal(ifNoneMatchMatches(`W/${etag}`, etag), true);
  assert.equal(ifNoneMatchMatches(`"other", ${etag}`, etag), true);
  assert.equal(ifNoneMatchMatches('*', etag), true);
  assert.equal(ifNoneMatchMatches('"other"', etag), false);
});

test('authenticated synthetic HTTP pull sends 304 with zero body and records only byte counts', async () => {
  const uid = testUid();
  const token = 'synthetic-test-token';
  const syntheticOnly = 'synthetic-vault-private-content-never-log';
  const payload = {
    clientUpdatedAt: 500,
    chatHistory: [{ id: 'synthetic-message', role: 'user', content: syntheticOnly, timestamp: 500 }],
    userGoals: [{ id: 'synthetic-goal', title: 'Synthetic only' }],
  };
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const originalFetch = globalThis.fetch;
  const originalInfo = console.info;
  const capturedLogs: string[] = [];
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input).startsWith('https://identitytoolkit.googleapis.com/')) {
      return Promise.resolve(new Response(JSON.stringify({ users: [{ localId: uid }] }), { status: 200 }));
    }
    return originalFetch(input, init);
  }) as typeof fetch;
  console.info = (...args: unknown[]) => capturedLogs.push(args.map(String).join(' '));

  try {
    const authorization = { Authorization: `Bearer ${token}` };
    const push = await originalFetch(`${baseUrl}/api/sync/vault/push`, {
      method: 'POST',
      headers: { ...authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, payload }),
    });
    assert.equal(push.status, 200);
    const pushResult = await push.json() as { etag: string };
    assert.ok(pushResult.etag);

    const fullPull = await originalFetch(`${baseUrl}/api/sync/vault/pull/${encodeURIComponent(uid)}`, { headers: authorization });
    assert.equal(fullPull.status, 200);
    assert.match(fullPull.headers.get('cache-control') || '', /private.*no-store/);
    assert.equal(fullPull.headers.get('etag'), pushResult.etag);
    const fullBody = await fullPull.text();
    const fullBytes = Buffer.byteLength(fullBody, 'utf8');
    assert.equal(Number(fullPull.headers.get('content-length')), fullBytes);
    assert.ok(fullBytes > 0);

    const unchangedPull = await originalFetch(`${baseUrl}/api/sync/vault/pull/${encodeURIComponent(uid)}`, {
      headers: { ...authorization, 'If-None-Match': pushResult.etag },
    });
    assert.equal(unchangedPull.status, 304);
    assert.match(unchangedPull.headers.get('cache-control') || '', /private.*no-store/);
    assert.equal(await unchangedPull.text(), '');

    const changedPayload = {
      ...payload,
      clientUpdatedAt: 600,
      chatHistory: [...payload.chatHistory, { id: 'synthetic-new-message', role: 'model', content: 'new synthetic reply', timestamp: 600 }],
    };
    const changedPush = await originalFetch(`${baseUrl}/api/sync/vault/push`, {
      method: 'POST',
      headers: { ...authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, payload: changedPayload }),
    });
    const changedETag = (await changedPush.json() as { etag: string }).etag;
    assert.notEqual(changedETag, pushResult.etag);
    const changedPull = await originalFetch(`${baseUrl}/api/sync/vault/pull/${encodeURIComponent(uid)}`, {
      headers: { ...authorization, 'If-None-Match': pushResult.etag },
    });
    assert.equal(changedPull.status, 200);
    const changedBody = JSON.parse(await changedPull.text());
    assert.equal(changedBody.data.chatHistory.length, 2);
    assert.equal(changedBody.data.chatHistory[0].content, syntheticOnly);
    assert.equal(changedBody.data.userGoals[0].title, 'Synthetic only');

    const transferMetrics = capturedLogs.map((line) => JSON.parse(line.slice(line.indexOf('{'))));
    const unchangedMetric = transferMetrics.find((metric) => metric.status === 304);
    assert.ok(unchangedMetric);
    assert.equal(unchangedMetric.responseBodyBytes, 0);
    assert.equal(unchangedMetric.representationBytes, fullBytes);
    assert.ok(transferMetrics.some((metric) => metric.status === 200 && metric.responseBodyBytes === fullBytes));
    assert.doesNotMatch(capturedLogs.join('\n'), new RegExp(`${uid}|${token}|${syntheticOnly}|${pushResult.etag}`));
  } finally {
    console.info = originalInfo;
    globalThis.fetch = originalFetch;
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
