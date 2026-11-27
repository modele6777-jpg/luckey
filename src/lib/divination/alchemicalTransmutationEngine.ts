/**
 * =========================================================================
 * LUCKEY 연금술 7단계 영혼 변환 & 심리적 승화 엔진 (v2.0.0)
 * (Alchemical Soul Transmutation & Opus Magnum Engine)
 * =========================================================================
 *
 * [학술적 배경]
 * 헤르메스주의(Hermeticism) 《에메랄드 태블릿(Tabula Smaragdina)》과 칼 융(C.G. Jung)
 * 심층심리학 《심리학과 연금술》·《신비의 결합(Mysterium Coniunctionis)》의 정수인
 * 서양 중세 연금술 7대 대업(Opus Magnum) 변환 단계를 생년월일·질문 맥락·KST 시공간 리듬에
 * 매핑하여, 흑화(Nigredo)·백화(Albedo)·황화(Citrinitas)·적화(Rubedo)의
 * 정성적·시공간적 영혼 변환 감사를 수행합니다.
 */

import type { UserProfile } from '../sharedState';

export const ALCHEMICAL_TRANSMUTATION_VERSION = 'LUCKEY-ALCHEM-TRANSMUTE-v2.5.0';

export type AlchemicalQuestionFocus = 'career' | 'relationship' | 'anxiety' | 'change' | 'spiritual';

export interface AlchemicalStage {
  stageNumber: number;
  nameLatin: string;
  nameKo: string;
  element: '불(Ignis)' | '물(Aqua)' | '공기(Aer)' | '흙(Terra)' | '에테르(Quintessence)';
  psychologicalMeaning: string;
  symptomInLife: string;
  transmutationTask: string;
}

export interface AlchemicalPhase {
  phaseName: '흑화 (Nigredo)' | '백화 (Albedo)' | '황화 (Citrinitas)' | '적화 (Rubedo)';
  colorSymbol: string;
  spiritualMeaning: string;
  opusState: string;
}

export interface SituationalAlchemicalAudit {
  focus: AlchemicalQuestionFocus;
  hermeticQuote: string;
  crucibleDiagnosis: string;
  shadowProjectionWarning: string;
  innerAlchemyPractice: string;
}

export interface TemporalOpusRhythm {
  kstHour: number;
  alchemicalHourWindow: string;
  seasonalElement: string;
  crucibleHeatState: string;
  timingGuidance: string;
}

export interface OpusSynthesisMatrix {
  primaMateriaClarity: string;
  elementalEquilibrium: string;
  coagulatioReadiness: string;
  synthesizedVerdict: string;
  alchemyCrossAxis: string;
}

