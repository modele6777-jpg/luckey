import { useState, useEffect, useRef, useCallback } from 'react';
import { useTTSState } from '@/utils/tts';
import { planTtsScroll } from '@/lib/ttsScrollFollow';

const managedContainers = new WeakSet<HTMLElement>();

export interface UseSmartScrollOptions {
  /**
   * Ref to a scrollable HTML element (e.g., modal body with overflow-y-auto).
   * If omitted or null, the nearest scroll container or [data-app-scroll-root] is targeted.
   */
  containerRef?: React.RefObject<HTMLElement | null>;
  /**
   * Whether smart scroll tracking is active (e.g. modal isOpen). Defaults to true.
   */
  enabled?: boolean;
  /**
   * Milliseconds of user inactivity before auto-scroll resumes. Defaults to 3000ms.
   */
  resumeDelayMs?: number;
  /**
   * CSS selector for the currently active TTS sentence mark.
   * Defaults to '.tts-active-sentence-highlight, [data-tts-active="true"]'.
   */
  selector?: string;
  /**
   * Optional vertical offset adjustment in pixels (e.g. for sticky headers).
   */
  centerOffset?: number;
}

export interface UseSmartScrollReturn {
  /**
   * Whether the user has taken over manual scrolling, pausing auto-scroll.
   */
  isUserOverriding: boolean;
  /**
   * Remaining seconds until auto-scroll automatically resumes (3 -> 2 -> 1 -> 0).
   */
  remainingSeconds: number;
  /**
   * Manually resume auto-scroll immediately and jump smoothly to the active sentence.
   */
  resumeAutoScroll: () => void;
  /**
   * Whether an active highlight element currently exists in the target container.
   */
  hasActiveHighlight: boolean;
  /**
   * Container ref to attach to your scrollable element (can use your own or this one).
   */
  containerRef: React.RefObject<HTMLElement | null>;
  /**
   * Programmatically trigger smooth centering on the active highlight.
   */
  scrollToActiveSentence: (force?: boolean) => boolean;
}

