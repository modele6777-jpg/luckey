import type { Response } from "express";
import { applyCors } from "../../server/api-lib/cors";

export default async function handler(req: { method?: string; body?: unknown }, res: Response) {
  applyCors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { handleBluebirdDocent } = await import("../../server/api-lib/bluebirdDocent");
    const result = await handleBluebirdDocent(req.body as Parameters<typeof handleBluebirdDocent>[0]);
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[bluebird/docent] Vercel error:", err);
    const message = err instanceof Error ? err.message : "도슨트 응답 생성에 실패했습니다.";
    const status = message.includes("필요") || message.includes("설정") ? 400 : 500;
    return res.status(status).json({ error: message });
  }
}