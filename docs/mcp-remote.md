# LUCKEY 원격 MCP (타로·사주)

MCP는 리딩 문장이나 사주 원국을 직접 계산하지 않고, 고정된 `LUCKEY_API_ORIGIN`의 기존 HTTP API만 호출합니다. 요청의 Host, 도구 인자, MCP Bearer 토큰으로 호출 주소를 바꾸거나 사용자 신원인 것처럼 전달하지 않습니다.

확인한 구현은 소스와 `127.0.0.1` 핸들러 테스트입니다. `https://luckey.ai.studio/api/mcp`는 배포 후 계획 주소이며 이번 변경에서 호출하지 않았습니다.

## 도구별 흐름

| 도구 | 이전 | 지금 |
| --- | --- | --- |
| `get_daily_tarot` | MCP가 덱과 `buildSpecificTarotDailyOracle`로 문장을 만듦 | 카드 한 장을 골라 `POST {origin}/api/ai/daily-tarot`. 본문은 그 응답만 사용 |
| `read_tarot` 한 장·`theme=daily` 또는 주제 생략 | MCP 로컬 리딩 또는 Gemini 직접 호출 | 위와 같은 `/api/ai/daily-tarot`. `narrative` 값은 무시 |
| `read_tarot` 여러 장·daily가 아닌 주제 | 로컬 배열 리딩 | 호출하지 않고 `tarot_spread_http_api` 실패 |
| `get_saju_fortune`, `read_saju` | MCP가 `calculateDetailedSaju`를 직접 호출 | `POST {origin}/api/saju/chart`. 계산은 그 경로의 `sajuChartFromInput` 한 곳 |
| `consult_oracle` | 카드 이름과 고정 문장 | 호출하지 않고 전용 API가 없다는 실패 |
| `generate_tts`, `get_art_prescription` | 변경 없음 | 변경 없음 |

`/api/ai/daily-tarot` 본문은 화면과 같습니다. `card`(id, name, nameKo, type, keywords, reversed), `mode: "oracle"`, `comfortLevel: 3`, 그리고 이름·질문이 있으면 `profile.basic.nickname` / `profile.fate.currentWorry`.

`/api/saju/chart`는 화면이 브라우저에서 부르던 `calculateDetailedSaju`를 HTTP로 연 것입니다. 시각 문자열과 음력·윤달을 그대로 넘기므로 한국 표준시 벽시계와 23:30 일주 경계는 그 함수와 같습니다. 앱에는 원래 사주 HTTP API가 없었습니다.

여러 장 타로는 화면이 `POST /api/openai/v1/chat/completions`에 브라우저에서 만든 프롬프트를 보냅니다. 그 경로는 타로 전용 API가 아니고 사용자 인증이 없어 MCP는 호출하지 않습니다.

## 인증

`/api/ai/daily-tarot`와 채팅 완성 API에는 사용자 세션·앱 과금 검사가 없습니다. 한도는 모델 제공자 쿼터뿐입니다. MCP가 그 유료 경로와 출생 정보 경로를 익명으로 열지 않도록, `get_daily_tarot`, `read_tarot`(원카드), `get_saju_fortune`, `read_saju`는 `Authorization: Bearer`와 서버 비밀 `LUCKEY_MCP_TOKEN`(24자 이상)이 있어야 합니다. 이 토큰은 리딩 API로 전달하지 않습니다.

예술·TTS 도구와 `initialize`, `tools/list`, `list_tarot_spreads`, 여러 장 타로의 실패 응답, `consult_oracle`의 실패 응답은 토큰 없이 동작합니다.

## 실패

리딩 API의 4xx/5xx와 연결 실패는 상태와 `error` 문장을 그대로 도구 오류로 돌려줍니다. MCP가 로컬 리딩으로 바꿔 성공인 것처럼 반환하지 않습니다. Express `/api/ai/daily-tarot` 구현은 Gemini 실패 시 스스로 로컬 오라클 JSON을 200으로 줄 수 있습니다. 그것은 그 API의 기존 동작이며 MCP가 두 번째 대체 리딩을 만들지 않습니다. Sites의 같은 경로는 오류를 반환합니다.

## 호출 주소

`LUCKEY_API_ORIGIN`만 사용합니다. https, 또는 `localhost`/`127.0.0.1`의 http. 사용자 정보가 있는 URL은 거절합니다. 리다이렉트는 따라가지 않습니다. 허용 경로는 `/api/ai/daily-tarot`와 `/api/saju/chart`뿐입니다.

이 값이 비어 있으면 유료·사주 도구는 API를 호출하지 않고 설정 오류를 반환합니다.

## 클라이언트

```json
{
  "mcpServers": {
    "luckey": {
      "url": "https://luckey.ai.studio/api/mcp",
      "headers": { "Authorization": "Bearer ${env:LUCKEY_MCP_TOKEN}" }
    }
  }
}
```

위 URL은 배포 후 계획 주소입니다. 서버에는 `LUCKEY_API_ORIGIN`을 그 리딩 API가 실제로 있는 출처로 둡니다. Express `server.app.ts`와 Sites `handleSitesApi`에는 두 경로가 있습니다. Vercel `api/index.ts`에는 `/api/saju/chart`만 있고 `/api/ai/daily-tarot`는 없습니다. 타로 원카드를 Vercel 함수만으로 호출하면 404가 전달됩니다.

## 운영자가 정할 일

1. `LUCKEY_MCP_TOKEN`을 24자 이상 임의 값으로 서버 비밀에만 저장합니다.
2. `LUCKEY_API_ORIGIN`을 리딩 API가 있는 https 출처로 저장합니다. Host 헤더로 대체하지 않습니다.
3. 원카드 타로의 모델 호출은 그 출처의 기존 Gemini 키와 제공자 쿼터를 사용합니다. MCP는 Gemini SDK를 호출하지 않습니다.
