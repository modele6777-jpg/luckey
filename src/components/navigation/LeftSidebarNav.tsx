import React, { useState, useEffect, useCallback } from 'react';
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
  Compass,
  X,
  KeyRound,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';

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

// 1. Core Sanctuary Channels (AI 가이드 & 마음약방)
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
const KEY_SUBPATHS = ['/key', '/calm'];
const PROLOGUE_SUBPATHS = ['/prologue', '/universe', '/ecpr', '/todo', '/mission', '/synergy', '/aegis'];

export default function LeftSidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setProfileVersion] = useState(0);
  const [location, navigate] = useLocation();
  const cleanPath = location ? location.split('?')[0].split('#')[0] : '/';

  // Extract user profile / nickname for sidebar footer
  let userNickname = '제제';
  try {
    const { sharedState } = useApp();
    const rawNick = sharedState?.userProfile?.basic?.nickname?.trim();
    const fallbackNick = getPersistentUserProfile()?.basic?.nickname?.trim();
    const rawName = sharedState?.userProfile?.basic?.name?.trim() || getPersistentUserProfile()?.basic?.name?.trim();
    userNickname = rawNick || fallbackNick || rawName || '제제';
  } catch {
    const fallbackNick = getPersistentUserProfile()?.basic?.nickname?.trim();
    userNickname = fallbackNick || getPersistentUserProfile()?.basic?.name?.trim() || '제제';
  }

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

  // Find the currently active nav item to highlight theme accent
  const allNavItems = [...CORE_CHANNELS, ...PRISM_CHANNELS];
  const activeItem =
    allNavItems.find((item) => {
      if (item.isMainChat) return isLucyActive;
      if (item.isKey) return isKeyActive;
      if (item.isPrologue) return isPrologueActive;
      return cleanPath === item.path || cleanPath.startsWith(item.path + '/');
    }) || CORE_CHANNELS[0];

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
    const { path, icon: Icon, label, subLabel, color, isMainChat, isKey, isPrologue } = item;
    const isActive = isMainChat
      ? isLucyActive
      : isKey
      ? isKeyActive
      : isPrologue
      ? isPrologueActive
      : cleanPath === path || cleanPath.startsWith(path + '/');
    const isRainbow = Boolean(isMainChat || isKey);

    // 🌈 Special Rainbow Glowing Style for Core Sanctuary Channels (LUCY & KEY)
    if (isRainbow) {
      return (
        <button
          key={path}
          type="button"
          onClick={() => handleNavigate(path)}
          aria-label={label}
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
                ? 'shadow-[0_0_16px_rgba(255,107,107,0.55)]'
                : 'group-hover:shadow-[0_0_12px_rgba(255,107,107,0.35)]'
            }`}
          >
            <div className="absolute inset-0 rainbow-fab-halo blur-[0.5px]" />
            <div
              className={`relative w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-neutral-900/95 ring-1 ring-white/30'
                  : 'bg-neutral-950/90 group-hover:bg-neutral-900/90'
              }`}
            >
              <Icon
                size={20}
                className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] transition-transform duration-200 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Floating Tooltip to the Right */}
          <div className="hidden sm:group-hover:flex items-center gap-2 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)] pointer-events-none whitespace-nowrap z-50 transition-all">
            <span className="text-xs font-black uppercase tracking-wider rainbow-text-shimmer">
              {label}
            </span>
            <span className="text-[11px] text-neutral-300">
              {subLabel}
            </span>
            {isActive ? (
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
            aria-label="네비게이션 메뉴 열기"
            aria-expanded={isOpen}
            className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neutral-950/90 hover:bg-neutral-900/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.65)] flex items-center justify-center cursor-pointer text-neutral-300 hover:text-white transition-all duration-200 active:scale-90"
            title="메뉴 열기"
          >
            {/* Ambient outer rotating conic rainbow aura halo */}
            <span
              className="absolute -inset-1.5 sm:-inset-2 rounded-full rainbow-fab-halo blur-[8px] opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              aria-hidden="true"
            />

            {/* Crisp rotating conic rainbow border ring */}
            <span
              className="absolute -inset-[2px] rounded-full rainbow-fab-halo opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none"
              aria-hidden="true"
            />

            {/* Inner icon & indicator with iridescent rainbow styling */}
            <div className="relative z-10 flex items-center justify-center">
              <Compass
                size={21}
                className="text-white transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
              />
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-neutral-950 rainbow-gradient-flow animate-pulse shadow-[0_0_8px_rgba(255,107,107,0.8)]"
              />
            </div>

            {/* Desktop hover tooltip */}
            <span className="hidden sm:group-hover:flex items-center gap-1.5 absolute bottom-full mb-2.5 left-0 px-2.5 py-1 rounded-lg bg-neutral-900/95 text-[11px] text-neutral-200 font-medium whitespace-nowrap border border-white/10 shadow-xl pointer-events-none z-30">
              <span className="w-1.5 h-1.5 rounded-full rainbow-fab-halo" />
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
              {/* Header: Compact Brand Compass & Close Button */}
              <div className="pt-[calc(var(--sat)+0.75rem)] px-2 pb-2 border-b border-white/10 flex flex-col items-center gap-2 shrink-0">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden p-[1.5px] flex items-center justify-center shadow-md">
                  <div className="absolute inset-0 rainbow-fab-halo blur-[0.5px]" />
                  <div className="relative w-full h-full rounded-[10px] bg-neutral-950/90 flex items-center justify-center text-amber-300">
                    <Compass size={17} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="메뉴 닫기"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer active:scale-90"
                  title="메뉴 닫기"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation Channel Items (Icon-Only Rail) */}
              <div className="flex-1 overflow-y-auto sm:overflow-y-visible px-2 py-3 space-y-2 no-scrollbar flex flex-col items-center w-full">
                {/* Core Channels: LUCY & KEY */}
                <div className="flex flex-col items-center gap-2 w-full">
                  {CORE_CHANNELS.map(renderNavButton)}
                </div>

                {/* Subtle Divider */}
                <div className="w-6 h-[1px] bg-white/15 my-1 rounded-full shrink-0" />

                {/* 7 Prism Channels: PROLOGUE ~ EPILOGUE */}
                <div className="flex flex-col items-center gap-2 w-full">
                  {PRISM_CHANNELS.map(renderNavButton)}
                </div>
              </div>

              {/* Footer: User Profile Button & Collapse Button */}
              <div className="pb-[calc(var(--sab)+0.75rem)] px-2 pt-2 border-t border-white/10 flex flex-col items-center gap-2 shrink-0">
                {/* User Profile Button */}
                <button
                  type="button"
                  onClick={() => handleNavigate('/profile')}
                  className="relative group w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 hover:bg-amber-400/25 transition-all cursor-pointer active:scale-95"
                  aria-label={`${userNickname} 프로필`}
                >
                  <User size={16} className="group-hover:scale-110 transition-transform" />
                  {/* Desktop Hover Tooltip */}
                  <div className="hidden sm:group-hover:flex items-center gap-1.5 absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/15 text-white shadow-[0_8px_25px_rgba(0,0,0,0.7)] pointer-events-none whitespace-nowrap z-50">
                    <span className="text-xs font-bold text-amber-300">{userNickname}</span>
                    <span className="text-[11px] text-neutral-400">프로필</span>
                  </div>
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
