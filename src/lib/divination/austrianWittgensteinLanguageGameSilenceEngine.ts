/**
 * 오스트리아/영국 루트비히 비트겐슈타인(Ludwig Wittgenstein) 《논리철학논고(Tractatus Logico-Philosophicus)》 & 《철학적 탐구(Philosophische Untersuchungen)》 언어게임 & 삶의형식·침묵의지혜 엔진
 *
 * 20세기 언어철학과 분석철학의 거장 루트비히 비트겐슈타인(Ludwig Wittgenstein, 1889~1951)의
 * 전기 저술 《논리철학논고(Tractatus Logico-Philosophicus)》 및 후기 《철학적 탐구(Philosophische Untersuchungen)》 원전 기반:
 * 1. 논리철학적 사유 정밀성 및 명료한 표현 지수 (Logical Clarity & Precise Thinking Index): 말할 수 있는 것을 명료하게 밝히고 헛된 관념적 혼란을 걷어내는 사유의 정밀성.
 * 2. 말할 수 없는 신비에 대한 경건한 침묵도 (Mystical Silence & Transcendent Reverence Score): "말할 수 없는 것에 대해서는 침묵해야 한다"는 명제처럼 삶의 의미와 신비를 함부로 재단하지 않는 경외감.
 * 3. 언어 게임 유연성 및 맥락 적응 지표 (Language-Game Contextual Flexibility Index): 고정된 본질주의를 벗어나 상황과 맥락에 따라 작동하는 다채로운 언어 게임 규칙 적응력.
 * 4. '의미는 곧 사용' 삶의 현장 실천 지수 (Meaning as Use & Practical Action Score): 추상적 사변에 매몰되지 않고 삶의 구체적 현장에서 행동과 실천으로 가치를 드러내는 지혜.
 * 5. 헛된 관념 혼란 치료 및 해방 회복탄력성 (Therapeutic Dissolution & Mental Clarity Score): 딱정벌레 상자의 비유처럼 사적인 집착과 언어의 미망을 털어내고 평정을 되찾는 힘.
 *
 * @version LUCKEY-WITTGENSTEIN-LANGUAGE-GAME-SILENCE-v2.0.0
 */

import type { UserProfile } from '../sharedState';

export const AUSTRIAN_WITTGENSTEIN_LANGUAGE_GAME_SILENCE_VERSION = 'LUCKEY-WITTGENSTEIN-LANGUAGE-GAME-SILENCE-v2.3.0';

export type WittgensteinQuestionTopic = 'relationship' | 'decision' | 'healing' | 'reflection';

export interface WittgensteinTemporalRhythm {
  kstDateLabel: string;
  timeWindowKo: string;
  languageTone: string;
  rhythmDirective: string;
}

export interface WittgensteinTheme {
  themeKey: string;
  themeTitleEn: string;
  themeTitleKo: string;
  pragmaticInsight: string;
  practicalCounsel: string;
}

export interface WittgensteinAphorism {
  aphorismKey: string;
  aphorismKo: string;
  aphorismOriginal: string;
  sourceContext: string;
  actionGuidance: string;
}

export interface AustrianWittgensteinLanguageGameSilenceResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 비트겐슈타인 언어·논리·침묵 핵심 지표 (0~100)
  logicalClarityTractatusPrecisionIndex: number;      // 논리적 사유 정밀성 (Logical Clarity)
  mysticalSilenceReverenceScore: number;              // 신비 앞의 경건한 침묵 (Mystical Silence)
  languageGameContextualFlexibilityIndex: number;     // 언어 게임 맥락 유연성 (Language-Game Flexibility)
  meaningAsUsePragmaticActionScore: number;           // 의미는 사용 실천도 (Meaning as Use)
  therapeuticDissolutionClarityScore: number;         // 관념 혼란 치료 회복탄력성 (Therapeutic Clarity)
  // 세부 분석
  questionTopic: WittgensteinQuestionTopic;
  temporalWittgensteinRhythm: WittgensteinTemporalRhythm;
  activeWittgensteinTheme: WittgensteinTheme;
  focalWittgensteinAphorism: WittgensteinAphorism;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  wittgensteinSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  wittgensteinComprehensiveGuidance: {
    guidanceTitle: string;
    philosophicalCounsel: string;
  };
}

