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
  X,
  Clover,
  KeyRound,
  User,
  Library,
  BookOpen,
  Compass,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { OPEN_NAVIGATION_MENU_EVENT, TOGGLE_NAVIGATION_MENU_EVENT, readMenuBounds } from '@/lib/navigationMenu';
import './floating-menu.css';
import { useApp, getPersistentUserProfile } from '@/contexts/AppContext';
import { getPermanentAvatar } from '@/lib/profileVault';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { APP_VERSION } from '@/lib/appVersion';
import { ViewportDiagnostics } from './ViewportDiagnostics';
import {
  getContextCycleStats,
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
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isChannelsOpen, setIsChannelsOpen] = useState(true);
  const [showViewportDiagnostics, setShowViewportDiagnostics] = useState(false);
  const handleCloseDrawer = useCallback(() => setIsOpen(false), []);
  const [bounds, setBounds] = useState(readMenuBounds);
  useEffect(() => {
    const update = () => {
      setBounds(readMenuBounds());
    };
    let openingFrame = 0;
    const open = () => {
      update();
      cancelAnimationFrame(openingFrame);
      // Let the releasing pointer's compatibility click finish before mounting the backdrop.
      openingFrame = requestAnimationFrame(() => setIsOpen(true));
    };
    const toggle = () => {
      update();
      cancelAnimationFrame(openingFrame);
      openingFrame = requestAnimationFrame(() => setIsOpen(current => !current));
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener(TOGGLE_NAVIGATION_MENU_EVENT, toggle);
    window.addEventListener('keydown', escape);
    window.addEventListener(OPEN_NAVIGATION_MENU_EVENT, open);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    return () => {
      cancelAnimationFrame(openingFrame);
      window.removeEventListener(TOGGLE_NAVIGATION_MENU_EVENT, toggle);
      window.removeEventListener('keydown', escape);
      window.removeEventListener(OPEN_NAVIGATION_MENU_EVENT, open);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);
  const panelRef = useRef<HTMLElement>(null);
  const [, setProfileVersion] = useState(0);
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
        const res = peekNextRecommendedMenuByCycle(cleanPath);
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

  const cycleProgress = getContextCycleStats(location + window.location.search);
  const recommendedPrismPath = topRecommendation
    ? topRecommendation.menu.basePath
    : '/trinity';
  // Extract user profile / nickname and avatar URL for sidebar footer
  let userNickname = '제제';
  let userAvatarUrl: string | undefined = undefined;
  try {
    const { sharedState, firebaseUser } = appContext;
    const rawNick = sharedState?.userProfile?.basic?.nickname?.trim();
    const fallbackNick = getPersistentUserProfile()?.basic?.nickname?.trim();
    const chosen = rawNick || fallbackNick;
    userNickname = (chosen && chosen !== '여행자' && chosen !== '사용자' && chosen !== '박주형') ? chosen : '제제';
    const permAvatar = getPermanentAvatar();
    userAvatarUrl = sharedState?.userProfile?.basic?.avatarUrl || getPersistentUserProfile()?.basic?.avatarUrl || (permAvatar || undefined) || firebaseUser?.photoURL || undefined;
  } catch {
    const fallbackNick = getPersistentUserProfile()?.basic?.nickname?.trim();
    userNickname = (fallbackNick && fallbackNick !== '여행자' && fallbackNick !== '사용자' && fallbackNick !== '박주형') ? fallbackNick : '제제';
    const permAvatar = getPermanentAvatar();
    userAvatarUrl = getPersistentUserProfile()?.basic?.avatarUrl || (permAvatar || undefined) || undefined;
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

  // Broadcast sidebar open/closed state so widgets like LP player can sync visibility
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('left-sidebar-state', { detail: { isOpen } }));
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    handleCloseDrawer();
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
    const isActive = isMainChat ? isLucyActive : isKey ? isKeyActive : isLuckey ? isChannelsOpen : isPrologue ? isPrologueActive : path === '/epilogue' ? isEpilogueActive : cleanPath === path || cleanPath.startsWith(path + '/');
    const isCore = Boolean(isMainChat || isKey || isLuckey);
    const recommended = !isCore && path === recommendedPrismPath;
    return (
      <button
        key={path}
        type="button"
        className={`luckey-menu-card ${isCore ? 'luckey-menu-core' : ''} ${isActive ? 'is-active' : ''}`}
        style={{ '--channel-color': color } as React.CSSProperties}
        onClick={() => isLuckey ? setIsChannelsOpen(open => !open) : handleNavigate(path)}
        aria-label={isLuckey ? 'LUCKEY 7개 채널' : label}
        aria-current={!isLuckey && isActive ? 'page' : undefined}
        aria-expanded={isLuckey ? isChannelsOpen : undefined}
        aria-controls={isLuckey ? 'luckey-prism-channels' : undefined}
      >
        <span className="luckey-menu-card-icon"><Icon size={isCore ? 22 : 20} /></span>
        <span className="luckey-menu-card-copy"><span className="luckey-menu-card-name">{label}</span><span className="luckey-menu-card-description">{isLuckey ? '일곱 빛깔의 하루' : subLabel}</span></span>
        {recommended && <span className="luckey-menu-recommended">추천</span>}
      </button>
    );
  };

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.section
              ref={panelRef}
              id="luckey-menu-dialog"
              role="dialog"
              aria-modal="false"
              aria-labelledby="luckey-menu-title"
              data-theme={isLight ? 'light' : 'dark'}
              className="luckey-menu-panel luckey-left-sidebar"
              style={{ position: 'fixed', left: bounds.left, top: bounds.top, width: Math.min(300, Math.max(0, bounds.width - 96)), height: bounds.height }}
              initial={reduceMotion ? false : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : '-100%', opacity: reduceMotion ? 0 : 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={event => event.stopPropagation()}
            >
              <header className="luckey-menu-heading">
                <span className="luckey-menu-emblem" aria-hidden="true"><span className="luckey-menu-orb-core" /></span>
                <div className="luckey-menu-heading-copy"><h2 id="luckey-menu-title">BIGBANG</h2><p>나의 우주를 고르는 팔레트</p></div>
                <button type="button" className="luckey-menu-close" onClick={handleCloseDrawer} aria-label="메뉴 닫기"><X size={18} /></button>
              </header>
              <nav aria-label="빅뱅 채널 메뉴" className="luckey-menu-content luckey-sidebar-nav">
                {CORE_CHANNELS.map(renderNavButton)}
                {isChannelsOpen && <div id="luckey-prism-channels" className="luckey-sidebar-channels">{PRISM_CHANNELS.map(renderNavButton)}</div>}
                {AUXILIARY_CHANNELS.filter(item => item.path !== '/bigbang').map(renderNavButton)}
              </nav>
              <footer className="luckey-menu-footer">
                <div className="luckey-menu-tools">
                  <button type="button" className="luckey-menu-tool" onPointerDown={handleBgmPointerDown} onPointerMove={handleBgmPointerMove} onPointerUp={handleBgmPointerUp} onPointerLeave={handleBgmPointerUp} onPointerCancel={handleBgmPointerUp} onClick={handleBgmClick} onContextMenu={handleBgmContextMenu} aria-label={bgmState.isPlaying ? '배경음 일시정지' : '배경음 재생'}>
                    <LPRecordDisc isPlaying={bgmState.isPlaying} isBuffering={bgmState.isBuffering} size="sm" className="pointer-events-none" /><span>{isBgmHolding ? '설정 열기…' : '배경음'}</span>
                  </button>
                  <button type="button" className="luckey-menu-tool" onClick={() => handleNavigate('/library')}><Library size={19} /><span>보관함</span></button>
                  <button type="button" className="luckey-menu-tool" aria-label={`${userNickname}의 프로필`} aria-current={isProfileActive ? 'page' : undefined} onClick={() => handleNavigate('/profile')}>
                    {userAvatarUrl ? <img src={userAvatarUrl} alt="" className="luckey-menu-avatar" /> : <User size={19} />}<span>내 프로필</span>
                  </button>
                </div>
                <div className="luckey-menu-signature"><span>작은 우주를 잇는 빅뱅</span><button type="button" onClick={() => { handleCloseDrawer(); setShowViewportDiagnostics(true); }} aria-label={`앱 버전 ${APP_VERSION}, 화면 영역 진단 열기`}>v{APP_VERSION}</button></div>
              </footer>
            </motion.section>
          )}
        </AnimatePresence>, document.body
      )}
      {showViewportDiagnostics && <ViewportDiagnostics onClose={() => setShowViewportDiagnostics(false)} />}
    </>
  );
}
