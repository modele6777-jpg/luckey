import { setAppAudioActive, applyAudioMixingPolicy } from './audioMixingPolicy';

/** App-local audio activity bookkeeping; do not claim the OS media controls from external players. */
export type MediaSessionOwner = 'bgm' | 'tts';

export interface AppMediaSessionConfig {
  title: string;
  artist: string;
  state: MediaSessionPlaybackState;
  actions?: Partial<Record<MediaSessionAction, (() => void) | null>>;
}

const sessionConfigs: Partial<Record<MediaSessionOwner, AppMediaSessionConfig>> = {};

export function updateAppMediaSession(owner: MediaSessionOwner, config: AppMediaSessionConfig | null): void {
  if (config && config.state === 'playing') {
    sessionConfigs[owner] = config;
  } else {
    delete sessionConfigs[owner];
  }

  const appAudioIsActive = Object.values(sessionConfigs).some((session) => session?.state === 'playing');
  setAppAudioActive(appAudioIsActive);
  applyAudioMixingPolicy();
}
