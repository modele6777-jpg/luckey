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

## 2024년 24절기 대조

변환식은 바꾸지 않았습니다. 절기 비교는 한국 표준시 벽시계를 UTC 필드에 담아 하고, 시주의 30분 보정은 절입 시각에 더하지 않습니다. 월주는 12절에서만 바뀌고, 12중기에서는 월주가 바뀌지 않습니다. 년주는 입춘에서만 바뀝니다. 관보의 시각은 분까지이고 초는 없습니다. 발표 분과 같은 시:분에서는 초를 알 수 없으므로 그 분의 년주·월주를 합격으로 단정하지 않습니다.

날짜의 공식 출처는 2026-11-07에 받은 관보입니다. 표에는 월·일만 있고 시·분은 없습니다.

- 보도자료: https://www.kasi.re.kr/kor/publication/post/newsMaterial/29633
- 첨부: https://www.kasi.re.kr/file/1687408104839_1.hwp
- 관보 PDF: https://gwanbo.go.kr/user/common/ofcttCntntDownload.do 에 `cntnt_seq_no=I0000000000000001686831567351000`

시·분은 같은 날 받은 한국천문연구원 달력자료로 대신했습니다. 그 페이지는 공식 발표가 아니라고 적습니다. 초는 없습니다. 페이지의 24개 시각과 텍스트 파일의 24개 시각은 같았습니다.

- https://astro.kasi.re.kr/kor/life/post/calendarData?year=2024
- https://astro.kasi.re.kr/file/1785891710574_1.txt

엔진의 24개 날짜는 관보의 월·일과 같습니다. 달력자료의 분과 비교하면 같은 분은 0개, 1분 미만으로 어긋난 것은 2개(대한, 입추), 1분 이상 이른 것은 22개입니다. 빠진 절기는 없습니다. 이 차이는 저정밀 태양황경식의 잔차이고, 비공식 분에 맞춰 계수를 고치지 않았습니다. 소한은 2024-01-06이라 양력 해는 2024이고 사주 년은 입춘 전입니다. 동지는 입춘 뒤입니다. 배포 MCP는 호출하지 않았습니다. 앱 계산, 로컬 `/api/saju/chart`, MCP가 그 응답을 그대로 받는 경로만 확인했습니다.

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
