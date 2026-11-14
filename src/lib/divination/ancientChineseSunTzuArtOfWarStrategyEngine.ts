/**
 * 고대 중국 춘추전국시대 손무(孫武) 《손자병법(孫子兵法)》 오사칠계(五事七計) & 부전승(不戰勝) 피실격허(避實擊虛) 전략 엔진
 *
 * 손무의 《손자병법(孫子兵法)》 13편 원전 기반.
 * 1. 오사(五事): 도(道)·천(天)·지(地)·장(將)·법(法)
 * 2. 부전이굴인지병(不戰而屈人之兵): 싸우지 않고 목적을 달성하는 최상의 지혜
 * 3. 지피지기 백전불태(知彼知己 百戰不殆): 나와 상대, 환경의 역학 관계를 꿰뚫어 위태로움을 피함
 * 4. 피실격허(避實擊虛)와 수형(水形): 단단한 정면충돌을 피하고 빈틈과 활로로 흐름
 * 5. 이우위직(以迂爲直): 돌아가는 우회로를 가장 빠른 지름길로 삼는 지혜
 *
 * @version LUCKEY-SUNTZU-STRATEGY-v1.1.0
 */

import type { UserProfile } from '../sharedState';

export const SUNTZU_STRATEGY_VERSION = 'LUCKEY-SUNTZU-STRATEGY-v1.1.0';

export type SunTzuQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface SunTzuFiveFactor {
  factorHanja: string;
  factorKo: string;
  strategicSignificance: string;
  cultivationCounsel: string;
}

export interface SunTzuStrategicTactic {
  tacticNameHanja: string;
  tacticNameKo: string;
  dynamicAction: string;
  practicalExecution: string;
}

export interface SunTzuArtOfWarStrategyResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: SunTzuQuestionTopic;
  strategicPosture: string;
  // 내부 계산 호환 필드 (프롬프트 비노출)
  fiveFactorsHarmonyScore: number;
  unfoughtVictoryPowerScore: number;
  situationalClarityScore: number;
  waterFormFlexibilityScore: number;
  deceptiveTimingMasteryScore: number;
  // 세부 명세
  focalFiveFactor: SunTzuFiveFactor;
  activeStrategicTactic: SunTzuStrategicTactic;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
  boundaryNotice: string;
  sunTzuPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type SunTzuArtOfWarStrategyReport = SunTzuArtOfWarStrategyResult;

const FIVE_FACTORS: SunTzuFiveFactor[] = [
  {
    factorHanja: '道 (도 - 대의와 신뢰)',
    factorKo: '목표에 대한 일체감과 상호 신뢰의 결속력',
    strategicSignificance: '명분 없는 싸움이나 불신에 기초한 협력은 작은 충격에도 쉽게 와해됩니다.',
    cultivationCounsel: '동료 및 상대방과의 공통된 대의명분을 분명히 밝히고 진실된 신뢰를 먼저 확보하십시오.',
  },
  {
    factorHanja: '天 (천 - 타이밍과 시세)',
    factorKo: '시대의 흐름과 기후, 최적의 타이밍 감각',
    strategicSignificance: '역풍에 무리하게 맞서지 않고 시대와 국면의 자연스러운 기운을 타는 지혜.',
    cultivationCounsel: '억지로 밀어붙이지 말고 무르익는 시점을 침착하게 기다리며 결단의 순간을 포착하십시오.',
  },
  {
    factorHanja: '地 (지 - 환경과 입지)',
    factorKo: '자신에게 유리한 환경과 유리한 고지 선점',
    strategicSignificance: '불리한 지형에서 소모전을 치르지 않고 내가 주도권을 쥘 수 있는 환경을 조성함.',
    cultivationCounsel: '자신에게 익숙하고 역량을 발휘하기 좋은 장과 조건을 전략적으로 선택하십시오.',
  },
  {
    factorHanja: '將 (장 - 리더십과 지혜)',
    factorKo: '지혜·신의·인애·용기·엄격함의 5대 덕목',
    strategicSignificance: '감정적인 분노나 조급함에 사로잡힌 지휘관은 반드시 계략에 말려듭니다.',
    cultivationCounsel: '냉철한 이성으로 감정을 다스리고, 신중함과 과감함을 겸비한 중심을 잡으십시오.',
  },
  {
    factorHanja: '法 (법 - 규율과 시스템)',
    factorKo: '명확한 규칙, 역할 분담, 지속 가능한 자원 관리',
    strategicSignificance: '임기응변에만 의존하지 않고 체계적인 시스템과 실행 루틴으로 승리를 뒷받침함.',
    cultivationCounsel: '원칙과 프로세스를 명료하게 정비하여 불필요한 마찰과 에너지 낭비를 차단하십시오.',
  },
];

