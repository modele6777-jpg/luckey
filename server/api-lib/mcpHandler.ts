import type { Request, Response } from 'express';
import { MCP_SERVER_VERSION } from './mcpVersion.ts';
import { MCP_AUTH_MESSAGE, logRejectedMcpAuth, protectedReading, readMcpCredential, verifyMcpBearer } from './mcpAuth.ts';
import { fetchDailyTarot, fetchSajuChart, ORACLE_GAP, selectTarotCard } from './mcpReadingGateway.ts';
import { handleStreamableMcpPost, isStreamableMcpGet, isStreamableMcpPost } from './mcpStreamable.ts';
export { handleStreamableMethodNotAllowed } from './mcpStreamable.ts';
// TTS is loaded only when the MCP TTS tool is called.

interface SseClient {
  id: string;
  res: Response;
  createdAt: number;
  authorized: boolean;
}

const sseClients = new Map<string, SseClient>();

// Clean up stale SSE connections periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, client] of sseClients.entries()) {
    if (now - client.createdAt > 3600000) {
      // 1 hour timeout
      try {
        client.res.end();
      } catch (_) {}
      sseClients.delete(id);
    }
  }
}, 60000).unref();

export const MCP_TOOLS = [
  {
    name: 'get_daily_tarot',
    description: '카드 한 장을 고른 뒤 앱과 같은 POST /api/ai/daily-tarot 응답을 반환합니다. MCP에서 리딩 문장을 만들지 않습니다.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '내담자 이름 (선택, 기본값: 질문자)',
        },
        concern: {
          type: 'string',
          description: '오늘의 고민이나 질문 (선택)',
        },
        cardId: {
          type: 'string',
          description: '선택한 78장 덱 카드 id. 생략하면 덱에서 한 장을 골라 /api/ai/daily-tarot에 전달합니다.',
        },
        reversed: {
          type: 'boolean',
          description: '선택 카드의 역방향 여부',
        },
      },
    },
  },
  {
    name: 'get_saju_fortune',
    description: '출생 정보를 POST /api/saju/chart로 보내 앱과 같은 사주 계산 결과를 반환합니다. MCP에서 사주를 다시 계산하지 않습니다.',
    inputSchema: {
      type: 'object',
      properties: {
        year: { type: 'number', description: '출생 연도 (예: 1995)' },
        month: { type: 'number', description: '출생 월 (1~12)' },
        day: { type: 'number', description: '출생 일 (1~31)' },
        isLunar: { type: 'boolean', description: '음력 여부 (기본값: false)' },
        isLeapMonth: { type: 'boolean', description: '윤달 여부' },
        birthtime: { type: 'string', description: '출생 시각 HH:MM (선택)' },
      },
    },
  },
  {
    name: 'consult_oracle',
    description: '전용 HTTP API가 없습니다. 호출하면 이유와 함께 실패하며, 고정 문장 리딩을 만들지 않습니다.',
    inputSchema: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: ['healing', 'growth'],
          description: '오라클 모드 (healing: 내면아이 치유 및 마음 안정, growth: 실행 돌파 및 퍼포먼스 코칭)',
        },
        question: {
          type: 'string',
          description: '상담할 구체적인 고민이나 의제',
        },
        name: {
          type: 'string',
          description: '질문자 성함 또는 호칭',
        },
      },
      required: ['question'],
    },
  },
  {
    name: 'generate_tts',
    description: '텍스트를 고품질 한국어 신경망 음성(Edge TTS)으로 변환하여 base64 MP3 오디오와 지속 시간 정보를 반환합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: '음성으로 변환할 텍스트' },
        voice: {
          type: 'string',
          enum: ['Kore', 'SunHi', 'InJoon', 'Hyunsu'],
          description: '음성 종류 (기본값: Kore/SunHi)',
        },
        emotion: {
          type: 'string',
          description: '음성 감정 톤 (따뜻함, 자신감, 신비 등)',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'get_art_prescription',
    description: '마음의 안정과 힐링을 돕는 미술관 컬렉션 명화 작품과 예술적 처방을 반환합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        emotion: {
          type: 'string',
          description: '현재 느끼는 감정 (불안, 피로, 번아웃, 설렘 등)',
        },
        excludeTitles: { type: 'array', items: { type: 'string' }, description: '최근 추천받아 제외할 작품 제목 목록 (선택)' },
      },
    },
  },
];

