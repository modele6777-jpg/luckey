/** Keep the current speech chunk pending during a small, finite transient retry window. */
export async function retrySpeechRequest<T>(request: () => Promise<T>, options: {
  isActive: () => boolean;
  waitUntilResumed: () => Promise<boolean>;
  delay?: (ms: number) => Promise<void>;
  maxRetries?: number;
}): Promise<T> {
  let retriesUsed = 0;
  const maxRetries = Math.max(0, Math.min(5, Math.floor(options.maxRetries ?? 2)));
  const delay = options.delay || ((ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)));
  for (;;) {
    if (!options.isActive() || !await options.waitUntilResumed()) throw new Error('음성 요청이 취소되었습니다.');
    try { return await request(); }
    catch (error) {
      const failure = error as { status?: number; code?: string };
      if (
        !options.isActive() ||
        ['TTS_NOT_CONFIGURED', 'TTS_PROVIDER_UNAVAILABLE', 'MEDIA_QUOTA_EXHAUSTED', 'MEDIA_RATE_LIMIT',
          'GEMINI_API_KEY_INVALID', 'GEMINI_TTS_ACCESS_DENIED'].includes(failure?.code || '') ||
        failure?.status === 429 ||
        (failure?.status && failure.status < 500 && failure.status !== 408) ||
        retriesUsed >= maxRetries
      ) throw error;
      // Respect cancellation during backoff and never reset the current chunk.
      let remaining = Math.min(20000, 2000 * 2 ** Math.min(retriesUsed++, 4));
      while (remaining > 0) {
        if (!options.isActive()) throw new Error('음성 요청이 취소되었습니다.');
        const slice = Math.min(200, remaining);
        await delay(slice);
        remaining -= slice;
      }
    }
  }
}