const STRATEGIC_TACTICS: SunTzuStrategicTactic[] = [
  {
    tacticNameHanja: '避實擊虛 (피실격허)',
    tacticNameKo: '상대의 단단한 곳을 피하고 허술한 빈틈을 공략함',
    dynamicAction: '정면충돌의 소모전을 피하고 상대가 방비하지 않은 사각지대나 새로운 활로를 개척함',
    practicalExecution: '경쟁이 과열된 곳에서 힘을 빼지 말고, 아직 아무도 주목하지 않은 틈새와 본질적 가치에 집중하십시오.',
  },
  {
    tacticNameHanja: '不戰而屈人之兵 (부전승)',
    tacticNameKo: '싸우지 않고 상대를 온전히 감화시키거나 승리를 확정함',
    dynamicAction: '충돌과 파괴 대신 전략적 배치와 탁월한 협상력으로 상대를 스스로 물러서게 만듦',
    practicalExecution: '적대적 대립을 만들기보다 상대의 명분을 살려주며 자연스럽게 나의 뜻을 관철하는 상생의 길을 모색하십시오.',
  },
  {
    tacticNameHanja: '以迂爲直 (이우위직)',
    tacticNameKo: '돌아가는 길을 도리어 가장 빠른 지름길로 삼음',
    dynamicAction: '성급하게 직선으로 돌진하다 함정에 빠지지 않고, 한 템포 돌아서 상대의 허를 찌름',
    practicalExecution: '조급함을 가라앉히고 우회로를 택하십시오. 한 걸음 물러서 기반을 다지는 것이 결국 가장 빠른 지름길이 됩니다.',
  },
  {
    tacticNameHanja: '兵貴勝 不貴久 (병귀승 불구)',
    tacticNameKo: '승리를 귀하게 여기되 소모적인 장기전을 경계함',
    dynamicAction: '결단해야 할 때 과감하게 완결을 짓고 에너지가 끝없이 고갈되는 수렁을 방지함',
    practicalExecution: '불필요한 고민과 지리멸렬한 타협을 끊어내고, 핵심 과업에 집중하여 신속하고 깔끔하게 마무리를 지으십시오.',
  },
];

const TOPIC_GUIDANCE: Record<SunTzuQuestionTopic, {
  posture: string;
  practice: string;
  ritual: string;
  reflection: string;
}> = {
  relationship: {
    posture: '싸우지 않고 상대를 이해하며 명분을 살려주는 부전승(不戰勝)의 태도',
    practice: '감정적 맞대응으로 소모전을 치르기보다, 상대가 진짜로 지키고 싶어 하는 명분과 두려움을 먼저 읽으십시오.',
    ritual: '어려운 대화를 앞두고 상대와 내가 함께 얻을 수 있는 최소 공통분모 한 가지를 먼저 적어 보기.',
    reflection: '이 갈등에서 굳이 이기려 들지 않고도 내가 지키고 싶은 핵심 가치는 무엇입니까?',
  },
  decision: {
    posture: '막힌 정면을 뚫으려 힘 빼지 않고 물처럼 빈틈으로 흐르는 피실격허(避實擊虛)의 태도',
    practice: '지금 당장 모든 조건을 완벽히 정면 돌파하려 하기보다, 가장 적은 마찰로 주도권을 확보할 수 있는 입지와 시점을 고르십시오.',
    ritual: '선택지를 놓고 "내가 유리한 조건"과 "소모가 큰 함정"을 각각 두 줄로 정리해 보기.',
    reflection: '지금 이 일에서 정면충돌 대신 한 걸음 돌아가면 열리는 우회로(以迂爲直)는 어디에 있습니까?',
  },
  healing: {
    posture: '소모적인 장기전(久)을 멈추고 병력을 거두어 내실을 재정비하는 보전(保全)의 태도',
    practice: '이미 지친 상태에서 승부를 보려 들지 마십시오. 지금은 전선을 넓힐 때가 아니라 불필요한 전선을 정리하고 원기를 비축할 때입니다.',
    ritual: '오늘 에너지를 가장 많이 갉아먹는 일 하나를 보류 목록으로 옮기고 휴식 시간 확보하기.',
    reflection: '지금 내가 끝내지 못해 계속 기력을 빼앗기고 있는 소모전은 무엇입니까?',
  },
  reflection: {
    posture: '나와 상황을 냉철하게 비추어 위태로움을 피하는 지피지기(知彼知己)의 태도',
    practice: '기세나 희망적 관측이 아니라 현재 내가 가진 자원(道·天·地·將·法)과 빈틈을 있는 그대로 점검하십시오.',
    ritual: '현재 진행 중인 핵심 일 하나에 대해 "가장 잘 풀리는 조건"과 "가장 취약한 고리"를 나란히 적어 보기.',
    reflection: '지금의 형세에서 내가 과신하고 있거나 아직 살피지 못한 사각지대는 어디입니까?',
  },
};

