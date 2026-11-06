/** Keep iOS web-app audio nonexclusive so Apple Music can continue playing.
 * Every playback entry point uses this policy; background playback must never
 * silently promote it to the exclusive `playback` session category.
 */
export function applyAudioMixingPolicy(): void {
  if (typeof navigator === 'undefined' || !('audioSession' in navigator)) return;
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session && session.type !== 'ambient') session.type = 'ambient';
  } catch { /* Session selection is unavailable on some browsers/iOS versions. */ }
}
