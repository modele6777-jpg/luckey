<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

## Sites 배포

`npm run build:sites`는 기존 화면과 리소스를 Sites용 Worker로 묶습니다.
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
