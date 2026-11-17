/** Keep Luckey audio nonexclusive; background continuation remains best-effort per platform. */
let isAudioActive = false;
let speechAudioActive = false;

export function setAppAudioActive(active: boolean): void {
  isAudioActive = active;
  applyAudioMixingPolicy();
}

export function setSpeechAudioActive(active: boolean): void {
  speechAudioActive = active;
  applyAudioMixingPolicy();
}

export function isAppAudioActive(): boolean {
  return isAudioActive || speechAudioActive;
}

export function isSpeechAudioActive(): boolean {
  return speechAudioActive;
}

export function applyAudioMixingPolicy(): void {
  if (typeof navigator === 'undefined' || !('audioSession' in navigator)) return;
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session && session.type !== 'ambient') session.type = 'ambient';
  } catch { /* AudioSession selection is unavailable on some browsers/iOS versions. */ }
}

let installed = false;

/** Establish nonexclusive mixing before any channel can create app audio, without starting audio. */
export function installAudioMixingPolicy(): void {
  if (installed || typeof window === 'undefined' || typeof document === 'undefined') return;
  installed = true;
  applyAudioMixingPolicy();
  window.addEventListener('pointerdown', applyAudioMixingPolicy, { capture: true, passive: true });
  window.addEventListener('keydown', applyAudioMixingPolicy, { capture: true });
  window.addEventListener('pageshow', applyAudioMixingPolicy);
  window.addEventListener('focus', applyAudioMixingPolicy);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') applyAudioMixingPolicy();
  });
}
