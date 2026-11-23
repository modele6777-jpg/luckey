# 루시 정기 문헌 연구

Render Cron Job이 매일 오전 9시(한국 시간)에 실행된다. 주역·사주·타로 주제를 하루에 하나씩 돌아가며 Crossref에서 최대 5건을 검색한다. 제목, 저자, 연도, 학술지와 링크만 저장하고, 같은 도구의 DOI(없으면 URL)는 다시 저장하지 않는다. 후보는 지식 관리자 화면의 정기 수집 검토함에서 열 수 있다.

작업은 `lucyKnowledgeSettings/control`의 연구 허용과 정기 연구가 모두 켜졌을 때만 수집한다. 후보는 별도 컬렉션에 미검토 상태로 저장된다. 관리자가 원문을 확인한 뒤 기존 화면에서 예산 한도 안에서 초안을 요청하고 검토·승인한다. 이 작업은 상담 기록을 읽거나 AI를 호출하지 않는다.

## Render 연결

1. Firebase에 이 브랜치의 Firestore 규칙을 배포한다. 관리자만 후보를 읽고 클라이언트 앱은 직접 쓸 수 없다.
2. Render에서 같은 저장소의 `main`을 사용하는 Node Cron Job을 만든다. 시간은 UTC `0 0 * * *`이다. Render Cron Job에는 별도 실행 비용이 있을 수 있다.
3. 빌드 명령은 `npm ci --include=dev && npm run build:knowledge-research`, 실행 명령은 `npm run start:knowledge-research`다.
4. Cron Job의 Render 환경변수 `LUCY_KNOWLEDGE_SCHEDULER_CREDENTIALS`에 전용 Google 서비스 계정 자격 증명을 설정한다. 대상 Firestore 데이터베이스에서 설정 문서를 읽고 후보 문서를 생성할 수 있는 권한이 필요하다. 상담·음성용 자격 증명과 별도로 관리한다.
5. Cron Job을 시험 실행해 꺼짐 상태가 정상 처리되는지 확인하고, 웹 서비스의 Render 환경변수에 `LUCY_KNOWLEDGE_SCHEDULE_CONFIGURED=true`를 설정한다. `/admin/knowledge`에서 메타데이터 연구와 정기 연구를 켠 뒤 작업을 시험 실행해 후보가 표시되는지 확인한다.
