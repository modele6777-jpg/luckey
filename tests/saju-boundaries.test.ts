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

test('solar terms land in expected Korean calendar months', () => {
  for (const year of [1994, 2024, 2026]) {
    const terms = getYearSolarTerms(year);
    assert.equal(terms.length, 24);
    const ipchun = terms.find(term => term.name === '입춘');
    const sohan = terms.find(term => term.name === '소한');
    const dongji = terms.find(term => term.name === '동지');
    assert.ok(ipchun && sohan && dongji);
    assert.equal(ipchun.date.getUTCFullYear(), year);
    assert.equal(ipchun.date.getUTCMonth(), 1);
    assert.ok(ipchun.date.getUTCDate() >= 3 && ipchun.date.getUTCDate() <= 5);
    assert.equal(sohan.date.getUTCMonth(), 0);
    assert.equal(dongji.date.getUTCMonth(), 11);
  }
});

test('birthdate validation handles leap years and calendar boundaries', () => {
  assert.throws(() => resolveEffectiveSolarDate('2025-02-29'), RangeError);
  assert.throws(() => resolveEffectiveSolarDate('2026-04-31'), RangeError);
  assert.throws(() => resolveEffectiveSolarDate('2026-00-10'), RangeError);
  assert.deepEqual(resolveEffectiveSolarDate('2000-02-29').solarDate, { year: 2000, month: 2, day: 29 });
});
