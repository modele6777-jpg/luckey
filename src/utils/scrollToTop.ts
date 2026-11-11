const SCROLL_ROOT_SELECTOR = "[data-app-scroll-root], .lucy-chat-main";

function scrollIframeToTop(iframe: HTMLIFrameElement, behavior: ScrollBehavior) {
  try {
    iframe.contentWindow?.postMessage({ type: 'PRISM_SCROLL_TO_TOP', behavior }, '*');
  } catch (_) {}
  try {
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (win) {
      try {
        win.scrollTo({ top: 0, left: 0, behavior });
      } catch (_) {
        win.scrollTo(0, 0);
      }
    }
    if (doc) {
      try {
        doc.documentElement?.scrollTo({ top: 0, left: 0, behavior });
        doc.body?.scrollTo({ top: 0, left: 0, behavior });
      } catch (_) {
        if (doc.documentElement) doc.documentElement.scrollTop = 0;
        if (doc.body) doc.body.scrollTop = 0;
      }
      doc.querySelectorAll<HTMLElement>('[data-app-scroll-root], .overflow-y-auto, .overflow-y-scroll, .portal-container, .main-content').forEach((el) => {
        if (el.scrollTop > 0) {
          try {
            el.scrollTo({ top: 0, left: 0, behavior });
          } catch (_) {
            el.scrollTop = 0;
          }
        }
      });
    }
  } catch (_) {}
}

function scrollRootsToTop(behavior: ScrollBehavior, targetElement?: HTMLElement | null) {
  // iPhone Duo 듀얼 화면 분할 모드 지원: 탭된 패널(우측 루시 vs 좌측 채널)만 선별 스크롤
  const duoLucyPane = targetElement?.closest('#duo-lucy-viewport');
  const duoContentPane = targetElement?.closest('#duo-content-viewport');

  if (duoLucyPane) {
    duoLucyPane.querySelectorAll<HTMLElement>('[data-app-scroll-root], .lucy-chat-main, .overflow-y-auto, .overflow-y-scroll').forEach((el) => {
      try {
        el.scrollTo({ top: 0, left: 0, behavior });
      } catch (_) {
        el.scrollTop = 0;
      }
    });
    try {
      duoLucyPane.scrollTo({ top: 0, left: 0, behavior });
    } catch (_) {
      duoLucyPane.scrollTop = 0;
    }
    return;
  }

  if (duoContentPane) {
    duoContentPane.querySelectorAll<HTMLElement>('[data-app-scroll-root], .overflow-y-auto, .overflow-y-scroll').forEach((el) => {
      try {
        el.scrollTo({ top: 0, left: 0, behavior });
      } catch (_) {
        el.scrollTop = 0;
      }
    });
    try {
      duoContentPane.scrollTo({ top: 0, left: 0, behavior });
    } catch (_) {
      duoContentPane.scrollTop = 0;
    }
    duoContentPane.querySelectorAll<HTMLIFrameElement>('iframe').forEach((iframe) => {
      scrollIframeToTop(iframe, behavior);
    });
    return;
  }

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

  // Also scroll any embedded same-origin iframes (e.g., KEY channel /calm/index.html)
  document.querySelectorAll<HTMLIFrameElement>('iframe').forEach((iframe) => {
    scrollIframeToTop(iframe, behavior);
  });
}

export function resetAppScroll(behavior: ScrollBehavior = "auto", targetElement?: HTMLElement | null) {
  scrollRootsToTop(behavior, targetElement);
  if (behavior !== "smooth") {
    requestAnimationFrame(() => scrollRootsToTop(behavior, targetElement));
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

  // Also scroll any embedded same-origin iframes (e.g., KEY channel /calm/index.html) to bottom
  document.querySelectorAll<HTMLIFrameElement>('iframe').forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage({ type: 'PRISM_SCROLL_TO_BOTTOM', behavior }, '*');
    } catch (_) {}
    try {
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;
      if (doc) {
        const maxIframeTop = Math.max(
          doc.documentElement?.scrollHeight || 0,
          doc.body?.scrollHeight || 0,
          win?.innerHeight || 0
        );
        if (win) {
          try {
            win.scrollTo({ top: maxIframeTop, left: 0, behavior });
          } catch (_) {
            win.scrollTo(0, maxIframeTop);
          }
        }
        try {
          doc.documentElement?.scrollTo({ top: maxIframeTop, left: 0, behavior });
          doc.body?.scrollTo({ top: maxIframeTop, left: 0, behavior });
        } catch (_) {
          if (doc.documentElement) doc.documentElement.scrollTop = maxIframeTop;
          if (doc.body) doc.body.scrollTop = maxIframeTop;
        }
        doc.querySelectorAll<HTMLElement>('[data-app-scroll-root], .overflow-y-auto, .overflow-y-scroll, .portal-container, .main-content').forEach((el) => {
          if (el.scrollHeight > el.clientHeight) {
            try {
              el.scrollTo({ top: el.scrollHeight, left: 0, behavior });
            } catch (_) {
              el.scrollTop = el.scrollHeight;
            }
          }
        });
      }
    } catch (_) {}
  });
}

export function resetAppScrollToBottom(behavior: ScrollBehavior = "smooth") {
  scrollRootsToBottom(behavior);
  if (behavior !== "smooth") {
    requestAnimationFrame(() => scrollRootsToBottom(behavior));
  }
}
