import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import { getGeminiApiKey } from "../server";

export const calmRouter = express.Router();

const calmDataDir = path.join(process.cwd(), "server", "calm", "data");
const bookKnowledgePath = path.join(calmDataDir, "book_knowledge.json");
const bookFullPath = path.join(calmDataDir, "book_full.md");

let bookKnowledge: any = { title: "왜 나는 불안할까", author: "제이미 저커먼", exercises: [] };
let bookFullText = "";

try {
  if (fs.existsSync(bookKnowledgePath)) {
    bookKnowledge = JSON.parse(fs.readFileSync(bookKnowledgePath, "utf8"));
  }
  if (fs.existsSync(bookFullPath)) {
    bookFullText = fs.readFileSync(bookFullPath, "utf8");
  }
} catch (e) {
  console.warn("[calmRouter] Warning reading book files:", e);
}

// 16-bit PCM to WAV helper
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitDepth = 16) {
  const byteRate = sampleRate * numChannels * (bitDepth / 8);
  const blockAlign = numChannels * (bitDepth / 8);
  const dataSize = pcmBuffer.length;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitDepth, 34);

  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  pcmBuffer.copy(buffer, 44);
  return buffer;
}

// In-memory TTS Cache
const ttsCache = new Map<string, string>();

const KEYWORD_MAP: Record<string, number[]> = {
  "숨": [13, 14, 15, 20],
  "호흡": [13, 14, 15, 20],
  "심장": [13, 16, 21],
  "두근": [13, 16, 21],
  "어깨": [15, 20, 21],
  "긴장": [13, 15, 20, 21],
  "몸": [13, 14, 15, 17, 18, 20, 21],
  "공황": [13, 14, 16],
  "발": [18],
  "샤워": [17], "요리": [17],
  "생각": [1, 2, 3, 4, 5, 6, 8, 10],
  "머리": [1, 3, 6, 12],
  "걱정": [1, 3, 4, 11, 12],
  "반추": [5, 10],
  "잡생각": [3, 4, 5, 6, 10],
  "비난": [9],
  "자책": [9],
  "피자": [12],
  "회피": [23, 24, 27, 28, 30, 31, 37],
  "미루": [27, 30, 37],
  "일": [22, 27, 29, 37],
  "발표": [16, 36, 37],
  "사람": [25, 26, 35],
  "시선": [25],
  "화": [33, 35],
  "분노": [33, 35],
  "두려움": [16, 23, 24, 36],
  "가면": [32],
  "완벽": [27, 37, 40]
};

function searchRelevantContext(query: string) {
  const normalizedQuery = (query || "").toLowerCase();
  const matchedExerciseIndices = new Set<number>();

  for (const [kw, indices] of Object.entries(KEYWORD_MAP)) {
    if (normalizedQuery.includes(kw.toLowerCase())) {
      indices.forEach(idx => matchedExerciseIndices.add(idx));
    }
  }

  if (matchedExerciseIndices.size === 0) {
    [13, 6, 14, 2].forEach(i => matchedExerciseIndices.add(i));
  }

  const recommendedExercises = Array.from(matchedExerciseIndices)
    .slice(0, 1)
    .map(idx => bookKnowledge.exercises[idx - 1])
    .filter(Boolean);

  return {
    bookInfo: {
      title: bookKnowledge.title,
      author: bookKnowledge.author,
      translator: bookKnowledge.translator
    },
    recommendedExercises,
    summaryContext: `도서 《${bookKnowledge.title}》(제이미 저커먼 지음)는 수용전념치료(ACT)와 인지행동치료(CBT), 마음챙김에 기반하여 불안을 억누르지 않고 건강하게 분리하고 마주하는 40가지 구체적 연습을 제공합니다.`
  };
}

