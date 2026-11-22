/**
 * 스코틀랜드 데이비드 흄(David Hume) 《인간 본성에 관한 논고(A Treatise of Human Nature)》 & 《도덕 원리에 관한 탐구》 온건한 회의주의(Mitigated Skepticism) & 공감(Sympathy)·온유한 평정 지혜 엔진
 *
 * 스코틀랜드 계몽주의와 경험론의 최고봉 데이비드 흄(David Hume, 1711~1776)의 불후의 고전 《인간 본성에 관한 논고(A Treatise of Human Nature, 1739~1740)》 및 《도덕 원리에 관한 탐구(An Enquiry Concerning the Principles of Morals, 1751)》 원전 기반:
 * 1. 온건한 회의주의(Mitigated Skepticism): 절대적 확신이나 독단적 도그마에 매몰되지 않고, 지적 겸손과 균형감으로 인과적 가설을 유연하게 열어두는 비판적 지성.
 * 2. 공감(Sympathy / Empathy)과 인류애(Benevolence): 타인의 기쁨과 고통을 거울처럼 감응하여 함께 나누는 따뜻한 연민과 도덕적 감정의 원천.
 * 3. 정념과 실천적 이성의 조화(Passions & Practical Reason): "이성은 정념의 노예"라는 명제처럼, 차가운 사변을 넘어 인간 삶을 실제로 움직이는 건강한 열망과 정서의 가치를 긍정함.
 * 4. 관습과 경험의 실용적 삶의 안내(Custom as the Great Guide of Life): 공허한 형이상학 대신 세월 속에 검증된 상식과 누적된 경험을 존중하는 실용적 슬기.
 * 5. 극단과 광신을 경계하는 온유한 평정심(Gentle Philosophical Composure): 심오한 철학적 회의 속에서도 친구들과의 대화와 유쾌한 웃음을 잃지 않는 명랑하고 온유한 삶의 균형.
 *
 * @version LUCKEY-DAVID-HUME-TREATISE-HUMAN-NATURE-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const SCOTTISH_DAVID_HUME_VERSION = 'LUCKEY-DAVID-HUME-TREATISE-HUMAN-NATURE-v2.3.0';

export type HumeQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface HumeTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface HumeAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface DavidHumeTreatiseHumanNatureResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: HumeQuestionTopic;
  humePhase: string;
  shadowWarning: string;
  // 5대 핵심 흄 인간 본성 & 공감 지표 (0~100)
  mitigatedSkepticismScore: number;             // 온건한 회의주의(Mitigated Skepticism) 및 독단적 도그마 탈피도
  sympathyBenevolenceEmpathyScore: number;      // 공감(Sympathy)과 온정적 인류애·도덕 감정 지수
  passionsReasonHarmonyScore: number;           // 정념과 이성의 따스한 현실적 조화도 (Passions & Reason)
  customExperienceWisdomIndex: number;          // 경험과 관습(Custom)의 실용적 삶의 지혜
  gentleComposurePeaceScore: number;            // 극단과 광신을 경계하는 온유한 평정심 (Gentle Composure)
  // 세부 분석
  activeHumeTheme: HumeTheme;
  secondaryHumeTheme: HumeTheme;
  focalHumeAphorism: HumeAphorism;
  humeComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  humeSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatHumeKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeHumeStage(score: number): string {
  if (score >= 86) return '온유한 철학적 평정(Gentle Composure) — 독단을 내려놓고 따뜻한 공감과 명랑한 균형으로 일상을 누리는 상태';
  if (score >= 78) return '온건한 회의와 공감(Mitigated Sympathy) — 성급한 확신을 거두고 상식과 경험의 지혜로 유연하게 조율하는 상태';
  return '경험의 시선 회복(Common Life Anchor) — 공허한 사변에서 벗어나 살아있는 정념과 현실 감각을 되찾는 상태';
}

const HUME_PHASES = [
  '온건한 회의(성급한 단정과 편견을 내려놓고 사실과 경험의 여백을 여는 시기)',
  '공감의 거울(타인의 기쁨과 고충을 내 마음의 진동으로 함께 헤아리는 시기)',
  '온유한 평정(복잡한 사변을 벗어나 일상의 상식과 명랑한 균형을 회복하는 시기)',
] as const;

const HUME_SHADOW_WARNINGS = [
  '온건한 회의주의가 해야 할 결단까지 끝없이 미루는 우유부단함으로 기울지 않도록 살피세요.',
  '타인과의 공감이 지나쳐 상대방의 불안과 감정적 짐까지 내 책임으로 떠안지 않도록 경계를 챙기세요.',
  '일상의 관습과 상식을 존중하되, 이미 달라진 현실 앞에서 변화가 필요한 신호까지 덮어두지 마세요.',
] as const;

function classifyHumeQuestionTopic(query?: string): HumeQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/연애|사랑|사람|관계|친구|가족|동료|갈등|이별|결혼|상대/.test(q)) return 'relationship';
  if (/결정|선택|진로|이직|사업|투자|시험|공부|합격|도전|방향|계획|균형/.test(q)) return 'decision';
  if (/불안|힘들|지치|우울|회복|위로|휴식|건강|마음|치유|고민/.test(q)) return 'healing';
  return 'reflection';
}

export const HUME_THEMES: HumeTheme[] = [
  {
    themeKey: 'mitigated_skepticism',
    themeTitleEn: 'Mitigated Skepticism (온건한 회의주의와 지적 겸손)',
    themeTitleKo: '절대적 확신의 오만을 내려놓고 열린 탐구와 지적 겸손을 유지함',
    existentialInsight: '인간의 지성은 유한하며 우리가 당연하다고 믿는 인과관계조차 습관적 기대에 기초할 때가 많습니다. 독단적인 아집을 버리고 언제나 틀릴 수 있음을 겸허히 인정할 때 참된 지혜가 싹틉니다.',
    practicalCounsel: '"내가 무조건 맞다"는 성급한 확신을 내려놓으십시오. 다른 관점과 새로운 사실에 유연하게 귀를 기울일 때 시야가 비약적으로 넓어집니다.',
  },
  {
    themeKey: 'sympathy_and_benevolence',
    themeTitleEn: 'Sympathy and Moral Sentiment (공감과 도덕 감정의 회복)',
    themeTitleKo: '타인의 고통과 기쁨에 가슴으로 공명하는 따뜻한 연대의 힘',
    existentialInsight: '우리를 진정으로 선하게 만드는 것은 차가운 도덕 법칙이 아니라 타인의 처지를 내 것처럼 느끼는 공감(Sympathy)의 힘입니다. 온정적 감응이야말로 사회를 지탱하는 가장 단단한 끈입니다.',
    practicalCounsel: '상대방의 약점이나 실수를 논리적으로 비판하기 전에, 그가 겪고 있을 외로움과 고뇌를 먼저 헤아리십시오. 따스한 공감 한마디가 백 마디 논쟁보다 강합니다.',
  },
  {
    themeKey: 'passions_guiding_practical_action',
    themeTitleEn: 'Passions Guiding Practical Action (삶을 움직이는 건강한 정념)',
    themeTitleKo: '차가운 관념 대신 살아 숨 쉬는 열망과 따스한 감정을 긍정함',
    existentialInsight: '이성은 방향을 제시할 뿐, 우리 발걸음을 실제로 내딛게 만드는 것은 가슴속에서 솟구치는 살아있는 열정과 애정입니다. 건강한 정념이야말로 삶을 아름답게 가꾸는 추진체입니다.',
    practicalCounsel: '머리로만 재고 따지느라 첫 발걸음을 떼지 못하고 있다면, 당신의 마음을 뛰게 하는 순수한 열망을 따르십시오. 진심 어린 열정이 최선의 길을 찾아냅니다.',
  },
  {
    themeKey: 'custom_and_common_life',
    themeTitleEn: 'Custom as the Guide of Life (관습과 상식의 슬기로운 안내)',
    themeTitleKo: '허황된 사변을 떠나 일상의 경험과 세월이 빚어낸 상식을 존중함',
    existentialInsight: '탁상공론의 극단적인 사변은 불안과 허무를 낳기 쉽습니다. 인류가 오랜 세월 축적해 온 소박한 상식과 평범한 일상의 리듬에 발을 붙일 때 삶은 가장 든든하고 평온해집니다.',
    practicalCounsel: '복잡하고 비현실적인 공론에 빠져들지 마십시오. 오늘 내게 주어진 평범한 일상, 가족과 동료들과의 식사, 정직한 땀방울 속에서 삶의 확실성을 되찾으십시오.',
  },
  {
    themeKey: 'cheerfulness_and_gentle_calm',
    themeTitleEn: 'Cheerfulness and Gentle Calm (유쾌함과 온유한 평정심)',
    themeTitleKo: '어두운 광신과 편협함을 물리치고 밝고 온유한 심령을 지킴',
    existentialInsight: '진정한 철학자는 세상을 비관하거나 엄숙한 척 위선을 떨지 않습니다. 깊은 사색을 거친 뒤에도 친구들과 유쾌하게 주사위 놀이를 즐길 수 있는 온유하고 밝은 심성이 최고의 덕목입니다.',
    practicalCounsel: '지나치게 엄숙해지거나 비관적인 생각에 갇히지 마십시오. 가벼운 유머와 편안한 미소로 일상의 사소한 시비를 넘길 때 내면의 평화가 자연스럽게 깃듭니다.',
  },
];

export const HUME_APHORISMS: HumeAphorism[] = [
  {
    aphorismKey: 'be_a_philosopher_be_still_a_man',
    aphorismKo: '철학자가 되라. 그러나 그대의 모든 철학 속에서도 여전히 한 사람의 따뜻한 인간으로 남아 있어라.',
    aphorismEn: 'Be a philosopher; but, amidst all your philosophy, be still a man.',
    sourceContext: '《인간 오성에 관한 탐구(An Enquiry Concerning Human Understanding)》 제1절',
    actionGuidance: '이론이나 원칙에 매몰되어 사람의 체온을 잃어버리지 않도록 항상 따스한 인간미를 간직하십시오.',
  },
  {
    aphorismKey: 'reason_slave_of_passions',
    aphorismKo: '이성은 정념의 노예이며 오직 그래야만 한다. 이성은 정념에 봉사하고 복종하는 것 외에 다른 역할을 주장할 수 없다.',
    aphorismEn: 'Reason is, and ought only to be the slave of the passions, and can never pretend to any other office than to serve and obey them.',
    sourceContext: '《인간 본성에 관한 논고(A Treatise of Human Nature)》 제2권 제3부 §3',
    actionGuidance: '차가운 논리만으로 사람의 마음을 꺾으려 하지 말고, 사람들의 진실한 감정과 열망을 존중하십시오.',
  },
  {
    aphorismKey: 'propensity_to_sympathize',
    aphorismKo: '인간 본성에서 가장 현저한 성향은 타인과 공감하고 그들의 감정과 의견을 거울처럼 함께 나누는 능력이다.',
    aphorismEn: 'No quality in human nature is more remarkable than that propensity we have to sympathize with others...',
    sourceContext: '《인간 본성에 관한 논고》 제2권 제1부 §11',
    actionGuidance: '고립된 자아의 성벽을 허물고, 주변 사람들의 마음을 따스하게 어루만지는 공감의 다리를 놓으십시오.',
  },
  {
    aphorismKey: 'custom_great_guide',
    aphorismKo: '관습은 인간 삶의 위대한 안내자다. 오직 관습만이 우리의 경험을 유용하게 만들어 준다.',
    aphorismEn: 'Custom, then, is the great guide of human life. It is that principle alone which renders our experience useful to us.',
    sourceContext: '《인간 오성에 관한 탐구》 제5절',
    actionGuidance: '극단적인 뒤흔들기보다 오랜 경험 속에서 형성된 건전한 습관과 생활의 지혜를 신뢰하십시오.',
  },
];

export function calculateDavidHumeTreatiseHumanNature(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): DavidHumeTreatiseHumanNatureResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const questionTopic = classifyHumeQuestionTopic(query);
  const seedString = `DAVID-HUME-TREATISE-HUMAN-NATURE:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const mitigatedSkepticismScore = 73 + (absHash % 25);
  const sympathyBenevolenceEmpathyScore = 76 + ((absHash >> 3) % 23);
  const passionsReasonHarmonyScore = 74 + ((absHash >> 6) % 25);
  const customExperienceWisdomIndex = 72 + ((absHash >> 9) % 27);
  const gentleComposurePeaceScore = 75 + ((absHash >> 12) % 24);

  const themeIndex = (absHash >> 4) % HUME_THEMES.length;
  const secondaryThemeIndex = (themeIndex + 1 + ((absHash >> 5) % (HUME_THEMES.length - 1))) % HUME_THEMES.length;
  const aphorismIndex = (absHash >> 7) % HUME_APHORISMS.length;

  const activeHumeTheme = HUME_THEMES[themeIndex];
  const secondaryHumeTheme = HUME_THEMES[secondaryThemeIndex];
  const focalHumeAphorism = HUME_APHORISMS[aphorismIndex];
  const humePhase = HUME_PHASES[(absHash >> 10) % HUME_PHASES.length];
  const shadowWarning = HUME_SHADOW_WARNINGS[(absHash >> 13) % HUME_SHADOW_WARNINGS.length];

  const guidanceTitle = `데이비드 흄 온건한 회의주의와 공감 지혜: ${activeHumeTheme.themeTitleKo}`;
  const philosophicalCounsel = `데이비드 흄의 경험주의와 인간학은 오만한 독단주의를 경계하고, 타인을 향한 따뜻한 공감(Sympathy)과 온유한 평정심으로 일상의 행복을 누리도록 이끕니다. ` +
    `현재 당신의 삶을 인도하는 경험론적 성찰 원리는 '${activeHumeTheme.themeTitleKo}'입니다. ` +
    `${activeHumeTheme.practicalCounsel} 아울러 주저 《인간 오성에 관한 탐구》의 명구 "${focalHumeAphorism.aphorismKo}"(${focalHumeAphorism.aphorismEn})를 깊이 새기고, ` +
    `${focalHumeAphorism.actionGuidance}`;

  const calculatedAtKst = formatHumeKstTimestamp(now);
  const composite = Math.round(
    (mitigatedSkepticismScore + sympathyBenevolenceEmpathyScore + passionsReasonHarmonyScore + customExperienceWisdomIndex + gentleComposurePeaceScore) / 5
  );
  const humeSynthesisMatrix = {
    dominantTension: `${activeHumeTheme.themeTitleKo} ↔ ${secondaryHumeTheme.themeTitleKo}`,
    alignmentState: describeHumeStage(composite),
    integratedAction: `${focalHumeAphorism.actionGuidance} (${humePhase})${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };
  const trimmedQ = query?.trim() ?? '';
  const reflectiveQuestion = trimmedQ
    ? `'${humePhase}' 국면에서 지금 고민하시는 '${trimmedQ}'에서 성급한 독단을 한 걸음 거두고 경험과 온유한 공감(Sympathy)으로 다시 바라보면 어떤 유연한 길이 보입니까?`
    : `'${humePhase}' 국면에서 오늘 붙잡고 있는 확신 가운데, 온건한 회의주의의 여백과 타인을 향한 따뜻한 공감을 함께 열어 둘 부분은 어디입니까?`;
  const interpretiveBoundary = '이 리포트는 데이비드 흄의 경험론과 인간 본성론 철학을 바탕으로 한 성찰 비유이며, 사실적 인과 단정이나 미래 예측이 아닙니다.';

  const ritualAction = `[${activeHumeTheme.themeTitleKo}] ${focalHumeAphorism.actionGuidance} (${humePhase})`;
  const reflectionFocus = `데이비드 흄 인간 본성론(${activeHumeTheme.themeKey} · ${humePhase}) — ${secondaryHumeTheme.themeTitleKo}`;

  return {
    engineVersion: SCOTTISH_DAVID_HUME_VERSION,
    calculatedAtKst,
    questionTopic,
    humePhase,
    shadowWarning,
    mitigatedSkepticismScore,
    sympathyBenevolenceEmpathyScore,
    passionsReasonHarmonyScore,
    customExperienceWisdomIndex,
    gentleComposurePeaceScore,
    activeHumeTheme,
    secondaryHumeTheme,
    focalHumeAphorism,
    humeComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    humeSynthesisMatrix,
  };
}

export function formatDavidHumeTreatiseHumanNaturePrompt(res: DavidHumeTreatiseHumanNatureResult): string {
  const composite = Math.round(
    (res.mitigatedSkepticismScore + res.sympathyBenevolenceEmpathyScore + res.passionsReasonHarmonyScore + res.customExperienceWisdomIndex + res.gentleComposurePeaceScore) / 5
  );
  const lines = [
    `【데이비드 흄 《인간 본성에 관한 논고》 온건한 회의주의 & 공감 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진 버전: ${res.engineVersion} | 질문 맥락: ${res.questionTopic}`,
    `- 경험론적 평정 국면: ${describeHumeStage(composite)}`,
    `- 인간 본성 국면: ${res.humePhase}`,
    `- 핵심 경험론 테마: ${res.activeHumeTheme.themeTitleKo} [${res.activeHumeTheme.themeTitleEn}]`,
    `- 보조 교차 테마: ${res.secondaryHumeTheme.themeTitleKo} [${res.secondaryHumeTheme.themeTitleEn}]`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 실존적 통찰: ${res.activeHumeTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeHumeTheme.practicalCounsel}`,
    `- 핵심 원전 경구: "${res.focalHumeAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalHumeAphorism.aphorismEn}" [${res.focalHumeAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHumeAphorism.actionGuidance}`,
    `- 종합 경험주의 철학 권면: ${res.humeComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.humeSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.humeSynthesisMatrix.dominantTension} | 조율 상태: ${res.humeSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.humeSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  );
  return lines.join('\n');
}
