import { handleSitesApi } from "../sites-api.ts";

export interface TTSHandlerOptions {
  text: string;
  voice?: string;
  emotion?: string;
  rate?: string;
  pitch?: string;
  speed?: number;
  language?: string;
}
export interface TTSHandlerResult {
  audioContent: string;
  encoding: "mp3" | "pcm" | "wav";
  sampleRate?: number;
}

/** All runtimes use the same generative speech policy. Never substitute browser,
 * translation or standard synthetic speech when AI generation is unavailable. */
export async function handleTTS(options: TTSHandlerOptions): Promise<TTSHandlerResult> {
  const request = new Request("https://luckey.internal/api/ai/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...options, voice: options.voice === "Charon" || /InJoon|GuyNeural/.test(options.voice || "") ? "Charon" : "Aoede" }),
  });
  const response = await handleSitesApi(request, { ...process.env, GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.AI_API_KEY });
  if (!response) throw new Error("AI 음성 요청을 처리하지 못했습니다.");
  const data = await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error || "AI 자연 음성을 생성하지 못했습니다."), {
    status: response.status, code: data.code, retryAfterSeconds: data.retryAfterSeconds,
  });
  return data as TTSHandlerResult;
}
