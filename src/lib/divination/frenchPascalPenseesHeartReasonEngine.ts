/**
 * 프랑스 블레즈 파스칼(Blaise Pascal) 《팡세(Pensées)》 사유하는 갈대 & 심장의 논리 엔진
 *
 * 17세기 프랑스의 천재 수학자·물리학자·철학자 블레즈 파스칼(1623~1662)의 미완성 유고 명저 《팡세(Pensées)》 원전 기반:
 * 1. 사유하는 갈대(Roseau pensant): "인간은 자연에서 가장 연약한 한 줄기 갈대에 불과하다. 그러나 그는 사유하는 갈대다(L'homme n'est qu'un roseau, le plus faible de la nature, mais c'est un roseau pensant)." 우주가 그를 부술지라도 자신이 죽는다는 것을 아는 지성적 존엄성.
 * 2. 심장의 논리(Le cœur a ses raisons que la raison ne connaît point): 이성이 미처 알지 못하는 심장의 고유한 영성적 직관과 감응.
 * 3. 기하학적 정신과 섬세한 정신(Esprit de géométrie et esprit de finesse): 엄격한 논리적 분석과 미묘하고 직관적인 인간 이해의 조화로운 통합.
 * 4. 파스칼의 내기(Pari de Pascal): 불확실한 삶 속에서 의미와 영원한 가치를 향해 전 존재를 던지는 실존적 결단의 용기.
 * 5. 오락과 기만(Divertissement)의 탈피: 내면의 공허를 회피하기 위한 헛된 부산스러움을 멈추고 고요히 참된 자아와 대면하는 평정심.
 *
 * @version LUCKEY-PASCAL-PENSEES-HEART-REASON-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const PASCAL_PENSEES_HEART_REASON_VERSION = 'LUCKEY-PASCAL-PENSEES-HEART-REASON-v2.1.0';

export type PascalQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface PascalTemporalRhythm {
  kstHour: number;
  kstSlot: string;
  rhythmTitle: string;
  rhythmGuidance: string;
}

export interface PascalThematicThought {
  thoughtKey: string;
  thoughtTitleFrench: string;
  thoughtTitleKo: string;
  philosophicalInsight: string;
  existentialCounsel: string;
}

export interface PascalPenseesMaxim {
  maximKey: string;
  maximKo: string;
  maximFrench: string;
  coreDimension: string;
  practicalAction: string;
}

export interface PascalPenseesHeartReasonResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 실존 지표 (0~100)
  thinkingReedDignityScore: number;        // 사유하는 갈대(Roseau pensant) 지적 존엄도
  heartIntuitionFinesseScore: number;      // 심장의 논리(Esprit de finesse) 직관 감응도
  existentialWagerResolveScore: number;    // 파스칼의 내기(Pari) 실존적 가치 결단력
  dualInfinitiesPerspectiveScore: number;  // 무한과 허무 사이(Deux infinis) 균형 시야
  divertissementTranquilityScore: number;  // 헛된 오락·소음 탈피 내면 고요 지수
  // 세부 체계
  activeThematicThought: PascalThematicThought;
  focalPenseesMaxim: PascalPenseesMaxim;
  pascalPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  questionTopic: PascalQuestionTopic;
  temporalRhythm: PascalTemporalRhythm;
  questionContextGuide: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  pascalSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export type PascalPenseesHeartReasonReport = PascalPenseesHeartReasonResult;

const THEMATIC_THOUGHTS: PascalThematicThought[] = [
  {
    thoughtKey: 'RoseauPensant',
    thoughtTitleFrench: 'Le roseau pensant (La grandeur de l\'homme)',
    thoughtTitleKo: '사유하는 갈대 (인간의 연약함과 숭고한 지적 존엄)',
    philosophicalInsight: '우주는 인간보다 광대하여 한 방울의 물, 한 점의 바람으로도 인간을 파괴할 수 있지만, 인간은 자신이 죽는다는 것을 알고 우주는 알지 못하므로 인간이 우주보다 존엄합니다.',
    existentialCounsel: '상황의 압도적인 크기에 위축되지 마십시오. 당신의 맑은 생각과 의식적 자각이야말로 그 어떤 거대한 외적 조건보다 고귀하고 강합니다.',
  },
  {
    thoughtKey: 'LeCoeurEtLaRaison',
    thoughtTitleFrench: 'Le cœur a ses raisons (La finesse d\'esprit)',
    thoughtTitleKo: '심장의 논리 (이성을 초월한 직관과 영혼의 감응)',
    philosophicalInsight: '우리가 제1원리를 아는 것은 이성이 아니라 심장을 통해서입니다. 논리적 계산만으로 다 헤아릴 수 없는 생의 가장 깊은 진실은 맑은 심장의 직관으로 와닿습니다.',
    existentialCounsel: '머릿속의 계산과 분석만으로 결론이 나지 않을 때는, 가슴속 깊은 울림과 양심의 미세한 목소리에 귀를 기울이십시오. 심장이 길을 알고 있습니다.',
  },
  {
    thoughtKey: 'LePariDePascal',
    thoughtTitleFrench: 'L\'infini rien (Le pari sur l\'éternité)',
    thoughtTitleKo: '파스칼의 내기 (영원한 가치와 의미를 향한 결단)',
    philosophicalInsight: '삶이라는 바다에 이미 승선한 이상 중립이란 없습니다. 유한한 쾌락의 허무에 머물기보다, 영원한 의미와 선, 사랑의 가능성에 모든 정성을 거는 것이 가장 현명한 실존의 선택입니다.',
    existentialCounsel: '망설이며 삶을 방관하지 마십시오. 참된 가치와 영혼의 성장을 위해 용기 있게 결단하고 헌신할 때, 후회 없는 진정한 삶의 열매를 거둡니다.',
  },
  {
    thoughtKey: 'DeuxInfinis',
    thoughtTitleFrench: 'Les deux infinis (Entre le néant et l\'infini)',
    thoughtTitleKo: '두 심연 (무한대와 무한소 사이 인간의 자리)',
    philosophicalInsight: '인간은 무한한 대우주 앞에서는 허무에 불과하지만, 미시적인 무한소에 비하면 하나의 세계입니다. 극단에 취하지 않고 자신의 참된 위치를 자각할 때 겸허한 지혜가 깃듭니다.',
    existentialCounsel: '지나친 자만심으로 오만해지지도, 과도한 열등감으로 자책하지도 마십시오. 우주 안에서 당신만의 고유한 자리를 인정하고 온전히 서십시오.',
  },
  {
    thoughtKey: 'LeDivertissement',
    thoughtTitleFrench: 'Le divertissement (Le calme dans sa chambre)',
    thoughtTitleKo: '기만의 탈피 (소음을 멈추고 고요히 마주하는 평정)',
    philosophicalInsight: '인간의 모든 불행은 방 안에 조용히 머물며 자기 자신과 대면하지 못하는 무능에서 비롯됩니다. 헛된 소란과 일시적 오락(Divertissement)을 멈출 때 참된 평화가 열립니다.',
    existentialCounsel: '불안을 달래기 위해 일과 소음 속에 자신을 내몰지 마십시오. 하루에 단 10분이라도 모든 자극을 끄고 내면의 고요함 속에 머무는 시간을 가지십시오.',
  },
];

const PENSEES_MAXIMS: PascalPenseesMaxim[] = [
  {
    maximKey: 'ThinkingMakesDignity',
    maximKo: '인간의 모든 존엄성은 사유(Pensée)에 있다',
    maximFrench: 'Toute notre dignité consiste donc en la pensée',
    coreDimension: '지적 자각과 주체적 성찰',
    practicalAction: '맹목적인 충동에 끌려가지 말고, 지금 겪는 상황을 객관적으로 응시하며 바른 판단을 내리십시오.',
  },
  {
    maximKey: 'HeartKnowsTruth',
    maximKo: '진리는 심장으로 먼저 느껴지고, 이성은 이를 증명할 뿐이다',
    maximFrench: 'C\'est le cœur qui sent Dieu, et non la raison',
    coreDimension: '직관적 신뢰와 본질적 통찰',
    practicalAction: '순수한 마음에서 우러나오는 선한 동기를 믿고 실천하십시오. 그것이 가장 안전한 나침반입니다.',
  },
  {
    maximKey: 'KnowOwnLimit',
    maximKo: '이성의 마지막 걸음은 이성을 넘어서는 무한한 영역이 있음을 인정하는 것이다',
    maximFrench: 'La dernière démarche de la raison est de reconnaître qu\'il y a une infinité de choses qui la surpassent',
    coreDimension: '지적 겸손과 경외심',
    practicalAction: '자신의 통제력과 예측을 벗어난 삶의 신비를 겸허히 수용하고, 불확실성을 유연하게 품으십시오.',
  },
  {
    maximKey: 'KindnessTrueGreatness',
    maximKo: '진정한 위대함은 타인을 향한 따뜻한 사랑과 겸양 속에 있다',
    maximFrench: 'La vraie éloquence se moque de l\'éloquence, la vraie morale se moque de la morale',
    coreDimension: '형식주의를 벗어난 진실성',
    practicalAction: '외적인 겉치레와 위선을 벗어던지고, 담백하고 진솔한 태도로 사람과 일을 대하십시오.',
  },
];

function classifyPascalQuestionTopic(question?: string): PascalQuestionTopic {
  const q = (question ?? '').trim().toLowerCase();
  if (!q) return 'reflection';
  if (/연애|사랑|관계|이별|결혼|재회|상대|사람|친구|가족|동료|마음|호감|갈등|연락/.test(q)) return 'relationship';
  if (/결정|선택|이직|창업|진로|시험|합격|투자|계약|진행|포기|방향|할까|말까/.test(q)) return 'decision';
  if (/불안|우울|지침|피곤|상처|치유|위로|힘들|걱정|두려|잠|휴식|회복/.test(q)) return 'healing';
  return 'reflection';
}

function buildPascalTemporalRhythm(now?: Date): PascalTemporalRhythm {
  const target = now ?? new Date();
  const kstHour = (target.getUTCHours() + 9) % 24;
  if (kstHour >= 5 && kstHour < 11) {
    return {
      kstHour,
      kstSlot: '새벽·아침 성찰기',
      rhythmTitle: '고요한 방 안의 맑은 직관 시간',
      rhythmGuidance: '세상의 소란(Divertissement)이 시작되기 전, 심장이 먼저 알아보는 제1원리를 차분히 가다듬기 좋은 때입니다.',
    };
  }
  if (kstHour >= 11 && kstHour < 17) {
    return {
      kstHour,
      kstSlot: '한낮의 분별기',
      rhythmTitle: '기하학적 정신과 섬세한 정신의 균형',
      rhythmGuidance: '냉철한 이성으로 사실을 정리하되, 숫자나 조건 너머 사람의 결을 함께 헤아려야 하는 시간대입니다.',
    };
  }
  if (kstHour >= 17 && kstHour < 22) {
    return {
      kstHour,
      kstSlot: '저녁의 결단기',
      rhythmTitle: '두 심연 사이에서 중심을 잡는 시간',
      rhythmGuidance: '하루의 크고 작은 일들 앞에서 지나친 조급함과 무력감을 모두 내려놓고 의미 있는 한 걸음을 선택할 때입니다.',
    };
  }
  return {
    kstHour,
    kstSlot: '심야의 침잠기',
    rhythmTitle: '사유하는 갈대의 고요한 존엄',
    rhythmGuidance: '외부의 불빛이 잦아든 밤, 연약함을 숨기지 않고 스스로를 직시할 때 오히려 가장 단단한 내면의 빛이 드러납니다.',
  };
}

function describePascalQualitativeStage(score: number): string {
  if (score >= 90) return '깊고 맑은 공명기 (이성과 심장이 조화롭게 깨어 있는 흐름)';
  if (score >= 80) return '안정된 성숙기 (분별과 직관이 차분히 자리 잡는 흐름)';
  return '고요한 숙성기 (소음을 걷어내고 본질을 응시하는 흐름)';
}

function formatPascalKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

export function calculatePascalPenseesHeartReason(
  profile: UserProfile,
  question?: string,
  now?: Date,
): PascalPenseesHeartReasonResult {
  const targetDate = now ?? new Date();
  const questionTopic = classifyPascalQuestionTopic(question);
  const temporalRhythm = buildPascalTemporalRhythm(targetDate);

  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    `:${questionTopic}:${temporalRhythm.kstSlot}:` +
    'PascalPenseesHeartReason';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const thinkingReedDignityScore = 69 + (absHash % 30);
  const heartIntuitionFinesseScore = 68 + ((absHash >> 3) % 31);
  const existentialWagerResolveScore = 67 + ((absHash >> 6) % 32);
  const dualInfinitiesPerspectiveScore = 66 + ((absHash >> 9) % 33);
  const divertissementTranquilityScore = 70 + ((absHash >> 12) % 29);

  const thoughtIndex = (absHash >> 4) % THEMATIC_THOUGHTS.length;
  const maximIndex = (absHash >> 7) % PENSEES_MAXIMS.length;

  const activeThematicThought = THEMATIC_THOUGHTS[thoughtIndex];
  const focalPenseesMaxim = PENSEES_MAXIMS[maximIndex];

  const topicGuides: Record<PascalQuestionTopic, { guide: string; ritual: string; question: string }> = {
    relationship: {
      guide: '관계에서는 논리적으로 옳고 그름을 따지는 기하학적 정신보다, 상대의 말 이면과 흔들리는 마음을 읽는 섬세한 정신(Esprit de finesse)이 길을 엽니다.',
      ritual: '오늘 대화를 나눌 때 상대의 문장을 평가하기 전에 먼저 그 말 뒤에 숨은 두려움이나 바람을 한 번 더 헤아려 보세요.',
      question: '지금 이 관계에서 계산으로는 다 설명되지 않지만 내 심장이 이미 알고 있는 진실은 무엇인가요?',
    },
    decision: {
      guide: '파스칼의 내기가 말하듯 모든 변수가 완벽히 증명될 때까지 기다리는 것도 하나의 선택입니다. 작은 손익보다 오래 후회하지 않을 가치 쪽에 무게를 두어 보세요.',
      ritual: '결정을 미루게 만드는 헛된 산만함(Divertissement)을 15분만 끄고, 종이 한 장에 두 선택이 남길 1년 뒤의 표정을 적어 보세요.',
      question: '내가 지금 망설이는 이유는 정보가 부족해서인가요, 아니면 책임을 질 용기가 아직 모자라서인가요?',
    },
    healing: {
      guide: '인간은 한 방울의 물에도 쓰러지는 갈대이지만, 자신이 흔들린다는 사실을 스스로 알고 보듬을 수 있기에 무너지지 않습니다. 아픔을 숨기려 분주해지기보다 잠시 머물러 주세요.',
      ritual: '불안을 잊기 위해 휴대폰이나 일로 자신을 몰아세우지 말고, 조용한 방 안에서 호흡 세 번만큼은 아무것도 하지 않고 쉬어 보세요.',
      question: '내가 지금 피하고 싶어 분주히 채우고 있는 내면의 빈자리는 어떤 마음을 필요로 하나요?',
    },
    reflection: {
      guide: '무한한 우주와 미세한 일상 사이에서 자신의 자리를 겸허히 바라볼 때, 과도한 조급함도 자책도 함께 가라앉습니다.',
      ritual: '오늘 하루 중 단 10분이라도 모든 알림을 끄고, 지금 내 마음이 가장 자주 머무는 생각 한 가지를 문장으로 적어 보세요.',
      question: '겉으로 드러난 소란을 걷어냈을 때, 오늘 내 사유가 향하고 싶은 단 하나의 본질은 무엇인가요?',
    },
  };

  const topicPack = topicGuides[questionTopic];

  const counselTitle = `파스칼 팡세(Pensées) 성찰: ${activeThematicThought.thoughtTitleKo}`;
  const philosophicalGuidance = `블레즈 파스칼의 팡세는 연약한 한 줄기 갈대 같은 인간이 맑은 사유와 심장의 직관을 통해 어떻게 우주적 존엄에 이르는지를 일깨웁니다. ` +
    `현재 당신의 삶에 필요한 지혜는 '${activeThematicThought.thoughtTitleKo}'의 통찰과 맞닿아 있습니다. ` +
    `${activeThematicThought.existentialCounsel} 또한 파스칼의 명제인 '${focalPenseesMaxim.maximKo}'(${focalPenseesMaxim.coreDimension})을 마음에 새겨, ` +
    `${focalPenseesMaxim.practicalAction}`;

  const pascalSynthesisMatrix = {
    dominantTension: `${activeThematicThought.thoughtTitleKo} ↔ ${temporalRhythm.kstSlot}`,
    alignmentState:
      heartIntuitionFinesseScore >= 85 && thinkingReedDignityScore >= 85
        ? '기하학적 정신과 심장 직관의 고차원 공명'
        : '소음을 비우고 심장의 제1원리를 가다듬는 숙성기',
    integratedAction: `${topicPack.ritual} (${focalPenseesMaxim.practicalAction})`,
  };

  return {
    engineVersion: PASCAL_PENSEES_HEART_REASON_VERSION,
    calculatedAtKst: formatPascalKstTimestamp(targetDate),
    thinkingReedDignityScore,
    heartIntuitionFinesseScore,
    existentialWagerResolveScore,
    dualInfinitiesPerspectiveScore,
    divertissementTranquilityScore,
    activeThematicThought,
    focalPenseesMaxim,
    pascalPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    questionTopic,
    temporalRhythm,
    questionContextGuide: topicPack.guide,
    dailyPracticeRitual: topicPack.ritual,
    reflectiveQuestion: topicPack.question,
    ritualAction: topicPack.ritual,
    reflectionFocus: topicPack.question,
    interpretiveBoundary: '본 관점은 파스칼 《팡세》의 철학적 상징을 바탕으로 내면의 사유와 직관을 돕는 성찰 도구이며, 우열을 가르는 수치나 확정적 예언이 아닙니다.',
    pascalSynthesisMatrix,
  };
}

export function formatPascalPenseesHeartReasonPrompt(res: PascalPenseesHeartReasonResult): string {
  const lines = [
    `【블레즈 파스칼 팡세(Pensées) 사유하는 갈대 & 심장의 논리 지표】`,
    `- 엔진 버전: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst}`,
    `- 사유하는 갈대(Roseau pensant) 지적 존엄 흐름: ${describePascalQualitativeStage(res.thinkingReedDignityScore)}`,
    `- 심장의 논리(Le cœur a ses raisons) 직관 섬세도: ${describePascalQualitativeStage(res.heartIntuitionFinesseScore)}`,
    `- 파스칼의 내기(Pari) 실존적 가치 결단 흐름: ${describePascalQualitativeStage(res.existentialWagerResolveScore)}`,
    `- 두 심연(무한과 허무 사이) 중용 조망: ${describePascalQualitativeStage(res.dualInfinitiesPerspectiveScore)}`,
    `- 소음 탈피 내면 고요(Divertissement 탈피): ${describePascalQualitativeStage(res.divertissementTranquilityScore)}`,
    `- 현재 시공간 리듬 (${res.temporalRhythm.kstSlot}): ${res.temporalRhythm.rhythmTitle} — ${res.temporalRhythm.rhythmGuidance}`,
    `- 질문 맥락 맞춤 성찰 (${res.questionTopic}): ${res.questionContextGuide}`,
    `- 핵심 실존 성찰: ${res.activeThematicThought.thoughtTitleKo} [${res.activeThematicThought.thoughtTitleFrench}]`,
    `- 철학적 통찰: ${res.activeThematicThought.philosophicalInsight}`,
    `- 실존적 조언: ${res.activeThematicThought.existentialCounsel}`,
    `- 팡세 핵심 격언: "${res.focalPenseesMaxim.maximKo}"`,
    `- 원문: "${res.focalPenseesMaxim.maximFrench}" [${res.focalPenseesMaxim.coreDimension}]`,
    `- 실천적 행동 지침: ${res.focalPenseesMaxim.practicalAction}`,
    `- 오늘의 사유 의례: ${res.dailyPracticeRitual}`,
    `- 핵심 성찰 질문: ${res.reflectiveQuestion}`,
    `- 통합 실존 처방: ${res.pascalPersonalCounsel.philosophicalGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.pascalSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.pascalSynthesisMatrix.dominantTension} | 조율 상태: ${res.pascalSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.pascalSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
