import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exportLucyMemoryBackup, restoreLucyMemoryBackup } from '../src/lib/lucyMemoryBackup';

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

test('backup preserves account memory across hosts without collecting credentials', () => {
  const consult = 'lucy_consult_memory_v1:account-1';
  const pro = 'lucy_pro_history_v1:account-1';
  const settings = JSON.stringify({ enabled: { chat: true }, entries: [], sharing: true });
  const session = JSON.stringify({ day: '2026-11-24', messages: [{ id: 'question', role: 'user' }] });
  const backup = exportLucyMemoryBackup(storage({
    [consult]: settings,
    [pro]: session,
    'lucy_consult_memory_v1:account-2': 'another-user',
    'prism_auth_token': 'do-not-export',
  }), 'account-1');
  assert.ok(!backup.includes('another-user'));
  assert.ok(!backup.includes('do-not-export'));
  const fresh = storage({ [pro]: JSON.stringify({ day: '2026-11-24', messages: [{ id: 'greet-2026-11-24' }] }) });
  assert.deepEqual(restoreLucyMemoryBackup(fresh, 'account-1', backup), { restored: 2, skipped: 0 });
  assert.equal(fresh.getItem(consult), settings);
  assert.equal(fresh.getItem(pro), session);
  assert.deepEqual(restoreLucyMemoryBackup(fresh, 'account-1', backup), { restored: 0, skipped: 2 });
  assert.throws(() => restoreLucyMemoryBackup(fresh, 'account-2', backup));
});

test('a malformed backup is rejected before writing any memory', () => {
  const target = storage();
  const backup = JSON.stringify({ format: 'luckey-memory-backup-v1', account: 'a', entries: {
    'lucy_consult_memory_v1:a': '{}',
    'lucy_master_sessions:a': '{}',
  } });
  assert.throws(() => restoreLucyMemoryBackup(target, 'a', backup));
  assert.equal(target.length, 0);
});
