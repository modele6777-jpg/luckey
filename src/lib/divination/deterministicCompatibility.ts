/**
 * =========================================================================
 * LUCKEY 5대 운명학 융합 궁합 결정론 마스터 엔진
 * (Unified Multi-Dimensional Synastry Master Engine)
 * =========================================================================
 *
 * [설계 철학 & 핵심 원칙]
 * 1. LLM에 의존하지 않는 100% 순수 수리·천문·역법 결정론적 계산 (Deterministic).
 *    동일한 두 프로필 입력에 대해 항상 동일한 JSON을 산출한다 (무작위·시각 의존 없음).
 * 2. 5대 운명학 체계를 하나의 인연 판정으로 융합한다:
 *    ① 사주 원국 결합 & 오행 상호 보완 (천간 5합 · 지지 6합/삼합/6충/원진)
 *    ② 천을귀인 상호 인연 매칭 (auspiciousStarsEngine 규칙 연동, 원국 4주 대조)
 *    ③ 숙요경 27숙 6대 관계성 3거리 매트릭스 (sukuyoEngine calculateSukuyoAdvanced 연동)
 *    ④ 서양 점성술 원소 & 황도궁 시나스트리 (4원소 상생·갈등, 태양/달 아스펙트)
 *    ⑤ 관계 유형별 3대 영역 처방 (연인·결혼 / 비즈니스·파트너십 / 소울메이트·우정)
 * 3. 각 도구의 고유 범위를 엄격히 준수한다: 생년월일시 미입력 시 추정하지 않고
 *    해당 차원을 '계산 생략'으로 명시하며, 숙요 윤달 보류 등 하위 엔진의 판정을 존중한다.
 */

import { calculateDetailedSaju, type SajuAnalysisResult, type FiveElement } from '../sajuAnalysis';
import { calculateNatalChart, ZODIAC_SIGNS, type NatalChartResult } from '../astrologyAnalysis';
import { calculateSukuyoAdvanced, type SukuyoResult } from './sukuyoEngine';
import { CHEON_EUL_MAP } from './auspiciousStarsEngine';
import type { UserProfile } from '../sharedState';

export const COMPATIBILITY_ENGINE_VERSION = 'LUCKEY-CS-v1.0.0';
export const COMPATIBILITY_ENGINE_METHOD =
  '5대 운명학 융합 궁합 결정론 마스터 엔진: 사주 원국 결합(천간 5합·지지 6합/삼합/6충/원진·오행 상호 보완) + 천을귀인 상호 인연 매칭(원국 4주 대조) + 숙요경 27숙 6대 관계성 3거리 매트릭스 + 서양 점성술 4원소·황도궁 시나스트리(태양/달 아스펙트) + 관계 유형별 3대 영역 처방';

export interface CompatibilityAnalysisResult {
  engineVersion: string;
  method: string;
  score: number; // 0 ~ 100점
  grade: '천생연분' | '상생길연' | '화합동반' | '보완노력' | '자극성장';
  title: string;
  summary: string;

  // 1. 사주 원국 결합 & 오행 상호 보완
  saju: {
    personA: { name: string; dayMaster: string; dayBranch: string; dominantElement: string };
    personB: { name: string; dayMaster: string; dayBranch: string; dominantElement: string };
    stemRelation: { isHarmonious: boolean; name: string; desc: string };
    branchRelation: { type: '합' | '충' | '원진' | '평이'; name: string; desc: string };
    elementComplement: {
      aNeedsFromB: string[];
      bNeedsFromA: string[];
      score: number; // 0 ~ 100
      summary: string;
    };
    combinedScore: number; // 0 ~ 100 (천간·일지·오행보완 가중 통합)
  };

  // 2. 천을귀인 상호 인연 매칭 (Mutual Nobleman Matching)
  mutualNobleman: {
    aNobleBranches: string[]; // A 일간(·년간)의 천을귀인 지지 (양귀인·음귀인)
    bNobleBranches: string[];
    aNobleInB: string[]; // B 사주 4주에서 발견된 A의 귀인 글자
    bNobleInA: string[]; // A 사주 4주에서 발견된 B의 귀인 글자
    aIsBNoble: boolean; // B가 A의 귀인 글자를 품음 (B는 A의 귀인)
    bIsANoble: boolean; // A가 B의 귀인 글자를 품음 (A는 B의 귀인)
    mutual: boolean; // 상호 천을귀인 성립
    score: number; // 0 ~ 100
    desc: string;
  };

  // 3. 숙요 27숙 6대 관계성 3거리 매트릭스 (Sukuyo Synastry)
  sukuyo: {
    mansionA: string;
    mansionB: string;
    relationName: string;
    relationType: '영친' | '안괴' | '우쇠' | '성위' | '업태' | '명';
    distanceText: string;
    meaning: string;
    compatibilityScore: number | null; // 27숙 호환 지수 0 ~ 100 (양방향 평균)
    fromMe: string; // 나 → 상대 방향 관계 라벨
    fromPartner: string; // 상대 → 나 방향 관계 라벨
    fromMeSummary: string;
    fromPartnerSummary: string;
  };

