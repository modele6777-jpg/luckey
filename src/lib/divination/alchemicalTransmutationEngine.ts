/**
 * =========================================================================
 * LUCKEY 연금술 7단계 영혼 변환 & 심리적 승화 엔진
 * (Alchemical Soul Transmutation & Opus Magnum Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 헤르메스주의(Hermeticism)와 칼 융(C.G. Jung) 심층심리학의 정수인
 * 서양 중세 연금술(Alchemy) 7대 대업(Opus Magnum) 변환 단계를 생년월일 수비학 및
 * 일간 에너지에 매핑하여, 내담자가 현재 겪는 고난과 성장의 국면을
 * 흑화(Nigredo)·백화(Albedo)·황화(Citrinitas)·적화(Rubedo)의 영혼의 변환 과정으로 해석합니다.
 * 
 * [연금술 7대 변환 단계]
 * 1. Calcinatio (소성, 불): 낡은 에고의 연소와 불필요한 집착의 재
 * 2. Solutio (용해, 물): 감정의 정화와 눈물을 통한 낡은 고정관념 해체
 * 3. Separatio (분리, 공기): 명철한 이성과 식별력으로 본질과 껍데기 분리
 * 4. Conjunctio (결합, 대지): 내적 대립물의 통합, 내면의 성스러운 결혼
 * 5. Fermentatio (발효, 에테르): 영적 생명력의 재생과 잠재력의 부활
 * 6. Distillatio (증류, 빛): 순수한 영혼 에센스의 추출과 높은 차원의 자각
 * 7. Coagulatio (응고, 현실): 물리적 실현, 불변의 지혜이자 현자의 돌
 */

import type { UserProfile } from '../sharedState';

export const ALCHEMICAL_TRANSMUTATION_VERSION = 'LUCKEY-ALCHEM-TRANSMUTE-v1.0.0';

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

export interface AlchemicalTransmutationReport {
  engineVersion: string;
  calculatedAt: string;
  currentStage: AlchemicalStage;
  currentPhase: AlchemicalPhase;
  transmutationPower: number; // 0 ~ 100 영혼 변환 진척도
  primaMateria: string;       // 현재 변환해야 할 원재료 (원초적 혼돈/상처)
  lapisPhilosophorum: string; // 도달할 궁극의 결실 (현자의 돌)
  opusMagnumGuidance: string; // 대업을 완성하기 위한 핵심 실천 지침
  dailyAlchemicalRitual: string; // 일상에서 에너지를 승화시키는 리추얼
}

