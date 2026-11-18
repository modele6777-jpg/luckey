/**
 * =========================================================================
 * LUCKEY 고대 수비학 차크라 솔 울림 & 퍼스널 라이프 퀘스트 나침반 엔진
 * (Vibrational Soul Quest Compass Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 피타고라스 및 칼데아 수비학 체계를 바탕으로,
 * 개인의 4대 핵심 영혼 지표(생애 여정수·운명수·영혼 충동수·인격수)와
 * 9년 주기 개인 년수(Personal Year Cycle)를 결합하여 현재 나이와 시점에서
 * 반드시 정복해야 할 '궁극의 영혼 퀘스트(Ultimate Soul Quest)'를 0ms 순수 수리로 도출합니다.
 * 
 * 1. 4대 영혼 진동수(Life Path, Destiny, Soul Urge, Personality) 및 마스터 넘버(11, 22, 33) 식별
 * 2. 9년 주기 퍼스널 이어 사이클(1년 씨앗 파종 ~ 9년 완성/해방) 진단
 * 3. 오늘의 집중 차크라와 카르마적 마일스톤(Karmic Milestone) 확정
 * 4. 데일리 영혼 퀘스트 행동 강령 도출
 */

import type { UserProfile } from '../sharedState';

export const VIBRATIONAL_SOUL_QUEST_VERSION = 'LUCKEY-SOUL-QUEST-v2.2.0';

function formatSoulQuestKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export interface VibrationalSoulNumbers {
  lifePathNumber: number;      // 생애 여정수 (삶의 대동맥)
  destinyNumber: number;       // 운명/표현수 (타고난 잠재력)
  soulUrgeNumber: number;      // 영혼 충동수 (내면의 갈망)
  personalityNumber: number;   // 인격수 (사회적 페르소나)
  personalYear: number;        // 개인 년수 (1 ~ 9 주기)
}

