import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface DynamicGhostInputPlaceholderProps {
  prompts?: string[];
  promptPool?: string[];
  isVisible: boolean;
  onCurrentPromptChange?: (prompt: string) => void;
  onActivePromptChange?: (prompt: string) => void;
  onApplyPrompt?: (prompt: string) => void;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  switchPause?: number;
  multiline?: boolean;
  className?: string;
  textClassName?: string;
  cursorClassName?: string;
  prefix?: string;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const DynamicGhostInputPlaceholder: React.FC<DynamicGhostInputPlaceholderProps> = ({
  prompts: rawPrompts,
  promptPool,
  isVisible,
  onCurrentPromptChange,
  onActivePromptChange,
  onApplyPrompt,
  typingSpeed = 45,
  deletingSpeed = 20,
  pauseDuration = 12000,
  switchPause = 800,
  multiline = false,
  className,
  textClassName,
  cursorClassName,
  prefix = '',
}) => {
  const prompts = rawPrompts || promptPool || [];
  const notifyPromptChange = onCurrentPromptChange || onActivePromptChange;
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const [shuffledList, setShuffledList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'switching'>('typing');
  const prevPromptsKeyRef = useRef<string>('');

  // Shuffle prompts on mount or when prompts list truly changes
  useEffect(() => {
    if (!prompts || prompts.length === 0) return;
    const key = prompts.join('\u0001');
    if (key !== prevPromptsKeyRef.current) {
      prevPromptsKeyRef.current = key;
      const shuffled = shuffleArray(prompts);
      setShuffledList(shuffled);
      setCurrentIndex(0);
      setDisplayText('');
      setPhase('typing');
      if (shuffled[0] && notifyPromptChange) {
        notifyPromptChange(shuffled[0]);
      }
    }
  }, [prompts, notifyPromptChange]);

  const currentPrompt = shuffledList[currentIndex] || '';

  // Notify parent of active prompt for Tab completion and instant send
  useEffect(() => {
    if (currentPrompt && notifyPromptChange) {
      notifyPromptChange(currentPrompt);
    }
  }, [currentPrompt, notifyPromptChange]);

  // When placeholder becomes visible again (e.g. after AI finishes generating), auto-advance to the next prompt
  const isVisiblePrevRef = useRef(isVisible);
  useEffect(() => {
    if (!isVisiblePrevRef.current && isVisible && shuffledList.length > 0) {
      let nextIndex = currentIndex + 1;
      let list = shuffledList;
      if (nextIndex >= shuffledList.length) {
        list = shuffleArray(prompts);
        setShuffledList(list);
        nextIndex = 0;
      }
      setCurrentIndex(nextIndex);
      setDisplayText('');
      setPhase('typing');
      if (list[nextIndex] && onCurrentPromptChange) {
        onCurrentPromptChange(list[nextIndex]);
      }
    }
    isVisiblePrevRef.current = isVisible;
  }, [isVisible, currentIndex, shuffledList, prompts, onCurrentPromptChange]);

  // Typewriter effect state machine
  useEffect(() => {
    if (!isVisible || !currentPrompt) return;

    let timer: NodeJS.Timeout;

    if (phase === 'typing') {
      if (displayText.length < currentPrompt.length) {
        timer = setTimeout(() => {
          setDisplayText(currentPrompt.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setPhase('deleting');
        }, pauseDuration);
      }
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentPrompt.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => {
          setPhase('switching');
        }, 120);
      }
    } else if (phase === 'switching') {
      timer = setTimeout(() => {
        let nextIndex = currentIndex + 1;
        let list = shuffledList;
        if (nextIndex >= shuffledList.length) {
          list = shuffleArray(prompts);
          setShuffledList(list);
          nextIndex = 0;
        }
        setCurrentIndex(nextIndex);
        setDisplayText('');
        setPhase('typing');
        if (list[nextIndex] && onCurrentPromptChange) {
          onCurrentPromptChange(list[nextIndex]);
        }
      }, switchPause);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    isVisible,
    phase,
    displayText,
    currentPrompt,
    currentIndex,
    shuffledList.length,
    prompts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    switchPause,
    onCurrentPromptChange,
  ]);

  if (!isVisible) return null;

  if (multiline) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-10 flex flex-col justify-between ${
          className || 'p-5 pr-10'
        }`}
        aria-hidden="true"
      >
        <div
          className={`text-sm font-sans leading-relaxed whitespace-pre-wrap break-words ${
            textClassName || (isLight ? 'text-slate-400/90' : 'text-white/45')
          }`}
        >
          {prefix && <span className="text-yellow-400/80 font-semibold mr-1.5">{prefix}</span>}
          <span>{displayText}</span>
          <span
            className={`inline-block w-[2px] h-[15px] ml-0.5 animate-pulse align-middle translate-y-[1px] ${
              cursorClassName || 'bg-yellow-400/85'
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden z-10 ${
        className || 'pr-2'
      }`}
      aria-hidden="true"
    >
      <span
        className={`text-xs sm:text-sm font-normal truncate leading-tight sm:leading-snug ${
          textClassName || (isLight ? 'text-slate-400/90' : 'text-white/70')
        }`}
        style={textClassName ? undefined : { color: isLight ? 'rgba(100, 116, 139, 0.85)' : 'rgba(255, 255, 255, 0.72)' }}
      >
        {prefix && <span className="text-amber-300/80 font-medium mr-1">{prefix}</span>}
        {displayText}
      </span>
      <span
        className={`inline-block w-[1.5px] h-[10px] sm:h-[13px] ml-0.5 animate-pulse shrink-0 align-middle ${
          cursorClassName || 'bg-amber-500/70 dark:bg-amber-400/80'
        }`}
      />
    </div>
  );
};


