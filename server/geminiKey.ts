import { createHash } from 'node:crypto';

const ENV_NAMES = ['GEMINI_API_KEY', 'GOOGLE_GENAI_API_KEY', 'GOOGLE_API_KEY', 'AI_API_KEY', 'API_KEY'] as const;
const REVOKED_KEY_SHA256 = '02bc908b91ef41035014545462215b70ab30a25164d0c2a8a260629b41cc3ebc';

function normalizeEnvKey(raw: string | undefined): string {
  let key = (raw || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  return key;
}

export function isRevokedGeminiKey(value: string | undefined): boolean {
  const key = normalizeEnvKey(value);
  if (!key) return false;
  return createHash('sha256').update(key).digest('hex') === REVOKED_KEY_SHA256;
}

/** Gemini credentials from the environment only. A known revoked value is ignored. */
export function getGeminiApiKey(): string {
  for (const name of ENV_NAMES) {
    const key = normalizeEnvKey(process.env[name]);
    if (!key || key.startsWith('sk-') || key.startsWith('xai-') || isRevokedGeminiKey(key)) continue;
    return key;
  }
  return '';
}

/** Error text safe for logs: name and message, with credential-shaped fragments removed. */
export function describeGeminiError(error: unknown): string {
  const name = error instanceof Error ? error.name : 'Error';
  const message = error instanceof Error ? error.message : '';
  const redacted = message
    .replace(/AIza[0-9A-Za-z_-]+/g, '[redacted]')
    .replace(/AQ\.[0-9A-Za-z_-]+/g, '[redacted]')
    .replace(/([?&]key=)[^&\s]+/gi, '$1[redacted]');
  return `${name}: ${redacted}`.slice(0, 400);
}
