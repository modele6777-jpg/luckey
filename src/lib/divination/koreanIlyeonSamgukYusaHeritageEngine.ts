/**
 * 대한민국 보각국사 일연(普覺國師 一然) 선사 《삼국유사(三國遺事)》 홍익인간 자주 자긍심·향가 서정 치유·처용 관용과 문화 회복탄력성 지혜 엔진
 *
 * 고려 후기 대선사이자 민족의 영적 보고 《삼국유사》(1281)의 저자 보각국사 일연(1206~1289)의 원전 기반:
 * 1. 홍익인간 개천의 자주적 자긍심 (Hongik Ingan Heavenly Founding Pride Score): 단군 조선의 뿌리에서 길어 올리는 민족의 자주성과 널리 세상을 이롭게 하는 보편적 이상.
 * 2. 향가(鄕歌)의 지순한 서정과 영혼의 치유력 (Hyangga Pure Poetic Devotion & Spiritual Healing Index): 《제망매가》, 《찬기파랑가》처럼 삶과 죽음의 슬픔을 노래로 승화하는 서정적 치유.
 * 3. 처용의 관용과 역신을 감복시키는 대도량 (Cheoyong Magnanimous Tolerance & Forgiving Grace Score): 분노와 응징 대신 춤과 노래, 너른 품으로 악의를 녹여내는 위대한 관용.
 * 4. 난세를 이겨내는 민중 자비와 기적의 각성 (Grassroots Compassion & Miracle Awakening Index): 소외된 민중과 승려들의 소박한 자비행과 기적을 귀하게 기록한 따스한 휴머니즘.
 * 5. 몽골 전란 속에서도 민족의 영혼을 지켜낸 문화적 회복탄력성 (Ilyeon Cultural Preservation & Resilient Memory Score): 전란의 잿더미 속에서도 역사와 설화를 집대성하여 민족의 얼을 건넨 불굴의 회복탄력성.
 *
 * @version LUCKEY-KOREAN-ILYEON-SAMGUK-YUSA-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_ILYEON_SAMGUK_YUSA_VERSION = 'LUCKEY-KOREAN-ILYEON-SAMGUK-YUSA-v2.2.0';

export interface IlyeonTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface IlyeonAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KoreanIlyeonSamgukYusaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 일연 삼국유사 핵심 지표 (0~100)
  hongikInganPrideScore: number;                        // 홍익인간 자주 자긍심 (Hongik Ingan Founding Pride)
  hyanggaHealingIndex: number;                          // 향가 서정과 영혼 치유력 (Hyangga Poetic Healing)
  cheoyongToleranceScore: number;                       // 처용의 관용과 대도량 (Cheoyong Magnanimous Tolerance)
  grassrootsCompassionIndex: number;                    // 민중 자비와 기적의 각성 (Grassroots Compassion Awakening)
  culturalPreservationResilience: number;               // 문화적 회복탄력성 (Cultural Preservation Resilience)
  // 세부 분석
  activeIlyeonTheme: IlyeonTheme;
  focalIlyeonAphorism: IlyeonAphorism;
  secondaryIlyeonAphorism: IlyeonAphorism;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ilyeonComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  ilyeonSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
}

function formatIlyeonKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeIlyeonStage(score: number): string {
  if (score >= 96) return '홍익화해(弘益和解) — 처용의 관용과 홍익인간의 기개가 하나로 녹아든 원융기';
  if (score >= 93) return '향가승화(鄕歌昇華) — 삶의 슬픔을 맑은 노래와 자비로 승화시키는 치유기';
  return '개천자긍(開天自矜) — 흔들리지 않는 뿌리와 문화적 기억을 단단히 세우는 수호기';
}

export const ILYEON_THEMES: IlyeonTheme[] = [
  {
    themeKey: 'hongikInganOrigin',
    themeTitleEn: 'Heavenly Heritage of Hongik Ingan: Unwavering Identity and Universal Benevolence',
    themeTitleKo: '홍익인간의 개천 정신 — 몽골 침략의 난세 속에서도 천손(天孫)의 자주적 자긍심 드높이기',
    literaryInsight: '일연 선사는 《삼국유사》 기이(紀異) 편 첫머리에 단군 신화를 수록하여, 우리 민족이 중국에 종속되지 않은 하늘의 자손이자 널리 인간을 이롭게 하는(弘益人間) 숭고한 보편성을 지녔음을 천명했습니다.',
    practicalCounsel: '외부의 평가나 시련에 기죽지 마십시오. 당신의 내면 깊은 곳에 깃든 고유한 존엄성과 선한 영향력의 뿌리를 당당히 긍정하고 주체적으로 우뚝 서십시오.',
  },
  {
    themeKey: 'hyanggaPoeticSalvation',
    themeTitleEn: 'Hyangga Poetic Grace: Transmuting Grief, Separation, and Loss into Sacred Song',
    themeTitleKo: '향가의 서정적 구원 — 삶과 죽음, 이별과 슬픔을 맑은 노래로 승화하여 마음 치유하기',
    literaryInsight: '월명사의 《제망매가》처럼 "생사의 길은 예 있으매 머뭇거리고" 슬퍼하면서도, 미타찰에서 다시 만날 도의 길을 닦는 향가의 정신은 인간의 유한한 슬픔을 가장 아름답고 고결한 영적 화해로 이끕니다.',
    practicalCounsel: '상실과 이별의 아픔에 무너지지 마십시오. 당신의 눈물과 상처를 진솔한 예술과 따스한 언어로 승화할 때, 슬픔은 도리어 영혼을 맑게 씻어주는 지혜의 샘물이 됩니다.',
  },
  {
    themeKey: 'cheoyongMagnanimousSong',
    themeTitleEn: 'Cheoyong\'s Transcendent Tolerance: Conquering Malice and Strife with Song, Dance, and Magnanimity',
    themeTitleKo: '처용의 관용과 화해 — 분노와 보복의 칼날을 거두고 너른 품과 유쾌한 노래로 악의 녹여내기',
    literaryInsight: '아내를 범한 역신을 보고도 칼을 뽑지 않고 달 밝은 밤 춤추며 노래한 처용의 대도량 앞에 역신은 무릎을 꿇고 감복했습니다. 폭력에 폭력으로 맞서지 않고 덕과 품격으로 상대를 감화시키는 최고의 경지입니다.',
    practicalCounsel: '억울함이나 분노가 치밀 때 성급하게 맞받아치지 마십시오. 한 걸음 물러서서 보여주는 대인배의 너그러움과 기품이 적조차 스스로 부끄러워하게 만드는 가장 강력한 승리를 가져옵니다.',
  },
  {
    themeKey: 'enduringCulturalMemory',
    themeTitleEn: 'Living Memory Resilient to Ashes: Preserving Soul and Wisdom Through Dark Storms',
    themeTitleKo: '기억과 기록의 불멸성 — 폐허 속에서도 꺼지지 않는 문화의 등불을 후대에 전하기',
    literaryInsight: '팔만대장경 판각과 《삼국유사》 집필은 몽골군의 말발굽 아래 국토가 유린당하던 칠흑 같은 암흑기에 이루어졌습니다. 영토는 빼앗길지언정 얼과 기억은 결코 빼앗길 수 없다는 문화적 불멸성의 증거입니다.',
    practicalCounsel: '오늘 겪는 고난이 당신의 모든 것을 앗아갈 수 없습니다. 당신이 소중히 가꿔온 지식과 경험, 선한 뜻을 기록하고 보존하십시오. 꺼지지 않는 내면의 유산이 당신을 다시 일으켜 세웁니다.',
  },
];

export const ILYEON_APHORISMS: IlyeonAphorism[] = [
  {
    aphorismKey: 'cheoyongToleranceQuote',
    aphorismKo: '본래 내 아내였지만 빼앗긴 것을 어찌하리오. 노래하고 춤추며 물러서니, 역신이 감복하여 다시는 그 문을 넘지 않겠노라 맹세하였다.',
    aphorismHanja: '本吾下多隱尼賜, 奪叱良乙何如爲理古. 歌舞退步, 疫神感伏.',
    sourceContext: '《삼국유사(三國遺事)》 권2 기이(紀異) 〈처용랑 망해사(處容郞 望海寺)〉',
    actionGuidance: '원한과 분노의 악순환을 당신의 너그러운 도량으로 끊어내십시오. 진정한 품격은 갈등을 녹여내는 관용에서 나옵니다.',
  },
  {
    aphorismKey: 'hongikFoundingQuote',
    aphorismKo: '하늘의 뜻이 열리어 널리 인간을 이롭게 하고, 이치로써 세상을 교화하여 밝고 바른 길로 이끌도다.',
    aphorismHanja: '弘益人間, 理化世界, 開天立極.',
    sourceContext: '《삼국유사》 권1 기이 〈고조선(古朝鮮)〉 조',
    actionGuidance: '사리사욕을 넘어 세상과 이웃에게 이로움을 주는 넓은 비전을 품으십시오. 이타적인 뜻이 당신의 길을 가장 크게 넓혀줍니다.',
  },
  {
    aphorismKey: 'jemangmaegaHopeQuote',
    aphorismKo: '한 가지에 나고도 가는 곳을 모르누나. 아아, 미타찰에서 만날 나, 도 닦아 기다리겠노라.',
    aphorismHanja: '同枝良生衣行隱等, 去內良隱所母好童. 阿耶, 彌陀刹良會罷吾, 道修良待是覆如.',
    sourceContext: '《삼국유사》 권5 감통(感通) 〈월명사 제망매가(月明師 祭亡妹歌)〉',
    actionGuidance: '이별과 상실의 아픔을 원망 대신 내면의 도를 닦고 성숙해지는 디딤돌로 승화하십시오.',
  },
  {
    aphorismKey: 'historicalLegacyQuote',
    aphorismKo: '성인(聖人)이 신기한 일로써 나라를 연 것은 기이한 일이 아니요, 후세에 영원한 귀감이 되게 함이라.',
    aphorismHanja: '聖人以神道設敎, 豈無異乎, 垂法後世.',
    sourceContext: '《삼국유사》 권1 기이 서문',
    actionGuidance: '당신이 겪는 모든 독특한 여정과 역경을 헛되이 버리지 말고, 훗날 누군가에게 빛이 될 귀중한 지혜의 자산으로 엮어내십시오.',
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

export function calculateKoreanIlyeonSamgukYusa(
  profile?: UserProfile,
  query?: string,
  now: Date = new Date(),
): KoreanIlyeonSamgukYusaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `ILYEON-SAMGUK-YUSA:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const hongikInganPrideScore = 91 + ((absHash >> 1) % 9);
  const hyanggaHealingIndex = 90 + ((absHash >> 4) % 10);
  const cheoyongToleranceScore = 92 + ((absHash >> 7) % 8);
  const grassrootsCompassionIndex = 89 + ((absHash >> 10) % 10);
  const culturalPreservationResilience = 90 + ((absHash >> 13) % 9);

  const themeIndex = (absHash >> 5) % ILYEON_THEMES.length;
  const aphorismIndex = (absHash >> 8) % ILYEON_APHORISMS.length;
  const secondaryAphorismIndex = (aphorismIndex + 1 + ((absHash >> 11) % (ILYEON_APHORISMS.length - 1))) % ILYEON_APHORISMS.length;

  const activeIlyeonTheme = ILYEON_THEMES[themeIndex];
  const focalIlyeonAphorism = ILYEON_APHORISMS[aphorismIndex];
  const secondaryIlyeonAphorism = ILYEON_APHORISMS[secondaryAphorismIndex];
  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `'${trimmedQuery}' 속의 상처나 갈등을 응징이 아니라 향가의 서정과 처용의 너른 관용으로 감싸 안는다면 어떤 새로운 화해가 열릴까요?`
    : `삶의 무너진 자리에서도 끝내 잃지 않고 후대에 건네고 싶은 나만의 소중한 기억과 얼은 무엇인가요?`;
  const interpretiveBoundary = '보각국사 일연 삼국유사 관점은 길흉 예단이 아니라, 서정적 치유와 관용·문화적 회복탄력성을 비추는 영성 성찰 렌즈입니다.';

  const guidanceTitle = `보각국사 일연 삼국유사의 자주 자긍심과 서정 관용: ${activeIlyeonTheme.themeTitleKo}`;
  const philosophicalCounsel = `고려 후기 민족의 영적 보고 《삼국유사》를 편찬한 보각국사 일연 선사는 ` +
    `몽골 침략의 국난 속에서도 단군 개천의 홍익인간 자주 자긍심, 슬픔과 죽음을 서정적 노래로 승화한 향가의 치유력, ` +
    `분노를 너른 품으로 녹여내는 처용의 위대한 관용, 그리고 폐허 속에서도 민족의 얼과 기억을 지켜낸 불굴의 문화적 회복탄력성을 남겼습니다. ` +
    `지금 당신의 마음에 깃들어야 할 맑은 지혜는 '${activeIlyeonTheme.themeTitleKo}'입니다. ` +
    `${activeIlyeonTheme.practicalCounsel} 일연 선사의 원전 가르침 "${focalIlyeonAphorism.aphorismKo}" (${focalIlyeonAphorism.aphorismHanja})을 가슴에 새기고, ` +
    `${focalIlyeonAphorism.actionGuidance}`;

  const calculatedAtKst = formatIlyeonKstTimestamp(now);
  const avgScore = Math.round(
    (hongikInganPrideScore +
      hyanggaHealingIndex +
      cheoyongToleranceScore +
      grassrootsCompassionIndex +
      culturalPreservationResilience) /
      5,
  );
  const ilyeonSynthesisMatrix = {
    dominantTension: `${activeIlyeonTheme.themeTitleKo} ↔ ${focalIlyeonAphorism.sourceContext}`,
    alignmentState: describeIlyeonStage(avgScore),
    integratedAction: `${focalIlyeonAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  const ritualAction = `[${activeIlyeonTheme.themeTitleKo}] ${focalIlyeonAphorism.actionGuidance}`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: KOREAN_ILYEON_SAMGUK_YUSA_VERSION,
    calculatedAtKst,
    hongikInganPrideScore,
    hyanggaHealingIndex,
    cheoyongToleranceScore,
    grassrootsCompassionIndex,
    culturalPreservationResilience,
    activeIlyeonTheme,
    focalIlyeonAphorism,
    secondaryIlyeonAphorism,
    reflectiveQuestion,
    interpretiveBoundary,
    ilyeonComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    ilyeonSynthesisMatrix,
    ritualAction,
    reflectionFocus,
  };
}

export function formatKoreanIlyeonSamgukYusaPrompt(
  res: KoreanIlyeonSamgukYusaResult,
): string {
  const avgScore = Math.round(
    (res.hongikInganPrideScore +
      res.hyanggaHealingIndex +
      res.cheoyongToleranceScore +
      res.grassrootsCompassionIndex +
      res.culturalPreservationResilience) /
      5,
  );
  const lines = [
    `【보각국사 일연 《삼국유사》 홍익인간 자주 자긍심·향가 치유·처용 관용 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 삼국유사 영성 국면: ${describeIlyeonStage(avgScore)}`,
    `- 핵심 삼국유사 테마: ${res.activeIlyeonTheme.themeTitleKo} [${res.activeIlyeonTheme.themeTitleEn}]`,
    `- 역사문학적 통찰: ${res.activeIlyeonTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeIlyeonTheme.practicalCounsel}`,
    `- 삼국유사 원전 격언: "${res.focalIlyeonAphorism.aphorismKo}"`,
    `- 보조 교차 격언: "${res.secondaryIlyeonAphorism.aphorismKo}" [${res.secondaryIlyeonAphorism.sourceContext}]`,
    `- 한문 원문: (${res.focalIlyeonAphorism.aphorismHanja})`,
    `- 원전 출처: [${res.focalIlyeonAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalIlyeonAphorism.actionGuidance}`,
    `- 종합 삼국유사 권면: ${res.ilyeonComprehensiveGuidance.philosophicalCounsel}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ];
  if (res.ilyeonSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.ilyeonSynthesisMatrix.dominantTension} | 조율 상태: ${res.ilyeonSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.ilyeonSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
  );
  return lines.join('\n');
}
