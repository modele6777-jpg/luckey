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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, getPersistentUserProfile, setPersistentUserProfile } from '@/contexts/AppContext';
import { saveProfileToAllVaults } from '@/lib/profileVault';
import { mergeUserProfiles } from '@/lib/sharedState';
import { compressImageToDataUrl } from '@/utils/imageCompress';

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
    color: 'oklch(0.60 0.22 15)',
    isPrologue: true,
  },
  {
    path: '/orange',
    icon: TreeDeciduous,
    label: 'ORANGE',
    subLabel: '마음챙김 & 소원부적',
    color: 'oklch(0.72 0.18 55)',
  },
  {
    path: '/trinity',
    icon: Sparkles,
    label: 'TRINITY',
    subLabel: '트리니티 오라클 타로',
    color: 'oklch(0.85 0.15 90)',
  },
  {
    path: '/heal',
    icon: Activity,
    label: 'AURA',
    subLabel: '세도나 치유 & 명상',
    color: 'oklch(0.70 0.15 150)',
  },
  {
    path: '/bluebird',
    icon: Bird,
    label: 'BLUEBIRD',
    subLabel: '파랑새 호오포노포노',
    color: 'oklch(0.75 0.12 230)',
  },
  {
    path: '/muse',
    icon: Music,
    label: 'MUSE',
    subLabel: '시와 예술 갤러리',
    color: 'oklch(0.40 0.15 250)',
  },
  {
    path: '/epilogue',
    icon: Moon,
    label: 'EPILOGUE',
    subLabel: '에필로그 & 통합 일기',
    color: 'oklch(0.65 0.25 310)',
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
    color: 'oklch(0.75 0.16 200)',
  },
  {
    path: '/rebible',
    icon: BookOpen,
    label: 'REBIBLE',
    subLabel: '리바이블 지혜 성전',
    color: 'oklch(0.78 0.18 85)',
  },
  {
    path: '/handbook',
    icon: BookOpen,
    label: 'HANDBOOK',
    subLabel: '리바이블 핸드북',
    color: 'oklch(0.78 0.18 85)',
  },
  {
    path: '/omniwarp',
    icon: Compass,
    label: 'BIGBANG',
    subLabel: '옴니워프 & 빅뱅 내비게이션',
    color: 'oklch(0.72 0.22 340)',
  },
  {
    path: '/bigbang',
    icon: Compass,
    label: 'BIGBANG',
    subLabel: '빅뱅 보이스 & 옴니워프',
    color: 'oklch(0.72 0.22 340)',
  },
];

