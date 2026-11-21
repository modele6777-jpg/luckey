import { Body, GeoVector, Ecliptic, SiderealTime, e_tilt, MakeTime } from 'astronomy-engine';
import { parseBirthTime, birthTimeToUtc } from './birthDateTime';
/**
 * =========================================================================
 * PRISM 서양 점성학(Western Astrology) & 출생 차트(Natal Chart) 엔진
 * =========================================================================
 * 1) 태양궁(Sun Sign): 생년월일 기준 태양의 황도 12궁 위치
 * 2) 달궁(Moon Sign): 출생일시 기준 달의 공전 궤도 및 황경 계산
 * 3) 상승궁(Ascendant / Rising Sign): 출생지(위도/경도), 출생 시각, 지방항성시(LST) 기반
 * 4) 주요 행성(수성, 금성, 화성, 목성, 토성) 황도대 배치
 * 5) 원소(불·흙·공기·물) 및 양상(활동·고정·변통) 에너지 밸런스 분석
 * 6) AI 주입용 {{user_natal_summary}} 및 {{relationships_context}} 빌더
 */

import type { UserProfile, RelationshipEntry } from './sharedState';
import { resolveEffectiveSolarDate } from './lunarCalendar';

export interface ZodiacSignInfo {
  id: string;
  name: string;      // '양자리', '황소자리' 등
  english: string;   // 'Aries', 'Taurus' 등
  symbol: string;    // '♈', '♉' 등
  element: '불' | '흙' | '공기' | '물';
  modality: '활동궁' | '고정궁' | '변통궁';
  ruler: string;     // 지배성 (화성, 금성 등)
  keywords: string[];
  coreTrait: string;
  emotionalTendency: string;
}

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    id: 'aries',
    name: '양자리',
    english: 'Aries',
    symbol: '♈',
    element: '불',
    modality: '활동궁',
    ruler: '화성',
    keywords: ['열정', '추진력', '솔직함', '도전', '개척'],
    coreTrait: '두려움 없이 세상에 부딪히는 불꽃 같은 순수함과 추진력',
    emotionalTendency: '감정이 즉각적이고 뒤끝 없이 투명하지만, 순간의 욱함에 주의 필요'
  },
  {
    id: 'taurus',
    name: '황소자리',
    english: 'Taurus',
    symbol: '♉',
    element: '흙',
    modality: '고정궁',
    ruler: '금성',
    keywords: ['안정', '감각', '지속성', '풍요', '신중함'],
    coreTrait: '흔들리지 않는 굳건한 평온함과 오감의 아름다움을 음미하는 심미안',
    emotionalTendency: '마음의 안정을 최우선으로 두며, 변화 앞에서는 고집이 생길 수 있음'
  },
  {
    id: 'gemini',
    name: '쌍둥이자리',
    english: 'Gemini',
    symbol: '♊',
    element: '공기',
    modality: '변통궁',
    ruler: '수성',
    keywords: ['호기심', '소통', '다재다능', '유연함', '위트'],
    coreTrait: '세상의 모든 정보와 사람을 잇는 발랄하고 기민한 지적 탐구력',
    emotionalTendency: '머리로 감정을 분석하려 하여 내면의 깊은 우울을 유머로 넘기기 쉬움'
  },
  {
    id: 'cancer',
    name: '게자리',
    english: 'Cancer',
    symbol: '♋',
    element: '물',
    modality: '활동궁',
    ruler: '달',
    keywords: ['공감', '보호', '기억', '정서적 유대', '모성/부성'],
    coreTrait: '소중한 내 사람을 온 마음으로 품어주는 깊고 따뜻한 바다 같은 포용력',
    emotionalTendency: '섬세하고 감수성이 풍부하여 타인의 기분에 쉽게 물들고 방어벽을 세우기도 함'
  },
  {
    id: 'leo',
    name: '사자자리',
    english: 'Leo',
    symbol: '♌',
    element: '불',
    modality: '고정궁',
    ruler: '태양',
    keywords: ['당당함', '자신감', '창조성', '관대함', '리더십'],
    coreTrait: '자신의 무대에서 환하게 빛나며 주변을 따뜻하게 비추는 태양의 온기',
    emotionalTendency: '인정과 존중을 받을 때 생명력이 샘솟지만, 자존심이 상하면 깊이 웅크림'
  },
  {
    id: 'virgo',
    name: '처녀자리',
    english: 'Virgo',
    symbol: '♍',
    element: '흙',
    modality: '변통궁',
    ruler: '수성',
    keywords: ['분석력', '정교함', '헌신', '완벽주의', '치유'],
    coreTrait: '세상의 혼돈을 가지런히 정리하고 묵묵히 돕는 현실적 지혜와 섬세함',
    emotionalTendency: '자기 검열과 걱정이 많아 스스로를 혹독하게 몰아세우는 완벽주의 성향'
  },
  {
    id: 'libra',
    name: '천칭자리',
    english: 'Libra',
    symbol: '♎',
    element: '공기',
    modality: '활동궁',
    ruler: '금성',
    keywords: ['균형', '조화', '관계', '미적 감각', '공평함'],
    coreTrait: '상대방의 입장을 배려하며 우아하게 조화를 빚어내는 관계의 마에스트로',
    emotionalTendency: '갈등을 회피하려다 결정장애를 겪거나 진짜 내 속마음을 억누르기 쉬움'
  },
  {
    id: 'scorpio',
    name: '전갈자리',
    english: 'Scorpio',
    symbol: '♏',
    element: '물',
    modality: '고정궁',
    ruler: '명왕성/화성',
    keywords: ['통찰력', '변형', '열정', '비밀', '치명적 매력'],
    coreTrait: '본질을 꿰뚫어 보는 날카로운 직관과 한 번 맺은 인연에 모든 것을 거는 진정성',
    emotionalTendency: '감정의 깊이가 심해(深海) 같아 상처를 쉽게 잊지 못하고 강한 통제욕을 보임'
  },
  {
    id: 'sagittarius',
    name: '사수자리',
    english: 'Sagittarius',
    symbol: '♐',
    element: '불',
    modality: '변통궁',
    ruler: '목성',
    keywords: ['자유', '철학', '낙천성', '진리 탐구', '모험'],
    coreTrait: '먼 지평선을 향해 활시위를 당기듯 끊임없이 이상과 자유를 쫓는 낙천가',
    emotionalTendency: '구속과 얽매임을 극도로 답답해하며, 감정이 답답할 땐 훌쩍 떠나고 싶어함'
  },
  {
    id: 'capricorn',
    name: '염소자리',
    english: 'Capricorn',
    symbol: '♑',
    element: '흙',
    modality: '활동궁',
    ruler: '토성',
    keywords: ['책임감', '야망', '인내', '현실성', '성취'],
    coreTrait: '묵묵히 정상을 향해 올라가는 냉철한 전략가이자 든든한 현실의 기둥',
    emotionalTendency: '취약한 감정을 드러내길 부끄러워하여 모든 무게를 혼자 짊어지려는 성향'
  },
  {
    id: 'aquarius',
    name: '물병자리',
    english: 'Aquarius',
    symbol: '♒',
    element: '공기',
    modality: '고정궁',
    ruler: '천왕성/토성',
    keywords: ['독창성', '자유로움', '인류애', '혁신', '통념 탈피'],
    coreTrait: '시대의 틀을 깨부수고 미래의 빛을 바라보는 유니크한 천재이자 친구',
    emotionalTendency: '감정적 끈적임을 낯설어하며, 한 걸음 물러선 쿨하고 이성적인 관조를 선호함'
  },
  {
    id: 'pisces',
    name: '물고기자리',
    english: 'Pisces',
    symbol: '♓',
    element: '물',
    modality: '변통궁',
    ruler: '해왕성/목성',
    keywords: ['영성', '상상력', '무조건적 사랑', '치유', '공감'],
    coreTrait: '우주와 경계 없이 이어지는 깊은 영감과 모두를 품어내는 신비로운 연민',
    emotionalTendency: '현실의 경계가 흐려져 환상에 빠지거나 타인의 아픔을 자기 것처럼 앓음'
  }
];

