/**
 * Ancient Chinese Baopuzi Ge Hong Nine Turn Elixir Engine (v2.0.0)
 * 고대 동양 도교 포박자(抱朴子) 갈홍 내편 구전환단(九轉還丹) 무병장수 선도 엔진
 *
 * 갈홍 《포박자》 내편 〈금단〉·〈지리〉·〈양생〉 원전을 기반으로
 * 질문 맥락 감사, KST 12시진 화후(火候) 리듬, 정기신(精氣神) 교차 매트릭스를 수행합니다.
 */

import type { UserProfile } from '../sharedState';

export const BAOPUZI_ELIXIRS_ENGINE_VERSION = 'LUCKEY-BAOPUZI-ELIXIRS-v2.3.0';

export type BaopuziQuestionFocus = 'health' | 'career' | 'relationship' | 'decision' | 'spiritual';

export interface BaopuziElixirsParams {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}

export interface SituationalBaopuziAudit {
  focus: BaopuziQuestionFocus;
  baopuziVerse: string;
  jingQiShenDiagnosis: string;
  burnoutWarning: string;
  elixirNurturingStep: string;
}

export interface TemporalElixirRhythm {
  kstHour: number;
  shichenWindow: string;
  fireIntensityPhase: string;
  seasonalOrganFocus: string;
  cultivationTimingAdvice: string;
}

export interface BaopuziSynthesisMatrix {
  vitalityStateLabel: string;
  fireControlBalance: string;
  immunityFoundation: string;
  synthesizedGuidance: string;
}

export interface BaopuziElixirsReport {
  engineVersion: string;
  calculatedAtKst: string;
  questionFocus: BaopuziQuestionFocus;
  vitalityPreservationScore: number; // 내부 계산 지표
  alchemicalRefinementLevel: number; // 1-9 구전환단 화후(火候) 연마 단계
  longevityImmunityIndex: number; // 내부 계산 지표
  activeElixirPhase: {
    elixirRank: number;
    elixirNameKo: string;
    elixirNameZh: string;
    transformativePower: string;
    nourishingPractice: string;
  };
  situationalBaopuziAudit: SituationalBaopuziAudit;
  temporalElixirRhythm: TemporalElixirRhythm;
  baopuziSynthesisMatrix: BaopuziSynthesisMatrix;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  geHongTaoistAdvice: string;
}