export const WITTGENSTEIN_THEMES: WittgensteinTheme[] = [
  {
    themeKey: 'logicalClarityAndSilence',
    themeTitleEn: 'Limits of Language & Respectful Silence on the Mystical',
    themeTitleKo: '말할 수 있는 것의 명료함과 신비 앞의 침묵 — 사유의 한계를 직시하고 본질을 경외하기',
    pragmaticInsight: '말할 수 있는 것은 명확하게 말하고, 말할 수 없는 형이상학적 신비나 깊은 삶의 의미는 섣부른 말로 왜곡하지 않고 침묵으로 보여주어야(Zeigen) 합니다.',
    practicalCounsel: '사실과 데이터로 검증할 수 있는 일은 논리적이고 정밀하게 정리하십시오. 반면 인간의 마음이나 운명의 섭리처럼 말로 다 담을 수 없는 영역은 섣부른 단언 대신 겸허한 존중으로 대하십시오.',
  },
  {
    themeKey: 'languageGamesAndLifeForms',
    themeTitleEn: 'Language-Games & Forms of Life: Contextual Wisdom',
    themeTitleKo: '언어 게임과 삶의 형식 — 고정된 정답을 벗어나 상황과 맥락의 규칙에 유연하게 적응하기',
    pragmaticInsight: '단어와 행동의 의미는 영원불변한 본질에 있는 것이 아니라, 우리가 속한 삶의 형식(Lebensform)과 그 안에서 펼쳐지는 언어 게임(Sprachspiel)의 쓰임새에서 비롯됩니다.',
    practicalCounsel: '하나의 절대적인 잣대로 모든 상황을 재단하려 하지 마십시오. 지금 당신이 마주한 환경과 상대방의 고유한 맥락과 룰을 먼저 읽어내고, 유연하게 소통하며 발을 맞추십시오.',
  },
  {
    themeKey: 'meaningAsUse',
    themeTitleEn: 'Meaning is Use: Pragmatic Grounding in Concrete Action',
    themeTitleKo: '의미는 곧 사용이다 — 탁상공론을 넘어 현장의 구체적 실천으로 가치 증명하기',
    pragmaticInsight: '개념의 참된 뜻은 사전 속의 정의가 아니라 실제 삶에서 어떻게 쓰이고 기능하는가에 있습니다. 생각의 꼬리를 무는 사변을 멈추고 현장의 쓰임새로 내려앉아야 합니다.',
    practicalCounsel: '생각만 복잡하게 굴리며 결정을 미루지 마십시오. 실제로 손을 움직여 행동하고 구현해 볼 때 비로소 진정한 의미와 해법이 명료하게 드러납니다.',
  },
  {
    themeKey: 'therapeuticPhilosophy',
    themeTitleEn: 'Philosophy as Therapy: Escaping the Fly-Bottle',
    themeTitleKo: '철학적 치료와 파리병 탈출 — 머릿속 엉킨 매듭을 풀고 사적인 집착 털어내기',
    pragmaticInsight: '우리가 겪는 수많은 정신적 고통과 고민은 실재하는 문제가 아니라, 언어의 마법과 그릇된 관념이 쳐놓은 덫(파리병)에 갇힌 데서 생겨납니다. 병의 입구를 보여주어 날아가게 하는 치료적 사유가 필요합니다.',
    practicalCounsel: '스스로 만든 관념의 미로에 갇혀 괴로워하고 있지 않은지 살피십시오. 집착하던 사적인 틀을 한 발짝 뒤로 물러나 관찰하면, 문제가 애초에 존재하지 않았음을 깨닫고 즉시 해방될 수 있습니다.',
  },
  {
    themeKey: 'familyResemblance',
    themeTitleEn: 'Family Resemblance: Embracing Open Multiplicity',
    themeTitleKo: '가족 유사성 — 하나의 공통 본질 대신 다채로운 연결과 겹침을 포용하기',
    pragmaticInsight: '세상의 다채로운 일들은 하나의 고정된 공통분모로 묶이지 않고, 가족 구성원들처럼 복잡하게 얽히고설킨 유사성의 그물망으로 연결되어 있습니다.',
    practicalCounsel: '완벽한 단일 기준이나 흑백논리를 강요하지 마십시오. 다양한 측면들이 유기적으로 겹쳐 만들어내는 풍성한 가능성을 인정하고 느슨하면서도 견고한 연대를 구축하십시오.',
  },
];