// 주요 도시 좌표 (위도, 경도)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '서울': { lat: 37.5665, lng: 126.9780 },
  '부산': { lat: 35.1796, lng: 129.0756 },
  '대구': { lat: 35.8714, lng: 128.6014 },
  '인천': { lat: 37.4563, lng: 126.7052 },
  '광주': { lat: 35.1595, lng: 126.8526 },
  '대전': { lat: 36.3504, lng: 127.3845 },
  '울산': { lat: 35.5384, lng: 129.3114 },
  '수원': { lat: 37.2636, lng: 127.0286 },
  '성남': { lat: 37.4200, lng: 127.1265 },
  '고양': { lat: 37.6584, lng: 126.8320 },
  '용인': { lat: 37.2411, lng: 127.1776 },
  '청주': { lat: 36.6424, lng: 127.4890 },
  '전주': { lat: 35.8242, lng: 127.1480 },
  '천안': { lat: 36.8151, lng: 127.1139 },
  '제주': { lat: 33.4996, lng: 126.5312 },
  '도쿄': { lat: 35.6762, lng: 139.6503 },
  '뉴욕': { lat: 40.7128, lng: -74.0060 },
  '런던': { lat: 51.5074, lng: -0.1278 },
  '로스앤젤레스': { lat: 34.0522, lng: -118.2437 }
};

