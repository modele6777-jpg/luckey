export function getGeminiApiKey(): string {
  const envKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.AI_API_KEY || "").trim();
  if (envKey && !envKey.includes("AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A")) {
    return envKey;
  }
  return "";
}
