import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BigBangEffectPortal } from './BigBangEffectPortal';

/** Routes that render the Key channel (CalmApp). */
const KEY_ALIASES = ['/key', '/calm', '/orb', '/gateway', '/crystal', '/pharmacy'] as const;
export function isKeyChannelPath(path: string): boolean {
  const clean = path.split(/[?#]/)[0] || '/';
  return KEY_ALIASES.some(alias => clean === alias || clean.startsWith(`${alias}/`));
}

const MIN_VISIBLE_MS = 900;
const MAX_VISIBLE_MS = 2600;
const ACTIVE_FLAG = 'keyTransition';

/** The Key iframe has finished loading (already mounted panes stay loaded). */
function isKeyFrameReady(): boolean {
  const frame = document.querySelector<HTMLIFrameElement>('iframe[title="Key"]');
  try { return frame?.contentDocument?.readyState === 'complete'; } catch { return false; }
}

/** True while the Key entry screen is showing; CalmApp then skips its own loader. */
export function isKeyChannelTransitionActive(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset[ACTIVE_FLAG] === 'active';
}

/**
 * Dedicated loading screen for entering the Key channel from any other screen
 * (Big Bang double tap / hold, menu, links). It uses Key's own warm paper
 * palette, stays inside the content canvas (never over Lucy or navigation),
 * and is visual-only: it never intercepts input.
 */
export function KeyChannelTransition() {
  const [location] = useLocation();
  const previous = useRef<string | null>(null);
  const [run, setRun] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const before = previous.current;
    previous.current = location;
    if (before === null) return; // first paint: CalmApp shows its own loader
    if (isKeyChannelPath(location) && !isKeyChannelPath(before)) setRun(value => value + 1);
  }, [location]);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!run) return;
    setVisible(true);
    document.documentElement.dataset[ACTIVE_FLAG] = 'active';
    const startedAt = Date.now();
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      setVisible(false);
      delete document.documentElement.dataset[ACTIVE_FLAG];
    };
    const closeWhenReady = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      window.setTimeout(close, wait);
    };
    const onMessage = (event: MessageEvent) => {
      const type = event.data?.type;
      if (type === 'CALM_FRAME_READY' || type === 'CALM_READY') closeWhenReady();
    };
    window.addEventListener('message', onMessage);
    const poll = window.setInterval(() => { if (isKeyFrameReady()) { window.clearInterval(poll); closeWhenReady(); } }, 120);
    const cap = window.setTimeout(close, MAX_VISIBLE_MS);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearInterval(poll);
      window.clearTimeout(cap);
      if (!closed) delete document.documentElement.dataset[ACTIVE_FLAG];
    };
  }, [run]);

  return (
    <BigBangEffectPortal zIndex={9998}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key={`key-entry-${run}`}
            role="status"
            aria-label="Key 채널을 여는 중"
            data-testid="key-channel-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.04 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden select-none"
            style={{ background: 'radial-gradient(circle at 50% 42%, #fffaf3 0%, #fcf9f5 46%, #f3e7da 100%)', color: '#3b2f2a' }}
          >
            {/* Soft copper glow behind the emblem */}
            <motion.div
              aria-hidden="true"
              className="absolute rounded-full"
              style={{ width: 280, height: 280, background: 'radial-gradient(circle, rgba(224,159,125,0.32) 0%, rgba(224,159,125,0) 68%)' }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: reduceMotion ? 1 : [0.6, 1.05, 1], opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />

            <div className="relative flex flex-col items-center text-center px-6">
              {/* Lock ring with a key that turns open */}
              <div className="relative w-24 h-24 flex items-center justify-center mb-5">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{ border: '1.5px solid rgba(201,128,92,0.55)', boxShadow: '0 10px 30px rgba(160,98,66,0.16), inset 0 0 18px rgba(255,255,255,0.8)', background: 'rgba(255,253,249,0.85)' }}
                  initial={{ scale: 0.82, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                {!reduceMotion && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{ border: '1px solid rgba(224,159,125,0.7)' }}
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 1.7], opacity: [0, 0.75, 0] }}
                    transition={{ duration: 1.1, delay: 0.55, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.3 }}
                  />
                )}
                <motion.svg
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  className="relative w-12 h-12"
                  initial={{ rotate: -90, opacity: 0, y: 6 }}
                  animate={{ rotate: 0, opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                >
                  <defs>
                    <linearGradient id="key-entry-copper" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f3b899" />
                      <stop offset="55%" stopColor="#d48a62" />
                      <stop offset="100%" stopColor="#a8623e" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="15" r="8" fill="none" stroke="url(#key-entry-copper)" strokeWidth="3" />
                  <circle cx="24" cy="15" r="2.6" fill="#a8623e" />
                  <path d="M24 23 V40 M24 33 H30 M24 38 H29" stroke="url(#key-entry-copper)" strokeWidth="3" strokeLinecap="round" fill="none" />
                </motion.svg>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              >
                <p className="text-[22px] font-semibold tracking-[0.42em] pl-[0.42em]" style={{ color: '#7a4a33' }}>KEY</p>
                <p className="mt-2 text-[13px] font-medium break-keep" style={{ color: '#6b5a50' }}>막힌 운의 문을 여는 중이에요</p>
              </motion.div>

              {/* Copper progress line */}
              <div className="mt-5 w-36 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(168,98,62,0.14)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #f3b899, #d48a62, #a8623e)' }}
                  initial={{ width: '8%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: MIN_VISIBLE_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BigBangEffectPortal>
  );
}
