/**
 * Google service-account access tokens (OAuth 2.0 JWT bearer flow) with WebCrypto, so it
 * runs on Node and Workers. Needed for Cloud Gemini-TTS, which refuses plain API keys
 * (403 IAM_PERMISSION_DENIED). Credentials: the service-account JSON in
 * GOOGLE_CLOUD_TTS_CREDENTIALS. Nothing secret is ever returned or logged.
 */
export interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id?: string;
  token_uri?: string;
}

const SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
const DEFAULT_TOKEN_URI = 'https://oauth2.googleapis.com/token';
let cached: { email: string; token: string; expiresAt: number } | null = null;

/** Why the credentials can't be used (no secret content): for the status endpoint. */
export function serviceAccountProblem(raw: string | undefined): 'ok' | 'missing' | 'invalid-json' | 'missing-fields' {
  const text = String(raw || '').trim();
  if (!text) return 'missing';
  let parsed: any;
  try { parsed = JSON.parse(text.startsWith('{') ? text : atob(text)); } catch { return 'invalid-json'; }
  return typeof parsed?.client_email === 'string' && typeof parsed?.private_key === 'string' ? 'ok' : 'missing-fields';
}

export function readServiceAccount(raw: string | undefined): ServiceAccount | null {
  const text = String(raw || '').trim();
  if (!text) return null;
  try {
    const parsed = JSON.parse(text.startsWith('{') ? text : atob(text));
    if (typeof parsed?.client_email !== 'string' || typeof parsed?.private_key !== 'string') return null;
    return { ...parsed, private_key: parsed.private_key.replace(/\\n/g, '\n') };
  } catch {
    return null;
  }
}

function base64Url(bytes: Uint8Array | string): string {
  const binary = typeof bytes === 'string'
    ? unescape(encodeURIComponent(bytes))
    : Array.from(bytes, b => String.fromCharCode(b)).join('');
  return btoa(binary).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function pemToPkcs8(pem: string): ArrayBuffer {
  const body = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s+/g, '');
  const raw = atob(body);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

export async function signServiceAccountJwt(account: ServiceAccount, nowSeconds = Math.floor(Date.now() / 1000)): Promise<string> {
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64Url(JSON.stringify({
    iss: account.client_email,
    scope: SCOPE,
    aud: account.token_uri || DEFAULT_TOKEN_URI,
    iat: nowSeconds,
    exp: nowSeconds + 3600,
  }));
  const key = await crypto.subtle.importKey('pkcs8', pemToPkcs8(account.private_key), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${header}.${claims}`)));
  return `${header}.${claims}.${base64Url(signature)}`;
}

export async function getServiceAccountToken(account: ServiceAccount, fetchApi: typeof fetch = fetch): Promise<string> {
  const now = Date.now();
  if (cached && cached.email === account.client_email && cached.expiresAt - 60_000 > now) return cached.token;
  const assertion = await signServiceAccountJwt(account);
  const response = await fetchApi(account.token_uri || DEFAULT_TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${encodeURIComponent(assertion)}`,
  });
  if (!response.ok) {
    let reason = '';
    try { reason = String((await response.json() as any)?.error || ''); } catch { /* not JSON */ }
    throw Object.assign(new Error('Google 서비스 계정 인증에 실패했습니다.'), { status: 401, providerStatus: response.status, providerCode: (reason || 'TOKEN_REFUSED').slice(0, 40) });
  }
  const body = await response.json() as { access_token?: string; expires_in?: number };
  if (!body.access_token) throw Object.assign(new Error('Google 인증 응답이 비어 있습니다.'), { status: 401, providerCode: 'EMPTY_TOKEN' });
  cached = { email: account.client_email, token: body.access_token, expiresAt: now + (Number(body.expires_in) || 3600) * 1000 };
  return body.access_token;
}

export function resetServiceAccountTokenCache() {
  cached = null;
}
