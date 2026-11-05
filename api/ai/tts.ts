import type { Response } from "express";

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, channels = 1, bitsPerSample = 16): Buffer {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmBuffer]);
}

let geminiUnavailableUntil = 0;

export async function synthesizeWithGemini(text: string, voice?: string, dependencies?: { apiKey?: string; request?: typeof fetch; models?: string[] }): Promise<{ audioContent: string; encoding: 'wav'; sampleRate: number; voice: string; provider: 'gemini' } | null> {
  const geminiKey = dependencies ? dependencies.apiKey : (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  if (!geminiKey || Date.now() < geminiUnavailableUntil) return null;
  const request = dependencies?.request || fetch;
  const voiceName = voice === "Charon" ? "Charon" : "Kore";

  const models = dependencies?.models || (process.env.GEMINI_TTS_MODEL ? [process.env.GEMINI_TTS_MODEL] : [
    "gemini-3.8-flash-lite-tts",
    "gemini-3.1-flash-tts-preview",
    "gemini-3.8-flash-tts",
  ]);

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const resp = await request(url, {
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
        signal: AbortSignal.timeout(8000),
      });

      if (!resp.ok) {
        console.warn(`[ai/tts] Gemini model ${model} HTTP ${resp.status}`);
        // Auth/quota/network failures affect the account, not just this model.
        // Retrying three models adds delay and more rate-limited requests.
        if (resp.status !== 404) {
          if ([401, 403, 429].includes(resp.status)) geminiUnavailableUntil = Date.now() + 60000;
          return null;
        }
        continue;
      }

      const data = await resp.json() as any;
      const part = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (!part?.data) continue;

      let rawBase64 = part.data;
      const mime = String(part.mimeType || "");

      // If PCM (e.g. audio/l16), wrap with standard WAV header so browser audio can play seamlessly
      if (mime.includes("l16") || mime.includes("pcm")) {
        const pcmBuf = Buffer.from(rawBase64, "base64");
        const wavBuf = pcmToWav(pcmBuf, 24000, 1, 16);
        rawBase64 = wavBuf.toString("base64");
      }

      return {
        audioContent: rawBase64,
        encoding: "wav",
        sampleRate: 24000,
        voice: voiceName,
        provider: "gemini"
      };
    } catch (e) {
      console.warn(`[ai/tts] Gemini model ${model} failed:`, e instanceof Error ? e.name : 'request failed');
      geminiUnavailableUntil = Date.now() + 15000;
      return null;
    }
  }

  return null;
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

    // 🌟 1순위: Google Gemini Neural Audio TTS (다중 모델 자동 페일오버)
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
