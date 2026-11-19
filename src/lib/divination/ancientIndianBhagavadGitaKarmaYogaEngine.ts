/**
 * 고대 인도 바가바드 기타(Bhagavad Gita) 카르마 요가(Karma Yoga) & 니슈카마 카르마(Nishkama Karma) 무집착 행동 엔진
 *
 * 서기전 고대 인도 서사시 《마하바라타》의 정수 《바가바드 기타(Bhagavad Gita)》 원전 기반.
 * 1. 니슈카마 카르마(Nishkama Karma): "행위 그 자체에는 그대의 권리가 있으나, 그 결과의 열매에는 결코 권리가 없다 (Karmany evadhikaras te ma phaleshu kadachana)."
 * 2. 스와다르마(Swadharma): "남의 완벽한 의무보다 불완전하더라도 자신의 타고난 본분(Swadharma)을 행하는 것이 훨씬 수승하다."
 * 3. 사마트밤(Samatvam): "성공과 실패, 승리와 패배를 동등하게 바라보며 중심을 잃지 않는 것, 그것을 요가(Yoga)라 부른다."
 * 4. 요가스타 쿠루 카르마니(Yogasthah kuru karmani): "집착을 끊고 신성한 자아에 굳건히 서서 행위하라."
 *
 * @version LUCKEY-BHAGAVAD-GITA-KARMA-YOGA-v2.3.0
 */

import type { UserProfile } from '../sharedState';

export const BHAGAVAD_GITA_KARMA_YOGA_VERSION = 'LUCKEY-BHAGAVAD-GITA-KARMA-YOGA-v2.4.0';

function getGitaKstString(now?: Date): string {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 3600 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;
}

export interface GitaStage {
  stageLevel: number;
  sanskritStage: string;
  stageNameKo: string;
  spiritualCore: string;
  karmaActionBlessing: string;
}

export interface GitaSituationalKarmaAudit {
  themeKo: string;
  chapterVerse: string;
  sanskritQuote: string;
  translationKo: string;
  attachmentTrap: string;
  nishkamaActionStep: string;
}

export interface GitaTemporalGunaRhythm {
  kstWindow: string;
  seasonalTone: string;
  dominantGuna: 'Sattva (조화·맑음)' | 'Rajas (역동·추진)' | 'Tamas (안정·침잠)';
  sattvaEquanimityIndex: number;
  rhythmDirective: string;
}

