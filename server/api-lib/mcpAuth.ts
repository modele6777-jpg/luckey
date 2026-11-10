import { createHash, timingSafeEqual } from 'node:crypto';
import { readTarotUsesDailyApi } from './mcpReadingGateway.ts';

export const TOKEN_MIN_LENGTH = 16;
const QUERY_TOKEN_NAMES = ['key', 'token'] as const;

export type McpAuthReason = 'env_missing' | 'env_too_short' | 'no_credential' | 'mismatch';
export type McpCredentialSource = 'bearer' | 'query-key' | 'query-token' | 'none';

export interface McpAuthEvaluation {
  ok: boolean;
  reason: McpAuthReason | null;
  presentedLength: number;
  expectedLength: number;
  matchesAfterNormalization: boolean;
}

export const MCP_AUTH_MESSAGE = '인증이 필요합니다. Authorization: Bearer 또는 URL의 key를 확인해 주세요.';

export type ProtectedReading = 'saju' | 'daily-tarot';

function headerValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.join(',');
  return value || '';
}

type McpAuthRequest = {
  headers: { authorization?: string | string[] | undefined };
  url?: string;
  originalUrl?: string;
  query?: unknown;
};

export function readBearerToken(req: McpAuthRequest): string | null {
  const match = headerValue(req.headers.authorization).match(/^Bearer\s+(\S+)\s*$/i);
  return match?.[1] || null;
}

function firstQueryValue(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstQueryValue(item);
      if (found) return found;
    }
  }
  return null;
}

function queryParam(req: McpAuthRequest, name: 'key' | 'token'): string | null {
  const query = req.query;
  if (query && typeof query === 'object') {
    const found = firstQueryValue((query as Record<string, unknown>)[name]);
    if (found) return found;
  }
  const raw = req.originalUrl || req.url || '';
  if (!raw.includes('?')) return null;
  try {
    const value = new URL(raw, 'http://127.0.0.1').searchParams.get(name);
    if (value && value.trim()) return value;
  } catch { /* malformed URL has no usable token */ }
  return null;
}

export function readQueryToken(req: McpAuthRequest): string | null {
  for (const name of QUERY_TOKEN_NAMES) {
    const found = queryParam(req, name);
    if (found) return found;
  }
  return null;
}

export function describeMcpCredential(req: McpAuthRequest): { source: McpCredentialSource; value: string | null } {
  const bearer = readBearerToken(req);
  if (bearer) return { source: 'bearer', value: bearer };
  const key = queryParam(req, 'key');
  if (key) return { source: 'query-key', value: key };
  const token = queryParam(req, 'token');
  if (token) return { source: 'query-token', value: token };
  return { source: 'none', value: null };
}

/** Bearer when the client sends one. Otherwise `key`, then `token`, from the query string. */
export function readMcpCredential(req: McpAuthRequest): string | null {
  return describeMcpCredential(req).value;
}

export function redactMcpSecrets(value: string): string {
  return value
    .replace(/([?&#](?:key|token)=)[^&#]*/gi, '$1[redacted]')
    .replace(/(Bearer\s+)\S+/gi, '$1[redacted]');
}

function stripSurroundingQuotes(value: string): string {
  if (value.length < 2) return value;
  const pairs: Record<string, string> = { '"': '"', "'": "'" };
  const closer = pairs[value[0]];
  if (closer && value.endsWith(closer)) return value.slice(1, -1).trim();
  return value;
}

function normalizeStored(value: string): string {
  return stripSurroundingQuotes(value.trim());
}

function safeDecode(value: string): string | null {
  if (!value.includes('%')) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function credentialCandidates(raw: string): string[] {
  const seeds = [raw];
  const decoded = safeDecode(raw);
  if (decoded !== null) seeds.push(decoded);
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (value: string) => {
    if (seen.has(value)) return;
    seen.add(value);
    out.push(value);
  };
  for (const seed of seeds) {
    const trimmed = seed.trim();
    const forms = [trimmed, stripSurroundingQuotes(trimmed)];
    for (const form of forms) {
      add(form);
      if (form.includes(' ')) add(form.replaceAll(' ', '+'));
    }
  }
  return out;
}

function hashesEqual(actual: string, expected: string): boolean {
  const actualHash = createHash('sha256').update(actual).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

export function configuredMcpToken(): string {
  return normalizeStored(process.env.LUCKEY_MCP_TOKEN || '');
}

export function evaluateMcpAuth(presented: string | null): McpAuthEvaluation {
  const expected = configuredMcpToken();
  const presentedValue = presented && presented.trim() ? presented : null;
  const presentedLength = presentedValue ? presentedValue.length : 0;
  const candidates = presentedValue ? credentialCandidates(presentedValue) : [];
  let matchesAfterNormalization = false;
  if (expected && candidates.length) {
    for (const candidate of candidates) {
      const matched = hashesEqual(candidate, expected);
      matchesAfterNormalization = matched || matchesAfterNormalization;
    }
  }
  const base = { presentedLength, expectedLength: expected.length, matchesAfterNormalization };
  if (!expected) return { ok: false, reason: 'env_missing', ...base };
  if (expected.length < TOKEN_MIN_LENGTH) return { ok: false, reason: 'env_too_short', ...base };
  if (!presentedValue) return { ok: false, reason: 'no_credential', ...base };
  if (!matchesAfterNormalization) return { ok: false, reason: 'mismatch', ...base };
  return { ok: true, reason: null, ...base };
}

export function verifyMcpBearer(presented: string | null): boolean {
  return evaluateMcpAuth(presented).ok;
}

export function logRejectedMcpAuth(req: McpAuthRequest): void {
  const detail = describeMcpCredential(req);
  const evaluation = evaluateMcpAuth(detail.value);
  if (evaluation.ok) return;
  const raw = req.originalUrl || req.url || '';
  console.warn('[mcp] auth rejected', redactMcpSecrets(raw), {
    reason: evaluation.reason,
    source: detail.source,
    presentedLength: evaluation.presentedLength,
    expectedLength: evaluation.expectedLength,
    matchesAfterNormalization: evaluation.matchesAfterNormalization,
  });
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