export interface AlchemicalTransmutationReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionFocus: AlchemicalQuestionFocus;
  currentStage: AlchemicalStage;
  currentPhase: AlchemicalPhase;
  transmutationPower: number; // 0 ~ 100 내부 계산용 진척 지표
  primaMateria: string;
  lapisPhilosophorum: string;
  situationalAlchemicalAudit: SituationalAlchemicalAudit;
  temporalOpusRhythm: TemporalOpusRhythm;
  opusSynthesisMatrix: OpusSynthesisMatrix;
  opusMagnumGuidance: string;
  dailyAlchemicalRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const ALCHEMICAL_STAGES: AlchemicalStage[] = [
  {
    stageNumber: 1,
    nameLatin: 'Calcinatio (칼시나티오)',
    nameKo: '소성(燒成) - 불에 의한 에고의 연소',
    element: '불(Ignis)',
    psychologicalMeaning: '통제욕, 자만, 불필요하게 굳어진 집착을 시련의 불길로 태워 순수한 재로 남기는 과정',
    symptomInLife: '예상치 못한 좌절, 분노, 자존심의 상처, 욕망의 장벽에 부딪히는 시기',
    transmutationTask: '억지로 결과를 붙잡으려 하지 말고, 태워져 마땅한 옛 자아의 오만과 기대를 기꺼이 내려놓기',
  },
  {
    stageNumber: 2,
    nameLatin: 'Solutio (솔루티오)',
    nameKo: '용해(溶解) - 감정의 바다에서 일어나는 정화',
    element: '물(Aqua)',
    psychologicalMeaning: '경직된 이성과 방어기제를 감정의 물결 속에 녹여내어 무의식의 억압을 해소하는 과정',
    symptomInLife: '슬픔, 무기력, 눈물, 마음이 여려지고 억눌렸던 상처가 수면 위로 떠오르는 시기',
    transmutationTask: '감정을 억누르지 않고 충분히 흘려보내며, 내면의 연약함을 품어주고 스스로를 용서하기',
  },
  {
    stageNumber: 3,
    nameLatin: 'Separatio (세파라티오)',
    nameKo: '분리(分離) - 명철한 분별과 본질의 식별',
    element: '공기(Aer)',
    psychologicalMeaning: '뒤엉킨 감정과 타인의 투사로부터 내 진짜 고유한 정체성과 신념을 칼로 베듯 가려내는 과정',
    symptomInLife: '인간관계의 정리, 가치관의 혼란 속에서 진짜 중요한 것과 겉치레를 구별해야 하는 선택의 시기',
    transmutationTask: '남의 기대와 내 진짜 열망을 냉철하게 분리하고, 타협하지 않을 핵심 기준을 세우기',
  },
  {
    stageNumber: 4,
    nameLatin: 'Conjunctio (콘융크티오)',
    nameKo: '결합(結合) - 내면의 성스러운 결혼',
    element: '흙(Terra)',
    psychologicalMeaning: '이성과 감성, 남성성과 여성성, 빛과 그림자 등 대립하는 양극성을 조화롭게 포용하는 과정',
    symptomInLife: '상충되는 두 가지 목표나 마음 사이에서 균형을 잡고 포용력 있는 결단을 내리는 시기',
    transmutationTask: '어느 한쪽을 배척하지 않고, 양쪽의 장점을 융합하여 더 넓은 시야의 새로운 통찰 빚어내기',
  },
  {
    stageNumber: 5,
    nameLatin: 'Fermentatio (페르멘타티오)',
    nameKo: '발효(醱酵) - 썩어짐을 통한 영적 부활',
    element: '에테르(Quintessence)',
    psychologicalMeaning: '오래된 틀이 썩어 거름이 되듯, 침체기 속에서 완전히 새로운 영적 통찰과 독창성이 싹트는 과정',
    symptomInLife: '정체된 듯 보이나 내면에서 깊은 숙성이 일어나고, 새로운 비전과 영감이 태동하는 시기',
    transmutationTask: '빠른 성과를 조급해하지 않고 어두운 침묵 속에서 새로운 씨앗이 자라나도록 신뢰로 기다리기',
  },
  {
    stageNumber: 6,
    nameLatin: 'Distillatio (디스틸라티오)',
    nameKo: '증류(蒸溜) - 순수한 영혼 에센스의 추출',
    element: '공기(Aer)',
    psychologicalMeaning: '세속의 번뇌와 피상적 생각에서 벗어나 영혼의 가장 고귀하고 맑은 본질(Quintessence)을 정제하는 과정',
    symptomInLife: '명석한 직관, 상황을 한 차원 높은 곳에서 조망하는 지혜, 내면의 평온이 깃드는 시기',
    transmutationTask: '일상의 소음에 휘둘리지 않고 명상과 성찰을 통해 삶의 본질적 사명에 집중하기',
  },
  {
    stageNumber: 7,
    nameLatin: 'Coagulatio (코아굴라티오)',
    nameKo: '응고(凝固) - 현실 속 현자의 돌 구현',
    element: '흙(Terra)',
    psychologicalMeaning: '높은 영적 깨달음과 내면의 지혜를 구체적인 현실의 작품, 결실, 실천으로 확고하게 완성하는 과정',
    symptomInLife: '결과물의 완성, 사회적 영향력, 내적 확신이 외부 현실에 견고하게 자리 잡는 시기',
    transmutationTask: '얻은 통찰을 일상과 업무의 구체적 습관과 구조로 정착시키고 타인에게 선한 영향력 나누기',
  },
];

function detectAlchemicalFocus(question: string): AlchemicalQuestionFocus {
  const q = question.toLowerCase();
  if (/연애|결혼|사람|관계|친구|가족|이별|갈등|상처/.test(q)) return 'relationship';
  if (/일|직장|사업|돈|재물|취업|이직|승진|성공|시험|프로젝트/.test(q)) return 'career';
  if (/불안|걱정|두려|초조|스트레스|우울|눈물|힘들|지침/.test(q)) return 'anxiety';
  if (/변화|선택|결정|방향|새로|시작|이사|전환|고민/.test(q)) return 'change';
  return 'spiritual';
}