const ALCHEMICAL_STAGES: AlchemicalStage[] = [
  {
    stageNumber: 1,
    nameLatin: 'Calcinatio (칼시나티오)',
    nameKo: '소성(燒成) - 불에 의한 에고의 연소',
    element: '불(Ignis)',
    psychologicalMeaning: '통제욕, 자만, 불필요하게 굳어진 집착을 시련의 불길로 태워 순수한 재로 남기는 과정',
    symptomInLife: '예상치 못한 좌절, 분노, 자존심의 상처, 욕망의 장벽에 부딪히는 시기',
    transmutationTask: '억지로 결과를 붙잡으려 하지 말고, 태워져 마땅한 옛 자아의 오만과 기대를 기꺼이 내려놓기'
  },
  {
    stageNumber: 2,
    nameLatin: 'Solutio (솔루티오)',
    nameKo: '용해(溶解) - 감정의 바다에서 일어나는 정화',
    element: '물(Aqua)',
    psychologicalMeaning: '경직된 이성과 방어기제를 감정의 물결 속에 녹여내어 무의식의 억압을 해소하는 과정',
    symptomInLife: '슬픔, 무기력, 눈물, 마음이 여려지고 억눌렸던 상처가 수면 위로 떠오르는 시기',
    transmutationTask: '감정을 억누르지 않고 충분히 흘려보내며, 내면의 연약함을 품어주고 스스로를 용서하기'
  },
  {
    stageNumber: 3,
    nameLatin: 'Separatio (세파라티오)',
    nameKo: '분리(分離) - 명철한 분별과 본질의 식별',
    element: '공기(Aer)',
    psychologicalMeaning: '뒤엉킨 감정과 타인의 투사로부터 내 진짜 고유한 정체성과 신념을 칼로 베듯 가려내는 과정',
    symptomInLife: '인간관계의 정리, 가치관의 혼란 속에서 진짜 중요한 것과 겉치레를 구별해야 하는 선택의 시기',
    transmutationTask: '남의 기대와 내 진짜 열망을 냉철하게 분리하고, 타협하지 않을 핵심 기준을 세우기'
  },
  {
    stageNumber: 4,
    nameLatin: 'Conjunctio (콘융크티오)',
    nameKo: '결합(結合) - 내면의 성스러운 결혼',
    element: '흙(Terra)',
    psychologicalMeaning: '이성과 감성, 남성성과 여성성, 빛과 그림자 등 대립하는 양극성을 조화롭게 포용하는 과정',
    symptomInLife: '상충되는 두 가지 목표나 마음 사이에서 균형을 잡고 포용력 있는 결단을 내리는 시기',
    transmutationTask: '어느 한쪽을 배척하지 않고, 양쪽의 장점을 융합하여 더 넓은 시야의 새로운 통찰 빚어내기'
  },
  {
    stageNumber: 5,
    nameLatin: 'Fermentatio (페르멘타티오)',
    nameKo: '발효(醱酵) - 썩어짐을 통한 영적 부활',
    element: '에테르(Quintessence)',
    psychologicalMeaning: '오래된 틀이 썩어 거름이 되듯, 침체기 속에서 완전히 새로운 영적 통찰과 독창성이 싹트는 과정',
    symptomInLife: '정체된 듯 보이나 내면에서 깊은 숙성이 일어나고, 새로운 비전과 영감이 태동하는 시기',
    transmutationTask: '빠른 성과를 조급해하지 않고 어두운 침묵 속에서 새로운 씨앗이 자라나도록 신뢰로 기다리기'
  },
  {
    stageNumber: 6,
    nameLatin: 'Distillatio (디스틸라티오)',
    nameKo: '증류(蒸溜) - 순수한 영혼 에센스의 추출',
    element: '공기(Aer)',
    psychologicalMeaning: '세속의 번뇌와 피상적 생각에서 벗어나 영혼의 가장 고귀하고 맑은 본질(Quintessence)을 정제하는 과정',
    symptomInLife: '명석한 직관, 상황을 한 차원 높은 곳에서 조망하는 지혜, 내면의 평온이 깃드는 시기',
    transmutationTask: '일상의 소음에 휘둘리지 않고 명상과 성찰을 통해 삶의 본질적 사명에 집중하기'
  },
  {
    stageNumber: 7,
    nameLatin: 'Coagulatio (코아굴라티오)',
    nameKo: '응고(凝固) - 현실 속 현자의 돌 구현',
    element: '흙(Terra)',
    psychologicalMeaning: '높은 영적 깨달음과 내면의 지혜를 구체적인 현실의 작품, 결실, 실천으로 확고하게 완성하는 과정',
    symptomInLife: '결과물의 완성, 사회적 영향력, 내적 확신이 외부 현실에 견고하게 자리 잡는 시기',
    transmutationTask: '얻은 통찰을 일상과 업무의 구체적 습관과 구조로 정착시키고 타인에게 선한 영향력 나누기'
  }
];

