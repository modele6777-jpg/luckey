import assert from 'node:assert/strict';
import test from 'node:test';
import { convertSolarToLunar, resolveEffectiveSolarDate } from '../src/lib/lunarCalendar';
import { inspectSajuProfile, SajuInputError } from '../src/lib/sajuInput';
import { sajuChartFromInput } from '../server/api-lib/sajuChartApi';

// Korean dates below are from the KASI 2017 attachment fetched 2026-11-07 (HTTP 200):
// https://www.kasi.re.kr/kor/publication/post/newsMaterial/3660
// https://www.kasi.re.kr/file/1457689454683_1.hwp
// The table lists 초하루 and the KST conjunction clock. The clock is not a saju hour pillar.
// This file does not change conversion. It checks the existing Korean table.
//
// A Chinese almanac fetched the same day labels the same solar dates differently:
// http://cn.nongli.info/years/index.php?year=2017
// 2017-05-26 五月初一, 2017-06-24 六月初一, 2017-07-23 闰六月初一.
// https://www.yinliyangli.com/huangli/2017/2017.nongli.php agrees (HTTP 200).
// Those pages are not an official observatory. Adopting 闰六月 would be the wrong Korean date.
// https://astro.kasi.re.kr/life/pageView/4 returned HTTP 500.
// https://www.xinhuanet.com/politics/2017-07-22/c_1121363131.htm returned HTTP 404.
// Round trips and 2020/2023/2025 below are the same library, not another KASI file.

interface NewMoon {
  month: number;
  leap: boolean;
  length: 29 | 30;
  solar: string;
}

const KASI_2017_NEW_MOONS: NewMoon[] = [
  { month: 1, leap: false, length: 29, solar: '2017-01-28' },
  { month: 2, leap: false, length: 30, solar: '2017-02-26' },
  { month: 3, leap: false, length: 29, solar: '2017-03-28' },
  { month: 4, leap: false, length: 30, solar: '2017-04-26' },
  { month: 5, leap: false, length: 29, solar: '2017-05-26' },
  { month: 5, leap: true, length: 29, solar: '2017-06-24' },
  { month: 6, leap: false, length: 30, solar: '2017-07-23' },
  { month: 7, leap: false, length: 29, solar: '2017-08-22' },
  { month: 8, leap: false, length: 30, solar: '2017-09-20' },
  { month: 9, leap: false, length: 29, solar: '2017-10-20' },
  { month: 10, leap: false, length: 30, solar: '2017-11-18' },
  { month: 11, leap: false, length: 30, solar: '2017-12-18' },
  { month: 12, leap: false, length: 30, solar: '2018-01-17' },
];

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function engineSolar(year: number, month: number, day: number, leap: boolean) {
  return resolveEffectiveSolarDate(
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    'lunar',
    leap,
  ).solarDateString;
}

test('Korean 2017 regular and leap pairs match the KASI table', () => {
  assert.equal(engineSolar(2017, 5, 1, false), '2017-05-26');
  assert.equal(engineSolar(2017, 5, 1, true), '2017-06-24');
  assert.equal(engineSolar(2017, 6, 1, false), '2017-07-23');
  assert.equal(KASI_2017_NEW_MOONS.filter((row) => row.leap).map((row) => row.month).join(','), '5');
  for (let index = 0; index < KASI_2017_NEW_MOONS.length; index += 1) {
    const row = KASI_2017_NEW_MOONS[index];
    assert.equal(engineSolar(2017, row.month, 1, row.leap), row.solar);
    const next = KASI_2017_NEW_MOONS[index + 1];
    if (next) assert.equal(addDays(row.solar, row.length), next.solar);
  }
});

test('2017 leap month 6 does not exist on the Korean table and is rejected', () => {
  assert.throws(() => engineSolar(2017, 6, 1, true), RangeError);
  const app = inspectSajuProfile({ basic: { birthdate: '2017-06-01', lunarSolar: 'lunar', isLeapMonth: true } });
  assert.equal(app?.code, 'invalid_leap_month');
  assert.match(app?.message || '', /윤달이 아니거나/);
  assert.throws(
    () => sajuChartFromInput({ year: 2017, month: 6, day: 1, isLunar: true, isLeapMonth: true }),
    (error: unknown) => error instanceof SajuInputError && error.code === 'invalid_leap_month' && error.message === app?.message,
  );
  const chart = sajuChartFromInput({ year: 2017, month: 6, day: 1, isLunar: true, birthtime: '12:00' });
  assert.equal(chart.solarEquivalentDate, '2017-07-23');
});

test('press-release holidays follow the KASI 초하루 by civil days', () => {
  const holiday = (month: number, day: number) => {
    const start = KASI_2017_NEW_MOONS.find((row) => row.month === month && !row.leap);
    if (!start) throw new Error(`missing month ${month}`);
    return addDays(start.solar, day - 1);
  };
  assert.equal(holiday(1, 15), '2017-02-11');
  assert.equal(holiday(5, 5), '2017-05-30');
  assert.equal(holiday(7, 7), '2017-08-28');
  assert.equal(engineSolar(2017, 5, 5, false), '2017-05-30');
  assert.equal(engineSolar(2017, 7, 7, false), '2017-08-28');
});

test('solar to lunar round trip only repeats this library', () => {
  const back = convertSolarToLunar(2017, 7, 23);
  assert.deepEqual(back, { year: 2017, month: 6, day: 1, isLeapMonth: false });
  assert.equal(engineSolar(2017, back.month, back.day, back.isLeapMonth), '2017-07-23');
});

test('2020, 2023 and 2025 leap days are library checks, not another fetched KASI file', () => {
  assert.equal(engineSolar(2020, 4, 1, true), '2020-05-23');
  assert.equal(engineSolar(2023, 2, 1, true), '2023-03-22');
  assert.equal(engineSolar(2025, 6, 1, true), '2025-07-25');
});
