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
        className={
          className ||
          'absolute inset-0 p-5 pr-10 pointer-events-none select-none overflow-hidden z-0 flex flex-col justify-between'
        }
        aria-hidden="true"
      >
        <div
          className={
            textClassName ||
            `text-sm font-sans leading-relaxed whitespace-pre-wrap break-words ${
              isLight ? 'text-slate-400/90' : 'text-white/45'
            }`
          }
        >
          {prefix && <span className="text-yellow-400/70 font-medium mr-1.5">{prefix}</span>}
          <span>{displayText}</span>
          <span
            className={
              cursorClassName ||
              'inline-block w-[2px] h-[15px] bg-yellow-400/85 ml-0.5 animate-pulse align-middle translate-y-[1px]'
            }
          />
        </div>

        {onApplyPrompt && currentPrompt && (
          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApplyPrompt(currentPrompt);
              }}
              className="pointer-events-auto px-2.5 py-1 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-400/35 text-[11px] text-yellow-200/90 hover:text-yellow-100 font-semibold transition-all cursor-pointer active:scale-95 shadow-sm flex items-center gap-1"
              title="현재 타이핑 중인 추천 고민을 입력창에 바로 채우기 (또는 Tab 키)"
            >
              <span>✨ 이 추천 고민 입력</span>
              <span className="hidden sm:inline text-[10px] text-yellow-300/70 font-mono">[Tab]</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        className ||
        'absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden pr-2 z-0'
      }
      aria-hidden="true"
    >
      <span
        className={
          textClassName ||
          `text-xs sm:text-sm font-normal truncate leading-tight sm:leading-snug ${
            isLight ? 'text-slate-400/90' : 'text-white/70'
          }`
        }
        style={textClassName ? undefined : { color: isLight ? 'rgba(100, 116, 139, 0.85)' : 'rgba(255, 255, 255, 0.72)' }}
      >
        {prefix}{displayText}
      </span>
      <span
        className={
          cursorClassName ||
          'inline-block w-[1.5px] h-[10px] sm:h-[13px] bg-amber-500/70 dark:bg-amber-400/80 ml-0.5 animate-pulse shrink-0 align-middle'
        }
      />
    </div>
  );
};