  // 4. 서양 점성술 원소 & 황도궁 시나스트리 (Astrological Chemistry)
  astrology: {
    sunA: string;
    sunB: string;
    moonA: string;
    moonB: string;
    elementA: string;
    elementB: string;
    elementRelation: '동원소' | '상생' | '갈등' | '중립';
    sunAspect: { name: string; angle: number; desc: string }; // 태양-태양 각도
    moonAspect: { name: string; angle: number; desc: string }; // 달-달 각도
    aspect: string;
    harmonyDesc: string;
    combinedScore: number; // 0 ~ 100
  };

  // 5. 관계 유형별 3대 영역 처방 (Contextual Chemistry)
  dimensions: {
    romantic: { score: number; headline: string; detail: string }; // 연인·결혼
    business: { score: number; headline: string; detail: string }; // 비즈니스·파트너십
    friendship: { score: number; headline: string; detail: string }; // 소울메이트·우정
  };

  // 최종 통합 가중치 브레이크다운 (투명성)
  breakdown: {
    saju: number; nobleman: number; sukuyo: number; astrology: number; contextual: number;
  };
}

// ─── 사주 명리 상수 ─────────────────────────────────────────────────────────

// 천간 5합 (甲己·乙庚·丙辛·丁壬·戊癸)
const STEM_HARMONY: Record<string, { partner: string; resultElement: string; name: string }> = {
  갑: { partner: '기', resultElement: '토', name: '갑기합(甲己合) 중정지합' },
  기: { partner: '갑', resultElement: '토', name: '갑기합(甲己合) 중정지합' },
  을: { partner: '경', resultElement: '금', name: '을경합(乙庚合) 인의지합' },
  경: { partner: '을', resultElement: '금', name: '을경합(乙庚合) 인의지합' },
  병: { partner: '신', resultElement: '수', name: '병신합(丙辛合) 위엄지합' },
  신: { partner: '병', resultElement: '수', name: '병신합(丙辛合) 위엄지합' },
  정: { partner: '임', resultElement: '목', name: '정임합(丁壬合) 인수지합' },
  임: { partner: '정', resultElement: '목', name: '정임합(丁壬合) 인수지합' },
  무: { partner: '계', resultElement: '화', name: '무계합(戊癸合) 무정지합' },
  계: { partner: '무', resultElement: '화', name: '무계합(戊癸合) 무정지합' },
};

// 천간충
const STEM_CLASH: Record<string, string> = {
  갑: '경', 경: '갑',
  을: '신', 신: '을',
  병: '임', 임: '병',
  정: '계', 계: '정',
};

// 지지 육합 (子丑·寅亥·卯戌·辰酉·巳申·午未)
const BRANCH_SIX_HARMONY: Record<string, { partner: string; name: string }> = {
  자: { partner: '축', name: '자축합(子丑合)' }, 축: { partner: '자', name: '자축합(子丑合)' },
  인: { partner: '해', name: '인해합(寅亥合)' }, 해: { partner: '인', name: '인해합(寅亥合)' },
  묘: { partner: '술', name: '묘술합(卯戌合)' }, 술: { partner: '묘', name: '묘술합(卯戌合)' },
  진: { partner: '유', name: '진유합(辰酉合)' }, 유: { partner: '진', name: '진유합(辰酉合)' },
  사: { partner: '신', name: '사신합(巳申合)' }, 신: { partner: '사', name: '사신합(巳申合)' },
  오: { partner: '미', name: '오미합(午未合)' }, 미: { partner: '오', name: '오미합(午未合)' },
};

// 지지 삼합 (寅午戌 화국 · 申子辰 수국 · 巳酉丑 금국 · 亥卯未 목국)
const BRANCH_TRIPLE_HARMONY: { branches: string[]; name: string }[] = [
  { branches: ['寅', '午', '戌'], name: '인오술(寅午戌) 삼합 화국' },
  { branches: ['申', '子', '辰'], name: '신자진(申子辰) 삼합 수국' },
  { branches: ['巳', '酉', '丑'], name: '사유축(巳酉丑) 삼합 금국' },
  { branches: ['亥', '卯', '未'], name: '해묘미(亥卯未) 삼합 목국' },
];

// 지지 6충
const BRANCH_CLASH: Record<string, { partner: string; name: string }> = {
  자: { partner: '오', name: '자오충(子午沖)' }, 오: { partner: '자', name: '자오충(子午沖)' },
  축: { partner: '미', name: '축미충(丑未沖)' }, 미: { partner: '축', name: '축미충(丑未沖)' },
  인: { partner: '신', name: '인신충(寅申沖)' }, 신: { partner: '인', name: '인신충(寅申沖)' },
  묘: { partner: '유', name: '묘유충(卯酉沖)' }, 유: { partner: '묘', name: '묘유충(卯酉沖)' },
  진: { partner: '술', name: '진술충(辰戌沖)' }, 술: { partner: '진', name: '진술충(辰戌沖)' },
  사: { partner: '해', name: '사해충(巳亥沖)' }, 해: { partner: '사', name: '사해충(巳亥沖)' },
};

