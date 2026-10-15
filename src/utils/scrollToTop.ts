const SCROLL_ROOT_SELECTOR = "[data-app-scroll-root]";

function scrollRootsToTop(behavior: ScrollBehavior) {
  try {
    window.scrollTo({ top: 0, left: 0, behavior });
  } catch (_) {
    window.scrollTo(0, 0);
  }

  try {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior });
    document.body.scrollTo({ top: 0, left: 0, behavior });
  } catch (_) {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  // Scroll all data-app-scroll-root elements
  document.querySelectorAll(SCROLL_ROOT_SELECTOR).forEach((node) => {
    const el = node as HTMLElement;
    try {
      el.scrollTo({ top: 0, left: 0, behavior });
    } catch (_) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  });

  // Also scroll any active overflow-y scroll containers that are scrolled down
  document.querySelectorAll<HTMLElement>('.overflow-y-auto, .overflow-y-scroll').forEach((el) => {
    if (el.scrollTop > 0) {
      try {
        el.scrollTo({ top: 0, left: 0, behavior });
      } catch (_) {
        el.scrollTop = 0;
      }
    }
  });
}

export function resetAppScroll(behavior: ScrollBehavior = "auto") {
  scrollRootsToTop(behavior);
  if (behavior !== "smooth") {
    requestAnimationFrame(() => scrollRootsToTop(behavior));
  }
}