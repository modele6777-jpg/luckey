/**
 * 고대 마야 포폴 부(Popol Vuh) 쌍둥이 영웅 & 시발바 지하세계 돌파 엔진 (Popol Vuh Hero Twins Engine)
 *
 * 마야 키체 신화의 정수인 포폴 부에서 쌍둥이 영웅 후나푸(Hunahpu)와 슈발랑케(Xbalanque)가
 * 지하세계 시발바(Xibalba)의 6대 죽음의 시련의 집을 기지와 트릭스터 지혜로 극복하고 태양과 달로 부활한 신화를
 * 질문 맥락에 반응하는 정성적 성찰과 유연한 위기 전환 지침으로 연결합니다.
 */

export const MESOAMERICAN_POPOL_VUH_ENGINE_VERSION = 'LUCKEY-POPOL-VUH-HERO-TWINS-v2.3.0';

export type PopolVuhQuestionTheme = 'relationship' | 'decision' | 'healing' | 'reflection';

export type PopolVuhTransformationPhase =
  | 'UNDERWORLD_TRIAL'
  | 'CLEVER_REVERSAL'
  | 'ASH_REBIRTH'
  | 'SOLAR_LUNAR_ASCENT';

export interface PopolVuhReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTheme: PopolVuhQuestionTheme;
  heroicPhase: string;
  shadowWarning: string;
  activeTrialHouse: {
    houseNumber: number;
    houseNameKo: string;
    houseNameMaya: string;
    coreHazard: string;
    heroicCounterStrategy: string;
  };
  companionTrialHouse: {
    houseNumber: number;
    houseNameKo: string;
    houseNameMaya: string;
    coreHazard: string;
    heroicCounterStrategy: string;
  };
  twinArchetype: {
    twinName: string;
    celestialSymbol: string;
    wisdomFocus: string;
  };
  transformationPhase: PopolVuhTransformationPhase;
  tricksterResilienceScore: number; // 내부 호환용
  heroicTransformationVerdict: string;
  underworldVictoryRule: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  popolVuhSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatPopolVuhKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describePopolVuhStage(phase: PopolVuhTransformationPhase): string {
  switch (phase) {
    case 'SOLAR_LUNAR_ASCENT':
      return '태양과 달의 비상(Solar-Lunar Ascent) — 시발바의 어둠을 건너 새벽빛으로 도약하는 개화기';
    case 'ASH_REBIRTH':
      return '재 속의 부활(Ash Rebirth) — 낡은 틀을 태우고 새로운 형태로 거듭나는 전환기';
    case 'CLEVER_REVERSAL':
      return '트릭스터 반전(Clever Reversal) — 정면 충돌 대신 기지와 유머로 판을 뒤집는 묘수기';
    default:
      return '시발바 관문 통과(Underworld Trial) — 흔들리지 않는 숨과 관찰로 시련의 방을 건너는 인내기';
  }
}

const POPOL_VUH_HEROIC_PHASES = [
  '시발바 관찰(어둠의 관문 규칙을 먼저 파악하고 섣부른 정면 충돌을 피하는 시기)',
  '트릭스터 전환(유머와 기지, 작은 우회로로 불리한 판을 유리하게 뒤집는 시기)',
  '새벽 부활(시련의 재를 털고 태양과 달의 명료한 시야로 다시 솟구치는 시기)',
] as const;

const POPOL_VUH_SHADOW_WARNINGS = [
  '기지와 우회 전략이 문제를 정직하게 마주해야 할 순간까지 회피하는 습관으로 흐르지 않도록 살피세요.',
  '시련을 견디기 위해 두른 방어적 유머가 진심으로 도움을 요청할 틈까지 가리지 않도록 점검하세요.',
  '위기를 돌파한 뒤에도 방심하여 새로운 교만이나 성급함의 함정에 빠지지 않도록 호흡을 고르세요.',
] as const;

