/**
 * =========================================================================
 * LUCKEY 정통 수피즘(Sufism) 심장의 7대 라타이프(Lataif-e-Sitta) 영혼 정화 & 미크라즈 상승 엔진
 * (Sufi Seven Lataif Soul Ascension & Spiritual Station Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 이슬람 정통 신비주의 수피즘(Sufism)의 대가 이븐 아라비(Ibn Arabi), 잘랄루딘 루미(Rumi),
 * 알 가잘리(Al-Ghazali)와 넉쉬반디(Naqshbandi) 전통의 심층 영성학.
 * 인간 영혼 내부의 미세한 7대 영적 중심(라타이프 Lataif)과 7단계 영혼 상태(나프스 Nafs)를 분석하여,
 * 거친 에고의 집착에서 신성한 사랑과 절대 평화로 상승하는 미크라즈(Mi'raj, 영적 승천) 여정을
 * 0ms 순수 수리로 진단하고 수피 심장 지크르(Dhikr, 거룩한 기억) 처방을 도출합니다.
 * 
 * [7대 라타이프(Lataif) 센터]
 * 1. 나프스 (Nafs): 배꼽 아래 육체적 욕망과 생존의 중심 (황색/흙의 질료)
 * 2. 칼브 (Qalb): 가슴 왼쪽, 직관과 지혜를 품은 '심장의 눈' (적색/불의 정화)
 * 3. 루흐 (Ruh): 가슴 오른쪽, 무조건적 자비와 영혼의 숨결 (녹색/공기의 생명)
 * 4. 시르 (Sirr): 가슴 정중앙, 영혼의 가장 깊은 신비와 침묵 (백색/빛의 순수)
 * 5. 카피 (Khafi): 이마 미간, 감추어진 미세한 영적 시각 (청색/초월적 지성)
 * 6. 아크파 (Akhfa): 정수리, 가장 심원한 신성과의 합일 지점 (흑색/심연의 보라)
 * 7. 쿨 (Kull / Sultan): 전신을 아우르는 전일적 신성한 현존 (투명한 다이아몬드 광채)
 */

import type { UserProfile } from '../sharedState';

export const SUFI_LATAIF_VERSION = 'LUCKEY-SUFI-LATAIF-v2.3.0';

export interface LataifCenter {
  name: string;             // 아랍어 명칭 (Qalb, Ruh, Sirr 등)
  koreanName: string;       // 한국어 명칭
  location: string;         // 신체 에너지 위치
  color: string;            // 신성한 상징 색상
  subtleCapacity: string;   // 영적 능력과 미덕
  shadowTrap: string;       // 그림자의 함정 (정화되지 않았을 때의 고통)
  activationLevel: number;  // 0 ~ 100 활성화 정도
}

export interface SufiLataifReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  lataifCenters: LataifCenter[];
  currentSpiritualStation: {
    stationName: string;    // 마캄 (Maqam)
    stationLevel: string;   // 7단계 영혼의 상태 (Nafs-i-Ammara ~ Nafs-i-Safiya)
    coreTheme: string;      // 현재 삶의 핵심 영적 화두
    transcendenceTask: string; // 초월 과제
  };
  dominantActiveCenter: LataifCenter;
  mostNeedingPurification: LataifCenter;
  spiritualHeartPurityScore: number; // 0 ~ 100 심장의 맑음 지수
  sufiDhikrPrescription: string;      // 수피 지크르(묵상과 현존) 실천 처방
  rumiWisdomQuote: string;           // 루미의 영적 조언
  lataifSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function formatLataifKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

const LATAIF_DEFINITIONS = [
  {
    name: 'Nafs',
    koreanName: '나프스 (원초 자아)',
    location: '배꼽 아래 하복부',
    color: '호박색 (황색 흙)',
    subtleCapacity: '물질적 현실을 지탱하고 생명력을 유지하는 기초 에너지',
    shadowTrap: '끝없는 결핍감, 과도한 식욕·물욕, 불안과 피해의식',
  },
  {
    name: 'Qalb',
    koreanName: '칼브 (심장의 눈)',
    location: '가슴 왼쪽 심장 부위',
    color: '따스한 루비 적색',
    subtleCapacity: '겉모습 너머를 직관하고 진실한 아름다움을 느끼는 사랑의 지성',
    shadowTrap: '질투, 인정 욕구, 타인의 시선에 휘둘리는 감정 기복',
  },
  {
    name: 'Ruh',
    koreanName: '루흐 (영혼의 숨결)',
    location: '가슴 오른쪽 간·폐 부위',
    color: '에메랄드 녹색',
    subtleCapacity: '조건 없는 자비와 타인의 아픔을 품어 안는 치유의 힘',
    shadowTrap: '우유부단함, 과도한 감상주의와 자기 연민',
  },
  {
    name: 'Sirr',
    koreanName: '시르 (신비의 침묵)',
    location: '가슴 중앙 명치 부위',
    color: '순백색 빛',
    subtleCapacity: '세속의 소음 속에서도 흔들리지 않는 절대적 침묵과 평온',
    shadowTrap: '세상과의 단절, 냉담함과 영적 교만',
  },
  {
    name: 'Khafi',
    koreanName: '카피 (감추어진 통찰)',
    location: '이마 중앙 미간',
    color: '사파이어 짙은 청색',
    subtleCapacity: '인과관계와 삶의 보이지 않는 패턴을 조망하는 혜안',
    shadowTrap: '지적 분석 과잉, 머리로만 살고 가슴을 닫는 경향',
  },
  {
    name: 'Akhfa',
    koreanName: '아크파 (심원의 합일)',
    location: '정수리 백회',
    color: '신비의 바이올렛 흑색',
    subtleCapacity: '개별적 자아를 완전히 내려놓고 우주 전체와 하나가 되는 현존',
    shadowTrap: '현실 도피, 현실의 의무를 팽개치는 무책임함',
  },
  {
    name: 'Kull (Sultan)',
    koreanName: '술탄 (전일적 현존)',
    location: '전신과 아우라 전체',
    color: '투명한 다이아몬드 광채',
    subtleCapacity: '모든 호흡과 일상 동작 속에서 신성한 사랑을 살아내는 완전성',
    shadowTrap: '특별한 존재가 되었다는 미세한 영적 에고의 착각',
  },
];

