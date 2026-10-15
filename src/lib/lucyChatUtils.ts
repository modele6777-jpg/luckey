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
