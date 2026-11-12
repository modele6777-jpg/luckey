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
  "휴식": [38, 41, 53, 58, 59],
  "에너지": [41, 52, 58, 61, 67],
  "피로": [41, 52, 67, 71],
  "일기": [42, 50, 88],
  "기록": [42, 50, 51, 88],
  "도구": [43],
  "스트레스": [12, 15, 34, 43, 52, 72],
  "오감": [14, 16, 17, 18, 19, 43],
  "예민": [44, 48, 62, 81, 86, 90],
  "기질": [44, 48, 62, 81, 82, 90],
  "감정": [24, 28, 45, 61, 85],
  "분노": [35, 45],
  "자책": [9, 46, 85],
  "비판": [9, 46, 70],
  "불안": [1, 2, 3, 4, 7, 8, 10, 11, 23, 31, 36, 39, 47],
  "우울": [47],
  "호흡": [13, 14, 15, 41, 47],
  "속도": [37, 48, 53, 59, 74],
  "결정": [49, 84, 87],
  "생각": [3, 4, 5, 6, 7, 8, 10, 11, 12, 50],
  "루틴": [51, 56, 79],
  "집": [54, 55],
  "수면": [50, 55, 88],
  "잠": [50, 55, 88],
  "아침": [51, 56, 80],
  "커피": [57], "카페인": [57], "술": [57],
  "공감": [61, 63, 67, 90],
  "관계": [25, 26, 61, 62, 63, 64, 65, 67, 68],
  "거절": [64, 66, 75],
  "친구": [62, 63, 66],
  "직장": [71, 72, 73, 74, 75, 76, 77, 78],
  "일": [22, 29, 71, 72, 75, 76, 77, 78],
  "완벽": [77],
  "월요": [80],
  "나다움": [26, 81, 82, 86, 90],
  "직감": [84, 87],
  "꿈": [88],
  "영감": [89],
  "강점": [90]
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
    [1, 13, 41, 43].forEach(i => matchedExerciseIndices.add(i));
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
    summaryContext: `도서 《왜 나는 불안할까 & 왜 나는 예민할까》(Key 마음약방)는 40가지 개운 리추얼과 50가지 민감성 케어 연습을 아우르는 총 90가지 구체적 실천을 제공합니다.`
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
    const result = await handleTTS({ text: cleanText, voice, requestId: req.get("x-vercel-id") || undefined });
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
    const retryAfter = Number(err?.retryAfterSeconds);
    if (Number.isFinite(retryAfter) && retryAfter > 0) res.setHeader("Retry-After", String(Math.ceil(retryAfter)));
    if (err?.diagnosticId) res.setHeader("X-TTS-Diagnostic-ID", err.diagnosticId);
    return res.status(err?.status || 502).json({
      error: err?.message || "AI 자연 음성을 생성하지 못했습니다.",
      ...(err?.code ? { code: err.code } : {}),
      ...(Number.isFinite(retryAfter) && retryAfter > 0 ? { retryAfterSeconds: Math.ceil(retryAfter) } : {}),
      ...(err?.diagnosticId ? { diagnosticId: err.diagnosticId } : {}),
    });
  }
  return res.status(502).json({ error: "AI 자연 음성을 생성하지 못했습니다." });
});
