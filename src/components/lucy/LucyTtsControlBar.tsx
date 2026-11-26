import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Pause, Play, Square, Volume2 } from 'lucide-react';

export interface LucyTtsControlBarProps {
  /** Shown while Lucy is reading, loading its voice, or holding a paused reading. */
  visible: boolean;
  isLight: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  isPaused: boolean;
  /** The sentence being read right now, used as the one-line reading summary. */
  sentence?: string | null;
  sentenceIndex?: number;
  sentenceTotal?: number;
  /** Pixels from the bottom of the chat shell, so the pill floats just above the input bar. */
  bottomOffset: number;
  onTogglePause: () => void;
  onStop: () => void;
}

const SUMMARY_MAX = 26;

function summarizeReading(sentence: string): string {
  const clean = sentence.replace(/\s+/g, ' ').replace(/\[[^\]]*\]/g, ' ').trim();
  if (clean.length <= SUMMARY_MAX) return clean;
  return `${clean.slice(0, SUMMARY_MAX)}…`;
}

/**
 * Always-reachable reading controls: pause (⏸), resume (▶) and full stop (⏹).
 * It floats above the input bar so a long answer can be stopped without scrolling
 * back to the message that started the reading.
 */
export function LucyTtsControlBar({
  visible,
  isLight,
  isSpeaking,
  isLoading,
  isPaused,
  sentence,
  sentenceIndex,
  sentenceTotal,
  bottomOffset,
  onTogglePause,
  onStop,
}: LucyTtsControlBarProps) {
  const summary = sentence ? summarizeReading(sentence) : '';
  const statusLabel = isPaused ? '일시정지됨' : isLoading ? '음성 준비 중' : '낭독 중';
  const hasProgress = Boolean(
    !isPaused && !isLoading && typeof sentenceIndex === 'number' && typeof sentenceTotal === 'number'
    && sentenceTotal > 1 && sentenceIndex >= 0,
  );

  const shellClass = isLight
    ? 'border-amber-300/90 bg-white/96 text-slate-900 shadow-[0_10px_28px_rgba(146,110,60,0.22)]'
    : 'border-amber-400/45 bg-slate-950/92 text-amber-50 shadow-[0_12px_34px_rgba(0,0,0,0.6)]';

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="lucy-tts-control-anchor absolute left-1/2 z-[45] w-fit max-w-[calc(100%-10px)] -translate-x-1/2"
          style={{ bottom: bottomOffset }}
          data-lucy-tts-bar-anchor="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="region"
            aria-label="음성 낭독 컨트롤"
            data-lucy-tts-bar={isPaused ? 'paused' : isLoading ? 'loading' : 'speaking'}
            className={`lucy-tts-control-bar flex w-fit max-w-full items-center gap-1.5 rounded-full border pl-2.5 pr-1.5 py-1 backdrop-blur-xl ${shellClass}`}
          >
            {/* State: waveform while reading, held bars while paused, spinner while preparing */}
            <span aria-hidden="true" className={`flex h-4 w-4 shrink-0 items-center justify-center ${
              isPaused ? 'text-amber-600 dark:text-amber-300'
                : isLoading ? 'text-amber-600 dark:text-amber-300'
                  : 'text-amber-500 dark:text-amber-300'
            }`}>
              {isPaused ? (
                <span className="flex items-end gap-[2px]">
                  <span className="h-1.5 w-[2px] rounded-full bg-current" />
                  <span className="h-2.5 w-[2px] rounded-full bg-current" />
                  <span className="h-1.5 w-[2px] rounded-full bg-current" />
                </span>
              ) : isLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <span className="flex items-end gap-[2px]">
                  <span className="lucy-tts-wave-bar h-2 w-[2.5px] rounded-full bg-current animate-[lucyTtsWave_0.9s_ease-in-out_infinite]" />
                  <span className="lucy-tts-wave-bar h-3.5 w-[2.5px] rounded-full bg-current animate-[lucyTtsWave_0.9s_ease-in-out_infinite_0.15s]" />
                  <span className="lucy-tts-wave-bar h-2.5 w-[2.5px] rounded-full bg-current animate-[lucyTtsWave_0.9s_ease-in-out_infinite_0.3s]" />
                </span>
              )}
            </span>

            <span className="flex min-w-0 flex-col leading-tight">
              <span className="flex items-center gap-1">
                <span className={`shrink-0 text-[10px] font-black ${isLight ? 'text-amber-900' : 'text-amber-200'}`}>
                  {statusLabel}
                </span>
                {hasProgress && (
                  <span className={`shrink-0 text-[9px] font-bold tabular-nums ${isLight ? 'text-amber-700/70' : 'text-amber-200/70'}`}>
                    {(sentenceIndex ?? 0) + 1}/{sentenceTotal}
                  </span>
                )}
              </span>
              {summary && (
                <span
                  className={`max-w-[150px] truncate text-[9px] sm:max-w-[260px] sm:text-[10px] ${
                    isLight ? 'text-slate-500' : 'text-white/70'
                  }`}
                  title={summary}
                >
                  {summary}
                </span>
              )}
            </span>

            <div className="ml-0.5 flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={onTogglePause}
                data-lucy-tts-toggle={isPaused ? 'resume' : 'pause'}
                aria-label={isPaused ? '이어듣기' : '음성 일시정지'}
                title={isPaused ? '이어듣기' : '일시정지'}
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all active:scale-90 cursor-pointer ${
                  isLight
                    ? 'border-amber-400/70 bg-amber-100 text-amber-900 hover:bg-amber-200'
                    : 'border-amber-400/50 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30'
                }`}
              >
                {isPaused ? <Play size={12} className="fill-current" /> : <Pause size={12} className="fill-current" />}
              </button>
              <button
                type="button"
                onClick={onStop}
                data-lucy-tts-stop="true"
                aria-label="음성 완전히 멈추기"
                title="멈춤"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white transition-all hover:bg-amber-700 active:scale-90 cursor-pointer shadow-2xs"
              >
                <Square size={11} className="fill-current" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Small inline marker used by message bubbles while their own reading is held. */
export function LucyTtsPausedBadge({ isLight }: { isLight: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
      <Volume2 size={12} className="opacity-70" />
      <span className="text-[11px] font-bold">일시정지됨</span>
    </span>
  );
}