function classifyQuestionTopic(question?: string): SunTzuQuestionTopic {
  const q = (question ?? '').toLowerCase();
  if (/연애|사랑|결혼|이별|사람|관계|친구|가족|동료|상사|갈등|협상|화해|소통/.test(q)) {
    return 'relationship';
  }
  if (/선택|결정|이직|창업|사업|계약|투자|진로|경쟁|전략|시험|방향|승부/.test(q)) {
    return 'decision';
  }
  if (/지치|힘들|불안|걱정|우울|슬픔|소진|번아웃|회복|휴식|지친/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

function getKstDateString(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function formatKstIso(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}

export function calculateSunTzuArtOfWarStrategy(
  profile: UserProfile,
  now: Date = new Date(),
  question?: string,
): SunTzuArtOfWarStrategyResult {
  const kstDate = getKstDateString(now);
  const questionTopic = classifyQuestionTopic(question);
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    kstDate +
    (question ?? '') +
    'SunTzuArtOfWarStrategy';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const fiveFactorsHarmonyScore = 67 + (absHash % 32);
  const unfoughtVictoryPowerScore = 64 + ((absHash >> 3) % 35);
  const situationalClarityScore = 62 + ((absHash >> 6) % 37);
  const waterFormFlexibilityScore = 65 + ((absHash >> 9) % 34);
  const deceptiveTimingMasteryScore = 61 + ((absHash >> 12) % 38);

  const factorIndex = (absHash >> 4) % FIVE_FACTORS.length;
  const tacticIndex = (absHash >> 7) % STRATEGIC_TACTICS.length;

  const focalFiveFactor = FIVE_FACTORS[factorIndex];
  const activeStrategicTactic = STRATEGIC_TACTICS[tacticIndex];
  const topicGuide = TOPIC_GUIDANCE[questionTopic];

  const counselTitle = `손자병법 전략: ${activeStrategicTactic.tacticNameHanja}`;
  const philosophicalGuidance = `전쟁은 국가의 대사요, 사생의 땅이며 존망의 도이니 깊이 살피지 않을 수 없습니다. ` +
    `현재 당면한 국면에서는 5사 중 '${focalFiveFactor.factorHanja}'의 정비가 최우선입니다. ${focalFiveFactor.cultivationCounsel} ` +
    `전술적으로는 '${activeStrategicTactic.tacticNameKo}(${activeStrategicTactic.tacticNameHanja})'의 원리를 적용하십시오. ${activeStrategicTactic.practicalExecution}`;

  const counselNote = `5사의 '${focalFiveFactor.factorHanja}' 정비와 '${activeStrategicTactic.tacticNameHanja}' 전술이 결합되어, 지금 국면을 '${topicGuide.posture}'로 안내합니다.`;
  const boundaryNotice = '이 관점은 《손자병법》의 형세 판단과 자원 배분 철학을 빌린 상징적 전략 성찰이며, 확정적 승패 예측이나 법률·투자 자문이 아닙니다.';

  return {
    engineVersion: SUNTZU_STRATEGY_VERSION,
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    strategicPosture: topicGuide.posture,
    fiveFactorsHarmonyScore,
    unfoughtVictoryPowerScore,
    situationalClarityScore,
    waterFormFlexibilityScore,
    deceptiveTimingMasteryScore,
    focalFiveFactor,
    activeStrategicTactic,
    practiceGuidance: topicGuide.practice,
    ritualAction: topicGuide.ritual,
    reflectionFocus: topicGuide.reflection,
    counselNote,
    boundaryNotice,
    sunTzuPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatSunTzuArtOfWarStrategyPrompt(res: SunTzuArtOfWarStrategyResult): string {
  return [
    `【손자병법 오사칠계 & 부전승 피실격허 전략 지표】`,
    `- 질문 맥락 초점: ${res.questionTopic} | 전략적 태도: ${res.strategicPosture}`,
    `- 핵심 정비 요소: ${res.focalFiveFactor.factorHanja} (${res.focalFiveFactor.factorKo})`,
    `- 전략적 의미: ${res.focalFiveFactor.strategicSignificance}`,
    `- 요소별 수양 조언: ${res.focalFiveFactor.cultivationCounsel}`,
    `- 당면 전략 전술: ${res.activeStrategicTactic.tacticNameHanja} [${res.activeStrategicTactic.tacticNameKo}]`,
    `- 전술적 실행 방침: ${res.activeStrategicTactic.practicalExecution}`,
    `- 맥락별 실행 조언: ${res.practiceGuidance}`,
    `- 오늘의 작은 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectionFocus}`,
    `- 핵심 조언 요약: ${res.counselNote}`,
    `- 해석 경계: ${res.boundaryNotice}`,
    `- 병법적 결단 지침: ${res.sunTzuPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
