import { SajuInputError, sajuChartFromInput } from '../server/api-lib/sajuChartApi.ts';

const MAX_SAJU_BODY_BYTES = 16 * 1024;
const JSON_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
const ARTWORK_CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400';
const ARTWORK_IMAGE_EXACT_HOSTS = new Set(['image.pollinations.ai']);
const ARTWORK_IMAGE_HOST_SUFFIXES = [
  '.wikimedia.org', '.wikipedia.org', '.gstatic.com', '.googleusercontent.com',
  '.dailyartmagazine.com', '.artic.edu', '.metmuseum.org',
];

export function isCloudflareSafeApiPath(pathname: string): boolean {
  return pathname === '/api/saju/chart' || pathname === '/api/muse/artwork-image/proxy';
}

function jsonResponse(body: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = new Headers(JSON_HEADERS);
  if (extraHeaders) new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));
  return Response.json(body, { status, headers });
}

async function readSajuBody(request: Request): Promise<Record<string, unknown> | Response> {
  const declaredSize = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declaredSize) && declaredSize > MAX_SAJU_BODY_BYTES) {
    return jsonResponse({ error: '요청이 너무 큽니다.', code: 'BODY_TOO_LARGE' }, 413);
  }

  const reader = request.body?.getReader();
  if (!reader) return {};
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > MAX_SAJU_BODY_BYTES) {
        await reader.cancel();
        return jsonResponse({ error: '요청이 너무 큽니다.', code: 'BODY_TOO_LARGE' }, 413);
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }

  if (size === 0) return {};
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return jsonResponse({ error: '올바른 JSON 요청이 필요합니다.', code: 'invalid_json' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ error: '요청 내용을 확인해 주세요.', code: 'invalid_body' }, 400);
  }
  return body as Record<string, unknown>;
}

function handleSajuChart(request: Request): Response | Promise<Response> {
  const allowHeaders = new Headers({
    ...JSON_HEADERS,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  if (request.method === 'OPTIONS') return new Response(null, { status: 200, headers: allowHeaders });
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, { Allow: 'POST, OPTIONS', 'Access-Control-Allow-Methods': 'POST, OPTIONS' });
  }

  return readSajuBody(request).then((body) => {
    if (body instanceof Response) return body;
    try {
      return jsonResponse(sajuChartFromInput(body));
    } catch (error) {
      const status = error instanceof SajuInputError ? error.status : 400;
      const message = error instanceof Error ? error.message : '사주 계산에 실패했습니다.';
      const code = error instanceof SajuInputError ? error.code : 'saju_input';
      return jsonResponse({ error: message, code }, status);
    }
  });
}

function allowedArtworkImageUrl(raw: string | null): URL | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) return null;
    if (!ARTWORK_IMAGE_EXACT_HOSTS.has(host) && !ARTWORK_IMAGE_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) return null;
    return url;
  } catch {
    return null;
  }
}

function handleArtworkImageProxy(request: Request): Response {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  if (request.method === 'OPTIONS') return new Response(null, { status: 200, headers });
  if (request.method !== 'GET') {
    headers.set('Allow', 'GET, OPTIONS');
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
  }

  const target = allowedArtworkImageUrl(new URL(request.url).searchParams.get('url'));
  if (!target) {
    headers.set('Cache-Control', 'no-store');
    return Response.json({ error: 'Invalid image URL' }, { status: 400, headers });
  }

  headers.set('Cache-Control', ARTWORK_CACHE_CONTROL);
  headers.set('Location', target.href);
  return new Response(null, { status: 302, headers });
}

export function handleCloudflareSafeApi(request: Request): Response | Promise<Response> {
  const pathname = new URL(request.url).pathname;
  if (pathname === '/api/saju/chart') return handleSajuChart(request);
  if (pathname === '/api/muse/artwork-image/proxy') return handleArtworkImageProxy(request);
  return jsonResponse({ error: 'Not found' }, 404);
}
