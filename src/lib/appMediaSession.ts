import { applyAudioMixingPolicy } from './audioMixingPolicy';
/** App audio must never replace external music in the OS media controls. */
type Owner = 'bgm' | 'tts';
interface SessionConfig {
  title: string;
  artist: string;
  state: MediaSessionPlaybackState;
  actions: Partial<Record<MediaSessionAction, () => void>>;
}
/** External music keeps OS transport/lock-screen ownership, even while app BGM
 * or speech is playing. App playback remains controlled by its own UI. */
export function updateAppMediaSession(_owner: Owner, _config: SessionConfig | null): void {
  applyAudioMixingPolicy();
}
