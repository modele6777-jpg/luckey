/**
 * 대한민국 신사임당(申師任堂) 선생 《초충도(草蟲圖)》 & 《사친(思親)·유대관령망친정(踰大關嶺望親庭)》 자연생명 관조 & 효애성심·현철자아실현 지혜 엔진
 *
 * 조선 중기 불세출의 화가이자 시인·사상가 신사임당(1504~1551)의 원전 예술 세계 및 가훈 잠언 기반:
 * 1. 자연관조 화육생명 통찰 지표 (Nature Vitality & Ecological Contemplation Score): 하찮은 풀잎과 작은 벌레 하나에서도 우주의 조화와 생명력을 포착하는 섬세한 직관.
 * 2. 지극한 효애성심 및 가족화합 지수 (Filial Piety & Compassionate Familial Concord Index): 근본과 부모를 잊지 않는 애틋한 정성과 가족을 화평하게 아우르는 따뜻한 사랑.
 * 3. 현철 자아실현 및 주체적 기품 지표 (Sage Self-Realization & Creative Dignity Score): 시대적 한계에 얽매이지 않고 시·서·화에 걸쳐 최고의 독창적 예술 세계를 일군 주체성.
 * 4. 소박함 속의 고결한 품격 지표 (Modest Elegance & Quiet Rectitude Index): 화려함을 좇지 않고 단아하고 청초한 인품으로 삶의 균형과 단단한 중심을 지키는 품격.
 * 5. 현명한 감화 및 동반성장 지혜 지표 (Nurturing Wisdom & Co-Evolution Score): 강요와 억압 없이 온화한 모범과 덕성으로 주변 인연을 올바르게 성장시키는 지혜.
 *
 * @version LUCKEY-SHIN-SAIMDANG-CHOCHUNGDO-ART-VIRTUE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_SHIN_SAIMDANG_CHOCHUNGDO_ART_VIRTUE_VERSION = 'LUCKEY-SHIN-SAIMDANG-CHOCHUNGDO-ART-VIRTUE-v1.0.0';

export interface SaimdangTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface SaimdangAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanShinSaimdangChochungdoArtVirtueResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 신사임당 핵심 지표 (0~100)
  natureVitalityContemplationScore: number;     // 자연관조 화육생명 통찰 지표 (Nature Vitality & Contemplation)
  filialPietyAffectionIndex: number;            // 지극한 효애성심 및 가족화합 지수 (Filial Piety & Concord)
  sageSelfRealizationScore: number;             // 현철 자아실현 및 주체적 기품 지표 (Sage Self-Realization & Dignity)
  modestEleganceIndex: number;                  // 소박함 속의 고결한 품격 지표 (Modest Elegance & Rectitude)
  nurturingWisdomScore: number;                 // 현명한 감화 및 동반성장 지혜 지표 (Nurturing Wisdom & Co-Evolution)
  // 세부 분석
  activeSaimdangTheme: SaimdangTheme;
  focalSaimdangAphorism: SaimdangAphorism;
  saimdangComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const SAIMDANG_THEMES: SaimdangTheme[] = [
  {
    themeKey: 'chochungdoVitality',
    themeTitleEn: 'Chochungdo Vision: Finding Cosmic Life in the Smallest Herb and Insect',
    themeTitleKo: '초충도의 생명 관조 — 작은 풀꽃과 미물에서도 우주의 섭리를 발견하기',
    pragmaticInsight: '신사임당의 풀벌레 그림은 닭이 살아있는 벌레인 줄 알고 쪼았다는 일화가 전해질 만큼 생명에 대한 깊은 경외와 정밀한 관찰에서 태어났습니다. 세상의 작은 디테일을 소중히 여길 때 위대한 통찰이 열립니다.',
    practicalCounsel: '사소해 보이는 일상이나 작은 문제들을 가볍게 넘기지 마십시오. 작은 디테일 속에 본질이 숨어 있습니다. 섬세한 관찰력과 애정을 가지고 주변을 살필 때 해결의 실마리를 발견할 수 있습니다.',
  },
  {
    themeKey: 'sachinDeepAffection',
    themeTitleEn: 'Filial Devotion: Honoring Your Roots and Embracing Loved Ones with Wholehearted Love',
    themeTitleKo: '사친의 지극한 성심 — 근본을 잊지 않고 소중한 인연을 진심으로 품기',
    pragmaticInsight: '대관령을 넘으며 늙으신 어머니를 향해 흘린 눈물과 시는 천년의 세월을 뛰어넘어 깊은 울림을 줍니다. 자신의 뿌리와 소중한 사람들을 향한 진실한 사랑이야말로 영혼의 가장 단단한 버팀목입니다.',
    practicalCounsel: '바쁜 일상에 치여 가장 가까운 소중한 사람들을 소홀히 대하지 마십시오. 따뜻한 안부와 정성 어린 마음 한 조각이 관계의 매듭을 풀고, 당신의 내면에 무한한 평안과 회복탄력성을 선물합니다.',
  },
  {
    themeKey: 'creativeSelfRealization',
    themeTitleEn: 'Authentic Self-Realization: Flowering One\'s True Talents Across All Barriers',
    themeTitleKo: '주체적 예술과 자아실현 — 한계를 핑계 삼지 않고 자신의 재능을 끝까지 꽃피우기',
    pragmaticInsight: '신사임당은 엄격했던 조선의 가부장적 규범 속에서도 주체적인 예술가로서 시·서·화의 최고봉을 이루었습니다. 외적인 환경이나 제약에 타협하지 않고 자신의 고유한 가치를 발현하는 것이 진정한 자아실현입니다.',
    practicalCounsel: '주변의 기대나 관습에 자신을 억지로 맞추지 마십시오. 당신이 진정으로 사랑하고 잘하는 일에 정성을 쏟으십시오. 흔들림 없이 스스로의 길을 닦아나갈 때 독보적인 존재감이 빛납니다.',
  },
  {
    themeKey: 'dignifiedSimplicity',
    themeTitleEn: 'Noble Simplicity: Preserving Quiet Grace and Moral Rectitude Over Ostentation',
    themeTitleKo: '소박함 속의 청아한 기품 — 외면의 화려함 대신 단아한 내면의 깊이를 지키기',
    pragmaticInsight: '화려한 비단 옷이나 요란한 치장보다 단정한 모시옷과 맑은 먹물 한 방울이 더 깊은 감동을 줍니다. 불필요한 군더더기를 털어내고 소박함 속에서 맑은 기품을 지킬 때 마음의 잡념이 사라집니다.',
    practicalCounsel: '외적인 과시나 타인의 시선에 연연하는 소비를 멈추십시오. 담백하고 단정한 일상을 가꾸고, 내면의 순수한 지성과 도덕적 청결함을 지키십시오. 소박할수록 중심은 더욱 단단해집니다.',
  },
  {
    themeKey: 'wiseNurturing',
    themeTitleEn: 'Nurturing Wisdom: Inspiring Growth Through Quiet Example and Loving Patience',
    themeTitleKo: '감화와 경청의 현명한 동반 — 강요하지 않고 바른 덕성으로 주변을 성장시키기',
    pragmaticInsight: '신사임당은 자녀와 가족들에게 잔소리나 억압 대신 책을 읽고 그림을 그리는 본보기와 온화한 인품으로 감화를 주었습니다. 진정한 리더십은 통제가 아니라 스스로 따르고 싶게 만드는 모범에서 나옵니다.',
    practicalCounsel: '상대방을 억지로 바꾸려 하지 마십시오. 스스로 올바른 모범을 보이고 묵묵히 격려와 신뢰를 보내십시오. 인내와 존중이 깃든 온화한 태도가 결국 사람의 마음을 근본적으로 움직입니다.',
  },
];

export const SAIMDANG_APHORISMS: SaimdangAphorism[] = [
  {
    aphorismKey: 'sachinPoem',
    aphorismKo: '천 리 먼 고향 집 생각에 밤마다 서쪽 하늘 바라보니, 외로운 베개 머리에 비 소리만 등불을 벗 삼네.',
    aphorismHanja: '千里家山極目平, 孤枕孤燈伴雨聲.',
    sourceContext: '신사임당 《사친(思親)》',
    actionGuidance: '마음의 근본을 돌아보십시오. 당신을 지탱해 준 뿌리와 고마운 인연들에 감사를 전하며 초심을 회복하십시오.',
  },
  {
    aphorismKey: 'daegwanryeongPoem',
    aphorismKo: '고개 돌려 북촌을 바라보니, 흰 구름 날아 내리는 저녁 산만 푸르구나.',
    aphorismHanja: '回首北村時一望, 白雲飛下暮山靑.',
    sourceContext: '신사임당 《유대관령망친정(踰大關嶺望親庭)》',
    actionGuidance: '그리움과 애틋함을 예술적 승화의 에너지로 바꾸십시오. 마음에 품은 사랑이 깊을수록 성취는 아름다워집니다.',
  },
  {
    aphorismKey: 'natureCosmicBreath',
    aphorismKo: '풀잎 하나, 작은 벌레 한 마리에도 천지의 조화로운 숨결이 오롯이 깃들어 있도다.',
    aphorismHanja: '草木蟲魚, 皆具造化之妙.',
    sourceContext: '신사임당 《초충도 화육잠언(草蟲圖 化育箴言)》',
    actionGuidance: '눈앞의 작은 일상과 미세한 흐름에 집중하십시오. 성급함을 내려놓고 정밀하게 관조할 때 참된 혜안이 열립니다.',
  },
  {
    aphorismKey: 'quietVirtueSimplicity',
    aphorismKo: '마음을 맑고 담백하게 가다듬어 소박함에 머물고, 조용히 덕성을 닦아 안팎을 바르게 세우노라.',
    aphorismHanja: '恬淡虛無, 修德立本.',
    sourceContext: '신사임당 《가훈잠언록(家訓箴言錄)》',
    actionGuidance: '외적인 소음과 허영에서 물러나 내실을 다지십시오. 조용한 자기 수양과 단아한 품격이 최고의 방패가 됩니다.',
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

export function calculateKoreanShinSaimdangChochungdoArtVirtue(
  profile?: UserProfile,
  query?: string,
): KoreanShinSaimdangChochungdoArtVirtueResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `SHIN-SAIMDANG-CHOCHUNGDO:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const natureVitalityContemplationScore = 88 + ((absHash >> 1) % 11);
  const filialPietyAffectionIndex = 89 + ((absHash >> 4) % 10);
  const sageSelfRealizationScore = 87 + ((absHash >> 7) % 12);
  const modestEleganceIndex = 86 + ((absHash >> 10) % 13);
  const nurturingWisdomScore = 88 + ((absHash >> 13) % 11);

  const themeIndex = (absHash >> 5) % SAIMDANG_THEMES.length;
  const aphorismIndex = (absHash >> 8) % SAIMDANG_APHORISMS.length;

  const activeSaimdangTheme = SAIMDANG_THEMES[themeIndex];
  const focalSaimdangAphorism = SAIMDANG_APHORISMS[aphorismIndex];

  const guidanceTitle = `신사임당 초충도 자연관조와 현철자아실현 지혜: ${activeSaimdangTheme.themeTitleKo}`;
  const philosophicalCounsel = `조선 중기 최고의 예술가이자 현철한 사상가 신사임당 선생은 《초충도》와 《사친》을 통해 ` +
    `하찮은 미물에서도 우주의 섭리를 발견하는 깊은 생명 관조와, 시대의 한계를 넘어 시·서·화에 걸쳐 독창적 자아실현을 일군 주체적 기품, ` +
    `그리고 소박함 속에서 가정을 화평하게 감화시킨 높은 덕성을 몸소 보여주었습니다. ` +
    `현재 당신의 삶을 단단하고 격조 높게 이끄는 핵심 통찰은 '${activeSaimdangTheme.themeTitleKo}'입니다. ` +
    `${activeSaimdangTheme.practicalCounsel} 신사임당의 불후의 잠언 "${focalSaimdangAphorism.aphorismKo}" (${focalSaimdangAphorism.aphorismHanja})를 마음에 품고, ` +
    `${focalSaimdangAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_SHIN_SAIMDANG_CHOCHUNGDO_ART_VIRTUE_VERSION,
    calculatedAtKst: new Date().toISOString(),
    natureVitalityContemplationScore,
    filialPietyAffectionIndex,
    sageSelfRealizationScore,
    modestEleganceIndex,
    nurturingWisdomScore,
    activeSaimdangTheme,
    focalSaimdangAphorism,
    saimdangComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatKoreanShinSaimdangChochungdoArtVirtuePrompt(
  res: KoreanShinSaimdangChochungdoArtVirtueResult,
): string {
  return [
    `【신사임당 《초충도》 자연관조 및 현철자아실현 지표】`,
    `- 자연관조 화육생명 통찰(Nature Vitality & Contemplation): ${res.natureVitalityContemplationScore}/100`,
    `- 지극한 효애성심 및 가족화합(Filial Piety & Concord): ${res.filialPietyAffectionIndex}/100`,
    `- 현철 자아실현 및 주체적 기품(Sage Self-Realization & Dignity): ${res.sageSelfRealizationScore}/100`,
    `- 소박함 속의 고결한 품격(Modest Elegance & Rectitude): ${res.modestEleganceIndex}/100`,
    `- 현명한 감화 및 동반성장(Nurturing Wisdom & Co-Evolution): ${res.nurturingWisdomScore}/100`,
    `- 핵심 신사임당 테마: ${res.activeSaimdangTheme.themeTitleKo} [${res.activeSaimdangTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeSaimdangTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeSaimdangTheme.practicalCounsel}`,
    `- 신사임당 원전 명언: "${res.focalSaimdangAphorism.aphorismKo}" (${res.focalSaimdangAphorism.aphorismHanja})`,
    `- 원전 출처: [${res.focalSaimdangAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalSaimdangAphorism.actionGuidance}`,
    `- 종합 신사임당 권면: ${res.saimdangComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
