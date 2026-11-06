/**
 * 고대 인도 바가바드 기타(Bhagavad Gita) 카르마 요가(Karma Yoga) & 니슈카마 카르마(Nishkama Karma) 무집착 행동 엔진
 *
 * 서기전 고대 인도 서사시 《마하바라타》의 정수 《바가바드 기타(Bhagavad Gita)》 원전 기반.
 * 1. 니슈카마 카르마(Nishkama Karma): "행위 그 자체에는 그대의 권리가 있으나, 그 결과의 열매에는 결코 권리가 없다 (Karmany evadhikaras te ma phaleshu kadachana)."
 * 2. 스와다르마(Swadharma): "남의 완벽한 의무보다 불완전하더라도 자신의 타고난 본분(Swadharma)을 행하는 것이 훨씬 수승하다."
 * 3. 사마트밤(Samatvam): "성공과 실패, 승리와 패배를 동등하게 바라보며 중심을 잃지 않는 것, 그것을 요가(Yoga)라 부른다."
 * 4. 요가스타 쿠루 카르마니(Yogasthah kuru karmani): "집착을 끊고 신성한 자아에 굳건히 서서 행위하라."
 *
 * @version LUCKEY-BHAGAVAD-GITA-KARMA-YOGA-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const BHAGAVAD_GITA_KARMA_YOGA_VERSION = 'LUCKEY-BHAGAVAD-GITA-KARMA-YOGA-v1.0.0';

export interface GitaStage {
  stageLevel: number;
  sanskritStage: string;
  stageNameKo: string;
  spiritualCore: string;
  karmaActionBlessing: string;
}

export interface BhagavadGitaKarmaYogaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  nishkamaKarmaDetachmentScore: number; // 니슈카마 카르마 행위 무집착 지수
  swadharmaCallingAlignment: number;   // 스와다르마 영혼 본분 일치도
  samatvamEquanimityIndex: number;     // 사마트밤 초연 평정심
  yogasthaSteadfastness: number;       // 요가스타 확고한 몰입도
  karmaphalaRenunciation: number;      // 결과 집착 포기 및 해탈 자유도
  // 세부 명세
  activeGitaStage: GitaStage;
  primaryGitaSutra: {
    themeKo: string;
    sanskritSloka: string;
    coreEssence: string;
    actionableDirective: string;
  };
  karmaYogaPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
}

export type BhagavadGitaKarmaYogaReport = BhagavadGitaKarmaYogaResult;

const GITA_STAGES: GitaStage[] = [
  {
    stageLevel: 1,
    sanskritStage: 'Vishada Yoga (환멸과 번뇌의 정화)',
    stageNameKo: '모든 혼란과 무력감을 솔직히 인정하고 진리에 귀의하는 정직 단계',
    spiritualCore: '내면의 나약함과 갈등을 속이지 않고 직시할 때 참된 각성의 문이 열린다.',
    karmaActionBlessing: '혼란스러울수록 억지로 해결하려 하지 말고 진실한 스승과 내면의 소리에 겸허히 귀를 기울임',
  },
  {
    stageLevel: 2,
    sanskritStage: 'Sankhya Yoga (불멸의 참나 자각)',
    stageNameKo: '영원불멸한 참나(Atman)를 자각하고 일시적인 현상에 흔들리지 않는 각성 단계',
    spiritualCore: '무기는 이 영혼을 베지 못하고 불은 태우지 못하며 물은 적시지 못한다.',
    karmaActionBlessing: '상황의 부침이나 타인의 평가에 위축되지 않고 본질적 불멸성에 확고히 서서 당당함을 회복함',
  },
  {
    stageLevel: 3,
    sanskritStage: 'Karma Yoga (사심 없는 신성한 행동)',
    stageNameKo: '결과의 득실에 연연하지 않고 오직 현재의 거룩한 소명에 전념하는 실천 단계',
    spiritualCore: '보상을 바라고 행하면 속박되지만, 헌신으로 행하면 곧바로 해탈의 길이 된다.',
    karmaActionBlessing: '성공과 실패의 두려움을 벗어던지고 지금 마땅히 취해야 할 최선의 조치를 기쁨으로 실행함',
  },
  {
    stageLevel: 4,
    sanskritStage: 'Jnana-Karma Sannyasa (지혜로 정화된 무위의 행위)',
    stageNameKo: '행위 속에서 쉼을 찾고 쉼 속에서 역동적인 행위를 이루는 원융 단계',
    spiritualCore: '지혜의 불꽃은 모든 업(Karma)의 번뇌를 태워 순수한 빛으로 변화시킨다.',
    karmaActionBlessing: '결과를 미리 계산하느라 소모되는 에너지를 원천 차단하여 극도의 집중력과 몰입을 발휘함',
  },
  {
    stageLevel: 5,
    sanskritStage: 'Bhakti & Moksha (신성한 합일과 궁극의 자유)',
    stageNameKo: '모든 행위와 열매를 우주의 신성에 봉헌하고 완전한 평온을 누리는 지복 단계',
    spiritualCore: '모든 의무와 걱정을 내게 맡겨라. 내가 그대를 온갖 번뇌에서 해방시키리라.',
    karmaActionBlessing: '결과에 대한 모든 부담을 우주적 섭리에 내맡기고 티끌만 한 불안도 없는 절대 평안을 누림',
  },
];

const GITA_SUTRAS = [
  {
    themeKo: '니슈카마 카르마 - 행위 자체에 전념하되 결과의 열매에 집착하지 말라',
    sanskritSloka: 'Karmany evadhikaras te ma phaleshu kadachana, Ma karma-phala-hetur bhur ma te sango stv akarmani',
    coreEssence: '오직 행위만이 그대의 몫이며 그 결과는 그대의 손에 달린 것이 아닙니다. 결과의 유혹에 이끌리지 말고 나태함에도 빠지지 마십시오.',
    actionableDirective: '결과가 어찌 될지 미리 불안해하거나 보상을 셈하지 말고, 오직 오늘 할 수 있는 가장 정갈한 노력을 쏟아부으십시오.',
  },
  {
    themeKo: '사마트밤 - 평정심이야말로 진정한 요가이다',
    sanskritSloka: 'Yogasthah kuru karmani sangam tyaktva Dhananjaya, Siddhy-asiddhyoh samo bhutva samatvam yoga ucyate',
    coreEssence: '성공과 실패에 마음이 흔들리지 않고 언제나 고요한 평정을 지키는 것이 진정한 영적 탁월함(Yoga)입니다.',
    actionableDirective: '일이 뜻대로 풀린다고 교만해지지 말고 뜻대로 되지 않는다고 낙담하지 말며 한결같은 호흡을 유지하십시오.',
  },
  {
    themeKo: '스와다르마 - 자신의 타고난 길을 걷는 것이 최선이다',
    sanskritSloka: 'Shreyan sva-dharmo vigunah para-dharmat sv-anushthitat, Sva-dharme nidhanam shreyah para-dharmo bhayavahah',
    coreEssence: '남의 완벽한 삶을 모방하려 애쓰는 것보다 서툴더라도 자신의 본분을 온전히 살아내는 것이 훨씬 위대하고 안전합니다.',
    actionableDirective: '남들과 비교하며 조급해하지 말고 자신만의 기질과 사명에 충실한 방식을 우직하게 고수하십시오.',
  },
  {
    themeKo: '영혼의 불멸성 - 진정한 자아는 상처받지 않는다',
    sanskritSloka: 'Nainam chindanti shastrani nainam dahati pavakah, Na cainam kledayanty apo na shoshayati marutah',
    coreEssence: '참된 자아는 어떤 칼날로도 벨 수 없고 어떤 불길로도 태울 수 없습니다. 외적 환경의 변화는 옷을 갈아입는 것에 불과합니다.',
    actionableDirective: '눈앞의 일시적인 실패나 손실을 두려워하지 말고 결코 상처 입지 않는 내면의 중심을 확인하십시오.',
  },
];

export function calculateBhagavadGitaKarmaYoga(profile: UserProfile): BhagavadGitaKarmaYogaResult {
  const seedString = (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    'BhagavadGitaKarmaYoga';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const nishkamaKarmaDetachmentScore = 60 + (absHash % 39);
  const swadharmaCallingAlignment = 62 + ((absHash >> 3) % 37);
  const samatvamEquanimityIndex = 58 + ((absHash >> 6) % 41);
  const yogasthaSteadfastness = 64 + ((absHash >> 9) % 35);
  const karmaphalaRenunciation = 56 + ((absHash >> 12) % 43);

  const stageIndex = (absHash >> 4) % GITA_STAGES.length;
  const sutraIndex = (absHash >> 7) % GITA_SUTRAS.length;

  const activeGitaStage = GITA_STAGES[stageIndex];
  const primaryGitaSutra = GITA_SUTRAS[sutraIndex];

  const counselTitle = `바가바드 기타 카르마 요가: ${activeGitaStage.sanskritStage}`;
  const philosophicalGuidance = `현재 마주한 과제에서 가장 중요한 열쇠는 '결과에 대한 집착을 내려놓는 것(Nishkama Karma)'입니다. ` +
    `결과를 통제하려 들면 불안과 속박이 따르지만, 행위 자체를 신성한 소명으로 대하면 엄청난 자유와 집중력이 솟아납니다. ` +
    `${activeGitaStage.karmaActionBlessing}을 실천하십시오. 평정심(Samatvam)을 지키며 오직 현재의 올바른 행위에 몰입하십시오.`;

  return {
    engineVersion: BHAGAVAD_GITA_KARMA_YOGA_VERSION,
    calculatedAtKst: new Date().toISOString(),
    nishkamaKarmaDetachmentScore,
    swadharmaCallingAlignment,
    samatvamEquanimityIndex,
    yogasthaSteadfastness,
    karmaphalaRenunciation,
    activeGitaStage,
    primaryGitaSutra,
    karmaYogaPhilosophicalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
  };
}

export function formatBhagavadGitaKarmaYogaPrompt(res: BhagavadGitaKarmaYogaResult): string {
  return [
    `【고대 인도 바가바드 기타(Bhagavad Gita) 카르마 요가 & 무집착 행동 지표】`,
    `- 니슈카마 카르마(Nishkama Karma) 행위 무집착 지수: ${res.nishkamaKarmaDetachmentScore}/100`,
    `- 스와다르마(Swadharma) 영혼 본분 일치도: ${res.swadharmaCallingAlignment}/100`,
    `- 사마트밤(Samatvam) 초연 평정심: ${res.samatvamEquanimityIndex}/100`,
    `- 요가스타(Yogastha) 확고한 몰입도: ${res.yogasthaSteadfastness}/100`,
    `- 카르마팔라(Karmaphala) 결과 집착 포기 자유도: ${res.karmaphalaRenunciation}/100`,
    `- 현재 영적 행위 단계: ${res.activeGitaStage.sanskritStage} (${res.activeGitaStage.stageNameKo})`,
    `- 핵심 영적 가르침: ${res.activeGitaStage.spiritualCore}`,
    `- 바가바드 기타 경구: "${res.primaryGitaSutra.themeKo}" [${res.primaryGitaSutra.sanskritSloka}]`,
    `- 실천적 조언: ${res.primaryGitaSutra.actionableDirective}`,
    `- 철학적 처방: ${res.karmaYogaPhilosophicalCounsel.philosophicalGuidance}`,
  ].join('\n');
}
