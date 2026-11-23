import assert from 'node:assert/strict';
import test from 'node:test';
import { safeLocalStorage } from '../src/utils/safeStorage.ts';
import { readLucyConsultMemory, saveLucyConsultMemory, setLucyConsultMemoryEnabled } from '../src/lib/lucyConsultMemory.ts';
import { deleteOrbMemory, loadOrbMemory, orbMemorySettings, saveOrbMemory, setOrbMemoryEnabled } from '../src/lib/orbConsult.ts';

const now = Date.now();
const record = { at: now, masterId: 'tarot', masterName: '타로', concern: '고민', advice: '조언' };

test('voice stores and uses memory only with explicit consent, scoped to the account and mode', () => {
  const account = 'voice-consent';
  saveOrbMemory(account, record, now);
  assert.deepEqual(orbMemorySettings(account, now).entries, []);
  setOrbMemoryEnabled(account, true, now);
  saveOrbMemory(account, record, now);
  assert.equal(loadOrbMemory(account, now).length, 1);
  assert.equal(loadOrbMemory('other-account', now).length, 0);
  assert.equal(readLucyConsultMemory(account, 'chat', now).entries.length, 0);
  setOrbMemoryEnabled(account, false, now);
  saveOrbMemory(account, { ...record, concern: '다른 고민' }, now);
  assert.deepEqual(loadOrbMemory(account, now), []);
  const { entries } = orbMemorySettings(account, now);
  assert.deepEqual(entries.map(entry => entry.concern), ['고민']);
  deleteOrbMemory(account, entries[0].id);
  assert.deepEqual(orbMemorySettings(account, now).entries, []);
});

test('legacy records stay out of prompts until consent and can be erased before consent', () => {
  const legacy = 'orb_consult_memory_v1:';
  for (const account of ['voice-legacy', 'voice-delete']) {
    safeLocalStorage.setItem(legacy + account, JSON.stringify([record]));
    assert.equal(orbMemorySettings(account, now).legacyCount, 1);
    assert.equal(loadOrbMemory(account, now).length, 0);
  }
  setOrbMemoryEnabled('voice-legacy', true, now);
  assert.equal(safeLocalStorage.getItem(legacy + 'voice-legacy'), null);
  assert.equal(loadOrbMemory('voice-legacy', now)[0].concern, record.concern);
  deleteOrbMemory('voice-delete');
  setOrbMemoryEnabled('voice-delete', true, now);
  assert.deepEqual(loadOrbMemory('voice-delete', now), []);
});

test('voice keeps the eight newest records for 90 days and its deletion leaves chat memory alone', () => {
  const account = 'voice-retention';
  setOrbMemoryEnabled(account, true, now);
  for (let i = 0; i < 10; i += 1) saveOrbMemory(account, { ...record, at: now - i }, now);
  assert.deepEqual(loadOrbMemory(account, now).map(entry => entry.at), Array.from({ length: 8 }, (_, i) => now - i));
  assert.equal(loadOrbMemory(account, now + 90 * 86_400_000).length, 0);
  setLucyConsultMemoryEnabled(account, 'chat', true, now);
  assert.ok(saveLucyConsultMemory(account, { ...record, id: 'chat-1', source: 'chat' }, now));
  deleteOrbMemory(account);
  assert.equal(readLucyConsultMemory(account, 'chat', now).entries.length, 1);
});
