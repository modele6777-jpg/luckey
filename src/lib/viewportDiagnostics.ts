import { APP_VERSION } from './appVersion';
import { readViewportSnapshot } from './visualViewportBox';

const ACTIVE_KEY = 'luckey-viewport-diagnostics-active';
const HISTORY_KEY = 'luckey-viewport-diagnostics-history';
let closePanel: (() => void) | null = null;

/** Explicit local troubleshooting mode. Records geometry only, never page text. */
export function showViewportDiagnostics(resume = false): void {
  if (closePanel) return;
  try {
    if (resume && sessionStorage.getItem(ACTIVE_KEY) !== '1') return;
    sessionStorage.setItem(ACTIVE_KEY, '1');
  } catch { if (resume) return; }
  let history: unknown[] = [];
  try { history = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]'); } catch { /* ignore */ }
  if (!Array.isArray(history)) history = [];
  const panel = document.createElement('section');
  panel.setAttribute('aria-label', '화면 상태 진단');
  panel.style.cssText = 'position:fixed;z-index:2147483647;left:12px;top:max(12px,env(safe-area-inset-top,0px));width:min(340px,calc(100vw - 110px));max-height:65dvh;overflow:auto;padding:14px;border:1px solid #687790;border-radius:14px;background:#101824;color:#fff;font:13px/1.5 system-ui;box-shadow:0 8px 30px #0008;pointer-events:auto';
  const title = document.createElement('strong');
  title.textContent = `화면 상태 · v${APP_VERSION}`;
  const summary = document.createElement('pre');
  summary.style.cssText = 'white-space:pre-wrap;margin:10px 0;font:12px/1.5 monospace;color:#fff';
  const hint = document.createElement('p');
  hint.textContent = '잘린 화면에서 상태를 복사해 대화에 붙여 넣어 주세요. 대화 내용은 포함하지 않습니다.';
  const copy = document.createElement('button');
  copy.textContent = '상태 복사';
  const dismiss = document.createElement('button');
  dismiss.textContent = '닫기';
  for (const button of [copy, dismiss]) {
    button.type = 'button';
    button.style.cssText = 'padding:9px 12px;margin-right:8px;border:1px solid #9aa9ba;border-radius:8px;background:#21334d;color:white;font:inherit;cursor:pointer';
  }
  panel.append(title, summary, hint, copy, dismiss);
  document.body.append(panel);
  const rect = (selector: string) => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return { top: r.top, bottom: r.bottom, width: r.width, height: r.height, clientHeight: el.clientHeight, scrollHeight: el.scrollHeight, position: s.position, overflow: s.overflow, transform: s.transform, maxHeight: s.maxHeight };
  };
  const capture = (reason: string) => {
    if (document.visibilityState === 'hidden') return;
    const style = getComputedStyle(document.documentElement);
    const data = {
      reason, at: new Date().toISOString(), version: APP_VERSION,
      viewport: readViewportSnapshot(window),
      device: { userAgent: navigator.userAgent, standalone: (navigator as Navigator & { standalone?: boolean }).standalone, pixelRatio: devicePixelRatio, orientation: screen.orientation?.type },
      keyboard: document.documentElement.classList.contains('keyboard-open'),
      insets: Object.fromEntries(['--sat', '--sab', '--app-height', '--vvh', '--vv-top'].map(k => [k, style.getPropertyValue(k)])),
      elements: Object.fromEntries(['html', 'body', '#root', '.prism-app-shell', '.sites-pinned-main', '.sites-pinned-sidebar', '.lucy-chat-shell', '.lucy-chat-footer'].map(k => [k, rect(k)])),
    };
    history.push(data);
    history = history.slice(-12);
    try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch { /* ignore */ }
    summary.textContent = `창: ${innerWidth} × ${innerHeight}\n표시: ${visualViewport?.width} × ${visualViewport?.height}\nCSS 높이: ${data.viewport.cssViewportHeight ?? '-'}\n앱 하단: ${data.elements['#root']?.bottom ?? '-'}\n입력창 하단: ${data.elements['.lucy-chat-footer']?.bottom ?? '-'}\n키보드: ${data.keyboard ? '열림' : '닫힘'}`;
    return data;
  };
  copy.onclick = async () => {
    capture('copy');
    const value = JSON.stringify({ geometryHistory: history }, null, 2);
    try {
      await navigator.clipboard.writeText(value);
      copy.textContent = '복사됨';
    } catch {
      const output = document.createElement('textarea');
      output.readOnly = true;
      output.value = value;
      output.style.cssText = 'width:100%;height:140px;color:#111;background:white;font:12px monospace';
      panel.append(output);
      output.select();
      hint.textContent = '선택된 화면 상태를 복사해서 붙여 넣어 주세요.';
    }
  };
  const onResize = () => capture('resize');
  const onResume = () => capture('resume');
  window.addEventListener('resize', onResize);
  window.addEventListener('pageshow', onResume);
  document.addEventListener('visibilitychange', onResume);
  const timer = window.setInterval(() => capture('sample'), 2000);
  closePanel = () => {
    window.clearInterval(timer);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pageshow', onResume);
    document.removeEventListener('visibilitychange', onResume);
    panel.remove();
    try { sessionStorage.removeItem(ACTIVE_KEY); sessionStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ }
    closePanel = null;
  };
  dismiss.onclick = () => closePanel?.();
  capture('open');
}