export const MCP_PROMPTS = [
  {
    name: 'daily_tarot_guidance',
    description: '오늘의 타로 카드를 뽑고 하루를 살아갈 지혜와 통찰을 얻는 프롬프트',
    arguments: [
      { name: 'name', description: '질문자 이름', required: false },
      { name: 'focus', description: '오늘 집중하고 싶은 영역 (일, 관계, 마음 등)', required: false },
    ],
  },
  {
    name: 'oracle_healing_letter',
    description: '사주 원국과 타로 3카드를 결합하여 지친 마음에 건네는 힐링 편지 작성 프롬프트',
    arguments: [
      { name: 'concern', description: '해소하고 싶은 고민', required: true },
    ],
  },
];

export async function processMCPJsonRpc(message: any, context: { authorized?: boolean } = {}): Promise<any> {
  const { jsonrpc = '2.0', id, method, params } = message || {};

  // 1. initialize
  if (method === 'initialize') {
    const requestedProtocolVersion = params?.protocolVersion || '2024-11-05';
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: requestedProtocolVersion,
        capabilities: {
          tools: { listChanged: false },
          prompts: { listChanged: false },
          resources: {},
          logging: {},
        },
        serverInfo: {
          name: 'luckey-oracle-mcp',
          version: MCP_SERVER_VERSION,
          description: '정통 사주 ✕ 78장 타로 융합 오라클, AI 심층 리딩 및 고품질 한국어 TTS MCP 서버',
        },
      },
    };
  }

  // 2. notifications/initialized
  if (method === 'notifications/initialized' || method === 'initialized') {
    return null; // Notifications do not return a response
  }

  // 3. ping
  if (method === 'ping') {
    return { jsonrpc: '2.0', id, result: {} };
  }

  // 4. tools/list
  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: MCP_TOOLS,
      },
    };
  }

  // 5. tools/call
  if (method === 'tools/call') {
    const { name, arguments: args = {} } = params || {};

    try {
      if (name === 'get_daily_tarot' || name === 'get_saju_fortune') {
        if (!context.authorized) throw new Error(MCP_AUTH_MESSAGE);
      }

      if (name === 'get_daily_tarot') {
        const selected = selectTarotCard({ cardId: args.cardId, reversed: args.reversed });
        if ('error' in selected) throw new Error(selected.error);
        const result = await fetchDailyTarot(selected, { name: args.name, concern: args.concern });
        if (!result.ok) throw new Error(result.message);
        const api = result.api && typeof result.api === 'object' ? result.api as Record<string, unknown> : {};
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{
              type: 'text',
              text: JSON.stringify({
                endpoint: '/api/ai/daily-tarot',
                card: result.payload.card,
                reading: api,
              }, null, 2),
            }],
          },
        };
      }

      if (name === 'get_saju_fortune') {
        const result = await fetchSajuChart(args);
        if (!result.ok) throw new Error(result.message);
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: JSON.stringify(result.api, null, 2) }] },
        };
      }

      if (name === 'consult_oracle') {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32002, message: ORACLE_GAP },
        };
      }

      if (name === 'generate_tts') {
        const text = String(args.text || '').trim();
        if (!text) {
          throw new Error('TTS text parameter is required');
        }
        const { handleTTS } = await import('./ttsHandler.ts');
        const ttsResult = await handleTTS({
          text,
          voice: args.voice || 'Kore',
          emotion: args.emotion || '따뜻함',
        });

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    success: true,
                    encoding: ttsResult.encoding,
                    sampleRate: ttsResult.sampleRate || 24000,
                    audioContentBase64: ttsResult.audioContent,
                    textLength: text.length,
                  },
                  null,
                  2,
                ),
              },
            ],
          },
        };
      }

      if (name === 'get_art_prescription') {
        const artworks = [
          {
            artwork: { title: '수련 (Water Lilies)', artist: '클로드 모네 (Claude Monet)', year: '1916', theme: '평온과 깊은 치유', description: '물 위에 비친 빛과 색채가 잠시 시선을 쉬게 합니다.' },
            prescription: '작품 속 빛이 머무는 지점을 천천히 찾아보세요.',
          },
          {
            artwork: { title: '별이 빛나는 밤 (The Starry Night)', artist: '빈센트 반 고흐 (Vincent van Gogh)', year: '1889', theme: '변화와 감정', description: '소용돌이치는 밤하늘 아래 고요한 마을이 자리합니다.' },
            prescription: '움직이는 하늘과 고요한 마을 중 지금 더 끌리는 쪽을 살펴보세요.',
          },
          {
            artwork: { title: '키스 (The Kiss)', artist: '구스타프 클림트 (Gustav Klimt)', year: '1907–1908', theme: '관계와 온기', description: '금빛 무늬가 두 인물을 감싸는 작품입니다.' },
            prescription: '작품 속 거리감과 온기가 어떤 인상을 주는지 적어보세요.',
          },
          {
            artwork: { title: '진주 귀걸이를 한 소녀 (Girl with a Pearl Earring)', artist: '요하네스 페르메이르 (Johannes Vermeer)', year: 'c. 1665', theme: '시선과 호기심', description: '어두운 배경 속 돌아보는 인물의 표정이 시선을 붙듭니다.' },
            prescription: '인물의 표정을 한 단어로 표현해 보세요.',
          },
          {
            artwork: { title: '그랑드 자트 섬의 일요일 오후 (A Sunday Afternoon on the Island of La Grande Jatte)', artist: '조르주 쇠라 (Georges Seurat)', year: '1884–1886', theme: '일상과 관찰', description: '강가의 다양한 사람들이 작은 색점들로 표현됩니다.' },
            prescription: '그림 속에서 가장 마음이 가는 인물을 한 명 찾아보세요.',
          },
        ];
        // Keep recommendations stateless so concurrent users never share history.
        // Optional excludeTitles allows clients to avoid their own recent suggestions.
        const emotion = String(args.emotion || '').toLowerCase().trim();
        const excludeTitles = Array.isArray(args.excludeTitles)
          ? args.excludeTitles.filter((title: unknown): title is string => typeof title === 'string')
          : [];
        const excluded = new Set(excludeTitles.map((title: string) => title.trim().toLowerCase()));
        const available = artworks.filter(({ artwork }) => !excluded.has(artwork.title.toLowerCase()));
        const pool = available.length ? available : artworks;
        const emotionGroups: { terms: string[]; titles: string[] }[] = [
          { terms: ['불안', '초조', '걱정', '지침', '피로', '번아웃', 'stress', 'anxious', 'tired'], titles: ['수련 (Water Lilies)', '그랑드 자트 섬의 일요일 오후 (A Sunday Afternoon on the Island of La Grande Jatte)'] },
          { terms: ['슬픔', '우울', '외로움', 'sad', 'lonely'], titles: ['별이 빛나는 밤 (The Starry Night)', '진주 귀걸이를 한 소녀 (Girl with a Pearl Earring)'] },
          { terms: ['사랑', '설렘', '행복', '기쁨', 'love', 'happy'], titles: ['키스 (The Kiss)', '그랑드 자트 섬의 일요일 오후 (A Sunday Afternoon on the Island of La Grande Jatte)'] },
          { terms: ['호기심', '궁금', '집중', 'curious'], titles: ['진주 귀걸이를 한 소녀 (Girl with a Pearl Earring)'] },
        ];
        const matched = emotionGroups.find(({ terms }) => terms.some((term) => emotion.includes(term)));
        const preferred = matched ? pool.filter(({ artwork }) => matched.titles.includes(artwork.title)) : [];
        const candidates = preferred.length ? preferred : pool;
        const choice = candidates[Math.floor(Math.random() * candidates.length)];
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: JSON.stringify(choice, null, 2) }],
          },
        };
      }

      throw new Error(`Unknown tool: ${name}`);
    } catch (toolErr: any) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: toolErr?.message || 'Tool execution failed',
        },
      };
    }
  }

  // 6. resources/list & resources/templates/list
  if (method === 'resources/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        resources: [],
      },
    };
  }

  if (method === 'resources/templates/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        resourceTemplates: [],
      },
    };
  }

  // 7. roots/list & logging/setLevel
  if (method === 'roots/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        roots: [],
      },
    };
  }

  if (method === 'logging/setLevel') {
    return {
      jsonrpc: '2.0',
      id,
      result: {},
    };
  }

  // 8. prompts/list
  if (method === 'prompts/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        prompts: MCP_PROMPTS,
      },
    };
  }

  // 9. prompts/get
  if (method === 'prompts/get') {
    const promptName = params?.name;
    if (promptName === 'daily_tarot_guidance') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          description: '오늘의 타로 안내 프롬프트',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: '오늘 저에게 필요한 타로 카드를 뽑아주시고, 하루를 의미 있게 보낼 수 있는 통찰과 따뜻한 조언을 들려주세요.',
              },
            },
          ],
        },
      };
    }

    if (promptName === 'oracle_healing_letter') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          description: '오라클 힐링 편지 프롬프트',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `사주명리학과 타로 카드를 융합하여 저의 다음 고민에 대해 마음을 보듬고 명쾌한 길을 열어주는 힐링 편지를 작성해 주세요: "${params?.arguments?.concern || '마음의 평온'}"`,
              },
            },
          ],
        },
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Prompt not found: ${promptName}` },
    };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`,
    },
  };
}

