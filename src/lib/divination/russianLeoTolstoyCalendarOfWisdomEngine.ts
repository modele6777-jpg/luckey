/**
 * 러시아 레프 톨스토이(Leo Tolstoy) 《인생독본(Круг чтения)》 & 《사람은 무엇으로 사는가》 영적 각성·아가페 사랑 지혜 엔진
 *
 * 19세기 러시아의 위대한 대문호이자 영성 사상가 레프 톨스토이(Leo Tolstoy, 1828~1910)의 필생의 역작
 * 《인생독본(A Calendar of Wisdom)》, 《사람은 무엇으로 사는가(What Men Live By)》, 《고백록(A Confession)》 원전 기반:
 * 1. 내면 영적 각성도(Spiritual Awakening Score): 물질적 탐욕과 세속적 허영을 털어내고 신성한 영혼과 양심의 소리에 귀 기울이는 의식의 각성 지수.
 * 2. 아가페 사랑과 이타심 지수(Agape Love Altruism Index): 사람은 무엇으로 사는가? 오직 사랑으로 산다는 진리에 따른 조건 없는 자비와 배려 척도.
 * 3. 단순한 삶과 정직한 노동 조화도(Simple Life Labor Harmony Score): 허례허식을 버리고 땀 흘리는 노동과 자연의 리듬에 순응하는 소박함.
 * 4. 비폭력 평화와 용서 지수(Non-Violence Peace Equanimity Index): 악을 악으로 갚지 않고 온유한 선과 용서로 갈등의 매듭을 푸는 도덕적 평정심.
 * 5. 실존적 양심 진실성 및 평정 지수(Existential Conscience Integrity Score): 삶의 유한성을 직시하고 매 순간 신과 인류 앞에 부끄럼 없이 서는 내적 진실성.
 *
 * @version LUCKEY-LEO-TOLSTOY-WISDOM-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const RUSSIAN_LEO_TOLSTOY_VERSION = 'LUCKEY-LEO-TOLSTOY-WISDOM-v2.4.0';

export type TolstoyQuestionTopic = 'career' | 'relationship' | 'wealth' | 'decision' | 'general';

export interface TolstoyTheme {
  themeKey: string;
  themeTitleRu: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface TolstoyAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismRu: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface RussianLeoTolstoyCalendarOfWisdomResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 톨스토이 인생독본 영적 지표 (0~100)
  spiritualAwakeningScore: number;            // 내면 영적 각성도 (Spiritual Awakening)
  agapeLoveAltruismIndex: number;             // 아가페 사랑과 이타심 지수 (Agape Love & Altruism)
  simpleLifeLaborHarmonyScore: number;        // 단순한 삶과 노동 조화도 (Simple Life & Labor Harmony)
  nonViolencePeaceEquanimityIndex: number;    // 비폭력 평화와 용서 지수 (Non-Violence Peace & Forgiveness)
  existentialConscienceIntegrityScore: number;// 실존적 양심 진실성 및 평정 지수 (Existential Conscience Integrity)
  questionTopic: TolstoyQuestionTopic;
  tolstoyCrossAxis: string;
  shadowWarning: string;
  // 세부 분석
  activeTolstoyTheme: TolstoyTheme;
  focalTolstoyAphorism: TolstoyAphorism;
  tolstoyComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
  tolstoySynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  // v2.1.0 심층 보강: 이중 원전 교차·성찰 질문·해석 경계
  secondaryTolstoyAphorism?: TolstoyAphorism;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveTolstoyQuestion: string;
  reflectiveQuestion?: string;
  interpretiveBoundary: string;
}

function formatTolstoyKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function describeTolstoyStage(score: number): string {
  if (score >= 90) return '야스나야 폴랴나 각성(Sacred Simplicity) — 아가페 사랑과 순결한 양심, 정직한 노동이 맑게 합일되는 청명기';
  if (score >= 82) return '인생독본 순항(Calendar of Wisdom) — 허영을 덜어내고 온유한 용서와 소박함으로 일상을 지키는 안정기';
  return '고백의 침묵(Confession Vigil) — 바깥 비교를 멈추고 내면의 양심 소리에 다시 귀 기울이는 정돈기';
}

export const TOLSTOY_THEMES: TolstoyTheme[] = [
  {
    themeKey: 'spiritual_awakening',
    themeTitleRu: 'Духовное пробуждение (내면 영혼의 각성)',
    themeTitleKo: '세속적 허영과 물질의 번잡함을 털어내고 내면의 신성한 빛을 일깨움',
    existentialInsight: '우리가 겪는 모든 고통과 불안의 뿌리는 영혼의 본질을 잊고 육체적 욕망과 세상의 헛된 평판에 매달리는 데 있습니다. 참된 생명은 오직 내면의 신성한 영혼이 깨어날 때 시작됩니다.',
    practicalCounsel: '외부의 소음과 비교에서 한 걸음 물러나십시오. 하루의 시작과 끝에 조용히 침묵하며 양심이 속삭이는 고결한 지침에 귀를 기울이십시오.',
  },
  {
    themeKey: 'love_as_life_essence',
    themeTitleRu: 'Любовь как основа жизни (사람을 살리는 유일한 힘 사랑)',
    themeTitleKo: '자신에 대한 근심을 내려놓고 타인을 향해 가슴을 열 때 완성되는 참된 생명력',
    existentialInsight: '톨스토이는 천사 미하일의 입을 통해 깨달았습니다. "모든 인간은 자신을 위한 걱정으로 사는 것이 아니라 타인을 향한 사랑으로 살아간다." 사랑만이 삶에 흔들리지 않는 의미를 부여합니다.',
    practicalCounsel: '자신의 이익이나 손해만을 따지는 계산적인 마음을 내려놓으십시오. 오늘 만나는 사람에게 조건 없는 따뜻한 친절과 지지를 먼저 베푸십시오.',
  },
  {
    themeKey: 'sacred_simplicity',
    themeTitleRu: 'Священная простота (소박한 삶과 정직한 땀)',
    themeTitleKo: '군더더기 허례허식을 털어내고 소박한 일상과 정직한 노동 속에서 평화를 누림',
    existentialInsight: '삶의 가장 깊은 진실은 복잡한 이론이나 화려한 소유가 아니라 단순하고 솔직한 일상 속에 있습니다. 땀 흘려 일하고 소박하게 살아갈 때 인간은 자연과 대지, 그리고 이웃과 화해합니다.',
    practicalCounsel: '불필요한 과소비와 복잡한 인간관계를 정리하십시오. 정직한 노력과 맑고 소박한 생활 습관을 통해 내면의 군더더기를 덜어내십시오.',
  },
  {
    themeKey: 'forgiveness_and_peace',
    themeTitleRu: 'Прощение и ненасилие (용서와 비폭력의 평화)',
    themeTitleKo: '악에 악으로 맞서지 않고 용서와 온유함으로 원망의 사슬을 끊어냄',
    existentialInsight: '악을 악으로 갚으려는 행위는 불길을 기름으로 끄려는 것과 같습니다. 분노와 복수심은 상대를 파괴하기 전에 자신의 영혼을 먼저 갉아먹습니다. 오직 용서만이 영혼의 절대적 자유를 가져옵니다.',
    practicalCounsel: '마음속에 품고 있던 원망과 억울함을 이제 내려놓으십시오. 상처 준 상대를 위해서가 아니라 당신 자신의 영혼이 온전한 평화를 누리기 위해 용서를 선택하십시오.',
  },
  {
    themeKey: 'memento_mori_conscience',
    themeTitleRu: 'Память о смерти и чистая совесть (죽음의 성찰과 순결한 양심)',
    themeTitleKo: '삶의 유한성을 직시하며 언제 떠나도 부끄럼 없는 순결한 양심으로 현재를 살아감',
    existentialInsight: '죽음을 기억하는 자는 결코 사소한 일로 다투거나 헛된 욕망에 영혼을 팔지 않습니다. 유한한 삶 속에서 오직 영원한 것은 우리가 나눈 사랑과 진실뿐입니다.',
    practicalCounsel: '영원히 살 것처럼 집착하지 마십시오. 오늘이 생의 마지막 날인 것처럼 매 순간 최선을 다해 진실하게 사랑하고 행동하십시오.',
  },
];

export const TOLSTOY_APHORISMS: TolstoyAphorism[] = [
  {
    aphorismKey: 'love_what_men_live_by',
    aphorismKo: '나는 깨달았다. 모든 인간이 살아갈 수 있는 것은 자신을 걱정해서가 아니라, 사람들의 마음속에 사랑이 있기 때문이다.',
    aphorismRu: 'Я понял, что все люди живы не заботой о себе, а любовью в людях.',
    sourceContext: '《사람은 무엇으로 사는가(Чем люди живы)》 결어',
    actionGuidance: '자기 연민과 불안을 내려놓고, 주변 사람들에게 따뜻한 사랑과 나눔의 손길을 내미십시오.',
  },
  {
    aphorismKey: 'inner_kingdom_of_god',
    aphorismKo: '하느님의 나라는 당신의 내면에 있다. 구원은 외부의 권력이나 제도에 있지 않고 오직 당신 영혼의 양심을 일깨우는 데 있다.',
    aphorismRu: 'Царство Божие внутри вас.',
    sourceContext: '《인생독본(Круг чтения)》 영적 각성의 장',
    actionGuidance: '외부의 인정이나 물질적 조건에 기대지 말고, 내면의 참된 양심과 신성을 굳게 믿으십시오.',
  },
  {
    aphorismKey: 'happiness_in_simplicity',
    aphorismKo: '가장 위대한 진리는 가장 단순한 것이다. 욕망을 줄이고 이웃을 섬길 때 영혼은 비로소 자유와 평화를 얻는다.',
    aphorismRu: 'Одно из самых обычных заблуждений состоит в том, чтобы считать людей добрыми, злыми, глупыми, умными.',
    sourceContext: '《인생독본》 단순함과 절제의 지혜',
    actionGuidance: '복잡한 생각과 욕심을 비우고, 소박하고 정직한 일상의 실천에 집중하십시오.',
  },
  {
    aphorismKey: 'overcome_evil_with_good',
    aphorismKo: '악을 악으로 대하는 것은 어둠을 어둠으로 몰아내려는 것과 같다. 오직 빛만이 어둠을 밝힐 수 있고 오직 사랑만이 증오를 이긴다.',
    aphorismRu: 'Не противься злу насилием.',
    sourceContext: '《고백록(Исповедь)》 및 《나의 신앙은 어디에 있는가》',
    actionGuidance: '비난과 분노에 같은 방식으로 반응하지 말고, 의연한 품격과 온유한 선으로 대처하십시오.',
  },
];

function classifyTolstoyQuestionTopic(query?: string): TolstoyQuestionTopic {
  const q = (query ?? '').trim();
  if (!q) return 'general';
  if (/일|직장|사업|커리어|노동|프로젝트|성과|이직/.test(q)) return 'career';
  if (/사랑|연애|관계|가족|친구|갈등|화해|용서/.test(q)) return 'relationship';
  if (/돈|재물|재정|소비|투자|계약|소유/.test(q)) return 'wealth';
  if (/선택|결정|진로|방향|고민|결단/.test(q)) return 'decision';
  return 'general';
}

function buildTolstoyCrossAxis(
  topic: TolstoyQuestionTopic,
  awakening: number,
  agape: number,
  simplicity: number,
): string {
  const topicNote: Record<TolstoyQuestionTopic, string> = {
    career: '정직한 땀과 소박한 노동이 허영을 이기는 일·소명 축',
    relationship: '계산 없는 아가페 사랑과 온유한 용서가 이어지는 관계 축',
    wealth: '불필요한 소유를 덜어내고 내면 양심을 지키는 절제 축',
    decision: '세속의 평판보다 순결한 양심의 소리를 따르는 결단 축',
    general: '영적 각성과 소박한 실천이 하루의 숨결로 합일되는 균형 축',
  };
  if (agape >= awakening && agape >= simplicity) {
    return `${topicNote[topic]} · 타인을 향한 사랑이 앞서는 열린 포용 국면`;
  }
  if (simplicity >= awakening) {
    return `${topicNote[topic]} · 군더더기를 비우고 소박한 일상으로 돌아가는 정돈 국면`;
  }
  return `${topicNote[topic]} · 내면의 신성한 양심이 깨어 중심을 세우는 각성 국면`;
}

export function calculateRussianLeoTolstoyCalendarOfWisdom(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): RussianLeoTolstoyCalendarOfWisdomResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const seedString = `LEO-TOLSTOY-CALENDAR-WISDOM:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const spiritualAwakeningScore = 75 + (absHash % 24);
  const agapeLoveAltruismIndex = 77 + ((absHash >> 3) % 22);
  const simpleLifeLaborHarmonyScore = 74 + ((absHash >> 6) % 25);
  const nonViolencePeaceEquanimityIndex = 76 + ((absHash >> 9) % 23);
  const existentialConscienceIntegrityScore = 78 + ((absHash >> 12) % 21);

  const themeIndex = (absHash >> 4) % TOLSTOY_THEMES.length;
  const aphorismIndex = (absHash >> 7) % TOLSTOY_APHORISMS.length;

  const activeTolstoyTheme = TOLSTOY_THEMES[themeIndex];
  const focalTolstoyAphorism = TOLSTOY_APHORISMS[aphorismIndex];
  // 같은 저작의 명언만 반복하지 않도록 다른 원전에서 보조 테제를 하나 더 세운다(초점 테제와 항상 다름).
  const secondaryTolstoyOffset = 1 + ((absHash >> 11) % (TOLSTOY_APHORISMS.length - 1));
  const secondaryTolstoyAphorism =
    TOLSTOY_APHORISMS[(aphorismIndex + secondaryTolstoyOffset) % TOLSTOY_APHORISMS.length];

  // 질문에 반응하는 정성 성찰 질문: 지금 붙잡은 테마의 언어로 되묻는다.
  const trimmedTolstoyQuery = (query ?? '').trim();
  const questionTopic = classifyTolstoyQuestionTopic(trimmedTolstoyQuery);
  const tolstoyCrossAxis = buildTolstoyCrossAxis(
    questionTopic,
    spiritualAwakeningScore,
    agapeLoveAltruismIndex,
    simpleLifeLaborHarmonyScore,
  );
  const shadowWarning =
    '도덕적 이상과 자기 성찰이 지나쳐 스스로를 혹독하게 재단하거나 현실의 작은 즐거움마저 죄책감으로 밀어내지 않도록 살피세요.';
  const reflectiveTolstoyQuestion =
    `지금 내가 '${activeTolstoyTheme.themeTitleKo}'의 자리에서 본다면, ` +
    `나를 지치게 하는 허영을 조용히 내려놓고 오늘 이웃에게 건넬 수 있는 소박한 사랑의 구체적 행동은 무엇일까요?` +
    (trimmedTolstoyQuery ? ` (이 물음은 당신이 건넨 '${trimmedTolstoyQuery}'에 대한 성찰입니다.)` : '');

  const interpretiveBoundary =
    '톨스토이 문학의 영적 각성·아가페 사랑 상징을 빌린 정성적 성찰 관점이며, 종교적 판단이나 죄의 평가, 사건의 성패·미래 단정이 아닙니다.';

  const guidanceTitle = `레프 톨스토이 인생독본 영적 각성과 사랑 지혜: ${activeTolstoyTheme.themeTitleKo}`;
  const philosophicalCounsel = `러시아의 대문호 레프 톨스토이의 《인생독본》과 《사람은 무엇으로 사는가》는 세속의 허영과 물질적 번잡함을 털어내고, 오직 타인을 향한 사랑과 순결한 양심, 소박한 노동 속에서 참된 평화를 찾도록 안내합니다. ` +
    `현재 당신의 삶을 지탱하는 가장 거룩한 영적 원리는 '${activeTolstoyTheme.themeTitleKo}'입니다. ` +
    `${activeTolstoyTheme.practicalCounsel} 아울러 톨스토이의 불멸의 명언 "${focalTolstoyAphorism.aphorismKo}"(${focalTolstoyAphorism.aphorismRu})를 가슴에 품고, ` +
    `${focalTolstoyAphorism.actionGuidance}`;

  const calculatedAtKst = formatTolstoyKstTimestamp(now);
  const composite = Math.round(
    (spiritualAwakeningScore + agapeLoveAltruismIndex + simpleLifeLaborHarmonyScore + nonViolencePeaceEquanimityIndex + existentialConscienceIntegrityScore) / 5
  );
  const tolstoySynthesisMatrix = {
    dominantTension: `${activeTolstoyTheme.themeTitleKo} ↔ ${focalTolstoyAphorism.sourceContext}`,
    alignmentState: describeTolstoyStage(composite),
    integratedAction: `${focalTolstoyAphorism.actionGuidance}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: RUSSIAN_LEO_TOLSTOY_VERSION,
    calculatedAtKst,
    spiritualAwakeningScore,
    agapeLoveAltruismIndex,
    simpleLifeLaborHarmonyScore,
    nonViolencePeaceEquanimityIndex,
    existentialConscienceIntegrityScore,
    questionTopic,
    tolstoyCrossAxis,
    shadowWarning,
    activeTolstoyTheme,
    focalTolstoyAphorism,
    tolstoyComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
    tolstoySynthesisMatrix,
    secondaryTolstoyAphorism,
    ritualAction: `[${activeTolstoyTheme.themeKey}] ${focalTolstoyAphorism.actionGuidance}`,
    reflectionFocus: `톨스토이(${activeTolstoyTheme.themeTitleKo}) — ${focalTolstoyAphorism.sourceContext}`,
    reflectiveTolstoyQuestion,
    reflectiveQuestion: reflectiveTolstoyQuestion,
    interpretiveBoundary,
  };
}

export function formatRussianLeoTolstoyCalendarOfWisdomPrompt(res: RussianLeoTolstoyCalendarOfWisdomResult): string {
  const composite = Math.round(
    (res.spiritualAwakeningScore + res.agapeLoveAltruismIndex + res.simpleLifeLaborHarmonyScore + res.nonViolencePeaceEquanimityIndex + res.existentialConscienceIntegrityScore) / 5
  );
  const lines = [
    `【레프 톨스토이 《인생독본·사람은 무엇으로 사는가》 영적 각성 & 아가페 사랑 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진 버전: ${res.engineVersion}`,
    `- 질문 맥락: ${res.questionTopic} | 영혼·아가페 교차 축: ${res.tolstoyCrossAxis}`,
    `- 영성 각성 국면: ${describeTolstoyStage(composite)}`,
    `- 핵심 영적 테마: ${res.activeTolstoyTheme.themeTitleKo} [${res.activeTolstoyTheme.themeTitleRu}]`,
    `- 실존적 통찰: ${res.activeTolstoyTheme.existentialInsight}`,
    `- 실천적 조언: ${res.activeTolstoyTheme.practicalCounsel}`,
    `- 톨스토이 원전 명언: "${res.focalTolstoyAphorism.aphorismKo}" [${res.focalTolstoyAphorism.aphorismRu}]`,
    `- 원전 출처: [${res.focalTolstoyAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalTolstoyAphorism.actionGuidance}`,
    `- 종합 톨스토이 영성 권면: ${res.tolstoyComprehensiveGuidance.philosophicalCounsel}`,
  ];
  if (res.tolstoySynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.tolstoySynthesisMatrix.dominantTension} | 조율 상태: ${res.tolstoySynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.tolstoySynthesisMatrix.integratedAction}`,
    );
  }
  if (res.secondaryTolstoyAphorism) {
    lines.push(
      `- 보조 원전 테제: "${res.secondaryTolstoyAphorism.aphorismKo}" [${res.secondaryTolstoyAphorism.aphorismRu}]`,
      `- 보조 원전 출처: [${res.secondaryTolstoyAphorism.sourceContext}]`,
      `- 보조 실천 지침: ${res.secondaryTolstoyAphorism.actionGuidance}`,
    );
  }
  lines.push(
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveTolstoyQuestion}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  );
  return lines.join('\n');
}
