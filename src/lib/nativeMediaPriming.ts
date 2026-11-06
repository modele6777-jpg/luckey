import { applyAudioMixingPolicy } from './audioMixingPolicy';
let primeUrl: string | null = null;

/** Authorize one media element during an explicit Play gesture, never on app entry. */
export function primeUserMediaPlayback(audio: HTMLAudioElement | null, userGesture: boolean): void {
  if (!audio || !userGesture || audio.getAttribute('src')) return;
  if (!primeUrl) {
    const length = 4410 * 2;
    const bytes = new ArrayBuffer(44 + length);
    const view = new DataView(bytes);
    const text = (offset: number, value: string) => Array.from(value).forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
    text(0, 'RIFF'); view.setUint32(4, 36 + length, true); text(8, 'WAVE'); text(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, 22050, true); view.setUint32(28, 44100, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    text(36, 'data'); view.setUint32(40, length, true);
    primeUrl = URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }));
  }
  audio.src = primeUrl;
  // This short primer is only for the requested asynchronous audio, not a keep-alive loop.
  applyAudioMixingPolicy();
  void audio.play().catch(() => {});
}
