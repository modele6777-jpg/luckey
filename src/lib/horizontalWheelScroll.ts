/**
 * Global Horizontal Scroll Wheel Controller
 * 
 * Automatically enables mouse wheel (vertical scroll wheel) to scroll horizontally
 * across any horizontal-scrollable containers in the application (chips, tabs, carousels, 
 * decks, timeline bars, tables, code snippets, etc.).
 */

/**
 * Checks if an element has horizontal scroll capability
 */
function isHorizontallyScrollable(el: HTMLElement | null): boolean {
  if (!el || el === document.body || el === document.documentElement) return false;
  if (el.getAttribute('data-no-horizontal-wheel') === 'true') return false;

  // Fast path: pure geometry check without forcing expensive style recalculations.
  // For 99% of elements, scrollWidth is <= clientWidth + 4.
  if (el.scrollWidth <= el.clientWidth + 4) {
    return false;
  }

  const style = window.getComputedStyle(el);
  const overflowX = style.overflowX;
  const isScrollOverflow = overflowX === 'auto' || overflowX === 'scroll';
  
  return isScrollOverflow;
}

/**
 * Checks if an element is primarily a vertical scrolling container (like full page, large vertical list, textarea)
 */
function isPrimarilyVertical(el: HTMLElement): boolean {
  if (el.tagName === 'TEXTAREA' || el.isContentEditable) return true;
  
  // Fast path: if element doesn't have vertical overflow, no need to compute style
  if (el.scrollHeight <= el.clientHeight + 4) return false;

  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  const hasVerticalScroll = (overflowY === 'auto' || overflowY === 'scroll');
  
  // If vertical scroll is large and horizontal scroll is trivial, treat as vertical
  if (hasVerticalScroll && (el.scrollHeight - el.clientHeight > 80) && (el.scrollWidth - el.clientWidth < 10)) {
    return true;
  }
  return false;
}

const targetCache = new WeakMap<EventTarget, { container: HTMLElement | null; ts: number }>();

/**
 * Finds the closest ancestor that is horizontally scrollable with short TTL cache & depth limit
 */
export function findHorizontalScrollContainer(target: EventTarget | null): HTMLElement | null {
  if (!target || !(target instanceof HTMLElement)) return null;

  const now = Date.now();
  const cached = targetCache.get(target);
  if (cached && now - cached.ts < 250) {
    return cached.container;
  }

  let curr: HTMLElement | null = target;
  let depth = 0;
  let resolved: HTMLElement | null = null;

  while (curr && curr !== document.body && curr !== document.documentElement && depth++ < 6) {
    if (isHorizontallyScrollable(curr)) {
      if (!isPrimarilyVertical(curr)) {
        resolved = curr;
        break;
      }
    }
    curr = curr.parentElement;
  }

  targetCache.set(target, { container: resolved, ts: now });
  return resolved;
}

/**
 * Global wheel event listener
 */
function handleGlobalWheel(event: WheelEvent) {
  // Ignore pinch-zoom / browser keyboard shortcuts
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  // If user is already scrolling horizontally (trackpad 2-finger horizontal swipe or horizontal wheel)
  if (Math.abs(event.deltaX) >= Math.abs(event.deltaY) && Math.abs(event.deltaX) > 0) {
    return;
  }

  // Need vertical wheel delta to translate to horizontal
  if (Math.abs(event.deltaY) < 0.5) {
    return;
  }

  const container = findHorizontalScrollContainer(event.target);
  if (!container) return;

  // Calculate normalized delta based on deltaMode
  let delta = event.deltaY;
  if (event.deltaMode === 1) {
    // Line mode
    delta *= 32;
  } else if (event.deltaMode === 2) {
    // Page mode
    delta *= container.clientWidth;
  }

  const maxScrollLeft = container.scrollWidth - container.clientWidth;
  const currentScrollLeft = container.scrollLeft;

  // Check if container can move in the requested direction
  const canScrollRight = delta > 0 && currentScrollLeft < maxScrollLeft - 1;
  const canScrollLeft = delta < 0 && currentScrollLeft > 1;

  if (canScrollRight || canScrollLeft) {
    event.preventDefault();
    // Smoothly apply scroll
    container.scrollLeft += delta;
  }
}

let isInitialized = false;

/**
 * Initialize global horizontal mouse wheel listener
 */
export function initHorizontalWheelScroll(): () => void {
  if (typeof window === 'undefined' || isInitialized) {
    return () => {};
  }

  isInitialized = true;
  window.addEventListener('wheel', handleGlobalWheel, { passive: false, capture: true });

  return () => {
    window.removeEventListener('wheel', handleGlobalWheel, { capture: true });
    isInitialized = false;
  };
}
