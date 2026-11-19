import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type LucyDayPeriod = 'morning' | 'day' | 'night' | string;

interface LucyPlusEntryScreenProps {
  /** Becomes true when Lucy switches into Lucy Plus (the screen unfolds). */
  active: boolean;
  period: LucyDayPeriod;
}

const VISIBLE_MS = 1100;

/**
 * Lucy Plus entry screen. Lives inside the Lucy chat shell, so it covers only
 * the Lucy pane (never the content pane or navigation), follows Lucy's own
 * day/night palette, and never intercepts input.
 */
export function LucyPlusEntryScreen({ active, period }: LucyPlusEntryScreenProps) {
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);
  const wasActive = useRef(active);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (active && !wasActive.current) setRun(value => value + 1);
    wasActive.current = active;
  }, [active]);

  useEffect(() => {
    if (!run) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 500 : VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [run, reduceMotion]);

  const night = period === 'night';
  const palette = night
    ? { bg: 'radial-gradient(circle at 50% 40%, #12324a 0%, #0b1730 48%, #050914 100%)', title: '#f8fafc', sub: 'rgba(204,251,241,0.82)', ring: 'rgba(94,234,212,0.55)', glow: 'rgba(45,212,191,0.28)', track: 'rgba(255,255,255,0.12)' }
    : { bg: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #eefbf8 45%, #dff2f7 100%)', title: '#0f172a', sub: 'rgba(15,118,110,0.85)', ring: 'rgba(20,184,166,0.5)', glow: 'rgba(45,212,191,0.24)', track: 'rgba(15,118,110,0.12)' };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`lucy-plus-entry-${run}`}
          role="status"
          aria-label="Lucy Plus 준비 중"
          data-testid="lucy-plus-entry"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.03 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: 'easeOut' }}
          className="absolute inset-0 z-[60] flex items-center justify-center overflow-hidden pointer-events-none select-none"
          style={{ background: palette.bg }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute rounded-full"
            style={{ width: 300, height: 300, background: `radial-gradient(circle, ${palette.glow} 0%, transparent 68%)` }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: reduceMotion ? 1 : [0.6, 1.08, 1], opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          <div className="relative flex flex-col items-center text-center px-6">
            {/* Two orbits joining: one screen becomes two */}
            <div className="relative w-24 h-24 mb-5">
              {[0, 1].map(index => (
                <motion.span
                  key={index}
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 w-14 h-14 -mt-7 -ml-7 rounded-full"
                  style={{ border: `2px solid ${palette.ring}`, boxShadow: `0 0 18px ${palette.glow}` }}
                  initial={{ x: index === 0 ? -14 : 14, opacity: 0 }}
                  animate={{ x: index === 0 ? [-14, -9] : [14, 9], opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
              <motion.span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -mt-[13px] -ml-[13px] w-[26px] h-[26px] rounded-full flex items-center justify-center text-[17px] font-black text-white"
                style={{ background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)', boxShadow: '0 4px 14px rgba(14,165,233,0.45)' }}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.5, delay: 0.35, ease: 'backOut' }}
              >+</motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
            >
              <p className="text-[24px] font-black tracking-tight" style={{ color: palette.title }}>
                Lucy <span className="bg-gradient-to-r from-teal-400 to-sky-500 bg-clip-text text-transparent">Plus</span>
              </p>
              <p className="mt-1.5 text-[13px] font-medium break-keep" style={{ color: palette.sub }}>두 화면으로 더 넓게 대화해요</p>
            </motion.div>

            <div className="mt-5 w-36 h-[3px] rounded-full overflow-hidden" style={{ background: palette.track }}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-teal-300 via-teal-400 to-sky-500"
                initial={{ width: '8%' }}
                animate={{ width: '100%' }}
                transition={{ duration: (reduceMotion ? 500 : VISIBLE_MS - 150) / 1000, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
