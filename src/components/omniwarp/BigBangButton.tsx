import { getDestinationChannel } from '@/lib/channelMenuIcons';
import { createPortal } from 'react-dom';
import { BigBangLuckyBreeze } from './BigBangLuckyBreeze';
import { LUCY_PRO_PATH } from '@/lib/lucyChatPageMode';
import { LUCY_PRO_DEEP_PERSPECTIVE_COUNT } from '@/lib/divination/engineCatalogCount';
import { getOrderedLuckeyPageKeysForCurrentApp, oneStopNavigationPath, nextOrderedLuckeyPage, previousOrderedLuckeyPage } from '@/lib/omniWarp/oneStopPages';
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ChevronUp, ChevronDown, Clover, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WarpPhase, OmniWarpTarget, OmniWarpContext } from '@/lib/omniWarp/types';
import { calculateWarpMetrics, forceToAiTemperature, WARP_ABORT_DISTANCE } from '@/lib/omniWarp/forceSensor';
import { serializeCurrentView, synthesizeWarpTarget, isDisallowedWarpDestination } from '@/lib/omniWarp/omniWarpEngine';
import {
  getWhiteholeRecommendedApp,
  getBlackholeRecommendedApp,
} from '@/lib/omniWarp/wormholeSpectrum';
import { getTossRule } from '@/lib/prismTossRegistry';
import { resolveCanonicalPath, isValidPrismPath } from '@/lib/prismRouteRegistry';
import { resetActiveWormholePeek } from '@/lib/omniWarp/wormholeShuffleEngine';
import {
  getCurrentOneStopPage,
  peekNextRecommendedMenuByCycle,
  commitNextRecommendedMenuByCycle,
  resetActiveContextPeek,
} from '@/lib/omniWarp/contextNavCycleEngine';
import { omniWarpAudio } from '@/lib/omniWarp/omniWarpAudio';
import { triggerHaptic, startBlackHoleContinuousHaptic, stopBlackHoleContinuousHaptic } from '@/lib/omniWarp/omniWarpHaptics';
import { safeSessionStorage, safeLocalStorage } from '@/utils/safeStorage';
import { peekPendingSelection, clearPendingSelection, getLiveSelectedText } from '@/lib/selectionBridge';
import { isDuoUnfoldedState, isDualPaneLayout } from '@/lib/perfMode';
import { BigBangCircularMeter } from './BigBangCircularMeter';
// 🎯 미세 드래그 판정 임계값 (터치스크린 미세 떨림/지문 면적 20px 노이즈 면역 + 확실한 드래그 제스처 감지)
const DRAG_ACTIVATION_THRESHOLD = 26;

const SIDEBAR_APP_ORDER: { path: string; aliases: string[] }[] = [
  { path: '/', aliases: ['/', '/chat', '/lucy'] },
  { path: '/key', aliases: ['/key', '/calm', '/orb', '/gateway', '/crystal', '/pharmacy'] },
  { path: '/prologue', aliases: ['/prologue', '/universe', '/ecpr', '/todo', '/mission', '/synergy', '/aegis'] },
  { path: '/orange', aliases: ['/orange'] },
  { path: '/trinity', aliases: ['/trinity', '/oracle'] },
  { path: '/heal', aliases: ['/heal', '/aura'] },
  { path: '/bluebird', aliases: ['/bluebird'] },
  { path: '/muse', aliases: ['/muse'] },
  { path: '/epilogue', aliases: ['/epilogue', '/profile', '/chronicle'] },
];

