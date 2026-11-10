<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

## Sites 배포

`npm run build:sites`는 기존 화면과 리소스를 Sites용 Worker로 묶습니다.
채팅은 Sites 런타임 비밀 값 `gemini`(또는 `GEMINI_API_KEY`)를 서버에서만 읽어 Google Gemini API에 직접 연결합니다. `GEMINI_MODEL`로 모델을 지정할 수 있으며 기본값은 `gemini-3.1-flash-lite`입니다. 채팅에는 `LUCKEY_API_ORIGIN` 설정이 필요하지 않습니다.

사이트 ID는 `.openai/hosting.json`에 보관하며 AI API 키는 번들에 포함하지 않습니다.
Sites의 런타임 환경 변수 `LUCKEY_API_ORIGIN`을 `https://luckey.ai.studio`로 설정하면
`/api/*` 요청을 기존 서버로 전달합니다. 기존 서버의 운영은 계속 필요합니다.
채팅(`/chat`, `/lucy`)과 핸드북(`/handbook`) 진입 경로를 유지합니다.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/74fc4969-44a5-40f7-b5bd-e3b32cf8ceba

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 원격 MCP

타로·사주 Streamable HTTP 엔드포인트는 `POST /api/mcp`입니다. 원카드 타로와 사주는 `LUCKEY_API_ORIGIN`이 있으면 그 리딩 API를, 없으면 운영 주소의 리딩 API를 호출합니다. Bearer 헤더 또는 `?key=` 쿼리로 16자 이상의 `LUCKEY_MCP_TOKEN`을 확인합니다. Grok은 [grok.com/connectors](https://grok.com/connectors)에서 New Connector, Custom을 고른 뒤 `https://luckey-six.vercel.app/api/mcp?key=<LUCKEY_MCP_TOKEN>`을 붙입니다. 주소, 인증, 도구별 흐름은 [docs/mcp-remote.md](docs/mcp-remote.md)에 있습니다.

## 기기 간 자동 동기화

같은 Sites 주소에서 같은 ChatGPT 계정으로 접속하면 프로필·대화·기록이 약 1초 간격으로 양방향 반영됩니다. 창이 활성화된 동안 변경된 항목만 확인하고, 오프라인 변경은 재접속 시 전송합니다. Firebase 로그인이나 기기별 PIN 페어링에 의존하지 않습니다.

Sites D1의 `DB` 바인딩을 사용하며 `drizzle/0000_sites_sync.sql`은 계정별 저장소와 버전 충돌 검사를 정의합니다. 테이블은 게시 시 마이그레이션으로 생성합니다. AI 요청은 기존 서버 연결을 유지합니다.

검사: `node scripts/test-sites-sync.mjs`, `node scripts/test-batched-persistence.mjs`, `node scripts/test-bigbang-mobile.mjs`.

## Sites 내부 AI API (1.4.476)

`server/sites-api.ts`를 Worker용으로 묶어 기존 API 경로를 직접 처리합니다. 기본 텍스트 모델은 `gemini-3.1-flash-lite`, 음성은 `gemini-2.5-flash-preview-tts`, 이미지는 `gemini-3.1-flash-lite-image`이며 각각 `GEMINI_MODEL`, `GEMINI_TTS_MODEL`, `GEMINI_IMAGE_MODEL`로 설정할 수 있습니다. 미디어 모델의 Google 권한·한도는 별도이며 이미지 생성 한도 오류를 성공으로 대체하지 않습니다.

검사: `node --import tsx --test tests/sites-api.test.ts`, `node scripts/test-sites-gemini-chat.mjs`. `scripts/audit-sites-api.mjs`의 `--live-media`는 실제 음성·이미지 모델을 추가 호출하므로 사용량이 발생합니다. 키는 숨김 표준입력으로만 전달합니다.
