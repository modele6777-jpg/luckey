import type { Response } from "express";
import { GoogleGenAI } from "@google/genai";

export interface DocentMessage {
  role: "user" | "assistant";
  content: string;
}

export interface MuseDocentPoem {
  title: string;
  titleOriginal?: string;
  poet: string;
  poetOriginal?: string;
  excerpt?: string;
  whyRecommended?: string;
}

export interface MuseDocentSong {
  title: string;
  titleOriginal?: string;
  artist: string;
  artistOriginal?: string;
  listeningGuide?: string;
}

export interface MuseDocentRequest {
  imageUrl?: string;
  title: string;
  creator: string;
  artworkType?: string;
  era?: string;
  description?: string;
  whyRecommended?: string;
  aestheticTone?: string;
  quote?: string;
  famousPoem?: MuseDocentPoem;
  famousSong?: MuseDocentSong;
  messages?: DocentMessage[];
  isFirstMessage?: boolean;
  mode?: "audio" | "chat";
}

type GrokMessage =
  | { role: "system" | "assistant"; content: string }
  | {
      role: "user";
      content:
        | string
        | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail?: string } }>;
    };

const MUSE_AUDIO_SUFFIX = `

[박물관 오디오 도슨트 — 음성 전용]
- 마크다운, 별표, 번호, 괄호, 메타 설명, 자막용 요약을 절대 쓰지 마세요. 오직 낭독할 본문만 작성하세요.
- 4~5분 분량. 국립중앙박물관·루브르 오디오 가이드처럼 품위 있고 차분한 구어체로 씁니다.
- 문장 길이를 다양하게 하되, 쉼표와 마침표로 호흡을 분명히 하세요. 한 문단은 2~4문장을 넘기지 마세요.
- "안녕하십니까. 오늘의 전시, 명곡·명시·명화를 순서대로 함께 살펴보겠습니다."처럼 정중하게 시작하세요.

[필수 구성 및 순서 — 반드시 1) 명곡 → 2) 명시 → 3) 명화 순서로 진행]
1) 명곡: 작곡가와 시대, 곡의 형식·악기·템포, 청자가 귀 기울일 순간 2~3곳, 오늘의 테마와의 정서적 연결
2) 명시: 시인 소개, 작품이 쓰인 시대·정서, 핵심 구절을 짧게 낭독한 뒤 줄별 의미와 문학사적 의미
3) 명화: 작가의 시대적 배경 한 줄, 작품 제작 맥락, 화면 구도·원근·빛의 방향, 주요 색채와 상징, 붓 터치나 질감, 감상 포인트 2가지
4) 마무리: 세 예술이 맞닿는 하나의 주제를 박물관 큐레이터처럼 정리하고, 조용히 되새길 질문 하나로 끝내세요.

[금지]
- "영감", "에너지", "힐링", "뮤즈예요" 같은 가벼운 인플루언서 말투
- 추상적 형용사만 나열하기
- 명시·명곡을 한두 문장으로 끝내기`;

const MUSE_SYSTEM_PROMPT = `당신은 세계적 미술관의 수석 오디오 도슨트이자 큐레이터 '뮤즈'입니다.
오늘 큐레이션된 명화 한 점, 명시 한 편, 명곡 한 곡을 관람객에게 전문적으로 안내합니다.

[전문성]
- 미술사, 문학사, 음악사에 대한 정확한 지식을 바탕으로 해설합니다.
- 작품의 형식적 분석(구도, 색, 빛, 선, 질감, 리듬, 화성)과 역사적 맥락을 균형 있게 제시합니다.
- 사실에 근거한 서술만 하며, 확인되지 않은 일화는 쓰지 않습니다.

[톤]
- 품위 있고 차분하며, 관람객 옆을 천천히 걸으며 설명하는 박물관 도슨트의 어조입니다.
- 과장·선동·유행어·친근한 반말을 쓰지 않습니다.
- 한국어 존댓말 또는 정중한 하십시오체를 일관되게 사용합니다.

[구조]
- 명화, 명시, 명곡 각각 독립된 깊이 있는 파트로 안내한 뒤, 마지막에 세 작품의 공명을 연결합니다.
- 제공된 명시·명곡 정보를 반드시 우선 사용하고, 작품명·작가명을 정확히 발음할 수 있게 한글로 명시합니다.

[금지]
- "잔잔한 음악", "감성적인 시" 등 막연한 표현
- 명시·명곡을 부록처럼 짧게만 언급
- 마크다운, 목록 기호, 괄호 지시문(음성 모드)`;

