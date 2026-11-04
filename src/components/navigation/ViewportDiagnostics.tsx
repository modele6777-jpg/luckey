import React, { useCallback, useEffect, useState } from 'react';
import { WorkspacePortal } from '@/components/layout/DuoWorkspace';
import { APP_VERSION } from '@/lib/appVersion';

function measureViewport() {
  const round = (value: number) => Math.round(value * 100) / 100;
  const rect = (selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return null;
    const bounds = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      left: round(bounds.left), right: round(bounds.right), width: round(bounds.width),
      top: round(bounds.top), bottom: round(bounds.bottom), height: round(bounds.height), paddingRight: style.paddingRight,
      backgroundColor: style.backgroundColor, transform: style.transform,
    };
  };
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const safeArea = { top: style.paddingTop, right: style.paddingRight, bottom: style.paddingBottom, left: style.paddingLeft };
  probe.remove();
  const visual = window.visualViewport;
  return {
    version: APP_VERSION,
    measuredAt: new Date().toISOString(),
    path: window.location.pathname,
    framed: window.self !== window.top,
    standalone: (navigator as Navigator & { standalone?: boolean }).standalone ?? null,
    displayMode: ['fullscreen', 'standalone', 'minimal-ui', 'browser'].filter(mode => matchMedia(`(display-mode: ${mode})`).matches),
    screen: { width: screen.width, height: screen.height, availableWidth: screen.availWidth, availableHeight: screen.availHeight, devicePixelRatio: devicePixelRatio },
    viewport: { innerWidth, innerHeight, clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight },
    visualViewport: visual ? { width: round(visual.width), height: round(visual.height), offsetLeft: round(visual.offsetLeft), offsetTop: round(visual.offsetTop), scale: visual.scale } : null,
    safeArea,
    keyboardOpen: document.documentElement.classList.contains('keyboard-open'),
    elements: { root: rect('#root'), shell: rect('.prism-app-shell'), main: rect('.sites-pinned-main'), footer: rect('.lucy-chat-footer'), sidebar: rect('.sites-pinned-sidebar'), tarot: rect('.tarot-spread-stage-root') },
    visualBox: {
      width: document.documentElement.style.getPropertyValue('--vvw').trim(),
      height: document.documentElement.style.getPropertyValue('--vvh').trim(),
      top: document.documentElement.style.getPropertyValue('--vv-top').trim(),
      left: document.documentElement.style.getPropertyValue('--vv-left').trim(),
      bottom: document.documentElement.style.getPropertyValue('--vv-bottom').trim(),
    },
    viewportMeta: document.querySelector<HTMLMetaElement>('meta[name="viewport"]')?.content,
    statusBarStyle: document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-status-bar-style"]')?.content,
    manifest: document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.getAttribute('href'),
    userAgent: navigator.userAgent,
  };
}

export function ViewportDiagnostics({ onClose }: { onClose: () => void }) {
  const [measurement, setMeasurement] = useState(measureViewport);
  const [message, setMessage] = useState('');
  const refresh = useCallback(() => { setMeasurement(measureViewport()); setMessage(''); }, []);
  useEffect(() => {
    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);
    window.visualViewport?.addEventListener('resize', refresh);
    return () => {
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
      window.visualViewport?.removeEventListener('resize', refresh);
    };
  }, [refresh]);
  const text = JSON.stringify(measurement, null, 2);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setMessage('진단 결과를 복사했습니다.'); }
    catch { setMessage('자동 복사가 지원되지 않습니다. 아래 결과를 선택해 복사해 주세요.'); }
  };
  return (
    <WorkspacePortal onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/85" style={{ borderBottom: '4px solid #22d3ee' }}>
        <section role="dialog" aria-modal="true" aria-labelledby="viewport-diagnostics-title" className="w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-950 text-white p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 id="viewport-diagnostics-title" className="font-bold">화면 영역 진단</h2>
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg border border-white/30">닫기</button>
          </div>
          <p className="text-sm leading-relaxed">하단 여백이 보일 때 결과를 복사해 보내주세요. 회전 시 값이 자동 갱신됩니다.</p>
          <p className="text-sm leading-relaxed">하단 파란 선 아래에도 검은 여백이 남는지 확인해 주세요. 이 기능은 화면 정보만 읽으며 설정이나 저장 데이터를 변경하지 않습니다.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={refresh} className="px-3 py-2 rounded-lg border border-white/30">다시 측정</button>
            <button type="button" onClick={copy} className="px-3 py-2 rounded-lg bg-cyan-700">결과 복사</button>
          </div>
          <p role="status" className="text-sm text-cyan-200">{message}</p>
          <textarea aria-label="화면 진단 결과" tabIndex={0} readOnly value={text} className="w-full h-64 rounded-lg bg-black/50 p-3 font-mono text-xs text-white" />
        </section>
      </div>
    </WorkspacePortal>
  );
}