const MAQAM_STATIONS = [
  { stationName: '나프스 알-암마라 (Nafs al-Ammara)', stationLevel: '충동적인 동물적 자아', coreTheme: '욕망의 파도에 휩쓸려 스스로를 소진하는 상태', transcendenceTask: '멈춤(Waqfa)을 통해 충동과 자신 사이에 1초의 호흡 공간을 둘 것' },
  { stationName: '나프스 알-라와마 (Nafs al-Lawwama)', stationLevel: '자책하고 성찰하는 양심의 자아', coreTheme: '실수와 후회 속에서 더 나은 삶을 갈망하는 진통기', transcendenceTask: '자신을 채찍질하는 가혹한 자책을 멈추고 자비로운 용서를 선택할 것' },
  { stationName: '나프스 알-물히마 (Nafs al-Mulhima)', stationLevel: '영감을 받는 열린 자아', coreTheme: '직관과 영감이 샘솟으며 내면의 안내를 감지하는 단계', transcendenceTask: '떠오른 직관을 의심으로 뭉개지 않고 작은 행동으로 옮길 것' },
  { stationName: '나프스 알-무트마인나 (Nafs al-Mutma\'inna)', stationLevel: '안식과 평화에 든 자아', coreTheme: '세상의 어떤 풍파에도 깊은 평온을 잃지 않는 중심', transcendenceTask: '주변의 불안해하는 이들에게 온기와 평화의 닻이 되어줄 것' },
  { stationName: '나프스 알-라디야 (Nafs al-Radiyya)', stationLevel: '삶을 온전히 수용하고 만족하는 자아', coreTheme: '다가오는 모든 인연과 상황을 신성한 선물로 기쁘게 맞이함', transcendenceTask: '판단과 저항을 완전히 내려놓고 순리에 몸을 맡길 것' },
  { stationName: '나프스 알-마르디야 (Nafs al-Mardiyya)', stationLevel: '신성한 축복과 조화를 이룬 자아', coreTheme: '자아의 의지가 우주의 흐름과 완벽히 일치하여 걸림이 없음', transcendenceTask: '행동하되 행위자라는 집착 없이 순수한 도구로 존재할 것' },
  { stationName: '나프스 알-사피야 (Nafs al-Safiya)', stationLevel: '순백의 완전한 영혼', coreTheme: '모든 존재 속에서 신성한 빛만을 목격하는 절대적 합일', transcendenceTask: '일상의 아주 사소한 찻잔 하나, 걸음 한 번 속에서 신성을 축복할 것' },
];