const SYSTEM_PROMPT = `
# Role & Persona: Somatic-ACIM-ACT Inner Peace Guide (신체 접지형 기적수업 & 도서 연동 내면 치유 안내자)

당신은 초기불교의 정밀한 신체 감각 자각(Grounding), 기적수업(ACIM)의 따뜻한 투사 회수와 용서(Healing), 수용전념치료(ACT)의 인지적 탈융합, 영지주의의 본래적 온전함(Liberation)을 하나로 통합한 '신체 접지형 기적수업 내면 코치'이자 제이미 저커먼 박사의 도서 《FIND YOUR 왜 나는 불안할까》 지식 안내자입니다.

모든 종교적·현학적 어휘를 배제하고, 일상적이고 다정한 언어로 사용자가 마음의 평화를 되찾도록 돕습니다.

---

## 응답 JSON 규격 (반드시 유효한 JSON 형식으로만 응답):
{
  "grounding": "초기불교 레이어 (가중치 15%): 내담자의 감정을 온전히 인정하고 수용한 뒤, 1~2문장으로 지금 몸의 긴장(가슴, 어깨, 호흡 등)을 느끼고 깊고 부드러운 숨을 고르도록 안내합니다.",
  "healing": "기적수업 & ACT 수용치료 레이어 (가중치 75%): 고통의 근원이 '내 마음의 두려운 해석(투사)'임을 따뜻하게 밝히고, 그 생각을 나와 분리하여 내려놓는 관점의 전환과 용서를 안내합니다. 책 속의 수용전념치료 원리와 현실적 경계선 설정을 포함합니다.",
  "liberation": "영지주의 & 심층 평화 레이어 (가중치 10%): 세상의 어떤 일시적인 불안이나 외적 조건도 결코 훼손할 수 없는 내면 본래의 신성하고 평화로운 온전함을 상기시키는 1문장의 확신 어린 선언입니다."
}

## 핵심 규칙
1. 기본 어조: 다정하고 차분한 '따뜻한 내면 동반자' 톤 (~해요, ~해보세요 체).
2. 금지 어휘: 데미우르고스, 아르콘, 성령, 속죄, 오온, 아라한, 카르마, "세상은 가짜다/감옥이다" 등 일체 금지.
3. 권장 어휘: '몸의 긴장', '숨의 흐름', '마음의 렌즈', '해석 내려놓기', '본래의 온전함', '파도처럼 지나가게 두기'.
4. 위기 상황: 자살/자해/학대 감지 시 "즉각적인 전문 상담(109, 1577-0199)이 필요합니다"를 최우선으로 출력할 것.
`;

// 1. GET /api/exercises
calmRouter.get("/api/exercises", (_req: Request, res: Response) => {
  res.json({
    title: bookKnowledge.title,
    author: bookKnowledge.author,
    exercises: bookKnowledge.exercises || []
  });
});

// 2. GET /api/book-info
calmRouter.get("/api/book-info", (_req: Request, res: Response) => {
  res.json({
    title: bookKnowledge.title,
    author: bookKnowledge.author,
    translator: bookKnowledge.translator,
    publisher: bookKnowledge.publisher,
    coreThemes: bookKnowledge.coreThemes,
    totalExercises: bookKnowledge.exercises ? bookKnowledge.exercises.length : 0
  });
});

