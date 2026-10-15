import React from "react";
import { Route, Switch, Redirect, useLocation } from "wouter";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, User, Volume2, VolumeX, Download, Triangle, RefreshCw, HelpCircle, Sparkles } from "lucide-react";

import { AppProvider, useApp } from "./contexts/AppContext";
import { LoginScreen } from "./components/LoginScreen";
import BottomNav from "./components/BottomNav";
import { BigBangButton } from "./components/omniwarp/BigBangButton";
import { BigBangExpansionOverlay } from "./components/omniwarp/BigBangExpansionOverlay";
import ErrorBoundary from "./components/ErrorBoundary";
import ReloadPrompt from "./components/ReloadPrompt";
import InstallPrompt from "./components/InstallPrompt";
import { GlobalHandbookAudioWidget } from "./components/GlobalHandbookAudioWidget";
import { ChannelIntroModal } from "./components/common/ChannelIntroModal";
import { PageLoader } from "./components/PageLoader";
import { PrismRainbowLoader } from "./components/PrismRainbowLoader";
import { LucyAuraLoader } from "./components/LucyAuraLoader";
import { KeyCosmicLoader } from "./components/KeyCosmicLoader";

import { BgMusicPlayer } from "./components/trinity/BgMusicPlayer";
import { initTTSAudioLifecycle, unlockAudioPlayback, getSharedAudioContext } from "./lib/audio";
import { shouldUsePageTransitions, shouldMountBgMusicPlayer } from "./lib/perfMode";
import AuroraBackground from "./components/AuroraBackground";
import HubHome from "./pages/HubHome";

function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return React.lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return await componentImport();
      } catch (retryError) {
        console.error("Failed to dynamically import module after retry:", retryError);
        throw retryError;
      }
    }
  });
}

const TrinityApp = lazyWithRetry(() => import("./pages/TrinityApp"));
const MuseApp = lazyWithRetry(() => import("./pages/MuseApp"));
const OrangeApp = lazyWithRetry(() => import("./pages/OrangeApp"));
const BluebirdApp = lazyWithRetry(() => import("./pages/BluebirdApp"));
const HealApp = lazyWithRetry(() => import("./pages/HealApp"));
const ProfilePage = lazyWithRetry(() => import("./pages/ProfilePage"));
const LibraryPage = lazyWithRetry(() => import("./pages/LibraryPage"));
const EpilogueApp = lazyWithRetry(() => import("./pages/EpilogueApp"));
const LucyStandalonePage = lazyWithRetry(() => import("./pages/LucyStandalonePage"));
const HandbookStandalonePage = lazyWithRetry(() => import("./pages/HandbookStandalonePage"));
const OmniWarpPage = lazyWithRetry(() => import("./pages/OmniWarpPage"));
const CalmApp = lazyWithRetry(() => import("./pages/CalmApp"));
import { resetAppScroll } from "./utils/scrollToTop";
import { useAutoPrismSync } from "./hooks/useAutoPrismSync";
import { useUpdateNotice } from "./hooks/useUpdateNotice";
import { UpdateNoticeModal } from "./components/UpdateNoticeModal";
import SelectionBridgeToolbar from "./components/SelectionBridgeToolbar";
import { PinLockScreen } from "./components/PinLockScreen";
import { NotchScrollToTopBar } from "./components/NotchScrollToTopBar";
import { UPDATE_ACK_KEY } from "./lib/updateNotice";
import { applyServiceWorkerUpdate, forceAppUpgradeAndReload } from "./lib/prismSync";
import { safeLocalStorage, safeSessionStorage } from "./utils/safeStorage";
import { usePinScreenLock } from "./hooks/usePinScreenLock";
import { resolveCanonicalPath } from "./lib/prismRouteRegistry";