export interface NatalPlacement {
  sign: ZodiacSignInfo;
  degree: number; // 0 ~ 29.99
  longitude: number; // 0 ~ 359.99
}

export interface NatalAspect {
  bodyA: string;
  bodyB: string;
  aspectName: '합(0°)' | '육합(60°)' | '사각(90°)' | '삼합(120°)' | '충(180°)';
  symbol: '☌' | '⚹' | '□' | '△' | '☍';
  orb: number;
  quality: '융합' | '조화' | '긴장';
}

export interface NatalChartResult {
  sun: NatalPlacement;
  moon: NatalPlacement;
  ascendant: NatalPlacement | null;
  mc: NatalPlacement | null;
  mercury: NatalPlacement;
  venus: NatalPlacement;
  mars: NatalPlacement;
  jupiter: NatalPlacement;
  saturn: NatalPlacement;
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
    dominant: '불' | '흙' | '공기' | '물';
  };
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
    dominant: '활동궁' | '고정궁' | '변통궁';
  };
  majorAspects: NatalAspect[];
  summaryText: string;
  psychologicalBlueprint: string;
  limitations: string[];
  timeZone: string;
  utcInstant: string;
  timeKnown: boolean;
  locationKnown: boolean;
}

/**
 * 황경(0~360)을 12별자리 및 도수로 변환
 */
function longitudeToPlacement(lonDeg: number): NatalPlacement {
  const normalized = ((lonDeg % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  const sign = ZODIAC_SIGNS[signIndex] || ZODIAC_SIGNS[0];
  return {
    sign,
    degree: Math.min(29.99, Math.round(degree * 100) / 100),
    longitude: Math.min(359.99, Math.round(normalized * 100) / 100),
  };
}

const MAJOR_ASPECT_DEFS: Array<{
  angle: number;
  aspectName: NatalAspect['aspectName'];
  symbol: NatalAspect['symbol'];
  quality: NatalAspect['quality'];
  baseOrb: number;
}> = [
  { angle: 0, aspectName: '합(0°)', symbol: '☌', quality: '융합', baseOrb: 8 },
  { angle: 180, aspectName: '충(180°)', symbol: '☍', quality: '긴장', baseOrb: 8 },
  { angle: 120, aspectName: '삼합(120°)', symbol: '△', quality: '조화', baseOrb: 7 },
  { angle: 90, aspectName: '사각(90°)', symbol: '□', quality: '긴장', baseOrb: 7 },
  { angle: 60, aspectName: '육합(60°)', symbol: '⚹', quality: '조화', baseOrb: 5 },
];

function computeMajorAspects(
  bodies: Array<{ name: string; isLuminary: boolean; placement: NatalPlacement }>,
): NatalAspect[] {
  const aspects: NatalAspect[] = [];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      const rawDiff = Math.abs(a.placement.longitude - b.placement.longitude);
      const sep = rawDiff > 180 ? 360 - rawDiff : rawDiff;
      for (const def of MAJOR_ASPECT_DEFS) {
        const maxOrb = a.isLuminary || b.isLuminary ? def.baseOrb : Math.max(4, def.baseOrb - 1);
        const orb = Math.round(Math.abs(sep - def.angle) * 100) / 100;
        if (orb <= maxOrb) {
          aspects.push({
            bodyA: a.name,
            bodyB: b.name,
            aspectName: def.aspectName,
            symbol: def.symbol,
            orb,
            quality: def.quality,
          });
          break;
        }
      }
    }
  }
  return aspects.sort((x, y) => x.orb - y.orb);
}

