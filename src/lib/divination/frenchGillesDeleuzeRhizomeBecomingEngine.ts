/**
 * 프랑스 질 들뢰즈(Gilles Deleuze) 《천 개의 고원(Mille Plateaux)》 & 《차이와 반복(Différence et Répétition)》 리좀적접속 & 탈영토화·생성(Devenir) 지혜 엔진
 *
 * 20세기 후반 현대 프랑스 철학의 거장 질 들뢰즈(Gilles Deleuze, 1925~1995)와 펠릭스 과타리(Félix Guattari)의
 * 불후의 대표 저술 《천 개의 고원(Mille Plateaux)》 및 《차이와 반복(Différence et Répétition)》 원전 기반:
 * 1. 리좀적 수평 접속 및 탈중심 네트워크 역량 (Rhizomatic Connection & Pluralism): 수목형(위계적·수직적) 모델을 넘어 중심 없이 사방으로 뻗어 나가며 이질적인 것들을 엮어내는 힘.
 * 2. 탈영토화 및 노마딕 경계 확장 결단력 (Deterritorialization & Nomadic Freedom): 고착된 틀과 제도화된 영역을 과감히 벗어나 새로운 가능성의 지평으로 탈주하는 용기.
 * 3. 순수한 차이의 긍정 및 다양체 포용 (Affirmation of Pure Difference): 획일적 동일성의 잣대로 재단하지 않고 다름 그 자체의 고유한 생명력을 긍정하는 지혜.
 * 4. 창조적 '되기(Devenir / Becoming)' 변용 역동성 (Creative Becoming & Transformation): 고정된 정체성에 머물지 않고 끊임없이 새로운 존재로 변용하며 성장하는 활력.
 * 5. 고착 극복 및 잠재력 해방 회복탄력성 (Liberation of Potential & Resilience): 억압적인 도그마나 결핍의 환상을 부수고 내재적 충만과 생명 에너지를 회복하는 힘.
 *
 * @version LUCKEY-DELEUZE-RHIZOME-BECOMING-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_GILLES_DELEUZE_RHIZOME_BECOMING_VERSION = 'LUCKEY-DELEUZE-RHIZOME-BECOMING-v2.4.0';

export type DeleuzeQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface DeleuzeTemporalRhythm {
  kstDateLabel: string;
  timeBand: '새벽 탈주선' | '오전 리좀 접속' | '오후 탈영토화' | '저녁 차이 긍정' | '심야 되기 침잠';
  nomadicTempo: string;
  temporalGuidance: string;
}

export interface DeleuzeTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface DeleuzeAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginal: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchGillesDeleuzeRhizomeBecomingResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: DeleuzeQuestionTopic;
  becomingPhase: string;
  deleuzeCrossAxis: string;
  shadowWarning: string;
  temporalDeleuzeRhythm: DeleuzeTemporalRhythm;
  // 5대 들뢰즈 리좀·탈영토화·생성 핵심 지표 (내부 호환용 보존, 프롬프트 비노출)
  rhizomaticHorizontalConnectionIndex: number;      // 리좀적 수평 접속 역량 (Rhizomatic Connection)
  deterritorializationNomadicFreedomScore: number;  // 탈영토화 노마딕 자유도 (Deterritorialization)
  affirmationOfDifferenceMultiplicityIndex: number; // 순수 차이 긍정 및 다양체 (Affirmation of Difference)
  creativeBecomingVitalityScore: number;            // 창조적 되기 변용 역동성 (Creative Becoming)
  desiringProductionLiberationResilienceScore: number; // 잠재력 해방 회복탄력성 (Liberation Resilience)
  // 세부 분석
  activeDeleuzeTheme: DeleuzeTheme;
  companionDeleuzeTheme: DeleuzeTheme;
  focalDeleuzeAphorism: DeleuzeAphorism;
  practiceGuidance: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  deleuzeSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  deleuzeComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

const DELEUZE_BECOMING_PHASES = [
  '탈주선 포착(익숙한 위계와 관성의 틈새에서 새로운 연결의 실마리를 발견하는 시기)',
  '리좀 접속(이질적인 경험과 사람들을 수평적으로 엮어 다채로운 회로를 여는 시기)',
  '차이 변용(남과 같아지려는 모방을 내려놓고 나만의 고유한 생성으로 건너가는 시기)',
] as const;

const DELEUZE_SHADOW_WARNINGS = [
  '새로운 탈주선과 변용을 좇다 지금 단단히 매듭지어야 할 현실의 약속까지 흩어놓지 않도록 살피세요.',
  '수평적 연결과 실험을 넓히느라 정작 내 에너지를 모아야 할 핵심 중심축이 분산되지 않도록 점검하세요.',
  '기존의 틀을 깨는 데 집중하다 곁에 있는 소중한 사람들의 안정감과 속도를 놓치지 않도록 유의하세요.',
] as const;

export const DELEUZE_THEMES: DeleuzeTheme[] = [
  {
    themeKey: 'rhizomeMultiplicity',
    themeTitleEn: 'Rhizome: Non-Hierarchical Horizontal Connections',
    themeTitleKo: '리좀적 사유 — 뿌리줄기처럼 사방으로 뻗어나가는 열린 연결망 구축하기',
    pragmaticInsight: '나무처럼 뿌리-줄기-가지로 이어지는 엄격한 수직적 위계는 사유를 경직시킵니다. 리좀(뿌리줄기)처럼 어느 지점에서나 임의의 다른 지점과 접속할 수 있는 탈중심적 유연성이 필요합니다.',
    practicalCounsel: '정해진 순서나 고착된 조직 체계에만 의존하지 마십시오. 전혀 다른 분야와 경험을 창의적으로 연결하고, 수평적이고 자유로운 네트워크를 확장하십시오.',
  },
  {
    themeKey: 'deterritorializationNomadism',
    themeTitleEn: 'Deterritorialization & Nomadism: Breaking Boundaries',
    themeTitleKo: '탈영토화와 노마디즘 — 익숙한 안전지대를 벗어나 새로운 영토를 개척하기',
    pragmaticInsight: '기존의 습관, 제도, 상식의 영토에 안주할 때 생명력은 시듭니다. 탈영토화(Déterritorialisation)의 탈주선을 타고 경계를 가로지르는 유목민(노마드)의 정신이 혁신을 낳습니다.',
    practicalCounsel: '과거의 성공 방정식이나 편안한 루틴에 머무르지 마십시오. 두려움을 떨쳐내고 새로운 지식과 미개척 분야로 과감히 발걸음을 내딛으십시오.',
  },
  {
    themeKey: 'affirmationOfDifference',
    themeTitleEn: 'Affirmation of Difference & Multiplicity against Uniformity',
    themeTitleKo: '차이의 긍정과 다양체 — 획일성을 넘어 고유한 다름을 축복하기',
    pragmaticInsight: '차이란 동일성의 잣대 아래 놓인 열등함이 아니라, 그 자체로 풍요롭고 독창적인 힘입니다. 모든 존재의 차이를 있는 그대로 긍정할 때 진정한 창의성이 폭발합니다.',
    practicalCounsel: '남들과 같아지려 애쓰거나 다름을 숨기지 마십시오. 당신만의 독보적인 차이점과 개성을 최고의 자산으로 삼아 승부하십시오.',
  },
  {
    themeKey: 'creativeBecoming',
    themeTitleEn: 'Devenir: Creative Becoming Over Fixed Being',
    themeTitleKo: '되기(Devenir)의 역동성 — 고정된 명사가 아닌 흐르는 동사로 살아가기',
    pragmaticInsight: '인간은 완성된 존재(Being)로 굳어지는 것이 아니라, 매 순간 마주하는 세계와 공명하며 새롭게 태어나는 생성(Becoming)의 과정입니다.',
    practicalCounsel: '"나는 원래 이런 사람이다"라는 자기규정을 버리십시오. 새로운 배움과 만남을 통해 끊임없이 자신을 쇄신하고 진화시키십시오.',
  },
  {
    themeKey: 'desiringProduction',
    themeTitleEn: 'Desire as Creative Production, Not Lack',
    themeTitleKo: '욕망의 생산성과 내재적 충만 — 결핍이 아닌 넘쳐흐르는 창조적 에너지 누리기',
    pragmaticInsight: '욕망은 채워지지 않은 결핍이 아니라, 세계와 관계를 맺고 새로운 것을 만들어내는 긍정적인 생산의 기계입니다. 생명의 원초적 기쁨을 긍정해야 합니다.',
    practicalCounsel: '무언가 부족하다는 결핍감에 쫓기지 마십시오. 내면의 풍성한 활력과 호기심을 발판 삼아 능동적으로 새로운 가치를 창조하십시오.',
  },
];

export const DELEUZE_APHORISMS: DeleuzeAphorism[] = [
  {
    aphorismKey: 'makeRhizomeNotRoot',
    aphorismKo: '뿌리를 만들지 말고 리좀을 만들어라. 나무를 심지 말라. 절대 심지 말라!',
    aphorismOriginal: "Faites rhizome et pas racine, ne plantez pas! Ne semez pas, piquez!",
    sourceContext: '들뢰즈 & 과타리 《천 개의 고원(Mille Plateaux)》',
    actionGuidance: '고정된 틀에 얽매이지 말고, 다양한 기회와 관계의 망을 사방으로 유연하게 열어두십시오.',
  },
  {
    aphorismKey: 'differenceInItself',
    aphorismKo: '차이는 긍정되어야 할 대상이다. 차이를 인정하는 것이 아니라 차이 자체를 사랑하는 것이다.',
    aphorismOriginal: "La différence n'est pas et ne peut pas être pensée en elle-même, tant qu'elle est soumise aux exigences de la représentation.",
    sourceContext: '들뢰즈 《차이와 반복(Différence et Répétition)》',
    actionGuidance: '타인의 시선이나 비교에 흔들리지 말고, 당신만의 차별화된 독창성에 깊은 자부심을 가지십시오.',
  },
  {
    aphorismKey: 'linesOfFlight',
    aphorismKo: '탈주선은 언제나 살아 움직이며, 새로운 지평을 창조하는 가장 강력한 힘이다.',
    aphorismOriginal: "Les lignes de fuite sont créatrices de nouvelles réalités.",
    sourceContext: '들뢰즈 & 과타리 《대담(Dialogues)》',
    actionGuidance: '답답한 벽에 부딪혔을 때 정면충돌만 고집하지 말고, 상상력의 새로운 탈주선을 열어 도약하십시오.',
  },
  {
    aphorismKey: 'becomingImperceptible',
    aphorismKo: '되기(Devenir)는 결코 다른 무엇을 모방하는 것이 아니라, 자기 자신을 새롭게 변용하는 것이다.',
    aphorismOriginal: "Devenir n'est jamais imiter, ni faire comme, ni se conformer à un modèle.",
    sourceContext: '들뢰즈 & 과타리 《천 개의 고원(Mille Plateaux)》',
    actionGuidance: '남의 흉내를 내지 마십시오. 당신만의 리듬과 방식으로 내면의 잠재력을 꽃피우십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function classifyDeleuzeQuestionTopic(question?: string): DeleuzeQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/연애|사랑|관계|가족|친구|갈등|화해|이별|소통|사람|상대|동료|배우자/.test(q)) {
    return 'relationship';
  }
  if (/결정|선택|이직|창업|진로|도전|방향|사업|투자|계약|결단|시작|그만/.test(q)) {
    return 'decision';
  }
  if (/지치|불안|우울|회복|위로|상처|아픔|피로|휴식|번아웃|힘들|치유|걱정/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

export function buildDeleuzeTemporalRhythm(now: Date = new Date()): DeleuzeTemporalRhythm {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kst = new Date(kstMs);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hour = kst.getUTCHours();

  if (hour >= 4 && hour < 8) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 새벽`,
      timeBand: '새벽 탈주선',
      nomadicTempo: '관성의 경계를 넘어 첫 탈주선이 열리는 고요한 영토',
      temporalGuidance: '기존의 틀이 아직 굳기 전, 고정관념을 벗어난 새로운 접속점을 상상하기 좋은 새벽입니다.',
    };
  }
  if (hour >= 8 && hour < 12) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 오전`,
      timeBand: '오전 리좀 접속',
      nomadicTempo: '이질적인 아이디어와 사람이 수평으로 만나는 시간',
      temporalGuidance: '수직적 위계나 정답 강박을 내려놓고, 낯선 분야와 가볍게 연결해 보기 알맞은 오전입니다.',
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 오후`,
      timeBand: '오후 탈영토화',
      nomadicTempo: '익숙한 루틴에서 반 보 벗어나 변용을 실험하는 흐름',
      temporalGuidance: '반복되는 일과 속에서 작은 우회로 하나를 열어 새로운 감각을 불러들이기 좋은 오후입니다.',
    };
  }
  if (hour >= 18 && hour < 22) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} 저녁`,
      timeBand: '저녁 차이 긍정',
      nomadicTempo: '비교와 획일성을 내려놓고 고유한 다름을 품는 시간',
      temporalGuidance: '남과 달랐던 오늘의 선택과 흔적을 결핍이 아닌 나만의 차이로 긍정하는 저녁입니다.',
    };
  }
  return {
    kstDateLabel: `${yyyy}-${mm}-${dd} 심야`,
    timeBand: '심야 되기 침잠',
    nomadicTempo: '고정된 명사를 풀어 헤쳐 내일의 생성(Devenir)을 잉태하는 밤',
    temporalGuidance: '스스로를 가두던 자기규정을 잠시 내려놓고, 자유로운 유목적 사유가 숨 쉬도록 여백을 두는 밤입니다.',
  };
}

function describeQualitativeIntensity(score: number): string {
  if (score >= 90) return '왕성한 노마딕 약동';
  if (score >= 84) return '유연한 리좀 확장';
  return '차분한 변용 준비';
}

function buildDeleuzeTopicContext(
  topic: DeleuzeQuestionTopic,
  theme: DeleuzeTheme,
  temporal: DeleuzeTemporalRhythm
): {
  practiceGuidance: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
} {
  switch (topic) {
    case 'relationship':
      return {
        practiceGuidance: `관계에서는 누가 위이고 아래인지 따지는 수목형 위계를 허물고, 서로의 차이를 존중하는 수평적 접속이 해답입니다. '${theme.themeTitleKo}'의 시선으로 관계의 새 통로를 열어 보세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 상대방과 내가 다른 지점을 고치려 들지 않고, 그 다름이 만든 흥미로운 점 1가지를 메모해 보기`,
        reflectiveQuestion: '지금 이 관계에서 나를 답답하게 만드는 고정된 역할 기대는 무엇이며, 어떻게 수평적으로 다시 연결할 수 있을까요?',
      };
    case 'decision':
      return {
        practiceGuidance: `선택 앞에서는 '원래 하던 대로'라는 안전한 영토가 발목을 잡기 쉽습니다. '${theme.themeTitleKo}'처럼 두 갈래 밖의 제3의 탈주선까지 열어 두고 움직여 보세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 지금 고민하는 두 선택지 외에, 전혀 다른 분야의 사람이라면 고를 법한 엉뚱한 제3안 하나를 적어 보기`,
        reflectiveQuestion: '내가 망설이는 이유가 위험해서인가요, 아니면 단지 익숙한 영토를 떠나는 것이 낯설기 때문인가요?',
      };
    case 'healing':
      return {
        practiceGuidance: `마음이 지칠 때는 욕망을 '부족함'으로 읽는 시선을 멈추고 내면의 충만함을 회복해야 합니다. '${theme.themeTitleKo}'를 따라 남과의 비교를 잠시 꺼 두세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 해야 할 일 목록에서 비교와 평가가 섞인 항목 하나를 지우고, 순수하게 즐거워서 하는 10분 행동 넣기`,
        reflectiveQuestion: '지금 나를 지치게 하는 것은 실제 내 몸의 피로인가요, 아니면 남과 같아야 한다는 획일성의 압박인가요?',
      };
    case 'reflection':
    default:
      return {
        practiceGuidance: `스스로를 돌아볼 때는 '나는 원래 이런 사람'이라는 고정된 명사를 동사로 바꾸는 연습이 필요합니다. '${theme.themeTitleKo}'의 리듬으로 오늘의 변화를 읽어 보세요.`,
        dailyPracticeRitual: `[${temporal.timeBand}] 평소 자주 쓰던 '나는 원래 ~해'라는 표현을 '요즘 나는 ~되어 가는 중이야'로 바꿔 한 줄 써 보기`,
        reflectiveQuestion: '지금 내 삶에서 가장 굳어 있는 습관의 뿌리는 어디이며, 어떤 새로운 접속이 나를 다시 흐르게 할 수 있을까요?',
      };
  }
}

export function calculateFrenchGillesDeleuzeRhizomeBecoming(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchGillesDeleuzeRhizomeBecomingResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const questionTopic = classifyDeleuzeQuestionTopic(query);
  const temporalDeleuzeRhythm = buildDeleuzeTemporalRhythm(now);

  const seedString = `DELEUZE-RHIZOME-BECOMING:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const rhizomaticHorizontalConnectionIndex = 84 + ((absHash >> 1) % 15);
  const deterritorializationNomadicFreedomScore = 83 + ((absHash >> 4) % 16);
  const affirmationOfDifferenceMultiplicityIndex = 85 + ((absHash >> 7) % 14);
  const creativeBecomingVitalityScore = 82 + ((absHash >> 10) % 17);
  const desiringProductionLiberationResilienceScore = 81 + ((absHash >> 13) % 18);

  const themeIndex = (absHash >> 5) % DELEUZE_THEMES.length;
  const companionOffset = 1 + ((absHash >> 6) % (DELEUZE_THEMES.length - 1));
  const aphorismIndex = (absHash >> 8) % DELEUZE_APHORISMS.length;

  const activeDeleuzeTheme = DELEUZE_THEMES[themeIndex];
  const companionDeleuzeTheme = DELEUZE_THEMES[(themeIndex + companionOffset) % DELEUZE_THEMES.length];
  const focalDeleuzeAphorism = DELEUZE_APHORISMS[aphorismIndex];
  const becomingPhase = DELEUZE_BECOMING_PHASES[(absHash >> 11) % DELEUZE_BECOMING_PHASES.length];
  const shadowWarning = DELEUZE_SHADOW_WARNINGS[(absHash >> 14) % DELEUZE_SHADOW_WARNINGS.length];

  const { practiceGuidance, dailyPracticeRitual, reflectiveQuestion } = buildDeleuzeTopicContext(
    questionTopic,
    activeDeleuzeTheme,
    temporalDeleuzeRhythm
  );

  const interpretiveBoundary =
    '이 해석은 운명을 고정된 숫자로 단정하는 예언이 아니라, 질 들뢰즈의 리좀·탈영토화·생성(Devenir) 철학을 통해 현재 상황의 열린 연결성과 변용 가능성을 비추어 보는 상징적 성찰 가이드입니다.';

  const guidanceTitle = `들뢰즈 리좀·탈영토화 지혜: ${activeDeleuzeTheme.themeTitleKo}`;
  const philosophicalCounsel = `현대 사상의 지형을 바꾼 질 들뢰즈는 수직적 위계를 허무는 '리좀(Rhizome)'적 접속, 한계를 돌파하는 '탈영토화(Déterritorialisation)', 그리고 끊임없이 변용하는 '되기(Devenir)'의 철학을 완성했습니다. ` +
    `현재 당신의 흐름에서 가장 역동적인 활력을 불어넣는 핵심 원리는 '${activeDeleuzeTheme.themeTitleKo}'(동반 원리: ${companionDeleuzeTheme.themeTitleKo})입니다. ` +
    `${activeDeleuzeTheme.practicalCounsel} ${practiceGuidance} 들뢰즈의 명언 "${focalDeleuzeAphorism.aphorismKo} (${focalDeleuzeAphorism.aphorismOriginal})"을 되새기며, ` +
    `${focalDeleuzeAphorism.actionGuidance}`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${temporalDeleuzeRhythm.kstDateLabel} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} +09:00 (KST)`;
  const deleuzeCrossAxis = `${activeDeleuzeTheme.themeTitleKo.split('—')[0].trim()} × ${companionDeleuzeTheme.themeTitleKo.split('—')[0].trim()} (${temporalDeleuzeRhythm.timeBand})`;
  const deleuzeSynthesisMatrix = {
    coreInsight: `${activeDeleuzeTheme.themeTitleKo} (동반: ${companionDeleuzeTheme.themeTitleKo})`,
    recommendedAction: `${practiceGuidance} (${becomingPhase})`,
    cautionNotice: shadowWarning,
  };

  return {
    engineVersion: FRENCH_GILLES_DELEUZE_RHIZOME_BECOMING_VERSION,
    calculatedAtKst: kstTimeLabel,
    questionTopic,
    becomingPhase,
    deleuzeCrossAxis,
    shadowWarning,
    temporalDeleuzeRhythm,
    rhizomaticHorizontalConnectionIndex,
    deterritorializationNomadicFreedomScore,
    affirmationOfDifferenceMultiplicityIndex,
    creativeBecomingVitalityScore,
    desiringProductionLiberationResilienceScore,
    activeDeleuzeTheme,
    companionDeleuzeTheme,
    focalDeleuzeAphorism,
    practiceGuidance: `${practiceGuidance} (동반 원리: ${companionDeleuzeTheme.themeTitleKo})`,
    dailyPracticeRitual: `${dailyPracticeRitual} (${becomingPhase})`,
    reflectiveQuestion: `'${becomingPhase}' 국면에서 ${reflectiveQuestion}`,
    ritualAction: `${dailyPracticeRitual} (${becomingPhase})`,
    reflectionFocus: `'${becomingPhase}' 국면에서 ${reflectiveQuestion}`,
    interpretiveBoundary,
    deleuzeSynthesisMatrix,
    deleuzeComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchGillesDeleuzeRhizomeBecomingPrompt(
  res: FrenchGillesDeleuzeRhizomeBecomingResult,
): string {
  return [
    `【들뢰즈 《천 개의 고원·차이와 반복》 리좀·탈영토화·생성 성찰 가이드 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- 생성(Devenir) 국면: ${res.becomingPhase}`,
    `- KST 시공간 리듬: ${res.temporalDeleuzeRhythm.kstDateLabel} · ${res.temporalDeleuzeRhythm.timeBand} (${res.temporalDeleuzeRhythm.nomadicTempo})`,
    `- 시공간 권면: ${res.temporalDeleuzeRhythm.temporalGuidance}`,
    `- 리좀적 수평 접속 역량(Rhizomatic Connection): ${describeQualitativeIntensity(res.rhizomaticHorizontalConnectionIndex)}`,
    `- 탈영토화 노마딕 자유도(Deterritorialization): ${describeQualitativeIntensity(res.deterritorializationNomadicFreedomScore)}`,
    `- 순수 차이 긍정 및 다양체(Affirmation of Difference): ${describeQualitativeIntensity(res.affirmationOfDifferenceMultiplicityIndex)}`,
    `- 창조적 되기 변용 역동성(Creative Becoming): ${describeQualitativeIntensity(res.creativeBecomingVitalityScore)}`,
    `- 잠재력 해방 회복탄력성(Liberation Resilience): ${describeQualitativeIntensity(res.desiringProductionLiberationResilienceScore)}`,
    `- 핵심 들뢰즈 테마: ${res.activeDeleuzeTheme.themeTitleKo} [${res.activeDeleuzeTheme.themeTitleEn}]`,
    `- 동반 들뢰즈 테마: ${res.companionDeleuzeTheme.themeTitleKo}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 실천적 통찰: ${res.activeDeleuzeTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeDeleuzeTheme.practicalCounsel}`,
    `- 맥락 맞춤 가이드: ${res.practiceGuidance}`,
    `- 오늘의 실천 의례(${res.questionTopic}): ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 들뢰즈 교차 축: ${res.deleuzeCrossAxis}`,
    `- 교차 매트릭스: 핵심(${res.deleuzeSynthesisMatrix.coreInsight}) | 실행(${res.deleuzeSynthesisMatrix.recommendedAction}) | 주의(${res.deleuzeSynthesisMatrix.cautionNotice})`,
    `- 들뢰즈 원전 명언: "${res.focalDeleuzeAphorism.aphorismKo}" (${res.focalDeleuzeAphorism.aphorismOriginal})`,
    `- 원전 출처: [${res.focalDeleuzeAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDeleuzeAphorism.actionGuidance}`,
    `- 종합 들뢰즈 권면: ${res.deleuzeComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
