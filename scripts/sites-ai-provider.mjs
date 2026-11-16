// Runtime secrets stay server-side. Accept the owner's existing Sites key name.
export function getSitesAIConfig(env) {
  const key = [env.gemini, env.GEMINI_API_KEY, env.GOOGLE_GENAI_API_KEY, env.GOOGLE_API_KEY, env.AI_API_KEY]
    .map(value => String(value || '').trim()).find(value => value && !/^(sk-|xai-|gsk_)/.test(value)) || '';
  return { provider: 'gemini', key };
}

// Return only allowlisted metadata; raw provider errors can contain account/key details.
export function describeOpenAIFailure(response, failure) {
  const error = failure?.error || {};
  const known = new Set(['rate_limit_exceeded', 'insufficient_quota', 'billing_hard_limit_reached', 'invalid_api_key', 'model_not_found', 'account_deactivated']);
  const code = known.has(error.code) ? error.code : known.has(error.type) ? error.type : 'unknown';
  const message = typeof error.message === 'string' ? error.message : '';
  const quota = code === 'insufficient_quota' || code === 'billing_hard_limit_reached' || /exceeded your current quota|insufficient credits|credit balance|billing hard limit/i.test(message);
  const match = /\bLimit[:\s]+([0-9,]+(?:\.[0-9]+)?)/i.exec(message);
  const limit = match ? Number(match[1].replace(/,/g, '')) : undefined;
  const kind = /requests per (?:min|minute)|\bRPM\b/i.test(message) ? 'requests_per_minute' : /tokens per (?:min|minute)|\bTPM\b/i.test(message) ? 'tokens_per_minute' : undefined;
  const numeric = response.headers.get('Retry-After');
  const reset = response.headers.get(kind === 'tokens_per_minute' ? 'x-ratelimit-reset-tokens' : 'x-ratelimit-reset-requests');
  const wait = /try again in\s+([0-9.]+)\s*(ms|s|seconds?|m|minutes?)/i.exec(message);
  let seconds = numeric && /^\d+(?:\.\d+)?$/.test(numeric) ? Number(numeric) : 0;
  if (!seconds && reset) {
    const units = [...reset.matchAll(/([0-9.]+)(ms|s|m|h)/g)];
    seconds = units.reduce((sum, item) => sum + Number(item[1]) * ({ ms: .001, s: 1, m: 60, h: 3600 }[item[2]] || 0), 0);
  }
  if (!seconds && wait) seconds = Number(wait[1]) * (wait[2] === 'ms' ? .001 : /^m/.test(wait[2]) ? 60 : 1);
  return { code, quota, zeroLimit: limit === 0, ...(kind ? { kind } : {}), ...(Number.isFinite(limit) ? { limit } : {}), retryAfterSeconds: Math.max(1, Math.min(86400, Math.ceil(seconds || 15))) };
}