const XIBALBA_HOUSES = [
  {
    houseNumber: 1,
    houseNameKo: '흑암의 집',
    houseNameMaya: 'Quequma-ha (Dark House)',
    coreHazard: '완전한 칠흑의 어둠 속에서 방향을 잃고 공포에 휩싸이는 시험',
    heroicCounterStrategy: '빛이 없는 곳에서도 반딧불이의 날개와 내면의 직관으로 길을 비추는 지혜',
  },
  {
    houseNumber: 2,
    houseNameKo: '면도날의 집',
    houseNameMaya: 'Chayim-ha (Razor House)',
    coreHazard: '사방에서 날아드는 날카로운 칼날과 공격적인 비난에 베이는 고통',
    heroicCounterStrategy: '날들과 대화하여 날을 무디게 만들고 적의 공격을 부드럽게 흘려보내는 유연성',
  },
  {
    houseNumber: 3,
    houseNameKo: '혹한의 집',
    houseNameMaya: 'Xuxulim-ha (Cold House)',
    coreHazard: '뼛속까지 얼어붙는 차가운 외로움과 고립감의 냉기',
    heroicCounterStrategy: '내면의 솔방울 불씨를 지피고 체온을 나누며 끝까지 생명력을 지키는 온기',
  },
  {
    houseNumber: 4,
    houseNameKo: '재규어의 집',
    houseNameMaya: 'Balami-ha (Jaguar House)',
    coreHazard: '으르렁거리는 맹수들의 굶주린 이빨과 공격적인 경쟁자들의 압박',
    heroicCounterStrategy: '고기 대신 뼈다귀를 던져 맹수들의 주의를 돌리고 우아하게 통과하는 기지',
  },
  {
    houseNumber: 5,
    houseNameKo: '화염의 집',
    houseNameMaya: 'Ratinche-ha (Fire House)',
    coreHazard: '에고를 활활 태워버리는 격렬한 분노와 타오르는 화염의 열기',
    heroicCounterStrategy: '불에 타지 않는 영혼의 무결성으로 불꽃을 통과하여 금을 제련하는 연금술',
  },
  {
    houseNumber: 6,
    houseNameKo: '박쥐의 집',
    houseNameMaya: 'Zotzi-ha (Bat House)',
    coreHazard: '죽음의 박쥐 카마소츠의 기습적인 목 베기와 무자비한 습격',
    heroicCounterStrategy: '바람총의 거북 등껍질 속에 몸을 숨겨 폭풍우를 견디고 동이 틀 때 태양으로 솟구치는 인내',
  },
];

const TWIN_ARCHETYPES = [
  {
    twinName: '후나푸 (Hunahpu · 태양의 형)',
    celestialSymbol: '새벽을 여는 명료한 태양과 정면 돌파의 시선',
    wisdomFocus: '혼란의 한가운데서도 본질을 꿰뚫어 보고 두려움 없이 다음 수를 준비하는 명석함',
  },
  {
    twinName: '슈발랑케 (Xbalanque · 달의 아우)',
    celestialSymbol: '밤의 어둠을 역이용하는 은빛 달과 트릭스터의 기지',
    wisdomFocus: '정면 충돌 대신 판을 뒤집는 유머와 우회적 변신으로 위기를 기회로 바꾸는 유연함',
  },
];

function classifyPopolVuhTheme(question: string): PopolVuhQuestionTheme {
  if (/(연애|사랑|관계|배우자|결혼|이별|친구|가족|동료|사람|갈등)/.test(question)) return 'relationship';
  if (/(이직|취업|사업|계약|돈|투자|선택|결정|진로|시험|합격|계획)/.test(question)) return 'decision';
  if (/(불안|우울|지침|스트레스|건강|수면|마음|회복|위로|휴식|힘들)/.test(question)) return 'healing';
  return 'reflection';
}

