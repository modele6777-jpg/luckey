/**
 * 타밀 티루쿠랄(Thirukkural) — 아람(Aram)·포룰(Porul)·카맘(Kamam) 삼편의 덕·재물·사랑 성찰 엔진
 *
 * 남인도 타밀 고전 《티루쿠랄》은 발라르(Thiruvalluvar)의 이름으로 전해지는 133개 장(章)의 짧은 커플릿 모음입니다.
 * 제1편 아람(அறம், 덕과 의로움) · 제2편 포룰(பொருள், 재물과 다스림) · 제3편 카맘(காமம், 사랑)의 세 편으로 이루어져 있습니다.
 *
 * 원칙:
 * 1. 커플릿의 번역은 역본마다 표현이 크게 다르므로, 특정 문장을 옮겨 인용하지 않고 주제만 요약합니다.
 * 2. 개인의 길흉·점수·확률·미래 예측을 산출하지 않습니다.
 * 3. 덕과 사랑을 이유로 자기희생이나 무조건적 복종을 권하지 않습니다. 동의·안전·법적 경계를 존중합니다.
 *
 * @version LUCKEY-TAMIL-THIRUKKURAL-ARAM-PORUL-KAMAM-v2.4.0
 */

import type { UserProfile } from '../sharedState';

export const TAMIL_THIRUKKURAL_ARAM_PORUL_KAMAM_VERSION = 'LUCKEY-TAMIL-THIRUKKURAL-ARAM-PORUL-KAMAM-v2.4.0';

export type ThirukkuralQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface ThirukkuralTheme {
  themeKey: string;
  bookNameKo: string;
  bookNameTamil: string;
  chapterReference: string;
  thematicInsight: string;
  focusAdvice: string;
  practicalCounsel: string;
}

export interface ThirukkuralSituationalAudit {
  bookFocusKo: string;
  chapterReference: string;
  readingNote: string;
  questionMapping: string;
  firstStepAdvice: string;
}

export interface ThirukkuralTemporalRhythm {
  kstWindow: string;
  seasonTone: string;
  virtueFocus: '덕을 세우는 아람' | '일과 재물을 다루는 포룰' | '사랑과 마음을 살피는 카맘' | '세 편을 함께 거두는 결';
  rhythmStage: string;
  rhythmGuidance: string;
}

export interface TamilThirukkuralAramPorulKamamResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: ThirukkuralQuestionTopic;
  activeThirukkuralTheme: ThirukkuralTheme;
  situationalThirukkuralAudit: ThirukkuralSituationalAudit;
  temporalThirukkuralRhythm: ThirukkuralTemporalRhythm;
  dailyPracticeRitual: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  thirukkuralComprehensiveGuidance: {
    guidanceTitle: string;
    classicalCounsel: string;
  };
  thirukkuralSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

