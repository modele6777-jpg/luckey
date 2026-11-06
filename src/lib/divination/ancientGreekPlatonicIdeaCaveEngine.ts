/**
 * 고대 그리스 플라톤(Plato) 동굴의 비유(Allegory of the Cave) & 이데아(Idea) 4대 추덕 사유 엔진
 *
 * 플라톤 대화편 《국가(Politeia)》 제7권 동굴의 비유, 《파이돈(Phaedo)》, 《향연(Symposium)》 원전 기반.
 * 1. 동굴의 비유(Allegory of the Cave): 감각의 그림자에 얽매인 상태에서 벗어나 지성의 태양을 향해 오르는 해방.
 * 2. 좋음의 이데아(Idea of the Good): 모든 존재와 진리의 궁극적 근원이자 지적 통찰의 최고봉.
 * 3. 상기설(Anamnesis): 진리는 외부에서 주입되는 것이 아니라 영혼이 본래 지니고 있던 것을 일깨우는 회상.
 * 4. 4대 추덕(Cardinal Virtues): 지혜(Sophia)·용기(Andreia)·절제(Sophrosyne)·정의(Dikaiosyne)의 조화.
 * 5. 카타바시스(Katabasis): 진리를 본 철인이 다시 동굴로 내려와 공동체를 이끌고 밝히는 실천적 의무.
 *
 * @version LUCKEY-PLATONIC-IDEA-CAVE-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const PLATONIC_IDEA_CAVE_VERSION = 'LUCKEY-PLATONIC-IDEA-CAVE-v1.0.0';

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
  activeAscentStage: PlatonicAscentStage;
  focalCardinalVirtue: PlatonicCardinalVirtue;
  platonicPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
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

export function calculatePlatonicIdeaCave(profile: UserProfile): PlatonicIdeaCaveResult {
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

  const counselTitle = `플라톤 이데아와 동굴의 비유: ${activeAscentStage.stageNameGreek}`;
  const philosophicalGuidance = `현재 상황은 눈앞의 현상적 그림자(Eikasia)를 넘어 좋음의 이데아(Idea of the Good)를 향해 영혼의 눈을 돌려야 할 시점입니다. ` +
    `${activeAscentStage.epistemicRealm}의 차원에서 ${activeAscentStage.actionDirective} ` +
    `특히 영혼의 ${focalCardinalVirtue.soulPart}을 조화롭게 이끄는 ${focalCardinalVirtue.virtueKo}을 중심에 두십시오. ${focalCardinalVirtue.practicalCounsel}`;

  return {
    engineVersion: PLATONIC_IDEA_CAVE_VERSION,
    calculatedAtKst: new Date().toISOString(),
    ideaTruthOrientationScore,
    shadowIllusionLiberationScore,
    anamnesisSoulIntuitionScore,
    cardinalVirtuesHarmonyScore,
    dialecticAscentPowerScore,
    activeAscentStage,
    focalCardinalVirtue,
    platonicPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatPlatonicIdeaCavePrompt(res: PlatonicIdeaCaveResult): string {
  return [
    `【고대 그리스 플라톤 동굴의 비유 & 이데아 4대 추덕 지표】`,
    `- 이데아 진리지향도: ${res.ideaTruthOrientationScore}/100`,
    `- 동굴 그림자 착각탈피력: ${res.shadowIllusionLiberationScore}/100`,
    `- 상기설 영혼직관 회상력: ${res.anamnesisSoulIntuitionScore}/100`,
    `- 4대 추덕 조화도: ${res.cardinalVirtuesHarmonyScore}/100`,
    `- 변증법적 영혼비상 지성력: ${res.dialecticAscentPowerScore}/100`,
    `- 영혼 상승 단계: ${res.activeAscentStage.stageNameGreek} (${res.activeAscentStage.stageNameKo})`,
    `- 인식의 영역: ${res.activeAscentStage.epistemicRealm}`,
    `- 단계별 실천 지침: ${res.activeAscentStage.actionDirective}`,
    `- 핵심 요청 덕목: ${res.focalCardinalVirtue.virtueKo} [${res.focalCardinalVirtue.virtueGreek}]`,
    `- 덕목 실천 지침: ${res.focalCardinalVirtue.practicalCounsel}`,
    `- 철학적 처방: ${res.platonicPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
