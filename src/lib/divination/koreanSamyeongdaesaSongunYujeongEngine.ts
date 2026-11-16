/**
 * 대한민국 사명대사 송운 유정(四溟大師 松雲 惟政) 선생 《분충서난록(奮忠抒難錄)》 & 《사명당대사집(四溟堂大師集)》 살신성인 호국대의 & 대일담판 3,500포로 쇄환 자비구제·출세간 초연 지혜 엔진
 *
 * 조선 중기 임진왜란 국난 극복의 위대한 영웅이자 대선사 사명대사 유정(1544~1610)의 불후의 기록 《분충서난록》, 《사명당대사집》 원전 기반:
 * 1. 살신성인(殺身成仁) 호국대의 및 용기 지표 (Self-Sacrificing Righteous Devotion Score): 국난과 위기 앞에서 사리사욕과 안위를 버리고 대의명분을 위해 온몸을 던지는 구국 헌신력.
 * 2. 외교적 담판 지략 및 자비구제 실천력 (Diplomatic Statesmanship & Compassionate Rescue Index): 적진 한복판에 들어가 도쿠가와 이에야스를 감복시키고 피랍 백성 3,500여 명을 살려 송환한 위대한 담판 지략.
 * 3. 생사초월 자비희사(慈悲喜捨) 도량 지수 (Transcendent Equanimity & Compassion Score): 칼과 무기를 넘어 참된 자비와 불심으로 원한을 녹이고 천하의 태평을 이룩하는 보살행.
 * 4. 경세구민(經世救民) 실천적 보살행 지표 (Pragmatic Bodhisattva Action Index): 추상적 명분이나 형식에 얽매이지 않고 고통받는 현실의 백성을 구원하기 위해 분연히 행동하는 실천력.
 * 5. 출세간적 무소유 청빈 및 초연한 회복탄력성 (Renunciation & Magnanimous Resilience Score): 지극한 공을 세운 뒤에도 권력과 영화에 연연하지 않고 산사로 돌아가 평정을 지키는 초연한 무소유.
 *
 * @version LUCKEY-SAMYEONGDAESA-SONGUN-YUJEONG-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_SAMYEONGDAESA_SONGUN_YUJEONG_VERSION = 'LUCKEY-SAMYEONGDAESA-SONGUN-YUJEONG-v2.1.0';

export interface SamyeongTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface SamyeongAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanSamyeongdaesaSongunYujeongResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 사명대사 호국 자비 핵심 지표 (0~100)
  righteousDevotionScore: number;             // 살신성인 호국대의 및 용기 지표 (Righteous Devotion & Sacrifice)
  diplomaticRescueIndex: number;              // 외교적 담판 지략 및 자비구제 실천력 (Diplomatic Rescue & Statesmanship)
  transcendentCompassionScore: number;        // 생사초월 자비희사 도량 지수 (Transcendent Equanimity & Compassion)
  pragmaticBodhisattvaIndex: number;          // 경세구민 실천적 보살행 지표 (Pragmatic Bodhisattva Action)
  renunciationResilienceScore: number;        // 출세간적 무소유 청빈 및 초연한 회복탄력성 (Renunciation & Resilience)
  // 세부 분석
  activeSamyeongTheme: SamyeongTheme;
  secondarySamyeongTheme: SamyeongTheme;
  focalSamyeongAphorism: SamyeongAphorism;
  secondarySamyeongAphorism: SamyeongAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  samyeongComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  samyeongSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatSamyeongKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeSamyeongStage(score: number): string {
  if (score >= 92) return '자비구제(慈悲救濟) — 흔들림 없는 담판의 기개와 대자대비의 평정이 하나로 선 구국기';
  if (score >= 88) return '분충서난(奮忠抒難) — 형식에 얽매이지 않고 현실의 어려움을 풀어내는 실천기';
  return '사료불의(事了拂衣) — 공과 집착을 내려놓고 맑은 중심을 고요히 지키는 수양기';
}

export const SAMYEONG_THEMES: SamyeongTheme[] = [
  {
    themeKey: 'righteousDevotion',
    themeTitleEn: 'Righteous Sacrifice: Devoting Life and Soul to Community and Country',
    themeTitleKo: '살신성인의 대의 — 사사로운 안위를 넘어 공동체와 소명을 위해 헌신하기',
    pragmaticInsight: '나라와 백성이 풍전등화의 위기에 처했을 때 사명대사는 주저 없이 가사와 장삼을 입고 승병을 이끌어 분연히 일어섰습니다. 눈앞의 계산을 버리고 대의에 몸을 바칠 때 거대한 위력이 솟아납니다.',
    practicalCounsel: '사리사욕이나 일신의 안락함에 안주하지 마십시오. 공동체의 위기와 약자의 고통에 눈을 돌리지 않고, 책임져야 할 소명 앞에 정면으로 당당하게 마주 서십시오.',
  },
  {
    themeKey: 'diplomaticStatesmanship',
    themeTitleEn: 'Heroic Diplomacy: Walking Fearlessly into the Dragon\'s Den to Save 3,500 Lives',
    themeTitleKo: '적진 속의 당당한 담판 — 불굴의 기개와 뛰어난 지략으로 생명을 구제하기',
    pragmaticInsight: '임진왜란 후 사명대사는 홀몸으로 적국 일본에 건너가 교토에서 도쿠가와 이에야스와 담판을 벌여 평화조약을 이끌어내고 피랍 동포 3,500여 명을 무사히 귀환시키는 불멸의 기적을 낳았습니다.',
    practicalCounsel: '불리한 협상 테이블이나 위협적인 상대 앞에서도 기죽지 마십시오. 흔들리지 않는 당당함과 빈틈없는 논리, 깊은 인품으로 상대의 마음을 제압하고 최고의 결실을 쟁취하십시오.',
  },
  {
    themeKey: 'compassionOverEnmity',
    themeTitleEn: 'Transcendent Compassion: Melting Hate and War into Universal Concord',
    themeTitleKo: '원한을 녹이는 대자대비 — 칼과 폭력을 넘어선 자비로 영구한 평화를 열기',
    pragmaticInsight: '복수는 또 다른 원한을 낳을 뿐입니다. 사명대사는 적장 가토 기요마사와의 대담에서도 서슬 퍼런 칼날 앞에서도 흔들리지 않는 자비의 도량으로 적을 탄복시켰습니다.',
    practicalCounsel: '감정적인 분노나 보복 심리에 휘둘리지 마십시오. 한 차원 높은 자비와 너른 도량으로 대립을 녹여내십시오. 포용할 줄 아는 사람만이 최후의 진정한 승자가 됩니다.',
  },
  {
    themeKey: 'pragmaticBodhisattva',
    themeTitleEn: 'Pragmatic Bodhisattva Action: Saving Living Beings in Concrete Reality',
    themeTitleKo: '살아 숨 쉬는 실천 보살행 — 형식적 교리에 갇히지 않고 현실의 고통을 치유하기',
    pragmaticInsight: '경전의 활자에 갇힌 불교는 죽은 학문에 불과합니다. 백성이 굶주리고 피 흘릴 때 성곽을 쌓고 무기를 다루며 백성을 먹여 살렸던 사명대사의 선구적 실천주의는 참된 보살행의 귀감입니다.',
    practicalCounsel: '탁상공론이나 뜬구름 잡는 명분에 머물지 마십시오. 현장의 구체적인 결핍과 고통을 해결하는 살아있는 실천에 집중하십시오. 문제를 실질적으로 해결하는 자가 참된 지도자입니다.',
  },
  {
    themeKey: 'pureRenunciation',
    themeTitleEn: 'Sublime Renunciation: Shaking Dust off Robes and Returning to Mountains in Peace',
    themeTitleKo: '공을 이룬 뒤의 초연한 무소유 — 부귀영화를 털고 맑은 산사로 돌아가 평정을 지키기',
    pragmaticInsight: '전쟁을 승리로 이끌고 3,500명의 백성을 구한 뒤, 사명대사는 조정이 내리는 높은 벼슬과 영화를 마다하고 가야산 해인사 홍제암으로 돌아가 고요히 입적했습니다.',
    practicalCounsel: '성과나 공치사에 집착하지 마십시오. 자신의 소임을 다 마친 후에는 욕심 없이 털어버릴 수 있는 청빈과 초연함을 지니십시오. 집착을 내려놓을 때 진정한 내면의 자유가 찾아옵니다.',
  },
];

export const SAMYEONG_APHORISMS: SamyeongAphorism[] = [
  {
    aphorismKey: 'ratherDieForRighteousness',
    aphorismKo: '차라리 의로움 아래서 죽을지언정, 불의 속에서 구차하게 목숨을 구걸하지 않으리라.',
    aphorismHanja: '寧死義下, 不活逆中.',
    sourceContext: '사명대사 송운 유정 《분충서난록(奮忠抒難錄)》',
    actionGuidance: '비겁한 타협으로 명예를 더럽히지 마십시오. 도덕적 대의와 긍지를 지키며 정정당당하게 전진하십시오.',
  },
  {
    aphorismKey: 'rescueThreeThousand',
    aphorismKo: '만 리 귀환길 돛대에 부처의 자비심을 싣고, 삼천여 피랍 백성을 이끌고 옛 고향으로 돌아오도다.',
    aphorismHanja: '萬里歸帆載佛心, 遺民三千返舊鄕.',
    sourceContext: '사명대사 송운 유정 《사명당대사집(四溟堂大師集)》',
    actionGuidance: '어려움에 처한 동료와 이웃을 외면하지 마십시오. 지혜와 헌신을 다해 소중한 사람들을 지켜내십시오.',
  },
  {
    aphorismKey: 'equanimityOverWeapons',
    aphorismKo: '삶과 죽음이 본래 아침 안개와 같거늘 어찌 칼날을 두려워하랴. 대자대비로 널리 구제해야 비로소 큰 평화가 오느니라.',
    aphorismHanja: '生死如幻, 何畏刀兵. 慈悲普度, 方得太和.',
    sourceContext: '사명대사 송운 유정 《가토 기요마사 서생포 담판 어록》',
    actionGuidance: '두려움에 굴복하지 마십시오. 생사의 집착을 내려놓고 굳건한 평정과 자비로 국면을 주도하십시오.',
  },
  {
    aphorismKey: 'pureReturnToMountain',
    aphorismKo: '소임을 다 마치고 옷깃을 털며 떠나가니, 안개와 노을 자욱한 옛 산사로 홀연히 들어가노라.',
    aphorismHanja: '事了拂衣去, 煙霞入舊山.',
    sourceContext: '사명대사 송운 유정 《사명당대사집(四溟堂大師集)》',
    actionGuidance: '성공의 순간에 교만해지지 마십시오. 마음을 비우고 겸허한 초연함을 회복하여 삶의 고결함을 지키십시오.',
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

export function calculateKoreanSamyeongdaesaSongunYujeong(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanSamyeongdaesaSongunYujeongResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `SAMYEONGDAESA-SONGUN-YUJEONG:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const righteousDevotionScore = 88 + ((absHash >> 1) % 11);
  const diplomaticRescueIndex = 87 + ((absHash >> 4) % 12);
  const transcendentCompassionScore = 86 + ((absHash >> 7) % 13);
  const pragmaticBodhisattvaIndex = 85 + ((absHash >> 10) % 14);
  const renunciationResilienceScore = 89 + ((absHash >> 13) % 10);

  const themeIndex = (absHash >> 5) % SAMYEONG_THEMES.length;
  const secondaryThemeIndex = (themeIndex + 1 + ((absHash >> 7) % (SAMYEONG_THEMES.length - 1))) % SAMYEONG_THEMES.length;
  const aphorismIndex = (absHash >> 8) % SAMYEONG_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (SAMYEONG_APHORISMS.length - 1))) % SAMYEONG_APHORISMS.length;

  const activeSamyeongTheme = SAMYEONG_THEMES[themeIndex];
  const secondarySamyeongTheme = SAMYEONG_THEMES[secondaryThemeIndex];
  const focalSamyeongAphorism = SAMYEONG_APHORISMS[aphorismIndex];
  const secondarySamyeongAphorism = SAMYEONG_APHORISMS[secondaryAphorismIndex];

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `사명대사의 '${activeSamyeongTheme.themeTitleKo}'와 '${secondarySamyeongTheme.themeTitleKo}'를 비추어 볼 때, "${trimmedQuery}"에서 사적인 안위를 넘어 끝까지 지켜야 할 대의와 자비의 결단은 무엇인가요?`
    : `지금 당신이 마주한 갈등이나 위기 속에서, '${activeSamyeongTheme.themeTitleKo}'의 담대한 기개와 '${secondarySamyeongTheme.themeTitleKo}'의 초연함을 함께 세우려면 무엇을 내려놓고 무엇을 지켜야 할까요?`;

  const interpretiveBoundary = '이 지표는 사명대사 송운 유정의 《분충서난록》과 《사명당대사집》의 호국 대의·담판 지략·자비구제·무소유 철학을 오늘의 선택을 비추는 정성적 성찰 틀로 해석한 결과이며, 실제 협상·법적 판단·구체적 위기 대응을 대신하는 확정 예측이 아닙니다.';

  const guidanceTitle = `사명대사 송운 유정 호국 대의와 자비 구제 지혜: ${activeSamyeongTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 중기 국난을 극복한 구국의 선승이자 불세출의 외교가 사명대사 송운 유정 선생은 《분충서난록》과 대일 강화담판을 통해 ` +
    `살신성인(殺身成仁)의 호국 대의와 3,500여 피랍 동포를 온전히 구출해 낸 위대한 자비구제와 초연한 무소유의 도량을 몸소 증명했습니다. ` +
    `현재 당신이 마주한 도전과 시련을 지혜롭게 돌파하는 핵심 열쇠는 '${activeSamyeongTheme.themeTitleKo}'입니다. ` +
    `${activeSamyeongTheme.practicalCounsel} 사명대사의 불후의 명구 "${focalSamyeongAphorism.aphorismKo}" (${focalSamyeongAphorism.aphorismHanja})를 깊이 새기며, ` +
    `${focalSamyeongAphorism.actionGuidance}`;

  const calculatedAtKst = formatSamyeongKstTimestamp(now);
  const avgScore = Math.round(
    (righteousDevotionScore +
      diplomaticRescueIndex +
      transcendentCompassionScore +
      pragmaticBodhisattvaIndex +
      renunciationResilienceScore) /
      5,
  );
  const samyeongSynthesisMatrix = {
    dominantTension: `${activeSamyeongTheme.themeTitleKo} ↔ ${focalSamyeongAphorism.sourceContext}`,
    alignmentState: describeSamyeongStage(avgScore),
    integratedAction: `${focalSamyeongAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_SAMYEONGDAESA_SONGUN_YUJEONG_VERSION,
    calculatedAtKst,
    righteousDevotionScore,
    diplomaticRescueIndex,
    transcendentCompassionScore,
    pragmaticBodhisattvaIndex,
    renunciationResilienceScore,
    activeSamyeongTheme,
    secondarySamyeongTheme,
    focalSamyeongAphorism,
    secondarySamyeongAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    samyeongComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    samyeongSynthesisMatrix,
  };
}

export function formatKoreanSamyeongdaesaSongunYujeongPrompt(
  res: KoreanSamyeongdaesaSongunYujeongResult,
): string {
  const avgScore = Math.round(
    (res.righteousDevotionScore +
      res.diplomaticRescueIndex +
      res.transcendentCompassionScore +
      res.pragmaticBodhisattvaIndex +
      res.renunciationResilienceScore) /
      5,
  );
  const lines = [
    `【사명대사 송운 유정 《분충서난록》 호국대의 및 자비구제 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 호국 자비 국면: ${describeSamyeongStage(avgScore)}`,
    `- 핵심 사명대사 테마: ${res.activeSamyeongTheme.themeTitleKo} [${res.activeSamyeongTheme.themeTitleEn}]`,
    `- 보조 교차 테마: ${res.secondarySamyeongTheme.themeTitleKo} [${res.secondarySamyeongTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeSamyeongTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeSamyeongTheme.practicalCounsel}`,
    `- 사명대사 원전 명언: "${res.focalSamyeongAphorism.aphorismKo}" (${res.focalSamyeongAphorism.aphorismHanja})`,
    `- 보조 교차 명언: "${res.secondarySamyeongAphorism.aphorismKo}" (${res.secondarySamyeongAphorism.aphorismHanja})`,
    `- 원전 출처: [${res.focalSamyeongAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalSamyeongAphorism.actionGuidance}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 종합 사명대사 권면: ${res.samyeongComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.samyeongSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.samyeongSynthesisMatrix.dominantTension} | 조율 상태: ${res.samyeongSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.samyeongSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
