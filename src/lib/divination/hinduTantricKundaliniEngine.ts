/**
 * =========================================================================
 * LUCKEY 힌두 탄트라 쿤달리니 7대 차크라 나디 프라나야마 각성 엔진
 * (Hindu Tantric Kundalini Nadi Awakening Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 고대 인도 탄트라 요가 및 하타 요가 프라디피카(Hatha Yoga Pradipika),
 * 쉬바 삼히타(Shiva Samhita), 우파니샤드 요가 원전 기반.
 * 
 * 1. 3대 주요 나디 (Three Primary Nadis / 72,000 에너지 통로 중 핵심):
 *    - 이다 (Ida Nadi): 달(Chandra), 음(Yin), 좌측 콧구멍, 부교감신경, 감성·직관·이완·수용성
 *    - 핑갈라 (Pingala Nadi): 태양(Surya), 양(Yang), 우측 콧구멍, 교감신경, 활력·추진·논리·실행력
 *    - 수슘나 (Sushumna Nadi): 중앙 척추 통로, 음양 초월, 삼매(Samadhi)와 영적 해탈(Moksha) 통로
 * 2. 쿤달리니 샤크티 (Kundalini Shakti):
 *    - 물라다라(회음부)에 3.5바퀴 똬리를 틀고 잠든 근원적 우주 생명 에너지가
 *      나디의 정화를 통해 척추를 타고 사하스라라(백회) 쉬바 의식과 합일하는 상승 여정
 * 3. 3대 영적 매듭 (Three Granthis / 카르마적 장애물):
 *    - 브라흐마 그란티 (Brahma Granthi): 물질계 집착, 생존 불안, 신체 동일시 해제
 *    - 비슈누 그란티 (Vishnu Granthi): 감정적 결박, 에고적 사랑, 자기중심적 집착 해제
 *    - 루드라 그란티 (Rudra Granthi): 지적 교만, 영적 우월감, 미세한 이원성 분별 해제
 * 4. 7대 차크라 상태 및 나디 쇼다나(Nadi Shodhana) 교호호흡 처방
 */

import type { UserProfile } from '../sharedState';

export const HINDU_KUNDALINI_VERSION = 'LUCKEY-HINDU-KUNDALINI-v2.2.0';

export interface PrimaryNadiState {
  code: 'IDA' | 'PINGALA' | 'SUSHUMNA';
  sanskritName: string;
  solarLunarPolarity: string;
  activeNostrilFlow: string;
  mentalPhysiologicalState: string;
  energyBalanceRatio: {
    idaPercentage: number;     // 0 ~ 100
    pingalaPercentage: number; // 0 ~ 100
    sushumnaOpenness: number;  // 0 ~ 100
  };
}

export interface GranthiKnotStatus {
  name: string;
  sanskritTitle: string;
  locationChakras: string;
  karmicObstacleTheme: string;
  untyingProgressScore: number; // 0 ~ 100 매듭 해제 진척도
  liberationGuidance: string;
}

export interface ChakraAwakeningNode {
  sanskritName: string;
  koreanName: string;
  petalNumber: number;
  seedMantra: string; // LAM, VAM, RAM, YAM, HAM, OM, SILENCE
  energyVibrationLevel: number; // 0 ~ 100
  focusChallenge: string;
}

export interface PranayamaPrescription {
  primaryBreathwork: string;
  breathRhythmRatio: string; // e.g. "4초 흡기 - 16초 지기 - 8초 호기"
  seedMantraChanting: string;
  mudraAndBandha: string;
  dailySadhanaAdvice: string;
}

