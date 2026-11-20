import { AnimatePresence, motion } from 'motion/react';
import { useTTSState } from '@/utils/tts';

/** While Lucy reads aloud, the unfolded table shows only the sentence being spoken, large. */
export function MasterReadingStage() {
  const tts = useTTSState();
  const sentence = (tts.activeSentence || tts.currentSentence || '').trim();
  const index = tts.activeSentenceIndex ?? -1;
  const total = tts.totalSentences ?? 0;
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 text-center" data-master-reading-stage>
      <motion.div
        aria-hidden="true"
        className="mb-5 h-14 w-14 rounded-full"
        style={{ background: 'radial-gradient(circle at 35% 35%, #fff7d6, #c084fc 55%, #6d28d9 100%)', boxShadow: '0 0 30px rgba(192,132,252,0.55)' }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={`${index}-${sentence.slice(0, 24)}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="max-w-md text-[19px] font-semibold leading-relaxed text-white break-keep"
          style={{ textShadow: '0 2px 18px rgba(124,58,237,0.55)' }}
        >
          {sentence || '루시가 읽을 준비를 하고 있어요…'}
        </motion.p>
      </AnimatePresence>
      {total > 0 && index >= 0 && (
        <p className="mt-4 text-[11px] tabular-nums text-violet-200/80">{index + 1} / {total}</p>
      )}
    </div>
  );
}