export interface GitaKarmaYogaMatrix {
  detachmentMastery: number;
  swadharmaClarity: number;
  samatvamResilience: number;
  overallSynthesis: number;
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
  situationalKarmaAudit: GitaSituationalKarmaAudit;
  temporalGunaRhythm: GitaTemporalGunaRhythm;
  karmaYogaMatrix: GitaKarmaYogaMatrix;
  karmaYogaPhilosophicalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
  gitaSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
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

function buildSituationalKarmaAudit(question?: string): GitaSituationalKarmaAudit {
  const q = (question ?? '').trim();
  if (/결과|성공|보상|돈|성과|합격|불안/.test(q)) {
    return {
      themeKo: '결과의 열매 내려놓기 (Nishkama Karma)',
      chapterVerse: '《바가바드 기타》 2장 47절',
      sanskritQuote: 'Karmany evadhikaras te ma phaleshu kadachana',
      translationKo: '그대에게 권리가 있는 것은 오직 행위 자체뿐이며, 그 결과의 열매에는 결코 권리가 없다.',
      attachmentTrap: '아직 손에 오지 않은 보상을 먼저 계산하느라 지금 이 순간의 집중력을 잃어버리는 조바심.',
      nishkamaActionStep: '성과 지표를 잠시 가려 두고, 오늘 내가 맑은 마음으로 완수할 수 있는 작업 1단위에만 온전히 몰입하십시오.',
    };
  }
  if (/비교|진로|적성|길|선택|이직|본분/.test(q)) {
    return {
      themeKo: '자기 본분 수호 (Swadharma)',
      chapterVerse: '《바가바드 기타》 3장 35절',
      sanskritQuote: 'Shreyan sva-dharmo vigunah para-dharmat sv-anushthitat',
      translationKo: '남의 길을 완벽하게 흉내 내는 것보다 서툴더라도 자신의 본분(Swadharma)을 걷는 것이 훨씬 수승하다.',
      attachmentTrap: '타인의 화려한 속도와 궤도를 부러워하며 내 고유한 기질과 소명을 저버리는 비교의 함정.',
      nishkamaActionStep: '남의 기준이 아닌, 내가 가장 정직하게 책임을 질 수 있는 고유한 역할 한 가지를 중심축으로 세우십시오.',
    };
  }
  if (/실패|포기|좌절|두려움|상처|잃/.test(q)) {
    return {
      themeKo: '성패 초월의 평정심 (Samatvam)',
      chapterVerse: '《바가바드 기타》 2장 48절',
      sanskritQuote: 'Siddhy-asiddhyoh samo bhutva samatvam yoga ucyate',
      translationKo: '성취와 불성취를 동등하게 바라보며 중심을 잃지 않는 평정심, 바로 그것이 요가다.',
      attachmentTrap: '일시적 좌절을 존재 전체의 패배로 동일시해 아예 행동 자체를 멈춰 버리는 위축.',
      nishkamaActionStep: '지금 겪은 실패를 영혼의 훼손이 아닌 데이터로만 받아들이고, 작고 단순한 다음 실행 1건을 다시 여십시오.',
    };
  }
  if (/관계|의무|갈등|가족|사람|책임/.test(q)) {
    return {
      themeKo: '자비와 비집착의 조화 (Loka-sangraha)',
      chapterVerse: '《바가바드 기타》 3장 20절 · 12장 13절',
      sanskritQuote: 'Adveshta sarva-bhutanam maitrah karuna eva cha',
      translationKo: '어느 존재도 미워하지 않고 벗처럼 자애로우며, 집착과 아집에서 벗어난 자가 참으로 성숙하다.',
      attachmentTrap: '상대를 내 뜻대로 바꾸려 하거나 감사받기 위해 베풀다가 서운함에 빠지는 조건부 의무감.',
      nishkamaActionStep: '대가나 즉각적 인정을 바라지 않고 내가 건넬 수 있는 정갈한 친절과 경계만 묵묵히 실행하십시오.',
    };
  }
  return {
    themeKo: '마음의 요동 정화와 흔들리지 않는 실행 (Yogastha)',
    chapterVerse: '《바가바드 기타》 6장 35절 · 18장 66절',
    sanskritQuote: 'Abhyasena tu kaunteya vairagyena cha grihyate',
    translationKo: '방황하는 마음도 꾸준한 수련(Abhyasa)과 집착 내려놓기(Vairagya)로써 고요히 다스릴 수 있다.',
    attachmentTrap: '결과와 타인의 반응을 한꺼번에 통제하려는 마음의 과부하.',
    nishkamaActionStep: '깊게 세 번 호흡한 뒤, 걱정 목록 중 오늘 내 손으로 봉헌하듯 끝낼 수 있는 일 한 가지만 바로 착수하십시오.',
  };
}

function buildTemporalGunaRhythm(now?: Date): GitaTemporalGunaRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 라자스(Rajas)의 발아 에너지를 스와다르마 실행으로 이끄는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 열정 속에서도 사마트밤(Samatvam) 평정심을 잃지 않는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 열매에 대한 집착을 비우고 사트바(Sattva) 명료도를 거두는 계절'
          : '겨울 — 내면의 아트만(Atman)을 응시하며 조용히 힘을 기르는 계절';

