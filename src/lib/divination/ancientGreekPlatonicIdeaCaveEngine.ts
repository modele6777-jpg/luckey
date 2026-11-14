/**
 * 고대 그리스 플라톤(Plato) 동굴의 비유(Allegory of the Cave) & 이데아(Idea) 4대 추덕 사유 엔진
 *
 * 플라톤 대화편 《국가(Politeia)》 제7권 동굴의 비유, 《파이돈(Phaedo)》, 《향연(Symposium)》, 《파이드로스(Phaedrus)》 원전 기반.
 * 1. 동굴의 비유(Allegory of the Cave): 감각의 그림자에 얽매인 상태에서 벗어나 지성의 태양을 향해 오르는 해방.
 * 2. 좋음의 이데아(Idea of the Good): 모든 존재와 진리의 궁극적 근원이자 지적 통찰의 최고봉.
 * 3. 상기설(Anamnesis): 진리는 외부에서 주입되는 것이 아니라 영혼이 본래 지니고 있던 것을 일깨우는 회상.
 * 4. 4대 추덕(Cardinal Virtues): 지혜(Sophia)·용기(Andreia)·절제(Sophrosyne)·정의(Dikaiosyne)의 조화.
 * 5. 카타바시스(Katabasis): 진리를 본 철인이 다시 동굴로 내려와 공동체를 이끌고 밝히는 실천적 의무.
 *
 * @version LUCKEY-PLATONIC-IDEA-CAVE-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const PLATONIC_IDEA_CAVE_VERSION = 'LUCKEY-PLATONIC-IDEA-CAVE-v2.1.0';

export interface PlatonicAscentStage {
  stageLevel: number;
  stageNameGreek: string;
  stageNameKo: string;
  epistemicRealm: string;
  actionDirective: string;
}

export interface PlatonicCardinalVirtue {
  virtueGreek: string;
  virtueKo: string;
  soulPart: string;
  practicalCounsel: string;
}

export interface PlatonicSituationalCaveAscent {
  themeKo: string;
  dialogueSource: string;
  classicalQuote: string;
  shadowIllusionTrap: string;
  dialecticQuestion: string;
  katabasisPractice: string;
}

export interface PlatonicTemporalDialecticRhythm {
  kstWindow: string;
  seasonalTone: string;
  soulChariotFocus: string;
  noeticClarityIndex: number;
  rhythmDirective: string;
}

export interface PlatonicIdeaAscentMatrix {
  shadowDetachment: number;
  anamnesisResonance: number;
  katabasisReadiness: number;
  overallSynthesis: number;
}

export interface PlatonicIdeaCaveResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  ideaTruthOrientationScore: number;       // 좋음의 이데아 진리지향도
  shadowIllusionLiberationScore: number;   // 동굴 그림자 착각탈피력
  anamnesisSoulIntuitionScore: number;     // 상기설 영혼직관 회상력
  cardinalVirtuesHarmonyScore: number;     // 4대 추덕(지혜·용기·절제·정의) 조화도
  dialecticAscentPowerScore: number;       // 변증법적 영혼비상 지성력
  // 세부 명세
  activeAscentStage: PlatonicCardinalVirtue extends never ? never : PlatonicAscentStage;
  focalCardinalVirtue: PlatonicCardinalVirtue;
  situationalCaveAscent: PlatonicSituationalCaveAscent;
  temporalDialecticRhythm: PlatonicTemporalDialecticRhythm;
  ideaAscentMatrix: PlatonicIdeaAscentMatrix;
  platonicPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  // v2.1.0 순수 정성 실천·성찰·경계
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export type PlatonicIdeaCaveReport = PlatonicIdeaCaveResult;

const ASCENT_STAGES: PlatonicAscentStage[] = [
  {
    stageLevel: 1,
    stageNameGreek: 'Eikasia (동굴 벽의 그림자)',
    stageNameKo: '감각적 환영과 편견의 투영을 진실로 오인하는 단계',
    epistemicRealm: '외적 평판이나 일시적 현상에 마음이 흔들리기 쉬운 감각적 영역',
    actionDirective: '눈앞에 비치는 그림자에 일희일비하지 말고 그것을 만들어내는 배후의 실체를 응시하십시오.',
  },
  {
    stageLevel: 2,
    stageNameGreek: 'Pistis (동굴 속 횃불과 인형)',
    stageNameKo: '고정관념의 굴레를 깨고 돌아보며 감각 세계의 모조품을 직시하는 단계',
    epistemicRealm: '스스로의 상식과 신념이 가공된 것임을 깨닫는 의심과 전환의 영역',
    actionDirective: '익숙했던 관습적 믿음을 과감히 검증하고 참된 진리가 있는 바깥 세계로 고개를 돌리십시오.',
  },
  {
    stageLevel: 3,
    stageNameGreek: 'Dianoia (동굴 밖 물에 비친 형상)',
    stageNameKo: '논리적 추론과 수학적 법칙을 통해 이데아의 질서를 체득하는 단계',
    epistemicRealm: '사물의 근본 구조와 법칙성을 차분하게 탐구하는 이성적 사유의 영역',
    actionDirective: '감정적 즉흥성을 내려놓고 원인과 결과의 본질적 이치와 법칙을 질서정연하게 사유하십시오.',
  },
  {
    stageLevel: 4,
    stageNameGreek: 'Noesis (태양과 좋음의 이데아)',
    stageNameKo: '순수한 지성으로 진리의 태양 그 자체를 직접 직관하는 최고 통찰의 단계',
    epistemicRealm: '모든 존재와 행위를 비추는 궁극의 선(善)과 조우하는 영혼의 명료한 영역',
    actionDirective: '진정으로 가치 있는 목적과 순수한 본질만을 좌표로 삼아 가장 맑은 결정을 내리십시오.',
  },
  {
    stageLevel: 5,
    stageNameGreek: 'Katabasis (동굴로의 자발적 귀환)',
    stageNameKo: '체득한 지혜의 빛을 품고 다시 현실로 내려와 타인을 돕는 실천적 단계',
    epistemicRealm: '사유의 성취를 현실 세계의 개선과 사람들에 대한 자애로 완성하는 봉사의 영역',
    actionDirective: '홀로 깨달은 지혜에 머물지 말고 주변 사람들의 어둠을 밝히고 질서를 세우는 현실적 조력을 행하십시오.',
  },
];

const CARDINAL_VIRTUES: PlatonicCardinalVirtue[] = [
  {
    virtueGreek: 'Sophia (지혜)',
    virtueKo: '이성의 덕 - 참된 본질과 겉모습을 분별하는 명료한 통찰력',
    soulPart: 'Logistikon (이성적 부분)',
    practicalCounsel: '복잡한 상황일수록 단편적 정보에 현혹되지 말고 핵심 이치와 장기적 진실을 바라보는 지혜를 발휘하십시오.',
  },
  {
    virtueGreek: 'Andreia (용기)',
    virtueKo: '기개의 덕 - 마땅히 두려워할 것과 두려워하지 않을 것을 아는 굳건함',
    soulPart: 'Thymoeides (기개적 부분)',
    practicalCounsel: '올바른 길임을 안다면 세속의 비난이나 실패의 두려움을 뚫고 당당하게 전진하는 기개를 떨치십시오.',
  },
  {
    virtueGreek: 'Sophrosyne (절제)',
    virtueKo: '욕망의 덕 - 충동과 욕망이 이성의 조화를 따르도록 다스리는 절도',
    soulPart: 'Epithymetikon (욕망적 부분)',
    practicalCounsel: '과도한 조급함과 물질적 집착을 걷어내고 내면의 질서와 리듬을 지키는 절제를 우선하십시오.',
  },
  {
    virtueGreek: 'Dikaiosyne (정의)',
    virtueKo: '전체 조화의 덕 - 영혼의 모든 부분이 각자의 본분을 다하여 이루는 균형',
    soulPart: 'Hole Psyche (영혼 전체의 질서)',
    practicalCounsel: '내면의 생각과 감정, 행동이 상호 충돌 없이 하나로 정렬될 때 가장 완전한 평온과 힘이 깃듭니다.',
  },
];

function buildSituationalCaveAscent(question?: string): PlatonicSituationalCaveAscent {
  const q = (question ?? '').trim();
  if (/선택|결정|진로|이직|갈림길|고민/.test(q)) {
    return {
      themeKo: '선택과 본질 분별(Dianoia)',
      dialogueSource: '《국가(Politeia)》 제7권 518c',
      classicalQuote: '교육이란 영혼에 시력을 불어넣는 것이 아니라, 이미 가진 시력을 올바른 방향으로 돌려놓는 기술이다.',
      shadowIllusionTrap: '남들이 부러워하는 외적 조건이라는 동굴 벽 그림자에 기준을 빼앗긴 채 결정하려는 함정.',
      dialecticQuestion: '모든 외적 보상을 지우고 난 뒤에도, 당신의 영혼이 스스로 옳다고 고개를 끄덕일 선택은 어느 쪽입니까?',
      katabasisPractice: '선택지별 단기 이해득실이 아닌 3년 뒤 영혼의 성장과 조화(Dikaiosyne) 기준으로 우선순위를 다시 적으십시오.',
    };
  }
  if (/관계|사람|사랑|신뢰|오해|갈등/.test(q)) {
    return {
      themeKo: '관계의 에로스와 정의(Symposium)',
      dialogueSource: '《향연(Symposium)》 210a–212a',
      classicalQuote: '아름다움에 대한 참된 사랑은 한 사람의 겉모습에서 시작해 영혼의 아름다움과 진리 그 자체로 오르는 사다리다.',
      shadowIllusionTrap: '상대의 일시적 말투나 겉모습을 전부의 실체인 양 단정 짓는 감각적 투영의 오류.',
      dialecticQuestion: '내가 상대에게 서운해하는 것은 그의 본질입니까, 아니면 내 기대가 만든 그림자입니까?',
      katabasisPractice: '감정적 비난 대신 상대의 영혼이 지향하는 본래의 선의를 한 번 더 묻고 경청하는 대화를 시도하십시오.',
    };
  }
  if (/불안|두려움|실패|혼란|막막|걱정/.test(q)) {
    return {
      themeKo: '그림자 공포 탈피(Eikasia → Pistis)',
      dialogueSource: '《파이돈(Phaedo)》 79c–80b',
      classicalQuote: '영혼이 감각에만 의존해 사물을 살필 때는 흔들리고 어지럽지만, 스스로 사유할 때는 변치 않는 순수함으로 돌아간다.',
      shadowIllusionTrap: '아직 일어나지도 않은 불행의 그림자를 실체로 착각해 스스로 쇠사슬을 조이는 상태.',
      dialecticQuestion: '지금 당신을 위협하는 두려움 가운데, 실제로 손에 잡히는 사실은 몇 할이나 됩니까?',
      katabasisPractice: '불안한 상상을 사실과 추측으로 분리해 종이에 적고, 이성(Logistikon)이 다룰 수 있는 사실 1건만 처리하십시오.',
    };
  }
  if (/돈|성취|일|사업|목표|성공/.test(q)) {
    return {
      themeKo: '좋음의 이데아와 일의 목적(Noesis)',
      dialogueSource: '《국가(Politeia)》 제6권 505a–509b',
      classicalQuote: '좋음의 이데아를 알지 못한 채 얻은 다른 모든 소유와 지식은 우리에게 진정한 유익을 주지 못한다.',
      shadowIllusionTrap: '수단(재물·성과)을 궁극의 목적(선과 가치)으로 착각해 끝없는 갈증에 빠지는 상태.',
      dialecticQuestion: '이번 성취가 완성되었을 때, 그 결과는 누구의 삶을 어떻게 더 좋게 밝히게 됩니까?',
      katabasisPractice: '성과 목표 옆에 이 일이 타인과 공동체에 남길 구체적 가치 한 문장을 함께 못 박고 실행하십시오.',
    };
  }
  return {
    themeKo: '상기설과 내면의 진리 회복(Anamnesis)',
    dialogueSource: '《메논(Meno)》 81c–d',
    classicalQuote: '배움이란 낯선 것을 새로 채우는 일이 아니라, 영혼이 본래 알고 있던 질서를 스스로 일깨우는 상기(Anamnesis)다.',
    shadowIllusionTrap: '외부의 정답만을 찾아 헤매며 이미 내면에 갖춰진 직관과 이성의 빛을 불신하는 태도.',
    dialecticQuestion: '남들의 조언을 잠시 덮어두었을 때, 당신의 양심과 지성은 이미 어떤 답을 기억하고 있습니까?',
    katabasisPractice: '외부 검색과 비교를 30분 멈추고 고요한 사유 속에서 이미 알고 있던 핵심 원칙을 문장으로 되살리십시오.',
  };
}

function buildTemporalDialecticRhythm(now?: Date): PlatonicTemporalDialecticRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄의 발아기 — 동굴 문턱에서 첫 빛을 향해 고개를 돌리는 해방의 계절'
      : month >= 6 && month <= 8
        ? '여름의 정오기 — 진리의 태양을 직시하며 지성의 시력을 단련하는 계절'
        : month >= 9 && month <= 11
          ? '가을의 수렴기 — 현상과 본질을 가려내 영혼의 정의를 세우는 계절'
          : '겨울의 심연기 — 내면의 상기(Anamnesis)로 본질을 응축하는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '새벽·오전 노에시스(Noesis) 맑은 직관 창',
      seasonalTone,
      soulChariotFocus: 'Logistikon (이성의 마부 각성)',
      noeticClarityIndex: 91,
      rhythmDirective: '감각적 소음이 적고 지성의 눈이 가장 맑은 시간입니다. 핵심 본질과 장기 원칙을 먼저 확정하십시오.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '한낮 디아노이아(Dianoia) 실행·변증 창',
      seasonalTone,
      soulChariotFocus: 'Thymoeides (기개와 실행의 조화)',
      noeticClarityIndex: 82,
      rhythmDirective: '세속의 일과 사람 속에서 이데아의 질서를 실천(Katabasis)으로 옮기기에 적합한 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 소프로쉬네(Sophrosyne) 절제·정돈 창',
      seasonalTone,
      soulChariotFocus: 'Epithymetikon (욕망과 감정의 절제)',
      noeticClarityIndex: 74,
      rhythmDirective: '하루 동안 붙은 감각의 그림자와 과도한 자극을 가라앉히고 내면의 질서를 복원하십시오.',
    };
  }
  return {
    kstWindow: '심야 아남네시스(Anamnesis) 영혼 회상 창',
    seasonalTone,
    soulChariotFocus: 'Hole Psyche (영혼 전체의 침잠과 조화)',
    noeticClarityIndex: 78,
    rhythmDirective: '바깥의 횃불이 잦아드는 밤입니다. 섣부른 판단보다 영혼의 깊은 기억과 본심을 조용히 비추십시오.',
  };
}

export function calculatePlatonicIdeaCave(
  profile: UserProfile,
  question?: string,
  now?: Date,
): PlatonicIdeaCaveResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'PlatonicIdeaCave';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const ideaTruthOrientationScore = 64 + (absHash % 35);
  const shadowIllusionLiberationScore = 60 + ((absHash >> 3) % 38);
  const anamnesisSoulIntuitionScore = 58 + ((absHash >> 6) % 41);
  const cardinalVirtuesHarmonyScore = 62 + ((absHash >> 9) % 37);
  const dialecticAscentPowerScore = 65 + ((absHash >> 12) % 34);

  const stageIndex = (absHash >> 4) % ASCENT_STAGES.length;
  const virtueIndex = (absHash >> 7) % CARDINAL_VIRTUES.length;

  const activeAscentStage = ASCENT_STAGES[stageIndex];
  const focalCardinalVirtue = CARDINAL_VIRTUES[virtueIndex];
  const situationalCaveAscent = buildSituationalCaveAscent(question);
  const temporalDialecticRhythm = buildTemporalDialecticRhythm(now);

  const shadowDetachment = Math.min(99, Math.round((shadowIllusionLiberationScore + temporalDialecticRhythm.noeticClarityIndex) / 2));
  const anamnesisResonance = Math.min(99, Math.round((anamnesisSoulIntuitionScore + ideaTruthOrientationScore) / 2));
  const katabasisReadiness = Math.min(99, Math.round((cardinalVirtuesHarmonyScore + dialecticAscentPowerScore) / 2));
  const overallSynthesis = Math.round((shadowDetachment + anamnesisResonance + katabasisReadiness) / 3);

  const ideaAscentMatrix: PlatonicIdeaAscentMatrix = {
    shadowDetachment,
    anamnesisResonance,
    katabasisReadiness,
    overallSynthesis,
  };

  const counselTitle = `플라톤 이데아와 동굴의 비유: ${activeAscentStage.stageNameGreek}`;
  const philosophicalGuidance = `현재 상황은 눈앞의 현상적 그림자(Eikasia)를 넘어 좋음의 이데아(Idea of the Good)를 향해 영혼의 눈을 돌려야 할 시점입니다. ` +
    `${activeAscentStage.epistemicRealm}의 차원에서 ${activeAscentStage.actionDirective} ` +
    `특히 영혼의 ${focalCardinalVirtue.soulPart}을 조화롭게 이끄는 ${focalCardinalVirtue.virtueKo}을 중심에 두십시오. ${focalCardinalVirtue.practicalCounsel}`;

  const dailyPracticeRitual =
    `오늘의 카타바시스(Katabasis) 의례: '${situationalCaveAscent.shadowIllusionTrap}'에서 시선을 거두고, ${situationalCaveAscent.katabasisPractice} (${temporalDialecticRhythm.kstWindow})`;
  const reflectiveQuestion =
    `${situationalCaveAscent.dialecticQuestion} 지금 붙잡고 있는 두려움이나 욕망 가운데 동굴 벽의 그림자에 불과한 것은 무엇입니까?`;
  const interpretiveBoundary =
    '플라톤 동굴의 비유와 이데아 성찰은 외적 결과를 예단하는 점술이 아니라, 현상의 그림자 너머 본질과 4대 추덕의 균형을 비추는 변증법적 사유 도구입니다.';

  return {
    engineVersion: PLATONIC_IDEA_CAVE_VERSION,
    calculatedAtKst: (now ?? new Date()).toISOString(),
    ideaTruthOrientationScore,
    shadowIllusionLiberationScore,
    anamnesisSoulIntuitionScore,
    cardinalVirtuesHarmonyScore,
    dialecticAscentPowerScore,
    activeAscentStage,
    focalCardinalVirtue,
    situationalCaveAscent,
    temporalDialecticRhythm,
    ideaAscentMatrix,
    platonicPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

function describePlatonicStage(score: number): string {
  if (score >= 82) return '이데아의 빛을 직관하는 노에시스 명징기';
  if (score >= 70) return '그림자를 가려내는 변증법적 상승기';
  return '동굴의 시선을 돌리는 각성과 회상기';
}

export function formatPlatonicIdeaCavePrompt(res: PlatonicIdeaCaveResult): string {
  return [
    `【고대 그리스 플라톤 동굴의 비유 & 이데아 4대 추덕 지표 (${res.engineVersion})】`,
    `- 진리·해방 결: 이데아 지향(${describePlatonicStage(res.ideaTruthOrientationScore)}) · 그림자 탈피(${describePlatonicStage(res.shadowIllusionLiberationScore)}) · 상기 직관(${describePlatonicStage(res.anamnesisSoulIntuitionScore)})`,
    `- 추덕·비상 결: 4대 추덕 조화(${describePlatonicStage(res.cardinalVirtuesHarmonyScore)}) · 변증법적 상승(${describePlatonicStage(res.dialecticAscentPowerScore)})`,
    `- 영혼 상승 단계: ${res.activeAscentStage.stageNameGreek} (${res.activeAscentStage.stageNameKo})`,
    `- 핵심 요청 덕목: ${res.focalCardinalVirtue.virtueKo} [${res.focalCardinalVirtue.virtueGreek}]`,
    `- 질문 맥락 동굴 처방 (${res.situationalCaveAscent.themeKo} · ${res.situationalCaveAscent.dialogueSource}): "${res.situationalCaveAscent.classicalQuote}"`,
    `- 그림자 함정: ${res.situationalCaveAscent.shadowIllusionTrap}`,
    `- 변증 성찰 질문: ${res.situationalCaveAscent.dialecticQuestion}`,
    `- 카타바시스 실천: ${res.situationalCaveAscent.katabasisPractice}`,
    `- KST 사유 리듬: ${res.temporalDialecticRhythm.kstWindow} (${res.temporalDialecticRhythm.soulChariotFocus}, ${describePlatonicStage(res.temporalDialecticRhythm.noeticClarityIndex)}) — ${res.temporalDialecticRhythm.rhythmDirective}`,
    `- 이데아 상승 매트릭스: 그림자 탈피(${describePlatonicStage(res.ideaAscentMatrix.shadowDetachment)}) · 상기 공명(${describePlatonicStage(res.ideaAscentMatrix.anamnesisResonance)}) · 카타바시스 준비(${describePlatonicStage(res.ideaAscentMatrix.katabasisReadiness)}) · 종합 흐름(${describePlatonicStage(res.ideaAscentMatrix.overallSynthesis)})`,
    `- 철학적 처방: ${res.platonicPhilosophicalCounsel.philosophicalGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 핵심 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
