import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useTTSState } from '@/utils/tts';
import {
  MIN_SENTENCE_MATCH_SCORE,
  bestSentenceGroupIndex,
  cleanSentenceForMatching,
  isSentenceActive,
  scoreSentenceMatch,
} from '@/lib/ttsHighlightMatch';

// Alignment logic lives in a React-free module so it can be regression tested.
export { cleanSentenceForMatching, isSentenceActive };

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
 * Premium highlighter marker styling:
 * Vivid warm amber glow that works gorgeously on both dark & light backgrounds,
 * preserving parent font weight and size (crucial for h1~h6 headings and <strong> bold text).
 */
export const TTS_HIGHLIGHT_CLASS =
  'tts-active-sentence-highlight bg-amber-400/35 text-amber-100 px-1.5 py-0.5 rounded border-b-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)] [font-weight:inherit] [font-size:inherit] [line-height:inherit]';

// A sentence can be rendered in a list, a nested paragraph and an open dialog.
// Give exactly one mounted candidate ownership instead of scrolling/highlighting all copies.
interface HighlightCandidate {
  update: (active: boolean) => void;
  score: number;
  order: number;
}
const highlightCandidates = new Map<HTMLElement, HighlightCandidate>();
let highlightCandidateOrder = 0;
let highlightFrame = 0;
function selectHighlightOwner() {
  cancelAnimationFrame(highlightFrame);
  highlightFrame = requestAnimationFrame(() => {
    const candidates = [...highlightCandidates.entries()].filter(([element]) => {
      if (!element.isConnected) return false;
      if (element.closest('[aria-hidden="true"], [hidden]')) return false;
      return true;
    });

    if (!candidates.length) return;

    // Ownership order: the strongest textual match first, then the copy the
    // reader is actually looking at. When the spoken sentence is outside the
    // viewport, the freshest mark — the one just rendered for that sentence —
    // takes it (and auto-scroll follows it) instead of the first mark in the
    // document, which used to fling the reading back up the page.
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    const topScore = candidates.reduce((max, [, entry]) => Math.max(max, entry.score), -1);

    let owner: HTMLElement | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const [element, entry] of candidates) {
      if (entry.score < topScore) continue;
      const rect = element.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= viewportHeight) continue;
      const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
      if (distance < bestDistance) {
        owner = element;
        bestDistance = distance;
      }
    }

    if (!owner) {
      let freshestOrder = -1;
      for (const [element, entry] of candidates) {
        if (entry.score < topScore) continue;
        if (entry.order > freshestOrder) {
          freshestOrder = entry.order;
          owner = element;
        }
      }
    }

    for (const [element, entry] of candidates) {
      entry.update(element === owner);
    }
  });
}

/**
 * Active Sentence Mark element with auto-scroll into view
 */
export function TTSHighlightMark({
  children,
  className = '',
  isLight = false,
  matchScore = 1,
}: {
  children: React.ReactNode;
  className?: string;
  isLight?: boolean;
  matchScore?: number;
}) {
  const markRef = useRef<HTMLSpanElement>(null);
  const [ownsHighlight, setOwnsHighlight] = useState(true);
  useEffect(() => {
    const element = markRef.current;
    if (!element) return;
    highlightCandidateOrder += 1;
    highlightCandidates.set(element, {
      update: setOwnsHighlight,
      score: matchScore,
      order: highlightCandidateOrder,
    });
    selectHighlightOwner();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prism:tts-sentence-highlighted', { detail: { element } }));
    }
    return () => {
      highlightCandidates.delete(element);
      selectHighlightOwner();
    };
  }, [matchScore]);

  const themeClass = isLight
    ? 'tts-active-sentence-highlight bg-amber-200/90 text-amber-950 px-1.5 py-0.5 rounded border-b-2 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] [font-weight:inherit] [font-size:inherit] [line-height:inherit]'
    : 'tts-active-sentence-highlight bg-amber-400/35 text-amber-100 px-1.5 py-0.5 rounded border-b-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)] [font-weight:inherit] [font-size:inherit] [line-height:inherit]';

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

  const score = scoreSentenceMatch(fullText, activeSentence);
  if (score >= MIN_SENTENCE_MATCH_SCORE) {
    return <TTSHighlightMark isLight={isLight} matchScore={score}>{children}</TTSHighlightMark>;
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
    const score = scoreSentenceMatch(fullContainerText, activeSentence);
    if (score >= MIN_SENTENCE_MATCH_SCORE) {
      return <TTSHighlightMark isLight={isLight} matchScore={score}>{children}</TTSHighlightMark>;
    }
    return children;
  }

  // 3. Multi-sentence paragraph or block (may contain <strong> bold elements inside any sentence):
  // Only the sentence group with the strongest match may own the highlight — the first
  // merely-passing group used to keep it, so the underline trailed the voice by a sentence.
  const bestIndex = bestSentenceGroupIndex(groupedSentences.map((group) => group.text), activeSentence);
  const bestScore = bestIndex >= 0
    ? scoreSentenceMatch(groupedSentences[bestIndex].text, activeSentence)
    : 0;

  const renderedGroups = groupedSentences.map((group, idx) => {
    if (idx === bestIndex) {
      return (
        <TTSHighlightMark key={`sent-mark-${idx}`} isLight={isLight} matchScore={bestScore}>
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

  if (bestIndex >= 0) {
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
  const { isSpeaking, isLoading, isPaused, activeText, currentSentence } = useTTSState();
  // Keep the underline through chunk boundaries (the audio for the next part is
  // still being generated) and while paused, so it no longer blinks off between
  // parts of a long reading.
  const readingActive = isSpeaking || isLoading || Boolean(isPaused);
  const activeTarget = readingActive
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