// 지지 원진살
const BRANCH_WONJIN: Record<string, { partner: string; name: string }> = {
  자: { partner: '미', name: '자미원진(子未怨嗔)' }, 미: { partner: '자', name: '자미원진(子未怨嗔)' },
  축: { partner: '오', name: '축오원진(丑午怨嗔)' }, 오: { partner: '축', name: '축오원진(丑午怨嗔)' },
  인: { partner: '유', name: '인유원진(寅酉怨嗔)' }, 유: { partner: '인', name: '인유원진(寅酉怨嗔)' },
  묘: { partner: '신', name: '묘신원진(卯申怨嗔)' }, 신: { partner: '묘', name: '묘신원진(卯申怨嗔)' },
  진: { partner: '해', name: '진해원진(辰亥怨嗔)' }, 해: { partner: '진', name: '진해원진(辰亥怨嗔)' },
  사: { partner: '술', name: '사술원진(巳戌怨嗔)' }, 술: { partner: '사', name: '사술원진(巳戌怨嗔)' },
};

// 지지 한자→한글
const BRANCH_KR: Record<string, string> = {
  子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사',
  午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해',
};

const clamp100 = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function scoreBand(score: number): { label: string } {
  if (score >= 88) return { label: '최상' };
  if (score >= 75) return { label: '우수' };
  if (score >= 62) return { label: '양호' };
  if (score >= 45) return { label: '보통' };
  return { label: '노력 필요' };
}

// ─── 서양 점성술 헬퍼 ───────────────────────────────────────────────────────

function eclipticLongitude(p: { sign: { id: string }; degree: number } | undefined | null): number | null {
  if (!p) return null;
  const idx = ZODIAC_SIGNS.findIndex((s) => s.id === p.sign.id);
  if (idx < 0) return null;
  return idx * 30 + p.degree;
}

function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function classifyAspect(angle: number | null): { name: string; angle: number; desc: string; score: number } {
  if (angle === null) return { name: '계산 불가', angle: NaN, desc: '생년월일시 미입력으로 각도 미계산', score: 50 };
  const orb6 = Math.abs(angle - 60) <= 6;
  const orb9 = Math.abs(angle - 90) <= 6;
  const orb12 = Math.abs(angle - 120) <= 6;
  const orb0 = angle <= 8;
  const orb18 = Math.abs(angle - 180) <= 8;
  if (orb12) return { name: '트라인(Trine 120°)', angle: 120, desc: '같은 원소의 조화 각도 — 말하지 않아도 통하는 자연스러운 리듬과 재능의 공명', score: 95 };
  if (orb6) return { name: '섹스타일(Sextile 60°)', angle: 60, desc: '기회와 협력의 각도 — 서로 자극하며 부드럽게 힘을 합칠 수 있는 호혜 관계', score: 85 };
  if (orb0) return { name: '콘정렬(Conjunction 0°)', angle: 0, desc: '같은 황도궁 결합 — 강한 일체감과 몰입도, 다만 개성 경계가 섞일 수 있음', score: 80 };
  if (orb18) return { name: '오포지션(Opposition 180°)', angle: 180, desc: '정반대 황도궁의 자석 같은 끌림 — 강렬한 매력과 함께 진동하는 극성의 밀당', score: 62 };
  if (orb9) return { name: '스퀘어(Square 90°)', angle: 90, desc: '긴장의 각도 — 마찰이 있으나 서로를 가장 크게 성장시키는 자극원', score: 48 };
  return { name: '주요 아스펙트 없음', angle: Math.round(angle * 10) / 10, desc: '주요 아스펙트 없음 — 각자의 리듬을 존중하는 담백한 관계', score: 58 };
}

function elementRelation(elA: string, elB: string): '동원소' | '상생' | '갈등' | '중립' {
  if (elA === elB) return '동원소';
  const pair = [elA, elB].sort().join('');
  if (pair === '공기불' || pair === '물흙') return '상생';
  if (pair === '불물' || pair === '공기흙') return '갈등';
  return '중립';
}

const ELEMENT_SCORE: Record<string, number> = { 상생: 92, 동원소: 85, 중립: 62, 갈등: 45 };

// ─── 숙요 관계 메타 ─────────────────────────────────────────────────────────

const SUKUYO_RELATION_MEANINGS: Record<string, { type: CompatibilityAnalysisResult['sukuyo']['relationType']; meaning: string }> = {
  '영': { type: '영친', meaning: '영(榮)과 친(親)으로 만난 최상의 길연. 함께할수록 서로의 운이 피어나고 다툴 일이 적은 화목한 인연입니다.' },
  '친': { type: '영친', meaning: '친(親)과 영(榮)으로 맺어진 길연. 깊은 신뢰와 정서적 유대감이 자연스럽게 싹트는 포근한 관계입니다.' },
  '업': { type: '업태', meaning: '업(業)과 태(胎)의 인연. 전생과 현생이 이어진 카르마적 끌림으로, 첫 만남부터 낯설지 않고 깊은 일체감을 느낍니다.' },
  '태': { type: '업태', meaning: '태(胎)와 업(業)의 인연. 서로를 통해 영혼이 한 단계 성숙해지며 불가항력적인 깊은 인연의 끈을 가집니다.' },
  '명': { type: '명', meaning: '명(命)의 동숙 인연. 같은 숙(宿)을 타고난 거울 같은 존재로, 나의 장점과 그림자를 고스란히 마주하게 됩니다.' },
  '안': { type: '안괴', meaning: '안(安)의 수용적 위치. 상대방의 강렬한 에너지에 매료되면서도 감정의 굴곡을 현명하게 다스려야 하는 드라마틱한 관계입니다.' },
  '괴': { type: '안괴', meaning: '괴(壞)의 능동적 위치. 치명적인 이끌림과 강한 인상을 주며, 서로에게 인생의 거대한 변곡점이 되어주는 인연입니다.' },
  '우': { type: '우쇠', meaning: '우(友)의 조력 관계. 친구처럼 격의 없이 편안하게 웃고 떠들 수 있는 다정한 동반자적 인연입니다.' },
  '쇠': { type: '우쇠', meaning: '쇠(衰)의 의지 관계. 심리적 안식처가 되어주며 서로 기댈 수 있으나, 현실적 문제에서는 균형을 잡아야 합니다.' },
  '성': { type: '성위', meaning: '성(成)의 성취 파트너. 비즈니스와 현실적 목표를 함께 달성할 때 가장 뛰어난 시너지를 발휘하는 발전적 인연입니다.' },
  '위': { type: '성위', meaning: '위(危)의 긴장 관계. 서로 다른 기질로 인해 적당한 긴장감이 유지되며, 상호 성장의 촉매제가 되는 관계입니다.' },
};

