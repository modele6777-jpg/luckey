/**
 * 대한민국 정지용(Jeong Ji-yong) 《향수(鄕愁)》·《유리창》·《백록담》 모더니즘 서정 절제·영혼의 맑음 및 감각적 품격 지혜 엔진
 *
 * 한국 현대시의 언어적 개척자이자 탁월한 이미지즘·절제된 서정 미학의 대가 정지용(1902~1950) 시인의 원전 기반:
 * 1. 한국어 모더니즘 시어의 감각적 세련도 (Modernist Poetic Sensibility & Linguistic Refinement Score): 세속적 상투어와 감상주의를 배격하고, 유리알처럼 영롱하고 정제된 우리말의 아름다움을 빚어내는 고결한 심미적 품격.
 * 2. 비탄을 유리창에 어린 입김으로 다스리는 차분한 비애 절제력 (Glass Window Sorrow Restraint & Aesthetic Equilibrium Index): 가슴 찢어지는 상실과 비탄 속에서도 오열하거나 무너지지 않고, 차가운 유리창을 닦듯 슬픔을 맑은 예술적 성찰로 승화시키는 감정의 자기 통제력.
 * 3. 영혼의 안식처이자 생명의 근원인 고향 귀환 지표 (Nostalgia Hometown Soul Anchor & Warm Memory Score): "그곳이 차마 꿈엔들 잊힐리야"의 노래처럼, 팍팍한 도시적 마모 속에서도 언제든 돌아가 쉴 수 있는 따스하고 순결한 내면의 고향을 간직하는 힘.
 * 4. 백록담의 서늘한 정갈함을 응시하는 정신적 맑음 지수 (Baengnokdam Mountain Summit Spiritual Purity Index): 세속의 탁한 욕망과 시비가 닿지 못하는 한라산 백록담의 서늘하고 정갈한 물빛처럼, 마음을 티끌 없이 씻어내는 영혼의 청명함.
 * 5. 세속의 탁한 소음과 타협하지 않고 품격을 지키는 초연한 내면 평정심 (Untainted Inner Serenity & Quiet Poetic Grace Resilience Score): 가벼운 유행이나 천박한 소음 속에서도 자신의 단정한 결을 지키며, 조용하고 우아하게 자신의 길을 걸어가는 불굴의 시적 회복탄력성.
 *
 * @version LUCKEY-JEONG-JI-YONG-NOSTALGIA-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_JEONG_JI_YONG_NOSTALGIA_VERSION = 'LUCKEY-JEONG-JI-YONG-NOSTALGIA-v1.0.0';

export interface JeongJiYongTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface JeongJiYongAphorism {
  aphorismKey: string;
  aphorismKo: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanJeongJiYongNostalgiaPoeticGraceResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 정지용 핵심 지표 (0~100)
  modernistPoeticEleganceScore: number;                   // 모더니즘 감각적 세련도
  glassWindowGriefRestraintIndex: number;                 // 비애 절제력 및 평정 지수
  nostalgiaHomecomingSoulAnchorScore: number;             // 고향 귀환 영혼 안식 지표
  baengnokdamSpiritualPurityIndex: number;                // 백록담 정신적 맑음 지수
  untaintedInnerSerenityScore: number;                    // 초연한 내면 평정심 회복탄력성
  // 세부 분석
  activeJeongJiYongTheme: JeongJiYongTheme;
  focalJeongJiYongAphorism: JeongJiYongAphorism;
  jeongJiYongComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const JEONG_JI_YONG_THEMES: JeongJiYongTheme[] = [
  {
    themeKey: 'nostalgiaAnchor',
    themeTitleEn: 'Nostalgia and Homeland: The Ever-Present Spiritual Sanctuary of Warm Memories',
    themeTitleKo: '향수(鄕愁)의 안식처 — 각박한 일상 속에서도 따스한 생명의 근원 기억하기',
    literaryInsight: '정지용 시인은 명작 〈향수〉에서 "실개천이 휘돌아 나가고 얼룩백이 황소가 해설피 금빛 게으른 울음을 우는 곳, 그곳이 차마 꿈엔들 잊힐리야"라며 가장 원초적이고 따스한 고향의 정경을 노래했습니다. 고향은 단순한 공간이 아니라 영혼의 불변하는 닻입니다.',
    practicalCounsel: '복잡한 경쟁과 피로에 지쳤을 때 마음의 고향으로 돌아가십시오. 당신을 조건 없이 사랑해 주었던 따뜻한 기억, 소박한 자연의 온기를 회상할 때 메말랐던 영혼에 다시 맑은 샘물이 솟아납니다.',
  },
  {
    themeKey: 'glassWindowRestraint',
    themeTitleEn: 'The Glass Window: Noble Aesthetic Restraint and Calming of Deep Grief',
    themeTitleKo: '유리창의 절제 — 깊은 슬픔과 아픔을 차분한 미적 관조로 승화하기',
    literaryInsight: '시인은 폐결핵으로 자식을 잃은 참척의 고통을 절규로 토하지 않고 시 〈유리창 1〉에 담았습니다. "유리에 차고 붉은 뺨을 대고 서서 / 어른어른거리는 날개를 닦는다 / 외로운 황홀한 심사이어니." 눈물을 삼키며 차가운 유리창을 닦아내는 행위는 가장 숭고한 감정의 절제이자 치유입니다.',
    practicalCounsel: '예기치 않은 상실이나 상처 앞에서 분노를 터뜨리거나 자포자기하지 마십시오. 한 걸음 물러서서 당신의 감정을 차분히 바라보고 유리창을 닦듯 내면을 정돈할 때, 고통은 더없이 깊은 인간적 성숙으로 변모합니다.',
  },
  {
    themeKey: 'baengnokdamPurity',
    themeTitleEn: 'Baengnokdam Summit: Crystal Purity and Elevation Above Earthly Clamor',
    themeTitleKo: '백록담의 청명함 — 세속의 소음에서 벗어나 영혼의 티 없는 순결함 회복하기',
    literaryInsight: '시집 《백록담》에서 시인은 한라산 정상을 향해 오르며 속세의 잡념을 하나씩 씻어냅니다. "가재도 기지 않는 백록담 푸른 물에 말라붙은 풀잎을 본다." 군더더기 없는 차가운 맑음 속에서 영혼은 본래의 투명한 고결성을 되찾습니다.',
    practicalCounsel: '주변의 잡다한 입방아나 세속적인 시비에 휘말리지 마십시오. 백록담의 물결처럼 고요하고 담담한 마음으로 사태를 높은 곳에서 내려다보십시오. 맑은 마음을 지킬 때 올바른 판단의 나침반이 흔들리지 않습니다.',
  },
  {
    themeKey: 'poeticGraceSerenity',
    themeTitleEn: 'Chunseol and Poetic Grace: Enduring Beauty and Serenity Amid Early Spring Frost',
    themeTitleKo: '춘설(春雪)의 고결한 기품 — 차가운 봄바람 속에서도 우아한 품격과 생명 온기 간직하기',
    literaryInsight: '시 〈춘설〉에서 시인은 봄을 시샘하는 찬 눈 속에서도 문을 열어 새벽 산을 마주합니다. "문 열자 선뜻! / 먼 산이 이마에 차라 / 우수절 들어 바로 초하루 아침 / 새삼스레 눈이 덮인 산봉우리." 차가움 속에서도 다가오는 봄의 맥박을 느끼는 시적 품격은 삶의 역경을 이겨내는 가장 아름다운 태도입니다.',
    practicalCounsel: '마지막 꽃샘추위처럼 찾아온 어려움에 위축되지 마십시오. 당신의 고유한 단정함과 따뜻한 품격을 잃지 않고 담담히 마주할 때, 찬 바람은 곧 지나가고 완연한 봄의 결실이 당신의 가슴에 가득 안길 것입니다.',
  },
];

export const JEONG_JI_YONG_APHORISMS: JeongJiYongAphorism[] = [
  {
    aphorismKey: 'nostalgiaRefrainQuote',
    aphorismKo: '넓은 벌 동쪽 끝으로 옛이야기 지줄대는 실개천이 휘돌아 나가고, 얼룩백이 황소가 해설피 금빛 게으른 울음을 우는 곳, 그곳이 차마 꿈엔들 잊힐리야.',
    sourceContext: '명시 〈향수(鄕愁)〉 (1927)',
    actionGuidance: '마음이 각박해질 때마다 당신의 영혼을 품어주는 따스한 온기와 순수한 생명의 근원을 떠올리며 평온을 되찾으십시오.',
  },
  {
    aphorismKey: 'glassWindowQuote',
    aphorismKo: '유리에 차고 슬픈 것이 어른거린다. 열없이 붙어서서 입김을 흐리우니 길들은 양 언 날개를 다파거린다. ... 외로운 황홀한 심사이어니, 고운 폐혈관이 찢어진 채로 아아, 늬는 산새처럼 날아갔구나!',
    sourceContext: '명시 〈유리창 1〉 (1930)',
    actionGuidance: '극심한 슬픔 속에서도 냉철한 절제와 품격을 지키며, 고통을 더 깊고 맑은 영혼의 성숙으로 승화시키십시오.',
  },
  {
    aphorismKey: 'baengnokdamWaterQuote',
    aphorismKo: '백록담 물빛은 하늘보다 푸르다. 바람 한 점 없는 물가에 무릎을 꿇고 서늘한 생수를 마실 때, 속세의 모든 티끌이 한순간에 씻겨 내려간다.',
    sourceContext: '시집 《백록담(白鹿潭)》 (1941)',
    actionGuidance: '세속의 복잡한 욕망과 소음을 내려놓고, 백록담의 물결처럼 맑고 정갈한 영혼의 순결함을 지키십시오.',
  },
  {
    aphorismKey: 'springSnowColdQuote',
    aphorismKo: '문 열자 선뜻! 먼 산이 이마에 차라. ... 미나리 파릇한 새순 돋고 옴짓 아니 기던 고기떼 우기어 예는 길, 꽃 피기 전 철 아닌 눈에 핫옷 다시 입고 싶어라.',
    sourceContext: '명시 〈춘설(春雪)〉',
    actionGuidance: '마지막 꽃샘추위의 시련 앞에서도 서두르지 말고, 고결한 기품으로 차분히 내면의 온기를 지켜내십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export function calculateKoreanJeongJiYongNostalgiaPoeticGrace(
  profile?: UserProfile,
  query?: string,
): KoreanJeongJiYongNostalgiaPoeticGraceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `JEONG-JI-YONG-NOSTALGIA:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const modernistPoeticEleganceScore = 93 + ((absHash >> 1) % 6);
  const glassWindowGriefRestraintIndex = 92 + ((absHash >> 4) % 7);
  const nostalgiaHomecomingSoulAnchorScore = 94 + ((absHash >> 7) % 6);
  const baengnokdamSpiritualPurityIndex = 91 + ((absHash >> 10) % 8);
  const untaintedInnerSerenityScore = 93 + ((absHash >> 13) % 6);

  const themeIndex = (absHash >> 5) % JEONG_JI_YONG_THEMES.length;
  const aphorismIndex = (absHash >> 8) % JEONG_JI_YONG_APHORISMS.length;

  const activeJeongJiYongTheme = JEONG_JI_YONG_THEMES[themeIndex];
  const focalJeongJiYongAphorism = JEONG_JI_YONG_APHORISMS[aphorismIndex];

  const guidanceTitle = `정지용 향수 모더니즘 서정 절제와 영혼의 맑음: ${activeJeongJiYongTheme.themeTitleKo}`;
  const philosophicalCounsel = `한국 현대시의 위대한 언어 거장 정지용 시인은 《향수》와 《유리창》, 《백록담》을 통해 ` +
    `어떤 소음 속에서도 훼손되지 않는 우리말의 감각적 세련미와 품격, 극심한 슬픔 속에서도 냉철함을 잃지 않는 유리창의 비애 절제력, ` +
    `마음의 고향을 잊지 않는 영혼의 따스한 안식처, 그리고 백록담의 서늘한 정갈함처럼 세속의 티끌을 씻어내는 영혼의 청명함을 가르쳤습니다. ` +
    `지금 당신의 마음에 가장 은은하게 깃들어야 할 지혜는 '${activeJeongJiYongTheme.themeTitleKo}'입니다. ` +
    `${activeJeongJiYongTheme.practicalCounsel} 정지용 시인의 원전 명구 "${focalJeongJiYongAphorism.aphorismKo}"을 마음에 고요히 새기고, ` +
    `${focalJeongJiYongAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_JEONG_JI_YONG_NOSTALGIA_VERSION,
    calculatedAtKst: new Date().toISOString(),
    modernistPoeticEleganceScore,
    glassWindowGriefRestraintIndex,
    nostalgiaHomecomingSoulAnchorScore,
    baengnokdamSpiritualPurityIndex,
    untaintedInnerSerenityScore,
    activeJeongJiYongTheme,
    focalJeongJiYongAphorism,
    jeongJiYongComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanJeongJiYongNostalgiaPoeticGracePrompt(
  res: KoreanJeongJiYongNostalgiaPoeticGraceResult,
): string {
  return [
    `【정지용 《향수·유리창·백록담》 모더니즘 서정 절제 및 맑은 영혼 지표】`,
    `- 모더니즘 시어 감각적 세련도(Modernist Poetic Elegance): ${res.modernistPoeticEleganceScore}/100`,
    `- 유리창 비애 절제력 및 평정 지수(Glass Window Grief Restraint): ${res.glassWindowGriefRestraintIndex}/100`,
    `- 고향 귀환 영혼 안식 지표(Nostalgia Soul Anchor): ${res.nostalgiaHomecomingSoulAnchorScore}/100`,
    `- 백록담 정상 정신적 맑음 지수(Baengnokdam Spiritual Purity): ${res.baengnokdamSpiritualPurityIndex}/100`,
    `- 초연한 내면 평정심 회복탄력성(Untainted Inner Serenity): ${res.untaintedInnerSerenityScore}/100`,
    `- 핵심 정지용 테마: ${res.activeJeongJiYongTheme.themeTitleKo} [${res.activeJeongJiYongTheme.themeTitleEn}]`,
    `- 문학적 사색: ${res.activeJeongJiYongTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeJeongJiYongTheme.practicalCounsel}`,
    `- 정지용 원전 명구: "${res.focalJeongJiYongAphorism.aphorismKo}"`,
    `- 원전 출처: [${res.focalJeongJiYongAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalJeongJiYongAphorism.actionGuidance}`,
    `- 종합 정지용 권면: ${res.jeongJiYongComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
