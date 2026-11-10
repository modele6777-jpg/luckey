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

`/api/saju/chart`는 화면이 브라우저에서 부르던 `calculateDetailedSaju`를 HTTP로 연 것입니다. 응답의 `timePolicy`와 프로필 사주 카드는 같은 문장을 씁니다.

시각 기준은 다음과 같습니다. 입력은 한국 표준시 벽시계이고, 절기도 그 벽시계로 비교합니다. 시주만 벽시계에서 30분을 뺍니다. 이 30분은 유파 관례이지 한국 전역의 진태양시나 경도 보정이 아닙니다. 일주는 23:30부터 다음 날이고, 23:00~23:29는 해시입니다. 출생 시각은 분 단위라 절입 초가 그 분 뒤면 같은 시:분도 이전 절기입니다. 생시가 없으면 시주를 만들지 않고, 절기·대운 나이만 정오를 참고합니다.

2000-01-01 12:00 양력의 기본 계산은 년주 己卯, 월주 丙子, 일주 戊午, 시주 戊午, 오행 목1 화3 토3 금0 수1입니다. 일간은 戊土입니다. 화와 토가 3으로 같으므로 화만 중심 기운이라고 하지 않습니다. 개수가 가장 많은 오행이 일간과 달라도, 예를 들어 수가 더 많아도, 그 오행을 일간의 중심 기운이라고 하지 않습니다. `birthtime: "abc"`는 `invalid_time_format`이고 날짜 오류가 아닙니다. 이 표본은 1900–2050 전체나 모든 절기 분을 보증하지 않습니다.

해석은 표면 개수(년·월·일·시 천간과 지지)만 말합니다. 일간, `elementBalance`, `interpretation`은 서로 다른 필드입니다. 표면 개수가 0이면 그 오행을 적되, 지장간까지 영향이 없다는 뜻도 건강·재물·운명의 결론도 아닙니다. 생시가 없으면 시주 없는 6글자 부분 결과이며 고르거나 안정적이라고 단정하지 않습니다. 월주·시주·개수가 다르면 문장에 그 차이가 들어갑니다. 같은 사실이면 문장이 같아도 됩니다.

2026-11-07에 `https://luckey.ai.studio/version.json`은 1.4.634였고, `POST /api/mcp` initialize는 서버 이름 `luckey-oracle-mcp` 1.4.180이었습니다. tools/list에는 `get_saju_fortune`만 있고 `read_saju`는 없었습니다. 그 배포본은 이 저장소의 1.7대 해석과 다릅니다. 이번 변경에서 배포 서버로 출생 정보를 보내지 않았습니다.

앱의 `calculateDetailedSaju`는 각 기둥의 십신(`tenGodGan`, `tenGodZhi`), 지장간(`hiddenStems`), 대운(`daeun`, `daewunDetail`), 세운(`annual2026`)을 만듭니다. 대운 방향은 `gender`가 `male` 또는 `female`일 때만 정하고, 없으면 “대운 미확정”입니다. 생시가 없으면 대운 시작 나이는 정오 참고값입니다. 출생지 경도는 받지 않으며 진태양시로 바꾸지 않습니다. `/api/saju/chart`와 `get_saju_fortune`, `read_saju`는 이 필드를 아직 내려주지 않습니다. 없는 값을 만들어 넣지 않았습니다. 다음으로 이미 계산된 십신·지장간과, 성별이 있을 때의 대운만 응답에 붙이는 범위를 따로 정할 수 있습니다.

여러 장 타로는 화면이 `POST /api/openai/v1/chat/completions`에 브라우저에서 만든 프롬프트를 보냅니다. 그 경로는 타로 전용 API가 아니고 사용자 인증이 없어 MCP는 호출하지 않습니다.

## 인증

`/api/ai/daily-tarot`와 채팅 완성 API에는 사용자 세션·앱 과금 검사가 없습니다. 한도는 모델 제공자 쿼터뿐입니다. MCP가 그 유료 경로와 출생 정보 경로를 익명으로 열지 않도록, `get_daily_tarot`, `read_tarot`(원카드), `get_saju_fortune`, `read_saju`는 서버 비밀 `LUCKEY_MCP_TOKEN`(24자 이상)이 있어야 합니다. 토큰은 `Authorization: Bearer`로 보내거나, 헤더를 보낼 수 없는 클라이언트는 URL 쿼리 `key`(별칭 `token`)로 보냅니다. 헤더가 있으면 헤더를 쓰고, 없을 때만 쿼리를 봅니다. 비교는 SHA-256 뒤 상수 시간입니다. 이 토큰은 리딩 API로 전달하지 않습니다. 거절 로그에는 URL의 `key`/`token`과 Bearer 값을 `[redacted]`로만 남깁니다. SSE를 `?key=`로 열면 그 세션의 다음 메시지에 토큰을 다시 붙이지 않으며, endpoint 이벤트 URL에도 토큰을 넣지 않습니다.

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
      "url": "https://luckey-six.vercel.app/api/mcp",
      "headers": { "Authorization": "Bearer ${env:LUCKEY_MCP_TOKEN}" }
    }
  }
}
```

Grok 커스텀 커넥터는 URL만 받고 `Authorization` 헤더를 보내지 않습니다. [grok.com/connectors](https://grok.com/connectors)에서 New Connector, Custom을 고르고 아래 주소를 붙입니다. `LUCKEY_MCP_TOKEN`은 24자 이상이며, 예약 문자가 있으면 URL 인코딩합니다. 토큰이 들어 있는 전체 주소는 로그나 채팅에 남기지 않습니다.

```text
https://luckey-six.vercel.app/api/mcp?key=<LUCKEY_MCP_TOKEN>
```

`?token=`도 같은 값으로 동작합니다. Vercel rewrite `/api/mcp`와 `/api/mcp/(.*)`의 destination은 `/api`이고 쿼리 문자열을 바꾸지 않아 `key`가 함수까지 전달됩니다.

운영 주소는 `https://luckey-six.vercel.app`입니다. 서버에는 `LUCKEY_API_ORIGIN`을 그 리딩 API가 실제로 있는 출처로 둡니다. Express `server.app.ts`, Sites `handleSitesApi`, Vercel `api/index.ts`에 `/api/saju/chart`와 `/api/ai/daily-tarot`가 있습니다.

## 운영자가 정할 일

1. `LUCKEY_MCP_TOKEN`을 24자 이상 임의 값으로 서버 비밀에만 저장합니다.
2. `LUCKEY_API_ORIGIN`을 리딩 API가 있는 https 출처로 저장합니다. Host 헤더로 대체하지 않습니다.
3. 원카드 타로의 모델 호출은 그 출처의 기존 Gemini 키와 제공자 쿼터를 사용합니다. MCP는 Gemini SDK를 호출하지 않습니다.
