import type OpenAI from "openai";
import { getXaiApiKey } from "./xaiKey";

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export interface DocentMessage {
  role: "user" | "assistant";
  content: string;
}

export interface BluebirdDocentRequest {
  imageUrl: string;
  title: string;
  theme: string;
  prompt: string;
  messages?: DocentMessage[];
  isFirstMessage?: boolean;
  mode?: "audio" | "chat";
}

const LUMI_AUDIO_SUFFIX = `

[음성 내레이션 모드 — TTS 최적화]
- 마크다운, 별표, 번호 목록, 제목 기호를 절대 쓰지 마세요.
- 2~3분 분량의 자연스러운 구어체 독백으로 작성하세요.
- 문장은 짧고 호흡이 자연스럽게, 쉼표와 마침표로 리듬을 만드세요.
- "안녕하세요, 루미예요"처럼 따뜻하게 시작하고, 작품 감상 → 명곡 → 시 → 명화 순으로 부드럽게 이어지게 하세요.
- 곡명·시명·작품명은 말할 때 자연스럽게 끼워 넣되, 반드시 아티스트/시인/작가 이름과 함께 구체적으로 언급하세요.`;

const LUMI_SYSTEM_PROMPT = `당신은 '루미'입니다. Bluebird(블루버드)의 오늘의 예술 작품을 안내하는 도슨트입니다.

[성격과 톤]
- 따뜻하고 공감적이며 통찰력 있는 어조로 대화합니다.
- 사용자의 감정과 반응에 먼저 귀 기울인 뒤, 작품으로 자연스럽게 연결합니다.
- 딱딱한 박물관 해설이 아니라, 옆에서 함께 감상하는 친근한 안내자입니다.

[첫 응답 필수 내용]
작품 이미지를 시각적으로 분석한 뒤, 설명의 자연스러운 흐름 안에 아래 3가지를 반드시 포함하세요:

1. **명곡**: 아티스트 이름 + 정확한 곡 제목을 명시하고, 이 곡이 작품과 잘 맞는 이유를 1~2문장으로 설명
2. **시**: 시인 이름 + 시 제목을 명시하고, 작품과 연결되는 이유를 1~2문장으로 설명
3. **명화**: 작가 이름 + 작품 제목을 1~2점 명시하고, 색감·분위기·주제 면에서의 유사성을 설명

[금지 사항]
- "잔잔한 음악", "감성적인 시", "비슷한 그림" 같은 추상적 표현은 절대 사용하지 마세요.
- 반드시 실제로 존재하는 구체적인 곡명, 시명, 작품명을 사용하세요.

[후속 대화]
- 사용자가 더 추천해달라고 하면, 이전에 추천한 것과 다른 구체적인 곡·시·명화를 새로 제안하세요.
- 작품 맥락(제목, 테마, 생성 프롬프트)을 잊지 말고 일관되게 안내하세요.

[출력 형식]
- 한국어로 응답합니다.
- 마크다운을 적절히 활용해 읽기 쉽게 작성합니다.
- 명곡·시·명화 추천은 본문 흐름에 자연스럽게 녹여 쓰되, 각 항목이 명확히 구분되게 합니다.`;

const GROK_VISION_MODELS = [
  process.env.XAI_VISION_MODEL || "grok-2-vision-1212",
  process.env.XAI_MODEL || "grok-4.3",
  "grok-4.20",
  "grok-4.20-0309-non-reasoning",
  "grok-3",
];

function buildFirstUserText(req: BluebirdDocentRequest): string {
  return `[오늘의 예술 작품 맥락]
- 제목: ${req.title}
- 테마: ${req.theme}
- 생성 프롬프트: ${req.prompt}

위 작품 이미지를 직접 보고 감상해 주세요. 작품의 색감, 구도, 분위기, 상징을 분석하고, 루미로서 따뜻한 첫 인사와 함께 명곡·시·명화 추천을 자연스럽게 담아 안내해 주세요.`;
}

function buildFollowUpUserText(req: BluebirdDocentRequest, userMessage: string): string {
  return `[작품 맥락 유지]
- 제목: ${req.title}
- 테마: ${req.theme}
- 생성 프롬프트: ${req.prompt}

[사용자 메시지]
${userMessage}`;
}

function buildGrokMessages(
  req: BluebirdDocentRequest,
  history: DocentMessage[],
): ChatMessage[] {
  const messages: ChatMessage[] = [
    { role: "system", content: LUMI_SYSTEM_PROMPT },
  ];

  const isFirstTurn = req.isFirstMessage ?? history.length === 0;

  if (isFirstTurn) {
    messages.push({
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: req.imageUrl, detail: "high" },
        },
        {
          type: "text",
          text: buildFirstUserText(req),
        },
      ],
    });
    return messages;
  }

  for (let i = 0; i < history.length; i += 1) {
    const msg = history[i];
    if (msg.role === "assistant") {
      messages.push({ role: "assistant", content: msg.content });
      continue;
    }

    const isLatestUser = i === history.length - 1 && msg.role === "user";
    if (isLatestUser) {
      messages.push({
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: req.imageUrl, detail: "auto" },
          },
          {
            type: "text",
            text: buildFollowUpUserText(req, msg.content),
          },
        ],
      });
    } else {
      messages.push({ role: "user", content: msg.content });
    }
  }

  return messages;
}

export async function handleBluebirdDocent(req: BluebirdDocentRequest): Promise<{ reply: string }> {
  const apiKey = getXaiApiKey();
  if (!apiKey) {
    throw new Error("XAI_API_KEY가 설정되지 않았습니다.");
  }

  if (!req.imageUrl?.trim()) {
    throw new Error("작품 이미지 URL이 필요합니다.");
  }
  if (!req.title?.trim() || !req.theme?.trim()) {
    throw new Error("작품 제목과 테마가 필요합니다.");
  }

  const history = Array.isArray(req.messages) ? req.messages : [];
  const { default: OpenAI } = await import("openai");
  const grok = new OpenAI({ apiKey, baseURL: "https://api.x.ai/v1" });
  const isAudioMode = req.mode === "audio";
  const baseMessages = buildGrokMessages(req, history);
  const messages = isAudioMode
    ? [
        {
          ...baseMessages[0],
          content: `${typeof baseMessages[0].content === "string" ? baseMessages[0].content : LUMI_SYSTEM_PROMPT}${LUMI_AUDIO_SUFFIX}`,
        },
        ...baseMessages.slice(1),
      ]
    : baseMessages;

  let lastError: unknown = null;
  for (const model of GROK_VISION_MODELS) {
    try {
      const response = await grok.chat.completions.create({
        model,
        messages,
        temperature: 0.75,
        max_tokens: 4096,
      });
      const reply = response.choices[0]?.message?.content?.trim();
      if (!reply) {
        throw new Error("Grok가 빈 응답을 반환했습니다.");
      }
      return { reply };
    } catch (err) {
      lastError = err;
      console.warn(`[bluebird/docent] Model ${model} failed:`, err instanceof Error ? err.message : err);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("도슨트 응답 생성에 실패했습니다.");
}