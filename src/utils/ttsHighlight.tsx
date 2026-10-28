import React, { useState, useEffect, useMemo } from 'react';
import { subscribeTTS, TTSState } from './tts';
import {
  cleanSentenceForMatching,
  isSentenceActive,
  extractTextContent,
  TTSHighlightMark,
  highlightSentencesInChildren,
} from '@/components/common/TTSHighlightedText';

const INACTIVE_TTS_STATE: TTSState = {
  isSpeaking: false,
  isLoading: false,
  activeText: null,
  activeFullText: null,
  activeSessionId: null,
  activeSentence: null,
  activeSentenceIndex: -1,
  totalSentences: 0,
};

/**
 * Hook to track current TTS speech state and the specific sentence currently being spoken.
 * When `enabled` is false or the screen is off (`visibilityState === 'hidden'`), skips state updates to prevent UI lag.
 */
export function useTTSCurrentSentence(enabled: boolean = true) {
  const [ttsState, setTtsState] = useState<TTSState>(INACTIVE_TTS_STATE);

  useEffect(() => {
    if (!enabled) {
      setTtsState((prev) => (prev.isSpeaking || prev.isLoading ? INACTIVE_TTS_STATE : prev));
      return;
    }
    return subscribeTTS((state) => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden' && state.isSpeaking) {
        return;
      }
      setTtsState((prev) => {
        if (
          prev.isSpeaking === state.isSpeaking &&
          prev.isLoading === state.isLoading &&
          prev.activeSentence === state.activeSentence &&
          prev.currentSentence === state.currentSentence &&
          prev.activeText === state.activeText &&
          prev.activeFullText === state.activeFullText &&
          prev.activeSessionId === state.activeSessionId &&
          prev.activeSentenceIndex === state.activeSentenceIndex
        ) {
          return prev;
        }
        return state;
      });
    });
  }, [enabled]);

  if (!enabled) {
    return {
      isSpeaking: false,
      isLoading: false,
      activeSentence: null,
      activeFullText: null,
      activeSentenceIndex: -1,
      totalSentences: 0,
    };
  }

  return {
    isSpeaking: ttsState.isSpeaking,
    isLoading: ttsState.isLoading,
    activeSentence:
      ttsState.activeSentence ||
      ttsState.currentSentence ||
      null,
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
  return <TTSHighlightMark isLight={isLight}>{children}</TTSHighlightMark>;
}

/**
 * Recursively parses React children or string, locating targetSentence and wrapping it in TTSActiveSentenceMark.
 * Handles headings (h1~h6) and inline bold elements (<strong>) within multi-sentence paragraphs holistically.
 */
export function renderWithSentenceHighlight(
  children: React.ReactNode,
  activeSentence: string | null | undefined,
  isLight: boolean = false,
  isHeading: boolean = false,
): React.ReactNode {
  return highlightSentencesInChildren(children, activeSentence, isHeading, isLight);
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
  const { isSpeaking, activeSentence } = useTTSCurrentSentence(enabled);

  const isMatching = useMemo(() => {
    if (!enabled || !isSpeaking || !activeSentence || !text) return false;
    const cleanText = cleanSentenceForMatching(text);
    const cleanActive = cleanSentenceForMatching(activeSentence);
    if (!cleanText || !cleanActive) return false;
    return (
      cleanText.includes(cleanActive) ||
      cleanActive.includes(cleanText) ||
      isSentenceActive(text, activeSentence)
    );
  }, [enabled, isSpeaking, activeSentence, text]);

  const targetSentence = isMatching ? activeSentence : null;
  const content = useMemo(
    () => (targetSentence ? renderWithSentenceHighlight(text, targetSentence, isLight, isHeading) : text),
    [text, targetSentence, isLight, isHeading]
  );

  return <span className={className}>{content}</span>;
};
