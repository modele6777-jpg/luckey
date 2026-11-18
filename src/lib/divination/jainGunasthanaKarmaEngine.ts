/**
 * =========================================================================
 * LUCKEY 고대 인도 자이나교(Jainism) 14 군아스타나 & 삼보(Ratnatraya) 카르마 엔진
 * (Jain 14 Gunasthanas Soul Evolution & Ratnatraya Karma Purification Engine)
 * =========================================================================
 * 
 * [학술적·전통적 배경]
 * 고대 인도 정통 무소유·불살생 영적 전통인 자이나교(Jainism) 원전
 * 및 우마스와티(Umaswati)의 《타트바르타 수트라(Tattvartha Sutra)》.
 * 
 * 1. 14 군아스타나 (14 Gunasthanas - 영혼 진화의 14단계 영적 사다리):
 *    - 1단계: 미티야드리스티 (Mithyadrishti) - 망상과 물질적 집착의 국면
 *    - 4단계: 아비라타 사먀그드리스티 (Avirata Samyagdrishti) - 올바른 견해의 첫 각성
 *    - 5단계: 데샤비라타 (Deshavirata) - 부분적 절제와 자발적 규율
 *    - 6~7단계: 삼야타 (Samyata) - 흐트러짐 없는 완벽한 마음챙김과 정진
 *    - 8~10단계: 아푸르바 카라나 (Apurva Karana) - 미증유의 영적 에너지 유입과 번뇌 소진
 *    - 12~14단계: 크시나 카샤야 ~ 케발린 (Kevalin) - 궁극의 지혜와 열반(Moksha)
 * 2. 자이나 삼보 (Ratnatraya - 해탈에 이르는 세 가지 보물):
 *    - 정견 (Samyak Darshana) - 올바른 직관과 확고한 진리관
 *    - 정지 (Samyak Jnana) - 편견 없는 무구한 분별 지혜
 *    - 정행 (Samyak Charitra) - 조화롭고 해악 없는 일상의 실천
 * 3. 아힘사 (Ahimsa, 비폭력·생명 존중) 평화 지수 (0~100).
 * 4. 니르자라 (Nirjara, 묵은 카르마 소진) 정화 수련 가이드.
 */

import type { UserProfile } from '../sharedState';

export const JAIN_GUNASTHANA_KARMA_ENGINE_VERSION = '2.2.0';

export interface RatnatrayaBalance {
  darshanaScore: number; // 정견 (올바른 믿음/직관) 0~100
  jnanaScore: number; // 정지 (올바른 지식/분별) 0~100
  charitraScore: number; // 정행 (올바른 실천/조화) 0~100
  dominantTreasure: '정견 (Samyak Darshana)' | '정지 (Samyak Jnana)' | '정행 (Samyak Charitra)';
  dominantTreasureDescription: string;
}

export interface GunasthanaStage {
  stageNumber: number;
  stageNameSanskrit: string;
  stageNameKo: string;
  soulEvolutionState: string;
  spiritualGuidance: string;
}

export interface JainGunasthanaReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  ahimsaPeaceIndex: number; // 아힘사(Ahimsa) 평화 지수 0~100
  activeStage: GunasthanaStage;
  ratnatraya: RatnatrayaBalance;
  nirjaraPurification: string; // 니르자라(Nirjara) 카르마 정화 실천
  situationalJainAudit: {
    focusTheme: string;
    ahimsaTone: string;
    aparigrahaPrinciple: string;
    anekantaPerspective: string;
  };
  temporalJainRhythm: {
    kstTimeLabel: string;
    samayikaWindow: string;
    tirthankaraCycle: string;
    temporalGuidance: string;
  };
  jainSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  interpretiveBoundary: string;
  jainWisdom: string;
  boundaryNotice: string;
  ritualAction: string;
  reflectionFocus: string;
}

