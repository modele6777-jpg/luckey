import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useTTSState } from '@/utils/tts';
import { prepareNaturalSpeechText } from '@/utils/speechText';

/**
 * Recursively extracts plain text content from any React node tree.
 */
export function extractTextContent(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    if (props && props.children !== undefined) {
      return extractTextContent(props.children);
    }
  }
  return '';
}

/**
 * Clean string for fuzzy speech-to-text sentence alignment.
 * Normalizes ordinals/cardinals, speech idioms, acronyms, symbols, punctuation, emojis, quotes, whitespace.
 * Ensures 100% parity between raw UI text (including headings & bold text) and prepareNaturalSpeechText output.
 */
const cleanSentenceCache = new Map<string, string>();
const tokenCache = new Map<string, string[]>();

/**
 * Clean string for fuzzy speech-to-text sentence alignment.
 * Memoized with an in-memory cache to eliminate repeated regex work during TTS playback.
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

/**
 * Tests whether a given sentence or heading matches the currently active TTS sentence/chunk.
 */
export function isSentenceActive(sentence: string, activeText: string | null | undefined): boolean {
  if (!activeText || !sentence) return false;
  const cleanS = cleanSentenceForMatching(sentence);
  const cleanA = cleanSentenceForMatching(activeText);
  if (cleanS.length < 2 || cleanA.length < 2) return false;

  // 1. Direct equality
  if (cleanS === cleanA) return true;

  const minLen = Math.min(cleanS.length, cleanA.length);
  const maxLen = Math.max(cleanS.length, cleanA.length);
  const ratio = minLen / maxLen;

  // 2. High-confidence containment (ratio >= 0.70 or minimal diff <= 5 chars)
  // Prevents long unrelated sentences or full chunks from falsely matching short sentences
  if (cleanA.includes(cleanS) || cleanS.includes(cleanA)) {
    if (ratio >= 0.70 || maxLen - minLen <= 5) {
      return true;
    }
  }

  // Reject drastically different lengths
  if (ratio < 0.65) return false;

  // 3. Substantial prefix alignment with close lengths
  const prefixLen = getCommonPrefixLength(cleanS, cleanA);
  if (prefixLen >= 6 && prefixLen / minLen >= 0.75) {
    return true;
  }

  // 4. Key phrase token overlap with length ratio constraint
  if (minLen >= 6 && ratio >= 0.70) {
    const tokensS = getCleanedTokens(sentence);
    const tokensA = getCleanedTokens(activeText);
    if (tokensS.length >= 2 && tokensA.length >= 2) {
      let matchedCount = 0;
      for (const tok of tokensS) {
        if (tokensA.some((tA) => tA.includes(tok) || tok.includes(tA))) {
          matchedCount += 1;
        }
      }
      if (matchedCount / Math.max(tokensS.length, tokensA.length) >= 0.75) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Premium highlighter marker styling:
 * Vivid warm amber glow that works gorgeously on both dark & light backgrounds,
 * preserving parent font weight and size (crucial for h1~h6 headings and <strong> bold text).
 */
export const TTS_HIGHLIGHT_CLASS =
  'tts-active-sentence-highlight bg-amber-400/35 text-amber-100 px-1.5 py-0.5 rounded border-b-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)] [font-weight:inherit] [font-size:inherit] inline transition-all duration-300';

// A sentence can be rendered in a list, a nested paragraph and an open dialog.
// Give exactly one mounted candidate ownership instead of scrolling/highlighting all copies.
const highlightCandidates = new Map<HTMLElement, (active: boolean) => void>();
let highlightFrame = 0;
function selectHighlightOwner() {
  cancelAnimationFrame(highlightFrame);
  highlightFrame = requestAnimationFrame(() => {
    let owner: HTMLElement | null = null;
    let best = -1;
    for (const element of highlightCandidates.keys()) {
      if (!element.isConnected || !element.getClientRects().length || element.closest('[aria-hidden="true"], [hidden]')) continue;
      const rect = element.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      const score = (element.closest('[role="dialog"], dialog') ? 4 : 0) + (visible ? 2 : 0);
      if (score > best || (score === best && owner?.contains(element))) {
        owner = element;
        best = score;
      }
    }
    for (const [element, update] of highlightCandidates) update(element === owner);
  });
}

/**
 * Active Sentence Mark element with auto-scroll into view
 */
export function TTSHighlightMark({
  children,
  className = '',
  isLight = false,
}: {
  children: React.ReactNode;
  className?: string;
  isLight?: boolean;
}) {
  const markRef = useRef<HTMLSpanElement>(null);
  const [ownsHighlight, setOwnsHighlight] = useState(false);
  useEffect(() => {
    const element = markRef.current;
    if (!element) return;
    highlightCandidates.set(element, setOwnsHighlight);
    selectHighlightOwner();
    return () => {
      highlightCandidates.delete(element);
      selectHighlightOwner();
    };
  }, []);

  const themeClass = isLight
    ? 'tts-active-sentence-highlight bg-amber-200/90 text-amber-950 px-1.5 py-0.5 rounded border-b-2 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] [font-weight:inherit] [font-size:inherit] [&_strong]:text-amber-950 inline transition-all duration-300'
    : 'tts-active-sentence-highlight bg-amber-400/35 text-amber-100 px-1.5 py-0.5 rounded border-b-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)] [font-weight:inherit] [font-size:inherit] [&_strong]:text-amber-50 inline transition-all duration-300';

  return (
    <span
      ref={markRef}
      data-tts-active={ownsHighlight ? 'true' : 'false'}
      data-tts-highlight-candidate
      className={`${ownsHighlight ? themeClass : ''} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Specialized high-fidelity highlighter for markdown headings (h1, h2, h3, h4, h5, h6).
 * Analyzes the entire aggregated heading text to highlight the entire title seamlessly when spoken.
 */
export function highlightHeading(
  children: React.ReactNode,
  activeSentence: string | null | undefined,
  isLight: boolean = false,
): React.ReactNode {
  if (!activeSentence || !children) return children;

  const fullText = extractTextContent(children);
  if (!fullText.trim()) return children;

  if (isSentenceActive(fullText, activeSentence)) {
    return <TTSHighlightMark isLight={isLight}>{children}</TTSHighlightMark>;
  }

  return children;
}

/**
 * Splits a mixed array of React child nodes (e.g., plain strings + <strong>bold</strong> + <em>italic</em>)
 * at sentence boundaries (. ! ? 。 ！ ？ \n) so that any sentence containing inline bold/styled elements
 * is grouped as a single unit and wrapped holistically in <TTSHighlightMark>.
 */
export function groupReactNodesIntoSentences(nodes: React.ReactNode[]): {
  nodes: React.ReactNode[];
  text: string;
}[] {
  const sentences: { nodes: React.ReactNode[]; text: string }[] = [];
  let currentNodes: React.ReactNode[] = [];
  let currentText = '';

  const flushCurrent = () => {
    if (currentNodes.length > 0 || currentText.length > 0) {
      sentences.push({ nodes: currentNodes, text: currentText });
      currentNodes = [];
      currentText = '';
    }
  };

  // Sentence boundary regex: matches ., !, ?, 。, ！, ？ (when not between digits like 3.14 and not a leading list number like "1. ") or newline
  const splitStringBySentenceEnd = (str: string): { chunk: string; endedSentence: boolean }[] => {
    const results: { chunk: string; endedSentence: boolean }[] = [];
    let buf = '';
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      buf += ch;

      if (ch === '\n') {
        results.push({ chunk: buf, endedSentence: true });
        buf = '';
        continue;
      }

      if (/[.!?。！？]/.test(ch)) {
        const prevChar = i > 0 ? str[i - 1] : (currentText.slice(-1) || '');
        const nextChar = i + 1 < str.length ? str[i + 1] : '';

        // Do not split on decimal points like 3.14
        if (ch === '.' && /\d/.test(prevChar) && /\d/.test(nextChar)) {
          continue;
        }

        // Do not split on leading ordinal numbers at the start of a sentence (e.g. "1. ")
        const combinedSoFar = (currentText + buf).trim();
        if (ch === '.' && /^\d+\.$/.test(combinedSoFar)) {
          continue;
        }

        // Consume any immediately following closing quotes/brackets or duplicate punctuation
        while (i + 1 < str.length && /[.!?。！？"'”’)\]]/.test(str[i + 1])) {
          i++;
          buf += str[i];
        }
        // Consume trailing spaces on the same line
        while (i + 1 < str.length && str[i + 1] === ' ') {
          i++;
          buf += str[i];
        }

        results.push({ chunk: buf, endedSentence: true });
        buf = '';
      }
    }

    if (buf.length > 0) {
      results.push({ chunk: buf, endedSentence: false });
    }
    return results;
  };

  const processNode = (node: React.ReactNode) => {
    if (node === null || node === undefined || typeof node === 'boolean') {
      return;
    }

    if (typeof node === 'string' || typeof node === 'number') {
      const parts = splitStringBySentenceEnd(String(node));
      for (const part of parts) {
        currentNodes.push(part.chunk);
        currentText += part.chunk;
        if (part.endedSentence) {
          flushCurrent();
        }
      }
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(processNode);
      return;
    }

    if (React.isValidElement(node)) {
      const el = node as React.ReactElement<any>;
      if (el.type === React.Fragment && el.props?.children) {
        React.Children.toArray(el.props.children).forEach(processNode);
        return;
      }
      if (el.type === 'br') {
        currentNodes.push(el);
        flushCurrent();
        return;
      }
      // Inline element such as <strong>, <em>, <code>, <span>, <a>:
      // Keep the element intact inside the current sentence group!
      const elText = extractTextContent(el);
      currentNodes.push(el);
      currentText += elText;
      const trimmedEl = elText.trim();
      if (
        /[.!?。！？]['"”’)\]]*$/.test(trimmedEl) &&
        !/^\d+\.$/.test(trimmedEl)
      ) {
        flushCurrent();
      }
      return;
    }
  };

  nodes.forEach(processNode);
  flushCurrent();

  return sentences;
}

/**
 * Recursively scans React children and wraps any sentence or heading matching the currently spoken TTS text with a highlighter marker.
 * Handles headings (h1~h6) and inline bold/styled elements (<strong>, <b>, <em>) seamlessly as a unified sentence highlight.
 */
export function highlightSentencesInChildren(
  children: React.ReactNode,
  activeSentence: string | null | undefined,
  isHeading: boolean = false,
  isLight: boolean = false,
): React.ReactNode {
  if (!activeSentence || !children) return children;

  // 1. If this block is a heading or subheading (h1~h6), treat as a single holistic title
  if (isHeading) {
    return highlightHeading(children, activeSentence, isLight);
  }

  // 2. Check if the entire container text matches activeSentence holistically
  // (e.g., a single-sentence paragraph or list item containing **bold** text)
  const fullContainerText = extractTextContent(children);
  if (!fullContainerText.trim()) return children;

  const groupedSentences = groupReactNodesIntoSentences(React.Children.toArray(children));

  if (groupedSentences.length <= 1) {
    if (isSentenceActive(fullContainerText, activeSentence)) {
      return <TTSHighlightMark isLight={isLight}>{children}</TTSHighlightMark>;
    }
    return children;
  }

  // 3. Multi-sentence paragraph or block (may contain <strong> bold elements inside any sentence):
  // Match each sentence group's aggregated text against activeSentence, and wrap the matching sentence group in a single <TTSHighlightMark>.
  let anyGroupMatched = false;
  const renderedGroups = groupedSentences.map((group, idx) => {
    if (!anyGroupMatched && group.text.trim() && isSentenceActive(group.text, activeSentence)) {
      anyGroupMatched = true;
      return (
        <TTSHighlightMark key={`sent-mark-${idx}`} isLight={isLight}>
          {group.nodes.map((n, nIdx) => (
            <React.Fragment key={nIdx}>{n}</React.Fragment>
          ))}
        </TTSHighlightMark>
      );
    }
    return (
      <React.Fragment key={`sent-frag-${idx}`}>
        {group.nodes.map((n, nIdx) => (
          <React.Fragment key={nIdx}>{n}</React.Fragment>
        ))}
      </React.Fragment>
    );
  });

  if (anyGroupMatched) {
    return <>{renderedGroups}</>;
  }

  // If this was a multi-sentence paragraph and no individual sentence matched,
  // do NOT highlight the entire multi-sentence container as a fallback.
  return <>{renderedGroups}</>;
}

/**
 * Standalone component that renders text with real-time TTS sentence highlighter.
 */
function ActiveTTSHighlightedText({
  text,
  className = '',
  isLight = false,
}: {
  text: string;
  className?: string;
  isLight?: boolean;
}) {
  const { isSpeaking, activeText, currentSentence } = useTTSState();
  const activeTarget = isSpeaking
    ? currentSentence || (activeText && activeText.length <= 280 ? activeText : null)
    : null;

  const content = useMemo(() => {
    if (!activeTarget) return text;
    return highlightSentencesInChildren(text, activeTarget, false, isLight);
  }, [text, activeTarget, isLight]);

  return <span className={className}>{content}</span>;
}

/**
 * Standalone component that renders text with real-time TTS sentence highlighter.
 * Only subscribes to TTS store when `enabled` is true, eliminating unnecessary re-renders across the app.
 */
export function TTSHighlightedText({
  text,
  className = '',
  enabled = true,
  isLight = false,
}: {
  text: string;
  className?: string;
  enabled?: boolean;
  isLight?: boolean;
}) {
  if (!enabled) {
    return <span className={className}>{text}</span>;
  }
  return <ActiveTTSHighlightedText text={text} className={className} isLight={isLight} />;
}