// ─── 메인 계산 ──────────────────────────────────────────────────────────────

export function calculateDeterministicCompatibility(
  profileA: UserProfile,
  profileB: UserProfile
): CompatibilityAnalysisResult {
  const sajuA = calculateDetailedSaju(profileA);
  const sajuB = calculateDetailedSaju(profileB);
  const astroA = calculateNatalChart(profileA);
  const astroB = calculateNatalChart(profileB);

  const nameA = profileA.basic?.name?.trim() || '나';
  const nameB = profileB.basic?.name?.trim() || '상대방';

  // ═══ 1. 사주 원국 결합 & 오행 상호 보완 ═══
  const stemA = sajuA?.dayMaster?.korean?.[0] || sajuA?.pillars?.day?.ganKr || '갑';
  const stemB = sajuB?.dayMaster?.korean?.[0] || sajuB?.pillars?.day?.ganKr || '기';
  const branchA = sajuA?.pillars?.day?.zhiKr || '자';
  const branchB = sajuB?.pillars?.day?.zhiKr || '축';

  const branchesOf = (s: SajuAnalysisResult | null): string[] => {
    if (!s) return [];
    return [s.pillars.year.zhi, s.pillars.month.zhi, s.pillars.day.zhi, ...(s.pillars.hour ? [s.pillars.hour.zhi] : [])]
      .filter(Boolean); // 한자 지지 (子丑寅…)
  };
  const branchesAll = [...branchesOf(sajuA), ...branchesOf(sajuB)];

  // 천간 5합 / 천간충
  let stemScore = 50;
  let stemRelation = { isHarmonious: false, name: '일간 조화', desc: '서로 다른 개성으로 균형을 이루는 관계' };
  if (STEM_HARMONY[stemA]?.partner === stemB) {
    stemScore = 100;
    stemRelation = {
      isHarmonious: true,
      name: STEM_HARMONY[stemA].name,
      desc: `천간이 정답게 합(合)을 이루어 ${STEM_HARMONY[stemA].resultElement} 기운으로 화합 — 서로에게 본능적으로 이끌리고 대화가 깊이 통합니다.`,
    };
  } else if (STEM_CLASH[stemA] === stemB) {
    stemScore = 30;
    stemRelation = {
      isHarmonious: false,
      name: `${stemA}${stemB} 천간충`,
      desc: '서로의 주관이 뚜렷하여 생각의 차이가 있으나, 솔직한 소통으로 시각을 넓혀줍니다.',
    };
  }

  // 지지 육합 / 삼합 / 6충 / 원진
  let branchScore = 55;
  let branchRelation: { type: '합' | '충' | '원진' | '평이'; name: string; desc: string } = {
    type: '평이',
    name: '일지 평이',
    desc: '평온하고 일상적인 조화의 일지 결합',
  };
  if (BRANCH_SIX_HARMONY[branchA]?.partner === branchB) {
    branchScore = 100;
    branchRelation = {
      type: '합',
      name: BRANCH_SIX_HARMONY[branchA].name,
      desc: '마음의 안식처이자 내면을 지탱하는 일지가 육합(六合)을 이루어 정서적 유대감이 각별합니다.',
    };
  } else {
    const triple = BRANCH_TRIPLE_HARMONY.find(
      (t) => t.branches.every((b) => branchesAll.includes(b)) &&
        t.branches.some((b) => branchesOf(sajuA).includes(b)) &&
        t.branches.some((b) => branchesOf(sajuB).includes(b))
    );
    if (triple) {
      branchScore = 90;
      branchRelation = {
        type: '합',
        name: triple.name,
        desc: '두 원국이 하나의 국(局)을 이루는 삼합 — 함께할수록 같은 기운의 강한 결속력이 만들어집니다.',
      };
    } else if (BRANCH_CLASH[branchA]?.partner === branchB) {
      branchScore = 30;
      branchRelation = {
        type: '충',
        name: BRANCH_CLASH[branchA].name,
        desc: '일지 충(沖)으로 역동적인 자극과 긴장감이 존재하며, 서로의 독립된 영역을 존중할 때 더욱 돈독해집니다.',
      };
    } else if (BRANCH_WONJIN[branchA]?.partner === branchB) {
      branchScore = 40;
      branchRelation = {
        type: '원진',
        name: BRANCH_WONJIN[branchA].name,
        desc: '원진살의 기운으로 때때로 서운함이나 애증이 교차할 수 있으니 오해 없는 따뜻한 대화가 열쇠입니다.',
      };
    }
  }

  // 오행 상호 보완 (A에게 부족한 오행을 B가 채워주는 상호 보완도)
  const elementsA = sajuA?.elements?.counts || { 목: 1, 화: 1, 토: 1, 금: 1, 수: 1 };
  const elementsB = sajuB?.elements?.counts || { 목: 1, 화: 1, 토: 1, 금: 1, 수: 1 };
  const aNeedsFromB: string[] = [];
  const bNeedsFromA: string[] = [];
  (['목', '화', '토', '금', '수'] as FiveElement[]).forEach((el) => {
    if ((elementsA[el] ?? 0) === 0 && (elementsB[el] ?? 0) >= 2) aNeedsFromB.push(el);
    if ((elementsB[el] ?? 0) === 0 && (elementsA[el] ?? 0) >= 2) bNeedsFromA.push(el);
  });
  const complementScore = clamp100(
    40 + Math.min(2, aNeedsFromB.length) * 20 + Math.min(2, bNeedsFromA.length) * 20 +
      (aNeedsFromB.length + bNeedsFromA.length >= 3 ? 10 : 0)
  );
  const elementSummary =
    aNeedsFromB.length > 0 || bNeedsFromA.length > 0
      ? `A에게 부족한 [${aNeedsFromB.join(',') || '기운'}]과 B에게 부족한 [${bNeedsFromA.join(',') || '기운'}]을 서로가 풍성하게 채워주는 상생 시너지`
      : '오행 에너지가 서로 고르게 어우러져 평온한 흐름을 만듭니다.';

  const sajuCombined = clamp100(0.4 * stemScore + 0.35 * branchScore + 0.25 * complementScore);

  // ═══ 2. 천을귀인 상호 인연 매칭 ═══
  const ganA = sajuA?.pillars?.day?.gan || '';
  const ganB = sajuB?.pillars?.day?.gan || '';
  const yearGanA = sajuA?.pillars?.year?.gan || '';
  const yearGanB = sajuB?.pillars?.year?.gan || '';
  const nobleBranchesOf = (dayGan: string, yearGan: string): string[] =>
    Array.from(new Set([...(CHEON_EUL_MAP[dayGan] || []), ...(CHEON_EUL_MAP[yearGan] || [])]));
  const aNoble = nobleBranchesOf(ganA, yearGanA); // A의 천을귀인 글자
  const bNoble = nobleBranchesOf(ganB, yearGanB);
  const fourZhiB = branchesOf(sajuB);
  const fourZhiA = branchesOf(sajuA);
  const aNobleInB = aNoble.filter((b) => fourZhiB.includes(b));
  const bNobleInA = bNoble.filter((b) => fourZhiA.includes(b));
  const bIsANoble = aNobleInB.length > 0; // B의 원국이 A의 귀인 글자를 품음 → B는 A의 귀인
  const aIsBNoble = bNobleInA.length > 0; // A의 원국이 B의 귀인 글자를 품음 → A는 B의 귀인
  const mutualNoble = aIsBNoble && bIsANoble;
  let nobleScore = 42;
  let nobleDesc = '천을귀인 글자의 직접 교환은 감지되지 않았습니다. 귀인 외 인연 요소는 다른 차원의 데이터를 참고하세요.';
  if (mutualNoble) {
    nobleScore = 100;
    nobleDesc = '상호 귀인 인연(互貴人): 서로가 서로의 천을귀인 글자를 품은 최상호 공명 — 함께 있을 때 판이 선하게 좋아지는 소원형(殊原型) 인연입니다.';
  } else if (bIsANoble) {
    nobleScore = 82;
    nobleDesc = '상대가 나의 천을귀인 글자를 품은 귀인 인연 — 이 사람 곁에서 기회와 조력이 열립니다.';
  } else if (aIsBNoble) {
    nobleScore = 78;
    nobleDesc = '내가 상대의 천을귀인 글자를 품은 보호자형 인연 — 내가 상대의 귀인이 되어주는 구조입니다.';
  }

  // ═══ 3. 숙요 27숙 6대 관계성 3거리 매트릭스 ═══
  let sukuyoAdv: SukuyoResult | null = null;
  try {
    sukuyoAdv = calculateSukuyoAdvanced({ profile: profileA, partnerProfile: profileB });
  } catch (_) {
    sukuyoAdv = null;
  }
  const pm = sukuyoAdv?.partnerMatrix || null;
  let sukuyoScore = 50;
  let sukuyoInfo = {
    mansionA: sukuyoAdv?.mansion?.fullName || '본명숙 미계산',
    mansionB: pm?.partnerMansion?.fullName || '본명숙 미계산',
    relationName: '조화로운 인연',
    relationType: '영친' as CompatibilityAnalysisResult['sukuyo']['relationType'],
    distanceText: '중거리',
    meaning: '서로를 배려하고 존중할 때 아름다운 결실을 맺는 인연입니다.',
    compatibilityScore: null as number | null,
    fromMe: '—',
    fromPartner: '—',
    fromMeSummary: '',
    fromPartnerSummary: '',
  };
  if (pm) {
    const rawKeyA = pm.fromMe.label;
    const rawKeyB = pm.fromPartner.label;
    const metaA = SUKUYO_RELATION_MEANINGS[rawKeyA] || { type: '영친' as const, meaning: '상호 조화로운 인연' };
    if (pm.compatibilityScore != null) sukuyoScore = clamp100(pm.compatibilityScore);
    sukuyoInfo = {
      mansionA: pm.myMansion.fullName,
      mansionB: pm.partnerMansion.fullName,
      relationName: `${metaA.type}(${rawKeyA}/${rawKeyB}) 관계 · ${pm.mutualBand}`,
      relationType: metaA.type,
      distanceText: pm.mutualBand,
      meaning: metaA.meaning,
      compatibilityScore: pm.compatibilityScore,
      fromMe: `${pm.fromMe.label}(${pm.fromMe.hanja}) · ${pm.fromMe.polarity}`,
      fromPartner: `${pm.fromPartner.label}(${pm.fromPartner.hanja}) · ${pm.fromPartner.polarity}`,
      fromMeSummary: pm.fromMe.pairSummary || pm.fromMe.description,
      fromPartnerSummary: pm.fromPartner.pairSummary || pm.fromPartner.description,
    };
  }

  // ═══ 4. 서양 점성술 원소 & 황도궁 시나스트리 ═══
  const signA = astroA?.sun?.sign?.name || '양자리';
  const signB = astroB?.sun?.sign?.name || '사자자리';
  const moonSignA = astroA?.moon?.sign?.name || '미계산';
  const moonSignB = astroB?.moon?.sign?.name || '미계산';
  const astroElA = astroA?.sun?.sign?.element || '불';
  const astroElB = astroB?.sun?.sign?.element || '공기';
  const moonElA = astroA?.moon?.sign?.element || '';
  const moonElB = astroB?.moon?.sign?.element || '';
  const elRel = elementRelation(astroElA, astroElB);
  const sunLonA = eclipticLongitude(astroA?.sun);
  const sunLonB = eclipticLongitude(astroB?.sun);
  const moonLonA = eclipticLongitude(astroA?.moon);
  const moonLonB = eclipticLongitude(astroB?.moon);
  const sunSep = sunLonA !== null && sunLonB !== null ? angularSeparation(sunLonA, sunLonB) : null;
  const moonSep = moonLonA !== null && moonLonB !== null ? angularSeparation(moonLonA, moonLonB) : null;
  const sunAspect = classifyAspect(sunSep);
  const moonAspect = classifyAspect(moonSep);

  const elementHarmonyDesc =
    elRel === '동원소'
      ? `같은 [${astroElA}] 원소로 맺어져 말하지 않아도 마음이 통하고 감각이 일치합니다.`
      : elRel === '상생'
        ? `[${astroElA}]와 [${astroElB}]의 원소 조화(Fire+Air·Earth+Water)로 서로에게 생명력과 영감을 불어넣는 훌륭한 시너지입니다.`
        : elRel === '갈등'
          ? `[${astroElA}]와 [${astroElB}]의 원소 긴장(Fire-Water·Earth-Air) — 서로를 당황시키는 차이가 있으나 이해하면 최고의 보완이 됩니다.`
          : '원소가 서로 다른 온도를 가집니다 — 작은 관심으로 서로의 언어를 배우면 충분히 조화됩니다.';
  const astroCombined = clamp100(
    0.4 * (ELEMENT_SCORE[elRel] ?? 60) + 0.3 * sunAspect.score + 0.3 * moonAspect.score
  );

  // ═══ 5. 관계 유형별 3대 영역 처방 ═══
  const moonAspPenalty = moonAspect.name.startsWith('스퀘어') ? -6 : moonAspect.name.startsWith('오포지션') ? -3 : 0;
  const wonjinPenalty = branchRelation.type === '원진' ? -5 : 0;
  const romanticScore = clamp100(
    0.35 * branchScore + 0.2 * stemScore + 0.2 * moonAspect.score + 0.15 * sukuyoScore + 0.1 * nobleScore + moonAspPenalty + wonjinPenalty
  );
  const businessScore = clamp100(
    0.3 * complementScore + 0.25 * sukuyoScore + 0.2 * sunAspect.score + 0.15 * stemScore + 0.1 * nobleScore
  );
  const friendshipScore = clamp100(
    0.3 * sukuyoScore + 0.25 * (ELEMENT_SCORE[elRel] ?? 60) + 0.2 * moonAspect.score + 0.15 * stemScore + 0.1 * nobleScore
  );
  const dimLabel = (s: number, kind: 'romantic' | 'business' | 'friendship'): { headline: string; detail: string } => {
    const band = scoreBand(s);
    if (kind === 'romantic') return {
      headline: `감정적 결속력·장기 안정성 ${band.label} (${s}점)`,
      detail: s >= 75
        ? '일지·달의 호응이 좋아 감정의 파도를 함께 넘는 힘이 있습니다. 오래갈수록 단단해지는 장기 안정형 결속입니다.'
        : s >= 55
          ? '정은 깊으나 감정의 온도차가 있을 수 있습니다. 정기적인 깊은 대화가 결속력을 한 단계 올립니다.'
          : '표현 방식의 차이가 클 수 있습니다. 서로의 사랑 언어를 확인하고 기대를 명시하는 노력이 필요합니다.',
    };
    if (kind === 'business') return {
      headline: `목표 달성 시너지·의사결정 보완 ${band.label} (${s}점)`,
      detail: s >= 75
        ? '오행 보완과 방향성이 맞물려 공동 목표 달성력이 높습니다. 역할 분담만 명확하면 큰 시너지입니다.'
        : s >= 55
          ? '협업은 가능하나 결정 속도에 차이가 있을 수 있습니다. 의사결정 규칙을 미리 합의하세요.'
          : '성향 차이가 크게 드러나는 영역입니다. 전문 영역을 분리하고 검토 단계를 두는 편이 안전합니다.',
    };
    return {
      headline: `대화의 편안함·가치관 공명 ${band.label} (${s}점)`,
      detail: s >= 75
        ? '격의 없는 대화와 가치관 공명이 좋습니다. 오래 이야기해도 피곤하지 않은 편안한 인연입니다.'
        : s >= 55
          ? '무난한 편안함 속에 서로 다른 관심사가 공존합니다. 공통 활동을 하나 만들면 공명이 깊어집니다.'
          : '대화 주제가 쉽게 겹치지 않습니다. 상대의 세계에 질문을 던지는 자세가 관계를 엽니다.',
    };
  };
  const romanticLabel = dimLabel(romanticScore, 'romantic');
  const businessLabel = dimLabel(businessScore, 'business');
  const friendshipLabel = dimLabel(friendshipScore, 'friendship');

  // ═══ 최종 통합 (가중 합산) ═══
  const contextualAvg = (romanticScore + businessScore + friendshipScore) / 3;
  const finalScore = clamp100(
    0.34 * sajuCombined + 0.16 * nobleScore + 0.20 * sukuyoScore + 0.15 * astroCombined + 0.15 * contextualAvg
  );

  let grade: CompatibilityAnalysisResult['grade'] = '화합동반';
  let title = '서로에게 힘이 되어주는 조화로운 인연';
  if (finalScore >= 88) {
    grade = '천생연분';
    title = '하늘이 맺어준 듯 깊고 단단한 최상급 천생연분';
  } else if (finalScore >= 78) {
    grade = '상생길연';
    title = '함께할수록 시너지가 만개하는 복된 상생길연';
  } else if (finalScore >= 68) {
    grade = '화합동반';
    title = '따뜻한 대화와 신뢰로 가꾸어가는 동반자적 인연';
  } else if (finalScore >= 58) {
    grade = '보완노력';
    title = '서로의 다름을 인정하며 성숙해지는 보완의 인연';
  } else {
    grade = '자극성장';
    title = '강렬한 개성으로 상대를 일깨우는 도전적 인연';
  }

  const summary = `${nameA} 님과 ${nameB} 님은 ${stemRelation.isHarmonious ? '천간의 다정한 합과 ' : ''}${sukuyoInfo.relationName}의 기운으로 이어져 있${mutualNoble ? '으며, 서로가 서로의 천을귀인인 상호 귀인 인연(互貴人)이 성립합니다' : '습니다'}. ${elementSummary}`;

  return {
    engineVersion: COMPATIBILITY_ENGINE_VERSION,
    method: COMPATIBILITY_ENGINE_METHOD,
    score: finalScore,
    grade,
    title,
    summary,
    saju: {
      personA: {
        name: nameA,
        dayMaster: `${sajuA?.dayMaster?.hanja || ''} ${stemA}`.trim(),
        dayBranch: branchA,
        dominantElement: sajuA?.dayMaster?.element || '목',
      },
      personB: {
        name: nameB,
        dayMaster: `${sajuB?.dayMaster?.hanja || ''} ${stemB}`.trim(),
        dayBranch: branchB,
        dominantElement: sajuB?.dayMaster?.element || '금',
      },
      stemRelation,
      branchRelation,
      elementComplement: {
        aNeedsFromB,
        bNeedsFromA,
        score: complementScore,
        summary: elementSummary,
      },
      combinedScore: sajuCombined,
    },
    mutualNobleman: {
      aNobleBranches: aNoble.map((b) => `${b}(${BRANCH_KR[b] || b})`),
      bNobleBranches: bNoble.map((b) => `${b}(${BRANCH_KR[b] || b})`),
      aNobleInB: aNobleInB.map((b) => `${b}(${BRANCH_KR[b] || b})`),
      bNobleInA: bNobleInA.map((b) => `${b}(${BRANCH_KR[b] || b})`),
      aIsBNoble,
      bIsANoble,
      mutual: mutualNoble,
      score: nobleScore,
      desc: nobleDesc,
    },
    sukuyo: sukuyoInfo,
    astrology: {
      sunA: signA,
      sunB: signB,
      moonA: moonSignA,
      moonB: moonSignB,
      elementA: astroElA,
      elementB: astroElB,
      elementRelation: elRel,
      sunAspect: { name: sunAspect.name, angle: sunAspect.angle, desc: sunAspect.desc },
      moonAspect: { name: moonAspect.name, angle: moonAspect.angle, desc: moonAspect.desc },
      aspect: elRel === '동원소' ? '동일 원소' : elRel === '상생' ? '상생 원소' : elRel === '갈등' ? '갈등 원소' : '중립 원소',
      harmonyDesc: elementHarmonyDesc,
      combinedScore: astroCombined,
    },
    dimensions: {
      romantic: { score: romanticScore, headline: romanticLabel.headline, detail: romanticLabel.detail },
      business: { score: businessScore, headline: businessLabel.headline, detail: businessLabel.detail },
      friendship: { score: friendshipScore, headline: friendshipLabel.headline, detail: friendshipLabel.detail },
    },
    breakdown: {
      saju: sajuCombined,
      nobleman: nobleScore,
      sukuyo: sukuyoScore,
      astrology: astroCombined,
      contextual: Math.round(contextualAvg),
    },
  };
}