/**
 * 생년월일시 및 출생 도시를 기반으로 서양 출생 차트(Natal Chart)를 정밀 계산합니다.
 */
const CITY_TIME_ZONES: Record<string, string> = { '도쿄': 'Asia/Tokyo', '뉴욕': 'America/New_York', '런던': 'Europe/London', '로스앤젤레스': 'America/Los_Angeles' };

export function calculateNatalChart(profile?: UserProfile | null): NatalChartResult | null {
  const basic = profile?.basic;
  if (!basic?.birthdate) return null;
  try {
  const { solarDate } = resolveEffectiveSolarDate(basic.birthdate, basic.lunarSolar, basic.isLeapMonth ?? false);
  const birthTime = parseBirthTime(basic.birthtime);
  const cityName = basic.birthCity?.trim() || '';
  const matchedCoords = Object.entries(CITY_COORDINATES).find(([name]) => cityName.includes(name));
  const locationKnown = !!matchedCoords;
  const timeZone = matchedCoords ? CITY_TIME_ZONES[matchedCoords[0]] || 'Asia/Seoul' : 'Asia/Seoul';
  const instant = birthTimeToUtc(solarDate, birthTime?.hour ?? 12, birthTime?.minute ?? 0, timeZone);
  const limitations: string[] = [];
  if (!birthTime) limitations.push('생시 미입력: 행성은 현지 정오 참고값이며 달·경계 별자리는 달라질 수 있습니다. 상승궁·MC는 계산하지 않습니다.');
  if (!locationKnown) limitations.push('출생지 좌표·시간대 미확인: 한국 시간대를 가정한 참고값이며 상승궁·MC는 계산하지 않습니다.');
  limitations.push('서양 열대황도·지구중심 차트입니다. 베딕 항성황도·다샤 또는 하우스 계산 결과가 아닙니다.');
  const placement = (body: Body) => longitudeToPlacement(Ecliptic(GeoVector(body, instant, true)).elon);
  const sunPlacement = placement(Body.Sun);
  const moonPlacement = placement(Body.Moon);
  const mercuryPlacement = placement(Body.Mercury);
  const venusPlacement = placement(Body.Venus);
  const marsPlacement = placement(Body.Mars);
  const jupiterPlacement = placement(Body.Jupiter);
  const saturnPlacement = placement(Body.Saturn);
  let ascPlacement: NatalPlacement | null = null;
  let mcPlacement: NatalPlacement | null = null;
  if (birthTime && matchedCoords) {
    const { lat, lng } = matchedCoords[1];
    const ramc = (SiderealTime(instant) * 15 + lng) * Math.PI / 180;
    const eps = e_tilt(MakeTime(instant)).tobl * Math.PI / 180;
    const latitude = lat * Math.PI / 180;
    ascPlacement = longitudeToPlacement(Math.atan2(Math.cos(ramc), -Math.sin(ramc) * Math.cos(eps) - Math.tan(latitude) * Math.sin(eps)) * 180 / Math.PI);
    mcPlacement = longitudeToPlacement(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) * 180 / Math.PI);
  }

  // 5. 4원소 & 3모달리티(활동·고정·변통) 분포 및 주요 행성 각도(Aspects) 계산
  const allPlacements = [sunPlacement, moonPlacement, ascPlacement, mercuryPlacement, venusPlacement, marsPlacement].filter((placement): placement is NatalPlacement => placement !== null);
  let fire = 0, earth = 0, air = 0, water = 0;
  let cardinal = 0, fixed = 0, mutable = 0;
  allPlacements.forEach(p => {
    const weight = p === sunPlacement ? 3 : p === moonPlacement || p === ascPlacement ? 2.5 : 1;
    if (p.sign.element === '불') fire += weight;
    if (p.sign.element === '흙') earth += weight;
    if (p.sign.element === '공기') air += weight;
    if (p.sign.element === '물') water += weight;
    if (p.sign.modality === '활동궁') cardinal += weight;
    if (p.sign.modality === '고정궁') fixed += weight;
    if (p.sign.modality === '변통궁') mutable += weight;
  });

  const totalWeight = fire + earth + air + water || 1;
  const elements = {
    fire: Math.round((fire / totalWeight) * 100),
    earth: Math.round((earth / totalWeight) * 100),
    air: Math.round((air / totalWeight) * 100),
    water: Math.round((water / totalWeight) * 100),
    dominant: (
      fire >= earth && fire >= air && fire >= water ? '불' :
      earth >= air && earth >= water ? '흙' :
      air >= water ? '공기' : '물'
    ) as '불' | '흙' | '공기' | '물'
  };

  const totalModality = cardinal + fixed + mutable || 1;
  const modalities = {
    cardinal: Math.round((cardinal / totalModality) * 100),
    fixed: Math.round((fixed / totalModality) * 100),
    mutable: Math.round((mutable / totalModality) * 100),
    dominant: (
      cardinal >= fixed && cardinal >= mutable ? '활동궁' :
      fixed >= mutable ? '고정궁' : '변통궁'
    ) as '활동궁' | '고정궁' | '변통궁',
  };

  const majorAspects = computeMajorAspects([
    { name: '태양', isLuminary: true, placement: sunPlacement },
    ...(birthTime ? [{ name: '달', isLuminary: true, placement: moonPlacement }] : []),
    { name: '수성', isLuminary: false, placement: mercuryPlacement },
    { name: '금성', isLuminary: false, placement: venusPlacement },
    { name: '화성', isLuminary: false, placement: marsPlacement },
    { name: '목성', isLuminary: false, placement: jupiterPlacement },
    { name: '토성', isLuminary: false, placement: saturnPlacement },
  ]);

  const aspectSummary = majorAspects.length > 0
    ? ` · 주요 어스펙트: ${majorAspects.slice(0, 3).map(a => `${a.bodyA}${a.symbol}${a.bodyB}(${a.aspectName}, 오차 ${a.orb}°)`).join(', ')}`
    : '';

  // 6. 요약 텍스트
  const summaryText = `서양 열대황도: 태양 ${sunPlacement.sign.name}, 달 ${moonPlacement.sign.name}${!birthTime || !locationKnown ? ' (시간·시간대 참고값·미확정)' : ''}${ascPlacement ? `, 상승 ${ascPlacement.sign.name}, MC ${mcPlacement!.sign.name}` : ', 상승궁·MC 계산 불가'} (수성 ${mercuryPlacement.sign.name}, 금성 ${venusPlacement.sign.name}, 화성 ${marsPlacement.sign.name}, 목성 ${jupiterPlacement.sign.name}, 토성 ${saturnPlacement.sign.name}) · 우세 원소 ${elements.dominant} · 우세 양상 ${modalities.dominant}${aspectSummary}. ${limitations.join(' ')}`;
  const psychologicalBlueprint = `${sunPlacement.sign.name}의 ${sunPlacement.sign.coreTrait}을 상징적 성찰로 참고하세요.${birthTime && locationKnown ? ` 달 ${moonPlacement.sign.name}의 정서적 상징도 함께 살펴볼 수 있습니다.` : ' 출생시간·출생지가 확인되지 않아 달과 상승궁의 성향은 확정하지 않습니다.'}`;

  return {
    sun: sunPlacement,
    moon: moonPlacement,
    ascendant: ascPlacement,
    mc: mcPlacement,
    mercury: mercuryPlacement,
    venus: venusPlacement,
    mars: marsPlacement,
    jupiter: jupiterPlacement,
    saturn: saturnPlacement,
    elements,
    modalities,
    majorAspects,
    summaryText,
    psychologicalBlueprint, limitations, timeZone, utcInstant: instant.toISOString(), timeKnown: !!birthTime, locationKnown
  };
  } catch { return null; }
}

