/**
 * 미국/독일 한나 아렌트(Hannah Arendt) 《인간의 조건(The Human Condition)》 탄생성(Natality) & 활동적 삶(Vita Activa)·사유와 판단 지혜 엔진
 *
 * 20세기 정치철학자 한나 아렌트(Hannah Arendt, 1906~1975)의 주저 《인간의 조건(The Human Condition, 1958)》, 《예루살렘의 아이히만》, 《정신의 삶》 원전 기반의 정성적 성찰 엔진.
 *
 * @version LUCKEY-HANNAH-ARENDT-VITA-ACTIVA-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const AMERICAN_GERMAN_HANNAH_ARENDT_VERSION = 'LUCKEY-HANNAH-ARENDT-VITA-ACTIVA-v2.2.0';

export type ArendtQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface ArendtTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  existentialInsight: string;
  practicalCounsel: string;
}

export interface ArendtAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismEn: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface ArendtTemporalVitaActivaRhythm {
  kstWindow: string;
  seasonalTone: string;
  vitaActivaFocus: '탄생성(Natality)' | '공적 행위(Action)' | '사유와 대화(Thinking)' | '용서와 약속(Forgiveness & Promise)';
  natalityClarityIndex: number;
  rhythmDirective: string;
}

export interface ArendtSynthesisMatrix {
  natalityInitiation: number;
  reflectiveConscience: number;
  pluralitySolidarity: number;
  overallSynthesis: number;
}

export interface HannahArendtVitaActivaResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: ArendtQuestionTopic;
  // 내부 호환용 수치 (프롬프트 비노출)
  natalityRenewalCapacityScore: number;
  vitaActivaBalanceScore: number;
  banalityOfEvilOvercomingThinkingScore: number;
  publicRealmPluralityIndex: number;
  forgivenessAndPromiseFidelityScore: number;
  // 세부 정성 분석
  activeArendtTheme: ArendtTheme;
  focalArendtAphorism: ArendtAphorism;
  temporalVitaActivaRhythm: ArendtTemporalVitaActivaRhythm;
  arendtSynthesisMatrix: ArendtSynthesisMatrix;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  arendtComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const ARENDT_THEMES: ArendtTheme[] = [
  {
    themeKey: 'natality_new_beginning',
    themeTitleEn: 'Natality and the Miracle of Beginning (탄생성과 시작의 기적)',
    themeTitleKo: '과거의 인과를 끊고 누구도 예상치 못한 새로운 시작을 결단함',
    existentialInsight: '인간은 태어남(탄생성)을 통해 세계에 새로운 첫 발을 내딛습니다. 과거의 실패나 관성에 매이지 않고 언제든 전혀 새로운 가능성을 현실로 여는 것이 인간 고유의 힘입니다.',
    practicalCounsel: '지나간 실패와 낡은 습관의 굴레에서 한 걸음 물러나십시오. 지금 시작하는 작은 결단 하나가 닫혀 있던 흐름에 새로운 문을 엽니다.',
  },
  {
    themeKey: 'vita_activa_action',
    themeTitleEn: 'Action in the Public Realm (공적 영역에서의 담대한 행위)',
    themeTitleKo: '단순한 생존을 넘어 동등한 타자들 앞에 말과 행위로 자신을 드러냄',
    existentialInsight: '인간은 먹고사는 노동이나 물건을 만드는 작업에만 머물 때 온전해지지 않습니다. 타인들과 함께하는 장에서 자신의 생각을 분명히 말하고 행동할 때 자유가 드러납니다.',
    practicalCounsel: '혼자만의 안전지대에 숨지 말고, 관계와 일터 앞에서 솔직한 목소리와 분명한 태도로 자신을 표현하십시오.',
  },
  {
    themeKey: 'thinking_against_banality',
    themeTitleEn: 'Thinking and Conscience against Banality (사유와 악의 평범성 극복)',
    themeTitleKo: '타인의 시선에서 세상을 바라보며 맹목적 추종을 거부하는 주체적 사유',
    existentialInsight: '타인의 입장에서 상상하지 못하는 무사유(Thoughtlessness)를 경계하고, 익숙한 관행이라도 스스로 질문하는 사유가 영혼의 중심을 지킵니다.',
    practicalCounsel: '"다들 그렇게 하니까"라는 말을 잠시 멈추고 의심하십시오. 내 행동이 상대방에게 어떤 울림을 남길지 헤아려 결정하십시오.',
  },
  {
    themeKey: 'plurality_and_solidarity',
    themeTitleEn: 'Human Plurality and Solidarity (인간의 다원성과 공존의 연대)',
    themeTitleKo: '서로 다른 개성과 차이를 인정하며 대등한 대화로 함께 나아감',
    existentialInsight: '지구상에 사는 것은 한 인간이 아니라 서로 다른 수많은 인간들(다원성)입니다. 차이를 지우려 하지 않고 경청할 때 비로소 공존의 힘이 자랍니다.',
    practicalCounsel: '나와 생각이 다른 사람을 고치려 들기보다, 상대의 자리에서 보이는 풍경을 먼저 물어보며 대화의 접점을 찾으십시오.',
  },
  {
    themeKey: 'forgiveness_and_promise',
    themeTitleEn: 'The Power to Forgive and the Binding of Promise (용서와 약속의 지혜)',
    themeTitleKo: '되돌릴 수 없는 과거는 용서로 풀고, 불확실한 미래는 약속으로 다스림',
    existentialInsight: '과거의 매듭을 푸는 열쇠는 용서이며, 예측 불가능한 미래 속에서 신뢰의 닻을 내리는 힘은 스스로 지키는 약속입니다.',
    practicalCounsel: '지나간 원망과 자책을 내려놓아 오늘의 자신을 자유롭게 하십시오. 그리고 앞으로 지킬 수 있는 작은 약속 하나부터 성실히 세우십시오.',
  },
];

export const ARENDT_APHORISMS: ArendtAphorism[] = [
  {
    aphorismKey: 'miracle_of_beginning',
    aphorismKo: '새로운 시작을 이룰 수 있다는 것, 그것이야말로 인간의 탄생성이 지닌 최고의 기적이다.',
    aphorismEn: 'The miracle that saves the world from its normal, "natural" ruin is ultimately the fact of natality.',
    sourceContext: '《인간의 조건(The Human Condition)》 제5장 §33',
    actionGuidance: '상황이 막막해 보여도, 지금 여기서 새로운 첫 문장을 쓸 수 있는 가능성이 남아 있음을 기억하십시오.',
  },
  {
    aphorismKey: 'thinking_train_of_thought',
    aphorismKo: '사유한다는 것은 바람에 흔들리지 않고 스스로 자신과 대화하며 선과 악을 분별하는 일이다.',
    aphorismEn: 'Thinking is the soundless dialogue between me and myself.',
    sourceContext: '《정신의 삶(The Life of the Mind)》 사유 편',
    actionGuidance: '외부의 소음을 잠시 끄고 하루 10분이라도 나 자신과 조용한 대화를 나누며 판단의 기준을 정돈하십시오.',
  },
  {
    aphorismKey: 'plurality_paradox',
    aphorismKo: '인간의 다원성은 모든 행위와 정치의 근본 조건이다. 우리는 모두 같으면서도 모두 저마다 다르다.',
    aphorismEn: 'Plurality is the condition of human action because we are all the same, that is, human, in such a way that nobody is ever the same as anyone else.',
    sourceContext: '《인간의 조건》 제1장 §2',
    actionGuidance: '타인의 다름을 위협이나 틀림으로 보지 말고, 관계를 풍요롭게 하는 고유한 차이로 바라보십시오.',
  },
  {
    aphorismKey: 'forgiveness_remedy',
    aphorismKo: '용서가 없다면 인간은 자신이 저지른 단 한 번의 행위의 영원한 포로가 되고 말 것이다.',
    aphorismEn: 'Without being forgiven, released from the consequences of what we have done, our capacity to act would be confined to one single deed.',
    sourceContext: '《인간의 조건》 제5장 §33',
    actionGuidance: '과거의 실수에 스스로를 가두지 말고, 현재를 다시 시작할 수 있도록 마음을 놓아주십시오.',
  },
];

function classifyArendtTopic(question: string): ArendtQuestionTopic {
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
  return `${y}-${m}-${d} ${hh}:${mm} (+09:00)`;
}

const ARENDT_TOPIC_GUIDANCE: Record<
  ArendtQuestionTopic,
  { practice: string; ritual: string; reflection: string; counsel: string }
> = {
  relationship: {
    practice: '상대의 다름(다원성)을 내 기준으로 재단하지 말고, 대등한 자리에서 진솔한 말과 경청으로 관계를 여십시오.',
    ritual: '상대에게 하고 싶은 말 한 문장을 고치기 전에, 상대의 입장에서 그 문장이 어떻게 들릴지 한 번만 소리 없이 되뇌어 보십시오.',
    reflection: '이 관계에서 내가 지키고 싶은 약속은 무엇이며, 이미 지나간 일 중 놓아주어야 할 매듭은 무엇인가요?',
    counsel: '아렌트의 세계는 혼자 완성되지 않습니다. 서로 다른 두 사람이 용기와 약속으로 건너갈 때 비로소 신뢰가 자리 잡습니다.',
  },
  decision: {
    practice: '관행이나 남들의 기준에 맹목적으로 기대지 말고, 나 자신의 사유와 책임으로 감당할 수 있는 새로운 시작을 선택하십시오.',
    ritual: '지금 고민 중인 선택을 "남들이 기대하는 길"과 "내가 새롭게 시작하고 싶은 길"로 나누어 종이에 적어 보십시오.',
    reflection: '이 결정을 내린 뒤, 나는 그 선택을 내 이름과 말로 당당히 설명할 수 있나요?',
    counsel: '탄생성은 완벽한 보장이 없을 때도 첫 발을 내딛는 용기에서 드러납니다.',
  },
  healing: {
    practice: '지나간 실수나 후회에 스스로를 묶어 두지 말고, 오늘을 다시 시작할 수 있도록 자신에게 먼저 용서를 허락하십시오.',
    ritual: '오늘 하루는 평가나 성과 대신, 몸을 돌보는 단순한 활동과 고요한 호흡으로 내면의 대화를 회복하십시오.',
    reflection: '내가 아직도 놓지 못하고 스스로를 몰아세우고 있는 과거의 한 장면은 무엇인가요?',
    counsel: '과거를 되돌릴 수는 없지만, 그 과거가 오늘의 행동을 영원히 가두지 못하게 하는 힘은 지금 내 안에 있습니다.',
  },
  reflection: {
    practice: '바쁜 노동과 작업의 리듬 속에서 잠시 멈춰, 내가 지금 누구와 어떤 세계를 만들어 가고 있는지 사유해 보십시오.',
    ritual: '하루 중 10분간 외부 정보를 끄고 "나는 요즘 무엇을 새롭게 시작하고 있는가?"를 자신에게 물어보십시오.',
    reflection: '지금 내 일상은 생존의 반복에 머물러 있나요, 아니면 내 뜻을 드러내는 행위로 이어지고 있나요?',
    counsel: '스스로와의 조용한 대화(Thinking)가 살아 있을 때, 일상의 크고 작은 선택도 중심을 잃지 않습니다.',
  },
};

function buildTemporalVitaActivaRhythm(now: Date): ArendtTemporalVitaActivaRhythm {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonalTone =
    month >= 3 && month <= 5
      ? '봄 — 탄생성(Natality)으로 새로운 시작의 첫 문장을 여는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 말과 행위(Action)로 타자들과 공적 연대를 넓히는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 다원성과 약속의 책임을 차분히 매듭짓는 계절'
          : '겨울 — 내면의 소리 없는 대화(Thinking)로 판단력을 벼리는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '오전 탄생성(Natality) 새 출발 창',
      seasonalTone,
      vitaActivaFocus: '탄생성(Natality)',
      natalityClarityIndex: 91,
      rhythmDirective: '어제의 관성을 끊고 새 문장을 시작하기 가장 좋은 오전입니다. 작지만 분명한 첫 행동을 여십시오.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '한낮 공적 행위(Action)·다원성 교류 창',
      seasonalTone,
      vitaActivaFocus: '공적 행위(Action)',
      natalityClarityIndex: 86,
      rhythmDirective: '타인들과 말과 행위로 만나는 낮 시간입니다. 관행 뒤로 숨지 말고 진솔하고 대등하게 소통하십시오.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 용서와 약속(Forgiveness & Promise) 정돈 창',
      seasonalTone,
      vitaActivaFocus: '용서와 약속(Forgiveness & Promise)',
      natalityClarityIndex: 84,
      rhythmDirective: '지나간 일의 자책은 용서로 풀고, 내일을 향한 신뢰의 약속 1가지만 분명히 남기십시오.',
    };
  }
  return {
    kstWindow: '심야 소리 없는 대화(Thinking) 성찰 창',
    seasonalTone,
    vitaActivaFocus: '사유와 대화(Thinking)',
    natalityClarityIndex: 80,
    rhythmDirective: '바깥의 소음이 잦아든 심야입니다. 나 자신과의 조용한 대화 속에서 판단의 기준을 점검하십시오.',
  };
}

export function calculateHannahArendtVitaActiva(
  profile: UserProfile,
  question = '',
  now: Date = new Date()
): HannahArendtVitaActivaResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1990-01-01';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const questionTopic = classifyArendtTopic(question);
  const kstDate = getKstDateKey(now);

  const seedString = `HANNAH-ARENDT-VITA-ACTIVA:${name}:${birthDate}:${birthTime}:${gender}:${kstDate}:${questionTopic}:${question}`;

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const natalityRenewalCapacityScore = 75 + (absHash % 24);
  const vitaActivaBalanceScore = 73 + ((absHash >> 3) % 26);
  const banalityOfEvilOvercomingThinkingScore = 76 + ((absHash >> 6) % 23);
  const publicRealmPluralityIndex = 72 + ((absHash >> 9) % 27);
  const forgivenessAndPromiseFidelityScore = 74 + ((absHash >> 12) % 25);

  const themeIndex = (absHash >> 4) % ARENDT_THEMES.length;
  const aphorismIndex = (absHash >> 7) % ARENDT_APHORISMS.length;

  const activeArendtTheme = ARENDT_THEMES[themeIndex];
  const focalArendtAphorism = ARENDT_APHORISMS[aphorismIndex];
  const topicGuide = ARENDT_TOPIC_GUIDANCE[questionTopic];
  const temporalVitaActivaRhythm = buildTemporalVitaActivaRhythm(now);

  const natalityInitiation = Math.min(99, Math.round((natalityRenewalCapacityScore + vitaActivaBalanceScore) / 2));
  const reflectiveConscience = Math.min(99, Math.round((banalityOfEvilOvercomingThinkingScore + temporalVitaActivaRhythm.natalityClarityIndex) / 2));
  const pluralitySolidarity = Math.min(99, Math.round((publicRealmPluralityIndex + forgivenessAndPromiseFidelityScore) / 2));
  const overallSynthesis = Math.round((natalityInitiation + reflectiveConscience + pluralitySolidarity) / 3);

  const arendtSynthesisMatrix: ArendtSynthesisMatrix = {
    natalityInitiation,
    reflectiveConscience,
    pluralitySolidarity,
    overallSynthesis,
  };

  const practiceGuidance = `${activeArendtTheme.practicalCounsel} ${topicGuide.practice}`;
  const ritualAction = topicGuide.ritual;
  const reflectionFocus = topicGuide.reflection;
  const trimmedQ = question.trim();
  const reflectiveQuestion = trimmedQ
    ? `‘${trimmedQ}’라는 물음 앞에서 관성의 대답을 내려놓고, 내가 지금 여기서 새롭게 시작(탄생성)하고 싶은 첫 행위는 무엇인가요?`
    : reflectionFocus;
  const counselNote = topicGuide.counsel;
  const boundaryNotice = '한나 아렌트의 사유 체계는 인간 실존과 공적 행위의 태도를 성찰하기 위한 철학적 렌즈이며, 현실의 사실 판단이나 미래 예측을 대신하지 않습니다.';

  const guidanceTitle = `한나 아렌트 탄생성과 활동적 삶 지혜: ${activeArendtTheme.themeTitleKo}`;
  const philosophicalCounsel = `한나 아렌트의 정치철학은 무사유의 관성을 경계하며, 새로운 시작(탄생성)과 타인과의 대등한 연대를 일깨웁니다. ` +
    `지금 당신의 질문 맥락에 비추어진 사유 원리는 '${activeArendtTheme.themeTitleKo}'입니다. ` +
    `${practiceGuidance} 원전의 문장 "${focalArendtAphorism.aphorismKo}"을 함께 품고, ${focalArendtAphorism.actionGuidance}`;

  return {
    engineVersion: AMERICAN_GERMAN_HANNAH_ARENDT_VERSION,
    calculatedAtKst: formatKstTimestamp(now),
    questionTopic,
    natalityRenewalCapacityScore,
    vitaActivaBalanceScore,
    banalityOfEvilOvercomingThinkingScore,
    publicRealmPluralityIndex,
    forgivenessAndPromiseFidelityScore,
    activeArendtTheme,
    focalArendtAphorism,
    temporalVitaActivaRhythm,
    arendtSynthesisMatrix,
    practiceGuidance,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    counselNote,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    arendtComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

function describeArendtStage(score: number): string {
  if (score >= 90) return '충만·공적 개시(Initiating)';
  if (score >= 82) return '명료·사유 각성(Awakened)';
  return '성찰·다원 조율(Dialogic)';
}

export function formatHannahArendtVitaActivaPrompt(res: HannahArendtVitaActivaResult): string {
  return [
    `【한나 아렌트 《인간의 조건》 활동적 삶 & 탄생성 지표】`,
    `- 기준 시각: ${res.calculatedAtKst} | 질문 맥락: ${res.questionTopic}`,
    `- 핵심 실존 테마: ${res.activeArendtTheme.themeTitleKo} [${res.activeArendtTheme.themeTitleEn}]`,
    `- 실존적 통찰: ${res.activeArendtTheme.existentialInsight}`,
    `- 실천 조언: ${res.practiceGuidance}`,
    `- 일상 의례: ${res.ritualAction}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 핵심 원전 경구: "${res.focalArendtAphorism.aphorismKo}"`,
    `- 원전 출처: "${res.focalArendtAphorism.aphorismEn}" [${res.focalArendtAphorism.sourceContext}]`,
    `- KST 활동적 삶 리듬: ${res.temporalVitaActivaRhythm.kstWindow} (${res.temporalVitaActivaRhythm.vitaActivaFocus}, 흐름 ${describeArendtStage(res.temporalVitaActivaRhythm.natalityClarityIndex)}) — ${res.temporalVitaActivaRhythm.rhythmDirective}`,
    `- 아렌트 매트릭스: 탄생성 착수(${describeArendtStage(res.arendtSynthesisMatrix.natalityInitiation)}) · 사유 양심(${describeArendtStage(res.arendtSynthesisMatrix.reflectiveConscience)}) · 다원성 연대(${describeArendtStage(res.arendtSynthesisMatrix.pluralitySolidarity)}) — 종합 결(${describeArendtStage(res.arendtSynthesisMatrix.overallSynthesis)})`,
    `- 조언 요약: ${res.counselNote}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
