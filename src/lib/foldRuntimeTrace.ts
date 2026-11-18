import { APP_VERSION } from './appVersion';

const ACTIVE = 'luckey-fold-trace-active';
const RECORD = 'luckey-fold-trace-v1';
let marker: ((stage: string) => void) | null = null;
/** No-op unless the user explicitly enabled diagnostics in this tab. */
export function markFoldRuntime(stage: string): void { marker?.(stage); }

/**
 * Turn the trace on from inside the app (a home-screen web app has no address
 * bar for ?foldDebug=1). It stays on across app restarts until "진단 종료".
 */
export function startFoldRuntimeTrace(win: Window): void {
  try { win.localStorage.setItem(ACTIVE, '1'); } catch { /* optional storage */ }
  installFoldRuntimeTrace(win);
}

/** Opt-in, local-only trace. No messages, profile, URLs or credentials are recorded. */
export function installFoldRuntimeTrace(win: Window): void {
  if (marker) return;
  let enabled = false;
  try {
    const mode = new URLSearchParams(win.location.search).get('foldDebug');
    if (mode === '0') { win.sessionStorage.removeItem(ACTIVE); win.localStorage.removeItem(ACTIVE); }
    else if (mode === '1') win.sessionStorage.setItem(ACTIVE, '1');
    enabled = win.sessionStorage.getItem(ACTIVE) === '1' || win.localStorage.getItem(ACTIVE) === '1';
  } catch { return; }
  if (!enabled) return;
  let previous: unknown = null;
  try { previous = JSON.parse(win.localStorage.getItem(RECORD) || 'null'); } catch { /* optional storage */ }
  const rows: unknown[] = [];
  const counts: Record<string, number> = {};
  const cleanup: Array<() => void> = [];
  let lastWrite = 0;
  let stage = 'bootstrap';
  let frameCount = 0;
  let frame = 0;
  let lastFrameAt = 0;
  const startedAt = new Date().toISOString();
  let lag = 0;
  let maxLag = 0;
  // Element identity only (tag, id, a few classes, pane): never text content.
  const describe = (el: Element | null) => {
    if (!el) return null;
    const classes = typeof (el as HTMLElement).className === 'string' ? (el as HTMLElement).className.split(/\s+/).filter(Boolean).slice(0, 4).join('.') : '';
    const pane = el.closest<HTMLElement>('[data-workspace-pane]')?.dataset.workspacePane
      ?? el.closest<HTMLElement>('[data-overlay-pane]')?.dataset.overlayPane ?? null;
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${classes ? '.' + classes : ''}${pane ? ' @' + pane : ''}`;
  };
  let lastTouch: { x: number; y: number; target: string | null } | null = null;
  const hitTest = () => {
    const doc = win.document;
    const pane = (name: string) => {
      const el = doc.querySelector<HTMLElement>(`[data-workspace-pane="${name}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { display: win.getComputedStyle(el).display, x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) };
    };
    return {
      center: describe(doc.elementFromPoint(win.innerWidth / 2, win.innerHeight / 2)),
      lastTouchNow: lastTouch ? describe(doc.elementFromPoint(lastTouch.x, lastTouch.y)) : null,
      lastTouch,
      content: pane('content'), lucy: pane('lucy'),
      openLayers: Array.from(doc.querySelectorAll<HTMLElement>('[data-screen-overlay-layer]'))
        .filter(layer => layer.childElementCount > 0)
        .map(layer => `${layer.dataset.overlayPane || '?'}:${win.getComputedStyle(layer).display}:${Math.round(layer.getBoundingClientRect().width)}`),
      bodyOverflow: doc.body?.style.overflow || '', bodyPointer: doc.body ? win.getComputedStyle(doc.body).pointerEvents : '',
      canvas: { w: doc.documentElement.clientWidth, h: doc.documentElement.clientHeight },
      appHeight: doc.documentElement.style.getPropertyValue('--app-height'),
      root: (() => { const r = doc.getElementById('root')?.getBoundingClientRect(); return r ? { y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) } : null; })(),
      nav: (() => { const r = doc.querySelector('.sites-pinned-sidebar')?.getBoundingClientRect(); return r ? { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) } : null; })(),
    };
  };
  const save = (reason: string, extra?: unknown) => {
    const now = Date.now();
    let hit: unknown = null;
    try { hit = hitTest(); } catch { /* diagnostics must never throw */ }
    rows.push({ at: new Date(now).toISOString(), reason, stage,
      width: win.innerWidth, height: win.innerHeight,
      visualWidth: win.visualViewport?.width, visualHeight: win.visualViewport?.height,
      classes: win.document.documentElement.className,
      hidden: win.document.hidden,
      standalone: (win.navigator as Navigator & { standalone?: boolean }).standalone === true,
      frameCount, lastFrameAt, lagMs: lag, maxLagMs: maxLag, counts: { ...counts }, hit, extra });
    if (rows.length > 100) rows.shift();
    lastWrite = now;
    try { win.localStorage.setItem(RECORD, JSON.stringify({ version: APP_VERSION, startedAt, rows })); } catch { /* optional storage */ }
  };
  marker = next => {
    stage = next;
    counts[next] = (counts[next] || 0) + 1;
    if (Date.now() - lastWrite >= 250 || next === 'fold-commit' || next === 'unfold-commit' || next.startsWith('viewport-')) save('stage');
  };
  const listen = (target: EventTarget, name: string, action: EventListener) => {
    target.addEventListener(name, action, { capture: true, passive: true });
    cleanup.push(() => target.removeEventListener(name, action, true));
  };
  listen(win, 'touchstart', raw => {
    const touch = (raw as TouchEvent).touches?.[0];
    if (touch) lastTouch = { x: Math.round(touch.clientX), y: Math.round(touch.clientY), target: describe(raw.target as Element | null) };
  });
  for (const name of ['resize', 'orientationchange', 'pageshow', 'pagehide', 'touchstart', 'pointerdown']) {
    listen(win, name, () => {
      counts[name] = (counts[name] || 0) + 1;
      if (Date.now() - lastWrite >= 250 || name === 'pagehide' || name === 'orientationchange') save(name);
    });
  }
  // Event storms (scroll lock bouncing, viewport writes, popup re-measuring) are counted.
  listen(win, 'scroll', () => { counts.windowScroll = (counts.windowScroll || 0) + 1; });
  if (win.visualViewport) listen(win.visualViewport, 'scroll', () => { counts.visualScroll = (counts.visualScroll || 0) + 1; });
  const domWrites = new MutationObserver(records => { counts.rootStyleWrites = (counts.rootStyleWrites || 0) + records.length; });
  domWrites.observe(win.document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
  cleanup.push(() => domWrites.disconnect());
  if (win.visualViewport) listen(win.visualViewport, 'resize', () => {
    counts.visualResize = (counts.visualResize || 0) + 1;
    if (Date.now() - lastWrite >= 250) save('visual-resize');
  });
  listen(win.document, 'visibilitychange', () => save('visibility'));
  listen(win, 'error', raw => {
    const e = raw as ErrorEvent;
    save('error', { name: e.error?.name, file: e.filename?.split('/').at(-1)?.split('?')[0], line: e.lineno, column: e.colno });
  });
  listen(win, 'unhandledrejection', raw => save('rejection', { name: (raw as PromiseRejectionEvent).reason?.name || 'unknown' }));
  // Main-thread lag: how late each 500ms heartbeat fired. Native iOS scrolling
  // keeps working while JavaScript is busy, so taps can die while scroll lives.
  let lastBeat = Date.now();
  const timer = win.setInterval(() => {
    const now = Date.now();
    lag = Math.max(0, now - lastBeat - 500);
    maxLag = Math.max(maxLag, lag);
    lastBeat = now;
    save('heartbeat');
    if (!frame && !win.document.hidden) frame = win.requestAnimationFrame(() => {
      frame = 0; frameCount++; lastFrameAt = Date.now();
    });
  }, 500);
  const box = win.document.createElement('aside');
  box.setAttribute('aria-label', '접힘 진단');
  box.style.cssText = 'position:fixed;z-index:2147483647;left:8px;top:max(8px,env(safe-area-inset-top,0px));max-width:calc(100vw - 100px);padding:8px;background:#111827;color:white;border:1px solid #94a3b8;border-radius:10px;font:12px system-ui;pointer-events:auto';
  const title = win.document.createElement('span'); title.textContent = `진단 ${APP_VERSION} `;
  const copy = win.document.createElement('button'); copy.type = 'button'; copy.textContent = '멈춤 기록 복사';
  const close = win.document.createElement('button'); close.type = 'button'; close.textContent = '진단 종료';
  for (const b of [copy, close]) b.style.cssText = 'margin:2px;padding:6px;border:1px solid #94a3b8;border-radius:6px;background:#21334d;color:white;font:inherit';
  box.append(title, copy, close); win.document.body.append(box);
  copy.onclick = async () => {
    save('copy');
    const data = JSON.stringify({ previousRun: previous, currentRun: { version: APP_VERSION, startedAt, rows } }, null, 2);
    try { await win.navigator.clipboard.writeText(data); copy.textContent = '복사됨'; }
    catch {
      const out = win.document.createElement('textarea'); out.readOnly = true; out.value = data;
      out.style.cssText = 'width:100%;height:120px;background:white;color:black'; box.append(out); out.select();
    }
  };
  close.onclick = () => {
    marker = null; cleanup.forEach(stop => stop()); win.clearInterval(timer); win.cancelAnimationFrame(frame); box.remove();
    try { win.sessionStorage.removeItem(ACTIVE); win.localStorage.removeItem(ACTIVE); } catch { /* optional storage */ }
  };
  save('bootstrap');
}
