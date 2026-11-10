import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Request, Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { z } from 'zod';
import {
  MCP_AUTH_MESSAGE,
  logRejectedMcpAuth,
  protectedReading,
  readMcpCredential,
  rpcId,
  verifyMcpBearer,
} from './mcpAuth.ts';
import { fetchDailyTarot, fetchSajuChart, readTarotUsesDailyApi, selectTarotCard, TAROT_SPREAD_GAP } from './mcpReadingGateway.ts';
import { listTarotSpreads, TAROT_THEME_IDS } from './mcpCatalog.ts';
import { MCP_SERVER_VERSION } from './mcpVersion.ts';

const MAX_BODY_CHARS = 65536;

const tarotInput = {
  question: z.string().trim().min(1).max(1000).optional().describe('고민이나 질문. 생략하면 오늘의 타로로 배열을 고릅니다.'),
  theme: z.enum(TAROT_THEME_IDS).optional().describe('앱 배열 주제. 생략하면 질문 문장으로 배열을 고릅니다.'),
  cards: z.array(z.object({
    id: z.string().trim().min(1).max(40).describe('TAROT_DECK 카드 id. 예: major_0'),
    reversed: z.boolean().optional().describe('역방향 여부. 생략하면 정방향'),
  })).max(10).optional().describe('직접 지정할 카드. 생략하면 배열 장수만큼 78장 덱에서 뽑습니다.'),
  narrative: z.enum(['local', 'model']).optional().describe('호환용 필드입니다. MCP는 Gemini를 직접 호출하지 않고, 한 장 오늘의 타로만 /api/ai/daily-tarot로 보냅니다.'),
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

function createReadingServer(): McpServer {
  const server = new McpServer({
    name: 'luckey-readings',
    version: MCP_SERVER_VERSION,
  }, {
    instructions: '타로 원카드는 POST /api/ai/daily-tarot, 사주는 POST /api/saju/chart만 호출합니다. 여러 장 배열과 consult_oracle은 전용 HTTP API가 없어 실패로 반환합니다. Bearer 토큰은 사용자 신원으로 전달하지 않습니다.',
  });

  server.registerTool('list_tarot_spreads', {
    title: '타로 배열 목록',
    description: 'LUCKEY 앱이 지원하는 타로 주제와 배열 장수, 자리 이름을 반환합니다.',
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  }, async () => textResult({ spreads: listTarotSpreads() }));

  server.registerTool('read_tarot', {
    title: '타로 리딩',
    description: '한 장 오늘의 타로는 앱과 같은 POST /api/ai/daily-tarot를 호출합니다. 여러 장 배열은 전용 API가 없어 실패합니다. Bearer 토큰은 리딩 API로 전달하지 않습니다.',
    inputSchema: tarotInput,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  }, async (args) => {
    if (!readTarotUsesDailyApi(args)) return textResult({ error: TAROT_SPREAD_GAP, gap: 'tarot_spread_http_api' }, true);
    const selected = selectTarotCard(args.cards?.[0] ? { cardId: args.cards[0].id, reversed: args.cards[0].reversed } : {});
    if ('error' in selected) return textResult({ error: selected.error }, true);
    const result = await fetchDailyTarot(selected, { concern: args.question });
    if (!result.ok) return textResult({ error: result.message, status: result.status }, true);
    return textResult({ endpoint: '/api/ai/daily-tarot', request: result.payload, reading: result.api });
  });

  server.registerTool('read_saju', {
    title: '사주 리딩',
    description: '앱이 쓰는 사주 계산을 노출한 POST /api/saju/chart를 호출합니다. MCP에서 사주를 다시 계산하지 않습니다.',
    inputSchema: sajuInput,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  }, async (args, extra) => {
    if (!extra.authInfo?.scopes.includes('saju')) return textResult({ error: '인증이 필요합니다.' }, true);
    const result = await fetchSajuChart(args);
    if (!result.ok) return textResult({ error: result.message, status: result.status }, true);
    return textResult({ endpoint: '/api/saju/chart', chart: result.api });
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
  const authorized = verifyMcpBearer(readMcpCredential(req));
  if (protection && !authorized) {
    logRejectedMcpAuth(req);
    jsonRpcError(res, 401, rpcId(body), -32001, MCP_AUTH_MESSAGE);
    return;
  }
  if (authorized) {
    const authed = req as IncomingMessage & { auth?: AuthInfo };
    authed.auth = { token: 'redacted', clientId: 'luckey-mcp', scopes: ['saju', 'daily-tarot'] };
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