function buildPopolVuhQualitativeFields(
  house: (typeof XIBALBA_HOUSES)[number],
  twin: (typeof TWIN_ARCHETYPES)[number],
  theme: PopolVuhQuestionTheme
) {
  const themeMap: Record<PopolVuhQuestionTheme, {
    practice: string;
    ritual: string;
    reflection: string;
    counsel: string;
  }> = {
    relationship: {
      practice: `${house.houseNameKo}의 압박 앞에서는 상대를 정면으로 꺾으려 들지 마세요. ${twin.twinName}의 시선으로 날 선 말 사이에 작은 여백과 유머를 두면 팽팽한 긴장이 저절로 풀립니다.`,
      ritual: '오늘 대화가 어긋날 것 같은 순간에는 바로 대꾸하지 말고, 물 한 모금을 마시며 상대의 진짜 두려움이 무엇인지 한 번만 헤아려 보세요.',
      reflection: '지금 이 관계의 긴장 속에서 내가 꼭 지켜야 할 진심과, 가볍게 흘려보내도 될 자존심은 각각 무엇인가요?',
      counsel: `${house.houseNameKo}의 시험은 관계의 칼날을 힘으로 누르는 대신 지혜롭게 방향을 트는 유연함을 묻고 있습니다.`,
    },
    decision: {
      practice: `지금의 선택지는 정공법 하나만 있는 것이 아닙니다. ${house.heroicCounterStrategy}처럼, 상대와 환경이 예측하지 못한 작은 우회로와 대안 시나리오를 하나 더 그려보세요.`,
      ritual: '중요한 결정을 내리기 전 종이에 가장 피하고 싶은 시나리오 하나를 적고, 그것을 거꾸로 뒤집어 유리하게 쓰는 방법을 3줄로 써보세요.',
      reflection: '남들이 정해둔 시발바의 규칙 안에서만 싸우고 있지는 않은지, 판 자체를 바꿀 수 있는 나만의 강점은 무엇인가요?',
      counsel: `${twin.twinName}의 기지는 정면 승부가 불리할 때 규칙을 재해석해 판을 뒤집는 창조적 결단을 권합니다.`,
    },
    healing: {
      practice: `어둠과 냉기가 몰려올수록 불씨를 밖에서 찾지 말고 내면의 작은 온기를 먼저 지켜야 합니다. ${house.heroicCounterStrategy}의 태도로 오늘 하루는 스스로를 몰아세우지 마세요.`,
      ritual: '잠들기 전 조명을 한 단계 낮추고, 오늘 하루 버텨낸 내 몸의 긴장을 어깨부터 천천히 내려놓는 3분 호흡을 해보세요.',
      reflection: '지금 나를 가장 지치게 만드는 시련의 방은 외부의 사건인가요, 아니면 내 안의 엄격한 재촉인가요?',
      counsel: `쌍둥이 영웅도 시련의 방을 단숨에 부수지 않고 쉼과 기다림을 통해 새벽을 맞았음을 기억하세요.`,
    },
    reflection: {
      practice: `지금 마주한 난관은 끝이 아니라 통과 의례입니다. ${house.houseNameKo}의 그림자를 직시하되, ${twin.wisdomFocus}을 떠올리며 한 걸음 떨어져 전체 판을 바라보세요.`,
      ritual: '오늘 하루 동안 가장 막막하게 느껴졌던 일 하나를 골라, "이 상황이 나에게 어떤 새로운 기술을 가르치려 하는가?"를 한 문장으로 적어보세요.',
      reflection: '이 시련을 통과하고 난 뒤의 나는 어떤 새로운 빛과 여유를 갖게 될까요?',
      counsel: `포폴 부의 시발바 서사는 어둠 속에서도 기지를 잃지 않는 자가 결국 새로운 태양과 달로 떠오른다는 상징을 전합니다.`,
    },
  };

  return themeMap[theme];
}

