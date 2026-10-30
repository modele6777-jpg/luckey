/** System media controls for background speech. */
let enabled = false;
export function setTTSSessionActive(title: string, artist = 'LucKey'): void {
  if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
  enabled = true;
  if (typeof MediaMetadata !== 'undefined') navigator.mediaSession.metadata = new MediaMetadata({ title, artist });
  navigator.mediaSession.playbackState = 'playing';
}
export function pauseTTSSession(): void { if (enabled && navigator.mediaSession) navigator.mediaSession.playbackState = 'paused'; }
export function resumeTTSSession(): void { if (enabled && navigator.mediaSession) navigator.mediaSession.playbackState = 'playing'; }
export function clearTTSSession(): void {
  enabled = false;
  if (typeof navigator !== 'undefined' && navigator.mediaSession) { navigator.mediaSession.playbackState = 'none'; navigator.mediaSession.metadata = null; }
}
export function initTTSSessionHandlers(onStop: () => void, onPause?: () => void, onResume?: () => void): void {
  if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
  for (const [action, handler] of [['stop', onStop], ['pause', onPause], ['play', onResume]] as const) {
    try { navigator.mediaSession.setActionHandler(action, () => { if (enabled) handler?.(); }); } catch { /* Unsupported action. */ }
  }
}
