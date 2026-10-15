import React, { useMemo, useRef, useEffect } from 'react';
import { useTTSState } from '@/utils/tts';

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
 * Normalizes ordinals/cardinals, speech idioms, punctuation, emojis, quotes, whitespace.
 */
export function cleanSentenceForMatching(s: string): string {
  if (!s) return '';
  let str = String(s)
    .replace(/\[(?:EMOTION|YOUTUBE|TOOL|IMAGE|PROMPT|STAGE|SOUL_UPDATE|CARD_DRAWN|SYSTEM):[\s\S]*?\]/gi, '')
    .replace(/[*_~`#>\[\]()]/g, '');

  // 1. Ordinals & Numbers bidirectional normalization (TTS: 첫째, 1번 <-> UI: 1, 1.)
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

  // 2. Acronyms normalization
  str = str
    .replace(/에이아이/gi, 'ai')
    .replace(/유아이/gi, 'ui')
    .replace(/유엑스/gi, 'ux')
    .replace(/넘버/gi, 'no');

  // 3. Keep only alphanumeric Korean/English/Numbers
  return str.replace(/[^가-힣a-zA-Z0-9]/g, '').toLowerCase();
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

  // 2. Direct containment with length safety (prevents whole paragraphs from matching a single short sentence)
  if (cleanA.includes(cleanS) && cleanS.length >= 3) return true;
  if (cleanS.includes(cleanA) && cleanS.length <= Math.max(cleanA.length * 1.35, cleanA.length + 12)) return true;

  // 3. Substring & prefix alignment (handles slight TTS normalizations or trailing words)
  if (cleanS.length >= 5 && cleanA.length >= 5) {
    const minLen = Math.min(10, cleanS.length, cleanA.length);
    const subA = cleanA.slice(0, minLen);
    if (cleanS.includes(subA) && Math.abs(cleanS.length - cleanA.length) <= 15) return true;
    const subS = cleanS.slice(0, minLen);
    if (cleanA.includes(subS) && Math.abs(cleanS.length - cleanA.length) <= 15) return true;
  }

  // 4. Key phrase token overlap (for headings or sentences with slight grammar variations)
  if (cleanS.length >= 6 && cleanA.length >= 6 && Math.abs(cleanS.length - cleanA.length) <= 15) {
    const tokensS = sentence
      .replace(/[^가-힣a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .map(cleanSentenceForMatching)
      .filter((t) => t.length >= 2);

    if (tokensS.length > 0) {
      let matchedCount = 0;
      for (const tok of tokensS) {
        if (cleanA.includes(tok)) matchedCount += 1;
      }
      if (matchedCount / tokensS.length >= 0.6) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Premium highlighter marker styling:
 * Vivid warm amber glow that works gorgeously on both dark & light backgrounds,
 * perfectly readable across all typography sizes (headings h1~h6 to small body text).
 */
export const TTS_HIGHLIGHT_CLASS =
  'tts-active-sentence-highlight bg-amber-400/35 text-amber-100 px-1.5 py-0.5 rounded border-b-2 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)] font-medium inline transition-all duration-300';

/**
 * Active Sentence Mark element with auto-scroll into view
 */
export function TTSHighlightMark({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const markRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (markRef.current) {
      try {
        markRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      } catch (_) {}
    }
  }, []);

  return (
    <mark ref={markRef} className={`${TTS_HIGHLIGHT_CLASS} ${className}`}>
      {children}
    </mark>
  );
}

/**
 * Specialized high-fidelity highlighter for markdown headings (h1, h2, h3, h4, h5, h6).
 * Analyzes the entire aggregated heading text to highlight the entire title seamlessly when spoken.
 */
export function highlightHeading(
  children: React.ReactNode,
  activeSentence: string | null | undefined,
): React.ReactNode {
  if (!activeSentence || !children) return children;

  const fullText = extractTextContent(children);
  if (!fullText.trim()) return children;

  if (isSentenceActive(fullText, activeSentence)) {
    return <TTSHighlightMark>{children}</TTSHighlightMark>;
  }

  return children;
}

/**
 * Recursively scans React children and wraps any sentence or heading matching the currently spoken TTS text with a highlighter marker.
 * When the active sentence changes or ends, previous highlighters are immediately cleared.
 */
export function highlightSentencesInChildren(
  children: React.ReactNode,
  activeSentence: string | null | undefined,
  isHeading: boolean = false,
): React.ReactNode {
  if (!activeSentence) return children;

  // If this block is a heading or subheading, treat as a single holistic title
  if (isHeading) {
    return highlightHeading(children, activeSentence);
  }

  if (typeof children === 'string') {
    if (!children.trim()) return children;

    // Split text into sentence tokens preserving delimiters (. ! ? \n)
    const rawTokens = children.split(/([.!?。！？\n]+)/);
    if (rawTokens.length <= 1) {
      if (isSentenceActive(children, activeSentence)) {
        return <TTSHighlightMark>{children}</TTSHighlightMark>;
      }
      return children;
    }

    const sentences: string[] = [];
    for (let i = 0; i < rawTokens.length; i += 2) {
      const body = rawTokens[i] || '';
      const punct = rawTokens[i + 1] || '';
      if (body || punct) {
        sentences.push(body + punct);
      }
    }

    return (
      <>
        {sentences.map((sent, idx) => {
          if (isSentenceActive(sent, activeSentence)) {
            return <TTSHighlightMark key={idx}>{sent}</TTSHighlightMark>;
          }
          return <React.Fragment key={idx}>{sent}</React.Fragment>;
        })}
      </>
    );
  }

  if (Array.isArray(children)) {
    // If the combined text has only 1 sentence or is short, check holistic match
    const combinedText = extractTextContent(children);
    if (combinedText) {
      const sentenceCount = combinedText.split(/[.!?。！？\n]+/).filter((s) => s.trim().length > 0).length;
      if (sentenceCount <= 1 && isSentenceActive(combinedText, activeSentence)) {
        return <TTSHighlightMark>{children}</TTSHighlightMark>;
      }
    }

    return React.Children.map(children, (child) =>
      highlightSentencesInChildren(child, activeSentence, false),
    );
  }

  if (React.isValidElement(children)) {
    // If element is a pure text container or inline tag, drill down
    const element = children as React.ReactElement<any>;
    if (element.props && element.props.children) {
      return React.cloneElement(element, {
        children: highlightSentencesInChildren(element.props.children, activeSentence, false),
      });
    }
  }

  return children;
}

/**
 * Standalone component that renders text with real-time TTS sentence highlighter.
 */
export function TTSHighlightedText({
  text,
  className = '',
  enabled = true,
}: {
  text: string;
  className?: string;
  enabled?: boolean;
}) {
  const { isSpeaking, activeText, currentSentence } = useTTSState();
  const activeTarget = (enabled && isSpeaking) ? (currentSentence || activeText) : null;

  const content = useMemo(() => {
    if (!enabled || !activeTarget) return text;
    return highlightSentencesInChildren(text, activeTarget);
  }, [text, activeTarget, enabled]);

  return <span className={className}>{content}</span>;
}
