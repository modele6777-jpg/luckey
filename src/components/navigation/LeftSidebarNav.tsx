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
  Camera,
  Monitor,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import {
  peekNextRecommendedMenuByCycle,
  resetActiveContextPeek,
  type ContextNextMenuResult,
} from '@/lib/omniWarp/contextNavCycleEngine';
import { saveProfileToAllVaults } from '@/lib/profileVault';
import { mergeUserProfiles } from '@/lib/sharedState';
import { compressImageToDataUrl } from '@/utils/imageCompress';

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
    subLabel: '40대 불안 치유 마음약방',
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
  const [isOpen, setIsOpen] = useState(false);
  const [, setProfileVersion] = useState(0);
  const [hoveredNavPath, setHoveredNavPath] = useState<string | null>(null);
  const [location, navigate] = useLocation();
  const cleanPath = location ? location.split('?')[0].split('#')[0] : '/';
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [topRecommendation, setTopRecommendation] = useState<ContextNextMenuResult | null>(null);

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
  let updateSharedStateFn: any = null;
  try {
    const { sharedState, updateSharedState, firebaseUser } = useApp();
    updateSharedStateFn = updateSharedState;
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

  const sidebarAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const [, setIsQuickUploadingAvatar] = useState(false);

  const handleQuickAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsQuickUploadingAvatar(true);
      const compressedDataUrl = await compressImageToDataUrl(file, 320, 0.85);
      const existingProfile = getPersistentUserProfile() || {};
      const updatedProfile = mergeUserProfiles(existingProfile, {
        basic: { ...existingProfile.basic, avatarUrl: compressedDataUrl },
      }, true);
      if (!updatedProfile.basic) updatedProfile.basic = {};
      updatedProfile.basic.avatarUrl = compressedDataUrl;
      setPersistentUserProfile(updatedProfile);
      saveProfileToAllVaults(updatedProfile);
      if (updateSharedStateFn) {
        updateSharedStateFn({ userProfile: updatedProfile }, 'profile').catch(() => {});
      }
      window.dispatchEvent(new CustomEvent('prism:profile_updated', { detail: { userProfile: updatedProfile } }));
      setProfileVersion((v) => v + 1);
    } catch (err) {
      console.error('[LeftSidebarNav] Quick avatar upload error:', err);
    } finally {
      setIsQuickUploadingAvatar(false);
      if (sidebarAvatarInputRef.current) sidebarAvatarInputRef.current.value = '';
    }
  };

  // Global event listeners for opening/toggling menu from BigBang West button
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('prism:open_menu', handleOpen);
    window.addEventListener('prism:toggle_menu', handleToggle);
    window.addEventListener('prism:close_menu', handleClose);
    return () => {
      window.removeEventListener('prism:open_menu', handleOpen);
      window.removeEventListener('prism:toggle_menu', handleToggle);
      window.removeEventListener('prism:close_menu', handleClose);
    };
  }, []);

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

  // Close when pressing Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Broadcast sidebar open/closed state so widgets like LP player can sync visibility
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('left-sidebar-state', { detail: { isOpen } }));
  }, [isOpen]);

  // Support custom events for external triggers
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleToggle = () => setIsOpen((prev) => !prev);

    window.addEventListener('open-left-nav', handleOpen);
    window.addEventListener('close-left-nav', handleClose);
    window.addEventListener('toggle-left-nav', handleToggle);

    return () => {
      window.removeEventListener('open-left-nav', handleOpen);
      window.removeEventListener('close-left-nav', handleClose);
      window.removeEventListener('toggle-left-nav', handleToggle);
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

    if (!isTargetActive) {
      navigate(path);
    }
    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path } }));
    setIsOpen(false);
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

          {/* Floating Tooltip to the Right */}
          <div
            className={`hidden sm:group-hover:flex flex-col gap-1 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl backdrop-blur-xl pointer-events-none whitespace-nowrap z-50 transition-all ${
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
          isActive || isHovered || isRecommendedTop1 ? 'scale-105' : 'hover:scale-105 active:scale-95'
        }`}
        style={{
          backgroundColor: isActive
            ? isLight
              ? `${color}24`
              : `${color}28`
            : isRecommendedTop1
            ? isLight
              ? `${color}18`
              : `${color}20`
            : isHovered
            ? isLight
              ? `${color}16`
              : `${color}18`
            : isLight
            ? 'rgba(255, 255, 255, 0.78)'
            : 'rgba(255, 255, 255, 0.04)',
          border: `${isRecommendedTop1 || isActive ? '1.5px' : '1px'} solid ${
            isActive
              ? `${color}95`
              : isRecommendedTop1
              ? `${color}88`
              : isHovered
              ? `${color}65`
              : isLight
              ? 'rgba(180, 150, 115, 0.24)'
              : 'rgba(255, 255, 255, 0.08)'
          }`,
          boxShadow: isActive
            ? `0 0 16px ${color}45`
            : isRecommendedTop1
            ? isLight
              ? `0 0 14px ${color}40, inset 0 0 8px ${color}18`
              : `0 0 16px ${color}55, inset 0 0 10px ${color}24`
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
            opacity: isActive || isHovered || isRecommendedTop1 ? 1 : 0,
          }}
        />

        {/* Icon Glyph with Theme Color & Glowing Drop Shadow on Hover / Active / Recommended #1 */}
        <Icon
          size={20}
          style={{
            color: isActive || isHovered || isRecommendedTop1 ? color : undefined,
            filter:
              isActive || isHovered || isRecommendedTop1
                ? `drop-shadow(0 0 8px ${color})`
                : undefined,
          }}
          className={`relative z-10 transition-all duration-200 ${
            isActive || isHovered || isRecommendedTop1
              ? 'scale-110'
              : isLight
              ? 'text-slate-600 group-hover:text-slate-900'
              : 'text-neutral-400 group-hover:text-neutral-200'
          }`}
        />

        {/* Floating Tooltip to the Right with Theme Color Beacon */}
        <div
          className={`hidden sm:group-hover:flex flex-col gap-1 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl backdrop-blur-xl pointer-events-none whitespace-nowrap z-50 transition-all ${
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
      {/* Expanded State: Floating Overlay Backdrop + Slide-in Slim Icon Rail Dock */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              key="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className={`fixed inset-0 backdrop-blur-sm z-[450] transition-colors duration-300 ${
                isLight ? 'bg-amber-950/20' : 'bg-black/60'
              }`}
              aria-hidden="true"
            />

            {/* Slide-in Left Slim Icon Rail */}
            <motion.aside
              key="nav-drawer"
              role="navigation"
              aria-label="사이드 네비게이션"
              initial={{ x: '-100%', opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              className={`fixed left-0 top-0 bottom-0 w-[68px] sm:w-[74px] backdrop-blur-2xl border-r z-[460] flex flex-col justify-between select-none transition-colors duration-300 ${
                isLight
                  ? 'bg-[#fdfaf5]/95 border-amber-900/15 shadow-[16px_0_48px_rgba(120,95,70,0.22)] text-slate-800'
                  : 'bg-neutral-950/95 border-white/10 shadow-[16px_0_48px_rgba(0,0,0,0.85)] text-neutral-200'
              }`}
            >
              {/* Safe-Area Top Spacer & Indicator */}
              <div className="pt-[calc(var(--sat)+0.85rem)] px-2 pb-2 flex flex-col items-center shrink-0">
                <div
                  className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                    isLight ? 'bg-amber-900/20' : 'bg-white/10'
                  }`}
                />
              </div>

              {/* Navigation Channel Items (Icon-Only Rail) */}
              <div className="flex-1 overflow-y-auto sm:overflow-visible px-2 py-2 space-y-2 no-scrollbar flex flex-col items-center w-full">
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

              {/* Footer: Animated Theme Switcher & User Profile Button & Collapse Button */}
              <div
                className={`pb-[calc(var(--sab)+0.75rem)] px-1.5 pt-2.5 border-t flex flex-col items-center gap-2.5 shrink-0 transition-colors duration-300 ${
                  isLight ? 'border-amber-900/15' : 'border-white/10'
                }`}
              >
                {/* Intuitive Animated Theme Switcher (Light / Dark / Auto) */}
                <div className="relative group flex flex-col items-center gap-1">
                  <div
                    className={`relative flex items-center justify-between p-0.5 rounded-full border w-[60px] h-[26px] shrink-0 transition-all duration-300 ${
                      isLight
                        ? 'bg-amber-100/90 border-amber-400/50 shadow-[inset_0_1px_4px_rgba(180,130,60,0.18),0_2px_10px_rgba(245,158,11,0.18)]'
                        : 'bg-neutral-900/90 border-indigo-400/30 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6),0_2px_10px_rgba(99,102,241,0.2)]'
                    }`}
                    role="group"
                    aria-label="화면 테마 모드 선택"
                  >
                    {/* Light Mode Button */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('whitehole');
                        setThemeMode('light');
                      }}
                      className={`relative z-10 w-[18px] h-[20px] rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        themeMode === 'light'
                          ? 'text-slate-950'
                          : isLight
                          ? 'text-amber-700/70 hover:text-amber-900'
                          : 'text-neutral-400 hover:text-amber-300'
                      }`}
                      aria-label="라이트 모드"
                      title="라이트 모드 (따스한 아이보리 & 파스텔 오로라)"
                    >
                      {themeMode === 'light' && (
                        <motion.span
                          layoutId="sidebar-theme-pill"
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-orange-300 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        />
                      )}
                      <Sun
                        size={11}
                        strokeWidth={themeMode === 'light' ? 2.8 : 2}
                        className={`relative z-10 transition-transform duration-300 ${
                          themeMode === 'light' ? 'rotate-45 scale-110' : ''
                        }`}
                      />
                    </button>

                    {/* Dark Mode Button */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('whitehole');
                        setThemeMode('dark');
                      }}
                      className={`relative z-10 w-[18px] h-[20px] rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        themeMode === 'dark'
                          ? 'text-white'
                          : isLight
                          ? 'text-slate-500 hover:text-indigo-700'
                          : 'text-neutral-400 hover:text-indigo-300'
                      }`}
                      aria-label="다크 모드"
                      title="다크 모드 (딥 코스믹 나이트)"
                    >
                      {themeMode === 'dark' && (
                        <motion.span
                          layoutId="sidebar-theme-pill"
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.9)]"
                          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        />
                      )}
                      <Moon
                        size={11}
                        strokeWidth={themeMode === 'dark' ? 2.8 : 2}
                        className={`relative z-10 transition-transform duration-300 ${
                          themeMode === 'dark' ? '-rotate-12 scale-110' : ''
                        }`}
                      />
                    </button>

                    {/* Auto Mode Button */}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('whitehole');
                        setThemeMode('auto');
                      }}
                      className={`relative z-10 w-[18px] h-[20px] rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        themeMode === 'auto'
                          ? 'text-slate-950'
                          : isLight
                          ? 'text-slate-500 hover:text-cyan-700'
                          : 'text-neutral-400 hover:text-cyan-300'
                      }`}
                      aria-label={`시스템 자동 모드 (현재: ${resolvedTheme === 'dark' ? '다크' : '라이트'})`}
                      title={`시스템 자동 모드 (현재: ${resolvedTheme === 'dark' ? '다크' : '라이트'})`}
                    >
                      {themeMode === 'auto' && (
                        <motion.span
                          layoutId="sidebar-theme-pill"
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-teal-300 shadow-[0_0_10px_rgba(34,211,238,0.85)]"
                          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        />
                      )}
                      <Monitor
                        size={10}
                        strokeWidth={themeMode === 'auto' ? 2.6 : 2}
                        className="relative z-10"
                      />
                    </button>
                  </div>

                  {/* Active Mode Micro Status Label */}
                  <span
                    className={`text-[9px] font-extrabold tracking-wider uppercase transition-colors duration-300 ${
                      isLight ? 'text-amber-700' : 'text-indigo-300/90'
                    }`}
                  >
                    {themeMode === 'light'
                      ? '☀️ LIGHT'
                      : themeMode === 'dark'
                      ? '🌙 DARK'
                      : `AUTO·${isLight ? 'DAY' : 'NIGHT'}`}
                  </span>

                  {/* Desktop Hover Tooltip for Theme Switcher */}
                  <div
                    className={`hidden sm:group-hover:flex items-center gap-2 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl backdrop-blur-xl pointer-events-none whitespace-nowrap z-50 ${
                      isLight
                        ? 'bg-[#fffdf9]/96 border border-amber-900/15 text-slate-800 shadow-[0_10px_28px_rgba(120,95,70,0.18)]'
                        : 'bg-neutral-900/95 border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)]'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isLight ? 'text-amber-600' : 'text-amber-300'}`}>
                      {themeMode === 'light'
                        ? '☀️ 라이트 모드 (아이보리 파스텔)'
                        : themeMode === 'dark'
                        ? '🌙 다크 모드 (코스믹 나이트)'
                        : `💻 시스템 자동 (현재 ${isLight ? '라이트' : '다크'})`}
                    </span>
                  </div>
                </div>

                {/* User Profile Button with Photo Support */}
                <div className="relative group w-10 h-10 shrink-0">
                  <input
                    ref={sidebarAvatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleQuickAvatarUpload}
                  />

                  <button
                    type="button"
                    onClick={() => sidebarAvatarInputRef.current?.click()}
                    className={`relative w-full h-full rounded-xl border flex items-center justify-center transition-all cursor-pointer active:scale-95 overflow-hidden shadow-sm ${
                      isLight
                        ? 'bg-amber-500/15 border-amber-500/40 hover:border-amber-600 text-amber-700 hover:bg-amber-500/25'
                        : 'bg-amber-400/15 border-amber-400/30 hover:border-amber-400/70 text-amber-300 hover:bg-amber-400/25'
                    }`}
                    aria-label="내 사진 변경"
                    title="내 사진 변경 (클릭하여 사진 선택)"
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

                    {/* Hover camera overlay on photo */}
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-xl pointer-events-none">
                      <Camera size={13} className="text-amber-300" />
                    </div>
                  </button>

                  {/* Desktop Hover Tooltip */}
                  <div
                    className={`hidden sm:group-hover:flex items-center gap-2 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl backdrop-blur-xl pointer-events-none whitespace-nowrap z-50 ${
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
                      클릭하여 사진 변경
                    </span>
                  </div>
                </div>

                {/* Collapse Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer text-xs active:scale-90 ${
                    isLight
                      ? 'text-slate-500 hover:text-slate-900 hover:bg-amber-900/[0.08]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                  title="메뉴 닫기"
                  aria-label="메뉴 닫기"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
