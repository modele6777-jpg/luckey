// Share in-flight acquisition; a late OS response must not keep the screen awake
// after stop or clear a newer lock when an older sentinel releases.
let wakeLockSentinel: any = null;
let isWakeLockRequested = false;
let generation = 0;
let pendingLock: Promise<boolean> | null = null;
let pendingGeneration = 0;

export async function acquireScreenWakeLock(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return false;
  isWakeLockRequested = true;
  if (wakeLockSentinel && !wakeLockSentinel.released) return true;
  if (pendingLock) {
    const requestedGeneration = pendingGeneration;
    const result = await pendingLock;
    return isWakeLockRequested && generation !== requestedGeneration
      ? acquireScreenWakeLock() : result;
  }
  const requestGeneration = generation;
  const request = (async () => {
    try {
      const sentinel = await (navigator as any).wakeLock.request('screen');
      if (!isWakeLockRequested || generation !== requestGeneration) {
        try { await sentinel.release(); } catch { /* OS already released it */ }
        return false;
      }
      wakeLockSentinel = sentinel;
      sentinel.addEventListener('release', () => {
        if (wakeLockSentinel === sentinel) wakeLockSentinel = null;
      });
      return true;
    } catch (error) {
      console.debug('[WakeLock] Unable to acquire screen wake lock:', error);
      return false;
    }
  })();
  pendingGeneration = requestGeneration;
  pendingLock = request;
  try { return await request; }
  finally { if (pendingLock === request) pendingLock = null; }
}

export async function releaseScreenWakeLock(): Promise<void> {
  isWakeLockRequested = false;
  generation++;
  const sentinel = wakeLockSentinel;
  wakeLockSentinel = null;
  if (sentinel && !sentinel.released) {
    try { await sentinel.release(); } catch { /* OS already released it */ }
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isWakeLockRequested) void acquireScreenWakeLock();
  });
}
