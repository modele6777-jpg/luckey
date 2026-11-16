import { handleCloudflareGeminiChat, isChatCompletionsPath } from './cloudflare-gemini-chat.ts';

const API_ORIGIN = 'https://luckey-six.vercel.app';
const API_URL = new URL(API_ORIGIN);
import { handleCloudflareGeminiSideRoute, isCloudflareGeminiSidePath } from './cloudflare-gemini-side-routes.ts';

const HOP_BY_HOP_HEADERS = [
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
];

const SENSITIVE_FORWARD_HEADERS = [
  'cookie',
  'cf-connecting-ip',
  'cf-ipcountry',
  'cf-ray',
  'cf-visitor',
  'cf-worker',
  'forwarded',
  'host',
  'x-client-ip',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-real-ip',
];

export interface CloudflareWorkerEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  GEMINI_API_KEY?: string;
}

function isApiPath(pathname: string): boolean {
  return pathname === '/api' || pathname.startsWith('/api/');
}

function isHealthPath(pathname: string): boolean {
  return pathname === '/health' || pathname === '/api/health';
}

function assetPathFor(pathname: string): string {
  if (/^\/(chat|lucy)(\/|$)/.test(pathname)) return '/chat.html';
  if (/^\/(handbook|rebible)(\/|$)/.test(pathname)) return '/handbook.html';
  return pathname;
}

function isDocumentFallback(pathname: string): boolean {
  return !pathname.split('/').pop()?.includes('.');
}

function rejectCrossOrigin(request: Request, requestUrl: URL): Response | null {
  const origin = request.headers.get('Origin');
  if (origin && origin !== requestUrl.origin) {
    return Response.json({ error: 'Cross-origin request rejected.' }, { status: 403 });
  }
  return null;
}

function healthResponse(request: Request, requestUrl: URL): Response {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Luckey-API-Backend': 'cloudflare-worker',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  if (request.headers.has('Origin')) {
    headers.set('Access-Control-Allow-Origin', requestUrl.origin);
    headers.append('Vary', 'Origin');
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    headers.set('Allow', 'GET, HEAD, OPTIONS');
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
  }
  if (request.method === 'HEAD') return new Response(null, { status: 200, headers });
  return Response.json({ status: 'ok' }, { status: 200, headers });
}

function buildUpstreamRequest(request: Request, requestUrl: URL): Request {
  const upstreamUrl = new URL(requestUrl.pathname + requestUrl.search, API_ORIGIN);
  const headers = new Headers(request.headers);
  for (const name of [...HOP_BY_HOP_HEADERS, ...SENSITIVE_FORWARD_HEADERS]) {
    headers.delete(name);
  }
  // The upstream app uses its own origin as a server-side access guard. Do not
  // copy an untrusted browser Origin into the Vercel request.
  headers.set('Origin', API_URL.origin);

  return new Request(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
    ...(request.body && request.method !== 'GET' && request.method !== 'HEAD' ? { duplex: 'half' as const } : {}),
  } as RequestInit);
}

function rewriteRedirect(response: Response, requestUrl: URL): Response {
  const location = response.headers.get('Location');
  if (!location) return response;
  try {
    const target = new URL(location, API_ORIGIN);
    if (target.origin !== API_URL.origin) return response;
    target.protocol = requestUrl.protocol;
    target.host = requestUrl.host;
    const headers = new Headers(response.headers);
    headers.set('Location', target.toString());
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  } catch {
    return response;
  }
}

async function proxyApi(request: Request, requestUrl: URL): Promise<Response> {
  const upstreamResponse = await fetch(buildUpstreamRequest(request, requestUrl));
  const response = rewriteRedirect(upstreamResponse, requestUrl);
  const headers = new Headers(response.headers);
  // Never establish an upstream cookie on the preview origin.
  headers.delete('set-cookie');
  const origin = request.headers.get('Origin');
  if (origin) {
    headers.set('Access-Control-Allow-Origin', requestUrl.origin);
    headers.append('Vary', 'Origin');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function serveAsset(request: Request, requestUrl: URL, env: CloudflareWorkerEnv): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  let pathname = assetPathFor(requestUrl.pathname);
  if (pathname === requestUrl.pathname && isDocumentFallback(pathname)) pathname = '/index.html';
  const assetUrl = new URL(pathname, requestUrl);
  const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, request));
  return assetResponse;
}

export const worker = {
  async fetch(request: Request, env: CloudflareWorkerEnv): Promise<Response> {
    const requestUrl = new URL(request.url);
    const originError = rejectCrossOrigin(request, requestUrl);
    if (originError) return originError;
    if (isHealthPath(requestUrl.pathname)) return healthResponse(request, requestUrl);
    if (isChatCompletionsPath(requestUrl.pathname)) return handleCloudflareGeminiChat(request, env);
    if (isCloudflareGeminiSidePath(requestUrl.pathname)) return handleCloudflareGeminiSideRoute(request, env);
    if (isApiPath(requestUrl.pathname)) return proxyApi(request, requestUrl);
    return serveAsset(request, requestUrl, env);
  },
};

export default worker;