export const THIRUKKURAL_THEMES: ThirukkuralTheme[] = [
  {
    themeKey: 'anbuLove',
    bookNameKo: '아람 — 덕과 의로움의 편',
    bookNameTamil: 'அறத்துப்பால் (Arathuppal)',
    chapterReference: '아람편 · 애정(அன்புடைமை, Anbudaimai) 장',
    thematicInsight:
      '티루쿠랄은 사랑(Anbu)을 덕의 뿌리로 놓습니다. 애정은 감정의 과시가 아니라 상대의 처지를 헤아려 자기 몫을 먼저 내어놓는 태도로 설명됩니다. 이 편은 사랑이 관계의 장식이 아니라 삶을 지탱하는 기초라고 말합니다.',
    focusAdvice: '지금 필요한 것은 마음을 증명하는 말보다 상대가 실제로 필요로 하는 것을 하나 알아보고 채워 주는 일입니다.',
    practicalCounsel: '가까운 사람에게 지금 가장 번거로운 일이 무엇인지 물어보고, 내가 감당할 수 있는 범위에서 하나를 맡아 보세요.',
  },
  {
    themeKey: 'poraiPatience',
    bookNameKo: '아람 — 덕과 의로움의 편',
    bookNameTamil: 'அறத்துப்பால் (Arathuppal)',
    chapterReference: '아람편 · 인내(பொறையுடைமை, Poraiyudaimai) 장과 자제(அடக்கறவரைதல், Adakkaravaraithal) 장',
    thematicInsight:
      '티루쿠랄의 아람편은 참는 힘과 말을 다스리는 힘을 함께 다룹니다. 감정이 올라온 순간의 한마디가 오래 남는 관계의 손상을 만든다고 보며, 스스로를 누르는 절제를 가장 값진 힘으로 평가합니다.',
    focusAdvice: '지금은 즉시 반응하지 않는 것이 가장 강한 대응입니다. 답장과 말을 하루 미루어도 늦지 않습니다.',
    practicalCounsel: '답을 보내고 싶은 마음이 들 때 먼저 초안만 적어 두고, 한 번 쉬었다가 다시 읽고 보내 보세요.',
  },
  {
    themeKey: 'muyarchiEffort',
    bookNameKo: '포룰 — 재물과 다스림의 편',
    bookNameTamil: 'பொருட்பால் (Porutpal)',
    chapterReference: '포룰편 · 노력(முயற்சி, Muyarchi) 장과 배움(கல்வி, Kalvi) 장',
    thematicInsight:
      '티루쿠랄의 포룰편은 운을 기다리는 사람보다 준비하고 시도하는 사람을 앞세웁니다. 재물과 성취는 요행이 아니라 배움과 꾸준한 시도가 쌓인 결과로 설명되며, 그 과정에서 지혜롭게 사람을 가리는 안목 또한 강조됩니다.',
    focusAdvice: '지금은 조건이 완벽해지기를 기다리기보다, 가진 것으로 시작해 결과를 확인하며 고쳐 가는 쪽이 남습니다.',
    practicalCounsel: '오늘 안에 확인할 수 있는 가장 작은 시도를 하나 정해 실행하고, 결과를 한 줄로 기록해 두세요.',
  },
  {
    themeKey: 'natpuFriendship',
    bookNameKo: '포룰 — 재물과 다스림의 편',
    bookNameTamil: 'பொருட்பால் (Porutpal)',
    chapterReference: '포룰편 · 우정(நட்பு, Natpu) 장',
    thematicInsight:
      '티루쿠랄은 좋은 벗을 재물보다 귀한 자산으로 다룹니다. 함께 있을 때 마음이 편하고 어려울 때 먼저 손을 내미는 사람을 참된 벗으로 설명하며, 사람을 가리는 일이 곧 삶의 안전을 지키는 일이라고 봅니다.',
    focusAdvice: '지금은 새로운 인연을 넓히기보다 이미 내 곁에 있는 사람 가운데 믿을 만한 이를 다시 확인하는 편이 낫습니다.',
    practicalCounsel: '최근에 도움을 받은 사람 하나에게 고마움을 전하고, 반대로 계속 나를 지치게 하는 관계는 경계를 정해 보세요.',
  },
  {
    themeKey: 'kamamLonging',
    bookNameKo: '카맘 — 사랑의 편',
    bookNameTamil: 'காமத்துப்பால் (Kamathuppal)',
    chapterReference: '카맘편(காமத்துப்பால்) · 그리움과 만남의 장들',
    thematicInsight:
      '티루쿠랄의 카맘편은 사랑의 기다림과 그리움, 다시 만나는 기쁨을 담담하게 그립니다. 이 편은 사랑을 소유가 아니라 서로의 마음을 오래 지키는 일로 설명하며, 기다림에도 품위가 있어야 한다고 말합니다.',
    focusAdvice: '마음이 앞서는 때일수록 상대의 형편과 의사를 확인하는 순서를 지키세요. 서두른 확신은 관계를 흔듭니다.',
    practicalCounsel: '연락을 기다리는 대신, 오늘 내 시간을 채울 일 하나를 정해 두고 상대의 답은 그 뒤에 확인해 보세요.',
  },
];

function classifyThirukkuralTopic(query?: string): ThirukkuralQuestionTopic {
  const q = (query ?? '').toLowerCase();
  if (/관계|사랑|연인|연애|가족|친구|동료|갈등|다툼|다투|다툐|싸우|싸웠|화해|그리움|이별|만남/.test(q)) return 'relationship';
  if (/결정|선택|이직|창업|시작|계약|돈|재물|일|커리어|진로|시험/.test(q)) return 'decision';
  if (/불안|지침|우울|회복|휴식|건강|수면|힘들|지친|슬픔|분노/.test(q)) return 'healing';
  return 'reflection';
}

