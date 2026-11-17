import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { nativeApiUrl } from './apiRouting';

export const isNativeApp = () => Capacitor.isNativePlatform();
export function nativeServerUrl(url: string): string {
  if (!isNativeApp()) return url;
  return nativeApiUrl(url, window.location.origin, import.meta.env?.VITE_NATIVE_API_ORIGIN || 'https://luckey-six.vercel.app');
}
export function nativeImpact(strength: 'subtle' | 'medium' | 'strong' = 'subtle'): boolean {
  if (!isNativeApp()) return false;
  void Haptics.impact({ style: strength === 'strong' ? ImpactStyle.Heavy : strength === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light }).catch(() => undefined);
  return true;
}
let installed = false;
export function installNativeRuntime(): void {
  if (installed || !isNativeApp() || typeof window === 'undefined') return;
  installed = true;
  document.documentElement.classList.add('luckey-native');
  // Keep streaming responses, AbortSignal, methods and authorization headers intact.
  // CapacitorHttp's fetch patch is deliberately disabled: it buffers chat SSE.
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const raw = input instanceof Request ? input.url : String(input);
    const target = nativeServerUrl(raw);
    if (target === raw) return originalFetch(input, init);
    return originalFetch(input instanceof Request ? new Request(target, input) : target, init);
  };
}