export function calculatePopolVuhHeroTwins(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): PopolVuhReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = (params.question || '').trim();
  const questionTheme = classifyPopolVuhTheme(question);

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 19);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 41;
  }
  seed += now.getDate() * 31 + now.getMonth() * 71;

  const houseIdx = Math.abs(seed) % XIBALBA_HOUSES.length;
  const companionOffset = 1 + (Math.abs(seed * 5) % (XIBALBA_HOUSES.length - 1));
  const activeTrialHouse = XIBALBA_HOUSES[houseIdx];
  const companionTrialHouse = XIBALBA_HOUSES[(houseIdx + companionOffset) % XIBALBA_HOUSES.length];
  const twinArchetype = TWIN_ARCHETYPES[Math.abs(seed) % TWIN_ARCHETYPES.length];
  const heroicPhase = POPOL_VUH_HEROIC_PHASES[Math.abs(seed * 11) % POPOL_VUH_HEROIC_PHASES.length];
  const shadowWarning = POPOL_VUH_SHADOW_WARNINGS[Math.abs(seed * 13) % POPOL_VUH_SHADOW_WARNINGS.length];

  const phases: PopolVuhTransformationPhase[] = [
    'UNDERWORLD_TRIAL',
    'CLEVER_REVERSAL',
    'ASH_REBIRTH',
    'SOLAR_LUNAR_ASCENT',
  ];
  const transformationPhase = phases[Math.abs(seed * 3) % phases.length];

  const tricksterResilienceScore = 68 + (Math.abs(seed * 7) % 31);
  const qualitative = buildPopolVuhQualitativeFields(activeTrialHouse, twinArchetype, questionTheme);

  const heroicTransformationVerdict = `${activeTrialHouse.houseNameKo}의 시험을 ${twinArchetype.twinName}의 기지로 건너 새벽빛으로 도약하는 전환 국면`;
  const underworldVictoryRule = qualitative.practice;

  const calculatedAtKst = formatPopolVuhKstTimestamp(now);
  const popolVuhSynthesisMatrix = {
    dominantTension: `${activeTrialHouse.houseNameKo} ↔ ${companionTrialHouse.houseNameKo} · ${twinArchetype.twinName}`,
    alignmentState: describePopolVuhStage(transformationPhase),
    integratedAction: `${qualitative.practice} (${heroicPhase})${question ? ` [질문 맥락: ${question}]` : ''}`,
  };

  const reflectiveQuestion = question
    ? `'${heroicPhase}' 국면에서 지금 "${question}" 앞에서 ${activeTrialHouse.houseNameKo}의 시련을 ${twinArchetype.twinName}의 기지로 전환하기 위해 내가 먼저 시도할 우회로는 무엇인가요?`
    : `'${heroicPhase}' 국면에서 ${qualitative.reflection}`;

  return {
    engineVersion: MESOAMERICAN_POPOL_VUH_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTheme,
    heroicPhase,
    shadowWarning,
    activeTrialHouse,
    companionTrialHouse,
    twinArchetype,
    transformationPhase,
    tricksterResilienceScore,
    heroicTransformationVerdict,
    underworldVictoryRule,
    practiceGuidance: `${qualitative.practice} (${heroicPhase})`,
    ritualAction: `${qualitative.ritual} (${heroicPhase})`,
    reflectionFocus: qualitative.reflection,
    reflectiveQuestion,
    counselNote: qualitative.counsel,
    boundaryNotice: '마야 포폴 부 쌍둥이 영웅 상징은 우열을 가르는 점수가 아니라 위기를 유연하게 전환하기 위한 정성적 성찰 프레임입니다.',
    popolVuhSynthesisMatrix,
    interpretiveBoundary: '마야 포폴 부 쌍둥이 영웅 상징은 우열을 가르는 점수가 아니라 위기를 유연하게 전환하기 위한 정성적 성찰 프레임입니다.',
  };
}

export function formatPopolVuhHeroTwinsPrompt(report: PopolVuhReport): string {
  const h = report.activeTrialHouse;
  const lines = [
    `### 🐆 고대 마야 포폴 부(Popol Vuh) 쌍둥이 영웅 & 시발바 시련 돌파 실측 데이터 (${report.engineVersion})`,
    `- **연산 시각**: ${report.calculatedAtKst} | **질문 맥락 & 변모 국면**: ${report.questionTheme} · ${describePopolVuhStage(report.transformationPhase)}`,
    `- **영웅적 돌파 국면**: ${report.heroicPhase}`,
    `- **현재 돌파 중인 시련의 방**: 제${h.houseNumber}관문 - ${h.houseNameKo} (${h.houseNameMaya})`,
    `- **연계 시련의 방**: 제${report.companionTrialHouse.houseNumber}관문 - ${report.companionTrialHouse.houseNameKo} (${report.companionTrialHouse.houseNameMaya})`,
    `- **조응하는 쌍둥이 영웅**: ${report.twinArchetype.twinName} (${report.twinArchetype.celestialSymbol})`,
    `- **과잉·경계 점검**: ${report.shadowWarning}`,
    `- **직면한 핵심 위기 요인**: ${h.coreHazard}`,
    `- **영웅들의 트릭스터 돌파 전략**: ${h.heroicCounterStrategy}`,
    `- **영혼의 변모 판정**: ${report.heroicTransformationVerdict}`,
    `- **실천 조언**: ${report.practiceGuidance}`,
    `- **일상 의례**: ${report.ritualAction}`,
    `- **성찰 질문**: ${report.reflectionFocus}`,
    `- **질문 맞춤 성찰 질문**: ${report.reflectiveQuestion}`,
    `- **조언 요약**: ${report.counselNote}`,
    `- **해석 경계**: ${report.boundaryNotice}`,
  ];
  if (report.popolVuhSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.popolVuhSynthesisMatrix.dominantTension} | 조율 상태: ${report.popolVuhSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.popolVuhSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