function buildThirukkuralAudit(query: string, topic: ThirukkuralQuestionTopic): ThirukkuralSituationalAudit {
  const q = query.trim();
  if (topic === 'relationship') {
    return {
      bookFocusKo: '카맘(사랑)과 아람(애정)의 사이',
      chapterReference: '카맘편(காமத்துப்பால்)과 아람편 애정(Anbudaimai) 장',
      readingNote: '카맘편은 그리움과 만남을, 아람편은 애정의 기초를 다룹니다. 두 편을 함께 읽으면 감정과 책임을 나누어 볼 수 있습니다.',
      questionMapping: '지금의 관계 문제는 감정의 크기보다 주고받는 순서에서 생깁니다. 누가 먼저 손을 내미는지가 아니라, 서로가 감당할 수 있는 몫을 확인하는 것이 먼저입니다.',
      firstStepAdvice: '상대에게 서운했던 장면을 하나 떠올려, 그때 내가 원했던 것을 요구가 아닌 설명으로 바꾸어 전해 보세요.',
    };
  }
  if (topic === 'decision') {
    return {
      bookFocusKo: '포룰(재물과 다스림)의 편',
      chapterReference: '포룰편 노력(முயற்சி) 장과 배움(கல்வி) 장',
      readingNote: '포룰편은 성취를 요행이 아닌 준비와 시도의 결과로 설명합니다. 결정을 미루는 동안에도 조건은 계속 바뀝니다.',
      questionMapping: '지금 필요한 것은 확신이 아니라 확인 가능한 한 걸음입니다. 작게 시도하고 결과를 보며 방향을 다듬는 편이 손해가 적습니다.',
      firstStepAdvice: '선택지마다 되돌릴 수 있는 범위를 적어 보고, 되돌릴 수 있는 쪽부터 오늘 실행해 보세요.',
    };
  }
  if (topic === 'healing') {
    return {
      bookFocusKo: '아람(덕과 의로움)의 편',
      chapterReference: '아람편 인내(பொறையுடைமை) 장과 자제(அடக்கறவரைதல்) 장',
      readingNote: '아람편은 참는 힘과 말을 다스리는 힘을 함께 권합니다. 회복은 감정을 없애는 일이 아니라 다루는 법을 배우는 일입니다.',
      questionMapping: '지금은 스스로를 몰아붙이는 방식이 오히려 회복을 늦추는 자리입니다. 잠시 멈추는 선택도 덕의 일부입니다.',
      firstStepAdvice: '오늘 하루 중 아무것도 하지 않아도 되는 시간을 정하고, 그 시간에는 스스로를 다그치지 않기로 해 보세요.',
    };
  }
  return {
    bookFocusKo: '아람·포룰·카맘 세 편의 균형',
    chapterReference: '아람편(அறத்துப்பால்) · 포룰편(பொருட்பால்) · 카맘편(காமத்துப்பால்)',
    readingNote: '티루쿠랄은 덕과 재물과 사랑을 따로 다루지 않고 한 삶의 세 축으로 놓습니다. 어느 하나만 앞서면 다른 축이 흔들립니다.',
    questionMapping: '질문을 결론으로 좁히기보다, 지금 내 삶에서 어느 축이 비어 있는지 먼저 살펴보는 것이 이 관점의 쓰임입니다.',
    firstStepAdvice: '덕·일·사랑 가운데 요즘 가장 소홀한 축 하나를 정하고, 그 축에 오늘 쓸 수 있는 짧은 시간을 정해 보세요.',
  };
}

