/**
 * 영국 윌리엄 셰익스피어(William Shakespeare) 《햄릿》·《맥베스》·《템페스트》·《소네트》 인간 본성 심연 직시·실존적 결단·성숙한 화해 용서 및 불멸의 예술혼 지혜 엔진
 *
 * 인류 역사상 가장 위대한 극작가이자 시인 윌리엄 셰익스피어(1564~1616)의 원전 기반:
 * 1. 비극적 심연 직시와 인간 본성 통찰도 (Tragic Depth Confrontation & Human Nature Insight Score): 햄릿·맥베스처럼 내면의 고뇌와 욕망, 위선과 인간 본성의 명암을 회피 없이 정직하게 마주하는 힘.
 * 2. 실존적 결단과 주체적 행동력 지수 (Existential Action Resolve / "To be or not to be" Index): "있음인가 없음인가(To be, or not to be)"의 고뇌를 넘어 운명의 폭풍에 당당히 맞서는 실천적 결의.
 * 3. 템페스트의 화해와 성숙한 대용서 지표 (Tempest Reconciliation & Magnanimous Forgiveness Score): 프로스페로처럼 분노와 복수의 마법 지팡이를 꺾고 인간을 품어내는 성숙한 화해와 관용의 도량.
 * 4. 시간의 무상함을 넘어서는 예술적 영원성 지수 (Poetic Immortality & Creative Aesthetic Index): 소네트 18번처럼 세월의 풍화를 이겨내고 참된 아름다움과 진실을 영원히 꽃피우는 창조적 생명력.
 * 5. "준비되어 있음이 전부다" 초연한 섭리 수용 회복탄력성 (Serene Fortitude & "Readiness is All" Resilience Score): "참새 한 마리의 추락에도 특별한 섭리가 있다. 지금이 아니라면 언젠가 올 것이요, 준비되어 있음이 전부다"라는 초연한 내면 평정심.
 *
 * @version LUCKEY-SHAKESPEARE-TRAGIC-WISDOM-v1.1.0
 */

import type { UserProfile } from '../sharedState';

export const BRITISH_WILLIAM_SHAKESPEARE_TRAGIC_WISDOM_VERSION = 'LUCKEY-SHAKESPEARE-TRAGIC-WISDOM-v1.1.0';

export type ShakespeareQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface ShakespeareTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  dramaticTone: string;
  rhythmDirective: string;
}

export interface ShakespeareTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  literaryInsight: string;
  practicalCounsel: string;
}

