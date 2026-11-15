/**
 * 조선 세종대왕(世宗大王) 《훈민정음(訓民正音)》 어제서문 애민창조 & 여민락(與民樂) 실용 집현전 지혜 엔진
 *
 * 조선 제4대 국왕이자 민족의 성군 세종대왕(1397~1450)의 불멸의 국보 제70호 유네스코 세계기록유산 《훈민정음(訓民正音)》 어제서문
 * 및 집현전 학문·과학·음악·민생 혁신 원전 기반:
 * 1. 어제서문(御製序文) 애민창조: "나랏말싸미 듕귁에 달아 문자와로 서르 사맛디 아니할쎄... 내 이를 어엿비 너겨 새로 스물여덟 자를 맹가노니" - 기득권 문자의 장벽을 허물고 누구나 쉽게 제 뜻을 펴게 하는 지극한 애민과 혁신적 창조성.
 * 2. 실사구시(實事求是) 실용주의: 측우기·앙부일구·혼천의·칠정산·농사직설 등 백성의 삶을 실제로 윤택하게 하고 문제를 구체적으로 해결하는 현실적 과학주의.
 * 3. 여민락(與民樂) 상생 조화: 백성과 기쁨을 함께한다는 음악과 정치의 이상으로, 상벌과 제도를 조율하여 공동체의 화합을 이끄는 통합적 리더십.
 * 4. 집현전(集賢殿) 집단지성 융합: 신숙주, 성삼문, 정인지, 최항 등 최고의 인재들을 모아 토론하고 경연하며 시너지를 극대화하는 열린 학문적 포용력.
 * 5. 생생지락(生生之樂) 삶의 환희: 백성이 저마다의 생업에 힘쓰며 삶의 즐거움을 누리게 하는 것을 정치와 인간 실존의 궁극적 목표로 삼는 휴머니즘.
 *
 * @version LUCKEY-KING-SEJONG-AEMIN-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_KING_SEJONG_VERSION = 'LUCKEY-KING-SEJONG-AEMIN-v2.0.0';

export interface HunminjeongeumTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  historicalInsight: string;
  practicalCounsel: string;
}

export interface HunminjeongeumAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface KingSejongHunminjeongeumAeminResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 훈민정음·애민창조 지표 (0~100)
  aeminCreativityScore: number;           // 어제서문 애민창조 및 소통 혁신력
  pragmaticBarrierBreakScore: number;     // 문자·제도적 장벽 타파 및 실용주의
  yeominrakHarmonyQuotient: number;       // 여민락(與民樂) 공동체 상생 조화도
  jiphyeonjeonCollectiveWisdom: number;   // 집현전 인재 등용 및 집단지성 융합력
  saengsaengJirakVitalityScore: number;   // 생생지락(生生之樂) 삶의 본질적 활력 지수
  // 세부 분석
  activeHunminTheme: HunminjeongeumTheme;
  focalHunminAphorism: HunminjeongeumAphorism;
  sejongComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  sejongSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatKingSejongKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeSejongStage(score: number): string {
  if (score >= 90) return '여민동락(與民同樂) — 애민의 창조성과 실용적 집단지성이 널리 소통하는 흐름';
  if (score >= 80) return '편어일용(便於日用) — 복잡한 장벽을 허물고 명쾌한 실용 해법을 세우는 국면';
  return '박문심사(博問審思) — 현장의 목소리를 널리 묻고 근본을 다듬는 흐름';
}

export const HUNMIN_THEMES: HunminjeongeumTheme[] = [
  {
    themeKey: 'eo_yeot_bi_neo_gyeo',
    themeTitleHanja: '憐憫創制 (연민창제 - 어엿비 너겨 새로 만듦)',
    themeTitleKo: '타인의 고통에 깊이 공감하여 새로운 길을 개척함',
    historicalInsight: '자기 뜻을 펴지 못해 억울함을 겪는 백성을 향한 깊은 연민이 사대주의와 기득권의 반대를 뚫고 인류 최고의 문자를 낳았습니다.',
    practicalCounsel: '불편함과 억울함이 있는 곳을 외면하지 마십시오. 사람에 대한 진정한 공감과 연민이야말로 가장 강력한 파괴적 혁신과 창조성의 원천입니다.',
  },
  {
    themeKey: 'pyeon_an_ki_sup',
    themeTitleHanja: '便於日用 (편어일용 - 쉽게 익혀 날마다 씀)',
    themeTitleKo: '누구나 쉽게 배우고 실생활에 유용하게 작동함',
    historicalInsight: '아무리 고매한 지식과 기술도 소수의 독점에 머물면 세상을 바꾸지 못합니다. 극도의 단순성과 직관성을 확보해야 보편적 힘을 가집니다.',
    practicalCounsel: '당신의 아이디어나 솔루션을 복잡하게 포장하지 마십시오. 초심자도 직관적으로 이해하고 즉시 쓸 수 있도록 군더더기를 깎아내고 단순화하십시오.',
  },
  {
    themeKey: 'yeo_min_dong_rak',
    themeTitleHanja: '與民同樂 (여민동락 - 백성과 함께 즐거움을 나눔)',
    themeTitleKo: '성과의 결실을 독점하지 않고 공동체와 공유함',
    historicalInsight: '혼자만의 승리나 지배가 아니라, 모든 사람이 제 자리를 찾아 저마다의 삶을 즐기는 생생지락(生生之樂)을 국정의 최고 푯대로 삼았습니다.',
    practicalCounsel: '당신이 이룬 성취와 이익을 주변 동료, 가족, 파트너와 아낌없이 나누십시오. 함께 즐거워할 줄 아는 사람이 진정한 영향력과 지속가능성을 얻습니다.',
  },
  {
    themeKey: 'jip_hyeon_gyeong_yeon',
    themeTitleHanja: '集賢經筵 (집현경연 - 열린 토론과 집단지성)',
    themeTitleKo: '반대 의견도 경청하며 지혜를 모아 완성도를 높임',
    historicalInsight: '자신의 천재성에 안주하지 않고 집현전 학자들과 밤낮으로 토론하고 검증하며 가장 완벽한 과학적 체계를 완성했습니다.',
    practicalCounsel: '독단적인 확신을 경계하십시오. 지적 수준과 실무 역량을 갖춘 이들과 격의 없는 토론을 나누고, 반대 측의 비판 속에서 진주를 건져 올리십시오.',
  },
  {
    themeKey: 'sil_sa_gwa_hak',
    themeTitleHanja: '農事曆法 (농사역법 - 현장 맞춤형 과학 혁신)',
    themeTitleKo: '남의 기준을 맹종하지 않고 우리 땅과 현실에 맞춤',
    historicalInsight: '중국의 농서와 역법에 얽매이지 않고, 조선의 토양과 기후에 맞춘 《농사직설》과 한양 중심의 독자적 역법 《칠정산》을 편찬했습니다.',
    practicalCounsel: '외부의 성공 공식이나 유행을 맹목적으로 답습하지 마십시오. 당신이 처한 고유한 환경과 현실 조건에 정확히 부합하는 맞춤형 해법을 도출하십시오.',
  },
];

export const HUNMIN_APHORISMS: HunminjeongeumAphorism[] = [
  {
    aphorismKey: 'eo_je_seo_mun',
    aphorismKo: '사람마다 하여금 쉽게 익혀 날마다 씀에 편안케 하고자 할 따름이니라.',
    aphorismHanja: '欲使人人易習 便於日用耳 (욕사인인이습 편어일용이)',
    sourceContext: '《훈민정음》 어제서문 결어',
    actionGuidance: '사용자와 상대방의 입장에서 가장 쉽고 편안하게 작동하는 친화적 소통과 산출물을 설계하십시오.',
  },
  {
    aphorismKey: 'saeng_saeng_ji_rak',
    aphorismKo: '백성들로 하여금 저마다 제 삶을 즐겁게 살아가게 하는 것이 나라를 다스리는 도리이다.',
    aphorismHanja: '使民皆有生生之樂 (사민개유생생지락)',
    sourceContext: '《세종실록》 민생 진언',
    actionGuidance: '형식적인 성과 압박에 짓눌리지 말고, 당신 자신과 팀원들의 일상에 활력과 자발적 기쁨이 샘솟도록 일터를 가꾸십시오.',
  },
  {
    aphorismKey: 'gyeong_cheon_ae_min',
    aphorismKo: '하늘의 뜻을 공경하고 사람을 아끼는 마음이 한결같으면, 어떤 어둠도 능히 밝힐 수 있다.',
    aphorismHanja: '敬天愛民 誠無二致 (경천애민 성무이치)',
    sourceContext: '《세종실록》 경연 훈화',
    actionGuidance: '진실한 정성과 인간에 대한 애정을 중심에 두고 일관되게 행동하면, 오해와 난관은 자연스레 풀려나갑니다.',
  },
  {
    aphorismKey: 'mun_ui_deuk_sil',
    aphorismKo: '의심나는 바를 널리 묻고 깊이 헤아려 마침내 마땅한 도리를 얻는다.',
    aphorismHanja: '博問審思 必求其當 (박문심사 필구기당)',
    sourceContext: '《훈민정음 해례본》 정인지 서문',
    actionGuidance: '모르는 것을 부끄러워하지 말고 전문가와 현장에 묻고 검증하여 가장 올바르고 견고한 결론에 도달하십시오.',
  },
  {
    aphorismKey: 'hwa_eum_tong_dal',
    aphorismKo: '소리와 뜻이 활짝 통하여 막힘이 없으니, 온 세상의 소통이 참으로 평온하도다.',
    aphorismHanja: '通達無礙 和順自然 (통달무애 화순자연)',
    sourceContext: '《훈민정음 해례본》 제자해',
    actionGuidance: '막힌 곳을 뚫어주고 갈등을 해소하는 투명하고 명쾌한 소통의 다리를 놓으십시오.',
  },
];

export function calculateKingSejongHunminjeongeumAemin(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): KingSejongHunminjeongeumAeminResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `KING-SEJONG-AEMIN:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const aeminCreativityScore = 72 + (absHash % 27);
  const pragmaticBarrierBreakScore = 70 + ((absHash >> 3) % 29);
  const yeominrakHarmonyQuotient = 69 + ((absHash >> 6) % 30);
  const jiphyeonjeonCollectiveWisdom = 71 + ((absHash >> 9) % 28);
  const saengsaengJirakVitalityScore = 68 + ((absHash >> 12) % 31);

  const themeIndex = (absHash >> 4) % HUNMIN_THEMES.length;
  const aphorismIndex = (absHash >> 7) % HUNMIN_APHORISMS.length;

  const activeHunminTheme = HUNMIN_THEMES[themeIndex];
  const focalHunminAphorism = HUNMIN_APHORISMS[aphorismIndex];

  const guidanceTitle = `세종대왕 훈민정음 애민창조 지혜: ${activeHunminTheme.themeTitleKo}`;
  const philosophicalCounsel = `세종대왕의 훈민정음 창제 정신은 지극한 연민과 애민에서 출발하여 기존 장벽을 허물고 실용적 창의성을 꽃피우도록 이끕니다. ` +
    `현재 당신의 삶에서 가장 핵심적인 창조적 과제는 '${activeHunminTheme.themeTitleKo}'입니다. ` +
    `${activeHunminTheme.practicalCounsel} 아울러 세종대왕의 가르침 "${focalHunminAphorism.aphorismKo}"(${focalHunminAphorism.aphorismHanja})을 가슴에 새기고, ` +
    `${focalHunminAphorism.actionGuidance}`;

  const calculatedAtKst = formatKingSejongKstTimestamp(now);
  const avgScore = Math.round(
    (aeminCreativityScore +
      pragmaticBarrierBreakScore +
      yeominrakHarmonyQuotient +
      jiphyeonjeonCollectiveWisdom +
      saengsaengJirakVitalityScore) /
      5,
  );
  const sejongSynthesisMatrix = {
    dominantTension: `${activeHunminTheme.themeTitleKo} ↔ ${focalHunminAphorism.sourceContext}`,
    alignmentState: describeSejongStage(avgScore),
    integratedAction: `${focalHunminAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_KING_SEJONG_VERSION,
    calculatedAtKst,
    aeminCreativityScore,
    pragmaticBarrierBreakScore,
    yeominrakHarmonyQuotient,
    jiphyeonjeonCollectiveWisdom,
    saengsaengJirakVitalityScore,
    activeHunminTheme,
    focalHunminAphorism,
    sejongComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    sejongSynthesisMatrix,
  };
}

export function formatKingSejongHunminjeongeumAeminPrompt(res: KingSejongHunminjeongeumAeminResult): string {
  const avgScore = Math.round(
    (res.aeminCreativityScore +
      res.pragmaticBarrierBreakScore +
      res.yeominrakHarmonyQuotient +
      res.jiphyeonjeonCollectiveWisdom +
      res.saengsaengJirakVitalityScore) /
      5,
  );
  const lines = [
    `【세종대왕 《훈민정음》 어제서문 애민창조 & 여민락 지혜 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 애민·창조 국면: ${describeSejongStage(avgScore)}`,
    `- 핵심 애민 테마: ${res.activeHunminTheme.themeTitleKo} [${res.activeHunminTheme.themeTitleHanja}]`,
    `- 역사적·철학적 통찰: ${res.activeHunminTheme.historicalInsight}`,
    `- 실천적 조언: ${res.activeHunminTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalHunminAphorism.aphorismKo}"`,
    `- 한자 원문: "${res.focalHunminAphorism.aphorismHanja}" [${res.focalHunminAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalHunminAphorism.actionGuidance}`,
    `- 종합 통찰 권면: ${res.sejongComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.sejongSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.sejongSynthesisMatrix.dominantTension} | 조율 상태: ${res.sejongSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.sejongSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
