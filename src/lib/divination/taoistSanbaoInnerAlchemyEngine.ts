/**
 * =========================================================================
 * LUCKEY 도교 내단학(內丹學) 삼보(三寶: 정·기·신) 생체 에너지 순환 & 연정화기 엔진
 * (Taoist Sanbao Inner Alchemy & Energetic Circulation Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 중국 도교 내단학(內丹學)의 최고 비전인 포박자(抱朴子)와 종려전도집(鍾呂傳道集)의 핵심 원리.
 * 인간 생명력의 3대 근원인 삼보(三寶: 精·氣·神)의 조화와 승화 과정을
 * 사주 일간(日干) 오행 및 생년월일 수비학에 매핑하여, 내담자의 신체적 활력과
 * 멘탈 에너지, 영적 직관의 균형 상태를 0ms 순수 수리로 진단하고
 * 연정화기(煉精化氣)·연기화신(煉氣化神)의 개운 조식(調息) 처방을 도출합니다.
 * 
 * 1. 하단전 정(精, Jing): 물리적 체력, 신장과 수면, 생명 원초적 질료
 * 2. 중단전 기(氣, Qi): 호흡과 감정, 심폐의 활력, 일상의 실행력과 의지
 * 3. 상단전 신(神, Shen): 영적 통찰, 직관과 명징한 의식, 니환궁(泥丸宮)의 지혜
 */

import type { UserProfile } from '../sharedState';

export const TAOIST_SANBAO_VERSION = 'LUCKEY-TAOIST-SANBAO-v2.0.0';

function formatSanbaoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export interface SanbaoEnergyLevels {
  jing: number;  // 0 ~ 100 정(精) 에너지 잔여량
  qi: number;    // 0 ~ 100 기(氣) 순환 지수
  shen: number;  // 0 ~ 100 신(神) 영적 조명도
}

