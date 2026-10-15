import { Request, Response } from 'express';
import { TAROT_DECK } from '../../src/data/tarotData';
import { buildSpecificTarotDailyOracle } from '../../src/lib/dailyTarotOracle';
import { handleTTS } from './ttsHandler';

interface SseClient {
  id: string;
  res: Response;
  createdAt: number;
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
}, 60000);

export const MCP_TOOLS = [
  {
    name: 'get_daily_tarot',
    description: '오늘의 정통 78장 타로 카드 1장을 드로우하여 상징 해석, 오늘 하루의 흐름, 루시의 특별 조언 및 행운의 확언을 반환합니다.',
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
      },
    },
  },
  {
    name: 'get_saju_fortune',
    description: '오늘의 일진(천간·지지, 오행 기운)과 사주 원국 에너지를 분석하여 오늘의 운세 흐름 및 균형 처방을 반환합니다.',
    inputSchema: {
      type: 'object',
      properties: {
        year: { type: 'number', description: '출생 연도 (예: 1995)' },
        month: { type: 'number', description: '출생 월 (1~12)' },
        day: { type: 'number', description: '출생 일 (1~31)' },
        isLunar: { type: 'boolean', description: '음력 여부 (기본값: false)' },
      },
    },
  },
  {
    name: 'consult_oracle',
    description: '사주명리학과 78장 타로를 교차 융합한 심층 오라클 리딩 및 핵심 3줄 요약([현재 에너지], [방향과 결단], [실천 처방])을 반환합니다.',
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

export async function processMCPJsonRpc(message: any): Promise<any> {
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
          version: '1.4.180',
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
      if (name === 'get_daily_tarot') {
        const rawCard = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
        const isReversed = Math.random() < 0.25;
        const randomCard = { ...rawCard, reversed: isReversed };
        const oracle = buildSpecificTarotDailyOracle(randomCard, 'oracle');
        const detail = (await import('../../src/lib/dailyTarotOracle')).TAROT_DETAILS[randomCard.id];

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    card: {
                      id: randomCard.id,
                      nameKo: randomCard.nameKo,
                      nameEn: randomCard.name,
                      type: randomCard.type,
                      reversed: isReversed,
                      keywords: randomCard.keywords,
                      coreInterpretation: isReversed ? detail?.reversedCore : detail?.uprightCore,
                      actionGuidance: detail?.actionGuidance,
                      shadowWarning: detail?.shadowWarning,
                    },
                    reading: {
                      diagnosis: oracle.diagnosis,
                      luckyNumber: oracle.luckyNumber,
                      luckyColor: oracle.luckyColor,
                      remedy: oracle.remedy,
                      symbol: oracle.symbol,
                      frequency: oracle.frequency,
                      blessingMessage: oracle.blessingMessage,
                    },
                  },
                  null,
                  2,
                ),
              },
            ],
          },
        };
      }

      if (name === 'get_saju_fortune') {
        const today = new Date();
        const year = args.year || today.getFullYear();
        const month = args.month || today.getMonth() + 1;
        const day = args.day || today.getDate();

        // 2026 병오년(丙午年) 붉은 말의 해 기준 오행 흐름
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    yearPillar: '병오(丙午) - 화(火)의 왕성한 추진력',
                    elementBalance: {
                      wood: '성장과 창의성',
                      fire: '열정과 표현력',
                      earth: '신뢰와 포용력',
                      metal: '결단과 명확성',
                      water: '유연함과 지혜',
                    },
                    dailyFortune: '오늘은 생각에 머물지 않고 첫 발을 내딛을 때 행운의 기운이 증폭되는 날입니다.',
                    luckyColor: '골드 & 앰버',
                    remedyAction: '중요한 결정 전 3번의 깊은 복식호흡으로 중심을 잡으세요.',
                  },
                  null,
                  2,
                ),
              },
            ],
          },
        };
      }

      if (name === 'consult_oracle') {
        const mode = args.mode === 'growth' ? 'growth' : 'healing';
        const question = args.question || '내면의 길을 찾고자 합니다.';
        const recipient = args.name || '질문자';

        // Sample 3 random cards for the oracle spread
        const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
        const cards = shuffled.slice(0, 3).map((c, i) => ({
          slot: i === 0 ? '현재 상태 / 무의식' : i === 1 ? '도전 과제 / 기회' : '결과 / 실천 처방',
          cardName: c.nameKo,
          keywords: c.keywords.slice(0, 3).join(', '),
        }));

        const isHealing = mode === 'healing';
        const summaryBullets = isHealing
          ? [
              `[현재 에너지] 사주 원국의 본원 기운과 [${cards[0].cardName}] 카드가 만나 지나온 여정의 피로와 전환기 과부하를 비추고 있습니다.`,
              `[방향과 결단] [${cards[1].cardName}] 카드의 깊은 통찰처럼 타인의 기준이나 조급함을 내려놓고 자신의 고유한 회복 리듬을 선택할 때입니다.`,
              `[실천 처방] [${cards[2].cardName}] 카드의 상생 에너지를 담아 오늘 밤 따뜻한 차 한 잔과 깊은 호흡으로 마음을 다정하게 안아주세요.`,
            ]
          : [
              `[현재 에너지] 사주 원국의 추진력과 [${cards[0].cardName}] 카드가 만나 실행 정체를 뚫어낼 돌파의 잠재력을 가리키고 있습니다.`,
              `[방향과 결단] [${cards[1].cardName}] 카드의 조언처럼 망설임과 잔가지를 과감히 쳐내고 오늘 가장 중요한 1순위에 몰입하세요.`,
              `[실천 처방] [${cards[2].cardName}] 카드의 실행력을 담아 10분 안에 끝낼 수 있는 가장 작은 1% 마이크로 행동을 즉시 시작하세요.`,
            ];

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    mode,
                    recipient,
                    question,
                    spread: cards,
                    quickSummary: summaryBullets,
                    masterMessage: isHealing
                      ? `${recipient} 님, 지금 마주한 파동은 정체가 아니라 더 큰 성장을 위한 고요한 충전기입니다. 스스로를 재촉하지 마시고 자신의 고유한 리듬을 신뢰하세요.`
                      : `${recipient} 님, 탁월함은 거창한 결심이 아닌 오늘의 작은 실행에서 완성됩니다. 주저하지 마시고 첫 단추를 채우세요.`,
                  },
                  null,
                  2,
                ),
              },
            ],
          },
        };
      }

      if (name === 'generate_tts') {
        const text = String(args.text || '').trim();
        if (!text) {
          throw new Error('TTS text parameter is required');
        }
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
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    artwork: {
                      title: '수련 (Water Lilies)',
                      artist: '클로드 모네 (Claude Monet)',
                      year: '1916',
                      theme: '평온과 깊은 치유',
                      description: '잔잔한 수면 위에 피어난 수련과 빛의 반사가 마음의 소음을 지우고 고요한 평화를 선사합니다.',
                    },
                    prescription: '빛과 색채의 흐름을 바라보며 마음에 쉼을 선물하세요.',
                  },
                  null,
                  2,
                ),
              },
            ],
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
      version: '1.4.180',
      protocolVersion: '2024-11-05',
      endpoints: {
        sse: `${proto}://${host}/api/mcp/sse`,
        messages: `${proto}://${host}/api/mcp/messages`,
        http: `${proto}://${host}/api/mcp`,
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
  const rpcResponse = await processMCPJsonRpc(message);

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

  const message = req.body;
  const rpcResponse = await processMCPJsonRpc(message);

  if (!rpcResponse) {
    return res.status(204).end();
  }

  return res.status(200).json(rpcResponse);
}