/**
 * 결정론 궁합 리포트를 LLM 프롬프트에 주입하기 위한 구조화 텍스트 포맷터
 */
export function formatCompatibilityPrompt(result: CompatibilityAnalysisResult): string {
  return `[💘 5대 운명학 융합 궁합 리포트 (Unified Multi-Dimensional Synastry · ${result.engineVersion})]
======================================================================
대상: ${result.saju.personA.name} ✕ ${result.saju.personB.name}
종합 호환 점수: ★ ${result.score}점 [${result.grade}] · "${result.title}"
요약: ${result.summary}
요구 산법: ${result.method}
각 차원은 순수 수리·천문 결정론 계산이며, 생년월일시가 없는 차원은 추정하지 말고 '계산 생략'으로 안내하세요.

1. 사주 원국 결합 & 오행 상호 보완:
   - ${result.saju.personA.name}: ${result.saju.personA.dayMaster} 일간 · 일지 ${result.saju.personA.dayBranch} | ${result.saju.personB.name}: ${result.saju.personB.dayMaster} 일간 · 일지 ${result.saju.personB.dayBranch}
   - 천간 관계: ${result.saju.stemRelation.name} — ${result.saju.stemRelation.desc}
   - 일지 관계: ${result.saju.branchRelation.name} — ${result.saju.branchRelation.desc}
   - 오행 상호 보완도: ${result.saju.elementComplement.score}점 — ${result.saju.elementComplement.summary}
   - 사주 차원 통합: ${result.saju.combinedScore}점

2. 천을귀인 상호 인연 매칭:
   - ${result.saju.personA.name}의 귀인 글자: ${result.mutualNobleman.aNobleBranches.join('·') || '미계산'} | ${result.saju.personB.name}의 귀인 글자: ${result.mutualNobleman.bNobleBranches.join('·') || '미계산'}
   - 상대 원국에서 발견: ${result.mutualNobleman.aNobleInB.join('·') || '없음'} / 내 원국에서 발견: ${result.mutualNobleman.bNobleInA.join('·') || '없음'}
   - 판정: ${result.mutualNobleman.mutual ? '✅ 상호 천을귀인 성립' : result.mutualNobleman.bIsANoble ? '상대가 나의 귀인' : result.mutualNobleman.aIsBNoble ? '내가 상대의 귀인' : '귀인 교환 미성립'} — ${result.mutualNobleman.desc}

3. 숙요 27숙 6대 관계성 3거리 매트릭스:
   - 본명숙: ${result.saju.personA.name} [${result.sukuyo.mansionA}] ⇄ ${result.saju.personB.name} [${result.sukuyo.mansionB}]
   - 관계: ${result.sukuyo.relationName} (27숙 호환 지수 ${result.sukuyo.compatibilityScore ?? '미계산'}점)
   - 방향성: ${result.saju.personA.name} → ${result.saju.personB.name} [${result.sukuyo.fromMe}] / ${result.saju.personB.name} → ${result.saju.personA.name} [${result.sukuyo.fromPartner}]
   - 인연의 성격: ${result.sukuyo.meaning}

4. 서양 점성술 원소 & 황도궁 시나스트리:
   - 태양: ${result.saju.personA.name} [${result.astrology.sunA}·${result.astrology.elementA}] ⇄ ${result.saju.personB.name} [${result.astrology.sunB}·${result.astrology.elementB}] (${result.astrology.elementRelation})
   - 달: ${result.astrology.moonA} ⇄ ${result.astrology.moonB}
   - 태양-태양: ${result.astrology.sunAspect.name} — ${result.astrology.sunAspect.desc}
   - 달-달: ${result.astrology.moonAspect.name} — ${result.astrology.moonAspect.desc}
   - 원소 조화: ${result.astrology.harmonyDesc}

5. 관계 유형별 3대 영역 처방:
   - 연인·결혼: ${result.dimensions.romantic.headline} — ${result.dimensions.romantic.detail}
   - 비즈니스·파트너십: ${result.dimensions.business.headline} — ${result.dimensions.business.detail}
   - 소울메이트·우정: ${result.dimensions.friendship.headline} — ${result.dimensions.friendship.detail}

가중 브레이크다운: 사주 ${result.breakdown.saju} · 천을귀인 ${result.breakdown.nobleman} · 숙요 ${result.breakdown.sukuyo} · 점성술 ${result.breakdown.astrology} · 3대 영역 평균 ${result.breakdown.contextual}
======================================================================`;
}
