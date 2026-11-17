import { hasOpenScreenOverlay } from './components/layout/ScreenPortal';
import { RetainedPane } from './components/layout/RetainedPane';
import { OverlayPaneContext } from './components/layout/OverlayPaneContext';
import { rememberOverlayPane } from './lib/overlayPane';
import { isLucyThemeRoute } from './lib/lucyDayTheme';
import { TTSFailureNotice } from './components/common/TTSFailureNotice';
import { recordOneStopPageVisit } from './lib/omniWarp/contextNavCycleEngine';
import React from "react";
import { Route, Switch, Redirect, useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, User, Volume2, VolumeX, Download, Triangle, RefreshCw, HelpCircle, Sparkles } from "lucide-react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { ThemeProvider, useTheme, resolveChannelThemeFromPath } from "./contexts/ThemeContext";
import { LoginScreen } from "./components/LoginScreen";
import { useSmartScroll } from "./hooks/useSmartScroll";
import LeftSidebarNav from "./components/navigation/LeftSidebarNav";
import { BigBangButton } from "./components/omniwarp/BigBangButton";
import { BigBangExpansionOverlay } from "./components/omniwarp/BigBangExpansionOverlay";
import ErrorBoundary from "./components/ErrorBoundary";
import ReloadPrompt from "./components/ReloadPrompt";
import InstallPrompt from "./components/InstallPrompt";
import OfflineGuideBanner from "./components/OfflineGuideBanner";
import AppIconPreviewModal from "./components/AppIconPreviewModal";
import { GlobalHandbookAudioWidget } from "./components/GlobalHandbookAudioWidget";
import { ChannelIntroModal } from "./components/common/ChannelIntroModal";
import { LucyVoiceModeModal } from "./components/lucy/LucyVoiceModeModal";
import { PageLoader } from "./components/PageLoader";
import { PrismRainbowLoader } from "./components/PrismRainbowLoader";
import { LucyAuraLoader } from "./components/LucyAuraLoader";
import { KeyCosmicLoader } from "./components/KeyCosmicLoader";

import { GlobalScrollToTopOnHeaderTap } from "./components/navigation/GlobalScrollToTopOnHeaderTap";
import { BgMusicPlayer } from "./components/trinity/BgMusicPlayer";
import { initTTSAudioLifecycle } from "./lib/audio";
import { installGlobalButtonTapSound } from "./lib/globalButtonTapSound";
import { shouldUsePageTransitions, shouldMountBgMusicPlayer, isDualPaneLayout, isDuoUnfoldedState, subscribeDuoLayout } from "./lib/perfMode";
import { isDuoDividerDoubleTap, mapDuoPaneSide, shouldResetDuoPaneSwapOnFold, type DuoDividerTap } from "./lib/duoPaneSwap";
import { DuoCosmicAmbientRoom } from "./components/duo/DuoCosmicAmbientRoom";
import AuroraBackground from "./components/AuroraBackground";
import EpilogueApp from "./pages/EpilogueApp";

function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return React.lazy(async () => {
    const retryDelays = [0, 700, 1800];
    for (let attempt = 0; attempt < retryDelays.length; attempt++) {
      if (retryDelays[attempt]) await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
      try {
        return await componentImport();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const loadingFailure = /ChunkLoadError|Loading chunk|dynamically imported module|Importing a module script|Failed to fetch|module script/i.test(message);
        if (!loadingFailure || attempt === retryDelays.length - 1) throw error;
      }
    }
    throw new Error('화면 파일을 불러오지 못했습니다.');
  });
}

const HubHome = lazyWithRetry(() => import("./pages/HubHome"));
const LucyStandalonePage = lazyWithRetry(() => import("./pages/LucyStandalonePage"));
const TrinityApp = lazyWithRetry(() => import("./pages/TrinityApp"));
const MuseApp = lazyWithRetry(() => import("./pages/MuseApp"));
const OrangeApp = lazyWithRetry(() => import("./pages/OrangeApp"));
const BluebirdApp = lazyWithRetry(() => import("./pages/BluebirdApp"));
const HealApp = lazyWithRetry(() => import("./pages/HealApp"));
const LibraryPage = lazyWithRetry(() => import("./pages/LibraryPage"));
const LucyProPage = lazyWithRetry(() => import("./pages/LucyProPage"));
const HandbookStandalonePage = lazyWithRetry(() => import("./pages/HandbookStandalonePage"));
const OmniWarpPage = lazyWithRetry(() => import("./pages/OmniWarpPage"));
const CalmApp = lazyWithRetry(() => import("./pages/CalmApp"));

// ⚡ 0초 무지연 즉각 채널 전환을 위한 전체 채널 백그라운드 프리로더 (체감 로딩 0ms)
const ALL_CHANNEL_LOADERS = [
  () => import("./pages/LucyStandalonePage"),
  () => import("./pages/CalmApp"),
  () => import("./pages/HubHome"),
  () => import("./pages/OrangeApp"),
  () => import("./pages/TrinityApp"),
  () => import("./pages/HealApp"),
  () => import("./pages/BluebirdApp"),
  () => import("./pages/MuseApp"),
  () => import("./pages/HandbookStandalonePage"),
  () => import("./pages/OmniWarpPage"),
  () => import("./pages/LibraryPage"),
];

let hasPreloadedChannels = false;
export function preloadAllChannelChunks(): void {
  if (hasPreloadedChannels || typeof window === 'undefined') return;
  hasPreloadedChannels = true;

  const preloadNext = async (index: number) => {
    if (index >= ALL_CHANNEL_LOADERS.length) return;
    if (document.visibilityState === 'hidden') {
      setTimeout(() => void preloadNext(index), 3000);
      return;
    }
    try {
      // Wait for one chunk to finish before parsing another large channel.
      await ALL_CHANNEL_LOADERS[index]();
    } catch (_) {}
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => void preloadNext(index + 1), { timeout: 1500 });
    } else {
      setTimeout(() => void preloadNext(index + 1), 400);
    }
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => void preloadNext(0), { timeout: 1200 });
  } else {
    setTimeout(() => void preloadNext(0), 500);
  }
}

