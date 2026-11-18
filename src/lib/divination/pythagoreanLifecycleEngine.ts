/**
 * =========================================================================
 * LUCKEY 피타고라스 4대 피너클 & 챌린지 생애 주기 엔진
 * (Pythagorean 4 Pinnacles & Challenges Lifecycle Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 서양 정통 피타고라스 수비학(Pythagorean Numerology)에 입각하여,
 * 한 인간의 전 생애를 4대 피너클(Pinnacles: 황금 도약기)과 4대 챌린지(Challenges: 인생 극복 과제)로
 * 정밀 수학 분할합니다.
 * 
 * 생년월일의 진동수(월 M, 일 D, 년 Y)와 라이프 패스(Life Path Number)로부터
 * 나이 전환점(예: 33세, 42세, 51세)을 도출하고, 현재 진행 중인 피너클과 챌린지,
 * 그리고 1~9년 주기의 개인년도(Personal Year)를 산출하여 동양의 10년 대운과 상호 검증합니다.
 */

import type { UserProfile } from '../sharedState';

export const PYTHAGOREAN_LIFECYCLE_VERSION = 'LUCKEY-PYTH-v2.2.0';

function formatPythagoreanKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface PinnacleInfo {
  index: 1 | 2 | 3 | 4;
  name: string;
  stageName: '형성기(청년기)' | '도약기(확장기)' | '원숙기(전성기)' | '완성기(결실기)';
  number: number; // 1 ~ 9
  startAge: number;
  endAge: number; // 99 for final
  theme: string;
  opportunities: string;
  financialEnergy: string;
}

export interface ChallengeInfo {
  index: 1 | 2 | 3 | 4;
  name: string;
  number: number; // 0 ~ 8
  title: string;
  coreLesson: string;
  trapToAvoid: string;
  sublimationKey: string;
}

export interface PersonalYearInfo {
  yearNumber: number; // 1 ~ 9
  cyclePhase: '씨앗과 독립' | '협력과 인내' | '창의와 표현' | '기반과 규율' | '변화와 자유' | '책임과 조화' | '성찰과 영성' | '권력과 결실' | '완성과 정리';
  theme: string;
  actionGuidance: string;
}

export interface PythagoreanLifecycleResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;
  birthdateStr: string;
  currentAge: number;
  lifePathNumber: number;
  masterNumber?: 11 | 22 | 33;
  
  // 4대 피너클 (황금기)
  pinnacles: [PinnacleInfo, PinnacleInfo, PinnacleInfo, PinnacleInfo];
  currentPinnacle: PinnacleInfo & { progressYear: number; yearsRemaining: number };

  // 4대 챌린지 (극복 과제)
  challenges: [ChallengeInfo, ChallengeInfo, ChallengeInfo, ChallengeInfo];
  currentChallenge: ChallengeInfo;

  // 개인년도 (Personal Year)
  currentPersonalYear: PersonalYearInfo;

  // 인생 전략 종합
  lifecycleStrategy: {
    goldenOpportunity: string;
    criticalWarning: string;
    recommendedFocus: string;
  };

  summary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  pythagoreanSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