export interface ShakespeareAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginal: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface BritishWilliamShakespeareTragicWisdomResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 셰익스피어 핵심 지표 (0~100)
  tragicDepthConfrontationScore: number;                 // 비극적 심연 직시와 인간 본성 통찰도
  existentialActionResolveIndex: number;                 // 실존적 결단과 주체적 행동력 지수
  tempestForgivenessGraceScore: number;                  // 템페스트의 화해와 성숙한 대용서 지표
  poeticImmortalityAestheticsIndex: number;              // 시간의 무상함을 넘어서는 예술적 영원성 지수
  sereneFortitudeResilienceScore: number;                // 준비되어 있음이 전부인 초연한 회복탄력성
  // 세부 분석
  questionTopic: ShakespeareQuestionTopic;
  temporalShakespeareRhythm: ShakespeareTemporalRhythm;
  activeShakespeareTheme: ShakespeareTheme;
  focalShakespeareAphorism: ShakespeareAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  shakespeareComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const SHAKESPEARE_THEMES: ShakespeareTheme[] = [
  {
    themeKey: 'readinessIsAll',
    themeTitleEn: 'Readiness Is All: Serene Attunement to Cosmic Providence beyond Anxiety',
    themeTitleKo: '준비되어 있음이 전부다 — 불안과 번민을 내려놓고 당당하게 운명을 맞이하는 섭리의 평정',
    literaryInsight: '햄릿은 마지막 결투를 앞두고 두려워하는 호레이쇼에게 말합니다. "참새 한 마리가 떨어지는 데도 특별한 섭리가 있는 법이다. 올 것은 오게 마련이고, 지금 오지 않는다면 나중에 올 것이며, 나중에 오지 않는다면 지금 올 것이다. 중요한 것은 준비되어 있다는 것이다."',
    practicalCounsel: '미래의 불확실한 결과나 실패에 대한 불안으로 현재의 발걸음을 멈추지 마십시오. 오늘 내가 갖추어야 할 내면의 역량과 평정을 단단히 준비하는 것만이 운명의 소용돌이를 돌파하는 참된 열쇠입니다.',
  },
  {
    themeKey: 'tempestForgiveness',
    themeTitleEn: 'The Rarity of Virtue in Forgiveness: Breaking the Wand of Vengeance for Grace',
    themeTitleKo: '화해와 성숙한 용서 — 복수의 지팡이를 꺾고 관용과 사랑으로 상처를 치유하기',
    literaryInsight: '《템페스트》의 프로스페로는 마침내 자신을 추방했던 원수들을 손아귀에 넣었을 때, 복수 대신 용서를 택합니다. "덕(Virtue)의 숭고함은 복수가 아니라 용서에 있다. 그들이 뉘우쳤으니 내 분노의 마침표는 여기까지다." 그는 마법의 지팡이를 꺾고 책을 바다에 던져 인간으로 돌아옵니다.',
    practicalCounsel: '오래된 원망과 분노를 움켜쥐고 있으면 영혼이 과거의 감옥에 갇힙니다. 상처를 대자비로 감싸 안고 화해의 손길을 내밀 때, 비로소 참된 자유와 새로운 세계의 지평이 열립니다.',
  },
  {
    themeKey: 'toThineOwnSelfBeTrue',
    themeTitleEn: 'To Thine Own Self Be True: Uncompromising Inner Authenticity and Integrity',
    themeTitleKo: '무엇보다 네 자신에게 진실하라 — 타인의 시선과 거짓 가면을 벗고 내면의 진실 지키기',
    literaryInsight: '폴로니어스가 레어티스에게 남긴 가장 고결한 교훈: "무엇보다 네 자신에게 진실하여라. 그리하면 밤이 낮을 따르듯, 너는 그 어떤 사람에게도 거짓될 수 없으리라." 셰익스피어는 세상의 위선 속에서 자기 영혼의 진실성을 지키는 자만이 참된 존엄을 얻는다고 역설합니다.',
    practicalCounsel: '세속적 평판이나 일시적 이익을 위해 당신의 양심과 고유한 본성을 희생하지 마십시오. 자신에게 정직하고 떳떳한 자는 어떤 풍파 속에서도 내면의 중심을 잃지 않습니다.',
  },
  {
    themeKey: 'eternalSummerArt',
    themeTitleEn: 'Thy Eternal Summer Shall Not Fade: Creative Immortality Conquering Time',
    themeTitleKo: '그대의 영원한 여름은 시들지 않으리 — 시간의 풍화를 뛰어넘는 창조적 진실의 불멸성',
    literaryInsight: '소네트 18번에서 셰익스피어는 세월의 잔혹한 낫(Time\'s Scythe) 앞에서 모든 육체와 자연이 쇠락할지라도, 진실한 사랑과 고결한 예술적 창조는 영원한 생명을 얻는다고 노래합니다. "인간이 숨을 쉬고 눈으로 볼 수 있는 한, 이 시는 살아남아 그대에게 생명을 주리라."',
    practicalCounsel: '유한한 순간의 상실에 낙담하지 마십시오. 당신이 진심을 다해 빚어낸 진솔한 가치, 사랑, 창조적 산물은 시간의 한계를 넘어 사람들의 영혼 속에 불멸의 빛으로 남을 것입니다.',
  },
];

