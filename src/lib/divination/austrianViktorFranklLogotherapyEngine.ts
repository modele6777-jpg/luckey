/**
 * 오스트리아/유대 빅터 프랭클(Viktor Frankl) 《죽음의 수용소에서(Man's Search for Meaning)》 & 《로고테라피(Logotherapy)》 의미치료 엔진
 *
 * @version LUCKEY-VIKTOR-FRANKL-LOGOTHERAPY-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_VIKTOR_FRANKL_VERSION = 'LUCKEY-VIKTOR-FRANKL-LOGOTHERAPY-v2.2.0';

function getFranklKstString(now?: Date): string {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 3600 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00`;
}

export type FranklQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface FranklTheme {
  themeKey: string;
  themeTitleGerman: string;
  themeTitleKo: string;
  logotherapyInsight: string;
  practicalCounsel: string;
}

export interface FranklAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismGermanOrEnglish: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface FranklSituationalMeaningAudit {
  themeKo: string;
  sourceCitation: string;
  classicalQuote: string;
  existentialVacuumTrap: string;
  attitudeShiftAction: string;
}

export interface FranklTemporalMeaningRhythm {
  kstWindow: string;
  seasonalTone: string;
  valuePathFocus: '창조적 가치(일·만듦)' | '체험적 가치(사랑·만남)' | '태도적 가치(고난의 품격)';
  logotherapyClarityIndex: number;
  rhythmDirective: string;
}

export interface FranklLogotherapyMatrix {
  attitudeFreedom: number;
  meaningAlignment: number;
  selfTranscendence: number;
  overallSynthesis: number;
}

export interface ViktorFranklLogotherapyResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 프랭클 로고테라피 지표 (0~100)
  lastHumanFreedomAttitudeScore: number;      // 시련 속 최후의 자유인 태도 선택력 (The Last Human Freedom)
  willToMeaningDriveScore: number;            // 삶의 의미를 향한 근원적 의지 지수 (Wille zum Sinn / Will to Meaning)
  tragicOptimismResilienceScore: number;      // 고통을 성숙과 존엄으로 전환하는 비극적 낙관주의 (Tragic Optimism)
  selfTranscendenceDedicationScore: number;   // 자아를 넘어 타인과 가치를 향하는 자기초월성 (Self-Transcendence)
  lifeResponsibilityIntegrityIndex: number;   // 삶의 부름에 인격으로 응답하는 실존적 책임성 (Verantwortlichkeit)
  // 세부 분석
  questionTopic: FranklQuestionTopic;
  activeFranklTheme: FranklTheme;
  focalFranklAphorism: FranklAphorism;
  situationalMeaningAudit: FranklSituationalMeaningAudit;
  temporalMeaningRhythm: FranklTemporalMeaningRhythm;
  logotherapyMatrix: FranklLogotherapyMatrix;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  franklComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  franklSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const FRANKL_THEMES: FranklTheme[] = [
  {
    themeKey: 'last_human_freedom',
    themeTitleGerman: 'Die letzte menschliche Freiheit (최후의 인간적 자유)',
    themeTitleKo: '어떤 환경에서도 빼앗길 수 없는 태도를 선택하는 자유',
    logotherapyInsight: '주변 상황과 환경이 당신의 모든 것을 빼앗아 갈지라도, 그 상황에 어떤 태도로 맞설 것인가를 결정하는 마지막 자유만은 당신의 내면에 온전히 남아 있습니다.',
    practicalCounsel: '상황을 당장 바꿀 수 없다면, 그 상황을 대하는 당신의 내적 태도를 바꾸십시오. 바로 그 선택 속에 그 누구도 침범할 수 없는 당신의 고결한 존엄이 살아납니다.',
  },
  {
    themeKey: 'will_to_meaning',
    themeTitleGerman: 'Der Wille zum Sinn (의미를 향한 의지)',
    themeTitleKo: '공허한 쾌락을 넘어 고유한 삶의 이유를 발견하는 힘',
    logotherapyInsight: '인간은 고통 자체 때문에 무너지는 것이 아니라, 고통의 이유를 알지 못할 때 절망합니다. 살아야 할 이유(Why)를 품은 사람은 어떤 어려움(How)도 견뎌낼 수 있습니다.',
    practicalCounsel: '겉치레 성공이나 일시적 자극에 안주하지 마십시오. 당신의 남은 인생에서 오직 당신만이 완수할 수 있는 의미 있는 과업과 사람을 찾으십시오.',
  },
  {
    themeKey: 'tragic_optimism',
    themeTitleGerman: 'Der tragische Optimismus (비극적 낙관주의)',
    themeTitleKo: '시련과 상처를 인간적 성숙과 깊은 지혜로 승화',
    logotherapyInsight: '고통을 피할 수 없을 때 우리는 비로소 우리 자신을 변화시키도록 부름받습니다. 시련은 영혼의 군더더기를 태워 없애고 가장 순수한 인간성을 벼려내는 용광로입니다.',
    practicalCounsel: '상처를 부끄러워하거나 숨기지 마십시오. 그 상처를 통해 타인의 아픔을 헤아리는 깊은 지혜와 따뜻한 공감의 빛을 밝히십시오.',
  },
  {
    themeKey: 'self_transcendence',
    themeTitleGerman: 'Die Selbst-Transzendenz (자기초월성)',
    themeTitleKo: '자기중심성을 벗어나 더 높은 가치와 타인에게 헌신',
    logotherapyInsight: '행복은 직접 쫓아간다고 얻을 수 있는 것이 아니라, 가치 있는 대의에 헌신하거나 누군가를 진정으로 사랑할 때 뒤따라오는 필연적인 결과물입니다.',
    practicalCounsel: '나의 고민과 결핍에만 갇혀 전전긍긍하지 마십시오. 당신의 손길을 간절히 필요로 하는 일과 사람에게 온 마음을 쏟아부을 때 참된 치유가 찾아옵니다.',
  },
  {
    themeKey: 'call_of_responsibility',
    themeTitleGerman: 'Die Verantwortlichkeit (삶에 대한 온전한 책임)',
    themeTitleKo: '삶이 내게 무엇을 줄까 묻지 않고 삶의 물음에 응답하는 삶',
    logotherapyInsight: '인생에 "내게 무엇을 줄 것인가"를 묻지 마십시오. 진정한 주체는 삶이 내게 던지는 물음에 성실과 책임으로 응답하는 자입니다.',
    practicalCounsel: '오늘 당신에게 주어진 시간과 과업을 가볍게 여기지 마십시오. 마치 두 번째 기회를 얻은 사람처럼, 후회 없이 매 순간을 충실하게 책임지십시오.',
  },
];

export const FRANKL_APHORISMS: FranklAphorism[] = [
  {
    aphorismKey: 'attitude_choice',
    aphorismKo: '인간에게서 모든 것을 빼앗을 수 있어도, 단 한 가지, 주어진 환경에서 자신의 태도를 선택하는 자유만은 결코 빼앗을 수 없다.',
    aphorismGermanOrEnglish: 'Everything can be taken from a man but one thing: the last of the human freedoms—to choose one’s attitude in any given set of circumstances. (Man’s Search for Meaning)',
    sourceContext: '《죽음의 수용소에서(Man’s Search for Meaning)》',
    actionGuidance: '어떤 불운이나 고난 앞에서도 굴복하지 마십시오. 품위와 용기를 잃지 않겠다는 당신의 결단이 어둠 속의 등불이 됩니다.',
  },
  {
    aphorismKey: 'why_to_live',
    aphorismKo: '살아야 할 이유가 있는 사람은 그 어떤 시련도 기꺼이 견뎌낼 수 있다.',
    aphorismGermanOrEnglish: 'He who has a why to live can bear almost any how. (Friedrich Nietzsche / Viktor Frankl, Man’s Search for Meaning)',
    sourceContext: '《죽음의 수용소에서》 인용',
    actionGuidance: '당신을 살아가게 만드는 가장 소중한 가치와 사람을 떠올리십시오. 그 사랑과 사명이 당신을 다시 일으켜 세웁니다.',
  },
  {
    aphorismKey: 'change_ourselves',
    aphorismKo: '우리가 더 이상 상황을 변화시킬 수 없을 때, 우리는 비로소 우리 자신을 변화시키도록 도전받는다.',
    aphorismGermanOrEnglish: 'When we are no longer able to change a situation, we are challenged to change ourselves. (Man’s Search for Meaning)',
    sourceContext: '《죽음의 수용소에서》',
    actionGuidance: '억지 통제를 내려놓고 내면의 성숙에 집중하십시오. 당신이 깊어질 때 상황을 바라보는 온 세상이 달라집니다.',
  },
  {
    aphorismKey: 'live_as_if_second_time',
    aphorismKo: '마치 지금 살고 있는 삶이 두 번째 삶인 것처럼, 그리고 첫 번째 삶에서 저질렀던 실수를 지금 다시 반복하려는 순간인 것처럼 오늘을 살아라.',
    aphorismGermanOrEnglish: 'Live as if you were living already for the second time and as if you had acted the first time as wrongly as you are about to act now! (Man’s Search for Meaning)',
    sourceContext: '로고테라피 정언명령',
    actionGuidance: '습관적인 나태와 안일한 타협을 경계하십시오. 오늘이라는 선물을 두 번째 기회처럼 가장 숭고하게 쓰십시오.',
  },
];

function buildSituationalMeaningAudit(question?: string): FranklSituationalMeaningAudit {
  const q = (question ?? '').trim();
  if (/시련|고통|힘들|어렵|아프|절망/.test(q)) {
    return {
      themeKo: '태도적 가치와 최후의 자유',
      sourceCitation: '《죽음의 수용소에서》 제1부·제2부',
      classicalQuote: '자극과 반응 사이에는 공간이 있다. 그 공간 안에 우리의 반응을 선택할 자유와 힘이 놓여 있다.',
      existentialVacuumTrap: '바꿀 수 없는 환경의 가혹함에 압도되어 내 태도를 선택할 힘마저 포기하는 체념.',
      attitudeShiftAction: '피할 수 없는 고난이라면, 오늘 이 일을 대할 때 내가 지키고 싶은 단 하나의 품위 있는 태도를 먼저 선언하십시오.',
    };
  }
  if (/공허|무의미|지루|우울|왜|목적|의욕/.test(q)) {
    return {
      themeKo: '실존적 공허(Existential Vacuum) 돌파',
      sourceCitation: '《죽음의 수용소에서》 로고테라피 개론',
      classicalQuote: '우리가 삶에 의미를 묻는 것이 아니라, 삶이 지금 우리에게 묻고 있다는 사실을 깨달아야 한다.',
      existentialVacuumTrap: '나 자신의 기분과 공허감만 파고들수록(과잉성찰) 오히려 무의미가 깊어지는 악순환.',
      attitudeShiftAction: '시선을 나에게서 바깥으로 돌려, 오늘 내가 도울 수 있는 사람이나 완성할 작은 작품 1건을 바로 실행하십시오.',
    };
  }
  if (/관계|사랑|가족|사람|헌신|외로/.test(q)) {
    return {
      themeKo: '체험적 가치와 자기초월(Self-Transcendence)',
      sourceCitation: '《죽음의 수용소에서》 사랑의 의미',
      classicalQuote: '인간은 오직 사랑 안에서, 그리고 소중한 존재를 온전히 바라볼 때 비로소 자기 자신을 넘어선다.',
      existentialVacuumTrap: '내가 먼저 인정받고 채워져야만 움직이려다가 관계의 온기를 놓쳐 버리는 방어.',
      attitudeShiftAction: '오늘 소중한 사람 한 명에게 진심 어린 감사나 안부 한 마디를 먼저 건네며 자기초월을 실천하십시오.',
    };
  }
  if (/후회|실수|과거|죄책|자책|선택/.test(q)) {
    return {
      themeKo: '두 번째 삶의 정언명령과 책임성',
      sourceCitation: '《죽음의 수용소에서》 로고테라피 정언명령',
      classicalQuote: '마치 두 번째 삶을 사는 것처럼, 그리고 첫 번째 삶에서 막 잘못 행하려던 순간인 것처럼 지금을 살아라.',
      existentialVacuumTrap: '과거의 실수를 되새김질하느라 지금 눈앞에 주어진 새로운 책임의 기회를 놓치는 자책.',
      attitudeShiftAction: '어제의 후회를 오늘의 책임으로 바꾸십시오. 지금 바로 바로잡을 수 있는 행동 1가지를 오늘 실행하십시오.',
    };
  }
  return {
    themeKo: '의미를 향한 의지(Wille zum Sinn)와 창조적 가치',
    sourceCitation: '《삶의 의미를 찾아서》 · 《의미를 향한 의지》',
    classicalQuote: '행복은 쫓아갈 대상이 아니라, 의미 있는 과업에 헌신할 때 자연스럽게 뒤따라오는 부산물이다.',
    existentialVacuumTrap: '당장의 기분 좋은 결과만 좇다가 정작 나를 단단하게 세우는 고유한 과업을 미루는 태도.',
    attitudeShiftAction: '기분이 나기를 기다리지 말고, 오늘 나만이 책임지고 끝낼 수 있는 의미 있는 일 한 가지에 30분 몰입하십시오.',
  };
}

function buildTemporalMeaningRhythm(now?: Date): FranklTemporalMeaningRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 새로운 창조적 가치(일과 사명)의 씨앗을 심는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 열정과 시련을 함께 품고 비극적 낙관주의를 단련하는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 사람과 삶의 체험적 가치를 깊게 음미하며 감사하는 계절'
          : '겨울 — 가장 추운 시기에도 내면의 최후의 자유를 지키는 계절';

  if (hour >= 5 && hour < 12) {
    return {
      kstWindow: '아침 삶의 부름 응답(Verantwortlichkeit) 창',
      seasonalTone,
      valuePathFocus: '창조적 가치(일·만듦)',
      logotherapyClarityIndex: 91,
      rhythmDirective: '삶이 오늘 내게 던지는 질문에 응답하기 좋은 오전입니다. 가장 의미 있는 핵심 과업을 먼저 붙드십시오.',
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      kstWindow: '오후 태도적 가치(최후의 자유) 실천 창',
      seasonalTone,
      valuePathFocus: '태도적 가치(고난의 품격)',
      logotherapyClarityIndex: 84,
      rhythmDirective: '예상치 못한 변수와 피로가 겹치는 오후입니다. 반응 전 3초의 공간에서 품위 있는 태도를 택하십시오.',
    };
  }
  if (hour >= 18 && hour < 22) {
    return {
      kstWindow: '저녁 체험적 가치(사랑·만남) 회복 창',
      seasonalTone,
      valuePathFocus: '체험적 가치(사랑·만남)',
      logotherapyClarityIndex: 86,
      rhythmDirective: '성과 계산을 멈추고 소중한 사람·예술·자연과의 만남 속에서 삶의 온기를 회복할 시간입니다.',
    };
  }
  return {
    kstWindow: '심야 비극적 낙관주의 성찰 창',
    seasonalTone,
    valuePathFocus: '태도적 가치(고난의 품격)',
    logotherapyClarityIndex: 78,
    rhythmDirective: '오늘의 미완성과 아쉬움도 성숙의 재료입니다. 내일을 향한 작은 이유 하나를 품고 평안히 쉬십시오.',
  };
}

function classifyFranklQuestionTopic(question?: string): FranklQuestionTopic {
  const q = (question ?? '').trim();
  if (/관계|사랑|가족|사람|헌신|외로|동료|연인/.test(q)) return 'relationship';
  if (/결정|선택|진로|이직|후회|실수|책임|시작|포기/.test(q)) return 'decision';
  if (/시련|고통|힘들|어렵|아프|절망|공허|무의미|우울/.test(q)) return 'healing';
  return 'reflection';
}

function buildFranklRitualAndReflection(topic: FranklQuestionTopic): {
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      ritualAction: '오늘 소중한 사람에게 내가 먼저 건넬 수 있는 진심 어린 안부나 감사의 말 한 줄 전하기',
      reflectionFocus: '지금 이 관계에서 내가 받으려는 인정보다 먼저 건네고 싶은 온기는 무엇인가?',
    };
  }
  if (topic === 'decision') {
    return {
      ritualAction: '마치 두 번째 기회를 얻은 사람처럼 오늘 당장 바로잡고 착수할 행동 1가지 실행하기',
      reflectionFocus: '지금 망설이는 선택을 내 인생이 내게 던진 물음이라 여긴다면 어떤 답을 남기고 싶은가?',
    };
  }
  if (topic === 'healing') {
    return {
      ritualAction: '피할 수 없는 고단함 앞에서 오늘 내가 지키고 싶은 단 하나의 품위 있는 태도를 짧게 적어 두기',
      reflectionFocus: '자극과 반응 사이의 짧은 공간에서 내가 여전히 선택할 수 있는 내면의 자유는 무엇인가?',
    };
  }
  return {
    ritualAction: '기분이나 의욕을 기다리지 않고 오늘 내가 완성할 수 있는 작은 의미 있는 과업 1건에 20분 몰입하기',
    reflectionFocus: '오늘 나의 하루가 끝나갈 때 "이 시간은 헛되지 않았다"고 말할 수 있는 단 하나의 이유는 무엇인가?',
  };
}

export function calculateViktorFranklLogotherapy(
  profile: UserProfile,
  question?: string,
  now?: Date,
): ViktorFranklLogotherapyResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const questionTopic = classifyFranklQuestionTopic(question);
  const { ritualAction, reflectionFocus } = buildFranklRitualAndReflection(questionTopic);

  const seedString = `VIKTOR-FRANKL-LOGOTHERAPY:${name}:${birthDate}:${birthTime}:${gender}:${question ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const lastHumanFreedomAttitudeScore = 75 + (absHash % 24);
  const willToMeaningDriveScore = 74 + ((absHash >> 3) % 25);
  const tragicOptimismResilienceScore = 72 + ((absHash >> 6) % 27);
  const selfTranscendenceDedicationScore = 73 + ((absHash >> 9) % 26);
  const lifeResponsibilityIntegrityIndex = 71 + ((absHash >> 12) % 28);

  const themeIndex = (absHash >> 4) % FRANKL_THEMES.length;
  const aphorismIndex = (absHash >> 7) % FRANKL_APHORISMS.length;

  const activeFranklTheme = FRANKL_THEMES[themeIndex];
  const focalFranklAphorism = FRANKL_APHORISMS[aphorismIndex];
  const situationalMeaningAudit = buildSituationalMeaningAudit(question);
  const temporalMeaningRhythm = buildTemporalMeaningRhythm(now);

  const attitudeFreedom = Math.min(99, Math.round((lastHumanFreedomAttitudeScore + tragicOptimismResilienceScore) / 2));
  const meaningAlignment = Math.min(99, Math.round((willToMeaningDriveScore + temporalMeaningRhythm.logotherapyClarityIndex) / 2));
  const selfTranscendence = Math.min(99, Math.round((selfTranscendenceDedicationScore + lifeResponsibilityIntegrityIndex) / 2));
  const overallSynthesis = Math.round((attitudeFreedom + meaningAlignment + selfTranscendence) / 3);

  const logotherapyMatrix: FranklLogotherapyMatrix = {
    attitudeFreedom,
    meaningAlignment,
    selfTranscendence,
    overallSynthesis,
  };

  const guidanceTitle = `빅터 프랭클 로고테라피 의미치료: ${activeFranklTheme.themeTitleKo}`;
  const philosophicalCounsel = `빅터 프랭클의 로고테라피는 고통의 한복판에서도 결코 꺼지지 않는 삶의 의미와 최후의 자유를 일깨웁니다. ` +
    `현재 당신의 심령을 지탱하는 핵심 영적 원리는 '${activeFranklTheme.themeTitleKo}'입니다. ` +
    `${activeFranklTheme.practicalCounsel} 아울러 원전의 불멸의 치유 경구 "${focalFranklAphorism.aphorismKo}"(${focalFranklAphorism.aphorismGermanOrEnglish})을 마음에 품고, ` +
    `${focalFranklAphorism.actionGuidance}`;

  const boundaryNotice = '로고테라피 의미치료 관점은 삶의 태도와 의미를 성찰하는 철학적·상징적 조언이며, 전문 의료·정신건강 진료를 대신하지 않습니다.';

  const trimmedQ = (question ?? '').trim();
  const franklSynthesisMatrix = {
    dominantTension: `${situationalMeaningAudit.existentialVacuumTrap} ↔ ${activeFranklTheme.themeTitleKo}`,
    alignmentState: `${temporalMeaningRhythm.valuePathFocus} · ${questionTopic}`,
    integratedAction: `${situationalMeaningAudit.attitudeShiftAction}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: AUSTRIAN_VIKTOR_FRANKL_VERSION,
    calculatedAtKst: getFranklKstString(now),
    lastHumanFreedomAttitudeScore,
    willToMeaningDriveScore,
    tragicOptimismResilienceScore,
    selfTranscendenceDedicationScore,
    lifeResponsibilityIntegrityIndex,
    questionTopic,
    activeFranklTheme,
    focalFranklAphorism,
    situationalMeaningAudit,
    temporalMeaningRhythm,
    logotherapyMatrix,
    ritualAction,
    reflectionFocus,
    boundaryNotice,
    franklComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    franklSynthesisMatrix,
  };
}

export function formatViktorFranklLogotherapyPrompt(res: ViktorFranklLogotherapyResult): string {
  const matrixLine = res.franklSynthesisMatrix
    ? `- 빅터 프랭클 교차 매트릭스: 핵심 긴장(${res.franklSynthesisMatrix.dominantTension}) · 조율 상태(${res.franklSynthesisMatrix.alignmentState}) · 통합 실천(${res.franklSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【빅터 프랭클 《죽음의 수용소에서》 시련 속 최후의 자유 & 의미치료 지표 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- 핵심 의미치료 테마: ${res.activeFranklTheme.themeTitleKo} [${res.activeFranklTheme.themeTitleGerman}]`,
    `- 로고테라피 통찰: ${res.activeFranklTheme.logotherapyInsight}`,
    `- 행동 조언: ${res.activeFranklTheme.practicalCounsel}`,
    `- 질문 맥락 의미 감사 (${res.situationalMeaningAudit.themeKo} · ${res.situationalMeaningAudit.sourceCitation}): "${res.situationalMeaningAudit.classicalQuote}"`,
    `- 실존 공허 함정: ${res.situationalMeaningAudit.existentialVacuumTrap}`,
    `- 태도 전환 실천: ${res.situationalMeaningAudit.attitudeShiftAction}`,
    `- KST 의미 리듬: ${res.temporalMeaningRhythm.kstWindow} (${res.temporalMeaningRhythm.seasonalTone} · ${res.temporalMeaningRhythm.valuePathFocus}) — ${res.temporalMeaningRhythm.rhythmDirective}`,
    `- 로고테라피 매트릭스: 최후의 자유 태도 선택 · 의미를 향한 의지 정렬 · 자기초월 헌신 정성 균형`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 핵심 성찰 질문: ${res.reflectionFocus}`,
    `- 종합 의미치료 권면: ${res.franklComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
