/**
 * 조선 서애 류성룡(西厓 柳成龍) 선생 《징비록(懲毖錄)》
 * 징전비후(懲前毖後) 성찰 & 유비무환(有備無患) 위기대응 실천 엔진
 *
 * 조선 선조 대의 영의정이자 국난 극복의 명재상 서애 류성룡(1542~1607) 선생의 불멸의 국보 제132호 《징비록(懲毖錄)》
 * 및 《서애집(西厓集)》 원전 기반:
 * 1. 징전비후(懲前毖後): "내가 지난 일의 잘못을 징계하여 뒤에 다시 환난이 없도록 삼간다(予其懲而毖後患, 《시경》 소비편)"는 뼈아픈 과거 과오의 정직한 직시와 재발 방지 성찰.
 * 2. 유비무환(有備無환)의 선제적 방비: 평화로울 때 위기를 잊지 않고(居安思危), 평소 제도와 방책을 튼튼히 정비하여 닥쳐올 시련에 대비하는 준비성.
 * 3. 인재 천거와 대승적 연대: 당파와 사사로운 이해를 초월하여 충무공 이순신, 권율 장군 등 국가적 명장들을 과감히 발탁하고 뒷받침한 혜안과 포용적 통합력.
 * 4. 사리사욕 초월 애국위민(愛國爲民): 모함과 난국 속에서도 흔들림 없이 백성의 굶주림과 고통을 보살피고 공공의 안녕을 위해 목숨을 바쳐 헌신한 청렴과 지조.
 * 5. 현장 중심 실무 위기관리력: 훈련도감(訓鍊都監) 설치, 속오법(束伍法) 편성, 양곡 확보와 작전 조율 등 허장성세를 버리고 실질적 결과를 만들어내는 실사구시적 위기 해결력.
 *
 * @version LUCKEY-RYU-SEONGRYONG-JINGBIROK-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_RYU_SEONGRYONG_VERSION = 'LUCKEY-RYU-SEONGRYONG-JINGBIROK-v1.0.0';

export interface JingbirokTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  historicalInsight: string;
  practicalCounsel: string;
}

export interface JingbirokAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface RyuSeongryongJingbirokResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 징비·위기극복 지표 (0~100)
  jingjeonBihuPastReflectionScore: number;          // 징전비후(懲前毖後) 과거 과오 직시 및 재발 방지 성찰도
  yubimuhwanPreemptivePreparednessScore: number;    // 유비무환(有備無患) 거안사위 선제적 위기 방비력
  daeseungTalentIntegrationScore: number;           // 대승적 인재 발탁(이순신·권율 등) 및 연대 통합력
  selflessDevotionPublicGoodScore: number;          // 사리사욕 초월 애국위민(愛國爲民) 공공선 헌신도
  practicalCrisisManagementExecutionScore: number;  // 현장 중심 실무적 위기관리 실행력(훈련도감·속오법)
  // 세부 분석
  activeJingbirokTheme: JingbirokTheme;
  focalJingbirokAphorism: JingbirokAphorism;
  seongryongComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const JINGBIROK_THEMES: JingbirokTheme[] = [
  {
    themeKey: 'jing_jeon_bi_hu',
    themeTitleHanja: '懲前毖後 (징전비후)',
    themeTitleKo: '지난 과오를 엄히 징계하여 훗날의 환난을 삼감',
    historicalInsight: '뼈아픈 실패와 치욕을 감추거나 변명하지 않고 낱낱이 기록하여 반면교사로 삼을 때, 같은 비극이 되풀이되지 않습니다.',
    practicalCounsel: '과거에 겪었던 시행착오나 실수의 원인을 남의 탓으로 돌리지 말고 정직하게 기록하고 복기하십시오. 문제의 싹을 명확히 알아야 다음의 환난을 원천 차단할 수 있습니다.',
  },
  {
    themeKey: 'geo_an_sa_wi',
    themeTitleHanja: '居安思危 & 有備無患 (거안사위 & 유비무환)',
    themeTitleKo: '편안할 때 위태로움을 생각하고 미리 갖추어 근심을 없앰',
    historicalInsight: '태평성대에 젖어 국방과 내실을 게을리하면 하루아침에 누란의 위기에 빠집니다. 평화로울 때야말로 방비를 철저히 해야 할 때입니다.',
    practicalCounsel: '일이 순조롭게 풀릴 때 방심하지 마십시오. 최악의 시나리오를 가정하고 자원, 네트워크, 비상 대책을 미리 꼼꼼히 점검해 두십시오.',
  },
  {
    themeKey: 'geo_hyeon_yang_neung',
    themeTitleHanja: '擧賢揚能 (거현양능 - 대승적 인재 등용과 신뢰)',
    themeTitleKo: '사사로운 파벌을 넘어 참된 인재를 발탁하고 온전히 신뢰함',
    historicalInsight: '국난의 극복은 파벌 싸움을 멈추고 현장의 진짜 영웅을 알아보고 끝까지 믿어준 재상의 열린 안목에서 비롯되었습니다.',
    practicalCounsel: '당신 혼자의 힘으로 모든 위기를 돌파하려 하지 마십시오. 당신보다 특정 분야에 뛰어난 실무자와 동료를 겸허히 찾고, 그들에게 권한과 신뢰를 온전히 실어주십시오.',
  },
  {
    themeKey: 'gong_sim_ae_min',
    themeTitleHanja: '公心愛民 (공심애민 - 청렴과 헌신)',
    themeTitleKo: '사리사욕을 비우고 공공의 안녕과 사람을 중심에 둠',
    historicalInsight: '권력 투쟁과 모함 속에서도 오직 백성의 굶주림을 해결하고 나라를 지탱하겠다는 공심(公心)이 국난을 극복하는 최후의 보루였습니다.',
    practicalCounsel: '사적인 이익이나 자존심 싸움에 에너지를 낭비하지 마십시오. 대의와 본질, 그리고 함께하는 사람들의 실질적 복리에 집중할 때 흔들리지 않는 중심이 섭니다.',
  },
  {
    themeKey: 'sil_sa_gu_si_wi_gi',
    themeTitleHanja: '實事求是 危機管理 (실사구시 위기관리)',
    themeTitleKo: '명분을 버리고 현장과 실질에 입각한 현실적 대책 수립',
    historicalInsight: '탁상공론의 명분론을 배격하고, 군제 개편(속오법)과 실질적 훈련(훈련도감), 식량 확보라는 구체적이고 실행 가능한 방책을 세웠습니다.',
    practicalCounsel: '그럴듯한 말이나 이상론에 머물지 마십시오. 현장에서 즉시 작동할 수 있는 세부 실행 계획과 자원 조달 방안을 마련하여 하나씩 실행에 옮기십시오.',
  },
];

export const JINGBIROK_APHORISMS: JingbirokAphorism[] = [
  {
    aphorismKey: 'yeo_gi_jing_bi',
    aphorismKo: '내가 지난 일의 잘못을 징계하여, 훗날의 환난을 조심하고 경계하노라.',
    aphorismHanja: '予其懲而毖後患 (여기징이비후환)',
    sourceContext: '《징비록》 서문 (<시경> 소비편 인용)',
    actionGuidance: '과거의 실패를 부끄러워하여 덮어두지 말고, 냉정하게 분석하여 확실한 개선 매뉴얼을 수립하십시오.',
  },
  {
    aphorismKey: 'guk_nan_chi_in',
    aphorismKo: '국가가 위태로울 때는 평소의 법식에 구애되지 말고, 마땅히 참된 인재를 과감히 등용해야 한다.',
    aphorismHanja: '國步艱危 宜拔賢能 (국보간위 의발현능)',
    sourceContext: '《징비록》 이순신·권율 천거 대목',
    actionGuidance: '과거의 이력이나 형식적 간판에 얽매이지 말고, 위기를 실제로 헤쳐 나갈 역량 있는 적임자를 찾아 협력하십시오.',
  },
  {
    aphorismKey: 'geo_an_bul_mang_wi',
    aphorismKo: '편안히 살면서도 위태로움을 잊지 않는 자만이 영원히 편안함을 지킬 수 있다.',
    aphorismHanja: '居安不忘危者 方能保其安 (거안불망위자 방능보기안)',
    sourceContext: '《서애집》 시국 진언록',
    actionGuidance: '지금 상황이 안정되어 있을 때 미래의 불확실성에 대비한 예비비와 대안 경로를 선제적으로 마련하십시오.',
  },
  {
    aphorismKey: 'sim_gong_cheo_sa',
    aphorismKo: '마음이 사사로움 없이 지극히 공평하면, 천하의 어떤 험난함도 능히 헤쳐 나갈 수 있다.',
    aphorismHanja: '心公事治 私生亂起 (심공사치 사생란기)',
    sourceContext: '《징비록》 국정 수습 교훈',
    actionGuidance: '의사결정에서 개인적인 감정이나 사심을 깨끗이 비우고, 공정하고 객관적인 원칙을 일관되게 고수하십시오.',
  },
  {
    aphorismKey: 'sil_mu_jeon_sim',
    aphorismKo: '헛된 명분을 다투지 말고, 오직 백성을 살리고 실질을 채우는 데 전력을 다하라.',
    aphorismHanja: '務實去虛 救民爲本 (무실거허 구민위본)',
    sourceContext: '《서애집》 훈련도감 및 속오군 절목',
    actionGuidance: '형식적인 격식과 공허한 논쟁을 과감히 걷어내고, 실질적인 결과와 효용을 창출하는 핵심 과업에만 집중하십시오.',
  },
];

export function calculateRyuSeongryongJingbirok(
  profile: UserProfile
): RyuSeongryongJingbirokResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `RYU-SEONGRYONG-JINGBIROK:${name}:${birthDate}:${birthTime}:${gender}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const jingjeonBihuPastReflectionScore = 71 + (absHash % 28);
  const yubimuhwanPreemptivePreparednessScore = 69 + ((absHash >> 3) % 30);
  const daeseungTalentIntegrationScore = 68 + ((absHash >> 6) % 31);
  const selflessDevotionPublicGoodScore = 70 + ((absHash >> 9) % 29);
  const practicalCrisisManagementExecutionScore = 67 + ((absHash >> 12) % 32);

  const themeIndex = (absHash >> 4) % JINGBIROK_THEMES.length;
  const aphorismIndex = (absHash >> 7) % JINGBIROK_APHORISMS.length;

  const activeJingbirokTheme = JINGBIROK_THEMES[themeIndex];
  const focalJingbirokAphorism = JINGBIROK_APHORISMS[aphorismIndex];

  const guidanceTitle = `서애 류성룡 징비록 위기대응 지혜: ${activeJingbirokTheme.themeTitleKo}`;
  const philosophicalCounsel = `서애 류성룡 선생의 징비록 정신은 과거의 과오를 엄정히 징계하여 미래의 재앙을 막고, 실사구시의 지혜로 국난을 극복하도록 이끕니다. ` +
    `현재 당신의 삶에서 가장 핵심적인 성찰 과제는 '${activeJingbirokTheme.themeTitleKo}'입니다. ` +
    `${activeJingbirokTheme.practicalCounsel} 아울러 류성룡 선생의 가르침 "${focalJingbirokAphorism.aphorismKo}"(${focalJingbirokAphorism.aphorismHanja})을 가슴에 새기고, ` +
    `${focalJingbirokAphorism.actionGuidance}`;

  return {
    engineVersion: KOREAN_RYU_SEONGRYONG_VERSION,
    calculatedAtKst: new Date().toISOString(),
    jingjeonBihuPastReflectionScore,
    yubimuhwanPreemptivePreparednessScore,
    daeseungTalentIntegrationScore,
    selflessDevotionPublicGoodScore,
    practicalCrisisManagementExecutionScore,
    activeJingbirokTheme,
    focalJingbirokAphorism,
    seongryongComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatRyuSeongryongJingbirokPrompt(res: RyuSeongryongJingbirokResult): string {
  return [
    `【서애 류성룡 《징비록》 징전비후 성찰 & 유비무환 위기대응 지표】`,
    `- 징전비후 과거 성찰도(懲前毖後): ${res.jingjeonBihuPastReflectionScore}/100`,
    `- 유비무환 선제적 방비력(居安思危 & 有備無患): ${res.yubimuhwanPreemptivePreparednessScore}/100`,
    `- 대승적 인재 발탁·연대력(擧賢揚能): ${res.daeseungTalentIntegrationScore}/100`,
    `- 사리사욕 초월 애국위민도(公心愛民): ${res.selflessDevotionPublicGoodScore}/100`,
    `- 현장 중심 실무 위기관리력(實事求是 危機管理): ${res.practicalCrisisManagementExecutionScore}/100`,
    `- 핵심 징비 테마: ${res.activeJingbirokTheme.themeTitleKo} [${res.activeJingbirokTheme.themeTitleHanja}]`,
    `- 역사적·철학적 통찰: ${res.activeJingbirokTheme.historicalInsight}`,
    `- 실천적 조언: ${res.activeJingbirokTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalJingbirokAphorism.aphorismKo}"`,
    `- 한자 원문: "${res.focalJingbirokAphorism.aphorismHanja}" [${res.focalJingbirokAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalJingbirokAphorism.actionGuidance}`,
    `- 종합 통찰 권면: ${res.seongryongComprehensiveGuidance.philosophicalCounsel}`,
  ].join('\n');
}
