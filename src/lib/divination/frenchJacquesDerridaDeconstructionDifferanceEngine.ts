/**
 * 프랑스 자크 데리다(Jacques Derrida) 《그라마톨로지》 & 《마르크스의 유령들》 해체(Deconstruction)·차연(Différance)·미결정성(Undecidability)·조건 없는 환대·아포리아 돌파 지혜 엔진
 *
 * 20세기 후기구조주의와 해체철학의 거장 자크 데리다(1930~2004)의 원전 기반:
 * 1. 차연(Différance) 및 공간적 차이·시간적 지연 유연성 지표 (Différance Spatialization & Temporal Deferral Score): 고정된 단 하나의 정답에 갇히지 않고, 의미의 끊임없는 생성과 생성 사이의 여백을 허용하는 유연한 사유력.
 * 2. 이분법적 이항대립 해체력 (Binary Opposition Deconstruction Index): 선/악, 안/밖, 중심/주변 등 상투적 위계와 억압적 이분법을 뒤집고 새로운 제3의 해방적 지평을 여는 비판적 통찰력.
 * 3. 아포리아(Aporia) 대면 및 역설적 돌파 결단력 (Aporia Confrontation & Paradoxical Leap Score): 이러지도 저러지도 못하는 막다른 골목(아포리아)을 피하지 않고 응시하여 불가능성을 창조적 결단으로 전환하는 용기.
 * 4. 조건 없는 환대 및 타자성 포용 지수 (Unconditional Hospitality & Alterity Openness Index): 내 계산과 규칙을 타자에게 강요하지 않고, 예기치 않은 사건과 낯선 다름을 기꺼이 맞아들이는 열린 포용력.
 * 5. 파르마콘(Pharmakon: 독이자 약) 양면성 변용 치유력 (Pharmakon Dual-Nature Alchemy Score): 나를 위협하거나 고통스럽게 만드는 위기 속에서 오히려 가장 강력한 치유와 혁신의 약효를 길어 올리는 연금술적 지혜.
 *
 * @version LUCKEY-JACQUES-DERRIDA-DECONSTRUCTION-DIFFERANCE-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const FRENCH_JACQUES_DERRIDA_DECONSTRUCTION_DIFFERANCE_VERSION = 'LUCKEY-JACQUES-DERRIDA-DECONSTRUCTION-DIFFERANCE-v2.1.0';

export interface DerridaTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface DerridaAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismFrench: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FrenchJacquesDerridaDeconstructionDifferanceResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 자크 데리다 핵심 지표 (0~100)
  differancePostponementSpacializationScore: number; // 차연 및 의미 생성 지연·차이 유연성 지표 (Différance Spatialization & Deferral)
  binaryOppositionDeconstructionIndex: number;       // 이항대립 해체 및 제3의 지평 개척력 (Binary Opposition Deconstruction)
  aporiaBreakthroughResolutionScore: number;         // 아포리아 대면 및 역설적 결단력 (Aporia Breakthrough & Decision)
  unconditionalHospitalityEmpathyIndex: number;      // 조건 없는 환대 및 타자성 포용 지수 (Unconditional Hospitality & Alterity)
  pharmakonTransformativeHealingScore: number;       // 파르마콘 양면성 변용 치유력 (Pharmakon Dual-Nature Healing Alchemy)
  // 세부 분석
  activeDerridaTheme: DerridaTheme;
  focalDerridaAphorism: DerridaAphorism;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  derridaSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  derridaComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const DERRIDA_THEMES: DerridaTheme[] = [
  {
    themeKey: 'differanceOpenness',
    themeTitleEn: 'Différance: Embracing Spatial Distinction and Temporal Deferral for Endless Creativity',
    themeTitleKo: '차연(Différance)의 여백 — 성급한 결론에 갇히지 않고 의미의 지연과 차이를 품기',
    pragmaticInsight: '데리다의 차연(Différance)은 다름(différer, 차이나다)과 미룸(différer, 지연하다)의 결합입니다. 절대적이고 닫힌 하나의 완벽한 정답이란 존재하지 않으며, 의미는 끊임없이 앞으로 미루어지며 새롭게 생성됩니다.',
    practicalCounsel: '모든 것을 지금 당장 흑백으로 결판내려 조급해하지 마십시오. 판단을 잠시 보류하고 여백을 둘 때, 미처 보지 못했던 혁신적인 가능성과 다채로운 기회가 자연스럽게 모습을 드러냅니다.',
  },
  {
    themeKey: 'deconstructingBinaries',
    themeTitleEn: 'Deconstructing Hierarchies: Overturning Fixed Dualisms to Discover Third Paths',
    themeTitleKo: '이항대립의 해체 — 우열과 위계의 틀을 깨부수고 창조적인 제3의 길 열어젖히기',
    pragmaticInsight: '우리의 사고는 중심/주변, 성공/실패, 강함/약함이라는 억압적 이분법에 갇히기 쉽습니다. 해체(Deconstruction)는 파괴가 아니라, 은폐된 편견의 위계를 전복하고 고정관념 바깥의 자유로운 지평을 열어내는 해방의 사유입니다.',
    practicalCounsel: '문제를 ‘이것 아니면 저것’이라는 양자택일의 함정에 가두지 마십시오. 버려지거나 열등하다고 치부되었던 주변부의 가치를 재조명하십시오. 그 소외된 가장자리에 핵심을 뒤흔들 반전의 열쇠가 있습니다.',
  },
  {
    themeKey: 'aporiaCourageousDecision',
    themeTitleEn: 'Confronting Aporia: Crossing the Impasse of Impossibility into Authentic Decision',
    themeTitleKo: '아포리아의 돌파 — 막다른 길목의 불가능성을 통과하여 진정한 주체적 결단 내리기',
    pragmaticInsight: '규칙과 공식이 훤히 보이는 길을 걷는 것은 진정한 결단이 아닙니다. 데리다의 아포리아(Aporia)는 길이 없는 막다른 교착 상태를 뜻하며, 참된 결단은 바로 이 아포리아의 고통을 온몸으로 통과할 때만 탄생합니다.',
    practicalCounsel: '상황이 완전히 막혀 도무지 답이 보이지 않는 순간을 두려워하지 마십시오. 기계적인 매뉴얼이 무너진 바로 그 자리에서, 당신 자신의 신념을 건 대담하고 독창적인 결단이 기적을 빚어냅니다.',
  },
  {
    themeKey: 'pharmakonTransformation',
    themeTitleEn: 'Pharmakon Alchemy: Transforming Poisonous Obstacles into Potent Remedial Elixirs',
    themeTitleKo: '파르마콘의 연금술 — 나를 괴롭히는 독(독약)을 가장 강력한 치유의 약으로 전환하기',
    pragmaticInsight: '플라톤의 파르마콘(Pharmakon)은 ‘독’인 동시에 ‘약’입니다. 우리의 인생에서 우리를 가장 아프게 찌르는 결핍이나 상처, 위기는 거꾸로 우리를 가장 강인하고 독보적이게 만드는 위대한 명약이 될 수 있습니다.',
    practicalCounsel: '현재 겪고 있는 결핍이나 장애물을 단순한 불행으로 단정하지 마십시오. 독 속에 숨겨진 약효를 발견하고, 그 상처를 깊은 공감력과 독보적인 경쟁력의 원천으로 뒤바꾸십시오.',
  },
];

export const DERRIDA_APHORISMS: DerridaAphorism[] = [
  {
    aphorismKey: 'noOutsideText',
    aphorismKo: '텍스트 바깥은 없다. 모든 것은 맥락 속에 있으며, 맥락을 새롭게 읽을 때 세계가 다시 쓰인다.',
    aphorismFrench: "Il n'y a pas de hors-texte.",
    sourceContext: '자크 데리다 《그라마톨로지(De la grammatologie)》',
    actionGuidance: '주어진 상황을 고정된 불변의 운명으로 보지 마십시오. 당신의 관점과 해석의 맥락을 전환하여 상황의 의미를 주체적으로 재구성하십시오.',
  },
  {
    aphorismKey: 'undecidabilityDecision',
    aphorismKo: '미결정성의 시련을 거치지 않은 결정은 결코 참된 결정이 아니다. 그것은 단지 프로그램화된 계산에 불과하다.',
    aphorismFrench: "Une décision qui ne passerait pas par l'épreuve de l'indécidable ne serait pas une décision libre, ce ne serait que l'application programmable.",
    sourceContext: '자크 데리다 《법의 힘(Force de loi)》',
    actionGuidance: '쉬운 공식이나 남의 정답에 기대지 마십시오. 고뇌와 망설임의 깊은 사유를 통과할 때 비로소 진정한 자유로운 결단이 완성됩니다.',
  },
  {
    aphorismKey: 'pureHospitality',
    aphorismKo: '순수한 환대란 대가를 바라지 않고, 신원을 묻지 않으며, 문을 열고 예상치 못한 타자를 맞이하는 것이다.',
    aphorismFrench: "L'hospitalité pure consiste à accueillir celui qui arrive avant de lui poser des conditions.",
    sourceContext: '자크 데리다 《환대에 대하여(De l\'hospitalité)》',
    actionGuidance: '상대방에게 당신의 조건과 잣대를 들이대며 통제하려 하지 마십시오. 낯선 생각과 새로운 인연을 너그러운 열린 마음으로 환대하십시오.',
  },
  {
    aphorismKey: 'spectersOfJustice',
    aphorismKo: '정의란 결코 현재에 완전히 닫혀 고정될 수 없다. 그것은 언제나 도래해야 할 타자를 향해 열려 있는 약속이다.',
    aphorismFrench: "La justice, si elle a lieu, c'est l'avenir même, c'est ce qui reste à venir.",
    sourceContext: '자크 데리다 《마르크스의 유령들(Spectres de Marx)》',
    actionGuidance: '과거의 성과에 안주하거나 교만해지지 마십시오. 언제나 더 나은 미래와 더 큰 공평함을 향해 시선을 열어두고 전진하십시오.',
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

function describeDerridaStage(score: number): string {
  if (score >= 95) return '매우 깊고 명료하게 살아 움직이는 국면';
  if (score >= 91) return '안정적으로 깨어나 유연하게 작동하는 흐름';
  return '조용히 여백을 열어 두고 숙성되는 단계';
}

export function calculateFrenchJacquesDerridaDeconstructionDifferance(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): FrenchJacquesDerridaDeconstructionDifferanceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const seedString = `JACQUES-DERRIDA-DECONSTRUCTION-DIFFERANCE:${name}:${birthDate}:${birthTime}:${gender}:${kstDate}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const differancePostponementSpacializationScore = 89 + ((absHash >> 1) % 10);
  const binaryOppositionDeconstructionIndex = 88 + ((absHash >> 4) % 11);
  const aporiaBreakthroughResolutionScore = 87 + ((absHash >> 7) % 12);
  const unconditionalHospitalityEmpathyIndex = 89 + ((absHash >> 10) % 10);
  const pharmakonTransformativeHealingScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % DERRIDA_THEMES.length;
  const aphorismIndex = (absHash >> 8) % DERRIDA_APHORISMS.length;

  const activeDerridaTheme = DERRIDA_THEMES[themeIndex];
  const focalDerridaAphorism = DERRIDA_APHORISMS[aphorismIndex];

  const guidanceTitle = `자크 데리다 해체와 차연의 지혜: ${activeDerridaTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 현대 사상을 뒤흔든 해체철학의 거장 자크 데리다 선생은 《그라마톨로지》와 《법의 힘》을 통해 ` +
    `상투적 이분법의 억압을 깨뜨리는 차연(Différance)의 사유, 도달 불가능한 완결 대신 끊임없이 의미를 새롭게 여는 미결정성의 시련, ` +
    `그리고 막다른 골목(Aporia)을 통과하는 대담한 주체적 결단과 낯선 타자를 향한 조건 없는 환대를 역설했습니다. ` +
    `현재 당신이 마주한 상황에서 가장 강력한 해방의 열쇠는 '${activeDerridaTheme.themeTitleKo}'입니다. ` +
    `${activeDerridaTheme.practicalCounsel} 데리다의 명언 "${focalDerridaAphorism.aphorismKo}" (${focalDerridaAphorism.aphorismFrench})을 마음에 새기고, ` +
    `${focalDerridaAphorism.actionGuidance}`;

  const dailyPracticeRitual =
    '오늘 단정 짓고 싶던 이분법(성공/실패, 내 편/남의 편) 하나를 잠시 괄호에 넣고, 제3의 열린 선택지를 한 줄로 적어 보세요.';
  const reflectiveQuestion = query?.trim()
    ? `‘${query.trim().slice(0, 48)}’ 앞에서 내가 당연하다고 믿고 있던 전제는 무엇이며, 그것을 내려놓으면 어떤 새로운 환대가 열릴까요?`
    : '지금 내가 마주한 막다른 골목(아포리아)에서 피하지 않고 끝까지 응시해야 할 나만의 결단은 무엇인가요?';
  const interpretiveBoundary =
    '자크 데리다의 해체·차연 관점은 정답을 단정하거나 미래를 예측하는 도구가 아니라, 고정관념을 흔들어 더 열린 선택을 성찰하는 상징적 렌즈입니다.';

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${kst.toISOString().slice(0, 10)} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} KST`;
  const derridaSynthesisMatrix = {
    coreInsight: activeDerridaTheme.themeTitleKo,
    recommendedAction: dailyPracticeRitual,
    cautionNotice: '성급한 이분법적 단정이나 기존 위계의 틀 안에 새로운 타자성과 가능성을 가두지 마십시오.',
  };

  return {
    engineVersion: FRENCH_JACQUES_DERRIDA_DECONSTRUCTION_DIFFERANCE_VERSION,
    calculatedAtKst: kstTimeLabel,
    differancePostponementSpacializationScore,
    binaryOppositionDeconstructionIndex,
    aporiaBreakthroughResolutionScore,
    unconditionalHospitalityEmpathyIndex,
    pharmakonTransformativeHealingScore,
    activeDerridaTheme,
    focalDerridaAphorism,
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    derridaSynthesisMatrix,
    derridaComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatFrenchJacquesDerridaDeconstructionDifferancePrompt(
  res: FrenchJacquesDerridaDeconstructionDifferanceResult,
): string {
  return [
    `【자크 데리다 《그라마톨로지》 해체(Deconstruction)·차연(Différance) 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 차연 및 의미 생성 지연·차이 유연성(Différance): ${describeDerridaStage(res.differancePostponementSpacializationScore)}`,
    `- 이항대립 해체 및 제3의 지평 개척력: ${describeDerridaStage(res.binaryOppositionDeconstructionIndex)}`,
    `- 아포리아 대면 및 역설적 결단력: ${describeDerridaStage(res.aporiaBreakthroughResolutionScore)}`,
    `- 조건 없는 환대 및 타자성 포용 결: ${describeDerridaStage(res.unconditionalHospitalityEmpathyIndex)}`,
    `- 파르마콘 양면성 변용 치유력: ${describeDerridaStage(res.pharmakonTransformativeHealingScore)}`,
    `- 핵심 데리다 테마: ${res.activeDerridaTheme.themeTitleKo} [${res.activeDerridaTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeDerridaTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeDerridaTheme.practicalCounsel}`,
    `- 데리다 원전 테제: "${res.focalDerridaAphorism.aphorismKo}" (${res.focalDerridaAphorism.aphorismFrench})`,
    `- 원전 출처: [${res.focalDerridaAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalDerridaAphorism.actionGuidance}`,
    `- 일상 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.derridaSynthesisMatrix.coreInsight}) | 실행(${res.derridaSynthesisMatrix.recommendedAction}) | 주의(${res.derridaSynthesisMatrix.cautionNotice})`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 데리다 권면: ${res.derridaComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