// 3. POST /api/chat
calmRouter.post("/api/chat", async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "메시지를 입력해 주세요." });
  }

  const ragResult = searchRelevantContext(message);
  const recommendedExercises = (ragResult.recommendedExercises || []).slice(0, 1);

  const exercisesContext = recommendedExercises.map((ex: any) => 
    `- [${ex.chapter}장 연습 ${ex.index}] ${ex.title}: ${ex.subtitle} (${ex.page}쪽) - ${ex.description}`
  ).join("\n");

  const userPromptWithContext = `
[참고할 도서 《왜 나는 불안할까》 추천 실천 연습]:
${exercisesContext}

[내담자의 고민]:
"${message}"

위 고민에 대해 신체 접지(grounding), 기적수업 용서(healing), 온전함 선언(liberation)의 3단계 JSON 형식으로 응답해 주세요.`;

  const geminiKey = getGeminiApiKey();

  // Try Gemini
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const candidateModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

      for (const mName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: mName,
            contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPromptWithContext}` }] }],
            config: { responseMimeType: "application/json" }
          });

          const text = response.text ? response.text.trim() : "";
          const parsed = JSON.parse(text);

          if (parsed.grounding && parsed.healing && parsed.liberation) {
            return res.json({
              grounding: parsed.grounding,
              healing: parsed.healing,
              liberation: parsed.liberation,
              recommendedExercises,
              source: `gemini-${mName}`
            });
          }
        } catch (mErr) {
          console.warn(`[calmRouter] Gemini ${mName} attempt failed:`, mErr);
        }
      }
    } catch (err: any) {
      console.warn("[calmRouter] Gemini generate error:", err?.message || err);
    }
  }

  // Fallback OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPromptWithContext }
        ],
        temperature: 0.7
      });

      const text = completion.choices[0]?.message?.content?.trim() || "";
      const parsed = JSON.parse(text);

      return res.json({
        grounding: parsed.grounding,
        healing: parsed.healing,
        liberation: parsed.liberation,
        recommendedExercises,
        source: "openai-gpt-4o-mini"
      });
    } catch (openAiErr: any) {
      console.warn("[calmRouter] OpenAI fallback failed:", openAiErr?.message || openAiErr);
    }
  }

  // Pure Deterministic Fallback if offline
  return res.json({
    grounding: "지금 이 순간, 어깨의 긴장을 풀고 가슴으로 천천히 숨을 들이마시고 길게 내쉬어 보세요. 현재 느끼는 불안은 당신을 해치지 못합니다.",
    healing: "이 불안은 과거의 상처나 미래에 대한 두려운 해석일 뿐, 당신 자신의 본모습이 아닙니다. 생각을 가만히 바라보고 부드럽게 흘려보내세요.",
    liberation: "그 어떤 일시적인 감정이나 상황도 내면 깊은 곳의 온전한 평화를 결코 훼손할 수 없습니다. 당신은 이미 안전합니다.",
    recommendedExercises,
    source: "calm-local-heuristic"
  });
});

// 4. POST /api/tts
calmRouter.post("/api/tts", async (req: Request, res: Response) => {
  const { text, voice = "ko-KR-SunHiNeural" } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "음성으로 변환할 텍스트를 입력해주세요." });
  }

  const cleanText = text.trim();
  const cacheKey = `${voice}:${cleanText}`;

  if (ttsCache.has(cacheKey)) {
    return res.json({ audio: ttsCache.get(cacheKey), cached: true });
  }

  // 1. First attempt: Use high-fidelity handleTTS (EdgeTTS / GoogleTTS / Gemini)
  try {
    const { handleTTS } = await import("./api-lib/ttsHandler");
    const result = await handleTTS({ text: cleanText, voice });
    if (result && result.audioContent) {
      const mimeType = result.encoding === "pcm" ? "audio/wav" : "audio/mp3";
      const audioDataUrl = `data:${mimeType};base64,${result.audioContent}`;
      if (ttsCache.size > 100) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) ttsCache.delete(firstKey);
      }
      ttsCache.set(cacheKey, audioDataUrl);
      return res.json({ audio: audioDataUrl, cached: false });
    }
  } catch (err: any) {
    console.warn("[calmRouter /api/tts] handleTTS attempt error:", err?.message || err);
  }

  // 2. Second attempt: Gemini Audio direct fallback
  const geminiKey = getGeminiApiKey();
  if (!geminiKey) {
    return res.json({ fallback: true, message: "API 키 부재로 브라우저 Web Speech로 대체합니다." });
  }

  try {
    const geminiVoice = (voice === "ko-KR-InJoonNeural" || voice === "InJoon") ? "Fenrir" : "Kore";
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: cleanText }] }],
      config: {
        responseModalities: ["AUDIO" as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: geminiVoice }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("TTS 오디오 데이터가 생성되지 않았습니다.");
    }

    const pcmBuf = Buffer.from(base64Audio, "base64");
    const wavBuf = pcmToWav(pcmBuf, 24000, 1, 16);
    const audioDataUrl = `data:audio/wav;base64,${wavBuf.toString("base64")}`;

    if (ttsCache.size > 100) {
      const firstKey = ttsCache.keys().next().value;
      if (firstKey) ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, audioDataUrl);

    return res.json({ audio: audioDataUrl, cached: false });
  } catch (err: any) {
    return res.json({ fallback: true, error: err?.message || "TTS error" });
  }
});
