import { createHash, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage } from 'node:http';

const TOKEN_MIN_LENGTH = 24;
const WINDOW_MS = 60 * 60 * 1000;
const budgetHits = new Map<string, number[]>();

export type ProtectedReading = 'saju' | 'model';

function headerValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.join(',');
  return value || '';
}

export function readBearerToken(req: IncomingMessage): string | null {
  const match = headerValue(req.headers.authorization).match(/^Bearer\s+(\S+)\s*$/i);
  return match?.[1] || null;
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
  const call = message as { method?: unknown; params?: { name?: unknown; arguments?: { narrative?: unknown } } };
  if (call.method !== 'tools/call') return null;
  if (call.params?.name === 'read_saju') return 'saju';
  if (call.params?.name === 'read_tarot' && call.params.arguments?.narrative === 'model') return 'model';
  return null;
}

export function protectedReading(body: unknown): ProtectedReading | null {
  const messages = Array.isArray(body) ? body : [body];
  let protection: ProtectedReading | null = null;
  for (const message of messages) {
    const kind = messageProtection(message);
    if (kind === 'model') return 'model';
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

function modelHourlyLimit(): number {
  const parsed = Number(process.env.LUCKEY_MCP_MODEL_HOURLY_LIMIT ?? 12);
  if (!Number.isFinite(parsed)) return 12;
  return Math.min(100, Math.max(1, Math.floor(parsed)));
}

export function takeModelBudget(token: string): boolean {
  const key = createHash('sha256').update(token).digest('hex');
  const now = Date.now();
  const recent = (budgetHits.get(key) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= modelHourlyLimit()) {
    budgetHits.set(key, recent);
    return false;
  }
  recent.push(now);
  budgetHits.set(key, recent);
  if (budgetHits.size > 1000) {
    const oldest = budgetHits.keys().next().value;
    if (oldest) budgetHits.delete(oldest);
  }
  return true;
}

export function resetMcpModelBudgetForTests(): void {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('MCP test hook is disabled');
  }
  budgetHits.clear();
}
