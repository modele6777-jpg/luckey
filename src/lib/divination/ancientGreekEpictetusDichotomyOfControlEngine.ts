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
 * @version LUCKEY-EPICTETUS-CONTROL-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const EPICTETUS_CONTROL_VERSION = 'LUCKEY-EPICTETUS-CONTROL-v2.4.0';

function formatEpictetusKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

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

export interface EpictetusSituationalControlAudit {
  themeKo: string;
  sourceCitation: string;
  classicalQuote: string;
  taEphHeminFocus: string;
  taOukEphHeminRelease: string;
  stoicReframeAction: string;
}

export interface EpictetusTemporalProhairesisRhythm {
  kstWindow: string;
  seasonalTone: string;
  toposPracticeFocus: string;
  prohairesisClarityIndex: number;
  rhythmDirective: string;
}

export interface EpictetusStoicAutonomyMatrix {
  impressionFilterStrength: number;
  amorFatiAcceptance: number;
  kathekonExecution: number;
  overallSynthesis: number;
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
  situationalControlAudit: EpictetusSituationalControlAudit;
  temporalProhairesisRhythm: EpictetusTemporalProhairesisRhythm;
  stoicAutonomyMatrix: EpictetusStoicAutonomyMatrix;
  epictetusPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  // v2.1.0 순수 정성 실천·성찰·경계
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  epictetusCrossAxis: string;
  epictetusShadowWarning: string;
  epictetusSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
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

function buildSituationalControlAudit(question?: string): EpictetusSituationalControlAudit {
  const q = (question ?? '').trim();
  if (/시선|평판|비난|눈치|인정|남/.test(q)) {
    return {
      themeKo: '타인의 시선과 평판 해방',
      sourceCitation: '《엥케이리디온》 1장 · 23장',
      classicalQuote: '다른 사람의 인정을 구하느라 애쓰는 순간, 너는 이미 너의 프로하이레시스(자유의지)를 타인의 손에 넘겨준 것이다.',
      taEphHeminFocus: '내가 옳다고 믿는 기준에 따라 성실하게 말하고 행동할 주권.',
      taOukEphHeminRelease: '타인이 나를 어떻게 평가하고 오해할지까지 통제하려는 헛된 집착.',
      stoicReframeAction: '상대의 반응 대신 "나는 지금 내 기준에 부끄럽지 않은가" 한 가지만 점검하고 실행하십시오.',
    };
  }
  if (/불안|결과|실패|걱정|미래|시험|합격/.test(q)) {
    return {
      themeKo: '결과 집착과 미래 불안 절연',
      sourceCitation: '《담화록》 제2권 5장',
      classicalQuote: '활을 당기는 일까지는 네 몫이지만, 날아간 화살이 바람을 타고 과녁에 꽂히는 일은 네 몫이 아니다.',
      taEphHeminFocus: '오늘 화살을 곧게 깎고 시위를 끝까지 당기는 준비 과정과 집중력.',
      taOukEphHeminRelease: '당장의 합격·성과·시장 반응처럼 변수가 개입하는 최종 결과.',
      stoicReframeAction: '결과 걱정에 쓰던 시간을 오늘 바로 실행할 수 있는 준비 체크리스트 1개 완료로 치환하십시오.',
    };
  }
  if (/관계|갈등|화|짜증|서운|상대|사람/.test(q)) {
    return {
      themeKo: '관계의 두 손잡이 원칙',
      sourceCitation: '《엥케이리디온》 43장',
      classicalQuote: '모든 일에는 손잡이가 둘 있다. 하나로는 들 수 있고 다른 하나로는 들 수 없다.',
      taEphHeminFocus: '상대의 무례함에 똑같이 분노하지 않고 품위와 원칙으로 응대하는 나의 선택.',
      taOukEphHeminRelease: '상대의 성격이나 이미 뱉어진 말을 내 뜻대로 고치려는 조바심.',
      stoicReframeAction: '원망의 손잡이 대신 "우리가 함께 풀 수 있는 현실적 경계와 합의는 무엇인가"라는 들 수 있는 손잡이를 잡으십시오.',
    };
  }
  if (/선택|후회|결정|바꿀|어쩌지|포기/.test(q)) {
    return {
      themeKo: '프로하이레시스 결단과 운명 수용',
      sourceCitation: '《엥케이리디온》 8장',
      classicalQuote: '일어나는 일들이 네 뜻대로 되기를 바라지 말고, 일어나는 대로 일어나기를 바라라. 그러면 삶이 순조로울 것이다.',
      taEphHeminFocus: '주어진 조건을 재료 삼아 가장 지혜로운 다음 한 수를 설계하는 내면 의지.',
      taOukEphHeminRelease: '이미 지나간 과거의 선택을 되돌리려는 헛된 가정과 자책.',
      stoicReframeAction: '지나간 패를 탓하는 대신, 지금 손에 들린 패로 둘 수 있는 최선의 수 한 가지를 바로 실행하십시오.',
    };
  }
  return {
    themeKo: '인상(Phantasia) 검증과 내면 주권',
    sourceCitation: '《엥케이리디온》 1장 5절 · 5장',
    classicalQuote: '사람을 어지럽히는 것은 사건 자체가 아니라 사건에 대해 스스로 내리는 판단이다.',
    taEphHeminFocus: '사건에 성급히 의미를 덧붙이지 않고 사실과 해석을 분리하는 이성적 판단력.',
    taOukEphHeminRelease: '예기치 않게 찾아온 외적 변수와 즉각적인 감정적 파동.',
    stoicReframeAction: '감정이 치밀 때 10초 멈춰 "이것은 사실인가, 나의 판단인가"를 소리 내어 구분한 뒤 다음 행동을 정하십시오.',
  };
}

function buildTemporalProhairesisRhythm(now?: Date): EpictetusTemporalProhairesisRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 새로운 시도 앞에서 결과 욕심을 비우고 올바른 방향(Horme)을 세우는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 외적 열기와 압박 속에서도 내면의 아파테이아를 지키는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 수확의 크기에 일희일비하지 않고 아디아포라를 훈련하는 계절'
          : '겨울 — 통제 밖의 시련을 내면 강인함의 연료로 바꾸는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '아침 프로하이레시스 주권 선언 창',
      seasonalTone,
      toposPracticeFocus: '제3토포스(판단과 동의 훈련)',
      prohairesisClarityIndex: 90,
      rhythmDirective: '하루의 변수들을 만나기 전, 오늘 내가 통제할 영역과 내려놓을 영역을 먼저 선포하기 좋은 시간입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '한낮 카테콘(Kathekon) 의무 실행 창',
      seasonalTone,
      toposPracticeFocus: '제2토포스(충동과 적절한 행동 훈련)',
      prohairesisClarityIndex: 83,
      rhythmDirective: '타인과 변수가 부딪히는 낮 시간입니다. 즉각적 감정 반응 대신 본분과 원칙에 맞는 행동을 택하십시오.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 아모르 파티(Amor Fati) 수용 창',
      seasonalTone,
      toposPracticeFocus: '제1토포스(욕망과 기피 훈련)',
      prohairesisClarityIndex: 76,
      rhythmDirective: '뜻대로 되지 않은 일들을 억지로 붙잡지 말고 오늘 주어진 현실을 담담히 소화하며 마무리하십시오.',
    };
  }
  return {
    kstWindow: '심야 아파테이아(Apatheia) 정화 창',
    seasonalTone,
    toposPracticeFocus: '제3토포스(인상 거리두기 정화)',
    prohairesisClarityIndex: 79,
    rhythmDirective: '밤의 불안한 상상은 대개 통제 밖의 허상입니다. 판단을 내일로 미루고 내면의 평정을 회복하십시오.',
  };
}

