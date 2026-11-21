import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Body, GeoVector, Ecliptic, SiderealTime, MakeTime, e_tilt } from 'astronomy-engine';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis';
import { hexagram } from '../src/lib/divination/iching';
import { calculateNatalChart } from '../src/lib/astrologyAnalysis';
import { calculateKyusei } from '../src/lib/divination/kyuseiEngine';
import { calculateThaiHorasat } from '../src/lib/divination/thaiHorasatEngine';
import { calculateVedicAdvanced } from '../src/lib/divination/vedicEngine';
import { calculateZiwei } from '../src/lib/divination/birthCharts';
import { calculateQimen } from '../src/lib/divination/eventCharts';
import { calculateTaiyi } from '../src/lib/divination/taiyiEngine';
import { TAROT_DECK, TAROT_REVERSED_DATA } from '../src/data/tarotData';

/**
 * 15대 도구 정확도 회귀 검사 (2026-11-21 감사).
 * 엔진과 별개로 천문 계산(astronomy-engine)·표준 산식·표준표로 기준값을 만들어 대조한다.
 */
const STEMS = '갑을병정무기경신임계', BR = '자축인묘진사오미신유술해';
const sunLon = (d: Date) => (Ecliptic(GeoVector(Body.Sun, d, true)).elon % 360 + 360) % 360;
const jdn = (y: number, m: number, d: number) => { const a = Math.floor((14 - m) / 12), yy = y + 4800 - a, mm = m + 12 * a - 3; return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045; };
const clean = (x: string) => String(x || '').replace(/\s|\(.*\)/g, '').replace(/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g, ch => ({ 甲: '갑', 乙: '을', 丙: '병', 丁: '정', 戊: '무', 己: '기', 庚: '경', 辛: '신', 壬: '임', 癸: '계', 子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사', 午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해' } as Record<string, string>)[ch]);
const dates = (start: number, n: number, stepDays: number) => Array.from({ length: n }, (_, i) => new Date(start + i * stepDays * 86400000));

test('사주 4주: 입춘·절기(태양 황경)·율리우스일·오호둔/오서둔 기준과 일치', () => {
  for (const [i, d] of dates(Date.UTC(1940, 0, 1), 120, 239.3).entries()) {
    const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate(), hh = 1 + (i * 7) % 21;
    const lon = sunLon(new Date(Date.UTC(y, m - 1, day, hh - 9, 30)));
    const yr = (m === 1 || (m === 2 && lon < 315)) ? y - 1 : y;
    const yIdx = ((yr - 4) % 60 + 60) % 60, monthIdx = Math.floor(((lon - 315 + 360) % 360) / 30);
    const mStem = ((yIdx % 10 % 5) * 2 + 2 + monthIdx) % 10, dIdx = (jdn(y, m, day) + 49) % 60, hBranch = Math.floor(((hh + 1) % 24) / 2);
    const ds = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const P: any = calculateDetailedSaju({ basic: { birthdate: ds, birthtime: `${String(hh).padStart(2, '0')}:30`, gender: 'female', lunarSolar: 'solar' } } as any)!.pillars;
    assert.equal(clean(P.year.full), STEMS[yIdx % 10] + BR[yIdx % 12], `${ds} 년주`);
    assert.equal(clean(P.month.full), STEMS[mStem] + BR[(monthIdx + 2) % 12], `${ds} 월주`);
    assert.equal(clean(P.day.full), STEMS[dIdx % 10] + BR[dIdx % 12], `${ds} 일주`);
    assert.equal(clean(P.hour.full), STEMS[((dIdx % 10 % 5) * 2 + hBranch) % 10] + BR[hBranch], `${ds} ${hh}:30 시주`);
  }
});

test('주역 64괘 번호가 문왕 표준표(하괘×상괘)와 일치', () => {
  const ORDER = ['111', '110', '101', '100', '011', '010', '001', '000'];
  const KW = [[1, 43, 14, 34, 9, 5, 26, 11], [10, 58, 38, 54, 61, 60, 41, 19], [13, 49, 30, 55, 37, 63, 22, 36], [25, 17, 21, 51, 42, 3, 27, 24], [44, 28, 50, 32, 57, 48, 18, 46], [6, 47, 64, 40, 59, 29, 4, 7], [33, 31, 56, 62, 53, 39, 52, 15], [12, 45, 35, 16, 20, 8, 23, 2]];
  for (let lo = 0; lo < 8; lo++) for (let up = 0; up < 8; up++) assert.equal(hexagram([...ORDER[lo], ...ORDER[up]].map(Number)).number, KW[lo][up]);
});

