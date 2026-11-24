import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deleteApp, initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, doc, getDocFromServer, getFirestore, setDoc, terminate } from 'firebase/firestore';
import { deleteLucyCloudBackup, readLucyCloudBackup, writeLucyCloudBackup } from '../src/lib/lucyMemoryCloudBackup';
import { exportLucyMemoryBackup, restoreLucyMemoryBackup } from '../src/lib/lucyMemoryBackup';

const emulator = process.env.FIRESTORE_EMULATOR_HOST;
const projectId = 'demo-luckey-portable';

function storage(values: Record<string, string> = {}): Storage {
  const entries = new Map(Object.entries(values));
  return {
    get length() { return entries.size; },
    clear: () => entries.clear(),
    key: index => [...entries.keys()][index] ?? null,
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => { entries.set(key, value); },
    removeItem: key => { entries.delete(key); },
  };
}

test('portable backup picks missing, account-scoped data from the old host only', () => {
  const keys = {
    local: 'lucy_consult_memory_v1:owner',
    legacy: 'lucy_long_term_memory_v1:owner',
    other: 'lucy_long_term_memory_v1:other',
  };
  const source = storage({ [keys.local]: JSON.stringify({ entries: [], enabled: { chat: true }, sharing: true }) });
  const target = storage();
  const backup = exportLucyMemoryBackup(source, 'owner', new Map([
    [keys.local, '{}'],
    [keys.legacy, '[{"id":"remembered"}]'],
    [keys.other, '[{"id":"private"}]'],
  ]));
  assert.deepEqual(restoreLucyMemoryBackup(target, 'owner', backup), { restored: 2, skipped: 0 });
  assert.equal(target.getItem(keys.local), source.getItem(keys.local));
  assert.equal(target.getItem(keys.legacy), '[{"id":"remembered"}]');
  assert.equal(target.getItem(keys.other), null);
});

test('two independent Firebase clients retain profiles, learning and verified memory on host switch', { skip: !emulator }, async () => {
  const [host, portString] = emulator!.split(':');
  const port = Number(portString);
  assert.equal(host, '127.0.0.1', 'requires a local emulator');
  const suffix = crypto.randomUUID();
  const uid = `owner-${suffix}`;
  const oldApp = initializeApp({ projectId }, `old-${suffix}`);
  const newApp = initializeApp({ projectId }, `new-${suffix}`);
  const otherApp = initializeApp({ projectId }, `other-${suffix}`);
  const oldDb = getFirestore(oldApp);
  const newDb = getFirestore(newApp);
  const otherDb = getFirestore(otherApp);
  connectFirestoreEmulator(oldDb, host, port, { mockUserToken: { sub: uid, knowledgeAdmin: true } });
  connectFirestoreEmulator(newDb, host, port, { mockUserToken: { sub: uid } });
  connectFirestoreEmulator(otherDb, host, port, { mockUserToken: { sub: 'other-owner' } });
  const memoryKey = `lucy_long_term_memory_v1:${uid}`;
  const consult = `lucy_consult_memory_v1:${uid}`;
  const history = JSON.stringify([{ id: 'original-event', text: '옮길 기억'.repeat(42000) }]);
  const consent = JSON.stringify({ enabled: { chat: true, voice: true }, entries: [], sharing: true });
  try {
    await setDoc(doc(oldDb, 'sharedState', uid), { marker: 'original-profile' });
    await setDoc(doc(oldDb, 'chatThreads', uid), { marker: 'original-chat' });
    await setDoc(doc(oldDb, 'lucyKnowledgePublished', suffix), { status: 'approved', title: 'original-learning' });
    const backup = exportLucyMemoryBackup(storage({ [consult]: consent }), uid, new Map([[memoryKey, history]]));
    await writeLucyCloudBackup(oldDb, uid, backup);
    const transfer = await readLucyCloudBackup(newDb, uid);
    assert.equal(transfer, backup);

    const destination = storage({ [consult]: '{}', [memoryKey]: '[]' });
    assert.deepEqual(restoreLucyMemoryBackup(destination, uid, transfer!), { restored: 1, skipped: 1 });
    assert.equal(destination.getItem(memoryKey), history);
    assert.equal(destination.getItem(consult), '{}');
    assert.equal((await getDocFromServer(doc(newDb, 'sharedState', uid))).data()?.marker, 'original-profile');
    assert.equal((await getDocFromServer(doc(newDb, 'chatThreads', uid))).data()?.marker, 'original-chat');
    assert.equal((await getDocFromServer(doc(newDb, 'lucyKnowledgePublished', suffix))).data()?.title, 'original-learning');
    await assert.rejects(readLucyCloudBackup(otherDb, uid), { code: 'permission-denied' });

    await deleteLucyCloudBackup(newDb, uid);
    assert.equal(await readLucyCloudBackup(oldDb, uid), null);
    assert.equal((await getDocFromServer(doc(oldDb, 'chatThreads', uid))).data()?.marker, 'original-chat');
  } finally {
    await Promise.all([terminate(oldDb), terminate(newDb), terminate(otherDb)]);
    await Promise.all([deleteApp(oldApp), deleteApp(newApp), deleteApp(otherApp)]);
  }
});
