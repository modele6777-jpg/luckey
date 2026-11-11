export interface TTSCompletionPolicyOptions {
  skipCompletionChime?: boolean;
  isChatMode?: boolean;
  allowChatCompletionChime?: boolean;
}

/** Chat TTS is quiet by default; callers must explicitly opt in to a completion chirp. */
export function shouldPlayTTSCompletionChime(options?: TTSCompletionPolicyOptions): boolean {
  return !options?.skipCompletionChime && (!options?.isChatMode || options.allowChatCompletionChime === true);
}