  if (hour >= 4 && hour < 10) {
    return {
      kstWindow: '브라흐마 무후르타 · 오전 사트바(Sattva) 맑은 창',
      seasonalTone,
      dominantGuna: 'Sattva (조화·맑음)',
      sattvaEquanimityIndex: 92,
      rhythmDirective: '사트바 기운이 가장 맑은 시간입니다. 욕심 없이 오늘의 올바른 의도와 원칙을 세우십시오.',
    };
  }
  if (hour >= 10 && hour < 17) {
    return {
      kstWindow: '한낮 라자스(Rajas) 역동 실행 창',
      seasonalTone,
      dominantGuna: 'Rajas (역동·추진)',
      sattvaEquanimityIndex: 80,
      rhythmDirective: '행동의 열기가 높은 낮입니다. 조급함만 걷어내면 강력한 카르마 요가의 추진력이 됩니다.',
    };
  }
  if (hour >= 17 && hour < 21) {
    return {
      kstWindow: '저녁 카르마팔라(Karmaphala) 봉헌·정리 창',
      seasonalTone,
      dominantGuna: 'Sattva (조화·맑음)',
      sattvaEquanimityIndex: 84,
      rhythmDirective: '오늘 행한 일의 결과를 내 손에서 내려놓고 마음의 평정을 회복하기 좋은 시간입니다.',
    };
  }
  return {
    kstWindow: '심야 타마스(Tamas) 침잠·휴식 창',
    seasonalTone,
    dominantGuna: 'Tamas (안정·침잠)',
    sattvaEquanimityIndex: 74,
    rhythmDirective: '무거운 상념이 찾아오기 쉬운 밤입니다. 해결하려는 애씀을 멈추고 내일을 위해 고요히 내려놓으십시오.',
  };
}

