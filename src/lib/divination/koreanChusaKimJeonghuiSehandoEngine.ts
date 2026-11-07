/**
 * 조선 완당 추사 김정희(秋史 金正喜) 《세한도(歲寒圖)》 송백후조 & 문자향 서권기 품격 엔진
 *
 * 조선 후기 대학자이자 불세출의 예술가 추사 김정희(1786~1856) 선생의 국보 《세한도(歲寒圖)》 발문 및 《완당집(阮堂集)》 원전 기반:
 * 1. 송백후조(歲寒然後 知松柏之後凋也): 《논어》 자한 편을 인용한 발문처럼, "날이 차가워진 뒤에야 소나무와 잣나무가 시들지 않음을 안다." 인생의 매서운 겨울과 시련 속에서 비로소 드러나는 영혼의 꿋꿋한 지조와 변치 않는 참된 가치.
 * 2. 세한지교(歲寒之交)와 참된 신의: 권세와 부귀가 사라진 고립무원의 제주 유배지에서도 변함없이 북경에서 귀한 책을 구해 보낸 제자 우선 이상적(李尙迪)에게 건넨 영혼의 헌사. 세속적 이해관계를 초월한 불변의 신뢰.
 * 3. 문자향(文字香)과 서권기(書卷氣): "가슴속에 만 권의 책이 들어있지 않으면 문자향과 서권기가 우러나올 수 없다." 잔재주나 요행을 배격하고 깊은 인문학적 수양과 진솔한 내공으로 빚어내는 고결한 품격.
 * 4. 법고창신(法古創新)과 추사체(秋史體)의 파격: 옛 법도를 뼈를 깎듯 궁구한 뒤 마침내 모든 형식의 틀을 깨고 분방하면서도 법도를 잃지 않는 대담한 창조성.
 * 5. 담백함(澹泊)과 갈필(渴筆)의 절제: 화려한 채색을 배제하고 오직 마른 먹(갈필) 하나로 그린 집 한 채와 고목처럼, 불필요한 군더더기와 욕심을 비워낸 본질의 힘.
 *
 * @version LUCKEY-CHUSA-SEHANDO-WISDOM-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const CHUSA_SEHANDO_WISDOM_VERSION = 'LUCKEY-CHUSA-SEHANDO-WISDOM-v1.0.0';

export interface SehandoTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  resilienceCounsel: string;
}

export interface ChusaMaxim {
  maximKey: string;
  maximKo: string;
  maximHanja: string;
  virtueDimension: string;
  actionGuidance: string;
}

export interface ChusaKimJeonghuiSehandoResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 품격 지표 (0~100)
  songbaekHudjoIntegrityScore: number;       // 송백후조(歲寒後凋) 혹한기 역경 극복 지조도
  enduringFriendshipTrustScore: number;     // 세한지교(歲寒之交) 세속 초월 불변 신의도
  munjahyangScholarlyGraceScore: number;    // 문자향 서권기(文字香書卷氣) 깊은 내공 품격도
  chusaBoldHarmonyFlexibilityScore: number; // 법고창신 추사체 독창적 조화·파격력
  dambaekSimgyeongPurityScore: number;      // 갈필담백(渴筆澹泊) 욕심 탈피 본질 집중도
  // 세부 체계
  activeSehandoTheme: SehandoTheme;
  focalChusaMaxim: ChusaMaxim;
  chusaPersonalCounsel: {
    counselTitle: string;
    practicalGuidance: string;
  };
}

export type ChusaKimJeonghuiSehandoReport = ChusaKimJeonghuiSehandoResult;

const SEHANDO_THEMES: SehandoTheme[] = [
  {
    themeKey: 'SongbaekHudjo',
    themeTitleHanja: '歲寒然後 知松柏之後凋也',
    themeTitleKo: '송백후조 (찬바람이 불어야 푸르른 소나무를 안다)',
    philosophicalInsight: '봄여름의 번영기에는 모두가 푸르게 보이지만, 찬바람 몰아치는 혹한기가 와야 비로소 소나무와 잣나무의 진정한 생명력이 드러납니다. 역경은 참된 가치를 증명하는 무대입니다.',
    resilienceCounsel: '현재 마주한 시련과 정체기를 위기로만 보지 마십시오. 당신의 곧은 신념과 진정한 실력을 단련하고 세상에 드러낼 절호의 기회입니다.',
  },
  {
    themeKey: 'SehandoFriendship',
    themeTitleHanja: '歲寒之交 權門勢利不可比',
    themeTitleKo: '세한지교 (이해관계를 초월한 참된 인연과 신뢰)',
    philosophicalInsight: '권세와 이익으로 맺어진 관계는 이익이 다하면 흩어지지만, 영혼의 뜻과 도리로 맺어진 인연은 유배지의 칼바람 속에서도 더 깊은 온기를 나눕니다.',
    resilienceCounsel: '눈앞의 잇속에 따라 움직이는 관계에 마음 쓰지 마십시오. 진심을 나누고 묵묵히 곁을 지켜주는 진실한 사람들에게 감사하며 정성을 다하십시오.',
  },
  {
    themeKey: 'MunjahyangSeogwongi',
    themeTitleHanja: '胸中富萬卷 書卷氣文字香',
    themeTitleKo: '문자향 서권기 (만 권의 책에서 우러나는 기품과 내공)',
    philosophicalInsight: '겉으로 꾸며낸 잔재주나 화려한 언변은 금세 밑천이 드러납니다. 오랜 성찰과 깊은 공부를 통해 속에서 저절로 우러나오는 향기만이 사람의 마음을 깊이 울립니다.',
    resilienceCounsel: '조급하게 결과를 과시하려 하지 말고, 차분히 내실과 전문성을 다지십시오. 탄탄하게 다져진 내공은 그 자체로 빛을 발합니다.',
  },
  {
    themeKey: 'BeopgoChangsin',
    themeTitleHanja: '法古創新 師古而能化',
    themeTitleKo: '법고창신 (기본을 극진히 익혀 파격을 창조함)',
    philosophicalInsight: '기초와 원칙을 철저히 체화한 사람만이 틀에 얽매이지 않고 대담한 파격과 혁신을 이뤄낼 수 있습니다. 법도를 알면서도 법도에 갇히지 않는 유연함이 최고의 창조성입니다.',
    resilienceCounsel: '기본 규칙을 충실히 지키되, 낡은 관습과 틀에만 머물지 마십시오. 축적된 지식을 바탕으로 당신만의 독창적인 해법을 과감하게 펼치십시오.',
  },
  {
    themeKey: 'GalpilDambaek',
    themeTitleHanja: '渴筆焦墨 澹泊明志',
    themeTitleKo: '갈필담백 (군더더기를 털어낸 담백한 본질의 승부)',
    philosophicalInsight: '물기 없는 마른 먹(갈필)으로 뼈대만을 꼿꼿이 세워낸 세한도처럼, 온갖 화려한 수식과 욕망을 걷어내었을 때 가장 강렬한 정신의 뼈대가 모습을 드러냅니다.',
    resilienceCounsel: '복잡하게 얽힌 부차적인 문제들을 과감히 덜어내십시오. 가장 중요한 단 하나의 본질에만 집중할 때 모든 난관이 명쾌하게 풀립니다.',
  },
];

const CHUSA_MAXIMS: ChusaMaxim[] = [
  {
    maximKey: 'TruthInAffliction',
    maximKo: '시련 속에서 흔들리지 않는 사람만이 천하의 큰일을 감당한다',
    maximHanja: '歲寒松柏 艱難知節',
    virtueDimension: '불굴의 지조와 내면의 단단함',
    actionGuidance: '상황이 어렵더라도 소신을 굽히지 말고, 원칙을 우직하게 지켜나가십시오.',
  },
  {
    maximKey: 'QuietDeepAura',
    maximKo: '먹빛이 맑아야 글씨가 살고, 마음이 담백해야 기품이 선다',
    maximHanja: '墨色澄靜 心地澹泊',
    virtueDimension: '정신적 청정함과 절제',
    actionGuidance: '과도한 욕심과 잡념을 비워내고, 맑고 고요한 마음가짐으로 일에 집중하십시오.',
  },
  {
    maximKey: 'RootsBeforeFlowers',
    maximKo: '꽃의 화려함보다 뿌리의 깊이를 먼저 살펴라',
    maximHanja: '務本節用 根深葉茂',
    virtueDimension: '근본에의 집중과 내실 충실',
    actionGuidance: '겉포장에 연연하기보다 기본기와 핵심 역량을 더욱 깊고 단단하게 다지십시오.',
  },
  {
    maximKey: 'SincereFriendship',
    maximKo: '어려울 때 건네는 작은 정성이 태산보다 무겁다',
    maximHanja: '歲寒知心 義重泰山',
    virtueDimension: '신뢰와 도의의 실천',
    actionGuidance: '고난에 처한 동료나 이웃을 외면하지 말고, 따뜻한 관심과 신의를 행동으로 보여주십시오.',
  },
];

export function calculateChusaKimJeonghuiSehando(
  paramsOrProfile?: { profile?: UserProfile | null; question?: string; now?: Date } | UserProfile | null
): ChusaKimJeonghuiSehandoResult {
  const profile = (paramsOrProfile && 'basic' in paramsOrProfile)
    ? paramsOrProfile
    : paramsOrProfile?.profile;

  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'ChusaKimJeonghuiSehando';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const songbaekHudjoIntegrityScore = 70 + (absHash % 29);
  const enduringFriendshipTrustScore = 68 + ((absHash >> 3) % 31);
  const munjahyangScholarlyGraceScore = 67 + ((absHash >> 6) % 32);
  const chusaBoldHarmonyFlexibilityScore = 66 + ((absHash >> 9) % 33);
  const dambaekSimgyeongPurityScore = 69 + ((absHash >> 12) % 30);

  const themeIndex = (absHash >> 4) % SEHANDO_THEMES.length;
  const maximIndex = (absHash >> 7) % CHUSA_MAXIMS.length;

  const activeSehandoTheme = SEHANDO_THEMES[themeIndex];
  const focalChusaMaxim = CHUSA_MAXIMS[maximIndex];

  const counselTitle = `추사 세한도(歲寒圖) 품격: ${activeSehandoTheme.themeTitleKo}`;
  const practicalGuidance = `추사 김정희 선생의 세한도는 찬바람 부는 겨울 속에서도 꿋꿋한 송백의 기개와 문자향 서권기의 깊은 내공을 지니도록 일깨웁니다. ` +
    `현재 당신의 삶에 필요한 심경은 '${activeSehandoTheme.themeTitleKo}'의 가르침과 통합니다. ` +
    `${activeSehandoTheme.resilienceCounsel} 또한 추사의 명훈인 '${focalChusaMaxim.maximKo}'(${focalChusaMaxim.maximHanja}, ${focalChusaMaxim.virtueDimension})을 가슴에 새겨, ` +
    `${focalChusaMaxim.actionGuidance}`;

  return {
    engineVersion: CHUSA_SEHANDO_WISDOM_VERSION,
    calculatedAtKst: new Date().toISOString(),
    songbaekHudjoIntegrityScore,
    enduringFriendshipTrustScore,
    munjahyangScholarlyGraceScore,
    chusaBoldHarmonyFlexibilityScore,
    dambaekSimgyeongPurityScore,
    activeSehandoTheme,
    focalChusaMaxim,
    chusaPersonalCounsel: {
      counselTitle,
      practicalGuidance,
    },
  };
}

export function formatChusaKimJeonghuiSehandoPrompt(res: ChusaKimJeonghuiSehandoResult): string {
  return [
    `【추사 김정희 세한도(歲寒圖) 송백후조 & 문자향 서권기 지표】`,
    `- 송백후조(歲寒後凋) 역경 극복 지조도: ${res.songbaekHudjoIntegrityScore}/100`,
    `- 세한지교(歲寒之交) 불변의 신의도: ${res.enduringFriendshipTrustScore}/100`,
    `- 문자향 서권기(文字香書卷氣) 내공 품격도: ${res.munjahyangScholarlyGraceScore}/100`,
    `- 법고창신(法古創新) 독창적 융합 조화도: ${res.chusaBoldHarmonyFlexibilityScore}/100`,
    `- 갈필담백(渴筆澹泊) 본질 집중 청정도: ${res.dambaekSimgyeongPurityScore}/100`,
    `- 핵심 세한도 테마: ${res.activeSehandoTheme.themeTitleKo} [${res.activeSehandoTheme.themeTitleHanja}]`,
    `- 철학적 통찰: ${res.activeSehandoTheme.philosophicalInsight}`,
    `- 역경 극복 조언: ${res.activeSehandoTheme.resilienceCounsel}`,
    `- 핵심 완당 명훈: "${res.focalChusaMaxim.maximKo}"`,
    `- 한자 원문: "${res.focalChusaMaxim.maximHanja}" [${res.focalChusaMaxim.virtueDimension}]`,
    `- 실천적 행동 지침: ${res.focalChusaMaxim.actionGuidance}`,
    `- 통합 품격 처방: ${res.chusaPersonalCounsel.practicalGuidance}`,
  ].join('\n');
}