function buildThirukkuralRhythm(now?: Date): ThirukkuralTemporalRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const seasonTone =
    month >= 3 && month <= 5
      ? '봄 — 덕을 새로 세우고 관계를 다시 잇는 계절'
      : month >= 6 && month <= 8
        ? '여름 — 일과 재물이 한창 무르익는 계절'
        : month >= 9 && month <= 11
          ? '가을 — 거둔 것을 나누고 사람을 가리는 계절'
          : '겨울 — 세 축을 조용히 되짚는 계절';

  if (hour >= 5 && hour < 11) {
    return {
      kstWindow: '아침 — 덕을 세우는 시간',
      seasonTone,
      virtueFocus: '덕을 세우는 아람',
      rhythmStage: '마음의 기준이 맑게 서는 결',
      rhythmGuidance: '아침에는 오늘 지킬 태도 하나를 먼저 정해 두세요. 그 기준이 하루의 말과 선택을 가볍게 만듭니다.',
    };
  }
  if (hour >= 11 && hour < 17) {
    return {
      kstWindow: '낮 — 일과 재물을 다루는 시간',
      seasonTone,
      virtueFocus: '일과 재물을 다루는 포룰',
      rhythmStage: '일이 실제로 굴러가는 결',
      rhythmGuidance: '낮에는 벌인 일의 순서를 정리하고, 오늘 끝낼 하나를 골라 마무리하세요.',
    };
  }
  if (hour >= 17 && hour < 22) {
    return {
      kstWindow: '저녁 — 사랑과 마음을 살피는 시간',
      seasonTone,
      virtueFocus: '사랑과 마음을 살피는 카맘',
      rhythmStage: '마음이 드러나는 결',
      rhythmGuidance: '저녁에는 가까운 사람과의 대화를 서두르지 말고 천천히 이어 가세요. 짧은 안부가 오래 남습니다.',
    };
  }
  return {
    kstWindow: '밤 — 세 편을 함께 거두는 시간',
    seasonTone,
    virtueFocus: '세 편을 함께 거두는 결',
    rhythmStage: '하루가 조용히 정리되는 결',
    rhythmGuidance: '밤에는 오늘의 말과 선택을 평가하지 말고 그저 적어 두세요. 판단은 내일의 몫으로 남겨도 됩니다.',
  };
}

function buildThirukkuralTopicExtras(topic: ThirukkuralQuestionTopic): { dailyPracticeRitual: string; reflectiveQuestion: string } {
  switch (topic) {
    case 'relationship':
      return {
        dailyPracticeRitual: '오늘 가까운 사람의 형편을 먼저 묻는 짧은 연락 한 번 보내기.',
        reflectiveQuestion: '이 관계에서 내가 먼저 내어놓을 수 있는 몫은 무엇이고, 내가 지켜야 할 경계는 무엇인가요?',
      };
    case 'decision':
      return {
        dailyPracticeRitual: '미뤄 둔 선택 하나를 오늘 확인 가능한 작은 시도로 옮겨 보기.',
        reflectiveQuestion: '내가 기다리는 조건은 정말 필요한가요, 아니면 결정을 미루는 핑계인가요?',
      };
    case 'healing':
      return {
        dailyPracticeRitual: '오늘 스스로를 다그치지 않는 시간을 정해 조용히 쉬어 보기.',
        reflectiveQuestion: '지금 나를 힘들게 하는 감정을 없애려 하기보다, 그 감정이 알려 주는 필요는 무엇인가요?',
      };
    default:
      return {
        dailyPracticeRitual: '덕·일·사랑 가운데 오늘 가장 소홀했던 축에 짧은 시간을 내어 주기.',
        reflectiveQuestion: '지금 내 삶에서 가장 비어 있는 축은 무엇이고, 그 축에 오늘 무엇을 더할 수 있나요?',
      };
  }
}

function hashThirukkuralSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateTamilThirukkuralAramPorulKamam(
  profile?: UserProfile,
  question?: string,
  now: Date = new Date(),
): TamilThirukkuralAramPorulKamamResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '방문자';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';
  const topic = classifyThirukkuralTopic(question);

  const seedString = `TAMIL-THIRUKKURAL-ARAM-PORUL-KAMAM:${name}:${birthDate}:${birthTime}:${gender}:${topic}:${(question ?? '').trim()}`;
  const absHash = hashThirukkuralSeed(seedString);

  const activeThirukkuralTheme = THIRUKKURAL_THEMES[absHash % THIRUKKURAL_THEMES.length];
  const situationalThirukkuralAudit = buildThirukkuralAudit(question ?? '', topic);
  const temporalThirukkuralRhythm = buildThirukkuralRhythm(now);
  const extras = buildThirukkuralTopicExtras(topic);

  const interpretiveBoundary =
    '타밀 티루쿠랄 관점은 덕·재물·사랑의 균형을 비추는 상징적 성찰 렌즈입니다. 역본마다 문장 표현이 달라 원문을 그대로 옮기지 않으며, 개인의 길흉과 미래를 단정하지 않습니다. 덕과 사랑을 이유로 자기희생이나 무조건적 복종을 권하지 않고, 동의·안전·법적 경계를 존중합니다.';

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const calculatedAtKst = `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
  const trimmedQ = (question ?? '').trim();
  const ritualAction = `[${activeThirukkuralTheme.chapterReference}] ${extras.dailyPracticeRitual}`;
  const reflectionFocus = `타밀 티루쿠랄(${activeThirukkuralTheme.bookNameKo}) — ${situationalThirukkuralAudit.bookFocusKo}`;
  const thirukkuralSynthesisMatrix = {
    dominantTension: `${situationalThirukkuralAudit.bookFocusKo} ↔ ${activeThirukkuralTheme.chapterReference}`,
    alignmentState: `${temporalThirukkuralRhythm.kstWindow} · ${temporalThirukkuralRhythm.virtueFocus}`,
    integratedAction: `${situationalThirukkuralAudit.firstStepAdvice}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: TAMIL_THIRUKKURAL_ARAM_PORUL_KAMAM_VERSION,
    calculatedAtKst,
    questionTopic: topic,
    activeThirukkuralTheme,
    situationalThirukkuralAudit,
    temporalThirukkuralRhythm,
    dailyPracticeRitual: extras.dailyPracticeRitual,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion: extras.reflectiveQuestion,
    interpretiveBoundary,
    thirukkuralComprehensiveGuidance: {
      guidanceTitle: `티루쿠랄 세 편의 지혜: ${activeThirukkuralTheme.chapterReference}`,
      classicalCounsel:
        `남인도 타밀 고전 《티루쿠랄》은 덕(아람)과 재물(포룰)과 사랑(카맘)을 한 삶의 세 축으로 놓고, 어느 하나만 앞서면 삶이 기울어진다고 봅니다. ` +
        `이번 질문에 가장 가까운 축은 '${activeThirukkuralTheme.chapterReference}'입니다. ` +
        `${activeThirukkuralTheme.focusAdvice} 그리고 ${situationalThirukkuralAudit.questionMapping} ` +
        `지금의 리듬은 ${temporalThirukkuralRhythm.kstWindow}의 결이므로, ${temporalThirukkuralRhythm.rhythmGuidance}`,
    },
    thirukkuralSynthesisMatrix,
  };
}

export function formatTamilThirukkuralAramPorulKamamPrompt(res: TamilThirukkuralAramPorulKamamResult): string {
  const matrixLine = res.thirukkuralSynthesisMatrix
    ? `- 티루쿠랄 교차 매트릭스: 핵심 긴장(${res.thirukkuralSynthesisMatrix.dominantTension}) · 조율 상태(${res.thirukkuralSynthesisMatrix.alignmentState}) · 통합 실천(${res.thirukkuralSynthesisMatrix.integratedAction})`
    : '';
  return [
    `【타밀 《티루쿠랄》 아람·포룰·카맘 삼편 성찰 지표 (${res.engineVersion})】`,
    `- 기준 시각(KST): ${res.calculatedAtKst} | 질문 맥락 초점: ${res.questionTopic}`,
    `- 오늘 비추는 편과 장: ${res.activeThirukkuralTheme.bookNameKo} · ${res.activeThirukkuralTheme.chapterReference}`,
    `- 타밀 원표기: ${res.activeThirukkuralTheme.bookNameTamil}`,
    `- 편의 주제: ${res.activeThirukkuralTheme.thematicInsight}`,
    `- 자리 조언: ${res.activeThirukkuralTheme.focusAdvice}`,
    `- 질문 맥락 점검(${res.situationalThirukkuralAudit.bookFocusKo}): ${res.situationalThirukkuralAudit.questionMapping}`,
    `- 읽기 안내: ${res.situationalThirukkuralAudit.readingNote}`,
    `- 첫걸음: ${res.situationalThirukkuralAudit.firstStepAdvice}`,
    `- KST 시공간 리듬: ${res.temporalThirukkuralRhythm.kstWindow} (${res.temporalThirukkuralRhythm.seasonTone}, ${res.temporalThirukkuralRhythm.rhythmStage}, ${res.temporalThirukkuralRhythm.virtueFocus}) — ${res.temporalThirukkuralRhythm.rhythmGuidance}`,
    `- 오늘의 실천 의례: ${res.dailyPracticeRitual}`,
    `- 실천 의례: ${res.ritualAction}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 종합 권면: ${res.thirukkuralComprehensiveGuidance.classicalCounsel}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    matrixLine,
  ].filter(Boolean).join('\n');
}