const GUNASTHANA_STAGES: GunasthanaStage[] = [
  {
    stageNumber: 1,
    stageNameSanskrit: 'Mithyadrishti',
    stageNameKo: '미티야드리스티 (미혹과 물질적 환영)',
    soulEvolutionState: '외부 세상의 평가와 일시적 소유에 마음이 휘둘리기 쉬우나, 영혼 깊은 곳에서 진정한 깨어남을 갈망하는 시작점',
    spiritualGuidance: '보이는 현상에 일희일비하지 말고 내면의 고요한 관찰자로 물러나십시오.'
  },
  {
    stageNumber: 4,
    stageNameSanskrit: 'Avirata Samyagdrishti',
    stageNameKo: '사먀그드리스티 (올바른 통찰의 번뜩임)',
    soulEvolutionState: '무엇이 참되고 무엇이 허망한지 영혼이 직관적으로 알아차린 각성의 단계',
    spiritualGuidance: '마음에 깃든 영적 확신을 의심하지 마십시오. 당신은 이미 올바른 방향을 알고 있습니다.'
  },
  {
    stageNumber: 5,
    stageNameSanskrit: 'Deshavirata',
    stageNameKo: '데샤비라타 (부분적 절제와 자발적 조율)',
    soulEvolutionState: '알아차린 진리를 일상의 작은 습관과 언행에서 실제로 적용하기 시작하는 성숙의 과정',
    spiritualGuidance: '완벽을 강박적으로 요구하지 말고, 오늘 하루 하나의 불필요한 욕심을 내려놓는 것으로 충분합니다.'
  },
  {
    stageNumber: 7,
    stageNameSanskrit: 'Apramatta Samyata',
    stageNameKo: '아프라맛타 삼야타 (흠 없는 집중과 정진)',
    soulEvolutionState: '방심과 게으름을 털어내고 매 순간 영혼의 중심을 온전히 지키는 고도의 평온',
    spiritualGuidance: '잡다한 소음이 당신의 평화를 흔들지 못합니다. 지금 추진하는 핵심 과업에 맑은 집중을 쏟으십시오.'
  },
  {
    stageNumber: 8,
    stageNameSanskrit: 'Apurva Karana',
    stageNameKo: '아푸르바 카라나 (미증유의 새로운 영적 에너지)',
    soulEvolutionState: '이전에 경험하지 못한 새로운 차원의 지혜와 정서적 자유가 솟아오르는 비약적 도약',
    spiritualGuidance: '과거의 한계와 낡은 습관의 껍질이 부서지고 있습니다. 전례 없는 자유로운 가능성을 환영하십시오.'
  },
  {
    stageNumber: 10,
    stageNameSanskrit: 'Sukshma Samparaya',
    stageNameKo: '수크슈마 삼파라야 (미세한 집착의 잔재 정화)',
    soulEvolutionState: '거친 탐욕과 분노는 완전히 사라지고, 오직 미세한 무의식적 고집만이 남은 맑은 정수',
    spiritualGuidance: '마지막 남은 사소한 옳고 그름의 분별마저 대자연의 자비로운 품으로 흘려보내십시오.'
  },
  {
    stageNumber: 13,
    stageNameSanskrit: 'Sayoga Kevalin',
    stageNameKo: '사요가 케발린 (전지적 지혜와 절대 평화)',
    soulEvolutionState: '세상 한가운데 살아가면서도 만물의 인과와 본질을 거울처럼 맑게 비추는 지고의 자유',
    spiritualGuidance: '당신은 이미 온전합니다. 세상을 향해 대자대비의 따뜻한 온기만을 건네십시오.'
  }
];

function formatJainKst(date: Date): { label: string; hour: number; month: number } {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return {
    label: `${y}-${m}-${d} ${hh}:${mm} KST`,
    hour: kst.getUTCHours(),
    month: kst.getUTCMonth() + 1,
  };
}

