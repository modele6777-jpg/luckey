import assert from 'node:assert/strict';
import test from 'node:test';
import { SOLAR_TERMS_INFO, getAstronomicalMonthBranch, getYearSolarTerms } from '../src/lib/astronomicalSolarTerms';
import { calculateDetailedSaju, describeElementLead, describeSajuTimePolicy } from '../src/lib/sajuAnalysis';
import { sajuChartFromInput } from '../server/api-lib/sajuChartApi';
import { inspectSajuProfile } from '../src/lib/sajuInput';
import { processMCPJsonRpc } from '../server/api-lib/mcpHandler';
import { setReadingApiFetchForTests } from '../server/api-lib/readingApiClient';

const STEMS = '甲乙丙丁戊己庚辛壬癸';
const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';

function chart(birthdate: string, birthtime?: string, lunar = false, leap = false) {
  return calculateDetailedSaju({
    basic: { birthdate, birthtime, lunarSolar: lunar ? 'lunar' : 'solar', isLeapMonth: leap },
  })!;
}

function ganzi(value: string) {
  return value.slice(0, 2);
}

test('solar 2000-01-01 12:00 keeps Earth day master when Fire and Earth counts tie', () => {
  const app = chart('2000-01-01', '12:00');
  const api = sajuChartFromInput({ year: 2000, month: 1, day: 1, birthtime: '12:00' });
  assert.equal(ganzi(app.pillars.year.full), '己卯');
  assert.equal(ganzi(app.pillars.month.full), '丙子');
  assert.equal(ganzi(app.pillars.day.full), '戊午');
  assert.equal(ganzi(app.pillars.hour!.full), '戊午');
  assert.equal(app.dayMaster.element, '토');
  assert.equal(app.dayMaster.hanja, '戊土');
  assert.deepEqual(app.elements.counts, { 목: 1, 화: 3, 토: 3, 금: 0, 수: 1 });
  assert.deepEqual(app.elements.leaders, ['화', '토']);
  assert.match(app.elements.summary, /戊土/);
  assert.match(app.elements.summary, /토\(흙/);
  assert.match(app.elements.summary, /화\(불/);
  assert.doesNotMatch(app.elements.summary, /중심 기운인 화/);
  assert.equal(api.interpretation, app.elements.summary);
  assert.equal(api.dayMasterElement, '토');
  assert.equal(api.timePolicy.summary, app.timePolicy.summary);
  assert.match(api.timePolicy.summary, /30분/);
  assert.match(api.timePolicy.summary, /진태양시나 출생지 경도 보정이 아닙니다/);
  assert.equal(api.timePolicy.hourBranchClock, '11:30');
  assert.equal(api.timePolicy.dayRolled, false);
});

test('tied leaders of other day-master elements are not hardcoded to Earth', () => {
  const metal = describeElementLead({ 목: 0, 화: 3, 토: 0, 금: 3, 수: 0 }, { hanja: '庚金', korean: '경금', element: '금' });
  assert.match(metal.summary, /庚金/);
  assert.match(metal.summary, /금\(쇠/);
  assert.match(metal.summary, /화\(불/);
  assert.doesNotMatch(metal.summary, /중심 기운인 화/);
  const water = describeElementLead({ 목: 0, 화: 0, 토: 2, 금: 0, 수: 2 }, { hanja: '壬水', korean: '임수', element: '수' });
  assert.match(water.summary, /壬水/);
  assert.doesNotMatch(water.summary, /중심 기운인 토/);
  const uniqueFire = describeElementLead({ 목: 0, 화: 4, 토: 1, 금: 0, 수: 0 }, { hanja: '戊土', korean: '무토', element: '토' });
  assert.match(uniqueFire.summary, /戊土/);
  assert.match(uniqueFire.summary, /화\(불\/열정\) 4/);
  assert.doesNotMatch(uniqueFire.summary, /중심 기운인 화/);
  const uniqueWater = describeElementLead({ 목: 0, 화: 0, 토: 1, 금: 0, 수: 5 }, { hanja: '戊土', korean: '무토', element: '토' });
  assert.match(uniqueWater.summary, /토\(흙/);
  assert.match(uniqueWater.summary, /수\(/);
  assert.doesNotMatch(uniqueWater.summary, /중심 기운인 수/);
  const woodLead = describeElementLead({ 목: 4, 화: 0, 토: 1, 금: 0, 수: 0 }, { hanja: '庚金', korean: '경금', element: '금' });
  assert.match(woodLead.summary, /庚金/);
  assert.doesNotMatch(woodLead.summary, /중심 기운인 목/);
});

test('documented clock policy, not a change that forces 23:00 into 子', () => {
  const cases = [
    ['2000-01-01', '22:59', '戊午', '癸亥', false, '22:29'],
    ['2000-01-01', '23:00', '戊午', '癸亥', false, '22:30'],
    ['2000-01-01', '23:30', '己未', '甲子', true, '23:00'],
    ['2000-01-02', '00:00', '己未', '甲子', false, '23:30'],
  ] as const;
  for (const [date, time, day, hour, rolled, adjusted] of cases) {
    const result = chart(date, time);
    assert.equal(ganzi(result.pillars.day.full), day, time);
    assert.equal(ganzi(result.pillars.hour!.full), hour, time);
    assert.equal(result.timePolicy.dayRolled, rolled, time);
    assert.equal(result.timePolicy.hourBranchClock, adjusted, time);
  }
  const missing = chart('2000-01-01');
  assert.equal(missing.pillars.hour, null);
  assert.match(missing.timePolicy.summary, /시주를 만들지 않습니다/);
  assert.match(missing.timePolicy.summary, /정오 12:00/);
  assert.match(describeSajuTimePolicy(null).summary, /절입 당일/);
});

test('lunar conversions and invalid calendar or clock values stay explicit', () => {
  assert.equal(sajuChartFromInput({ year: 1999, month: 11, day: 25, isLunar: true }).solarEquivalentDate, '2000-01-01');
  assert.equal(sajuChartFromInput({ year: 2020, month: 4, day: 1, isLunar: true }).solarEquivalentDate, '2020-04-23');
  assert.equal(sajuChartFromInput({ year: 2020, month: 4, day: 1, isLunar: true, isLeapMonth: true }).solarEquivalentDate, '2020-05-23');
  assert.throws(() => sajuChartFromInput({ year: 2026, month: 2, day: 30 }), /2026-02-30은 양력에 없는 날짜/);
  assert.throws(() => sajuChartFromInput({ year: 2000, month: 13, day: 1 }), /월 13은 1~12가 아닙니다/);
  assert.throws(() => sajuChartFromInput({ year: 2000, month: 1, day: 1, birthtime: '25:99' }), /시 25는 0~23이 아닙니다, 분 99는 0~59가 아닙니다/);
  const badTime = inspectSajuProfile({ basic: { birthdate: '2000-01-01', birthtime: 'abc' } });
  assert.equal(badTime?.code, 'invalid_time_format');
  assert.match(badTime?.message || '', /HH:MM/);
  assert.doesNotMatch(badTime?.message || '', /양력에 없는 날짜/);
  try { sajuChartFromInput({ year: 2000, month: 1, day: 1, birthtime: 'abc' }); } catch (error) {
    assert.equal((error as { code?: string }).code, 'invalid_time_format');
    assert.equal((error as Error).message, badTime?.message);
  }
  assert.throws(() => sajuChartFromInput({ year: 2021, month: 4, day: 1, isLunar: true, isLeapMonth: true }), /윤달이 아니거나/);
});

test('sexagenary day advances from the 2000-01-01 anchor without reimplementing the Julian formula', () => {
  // These few rows lock the current default. They do not certify every historical date.
  const anchor = chart('2000-01-01', '12:00');
  const anchorIndex = STEMS.indexOf(anchor.pillars.day.gan) + BRANCHES.indexOf(anchor.pillars.day.zhi) * 0;
  assert.equal(anchor.pillars.day.gan + anchor.pillars.day.zhi, '戊午');
  const startStem = STEMS.indexOf('戊');
  const startBranch = BRANCHES.indexOf('午');
  for (let offset = 0; offset < 60; offset += 1) {
    const date = new Date(Date.UTC(2000, 0, 1 + offset));
    const birthdate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    const day = chart(birthdate, '12:00').pillars.day;
    assert.equal(day.gan, STEMS[(startStem + offset) % 10], birthdate);
    assert.equal(day.zhi, BRANCHES[(startBranch + offset) % 12], birthdate);
  }
  assert.equal(anchorIndex >= 0, true);
  assert.equal(chart('2000-03-01', '12:00').pillars.day.gan + chart('2000-03-01', '12:00').pillars.day.zhi, '戊午');
});

test('saju year follows the standard sexagenary count at and before 입춘', () => {
  const sexagenaryYear = (year: number) => {
    const index = ((year - 4) % 60 + 60) % 60;
    return STEMS[index % 10] + BRANCHES[index % 12];
  };
  assert.equal(sexagenaryYear(1984), '甲子');
  const ipchun = getYearSolarTerms(1984).find((term) => term.name === '입춘');
  assert.ok(ipchun);
  const at = ipchun.date;
  const displayedMinute = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate(), at.getUTCHours(), at.getUTCMinutes()));
  const onOrAfter = at.getTime() === displayedMinute.getTime() ? displayedMinute : new Date(displayedMinute.getTime() + 60 * 1000);
  const before = new Date(onOrAfter.getTime() - 60 * 1000);
  const wall = (date: Date) => chart(
    `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`,
    `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`,
  );
  assert.equal(ganzi(wall(before).pillars.year.full), sexagenaryYear(1983));
  assert.equal(ganzi(wall(onOrAfter).pillars.year.full), sexagenaryYear(1984));
  assert.match(describeSajuTimePolicy({ hour: 12, minute: 0 }).summary, /같은 시:분으로 입력해도 아직 이전 절기/);
  const major = SOLAR_TERMS_INFO.filter((term) => term.isMajorTerm);
  assert.deepEqual(major.map((term) => [term.name, term.monthBranchIndex]), [
    ['청명', 2], ['입하', 3], ['망종', 4], ['소서', 5], ['입추', 6], ['백로', 7],
    ['한로', 8], ['입동', 9], ['대설', 10], ['소한', 11], ['입춘', 0], ['경칩', 1],
  ]);
  const sample = getYearSolarTerms(2000).find((term) => term.name === '망종');
  assert.ok(sample);
  assert.equal(getAstronomicalMonthBranch(sample.date).monthBranchIndex, 4);
});

test('MCP saju tool returns the same chart and policy as the app calculator', async () => {
  const api = sajuChartFromInput({ year: 2000, month: 1, day: 1, birthtime: '12:00' });
  let called = '';
  process.env.LUCKEY_API_ORIGIN = 'https://readings.example';
  setReadingApiFetchForTests(async (url, init) => {
    called = String(url);
    assert.equal(JSON.parse(String(init?.body)).birthtime, '12:00');
    assert.equal(new Headers(init?.headers).get('authorization'), null);
    return new Response(JSON.stringify(api), { status: 200 });
  });
  try {
    const response = await processMCPJsonRpc({
      jsonrpc: '2.0', id: 1, method: 'tools/call',
      params: { name: 'get_saju_fortune', arguments: { year: 2000, month: 1, day: 1, birthtime: '12:00' } },
    }, { authorized: true });
    const body = JSON.parse(response.result.content[0].text);
    assert.equal(called, 'https://readings.example/api/saju/chart');
    assert.equal(body.interpretation, api.interpretation);
    assert.equal(body.dayMasterElement, '토');
    assert.equal(body.elementBalance.화, 3);
    assert.equal(body.elementBalance.토, 3);
    assert.match(body.timePolicy.summary, /23:30/);
  } finally {
    setReadingApiFetchForTests(null);
  }
});
