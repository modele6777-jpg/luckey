/** Master requests stay in the reasoning tier even when a provider is throttled. */
export const LUCY_MASTER_MODEL = 'gemini-3.1-pro-preview';
export const LUCY_MASTER_FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-flash-latest'];
export function modelCandidates(primary: string, fallback: readonly string[]): string[] {
  return [...new Set([primary, ...fallback].filter(Boolean))];
}
export function isMasterTierModel(model: string): boolean {
  return modelCandidates(LUCY_MASTER_MODEL,LUCY_MASTER_FALLBACK_MODELS).includes(model);
}