// 단일 자릿수 축약 헬퍼
function reduceToSingleDigit(num: number): number {
  let val = Math.abs(num);
  while (val > 9) {
    val = String(val).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return val;
}

// 라이프 패스 계산 (11, 22, 33 마스터 넘버 보존)
function calculateLifePath(m: number, d: number, y: number): { baseNumber: number; masterNumber?: 11 | 22 | 33 } {
  const mRed = reduceToSingleDigit(m);
  const dRed = reduceToSingleDigit(d);
  const yRed = reduceToSingleDigit(y);
  const sum = mRed + dRed + yRed;

  if (sum === 11 || sum === 22 || sum === 33) {
    return { baseNumber: reduceToSingleDigit(sum), masterNumber: sum as 11 | 22 | 33 };
  }
  return { baseNumber: reduceToSingleDigit(sum) };
}

// 피너클 숫자별 의미 메타데이터
const PINNACLE_DESCRIPTIONS: Record<number, { theme: string; opportunities: string; financial: string }> = {
  1: {
    theme: '독립과 자립, 개척자의 길',
    opportunities: '창업, 독립적인 프로젝트 지휘, 새로운 시장 선점',
    financial: '자기 주도적 노력에 비례한 직접적 보상 획득'
  },
  2: {
    theme: '협력과 조화, 전략적 파트너십',
    opportunities: '강력한 동업자/파트너 결합, 세밀한 완성도 고도화',
    financial: '공동 투자 및 신뢰 기반의 안정적 자산 증식'
  },
  3: {
    theme: '창의성과 표현, 대중적 영향력',
    opportunities: '예술/콘텐츠 제작, 대중적 발표, 미디어 및 브랜딩 확장',
    financial: '아이디어와 지식재산권(IP)을 통한 부가가치 창출'
  },
  4: {
    theme: '견고한 기반 구축, 시스템과 규율',
    opportunities: '장기적 인프라 확립, 부동산/기술 자산화, 조직 체계화',
    financial: '근면과 체계적인 저축/투자로 실물 자산 구축'
  },
  5: {
    theme: '변화와 자유, 혁신과 다각화',
    opportunities: '글로벌 진출, 신기술 도입, 예측 불허의 전환점 포착',
    financial: '다각화된 파이프라인과 기민한 시장 적응으로 기회 수익'
  },
  6: {
    theme: '책임과 헌신, 커뮤니티와 패밀리',
    opportunities: '팀 빌딩, 사회적 신뢰 확보, 치유와 교육 사업 성공',
    financial: '안정적인 고객 기반과 충성도 높은 관계에서 오는 수익'
  },
  7: {
    theme: '전문성과 지혜, 내적 성찰과 연구',
    opportunities: '학문적 심화, 고난도 R&D 완성, 독보적 전문성 확립',
    financial: '희소성 높은 전문 기술 및 특허/저작권을 통한 고소득'
  },
  8: {
    theme: '권력과 성취, 대규모 물질적 결실',
    opportunities: '기업 스케일업, 대규모 자금 운용, 산업 내 주도권 장악',
    financial: '폭발적인 자본 증식 및 대형 비즈니스 결실'
  },
  9: {
    theme: '인류애와 완성, 글로벌 영향력',
    opportunities: '글로벌 사회공헌, 문화적 대통합, 오래된 사이클의 완벽한 매듭',
    financial: '나눔과 비전을 공유할 때 자연스럽게 유입되는 거대한 부'
  }
};

// 챌린지 숫자별 의미 메타데이터
const CHALLENGE_DESCRIPTIONS: Record<number, { title: string; lesson: string; trap: string; key: string }> = {
  0: {
    title: '모든 선택의 자유 (The Universal Challenge)',
    lesson: '정해진 시련이 없는 대신, 모든 선택과 결과를 온전히 책임지는 시험',
    trap: '목적의식 결여, 방황, 잠재력 낭비',
    key: '스스로 엄격한 규율과 소명을 정하고 몰입하기'
  },
  1: {
    title: '독립과 자존감의 시험',
    lesson: '타인의 인정에 목매지 않고 자신의 진정한 자아를 우뚝 세우기',
    trap: '지나친 고집이나 반대로 타인의 눈치를 보며 위축됨',
    key: '당당하게 "아니오"라고 말하고 자신의 비전을 뚝심 있게 실행'
  },
  2: {
    title: '민감성과 관계 조율의 시험',
    lesson: '타인의 사소한 비판에 상처받지 않고 건강한 심리적 경계선 세우기',
    trap: '피해의식, 과도한 감정 소모, 의존성',
    key: '감정과 팩트를 명확히 분리하고 평정심을 유지'
  },
  3: {
    title: '자기표현과 집중의 시험',
    lesson: '아이디어를 산만하게 벌리지 않고 하나의 완성된 걸작으로 수렴하기',
    trap: '얕은 수다, 피상적 트렌드 추종, 뒷심 부족',
    key: '에너지를 한곳에 모아 실질적인 창작물로 마무리'
  },
  4: {
    title: '규율과 인내의 시험',
    lesson: '지루하고 반복적인 기초 작업을 건너뛰지 않고 벽돌을 쌓아올리기',
    trap: '완고함, 변화에 대한 두려움, 게으름',
    key: '작은 루틴을 매일 완수하며 복리의 힘을 믿기'
  },
  5: {
    title: '자유와 충동 조절의 시험',
    lesson: '충동적인 탈출 욕구를 다스리고 진정한 내면의 자유를 발견하기',
    trap: '중독, 끈기 부족, 불안감으로 인한 잦은 이직/포기',
    key: '변화를 두려워하지 않되, 코어 가치는 굳건히 고정'
  },
  6: {
    title: '책임과 통제욕의 시험',
    lesson: '타인을 내 뜻대로 조종하려 하지 않고 있는 그대로 인정하기',
    trap: '오지랖, 희생자 코스프레, 가족/팀원과의 갈등',
    key: '도움을 요청받았을 때만 품격 있게 손을 내밀기'
  },
  7: {
    title: '믿음과 지혜의 시험',
    lesson: '냉소주의와 염세주의를 극복하고 세상과 인간에 대한 신뢰 회복',
    trap: '사회적 고립, 비판적 독설, 지나친 두뇌 의존',
    key: '지성과 더불어 직관과 영성을 통합하는 열린 마음'
  },
  8: {
    title: '물질과 권력의 균형 시험',
    lesson: '돈과 권력을 목적 자체가 아닌 인류를 위한 수단으로 올바르게 운용',
    trap: '탐욕, 물질만능주의, 권위주의적 갑질',
    key: '정직하고 공정한 원칙 위에서 물질적 성공을 일구기'
  }
};

// 개인년도 메타데이터
const PERSONAL_YEAR_METADATA: Record<number, { phase: PersonalYearInfo['cyclePhase']; theme: string; advice: string }> = {
  1: { phase: '씨앗과 독립', theme: '새로운 9년 사이클의 개막, 과감한 창업과 시작', advice: '새로운 씨앗을 심으세요. 머뭇거리지 말고 주도권을 쥐세요.' },
  2: { phase: '협력과 인내', theme: '뿌리를 내리는 시기, 파트너십과 세심한 준비', advice: '조급함을 버리고 조력자와 관계를 다지며 내실을 기르세요.' },
  3: { phase: '창의와 표현', theme: '새싹의 성장, 창작물 발표, 네트워크 확장', advice: '당신의 아이디어와 결과물을 세상에 자신 있게 알리세요.' },
  4: { phase: '기반과 규율', theme: '줄기를 단단히 세우는 시기, 시스템 구축과 헌신', advice: '규율을 정비하고 튼튼한 인프라와 재정 기반을 다지세요.' },
  5: { phase: '변화와 자유', theme: '꽃을 피우기 전의 대전환, 여행, 피벗, 새로운 시도', advice: '예상치 못한 기회를 향해 기민하게 방향을 전환하세요.' },
  6: { phase: '책임과 조화', theme: '가정, 팀, 사회적 책임 완수, 신뢰와 사랑', advice: '가까운 사람들을 보살피고 팀의 화합을 이끄세요.' },
  7: { phase: '성찰과 영성', theme: '내적 탐구, 기술 R&D, 재충전과 공부', advice: '외부 확장을 멈추고 지식의 깊이를 더하며 내면을 충전하세요.' },
  8: { phase: '권력과 결실', theme: '9년 사이클의 물질적 정점, 대규모 수확과 보상', advice: '과감하게 보상을 거두어들이고 권한을 행사하세요.' },
  9: { phase: '완성과 정리', theme: '사이클의 마무리, 불필요한 것의 청산과 용서', advice: '낡은 관행과 관계를 정리하고 다음 9년을 맞이할 공간을 비우세요.' }
};

/**
 * 피타고라스 생애 주기 계산 메인 함수
 */
export function calculatePythagoreanLifecycle(params?: {
  profile?: UserProfile | null;
  targetDate?: Date;
  question?: string;
}): PythagoreanLifecycleResult {
  const now = params?.targetDate || new Date();
  const birthdateStr = params?.profile?.basic?.birthdate || '1994-01-24';
  const parts = birthdateStr.split('-').map(p => parseInt(p, 10));
  const birthY = parts[0] || 1994;
  const birthM = parts[1] || 1;
  const birthD = parts[2] || 24;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // 만 나이 계산
  let currentAge = currentYear - birthY;
  if (currentMonth < birthM || (currentMonth === birthM && currentDay < birthD)) {
    currentAge -= 1;
  }

  // 1. 기본 수치 축약
  const mDigit = reduceToSingleDigit(birthM);
  const dDigit = reduceToSingleDigit(birthD);
  const yDigit = reduceToSingleDigit(birthY);
  const { baseNumber: lifePathNumber, masterNumber } = calculateLifePath(birthM, birthD, birthY);

  // 2. 4대 피너클 연산
  const p1Num = reduceToSingleDigit(mDigit + dDigit);
  const p2Num = reduceToSingleDigit(dDigit + yDigit);
  const p3Num = reduceToSingleDigit(p1Num + p2Num);
  const p4Num = reduceToSingleDigit(mDigit + yDigit);

  const p1EndAge = 36 - lifePathNumber;
  const p2StartAge = p1EndAge + 1;
  const p2EndAge = p2StartAge + 8;
  const p3StartAge = p2EndAge + 1;
  const p3EndAge = p3StartAge + 8;
  const p4StartAge = p3EndAge + 1;

  const makePinnacle = (
    index: 1 | 2 | 3 | 4,
    num: number,
    startAge: number,
    endAge: number,
    stage: PinnacleInfo['stageName']
  ): PinnacleInfo => {
    const meta = PINNACLE_DESCRIPTIONS[num] || PINNACLE_DESCRIPTIONS[1];
    return {
      index,
      name: `제${index} 피너클 (숫자 ${num})`,
      stageName: stage,
      number: num,
      startAge,
      endAge,
      theme: meta.theme,
      opportunities: meta.opportunities,
      financialEnergy: meta.financial
    };
  };

  const pinnacles: [PinnacleInfo, PinnacleInfo, PinnacleInfo, PinnacleInfo] = [
    makePinnacle(1, p1Num, 0, p1EndAge, '형성기(청년기)'),
    makePinnacle(2, p2Num, p2StartAge, p2EndAge, '도약기(확장기)'),
    makePinnacle(3, p3Num, p3StartAge, p3EndAge, '원숙기(전성기)'),
    makePinnacle(4, p4Num, p4StartAge, 99, '완성기(결실기)')
  ];

  // 현재 진행 중인 피너클 판정
  let activePinnacleIndex: 0 | 1 | 2 | 3 = 0;
  if (currentAge <= p1EndAge) activePinnacleIndex = 0;
  else if (currentAge <= p2EndAge) activePinnacleIndex = 1;
  else if (currentAge <= p3EndAge) activePinnacleIndex = 2;
  else activePinnacleIndex = 3;

  const activePinnacle = pinnacles[activePinnacleIndex];
  const progressYear = Math.max(1, currentAge - activePinnacle.startAge + 1);
  const yearsRemaining = Math.max(0, activePinnacle.endAge - currentAge);

  const currentPinnacle = {
    ...activePinnacle,
    progressYear,
    yearsRemaining
  };

  // 3. 4대 챌린지 연산
  const c1Num = Math.abs(mDigit - dDigit);
  const c2Num = Math.abs(dDigit - yDigit);
  const c3Num = Math.abs(c1Num - c2Num);
  const c4Num = Math.abs(mDigit - yDigit);

  const makeChallenge = (index: 1 | 2 | 3 | 4, num: number, stageName: string): ChallengeInfo => {
    const meta = CHALLENGE_DESCRIPTIONS[num] || CHALLENGE_DESCRIPTIONS[0];
    return {
      index,
      name: `제${index} 챌린지 (${stageName}) - 숫자 ${num}`,
      number: num,
      title: meta.title,
      coreLesson: meta.lesson,
      trapToAvoid: meta.trap,
      sublimationKey: meta.key
    };
  };

  const challenges: [ChallengeInfo, ChallengeInfo, ChallengeInfo, ChallengeInfo] = [
    makeChallenge(1, c1Num, '청년기 과제'),
    makeChallenge(2, c2Num, '중년기 과제'),
    makeChallenge(3, c3Num, '평생의 메인 과제'),
    makeChallenge(4, c4Num, '인생 후반 결실 과제')
  ];

  // 현재 챌린지는 평생의 핵심인 제3 챌린지와 현재 나이대 챌린지를 동시 참조
  const currentChallenge = activePinnacleIndex === 0
    ? challenges[0]
    : activePinnacleIndex === 1
      ? challenges[1]
      : challenges[2];

  // 4. 개인년도 (Personal Year) 연산
  const curYDigit = reduceToSingleDigit(currentYear);
  const personalYearNum = reduceToSingleDigit(curYDigit + mDigit + dDigit);
  const pyMeta = PERSONAL_YEAR_METADATA[personalYearNum] || PERSONAL_YEAR_METADATA[1];

  const currentPersonalYear: PersonalYearInfo = {
    yearNumber: personalYearNum,
    cyclePhase: pyMeta.phase,
    theme: pyMeta.theme,
    actionGuidance: pyMeta.advice
  };

  // 5. 종합 인생 전략
  const lifecycleStrategy = {
    goldenOpportunity: `현재 [${currentPinnacle.name}: ${currentPinnacle.stageName}] 구간으로 ${currentPinnacle.opportunities}`,
    criticalWarning: `[${currentChallenge.name}] 주의점: ${currentChallenge.trapToAvoid}`,
    recommendedFocus: `올해는 9년 주기 중 [${personalYearNum}년차: ${currentPersonalYear.cyclePhase}]입니다. ${currentPersonalYear.actionGuidance}`
  };

  const summary = `[피타고라스 생애 주기] 만 ${currentAge}세 / 라이프 패스 ${lifePathNumber}${masterNumber ? `(마스터 ${masterNumber})` : ''}. ` +
    `현재 [${currentPinnacle.name}] 진행 중(${currentPinnacle.startAge}~${currentPinnacle.endAge}세). ` +
    `올해 개인년도는 [${personalYearNum}년차: ${currentPersonalYear.cyclePhase}]입니다.`;

  const calculatedAtKst = formatPythagoreanKstTimestamp(now);
  const q = (params?.question || '').trim();
  const reflectiveQuestion = q
    ? `'${q}'의 국면에서 현재 [${currentPinnacle.name}]의 기회와 [${currentChallenge.name}]의 과제를 함께 비추어 볼 때, 지금 먼저 바로잡을 한 가지는 무엇입니까?`
    : `올해 개인년도 제${personalYearNum}년(${currentPersonalYear.cyclePhase})의 흐름 속에서 ${currentChallenge.sublimationKey}를 어떻게 실천하시겠습니까?`;
  const interpretiveBoundary =
    '이 리딩은 피타고라스 수비학 4대 피너클·챌린지와 개인년도 주기에 기반한 정성 성찰 비유이며, 생애 사건이나 재정 결과를 확정적으로 예측하지 않습니다.';
  const pythagoreanSynthesisMatrix = {
    dominantTension: `${currentPinnacle.name} ↔ ${currentChallenge.name}`,
    alignmentState: `개인년도 제${personalYearNum}년(${currentPersonalYear.cyclePhase}) · 라이프 패스 ${lifePathNumber}`,
    integratedAction: `${currentPersonalYear.actionGuidance}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: PYTHAGOREAN_LIFECYCLE_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    birthdateStr,
    currentAge,
    lifePathNumber,
    masterNumber,
    pinnacles,
    currentPinnacle,
    challenges,
    currentChallenge,
    currentPersonalYear,
    lifecycleStrategy,
    summary,
    ritualAction: `[${currentPinnacle.name}]과 개인년도 제${personalYearNum}년(${currentPersonalYear.cyclePhase})에 맞추어, '${currentChallenge.sublimationKey}'을(를) 오늘의 행동 원칙으로 한 줄 실행하세요.`,
    reflectionFocus: `피타고라스 생애주기(${currentPinnacle.name} ↔ ${currentChallenge.name}) — 개인년도 ${personalYearNum}년`,
    reflectiveQuestion,
    interpretiveBoundary,
    pythagoreanSynthesisMatrix,
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatPythagoreanLifecyclePrompt(res: PythagoreanLifecycleResult): string {
  const pList = res.pinnacles.map(p => `  • 제${p.index} 피너클 [숫자 ${p.number}]: ${p.stageName} (${p.startAge}~${p.endAge === 99 ? '이후' : p.endAge}세) - ${p.theme}`).join('\n');
  const cList = res.challenges.map(c => `  • 제${c.index} 챌린지 [숫자 ${c.number}]: ${c.title} - ${c.coreLesson}`).join('\n');

  const lines = [
    `[피타고라스 4대 피너클(Pinnacles) & 챌린지(Challenges) 생애 주기 리포트 (엔진: ${res.engineVersion} | ${res.calculatedAtKst})]`,
    `- 프로필: 생년월일 ${res.birthdateStr} (현재 만 ${res.currentAge}세) | 라이프 패스: ${res.lifePathNumber}${res.masterNumber ? ` (마스터 넘버 ${res.masterNumber})` : ''}`,
    `- 4대 피너클(황금 도약기) 타임라인:\n${pList}`,
    `  ★ 현재 진행 중인 피너클: [${res.currentPinnacle.name}: ${res.currentPinnacle.stageName}] - 진행 ${res.currentPinnacle.progressYear}년차 (남은 기간: 약 ${res.currentPinnacle.yearsRemaining}년)`,
    `  ★ 현재 피너클의 기회: ${res.currentPinnacle.opportunities} (재물 에너지: ${res.currentPinnacle.financialEnergy})`,
    `- 4대 챌린지(인생 극복 과제):\n${cList}`,
    `  ★ 현재 직면한 챌린지: [${res.currentChallenge.name}] - ${res.currentChallenge.title}`,
    `  ★ 극복 솔루션 키: ${res.currentChallenge.sublimationKey} (함정 주의: ${res.currentChallenge.trapToAvoid})`,
    `- 올해 개인년도(Personal Year): [제${res.currentPersonalYear.yearNumber}년: ${res.currentPersonalYear.cyclePhase}]`,
    `  • 개인년 테마: ${res.currentPersonalYear.theme}`,
    `  • 개인년 행동 조언: ${res.currentPersonalYear.actionGuidance}`,
    `- 인생 종합 전략: ${res.lifecycleStrategy.goldenOpportunity}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
  ];
  if (res.pythagoreanSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스: [핵심 긴장: ${res.pythagoreanSynthesisMatrix.dominantTension} | 조율 상태: ${res.pythagoreanSynthesisMatrix.alignmentState}]`,
      `  • 통합 실천: ${res.pythagoreanSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 해석 경계: ${res.interpretiveBoundary}`);
  lines.push(`※ 루시 지침: 서양 수비학의 4대 피너클은 동양의 10년 대운과 정밀하게 공명하는 인생의 사계절입니다. 현재 나이대가 피너클의 어느 전환기에 있는지, 올해 개인년도 9년 사이클에서 어떤 단계인지와 챌린지 극복 방안을 명쾌하고 희망적으로 연결해 주세요.`);
  return lines.join('\n');
}

