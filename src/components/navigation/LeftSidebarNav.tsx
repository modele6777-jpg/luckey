import { createPortal } from 'react-dom';
import './menu-refined.css';
import { CHANNEL_MENU_ICONS } from '@/lib/channelMenuIcons';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  Sparkles,
  KeyRound,
  User,
  Library,
  BookOpen,
  Compass,
  Clover,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import {
  LPRecordDisc,
  getBgmPublicState,
  type BgmPublicState,
} from '@/components/trinity/BgMusicPlayer';
import { unlockAudioPlayback } from '@/lib/audio';

export interface NavItemConfig {
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string;
  subLabel: string;
  color: string;
  isMainChat?: boolean;
  isKey?: boolean;
  isPrologue?: boolean;
}

// 1. Core Sanctuary Channels (AI 가이드 & 마음약방 & 럭키 7대 채널)
export const CORE_CHANNELS: NavItemConfig[] = [
  {
    path: '/',
    icon: Sparkles,
    label: 'Lucy',
    subLabel: '나를 이해하는 대화',
    color: 'oklch(0.70 0.20 300)',
    isMainChat: true,
  },
  {
    path: '/key',
    icon: KeyRound,
    label: 'KEY',
    subLabel: '개운(開運) 리추얼 & 운기 노트',
    color: 'oklch(0.72 0.18 160)',
    isKey: true,
  },
];

// 2. 7 Prismatic Journey Channels (7대 프리즘 여정)
export const PRISM_CHANNELS: NavItemConfig[] = [
  {
    path: '/prologue',
    icon: CHANNEL_MENU_ICONS.prologue,
    label: 'PROLOGUE',
    subLabel: '서막 · 비전의 시작',
    color: '#ef4444',
    isPrologue: true,
  },
  {
    path: '/orange',
    icon: CHANNEL_MENU_ICONS.orange,
    label: 'ORANGE',
    subLabel: '마음챙김 & 소원부적',
    color: '#f97316',
  },
  {
    path: '/trinity',
    icon: CHANNEL_MENU_ICONS.trinity,
    label: 'TRINITY',
    subLabel: '트리니티 오라클 타로',
    color: '#fbbf24',
  },
  {
    path: '/heal',
    icon: CHANNEL_MENU_ICONS.heal,
    label: 'AURA',
    subLabel: '세도나 치유 & 명상',
    color: '#10b981',
  },
  {
    path: '/bluebird',
    icon: CHANNEL_MENU_ICONS.bluebird,
    label: 'BLUEBIRD',
    subLabel: '파랑새 호오포노포노',
    color: '#0ea5e9',
  },
  {
    path: '/muse',
    icon: CHANNEL_MENU_ICONS.muse,
    label: 'MUSE',
    subLabel: '시와 예술 갤러리',
    color: '#6366f1',
  },
  {
    path: '/epilogue',
    icon: CHANNEL_MENU_ICONS.epilogue,
    label: 'EPILOGUE',
    subLabel: '에필로그 & 통합 일기',
    color: '#a855f7',
  },
];

const LUCY_SUBPATHS = ['/', '/chat', '/lucy'];
const KEY_SUBPATHS = ['/key', '/calm', '/orb', '/gateway', '/crystal'];
const PROLOGUE_SUBPATHS = ['/prologue', '/universe', '/ecpr', '/todo', '/mission', '/synergy', '/aegis'];
const EPILOGUE_SUBPATHS = ['/epilogue', '/profile', '/chronicle'];

// 3. Auxiliary Channels with dedicated identities
export const AUXILIARY_CHANNELS: NavItemConfig[] = [
  {
    path: '/library',
    icon: Library,
    label: 'LIBRARY',
    subLabel: '통합 아카이브 기록관',
    color: '#06b6d4',
  },
  {
    path: '/rebible',
    icon: BookOpen,
    label: 'REBIBLE',
    subLabel: '리바이블 지혜 성전',
    color: '#eab308',
  },
  {
    path: '/handbook',
    icon: BookOpen,
    label: 'HANDBOOK',
    subLabel: '리바이블 핸드북',
    color: '#eab308',
  },
  {
    path: '/omniwarp',
    icon: Compass,
    label: 'BIGBANG',
    subLabel: '옴니워프 & 빅뱅 내비게이션',
    color: '#ec4899',
  },
  {
    path: '/bigbang',
    icon: Compass,
    label: 'BIGBANG',
    subLabel: '빅뱅 보이스 & 옴니워프',
    color: '#ec4899',
  },
];

