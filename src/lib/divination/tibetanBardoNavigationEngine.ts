/**
 * =========================================================================
 * LUCKEY 티베트 불교 바르도(Bardo) 6대 환생 상태 & 전환기 의식 항해 엔진
 * (Tibetan Bardo Navigation & Transitional Consciousness Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 8세기 티베트 밀교의 개조 파드마삼바바(Padmasambhava)의 불후의 경전
 * 『티베트 사자의 서 (Bardo Thodol: 중간 상태에서의 위대한 해탈)』에 기반한
 * 6대 바르도(Bardo: 존재와 비존재 사이의 중간 전환 상태) 체계를
 * 현대인의 인생 전환기(이직, 결별, 프로젝트 완료, 정체성 혼란, 새로운 도약)에 매핑하여,
 * 내담자가 겪고 있는 혼란과 두려움을 자각의 기회로 전환하는 의식 항해 지침을 0ms 순수 수리로 산출합니다.
 * 
 * [6대 바르도 (Six Transitional States)]
 * 1. 키에네 바르도 (Kyene Bardo): 깨어 있는 일상의 삶, 현생의 알아차림
 * 2. 밀람 바르도 (Milam Bardo): 꿈과 무의식, 환영의 통찰 (꿈의 요가)
 * 3. 삼텐 바르도 (Samten Bardo): 명상과 삼매, 내면의 고요한 침묵
 * 4. 치카이 바르도 (Chikhai Bardo): 옛것의 종말, 낡은 에고의 해체와 근원적 빛의 여명
 * 5. 최니 바르도 (Chonyi Bardo): 법성(法性)의 투사, 내면의 두려움과 욕망의 환영 직면
 * 6. 시드파 바르도 (Sidpa Bardo): 새로운 존재로의 환생, 새로운 탄생과 시작의 선택
 */

import type { UserProfile } from '../sharedState';

export const TIBETAN_BARDO_VERSION = 'LUCKEY-TIBETAN-BARDO-v1.0.0';

export interface BardoStateInfo {
  stateNo: number;
  nameTibetan: string;
  nameKo: string;
  transitionalContext: string;
  spiritualOpportunity: string;
  illusoryTrap: string;
}

export interface TibetanBardoReport {
  engineVersion: string;
  calculatedAt: string;
  currentBardoState: BardoStateInfo;
  awarenessClarityScore: number; // 0 ~ 100 의식 명징도 및 자각 지수
  clearLightRecognition: string; // 근원적 맑은 빛(Rigpa)의 통찰
  bardoNavigationGuidance: string; // 중간 상태를 안전하게 건너는 항해 나침반
  dailyZenAnchor: string;         // 일상에서 마음의 중심을 잡는 닻
}

const BARDO_STATES: BardoStateInfo[] = [
  {
    stateNo: 1,
    nameTibetan: 'Kyene Bardo (키에네 바르도)',
    nameKo: '처생중음 (處生中陰) - 깨어 있는 일상의 자각',
    transitionalContext: '익숙한 일상을 살아가며 현실의 책무와 인간관계를 맺고 있는 시기',
    spiritualOpportunity: '모든 평범한 순간(걷기, 대화, 식사)을 현존의 명상으로 바꾸는 살아있는 깨달음',
    illusoryTrap: '바쁜 일상에 매몰되어 삶이 영원할 것이라는 착각 속에 본질적 성장을 망각함'
  },
  {
    stateNo: 2,
    nameTibetan: 'Milam Bardo (밀람 바르도)',
    nameKo: '몽경중음 (夢境中陰) - 꿈과 무의식의 환영 직면',
    transitionalContext: '내면의 무의식적 욕망, 혼란스러운 꿈, 직관과 공상이 강하게 요동치는 시기',
    spiritualOpportunity: '현실 또한 거대한 마음의 투사이자 꿈임을 간파하여 모든 집착의 무게를 가볍게 내려놓는 지혜',
    illusoryTrap: '자신이 만든 생각과 공포의 환영에 속아 불필요한 불안과 공황에 시달림'
  },
  {
    stateNo: 3,
    nameTibetan: 'Samten Bardo (삼텐 바르도)',
    nameKo: '선정중음 (禪定中陰) - 고요한 명상과 내적 집중',
    transitionalContext: '외부의 소음에서 물러나 홀로 사색하고 깊은 내면의 침묵 속으로 침잠하는 시기',
    spiritualOpportunity: '생각의 소용돌이가 멈춘 텅 빈 마음의 자리에서 변치 않는 평화와 본래의 자아를 발견함',
    illusoryTrap: '세상과의 소통을 완전히 단절하고 자기만의 껍질 속에 갇히는 영적 나태함'
  },
  {
    stateNo: 4,
    nameTibetan: 'Chikhai Bardo (치카이 바르도)',
    nameKo: '임종중음 (臨終中陰) - 낡은 질서의 종말과 원초적 빛',
    transitionalContext: '오랫동안 유지해 온 일, 관계, 신념체계가 무너져 내리고 거대한 끝을 맞이하는 시기',
    spiritualOpportunity: '낡은 자아가 해체되는 순간 번뜩이는 근원적 맑은 빛(Clear Light)을 직관하여 완전한 자유를 얻음',
    illusoryTrap: '이미 끝난 과거의 부스러기를 필사적으로 움켜쥐며 상실에 대한 극심한 공포에 사로잡힘'
  },
  {
    stateNo: 5,
    nameTibetan: 'Chonyi Bardo (최니 바르도)',
    nameKo: '법성중음 (法性中陰) - 투사의 자각과 시험 돌파',
    transitionalContext: '극심한 스트레스, 예상치 못한 사건의 맹폭, 내면의 분노와 유혹이 환영처럼 몰아치는 시기',
    spiritualOpportunity: '외부의 거센 위협조차 내 마음이 비춰낸 거울일 뿐임을 간파하고 당당하게 미소 짓는 무외(無畏)의 힘',
    illusoryTrap: '두려움에 질려 비명을 지르며 도망치거나, 매혹적인 유혹에 눈이 멀어 본질을 잃어버림'
  },
  {
    stateNo: 6,
    nameTibetan: 'Sidpa Bardo (시드파 바르도)',
    nameKo: '투생중음 (投生中陰) - 새로운 탄생과 미래의 선택',
    transitionalContext: '과거의 정리가 끝나고 완전히 새로운 프로젝트, 새로운 삶의 무대로 진입하려는 재탄생의 시기',
    spiritualOpportunity: '과거의 업보(습관)에 끌려가지 않고, 가장 맑고 고귀한 의도로 새로운 삶의 방향과 기회를 주체적으로 선택함',
    illusoryTrap: '조급한 마음에 아무 문이나 열고 들어가 이전과 똑같은 실수와 후회를 반복함'
  }
];

