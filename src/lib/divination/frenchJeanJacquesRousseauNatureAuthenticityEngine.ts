/**
 * 프랑스 장 자크 루소(Jean-Jacques Rousseau) 《에밀(Émile)》 & 《사회계약론(Du contrat social)》
 * 인간 본성 자연 회복 & 일반의지(Volonté Générale) 진정성 지혜 엔진
 *
 * 18세기 프랑스 계몽주의와 낭만주의의 선구자 장 자크 루소(1712~1778)의 불멸의 명저
 * 《에밀(Émile, ou De l'éducation, 1762)》, 《사회계약론(Du contrat social, 1762)》 및 《고백록(Les Confessions)》 원전 기반:
 * 1. 자연으로의 회귀(Retour à la nature): "자연이 만든 인간은 선하고 조화로웠으나, 인위적 사회와 허영이 인간을 왜곡했다" - 본래의 순수성과 직관 회복.
 * 2. 내면의 양심과 진정성(Authenticity): 타인의 시선과 사회적 가면에 휘둘리지 않고, 내면에서 속삭이는 신성한 본능인 양심(Conscience)에 귀 기울이는 정직함.
 * 3. 건전한 자기애(Amour de soi) 대 이기적 허영(Amour-propre): 남과의 끊임없는 비교에서 오는 질투와 허영(Amour-propre)을 넘어 자신의 본질을 오롯이 긍정하는 자존감(Amour de soi).
 * 4. 일반의지(Volonté Générale): 개별적인 사욕과 편협한 에고를 넘어, 모두의 공공선과 인류적 조화를 지향하는 고결한 공감과 연대.
 * 5. 자율적 주체성과 내적 자유: 억압적 관습의 사슬을 자각하고 영혼의 주권자로서 진정한 자율성을 꽃피우는 성숙.
 *
 * @version LUCKEY-JJ-ROUSSEAU-NATURE-v1.1.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_JJ_ROUSSEAU_VERSION = 'LUCKEY-JJ-ROUSSEAU-NATURE-v1.1.0';

export type RousseauQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface RousseauTemporalRhythm {
  kstHour: number;
  kstSlot: string;
  rhythmTitle: string;
  rhythmGuidance: string;
}

export interface RousseauTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  practicalCounsel: string;
}

export interface RousseauAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface JeanJacquesRousseauNatureAuthenticityResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 자연성·진정성 지표 (0~100)
  natureInherentGoodnessScore: number;     // 자연적 본성 및 선함 회복도 (자연으로 돌아가라)
  authenticityInnerVoiceScore: number;     // 양심의 내적 목소리와 영혼의 진정성
  generalWillSolidarityScore: number;      // 일반의지(Volonté Générale) 공공선과 연대감
  amourDeSoiSelfLoveScore: number;         // 건전한 자기애(Amour de soi) 대 이기적 허영 극복도
  emileAutonomyEducationScore: number;     // 에밀식 자율적 주체성 및 내면의 자유도
  // 세부 분석
  activeRousseauTheme: RousseauTheme;
  focalRousseauAphorism: RousseauAphorism;
  rousseauComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  questionTopic: RousseauQuestionTopic;
  temporalRhythm: RousseauTemporalRhythm;
  questionContextGuide: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export const ROUSSEAU_THEMES: RousseauTheme[] = [
  {
    themeKey: 'retour_a_la_nature',
    themeTitleEn: 'Return to Inherent Nature and Purity',
    themeTitleKo: '자연으로의 회귀 - 인위적 허식 탈피와 본래의 순수성 회복',
    philosophicalInsight: '복잡한 세상이 강요하는 수많은 인위적 조건과 체면을 한 겹 벗겨낼 때, 당신 영혼의 가장 맑고 순수한 본성이 빛납니다.',
    practicalCounsel: '타인의 기대나 사회적 시선에 맞추어 연기하지 마십시오. 조용히 자연과 호흡하며 당신의 가장 원초적이고 진실한 감정에 정직해지십시오.',
  },
  {
    themeKey: 'amour_de_soi_authentic_love',
    themeTitleEn: 'Amour de Soi vs. Amour-propre',
    themeTitleKo: '고결한 자기애 - 비교하는 허영을 넘어 본질을 아끼는 마음',
    philosophicalInsight: '남들과 비교하며 우열을 가리려는 허영(Amour-propre)은 고통을 낳지만, 자신의 생명과 고유성을 따스하게 품는 자기애(Amour de soi)는 평온을 줍니다.',
    practicalCounsel: '타인과의 끊임없는 비교 경쟁에서 즉시 내려오십시오. 당신이 가진 소박한 일상과 타고난 개성 그 자체에 온전한 감사를 보내십시오.',
  },
  {
    themeKey: 'conscience_divine_instinct',
    themeTitleEn: 'Conscience as Divine and Infallible Guide',
    themeTitleKo: '양심의 소리 - 영혼을 이끄는 신성한 내면의 나침반',
    philosophicalInsight: '지식과 계산은 오류를 범할 수 있으나, 양심의 떨림은 영혼의 바른길을 단 한 번도 속이지 않는 불멸의 목소리입니다.',
    practicalCounsel: '머리로만 손익을 재지 말고 가슴 깊은 곳에서 울리는 양심의 신호에 귀 기울이십시오. 옳다고 느끼는 그 순수한 직관이 정답입니다.',
  },
  {
    themeKey: 'volonte_generale_solidarity',
    themeTitleEn: 'General Will and Universal Compassion',
    themeTitleKo: '일반의지 - 사욕을 넘어 모두와 공명하는 보편적 조화',
    philosophicalInsight: '개별적 사욕을 넘어 타인의 아픔에 깊이 공감하고 공동의 선을 모색할 때, 영혼은 진정한 자유와 고귀한 힘을 얻습니다.',
    practicalCounsel: '혼자만의 승리가 아니라 주변 사람들과 함께 상생하고 번영할 수 있는 너른 길을 선택하십시오. 그 연대가 당신을 가장 강하게 만듭니다.',
  },
];

export const ROUSSEAU_APHORISMS: RousseauAphorism[] = [
  {
    aphorismKey: 'born_free_in_chains',
    aphorismKo: '인간은 자유롭게 태어났으나, 도처에 사슬에 묶여 있다.',
    aphorismEn: 'Man is born free, and everywhere he is in chains.',
    sourceContext: '《사회계약론》 제1권 제1장',
    actionGuidance: '보이지 않게 당신을 옭아매고 있던 관습과 두려움의 사슬을 자각하고, 오늘 단 하나의 결단으로 스스로 자유를 되찾으십시오.',
  },
  {
    aphorismKey: 'nature_good_society_depraves',
    aphorismKo: '자연은 인간을 행복하고 선하게 만들었으나, 사회가 인간을 타락시키고 비참하게 만든다.',
    aphorismEn: 'Nature made man happy and good, but society depraves him and makes him miserable.',
    sourceContext: '《루소, 장 자크를 심판하다》',
    actionGuidance: '세상의 혼탁한 소음에서 잠시 물러나 침묵 속에서 마음을 정화하십시오. 본래 당신의 마음은 이미 선하고 맑습니다.',
  },
  {
    aphorismKey: 'conscience_divine_instinct_aphorism',
    aphorismKo: '양심이여! 양심이여! 거룩한 본능이요, 불멸의 하늘의 목소리여!',
    aphorismEn: 'Conscience! Conscience! Divine instinct, immortal and celestial voice.',
    sourceContext: '《에밀》 사부아 신부의 신앙고백',
    actionGuidance: '손익 계산 대신 당신의 고결한 양심이 가리키는 순수한 진실을 선택하십시오. 그것이 장기적으로 가장 위대한 승리를 안깁니다.',
  },
  {
    aphorismKey: 'richest_experience_of_life',
    aphorismKo: '가장 오래 산 사람은 가장 많은 나이를 먹은 사람이 아니라, 삶을 가장 깊이 느낀 사람이다.',
    aphorismEn: 'The person who has lived the most is not the one with the most years, but the one with the richest experiences of life.',
    sourceContext: '《에밀》 제1권',
    actionGuidance: '기계적인 하루의 반복을 멈추고, 지금 이 순간 스쳐가는 감정과 호흡을 온몸과 온마음으로 충만하게 음미하십시오.',
  },
];

function classifyRousseauQuestionTopic(question?: string): RousseauQuestionTopic {
  const q = (question ?? '').trim().toLowerCase();
  if (!q) return 'reflection';
  if (/연애|사랑|관계|이별|결혼|재회|상대|사람|친구|가족|동료|마음|호감|갈등|연락/.test(q)) return 'relationship';
  if (/결정|선택|이직|창업|진로|시험|합격|투자|계약|진행|포기|방향|할까|말까/.test(q)) return 'decision';
  if (/불안|우울|지침|피곤|상처|치유|위로|힘들|걱정|두려|잠|휴식|회복/.test(q)) return 'healing';
  return 'reflection';
}

function buildRousseauTemporalRhythm(now?: Date): RousseauTemporalRhythm {
  const target = now ?? new Date();
  const kstHour = (target.getUTCHours() + 9) % 24;
  if (kstHour >= 5 && kstHour < 11) {
    return {
      kstHour,
      kstSlot: '새벽·아침 순수기',
      rhythmTitle: '사회적 가면을 벗는 자연의 첫 호흡',
      rhythmGuidance: '남의 시선이나 평가가 스며들기 전, 자기 본연의 감각과 양심의 소리를 가장 맑게 들을 수 있는 시간입니다.',
    };
  }
  if (kstHour >= 11 && kstHour < 17) {
    return {
      kstHour,
      kstSlot: '한낮의 연대기',
      rhythmTitle: '허영을 내려놓고 공존을 묻는 시간',
      rhythmGuidance: '비교와 경쟁(Amour-propre)에 휩쓸리기 쉬운 한낮일수록 건강한 자기애(Amour de soi)와 공공선의 감각을 지켜야 합니다.',
    };
  }
  if (kstHour >= 17 && kstHour < 22) {
    return {
      kstHour,
      kstSlot: '저녁의 회복기',
      rhythmTitle: '관습의 무게를 내려놓는 내면 귀환',
      rhythmGuidance: '하루 동안 짊어진 역할과 체면을 내려놓고 나 자신에게 솔직한 감정을 허락하기 좋은 저녁입니다.',
    };
  }
  return {
    kstHour,
    kstSlot: '심야의 고백기',
    rhythmTitle: '고요한 양심과 마주하는 진정성의 밤',
    rhythmGuidance: '어둠 속에서 허식을 벗고 지금 내 마음이 진짜로 바라는 바를 담백하게 확인하는 시간대입니다.',
  };
}

function describeRousseauQualitativeStage(score: number): string {
  if (score >= 90) return '맑은 자연 회복기 (본연의 진정성과 양심이 선명하게 깨어 있는 흐름)';
  if (score >= 80) return '조화로운 자율기 (비교를 내려놓고 자기 중심을 지키는 흐름)';
  return '차분한 정화기 (인위적 긴장을 풀고 본래의 감각을 되찾는 흐름)';
}

export function calculateFrenchJeanJacquesRousseauNatureAuthenticity(
  profile: UserProfile,
  question?: string,
  now?: Date,
): JeanJacquesRousseauNatureAuthenticityResult {
  const targetDate = now ?? new Date();
  const questionTopic = classifyRousseauQuestionTopic(question);
  const temporalRhythm = buildRousseauTemporalRhythm(targetDate);

  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `JJ-ROUSSEAU-NATURE:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${temporalRhythm.kstSlot}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const natureInherentGoodnessScore = 73 + (absHash % 26);
  const authenticityInnerVoiceScore = 72 + ((absHash >> 3) % 27);
  const generalWillSolidarityScore = 70 + ((absHash >> 6) % 29);
  const amourDeSoiSelfLoveScore = 74 + ((absHash >> 9) % 25);
  const emileAutonomyEducationScore = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % ROUSSEAU_THEMES.length;
  const aphorismIndex = (absHash >> 7) % ROUSSEAU_APHORISMS.length;

  const activeRousseauTheme = ROUSSEAU_THEMES[themeIndex];
  const focalRousseauAphorism = ROUSSEAU_APHORISMS[aphorismIndex];

  const topicGuides: Record<RousseauQuestionTopic, { guide: string; ritual: string; question: string }> = {
    relationship: {
      guide: '관계에서 상대의 인정을 얻으려 자신을 꾸미기 시작하면 마음은 금세 지칩니다. 비교하는 허영을 내려놓고 솔직하고 담백한 진심을 건넬 때 관계도 숨을 쉽니다.',
      ritual: '오늘 누군가에게 답장을 보낼 때 멋져 보이려는 말을 한 줄 덜어내고, 지금 느끼는 진실한 마음 한 문장만 남겨 보세요.',
      question: '이 관계에서 내가 정말 지키고 싶은 것은 체면인가요, 아니면 서로를 있는 그대로 대하는 진정성인가요?',
    },
    decision: {
      guide: '남들이 부러워할 기준을 따라 고른 선택은 성취 뒤에도 공허를 남깁니다. 내 양심과 타고난 기질이 자연스럽게 동의하는 길인지 먼저 물어보세요.',
      ritual: '선택지를 앞에 두고 "남들이 어떻게 볼까"라는 문장을 지운 채 "내 몸과 마음이 편해지는 쪽"을 기준으로 다시 적어 보세요.',
      question: '타인의 시선과 사회적 기준이 전혀 없다면, 지금 나는 어느 쪽을 기꺼이 선택할까요?',
    },
    healing: {
      guide: '자연이 만든 본성은 원래 스스로 회복하는 힘을 지니고 있습니다. 억지로 괜찮은 척 연기하지 말고, 지친 감정을 자연스러운 신호로 받아들이세요.',
      ritual: '오늘 15분만이라도 나무나 하늘, 햇빛 같은 자연의 풍경을 바라보며 아무 평가 없이 깊게 숨을 내쉬어 보세요.',
      question: '지금 나를 가장 지치게 하는 것은 현실의 무게인가요, 아니면 스스로에게 씌운 과도한 기대인가요?',
    },
    reflection: {
      guide: '루소가 말한 진정한 자유는 남을 이기는 힘이 아니라 스스로의 주권자가 되는 데 있습니다. 오늘 내 일상이 내 본성과 얼마나 닮아 있는지 돌아보세요.',
      ritual: '하루를 마무리하며 오늘 내가 진짜 내 뜻으로 선택한 순간 하나와 체면 때문에 움직인 순간 하나를 나란히 적어 보세요.',
      question: '요즘 내 하루에서 가장 인위적으로 꾸며진 부분과 가장 자연스럽게 숨 쉬는 부분은 각각 어디인가요?',
    },
  };

  const topicPack = topicGuides[questionTopic];

  const guidanceTitle = `장 자크 루소 자연 회복 진정성 지혜: ${activeRousseauTheme.themeTitleKo}`;
  const philosophicalCounsel = `장 자크 루소의 자연 회복과 진정성 철학은 사회적 허식과 비교의 고통을 털어내고 당신 본래의 순수한 생명력을 꽃피우도록 돕습니다. ` +
    `현재 당신에게 필요한 가장 핵심적인 내적 성찰은 '${activeRousseauTheme.themeTitleKo}'입니다. ` +
    `${activeRousseauTheme.practicalCounsel} 루소의 명언 "${focalRousseauAphorism.aphorismKo}"(${focalRousseauAphorism.aphorismEn})을 마음에 품고, ` +
    `${focalRousseauAphorism.actionGuidance}`;

  return {
    engineVersion: FRENCH_JJ_ROUSSEAU_VERSION,
    calculatedAtKst: targetDate.toISOString(),
    natureInherentGoodnessScore,
    authenticityInnerVoiceScore,
    generalWillSolidarityScore,
    amourDeSoiSelfLoveScore,
    emileAutonomyEducationScore,
    activeRousseauTheme,
    focalRousseauAphorism,
    rousseauComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    questionTopic,
    temporalRhythm,
    questionContextGuide: topicPack.guide,
    dailyPracticeRitual: topicPack.ritual,
    reflectiveQuestion: topicPack.question,
    interpretiveBoundary: '본 관점은 루소의 자연 회복·진정성 사상을 바탕으로 자기 성찰을 돕는 상징적 안내이며, 우열의 점수나 단정적 예언이 아닙니다.',
  };
}

export function formatJeanJacquesRousseauNatureAuthenticityPrompt(res: JeanJacquesRousseauNatureAuthenticityResult): string {
  return [
    `【장 자크 루소 《에밀·사회계약론》 인간 본성 자연 회복 & 진정성 지표】`,
    `- 자연적 본성 순수성 회복 흐름(Retour à la nature): ${describeRousseauQualitativeStage(res.natureInherentGoodnessScore)}`,
    `- 양심의 내적 목소리와 진정성(Authenticity): ${describeRousseauQualitativeStage(res.authenticityInnerVoiceScore)}`,
    `- 일반의지 공공선 연대감(Volonté Générale): ${describeRousseauQualitativeStage(res.generalWillSolidarityScore)}`,
    `- 건전한 자기애 자존감(Amour de soi): ${describeRousseauQualitativeStage(res.amourDeSoiSelfLoveScore)}`,
    `- 에밀식 자율적 주체성(Emile Autonomy): ${describeRousseauQualitativeStage(res.emileAutonomyEducationScore)}`,
    `- 현재 시공간 리듬 (${res.temporalRhythm.kstSlot}): ${res.temporalRhythm.rhythmTitle} — ${res.temporalRhythm.rhythmGuidance}`,
    `- 질문 맥락 맞춤 성찰 (${res.questionTopic}): ${res.questionContextGuide}`,
    `- 핵심 자연 테마: ${res.activeRousseauTheme.themeTitleKo} [${res.activeRousseauTheme.themeTitleEn}]`,
    `- 철학적 통찰: ${res.activeRousseauTheme.philosophicalInsight}`,
    `- 실천적 조언: ${res.activeRousseauTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalRousseauAphorism.aphorismKo}"`,
    `- 영문 원문: "${res.focalRousseauAphorism.aphorismEn}" [${res.focalRousseauAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalRousseauAphorism.actionGuidance}`,
    `- 오늘의 진정성 의례: ${res.dailyPracticeRitual}`,
    `- 핵심 성찰 질문: ${res.reflectiveQuestion}`,
    `- 종합 통찰 권면: ${res.rousseauComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