function buildSituationalAlchemicalAudit(
  focus: AlchemicalQuestionFocus,
  stage: AlchemicalStage,
  phase: AlchemicalPhase
): SituationalAlchemicalAudit {
  switch (focus) {
    case 'career':
      return {
        focus,
        hermeticQuote: '《에메랄드 태블릿》 — "위에서와 같이 아래에서도 그러하며, 내면의 도가니가 맑아질 때 외면의 황금도 굳어진다."',
        crucibleDiagnosis: `일과 성취의 문제는 단순한 외부 성과가 아니라 ${stage.nameKo}의 제련 과정입니다. 불필요한 과욕을 태우고 본질적 역량을 정제할 때입니다.`,
        shadowProjectionWarning: '결과가 늦어진다고 도가니의 불을 억지로 높이면 원석(Prima Materia)이 타버립니다. 겉치레 목표와 진짜 소명을 구분하세요.',
        innerAlchemyPractice: '오늘 할 일 중 남의 시선 때문에 붙잡고 있던 허울 하나를 덜어내고, 가장 본질적인 한 가지 작업에만 온전히 불을 지피세요.',
      };
    case 'relationship':
      return {
        focus,
        hermeticQuote: '칼 융 《신비의 결합》 — "타인에게서 나를 괴롭히는 모든 것은 내 안의 무의식을 비추는 거울이며, 결합(Conjunctio)은 그 거울을 껴안는 데서 시작된다."',
        crucibleDiagnosis: `관계의 마찰은 ${phase.phaseName} 국면에서 서로 다른 두 원소가 부딪히며 불순물을 드러내는 현상입니다.`,
        shadowProjectionWarning: '상대에게 내 안의 두려움이나 결핍을 투사(Projection)해 원망하고 있지는 않은지 점검해야 합니다.',
        innerAlchemyPractice: '상대의 말 뒤에 숨은 감정을 단정 짓기 전에, 내 마음속에서 먼저 출렁인 상처의 기원을 조용히 분리(Separatio)해 바라보세요.',
      };
    case 'anxiety':
      return {
        focus,
        hermeticQuote: '바실리우스 발렌티누스 — "대지의 어두운 뱃속을 방문하라(V.I.T.R.I.O.L.). 정화함으로써 너는 숨겨진 돌을 발견하리라."',
        crucibleDiagnosis: `지금 느끼는 불안은 실패의 징조가 아니라, 낡은 보호막이 녹아내리는 ${stage.nameKo}의 필수 통과 의례입니다.`,
        shadowProjectionWarning: '어두운 흑화(Nigredo)의 밤을 억지로 지우려 들면 내면의 정화가 미완으로 남습니다. 불안을 적으로 삼지 마세요.',
        innerAlchemyPractice: '불안의 원인을 머리로 통제하려 애쓰기보다, 가슴에 손을 얹고 지금 느껴지는 감정의 온도와 무게만 3분간 그대로 지켜보세요.',
      };
    case 'change':
      return {
        focus,
        hermeticQuote: '《로사리움 필로소포룸》 — "부패(Putrefactio) 없이는 어떠한 새로운 탄생도 이루어질 수 없다."',
        crucibleDiagnosis: `갈림길의 망설임은 ${stage.nameKo}에서 낡은 형태를 해체하고 새로운 형상으로 응고(Coagulatio)되기 직전의 전환점입니다.`,
        shadowProjectionWarning: '과거의 익숙한 안전지대에 미련을 두면 새로운 에센스가 증류되지 못합니다.',
        innerAlchemyPractice: '이미 수명을 다한 옛 방식 한 가지를 종이에 적어 접어 두고, 오늘 내딛을 가장 작지만 돌이킬 수 없는 한 걸음을 정하세요.',
      };
    case 'spiritual':
    default:
      return {
        focus: 'spiritual',
        hermeticQuote: '《에메랄드 태블릿》 — "땅과 불을 가르고, 거친 것으로부터 섬세한 것을 부드럽고 지극한 지혜로 분리하라."',
        crucibleDiagnosis: `내면의 물음은 ${phase.phaseName} 국면을 통과하며 순수한 제5원소(Quintessence)를 추출하는 영적 성숙의 신호입니다.`,
        shadowProjectionWarning: '깨달음이나 평온을 외부의 극적인 사건에서 찾으려 하면 일상의 도가니를 놓치기 쉽습니다.',
        innerAlchemyPractice: '하루 5분 침묵 속에서 오늘 내 마음에 일어난 가장 거친 감정 하나를 맑은 물로 씻어내는 관조를 이어가세요.',
      };
  }
}

