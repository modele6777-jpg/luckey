function normalizeApiKey(raw: unknown): string {
  return String(raw || "").trim().replace(/^["']|["']$/g, "");
}

function sanitizeXaiKey(raw: unknown): string {
  const key = normalizeApiKey(raw).replace(/[^\x21-\x7E]/g, "");
  if (key.startsWith("xai-") || key.startsWith("sk-xai-")) {
    return key;
  }
  return "";
}

/** Vercel/로컬 환경 변수 이름 차이(xAI, XAI_API_KEY 등)를 모두 지원 */
export function getXaiApiKey(): string {
  const candidates = [
    process.env.XAI_API_KEY,
    process.env.GROK_API_KEY,
    process.env.xAI,
    process.env.XAI,
    process.env.AI_API_KEY,
  ];

  for (const raw of candidates) {
    const key = sanitizeXaiKey(raw);
    if (key) return key;
  }

  return "";
}