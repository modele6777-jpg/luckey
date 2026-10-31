import type { Response } from "express";

/**
 * ✨ AI 명화 재현 — 서버 의존성 없이 즉시 응답하는 standalone 핸들러.
 *
 * 이전 구현은 server/ 모듈을 static import 해서 Vercel 서버리스 런타임 번들에서
 * 모듈을 찾지 못하고 500 FUNCTION_INVOCATION_FAILED로 항상 크래시했습니다.
 * 이제 외부 의존성을 전혀 두지 않고, 요청된 명화 정보로 고품질 Pollinations
 * 신경망 이미지 URL을 즉시 합성해 돌려줍니다 (클라이언트 폴백과 동일한 프롬프트).
 */

function applyCors(res: Response): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function buildPollinationsUrl(art: Record<string, unknown>): string {
  const title = String(art.title || "masterpiece").trim();
  const creator = String(art.creator || "famous painter").trim();
  const era = String(art.era || "").trim();
  const prompt = encodeURIComponent(
    `Masterpiece oil painting of "${title}" by ${creator}, ${era}, fine art museum gallery quality`,
  );
  return `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=768&nologo=true&model=turbo`;
}

export default async function handler(req: { method?: string; body?: Record<string, unknown> }, res: Response) {
  applyCors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const art = req.body || {};
    const url = buildPollinationsUrl(art);
    return res.status(200).json({ url, displayUrl: url, source: "pollinations" });
  } catch (err: unknown) {
    // 절대 크래시하지 않습니다: 어떤 경우에도 안전한 AI 재현 URL을 돌려줍니다.
    const art = (req.body || {}) as Record<string, unknown>;
    const url = buildPollinationsUrl(art);
    return res.status(200).json({ url, displayUrl: url, source: "pollinations" });
  }
}
