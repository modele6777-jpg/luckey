/**
 * 스코틀랜드 아담 스미스(Adam Smith) 《도덕감정론(The Theory of Moral Sentiments)》 공정한 관찰자 & 공감·자기통제 도덕감정 지혜 엔진
 *
 * 18세기 스코틀랜드 계몽주의의 위대한 도덕철학자이자 경제학의 태두 아담 스미스(Adam Smith, 1723~1790)의 필생의 대표작 《도덕감정론(The Theory of Moral Sentiments, 1759)》 원전 기반:
 * 1. 공정한 관찰자(Impartial Spectator) 내면 양심도: 사사로운 편견과 이해관계를 벗어나 제3자의 공정하고 객관적인 눈으로 자신의 행동과 동기를 성찰하는 내적 재판관의 성숙도.
 * 2. 동반자적 공감과 동류의식(Mutual Sympathy & Fellow-feeling) 지수: 타인의 기쁨과 슬픔에 온 마음으로 공명하고 상호 이해를 빚어내는 인간 본성 고유의 공감 능력.
 * 3. 자기통제와 고결한 평정심(Self-Command & Magnanimity) 지수: 분노나 슬픔, 과도한 탐욕에 휘둘리지 않고 어떤 시련 속에서도 품위와 절제를 지켜내는 내적 절제력.
 * 4. 정의(Justice)와 인애(Beneficence)의 조화 균형도: 사회의 존립을 떠받치는 주춧돌인 엄격한 '정의'와 세상을 윤택하고 따뜻하게 가꾸는 '인애'의 아름다운 균형.
 * 5. 칭찬받을 자격(Praiseworthiness)과 내적 진실성 지수: 단순히 남들에게 칭찬을 받는 외적 평판에 그치지 않고, 진정으로 칭찬받을 만한 자격을 갖춘 고결한 인격을 지향하는 진정성.
 *
 * @version LUCKEY-ADAM-SMITH-MORAL-SENTIMENTS-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const SCOTTISH_ADAM_SMITH_VERSION = 'LUCKEY-ADAM-SMITH-MORAL-SENTIMENTS-v2.3.0';

export type AdamSmithQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface AdamSmithTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface AdamSmithAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface ScottishAdamSmithMoralSentimentsResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: AdamSmithQuestionTopic;
  moralPhase: string;
  shadowWarning: string;
  // 5대 핵심 도덕감정론 지표 (0~100)
  impartialSpectatorConscienceScore: number;    // 공정한 관찰자 내면 양심도 (Impartial Spectator Conscience)
  mutualSympathyFellowFeelingIndex: number;     // 동반자적 공감 및 동류의식 지수 (Mutual Sympathy & Fellow-Feeling)
  selfCommandEquanimityScore: number;           // 자기통제 및 고결한 평정심 (Self-Command Equanimity)
  justiceBeneficenceHarmonyIndex: number;       // 정의와 인애의 조화 균형도 (Justice & Beneficence Harmony)
  praiseworthinessIntegrityScore: number;       // 칭찬받을 자격 및 내적 진실성 (Praiseworthiness Integrity)
  // 세부 분석
  activeAdamSmithTheme: AdamSmithTheme;
  secondaryAdamSmithTheme: AdamSmithTheme;
  focalAdamSmithAphorism: AdamSmithAphorism;
  adamSmithComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  adamSmithSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatAdamSmithKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeAdamSmithStage(score: number): string {
  if (score >= 88) return '공정한 관찰자 명징기(Impartial Clarity) — 내면 양심과 상호 공감이 조화롭게 어우러져 고결한 자기통제가 자연스러운 상태';
  if (score >= 80) return '도덕 감정 성숙기(Sympathetic Poise) — 타인의 입장을 헤아리면서도 스스로의 품격과 원칙을 차분히 지키는 상태';
  return '양심의 거울 정련기(Conscience Mirror) — 사사로운 감정을 한 발 물러나 비추어 보며 균형 잡힌 판단을 세우는 상태';
}

const ADAM_SMITH_MORAL_PHASES = [
  '공감의 온도 조율(타인의 감정에 공명하되 내 마음의 중심을 고르게 가다듬는 시기)',
  '공정한 관찰자 응시(이해득실에서 한 걸음 물러나 제3자의 맑은 시선으로 자신을 살피는 시기)',
  '자기통제·품격(칭찬받기보다 스스로 떳떳한 원칙과 온정을 함께 세우는 시기)',
] as const;

const ADAM_SMITH_SHADOW_WARNINGS = [
  '공정한 관찰자의 엄정한 잣대가 스스로를 지나치게 몰아세우는 자기 비난으로 기울지 않도록 살피세요.',
  '타인의 시선과 평판(Praise)을 의식하느라 내 양심이 승인하는 진정한 가치(Praiseworthiness)를 놓치지 않도록 점검하세요.',
  '자기통제와 평정을 지키려다 마음속에서 실제로 도움을 청하고 있는 솔직한 감정까지 억누르지 않도록 유의하세요.',
] as const;

function classifyAdamSmithQuestionTopic(query?: string): AdamSmithQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/연애|사랑|사람|관계|친구|가족|동료|갈등|이별|결혼|상대/.test(q)) return 'relationship';
  if (/결정|선택|진로|이직|사업|투자|시험|공부|합격|도전|방향|계획|원칙/.test(q)) return 'decision';
  if (/불안|힘들|지치|우울|회복|위로|휴식|건강|마음|치유|고민/.test(q)) return 'healing';
  return 'reflection';
}

export const ADAM_SMITH_THEMES: AdamSmithTheme[] = [
  {
    themeKey: 'impartial_spectator_conscience',
    themeTitleEn: 'Impartial Spectator Within the Breast (가슴속 공정한 관찰자)',
    themeTitleKo: '사사로운 편견을 내려놓고 공평무사한 제3자의 눈으로 자신을 돌아봄',
    existentialInsight: '우리는 내면의 거울 없이는 자신의 참모습을 볼 수 없습니다. 가슴속에 깃든 "공정한 관찰자(Impartial Spectator)"의 엄정하고 자애로운 시선만이 오만과 자기기만을 걷어내고 바른길을 비추어줍니다.',
    practicalCounsel: '어떤 결정을 내리기 전, 이해관계에 얽히지 않은 현명하고 덕망 있는 제3자가 이 행동을 어떻게 바라볼지 스스로에게 질문하십시오. 공정한 관찰자의 승인을 얻는 길이 후회 없는 길입니다.',
  },
  {
    themeKey: 'sympathetic_fellow_feeling',
    themeTitleEn: 'Sympathetic Resonance and Fellow-feeling (가슴으로 공명하는 동류의식)',
    themeTitleKo: '타인의 처지와 감정에 진심으로 공명하여 상호 유대를 꽃피움',
    existentialInsight: '인간은 본질적으로 고립된 섬이 아닙니다. 타인의 기쁨을 함께 기뻐하고 슬픔을 가슴으로 나눌 때 영혼은 편협한 에고의 감옥을 뚫고 나와 온전한 인간성으로 확장됩니다.',
    practicalCounsel: '상대방의 입장에 서서 생각하는 공감의 폭을 넓히십시오. 계산이나 이익을 앞세우지 않고 타인의 사정에 귀 기울이는 따뜻한 태도가 세상을 바꾸는 가장 강력한 힘입니다.',
  },
  {
    themeKey: 'noble_self_command',
    themeTitleEn: 'Noble Self-Command and Magnanimity (고결한 자기통제와 의연한 품격)',
    themeTitleKo: '격한 감정이나 고난 앞에서도 평정을 잃지 않고 기품을 지킴',
    existentialInsight: '자신의 고통을 과장하여 징징대거나 분노에 휩쓸려 선을 넘는 것은 품격을 해칩니다. 격정의 파도를 다스려 의연하고 차분한 평정을 유지하는 자기통제(Self-Command)야말로 모든 덕성의 으뜸입니다.',
    practicalCounsel: '갑작스러운 억울함이나 시련을 겪더라도 충동적인 언행을 삼가십시오. 깊은 호흡으로 감정의 온도를 낮추고 침착하고 당당한 자세로 사태를 수습할 때 진정한 존경을 얻습니다.',
  },
  {
    themeKey: 'pillars_of_justice_and_beneficence',
    themeTitleEn: 'Pillars of Justice and Beneficence (정의의 기둥과 인애의 장식)',
    themeTitleKo: '타인의 권리를 침해하지 않는 엄격한 정의 위에 따뜻한 자비를 더함',
    existentialInsight: '정의(Justice)는 사회라는 거대한 건물이 무너지지 않도록 받치는 주춧돌이며, 인애(Beneficence)는 그 건물을 아름답고 살기 좋게 꾸미는 장식입니다. 원칙을 지키되 온정을 잃지 않아야 합니다.',
    practicalCounsel: '약속과 신의를 지키고 남에게 부당한 피해를 주지 않는 기본적 정의를 먼저 엄격히 세우십시오. 그리고 그 반석 위에 작은 나눔과 배려의 손길을 얹어 당신의 공동체를 빛내십시오.',
  },
  {
    themeKey: 'desiring_to_be_praiseworthy',
    themeTitleEn: 'Desiring to Be Praiseworthy (칭찬받을 자격을 갖춘 존재를 향함)',
    themeTitleKo: '값싼 겉치레 칭찬에 안주하지 않고 내면의 진실한 가치와 품격을 지향함',
    existentialInsight: '인간은 단지 칭찬받기를 원하는 것이 아니라, "진정으로 칭찬받을 만한 가치가 있는 사람(Praiseworthy)"이 되기를 소망합니다. 세상이 나를 알아주지 않더라도 양심에 비추어 떳떳한 자가 참된 승리자입니다.',
    practicalCounsel: '타인의 환호나 소셜 미디어의 좋아요 같은 외적 평가에 영혼을 저당 잡히지 마십시오. 보이지 않는 곳에서도 스스로에게 부끄럽지 않은 참된 실력과 인격을 갈고닦으십시오.',
  },
];

export const ADAM_SMITH_APHORISMS: AdamSmithAphorism[] = [
  {
    aphorismKey: 'impartial_spectator_in_breast',
    aphorismKo: '인간의 가슴속에는 위대한 판관이자 내면의 반성자인 공정한 관찰자가 자리 잡고 있으며, 그는 오직 양심의 목소리에 따라 우리의 감정과 행동을 평가한다.',
    aphorismEn: 'The inhabitant of the breast, the man within, the great judge and arbiter of our conduct, never decides but by the voice of conscience.',
    sourceContext: '《도덕감정론(The Theory of Moral Sentiments)》 제3부 제2장',
    actionGuidance: '자기합리화의 유혹을 뿌리치고, 가슴속 공정한 관찰자의 정직한 충고에 온전히 귀를 기울이십시오.',
  },
  {
    aphorismKey: 'original_sympathy_fellow_feeling',
    aphorismKo: '인간이 아무리 이기적인 존재라 할지라도, 그의 본성에는 타인의 운명에 관심을 기울이고 그들의 행복을 자신에게 필수적인 것으로 여기는 원리가 분명히 존재한다.',
    aphorismEn: 'How selfish soever man may be supposed, there are evidently some principles in his nature, which interest him in the fortune of others, and render their happiness necessary to him.',
    sourceContext: '《도덕감정론》 제1부 제1편 제1장',
    actionGuidance: '자기중심적인 계산을 내려놓고, 주변 사람들의 아픔과 기쁨을 내 일처럼 진심으로 보듬으십시오.',
  },
  {
    aphorismKey: 'self_command_foundation_of_virtues',
    aphorismKo: '자기통제는 그 자체로 가장 고귀한 미덕일 뿐만 아니라, 다른 모든 미덕들이 온전한 빛을 발할 수 있도록 지탱해 주는 반석이다.',
    aphorismEn: 'Self-command is not only itself a great virtue, but from it all the other virtues seem to derive their principal lustre.',
    sourceContext: '《도덕감정론》 제6부 제3편',
    actionGuidance: '감정의 소용돌이에 휘말리지 말고, 어떤 순간에도 품위 있는 자제력과 온화한 평정을 유지하십시오.',
  },
  {
    aphorismKey: 'praise_and_praiseworthiness',
    aphorismKo: '인간은 자연적으로 칭찬받기를 원할 뿐만 아니라, 진정으로 칭찬받을 만한 존재가 되기를 갈망한다.',
    aphorismEn: 'Man naturally desires, not only to be loved, but to be lovely; or to be that thing which is the natural and proper object of love.',
    sourceContext: '《도덕감정론》 제3부 제2장',
    actionGuidance: '세속적인 인기나 일시적인 평판에 휘둘리지 말고, 스스로에게 떳떳한 내적 존엄과 실력을 쌓으십시오.',
  },
];

export function calculateScottishAdamSmithMoralSentiments(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): ScottishAdamSmithMoralSentimentsResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const questionTopic = classifyAdamSmithQuestionTopic(query);
  const seedString = `ADAM-SMITH-MORAL-SENTIMENTS:${name}:${birthDate}:${birthTime}:${gender}:${questionTopic}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const impartialSpectatorConscienceScore = 75 + (absHash % 24);
  const mutualSympathyFellowFeelingIndex = 76 + ((absHash >> 3) % 23);
  const selfCommandEquanimityScore = 74 + ((absHash >> 6) % 25);
  const justiceBeneficenceHarmonyIndex = 77 + ((absHash >> 9) % 22);
  const praiseworthinessIntegrityScore = 73 + ((absHash >> 12) % 26);

  const themeIndex = (absHash >> 4) % ADAM_SMITH_THEMES.length;
  const secondaryThemeIndex = (themeIndex + 1 + ((absHash >> 5) % (ADAM_SMITH_THEMES.length - 1))) % ADAM_SMITH_THEMES.length;
  const aphorismIndex = (absHash >> 7) % ADAM_SMITH_APHORISMS.length;

  const activeAdamSmithTheme = ADAM_SMITH_THEMES[themeIndex];
  const secondaryAdamSmithTheme = ADAM_SMITH_THEMES[secondaryThemeIndex];
  const focalAdamSmithAphorism = ADAM_SMITH_APHORISMS[aphorismIndex];
  const moralPhase = ADAM_SMITH_MORAL_PHASES[(absHash >> 10) % ADAM_SMITH_MORAL_PHASES.length];
  const shadowWarning = ADAM_SMITH_SHADOW_WARNINGS[(absHash >> 13) % ADAM_SMITH_SHADOW_WARNINGS.length];

  const guidanceTitle = `아담 스미스 도덕감정론 공정한 관찰자와 자기통제 지혜: ${activeAdamSmithTheme.themeTitleKo}`;
  const philosophicalCounsel = `스코틀랜드 계몽주의의 거장 아담 스미스의 도덕감정론 사상은 가슴속 공정한 관찰자(Impartial Spectator)를 통한 양심의 성찰, 타인과의 가슴 깊은 동반자적 공감, 시련을 품위 있게 이겨내는 자기통제(Self-Command), 그리고 칭찬받을 자격(Praiseworthiness)을 갖추려는 진정한 도덕적 품격을 일깨웁니다. ` +
    `현재 당신의 삶을 인도하는 도덕철학적 원리는 '${activeAdamSmithTheme.themeTitleKo}'(보조 원리: ${secondaryAdamSmithTheme.themeTitleKo})입니다. ` +
    `${activeAdamSmithTheme.practicalCounsel} 아울러 《도덕감정론》 원전의 명언 "${focalAdamSmithAphorism.aphorismKo}"(${focalAdamSmithAphorism.aphorismEn})를 깊이 마음에 새기고, ` +
    `${focalAdamSmithAphorism.actionGuidance}`;

  const calculatedAtKst = formatAdamSmithKstTimestamp(now);
  const composite = Math.round(
    (impartialSpectatorConscienceScore + mutualSympathyFellowFeelingIndex + selfCommandEquanimityScore + justiceBeneficenceHarmonyIndex + praiseworthinessIntegrityScore) / 5
  );
  const adamSmithSynthesisMatrix = {
    dominantTension: `${activeAdamSmithTheme.themeTitleKo} ↔ ${secondaryAdamSmithTheme.themeTitleKo}`,
    alignmentState: describeAdamSmithStage(composite),
    integratedAction: `${focalAdamSmithAphorism.actionGuidance} (${moralPhase})${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };
  const trimmedQ = query?.trim() ?? '';
  const reflectiveQuestion = trimmedQ
    ? `'${moralPhase}' 국면에서 지금 고민하시는 '${trimmedQ}' 앞에서, 사사로운 이해관계를 비운 가슴속 공정한 관찰자(Impartial Spectator)는 어떤 태도를 가장 품위 있게 승인하겠습니까?`
    : `'${moralPhase}' 국면에서 오늘 마주한 선택 가운데 세속의 평판(Praise)보다 내면의 양심이 스스로 칭찬받을 만하다고 여기는(Praiseworthiness) 기준은 무엇입니까?`;
  const interpretiveBoundary = '이 리포트는 아담 스미스 《도덕감정론》의 공정한 관찰자와 공감 철학을 바탕으로 한 성찰 비유이며, 윤리적 단정이나 미래 예측이 아닙니다.';

  const ritualAction = `[${activeAdamSmithTheme.themeTitleKo}] ${focalAdamSmithAphorism.actionGuidance} (${moralPhase})`;
  const reflectionFocus = `아담 스미스 도덕감정론(${activeAdamSmithTheme.themeKey} · ${moralPhase}) — ${secondaryAdamSmithTheme.themeTitleKo}`;

  return {
    engineVersion: SCOTTISH_ADAM_SMITH_VERSION,
    calculatedAtKst,
    questionTopic,
    moralPhase,
    shadowWarning,
    impartialSpectatorConscienceScore,
    mutualSympathyFellowFeelingIndex,
    selfCommandEquanimityScore,
    justiceBeneficenceHarmonyIndex,
    praiseworthinessIntegrityScore,
    activeAdamSmithTheme,
    secondaryAdamSmithTheme,
    focalAdamSmithAphorism,
    adamSmithComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    adamSmithSynthesisMatrix,
  };
}

export function formatScottishAdamSmithMoralSentimentsPrompt(res: ScottishAdamSmithMoralSentimentsResult): string {
  const composite = Math.round(
    (res.impartialSpectatorConscienceScore + res.mutualSympathyFellowFeelingIndex + res.selfCommandEquanimityScore + res.justiceBeneficenceHarmonyIndex + res.praiseworthinessIntegrityScore) / 5
  );
  const lines = [
    `【아담 스미스 《도덕감정론》 공정한 관찰자 & 공감·자기통제 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진 버전: ${res.engineVersion} | 질문 맥락: ${res.questionTopic}`,
    `- 도덕감정 성숙 국면: ${describeAdamSmithStage(composite)}`,
    `- 공정한 관찰자 국면: ${res.moralPhase}`,
    `- 핵심 도덕감정 테마: ${res.activeAdamSmithTheme.themeTitleKo} [${res.activeAdamSmithTheme.themeTitleEn}]`,
    `- 보조 교차 테마: ${res.secondaryAdamSmithTheme.themeTitleKo} [${res.secondaryAdamSmithTheme.themeTitleEn}]`,
    `- 과잉·경계 점검: ${res.shadowWarning}`,
    `- 실존적 통찰: ${res.activeAdamSmithTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeAdamSmithTheme.practicalCounsel}`,
    `- 핵심 원전 명언: "${res.focalAdamSmithAphorism.aphorismKo}" [${res.focalAdamSmithAphorism.aphorismEn}]`,
    `- 원전 출처: [${res.focalAdamSmithAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalAdamSmithAphorism.actionGuidance}`,
    `- 종합 도덕감정 철학 권면: ${res.adamSmithComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.adamSmithSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.adamSmithSynthesisMatrix.dominantTension} | 조율 상태: ${res.adamSmithSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.adamSmithSynthesisMatrix.integratedAction}`,
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
