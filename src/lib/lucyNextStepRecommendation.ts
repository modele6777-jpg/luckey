export type LucyRecommendationKind = 'key' | 'luckey' | 'divination';

export interface LucyRecommendationContext {
  userQuery: string;
  lucyAnswer: string;
  recentUserTexts?: readonly string[];
  isCasual?: boolean;
  isGreeting?: boolean;
  isMasterMode?: boolean;
  forceDivination?: boolean;
}

const DIVINATION_INTENT = /(?:사주|타로|운세|점술|점괘|신점|명리|대운|사주팔자|팔자|오라클|점\s*봐|점쳐|운명\s*(?:흐름|상담|봐))/i;
const KEY_INTENT = /(?:\bkey\b|키\s*채널|개운|액운|운기|마음\s*약방|리추얼|실천|연습|습관|루틴|자기돌봄|마음챙김|hsp|예민|민감|스트레스|불안|걱정|번아웃|수면|휴식|명상|호흡)/i;

/**
 * Pick exactly one next destination for a substantive Lucy answer.
 * Divination is suggested only when requested or when the existing Lucy Master
 * offer logic has selected the current answer; it is not suggested while
 * already in Master mode. Key is preferred for practical/self-care intent, with
 * a Luckey channel as the contextual fallback.
 */
export function selectLucyRecommendationKind({
  userQuery,
  lucyAnswer,
  recentUserTexts = [],
  isCasual = false,
  isGreeting = false,
  isMasterMode = false,
  forceDivination = false,
}: LucyRecommendationContext): LucyRecommendationKind | null {
  const query = (userQuery || '').trim();
  const answer = (lucyAnswer || '').trim();
  if (isCasual || isGreeting || !query || answer.length < 10) return null;

  const recentContext = [...recentUserTexts.slice(-3), query].join(' ');
  if (!isMasterMode && (forceDivination || DIVINATION_INTENT.test(recentContext))) {
    return 'divination';
  }
  if (KEY_INTENT.test(recentContext)) return 'key';
  return 'luckey';
}
