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
 * @version LUCKEY-PASCAL-PENSEES-HEART-REASON-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const PASCAL_PENSEES_HEART_REASON_VERSION = 'LUCKEY-PASCAL-PENSEES-HEART-REASON-v1.0.0';

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

export function calculatePascalPenseesHeartReason(profile: UserProfile): PascalPenseesHeartReasonResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
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

  const counselTitle = `파스칼 팡세(Pensées) 성찰: ${activeThematicThought.thoughtTitleKo}`;
  const philosophicalGuidance = `블레즈 파스칼의 팡세는 연약한 한 줄기 갈대 같은 인간이 맑은 사유와 심장의 직관을 통해 어떻게 우주적 존엄에 이르는지를 일깨웁니다. ` +
    `현재 당신의 삶에 필요한 지혜는 '${activeThematicThought.thoughtTitleKo}'의 통찰과 맞닿아 있습니다. ` +
    `${activeThematicThought.existentialCounsel} 또한 파스칼의 명제인 '${focalPenseesMaxim.maximKo}'(${focalPenseesMaxim.coreDimension})을 마음에 새겨, ` +
    `${focalPenseesMaxim.practicalAction}`;

  return {
    engineVersion: PASCAL_PENSEES_HEART_REASON_VERSION,
    calculatedAtKst: new Date().toISOString(),
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
  };
}

export function formatPascalPenseesHeartReasonPrompt(res: PascalPenseesHeartReasonResult): string {
  return [
    `【블레즈 파스칼 팡세(Pensées) 사유하는 갈대 & 심장의 논리 지표】`,
    `- 사유하는 갈대(Roseau pensant) 지적 존엄도: ${res.thinkingReedDignityScore}/100`,
    `- 심장의 논리(Le cœur a ses raisons) 직관 섬세도: ${res.heartIntuitionFinesseScore}/100`,
    `- 파스칼의 내기(Pari) 실존적 가치 결단력: ${res.existentialWagerResolveScore}/100`,
    `- 두 심연(무한과 허무 사이) 중용 조망도: ${res.dualInfinitiesPerspectiveScore}/100`,
    `- 소음 탈피 내면 고요(Divertissement 탈피) 지수: ${res.divertissementTranquilityScore}/100`,
    `- 핵심 실존 성찰: ${res.activeThematicThought.thoughtTitleKo} [${res.activeThematicThought.thoughtTitleFrench}]`,
    `- 철학적 통찰: ${res.activeThematicThought.philosophicalInsight}`,
    `- 실존적 조언: ${res.activeThematicThought.existentialCounsel}`,
    `- 팡세 핵심 격언: "${res.focalPenseesMaxim.maximKo}"`,
    `- 원문: "${res.focalPenseesMaxim.maximFrench}" [${res.focalPenseesMaxim.coreDimension}]`,
    `- 실천적 행동 지침: ${res.focalPenseesMaxim.practicalAction}`,
    `- 통합 실존 처방: ${res.pascalPersonalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
