import { setAppAudioActive, setSpeechAudioActive, applyAudioMixingPolicy } from './audioMixingPolicy';

/** Track app audio; only explicit TTS owns background/lock-screen controls. */
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

const installedSpeechActions = new Map<string, () => void>();
let publishedSpeech = false;
let publishedTitle = '';
let publishedArtist = '';

/** BGM never replaces external controls. TTS releases ownership when it ends. */
function publishSpeechControls(config: AppMediaSessionConfig | undefined): void {
  if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
  const media = navigator.mediaSession;
  if (!config) {
    if (!publishedSpeech) return;
    for (const action of installedSpeechActions.keys()) {
      try { media.setActionHandler(action as MediaSessionAction, null); } catch { /* unsupported */ }
    }
    installedSpeechActions.clear();
    media.playbackState = 'none';
    media.metadata = null;
    publishedSpeech = false;
    publishedTitle = publishedArtist = '';
    return;
  }
  publishedSpeech = true;
  if (typeof MediaMetadata !== 'undefined' && (publishedTitle !== config.title || publishedArtist !== config.artist)) {
    media.metadata = new MediaMetadata({ title: config.title, artist: config.artist });
    publishedTitle = config.title;
    publishedArtist = config.artist;
  }
  media.playbackState = config.state;
  const next = config.actions || {};
  for (const action of installedSpeechActions.keys()) {
    if (typeof next[action] !== 'function') {
      try { media.setActionHandler(action as MediaSessionAction, null); } catch { /* unsupported */ }
      installedSpeechActions.delete(action);
    }
  }
  for (const [action, handler] of Object.entries(next)) {
    if (!handler || installedSpeechActions.get(action) === handler) continue;
    try {
      media.setActionHandler(action as MediaSessionAction, handler);
      installedSpeechActions.set(action, handler);
    } catch { /* unsupported OS control */ }
  }
}

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
  publishSpeechControls(sessionConfigs.tts);
}
