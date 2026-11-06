/** Keep the same speech chunk pending during temporary provider/network outages. */
export async function retrySpeechRequest<T>(request: () => Promise<T>, options: {
  isActive: () => boolean;
  waitUntilResumed: () => Promise<boolean>;
  delay?: (ms: number) => Promise<void>;
}): Promise<T> {
  let attempt = 0;
  const delay = options.delay || ((ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)));
  for (;;) {
    if (!options.isActive() || !await options.waitUntilResumed()) throw new Error('음성 요청이 취소되었습니다.');
    try { return await request(); }
    catch (error) {
      const failure = error as { status?: number; code?: string };
      if (!options.isActive() || ['TTS_NOT_CONFIGURED', 'TTS_PROVIDER_UNAVAILABLE', 'MEDIA_QUOTA_EXHAUSTED'].includes(failure?.code || '') ||
        (failure?.status && failure.status < 500 && failure.status !== 429 && failure.status !== 408)) throw error;
      // Poll cancellation even during backoff, without resetting the current chunk.
      let remaining = Math.min(20000, 2000 * 2 ** Math.min(attempt++, 4));
      while (remaining > 0) {
        if (!options.isActive()) throw new Error('음성 요청이 취소되었습니다.');
        const slice = Math.min(200, remaining);
        await delay(slice);
        remaining -= slice;
      }
    }
  }
}
