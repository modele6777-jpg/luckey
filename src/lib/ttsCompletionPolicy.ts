export interface TTSCompletionPolicyOptions {
  skipCompletionChime?: boolean;
  isChatMode?: boolean;
  /** Legacy compatibility only: chat completion sounds stay disabled. */
  allowChatCompletionChime?: boolean;
}

/** Chat TTS always ends quietly; completion sounds belong to non-chat narration. */
export function shouldPlayTTSCompletionChime(options?: TTSCompletionPolicyOptions): boolean {
  return !options?.skipCompletionChime && !options?.isChatMode;
}
