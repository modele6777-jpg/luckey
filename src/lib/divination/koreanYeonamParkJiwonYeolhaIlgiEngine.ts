/**
 * 조선 연암 박지원(燕巖 朴趾源) 선생 《열하일기(熱河日記)》 도강록(渡江錄) 일야구도(一夜九渡) & 이용후생(利用厚生)·법고창신(法古創新) 실학 지혜 엔진
 *
 * 조선 후기 북학파(北學派)·실학의 거두이자 불세출의 문장가 연암 박지원(朴趾源, 1737~1805) 선생의 불후의 고전 《열하일기(熱河日記)》 원전 기반:
 * 1. 일야구도 심령 평정심(一夜九渡 心靈 平靜心): <도강록(渡江錄) 일야구도하기(一夜九渡河記)> - 하룻밤에 아홉 번 거센 강물을 건너며, 외물의 소음과 감각의 미혹을 털어내고 내면의 두려움을 비워내어 격류를 건너는 지극한 평정과 담대함.
 * 2. 법고창신 창조적 지혜도(法古創新 創造的 智慧度): <초정집서(楚亭集序)> - "옛것을 본받되 변화를 통달하고, 새것을 짓되 근본이 있다(法古而知變 創新而能典)"는 교조적 맹종과 경박한 신기함을 모두 배격하는 진정한 혁신의 미학.
 * 3. 이용후생 실사구시 역량(利用厚生 實事求是 力量): 수레, 벽돌, 관개 기술 하나라도 백성의 실제 삶을 풍요롭게 하고 생활을 편안하게 만드는 데 쓰여야 한다는 경세치용(經世致用)의 실천적 실학정신.
 * 4. 북학개방 문물 수용 혜안(北學開放 視野 慧眼): 좁은 소중화 명분론의 우물 안 개구리를 벗어나, 천하의 뛰어난 문물과 제도를 편견 없이 관찰하고 배움으로써 시대를 혁신하는 광활한 안목.
 * 5. 위선 타파 해학·풍자 여유도(諧謔的 餘裕度): <호질(虎叱)>, <허생전(許生傳)> 등에서 번뜩이는 사대부의 가식과 허위의식을 단칼에 무너뜨리는 호탕한 유머와 통쾌한 해학적 여유.
 *
 * @version LUCKEY-YEONAM-PARK-JIWON-YEOLHA-ILGI-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_YEONAM_PARK_JIWON_VERSION = 'LUCKEY-YEONAM-PARK-JIWON-YEOLHA-ILGI-v1.0.0';

export interface YeonamTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  silhakInsight: string;
  practicalCounsel: string;
}

export interface YeonamAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface YeonamParkJiwonYeolhaIlgiResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 연암 박지원 실학·일야구도 지표 (0~100)
  nightCrossingRiverSerenityScore: number;  // 일야구도 심령 평정심 (一夜九渡 心靈 平靜心)
  beopgoChangsinCreativeWisdomScore: number; // 법고창신 창조적 혁신도 (法古創新 創造的 智慧度)
  iyongHusaengPracticalCompetenceScore: number; // 이용후생 실사구시 역량 (利用厚生 實事求是 力量)
  bukhakOpenMindedInsightScore: number;     // 북학개방 문물 수용 혜안 (北學開放 視野 慧眼)
  haehakSatiricalGenerosityQuotient: number; // 위선 타파 해학·풍자 여유도 (諧謔的 餘裕度)
  // 세부 분석
  activeYeonamTheme: YeonamTheme;
  focalYeonamAphorism: YeonamAphorism;
  yeonamComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const YEONAM_THEMES: YeonamTheme[] = [
  {
    themeKey: 'night_nine_crossings',
    themeTitleHanja: '一夜九渡河 (일야구도하 - 하룻밤에 아홉 번 강을 건너다)',
    themeTitleKo: '감각의 미혹과 두려움을 비워내어 세상의 거센 격류를 건너는 담대함',
    silhakInsight: '귀로 물소리를 들으면 두렵고, 눈으로 소용돌이를 보면 어지럽습니다. 마음속의 사사로운 두려움과 집착을 비워낼 때 세상의 어떤 격랑도 내면을 흔들지 못합니다.',
    practicalCounsel: '주변의 요란한 소문이나 불안을 자극하는 외부 평가에 귀 기울이지 마십시오. 마음의 고요한 중심을 잡고 눈앞의 과업을 묵묵히 건너가십시오.',
  },
  {
    themeKey: 'beopgo_changsin',
    themeTitleHanja: '法古創新 (법고창신 - 옛것을 본받아 새것을 창조함)',
    themeTitleKo: '근본을 잃지 않으면서도 낡은 틀을 깨고 시대를 앞서가는 참된 혁신',
    silhakInsight: '옛것만 고집하면 썩은 곰팡이가 피고, 새것만 좇으면 경박한 유행에 휩쓸립니다. 온고지신의 뿌리 위에서 과감하게 시대를 혁신하는 것이 군자의 도입니다.',
    practicalCounsel: '기본기와 본질적인 가치를 철저히 다진 뒤, 표현과 실행 방식에서는 기존의 관례를 과감히 깨뜨리는 창의적 파격을 시도하십시오.',
  },
  {
    themeKey: 'iyong_husaeng',
    themeTitleHanja: '利用厚生 (이용후생 - 쓰임을 이롭게 하여 삶을 넉넉하게 함)',
    themeTitleKo: '탁상공론을 배격하고 실질적인 삶의 유익과 편의를 창출하는 실사구시',
    silhakInsight: '백성의 밥그릇을 채우고 삶의 고통을 덜어주지 못하는 명분론은 헛된 껍데기일 뿐입니다. 도구와 제도는 사람의 실질적 행복을 위해 복무해야 합니다.',
    practicalCounsel: '화려한 수사나 겉치레에 시간과 자원을 낭비하지 마십시오. 나와 주변 사람들의 일상을 실제로 더 편안하고 윤택하게 만드는 실질적인 해결책에 집중하십시오.',
  },
  {
    themeKey: 'bukhak_openness',
    themeTitleHanja: '北學開放 (북학개방 - 편견 없는 열린 시야와 문물 수용)',
    themeTitleKo: '우물 안의 편협한 잣대를 깨고 천하의 뛰어난 지혜를 배움',
    silhakInsight: '기와 조각과 똥거름 하나라도 쓸모가 있다면 마땅히 겸허히 배워야 합니다. 자존심과 편견을 내려놓고 우수한 것을 흡수하는 자만이 시대를 선도합니다.',
    practicalCounsel: '내 방식이나 기존 지식에만 갇혀 있지 마십시오. 낯선 분야나 새로운 기술, 다른 사람의 장점을 열린 마음으로 흡수하여 내 것으로 승화시키십시오.',
  },
  {
    themeKey: 'haehak_humor',
    themeTitleHanja: '諧謔破僞 (해학파위 - 호탕한 웃음으로 가식과 위선을 깨뜨림)',
    themeTitleKo: '경직된 엄숙주의를 털어내고 삶의 본질을 긍정하는 통쾌한 유머',
    silhakInsight: '스스로를 지나치게 엄숙하고 거룩하게 꾸미는 자는 대개 위선자입니다. 진정한 대인은 스스로를 낮추고 허허로운 웃음으로 삶의 긴장과 허영을 날려 보냅니다.',
    practicalCounsel: '상황을 지나치게 심각하게 받아들이지 마십시오. 한 걸음 물러나 유쾌한 농담과 호탕한 웃음으로 삶의 무게를 털어내고 여유를 되찾으십시오.',
  },
];

export const YEONAM_APHORISMS: YeonamAphorism[] = [
  {
    aphorismKey: 'mind_still_river',
    aphorismKo: '강물 소리가 들리지 않는 것은 귀가 먹어서가 아니라, 마음속의 두려움이 사라져 외물의 소리가 마음에 걸림이 없기 때문이다.',
    aphorismHanja: '道在耳目之外, 心寂則境寂 (열하일기 도강록 일야구도하기)',
    sourceContext: '《열하일기(熱河日記)》 〈도강록(渡江錄) 일야구도하기〉',
    actionGuidance: '위기의 순간일수록 바깥의 소음과 위험을 쳐다보지 마십시오. 내면의 공포를 먼저 잠재우면 거친 격류도 고요한 평지가 됩니다.',
  },
  {
    aphorismKey: 'beopgo_byeon',
    aphorismKo: '옛것을 본받되 변화를 통달하고, 새것을 짓되 근본이 있어야 한다.',
    aphorismHanja: '法古而知變, 創新而能典 (연암집 초정집서)',
    sourceContext: '《연암집(燕巖集)》 〈초정집서(楚亭集序)〉',
    actionGuidance: '기존의 성공 방정식에 안주하지도, 뿌리 없는 유행에 흔들리지도 마십시오. 탄탄한 본질 위에 독창적인 당신만의 혁신을 세우십시오.',
  },
  {
    aphorismKey: 'iyong_jeongdeok',
    aphorismKo: '이용(利用)이 있은 연후에야 후생(厚生)이 될 수 있고, 후생이 된 연후에야 정덕(正德)을 바르게 세울 수 있다.',
    aphorismHanja: '利用然後 厚生, 厚生然後 正德 (열하일기)',
    sourceContext: '《열하일기(熱河日記)》',
    actionGuidance: '도덕적 훈계나 공허한 구호에 앞서, 실질적인 살림과 실행 수단을 먼저 탄탄히 마련하십시오. 현실의 바탕이 튼튼해야 큰 뜻도 펼칠 수 있습니다.',
  },
  {
    aphorismKey: 'broken_tile_learning',
    aphorismKo: '깨진 기와 조각이라도 버리지 않고 담장을 쌓고, 부서진 벽돌이라도 모아 뜰을 정돈하니 참으로 배울 만하다.',
    aphorismHanja: '碎瓦頹塼, 莫非良材 (열하일기 일신수필)',
    sourceContext: '《열하일기(熱河日記)》 〈일신수필(馹迅隨筆)〉',
    actionGuidance: '하찮아 보이는 일상의 자원이나 실패의 경험이라도 소홀히 버리지 마십시오. 지혜로운 안목으로 그것을 재배치하면 최고의 보물이 됩니다.',
  },
  {
    aphorismKey: 'tiger_satire',
    aphorismKo: '호랑이가 꾸짖기를, "너희 유학자들은 입으로는 인의를 말하나 행동은 간사하여 참으로 가증스럽구나!"',
    aphorismHanja: '虎叱曰, 儒者, 僞也 (열하일기 관내정사 호질)',
    sourceContext: '《열하일기(熱河日記)》 〈호질(虎叱)〉',
    actionGuidance: '말만 앞세우고 행동이 따르지 않는 위선을 경계하십시오. 겉치레 칭찬에 현혹되지 말고 스스로에게 한 점 부끄러움 없는 진실한 실천을 행하십시오.',
  },
];

export function calculateYeonamParkJiwonYeolhaIlgi(
  profile: UserProfile
): YeonamParkJiwonYeolhaIlgiResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `YEONAM-PARK-JIWON-YEOLHA-ILGI:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const nightCrossingRiverSerenityScore = 75 + (absHash % 24);
  const beopgoChangsinCreativeWisdomScore = 74 + ((absHash >> 3) % 25);
  const 이용HusaengScore = 73 + ((absHash >> 6) % 26);
  const bukhakOpenMindedInsightScore = 72 + ((absHash >> 9) % 27);
  const haehakSatiricalGenerosityQuotient = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % YEONAM_THEMES.length;
  const aphorismIndex = (absHash >> 7) % YEONAM_APHORISMS.length;

  const activeYeonamTheme = YEONAM_THEMES[themeIndex];
  const focalYeonamAphorism = YEONAM_APHORISMS[aphorismIndex];

  const guidanceTitle = `연암 박지원 열하일기 실학 지혜: ${activeYeonamTheme.themeTitleKo}`;
  const philosophicalCounsel = `연암 박지원 선생의 실학 정신은 외물의 소음과 두려움을 비워내어 격류를 건너는 일야구도의 담대함과 낡은 틀을 깨고 혁신을 일구는 법고창신의 지혜를 선사합니다. ` +
    `현재 당신의 삶을 인도하는 핵심 원리는 '${activeYeonamTheme.themeTitleKo}'입니다. ` +
    `${activeYeonamTheme.practicalCounsel} 아울러 《열하일기》의 통쾌한 가르침 "${focalYeonamAphorism.aphorismKo}"(${focalYeonamAphorism.aphorismHanja})을 가슴 깊이 새기며, ` +
    `${focalYeonamAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_YEONAM_PARK_JIWON_VERSION,
    calculatedAtKst: new Date().toISOString(),
    nightCrossingRiverSerenityScore,
    beopgoChangsinCreativeWisdomScore,
    iyongHusaengPracticalCompetenceScore: 이용HusaengScore,
    bukhakOpenMindedInsightScore,
    haehakSatiricalGenerosityQuotient,
    activeYeonamTheme,
    focalYeonamAphorism,
    yeonamComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatYeonamParkJiwonYeolhaIlgiPrompt(res: YeonamParkJiwonYeolhaIlgiResult): string {
  return [
    `【연암 박지원 《열하일기》 일야구도 & 이용후생·법고창신 실학 지표】`,
    `- 일야구도 심령 평정심(一夜九渡): ${res.nightCrossingRiverSerenityScore}/100`,
    `- 법고창신 창조적 혁신도(法古創新): ${res.beopgoChangsinCreativeWisdomScore}/100`,
    `- 이용후생 실사구시 역량(利用厚生): ${res.iyongHusaengPracticalCompetenceScore}/100`,
    `- 북학개방 문물 수용 혜안(北學開放): ${res.bukhakOpenMindedInsightScore}/100`,
    `- 위선 타파 해학·풍자 여유도(諧謔破僞): ${res.haehakSatiricalGenerosityQuotient}/100`,
    `- 핵심 실학 테마: ${res.activeYeonamTheme.themeTitleKo} [${res.activeYeonamTheme.themeTitleHanja}]`,
    `- 실학적 통찰: ${res.activeYeonamTheme.silhakInsight}`,
    `- 실천적 조언: ${res.activeYeonamTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalYeonamAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalYeonamAphorism.aphorismHanja}" [${res.focalYeonamAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalYeonamAphorism.actionGuidance}`,
    `- 종합 실학사상 권면: ${res.yeonamComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