// Handler for GET /api/mcp/sse or /sse (Model Context Protocol over SSE)
export function handleMCPSseStream(req: Request, res: Response) {
  if (isStreamableMcpGet(req)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32000, message: '이 엔드포인트의 Streamable HTTP는 세션 없는 JSON POST만 받습니다.' },
    });
  }

  const host = req.get('x-forwarded-host') || req.get('host') || req.headers.host || 'localhost:3000';
  const proto = req.get('x-forwarded-proto') || (req.secure ? 'https' : (host.includes('localhost') ? 'http' : 'https'));

  // If client makes a normal HTTP GET (not asking for text/event-stream), return MCP discovery JSON
  const acceptHeader = req.headers.accept || '';
  if (!acceptHeader.includes('text/event-stream') && !req.path.endsWith('/sse')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      status: 'healthy',
      name: 'luckey-oracle-mcp',
      version: MCP_SERVER_VERSION,
      protocolVersion: '2024-11-05',
      endpoints: {
        sse: `${proto}://${host}/api/mcp/sse`,
        messages: `${proto}://${host}/api/mcp/messages`,
        http: `${proto}://${host}/api/mcp`,
      },
      streamableHttp: {
        url: `${proto}://${host}/api/mcp`,
        transport: 'streamable-http',
        accept: 'application/json, text/event-stream',
        session: 'stateless',
      },
      tools: MCP_TOOLS.map((t) => t.name),
    });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  });

  const sessionId = `mcp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  sseClients.set(sessionId, {
    id: sessionId,
    res,
    createdAt: Date.now(),
    authorized: verifyMcpBearer(readMcpCredential(req)),
  });

  // Initial endpoint event per MCP SSE spec (both absolute URL and relative fallback for maximum client compatibility)
  const fullEndpointUrl = `${proto}://${host}/api/mcp/messages?sessionId=${sessionId}`;
  res.write(`event: endpoint\ndata: ${fullEndpointUrl}\n\n`);

  // Periodic keep-alive comment
  const keepAlive = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch (_) {
      clearInterval(keepAlive);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(keepAlive);
    sseClients.delete(sessionId);
  });
}