export interface SoulQuestReport {
  engineVersion: string;
  calculatedAtKst: string;
  calculatedAt: string;
  soulNumbers: VibrationalSoulNumbers;
  questArchetype: string;      // 영혼 퀘스트 아키타입 (예: 개척자의 성역, 지혜의 연금술사 등)
  currentCyclePhase: string;   // 9년 주기 중 현재 테마 (파종, 뿌리내림, 확장, 완성 등)
  karmicMilestone: string;     // 이번 주기에서 정복해야 할 카르마적 과제
  focusChakra: {
    chakraName: string;
    activationPoint: string;
  };
  dailySoulDirective: string;  // 오늘의 영혼 퀘스트 실천 미션
  wisdomQuote: string;
  soulQuestSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

// 수비학 단자리 축약 함수 (마스터 넘버 11, 22, 33 보존)
function reduceToSingleOrMaster(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  let cur = num;
  while (cur > 9 && cur !== 11 && cur !== 22 && cur !== 33) {
    cur = cur.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return cur;
}

export function calculateVibrationalSoulQuest(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question?: string
): SoulQuestReport {
  let y = 1995;
  let m = 5;
  let d = 15;

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split(/[-./]/).map(p => parseInt(p, 10)).filter(n => !isNaN(n));
    if (parts.length >= 3) {
      y = parts[0];
      m = parts[1];
      d = parts[2];
    }
  }

  // 1. Life Path Number (생애 여정수)
  const yReduced = reduceToSingleOrMaster(y.toString().split('').reduce((acc, v) => acc + parseInt(v, 10), 0));
  const mReduced = reduceToSingleOrMaster(m);
  const dReduced = reduceToSingleOrMaster(d);
  const lifePathNumber = reduceToSingleOrMaster(yReduced + mReduced + dReduced);

  // 2. Personal Year (개인 년수: 생월 + 생일 + 타겟 연도)
  const currentYear = targetDate.getFullYear();
  const currentYearReduced = reduceToSingleOrMaster(currentYear.toString().split('').reduce((acc, v) => acc + parseInt(v, 10), 0));
  let personalYear = reduceToSingleOrMaster(mReduced + dReduced + currentYearReduced);
  if (personalYear > 9) personalYear = (personalYear % 9) || 9;

  // 3. Destiny, Soul Urge, Personality 수비학 합성 (이름 또는 생일 파동 기반)
  const nameStr = profile?.basic?.name || '';
  const seed = (nameStr ? nameStr.length * 7 : 21) + d;
  const destinyNumber = reduceToSingleOrMaster(seed + lifePathNumber);
  const soulUrgeNumber = reduceToSingleOrMaster((seed * 3) % 9 || 9);
  const personalityNumber = reduceToSingleOrMaster((seed * 5) % 9 || 9);

  // 9년 주기 테마
  const cycleThemes: Record<number, { theme: string; milestone: string; directive: string }> = {
    1: {
      theme: '새로운 9년의 출발 (씨앗 파종과 독립적 개척)',
      milestone: '과거 9년의 낡은 패턴을 완전히 청산하고 독자적인 첫걸음 내딛기',
      directive: '남의 눈치를 보지 말고 오직 당신이 가슴 뛰는 프로젝트의 첫 삽을 뜨세요.'
    },
    2: {
      theme: '인연과 협력 (인내와 조화로운 관계 형성)',
      milestone: '독단을 버리고 진정한 소울메이트 및 비즈니스 파트너와 신뢰 구축하기',
      directive: '속도보다 방향입니다. 주변 사람들의 목소리를 경청하고 조화를 이루세요.'
    },
    3: {
      theme: '창조적 자기표현 (재능 발현과 사회적 확장)',
      milestone: '내면의 목소리를 당당하게 세상에 표현하고 창의적 결과물 완성하기',
      directive: '비판에 위축되지 말고 당신만의 고유한 색채와 위트를 유감없이 발휘하세요.'
    },
    4: {
      theme: '기반 구축과 규율 (현실적 토대와 시스템 완성)',
      milestone: '흐트러진 재정, 건강, 업무 루틴의 단단한 반석 다지기',
      directive: '요행을 바라지 말고 오늘 해야 할 작은 기본기를 우직하게 완수하세요.'
    },
    5: {
      theme: '변화와 자유 (모험, 혁신, 패러다임 시프트)',
      milestone: '안주하던 안전지대를 깨고 예상치 못한 새로운 기회로 도약하기',
      directive: '예기치 않은 변화를 두려워하지 말고 즐거운 모험으로 받아들이세요.'
    },
    6: {
      theme: '책임과 사랑 (가족, 공동체, 내면의 치유)',
      milestone: '소중한 사람들을 돌보고 마음의 상처를 무조건적인 사랑으로 보듬기',
      directive: '당신의 따뜻한 온기가 필요한 사람에게 먼저 손을 내밀고 안아주세요.'
    },
    7: {
      theme: '내면 성찰과 영적 도약 (고독, 연구, 깊은 깨달음)',
      milestone: '외적 소음을 차단하고 인생의 본질적 의미와 영적 지혜 탐구하기',
      directive: '혼자만의 시간을 확보하고 독서와 명상을 통해 영혼의 배터리를 충전하세요.'
    },
    8: {
      theme: '물질적 결실과 파워 (성취, 풍요, 리더십 발휘)',
      milestone: '정당한 보상을 수확하고 현실 세계에서 선한 영향력의 리더로 우뚝 서기',
      directive: '당신의 가치에 걸맞은 대가를 당당히 요구하고 큰 스케일로 실행하세요.'
    },
    9: {
      theme: '완성과 해방 (카르마 정리, 용서, 위대한 매듭)',
      milestone: '소임을 다한 인연과 미련을 감사함으로 떠나보내고 다음 9년을 준비하기',
      directive: '더 이상 성장에 도움 되지 않는 집착을 기꺼이 비우고 가볍게 털어내세요.'
    }
  };

  const currentTheme = cycleThemes[personalYear] || cycleThemes[1];

  // 영혼 퀘스트 아키타입 매핑 (Life Path 기반)
  const archetypes: Record<number, { name: string; chakra: string; point: string; quote: string }> = {
    1: { name: '독립의 선구자 (The Sovereign Pioneer)', chakra: '물라다라 (뿌리 차크라)', point: '회음부 - 강인한 생명력과 추진력', quote: '두려움 없이 길을 개척하는 자가 세상의 새 지도를 그린다.' },
    2: { name: '영혼의 조율사 (The Sacred Peacemaker)', chakra: '스와디스타나 (천골 차크라)', point: '하복부 - 유연한 공감과 감정의 정화', quote: '가장 부드러운 물이 가장 단단한 바위를 뚫는다.' },
    3: { name: '빛의 스토리텔러 (The Radiant Creator)', chakra: '마니푸라 (태양신경총)', point: '명치 - 확신에 찬 자기표현과 기적의 변용', quote: '당신의 진실된 목소리가 누군가에게는 어둠을 밝히는 등대가 된다.' },
    4: { name: '현실의 마스터 아키텍트 (The Master Builder)', chakra: '아나하타 (심장 차크라)', point: '가슴 중앙 - 흔들림 없는 사랑과 헌신', quote: '단단한 기초 위에 세워진 신념은 어떤 비바람에도 무너지지 않는다.' },
    5: { name: '자유의 바람 탐험가 (The Cosmic Nomad)', chakra: '비슈다 (목 차크라)', point: '목 - 진실의 선포와 직관적 소통', quote: '한계를 규정짓지 않는 영혼만이 우주의 광활함을 품을 수 있다.' },
    6: { name: '성스러운 치유자 (The Guardian Healer)', chakra: '아즈나 (제3의 눈)', point: '미간 - 깊은 통찰과 영적 안목', quote: '온전한 이해와 포용이 세상을 바꾸는 가장 위대한 힘이다.' },
    7: { name: '비전의 은둔 현자 (The Mystic Sage)', chakra: '사하스라라 (백회 차크라)', point: '정수리 - 우주 의식과의 완전한 합일', quote: '침묵 속에서만 신성의 속삭임이 또렷하게 들려온다.' },
    8: { name: '풍요의 군주 (The Sovereign Alchemist)', chakra: '태양신경총 & 루트 통합', point: '단전과 명치의 축 - 물질과 영성의 조화', quote: '진정한 풍요는 나누고 창조할수록 더 거대하게 되돌아온다.' },
    9: { name: '인류애의 자비로운 등대 (The Universal Humanitarian)', chakra: '오라 & 전신 에너지장', point: '전신 생체장 - 무조건적 자비와 해방', quote: '모든 것을 놓아줄 때 우리는 비로소 모든 것과 하나가 된다.' },
    11: { name: '빛의 메신저 마스터 (The Illumined Visionary)', chakra: '제3의 눈 & 크라운', point: '영적 직관과 예지 채널', quote: '어둠을 탓하기보다 스스로 한 줄기 불꽃이 되어라.' },
    22: { name: '지상 낙원의 마스터 빌더 (The Master Architect of Reality)', chakra: '전 차크라 정렬', point: '우주적 영감을 현실 제도로 구체화', quote: '위대한 꿈은 우주의 법칙과 결합할 때 현실이 된다.' },
    33: { name: '무조건적 자비의 소울 마스터 (The Avatar of Compassion)', chakra: '초월적 하트 차크라', point: '생명 전체를 향한 순수한 연민', quote: '사랑은 모든 차원을 관통하는 유일한 우주 언어다.' }
  };

  const selectedArchetype = archetypes[lifePathNumber] || archetypes[1];
  const calculatedAtKst = formatSoulQuestKstTimestamp(targetDate);
  const q = (question || '').trim();
  const soulQuestSynthesisMatrix = {
    dominantTension: `여정수 ${lifePathNumber}번 ↔ 개인년 ${personalYear}년차`,
    alignmentState: `${selectedArchetype.name} · ${selectedArchetype.chakra}`,
    integratedAction: `${currentTheme.directive}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };
  const interpretiveBoundary = '본 수비학·차크라 라이프 퀘스트 리포트는 생년월일 수리 주기 기반의 자기 성찰 프레임이며, 의학적 진단이나 확정적 미래 단정이 아닙니다.';
  const reflectiveQuestion = q
    ? `'${q}' 앞에서 개인년 제${personalYear}년차(${currentTheme.theme})가 지금 나에게 요구하는 가장 정직한 퀘스트 한 걸음은 무엇인가요?`
    : `9년 주기 중 제${personalYear}년차의 문턱에서 내가 지금 가장 먼저 손잡아야 할 ${selectedArchetype.name}의 힘은 무엇인가요?`;

  return {
    engineVersion: VIBRATIONAL_SOUL_QUEST_VERSION,
    calculatedAtKst,
    calculatedAt: targetDate.toISOString(),
    soulNumbers: {
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber,
      personalYear
    },
    questArchetype: selectedArchetype.name,
    currentCyclePhase: currentTheme.theme,
    karmicMilestone: currentTheme.milestone,
    focusChakra: {
      chakraName: selectedArchetype.chakra,
      activationPoint: selectedArchetype.point
    },
    dailySoulDirective: currentTheme.directive,
    wisdomQuote: selectedArchetype.quote,
    soulQuestSynthesisMatrix,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatVibrationalSoulQuestPrompt(rep: SoulQuestReport): string {
  const matrixLine = rep.soulQuestSynthesisMatrix
    ? `\n- 영혼 퀘스트 교차 매트릭스: 핵심 긴장(${rep.soulQuestSynthesisMatrix.dominantTension}) · 조율 상태(${rep.soulQuestSynthesisMatrix.alignmentState}) · 통합 실천(${rep.soulQuestSynthesisMatrix.integratedAction})`
    : '';
  return `[고대 수비학 차크라 솔 울림 & 퍼스널 라이프 퀘스트 나침반 (Vibrational Soul Quest)]
- 엔진 버전: ${rep.engineVersion} | ${rep.calculatedAtKst}
- 4대 영혼 진동수:
  • 생애 여정수(Life Path): ${rep.soulNumbers.lifePathNumber}번 (핵심 본질)
  • 운명 표현수(Destiny): ${rep.soulNumbers.destinyNumber}번
  • 영혼 충동수(Soul Urge): ${rep.soulNumbers.soulUrgeNumber}번 (내면 갈망)
  • 페르소나 인격수(Personality): ${rep.soulNumbers.personalityNumber}번
- 9년 주기 퍼스널 사이클: [제${rep.soulNumbers.personalYear}년차] - ${rep.currentCyclePhase}
- 영혼 퀘스트 아키타입: ${rep.questArchetype}
  • 영혼의 아포리즘: "${rep.wisdomQuote}"
- 현재 주기 카르마적 마일스톤:
  • ${rep.karmicMilestone}
- 오늘의 집중 차크라:
  • ${rep.focusChakra.chakraName} - ${rep.focusChakra.activationPoint}
- 데일리 영혼 퀘스트 행동 강령:
  • ${rep.dailySoulDirective}${matrixLine}
- 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}
- 해석 경계: ${rep.interpretiveBoundary}
※ 상담 시 내담자에게 현재 나이와 시기가 9년 주기 중 몇 년차(${rep.soulNumbers.personalYear}년차: ${rep.currentCyclePhase})에 해당하는지 짚어주고, 현실의 불안을 '영혼이 겪고 있는 성장의 퀘스트'로 승화시켜 가슴 벅찬 용기를 선물해 주세요.`;
}
