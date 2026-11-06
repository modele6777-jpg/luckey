/**
 * 고대 중국 도가 노자(老子) 도덕경(道德經) 상선약수(上善若水) & 무위자연(無爲自然) 유약승강강(柔弱勝剛强) 엔진
 *
 * 춘추전국시대 도가 시조 노자의 《도덕경(道德經)》 81장 원전 기반.
 * 1. 상선약수(上善若水): "최상의 선은 물과 같다. 만물을 이롭게 하되 다투지 아니하고 가장 낮은 곳에 머문다."
 * 2. 무위자연(無爲自然): "도는 언제나 억지로 함이 없으되(無爲) 이루어지지 않는 것이 없다(無不爲)."
 * 3. 유약승강강(柔弱勝剛强): "천하에 물보다 부드러운 것은 없으나, 굳고 강한 것을 꺾는 데 물을 당할 자 없다."
 * 4. 화광동진(和光同塵): "자신의 빛을 늦추고 세상의 먼지와 함께 어우러진다."
 *
 * @version LUCKEY-LAOZI-WATER-VIRTUE-WUWEI-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const LAOZI_WATER_VIRTUE_WUWEI_VERSION = 'LUCKEY-LAOZI-WATER-VIRTUE-WUWEI-v1.0.0';

export interface LaoziWaterStage {
  stageLevel: number;
  stageNameHanja: string;
  stageNameKo: string;
  daodejingPrinciple: string;
  actionBlessing: string;
}

export interface LaoziWaterVirtueWuweiResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  waterVirtueFlexibilityIndex: number; // 상선약수 유연 적응도
  wuweiNatureHarmonyScore: number;     // 무위자연 순리 지수
  yieldingOverHardStrength: number;    // 유약승강강 내적 침투력
  profoundVirtueStillness: number;     // 현덕(玄德) 무욕 평정심
  nonContentionWisdom: number;         // 부쟁(不爭) 화광동진 지혜도
  // 세부 명세
  activeWaterStage: LaoziWaterStage;
  primaryWaterVirtueAphorism: {
    themeKo: string;
    hanjaClassic: string;
    coreEssence: string;
    actionableDirective: string;
  };
  wuweiPhilosophicalGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export type LaoziWaterVirtueWuweiReport = LaoziWaterVirtueWuweiResult;

const LAOZI_WATER_STAGES: LaoziWaterStage[] = [
  {
    stageLevel: 1,
    stageNameHanja: '居善地 (거선지: 가장 낮은 곳의 지혜)',
    stageNameKo: '낮은 곳으로 임하여 만물의 신뢰를 얻는 겸허 단계',
    daodejingPrinciple: '물은 뭇사람들이 싫어하는 낮은 곳으로 향하기에 도(道)에 가장 가깝다.',
    actionBlessing: '교만을 내려놓고 겸손하게 기초를 다져 결코 무너지지 않는 기반을 확보함',
  },
  {
    stageLevel: 2,
    stageNameHanja: '心善淵 (심선연: 깊은 연못의 고요)',
    stageNameKo: '번뇌와 조급함을 가라앉히고 본질을 비추는 청정 단계',
    daodejingPrinciple: '마음의 앙금이 가라앉아 맑아지듯, 고요함 속에 모든 상황의 해답이 비친다.',
    actionBlessing: '외부 자극에 휘둘리지 않고 내면의 깊은 침묵 속에서 최선의 결단을 도출함',
  },
  {
    stageLevel: 3,
    stageNameHanja: '與善仁 (여선인: 아낌없이 베푸는 자비)',
    stageNameKo: '대가와 공치사를 바라지 않고 세상을 윤택하게 하는 상생 단계',
    daodejingPrinciple: '낳되 소유하지 않고 베풀되 의탁하지 않으며 길러내되 주재하지 않는다(玄德).',
    actionBlessing: '계산 없는 진심 어린 기여로 주변 사람들의 자발적인 존경과 협력을 이끌어냄',
  },
  {
    stageLevel: 4,
    stageNameHanja: '言善信 & 事善能 (언선신·사선능: 참된 신뢰와 탁월한 역량)',
    stageNameKo: '물처럼 막힘없이 그릇에 맞추어 유연하게 성취하는 적응 단계',
    daodejingPrinciple: '네모난 그릇엔 네모나게, 둥근 그릇엔 둥글게 적응하되 본래의 성질을 잃지 않는다.',
    actionBlessing: '불필요한 마찰을 만들지 않고 환경의 결을 타고 매끄럽게 문제를 완결함',
  },
  {
    stageLevel: 5,
    stageNameHanja: '動善時 & 不爭 (동선시·부쟁: 최적의 타이밍과 무쟁의 평정)',
    stageNameKo: '때를 기다려 비로소 움직이며 누구와도 다투지 않고 천하를 얻는 완성 단계',
    daodejingPrinciple: '오직 다투지 아니하므로 천하에 그와 맞서 겨룰 자가 없다(夫唯不爭 故無尤).',
    actionBlessing: '억지 힘을 쓰지 않고도 순리의 파도를 타고 결정적 성공을 거두는 대자유',
  },
];

const DAODEJING_APHORISMS = [
  {
    themeKo: '상선약수(上善若水) - 가장 좋은 것은 물과 같다',
    hanjaClassic: '上善若水 水善利萬物而不爭 處衆人之所惡 故幾於道',
    coreEssence: '가장 훌륭한 덕은 물처럼 만물을 이롭게 하면서도 공을 다투지 않고 낮은 곳에 머무는 것입니다.',
    actionableDirective: '고집을 세워 부딪히려 하지 말고 물처럼 유연하게 자세를 낮추어 상대를 포용하십시오.',
  },
  {
    themeKo: '무위자연(無爲自然) - 억지 부림 없이 온전함을 이룬다',
    hanjaClassic: '道常無爲而無不爲 侯王若能守之 萬物將自化',
    coreEssence: '억지 조작을 버리고 자연스러운 순리에 맡길 때 비로소 모든 일이 어긋남 없이 완성됩니다.',
    actionableDirective: '조급한 마음으로 결과를 억지로 통제하려 하지 말고 자연스럽게 때가 무르익기를 기다리십시오.',
  },
  {
    themeKo: '유약승강강(柔弱勝剛强) - 부드러움이 강함을 이긴다',
    hanjaClassic: '天下莫柔弱於水 而攻堅强者 莫之能勝 以其無以易之 故柔之勝剛 弱之勝强',
    coreEssence: '살아 있는 것은 부드럽고 유연하며 죽은 것은 굳고 딱딱합니다. 부드러움이야말로 가장 강한 생명력입니다.',
    actionableDirective: '정면 대결의 경직된 태도를 피하고 유연한 경청과 우회 전술로 단단한 장벽을 녹여내십시오.',
  },
  {
    themeKo: '지족상족(知足常足) - 족함을 알면 언제나 풍요롭다',
    hanjaClassic: '禍莫大於不知足 咎莫大於欲得 故知足之足 常足矣',
    coreEssence: '진정한 부유함은 밖에서 더 많이 얻는 데 있는 것이 아니라 지금 가진 것에 만족할 줄 아는 내면에 있습니다.',
    actionableDirective: '지나친 욕심으로 무리한 확장을 꾀하기보다 이미 손안에 있는 소중한 기본과 바탕을 견고히 하십시오.',
  },
  {
    themeKo: '화광동진(和光同塵) - 빛을 감추고 세상과 하나 되다',
    hanjaClassic: '挫其銳 解其紛 和其光 同其塵 是謂玄同',
    coreEssence: '자신의 날카로움을 꺾고 분란을 풀며, 드러난 재주를 안으로 감추어 세상과 조화롭게 녹아듭니다.',
    actionableDirective: '우월감을 드러내어 시기심을 사지 말고 상대방의 눈높이에 맞춰 겸허하게 협력하십시오.',
  },
];

export function calculateLaoziWaterVirtueWuwei(profile: UserProfile): LaoziWaterVirtueWuweiResult {
  const seedString = (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'LaoziWaterVirtueWuwei';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const waterVirtueFlexibilityIndex = 60 + (absHash % 39);
  const wuweiNatureHarmonyScore = 58 + ((absHash >> 3) % 41);
  const yieldingOverHardStrength = 62 + ((absHash >> 6) % 37);
  const profoundVirtueStillness = 55 + ((absHash >> 9) % 43);
  const nonContentionWisdom = 60 + ((absHash >> 12) % 39);

  const stageIndex = (absHash >> 4) % LAOZI_WATER_STAGES.length;
  const aphorismIndex = (absHash >> 7) % DAODEJING_APHORISMS.length;

  const activeWaterStage = LAOZI_WATER_STAGES[stageIndex];
  const primaryWaterVirtueAphorism = DAODEJING_APHORISMS[aphorismIndex];

  const guidanceTitle = `노자 도덕경의 물의 처세: ${activeWaterStage.stageNameHanja}`;
  const philosophicalCounsel = `현재는 억지로 밀어붙이기보다 상선약수(上善若水)의 유연성을 발휘할 최적의 시점입니다. ` +
    `상대나 상황과 각을 세우지 말고 물처럼 형태를 바꾸어 장애물을 감싸 안으십시오. ` +
    `${activeWaterStage.actionBlessing}을 가슴에 새기고 실천할 때, 다투지 않고도 온전한 승리와 평정을 거머쥐게 됩니다.`;

  return {
    engineVersion: LAOZI_WATER_VIRTUE_WUWEI_VERSION,
    calculatedAtKst: new Date().toISOString(),
    waterVirtueFlexibilityIndex,
    wuweiNatureHarmonyScore,
    yieldingOverHardStrength,
    profoundVirtueStillness,
    nonContentionWisdom,
    activeWaterStage,
    primaryWaterVirtueAphorism,
    wuweiPhilosophicalGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatLaoziWaterVirtueWuweiPrompt(res: LaoziWaterVirtueWuweiResult): string {
  return [
    `【고대 중국 도가 노자(老子) 도덕경 상선약수(上善若水) & 무위자연(無爲自然) 지표】`,
    `- 상선약수 유연 적응도: ${res.waterVirtueFlexibilityIndex}/100`,
    `- 무위자연 순리 조화도: ${res.wuweiNatureHarmonyScore}/100`,
    `- 유약승강강 내적 침투력: ${res.yieldingOverHardStrength}/100`,
    `- 현덕(玄德) 무욕 평정심: ${res.profoundVirtueStillness}/100`,
    `- 부쟁(不爭) 화광동진 지혜: ${res.nonContentionWisdom}/100`,
    `- 현재 도덕경 실천 단계: ${res.activeWaterStage.stageNameHanja} (${res.activeWaterStage.stageNameKo})`,
    `- 도덕경 핵심 경구: "${res.primaryWaterVirtueAphorism.themeKo}" [${res.primaryWaterVirtueAphorism.hanjaClassic}]`,
    `- 실천적 조언: ${res.primaryWaterVirtueAphorism.actionableDirective}`,
    `- 철학적 처방: ${res.wuweiPhilosophicalGuidance.philosophicalCounsel}`,
  ].join('\n');
}
