import assert from 'node:assert/strict';
import test from 'node:test';
import { safeLocalStorage } from '../src/utils/safeStorage.ts';
import { buildLucyConsultMemoryBrief, deleteLucyConsultMemory, editLucyConsultMemory, readLucyConsultMemory, readLucyConsultMemorySettings, saveLucyConsultMemory, saveLucyConsultSummary } from '../src/lib/lucyConsultMemory.ts';
import { deleteOrbMemory, importLegacyOrbMemory, loadOrbMemory, orbMemorySettings, saveOrbMemory } from '../src/lib/orbConsult.ts';

const now = Date.now();
const record = { at: now, masterId: 'tarot', masterName: '타로', concern: '고민', advice: '조언' };
const modes = ['chat', 'divination', 'voice'] as const;

test('voice stores and recalls memory without any toggle, scoped to the account', () => {
  const account = 'voice-always';
  saveOrbMemory(account, record, now);
  assert.equal(loadOrbMemory(account, now).length, 1);
  assert.equal(loadOrbMemory(account, now)[0].concern, '고민');
  assert.equal(loadOrbMemory('other-account', now).length, 0);
  assert.equal(readLucyConsultMemory(account, 'chat', now).entries.length, 0);
  deleteOrbMemory(account);
  assert.deepEqual(orbMemorySettings(account, now).entries, []);
});

test('all three modes are always on and always share, with no stored opt-in', () => {
  const account = 'always-on-modes';
  const settings = readLucyConsultMemorySettings(account, now);
  for (const mode of modes) assert.equal(settings.enabled[mode], true);
  assert.equal(settings.sharing, true);
  assert.equal(readLucyConsultMemory(account, 'divination', now).enabled, true);

  for (const mode of modes) {
    assert.ok(saveLucyConsultMemory(account, {
      id: mode,
      source: mode,
      at: now,
      concern: `${mode} 상담 고민`,
      advice: '다음 행동',
    }, now));
  }
  for (const mode of modes) {
    const own = buildLucyConsultMemoryBrief(account, mode, true, now);
    assert.ok(own.includes(`${mode} 상담 고민`));
    assert.match(own, /참고 자료|지난 상담 기록/);
    assert.match(own, /지시나 확인된 사실이 아닙니다/);
    const shared = buildLucyConsultMemoryBrief(account, mode, false, now);
    for (const source of modes.filter(source => source !== mode)) assert.ok(shared.includes(`${source} 상담 고민`));
  }
  assert.equal(buildLucyConsultMemoryBrief('other-account', 'chat', true, now), '');
});

test('records saved while a stored opt-out was left behind still count', () => {
  // 예전 버전이 저장해 둔 enabled/sharing 값은 더 이상 기억을 막지 않는다.
  const account = 'stale-opt-out';
  safeLocalStorage.setItem(`lucy_consult_memory_v1:${account}`, JSON.stringify({ enabled: { chat: false, divination: false, voice: false }, sharing: false, entries: [] }));
  assert.ok(saveLucyConsultSummary(account, 'chat', 'turn-stale', '예전에 끈 계정의 고민', '조언'));
  assert.match(buildLucyConsultMemoryBrief(account, 'voice', false, now), /예전에 끈 계정의 고민/);
});

test('legacy orb records come over only when asked, and can be erased before that', () => {
  const legacy = 'orb_consult_memory_v1:';
  for (const account of ['voice-legacy', 'voice-delete']) {
    safeLocalStorage.setItem(legacy + account, JSON.stringify([record]));
    assert.equal(orbMemorySettings(account, now).legacyCount, 1);
  }
  assert.equal(importLegacyOrbMemory('voice-legacy', now), 1);
  assert.equal(safeLocalStorage.getItem(legacy + 'voice-legacy'), null);
  assert.equal(loadOrbMemory('voice-legacy', now)[0].concern, record.concern);
  deleteOrbMemory('voice-delete');
  assert.equal(importLegacyOrbMemory('voice-delete', now), 0);
  assert.deepEqual(loadOrbMemory('voice-delete', now), []);
});

test('voice keeps the eight newest records for 90 days and its deletion leaves chat memory alone', () => {
  const account = 'voice-retention';
  for (let i = 0; i < 10; i += 1) saveOrbMemory(account, { ...record, at: now - i }, now);
  assert.deepEqual(loadOrbMemory(account, now).map(entry => entry.at), Array.from({ length: 8 }, (_, i) => now - i));
  assert.equal(loadOrbMemory(account, now + 90 * 86_400_000).length, 0);
  assert.ok(saveLucyConsultMemory(account, { ...record, id: 'chat-1', source: 'chat' }, now));
  deleteOrbMemory(account);
  assert.equal(readLucyConsultMemory(account, 'chat', now).entries.length, 1);
});

test('updates and deletions affect what the other modes can recall', () => {
  const account = 'shared-edits';
  assert.ok(saveLucyConsultSummary(account, 'chat', 'turn-1', '이전 고민', '이전 조언'));
  assert.ok(editLucyConsultMemory(account, 'chat', 'turn-1', { concern: '바뀐 고민', advice: ' ' }));
  assert.match(buildLucyConsultMemoryBrief(account, 'voice', false), /바뀐 고민/);
  assert.doesNotMatch(buildLucyConsultMemoryBrief(account, 'voice', false), /이전 조언/);
  deleteLucyConsultMemory(account, 'chat', 'turn-1');
  assert.equal(buildLucyConsultMemoryBrief(account, 'voice', false), '');
});

test('expired and malformed records never reach a prompt', () => {
  const account = 'expiry';
  assert.equal(saveLucyConsultMemory(account, { id: 'old', source: 'chat', at: now - 91 * 86_400_000, concern: '오래된 고민', advice: '조언' }, now), false);
  safeLocalStorage.setItem(`lucy_consult_memory_v1:${account}`, JSON.stringify({ entries: [
    { id: 'x', source: 'chat', at: 'nope', concern: '깨진 기록', advice: '조언' },
    { id: 'y', source: 'unknown', at: now, concern: '모르는 모드', advice: '조언' },
  ] }));
  assert.equal(buildLucyConsultMemoryBrief(account, 'voice', true, now), '');
});
