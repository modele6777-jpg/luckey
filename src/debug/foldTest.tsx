import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { isDuoUnfoldedState, subscribeDuoLayout, initNarrowPhoneClass, initPerfMode } from '../lib/perfMode';
import { readViewportSnapshot } from '../lib/visualViewportBox';
import { RetainedPane } from '../components/layout/RetainedPane';
import { OverlayPaneContext } from '../components/layout/OverlayPaneContext';
import { LucyLibraryDialogs, LucyLibraryTrigger } from '../components/chat/LucyLibraryDialogs';
import { hasOpenScreenOverlay } from '../components/layout/ScreenPortal';
import { useViewportScrollLock } from '../hooks/useViewportScrollLock';
import '../index.css';
import '../styles/duo-workspace.css';

function Diagnostic() {
  useViewportScrollLock();
  const [layout, setLayout] = useState(isDuoUnfoldedState);
  const [count, setCount] = useState(0);
  const [trace, setTrace] = useState('');
  const last = useRef(layout.unfolded);
  const [retained, setRetained] = useState(false);
  useEffect(() => {
    const sync = () => {
      const next = isDuoUnfoldedState();
      if (last.current !== next.unfolded) { setRetained(hasOpenScreenOverlay()); last.current = next.unfolded; }
      setLayout(prev => prev.unfolded === next.unfolded && prev.orientation === next.orientation ? prev : next);
      const v = readViewportSnapshot(window);
      setTrace(JSON.stringify({ inner: [v.innerWidth, v.innerHeight], css: [v.cssViewportWidth, v.cssViewportHeight], document: [v.layoutViewportWidth, v.layoutViewportHeight], unfolded: next.unfolded, orientation: next.orientation }));
    };
    sync(); return subscribeDuoLayout(sync);
  }, []);
  const dual = layout.unfolded;
  const stacked = layout.orientation === 'portrait';
  return <div style={{ position: 'fixed', inset: 0, display: 'flex', background: '#111827', color: '#fff' }}>
    <main className="sites-pinned-main" style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: dual && stacked ? 'column' : 'row' }}>
      <section data-workspace-pane="content" id={dual ? 'duo-content-viewport' : undefined} style={{ display: dual ? 'block' : 'none', flex: 1, minWidth: 0, minHeight: 0, overflow: 'auto', padding: 20, border: '1px solid #475569' }}>
        <h1>콘텐츠 화면</h1><p>기기를 접고 펼쳐 보세요.</p><p>운영 앱과 대화 데이터에는 연결하지 않는 진단 화면입니다.</p>
      </section>
      <section data-workspace-pane="lucy" id={dual ? 'duo-lucy-viewport' : undefined} style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'auto', padding: 16, border: '1px solid #475569' }}>
        <OverlayPaneContext.Provider value="lucy"><RetainedPane active={true}>
          <h1>화면 전환 진단</h1><p>{dual ? '펼친 화면' : '접힌 화면'} · {layout.orientation}</p>
          <button style={{ padding: 12, background: '#2563eb', borderRadius: 12, marginBlock: 12 }} onClick={() => setCount(n => n + 1)}>터치 확인: {count}</button>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <LucyLibraryTrigger stateKey="fold-diagnostic:engine" style={{ padding: 12, background: '#334155', borderRadius: 10 }}>엔진 목록 열기</LucyLibraryTrigger>
            <LucyLibraryTrigger stateKey="fold-diagnostic:prompt" style={{ padding: 12, background: '#334155', borderRadius: 10 }}>추천 질문 열기</LucyLibraryTrigger>
          </div>
          <p style={{ marginTop: 16 }}>열린 목록의 검색어를 넣고 접었다 펼쳐서 유지되는지 확인해 주세요.</p>
          <p>마지막 전환 때 열린 팝업 감지: {retained ? '유지' : '없음'}</p>
          <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', marginTop: 16 }}>{trace}</pre>
          <LucyLibraryDialogs sessionKey="fold-diagnostic" isLight={true} onSelectPrompt={() => setCount(n => n + 1)} />
        </RetainedPane></OverlayPaneContext.Provider>
      </section>
    </main>
    <nav className="sites-pinned-sidebar" style={{ width: 60, flexShrink: 0, padding: 8, background: '#1e293b' }}>메뉴<br/>영역</nav>
  </div>;
}
initPerfMode();
initNarrowPhoneClass();
registerSW({ immediate: true });
createRoot(document.getElementById('root')!).render(<Diagnostic />);
