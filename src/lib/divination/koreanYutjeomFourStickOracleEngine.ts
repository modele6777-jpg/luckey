/**
 * 한국 윷점(四籌占) & 정초 윷놀이 점복 전통 — 도·개·걸·윷·모 다섯 결의 상징 성찰 엔진
 *
 * 한국 세시풍속에서 정월에 윷을 던져 그해의 일을 점치던 '윷점' 전통과, 윷가락 네 개가 만들어 내는
 * 다섯 가지 결(도·개·걸·윷·모)에 담긴 상징을 질문에 비추는 순수 정성 관점 엔진입니다.
 *
 * 원칙:
 * 1. 이 엔진은 실제 윷가락 던지기(추첨)를 대신하지 않습니다. 앱이 기록한 실제 추첨이 아니면 '던졌다'고 말하지 않습니다.
 * 2. 전승마다 해석이 다르므로 특정 판본의 문구를 그대로 인용하지 않고, 전승의 주제만 요약해 상징으로 씁니다.
 * 3. 개인의 길흉·점수·확률·미래 예측을 산출하지 않습니다.
 *
 * @version LUCKEY-KOREAN-YUTJEOM-FOUR-STICKS-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_YUTJEOM_FOUR_STICK_VERSION = 'LUCKEY-KOREAN-YUTJEOM-FOUR-STICKS-v2.2.0';

function getYutKstString(now?: Date): string {
  const base = now ?? new Date();
  const kst = new Date(base.getTime() + 9 * 3600 * 1000);
  return `${kst.toISOString().slice(0, 19)}+09:00`;
}

export type YutQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface YutStanceTheme {
  stanceKey: string;
  stanceNameKo: string;
  stanceNameHanja: string;
  stanceMeaning: string;
  focusAdvice: string;
  practicalCounsel: string;
}

export interface YutStanceAudit {
  stanceNameKo: string;
  traditionNote: string;
  questionMapping: string;
  firstStepAdvice: string;
}

export interface YutTemporalRhythm {
  kstWindow: string;
  seasonTone: string;
  yutFocus: '한 걸음 내딛기(도)' | '짝을 맞추기(개)' | '길을 밀고 나가기(걸)' | '판을 크게 열기(윷)' | '멈추고 거두기(모)';
  stanceClarityStage: string;
  rhythmGuidance: string;
}

export interface KoreanYutjeomFourStickResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: YutQuestionTopic;
  /** 실제 추첨 여부. 이 엔진은 상징 성찰만 하므로 항상 false이며 프롬프트에 그대로 밝힙니다. */
  actualCastRecorded: boolean;
  activeStanceTheme: YutStanceTheme;
  situationalStanceAudit: YutStanceAudit;
  temporalYutRhythm: YutTemporalRhythm;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  yutjeomComprehensiveGuidance: {
    guidanceTitle: string;
    folkCounsel: string;
  };
  yutjeomSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const YUT_STANCE_THEMES: YutStanceTheme[] = [
  {
    stanceKey: 'doSingleStep',
    stanceNameKo: '도 — 홀로 뒤집힌 한 가락',
    stanceNameHanja: '道(도) · 一籌',
    stanceMeaning:
      '네 가락 가운데 하나만 뒤집혀 앞으로 나아가는 결입니다. 크게 벌이지 않고 조용히 첫발을 떼는 자세, 남들이 알아주지 않아도 스스로 정한 방향으로 한 걸음을 옮기는 태도를 상징합니다.',
    focusAdvice: '지금은 판을 키우기보다 가장 작은 첫 단추를 제대로 끼우는 쪽이 유리한 자리입니다. 눈에 띄지 않는 준비가 뒤의 큰 걸음을 떠받칩니다.',
    practicalCounsel: '오늘 안에 끝낼 수 있는 가장 작은 한 걸음을 정하고, 다른 사람의 반응을 확인하기 전에 먼저 시작해 보세요.',
  },
  {
    stanceKey: 'gaePairing',
    stanceNameKo: '개 — 나란히 뒤집힌 두 가락',
    stanceNameHanja: '介(개) · 二籌',
    stanceMeaning:
      '두 가락이 함께 뒤집혀 짝을 이루는 결입니다. 혼자 밀어붙이기보다 상대의 속도에 맞추어 나란히 걷는 협력의 자세, 주고받음의 균형을 상징합니다.',
    focusAdvice: '이번 일은 내 뜻만으로 완성되지 않습니다. 상대가 무엇을 감당할 수 있는지 먼저 확인하고 조건을 함께 맞추는 편이 길합니다.',
    practicalCounsel: '미뤄 둔 연락 한 건을 오늘 보내되, 요구보다 상대의 형편을 묻는 문장으로 시작해 보세요.',
  },
  {
    stanceKey: 'geolAdvance',
    stanceNameKo: '걸 — 세 가락이 앞으로',
    stanceNameHanja: '傑(걸) · 三籌',
    stanceMeaning:
      '세 가락이 뒤집혀 힘이 한쪽으로 모이는 결입니다. 미뤄 둔 일을 실제로 밀고 나가고, 말로만 그치지 않고 손으로 옮기는 추진의 자세를 상징합니다.',
    focusAdvice: '생각을 더 정리하기보다 지금 손에 잡히는 순서대로 처리해 나가세요. 진행 자체가 막힌 곳을 드러내 줍니다.',
    practicalCounsel: '해야 할 일을 종이에 적어 순서를 매기고, 가장 앞의 하나를 오늘 안에 끝까지 마무리해 보세요.',
  },
  {
    stanceKey: 'yutOpening',
    stanceNameKo: '윷 — 네 가락이 모두 열린 결',
    stanceNameHanja: '杻(윷) · 四籌',
    stanceMeaning:
      '네 가락이 모두 뒤집혀 판이 크게 열리는 결입니다. 오래 닫혀 있던 이야기가 다시 움직이고, 사람과 기회가 넓게 트이는 자세를 상징합니다. 다만 크게 열린 만큼 거둘 때의 기준도 함께 세워야 합니다.',
    focusAdvice: '막혀 있던 일을 다시 꺼내 보기 좋은 때입니다. 다만 한 번에 다 받아들이지 말고, 감당할 범위를 먼저 정해 두세요.',
    practicalCounsel: '지난달에 접어 두었던 제안이나 대화 하나를 다시 열어 보고, 내가 지킬 조건 한 가지를 함께 적어 두세요.',
  },
  {
    stanceKey: 'moGathering',
    stanceNameKo: '모 — 다섯이 모여 엎어진 결',
    stanceMeaning:
      '윷가락이 모두 엎어져 큰 결과로 모이는 결입니다. 한 판을 마무리하고 거두는 자세, 벌인 일을 정리해 다음 판의 밑천으로 바꾸는 태도를 상징합니다. 전승에서는 크게 얻는 자리이면서 동시에 잃을 것을 헤아리라는 뜻으로도 읽힙니다.',
    stanceNameHanja: '牟(모) · 五籌',
    focusAdvice: '새로 벌이기보다 이미 벌인 일을 매듭지을 때입니다. 끝맺음이 분명해야 다음 자리가 열립니다.',
    practicalCounsel: '지금 진행 중인 일 가운데 더 붙잡지 않아도 되는 것 하나를 정해 오늘 안에 마무리하거나 정리해 두세요.',
  },
];

