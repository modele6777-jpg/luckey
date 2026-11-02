import { useState, useEffect, useRef, useCallback } from 'react';
import { useTTSState } from '@/utils/tts';

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
  const lastTargetElemRef = useRef<Element | null>(null);
  const isProgrammaticScrollingRef = useRef(false);
  const programmaticScrollResetTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Find active element in container or document
  const getActiveElement = useCallback((): HTMLElement | null => {
    if (containerRef.current) {
      const el = containerRef.current.querySelector<HTMLElement>(selector);
      if (el) return el;
    }
    let elem = document.querySelector<HTMLElement>(selector);
    if (!elem) {
      elem = document.querySelector<HTMLElement>('[data-tts-active="true"], .tts-active-sentence-highlight');
    }
    return elem;
  }, [containerRef, selector]);

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

    return document.querySelector<HTMLElement>('[data-app-scroll-root], main.overflow-y-auto, .overflow-y-auto');
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
      lastTargetElemRef.current = target;

      const container = resolveScrollContainer(target);
      if (!container) return false;

      // Flag this as programmatic to prevent user-scroll override triggering
      isProgrammaticScrollingRef.current = true;
      if (programmaticScrollResetTimerRef.current) {
        clearTimeout(programmaticScrollResetTimerRef.current);
      }
      programmaticScrollResetTimerRef.current = setTimeout(() => {
        isProgrammaticScrollingRef.current = false;
      }, 700);

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // If target has no dimensions (not laid out yet), retry on next frame
      if (targetRect.height === 0 && targetRect.width === 0) {
        return false;
      }

      // Calculate target relative to container's scroll content area
      const currentScroll = container.scrollTop;
      const targetRelativeTop = targetRect.top - containerRect.top;
      const targetAbsoluteTop = currentScroll + targetRelativeTop;

      // Center calculation: place target's midpoint in container's vertical center
      const targetHeight = targetRect.height || 26;
      const containerHeight = container.clientHeight;
      const desiredScrollTop = Math.round(
        targetAbsoluteTop - (containerHeight / 2) + (targetHeight / 2) + centerOffset
      );

      const maxScroll = Math.max(0, container.scrollHeight - containerHeight);
      const finalTop = Math.max(0, Math.min(maxScroll, desiredScrollTop));

      // Skip micro-adjustments if already centered within 20px (unless forced)
      if (!force && Math.abs(currentScroll - finalTop) < 20) {
        return true;
      }

      try {
        container.scrollTo({
          top: finalTop,
          behavior: 'smooth',
        });
      } catch (_) {
        container.scrollTop = finalTop;
      }

      return true;
    },
    [enabled, getActiveElement, resolveScrollContainer, centerOffset]
  );

  // Resume auto-scroll action (called by user click or 3s timeout)
  const resumeAutoScroll = useCallback(() => {
    clearTimers();
    isUserOverridingRef.current = false;
    setIsUserOverriding(false);
    setRemainingSeconds(0);
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
  }, [enabled, isSpeaking, resumeDelayMs, containerRef, clearTimers, getActiveElement, resumeAutoScroll]);

  // When TTS stops speaking, reset override immediately
  useEffect(() => {
    if (!isSpeaking) {
      clearTimers();
      isUserOverridingRef.current = false;
      setIsUserOverriding(false);
      setHasActiveHighlight(false);
    }
  }, [isSpeaking, clearTimers]);

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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      if (programmaticScrollResetTimerRef.current) {
        clearTimeout(programmaticScrollResetTimerRef.current);
      }
    };
  }, [clearTimers]);

  return {
    isUserOverriding,
    remainingSeconds,
    resumeAutoScroll,
    hasActiveHighlight,
    containerRef,
    scrollToActiveSentence,
  };
}
