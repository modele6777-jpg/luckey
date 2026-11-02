import assert from 'node:assert/strict';
import test from 'node:test';
import { getAstronomicalSajuYear, getAstronomicalMonthBranch, getYearSolarTerms } from '../src/lib/astronomicalSolarTerms';
import { convertSolarToLunar, resolveEffectiveSolarDate } from '../src/lib/lunarCalendar';

test('solar to lunar preserves leap-month identity and round-trips', () => {
  // Korean lunar calendar, not Chinese calendar; published reference example:
  // https://github.com/usingsky/korean_lunar_calendar_js (2017-06-24 = leap 5/1).
  // 2023 leap 2/1 is also the existing regression anchor below.
  for (const [solar, year, month, day] of [
    ['2017-06-24', 2017, 5, 1],
    ['2023-03-22', 2023, 2, 1],
  ] as const) {
    const [sy, sm, sd] = solar.split('-').map(Number);
    const lunar = convertSolarToLunar(sy, sm, sd);
    assert.deepEqual(lunar, { year, month, day, isLeapMonth: true });
    assert.equal(resolveEffectiveSolarDate(`${year}-${month}-${day}`, 'lunar', lunar.isLeapMonth).solarDateString, solar);
  }
  assert.equal(convertSolarToLunar(2023, 2, 20).isLeapMonth, false);
});

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

test('known Korean lunar new year dates convert to Gregorian dates', () => {
  const cases = [
    { lunar: '2024-01-01', solar: '2024-02-10' },
    { lunar: '2025-01-01', solar: '2025-01-29' },
    { lunar: '2026-01-01', solar: '2026-02-17' },
  ];
  for (const { lunar, solar } of cases) {
    assert.equal(resolveEffectiveSolarDate(lunar, 'lunar').solarDateString, solar);
  }
});

test('2023 leap second lunar month is distinct from regular second month', () => {
  const regular = resolveEffectiveSolarDate('2023-02-01', 'lunar', false);
  const leap = resolveEffectiveSolarDate('2023-02-01', 'lunar', true);
  assert.equal(leap.solarDateString, '2023-03-22');
  assert.notEqual(regular.solarDateString, leap.solarDateString);
});

test('independent known sexagenary day anchors and midnight rollover', async () => {
  const { calculateDetailedSaju } = await import('../src/lib/sajuAnalysis');
  const calculate = (birthdate: string, birthtime: string) => {
    const profile = { basic: { birthdate, birthtime, lunarSolar: 'solar', gender: 'male', name: 'Test' } } as Parameters<typeof calculateDetailedSaju>[0];
    const result = calculateDetailedSaju(profile);
    assert.ok(result, 'valid input should produce a saju chart');
    return result.pillars.day.full.slice(0, 2);
  };
  assert.equal(calculate('2000-01-01', '12:00'), '戊午');
  assert.equal(calculate('2024-02-10', '12:00'), '甲辰');
  assert.equal(calculate('2000-01-01', '23:29'), '戊午');
  assert.equal(calculate('2000-01-01', '23:30'), '己未');
  assert.equal(calculate('2000-01-02', '00:00'), '己未');
});

test('calculateChronoTransit produces valid pillars, transits, and prompt', async () => {
  const { calculateChronoTransit, formatChronoTransitPrompt } = await import('../src/lib/divination/chronoTransitEngine');
  
  // 2026-11-01 03:00:00 UTC = 2026-11-01 12:00:00 KST
  const testDate = new Date('2026-11-01T03:00:00Z');
  const mockProfile = {
    basic: {
      birthdate: '1994-01-24',
      birthtime: '08:30',
      lunarSolar: 'solar',
      gender: 'male',
      name: '제제',
      birthCity: '서울'
    }
  } as any;

  const result = calculateChronoTransit({ profile: mockProfile, targetDate: testDate });
  assert.ok(result);
  assert.equal(result.engineVersion, 'LUCKEY-CHRONO-TRANSIT-v1.0.0');

  // 동양 만세력 검증
  assert.equal(result.easternPillars.year.gan, '丙');
  assert.equal(result.easternPillars.year.zhi, '午');
  assert.equal(result.easternPillars.month.zhi, '戌');
  assert.ok(result.easternPillars.day.gan);
  assert.ok(result.easternPillars.day.zhi);
  assert.equal(result.easternPillars.hour.zhi, '午'); // 12:00 KST = 낮 오시

  // 서양 트랜짓 검증 (10개 천체)
  assert.equal(result.westernTransits.transits.length, 10);
  assert.ok(result.westernTransits.moonPhase.name);
  assert.ok(result.westernTransits.dailyAstroTheme);

  // 프롬프트 포맷팅 검증
  const prompt = formatChronoTransitPrompt(result);
  assert.ok(prompt.includes('실시간 일진(日辰) & 행성 트랜짓(Transit)'));
  assert.ok(prompt.includes('오늘의 사주 4주 만세력 실측'));
  assert.ok(prompt.includes('하늘의 실시간 행성 트랜짓 실측'));
});

