import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  Sun,
  Sparkles,
  Music,
  TreeDeciduous,
  Bird,
  Activity,
  Moon,
  ChevronLeft,
  Clover,
  KeyRound,
  User,
  Library,
  BookOpen,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { APP_VERSION } from '@/lib/appVersion';
import {
  peekNextRecommendedMenuByCycle,
  resetActiveContextPeek,
  type ContextNextMenuResult,
} from '@/lib/omniWarp/contextNavCycleEngine';
import {
  LPRecordDisc,
  getBgmPublicState,
  type BgmPublicState,
} from '@/components/trinity/BgMusicPlayer';
import { unlockAudioPlayback } from '@/lib/audio';

const APP_ID_TO_PRISM_PATH: Record<string, string> = {
  hub: '/prologue',
  orange: '/orange',
  trinity: '/trinity',
  heal: '/heal',
  bluebird: '/bluebird',
  muse: '/muse',
  epilogue: '/epilogue',
};

export interface NavItemConfig {
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  label: string;
  subLabel: string;
  color: string;
  isMainChat?: boolean;
  isKey?: boolean;
  isPrologue?: boolean;
  isLuckey?: boolean;
}

// 1. Core Sanctuary Channels (AI 가이드 & 마음약방 & 럭키 7대 채널)
export const CORE_CHANNELS: NavItemConfig[] = [
  {
    path: '/',
    icon: Sparkles,
    label: 'LUCY',
    subLabel: '루시 AI · 영혼의 대화',
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
  {
    path: '#luckey',
    icon: Clover,
    label: 'LUCKEY',
    subLabel: '7대 프리즘 채널',
    color: 'oklch(0.75 0.22 150)',
    isLuckey: true,
  },
];

// 2. 7 Prismatic Journey Channels (7대 프리즘 여정)
export const PRISM_CHANNELS: NavItemConfig[] = [
  {
    path: '/prologue',
    icon: Sun,
    label: 'PROLOGUE',
    subLabel: '서막 · 비전의 시작',
    color: '#ef4444',
    isPrologue: true,
  },
  {
    path: '/orange',
    icon: TreeDeciduous,
    label: 'ORANGE',
    subLabel: '마음챙김 & 소원부적',
    color: '#f97316',
  },
  {
    path: '/trinity',
    icon: Sparkles,
    label: 'TRINITY',
    subLabel: '트리니티 오라클 타로',
    color: '#fbbf24',
  },
  {
    path: '/heal',
    icon: Activity,
    label: 'AURA',
    subLabel: '세도나 치유 & 명상',
    color: '#10b981',
  },
  {
    path: '/bluebird',
    icon: Bird,
    label: 'BLUEBIRD',
    subLabel: '파랑새 호오포노포노',
    color: '#0ea5e9',
  },
  {
    path: '/muse',
    icon: Music,
    label: 'MUSE',
    subLabel: '시와 예술 갤러리',
    color: '#6366f1',
  },
  {
    path: '/epilogue',
    icon: Moon,
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
  const isOpen = true;
  const [, setProfileVersion] = useState(0);
  const [hoveredNavPath, setHoveredNavPath] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const cleanPath = location ? location.split('?')[0].split('#')[0] : '/';
  const { resolvedTheme } = useTheme();
  const appContext = useApp();
  const [topRecommendation, setTopRecommendation] = useState<ContextNextMenuResult | null>(null);

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
    if (isOpen) {
      setBgmState(getBgmPublicState());
      window.dispatchEvent(new CustomEvent('prism:request_bgm_state'));
    }
  }, [isOpen]);

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

  const refreshTopRecommendation = useCallback(
    (forceResetCache = false) => {
      try {
        if (forceResetCache) {
          resetActiveContextPeek();
        }
        const selText =
          typeof window !== 'undefined' ? window.getSelection()?.toString()?.trim() || '' : '';
        const res = peekNextRecommendedMenuByCycle(
          cleanPath,
          selText.length >= 2 ? selText : undefined
        );
        setTopRecommendation(res);
      } catch (err) {
        console.warn('[LeftSidebarNav] Failed to compute top recommendation:', err);
      }
    },
    [cleanPath]
  );

  useEffect(() => {
    refreshTopRecommendation(true);
  }, [cleanPath, isOpen, refreshTopRecommendation]);

  useEffect(() => {
    const handleCycleRefresh = () => refreshTopRecommendation(true);
    const handleSelectionRefresh = () => {
      if (isOpen) refreshTopRecommendation(false);
    };

    window.addEventListener('prism:context_cycle_jump', handleCycleRefresh);
    window.addEventListener('prism:dialogue_updated', handleCycleRefresh);
    window.addEventListener('prism:feature_updated', handleCycleRefresh);
    document.addEventListener('selectionchange', handleSelectionRefresh);
    return () => {
      window.removeEventListener('prism:context_cycle_jump', handleCycleRefresh);
      window.removeEventListener('prism:dialogue_updated', handleCycleRefresh);
      window.removeEventListener('prism:feature_updated', handleCycleRefresh);
      document.removeEventListener('selectionchange', handleSelectionRefresh);
    };
  }, [isOpen, refreshTopRecommendation]);

  const recommendedPrismPath = topRecommendation
    ? APP_ID_TO_PRISM_PATH[topRecommendation.stats.nextAppId] || '/trinity'
    : '/trinity';
  const recommendedPrismChannel =
    PRISM_CHANNELS.find((ch) => ch.path === recommendedPrismPath) || PRISM_CHANNELS[2];

  // Extract user profile / nickname and avatar URL for sidebar footer
  let userNickname = '제제';
  let userAvatarUrl: string | undefined = undefined;
  try {
    const { sharedState, firebaseUser } = appContext;
    const rawNick = sharedState?.userProfile?.basic?.nickname?.trim();
    const fallbackNick = getPersistentUserProfile()?.basic?.nickname?.trim();
    const chosen = rawNick || fallbackNick;
    userNickname = (chosen && chosen !== '여행자' && chosen !== '사용자' && chosen !== '박주형') ? chosen : '제제';
    userAvatarUrl = sharedState?.userProfile?.basic?.avatarUrl || getPersistentUserProfile()?.basic?.avatarUrl || firebaseUser?.photoURL || undefined;
  } catch {
    const fallbackNick = getPersistentUserProfile()?.basic?.nickname?.trim();
    userNickname = (fallbackNick && fallbackNick !== '여행자' && fallbackNick !== '사용자' && fallbackNick !== '박주형') ? fallbackNick : '제제';
    userAvatarUrl = getPersistentUserProfile()?.basic?.avatarUrl || undefined;
  }

  const isProfileActive = cleanPath === '/profile' || cleanPath.startsWith('/profile/');

  // Realtime event sync for profile edits across views
  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileVersion((v) => v + 1);
    };
    window.addEventListener('prism:profile_updated', handleProfileUpdate);
    window.addEventListener('prism:feature_updated', handleProfileUpdate);
    window.addEventListener('prism:realtime_sync', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('prism:profile_updated', handleProfileUpdate);
      window.removeEventListener('prism:feature_updated', handleProfileUpdate);
      window.removeEventListener('prism:realtime_sync', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
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

  // Check if any of the 7 PRISM channels are active
  const isAnyPrismActive = PRISM_CHANNELS.some((item) => {
    if (item.isPrologue) return isPrologueActive;
    if (item.path === '/epilogue') return isEpilogueActive;
    return cleanPath === item.path || cleanPath.startsWith(item.path + '/');
  });

  const [isChannelsOpen, setIsChannelsOpen] = useState(isAnyPrismActive);
  const channelsCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChannelsMouseEnter = useCallback(() => {
    if (channelsCloseTimeoutRef.current) {
      clearTimeout(channelsCloseTimeoutRef.current);
      channelsCloseTimeoutRef.current = null;
    }
    setIsChannelsOpen(true);
  }, []);

  const handleChannelsMouseLeave = useCallback(() => {
    if (isAnyPrismActive) return;
    if (channelsCloseTimeoutRef.current) {
      clearTimeout(channelsCloseTimeoutRef.current);
    }
    channelsCloseTimeoutRef.current = setTimeout(() => {
      setIsChannelsOpen(false);
    }, 300);
  }, [isAnyPrismActive]);

  useEffect(() => {
    return () => {
      if (channelsCloseTimeoutRef.current) {
        clearTimeout(channelsCloseTimeoutRef.current);
      }
    };
  }, []);

  // Automatically expand if navigating to any of the 7 prism channels
  useEffect(() => {
    if (isAnyPrismActive) {
      setIsChannelsOpen(true);
    }
  }, [isAnyPrismActive]);

  // Find the currently active nav item to highlight theme accent
  const allNavItems = [...CORE_CHANNELS, ...PRISM_CHANNELS];
  const activeItem =
    allNavItems.find((item) => {
      if (item.isMainChat) return isLucyActive;
      if (item.isKey) return isKeyActive;
      if (item.isLuckey) return false;
      if (item.isPrologue) return isPrologueActive;
      if (item.path === '/epilogue') return isEpilogueActive;
      return cleanPath === item.path || cleanPath.startsWith(item.path + '/');
    }) ||
    AUXILIARY_CHANNELS.find(
      (item) => cleanPath === item.path || cleanPath.startsWith(item.path + '/')
    ) ||
    CORE_CHANNELS[0];

  const ActiveNavIcon = activeItem?.icon || Clover;

  // Broadcast sidebar open/closed state so widgets like LP player can sync visibility
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('left-sidebar-state', { detail: { isOpen } }));
  }, [isOpen]);

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

  const renderNavButton = (item: NavItemConfig) => {
    const { path, icon: Icon, label, subLabel, color, isMainChat, isKey, isPrologue, isLuckey } = item;
    const isActive = isMainChat
      ? isLucyActive
      : isKey
      ? isKeyActive
      : isLuckey
      ? Boolean(isAnyPrismActive || isChannelsOpen)
      : isPrologue
      ? isPrologueActive
      : cleanPath === path || cleanPath.startsWith(path + '/');
    const isRainbow = Boolean(isMainChat || isKey || isLuckey);
    const isHovered = hoveredNavPath === path;
    const isRecommendedTop1 = !isRainbow && path === recommendedPrismPath;

    // 🌈 Special Rainbow Glowing Style for Core Sanctuary Channels (LUCY, KEY, LUCKEY)
    if (isRainbow) {
      return (
        <button
          key={path}
          type="button"
          onClick={() => {
            if (isLuckey) {
              setIsChannelsOpen((prev) => !prev);
            } else {
              handleNavigate(path);
            }
          }}
          onMouseEnter={() => {
            setHoveredNavPath(path);
            if (isLuckey) handleChannelsMouseEnter();
          }}
          onMouseLeave={() => {
            setHoveredNavPath(null);
            if (isLuckey) handleChannelsMouseLeave();
          }}
          aria-label={
            isLuckey
              ? `${label} 7대 채널 ${isChannelsOpen ? '접기' : '펼치기'} (현재 추천 1순위: ${recommendedPrismChannel.label})`
              : label
          }
          aria-expanded={isLuckey ? isChannelsOpen : undefined}
          className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer group shrink-0 ${
            isActive ? 'scale-105' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {/* Active left indicator bar */}
          {isActive && (
            <motion.div
              layoutId="active-nav-glow"
              className="absolute -left-2 top-2.5 bottom-2.5 w-1 rounded-r-full rainbow-gradient-flow shadow-[0_0_8px_rgba(255,160,120,0.8)]"
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          )}

          {/* Rainbow Conic Halo Border */}
          <div
            className={`relative w-full h-full rounded-xl overflow-hidden p-[1.5px] transition-shadow duration-300 ${
              isActive
                ? isLuckey
                  ? 'shadow-[0_0_16px_rgba(52,211,153,0.6)]'
                  : 'shadow-[0_0_16px_rgba(255,107,107,0.55)]'
                : 'group-hover:shadow-[0_0_12px_rgba(255,107,107,0.35)]'
            }`}
          >
            <div className="absolute inset-0 rainbow-fab-halo blur-[0.5px]" />
            <div
              className={`relative w-full h-full rounded-[10px] flex items-center justify-center transition-colors duration-300 ${
                isLight
                  ? isActive
                    ? isLuckey
                      ? 'bg-[#fffdf9]/95 ring-1 ring-emerald-500/40'
                      : 'bg-[#fffdf9]/95 ring-1 ring-amber-400/50'
                    : 'bg-[#fdfaf5]/92 group-hover:bg-white'
                  : isActive
                  ? isLuckey
                    ? 'bg-neutral-900/95 ring-1 ring-emerald-400/40'
                    : 'bg-neutral-900/95 ring-1 ring-white/30'
                  : 'bg-neutral-950/90 group-hover:bg-neutral-900/90'
              }`}
            >
              <Icon
                size={20}
                className={`${
                  isLuckey
                    ? isLight
                      ? 'text-emerald-600 drop-shadow-[0_0_6px_rgba(16,185,129,0.45)]'
                      : 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                    : isKey
                    ? isLight
                      ? 'text-teal-600 drop-shadow-[0_0_6px_rgba(20,184,166,0.45)]'
                      : 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]'
                    : isLight
                    ? 'text-purple-600 drop-shadow-[0_0_6px_rgba(147,51,234,0.45)]'
                    : 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]'
                } transition-transform duration-300 group-hover:scale-110 ${isLuckey ? 'group-hover:rotate-12' : ''}`}
              />
            </div>
          </div>

          {/* For LUCKEY: Clean glowing theme-color circular dot in top-right corner */}
          {isLuckey && recommendedPrismChannel && (
            <span
              className="absolute -top-1 -right-1 z-20 w-3 h-3 rounded-full pointer-events-none transition-transform duration-200 group-hover:scale-110"
              style={{
                backgroundColor: recommendedPrismChannel.color,
                boxShadow: `0 0 8px ${recommendedPrismChannel.color}, 0 0 14px ${recommendedPrismChannel.color}90`,
                border: isLight
                  ? '1.5px solid rgba(255, 255, 255, 0.95)'
                  : '1.5px solid rgba(15, 15, 20, 0.85)',
              }}
            />
          )}

          {/* Floating Tooltip to the Left (facing screen center) */}
          <div
            className={`hidden sm:group-hover:flex flex-col gap-1 absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl backdrop-blur-xl pointer-events-none whitespace-nowrap z-50 transition-all ${
              isLight
                ? 'bg-[#fffdf9]/96 border border-amber-900/15 text-slate-800 shadow-[0_10px_28px_rgba(120,95,70,0.18)]'
                : 'bg-neutral-900/95 border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase tracking-wider ${
                  isLuckey
                    ? isLight
                      ? 'text-emerald-600'
                      : 'text-emerald-300'
                    : 'rainbow-text-shimmer'
                }`}
              >
                {label}
              </span>
              <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
                {isLuckey ? (isChannelsOpen ? '7대 채널 접기' : '7대 채널 펼치기') : subLabel}
              </span>
              {isLuckey ? (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded rainbow-gradient-flow text-white shadow-sm">
                  {isChannelsOpen ? 'OPEN (7)' : '7 CHANNELS'}
                </span>
              ) : isActive ? (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded rainbow-gradient-flow text-white shadow-sm">
                  ACTIVE
                </span>
              ) : (
                <span
                  className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    isLight
                      ? 'bg-amber-500/10 text-amber-800 border-amber-500/25'
                      : 'bg-white/10 text-neutral-300 border-white/10'
                  }`}
                >
                  {isMainChat ? 'AI CORE' : 'HEALING'}
                </span>
              )}
            </div>

            {isLuckey && recommendedPrismChannel && (
              <div
                className={`flex items-center gap-1.5 pt-1 border-t text-[10px] ${
                  isLight ? 'border-amber-900/10 text-slate-700' : 'border-white/10 text-neutral-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: recommendedPrismChannel.color,
                    boxShadow: `0 0 6px ${recommendedPrismChannel.color}`,
                  }}
                />
                <span className="font-bold" style={{ color: recommendedPrismChannel.color }}>
                  {recommendedPrismChannel.label}
                </span>
                <span className={isLight ? 'text-slate-600' : 'text-neutral-300'}>
                  · {topRecommendation?.menu?.name || recommendedPrismChannel.subLabel}
                </span>
              </div>
            )}
          </div>
        </button>
      );
    }

    // Standard 7 Prism Journey Channels & Auxiliary Channels
    return (
      <button
        key={path}
        type="button"
        onClick={() => handleNavigate(path)}
        onMouseEnter={() => setHoveredNavPath(path)}
        onMouseLeave={() => setHoveredNavPath(null)}
        aria-label={isRecommendedTop1 ? `${label} (현재 추천 1순위)` : label}
        className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer group shrink-0 ${
          isActive || isHovered ? 'scale-105' : 'hover:scale-105 active:scale-95'
        }`}
        style={{
          backgroundColor: isActive
            ? isLight
              ? `${color}24`
              : `${color}28`
            : isHovered
            ? isLight
              ? `${color}16`
              : `${color}18`
            : isLight
            ? 'rgba(255, 255, 255, 0.78)'
            : 'rgba(255, 255, 255, 0.04)',
          border: `${isActive ? '1.5px' : '1px'} solid ${
            isActive
              ? `${color}95`
              : isHovered
              ? `${color}65`
              : isLight
              ? 'rgba(180, 150, 115, 0.24)'
              : 'rgba(255, 255, 255, 0.08)'
          }`,
          boxShadow: isActive
            ? `0 0 16px ${color}45`
            : isHovered
            ? `0 0 14px ${color}30`
            : isLight
            ? '0 2px 8px rgba(140, 115, 85, 0.07)'
            : undefined,
        }}
      >
        {/* Active left indicator bar */}
        {isActive && (
          <motion.div
            layoutId="active-nav-glow"
            className="absolute -left-2 top-2.5 bottom-2.5 w-1 rounded-r-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}

        {/* Top-1 Recommended Clean Theme-Color Circular Dot on Top-Right Corner */}
        {isRecommendedTop1 && (
          <span
            className="absolute -top-1 -right-1 z-20 w-3 h-3 rounded-full pointer-events-none transition-transform duration-200 group-hover:scale-110"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}, 0 0 14px ${color}95`,
              border: isLight
                ? '1.5px solid rgba(255, 255, 255, 0.95)'
                : '1.5px solid rgba(15, 15, 20, 0.85)',
            }}
          />
        )}

        {/* Ambient Radial Theme Color Flare blooming behind & over glyph */}
        <div
          className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${color}35 0%, ${color}10 50%, transparent 75%)`,
            opacity: isActive || isHovered ? 1 : 0,
          }}
        />

        {/* Icon Glyph with Theme Color & Glowing Drop Shadow on Hover / Active */}
        <Icon
          size={20}
          style={{
            color: isActive || isHovered ? color : undefined,
            filter:
              isActive || isHovered
                ? `drop-shadow(0 0 8px ${color})`
                : undefined,
          }}
          className={`relative z-10 transition-all duration-200 ${
            isActive || isHovered
              ? 'scale-110'
              : isLight
              ? 'text-slate-600 group-hover:text-slate-900'
              : 'text-neutral-400 group-hover:text-neutral-200'
          }`}
        />

        {/* Floating Tooltip to the Left (facing screen center) with Theme Color Beacon */}
        <div
          className={`hidden sm:group-hover:flex flex-col gap-1 absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl backdrop-blur-xl pointer-events-none whitespace-nowrap z-50 transition-all ${
            isLight
              ? 'bg-[#fffdf9]/96 border border-amber-900/15 text-slate-800 shadow-[0_10px_28px_rgba(120,95,70,0.18)]'
              : 'bg-neutral-900/95 border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
            <span
              className="text-xs font-bold uppercase tracking-wider font-sans"
              style={{ color }}
            >
              {label}
            </span>
            <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
              {subLabel}
            </span>
            {isRecommendedTop1 && (
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white shadow-xs"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}80`,
                }}
              >
                추천 1순위
              </span>
            )}
            {isActive && (
              <span
                className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded"
                style={{
                  color,
                  backgroundColor: `${color}20`,
                  border: `1px solid ${color}40`,
                }}
              >
                ACTIVE
              </span>
            )}
          </div>

          {isRecommendedTop1 && topRecommendation && (
            <div
              className={`flex items-center gap-1.5 pt-1 border-t text-[10px] ${
                isLight ? 'border-amber-900/10 text-slate-600' : 'border-white/10 text-neutral-300'
              }`}
            >
              <span className="font-bold" style={{ color }}>
                {topRecommendation.menu.name}
              </span>
              <span>· {topRecommendation.reason}</span>
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Expanded State: Lightweight Overlay Scrim + Slide-in Slim Icon Rail Dock */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Slide-in Right Slim Icon Rail */}
            <motion.aside
              key="nav-drawer"
              role="navigation"
              aria-label="사이드 네비게이션"
              initial={false}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              style={{
                width: '70px',
              }}
              className={`sites-pinned-sidebar fixed right-0 top-0 bottom-0 backdrop-blur-md border-l z-[480] flex flex-col justify-between select-none transition-colors duration-300 ${
                isLight
                  ? 'bg-[#fdfaf5]/95 border-amber-900/15 shadow-[-16px_0_48px_rgba(120,95,70,0.22)] text-slate-800'
                  : 'bg-neutral-950/95 border-white/10 shadow-[-16px_0_48px_rgba(0,0,0,0.85)] text-neutral-200'
              }`}
            >
              <div className="sidebar-aurora" aria-hidden="true">
                <div className={isLight ? 'sidebar-aurora-veil edge-aurora-veil-light' : 'sidebar-aurora-veil edge-aurora-veil'} />
                <div className="sidebar-aurora-wave" />
                <div className="sidebar-aurora-core" />
              </div>
              {/* Continuous accent; never resets when the pointer leaves. */}
              <div className="pt-[calc(var(--sat)+0.85rem)] px-2 pb-2 flex justify-center shrink-0">
                <div className="w-8 h-1 rounded-full rainbow-gradient-flow" aria-hidden="true" />
              </div>

              {/* Navigation Channel Items (Icon-Only Rail) */}
              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 no-scrollbar flex flex-col items-center w-full">
                {/* 상단 1/3 빈 공간 (Spacer): 세로 화면 상단 1/3을 비우고 2/3 지점부터 아이콘 정렬 */}
                <div className="w-full shrink-0 h-[30vh] sm:h-[33vh] pointer-events-none" aria-hidden="true" />

                {/* Core Sanctuary Channels: 1. LUCY, 2. KEY, 3. LUCKEY (3rd icon) */}
                <div className="flex flex-col items-center gap-2 w-full overflow-visible">
                  {CORE_CHANNELS.map(renderNavButton)}
                </div>

                {/* 7 Prism Channels: Accordion Toggled by 3rd LUCKEY Icon */}
                <AnimatePresence initial={false}>
                  {isChannelsOpen && (
                    <motion.div
                      key="prism-channels-accordion"
                      initial={{ opacity: 0, height: 0, scale: 0.96 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.96 }}
                      transition={{ duration: 0.24, ease: 'easeOut' }}
                      onMouseEnter={handleChannelsMouseEnter}
                      onMouseLeave={handleChannelsMouseLeave}
                      className="w-full flex flex-col items-center overflow-visible"
                    >
                      {/* Prismatic Connection Accent Line */}
                      <div className="w-full flex items-center justify-center my-1.5">
                        <div className="w-5 h-[2px] rounded-full bg-gradient-to-r from-emerald-500/70 via-purple-500/70 to-pink-500/70 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                      </div>

                      {/* 7 Prism Channels: PROLOGUE ~ EPILOGUE */}
                      <div className="relative flex flex-col items-center gap-2 w-full py-1 overflow-visible">
                        {/* Connecting vertical rainbow ambient thread */}
                        <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-red-500/60 via-amber-400/50 via-emerald-400/50 via-blue-500/50 to-purple-500/60 shadow-[0_0_8px_rgba(168,85,247,0.3)] pointer-events-none" />
                        {PRISM_CHANNELS.map(renderNavButton)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer: LP BGM Button, User Profile Button & Collapse Button */}
              <div
                className={`pb-[calc(var(--sab)+0.75rem)] px-1.5 pt-2.5 border-t flex flex-col items-center gap-2.5 shrink-0 transition-colors duration-300 ${
                  isLight ? 'border-amber-900/15' : 'border-white/10'
                }`}
              >
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

                  {/* Desktop Hover Tooltip to Left */}
                  <div
                    className={`hidden sm:group-hover:flex flex-col gap-1 absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl backdrop-blur-xl pointer-events-none whitespace-nowrap z-50 ${
                      isLight
                        ? 'bg-[#fffdf9]/96 border border-amber-900/15 text-slate-800 shadow-[0_10px_28px_rgba(120,95,70,0.18)]'
                        : 'bg-neutral-900/95 border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          bgmState.isPlaying
                            ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse'
                            : 'bg-neutral-500'
                        }`}
                      />
                      <span
                        className={`text-xs font-extrabold tracking-wide ${
                          isLight ? 'text-amber-700' : 'text-amber-300'
                        }`}
                      >
                        LP 배경음 플레이어
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          bgmState.isPlaying
                            ? isLight
                              ? 'bg-amber-500/15 text-amber-800 border-amber-500/35'
                              : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : isLight
                            ? 'bg-slate-200/70 text-slate-600 border-slate-300'
                            : 'bg-white/10 text-neutral-400 border-white/10'
                        }`}
                      >
                        {bgmState.isPlaying ? 'PLAYING' : 'PAUSED'}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-medium max-w-[210px] truncate ${
                        isLight ? 'text-slate-700' : 'text-neutral-200'
                      }`}
                    >
                      {bgmState.trackName || '사운드스케이프 대기 중'}
                    </span>
                    <span
                      className={`text-[9.5px] pt-0.5 border-t ${
                        isLight
                          ? 'border-amber-900/10 text-slate-500'
                          : 'border-white/10 text-neutral-400'
                      }`}
                    >
                      클릭: 재생/일시정지 · 꾹 누르기: LP 상세 설정
                    </span>
                  </div>
                </div>

                <button type="button" onClick={() => window.dispatchEvent(new Event('trigger-pwa-install'))} className="pwa-install-action w-10 h-10 shrink-0 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-500 hover:bg-cyan-400/20 flex items-center justify-center" aria-label="앱 설치" title="PC·모바일 앱 설치">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4" /></svg>
                </button>
                {/* User Profile Button -> Navigates to Epilogue Profile (/profile) */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative group w-10 h-10 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          sessionStorage.setItem('prism_target_tab', 'profile');
                          window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: 'profile' } }));
                        } catch (_) {}
                        handleNavigate('/profile');
                      }}
                      className={`relative w-full h-full rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 overflow-hidden shadow-sm ${
                        isProfileActive
                          ? isLight
                            ? 'bg-amber-500/30 border-amber-600 text-amber-800 ring-2 ring-amber-500/40 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                            : 'bg-purple-500/30 border-purple-400 text-purple-200 ring-2 ring-purple-400/40 shadow-[0_0_16px_rgba(168,85,247,0.45)]'
                          : isLight
                          ? 'bg-amber-500/15 border-amber-500/40 hover:border-amber-600 text-amber-700 hover:bg-amber-500/25'
                          : 'bg-amber-400/15 border-amber-400/30 hover:border-amber-400/70 text-amber-300 hover:bg-amber-400/25'
                      }`}
                      aria-label="내 프로필 및 사진 설정"
                      title="내 프로필 및 사진 설정"
                    >
                      {userAvatarUrl ? (
                        <img
                          src={userAvatarUrl}
                          alt={userNickname}
                          className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <User size={16} className="group-hover:scale-110 transition-transform" />
                      )}
                    </button>

                    {/* Desktop Hover Tooltip to Left */}
                    <div
                      className={`hidden sm:group-hover:flex items-center gap-2 absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl backdrop-blur-xl pointer-events-none whitespace-nowrap z-50 ${
                        isLight
                          ? 'bg-[#fffdf9]/96 border border-amber-900/15 text-slate-800 shadow-[0_10px_28px_rgba(120,95,70,0.18)]'
                          : 'bg-neutral-900/95 border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)]'
                      }`}
                    >
                      {userAvatarUrl ? (
                        <img src={userAvatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                      <span className={`text-xs font-bold ${isLight ? 'text-amber-700' : 'text-amber-300'}`}>
                        {userNickname}
                      </span>
                      <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        내 프로필 · 사진 설정
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[8px] leading-none whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}
                    aria-label={`앱 버전 ${APP_VERSION}`}
                  >
                    v{APP_VERSION}
                  </span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
