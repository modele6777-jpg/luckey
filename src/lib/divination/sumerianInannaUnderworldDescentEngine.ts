/**
 * 고대 수메르 이난나(Inanna) 명계 하강 7대 관문 & 영혼 부활 엔진 (sumerianInannaUnderworldDescentEngine.ts)
 *
 * 기원전 2000년 메소포타미아 수메르 점토판 원전 《이난나의 명계 하강(Inanna's Descent to the Netherworld)》 기반:
 * 천상과 지상의 여왕 이난나가 심연의 여왕이자 그림자 자매인 에레슈키갈(Ereshkigal)의 영역 쿠르(Kur)로 내려가며,
 * 7대 관문에서 7대 메(Me)와 왕관·목걸이·가슴판 등 외적 에고의 페르소나를 전면 탈각(Sacred Stripping)하고,
 * 완전한 상징적 죽음의 영점(Zero Point)을 거쳐 엔키 신의 생명의 풀과 생명의 물(Food & Water of Life)로 부활하는
 * 영혼의 연금술적 재생 및 그림자 통합 엔진.
 */

import type { UserProfile } from '../sharedState';

export const SUMERIAN_INANNA_UNDERWORLD_DESCENT_ENGINE_VERSION = '2.4.0';

export type InannaQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';
export type InannaDescentPhase = 'THRESHOLD_DESCENT' | 'ZERO_POINT_SUSPENSION' | 'ENKI_REVIVAL';

export interface UnderworldGate {
  gateNumber: number;
  gateName: string;
  relicStripped: string;
  shadowPersona: string;
  purificationTheme: string;
  passageScore: number; // 내부 정렬용 (0 ~ 100)
}

export interface SumerianInannaUnderworldDescentReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  underworldSevenGatesPassRate: number;
  spiritualResurrectionVitality: number;
  ereshkigalShadowReconciliation: number;
  foodOfLifeWaterOfLifeResonance: number;
  gates: UnderworldGate[];
  currentCrucialGate: UnderworldGate;
  questionTopic: InannaQuestionTopic;
  descentPhase: InannaDescentPhase;
  descentPhaseLabel: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  inannaResurrectionGuidance: string;
  enkiLifeRestorationRitual: string;
  inannaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    inannaCrossAxis: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function formatInannaKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

const UNDERWORLD_GATES_BASE: Omit<UnderworldGate, 'passageScore'>[] = [
  {
    gateNumber: 1,
    gateName: '간지르 관문',
    relicStripped: '사막의 슈구라 왕관',
    shadowPersona: '세속적 타이틀과 사회적 인정에 기댄 자부심',
    purificationTheme: '직함이나 지위 없이도 빛나는 순수 영혼의 고유성 회복',
  },
  {
    gateNumber: 2,
    gateName: '라피스 관문',
    relicStripped: '청옥 구슬 목걸이',
    shadowPersona: '지적 우월감, 논리적 합리화와 언어적 통제',
    purificationTheme: '머리로만 이해하려던 태도를 내려놓고 침묵의 진실 마주하기',
  },
  {
    gateNumber: 3,
    gateName: '가슴판 관문',
    relicStripped: '쌍둥이 달걀형 가슴판',
    shadowPersona: '상처받지 않으려 가슴 주변에 쌓아 올린 방어벽',
    purificationTheme: '취약함을 온전히 인정할 때 열리는 절대 안전의 가슴',
  },
  {
    gateNumber: 4,
    gateName: '황금 관문',
    relicStripped: '황금 가슴받이',
    shadowPersona: '결과를 내 손으로 쥐고 흔들어야 한다는 결핍적 통제욕',
    purificationTheme: '삶의 흐름에 의식을 온전히 맡기는 궁극의 순복',
  },
  {
    gateNumber: 5,
    gateName: '청동 팔찌 관문',
    relicStripped: '청동 팔찌와 가락지',
    shadowPersona: '끊임없이 뭔가를 조작하고 채워 넣으려는 분주한 손',
    purificationTheme: '행위를 멈추고 존재 자체로 온전해지기',
  },
  {
    gateNumber: 6,
    gateName: '척도 관문',
    relicStripped: '청옥 척도와 측량 끈',
    shadowPersona: '타인과 나를 잴 때 쓰는 비교와 채점의 자',
    purificationTheme: '모든 평가를 거두고 있는 그대로의 완전성 긍정',
  },
  {
    gateNumber: 7,
    gateName: '팔라 예복 관문',
    relicStripped: '여왕의 성스러운 팔라 예복',
    shadowPersona: '마지막 남은 자아 방어선과 외적 이미지',
    purificationTheme: '모든 가면을 벗어던진 영점에서 맞이하는 신성한 재탄생',
  },
];

