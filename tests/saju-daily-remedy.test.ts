import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDetailedSaju, generateDailySajuReport } from '../src/lib/sajuAnalysis';
import { getKstDayNumber, msUntilNextKstDay } from '../src/hooks/useKstDay';

const profile = { basic: { name: '사용자', birthdate: '1990-05-17', birthtime: '12:00', gender: 'male' as const } };
const saju = calculateDetailedSaju(profile)!;
const core = (report: ReturnType<typeof generateDailySajuReport>) => {
  const { prescriptionTitle, luckyColor, luckyFood, luckyTea, actionTip } = report.remedy;
  return { prescriptionTitle, luckyColor, luckyFood, luckyTea, actionTip };
};

test('reported consecutive November dates no longer repeat colors and tea', () => {
  const reports = Array.from({ length: 4 }, (_, i) => generateDailySajuReport(saju, new Date(Date.UTC(2026, 10, 5 + i, 3))));
  for (let i = 1; i < reports.length; i++) {
    assert.notDeepEqual(core(reports[i]), core(reports[i - 1]));
    assert.notEqual(reports[i].remedy.luckyTea, reports[i - 1].remedy.luckyTea);
    assert.notEqual(reports[i].remedy.luckyColor, reports[i - 1].remedy.luckyColor);
  }
});

test('same KST day and profile remain stable across device time zones and reloads', () => {
  const first = generateDailySajuReport(saju, new Date('2026-11-05T00:01:00+09:00'));
  const later = generateDailySajuReport(saju, new Date('2026-11-05T14:59:00Z'));
  assert.deepEqual(core(first), core(later));
  assert.ok(later.speechText.includes(later.remedy.luckyTea));
  assert.ok(later.speechText.includes(later.remedy.luckyColor));
});

test('other prescription clicks change the visible recommendation every time', () => {
  const date = new Date('2026-11-05T03:00:00Z');
  for (let i = 1; i < 12; i++) {
    const previous = generateDailySajuReport(saju, date, i - 1);
    const next = generateDailySajuReport(saju, date, i);
    assert.notDeepEqual(core(previous), core(next));
    assert.notEqual(previous.remedy.luckyTea, next.remedy.luckyTea);
  }
});

test('month/year/leap-day boundaries advance the recommendation without changing birth data', () => {
  const before = JSON.stringify(saju);
  for (const iso of ['2026-11-30T03:00:00Z', '2026-12-31T03:00:00Z', '2024-02-28T03:00:00Z', '2024-02-29T03:00:00Z']) {
    const date = new Date(iso);
    assert.notDeepEqual(core(generateDailySajuReport(saju, date)), core(generateDailySajuReport(saju, new Date(date.getTime() + 86400000))));
  }
  assert.equal(JSON.stringify(saju), before);
});

test('KST midnight clock schedules refresh at the correct absolute time', () => {
  const before = Date.parse('2026-11-05T14:59:59.999Z');
  const midnight = before + 1;
  assert.equal(msUntilNextKstDay(before), 1);
  assert.equal(getKstDayNumber(midnight), getKstDayNumber(before) + 1);
  assert.equal(msUntilNextKstDay(midnight), 86400000);
});
