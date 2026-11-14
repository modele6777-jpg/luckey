import { updateAppMediaSession } from './appMediaSession';

/** Keep in-app TTS state; OS-wide media metadata and transport controls remain untouched. */
let enabled = false;
let title = '';
let artist = 'LucKey';
let state: MediaSessionPlaybackState = 'playing';
let actions: Partial<Record<MediaSessionAction, () => void>> = {};
const publish = () => updateAppMediaSession('tts', enabled ? { title, artist, state, actions } : null);

export function setTTSSessionActive(nextTitle: string, nextArtist = 'LucKey'): void {
  enabled = true; title = nextTitle; artist = nextArtist; state = 'playing'; publish();
}
export function pauseTTSSession(): void { if (enabled) { state = 'paused'; publish(); } }
export function resumeTTSSession(): void { if (enabled) { state = 'playing'; publish(); } }
export function clearTTSSession(): void { enabled = false; publish(); }
export function initTTSSessionHandlers(onStop: () => void, onPause?: () => void, onResume?: () => void): void {
  actions = { stop: onStop, pause: onPause, play: onResume };
  if (enabled) publish();
}
