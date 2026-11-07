import assert from 'node:assert/strict';
import test from 'node:test';
import { convertSolarToLunar, koreanLeapMonth, resolveEffectiveSolarDate } from '../src/lib/lunarCalendar';
import { inspectSajuProfile } from '../src/lib/sajuInput';
import { sajuChartFromInput } from '../server/api-lib/sajuChartApi';

// Source, fetched 2026-11-07 with HTTP 200:
// https://www.kasi.re.kr/kor/publication/post/newsMaterial/3660
// attachment https://www.kasi.re.kr/file/1457689454683_1.hwp
// "음력-양력 대조표(2017)" lists 초하루 and the KST conjunction clock.
// That clock is not a saju hour pillar. This file compares civil dates only.
// The app's −30 minute hour branch and 23:30 day rollover are a separate convention.
//
// https://astro.kasi.re.kr/life/pageView/4 returned HTTP 500 the same day.
// data.go.kr LrsrCldInfoService was not called (it needs a service key).
// korean-lunar-calendar, convertSolarToLunar, and MCP-vs-app are the same engine.
// Those checks are labeled below and are not this source.

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

function engineSolar(month: number, day: number, leap: boolean) {
  return resolveEffectiveSolarDate(
    `2017-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    'lunar',
    leap,
  ).solarDateString;
}

test('2017 new moons match the fetched KASI table, including regular month 6', () => {
  assert.equal(KASI_2017_NEW_MOONS.filter((row) => row.leap).map((row) => row.month).join(','), '5');
  for (let index = 0; index < KASI_2017_NEW_MOONS.length; index += 1) {
    const row = KASI_2017_NEW_MOONS[index];
    assert.equal(engineSolar(row.month, 1, row.leap), row.solar, `${row.month} leap=${row.leap}`);
    const next = KASI_2017_NEW_MOONS[index + 1];
    if (next) assert.equal(addDays(row.solar, row.length), next.solar);
  }
  assert.equal(koreanLeapMonth(2017), 5);
});

test('press-release holidays match the same table by civil-day offset', () => {
  // Body of the press page, not the HWP table: 정월대보름, 단오, 칠석.
  const holiday = (month: number, day: number) => {
    const start = KASI_2017_NEW_MOONS.find((row) => row.month === month && !row.leap);
    if (!start) throw new Error(`missing month ${month}`);
    return addDays(start.solar, day - 1);
  };
  assert.equal(holiday(1, 15), '2017-02-11');
  assert.equal(holiday(5, 5), '2017-05-30');
  assert.equal(holiday(7, 7), '2017-08-28');
  assert.equal(engineSolar(5, 5, false), '2017-05-30');
  assert.equal(engineSolar(7, 7, false), '2017-08-28');
});

test('reported 2017 month-6 dates use the KASI civil dates, and leap month 6 does not exist', () => {
  const month6 = KASI_2017_NEW_MOONS.find((row) => row.month === 6 && !row.leap);
  if (!month6) throw new Error('missing regular month 6');
  assert.equal(engineSolar(6, 1, false), month6.solar);
  assert.equal(engineSolar(6, 2, false), addDays(month6.solar, 1));
  assert.equal(engineSolar(6, 10, false), addDays(month6.solar, 9));
  assert.equal(month6.solar, '2017-07-23');
  assert.equal(addDays(month6.solar, 1), '2017-07-24');
  assert.equal(addDays(month6.solar, 9), '2017-08-01');

  const app = inspectSajuProfile({ basic: { birthdate: '2017-06-01', lunarSolar: 'lunar', isLeapMonth: true } });
  assert.equal(app?.code, 'invalid_leap_month');
  assert.match(app?.message || '', /2017년 음력 6월은 윤달이 아닙니다/);
  assert.match(app?.message || '', /윤달은 5월/);
  for (const day of [1, 2, 10]) {
    assert.throws(
      () => sajuChartFromInput({ year: 2017, month: 6, day, isLunar: true, isLeapMonth: true }),
      (error: unknown) => error instanceof Error && error.message === app?.message,
    );
  }
  const chart = sajuChartFromInput({ year: 2017, month: 6, day: 1, isLunar: true, birthtime: '12:00' });
  assert.equal(chart.solarEquivalentDate, '2017-07-23');
});

test('same-library round trip is only a consistency check', () => {
  const back = convertSolarToLunar(2017, 7, 23);
  assert.deepEqual(back, { year: 2017, month: 6, day: 1, isLeapMonth: false });
  assert.equal(engineSolar(back.month, back.day, back.isLeapMonth), '2017-07-23');
});

test('2020, 2023 and 2025 leaps are library checks, not a fetched KASI table', () => {
  const samples = [
    { year: 2020, month: 4, solar: '2020-05-23' },
    { year: 2023, month: 2, solar: '2023-03-22' },
    { year: 2025, month: 6, solar: '2025-07-25' },
  ];
  for (const sample of samples) {
    const iso = resolveEffectiveSolarDate(
      `${sample.year}-${String(sample.month).padStart(2, '0')}-01`,
      'lunar',
      true,
    ).solarDateString;
    assert.equal(iso, sample.solar);
    assert.equal(koreanLeapMonth(sample.year), sample.month);
  }
});