const NINE_ELIXIRS = [
  {
    elixirRank: 1,
    elixirNameKo: '단화환단 (丹華還丹)',
    elixirNameZh: 'Danhua Huandan',
    transformativePower: '탁한 체액을 정화하고 오장육부의 기초 열기를 점화함',
    nourishingPractice: '아침 기상 직후 따뜻한 미온수를 천천히 세 모금 마셔 장기를 깨우세요.',
  },
  {
    elixirRank: 2,
    elixirNameKo: '금액환단 (金液還丹)',
    elixirNameZh: 'Jinye Huandan',
    transformativePower: '골수를 윤택하게 하고 관절과 혈관의 유연성을 극대화함',
    nourishingPractice: '식사 시 최소 30회 이상 꼭꼭 씹어 침(옥액)을 자연스럽게 삼키세요.',
  },
  {
    elixirRank: 3,
    elixirNameKo: '신단환단 (神丹還丹)',
    elixirNameZh: 'Shendan Huandan',
    transformativePower: '잡념과 불면을 가라앉히고 신명(神明)의 총기를 맑게 함',
    nourishingPractice: '잠들기 전 5분간 양손을 비벼 따뜻하게 한 뒤 눈가를 가볍게 마사지하세요.',
  },
  {
    elixirRank: 4,
    elixirNameKo: '환단백호 (還丹白虎)',
    elixirNameZh: 'Huandan Baihu',
    transformativePower: '폐와 호흡기를 강화하여 외부 사기와 감기 바이러스를 방어함',
    nourishingPractice: '가슴을 활짝 펴고 맑은 공기를 깊이 들이마시는 4박자 복식 호흡을 하세요.',
  },
  {
    elixirRank: 5,
    elixirNameKo: '환단청룡 (還丹靑龍)',
    elixirNameZh: 'Huandan Qinglong',
    transformativePower: '간의 피로를 해소하고 분노의 열기를 시원하게 식힘',
    nourishingPractice: '초록빛 채소나 상큼한 감귤류를 섭취하고 10분간 눈을 감고 휴식하세요.',
  },
  {
    elixirRank: 6,
    elixirNameKo: '환단주작 (還丹朱雀)',
    elixirNameZh: 'Huandan Zhuque',
    transformativePower: '심장의 박동을 고르게 하고 전신의 혈액 순환을 촉진함',
    nourishingPractice: '계단을 가볍게 오르내리거나 빠른 걸음으로 전신 온도를 1도 올리세요.',
  },
  {
    elixirRank: 7,
    elixirNameKo: '환단현무 (還丹玄武)',
    elixirNameZh: 'Huandan Xuanwu',
    transformativePower: '신장의 정기를 굳건히 하여 만성 피로와 허리 냉증을 완치함',
    nourishingPractice: '발바닥 용천혈을 지그시 지압하고 허리를 따뜻하게 유지하세요.',
  },
  {
    elixirRank: 8,
    elixirNameKo: '환단황제 (還丹黃帝)',
    elixirNameZh: 'Huandan Huangdi',
    transformativePower: '비위의 소화 흡수력을 중앙 토(土) 기운으로 탄탄히 확립함',
    nourishingPractice: '과식을 삼가고 정해진 시간에 소박하고 정갈한 곡물 위주의 식사를 하세요.',
  },
  {
    elixirRank: 9,
    elixirNameKo: '태청환단 (太淸還丹)',
    elixirNameZh: 'Taiqing Huandan',
    transformativePower: '몸과 마음이 신선처럼 가벼워져 일체의 질병과 피로를 초월함',
    nourishingPractice: '타인과의 비교와 과도한 물질적 집착을 털어내고 소박한 만족을 선언하세요.',
  },
];

function detectBaopuziFocus(question: string): BaopuziQuestionFocus {
  const q = question.toLowerCase();
  if (/건강|피로|잠|수면|몸|아프|체력|스트레스|불면|소화/.test(q)) return 'health';
  if (/일|직장|사업|돈|재물|성취|시험|성과|승진/.test(q)) return 'career';
  if (/사람|관계|가족|연애|친구|갈등|화/.test(q)) return 'relationship';
  if (/선택|결정|방향|고민|시작|변화/.test(q)) return 'decision';
  return 'spiritual';
}

