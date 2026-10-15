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
- 2~3분 분량 (약 600~850자). 국립중앙박물관·루브르 오디오 가이드처럼 품위 있고 정중한 구어체로 씁니다.
- 문장 길이를 다양하게 하되, 쉼표와 마침표로 호흡을 분명히 하세요.
- "안녕하십니까. 오늘의 예술 도슨트, 명곡과 명시, 명화를 함께 살펴보겠습니다."처럼 정중하게 시작하세요.

[필수 구성 순서 — 반드시 명곡 → 명시 → 명화 순서 엄수]
1) 명곡: 작곡가/음악가와 곡의 선율, 첫 귀를 사로잡는 음악적 정서와 감상 포인트
2) 명시: 시인과 시대적 정서를 소개한 뒤, 제공된 시의 본문 구절 전문을 한 줄도 누락하거나 중간에 자르지 말고 온전히 끝까지 전부 낭독합니다. (시의 낭독이 중간에 끊기거나 단어만 언급하고 넘어가지 않도록 완전히 낭독한 후, 앞선 선율과의 문학적 공명과 예술적 울림을 해설합니다.)
3) 명화: 화가와 시대적 배경, 화면 구도와 빛·색채, 앞선 음악과 시가 시각적으로 완성되는 미술 작품 해설
4) 마무리: 세 예술(명곡·명시·명화)이 하나의 깊은 울림으로 공명하는 종합적 여운 정리

[금지]
- "영감", "에너지", "힐링", "뮤즈예요" 같은 가벼운 인플루언서 말투
- 시 본문을 낭독하다가 도중에 생략하거나 말줄임표(...)로 끝내는 행위 (반드시 전문 낭독 완료)
- 추상적 형용사만 나열하기
- 마크다운이나 괄호 지시문`;

const MUSE_SYSTEM_PROMPT = `당신은 세계적 미술관의 수석 오디오 도슨트이자 큐레이터 '뮤즈'입니다.
오늘 큐레이션된 명곡 한 곡, 명시 한 편, 명화 한 점을 관람객에게 전문적으로 안내합니다.

[전문성]
- 음악사, 문학사, 미술사에 대한 정확한 지식을 바탕으로 해설합니다.
- 해설 순서는 반드시 명곡 → 명시 → 명화 순서를 엄격히 준수합니다.
- 작품의 형식적 분석(리듬, 화성, 문학적 비유, 구도, 색, 빛, 선, 질감)과 역사적 맥락을 균형 있게 제시합니다.
- 사실에 근거한 서술만 하며, 확인되지 않은 일화는 쓰지 않습니다.

[톤]
- 품위 있고 차분하며, 관람객 옆을 천천히 걸으며 설명하는 박물관 도슨트의 어조입니다.
- 과장·선동·유행어·친근한 반말을 쓰지 않습니다.
- 한국어 존댓말 또는 정중한 하십시오체를 일관되게 사용합니다.

[구조]
- 명곡, 명시, 명화 각각 독립된 깊이 있는 파트로 순서대로 안내한 뒤, 마지막에 세 작품의 공명을 연결합니다.
- 특히 명시 파트에서는 제공된 시의 구절 전문을 도중에 끊거나 축약하지 말고 온전하게 끝까지 전부 낭독해야 합니다.
- 제공된 명곡·명시·명화 정보를 반드시 우선 사용하고, 작품명·작가명을 정확히 발음할 수 있게 한글로 명시합니다.

