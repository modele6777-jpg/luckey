/** Master requests stay in the reasoning tier even when a provider is throttled. */
export const LUCY_MASTER_MODEL = 'gemini-3.1-pro-preview';
export const LUCY_MASTER_FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-flash-latest'];
export function modelCandidates(primary: string, fallback: readonly string[]): string[] {
  return [...new Set([primary, ...fallback].filter(Boolean))];
}
export function isMasterTierModel(model: string): boolean {
  return modelCandidates(LUCY_MASTER_MODEL,LUCY_MASTER_FALLBACK_MODELS).includes(model);
}

/** Exhaust the configured tier before reporting a provider failure. */
export async function requestWithModelFallback<T>(
  primary: string,
  fallback: readonly string[],
  request: (model: string) => Promise<T>,
): Promise<{ response: T; modelUsed: string }> {
  let lastError: unknown;
  for (const modelUsed of modelCandidates(primary, fallback)) {
    try { return { response: await request(modelUsed), modelUsed }; }
    catch (error) { lastError = error; }
  }
  throw lastError;
}