export const SHAKESPEARE_APHORISMS: ShakespeareAphorism[] = [
  {
    aphorismKey: 'readinessIsAllQuote',
    aphorismKo: '참새 한 마리가 떨어지는 데도 특별한 섭리가 있는 법이다. 지금 올 것이라면 나중에 오지 않을 것이고, 나중에 오지 않을 것이라면 지금 올 것이다. 결국 오지 않을 것이 아니라면 언젠가는 오게 마련이다. 준비되어 있음이 전부다.',
    aphorismOriginal: 'There is special providence in the fall of a sparrow. If it be now, \'tis not to come; if it be not to come, it will be now; if it be not now, yet it will come—the readiness is all.',
    sourceContext: '《햄릿(Hamlet)》 제5막 제2장 (햄릿의 대사)',
    actionGuidance: '결과에 연연하는 조급한 두려움을 비우고, 지금 이 순간 최선의 준비와 의연한 태도로 삶을 온전히 마주하십시오.',
  },
  {
    aphorismKey: 'toBeOrNotToBeQuote',
    aphorismKo: '사느냐 죽느냐, 그것이 문제로다. 가혹한 운명의 화살을 맞고도 마음속으로 참아내는 것이 고결한가, 아니면 노도처럼 밀려오는 고난의 바다에 맞서 무기를 들고 싸워 끝장을 내는 것이 고결한가.',
    aphorismOriginal: 'To be, or not to be, that is the question: Whether \'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them.',
    sourceContext: '《햄릿(Hamlet)》 제3막 제1장 (햄릿의 독백)',
    actionGuidance: '수동적인 체념이나 우유부단한 망설임을 멈추고, 당신의 삶을 스스로 결단하고 개척하는 주체적 행동에 돌입하십시오.',
  },
  {
    aphorismKey: 'tempestVirtueQuote',
    aphorismKo: '더 고결한 행동은 복수가 아니라 용서에 있는 법이다. 그들이 뉘우쳤으니, 내 유일한 뜻은 이루어졌다. 더 이상 분노의 화살을 당기지 않으리라.',
    aphorismOriginal: 'The rarer action is in virtue than in vengeance: they being penitent, the sole drift of my purpose doth extend not a frown further.',
    sourceContext: '《템페스트(The Tempest)》 제5막 제1장 (프로스페로의 결단)',
    actionGuidance: '과거의 원한을 내려놓고 넓은 관용으로 상대를 감싸 안으십시오. 복수의 고리를 끊어낼 때 진정한 내면의 승리가 완성됩니다.',
  },
  {
    aphorismKey: 'toThineOwnSelfQuote',
    aphorismKo: '무엇보다 네 자신에게 진실하여라. 그리하면 밤이 낮을 따르듯, 너는 그 어떤 사람에게도 거짓될 수 없으리라.',
    aphorismOriginal: 'This above all: to thine own self be true, and it must follow, as the night the day, thou canst not then be false to any man.',
    sourceContext: '《햄릿(Hamlet)》 제1막 제3장 (폴로니어스의 훈계)',
    actionGuidance: '타인의 기대나 세속적 잣대에 맞추어 자신을 속이지 마십시오. 내면의 정직함이 가장 강력한 삶의 방패입니다.',
  },
  {
    aphorismKey: 'weAreSuchStuffQuote',
    aphorismKo: '우리는 꿈과 같은 재료로 빚어졌으며, 우리의 이 덧없는 작은 삶은 잠으로 둘러싸여 있도다.',
    aphorismOriginal: 'We are such stuff as dreams are made on, and our little life is rounded with a sleep.',
    sourceContext: '《템페스트(The Tempest)》 제4막 제1장 (프로스페로의 성찰)',
    actionGuidance: '세속의 집착과 오만을 털어내고, 삶의 신비로운 찰나를 겸허하고 따스한 눈길로 사랑하십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function classifyShakespeareQuestionTopic(query?: string): ShakespeareQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/사랑|연애|관계|결혼|이별|가족|친구|갈등|사람|동료|부모|용서/.test(q)) return 'relationship';
  if (/선택|결정|이직|사업|진로|시험|돈|투자|계약|시작|포기|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|상처|치유|위로|외로|슬픔|걱정|두려|피곤/.test(q)) return 'healing';
  return 'reflection';
}

function buildShakespeareTemporalRhythm(now?: Date): ShakespeareTemporalRhythm {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const kstDateLabel = kst.toISOString().slice(0, 10);
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 11) {
    return {
      kstDateLabel,
      timeWindowKo: '아침 준비됨의 서막 (05:00~11:00 KST)',
      dramaticTone: '초연한 대비와 내면의 정직성',
      rhythmDirective: '오늘 무대 위에 오르기 전, 스스로에게 진실한 자세로 내면의 준비를 다지는 시간입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstDateLabel,
      timeWindowKo: '낮 주체적 결단의 막 (11:00~17:00 KST)',
      dramaticTone: '망설임을 건너는 실행의 의지',
      rhythmDirective: '지나친 계산과 머뭇거림을 접고, 지금 내 몫의 무대에서 분명한 태도를 세우는 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstDateLabel,
      timeWindowKo: '저녁 템페스트 화해의 막 (17:00~22:00 KST)',
      dramaticTone: '분노를 거두는 관용과 품위',
      rhythmDirective: '낮 동안 쌓인 서운함과 원망의 지팡이를 내려놓고 인간적인 너그러움을 회복하는 시간입니다.',
    };
  }
  return {
    kstDateLabel,
    timeWindowKo: '심야 영원한 여름의 성찰 (22:00~05:00 KST)',
    dramaticTone: '꿈과 같은 생을 비추는 고요한 시선',
    rhythmDirective: '덧없는 걱정을 잠재우고, 시간의 풍화를 넘어 남을 진심과 아름다움을 가늠하는 시간입니다.',
  };
}