function buildSituationalBaopuziAudit(
  focus: BaopuziQuestionFocus,
  elixirNameKo: string
): SituationalBaopuziAudit {
  switch (focus) {
    case 'health':
      return {
        focus,
        baopuziVerse: '《포박자》 내편〈극언〉 — "사람은 자신의 몸을 지키는 근본을 소홀히 한 채 바깥의 헛된 영달만 쫓다가 기혈을 말린다."',
        jingQiShenDiagnosis: `현재 질문은 원기(精氣神)의 바닥을 채워야 할 신호입니다. ${elixirNameKo} 단계의 핵심은 소모된 진기를 안으로 거두어들이는 것입니다.`,
        burnoutWarning: '피곤한데도 카페인이나 억지 의지로 불을 더 지피면 단약의 솥이 갈라집니다(과화 손상).',
        elixirNurturingStep: '오늘 밤은 예정된 일정을 하나 줄이고, 따뜻한 물 한 잔과 30분 일찍 눕는 절제된 양생을 먼저 실행하세요.',
      };
    case 'career':
      return {
        focus,
        baopuziVerse: '《포박자》 내편〈지리〉 — "조급히 구전환단을 이루려 불을 세게 하면 재만 남고, 화후를 지키면 때가 되어 저절로 영단이 맺힌다."',
        jingQiShenDiagnosis: `일과 성취의 갈망이 크지만 ${elixirNameKo}의 이치는 과속이 아닌 꾸준한 화후(火候) 유지에 있습니다.`,
        burnoutWarning: '단기 성과에 매달려 수면과 식사를 거르면 장기전의 핵심 체력이 먼저 소진됩니다.',
        elixirNurturingStep: '업무 중 50분마다 일어나 어깨를 펴고 3회 깊은 복식호흡으로 머리의 열기를 아래 단전으로 내리세요.',
      };
    case 'relationship':
      return {
        focus,
        baopuziVerse: '《포박자》 내편〈도意〉 — "노여움은 간을 상하게 하고, 지나친 근심은 비위를 묶어 기운의 순환을 막는다."',
        jingQiShenDiagnosis: `관계의 긴장으로 심화(心火)가 들뜨기 쉬운 상태입니다. ${elixirNameKo}의 양생으로 내면의 수기를 먼저 보전하세요.`,
        burnoutWarning: '상대의 말에 즉각 반응해 감정을 쏟으면 내 정기가 밖으로 새어 나갑니다.',
        elixirNurturingStep: '답답한 감정이 올라올 때 즉답을 피하고, 찬물 대신 미온수를 천천히 마시며 혀끝을 입천장에 대고 호흡을 고르세요.',
      };
    case 'decision':
      return {
        focus,
        baopuziVerse: '《포박자》 내편〈석체〉 — "마음이 맑고 정기가 고요하면 천 리 밖의 이치도 거울처럼 비친다."',
        jingQiShenDiagnosis: `갈림길의 혼란은 몸의 피로와 잡념이 겹쳐 신명(神明)이 흐려졌기 때문입니다. ${elixirNameKo}의 정화가 판단력을 되살립니다.`,
        burnoutWarning: '지친 밤중에 내린 성급한 결단은 후회를 남기기 쉽습니다.',
        elixirNurturingStep: '결정을 내리기 전 10분간 눈을 감고 호흡을 고른 뒤, 몸이 가장 가볍고 편안해지는 선택지를 다시 살펴보세요.',
      };
    case 'spiritual':
    default:
      return {
        focus: 'spiritual',
        baopuziVerse: '《포박자》 내편〈창현〉 — "한 몸의 정기를 아끼고 태식(胎息)을 닦는 것이 곧 장생과 지혜의 문이다."',
        jingQiShenDiagnosis: `삶의 방향과 내면의 평온을 묻는 지금, ${elixirNameKo}의 수련은 일상의 작은 습관을 신선의 도리로 바꾸는 데 있습니다.`,
        burnoutWarning: '거창한 깨달음만 쫓다 오늘의 밥 한 끼, 숨 한 번을 소홀히 하지 마세요.',
        elixirNurturingStep: '하루 중 가장 조용한 5분을 택해 두 손을 단전에 포개고 들숨과 날숨이 부드럽게 이어지는 리듬을 느끼세요.',
      };
  }
}

