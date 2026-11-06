/**
 * 고대 중국 춘추전국시대 손무(孫武) 《손자병법(孫子兵法)》 오사칠계(五事七計) & 부전승(不戰勝) 피실격허(避實擊虛) 전략 엔진
 *
 * 손무의 《손자병법(孫子兵法)》 13편 원전 기반.
 * 1. 오사(五事): 결단과 형세의 승패를 결정짓는 5대 근본 요소
 *    - 도(道): 대의명분과 신뢰, 상하가 한마음이 되는 일체감.
 *    - 천(天): 때와 기회, 타이밍과 계절적 흐름.
 *    - 지(地): 지형과 환경, 유리한 입지와 공간 조건.
 *    - 장(將): 지혜(智), 신의(信), 인자함(仁), 용기(勇), 엄격함(嚴)의 5대 리더십 덕목.
 *    - 법(法): 시스템과 규율, 명확한 프로세스와 지속 가능한 자원 배분.
 * 2. 부전이굴인지병(不戰而屈人之兵): 싸우지 않고 상대를 굴복시키고 목적을 달성하는 최상의 지혜(善之善者也).
 * 3. 지피지기 백전불태(知彼知己 百戰不殆): 나와 상대, 환경의 역학 관계를 꿰뚫어 위태로움에 빠지지 않음.
 * 4. 피실격허(避實擊虛)와 수형(水形): 물이 높은 곳을 피하고 낮은 곳으로 흐르듯, 적의 강점을 피하고 허점을 짚음.
 * 5. 이우위직(以迂爲直): 돌아가는 우회로를 도리어 가장 빠른 지름길로 삼는 역발상 전략.
 *
 * @version LUCKEY-SUNTZU-STRATEGY-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const SUNTZU_STRATEGY_VERSION = 'LUCKEY-SUNTZU-STRATEGY-v1.0.0';

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
  // 5대 핵심 지표 (0~100)
  fiveFactorsHarmonyScore: number;       // 오사(도·천·지·장·법) 전략적 종합 균형도
  unfoughtVictoryPowerScore: number;     // 부전승(不戰勝) 비폭력적 굴적 지혜 지수
  situationalClarityScore: number;       // 지피지기(知彼知己) 상황 및 역학 명석도
  waterFormFlexibilityScore: number;     // 수형(水形) 피실격허 유연 적응도
  deceptiveTimingMasteryScore: number;   // 이우위직(以迂爲直) 우회 결단 및 타이밍 장악력
  // 세부 명세
  focalFiveFactor: SunTzuFiveFactor;
  activeStrategicTactic: SunTzuStrategicTactic;
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

export function calculateSunTzuArtOfWarStrategy(profile: UserProfile): SunTzuArtOfWarStrategyResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
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

  const counselTitle = `손자병법 전략: ${activeStrategicTactic.tacticNameHanja}`;
  const philosophicalGuidance = `전쟁은 국가의 대사요, 사생의 땅이며 존망의 도이니 깊이 살피지 않을 수 없습니다. ` +
    `현재 당면한 국면에서는 5사 중 '${focalFiveFactor.factorHanja}'의 정비가 최우선입니다. ${focalFiveFactor.cultivationCounsel} ` +
    `전술적으로는 '${activeStrategicTactic.tacticNameKo}(${activeStrategicTactic.tacticNameHanja})'의 원리를 적용하십시오. ${activeStrategicTactic.practicalExecution}`;

  return {
    engineVersion: SUNTZU_STRATEGY_VERSION,
    calculatedAtKst: new Date().toISOString(),
    fiveFactorsHarmonyScore,
    unfoughtVictoryPowerScore,
    situationalClarityScore,
    waterFormFlexibilityScore,
    deceptiveTimingMasteryScore,
    focalFiveFactor,
    activeStrategicTactic,
    sunTzuPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatSunTzuArtOfWarStrategyPrompt(res: SunTzuArtOfWarStrategyResult): string {
  return [
    `【손자병법 오사칠계 & 부전승 피실격허 전략 지표】`,
    `- 5사(도·천·지·장·법) 균형도: ${res.fiveFactorsHarmonyScore}/100`,
    `- 부전승 비폭력 굴적 지혜: ${res.unfoughtVictoryPowerScore}/100`,
    `- 지피지기 상황 명석도: ${res.situationalClarityScore}/100`,
    `- 수형 피실격허 유연 적응도: ${res.waterFormFlexibilityScore}/100`,
    `- 이우위직 타이밍 장악력: ${res.deceptiveTimingMasteryScore}/100`,
    `- 핵심 정비 요소: ${res.focalFiveFactor.factorHanja} (${res.focalFiveFactor.factorKo})`,
    `- 전략적 의미: ${res.focalFiveFactor.strategicSignificance}`,
    `- 요소별 수양 조언: ${res.focalFiveFactor.cultivationCounsel}`,
    `- 당면 전략 전술: ${res.activeStrategicTactic.tacticNameHanja} [${res.activeStrategicTactic.tacticNameKo}]`,
    `- 전술적 실행 방침: ${res.activeStrategicTactic.practicalExecution}`,
    `- 병법적 결단 지침: ${res.sunTzuPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
