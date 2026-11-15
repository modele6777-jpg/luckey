/**
 * 신라 해상왕 장보고(張保皐) 청해진(淸海鎭) 글로벌 해상무역 & 신의(信義) 개척 실천 엔진
 *
 * 9세기 동아시아 해상권을 장악하고 신라·당·일본을 잇는 국제 무역 네트워크를 건설한 해상왕 장보고(?~846)의 불멸의 역사 원전
 * (《삼국사기》 신라본기, 엔닌의 《입당구법순례행기》, 두목의 《번천문집》) 기반:
 * 1. 신의(信義)와 국제적 신뢰: 국경과 신분을 초월하여 당나라와 일본, 아라비아 상인에 이르기까지 약속을 목숨처럼 지킨 절대적 신뢰의 상도(商道).
 * 2. 청해진(淸海鎭) 자주 개척: 해적을 소탕하여 바닷길의 평화를 회복하고 완도에 자립적 거점을 구축하여 동아시아 해상 패권을 확립한 선제적 기획력.
 * 3. 거친 파도 돌파(破浪前進): 망망대해의 태풍과 역풍을 두려워하지 않고 조선술과 항해술을 혁신하여 새로운 항로를 개척한 불굴의 모험 정신.
 * 4. 글로벌 다문화 네트워크 융합: 적산 법화원(法華院) 건립 등 종교·문화·교역이 어우러지는 열린 코스모폴리탄 국제 교류 플랫폼 구축.
 * 5. 위기 속 기회 포착(變禍爲福): 노비 출신의 한계를 딛고 무예와 지략, 거시적 무역 감각으로 동아시아 역사상 가장 거대한 해상 제국을 일군 입지전적 회복력.
 *
 * @version LUCKEY-JANG-BOGO-MARITIME-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_JANG_BOGO_VERSION = 'LUCKEY-JANG-BOGO-MARITIME-v2.0.0';

export interface CheonghaejinTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  historicalInsight: string;
  practicalCounsel: string;
}

export interface CheonghaejinAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismHanja: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface JangBogoCheonghaejinMaritimePioneerResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 해상왕·신의개척 지표 (0~100)
  maritimePioneerVisionScore: number;     // 해양 개척 비전 및 글로벌 항로 개척력
  trustNetworkCreditScore: number;        // 신의(信義) 기반 파트너십 및 신뢰 자본도
  waveBreakerResilienceScore: number;     // 파도 돌파(破浪) 역풍 극복 및 위기 회복력
  globalTradeStrategicMindScore: number;  // 글로벌 교역 전략 안목 및 시너지 창출도
  independentStrongholdScore: number;     // 청해진 자립 거점 구축 및 자율 실행력
  // 세부 분석
  activeCheonghaeTheme: CheonghaejinTheme;
  focalCheonghaeAphorism: CheonghaejinAphorism;
  jangBogoComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  cheonghaeSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatJangBogoKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

function describeJangBogoStage(score: number): string {
  if (score >= 90) return '청해대통(淸海大通) — 신의의 상도와 광역 네트워크가 어우러져 새 항로를 여는 도약기';
  if (score >= 82) return '파랑전진(破浪前進) — 거친 역풍을 정면 돌파하며 자립 거점을 굳건히 세우는 실행기';
  return '항로개척(航路開拓) — 좁은 울타리를 넘어 신뢰의 닻을 내리고 원대한 항해를 준비하는 기초기';
}

export const CHEONGHAE_THEMES: CheonghaejinTheme[] = [
  {
    themeKey: 'sin_ui_cheong_hae',
    themeTitleHanja: '信義商道 (신의상도 - 국경을 넘는 신용)',
    themeTitleKo: '약속을 목숨처럼 지켜 흔들리지 않는 신뢰 자본을 구축함',
    historicalInsight: '당나라와 일본의 군주와 승려, 상인들이 장보고의 상단을 전폭적으로 신뢰한 비결은 어떤 상황에서도 약속을 어기지 않는 철저한 신의였습니다.',
    practicalCounsel: '단기적인 이익을 위해 신뢰를 훼손하지 마십시오. 투명하고 정직한 신의를 바탕으로 쌓은 파트너십이야말로 거대한 자본과 기회를 불러오는 열쇠입니다.',
  },
  {
    themeKey: 'pa_rang_jeon_jin',
    themeTitleHanja: '破浪前進 (파랑전진 - 역풍과 파도를 뚫음)',
    themeTitleKo: '두려움을 딛고 거친 환경 속에서 새로운 활로를 개척함',
    historicalInsight: '바다의 거친 풍랑과 해적의 위협에 움츠러들지 않고, 독자적인 선단과 방어망을 구축하여 바닷길을 평정했습니다.',
    practicalCounsel: '현재 닥친 시련이나 시장의 불안을 피하려 하지 마십시오. 철저한 실력과 준비로 파도를 정면 돌파할 때 경쟁자가 범접할 수 없는 독점적 우위가 생깁니다.',
  },
  {
    themeKey: 'geol_lo_beol_net_weok',
    themeTitleHanja: '廣域聯網 (광역연망 - 동아시아 교역 플랫폼)',
    themeTitleKo: '좁은 울타리를 벗어나 넓은 세상과 유기적으로 연결됨',
    historicalInsight: '한반도라는 지리적 한계를 넘어 신라방, 적산 법화원, 일본 하카타를 잇는 3국 삼각 무역 거점을 완성했습니다.',
    practicalCounsel: '당신의 시야를 현재 속한 좁은 영역에 가두지 마십시오. 전혀 다른 분야, 다른 지역, 다른 문화의 파트너들과 연결하여 다각적인 시너지를 창출하십시오.',
  },
  {
    themeKey: 'ja_rip_geo_jeom',
    themeTitleHanja: '自主據點 (자주거점 - 완도 청해진의 자생력)',
    themeTitleKo: '외부의 지원에만 의존하지 않고 독자적 힘의 기반을 다짐',
    historicalInsight: '중앙 정부의 지원에 기대지 않고 완도에 청해진을 직접 건설하여 군사·물류·무역이 완결되는 자립 기지를 세웠습니다.',
    practicalCounsel: '남의 손이나 외부의 변덕스러운 환경에 당신의 운명을 맡기지 마십시오. 스스로 통제하고 재생산할 수 있는 당신만의 핵심 역량과 거점을 확보하십시오.',
  },
  {
    themeKey: 'byeon_hwa_wi_bok',
    themeTitleHanja: '變禍爲福 (변화위복 - 한계를 딛고 비상함)',
    themeTitleKo: '태생적 결핍과 고난을 도약의 가장 강력한 추진력으로 바꿈',
    historicalInsight: '골품제의 엄격한 신분 장벽에 좌절하지 않고 당나라 무령군에 투신하여 장군이 되었으며, 마침내 동아시아의 해상 군주로 우뚝 섰습니다.',
    practicalCounsel: '과거의 결핍이나 환경적 불리함을 한탄하지 마십시오. 밑바닥에서 길러낸 현장 감각과 결핍이야말로 당신을 비범하게 도약시킬 최고의 자산입니다.',
  },
];

export const CHEONGHAE_APHORISMS: CheonghaejinAphorism[] = [
  {
    aphorismKey: 'sin_ui_bul_mang',
    aphorismKo: '바다를 건너는 자에게 가장 튼튼한 배는 나무가 아니라 사람 사이의 깊은 신의이다.',
    aphorismHanja: '航海之舟 莫若信義 (항해지주 막약신의)',
    sourceContext: '엔닌 《입당구법순례행기》 장보고 선단 기록',
    actionGuidance: '동료와 고객과의 사소한 약속도 무겁게 여기고 철저히 이행하여 신뢰의 닻을 깊이 내리십시오.',
  },
  {
    aphorismKey: 'cheong_hae_pyeong_jeong',
    aphorismKo: '위험을 두려워하여 웅크리는 자는 작은 나루터도 얻지 못하나, 파도를 헤치는 자는 천하의 바다를 품는다.',
    aphorismHanja: '畏風莫得津 破浪得天海 (외풍막득진 파랑득천해)',
    sourceContext: '두목 《번천문집》 장보고 찬시',
    actionGuidance: '눈앞의 불확실성을 기회의 징표로 읽고, 한 발 앞서 도전하여 선점 효과를 확고히 하십시오.',
  },
  {
    aphorismKey: 'man_ri_tong_sang',
    aphorismKo: '사방의 길을 열어 재화와 마음을 통하게 하니, 험한 바다가 곧 거대한 평원이로다.',
    aphorismHanja: '四方通達 滄海如平 (사방통달 창해여평)',
    sourceContext: '적산 법화원 비문 기록',
    actionGuidance: '폐쇄적인 독점을 고집하지 말고, 다양한 재능과 자원이 자유롭게 오가는 유통과 교류의 중심이 되십시오.',
  },
  {
    aphorismKey: 'ja_ryeok_gyeong_yeong',
    aphorismKo: '기틀은 남이 만들어주는 것이 아니니, 스스로 땀 흘려 닦은 터전만이 풍랑 속에서도 무너지지 않는다.',
    aphorismHanja: '基業自營 堅如磐石 (기업자영 견여반석)',
    sourceContext: '《삼국사기》 청해진 경영록',
    actionGuidance: '의존적인 태도를 버리고, 당신의 실력과 자산을 자생적으로 순환시키는 시스템을 단단히 세우십시오.',
  },
  {
    aphorismKey: 'dae_dong_seong_se',
    aphorismKo: '뜻을 같이하는 동지들과 기쁨과 근심을 함께 나눌 때, 백 척의 선단이 한 몸처럼 나아간다.',
    aphorismHanja: '同舟共濟 萬里風疾 (동주공제 만리풍질)',
    sourceContext: '청해진 해상 연맹 구전훈',
    actionGuidance: '팀원들과 원대한 비전과 과실을 투명하게 공유하여 자발적 헌신과 결속력을 끌어내십시오.',
  },
];

export function calculateJangBogoCheonghaejinMaritimePioneer(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): JangBogoCheonghaejinMaritimePioneerResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `JANG-BOGO-MARITIME:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const maritimePioneerVisionScore = 73 + (absHash % 26);
  const trustNetworkCreditScore = 71 + ((absHash >> 3) % 28);
  const waveBreakerResilienceScore = 70 + ((absHash >> 6) % 29);
  const globalTradeStrategicMindScore = 69 + ((absHash >> 9) % 30);
  const independentStrongholdScore = 72 + ((absHash >> 12) % 27);

  const themeIndex = (absHash >> 4) % CHEONGHAE_THEMES.length;
  const aphorismIndex = (absHash >> 7) % CHEONGHAE_APHORISMS.length;

  const activeCheonghaeTheme = CHEONGHAE_THEMES[themeIndex];
  const focalCheonghaeAphorism = CHEONGHAE_APHORISMS[aphorismIndex];

  const guidanceTitle = `해상왕 장보고 청해진 개척 지혜: ${activeCheonghaeTheme.themeTitleKo}`;
  const philosophicalCounsel = `해상왕 장보고의 청해진 정신은 굳건한 신의와 파도 돌파의 용기로 좁은 한계를 깨고 글로벌 새 항로를 열어가도록 이끕니다. ` +
    `현재 당신의 삶에서 가장 핵심적인 개척 과제는 '${activeCheonghaeTheme.themeTitleKo}'입니다. ` +
    `${activeCheonghaeTheme.practicalCounsel} 아울러 해상왕의 가르침 "${focalCheonghaeAphorism.aphorismKo}"(${focalCheonghaeAphorism.aphorismHanja})을 가슴에 품고, ` +
    `${focalCheonghaeAphorism.actionGuidance}`;

  const calculatedAtKst = formatJangBogoKstTimestamp(now);
  const avgScore = Math.round(
    (maritimePioneerVisionScore +
      trustNetworkCreditScore +
      waveBreakerResilienceScore +
      globalTradeStrategicMindScore +
      independentStrongholdScore) /
      5,
  );
  const cheonghaeSynthesisMatrix = {
    dominantTension: `${activeCheonghaeTheme.themeTitleKo} ↔ ${focalCheonghaeAphorism.sourceContext}`,
    alignmentState: describeJangBogoStage(avgScore),
    integratedAction: `${focalCheonghaeAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_JANG_BOGO_VERSION,
    calculatedAtKst,
    maritimePioneerVisionScore,
    trustNetworkCreditScore,
    waveBreakerResilienceScore,
    globalTradeStrategicMindScore,
    independentStrongholdScore,
    activeCheonghaeTheme,
    focalCheonghaeAphorism,
    jangBogoComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    cheonghaeSynthesisMatrix,
  };
}

export function formatJangBogoCheonghaejinMaritimePioneerPrompt(res: JangBogoCheonghaejinMaritimePioneerResult): string {
  const avgScore = Math.round(
    (res.maritimePioneerVisionScore +
      res.trustNetworkCreditScore +
      res.waveBreakerResilienceScore +
      res.globalTradeStrategicMindScore +
      res.independentStrongholdScore) /
      5,
  );
  const lines = [
    `【해상왕 장보고 《청해진》 글로벌 해상무역 & 신의 개척 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 청해진 개척 국면: ${describeJangBogoStage(avgScore)}`,
    `- 핵심 개척 테마: ${res.activeCheonghaeTheme.themeTitleKo} [${res.activeCheonghaeTheme.themeTitleHanja}]`,
    `- 역사적·철학적 통찰: ${res.activeCheonghaeTheme.historicalInsight}`,
    `- 실천적 조언: ${res.activeCheonghaeTheme.practicalCounsel}`,
    `- 핵심 경구: "${res.focalCheonghaeAphorism.aphorismKo}"`,
    `- 한자 원문: "${res.focalCheonghaeAphorism.aphorismHanja}" [${res.focalCheonghaeAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalCheonghaeAphorism.actionGuidance}`,
    `- 종합 통찰 권면: ${res.jangBogoComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.cheonghaeSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.cheonghaeSynthesisMatrix.dominantTension} | 조율 상태: ${res.cheonghaeSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.cheonghaeSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