function buildTemporalElixirRhythm(now: Date): TemporalElixirRhythm {
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  let shichenWindow = '해시·자시 정양 시간 (21:00~02:59)';
  let fireIntensityPhase = '문호(文火, 은은한 약불) — 정을 갈무리하고 골수와 신기를 보양하는 시진';
  let cultivationTimingAdvice = '과도한 사고와 자극을 멈추고 깊은 수면으로 내단(內丹)을 숙성시키세요.';

  if (kstHour >= 3 && kstHour < 9) {
    shichenWindow = '인시·묘시 청기 상승 시간 (03:00~08:59)';
    fireIntensityPhase = '활자시·진양(進陽) — 폐와 대장이 깨어나 맑은 기운을 받아들이는 시진';
    cultivationTimingAdvice = '따뜻한 물로 속을 데우고 가벼운 호흡과 스트레칭으로 하루의 원기를 점화하세요.';
  } else if (kstHour >= 9 && kstHour < 15) {
    shichenWindow = '사시·오시 양기 정점 시간 (09:00~14:59)';
    fireIntensityPhase = '무화(武火, 힘찬 불) — 비위와 심장이 활발히 움직여 기혈을 순환시키는 시진';
    cultivationTimingAdvice = '핵심 활동에 집중하되, 정오 직후 10분 눈을 감는 짧은 휴식으로 심열을 식히세요.';
  } else if (kstHour >= 15 && kstHour < 21) {
    shichenWindow = '신시·유시 수렴 보양 시간 (15:00~20:59)';
    fireIntensityPhase = '퇴음(退陰)과 수렴 — 신장이 기운을 저장하고 하루의 피로를 씻어내는 시진';
    cultivationTimingAdvice = '과식을 피하고 짠맛·자극을 줄여 저녁의 기혈이 편안히 가라앉도록 돕세요.';
  }

  let seasonalOrganFocus = '겨울 신장(水) 보양 — 정기를 깊이 갈무리하고 허리와 발을 따뜻하게 지키는 계절';
  if (kstMonth >= 3 && kstMonth <= 5) {
    seasonalOrganFocus = '봄 간목(木) 소통 — 겨우내 뭉친 기운을 풀고 시야와 호흡을 트는 계절';
  } else if (kstMonth >= 6 && kstMonth <= 8) {
    seasonalOrganFocus = '여름 심화(火) 조율 — 땀과 진액의 소모를 보충하고 심신의 열기를 다스리는 계절';
  } else if (kstMonth >= 9 && kstMonth <= 11) {
    seasonalOrganFocus = '가을 폐금(金) 윤택 — 건조함을 막고 호흡과 면역의 방어막을 세우는 계절';
  }

  return {
    kstHour,
    shichenWindow,
    fireIntensityPhase,
    seasonalOrganFocus,
    cultivationTimingAdvice,
  };
}

