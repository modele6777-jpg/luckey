import { setAppAudioActive, applyAudioMixingPolicy } from './audioMixingPolicy';

/** App audio lock-screen & background playback session manager */
export type MediaSessionOwner = 'bgm' | 'tts';

export interface AppMediaSessionConfig {
  title: string;
  artist: string;
  state: MediaSessionPlaybackState;
  actions?: Partial<Record<MediaSessionAction, (() => void) | null>>;
}

let activeOwner: MediaSessionOwner | null = null;
const sessionConfigs: Partial<Record<MediaSessionOwner, AppMediaSessionConfig>> = {};

/** Lock-screen & background media session update. When speech or BGM is active,
 * establishes a valid OS media session so iOS allows continuous screen-off playback. */
export function updateAppMediaSession(owner: MediaSessionOwner, config: AppMediaSessionConfig | null): void {
  if (config && config.state === 'playing') {
    sessionConfigs[owner] = config;
    activeOwner = owner;
    setAppAudioActive(true);
  } else {
    delete sessionConfigs[owner];
    if (activeOwner === owner) {
      const remaining = Object.keys(sessionConfigs) as MediaSessionOwner[];
      activeOwner = remaining.length > 0 ? remaining[0] : null;
      if (!activeOwner) {
        setAppAudioActive(false);
      }
    }
  }

  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
    applyAudioMixingPolicy();
    return;
  }

  try {
    const currentConfig = activeOwner ? sessionConfigs[activeOwner] : null;
    if (currentConfig && currentConfig.state === 'playing') {
      navigator.mediaSession.playbackState = 'playing';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentConfig.title || 'LUCKEY',
        artist: currentConfig.artist || 'Lucy',
        album: 'LUCKEY Universe',
      });
      if (currentConfig.actions) {
        for (const [action, handler] of Object.entries(currentConfig.actions)) {
          try {
            navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler || null);
          } catch (_) {}
        }
      }
    } else {
      navigator.mediaSession.playbackState = 'paused';
    }
  } catch (_) {}

  applyAudioMixingPolicy();
}
