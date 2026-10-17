import React, { useState, useEffect, useRef } from 'react';

interface DynamicGhostInputPlaceholderProps {
  prompts: string[];
  isVisible: boolean;
  onCurrentPromptChange?: (prompt: string) => void;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  switchPause?: number;
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
  prompts,
  isVisible,
  onCurrentPromptChange,
  typingSpeed = 45,
  deletingSpeed = 20,
  pauseDuration = 12000,
  switchPause = 800,
}) => {
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
    }
  }, [prompts]);

  const currentPrompt = shuffledList[currentIndex] || '';

  // Notify parent of active prompt for Tab completion
  useEffect(() => {
    if (currentPrompt && onCurrentPromptChange) {
      onCurrentPromptChange(currentPrompt);
    }
  }, [currentPrompt, onCurrentPromptChange]);

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
        if (nextIndex >= shuffledList.length) {
          const reshuffled = shuffleArray(prompts);
          setShuffledList(reshuffled);
          nextIndex = 0;
        }
        setCurrentIndex(nextIndex);
        setDisplayText('');
        setPhase('typing');
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
  ]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden pr-2 z-0"
      aria-hidden="true"
    >
      <span className="text-xs sm:text-sm text-slate-400/90 dark:text-slate-500/90 font-normal truncate leading-relaxed">
        {displayText}
      </span>
      <span className="inline-block w-[1.5px] h-[13px] sm:h-[14px] bg-amber-500/70 dark:bg-amber-400/70 ml-0.5 animate-pulse shrink-0 align-middle" />
    </div>
  );
};
