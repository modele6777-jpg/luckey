const MAX_REQUEST_BYTES = 64 * 1024;
const MAX_PROVIDER_RESPONSE_BYTES = 3 * 1024 * 1024;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const IMAGE_MODEL_PATTERN = /^gemini-[a-zA-Z0-9._-]+$/;
const IMAGE_ASPECT_RATIOS = new Set(['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9']);

export interface CloudflareImageEnv {
  GEMINI_API_KEY?: string;
  GEMINI_IMAGE_MODEL?: string;
}

class ImageRouteError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public retryAfterSeconds?: number,
  ) {
    super(message);
  }
}

function json(body: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Luckey-API-Backend': 'cloudflare-worker',
  });
  new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));
  return Response.json(body, { status, headers });
}

function apiError(error: unknown): Response {
  const routeError = error instanceof ImageRouteError
    ? error
    : new ImageRouteError('이미지를 생성하지 못했습니다. 다시 시도해 주세요.', 502);
  const headers = new Headers();
  if (routeError.retryAfterSeconds) headers.set('Retry-After', String(routeError.retryAfterSeconds));
  return json({
    error: routeError.message,
    ...(routeError.code ? { code: routeError.code } : {}),
    ...(routeError.retryAfterSeconds ? { retryAfterSeconds: routeError.retryAfterSeconds } : {}),
  }, routeError.status, headers);
}

