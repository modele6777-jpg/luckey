/**
 * 길가메시 서사시 12관문 불멸 여정 엔진 (Epic of Gilgamesh Twelve Trials Engine)
 *
 * 고대 메소포타미아 수메르-바빌로니아 인류 최초의 서사시 길가메시(Gilgamesh)의
 * 12대 영웅적 통과의례 및 영혼 불멸 탐색 관문을 현대 심리 분석과 사주·운명학적 맥락에 연동합니다.
 */

export const SUMERIAN_GILGAMESH_TRIALS_ENGINE_VERSION = 'LUCKEY-GILGAMESH-TRIALS-v2.4.0';

export type GilgameshQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface GilgameshTrial {
  gateNumber: number;
  nameKo: string;
  nameAkkadian: string;
  archetypalTheme: string;
  egoShadowTrap: string;
  heroicBreakthroughAction: string;
  cosmicElement: '흙' | '불' | '물' | '바람' | '에테르';
}

export interface GilgameshTrialsReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  questionTopic: GilgameshQuestionTopic;
  immortalPhase: string;
  shadowWarning: string;
  activeTrial: GilgameshTrial;
  secondaryTrial: GilgameshTrial;
  heroicResilienceScore: number; // 0 ~ 100
  immortalityWisdomIndex: number; // 0 ~ 100 (필멸을 수용하고 영원한 레거시를 세우는 지혜)
  soulCompanionType: string; // 영혼의 거울 동반자 (엔키두 원형)
  legacyBuildingPrescription: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  gilgameshSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    gilgameshCrossAxis: string;
  };
}

function formatGilgameshKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

