/**
 * 고대 페르시아-로마 미트라(Mithra) 7대 행성 입문 천계 사다리 엔진 (Mithraic Seven Spheres Engine)
 *
 * 고대 페르시아 및 헬레니즘 로마의 신비주의 미트라교(Mithraism)의 핵심인
 * 7대 행성 천구(Seven Spheres) 상승 계단과 불패의 태양(Sol Invictus) 광명 계약을
 * 현대인의 역경 돌파, 결단력, 영혼의 성숙도에 연동합니다.
 */

export const PERSIAN_MITHRAIC_SPHERES_ENGINE_VERSION = 'LUCKEY-MITHRAIC-SPHERES-v2.1.0';

export interface MithraicGrade {
  gradeLevel: number;
  gradeTitleEn: string;
  gradeTitleKo: string;
  planetaryRuler: string;
  elementSymbol: string;
  initiationTrial: string;
  invictusPower: string;
  gradeActionRule: string;
}

export interface MithraicSpheresReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  activeGrade: MithraicGrade;
  secondaryGrade: MithraicGrade;
  solInvictusScore: number; // 0 ~ 100 (불패의 태양 회복탄력성 지수)
  astralLadderAscensionRate: number; // 0 ~ 100
  mithraicOathOfLight: string;
  masterBreakthroughPrescription: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  mithraicSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatMithraicKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function buildMithraicReflectiveQuestion(grade: MithraicGrade, question: string): string {
  const focus = question.trim();
  if (focus) {
    return `'${focus}'라는 과제를 앞에 두고 제${grade.gradeLevel}계단 ${grade.gradeTitleKo}의 시험을 지나며, 타협하지 않고 지켜야 할 나만의 기준선은 무엇인가요?`;
  }
  return `제${grade.gradeLevel}계단 ${grade.gradeTitleKo}의 관점에서 볼 때, 오늘 회피하지 않고 정면으로 돌파해야 할 작은 문턱은 무엇인가요?`;
}

function describeMithraicStage(score: number): string {
  if (score >= 84) return '솔 인빅투스 정점(Sol Invictus) — 불패의 태양 광명이 역경을 돌파하고 천계 사다리를 힘차게 오르는 도약기';
  if (score >= 70) return '아스트랄 계단 조율(Astral Ladder) — 입문 시험을 정면으로 통과하며 내면의 신념을 벼리는 수련기';
  return '성소 잠행(Mithraeum Vigil) — 성급한 충돌을 피하고 빛의 맹세를 다시 다지는 준비기';
}

