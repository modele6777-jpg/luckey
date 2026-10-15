let handlersBound = false;

export function setTTSSessionActive(title: string, artist: string = 'PRISM'): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title.slice(0, 80) || '음성 안내',
      artist,
      album: 'PRISM Universe',
      artwork: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    });
    // 백그라운드 재생 지속(화면 꺼짐 및 타 앱 전환 시 오디오 유지)을 위한 공식 playbackState 선언
    navigator.mediaSession.playbackState = 'playing';
  } catch {
    // MediaMetadata unsupported on some browsers
  }
}

export function pauseTTSSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = 'paused';
  } catch {}
}

export function resumeTTSSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  try {
    navigator.mediaSession.playbackState = 'playing';
  } catch {}
}

export function clearTTSSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

  try {
    navigator.mediaSession.playbackState = 'none';
    navigator.mediaSession.metadata = null;
  } catch {
    // ignore
  }
}

export function initTTSSessionHandlers(
  onStop: () => void,
  onPause?: () => void,
  onResume?: () => void
): void {
  if (handlersBound || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  handlersBound = true;

  const bind = (action: MediaSessionAction, handler: (() => void) | null) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      // action not supported
    }
  };

  bind('stop', onStop);
  bind('pause', onPause || onStop);
  bind('play', onResume || null);
}