export interface HinduTantricKundaliniReport {
  engineVersion: string;
  calculatedAt: string;
  primaryNadi: PrimaryNadiState;
  kundaliniVitalityLevel: number; // 내부 참조용 (프롬프트 비노출)
  dominantChakraNode: ChakraAwakeningNode;
  granthis: GranthiKnotStatus[];
  pranayama: PranayamaPrescription;
  totalSpiritualAwakeningHarmonics: number; // 내부 참조용 (프롬프트 비노출)
  situationalKundaliniAudit: {
    questionTheme: 'relationship' | 'career' | 'healing' | 'spiritual';
    nadiTensionAxis: string;
    granthiFocus: string;
    sadhanaPrescription: string;
  };
  temporalKundaliniRhythm: {
    calculatedAtKst: string;
    pranaWindow: string;
    seasonalTattva: string;
    rhythmGuidance: string;
  };
  kundaliniSynthesisMatrix: {
    nadiChakraNexus: string;
    awakeningPosture: string;
    coreDirective: string;
  };
  synthesisMessage: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

const CHAKRA_NODES: ChakraAwakeningNode[] = [
  { sanskritName: 'Muladhara', koreanName: '물라다라 (근음/뿌리 차크라)', petalNumber: 4, seedMantra: 'LAM', energyVibrationLevel: 75, focusChallenge: '생존 안정감과 대지 접지(Grounding)' },
  { sanskritName: 'Svadhisthana', koreanName: '스바디스타나 (천골/단전 차크라)', petalNumber: 6, seedMantra: 'VAM', energyVibrationLevel: 70, focusChallenge: '창조적 기쁨과 감정의 유연한 흐름' },
  { sanskritName: 'Manipura', koreanName: '마니푸라 (태양신경총 차크라)', petalNumber: 10, seedMantra: 'RAM', energyVibrationLevel: 80, focusChallenge: '내면의 의지력과 당당한 추진력' },
  { sanskritName: 'Anahata', koreanName: '아나하타 (심장 차크라)', petalNumber: 12, seedMantra: 'YAM', energyVibrationLevel: 85, focusChallenge: '무조건적인 자비와 가슴의 열림' },
  { sanskritName: 'Vishuddha', koreanName: '비슈다 (목/목구멍 차크라)', petalNumber: 16, seedMantra: 'HAM', energyVibrationLevel: 72, focusChallenge: '진실된 자기표현과 공간적 정화' },
  { sanskritName: 'Ajna', koreanName: '아즈나 (제3의 눈/미간 차크라)', petalNumber: 2, seedMantra: 'OM', energyVibrationLevel: 88, focusChallenge: '초월적 통찰과 에고를 넘은 직관' },
  { sanskritName: 'Sahasrara', koreanName: '사하스라라 (백회/정수리 차크라)', petalNumber: 1000, seedMantra: 'AUM', energyVibrationLevel: 90, focusChallenge: '우주 신성과의 영적 합일(Samadhi)' },
];

function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateHinduTantricKundalini(params: {
  profile?: UserProfile;
  contextText?: string;
  referenceDate?: Date;
}): HinduTantricKundaliniReport {
  const now = params.referenceDate || new Date();
  const birthdate = params.profile?.basic?.birthdate?.trim() || '1990-01-01';
  const name = params.profile?.basic?.name?.trim() || '구도자';
  const context = (params.contextText || '').trim();

  const seed = stringHash(`${birthdate}|${name}|${now.toISOString().slice(0, 10)}|${context}`);

  // 1. 나디 흐름 비율 계산
  const baseIda = 30 + (seed % 41); // 30 ~ 70
  const basePingala = 30 + ((seed >> 2) % 41); // 30 ~ 70
  const totalNadi = baseIda + basePingala;
  const idaPercentage = Math.round((baseIda / totalNadi) * 85);
  const pingalaPercentage = 85 - idaPercentage;
  const sushumnaOpenness = 15 + ((seed >> 4) % 65); // 15 ~ 79

  let code: 'IDA' | 'PINGALA' | 'SUSHUMNA' = 'IDA';
  let sanskritName = 'Ida Nadi';
  let solarLunarPolarity = '찬드라 (Chandra / 달의 음기)';
  let activeNostrilFlow = '좌측 콧구멍 주도 (이완·내면 성찰·직관 작용 활성)';
  let mentalPhysiologicalState = '감성적 수용성과 깊은 직관이 열려 있으며, 신체는 부교감신경 이완 모드입니다.';

  if (sushumnaOpenness >= 65) {
    code = 'SUSHUMNA';
    sanskritName = 'Sushumna Nadi';
    solarLunarPolarity = '합일 (Maha-Prana / 음양 중화 초월)';
    activeNostrilFlow = '양측 콧구멍 균형 유입 (중앙 척수 통로 영적 개방)';
    mentalPhysiologicalState = '에고의 분별을 넘어 고요한 평정과 삼매(Samadhi)의 통찰이 솟아오르는 신성한 상태입니다.';
  } else if (pingalaPercentage > idaPercentage) {
    code = 'PINGALA';
    sanskritName = 'Pingala Nadi';
    solarLunarPolarity = '수리야 (Surya / 태양의 양기)';
    activeNostrilFlow = '우측 콧구멍 주도 (행동·추진력·논리적 분별 활성)';
    mentalPhysiologicalState = '현실적 성과 창출과 외부 도약을 위한 교감신경 및 활력 화기가 극대화되어 있습니다.';
  }

  const primaryNadi: PrimaryNadiState = {
    code,
    sanskritName,
    solarLunarPolarity,
    activeNostrilFlow,
    mentalPhysiologicalState,
    energyBalanceRatio: {
      idaPercentage,
      pingalaPercentage,
      sushumnaOpenness,
    },
  };

  // 2. 쿤달리니 잠재 생명력 지수
  const kundaliniVitalityLevel = 50 + (seed % 46); // 50 ~ 95

  // 3. 우세 차크라 노드 선정
  const chakraIdx = (seed + (now.getUTCDate() * 3)) % CHAKRA_NODES.length;
  const baseChakra = CHAKRA_NODES[chakraIdx];
  const dominantChakraNode: ChakraAwakeningNode = {
    ...baseChakra,
    energyVibrationLevel: Math.min(98, baseChakra.energyVibrationLevel + ((seed >> 3) % 15)),
  };

  // 4. 3대 그란티(영적 매듭) 해제 진행률
  const brahmaScore = 55 + ((seed >> 1) % 41); // 물질·생존 매듭 (물라다라/스바디스타나)
  const vishnuScore = 50 + ((seed >> 2) % 43); // 감정·에고 매듭 (마니푸라/아나하타)
  const rudraScore = 45 + ((seed >> 3) % 45);  // 지적·이원성 매듭 (아즈나)

  const granthis: GranthiKnotStatus[] = [
    {
      name: '브라흐마 그란티',
      sanskritTitle: 'Brahma Granthi (물질계 결박)',
      locationChakras: '물라다라 & 스바디스타나 차크라 영역',
      karmicObstacleTheme: '물질적 결핍에 대한 원초적 불안과 신체 동일시',
      untyingProgressScore: brahmaScore,
      liberationGuidance: '생존 걱정을 내려놓고 대지의 풍요로움을 신뢰할 때 매듭이 풀립니다.',
    },
    {
      name: '비슈누 그란티',
      sanskritTitle: 'Vishnu Granthi (감정계 결박)',
      locationChakras: '아나하타 차크라 영역',
      karmicObstacleTheme: '조건부 애착, 역할에 대한 에고적 집착과 상처',
      untyingProgressScore: vishnuScore,
      liberationGuidance: '상대를 소유하려 하지 않고 우주적 자비로 가슴을 활짝 열 때 매듭이 해제됩니다.',
    },
    {
      name: '루드라 그란티',
      sanskritTitle: 'Rudra Granthi (지성·이원성 결박)',
      locationChakras: '아즈나 차크라 영역',
      karmicObstacleTheme: '논리적 교만, 분별심, 영적 우월감의 미세한 집착',
      untyingProgressScore: rudraScore,
      liberationGuidance: '‘안다는 생각’마저 고요 속에 항복시키고 순수 관조자로 머물 때 통과됩니다.',
    },
  ];

  // 5. 프라나야마(호흡법) 및 사다나 처방
  let primaryBreathwork = '나디 쇼다나 (Nadi Shodhana, 정밀 교호호흡)';
  let breathRhythmRatio = '4초 좌측 흡기 - 16초 지기(Kumbhaka) - 8초 우측 호기 (1:4:2 비율)';
  let mudraAndBandha = '비슈누 무드라(Vishnu Mudra) & 물라 반다(Mula Bandha, 회음 수축)';
  let dailySadhanaAdvice = '기상 직후 또는 취침 전 10분간 좌우 콧구멍을 번갈아 호흡하여 이다와 핑갈라의 화기와 수기를 중화시키세요.';

  if (code === 'IDA') {
    primaryBreathwork = '수리야 베다나 프라나야마 (Surya Bhedana, 태양 기혈 활성 호흡)';
    breathRhythmRatio = '우측 콧구멍으로 흡기 4초 - 지기 8초 - 좌측 호기 8초';
    mudraAndBandha = '수리야 무드라(Surya Mudra) & 우디야나 반다(Uddiyana Bandha)';
    dailySadhanaAdvice = '내면 침잠이 과할 수 있으니 우측 태양 나디를 깨워 생기 있는 행동 추진력을 충전하세요.';
  } else if (code === 'PINGALA') {
    primaryBreathwork = '찬드라 베다나 & 시탈리 프라나야마 (Chandra Bhedana & Sheetali, 냉각 달 호흡)';
    breathRhythmRatio = '좌측 콧구멍으로 흡기 4초 - 편안한 지기 4초 - 우측 호기 8초';
    mudraAndBandha = '치트 무드라(Chin Mudra) & 잘란다라 반다(Jalandhara Bandha, 턱 당김)';
    dailySadhanaAdvice = '태양 화기가 강해 조급해지기 쉬우니 시원한 달의 나디로 화기를 가라앉히고 여유를 찾으세요.';
  } else {
    primaryBreathwork = '카팔라바티 정뇌호흡 & 수슘나 상승 명상';
    breathRhythmRatio = '빠른 복부 수축 30회 후 - 깊은 흡기 4초 - 편안한 지기 16초 - 서서히 호기';
    mudraAndBandha = '마하 무드라(Maha Mudra) & 트리 반다(Tri Bandha, 3대 반다 통합)';
    dailySadhanaAdvice = '중앙 통로가 열려 영적 영감이 풍부한 순간입니다. 고요히 미간 아즈나에 의식을 두고 명상하세요.';
  }

  const pranayama: PranayamaPrescription = {
    primaryBreathwork,
    breathRhythmRatio,
    seedMantraChanting: `비자 만트라 "${dominantChakraNode.seedMantra}" 진동 108회 염송`,
    mudraAndBandha,
    dailySadhanaAdvice,
  };

  const totalSpiritualAwakeningHarmonics = Math.round(
    (kundaliniVitalityLevel * 0.4) + (sushumnaOpenness * 0.3) + (((brahmaScore + vishnuScore + rudraScore) / 3) * 0.3)
  );

  const synthesisMessage = `현재 당신의 에너지는 [${primaryNadi.sanskritName} / ${primaryNadi.solarLunarPolarity}]의 흐름에 정렬되어 있습니다. 우세 차크라인 [${dominantChakraNode.koreanName}]의 진동과 함께 ${primaryBreathwork}를 수련할 때, 척추를 타고 흐르는 신성한 쿤달리니 생명력이 3대 매듭을 관통하여 영적 도약을 이끕니다.`;

  const qLower = context.toLowerCase();
  const questionTheme: 'relationship' | 'career' | 'healing' | 'spiritual' =
    /관계|연애|사랑|사람|가족|이별|갈등/.test(qLower)
      ? 'relationship'
      : /일|직장|사업|진로|결정|돈|재물|시험/.test(qLower)
        ? 'career'
        : /지치|불안|피로|휴식|건강|치유|우울/.test(qLower)
          ? 'healing'
          : 'spiritual';

  const situationalKundaliniAudit = {
    questionTheme,
    nadiTensionAxis: code === 'PINGALA'
      ? '과도한 태양 양기(추진·긴장)와 이완의 필요성 사이 균형'
      : code === 'IDA'
        ? '깊은 내면 침잠(달 음기)과 현실 실행력 사이의 균형'
        : '양측 기류의 중화와 중앙 수슘나 각성의 고요한 유지',
    granthiFocus: questionTheme === 'relationship'
      ? granthis[1].name + ' — 조건부 애착을 자비로 승화'
      : questionTheme === 'career'
        ? granthis[0].name + ' — 생존 불안을 내려놓고 대지 접지'
        : granthis[2].name + ' — 과도한 분석·분별을 내려놓고 관조',
    sadhanaPrescription: pranayama.dailySadhanaAdvice,
  };

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;
  const calculatedAtKst = kstDate.toISOString().replace('T', ' ').slice(0, 16) + ' KST';

  const pranaWindow = kstHour >= 4 && kstHour < 7
    ? '브라흐마 무후르타 (새벽 영적 각성 및 수슘나 개방 황금창)'
    : kstHour >= 7 && kstHour < 14
      ? '수리야 태양창 (핑갈라 활력과 마니푸라 실행 에너지)'
      : kstHour >= 14 && kstHour < 20
        ? '바유 균형창 (나디 쇼다나 호흡으로 기혈 순환 정돈)'
        : '찬드라 달빛창 (이다 나디 이완 및 아나하타 정서 치유)';

  const seasonalTattva = kstMonth >= 3 && kstMonth <= 5
    ? '바유·아카샤 봄 상승기 (새 프라나 순환)'
    : kstMonth >= 6 && kstMonth <= 8
      ? '아그니 여름 화기절 (시탈리 냉각 호흡으로 조화)'
      : kstMonth >= 9 && kstMonth <= 11
        ? '프리트비 가을 접지기 (물라 반다와 내면 수렴)'
        : '아파스 겨울 심연기 (고요한 만트라 진동 축적)';

  const temporalKundaliniRhythm = {
    calculatedAtKst,
    pranaWindow,
    seasonalTattva,
    rhythmGuidance: `${pranaWindow}과 ${seasonalTattva}가 교차하는 시간입니다. 호흡의 리듬을 억지로 늘리기보다 날숨을 편안히 길게 내쉬세요.`,
  };

  const kundaliniSynthesisMatrix = {
    nadiChakraNexus: `${primaryNadi.sanskritName} × ${dominantChakraNode.koreanName}`,
    awakeningPosture: totalSpiritualAwakeningHarmonics >= 78
      ? '수슘나 중앙 통로가 원활히 열려 직관과 실행이 조화를 이루는 국면'
      : '이다와 핑갈라의 교차 호흡을 통해 매듭을 부드럽게 이완하는 정화 국면',
    coreDirective: `${dominantChakraNode.focusChallenge}에 의식을 두고 "${dominantChakraNode.seedMantra}" 진동을 가볍게 호흡에 실어 보세요.`,
  };

  const ritualAction = `[${primaryNadi.sanskritName} · ${dominantChakraNode.koreanName}] ${pranayama.dailySadhanaAdvice} (호흡: ${pranayama.primaryBreathwork})`;
  const reflectionFocus = `지금 나의 '${situationalKundaliniAudit.granthiFocus}' 앞에서 ${dominantChakraNode.focusChallenge}을(를) 열기 위해 오늘 내려놓을 긴장은 무엇입니까?`;

  return {
    engineVersion: HINDU_KUNDALINI_VERSION,
    calculatedAt: now.toISOString(),
    primaryNadi,
    kundaliniVitalityLevel,
    dominantChakraNode,
    granthis,
    pranayama,
    totalSpiritualAwakeningHarmonics,
    situationalKundaliniAudit,
    temporalKundaliniRhythm,
    kundaliniSynthesisMatrix,
    synthesisMessage,
    ritualAction,
    reflectionFocus,
    boundaryNotice: '인도 탄트라 요가 및 프라나야마 상징 체계에 기반한 정성적 심신 성찰 관점이며, 의학적 진단이나 치료를 대신하지 않습니다.',
    interpretiveBoundary: '인도 탄트라 요가 및 프라나야마 상징 체계에 기반한 정성적 심신 성찰 관점이며, 의학적 진단이나 치료를 대신하지 않습니다.',
  };
}

export function formatHinduTantricKundaliniPrompt(report: HinduTantricKundaliniReport): string {
  const nadiBalanceQualitative =
    report.primaryNadi.code === 'SUSHUMNA'
      ? '양측 나디가 고르게 중화되어 중앙 수슘나 통로가 열려 있는 균형 상태'
      : report.primaryNadi.code === 'PINGALA'
        ? '태양 나디(핑갈라) 기류가 우세하여 추진력과 외적 실행력이 앞서는 상태'
        : '달 나디(이다) 기류가 우세하여 내면 감수성과 회복 이완이 앞서는 상태';

  return `### 🕉️ 힌두 탄트라 쿤달리니 7대 차크라 나디 각성 엔진 (${HINDU_KUNDALINI_VERSION})
- **주요 나디(Nadi) 극성 흐름**: ${report.primaryNadi.sanskritName} (${report.primaryNadi.solarLunarPolarity})
  - 콧구멍 기류: ${report.primaryNadi.activeNostrilFlow}
  - 심신 상태: ${report.primaryNadi.mentalPhysiologicalState}
  - 나디 흐름 균형: ${nadiBalanceQualitative}
- **질문 맥락 감사**: 테마(${report.situationalKundaliniAudit.questionTheme}) · 긴장축: ${report.situationalKundaliniAudit.nadiTensionAxis} · 핵심 매듭: ${report.situationalKundaliniAudit.granthiFocus}
- **시공간 프라나 리듬 (${report.temporalKundaliniRhythm.calculatedAtKst})**: ${report.temporalKundaliniRhythm.pranaWindow} / ${report.temporalKundaliniRhythm.seasonalTattva}
  - 리듬 지침: ${report.temporalKundaliniRhythm.rhythmGuidance}
- **현재 핵심 공명 차크라**: ${report.dominantChakraNode.koreanName} (만트라: ${report.dominantChakraNode.seedMantra})
  - 영적 도전 과제: ${report.dominantChakraNode.focusChallenge}
- **3대 영적 매듭(Granthis) 성찰**:
  - 브라흐마(물질): ${report.granthis[0].liberationGuidance}
  - 비슈누(감정): ${report.granthis[1].liberationGuidance}
  - 루드라(지성): ${report.granthis[2].liberationGuidance}
- **프라나야마 호흡 처방(Pranayama Sadhana)**:
  - 수련 호흡법: ${report.pranayama.primaryBreathwork} (리듬: ${report.pranayama.breathRhythmRatio})
  - 만트라 & 무드라: ${report.pranayama.seedMantraChanting} | ${report.pranayama.mudraAndBandha}
  - 일상 지침: ${report.pranayama.dailySadhanaAdvice}
- **나디-차크라 교차 매트릭스**: ${report.kundaliniSynthesisMatrix.nadiChakraNexus} — ${report.kundaliniSynthesisMatrix.awakeningPosture} (${report.kundaliniSynthesisMatrix.coreDirective})
- **쿤달리니 통합 나침반**: ${report.synthesisMessage}
- **실천 의례(Ritual Action)**: ${report.ritualAction}
- **성찰 초점(Reflection Focus)**: ${report.reflectionFocus}
- **해석 경계**: ${report.boundaryNotice}`;
}