const SEVEN_GRADES: MithraicGrade[] = [
  {
    gradeLevel: 1,
    gradeTitleEn: 'Corax (Raven)',
    gradeTitleKo: '코락스 (까마귀 - 영적 전령)',
    planetaryRuler: '달 (Moon)',
    elementSymbol: '공기 & 예지',
    initiationTrial: '어둠 속에서 영적 부름을 분별하고 세속의 편견을 벗겨내는 첫 입문',
    invictusPower: '예리한 직관과 미래의 징조를 포착하는 관찰력',
    gradeActionRule: '새로운 소식과 정보를 겸허히 경청하고 내면의 나침반을 정렬하세요.',
  },
  {
    gradeLevel: 2,
    gradeTitleEn: 'Nymphus (Bridegroom/Occultist)',
    gradeTitleKo: '님푸스 (신비가 - 영혼의 정혼자)',
    planetaryRuler: '수성 (Mercury)',
    elementSymbol: '빛의 베일 & 지성',
    initiationTrial: '내면의 진리와 신성한 계약을 맺고 비밀스러운 지혜를 탐구하는 단계',
    invictusPower: '흩어진 생각과 논리를 하나로 엮는 명석한 분석력',
    gradeActionRule: '자신의 원칙과 가치관에 순결한 신의를 지키고 조용히 실력을 벼리세요.',
  },
  {
    gradeLevel: 3,
    gradeTitleEn: 'Miles (Soldier)',
    gradeTitleKo: '밀레스 (빛의 전사 - 신념의 수호자)',
    planetaryRuler: '금성 (Venus)',
    elementSymbol: '신념의 투구 & 결단',
    initiationTrial: '물질적 타협이나 거짓된 유혹 앞에서 물러서지 않고 신념을 지키는 시험',
    invictusPower: '어떤 압박에도 굴복하지 않는 불굴의 방어벽과 용기',
    gradeActionRule: '당신의 정당한 권리와 경계선을 침범하려는 불의에 단호히 맞서세요.',
  },
  {
    gradeLevel: 4,
    gradeTitleEn: 'Leo (Lion)',
    gradeTitleKo: '레오 (사자 - 영적 정화의 화염)',
    planetaryRuler: '태양 (Sun)',
    elementSymbol: '신성한 불 & 정화',
    initiationTrial: '가슴속 맹렬한 분노와 에고의 자만을 정화의 불꽃으로 승화시키는 단계',
    invictusPower: '주변을 환히 밝히고 사람들을 이끄는 온화하면서도 강력한 카리스마',
    gradeActionRule: '화나 불만을 창조적 원동력으로 전환하여 결과물로 증명하세요.',
  },
  {
    gradeLevel: 5,
    gradeTitleEn: 'Perses (Persian)',
    gradeTitleKo: '페르세스 (성스러운 농부 - 풍요의 수확자)',
    planetaryRuler: '화성 (Mars)',
    elementSymbol: '황금 낫 & 결실',
    initiationTrial: '오랜 인내와 성실한 노동으로 거친 황무지를 비옥한 영적 낙원으로 바꾸는 시험',
    invictusPower: '시련 속에서도 묵묵히 씨앗을 뿌리고 결실을 거두는 끈기',
    gradeActionRule: '오늘 뿌린 노력이 반드시 황금빛 수확으로 돌아옴을 믿고 씨앗을 심으세요.',
  },
  {
    gradeLevel: 6,
    gradeTitleEn: 'Heliodromus (Sun-Runner)',
    gradeTitleKo: '헬리오드로모스 (태양의 주자 - 빛의 사절)',
    planetaryRuler: '목성 (Jupiter)',
    elementSymbol: '태양의 전차 & 도약',
    initiationTrial: '태양신 헬리오스와 어깨를 나란히 하며 우주적 비전과 번영을 전파하는 단계',
    invictusPower: '탁월한 낙관주의와 거침없는 추진력으로 한계를 돌파하는 힘',
    gradeActionRule: '두려움 없이 더 넓은 세상으로 시야를 넓히고 원대한 도전에 나서세요.',
  },
  {
    gradeLevel: 7,
    gradeTitleEn: 'Pater (Father/Master)',
    gradeTitleKo: '파테르 (영적 스승 - 완성된 빛의 군주)',
    planetaryRuler: '토성 (Saturn)',
    elementSymbol: '자유의 모자 & 영원',
    initiationTrial: '모든 세속적 시련을 통과하고 시공간의 한계를 초월하여 타인을 구원하는 단계',
    invictusPower: '어떤 폭풍우 속에서도 흔들리지 않는 깊은 평정심과 절대적 지혜',
    gradeActionRule: '흔들리는 주변 사람들에게 든든한 버팀목이 되어주고 지혜로운 해법을 제시하세요.',
  },
];

