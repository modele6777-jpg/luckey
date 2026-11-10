import type { NextFunction, Request, Response } from 'express';

const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

export function isAllowedAppOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  let url: URL;
  try { url = new URL(origin); } catch { return false; }
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1') return true;
  if (host === 'luckey-six.vercel.app') return true;
  if (host.endsWith('.vercel.app') && (host.startsWith('luckey-six') || host.startsWith('luckey-'))) return true;
  return false;
}

export function requestPath(req: Request): string {
  return (req.originalUrl || req.url || '/').split('?')[0];
}

export function isRestrictedAppRoute(pathname: string): boolean {
  return pathname === '/api/ai/tts'
    || pathname === '/api/ai/recommend-art'
    || pathname === '/api/ai/daily-tarot'
    || pathname === '/api/muse/docent'
    || pathname === '/api/openai/v1/chat/completions'
    || pathname === '/openai/v1/chat/completions'
    || pathname.endsWith('/chat/completions');
}

export function applyRestrictedCors(req: Request, res: Response): void {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : '';
  if (origin && isAllowedAppOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-stainless-sdk-version, x-stainless-os, x-stainless-lang, x-stainless-runtime, x-stainless-runtime-version, x-stainless-helper-method, x-stainless-package-version');
}

export function rejectDisallowedOrigin(req: Request, res: Response): boolean {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : undefined;
  if (isAllowedAppOrigin(origin)) return false;
  res.status(403).json({ error: '이 출처에서는 요청할 수 없습니다.', code: 'ORIGIN_NOT_ALLOWED' });
  return true;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.ip || '';
  return String(raw).split(',')[0].trim() || 'unknown';
}

export function rateLimit(req: Request, res: Response, limit = 20): boolean {
  const now = Date.now();
  const ip = clientIp(req);
  const recent = (hits.get(ip) || []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= limit) {
    res.setHeader('Retry-After', '60');
    res.status(429).json({ error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.', code: 'RATE_LIMITED' });
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export function bodyTooLarge(req: Request, maxChars: number): boolean {
  const declared = Number(req.headers['content-length'] || 0);
  if (Number.isFinite(declared) && declared > maxChars) return true;
  try {
    return JSON.stringify(req.body ?? '').length > maxChars;
  } catch {
    return true;
  }
}

export function guardRestrictedRoute(maxChars: number, options: { rateLimitPerMinute?: number } = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!isRestrictedAppRoute(requestPath(req))) return next();
    applyRestrictedCors(req, res);
    if (req.method === 'OPTIONS') {
      if (rejectDisallowedOrigin(req, res)) return;
      return res.sendStatus(204);
    }
    if (rejectDisallowedOrigin(req, res)) return;
    if (options.rateLimitPerMinute && rateLimit(req, res, options.rateLimitPerMinute)) return;
    if (bodyTooLarge(req, maxChars)) {
      return res.status(413).json({ error: '요청이 너무 큽니다.', code: 'BODY_TOO_LARGE' });
    }
    return next();
  };
}
