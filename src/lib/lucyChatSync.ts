import { safeLocalStorage } from "../utils/safeStorage";

export function loadChatFromLocal(uid: string | null): { messages: { lucy: any[] } } | null {
  try {
    const saved = safeLocalStorage.getItem("chat_history_unified");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return {
      messages: {
        lucy: parsed.lucy || [],
      },
    };
  } catch (e) {
    console.error("Error loading chat from local storage:", e);
    return null;
  }
}
