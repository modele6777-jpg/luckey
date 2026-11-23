import test from 'node:test';
import assert from 'node:assert/strict';
import { FIFTEEN_DIVINATION_TOOLS, selectOptimalDivinationTools } from '../src/lib/fifteenDivinationTools';
import { DIVINATION_CAPABILITIES } from '../src/lib/divinationCapabilities';
import { calculateNatalChart, buildUserNatalSummary, ZODIAC_SIGNS } from '../src/lib/astrologyAnalysis';
import { parseBirthTime, birthTimeToUtc } from '../src/lib/birthDateTime';
import { resolveEffectiveSolarDate } from '../src/lib/lunarCalendar';
import { calculateDetailedSaju, generateDailySajuReport, generateSajuMasterConsultation } from '../src/lib/sajuAnalysis';
import { getYearSolarTerms } from '../src/lib/astronomicalSolarTerms';
import { TAROT_DECK, TAROT_REVERSED_DATA, getTarotReversedData, getEffectiveTarotKeywords } from '../src/data/tarotData';
import { shuffleCardDeck } from '../src/lib/cardShuffle';
const profile = (birthdate: string, birthtime?: string, birthCity = '서울') => ({ basic: { birthdate, birthtime, birthCity, gender: 'male' as const } });
const longitude = (placement: NonNullable<ReturnType<typeof calculateNatalChart>>['sun']) => ZODIAC_SIGNS.indexOf(placement.sign) * 30 + placement.degree;

for (const tool of Object.values(FIFTEEN_DIVINATION_TOOLS)) {
  test(`${tool.id}: explicit name is recognized and its actual calculation scope is declared`, () => {
    const result = selectOptimalDivinationTools(tool.koName, [], profile('1990-05-17'), false, { allowMaster: false });
    assert.equal(result.selectedTools[0].id, tool.id);
    assert(result.promptInjection.includes(DIVINATION_CAPABILITIES[tool.id].scope));
    assert(result.selectedTools.length <= 3);
  });
}
test('qualified astrology names and English aliases do not accidentally select Western astrology', () => {
  for (const name of ['숙요 점성술', '베딕 점성술', '태국 점성술', '미얀마 점성술', 'Vedic astrology', 'Thai astrology']) {
    const result = selectOptimalDivinationTools(name, [], undefined, false, { allowMaster: false });
    assert(!result.selectedTools.some(tool => tool.id === 'astrology'), name);
  }
  assert.equal(selectOptimalDivinationTools('서양 점성술과 베딕', [], undefined, false, { allowMaster: false }).selectedTools.length, 2);
});
test('civil times validate ranges and respect New York DST, Tokyo and historical Korean offsets', () => {
  for (const time of ['24:00','12:60','-1:00','12:','noon']) assert.throws(() => parseBirthTime(time), RangeError);
  assert.equal(parseBirthTime(''), null);
  assert.equal(calculateNatalChart(profile('2024-07-01','12:00','뉴욕'))!.utcInstant, '2024-07-01T16:00:00.000Z');
  assert.equal(calculateNatalChart(profile('2024-01-01','12:00','뉴욕'))!.utcInstant, '2024-01-01T17:00:00.000Z');
  assert.equal(calculateNatalChart(profile('2024-01-01','12:00','도쿄'))!.utcInstant, '2024-01-01T03:00:00.000Z');
  assert.equal(calculateNatalChart(profile('2024-03-10','02:30','뉴욕')), null);
  assert.equal(calculateNatalChart(profile('2024-11-03','01:30','뉴욕')), null);
  assert.equal(birthTimeToUtc({year:1960,month:1,day:1},12,0,'Asia/Seoul').toISOString(), '1960-01-01T03:30:00.000Z');
});
test('missing birth time/location cannot produce a fabricated ascendant or MC', () => {
  for (const p of [profile('1990-05-17'), profile('1990-05-17','12:00','알 수 없는 도시')]) {
    const chart = calculateNatalChart(p)!;
    assert.equal(chart.ascendant, null); assert.equal(chart.mc, null);
    assert(chart.limitations.length > 0); assert.match(chart.summaryText, /계산 불가/);
  }
});
test('solar/lunar longitudes match independent Meeus reference examples within stated tolerances', () => {
  // Astronomical Algorithms, examples 25.b (Sun) and 47.a (Moon).
  const sun = calculateNatalChart(profile('1992-10-13','09:00'))!;
  const moon = calculateNatalChart(profile('1992-04-12','09:00'))!;
  assert(Math.abs(longitude(sun.sun)-199.90895) < 0.03);
  assert(Math.abs(longitude(moon.moon)-133.162655) < 0.04);
  const j2000 = calculateNatalChart(profile('2000-01-01','21:00'))!;
  assert(Math.abs(longitude(j2000.jupiter)-25.25) < 1);
  assert(Math.abs(longitude(j2000.saturn)-40.4) < 1);
  for (const key of ['sun','moon','mercury','venus','mars','jupiter','saturn','ascendant','mc'] as const) {
    assert(j2000[key]); assert(j2000[key]!.degree >= 0 && j2000[key]!.degree < 30);
  }
});
test('saju does not assign female Daewun to an unspecified gender; annual field follows current term year', () => {
  const saju = calculateDetailedSaju({basic:{birthdate:'1990-05-17'}})!;
  assert.equal(saju.gender, '미입력'); assert.equal(saju.daewunDetail.timeline.length, 0);
  assert.match(saju.daeun.current, /미확정/);
  assert(!saju.systemPromptSummary.includes('대운수 0'));
  assert.match(generateSajuMasterConsultation(saju,'2099년 운세'), /별도 계산/);
  assert.throws(() => generateDailySajuReport(saju,new Date('invalid')), RangeError);
});
test('tarot has 78 unique cards, 78 reversed meanings, stable orientation and non-mutating shuffle', () => {
  assert.equal(TAROT_DECK.length, 78); assert.equal(new Set(TAROT_DECK.map(card=>card.id)).size,78);
  assert.equal(Object.keys(TAROT_REVERSED_DATA).length,78);
  const original = TAROT_DECK.map(card=>card.id);
  assert.deepEqual(new Set(shuffleCardDeck(TAROT_DECK).map(card=>card.id)),new Set(original));
  assert.deepEqual(TAROT_DECK.map(card=>card.id),original);
  for (const card of TAROT_DECK) {
    const meaning = getTarotReversedData(card);
    assert(meaning.meaning && meaning.advice && meaning.caution);
    assert(!JSON.stringify(meaning).includes('�'));
    assert.deepEqual(getEffectiveTarotKeywords({...card,reversed:true}),meaning.keywords);
  }
});

test('annual flow updates beyond 2026 and Korean daily reports do not depend on browser timezone', () => {
  const original = Date.now;
  try {
    Date.now = () => Date.UTC(2028,6,1);
    const next = calculateDetailedSaju(profile('1990-05-17','12:00'))!;
    assert.match(next.annual2026.yearName,/2028 무신/);
    assert.match(next.annual2026.elementFlow,/토 기운/);
    Date.now = () => Date.UTC(2027,0,10);
    assert.match(calculateDetailedSaju(profile('1990-05-17','12:00'))!.annual2026.yearName,/2026 병오/);
    assert.match(generateDailySajuReport(next,new Date('2026-10-28T16:00:00Z')).dateStr,/2026년 10월 29일/);
  } finally { Date.now = original; }
});
