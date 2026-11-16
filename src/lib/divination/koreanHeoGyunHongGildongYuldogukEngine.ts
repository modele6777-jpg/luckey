/**
 * 대한민국 교산 허균(蛟山 許筠) 선생 《홍길동전》 & 《성소부부고·유재론·호민론》 인재 등용 혁신 & 호민의 기개·율도국 개척 지혜 엔진
 *
 * 조선 중기 개혁 사상가이자 최초의 한글 소설을 창작한 문장가 교산 허균(1569~1618) 선생의 원전 기반:
 * 1. 유재론 인재 등용 및 신분·편견 타파 혁신도 (Talent Liberation & Prejudice Transcendence Score): 하늘이 낸 인재를 낡은 문벌과 적서 차별로 썩히지 않고 역량을 활짝 꽃피우는 진보적 혁신성.
 * 2. 호민론 불의 앞 당당한 주체적 저항의식 (Righteous Civic Courage & Homin Spirit Index): 침묵하는 백성을 넘어 탐관오리의 불의와 기득권의 부조리에 분연히 항거하는 호민(豪民)의 당당한 기개.
 * 3. 활빈당 약자 구휼과 대동정의 실천력 (Great Harmony Justice & Compassionate Aid Score): 부정한 재물을 털어 굶주리고 핍박받는 백성을 구휼하는 대동(大同) 사회적 정의 실천.
 * 4. 율도국 건설과 미래지향적 이상향 개척력 (Visionary Pioneer Agency & Yuldoguk Index): 낡은 체제의 억압을 딛고 바다를 건너 모두가 평등하고 평화롭게 살아가는 새로운 이상향을 건설하는 결단.
 * 5. 시대의 질곡 앞에서도 꺾이지 않는 파격의 진보 회복탄력성 (Progressive Reform & Dauntless Resilience Score): 시대의 편견과 비극적 시련 속에서도 자유로운 영혼과 문학적 승화로 앞길을 여는 회복탄력성.
 *
 * @version LUCKEY-HEO-GYUN-HONG-GILDONG-YULDOGUK-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_HEO_GYUN_HONG_GILDONG_YULDOGUK_VERSION = 'LUCKEY-HEO-GYUN-HONG-GILDONG-YULDOGUK-v2.1.0';

export interface HeoGyunTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  reformInsight: string;
  practicalCounsel: string;
}

export interface HeoGyunAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanHeoGyunHongGildongYuldogukResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 교산 허균 핵심 지표 (0~100)
  talentLiberationOvercomingPrejudiceScore: number;    // 유재론 인재 등용 및 편견 타파 혁신도 (Talent Liberation & Transcendence)
  righteousCivicCourageHominIndex: number;             // 호민론 불의 앞 당당한 저항의식 (Righteous Civic Courage & Homin Spirit)
  greatHarmonyJusticeHwalbindangScore: number;         // 활빈당 약자 구휼과 대동정의 실천력 (Great Harmony Justice & Aid)
  visionaryPioneerYuldogukIndex: number;               // 율도국 건설과 이상향 개척력 (Visionary Pioneer Agency & Yuldoguk)
  progressiveReformResilience: number;                 // 파격의 진보 회복탄력성 (Progressive Reform & Dauntless Resilience)
  // 세부 분석
  activeHeoGyunTheme: HeoGyunTheme;
  focalHeoGyunAphorism: HeoGyunAphorism;
  secondaryHeoGyunAphorism: HeoGyunAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  heoGyunComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  heoGyunSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatHeoGyunKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeHeoGyunStage(score: number): string {
  if (score >= 95) return '율도개척(栗島開拓) — 낡은 울타리를 넘어 새로운 대동의 질서를 세우는 도약기';
  if (score >= 91) return '호민각성(豪民覺醒) — 불의에 맞서고 숨은 재능을 해방하는 파격의 실천기';
  return '유재발현(遺才發現) — 편견의 장벽을 허물고 본연의 잠재력을 깨우는 준비기';
}

export const HEO_GYUN_THEMES: HeoGyunTheme[] = [
  {
    themeKey: 'yuJaeRon',
    themeTitleEn: 'Yu-Jae-Ron (On Forgotten Talents): Shattering Rigid Lineage to Unleash Every Gift',
    themeTitleKo: '유재론(遺才論)의 혜안 — 신분과 편견의 장벽을 부수고 숨겨진 재능의 날개를 펼치기',
    reformInsight: '허균 선생은 하늘이 재능을 낼 때는 귀천을 가리지 않는다고 역설했습니다. 조선의 적서 차별과 편협한 문벌주의를 통렬히 비판하며, 인재를 알아보지 못하고 사장시키는 사회는 반드시 쇠망한다고 경고했습니다.',
    practicalCounsel: '출신 배경, 형식적 간판, 낡은 편견으로 사람이나 자신의 가능성을 옭아매지 마십시오. 당신 내면에 숨겨진 독창적 역량을 긍정하고, 주변의 숨은 인재들을 따뜻한 눈으로 알아보고 등용하십시오.',
  },
  {
    themeKey: 'hoMinRon',
    themeTitleEn: 'Ho-Min-Ron (On the Dauntless People): Awakening the Sovereign Courage that Shakes Injustice',
    themeTitleKo: '호민론(豪民論)의 기개 — 침묵하는 순종을 찢고 불의에 당당히 맞서는 주체적 용기',
    reformInsight: '허균은 백성을 순종하는 항민(恒民), 원망하는 원민(怨民), 불의를 꿰뚫어 보고 분연히 일어서는 호민(豪民)으로 구분했습니다. 진정으로 나라를 바로잡는 것은 부조리에 침묵하지 않는 호민의 기백입니다.',
    practicalCounsel: '불합리한 관행이나 부당한 처사 앞에서 무기력하게 고개 숙이지 마십시오. 두려움을 떨쳐내고 당당하게 원칙과 정의를 말하십시오. 당신의 용기 있는 목소리가 굳어진 판을 깨는 시작점이 됩니다.',
  },
  {
    themeKey: 'hwalBinDang',
    themeTitleEn: 'Hwal-Bin-Dang (The Band of Relieving the Poor): Striking Down Greed to Uplift the Vulnerable',
    themeTitleKo: '활빈(活貧)의 도 — 부정한 탐욕을 응징하고 굶주리고 지친 이웃에게 온기를 돌려주기',
    reformInsight: '홍길동이 이끈 활빈당은 단순한 도적이 아니라, 탐관오리의 불의한 곳간을 열어 백성을 살리는 의적(義賊)이었습니다. 부의 축적이 약자의 희생 위에 서 있다면 그것을 바로잡는 것이 참된 대동(大同)의 도리입니다.',
    practicalCounsel: '혼자만의 이익에 취하지 말고 주변의 약자와 고통받는 이들을 돌아보십시오. 당신이 가진 자원, 지식, 재능을 나눔으로써 힘겨운 이웃에게 실질적인 숨통을 틔워 주십시오. 살림의 정치가 참된 성공입니다.',
  },
  {
    themeKey: 'yulDoGuk',
    themeTitleEn: 'Yul-Do-Guk (The Island of Blessed Harmony): Founding a Radiant New Horizon of Human Flourishing',
    themeTitleKo: '율도국(栗島國)의 이상향 — 낡은 체제의 한계를 돌파하여 모두가 평화로운 새 세상을 개척하기',
    reformInsight: '조선의 좁은 땅에서 차별받던 길동은 바다를 건너 율도국의 왕이 되어 덕(德)으로 백성을 다스립니다. 이는 낡은 현실에 갇히지 않고 완전히 새로운 무대에서 자아를 실현하는 창조적 개척자 정신의 표상입니다.',
    practicalCounsel: '이미 한계가 명백한 좁은 울타리 안에서 소모적인 다툼에 매몰되지 마십시오. 시야를 넓혀 바다 너머를 바라보듯 새로운 영역, 혁신적인 도전을 두려워하지 마십시오. 당신만의 율도국이 기다리고 있습니다.',
  },
];

export const HEO_GYUN_APHORISMS: HeoGyunAphorism[] = [
  {
    aphorismKey: 'yuJaeHeavenTalent',
    aphorismKo: '하늘이 인재를 낼 때는 신분의 귀천을 가리지 않는다. 어찌 좁은 문벌로 인재를 버리는가.',
    aphorismHanja: '天之生才, 不擇貴賤, 豈可拘於門第而遺棄天下之才乎.',
    sourceContext: '《성소부부고(惺所覆瓿藁)》 권11 〈유재론(遺才論)〉, 1610',
    actionGuidance: '편견과 선입견의 족쇄를 과감히 부수십시오. 당신과 주변 동료들의 진정한 실력과 잠재력에 온전히 집중하십시오.',
  },
  {
    aphorismKey: 'hoMinFearThePeople',
    aphorismKo: '천하에 가장 두려워해야 할 대상은 오직 백성뿐이다.',
    aphorismHanja: '天下之所甚可畏者, 唯民而已.',
    sourceContext: '《성소부부고(惺所覆瓿藁)》 권11 〈호민론(豪民論)〉, 1610',
    actionGuidance: '함께하는 사람들의 민심과 진실한 목소리를 겸허하고 두려운 마음으로 경청하십시오. 신뢰가 모든 권위의 근본입니다.',
  },
  {
    aphorismKey: 'callFatherFather',
    aphorismKo: '아버지를 아버지라 부르지 못하고 형을 형이라 부르지 못하니, 어찌 대장부라 하겠는가!',
    aphorismHanja: '呼父不得呼父, 呼兄不得呼兄, 何足爲大丈夫乎!',
    sourceContext: '《홍길동전(洪吉童傳)》, 1612',
    actionGuidance: '부당한 침묵을 강요하는 억압에 굴복하지 마십시오. 진실과 정의를 명명백백하게 밝히고 떳떳한 자부심을 되찾으십시오.',
  },
  {
    aphorismKey: 'pioneerYuldoguk',
    aphorismKo: '낡은 세상을 떠나 바다 건너 율도국에 백성을 편안케 하는 평화로운 낙원을 세우리라.',
    aphorismHanja: '去舊邦而向栗島, 創立安民樂生之境.',
    sourceContext: '《홍길동전(洪吉童傳)》, 1612',
    actionGuidance: '과거의 낡은 틀에 안주하지 말고 과감하게 새 지평을 향해 항해하십시오. 개척자의 용기가 새 시대를 엽니다.',
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

export function calculateKoreanHeoGyunHongGildongYuldoguk(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanHeoGyunHongGildongYuldogukResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `HEO-GYUN-HONG-GILDONG-YULDOGUK:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const talentLiberationOvercomingPrejudiceScore = 90 + ((absHash >> 1) % 10);
  const righteousCivicCourageHominIndex = 89 + ((absHash >> 4) % 10);
  const greatHarmonyJusticeHwalbindangScore = 88 + ((absHash >> 7) % 11);
  const visionaryPioneerYuldogukIndex = 90 + ((absHash >> 10) % 9);
  const progressiveReformResilience = 89 + ((absHash >> 13) % 10);

  const themeIndex = (absHash >> 5) % HEO_GYUN_THEMES.length;
  const aphorismIndex = (absHash >> 8) % HEO_GYUN_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (HEO_GYUN_APHORISMS.length - 1))) % HEO_GYUN_APHORISMS.length;

  const activeHeoGyunTheme = HEO_GYUN_THEMES[themeIndex];
  const focalHeoGyunAphorism = HEO_GYUN_APHORISMS[aphorismIndex];
  const secondaryHeoGyunAphorism = HEO_GYUN_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}' 앞에서 낡은 관습과 눈치 때문에 스스로 가두고 있던 역량을 풀어 율도국처럼 새로 열 수 있는 길은 무엇인가요?`
    : `지금 내가 당연한 관행으로 받아들이며 스스로의 재능이나 정당한 목소리를 억누르고 있는 틀 한 가지는 무엇인가요?`;
  const interpretiveBoundary = '교산 허균 홍길동전·유재론·호민론 관점은 길흉 예단이 아니라, 편견 타파와 주체적 개척을 비추는 개혁 성찰 렌즈입니다.';

  const guidanceTitle = `교산 허균 개혁과 율도국의 지혜: ${activeHeoGyunTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 중기 개혁 사상가이자 최초 한글 소설의 대문호 교산 허균 선생은 ` +
    `《유재론》을 통해 신분과 편견을 깨는 인재 등용의 혁신을, 《호민론》을 통해 불의에 맞서는 당당한 주체적 저항의식을, ` +
    `그리고 《홍길동전》을 통해 활빈(活貧)의 대동정의와 낡은 체제를 뛰어넘는 율도국(栗島國) 개척의 원대한 이상을 천명했습니다. ` +
    `지금 당신에게 가장 필요한 실천적 나침반은 '${activeHeoGyunTheme.themeTitleKo}'입니다. ` +
    `${activeHeoGyunTheme.practicalCounsel} 허균 선생의 명언 "${focalHeoGyunAphorism.aphorismKo}" (${focalHeoGyunAphorism.aphorismHanja})를 마음에 새기고, ` +
    `${focalHeoGyunAphorism.actionGuidance}`;

  const calculatedAtKst = formatHeoGyunKstTimestamp(now);
  const avgScore = Math.round(
    (talentLiberationOvercomingPrejudiceScore +
      righteousCivicCourageHominIndex +
      greatHarmonyJusticeHwalbindangScore +
      visionaryPioneerYuldogukIndex +
      progressiveReformResilience) /
      5,
  );
  const heoGyunSynthesisMatrix = {
    dominantTension: `${activeHeoGyunTheme.themeTitleKo} ↔ ${focalHeoGyunAphorism.sourceContext}`,
    alignmentState: describeHeoGyunStage(avgScore),
    integratedAction: `${focalHeoGyunAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_HEO_GYUN_HONG_GILDONG_YULDOGUK_VERSION,
    calculatedAtKst,
    talentLiberationOvercomingPrejudiceScore,
    righteousCivicCourageHominIndex,
    greatHarmonyJusticeHwalbindangScore,
    visionaryPioneerYuldogukIndex,
    progressiveReformResilience,
    activeHeoGyunTheme,
    focalHeoGyunAphorism,
    secondaryHeoGyunAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    heoGyunComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    heoGyunSynthesisMatrix,
  };
}

export function formatKoreanHeoGyunHongGildongYuldogukPrompt(
  res: KoreanHeoGyunHongGildongYuldogukResult,
): string {
  const avgScore = Math.round(
    (res.talentLiberationOvercomingPrejudiceScore +
      res.righteousCivicCourageHominIndex +
      res.greatHarmonyJusticeHwalbindangScore +
      res.visionaryPioneerYuldogukIndex +
      res.progressiveReformResilience) /
      5,
  );
  const lines = [
    `【교산 허균 《홍길동전·유재론·호민론》 인재 등용·호민 기개·율도국 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 개혁·개척 국면: ${describeHeoGyunStage(avgScore)}`,
    `- 핵심 허균 테마: ${res.activeHeoGyunTheme.themeTitleKo} [${res.activeHeoGyunTheme.themeTitleEn}]`,
    `- 개혁 사상적 통찰: ${res.activeHeoGyunTheme.reformInsight}`,
    `- 행동 조언: ${res.activeHeoGyunTheme.practicalCounsel}`,
    `- 허균 원전 테제: "${res.focalHeoGyunAphorism.aphorismKo}" (${res.focalHeoGyunAphorism.aphorismHanja})`,
    `- 보조 교차 테제: "${res.secondaryHeoGyunAphorism.aphorismKo}" [${res.secondaryHeoGyunAphorism.sourceContext}]`,
    `- 원전 출처: [${res.focalHeoGyunAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHeoGyunAphorism.actionGuidance}`,
    `- 종합 허균 권면: ${res.heoGyunComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.heoGyunSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.heoGyunSynthesisMatrix.dominantTension} | 조율 상태: ${res.heoGyunSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.heoGyunSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
