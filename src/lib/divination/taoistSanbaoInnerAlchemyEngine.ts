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

export const TAOIST_SANBAO_VERSION = 'LUCKEY-TAOIST-SANBAO-v2.4.0';

export type SanbaoQuestionTopic = 'career' | 'relationship' | 'decision' | 'inner' | 'general';

function formatSanbaoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
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
  questionTopic: SanbaoQuestionTopic;
  energyLevels: SanbaoEnergyLevels;
  dominantTreasure: '정 (Jing - 신체 활력)' | '기 (Qi - 실행과 호흡)' | '신 (Shen - 영적 통찰)';
  depletedTreasure: '정 (Jing - 수면·체력 고갈)' | '기 (Qi - 기력·감정 소진)' | '신 (Shen - 정신적 과부하)';
  alchemyPhase: {
    phaseName: '연정화기 (煉精化氣)' | '연기화신 (煉氣化神)' | '연신환허 (煉神還虛)';
    meaning: string;
    transformationTask: string;
  };
  overallHarmonyScore: number;  // 0 ~ 100 삼보 조화도
  sanbaoPhase: string;
  shadowWarning: string;
  dantianPrescription: string;  // 단전 집중 처방
  taoistBreathingPractice: string; // 일일 조식(調息) 실천법
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  sanbaoSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  sanbaoCrossAxis: {
    treasureBalancePair: string;
    alchemyStage: string;
    dantianFocus: string;
  };
}

function classifySanbaoQuestionTopic(query?: string): SanbaoQuestionTopic {
  const q = (query || '').toLowerCase();
  if (/일|직장|커리어|사업|프로젝트|성과|취업|이직/.test(q)) return 'career';
  if (/연애|관계|사랑|부부|가족|사람|갈등|인연/.test(q)) return 'relationship';
  if (/선택|결정|타이밍|방향|전환|고민|계약/.test(q)) return 'decision';
  if (/마음|감정|불안|휴식|회복|삼보|균형|수면|체력/.test(q)) return 'inner';
  return 'general';
}

function buildSanbaoShadowWarning(
  depletedTreasure: TaoistSanbaoReport['depletedTreasure'],
  topic: SanbaoQuestionTopic
): string {
  const topicNote: Record<SanbaoQuestionTopic, string> = {
    career: '체력과 기력을 당겨 쓰며 성과를 밀어붙이면 집중력의 지속성이 급격히 떨어집니다.',
    relationship: '감정적 여력이 부족할 때 무리하게 대화를 길게 끌면 오해가 깊어지기 쉽습니다.',
    decision: '피로가 누적된 상태에서의 조급한 결단은 단기 회피로 흐르기 쉬우니 호흡부터 가다듬으세요.',
    inner: '부족한 에너지를 자책으로 몰아가지 말고 수면·식사·호흡 중 가장 쉬운 하나부터 복구하세요.',
    general: '한쪽 보물이 고갈된 신호를 무시하고 무리한 일정을 겹치지 않도록 속도를 조절하세요.',
  };
  return `[${depletedTreasure}] 과잉 경계: ${topicNote[topic]}`;
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
  const questionTopic = classifySanbaoQuestionTopic(q);
  const sanbaoPhase = `${alchemyPhase.phaseName} — ${alchemyPhase.meaning}`;
  const shadowWarning = buildSanbaoShadowWarning(depletedTreasure, questionTopic);
  const ritualAction = `[${alchemyPhase.phaseName}] ${alchemyPhase.transformationTask}`;
  const reflectionFocus = `도교 삼보 내단(${dominantTreasure}) — ${alchemyPhase.meaning}`;
  const reflectiveQuestion = q
    ? `"${q}" 앞에서 ${dominantTreasure}의 기운을 낭비하지 않고 ${depletedTreasure}을 채우기 위해, 오늘 가장 먼저 줄여야 할 소모는 무엇입니까?`
    : `${alchemyPhase.phaseName} 국면에서 ${alchemyPhase.transformationTask}을 시작하기 위해, 지금 당장 내려놓을 수 있는 긴장은 무엇입니까?`;
  const interpretiveBoundary =
    '도교 내단학 삼보(정·기·신)와 단전·조식법 상징은 몸과 마음의 휴식과 호흡 리듬을 살피기 위한 양생적 은유이며, 단정적 미래 예측이나 의학적 진단·처방을 대체하지 않습니다.';
  const sanbaoSynthesisMatrix = {
    dominantTension: `${dominantTreasure} ↔ ${depletedTreasure}`,
    alignmentState: `${sanbaoPhase} | 맥락(${questionTopic})`,
    integratedAction: `${alchemyPhase.transformationTask}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const sanbaoCrossAxis = {
    treasureBalancePair: `${dominantTreasure.split('(')[0].trim()} ↔ ${depletedTreasure.split('(')[0].trim()}`,
    alchemyStage: alchemyPhase.phaseName,
    dantianFocus: dantianPrescription.split(':')[0].trim(),
  };

  return {
    engineVersion: TAOIST_SANBAO_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    questionTopic,
    energyLevels,
    dominantTreasure,
    depletedTreasure,
    alchemyPhase,
    overallHarmonyScore: Math.max(30, Math.min(99, overallHarmonyScore)),
    sanbaoPhase,
    shadowWarning,
    dantianPrescription,
    taoistBreathingPractice,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    sanbaoSynthesisMatrix,
    sanbaoCrossAxis,
  };
}

export function formatTaoistSanbaoInnerAlchemyPrompt(report: TaoistSanbaoReport): string {
  const matrixLine = report.sanbaoSynthesisMatrix
    ? `\n- **삼보 교차 매트릭스**: 핵심 긴장(${report.sanbaoSynthesisMatrix.dominantTension}) · 조율 상태(${report.sanbaoSynthesisMatrix.alignmentState}) · 통합 실천(${report.sanbaoSynthesisMatrix.integratedAction})\n- **삼보 교차 축**: ${report.sanbaoCrossAxis.treasureBalancePair} | ${report.sanbaoCrossAxis.alchemyStage} (${report.sanbaoCrossAxis.dantianFocus})`
    : '';
  return `### ☯️ 도교 내단학(內丹學) 삼보(三寶: 정·기·신) 생체 에너지 순환 & 연정화기 엔진 (${TAOIST_SANBAO_VERSION} | ${report.calculatedAtKst})
- **질문 맥락**: ${report.questionTopic} | **내단 국면**: ${report.sanbaoPhase}
- **현재 우세 에너지**: ${report.dominantTreasure}
- **우선 보충 필요(누수처)**: ${report.depletedTreasure}
- **과잉·경계 점검**: ${report.shadowWarning}
- **내단학 변환 국면**: ${report.alchemyPhase.phaseName} [${report.alchemyPhase.meaning}]
- **내단 승화 핵심 과제**: ${report.alchemyPhase.transformationTask}
- **단전(丹田) 집중 가이드**: ${report.dantianPrescription}
- **일일 도교 조식법 (Breathing)**: ${report.taoistBreathingPractice}${matrixLine}
- **실천 의례**: ${report.ritualAction}
- **성찰 초점**: ${report.reflectionFocus}
- **성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: ${report.interpretiveBoundary}`;
}