const TWELVE_TRIALS: GilgameshTrial[] = [
  {
    gateNumber: 1,
    nameKo: '엔키두와의 대등한 조우 (거울 자아의 수용)',
    nameAkkadian: 'Enkidu Mithurum',
    archetypalTheme: '나와 동등한 라이벌이자 영혼의 반쪽을 인정하고 교만을 내려놓는 단계',
    egoShadowTrap: '모든 것을 혼자 통제하려는 독선과 고립감',
    heroicBreakthroughAction: '상대의 뛰어난 점을 공개적으로 칭찬하고 대등한 파트너십을 체결하세요.',
    cosmicElement: '흙',
  },
  {
    gateNumber: 2,
    nameKo: '훔바바 삼나무 숲 원정 (원초적 공포 직면)',
    nameAkkadian: 'Qishtum Humbaba',
    archetypalTheme: '마음속 금기시된 미지의 영역으로 들어가 오랜 그림자 공포를 정복하는 단계',
    egoShadowTrap: '안전지대에 안주하며 미지의 도전을 기피하는 회피 성향',
    heroicBreakthroughAction: '가장 두려워하던 어려운 과제에 오늘 첫 도끼질을 시작하세요.',
    cosmicElement: '바람',
  },
  {
    gateNumber: 3,
    nameKo: '하늘의 황소 격파 (세속적 유혹과 허영 타파)',
    nameAkkadian: 'Alû Shamê',
    archetypalTheme: '맹목적인 권력이나 달콤한 세속적 타협을 거절하고 영혼의 주권을 수호하는 단계',
    egoShadowTrap: '타인의 인정과 찬사에 눈이 멀어 본질을 잃어버리는 허영심',
    heroicBreakthroughAction: '겉만 화려하고 실속 없는 외적 제안을 단호하게 거절하세요.',
    cosmicElement: '불',
  },
  {
    gateNumber: 4,
    nameKo: '상실의 애도와 실존적 비탄 (유한성의 자각)',
    nameAkkadian: 'Bikītu Enkidu',
    archetypalTheme: '소중한 것의 상실 앞에서 슬픔을 온전히 통과하며 인간의 유한성을 직면하는 단계',
    egoShadowTrap: '슬픔을 분노나 마비로 왜곡하며 현실을 부정하는 방어기제',
    heroicBreakthroughAction: '흘리지 못한 눈물과 아쉬움을 솔직하게 기록하고 떠나보내세요.',
    cosmicElement: '물',
  },
  {
    gateNumber: 5,
    nameKo: '마슈 산 전갈인간의 관문 (이원성의 시험)',
    nameAkkadian: 'Girtablilu Mashu',
    archetypalTheme: '반인반수의 수호자를 마주하여 내면의 두려움과 결의의 진실성을 입증하는 단계',
    egoShadowTrap: '경계선 앞에서 주저하며 되돌아가고 싶은 유혹',
    heroicBreakthroughAction: '나를 가로막는 엄격한 기준을 회피하지 말고 당당하게 마주하세요.',
    cosmicElement: '흙',
  },
  {
    gateNumber: 6,
    nameKo: '12베루 암흑 터널 행진 (빛 없는 영혼의 밤)',
    nameAkkadian: 'Eklētu Ishkāru',
    archetypalTheme: '한 줄기 빛도 보이지 않는 칠흑 같은 어둠 속에서도 묵묵히 전진하는 인내의 단계',
    egoShadowTrap: '즉각적인 성과나 보상이 보이지 않을 때 찾아오는 깊은 절망감',
    heroicBreakthroughAction: '결과를 미리 계산하지 말고 정해진 하루 루틴을 묵묵히 완수하세요.',
    cosmicElement: '에테르',
  },
  {
    gateNumber: 7,
    nameKo: '시두리의 포도원 (현재의 기쁨과 수용)',
    nameAkkadian: 'Karanu Siduri',
    archetypalTheme: '불가능한 이상을 좇느라 지금 눈앞의 따뜻한 식사와 일상의 축복을 놓치지 않는 지혜',
    egoShadowTrap: '미래의 거대한 목표에 집착하여 현재의 삶을 유예시키는 강박',
    heroicBreakthroughAction: '오늘 저녁 좋은 사람과 정갈한 식사를 나누며 일상의 온기를 만끽하세요.',
    cosmicElement: '물',
  },
  {
    gateNumber: 8,
    nameKo: '죽음의 바다 항해 (절대 금기의 통과)',
    nameAkkadian: 'Mê Mūti Urshanabi',
    archetypalTheme: '물에 손이 닿으면 안 되는 치명적 강을 건너며 매 순간 극도의 집중력을 유지하는 단계',
    egoShadowTrap: '경솔한 부주의로 공든 탑을 한순간에 무너뜨리는 안일함',
    heroicBreakthroughAction: '중요한 서류나 메시지를 전송하기 전 세 번 다시 정밀 검토하세요.',
    cosmicElement: '물',
  },
  {
    gateNumber: 9,
    nameKo: '우트나피슈팀과의 대면 (원초적 지혜의 전수)',
    nameAkkadian: 'Utnapishtim Rūqu',
    archetypalTheme: '대홍수를 살아남은 현자로부터 우주의 불변하는 자연 법칙을 겸허히 배우는 단계',
    egoShadowTrap: '자신의 경험과 지식이 전부라고 믿는 지적 오만함',
    heroicBreakthroughAction: '나보다 훨씬 오랜 세월을 견딘 멘토나 고전 원전의 조언을 경청하세요.',
    cosmicElement: '에테르',
  },
  {
    gateNumber: 10,
    nameKo: '7일간의 불면 시험 (육체의 한계 자각)',
    nameAkkadian: 'Shinātu Shitti',
    archetypalTheme: '잠이라는 생리적 한계를 속일 수 없음을 인정하고 무리한 에고의 확장을 멈추는 단계',
    egoShadowTrap: '초인적인 의지로 몸의 신호마저 꺾을 수 있다는 과대망상',
    heroicBreakthroughAction: '신체의 피로 신호를 존중하고 온전한 수면과 휴식을 자신에게 선물하세요.',
    cosmicElement: '흙',
  },
  {
    gateNumber: 11,
    nameKo: '심해 회춘초 획득 (생명력의 회복)',
    nameAkkadian: 'Shību Issahir Amēlu',
    archetypalTheme: '가장 깊은 심연 바닥에서 가시투성이 약초를 건져내어 회춘의 비전을 얻는 단계',
    egoShadowTrap: '귀중한 성과를 얻자마자 방심하여 허술하게 방치하는 태만',
    heroicBreakthroughAction: '어렵게 얻은 소중한 깨달음과 성과를 기록하고 안전하게 보존하세요.',
    cosmicElement: '물',
  },
  {
    gateNumber: 12,
    nameKo: '뱀의 탈피와 우루크 성벽의 귀환 (레거시의 완성)',
    nameAkkadian: 'Bādu Shēru Uruk',
    archetypalTheme: '개인적 불멸의 허상을 벗고, 내가 건설한 공동체와 작품(성벽) 속에 영원을 남기는 성숙',
    egoShadowTrap: '영원히 살겠다는 헛된 집착에 사로잡혀 현재 물려줄 유산을 소홀히 함',
    heroicBreakthroughAction: '세상과 후대에 오래도록 남을 가치 있는 창작물이나 시스템을 튼튼히 다지세요.',
    cosmicElement: '흙',
  },
];