function buildShakespeareTopicGuidance(topic: ShakespeareQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '상대를 이기려는 복수나 자존심의 칼날을 거두고, 성숙한 관용과 솔직한 진심으로 관계의 매듭을 푸십시오.',
      ritualAction: '마음속에 담아 둔 서운함 하나를 미움 대신 담담한 경계와 놓아줌으로 정리하기',
      reflectionFocus: '지금 이 관계에서 나를 움직이는 것은 상처 입은 자존심인가, 아니면 더 큰 품위와 진실인가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '결과를 미리 완벽히 통제하려다 망설이지 말고, 내가 준비할 수 있는 최선만 갖춘 채 당당히 선택하십시오.',
      ritualAction: '결정을 막고 있는 두려움 하나를 적고 "내가 지금 준비할 수 있는 것" 한 줄만 실행하기',
      reflectionFocus: '네 자신에게 진실하다는 기준으로 볼 때, 어떤 선택이 가장 떳떳하게 남는가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '인간 본성의 연약함과 삶의 폭풍을 부끄러워하지 마십시오. 폭풍 뒤에는 반드시 맑은 화해의 섬이 열립니다.',
      ritualAction: '오늘 스스로를 다그치던 내면의 독백을 멈추고 "지금 이만하면 충분히 버텨 왔다"고 인정하기',
      reflectionFocus: '지나간 폭풍의 상처에서 이제 내가 내려놓아도 좋을 무거운 갑옷은 무엇인가?',
    };
  }
  return {
    practiceGuidance: '세속의 역할과 가면을 잠시 내려놓고, 시간의 흐름 속에서도 시들지 않을 나만의 진실을 붙드십시오.',
    ritualAction: '오늘 하루 가장 나다운 진심이 담겼던 말이나 행동 한 가지를 떠올려 보기',
    reflectionFocus: '모든 외적 조건이 걷힌 뒤에도 내가 끝까지 지키고 싶은 내면의 진실은 무엇인가?',
  };
}

