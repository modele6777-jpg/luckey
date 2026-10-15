import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import {
  buildVerifiedArtRecommendation,
  type ArtRecommendationPayload,
} from "./museArtCatalog";

export interface RecommendArtRequest {
  userContext?: string;
  userConcern?: string;
  currentMood?: string;
  moodId?: string;
  energyFrequency?: string;
  dateKey?: string;
  randomOffset?: number;
  excludeCatalogIds?: string[];
  excludePoemTitles?: string[];
  excludeSongTitles?: string[];
}

function getGeminiApiKey(): string {
  const key = (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    ""
  ).trim();
  return key.includes("AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A") ? "" : key;
}

async function personalizeWithGemini(
  base: ArtRecommendationPayload,
  currentMood: string,
  userContext: string,
  energyFrequency: string,
  userConcern?: string,
): Promise<Pick<ArtRecommendationPayload, "whyRecommended" | "challenges"> | null> {
  const geminiKey = getGeminiApiKey();
  if (!geminiKey) return null;

  const facts = {
    title: base.title,
    titleOriginal: base.titleOriginal,
    creator: base.creator,
    creatorOriginal: base.creatorOriginal,
    artworkType: base.artworkType,
    era: base.era,
    description: base.description,
    quote: base.quote,
    aestheticTone: base.aestheticTone,
    famousPoem: base.famousPoem,
    famousSong: base.famousSong,
  };

  const concernPrompt = userConcern?.trim()
    ? `\n[사용자가 직접 들려준 현재 고민/상황]: "${userConcern.trim()}" - 이 고민과 마음의 무게를 깊이 공감하고 위로하며, 이 작품과 시·음악이 왜 지금 이 사용자에게 가장 완벽한 치유와 영감의 돌파구가 되는지 whyRecommended에 구체적이고 따뜻하게 작성하세요.`
    : '';

  const prompt = `당신은 MUSE 예술 큐레이터입니다.

아래 [검증된 사실]의 작품명·작가·시·곡·인용문·설명은 이미 검증되었습니다.
절대 수정·추가·생략·대체하지 마세요. 새로운 작품이나 인물을 만들지 마세요.

[검증된 사실]
${JSON.stringify(facts, null, 2)}

[사용자 상태]
- 무드: ${currentMood}
- 에너지: ${energyFrequency}
- 최근 맥락: ${userContext || "없음"}${concernPrompt}

오직 다음 JSON만 반환하세요:
{
  "whyRecommended": "2~3문장. ${userConcern?.trim() ? '사용자의 고민을 공감하며 ' : ''}위 작품이 오늘의 무드/고민과 왜 맞는지. 작품명·작가·시·곡 이름은 위 사실과 동일하게 유지.",
  "challenges": ["구체적 행동 미션 1", "구체적 행동 미션 2"]
}`;

  try {
    const ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
    const { Type } = await import("@google/genai");

    const modelsToTry = [
      "gemini-3.7-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash",
      "gemini-3.6-flash",
      "gemini-flash-latest",
    ];

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                whyRecommended: { type: Type.STRING },
                challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["whyRecommended", "challenges"],
            },
            temperature: 0.35,
          },
        });

        if (!response.text) continue;
        const parsed = JSON.parse(response.text.trim()) as {
          whyRecommended?: string;
          challenges?: string[];
        };
        if (!parsed.whyRecommended || !Array.isArray(parsed.challenges) || parsed.challenges.length < 2) {
          continue;
        }
        return {
          whyRecommended: parsed.whyRecommended,
          challenges: parsed.challenges.slice(0, 2),
        };
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        console.warn(`[Recommend Art] Gemini model ${model} attempt note: ${errMsg.slice(0, 120)}`);
      }
    }
    return null;
  } catch (err) {
    console.warn("[Recommend Art] Gemini personalization fallback engaged:", err);
    return null;
  }
}

async function personalizeWithOpenAI(
  base: ArtRecommendationPayload,
  currentMood: string,
  userContext: string,
  energyFrequency: string,
): Promise<Pick<ArtRecommendationPayload, "whyRecommended" | "challenges"> | null> {
  const openAIKey = (process.env.OPENAI_API_KEY || process.env.AI_API_KEY || "").trim();
  if (!openAIKey) return null;

  const facts = {
    title: base.title,
    creator: base.creator,
    famousPoem: base.famousPoem.title,
    famousSong: base.famousSong.title,
  };

  try {
    const openai = new OpenAI({ apiKey: openAIKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Return JSON with whyRecommended and challenges only. Never change artwork, artist, poem, or song names from the provided facts.",
        },
        {
          role: "user",
          content: `Facts: ${JSON.stringify(facts)}\nMood: ${currentMood}\nEnergy: ${energyFrequency}\nContext: ${userContext || "none"}`,
        },
      ],
    });
    const rawText = response.choices[0]?.message?.content;
    if (!rawText) return null;
    const parsed = JSON.parse(rawText) as {
      whyRecommended?: string;
      challenges?: string[];
    };
    if (!parsed.whyRecommended || !Array.isArray(parsed.challenges) || parsed.challenges.length < 2) {
      return null;
    }
    return {
      whyRecommended: parsed.whyRecommended,
      challenges: parsed.challenges.slice(0, 2),
    };
  } catch (err) {
    console.warn("[Recommend Art] OpenAI personalization failed:", err);
    return null;
  }
}

export async function buildDailyArtRecommendation(
  req: RecommendArtRequest,
): Promise<ArtRecommendationPayload> {
  const curationDate = String(req.dateKey || new Date().toLocaleDateString("sv")).trim();
  const currentMood = String(req.currentMood || "").trim();
  const userContext = String(req.userContext || "").trim().slice(0, 1000);
  const energyFrequency = String(req.energyFrequency || "528Hz").trim();

  const base = buildVerifiedArtRecommendation(
    curationDate,
    currentMood,
    req.moodId,
    req.randomOffset,
    req.excludeCatalogIds,
    req.excludePoemTitles,
    req.excludeSongTitles,
  );

  const userConcern = String(req.userConcern || "").trim();

  const personalized =
    (await personalizeWithGemini(base, currentMood, userContext, energyFrequency, userConcern)) ||
    (await personalizeWithOpenAI(base, currentMood, userContext, energyFrequency));

  if (!personalized) return base;

  return {
    ...base,
    whyRecommended: personalized.whyRecommended,
    challenges: personalized.challenges,
  };
}