export async function withAudioTimeout<T>(work: Promise<T>, milliseconds: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([work, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), milliseconds);
    })]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Safari can keep returning an interrupted context after resume() settles or
 * hangs. Try one fresh context, preserving cancellation and bounding both waits. */
export async function recoverSpeechContext<T extends { state: string; resume(): Promise<void> }>(
  getContext: () => T,
  replaceContext: (context: T) => T,
  isCurrent: () => boolean,
): Promise<T | null> {
  let context = getContext();
  for (let attempt = 0; attempt < 2; attempt++) {
    if (!isCurrent()) return null;
    if (context.state === 'running') return context;
    try {
      await withAudioTimeout(context.resume(), 1500, '음성 출력 복구 시간이 초과되었습니다.');
    } catch { /* Replace a stuck context once instead of requiring app restart. */ }
    if (!isCurrent()) return null;
    if ((context.state as string) === 'running') return context;
    if (!attempt) context = replaceContext(context);
  }
  throw Object.assign(new Error('음성 출력을 복구하지 못했습니다. 재생 버튼을 다시 눌러 주세요.'), { code: 'TTS_CONTEXT_STALLED' });
}
