# LucKey 배포와 플랫폼 이전

GitHub `main`이 코드·잠금 파일·Firebase 연결 정보·보안 규칙·배포 명령의 기준입니다. 출시할 때는 같은 커밋을 앱과 연구 작업에 사용합니다. 실제 API 키와 Google 서비스 계정 자격 증명은 배포처의 비밀 환경변수에 입력하고, 이름은 [.env.example](.env.example)에서 확인합니다. Firebase 웹 앱의 공개 연결 설정은 `firebase-applet-config.json`에 있습니다.

## 실행 방법

| 환경 | 앱 | 정기 연구 |
| --- | --- | --- |
| Node 22 서버 | `npm ci --include=dev` → `npm run build:deploy` → `NODE_ENV=production npm start` | `npm run build:knowledge-research` 후 UTC 스케줄러에서 `npm run start:knowledge-research` |
| 컨테이너 호스트 | `docker build -t luckey .` → `docker run --rm --env-file /etc/luckey/app.env -p 3000:3000 luckey` | 같은 이미지에서 `npm run start:knowledge-research` 실행 |
| Render | `render.yaml` 웹 서비스 또는 동일한 Node 명령 | 별도 Node Cron Job에 같은 연구 명령 연결 |
| Vercel | GitHub `main` 연결, 빌드 `npm run build:frontend`, 출력 `dist`. `vercel.json`은 API와 로그인 경로 설정 | 앱과 별도의 스케줄러에서 동일한 저장소의 연구 명령 실행 |
| ChatGPT Sites | `npm run build:sites`. 저장소의 .openai/hosting.json과 기존 접근 설정·D1 연결 유지 | 동일한 외부 스케줄러 사용 |

Node 운영 서버는 기본 3000 포트를 사용합니다. 배포처에서 `PORT`를 제공하면 그 값을 사용합니다. 새 호스트에서 웹과 API를 같은 주소로 제공하면 출처 설정은 자동입니다. 역방향 프록시는 공개 Host 헤더를 유지합니다. 별도 접근 주소가 필요하면 `LUCKEY_APP_ORIGINS`에 HTTPS 출처를 쉼표로 구분해 지정합니다. 예를 들어 `https://luckey.example.com`처럼 경로나 끝 슬래시 없이 입력합니다. API 요청은 브라우저에서 같은 주소의 `/api`로 보냅니다.

사설 CA가 필요한 환경에서는 Docker 빌드에 `--secret id=npm_registry_ca,src=/path/to/trusted-ca.pem`을 전달할 수 있습니다. 인증서는 최종 이미지에 복사되지 않습니다.

## 연구 작업

일정의 기준은 [deploy/knowledge-research.crontab](deploy/knowledge-research.crontab)의 UTC `0 0 * * *`입니다. 한국 시간으로 매일 오전 9시입니다. Render에서도 이 표현식을 사용합니다. Vercel로 웹 앱을 옮겨도 기존 연구 스케줄러는 계속 사용할 수 있습니다.

직접 크론에 설치할 때는 스케줄러가 UTC인지 확인하고, `/etc/luckey/research-image`에 배포할 이미지 태그 또는 다이제스트를 한 줄로 지정합니다. `/etc/luckey/research.env`에는 배포자가 읽을 수 있는 권한으로만 연구용 환경변수를 둡니다. Docker와 flock 경로 및 잠금 파일 쓰기 권한을 확인합니다. Google 계정에는 같은 Firestore에서 연구 설정을 읽고 후보를 생성할 권한을 부여합니다. [연구 상세](docs/lucy-scheduled-research.md)

새 스케줄러를 점검한 뒤 기존 예약을 중지하고 새 예약을 활성화합니다. 결과는 도구와 DOI/URL로 중복 저장을 방지합니다. 운영 웹 환경의 `LUCY_KNOWLEDGE_SCHEDULE_CONFIGURED`와 관리자 화면의 두 연구 스위치를 확인합니다.

## 데이터 보존

- **Firebase** — 기존 프로젝트 `lucyuniverse-fc423`, 기존 데이터베이스 `ai-studio-cbbdcebe-d278-41b2-9826-3d7e58a0eb1a`와 기존 Firebase Auth 사용자 UID를 사용합니다. 프로필, 서버에 동기화된 대화·장기 기억, 연구 후보와 승인 지식 카드는 같은 곳에서 읽습니다. 앱 코드 배포와 Firebase 규칙 배포는 별도 작업입니다.
- **브라우저 기억** — 플랫폼 앞의 자체 HTTPS 도메인을 동일하게 유지하면 같은 브라우저 프로필의 로컬 저장소를 계속 사용할 수 있습니다. 주소 변경이 불가피하면 기존 주소에서 Firebase에 로그인하고 **상담 기억 → 계정에 백업**을 누른 뒤, 새 주소에서 같은 계정으로 로그인해 **계정에서 복원**을 누릅니다. 파일 백업도 사용할 수 있습니다. 세 모드 상담 요약·동의 설정, 이전 오브 기록, 점술 상담 기록, 계정별 장기 기억·일일 아카이브를 지원합니다. 새 주소에 이미 있는 항목은 덮어쓰지 않습니다. 복원 후 충돌 수를 확인하고 원본을 유지합니다. 백업은 상담 내용이 들어 있는 개인 파일이므로 비밀 저장소에 보관합니다.
- **Sites 전용 D1** — ChatGPT Sites의 동기화 저장소는 Firebase와 별개입니다. 기존 Sites와 DB 바인딩을 보존하고, 이전 전에 기존 주소에서 ChatGPT와 Firebase에 로그인한 상태로 계정 백업을 실행합니다. Sites 전용 어댑터가 접근 가능한 기존 D1의 계정별 루시 기억을 읽어, 브라우저에 없는 항목을 함께 백업합니다. 백업 메뉴는 계정별 루시 기억용이며 D1 전체나 다른 앱의 로컬 데이터는 별도입니다. D1에서만 접근 가능한 항목이 있으면 기존 사이트를 계속 열어 두고, 범위를 확인해 검증된 별도 이전을 마친 뒤에만 원본 중단을 검토합니다. 계정 백업은 기존 소유자 전용 Firestore 경로를 쓰므로 새 환경변수나 규칙 추가가 필요 없습니다. 계정 백업을 삭제하는 기능은 상담 기억 화면에 있습니다.

