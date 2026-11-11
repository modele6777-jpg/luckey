import type { Response } from "express";
import { getGeminiApiKey } from "../../server/geminiKey.ts";
import { applyRestrictedCors, bodyTooLarge, rejectDisallowedOrigin } from "../../server/api-lib/publicAccess.ts";

const DEFAULT_TTS_MODELS = ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"];
const REQUEST_TIMEOUT_MS = 24_000;

type TTSDependencies = {
  apiKey?: string;
  request?: typeof fetch;
  models?: string[];
};

type TTSAudioResult = {
  audioContent: string;
  encoding: "wav" | "mp3";
  sampleRate: number;
  voice: string;
  provider: "gemini";
};

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
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmBuffer]);
}

function getGeminiApiKeys(dependencies?: TTSDependencies): string[] {
  // Tests and callers that inject dependencies must explicitly provide a test key.
  if (dependencies) return dependencies.apiKey ? [dependencies.apiKey] : [];
  const key = getGeminiApiKey();
  return key ? [key] : [];
}

function resolveVoice(voice?: string): string {
  return voice === "Charon" ? "Charon" : "Aoede";
}

function resolveSpeechStyle(emotion?: string): string {
  const value = String(emotion || "").toLowerCase();
  const tone = /위로|치유|평온|차분|warm|calm|healing|comfort/.test(value)
    ? "calm and reassuring"
    : /기쁨|설렘|응원|밝음|joy|cheer|bright|happy/.test(value)
      ? "bright and encouraging"
      : /신비|진지|경고|mystery|serious|dreamy/.test(value)
        ? "gentle and reflective"
        : "warm and conversational";
  return `Natural Korean narration with a ${tone} tone, expressive intonation, clear articulation, and natural pauses; avoid a flat, robotic cadence.`;
}

function extractAudio(data: any): { base64: string; mimeType: string } | null {
  const outputAudio = data?.output_audio;
  if (typeof outputAudio?.data === "string" && outputAudio.data) {
    return { base64: outputAudio.data, mimeType: String(outputAudio.mime_type || outputAudio.mimeType || "audio/wav") };
  }

  const steps = Array.isArray(data?.steps) ? data.steps : [];
  for (let index = steps.length - 1; index >= 0; index--) {
    const content = Array.isArray(steps[index]?.content) ? steps[index].content : [];
    for (let partIndex = content.length - 1; partIndex >= 0; partIndex--) {
      const part = content[partIndex];
      if (part?.type === "audio" && typeof part.data === "string" && part.data) {
        return { base64: part.data, mimeType: String(part.mime_type || part.mimeType || "audio/wav") };
      }
    }
  }
  return null;
}

function normalizedAudio(audio: { base64: string; mimeType: string }, voice: string): TTSAudioResult | null {
  let bytes: Buffer;
  try {
    bytes = Buffer.from(audio.base64, "base64");
  } catch {
    return null;
  }
  if (!bytes.length) return null;

  const mime = audio.mimeType.toLowerCase();
  const rateMatch = /(?:rate|sample-rate)\s*=\s*(\d+)/i.exec(mime);
  const sampleRate = Number(rateMatch?.[1]) || 24000;
  if (mime.includes("l16") || mime.includes("pcm")) {
    bytes = pcmToWav(bytes, sampleRate, 1, 16);
    return { audioContent: bytes.toString("base64"), encoding: "wav", sampleRate, voice, provider: "gemini" };
  }
  if (mime.includes("mpeg") || mime.includes("mp3") || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)) {
    return { audioContent: bytes.toString("base64"), encoding: "mp3", sampleRate, voice, provider: "gemini" };
  }
  if (mime.includes("wav") || bytes.subarray(0, 4).toString("ascii") === "RIFF" || !mime) {
    return { audioContent: bytes.toString("base64"), encoding: "wav", sampleRate, voice, provider: "gemini" };
  }
  return null;
}

