import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import { getGeminiApiKey } from "./geminiKey.ts";

export const calmRouter = express.Router();

const calmDataDir = path.join(process.cwd(), "server", "calm", "data");
const bookKnowledgePath = path.join(calmDataDir, "book_knowledge.json");
const bookFullPath = path.join(calmDataDir, "book_full.md");

let bookKnowledge: any = { title: "왜 나는 예민할까", author: "에이프릴 스노우", exercises: [] };
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

// In-memory TTS Cache
const ttsCache = new Map<string, string>();

const KEYWORD_MAP: Record<string, number[]> = {
  "휴식": [1, 13, 18, 19, 29],
  "에너지": [1, 12, 18, 21, 27],
  "피로": [1, 12, 18, 27, 31],
  "일기": [2, 10, 41, 48],
  "기록": [2, 10, 11, 48],
  "도구": [3, 14, 18],
  "스트레스": [3, 12, 13, 17, 32],
  "오감": [2, 3, 7, 14, 15],
  "예민": [4, 8, 22, 41, 46, 50],
  "기질": [4, 8, 22, 41, 42, 50],
  "감정": [2, 5, 6, 21, 45],
  "분노": [5, 6, 21, 30],
  "자책": [6, 43, 45],
  "비판": [6, 30],
  "불안": [7, 10, 16, 17, 44],
  "우울": [7, 45],
  "호흡": [1, 5, 7, 47],
  "속도": [8, 13, 19, 34],
  "결정": [9, 44, 47],
  "생각": [6, 10, 13, 34],
  "루틴": [11, 16, 39],
  "집": [14, 15, 36],
  "수면": [10, 15, 48],
  "잠": [10, 15, 48],
  "아침": [11, 16, 40],
  "커피": [17], "카페인": [17], "술": [17],
  "공감": [21, 23, 27, 50],
  "관계": [21, 22, 23, 24, 25, 27, 28],
  "거절": [18, 24, 26, 35],
  "친구": [22, 23, 26],
  "직장": [31, 32, 33, 34, 35, 36, 37, 38],
  "일": [31, 32, 35, 36, 37, 38],
  "완벽": [37],
  "월요": [40],
  "나다움": [41, 42, 46, 50],
  "직감": [44, 47],
  "꿈": [48],
  "영감": [49],
  "강점": [50]
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
    [1, 3, 7, 21].forEach(i => matchedExerciseIndices.add(i));
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
    summaryContext: `도서 《${bookKnowledge.title}》(에이프릴 스노우 지음)는 민감한 사람(HSP)이 섬세한 감각을 나만의 무기로 바꾸는 50가지 구체적 연습을 제공합니다.`
  };
}

const SYSTEM_PROMPT = `
# Role & Persona: Somatic-ACIM-ACT Inner Peace Guide (신체 접지형 기적수업 & 도서 연동 내면 치유 안내자)

당신은 초기불교의 정밀한 신체 감각 자각(Grounding), 기적수업(ACIM)의 따뜻한 투사 회수와 용서(Healing), 수용전념치료(ACT)의 인지적 탈융합, 영지주의의 본래적 온전함(Liberation)을 하나로 통합한 '신체 접지형 기적수업 내면 코치'이자 심리치료사 에이프릴 스노우의 도서 《FIND YOUR 왜 나는 예민할까》 지식 안내자입니다.

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
[참고할 도서 《왜 나는 예민할까》 추천 실천 연습]:
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
  const { text, voice = "Aoede" } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "음성으로 변환할 텍스트를 입력해주세요." });
  }

  const cleanText = text.trim();
  const cacheKey = `natural_ai_v1:${voice}:${cleanText}`;

  if (ttsCache.has(cacheKey)) {
    return res.json({ audio: ttsCache.get(cacheKey), cached: true });
  }

  // Generative AI speech only. Failure never enables a device/standard voice.
  try {
    const { handleTTS } = await import("./api-lib/ttsHandler.ts");
    const result = await handleTTS({ text: cleanText, voice });
    if (result && result.audioContent) {
      const mimeType = result.encoding === "mp3" ? "audio/mpeg" : "audio/wav";
      const audioDataUrl = `data:${mimeType};base64,${result.audioContent}`;
      if (ttsCache.size > 100) {
        const firstKey = ttsCache.keys().next().value;
        if (firstKey) ttsCache.delete(firstKey);
      }
      ttsCache.set(cacheKey, audioDataUrl);
      return res.json({ audio: audioDataUrl, cached: false });
    }
  } catch (err: any) {
    return res.status(err?.status || 502).json({
      error: err?.message || "AI 자연 음성을 생성하지 못했습니다.",
      ...(err?.code ? { code: err.code } : {}),
    });
  }
  return res.status(502).json({ error: "AI 자연 음성을 생성하지 못했습니다." });
});