export default function LeftSidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setProfileVersion] = useState(0);
  const [location, navigate] = useLocation();
  const cleanPath = location ? location.split('?')[0].split('#')[0] : '/';

  // Extract user profile / nickname and avatar URL for sidebar footer
  let userNickname = '제제';
  let userAvatarUrl: string | undefined = undefined;
  let updateSharedStateFn: any = null;
  try {
    const { sharedState, updateSharedState, firebaseUser } = useApp();
    updateSharedStateFn = updateSharedState;
    const rawNick = sharedState?.userProfile?.basic?.nickname?.trim();
    const fallbackNick = getPersistentUserProfile()?.basic?.nickname?.trim();
    const rawName = sharedState?.userProfile?.basic?.name?.trim() || getPersistentUserProfile()?.basic?.name?.trim();
    userNickname = rawNick || fallbackNick || rawName || '제제';
    userAvatarUrl = sharedState?.userProfile?.basic?.avatarUrl || getPersistentUserProfile()?.basic?.avatarUrl || firebaseUser?.photoURL || undefined;
  } catch {
    const fallbackNick = getPersistentUserProfile()?.basic?.nickname?.trim();
    userNickname = fallbackNick || getPersistentUserProfile()?.basic?.name?.trim() || '제제';
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
          onMouseEnter={isLuckey ? handleChannelsMouseEnter : undefined}
          onMouseLeave={isLuckey ? handleChannelsMouseLeave : undefined}
          aria-label={isLuckey ? `${label} 7대 채널 ${isChannelsOpen ? '접기' : '펼치기'}` : label}
          aria-expanded={isLuckey ? isChannelsOpen : undefined}
          className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer group shrink-0 ${
            isActive ? 'scale-105' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {/* Active left indicator bar */}
          {isActive && (
            <motion.div
              layoutId="active-nav-glow"
              className="absolute -left-2 top-2.5 bottom-2.5 w-1 rounded-r-full rainbow-gradient-flow shadow-[0_0_8px_rgba(255,255,255,0.8)]"
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
              className={`relative w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                isActive
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
                    ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                    : 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]'
                } transition-transform duration-300 group-hover:scale-110 ${isLuckey ? 'group-hover:rotate-12' : ''}`}
              />

              {/* For LUCKEY: Mini indicator for channels toggle */}
              {isLuckey && (
                <span
                  className={`absolute -bottom-1 -right-1 text-[8px] font-black px-1 py-0.5 rounded-full border transition-all ${
                    isChannelsOpen
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                      : 'bg-neutral-800 text-neutral-300 border-white/20'
                  }`}
                >
                  {isChannelsOpen ? '▲' : '7'}
                </span>
              )}
            </div>
          </div>

          {/* Floating Tooltip to the Right */}
          <div className="hidden sm:group-hover:flex items-center gap-2 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)] pointer-events-none whitespace-nowrap z-50 transition-all">
            <span
              className={`text-xs font-black uppercase tracking-wider ${
                isLuckey ? 'text-emerald-300' : 'rainbow-text-shimmer'
              }`}
            >
              {label}
            </span>
            <span className="text-[11px] text-neutral-300">
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
              <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10">
                {isMainChat ? 'AI CORE' : 'HEALING'}
              </span>
            )}
          </div>
        </button>
      );
    }

    // Standard 7 Prism Journey Channels
    return (
      <button
        key={path}
        type="button"
        onClick={() => handleNavigate(path)}
        aria-label={label}
        className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer group shrink-0 ${
          isActive ? 'scale-105' : 'hover:scale-105 active:scale-95'
        }`}
        style={{
          backgroundColor: isActive ? `${color}25` : 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${isActive ? `${color}70` : 'rgba(255, 255, 255, 0.08)'}`,
          boxShadow: isActive ? `0 0 14px ${color}40` : undefined,
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

        <Icon
          size={20}
          style={{ color: isActive ? color : undefined }}
          className={`transition-transform duration-200 group-hover:scale-110 ${
            isActive ? '' : 'text-neutral-400 group-hover:text-neutral-100'
          }`}
        />

        {/* Floating Tooltip to the Right */}
        <div className="hidden sm:group-hover:flex items-center gap-2 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)] pointer-events-none whitespace-nowrap z-50 transition-all">
          <span
            className="text-xs font-bold uppercase tracking-wider font-sans"
            style={{ color }}
          >
            {label}
          </span>
          <span className="text-[11px] text-neutral-300">
            {subLabel}
          </span>
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
      </button>
    );
  };

  return (
    <>
      {/* 1. Collapsed State: Sleek Fixed Circular Floating FAB with Animated Rainbow Prismatic Aura */}
      {!isOpen && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-safe-nav-fab z-[400] select-none"
        >
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`네비게이션 메뉴 열기 (${activeItem.label})`}
            aria-expanded={isOpen}
            className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neutral-950/90 hover:bg-neutral-900/95 backdrop-blur-xl border border-white/20 hover:border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center cursor-pointer text-neutral-300 hover:text-white transition-all duration-200 active:scale-90"
            title={`메뉴 열기 (${activeItem.label})`}
          >
            {/* Inner icon & indicator with active app dynamic styling */}
            <div className="relative z-10 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem?.label || 'LUCY'}
                  initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.6, opacity: 0, rotate: 20 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                >
                  <ActiveNavIcon
                    size={21}
                    style={{ color: activeItem?.color || '#34d399' }}
                    className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 drop-shadow-[0_0_8px_currentColor]"
                  />
                </motion.div>
              </AnimatePresence>
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-neutral-950 animate-pulse"
                style={{
                  backgroundColor: activeItem?.color || '#34d399',
                  boxShadow: `0 0 8px ${activeItem?.color || '#34d399'}`,
                }}
              />
            </div>

            {/* Desktop hover tooltip */}
            <span className="hidden sm:group-hover:flex items-center gap-1.5 absolute bottom-full mb-2.5 left-0 px-2.5 py-1 rounded-lg bg-neutral-900/95 text-[11px] text-neutral-200 font-medium whitespace-nowrap border border-white/10 shadow-xl pointer-events-none z-30">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: activeItem?.color || '#34d399' }}
              />
              <span>메뉴 열기 ({activeItem.label})</span>
            </span>
          </button>
        </motion.div>
      )}

      {/* 2. Expanded State: Floating Overlay Backdrop + Slide-in Slim Icon Rail Dock */}
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[450]"
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
              className="fixed left-0 top-0 bottom-0 w-[68px] sm:w-[72px] bg-neutral-950/95 backdrop-blur-2xl border-r border-white/10 shadow-[16px_0_48px_rgba(0,0,0,0.85)] z-[460] flex flex-col justify-between text-neutral-200 select-none"
            >
              {/* Safe-Area Top Spacer & Indicator */}
              <div className="pt-[calc(var(--sat)+0.85rem)] px-2 pb-2 flex flex-col items-center shrink-0">
                <div className="w-8 h-1 rounded-full bg-white/10" />
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
                      className="w-full flex flex-col items-center overflow-hidden"
                    >
                      {/* Prismatic Connection Accent Line */}
                      <div className="w-full flex items-center justify-center my-1.5">
                        <div className="w-5 h-[2px] rounded-full bg-gradient-to-r from-emerald-500/70 via-purple-500/70 to-pink-500/70 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                      </div>

                      {/* 7 Prism Channels: PROLOGUE ~ EPILOGUE */}
                      <div className="relative flex flex-col items-center gap-2 w-full py-0.5">
                        {/* Connecting vertical ambient thread */}
                        <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-emerald-500/40 via-purple-500/30 to-transparent pointer-events-none" />
                        {PRISM_CHANNELS.map(renderNavButton)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer: User Profile Button & Collapse Button */}
              <div className="pb-[calc(var(--sab)+0.75rem)] px-2 pt-2 border-t border-white/10 flex flex-col items-center gap-2 shrink-0">
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
                    className="relative w-full h-full rounded-xl bg-amber-400/15 border border-amber-400/30 hover:border-amber-400/70 flex items-center justify-center text-amber-300 hover:bg-amber-400/25 transition-all cursor-pointer active:scale-95 overflow-hidden shadow-sm"
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
                  <div className="hidden sm:group-hover:flex items-center gap-2 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)] pointer-events-none whitespace-nowrap z-50">
                    {userAvatarUrl ? (
                      <img src={userAvatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-amber-400/50" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                    <span className="text-xs font-bold text-amber-300">{userNickname}</span>
                    <span className="text-[11px] text-neutral-400">클릭하여 사진 변경</span>
                  </div>
                </div>

                {/* Profile Settings Page Button */}
                <button
                  type="button"
                  onClick={() => handleNavigate('/profile')}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-amber-300 hover:bg-white/[0.08] transition-colors cursor-pointer text-xs active:scale-90"
                  title={`${userNickname} 프로필 설정`}
                  aria-label={`${userNickname} 프로필 설정`}
                >
                  <User size={15} />
                </button>

                {/* Collapse Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-xs active:scale-90"
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