export const WITTGENSTEIN_APHORISMS: WittgensteinAphorism[] = [
  {
    aphorismKey: 'tractatusSevenSilence',
    aphorismKo: '말할 수 없는 것에 대해서는 침묵해야 한다.',
    aphorismOriginal: 'Wovon man nicht sprechen kann, darüber muss man schweigen.',
    sourceContext: '비트겐슈타인 《논리철학논고(Tractatus Logico-Philosophicus)》 명제 7',
    actionGuidance: '확인되지 않은 추측과 섣부른 판단을 거두고, 명료하게 밝힐 수 있는 핵심에만 집중하며 내면의 깊은 침묵을 지키십시오.',
  },
  {
    aphorismKey: 'limitsOfMyLanguage',
    aphorismKo: '내 언어의 한계는 내 세계의 한계를 의미한다.',
    aphorismOriginal: 'Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt.',
    sourceContext: '비트겐슈타인 《논리철학논고(Tractatus Logico-Philosophicus)》 명제 5.6',
    actionGuidance: '당신의 표현과 어휘를 정밀하게 벼리십시오. 사유와 언어가 정교해질수록 마주하는 세상의 가능성 또한 비약적으로 넓어집니다.',
  },
  {
    aphorismKey: 'meaningIsUseAphorism',
    aphorismKo: '어떤 단어의 의미는 언어 안에서 그것의 쓰임새이다.',
    aphorismOriginal: 'Die Bedeutung eines Wortes ist sein Gebrauch in der Sprache.',
    sourceContext: '비트겐슈타인 《철학적 탐구(Philosophische Untersuchungen)》 §43',
    actionGuidance: '추상적인 이론이나 자존심에 매이지 말고, 실제 현장에서 어떤 실질적인 효용과 쓰임새를 만들어내는지로 결과를 증명하십시오.',
  },
  {
    aphorismKey: 'showTheFlyTheWayOut',
    aphorismKo: '철학의 목적은 파리에게 파리병에서 빠져나갈 출구를 보여주는 것이다.',
    aphorismOriginal: 'Was ist dein Ziel in der Philosophie? — Der Fliege den Ausweg aus dem Fliegenglas zeigen.',
    sourceContext: '비트겐슈타인 《철학적 탐구(Philosophische Untersuchungen)》 §309',
    actionGuidance: '자기만의 착각과 고뇌의 유리병에 갇혀 벽을 들이받지 마십시오. 시선을 돌리면 이미 열려 있는 출구가 보입니다.',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function classifyWittgensteinQuestionTopic(query?: string): WittgensteinQuestionTopic {
  const q = (query ?? '').trim();
  if (/관계|대화|소통|오해|말|연인|가족|친구|동료/.test(q)) return 'relationship';
  if (/결정|선택|진로|일|실행|방법|규칙|계획/.test(q)) return 'decision';
  if (/고민|불안|생각|집착|혼란|복잡|답답|막막/.test(q)) return 'healing';
  return 'reflection';
}

function buildWittgensteinTemporalRhythm(now?: Date): WittgensteinTemporalRhythm {
  const ref = now ?? new Date();
  const kst = new Date(ref.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hour = kst.getUTCHours();

  if (hour >= 5 && hour < 12) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} KST`,
      timeWindowKo: '오전 명료한 명제·구별 창',
      languageTone: '말할 수 있는 사실과 해야 할 일을 또렷이 가르는 아침',
      rhythmDirective: '모호한 추측 대신 오늘 실제로 손에 잡히는 사실 3가지만 먼저 명료하게 적어 보십시오.',
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} KST`,
      timeWindowKo: '오후 언어게임·맥락 조율 창',
      languageTone: '각자의 삶의 형식과 맥락 규칙을 읽고 조율하는 낮',
      rhythmDirective: '내 사전 속 뜻만 고집하지 말고, 상대와 현장이 지금 어떤 언어게임을 하고 있는지 먼저 살피십시오.',
    };
  }
  if (hour >= 18 && hour < 22) {
    return {
      kstDateLabel: `${yyyy}-${mm}-${dd} KST`,
      timeWindowKo: '저녁 파리병 탈출·관념 정돈 창',
      languageTone: '머릿속 헛된 언어의 덫에서 빠져나와 현실에 발을 딛는 저녁',
      rhythmDirective: '하루 동안 붙들었던 불필요한 말꼬리와 추상적 걱정을 내려놓고 단순한 일상의 감각으로 돌아오십시오.',
    };
  }
  return {
    kstDateLabel: `${yyyy}-${mm}-${dd} KST`,
    timeWindowKo: '심야 신비 앞의 침묵(Schweigen) 창',
    languageTone: '말로 다 재단할 수 없는 삶의 신비 앞에서 고요히 머무는 밤',
    rhythmDirective: '지금 당장 모든 답을 문장으로 규정하려 하지 마십시오. 침묵 속에서 스스로 드러나는 결이 있습니다.',
  };
}

