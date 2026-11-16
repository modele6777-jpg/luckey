/**
 * 미국 월트 휘트먼(Walt Whitman) 《풀잎(Leaves of Grass)》 & 〈나 자신의 노래(Song of Myself)〉 지혜 엔진
 *
 * 미국 문학의 아버지이자 민주주의와 대자연의 음유시인 월트 휘트먼(Walt Whitman, 1819~1892)의 불멸의 시집
 * 《풀잎(Leaves of Grass, 1855)》 및 〈나 자신의 노래(Song of Myself)〉, 〈열린 길의 노래(Song of the Open Road)〉 원전 기반:
 * 1. 나 자신을 긍정하고 찬미하는 생명 환희 지수(Song of Myself Self-Celebration Score): 타인의 잣대를 넘어 고유한 존재 자체를 찬양하는 자존감.
 * 2. 모순과 다채로움을 온전히 품어 안는 대우주적 포용력(Embracing Multitudes Inclusivity Index): "나는 광대하며 수많은 것들을 품고 있다"는 광활한 수용성.
 * 3. 풀잎 속에서 우주의 신성을 발견하는 생명 경탄도(Leaves of Grass Wonder & Vitality Score): 작은 풀잎 하나도 별들의 운행 못지않다는 기적의 감각.
 * 4. 격식과 두려움을 떨치고 나아가는 자유로운 개척정신(Democratic Freedom & Open Road Spirit Index): 열린 길(Open Road)을 향해 성큼 발을 내딛는 모험심.
 * 5. 삶과 죽음의 영원한 순환 속에서 피어나는 낙관적 회복탄력성(Cycle of Nature & Optimistic Resilience Score): 절망을 넘어 빛을 향해 고개를 드는 생명력.
 *
 * @version LUCKEY-WHITMAN-LEAVES-OF-GRASS-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_WALT_WHITMAN_VERSION = 'LUCKEY-WHITMAN-LEAVES-OF-GRASS-v2.1.0';

export type WhitmanQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface WhitmanTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  vitalityTone: string;
  rhythmDirective: string;
}

export interface WhitmanTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface WhitmanAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AmericanWaltWhitmanLeavesOfGrassResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 휘트먼 풀잎·생명 지표 (0~100)
  songOfMyselfSelfCelebrationScore: number;     // 나 자신의 찬미 및 생명 환희 지수 (Song of Myself Self-Celebration)
  embracingMultitudesInclusivityIndex: number;  // 모순 포용 및 대우주적 수용성 지표 (Embracing Multitudes Inclusivity)
  leavesOfGrassWonderVitalityScore: number;     // 풀잎의 경이 및 생명 경탄도 (Leaves of Grass Wonder & Vitality)
  democraticFreedomOpenRoadIndex: number;       // 열린 길을 향한 자유로운 개척정신 (Open Road Spirit & Freedom)
  cyclicalNatureOptimisticResilienceScore: number; // 자연 순환 신뢰 및 낙관적 회복탄력성 (Cycle of Nature & Resilience)
  // 세부 분석
  questionTopic: WhitmanQuestionTopic;
  temporalWhitmanRhythm: WhitmanTemporalRhythm;
  activeWhitmanTheme: WhitmanTheme;
  focalWhitmanAphorism: WhitmanAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary?: string;
  situationalWhitmanAudit: {
    focusTheme: string;
    vitalityCue: string;
    tacticalStep: string;
  };
  whitmanSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  whitmanComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const WHITMAN_THEMES: WhitmanTheme[] = [
  {
    themeKey: 'songOfMyselfAffirmation',
    themeTitleEn: 'Celebrating the Self & Inherent Dignity',
    themeTitleKo: '"나는 나 자신을 찬미하고 노래한다" — 외부 평가를 초월하는 무조건적 자아 긍정',
    pragmaticInsight: '세상의 잣대와 비교의 늪에서 벗어날 때 내면의 무한한 에너지가 샘솟습니다. 당신의 숨결, 신체, 영혼은 그 자체로 완전하며 축복받아야 마땅한 신비입니다.',
    practicalCounsel: '타인의 시선이나 사회적 기대에 위축되지 마십시오. 당신이라는 고유하고 당당한 우주를 온전히 믿고, 가슴을 펴며 자신의 존재를 힘차게 긍정하십시오.',
  },
  {
    themeKey: 'containMultitudesWisdom',
    themeTitleEn: 'Embracing Contradictions & Multitudes',
    themeTitleKo: '"나는 광대하며 수많은 것들을 품고 있다" — 내면의 모순과 다채로움을 긍정하는 지혜',
    pragmaticInsight: '인간은 단 하나의 틀이나 단어에 갇힐 수 없는 광활한 존재입니다. 내 안의 상반된 감정과 생각들을 억지로 쳐내지 않고 모두 품어 안을 때 비로소 거인의 그릇이 완성됩니다.',
    practicalCounsel: '완벽하게 일관되려고 스스로를 옥죄지 마십시오. 흔들림과 변화, 다채로운 생각의 흐름을 나의 자연스러운 풍요로움으로 수용하고 넓은 안목으로 세상을 품으십시오.',
  },
  {
    themeKey: 'grassLeafMiracle',
    themeTitleEn: 'Cosmic Wonder in a Leaf of Grass',
    themeTitleKo: '"한 잎의 풀도 별들의 여정 못지않다" — 소박한 일상 속에서 발견하는 우주의 경이',
    pragmaticInsight: '진정한 기적은 거창한 성공이나 비범한 사건에만 있는 것이 아닙니다. 발밑에 돋아난 소박한 풀잎 하나, 오늘 마시는 한 모금의 공기 속에 온 우주의 신성이 깃들어 있습니다.',
    practicalCounsel: '거대한 성취에만 목매어 현재의 소소한 축복들을 놓치지 마십시오. 오늘 내 곁에 있는 평범한 것들의 아름다움에 경탄하며 깊은 감사와 생명력을 회복하십시오.',
  },
  {
    themeKey: 'openRoadPioneerSpirit',
    themeTitleEn: 'The Joy of the Open Road',
    themeTitleKo: '"홀가분한 마음으로 열린 길을 나서라" — 낡은 굴레를 벗어던지는 자유로운 모험심',
    pragmaticInsight: '안전지대에 안주하는 것은 영혼을 서서히 메마르게 만듭니다. 과거의 후회와 무거운 짐을 내려놓고 탁 트인 길을 향해 담대하게 발을 내딛을 때 삶은 무한한 축제가 됩니다.',
    practicalCounsel: '지나간 일에 대한 미련과 미래에 대한 두려움을 털어내십시오. 활기차고 가벼운 걸음으로 미지의 영역에 도전하며, 새로운 기회와 만남을 온몸으로 환영하십시오.',
  },
];

export const WHITMAN_APHORISMS: WhitmanAphorism[] = [
  {
    aphorismKey: 'containMultitudes',
    aphorismKo: '내가 나 자신과 모순되는가? 그렇다면 나는 나 자신과 모순된다. 나는 광대하며 수많은 것들을 품고 있다.',
    aphorismEn: 'Do I contradict myself? Very well then I contradict myself, (I am large, I contain multitudes.)',
    sourceContext: '〈나 자신의 노래(Song of Myself)〉 제51연',
    actionGuidance: '내면의 일시적인 혼란이나 모순을 자책하지 마십시오. 당신의 영혼은 그 모든 다채로움을 너끈히 품어낼 만큼 크고 넓습니다.',
  },
  {
    aphorismKey: 'leafOfGrassJourney',
    aphorismKo: '나는 믿는다, 한 잎의 풀도 별들의 여정에 못지않은 경이로움이라고.',
    aphorismEn: 'I believe a leaf of grass is no less than the journey-work of the stars.',
    sourceContext: '〈나 자신의 노래(Song of Myself)〉 제31연',
    actionGuidance: '지극히 소박한 일상과 현재의 과업 속에 깃든 위대한 의미를 신뢰하며 정성을 다하십시오.',
  },
  {
    aphorismKey: 'openRoadSong',
    aphorismKo: '나는 홀가분한 마음으로 탁 트인 길을 나선다. 건강하고 자유로우며 온 세상이 내 앞에 펼쳐져 있다.',
    aphorismEn: 'Afoot and light-hearted I take to the open road, healthy, free, the world before me.',
    sourceContext: '〈열린 길의 노래(Song of the Open Road)〉 첫 연',
    actionGuidance: '과거의 미련과 불필요한 근심을 털어버리고, 자유롭고 경쾌한 태도로 새로운 도전의 길을 걸어가십시오.',
  },
  {
    aphorismKey: 'sunshineAndShadow',
    aphorismKo: '얼굴을 언제나 태양을 향해 두어라. 그러면 그림자는 언제나 등 뒤로 드리워질 것이다.',
    aphorismEn: 'Keep your face always toward the sunshine—and shadows will fall behind you.',
    sourceContext: '《풀잎(Leaves of Grass)》 잠언',
    actionGuidance: '부정적인 그림자에 시선을 빼앗기지 말고, 밝은 희망과 긍정의 가능성에 초점을 맞추어 전진하십시오.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function classifyWhitmanQuestionTopic(query?: string): WhitmanQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/사랑|연애|관계|결혼|이별|가족|친구|갈등|사람|동료|부모/.test(q)) return 'relationship';
  if (/선택|결정|이직|사업|진로|시험|돈|투자|계약|시작|포기|방향/.test(q)) return 'decision';
  if (/지치|힘들|불안|우울|상처|치유|위로|외로|슬픔|걱정|두려|피곤/.test(q)) return 'healing';
  return 'reflection';
}

function buildWhitmanTemporalRhythm(now?: Date): WhitmanTemporalRhythm {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 60 * 60 * 1000);
  const kstDateLabel = kst.toISOString().slice(0, 10);
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 11) {
    return {
      kstDateLabel,
      timeWindowKo: '아침 열린 길의 시간 (05:00~11:00 KST)',
      vitalityTone: '가볍고 자유로운 출발',
      rhythmDirective: '묵은 짐을 내려놓고 새 아침의 공기를 들이마시며 열린 길을 내딛기 좋은 시간입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstDateLabel,
      timeWindowKo: '낮 태양과 생명 찬가의 시간 (11:00~17:00 KST)',
      vitalityTone: '존재의 긍정과 활력',
      rhythmDirective: '타인의 기준 대신 내 숨결과 발걸음의 생동감을 믿고 움직이는 시간입니다.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstDateLabel,
      timeWindowKo: '저녁 풀잎 경이의 시간 (17:00~22:00 KST)',
      vitalityTone: '소박한 일상 속 경탄',
      rhythmDirective: '하루의 작은 풀잎 같은 순간들 속에서 고요한 감사와 넉넉함을 발견하는 시간입니다.',
    };
  }
  return {
    kstDateLabel,
    timeWindowKo: '심야 다중성 포용의 시간 (22:00~05:00 KST)',
    vitalityTone: '모순을 품는 광대한 숨',
    rhythmDirective: '낮 동안 흔들린 마음과 모순된 감정까지도 내 안의 일부로 너그럽게 품어 안는 시간입니다.',
  };
}

function buildWhitmanTopicGuidance(topic: WhitmanQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '상대의 다름과 내 안의 모순을 억지로 재단하지 말고, 있는 그대로의 숨결을 존중하며 여백을 두십시오.',
      ritualAction: '가까운 사람의 낯설거나 서툰 면 하나를 고치려 하기보다 있는 그대로 바라봐 주기',
      reflectionFocus: '내가 상대에게 기대하는 단 하나의 틀 때문에 그 사람의 광대함을 좁게 보고 있지는 않은가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '완벽한 정답을 기다리느라 멈추기보다, 홀가분한 마음으로 열린 길에 첫발을 내딛어 보십시오.',
      ritualAction: '망설이던 선택 앞에서 두려움을 부풀리는 생각 대신 지금 당장 할 수 있는 가벼운 한 걸음 정하기',
      reflectionFocus: '타인의 시선을 걷어내고 나 자신의 노래를 따른다면 어느 길로 발길이 향하는가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '흔들리고 모순되는 마음조차 생명의 일부입니다. 오늘 곁에 있는 작은 풀잎과 숨결에서 온기를 회복하십시오.',
      ritualAction: '잠시 바깥 공기를 쐬며 하늘이나 나무, 풀잎 하나를 1분간 가만히 바라보기',
      reflectionFocus: '내가 스스로를 작게 평가하느라 잊고 있던 나만의 고유한 생명력은 무엇인가?',
    };
  }
  return {
    practiceGuidance: '크고 거창한 성취에만 마음을 묶지 말고, 오늘의 평범한 숨과 다채로운 감정을 넉넉히 긍정하십시오.',
    ritualAction: '오늘 하루 중 작지만 살아 있음을 느끼게 해 준 순간 한 가지 적어 두기',
    reflectionFocus: '지금 내 안의 여러 감정과 생각들을 억누르지 않고 어떻게 하나로 품어낼 수 있을까?',
  };
}

export function calculateAmericanWaltWhitmanLeavesOfGrass(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): AmericanWaltWhitmanLeavesOfGrassResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalWhitmanRhythm = buildWhitmanTemporalRhythm(now);
  const questionTopic = classifyWhitmanQuestionTopic(query);
  const topicGuidance = buildWhitmanTopicGuidance(questionTopic);

  const seedString = `WHITMAN-LEAVES-OF-GRASS:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalWhitmanRhythm.kstDateLabel}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const songOfMyselfSelfCelebrationScore = 84 + ((absHash >> 1) % 15);
  const embracingMultitudesInclusivityIndex = 83 + ((absHash >> 4) % 16);
  const leavesOfGrassWonderVitalityScore = 85 + ((absHash >> 7) % 14);
  const democraticFreedomOpenRoadIndex = 82 + ((absHash >> 10) % 17);
  const cyclicalNatureOptimisticResilienceScore = 83 + ((absHash >> 13) % 16);

  const themeIndex = (absHash >> 5) % WHITMAN_THEMES.length;
  const aphorismIndex = (absHash >> 8) % WHITMAN_APHORISMS.length;

  const activeWhitmanTheme = WHITMAN_THEMES[themeIndex];
  const focalWhitmanAphorism = WHITMAN_APHORISMS[aphorismIndex];

  const guidanceTitle = `월트 휘트먼 풀잎 생명 찬가: ${activeWhitmanTheme.themeTitleKo}`;
  const philosophicalCounsel = `미국의 대시인 월트 휘트먼은 "나는 광대하며 수많은 것들을 품고 있다(I am large, I contain multitudes)"는 긍정과 소박한 풀잎의 경이를 노래합니다. ` +
    `현재 당신의 흐름에서 핵심이 되는 지혜는 '${activeWhitmanTheme.themeTitleKo}'입니다. ` +
    `${activeWhitmanTheme.practicalCounsel} ${topicGuidance.practiceGuidance} 휘트먼의 시구 "${focalWhitmanAphorism.aphorismKo}"를 품고, ` +
    `${focalWhitmanAphorism.actionGuidance}`;

  const boundaryNotice = '월트 휘트먼 풀잎 해석은 자아 긍정과 열린 시선을 돕는 상징·성찰 관점이며, 미래 예측이나 확정적 판단이 아닙니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstLabel = `${temporalWhitmanRhythm.kstDateLabel} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} KST`;
  const situationalWhitmanAudit = {
    focusTheme: `${questionTopic} · 풀잎 생명 찬가`,
    vitalityCue: temporalWhitmanRhythm.vitalityTone,
    tacticalStep: topicGuidance.ritualAction,
  };
  const whitmanSynthesisMatrix = {
    coreInsight: activeWhitmanTheme.themeTitleKo,
    recommendedAction: topicGuidance.practiceGuidance,
    cautionNotice: '스스로를 작게 재단하거나 어두운 그림자 쪽으로만 시선을 고정하지 마십시오.',
  };

  return {
    engineVersion: AMERICAN_WALT_WHITMAN_VERSION,
    calculatedAtKst: kstLabel,
    songOfMyselfSelfCelebrationScore,
    embracingMultitudesInclusivityIndex,
    leavesOfGrassWonderVitalityScore,
    democraticFreedomOpenRoadIndex,
    cyclicalNatureOptimisticResilienceScore,
    questionTopic,
    temporalWhitmanRhythm,
    activeWhitmanTheme,
    focalWhitmanAphorism,
    practiceGuidance: topicGuidance.practiceGuidance,
    ritualAction: topicGuidance.ritualAction,
    reflectionFocus: topicGuidance.reflectionFocus,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    situationalWhitmanAudit,
    whitmanSynthesisMatrix,
    whitmanComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAmericanWaltWhitmanLeavesOfGrassPrompt(
  res: AmericanWaltWhitmanLeavesOfGrassResult,
): string {
  return [
    `【월트 휘트먼 《풀잎(Leaves of Grass)》 우주적 생명 찬가 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- KST 시공간 리듬: ${res.temporalWhitmanRhythm.kstDateLabel} · ${res.temporalWhitmanRhythm.timeWindowKo} (${res.temporalWhitmanRhythm.vitalityTone}) — ${res.temporalWhitmanRhythm.rhythmDirective}`,
    `- 핵심 휘트먼 생명 테마: ${res.activeWhitmanTheme.themeTitleKo} [${res.activeWhitmanTheme.themeTitleEn}]`,
    `- 시적·실천적 통찰: ${res.activeWhitmanTheme.pragmaticInsight}`,
    `- 생명력 행동 조언: ${res.activeWhitmanTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 핵심 성찰 질문: ${res.reflectionFocus}`,
    `- 교차 매트릭스: 핵심(${res.whitmanSynthesisMatrix.coreInsight}) | 실행(${res.whitmanSynthesisMatrix.recommendedAction}) | 주의(${res.whitmanSynthesisMatrix.cautionNotice})`,
    `- 휘트먼 원전 명시: "${res.focalWhitmanAphorism.aphorismKo}"`,
    `- 영문 원시 인용: "${res.focalWhitmanAphorism.aphorismEn}"`,
    `- 원전 출처: [${res.focalWhitmanAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalWhitmanAphorism.actionGuidance}`,
    `- 종합 휘트먼 생명 권면: ${res.whitmanComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
