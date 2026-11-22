/**
 * 서버 Gemini 호출의 성공·실패 이유를 모델별로 기억한다 (상태 확인용).
 * 키 값이나 요청 내용은 절대 저장하지 않고, 모델 이름·상태 코드·분류·짧게 정리한 이유만 남긴다.
 */

export type GeminiFailureCategory =
  | 'quota' // 사용 한도(분당·하루 요청 수) 초과
  | 'billing' // 결제·선불 크레딧 문제
  | 'key' // 키가 없거나 거부됨, 권한 없음
  | 'model-unavailable' // 이 키로는 그 모델을 쓸 수 없음 / 모델 이름 없음
  | 'overloaded' // 구글 서버 혼잡(5xx)
  | 'timeout'
  | 'bad-request'
  | 'other';

export interface GeminiModelHealth {
  lastOkAt?: string;
  lastFailAt?: string;
  status?: number;
  category?: GeminiFailureCategory;
  reason?: string;
  failures: number;
  successes: number;
}

const health = new Map<string, GeminiModelHealth>();
const recent: { at: string; model: string; status?: number; category: GeminiFailureCategory; reason: string }[] = [];

function entry(model: string): GeminiModelHealth {
  let item = health.get(model);
  if (!item) { item = { failures: 0, successes: 0 }; health.set(model, item); }
  return item;
}

/** Removes anything that could be a credential and keeps the reason short. */
export function sanitizeReason(raw: string): string {
  return raw
    .replace(/AIza[0-9A-Za-z_-]{10,}/g, '[key]')
    .replace(/(key|token|access_token)=[^&\s"']+/gi, '$1=[hidden]')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [hidden]')
    .replace(/projects\/[^/\s"'`]+/g, 'projects/[project]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

export function classifyGeminiError(err: any): { status?: number; category: GeminiFailureCategory; reason: string } {
  const statusRaw = err?.status ?? err?.error?.code ?? err?.statusCode ?? err?.code;
  const status = Number.isFinite(Number(statusRaw)) ? Number(statusRaw) : undefined;
  let text = '';
  try {
    const detail = err?.error || err?.errorDetails;
    text = `${err?.message || ''}${detail ? ` ${JSON.stringify(detail)}` : ''}`;
  } catch { text = String(err?.message || err || ''); }
  const lower = text.toLowerCase();
  let category: GeminiFailureCategory = 'other';
  if (/prepayment|credits? (are )?depleted|billing|payment required/.test(lower)) category = 'billing';
  else if (status === 429 || /resource_exhausted|quota|rate limit|too many requests/.test(lower)) category = 'quota';
  else if (status === 401 || status === 403 || /permission_denied|api key|unauthenticated|api_key_invalid|forbidden/.test(lower)) category = 'key';
  else if (status === 404 || /not found|not_found|is not supported|unsupported model|does not exist/.test(lower)) category = 'model-unavailable';
  else if (/timeout|timed out|deadline/.test(lower) || status === 408 || status === 504) category = 'timeout';
  else if (status === 400 || /invalid_argument|bad request/.test(lower)) category = 'bad-request';
  else if ((status && status >= 500) || /unavailable|overloaded|high demand|internal/.test(lower)) category = 'overloaded';
  return { status, category, reason: sanitizeReason(text || String(err)) };
}

export function recordGeminiFailure(model: string, err: unknown): void {
  const { status, category, reason } = classifyGeminiError(err);
  const item = entry(model);
  const at = new Date().toISOString();
  Object.assign(item, { lastFailAt: at, status, category, reason, failures: item.failures + 1 });
  recent.unshift({ at, model, status, category, reason });
  if (recent.length > 20) recent.length = 20;
}

export function recordGeminiSuccess(model: string): void {
  const item = entry(model);
  item.lastOkAt = new Date().toISOString();
  item.successes += 1;
}

export function getGeminiHealthSnapshot() {
  return {
    models: Object.fromEntries([...health.entries()].sort(([a], [b]) => a.localeCompare(b))),
    recentFailures: recent.slice(0, 10),
  };
}
