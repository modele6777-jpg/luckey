import { calculateDetailedSaju, type SajuAnalysisResult, type FiveElement } from '../sajuAnalysis';
import { calculateNatalChart, type NatalChartResult } from '../astrologyAnalysis';
import { calculateSukuyo, sukuyoRelationship } from './birthCharts';
import type { UserProfile } from '../sharedState';

export interface CompatibilityAnalysisResult {
  score: number; // 0 ~ 100점
  grade: '천생연분' | '상생길연' | '화합동반' | '보완노력' | '자극성장';
  title: string;
  summary: string;

  // 1. 사주 일간 및 일지 결합
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
  };

  // 2. 숙요 27숙 인연 관계
  sukuyo: {
    mansionA: string;
    mansionB: string;
    relationName: string;
    relationType: '영친' | '안괴' | '우쇠' | '성위' | '업태' | '명';
    distanceText: string;
    meaning: string;
  };

  // 3. 서양 점성술 시나스트리 (Sun Signs & Elements)
  astrology: {
    sunA: string;
    sunB: string;
    elementA: string;
    elementB: string;
    aspect: string;
    harmonyDesc: string;
  };
}

// 천간합 정의
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

// 천간충 정의
const STEM_CLASH: Record<string, string> = {
  갑: '경', 경: '갑',
  을: '신', 신: '을',
  병: '임', 임: '병',
  정: '계', 계: '정',
};

// 지지 육합 정의
const BRANCH_SIX_HARMONY: Record<string, { partner: string; name: string }> = {
  자: { partner: '축', name: '자축합(子丑合)' }, 축: { partner: '자', name: '자축합(子丑合)' },
  인: { partner: '해', name: '인해합(寅亥合)' }, 해: { partner: '인', name: '인해합(寅亥合)' },
  묘: { partner: '술', name: '묘술합(卯戌合)' }, 술: { partner: '묘', name: '묘술합(卯戌合)' },
  진: { partner: '유', name: '진유합(辰酉合)' }, 유: { partner: '진', name: '진유합(辰酉合)' },
  사: { partner: '신', name: '사신합(巳申合)' }, 신: { partner: '사', name: '사신합(巳申合)' },
  오: { partner: '미', name: '오미합(午未合)' }, 미: { partner: '오', name: '오미합(午未合)' },
};

// 지지충 정의
const BRANCH_CLASH: Record<string, { partner: string; name: string }> = {
  자: { partner: '오', name: '자오충(子午沖)' }, 오: { partner: '자', name: '자오충(子午沖)' },
  축: { partner: '미', name: '축미충(丑未沖)' }, 미: { partner: '축', name: '축미충(丑未沖)' },
  인: { partner: '신', name: '인신충(寅申沖)' }, 신: { partner: '인', name: '인신충(寅申沖)' },
  묘: { partner: '유', name: '묘유충(卯酉沖)' }, 유: { partner: '묘', name: '묘유충(卯酉沖)' },
  진: { partner: '술', name: '진술충(辰戌沖)' }, 술: { partner: '진', name: '진술충(辰戌沖)' },
  사: { partner: '해', name: '사해충(巳亥沖)' }, 해: { partner: '사', name: '사해충(巳亥沖)' },
};

// 지지 원진살 정의
const BRANCH_WONJIN: Record<string, { partner: string; name: string }> = {
  자: { partner: '미', name: '자미원진(子未怨嗔)' }, 미: { partner: '자', name: '자미원진(子未怨嗔)' },
  축: { partner: '오', name: '축오원진(丑午怨嗔)' }, 오: { partner: '축', name: '축오원진(丑午怨嗔)' },
  인: { partner: '유', name: '인유원진(寅酉怨嗔)' }, 유: { partner: '인', name: '인유원진(寅酉怨嗔)' },
  묘: { partner: '신', name: '묘신원진(卯申怨嗔)' }, 신: { partner: '묘', name: '묘신원진(卯申怨嗔)' },
  진: { partner: '해', name: '진해원진(辰亥怨嗔)' }, 해: { partner: '진', name: '진해원진(辰亥怨嗔)' },
  사: { partner: '술', name: '사술원진(巳戌怨嗔)' }, 술: { partner: '사', name: '사술원진(巳戌怨嗔)' },
};

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

