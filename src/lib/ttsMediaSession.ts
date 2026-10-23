/**
 * OS MediaSession coordinator for continuous screen-off TTS playback.
 *
 * Registers active MediaMetadata and `playbackState = 'playing'` on mobile and desktop browsers
 * so Android and iOS keep the audio pipeline alive when the screen turns off or is locked.
 */

let onStopHandler: (() => void) | null = null;
let onPauseHandler: (() => void) | null = null;
let onResumeHandler: (() => void) | null = null;

export function setTTSSessionActive(title: string, artist: string = '루시 & 트리니티 AI 보이스'): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    if (typeof MediaMetadata !== 'undefined') {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title ? title.slice(0, 80) : 'PRISM 음성 낭독',
        artist,
        album: 'PRISM 오디오 낭독',
      });
    }
    navigator.mediaSession.playbackState = 'playing';
  } catch (_) {}
}

export function pauseTTSSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = 'paused';
  } catch (_) {}
}

export function resumeTTSSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = 'playing';
  } catch (_) {}
}

export function clearTTSSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = 'none';
  } catch (_) {}
}

export function initTTSSessionHandlers(
  onStop: () => void,
  onPause?: () => void,
  onResume?: () => void
): void {
  onStopHandler = onStop;
  onPauseHandler = onPause || null;
  onResumeHandler = onResume || null;

  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.setActionHandler('play', () => {
      if (onResumeHandler) onResumeHandler();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      if (onPauseHandler) onPauseHandler();
      else if (onStopHandler) onStopHandler();
    });
    navigator.mediaSession.setActionHandler('stop', () => {
      if (onStopHandler) onStopHandler();
    });
  } catch (_) {}
}