// Handler for POST /api/mcp/messages?sessionId=...
export async function handleMCPPostMessage(req: Request, res: Response) {
  const sessionId = String(req.query.sessionId || '');
  const client = sseClients.get(sessionId);

  const message = req.body;
  const authorized = verifyMcpBearer(readMcpCredential(req)) || Boolean(client?.authorized);
  if (protectedReading(message) && !authorized) {
    logRejectedMcpAuth(req);
    const id = message && typeof message === 'object' && 'id' in message ? (message as { id?: unknown }).id : null;
    return res.status(401).json({
      jsonrpc: '2.0',
      id: typeof id === 'string' || typeof id === 'number' ? id : null,
      error: { code: -32001, message: MCP_AUTH_MESSAGE },
    });
  }
  const rpcResponse = await processMCPJsonRpc(message, { authorized });

  if (rpcResponse) {
    if (client) {
      client.res.write(`event: message\ndata: ${JSON.stringify(rpcResponse)}\n\n`);
    }
    return res.status(200).json(rpcResponse);
  }

  return res.status(202).send('Accepted');
}

// Handler for direct HTTP JSON-RPC POST /api/mcp
export async function handleMCPDirectPost(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (isStreamableMcpPost(req)) {
    return handleStreamableMcpPost(req, res);
  }

  const message = req.body;
  const authorized = verifyMcpBearer(readMcpCredential(req));
  if (protectedReading(message) && !authorized) {
    logRejectedMcpAuth(req);
    const id = message && typeof message === 'object' && 'id' in message ? (message as { id?: unknown }).id : null;
    return res.status(401).json({
      jsonrpc: '2.0',
      id: typeof id === 'string' || typeof id === 'number' ? id : null,
      error: { code: -32001, message: MCP_AUTH_MESSAGE },
    });
  }
  const rpcResponse = await processMCPJsonRpc(message, { authorized });

  if (!rpcResponse) {
    return res.status(204).end();
  }

  return res.status(200).json(rpcResponse);
}
