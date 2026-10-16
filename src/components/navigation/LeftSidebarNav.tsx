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
  const [location, navigate] = useLocation();
  const cleanPath = location ? location.split('?')[0].split('#')[0] : '/';

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

    return (
      <button
        key={path}
        type="button"
        onClick={() => handleNavigate(path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left relative group cursor-pointer ${
          isActive
            ? 'bg-white/[0.09] text-white border border-white/15 shadow-[0_2px_12px_rgba(0,0,0,0.3)]'
            : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.04]'
        }`}
      >
        {/* Active glowing indicator pill */}
        {isActive && (
          <motion.div
            layoutId="active-nav-glow"
            className="absolute left-1 top-2 bottom-2 w-1 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}

        {/* Channel Icon Container */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: isActive ? `${color}25` : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${isActive ? `${color}60` : 'rgba(255, 255, 255, 0.08)'}`,
          }}
        >
          <Icon
            size={18}
            style={{ color: isActive ? color : undefined }}
            className={isActive ? '' : 'text-neutral-400 group-hover:text-neutral-200'}
          />
        </div>

        {/* Label & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-bold tracking-wider uppercase font-sans truncate"
              style={{ color: isActive ? color : undefined }}
            >
              {label}
            </span>
            {isActive && (
              <span
                className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded"
                style={{
                  color,
                  backgroundColor: `${color}15`,
                }}
              >
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 group-hover:text-neutral-300 font-sans truncate mt-0.5">
            {subLabel}
          </p>
        </div>
      </button>
    );
  };

  return (
    <>
      {/* 1. Collapsed State: Sleek Fixed Circular Floating FAB on the Bottom-Left */}
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
            {/* Ambient active channel glow halo */}
            <span
              className="absolute -inset-0.5 rounded-full opacity-40 group-hover:opacity-75 blur-xs transition-opacity"
              style={{
                backgroundColor: activeItem.color,
                boxShadow: `0 0 12px ${activeItem.color}`,
              }}
            />

            {/* Inner icon & indicator */}
            <div className="relative flex items-center justify-center">
              <Compass
                size={20}
                style={{ color: activeItem.color }}
                className="transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              />
              <span
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ring-neutral-950 animate-pulse"
                style={{ backgroundColor: activeItem.color }}
              />
            </div>

            {/* Desktop hover tooltip */}
            <span className="hidden sm:group-hover:block absolute bottom-full mb-2.5 left-0 px-2.5 py-1 rounded-lg bg-neutral-900/95 text-[11px] text-neutral-200 font-medium whitespace-nowrap border border-white/10 shadow-lg pointer-events-none">
              메뉴 열기 ({activeItem.label})
            </span>
          </button>
        </motion.div>
      )}

      {/* 2. Expanded State: Floating Overlay Backdrop + Slide-in Drawer */}
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

            {/* Slide-in Left Drawer Panel */}
            <motion.aside
              key="nav-drawer"
              role="navigation"
              aria-label="사이드 네비게이션"
              initial={{ x: '-100%', opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 w-[290px] max-w-[85vw] bg-neutral-950/95 backdrop-blur-2xl border-r border-white/10 shadow-[16px_0_48px_rgba(0,0,0,0.85)] z-[460] flex flex-col justify-between overflow-hidden text-neutral-200"
            >
              {/* Header */}
              <div className="pt-[calc(var(--sat)+1.25rem)] px-5 pb-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-amber-300">
                    <Compass size={18} />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold tracking-widest uppercase text-white font-sans">
                      LUCKEY PRISM
                    </h2>
                    <p className="text-[10px] text-neutral-400 font-mono tracking-tight">
                      SOUL & PRISM CHANNELS
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="메뉴 닫기"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Channel Items Grouped by Category */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 no-scrollbar">
                {/* Category 1: AI 가이드 & 마음약방 (LUCY & KEY) */}
                <div>
                  <div className="px-2 pb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>AI 가이드 & 마음약방</span>
                  </div>
                  <div className="space-y-1">
                    {CORE_CHANNELS.map(renderNavButton)}
                  </div>
                </div>

                {/* Category 2: 7대 프리즘 여정 (PROLOGUE ~ EPILOGUE) */}
                <div className="pt-2 border-t border-white/[0.08]">
                  <div className="px-2 pb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>7대 프리즘 여정</span>
                  </div>
                  <div className="space-y-1">
                    {PRISM_CHANNELS.map(renderNavButton)}
                  </div>
                </div>
              </div>

              {/* Footer: User Profile Button & Collapse Button */}
              <div className="pb-[calc(var(--sab)+1.25rem)] px-4 pt-3 border-t border-white/10 flex items-center justify-between text-neutral-300">
                <button
                  type="button"
                  onClick={() => handleNavigate('/profile')}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl hover:bg-white/[0.08] text-neutral-200 hover:text-white transition-all cursor-pointer group active:scale-95"
                  title="내 프로필 화면으로 이동"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                    <User size={13} />
                  </div>
                  <span className="text-xs font-semibold font-sans">내 프로필</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-xs font-sans active:scale-95"
                  title="메뉴 닫기"
                >
                  <ChevronLeft size={14} />
                  <span>접기</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