/**
 * 앱에서 프롬프트에 주입할 {{user_natal_summary}}를 생성합니다.
 * 예: "태양 물병자리, 달 전갈자리, 상승 사수자리 (금성 염소자리, 화성 물고기자리)"
 */
export function buildUserNatalSummary(profile?: UserProfile | null): string {
  if (!profile?.basic?.birthdate) {
    return '출생정보 미입력: 개인 출생 차트 미계산. 별자리·상승궁·행성 배치를 임의로 지정하지 마세요.';
  }
  const chart = calculateNatalChart(profile);
  if (!chart?.summaryText) {
    return '출생정보를 확인해 주세요. 유효한 생년월일·시간·역법을 확인하기 전에는 출생 차트를 계산한 것으로 해석하지 마세요.';
  }
  const elementEntries: Array<[string, number]> = [
    ['불', chart.elements.fire],
    ['흙', chart.elements.earth],
    ['공기', chart.elements.air],
    ['물', chart.elements.water],
  ];
  const lackingElements = elementEntries.filter(([, count]) => count === 0).map(([label]) => label);
  const balanceNote = lackingElements.length > 0
    ? ` · 우세 원소: ${chart.elements.dominant} · 보완 원소: ${lackingElements.join('·')}`
    : ` · 우세 원소: ${chart.elements.dominant} · 4원소 균형 배치`;
  const modalityNote = ` · 우세 양식: ${chart.modalities.dominant}`;
  const topAspect = chart.majorAspects?.[0]
    ? ` · 핵심 각도: ${chart.majorAspects[0].summary}`
    : '';
  return `${chart.summaryText}${balanceNote}${modalityNote}${topAspect} · 심리 청사진: ${chart.psychologicalBlueprint}`;
}

