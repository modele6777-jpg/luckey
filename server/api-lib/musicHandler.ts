import { GoogleGenAI } from "@google/genai";

export interface GenerateMusicParams {
  prompt: string;
  modelType?: 'clip' | 'pro';
}

export interface GenerateMusicResult {
  audioContent: string;
  mimeType: string;
  lyrics?: string;
  modelUsed: string;
  title: string;
}

/**
 * Lyria AI Music Generator
 * Uses lyria-3-clip-preview for 30s clips or lyria-3-pro-preview for full-length tracks.
 */
export async function handleGenerateMusic(params: GenerateMusicParams): Promise<GenerateMusicResult> {
  const { prompt, modelType = 'clip' } = params;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error("음악 생성 프롬프트(prompt)를 입력해 주세요.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되어 있지 않습니다.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = modelType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

  console.log(`[MusicGen] Starting Lyria music generation with model: ${model}, prompt: "${prompt.slice(0, 50)}..."`);

  const response = await ai.models.generateContentStream({
    model,
    contents: prompt.trim(),
  });

  let audioBase64 = "";
  let lyrics = "";
  let mimeType = "audio/wav";

  for await (const chunk of response) {
    const parts = chunk.candidates?.[0]?.content?.parts;
    if (!parts) continue;

    for (const part of parts) {
      if (part.inlineData?.data) {
        if (!audioBase64 && part.inlineData.mimeType) {
          mimeType = part.inlineData.mimeType;
        }
        audioBase64 += part.inlineData.data;
      }
      if (part.text && !lyrics) {
        lyrics = part.text;
      }
    }
  }

  if (!audioBase64) {
    throw new Error("Lyria 모델로부터 오디오 데이터가 반환되지 않았습니다.");
  }

  console.log(`[MusicGen] Successfully generated music audio (${Math.round(audioBase64.length / 1024)} KB)`);

  return {
    audioContent: audioBase64,
    mimeType,
    lyrics: lyrics || undefined,
    modelUsed: model,
    title: prompt.trim().slice(0, 40),
  };
}