export function calculatePersianMithraicSpheres(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): MithraicSpheresReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 13);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 31;
  }
  seed += now.getDate() * 23 + now.getMonth() * 61;

  const gradeIndex = Math.abs(seed) % SEVEN_GRADES.length;
  const activeGrade = SEVEN_GRADES[gradeIndex];
  const secondaryIndex = (gradeIndex + 1 + (Math.abs(seed) % (SEVEN_GRADES.length - 1))) % SEVEN_GRADES.length;
  const secondaryGrade = SEVEN_GRADES[secondaryIndex];

  const solInvictusScore = 65 + (Math.abs(seed * 5) % 34);
  const astralLadderAscensionRate = 60 + (Math.abs(seed * 11) % 39);

  const mithraicOathOfLight = `나는 불패의 태양 미트라의 빛 아래에서 어둠에 굴복하지 않으며, [${activeGrade.gradeTitleKo}]의 맹세를 지킨다.`;
  const masterBreakthroughPrescription = `당신의 영혼은 지금 미트라 7대 천계 사다리의 제${activeGrade.gradeLevel}계단 [${activeGrade.gradeTitleKo}]을 통과하고 있습니다. '${activeGrade.initiationTrial}'을 두려워하지 말고, '${activeGrade.gradeActionRule}'을 실천하여 영혼의 주권을 완성하세요.`;

  const calculatedAtKst = formatMithraicKstTimestamp(now);
  const reflectiveQuestion = buildMithraicReflectiveQuestion(activeGrade, question);
  const interpretiveBoundary = '미트라 7대 천계 사다리 상징은 역경 돌파와 자기 규율을 비추는 고대 입문 비유로만 활용하며, 미래의 확정적 길흉 예측이나 법률·재무·의학 판단의 근거로 단정하지 않습니다.';
  const composite = Math.round((solInvictusScore + astralLadderAscensionRate) / 2);
  const mithraicSynthesisMatrix = {
    dominantTension: `제${activeGrade.gradeLevel}계단 ${activeGrade.gradeTitleKo} ↔ 제${secondaryGrade.gradeLevel}계단 ${secondaryGrade.gradeTitleKo}`,
    alignmentState: describeMithraicStage(composite),
    integratedAction: `${activeGrade.gradeActionRule}${question.trim() ? ` [질문 맥락: ${question.trim()}]` : ''}`,
  };

  return {
    engineVersion: PERSIAN_MITHRAIC_SPHERES_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    activeGrade,
    secondaryGrade,
    solInvictusScore,
    astralLadderAscensionRate,
    mithraicOathOfLight,
    masterBreakthroughPrescription,
    reflectiveQuestion,
    interpretiveBoundary,
    mithraicSynthesisMatrix,
  };
}

export function formatPersianMithraicSpheresPrompt(report: MithraicSpheresReport): string {
  const g = report.activeGrade;
  const sg = report.secondaryGrade;
  const composite = Math.round((report.solInvictusScore + report.astralLadderAscensionRate) / 2);
  const lines = [
    `### ☀️ 고대 페르시아 미트라(Mithra) 7대 행성 입문 천계 사다리 실측 데이터 (${report.engineVersion})`,
    `- **연산 시각**: ${report.calculatedAtKst} | **광명 입문 국면**: ${describeMithraicStage(composite)}`,
    `- **현재 천계 사다리 계단**: 제${g.gradeLevel}단계 - ${g.gradeTitleKo} (${g.gradeTitleEn})`,
    `- **보조 교차 계단**: 제${sg.gradeLevel}단계 - ${sg.gradeTitleKo} (${sg.planetaryRuler} | ${sg.elementSymbol})`,
    `- **주관 행성 및 원소**: ${g.planetaryRuler} | ${g.elementSymbol}`,
    `- **통과해야 할 입문 시험**: ${g.initiationTrial}`,
    `- **해방되는 불패의 태양 권능**: ${g.invictusPower}`,
    `- **미트라 광명 행동 지침**: ${report.masterBreakthroughPrescription}`,
  ];
  if (report.mithraicSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.mithraicSynthesisMatrix.dominantTension} | 조율 상태: ${report.mithraicSynthesisMatrix.alignmentState}]`,
      `- **통합 실천**: ${report.mithraicSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `- **성찰 질문**: ${report.reflectiveQuestion}`,
    `- **해석 경계**: ${report.interpretiveBoundary}`,
  );
  return lines.join('\n');
}