function normalizeApiKey(raw: unknown): string {
  return String(raw || "").trim().replace(/^["']|["']$/g, "");
}

function getGeminiApiKey(): string {
  const candidates = [
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY,
    process.env.GOOGLE_GENAI_API_KEY,
    process.env.AI_API_KEY,
    process.env.API_KEY,
  ];
  for (const raw of candidates) {
    const key = normalizeApiKey(raw);
    if (key && !key.startsWith("sk-") && !key.startsWith("xai-") && !key.includes("AQ.Ab8RN6LJzmJJ3ExtNix-ERyIkxzPtsV23WdCr71NRGItFPK41A")) return key;
  }
  return "";
}

function getXaiApiKey(): string {
  const candidates = [
    process.env.XAI_API_KEY,
    process.env.GROK_API_KEY,
    process.env.xAI,
    process.env.XAI,
  ];
  for (const raw of candidates) {
    const key = normalizeApiKey(raw);
    if (key && (key.startsWith("xai-") || key.startsWith("sk-xai-"))) return key;
  }
  return "";
}

function getOpenAIApiKey(): string {
  const candidates = [
    process.env.OPENAI_API_KEY,
    process.env.AI_API_KEY,
  ];
  for (const raw of candidates) {
    const key = normalizeApiKey(raw);
    if (key && (key.startsWith("sk-proj-") || (key.startsWith("sk-") && !key.startsWith("sk-xai-")))) return key;
  }
  return "";
}

function formatPoemContext(poem?: MuseDocentPoem): string {
  if (!poem?.title) return "오늘의 명시: 잔잔한 서정시";
  return [
    `제목: ${poem.title}${poem.titleOriginal ? ` (${poem.titleOriginal})` : ""}`,
    `시인: ${poem.poet}${poem.poetOriginal ? ` (${poem.poetOriginal})` : ""}`,
    poem.excerpt ? `핵심 구절: "${poem.excerpt}"` : "",
    poem.whyRecommended ? `추천 맥락: ${poem.whyRecommended}` : "",
  ].filter(Boolean).join("\n");
}

function formatSongContext(song?: MuseDocentSong): string {
  if (!song?.title) return "오늘의 명곡: 클래식 명곡";
  return [
    `제목: ${song.title}${song.titleOriginal ? ` (${song.titleOriginal})` : ""}`,
    `음악가: ${song.artist}${song.artistOriginal ? ` (${song.artistOriginal})` : ""}`,
    song.listeningGuide ? `감상 포인트: ${song.listeningGuide}` : "",
  ].filter(Boolean).join("\n");
}

function buildFirstUserText(req: MuseDocentRequest): string {
  return [
    "[오늘의 전시 안내 요청 — 순서: 명곡 → 명시 → 명화]",
    "[1단계: 오늘의 명곡]",
    formatSongContext(req.famousSong),
    "",
    "[2단계: 오늘의 명시]",
    formatPoemContext(req.famousPoem),
    "",
    "[3단계: 오늘의 명화]",
    `작품: ${req.title || "명화"}`,
    `작가: ${req.creator || "거장"}`,
    `유형/시대: ${req.artworkType || "유화"} · ${req.era || "시대"}`,
    `작품 설명: ${req.description || "빛과 어둠의 조화가 돋보이는 작품입니다."}`,
    `추천 맥락: ${req.whyRecommended || "내면의 평온과 예술적 영감을 선사합니다."}`,
    req.aestheticTone ? `색채/무드: ${req.aestheticTone}` : "",
    req.quote ? `작가의 말: "${req.quote}"` : "",
    "",
    req.mode === "audio"
      ? "반드시 1단계 명곡 → 2단계 명시 → 3단계 명화 순서로 국립중앙박물관 수석 도슨트의 품격 있는 음성 가이드 형식으로 자세하고 깊이 있게 해설해 주세요. 마크다운이나 특수기호 없이 자연스러운 낭독체로 작성해 주세요."
      : "반드시 1단계 명곡 → 2단계 명시 → 3단계 명화 순서로 깊이 있는 해설을 제공해 주세요.",
  ].filter(Boolean).join("\n");
}

function buildFollowUpUserText(req: MuseDocentRequest, userMessage: string): string {
  return [
    `[전시 맥락] 작품: ${req.title} (${req.creator}), 명시: ${req.famousPoem?.title || "없음"}, 명곡: ${req.famousSong?.title || "없음"}`,
    "",
    "[사용자 메시지]",
    userMessage,
  ].join("\n");
}

function resolveDocentImageUrl(imageUrl?: string): string | null {
  if (!imageUrl) return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/api/muse/artwork-image/proxy")) {
    try {
      const parsed = new URL(trimmed, "https://prism-universe.vercel.app");
      const upstream = parsed.searchParams.get("url");
      if (upstream?.startsWith("https://")) return upstream;
    } catch {
      return null;
    }
  }
  if (trimmed.startsWith("http://")) return trimmed;
  return null;
}

function buildGrokMessages(
  req: MuseDocentRequest,
  history: DocentMessage[],
  options?: { includeImage?: boolean; visionImageUrl?: string | null },
): GrokMessage[] {
  const includeImage = !!options?.includeImage && !!options?.visionImageUrl;
  const messages: GrokMessage[] = [{ role: "system", content: MUSE_SYSTEM_PROMPT }];
  const isFirstTurn = req.isFirstMessage ?? history.length === 0;

  if (isFirstTurn) {
    const text = buildFirstUserText(req);
    messages.push(
      includeImage
        ? {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: options!.visionImageUrl!, detail: "high" } },
              { type: "text", text },
            ],
          }
        : { role: "user", content: text },
    );
    return messages;
  }

  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content });
  }

  const latestUser = history.length > 0 && history[history.length - 1].role === "user"
    ? history[history.length - 1].content
    : "";

  if (latestUser) {
    messages[messages.length - 1] = {
      role: "user",
      content: buildFollowUpUserText(req, latestUser),
    };
  }

  return messages;
}

