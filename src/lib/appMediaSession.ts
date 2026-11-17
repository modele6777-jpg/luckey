import { setAppAudioActive, setSpeechAudioActive, applyAudioMixingPolicy } from './audioMixingPolicy';

/** Track in-app audio without taking ownership of OS-wide media controls. */
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

/** Keep BGM and TTS on nonexclusive ambient playback; leave OS controls to external players. */
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