function classifyYutQuestionTopic(query?: string): YutQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/관계|사람|연인|연애|가족|친구|동료|갈등|다툼|다투|싸우|화해|서운|만남|이별/.test(q)) return 'relationship';
  if (/결정|선택|이직|창업|시작|지원|계약|돈|재물|일|커리어|진로/.test(q)) return 'decision';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|지친|슬픔/.test(q)) return 'healing';
  return 'reflection';
}

function buildYutStanceAudit(query: string, topic: YutQuestionTopic, absHash: number): YutStanceAudit {
  const q = query.trim();
  if (topic === 'relationship' || /관계|사람|연애|가족|갈등|화해/.test(q)) {
    return {
      stanceNameKo: '개(二籌) — 짝을 맞추는 자리',
      traditionNote: '윷점 전승에서는 가락이 짝을 이루는 모양을 사람 사이의 주고받음에 비추어 읽는 해석이 전해집니다.',
      questionMapping: '관계의 문제는 한쪽의 결단만으로 풀리지 않습니다. 지금 필요한 것은 상대를 설득하는 말보다 서로의 속도를 맞추는 조율입니다.',
      firstStepAdvice: '상대에게 바라는 것을 한 문장으로 적고, 그 문장을 요구가 아닌 부탁의 형태로 바꾸어 전해 보세요.',
    };
  }
  if (topic === 'decision') {
    return {
      stanceNameKo: '걸(三籌) — 길을 밀고 나가는 자리',
      traditionNote: '윷점 전승에서는 가락이 한 방향으로 모이는 모양을 일이 진행되는 힘에 비추어 읽는 해석이 전해집니다.',
      questionMapping: '지금은 더 많은 정보를 모으기보다 이미 아는 것을 실행으로 옮기는 쪽이 남는 자리입니다. 미룬 하루가 선택의 폭을 줄입니다.',
      firstStepAdvice: '선택지를 둘로 줄이고, 오늘 안에 되돌릴 수 있는 작은 시험을 하나 실행해 보세요.',
    };
  }
  if (topic === 'healing') {
    return {
      stanceNameKo: '도(一籌) — 조용히 첫발을 떼는 자리',
      traditionNote: '윷점 전승에서는 홀로 뒤집힌 한 가락을 적은 움직임과 회복의 시작으로 읽는 해석이 전해집니다.',
      questionMapping: '회복은 크게 뒤집히기보다 아주 작은 생활의 변화에서 시작됩니다. 오늘의 한 걸음이 다음 주의 컨디션을 만듭니다.',
      firstStepAdvice: '잠들기 전 화면을 조금 일찍 놓고, 몸을 가볍게 움직이는 짧은 시간을 오늘 안에 만들어 보세요.',
    };
  }
  const fallbackStances = ['도(一籌)', '개(二籌)', '걸(三籌)', '윷(四籌)', '모(五籌)'];
  return {
    stanceNameKo: `${fallbackStances[absHash % fallbackStances.length]} — 오늘의 결을 비추는 자리`,
    traditionNote: '윷점 전승은 한 해의 일을 다섯 결에 나누어 살피는 민속 해석으로 전해지며, 판본마다 표현이 조금씩 다릅니다.',
    questionMapping: '질문을 곧바로 결론으로 몰아가기보다, 지금 내가 어느 결에 서 있는지 먼저 살펴보는 것이 이 관점의 쓰임입니다.',
    firstStepAdvice: '오늘 하루 중 스스로 납득한 선택 하나와 그렇지 않은 선택 하나를 적어 보고 차이를 확인해 보세요.',
  };
}

