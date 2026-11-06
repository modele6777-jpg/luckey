/**
 * 고대 그리스 로마 스토아학파 에픽테토스(Epictetus) 《엥케이리디온》 통제이분법 & 프로하이레시스 도덕의지 엔진
 *
 * 에픽테토스의 《담화록(Discourses)》 및 《도덕 요강(Enchiridion)》 원전 기반.
 * 1. 통제이분법(Dichotomy of Control):
 *    - 우리에게 달린 것(Ta Eph' hemin): 판단(Hypolepsis), 충동(Horme), 욕망(Orexis), 기피(Ekklisis) 등 내면의 도덕적 선택.
 *    - 우리에게 달리지 않은 것(Ta Ouk Eph' hemin): 육체, 재산, 명성, 직위, 타인의 시선, 결과 등 외적 조건.
 * 2. 프로하이레시스(Prohairesis): 어떤 외적 강제나 운명의 격랑 앞에서도 굴복하지 않는 인간 내면의 절대적 자유의지.
 * 3. 3대 수양 영역(Topoi): 욕망과 기피의 훈련(운명 순응), 충동과 행동의 훈련(적절한 의무), 동의와 판단의 훈련(이성적 명징).
 * 4. 아디아포라(Adiaphora)와 아파테이아(Apatheia): 외부 사물에 대한 초연함과 영혼의 흔들림 없는 평정.
 *
 * @version LUCKEY-EPICTETUS-CONTROL-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const EPICTETUS_CONTROL_VERSION = 'LUCKEY-EPICTETUS-CONTROL-v1.0.0';

export interface EpictetusControlDomain {
  domainType: 'InternalControl' | 'ExternalCondition';
  domainNameGreek: string;
  domainNameKo: string;
  focusElements: string[];
  actionDirective: string;
}

export interface EpictetusToposDiscipline {
  toposNumber: number;
  toposNameGreek: string;
  toposNameKo: string;
  psychologicalFocus: string;
  practicalCounsel: string;
}

export interface EpictetusDichotomyOfControlResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  dichotomyClarityScore: number;       // 통제이분법 분별 명징도 (내게 달린 것 vs 달리지 않은 것)
  prohairesisAutonomyScore: number;    // 프로하이레시스 도덕적 자유의지 주권도
  adiaphoraDetachmentScore: number;    // 아디아포라 외물 무관심 초연력
  threeTopoiDisciplineScore: number;   // 3대 토포스(욕구·충동·판단) 수양 밸런스
  apatheiaEquanimityScore: number;     // 아파테이아 내면 평정심
  // 세부 명세
  activeControlDomain: EpictetusControlDomain;
  focalToposDiscipline: EpictetusToposDiscipline;
  epictetusPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type EpictetusDichotomyOfControlReport = EpictetusDichotomyOfControlResult;

const CONTROL_DOMAINS: EpictetusControlDomain[] = [
  {
    domainType: 'InternalControl',
    domainNameGreek: "Ta Eph' hemin (우리에게 달린 것)",
    domainNameKo: '나의 온전한 지배 아래 있는 내면의 선택과 태도',
    focusElements: ['판단(Hypolepsis)', '내적 충동(Horme)', '의도적 노력', '도덕적 선택(Prohairesis)'],
    actionDirective: '결과나 타인의 반응이 아니라 오직 내가 내릴 수 있는 판단과 마땅한 태도에만 온 에너지를 쏟으십시오.',
  },
  {
    domainType: 'ExternalCondition',
    domainNameGreek: "Ta Ouk Eph' hemin (우리에게 달리지 않은 것)",
    domainNameKo: '나의 직접적 통제권 밖에 있는 외적 조건과 결과',
    focusElements: ['타인의 시선·평판', '외부 사건의 결과', '환경적 제약', '운명의 변수'],
    actionDirective: '통제할 수 없는 외적 결과를 억지로 바꾸려 하지 말고, 주어지는 조건을 차분히 받아들이며 내면의 대응을 벼리십시오.',
  },
];

const THREE_TOPOI: EpictetusToposDiscipline[] = [
  {
    toposNumber: 1,
    toposNameGreek: 'Topos peri tas orexeis (욕망과 기피의 훈련)',
    toposNameKo: '운명과 현실을 있는 그대로 수용하는 평정의 수양',
    psychologicalFocus: '원하는 일이 뜻대로 일어나길 바라지 말고, 일어나는 일을 일어나는 대로 기꺼이 받아들이는 자세(Amor Fati).',
    practicalCounsel: '통제할 수 없는 결과에 실망하지 않으려면, 오직 나의 도덕적 의지만을 원하고 외적 사건에는 마음의 집착을 내려놓으십시오.',
  },
  {
    toposNumber: 2,
    toposNameGreek: 'Topos peri tas hormas (충동과 행동의 훈련)',
    toposNameKo: '공동체와 타인을 향한 적절한 행동과 의무(Kathekon)의 실천',
    psychologicalFocus: '맹목적이거나 이기적인 충동이 아니라 이성에 부합하고 공동선을 고려하는 신중한 행동 규준.',
    practicalCounsel: '어떤 상황에서도 분노나 초조함에 휘둘려 행동하지 말고, 자신의 사회적 본분과 이성적 질서에 부합하는 정당한 조치를 취하십시오.',
  },
  {
    toposNumber: 3,
    toposNameGreek: 'Topos peri tas synkatatheseis (동의와 판단의 훈련)',
    toposNameKo: '외부 인상(Phantasia)에 즉각 동의하지 않는 이성적 명징성',
    psychologicalFocus: '모든 혼란과 고통은 사건 자체가 아니라 그 사건에 대해 내가 내린 주관적 판단에서 비롯된다는 자각.',
    practicalCounsel: '어떤 불길한 소식이나 자극적 인상이 찾아와도 즉시 판단을 내리지 말고, "너는 한낱 겉모습일 뿐 실체가 아니다"라고 멈춰 세우십시오.',
  },
];

export function calculateEpictetusDichotomyOfControl(profile: UserProfile): EpictetusDichotomyOfControlResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'EpictetusDichotomyOfControl';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const dichotomyClarityScore = 65 + (absHash % 34);
  const prohairesisAutonomyScore = 62 + ((absHash >> 3) % 37);
  const adiaphoraDetachmentScore = 59 + ((absHash >> 6) % 40);
  const threeTopoiDisciplineScore = 63 + ((absHash >> 9) % 36);
  const apatheiaEquanimityScore = 60 + ((absHash >> 12) % 39);

  const domainIndex = (absHash >> 5) % CONTROL_DOMAINS.length;
  const toposIndex = (absHash >> 8) % THREE_TOPOI.length;

  const activeControlDomain = CONTROL_DOMAINS[domainIndex];
  const focalToposDiscipline = THREE_TOPOI[toposIndex];

  const counselTitle = `에픽테토스 통제이분법: ${activeControlDomain.domainNameGreek}`;
  const philosophicalGuidance = `인간을 괴롭히는 것은 사물 자체가 아니라 사물에 대해 가지는 생각입니다. ` +
    `현재 당신의 당면 과제는 '${activeControlDomain.domainNameKo}'의 영역에 속합니다. ${activeControlDomain.actionDirective} ` +
    `특히 ${focalToposDiscipline.toposNameKo}(${focalToposDiscipline.toposNameGreek})을 염두에 두십시오. ${focalToposDiscipline.practicalCounsel}`;

  return {
    engineVersion: EPICTETUS_CONTROL_VERSION,
    calculatedAtKst: new Date().toISOString(),
    dichotomyClarityScore,
    prohairesisAutonomyScore,
    adiaphoraDetachmentScore,
    threeTopoiDisciplineScore,
    apatheiaEquanimityScore,
    activeControlDomain,
    focalToposDiscipline,
    epictetusPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatEpictetusDichotomyOfControlPrompt(res: EpictetusDichotomyOfControlResult): string {
  return [
    `【스토아학파 에픽테토스 통제이분법 & 프로하이레시스 지표】`,
    `- 통제이분법 분별 명징도: ${res.dichotomyClarityScore}/100`,
    `- 프로하이레시스 자유의지 주권도: ${res.prohairesisAutonomyScore}/100`,
    `- 아디아포라 외물 초연력: ${res.adiaphoraDetachmentScore}/100`,
    `- 3대 토포스 수양 밸런스: ${res.threeTopoiDisciplineScore}/100`,
    `- 아파테이아 내면 평정심: ${res.apatheiaEquanimityScore}/100`,
    `- 통제 영역 판별: ${res.activeControlDomain.domainNameGreek} (${res.activeControlDomain.domainNameKo})`,
    `- 핵심 초점 요소: ${res.activeControlDomain.focusElements.join(', ')}`,
    `- 영역별 실천 지침: ${res.activeControlDomain.actionDirective}`,
    `- 핵심 수양 단계: ${res.focalToposDiscipline.toposNameKo} [${res.focalToposDiscipline.toposNameGreek}]`,
    `- 심리적 처방: ${res.focalToposDiscipline.psychologicalFocus}`,
    `- 철학적 수양 지침: ${res.epictetusPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
