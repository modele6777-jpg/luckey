import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getManualSyncChangelogEntries,
  getUnseenChangelogEntries,
  hasPendingUpdateNotice,
  markPendingUpdateNotice,
  clearPendingUpdateNotice,
  type ChangelogEntry,
} from '../src/lib/updateNotice';

const notes: ChangelogEntry[] = [
  { version: '1.7.443', summary: '최신', items: ['목록'] },
  { version: '1.7.442', summary: '이전', items: ['이전 항목'] },
  { version: '1.7.400', summary: '오래됨', items: ['옛 항목'] },
];

test('a refresh shows the installed version and does not include newer notes', () => {
  const shown = getManualSyncChangelogEntries(notes, '1.7.442', 10);
  assert.deepEqual(shown.map((entry) => entry.version), ['1.7.442', '1.7.400']);
  assert.equal(shown[0].items?.[0], '이전 항목');
});

test('an update shows versions the user has not acknowledged', () => {
  const unseen = getUnseenChangelogEntries(notes, '1.7.443', '1.7.441');
  assert.deepEqual(unseen.map((entry) => entry.version), ['1.7.442', '1.7.443']);
});

test('the update flag survives a sessionStorage wipe', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => { data.set(key, value); },
      removeItem: (key: string) => { data.delete(key); },
    };
  };
  const session = memory();
  const local = memory();
  Object.assign(globalThis, { window: { sessionStorage: session, localStorage: local } });
  clearPendingUpdateNotice();
  markPendingUpdateNotice();
  session.removeItem('prism_refresh_update_notice');
  session.removeItem('prism_pending_update_notice');
  assert.equal(hasPendingUpdateNotice(), true);
  clearPendingUpdateNotice();
  assert.equal(hasPendingUpdateNotice(), false);
});