export function calculateTibetanBardoNavigation(
  profile?: UserProfile | null,
  targetDate: Date = new Date()
): TibetanBardoReport {
  let birthSum = 8;
  let birthYear = 1990;
  let birthMonth = 5;
  let birthDay = 15;

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

  // 바르도 6단계 상태 판정 (0 ~ 5)
  const timeSeed = (targetYear * 365 + targetMonth * 31 + targetDay + birthSum) % 600;
  const bardoIndex = (birthYear + birthMonth * 2 + birthDay + timeSeed) % 6;
  const currentBardoState = BARDO_STATES[bardoIndex];

  // 의식 명징도 지수 (60 ~ 98)
  const awarenessClarityScore = 60 + ((birthSum * 7 + timeSeed) % 39);

  const clearLightInsightList = [
    '일상의 모든 순간에 깨어 있는 자는 삶과 죽음의 경계를 두려워하지 않는다.',
    '두려움도 욕망도 밤하늘의 구름일 뿐, 하늘 자체는 언제나 푸르고 광활하다.',
    '내면의 침묵 속에 머물 때, 어떤 외부의 풍랑도 나의 평화를 앗아갈 수 없다.',
    '낡은 것이 죽어야만 비로소 새로운 위대함이 태어날 공간이 열린다.',
    '나를 위협하는 괴물조차 내 두려움이 만든 그림자임을 알 때, 환영은 연기처럼 사라진다.',
    '순수한 의도로 내딛는 한 걸음이 다음 생애의 찬란한 운명을 결정짓는다.'
  ];
  const clearLightRecognition = clearLightInsightList[bardoIndex];

  const bardoNavigationGuidance = `현재 내담자는 의식의 [${currentBardoState.nameKo}] 국면을 항해하고 있습니다. 지금 마주하는 혼란은 위험한 위기가 아니라, [${currentBardoState.spiritualOpportunity}]을/를 성취하기 위한 영혼의 중대한 전환점입니다. [${currentBardoState.illusoryTrap}]의 함정에 빠지지 말고, 흔들리지 않는 자각의 등불을 켜세요.`;

  const dailyZenAnchor = `[티베트 릭파(Rigpa) 찰나 자각법]: 가슴이 답답하거나 혼란스러울 때마다 "이 또한 지나가는 마음의 그림자일 뿐이다"라고 세 번 속삭이며, 가슴 중앙의 맑은 허공을 바라보세요.`;

  return {
    engineVersion: TIBETAN_BARDO_VERSION,
    calculatedAt: targetDate.toISOString(),
    currentBardoState,
    awarenessClarityScore,
    clearLightRecognition,
    bardoNavigationGuidance,
    dailyZenAnchor
  };
}

export function formatTibetanBardoNavigationPrompt(report: TibetanBardoReport): string {
  return `### ☸️ 티베트 불교 바르도(Bardo) 6대 환생 상태 & 전환기 의식 항해 엔진 (${TIBETAN_BARDO_VERSION})
- **현재 바르도 국면**: ${report.currentBardoState.nameTibetan} (${report.currentBardoState.nameKo})
- **전환기적 현실 맥락**: ${report.currentBardoState.transitionalContext}
- **의식 명징도 자각 지수**: ${report.awarenessClarityScore}점 / 100점
- **영적 도약의 기회**: ${report.currentBardoState.spiritualOpportunity}
- **주의해야 할 환영의 함정**: ${report.currentBardoState.illusoryTrap}
- **근원적 맑은 빛(Rigpa) 통찰**: "${report.clearLightRecognition}"
- **바르도 항해 나침반 지침**: ${report.bardoNavigationGuidance}
- **일일 릭파(자각) 닻 내리기**: ${report.dailyZenAnchor}`;
}