function getAdjacentSidebarAppPath(currentLocation: string, direction: 'previous' | 'next') {
  const currentPath = (currentLocation || '/').split(/[?#]/)[0] || '/';
  const currentIndex = SIDEBAR_APP_ORDER.findIndex(({ aliases }) => aliases.some((alias) =>
    currentPath === alias || (alias !== '/' && currentPath.startsWith(`${alias}/`))
  ));
  if (currentIndex < 0) return null;
  const offset = direction === 'next' ? 1 : -1;
  const nextIndex = (currentIndex + offset + SIDEBAR_APP_ORDER.length) % SIDEBAR_APP_ORDER.length;
  return SIDEBAR_APP_ORDER[nextIndex].path;
}

export function BigBangButton() {
  let location = '/';
  let navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = to;
    }
  };

  try {
    const [wouterLoc, wouterNav] = useLocation();
    location = wouterLoc;
    navigate = wouterNav;
  } catch (_) {
    if (typeof window !== 'undefined') {
      location = window.location.pathname;
    }
  }

  const isKeySite =
    location === '/key' ||
    location === '/calm' ||
    location === '/orb' ||
    location === '/gateway' ||
    location === '/crystal' ||
    (typeof window !== 'undefined' && (
      window.location.pathname.includes('key') ||
      window.location.pathname.includes('calm') ||
      window.location.pathname.includes('orb')
    ));

  const checkIsInLucyChat = useCallback(() => {
    const cleanLoc = (location || '').split('?')[0].split('#')[0] || '/';
    const winPath =
      typeof window !== 'undefined'
        ? (window.location.pathname || '/').split('?')[0].split('#')[0]
        : '/';
    const isSplitChannelView = isDualPaneLayout() && typeof document !== 'undefined' &&
      Boolean(document.getElementById('duo-content-viewport'));
    const isDomInLucyChat = !isSplitChannelView &&
      typeof document !== 'undefined' &&
      (document.documentElement.classList.contains('in-lucy-chat') ||
        document.body.classList.contains('in-lucy-chat') ||
        Boolean(document.querySelector('.lucy-chat-shell')));
    return (
      cleanLoc === '/' ||
      cleanLoc === '/chat' ||
      cleanLoc === '/lucy' ||
      winPath === '/' ||
      winPath === '/chat' ||
      winPath === '/lucy' ||
      winPath.includes('/chat') ||
      winPath.includes('/lucy') ||
      isDomInLucyChat
    );
  }, [location]);

  const isChatView = checkIsInLucyChat();
  const currentCleanPath = (location || '/').split(/[?#]/)[0] || '/';
  const windowCleanPath = typeof window !== 'undefined' ? (window.location.pathname || '/').split(/[?#]/)[0] || '/' : currentCleanPath;
  const isKeyChannel = [currentCleanPath, windowCleanPath].some((path) =>
    ['/key', '/calm', '/orb', '/gateway', '/crystal', '/pharmacy'].some((alias) => path === alias || path.startsWith(`${alias}/`))
  );
  const currentOneStopPage = getCurrentOneStopPage(location);
  const currentAppPages = getOrderedLuckeyPageKeysForCurrentApp(currentOneStopPage);
  const isCycleNavigationDisabled = isChatView || isKeyChannel || currentAppPages.length < 2;
  const previousAppPath = getAdjacentSidebarAppPath(location, 'previous');
  const nextAppPath = getAdjacentSidebarAppPath(location, 'next');
  const directionTargets = {
    north: previousAppPath ? getDestinationChannel(previousAppPath) : null,
    south: nextAppPath ? getDestinationChannel(nextAppPath) : null,
    west: isCycleNavigationDisabled ? null : getDestinationChannel(previousOrderedLuckeyPage(currentOneStopPage)),
    east: isCycleNavigationDisabled ? null : getDestinationChannel(nextOrderedLuckeyPage(currentOneStopPage)),
  };

  const [isPressing, setIsPressing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCosmicSuctionActive, setIsCosmicSuctionActive] = useState(false);
  const recommendedWarpInFlightRef = useRef(false);
  const [activePhase, setActivePhase] = useState<WarpPhase>('idle');
  const [gauge, setGauge] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [aiTemp, setAiTemp] = useState(0);
  const [currentTarget, setCurrentTarget] = useState<OmniWarpTarget | null>(null);
  const [isAborted, setIsAborted] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const maxDragDistanceRef = useRef<number>(0);

  // 💬 루시 퀵 대화 말풍선 열림 여부, 음성모드 여부 및 초기 프롬프트 상태
  const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
  const [quickChatVoiceActive, setQuickChatVoiceActive] = useState(false);
  const [quickChatInitialPrompt, setQuickChatInitialPrompt] = useState('');
  const [quickChatAutoSend, setQuickChatAutoSend] = useState(false);

  // 🎯 OmniWarp BigBang Controller: 화이트홀(빛비춤) · 블랙홀(어두운 심연) 상태
  const [activeHole, setActiveHole] = useState<'whitehole' | 'blackhole'>('whitehole');
  const lastHoleRef = useRef<'whitehole' | 'blackhole'>('whitehole');

  const lastSectorRef = useRef<number>(-1);
  const cachedContextRef = useRef<OmniWarpContext | null>(null);
  const lastUpdateGaugeRef = useRef<number>(0);
  const lastStateUpdateTimeRef = useRef<number>(0);

  // ⚡ 더블탭 감지용 타이머 및 이전 탭 타임스탬프 ref
  const lastTapTimeRef = useRef<number>(0);
  const singleTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🎙️ PTT (Push-to-Talk) 음성 입력 진행 중 여부 ref
  const isPttRecordingRef = useRef<boolean>(false);

  // 🎙️ 루시 AI 실시간 음성모드 연동 상태 (열림 여부 및 경청/생각/발화 단계)
  const [voiceModeInfo, setVoiceModeInfo] = useState<{
    isOpen: boolean;
    state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
  }>({ isOpen: false, state: 'idle' });

  useEffect(() => {
    const handleVoiceState = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail) {
        setVoiceModeInfo({
          isOpen: !!detail.isOpen,
          state: detail.state || 'idle',
        });
      }
    };
    window.addEventListener('prism:lucy_voice_state', handleVoiceState);
    return () => {
      window.removeEventListener('prism:lucy_voice_state', handleVoiceState);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
      }
    };
  }, []);

  // 🧭 상하좌우 원뿔 모양 모핑 방향 ('none' | 'north' | 'south' | 'west' | 'east')
  // 🛡️ 가상 키보드 활성화, 상단 검색창 활성화 또는 하단 입력창 포커스 시 FAB 버튼을 완전히 숨겨 화면 가림 및 스크롤 충돌 방지
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const check = () => {
      const open =
        document.documentElement.classList.contains('keyboard-open') ||
        document.body.classList.contains('keyboard-open') ||
        document.documentElement.classList.contains('lucy-search-active') ||
        document.body.classList.contains('lucy-search-active') ||
        document.documentElement.classList.contains('lucy-input-focused') ||
        document.body.classList.contains('lucy-input-focused') ||
        Boolean(document.querySelector('.lucy-search-active, .lucy-input-focused, [data-lucy-search-active="true"], [data-lucy-input-focused="true"]'));
      setIsKeyboardOpen(open);
    };
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-lucy-search-active', 'data-lucy-input-focused'] });
    if (document.body) {
      obs.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-lucy-input-focused'] });
    }
    return () => obs.disconnect();
  }, []);

  const [hoverDirection, setHoverDirection] = useState<'none' | 'north' | 'south' | 'west' | 'east'>('none');
  const downDirectionRef = useRef<'none' | 'north' | 'south' | 'west' | 'east'>('none');
  const [clickedDirection, setClickedDirection] = useState<typeof hoverDirection>('none');
  const directionFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const centerDirection = isPressing ? hoverDirection : clickedDirection;
  const [feedbackChannel, setFeedbackChannel] = useState<ReturnType<typeof getDestinationChannel> | null>(null);
  const DestinationIcon = feedbackChannel?.icon;
  const navigationFeedbackStorageKey = 'luckey-bigbang-navigation-feedback';
  const [gestureFeedback, setGestureFeedback] = useState<'tap' | 'hold' | 'double' | null>(null);
  const gestureFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const centerGesture = isPressing && durationMs >= 220 && hoverDirection === 'none' ? 'hold' : gestureFeedback;
  const showGestureFeedback = (gesture: 'tap' | 'hold' | 'double') => {
    if (gestureFeedbackTimer.current) clearTimeout(gestureFeedbackTimer.current);
    if (directionFeedbackTimer.current) clearTimeout(directionFeedbackTimer.current);
    try { sessionStorage.removeItem(navigationFeedbackStorageKey); } catch { /* ignore */ }
    setClickedDirection('none');
    setGestureFeedback(gesture);
    gestureFeedbackTimer.current = setTimeout(() => setGestureFeedback(null), 1200);
  };
  const showDirectionFeedback = (direction: typeof hoverDirection, destination?: string) => {
    setFeedbackChannel(destination ? getDestinationChannel(destination) : null);
    setGestureFeedback(null);
    if (gestureFeedbackTimer.current) clearTimeout(gestureFeedbackTimer.current);
    if (directionFeedbackTimer.current) clearTimeout(directionFeedbackTimer.current);
    setClickedDirection(direction);
    const feedbackDurationMs = destination ? 4000 : 1000;
    if (destination) {
      try {
        sessionStorage.setItem(navigationFeedbackStorageKey, JSON.stringify({
          direction,
          destination,
          expiresAt: Date.now() + feedbackDurationMs,
        }));
      } catch { /* ignore */ }
    } else {
      try { sessionStorage.removeItem(navigationFeedbackStorageKey); } catch { /* ignore */ }
    }
    directionFeedbackTimer.current = setTimeout(() => {
      setClickedDirection('none');
      setFeedbackChannel(null);
      try { sessionStorage.removeItem(navigationFeedbackStorageKey); } catch { /* ignore */ }
    }, feedbackDurationMs);
  };
  const navigateToAdjacentMenuApp = (direction: 'previous' | 'next', feedbackDirection: 'north' | 'south') => {
    const path = getAdjacentSidebarAppPath(location, direction);
    if (!path) return false;
    showDirectionFeedback(feedbackDirection, path);
    (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
    try {
      sessionStorage.setItem('prism_bigbang_navigation_target', JSON.stringify({
        path: new URL(path, window.location.href).pathname,
        timestamp: Date.now(),
      }));
    } catch { /* ignore */ }
    navigate(path);
    window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path } }));
    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path } }));
    return true;
  };
  useEffect(() => () => {
    if (directionFeedbackTimer.current) clearTimeout(directionFeedbackTimer.current);
    if (gestureFeedbackTimer.current) clearTimeout(gestureFeedbackTimer.current);
  }, []);
  useEffect(() => {
    let stored: { direction?: string; destination?: string; expiresAt?: number } | null = null;
    try {
      const raw = sessionStorage.getItem(navigationFeedbackStorageKey);
      if (raw) stored = JSON.parse(raw);
    } catch { /* ignore */ }
    const validDirections = ['north', 'south', 'west', 'east'];
    const remainingMs = Number(stored?.expiresAt) - Date.now();
    if (!stored || !validDirections.includes(stored.direction || '') || !stored.destination || remainingMs <= 0) {
      try { sessionStorage.removeItem(navigationFeedbackStorageKey); } catch { /* ignore */ }
      return;
    }
    setFeedbackChannel(getDestinationChannel(stored.destination));
    setClickedDirection(stored.direction as typeof hoverDirection);
    directionFeedbackTimer.current = setTimeout(() => {
      setClickedDirection('none');
      setFeedbackChannel(null);
      try { sessionStorage.removeItem(navigationFeedbackStorageKey); } catch { /* ignore */ }
    }, remainingMs);
  }, []);

  // 🎯 확장 가로 분할에서는 원래 Lucy 패널 중심에 버튼을 두고, 세로 분할과 단독 화면은 기존 위치를 유지합니다.
  const [panelCenterLeft, setPanelCenterLeft] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateCenter = () => {
      // Restore the button's original landscape position over Lucy. Direction handlers
      // still resolve from the current channel location, so left/right stays in that pane.
      const duoContent = document.getElementById('duo-content-viewport');
      const duoLucy = document.getElementById('duo-lucy-viewport');
      const isExpandedLandscapeSplit = Boolean(
        duoContent && duoLucy && (
          document.documentElement.classList.contains('duo-unfolded-landscape') ||
          document.body.classList.contains('duo-unfolded-landscape')
        ),
      );
      const target = isExpandedLandscapeSplit
        ? duoLucy
        : duoContent || duoLucy || document.querySelector('.lucy-chat-shell') || document.querySelector('.sites-pinned-main');
      if (target) {
        const rect = target.getBoundingClientRect();
        if (rect.width > 0) {
          const centerX = Math.round(rect.left + rect.width / 2);
          setPanelCenterLeft(centerX);
          document.documentElement.style.setProperty('--lucy-chat-center-x', `${centerX}px`);
          if (duoContent && duoLucy) {
            const bottomOffset = Math.max(0, window.innerHeight - rect.bottom + 12);
            document.documentElement.style.setProperty('--duo-content-bottom-offset', `${bottomOffset}px`);
          } else {
            document.documentElement.style.removeProperty('--duo-content-bottom-offset');
          }
          return;
        }
      }
      // 3. Fallback: 사이드바 제외 정중앙
      const sidebar = document.querySelector('.sites-pinned-sidebar');
      const sbWidth = sidebar ? sidebar.getBoundingClientRect().width : 80;
      const fallbackCenter = Math.round((window.innerWidth - sbWidth) / 2);
      setPanelCenterLeft(fallbackCenter);
      document.documentElement.style.setProperty('--lucy-chat-center-x', `${fallbackCenter}px`);
      document.documentElement.style.removeProperty('--duo-content-bottom-offset');
    };

    updateCenter();
    window.addEventListener('resize', updateCenter, { passive: true });
    window.addEventListener('orientationchange', updateCenter, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateCenter());
      const duoContent = document.getElementById('duo-content-viewport');
      if (duoContent) ro.observe(duoContent);
      const duoLucy = document.getElementById('duo-lucy-viewport');
      if (duoLucy) ro.observe(duoLucy);
      const main = document.querySelector('.sites-pinned-main');
      if (main) ro.observe(main);
    }

    const mo = new MutationObserver(() => updateCenter());
    mo.observe(document.body, { childList: true, subtree: true });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('resize', updateCenter);
      window.removeEventListener('orientationchange', updateCenter);
      ro?.disconnect();
      mo.disconnect();
    };
  }, []);

  // ☁️ 탭 & 홀드 시 뭉게구름 피어오름(Cloud Genesis) 이펙트 상태
  const [cloudBurstSeed, setCloudBurstSeed] = useState<number>(0);
  const cloudBurstTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🎯 마우스 및 터치 위치 기반 4방위(상/하/좌/우) 물방울 방향 계산
  const calculateCardinalDirection = useCallback(
    (clientX: number, clientY: number): 'none' | 'north' | 'south' | 'west' | 'east' => {
      const el = hoverContainerRef.current || buttonRef.current;
      if (!el) return 'none';
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);

      // 중심 코어 (18px 미만)는 완벽한 원형 유지, 74px 초과는 범위 이탈
      if (dist < 18 || dist > 74) {
        return 'none';
      }

      // 우세 축에 따른 상/하/좌/우 판별
      if (Math.abs(dy) >= Math.abs(dx)) {
        return dy < 0 ? 'north' : 'south';
      } else {
        return dx < 0 ? 'west' : 'east';
      }
    },
    []
  );

  // 💧 45° 대각 정렬 기반 4방위 물방울(Teardrop) 모핑 변형값
  // 정사각형 외피를 +45° 고정 회전한 상태에서 각 꼭짓점(tl=상, tr=우, br=하, bl=좌)의 곡률만 뾰족하게 조여
  // 별도의 외부 도형 없이 검은 동그라미 자체가 해당 방향으로 물방울처럼 살짝 뾰족히 올라오도록 구현
  const morphStyles = useMemo(() => {
    if (dragDistance >= DRAG_ACTIVATION_THRESHOLD) {
      return {
        borderRadius: '50% 50% 50% 50%',
        x: isPressing
          ? (dragDistance > 0 ? (dragOffset.x * Math.min(dragDistance * 0.6, 40)) / dragDistance : 0)
          : 0,
        y: isPressing
          ? (dragDistance > 0 ? (dragOffset.y * Math.min(dragDistance * 0.6, 40)) / dragDistance : 0)
          : 0,
      };
    }
    switch (hoverDirection) {
      case 'north':
        return {
          borderRadius: '10% 50% 54% 50%',
          x: 0,
          y: -6,
        };
      case 'east':
        return {
          borderRadius: '50% 10% 50% 54%',
          x: 6,
          y: 0,
        };
      case 'south':
        return {
          borderRadius: '54% 50% 10% 50%',
          x: 0,
          y: 6,
        };
      case 'west':
        return {
          borderRadius: '50% 54% 50% 10%',
          x: -6,
          y: 0,
        };
      case 'none':
      default:
        return {
          borderRadius: '50% 50% 50% 50%',
          x: 0,
          y: 0,
        };
    }
  }, [hoverDirection, dragDistance, isPressing, dragOffset]);

  // 🎯 현재 활성화된 브라우저 텍스트 선택(스크롤) 내용 추출 (취소되었거나 비어있으면 '' 반환)
  // 일반 본문 노드뿐만 아니라 input/textarea 빈칸 입력창 및 방금 보존된 pending selection까지 완벽 지원
  const getActiveSelectionText = useCallback((): string => {
    if (typeof window === 'undefined') return '';
    // 1. 현재 브라우저 실시간 선택 텍스트 (input, textarea 빈칸 및 일반 본문 포함)
    const live = getLiveSelectedText();
    if (live && live.length >= 2) return live;

    // 2. 버튼 클릭/터치 시 포커스 이동 등으로 selection이 방금 해제된 경우: 보존된 대기 스토리지 확인
    const pending = peekPendingSelection();
    if (pending && pending.sourcePath && resolveCanonicalPath(pending.sourcePath) === resolveCanonicalPath(location) && !pending.target && pending.text && pending.text.trim().length >= 2) {
      return pending.text.trim();
    }
    return '';
  }, [location]);

  // Capture selected text for tap-to-Lucy and hold-to-Plus.
  const [hasSelectionToss, setHasSelectionToss] = useState(false);
  const [selectionPreviewText, setSelectionPreviewText] = useState('');
  const touchStartSelectionRef = useRef<string>('');
  const lastValidSelectionRef = useRef<string>('');

  useEffect(() => {
    clearPendingSelection();
    lastValidSelectionRef.current = '';
    touchStartSelectionRef.current = '';
    setHasSelectionToss(false);
    setSelectionPreviewText('');
  }, [location]);

  useEffect(() => {
    const updateSelectionState = () => {
      if (typeof window === 'undefined') return;

      // 🛡️ 조작 중일 때는 선택 상태를 강제 해제하지 않음
      if (touchStartRef.current || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('bigbang_pressing') === 'true')) {
        return;
      }

      const text = getActiveSelectionText();

      // 🛡️ 더블탭 입력 간격(450ms 이내) 중 포커스 이동 등으로 인한 일시적 빈 선택 무시
      const recentTapTime = typeof sessionStorage !== 'undefined' ? Number(sessionStorage.getItem('bigbang_recent_tap') || '0') : 0;
      if (!text && Date.now() - recentTapTime < 450) {
        return;
      }

      // 🎯 스크롤(선택) 취소 감지:
      // 브라우저 텍스트 선택이 해제되거나 비어있으면 토스 모드 및 대기 스토리지 즉각 취소!
      if (!text) {
        lastValidSelectionRef.current = '';
        clearPendingSelection();
        setHasSelectionToss(false);
        setSelectionPreviewText('');
        return;
      }

      lastValidSelectionRef.current = text;
      setHasSelectionToss(true);
      setSelectionPreviewText(text.slice(0, 24));
    };

    const handleSaved = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.text && detail.text.length >= 2) {
        lastValidSelectionRef.current = detail.text;
        setHasSelectionToss(true);
        setSelectionPreviewText(detail.text.slice(0, 24));
      }
    };

    const handleTossedOrCleared = () => {
      lastValidSelectionRef.current = '';
      clearPendingSelection();
      setHasSelectionToss(false);
      setSelectionPreviewText('');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        lastValidSelectionRef.current = '';
        clearPendingSelection();
        setHasSelectionToss(false);
        setSelectionPreviewText('');
      }
    };

    let selDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedUpdateSelection = () => {
      if (selDebounceTimer) clearTimeout(selDebounceTimer);
      selDebounceTimer = setTimeout(() => {
        updateSelectionState();
      }, 90);
    };

    document.addEventListener('selectionchange', debouncedUpdateSelection, { passive: true });
    document.addEventListener('select', debouncedUpdateSelection, true); // 빈칸(input/textarea) 선택 감지
    document.addEventListener('mouseup', debouncedUpdateSelection, { passive: true });
    document.addEventListener('touchend', debouncedUpdateSelection, { passive: true });
    window.addEventListener('prism:selection_saved', handleSaved);
    window.addEventListener('prism:selection_tossed', handleTossedOrCleared);
    window.addEventListener('prism:selection_cleared', handleTossedOrCleared);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (selDebounceTimer) clearTimeout(selDebounceTimer);
      document.removeEventListener('selectionchange', debouncedUpdateSelection);
      document.removeEventListener('select', debouncedUpdateSelection, true);
      document.removeEventListener('mouseup', debouncedUpdateSelection);
      document.removeEventListener('touchend', debouncedUpdateSelection);
      window.removeEventListener('prism:selection_saved', handleSaved);
      window.removeEventListener('prism:selection_tossed', handleTossedOrCleared);
      window.removeEventListener('prism:selection_cleared', handleTossedOrCleared);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [getActiveSelectionText]);

  // Active view context and next destination pre-vision (수정구슬 영시)
  const currentContext = serializeCurrentView(location);
  const normPath = location.replace('/', '') || 'hub';
  const tossRule = getTossRule(normPath, `${currentContext.summary} ${currentContext.primarySubject || ''}`);
  
  // profile, handbook, library, omniwarp 4대 페이지는 워프 이동 대상에서 엄격 배제
  const sanitizeDest = (dest: any) => {
    if (!dest || isDisallowedWarpDestination(dest.id) || isDisallowedWarpDestination(dest.path)) {
      return {
        id: 'hub',
        name: '프롤로그 허브',
        subName: '프리즘 우주의 중심',
        path: '/',
        icon: '🏛️',
        description: '모든 차원의 영감과 가능성이 수렴하는 우주의 시초 허브',
        themeColor: '#00f0ff',
      };
    }
    return dest;
  };

  const globalWhitehole = getWhiteholeRecommendedApp(location);
  const globalBlackhole = getBlackholeRecommendedApp(location);
  const whiteholeApp = sanitizeDest({
    id: globalWhitehole.id,
    name: globalWhitehole.name,
    subName: globalWhitehole.subName,
    path: globalWhitehole.path,
    icon: globalWhitehole.icon,
    description: globalWhitehole.description,
    themeColor: globalWhitehole.themeColor,
  });
  const blackholeApp = sanitizeDest({
    id: globalBlackhole.id,
    name: globalBlackhole.name,
    subName: globalBlackhole.subName,
    path: globalBlackhole.path,
    icon: globalBlackhole.icon,
    description: globalBlackhole.description,
    themeColor: globalBlackhole.themeColor,
  });
  const secondaryDest = sanitizeDest(tossRule.secondary);
  const tertiaryDest = sanitizeDest(tossRule.tertiary);


  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const touchStartRef = useRef<{ time: number; x: number; y: number; pointerType: string; direction: 'none' | 'north' | 'south' | 'west' | 'east' } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastPhaseRef = useRef<WarpPhase>('idle');
  const lastEventHorizonModeRef = useRef<'whitehole' | 'mirrorhole' | 'blackhole' | undefined>(undefined);
  const currentPointerEventRef = useRef<React.PointerEvent | null>(null);
  const hasTriggeredBlackHolePeakRef = useRef<boolean>(false);
  const lastStageRef = useRef<number>(1);
  const globalPointerMoveRef = useRef<((e: PointerEvent) => void) | null>(null);
  const globalPointerUpRef = useRef<((e: PointerEvent) => void) | null>(null);

  const [cloverWind, setCloverWind] = useState<'off' | 'blowing' | 'settling'>('off');
  const visualDragRef = useRef(false);
  const windTailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const blowCloverWind = (dx: number, dy: number) => {
    // Keep the existing spring-driven center motion alive during visual drags.
    const now = performance.now();
    if (!visualDragRef.current || now - lastStateUpdateTimeRef.current >= 32) {
      lastStateUpdateTimeRef.current = now;
      setDragDistance(Math.hypot(dx, dy));
      setDragOffset({ x: dx, y: dy });
    }
    if (!visualDragRef.current) {
      visualDragRef.current = true;
      if (windTailTimerRef.current) clearTimeout(windTailTimerRef.current);
      setCloverWind('blowing');
      isPttRecordingRef.current = false;
      setIsQuickChatOpen(false);
      setHoverDirection('none');
      downDirectionRef.current = 'none';
      setActivePhase('idle');
      setGauge(0);
      stopBlackHoleContinuousHaptic();
    }

  };
  const finishCloverWind = () => {
    visualDragRef.current = false;
    setCloverWind('settling');
    if (windTailTimerRef.current) clearTimeout(windTailTimerRef.current);
    windTailTimerRef.current = setTimeout(() => setCloverWind('off'), 1200);
  };
  useEffect(() => {
    setCloverWind('off');
    visualDragRef.current = false;
    return () => { if (windTailTimerRef.current) clearTimeout(windTailTimerRef.current); };
  }, [location]);

  const cleanupGlobalPointerListeners = useCallback(() => {
    if (globalPointerMoveRef.current) {
      window.removeEventListener('pointermove', globalPointerMoveRef.current);
      globalPointerMoveRef.current = null;
    }
    if (globalPointerUpRef.current) {
      window.removeEventListener('pointerup', globalPointerUpRef.current);
      globalPointerUpRef.current = null;
    }
  }, []);

  // Real-time animation loop while pressing (60fps 고성능 최적화: 캐싱 & 스로틀링)
  const updateLoop = useCallback(() => {
    if (!touchStartRef.current) return;

    const now = performance.now();
    const start = touchStartRef.current;
    const currentPointer = currentPointerEventRef.current;
    const visualDx = currentPointer ? currentPointer.clientX - start.x : 0;
    const visualDy = currentPointer ? currentPointer.clientY - start.y : 0;
    maxDragDistanceRef.current = Math.max(maxDragDistanceRef.current, Math.hypot(visualDx, visualDy));
    if (maxDragDistanceRef.current > WARP_ABORT_DISTANCE) {
      cancelOutOfRangeDrag();
      return;
    }
    if (maxDragDistanceRef.current >= DRAG_ACTIVATION_THRESHOLD) {
      blowCloverWind(visualDx, visualDy);
      rafRef.current = requestAnimationFrame(updateLoop);
      return;
    }


    const metrics = calculateWarpMetrics(
      start.time,
      now,
      start.x,
      start.y,
      currentPointer ? currentPointer.clientX : start.x,
      currentPointer ? currentPointer.clientY : start.y,
      currentPointer || undefined
    );

    const context = cachedContextRef.current || serializeCurrentView(location);
    let target = synthesizeWarpTarget(context, metrics);
    const temp = forceToAiTemperature(metrics.virtualForce);
    const sectorIdx = metrics.radialSectorIndex !== undefined ? metrics.radialSectorIndex : -1;

    const deltaX = currentPointer ? currentPointer.clientX - start.x : 0;
    const deltaY = currentPointer ? currentPointer.clientY - start.y : 0;
    const dist = Math.hypot(deltaX, deltaY);
    if (dist > maxDragDistanceRef.current) {
      maxDragDistanceRef.current = dist;
    }
    // Tap/hold retain their actions; visual drags returned before warp metrics.
    const textToToss = touchStartSelectionRef.current || lastValidSelectionRef.current || getActiveSelectionText();
    const elapsed = now - start.time;

    let currentHole: 'whitehole' | 'blackhole' = 'whitehole';

    // 👑 롱프레스 홀드: 오직 500ms 이상 지속해서 꾹 누르고 있을 때만 프로 모드 타겟으로 전환
    if (elapsed >= 500 && !(start.pointerType === 'touch' && start.direction !== 'none')) {
      currentHole = 'whitehole';
      const isTextToss = Boolean(textToToss);
      target = {
        id: 'lucy',
        icon: '👑',
        phase: 'whitehole',
        gauge: metrics.virtualForce,
        aiTemperature: temp,
        title: `Lucy Pro (${LUCY_PRO_DEEP_PERSPECTIVE_COUNT}개 심층 관점)`,
        actionType: isTextToss ? 'smart_toss' : 'navigate',
        previewLabel: isTextToss
          ? `[홀드] "${textToToss.slice(0, 16)}..." ➔ Lucy Pro 전달`
          : `[홀드] Lucy Pro · 심층 관점 ${LUCY_PRO_DEEP_PERSPECTIVE_COUNT}개`,
        previewDescription: isTextToss
          ? `선택한 문장을 Lucy Pro에 전달합니다. 등록된 심층 관점 ${LUCY_PRO_DEEP_PERSPECTIVE_COUNT}개와 기초 도구 중 질문에 맞는 항목을 참고합니다.`
          : `빅뱅 홀드 히든 모드 · Lucy Pro가 심층 관점 ${LUCY_PRO_DEEP_PERSPECTIVE_COUNT}개와 기초 도구 중 질문에 맞는 항목을 참고합니다.`,
        destinationPath: location,
        themeColor: '#fde68a',
        accentGlow: 'rgba(253, 230, 138, 0.85)',
      };

      // Resolve the hold on release so dragging can still cancel it.
      if (!metrics.isAborted) isPttRecordingRef.current = true;
    } else {
      currentHole = 'whitehole';
      target = {
        id: 'menu', icon: '🍀', phase: 'whitehole', gauge: metrics.virtualForce,
        aiTemperature: temp, title: '네잎클로버 메뉴', actionType: 'navigate',
        previewLabel: '탭: 메뉴 · 더블탭: 추천 워프',
        previewDescription: '선택 문장 · 탭: Lucy 전달 · 홀드: Lucy + 전달',
        destinationPath: location, themeColor: '#38bdf8', accentGlow: 'rgba(56, 189, 248, 0.85)',
      };
    }

    // 중요한 상태 변경(섹터, 페이즈, 어보트, 홀)이 발생했거나 약 33ms(30fps) 경과 시 상태 일괄 동기화
    const isSectorChanged = sectorIdx !== lastSectorRef.current;
    const isPhaseChanged = metrics.phase !== lastPhaseRef.current;
    const isAbortedChanged = metrics.isAborted !== isAborted;
    const isHoleChanged = currentHole !== lastHoleRef.current;
    const isGaugeSignificantlyChanged = Math.abs(metrics.virtualForce - lastUpdateGaugeRef.current) >= 0.04;
    const isTimeThrottled = now - lastStateUpdateTimeRef.current >= 32;

    if (isSectorChanged || isPhaseChanged || isAbortedChanged || isHoleChanged || isGaugeSignificantlyChanged || isTimeThrottled) {
      lastStateUpdateTimeRef.current = now;
      lastUpdateGaugeRef.current = metrics.virtualForce;

      setGauge(metrics.virtualForce);
      setDurationMs(metrics.durationMs);
      setAiTemp(temp);
      setActivePhase(metrics.phase);
      setCurrentTarget(target);
      setIsAborted(metrics.isAborted);
      setDragOffset({ x: metrics.dragOffsetX || 0, y: metrics.dragOffsetY || 0 });
      setDragDistance(dist);
      setActiveHole(currentHole);
    }

    // 🎯 7대 앱 방사형 조이스틱 각 앱 섹터 진입 시 기계식 마그네틱 틱 햅틱 진동
    if (sectorIdx !== -1 && sectorIdx !== lastSectorRef.current && !metrics.isAborted) {
      lastSectorRef.current = sectorIdx;
      triggerHaptic('whitehole');
    } else if (sectorIdx === -1) {
      lastSectorRef.current = -1;
    }

    // 🧲 화이트홀 ➔ 블랙홀 전환 시 실시간 오디오 & 햅틱
    if (currentHole !== lastHoleRef.current && !metrics.isAborted) {
      lastHoleRef.current = currentHole;
      if (currentHole === 'whitehole') {
        omniWarpAudio.playWhiteHole();
        triggerHaptic('whitehole');
      } else if (currentHole === 'blackhole') {
        omniWarpAudio.playBlackHole();
        triggerHaptic('blackhole');
      }
    }

    // 🧲 마그네틱 래칫 햅틱
    const currentStage = target.stageIndex || 1;
    if (sectorIdx === -1 && currentStage !== lastStageRef.current && !metrics.isAborted) {
      lastStageRef.current = currentStage;
      triggerHaptic('whitehole');
    }

    // 🕳️ 블랙홀 단계 미세 진동 피드백 (홀드 지속 시 심연 럼블 - 웜홀 및 방사형 조이스틱 영역에서는 중단)
    if (metrics.phase === 'blackhole' && !metrics.isAborted && sectorIdx === -1) {
      startBlackHoleContinuousHaptic();
    } else {
      stopBlackHoleContinuousHaptic();
    }

    // Audio & Haptic triggers on phase transition
    if (metrics.phase !== lastPhaseRef.current && !metrics.isAborted) {
      if (metrics.phase === 'whitehole') {
        omniWarpAudio.playWhiteHole();
        triggerHaptic('whitehole');
      } else if (metrics.phase === 'wormhole') {
        omniWarpAudio.playWormhole();
        triggerHaptic('wormhole');
      } else if (metrics.phase === 'event_horizon') {
        omniWarpAudio.playEventHorizon();
        triggerHaptic('event_horizon');
      } else if (metrics.phase === 'blackhole') {
        omniWarpAudio.playBlackHole();
        triggerHaptic('blackhole');
      }
      lastPhaseRef.current = metrics.phase;
    }

    if (metrics.isAborted && lastPhaseRef.current !== 'aborted') {
      omniWarpAudio.playAbort();
      triggerHaptic('abort');
      lastPhaseRef.current = 'aborted';
    }

    rafRef.current = requestAnimationFrame(updateLoop);
  }, [location, isAborted ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (recommendedWarpInFlightRef.current || !e.isPrimary || touchStartRef.current || (e.button !== 0 && e.pointerType === 'mouse')) return;
    activePointerIdRef.current = e.pointerId;
    visualDragRef.current = false;
    isPttRecordingRef.current = false;
    if (windTailTimerRef.current) clearTimeout(windTailTimerRef.current);
    setCloverWind('off');
    // Keep the selected sentence intact while the button resolves the gesture.
    e.preventDefault();
    if (singleTapTimerRef.current) { clearTimeout(singleTapTimerRef.current); singleTapTimerRef.current = null; }
    setQuickChatInitialPrompt('');
    setQuickChatAutoSend(false);
    maxDragDistanceRef.current = 0;

    cleanupGlobalPointerListeners();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}

    const onGlobalMove = (ev: PointerEvent) => {
      if (ev.pointerId !== activePointerIdRef.current) return;
      currentPointerEventRef.current = ev as any;
      if (touchStartRef.current) {
        const d = Math.hypot(ev.clientX - touchStartRef.current.x, ev.clientY - touchStartRef.current.y);
        if (d > maxDragDistanceRef.current) {
          maxDragDistanceRef.current = d;
        }
        if (d > WARP_ABORT_DISTANCE) {
          cancelOutOfRangeDrag();
          return;
        }
        if (d < DRAG_ACTIVATION_THRESHOLD) {
          const curDir = touchStartRef.current.pointerType === 'touch'
            ? touchStartRef.current.direction
            : calculateCardinalDirection(ev.clientX, ev.clientY);
          setHoverDirection(curDir);
          downDirectionRef.current = curDir;
        } else {
          setHoverDirection('none');
          downDirectionRef.current = 'none';
        }
        // 🛑 홀드 중 조금이라도 드래그(14px 이상) 발생 시 0ms 즉각 PTT 취소 이벤트 발송!
        if (d >= DRAG_ACTIVATION_THRESHOLD && isPttRecordingRef.current) {
          isPttRecordingRef.current = false;
          triggerHaptic('abort');
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('prism:abort_lucy_voice_ptt'));
          }
        }
      }
    };
    const onGlobalUp = (ev: PointerEvent) => {
      if (ev.pointerId !== activePointerIdRef.current) return;
      cleanupGlobalPointerListeners();
      handlePointerUp(ev as any);
    };

    globalPointerMoveRef.current = onGlobalMove;
    globalPointerUpRef.current = onGlobalUp;
    window.addEventListener('pointermove', onGlobalMove, { passive: true });
    window.addEventListener('pointerup', onGlobalUp);

    const now = performance.now();
    const initialDir = calculateCardinalDirection(e.clientX, e.clientY);
    touchStartRef.current = {
      time: now,
      x: e.clientX,
      y: e.clientY,
      pointerType: e.pointerType,
      direction: initialDir,
    };
    currentPointerEventRef.current = e;
    downDirectionRef.current = initialDir;
    setHoverDirection(initialDir);
    const liveSel = getActiveSelectionText();
    const initialSel = liveSel || lastValidSelectionRef.current;
    if (initialSel) {
      lastValidSelectionRef.current = initialSel;
      touchStartSelectionRef.current = initialSel;
    } else {
      touchStartSelectionRef.current = '';
    }
    try {
      sessionStorage.setItem('bigbang_pressing', 'true');
    } catch (_) {}
    lastPhaseRef.current = 'whitehole';
    lastEventHorizonModeRef.current = undefined;
    lastSectorRef.current = -1;
    lastStageRef.current = 1;
    lastUpdateGaugeRef.current = 0.08;
    lastStateUpdateTimeRef.current = now;
    lastHoleRef.current = 'whitehole';

    // 신규 터치 시작 시 웜홀/맥락 후보 캐시 초기화
    resetActiveWormholePeek();
    resetActiveContextPeek();

    // 터치 시작 시 단 한 번만 직렬화하여 캐싱 (매 16ms마다 I/O 파싱 방지)
    const context = serializeCurrentView(location);
    cachedContextRef.current = context;

    setDragOffset({ x: 0, y: 0 });
    setDragDistance(0);
    setActiveHole('whitehole');
    setIsPressing(true);
    setIsAborted(false);
    setActivePhase('whitehole');
    setGauge(0.08);
    setDurationMs(0);

    // ☁️ 탭 및 홀드 시작 시 뭉게구름 생성 버스트 트리거 (짧은 탭에서도 780ms 동안 구름 피어오름 유지)
    setCloudBurstSeed((prev) => prev + 1);
    if (cloudBurstTimerRef.current) clearTimeout(cloudBurstTimerRef.current);
    cloudBurstTimerRef.current = setTimeout(() => {
      setCloudBurstSeed(0);
    }, 780);

    const initialMetrics = calculateWarpMetrics(
      now,
      now,
      e.clientX,
      e.clientY,
      e.clientX,
      e.clientY,
      e
    );
    const target = synthesizeWarpTarget(context, initialMetrics);
    setCurrentTarget(target);

    // ☀️ 가벼운 탭 진입 시 화이트홀 빛비춤 햅틱 및 사운드
    omniWarpAudio.playWhiteHole();
    triggerHaptic('whitehole');

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateLoop);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPressing || !touchStartRef.current || e.pointerId !== activePointerIdRef.current) return;
    currentPointerEventRef.current = e;
    const d = Math.hypot(e.clientX - touchStartRef.current.x, e.clientY - touchStartRef.current.y);
    maxDragDistanceRef.current = Math.max(maxDragDistanceRef.current, d);
    if (d > WARP_ABORT_DISTANCE) {
      cancelOutOfRangeDrag();
      return;
    }
    if (d < DRAG_ACTIVATION_THRESHOLD) {
      const curDir = touchStartRef.current.pointerType === 'touch'
        ? touchStartRef.current.direction
        : calculateCardinalDirection(e.clientX, e.clientY);
      setHoverDirection(curDir);
      downDirectionRef.current = curDir;
    } else {
      setHoverDirection('none');
      downDirectionRef.current = 'none';
    }
  };

  const goToKeyChannel = useCallback(() => {
    if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
    singleTapTimerRef.current = null;
    lastTapTimeRef.current = 0;
    clearPendingSelection();
    lastValidSelectionRef.current = '';
    touchStartSelectionRef.current = '';
    isPttRecordingRef.current = false;
    window.dispatchEvent(new CustomEvent('prism:abort_lucy_voice_ptt'));
    setIsQuickChatOpen(false);
    setQuickChatVoiceActive(false);
    setQuickChatInitialPrompt('');
    setQuickChatAutoSend(false);
    setActivePhase('idle');
    setGauge(0);
    setDurationMs(0);
    triggerHaptic('wormhole');
    (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
    navigate('/key');
    window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/key' } }));
    window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: '/key' } }));
  }, [navigate]);

  // ⚡ 추천 1순위 즉시 도약 헬퍼 (더블탭 또는 추천 카드에서 실행 - 룬 문자 사이 우주 흡입 워프 연출)
  const goToNextRecommended = useCallback((customContext?: any, customMetrics?: any, immediate = false, luckyDrag = false) => {
    setIsQuickChatOpen(false);
    // 🛡️ 이미 우주 흡입 워프 진행 중인 경우 중복 격발 방지
    if (recommendedWarpInFlightRef.current) return;
    recommendedWarpInFlightRef.current = true;

    // 대기 중인 1회 탭(홈 이동) 타이머 즉시 취소
    if (singleTapTimerRef.current) {
      clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
    }
    lastTapTimeRef.current = 0;

    // 🌌 추천 도약: 고대 룬 문자 사이 우주 흡입 워프 사운드 & 햅틱 발동!
    if (!immediate && !luckyDrag) {
      setIsCosmicSuctionActive(true);
      omniWarpAudio.playCosmicSuctionWarp();
    }
    triggerHaptic('wormhole');

    const { menu: targetMenu, reason, stats, safePath } = commitNextRecommendedMenuByCycle(location);
    // Navigation never carries a selected sentence into another channel.
    clearPendingSelection();
    lastValidSelectionRef.current = '';
    touchStartSelectionRef.current = '';
    setQuickChatInitialPrompt('');
    setQuickChatAutoSend(false);
    // 🛡️ 실존 페이지 및 워프 불가 목적지 검증 (루시/Key 엄격 제외 보장)
    const finalSafePath = oneStopNavigationPath(safePath);
    const finalMenu = { ...targetMenu, path: finalSafePath };

    const cycleLabel = stats.isFullCycleCompleted
      ? `새 순환 ${stats.cycleIndex}회차`
      : `순환 ${stats.visitedCount}/${stats.totalCount}`;

    const previewLabel = `[원스탑 추천 워프 · ${cycleLabel}] ${finalMenu.name}`;
    const previewDescription = reason;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('prism:bigbang_commit', {
          detail: {
            phase: 'wormhole',
            isDoubleTapSuction: !immediate && !luckyDrag,
            target: {
              id: finalMenu.id,
              name: finalMenu.name,
              destinationPath: finalSafePath,
              themeColor: finalMenu.themeColor,
              icon: finalMenu.emoji,
              previewLabel,
              previewDescription,
              cycleStats: stats,
            },
            context: customContext || serializeCurrentView(location),
            metrics: customMetrics,
            timestamp: Date.now(),
          },
        })
      );
    }

    // 🚀 약 500ms 동안 고대 룬 문자 사이로 우주로 빨려들어가는 하이퍼스페이스 애니메이션 연출 후 도약 실행!
    const navigateToRecommendation = () => {
      if (typeof window !== 'undefined') {
        (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
      }
      navigate(finalSafePath);
      window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: finalSafePath } }));
      window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: finalSafePath } }));
      if (finalSafePath.includes('?tab=')) {
        const tabName = finalSafePath.split('?tab=')[1]?.split('&')[0];
        if (tabName) {
          sessionStorage.setItem('prism_target_tab', tabName);
          window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: tabName } }));
        }
      }

      lastValidSelectionRef.current = '';
      touchStartSelectionRef.current = '';
      clearPendingSelection();
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      resetActiveContextPeek();
    };
    if (immediate) navigateToRecommendation();
    else setTimeout(navigateToRecommendation, luckyDrag ? 450 : 500);

    // 650ms 시점에 흡입 애니메이션 상태 해제
    setTimeout(() => {
      recommendedWarpInFlightRef.current = false;
      setIsCosmicSuctionActive(false);
    }, immediate ? 0 : 650);
  }, [location, navigate, getActiveSelectionText, isKeySite, isCosmicSuctionActive]);

  useEffect(() => {
    const warp = () => goToNextRecommended();
    window.addEventListener('prism:request_recommended_warp', warp);
    return () => window.removeEventListener('prism:request_recommended_warp', warp);
  }, [goToNextRecommended]);

  // 🔮 4대 고대 룬 문자 클릭 시 다이렉트 차원 도약 핸들러
  const handleRuneNavigate = useCallback(
    (targetPath: string, targetTab?: string) => {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      lastTapTimeRef.current = 0;

      if (targetTab) {
        try {
          sessionStorage.setItem('prism_target_tab', targetTab);
        } catch (_) {}
      } else if (!targetPath.includes('?tab=')) {
        try {
          sessionStorage.removeItem('prism_target_tab');
        } catch (_) {}
      }

      if (typeof window !== 'undefined') {
        (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
      }
      navigate(targetPath);
      window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: targetPath } }));
      window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: targetPath, tab: targetTab } }));
      if (targetTab) {
        window.dispatchEvent(new CustomEvent('prism-tab-change', { detail: { tab: targetTab } }));
      }
    },
    [navigate]
  );

  const goToPreviousDapp = useCallback(() => {
    if (isCycleNavigationDisabled) return;
    const previousPath = previousOrderedLuckeyPage(getCurrentOneStopPage(location));
    showDirectionFeedback('west', previousPath);
    const tab = new URL(previousPath, 'https://luckey.local').searchParams.get('tab') || undefined;
    triggerHaptic('wormhole');
    handleRuneNavigate(previousPath, tab);
  }, [location, handleRuneNavigate, isCycleNavigationDisabled]);

  const goToNextDapp = useCallback(() => {
    if (isCycleNavigationDisabled) return;
    const nextPath = nextOrderedLuckeyPage(getCurrentOneStopPage(location));
    showDirectionFeedback('east', nextPath);
    const tab = new URL(nextPath, 'https://luckey.local').searchParams.get('tab') || undefined;
    triggerHaptic('wormhole');
    handleRuneNavigate(nextPath, tab);
  }, [location, handleRuneNavigate, isCycleNavigationDisabled]);

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (activePointerIdRef.current !== null && e.pointerId !== activePointerIdRef.current) return;
    cleanupGlobalPointerListeners();
    if (!touchStartRef.current) return;

    try {
      if ('currentTarget' in e && (e.currentTarget as any)?.releasePointerCapture) {
        (e.currentTarget as any).releasePointerCapture((e as any).pointerId);
      }
    } catch (_) {}

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const start = touchStartRef.current;
    const now = performance.now();
    const duration = now - start.time;
    const deltaX = e.clientX - start.x;
    const deltaY = e.clientY - start.y;
    const dist = Math.hypot(deltaX, deltaY);
    const maxDist = Math.max(dist, maxDragDistanceRef.current);
    const isDragGesture = maxDist >= DRAG_ACTIVATION_THRESHOLD;

    const metrics = calculateWarpMetrics(
      start.time,
      now,
      start.x,
      start.y,
      e.clientX,
      e.clientY,
      e
    );

    setIsPressing(false);
    touchStartRef.current = null;
    currentPointerEventRef.current = null;
    cachedContextRef.current = null;
    lastStageRef.current = 1;
    lastSectorRef.current = -1;
    lastHoleRef.current = 'whitehole';
    lastEventHorizonModeRef.current = undefined;
    stopBlackHoleContinuousHaptic();
    setDragOffset({ x: 0, y: 0 });
    setDragDistance(0);
    setHoverDirection('none');
    try {
      sessionStorage.removeItem('bigbang_pressing');
    } catch (_) {}

    activePointerIdRef.current = null;
    // Check cancellation before the visual-drag branch; dragging must never navigate.
    if (maxDist > WARP_ABORT_DISTANCE) {
      cancelOutOfRangeDrag();
      return;
    }
    if (isDragGesture) {
      if (!visualDragRef.current) blowCloverWind(deltaX,deltaY);
      finishCloverWind();
      isPttRecordingRef.current = false;
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
      lastTapTimeRef.current = 0;
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      setIsAborted(false);
      resetActiveWormholePeek();
      return;
    }

    if (metrics.isAborted) {
      if (isPttRecordingRef.current) {
        isPttRecordingRef.current = false;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('prism:abort_lucy_voice_ptt'));
        }
      }
      omniWarpAudio.playAbort();
      triggerHaptic('abort');
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      setIsAborted(false);
      resetActiveWormholePeek();
      return;
    }

    setIsAborted(false);
    const context = serializeCurrentView(location);

    // 🧭 위·아래는 메뉴 순서대로 앱을 바꾸고, 좌우는 현재 앱의 내부 화면만 이동합니다.
    // Touch has no preceding hover; use the press snapshot instead of a render closure.
    const targetDir = start.pointerType === 'touch'
      ? start.direction
      : downDirectionRef.current;
    const isDisabledChannelDirection =
      isCycleNavigationDisabled && (targetDir === 'west' || targetDir === 'east');
    if (!isDragGesture && isDisabledChannelDirection && (start.pointerType === 'touch' || duration < 220)) {
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      return;
    }
    if (!isDragGesture && targetDir !== 'none' && (start.pointerType === 'touch' || duration < 220)) {
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      lastTapTimeRef.current = 0;
      setIsQuickChatOpen(false);
      downDirectionRef.current = 'none';
      setHoverDirection('none');
      showDirectionFeedback(targetDir);
      if (targetDir === 'north') {
        if (navigateToAdjacentMenuApp('previous', 'north')) {
          triggerHaptic('wormhole');
        }
      } else if (targetDir === 'south') {
        if (navigateToAdjacentMenuApp('next', 'south')) {
          triggerHaptic('wormhole');
        }
      } else if (targetDir === 'west') {
        goToPreviousDapp();
      } else if (targetDir === 'east') {
        goToNextDapp();
      }
      lastValidSelectionRef.current = '';
      touchStartSelectionRef.current = '';
      clearPendingSelection();
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      return;
    }

    // 🎙️ [홀드 완료: 오직 duration >= 500ms 의도적 롱프레스 홀드에서만 루시 프로 진입!]
    // 탭은 절대 프로 모드로 진입하지 않습니다.
    const isHoldGesture = !isDragGesture && duration >= 500 && dist < DRAG_ACTIVATION_THRESHOLD;
    if (isHoldGesture) {
      showGestureFeedback('hold');
      isPttRecordingRef.current = false;
      triggerHaptic('whitehole');
      setIsQuickChatOpen(false);
      setQuickChatVoiceActive(false);
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
      lastTapTimeRef.current = 0;
      // Mode-only navigation must not prime speech or claim OS audio focus.
      const textToToss = touchStartSelectionRef.current || lastValidSelectionRef.current || getActiveSelectionText();
      const prompt = textToToss.trim() ? `내가 선택한 문장이야:\n"${textToToss}"\n\n이 내용에 대해 핵심과 따뜻한 피드백을 친절하게 이야기해 줘.` : '';
      safeSessionStorage.removeItem('lucy_chat_voice_requested');
      
      const inLucyChat = checkIsInLucyChat();
      safeSessionStorage.setItem('lucy_tier_mode', 'pro');
      safeLocalStorage.setItem('lucy_tier_mode', 'pro');
      safeSessionStorage.setItem('lucy_plus_active', 'true');
      safeLocalStorage.setItem('lucy_plus_active', 'true');

      const isWide = isDuoUnfoldedState().unfolded;

      if (inLucyChat || isWide) {
        // 🌟 현재 Lucy 화면 내 또는 듀얼 뷰(펼침: 좌측 루시 상시 마운트)인 경우, 우측 화면을 이탈하지 않고 좌측 루시를 즉각 'Lucy Pro'로 진화!
        window.dispatchEvent(new CustomEvent('prism:evolve_lucy_pro', { detail: { prompt } }));
        if (prompt) {
          window.dispatchEvent(new CustomEvent('lucy-inject-message', { detail: { prompt, channels: ['prologue', 'orange', 'trinity', 'aura', 'bluebird', 'muse', 'epilogue'] } }));
        }
      } else {
        // 🌟 단일 뷰(접힘) 외부 화면인 경우 Lucy(/chat?mode=pro)로 이동하면서 Lucy Pro 가동!
        if (prompt) {
          safeSessionStorage.setItem('lucy_injected_auto_send', prompt);
        }
        (window as any).__prismAllowRouteChangeUntil = Date.now() + 1500;
        navigate('/chat?mode=pro');
        window.dispatchEvent(new CustomEvent('prism-navigate', { detail: { path: '/chat?mode=pro' } }));
        window.dispatchEvent(new CustomEvent('nav-click-active', { detail: { path: '/chat' } }));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('prism:evolve_lucy_pro', { detail: { prompt } }));
        }, 100);
      }

      window.getSelection()?.removeAllRanges();
      lastValidSelectionRef.current = '';
      touchStartSelectionRef.current = '';
      clearPendingSelection();
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      return;
    }

    // ⚡ [탭 완료: duration < 500ms - 프로 모드 절대 진입 불가]
    const isTapGesture = !isDragGesture && !isHoldGesture && dist < DRAG_ACTIVATION_THRESHOLD;
    if (isTapGesture) {
      const selectedText = (touchStartSelectionRef.current || lastValidSelectionRef.current || getActiveSelectionText()).trim();
      if (selectedText) {
        showGestureFeedback('tap');
        const prompt = `내가 선택한 문장이야:\n"${selectedText}"\n\n이 내용에 대해 핵심과 따뜻한 피드백을 친절하게 이야기해 줘.`;
        if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
        lastTapTimeRef.current = 0;
        const normalTier = isDuoUnfoldedState().unfolded ? 'plus' : 'ai';
        safeSessionStorage.setItem('lucy_tier_mode', normalTier);
        safeLocalStorage.setItem('lucy_tier_mode', normalTier);
        safeSessionStorage.removeItem('lucy_plus_active');
        safeLocalStorage.removeItem('lucy_plus_active');
        safeSessionStorage.setItem('lucy_plus_active', 'false');
        safeLocalStorage.setItem('lucy_plus_active', 'false');
        safeSessionStorage.setItem('lucy_force_ai_mode', 'true');
        safeSessionStorage.removeItem('lucy_chat_voice_requested');
        triggerHaptic('whitehole');
        if (checkIsInLucyChat()) {
          window.dispatchEvent(new CustomEvent('prism:revert_lucy_ai'));
          window.dispatchEvent(new CustomEvent('lucy-inject-message', { detail: { prompt, channels: [] } }));
        } else {
          safeSessionStorage.setItem('lucy_pro_pending_channel', 'casual');
          safeSessionStorage.setItem('lucy_injected_auto_send', prompt);
          handleRuneNavigate('/chat?mode=ai');
        }
        window.getSelection()?.removeAllRanges();
        lastValidSelectionRef.current = '';
        touchStartSelectionRef.current = '';
        clearPendingSelection();
        setHasSelectionToss(false);
        setSelectionPreviewText('');
        setIsQuickChatOpen(false);
        setActivePhase('idle');
        setGauge(0);
        setDurationMs(0);
        return;
      }
      const now = performance.now();
      const doubleTap = lastTapTimeRef.current > 0 && now - lastTapTimeRef.current <= 360;
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
      setIsQuickChatOpen(false);
      setQuickChatVoiceActive(false);
      setActivePhase('idle');
      setGauge(0);
      setDurationMs(0);
      if (doubleTap) {
        showGestureFeedback('double');
        lastTapTimeRef.current = 0;
        const normalTier = isDuoUnfoldedState().unfolded ? 'plus' : 'ai';
        safeSessionStorage.setItem('lucy_tier_mode', normalTier);
        safeLocalStorage.setItem('lucy_tier_mode', normalTier);
        window.dispatchEvent(new CustomEvent('prism:revert_lucy_normal'));
        goToKeyChannel();
      } else {
        lastTapTimeRef.current = now;
        singleTapTimerRef.current = setTimeout(() => {
          singleTapTimerRef.current = null;
          lastTapTimeRef.current = 0;
          triggerHaptic('whitehole');
          showGestureFeedback('tap');

          // 🌟 빅뱅 버튼 1회 탭: 프로 모드로 절대 진입하지 않음!
          // - 펼침: 오직 루시 플러스('plus') 고정 & 좌측 코스믹 룸 토글 (일반 루시 진입 금지)
          // - 접힘: 오직 루시 AI('ai') 고정 (루시 플러스 진입 금지)
          const isWide = isDuoUnfoldedState().unfolded;
          if (isWide) {
            safeSessionStorage.setItem('lucy_tier_mode', 'plus');
            safeLocalStorage.setItem('lucy_tier_mode', 'plus');
            handleRuneNavigate('/');
            window.dispatchEvent(new CustomEvent('prism:revert_lucy_normal', { detail: { tier: 'plus' } }));
            return;
          }

          // 단일 뷰(접힘) 상태: 접혀있을 때는 루시 AI! (루시 플러스 진입 절대 차단)
          const targetTier = 'ai';
          safeSessionStorage.setItem('lucy_tier_mode', targetTier);
          safeLocalStorage.setItem('lucy_tier_mode', targetTier);

          if (checkIsInLucyChat()) {
            window.dispatchEvent(new CustomEvent('prism:revert_lucy_normal', { detail: { tier: targetTier } }));
            return;
          }

          handleRuneNavigate(`/chat?mode=${targetTier}`);
        }, 250);
      }
      return;
    }

    // 홀드/드래그 발생 시 더블탭 타이머 및 기록 리셋
    if (singleTapTimerRef.current) {
      clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = null;
    }
    lastTapTimeRef.current = 0;


  };

  const hoverContainerRef = useRef<HTMLDivElement>(null);

  const handlePointerCancel = (event?: React.PointerEvent<HTMLDivElement>) => {
    activePointerIdRef.current = null;
    visualDragRef.current = false;
    if (windTailTimerRef.current) clearTimeout(windTailTimerRef.current);
    setCloverWind('off');
    cleanupGlobalPointerListeners();
    // Native touch cancellation can follow a stationary long press. The visible
    // conversation stays active; dragging or losing window focus still aborts it.
    const keepConversation = Boolean(event && maxDragDistanceRef.current < DRAG_ACTIVATION_THRESHOLD);
    if (isPttRecordingRef.current) {
      isPttRecordingRef.current = false;
      if (!keepConversation && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prism:abort_lucy_voice_ptt'));
      }
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    stopBlackHoleContinuousHaptic();
    setIsPressing(false);
    setIsHovered(false);
    setIsAborted(false);
    downDirectionRef.current = 'none';
    setHoverDirection('none');
    touchStartRef.current = null;
    currentPointerEventRef.current = null;
    cachedContextRef.current = null;
    lastStageRef.current = 1;
    lastSectorRef.current = -1;
    setDragOffset({ x: 0, y: 0 });
    setDragDistance(0);
    setActivePhase('idle');
    setGauge(0);
    setDurationMs(0);
    touchStartSelectionRef.current = '';
    buttonRef.current?.blur();
    try {
      sessionStorage.removeItem('bigbang_pressing');
    } catch (_) {}
  };

  const cancelOutOfRangeDrag = () => {
    handlePointerCancel();
    if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
    singleTapTimerRef.current = null;
    lastTapTimeRef.current = 0;
    omniWarpAudio.playAbort();
    triggerHaptic('abort');
  };

  useEffect(() => {
    const handleGlobalCancel = () => {
      setIsHovered(false);
      buttonRef.current?.blur();
      if (touchStartRef.current) {
        handlePointerCancel();
      }
    };

    const handleOutsidePointerDown = (e: PointerEvent | MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest?.('[data-lucy-quick-chat="true"]')) {
        return;
      }
      if (hoverContainerRef.current && target && !hoverContainerRef.current.contains(target)) {
        setIsHovered(false);
        buttonRef.current?.blur();
        if (
          document.activeElement instanceof HTMLElement &&
          hoverContainerRef.current.contains(document.activeElement)
        ) {
          document.activeElement.blur();
        }
        if (touchStartRef.current) {
          handlePointerCancel();
        }
      }
    };

    window.addEventListener('pointercancel', handleGlobalCancel);
    window.addEventListener('blur', handleGlobalCancel);
    document.addEventListener('pointerdown', handleOutsidePointerDown, true);
    document.addEventListener('click', handleOutsidePointerDown, true);
    return () => {
      window.removeEventListener('pointercancel', handleGlobalCancel);
      window.removeEventListener('blur', handleGlobalCancel);
      document.removeEventListener('pointerdown', handleOutsidePointerDown, true);
      document.removeEventListener('click', handleOutsidePointerDown, true);
      stopBlackHoleContinuousHaptic();
      cleanupGlobalPointerListeners();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // 🌟 위상 판별: 화이트홀(빛비춤), 블랙홀(어두운 심연) - 미러홀 완전 제거
  const isWhiteholeMode =
    activeHole === 'whitehole' ||
    activePhase === 'whitehole' ||
    (activePhase === 'event_horizon' && currentTarget?.eventHorizonMode === 'whitehole');

  const isBlackholeMode =
    activeHole === 'blackhole' ||
    activePhase === 'blackhole' ||
    (activePhase === 'event_horizon' && currentTarget?.eventHorizonMode === 'blackhole');

  // 🎯 현재 활성화된 목적지의 상징 아이콘 식별자 결정 (프리즘 메인 아이콘 규격)
  const activeAppId = (() => {
    if (isAborted) return 'aborted';
    // 🌀 웜홀 상태 (버튼영역내 제자리 제외): 옴니워프 유니버스 아이콘
    if (activePhase === 'wormhole') return 'key';
    // 🌌 사건의 지평선 상태 (조준 중): 해당 조준 채널의 아이콘을 최우선으로 표출!
    // 🌀 드래그 시: 추천 1순위 채널
    if (dragDistance >= DRAG_ACTIVATION_THRESHOLD) return currentTarget?.id || 'omniwarp';
    // 💬 제자리 홀드 - 채팅 화면에서는 프리즘 홈 귀환
    if (isChatView) return 'lucy';
    // 💬 제자리 홀드 - 일반 화면에서는 루시 1:1 대화
    return 'lucy';
  })();

  const activeAppName = (() => {
    if (isAborted) return '취소';
    // 🌀 웜홀 상태: 추천 1순위 차원 도약
    if (activePhase === 'wormhole') return currentTarget?.title || currentTarget?.name || 'KEY 채널로 이동';
    // 🌌 사건의 지평선 상태 (조준 중): 해당 조준 채널 및 서브메뉴 명칭 표출

    // 🌀 드래그 시: 추천 1순위 채널 도약
    if (dragDistance >= DRAG_ACTIVATION_THRESHOLD) return currentTarget?.title || currentTarget?.name || 'KEY 채널로 이동';
    // 💬 제자리 홀드 - 채팅 화면에서는 프리즘 귀환
    if (isChatView) return '루시 (1:1 음성 대화)';
    // 💬 제자리 홀드 - 일반 화면에서는 루시 음성 대화
    return '루시 (1:1 음성 대화)';
  })();

  if (typeof document === 'undefined' || isKeyboardOpen) return null;
  return createPortal(
    <>
      {cloverWind !== 'off' && <BigBangLuckyBreeze settling={cloverWind === 'settling'} buttonRef={buttonRef} />}
      {/* 🚀 Crystal Ball Big Bang Button (군더더기 없는 현대적이고 웅장한 대형 코스믹 아티팩트) */}
      <div
        className={`fixed bottom-safe-fab-center w-[84px] h-[84px] pointer-events-none flex items-center justify-center select-none ${
          isQuickChatOpen || voiceModeInfo.isOpen ? 'z-[9995]' : 'z-[410]'
        }`}
        style={
          panelCenterLeft != null
            ? {
                left: `${panelCenterLeft}px`,
                right: 'auto',
                marginLeft: 0,
                marginRight: 0,
                transform: 'translateX(-50%)',
              }
            : undefined
        }
      >
        <div
          ref={hoverContainerRef}
          data-bigbang="true"
          data-cycle-navigation-disabled={isCycleNavigationDisabled ? 'true' : 'false'}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="relative w-[84px] h-[84px] flex items-center justify-center pointer-events-auto touch-none select-none shrink-0"
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') {
              setIsHovered(true);
              const dir = calculateCardinalDirection(e.clientX, e.clientY);
              setHoverDirection(dir);
            }
          }}
          onPointerMove={(e) => {
            handlePointerMove(e);
            if (e.pointerType !== 'mouse' || isPressing) return;
            const dir = calculateCardinalDirection(e.clientX, e.clientY);
            setHoverDirection(dir);
            if (dir !== 'none') {
              setIsHovered(true);
            }
          }}
          onPointerLeave={() => {
            if (!isPressing) {
              setIsHovered(false);
              setHoverDirection('none');
            }
            buttonRef.current?.blur();
          }}
          onMouseLeave={() => {
            if (!isPressing) {
              setIsHovered(false);
              setHoverDirection('none');
            }
            buttonRef.current?.blur();
          }}
        >
          {/* Existing radial hit area accepts touch as well as mouse input */}
          <div className="absolute -inset-7 rounded-full pointer-events-auto touch-none -z-10" />

          {/* 🌟 텍스트 선택(스크롤) 시 4대 토스 경로 안내 뱃지 표출 (루시채팅에서는 별도 말풍선 배지 제외) */}
          <AnimatePresence>
            {hasSelectionToss && !isPressing && !(location === '/' || location.startsWith('/chat') || location.startsWith('/lucy')) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-950/95 backdrop-blur-xl border border-cyan-400/60 text-[10px] font-bold text-cyan-200 shadow-[0_4px_24px_rgba(0,240,255,0.45)] pointer-events-none flex items-center gap-1.5 z-50 animate-pulse ring-1 ring-cyan-400/40"
              >
                <span className="text-xs">💬</span>
                <span>선택한 문장 · 탭: Lucy · 홀드: Lucy Pro</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🎯 버튼 & 궤도 정밀 센터링 앵커 (대형 코스믹 아티팩트 규격 76~84px) */}
          <div className="relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] flex items-center justify-center shrink-0">


            {/* 🌈 은은하고 신비로운 코스믹 레인보우 아우라 (Subtle Lingering Rainbow Aura) */}
            <div
              className={`absolute -inset-2.5 sm:-inset-3.5 rounded-full bigbang-subtle-rainbow-aura blur-[14px] transition-opacity duration-300 pointer-events-none z-0 ${
                isHovered || isPressing ? 'opacity-75' : 'opacity-40'
              }`}
              aria-hidden="true"
            />
            <div
              className={`absolute -inset-[3px] sm:-inset-[4px] rounded-full bigbang-subtle-rainbow-aura blur-[4px] transition-opacity duration-300 pointer-events-none z-0 ${
                isHovered || isPressing ? 'opacity-80' : 'opacity-45'
              }`}
              aria-hidden="true"
            />

            {/* 🌟 빅뱅 아케인 마법진 매트릭스 (하드웨어 가속, 상시 렌더링 및 누를 때 공명 가속) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-35">
              <BigBangCircularMeter
                isPressing={isPressing}
                isHovered={isHovered}
                gauge={gauge}
                durationMs={durationMs}
                activePhase={activePhase}
                isAborted={isAborted}
                isCosmicSuction={isCosmicSuctionActive}
                onNextPage={goToNextDapp}
                onPreviousPage={goToPreviousDapp}
              />
            </div>

            {/* Ambient Gravitational Ripple Waves - active on hover to prevent continuous mobile composite thrashing */}
            {activePhase === 'idle' && isHovered && (
              <>
                <div className="absolute -inset-2.5 rounded-full border border-cyan-400/25 animate-ping opacity-20 pointer-events-none z-0" />
                <div className="absolute -inset-4 rounded-full border border-purple-400/15 animate-pulse opacity-30 pointer-events-none z-0" />
              </>
            )}


            {/* 🌌 탭 & 홀드 시 아케인 에너지 파동 링 & 오로라 성운 입자 확산 이펙트 */}
            <AnimatePresence>
              {(isPressing || cloudBurstSeed > 0) &&
                !isCosmicSuctionActive &&
                activePhase !== 'wormhole' &&
                !isAborted && (
                  <motion.div
                    key={`arcane-ripple-${isPressing ? 'hold' : cloudBurstSeed}`}
                    initial={{ opacity: 0, scale: 0.78 }}
                    animate={{
                      opacity: 1,
                      scale: isPressing ? 1 + Math.min(0.38, gauge * 0.35) : 1.04,
                    }}
                    exit={{ opacity: 0, scale: 1.24 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -inset-6 sm:-inset-7 pointer-events-none z-25 flex items-center justify-center overflow-visible"
                    aria-hidden="true"
                  >
                    {/* 1) 동심원 아케인 에너지 파동 링 1 (Cyan Shockwave Ring) */}
                    <div
                      className="animate-arcane-ripple-1 absolute inset-1 rounded-full border-[1.5px] border-cyan-300/85"
                      style={{
                        boxShadow:
                          '0 0 22px rgba(0, 240, 255, 0.75), inset 0 0 14px rgba(0, 240, 255, 0.45)',
                      }}
                    />

                    {/* 2) 동심원 아케인 에너지 파동 링 2 (Violet-Gold Resonance Ring) */}
                    <div
                      className="animate-arcane-ripple-2 absolute inset-0 rounded-full border border-purple-400/80"
                      style={{
                        boxShadow:
                          '0 0 26px rgba(168, 85, 247, 0.7), inset 0 0 14px rgba(251, 191, 36, 0.35)',
                      }}
                    />

                    {/* 3) 오로라 성운 에너지 플라즈마 오라 */}
                    <div
                      className="absolute -inset-2 rounded-full animate-[spin_4s_linear_infinite] opacity-85 blur-[6px]"
                      style={{
                        background:
                          'conic-gradient(from 0deg, rgba(0,240,255,0.55) 0deg, rgba(168,85,247,0.5) 120deg, rgba(251,191,36,0.45) 240deg, rgba(0,240,255,0.55) 360deg)',
                      }}
                    />

                    {/* 4) 12방위 방사형 & 상단 말풍선 연결 오로라 성운 스타더스트 입자 확산 */}
                    {[
                      { tx: 0, ty: -58, size: 'w-2 h-2', color: '#00f0ff', glow: 'rgba(0,240,255,0.95)', delay: 0 },
                      { tx: -26, ty: -50, size: 'w-1.5 h-1.5', color: '#c084fc', glow: 'rgba(192,132,252,0.95)', delay: 0.04 },
                      { tx: 26, ty: -50, size: 'w-1.5 h-1.5', color: '#fbbf24', glow: 'rgba(251,191,36,0.95)', delay: 0.08 },
                      { tx: -46, ty: -28, size: 'w-1.5 h-1.5', color: '#00f0ff', glow: 'rgba(0,240,255,0.9)', delay: 0.12 },
                      { tx: 46, ty: -28, size: 'w-1.5 h-1.5', color: '#c084fc', glow: 'rgba(192,132,252,0.9)', delay: 0.16 },
                      { tx: -54, ty: 4, size: 'w-1.5 h-1.5', color: '#fbbf24', glow: 'rgba(251,191,36,0.9)', delay: 0.06 },
                      { tx: 54, ty: 4, size: 'w-1.5 h-1.5', color: '#00f0ff', glow: 'rgba(0,240,255,0.9)', delay: 0.1 },
                      { tx: -40, ty: 38, size: 'w-1.5 h-1.5', color: '#34d399', glow: 'rgba(52,211,153,0.9)', delay: 0.14 },
                      { tx: 40, ty: 38, size: 'w-1.5 h-1.5', color: '#c084fc', glow: 'rgba(192,132,252,0.9)', delay: 0.18 },
                      { tx: -14, ty: -68, size: 'w-1.5 h-1.5', color: '#fbbf24', glow: 'rgba(251,191,36,0.95)', delay: 0.2 },
                      { tx: 14, ty: -68, size: 'w-1.5 h-1.5', color: '#00f0ff', glow: 'rgba(0,240,255,0.95)', delay: 0.24 },
                      { tx: 0, ty: 48, size: 'w-1.5 h-1.5', color: '#38bdf8', glow: 'rgba(56,189,248,0.9)', delay: 0.15 },
                    ].map((mote, mIdx) => (
                      <motion.div
                        key={`nebula-mote-${mIdx}`}
                        initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                        animate={{
                          opacity: [0, 1, 0.85, 0],
                          x: [0, mote.tx * 0.55, mote.tx],
                          y: [0, mote.ty * 0.55, mote.ty],
                          scale: [0.3, 1.25, 0.5],
                        }}
                        transition={{
                          duration: 0.76,
                          delay: mote.delay,
                          repeat: isPressing ? Infinity : 0,
                          ease: 'easeOut',
                        }}
                        className={`absolute rounded-full ${mote.size}`}
                        style={{
                          backgroundColor: mote.color,
                          boxShadow: `0 0 10px ${mote.glow}, 0 0 18px ${mote.glow}`,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
            </AnimatePresence>

            {/* 🎯 빅뱅 차원 수렴 인터랙션 (탭·홀드 시 아케인 파동 & 오로라 성운 코어가 공명하는 코스믹 버튼) */}
            <motion.button
              ref={buttonRef}
              id="bigbang-omnibutton"
              data-bigbang="true"
              type="button"
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(event) => {
                // Pointer activation is handled on release; detail=0 covers keyboard/assistive activation.
                if (event.detail === 0) {
                  setIsQuickChatOpen(false);
                  handleRuneNavigate('/chat');
                }
              }}
              aria-haspopup="dialog"
              aria-controls="luckey-menu-dialog"
              onPointerLeave={() => {
                setIsHovered(false);
                buttonRef.current?.blur();
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotate: 45,
                borderRadius: morphStyles.borderRadius,
                x: morphStyles.x,
                y: morphStyles.y,
                scale: isCosmicSuctionActive
                  ? 0.88
                  : isPressing
                  ? (1.04 + gauge * 0.08)
                  : isHovered && hoverDirection === 'none'
                  ? 1.05
                  : hoverDirection !== 'none'
                  ? 1.04
                  : 1.0,
              }}
              transition={{
                borderRadius: { duration: 0.2, ease: 'easeOut' },
                x: { duration: 0.18, ease: 'easeOut' },
                y: { duration: 0.18, ease: 'easeOut' },
                duration: isCosmicSuctionActive ? 0.35 : 0.12,
              }}
              className={`w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] flex flex-col items-center justify-center shrink-0 cursor-pointer outline-none relative overflow-hidden transition-colors duration-200 border will-change-transform z-30 touch-none select-none ${
                isCosmicSuctionActive
                  ? 'border-cyan-200 shadow-[0_0_50px_rgba(56,189,248,1),0_0_80px_rgba(168,85,247,0.9),inset_0_0_30px_rgba(0,0,0,1)]'
                  : isPressing && isAborted
                  ? 'opacity-70 border-red-500/70 shadow-[0_0_24px_rgba(239,68,68,0.5)]'
                  : isPressing && activePhase === 'wormhole'
                  ? 'border-emerald-300/90 shadow-[0_0_40px_rgba(52,211,153,0.9),0_0_24px_rgba(6,182,212,0.7),inset_0_0_26px_rgba(52,211,153,0.7)]'
                  : (isPressing || cloudBurstSeed > 0) && (isWhiteholeMode || isBlackholeMode)
                  ? 'border-cyan-300/95 border-[1.5px] shadow-[0_0_36px_rgba(0,240,255,0.65),0_0_54px_rgba(168,85,247,0.45),inset_0_0_22px_rgba(0,240,255,0.45)]'
                  : voiceModeInfo.isOpen && voiceModeInfo.state === 'speaking'
                  ? 'border-amber-400/95 shadow-[0_0_42px_rgba(251,191,36,0.7),inset_0_0_24px_rgba(251,191,36,0.45)]'
                  : voiceModeInfo.isOpen
                  ? 'border-cyan-300/90 shadow-[0_0_36px_rgba(34,211,238,0.6),inset_0_0_20px_rgba(34,211,238,0.35)]'
                  : isPressing
                  ? 'border-cyan-300/95 border-[1.5px] shadow-[0_0_36px_rgba(0,240,255,0.65),0_0_54px_rgba(168,85,247,0.45),inset_0_0_22px_rgba(0,240,255,0.45)]'
                  : isHovered
                  ? 'border-cyan-300/80 shadow-[0_0_28px_rgba(56,189,248,0.45)]'
                  : 'border-cyan-400/40 shadow-[0_0_24px_rgba(56,189,248,0.3)]'
              }`}
              style={{
                borderRadius: morphStyles.borderRadius,
                touchAction: 'none',
                userSelect: 'none',
                background: isPressing && isAborted
                  ? 'radial-gradient(circle at 40% 35%, #1f0b0f 0%, #0d0406 55%, #040102 100%)'
                  : isPressing && activePhase === 'wormhole'
                  ? 'radial-gradient(circle at 50% 50%, #ffffff 0%, #38bdf8 20%, #a855f7 42%, #0e051e 68%, #000000 100%)'
                  : (isPressing || cloudBurstSeed > 0) && (isWhiteholeMode || isBlackholeMode)
                  ? 'radial-gradient(circle at 38% 32%, #1d2658 0%, #121138 48%, #08091c 80%, #03040c 100%)'
                  : isPressing
                  ? 'radial-gradient(circle at 38% 32%, #1d2658 0%, #121138 48%, #08091c 80%, #03040c 100%)'
                  : 'radial-gradient(circle at 35% 30%, #171833 0%, #0e0f21 45%, #060712 80%, #020207 100%)',
                boxShadow: isPressing && isAborted
                  ? 'inset 0 0 20px rgba(239, 68, 68, 0.4), 0 0 24px rgba(239, 68, 68, 0.5)'
                  : isPressing && activePhase === 'wormhole'
                  ? 'inset 0 0 25px rgba(52, 211, 153, 0.9), 0 0 35px rgba(6, 182, 212, 0.85)'
                  : (isPressing || cloudBurstSeed > 0) && (isWhiteholeMode || isBlackholeMode)
                  ? 'inset 0 0 24px rgba(0, 240, 255, 0.48), inset -4px -4px 16px rgba(168, 85, 247, 0.45), 0 0 34px rgba(0, 240, 255, 0.55)'
                  : isPressing
                  ? 'inset 0 0 24px rgba(0, 240, 255, 0.48), inset -4px -4px 16px rgba(168, 85, 247, 0.45), 0 0 34px rgba(0, 240, 255, 0.55)'
                  : 'inset 0 0 22px rgba(56, 189, 248, 0.25), inset -6px -6px 18px rgba(0, 0, 0, 0.9), 0 0 24px rgba(56, 189, 248, 0.3)',
              }}
              title={`빅뱅 버튼 (탭: 루시 채팅 / 더블탭: KEY / 위·아래: 스크롤 위치와 무관하게 메뉴 앱 순서대로 이동 / ${isCycleNavigationDisabled ? '현재 화면에서는 좌우 이동 비활성화' : '좌우: 현재 앱 내부 화면만 이동'} / 길게 누름: 루시 채팅 프로 / 드래그: 장식 효과만, 페이지 이동 없음)`}
              aria-label={`빅뱅 버튼 · 탭: 루시 채팅, 더블탭: KEY / 위·아래: 스크롤 위치와 무관하게 메뉴 앱 순서대로 이동 / ${isCycleNavigationDisabled ? '현재 화면에서는 좌우 이동 비활성화' : '좌우는 현재 앱 내부 화면만 이동'}, 길게 누름: 루시 채팅 프로, 드래그는 화면 이동 없음`}
            >
              {/* 🌀 [웜홀] 빛비춤 + 어두운 심연 + 사건의 지평선 3원 동시 융합 전개 */}
              {isPressing && activePhase === 'wormhole' && (
                <>
                  {/* 🕳️ 심연: 외곽 암흑 흡입 파동 (Blackhole Suction) */}
                  <div className="absolute inset-0 rounded-full pointer-events-none bigbang-suction-wave-1 opacity-80 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(147,51,234,0.45)_65%,black_100%)]" />
                  {/* ☀️ 빛비춤: 중심 찬란한 성광 회전 광선 (Whitehole Rays) */}
                  <div className="absolute inset-0 rounded-full pointer-events-none bigbang-rays-spin opacity-85 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.95)_0deg,transparent_60deg,rgba(254,240,138,0.85)_120deg,transparent_180deg,rgba(255,255,255,0.95)_240deg,transparent_300deg,rgba(255,255,255,0.95)_360deg)]" />
                  {/* 🌌 사건의 지평선: 빛과 어둠이 교차하는 상대론적 소용돌이 (Event Horizon Accretion Vortex) */}
                  <div className="absolute inset-0 rounded-full pointer-events-none bigbang-wormhole-vortex opacity-90 bg-[conic-gradient(from_0deg,rgba(56,189,248,0.9)_0deg,transparent_45deg,rgba(168,85,247,0.85)_90deg,transparent_135deg,rgba(52,211,153,0.85)_180deg,transparent_225deg,rgba(255,255,255,0.95)_270deg,transparent_315deg,rgba(56,189,248,0.9)_360deg)]" />
                </>
              )}

              {/* 🌌 탭 & 홀드 시 버튼 코어 내부에서 회전하는 오로라 아케인 네뷸라 링 */}
              {(isPressing || cloudBurstSeed > 0) && activePhase !== 'wormhole' && !isAborted && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none overflow-hidden animate-[spin_3s_linear_infinite] opacity-85 z-14"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(0,240,255,0.65) 0deg, transparent 70deg, rgba(168,85,247,0.65) 150deg, transparent 220deg, rgba(251,191,36,0.55) 290deg, rgba(0,240,255,0.65) 360deg)',
                  }}
                />
              )}

              {/* 기본 대기 상태일 때의 은은한 회전 볼텍스 링 */}
              {!isPressing && cloudBurstSeed === 0 && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none z-10 transition-opacity duration-200 animate-[spin_12s_linear_infinite] opacity-40"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(168,85,247,0.6) 0deg, rgba(15,17,36,0.9) 120deg, rgba(192,132,252,0.5) 240deg, rgba(168,85,247,0.6) 360deg)',
                  }}
                />
              )}

              {/* 🔮 빅뱅 내부 마법진 만다라 워터마크 음각 (Arcane Core Inscription Seal - 외피 45° 회전 역보정) */}
              <div
                className={`absolute inset-2 sm:inset-2.5 rounded-[inherit] pointer-events-none z-12 mix-blend-screen overflow-hidden flex items-center justify-center transition-opacity duration-300 -rotate-45 ${
                  isPressing || cloudBurstSeed > 0 ? 'opacity-95 scale-105' : 'opacity-65 hover:opacity-95'
                }`}
              >
                {/* 시계방향 회전 아케인 매트릭스 링 */}
                <svg
                  viewBox="0 0 64 64"
                  className="w-full h-full animate-[spin_24s_linear_infinite]"
                  fill="none"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="29"
                    stroke="#38bdf8"
                    strokeWidth="0.75"
                    strokeDasharray="2 3"
                    opacity="0.8"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="24"
                    stroke="#c084fc"
                    strokeWidth="0.5"
                    strokeDasharray="4 2"
                    opacity="0.7"
                  />
                  {/* 중앙 성스러운 육각진 성좌 매트릭스 */}
                  <polygon
                    points="32,10 50,42 14,42"
                    stroke="#38bdf8"
                    strokeWidth="0.6"
                    strokeDasharray="1.5 2.5"
                    opacity="0.75"
                  />
                  <polygon
                    points="32,54 14,22 50,22"
                    stroke="#fde047"
                    strokeWidth="0.6"
                    strokeDasharray="1.5 2.5"
                    opacity="0.7"
                  />
                  {/* 방위 눈금 틱 */}
                  <line x1="32" y1="3" x2="32" y2="7" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                  <line x1="32" y1="57" x2="32" y2="61" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                  <line x1="3" y1="32" x2="7" y2="32" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                  <line x1="57" y1="32" x2="61" y2="32" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />
                </svg>

                {/* 반시계방향 역회전 초미세 룬 보조 링 */}
                <svg
                  viewBox="0 0 64 64"
                  className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite_reverse]"
                  fill="none"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="19"
                    stroke="#a855f7"
                    strokeWidth="0.5"
                    strokeDasharray="1 3"
                    opacity="0.7"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="14"
                    stroke="#38bdf8"
                    strokeWidth="0.4"
                    opacity="0.5"
                  />
                  {/* 대각선 미세 틱 */}
                  <line x1="12" y1="12" x2="15" y2="15" stroke="#fde047" strokeWidth="0.8" opacity="0.7" />
                  <line x1="52" y1="52" x2="49" y2="49" stroke="#fde047" strokeWidth="0.8" opacity="0.7" />
                  <line x1="52" y1="12" x2="49" y2="15" stroke="#fde047" strokeWidth="0.8" opacity="0.7" />
                  <line x1="12" y1="52" x2="15" y2="49" stroke="#fde047" strokeWidth="0.8" opacity="0.7" />
                </svg>
              </div>

              {/* Event Horizon Deep Singularity Core (탭·홀드 시 포근한 뭉게구름 볼륨 코어로 전환) */}
              <div
                className="absolute inset-2.5 sm:inset-3 z-15 pointer-events-none transition-[border-radius,background,box-shadow] duration-200 overflow-hidden flex items-center justify-center"
                style={{
                  borderRadius: morphStyles.borderRadius,
                  background: isPressing && activePhase === 'wormhole'
                    ? 'radial-gradient(circle at 45% 35%, #052e16 0%, #064e3b 50%, #022c22 100%)'
                    : (isPressing || cloudBurstSeed > 0) && !isAborted
                    ? 'radial-gradient(circle at 42% 35%, #FFFFFF 0%, #F0F9FF 55%, #BAE6FD 100%)'
                    : 'radial-gradient(circle at 45% 35%, #101228 0%, #090a1a 55%, #03030a 100%)',
                  boxShadow: isPressing && activePhase === 'wormhole'
                    ? '0 0 18px rgba(52, 211, 153, 0.8), inset 0 0 14px rgba(6, 182, 212, 0.7)'
                    : (isPressing || cloudBurstSeed > 0) && !isAborted
                    ? 'inset 0 3px 10px #FFFFFF, 0 4px 14px rgba(56, 189, 248, 0.45)'
                    : 'inset 0 0 16px rgba(0, 0, 0, 0.95)',
                }}
              />

              {/* 🌊 음성 모드 활성화 시 빅뱅 버튼 내부 파동 효과 (Sonic Ripple Waves) */}
              <AnimatePresence>
                {voiceModeInfo.isOpen && (
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-18 flex items-center justify-center">
                    {/* 외곽 파동 링 1 */}
                    <motion.div
                      initial={{ scale: 0.25, opacity: 0.8 }}
                      animate={{ scale: [0.25, 1.35, 1.9], opacity: [0.85, 0.45, 0] }}
                      transition={{
                        duration: voiceModeInfo.state === 'speaking' ? 1.3 : 2.1,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                      className={`absolute w-12 h-12 rounded-full border-2 ${
                        voiceModeInfo.state === 'speaking'
                          ? 'border-amber-400/90 shadow-[0_0_18px_rgba(251,191,36,0.9)]'
                          : voiceModeInfo.state === 'thinking'
                          ? 'border-purple-400/80 shadow-[0_0_14px_rgba(192,132,252,0.8)]'
                          : 'border-cyan-400/90 shadow-[0_0_18px_rgba(34,211,238,0.9)]'
                      }`}
                    />
                    {/* 중간 파동 링 2 */}
                    <motion.div
                      initial={{ scale: 0.2, opacity: 0.7 }}
                      animate={{ scale: [0.2, 1.0, 1.5], opacity: [0.75, 0.35, 0] }}
                      transition={{
                        duration: voiceModeInfo.state === 'speaking' ? 1.3 : 2.1,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.45,
                      }}
                      className={`absolute w-10 h-10 rounded-full border ${
                        voiceModeInfo.state === 'speaking'
                          ? 'border-rose-400/80 shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                          : voiceModeInfo.state === 'thinking'
                          ? 'border-fuchsia-400/70 shadow-[0_0_10px_rgba(232,121,249,0.7)]'
                          : 'border-teal-400/80 shadow-[0_0_12px_rgba(20,184,166,0.7)]'
                      }`}
                    />
                    {/* 중심 코어 파동 링 3 */}
                    <motion.div
                      initial={{ scale: 0.15, opacity: 0.9 }}
                      animate={{ scale: [0.15, 0.75, 1.15], opacity: [0.9, 0.5, 0] }}
                      transition={{
                        duration: voiceModeInfo.state === 'speaking' ? 1.3 : 2.1,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.85,
                      }}
                      className={`absolute w-8 h-8 rounded-full border ${
                        voiceModeInfo.state === 'speaking'
                          ? 'border-yellow-200/90'
                          : voiceModeInfo.state === 'thinking'
                          ? 'border-violet-300/80'
                          : 'border-cyan-200/90'
                      }`}
                    />
                    {/* 코어 음파 발광 펄스 */}
                    <motion.div
                      animate={{ scale: [1, 1.45, 1], opacity: [0.75, 1, 0.75] }}
                      transition={{
                        duration: voiceModeInfo.state === 'speaking' ? 0.9 : 1.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className={`w-4 h-4 rounded-full blur-[1px] ${
                        voiceModeInfo.state === 'speaking'
                          ? 'bg-amber-300 shadow-[0_0_22px_#fbbf24]'
                          : voiceModeInfo.state === 'thinking'
                          ? 'bg-purple-300 shadow-[0_0_18px_#c084fc]'
                          : 'bg-cyan-300 shadow-[0_0_20px_#22d3ee]'
                      }`}
                    />
                  </div>
                )}
              </AnimatePresence>

              <div hidden data-bigbang-direction-targets="true" aria-hidden="true">
                {[
                  { direction: 'north' as const, target: directionTargets.north },
                  { direction: 'east' as const, target: directionTargets.east },
                  { direction: 'south' as const, target: directionTargets.south },
                  { direction: 'west' as const, target: directionTargets.west },
                ].map(({ direction, target }) => {
                  if (!target) return null;
                  return (
                    <span
                      key={direction}
                      data-bigbang-direction-target={direction}
                      data-bigbang-target-channel={target.id}
                    />
                  );
                })}
              </div>

              {/* Big Bang center: directional chevrons on activation, dot while idle */}
              <div className="relative z-20 w-full h-full rounded-full flex items-center justify-center text-center select-none pointer-events-none">
                <div className="relative flex items-center justify-center pointer-events-none">
                  {cloverWind !== 'off' ? (
                    <span data-bigbang-center-drag-core="true" className="w-2.5 h-2.5 rounded-full bg-emerald-200/85 blur-[1px] animate-pulse" aria-hidden="true" />
                  ) : !isPressing && centerDirection !== 'none' && DestinationIcon ? (
                    <DestinationIcon data-bigbang-center-channel={feedbackChannel?.id} data-bigbang-center-direction={centerDirection} size={24} strokeWidth={1.8} className="-rotate-45 text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]" aria-hidden="true" />
                  ) : centerDirection === 'north' || centerDirection === 'south' ? (
                    centerDirection === 'north'
                      ? <ChevronUp data-bigbang-center-arrow="north" size={24} strokeWidth={2} className="-rotate-45 text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]" aria-hidden="true" />
                      : <ChevronDown data-bigbang-center-arrow="south" size={24} strokeWidth={2} className="-rotate-45 text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]" aria-hidden="true" />
                  ) : centerGesture === 'tap' ? (
                    <svg data-bigbang-center-gesture="tap" width="25" height="25" viewBox="0 0 26 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="-rotate-45 text-cyan-200" aria-hidden="true">
                      {[0, 120, 240].map(angle => <path key={angle} d="M13 14C9 12 5 8 7 5C9 2 12 4 13 6C14 4 17 2 19 5C21 8 17 12 13 14Z" transform={`rotate(${angle} 13 14)`} fill="currentColor" fillOpacity="0.18" />)}
                      <path d="M13 14Q17 23 11 26" strokeLinecap="round" />
                    </svg>
                  ) : centerGesture === 'hold' ? (
                    <Clover data-bigbang-center-gesture="hold" size={25} strokeWidth={1.8} className="-rotate-45 text-cyan-200" aria-hidden="true" />
                  ) : centerGesture === 'double' ? (
                    <KeyRound data-bigbang-center-gesture="double" size={25} strokeWidth={1.8} className="-rotate-45 text-cyan-200" aria-hidden="true" />
                  ) : (
                    <>
                      <span data-bigbang-idle-core="true" className="w-2.5 h-2.5 rounded-full bg-cyan-300/80 blur-[1px] animate-pulse" />
                      <div
                        className={`absolute rounded-full border border-cyan-400/30 transition-all duration-300 ${
                          isPressing ? 'w-8 h-8 scale-110 opacity-70' : 'w-5 h-5 animate-ping opacity-40'
                        }`}
                      />
                      <div
                        className={`absolute rounded-full border border-purple-400/20 transition-all duration-300 ${
                          isPressing ? 'w-12 h-12 scale-115 opacity-60' : 'w-8 h-8 animate-pulse opacity-30'
                        }`}
                      />
                    </>
                  )}
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </>, document.body
  );
}