function buildYutTemporalRhythm(now?: Date): YutTemporalRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonTone =
    month >= 1 && month <= 2
      ? '정초 — 한 해의 판을 처음 여는 때, 윷점이 전해지는 계절'
      : month >= 3 && month <= 5
        ? '봄 — 겨울에 세운 계획을 실제로 옮기는 계절'
        : month >= 6 && month <= 8
          ? '여름 — 벌인 일이 한창 무르익는 계절'
          : month >= 9 && month <= 11
            ? '가을 — 거둘 것을 가려 정리하는 계절'
            : '겨울 — 판을 접고 다음 판을 준비하는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '아침 — 판을 새로 펴는 시간',
      seasonTone,
      yutFocus: '한 걸음 내딛기(도)',
      stanceClarityStage: '방향이 막 잡히는 결',
      rhythmGuidance: '하루의 기준을 세우기 좋은 아침입니다. 오늘 꼭 지킬 한 가지를 정하고 그것만 먼저 처리해 보세요.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '낮 — 가락을 주고받는 시간',
      seasonTone,
      yutFocus: '짝을 맞추기(개)',
      stanceClarityStage: '사람과 일이 맞물리는 결',
      rhythmGuidance: '약속과 조율이 몰리는 낮입니다. 답을 미루기보다 지금 정할 수 있는 것부터 정하고 넘기세요.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 — 판을 거두는 시간',
      seasonTone,
      yutFocus: '멈추고 거두기(모)',
      stanceClarityStage: '매듭이 필요한 결',
      rhythmGuidance: '하루의 일을 마무리하기 좋은 저녁입니다. 미완으로 남긴 일 하나를 정리하고 손을 떼 보세요.',
    };
  }
  return {
    kstWindow: '밤 — 가락을 내려놓는 시간',
    seasonTone,
    yutFocus: '길을 밀고 나가기(걸)',
    stanceClarityStage: '마음이 조용히 정리되는 결',
    rhythmGuidance: '결정을 미루고 쉬어도 되는 밤입니다. 다만 잠들기 전 내일의 첫 동작 하나만 정해 두면 아침이 가벼워집니다.',
  };
}

function buildYutTopicExtras(topic: YutQuestionTopic): { dailyPracticeRitual: string; reflectiveQuestion: string } {
  switch (topic) {
    case 'relationship':
      return {
        dailyPracticeRitual: '오늘 고마웠던 사람 하나를 떠올려 짧은 인사 한 줄을 직접 건네 보기.',
        reflectiveQuestion: '이 관계에서 내가 맞추고 싶은 속도는 상대의 속도와 얼마나 다른가요?',
      };
    case 'decision':
      return {
        dailyPracticeRitual: '미뤄 둔 결정 하나를 골라 오늘 안에 되돌릴 수 있는 가장 작은 시험으로 옮겨 보기.',
        reflectiveQuestion: '더 알아야 결정할 수 있는 것과, 이미 충분히 알고도 미루고 있는 것은 무엇인가요?',
      };
    case 'healing':
      return {
        dailyPracticeRitual: '잠들기 전 불을 조금 일찍 끄고, 몸의 긴장을 풀어 주는 조용한 시간을 잠깐 가지기.',
        reflectiveQuestion: '오늘 나를 지치게 한 일은 무엇이고, 내일은 그 일을 어떻게 조금 줄일 수 있을까요?',
      };
    default:
      return {
        dailyPracticeRitual: '오늘 스스로 납득한 선택 하나를 짧게 기록해 두기.',
        reflectiveQuestion: '지금 내가 서 있는 결은 무엇이고, 그 결에서 다음 걸음은 어느 쪽인가요?',
      };
  }
}

function hashYutSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateKoreanYutjeomFourStickOracle(
  profile?: UserProfile,
  question?: string,
  now: Date = new Date(),
): KoreanYutjeomFourStickResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const topic = classifyYutQuestionTopic(question);

  const seedString = `KOREAN-YUTJEOM-FOUR-STICKS:${name}:${birthDate}:${birthTime}:${gender}:${topic}:${(question ?? '').trim()}`;
  const absHash = hashYutSeed(seedString);

  const activeStanceTheme = YUT_STANCE_THEMES[absHash % YUT_STANCE_THEMES.length];
  const situationalStanceAudit = buildYutStanceAudit(question ?? '', topic, absHash);
  const temporalYutRhythm = buildYutTemporalRhythm(now);
  const extras = buildYutTopicExtras(topic);

  const interpretiveBoundary =
    '한국 윷점의 상징은 전승마다 해석이 갈리는 민속 자료이므로 미래를 단정하거나 길흉·확률을 계산하는 근거로 쓰지 않습니다. 이 관점은 실제 윷 던지기를 대신하지 않으며, 앱이 기록한 실제 추첨 없이 던졌다고 말하지 않습니다.';

  const trimmedQ = (question ?? '').trim();
  const yutjeomSynthesisMatrix = {
    dominantTension: `${activeStanceTheme.stanceNameKo} ↔ ${situationalStanceAudit.stanceNameKo}`,
    alignmentState: `${temporalYutRhythm.yutFocus} · ${temporalYutRhythm.stanceClarityStage}`,
    integratedAction: `${situationalStanceAudit.firstStepAdvice}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: KOREAN_YUTJEOM_FOUR_STICK_VERSION,
    calculatedAtKst: getYutKstString(now),
    questionTopic: topic,
    actualCastRecorded: false,
    activeStanceTheme,
    situationalStanceAudit,
    temporalYutRhythm,
    dailyPracticeRitual: extras.dailyPracticeRitual,
    reflectiveQuestion: extras.reflectiveQuestion,
    interpretiveBoundary,
    yutjeomComprehensiveGuidance: {
      guidanceTitle: `한국 윷점의 다섯 결: ${activeStanceTheme.stanceNameKo}`,
      folkCounsel:
        `정월에 윷을 던져 그해의 일을 살피던 한국의 윷점은 네 가락이 만드는 다섯 결에 삶의 자리를 겹쳐 보는 민속입니다. ` +
        `이번 질문에 비추어 볼 때 가장 눈에 들어오는 결은 '${activeStanceTheme.stanceNameKo}'입니다. ` +
        `${activeStanceTheme.focusAdvice} 그리고 ${situationalStanceAudit.questionMapping} ` +
        `오늘의 리듬은 ${temporalYutRhythm.kstWindow}의 결이므로, ${temporalYutRhythm.rhythmGuidance}`,
    },
    yutjeomSynthesisMatrix,
  };
}

export function formatKoreanYutjeomFourStickPrompt(res: KoreanYutjeomFourStickResult): string {
  const matrixLine = res.yutjeomSynthesisMatrix
    ? `- 윷점 교차 매트릭스: 핵심 긴장(${res.yutjeomSynthesisMatrix.dominantTension}) · 조율 상태(${res.yutjeomSynthesisMatrix.alignmentState}) · 통합 실천(${res.yutjeomSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【한국 윷점(四籌占) 다섯 결 성찰 지표 (${res.engineVersion} | ${res.calculatedAtKst})】`,
    `- 실제 윷 추첨 기록: 이 엔진은 던지기를 대신하지 않음(앱 기록 없음)`,
    `- 질문 맥락 초점: ${res.questionTopic}`,
    `- 오늘 비추는 결: ${res.activeStanceTheme.stanceNameKo} [${res.activeStanceTheme.stanceNameHanja}]`,
    `- 결의 뜻: ${res.activeStanceTheme.stanceMeaning}`,
    `- 자리 조언: ${res.activeStanceTheme.focusAdvice}`,
    `- 질문 맥락 점검(${res.situationalStanceAudit.stanceNameKo}): ${res.situationalStanceAudit.questionMapping}`,
    `- 전승 읽기: ${res.situationalStanceAudit.traditionNote}`,
    `- 첫걸음: ${res.situationalStanceAudit.firstStepAdvice}`,
    `- KST 시공간 리듬: ${res.temporalYutRhythm.kstWindow} (${res.temporalYutRhythm.seasonTone}, ${res.temporalYutRhythm.stanceClarityStage}) — ${res.temporalYutRhythm.rhythmGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 종합 권면: ${res.yutjeomComprehensiveGuidance.folkCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