export function calculateBhagavadGitaKarmaYoga(
  profile: UserProfile,
  question?: string,
  now?: Date,
): BhagavadGitaKarmaYogaResult {
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
  const situationalKarmaAudit = buildSituationalKarmaAudit(question);
  const temporalGunaRhythm = buildTemporalGunaRhythm(now);

  const detachmentMastery = Math.min(99, Math.round((nishkamaKarmaDetachmentScore + karmaphalaRenunciation) / 2));
  const swadharmaClarity = Math.min(99, Math.round((swadharmaCallingAlignment + yogasthaSteadfastness) / 2));
  const samatvamResilience = Math.min(99, Math.round((samatvamEquanimityIndex + temporalGunaRhythm.sattvaEquanimityIndex) / 2));
  const overallSynthesis = Math.round((detachmentMastery + swadharmaClarity + samatvamResilience) / 3);

  const karmaYogaMatrix: GitaKarmaYogaMatrix = {
    detachmentMastery,
    swadharmaClarity,
    samatvamResilience,
    overallSynthesis,
  };

  const counselTitle = `바가바드 기타 카르마 요가: ${activeGitaStage.sanskritStage}`;
  const philosophicalGuidance = `현재 마주한 과제에서 가장 중요한 열쇠는 '결과에 대한 집착을 내려놓는 것(Nishkama Karma)'입니다. ` +
    `결과를 통제하려 들면 불안과 속박이 따르지만, 행위 자체를 신성한 소명으로 대하면 엄청난 자유와 집중력이 솟아납니다. ` +
    `${activeGitaStage.karmaActionBlessing}을 실천하십시오. 평정심(Samatvam)을 지키며 오직 현재의 올바른 행위에 몰입하십시오.`;

  const karmaYogaPhilosophicalCounsel = {
    counselTitle,
    philosophicalGuidance,
  };
  const dailyPracticeRitual =
    `[니슈카마 카르마 1회 봉헌 의례] 오늘 해야 할 일 중 결과 걱정이 가장 큰 일 한 가지를 고른 뒤, ` +
    `성패 계산을 멈추고 "${situationalKarmaAudit.nishkamaActionStep}"을 조용히 실행해 보십시오.`;
  const reflectiveQuestion =
    `지금 내가 두려워하는 것은 행위 그 자체인가, 아니면 내 뜻대로 되지 않을 결과에 대한 집착인가?`;
  const interpretiveBoundary =
    `바가바드 기타 카르마 요가는 미래의 성패를 점치는 도구가 아니라, 결과 집착을 내려놓고 현재의 본분(Swadharma)에 집중하도록 돕는 상징·성찰 관점입니다.`;

  const trimmedQ = (question ?? '').trim();
  const gitaSynthesisMatrix = {
    dominantTension: `${situationalKarmaAudit.attachmentTrap} ↔ ${activeGitaStage.sanskritStage}`,
    alignmentState: `${temporalGunaRhythm.dominantGuna} · ${primaryGitaSutra.themeKo}`,
    integratedAction: `${situationalKarmaAudit.nishkamaActionStep}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: BHAGAVAD_GITA_KARMA_YOGA_VERSION,
    calculatedAtKst: getGitaKstString(now),
    nishkamaKarmaDetachmentScore,
    swadharmaCallingAlignment,
    samatvamEquanimityIndex,
    yogasthaSteadfastness,
    karmaphalaRenunciation,
    activeGitaStage,
    primaryGitaSutra,
    situationalKarmaAudit,
    temporalGunaRhythm,
    karmaYogaMatrix,
    karmaYogaPhilosophicalCounsel,
    dailyPracticeRitual,
    reflectiveQuestion,
    ritualAction: dailyPracticeRitual,
    reflectionFocus: reflectiveQuestion,
    interpretiveBoundary,
    gitaSynthesisMatrix,
  };
}

function describeGitaStage(score: number): string {
  if (score >= 88) return '투명하고 흔들림 없이 맑은 경지';
  if (score >= 76) return '안정적으로 무르익어 가는 흐름';
  if (score >= 64) return '꾸준히 중심을 세워 가는 단계';
  return '차분히 집착을 비워 내는 초입';
}

export function formatBhagavadGitaKarmaYogaPrompt(res: BhagavadGitaKarmaYogaResult): string {
  const matrixLine = res.gitaSynthesisMatrix
    ? `- 바가바드 기타 교차 매트릭스: 핵심 긴장(${res.gitaSynthesisMatrix.dominantTension}) · 조율 상태(${res.gitaSynthesisMatrix.alignmentState}) · 통합 실천(${res.gitaSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【고대 인도 바가바드 기타(Bhagavad Gita) 카르마 요가 & 무집착 행동 관점 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 니슈카마 카르마(Nishkama Karma) 행위 무집착 결: ${describeGitaStage(res.nishkamaKarmaDetachmentScore)}`,
    `- 스와다르마(Swadharma) 영혼 본분 일치 결: ${describeGitaStage(res.swadharmaCallingAlignment)}`,
    `- 사마트밤(Samatvam) 초연 평정심: ${describeGitaStage(res.samatvamEquanimityIndex)}`,
    `- 요가스타(Yogastha) 확고한 몰입: ${describeGitaStage(res.yogasthaSteadfastness)}`,
    `- 카르마팔라(Karmaphala) 결과 집착 내려놓음: ${describeGitaStage(res.karmaphalaRenunciation)}`,
    `- 현재 영적 행위 단계: ${res.activeGitaStage.sanskritStage} (${res.activeGitaStage.stageNameKo})`,
    `- 질문 맥락 카르마 처방 (${res.situationalKarmaAudit.themeKo} · ${res.situationalKarmaAudit.chapterVerse}): "${res.situationalKarmaAudit.translationKo}" [${res.situationalKarmaAudit.sanskritQuote}]`,
    `- 집착 함정: ${res.situationalKarmaAudit.attachmentTrap}`,
    `- 니슈카마 실천 단계: ${res.situationalKarmaAudit.nishkamaActionStep}`,
    `- KST 구나(Guna) 리듬: ${res.temporalGunaRhythm.kstWindow} (${res.temporalGunaRhythm.dominantGuna}, 사트바 평정 ${describeGitaStage(res.temporalGunaRhythm.sattvaEquanimityIndex)}) — ${res.temporalGunaRhythm.rhythmDirective}`,
    `- 카르마 요가 매트릭스: 무집착 숙련(${describeGitaStage(res.karmaYogaMatrix.detachmentMastery)}) · 본분 명료도(${describeGitaStage(res.karmaYogaMatrix.swadharmaClarity)}) · 평정 회복력(${describeGitaStage(res.karmaYogaMatrix.samatvamResilience)}) · 종합(${describeGitaStage(res.karmaYogaMatrix.overallSynthesis)})`,
    `- 철학적 처방: ${res.karmaYogaPhilosophicalCounsel.philosophicalGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
