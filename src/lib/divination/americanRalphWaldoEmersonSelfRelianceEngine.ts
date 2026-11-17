/**
 * 미국 랠프 월도 에머슨(Ralph Waldo Emerson) 《자기신뢰(Self-Reliance)》 & 《자연(Nature)》 오버소울(Over-Soul) 비순응 자립 지혜 엔진
 *
 * 미국 초월주의(Transcendentalism) 철학자 랠프 월도 에머슨(1803~1882)의 《자기신뢰》 및 《자연》 원전 기반:
 * 1. 자기신뢰(Self-Reliance): 외부의 권위나 사회적 편견에 휘둘리지 않는 주체적 자립
 * 2. 비순응적 진정성(Nonconformity): 군중의 유행과 거짓 일관성을 거부하고 자기 고유의 진실을 말하는 용기
 * 3. 오버소울(Over-Soul): 내면 깊숙이 흐르는 직관과 보편적 생명력에 대한 신뢰
 * 4. 자연과의 합일(Transparent Eyeball): 에고의 조급함을 비우고 자연의 리듬으로 호흡하는 투명한 응시
 * 5. 창조적 독창성(Creative Originality): 모방을 멈추고 자신만의 고유한 과업을 꽃피움
 *
 * @version LUCKEY-RALPH-WALDO-EMERSON-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_RALPH_WALDO_EMERSON_VERSION = 'LUCKEY-RALPH-WALDO-EMERSON-v2.2.0';

export type EmersonQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface EmersonTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  transcendentalInsight: string;
  practicalCounsel: string;
}

export interface EmersonAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginalEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface RalphWaldoEmersonSelfRelianceResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: EmersonQuestionTopic;
  selfReliancePosture: string;
  // 내부 계산 호환 필드 (프롬프트 비노출)
  selfRelianceAutonomyScore: number;
  overSoulDivineConnectionScore: number;
  nonconformistAuthenticityQuotient: number;
  natureSpiritualRenewalScore: number;
  creativeOriginalityPowerIndex: number;
  // 세부 분석
  activeEmersonTheme: EmersonTheme;
  focalEmersonAphorism: EmersonAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  situationalEmersonAudit: {
    focusTheme: string;
    autonomyCue: string;
    tacticalStep: string;
  };
  temporalEmersonRhythm: {
    kstTimeLabel: string;
    solitudeWindow: string;
    seasonalNatureTone: string;
    temporalGuidance: string;
  };
  emersonSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  emersonComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

function getTemporalEmersonRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const solitudeWindow =
    hour >= 5 && hour < 11
      ? '아침 투명한 눈동자창 — 타인의 평가가 스며들기 전 내면의 첫 직관을 붙잡기 좋은 시간'
      : hour >= 11 && hour < 17
        ? '정오 비순응 결단창 — 군중의 눈치를 넘어 내 소신대로 단단히 선택하기 좋은 시간'
        : hour >= 17 && hour < 22
          ? '황혼 자연 합일창 — 하루의 비교와 소음을 씻어내고 숲·하늘의 리듬으로 돌아가는 시간'
          : '심야 오버소울창 — 세상의 기준표를 덮고 내 안의 철의 현(Iron String)에 귀 기울이는 시간';

  const seasonalNatureTone =
    month >= 3 && month <= 5
      ? '봄 · 자연 소생절 (내면의 고유한 싹을 틔우는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 창조 발산절 (자기만의 땅을 힘차게 경작하는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 독립 성숙절 (어리석은 일관성을 벗고 본질만 남기는 시기)'
          : '겨울 · 고독 정진절 (조용한 자기신뢰의 뿌리를 깊게 내리는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    solitudeWindow,
    seasonalNatureTone,
    temporalGuidance: `${solitudeWindow} · ${seasonalNatureTone}의 결을 따라 자립하십시오.`,
  };
}

export const EMERSON_THEMES: EmersonTheme[] = [
  {
    themeKey: 'trust_thyself',
    themeTitleEn: 'Trust Thyself (너 자신을 믿어라)',
    themeTitleKo: '외부의 권위나 평가를 넘어 자기 내면의 신적 불꽃을 신뢰함',
    transcendentalInsight: '사람은 저마다 마음속에 번뜩이는 독창적 빛을 간직하고 있으나, 그것이 자신의 것이라는 이유만으로 무시해버리곤 합니다. 당신의 직관을 가장 먼저 신뢰하십시오.',
    practicalCounsel: '타인의 승인이나 찬사를 기다리지 마십시오. 당신의 내면에서 솟아나는 깊은 확신과 고유한 통찰을 과감히 인정하고 그것을 따라 나아가십시오.',
  },
  {
    themeKey: 'nonconformity_courage',
    themeTitleEn: 'Whoso Would Be a Man Must Be a Nonconformist (비순응의 용기)',
    themeTitleKo: '군중의 압력과 헛된 평판에 굴복하지 않고 소신을 지킴',
    transcendentalInsight: '세상 속에서 세상의 의견을 따르는 것은 쉬우며, 고독 속에서 자신의 생각을 따르는 것도 쉽습니다. 그러나 군중 한가운데서 고독의 독립성을 유지하는 자가 진정 위대합니다.',
    practicalCounsel: '모두가 예라고 할 때 거짓으로 동조하지 마십시오. 고립과 비난을 두려워하지 말고, 당신의 양심과 이성이 가리키는 정직한 방향을 단호히 표명하십시오.',
  },
  {
    themeKey: 'foolish_consistency',
    themeTitleEn: 'A Foolish Consistency is the Hobgoblin of Little Minds (어리석은 일관성 탈피)',
    themeTitleKo: '과거의 말과 행동에 얽매이지 않고 오늘 새 진리를 과감히 말함',
    transcendentalInsight: '어제 한 말에 얽매여 오늘 깨달은 새로운 진실을 부정하지 마십시오. 오직 작은 마음들만이 맹목적인 일관성에 집착합니다. 오늘 진실하다고 느끼는 바를 대포알처럼 말하십시오.',
    practicalCounsel: '과거의 선언이나 기존 계획에 스스로를 가두지 마십시오. 새로운 정보와 통찰을 얻었다면 기꺼이 어제의 오해를 인정하고 오늘의 새로운 길을 개척하십시오.',
  },
  {
    themeKey: 'transparent_eyeball',
    themeTitleEn: 'The Transparent Eyeball (투명한 눈동자 - 자연과의 일체)',
    themeTitleKo: '에고의 탐욕을 비우고 대자연의 순수 생명 흐름과 합일함',
    transcendentalInsight: '숲속에 서 있을 때 모든 비천한 욕망은 사라지고 나 자신은 무가 되지만 동시에 모든 것을 보게 됩니다. 우주 영혼의 조류가 내 혈관을 타고 흐릅니다.',
    practicalCounsel: '도시의 소음과 스크린을 잠시 벗어나 숲과 바람과 하늘을 온전히 마주하십시오. 영혼의 때를 씻어내고 우주적 활력을 내면 깊숙이 호흡하십시오.',
  },
  {
    themeKey: 'imitation_is_suicide',
    themeTitleEn: 'Imitation is Suicide (모방은 자살이다)',
    themeTitleKo: '남의 옷을 흉내 내지 않고 오직 자기 고유의 잠재력을 꽃피움',
    transcendentalInsight: '남의 밭에 떨어진 옥수수를 부러워하지 마십시오. 신은 당신에게 경작해야 할 당신만의 땅을 주었습니다. 당신만이 할 수 있는 일을 할 때 온 우주가 돕습니다.',
    practicalCounsel: '남과 비교하며 스스로를 깎아내리지 마십시오. 당신의 독특한 개성, 상처, 경험이야말로 세상에 둘도 없는 예술품을 낳을 거름입니다.',
  },
];

export const EMERSON_APHORISMS: EmersonAphorism[] = [
  {
    aphorismKey: 'iron_string',
    aphorismKo: '너 자신을 믿어라. 모든 심장은 이 철철 넘치는 철의 현에 맞추어 뛴다.',
    aphorismOriginalEn: 'Trust thyself: every heart vibrates to that iron string.',
    sourceContext: '《자기신뢰(Self-Reliance)》 서두',
    actionGuidance: '자기 회의와 망설임을 끝내고, 당신 내면의 가장 깊고 원초적인 힘을 신뢰하며 결단하십시오.',
  },
  {
    aphorismKey: 'insist_on_yourself',
    aphorismKo: '너 자신을 고집하라. 결코 남을 흉내 내지 말라.',
    aphorismOriginalEn: 'Insist on yourself; never imitate.',
    sourceContext: '《자기신뢰(Self-Reliance)》 결어부',
    actionGuidance: '외부의 모방본으로 남지 말고, 당신의 영혼에서 우러나온 독창적인 산출물과 방식을 세상에 내놓으십시오.',
  },
  {
    aphorismKey: 'speak_hard_words',
    aphorismKo: '오늘 생각한 바를 단단한 말로 거침없이 말하라. 그리고 내일은 내일 생각한 바를 다시 말하라.',
    aphorismOriginalEn: 'Speak what you think now in hard words, and to-morrow speak what to-morrow thinks.',
    sourceContext: '《자기신뢰(Self-Reliance)》',
    actionGuidance: '주변의 눈치를 보느라 생각을 검열하지 말고, 당신의 솔직하고 명확한 관점을 당당하게 전달하십시오.',
  },
  {
    aphorismKey: 'nature_heals',
    aphorismKo: '자연 속에서 인간은 영원한 젊음을 되찾는다.',
    aphorismOriginalEn: 'In the woods is perpetual youth.',
    sourceContext: '《자연(Nature)》 제1장',
    actionGuidance: '지친 심신을 자연의 리듬 속에 맡기고, 신선한 기운으로 새로운 아이디어와 활력을 충전하십시오.',
  },
  {
    aphorismKey: 'stars_glory',
    aphorismKo: '천 년에 하룻밤만 별이 뜬다면 사람들은 얼마나 경외하며 신의 도성을 우러러보겠는가.',
    aphorismOriginalEn: 'If the stars should appear one night in a thousand years, how would men believe and adore!',
    sourceContext: '《자연(Nature)》 서장',
    actionGuidance: '일상의 사소한 순간과 마주하는 사람들의 소중함을 당연하게 여기지 말고, 깊은 감사와 경이로움으로 대하십시오.',
  },
];

const TOPIC_GUIDANCE: Record<EmersonQuestionTopic, {
  posture: string;
  practice: string;
  ritual: string;
  reflection: string;
}> = {
  relationship: {
    posture: '타인의 기대에 억지로 맞추기보다 고유한 나로 서서 진실하게 만나는 비순응적 우정',
    practice: '호감을 얻기 위해 내 생각을 지우지 마십시오. 정직한 자기다움을 지킬 때 비로소 깊이 통하는 인연이 남습니다.',
    ritual: '오늘 누군가의 눈치를 보느라 삼켰던 솔직한 의견 한 가지를 부드럽지만 분명하게 정리해 보기.',
    reflection: '이 관계에서 내가 사랑받기 위해 억지로 흉내 내고 있는 모습은 무엇입니까?',
  },
  decision: {
    posture: '세상의 유행과 어제의 일관성을 넘어 내면의 철의 현(Iron String)을 따르는 결단',
    practice: '남들이 안전하다고 말하는 길이나 과거에 내뱉은 말에 묶이지 말고, 지금 내 영혼이 진실하다고 울리는 쪽을 택하십시오.',
    ritual: '외부의 시선과 체면을 지웠을 때 내가 진짜로 선택하고 싶은 안을 한 줄로 적어 보기.',
    reflection: '누구의 평가도 받지 않는다면, 나는 오늘 어떤 독창적인 선택을 내릴 것입니까?',
  },
  healing: {
    posture: '도시의 소음과 비교를 내려놓고 자연의 숨결 속에서 본래의 생기를 되찾는 회복',
    practice: '남의 밭을 부러워하며 나를 소모하지 마십시오. 잠시 스크린과 평가를 끄고 바람·햇빛·나무 아래서 나만의 리듬을 회복하십시오.',
    ritual: '하루 10분만이라도 휴대폰 없이 하늘이나 나무를 바라보며 깊게 호흡하기.',
    reflection: '비교와 조급함을 잠시 내려놓으면, 지금 내 안에 남아 있는 가장 순수한 평온은 어디에 있습니까?',
  },
  reflection: {
    posture: '모방을 멈추고 나만의 고유한 땅을 경작하는 주체적 자기신뢰의 응시',
    practice: '남의 기준표로 내 하루를 채점하지 마십시오. 오늘 내 안에서 솟아난 작은 직관과 호기심을 귀하게 대접하십시오.',
    ritual: '오늘 남을 따라 한 선택 하나와 나답게 선택한 순간 하나를 나란히 기록하기.',
    reflection: '오직 나만이 걸을 수 있고, 나만이 길러낼 수 있는 삶의 결은 무엇입니까?',
  },
};

function classifyQuestionTopic(question?: string): EmersonQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/이직|창업|사업|계약|진로|시험|합격|투자/.test(q)) {
    return 'decision';
  }
  if (/연애|사랑|결혼|이별|사람|관계|친구|가족|동료|상사|평판|눈치|갈등/.test(q)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|사업|계약|진로|방향|해야|말아야|도전/.test(q)) {
    return 'decision';
  }
  if (/지치|힘들|불안|걱정|우울|슬픔|비교|열등감|번아웃|회복|휴식/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function formatKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}

export function calculateRalphWaldoEmersonSelfReliance(
  profile: UserProfile,
  now: Date = new Date(),
  question?: string,
): RalphWaldoEmersonSelfRelianceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const kstDate = getKstDateString(now);
  const questionTopic = classifyQuestionTopic(question);

  const seedString = `RALPH-WALDO-EMERSON:${name}:${birthDate}:${birthTime}:${gender}:${kstDate}:${question ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const selfRelianceAutonomyScore = 75 + (absHash % 24);
  const overSoulDivineConnectionScore = 71 + ((absHash >> 3) % 28);
  const nonconformistAuthenticityQuotient = 73 + ((absHash >> 6) % 26);
  const natureSpiritualRenewalScore = 70 + ((absHash >> 9) % 29);
  const creativeOriginalityPowerIndex = 72 + ((absHash >> 12) % 27);

  const themeIndex = (absHash >> 4) % EMERSON_THEMES.length;
  const aphorismIndex = (absHash >> 7) % EMERSON_APHORISMS.length;

  const activeEmersonTheme = EMERSON_THEMES[themeIndex];
  const focalEmersonAphorism = EMERSON_APHORISMS[aphorismIndex];
  const topicGuide = TOPIC_GUIDANCE[questionTopic];

  const guidanceTitle = `랠프 월도 에머슨 자기신뢰·초월주의 지혜: ${activeEmersonTheme.themeTitleKo}`;
  const philosophicalCounsel = `에머슨의 자기신뢰 철학은 타인의 시선과 사회적 모방을 단호히 거부하고, 내면의 직관을 믿고 우뚝 서도록 이끕니다. ` +
    `현재 당신이 직면한 핵심 과제는 '${activeEmersonTheme.themeTitleKo}'입니다. ` +
    `${activeEmersonTheme.practicalCounsel} 아울러 에머슨의 경구 "${focalEmersonAphorism.aphorismKo}"("${focalEmersonAphorism.aphorismOriginalEn}")를 마음에 품고, ` +
    `${focalEmersonAphorism.actionGuidance}`;

  const counselNote = `'${activeEmersonTheme.themeTitleKo}' 테마와 '${focalEmersonAphorism.aphorismKo}' 경구가 어우러져 '${topicGuide.posture}'를 비춥니다.`;
  const boundaryNotice = '이 관점은 에머슨의 초월주의 철학을 바탕으로 한 상징적 성찰 안내이며, 확정적 미래 예측이나 의학적·법률적 조언이 아닙니다.';
  const temporalEmersonRhythm = getTemporalEmersonRhythm(now);
  const situationalEmersonAudit = {
    focusTheme: `${questionTopic} · 자기신뢰`,
    autonomyCue: topicGuide.posture,
    tacticalStep: topicGuide.ritual,
  };
  const emersonSynthesisMatrix = {
    coreInsight: activeEmersonTheme.themeTitleKo,
    recommendedAction: topicGuide.practice,
    cautionNotice: '남의 밭을 부러워하는 모방과 어제의 말에 매이는 어리석은 일관성을 경계하십시오.',
  };

  const trimmedQ = (question ?? '').trim();
  const reflectiveQuestion = trimmedQ
    ? `‘${trimmedQ}’라는 물음 앞에서 외부의 평판과 어제의 일관성을 내려놓는다면, 내면의 철의 현이 진실하다고 울리는 답은 무엇인가요?`
    : topicGuide.reflection;

  return {
    engineVersion: AMERICAN_RALPH_WALDO_EMERSON_VERSION,
    calculatedAtKst: temporalEmersonRhythm.kstTimeLabel,
    questionTopic,
    selfReliancePosture: topicGuide.posture,
    selfRelianceAutonomyScore,
    overSoulDivineConnectionScore,
    nonconformistAuthenticityQuotient,
    natureSpiritualRenewalScore,
    creativeOriginalityPowerIndex,
    activeEmersonTheme,
    focalEmersonAphorism,
    practiceGuidance: topicGuide.practice,
    ritualAction: topicGuide.ritual,
    reflectionFocus: topicGuide.reflection,
    reflectiveQuestion,
    counselNote,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    situationalEmersonAudit,
    temporalEmersonRhythm,
    emersonSynthesisMatrix,
    emersonComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatRalphWaldoEmersonSelfReliancePrompt(res: RalphWaldoEmersonSelfRelianceResult): string {
  return [
    `【랠프 월도 에머슨 《자기신뢰》 & 《자연》 오버소울 비순응 자립 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락 초점: ${res.questionTopic} | 자기신뢰 태도: ${res.selfReliancePosture}`,
    `- KST 시공간 리듬: ${res.temporalEmersonRhythm.solitudeWindow} / ${res.temporalEmersonRhythm.seasonalNatureTone}`,
    `- 핵심 초월주의 테마: ${res.activeEmersonTheme.themeTitleKo} [${res.activeEmersonTheme.themeTitleEn}]`,
    `- 초월주의적 통찰: ${res.activeEmersonTheme.transcendentalInsight}`,
    `- 실천적 조언: ${res.activeEmersonTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalEmersonAphorism.aphorismKo}"`,
    `- 영문 원전: "${res.focalEmersonAphorism.aphorismOriginalEn}" [${res.focalEmersonAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalEmersonAphorism.actionGuidance}`,
    `- 맥락별 실행 조언: ${res.practiceGuidance}`,
    `- 오늘의 작은 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.emersonSynthesisMatrix.coreInsight}) | 실행(${res.emersonSynthesisMatrix.recommendedAction}) | 주의(${res.emersonSynthesisMatrix.cautionNotice})`,
    `- 핵심 조언 요약: ${res.counselNote}`,
    `- 해석 경계: ${res.boundaryNotice}`,
    `- 종합 철학 권면: ${res.emersonComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
