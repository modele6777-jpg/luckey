/** One OS media-control owner: speech temporarily takes priority over background music. */
type Owner = 'bgm' | 'tts';
interface SessionConfig {
  title: string;
  artist: string;
  state: MediaSessionPlaybackState;
  actions: Partial<Record<MediaSessionAction, () => void>>;
}
const sessions = new Map<Owner, SessionConfig>();
let installedActions = new Set<MediaSessionAction>();

export function updateAppMediaSession(owner: Owner, config: SessionConfig | null): void {
  if (config) sessions.set(owner, config); else sessions.delete(owner);
  if (sessions.size === 0 && installedActions.size === 0) return;
  if (typeof navigator === 'undefined' || !navigator.mediaSession) return;
  const media = navigator.mediaSession;
  const selected = sessions.get('tts') || sessions.get('bgm');
  for (const action of installedActions) {
    try { media.setActionHandler(action, null); } catch { /* unsupported OS action */ }
  }
  installedActions = new Set();
  if (!selected) { media.playbackState = 'none'; media.metadata = null; return; }
  if (typeof MediaMetadata !== 'undefined') media.metadata = new MediaMetadata({ title: selected.title, artist: selected.artist });
  media.playbackState = selected.state;
  for (const [action, handler] of Object.entries(selected.actions)) {
    try {
      media.setActionHandler(action as MediaSessionAction, handler!);
      installedActions.add(action as MediaSessionAction);
    } catch { /* unsupported OS action */ }
  }
}