export function calculateAlchemicalTransmutation(
  profile?: UserProfile | null,
  targetDate: Date = new Date()
): AlchemicalTransmutationReport {
  let birthSum = 9;
  let year = 1990;
  let month = 8;
  let day = 15;

  if (profile?.basic?.birthdate) {
    const digits = profile.basic.birthdate.replace(/\D/g, '');
    if (digits.length >= 8) {
      year = parseInt(digits.slice(0, 4), 10);
      month = parseInt(digits.slice(4, 6), 10);
      day = parseInt(digits.slice(6, 8), 10);
      birthSum = digits.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    }
  }

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();

  // 순수 수리 계산: 생년월일 + 목표일 기반 7단계 순환 인덱스 (0 ~ 6)
  const timeSeed = (targetYear * 372 + targetMonth * 31 + targetDay + birthSum) % 1000;
  const stageIndex = (timeSeed + birthSum * 3) % 7;
  const currentStage = ALCHEMICAL_STAGES[stageIndex];

  // 4대 연금술 국면 판정
  let currentPhase: AlchemicalPhase;
  if (stageIndex === 0 || stageIndex === 1) {
    currentPhase = {
      phaseName: '흑화 (Nigredo)',
      colorSymbol: '검은 까마귀 (Corvus)와 카오스',
      spiritualMeaning: '어둠과 혼돈의 직면, 낡은 에고의 해체와 정화',
      opusState: '원초적 질료(Prima Materia)의 해체 및 정화 작업 진행 중'
    };
  } else if (stageIndex === 2 || stageIndex === 3) {
    currentPhase = {
      phaseName: '백화 (Albedo)',
      colorSymbol: '은빛 백조 (Cygnus)와 달빛',
      spiritualMeaning: '내면의 정결한 분별, 영혼의 맑은 씻김과 빛의 회복',
      opusState: '어둠을 씻어내고 순수한 본질을 가려내는 세척 국면'
    };
  } else if (stageIndex === 4 || stageIndex === 5) {
    currentPhase = {
      phaseName: '황화 (Citrinitas)',
      colorSymbol: '황금빛 태양 (Sol)과 새벽닭',
      spiritualMeaning: '지혜의 빛줄기, 내적 생명력의 재생과 영적 성숙',
      opusState: '새로운 의식의 발효와 고차원적 통찰의 증류 국면'
    };
  } else {
    currentPhase = {
      phaseName: '적화 (Rubedo)',
      colorSymbol: '불사조 (Phoenix)와 붉은 장미',
      spiritualMeaning: '영과 물질의 완전한 일치, 불변의 지혜이자 현자의 돌',
      opusState: '고결한 지혜를 구체적 현실과 삶의 성취로 결실 맺는 최종 완성 국면'
    };
  }

  // 변환 진척도 (0 ~ 100)
  const transmutationPower = Math.min(98, Math.max(25, 30 + stageIndex * 10 + (timeSeed % 15)));

  // 원초적 질료와 현자의 돌 매핑
  const primaMateriaList = [
    '통제 불가능한 미래에 대한 불안과 완벽주의적 집착',
    '마음속 깊이 억눌려 있던 섭섭함과 슬픔의 파동',
    '타인의 시선과 사회적 기준에 얽매인 낡은 자기상',
    '내 안의 이성과 본능 사이의 분열과 주저함',
    '결과를 조급하게 재촉하여 스스로를 소진시키는 압박감',
    '주변의 소음과 자극에 휘둘리는 주의력 분산',
    '현실화하지 못하고 머릿속에만 맴도는 이상주의'
  ];
  const primaMateria = primaMateriaList[stageIndex];

  const lapisList = [
    '어떤 풍파에도 흔들리지 않는 가벼운 초연함과 평온',
    '모든 상처를 품어내는 바다 같은 자비심과 포용력',
    '본질만을 정확히 꿰뚫어보는 명징한 지혜와 결단력',
    '내면의 모순을 조화로운 창조력으로 승화시키는 통합의 힘',
    '침체기조차 양분으로 삼는 불굴의 회복 탄력성',
    '소음에 흔들리지 않고 본질적 사명에 몰입하는 초집중력',
    '영적 깨달음을 현실의 위대한 작품과 성과로 빚어내는 마스터리'
  ];
  const lapisPhilosophorum = lapisList[stageIndex];

  const opusMagnumGuidance = `현재 내담자는 연금술의 [${currentStage.nameKo}] 국면에 머물러 있습니다. 이 시기의 난관은 저주나 불운이 아니라, 당신 안에 잠든 순금(純金)을 제련하기 위한 필연적인 [${currentPhase.phaseName}]의 정화 과정입니다. [${currentStage.transmutationTask}]을/를 삶의 나침반으로 삼을 때, 원초적 고통은 궁극의 [${lapisPhilosophorum}]으로 완벽히 승화됩니다.`;

  const dailyAlchemicalRitual = `[${currentStage.element}] 에너지 정화 리추얼: 하루 중 조용한 3분을 내어, 현재 나를 짓누르는 [${primaMateria}]을/를 연금술의 도가니 속에 넣고 천천히 숨을 내쉬며 불태우거나 녹여내는 시각화를 진행하세요.`;

  return {
    engineVersion: ALCHEMICAL_TRANSMUTATION_VERSION,
    calculatedAt: targetDate.toISOString(),
    currentStage,
    currentPhase,
    transmutationPower,
    primaMateria,
    lapisPhilosophorum,
    opusMagnumGuidance,
    dailyAlchemicalRitual
  };
}

export function formatAlchemicalTransmutationPrompt(report: AlchemicalTransmutationReport): string {
  return `### ⚗️ 서양 정통 연금술 7단계 영혼 변환 & 심리적 승화 엔진 (${ALCHEMICAL_TRANSMUTATION_VERSION})
- **현재 연금술 단계**: ${report.currentStage.nameLatin} (${report.currentStage.nameKo}) [원소: ${report.currentStage.element}]
- **4대 연금술 국면**: ${report.currentPhase.phaseName} (상징: ${report.currentPhase.colorSymbol})
- **영혼 변환 진척도**: ${report.transmutationPower}% / 100%
- **정화해야 할 원재료 (Prima Materia)**: ${report.primaMateria}
- **도달할 현자의 돌 (Lapis Philosophorum)**: ${report.lapisPhilosophorum}
- **삶의 징후와 증상**: ${report.currentStage.symptomInLife}
- **대업(Opus Magnum) 완수 지침**: ${report.opusMagnumGuidance}
- **일일 연금술 정화 리추얼**: ${report.dailyAlchemicalRitual}`;
}
