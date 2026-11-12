/**
 * 대한민국 소월 김소월(素月 金廷湜) 시인 《진달래꽃》·《산유화》·《초혼》 지순한 헌신적 사랑·한(恨)의 서정적 승화·자연 달관과 민초 회복탄력성 지혜 엔진
 *
 * 한국 현대 서정시의 영원한 봉우리이자 민족시인 소월 김정식(1902~1934)의 원전 기반:
 * 1. 말없이 고이 보내 드리는 지순한 헌신과 축복 지표 (Devoted Love & Self-Sacrificing Blessing Score): "나 보기가 역겨워 가실 때에는 말없이 고이 보내 드리우리다"의 영변 약산 진달래꽃을 뿌리는 조건 없는 사랑과 숭고한 배려의 품격.
 * 2. 눈물을 안으로 삭이며 노래로 빚는 슬픔의 서정적 승화 지수 (Poetic Sublimation of Grief / Inward Restraint Index): "죽어도 아니 눈물 흘리우리다"처럼 고통과 이별의 비탄을 원망으로 터뜨리지 않고 아름다운 절제의 서정으로 승화시키는 내면의 힘.
 * 3. 산유화의 저만치 피어있는 자연과 생명 순환 달관도 (SanYuHwa Nature Attunement & Solitary Acceptance Score): "산에 산에 피는 꽃은 저만치 혼자서 피어 있네"처럼 홀로 피고 지는 우주와 자연의 섭리를 깊이 관조하며 고독을 긍정하는 지혜.
 * 4. 부르다가 내가 죽을 이름을 부르는 영혼의 진솔한 열망 지표 (Soul Invocation / ChoHon Passionate Sincerity Index): 허공 중에 헤어진 이름을 목놓아 부르는 《초혼》의 절절함처럼 형식과 체면을 넘어 가장 진실한 자기 영혼의 외침을 표현하는 용기.
 * 5. 우리의 보습 대일 땅을 일구어 나가는 강인한 민초 회복탄력성 (Dauntless Grassroots Resilience & Fertile Hope Score): "바라건대는 우리에게 우리의 보습 대일 땅이 있었더면"처럼 척박하고 메마른 땅에서도 끝내 쟁기를 쥐고 희망의 밭을 일구어 내는 꺾이지 않는 생명력.
 *
 * @version LUCKEY-KIM-SO-WOL-AZALEA-POETIC-GRACE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_KIM_SO_WOL_AZALEA_VERSION = 'LUCKEY-KIM-SO-WOL-AZALEA-POETIC-GRACE-v1.0.0';

export interface KimSoWolTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  poeticInsight: string;
  practicalCounsel: string;
}

export interface KimSoWolAphorism {
  aphorismKey: string;
  aphorismKo: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanKimSoWolAzaleaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 김소월 핵심 지표 (0~100)
  devotedLoveBlessingScore: number;                      // 지순한 헌신과 축복 지표 (Devoted Love & Self-Sacrificing Blessing)
  griefPoeticSublimationIndex: number;                   // 슬픔의 서정적 승화 지수 (Poetic Sublimation of Grief)
  sanYuHwaNatureAttunementScore: number;                 // 산유화의 자연 순환 달관도 (SanYuHwa Nature Attunement & Solitude)
  soulInvocationLongingIndex: number;                    // 영혼의 진솔한 열망 지표 (Soul Invocation / ChoHon Passionate Sincerity)
  dauntlessGrassrootsResilienceScore: number;            // 강인한 민초 회복탄력성 (Dauntless Grassroots Resilience)
  // 세부 분석
  activeKimSoWolTheme: KimSoWolTheme;
  focalKimSoWolAphorism: KimSoWolAphorism;
  kimSoWolComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const KIM_SO_WOL_THEMES: KimSoWolTheme[] = [
  {
    themeKey: 'azaleaFlowerBlessing',
    themeTitleEn: 'Azalea Flowers of Blessing: Pure Devotion and Noble Grace Transcending Bitterness',
    themeTitleKo: '진달래꽃의 축복 — 원망과 미움을 넘어 떠나는 길에 꽃을 뿌리는 지순한 사랑의 도량',
    poeticInsight: '《진달래꽃》에서 시인은 이별의 극한 슬픔 앞에서도 상대를 원망하거나 붙잡으며 매달리지 않습니다. 영변의 약산 진달래꽃을 아름 따다 가시는 걸음마다 사뿐히 즈려밟고 가시옵소서 축복하며, "죽어도 아니 눈물 흘리우리다"라는 지극한 애이불비(哀而不悲)의 미학으로 승화시킵니다.',
    practicalCounsel: '인간관계나 일의 매듭에서 서운함과 분노를 터뜨리지 마십시오. 지나간 인연과 실패를 축복과 감사의 마음으로 정갈하게 떠나보낼 때, 당신의 영혼은 가장 높은 품격과 새로운 시작의 힘을 얻습니다.',
  },
  {
    themeKey: 'sanYuHwaSolitaryBloom',
    themeTitleEn: 'SanYuHwa Flowers Blooming Yonder: Solitary Serenity Attuned to Natural Seasons',
    themeTitleKo: '산유화와 저만치의 고독 — 홀로 피고 지는 자연의 섭리를 관조하며 영혼의 평정 찾기',
    poeticInsight: '《산유화》의 꽃은 산에서 피고, 산에서 집니다. 봄 여름 가을 없이 피는 꽃은 "저만치 혼자서" 피어 있고, 산에서 우는 작은 새는 꽃이 좋아 산에서 삽니다. 시인은 존재의 근원적 고독을 한탄하지 않고, 자연의 담담한 섭리 속에 고요히 깃들게 합니다.',
    practicalCounsel: '혼자라는 외로움이나 세상과의 거리감을 두려워하지 마십시오. 저만치 혼자 피어있는 산유화처럼, 당신만의 고유한 자리에서 조용히 당신의 빛깔과 향기를 피워내는 것만으로도 존재는 충분히 거룩합니다.',
  },
  {
    themeKey: 'choHonSpiritualYearning',
    themeTitleEn: 'ChoHon Soul Invocation: Piercing the Heavens with True Yearning and Passion',
    themeTitleKo: '초혼의 진솔한 외침 — 허공을 가르는 간절한 열망으로 영혼의 참된 소망을 깨우기',
    poeticInsight: '《초혼》에서 시인은 산산이 부서진 이름, 허공 중에 헤어진 이름을 목놓아 부르며 서산마루에 붉은 해가 걸릴 때까지 영혼의 부르짖음을 멈추지 않습니다. "부르다가 내가 죽을 이름이여!" 가슴속에 맺힌 정한(情恨)을 피하지 않고 온몸으로 터뜨려 영혼을 정화합니다.',
    practicalCounsel: '체면과 두려움 뒤로 당신의 간절한 꿈과 진심을 숨기지 마십시오. 당신의 삶에서 진정으로 소중한 대상과 가치를 향해 온 마음으로 손을 뻗고 솔직한 열정을 쏟아낼 때 응어리진 가슴이 풀려납니다.',
  },
  {
    themeKey: 'fertilePlowlandHope',
    themeTitleEn: 'Land for Our Plow: Unyielding Grassroots Resilience Cultivating the Barren Earth',
    themeTitleKo: '우리의 보습 대일 땅 — 척박한 현실 속에서도 희망의 쟁기를 잡고 새벽을 여는 생명력',
    poeticInsight: '《바라건대는 우리에게 우리의 보습 대일 땅이 있었더면》에서 시인은 거친 방황과 억압의 현실 속에서도 끝내 절망하지 않고, 기름진 한 이랑의 흙을 일구어 씨앗을 뿌리겠다는 민초의 강인한 대지적 생명력을 선언합니다.',
    practicalCounsel: '지금 당장의 처지와 환경이 메마르고 척박할지라도 결코 주저앉지 마십시오. 오늘 내게 주어진 작은 일터와 삶의 밭을 성실하게 갈아엎을 때, 머지않아 푸른 새싹과 풍요로운 수확이 반드시 찾아옵니다.',
  },
];

export const KIM_SO_WOL_APHORISMS: KimSoWolAphorism[] = [
  {
    aphorismKey: 'azaleaFlowerQuote',
    aphorismKo: '나 보기가 역겨워 가실 때에는 말없이 고이 보내 드리우리다. 영변에 약산 진달래꽃 아름 따다 가실 길에 뿌리우리다. 가시는 걸음 걸음 놓인 그 꽃을 사뿐히 즈려밟고 가시옵소서. 나 보기가 역겨워 가실 때에는 죽어도 아니 눈물 흘리우리다.',
    sourceContext: '《진달래꽃》(1925년 매문사 시집 간행)',
    actionGuidance: '상실이나 이별 앞에서도 비굴하거나 원망하지 말고, 깊은 절제와 고결한 축복으로 영혼의 품위를 지키십시오.',
  },
  {
    aphorismKey: 'sanYuHwaQuote',
    aphorismKo: '산에는 꽃 피네 꽃이 피네. 갈 봄 여름 없이 꽃이 피네. 산에 산에 피는 꽃은 저만치 혼자서 피어 있네. 산에서 우는 작은 새여 꽃이 좋아 산에서 사노라네. 산에는 꽃 지네 꽃이 지네. 갈 봄 여름 없이 꽃이 지네.',
    sourceContext: '《산유화(山友花)》(1924년 영대 발표)',
    actionGuidance: '자연의 사계절처럼 피고 지는 인생의 순환을 담담히 받아들이고, 홀로 서 있는 지금의 자리를 긍정하십시오.',
  },
  {
    aphorismKey: 'choHonQuote',
    aphorismKo: '산산이 부서진 이름이여! 허공 중에 헤어진 이름이여! 불러도 주인 없는 이름이여! 부르다가 내가 죽을 이름이여! 심중에 남아 있는 말 한마디는 끝끝내 마저 하지 못하였구나.',
    sourceContext: '《초혼(招魂)》(1925년 시집 진달래꽃 수록)',
    actionGuidance: '마음속에 품어둔 소중한 진심을 때를 놓쳐 묻어두지 말고, 살아 숨 쉬는 지금 사랑과 감사를 온전히 표현하십시오.',
  },
  {
    aphorismKey: 'plowlandQuote',
    aphorismKo: '나는 꿈꾸었노라, 동무들과 내가 가지런히 벌가의 하루 일을 다 마치고, 석양에 마을로 돌아오는 꿈을, 즐거운 꿈을. 그러나 집 잃은 내 몸이여, 바라건대는 우리에게 우리의 보습 대일 땅이 있었더면!',
    sourceContext: '《바라건대는 우리에게 우리의 보습 대일 땅이 있었더면》(1925년 개벽 발표)',
    actionGuidance: '눈앞의 시련에 위축되지 말고, 당신의 꿈과 미래를 일구어낼 정직한 노력의 쟁기를 힘차게 쥐십시오.',
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

export function calculateKoreanKimSoWolAzaleaFlowerPoeticGrace(
  profile?: UserProfile,
  query?: string,
): KoreanKimSoWolAzaleaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `KIM-SO-WOL-AZALEA-POETIC-GRACE:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const devotedLoveBlessingScore = 91 + ((absHash >> 1) % 8);
  const griefPoeticSublimationIndex = 90 + ((absHash >> 4) % 9);
  const sanYuHwaNatureAttunementScore = 89 + ((absHash >> 7) % 10);
  const soulInvocationLongingIndex = 88 + ((absHash >> 10) % 11);
  const dauntlessGrassrootsResilienceScore = 92 + ((absHash >> 13) % 7);

  const themeIndex = (absHash >> 5) % KIM_SO_WOL_THEMES.length;
  const aphorismIndex = (absHash >> 8) % KIM_SO_WOL_APHORISMS.length;

  const activeKimSoWolTheme = KIM_SO_WOL_THEMES[themeIndex];
  const focalKimSoWolAphorism = KIM_SO_WOL_APHORISMS[aphorismIndex];

  const guidanceTitle = `소월 김소월 진달래꽃의 헌신과 산유화의 생명 달관: ${activeKimSoWolTheme.themeTitleKo}`;
  const philosophicalCounsel = `대한민국 민족 서정시의 불멸의 거장 소월 김정식 시인은 《진달래꽃》, 《산유화》, 《초혼》을 통해 ` +
    `말없이 고이 보내 드리며 앞길에 꽃을 뿌리는 지순한 사랑의 헌신, 비탄을 원망 대신 눈부신 절제의 노래로 빚어내는 슬픔의 승화, ` +
    `저만치 홀로 피고 지는 자연의 섭리를 겸허히 긍정하는 산유화의 고결한 고독, 그리고 보습 대일 땅을 찾아 쟁기를 잡는 강인한 민초의 생명력을 일깨웠습니다. ` +
    `지금 당신의 마음에 가장 따스한 온기를 전하는 시적 등불은 '${activeKimSoWolTheme.themeTitleKo}'입니다. ` +
    `${activeKimSoWolTheme.practicalCounsel} 김소월 시인의 불후의 명구 "${focalKimSoWolAphorism.aphorismKo}"를 가슴에 품고, ` +
    `${focalKimSoWolAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_KIM_SO_WOL_AZALEA_VERSION,
    calculatedAtKst: new Date().toISOString(),
    devotedLoveBlessingScore,
    griefPoeticSublimationIndex,
    sanYuHwaNatureAttunementScore,
    soulInvocationLongingIndex,
    dauntlessGrassrootsResilienceScore,
    activeKimSoWolTheme,
    focalKimSoWolAphorism,
    kimSoWolComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanKimSoWolAzaleaFlowerPoeticGracePrompt(
  res: KoreanKimSoWolAzaleaResult,
): string {
  return [
    `【소월 김소월 《진달래꽃·산유화·초혼》 지순한 헌신·슬픔의 승화 지표】`,
    `- 지순한 헌신과 축복 지표(Devoted Love & Blessing): ${res.devotedLoveBlessingScore}/100`,
    `- 슬픔의 서정적 승화 지수(Poetic Grief Sublimation): ${res.griefPoeticSublimationIndex}/100`,
    `- 산유화 자연 순환 달관도(SanYuHwa Nature Attunement): ${res.sanYuHwaNatureAttunementScore}/100`,
    `- 영혼의 진솔한 열망 지표(Soul Invocation Sincerity): ${res.soulInvocationLongingIndex}/100`,
    `- 강인한 민초 회복탄력성(Dauntless Grassroots Resilience): ${res.dauntlessGrassrootsResilienceScore}/100`,
    `- 핵심 김소월 테마: ${res.activeKimSoWolTheme.themeTitleKo} [${res.activeKimSoWolTheme.themeTitleEn}]`,
    `- 시적 사색: ${res.activeKimSoWolTheme.poeticInsight}`,
    `- 행동 조언: ${res.activeKimSoWolTheme.practicalCounsel}`,
    `- 김소월 원전 명시: "${res.focalKimSoWolAphorism.aphorismKo}"`,
    `- 원전 출처: [${res.focalKimSoWolAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalKimSoWolAphorism.actionGuidance}`,
    `- 종합 김소월 권면: ${res.kimSoWolComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