export interface TaoistSanbaoReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  energyLevels: SanbaoEnergyLevels;
  dominantTreasure: '정 (Jing - 신체 활력)' | '기 (Qi - 실행과 호흡)' | '신 (Shen - 영적 통찰)';
  depletedTreasure: '정 (Jing - 수면·체력 고갈)' | '기 (Qi - 기력·감정 소진)' | '신 (Shen - 정신적 과부하)';
  alchemyPhase: {
    phaseName: '연정화기 (煉精化氣)' | '연기화신 (煉氣化神)' | '연신환허 (煉神還虛)';
    meaning: string;
    transformationTask: string;
  };
  overallHarmonyScore: number;  // 0 ~ 100 삼보 조화도
  dantianPrescription: string;  // 단전 집중 처방
  taoistBreathingPractice: string; // 일일 조식(調息) 실천법
  sanbaoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export function calculateTaoistSanbaoInnerAlchemy(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question?: string
): TaoistSanbaoReport {
  let birthSum = 11;
  let birthYear = 1992;
  let birthMonth = 7;
  let birthDay = 20;

  if (profile?.basic?.birthdate) {
    const digits = profile.basic.birthdate.replace(/\D/g, '');
    if (digits.length >= 8) {
      birthYear = parseInt(digits.slice(0, 4), 10);
      birthMonth = parseInt(digits.slice(4, 6), 10);
      birthDay = parseInt(digits.slice(6, 8), 10);
      birthSum = digits.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    }
  }

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();

  // 순수 수리 계산: 생년월일 + 목표일 기반 정·기·신 3차원 에너지 진동
  const daySeed = (targetYear * 365 + targetMonth * 30 + targetDay + birthSum) % 500;
  
  // 정(精): 신체 체력 및 원기 (50 ~ 95)
  const jing = 50 + ((birthDay * 7 + daySeed * 3) % 46);
  // 기(氣): 호흡과 감정 순환 (45 ~ 95)
  const qi = 45 + ((birthMonth * 11 + daySeed * 5) % 51);
  // 신(神): 영적 직관과 의식 맑기 (55 ~ 98)
  const shen = 55 + ((birthYear * 3 + daySeed * 7) % 44);

  const energyLevels: SanbaoEnergyLevels = { jing, qi, shen };

  // 우세 보물 및 결핍 보물 도출
  let dominantTreasure: TaoistSanbaoReport['dominantTreasure'];
  if (jing >= qi && jing >= shen) {
    dominantTreasure = '정 (Jing - 신체 활력)';
  } else if (qi >= jing && qi >= shen) {
    dominantTreasure = '기 (Qi - 실행과 호흡)';
  } else {
    dominantTreasure = '신 (Shen - 영적 통찰)';
  }

  let depletedTreasure: TaoistSanbaoReport['depletedTreasure'];
  if (jing <= qi && jing <= shen) {
    depletedTreasure = '정 (Jing - 수면·체력 고갈)';
  } else if (qi <= jing && qi <= shen) {
    depletedTreasure = '기 (Qi - 기력·감정 소진)';
  } else {
    depletedTreasure = '신 (Shen - 정신적 과부하)';
  }

  // 내단학 3단계 변환 국면 판정
  let alchemyPhase: TaoistSanbaoReport['alchemyPhase'];
  const avgEnergy = (jing + qi + shen) / 3;

  if (jing < 65 || qi < 65) {
    alchemyPhase = {
      phaseName: '연정화기 (煉精化氣)',
      meaning: '물리적 체력과 수면(精)의 누수를 막고, 이를 맑고 강인한 추진력(氣)으로 제련하는 기초 구축기',
      transformationTask: '야근이나 스마트폰 과몰입으로 정(精)을 낭비하지 말고, 깊은 수면과 단단한 식사로 몸의 기초를 단련하기'
    };
  } else if (shen < 75) {
    alchemyPhase = {
      phaseName: '연기화신 (煉氣化神)',
      meaning: '가슴의 감정적 요동과 산만한 에너지를 고요한 호흡으로 다스려, 번뜩이는 영적 직관과 지혜(神)로 승화시키는 도약기',
      transformationTask: '잡념과 감정의 파도에 반응하지 말고, 의식을 미간 상단전에 모아 본질적인 지혜의 통찰을 포착하기'
    };
  } else {
    alchemyPhase = {
      phaseName: '연신환허 (煉神還虛)',
      meaning: '개인의 협소한 자아의 틀을 깨고, 대자연과 우주의 무한한 섭리(虛)와 완벽히 하나 되는 대원만(大圓滿)의 경지',
      transformationTask: '자신의 지혜와 능력을 세상과 타인을 위한 선한 기여로 흘려보내며 물처럼 자연스럽게 흐르기'
    };
  }

  const overallHarmonyScore = Math.round(100 - (Math.abs(jing - qi) + Math.abs(qi - shen) + Math.abs(shen - jing)) / 3);

  const dantianPrescription = depletedTreasure.startsWith('정')
    ? '하단전(기해·관원): 배꼽 아래 5cm 부위에 따뜻한 황금빛 구슬이 머물고 있다고 상상하며 의식을 하체로 닻을 내리세요.'
    : depletedTreasure.startsWith('기')
    ? '중단전(전중): 가슴 정중앙의 억눌린 답답함을 깊은 날숨과 함께 토해내고, 폐부 가득 신선한 생명력을 채우세요.'
    : '상단전(인당·니환궁): 미간 사이의 긴장을 풀고 눈을 감은 채 맑고 푸른 호수를 바라보듯 머릿속 과열을 식히세요.';

  const taoistBreathingPractice = `도교 복식 조식법: 숨을 들이쉴 때 아랫배를 부드럽게 부풀리고(4초), 2초간 멈춘 뒤, 천천히 입으로 숨을 내쉬며(6초) 몸속의 탁기(濁氣)를 배출하세요. 3회 반복으로 정·기·신이 즉각 정렬됩니다.`;
  const calculatedAtKst = formatSanbaoKstTimestamp(targetDate);
  const q = (question || '').trim();
  const sanbaoSynthesisMatrix = {
    dominantTension: `${dominantTreasure} ↔ ${depletedTreasure}`,
    alignmentState: `${alchemyPhase.phaseName} — ${alchemyPhase.meaning}`,
    integratedAction: `${alchemyPhase.transformationTask}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: TAOIST_SANBAO_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    energyLevels,
    dominantTreasure,
    depletedTreasure,
    alchemyPhase,
    overallHarmonyScore: Math.max(30, Math.min(99, overallHarmonyScore)),
    dantianPrescription,
    taoistBreathingPractice,
    sanbaoSynthesisMatrix,
  };
}

export function formatTaoistSanbaoInnerAlchemyPrompt(report: TaoistSanbaoReport): string {
  const matrixLine = report.sanbaoSynthesisMatrix
    ? `\n- **삼보 교차 매트릭스**: 핵심 긴장(${report.sanbaoSynthesisMatrix.dominantTension}) · 조율 상태(${report.sanbaoSynthesisMatrix.alignmentState}) · 통합 실천(${report.sanbaoSynthesisMatrix.integratedAction})`
    : '';
  return `### ☯️ 도교 내단학(內丹學) 삼보(三寶: 정·기·신) 생체 에너지 순환 & 연정화기 엔진 (${TAOIST_SANBAO_VERSION} | ${report.calculatedAtKst})
- **현재 우세 에너지**: ${report.dominantTreasure}
- **우선 보충 필요(누수처)**: ${report.depletedTreasure}
- **내단학 변환 국면**: ${report.alchemyPhase.phaseName} [${report.alchemyPhase.meaning}]
- **내단 승화 핵심 과제**: ${report.alchemyPhase.transformationTask}
- **단전(丹田) 집중 가이드**: ${report.dantianPrescription}
- **일일 도교 조식법 (Breathing)**: ${report.taoistBreathingPractice}${matrixLine}`;
}
