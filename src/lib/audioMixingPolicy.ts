/** TTS explicitly takes background-playback priority while it is speaking.
 * Other app audio remains ambient; release the priority on pause, stop or completion.
 * iOS may pause external music while TTS owns this playback session.
 */
let isAudioActive = false;
let speechAudioActive = false;

export function setAppAudioActive(active: boolean): void {
  isAudioActive = active;
  applyAudioMixingPolicy();
}

export function setSpeechAudioActive(active: boolean): void {
  speechAudioActive = active;
  if (active) isAudioActive = true;
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
    const desiredType = speechAudioActive ? 'playback' : 'ambient';
    if (session && session.type !== desiredType) session.type = desiredType;
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