function buildWittgensteinTopicGuidance(topic: WittgensteinQuestionTopic): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
} {
  if (topic === 'relationship') {
    return {
      practiceGuidance: '같은 단어를 써도 상대와 나의 삶의 형식이 다를 수 있음을 인정하고, 뜻이 아닌 실제 맥락을 먼저 확인하십시오.',
      ritualAction: '오해가 생긴 문장을 추측으로 해석하기 전에 "내가 이해한 바가 맞는지" 한 문장으로 담백하게 묻기',
      reflectionFocus: '지금 우리 사이의 갈등은 사실의 차이인가, 아니면 서로 다른 언어게임의 규칙에서 온 오해인가?',
    };
  }
  if (topic === 'decision') {
    return {
      practiceGuidance: '머릿속에서만 정의를 맴돌지 말고, 실제 삶에서 어떻게 쓰이고 작동하는지 작은 실행으로 검증하십시오.',
      ritualAction: '고민 중인 선택지를 거창한 이념이 아니라 오늘 당장 실행할 구체적 동작 1줄로 바꿔 적어 보기',
      reflectionFocus: '이 선택의 의미는 머릿속 추상적 설명에 있는가, 아니면 내일 내가 실제로 써먹을 행동에 있는가?',
    };
  }
  if (topic === 'healing') {
    return {
      practiceGuidance: '해결되지 않는 문제처럼 보이는 것 중 상당수는 스스로 짠 언어의 미로(파리병)일 수 있습니다. 한 걸음 물러나 출구를 보십시오.',
      ritualAction: '머리를 맴도는 걱정 문장 하나를 종이에 적은 뒤 "확인된 사실"과 "내 해석" 두 줄로 가르기',
      reflectionFocus: '내가 지금 부딪히고 있는 것은 바깥의 벽인가, 아니면 내가 만든 말의 유리병 벽면인가?',
    };
  }
  return {
    practiceGuidance: '명료하게 말할 수 있는 것은 단정히 정리하되, 말로 다 담기지 않는 깊은 가치는 성급히 재단하지 마십시오.',
    ritualAction: '오늘 하루 10분간 불필요한 설명이나 변명을 멈추고 조용히 산책하거나 차를 마시며 침묵 머물기',
    reflectionFocus: '지금 내 삶에서 굳이 말로 설명하지 않아도 행동과 태도만으로 이미 드러나고 있는 진실은 무엇인가?',
  };
}

