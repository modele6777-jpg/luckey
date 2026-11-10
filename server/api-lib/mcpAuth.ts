import { createHash, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import { readTarotUsesDailyApi } from './mcpReadingGateway.ts';

const TOKEN_MIN_LENGTH = 24;
const QUERY_TOKEN_NAMES = ['key', 'token'] as const;

export const MCP_AUTH_MESSAGE = '인증이 필요합니다. Authorization: Bearer 또는 URL의 key를 확인해 주세요.';

export type ProtectedReading = 'saju' | 'daily-tarot';

function headerValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.join(',');
  return value || '';
}

export function readBearerToken(req: IncomingMessage): string | null {
  const match = headerValue(req.headers.authorization).match(/^Bearer\s+(\S+)\s*$/i);
  return match?.[1] || null;
}

function firstQueryValue(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstQueryValue(item);
      if (found) return found;
    }
  }
  return null;
}

export function readQueryToken(req: IncomingMessage & { query?: unknown; originalUrl?: string; url?: string }): string | null {
  const query = req.query;
  if (query && typeof query === 'object') {
    const record = query as Record<string, unknown>;
    for (const name of QUERY_TOKEN_NAMES) {
      const found = firstQueryValue(record[name]);
      if (found) return found;
    }
  }
  const raw = req.originalUrl || req.url || '';
  if (!raw.includes('?')) return null;
  try {
    const url = new URL(raw, 'http://127.0.0.1');
    for (const name of QUERY_TOKEN_NAMES) {
      const value = url.searchParams.get(name)?.trim();
      if (value) return value;
    }
  } catch { /* malformed URL has no usable token */ }
  return null;
}

/** Bearer when the client sends one. Otherwise `key`, then `token`, from the query string. */
export function readMcpCredential(req: IncomingMessage & { query?: unknown; originalUrl?: string; url?: string }): string | null {
  return readBearerToken(req) || readQueryToken(req);
}

export function redactMcpSecrets(value: string): string {
  return value
    .replace(/([?&#](?:key|token)=)[^&#\s]*/gi, '$1[redacted]')
    .replace(/(Bearer\s+)\S+/gi, '$1[redacted]');
}

export function logRejectedMcpAuth(req: IncomingMessage & { originalUrl?: string; url?: string }): void {
  const raw = req.originalUrl || req.url || '';
  console.warn('[mcp] auth rejected', redactMcpSecrets(raw));
}

export function configuredMcpToken(): string {
  return (process.env.LUCKEY_MCP_TOKEN || '').trim();
}

export function verifyMcpBearer(presented: string | null): boolean {
  const expected = configuredMcpToken();
  if (expected.length < TOKEN_MIN_LENGTH || !presented) return false;
  const actualHash = createHash('sha256').update(presented).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

function messageProtection(message: unknown): ProtectedReading | null {
  if (!message || typeof message !== 'object') return null;
  const call = message as { method?: unknown; params?: { name?: unknown; arguments?: { theme?: unknown; cards?: unknown } } };
  if (call.method !== 'tools/call') return null;
  const name = call.params?.name;
  if (name === 'read_saju' || name === 'get_saju_fortune') return 'saju';
  if (name === 'get_daily_tarot') return 'daily-tarot';
  if (name === 'read_tarot' && readTarotUsesDailyApi(call.params?.arguments)) return 'daily-tarot';
  return null;
}

export function protectedReading(body: unknown): ProtectedReading | null {
  const messages = Array.isArray(body) ? body : [body];
  let protection: ProtectedReading | null = null;
  for (const message of messages) {
    const kind = messageProtection(message);
    if (kind === 'daily-tarot') return 'daily-tarot';
    if (kind === 'saju') protection = 'saju';
  }
  return protection;
}

export function rpcId(body: unknown): string | number | null {
  const message = Array.isArray(body) ? body.find((item) => item && typeof item === 'object' && 'id' in item) : body;
  if (!message || typeof message !== 'object' || !('id' in message)) return null;
  const id = (message as { id?: unknown }).id;
  return typeof id === 'string' || typeof id === 'number' ? id : null;
}