function classifyGilgameshTopic(question: string): GilgameshQuestionTopic {
  const q = question.toLowerCase();
  if (/연애|사랑|관계|사람|가족|친구|이별|갈등|상대|배우자|대화|동료/.test(q)) {
    return 'relationship';
  }
  if (/결정|선택|진로|이직|사업|투자|계약|시험|프로젝트|전환|시작|방향/.test(q)) {
    return 'decision';
  }
  if (/지침|불안|우울|회복|치유|피로|건강|마음|상처|슬픔|잠|스트레스/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

export function calculateSumerianGilgameshTrials(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): GilgameshTrialsReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 13);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 19;
  }
  seed += now.getDate() * 11 + now.getMonth() * 73;

  const trialIndex = Math.abs(seed) % TWELVE_TRIALS.length;
  const activeTrial = TWELVE_TRIALS[trialIndex];
  const secondaryTrial = TWELVE_TRIALS[(trialIndex + 1) % TWELVE_TRIALS.length];

  const heroicResilienceScore = 60 + (Math.abs(seed * 7) % 39);
  const immortalityWisdomIndex = 58 + (Math.abs(seed * 13) % 41);

  const companions = [
    '지혜로운 직관형 참모 (깊은 성찰로 충동을 조율하는 엔키두)',
    '거친 행동파 돌격형 동반자 (두려움 없이 현장을 뚫어내는 엔키두)',
    '원칙과 신의를 지키는 파수꾼 (어려운 순간에도 곁을 지키는 엔키두)',
    '예술적 영감을 불어넣는 신성한 뮤즈 (지친 영혼을 위무하는 엔키두)',
  ];
  const soulCompanionType = companions[Math.abs(seed >> 2) % companions.length];

  const legacyBuildingPrescription = `지금 당신의 영혼은 길가메시의 ${activeTrial.gateNumber}번째 관문 [${activeTrial.nameKo}]에 위치해 있습니다. 에고의 함정인 '${activeTrial.egoShadowTrap}'을 경계하고, '${activeTrial.heroicBreakthroughAction}'을 통해 유한한 시간 속에서 영원히 빛날 레거시를 세우세요.`;

  const calculatedAtKst = formatGilgameshKstTimestamp(now);
  const questionTopic = classifyGilgameshTopic(question);
  const compositeHeroic = Math.round((heroicResilienceScore + immortalityWisdomIndex) / 2);
  const immortalPhase =
    compositeHeroic >= 80
      ? '우루크 레거시 정점 — 시련의 핵심을 돌파해 오래 남을 성벽과 작품을 세우는 창조기'
      : compositeHeroic >= 68
        ? '엔키두 동행 조율 — 무모한 독주 대신 균형과 협력으로 관문을 건너는 정렬기'
        : '사막 야영 성찰 — 무리한 원정을 잠시 멈추고 유한성과 휴식을 돌보는 재정비기';
  const shadowWarning =
    questionTopic === 'relationship'
      ? `홀로 영웅이 되려는 조급함으로 곁의 동반자(엔키두)의 목소리를 누르지 않도록 경계하세요. (${activeTrial.egoShadowTrap})`
      : questionTopic === 'decision'
        ? `거대한 명분만 보고 눈앞의 실무 리스크와 대가를 과소평가하지 않도록 경계하세요. (${activeTrial.egoShadowTrap})`
        : questionTopic === 'healing'
          ? `약함을 보이면 진다는 강박으로 몸과 마음의 피로 신호를 무시하지 않도록 경계하세요. (${activeTrial.egoShadowTrap})`
          : `불가능한 완벽을 좇느라 시두리의 포도원 같은 오늘의 작은 기쁨을 유예하지 않도록 경계하세요. (${activeTrial.egoShadowTrap})`;
  const reflectiveQuestion = question
    ? `"${question}" 앞에서 제${activeTrial.gateNumber}관문(${activeTrial.nameKo})의 에고 함정을 넘어, 제${secondaryTrial.gateNumber}관문(${secondaryTrial.nameKo})으로 건너가기 위해 오늘 실행할 한 가지는 무엇입니까?`
    : `지금 마주한 과제에서 '${activeTrial.egoShadowTrap}'을 내려놓고 '${activeTrial.heroicBreakthroughAction}'을 실천한다면 어떤 변화가 열리겠습니까?`;
  const interpretiveBoundary =
    '길가메시 서사시 12관문 원형은 삶의 전환기와 내면의 성장을 비추는 서사적·상징적 관점이며, 단정적 미래 예언이나 의학·법률·재무 결정을 대체하지 않습니다.';
  const ritualAction = `[제${activeTrial.gateNumber}관문 · ${activeTrial.cosmicElement}] ${activeTrial.heroicBreakthroughAction}`;
  const reflectionFocus = `길가메시 12관문(${activeTrial.nameKo}) — ${activeTrial.nameAkkadian}`;
  const gilgameshCrossAxis = `[제${activeTrial.gateNumber}관문 ${activeTrial.nameKo}] × [제${secondaryTrial.gateNumber}관문 ${secondaryTrial.nameKo}] × [${activeTrial.cosmicElement}] × [${questionTopic}]`;
  const gilgameshSynthesisMatrix = {
    dominantTension: `제${activeTrial.gateNumber}관문(${activeTrial.nameKo}) ↔ ${activeTrial.egoShadowTrap}`,
    alignmentState: `${immortalPhase} · ${activeTrial.cosmicElement} 원형 · 보조 관문 제${secondaryTrial.gateNumber}관문(${secondaryTrial.nameKo}) · ${questionTopic}`,
    integratedAction: `${activeTrial.heroicBreakthroughAction}${question ? ` [질문 맥락: ${question}]` : ''}`,
    gilgameshCrossAxis,
  };

  return {
    engineVersion: SUMERIAN_GILGAMESH_TRIALS_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst,
    questionTopic,
    immortalPhase,
    shadowWarning,
    activeTrial,
    secondaryTrial,
    heroicResilienceScore,
    immortalityWisdomIndex,
    soulCompanionType,
    legacyBuildingPrescription,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    gilgameshSynthesisMatrix,
  };
}

