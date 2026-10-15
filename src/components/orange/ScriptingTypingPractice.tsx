import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Keyboard,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Shuffle,
  ChevronRight,
  Award,
  Zap,
  Clock,
  Target,
  Copy,
  Check,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { TTSButton } from '@/components/TTSButton';

export interface ScriptingSample {
  id: string;
  category: 'scripting' | 'affirmation' | 'desire' | 'mirror' | 'gratitude' | 'secret';
  categoryLabel: string;
  text: string;
  sourceLabel?: string;
}

interface ScriptingTypingPracticeProps {
  scriptingStarter?: string;
  affirmation?: string;
  desire?: string;
  mirrorPhrase?: string;
  gratitudeSeeds?: string[];
  reflection?: string;
  currentScript?: string;
  onCompletePractice?: () => void;
}

const CLASSIC_SECRET_QUOTES: string[] = [
  '내가 간절히 바라는 것은 이미 보이지 않는 차원에서 나를 향해 다가오고 있다.',
  '나는 무한한 가능성을 지닌 우주의 중심이며, 내 생각과 감정이 현실을 창조한다.',
  '오늘 하루도 내게 주어진 모든 순간에 감사하며 가장 높은 풍요의 주파수를 유지한다.',
  '나는 원하는 모든 성공과 사랑, 건강과 풍요를 온전히 누릴 자격이 충분한 사람이다.',
  '기적은 매일 나의 삶 속에 가장 자연스럽고 완전한 방식으로 피어난다.',
  '이미 모든 것이 이루어졌음에 깊이 감사하며 평온한 확신으로 오늘을 살아간다.',
];

