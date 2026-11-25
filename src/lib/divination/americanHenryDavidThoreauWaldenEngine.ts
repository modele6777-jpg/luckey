/**
 * 미국 헨리 데이비드 소로(Henry David Thoreau) 《월든(Walden)》 & 《시민 불복종(Civil Disobedience)》 단순한 삶(Simplicity) & 자연 합일·깨어있는 양심 실천 엔진
 *
 * 미국 초월주의와 생태주의 사상가 헨리 데이비드 소로(Henry David Thoreau, 1817~1862)의 《월든(Walden, 1854)》과 《시민 불복종(Civil Disobedience, 1849)》 원전 기반의 정성적 성찰 엔진.
 *
 * @version LUCKEY-HENRY-DAVID-THOREAU-WALDEN-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_HENRY_DAVID_THOREAU_VERSION = 'LUCKEY-HENRY-DAVID-THOREAU-WALDEN-v2.4.0';

export type ThoreauQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface ThoreauTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface ThoreauAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface ThoreauTemporalWaldenRhythm {
  kstWindow: string;
  seasonalTone: string;
  waldenFocus: '새벽 각성(Awakening)' | '단순한 실천(Simplicity)' | '자연 교감(Nature)' | '양심의 고요(Conscience)';
  waldenClarityIndex: number;
  rhythmDirective: string;
}

export interface ThoreauSynthesisMatrix {
  essentialSimplicity: number;
  awakenedAutonomy: number;
  natureResilience: number;
  overallSynthesis: number;
}

export interface HenryDavidThoreauWaldenResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: ThoreauQuestionTopic;
  waldenCrossAxis: string;
  thoreauShadowWarning: string;
  // 내부 호환용 수치 (프롬프트 비노출)
  simplicityEssentialLifeScore: number;
  natureCommunionHarmoniaScore: number;
  awakenedConsciousnessIndex: number;
  moralConscienceDisobedienceScore: number;
  vitalMarrowLivingIndex: number;
  // 세부 정성 분석
  activeThoreauTheme: ThoreauTheme;
  focalThoreauAphorism: ThoreauAphorism;
  temporalWaldenRhythm: ThoreauTemporalWaldenRhythm;
  thoreauSynthesisMatrix: ThoreauSynthesisMatrix;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  thoreauComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const THOREAU_THEMES: ThoreauTheme[] = [
  {
    themeKey: 'simplicity_deliberate_living',
    themeTitleEn: 'Simplicity and Deliberate Living (단순함과 본질적 삶)',
    themeTitleKo: '번잡한 소유와 허례허식을 털어내고 삶의 알맹이에 집중함',
    existentialInsight: '삶을 복잡하게 만드는 군더더기 욕망과 체면을 덜어낼 때, 비로소 내가 진정으로 원하는 본질이 또렷이 드러납니다.',
    practicalCounsel: '불필요한 약속과 소모적인 비교를 비워내고, 오늘 가장 중요한 본질적 가치 한두 가지에 깊이 머무십시오.',
  },
  {
    themeKey: 'walden_nature_communion',
    themeTitleEn: 'Walden Nature Communion (월든 호수와 자연의 교감)',
    themeTitleKo: '자연의 고요한 리듬에 스며들어 영혼의 깊은 안식을 회복함',
    existentialInsight: '숲과 호수, 계절의 리듬은 조급해진 시야를 넓히고 지친 마음에 고요한 회복을 돌려줍니다.',
    practicalCounsel: '인공적인 화면과 소음에서 잠시 물러나 바깥 공기를 마시며 걸어 보십시오. 자연의 호흡 앞에서 복잡한 엉킴이 가벼워집니다.',
  },
  {
    themeKey: 'awakened_morning_consciousness',
    themeTitleEn: 'Awakened Morning Consciousness (깨어있는 새벽의 영혼)',
    themeTitleKo: '날마다 새롭게 동터 오는 아침처럼 의식을 투명하고 명징하게 세움',
    existentialInsight: '참된 하루는 시계가 울릴 때가 아니라 우리의 의식이 깨어날 때 시작됩니다. 관성을 벗어나 깨어 있는 시선으로 오늘을 마주해야 합니다.',
    practicalCounsel: '습관적인 체념이나 미룸에서 한 걸음 벗어나, 오늘 내가 진실로 원하는 방향을 맑은 눈으로 바라십시오.',
  },
  {
    themeKey: 'conscience_and_moral_integrity',
    themeTitleEn: 'Conscience and Moral Integrity (양심과 불의에 맞서는 도덕적 용기)',
    themeTitleKo: '세상의 편한 타협을 거부하고 내면의 양심에 당당히 섬',
    existentialInsight: '다수가 따른다고 해서 그것이 내 삶의 정답이 되지는 않습니다. 내 안의 양심이 옳다고 가리키는 기준을 지킬 때 흔들리지 않는 자존이 섭니다.',
    practicalCounsel: '주변의 눈치 때문에 억지로 맞추고 있던 부분이 있다면, 조용하지만 분명하게 나의 선을 세우십시오.',
  },
  {
    themeKey: 'different_drummer_independent_path',
    themeTitleEn: 'Marching to a Different Drummer (다른 북소리를 따르는 고유한 보폭)',
    themeTitleKo: '세상의 획일적 성공 기준을 벗어나 나만의 고유한 리듬으로 전진함',
    existentialInsight: '모두가 같은 속도와 같은 방향으로 걸을 필요는 없습니다. 나만의 북소리에 보폭을 맞추는 일이야말로 진정한 자립입니다.',
    practicalCounsel: '남들의 속도와 비교하며 조급해하지 마십시오. 나에게 맞는 보폭과 리듬을 신뢰하고 묵묵히 걸어가십시오.',
  },
];

export const THOREAU_APHORISMS: ThoreauAphorism[] = [
  {
    aphorismKey: 'simplicity_three_affairs',
    aphorismKo: '단순하게, 단순하게, 단순하게 살아라! 그대의 일을 백 가지나 천 가지 대신 두 가지나 세 가지로 줄여라.',
    aphorismEn: 'Simplicity, simplicity, simplicity! I say, let your affairs be as two or three, and not a hundred or a thousand.',
    sourceContext: '《월든(Walden)》 제2장 <내가 살았던 곳과 내가 살았던 이유>',
    actionGuidance: '오늘 하루 번잡한 일정을 과감히 줄이고, 마음이 닿는 핵심 과업 1~2개에만 에너지를 모으십시오.',
  },
  {
    aphorismKey: 'live_deliberately_marrow',
    aphorismKo: '나는 삶의 본질적인 사실들만을 마주하고 삶이 가르쳐 주는 바를 배우기 위해 숲으로 들어갔다.',
    aphorismEn: 'I went to the woods because I wished to live deliberately, to front only the essential facts of life...',
    sourceContext: '《월든》 제2장 <내가 살았던 곳과 내가 살았던 이유>',
    actionGuidance: '피상적인 겉치레를 걷어내고, 진정으로 살아있다고 느끼는 일에 정직하게 마음을 쓰십시오.',
  },
  {
    aphorismKey: 'hear_different_drummer',
    aphorismKo: '만약 어떤 사람이 동료들과 보폭을 맞추지 않는다면, 그것은 그가 다른 북소리를 듣고 있기 때문이다.',
    aphorismEn: 'If a man does not keep pace with his companions, perhaps it is because he hears a different drummer. Let him step to the music which he hears.',
    sourceContext: '《월든》 제18장 <맺는 말>',
    actionGuidance: '주변의 기대나 유행에 휩쓸리지 말고, 내면에서 울리는 나만의 리듬을 존중하십시오.',
  },
  {
    aphorismKey: 'men_first_subjects_afterward',
    aphorismKo: '우리는 먼저 국민이기 이전에 한 인간이어야 한다. 법에 대한 존경심보다 정의에 대한 존경심을 키워야 한다.',
    aphorismEn: 'We should be men first, and subjects afterward. It is not desirable to cultivate a respect for the law, so much as for the right.',
    sourceContext: '《시민 불복종(Civil Disobedience)》',
    actionGuidance: '관례라는 핑계 뒤로 숨지 말고, 내 양심에 비추어 부끄럼 없는 태도를 선택하십시오.',
  },
];

function classifyThoreauTopic(question: string): ThoreauQuestionTopic {
  const q = question.toLowerCase();
  if (/연애|사랑|관계|이별|재회|결혼|사람|배우자|친구|가족|갈등/.test(q)) return 'relationship';
  if (/선택|결정|이직|창업|진로|계약|시험|투자|사업|옮길|할까|말까/.test(q)) return 'decision';
  if (/마음|우울|불안|치유|회복|건강|지침|슬픔|휴식|외로|힘들/.test(q)) return 'healing';
  return 'reflection';
}

function getKstDateKey(now: Date): string {
  const kstMs = now.getTime() + 9 * 60 * 60 * 1000;
  return new Date(kstMs).toISOString().slice(0, 10);
}

function formatKstTimestamp(now: Date): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const ss = String(kst.getUTCSeconds()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}+09:00 (KST)`;
}

const THOREAU_TOPIC_GUIDANCE: Record<
  ThoreauQuestionTopic,
  { practice: string; ritual: string; reflection: string; counsel: string; shadowWarning: string }
> = {
  relationship: {
    practice: '관계에서 겉치레와 눈치를 덜어내고, 서로의 고유한 보폭(다른 북소리)을 존중하는 솔직한 거리를 찾으십시오.',
    ritual: '오늘 누군가와의 대화에서 과장이나 변명 없이, 진심에 가장 가까운 짧은 문장 하나만 건네 보십시오.',
    reflection: '이 관계에서 내가 체면 때문에 억지로 맞추고 있는 부분은 무엇인가요?',
    counsel: '소로의 단순함은 관계에도 적용됩니다. 꾸밈을 걷어낼수록 진정한 마음이 선명히 남습니다.',
    shadowWarning: '나만의 북소리를 지킨다는 이유로 상대의 진심 어린 조언이나 현실적 약속까지 무작정 끊어내지 않도록 살피십시오.',
  },
  decision: {
    practice: '세상의 기준이 정한 속도가 아니라, 내 양심과 삶의 본질에 부합하는 선택을 고요히 고르십시오.',
    ritual: '지금 고민하는 선택지 중, "남의 시선"을 지웠을 때도 여전히 하고 싶은 쪽이 어느 쪽인지 적어 보십시오.',
    reflection: '이 선택은 내 삶을 더 단순하고 명징하게 만드나요, 아니면 불필요한 짐을 더 얹나요?',
    counsel: '다른 북소리를 듣는 사람은 남들과 보폭이 달라도 흔들리지 않습니다.',
    shadowWarning: '단순함과 원칙에 집중하다가 현실의 세부 일정이나 생계·계약 조건까지 소홀히 보지 않도록 균형을 맞추십시오.',
  },
  healing: {
    practice: '복잡한 생각과 화면의 소음을 잠시 비우고, 자연의 고요함과 소박한 일상으로 마음을 쉬게 하십시오.',
    ritual: '오늘 15분만이라도 이어폰 없이 바깥 공기를 느끼며 천천히 걸어 보십시오.',
    reflection: '지금 내 마음을 가장 무겁게 짓누르는 것은 실제 현실인가요, 아니면 비워내도 될 욕심인가요?',
    counsel: '월든 호수의 고요처럼, 덜어냄 자체가 이미 가장 깊은 회복의 시작입니다.',
    shadowWarning: '숲의 고요로 물러나는 쉼이 장기적인 고립이나 무기력한 도피로 이어지지 않도록 돌아올 시간도 함께 정해 두십시오.',
  },
  reflection: {
    practice: '하루의 일과를 백 가지가 아닌 두세 가지 핵심으로 줄여, 깨어 있는 의식으로 오늘을 살아 보십시오.',
    ritual: '오늘 해야 할 목록에서 당장 중요하지 않은 일 세 가지를 과감히 지워 보십시오.',
    reflection: '요즘 내 하루에서 가장 본질적이고 나를 살아있게 만드는 시간은 언제인가요?',
    counsel: '단순하게 살수록 삶의 알맹이는 더욱 선명해집니다.',
    shadowWarning: '일정을 줄여 단순화할 때도 지금 당장 끝내야 할 작은 책임 한 가지는 미루지 말고 바로 처리하십시오.',
  },
};

function buildTemporalWaldenRhythm(now: Date): ThoreauTemporalWaldenRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 월든 호수의 얼음이 녹듯 낡은 관성을 깨고 깨어나는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 숲의 생명력 속에서 본질적 일에 깊이 몰입하는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 불필요한 소유와 겉치레를 비워내어 단순해지는 계절'
          : '겨울 — 난롯가 고요 속에서 내면의 양심과 자립을 단단히 다지는 계절';

  if (hour >= 4 && hour < 10) {
    return {
      kstWindow: '새벽·아침 각성(Awakened Morning) 창',
      seasonalTone,
      waldenFocus: '새벽 각성(Awakening)',
      waldenClarityIndex: 93,
      rhythmDirective: '하루의 영혼이 가장 투명하게 깨어나는 아침입니다. 백 가지 일 대신 핵심 두세 가지만 남기십시오.',
    };
  }
  if (hour >= 10 && hour < 16) {
    return {
      kstWindow: '한낮 단순한 실천(Simplicity) 창',
      seasonalTone,
      waldenFocus: '단순한 실천(Simplicity)',
      waldenClarityIndex: 85,
      rhythmDirective: '남들의 속도에 휩쓸리기 쉬운 낮 시간입니다. 나만의 북소리에 맞춰 군더더기 없이 움직이십시오.',
    };
  }
  if (hour >= 16 && hour < 21) {
    return {
      kstWindow: '저녁 자연 교감(Nature Communion) 산책 창',
      seasonalTone,
      waldenFocus: '자연 교감(Nature)',
      waldenClarityIndex: 87,
      rhythmDirective: '화면과 소음에서 잠시 물러나 바깥 공기와 하늘을 마주하며 하루의 긴장을 덜어내십시오.',
    };
  }
  return {
    kstWindow: '심야 양심의 고요(Conscience) 창',
    seasonalTone,
    waldenFocus: '양심의 고요(Conscience)',
    waldenClarityIndex: 81,
    rhythmDirective: '체면과 비교의 소음이 멈춘 밤입니다. 내 안의 양심에 부끄럼 없는 고요한 쉼을 허락하십시오.',
  };
}

export function calculateHenryDavidThoreauWalden(
  profile: UserProfile,
  question = '',
  now: Date = new Date()
): HenryDavidThoreauWaldenResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const questionTopic = classifyThoreauTopic(question);
  const kstDate = getKstDateKey(now);

  const seedString = `HENRY-DAVID-THOREAU-WALDEN:${name}:${birthDate}:${birthTime}:${gender}:${kstDate}:${questionTopic}:${question}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const simplicityEssentialLifeScore = 75 + (absHash % 24);
  const natureCommunionHarmoniaScore = 73 + ((absHash >> 3) % 26);
  const awakenedConsciousnessIndex = 74 + ((absHash >> 6) % 25);
  const moralConscienceDisobedienceScore = 72 + ((absHash >> 9) % 27);
  const vitalMarrowLivingIndex = 76 + ((absHash >> 12) % 23);

  const themeIndex = (absHash >> 4) % THOREAU_THEMES.length;
  const aphorismIndex = (absHash >> 7) % THOREAU_APHORISMS.length;

  const activeThoreauTheme = THOREAU_THEMES[themeIndex];
  const focalThoreauAphorism = THOREAU_APHORISMS[aphorismIndex];
  const topicGuide = THOREAU_TOPIC_GUIDANCE[questionTopic];
  const temporalWaldenRhythm = buildTemporalWaldenRhythm(now);

  const essentialSimplicity = Math.min(99, Math.round((simplicityEssentialLifeScore + vitalMarrowLivingIndex) / 2));
  const awakenedAutonomy = Math.min(99, Math.round((awakenedConsciousnessIndex + moralConscienceDisobedienceScore) / 2));
  const natureResilience = Math.min(99, Math.round((natureCommunionHarmoniaScore + temporalWaldenRhythm.waldenClarityIndex) / 2));
  const overallSynthesis = Math.round((essentialSimplicity + awakenedAutonomy + natureResilience) / 3);

  const thoreauSynthesisMatrix: ThoreauSynthesisMatrix = {
    essentialSimplicity,
    awakenedAutonomy,
    natureResilience,
    overallSynthesis,
  };

  const practiceGuidance = `${activeThoreauTheme.practicalCounsel} ${topicGuide.practice}`;
  const ritualAction = topicGuide.ritual;
  const reflectionFocus = topicGuide.reflection;
  const trimmedQ = question.trim();
  const reflectiveQuestion = trimmedQ
    ? `‘${trimmedQ}’라는 물음을 두고 남의 시선과 체면을 지운다면, 내 안의 다른 북소리가 조용히 가리키는 단순한 진실은 무엇인가요?`
    : reflectionFocus;
  const counselNote = topicGuide.counsel;
  const thoreauShadowWarning = topicGuide.shadowWarning;
  const waldenCrossAxis = `${questionTopic} · ${temporalWaldenRhythm.waldenFocus} · ${activeThoreauTheme.themeKey}`;
  const boundaryNotice = '헨리 데이비드 소로의 월든 관점은 삶의 본질과 내적 자립을 비추는 철학적 성찰 도구이며, 구체적인 사실 판단이나 미래 예언을 대신하지 않습니다.';

  const guidanceTitle = `헨리 데이비드 소로 월든 단순함과 양심 지혜: ${activeThoreauTheme.themeTitleKo}`;
  const philosophicalCounsel = `헨리 데이비드 소로의 월든 사상은 복잡한 욕망과 겉치레를 비워내고, 삶의 본질과 자연의 호흡, 깨어있는 양심으로 서도록 일깨웁니다. ` +
    `지금 당신의 질문 맥락에 비추어진 성찰 원리는 '${activeThoreauTheme.themeTitleKo}'입니다. ` +
    `${practiceGuidance} 《월든》의 문장 "${focalThoreauAphorism.aphorismKo}"을 마음에 품고, ${focalThoreauAphorism.actionGuidance}`;

  return {
    engineVersion: AMERICAN_HENRY_DAVID_THOREAU_VERSION,
    calculatedAtKst: formatKstTimestamp(now),
    questionTopic,
    waldenCrossAxis,
    thoreauShadowWarning,
    simplicityEssentialLifeScore,
    natureCommunionHarmoniaScore,
    awakenedConsciousnessIndex,
    moralConscienceDisobedienceScore,
    vitalMarrowLivingIndex,
    activeThoreauTheme,
    focalThoreauAphorism,
    temporalWaldenRhythm,
    thoreauSynthesisMatrix,
    practiceGuidance,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    counselNote,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    thoreauComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

function describeThoreauStage(score: number): string {
  if (score >= 90) return '충만·맑은 본질(Liminal Clarity)';
  if (score >= 82) return '단순·깨어있는 자립(Awakened)';
  return '고요·호수 성찰(Contemplative)';
}

export function formatHenryDavidThoreauWaldenPrompt(res: HenryDavidThoreauWaldenResult): string {
  return [
    `【헨리 데이비드 소로 《월든》 단순함 & 양심 지표 (${res.engineVersion})】`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 핵심 초월주의 테마: ${res.activeThoreauTheme.themeTitleKo} [${res.activeThoreauTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeThoreauTheme.existentialInsight}`,
    `- 실천 조언: ${res.practiceGuidance}`,
    `- 일상 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 핵심 원전 경구: "${res.focalThoreauAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalThoreauAphorism.aphorismEn}" [${res.focalThoreauAphorism.sourceContext}]`,
    `- KST 월든 리듬: ${res.temporalWaldenRhythm.kstWindow} (${res.temporalWaldenRhythm.waldenFocus}, 흐름 ${describeThoreauStage(res.temporalWaldenRhythm.waldenClarityIndex)}) — ${res.temporalWaldenRhythm.rhythmDirective}`,
    `- 교차 조율 축: ${res.waldenCrossAxis}`,
    `- 과잉·고립 경계: ${res.thoreauShadowWarning}`,
    `- 월든 매트릭스: 본질 단순성(${describeThoreauStage(res.thoreauSynthesisMatrix.essentialSimplicity)}) · 깨어난 자립(${describeThoreauStage(res.thoreauSynthesisMatrix.awakenedAutonomy)}) · 자연 회복력(${describeThoreauStage(res.thoreauSynthesisMatrix.natureResilience)}) — 종합 결(${describeThoreauStage(res.thoreauSynthesisMatrix.overallSynthesis)})`,
    `- 조언 요약: ${res.counselNote}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
