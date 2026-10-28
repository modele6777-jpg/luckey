/** TTS must not claim the system media controls used by external music apps.
 * In-app play/pause/stop controls remain handled by the TTS player itself.
 */
export function setTTSSessionActive(_title: string, _artist?: string): void {}
export function pauseTTSSession(): void {}
export function resumeTTSSession(): void {}
export function clearTTSSession(): void {}
export function initTTSSessionHandlers(_onStop: () => void, _onPause?: () => void, _onResume?: () => void): void {}
