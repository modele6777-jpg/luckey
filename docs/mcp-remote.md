# LUCKEY 원격 MCP (타로·사주)

표준 Streamable HTTP MCP입니다. 공식 SDK `@modelcontextprotocol/sdk`의 `StreamableHTTPServerTransport`를 쓰고, 세션을 저장하지 않는 JSON 응답으로 동작합니다. Vercel 함수가 요청마다 끝나기 때문에 상시 SSE 세션은 열지 않습니다.

## 엔드포인트

| 구분 | 경로 | 상태 |
| --- | --- | --- |
| Streamable HTTP | `POST /api/mcp` | 이 변경의 핸들러 테스트로 확인. `Accept: application/json, text/event-stream` |
| 같은 URL의 GET | `GET /api/mcp` + `Accept: text/event-stream` | `405`. 공식 클라이언트는 이 응답을 보고 POST만 사용 |
| 탐색 JSON | `GET /api/mcp` (event-stream 아님) | 기존 탐색 JSON. `streamableHttp` 필드 추가 |
| 레거시 SSE | `GET /api/mcp/sse`, `POST /api/mcp/messages` | 기존 Spark용 동작 유지 |
| 레거시 JSON-RPC | `POST /api/mcp` + `Accept: application/json`만 | 기존 `get_daily_tarot`, `get_saju_fortune` 등 유지 |

로컬 개발 서버(`npm run dev`)와 Vercel `api/index.ts`가 같은 핸들러를 사용합니다.

계획된 배포 주소는 `https://luckey.ai.studio/api/mcp`입니다. 이 주소는 이번 변경을 배포한 뒤의 주소이며, 이번 작업에서 실제 배포 서버를 호출해 확인하지 않았습니다. 확인한 것은 저장소 테스트가 `127.0.0.1`에 띄운 HTTP 서버입니다.

## 인증

`LUCKEY_MCP_TOKEN`은 서버 환경 변수입니다. 24자 이상의 임의 문자열을 운영 비밀 저장소에만 둡니다. 저장소나 로그에 값을 넣지 않습니다.

| 도구 | 인증 |
| --- | --- |
| `initialize`, `tools/list`, `list_tarot_spreads` | 없음 |
| `read_tarot` `narrative=local` (기본값) | 없음. 출생 정보를 받지 않고 모델을 호출하지 않음 |
| `read_tarot` `narrative=model` | `Authorization: Bearer <토큰>` |
| `read_saju` | `Authorization: Bearer <토큰>` |

토큰이 없거나 24자 미만이면 사주와 모델 리딩은 401입니다. 모델 리딩은 추가로 프로세스 메모리 시간당 한도(`LUCKEY_MCP_MODEL_HOURLY_LIMIT`, 기본 12, 최대 100)를 넘기면 429입니다. 이 한도는 인스턴스마다 따로 세므로 Vercel에서 전역 한도가 아닙니다. 제공자 쿼터가 최종 한도입니다.

출생 연월일은 요청을 계산하는 동안만 쓰고 저장하지 않습니다. 다른 사용자의 프로필이나 Firestore 기록은 읽지 않습니다. 핸들러는 토큰, 출생 정보, 모델 프롬프트를 로그로 남기지 않습니다.

레거시 JSON-RPC `get_saju_fortune`은 기존 클라이언트 호환을 위해 토큰 없이 그대로입니다. 결과를 저장하지는 않습니다. 새 클라이언트는 `read_saju`를 사용합니다. 레거시 `generate_tts`는 이 Streamable HTTP 도구 목록에 넣지 않았습니다.

## 도구

입력 스키마는 앱의 `TarotConcernTheme`, `TAROT_DECK` id, `calculateDetailedSaju` 입력 범위를 따릅니다.

- `list_tarot_spreads`: 앱 배열 목록. 예: 오늘의 타로 1장, 예/아니오 3장, 셀틱 크로스 10장.
- `read_tarot`: 78장 덱에서 배열 장수만큼 뽑거나, `cards[].id`로 덱에 있는 카드를 지정합니다. 자리와 문장은 `buildLocalTarotReading`입니다. 오늘의 원카드는 `buildSpecificTarotDailyOracle` 진단문을 함께 반환합니다. `narrative=model`은 기존 Gemini 키로 모델 1회만 호출하고, 카드와 로컬 판정을 바꾸지 말라고 지시합니다. 키가 없거나 호출이 실패하면 같은 카드의 로컬 리딩을 반환합니다.
- `read_saju`: `calculateDetailedSaju`. 1900–2050년, 실재하는 양력 날짜, 선택 시각 `HH:MM`, 음력·윤달, 선택 성별. 성별이 없으면 대운 방향은 미확정입니다. 시주가 없으면 시주를 만들지 않습니다.

## 클라이언트 예시

Cursor 등 MCP 클라이언트:

```json
{
  "mcpServers": {
    "luckey": {
      "url": "https://luckey.ai.studio/api/mcp",
      "headers": {
        "Authorization": "Bearer ${env:LUCKEY_MCP_TOKEN}"
      }
    }
  }
}
```

위 URL은 배포 후 사용할 계획 주소입니다. 로컬 서버는 `http://127.0.0.1:3000/api/mcp`입니다.

공식 SDK:

```ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const transport = new StreamableHTTPClientTransport(new URL('http://127.0.0.1:3000/api/mcp'), {
  requestInit: {
    headers: { Authorization: `Bearer ${process.env.LUCKEY_MCP_TOKEN ?? ''}` },
  },
});
const client = new Client({ name: 'luckey-example', version: '0.0.0' });
await client.connect(transport);
const spreads = await client.callTool({ name: 'list_tarot_spreads', arguments: {} });
```

직접 HTTP:

```bash
curl -s http://127.0.0.1:3000/api/mcp \
  -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

사주와 모델 리딩에는 `-H "Authorization: Bearer $LUCKEY_MCP_TOKEN"`을 붙입니다.

## 운영자가 설정할 값

이 PR은 배포 환경 변수를 바꾸지 않습니다.

1. 서버에 `LUCKEY_MCP_TOKEN`을 24자 이상 임의 값으로 설정합니다. Gemini/OpenAI 키와 같은 기존 비밀 저장소를 사용하고, 클라이언트에는 Bearer로만 전달합니다.
2. 모델 서사를 쓰려면 앱이 이미 쓰는 `GEMINI_API_KEY`(또는 `GOOGLE_GENAI_API_KEY` / `AI_API_KEY`)가 서버에 있어야 합니다. 없으면 로컬 리딩만 반환합니다. 모델은 `GEMINI_MODEL`이 있으면 그 값을, 없으면 `gemini-3.1-flash-lite` 한 번만 호출합니다.
3. 필요하면 `LUCKEY_MCP_MODEL_HOURLY_LIMIT`을 바꿉니다. 기본값은 12입니다.

## 배포 한계

- 세션 ID, 재개, 서버가 먼저 보내는 SSE는 없습니다. `DELETE /api/mcp`도 405입니다.
- 시간당 모델 한도는 프로세스 메모리라 서버리스 인스턴스 사이에 공유되지 않습니다.
- 레거시 `/api/mcp/sse`와 Accept 헤더가 JSON만인 POST는 이전 도구를 유지합니다. Streamable HTTP 클라이언트는 위 Accept 두 값을 보내야 새 도구를 봅니다.
- 루트 `GET /`의 기존 SSE 감지는 바꾸지 않았습니다. 표준 클라이언트 주소는 `/api/mcp`입니다.
- `https://luckey.ai.studio/api/mcp`는 배포 후 계획 주소이며, 이번 검증의 대상이 아닙니다.