export function calculateAustrianWittgensteinLanguageGameSilence(
  profile?: UserProfile,
  query?: string,
  now?: Date,
): AustrianWittgensteinLanguageGameSilenceResult {
  const p = profile as any;
  const name = profile?.basic?.name ?? p?.name ?? '남희';
  const birthDate = profile?.basic?.birthdate ?? p?.birthDate ?? p?.birthdate ?? '1967-08-25';
  const birthTime = profile?.basic?.birthtime ?? p?.birthTime ?? p?.birthtime ?? '12:00';
  const gender = profile?.basic?.gender ?? p?.gender ?? 'neutral';

  const temporalWittgensteinRhythm = buildWittgensteinTemporalRhythm(now);
  const questionTopic = classifyWittgensteinQuestionTopic(query);
  const topicGuidance = buildWittgensteinTopicGuidance(questionTopic);

  const seedString = `WITTGENSTEIN-LANGUAGE-GAME:${name}:${birthDate}:${birthTime}:${gender}:${query ?? ''}:${temporalWittgensteinRhythm.kstDateLabel}`;
  const baseHash = hashString(seedString);
  const absHash = Math.abs(baseHash);

  const logicalClarityTractatusPrecisionIndex = 84 + ((absHash >> 1) % 15);
  const mysticalSilenceReverenceScore = 83 + ((absHash >> 4) % 16);
  const languageGameContextualFlexibilityIndex = 82 + ((absHash >> 7) % 17);
  const meaningAsUsePragmaticActionScore = 85 + ((absHash >> 10) % 14);
  const therapeuticDissolutionClarityScore = 81 + ((absHash >> 13) % 18);

  const themeIndex = (absHash >> 5) % WITTGENSTEIN_THEMES.length;
  const aphorismIndex = (absHash >> 8) % WITTGENSTEIN_APHORISMS.length;

  const activeWittgensteinTheme = WITTGENSTEIN_THEMES[themeIndex];
  const focalWittgensteinAphorism = WITTGENSTEIN_APHORISMS[aphorismIndex];

  const guidanceTitle = `비트겐슈타인 언어게임·침묵 지혜: ${activeWittgensteinTheme.themeTitleKo}`;
  const philosophicalCounsel = `20세기 현대 사상의 거장 비트겐슈타인은 말할 수 있는 것의 명료한 논리적 정밀성을 세우고, 말할 수 없는 삶의 신비 앞에서는 경건한 침묵을 가르쳤으며, 언어 게임과 삶의 형식을 통해 실천적 지혜를 열었습니다. ` +
    `현재 당신의 흐름에서 가장 투명한 통찰을 비추는 핵심 원리는 '${activeWittgensteinTheme.themeTitleKo}'입니다. ` +
    `${activeWittgensteinTheme.practicalCounsel} ${topicGuidance.practiceGuidance} ` +
    `비트겐슈타인의 불후의 명제 "${focalWittgensteinAphorism.aphorismKo} (${focalWittgensteinAphorism.aphorismOriginal})"를 되새기며, ` +
    `${focalWittgensteinAphorism.actionGuidance}`;

  const boundaryNotice = '비트겐슈타인 언어게임·침묵 관점은 사고의 혼란을 덜고 맥락을 살피기 위한 철학적 성찰 도구이며, 실증적 사실 검증이나 전문 상담을 대신하지 않습니다.';
  const baseDate = now ?? new Date();
  const kst = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000);
  const kstTimeLabel = `${temporalWittgensteinRhythm.kstDateLabel.replace(' KST', '')} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')} +09:00 (KST)`;
  const wittgensteinSynthesisMatrix = {
    coreInsight: activeWittgensteinTheme.themeTitleKo,
    recommendedAction: topicGuidance.practiceGuidance,
    cautionNotice: '말할 수 없는 영역을 억지 문장으로 규정하려다 스스로 만든 언어의 덫(파리병)에 갇히지 마십시오.',
  };

  return {
    engineVersion: AUSTRIAN_WITTGENSTEIN_LANGUAGE_GAME_SILENCE_VERSION,
    calculatedAtKst: kstTimeLabel,
    logicalClarityTractatusPrecisionIndex,
    mysticalSilenceReverenceScore,
    languageGameContextualFlexibilityIndex,
    meaningAsUsePragmaticActionScore,
    therapeuticDissolutionClarityScore,
    questionTopic,
    temporalWittgensteinRhythm,
    activeWittgensteinTheme,
    focalWittgensteinAphorism,
    practiceGuidance: topicGuidance.practiceGuidance,
    ritualAction: topicGuidance.ritualAction,
    reflectionFocus: topicGuidance.reflectionFocus,
    reflectiveQuestion: query?.trim()
      ? `"${query.trim()}" 앞에서 내가 말할 수 있는 사실과 침묵 속에 비워둘 신비를 구분한다면 무엇이 남나요?`
      : topicGuidance.reflectionFocus,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    wittgensteinSynthesisMatrix,
    wittgensteinComprehensiveGuidance: {
      guidanceTitle,
      philosophicalCounsel,
    },
  };
}

