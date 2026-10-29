// Runtime secrets stay server-side. Accept the owner's existing Sites key name.
export function getSitesAIConfig(env) {
  const openai = String(env.OPENAI_API_KEY || env['open ai'] || env.openai || '').trim();
  const gemini = String(env.gemini || env.GEMINI_API_KEY || env.GOOGLE_GENAI_API_KEY || '').trim();
  const requested = String(env.AI_PROVIDER || '').toLowerCase();
  const provider = requested === 'gemini' ? 'gemini' : requested === 'openai' || openai ? 'openai' : 'gemini';
  return { provider, key: provider === 'openai' ? openai : gemini };
}
