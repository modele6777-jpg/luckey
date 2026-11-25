/**
 * 고대 그리스 아리스토텔레스(Aristotle) 니코마코스 윤리학 중용(Mesotes) & 최고선 에우다이모니아(Eudaimonia) 덕행 엔진
 *
 * 서기전 4세기 아리스토텔레스의 《니코마코스 윤리학(Nicomachean Ethics)》 원전 기반.
 * 1. 최고선 에우다이모니아(Eudaimonia): 인간 삶의 궁극적 목적은 덕(Aretē)에 따르는 영혼의 활동이자 온전한 번영이다.
 * 2. 중용(Mesotes, Golden Mean): 덕은 지나침(과도)과 모자람(결핍)의 양극단을 배제한 최적의 중간 지점을 포착하는 것이다.
 * 3. 실천적 지혜 프로네시스(Phronesis): 구체적인 상황 속에서 올바른 행동의 척도를 가늠하는 이성적 판단력.
 * 4. 텔로스(Telos, 목적론): 모든 존재는 내재된 잠재태(Dynamis)를 실현태(Energeia)로 꽃피우려는 궁극의 목적을 지닌다.
 *
 * @version LUCKEY-ARISTOTLE-MESOTES-EUDAIMONIA-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const ARISTOTLE_MESOTES_VERSION = 'LUCKEY-ARISTOTLE-MESOTES-EUDAIMONIA-v2.4.0';

function formatAristotleKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

export interface AristotleVirtueStage {
  stageLevel: number;
  virtueNameGreek: string;
  virtueNameKo: string;
  deficiencyExtreme: string;
  excessExtreme: string;
  goldenMeanEssence: string;
  practicalAction: string;
}

export interface SituationalMesotes {
  imbalanceAxis: string;
  ethicsCitation: string;
  deficiencyTrap: string;
  excessTrap: string;
  goldenMeanPivot: string;
}

export interface TemporalPhronesisRhythm {
  kstPhaseLabel: string;
  seasonContext: string;
  phronesisReadiness: number;
  hexisHabitGuidance: string;
}

export interface EudaimoniaBalanceMatrix {
  goldenMeanStability: number;
  phronesisActionability: number;
  habitualAreteMomentum: number;
  dominantAxis: string;
  meanCalibrationGuide: string;
}

export interface AristotleMesotesResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  mesotesGoldenMeanScore: number;     // 중용 황금률 밸런스 지수
  eudaimoniaFlourishingIndex: number; // 에우다이모니아 영혼 번영도
  phronesisPracticalWisdom: number;   // 실천적 지혜 프로네시스 분별력
  telosPurposeOrientation: number;    // 텔로스 목적론적 지향력
  areteExcellenceIntegrity: number;   // 아레테 탁월성 품격도
  // 세부 명세
  activeVirtueStage: AristotleVirtueStage;
  primaryMesotesWisdom: {
    themeKo: string;
    greekClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  eudaimoniaPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  // v2.0.0 질적 성찰 & 시공간·다차원 교차 검증
  situationalMesotes: SituationalMesotes;
  temporalPhronesisRhythm: TemporalPhronesisRhythm;
  eudaimoniaBalanceMatrix: EudaimoniaBalanceMatrix;
  // v2.1.0 순수 정성 실천·성찰·경계
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  aristotleCrossAxis: string;
  aristotleShadowWarning: string;
  aristotleSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export type AristotleMesotesReport = AristotleMesotesResult;

const ARISTOTLE_VIRTUE_STAGES: AristotleVirtueStage[] = [
  {
    stageLevel: 1,
    virtueNameGreek: 'Andreia (용기)',
    virtueNameKo: '두려움에 맞서는 당당한 용기의 중용',
    deficiencyExtreme: '비겁(Deilia): 마땅히 맞서야 할 상황에서 물러섬',
    excessExtreme: '만용(Thrasytes): 무모하게 분별없이 위험에 뛰어듦',
    goldenMeanEssence: '올바른 목적을 위하여 마땅한 때에 고결하게 행동함',
    practicalAction: '두려움을 억누르지 말고 객관적으로 평가하되 신념을 지키기 위해 담대히 전진하십시오.',
  },
  {
    stageLevel: 2,
    virtueNameGreek: 'Sophrosyne (절제)',
    virtueNameKo: '욕망과 쾌락을 이성적으로 다스리는 절제의 중용',
    deficiencyExtreme: '무감각(Anaisthesia): 삶의 자연스러운 기쁨과 활력을 외면함',
    excessExtreme: '방종(Akolasia): 즉각적인 쾌락과 유혹에 영혼을 넘겨줌',
    goldenMeanEssence: '생명의 활력을 잃지 않으면서도 품위와 절도를 지키는 조화',
    practicalAction: '순간의 충동적 보상에 흔들리지 않고 장기적 목표와 영혼의 평정에 기여하는 선택에 머무십시오.',
  },
  {
    stageLevel: 3,
    virtueNameGreek: 'Eleutheriotes (자유와 관용)',
    virtueNameKo: '재화와 자원을 지혜롭게 나누고 베푸는 관용의 중용',
    deficiencyExtreme: '인색(Anelytheria): 지나치게 아끼고 움켜쥐며 나눔을 두려워함',
    excessExtreme: '낭비(Asotia): 목적 없이 자원을 허비하여 자립을 해침',
    goldenMeanEssence: '가치 있는 곳에 적절한 분량으로 기쁘게 베풀어 공동체를 풍요롭게 함',
    practicalAction: '과도한 소유욕을 비우고 함께하는 이들에게 관대한 지원을 아끼지 마십시오.',
  },
  {
    stageLevel: 4,
    virtueNameGreek: 'Praotes (온유와 침착)',
    virtueNameKo: '모욕이나 도발 앞에서 중심을 지키는 온유의 중용',
    deficiencyExtreme: '무기력(Aorgesia): 부당한 처사에도 정의로운 분노를 표출하지 못함',
    excessExtreme: '격노(Orgylotes): 사소한 자극에도 폭발하여 이성을 잃음',
    goldenMeanEssence: '정의로운 뜻을 품되 내면의 평정과 품격을 단호하게 유지함',
    practicalAction: '감정에 휩쓸려 즉각 맞대응하지 말고 잠시 숨을 고른 뒤 명확하고 차분한 어조로 진실을 밝히십시오.',
  },
  {
    stageLevel: 5,
    virtueNameGreek: 'Dikaiosyne (정의)',
    virtueNameKo: '각자에게 마땅한 몫을 분배하고 균형을 세우는 정의의 완성',
    deficiencyExtreme: '불의를 감내함: 마땅한 권리를 포기하고 억울함을 묵과함',
    excessExtreme: '불의를 저지름: 자신의 이익을 위해 타인의 몫을 침탈함',
    goldenMeanEssence: '비례적 비중과 공평무사한 기준에 따라 조화로운 질서를 확립함',
    practicalAction: '치우치지 않는 객관적 시선으로 상황을 조망하고 상생할 수 있는 공정한 룰을 제시하십시오.',
  },
];

const MESOTES_WISDOMS = [
  {
    themeKo: '중용(Mesotes) - 양극단을 벗어난 지혜의 정점',
    greekClassic: 'He d arete hexis proairetike, en mesoteti ousa te pros hemas',
    coreEssence: '덕은 우리에게 적합한 중용에 위치하는 선택적 품성 상태이며, 실천적 이성에 의해 규정됩니다.',
    actionableDirective: '극단적인 판단이나 조급한 비약을 경계하고 양측의 입장을 아우르는 최선의 중심점을 잡으십시오.',
  },
  {
    themeKo: '에우다이모니아(Eudaimonia) - 온전한 영혼의 꽃피움',
    greekClassic: 'Psyches energeia tis kat areten teleian',
    coreEssence: '진정한 행복은 정체된 상태가 아니라 완벽한 덕에 따라 영혼의 탁월함을 활발히 실천하는 과정입니다.',
    actionableDirective: '수동적인 위안에 안주하지 말고 자신의 재능과 덕성을 실질적인 창조와 기여로 발현하십시오.',
  },
  {
    themeKo: '프로네시스(Phronesis) - 삶을 밝히는 실천적 지혜',
    greekClassic: 'Hexis alethes meta logou praktike peri ta anthropo agatha kai kaka',
    coreEssence: '인간에게 무엇이 좋고 나쁜지에 관하여 참된 이성에 따라 행동하는 탁월한 분별력이 프로네시스입니다.',
    actionableDirective: '단순한 이론적 지식에 머물지 말고 지금 당면한 구체적 현실 속에서 가장 지혜로운 한 걸음을 내딛으십시오.',
  },
  {
    themeKo: '아레테(Aretē) - 지속적인 습관이 만드는 탁월성',
    greekClassic: 'Ouk ara physei oute para physin enginontai hai aretai, alla pephykosi men hemin dexasthai autas',
    coreEssence: '우리가 반복해서 행하는 것이 곧 우리 자신이 됩니다. 탁월함은 일회적 행동이 아니라 습관화된 품성입니다.',
    actionableDirective: '매일 반복하는 작은 일상적 선택들을 정갈하게 갈고닦아 자연스럽게 몸에 밴 품격으로 승화시키십시오.',
  },
];

function getKstComponents(now: Date): { hour: number; month: number; isoKst: string } {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  return {
    hour: kstDate.getUTCHours(),
    month: kstDate.getUTCMonth() + 1,
    isoKst: kstDate.toISOString().replace('Z', '+09:00'),
  };
}

function analyzeSituationalMesotes(question: string | undefined, activeStage: AristotleVirtueStage): SituationalMesotes {
  const q = (question ?? '').trim();
  if (/불안|조급|빨리|초조|무기력|포기|귀찮|미루/.test(q)) {
    return {
      imbalanceAxis: '실행 속도와 두려움의 양극단(만용 ↔ 비겁)',
      ethicsCitation: '《니코마코스 윤리학》 제3권 6~9장 (Andreia)',
      deficiencyTrap: '실패의 두려움 때문에 마땅히 내딛어야 할 한 걸음조차 미루고 회피하는 결핍',
      excessTrap: '준비나 검증 없이 조급한 결과만 좇아 무리수를 두는 과도함',
      goldenMeanPivot: '오늘 감당할 수 있는 정확한 분량의 실행 계획을 세우고, 그 범위 안에서만 흔들림 없이 움직이십시오.',
    };
  }
  if (/관계|화|분노|짜증|참다|억울|배신|부탁|거절/.test(q)) {
    return {
      imbalanceAxis: '감정 표현과 경계 설정의 양극단(격노 ↔ 무기력)',
      ethicsCitation: '《니코마코스 윤리학》 제4권 5장 (Praotes) · 제5권 (Dikaiosyne)',
      deficiencyTrap: '좋은 게 좋은 것이라는 생각에 부당한 요구까지 묵묵히 삼키며 스스로를 소진하는 결핍',
      excessTrap: '서운함이 폭발해 상대의 맥락을 듣지 않고 날 선 말로 관계를 끊어버리는 과도함',
      goldenMeanPivot: '마땅히 화내야 할 대상에게, 마땅한 정도만큼, 마땅한 때와 방식으로 분명한 경계를 전달하십시오.',
    };
  }
  if (/돈|소비|투자|욕심|성공|일|워라밸|완벽|지쳐/.test(q)) {
    return {
      imbalanceAxis: '욕구 조절과 자원 배분의 양극단(방종/과잉 ↔ 인색/결핍)',
      ethicsCitation: '《니코마코스 윤리학》 제2권 6장 · 제4권 1장 (Sophrosyne & Eleutheriotes)',
      deficiencyTrap: '필요한 휴식과 자기 투자마저 아끼며 삶을 메마르게 만드는 과도한 절약·억압',
      excessTrap: '즉각적 만족이나 과도한 완벽주의에 매달려 장기적 체력과 자원을 고갈시키는 과잉',
      goldenMeanPivot: '나의 텔로스(궁극 목적)에 기여하는 필수 영역에는 아낌없이 투자하고, 허영과 낭비는 단호히 덜어내십시오.',
    };
  }

  return {
    imbalanceAxis: `${activeStage.virtueNameGreek} 균형 축`,
    ethicsCitation: '《니코마코스 윤리학》 제2권 6장 · 제6권 5장 (Mesotes & Phronesis)',
    deficiencyTrap: activeStage.deficiencyExtreme,
    excessTrap: activeStage.excessExtreme,
    goldenMeanPivot: activeStage.practicalAction,
  };
}

function buildTemporalPhronesisRhythm(hour: number, month: number, phronesisScore: number): TemporalPhronesisRhythm {
  let kstPhaseLabel = '';
  let phaseBonus = 0;
  let hexisHabitGuidance = '';

  if (hour >= 5 && hour < 10) {
    kstPhaseLabel = '텔로스 아침 정렬기 (05~10시)';
    phaseBonus = 7;
    hexisHabitGuidance = '오늘 하루 영혼이 지향할 최선의 목적(Telos)을 한 줄로 정하고 첫 30분의 습관(Hexis)을 단정히 시작하십시오.';
  } else if (hour >= 10 && hour < 17) {
    kstPhaseLabel = '프로네시스 한낮 결단기 (10~17시)';
    phaseBonus = 6;
    hexisHabitGuidance = '구체적인 상황의 변수 속에서 과도함과 결핍을 실시간으로 조율하는 실천적 지혜(Phronesis)가 빛을 발하는 시간입니다.';
  } else if (hour >= 17 && hour < 22) {
    kstPhaseLabel = '에우다이모니아 저녁 조화기 (17~22시)';
    phaseBonus = 4;
    hexisHabitGuidance = '일의 긴장을 내려놓고 가족·동료와의 필리아(우애)와 절제된 휴식으로 삶의 균형을 회복하십시오.';
  } else {
    kstPhaseLabel = '아레테 심야 성찰기 (22~05시)';
    phaseBonus = 5;
    hexisHabitGuidance = '오늘 반복한 행동이 내 품성(Hexis)에 어떤 흔적을 남겼는지 고요히 점검하고 내일의 중용을 준비하십시오.';
  }

  let seasonContext = '겨울(Winter · 잠재태 응축기)';
  if (month >= 3 && month <= 5) seasonContext = '봄(Spring · 덕성 발아기)';
  else if (month >= 6 && month <= 8) seasonContext = '여름(Summer · 실행태 개화기)';
  else if (month >= 9 && month <= 11) seasonContext = '가을(Autumn · 중용 결실기)';

  return {
    kstPhaseLabel,
    seasonContext,
    phronesisReadiness: Math.min(99, Math.max(45, phronesisScore + phaseBonus)),
    hexisHabitGuidance,
  };
}

export function calculateAristotleMesotes(
  profile: UserProfile,
  question?: string,
  now: Date = new Date()
): AristotleMesotesResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'AristotleMesotesEudaimonia';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const mesotesGoldenMeanScore = 62 + (absHash % 37);
  const eudaimoniaFlourishingIndex = 60 + ((absHash >> 3) % 39);
  const phronesisPracticalWisdom = 58 + ((absHash >> 6) % 41);
  const telosPurposeOrientation = 63 + ((absHash >> 9) % 36);
  const areteExcellenceIntegrity = 57 + ((absHash >> 12) % 42);

  const stageIndex = (absHash >> 5) % ARISTOTLE_VIRTUE_STAGES.length;
  const wisdomIndex = (absHash >> 8) % MESOTES_WISDOMS.length;

  const activeVirtueStage = ARISTOTLE_VIRTUE_STAGES[stageIndex];
  const primaryMesotesWisdom = MESOTES_WISDOMS[wisdomIndex];

  const { hour, month } = getKstComponents(now);
  const isoKst = formatAristotleKstTimestamp(now);
  const situationalMesotes = analyzeSituationalMesotes(question, activeVirtueStage);
  const temporalPhronesisRhythm = buildTemporalPhronesisRhythm(hour, month, phronesisPracticalWisdom);

  const goldenMeanStability = Math.round(mesotesGoldenMeanScore * 0.6 + eudaimoniaFlourishingIndex * 0.4);
  const phronesisActionability = Math.round(phronesisPracticalWisdom * 0.55 + temporalPhronesisRhythm.phronesisReadiness * 0.45);
  const habitualAreteMomentum = Math.round(areteExcellenceIntegrity * 0.55 + telosPurposeOrientation * 0.45);

  const maxAxis = Math.max(goldenMeanStability, phronesisActionability, habitualAreteMomentum);
  let dominantAxis = '중용 안정성 주도형';
  let meanCalibrationGuide = '감정과 판단의 균형감이 탄탄하므로, 이를 매일의 구체적 습관(Hexis)으로 고정시키는 데 집중하십시오.';
  if (maxAxis === phronesisActionability) {
    dominantAxis = '실천적 지혜(Phronesis) 주도형';
    meanCalibrationGuide = '상황 분별력이 뛰어나므로, 성급한 최적화를 경계하고 양극단 사이의 여유를 품는 데 주안점을 두십시오.';
  } else if (maxAxis === habitualAreteMomentum) {
    dominantAxis = '텔로스-아레테 습관 추진형';
    meanCalibrationGuide = '목표 지향성이 강하므로, 과도한 몰입으로 인한 소진을 피하고 적정 휴식의 중용을 함께 설계하십시오.';
  }

  const eudaimoniaBalanceMatrix: EudaimoniaBalanceMatrix = {
    goldenMeanStability,
    phronesisActionability,
    habitualAreteMomentum,
    dominantAxis,
    meanCalibrationGuide,
  };

  const counselTitle = `아리스토텔레스 중용의 미덕: ${activeVirtueStage.virtueNameGreek}`;
  const philosophicalGuidance =
    `현재 과제('${situationalMesotes.imbalanceAxis}')는 결핍이나 과도함이라는 양극단의 덫에 빠지지 않고 중용(Mesotes)의 황금 지점을 찾는 것이 핵심입니다. ` +
    `${activeVirtueStage.goldenMeanEssence}의 원칙을 기준으로 삼으십시오. ` +
    `${situationalMesotes.goldenMeanPivot} 프로네시스(실천적 지혜)를 발휘할 때 온전한 에우다이모니아(영혼의 번영)가 활짝 열립니다.`;

  const dailyPracticeRitual =
    `오늘의 헥시스(Hexis) 실천: '${activeVirtueStage.virtueNameGreek}'의 기준에 따라 ${activeVirtueStage.practicalAction} (${temporalPhronesisRhythm.kstPhaseLabel})`;
  const reflectiveQuestion =
    `지금 내 마음과 선택은 '${situationalMesotes.deficiencyTrap}'과 '${situationalMesotes.excessTrap}' 중 어느 극단에 더 기울어 있으며, 마땅한 때와 정도를 지키는 중용(Mesotes)은 무엇입니까?`;
  const interpretiveBoundary =
    '아리스토텔레스의 중용과 에우다이모니아 통찰은 길흉이나 점수를 단정하는 예언이 아니라, 구체적 상황에서 실천적 지혜(Phronesis)로 균형을 가늠하기 위한 철학적 성찰 도구입니다.';

  const trimmedQ = (question ?? '').trim();
  const aristotleCrossAxis = `${activeVirtueStage.virtueNameGreek} × ${eudaimoniaBalanceMatrix.dominantAxis} · ${temporalPhronesisRhythm.kstPhaseLabel.split('(')[0].trim()}`;
  const aristotleShadowWarning = `결핍(${situationalMesotes.deficiencyTrap})과 과도(${situationalMesotes.excessTrap}) 어느 쪽에도 치우치지 않도록 프로네시스 분별을 유지하십시오.`;
  const aristotleSynthesisMatrix = {
    dominantTension: `${situationalMesotes.imbalanceAxis} (${situationalMesotes.deficiencyTrap} ↔ ${situationalMesotes.excessTrap})`,
    alignmentState: `${activeVirtueStage.virtueNameGreek} · ${eudaimoniaBalanceMatrix.dominantAxis}`,
    integratedAction: `${situationalMesotes.goldenMeanPivot}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: ARISTOTLE_MESOTES_VERSION,
    calculatedAtKst: isoKst,
    mesotesGoldenMeanScore,
    eudaimoniaFlourishingIndex,
    phronesisPracticalWisdom,
    telosPurposeOrientation,
    areteExcellenceIntegrity,
    activeVirtueStage,
    primaryMesotesWisdom,
    eudaimoniaPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    situationalMesotes,
    temporalPhronesisRhythm,
    eudaimoniaBalanceMatrix,
    dailyPracticeRitual,
    reflectiveQuestion,
    ritualAction: dailyPracticeRitual,
    reflectionFocus: reflectiveQuestion,
    interpretiveBoundary,
    aristotleCrossAxis,
    aristotleShadowWarning,
    aristotleSynthesisMatrix,
  };
}

function describeAristotleStage(score: number): string {
  if (score >= 82) return '깊고 흔들림 없는 중용의 성숙기';
  if (score >= 70) return '균형과 분별이 자리 잡은 안정기';
  return '양극단을 조율하며 습관을 다지는 연마기';
}

export function formatAristotleMesotesPrompt(res: AristotleMesotesResult): string {
  const matrixLine = res.aristotleSynthesisMatrix
    ? `- 중용 교차 매트릭스: 핵심 긴장(${res.aristotleSynthesisMatrix.dominantTension}) · 조율 상태(${res.aristotleSynthesisMatrix.alignmentState}) · 통합 실천(${res.aristotleSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【고대 그리스 아리스토텔레스 니코마코스 윤리학 중용(Mesotes) & 에우다이모니아 성찰 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 중용·번영 결: 중용 황금률(${describeAristotleStage(res.mesotesGoldenMeanScore)}) · 에우다이모니아(${describeAristotleStage(res.eudaimoniaFlourishingIndex)}) · 프로네시스(${describeAristotleStage(res.phronesisPracticalWisdom)})`,
    `- 목적·품격 결: 텔로스 지향(${describeAristotleStage(res.telosPurposeOrientation)}) · 아레테 품격(${describeAristotleStage(res.areteExcellenceIntegrity)})`,
    `- 현재 중용 조율 덕목: ${res.activeVirtueStage.virtueNameGreek} (${res.activeVirtueStage.virtueNameKo})`,
    `- 질문 맥락 불균형 축(${res.situationalMesotes.ethicsCitation}): ${res.situationalMesotes.imbalanceAxis}`,
    `  · 결핍 함정: ${res.situationalMesotes.deficiencyTrap} ↔ 과도 함정: ${res.situationalMesotes.excessTrap}`,
    `  · 중용 전환점: ${res.situationalMesotes.goldenMeanPivot}`,
    `- KST 시공간 리듬: ${res.temporalPhronesisRhythm.kstPhaseLabel} · ${res.temporalPhronesisRhythm.seasonContext} (${describeAristotleStage(res.temporalPhronesisRhythm.phronesisReadiness)})`,
    `- 헥시스(습관) 지침: ${res.temporalPhronesisRhythm.hexisHabitGuidance}`,
    `- 에우다이모니아 밸런스 매트릭스: ${res.eudaimoniaBalanceMatrix.dominantAxis} — 안정(${describeAristotleStage(res.eudaimoniaBalanceMatrix.goldenMeanStability)}) · 실행(${describeAristotleStage(res.eudaimoniaBalanceMatrix.phronesisActionability)}) · 습관(${describeAristotleStage(res.eudaimoniaBalanceMatrix.habitualAreteMomentum)})`,
    `- 조율 가이드: ${res.eudaimoniaBalanceMatrix.meanCalibrationGuide}`,
    `- 윤리학 핵심 지침: "${res.primaryMesotesWisdom.themeKo}" [${res.primaryMesotesWisdom.greekClassic}]`,
    `- 철학적 처방: ${res.eudaimoniaPhilosophicalCounsel.philosophicalGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 핵심 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 중용 교차 축: ${res.aristotleCrossAxis}`,
    `- 양극단 경계: ${res.aristotleShadowWarning}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
