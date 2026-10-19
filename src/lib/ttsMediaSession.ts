/**
 * Non-exclusive TTS session coordinator.
 *
 * Intentionally avoids claiming `navigator.mediaSession.playbackState = 'playing'`
 * or overwriting `navigator.mediaSession.metadata`, so external music apps
 * (YouTube Music, Melon, Spotify, Apple Music, etc.) continue playing
 * simultaneously without losing OS MediaSession / AudioFocus ownership.
 */

export function setTTSSessionActive(_title: string, _artist: string = 'PRISM'): void {
  // No-op: do not claim exclusive OS MediaSession focus so external music apps keep playing.
}

export function pauseTTSSession(): void {
  // No-op: preserve external music app's active MediaSession state.
}

export function resumeTTSSession(): void {
  // No-op: preserve external music app's active MediaSession state.
}

export function clearTTSSession(): void {
  // No-op: preserve external music app's active MediaSession state.
}

export function initTTSSessionHandlers(
  _onStop: () => void,
  _onPause?: () => void,
  _onResume?: () => void
): void {
  // No-op: do not intercept hardware/lock-screen play/pause controls meant for external music apps.
}