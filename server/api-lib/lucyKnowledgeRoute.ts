import { createPublicKey, randomUUID, verify as verifySignature } from 'node:crypto';
import express, { type Request, type Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import firebaseConfig from '../../firebase-applet-config.json';
import { hasVerifiedFullTextSource, validateKnowledgeCard, type KnowledgeSource } from '../../src/lib/divination/knowledge/governance';
import type { DivinationToolId } from '../../src/lib/lucyToolRegistry';

const CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const router = express.Router();
const requestTimes = new Map<string, number[]>();
const PROJECT_ID = firebaseConfig.projectId;
const DATABASE_ID = firebaseConfig.firestoreDatabaseId || '(default)';
const PROJECT_ISSUER = `https://securetoken.google.com/${PROJECT_ID}`;
const SOURCES_COLLECTION = 'lucyKnowledgeResearchRuns';
const DAILY_BUDGET_COLLECTION = 'lucyKnowledgeBudgetDays';
const CONTROL_DOCUMENT = 'lucyKnowledgeSettings/control';
const MAX_BODY_TEXT = 6000;
let publicCerts: Record<string, string> = {};
let certsExpireAt = 0;

export interface VerifiedAdmin {
  uid: string;
  claims: Record<string, unknown>;
}
interface BudgetConfig {
  dailyCap: number;
  runCap: number;
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
  maxInputTokens: number;
  maxOutputTokens: number;
}
interface KnowledgeSettings {
  researchEnabled?: boolean;
  aiDraftEnabled?: boolean;
  scheduledResearchEnabled?: boolean;
  dailyBudgetUsd?: number;
  maxPerRunUsd?: number;
}

function decodePart(part: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Record<string, unknown>;
}
async function loadPublicCerts(): Promise<Record<string, string>> {
  if (Date.now() < certsExpireAt && Object.keys(publicCerts).length) return publicCerts;
  const response = await fetch(CERT_URL, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Firebase certificate service returned ${response.status}`);
  publicCerts = await response.json() as Record<string, string>;
  const cacheControl = response.headers.get('cache-control') || '';
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/i)?.[1] ?? 1800);
  certsExpireAt = Date.now() + Math.min(6 * 60 * 60, Math.max(300, maxAge)) * 1000;
  return publicCerts;
}
export async function verifyFirebaseIdToken(token: string, nowSeconds = Math.floor(Date.now() / 1000)): Promise<Record<string, unknown> | null> {
  try {
    if (!token || token.length > 12000) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const header = decodePart(parts[0]);
    const claims = decodePart(parts[1]);
    if (header.alg !== 'RS256' || typeof header.kid !== 'string') return null;
    if (claims.iss !== PROJECT_ISSUER || claims.aud !== PROJECT_ID) return null;
    if (typeof claims.sub !== 'string' || !claims.sub || claims.sub.length > 128) return null;
    if (typeof claims.exp !== 'number' || claims.exp <= nowSeconds) return null;
    if (typeof claims.iat !== 'number' || claims.iat > nowSeconds + 300 || claims.iat < nowSeconds - 3600) return null;
    if (typeof claims.auth_time !== 'number' || claims.auth_time > nowSeconds + 300) return null;
    const certs = await loadPublicCerts();
    const cert = certs[header.kid];
    if (!cert) return null;
    const key = createPublicKey(cert);
    const signed = Buffer.from(`${parts[0]}.${parts[1]}`);
    const signature = Buffer.from(parts[2], 'base64url');
    if (!verifySignature('RSA-SHA256', signed, key, signature)) return null;
    return claims;
  } catch {
    return null;
  }
}
async function requireAdmin(req: Request, res: Response): Promise<VerifiedAdmin | null> {
  const authorization = String(req.headers.authorization ?? '');
  const match = authorization.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    res.status(401).json({ error: '인증이 필요합니다.', code: 'AUTH_REQUIRED' });
    return null;
  }
  const claims = await verifyFirebaseIdToken(match[1]);
  if (!claims) {
    res.status(401).json({ error: '로그인 토큰을 확인할 수 없습니다.', code: 'INVALID_ID_TOKEN' });
    return null;
  }
  if (claims.knowledgeAdmin !== true) {
    res.status(403).json({ error: '지식 관리자 권한이 필요합니다.', code: 'KNOWLEDGE_ADMIN_REQUIRED' });
    return null;
  }
  return { uid: String(claims.sub), claims };
}
function tokenFor(req: Request): string {
  return String(req.headers.authorization).replace(/^Bearer\s+/i, '');
}
function firestoreDocumentUrl(path: string): string {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(PROJECT_ID)}/databases/${encodeURIComponent(DATABASE_ID)}/documents/${path}`;
}
function fieldValue(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  const record = value as Record<string, any>;
  if ('stringValue' in record) return record.stringValue;
  if ('integerValue' in record) return Number(record.integerValue);
  if ('doubleValue' in record) return Number(record.doubleValue);
  if ('booleanValue' in record) return record.booleanValue;
  if ('timestampValue' in record) return record.timestampValue;
  if ('nullValue' in record) return null;
  if ('arrayValue' in record) return (record.arrayValue.values ?? []).map(fieldValue);
  if ('mapValue' in record) return Object.fromEntries(Object.entries(record.mapValue.fields ?? {}).map(([key, item]) => [key, fieldValue(item)]));
  return undefined;
}
function decodedFields(document: any): Record<string, any> {
  return Object.fromEntries(Object.entries(document?.fields ?? {}).map(([key, value]) => [key, fieldValue(value)]));
}
function typedValue(value: unknown): unknown {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(typedValue) } };
  if (value && typeof value === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, typedValue(item)])) } };
  return { nullValue: null };
}
async function firestoreGet(path: string, token: string): Promise<Record<string, any> | null> {
  const response = await fetch(firestoreDocumentUrl(path), { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed (${response.status})`);
  return decodedFields(await response.json());
}
async function firestorePatch(path: string, token: string, value: Record<string, unknown>, precondition: 'must_not_exist' | string): Promise<boolean> {
  const url = new URL(firestoreDocumentUrl(path));
  if (precondition === 'must_not_exist') url.searchParams.set('currentDocument.exists', 'false');
  else url.searchParams.set('currentDocument.updateTime', precondition);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typedValue(item)])) }),
    signal: AbortSignal.timeout(5000),
  });
  return response.ok;
}
async function firestoreUpdate(path: string, token: string, value: Record<string, unknown>): Promise<boolean> {
  const url = new URL(firestoreDocumentUrl(path));
  const fields = Object.keys(value);
  for (const field of fields) url.searchParams.append('updateMask.fieldPaths', field);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, typedValue(item)])) }),
    signal: AbortSignal.timeout(5000),
  });
  return response.ok;
}
async function loadSettings(token: string): Promise<KnowledgeSettings> {
  return await firestoreGet(CONTROL_DOCUMENT, token) as KnowledgeSettings ?? {};
}
function numberEnv(key: string): number {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : 0;
}
export function getBudgetConfig(settings: KnowledgeSettings): BudgetConfig | null {
  const hardDaily = numberEnv('LUCY_KNOWLEDGE_HARD_MAX_DAILY_USD');
  const hardRun = numberEnv('LUCY_KNOWLEDGE_HARD_MAX_RUN_USD');
  const inputUsdPerMillion = numberEnv('LUCY_KNOWLEDGE_INPUT_USD_PER_MILLION');
  const outputUsdPerMillion = numberEnv('LUCY_KNOWLEDGE_OUTPUT_USD_PER_MILLION');
  const maxInputTokens = Math.floor(numberEnv('LUCY_KNOWLEDGE_MAX_INPUT_TOKENS'));
  const maxOutputTokens = Math.floor(numberEnv('LUCY_KNOWLEDGE_MAX_OUTPUT_TOKENS'));
  const dailyCap = Math.min(hardDaily, Number(settings.dailyBudgetUsd) || 0);
  const runCap = Math.min(hardRun, Number(settings.maxPerRunUsd) || 0);
  if (dailyCap <= 0 || runCap <= 0 || !inputUsdPerMillion || !outputUsdPerMillion || !maxInputTokens || !maxOutputTokens || runCap > dailyCap) return null;
  return { dailyCap, runCap, inputUsdPerMillion, outputUsdPerMillion, maxInputTokens, maxOutputTokens };
}
function worstCaseCost(config: BudgetConfig, inputTokens = config.maxInputTokens): number {
  return inputTokens * config.inputUsdPerMillion / 1_000_000 + config.maxOutputTokens * config.outputUsdPerMillion / 1_000_000;
}
function actualCost(config: BudgetConfig, inputTokens: number, outputTokens: number): number {
  return inputTokens * config.inputUsdPerMillion / 1_000_000 + outputTokens * config.outputUsdPerMillion / 1_000_000;
}
function dateKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
async function reserveDailyBudget(uid: string, token: string, config: BudgetConfig, amount: number): Promise<{ ok: boolean; date: string; budgetPath: string; runId: string }> {
  const date = dateKey();
  const budgetPath = `${DAILY_BUDGET_COLLECTION}/${date}`;
  const runId = `${date}_${randomUUID()}`;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const current = await firestoreGet(budgetPath, token);
    const spent = Number(current?.reservedUsd ?? 0);
    if (spent + amount > config.dailyCap + 1e-12) return { ok: false, date, budgetPath, runId };
    const next = { dateKey: date, reservedUsd: spent + amount, updatedAt: new Date().toISOString() };
    // Compare-and-swap: concurrent workers cannot reserve against the same stale daily total.
    const precondition = current ? String((current as any).__updateTime ?? '') : 'must_not_exist';
    if (current && !precondition) {
      // REST fields omit updateTime; fetch the document envelope for its server revision.
      const response = await fetch(firestoreDocumentUrl(budgetPath), { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) });
      if (!response.ok) continue;
      const envelope = await response.json() as { updateTime?: string; fields?: unknown };
      const revised = await firestorePatch(budgetPath, token, next, String(envelope.updateTime ?? ''));
      if (!revised) continue;
    } else if (!current) {
      if (!await firestorePatch(budgetPath, token, next, 'must_not_exist')) continue;
    } else {
      if (!await firestorePatch(budgetPath, token, next, precondition)) continue;
    }
    const run = {
      uid,
      dateKey: date,
      status: 'reserved',
      reservedUsd: amount,
      actualUsd: 0,
      inputTokens: 0,
      outputTokens: 0,
      createdAt: new Date().toISOString(),
      provider: 'gemini',
    };
    if (!await firestorePatch(`${SOURCES_COLLECTION}/${runId}`, token, run, 'must_not_exist')) {
      // Keep the budget reservation rather than risk an unaccounted generation.
      return { ok: false, date, budgetPath, runId };
    }
    return { ok: true, date, budgetPath, runId };
  }
  return { ok: false, date, budgetPath, runId };
}
async function finalizeBudget(
  token: string,
  config: BudgetConfig,
  reservation: { date: string; budgetPath: string; runId: string },
  reserved: number,
  actual: number,
  inputTokens: number,
  outputTokens: number,
  status: string,
): Promise<boolean> {
  try {
  // Persist run usage first. If this fails, retain the full reservation (conservative accounting).
  const runOk = await firestoreUpdate(`${SOURCES_COLLECTION}/${reservation.runId}`, token, {
    status, actualUsd: actual, inputTokens, outputTokens, completedAt: new Date().toISOString(),
  });
  if (!runOk) return false;
  const adjustment = reserved - actual;
  if (!adjustment) return true;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const url = firestoreDocumentUrl(reservation.budgetPath);
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return false;
    const envelope = await response.json() as { fields?: any; updateTime?: string };
    const current = Number(fieldValue(envelope.fields?.reservedUsd) ?? reserved);
    const next = { dateKey: reservation.date, reservedUsd: Math.max(0, current - adjustment), updatedAt: new Date().toISOString() };
    if (await firestorePatch(reservation.budgetPath, token, next, String(envelope.updateTime ?? ''))) return true;
  }
  return false;
  } catch {
    return false;
  }
}
function rateLimit(uid: string): boolean {
  const now = Date.now();
  const current = (requestTimes.get(uid) ?? []).filter(time => now - time < 60_000);
  if (current.length >= 12) return false;
  current.push(now);
  requestTimes.set(uid, current);
  return true;
}
const ENGINE_IDS = new Set<DivinationToolId>([
  'saju', 'astrology', 'ziwei', 'tarot', 'sukuyo', 'mahabote', 'vedic', 'liuren', 'qimen',
  'kabbalah', 'iching', 'thai_astrology', 'tojeong', 'kyusei', 'taiyi',
]);
function validSource(source: any): source is KnowledgeSource {
  if (!source || typeof source !== 'object') return false;
  if (typeof source.title !== 'string' || !source.title.trim() || source.title.length > 240) return false;
  if (!Array.isArray(source.authors) || source.authors.length > 16 || source.authors.some((author: unknown) => typeof author !== 'string' || author.length > 120)) return false;
  if (typeof source.url !== 'string' || !/^https:\/\//i.test(source.url) || source.url.length > 1000) return false;
  if (source.doi && (typeof source.doi !== 'string' || source.doi.length > 150)) return false;
  if (!['journal', 'book', 'primary_text', 'reference', 'other'].includes(source.sourceKind)) return false;
  if (!['unreviewed', 'metadata_checked', 'original_text_checked'].includes(source.verification)) return false;
  if (!['full_text', 'abstract_only', 'metadata_only', 'unavailable'].includes(source.access)) return false;
  return Boolean(source.doi || source.url);
}
function metadataOnlySource(item: any): KnowledgeSource | null {
  const title = Array.isArray(item?.title) ? String(item.title[0] ?? '') : '';
  if (!title) return null;
  const authorList = Array.isArray(item.author) ? item.author : [];
  const authors = authorList.map((author: any) => [author.given, author.family].filter(Boolean).join(' ')).filter(Boolean).slice(0, 16);
  const yearParts = item.published?.['date-parts']?.[0] ?? item.created?.['date-parts']?.[0] ?? [];
  const year = yearParts[0] ? String(yearParts[0]) : undefined;
  const doi = typeof item.DOI === 'string' ? item.DOI : undefined;
  const url = doi ? `https://doi.org/${doi}` : (typeof item.URL === 'string' && item.URL.startsWith('https://') ? item.URL : '');
  if (!url) return null;
  return {
    title: title.slice(0, 240), authors, publication: Array.isArray(item['container-title']) ? String(item['container-title'][0] ?? '').slice(0, 240) : undefined,
    year, doi, url, sourceKind: item.type === 'book' ? 'book' : 'journal', verification: 'unreviewed', access: 'metadata_only',
  };
}
function validEngine(id: unknown): id is DivinationToolId {
  return typeof id === 'string' && ENGINE_IDS.has(id as DivinationToolId);
}

router.get('/status', async (req, res) => {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  try {
    const settings = await loadSettings(tokenFor(req));
    const budget = getBudgetConfig(settings);
    const enabled = settings.researchEnabled === true;
    const aiDraftReady = enabled && settings.aiDraftEnabled === true && Boolean(budget) && Boolean(process.env.GEMINI_API_KEY);
    res.json({
      ok: true,
      researchEnabled: enabled,
      sourceSearchAvailable: enabled,
      aiDraftAvailable: aiDraftReady,
      aiBlockReason: aiDraftReady ? null : !enabled ? '관리자 설정에서 공개 문헌 연구를 켜야 합니다.' : !budget ? '서버 비용 상한·요금·토큰 한도가 모두 구성되어야 AI 초안을 사용할 수 있습니다.' : !process.env.GEMINI_API_KEY ? '서버 AI 키가 설정되지 않았습니다.' : '관리자 설정에서 AI 초안 생성을 켜야 합니다.',
      scheduledResearchAvailable: false,
      scheduledResearchEnabled: false,
      scheduledBlockReason: '정기 연구 작업자가 구현·운영 검증되지 않아 기본 비활성 상태입니다.',
      hardDailyCapUsd: numberEnv('LUCY_KNOWLEDGE_HARD_MAX_DAILY_USD'),
      configuredDailyCapUsd: budget?.dailyCap ?? 0,
      maxPerRunUsd: budget?.runCap ?? 0,
      costLedger: 'Firestore CAS reserve-before-call',
    });
  } catch (error) {
    res.status(503).json({ error: '지식 연구 설정을 안전하게 읽을 수 없습니다.', code: 'KNOWLEDGE_STORAGE_UNAVAILABLE' });
  }
});

router.post('/search', async (req, res) => {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  if (!rateLimit(admin.uid)) return res.status(429).json({ error: '검색 요청이 많습니다. 잠시 후 다시 시도해 주세요.', code: 'RATE_LIMIT' });
  try {
    const settings = await loadSettings(tokenFor(req));
    if (settings.researchEnabled !== true) return res.status(403).json({ error: '관리자 설정에서 연구 기능을 먼저 켜야 합니다.', code: 'RESEARCH_DISABLED' });
    const { engineId, query: rawQuery, rows: rawRows } = req.body ?? {};
    if (!validEngine(engineId)) return res.status(400).json({ error: '엔진 ID가 올바르지 않습니다.', code: 'INVALID_ENGINE' });
    const queryText = String(rawQuery ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 120);
    if (queryText.length < 3) return res.status(400).json({ error: '검색어는 3자 이상 입력해 주세요.', code: 'INVALID_QUERY' });
    const rows = Math.max(1, Math.min(8, Math.floor(Number(rawRows) || 5)));
    const url = new URL('https://api.crossref.org/works');
    url.searchParams.set('query', queryText);
    url.searchParams.set('rows', String(rows));
    url.searchParams.set('select', 'DOI,title,author,published,created,container-title,publisher,URL,type');
    const response = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'LuckeyKnowledgeResearch/1.0' }, signal: AbortSignal.timeout(7000) });
    if (!response.ok) return res.status(502).json({ error: 'Crossref 서지 검색이 일시적으로 실패했습니다.', code: 'SOURCE_PROVIDER_ERROR' });
    const body = await response.json() as { message?: { items?: any[]; 'total-results'?: number } };
    const candidates = (body.message?.items ?? []).map(metadataOnlySource).filter(Boolean);
    res.json({ engineId, query: queryText, provider: 'Crossref REST', sourceAccess: 'metadata_only', total: Number(body.message?.['total-results'] ?? candidates.length), candidates });
  } catch {
    res.status(502).json({ error: '출처 검색을 완료하지 못했습니다. 상담 기능에는 영향을 주지 않았습니다.', code: 'SOURCE_PROVIDER_ERROR' });
  }
});

