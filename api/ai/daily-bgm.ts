import type { Response } from "express";

export default async function handler(req: { method?: string; body?: unknown }, res: Response) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = (req.body || {}) as Record<string, unknown>;
    const focusPlaylist = String(body.focusPlaylist || "");
    const dateKey = String(body.dateKey || "");
    const trackKey = String(body.trackKey || "");

    if (!focusPlaylist || !dateKey || !trackKey) {
      return res.status(400).json({ error: "focusPlaylist, dateKey, trackKey are required" });
    }

    const { generateDailyBgmBuffer } = await import("../../server/api-lib/generateDailyBgm");
    const { buffer, durationSec } = generateDailyBgmBuffer({
      focusPlaylist,
      frequency: body.frequency ? String(body.frequency) : undefined,
      cardName: body.cardName ? String(body.cardName) : undefined,
      symbol: body.symbol ? String(body.symbol) : undefined,
      dateKey,
      trackKey,
    });

    return res.status(200).json({
      audioContent: buffer.toString("base64"),
      encoding: "wav",
      trackKey,
      durationSec,
    });
  } catch (err: unknown) {
    console.error("[ai/daily-bgm] error:", err);
    const message = err instanceof Error ? err.message : "Daily BGM generation failed";
    return res.status(500).json({ error: message });
  }
}