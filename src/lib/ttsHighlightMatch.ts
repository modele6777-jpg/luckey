import { prepareNaturalSpeechText } from '../utils/speechText';

/**
 * Alignment between the sentence rendered on screen and the sentence the voice
 * is reading right now.
 *
 * The reading shown on screen and the text sent to the voice provider are the
 * same prose, but never the same string: markdown markers, list numbers,
 * `**bold**` labels, quotes, brackets and hanja annotations are all normalized
 * for speech. Matching therefore works on a normalized form and scores how much
 * of a sentence is really shared — a loose "two words are the same" test lit up
 * unrelated sentences in long readings (every tarot step repeats words such as
 * 오늘 / 카드 / 마음 / 흐름 / 선택), which is the wrong-sentence underline.
 *
 * Scores are 0..1. Anything at or above MIN_SENTENCE_MATCH_SCORE is considered
 * the spoken sentence. The margin between a real match (>= 0.8) and the
 * repeated-word false positives (< 0.5 in the reproduced tarot readings) is
 * wide on purpose: one wrong underline is worse than a beat without one.
 */
export const MIN_SENTENCE_MATCH_SCORE = 0.75;

const cleanSentenceCache = new Map<string, string>();
const tokenCache = new Map<string, string[]>();

/**
 * Normalized form used for alignment: ordinals, numbers, speech idioms,
 * punctuation, quotes, brackets and spacing are folded away so that
 * "5. 오늘의 흐름" and "다섯째, 오늘의 흐름." both become "5오늘의흐름".
 */
export function cleanSentenceForMatching(s: string): string {
  if (!s) return '';
  const rawKey = String(s);
  const cached = cleanSentenceCache.get(rawKey);
  if (cached !== undefined) return cached;

  let str = prepareNaturalSpeechText(rawKey);

  str = str
    .replace(/(?:첫째|첫번째|1번|일번)/g, '1')
    .replace(/(?:둘째|두번째|2번|이번)/g, '2')
    .replace(/(?:셋째|세번째|3번|삼번)/g, '3')
    .replace(/(?:넷째|네번째|4번|사번)/g, '4')
    .replace(/(?:다섯째|다섯번째|5번|오번)/g, '5')
    .replace(/(?:여섯째|여섯번째|6번|육번)/g, '6')
    .replace(/(?:일곱째|일곱번째|7번|칠번)/g, '7')
    .replace(/(?:여덟째|여덟번째|8번|팔번)/g, '8')
    .replace(/(?:아홉째|아홉번째|9번|구번)/g, '9')
    .replace(/(?:열째|열번째|10번|십번)/g, '10');

  const result = str.replace(/[^가-힣a-zA-Z0-9]/g, '').toLowerCase();
  if (cleanSentenceCache.size > 2000) {
    cleanSentenceCache.clear();
  }
  cleanSentenceCache.set(rawKey, result);
  return result;
}

function getCleanedTokens(sentence: string): string[] {
  const cached = tokenCache.get(sentence);
  if (cached !== undefined) return cached;

  const tokens = prepareNaturalSpeechText(sentence)
    .replace(/[^가-힣a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((t) => cleanSentenceForMatching(t))
    .filter((t) => t.length >= 2);

  if (tokenCache.size > 1500) {
    tokenCache.clear();
  }
  tokenCache.set(sentence, tokens);
  return tokens;
}

function getCommonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) {
    i++;
  }
  return i;
}

/** Longest common subsequence of tokens — shared words that keep their order. */
function orderedSharedTokenCount(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  let previous = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const current = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) {
      current[j] = a[i - 1] === b[j - 1]
        ? previous[j - 1] + 1
        : Math.max(previous[j], current[j - 1]);
    }
    previous = current;
  }
  return previous[b.length];
}

/**
 * How strongly `sentence` (as rendered on screen) matches `activeText` (the
 * sentence the voice is reading). 0 means "not this sentence".
 */
export function scoreSentenceMatch(sentence: string, activeText: string | null | undefined): number {
  if (!sentence || !activeText) return 0;

  const cleanS = cleanSentenceForMatching(sentence);
  const cleanA = cleanSentenceForMatching(activeText);
  if (cleanS.length < 2 || cleanA.length < 2) return 0;

  if (cleanS === cleanA) return 1;

  const longer = cleanS.length >= cleanA.length ? cleanS : cleanA;
  const shorter = longer === cleanS ? cleanA : cleanS;
  const lengthRatio = shorter.length / longer.length;

  // A chunk boundary or a long sentence cut for speech leaves the voice reading
  // part of the displayed sentence; that fragment still belongs to it.
  if (shorter.length >= 12 && longer.includes(shorter)) return 0.93;
  if (shorter.length >= 8 && (longer.startsWith(shorter) || longer.endsWith(shorter))) return 0.9;

  // Same sentence apart from an appended clause or a trailing marker.
  if (shorter.length >= 8 && longer.includes(shorter) && lengthRatio >= 0.7) return 0.86;

  // Normalization only rewrote the tail (numbers, units, hanja readings).
  const prefixLen = getCommonPrefixLength(cleanS, cleanA);
  if (prefixLen >= 12 && prefixLen / longer.length >= 0.78) return 0.8;

  // Last resort: the same words in the same order, each rewritten by the speech
  // normalizer. Shared words must cover most of the shorter sentence, so a few
  // repeated everyday words can no longer claim an unrelated sentence.
  if (shorter.length >= 8) {
    const tokensS = getCleanedTokens(sentence);
    const tokensA = getCleanedTokens(activeText);
    if (tokensS.length >= 2 && tokensA.length >= 2) {
      const orderKept = orderedSharedTokenCount(tokensS, tokensA);
      const setB = new Set(tokensA);
      const shared = Array.from(new Set(tokensS.filter((tok) => setB.has(tok))));
      const sharedChars = shared.reduce((sum, tok) => sum + tok.length, 0);
      const tokenRatio = shared.length / Math.min(tokensS.length, tokensA.length);
      if (
        orderKept >= 3 &&
        shared.length >= 3 &&
        tokenRatio >= 0.8 &&
        sharedChars / shorter.length >= 0.85
      ) {
        return 0.78;
      }
    }
  }

  return 0;
}

/** True when this rendered sentence is the one being spoken. */
export function isSentenceActive(sentence: string, activeText: string | null | undefined): boolean {
  return scoreSentenceMatch(sentence, activeText) >= MIN_SENTENCE_MATCH_SCORE;
}

/**
 * Of several sentence groups inside one block, the spoken one. Picking the
 * first group that merely passed the threshold kept the underline on an earlier
 * sentence (the "underline lags behind the voice" report), so the best score
 * wins and ties are ignored.
 */
export function bestSentenceGroupIndex(texts: string[], activeText: string | null | undefined): number {
  let bestIndex = -1;
  let bestScore = 0;
  for (let index = 0; index < texts.length; index++) {
    const score = scoreSentenceMatch(texts[index], activeText);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }
  return bestScore >= MIN_SENTENCE_MATCH_SCORE ? bestIndex : -1;
}