router.post('/draft', async (req, res) => {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  if (!rateLimit(admin.uid)) return res.status(429).json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.', code: 'RATE_LIMIT' });
  let reservation: { ok: boolean; date: string; budgetPath: string; runId: string } | null = null;
  let config: BudgetConfig | null = null;
  let reserved = 0;
  const token = tokenFor(req);
  try {
    const settings = await loadSettings(token);
    if (settings.researchEnabled !== true || settings.aiDraftEnabled !== true) return res.status(403).json({ error: '연구 및 AI 초안 기능을 관리자 설정에서 켜야 합니다.', code: 'AI_DRAFT_DISABLED' });
    config = getBudgetConfig(settings);
    if (!config || !process.env.GEMINI_API_KEY) return res.status(503).json({ error: '서버 예산·단가·토큰 상한 또는 AI 키가 준비되지 않았습니다. 비용이 발생하지 않았습니다.', code: 'AI_DRAFT_NOT_CONFIGURED' });
    const { engineId, source, evidenceNotes, school } = req.body ?? {};
    if (!validEngine(engineId)) return res.status(400).json({ error: '엔진 ID가 올바르지 않습니다.', code: 'INVALID_ENGINE' });
    if (!Array.isArray(source) || source.length < 1 || source.length > 8 || source.some((item: unknown) => !validSource(item))) {
      return res.status(400).json({ error: '제목·저자·연도·공식 URL을 갖춘 출처 메타데이터가 필요합니다.', code: 'INVALID_SOURCES' });
    }
    if (!hasVerifiedFullTextSource(source)) {
      return res.status(422).json({ error: 'AI 초안은 전문에 접근해 원문을 직접 대조한 출처가 있을 때만 만들 수 있습니다.', code: 'SOURCE_NOT_VERIFIED' });
    }
    const notes = String(evidenceNotes ?? '').trim();
    if (notes.length < 80 || notes.length > MAX_BODY_TEXT) return res.status(400).json({ error: '원문 대조 근거를 80~6,000자로 기록해 주세요.', code: 'INVALID_EVIDENCE_NOTES' });
    if (String(school ?? '').length > 120) return res.status(400).json({ error: '학파 이름이 너무 깁니다.', code: 'INVALID_SCHOOL' });
    const prompt = [
      'Create a concise divination interpretation knowledge card in Korean as JSON only.',
      'Use only the supplied operator-verified evidence notes and bibliographic metadata. Do not add outside facts, predictions, invented quotations, methods, authors, or sources.',
      'Preserve the named school and any disagreements as separate qualifications; never describe divination as scientifically proven. Keep the card provisional and suitable for mandatory human approval.',
      'Return exactly these fields: title, core, use, caution. Each field is plain text. Respect lengths: title 120, core 700, use 500, caution 500 characters.',
      `Engine ID: ${engineId}; school: ${String(school ?? '').trim() || 'not specified'}.`,
      `Source metadata (not proof of full-text access): ${JSON.stringify(source.map((item: KnowledgeSource) => ({ title: item.title, authors: item.authors, publication: item.publication, year: item.year, doi: item.doi, url: item.url, access: item.access, verification: item.verification, school: item.school })))}`,
      `Operator evidence notes: ${notes}`,
    ].join('\n\n');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = process.env.LUCY_KNOWLEDGE_MODEL || 'gemini-3.1-flash-lite';
    const tokenCountResult = await ai.models.countTokens({ model, contents: prompt });
    const inputTokenCount = Math.max(0, Number(tokenCountResult.totalTokens ?? 0));
    if (!inputTokenCount || inputTokenCount > config.maxInputTokens) {
      return res.status(413).json({ error: '요청이 설정된 입력 토큰 상한을 넘어서 AI 생성을 차단했습니다. 비용이 발생하지 않았습니다.', code: 'INPUT_TOKEN_LIMIT', inputTokens: inputTokenCount, maxInputTokens: config.maxInputTokens });
    }
    reserved = worstCaseCost(config, inputTokenCount);
    if (reserved > config.runCap) return res.status(403).json({ error: '이 요청의 최대 추정 비용이 회당 상한보다 큽니다. 설정을 늘리지 않고 작업을 차단했습니다.', code: 'RUN_BUDGET_TOO_LOW', worstCaseUsd: reserved });
    reservation = await reserveDailyBudget(admin.uid, token, config, reserved);
    if (!reservation.ok) return res.status(429).json({ error: '오늘의 예산 잔액이 부족하거나 사용량 원장을 안전하게 갱신할 수 없습니다.', code: 'DAILY_BUDGET_EXHAUSTED' });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json', maxOutputTokens: config.maxOutputTokens },
    });
    const usage = response.usageMetadata as any;
    const hasUsage = Number.isFinite(usage?.promptTokenCount) && Number.isFinite(usage?.candidatesTokenCount) && Number(usage.promptTokenCount) > 0;
    const inputTokens = hasUsage ? Math.max(0, Number(usage.promptTokenCount)) : 0;
    const outputTokens = hasUsage ? Math.max(0, Number(usage.candidatesTokenCount)) : 0;
    const cost = hasUsage ? actualCost(config, inputTokens, outputTokens) : reserved;
    const finalized = await finalizeBudget(token, config, reservation, reserved, cost, inputTokens, outputTokens, hasUsage ? 'completed' : 'failed_reserved');
    if (!finalized) return res.status(503).json({ error: '사용량 원장을 확정하지 못했습니다. 비용이 청구됐을 수 있어 최대 예약액을 유지하고 초안은 저장하지 않았습니다.', code: 'USAGE_LEDGER_FINALIZE_FAILED' });
    if (!hasUsage) return res.status(502).json({ error: 'AI 사용량을 확인할 수 없어 최대 예약액을 원장에 남기고 초안을 차단했습니다.', code: 'USAGE_METADATA_MISSING' });
    if (cost > reserved + 1e-12 || cost > config.runCap + 1e-12) {
      return res.status(502).json({ error: '실제 사용량이 회당 안전 예산을 넘었습니다. 사용량은 원장에 기록했고 초안 저장은 차단했습니다.', code: 'ACTUAL_USAGE_OVER_BUDGET', usage: { inputTokens, outputTokens, costUsd: cost } });
    }
    const rawText = response.text ?? '';
    let generated: Record<string, unknown>;
    try {
      generated = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      return res.status(502).json({ error: '생성 결과가 JSON 형식이 아닙니다. 비용은 원장에 기록했고 상담에는 등록하지 않았습니다.', code: 'DRAFT_JSON_INVALID', usage: { inputTokens, outputTokens, costUsd: cost } });
    }
    const sourceIds = source.map((item: KnowledgeSource, index: number) => item.doi || new URL(item.url).pathname.replace(/\W/g, '') || `source-${index + 1}`);
    const card = {
      id: 'pending', engineId, theme: 'knowledge-growth', title: String(generated.title ?? '').trim(),
      core: String(generated.core ?? '').trim(), use: String(generated.use ?? '').trim(), caution: String(generated.caution ?? '').trim(),
      school: String(school ?? '').trim() || undefined, sourceIds, sources: source, status: 'pending_review' as const,
      active: false, version: 0, createdAt: new Date().toISOString(),
    };
    if (!validateKnowledgeCard(card)) return res.status(502).json({ error: '생성 결과가 카드 검증을 통과하지 못했습니다. 상담 데이터에 등록하지 않았습니다.', code: 'DRAFT_SCHEMA_INVALID', usage: { inputTokens, outputTokens, costUsd: cost } });
    res.json({ draft: card, usage: { inputTokens, outputTokens, costUsd: cost }, runId: reservation.runId, requiresHumanApproval: true });
  } catch (error) {
    if (reservation?.ok && config) {
      // If provider failed before returning usage, retain worst-case reservation for safety.
      await finalizeBudget(token, config, reservation, reserved, reserved, 0, 0, 'failed_reserved');
    }
    res.status(502).json({ error: 'AI 초안을 만들지 못했습니다. 원인과 무관하게 미승인 자료를 상담에 넣지 않았습니다.', code: 'AI_DRAFT_FAILED' });
  }
});

export const lucyKnowledgeRouter = router;
