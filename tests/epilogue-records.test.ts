import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeEpilogueDiaryEntries } from '../src/lib/epilogueDiaryRecords';
import { calculateEpilogueAchievementStats } from '../src/types/epilogueAchievement';

test('old reflection-only records render without a gratitude list', () => {
  const raw = [{ date: '2026-10-25', reflection: '오래된 일기', customField: 'preserved' }];
  const snapshot = JSON.stringify(raw);
  const [entry] = normalizeEpilogueDiaryEntries(raw);
  assert.equal(entry.dateKey, '2026-10-25');
  assert.equal(entry.mindDiary, '오래된 일기');
  assert.equal(entry.gratitudes.join(' · '), '');
  assert.equal((entry as any).customField, 'preserved');
  assert.equal(JSON.stringify(raw), snapshot);
  assert.equal(calculateEpilogueAchievementStats(raw as any).todayQuote, '오래된 일기');
});

test('partial sync data cannot crash sorting, text rendering or statistics', () => {
  const entries = normalizeEpilogueDiaryEntries([
    null, 3, [],
    { createdAt: 1792886400000, gratitudes: ['감사', null, 42], mindDiary: {} },
    { gratitudes: '하루에 감사', reflection: '날짜 없는 기록' },
  ]);
  assert.equal(entries.length, 2);
  assert.doesNotThrow(() => entries.sort((a, b) => b.dateKey.localeCompare(a.dateKey)));
  assert.deepEqual(entries.flatMap(e => e.gratitudes).sort(), ['감사', '하루에 감사']);
  assert.doesNotThrow(() => calculateEpilogueAchievementStats(entries));
});

test('current records preserve identity, dates and content', () => {
  const record = { id: 'diary-1', dateKey: '2026-10-26', createdAt: 1792972800000, mood: '성취감', moodEmoji: '✨', gratitudes: ['완료'], mindDiary: '오늘의 기록' };
  const [entry] = normalizeEpilogueDiaryEntries([record]);
  for (const key of Object.keys(record)) assert.deepEqual(entry[key as keyof typeof entry], record[key as keyof typeof record]);
  assert.deepEqual(normalizeEpilogueDiaryEntries(null), []);
});