## 전환과 되돌리기

1. 기존 주소와 새 배포 주소, 현재 GitHub 커밋, Firebase 프로젝트·DB ID를 기록합니다. 같은 실제 사용자 UID의 기존 대화, 상담 요약, 승인 카드가 열린 상태를 확인합니다. 필요한 로컬 백업을 받아 둡니다.
2. 새 호스트에 같은 GitHub 커밋을 배포하고 비밀 환경변수를 입력합니다. Firebase Authentication의 승인된 도메인에 새 호스트를 추가하고 `/__/auth` 및 `/__/firebase` 로그인 경로를 확인합니다. 운영 규칙이 이미 맞으면 규칙 배포는 생략합니다.
3. 새 주소에서 `/api/health`, `/version.json`, 로그인, 같은 UID의 기존 기록, `/api/ai/live-token`을 통한 오브 음성 연결, 관리자 승인 카드 표시를 확인합니다. 점검 중 정기 실행은 한 곳에서만 유지합니다. 장소에 따라 예약 작업과 웹 호스트가 달라도 됩니다.
4. 새 호스트가 준비되면 기존 자체 도메인을 새 호스트로 전환합니다. 그 주소로 다시 로그인하고 이전에 확인한 기록과 새로 저장한 기록의 재접속 후 표시를 확인합니다. 플랫폼 제공 주소만 사용하고 있었다면 새 주소에서 기억 복원도 확인합니다.
5. 문제가 생기면 DNS 또는 트래픽 대상을 이전 호스트로 돌리고 이전 스케줄러를 다시 사용합니다. 같은 Firebase 데이터를 두 호스트가 읽으므로, 웹 배포를 되돌릴 때 Firestore 데이터를 예전 사본으로 덮어쓸 필요가 없습니다.

## 자동 검증

GitHub Actions의 Deployment portability 검사가 현재 Firestore 규칙으로 로컬 에뮬레이터를 실행합니다. 독립 클라이언트 간 프로필·대화·승인 지식·일부가 D1에만 있던 루시 기억을 비교하고, 다른 계정의 접근을 거부하는지 확인합니다. 같은 검사에서 Sites 어댑터와 Node Docker 이미지 기동을 검증합니다. 이 검증에는 운영 계정이나 키가 필요하지 않습니다.

## Google Cloud Run

Cloud Run은 같은 Dockerfile과 Firebase 프로젝트 설정으로 LucKey 전체 앱을 실행합니다. 실행용 Google 서비스 계정에 기존 Gemini Secret Manager 항목의 조회 권한을 부여합니다. Google Cloud CLI는 기존 서비스가 있는 프로젝트와 리전에 배포할 권한이 있는 계정으로 인증합니다.

```bash
export GOOGLE_CLOUD_PROJECT=lucyuniverse-fc423
export CLOUD_RUN_REGION=<기존-서비스-리전>
export CLOUD_RUN_SERVICE=luckey
export CLOUD_RUN_SERVICE_ACCOUNT=<Cloud-Run-실행-계정-이메일>
export CLOUD_RUN_GEMINI_SECRET=<필요한-경우-기존-Secret-Manager-항목-이름>
bash deploy/cloud-run.sh
```

이 명령은 현재 Git 커밋에서 컨테이너를 빌드합니다. 기존 Cloud Run 서비스의 Gemini 환경변수를 이어 쓰거나, 지정한 Secret Manager 값을 런타임에 연결합니다. Git이나 브라우저 빌드에 비밀 값을 넣지 않습니다. 공개 정책은 기존 설정을 따릅니다. 신규 독립 웹 앱에 공개 접속이 필요한 경우에만 배포자의 결정에 따라 `CLOUD_RUN_PUBLIC=true`를 지정합니다. Cloud Run 실행 계정과 별도로 빌드·배포에 필요한 Google Cloud IAM 권한이 있어야 합니다.

출력된 서비스 주소에서 위 전환 점검을 진행합니다. Sites에서 Cloud Run의 음성 API만 쓰려면 운영 인증과 공개 정책이 맞는지 확인한 뒤 Sites에 `LUCKEY_LIVE_API_ORIGIN`으로 검증한 Cloud Run 주소를 설정합니다. Google Cloud 크레딧의 적용 대상은 결제 계정과 상품 조건에서 확인합니다. Cloud Run으로 앱 호스트를 바꾸는 설정과 Gemini 호출을 Vertex AI로 전환하는 설정은 각각 별도입니다.
