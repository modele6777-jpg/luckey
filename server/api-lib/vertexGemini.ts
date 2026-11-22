/**
 * Gemini through Vertex AI (Google Cloud), so Google Cloud billing/credits pay for it instead of the
 * AI Studio free-tier quota. Authenticates with the same service account as Cloud TTS
 * (GOOGLE_CLOUD_TTS_CREDENTIALS, or VERTEX_CREDENTIALS if set). Project: VERTEX_PROJECT_ID or the
 * service account's project_id. Location: VERTEX_LOCATION (default "global").
 * Nothing secret is ever returned or logged.
 */
import { getServiceAccountToken, readServiceAccount, type ServiceAccount } from './googleServiceAccount.ts';
import { sanitizeReason } from './geminiHealth.ts';

export type VertexProblem = 'api-disabled' | 'permission' | 'billing-disabled' | 'model-unavailable' | 'quota' | 'no-credentials' | 'timeout' | 'other';

export interface VertexSetup {
  account: ServiceAccount;
  project: string;
  location: string;
}

export function getVertexSetup(env: Record<string, string | undefined> = process.env): VertexSetup | null {
  const account = readServiceAccount(env.VERTEX_CREDENTIALS || env.GOOGLE_CLOUD_TTS_CREDENTIALS);
  if (!account) return null;
  const project = String(env.VERTEX_PROJECT_ID || account.project_id || '').trim();
  if (!project) return null;
  return { account, project, location: String(env.VERTEX_LOCATION || 'global').trim() || 'global' };
}

function endpoint(setup: VertexSetup, model: string): string {
  const host = setup.location === 'global' ? 'aiplatform.googleapis.com' : `${setup.location}-aiplatform.googleapis.com`;
  return `https://${host}/v1/projects/${encodeURIComponent(setup.project)}/locations/${encodeURIComponent(setup.location)}/publishers/google/models/${encodeURIComponent(model)}:generateContent`;
}

export function classifyVertexError(status: number, body: string): VertexProblem {
  const lower = body.toLowerCase();
  if (/billing_disabled|billing (is )?(not enabled|disabled)|requires billing/.test(lower)) return 'billing-disabled';
  if (/service_disabled|has not been used in project|is disabled|api not enabled|accessnotconfigured/.test(lower)) return 'api-disabled';
  if (status === 429 || /resource_exhausted|quota/.test(lower)) return 'quota';
  if (status === 404 || /not found|was not found|publisher model/.test(lower)) return 'model-unavailable';
  if (status === 401 || status === 403 || /permission_denied|iam_permission/.test(lower)) return 'permission';
  return 'other';
}

export class VertexError extends Error {
  constructor(message: string, readonly status: number, readonly problem: VertexProblem) { super(message); }
}

/** Converts the @google/genai style config into the Vertex REST body. */
function buildBody(contents: unknown, config: any) {
  const generationConfig: Record<string, unknown> = {};
  for (const key of ['temperature', 'maxOutputTokens', 'responseMimeType', 'topP', 'topK', 'thinkingConfig'] as const) {
    if (config?.[key] !== undefined) generationConfig[key] = config[key];
  }
  const system = config?.systemInstruction;
  return {
    contents,
    ...(system ? { systemInstruction: typeof system === 'string' ? { parts: [{ text: system }] } : system } : {}),
    ...(Object.keys(generationConfig).length ? { generationConfig } : {}),
  };
}

export async function vertexGenerateText(model: string, contents: unknown, config: any = {}, options: { timeoutMs?: number; setup?: VertexSetup | null } = {}): Promise<string> {
  const setup = options.setup === undefined ? getVertexSetup() : options.setup;
  if (!setup) throw new VertexError('Vertex AI credentials are not configured', 0, 'no-credentials');
  const token = await getServiceAccountToken(setup.account);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 30000);
  try {
    const response = await fetch(endpoint(setup, model), {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(buildBody(contents, config)),
      signal: controller.signal,
    });
    const raw = await response.text();
    if (!response.ok) {
      throw new VertexError(sanitizeReason(raw), response.status, classifyVertexError(response.status, raw));
    }
    const data = JSON.parse(raw);
    const text = (data?.candidates?.[0]?.content?.parts || []).map((part: any) => part?.text || '').join('');
    if (!text.trim()) throw new VertexError(`Empty response from Vertex ${model}`, 200, 'other');
    return text;
  } catch (err: any) {
    if (err instanceof VertexError) throw err;
    if (err?.name === 'AbortError') throw new VertexError(`Vertex timeout on ${model}`, 0, 'timeout');
    throw new VertexError(sanitizeReason(String(err?.message || err)), 0, 'other');
  } finally {
    clearTimeout(timer);
  }
}

export interface VertexProbeResult { model: string; ok: boolean; status?: number; problem?: VertexProblem; reason?: string }

export async function probeVertex(models: string[]): Promise<{ configured: boolean; project?: string; location?: string; results: VertexProbeResult[] }> {
  const setup = getVertexSetup();
  if (!setup) return { configured: false, results: [] };
  const results = await Promise.all(models.map(async (model): Promise<VertexProbeResult> => {
    try {
      await vertexGenerateText(model, [{ role: 'user', parts: [{ text: 'OK라고만 답해.' }] }], { maxOutputTokens: 16 }, { timeoutMs: 15000, setup });
      return { model, ok: true };
    } catch (err: any) {
      return { model, ok: false, status: err?.status, problem: err?.problem || 'other', reason: sanitizeReason(String(err?.message || err)) };
    }
  }));
  // Show only the start of the project id: enough to recognise the project on a public status page.
  const project = setup.project.length > 6 ? `${setup.project.slice(0, 6)}…` : setup.project;
  return { configured: true, project, location: setup.location, results };
}
