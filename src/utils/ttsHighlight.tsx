import React, { useState, useEffect, useRef, useMemo } from 'react';
import { subscribeTTS, TTSState } from './tts';
import {
  cleanSentenceForMatching,
  isSentenceActive,
  extractTextContent,
} from '@/components/common/TTSHighlightedText';

/**
 * Hook to track current TTS speech state and the specific sentence currently being spoken.
 */
export function useTTSCurrentSentence() {
  const [ttsState, setTtsState] = useState<TTSState>({
    isSpeaking: false,
    isLoading: false,
    activeText: null,
    activeFullText: null,
    activeSessionId: null,
    activeSentence: null,
    activeSentenceIndex: -1,
    totalSentences: 0,
  });

  useEffect(() => {
    return subscribeTTS((state) => {
      setTtsState(state);
    });
  }, []);

  return {
    isSpeaking: ttsState.isSpeaking,
    isLoading: ttsState.isLoading,
    activeSentence: ttsState.activeSentence || (ttsState.isSpeaking ? ttsState.activeText : null),
    activeFullText: ttsState.activeFullText,
    activeSentenceIndex: ttsState.activeSentenceIndex ?? -1,
    totalSentences: ttsState.totalSentences ?? 0,
  };
}

/**
 * Robust sentence matching helper.
 * Finds the exact start and end offset of targetSentence within source string,
 * handling differences in ordinals (첫째 vs 1.), trailing punctuation, quotes, and whitespace.
 */
export function matchSentenceInString(
  source: string,
  targetSentence: string,
): { start: number; end: number } | null {
  if (!source || !targetSentence) return null;

  // 1. Exact match
  const exactIdx = source.indexOf(targetSentence);
  if (exactIdx !== -1) {
    return { start: exactIdx, end: exactIdx + targetSentence.length };
  }

  // 2. Trimmed match
  const trimmedTarget = targetSentence.trim();
  if (!trimmedTarget) return null;
  const trimmedIdx = source.indexOf(trimmedTarget);
  if (trimmedIdx !== -1) {
    return { start: trimmedIdx, end: trimmedIdx + trimmedTarget.length };
  }

  // 3. Match without trailing sentence punctuation (. ! ? 。 ！ ？)
  const noPunctTarget = trimmedTarget.replace(/[.!?。！？\s]+$/, '');
  if (noPunctTarget.length >= 2) {
    const noPunctIdx = source.indexOf(noPunctTarget);
    if (noPunctIdx !== -1) {
      let end = noPunctIdx + noPunctTarget.length;
      while (end < source.length && /[.!?。！？\s]/.test(source[end])) {
        end++;
      }
      return { start: noPunctIdx, end };
    }
  }

  // 4. Normalized fuzzy match (handles ordinals '첫째' <-> '1.', quotes, whitespace)
  if (isSentenceActive(source, targetSentence)) {
    return { start: 0, end: source.length };
  }

  return null;
}

/**
 * Animated real-time highlight mark element.
 * Smoothly scrolls into view if positioned outside current scroll viewport.
 */
export function TTSActiveSentenceMark({
  children,
  isLight = false,
}: {
  children: React.ReactNode;
  isLight?: boolean;
}) {
  const markRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (markRef.current) {
      try {
        markRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      } catch (_) {}
    }
  }, []);

  return (
    <mark
      ref={markRef}
      className={`tts-active-sentence-highlight inline rounded px-1.5 py-0.5 transition-all duration-300 ${
        isLight
          ? 'bg-amber-200/90 text-amber-950 border-b-2 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] font-semibold'
          : 'bg-amber-400/35 text-amber-100 border-b-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)] font-medium'
      }`}
    >
      {children}
    </mark>
  );
}

/**
 * Recursively parses React children or string, locating targetSentence and wrapping it in TTSActiveSentenceMark.
 * If isHeading is true, matches the whole heading title holistically.
 */
export function renderWithSentenceHighlight(
  children: React.ReactNode,
  activeSentence: string | null | undefined,
  isLight: boolean = false,
  isHeading: boolean = false,
): React.ReactNode {
  if (!activeSentence || !children) {
    return children;
  }

  // 🌟 If this element is a heading (h1~h6), match the aggregated title text holistically
  if (isHeading) {
    const fullHeadingText = extractTextContent(children);
    if (fullHeadingText && isSentenceActive(fullHeadingText, activeSentence)) {
      return <TTSActiveSentenceMark isLight={isLight}>{children}</TTSActiveSentenceMark>;
    }
  }

  // Check if the entire node text matches
  const aggregated = extractTextContent(children);
  if (aggregated && isSentenceActive(aggregated, activeSentence)) {
    return <TTSActiveSentenceMark isLight={isLight}>{children}</TTSActiveSentenceMark>;
  }

  let hasHighlighted = false;

  const traverse = (node: React.ReactNode): React.ReactNode => {
    if (hasHighlighted || node === null || node === undefined) {
      return node;
    }

    // 1. Plain string node
    if (typeof node === 'string') {
      const match = matchSentenceInString(node, activeSentence);
      if (match) {
        hasHighlighted = true;
        const before = node.slice(0, match.start);
        const highlighted = node.slice(match.start, match.end);
        const after = node.slice(match.end);

        return (
          <>
            {before}
            <TTSActiveSentenceMark isLight={isLight}>
              {highlighted}
            </TTSActiveSentenceMark>
            {after}
          </>
        );
      }
      return node;
    }

    // 2. Array of children
    if (Array.isArray(node)) {
      return node.map((child, idx) => (
        <React.Fragment key={idx}>{traverse(child)}</React.Fragment>
      ));
    }

    // 3. React Element
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      if (element.props && element.props.children) {
        const newChildren = traverse(element.props.children);
        return React.cloneElement(element, {}, newChildren);
      }
      return element;
    }

    return node;
  };

  return traverse(children);
}

/**
 * Universal component for plain-text sentence highlighting during TTS playback.
 * Automatically wraps the currently spoken sentence in a glowing highlight and clears it on sentence end.
 */
export const TTSHighlightText: React.FC<{
  text: string;
  isLight?: boolean;
  className?: string;
  isHeading?: boolean;
  enabled?: boolean;
}> = ({ text, isLight = false, className = '', isHeading = false, enabled = true }) => {
  const { isSpeaking, activeSentence } = useTTSCurrentSentence();

  const isMatching = useMemo(() => {
    if (!enabled || !isSpeaking || !activeSentence || !text) return false;
    return isSentenceActive(text, activeSentence);
  }, [enabled, isSpeaking, activeSentence, text]);

  const targetSentence = isMatching ? activeSentence : null;
  const content = renderWithSentenceHighlight(text, targetSentence, isLight, isHeading);

  return <span className={className}>{content}</span>;
};
