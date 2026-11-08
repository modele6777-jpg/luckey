import { isExplicitLucyTopicSwitch } from './lucyConversationMemory';
export const LUCY_NO_YA_PREFIX_RULE = "절대로 대화 시작이나 문장 앞에 '[LUCY]', '루시:' 등의 접두사(Prefix)나 캐릭터 이름을 붙이지 말고, 대화 내용만 바로 말해줘. 또한 너(루시)는 항상 예외 없이 100% 다정하고 친근한 반말만 사용해야 해.";

export const APP_CHANNEL_LABELS: Record<string, string> = {
  HEAL: "세도나 (HEAL)",
  ORANGE: "오렌지 (ORANGE)",
  MUSE: "뮤즈 (MUSE)",
  TRINITY: "트리니티 (TRINITY)",
  BLUEBIRD: "블루버드 (BLUEBIRD)",
  LIME: "라임 (LIME)"
};

export function getMessageText(content: any): string {
  if (typeof content === "string") return content;
  if (!content) return "";
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) return part.text;
        return "";
      })
      .join("");
  }
  if (typeof content === "object") {
    if ("text" in content) return content.text;
  }
  return String(content);
}

export type LucyTaskIntent = "tarot" | "release" | null;

export function detectLucyTaskIntent(text: string): LucyTaskIntent {
  if (/(?:타로|tarot|예\s*(?:\/|또는|or)\s*아니오|yes\s*(?:\/|or)\s*no)/i.test(text)) {
    return "tarot";
  }
  if (/(?:세도나|방하착|호오포노포노|놓아버리기|정화\s*리추얼|감정\s*릴리즈)/i.test(text)) {
    return "release";
  }
  return null;
}

export function resetLucyContextOnTaskSwitch<T extends { role: string; content: unknown }>(
  messages: T[],
  currentRequest: string,
): { messages: T[]; didReset: boolean } {
  if (isExplicitLucyTopicSwitch(currentRequest)) return { messages:messages.slice(-1), didReset:messages.length>1 };
  const currentIntent = detectLucyTaskIntent(currentRequest);
  if (!currentIntent) return { messages, didReset: false };

  const previousUserMessage = [...messages.slice(0, -1)]
    .reverse()
    .find((message) => message.role === "user");
  const previousIntent = previousUserMessage
    ? detectLucyTaskIntent(getMessageText(previousUserMessage.content))
    : null;

  if (!previousIntent || previousIntent === currentIntent) {
    return { messages, didReset: false };
  }

  const currentMessage = messages[messages.length - 1];
  return {
    messages: currentMessage ? [currentMessage] : messages.slice(-1),
    didReset: true,
  };
}

export function cleanLucyChatText(text: string): string {
  if (!text) return "";
  let cleaned = text.trim();
  // Remove starting label if any, e.g., "[LUCY] " or "루시: "
  cleaned = cleaned.replace(/^\[LUCY\]\s*/i, "");
  cleaned = cleaned.replace(/^루시:\s*/, "");
  return cleaned;
}

export function buildCrossAppDialogueContextFromThread(lucyThread: any[], currentApp?: string): string {
  if (!Array.isArray(lucyThread) || lucyThread.length === 0) return "";

  // Take the last 10 messages for cross-app context
  const recentMessages = lucyThread.slice(-10);
  const formatted = recentMessages
    .map((msg: any) => {
      const roleName = msg.role === "user" ? "사용자" : "루시";
      const appInfo = msg.app || msg.channel || "PRISM";
      const text = getMessageText(msg.content);
      return `[${appInfo}] ${roleName}: ${text}`;
    })
    .join("\n");

  return `\n\n[이전 대화 맥락 (다른 유니버스 앱 포함)]\n${formatted}\n`;
}

/**
 * 루시의 긴 답변을 실제 사람이 카카오톡으로 대화하듯 2~4개의 자연스러운 말풍선으로 분할합니다.
 * - 아주 짧은 한 줄 답변(< 45자)이나 시스템/오류 안내는 1개 말풍선으로 유지합니다.
 * - 코드 블록, 마크다운 표, 제목+본문 세트가 깨지지 않도록 보호합니다.
 * - 문단 구분(\n\n)이 없는 긴 단일 문단도 자연스러운 문장 호흡 단위로 2~4개 말풍선으로 쪼갭니다.
 */