function getTemporalJainRhythm(now: Date) {
  const kst = formatJainKst(now);
  const samayikaWindow =
    kst.hour >= 4 && kst.hour < 10
      ? '새벽·아침 사마이카(Samayika) 정화창 — 맑은 호흡으로 아힘사 서원을 세우고 욕심을 덜어내는 시간'
      : kst.hour >= 10 && kst.hour < 17
        ? '정오·오후 정행(Charitra) 실천창 — 언행의 해로움을 삼가고 분별의 칼날을 부드럽게 쓰는 시간'
        : kst.hour >= 17 && kst.hour < 22
          ? '황혼 프라티크라마나(Pratikramana) 성찰창 — 하루의 작은 허물과 서운함을 자비롭게 내려놓는 시간'
          : '심야 아네칸타바다(Anekantavada) 침잠창 — 절대적 단정을 멈추고 다면적인 진실을 관조하는 시간';

  const tirthankaraCycle =
    kst.month >= 3 && kst.month <= 5
      ? '봄의 비움과 맑힘 순환 — 불필요한 소유를 덜어내어 영혼의 가벼움을 되찾는 절기'
      : kst.month >= 6 && kst.month <= 8
        ? '우기의 차투르마스(Chaturmas) 내면 수련 순환 — 외부 확장을 멈추고 내면의 뿌리를 다지는 절기'
        : kst.month >= 9 && kst.month <= 11
          ? '파류샤나(Paryushana) 용서와 화해 순환 — 묵은 업과 원망을 미소로 해소하는 절기'
          : '겨울 디파발리(Deepavali) 등불 각성 순환 — 고요한 침묵 속에서 내면의 지혜를 밝히는 절기';

  return {
    kstTimeLabel: kst.label,
    samayikaWindow,
    tirthankaraCycle,
    temporalGuidance: `${samayikaWindow}의 흐름에 따라 오늘 마음속에 쥔 집착 하나를 가볍게 내려놓으십시오.`,
  };
}

function getSituationalJainAudit(question: string | undefined, ahimsaPeaceIndex: number) {
  const q = (question || '').trim();
  const ahimsaTone =
    ahimsaPeaceIndex >= 82
      ? '내면의 평정심이 깊어 타인과 자신을 해치지 않는 맑은 아힘사 기운이 흐르고 있습니다.'
      : ahimsaPeaceIndex >= 68
        ? '평온과 긴장이 공존하는 상태이므로, 말과 결정에서 조급한 단정을 한 박자 늦추는 것이 좋습니다.'
        : '마음의 마찰열이 높아진 상태이므로, 스스로를 다그치거나 외부에 날을 세우지 않는 자비로운 쉼이 필요합니다.';

  if (/관계|연애|가족|친구|갈등|화해|사람/.test(q)) {
    return {
      focusTheme: '아네칸타바다(Anekantavada · 다면성)와 관계의 비폭력',
      ahimsaTone,
      aparigrahaPrinciple: '상대를 내 뜻대로 소유하거나 바꾸려는 마음을 내려놓을 때 관계의 숨통이 트입니다.',
      anekantaPerspective: '하나의 사건에도 서로 다른 진실의 면이 공존함을 인정하면 불필요한 언쟁이 사라집니다.',
    };
  }
  if (/돈|재물|투자|직장|사업|성공|선택|이직/.test(q)) {
    return {
      focusTheme: '아파리그라하(Aparigraha · 무소유 절제)와 정당한 성취',
      ahimsaTone,
      aparigrahaPrinciple: '필요 이상의 탐욕을 경계하고, 지금 나에게 꼭 알맞은 몫과 역할에 집중할 때 손실이 줄어듭니다.',
      anekantaPerspective: '단기적 손익의 일면만 보지 말고, 장기적 신뢰와 마음의 평화까지 함께 헤아리십시오.',
    };
  }
  return {
    focusTheme: '니르자라(Nirjara · 카르마 소진)와 삼보(Ratnatraya) 균형',
    ahimsaTone,
    aparigrahaPrinciple: '마음의 짐이 되는 과도한 걱정과 과거의 집착을 비울수록 현재의 통찰이 선명해집니다.',
    anekantaPerspective: '흑백논리나 조급한 결론을 피하고, 상황을 여러 각도에서 고요히 바라보십시오.',
  };
}