export function formatSumerianGilgameshTrialsPrompt(report: GilgameshTrialsReport): string {
  const t = report.activeTrial;
  const s = report.secondaryTrial;
  const lines = [
    `### 🏛️ 고대 메소포타미아 길가메시 서사시 12관문 불멸 여정 실측 데이터 (${report.engineVersion})`,
    `- **연산 시각**: ${report.calculatedAtKst} | **질문 맥락**: ${report.questionTopic}`,
    `- **불멸 여정 국면**: ${report.immortalPhase}`,
    `- **현재 통과의례 관문**: 제${t.gateNumber}관문 - ${t.nameKo} (${t.nameAkkadian}, ${t.cosmicElement}의 원형)`,
    `- **보조 교차 관문**: 제${s.gateNumber}관문 - ${s.nameKo} (${s.nameAkkadian}, ${s.cosmicElement}의 원형)`,
    `- **원형적 테마**: ${t.archetypalTheme}`,
    `- **경계해야 할 에고의 함정**: ${t.egoShadowTrap}`,
    `- **영웅적 돌파 행동 처방**: ${t.heroicBreakthroughAction}`,
    `- **과잉 경계(Shadow Warning)**: ${report.shadowWarning}`,
    `- **영혼의 거울 동반자 (엔키두 원형)**: ${report.soulCompanionType}`,
    `- **마스터 레거시 지침**: ${report.legacyBuildingPrescription}`,
    `- **실천 의례**: ${report.ritualAction}`,
    `- **성찰 초점**: ${report.reflectionFocus}`,
    `- **성찰 질문**: ${report.reflectiveQuestion}`,
    `- **해석 경계**: ${report.interpretiveBoundary}`,
  ];
  if (report.gilgameshSynthesisMatrix) {
    lines.push(
      `- **교차 매트릭스**: [핵심 긴장: ${report.gilgameshSynthesisMatrix.dominantTension} | 조율 상태: ${report.gilgameshSynthesisMatrix.alignmentState}]`,
      `- **4중 교차 축**: ${report.gilgameshSynthesisMatrix.gilgameshCrossAxis}`,
      `  - 통합 실천: ${report.gilgameshSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