const ROUTES_MAP = [
  { path: "/", Component: HubHome },
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

function ActivePage({ loc }: { loc: string }) {
  const cleanLoc = loc ? loc.split('?')[0].split('#')[0] : '/';
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Switch location={cleanLoc}>
        <Route path="/"><HubHome /></Route>
        <Route path="/prologue"><HubHome /></Route>
        <Route path="/universe"><HubHome /></Route>
        <Route path="/ecpr"><HubHome /></Route>
        <Route path="/todo"><HubHome /></Route>
        <Route path="/mission"><HubHome /></Route>
        <Route path="/synergy"><HubHome /></Route>
        <Route path="/aegis"><HubHome /></Route>
        <Route path="/trinity"><TrinityApp /></Route>
        <Route path="/muse"><MuseApp /></Route>
        <Route path="/orange"><OrangeApp /></Route>
        <Route path="/bluebird"><BluebirdApp /></Route>
        <Route path="/heal"><HealApp /></Route>
        <Route path="/epilogue"><EpilogueApp /></Route>
        <Route path="/library"><LibraryPage /></Route>
        <Route path="/profile"><EpilogueApp /></Route>
        <Route path="/chronicle"><EpilogueApp /></Route>
        <Route path="/handbook"><HandbookStandalonePage /></Route>
        <Route path="/rebible"><HandbookStandalonePage /></Route>
        <Route path="/chat"><LucyStandalonePage /></Route>
        <Route path="/lucy"><LucyStandalonePage /></Route>
        <Route path="/omniwarp"><OmniWarpPage /></Route>
        <Route path="/bigbang"><OmniWarpPage /></Route>
        <Route path="/orb"><CalmApp /></Route>
        <Route path="/gateway"><CalmApp /></Route>
        <Route path="/crystal"><CalmApp /></Route>
        <Route path="/calm"><CalmApp /></Route>
        <Route path="/key"><CalmApp /></Route>
      </Switch>
    </React.Suspense>
  );
}

