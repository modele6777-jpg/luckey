// Screen Wake Lock API helper for continuous audio / reading playback
let wakeLockSentinel: any = null;
let isWakeLockRequested = false;

export async function acquireScreenWakeLock(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
    return false;
  }
  isWakeLockRequested = true;
  try {
    if (!wakeLockSentinel || wakeLockSentinel.released) {
      wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release', () => {
        wakeLockSentinel = null;
      });
    }
    return true;
  } catch (err) {
    console.debug('[WakeLock] Unable to acquire screen wake lock:', err);
    return false;
  }
}

export async function releaseScreenWakeLock(): Promise<void> {
  isWakeLockRequested = false;
  if (wakeLockSentinel && !wakeLockSentinel.released) {
    try {
      await wakeLockSentinel.release();
    } catch {
      // ignore
    }
    wakeLockSentinel = null;
  }
}

// Re-acquire automatically when returning to visible if still requested
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isWakeLockRequested) {
      acquireScreenWakeLock().catch(() => {});
    }
  });
}
