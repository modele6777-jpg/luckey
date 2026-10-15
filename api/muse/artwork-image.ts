import type { Response } from "express";
import { applyCors } from "../../server/api-lib/cors";
import { resolveMuseArtworkImage } from "../../server/api-lib/museArtworkImage";

export default async function handler(req: { method?: string; body?: Record<string, unknown> }, res: Response) {
  applyCors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { forcePollinations, ...art } = req.body || {};
    const result = await resolveMuseArtworkImage(art as any, { forcePollinations: !!forcePollinations });
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[muse/artwork-image] error:", err);
    const message = err instanceof Error ? err.message : "작품 이미지를 불러오지 못했습니다.";
    return res.status(500).json({ error: message });
  }
}