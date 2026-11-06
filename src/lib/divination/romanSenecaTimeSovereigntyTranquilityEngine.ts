/**
 * 고대 로마 세네카(Seneca) 인생의 짧음에 대하여(De Brevitate Vitae) & 시간 주권 평정 엔진
 *
 * 서기 1세기 로마 스토아 철학자 세네카의 《인생의 짧음에 대하여(De Brevitate Vitae)》 및 《마음의 평정에 대하여(De Tranquillitate Animi)》 원전 기반.
 * 1. 시간 주권의 탈환(Vindica te tibi): "시간을 그대 자신에게 되돌려주라. 인생이 짧은 것이 아니라 우리가 많은 시간을 낭비하는 것이다."
 * 2. 유예 없는 삶(Non differtur vita): 삶을 미래로 미루지 말고 오늘 이 순간을 온전히 살아내라.
 * 3. 마음의 평정(Tranquillitas Animi): 불안과 동요(Fluctuatio)에서 벗어나 흔들리지 않는 내면의 고요를 유지하라.
 * 4. 영혼의 자족(Autarkeia): 외적인 소유와 인정에 휘둘리지 않고 스스로 온전한 내적 만족에 이름.
 * 5. 죽음의 직시와 현재의 존엄(Memento Mori & Dignitas): 유한성을 직시함으로써 모든 순간을 가장 숭고하게 벼려내는 힘.
 *
 * @version LUCKEY-SENECA-TIME-SOVEREIGNTY-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const SENECA_TIME_SOVEREIGNTY_VERSION = 'LUCKEY-SENECA-TIME-SOVEREIGNTY-v1.0.0';

export interface SenecaStage {
  stageLevel: number;
  stageNameLatin: string;
  stageNameKo: string;
  stoicTimePrinciple: string;
  actionBlessing: string;
}

export interface SenecaTimeSovereigntyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  timeSovereigntyReclaimScore: number;  // 시간 주권 탈환도
  tranquillitasInnerPeaceIndex: number; // 마음의 평정 트란퀼리타스 지수
  presentMomentLivingPower: number;     // 현재 현존 유예 없는 삶의 힘
  stoicAutarkeiaResilience: number;     // 스토아적 자족 탄력성
  animiFluctuatioRelief: number;        // 불안 동요 치유 해소력
  // 세부 명세
  activeSenecaStage: SenecaStage;
  primarySenecaAphorism: {
    themeKo: string;
    latinClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  senecaPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type SenecaTimeSovereigntyReport = SenecaTimeSovereigntyResult;

const SENECA_STAGES: SenecaStage[] = [
  {
    stageLevel: 1,
    stageNameLatin: 'Vindica Te Tibi (시간의 회수)',
    stageNameKo: '남들에게 빼앗겼던 소중한 시간을 온전히 자신에게 돌려놓는 결단',
    stoicTimePrinciple: '우리는 재산은 아끼면서도 가장 돌이킬 수 없는 자산인 시간은 너무도 쉽게 남에게 내어줍니다.',
    actionBlessing: '타인의 무의미한 요구와 헛된 의무에 끌려다니지 말고 오늘 나의 온전한 시간을 선언하십시오.',
  },
  {
    stageLevel: 2,
    stageNameLatin: 'Non Differtur Vita (삶의 유예 중단)',
    stageNameKo: '언젠가 살겠다는 거짓된 약속을 멈추고 지금 이 순간을 사는 태도',
    stoicTimePrinciple: '미래를 기다리느라 현재를 흘려보내는 것이 삶의 가장 큰 낭비입니다.',
    actionBlessing: '중요한 일을 미래로 미루지 말고 오늘 당장 내 영혼이 기뻐하는 한 걸음을 실행하십시오.',
  },
  {
    stageLevel: 3,
    stageNameLatin: 'Tranquillitas Animi (마음의 평정)',
    stageNameKo: '세상의 요동과 내면의 권태를 넘어선 깊고 맑은 고요함',
    stoicTimePrinciple: '외부 조건에 흔들리지 않고 자신의 내적 질서를 확고히 세울 때 참된 평화가 깃듭니다.',
    actionBlessing: '불안과 성급한 조바심을 가라앉히고 오직 내가 통제할 수 있는 영역에 집중하십시오.',
  },
  {
    stageLevel: 4,
    stageNameLatin: 'Autarkeia & Otium (숭고한 여가와 자족)',
    stageNameKo: '불멸의 지혜와 대화하며 온전한 자기 충만에 이르는 삶',
    stoicTimePrinciple: '과거의 위대한 사상들과 교명하며 자신만의 고요한 내면 궁전을 구축하는 고귀함입니다.',
    actionBlessing: '소음 가득한 바깥을 떠나 깊은 독서와 사색으로 영혼의 자족감을 단단히 채우십시오.',
  },
];

const SENECA_APHORISMS = [
  {
    themeKo: '시간 주권 - 인생은 짧지 않다',
    latinClassic: 'Non exiguum temporis habemus, sed multum perdidimus',
    coreEssence: '우리가 가진 시간이 적은 것이 아니라, 우리가 너무 많은 시간을 낭비하고 있을 뿐입니다.',
    actionableDirective: '시간이 부족하다고 탓하지 말고 무가치한 곳으로 새어나가는 시간의 틈을 철저히 막으십시오.',
  },
  {
    themeKo: '현재의 온전한 수용 - 오늘을 붙잡으라',
    latinClassic: 'Omnia quae ventura sunt in incerto iacent: protinus vive',
    coreEssence: '앞으로 올 모든 것은 불확실성 속에 놓여 있으니, 지금 당장 온 힘을 다해 사십시오.',
    actionableDirective: '아직 오지 않은 내일의 두려움에 오늘을 저당잡히지 말고 지금 손에 쥔 시간에 충실하십시오.',
  },
  {
    themeKo: '마음의 평정 - 영혼의 닻을 내림',
    latinClassic: 'Tranquillitas est non concuti animi stabilitas',
    coreEssence: '참된 평정이란 어떤 폭풍우가 몰아쳐도 결코 흔들리지 않는 영혼의 확고한 안정성입니다.',
    actionableDirective: '주변의 잡음과 변덕에 반응하지 말고 고요한 호수처럼 내면의 중심을 지키십시오.',
  },
  {
    themeKo: '영혼의 친구 - 참된 자기 자신과의 만남',
    latinClassic: 'Nemo sibi tantummodo errat, sed alieni erroris et causa et auctor est',
    coreEssence: '군중의 어리석은 흐름에 휩쓸리지 않고 홀로 있어도 외롭지 않은 단단한 자아를 확립하십시오.',
    actionableDirective: '남들의 인정이나 시선에 구걸하지 말고 스스로에게 부끄러움 없는 떳떳한 친구가 되십시오.',
  },
];

export function calculateSenecaTimeSovereignty(profile: UserProfile): SenecaTimeSovereigntyResult {
  const seedString = (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'SenecaTimeSovereignty';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const timeSovereigntyReclaimScore = 65 + (absHash % 34);
  const tranquillitasInnerPeaceIndex = 62 + ((absHash >> 3) % 37);
  const presentMomentLivingPower = 64 + ((absHash >> 6) % 35);
  const stoicAutarkeiaResilience = 61 + ((absHash >> 9) % 38);
  const animiFluctuatioRelief = 59 + ((absHash >> 12) % 40);

  const stageIndex = (absHash >> 4) % SENECA_STAGES.length;
  const aphorismIndex = (absHash >> 7) % SENECA_APHORISMS.length;

  const activeSenecaStage = SENECA_STAGES[stageIndex];
  const primarySenecaAphorism = SENECA_APHORISMS[aphorismIndex];

  const counselTitle = `세네카 시간 주권과 평정: ${activeSenecaStage.stageNameLatin}`;
  const philosophicalGuidance = `현재 상황에서 가장 절실한 것은 외부의 요구에 휘둘리지 않고 시간 주권(Vindica te tibi)을 탈환하는 것입니다. ` +
    `${activeSenecaStage.stoicTimePrinciple}의 교훈을 마음에 두십시오. ` +
    `${activeSenecaStage.actionBlessing} 삶을 뒤로 미루지 않고(Non differtur vita) 지금 이 순간에 현존할 때 비로소 어떤 불안에도 흔들리지 않는 마음의 평정(Tranquillitas)을 누리게 됩니다.`;

  return {
    engineVersion: SENECA_TIME_SOVEREIGNTY_VERSION,
    calculatedAtKst: new Date().toISOString(),
    timeSovereigntyReclaimScore,
    tranquillitasInnerPeaceIndex,
    presentMomentLivingPower,
    stoicAutarkeiaResilience,
    animiFluctuatioRelief,
    activeSenecaStage,
    primarySenecaAphorism,
    senecaPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatSenecaTimeSovereigntyPrompt(res: SenecaTimeSovereigntyResult): string {
  return [
    `【고대 로마 세네카 인생의 짧음에 대하여 & 시간 주권 평정 지표】`,
    `- 시간 주권 탈환도: ${res.timeSovereigntyReclaimScore}/100`,
    `- 마음의 평정 트란퀼리타스: ${res.tranquillitasInnerPeaceIndex}/100`,
    `- 현재 현존 유예 없는 삶의 힘: ${res.presentMomentLivingPower}/100`,
    `- 스토아적 자족 탄력성: ${res.stoicAutarkeiaResilience}/100`,
    `- 불안 동요 치유 해소력: ${res.animiFluctuatioRelief}/100`,
    `- 현재 평정 단계: ${res.activeSenecaStage.stageNameLatin} (${res.activeSenecaStage.stageNameKo})`,
    `- 시간 철학 원리: ${res.activeSenecaStage.stoicTimePrinciple}`,
    `- 세네카 명언: "${res.primarySenecaAphorism.themeKo}" [${res.primarySenecaAphorism.latinClassic}]`,
    `- 본질 해설: ${res.primarySenecaAphorism.coreEssence}`,
    `- 실천적 조언: ${res.primarySenecaAphorism.actionableDirective}`,
    `- 철학적 처방: ${res.senecaPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