export function calculateDeterministicCompatibility(
  profileA: UserProfile,
  profileB: UserProfile
): CompatibilityAnalysisResult {
  const sajuA = calculateDetailedSaju(profileA);
  const sajuB = calculateDetailedSaju(profileB);
  const astroA = calculateNatalChart(profileA);
  const astroB = calculateNatalChart(profileB);

  let sukuyoA: ReturnType<typeof calculateSukuyo> | null = null;
  let sukuyoB: ReturnType<typeof calculateSukuyo> | null = null;
  try {
    sukuyoA = calculateSukuyo(profileA);
    sukuyoB = calculateSukuyo(profileB);
  } catch (_) {}

  // 1. 사주 분석
  const stemA = sajuA?.dayMaster?.korean || '갑';
  const stemB = sajuB?.dayMaster?.korean || '기';
  const branchA = sajuA?.pillars?.day?.earthlyBranch?.korean || '자';
  const branchB = sajuB?.pillars?.day?.earthlyBranch?.korean || '축';

  let stemScore = 15;
  let stemRelation = { isHarmonious: false, name: '일간 조화', desc: '서로 다른 개성으로 균형을 이루는 관계' };
  if (STEM_HARMONY[stemA]?.partner === stemB) {
    stemScore = 30;
    stemRelation = {
      isHarmonious: true,
      name: STEM_HARMONY[stemA].name,
      desc: '천간이 정답게 합(合)을 이루어 서로에게 본능적으로 이끌리고 대화가 깊이 통합니다.',
    };
  } else if (STEM_CLASH[stemA] === stemB) {
    stemScore = 8;
    stemRelation = {
      isHarmonious: false,
      name: `${stemA}${stemB}충`,
      desc: '서로의 주관이 뚜렷하여 생각의 차이가 있으나, 솔직한 소통으로 시각을 넓혀줍니다.',
    };
  }

  let branchScore = 15;
  let branchRelation = { type: '평이' as const, name: '일지 평이', desc: '평온하고 일상적인 조화' };
  if (BRANCH_SIX_HARMONY[branchA]?.partner === branchB) {
    branchScore = 25;
    branchRelation = {
      type: '합',
      name: BRANCH_SIX_HARMONY[branchA].name,
      desc: '마음의 안식처이자 내면을 지탱하는 일지가 육합(六合)을 이루어 정서적 유대감이 각별합니다.',
    };
  } else if (BRANCH_CLASH[branchA]?.partner === branchB) {
    branchScore = 7;
    branchRelation = {
      type: '충',
      name: BRANCH_CLASH[branchA].name,
      desc: '일지 충(沖)으로 역동적인 자극과 긴장감이 존재하며, 서로의 독립된 영역을 존중할 때 더욱 돈독해집니다.',
    };
  } else if (BRANCH_WONJIN[branchA]?.partner === branchB) {
    branchScore = 10;
    branchRelation = {
      type: '원진',
      name: BRANCH_WONJIN[branchA].name,
      desc: '원진살의 기운으로 때때로 서운함이나 애증이 교차할 수 있으니 오해 없는 따뜻한 대화가 열쇠입니다.',
    };
  }

  // 오행 상호 보완성
  const elementsA = sajuA?.elementDistribution || { 목: 2, 화: 2, 토: 2, 금: 1, 수: 1 };
  const elementsB = sajuB?.elementDistribution || { 목: 1, 화: 1, 토: 2, 금: 2, 수: 2 };
  const aNeedsFromB: string[] = [];
  const bNeedsFromA: string[] = [];
  (['목', '화', '토', '금', '수'] as FiveElement[]).forEach((el) => {
    if (elementsA[el] === 0 && elementsB[el] > 1) aNeedsFromB.push(el);
    if (elementsB[el] === 0 && elementsA[el] > 1) bNeedsFromA.push(el);
  });

  const complementScore = 15 + Math.min(15, (aNeedsFromB.length + bNeedsFromA.length) * 7.5);
  const elementSummary =
    aNeedsFromB.length > 0 || bNeedsFromA.length > 0
      ? `A에게 부족한 [${aNeedsFromB.join(',') || '기운'}]과 B에게 부족한 [${bNeedsFromA.join(',') || '기운'}]을 서로가 풍성하게 채워주는 상생 시너지`
      : '오행 에너지가 서로 고르게 어우러져 평온한 흐름을 만듭니다.';

  // 2. 숙요 분석
  let sukuyoScore = 15;
  let sukuyoInfo = {
    mansionA: sukuyoA ? sukuyoA.mansion : '본명숙',
    mansionB: sukuyoB ? sukuyoB.mansion : '본명숙',
    relationName: '조화로운 인연',
    relationType: '영친' as CompatibilityAnalysisResult['sukuyo']['relationType'],
    distanceText: '중거리',
    meaning: '서로를 배려하고 존중할 때 아름다운 결실을 맺는 인연입니다.',
  };

  if (sukuyoA && sukuyoB) {
    const rel = sukuyoRelationship(sukuyoA.index, sukuyoB.index);
    const rawKey = rel.fromA;
    const meta = SUKUYO_RELATION_MEANINGS[rawKey] || { type: '영친', meaning: '상호 조화로운 인연' };
    const distText = rel.distance <= 4 || rel.distance >= 23 ? '근거리' : rel.distance <= 9 || rel.distance >= 18 ? '중거리' : '원거리';

    if (meta.type === '영친' || meta.type === '업태') sukuyoScore = 25;
    else if (meta.type === '명' || meta.type === '우쇠') sukuyoScore = 20;
    else sukuyoScore = 16;

    sukuyoInfo = {
      mansionA: sukuyoA.mansion,
      mansionB: sukuyoB.mansion,
      relationName: `${meta.type}(${rawKey}) 관계 · ${distText}`,
      relationType: meta.type,
      distanceText: distText,
      meaning: meta.meaning,
    };
  }

  // 3. 점성술 분석
  const signA = astroA?.sun?.sign?.name || '양자리';
  const signB = astroB?.sun?.sign?.name || '사자자리';
  const elMap: Record<string, string> = {
    양자리: '불', 사자자리: '불', 사수자리: '불',
    황소자리: '흙', 처녀자리: '흙', 염소자리: '흙',
    쌍둥이자리: '공기', 천칭자리: '공기', 물병자리: '공기',
    게자리: '물', 전갈자리: '물', 물고기자리: '물',
  };
  const astroElA = elMap[signA] || '불';
  const astroElB = elMap[signB] || '공기';

  let astroScore = 10;
  let harmonyDesc = '서로 다른 시선으로 새로운 자극을 주는 관계';
  if (astroElA === astroElB) {
    astroScore = 15;
    harmonyDesc = `같은 [${astroElA}] 원소로 맺어져 말하지 않아도 마음이 통하고 감각이 일치합니다.`;
  } else if (
    (astroElA === '불' && astroElB === '공기') ||
    (astroElA === '공기' && astroElB === '불') ||
    (astroElA === '흙' && astroElB === '물') ||
    (astroElA === '물' && astroElB === '흙')
  ) {
    astroScore = 14;
    harmonyDesc = `[${astroElA}]와 [${astroElB}]의 원소 조화로 서로에게 생명력과 영감을 불어넣는 훌륭한 시너지입니다.`;
  }

  // 총점 계산 (60 ~ 98점 범위 보정)
  const rawTotal = stemScore + branchScore + complementScore + sukuyoScore + astroScore;
  const finalScore = Math.max(62, Math.min(98, Math.round(rawTotal * 0.95)));

  let grade: CompatibilityAnalysisResult['grade'] = '화합동반';
  let title = '서로에게 힘이 되어주는 조화로운 인연';
  if (finalScore >= 90) {
    grade = '천생연분';
    title = '하늘이 맺어준 듯 깊고 단단한 최상급 천생연분';
  } else if (finalScore >= 83) {
    grade = '상생길연';
    title = '함께할수록 시너지가 만개하는 복된 상생길연';
  } else if (finalScore >= 75) {
    grade = '화합동반';
    title = '따뜻한 대화와 신뢰로 가꾸어가는 동반자적 인연';
  } else if (finalScore >= 68) {
    grade = '보완노력';
    title = '서로의 다름을 인정하며 성숙해지는 보완의 인연';
  } else {
    grade = '자극성장';
    title = '강렬한 개성으로 상대를 일깨우는 도전적 인연';
  }

  const nameA = profileA.basic.name || '나';
  const nameB = profileB.basic.name || '상대방';

  return {
    score: finalScore,
    grade,
    title,
    summary: `${nameA} 님과 ${nameB} 님은 ${stemRelation.isHarmonious ? '천간의 다정한 합과 ' : ''}${sukuyoInfo.relationName}의 기운으로 이어져 있습니다. ${elementSummary}`,
    saju: {
      personA: {
        name: nameA,
        dayMaster: `${sajuA?.dayMaster?.hanja || ''} ${stemA}`,
        dayBranch: branchA,
        dominantElement: sajuA?.dayMaster?.fiveElement || '목',
      },
      personB: {
        name: nameB,
        dayMaster: `${sajuB?.dayMaster?.hanja || ''} ${stemB}`,
        dayBranch: branchB,
        dominantElement: sajuB?.dayMaster?.fiveElement || '금',
      },
      stemRelation,
      branchRelation,
      elementComplement: {
        aNeedsFromB,
        bNeedsFromA,
        score: complementScore,
        summary: elementSummary,
      },
    },
    sukuyo: sukuyoInfo,
    astrology: {
      sunA: signA,
      sunB: signB,
      elementA: astroElA,
      elementB: astroElB,
      aspect: astroElA === astroElB ? '동일 원소' : '상생 원소',
      harmonyDesc,
    },
  };
}
