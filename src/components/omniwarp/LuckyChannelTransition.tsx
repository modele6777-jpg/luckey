import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BigBangEffectPortal } from './BigBangEffectPortal';
import { isKeyChannelPath } from './KeyChannelTransition';
import { isLucyThemeRoute } from '@/lib/lucyDayTheme';
import { resolveChannelThemeFromPath } from '@/contexts/ThemeContext';
import { PRISM_CHANNELS } from '@/components/navigation/LeftSidebarNav';

const MIN_VISIBLE_MS = 950;
const MAX_VISIBLE_MS = 2400;

function cleanPath(path: string): string {
  return (path.split(/[?#]/)[0] || '/').toLowerCase();
}

// Prologue hub aliases render the same Lucky channel (HubHome).
const PROLOGUE_ALIASES = ['/universe', '/ecpr', '/todo', '/mission', '/synergy', '/aegis'];

function matchLuckyChannel(path: string) {
  const clean = cleanPath(path);
  const normalized = PROLOGUE_ALIASES.some(alias => clean === alias || clean.startsWith(`${alias}/`)) ? '/prologue' : clean;
  return PRISM_CHANNELS.find(item => normalized === item.path || normalized.startsWith(`${item.path}/`)) ?? null;
}

/** Lucky channels: the 7 dark-sky prism channels (never Lucy, Key, profile or library). */
export function isLuckyChannelPath(path: string): boolean {
  const clean = cleanPath(path);
  if (isLucyThemeRoute(clean) || isKeyChannelPath(clean)) return false;
  return Boolean(matchLuckyChannel(clean)) && resolveChannelThemeFromPath(clean) === 'dark';
}

/** 마이페이지(프로필). 루시·키 채널에서 들어갈 때도 같은 로딩 화면을 보여 준다. */
export function isProfilePath(path: string): boolean {
  const clean = cleanPath(path);
  return clean === '/profile' || clean.startsWith('/profile/');
}

function isLuckyHubPath(path: string): boolean {
  const clean = cleanPath(path);
  return clean === '/lucky' || clean.startsWith('/lucky/');
}

function channelInfo(path: string) {
  if (isProfilePath(path)) {
    return { kicker: 'MY', label: 'MY PAGE', subLabel: '마이페이지 · 내 프로필과 기록', color: '#a855f7' };
  }
  if (isLuckyHubPath(path)) {
    return { kicker: 'LUCKEY', label: 'Luckey', subLabel: '7대 차원 DApp 채널', color: '#34d399' };
  }
  const match = matchLuckyChannel(path);
  return {
    kicker: 'LUCKY',
    label: match?.label || 'LUCKY',
    subLabel: match?.subLabel || '럭키 채널',
    color: match?.color || '#34d399',
  };
}

const STARS = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: i % 5 === 0 ? 2 : 1,
  delay: (i % 9) * 0.18,
}));

/**
 * Loading screen for entering a Lucky channel (or My Page) from Lucy chat or the Key channel.
 * It uses the Lucky night-sky palette and the channel's own colour, stays inside
 * the content canvas (never over Lucy or navigation) and is visual-only.
 */
