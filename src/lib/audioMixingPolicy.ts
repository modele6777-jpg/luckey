/** Keep all app audio, including TTS, nonexclusive ('ambient') so external players are not
 *  actively displaced. The web API cannot request native AVAudioSession.mixWithOthers; 'playback'
 *  may interrupt or duck another iOS app. Background continuation remains best-effort in WebKit. */
let isAudioActive = false;
let speechAudioActive = false;

export function setAppAudioActive(active: boolean): void {
  isAudioActive = active;
  if (!active) speechAudioActive = false;
  applyAudioMixingPolicy();
}

export function setSpeechAudioActive(active: boolean): void {
  speechAudioActive = active;
  if (active) isAudioActive = true;
  applyAudioMixingPolicy();
}

export function isAppAudioActive(): boolean {
  return isAudioActive;
}

export function isSpeechAudioActive(): boolean {
  return speechAudioActive;
}

export function applyAudioMixingPolicy(): void {
  if (typeof navigator === 'undefined' || !('audioSession' in navigator)) return;
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    // Do not promote active TTS to 'playback': the web AudioSession API exposes no
    // mixWithOthers option, so that mode can take priority over external music on iOS.
    const desiredType = 'ambient';
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