async function readBoundedText(stream: ReadableStream<Uint8Array> | null, limit: number, label: string): Promise<string> {
  if (!stream) return '';
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > limit) {
        try { await reader.cancel(); } catch { /* The stream may already be closed. */ }
        throw new ImageRouteError(`${label}이 너무 큽니다.`, label === '요청' ? 413 : 502,
          label === '요청' ? 'BODY_TOO_LARGE' : 'IMAGE_RESPONSE_TOO_LARGE');
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function declaredLengthIsTooLarge(value: string | null, limit: number): boolean {
  if (!value || !/^\d+$/.test(value)) return false;
  return Number(value) > limit;
}

async function readRequestJson(request: Request): Promise<Record<string, unknown>> {
  if (declaredLengthIsTooLarge(request.headers.get('Content-Length'), MAX_REQUEST_BYTES)) {
    throw new ImageRouteError('요청이 너무 큽니다.', 413, 'BODY_TOO_LARGE');
  }
  const raw = await readBoundedText(request.body, MAX_REQUEST_BYTES, '요청');
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new ImageRouteError('올바른 JSON 요청이 필요합니다.', 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ImageRouteError('요청 내용을 확인해 주세요.', 400);
  }
  return body as Record<string, unknown>;
}

async function readProviderJson(response: Response): Promise<any> {
  if (declaredLengthIsTooLarge(response.headers.get('Content-Length'), MAX_PROVIDER_RESPONSE_BYTES)) {
    try { await response.body?.cancel(); } catch { /* Ignore provider stream cleanup errors. */ }
    throw new ImageRouteError('미디어 응답이 너무 큽니다.', 502, 'IMAGE_RESPONSE_TOO_LARGE');
  }
  const raw = await readBoundedText(response.body, MAX_PROVIDER_RESPONSE_BYTES, '미디어 응답');
  try {
    return JSON.parse(raw);
  } catch {
    throw new ImageRouteError('미디어 응답을 읽지 못했습니다. 다시 시도해 주세요.', 502);
  }
}

function retrySeconds(response: Response, provider: any): number {
  const header = response.headers.get('Retry-After');
  if (header && /^\d+(?:\.\d+)?$/.test(header)) return Number(header);
  if (header && Number.isFinite(Date.parse(header))) return Math.max(1, (Date.parse(header) - Date.now()) / 1000);
  const details = Array.isArray(provider?.error?.details) ? provider.error.details : [];
  const retry = details.find((item: any) => String(item?.['@type'] || '').endsWith('RetryInfo'));
  const duration = /^([0-9]+(?:\.[0-9]+)?)s$/.exec(String(retry?.retryDelay || ''));
  return duration ? Number(duration[1]) : 15;
}

function isDailyQuota(provider: any): boolean {
  const details = Array.isArray(provider?.error?.details) ? provider.error.details : [];
  const violations = details.flatMap((item: any) => Array.isArray(item?.violations) ? item.violations : []);
  return violations.some((item: any) =>
    /per.?day|daily/i.test(String(item?.quotaId || item?.quotaMetric || item?.description || ''))
      || String(item?.quotaValue) === '0')
    || /per.?day|daily/i.test(String(provider?.error?.message || ''));
}

function decodeImageBytesFromBase64Length(data: string): number {
  if (!data.length || data.length % 4 !== 0) return -1;
  const padding = data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0;
  return (data.length / 4) * 3 - padding;
}

export function isCloudflareImageApiPath(pathname: string): boolean {
  return pathname === '/api/ai/image';
}

export async function handleCloudflareImageApi(
  request: Request,
  env: CloudflareImageEnv,
  fetchApi: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'POST 요청을 사용해 주세요.' }, 405, { Allow: 'POST' });
  }

  try {
    const body = await readRequestJson(request);
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) throw new ImageRouteError('이미지 설명을 입력해 주세요.', 400);
    if (prompt.length > 8000) throw new ImageRouteError('이미지 설명이 너무 깁니다. 나누어 요청해 주세요.', 413);

    const key = String(env.GEMINI_API_KEY || '').trim();
    if (!key) throw new ImageRouteError('Gemini API 키가 설정되지 않았습니다.', 503);

    const model = env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-lite-image';
    if (!IMAGE_MODEL_PATTERN.test(model)) throw new ImageRouteError('미디어 모델 설정을 확인해 주세요.', 503);
    const aspectRatio = IMAGE_ASPECT_RATIOS.has(String(body.aspectRatio)) ? String(body.aspectRatio) : '1:1';
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio } },
    };

    let response: Response;
    try {
      response = await fetchApi(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(payload),
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(60000)]),
      });
    } catch {
      throw new ImageRouteError('미디어 생성 연결 시간이 초과되었습니다. 다시 시도해 주세요.', 504);
    }

    if (!response.ok) {
      if (response.status === 429) {
        let provider: any = null;
        try { provider = await readProviderJson(response); } catch { /* Use the safe default when provider details are unavailable. */ }
        const details = Array.isArray(provider?.error?.details) ? provider.error.details : [];
        const hasRetryInfo = details.some((item: any) => String(item?.['@type'] || '').endsWith('RetryInfo'));
        if (!hasRetryInfo && isDailyQuota(provider)) {
          throw new ImageRouteError('AI 제공자의 사용 한도가 소진되었습니다. API 결제·한도 설정 확인이 필요합니다.', 429, 'MEDIA_QUOTA_EXHAUSTED');
        }
        const retryAfterSeconds = Math.max(1, Math.min(86400, Math.ceil(retrySeconds(response, provider))));
        throw new ImageRouteError(`AI 생성 요청이 일시적으로 제한됐습니다. 약 ${retryAfterSeconds}초 뒤 다시 눌러 주세요.`, 429, 'MEDIA_RATE_LIMIT', retryAfterSeconds);
      }
      const status = response.status;
      try { await response.body?.cancel(); } catch { /* Ignore provider stream cleanup errors. */ }
      throw new ImageRouteError(
        status === 401 || status === 403 ? 'Gemini 미디어 모델 사용 권한을 확인해 주세요.'
          : status === 404 ? '설정된 미디어 모델을 사용할 수 없습니다.'
            : status === 400 ? '미디어 생성 요청을 확인해 주세요.' : '미디어를 생성하지 못했습니다. 다시 시도해 주세요.',
        [400, 401, 403, 404].includes(status) ? status : 502,
      );
    }

    const result = await readProviderJson(response);
    const parts = result?.candidates?.[0]?.content?.parts;
    const media = Array.isArray(parts) ? parts.find((part: any) => part?.inlineData?.data)?.inlineData : null;
    if (!media) throw new ImageRouteError('미디어 응답이 비어 있습니다. 요청 내용을 바꾸어 다시 시도해 주세요.', 502);
    if (!/^image\/(png|jpeg|webp)$/.test(String(media.mimeType || ''))) {
      throw new ImageRouteError('이미지 형식을 확인하지 못했습니다.', 502);
    }
    if (typeof media.data !== 'string') throw new ImageRouteError('이미지 데이터가 올바르지 않습니다.', 502);
    const imageBytes = decodeImageBytesFromBase64Length(media.data);
    if (imageBytes <= 0) throw new ImageRouteError('이미지 데이터가 올바르지 않습니다.', 502);
    if (imageBytes > MAX_IMAGE_BYTES) throw new ImageRouteError('생성된 이미지가 너무 큽니다. 다시 시도해 주세요.', 502, 'IMAGE_RESPONSE_TOO_LARGE');

    return json({ imageUrl: `data:${media.mimeType};base64,${media.data}` });
  } catch (error) {
    return apiError(error);
  }
}
