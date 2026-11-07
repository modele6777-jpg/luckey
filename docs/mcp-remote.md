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

2000-01-01 12:00 양력의 기본 계산은 년주 己卯, 월주 丙子, 일주 戊午, 시주 戊午, 오행 목1 화3 토3 금0 수1입니다. 일간은 戊土입니다. 화와 토가 3으로 같으므로 화만 중심 기운이라고 하지 않습니다. 개수가 가장 많은 오행이 일간과 달라도, 예를 들어 수가 더 많아도, 그 오행을 일간의 중심 기운이라고 하지 않습니다. `birthtime: "abc"`는 `invalid_time_format`이고 날짜 오류가 아닙니다.

## 2017년 음력은 한국 표 그대로

변환 함수는 바꾸지 않았습니다. 2017년을 윤6월로 고치라는 보고는 한국 달력의 결함이 아니었습니다. 한국천문연구원 표의 윤달은 5월이고, 중국 달력 페이지는 같은 양력 날짜를 윤6월로 적습니다. 중국 윤6월을 한국 변환에 넣지 않습니다.

2026-11-07에 한국 자료 두 주소는 HTTP 200이었습니다.

- 보도자료: https://www.kasi.re.kr/kor/publication/post/newsMaterial/3660
- 첨부 HWP: https://www.kasi.re.kr/file/1457689454683_1.hwp

같은 날 받은 중국 달력 페이지입니다. 천문대 공식 표는 아니고, 페이지가 그렇게 적습니다.

- http://cn.nongli.info/years/index.php?year=2017
- https://www.yinliyangli.com/huangli/2017/2017.nongli.php

https://astro.kasi.re.kr/life/pageView/4 는 HTTP 500이었습니다. 공공데이터포털 음양력 API는 키가 필요해 호출하지 않았습니다. https://www.xinhuanet.com/politics/2017-07-22/c_1121363131.htm 은 HTTP 404라 인용하지 않습니다. 1900–2050 전체, 24절기 분 전체, 배포 서버는 확인하지 않았습니다. 사용자 화면의 60일주·120시주·병렬 호출 표본은 MCP 반환값 기록이며 이 테스트가 다시 측정한 값이 아닙니다.

HWP는 초하루와 합삭 시각(한국 표준시)만 적습니다. 합삭 시·분은 시주가 아닙니다. 시주 30분 보정, 23:30 일주 전환과 비교하지 않습니다.

| 입력 | 한국천문연구원 | 받은 중국 달력 페이지 | 엔진 |
| --- | --- | --- | --- |
| 평달 5월 1일 | 2017-05-26 | 2017-05-26 五月初一 | 2017-05-26 |
| 윤5월 1일 | 2017-06-24 | 2017-06-24을 六月初一(평달)로 적음 | 2017-06-24 |
| 평달 6월 1일 | 2017-07-23 | 2017-07-23을 闰六月初一로 적음 | 2017-07-23 |
| 윤6월 1일 | 표에 없음 | 있는 달로 적음 | 거절, `invalid_leap_month` |

보도자료 본문의 정월대보름(음 1월 15일=2월 11일), 단오(음 5월 5일=5월 30일), 칠석(음 7월 7일=8월 28일)은 표의 초하루에 민일을 더한 날짜와 같습니다. 양력에서 음력으로 되돌리는 검사는 같은 라이브러리의 왕복이라 독립 증거가 아닙니다. 2020년 윤4월 1일=2020-05-23, 2023년 윤2월 1일=2023-03-22, 2025년 윤6월 1일=2025-07-25는 라이브러리가 그대로 내는 값입니다. 그 세 해의 천문연 파일은 받지 않았고, 배포 MCP가 맞았다는 말은 사용자 보고입니다.

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
