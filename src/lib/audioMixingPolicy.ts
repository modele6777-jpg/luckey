/** Keep iOS web-app audio nonexclusive while idle, but retain background playback
 * ('playback' audioSession) whenever speech (TTS) or background music (BGM) is actively playing,
 * ensuring screen-off (lock screen) and app-switch playback never pauses.
 */

let isAudioActive = false;

export function setAppAudioActive(active: boolean): void {
  isAudioActive = active;
  if (typeof navigator === 'undefined' || !('audioSession' in navigator)) return;
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) {
      const target = active ? 'playback' : 'ambient';
      if (session.type !== target) session.type = target;
    }
  } catch { /* Session selection is unavailable on some browsers/iOS versions. */ }
}

export function isAppAudioActive(): boolean {
  return isAudioActive;
}

export function applyAudioMixingPolicy(): void {
  if (typeof navigator === 'undefined' || !('audioSession' in navigator)) return;
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) {
      // If audio is actively playing, keep 'playback' so screen-off and app-switch playback never halts.
      const target = isAudioActive ? 'playback' : 'ambient';
      if (session.type !== target) session.type = target;
    }
  } catch { /* Session selection is unavailable on some browsers/iOS versions. */ }
}

let installed = false;

/** Establish mixing before any channel can create audio, without starting audio. */
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
