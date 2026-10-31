## 문제

`luckey-flame.vercel.app`에서 AI 음성(TTS)이 항상 실패했습니다.

- `POST /api/ai/tts` → **HTTP 500 `FUNCTION_INVOCATION_FAILED`** (직접 확인)
- 원인: `server/api-lib/edgeTts.ts`가 `node-edge-tts`를 import하는데, 이 패키지가
  필요로 하는 `ws` 모듈이 Vercel 서버리스 번들에서 누락되어
  (`Cannot find module './lib/stream'`) 람다가 실행 전에 크래시했습니다.
- `node-edge-tts`는 WebSocket 연결 + OS 임시 디렉터리 파일 기록이라 서버리스에
  근본적으로 취약한 구조였습니다.

## 해결

### 1. 제로 의존성 무료 음성 합성 (`server/api-lib/edgeTts.ts`)

- `node-edge-tts`, `ws`, 임시 파일 기록을 전부 제거하고 **순수 `node:https`만으로**
  무료 TTS를 합성합니다. 외부 패키지가 하나도 없어 번들 누락 문제가 원천 차단됩니다.
- 낭독 문장을 문장·절(쉼표 등) 경계를 존중해 150자 이하 청크로 나눈 뒤,
  각 청크의 mp3를 내려받아 `Buffer.concat`으로 병합하고 base64로 반환합니다.
- 응답은 기존과 동일한 형식(`audioContent`, `encoding: 'mp3'`,
  `sampleRate: 24000`, `provider: 'free-neural'`)이라 호출부(`ttsHandler.ts`,
  `sites-api.ts`) 변경이 없습니다. 보이스 매핑(`resolveEdgeTtsVoice`)도 유지됩니다.
- 청크당 15초 제한 시간, 1회 재시도, 요청 간 250ms 간격으로 안정성을 확보했습니다.
- `node-edge-tts` 의존성을 package.json / package-lock.json / bun.lock에서 완전히 제거하고
  타입 선언 파일(`server/types/node-edge-tts.d.ts`)을 삭제했습니다.

### 2. 브라우저 내장 음성 폴백 (`src/utils/tts.ts`)

- `/api/ai/tts` 요청이 실패하거나 200이 아닌 응답을 받으면,
  브라우저 내장 `speechSynthesis`(Web Speech API)로 한국어(`ko-KR`, 가능하면 한국어
  보이스 선택) 낭독을 즉시 시작합니다.
- 사용자는 **더 이상 'AI 음성을 생성하지 못했습니다'를 보지 않고 항상 소리를 듣습니다.**
- 폴백 낭독도 기존 세션과 맞물려 일시정지·재개·중지·연속 낭독(청크)·완료 종소리가 그대로 동작합니다.

## 검증

- 무료 TTS 제공자 엔드포인트에서 한국어 문장 200자급 연속 요청 2건: 모두
  HTTP 200, 유효한 MPEG layer III 24kHz mp3 반환 확인.
- 병합 오디오는 base64 mp3로 기존 클라이언트 재생 경로와 동일.
- CI(saju-checks: npm ci + tsc + 빌드)가 package.json 변경으로 실행되어 전체 타입·빌드 검증을 수행합니다.
