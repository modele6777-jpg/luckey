import { GoogleGenAI } from "@google/genai";

function getGeminiClient(): GoogleGenAI {
  const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.AI_API_KEY || "";
  const apiKey = envKey.includes("AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A") ? "" : envKey;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured or is invalid. Please set GEMINI_API_KEY in AI Studio Settings.");
  }
  return new GoogleGenAI({ apiKey });
}

function parseImageDataUrl(url: string): { mimeType: string; data: string } | null {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  if (match) {
    return { mimeType: match[1], data: match[2].replace(/\s+/g, "") };
  }
  if (url.length > 50 && !url.startsWith("http") && !url.includes(" ")) {
    return { mimeType: "image/jpeg", data: url.replace(/\s+/g, "") };
  }
  return null;
}

export interface Message {
  role: "system" | "user" | "assistant" | "model";
  content: string | any[];
}

export interface InvokeLLMParams {
  messages: Message[];
  response_format?: { type: "json_object" | "text" };
}

export async function invokeLLM(params: InvokeLLMParams) {
  const ai = getGeminiClient();
  const rawModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const modelName = (rawModel.startsWith("gemini-3") || rawModel.includes("gemini-3")) ? "gemini-2.0-flash" : rawModel;

  const systemMessage = params.messages.find(m => m.role === "system");
  const nonSystem = params.messages.filter(m => m.role !== "system");

  const contents: any[] = [];
  for (const m of nonSystem) {
    if (!m) continue;
    const role = (m.role === "assistant" || m.role === "model") ? ("model" as const) : ("user" as const);
    const parts: any[] = [];
    if (typeof m.content === "string") {
      const trimmed = m.content.trim();
      if (trimmed) parts.push({ text: trimmed });
    } else if (Array.isArray(m.content)) {
      for (const p of m.content) {
        if (!p) continue;
        if (typeof p === "string" && p.trim()) {
          parts.push({ text: p.trim() });
        } else if (p.type === "text" && typeof p.text === "string" && p.text.trim()) {
          parts.push({ text: p.text.trim() });
        } else if (p.type === "image_url" || p.image_url) {
          const url = p.image_url?.url || p.url || "";
          const img = parseImageDataUrl(url);
          if (img) parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
        }
      }
    }
    if (parts.length === 0) continue;
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts.push(...parts);
    } else {
      contents.push({ role, parts });
    }
  }

  while (contents.length > 0 && contents[0].role === "model") {
    contents.shift();
  }

  if (contents.length === 0) {
    contents.push({ role: "user" as const, parts: [{ text: "계속 진행해줘" }] });
  }

  const candidateModels = [
    modelName,
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash-lite",
  ].filter((m, i, arr) => Boolean(m) && arr.indexOf(m) === i);

  let response;
  let lastError: any = null;

  for (const currentModel of candidateModels) {
    let retries = 2;
    let delay = 800;

    while (retries >= 0) {
      try {
        response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config: {
            systemInstruction: systemMessage?.content as string,
            responseMimeType: params.response_format?.type === "json_object" ? "application/json" : "text/plain",
          }
        });
        break;
      } catch (e: any) {
        lastError = e;
        const errStr = String(e) + (e?.message || "") + JSON.stringify(e);
        const isTemporary = 
          e?.status === 429 || 
          e?.status === 503 ||
          e?.error?.code === 429 ||
          e?.error?.code === 503 ||
          errStr.includes('429') || 
          errStr.includes('503') ||
          errStr.includes('UNAVAILABLE') ||
          errStr.includes('high demand') ||
          errStr.includes('RESOURCE_EXHAUSTED') ||
          errStr.includes('quota');
          
        if (retries === 0 || !isTemporary) {
          console.warn(`[server/invokeLLM] Model ${currentModel} error, trying next candidate model...`);
          break;
        }

        console.warn(`[server/invokeLLM] Model ${currentModel} temporary pressure. Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
        retries--;
      }
    }

    if (response?.text) {
      break;
    }
  }

  if (!response?.text && lastError) {
    throw lastError;
  }

  const text = response?.text || "";

  return {
    choices: [
      {
        message: {
          content: text,
        },
      },
    ],
  };
}

export async function generateImage({ prompt }: { prompt: string }) {
  // Placeholder or real implementation if available
  // In our environment, we might use a dedicated tool or just a placeholder for now
  console.log("Generating image with prompt:", prompt);
  return { url: "https://picsum.photos/1024/768" }; 
}
