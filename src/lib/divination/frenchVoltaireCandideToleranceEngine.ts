/**
 * 프랑스 볼테르(Voltaire) 《캉디드(Candide)》 & 《관용론(Traité sur la tolérance)》 일상 실천 & 관용 지혜 엔진
 *
 * 프랑스 계몽주의의 위대한 지성이자 문호 볼테르(François-Marie Arouet, Voltaire, 1694~1778)의 불후의 명작
 * 《캉디드(Candide, 1759)》, 《관용론(Traité sur la tolérance, 1763)》, 《철학 사전(Dictionnaire philosophique)》 원전 기반:
 * 1. "우리의 밭을 일구어야 한다(Il faut cultiver notre jardin)" 일상적 노동과 성실한 실천 지수(Cultivate Our Garden Pragmatic Devotion Score): 공리공론을 멈추고 삶을 일구는 실천.
 * 2. 독단·광신·편견을 극복하는 관용 및 열린 지성 지표(Tolerance & Enlightened Reason Index): 차이를 포용하고 맹신을 깨뜨리는 합리적 이성.
 * 3. 위선과 부조리를 꿰뚫는 명석한 기지와 유머·회복탄력성(Wit & Satirical Piercing Insight Score): 어둠 속에서도 위트와 풍자로 중심을 지키는 혜안.
 * 4. 억울한 약자를 구명하고 진실을 밝히는 실천적 양심 및 정의 구현도(Justice Advocacy & Conscience Score): 카라스 사건 구명처럼 불의에 맞서 진실을 밝히는 용기.
 * 5. 헛된 관념론을 탈피하고 현실을 직시하는 분별력(Realistic Disillusionment & Clarity Index): 뜬구름 잡는 낙관론을 넘어 객관적 현실을 마주하는 힘.
 *
 * @version LUCKEY-VOLTAIRE-CANDIDE-TOLERANCE-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_VOLTAIRE_CANDIDE_TOLERANCE_VERSION = 'LUCKEY-VOLTAIRE-CANDIDE-TOLERANCE-v2.3.0';

export type VoltaireQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface VoltaireTemporalRhythm {
  kstHour: number;
  kstSlot: string;
  rhythmTitle: string;
  rhythmGuidance: string;
}

export interface VoltaireTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface VoltaireAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchVoltaireCandideToleranceResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 볼테르 계몽·실천 지표 (0~100)
  cultivateOurGardenPragmaticDevotionScore: number; // 밭을 일구는 일상 실천 지수 (Cultivate Our Garden Pragmatic Devotion)
  toleranceEnlightenedReasonIndex: number;          // 관용 및 열린 지성 지표 (Tolerance & Enlightened Reason)
  witSatiricalPiercingInsightScore: number;         // 위선 타파 기지 및 유머 회복탄력성 (Wit & Satirical Piercing Insight)
  justiceAdvocacyConscienceScore: number;           // 실천적 양심 및 정의 구현도 (Justice Advocacy & Conscience)
  realisticDisillusionmentClarityIndex: number;     // 현실 직시 및 분별력 지수 (Realistic Disillusionment & Clarity)
  // 세부 분석
  activeVoltaireTheme: VoltaireTheme;
  companionVoltaireTheme: VoltaireTheme;
  focalVoltaireAphorism: VoltaireAphorism;
  voltaireComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  questionTopic: VoltaireQuestionTopic;
  gardenPhase: string;
  shadowWarning: string;
  temporalRhythm: VoltaireTemporalRhythm;
  questionContextGuide: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  voltaireSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

const VOLTAIRE_GARDEN_PHASES = [
  '사변 걷어내기(거창한 걱정과 완벽주의를 내려놓고 현실의 손잡이를 잡는 시기)',
  '관용·위트 발휘(서로 다른 생각 앞에서 날을 세우기보다 유머와 열린 대화로 숨통을 틔우는 시기)',
  '우리의 밭 경작(내 손이 닿는 오늘의 작은 일부터 성실하게 가꾸어 실질적 결실을 쌓는 시기)',
] as const;

const VOLTAIRE_SHADOW_WARNINGS = [
  '유머와 풍자로 상황을 가볍게 넘기려다 상대방이 진지하게 아파하는 핵심까지 가볍게 짚지 않도록 살피세요.',
  '내 밭을 성실히 일구는 데 집중하다 주변의 억울함과 연대의 손길이 필요한 순간을 놓치지 않도록 점검하세요.',
  '독단을 경계하는 회의와 질문이 실행 자체를 미루는 냉소로 흐르지 않도록 유의하세요.',
] as const;

export const VOLTAIRE_THEMES: VoltaireTheme[] = [
  {
    themeKey: 'cultiverNotreJardin',
    themeTitleEn: 'Cultivating Our Own Garden',
    themeTitleKo: '"우리의 밭을 일구어야 한다" — 공리공론을 넘어선 일상적 노동과 성실한 실천',
    pragmaticInsight: '세상의 불합리와 거대한 모순에 매몰되어 뜬구름 잡는 사변에 빠지는 것은 무력감만 낳습니다. 지금 내 손이 닿는 작고 구체적인 일상과 과업을 성실히 가꾸는 것이 진정한 구원입니다.',
    practicalCounsel: '통제할 수 없는 거대한 혼란에 집착하지 마십시오. 오늘 내가 마주한 일터와 가정, 당면한 한 가지 일에 집중하여 정성껏 밭을 갈듯 실질적인 결과물을 빚어내십시오.',
  },
  {
    themeKey: 'toleranceOverFanaticism',
    themeTitleEn: 'Universal Tolerance & Liberty of Thought',
    themeTitleKo: '"관용은 인류의 가장 고귀한 선물이다" — 편협과 독단을 허무는 열린 이성',
    pragmaticInsight: '자신만의 신념을 절대화하여 타인을 배척하는 광신은 갈등의 주범입니다. 서로 다른 견해를 인정하고 귀 기울일 때 비로소 진정한 평화와 번영이 깃듭니다.',
    practicalCounsel: '나와 다른 생각이나 예상치 못한 반대 의견을 마주할 때 감정적으로 맞서지 마십시오. 관용의 태도로 상대의 관점을 경청하고, 합리적인 대화를 통해 공존의 해법을 찾으십시오.',
  },
  {
    themeKey: 'satiricalWitResilience',
    themeTitleEn: 'Satirical Wit & Piercing Lucidity',
    themeTitleKo: '"위트와 웃음으로 위선을 꿰뚫어라" — 어둠과 허세를 허무는 명철한 유머와 기지',
    pragmaticInsight: '엄숙함 뒤에 숨은 위선과 과장은 날카롭고 유쾌한 유머 앞에서는 힘을 잃습니다. 무거운 심각성에 짓눌리지 않고 상황을 한 발짝 떨어져 조망하는 위트가 최고의 방패입니다.',
    practicalCounsel: '문제를 지나치게 심각하고 비극적으로 받아들이지 마십시오. 맑은 지성과 가벼운 유머 감각을 발휘하여 모순의 실체를 꿰뚫고, 마음의 여유를 잃지 않고 난관을 돌파하십시오.',
  },
  {
    themeKey: 'courageousJusticeAdvocacy',
    themeTitleEn: 'Passionate Advocacy for Justice & Truth',
    themeTitleKo: '"진실 앞의 침묵은 공범이다" — 부조리에 맞서 약자를 옹호하는 실천적 정의감',
    pragmaticInsight: '편견에 의해 억울하게 고통받는 이들을 방관하지 않고 당당하게 진실의 목소리를 내는 용기가 세상을 바꿉니다. 진정한 지성은 펜을 들어 정의를 행동으로 옮기는 데 있습니다.',
    practicalCounsel: '주변의 불합리한 처사나 오해로 인해 억울한 입장에 처한 동료가 있다면 모른 척하지 마십시오. 냉철한 사실 확인과 명확한 논리로 진실을 변호하고 공정한 기준을 세우십시오.',
  },
];

export const VOLTAIRE_APHORISMS: VoltaireAphorism[] = [
  {
    aphorismKey: 'cultiverJardin',
    aphorismKo: '우리는 우리의 밭을 일구어야 합니다.',
    aphorismEn: 'We must cultivate our garden (Il faut cultiver notre jardin).',
    sourceContext: '철학소설 《캉디드(Candide)》 최종장 결어',
    actionGuidance: '탁상공론과 헛된 불안을 내려놓고, 지금 당장 내 손으로 개선할 수 있는 구체적인 일에 몰입하여 결실을 맺으십시오.',
  },
  {
    aphorismKey: 'defendRightToSpeak',
    aphorismKo: '나는 당신의 견해에 동의하지 않지만, 당신이 그 견해를 말할 권리를 위해서라면 끝까지 싸울 것입니다.',
    aphorismEn: 'I disapprove of what you say, but I will defend to the death your right to say it.',
    sourceContext: '볼테르의 사상을 집약한 《관용론(Traité sur la tolérance)》 정신',
    actionGuidance: '의견이 다른 상대를 공격하거나 배척하지 말고, 생각의 자유를 온전히 인정하며 성숙한 상호 존중을 실천하십시오.',
  },
  {
    aphorismKey: 'betterIsEnemyOfGood',
    aphorismKo: '더할 나위 없이 완벽한 것은 충분히 좋은 것의 적입니다.',
    aphorismEn: 'The best is the enemy of the good (Le mieux est l\'ennemi du bien).',
    sourceContext: '《철학 사전(Dictionnaire philosophique)》',
    actionGuidance: '완벽주의라는 강박에 사로잡혀 실행을 미루지 마십시오. 충분히 훌륭한 실질적 성과를 먼저 내어 발전의 디딤돌을 만드십시오.',
  },
  {
    aphorismKey: 'doubtAndCertainty',
    aphorismKo: '의심은 유쾌한 상태는 아니지만, 맹목적인 확신은 어리석은 상태입니다.',
    aphorismEn: 'Doubt is not a pleasant condition, but certainty is an absurd one.',
    sourceContext: '프로이센 프리드리히 대왕에게 보낸 철학 서한',
    actionGuidance: '절대적 확신에 취해 독단에 빠지지 마십시오. 건강한 질문과 객관적 검증을 통하여 한 걸음씩 더 단단한 진실로 나아가십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function classifyVoltaireQuestionTopic(query?: string): VoltaireQuestionTopic {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return 'reflection';
  if (/연애|사랑|관계|이별|결혼|재회|상대|사람|친구|가족|동료|마음|호감|갈등|연락/.test(q)) return 'relationship';
  if (/결정|선택|이직|창업|진로|시험|합격|투자|계약|진행|포기|방향|할까|말까/.test(q)) return 'decision';
  if (/불안|우울|지침|피곤|상처|치유|위로|힘들|걱정|두려|잠|휴식|회복/.test(q)) return 'healing';
  return 'reflection';
}

function buildVoltaireTemporalRhythm(now?: Date): VoltaireTemporalRhythm {
  const target = now ?? new Date();
  const kstHour = (target.getUTCHours() + 9) % 24;
  if (kstHour >= 5 && kstHour < 11) {
    return {
      kstHour,
      kstSlot: '새벽·아침 경작기',
      rhythmTitle: '오늘의 밭을 여는 첫 호미질',
      rhythmGuidance: '거창한 걱정보다 오늘 내 손이 닿는 작고 구체적인 과업 하나를 정해 가볍게 시작하기 좋은 시간입니다.',
    };
  }
  if (kstHour >= 11 && kstHour < 17) {
    return {
      kstHour,
      kstSlot: '한낮의 관용기',
      rhythmTitle: '다름을 품고 위트로 균형을 잡는 시간',
      rhythmGuidance: '서로 다른 의견이 부딪히는 낮 시간에는 독단 대신 열린 대화와 가벼운 유머가 가장 실용적인 해법이 됩니다.',
    };
  }
  if (kstHour >= 17 && kstHour < 22) {
    return {
      kstHour,
      kstSlot: '저녁의 분별기',
      rhythmTitle: '완벽주의를 내려놓고 결실을 확인하는 시간',
      rhythmGuidance: '빈틈없는 완벽을 따지기보다 오늘 충분히 잘해낸 실질적 진전을 인정하고 숨을 고르기 좋은 저녁입니다.',
    };
  }
  return {
    kstHour,
    kstSlot: '심야의 명철기',
    rhythmTitle: '공허한 사변을 접고 현실을 맑게 보는 밤',
    rhythmGuidance: '끝없는 가정과 불안한 상상을 멈추고 내일 손대야 할 한 가지 실천만 남긴 채 편안히 내려놓을 때입니다.',
  };
}

function describeVoltaireQualitativeStage(score: number): string {
  if (score >= 90) return '명철한 실천기 (현실 감각과 관용·실행력이 고르게 살아 있는 흐름)';
  if (score >= 80) return '견실한 경작기 (차분히 일상을 가꾸며 중심을 지키는 흐름)';
  return '담백한 정돈기 (헛된 완벽주의를 덜고 본질로 돌아가는 흐름)';
}

function formatVoltaireKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export function calculateFrenchVoltaireCandideTolerance(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): FrenchVoltaireCandideToleranceResult {
  const targetDate = now ?? new Date();
  const questionTopic = classifyVoltaireQuestionTopic(query);
  const temporalRhythm = buildVoltaireTemporalRhythm(targetDate);

  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `VOLTAIRE-CANDIDE-TOLERANCE:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${temporalRhythm.kstSlot}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const cultivateOurGardenPragmaticDevotionScore = 82 + ((absHash >> 1) % 17);
  const toleranceEnlightenedReasonIndex = 81 + ((absHash >> 4) % 18);
  const witSatiricalPiercingInsightScore = 80 + ((absHash >> 7) % 19);
  const justiceAdvocacyConscienceScore = 83 + ((absHash >> 10) % 16);
  const realisticDisillusionmentClarityIndex = 82 + ((absHash >> 13) % 17);

  const themeIndex = (absHash >> 6) % VOLTAIRE_THEMES.length;
  const companionOffset = 1 + ((absHash >> 7) % (VOLTAIRE_THEMES.length - 1));
  const aphorismIndex = (absHash >> 9) % VOLTAIRE_APHORISMS.length;

  const activeVoltaireTheme = VOLTAIRE_THEMES[themeIndex];
  const companionVoltaireTheme = VOLTAIRE_THEMES[(themeIndex + companionOffset) % VOLTAIRE_THEMES.length];
  const focalVoltaireAphorism = VOLTAIRE_APHORISMS[aphorismIndex];
  const gardenPhase = VOLTAIRE_GARDEN_PHASES[(absHash >> 11) % VOLTAIRE_GARDEN_PHASES.length];
  const shadowWarning = VOLTAIRE_SHADOW_WARNINGS[(absHash >> 14) % VOLTAIRE_SHADOW_WARNINGS.length];

  const topicGuides: Record<VoltaireQuestionTopic, { guide: string; ritual: string; question: string }> = {
    relationship: {
      guide: '볼테르의 관용(Tolérance)은 상대를 무조건 옳다고 하는 것이 아니라, 나와 다르게 생각할 권리를 인정하는 여유에서 시작됩니다. 날 선 정답 다툼보다 유머 한 스푼이 관계를 살립니다.',
      ritual: '상대의 말이 거슬릴 때 반박부터 꺼내기 전에 "저 사람 입장에서는 저렇게 보일 수도 있겠구나"를 한 번만 속으로 되뇌어 보세요.',
      question: '이 관계에서 내가 반드시 이겨야 한다고 믿었던 주장 중, 내려놓아도 괜찮은 것은 무엇인가요?',
    },
    decision: {
      guide: '"더할 나위 없이 완벽한 것은 충분히 좋은 것의 적"입니다. 모든 위험을 0으로 만든 뒤 움직이려 하기보다, 지금 당장 내 밭에서 해볼 수 있는 작은 실행을 먼저 심어 보세요.',
      ritual: '결정을 망설이게 하는 가장 큰 가정 1가지를 지우고, 오늘 30분 안에 검증할 수 있는 현실적인 작은 행동 하나를 실행해 보세요.',
      question: '완벽한 답을 기다리느라 미루고 있는 일 가운데, 지금 충분히 해볼 만한 첫 단계는 무엇인가요?',
    },
    healing: {
      guide: '세상의 부조리와 끝없는 걱정을 머리로 다 풀려 하면 마음만 지칩니다. 통제할 수 없는 큰 담론에서 시선을 거두고, 지금 내 책상과 방, 오늘의 한 끼를 정성껏 돌보는 일이 마음을 회복시킵니다.',
      ritual: '오늘 10분만이라도 어지러운 생각에서 손 떼고, 내 손이 닿는 작은 공간 하나를 정돈하거나 따뜻한 차 한 잔을 챙겨 마셔 보세요.',
      question: '지금 내 마음을 가장 무겁게 누르는 걱정 중, 사실 내가 직접 통제할 수 있는 영역은 어디까지인가요?',
    },
    reflection: {
      guide: '《캉디드》의 마지막 문장처럼 결국 삶을 지탱하는 것은 추상적인 낙관도 비관도 아닌, 오늘의 밭을 일구는 성실한 손길입니다.',
      ritual: '오늘 하루 중 공허한 생각에 머문 시간 대신 내 손으로 직접 만들어낸 작은 결과물 한 가지를 떠올려 보세요.',
      question: '지금 내 삶에서 뜬구름 잡는 고민을 멈추고 정성껏 가꾸기 시작해야 할 "나의 밭"은 무엇인가요?',
    },
  };

  const topicPack = topicGuides[questionTopic];

  const guidanceTitle = `볼테르 계몽주의 실천 지혜: ${activeVoltaireTheme.themeTitleKo}`;
  const philosophicalCounsel = `프랑스 계몽주의의 거목 볼테르는 "우리의 밭을 일구어야 한다(Il faut cultiver notre jardin)"는 일상의 성실한 실천과 광신을 물리치는 관용(Tolérance)을 가르칩니다. ` +
    `현재 당신의 흐름에서 가장 귀감이 되는 핵심 지혜는 '${activeVoltaireTheme.themeTitleKo}'(동반 지혜: ${companionVoltaireTheme.themeTitleKo})입니다. ` +
    `${activeVoltaireTheme.practicalCounsel} 볼테르의 통찰 "${focalVoltaireAphorism.aphorismKo}"를 되새기며, ` +
    `${focalVoltaireAphorism.actionGuidance}`;

  const voltaireSynthesisMatrix = {
    dominantTension: `${activeVoltaireTheme.themeTitleKo} ↔ ${companionVoltaireTheme.themeTitleKo} · ${temporalRhythm.kstSlot}`,
    alignmentState:
      cultivateOurGardenPragmaticDevotionScore >= 88 && toleranceEnlightenedReasonIndex >= 88
        ? '현실 경작과 관용·위트의 고차원 공명'
        : '공리공론을 걷어내고 오늘의 밭을 일구는 실천기',
    integratedAction: `${topicPack.ritual} (${gardenPhase})`,
  };

  return {
    engineVersion: FRENCH_VOLTAIRE_CANDIDE_TOLERANCE_VERSION,
    calculatedAtKst: formatVoltaireKstTimestamp(targetDate),
    cultivateOurGardenPragmaticDevotionScore,
    toleranceEnlightenedReasonIndex,
    witSatiricalPiercingInsightScore,
    justiceAdvocacyConscienceScore,
    realisticDisillusionmentClarityIndex,
    activeVoltaireTheme,
    companionVoltaireTheme,
    focalVoltaireAphorism,
    voltaireComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    questionTopic,
    gardenPhase,
    shadowWarning,
    temporalRhythm,
    questionContextGuide: `${topicPack.guide} (동반 지혜: ${companionVoltaireTheme.themeTitleKo})`,
    dailyPracticeRitual: `${topicPack.ritual} (${gardenPhase})`,
    reflectiveQuestion: `'${gardenPhase}' 국면에서 ${topicPack.question}`,
    ritualAction: `${topicPack.ritual} (${gardenPhase})`,
    reflectionFocus: `'${gardenPhase}' 국면에서 ${topicPack.question}`,
    interpretiveBoundary: '본 관점은 볼테르의 《캉디드》와 《관용론》 사상을 바탕으로 일상의 실천과 열린 시선을 돕는 상징적 안내이며, 우열의 점수나 확정적 예언이 아닙니다.',
    voltaireSynthesisMatrix,
  };
}

export function formatFrenchVoltaireCandideTolerancePrompt(
  res: FrenchVoltaireCandideToleranceResult,
): string {
  const lines = [
    `【볼테르 《캉디드》 & 《관용론》 일상 실천 및 관용 지혜 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 밭을 일구는 일상 실천 흐름(Cultivate Our Garden Devotion): ${describeVoltaireQualitativeStage(res.cultivateOurGardenPragmaticDevotionScore)}`,
    `- 관용 및 열린 지성 흐름(Tolerance & Enlightened Reason): ${describeVoltaireQualitativeStage(res.toleranceEnlightenedReasonIndex)}`,
    `- 위선 타파 기지 및 유머 회복탄력성(Wit & Satirical Piercing Insight): ${describeVoltaireQualitativeStage(res.witSatiricalPiercingInsightScore)}`,
    `- 실천적 양심 및 정의 구현(Justice Advocacy & Conscience): ${describeVoltaireQualitativeStage(res.justiceAdvocacyConscienceScore)}`,
    `- 현실 직시 및 분별력(Realistic Disillusionment & Clarity): ${describeVoltaireQualitativeStage(res.realisticDisillusionmentClarityIndex)}`,
    `- 현재 시공간 리듬 (${res.temporalRhythm.kstSlot}): ${res.temporalRhythm.rhythmTitle} — ${res.temporalRhythm.rhythmGuidance}`,
    `- 밭 경작 국면: ${res.gardenPhase}`,
    `- 질문 맥락 맞춤 성찰 (${res.questionTopic}): ${res.questionContextGuide}`,
    `- 핵심 볼테르 실천 테마: ${res.activeVoltaireTheme.themeTitleKo} [${res.activeVoltaireTheme.themeTitleEn}]`,
    `- 동반 볼테르 실천 테마: ${res.companionVoltaireTheme.themeTitleKo}`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 실천적 통찰: ${res.activeVoltaireTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeVoltaireTheme.practicalCounsel}`,
    `- 볼테르 원전 명언: "${res.focalVoltaireAphorism.aphorismKo}"`,
    `- 원문 인용: "${res.focalVoltaireAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalVoltaireAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalVoltaireAphorism.actionGuidance}`,
    `- 오늘의 경작 의례: ${res.dailyPracticeRitual}`,
    `- 핵심 성찰 질문: ${res.reflectiveQuestion}`,
    `- 종합 볼테르 계몽 권면: ${res.voltaireComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.voltaireSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.voltaireSynthesisMatrix.dominantTension} | 조율 상태: ${res.voltaireSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.voltaireSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