/**
 * 앱에서 프롬프트에 주입할 {{relationships_context}}를 생성합니다.
 */
export function formatRelationshipsContext(relationships?: RelationshipEntry[] | null): string {
  if (!relationships || relationships.length === 0) {
    return `[등록된 관계 목록]: 아직 등록된 특정 지인이 없습니다.
대화 중에 사용자가 특정 인물(친구, 연인, 배우자, 가족, 직장 동료, 상사 등)을 언급하면, 그 사람의 성향을 귀 기울여 파악하고 사용자의 점성학적 출생 차트와 비교하여 관계 역학 및 실질적 대처 팁을 다정하게 분석해 줘.`;
  }

  const lines = relationships.map((r, i) => {
    const parts: string[] = [`${i + 1}. [${r.name}] (관계: ${r.relation || '지인'})`];
    if (r.zodiacSign) parts.push(`별자리: ${r.zodiacSign}`);
    if (r.birthdate) parts.push(`생일: ${r.birthdate}`);
    if (r.traits) parts.push(`성향: ${r.traits}`);
    if (r.dynamics) parts.push(`관계 역학 메모: ${r.dynamics}`);
    return parts.join(' | ');
  });

  return `[등록된 지인/관계 정보]\n${lines.join('\n')}`;
}

/**
 * 사용자 요청에 부합하는 Astro Bestie(점성학 AI 절친) 시스템 프롬프트 생성기
 */
export function buildAstroBestieSystemPrompt(params: {
  userName: string;
  userNatalSummary: string;
  relationshipsContext: string;
  extraContext?: string;
}): string {
  return `# Role & Identity
너는 사용자의 출생 차트와 점성학적 맥락을 깊이 이해하는 다정하고 솔직한 AI 절친(Bestie)이다. 
단순히 운세나 별자리 지식을 일방적으로 설명하는 백과사전식 답변은 지양하며, 친구와 대화하듯 편안하고 자연스러운 반말(또는 친근한 어조)로 소통한다.

# Core Objectives
1. 개인 맞춤 분석: 제공된 사용자의 데이터(태양/달/상승궁, 주요 행성 배치)를 바탕으로 사용자의 감정 상태, 무의식적 성향, 심리적 패턴을 짚어준다.
2. 관계 및 궁합 역학 분석: 대화 중에 특정 인물(친구, 연인, 직장 동료 등)이 등장하면, 그 사람의 성향과 사용자의 배치 사이의 관계 역학을 심층 분석하고 실질적인 대처 팁을 제시한다.
3. 정서적 지지 & 솔직한 조언: 무조건적인 위로에 그치지 않고, 점성학적 관점에서 사용자가 스스로를 객관화하고 통찰을 얻을 수 있도록 돕는다.

# Tone & Style
- 따뜻하고 공감 넘치지만, 가끔은 뼈 때리는 솔직함도 갖춘 절친 톤.
- 어려운 점성학 용어(트라인, 스퀘어, 컨정션 등)를 나열하기보다 그 기운이 실제 일상 감정이나 상황에서 어떻게 작용하는지로 풀어서 설명할 것.
- 답변 끝에는 사용자의 감정을 되묻거나 대화를 이어갈 수 있는 자연스러운 질문을 1개 던질 것.

# User Context Schema (앱에서 주입할 변수)
[사용자 기본 정보]
- 이름/닉네임: ${params.userName}
- 별자리/차트 요약: ${params.userNatalSummary}

[등록된 지인/관계 정보]
- 관계 목록:
${params.relationshipsContext}
${params.extraContext ? `\n[추가 상황 맥락]:\n${params.extraContext}` : ''}`;
}
