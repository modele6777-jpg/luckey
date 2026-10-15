/**
 * Sanitizes internal prompt wrappers, multi-channel synergy directives,
 * or master mode prefixes from user-facing message bubbles.
 */
export function cleanUserMessageDisplay(text: string | null | undefined): string {
  if (!text || typeof text !== 'string') return '';
  return text
    // Strip synergy mode directive e.g. [2중 융합 시너지 모드: 오렌지 + 트리니티] or [⚡ 2중 융합 시너지 모드: ...]
    .replace(/^<?\[(?:⚡\s*)?[\d]+중\s*융합\s*시너지\s*모드:[^\]>]+\]\s*(?:결합된\s*지능\s*엔진들의\s*관점을\s*다각도로\s*융합하여\s*깊이\s*있는\s*시너지\s*답변을\s*도출해\s*줘)?:?>?\s*\n?/gi, '')
    // Strip Pro master directive e.g. [올인원 PRO 마스터 풀가동] or [🌟 올인원 PRO 마스터 풀가동]
    .replace(/^<?\[(?:🌟\s*)?올인원\s*PRO\s*마스터\s*풀가동\][^:\n>]*:?>?\s*\n?/gi, '')
    // Strip any raw <[⚡ ...]> or <[...] wrappers
    .replace(/^<\[(?:⚡\s*)?[^>]+\][^>]*:?>?\s*\n?/gi, '')
    // Strip any leading [⚡ ...] prompt blocks
    .replace(/^\[(?:⚡\s*)?[^\]]+\][^:\n]*:?>?\s*\n?/gi, '')
    .trimStart();
}