export function calculateBritishWilliamShakespeareTragicWisdom(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): BritishWilliamShakespeareTragicWisdomResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalShakespeareRhythm = buildShakespeareTemporalRhythm(now);
  const questionTopic = classifyShakespeareQuestionTopic(query);
  const topicGuidance = buildShakespeareTopicGuidance(questionTopic);

  const seedString = `SHAKESPEARE-TRAGIC-WISDOM:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalShakespeareRhythm.kstDateLabel}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const tragicDepthConfrontationScore = 90 + ((absHash >> 1) % 9);
  const existentialActionResolveIndex = 89 + ((absHash >> 4) % 10);
  const tempestForgivenessGraceScore = 88 + ((absHash >> 7) % 11);
  const poeticImmortalityAestheticsIndex = 91 + ((absHash >> 10) % 8);
  const sereneFortitudeResilienceScore = 90 + ((absHash >> 13) % 9);

  const themeIndex = (absHash >> 5) % SHAKESPEARE_THEMES.length;
  const aphorismIndex = (absHash >> 8) % SHAKESPEARE_APHORISMS.length;

  const activeShakespeareTheme = SHAKESPEARE_THEMES[themeIndex];
  const focalShakespeareAphorism = SHAKESPEARE_APHORISMS[aphorismIndex];

  const guidanceTitle = `윌리엄 셰익스피어 비극적 지혜와 실존적 결단: ${activeShakespeareTheme.themeTitleKo}`;
  const philosophicalCounsel = `영국 문학의 거장이자 불멸의 극작가 윌리엄 셰익스피어 선생은 《햄릿》, 《맥베스》, 《템페스트》를 통해 ` +
    `인간 본성의 깊은 심연과 위선을 정직하게 응시하는 통찰력, "있음인가 없음인가"의 고뇌를 딛고 일어서는 주체적 결단, ` +
    `복수의 지팡이를 꺾고 관용으로 품는 템페스트의 숭고한 용서, 그리고 "준비되어 있음이 전부다(The readiness is all)"라는 의연한 섭리 수용의 평정심을 일깨웠습니다. ` +
    `지금 당신에게 가장 절실한 지혜의 나침반은 '${activeShakespeareTheme.themeTitleKo}'입니다. ` +
    `${activeShakespeareTheme.practicalCounsel} ${topicGuidance.practiceGuidance} 셰익스피어의 불멸의 원전 격언 "${focalShakespeareAphorism.aphorismKo}"을 가슴에 새기고, ` +
    `${focalShakespeareAphorism.actionGuidance}`;

  const boundaryNotice = '윌리엄 셰익스피어 문학·철학 해석은 인간 본성과 선택을 비추는 상징·성찰 관점이며, 미래의 확정 예언이나 사실 판정이 아닙니다.';

  return {
    engineVersion: BRITISH_WILLIAM_SHAKESPEARE_TRAGIC_WISDOM_VERSION,
    calculatedAtKst: (now ?? new Date()).toISOString(),
    tragicDepthConfrontationScore,
    existentialActionResolveIndex,
    tempestForgivenessGraceScore,
    poeticImmortalityAestheticsIndex,
    sereneFortitudeResilienceScore,
    questionTopic,
    temporalShakespeareRhythm,
    activeShakespeareTheme,
    focalShakespeareAphorism,
    practiceGuidance: topicGuidance.practiceGuidance,
    ritualAction: topicGuidance.ritualAction,
    reflectionFocus: topicGuidance.reflectionFocus,
    boundaryNotice,
    shakespeareComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatBritishWilliamShakespeareTragicWisdomPrompt(
  res: BritishWilliamShakespeareTragicWisdomResult,
): string {
  return [
    `【윌리엄 셰익스피어 《햄릿·템페스트》 비극적 통찰·실존적 결단 지표】`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- KST 시공간 리듬: ${res.temporalShakespeareRhythm.kstDateLabel} · ${res.temporalShakespeareRhythm.timeWindowKo} (${res.temporalShakespeareRhythm.dramaticTone}) — ${res.temporalShakespeareRhythm.rhythmDirective}`,
    `- 핵심 셰익스피어 테마: ${res.activeShakespeareTheme.themeTitleKo} [${res.activeShakespeareTheme.themeTitleEn}]`,
    `- 문학적 사색: ${res.activeShakespeareTheme.literaryInsight}`,
    `- 행동 조언: ${res.activeShakespeareTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 핵심 성찰 질문: ${res.reflectionFocus}`,
    `- 셰익스피어 원전 명대사: "${res.focalShakespeareAphorism.aphorismKo}"`,
    `- 원문: (${res.focalShakespeareAphorism.aphorismOriginal})`,
    `- 원전 출처: [${res.focalShakespeareAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalShakespeareAphorism.actionGuidance}`,
    `- 종합 셰익스피어 권면: ${res.shakespeareComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