import { resetAppScroll } from "./utils/scrollToTop";
import { syncVisualViewportBox, scheduleVisualViewportSync } from "./lib/visualViewportBox";
import { useAutoPrismSync } from "./hooks/useAutoPrismSync";
import { useUpdateNotice } from "./hooks/useUpdateNotice";
import { UpdateNoticeModal } from "./components/UpdateNoticeModal";
import SelectionBridgeToolbar from "./components/SelectionBridgeToolbar";
import { PinLockScreen } from "./components/PinLockScreen";
import { UPDATE_ACK_KEY } from "./lib/updateNotice";
import { applyServiceWorkerUpdate, forceAppUpgradeAndReload } from "./lib/prismSync";
import { APP_VERSION, fetchDeployedAppVersion, compareVersions } from "./lib/appVersion";
import { safeLocalStorage, safeSessionStorage } from "./utils/safeStorage";
import { usePinScreenLock } from "./hooks/usePinScreenLock";
import { useViewportScrollLock } from "./hooks/useViewportScrollLock";
import { resolveCanonicalPath } from "./lib/prismRouteRegistry";
import { resolveFoldCover } from "./lib/duoFoldCover";

const ROUTES_MAP = [
  { path: "/", Component: LucyStandalonePage },
  { path: "/prologue", Component: HubHome },
  { path: "/universe", Component: HubHome },
  { path: "/ecpr", Component: HubHome },
  { path: "/todo", Component: HubHome },
  { path: "/mission", Component: HubHome },
  { path: "/synergy", Component: HubHome },
  { path: "/aegis", Component: HubHome },
  { path: "/trinity", Component: TrinityApp },
  { path: "/muse", Component: MuseApp },
  { path: "/orange", Component: OrangeApp },
  { path: "/bluebird", Component: BluebirdApp },
  { path: "/heal", Component: HealApp },
  { path: "/epilogue", Component: EpilogueApp },
  { path: "/library", Component: LibraryPage },
  { path: "/profile", Component: EpilogueApp },
  { path: "/chronicle", Component: EpilogueApp },
  { path: "/handbook", Component: HandbookStandalonePage },
  { path: "/rebible", Component: HandbookStandalonePage },
  { path: "/chat/pro", Component: LucyProPage },
  { path: "/chat", Component: LucyStandalonePage },
  { path: "/lucy", Component: LucyStandalonePage },
  { path: "/omniwarp", Component: OmniWarpPage },
  { path: "/bigbang", Component: OmniWarpPage },
  { path: "/orb", Component: CalmApp },
  { path: "/gateway", Component: CalmApp },
  { path: "/crystal", Component: CalmApp },
  { path: "/calm", Component: CalmApp },
  { path: "/key", Component: CalmApp },
];

function SuspendedPage({ children }: { children: React.ReactNode }) {
  return <React.Suspense fallback={<PageLoader />}>{children}</React.Suspense>;
}

function ActivePage({ loc }: { loc: string }) {
  const cleanLoc = loc ? loc.split('?')[0].split('#')[0] : '/';
  return (
    <ErrorBoundary key={cleanLoc}>
      <Switch location={cleanLoc}>
        <Route path="/"><SuspendedPage><LucyStandalonePage /></SuspendedPage></Route>
        <Route path="/prologue"><SuspendedPage><HubHome /></SuspendedPage></Route>
        <Route path="/universe"><SuspendedPage><HubHome /></SuspendedPage></Route>
        <Route path="/ecpr"><SuspendedPage><HubHome /></SuspendedPage></Route>
        <Route path="/todo"><SuspendedPage><HubHome /></SuspendedPage></Route>
        <Route path="/mission"><SuspendedPage><HubHome /></SuspendedPage></Route>
        <Route path="/synergy"><SuspendedPage><HubHome /></SuspendedPage></Route>
        <Route path="/aegis"><SuspendedPage><HubHome /></SuspendedPage></Route>
        <Route path="/trinity"><React.Suspense fallback={<PageLoader />}><TrinityApp /></React.Suspense></Route>
        <Route path="/muse"><React.Suspense fallback={<PageLoader />}><MuseApp /></React.Suspense></Route>
        <Route path="/orange"><React.Suspense fallback={<PageLoader />}><OrangeApp /></React.Suspense></Route>
        <Route path="/bluebird"><React.Suspense fallback={<PageLoader />}><BluebirdApp /></React.Suspense></Route>
        <Route path="/heal"><React.Suspense fallback={<PageLoader />}><HealApp /></React.Suspense></Route>
        <Route path="/epilogue"><EpilogueApp /></Route>
        <Route path="/library"><React.Suspense fallback={<PageLoader />}><LibraryPage /></React.Suspense></Route>
        <Route path="/profile"><EpilogueApp /></Route>
        <Route path="/chronicle"><EpilogueApp /></Route>
        <Route path="/handbook"><React.Suspense fallback={<PageLoader />}><HandbookStandalonePage /></React.Suspense></Route>
        <Route path="/rebible"><React.Suspense fallback={<PageLoader />}><HandbookStandalonePage /></React.Suspense></Route>
        <Route path="/chat/pro"><React.Suspense fallback={<PageLoader />}><LucyProPage /></React.Suspense></Route>
        <Route path="/chat"><SuspendedPage><LucyStandalonePage /></SuspendedPage></Route>
        <Route path="/lucy"><SuspendedPage><LucyStandalonePage /></SuspendedPage></Route>
        <Route path="/omniwarp"><React.Suspense fallback={<PageLoader />}><OmniWarpPage /></React.Suspense></Route>
        <Route path="/bigbang"><React.Suspense fallback={<PageLoader />}><OmniWarpPage /></React.Suspense></Route>
        <Route path="/orb"><React.Suspense fallback={<PageLoader />}><CalmApp /></React.Suspense></Route>
        <Route path="/gateway"><React.Suspense fallback={<PageLoader />}><CalmApp /></React.Suspense></Route>
        <Route path="/crystal"><React.Suspense fallback={<PageLoader />}><CalmApp /></React.Suspense></Route>
        <Route path="/calm"><React.Suspense fallback={<PageLoader />}><CalmApp /></React.Suspense></Route>
        <Route path="/key"><React.Suspense fallback={<PageLoader />}><CalmApp /></React.Suspense></Route>
      </Switch>
    </ErrorBoundary>
  );
}

