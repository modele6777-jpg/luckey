export const SUGGESTIONS_SYSTEM_SUFFIX =
  "\n\nAt the end of your response, you MUST include exactly 3 smart, highly contextual suggestions in this precise format: [SUGGESTIONS: s1 | s2 | s3]. Use the pipe character (|) as the separator between suggestions. CRITICAL RULES: 1. Each suggestion MUST directly connect to the exact topic, emotion, advice, or spiritual/wellness insight just discussed in this turn (e.g. asking for deeper cause, practical step, inner child care, grounding). 2. Phrased strictly as the USER's natural spoken voice to you (~해줘, ~는 어때?, ~알려줘). 3. Strictly avoid disconnected generic questions. They must feel like the organic next step of this specific dialogue.";

export function parseSuggestions(text: string): string[] {
  const match = text.match(/\[SUGGESTIONS:\s*([\s\S]*?)\]/i);
  if (!match?.[1]) return [];

  const raw = match[1].trim();
  if (!raw) return [];

  if (raw.includes("|")) {
    return raw
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);
  }

  const lookaheadSplit = raw
    .split(/,\s*(?=[가-힣A-Za-z「'"])/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lookaheadSplit.length >= 2 && lookaheadSplit.length <= 4) {
    return lookaheadSplit.slice(0, 4);
  }

  const commaSplit = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (commaSplit.length <= 4) return commaSplit;

  return commaSplit.slice(0, 3);
}

export function cleanChatDisplayText(text: string): string {
  if (!text) return "";
  let cleaned = text;

  // 1. Remove closed directives completely
  cleaned = cleaned.replace(/\[EMOTION:\s*[\s\S]*?\]/gi, "");
  cleaned = cleaned.replace(/\[SUGGESTIONS:\s*[\s\S]*?\]/gi, "");
  cleaned = cleaned.replace(/\[SOUL_UPDATE:\s*[\s\S]*?\]/gi, "");

  // 2. Remove unclosed directives ONLY if they are at the very end of the stream without a closing bracket
  cleaned = cleaned.replace(/\[EMOTION:\s*[^\]]*$/i, "");
  cleaned = cleaned.replace(/\[SUGGESTIONS:\s*[^\]]*$/i, "");
  cleaned = cleaned.replace(/\[SOUL_UPDATE:\s*[^\]]*$/i, "");

  // 3. Remove degenerate repeating tokens / words only if runaway at the trailing end
  cleaned = cleaned.replace(/(?:^|\s)([a-zA-Z가-힣]{2,})(?:[\s,.-]+\1){4,}[\s,.-]*$/i, "");

  return cleaned.trim();
}