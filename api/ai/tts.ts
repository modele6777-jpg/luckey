import type { Response } from "express";
import { applyCors } from "../../server/api-lib/cors";
import { handleTTS } from "../../server/api-lib/ttsHandler";

export default async function handler(req: { method?: string; body?: unknown }, res: Response) {
  applyCors(res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body as any;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_) {}
    } else if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString("utf-8"));
      } catch (_) {}
    }
    body = body || {};

    const text = String(body.text || "");
    const voice = body.voice ? String(body.voice) : undefined;
    const emotion = body.emotion ? String(body.emotion) : undefined;
    const rate = body.rate ? String(body.rate) : undefined;
    const pitch = body.pitch ? String(body.pitch) : undefined;
    const speed = typeof body.speed === "number" ? body.speed : undefined;
    const language = body.language ? String(body.language) : undefined;

    if (!text.trim()) {
      return res.status(400).json({ error: "Empty speech text" });
    }

    const result = await handleTTS({ text, voice, emotion, rate, pitch, speed, language });
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[ai/tts] Vercel error:", err);
    const message = err instanceof Error ? err.message : "TTS generation failed";
    return res.status(500).json({ error: message });
  }
}