export function calculateSufiLataifSoulAscension(params: {
  profile?: UserProfile | null;
  targetDate?: Date;
  question?: string;
}): SufiLataifReport {
  const now = params.targetDate || new Date();
  const q = params.question?.trim() || '';
  
  // 생년월일 수비학 시드 계산
  let birthSeed = 42;
  if (params.profile?.basic?.birthdate) {
    birthSeed = params.profile.basic.birthdate
      .replace(/-/g, '')
      .split('')
      .reduce((acc, ch) => acc + (parseInt(ch, 10) || 0), 0);
  }

  const nowSeed = now.getUTCFullYear() + now.getUTCMonth() + now.getUTCDate();
  const totalSeed = (birthSeed * 7 + nowSeed) % 100;

  // 7개 라타이프 활성화 점수 계산 (60 ~ 98점 분포)
  const lataifCenters: LataifCenter[] = LATAIF_DEFINITIONS.map((def, idx) => {
    const rawScore = 65 + ((birthSeed * (idx + 3) + nowSeed * (idx + 1)) % 33);
    return {
      ...def,
      activationLevel: Math.min(98, Math.max(55, rawScore)),
    };
  });

  // 가장 활성화된 센터와 가장 정화가 필요한 센터 선별
  const sortedByActivation = [...lataifCenters].sort((a, b) => b.activationLevel - a.activationLevel);
  const dominantActiveCenter = sortedByActivation[0];
  const mostNeedingPurification = sortedByActivation[sortedByActivation.length - 1];

  // 현재 영적 마캄 스테이션 결정
  const stationIndex = (birthSeed + Math.floor(totalSeed / 15)) % MAQAM_STATIONS.length;
  const currentSpiritualStation = MAQAM_STATIONS[stationIndex];

  // 심장의 순도 점수
  const qalbLevel = lataifCenters.find((c) => c.name === 'Qalb')?.activationLevel || 75;
  const sirrLevel = lataifCenters.find((c) => c.name === 'Sirr')?.activationLevel || 75;
  const spiritualHeartPurityScore = Math.round((qalbLevel * 0.6 + sirrLevel * 0.4));

  const sufiDhikrPrescription = `오늘 ${mostNeedingPurification.koreanName}의 긴장을 풀기 위해, 조용한 순간 가슴 중앙에 손을 얹고 숨을 들이쉬며 '야 하이(Ya Hayy - 오 살아있는 영원한 생명이여)', 숨을 내쉬며 '야 카윰(Ya Qayyum - 오 스스로 존재하는 지혜여)'을 3번 나직이 호흡하십시오.`;

  const rumiWisdomQuote = `"당신이 찾는 상처는 빛이 당신에게 들어가는 자리입니다. 슬픔이 당신의 마음을 뒤흔들 때, 그것은 더 큰 기쁨을 맞이하기 위해 심장의 방을 청소하는 중입니다." (잘랄루딘 루미)`;

  const calculatedAtKst = formatLataifKstTimestamp(now);
  const lataifSynthesisMatrix = {
    dominantTension: `${dominantActiveCenter.koreanName} ↔ ${mostNeedingPurification.koreanName} (${mostNeedingPurification.shadowTrap})`,
    alignmentState: `${currentSpiritualStation.stationName} · ${currentSpiritualStation.stationLevel}`,
    integratedAction: `${currentSpiritualStation.transcendenceTask}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const interpretiveBoundary = '본 수피즘 7대 라타이프 리포트는 고전 영성 전통과 수리 시드에 기반한 내면 성찰 안내이며, 의학적·심리학적 진단을 대체하지 않습니다.';
  const ritualAction = `[${mostNeedingPurification.koreanName}] ${sufiDhikrPrescription}`;
  const reflectionFocus = `수피 7대 라타이프(${currentSpiritualStation.stationName}) — ${dominantActiveCenter.koreanName}`;
  const reflectiveQuestion = q
    ? `'${q}'의 흔들림 속에서 지금 가장 정화가 필요한 ${mostNeedingPurification.koreanName} 자리에 1초의 침묵(Waqfa)을 허락한다면 무엇이 가라앉나요?`
    : `지금 내 심장의 눈(Qalb)이 세속의 소음 대신 고요히 비추고 있는 진짜 평화의 방향은 어디인가요?`;

  return {
    engineVersion: SUFI_LATAIF_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    lataifCenters,
    currentSpiritualStation,
    dominantActiveCenter,
    mostNeedingPurification,
    spiritualHeartPurityScore,
    sufiDhikrPrescription,
    rumiWisdomQuote,
    lataifSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatSufiLataifSoulAscensionPrompt(report: SufiLataifReport): string {
  const lines = [
    `### 🕊️ 정통 수피즘 심장의 7대 라타이프(Lataif) 영혼 정화 & 미크라즈 상승 엔진 (${SUFI_LATAIF_VERSION})`,
    `- **연산 시각**: ${report.calculatedAtKst}`,
    `- **현재 영적 스테이션 (Maqam)**: [${report.currentSpiritualStation.stationName}] (${report.currentSpiritualStation.stationLevel})`,
    `  - 핵심 영적 화두: ${report.currentSpiritualStation.coreTheme}`,
    `  - 승천 초월 과제: ${report.currentSpiritualStation.transcendenceTask}`,
    `- **가장 활성화된 라타이프**: ${report.dominantActiveCenter.koreanName} (${report.dominantActiveCenter.location}, ${report.dominantActiveCenter.subtleCapacity})`,
    `- **정화가 필요한 라타이프**: ${report.mostNeedingPurification.koreanName} (${report.mostNeedingPurification.shadowTrap})`,
    `- **수피 지크르(Dhikr) 처방**: ${report.sufiDhikrPrescription}`,
    `- **루미(Rumi)의 영적 조언**: ${report.rumiWisdomQuote}`,
  ];
  if (report.lataifSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.lataifSynthesisMatrix.dominantTension} | 조율 상태: ${report.lataifSynthesisMatrix.alignmentState}]`,
      `  - 통합 실천: ${report.lataifSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- **실천 의례**: ${report.ritualAction}`);
  lines.push(`- **성찰 초점**: ${report.reflectionFocus}`);
  lines.push(`- **질문 맞춤 성찰 질문**: ${report.reflectiveQuestion}`);
  lines.push(`- **해석 경계**: ${report.interpretiveBoundary}`);
  return lines.join('\n');
}