function buildTemporalOpusRhythm(targetDate: Date, stage: AlchemicalStage): TemporalOpusRhythm {
  const kstDate = new Date(targetDate.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;

  let alchemicalHourWindow = '루나 침묵의 자정 도가니 (22:00~05:59)';
  let crucibleHeatState = '은은한 약불(Balneum Mariae, 중탕) — 내면 숙성과 무의식 용해에 적합한 시간';
  let timingGuidance = '외부 결정을 서두르기보다 감정의 찌꺼기를 가라앉히고 꿈과 직관의 신호를 기록하세요.';

  if (kstHour >= 6 && kstHour < 11) {
    alchemicalHourWindow = '오로라 여명의 백화 시간 (06:00~10:59)';
    crucibleHeatState = '맑은 증류(Distillatio)의 불길 — 잡념이 걷히고 본질이 선명해지는 시간';
    timingGuidance = '하루의 핵심 기준을 분리(Separatio)해 세우고 가장 중요한 작업에 손을 대기 좋습니다.';
  } else if (kstHour >= 11 && kstHour < 17) {
    alchemicalHourWindow = '솔 태양의 정오 응고 시간 (11:00~16:59)';
    crucibleHeatState = '왕성한 소성(Calcinatio)과 응고(Coagulatio) — 실행과 현실 구현의 화력';
    timingGuidance = '망설이던 일을 현실의 형태와 행동으로 굳혀 내기에 가장 힘찬 시간대입니다.';
  } else if (kstHour >= 17 && kstHour < 22) {
    alchemicalHourWindow = '황혼의 결합(Conjunctio) 시간 (17:00~21:59)';
    crucibleHeatState = '조화로운 황화(Citrinitas)의 열기 — 낮의 경험과 밤의 성찰이 만나는 시간';
    timingGuidance = '타인과의 대화에서 대립을 부드럽게 통합하고 하루의 긴장을 풀어내세요.';
  }

  let seasonalElement = '대지(Terra) — 수렴과 응고의 계절 리듬';
  if (kstMonth >= 3 && kstMonth <= 5) {
    seasonalElement = '공기(Aer) — 발아와 분별, 새로운 시야가 열리는 봄의 리듬';
  } else if (kstMonth >= 6 && kstMonth <= 8) {
    seasonalElement = '불(Ignis) — 열정적 제련과 낡은 집착을 태우는 여름의 리듬';
  } else if (kstMonth >= 9 && kstMonth <= 11) {
    seasonalElement = '물(Aqua) — 성숙한 정화와 본질의 증류가 깊어지는 가을의 리듬';
  }

  return {
    kstHour,
    alchemicalHourWindow,
    seasonalElement,
    crucibleHeatState: `${crucibleHeatState} (현재 주원소 ${stage.element} 공명)`,
    timingGuidance,
  };
}

export function calculateAlchemicalTransmutation(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question: string = ''
): AlchemicalTransmutationReport {
  let birthSum = 9;

  if (profile?.basic?.birthdate) {
    const digits = profile.basic.birthdate.replace(/\D/g, '');
    if (digits.length >= 8) {
      birthSum = digits.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    }
  }

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();

  const timeSeed = (targetYear * 372 + targetMonth * 31 + targetDay + birthSum) % 1000;
  const stageIndex = (timeSeed + birthSum * 3) % 7;
  const currentStage = ALCHEMICAL_STAGES[stageIndex];

  let currentPhase: AlchemicalPhase;
  if (stageIndex === 0 || stageIndex === 1) {
    currentPhase = {
      phaseName: '흑화 (Nigredo)',
      colorSymbol: '검은 까마귀 (Corvus)와 카오스',
      spiritualMeaning: '어둠과 혼돈의 직면, 낡은 에고의 해체와 정화',
      opusState: '원초적 질료(Prima Materia)의 해체 및 정화 작업 진행 중',
    };
  } else if (stageIndex === 2 || stageIndex === 3) {
    currentPhase = {
      phaseName: '백화 (Albedo)',
      colorSymbol: '은빛 백조 (Cygnus)와 달빛',
      spiritualMeaning: '내면의 정결한 분별, 영혼의 맑은 씻김과 빛의 회복',
      opusState: '어둠을 씻어내고 순수한 본질을 가려내는 세척 국면',
    };
  } else if (stageIndex === 4 || stageIndex === 5) {
    currentPhase = {
      phaseName: '황화 (Citrinitas)',
      colorSymbol: '황금빛 태양 (Sol)과 새벽닭',
      spiritualMeaning: '지혜의 빛줄기, 내적 생명력의 재생과 영적 성숙',
      opusState: '새로운 의식의 발효와 고차원적 통찰의 증류 국면',
    };
  } else {
    currentPhase = {
      phaseName: '적화 (Rubedo)',
      colorSymbol: '불사조 (Phoenix)와 붉은 장미',
      spiritualMeaning: '영과 물질의 완전한 일치, 불변의 지혜이자 현자의 돌',
      opusState: '고결한 지혜를 구체적 현실과 삶의 성취로 결실 맺는 최종 완성 국면',
    };
  }

  const transmutationPower = Math.min(98, Math.max(25, 30 + stageIndex * 10 + (timeSeed % 15)));

  const primaMateriaList = [
    '통제 불가능한 미래에 대한 불안과 완벽주의적 집착',
    '마음속 깊이 억눌려 있던 섭섭함과 슬픔의 파동',
    '타인의 시선과 사회적 기준에 얽매인 낡은 자기상',
    '내 안의 이성과 본능 사이의 분열과 주저함',
    '결과를 조급하게 재촉하여 스스로를 소진시키는 압박감',
    '주변의 소음과 자극에 휘둘리는 주의력 분산',
    '현실화하지 못하고 머릿속에만 맴도는 이상주의',
  ];
  const primaMateria = primaMateriaList[stageIndex];

  const lapisList = [
    '어떤 풍파에도 흔들리지 않는 가벼운 초연함과 평온',
    '모든 상처를 품어내는 바다 같은 자비심과 포용력',
    '본질만을 정확히 꿰뚫어보는 명징한 지혜와 결단력',
    '내면의 모순을 조화로운 창조력으로 승화시키는 통합의 힘',
    '침체기조차 양분으로 삼는 불굴의 회복 탄력성',
    '소음에 흔들리지 않고 본질적 사명에 몰입하는 초집중력',
    '영적 깨달음을 현실의 위대한 작품과 성과로 빚어내는 마스터리',
  ];
  const lapisPhilosophorum = lapisList[stageIndex];

  const questionFocus = detectAlchemicalFocus(question);
  const situationalAlchemicalAudit = buildSituationalAlchemicalAudit(questionFocus, currentStage, currentPhase);
  const temporalOpusRhythm = buildTemporalOpusRhythm(targetDate, currentStage);

  const alchemyCrossAxis = `[${currentStage.nameKo}] × [${currentPhase.phaseName}] × [${currentStage.element}] × [${questionFocus}]`;
  const opusSynthesisMatrix: OpusSynthesisMatrix = {
    primaMateriaClarity: `현재 도가니의 원재료는 [${primaMateria}]이며, ${currentPhase.phaseName}의 정화 과정을 거치고 있습니다.`,
    elementalEquilibrium: `${currentStage.element} 원소와 ${temporalOpusRhythm.seasonalElement}가 교차하며 내면의 불균형을 조율합니다.`,
    coagulatioReadiness: stageIndex >= 4
      ? '내적 통찰이 충분히 숙성되어 현실의 구체적 행동과 결실로 굳어질 수 있는 상태입니다.'
      : '성급한 현실화보다 낡은 집착을 녹이고 본질을 가려내는 내면 정련이 우선되는 상태입니다.',
    synthesizedVerdict: `${currentStage.nameKo}와 ${temporalOpusRhythm.alchemicalHourWindow}이 맞물려, [${currentStage.transmutationTask}]을 실행할 때 현자의 돌(${lapisPhilosophorum})로 나아갑니다.`,
    alchemyCrossAxis,
  };

  const opusMagnumGuidance = `현재 내담자는 연금술의 [${currentStage.nameKo}] 국면에 머물러 있습니다. 이 시기의 난관은 저주나 불운이 아니라, 당신 안에 잠든 순금(純金)을 제련하기 위한 필연적인 [${currentPhase.phaseName}]의 정화 과정입니다. [${currentStage.transmutationTask}]을/를 삶의 나침반으로 삼을 때, 원초적 고통은 궁극의 [${lapisPhilosophorum}]으로 완벽히 승화됩니다.`;

  const dailyAlchemicalRitual = `[${currentStage.element}] 에너지 정화 리추얼: 하루 중 조용한 3분을 내어, 현재 나를 짓누르는 [${primaMateria}]을/를 연금술의 도가니 속에 넣고 천천히 숨을 내쉬며 불태우거나 녹여내는 시각화를 진행하세요.`;
  const ritualAction = situationalAlchemicalAudit.innerAlchemyPractice;
  const reflectionFocus = `지금의 [${currentStage.nameKo}] 국면에서 "${currentStage.transmutationTask}"를 오늘 내 하루의 한 행동으로 옮긴다면 무엇이 가장 먼저 달라질까요?`;
  const qLabel = question.trim() ? `"${question.trim()}"에 대해 ` : '';
  const reflectiveQuestion = `${qLabel}${reflectionFocus}`;

  const kst = new Date(targetDate.getTime() + 9 * 3600 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;

  return {
    engineVersion: ALCHEMICAL_TRANSMUTATION_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    questionFocus,
    currentStage,
    currentPhase,
    transmutationPower,
    primaMateria,
    lapisPhilosophorum,
    situationalAlchemicalAudit,
    temporalOpusRhythm,
    opusSynthesisMatrix,
    opusMagnumGuidance,
    dailyAlchemicalRitual,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary: '본 리포트는 서양 연금술 7단계와 융 심층심리학 상징에 기반한 정성적 성찰 안내이며, 의학적·재정적 처방이 아닙니다.',
  };
}

export function formatAlchemicalTransmutationPrompt(report: AlchemicalTransmutationReport): string {
  return `### ⚗️ 서양 정통 연금술 7단계 영혼 변환 & 심리적 승화 엔진 (${ALCHEMICAL_TRANSMUTATION_VERSION})
- **연산 시각**: ${report.calculatedAtKst}
- **현재 연금술 단계**: ${report.currentStage.nameLatin} (${report.currentStage.nameKo}) [원소: ${report.currentStage.element}]
- **4대 연금술 국면**: ${report.currentPhase.phaseName} (상징: ${report.currentPhase.colorSymbol} · ${report.currentPhase.opusState})
- **정화할 원재료 (Prima Materia)**: ${report.primaMateria}
- **도달할 현자의 돌 (Lapis Philosophorum)**: ${report.lapisPhilosophorum}
- **질문 맥락 연금술 감사 (${report.situationalAlchemicalAudit.focus})**:
  - 원전 통찰: ${report.situationalAlchemicalAudit.hermeticQuote}
  - 도가니 진단: ${report.situationalAlchemicalAudit.crucibleDiagnosis}
  - 투사 주의: ${report.situationalAlchemicalAudit.shadowProjectionWarning}
  - 내면 연금 실천: ${report.situationalAlchemicalAudit.innerAlchemyPractice}
- **KST 시공간 도가니 리듬 (${report.temporalOpusRhythm.alchemicalHourWindow})**:
  - 화후 상태: ${report.temporalOpusRhythm.crucibleHeatState}
  - 계절 원소: ${report.temporalOpusRhythm.seasonalElement}
  - 시의성 지침: ${report.temporalOpusRhythm.timingGuidance}
- **연금술 교차 매트릭스**: ${report.opusSynthesisMatrix.synthesizedVerdict} (${report.opusSynthesisMatrix.coagulatioReadiness}) · 4중 교차 축(${report.opusSynthesisMatrix.alchemyCrossAxis})
- **대업(Opus Magnum) 완수 지침**: ${report.opusMagnumGuidance}
- **일일 연금술 정화 리추얼**: ${report.dailyAlchemicalRitual}
- **실천 의례**: ${report.ritualAction}
- **성찰 초점**: ${report.reflectionFocus}
- **성찰 질문**: ${report.reflectiveQuestion}
- **해석 경계**: 본 리포트는 서양 연금술 7단계와 융 심층심리학 상징에 기반한 정성적 성찰 안내이며, 의학적·재정적 처방이 아닙니다.`;
}