/** Generate natural speech with Gemini's current TTS Interactions API. */
export async function synthesizeWithGemini(
  text: string,
  voice?: string,
  dependencies?: TTSDependencies,
  emotion?: string,
): Promise<TTSAudioResult | null> {
  const geminiKeys = getGeminiApiKeys(dependencies);
  if (!geminiKeys.length) return null;
  const request = dependencies?.request || fetch;
  const voiceName = resolveVoice(voice);
  const configuredModel = process.env.GEMINI_TTS_MODEL?.trim();
  const preferredModel = configuredModel && DEFAULT_TTS_MODELS.includes(configuredModel) ? configuredModel : undefined;
  const models = dependencies?.models || (preferredModel
    ? [preferredModel, ...DEFAULT_TTS_MODELS.filter(model => model !== preferredModel)]
    : DEFAULT_TTS_MODELS);
  let geminiRateLimited = false;
  let retryAfterSeconds: number | undefined;

  for (const geminiKey of geminiKeys) {
    for (const model of models) {
      try {
        const response = await request("https://generativelanguage.googleapis.com/v1beta/interactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": geminiKey,
          },
          body: JSON.stringify({
            model,
            input: [{
              type: "user_input",
              content: [{
                type: "text",
                text,
                annotations: [{ type: "speech_metadata", style: resolveSpeechStyle(emotion) }],
              }],
            }],
            response_format: { type: "audio" },
            generation_config: { speech_config: [{ voice: voiceName }] },
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!response.ok) {
          console.warn(`[ai/tts] Gemini model ${model} HTTP ${response.status}`);
          if (response.status === 429) {
            // A model-specific limit may leave the Lite neural model available. Try each configured model once.
            geminiRateLimited = true;
            const header = response.headers.get("retry-after");
            const supplied = header
              ? (/^\d+(?:\.\d+)?$/.test(header) ? Number(header) : (Date.parse(header) - Date.now()) / 1000)
              : Number.NaN;
            if (Number.isFinite(supplied) && supplied > 0) {
              retryAfterSeconds = Math.max(retryAfterSeconds || 0, Math.ceil(supplied));
            }
            continue;
          }
          if ([401, 403].includes(response.status)) break;
          continue;
        }

        const payload = await response.json() as any;
        const audio = extractAudio(payload);
        if (!audio) continue;
        const result = normalizedAudio(audio, voiceName);
        if (result) return result;
      } catch (error) {
        console.warn(`[ai/tts] Gemini model ${model} failed:`, error instanceof Error ? error.name : "request failed");
      }
    }
  }
  if (geminiRateLimited) {
    throw Object.assign(new Error("Gemini neural TTS is temporarily rate limited."), {
      status: 429,
      code: "MEDIA_RATE_LIMIT",
      ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
    });
  }
  return null;
}

export default async function handler(
  req: { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> },
  res: Response,
) {
  try {
    const expressReq = req as Parameters<typeof rejectDisallowedOrigin>[0];
    applyRestrictedCors(expressReq, res);
    if (rejectDisallowedOrigin(expressReq, res)) return;
    if (req.method !== "OPTIONS" && bodyTooLarge(expressReq, 16_000)) {
      return res.status(413).json({ error: "요청이 너무 큽니다.", code: "BODY_TOO_LARGE" });
    }
    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    let body = req.body as any;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    } else if (Buffer.isBuffer(body)) {
      try { body = JSON.parse(body.toString("utf-8")); } catch { body = {}; }
    }
    body = body && typeof body === "object" && !Array.isArray(body) ? body : {};

    const text = String(body.text || "").trim();
    const voice = body.voice ? String(body.voice) : undefined;
    const emotion = body.emotion ? String(body.emotion) : undefined;
    if (!text) return res.status(400).json({ error: "Empty speech text" });

    // Gemini neural speech is primary. The only fallback is server-side Edge Neural TTS;
    // browser speech synthesis and translator voices are never used.
    const geminiResult = await synthesizeWithGemini(text, voice, undefined, emotion);
    if (geminiResult) return res.status(200).json(geminiResult);

    const { handleTTS } = await import("../../server/api-lib/ttsHandler.ts");
    const result = await handleTTS({ text, voice, emotion });
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[ai/tts] Vercel error:", err);
    const failure = err as { status?: number; code?: string; retryAfterSeconds?: number };
    const message = err instanceof Error ? err.message : "TTS generation failed";
    const retryAfter = Number(failure?.retryAfterSeconds);
    const hasRetry = Number.isFinite(retryAfter) && retryAfter > 0;
    if (hasRetry) res.setHeader("Retry-After", String(Math.ceil(retryAfter)));
    return res.status(failure?.status || 500).json({
      error: message,
      ...(failure?.code ? { code: failure.code } : {}),
      ...(hasRetry ? { retryAfterSeconds: Math.ceil(retryAfter) } : {}),
    });
  }
}