/**
 * 사용자 프로필 및 타임스탬프를 기반으로
 * 자이나교 14 군아스타나와 삼보(Ratnatraya) 균형을 결정론적으로 연산합니다.
 */
export function calculateJainGunasthanaKarma(options?: {
  profile?: UserProfile;
  targetInstantTime?: string;
  question?: string;
}): JainGunasthanaReport {
  const profile = options?.profile;
  const now = options?.targetInstantTime ? new Date(options.targetInstantTime) : new Date();

  let seed = 2400; // 24대 티르탕카라 상징수

  if (profile?.basic?.birthdate) {
    const parts = profile.basic.birthdate.split('-').map(Number);
    seed += (parts[0] || 1990) * 19 + (parts[1] || 1) * 29 + (parts[2] || 1) * 23;
  } else {
    seed += now.getFullYear() * 13 + (now.getMonth() + 1) * 31 + now.getDate() * 17;
  }

  if (profile?.basic?.birthtime) {
    const [h, m] = profile.basic.birthtime.split(':').map(Number);
    seed += (h || 0) * 37 + (m || 0) * 11;
  }

  // 1. 아힘사(Ahimsa) 평화 지수 (55 ~ 98점 범위)
  const ahimsaPeaceIndex = 55 + (seed % 44);

  // 2. 삼보(Ratnatraya) 점수 산출
  const darshanaScore = 45 + ((seed * 7 + 13) % 52); // 정견
  const jnanaScore = 45 + ((seed * 11 + 29) % 52); // 정지
  const charitraScore = 45 + ((seed * 17 + 43) % 52); // 정행

  const ratnaList = [
    { name: '정견 (Samyak Darshana)' as const, score: darshanaScore, desc: '거짓된 겉모습에 속지 않고 사물의 본원적 실상을 꿰뚫는 올바른 안목' },
    { name: '정지 (Samyak Jnana)' as const, score: jnanaScore, desc: '감정적 편견과 고집을 내려놓고 명징하게 상황을 분별하는 순수한 지혜' },
    { name: '정행 (Samyak Charitra)' as const, score: charitraScore, desc: '타인에게 상처를 주지 않고 자신을 평화롭게 지켜내는 올바른 실천' }
  ];
  ratnaList.sort((a, b) => b.score - a.score);
  const dominant = ratnaList[0];

  const ratnatraya: RatnatrayaBalance = {
    darshanaScore,
    jnanaScore,
    charitraScore,
    dominantTreasure: dominant.name,
    dominantTreasureDescription: dominant.desc
  };

  // 3. 군아스타나 국면 선정
  const stageIdx = seed % GUNASTHANA_STAGES.length;
  const activeStage = GUNASTHANA_STAGES[stageIdx];

  // 4. 니르자라(Nirjara) 카르마 정화 실천
  const nirjaraPractices = [
    '말수를 절반으로 줄이고 불필요한 비판이나 언쟁을 내려놓는 마우나(Mauna, 묵언) 정화',
    '식사 전 한 끼의 음식이 내게 오기까지 수고한 모든 생명과 노동에 진심 어린 감사 바치기',
    '마음에 얹힌 과거의 서운함이나 억울함을 판단 없이 바라보고 가만히 흘려보내는 사마이카(Samayika) 명상',
    '내가 가진 소유물 중 당장 쓰지 않는 물건 하나를 이웃에게 베풀거나 정돈하는 아파리그라하(Aparigraha, 무소유) 실천'
  ];
  const nirjaraPurification = nirjaraPractices[seed % nirjaraPractices.length];

  const temporalJainRhythm = getTemporalJainRhythm(now);
  const situationalJainAudit = getSituationalJainAudit(options?.question, ahimsaPeaceIndex);

  const jainWisdom = `삼보 중 [${dominant.name}]의 빛이 강하게 발현되고 있으며, 군아스타나 제${activeStage.stageNumber}단계 [${activeStage.stageNameKo}]에 머물고 있습니다. ${activeStage.spiritualGuidance}`;

  const jainSynthesisMatrix = {
    coreInsight: `군아스타나 제${activeStage.stageNumber}단계 [${activeStage.stageNameKo}]에서 삼보 중 [${dominant.name}]이 빛을 발하고 있습니다.`,
    recommendedAction: `${nirjaraPurification} (${situationalJainAudit.aparigrahaPrinciple})`,
    cautionNotice: `일방적 단정(에칸타)과 과도한 집착을 피하고, ${situationalJainAudit.anekantaPerspective}`,
  };

  const ritualAction = `[제${activeStage.stageNumber}단계 ${activeStage.stageNameKo}] ${nirjaraPurification}`;
  const reflectionFocus = `오늘 내가 '${situationalJainAudit.focusTheme}'에서 내려놓을 수 있는 작은 집착 하나는 무엇인가요?`;

  return {
    engineVersion: JAIN_GUNASTHANA_KARMA_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalJainRhythm.kstTimeLabel,
    ahimsaPeaceIndex,
    activeStage,
    ratnatraya,
    nirjaraPurification,
    situationalJainAudit,
    temporalJainRhythm,
    jainSynthesisMatrix,
    jainWisdom,
    boundaryNotice: '본 결과는 자이나교 《타트바르타 수트라》 14 군아스타나와 삼보 원리에 따른 정성적 성찰이며, 우열을 가르는 점수나 운명적 판정이 아닙니다.',
    interpretiveBoundary: '본 결과는 자이나교 《타트바르타 수트라》 14 군아스타나와 삼보 원리에 따른 정성적 성찰이며, 우열을 가르는 점수나 운명적 판정이 아닙니다.',
    ritualAction,
    reflectionFocus,
  };
}