function withAudioSystemPrompt(messages: GrokMessage[]): GrokMessage[] {
  if (!messages.length || messages[0].role !== "system") return messages;
  const systemContent = typeof messages[0].content === "string" ? messages[0].content : MUSE_SYSTEM_PROMPT;
  return [{ role: "system", content: `${systemContent}${MUSE_AUDIO_SUFFIX}` }, ...messages.slice(1)];
}

function generateCuratedDocentScript(req: MuseDocentRequest): string {
  const title = req.title || "명화";
  const creator = req.creator || "거장";
  const era = req.era || "시대";
  const description = req.description || "빛과 어둠, 형태의 유려한 조화가 돋보이는 작품입니다.";
  const poemTitle = req.famousPoem?.title || "오늘의 명시";
  const poet = req.famousPoem?.poet || "시인";
  const poemExcerpt = req.famousPoem?.excerpt || "";
  const poemWhy = req.famousPoem?.whyRecommended || "내면의 깊은 서정과 위안을 전해줍니다.";
  const songTitle = req.famousSong?.title || "오늘의 명곡";
  const artist = req.famousSong?.artist || "작곡가";
  const songGuide = req.famousSong?.listeningGuide || "선율의 호흡에 가만히 귀 기울여 보시기 바랍니다.";
  const why = req.whyRecommended || "오늘 당신의 마음에 새로운 영감과 치유의 파동을 선사합니다.";

  return [
    `안녕하십니까. 세계 미술관 오디오 도슨트 뮤즈입니다. 오늘 큐레이션된 명곡, 명시, 그리고 명화의 아름다운 여정을 순서대로 함께 살펴보겠습니다.`,
    `첫 번째로 감상할 예술은 오늘의 명곡, ${artist}의 ${songTitle}입니다. ${songGuide} 유려하게 흐르는 선율의 호흡에 귀를 기울이며, 음악이 열어주는 내면의 공간에 가만히 머물러 보시기 바랍니다.`,
    `두 번째로 마주할 예술은 깊은 감정적 공명을 이루는 오늘의 명시, ${poet}의 ${poemTitle}입니다. ${poemExcerpt ? `"${poemExcerpt}"라는 구절처럼, ` : ""}${poemWhy}`,
    `세 번째로 마주할 걸작은 ${creator}의 대표 명화, ${title}입니다. ${era}에 탄생한 이 걸작은 미술사에서 매우 특별한 위치를 차지합니다. ${description} 화면 전체를 감싸는 빛과 색채의 조화, 그리고 붓 터치 하나하나에 깃든 작가의 시선과 질감을 시각적으로 음미해 보시기 바랍니다.`,
    `오늘 전해드린 명곡과 명시, 그리고 명화는 모두 ${why} 선율과 언어, 색채가 한데 어우러지는 조화로운 예술적 공간에서 마음의 평온을 찾으시고, 내면의 창조적 에너지를 다시 채우는 뜻깊은 하루가 되시기를 바랍니다. 감사합니다.`,
  ].join("\n\n");
}