function AppContent() {
  const { firebaseUser, isAuthReady, logout, signInWithGoogle, sharedState, isUnlocked, unlock, isChatOpen, syncPrismDevices } = useApp();
  const [location, navigate] = useLocation();

  const isFirstMount = React.useRef(true);

  // Instant entrance without artificial screen blocking
  const [appEntranceDone, setAppEntranceDone] = React.useState(true);

  const [checkingUpdate, setCheckingUpdate] = React.useState(false);
  const [updateMessage, setUpdateMessage] = React.useState<string | null>(null);
  const [isTarotActive, setIsTarotActive] = React.useState(false);
  const isTarotActiveRef = React.useRef(isTarotActive);
  isTarotActiveRef.current = isTarotActive;
  const isSessionBusy = React.useCallback(() => isTarotActiveRef.current, []);

  const pinScreenActive = !isUnlocked && !!firebaseUser;
  usePinScreenLock(pinScreenActive);

  React.useEffect(() => {
    const handlePrismNavigate = (e: any) => {
      const targetPath = e?.detail?.path;
      if (targetPath && typeof targetPath === 'string') {
        const safePath = resolveCanonicalPath(targetPath);
        navigate(safePath);
      }
    };

    window.addEventListener("prism-navigate", handlePrismNavigate);
    return () => {
      window.removeEventListener("prism-navigate", handlePrismNavigate);
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

  React.useEffect(() => {
    initTTSAudioLifecycle();
  }, []);

  // Unlock Web Audio from real user gesture once, and detach listeners immediately
  React.useEffect(() => {
    let unlocked = false;
    const cleanupListeners = () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('click', handleUserGesture);
    };

    const handleUserGesture = () => {
      if (!unlocked) {
        unlocked = true;
        unlockAudioPlayback();
        cleanupListeners();
      }
    };

    window.addEventListener('pointerdown', handleUserGesture, { passive: true });
    window.addEventListener('touchstart', handleUserGesture, { passive: true });
    window.addEventListener('click', handleUserGesture, { passive: true });

    return cleanupListeners;
  }, []);

  // 📱 모바일 브라우저 좌우 가장자리 스와이프 시 브라우저 히스토리/다른 앱으로 이탈하는 제스처 차단
  React.useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleEdgeTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleEdgeTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        // 좌우 가장자리 48px 이내에서 시작된 수평 스와이프의 브라우저 히스토리/다른 앱 이탈 방지
        if ((startX < 48 && dx > 8) || (startX > window.innerWidth - 48 && dx < -8)) {
          if (Math.abs(dx) > Math.abs(dy)) {
            if (e.cancelable) e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('touchstart', handleEdgeTouchStart, { passive: true });
    window.addEventListener('touchmove', handleEdgeTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', handleEdgeTouchStart);
      window.removeEventListener('touchmove', handleEdgeTouchMove);
    };
  }, []);


  // 잠금 해제 후에만 테마 색 적용 (PIN 배경은 usePinScreenLock이 고정)
  React.useEffect(() => {
    if (!isUnlocked) return;
    if (sharedState?.themeColor) {
      document.body.style.backgroundColor = sharedState.themeColor;
      document.body.style.transition = 'background-color 2s ease-in-out';
    } else {
      document.body.style.backgroundColor = 'oklch(0.08 0.02 270)';
    }
  }, [isUnlocked, sharedState?.themeColor]);

  const isStandaloneChat = location === '/chat' || location === '/lucy' || location === '/handbook' || location === '/rebible' || location === '/orb' || location === '/gateway' || location === '/crystal' || location === '/key' || location === '/calm';
  const isOrbSite = location === '/orb' || location === '/gateway' || location === '/crystal';
  const isCalmSite = location === '/calm' || location === '/key';
  const isChatView = location === '/chat' || location === '/lucy';

  // Standalone routes bypass full auth gating immediately so they never hang on key/calm/chat entry
  if ((!isAuthReady || !appEntranceDone) && !isStandaloneChat) {
    return (
      <PrismRainbowLoader
        fullScreen
        message="행운과 해답의 문을 여는 중..."
        subMessage="LUCKEY · SOUL SANCTUARY"
      />
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
      </div>
    );
  }

  if (!isUnlocked && !isStandaloneChat) {
    return (
      <div className="prism-app-shell relative z-[1] bg-transparent">
        <PinLockScreen onUnlock={unlock} />
      </div>
    );
  }

  return (
    <div className="prism-app-shell relative z-[1] bg-transparent">
      <NotchScrollToTopBar />
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
            className="fixed top-14 right-4 z-[9999] p-4 rounded-2xl bg-yellow-950/70 border border-yellow-500/30 text-[11px] font-bold text-yellow-400 tracking-wide shadow-[0_10px_35px_rgba(234,179,8,0.25)] backdrop-blur-xl flex items-center gap-2 max-w-xs font-sans"
          >
            <RefreshCw size={12} className="animate-spin text-yellow-400 shrink-0" />
            <span>{updateMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-h-0 overflow-x-hidden flex flex-col relative w-full">
        <motion.div
          key={location ? location.split('?')[0].split('#')[0] : '/'}
          initial={{ opacity: 0.88 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
          className="w-full h-full flex flex-col min-h-0"
        >
          <ActivePage loc={location} />
        </motion.div>
      </main>
      {!isChatOpen && !isStandaloneChat && <BottomNav />}
      <BigBangButton />
      <BigBangExpansionOverlay />

      <ReloadPrompt />
      <InstallPrompt />
      <ChannelIntroModal />
      <GlobalHandbookAudioWidget />
      <SelectionBridgeToolbar />
      <UpdateNoticeModal
        key={updateNoticeKey}
        isOpen={isUpdateNoticeOpen}
        entries={updateEntries}
        mode={updateNoticeMode}
        onClose={dismissUpdateNotice}
        onApply={handleApplyUpdateNow}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuroraBackground />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

// Prism Universe dev auto-bump anchor