export default function LeftSidebarNav() {
  const [isChannelsOpen, setIsChannelsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const cleanPath = location ? location.split('?')[0].split('#')[0] : '/';
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();

  // Sidebar LP BGM Button State & Long-Press Handlers
  const [bgmState, setBgmState] = useState<BgmPublicState>(() => getBgmPublicState());
  const [isBgmHolding, setIsBgmHolding] = useState(false);
  const bgmHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isBgmHoldTriggeredRef = useRef(false);
  const bgmHoldStartPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleBgmStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<BgmPublicState>;
      if (customEvent.detail) {
        setBgmState((prev) => ({
          ...prev,
          ...customEvent.detail,
        }));
      }
    };

    window.addEventListener('prism:bgm_state_change', handleBgmStateChange);
    window.dispatchEvent(new CustomEvent('prism:request_bgm_state'));
    return () => {
      window.removeEventListener('prism:bgm_state_change', handleBgmStateChange);
    };
  }, []);


  useEffect(() => {
    return () => {
      if (bgmHoldTimerRef.current) {
        clearTimeout(bgmHoldTimerRef.current);
      }
    };
  }, []);

  const clearBgmHoldTimer = useCallback(() => {
    if (bgmHoldTimerRef.current) {
      clearTimeout(bgmHoldTimerRef.current);
      bgmHoldTimerRef.current = null;
    }
    setIsBgmHolding(false);
  }, []);

  const handleBgmPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isBgmHoldTriggeredRef.current = false;
    bgmHoldStartPosRef.current = { x: e.clientX, y: e.clientY };
    setIsBgmHolding(true);

    if (bgmHoldTimerRef.current) {
      clearTimeout(bgmHoldTimerRef.current);
    }

    bgmHoldTimerRef.current = setTimeout(() => {
      isBgmHoldTriggeredRef.current = true;
      setIsBgmHolding(false);
      bgmHoldTimerRef.current = null;
      triggerHaptic('mirrorhole');
      window.dispatchEvent(new CustomEvent('prism:open_bgm_menu'));
    }, 450);
  }, []);

  const handleBgmPointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!bgmHoldStartPosRef.current || !bgmHoldTimerRef.current) return;
      const dx = Math.abs(e.clientX - bgmHoldStartPosRef.current.x);
      const dy = Math.abs(e.clientY - bgmHoldStartPosRef.current.y);
      if (dx > 10 || dy > 10) {
        clearBgmHoldTimer();
      }
    },
    [clearBgmHoldTimer]
  );

  const handleBgmPointerUp = useCallback(() => {
    clearBgmHoldTimer();
  }, [clearBgmHoldTimer]);

  const handleBgmClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isBgmHoldTriggeredRef.current) {
      isBgmHoldTriggeredRef.current = false;
      return;
    }
    triggerHaptic('whitehole');
    unlockAudioPlayback();
    window.dispatchEvent(new CustomEvent('prism:toggle_bgm'));
  }, []);

  const handleBgmContextMenu = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Only prevent native mobile/browser context menu during hold; popup opens strictly via long-press
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isLucyActive = LUCY_SUBPATHS.some(
    (p) => cleanPath === p || (p !== '/' && cleanPath.startsWith(p + '/'))
  );

  const isKeyActive = KEY_SUBPATHS.some(
    (p) => cleanPath === p || cleanPath.startsWith(p + '/')
  );

  const isPrologueActive = PROLOGUE_SUBPATHS.some(
    (p) => cleanPath === p || cleanPath.startsWith(p + '/')
  );

  const isEpilogueActive = EPILOGUE_SUBPATHS.some(
    (p) => cleanPath === p || cleanPath.startsWith(p + '/')
  );

  // Keep LP widgets informed that navigation is permanently visible.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('left-sidebar-state', { detail: { isOpen: true } }));
    return () => {
      window.dispatchEvent(new CustomEvent('left-sidebar-state', { detail: { isOpen: false } }));
    };
  }, []);

  const handleNavigate = (path: string) => {
    const isTargetActive =
      path === '/'
        ? isLucyActive
        : path === '/key'
        ? isKeyActive
        : path === '/prologue'
        ? isPrologueActive
        : cleanPath === path || cleanPath.startsWith(path + '/');

    if (typeof window !== 'undefined') {
      (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
    }
    if (!isTargetActive) {
      navigate(path);
    }
    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path } }));
  };

  const isLight = resolvedTheme === 'light';

  const renderNavButton = ({ path, icon: Icon, label, isMainChat, isKey, isPrologue }: NavItemConfig) => {
    const isActive = isMainChat ? isLucyActive : isKey ? isKeyActive : isPrologue ? isPrologueActive
      : path === '/epilogue' ? isEpilogueActive : cleanPath === path || cleanPath.startsWith(path + '/');
    return (
      <button key={path} type="button" className="refined-nav-item" data-active={isActive}
        aria-label={label} title={label} aria-current={isActive ? 'page' : undefined}
        onClick={() => handleNavigate(path)}>
        <Icon size={22} aria-hidden="true" />
      </button>
    );
  };

  return createPortal(
    <aside
      id="main-sidebar-navigation"
      role="navigation"
      aria-label="사이드 네비게이션"
      data-theme={isLight ? 'light' : 'dark'}
      className="sites-pinned-sidebar z-[398] flex flex-col select-none border-l"
    >
              <div className="refined-menu-list flex-1 overflow-y-auto no-scrollbar">
                <div className="refined-menu-content">
                  {CORE_CHANNELS.map(renderNavButton)}
                  <button
                    type="button"
                    className="refined-nav-item"
                    data-active={isChannelsOpen || PRISM_CHANNELS.some(({ path }) => cleanPath === path)}
                    aria-label={isChannelsOpen ? '7대 프리즘 채널 접기' : '7대 프리즘 채널 펼치기'}
                    aria-expanded={isChannelsOpen}
                    aria-controls={isChannelsOpen ? 'prism-channel-icons' : undefined}
                    title="7대 프리즘 채널"
                    onClick={() => setIsChannelsOpen((open) => !open)}
                  >
                    <Clover size={22} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {isChannelsOpen && (
                      <motion.div
                        id="prism-channel-icons"
                        className="refined-prism-icons"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.2 }}
                      >
                        {PRISM_CHANNELS.map(renderNavButton)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="refined-menu-footer">
                {/* LP Background Music Button (Click: Play/Pause, Long-Press: LP Player Detail Popup) */}
                <div className="relative group w-10 h-10 shrink-0 flex items-center justify-center">
                  {/* Soundwave Ripple & Floating Musical Notes when Playing */}
                  <AnimatePresence>
                    {bgmState.isPlaying && !bgmState.isBuffering && (
                      <>
                        {/* Soft expanding soundwave pulse ring */}
                        <motion.span
                          key="bgm-wave-ring"
                          initial={{ scale: 0.9, opacity: 0.55 }}
                          animate={{ scale: [0.95, 1.28, 1.38], opacity: [0.5, 0.22, 0] }}
                          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeOut' }}
                          className="absolute inset-0 rounded-xl border border-amber-400/60 pointer-events-none"
                        />
                        {/* Floating Note 1 (♪) */}
                        <motion.span
                          key="bgm-note-1"
                          initial={{ opacity: 0, y: 2, x: -6, scale: 0.7 }}
                          animate={{
                            opacity: [0, 0.95, 0],
                            y: [2, -14, -22],
                            x: [-5, -9, -6],
                            scale: [0.75, 1, 0.85],
                          }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                          className={`absolute -top-1 left-1 text-[9px] font-bold pointer-events-none select-none z-20 ${
                            isLight
                              ? 'text-amber-600 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]'
                              : 'text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]'
                          }`}
                        >
                          ♪
                        </motion.span>
                        {/* Floating Note 2 (♫) */}
                        <motion.span
                          key="bgm-note-2"
                          initial={{ opacity: 0, y: 2, x: 6, scale: 0.7 }}
                          animate={{
                            opacity: [0, 0.9, 0],
                            y: [2, -13, -21],
                            x: [5, 9, 6],
                            scale: [0.7, 0.95, 0.8],
                          }}
                          transition={{
                            duration: 2.4,
                            delay: 1.15,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className={`absolute -top-1 right-0.5 text-[8.5px] font-bold pointer-events-none select-none z-20 ${
                            isLight
                              ? 'text-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.45)]'
                              : 'text-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.85)]'
                          }`}
                        >
                          ♫
                        </motion.span>
                      </>
                    )}
                  </AnimatePresence>

                  {/* Long-Press Hold Progress SVG Ring (450ms) */}
                  {isBgmHolding && (
                    <svg
                      className="absolute -inset-1 w-12 h-12 -rotate-90 pointer-events-none z-30"
                      viewBox="0 0 48 48"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="42"
                        height="42"
                        rx="13"
                        fill="none"
                        stroke="rgba(251, 191, 36, 0.95)"
                        strokeWidth="2.5"
                        strokeDasharray="145"
                        className="animate-lp-hold drop-shadow-[0_0_8px_rgba(251,191,36,0.85)]"
                      />
                    </svg>
                  )}

                  <button
                    type="button"
                    onPointerDown={handleBgmPointerDown}
                    onPointerMove={handleBgmPointerMove}
                    onPointerUp={handleBgmPointerUp}
                    onPointerLeave={handleBgmPointerUp}
                    onPointerCancel={handleBgmPointerUp}
                    onClick={handleBgmClick}
                    onContextMenu={handleBgmContextMenu}
                    aria-label={
                      bgmState.isPlaying
                        ? '배경음 일시정지 (길게 누르면 LP 상세 설정)'
                        : '배경음 재생 (길게 누르면 LP 상세 설정)'
                    }
                    title="클릭: 배경음 재생/일시정지 · 길게 누르기: LP 상세 설정"
                    className={`relative w-full h-full rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer select-none overflow-hidden ${
                      isBgmHolding ? 'scale-92' : 'hover:scale-105 active:scale-95'
                    } ${
                      bgmState.isPlaying
                        ? isLight
                          ? 'bg-gradient-to-br from-amber-500/25 via-amber-400/15 to-rose-500/20 border-amber-500/80 shadow-[0_0_16px_rgba(245,158,11,0.38)]'
                          : 'bg-gradient-to-br from-amber-500/25 via-neutral-900 to-rose-500/20 border-amber-400/75 shadow-[0_0_18px_rgba(251,191,36,0.45)]'
                        : isLight
                        ? 'bg-amber-900/[0.06] border-amber-900/20 hover:border-amber-600/50 hover:bg-amber-500/15'
                        : 'bg-white/[0.05] border-white/15 hover:border-amber-400/50 hover:bg-white/[0.1]'
                    }`}
                  >
                    {/* Mini LP Vinyl Disc Icon */}
                    <LPRecordDisc
                      isPlaying={bgmState.isPlaying}
                      isBuffering={bgmState.isBuffering}
                      size="sm"
                      className="pointer-events-none"
                    />

                    {/* Playing Status Micro LED Dot */}
                    <span
                      className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full pointer-events-none transition-all duration-300 ${
                        bgmState.isPlaying
                          ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse'
                          : isLight
                          ? 'bg-slate-400/60'
                          : 'bg-white/25'
                      }`}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  className="refined-nav-item"
                  data-active={cleanPath === '/profile'}
                  aria-current={cleanPath === '/profile' ? 'page' : undefined}
                  aria-label="내 프로필"
                  title="내 프로필"
                  onClick={() => {
                    try {
                      sessionStorage.setItem('prism_target_tab', 'profile');
                      window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: 'profile' } }));
                    } catch (_) {}
                    handleNavigate('/profile');
                  }}
                >
                  <User size={22} aria-hidden="true" />
                </button>
              </div>
    </aside>, document.body
  );
}