async function tryGemini(messages: GrokMessage[], maxTokens: number): Promise<string | null> {
  const geminiKey = getGeminiApiKey();
  if (!geminiKey) return null;

  const models = [
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-flash-latest",
  ];

  const systemMsg = messages.find((m) => m.role === "system");
  const userMsgs = messages.filter((m) => m.role !== "system");
  const promptText = userMsgs
    .map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content)))
    .join("\n\n");

  for (const model of models) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const result = await ai.models.generateContent({
        model,
        contents: promptText,
        config: {
          systemInstruction: typeof systemMsg?.content === "string" ? systemMsg.content : undefined,
          maxOutputTokens: maxTokens,
          temperature: 0.55,
        },
      });

      const reply = result.text?.trim();
      if (reply) return reply;
    } catch (e) {
      console.warn(`[muse/docent] Gemini model ${model} failed:`, e instanceof Error ? e.message : e);
    }
  }

  return null;
}

async function tryXai(messages: GrokMessage[], maxTokens: number): Promise<string | null> {
  const xaiKey = getXaiApiKey();
  if (!xaiKey) return null;

  const models = ["grok-2-vision-1212", "grok-4.3", "grok-4.20", "grok-3"];

  for (const model of models) {
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${xaiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.55,
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (!res.ok) continue;
      const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
    } catch (e) {
      console.warn(`[muse/docent] xAI model ${model} failed:`, e instanceof Error ? e.message : e);
    }
  }

  return null;
}

async function tryOpenAI(messages: GrokMessage[], maxTokens: number): Promise<string | null> {
  const openAIKey = getOpenAIApiKey();
  if (!openAIKey) return null;

  const models = ["gpt-4o-mini", "gpt-4o"];

  for (const model of models) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.55,
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) continue;
      const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
      const reply = data?.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
    } catch (e) {
      console.warn(`[muse/docent] OpenAI model ${model} failed:`, e instanceof Error ? e.message : e);
    }
  }

  return null;
}

export async function handleMuseDocent(req: MuseDocentRequest): Promise<{ reply: string }> {
  const history = Array.isArray(req.messages) ? req.messages : [];
  const isAudioMode = req.mode === "audio";
  const maxTokens = isAudioMode ? 3500 : 2500;
  const visionImageUrl = resolveDocentImageUrl(req.imageUrl);

  const buildMessages = (includeImage: boolean) => {
    const baseMessages = buildGrokMessages(req, history, { includeImage, visionImageUrl });
    return isAudioMode ? withAudioSystemPrompt(baseMessages) : baseMessages;
  };

  // 1. Try Gemini
  const geminiReply = await tryGemini(buildMessages(false), maxTokens);
  if (geminiReply) return { reply: geminiReply };

  // 2. Try xAI Grok (with vision if image exists)
  const xaiReply = await tryXai(buildMessages(!!visionImageUrl), maxTokens);
  if (xaiReply) return { reply: xaiReply };

  // 3. Try OpenAI
  const openAIReply = await tryOpenAI(buildMessages(false), maxTokens);
  if (openAIReply) return { reply: openAIReply };

  // 4. Zero-Failure Curated Masterpiece Docent
  return { reply: generateCuratedDocentScript(req) };
}

export function applyCors(res: { setHeader: (k: string, v: string) => void }): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-stainless-sdk-version, x-stainless-os, x-stainless-lang, x-stainless-runtime, x-stainless-runtime-version, x-stainless-helper-method, x-stainless-package-version",
  );
}

export default async function handler(req: { method?: string; body?: unknown }, res: Response) {
  applyCors(res as any);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await handleMuseDocent(req.body as MuseDocentRequest);
    return res.status(200).json(result);
  } catch (err: unknown) {
    console.error("[muse/docent] error:", err);
    return res.status(200).json({ reply: generateCuratedDocentScript(req.body as MuseDocentRequest) });
  }
}