[금지]
- "잔잔한 음악", "감성적인 시" 등 막연한 표현
- 명시의 전문을 다 읽지 않고 중간에 끊어버리는 행위
- 명곡·명시를 부록처럼 짧게만 언급하는 행위 (순서에 맞춰 3대 예술을 동등한 무게로 해설)
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
    poem.excerpt ? `시 본문 (오디오 낭독 시 중간 생략 없이 이 전문을 끝까지 전부 낭독할 것):\n"${poem.excerpt}"` : "",
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
    `안녕하십니까. 세계 미술관 오디오 도슨트 뮤즈입니다. 오늘 큐레이션된 명곡, 명시, 그리고 명화의 아름다운 예술적 여정을 함께 살펴보겠습니다.`,
    `첫 번째로 귀를 기울일 예술은 ${artist}의 ${songTitle}입니다. ${songGuide} 유려하게 흐르는 선율은 마음에 깊은 평온을 드리우며 오늘의 영적 파동을 부드럽게 열어줍니다.`,
    `이어서 이 아름다운 선율과 깊은 감정적 공명을 이루는 오늘의 명시, ${poet}의 ${poemTitle}을 전해드립니다. ${poemExcerpt ? `\n\n"${poemExcerpt}"\n\n` : ""}${poemWhy}`,
    `마지막으로 시선이 닿을 걸작은 ${creator}의 대표작, ${title}입니다. ${era}에 탄생한 이 명화는 앞서 감상한 음악과 시의 정서를 하나의 화폭에 시각적으로 온전히 담아냅니다. ${description}`,
    `화면 전체를 감싸는 빛과 색채의 조화에 주목해 보십시오. 작가는 캔버스 위에 그 순간의 공기와 내면의 정서를 붓 터치 하나하나에 깊이 새겨 넣었습니다. 잠시 시선을 멈추고 화폭의 깊은 질감과 온도를 느껴보시기 바랍니다.`,
    `오늘 만난 세 가지 예술적 울림은 모두 ${why} 선율과 시구, 색채가 어우러진 조화로운 공간에서 마음의 평온을 찾으시고, 내면의 창조적 에너지를 가득 채우는 뜻깊은 하루가 되시기를 바랍니다. 감사합니다.`,
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

function isValidAudioDocent(reply: string, req: MuseDocentRequest): boolean {
  if (!reply || reply.length < 350) return false;

  // In audio mode, the docent must strictly follow: 1. 명곡 -> 2. 명시 -> 3. 명화
  if (req.famousSong?.title) {
    const songIndex = reply.indexOf(req.famousSong.title);
    const artIndex = req.title ? reply.indexOf(req.title) : -1;

    // Song must be mentioned and must appear before the artwork!
    if (songIndex === -1 && !reply.includes(req.famousSong.artist)) {
      return false;
    }
    if (songIndex !== -1 && artIndex !== -1 && artIndex < songIndex) {
      // Artwork was mentioned before the song; LLM jumped straight to the artwork (middle)
      return false;
    }
  }

  // Must mention poem if provided
  if (req.famousPoem?.title) {
    const poemIndex = reply.indexOf(req.famousPoem.title);
    if (poemIndex === -1 && !reply.includes(req.famousPoem.poet)) {
      return false;
    }
  }

  return true;
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
  if (geminiReply) {
    if (!isAudioMode || isValidAudioDocent(geminiReply, req)) {
      return { reply: geminiReply };
    }
    console.warn("[muse/docent] Gemini audio docent skipped song/poem sequence; falling back to curated script");
  }

  // 2. Try xAI Grok (with vision if image exists)
  const xaiReply = await tryXai(buildMessages(!!visionImageUrl), maxTokens);
  if (xaiReply) {
    if (!isAudioMode || isValidAudioDocent(xaiReply, req)) {
      return { reply: xaiReply };
    }
    console.warn("[muse/docent] xAI audio docent skipped song/poem sequence; falling back to curated script");
  }

  // 3. Try OpenAI
  const openAIReply = await tryOpenAI(buildMessages(false), maxTokens);
  if (openAIReply) {
    if (!isAudioMode || isValidAudioDocent(openAIReply, req)) {
      return { reply: openAIReply };
    }
    console.warn("[muse/docent] OpenAI audio docent skipped song/poem sequence; falling back to curated script");
  }

  // 4. Zero-Failure Curated Masterpiece Docent (항상 1단계 명곡 -> 2단계 명시 -> 3단계 명화 순서 완전 보장)
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
