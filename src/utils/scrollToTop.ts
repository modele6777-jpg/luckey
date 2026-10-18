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

function scrollRootsToBottom(behavior: ScrollBehavior) {
  try {
    const maxTop = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );
    window.scrollTo({ top: maxTop, left: 0, behavior });
  } catch (_) {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }

  try {
    document.documentElement.scrollTo({ top: document.documentElement.scrollHeight, left: 0, behavior });
    document.body.scrollTo({ top: document.body.scrollHeight, left: 0, behavior });
  } catch (_) {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    document.body.scrollTop = document.body.scrollHeight;
  }

  // Scroll all data-app-scroll-root elements to bottom
  document.querySelectorAll(SCROLL_ROOT_SELECTOR).forEach((node) => {
    const el = node as HTMLElement;
    try {
      el.scrollTo({ top: el.scrollHeight, left: 0, behavior });
    } catch (_) {
      el.scrollTop = el.scrollHeight;
      el.scrollLeft = 0;
    }
  });

  // Also scroll any active overflow-y scroll containers to bottom
  document.querySelectorAll<HTMLElement>('.overflow-y-auto, .overflow-y-scroll').forEach((el) => {
    try {
      el.scrollTo({ top: el.scrollHeight, left: 0, behavior });
    } catch (_) {
      el.scrollTop = el.scrollHeight;
    }
  });
}

export function resetAppScrollToBottom(behavior: ScrollBehavior = "smooth") {
  scrollRootsToBottom(behavior);
  if (behavior !== "smooth") {
    requestAnimationFrame(() => scrollRootsToBottom(behavior));
  }
}