export function calculateEpictetusDichotomyOfControl(
  profile: UserProfile,
  question?: string,
  now?: Date,
): EpictetusDichotomyOfControlResult {
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
  const situationalControlAudit = buildSituationalControlAudit(question);
  const temporalProhairesisRhythm = buildTemporalProhairesisRhythm(now);

  const impressionFilterStrength = Math.min(99, Math.round((dichotomyClarityScore + temporalProhairesisRhythm.prohairesisClarityIndex) / 2));
  const amorFatiAcceptance = Math.min(99, Math.round((adiaphoraDetachmentScore + apatheiaEquanimityScore) / 2));
  const kathekonExecution = Math.min(99, Math.round((prohairesisAutonomyScore + threeTopoiDisciplineScore) / 2));
  const overallSynthesis = Math.round((impressionFilterStrength + amorFatiAcceptance + kathekonExecution) / 3);

  const stoicAutonomyMatrix: EpictetusStoicAutonomyMatrix = {
    impressionFilterStrength,
    amorFatiAcceptance,
    kathekonExecution,
    overallSynthesis,
  };

  const counselTitle = `에픽테토스 통제이분법: ${activeControlDomain.domainNameGreek}`;
  const philosophicalGuidance = `인간을 괴롭히는 것은 사물 자체가 아니라 사물에 대해 가지는 생각입니다. ` +
    `현재 당신의 당면 과제는 '${activeControlDomain.domainNameKo}'의 영역에 속합니다. ${activeControlDomain.actionDirective} ` +
    `특히 ${focalToposDiscipline.toposNameKo}(${focalToposDiscipline.toposNameGreek})을 염두에 두십시오. ${focalToposDiscipline.practicalCounsel}`;

  const dailyPracticeRitual =
    `오늘의 프로하이레시스(Prohairesis) 의례: '${situationalControlAudit.taOukEphHeminRelease}'은 통제 밖으로 내려놓고, '${situationalControlAudit.taEphHeminFocus}'에만 주권을 집중하십시오. (${temporalProhairesisRhythm.kstWindow})`;
  const reflectiveQuestion =
    `지금 나를 흔드는 일 가운데 실제로 내 선택(Ta Eph' hemin)에 달린 부분과 내 힘 밖(Ta Ouk Eph' hemin)에 있는 부분은 어디서 갈립니까?`;
  const interpretiveBoundary =
    '에픽테토스의 통제이분법 통찰은 외부 사건의 성패를 점치는 도구가 아니라, 인상(Phantasia)에 흔들리지 않고 내면의 자유의지(Prohairesis)를 세우기 위한 스토아 성찰 체계입니다.';

  const trimmedQ = (question ?? '').trim();
  const epictetusCrossAxis = `${activeControlDomain.domainType} · ${focalToposDiscipline.toposNameKo.split(' ')[0]} × ${temporalProhairesisRhythm.kstWindow.split(' ')[0]}`;
  const epictetusShadowWarning = `감정 억압을 스토아 초연(Apatheia)으로 오해하지 말고, '${situationalControlAudit.taEphHeminFocus}'에만 책임감 있게 집중하십시오.`;
  const epictetusSynthesisMatrix = {
    dominantTension: `${situationalControlAudit.taEphHeminFocus} ↔ ${situationalControlAudit.taOukEphHeminRelease}`,
    alignmentState: `${activeControlDomain.domainNameGreek} · ${focalToposDiscipline.toposNameKo}`,
    integratedAction: `${situationalControlAudit.stoicReframeAction}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: EPICTETUS_CONTROL_VERSION,
    calculatedAtKst: formatEpictetusKstTimestamp(now ?? new Date()),
    dichotomyClarityScore,
    prohairesisAutonomyScore,
    adiaphoraDetachmentScore,
    threeTopoiDisciplineScore,
    apatheiaEquanimityScore,
    activeControlDomain,
    focalToposDiscipline,
    situationalControlAudit,
    temporalProhairesisRhythm,
    stoicAutonomyMatrix,
    epictetusPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    dailyPracticeRitual,
    reflectiveQuestion,
    ritualAction: dailyPracticeRitual,
    reflectionFocus: reflectiveQuestion,
    interpretiveBoundary,
    epictetusCrossAxis,
    epictetusShadowWarning,
    epictetusSynthesisMatrix,
  };
}

function describeEpictetusStage(score: number): string {
  if (score >= 82) return '흔들림 없는 스토아 주권 확립기';
  if (score >= 70) return '통제 경계가 선명한 평정기';
  return '인상을 여과하며 중심을 세우는 수련기';
}

export function formatEpictetusDichotomyOfControlPrompt(res: EpictetusDichotomyOfControlResult): string {
  const matrixLine = res.epictetusSynthesisMatrix
    ? `- 통제이분법 교차 매트릭스: 핵심 긴장(${res.epictetusSynthesisMatrix.dominantTension}) · 조율 상태(${res.epictetusSynthesisMatrix.alignmentState}) · 통합 실천(${res.epictetusSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【스토아학파 에픽테토스 통제이분법 & 프로하이레시스 지표 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 통제·자유의지 결: 이분법 명징(${describeEpictetusStage(res.dichotomyClarityScore)}) · 프로하이레시스 주권(${describeEpictetusStage(res.prohairesisAutonomyScore)})`,
    `- 초연·수양 결: 아디아포라 초연(${describeEpictetusStage(res.adiaphoraDetachmentScore)}) · 3대 토포스 균형(${describeEpictetusStage(res.threeTopoiDisciplineScore)}) · 아파테이아 평정(${describeEpictetusStage(res.apatheiaEquanimityScore)})`,
    `- 통제 영역 판별: ${res.activeControlDomain.domainNameGreek} (${res.activeControlDomain.domainNameKo})`,
    `- 핵심 수양 단계: ${res.focalToposDiscipline.toposNameKo} [${res.focalToposDiscipline.toposNameGreek}]`,
    `- 질문 맥락 통제 감사 (${res.situationalControlAudit.themeKo} · ${res.situationalControlAudit.sourceCitation}): "${res.situationalControlAudit.classicalQuote}"`,
    `- 내게 달린 것(Ta Eph' hemin): ${res.situationalControlAudit.taEphHeminFocus}`,
    `- 내려놓을 것(Ta Ouk Eph' hemin): ${res.situationalControlAudit.taOukEphHeminRelease}`,
    `- 스토아 전환 행동: ${res.situationalControlAudit.stoicReframeAction}`,
    `- KST 주권 리듬: ${res.temporalProhairesisRhythm.kstWindow} (${res.temporalProhairesisRhythm.toposPracticeFocus}, ${describeEpictetusStage(res.temporalProhairesisRhythm.prohairesisClarityIndex)}) — ${res.temporalProhairesisRhythm.rhythmDirective}`,
    `- 스토아 자율 매트릭스: 인상 여과(${describeEpictetusStage(res.stoicAutonomyMatrix.impressionFilterStrength)}) · 운명 수용(${describeEpictetusStage(res.stoicAutonomyMatrix.amorFatiAcceptance)}) · 의무 실행(${describeEpictetusStage(res.stoicAutonomyMatrix.kathekonExecution)}) · 종합 흐름(${describeEpictetusStage(res.stoicAutonomyMatrix.overallSynthesis)})`,
    `- 철학적 수양 지침: ${res.epictetusPhilosophicalCounsel.philosophicalGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 핵심 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 통제 교차 축: ${res.epictetusCrossAxis}`,
    `- 과잉·편향 경계: ${res.epictetusShadowWarning}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
