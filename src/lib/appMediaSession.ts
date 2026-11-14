import { setAppAudioActive, setSpeechAudioActive, applyAudioMixingPolicy } from './audioMixingPolicy';

/** Track app-owned audio only; deliberately do not publish navigator.mediaSession metadata or controls. */
export type MediaSessionOwner = 'bgm' | 'tts';

export type AppAudioAction = string;
export type AppAudioPlaybackState = 'none' | 'paused' | 'playing';

export interface AppMediaSessionConfig {
  title: string;
  artist: string;
  state: AppAudioPlaybackState;
  actions?: Partial<Record<AppAudioAction, (() => void) | null>>;
}

const sessionConfigs: Partial<Record<MediaSessionOwner, AppMediaSessionConfig>> = {};

/**
 * Keep an internal view of app-owned BGM/TTS activity for audio policy decisions.
 * Never claim the OS media session, which could replace controls for external music.
 */
export function updateAppMediaSession(owner: MediaSessionOwner, config: AppMediaSessionConfig | null): void {
  if (config && (config.state === 'playing' || (owner === 'tts' && config.state === 'paused'))) {
    sessionConfigs[owner] = config;
  } else {
    delete sessionConfigs[owner];
  }

  if (owner === 'tts') {
    setSpeechAudioActive(config?.state === 'playing');
  }

  const appAudioIsActive = Object.values(sessionConfigs).some((session) => session?.state === 'playing');
  setAppAudioActive(appAudioIsActive);
  applyAudioMixingPolicy();
}
