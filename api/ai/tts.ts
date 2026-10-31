import type { Response } from "express";

async function synthesizeWithGemini(text: string, voice?: string): Promise<{ audioContent: string; encoding: 'wav'; sampleRate: number; voice: string; provider: 'gemini' } | null> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "AQ.Ab8RN6Ktg9fspBAkf_p1oB0MmWL7R5_TftVattiDqgGRlTcOpA";
  if (!geminiKey) return null;
  const voiceName = voice === "Charon" ? "Charon" : "Kore";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite-tts:generateContent?key=${geminiKey}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!resp.ok) {
    console.warn(`[ai/tts] Gemini TTS HTTP ${resp.status}`);
    return null;
  }
  const data = await resp.json() as any;
  const audioBase64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioBase64) return null;
  return {
    audioContent: audioBase64,
    encoding: "wav",
    sampleRate: 24000,
    voice: voiceName,
    provider: "gemini"
  };
}

export default async function handler(req: { method?: string; body?: unknown }, res: Response) {
  try {
    const { applyCors } = await import("../../server/api-lib/cors.ts");
    applyCors(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

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

    const text = String(body.text || "").trim();
    const voice = body.voice ? String(body.voice) : undefined;
    const emotion = body.emotion ? String(body.emotion) : undefined;
    const rate = body.rate ? String(body.rate) : undefined;
    const pitch = body.pitch ? String(body.pitch) : undefined;
    const speed = typeof body.speed === "number" ? body.speed : undefined;
    const language = body.language ? String(body.language) : undefined;

    if (!text) {
      return res.status(400).json({ error: "Empty speech text" });
    }

    // 🌟 1순위: Google Gemini 3.8 Flash Neural Audio TTS (스튜디오급 고품질 성우 음성)
    const geminiResult = await synthesizeWithGemini(text, voice).catch(() => null);
    if (geminiResult) {
      return res.status(200).json(geminiResult);
    }

    // 2순위: 서버 백업 TTS 핸들러
    const { handleTTS } = await import("../../server/api-lib/ttsHandler.ts");
    const result = await handleTTS({ text, voice, emotion, rate, pitch, speed, language });
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[ai/tts] Vercel error:", err);
    const message = err instanceof Error ? err.message : "TTS generation failed";
    const failure = err as { status?: number; code?: string; retryAfterSeconds?: number };
    const retryAfter = Number(failure?.retryAfterSeconds);
    const hasRetry = Number.isFinite(retryAfter) && retryAfter > 0;
    if (hasRetry) res.setHeader("Retry-After", String(Math.ceil(retryAfter)));
    return res.status(failure?.status || 500).json({
      error: message,
      detail: message || String(err),
      stack: String((err as Error)?.stack || "").slice(0, 600),
      ...(failure?.code ? { code: failure.code } : {}),
      ...(hasRetry ? { retryAfterSeconds: Math.ceil(retryAfter) } : {}),
    });
  }
}