export function ScriptingTypingPractice({
  scriptingStarter,
  affirmation,
  desire,
  mirrorPhrase,
  gratitudeSeeds = [],
  reflection,
  currentScript,
  onCompletePractice,
}: ScriptingTypingPracticeProps) {
  // Aggregate all sample phrases from current Daily Secret
  const samples = useMemo<ScriptingSample[]>(() => {
    const list: ScriptingSample[] = [];

    if (scriptingStarter?.trim()) {
      list.push({
        id: 'scripting-starter',
        category: 'scripting',
        categoryLabel: '오늘의 스크립팅 첫 문장',
        text: scriptingStarter.trim(),
        sourceLabel: '소원 맞춤 스크립팅',
      });
    }

    if (affirmation?.trim()) {
      list.push({
        id: 'affirmation',
        category: 'affirmation',
        categoryLabel: '오늘의 시크릿 확언',
        text: affirmation.trim(),
        sourceLabel: '핵심 확언',
      });
    }

    if (desire?.trim()) {
      list.push({
        id: 'desire',
        category: 'desire',
        categoryLabel: '우주 소원 선언문 (Ask)',
        text: desire.trim(),
        sourceLabel: '소원 요청',
      });
    }

    if (mirrorPhrase?.trim()) {
      list.push({
        id: 'mirror',
        category: 'mirror',
        categoryLabel: '거울 확언 (Mirror Work)',
        text: mirrorPhrase.trim(),
        sourceLabel: '자존감 & 확신',
      });
    }

    gratitudeSeeds.forEach((seed, idx) => {
      if (seed?.trim()) {
        list.push({
          id: `gratitude-${idx}`,
          category: 'gratitude',
          categoryLabel: `감사 씨앗 #${idx + 1}`,
          text: seed.trim(),
          sourceLabel: '풍요 감사',
        });
      }
    });

    if (reflection?.trim()) {
      list.push({
        id: 'reflection',
        category: 'secret',
        categoryLabel: '마음에 새길 글 (Believe)',
        text: reflection.trim(),
        sourceLabel: '믿음의 원리',
      });
    }

    if (currentScript?.trim() && currentScript.trim() !== scriptingStarter?.trim()) {
      list.push({
        id: 'user-custom',
        category: 'scripting',
        categoryLabel: '내가 작성한 스크립트',
        text: currentScript.trim(),
        sourceLabel: '나만의 필사',
      });
    }

    CLASSIC_SECRET_QUOTES.forEach((quote, idx) => {
      list.push({
        id: `classic-${idx}`,
        category: 'secret',
        categoryLabel: `시크릿 명문구 #${idx + 1}`,
        text: quote,
        sourceLabel: '끌어당김의 법칙',
      });
    });

    return list;
  }, [scriptingStarter, affirmation, desire, mirrorPhrase, gratitudeSeeds, reflection, currentScript]);

  const [selectedSampleId, setSelectedSampleId] = useState<string>(() => samples[0]?.id || 'scripting-starter');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentSample = useMemo(() => {
    return samples.find((s) => s.id === selectedSampleId) || samples[0] || {
      id: 'fallback',
      category: 'scripting' as const,
      categoryLabel: '스크립팅 문구',
      text: '내 소원은 이미 우주의 완벽한 섭리 안에서 이루어졌다.',
    };
  }, [samples, selectedSampleId]);

  const targetText = currentSample.text;

  // Typing practice state
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errorCount, setErrorCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset practice state when switching phrase
  const handleSelectSample = (sample: ScriptingSample) => {
    setSelectedSampleId(sample.id);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setCpm(0);
    setAccuracy(100);
    setErrorCount(0);
    setIsCompleted(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleRandomSample = () => {
    const available = samples.filter((s) => s.id !== selectedSampleId);
    if (available.length === 0) return;
    const random = available[Math.floor(Math.random() * available.length)];
    handleSelectSample(random);
  };

  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setCpm(0);
    setAccuracy(100);
    setErrorCount(0);
    setIsCompleted(false);
    inputRef.current?.focus();
  };

  // Real-time CPM and Accuracy calculation
  useEffect(() => {
    if (!startTime || isCompleted) return;

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0.01) {
        const speed = Math.round(userInput.length / elapsedMinutes);
        setCpm(speed);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [startTime, userInput.length, isCompleted]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isCompleted) return;

    // Start timer on first keystroke
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    const prevLength = userInput.length;
    const isAdding = value.length > prevLength;

    // Check last character accuracy for error tracking
    if (isAdding) {
      const lastCharIdx = value.length - 1;
      const isMismatch = targetText[lastCharIdx] && value[lastCharIdx] !== targetText[lastCharIdx];
      if (isMismatch) {
        setErrorCount((prev) => prev + 1);
      }
    }

    setUserInput(value);

    // Compute character accuracy
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === targetText[i]) {
        correct++;
      }
    }
    const currentAcc = value.length > 0 ? Math.max(0, Math.round((correct / value.length) * 100)) : 100;
    setAccuracy(currentAcc);

    // Check completion condition (full match or reached target length with high accuracy)
    if (value === targetText || (value.length >= targetText.length && value === targetText.slice(0, value.length))) {
      const finishTime = Date.now();
      setEndTime(finishTime);
      setIsCompleted(true);
      const elapsedMin = ((finishTime - (startTime || finishTime)) / 60000) || 0.05;
      const finalCpm = Math.round(targetText.length / elapsedMin);
      setCpm(finalCpm);
      setAccuracy(100);
      onCompletePractice?.();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const filteredSamples = useMemo(() => {
    if (selectedCategory === 'all') return samples;
    return samples.filter((s) => s.category === selectedCategory);
  }, [samples, selectedCategory]);

  const progressPercent = Math.min(100, Math.round((userInput.length / Math.max(1, targetText.length)) * 100));

  // Track session typing updates for smooth rotation animation feedback
  const [isUpdating, setIsUpdating] = useState(false);
  const prevProgressRef = useRef(progressPercent);

  useEffect(() => {
    if (userInput.length > 0 && prevProgressRef.current !== progressPercent) {
      prevProgressRef.current = progressPercent;
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 650);
      return () => clearTimeout(timer);
    }
  }, [progressPercent, userInput]);

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-950/30 via-black/40 to-black/60 p-5 sm:p-6 space-y-5 shadow-xl shadow-violet-950/20">
      {/* Header Bar */}
      <div className="top-nav flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 shadow-sm">
            <Keyboard size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
                스크립팅 필사 타자 연습
              </span>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] text-violet-300 font-mono">
                Mindful Typing
              </span>
            </div>
            <p className="text-xs text-white/50">
              확언 문구를 직접 한 글자씩 타자 치며 잠재의식에 깊이 각인하세요.
            </p>
          </div>
        </div>

        <div className="nav-actions flex items-center gap-2 self-end sm:self-auto">
          {/* Discreet Circular Progress Indicator for Current Practice Session */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-mono select-none transition-all ${
              isUpdating
                ? 'bg-amber-500/15 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-white/5 border border-white/10'
            }`}
            title={`현재 필사 연습 진행도: ${progressPercent}% (${userInput.length}/${targetText.length} 글자)`}
          >
            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
              {/* Rotating SVG Ring Layer */}
              <div
                className={`absolute inset-0 w-full h-full flex items-center justify-center ${
                  isUpdating
                    ? 'animate-progress-update-pulse'
                    : userInput.length > 0 && !isCompleted
                    ? 'animate-progress-spin-smooth'
                    : 'transition-transform duration-500'
                }`}
              >
                <svg className="w-full h-full -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray={56.54}
                    strokeDashoffset={56.54 - (56.54 * progressPercent) / 100}
                    strokeLinecap="round"
                    className="text-amber-400 transition-all duration-300"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.75))',
                    }}
                  />
                </svg>
              </div>

              {/* Upright Center Content */}
              <div className="relative z-10 flex items-center justify-center pointer-events-none">
                {progressPercent >= 100 ? (
                  <Check size={9} className="text-emerald-400 stroke-[3]" />
                ) : null}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] uppercase tracking-wide text-white/40 font-sans hidden sm:inline">
                연습
              </span>
              <span className={`font-bold transition-colors duration-300 ${isUpdating ? 'text-amber-200' : 'text-amber-300'}`}>
                {progressPercent}%
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRandomSample}
            title="다른 샘플 문구 랜덤 추천"
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1.5 transition-all cursor-pointer font-medium"
          >
            <Shuffle size={13} className="text-violet-400" />
            <span className="text-[11px]">랜덤 샘플링</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Sample Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
          {[
            { key: 'all', label: '전체 샘플' },
            { key: 'scripting', label: '✍️ 스크립팅' },
            { key: 'affirmation', label: '✨ 확언' },
            { key: 'desire', label: '🌟 소원요청' },
            { key: 'mirror', label: '🪞 거울확언' },
            { key: 'gratitude', label: '💖 감사' },
            { key: 'secret', label: '📖 명문구' },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-violet-500/25 border border-violet-500/40 text-violet-200 shadow-sm'
                  : 'bg-white/5 border border-white/5 text-white/45 hover:text-white/80 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Selected Sample Chip List */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {filteredSamples.map((s) => {
            const isCurrent = s.id === currentSample.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSample(s)}
                className={`shrink-0 max-w-xs sm:max-w-md text-left px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-violet-500/20 border-violet-400/50 text-white font-medium shadow-sm'
                    : 'bg-black/30 border-white/5 text-white/50 hover:text-white/80 hover:border-white/15'
                }`}
              >
                <Sparkles size={11} className={isCurrent ? 'text-amber-400 shrink-0' : 'text-white/20 shrink-0'} />
                <span className="break-keep break-words">{s.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Sentence Display Area with Character Highlighting */}
      <div className="relative rounded-2xl border border-white/10 bg-black/40 p-5 sm:p-6 space-y-4">
        {/* Sample Meta Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-amber-300/90">
              {currentSample.categoryLabel}
            </span>
            {currentSample.sourceLabel && (
              <span className="text-[10px] text-white/40">· {currentSample.sourceLabel}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TTSButton
              text={targetText}
              voice="Kore"
              className="text-violet-300 border-violet-500/20 text-xs py-1 px-2.5 h-auto"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </div>

        {/* Character-by-character live comparison box */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="min-h-[90px] text-lg sm:text-xl md:text-2xl font-serif leading-relaxed tracking-wide select-none cursor-text p-3 rounded-xl bg-white/[0.01] transition-all"
        >
          {targetText.split('').map((char, index) => {
            const typedChar = userInput[index];
            const isTyped = index < userInput.length;
            const isCorrect = isTyped && typedChar === char;
            const isError = isTyped && typedChar !== char;
            const isCurrentCursor = index === userInput.length && !isCompleted;

            let colorClass = 'text-white/30'; // untyped
            if (isCorrect) colorClass = 'text-amber-300 font-semibold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]';
            if (isError) colorClass = 'text-rose-400 underline decoration-rose-500/80 bg-rose-500/20 rounded px-0.5';

            return (
              <span key={index} className="relative inline">
                {isCurrentCursor && (
                  <span className="inline-block w-0.5 h-5 sm:h-6 bg-violet-400 animate-pulse align-middle mx-[-1px]" />
                )}
                <span className={colorClass}>{char}</span>
              </span>
            );
          })}
        </div>

        {/* Hidden / Transparent Real Input Element */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder={userInput ? '' : '위 문구를 보며 여기를 클릭하고 따라서 타자를 쳐보세요...'}
            disabled={isCompleted}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full rounded-xl border border-violet-500/30 bg-black/60 px-4 py-3.5 text-base sm:text-lg text-amber-200 placeholder:text-white/20 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 font-serif transition-all"
          />
          {userInput.length > 0 && !isCompleted && (
            <button
              type="button"
              onClick={handleReset}
              title="다시 입력"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/30 hover:text-white/80 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>

        {/* Real-time Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
            <span>진행률 {progressPercent}%</span>
            <span>{userInput.length} / {targetText.length} 글자</span>
          </div>
          <div className="h-2 rounded-full bg-black/40 border border-white/10 p-0.5 overflow-hidden relative shadow-inner">
            <motion.div
              className={`h-full rounded-full relative overflow-hidden ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_12px_rgba(52,211,153,0.7),0_0_20px_rgba(20,184,166,0.4)]'
                  : 'bg-gradient-to-r from-violet-500 via-amber-400 to-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.7),0_0_20px_rgba(249,115,22,0.35)]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {progressPercent > 0 && progressPercent < 100 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff,0_0_10px_rgba(245,158,11,0.9)]" />
              )}
            </motion.div>
          </div>
        </div>

        {/* Real-time Stats Meter */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-center gap-1 text-[10px] text-white/40 mb-0.5">
              <Zap size={11} className="text-amber-400" />
              <span>타속 (CPM)</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono text-amber-300">
              {cpm > 0 ? `${cpm} 타` : '0 타'}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-center gap-1 text-[10px] text-white/40 mb-0.5">
              <Target size={11} className="text-emerald-400" />
              <span>정확도</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono text-emerald-300">
              {accuracy}%
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-center gap-1 text-[10px] text-white/40 mb-0.5">
              <Clock size={11} className="text-cyan-400" />
              <span>소요 시간</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono text-cyan-300">
              {startTime ? `${Math.floor(((endTime || Date.now()) - startTime) / 1000)}초` : '0초'}
            </p>
          </div>
        </div>
      </div>

      {/* Completion Success Card */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-black/60 to-teal-950/40 p-5 space-y-4 shadow-xl shadow-emerald-950/20"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    필사 타자 연습 완주!
                    <Sparkles size={13} className="text-amber-400" />
                  </h4>
                  <p className="text-xs text-emerald-200/80 font-sans">
                    확언의 주파수가 잠재의식에 선명히 각인되었습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 font-bold">
                  {cpm} CPM · 정확도 {accuracy}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleRandomSample}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <ArrowRight size={13} />
                <span>다음 문구 도전하기</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
              >
                <RotateCcw size={12} />
                <span>다시 연습</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