/**
 * 프롬프트 포맷터
 */
export function formatJainGunasthanaKarmaPrompt(report: JainGunasthanaReport): string {
  const r = report.ratnatraya;
  const s = report.activeStage;

  return `[🪷 고대 인도 자이나교 14 군아스타나 & 삼보(Ratnatraya) 카르마 성찰 안내 v${report.engineVersion}]
======================================================================
연산 시각: ${report.calculatedAtKst}
1. [영혼 진화의 사다리 (14 Gunasthanas)]:
   - 현재 영혼 국면: 제${s.stageNumber}단계 [${s.stageNameKo}] (${s.stageNameSanskrit})
   - 영적 성찰 국면: ${s.soulEvolutionState}
   - 영혼 상승 지침: "${s.spiritualGuidance}"

2. [자이나 삼보(Ratnatraya) 조화]:
   - 주재 영적 보물: [${r.dominantTreasure}]
   - 주재 특성: ${r.dominantTreasureDescription}

3. [질문 맥락 감사 (${report.situationalJainAudit.focusTheme})]:
   - 아힘사(Ahimsa) 평정 기조: ${report.situationalJainAudit.ahimsaTone}
   - 아파리그라하(무소유) 원칙: ${report.situationalJainAudit.aparigrahaPrinciple}
   - 아네칸타바다(다면성) 관점: ${report.situationalJainAudit.anekantaPerspective}

4. [KST 시공간 리듬]:
   - 시간창: ${report.temporalJainRhythm.samayikaWindow}
   - 절기 순환: ${report.temporalJainRhythm.tirthankaraCycle}
   - 시공간 지침: ${report.temporalJainRhythm.temporalGuidance}

5. [니르자라(Nirjara) 카르마 정화 & 교차 매트릭스]:
   - 카르마 소진 실천: ${report.nirjaraPurification}
   - 실천 의례(Ritual Action): ${report.ritualAction}
   - 성찰 초점(Reflection Focus): ${report.reflectionFocus}
   - 핵심 통찰: ${report.jainSynthesisMatrix.coreInsight}
   - 권고 실행: ${report.jainSynthesisMatrix.recommendedAction}
   - 주의 경계: ${report.jainSynthesisMatrix.cautionNotice}
   - 종합 해탈 조언: ${report.jainWisdom}
   - 해석 경계: ${report.boundaryNotice}
======================================================================`;
}
