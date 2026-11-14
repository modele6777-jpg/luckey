/**
 * 고대 그리스 델포이 삼여신 모이라이(Moirai) 운명의 실타래 & 아낭케(Ananke) 필연 엔진 (greekMoiraiAnankeFateEngine.ts)
 *
 * 헤시오도스 『신통기(Theogony)』 및 플라톤 『국가(Republic)』 제10권 '에르의 신화(Myth of Er)' 정통 전승:
 * 우주의 어머니 아낭케(필연의 여신)의 빛의 기둥과 회전하는 다이아몬드 물레(Spindle of Necessity) 아래,
 * 백의를 입은 세 운명의 여신 모이라이가 과거·현재·미래의 운명의 실을 잣고 측정하며 매듭짓는다.
 *
 * 1. 클로토(Clotho - 방적자): 운명의 실을 잣는 자, 생명의 시작과 새로운 프로젝트·영감의 발원
 * 2. 라케시스(Lachesis - 분배자): 운명의 실을 측정하고 길이를 재는 자, 재능·인연·물질의 공정한 할당과 조율
 * 3. 아트로포스(Atropos - 불가역자): 가위로 실을 자르는 자, 필연적 매듭, 낡은 집착의 단절과 최종 결단
 */

import type { UserProfile } from '../sharedState';

export const GREEK_MOIRAI_ANANKE_FATE_ENGINE_VERSION = '2.0.0';

export interface MoiraiGoddessAspect {
  name: string;
  titleKo: string;
  cosmicDuty: string;
  powerScore: number; // 0 ~ 100
  threadTension: '팽팽한 추진(Tense)' | '유연한 흐름(Fluid)' | '단호한 절단(Decisive)';
  insight: string;
}

export interface GreekMoiraiAnankeFateReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  clotho: MoiraiGoddessAspect; // 발원과 탄생의 실
  lachesis: MoiraiGoddessAspect; // 측정과 배분의 실
  atropos: MoiraiGoddessAspect; // 결단과 종결의 실
  dominantGoddess: '클로토(새로운 발원)' | '라케시스(조율과 배분)' | '아트로포스(단호한 매듭)';
  necessityRatio: number; // 0 ~ 100 아낭케 우주 필연성 지수
  spindleAlignment: string; // 물레 회전 방향 및 영혼의 공명
  kairosTimingGuidance: string; // 카이로스(결정적 시점) 돌파 지침
  mythOfErSoulChoice: string; // 에르의 신화에 따른 영혼의 지혜 처방
  situationalMoiraiAudit: {
    questionFocus: string;
    threadStage: string;
    anankeTensionNote: string;
    spindleWarning: string;
  };
  temporalMoiraiRhythm: {
    calculatedAtKst: string;
    olympianHourWindow: string;
    seasonalSpindlePhase: string;
    kairosActionNote: string;
  };
  moiraiSynthesisMatrix: {
    coreMandate: string;
    sacredBoundary: string;
    reflectiveQuestion: string;
  };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateGreekMoiraiAnankeFate(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): GreekMoiraiAnankeFateReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  const bdate = profile?.basic?.birthdate || (profile as any)?.birthDate || (profile as any)?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || (profile as any)?.birthTime || (profile as any)?.birthtime || '12:00';
  const seedStr = `${bdate}_${btime}_${question || 'fate'}_${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const seed = simpleHash(seedStr);

  const clothoScore = 40 + (seed % 57);
  const lachesisScore = 40 + ((seed >> 2) % 57);
  const atroposScore = 40 + ((seed >> 4) % 57);

  const clotho: MoiraiGoddessAspect = {
    name: 'Clotho (클로토)',
    titleKo: '실을 잣는 발원의 여신',
    cosmicDuty: '미지의 잠재력을 현상계로 끌어내어 새로운 운명의 가닥을 자아냄',
    powerScore: clothoScore,
    threadTension: clothoScore > 70 ? '팽팽한 추진(Tense)' : '유연한 흐름(Fluid)',
    insight: clothoScore >= 65
      ? '새로운 동기와 창의적 불꽃이 강렬하게 피어오르는 시기입니다. 주저 없이 씨앗을 뿌리십시오.'
      : '기존의 실마리를 정비하며 다음 발원의 계기를 차분히 준비할 때입니다.',
  };

  const lachesis: MoiraiGoddessAspect = {
    name: 'Lachesis (라케시스)',
    titleKo: '길이를 재고 배분하는 여신',
    cosmicDuty: '주어진 자원과 인연의 분량을 정밀하게 계량하여 현실적 균형을 수립',
    powerScore: lachesisScore,
    threadTension: '유연한 흐름(Fluid)',
    insight: lachesisScore >= 65
      ? '자원 분배와 관계 조율의 묘수가 빛을 발합니다. 공정한 시선으로 경중을 가리면 순풍을 탑니다.'
      : '과도한 욕심을 경계하고 현재 주어진 분량에 충실하며 내실을 다져야 합니다.',
  };

  const atropos: MoiraiGoddessAspect = {
    name: 'Atropos (아트로포스)',
    titleKo: '실을 자르는 필연의 여신',
    cosmicDuty: '군더더기와 유효기간이 지난 인연을 잘라내어 새로운 순환의 공간을 창출',
    powerScore: atroposScore,
    threadTension: '단호한 절단(Decisive)',
    insight: atroposScore >= 65
      ? '미련과 우유부단함을 베어내야 할 결정적 순간입니다. 과감한 단절이 곧 해방과 도약입니다.'
      : '섣부른 파국이나 극단적 마무리를 피하고, 매듭을 부드럽게 지어갈 때입니다.',
  };

  let dominantGoddess: '클로토(새로운 발원)' | '라케시스(조율과 배분)' | '아트로포스(단호한 매듭)';
  if (clothoScore >= lachesisScore && clothoScore >= atroposScore) {
    dominantGoddess = '클로토(새로운 발원)';
  } else if (lachesisScore >= atroposScore) {
    dominantGoddess = '라케시스(조율과 배분)';
  } else {
    dominantGoddess = '아트로포스(단호한 매듭)';
  }

  const necessityRatio = Math.round((clothoScore * 0.3 + lachesisScore * 0.35 + atroposScore * 0.35));

  const spindleAlignment = necessityRatio >= 75
    ? '아낭케의 우주 물레가 강한 필연의 궤적을 그리며 회전합니다. 외부 저항에 흔들리지 않는 천명의 물줄기입니다.'
    : '물레가 유연한 가능성의 진동을 유지합니다. 질문자의 자유의지와 정밀한 선택이 운명의 방향타를 쥡니다.';

  const kairosTimingGuidance = dominantGoddess === '클로토(새로운 발원)'
    ? '지금은 시작의 불꽃이 가장 순수할 때입니다. 머뭇거리지 말고 첫걸음을 내딛으십시오.'
    : dominantGoddess === '라케시스(조율과 배분)'
    ? '지금은 완급 조절과 자원 재배치가 성패를 가릅니다. 주변과의 조화로운 합의점을 도출하십시오.'
    : '지금은 군더더기를 정리하고 핵심에 집중할 때입니다. 낡은 방식을 과감히 폐기하십시오.';

  const mythOfErSoulChoice = `에르의 신화가 전하듯 영혼은 환생 전 스스로의 삶의 원형을 선택합니다. ` +
    `현재 당신의 시련이나 기회는 우연이 아닌 영혼이 설계한 성장의 디딤돌이니, [${dominantGoddess}]의 기운을 나침반 삼아 당당히 주도권을 쥐십시오.`;

  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  const kstDate = new Date(kstMs);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;
  const calculatedAtKst = `${kstDate.getUTCFullYear()}-${String(kstMonth).padStart(2, '0')}-${String(kstDate.getUTCDate()).padStart(2, '0')} ${String(kstHour).padStart(2, '0')}:${String(kstDate.getUTCMinutes()).padStart(2, '0')} KST`;

  const qLower = question.toLowerCase();
  const questionFocus = /연애|사랑|결혼|재회|관계|이별|짝|배우자/.test(qLower)
    ? '인연의 실타래와 감정의 필연성 감사'
    : /이직|직장|사업|계약|돈|재물|투자|승진|창업/.test(qLower)
    ? '현실 자원 배분과 사업적 결단의 실 감사'
    : /건강|휴식|회복|마음|불안|수면/.test(qLower)
    ? '생명력 방적과 낡은 피로의 절단 감사'
    : '에르의 신화 영혼 선택과 카이로스 국면 감사';

  const threadStage = dominantGoddess === '클로토(새로운 발원)'
    ? '제1국면: 클로토의 방적기(새로운 인과가 잣기 시작하는 발원기)'
    : dominantGoddess === '라케시스(조율과 배분)'
    ? '제2국면: 라케시스의 측량대(주어진 몫과 관계의 길이를 재는 조율기)'
    : '제3국면: 아트로포스의 은빛 가위(군더더기를 끊고 매듭짓는 결단기)';

  const anankeTensionNote = necessityRatio >= 75
    ? '아낭케의 필연 축이 단단히 맞물려 억지 우회보다 정면 돌파가 순리인 국면입니다.'
    : '가능성의 여백이 넓어 질문자의 의식적 선택이 실타래의 결을 바꾸는 국면입니다.';

  const spindleWarning = dominantGoddess === '아트로포스(단호한 매듭)'
    ? '끝난 인연이나 낡은 방식을 미련으로 붙들면 물레가 엉킵니다.'
    : dominantGoddess === '클로토(새로운 발원)'
    ? '시작의 조급함으로 준비되지 않은 약속을 남발하지 마십시오.'
    : '타인의 몫과 나의 몫을 혼동해 과도한 책임을 떠안지 마십시오.';

  const olympianHourWindow = kstHour >= 5 && kstHour < 11
    ? '아침 에오스·클로토의 실 잣기 창(새로운 기획과 초안 발원에 유리)'
    : kstHour >= 11 && kstHour < 17
    ? '정오 아폴론·라케시스의 측량 창(조건 조율과 실무 배분에 유리)'
    : kstHour >= 17 && kstHour < 22
    ? '황혼 아낭케·아트로포스의 결단 창(우선순위 정리와 불필요한 요소 정리에 유리)'
    : '심야 에르의 신화 묵상 창(내면의 영혼 선택을 반추하고 침묵으로 가라앉히기에 유리)';

  const seasonalSpindlePhase = kstMonth >= 3 && kstMonth <= 5
    ? '춘분 페르세포네의 귀환기(잠자던 실마리가 지상으로 올라오는 발아 국면)'
    : kstMonth >= 6 && kstMonth <= 8
    ? '하지 태양 마차의 절정기(가장 팽팽한 추진력으로 과업을 밀고 나가는 국면)'
    : kstMonth >= 9 && kstMonth <= 11
    ? '추분 데메테르의 수확·측량기(결실을 계량하고 쭉정이를 가려내는 국면)'
    : '동지 하데스·아낭케의 심연 숙성기(외부 팽창을 줄이고 다음 주기를 응축하는 국면)';

  const kairosActionNote = `현재 ${olympianHourWindow}과 ${seasonalSpindlePhase}가 교차하므로, ${kairosTimingGuidance}`;

  const moiraiSynthesisMatrix = {
    coreMandate: `${dominantGoddess}의 축에서 ${questionFocus}을 수행하며 주체적으로 실타래를 쥐십시오.`,
    sacredBoundary: `아낭케의 물레가 전하는 경계: ${spindleWarning}`,
    reflectiveQuestion: `지금 내 손에 쥔 실타래 중 클로토처럼 새로 잣아야 할 것과 아트로포스처럼 단호히 끊어야 할 것은 무엇인가요?`,
  };

  return {
    engineVersion: GREEK_MOIRAI_ANANKE_FATE_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    clotho,
    lachesis,
    atropos,
    dominantGoddess,
    necessityRatio,
    spindleAlignment,
    kairosTimingGuidance,
    mythOfErSoulChoice,
    situationalMoiraiAudit: {
      questionFocus,
      threadStage,
      anankeTensionNote,
      spindleWarning,
    },
    temporalMoiraiRhythm: {
      calculatedAtKst,
      olympianHourWindow,
      seasonalSpindlePhase,
      kairosActionNote,
    },
    moiraiSynthesisMatrix,
  };
}

export function formatGreekMoiraiAnankeFatePrompt(rep: GreekMoiraiAnankeFateReport): string {
  return `[고대 그리스 델포이 삼여신 모이라이(Moirai) 운명의 실타래 & 아낭케(Ananke) 필연 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | 기준 시각(KST): ${rep.temporalMoiraiRhythm.calculatedAtKst}
· 주도적 운명 여신: ${rep.dominantGoddess}
· 질문 맥락 감사: ${rep.situationalMoiraiAudit.questionFocus} (${rep.situationalMoiraiAudit.threadStage})
· 필연성 위상: ${rep.situationalMoiraiAudit.anankeTensionNote}
· 클로토(방적·발원) [${rep.clotho.threadTension}]: ${rep.clotho.insight}
· 라케시스(측정·배분) [${rep.lachesis.threadTension}]: ${rep.lachesis.insight}
· 아트로포스(절단·결단) [${rep.atropos.threadTension}]: ${rep.atropos.insight}
· 아낭케 물레 궤적: ${rep.spindleAlignment}
· 시공간 리듬: ${rep.temporalMoiraiRhythm.olympianHourWindow} · ${rep.temporalMoiraiRhythm.seasonalSpindlePhase}
· 카이로스 타이밍 돌파 지침: ${rep.kairosTimingGuidance}
· 에르의 신화 영혼 처방: ${rep.mythOfErSoulChoice}
· 교차 매트릭스 핵심 지침: ${rep.moiraiSynthesisMatrix.coreMandate}
· 신성 경계 및 성찰 질문: ${rep.moiraiSynthesisMatrix.sacredBoundary} | "${rep.moiraiSynthesisMatrix.reflectiveQuestion}"`;
}
