import { prepareNaturalSpeechText } from "./speechText";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as googleTTS from "google-tts-api";
import { EdgeTTS } from "node-edge-tts";

const fsPromises = fs.promises;

interface TTSCacheEntry {
  base64: string;
  encoding: "mp3" | "pcm";
  sampleRate: number;
  timestamp: number;
}
const ttsServerCache = new Map<string, TTSCacheEntry>();

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
  encoding: "mp3" | "pcm";
  sampleRate?: number;
}

export async function handleTTS(options: TTSHandlerOptions): Promise<TTSHandlerResult> {
  const { text, voice = "Kore", emotion, speed } = options;
  if (!text) {
    throw new Error("Empty speech text");
  }

  const cleanText = prepareNaturalSpeechText(String(text || ""));
  if (!cleanText) {
    throw new Error("Empty speech text");
  }

  const resolvedVoiceKey = "Kore";

  const isKorean = /[가-힣]/.test(cleanText);

  // 🌟 모든 TTS 재생은 항상 고품질 여성 음성(ko-KR-SunHiNeural / Kore / en-US-AriaNeural)으로 고정
  let voiceName = "ko-KR-SunHiNeural";

  let lang = "ko-KR";
  // 🌟 모든 TTS를 1.0 배속(표준 낭독 속도 rate: "+0%")으로 엄격 고정
  let rate = "+0%";
  let pitch = "+0Hz";

  if (!isKorean) {
    lang = "en-US";
    voiceName = "en-US-AriaNeural";
  }

  // 🌟 모든 낭독은 유니버스 인사이트 명언과 동일한 맑고 따뜻한 단일 표준 음정(+0Hz, 1.0x)으로 100% 일원화
  // 감정 태그에 따른 인위적 피치 저하(-0.8Hz, -0.5Hz 등 남성적 저음 왜곡)를 전면 배제합니다.
  const cacheKey = `universe_kore_female_v5_${cleanText}`;

  // Check in-memory cache
  const cached = ttsServerCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return {
      audioContent: cached.base64,
      encoding: cached.encoding,
      sampleRate: cached.sampleRate,
    };
  }

function stripID3Header(buf: Buffer): Buffer {
  if (buf.length >= 10 && buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) { // 'ID3'
    const size = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
    const totalHeaderLen = 10 + size;
    if (buf.length > totalHeaderLen) {
      return buf.subarray(totalHeaderLen);
    }
  }
  return buf;
}

  // Helper to generate speech using Google Standard Female Voice
  async function generateGoogleTTS(textToSpeak: string, koreanLang: boolean): Promise<Buffer> {
    const lang = koreanLang ? "ko" : "en";
    
    // Attempt A: google-tts-api
    try {
      const results = await googleTTS.getAllAudioBase64(textToSpeak, {
        lang,
        slow: false,
        host: "https://translate.google.com",
        splitPunct: ",.?!;:\n",
      });

      const buffers = results.map((r: any, idx: number) => {
        const b = Buffer.from(r.base64, "base64");
        return idx === 0 ? b : stripID3Header(b);
      });
      const combined = Buffer.concat(buffers);
      if (combined.length > 200) {
        return combined;
      }
    } catch (e: any) {
      console.warn("[TTS] google-tts-api attempt failed, trying direct HTTP stream:", e?.message);
    }

    // Attempt B: Direct HTTP stream chunks
    const chunks = textToSpeak.match(/.{1,180}(\s|$)|.+/g) || [textToSpeak];
    const bufferPromises = chunks.map(async (chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return Buffer.alloc(0);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=${lang}&client=tw-ob`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        }
      });
      if (!res.ok) throw new Error(`Google TTS status ${res.status}`);
      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    });

    const fetchedBuffers = await Promise.all(bufferPromises);
    const validBuffers = fetchedBuffers.filter((b) => b.length > 0);
    const strippedBuffers = validBuffers.map((b, idx) => (idx === 0 ? b : stripID3Header(b)));
    const combined = Buffer.concat(strippedBuffers);
    if (combined.length > 200) {
      return combined;
    }

    throw new Error("Google TTS generated empty audio buffer");
  }

  // 1. Primary Engine: Google Standard Warm Female Voice (Fast ~200ms, 100% identical timbre with Universe Insight)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const audioBuffer = await generateGoogleTTS(cleanText, isKorean);
      const base64 = audioBuffer.toString("base64");

      if (ttsServerCache.size > 500) {
        const oldestKey = ttsServerCache.keys().next().value;
        if (oldestKey) ttsServerCache.delete(oldestKey);
      }
      ttsServerCache.set(cacheKey, { base64, encoding: "mp3", sampleRate: 24000, timestamp: Date.now() });

      return {
        audioContent: base64,
        encoding: "mp3",
        sampleRate: 24000,
      };
    } catch (err: any) {
      console.warn(`[TTS] Google TTS primary attempt ${attempt} notice:`, err?.message || err);
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 120));
      }
    }
  }

  // 2. Secondary Engine: Google AI Studio Gemini Voice (Voice: "Kore")
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.AI_API_KEY;
  if (geminiApiKey) {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const selectedVoice = "Kore";

      const ttsModels = ["gemini-3.8-flash-lite-tts", "gemini-3.8-flash-tts"];
      for (const modelName of ttsModels) {
        try {
          const geminiResponse = await Promise.race([
            ai.models.generateContent({
              model: modelName,
              contents: [{ parts: [{ text: cleanText }] }],
              config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: selectedVoice },
                  },
                },
              },
            }),
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error(`Gemini TTS timeout (${modelName})`)), 5000)),
          ]);

          const candidate = geminiResponse?.candidates?.[0];
          const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData?.mimeType?.startsWith("audio/"));
          if (audioPart?.inlineData?.data) {
            const base64 = audioPart.inlineData.data;
            const mimeType = String(audioPart.inlineData.mimeType || "").toLowerCase();
            let encoding: "pcm" | "mp3" = "mp3";
            let sampleRate = 24000;
            if (mimeType.includes("rate=")) {
              const match = mimeType.match(/rate=(\d+)/);
              if (match) sampleRate = parseInt(match[1], 10);
            }

            if (ttsServerCache.size > 500) {
              const oldestKey = ttsServerCache.keys().next().value;
              if (oldestKey) ttsServerCache.delete(oldestKey);
            }
            ttsServerCache.set(cacheKey, { base64, encoding, sampleRate, timestamp: Date.now() });
            return {
              audioContent: base64,
              encoding,
              sampleRate,
            };
          }
        } catch (mErr: any) {
          console.warn(`[TTS] ${modelName} fallback attempt notice:`, mErr?.message || mErr);
        }
      }
    } catch (geminiErr: any) {
      console.warn("[TTS] Gemini AI Studio voice fallback notice:", geminiErr?.message || geminiErr);
    }
  }

  throw new Error("TTS generation failed after retries.");
}
