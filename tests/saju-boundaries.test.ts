import assert from 'node:assert/strict';
import test from 'node:test';
import { getAstronomicalSajuYear, getAstronomicalMonthBranch, getYearSolarTerms } from '../src/lib/astronomicalSolarTerms';
import { resolveEffectiveSolarDate } from '../src/lib/lunarCalendar';

test('ipchun boundary changes saju year exactly at term', () => {
  const ipchun = getYearSolarTerms(2026).find(term => term.name === '입춘');
  assert.ok(ipchun);
  assert.equal(getAstronomicalSajuYear(new Date(ipchun.date.getTime() - 1000)).sajuYear, 2025);
  assert.equal(getAstronomicalSajuYear(new Date(ipchun.date.getTime())).sajuYear, 2026);
});

test('ipchun boundary changes month branch from chou to yin', () => {
  const ipchun = getYearSolarTerms(2026).find(term => term.name === '입춘');
  assert.ok(ipchun);
  assert.equal(getAstronomicalMonthBranch(new Date(ipchun.date.getTime() - 1000)).monthBranchIndex, 11);
  assert.equal(getAstronomicalMonthBranch(new Date(ipchun.date.getTime())).monthBranchIndex, 0);
});

test('invalid birthdates do not silently become another date', () => {
  assert.throws(() => resolveEffectiveSolarDate('2026-02-30'), RangeError);
  assert.throws(() => resolveEffectiveSolarDate('not-a-date'), RangeError);
  assert.deepEqual(resolveEffectiveSolarDate('2024-02-29').solarDate, { year: 2024, month: 2, day: 29 });
});

test('invalid lunar date does not masquerade as solar', () => {
  assert.throws(() => resolveEffectiveSolarDate('2026-13-01', 'lunar'), RangeError);
});
