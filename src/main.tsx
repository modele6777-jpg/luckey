import { installFoldRuntimeTrace } from './lib/foldRuntimeTrace';
import { installIosViewportRecovery } from './lib/iosViewportRecovery';
import { installAudioMixingPolicy } from './lib/audioMixingPolicy';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import './styles/duo-workspace.css';
import './styles/layout-guardrails.css';
import { installSingleAppReload } from './lib/appUpdateReload';
import { initPerfMode, initNarrowPhoneClass, getSwUpdateIntervalMs } from './lib/perfMode';
import { initHorizontalWheelScroll } from './lib/horizontalWheelScroll';
import { initializeLucyMasterModeForFold } from './lib/lucyMasterMode';

// Guard against external browser extension unhandled rejections (MetaMask, Web3 wallet extensions)
if (typeof window !== 'undefined') {
  const isExtensionError = (err: any) => {
    if (!err) return false;
    const msg = String(err?.message || err?.reason?.message || err?.reason || err || '');
    const stack = String(err?.stack || err?.reason?.stack || '');
    const combined = `${msg} ${stack}`;
    return /MetaMask|ethereum|web3|evmProvider|inpage\.js|chrome-extension|moz-extension|safari-extension|Failed to connect to MetaMask|wallet/i.test(combined);
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isExtensionError(event.reason || event)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  }, true);

  window.addEventListener('error', (event) => {
    if (isExtensionError(event.error || event.message || event)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  }, true);
}

installFoldRuntimeTrace(window);
// iOS can leave a zero-height viewport after a fold, routing every tap to <html>.
if (typeof window !== 'undefined') installIosViewportRecovery(window);
installAudioMixingPolicy();
if (typeof window !== 'undefined') installSingleAppReload(window);
initPerfMode();
initNarrowPhoneClass();
initHorizontalWheelScroll();
// 📱 앱을 열었을 때의 기본 화면: 접힘 = 루시 채팅, 펼침 = 루시 점술모드.
// 첫 렌더 전에 맞춰 두어야 루시 화면이 처음부터 올바른 모드로 뜨고, 펼친 채로 열면 타로집 인사를 한 번 건넨다.
initializeLucyMasterModeForFold();

const SW_UPDATE_INTERVAL_MS = getSwUpdateIntervalMs();

if (import.meta.env.PROD) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      void updateSW(true);
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      window.setInterval(() => {
        void registration.update().catch(() => undefined);
      }, SW_UPDATE_INTERVAL_MS);
    },
  });
} else {
  // In development mode, safely unregister any residual ServiceWorkers to prevent MIME type & stale cache conflicts
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => undefined);
      }
    }).catch(() => undefined);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
