import { setAppAudioActive, setSpeechAudioActive, applyAudioMixingPolicy } from './audioMixingPolicy';

/** Manage OS MediaSession & AudioSession for active TTS background playback while keeping BGM nonexclusive. */
export type MediaSessionOwner = 'bgm' | 'tts';

export interface AppMediaSessionConfig {
  title: string;
  artist: string;
  state: MediaSessionPlaybackState;
  actions?: Partial<Record<MediaSessionAction, (() => void) | null>>;
}

const sessionConfigs: Partial<Record<MediaSessionOwner, AppMediaSessionConfig>> = {};
const TTS_MEDIA_ACTIONS: MediaSessionAction[] = ['play', 'pause', 'stop'];

function syncNavigatorMediaSession(ttsConfig: AppMediaSessionConfig | undefined): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !navigator.mediaSession) return;
  const media = navigator.mediaSession;
  try {
    if (!ttsConfig || ttsConfig.state === 'none') {
      media.playbackState = 'none';
      if ('metadata' in media) media.metadata = null;
      for (const action of TTS_MEDIA_ACTIONS) {
        try { media.setActionHandler(action, null); } catch {}
      }
      return;
    }

    media.playbackState = ttsConfig.state;
    if (typeof MediaMetadata !== 'undefined') {
      media.metadata = new MediaMetadata({
        title: ttsConfig.title || 'Lucy Speech',
        artist: ttsConfig.artist || '루시 (Lucy)',
      });
    }
    for (const action of TTS_MEDIA_ACTIONS) {
      const handler = ttsConfig.actions?.[action] ?? null;
      try { media.setActionHandler(action, handler); } catch {}
    }
  } catch { /* MediaSession API is unavailable or restricted in some environments. */ }
}

export function updateAppMediaSession(owner: MediaSessionOwner, config: AppMediaSessionConfig | null): void {
  if (config && (config.state === 'playing' || (owner === 'tts' && config.state === 'paused'))) {
    sessionConfigs[owner] = config;
  } else {
    delete sessionConfigs[owner];
  }

  if (owner === 'tts') {
    const ttsPlaying = config?.state === 'playing';
    setSpeechAudioActive(ttsPlaying);
    syncNavigatorMediaSession(sessionConfigs.tts);
  }

  const appAudioIsActive = Object.values(sessionConfigs).some((session) => session?.state === 'playing');
  setAppAudioActive(appAudioIsActive);
  applyAudioMixingPolicy();
}
