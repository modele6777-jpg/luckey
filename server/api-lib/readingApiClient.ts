const READING_PATHS = ['/api/ai/daily-tarot', '/api/saju/chart'] as const;
const DEFAULT_READING_ORIGIN = 'https://luckey-six.vercel.app';
export type ReadingApiPath = (typeof READING_PATHS)[number];

export class ReadingApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ReadingApiError';
    this.status = status;
  }
}

let fetchOverride: typeof fetch | null = null;

export function setReadingApiFetchForTests(fetcher: typeof fetch | null): void {
  if (process.env.NODE_ENV === 'production') throw new Error('MCP test hook is disabled');
  fetchOverride = fetcher;
}

function parseAllowedOrigin(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const allowed = url.protocol === 'https:' || (url.protocol === 'http:' && local);
  if (!allowed || url.username || url.password) return null;
  return url.origin;
}

function originFromHost(host: string | undefined): string | null {
  const raw = (host || '').trim();
  if (!raw) return null;
  return parseAllowedOrigin(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
}

/** LUCKEY_API_ORIGIN overrides Vercel production, the current Vercel/Render deployment, then the public app. */
export function readingApiOrigin(): string {
  const override = (process.env.LUCKEY_API_ORIGIN || '').trim();
  if (override) {
    let url: URL;
    try {
      url = new URL(override);
    } catch {
      throw new ReadingApiError(503, 'LUCKEY_API_ORIGIN이 올바른 URL이 아닙니다.');
    }
    const parsed = parseAllowedOrigin(override);
    if (!parsed || url.username || url.password) {
      throw new ReadingApiError(503, 'LUCKEY_API_ORIGIN은 https 또는 로컬 http만 허용됩니다.');
    }
    return parsed;
  }
  return originFromHost(process.env.VERCEL_PROJECT_PRODUCTION_URL)
    || originFromHost(process.env.VERCEL_URL)
    || originFromHost(process.env.RENDER_EXTERNAL_URL)
    || parseAllowedOrigin(DEFAULT_READING_ORIGIN)
    || DEFAULT_READING_ORIGIN;
}

export async function postReadingApi(path: ReadingApiPath, body: unknown): Promise<{ status: number; body: unknown }> {
  if (!READING_PATHS.includes(path)) throw new ReadingApiError(500, '허용되지 않은 리딩 경로입니다.');
  const origin = readingApiOrigin();
  const fetcher = fetchOverride ?? fetch;
  let response: Response;
  try {
    response = await fetcher(`${origin}${path}`, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(35000),
    });
  } catch {
    throw new ReadingApiError(502, '리딩 API에 연결하지 못했습니다.');
  }
  if (response.status >= 300 && response.status < 400) {
    throw new ReadingApiError(502, '리딩 API가 다른 주소로 리다이렉트하여 응답을 따르지 않았습니다.');
  }
  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try { parsed = JSON.parse(text); } catch { parsed = { error: '리딩 API 응답이 JSON이 아닙니다.' }; }
  }
  return { status: response.status, body: parsed };
}

export function upstreamErrorMessage(status: number, body: unknown): string {
  const record = body && typeof body === 'object' ? body as { error?: unknown; code?: unknown } : {};
  const message = typeof record.error === 'string' ? record.error : '리딩 API가 실패했습니다.';
  const code = typeof record.code === 'string' ? ` ${record.code}` : '';
  return `리딩 API ${status}${code}: ${message}`;
}