function isBubbleHeading(line: string): boolean {
  const text = line.trim();
  const label = text.replace(/^(?:[-+•·‣▪]\s*|\*\s+|\d+[.)]\s+)/, '');
  return /^#{1,6}\s+\S/.test(label)
    || /^\*\*[^\n]+\*\*\s*:?$/.test(label)
    || /^[^\n.!?。]{1,100}[:：]$/.test(label)
    || (/^(?:\[|🔮|💡|✨|📌|🌿|🍊|🕊️|🎨|🌅|🌙)[^\n]{1,42}$/.test(label) && !/[.!?~…]$/.test(label));
}

export function splitIntoKakaoBubbles(rawText: string, maxBubbles = 4): string[] {
  if (!rawText || typeof rawText !== "string") return [];
  const trimmed = cleanLucyChatText(rawText).trim();
  if (!trimmed) return [];

  // 시스템 에러 안내 메시지는 분할하지 않고 1개 말풍선으로 유지
  if (trimmed.startsWith("⚠️ [") || trimmed.startsWith("(※ 일시적인 네트워크")) {
    return [trimmed];
  }

  // 1. 코드 블록(```) 내부의 빈 줄을 임시 보호한 뒤 \n\n 단위로 1차 단락 분리
  const codeBlocks: string[] = [];
  const protectedText = trimmed.replace(/```[\s\S]*?```/g, (match) => {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `__KAKAO_CODE_BLOCK_${idx}__`;
  });

  const restoreCodeBlocks = (str: string): string =>
    str.replace(/__KAKAO_CODE_BLOCK_(\d+)__/g, (_, i) => codeBlocks[Number(i)] || "");

  let rawParagraphs = protectedText
    .split(/\n{2,}/)
    .map((p) => restoreCodeBlocks(p.trim()))
    .filter((p) => p.length > 0);

  // 2. 단독 소제목(# 헤더, 짧은 볼드 타이틀 등)이 다음 문단과 분리되어 고립되지 않도록 병합
  const mergedParagraphs: string[] = [];
  for (const curr of rawParagraphs) {
    const previous = mergedParagraphs.at(-1);
    // A title may be its own paragraph or the final line of the previous paragraph.
    if (previous && isBubbleHeading(previous.split('\n').at(-1) || '')) {
      mergedParagraphs[mergedParagraphs.length - 1] = `${previous}\n\n${curr}`;
    } else {
      mergedParagraphs.push(curr);
    }
  }

  // 3. 만약 문단이 1개뿐인데 길이가 긴 경우(>= 45자), 단일 줄바꿈(\n) 또는 문장 단위로 자연스럽게 분할
  let units = mergedParagraphs;
  if (units.length === 1) {
    const single = units[0];
    // Do not undo title/body grouping in the line/sentence fallback below.
    if (single.split('\n').some(isBubbleHeading)) return [single];
    if (single.length < 45) {
      return [single];
    }

    // 3-a. 코드 블록이나 표가 아닌 일반 텍스트에서 단일 줄바꿈(\n)이 있는 경우
    const hasCodeOrTable = /```|\n\|.*\|/.test(single);
    if (!hasCodeOrTable && single.includes("\n")) {
      const lines = single
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length >= 2) {
        units = [];
        let buffer = "";
        for (const line of lines) {
          if (!buffer) {
            buffer = line;
          } else if (buffer.length < 24 || /^[-*•\d]/.test(line)) {
            buffer = `${buffer}\n${line}`;
          } else {
            units.push(buffer);
            buffer = line;
          }
        }
        if (buffer) units.push(buffer);
      }
    }

    // 3-b. 줄바꿈 없이 한 문단으로 길게 이어진 문장들인 경우 문장 부호/종결어미 호흡 기준으로 분리
    if (units.length === 1 && single.length >= 45 && !hasCodeOrTable) {
      const sentences = single
        .split(/(?<=[.!?~…])\s+(?=[가-힣A-Za-z0-9"'(‘“\[✨🔮💡🌿💬☀️🌙🍀❤️🧡💛💚💙💜])/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (sentences.length >= 2) {
        const targetCount =
          sentences.length === 2
            ? 2
            : single.length < 130
            ? Math.min(3, sentences.length)
            : Math.min(maxBubbles, Math.max(2, Math.ceil(sentences.length / 2)));

        const perBubble = Math.ceil(sentences.length / targetCount);
        const sentenceGroups: string[] = [];
        for (let i = 0; i < sentences.length; i += perBubble) {
          sentenceGroups.push(sentences.slice(i, i + perBubble).join(" "));
        }
        units = sentenceGroups;
      }
    }
  }

  if (units.length <= 1) {
    return [trimmed];
  }

  // 4. 너무 짧은 파편(< 16자)이 3개 이상 말풍선 사이에 끼어 있다면 인접 말풍선과 자연스럽게 결합
  const compactUnits: string[] = [];
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (u.length < 16 && compactUnits.length > 0 && compactUnits.length + (units.length - i) > 2) {
      compactUnits[compactUnits.length - 1] = `${compactUnits[compactUnits.length - 1]}\n\n${u}`;
    } else {
      compactUnits.push(u);
    }
  }

  if (compactUnits.length <= maxBubbles) {
    return compactUnits;
  }

  // 5. 단락이 maxBubbles(기본 4개)를 초과하는 경우:
  // 첫 번째 단락이 적정 길이(<= 260자)라면 첫 말풍선으로 고정해 스트리밍 중 첫 말풍선이 흔들리지 않게 유지하고,
  // 나머지 단락들을 글자 수 균형에 맞춰 (maxBubbles - 1)개 말풍선으로 배분합니다.
  const keepFirstFixed = compactUnits[0].length <= 260 && maxBubbles >= 2;
  const result: string[] = [];

  const partitionIntoBuckets = (items: string[], bucketCount: number): string[] => {
    if (bucketCount <= 1) return [items.join("\n\n")];
    if (items.length <= bucketCount) return items;

    const totalLen = items.reduce((sum, item) => sum + item.length, 0);
    const buckets: string[] = [];
    let currentBucket: string[] = [];
    let currentLen = 0;

    for (let i = 0; i < items.length; i++) {
      const remainingItems = items.length - i;
      const remainingBuckets = bucketCount - buckets.length;

      const targetBucketLen = totalLen / bucketCount;
      if (
        currentBucket.length > 0 &&
        buckets.length < bucketCount - 1 &&
        (currentLen >= targetBucketLen * 0.82 || remainingItems === remainingBuckets - 1)
      ) {
        buckets.push(currentBucket.join("\n\n"));
        currentBucket = [];
        currentLen = 0;
      }
      currentBucket.push(items[i]);
      currentLen += items[i].length;
    }

    if (currentBucket.length > 0) {
      if (buckets.length < bucketCount) {
        buckets.push(currentBucket.join("\n\n"));
      } else {
        buckets[buckets.length - 1] = `${buckets[buckets.length - 1]}\n\n${currentBucket.join("\n\n")}`;
      }
    }

    return buckets;
  };

  if (keepFirstFixed) {
    result.push(compactUnits[0]);
    result.push(...partitionIntoBuckets(compactUnits.slice(1), maxBubbles - 1));
  } else {
    result.push(...partitionIntoBuckets(compactUnits, maxBubbles));
  }

  return result.filter((b) => b.trim().length > 0);
}

/**
 * 분할된 여러 말풍선을 자동읽기(Auto-TTS)가 한 번에 끊김 없이 연달아 읽을 수 있도록
 * 말풍선 순서대로 자연스러운 호흡 간격을 두고 결합합니다.
 */
export function joinKakaoBubblesForTTS(rawText: string, maxBubbles = 4): string {
  const bubbles = splitIntoKakaoBubbles(rawText, maxBubbles);
  if (bubbles.length === 0) return "";
  return bubbles.join("\n\n");
}

