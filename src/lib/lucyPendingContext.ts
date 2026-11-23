/**
 * 다른 화면(예: 오브)에서 루시에게 보내는 다음 메시지에 붙일 "보이지 않는 참고 자료".
 * 채팅 말풍선에는 사용자 문장만 보이고, 이 자료는 다음 전송 한 번에만 루시의 참고 자료로 들어간다.
 * 접힌 화면은 페이지를 옮겨 다니므로 sessionStorage에도 둔다.
 */
const KEY = 'lucy_pending_context';
let memory: string | null = null;

export function setPendingLucyContext(text: string): void {
  memory = text;
  try { sessionStorage.setItem(KEY, text); } catch { /* storage unavailable */ }
}

/** 다음 전송에서 한 번만 꺼내 쓴다. */
export function takePendingLucyContext(): string {
  let text = memory || '';
  memory = null;
  try {
    text = text || sessionStorage.getItem(KEY) || '';
    sessionStorage.removeItem(KEY);
  } catch { /* storage unavailable */ }
  return text;
}
