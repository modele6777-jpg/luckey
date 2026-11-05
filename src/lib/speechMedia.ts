import { primeUserMediaPlayback } from './nativeMediaPriming';
// Use the browser's media pipeline so speech can continue while the page is hidden.
let player: HTMLAudioElement | null = null;
let objectUrl: string | null = null;
let finish: (() => void) | null = null;
let active = false;
let paused = false;
let playbackFailure: (() => void) | null = null;
export function getSpeechMediaElement(): HTMLAudioElement {
  if (!player) {
    player = new Audio();
    player.preload = 'auto';
    player.setAttribute('playsinline', 'true');
    // iOS 사파리에서 오디오 믹싱 허용 속성
    (player as any).preservesPitch = true;
  }
  return player;
}
export function primeSpeechMedia(userGesture = typeof navigator !== 'undefined' && Boolean(navigator.userActivation?.isActive)): void {
  const audio = getSpeechMediaElement();
  primeUserMediaPlayback(audio, userGesture);
}

export function stopSpeechMedia(): void {
  active = false; paused = false;
  finish?.(); finish = null;
  if (player) { player.pause(); player.removeAttribute('src'); player.load(); }
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = null;
}
export function speechMediaProgress() {
  if (!active || !player) return null;
  return { elapsed: player.currentTime || 0, duration: Number.isFinite(player.duration) ? player.duration : 0, paused: paused || player.paused };
}
export function isSpeechMediaPlaying() { return active && !paused && !!player && !player.paused; }
export function pauseSpeechMedia() { if (active) { paused = true; player?.pause(); } }
export function resumeSpeechMedia() { if (active && player) { paused = false; const failed = playbackFailure; void player.play().catch(() => failed?.()); } }
export function playSpeechMedia(bytes: Uint8Array, encoding: string, sampleRate: number, onPlaying?: () => void): Promise<void> {
  // Settle the old chunk without clearing/reloading the shared media element.
  // Safari may release its background session if src is removed between chunks.
  finish?.(); finish = null;
  const previousUrl = objectUrl;
  const audio = getSpeechMediaElement();
  paused = false;
  let data = bytes;
  if (encoding === 'pcm') {
    data = new Uint8Array(44 + bytes.length);
    const view = new DataView(data.buffer);
    const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
    text(0, 'RIFF'); view.setUint32(4, 36 + bytes.length, true); text(8, 'WAVE'); text(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    text(36, 'data'); view.setUint32(40, bytes.length, true); data.set(bytes, 44);
  }
  objectUrl = URL.createObjectURL(new Blob([data as BlobPart], { type: encoding === 'pcm' || encoding === 'wav' ? 'audio/wav' : encoding === 'ogg' ? 'audio/ogg' : 'audio/mpeg' }));
  audio.src = objectUrl; audio.playbackRate = 1; active = true;
  if (previousUrl) URL.revokeObjectURL(previousUrl);
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const playing = () => onPlaying?.();
    const cleanup = () => {
      audio.removeEventListener('playing', playing);
      audio.removeEventListener('ended', ended);
      audio.removeEventListener('error', failed);
      if (finish === ended) finish = null;
      if (playbackFailure === failed) playbackFailure = null;
    };
    const ended = () => { if (settled) return; settled = true; active = false; cleanup(); resolve(); };
    const failed = () => { if (settled) return; settled = true; active = false; cleanup(); reject(new Error('음성을 재생하지 못했습니다. 다시 듣기를 눌러 주세요.')); };
    finish = ended;
    playbackFailure = failed;
    audio.addEventListener('playing', playing, { once: true });
    audio.addEventListener('ended', ended);
    audio.addEventListener('error', failed);
    void audio.play().catch(failed);
  });
}
