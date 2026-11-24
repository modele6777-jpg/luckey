/**
 * 한국 신라 의상대사(義湘大師) 화엄일승법계도(華嚴一乘法界圖) & 법성게(法性偈) 원융무애 엔진
 *
 * 668년 신라 화엄종 개조 의상대사(625~702)의 불후의 대작 원전 기반:
 * 1. 《화엄일승법계도(華嚴一乘法界圖)》: 백나무 반(盤) 위에 흰 종이를 펴고 붉은 줄로 54개의 굴곡을 이루어 '법(法)' 자에서 시작하여 '불(佛)' 자로 끝나는 우주 법계의 순환 인다라망 만다라.
 * 2. 《법성게(法性偈)》: 7언 30구 210자의 핵심 화엄 정수.
 *    - 법성원융무이상(法性圓融無二相): 참된 본성의 성품은 걸림 없이 원융하여 두 가지 모습(차별과 분별)이 없다.
 *    - 제법부동본래적(諸法不動本來寂): 모든 현상은 본래 흔들림 없이 고요하고 청정하다.
 *    - 무명무상절일체(無名無相絶一切) 증지소지비여경(證智所知非餘境): 이름도 모양도 없어 일체의 분별이 끊어졌으니 오직 깨달은 지혜로만 알 뿐이다.
 *    - 일중일체다중일(一中一切多中一) 일즉일체다즉일(一卽一切多卽一): 하나 안에 일체가 있고 일체 안에 하나가 있으며, 하나가 곧 일체요 일체가 곧 하나이다.
 *    - 일미진중함시방(一微塵中含十方) 일체진중역여시(一切塵中亦如是): 아주 작은 한 티끌 속에 시방 우주가 오롯이 담겨 있고, 모든 티끌마다 또한 그러하다.
 *    - 초발심시변정각(初發心時便正覺) 생사열반상공화(生死涅槃常共和): 처음 깨달음을 향해 발심한 바로 그 자리가 온전한 정각이며, 생사와 열반이 언제나 함께 어우러진다.
 *    - 구래부동명위불(舊來不動名爲佛): 예로부터 본래 움직임 없는 그 참성품을 일러 부처라 한다.
 *
 * @version LUCKEY-UISANG-HWAEOM-BEOPGYE-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const UISANG_HWAEOM_BEOPGYE_VERSION = 'LUCKEY-UISANG-HWAEOM-BEOPGYE-v2.4.0';

export type UisangQuestionTopic = 'harmony' | 'relation' | 'work' | 'emotion' | 'general';

function classifyUisangTopic(q: string): UisangQuestionTopic {
  if (/분별|하나|원융|조화|균형/.test(q)) return 'harmony';
  if (/관계|사람|연결|상대|소통/.test(q)) return 'relation';
  if (/일|직장|작은|시작|초심/.test(q)) return 'work';
  if (/마음|감정|불안|흔들|고요/.test(q)) return 'emotion';
  return 'general';
}

const UISANG_SHADOW_WARNINGS: Record<UisangQuestionTopic, string> = {
  harmony: '분별을 내려놓는 원융함이 현실의 필요한 경계와 책임 구분까지 흐리는 모호함으로 기울지 않게 하십시오.',
  relation: '인다라망의 연결을 의식하다 타인의 감정과 내 과제를 뒤섞어 버리지 않도록 각자의 자리를 존중하십시오.',
  work: '초발심의 순수함만 붙잡고 구체적인 실행 순서와 점검을 놓치면 작은 티끌 속 우주가 현실에서 빛을 잃습니다.',
  emotion: '제법부동의 고요를 좇아 지금 올라오는 감정을 외면하지 말고, 파도 밑바닥의 고요와 함께 감정도 온전히 바라보십시오.',
  general: '법성게의 원융한 통찰은 멀리 있는 관념이 아니라 지금 눈앞의 한 호흡과 한 걸음에서 증명됩니다.',
};

export interface BeopgyeSealVerse {
  verseKey: string;
  hanjaVerse: string;
  koreanPronunciation: string;
  philosophicalMeaning: string;
  practicalReflection: string;
}

export interface HwaeomSpiritualGate {
  gateKey: string;
  gateNameKo: string;
  indranetWisdom: string;
  dailyMeditation: string;
}

export interface UisangHwaeomIlseungBeopgyeResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: UisangQuestionTopic;
  shadowWarning: string;
  // 5대 핵심 지표 (0~100)
  beopseongWonnyungScore: number;                // 법성원융무이상(法性圓融無二相) 본성 원융 조화도
  sangjeukSangipInterpenetrationScore: number;   // 일중일체다중일(一中一切多中一) 상즉상입 연기 통찰력
  microMacroCosmosScore: number;                 // 일미진중함시방(一微塵中含十方) 미시·거시 우주 직관력
  firstMindAwakeningScore: number;               // 초발심시변정각(初發心時便正覺) 초심과 본각 일치 실천력
  ancientImmobilityBuddhaScore: number;          // 구래부동명위불(舊來不動名爲佛) 본래 흔들림 없는 평정도
  // 세부 체계
  activeBeopgyeVerse: BeopgyeSealVerse;
  secondaryBeopgyeVerse: BeopgyeSealVerse;
  focalSpiritualGate: HwaeomSpiritualGate;
  secondarySpiritualGate: HwaeomSpiritualGate;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  uisangHwaeomCounsel: {
    counselTitle: string;
    beopgyeGuidance: string;
  };
  uisangSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatUisangKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeUisangStage(score: number): string {
  if (score >= 88) return '법성원융(法性圓融) — 하나와 전체가 걸림 없이 상즉상입하는 원융무애의 흐름';
  if (score >= 78) return '초발심시변정각(初發心時便正覺) — 초심의 순수함과 일상의 현존이 잇닿는 국면';
  return '구래부동(舊來不動) — 바깥의 파란 속에서도 본래 고요한 중심으로 돌아오는 시기';
}

export type UisangHwaeomIlseungBeopgyeReport = UisangHwaeomIlseungBeopgyeResult;

const BEOPGYE_SEAL_VERSES: BeopgyeSealVerse[] = [
  {
    verseKey: 'BeopseongWonnyung',
    hanjaVerse: '法性圓融無二相 諸法不動本來寂',
    koreanPronunciation: '법성원융무이상 제법부동본래적',
    philosophicalMeaning: '법의 성품은 원융하여 둘이라는 분별이 없으며, 온갖 세상 현상은 본래 흔들림 없이 고요합니다.',
    practicalReflection: '좋고 싫음, 옳고 그름의 이분법적 대립을 잠시 내려놓으십시오. 모든 일의 본질은 걸림 없는 하나의 큰 바다와 같습니다.',
  },
  {
    verseKey: 'IljungIlche',
    hanjaVerse: '一中一切多中一 一卽一切多卽一',
    koreanPronunciation: '일중일체다중일 일즉일체다즉일',
    philosophicalMeaning: '하나 속에 일체가 있고 일체 속에 하나가 있으며, 하나가 곧 일체요 일체가 곧 하나입니다.',
    practicalReflection: '지금 마주한 눈앞의 작은 일 하나, 한 사람과의 대화에 정성을 다하십시오. 그 작은 한 점 속에 삶 전체의 향방이 담겨 있습니다.',
  },
  {
    verseKey: 'IlmiJinjung',
    hanjaVerse: '一微塵中含十方 一切塵中亦如是',
    koreanPronunciation: '일미진중함시방 일체진중역여시',
    philosophicalMeaning: '지극히 작은 한 티끌 속에 온 시방 우주가 다 들어있고, 온 세상의 모든 티끌 또한 다 그러합니다.',
    practicalReflection: '거대하고 거창한 목표에 압도되지 마십시오. 지금 딛고 있는 바로 이 사소한 순간이 온 우주의 지혜를 품고 있습니다.',
  },
  {
    verseKey: 'ChoBalSimSi',
    hanjaVerse: '初發心時便正覺 生死涅槃常共和',
    koreanPronunciation: '초발심시변정각 생사열반상공화',
    philosophicalMeaning: '처음 마음을 낸 바로 그 순간이 곧 깨달음이며, 고단한 삶의 번뇌와 평화로운 열반이 언제나 함께 어우러집니다.',
    practicalReflection: '일을 처음 시작할 때 품었던 순수한 초심과 열정을 되살리십시오. 그 초심의 자리에 이미 완성이 깃들어 있습니다.',
  },
];

const HWAEOM_GATES: HwaeomSpiritualGate[] = [
  {
    gateKey: 'IndraNetReflection',
    gateNameKo: '인다라망 상즉상입문(重重無盡)',
    indranetWisdom: '우주 만물은 인다라망의 구슬들처럼 서로를 투영하며 한없이 빛을 주고받는 유기적 관계망입니다.',
    dailyMeditation: '자신과 타인이 분리되지 않은 하나의 유기체임을 기억하고, 주위의 평화와 성장을 나의 일처럼 축복하십시오.',
  },
  {
    gateKey: 'ImmobilityTruth',
    gateNameKo: '구래부동 본각문(舊來不動)',
    indranetWisdom: '외부의 풍파가 아무리 거세어도 본래 갖추어진 내면의 참성품은 결코 훼손되거나 흔들리지 않습니다.',
    dailyMeditation: '일시적인 실패나 불안에 흔들리지 마십시오. 호흡을 가다듬고 깊은 바다 밑바닥처럼 본래 고요한 중심으로 돌아가십시오.',
  },
  {
    gateKey: 'InfiniteTimeInMoment',
    gateNameKo: '무량원겁 즉일념문(無量遠劫卽一念)',
    indranetWisdom: '끝없는 아득한 영겁의 시간도 지금 이 순간 한 생각 속에 온전히 갈무리되어 있습니다.',
    dailyMeditation: '과거에 대한 후회와 미래에 대한 조바심을 비우고, 온전히 현존하는 지금 이 한 호흡의 순간에 깨어 있으십시오.',
  },
  {
    gateKey: 'PreciousReturnOrigin',
    gateNameKo: '귀가착가 득이익문(歸家着家得利益)',
    indranetWisdom: '멀리 찾아 헤매던 보배는 언제나 자신의 집, 본래 자리에서 기다리고 있습니다.',
    dailyMeditation: '외부의 인정이나 헛된 신기함을 좇는 대신, 스스로의 가치와 본래 지닌 풍요로움을 온전히 긍정하십시오.',
  },
];

export function calculateUisangHwaeomIlseungBeopgye(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): UisangHwaeomIlseungBeopgyeResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    (query ?? '') +
    'UisangHwaeomIlseungBeopgye';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const beopseongWonnyungScore = 68 + (absHash % 31);
  const sangjeukSangipInterpenetrationScore = 66 + ((absHash >> 3) % 33);
  const microMacroCosmosScore = 67 + ((absHash >> 6) % 32);
  const firstMindAwakeningScore = 65 + ((absHash >> 9) % 34);
  const ancientImmobilityBuddhaScore = 64 + ((absHash >> 12) % 35);

  const verseIndex = (absHash >> 4) % BEOPGYE_SEAL_VERSES.length;
  const secondaryVerseIndex = (verseIndex + 1 + ((absHash >> 6) % (BEOPGYE_SEAL_VERSES.length - 1))) % BEOPGYE_SEAL_VERSES.length;
  const gateIndex = (absHash >> 7) % HWAEOM_GATES.length;
  const secondaryGateIndex = (gateIndex + 1 + ((absHash >> 10) % (HWAEOM_GATES.length - 1))) % HWAEOM_GATES.length;

  const activeBeopgyeVerse = BEOPGYE_SEAL_VERSES[verseIndex];
  const secondaryBeopgyeVerse = BEOPGYE_SEAL_VERSES[secondaryVerseIndex];
  const focalSpiritualGate = HWAEOM_GATES[gateIndex];
  const secondarySpiritualGate = HWAEOM_GATES[secondaryGateIndex];

  const trimmedQuery = query?.trim() ?? '';
  const questionTopic = classifyUisangTopic(trimmedQuery);
  const shadowWarning = UISANG_SHADOW_WARNINGS[questionTopic];
  const ritualAction = `[${focalSpiritualGate.gateNameKo.split('(')[0].trim()}] ${focalSpiritualGate.dailyMeditation}`;
  const reflectiveQuestion = trimmedQuery
    ? `의상대사의 《법성게》 '${activeBeopgyeVerse.koreanPronunciation}'와 '${secondaryBeopgyeVerse.koreanPronunciation}'를 비추어 볼 때, "${trimmedQuery}"에서 둘로 나누던 분별을 내려놓고 하나로 꿰어야 할 지점은 어디인가요?`
    : `지금 삶의 인다라망 속에서, '${activeBeopgyeVerse.koreanPronunciation}'의 원융함과 '${secondaryBeopgyeVerse.koreanPronunciation}'의 통찰을 함께 여는 작은 한 걸음은 무엇일까요?`;
  const reflectionFocus = reflectiveQuestion;

  const interpretiveBoundary = '이 지표는 신라 의상대사의 《화엄일승법계도》와 《법성게》에 담긴 원융무애·상즉상입·초발심시변정각 철학을 관계와 태도 성찰의 거울로 해석한 것이며, 구체적 사건의 성패를 단정하는 예언이 아닙니다.';

  const counselTitle = `의상대사 화엄일승법계도: ${activeBeopgyeVerse.hanjaVerse}`;
  const beopgyeGuidance = `신라 의상대사의 화엄일승법계도는 만물이 서로 걸림 없이 조화를 이루는 원융무애(圓融無礙)와 인다라망의 상즉상입을 밝힙니다. ` +
    `현재 당신이 마주한 삶의 화두는 '${activeBeopgyeVerse.hanjaVerse}(${activeBeopgyeVerse.koreanPronunciation})'의 게송과 깊이 호응합니다. ` +
    `${activeBeopgyeVerse.practicalReflection} 또한 '${focalSpiritualGate.gateNameKo}'의 가르침을 마음에 두어, ` +
    `${focalSpiritualGate.dailyMeditation}`;

  const calculatedAtKst = formatUisangKstTimestamp(now);
  const avgScore = Math.round(
    (beopseongWonnyungScore +
      sangjeukSangipInterpenetrationScore +
      microMacroCosmosScore +
      firstMindAwakeningScore +
      ancientImmobilityBuddhaScore) /
      5,
  );
  const uisangSynthesisMatrix = {
    dominantTension: `${activeBeopgyeVerse.hanjaVerse} ↔ ${focalSpiritualGate.gateNameKo}`,
    alignmentState: describeUisangStage(avgScore),
    integratedAction: `${focalSpiritualGate.dailyMeditation}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: UISANG_HWAEOM_BEOPGYE_VERSION,
    calculatedAtKst,
    questionTopic,
    shadowWarning,
    beopseongWonnyungScore,
    sangjeukSangipInterpenetrationScore,
    microMacroCosmosScore,
    firstMindAwakeningScore,
    ancientImmobilityBuddhaScore,
    activeBeopgyeVerse,
    secondaryBeopgyeVerse,
    focalSpiritualGate,
    secondarySpiritualGate,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    uisangHwaeomCounsel: {
      counselTitle,
      beopgyeGuidance,
    },
    uisangSynthesisMatrix,
  };
}

export function formatUisangHwaeomIlseungBeopgyePrompt(res: UisangHwaeomIlseungBeopgyeResult): string {
  const avgScore = Math.round(
    (res.beopseongWonnyungScore +
      res.sangjeukSangipInterpenetrationScore +
      res.microMacroCosmosScore +
      res.firstMindAwakeningScore +
      res.ancientImmobilityBuddhaScore) /
      5,
  );
  const lines = [
    `【의상대사 화엄일승법계도 & 법성게 원융무애 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion} | 질문 맥락: ${res.questionTopic}`,
    `- 화엄 원융 국면: ${describeUisangStage(avgScore)}`,
    `- 핵심 법성게 구절: ${res.activeBeopgyeVerse.hanjaVerse} [${res.activeBeopgyeVerse.koreanPronunciation}]`,
    `- 보조 교차 구절: ${res.secondaryBeopgyeVerse.hanjaVerse} [${res.secondaryBeopgyeVerse.koreanPronunciation}]`,
    `- 게송의 철학적 의미: ${res.activeBeopgyeVerse.philosophicalMeaning}`,
    `- 실천적 성찰 조언: ${res.activeBeopgyeVerse.practicalReflection}`,
    `- 화엄 영성 관문: ${res.focalSpiritualGate.gateNameKo}`,
    `- 보조 교차 관문: ${res.secondarySpiritualGate.gateNameKo}`,
    `- 인다라망 통찰: ${res.focalSpiritualGate.indranetWisdom}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 일상 참구 지침: ${res.uisangHwaeomCounsel.beopgyeGuidance}`,
  ];
  if (res.uisangSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.uisangSynthesisMatrix.dominantTension} | 조율 상태: ${res.uisangSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.uisangSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
