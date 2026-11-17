# LucKey iOS / Capacitor

이 브랜치는 `feat/capacitor-ios-codemagic`입니다. main 병합과 웹 배포는 별도 작업입니다. `vercel.json`에서 이 브랜치의 Git 자동 배포만 비활성화했습니다. 기존 Vercel/Sites 빌드 명령은 그대로이며 이 작업에서 운영 배포를 실행하지 않습니다.

## 실행

Node 22 이상, macOS와 Xcode가 필요합니다. Capacitor 8 / iOS 15 이상 / iPhone 및 iPad를 대상으로 합니다.

```sh
npm ci
npm run ios:sync
npm run ios:open
```

`ios:sync`는 `vite --mode native`로 기존 엔진과 화면을 번들링하고 iOS에 복사합니다. 개발 키가 앱에 포함되지 않도록 native 모드에서 AI 키 주입을 끕니다. 비밀키는 서버에만 설정합니다. `dist`와 iOS의 복사된 웹 파일은 Git에 포함하지 않습니다.

`npm run build`는 기존 웹/Vercel 빌드, `npm run build:sites`는 기존 Sites 빌드입니다. 웹/PWA는 기존 서비스워커를 사용하고 네이티브 앱에서는 등록하지 않습니다. 앱 업데이트는 새 네이티브 빌드로 제공합니다.

## 서버와 로그인

기본 API 서버는 `https://luckey-six.vercel.app`입니다. 2026-11-17 작업 시 이 서버의 채팅 API OPTIONS 요청이 HTTP 402를 반환했습니다. 서버가 정상화되기 전에는 실기기 API 연결 성공을 보장할 수 없습니다. 이 브랜치에서 기존 운영 서버나 결제 설정을 변경하지 않았습니다. 다른 서버를 사용하려면 빌드 전에 `VITE_NATIVE_API_ORIGIN=https://서버주소`를 설정합니다. HTTPS 원점만 허용합니다. `/api/*`, `/openai/v1/*` 요청만 서버로 전달하고 로컬 화면·사주/타로 엔진·외부 서비스 URL은 유지합니다. 네이티브 HTTP 패치는 쓰지 않아 fetch 스트리밍과 취소를 유지합니다.

웹뷰 원점은 `capacitor://localhost`입니다. 기존 서버의 localhost 원점 허용 규칙에 해당하지만, 별도 서버로 바꾸면 해당 원점과 Authorization 헤더의 CORS를 확인해야 합니다. 인증·동기화는 기존 서버의 정책을 따르며 네이티브에서 로그인한 세션은 Safari와 별개입니다. Google/Firebase 인증 제공자의 승인 도메인·리디렉션 구성은 운영 계정에서 확인해야 합니다. Google 팝업/리디렉션을 웹뷰에서 지원하지 않는 경우에는 시스템 브라우저 기반 OAuth를 별도로 연동해야 합니다.

## 기기 기능과 화면

- 타로 및 공통 오디오 햅틱은 iOS에서 Capacitor Haptics를 사용하고 웹에서는 기존 Vibration API를 사용합니다. 햅틱은 오디오를 재생하거나 오디오 포커스를 요청하지 않습니다.
- 기존 `--sat/--sab/--sal/--sar`, `viewport-fit=cover`, 실제 캔버스 폭 기반 반응형 레이아웃을 재사용합니다. 네이티브에서 다시 inset을 겹쳐 넣지 않습니다.
- iPhone 가로/세로, iPad 회전·Split View와 좁은/넓은 뷰포트를 지원하는 구성을 유지합니다. iOS 시뮬레이터만으로 실제 폴더블 하드웨어 동작을 검증했다고 볼 수는 없습니다.
- 마이크/카메라/사진 사용 설명과 명시적 음성 재생을 위한 background audio 선언을 포함합니다. 자동 배경음이나 무음 유지 루프는 추가하지 않습니다.
- 흰 바탕 연두색 네잎클로버는 기존 PWA 아이콘을 재사용합니다. `resources/icon.png`를 바꾼 후 `npm run ios:assets`로 iOS 아이콘·스플래시만 재생성합니다. PWA 아이콘은 변경하지 않습니다.

## Codemagic

1. Codemagic에 GitHub 저장소를 연결하고 이 브랜치의 `codemagic.yaml`을 선택합니다.
2. `ios-simulator`는 Apple 서명 없이 실행할 수 있으며 `LucKey-simulator.zip`을 만듭니다. Codemagic 프로젝트에 이 YAML을 연결하기 전에는 자동 실행되지 않습니다.
3. TestFlight는 Apple Developer 멤버십, App Store Connect 앱 레코드, 서명 인증서와 프로파일이 필요합니다. 현재 Bundle ID는 `com.modele6777.luckey`이며 본인 팀에 등록해야 합니다. 바꿀 때는 `capacitor.config.ts`, Xcode target Bundle Identifier, YAML의 `bundle_identifier`를 함께 바꿉니다.
4. Codemagic 팀 설정에 App Store Connect API 키를 등록하고 통합 이름을 `LucKey App Store Connect`로 맞춥니다. API 키/개인 키/프로비저닝 파일을 Git에 넣지 않습니다. Codemagic code signing에서 해당 Bundle ID의 배포 인증서·프로파일을 연결합니다.
5. `ios-testflight`는 수동 실행하며 성공 시 TestFlight에 제출합니다. 앱 심사/스토어 공개는 자동으로 하지 않습니다. 기존 앱 레코드에 업로드한다면 빌드 번호가 이전보다 커야 합니다.

## 검증 범위

Linux에서는 TypeScript, 웹/PWA 빌드, 네이티브 웹 빌드, API URL·헤더·스트리밍 계약과 `cap sync ios`를 확인할 수 있습니다. Xcode 컴파일, 서명 IPA, 실제 햅틱, 안전 영역/키보드/회전, Apple Music과 TTS의 동시·백그라운드 재생, 로그인은 macOS/Codemagic와 iPhone에서 확인해야 합니다. 이 저장소 설정만으로 Codemagic 계정 연결이나 Apple 서명을 완료한 것은 아닙니다.