export function calculateBaopuziElixirs(params?: BaopuziElixirsParams): BaopuziElixirsReport {
  const profile = params?.profile;
  const question = params?.question || '';
  const now = params?.now || new Date();

  const bdate = profile?.basic?.birthdate || '1995-03-21';
  const btime = profile?.basic?.birthtime || '12:00';
  const seed = (bdate + btime).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const vitality = ((seed * 17 + 39) % 52) + 48;
  const rank = (seed % 9) + 1;
  const activeElixir = NINE_ELIXIRS[rank - 1];
  const immunity = ((seed * 29 + 63) % 55) + 45;

  const questionFocus = detectBaopuziFocus(question);
  const situationalBaopuziAudit = buildSituationalBaopuziAudit(questionFocus, activeElixir.elixirNameKo);
  const temporalElixirRhythm = buildTemporalElixirRhythm(now);

  const vitalityStateLabel =
    vitality >= 80
      ? '정기신(精氣神)이 고르게 충만하여 순환이 원활한 상태'
      : vitality >= 62
        ? '기초 원기는 유지되나 불규칙한 소모를 경계해야 하는 상태'
        : '원기가 지쳐 있어 즉각적인 휴식과 문호(약불) 보양이 필요한 상태';

  const baopuziSynthesisMatrix: BaopuziSynthesisMatrix = {
    vitalityStateLabel,
    fireControlBalance: `${rank}전 [${activeElixir.elixirNameKo}]의 수련 단계와 ${temporalElixirRhythm.shichenWindow}이 조응합니다.`,
    immunityFoundation: immunity >= 75 ? '외부 사기를 막아내는 위기(衛氣) 방어력이 단단한 편입니다.' : '무리한 일정을 줄이고 수면·보온으로 면역 기초를 다져야 합니다.',
    synthesizedGuidance: `${activeElixir.elixirNameKo}의 효능(${activeElixir.transformativePower})을 살리려면 ${temporalElixirRhythm.cultivationTimingAdvice}`,
  };

  const advices = [
    '포박자 갈홍의 잠언: "내 몸을 귀하게 여기지 않고 천하의 재물을 구하는 것은 깨진 항아리에 물을 붓는 것과 같다."',
    '포박자 갈홍의 잠언: "마음을 고요히 하고 호흡을 길게 가져가는 것, 그것이 만병을 물리치는 진짜 금단이다."',
    '포박자 갈홍의 잠언: "하루의 피로는 그날 밤 수면 속에서 완전히 녹여내야 내일의 금단이 맺힌다."',
  ];

  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const interpretiveBoundary = '본 리포트는 갈홍 《포박자》의 도교 양생 상징에 기반한 정성적 건강 성찰 안내이며, 의학적 진단이 아닙니다.';
  const ritualAction = situationalBaopuziAudit.elixirNurturingStep;
  const reflectionFocus = `${rank}전 [${activeElixir.elixirNameKo}]의 결에 비추어, 오늘 내 정기신(精氣神)을 불필요하게 소모시키는 과화(過火) 한 가지를 줄인다면 무엇을 먼저 멈출까요?`;
  const trimmedQ = question.trim();
  const reflectiveQuestion = trimmedQ
    ? `‘${trimmedQ}’라는 물음 속에서 ${rank}전 [${activeElixir.elixirNameKo}]의 화후(火候)를 지키기 위해, 오늘 가장 먼저 식히고 쉬어 갈 과화(過火) 한 가지는 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: BAOPUZI_ELIXIRS_ENGINE_VERSION,
    calculatedAtKst,
    questionFocus,
    vitalityPreservationScore: vitality,
    alchemicalRefinementLevel: rank,
    longevityImmunityIndex: immunity,
    activeElixirPhase: activeElixir,
    situationalBaopuziAudit,
    temporalElixirRhythm,
    baopuziSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
    geHongTaoistAdvice: advices[seed % advices.length],
  };
}

export function formatBaopuziElixirsPrompt(report: BaopuziElixirsReport): string {
  return `[고대 도교 포박자(抱朴子) 갈홍 구전환단(九轉還丹) 무병장수 정성 리포트 (${report.engineVersion})]
- 연산 시각: ${report.calculatedAtKst}
- 금단 연마 단계: ${report.alchemicalRefinementLevel}전 [${report.activeElixirPhase.elixirNameKo}] (${report.activeElixirPhase.elixirNameZh})
  * 효능: ${report.activeElixirPhase.transformativePower}
  * 생활 양생 실천: ${report.activeElixirPhase.nourishingPractice}
- 정기신(精氣神) 및 면역 상태: ${report.baopuziSynthesisMatrix.vitalityStateLabel} · ${report.baopuziSynthesisMatrix.immunityFoundation}
- 질문 맥락 포박자 감사 (${report.situationalBaopuziAudit.focus}):
  * 원전 구절: ${report.situationalBaopuziAudit.baopuziVerse}
  * 정기신 진단: ${report.situationalBaopuziAudit.jingQiShenDiagnosis}
  * 과화(과로) 주의: ${report.situationalBaopuziAudit.burnoutWarning}
  * 오늘의 보양 한 걸음: ${report.situationalBaopuziAudit.elixirNurturingStep}
- KST 시진 화후 리듬 (${report.temporalElixirRhythm.shichenWindow}):
  * 화후 국면: ${report.temporalElixirRhythm.fireIntensityPhase}
  * 계절 장부 초점: ${report.temporalElixirRhythm.seasonalOrganFocus}
  * 시의성 지침: ${report.temporalElixirRhythm.cultivationTimingAdvice}
- 포박자 갈홍의 훈계: ${report.geHongTaoistAdvice}
- 성찰 질문: ${report.reflectiveQuestion}
- 해석 경계: ${report.interpretiveBoundary}
- 루시 가이드: 수치 점수를 나열하지 말고, 피로나 스트레스로 지친 질문자에게 무리한 일정을 잠시 멈추고 내면의 정기(원기)를 충전하는 소박하고 실질적인 양생 처방을 따뜻하게 일러줘.`;
}