// Folded and unfolded channels render the exact same page tree and transitions.
function ChannelPage({ location }: { location: string }) {
  const path = location.split('?')[0].split('#')[0];
  const isLuckyChannel = !isLucyThemeRoute(path) && resolveChannelThemeFromPath(path) === 'dark';
  return (
    <motion.div
      key={path}
      initial={['/epilogue', '/profile', '/chronicle'].includes(path) ? false : { opacity: 0.88 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      className="channel-page w-full h-full flex flex-col min-h-0"
    >
      {isLuckyChannel && <AuroraBackground channel />}
      <div className="channel-page-content relative z-[1] w-full h-full flex flex-col min-h-0">
        <ActivePage loc={location} />
      </div>
    </motion.div>
  );
}

/** Keep the Lucy component identity stable even when the display folds. */
function LegacyLucyRoute({ location }: { location: string }) {
  const [, navigate] = useLocation();
  React.useEffect(() => {
    if (location === '/chat/pro') navigate('/chat', { replace: true });
  }, [location, navigate]);
  return <LucyStandalonePage />;
}

function GlobalTTSScroll() {
  useSmartScroll();
  return null;
}

function AppContent() {
  const { firebaseUser, isAuthReady, logout, signInWithGoogle, sharedState, isUnlocked, unlock, isChatOpen, syncPrismDevices } = useApp();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const [location, navigate] = useLocation();
  const locationSearch = useSearch();

  // 📱 iPhone Duo 7.6" 펼침 / 접힘 및 세로(상하)/가로(좌우) 레이아웃 실시간 감지
  const [duoState, setDuoState] = React.useState(() => {
    if (typeof window === 'undefined') return { unfolded: false, orientation: 'portrait' as const };
    return isDuoUnfoldedState();
  });
  const isDuoUnfolded = duoState.unfolded;
  const isDuoPortrait = isDuoUnfolded && duoState.orientation === 'portrait';
  const isDuoLandscape = isDuoUnfolded && duoState.orientation === 'landscape';
  const [duoPanesSwapped, setDuoPanesSwapped] = React.useState(false);
  const isDuoPanesSwapped = isDuoLandscape && duoPanesSwapped;
  const duoDividerTapRef = React.useRef<DuoDividerTap | null>(null);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('duo-panels-swapped', isDuoPanesSwapped);
    document.body.classList.toggle('duo-panels-swapped', isDuoPanesSwapped);
    return () => {
      document.documentElement.classList.remove('duo-panels-swapped');
      document.body.classList.remove('duo-panels-swapped');
    };
  }, [isDuoPanesSwapped]);

  const handleDuoDividerPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const currentTap: DuoDividerTap = {
      timestamp: Date.now(),
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
    };
    if (isDuoDividerDoubleTap(duoDividerTapRef.current, currentTap)) {
      duoDividerTapRef.current = null;
      setDuoPanesSwapped((previous) => !previous);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    duoDividerTapRef.current = currentTap;
  };

  const handleDuoDividerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) setDuoPanesSwapped((previous) => !previous);
  };

  // 📱 iPhone Duo 펼친 상태에서 마지막으로 터치한 패널(좌측 vs 우측) 및 마지막 좌측 채널 경로 추적
  const lastTouchedDuoPaneRef = React.useRef<'left' | 'right'>('right');
  const lastLeftChannelPathRef = React.useRef<string>('/key');
  const previousUnfoldedRef = React.useRef(duoState.unfolded);
  const [foldedCosmicRoom, setFoldedCosmicRoom] = React.useState(false);

  React.useEffect(() => {
    const handleLayoutChange = () => {
      if (typeof window === 'undefined') return;
      const state = isDuoUnfoldedState();
      const wasUnfolded = previousUnfoldedRef.current;
      const isNowUnfolded = state.unfolded;
      previousUnfoldedRef.current = isNowUnfolded;

      setDuoState(previous => previous.unfolded === state.unfolded && previous.orientation === state.orientation ? previous : state);
      document.documentElement.classList.toggle('duo-unfolded-mode', state.unfolded);
      document.body.classList.toggle('duo-unfolded-mode', state.unfolded);
      document.documentElement.classList.toggle('duo-unfolded-portrait', state.unfolded && state.orientation === 'portrait');
      document.body.classList.toggle('duo-unfolded-portrait', state.unfolded && state.orientation === 'portrait');
      document.documentElement.classList.toggle('duo-unfolded-landscape', state.unfolded && state.orientation === 'landscape');
      document.body.classList.toggle('duo-unfolded-landscape', state.unfolded && state.orientation === 'landscape');

      // 펼침 ↔ 접힘 전환 시: 뷰포트 박스 재동기화 및 잔여 탭 상태 초기화(먹통 방지)
      if (wasUnfolded !== isNowUnfolded) {
        duoDividerTapRef.current = null;
        syncVisualViewportBox(window);
        scheduleVisualViewportSync(window);
      }

      // 펼침 → 접힘: 좌우 순서를 초기화해 다음 재펼침 때 Lucy를 오른쪽에 둔다.
      // 진행 중이던 경계 더블탭도 취소한다.
      // 좌측이 코스믹 룸이면 이전 채널로 보내지 않고 코스믹 룸을 유지한다.
      // 접힌 채로 가로로 돌리는 것은 이 전환이 아니다. 지금 페이지만 가로로 남긴다.
      if (shouldResetDuoPaneSwapOnFold(wasUnfolded, isNowUnfolded)) {
        setDuoPanesSwapped(false);
        duoDividerTapRef.current = null;
        const cover = resolveFoldCover({
          lastTouched: lastTouchedDuoPaneRef.current,
          currentPath: window.location.pathname || '/',
          lastLeftChannelPath: lastLeftChannelPathRef.current,
        });
        if (cover.kind === 'cosmic') {
          setFoldedCosmicRoom(true);
        } else {
          setFoldedCosmicRoom(false);
          // A fold-driven route change would destroy the channel's live dialogs.
          // Retain both page trees until the user explicitly navigates instead.
          if (cover.navigateTo && !hasOpenScreenOverlay()) navigate(cover.navigateTo);
        }
      }
    };
    handleLayoutChange();
    window.addEventListener('resize', handleLayoutChange, { passive: true });
    window.addEventListener('orientationchange', handleLayoutChange, { passive: true });
    window.visualViewport?.addEventListener('resize', handleLayoutChange, { passive: true });
    const unsubscribeDuo = subscribeDuoLayout(handleLayoutChange);
    return () => {
      window.removeEventListener('resize', handleLayoutChange);
      window.removeEventListener('orientationchange', handleLayoutChange);
      window.visualViewport?.removeEventListener('resize', handleLayoutChange);
      unsubscribeDuo();
    };
  }, [navigate]);

  const isFirstMount = React.useRef(true);

  // Instant entrance without artificial screen blocking
  const [appEntranceDone, setAppEntranceDone] = React.useState(true);

  const [checkingUpdate, setCheckingUpdate] = React.useState(false);
  const [updateMessage, setUpdateMessage] = React.useState<string | null>(null);
  const [isTarotActive, setIsTarotActive] = React.useState(false);
  const isTarotActiveRef = React.useRef(isTarotActive);
  isTarotActiveRef.current = isTarotActive;
  const isSessionBusy = React.useCallback(() => isTarotActiveRef.current, []);

  const pinScreenActive = !isUnlocked;
  usePinScreenLock(pinScreenActive);
  useViewportScrollLock();

  // 📱 세로/가로(Portrait & Landscape) 자유 회전 지원: 기존 방향 잠금 해제
  React.useEffect(() => {
    try {
      const scrOrientation = (window.screen as any)?.orientation;
      if (scrOrientation && typeof scrOrientation.unlock === "function") {
        scrOrientation.unlock();
      }
    } catch (_) {}
  }, []);

  const lockedLocationRef = React.useRef(location || '/');
  const lockedFullUrlRef = React.useRef(
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search || ''}${window.location.hash || ''}`
      : '/'
  );

  React.useEffect(() => {
    const clean = location ? location.split('?')[0].split('#')[0] : '/';
    lockedLocationRef.current = clean || '/';
    if (typeof window !== 'undefined') {
      lockedFullUrlRef.current = `${window.location.pathname}${window.location.search || ''}${window.location.hash || ''}`;
    }
  }, [location, locationSearch]);

  React.useEffect(() => {
    const markIntentionalNav = () => {
      if (typeof window !== 'undefined') {
        (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
      }
    };

    const handlePrismNavigate = (e: any) => {
      const targetPath = e?.detail?.path;
      if (targetPath && typeof targetPath === 'string') {
        markIntentionalNav();
        setFoldedCosmicRoom(false);
        const safePath = resolveCanonicalPath(targetPath);
        navigate(safePath);
      }
    };

    window.addEventListener("prism-navigate", handlePrismNavigate);
    window.addEventListener("nav-click-active", markIntentionalNav);
    window.addEventListener("prism:bigbang_commit", markIntentionalNav);
    window.addEventListener("prism:cycle_nav", markIntentionalNav);
    return () => {
      window.removeEventListener("prism-navigate", handlePrismNavigate);
      window.removeEventListener("nav-click-active", markIntentionalNav);
      window.removeEventListener("prism:bigbang_commit", markIntentionalNav);
      window.removeEventListener("prism:cycle_nav", markIntentionalNav);
    };
  }, [navigate]);

  React.useEffect(() => {
    const handleActive = () => setIsTarotActive(true);
    const handleInactive = () => setIsTarotActive(false);

    window.addEventListener("tarot-active", handleActive);
    window.addEventListener("tarot-inactive", handleInactive);
    window.addEventListener("special-feature-active", handleActive);
    window.addEventListener("special-feature-inactive", handleInactive);

    return () => {
      window.removeEventListener("tarot-active", handleActive);
      window.removeEventListener("tarot-inactive", handleInactive);
      window.removeEventListener("special-feature-active", handleActive);
      window.removeEventListener("special-feature-inactive", handleInactive);
    };
  }, []);

  const syncEnabled = isAuthReady && !!firebaseUser && isUnlocked;

  const { runSync, applyDeferredReload } = useAutoPrismSync({
    enabled: syncEnabled,
    sync: syncPrismDevices,
    isSessionBusy,
    onMessage: setUpdateMessage,
    onCheckingChange: setCheckingUpdate,
  });

  const {
    isOpen: isUpdateNoticeOpen,
    entries: updateEntries,
    mode: updateNoticeMode,
    noticeKey: updateNoticeKey,
    dismiss: dismissUpdateNotice,
    showManualSyncNotice,
  } = useUpdateNotice(syncEnabled);

  const handleApplyUpdateNow = async () => {
    dismissUpdateNotice();
    setCheckingUpdate(true);
    setUpdateMessage("최신 업데이트 적용 중...");
    const reloading = await applyDeferredReload();
    if (!reloading) {
      const swState = await applyServiceWorkerUpdate();
      if (swState === 'reloading') return;
      window.setTimeout(() => window.location.reload(), 400);
    }
  };

  const handleUpdateCheck = async () => {
    setCheckingUpdate(true);
    setUpdateMessage("PC·모바일 최신 동기화 및 업그레이드 확인 중...");
    try {
      const result = await runSync({ silent: false, force: true, deferReload: false });

      if (result) {
        safeLocalStorage.setItem(UPDATE_ACK_KEY, result.targetVersion);

        if (result.needsReload) {
          setUpdateMessage(`최신 v${result.targetVersion}으로 업데이트 적용 중...`);
          await forceAppUpgradeAndReload();
          return;
        }
      }

      // Non-blocking changelog display if already up-to-date
      void showManualSyncNotice(result?.targetVersion);
    } catch (e) {
      console.warn('[ManualSync] Error:', e);
      setUpdateMessage('현재 최신 데이터로 동기화 완료되었습니다.');
    } finally {
      setCheckingUpdate(false);
      window.setTimeout(() => setUpdateMessage(null), 3500);
    }
  };

  React.useEffect(() => {
    const handleOpenNotice = async () => {
      try {
        const deployedVer = await fetchDeployedAppVersion();
        void showManualSyncNotice(deployedVer || APP_VERSION);
      } catch (_) {
        void showManualSyncNotice();
      }
    };
    window.addEventListener('prism:open-update-notice', handleOpenNotice);
    return () => window.removeEventListener('prism:open-update-notice', handleOpenNotice);
  }, [showManualSyncNotice]);

  React.useEffect(() => {
    setIsTarotActive(false);
    resetAppScroll();
  }, [location]);

  // Redirect unknown routes
  React.useEffect(() => {
    const validPaths = ROUTES_MAP.map(r => r.path);
    const cleanCurrent = location ? location.split('?')[0].split('#')[0] : '/';
    if (!validPaths.includes(cleanCurrent)) {
      navigate("/");
    }
    if (cleanCurrent === '/orb' || cleanCurrent === '/gateway' || cleanCurrent === '/crystal') {
      navigate('/key');
    }
  }, [location, navigate]);

  // 🔄 최신 배포 버전 자동 감지 및 즉시 캐시 갱신 반영
  React.useEffect(() => {
    fetchDeployedAppVersion().then((deployed) => {
      if (deployed && compareVersions(deployed, APP_VERSION) > 0) {
        void forceAppUpgradeAndReload();
      }
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    // 🎧 오디오 세션 불변칙: 앱 첫 마운트에서 오디오를 절대 점유하지 않습니다.
    // initTTSAudioLifecycle()은 AudioContext를 만지거나 세션을 점유할 수 있으므로,
    // 외부 음악(멜론·스포티파이·애플뮤직)이 켜져 있어도 그대로 흐르도록
    // 첫 사용자 상호작용(탭/키 입력)이 있을 때까지 미룹니다.
    let initialized = false;
    const initOnce = () => {
      if (initialized) return;
      initialized = true;
      try { initTTSAudioLifecycle(); } catch (_) {}
      try { preloadAllChannelChunks(); } catch (_) {}
      window.removeEventListener('pointerdown', initOnce);
      window.removeEventListener('keydown', initOnce);
      window.removeEventListener('touchstart', initOnce);
    };
    window.addEventListener('pointerdown', initOnce, { passive: true });
    window.addEventListener('keydown', initOnce);
    window.addEventListener('touchstart', initOnce, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', initOnce);
      window.removeEventListener('keydown', initOnce);
      window.removeEventListener('touchstart', initOnce);
    };
  }, []);

  // 📱 모바일 화면 좌우 스와이프 페이지 변경 원천 차단 (빅뱅 버튼 및 명시적 버튼 조작만 허용)
  React.useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isInsideHorizontalScroller = false;
    let isInsideBigBang = false;
    let touchActive = false;
    let touchMoved = false;
    let maxTouchMove = 0;
    let startedOnControl = false;
    let suppressTouchClickUntil = 0;
    let gestureLockedUrl = '';
    const clearGestureLock = () => { gestureLockedUrl = ''; };

    const getSafeInsets = () => {
      try {
        const style = window.getComputedStyle(document.documentElement);
        const sal = parseFloat(style.getPropertyValue('--sal')) || 0;
        const sar = parseFloat(style.getPropertyValue('--sar')) || 0;
        return { sal, sar };
      } catch {
        return { sal: 0, sar: 0 };
      }
    };

    const handleEdgeTouchStart = (e: TouchEvent) => {
      touchActive = e.touches.length === 1;
      touchMoved = false;
      maxTouchMove = 0;
      startedOnControl = !!((e.target as HTMLElement | null)?.closest('button, a, [role="button"], input, textarea, select, label'));
      suppressTouchClickUntil = 0;
      // Capture the address before native history moves, even during a lazy route transition.
      gestureLockedUrl = window.location.pathname + window.location.search + window.location.hash;
      // A previous button click must not authorize a new browser swipe.
      (window as any).__prismAllowRouteChangeUntil = 0;
      if (touchActive) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        const target = e.target as HTMLElement | null;
        isInsideBigBang = !!target?.closest(
          '#bigbang-omnibutton, [data-bigbang="true"]'
        );
        isInsideHorizontalScroller = !!target?.closest(
          '.overflow-x-auto, .overflow-x-scroll, [data-allow-x-scroll], input[type="range"]'
        );
      }
    };

    const handleEdgeTouchMove = (e: TouchEvent) => {
      if (touchActive && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        maxTouchMove = Math.max(maxTouchMove, Math.hypot(dx, dy));
        if (maxTouchMove >= 12) {
          touchMoved = true;
          suppressTouchClickUntil = Date.now() + 800;
        }
        // A control owns the gesture. preventDefault here is what makes iOS cancel the tap.
        if (startedOnControl || isInsideBigBang) return;

        const { sal, sar } = getSafeInsets();
        const leftGuard = Math.max(52, sal + 44);
        const rightGuard = Math.max(52, sar + 44);

        // 1. 좌우 가장자리에서 시작된 수평 스와이프의 브라우저 뒤로/앞으로(페이지 변경) 원천 차단
        if ((startX <= leftGuard && dx > 3) || (startX >= window.innerWidth - rightGuard && dx < -3)) {
          if (absDx > absDy * 0.7) {
            (window as any).__prismLastScreenSwipeAt = Date.now();
            (window as any).__prismAllowRouteChangeUntil = 0;
            if (e.cancelable) e.preventDefault();
            return;
          }
        }

        // 2. 화면 일반 영역에서 좌우로 스와이프할 때 페이지 전환 및 수평 바운스 원천 차단
        if (!isInsideHorizontalScroller && absDx > 8 && absDx > absDy * 1.05) {
          (window as any).__prismLastScreenSwipeAt = Date.now();
          (window as any).__prismAllowRouteChangeUntil = 0;
          if (e.cancelable) e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      touchActive = false;
      if (touchMoved) suppressTouchClickUntil = Date.now() + 800;
    };
    const handleTouchCancel = () => {
      touchActive = false;
      // Stationary taps inside clipped chrome are reported as touchcancel.
      // Only a gesture that actually moved should swallow the following click.
      if (!touchMoved && maxTouchMove < 48) return;
      suppressTouchClickUntil = Date.now() + 800;
      (window as any).__prismLastScreenSwipeAt = Date.now();
      (window as any).__prismAllowRouteChangeUntil = 0;
    };
    const handleHorizontalWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 8 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      gestureLockedUrl = window.location.pathname + window.location.search + window.location.hash;
      (window as any).__prismLastScreenSwipeAt = Date.now();
      (window as any).__prismAllowRouteChangeUntil = 0;
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.overflow-x-auto, .overflow-x-scroll, [data-allow-x-scroll], input[type="range"]') && e.cancelable) e.preventDefault();
    };

    // 3. 명시적인 UI 버튼/링크 클릭 시에는 라우트 변경 허용 타임스탬프 갱신
    const handleExplicitClickCapture = (e: MouseEvent) => {
      const pointerType = (e as PointerEvent).pointerType;
      const touchGenerated = pointerType === 'touch' || pointerType === 'pen' || (!pointerType && e.detail > 0 && (e as any).sourceCapabilities?.firesTouchEvents !== false);
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('button, a, [role="button"], input, textarea, select, label');
      if (!(interactive && maxTouchMove < 48) && touchGenerated && Date.now() < suppressTouchClickUntil) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (target?.closest('button, a, [role="button"], [data-bigbang="true"]')) {
        clearGestureLock();
        (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
      }
    };

    // 4. 모바일 브라우저 제스처 네비게이션(좌우 스와이프 popstate)으로 인한 의도치 않은 페이지 변경 차단
    const handlePopStateCapture = (e: PopStateEvent) => {
      const now = Date.now();
      const allowUntil = Number((window as any).__prismAllowRouteChangeUntil || 0);
      const lastSwipeAt = Number((window as any).__prismLastScreenSwipeAt || 0);
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth <= 1024;

      // 모바일/터치 환경에서 빅뱅 버튼이나 명시적 버튼 클릭 없이 발생한 스와이프성 popstate는 즉시 차단하고 현재 페이지 유지
      if ((isTouchDevice || now - lastSwipeAt < 2500) && now > allowUntil) {
        e.stopImmediatePropagation();
        const lockedUrl = gestureLockedUrl || lockedFullUrlRef.current || lockedLocationRef.current || '/';
        try {
          window.history.pushState(null, '', lockedUrl);
        } catch (_) {}
        navigate(lockedUrl, { replace: true });
      }
    };

    const resetTouchGestureState = () => {
      touchActive = false;
      touchMoved = false;
      maxTouchMove = 0;
      suppressTouchClickUntil = 0;
    };

    window.addEventListener('touchstart', handleEdgeTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleEdgeTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, true);
    window.addEventListener('touchcancel', handleTouchCancel, true);
    window.addEventListener('wheel', handleHorizontalWheel, { passive: false, capture: true });
    window.addEventListener('click', handleExplicitClickCapture, true);
    window.addEventListener('popstate', handlePopStateCapture, true);
    window.addEventListener('resize', resetTouchGestureState, { passive: true });
    window.addEventListener('orientationchange', resetTouchGestureState, { passive: true });
    const navigationEvents = ['prism-navigate', 'nav-click-active', 'prism:bigbang_commit', 'prism:cycle_nav'];
    navigationEvents.forEach(name => window.addEventListener(name, clearGestureLock));
    return () => {
      window.removeEventListener('touchstart', handleEdgeTouchStart, true);
      window.removeEventListener('touchmove', handleEdgeTouchMove, true);
      window.removeEventListener('touchend', handleTouchEnd, true);
      window.removeEventListener('touchcancel', handleTouchCancel, true);
      window.removeEventListener('wheel', handleHorizontalWheel, true);
      window.removeEventListener('click', handleExplicitClickCapture, true);
      window.removeEventListener('popstate', handlePopStateCapture, true);
      window.removeEventListener('resize', resetTouchGestureState);
      window.removeEventListener('orientationchange', resetTouchGestureState);
      navigationEvents.forEach(name => window.removeEventListener(name, clearGestureLock));
    };
  }, [navigate]);


  // 잠금 해제 후에만 테마 색 적용 (PIN 배경은 usePinScreenLock이 고정)
  React.useEffect(() => {
    if (!isUnlocked) return;
    if (resolvedTheme === 'light') {
      document.body.style.backgroundColor = '#fdfaf5';
      document.body.style.transition = 'background-color 0.4s ease-in-out';
    } else if (sharedState?.themeColor) {
      document.body.style.backgroundColor = sharedState.themeColor;
      document.body.style.transition = 'background-color 2s ease-in-out';
    } else {
      document.body.style.backgroundColor = 'oklch(0.08 0.02 270)';
    }
  }, [isUnlocked, sharedState?.themeColor, resolvedTheme]);

  const isLucyRoute = location === '/' || location === '/chat' || location === '/lucy' || location === '/chat/pro';
  const showLucyPane = isDuoUnfolded || (isLucyRoute && !foldedCosmicRoom);
  const showContentPane = isDuoUnfolded || !showLucyPane;

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const isCosmicActive = isDuoUnfolded && isLucyRoute;
    document.documentElement.classList.toggle('duo-cosmic-active', isCosmicActive);
    document.body.classList.toggle('duo-cosmic-active', isCosmicActive);
  }, [isDuoUnfolded, isLucyRoute]);

  // 📱 좌/우측 패널 터치 감지 및 좌측 채널 경로 동기화
  React.useEffect(() => {
    if (!isLucyRoute) {
      lastLeftChannelPathRef.current = location;
    }
  }, [location, isLucyRoute]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalPointer = (e: Event) => {
      rememberOverlayPane(e.target, e instanceof MouseEvent && e.detail !== 0 ? { x: e.clientX, y: e.clientY } : undefined);
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('#duo-lucy-viewport')) {
        lastTouchedDuoPaneRef.current = mapDuoPaneSide('right', isDuoPanesSwapped);
        return;
      }

      if (target.closest('#duo-content-viewport')) {
        lastTouchedDuoPaneRef.current = mapDuoPaneSide('left', isDuoPanesSwapped);
        if (!isLucyRoute) {
          lastLeftChannelPathRef.current = location;
        }
        return;
      }
    };

    const handleNavClick = (e: any) => {
      const p = e?.detail?.path;
      if (p) setFoldedCosmicRoom(false);
      if (p === '/' || p === '/chat' || p === '/lucy') {
        lastTouchedDuoPaneRef.current = mapDuoPaneSide('right', isDuoPanesSwapped);
      } else if (p) {
        lastTouchedDuoPaneRef.current = mapDuoPaneSide('left', isDuoPanesSwapped);
        lastLeftChannelPathRef.current = p;
      }
    };

    window.addEventListener('pointerdown', handleGlobalPointer, { capture: true, passive: true });
    window.addEventListener('touchstart', handleGlobalPointer, { capture: true, passive: true });
    window.addEventListener('click', handleGlobalPointer, { capture: true, passive: true });
    window.addEventListener('nav-click-active', handleNavClick);

    return () => {
      window.removeEventListener('pointerdown', handleGlobalPointer, { capture: true });
      window.removeEventListener('touchstart', handleGlobalPointer, { capture: true });
      window.removeEventListener('click', handleGlobalPointer, { capture: true });
      window.removeEventListener('nav-click-active', handleNavClick);
    };
  }, [isLucyRoute, isDuoPanesSwapped, location]);
  const isKeyRoute = location === '/key' || location === '/calm';
  const isDistractionFreeRoute =
    location === '/handbook' ||
    location === '/rebible' ||
    location === '/orb' ||
    location === '/gateway' ||
    location === '/crystal';
  const isStandaloneChat = isLucyRoute || isKeyRoute || isDistractionFreeRoute;
  const isOrbSite = location === '/orb' || location === '/gateway' || location === '/crystal';
  const isCalmSite = location === '/calm' || location === '/key';
  const isChatView = isLucyRoute;

  const updateNotice = (
    <OverlayPaneContext.Provider value="main">
      <UpdateNoticeModal
        key={updateNoticeKey}
        isOpen={isUpdateNoticeOpen}
        entries={updateEntries}
        mode={updateNoticeMode}
        onClose={dismissUpdateNotice}
        onApply={handleApplyUpdateNow}
      />
    </OverlayPaneContext.Provider>
  );

  // Standalone routes bypass full auth gating immediately so they never hang on key/calm/chat entry
  if ((!isAuthReady || !appEntranceDone) && !isStandaloneChat) {
    return (
      <>
        <PrismRainbowLoader
          fullScreen
          message="행운과 해답의 문을 여는 중..."
          subMessage="LUCKEY · SOUL SANCTUARY"
        />
        {updateNotice}
      </>
    );
  }

  const hasStoredAuthUid = (() => {
    try {
      return !!safeSessionStorage.getItem('prism_auth_uid');
    } catch {
      return false;
    }
  })();

  if (!firebaseUser && !isStandaloneChat) {
    return (
      <div className="prism-app-shell relative z-[1] bg-transparent">
        <LoginScreen />
        {updateNotice}
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="prism-app-shell relative z-[1] bg-transparent">
        <PinLockScreen onUnlock={unlock} />
        {updateNotice}
      </div>
    );
  }

  return (
    <div className={`prism-app-shell relative z-[1] bg-transparent ${isLucyRoute ? 'in-lucy-chat' : ''}`}>

      {/* Draggable & Edge-Dockable Background Music Player */}
      {shouldMountBgMusicPlayer() && (
        <BgMusicPlayer />
      )}


      <AnimatePresence>
        {updateMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            data-sidebar-aware="true"
            className="fixed top-14 right-4 z-[9999] p-4 rounded-2xl bg-yellow-950/70 border border-yellow-500/30 text-[11px] font-bold text-yellow-400 tracking-wide shadow-[0_10px_35px_rgba(234,179,8,0.25)] backdrop-blur-xl flex items-center gap-2 max-w-xs font-sans"
          >
            <RefreshCw size={12} className="animate-spin text-yellow-400 shrink-0" />
            <span>{updateMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`sites-pinned-main flex-1 min-h-0 overflow-x-hidden relative w-full ${isDuoUnfolded ? `duo-dual-view flex ${isDuoPortrait ? 'flex-col' : isDuoPanesSwapped ? 'flex-row-reverse' : 'flex-row'}` : 'flex flex-col'}`}>
          <div className={`w-full h-full min-h-0 overflow-hidden flex relative ${!isDuoUnfolded ? 'flex-col' : isDuoPortrait ? 'flex-col' : isDuoPanesSwapped ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* 콘텐츠 뷰포트:
                - 가로(Landscape): 물리 힌지 기준 기기 절반 (50vw)
                - 세로(Portrait): 상단 50%
             */}
            <div
              id={isDuoUnfolded ? "duo-content-viewport" : undefined}
              data-workspace-pane="content"
              data-responsive-canvas="true"
              onPointerDownCapture={() => {
                lastTouchedDuoPaneRef.current = mapDuoPaneSide('left', isDuoPanesSwapped);
                if (!isLucyRoute) lastLeftChannelPathRef.current = location;
              }}
              onTouchStartCapture={() => {
                lastTouchedDuoPaneRef.current = mapDuoPaneSide('left', isDuoPanesSwapped);
                if (!isLucyRoute) lastLeftChannelPathRef.current = location;
              }}
              style={
                !isDuoUnfolded
                  ? { display: showContentPane ? 'flex' : 'none', width: '100%', height: '100%', flex: '1 1 0%', minHeight: 0 }
                  : isDuoPortrait
                  ? { height: '50%', minHeight: '50%', maxHeight: '50%', width: '100%', flex: '0 0 50%' }
                  : { width: '50vw', minWidth: '50vw', maxWidth: '50vw', height: '100%', flex: '0 0 50vw' }
              }
              className="duo-folded-view shrink-0 flex flex-col overflow-hidden relative border-none"
            >
              <OverlayPaneContext.Provider value="content">
                <RetainedPane active={showContentPane}>
                  {isLucyRoute ? (
                    /* 최우측/최하단 메뉴에서 루시 선택 시 ➔ 코스믹 룸 표출 */
                    <div className="w-full h-full overflow-hidden flex flex-col">
                      <DuoCosmicAmbientRoom isLight={isLight} />
                    </div>
                  ) : (
                    /* 최우측/최하단 메뉴에서 KEY 또는 럭키 채널 선택 시 ➔ 해당 페이지 표출 */
                    <ChannelPage location={location} />
                  )}
                </RetainedPane>
              </OverlayPaneContext.Provider>
            </div>

            {/* 루시 채팅창:
                - 가로(Landscape): 우측 기기 절반 (네비게이션 80px 포함 50vw 구성)
                - 세로(Portrait): 하단 50%
                - 시간대별 루시 고유 테마(아침·낮·밤) 100% 온전히 반영
             */}
            <div
              id={isDuoUnfolded ? "duo-lucy-viewport" : undefined}
              data-workspace-pane="lucy"
              data-responsive-canvas="true"
              onPointerDownCapture={() => {
                lastTouchedDuoPaneRef.current = mapDuoPaneSide('right', isDuoPanesSwapped);
              }}
              onTouchStartCapture={() => {
                lastTouchedDuoPaneRef.current = mapDuoPaneSide('right', isDuoPanesSwapped);
              }}
              style={
                !isDuoUnfolded
                  ? { display: showLucyPane ? 'flex' : 'none', width: '100%', height: '100%', flex: '1 1 0%', minHeight: 0 }
                  : isDuoPortrait
                  ? { height: '50%', minHeight: '50%', maxHeight: '50%', width: '100%', flex: '0 0 50%' }
                  : { flex: '1 1 0px', width: 'calc(50vw - var(--sites-sidebar-width, 80px))', height: '100%' }
              }
              className="shrink-0 min-h-0 flex flex-col overflow-hidden z-10 relative border-none"
            >
              <OverlayPaneContext.Provider value="lucy">
                <RetainedPane active={showLucyPane}>
                  <ErrorBoundary>
                    <React.Suspense fallback={<PageLoader />}>
                      <LegacyLucyRoute location={location} />
                    </React.Suspense>
                  </ErrorBoundary>
                </RetainedPane>
              </OverlayPaneContext.Provider>
            </div>
            {isDuoLandscape && (
              <button
                type="button"
                aria-label={isDuoPanesSwapped ? '좌우 화면 배치를 원래대로 바꾸기' : '좌우 화면 바꾸기'}
                aria-pressed={isDuoPanesSwapped}
                title="가운데 경계를 두 번 탭하면 좌우 화면을 바꿉니다"
                data-duo-divider-swap
                onPointerUp={handleDuoDividerPointerUp}
                onPointerCancel={() => { duoDividerTapRef.current = null; }}
                onClick={handleDuoDividerClick}
                className="absolute inset-y-0 z-[80] flex w-12 -translate-x-1/2 items-center justify-center border border-transparent bg-transparent text-transparent opacity-0 shadow-none backdrop-blur-none focus-visible:opacity-100 focus-visible:border-white/60 focus-visible:bg-zinc-950/75 focus-visible:shadow-xl cursor-pointer touch-manipulation"
                style={{ left: '50vw', touchAction: 'manipulation' }}
              >
              </button>
            )}
          </div>
      </main>
      <OneStopVisitTracker />
      <GlobalScrollToTopOnHeaderTap />
      <LeftSidebarNav />
      <BigBangButton />
      <BigBangExpansionOverlay />

      <ReloadPrompt />
      <InstallPrompt />
      <OfflineGuideBanner />
      <ChannelIntroModal />
      <GlobalHandbookAudioWidget />
      <TTSFailureNotice />
      <LucyVoiceModeModal />
      <SelectionBridgeToolbar />
      <AppIconPreviewModal />
      {updateNotice}
    </div>
  );
}

export default function App() {
  React.useEffect(() => {
    // 앱 전체 버튼 클릭음(tap_light) 1회 등록 — 모든 채널·모달·엔진함 버튼 공통
    installGlobalButtonTapSound();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuroraBackground />
        <AppProvider>
          <GlobalTTSScroll />
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Prism Universe dev auto-bump anchor

function OneStopVisitTracker() {
  const [location] = useLocation();
  const search = useSearch();
  React.useEffect(() => {
    const params = new URLSearchParams(search);
    const tab = params.get('tab') || sessionStorage.getItem('prism_target_tab');
    recordOneStopPageVisit(location + (tab ? '?tab=' + encodeURIComponent(tab) : ''));
    const onTab = (event: Event) => {
      const tab = (event as CustomEvent<{ tab?: string }>).detail?.tab;
      if (typeof tab === 'string') recordOneStopPageVisit(location + '?tab=' + encodeURIComponent(tab));
    };
    window.addEventListener('prism-tab-change', onTab);
    return () => window.removeEventListener('prism-tab-change', onTab);
  }, [location, search]);
  return null;
}
