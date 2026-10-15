import type { Response } from "express";
import { applyCors } from "../../../server/api-lib/cors";
import { isAllowedImageProxyUrl, proxyArtworkImage } from "../../../server/api-lib/museArtworkImage";

export default async function handler(req: { method?: string; query?: Record<string, unknown> }, res: Response) {
  applyCors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = String(req.query.url || "");
  try {
    if (!isAllowedImageProxyUrl(url)) {
      return res.status(400).json({ error: "Invalid image URL" });
    }
    await proxyArtworkImage(url, res);
  } catch (err: unknown) {
    console.error("[muse/artwork-image/proxy] error:", err);
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : "이미지 프록시에 실패했습니다.";
      return res.status(502).json({ error: message });
    }
  }
}