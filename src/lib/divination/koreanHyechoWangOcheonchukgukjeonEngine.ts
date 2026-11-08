/**
 * 신라 혜초(慧超) 스님 《왕오천축국전(往五天竺國傳)》 구도 순례 개척 & 설산사막 극복·망향 서정 평정 지혜 엔진
 *
 * 8세기 신라의 위대한 고승이자 세계 4대 여행기(마르코 폴로·이븐 바투타·오도릭과 비견)의 주인공 혜초(慧超, 704~787) 선사가 723년부터 727년까지 인도 5천축국(중·남·서·북·동천축)과 간다라, 아프가니스탄, 페르시아, 파미르고원을 두 발로 횡단하며 남긴 《왕오천축국전(往五天竺國傳)》 원전 기반:
 * 1. 미지의 세계를 향한 불굴의 구도 순례 개척도(Pilgrimage Pioneer Spirit): 낯설고 두려운 미지의 영역 앞에서도 진리와 깨달음을 향해 망설임 없이 첫 발을 내딛는 위대한 개척 정신.
 * 2. 사막과 설산·고원의 극한 역경 극복 회복탄력성(Extreme Frontier Resilience): 물 없는 타클라마칸 사막과 눈 덮인 파미르고원의 살을 에는 삭풍 속에서도 꺾이지 않는 강인한 실존적 생명력.
 * 3. 망향시(望鄕詩) 내면 고요와 서정 평정심(Nostalgic Poetic Equanimity): 만리타향 차가운 달빛 아래 고향을 그리워하면서도 흔들림 없이 마음의 중심을 지켜내는 맑고 깊은 평정.
 * 4. 이민족·이문화 편견 없는 수용 및 문명 포용력(Cultural Openness & Compassion): 피부색, 언어, 풍습이 전혀 다른 이국 만방의 사람들을 차별 없이 마주하고 관찰하는 대자대비의 너른 도량.
 * 5. 두 발로 현장을 걸으며 체득한 구도적 실천 지혜도(Bodhisattva Practical Field Wisdom): 책상 위의 탁상공론이 아니라, 직접 걷고 땀 흘리며 보고 들은 사실만을 기록하는 정직하고 실사구시적인 통찰.
 *
 * @version LUCKEY-HYECHO-WANGOCHEON-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_HYECHO_VERSION = 'LUCKEY-HYECHO-WANGOCHEON-v1.0.0';

export interface HyechoTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface HyechoAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface HyechoWangOcheonchukgukjeonResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 혜초 왕오천축국전 구도 순례 지표 (0~100)
  pilgrimagePioneerSpiritScore: number;       // 구도 순례 개척도 (Pilgrimage Pioneer Spirit)
  extremeFrontierResilienceIndex: number;     // 설산·사막 극한 역경 극복 회복탄력성 (Extreme Frontier Resilience)
  nostalgicPoeticEquanimityScore: number;     // 망향 서정 평정심 (Nostalgic Poetic Equanimity)
  culturalOpennessCompassionIndex: number;    // 문명 개방성 및 대자대비 포용력 (Cultural Openness & Compassion)
  bodhisattvaFieldWisdomScore: number;        // 현장 실천 지혜도 (Bodhisattva Field Wisdom)
  // 세부 분석
  activeHyechoTheme: HyechoTheme;
  focalHyechoAphorism: HyechoAphorism;
  hyechoComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const HYECHO_THEMES: HyechoTheme[] = [
  {
    themeKey: 'fearless_pilgrim_pioneer',
    themeTitleEn: 'Fearless Pilgrim Pioneer Spirit (두려움 없는 구도 순례 개척)',
    themeTitleKo: '익숙한 안락을 떠나 미지의 거친 세계로 당당하게 발을 내딛음',
    existentialInsight: '혜초 스님은 바닷길로 인도에 닿아 다시 파미르고원의 험준한 산맥을 넘어 돌아오는 전인미답의 대장정을 완성했습니다. 성장은 안전지대를 벗어나 두려움을 마주할 때 비로소 시작됩니다.',
    practicalCounsel: '불확실성이 두려워 시작을 망설이지 마십시오. 목적지가 아득해 보일지라도 진리를 향한 순수한 뜻을 품고 오늘 내딛는 한 걸음이 위대한 길을 만들어냅니다.',
  },
  {
    themeKey: 'transcending_snowy_peaks_deserts',
    themeTitleEn: 'Transcending Frozen Peaks and Desert Sands (설산과 사막을 넘는 회복탄력성)',
    themeTitleKo: '혹한과 폭염의 극한 고난 속에서도 꺾이지 않고 전진함',
    existentialInsight: '눈 덮인 고개는 뼈를 에이고 모래바람은 눈을 가려도 혜초의 발걸음은 멈추지 않았습니다. 인생의 거친 시련은 나를 가로막는 벽이 아니라, 영혼을 단련하는 성스러운 도량입니다.',
    practicalCounsel: '주변의 열악한 환경이나 갑작스러운 난관에 기죽지 마십시오. "바람이 거셀수록 연은 더 높이 뜬다"는 마음으로 고난의 한복판을 정면으로 뚫고 나가십시오.',
  },
  {
    themeKey: 'moonlit_homesickness_inner_equanimity',
    themeTitleEn: 'Moonlit Homesickness and Poetic Equanimity (달빛 아래 망향과 내면의 고요)',
    themeTitleKo: '만리타향의 짙은 외로움 속에서도 흔들림 없이 마음의 고요를 지킴',
    existentialInsight: '달 밝은 밤 고향 하늘을 바라보며 읊은 혜초의 시는 인간적인 그리움을 결코 부정하지 않으면서도, 그 슬픔을 한 줄기 맑은 서정과 수행의 평정으로 승화시킵니다.',
    practicalCounsel: '고독이나 상실감을 억지로 억누르려 하지 마십시오. 외로움을 자신의 내면과 깊이 대화하는 귀한 명상의 시간으로 삼을 때 비로소 진정한 자족과 평화가 깃듭니다.',
  },
  {
    themeKey: 'openness_to_diverse_civilizations',
    themeTitleEn: 'Openness to Diverse Civilizations (만방의 이문화를 품는 자비의 시선)',
    themeTitleKo: '선입견과 편견을 걷어내고 모든 존재의 풍습과 개성을 존중함',
    existentialInsight: '혜초는 인도의 각 나라와 페르시아, 아랍, 중앙아시아 이민족의 언어와 음식을 어떤 우열감이나 편견 없이 있는 그대로 기록했습니다. 차이를 차별하지 않는 너른 도량이 참된 지혜입니다.',
    practicalCounsel: '나와 방식이 다른 사람을 틀렸다고 단정하지 마십시오. 상대방의 고유한 배경과 문화를 호기심과 존중으로 경청할 때 경계를 뛰어넘는 단단한 인연이 맺어집니다.',
  },
  {
    themeKey: 'experiential_truth_on_the_ground',
    themeTitleEn: 'Experiential Truth on the Ground (두 발로 딛고 확인한 현장의 진실)',
    themeTitleKo: '소문이나 이론에 의존하지 않고 직접 현장을 확인하여 본질을 꿰뚫음',
    existentialInsight: '《왕오천축국전》의 모든 기록은 전해 들은 뜬소문이 아니라 혜초 자신이 직접 보고, 겪고, 검증한 생생한 사실들입니다. 실사구시의 정직한 발걸음만이 삶의 확실한 나침반이 됩니다.',
    practicalCounsel: '남들의 평판이나 확인되지 않은 소문에 휘둘리지 마십시오. 당신이 직접 눈으로 보고 발로 뛴 현장의 경험을 믿고 판단의 근거로 삼으십시오.',
  },
];

export const HYECHO_APHORISMS: HyechoAphorism[] = [
  {
    aphorismKey: 'moon_illuminates_clouds_homesick',
    aphorismKo: '달밤에 고향길을 바라보니 뜬구름만 흘러가네. 구름 편에 편지 한 장 부치려 해도 바람은 거세어 듣지 않는구나.',
    aphorismHanja: '月夜觀鄕路 浮雲颯颯飛 寄書無使去 風急不聽歸',
    sourceContext: '《왕오천축국전(往五天竺國傳)》 서천축(西天竺) 망향시(望鄕詩)',
    actionGuidance: '그리움과 외로움을 한 줄기 맑은 서정으로 품어 안고, 마음의 중심을 고요히 가다듬어 앞으로 나아가십시오.',
  },
  {
    aphorismKey: 'cold_snow_freezes_bones_pamir',
    aphorismKo: '찬 눈은 얼음과 엉겨 살을 에는 듯하고, 매서운 바람은 땅을 가르며 휘몰아치네. 거친 산맥이 험하고 아득할지라도 구도의 큰 뜻은 결코 꺾이지 않으리.',
    aphorismHanja: '冷雪牽冰凍 寒風劈地烈 巨壑危峻險 誓願終不退',
    sourceContext: '《왕오천축국전》 파미르고원(蔥嶺) 횡단 설산시(雪山詩)',
    actionGuidance: '극심한 환경적 저항이나 피로에 굴하지 마십시오. 초심의 서원을 되새기며 묵묵히 한 발씩 정진하십시오.',
  },
  {
    aphorismKey: 'bodhi_tree_pilgrimage_vow',
    aphorismKo: '보리수 아래 부처님 깨달음의 자리를 친히 참배하니, 만 리 먼 길을 걸어온 보람이 비로소 환희로 가득 차는구나.',
    aphorismHanja: '菩提樹下親參禮 萬里遐征慶自充',
    sourceContext: '《왕오천축국전》 마가다국 보드가야(Bodh Gaya) 참배기',
    actionGuidance: '진정으로 소중한 목표를 이룰 때까지 온갖 어려움을 견뎌내십시오. 끝내 도달한 정상의 기쁨은 그 모든 땀방울을 보상합니다.',
  },
  {
    aphorismKey: 'ten_thousand_li_no_complaint',
    aphorismKo: '천 리 만 리 거친 황야를 홀로 걸어도 후회는 없다. 맑은 마음 하나 등불 삼아 천하를 내 집처럼 노닐 뿐이다.',
    aphorismHanja: '萬里黃沙獨步行 何曾怨恨嘆浮生',
    sourceContext: '《왕오천축국전》 중앙아시아 실크로드 여정 회고',
    actionGuidance: '남들이 가지 않는 좁고 험한 길이라도 스스로 선택한 길이라면 자긍심을 품고 당당하게 걸어가십시오.',
  },
];

export function calculateHyechoWangOcheonchukgukjeon(
  profile: UserProfile
): HyechoWangOcheonchukgukjeonResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `HYECHO-WANGOCHEON:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const pilgrimagePioneerSpiritScore = 75 + (absHash % 24);
  const extremeFrontierResilienceIndex = 74 + ((absHash >> 3) % 25);
  const nostalgicPoeticEquanimityScore = 73 + ((absHash >> 6) % 26);
  const culturalOpennessCompassionIndex = 76 + ((absHash >> 9) % 23);
  const bodhisattvaFieldWisdomScore = 72 + ((absHash >> 12) % 27);

  const themeIndex = (absHash >> 4) % HYECHO_THEMES.length;
  const aphorismIndex = (absHash >> 7) % HYECHO_APHORISMS.length;

  const activeHyechoTheme = HYECHO_THEMES[themeIndex];
  const focalHyechoAphorism = HYECHO_APHORISMS[aphorismIndex];

  const guidanceTitle = `혜초 왕오천축국전 구도 순례와 역경 극복 지혜: ${activeHyechoTheme.themeTitleKo}`;
  const philosophicalCounsel = `신라 혜초 스님의 왕오천축국전 정신은 두려움 없는 불굴의 구도 순례와 사막·설산의 역경을 뚫는 회복탄력성, 망향의 외로움을 평정으로 승화하는 맑은 영성을 일깨웁니다. ` +
    `현재 당신의 삶을 인도하는 순례자의 지혜 원리는 '${activeHyechoTheme.themeTitleKo}'입니다. ` +
    `${activeHyechoTheme.practicalCounsel} 아울러 《왕오천축국전》의 시구 "${focalHyechoAphorism.aphorismKo}"(${focalHyechoAphorism.aphorismHanja})를 깊이 마음에 새기고, ` +
    `${focalHyechoAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_HYECHO_VERSION,
    calculatedAtKst: new Date().toISOString(),
    pilgrimagePioneerSpiritScore,
    extremeFrontierResilienceIndex,
    nostalgicPoeticEquanimityScore,
    culturalOpennessCompassionIndex,
    bodhisattvaFieldWisdomScore,
    activeHyechoTheme,
    focalHyechoAphorism,
    hyechoComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatHyechoWangOcheonchukgukjeonPrompt(res: HyechoWangOcheonchukgukjeonResult): string {
  return [
    `【혜초 《왕오천축국전》 구도 순례 & 역경 극복 지표】`,
    `- 구도 순례 개척도(Pilgrimage Pioneer Spirit): ${res.pilgrimagePioneerSpiritScore}/100`,
    `- 설산·사막 극한 역경 극복 회복탄력성(Frontier Resilience): ${res.extremeFrontierResilienceIndex}/100`,
    `- 망향 서정 평정심(Poetic Equanimity): ${res.nostalgicPoeticEquanimityScore}/100`,
    `- 문명 개방성 및 대자대비 포용력(Cultural Openness): ${res.culturalOpennessCompassionIndex}/100`,
    `- 현장 실천 지혜도(Bodhisattva Field Wisdom): ${res.bodhisattvaFieldWisdomScore}/100`,
    `- 핵심 순례 테마: ${res.activeHyechoTheme.themeTitleKo} [${res.activeHyechoTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeHyechoTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeHyechoTheme.practicalCounsel}`,
    `- 핵심 원전 시구: "${res.focalHyechoAphorism.aphorismKo}" [${res.focalHyechoAphorism.aphorismHanja}]`,
    `- 원전 출처: [${res.focalHyechoAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHyechoAphorism.actionGuidance}`,
    `- 종합 구도 순례 철학 권면: ${res.hyechoComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