test('서양 점성술 행성 7개·상승궁이 천문 계산과 1° 안에서 일치', () => {
  const bodies: Array<[string, Body]> = [['sun', Body.Sun], ['moon', Body.Moon], ['mercury', Body.Mercury], ['venus', Body.Venus], ['mars', Body.Mars], ['jupiter', Body.Jupiter], ['saturn', Body.Saturn]];
  for (const d of dates(Date.UTC(1950, 0, 1), 20, 913)) {
    const n: any = calculateNatalChart({ basic: { birthdate: d.toISOString().slice(0, 10), birthtime: '14:30', birthCity: '서울', gender: 'female', lunarSolar: 'solar' } } as any);
    const inst = new Date(n.utcInstant);
    for (const [k, b] of bodies) {
      const ref = (Ecliptic(GeoVector(b, inst, true)).elon % 360 + 360) % 360;
      assert.ok(Math.abs(((n[k].longitude - ref + 540) % 360) - 180) < 1, `${k}`);
    }
    const t = MakeTime(inst), lst = ((SiderealTime(t) * 15 + 126.978) % 360) * Math.PI / 180, eps = e_tilt(t).tobl * Math.PI / 180, phi = 37.5665 * Math.PI / 180;
    const asc = (Math.atan2(Math.cos(lst), -(Math.sin(lst) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) * 180 / Math.PI + 360) % 360;
    assert.ok(Math.abs(((n.ascendant.longitude - asc + 540) % 360) - 180) < 1, 'ASC');
  }
});

test('베딕 달 나크샤트라·라시가 열대 황경 − 라히리 아야남샤와 일치', () => {
  for (const d of dates(Date.UTC(1955, 0, 1), 15, 1150)) {
    const p: any = { basic: { birthdate: d.toISOString().slice(0, 10), birthtime: '14:30', birthCity: '서울', gender: 'female', lunarSolar: 'solar' } };
    const inst = new Date(calculateNatalChart(p)!.utcInstant);
    const v: any = calculateVedicAdvanced({ profile: p, targetDate: new Date('2026-11-21T03:00:00Z') } as any);
    const aya = 23.853055556 + (inst.getTime() - Date.parse('2000-01-01T12:00:00Z')) / 86400000 / 365.25 * 50.29 / 3600;
    const moon = ((Ecliptic(GeoVector(Body.Moon, inst, true)).elon - aya) % 360 + 360) % 360;
    assert.equal(v.nakshatra.index, Math.floor(moon / (360 / 27)));
    assert.equal(v.rashi.chandra.index, Math.floor(moon / 30));
  }
});

test('자미두수 명궁·신궁이 인궁 기점 (생월 순행 − 생시 역행) 규칙과 일치 (윤달은 15일 이후 익월)', () => {
  for (const [i, d] of dates(Date.UTC(1962, 0, 1), 40, 311).entries()) {
    const hh = 1 + (i * 5) % 21;
    const z: any = calculateZiwei({ basic: { birthdate: d.toISOString().slice(0, 10), birthtime: `${String(hh).padStart(2, '0')}:10`, gender: 'female', lunarSolar: 'solar' } } as any);
    const leap = /윤(\d+)월 (\d+)일/.exec(z.lunarDate);
    const month = leap ? Number(leap[1]) + (Number(leap[2]) > 15 ? 1 : 0) : Number(/(\d+)월/.exec(z.lunarDate)![1]);
    const hb = Math.floor(((hh + 1) % 24) / 2);
    assert.equal(z.soulPalace, BR[(2 + month - 1 - hb + 24) % 12], `${d.toISOString().slice(0, 10)} 명궁`);
    assert.equal(z.bodyPalace, BR[(2 + month - 1 + hb) % 12], `${d.toISOString().slice(0, 10)} 신궁`);
  }
});

test('기문둔갑 음양둔이 동지~하지(양둔)·하지~동지(음둔)와 일치', () => {
  for (const inst of dates(Date.UTC(2020, 0, 1, 5), 60, 12.1)) {
    const lon = sunLon(inst);
    if (Math.min(Math.abs(lon - 270), Math.abs(lon - 90)) < 2) continue;
    assert.equal(calculateQimen(inst).chart['陰陽'], lon >= 270 || lon < 90 ? '陽' : '陰');
  }
});

test('구성학 본명성이 입춘 기준 11 − 연도 자릿수합 규칙과 일치', () => {
  for (const d of dates(Date.UTC(1930, 0, 1), 60, 577)) {
    const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1;
    const yy = (m === 1 || (m === 2 && sunLon(new Date(Date.UTC(y, m - 1, d.getUTCDate(), 3))) < 315)) ? y - 1 : y;
    let sum = yy; while (sum > 9) sum = String(sum).split('').reduce((a, c) => a + Number(c), 0);
    let star = 11 - sum; while (star > 9) star -= 9;
    const r: any = calculateKyusei({ profile: { basic: { birthdate: d.toISOString().slice(0, 10) } } as any, targetDate: new Date('2026-11-21T03:00:00Z') } as any);
    assert.equal(r.honmyosei.star, star, d.toISOString().slice(0, 10));
  }
});

test('태국 요일 수호신: 요일 그대로, 수요일 18시~06시는 라후', () => {
  const WD = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  for (const [i, d] of dates(Date.UTC(1960, 0, 1), 50, 37).entries()) {
    const hh = (i * 5) % 24;
    const r: any = calculateThaiHorasat({ profile: { basic: { birthdate: d.toISOString().slice(0, 10), birthtime: `${String(hh).padStart(2, '0')}:00` } } as any } as any);
    const exp = WD[d.getUTCDay()] === 'mercury' && (hh >= 18 || hh < 6) ? 'rahu' : WD[d.getUTCDay()];
    assert.equal(r.birthDayPlanet.id, exp);
  }
});

test('태을신수 2026년: 적년 주기 72국 중 55국, 태을은 간(3)궁', () => {
  const r: any = calculateTaiyi({ targetYear: 2026, profile: { basic: { birthdate: '1990-05-17' } } as any });
  // 太乙 積年 10153917 + 서기 → 2026년 10155943 → 72로 나눈 나머지 55
  assert.equal((10153917 + 2026) % 72, 55);
  assert.equal(r.calculation.juNumber, 55);
  assert.equal(r.calculation.taiyiPalaceName, '간');
});

test('타로 78장: 메이저 22장, 이름·역방향 해석이 모두 있음', () => {
  assert.equal(TAROT_DECK.length, 78);
  assert.equal(new Set(TAROT_DECK.map(c => c.id)).size, 78);
  assert.equal(TAROT_DECK.filter(c => /major/i.test(String(c.type))).length, 22);
  for (const c of TAROT_DECK) assert.ok(TAROT_REVERSED_DATA[c.id] || TAROT_REVERSED_DATA[c.nameKo], c.id);
});
