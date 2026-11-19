/**
 * 중세 이슬람 수피즘 잘랄 앗 딘 루미(Jalal al-Din Rumi) 마스나비 & 신성한 사랑 지혜 엔진
 *
 * 페르시아 수피즘 신비주의 문학의 거장 잘랄 앗 딘 루미(1207~1273)의 원전 기반:
 * 1. 《마스나비(Masnavi-i Ma'navi)》: '갈대피리의 노래'로 시작하여 인간 영혼이 본래의 신성한 근원과의 분리에서 느끼는 갈망과 치유, 사랑의 영적 여정.
 * 2. 《디완 에 샴스(Diwan-e Shams-e Tabrizi)》: 스승 샴스 타브리즈와의 만남을 통해 에고(Nafs)의 껍질을 깨고 신성한 사랑(Ishq)으로 승화하는 법열.
 * 3. 수피 영적 단계(Maqamat):
 *    - 갈망(Talab): 에고의 한계를 자각하고 진정한 영혼의 진실을 찾는 열망.
 *    - 정화(Qalb): 가슴을 닦아 신성한 빛이 온전히 비추도록 비우는 작업.
 *    - 소멸과 합일(Fana & Baqa): 거짓된 자아를 녹여내고 영원한 본성 속에 머묾.
 * 4. 사마(Sama) 세마 선회 명상: 우주의 끊임없는 회전과 사랑의 박동에 조응하여 얻는 초월적 평정.
 * 5. 상처의 치유 통찰: "상처는 빛이 그대에게 들어오는 문이다(The wound is the place where the Light enters you)."
 *
 * v2.1.0 정성 체계: 질문 주제 분기(questionTopic) · KST 시공간 리듬(temporalSamaRhythm) ·
 * 일상 실천 의례(dailyPracticeRitual) · 성찰 질문(reflectiveQuestion) · 해석 경계(interpretiveBoundary)를 갖추고,
 * 결과 객체의 수치 필드는 내부 호환용으로만 남기며 프롬프트에서는 /100·%·원본 수치를 노출하지 않습니다.
 *
 * @version LUCKEY-RUMI-MASNAVI-SUFI-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const RUMI_MASNAVI_SUFI_VERSION = 'LUCKEY-RUMI-MASNAVI-SUFI-v2.4.0';

export type RumiQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface SufiTemporalSamaRhythm {
  kstWindow: string;
  seasonTone: string;
  samaFocus: '갈망의 문(Talab)' | '정화의 시간(Qalb)' | '선회의 평정(Sama)' | '합일의 고요(Fana)';
  rhythmStageKo: string;
  rhythmGuidance: string;
}

export interface SufiSpiritualStation {
  stationKey: string;
  stationNameArabic: string;
  stationNameKo: string;
  spiritualMeaning: string;
  practicalCounsel: string;
}

export interface RumiPoeticWisdom {
  quoteKey: string;
  originalTheme: string;
  persianOrEnglishTheme: string;
  wisdomInsight: string;
  guidance: string;
}

export interface RumiMasnaviDivineLoveResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: RumiQuestionTopic;
  // 5대 핵심 지표 (0~100)
  ishqDivineLoveScore: number;            // 신성한 사랑(Ishq) 영혼 갈망도
  qalbPurificationScore: number;          // 심장(Qalb) 내면 정화 및 직관력
  fanaEgoDissolutionScore: number;        // 에고(Nafs) 집착 초월 및 무아 합일도
  samaWhirlingTranquilityScore: number;   // 선회(Sama) 초월적 평정 지수
  woundLightWisdomScore: number;          // 상처를 빛의 통로로 바꾸는 수용 통찰력
  // 세부 체계
  activeSpiritualStation: SufiSpiritualStation;
  focalPoeticWisdom: RumiPoeticWisdom;
  temporalSamaRhythm: SufiTemporalSamaRhythm;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  rumiMysticCounsel: {
    counselTitle: string;
    mysticGuidance: string;
  };
  rumiSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export type RumiMasnaviDivineLoveReport = RumiMasnaviDivineLoveResult;

const SPIRITUAL_STATIONS: SufiSpiritualStation[] = [
  {
    stationKey: 'Talab',
    stationNameArabic: 'طلب (Talab)',
    stationNameKo: '갈망과 추구의 단계',
    spiritualMeaning: '세속의 피상적인 만족을 넘어 영혼의 참된 근원과 온전함을 향해 스스로를 열어젖히는 거룩한 갈증입니다.',
    practicalCounsel: '마음속 결핍이나 공허를 두려워하지 마십시오. 그것은 더 깊고 아름다운 진실을 품으라는 영혼의 초대장입니다.',
  },
  {
    stationKey: 'Ishq',
    stationNameArabic: 'عشق (Ishq)',
    stationNameKo: '신성한 불꽃의 사랑 단계',
    spiritualMeaning: '계산과 두려움을 단숨에 태워버리는 무조건적인 사랑이자, 생명 전체와 깊이 교명하는 불타는 열정입니다.',
    practicalCounsel: '손익을 따지는 차가운 계산을 잠시 내려놓고, 그대의 온 마음과 진정성을 담아 지금 마주한 일과 사람을 끌어안으십시오.',
  },
  {
    stationKey: 'Fana',
    stationNameArabic: 'فناء (Fana)',
    stationNameKo: '에고의 소멸과 초월 단계',
    spiritualMeaning: '좁은 자아의 에고와 방어벽이 녹아내려, 거대한 우주의 신성한 흐름과 하나 됨(Tawhid)을 체감하는 경지입니다.',
    practicalCounsel: '스스로를 증명하려는 긴장과 집착을 가볍게 내려놓으십시오. 비워진 그릇에만 가장 순수한 축복이 담길 수 있습니다.',
  },
  {
    stationKey: 'Baqa',
    stationNameArabic: 'بقاء (Baqa)',
    stationNameKo: '신성한 현존과 회복의 단계',
    spiritualMeaning: '정화된 내면으로 세상 속으로 다시 걸어나와, 매 순간 따뜻한 자비와 평화로운 침묵으로 현존하는 삶입니다.',
    practicalCounsel: '일상의 아주 작은 순간 속에서도 고요한 중심을 잃지 마십시오. 당신의 온화한 태도가 주변 모두를 치유하는 안식처가 됩니다.',
  },
];

const POETIC_WISDOMS: RumiPoeticWisdom[] = [
  {
    quoteKey: 'WoundLight',
    originalTheme: '상처는 빛이 들어오는 문',
    persianOrEnglishTheme: 'The wound is the place where the Light enters you',
    wisdomInsight: '삶에서 겪은 아픔과 좌절은 영혼의 결함이 아니라, 더 깊은 지혜와 자비의 빛이 스며들기 위해 열린 신성한 틈새입니다.',
    guidance: '과거의 시련을 부끄러워하거나 숨기려 하지 마십시오. 그 상처의 자리가 바로 당신을 가장 따뜻하고 지혜로운 사람으로 빚어낸 거룩한 통로입니다.',
  },
  {
    quoteKey: 'BeyondRightWrong',
    originalTheme: '옳고 그름의 너머에 있는 초원',
    persianOrEnglishTheme: 'Out beyond ideas of wrongdoing and rightdoing, there is a field',
    wisdomInsight: '시비분별과 판단의 잣대를 넘어선 자리에 순수한 생명과 존재 자체가 만나는 평화로운 지대가 있습니다.',
    guidance: '서로를 비난하고 평가하는 소모적인 논쟁에서 한 걸음 물러나십시오. 침묵 속에서 서로의 존재 자체를 마주할 때 진정한 이해가 시작됩니다.',
  },
  {
    quoteKey: 'DropInTheOcean',
    originalTheme: '바다 속의 물방울이 아닌 물방울 속의 바다',
    persianOrEnglishTheme: 'You are not a drop in the ocean. You are the entire ocean in a drop',
    wisdomInsight: '인간은 무력하고 왜소한 한 점 티끌이 아니라, 우주 전체의 지혜와 가능성을 온전히 품고 있는 광활한 소우주입니다.',
    guidance: '스스로의 가능성을 작게 제한하지 마십시오. 당신 안에 잠재된 거대한 사랑과 창조적 잠재력을 온전히 신뢰하십시오.',
  },
  {
    quoteKey: 'SilenceLanguageOfGod',
    originalTheme: '신의 언어인 침묵',
    persianOrEnglishTheme: 'Silence is the language of God, all else is poor translation',
    wisdomInsight: '말과 생각의 소음이 멎을 때 비로소 가슴 한가운데서 울려 퍼지는 직관과 평화의 참소리를 들을 수 있습니다.',
    guidance: '하루 중 잠시라도 모든 말과 화면을 멈추고 고요한 침묵 속에 머무르십시오. 그 침묵 속에서 가장 명명백백한 답이 떠오를 것입니다.',
  },
];

function classifyRumiQuestionTopic(query: string): RumiQuestionTopic {
  if (/관계|사랑|연인|연애|가족|친구|동료|갈등|다툼|다투|다툐|싸우|서운|이별|그리움/.test(query)) return 'relationship';
  if (/결정|선택|이직|창업|시작|계획|진로|미래|도전|목표/.test(query)) return 'decision';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|지친|상처|슬픔/.test(query)) return 'healing';
  return 'reflection';
}

function describeRumiStage(score: number): string {
  if (score >= 92) return '불꽃이 환히 타오르는 결(Ishq)';
  if (score >= 84) return '가슴이 서서위 닦이는 결(Qalb)';
  if (score >= 76) return '에고의 껍질이 얇아지는 결(Nafs)';
  return '갈증으로 먼저 열리는 결(Talab)';
}

function buildSufiTemporalSamaRhythm(now: Date): SufiTemporalSamaRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonTone =
    month >= 3 && month <= 5
      ? '봄 — 갈망의 씨앗이 트는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 불꽃(Ishq)이 가장 뜨거운 계절'
        : month >= 9 && month <= 11
          ? '가을 — 거둔 것을 비우고 정화하는 계절'
          : '겨울 — 침묵 속에 내면을 닦는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '새벽 — 갈망의 문이 열리는 시간',
      seasonTone,
      samaFocus: '갈망의 문(Talab)',
      rhythmStageKo: '마음이 먼저 열리는 결',
      rhythmGuidance: '아침에는 결론보다 간절함을 먼저 인정해 보세요. 무엇이 그리운지 아는 것이 영적 여정의 시작입니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '낮 — 가슴을 닦는 시간',
      seasonTone,
      samaFocus: '정화의 시간(Qalb)',
      rhythmStageKo: '감정이 실제로 정리되는 결',
      rhythmGuidance: '낮에는 미움과 미련을 없애려 애쓰기보다, 지금 마음에 남은 것을 솔직히 적어 보세요.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 — 선회의 평정 시간',
      seasonTone,
      samaFocus: '선회의 평정(Sama)',
      rhythmStageKo: '하루의 소음이 가라앉는 결',
      rhythmGuidance: '저녁에는 하루의 소란에서 한 발 물러나, 나를 살게 한 작은 것들을 떠올려 보세요.',
    };
  }
  return {
    kstWindow: '밤 — 합일의 고요 시간',
    seasonTone,
    samaFocus: '합일의 고요(Fana)',
    rhythmStageKo: '자아가 앞은히 놓이는 결',
    rhythmGuidance: '밤에는 스스로를 증명하려는 마음을 잠시 내려놓고, 아무것도 하지 않는 시간을 허락해 주세요.',
  };
}

function buildRumiTopicExtras(topic: RumiQuestionTopic): { dailyPracticeRitual: string; reflectiveQuestion: string } {
  switch (topic) {
    case 'relationship':
      return {
        dailyPracticeRitual: '오늘 고마운 사람에게 조건 없는 감사 한마디를 먼저 건네기.',
        reflectiveQuestion: '이 관계에서 나는 상대를 사랑하는 것인가요, 내가 바라는 모습을 사랑하는 것인가요?',
      };
    case 'decision':
      return {
        dailyPracticeRitual: '결정 앞에서 잠시 손을 멈추고, 두려움과 진짜 바람을 종이에 나누어 적어 보기.',
        reflectiveQuestion: '이 선택에서 내가 두려워하는 것은 상실인가요, 아니면 아직 사랑하지 못한 나 자신인가요?',
      };
    case 'healing':
      return {
        dailyPracticeRitual: '아픈 기억 하나를 떠올려, 그것을 지우려 하지 않고 그 자리에 잠시 머물러 보기.',
        reflectiveQuestion: '이 상처가 내게 열어 준 문은 무엇이며, 그 문으로 들어온 빛은 무엇입니까?',
      };
    default:
      return {
        dailyPracticeRitual: '하루 중 잠시 모든 말과 화면을 멈추고 고요한 침묵에 머물러 보기.',
        reflectiveQuestion: '내가 지금 붙잡고 있는 것이 나를 살리는 것인가요, 아니면 무서워서 놓지 못하는 것인가요?',
      };
  }
}

export function calculateRumiMasnaviDivineLove(
  profile: UserProfile,
  question = '',
  now: Date = new Date(),
): RumiMasnaviDivineLoveResult {
  const questionTopic = classifyRumiQuestionTopic(question);
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    questionTopic +
    question.trim() +
    'RumiMasnaviSufi';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const ishqDivineLoveScore = 67 + (absHash % 32);
  const qalbPurificationScore = 65 + ((absHash >> 3) % 34);
  const fanaEgoDissolutionScore = 66 + ((absHash >> 6) % 33);
  const samaWhirlingTranquilityScore = 64 + ((absHash >> 9) % 35);
  const woundLightWisdomScore = 68 + ((absHash >> 12) % 31);

  const stationIndex = (absHash >> 4) % SPIRITUAL_STATIONS.length;
  const wisdomIndex = (absHash >> 7) % POETIC_WISDOMS.length;

  const activeSpiritualStation = SPIRITUAL_STATIONS[stationIndex];
  const focalPoeticWisdom = POETIC_WISDOMS[wisdomIndex];
  const temporalSamaRhythm = buildSufiTemporalSamaRhythm(now);
  const topicExtras = buildRumiTopicExtras(questionTopic);
  const interpretiveBoundary =
    '루미와 수피 영성의 관점은 사랑과 상처를 영적으로 비추는 상징적 성찰 렌즈입니다. 개인의 길흉과 미래를 단정하지 않고, 종교적 권위나 치료적 판단을 대신하지 않습니다. 헌신을 이유로 자기희생이나 불합리한 복종을 권하지 않습니다.';

  const counselTitle = `루미 마스나비 수피 지혜: ${activeSpiritualStation.stationNameKo}`;
  const mysticGuidance = `잘랄 앗 딘 루미의 수피즘 영성은 에고의 방어벽을 녹여내고 영혼의 본래 빛과 신성한 사랑을 회복하도록 이끕니다. ` +
    `현재 당신의 영적 배움은 '${activeSpiritualStation.stationNameKo}(${activeSpiritualStation.stationNameArabic})'의 흐름에 닿아 있습니다. ` +
    `${activeSpiritualStation.practicalCounsel} 또한 루미의 통찰인 '${focalPoeticWisdom.originalTheme}'를 마음에 새겨, ` +
    `${focalPoeticWisdom.guidance}`;

  const trimmedQ = question.trim();
  const rumiSynthesisMatrix = {
    dominantTension: `${focalPoeticWisdom.originalTheme} ↔ ${activeSpiritualStation.stationNameKo}`,
    alignmentState: `${temporalSamaRhythm.samaFocus} · ${questionTopic}`,
    integratedAction: `${topicExtras.dailyPracticeRitual}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: RUMI_MASNAVI_SUFI_VERSION,
    calculatedAtKst: (() => {
      const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const y = kst.getUTCFullYear();
      const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
      const d = String(kst.getUTCDate()).padStart(2, '0');
      const hh = String(kst.getUTCHours()).padStart(2, '0');
      const mm = String(kst.getUTCMinutes()).padStart(2, '0');
      return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
    })(),
    questionTopic,
    ishqDivineLoveScore,
    qalbPurificationScore,
    fanaEgoDissolutionScore,
    samaWhirlingTranquilityScore,
    woundLightWisdomScore,
    activeSpiritualStation,
    focalPoeticWisdom,
    temporalSamaRhythm,
    dailyPracticeRitual: topicExtras.dailyPracticeRitual,
    reflectiveQuestion: topicExtras.reflectiveQuestion,
    interpretiveBoundary,
    ritualAction: `[${activeSpiritualStation.stationNameKo}] ${topicExtras.dailyPracticeRitual}`,
    reflectionFocus: topicExtras.reflectiveQuestion,
    rumiMysticCounsel: {
      counselTitle,
      mysticGuidance,
    },
    rumiSynthesisMatrix,
  };
}

export function formatRumiMasnaviDivineLovePrompt(res: RumiMasnaviDivineLoveResult): string {
  const matrixLine = res.rumiSynthesisMatrix
    ? `- 루미 수피 교차 매트릭스: 핵심 긴장(${res.rumiSynthesisMatrix.dominantTension}) · 조율 상태(${res.rumiSynthesisMatrix.alignmentState}) · 통합 실천(${res.rumiSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【루미 마스나비 & 수피즘 신성한 사랑 지표 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 질문 맥락 초점: ${res.questionTopic}`,
    `- 신성한 사랑(Ishq) 영혼 갈망 결: ${describeRumiStage(res.ishqDivineLoveScore)}`,
    `- 심장(Qalb) 내면 정화 결: ${describeRumiStage(res.qalbPurificationScore)}`,
    `- 에고(Nafs) 집착 초월·무아 합일 결: ${describeRumiStage(res.fanaEgoDissolutionScore)}`,
    `- 선회(Sama) 초월적 평정 결: ${describeRumiStage(res.samaWhirlingTranquilityScore)}`,
    `- 상처의 빛 수용 통찰 결: ${describeRumiStage(res.woundLightWisdomScore)}`,
    `- 핵심 수피 영적 단계: ${res.activeSpiritualStation.stationNameKo} [${res.activeSpiritualStation.stationNameArabic}]`,
    `- 단계적 의미: ${res.activeSpiritualStation.spiritualMeaning}`,
    `- 실천적 영성 조언: ${res.activeSpiritualStation.practicalCounsel}`,
    `- 루미의 핵심 시적 지혜: ${res.focalPoeticWisdom.originalTheme}`,
    `- 영적 통찰: ${res.focalPoeticWisdom.wisdomInsight}`,
    `- KST 시공간 리듬: ${res.temporalSamaRhythm.kstWindow} (${res.temporalSamaRhythm.seasonTone}, ${res.temporalSamaRhythm.samaFocus}, ${res.temporalSamaRhythm.rhythmStageKo}) — ${res.temporalSamaRhythm.rhythmGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 실천 의례(Ritual Action): ${res.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 신비주의 수양 지침: ${res.rumiMysticCounsel.mysticGuidance}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