export function useSmartScroll(options: UseSmartScrollOptions = {}): UseSmartScrollReturn {
  const {
    containerRef: externalContainerRef,
    enabled = true,
    resumeDelayMs = 3000,
    selector = '.tts-active-sentence-highlight, [data-tts-active="true"]',
    centerOffset = 0,
  } = options;

  const fallbackRef = useRef<HTMLElement | null>(null);
  const containerRef = externalContainerRef || fallbackRef;

  const { isSpeaking, activeSentence, activeText, currentSentence } = useTTSState();
  const currentSentenceKey = currentSentence || activeSentence || activeText;

  const [isUserOverriding, setIsUserOverriding] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(3);
  const [hasActiveHighlight, setHasActiveHighlight] = useState(false);

  const isUserOverridingRef = useRef(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticScrollingRef = useRef(false);
  const programmaticScrollResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 정렬은 한 번에 하나만 진행된다. 겹친 smooth scroll은 서로를 밀어내며 화면을 출렁이게 했다.
  const scrollAnimationFrameRef = useRef<number | null>(null);
  const lastAlignedTopRef = useRef<number | null>(null);

  const cancelScrollAnimation = useCallback(() => {
    if (scrollAnimationFrameRef.current !== null) {
      cancelAnimationFrame(scrollAnimationFrameRef.current);
      scrollAnimationFrameRef.current = null;
    }
  }, []);

  /** 프로그램 스크롤 직후의 잔여 scroll 이벤트를 사용자 조작으로 오인하지 않게 잠깐 더 잠근다. */
  const holdProgrammaticScroll = useCallback((ms: number) => {
    isProgrammaticScrollingRef.current = true;
    if (programmaticScrollResetTimerRef.current) {
      clearTimeout(programmaticScrollResetTimerRef.current);
    }
    programmaticScrollResetTimerRef.current = setTimeout(() => {
      isProgrammaticScrollingRef.current = false;
      programmaticScrollResetTimerRef.current = null;
    }, ms);
  }, []);

  const animateContainerScroll = useCallback(
    (container: HTMLElement, from: number, to: number, duration: number) => {
      cancelScrollAnimation();
      if (typeof requestAnimationFrame !== 'function' || duration <= 0) {
        container.scrollTop = to;
        holdProgrammaticScroll(120);
        return;
      }
      const startedAt = performance.now();
      holdProgrammaticScroll(duration + 160);
      const step = () => {
        const progress = Math.min(1, (performance.now() - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        container.scrollTop = from + (to - from) * eased;
        if (progress < 1) {
          scrollAnimationFrameRef.current = requestAnimationFrame(step);
          return;
        }
        scrollAnimationFrameRef.current = null;
        holdProgrammaticScroll(160);
      };
      scrollAnimationFrameRef.current = requestAnimationFrame(step);
    },
    [cancelScrollAnimation, holdProgrammaticScroll]
  );

  // Clear timers helper
  const clearTimers = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const container = externalContainerRef?.current;
    if (!enabled || !container) return;
    managedContainers.add(container);
    return () => { managedContainers.delete(container); };
  }, [enabled, externalContainerRef, isSpeaking]);

  const getActiveElement = useCallback((): HTMLElement | null => {
    if (externalContainerRef && !externalContainerRef.current) return null;
    const root = externalContainerRef?.current || document;

    const active = Array.from(root.querySelectorAll<HTMLElement>('[data-tts-active="true"]'));
    const candidates = active.length ? active : Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!candidates.length) return null;

    let pool = candidates;
    if (candidates.length > 1) {
      // 지금 낭독 중인 말풍선 안의 하이라이트를 우선한다. 같은 문장이 여러 말풍선에 있어도
      // 예전 말풍선과 새 말풍선 사이를 오가지 않는다.
      const playing = candidates.filter((element) => element.closest('[data-tts-playing-message="true"]'));
      pool = playing.length ? playing : candidates;
    }

    let target = pool[0];
    if (pool.length > 1) {
      const container = containerRef.current;
      const box = container?.getBoundingClientRect();
      const center = box ? box.top + container!.clientHeight / 2 : window.innerHeight / 2;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const element of pool) {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        if (distance < bestDistance) {
          target = element;
          bestDistance = distance;
        }
      }
    }

    if (externalContainerRef) return target;
    for (let element = target.parentElement; element; element = element.parentElement) {
      if (managedContainers.has(element)) return null;
    }
    return target;
  }, [containerRef, externalContainerRef, selector]);

  // Resolve scrollable parent container for any target element
  const resolveScrollContainer = useCallback((target: HTMLElement | null): HTMLElement | null => {
    if (containerRef.current) return containerRef.current;
    if (!target) {
      return document.querySelector<HTMLElement>('[data-app-scroll-root], main.overflow-y-auto, .overflow-y-auto');
    }

    let cur: HTMLElement | null = target.parentElement;
    while (cur && cur !== document.body && cur !== document.documentElement) {
      if (cur.hasAttribute('data-app-scroll-root')) {
        return cur;
      }
      const style = window.getComputedStyle(cur);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && cur.scrollHeight > cur.clientHeight + 10) {
        return cur;
      }
      cur = cur.parentElement;
    }

    return document.scrollingElement as HTMLElement | null;
  }, [containerRef]);

  // Viewport centering math
  const scrollToActiveSentence = useCallback(
    (force: boolean = false): boolean => {
      if (!enabled) return false;
      const target = getActiveElement();
      if (!target) {
        setHasActiveHighlight(false);
        return false;
      }

      setHasActiveHighlight(true);
      const container = resolveScrollContainer(target);
      if (!container) return false;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // If target has no dimensions (not laid out yet), retry on next frame
      if (targetRect.height === 0 && targetRect.width === 0) {
        return false;
      }

      // Current position and target metrics relative to container
      const currentScroll = container.scrollTop;
      const viewportTop = container === document.scrollingElement ? 0 : containerRect.top + container.clientTop;
      const containerHeight = container.clientHeight;
      const targetCenterOffset = targetRect.top + targetRect.height / 2 - (viewportTop + containerHeight / 2) + centerOffset;
      const maxScroll = Math.max(0, container.scrollHeight - containerHeight);

      const plan = planTtsScroll({
        currentTop: currentScroll,
        maxTop: maxScroll,
        targetCenterOffset,
        targetRelativeTop: targetRect.top - viewportTop,
        targetRelativeBottom: targetRect.bottom - viewportTop,
        containerHeight,
        lastTargetTop: lastAlignedTopRef.current,
        force,
      });

      lastAlignedTopRef.current = plan.top;
      if (!plan.scroll) return true;

      animateContainerScroll(container, currentScroll, plan.top, plan.duration);
      return true;
    },
    [enabled, getActiveElement, resolveScrollContainer, centerOffset, animateContainerScroll]
  );

  // Resume auto-scroll action (called by user click or 3s timeout)
  const resumeAutoScroll = useCallback(() => {
    clearTimers();
    isUserOverridingRef.current = false;
    setIsUserOverriding(false);
    setRemainingSeconds(0);
    lastAlignedTopRef.current = null;
    requestAnimationFrame(() => {
      scrollToActiveSentence(true);
    });
  }, [clearTimers, scrollToActiveSentence]);

  // User gesture detection: wheel, touchmove, touchstart, scrollbar drag
  useEffect(() => {
    if (!enabled) return;

    const handleUserGesture = (e: Event) => {
      // If TTS isn't speaking, manual gestures don't trigger override state
      if (!isSpeaking) return;

      // A real gesture always wins over our own animation.
      if (e.type !== 'keydown') cancelScrollAnimation();

      // Ignore programmatic scrolling events
      if (isProgrammaticScrollingRef.current) return;

      // Handle keyboard navigation keys only if arrow/page keys
      if (e.type === 'keydown') {
        const key = (e as KeyboardEvent).key;
        if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', 'Home', 'End'].includes(key)) {
          return;
        }
      }

      // Check if active highlight exists before setting override
      const activeElem = getActiveElement();
      if (!activeElem) return;

      setHasActiveHighlight(true);
      isUserOverridingRef.current = true;
      setIsUserOverriding(true);

      // Reset 3-second resume timer
      clearTimers();
      const initialSeconds = Math.ceil(resumeDelayMs / 1000);
      setRemainingSeconds(initialSeconds);

      let timeLeft = initialSeconds;
      countdownIntervalRef.current = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
        } else {
          setRemainingSeconds(timeLeft);
        }
      }, 1000);

      resumeTimerRef.current = setTimeout(() => {
        resumeAutoScroll();
      }, resumeDelayMs);
    };

    const targetNode: EventTarget = containerRef.current || window;
    const passiveOpts = { passive: true };

    targetNode.addEventListener('wheel', handleUserGesture, passiveOpts);
    targetNode.addEventListener('touchmove', handleUserGesture, passiveOpts);
    targetNode.addEventListener('touchstart', handleUserGesture, passiveOpts);
    targetNode.addEventListener('pointerdown', handleUserGesture, passiveOpts);
    window.addEventListener('keydown', handleUserGesture, passiveOpts);

    return () => {
      targetNode.removeEventListener('wheel', handleUserGesture);
      targetNode.removeEventListener('touchmove', handleUserGesture);
      targetNode.removeEventListener('touchstart', handleUserGesture);
      targetNode.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, [enabled, isSpeaking, resumeDelayMs, containerRef, clearTimers, getActiveElement, resumeAutoScroll, cancelScrollAnimation]);

  // When TTS stops speaking, reset override immediately
  useEffect(() => {
    if (!isSpeaking) {
      clearTimers();
      cancelScrollAnimation();
      lastAlignedTopRef.current = null;
      isUserOverridingRef.current = false;
      setIsUserOverriding(false);
      setHasActiveHighlight(false);
    }
  }, [isSpeaking, clearTimers, cancelScrollAnimation]);

  // When active sentence changes, auto-scroll to center if not overriding
  useEffect(() => {
    if (!enabled || !isSpeaking || !currentSentenceKey) return;

    // If user is currently looking at another section, do NOT hijack the screen!
    if (isUserOverridingRef.current) {
      const elem = getActiveElement();
      setHasActiveHighlight(!!elem);
      return;
    }

    // Schedule scroll on next frame so DOM has rendered the new <mark>
    const timer = setTimeout(() => {
      scrollToActiveSentence(false);
    }, 40);

    return () => clearTimeout(timer);
  }, [enabled, isSpeaking, currentSentenceKey, getActiveElement, scrollToActiveSentence]);

  // Listen for immediate highlight render event
  useEffect(() => {
    if (!enabled || !isSpeaking) return;
    const handleHighlightRender = () => {
      if (!isUserOverridingRef.current) {
        requestAnimationFrame(() => {
          scrollToActiveSentence(false);
        });
      }
    };
    window.addEventListener('prism:tts-sentence-highlighted', handleHighlightRender);
    return () => {
      window.removeEventListener('prism:tts-sentence-highlighted', handleHighlightRender);
    };
  }, [enabled, isSpeaking, scrollToActiveSentence]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      cancelScrollAnimation();
      if (programmaticScrollResetTimerRef.current) {
        clearTimeout(programmaticScrollResetTimerRef.current);
      }
    };
  }, [clearTimers, cancelScrollAnimation]);

  return {
    isUserOverriding,
    remainingSeconds,
    resumeAutoScroll,
    hasActiveHighlight,
    containerRef,
    scrollToActiveSentence,
  };
}
