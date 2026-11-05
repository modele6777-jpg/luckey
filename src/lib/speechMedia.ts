// Use the browser's media pipeline so speech can continue while the page is hidden.
let player: HTMLAudioElement | null = null;
let objectUrl: string | null = null;
let finish: (() => void) | null = null;
let active = false;
let paused = false;
export function getSpeechMediaElement(): HTMLAudioElement {
  if (!player) { player = new Audio(); player.preload = 'auto'; player.setAttribute('playsinline', 'true'); }
  return player;
}
export function primeSpeechMedia(): void {
  const audio = getSpeechMediaElement();
  if (active || audio.src) return;
  // Unlock this same element in the click handler before the voice request.
  const wav = new Uint8Array(46);
  const view = new DataView(wav.buffer);
  const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 38, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, 24000, true); view.setUint32(28, 48000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, 'data'); view.setUint32(40, 2, true);
  objectUrl = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
  audio.src = objectUrl;
  void audio.play().catch(() => {});
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
export function resumeSpeechMedia() { if (active && player) { paused = false; void player.play().catch(() => {}); } }
export function playSpeechMedia(bytes: Uint8Array, encoding: string, sampleRate: number, onPlaying?: () => void): Promise<void> {
  stopSpeechMedia();
  const audio = getSpeechMediaElement();
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
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const playing = () => onPlaying?.();
    const cleanup = () => {
      audio.removeEventListener('playing', playing);
      audio.removeEventListener('ended', ended);
      audio.removeEventListener('error', failed);
      if (finish === ended) finish = null;
    };
    const ended = () => { if (settled) return; settled = true; active = false; cleanup(); resolve(); };
    const failed = () => { if (settled) return; settled = true; active = false; cleanup(); reject(new Error('음성을 재생하지 못했습니다. 다시 듣기를 눌러 주세요.')); };
    finish = ended;
    audio.addEventListener('playing', playing, { once: true });
    audio.addEventListener('ended', ended);
    audio.addEventListener('error', failed);
    void audio.play().catch(failed);
  });
}
