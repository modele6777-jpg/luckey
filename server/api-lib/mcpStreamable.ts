import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Request, Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { z } from 'zod';
import {
  protectedReading,
  readBearerToken,
  resetMcpModelBudgetForTests,
  rpcId,
  takeModelBudget,
  verifyMcpBearer,
} from './mcpAuth.ts';
import {
  createSajuReading,
  createTarotReading,
  listTarotSpreads,
  TAROT_THEME_IDS,
} from './mcpReadings.ts';
import { MCP_SERVER_VERSION } from './mcpVersion.ts';

const MAX_BODY_CHARS = 65536;

const tarotInput = {
  question: z.string().trim().min(1).max(1000).optional().describe('고민이나 질문. 생략하면 오늘의 타로로 배열을 고릅니다.'),
  theme: z.enum(TAROT_THEME_IDS).optional().describe('앱 배열 주제. 생략하면 질문 문장으로 배열을 고릅니다.'),
  cards: z.array(z.object({
    id: z.string().trim().min(1).max(40).describe('TAROT_DECK 카드 id. 예: major_0'),
    reversed: z.boolean().optional().describe('역방향 여부. 생략하면 정방향'),
  })).max(10).optional().describe('직접 지정할 카드. 생략하면 배열 장수만큼 78장 덱에서 뽑습니다.'),
  narrative: z.enum(['local', 'model']).optional().describe('local은 앱 결정적 리딩. model은 서버 모델 1회 호출이며 Bearer 인증이 필요합니다.'),
};

const sajuInput = {
  year: z.number().int().min(1900).max(2050).describe('출생 연도'),
  month: z.number().int().min(1).max(12).describe('출생 월'),
  day: z.number().int().min(1).max(31).describe('출생 일'),
  birthtime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().describe('출생 시각 HH:MM. 없으면 시주를 만들지 않습니다.'),
  isLunar: z.boolean().optional().describe('음력 여부. 기본값은 양력'),
  isLeapMonth: z.boolean().optional().describe('윤달 여부. 음력일 때만 사용할 수 있습니다.'),
  gender: z.enum(['male', 'female', 'other']).optional().describe('대운 순행·역행에 필요합니다. 없으면 대운은 미확정'),
};

function textResult(payload: unknown, isError = false) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }],
    ...(isError ? { isError: true } : {}),
  };
}

function isReadingFailure<T extends { ok: boolean }>(result: T): result is Extract<T, { ok: false }> {
  return result.ok === false;
}

function createReadingServer(): McpServer {
  const server = new McpServer({
    name: 'luckey-readings',
    version: MCP_SERVER_VERSION,
  }, {
    instructions: 'LUCKEY 타로와 사주 리딩입니다. list_tarot_spreads와 read_tarot의 local 서사는 인증 없이 앱 덱과 로컬 엔진을 사용합니다. read_saju와 read_tarot narrative=model은 Authorization: Bearer 토큰이 필요합니다. 출생 정보는 저장하지 않습니다.',
  });

  server.registerTool('list_tarot_spreads', {
    title: '타로 배열 목록',
    description: 'LUCKEY 앱이 지원하는 타로 주제와 배열 장수, 자리 이름을 반환합니다.',
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  }, async () => textResult({ spreads: listTarotSpreads() }));

  server.registerTool('read_tarot', {
    title: '타로 리딩',
    description: '78장 덱과 앱 배열법으로 타로를 읽습니다. narrative=model은 인증된 서버 모델 호출이며, 실패하면 같은 카드의 로컬 리딩을 반환합니다.',
    inputSchema: tarotInput,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  }, async (args) => {
    const cards = args.cards?.map((card) => ({ id: card.id || '', reversed: card.reversed }));
    if (cards?.some((card) => !card.id)) return textResult({ error: '카드 id가 필요합니다.' }, true);
    const result = await createTarotReading({
      question: args.question,
      theme: args.theme,
      narrative: args.narrative,
      cards,
    });
    if (isReadingFailure(result)) return textResult({ error: result.message }, true);
    return textResult(result.payload);
  });

  server.registerTool('read_saju', {
    title: '사주 리딩',
    description: '앱의 calculateDetailedSaju로 사주 원국, 오행, 격국, 용신, 세운을 계산합니다. 출생 정보를 받으므로 Bearer 인증이 필요합니다.',
    inputSchema: sajuInput,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  }, async (args, extra) => {
    if (!extra.authInfo?.scopes.includes('saju')) {
      return textResult({ error: '인증이 필요합니다.' }, true);
    }
    const result = createSajuReading(args);
    if (isReadingFailure(result)) return textResult({ error: result.message }, true);
    return textResult(result.payload);
  });

  return server;
}

function requestPath(req: Request): string {
  const raw = (req.path || req.url || '/').split('?')[0];
  return raw.length > 1 && raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

export function isStreamableMcpPost(req: Request): boolean {
  const accept = Array.isArray(req.headers.accept) ? req.headers.accept.join(',') : String(req.headers.accept || '');
  if (!accept.includes('application/json') || !accept.includes('text/event-stream')) return false;
  const path = requestPath(req);
  return path === '/api/mcp' || path === '/mcp' || path === '/';
}

export function isStreamableMcpGet(req: Request): boolean {
  const accept = Array.isArray(req.headers.accept) ? req.headers.accept.join(',') : String(req.headers.accept || '');
  if (!accept.includes('text/event-stream')) return false;
  const path = requestPath(req);
  return path === '/api/mcp' || path === '/mcp';
}

function jsonRpcError(res: Response, status: number, id: string | number | null, code: number, message: string) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(status).json({ jsonrpc: '2.0', id, error: { code, message } });
}

export function handleStreamableMethodNotAllowed(_req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Allow', 'POST');
  return jsonRpcError(res, 405, null, -32000, '이 엔드포인트의 Streamable HTTP는 세션 없는 JSON POST만 받습니다.');
}

export async function handleStreamableMcpPost(req: Request, res: Response): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID');
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

  const body = req.body;
  let serialized = '';
  try {
    serialized = body === undefined ? '' : JSON.stringify(body);
  } catch {
    serialized = '';
  }
  if (serialized.length > MAX_BODY_CHARS) {
    jsonRpcError(res, 413, rpcId(body), -32000, '요청이 너무 큽니다.');
    return;
  }

  const protection = protectedReading(body);
  const presented = readBearerToken(req);
  const authorized = verifyMcpBearer(presented);
  if (protection && !authorized) {
    jsonRpcError(res, 401, rpcId(body), -32001, '인증이 필요합니다. Authorization: Bearer 토큰을 확인해 주세요.');
    return;
  }
  if (protection === 'model') {
    if (!presented || !takeModelBudget(presented)) {
      jsonRpcError(res, 429, rpcId(body), -32029, '모델 리딩 호출 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
  }
  if (authorized) {
    const authed = req as IncomingMessage & { auth?: AuthInfo };
    authed.auth = { token: 'redacted', clientId: 'luckey-mcp', scopes: ['saju', 'model'] };
  }

  const server = createReadingServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  transport.onerror = () => {};
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch {
    if (!res.headersSent) {
      jsonRpcError(res, 500, rpcId(body), -32603, 'MCP 요청을 처리하지 못했습니다.');
    }
  } finally {
    res.on('close', () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });
  }
}

export { resetMcpModelBudgetForTests };
