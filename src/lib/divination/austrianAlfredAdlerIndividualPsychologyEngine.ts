/**
 * 오스트리아 알프레트 아들러(Alfred Adler) 《인간이해(Menschenkenntnis)》 & 《삶의 의미(What Life Could Mean to You)》 열등감 극복 & 공동체 감각 지혜 엔진
 *
 * 현대 개인심리학(Individual Psychology)의 창시자이자 실천적 용기의 사상가 알프레트 아들러(Alfred Adler, 1870~1937)의
 * 《인간이해(Menschenkenntnis, 1927)》, 《삶의 의미(What Life Could Mean to You, 1931)》 원전 기반:
 * 1. 열등감 극복 및 건강한 성장 추구 지수(Inferiority Transcendence & Healthy Striving Score): 열등감을 핑계 삼지 않고 성장의 자극제로 승화시키는 힘.
 * 2. 공동체 감각 및 타인 공헌도(Gemeinschaftsgefühl & Community Feeling Index): 나만의 집착을 벗어나 타인과 협력하고 신뢰를 나누는 소속감.
 * 3. 과제의 분리 및 주체적 자립 용기(Separation of Tasks & Courage of Independence Score): 타인의 평가나 기대를 가르고 내 몫의 책임을 다하는 용기.
 * 4. 목적론적 재해석 및 미래 창조력(Teleological Reframing & Future Creation Index): 과거 트라우마에 얽매이지 않고 지금 여기서 새로운 목적을 선택하는 힘.
 * 5. 불완전할 용기 및 공감적 연결 회복탄력성(Courage to Be Imperfect & Empathetic Connection Score): 완벽주의의 가면을 벗고 온전한 나로 마주하는 회복탄력성.
 *
 * @version LUCKEY-ADLER-INDIVIDUAL-PSYCHOLOGY-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_ALFRED_ADLER_INDIVIDUAL_PSYCHOLOGY_VERSION = 'LUCKEY-ADLER-INDIVIDUAL-PSYCHOLOGY-v1.0.0';

export interface AdlerTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface AdlerAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AustrianAlfredAdlerIndividualPsychologyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 아들러 개인심리학 핵심 지표 (0~100)
  inferiorityTranscendenceHealthyStrivingScore: number; // 열등감 극복 및 건강한 성장 추구 (Inferiority Transcendence)
  communityFeelingContributionIndex: number;           // 공동체 감각 및 타인 공헌도 (Gemeinschaftsgefühl)
  separationOfTasksCourageScore: number;               // 과제의 분리 및 주체적 자립 용기 (Separation of Tasks)
  teleologicalReframingCreationIndex: number;          // 목적론적 재해석 및 미래 창조력 (Teleological Reframing)
  courageToBeImperfectResilienceScore: number;         // 불완전할 용기 및 공감 연결성 (Courage to Be Imperfect)
  // 세부 분석
  activeAdlerTheme: AdlerTheme;
  focalAdlerAphorism: AdlerAphorism;
  adlerComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const ADLER_THEMES: AdlerTheme[] = [
  {
    themeKey: 'inferiorityToGrowth',
    themeTitleEn: 'Transcendence of Inferiority into Healthy Growth',
    themeTitleKo: '열등감은 성장의 원동력이다 — 콤플렉스의 덫을 넘어선 건강한 자기 계발',
    pragmaticInsight: '자신의 부족함을 부끄러워하거나 변명의 구실로 삼지 마십시오. 불완전함을 자각하는 것은 더 나은 상태로 나아가고자 하는 인간 고유의 위대한 성장 동력입니다.',
    practicalCounsel: '타인과 비교하며 스스로를 비하하거나 우월감을 꾸며내지 마십시오. 어제의 나보다 한 걸음 성장하는 건강한 이상을 세우고 구체적인 실력을 쌓아가십시오.',
  },
  {
    themeKey: 'gemeinschaftsgefuehl',
    themeTitleEn: 'Community Feeling & Contribution to Others (Gemeinschaftsgefühl)',
    themeTitleKo: '공동체 감각 — 나만의 좁은 울타리를 벗어나 진정한 소속감과 신뢰 맺기',
    pragmaticInsight: '자기중심적인 집착에서 벗어나 타인을 신뢰의 동반자로 바라볼 때 비로소 진정한 평온과 소속감이 생겨납니다. 행복의 본질은 내가 누군가에게 도움이 되고 있다는 공헌감입니다.',
    practicalCounsel: '타인이 나에게 무엇을 해줄 것인가를 묻지 말고, 내가 이 공동체와 상대방에게 무엇을 기여할 수 있는가를 먼저 고민하고 작은 온기를 나누십시오.',
  },
  {
    themeKey: 'separationOfTasks',
    themeTitleEn: 'Separation of Tasks & Courage of Independence',
    themeTitleKo: '과제의 분리 — 타인의 기대에 얽매이지 않고 오롯이 내 삶을 책임지는 자유',
    pragmaticInsight: '인간관계의 갈등은 대개 타인의 과제에 함부로 개입하거나 내 과제를 침범당할 때 발생합니다. 누구의 선택이고 누구에게 결과가 귀속되는가를 명료하게 구분해야 합니다.',
    practicalCounsel: '타인이 나를 어떻게 평가할지는 그 사람의 과제입니다. 나는 오직 내가 옳다고 믿는 길을 성실히 걸어가는 것에만 온전히 집중하십시오.',
  },
  {
    themeKey: 'teleologicalCourage',
    themeTitleEn: 'Teleological Reframing & Courage of Purpose',
    themeTitleKo: '목적론적 주체 결단 — 과거의 원인에 휘둘리지 않고 지금 내 목적을 선택하기',
    pragmaticInsight: '과거의 상처나 환경이 현재의 나를 결정하는 것이 아닙니다. 과거의 경험에 어떤 의미를 부여하고, 지금 어떠한 목적을 위해 행동할 것인가는 오직 나의 주체적 선택입니다.',
    practicalCounsel: '"과거 때문에 어쩔 수 없다"는 원인론의 핑계를 내려놓으십시오. 지금 당장 새로운 목적을 정하고, 그 목적을 향해 첫 걸음을 내딛는 결단을 내리십시오.',
  },
  {
    themeKey: 'courageToBeImperfect',
    themeTitleEn: 'The Courage to Be Imperfect & Empathetic Presence',
    themeTitleKo: '불완전할 용기 — 완벽주의의 불안을 털어내고 있는 그대로의 나로 서기',
    pragmaticInsight: '완벽해야만 인정받을 수 있다는 불안은 용기를 갉아먹습니다. 불완전한 자신을 솔직하게 인정하고 수용할 때, 비로소 실패를 두려워하지 않고 세상과 따스하게 연결될 수 있습니다.',
    practicalCounsel: '모든 사람에게 완벽하게 보이려 애쓰지 마십시오. 실수를 너그럽게 품고, 나의 나약함을 있는 그대로 인정하며 한 걸음씩 나아가는 편안한 용기를 지니십시오.',
  },
];

export const ADLER_APHORISMS: AdlerAphorism[] = [
  {
    aphorismKey: 'interpersonalRelations',
    aphorismKo: '인간의 모든 고민은 인간관계에서 비롯된다. 그러나 삶의 모든 기쁨 역시 인간관계 속에 있다.',
    aphorismEn: 'All human problems are interpersonal relationship problems, but so is all human joy.',
    sourceContext: '알프레트 아들러 《인간이해(Menschenkenntnis)》 제1부',
    actionGuidance: '관계의 피로에 위축되지 마십시오. 과제를 분리하여 경계를 명확히 하고, 상대방을 경쟁자가 아닌 신뢰할 동료로 바라보십시오.',
  },
  {
    aphorismKey: 'useNotPossession',
    aphorismKo: '중요한 것은 무엇이 주어졌느냐가 아니라, 주어진 것을 어떻게 활용하느냐이다.',
    aphorismEn: 'It is not what one has been given that counts, but what use one makes of what is given.',
    sourceContext: '알프레트 아들러 《삶의 의미(What Life Could Mean to You)》 제2장',
    actionGuidance: '가진 조건이나 결핍을 탓하지 마십시오. 현재 내 손에 쥐어진 재능과 시간, 자원을 가장 생산적이고 유익한 방향으로 재조합하십시오.',
  },
  {
    aphorismKey: 'courageToAct',
    aphorismKo: '용기란 불완전함을 받아들이고, 타인에게 공헌하며 망설임 없이 앞으로 나아가는 힘이다.',
    aphorismEn: 'Courage is the strength to accept one’s imperfection, to contribute, and to step forward without hesitation.',
    sourceContext: '알프레트 아들러 《개인심리학 실천(Practice of Individual Psychology)》',
    actionGuidance: '실패할까 두려워 망설이지 마십시오. 완벽한 준비를 기다리지 말고, 지금 할 수 있는 작은 기여를 당장 시작하십시오.',
  },
  {
    aphorismKey: 'meaningOfLife',
    aphorismKo: '삶의 의미는 외부에서 주어지는 것이 아니라, 우리가 스스로에게 부여하는 것이다.',
    aphorismEn: 'The meaning of life is not given from outside; it is what we ourselves endow it with.',
    sourceContext: '알프레트 아들러 《삶의 의미(What Life Could Mean to You)》 서문',
    actionGuidance: '주변의 정답이나 통념에 휘둘리지 마십시오. 내가 소중히 여기는 가치를 중심으로 오늘 하루에 스스로 의미를 부여하십시오.',
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

export function calculateAustrianAlfredAdlerIndividualPsychology(
  profile?: UserProfile,
  query?: string,
): AustrianAlfredAdlerIndividualPsychologyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `ADLER-INDIVIDUAL-PSYCHOLOGY:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const inferiorityTranscendenceHealthyStrivingScore = 82 + ((absHash >> 1) % 17);
  const communityFeelingContributionIndex = 81 + ((absHash >> 4) % 18);
  const separationOfTasksCourageScore = 83 + ((absHash >> 7) % 16);
  const teleologicalReframingCreationIndex = 80 + ((absHash >> 10) % 19);
  const courageToBeImperfectResilienceScore = 82 + ((absHash >> 13) % 17);

  const themeIndex = (absHash >> 5) % ADLER_THEMES.length;
  const aphorismIndex = (absHash >> 8) % ADLER_APHORISMS.length;

  const activeAdlerTheme = ADLER_THEMES[themeIndex];
  const focalAdlerAphorism = ADLER_APHORISMS[aphorismIndex];

  const guidanceTitle = `아들러 개인심리학 용기 지혜: ${activeAdlerTheme.themeTitleKo}`;
  const philosophicalCounsel = `현대 개인심리학의 창시자 알프레트 아들러는 열등감을 성장의 원동력으로 삼고, 과제를 분리하여 타인과 상생하는 '공동체 감각(Gemeinschaftsgefühl)'을 가르칩니다. ` +
    `현재 당신의 흐름에서 가장 힘이 되는 핵심 심리학적 지혜는 '${activeAdlerTheme.themeTitleKo}'입니다. ` +
    `${activeAdlerTheme.practicalCounsel} 아들러의 격언 "${focalAdlerAphorism.aphorismKo}"를 가슴에 품고, ` +
    `${focalAdlerAphorism.actionGuidance}`;

  return {
    engineVersion: AUSTRIAN_ALFRED_ADLER_INDIVIDUAL_PSYCHOLOGY_VERSION,
    calculatedAtKst: new Date().toISOString(),
    inferiorityTranscendenceHealthyStrivingScore,
    communityFeelingContributionIndex,
    separationOfTasksCourageScore,
    teleologicalReframingCreationIndex,
    courageToBeImperfectResilienceScore,
    activeAdlerTheme,
    focalAdlerAphorism,
    adlerComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAustrianAlfredAdlerIndividualPsychologyPrompt(
  res: AustrianAlfredAdlerIndividualPsychologyResult,
): string {
  return [
    `【알프레트 아들러 《인간이해》 & 《삶의 의미》 열등감 극복 및 공동체 감각 지혜 지표】`,
    `- 열등감 극복 및 건강한 성장 추구(Inferiority Transcendence): ${res.inferiorityTranscendenceHealthyStrivingScore}/100`,
    `- 공동체 감각 및 타인 공헌도(Gemeinschaftsgefühl): ${res.communityFeelingContributionIndex}/100`,
    `- 과제의 분리 및 주체적 자립 용기(Separation of Tasks): ${res.separationOfTasksCourageScore}/100`,
    `- 목적론적 재해석 및 미래 창조력(Teleological Reframing): ${res.teleologicalReframingCreationIndex}/100`,
    `- 불완전할 용기 및 공감 연결성(Courage to Be Imperfect): ${res.courageToBeImperfectResilienceScore}/100`,
    `- 핵심 아들러 테마: ${res.activeAdlerTheme.themeTitleKo} [${res.activeAdlerTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeAdlerTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeAdlerTheme.practicalCounsel}`,
    `- 아들러 원전 명언: "${res.focalAdlerAphorism.aphorismKo}"`,
    `- 원문 인용: "${res.focalAdlerAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalAdlerAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalAdlerAphorism.actionGuidance}`,
    `- 종합 아들러 용기 심리학 권면: ${res.adlerComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