export function LuckyChannelTransition() {
  const [location] = useLocation();
  const previous = useRef<string | null>(null);
  const [run, setRun] = useState(0);
  const [target, setTarget] = useState('/');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const before = previous.current;
    previous.current = location;
    if (before === null) return; // first paint: the page's own loader handles it
    const fromLucyOrKey = isLucyThemeRoute(cleanPath(before)) || isKeyChannelPath(before);
    const enteringHub = isLuckyHubPath(location) && !isLuckyHubPath(before);
    if (enteringHub || (fromLucyOrKey && (isLuckyChannelPath(location) || isProfilePath(location)))) {
      setTarget(location);
      setRun(value => value + 1);
    }
  }, [location]);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!run) return;
    setVisible(true);
    const startedAt = Date.now();
    let closed = false;
    const close = () => { if (!closed) { closed = true; setVisible(false); } };
    // The channel is ready once its page content has painted.
    const poll = window.setInterval(() => {
      const content = document.querySelector('.channel-page-content');
      if (content && content.childElementCount > 0 && Date.now() - startedAt >= MIN_VISIBLE_MS) {
        window.clearInterval(poll);
        close();
      }
    }, 120);
    const cap = window.setTimeout(close, MAX_VISIBLE_MS);
    return () => { window.clearInterval(poll); window.clearTimeout(cap); };
  }, [run]);

  const info = useMemo(() => channelInfo(target), [target]);

  return (
    <BigBangEffectPortal zIndex={9998}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key={`lucky-entry-${run}`}
            role="status"
            aria-label={info.kicker === 'MY' ? '마이페이지를 여는 중' : isLuckyHubPath(target) ? 'Luckey를 여는 중' : `${info.label} 채널을 여는 중`}
            data-testid="lucky-channel-transition"
            data-lucky-channel={info.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.05 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden select-none"
            style={{ background: 'radial-gradient(ellipse at 50% 38%, #12233f 0%, #0a1226 48%, #050811 100%)', color: '#f8fafc' }}
          >
            {/* Lucky night sky */}
            {STARS.map((star, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="absolute rounded-full bg-white"
                style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size }}
                initial={{ opacity: 0.2 }}
                animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.2, 0.9, 0.3] }}
                transition={{ duration: 1.6, delay: star.delay, repeat: Infinity }}
              />
            ))}
            {/* Aurora ribbon in the channel colour */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-[-20%] top-[18%] h-40 blur-3xl"
              style={{ background: `linear-gradient(100deg, transparent 10%, ${info.color}55 40%, #34d39944 60%, transparent 90%)` }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: reduceMotion ? 0 : 30 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
            />

            <div className="relative flex flex-col items-center text-center px-6">
              <div className="relative w-24 h-24 flex items-center justify-center mb-5">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1.5px solid ${info.color}99`, boxShadow: `0 0 34px ${info.color}55, inset 0 0 18px rgba(255,255,255,0.08)`, background: 'rgba(10,18,38,0.7)' }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                {!reduceMotion && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1px solid ${info.color}` }}
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 1.75], opacity: [0, 0.7, 0] }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.2 }}
                  />
                )}
                {/* Four-leaf clover unfolding */}
                <motion.svg
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  className="relative w-12 h-12"
                  initial={{ rotate: -120, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0.1 : 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                >
                  <defs>
                    <linearGradient id="lucky-entry-leaf" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#a7f3d0" />
                      <stop offset="60%" stopColor="#34d399" />
                      <stop offset="100%" stopColor={info.color} />
                    </linearGradient>
                  </defs>
                  {[0, 90, 180, 270].map(angle => (
                    <path
                      key={angle}
                      d="M24 24 C18 22 14 16 17 12 C20 8 24 11 24 15 C24 11 28 8 31 12 C34 16 30 22 24 24 Z"
                      transform={`rotate(${angle} 24 24)`}
                      fill="url(#lucky-entry-leaf)"
                      fillOpacity="0.9"
                    />
                  ))}
                  <circle cx="24" cy="24" r="2.4" fill="#fef9c3" />
                </motion.svg>
              </div>

              <motion.p
                className="text-[11px] font-bold tracking-[0.35em] text-emerald-200/80"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >{info.kicker}</motion.p>
              <motion.p
                className="mt-1 text-2xl font-black tracking-wide"
                style={{ color: '#ffffff', textShadow: `0 0 18px ${info.color}aa` }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.22 }}
              >{info.label}</motion.p>
              <motion.p
                className="mt-1.5 text-xs text-slate-300 break-keep"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.32 }}
              >{info.subLabel}</motion.p>
              <div className="mt-5 flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: info.color }}
                    animate={reduceMotion ? { opacity: 0.8 } : { opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                    transition={{ duration: 0.9, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BigBangEffectPortal>
  );
}