function classifyInannaQuestionTopic(question: string): InannaQuestionTopic {
  if (/연애|사랑|관계|이별|재회|갈등|상대|사람|친구|가족|부부|직장동료/.test(question)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|투자|계약|시험|진로|방향|옮길|할까|말까/.test(question)) {
    return 'decision';
  }
  if (/치유|회복|불안|지침|슬픔|분노|상처|우울|번아웃|스트레스|두려움|그림자/.test(question)) {
    return 'healing';
  }
  return 'reflection';
}

const TOPIC_PRACTICE_GUIDANCE: Record<InannaQuestionTopic, string> = {
  relationship: '상대에게 보여 주던 역할과 방어적 가면을 잠시 내려놓고, 솔직한 취약함과 본심을 먼저 인정할 때 관계의 매듭이 풀립니다.',
  decision: '체면이나 남의 시선 때문에 붙들고 있던 부수적 조건을 덜어낸 뒤, 가장 본질적인 기준 하나만 남기고 결단하십시오.',
  healing: '억지로 강해 보이려 애쓰기보다 지친 감정을 에레슈키갈의 어둠 앞에 그대로 내려놓을 때 비로소 재생의 숨결이 들어옵니다.',
  reflection: '외부의 인정이나 분주한 성취를 잠시 멈추고, 아무 직함도 없는 순수한 나 자신과 고요히 마주 앉아 보십시오.',
};

const TOPIC_RITUAL_ACTION: Record<InannaQuestionTopic, string> = {
  relationship: '오늘 대화에서는 상대를 설득하려는 논리 대신 내가 지금 두려워하거나 바라는 솔직한 감정 한 줄을 먼저 건네 보십시오.',
  decision: '고민 중인 선택지 옆에 적힌 체면과 비교의 조건을 지우고, 아무도 보지 않는다면 무엇을 택할지 한 문장으로 적어 보십시오.',
  healing: '찬물 한 잔을 천천히 마시며 어깨에 들어간 힘을 풀고, 오늘 하루만큼은 나를 다그치는 내면의 비판을 쉬게 하십시오.',
  reflection: '잠들기 전 조명을 낮추고 오늘 내가 쓰고 있던 사회적 가면 하나를 떠올린 뒤, 조용히 내려놓는 호흡을 세 번 이어 가십시오.',
};

const TOPIC_REFLECTION_FOCUS: Record<InannaQuestionTopic, string> = {
  relationship: '지금 이 관계에서 상처받지 않기 위해 내가 두르고 있는 가장 두꺼운 갑옷은 무엇인가요?',
  decision: '이 선택에서 체면과 평가의 잣대를 모두 걷어낸다면, 가장 선명하게 남는 핵심은 무엇인가요?',
  healing: '외면하고 싶었던 내 안의 서운함과 피로를 있는 그대로 바라볼 때 어떤 위로가 가장 필요한가요?',
  reflection: '모든 직함과 역할을 벗어던진 자리에서 여전히 변하지 않는 나만의 진실은 무엇인가요?',
};

const DESCENT_PHASE_LABELS: Record<InannaDescentPhase, string> = {
  THRESHOLD_DESCENT: '관문 하강기 — 불필요한 외적 갑옷과 페르소나를 하나씩 내려놓는 정화의 문턱',
  ZERO_POINT_SUSPENSION: '영점 머무름 — 기존의 통제와 판단이 멈추고 본질적 침묵 속에서 새 숨을 기다리는 전환점',
  ENKI_REVIVAL: '생명수 부활기 — 그림자와의 화해를 마치고 한층 가벼워진 존재감으로 지상에 복귀하는 회복기',
};

export interface SumerianInannaUnderworldDescentOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateSumerianInannaUnderworldDescent(
  optionsOrProfile?: SumerianInannaUnderworldDescentOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): SumerianInannaUnderworldDescentReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as SumerianInannaUnderworldDescentOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

  let seed = 37199;
  const seedStr = `${bdate}|${btime}|${kstDate}|${question}`;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) % 1000003;
  }

  const gates: UnderworldGate[] = UNDERWORLD_GATES_BASE.map((gate, idx) => {
    const score = 38 + ((seed * (idx + 5) + idx * 23) % 60);
    return { ...gate, passageScore: Math.min(99, Math.max(30, score)) };
  });

  const sortedGates = [...gates].sort((a, b) => a.passageScore - b.passageScore);
  const currentCrucialGate = sortedGates[0];

  const totalPass = gates.reduce((acc, g) => acc + g.passageScore, 0);
  const underworldSevenGatesPassRate = Math.min(100, Math.max(35, Math.floor(totalPass / gates.length)));
  const spiritualResurrectionVitality = Math.min(100, Math.max(42, 54 + ((seed * 19) % 44)));
  const ereshkigalShadowReconciliation = Math.min(100, Math.max(40, 50 + ((seed * 31) % 48)));
  const foodOfLifeWaterOfLifeResonance = Math.min(100, Math.max(45, Math.floor(spiritualResurrectionVitality * 0.5 + ereshkigalShadowReconciliation * 0.5)));

  const questionTopic = classifyInannaQuestionTopic(question);
  const phases: InannaDescentPhase[] = ['THRESHOLD_DESCENT', 'ZERO_POINT_SUSPENSION', 'ENKI_REVIVAL'];
  const descentPhase = phases[seed % phases.length];
  const descentPhaseLabel = DESCENT_PHASE_LABELS[descentPhase];

  const practiceGuidance = `${currentCrucialGate.purificationTheme}에 마음을 두십시오. ${TOPIC_PRACTICE_GUIDANCE[questionTopic]}`;
  const ritualAction = TOPIC_RITUAL_ACTION[questionTopic];
  const reflectionFocus = TOPIC_REFLECTION_FOCUS[questionTopic];
  const boundaryNotice = '이 관점은 고대 수메르 신화의 탈각과 재생 상징을 빌려 현재 마음의 방어기제를 비추는 정성적 성찰이며, 우열의 점수나 확정적 예언이 아닙니다.';

  const inannaResurrectionGuidance = `명계의 일곱 관문 중 지금 가장 깊이 비추어 볼 지점은 ${currentCrucialGate.gateName}입니다. ${currentCrucialGate.relicStripped}을 내려놓듯 ${currentCrucialGate.shadowPersona}를 거둘 때 어둠과의 화해와 회복이 열립니다.`;
  const enkiLifeRestorationRitual = TOPIC_RITUAL_ACTION[questionTopic];

  const calculatedAtKst = formatInannaKstTimestamp(now);
  const inannaCrossAxis = `[${currentCrucialGate.gateName}] × [${currentCrucialGate.relicStripped}] × [${descentPhase}] × [${questionTopic}]`;
  const inannaSynthesisMatrix = {
    dominantTension: `${currentCrucialGate.gateName}(${currentCrucialGate.relicStripped}) ↔ ${currentCrucialGate.shadowPersona}`,
    alignmentState: `${descentPhaseLabel}`,
    integratedAction: `${ritualAction}${question ? ` [질문 맥락: ${question}]` : ''}`,
    inannaCrossAxis,
  };

  const trimmedQ = question.trim();
  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}' 앞에서 ${currentCrucialGate.gateName}을 지나며 내가 가장 먼저 벗어 놓을 수 있는 ${currentCrucialGate.shadowPersona}는 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: SUMERIAN_INANNA_UNDERWORLD_DESCENT_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    underworldSevenGatesPassRate,
    spiritualResurrectionVitality,
    ereshkigalShadowReconciliation,
    foodOfLifeWaterOfLifeResonance,
    gates,
    currentCrucialGate,
    questionTopic,
    descentPhase,
    descentPhaseLabel,
    practiceGuidance,
    ritualAction,
    reflectionFocus,
    boundaryNotice,
    inannaResurrectionGuidance,
    enkiLifeRestorationRitual,
    inannaSynthesisMatrix,
    reflectiveQuestion,
    interpretiveBoundary: boundaryNotice,
  };
}

export function formatSumerianInannaUnderworldDescentPrompt(rep: SumerianInannaUnderworldDescentReport): string {
  const lines = [
    `[고대 수메르 이난나 명계 하강 7대 관문 & 부활 실측 데이터 (v${rep.engineVersion} | ${rep.calculatedAtKst})]`,
    `· 하강 국면: ${rep.descentPhaseLabel}`,
    `· 현재 직면한 핵심 탈각 관문: ${rep.currentCrucialGate.gateName} (${rep.currentCrucialGate.relicStripped})`,
    `  - 직면 그림자: ${rep.currentCrucialGate.shadowPersona}`,
    `  - 정화 과제: ${rep.currentCrucialGate.purificationTheme}`,
    `· 실천 조언: ${rep.practiceGuidance}`,
    `· 일상 의례: ${rep.ritualAction}`,
    `· 성찰 질문: ${rep.reflectionFocus}`,
    `· 해석 경계: ${rep.boundaryNotice}`,
  ];
  if (rep.inannaSynthesisMatrix) {
    lines.push(
      `· 교차 매트릭스: [핵심 긴장: ${rep.inannaSynthesisMatrix.dominantTension} | 조율 상태: ${rep.inannaSynthesisMatrix.alignmentState}]`,
      `  - 4중 교차 축: ${rep.inannaSynthesisMatrix.inannaCrossAxis}`,
      `  - 통합 실천: ${rep.inannaSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}`);
  return lines.join('\n');
}
