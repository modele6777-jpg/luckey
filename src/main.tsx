import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { initPerfMode, initNarrowPhoneClass, getSwUpdateIntervalMs } from './lib/perfMode';
import { initHorizontalWheelScroll } from './lib/horizontalWheelScroll';

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

initPerfMode();
initNarrowPhoneClass();
initHorizontalWheelScroll();

const SW_UPDATE_INTERVAL_MS = getSwUpdateIntervalMs();

if (import.meta.env.PROD) {
  registerSW({
    immediate: true,
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
