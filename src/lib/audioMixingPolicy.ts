/** Keep Luckey audio nonexclusive; background continuation remains best-effort per platform. */
let isAudioActive = false;
let speechAudioActive = false;
// 실시간 음성 상담이 마이크를 쓰는 동안만 녹음 가능한 오디오 세션을 쓴다.
// iOS는 'ambient' 세션에서 마이크 녹음을 허용하지 않아, 권한 창조차 뜨지 않고 바로 거부된다.
let micCaptureActive = false;

export function setMicCaptureActive(active: boolean): void {
  micCaptureActive = active;
  applyAudioMixingPolicy();
}

export function isMicCaptureActive(): boolean {
  return micCaptureActive;
}

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
    const wanted = micCaptureActive ? 'play-and-record' : 'ambient';
    if (session && session.type !== wanted) session.type = wanted;
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