export function formatAustrianWittgensteinLanguageGameSilencePrompt(
  res: AustrianWittgensteinLanguageGameSilenceResult,
): string {
  return [
    `【비트겐슈타인 《논리철학논고·철학적 탐구》 언어게임·침묵 지혜 지표 (${res.engineVersion})】`,
    `- 연산 시각: ${res.calculatedAtKst}`,
    `- 질문 주제 맥락: ${res.questionTopic}`,
    `- KST 시공간 리듬: ${res.temporalWittgensteinRhythm.kstDateLabel} · ${res.temporalWittgensteinRhythm.timeWindowKo} (${res.temporalWittgensteinRhythm.languageTone}) — ${res.temporalWittgensteinRhythm.rhythmDirective}`,
    `- 핵심 비트겐슈타인 테마: ${res.activeWittgensteinTheme.themeTitleKo} [${res.activeWittgensteinTheme.themeTitleEn}]`,
    `- 실천적 통찰: ${res.activeWittgensteinTheme.pragmaticInsight}`,
    `- 행동 조언: ${res.activeWittgensteinTheme.practicalCounsel}`,
    `- 질문 맞춤 실천 가이드: ${res.practiceGuidance}`,
    `- 일상 실천 의례: ${res.ritualAction}`,
    `- 핵심 성찰 질문: ${res.reflectionFocus}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 교차 매트릭스: 핵심(${res.wittgensteinSynthesisMatrix.coreInsight}) | 실행(${res.wittgensteinSynthesisMatrix.recommendedAction}) | 주의(${res.wittgensteinSynthesisMatrix.cautionNotice})`,
    `- 비트겐슈타인 원전 명언: "${res.focalWittgensteinAphorism.aphorismKo}" (${res.focalWittgensteinAphorism.aphorismOriginal})`,
    `- 원전 출처: [${res.focalWittgensteinAphorism.sourceContext}]`,
    `- 구체적 실천 지침: ${res.focalWittgensteinAphorism.actionGuidance}`,
    `- 종합 비트겐슈타인 권면: ${res.wittgensteinComprehensiveGuidance.philosophicalCounsel}`,
    `- 해석 경계: ${res.boundaryNotice}`,
  ].join('\n');
}
