# Lucy AI 단일 통합 채팅방 및 Lucy + 진화 시스템 구현 계획

기존 '루시 채팅'과 '루시프로'로 이원화되어 있던 화면을 **단일 대화방 'Lucy AI'**로 통합하고, **빅뱅 버튼 홀드 시 페이지 이동 없이 즉시 'Lucy +'로 진화**하며 7대 채널 올인원 마스터 모드가 활성화되는 유기적 통합 시스템을 구축합니다.

---

## 1. 요구사항 및 주요 설계 결정

1. **단일 채팅방 'Lucy AI' 통합**:
   - 하단 및 플로팅 메뉴, 사이드바에서 '루시 채팅'과 '루시프로'를 단일 **'Lucy AI'** 탭으로 통일.
   - 기본 진입 시 기존의 친근하고 다정한 **일반 AI 대화 모드**로 동작.
   - `/chat/pro` 진입 시에도 별도 격리 페이지가 아닌 Lucy AI 방에서 `Lucy +` 모드가 활성화된 상태로 즉각 연동.
2. **빅뱅 버튼 홀드 시 'Lucy +' 실시간 진화**:
   - 빅뱅 버튼을 **홀드(220ms 이상 누르고 떼기)**하면 다른 페이지로 튕기지 않고 현재 **Lucy AI 방 안에서 'Lucy +' 상태로 즉시 진화(Evolution)**.
   - 7대 채널(프롤로그·오렌지·트리니티·아우라·블루버드·뮤즈·에필로그) 올인원 마스터 지능 상시 가동.
   - 텍스트를 선택한 상태에서 홀드 시 해당 문장을 마스터 모드에 자동 투입(Smart Toss).
3. **밤하늘 별빛 $\rightarrow$ 네잎·세잎 클로버 테마 애니메이션 전환**:
   - **Lucy AI (기본)**: 깊은 밤하늘과 은은하게 반짝이는 별빛(Starlight) 테마.
   - **Lucy + (진화)**: 별빛들이 빛을 내며 **네잎클로버(🍀)와 세잎클로버(☘️)**로 변환되어 떠오르고, 화면 테두리에 은은한 골드/에메랄드 오라 링과 파티클 연출.
   - 모드 전환 시 CSS 트랜지션 및 `framer-motion`을 통해 끊김 없이 유려한 시각 전환 제공.
4. **일반 모드 복귀 메커니즘**:
   - Lucy + 상태에서 **빅뱅 버튼을 가볍게 1회 탭**하면 다시 일반 Lucy AI(밤하늘 별빛) 모드로 즉각 복귀.
   - 상단 헤더의 Lucy + 뱃지를 클릭해도 토글 복귀 가능.

---

## 2. 세부 구현 계획

### A. Lucy AI 통합 및 Lucy + 상태 머신 (`src/pages/LucyStandalonePage.tsx`)
- `isPlusMode` 상태 추가 (기본 `false`, URL 쿼리나 이벤트, 빅뱅 홀드로 `true` 전환).
- 빅뱅 버튼 홀드 이벤트 수신: `window.addEventListener('prism:evolve_lucy_plus')` 및 탭 복귀 이벤트 `prism:toggle_lucy_plus`.
- `isPlusMode === true`일 때:
  - 7대 채널 마스터 프롬프트 및 `lucyProMessages` / 올인원 모델 파이프라인 가동.
  - 상단 헤더에 황금빛 글로우와 함께 **"Lucy +"** 뱃지 및 마스터 지능 인디케이터 표시.
- `isPlusMode === false`일 때:
  - 기존 일상 대화 및 동적 채널 감지 일반 Lucy AI로 작동.

### B. 별빛 $\rightarrow$ 클로버 테마 애니메이션 레이어 (`src/components/chat/LucyCosmicBackground.tsx` & `src/styles/lucy-starlight.css`)
- 밤하늘 별빛 캔버스 위에 클로버 레이어 결합:
  - `Lucy AI`: 밤하늘 감성 딥 네이비 배경(`rgba(7, 11, 32, 1)`) + 미세한 별빛 트윙클.
  - `Lucy +`: 별빛 파티클이 에메랄드/골드 톤으로 물들며 3D 원근감의 네잎클로버(🍀)와 세잎클로버(☘️)들이 부드럽게 유영하고, 가장자리에 황금빛 오라 펄스 이펙트 활성화.
  - `AnimatePresence` 및 CSS 가속을 통한 60fps 부드러운 교차 디졸브 애니메이션.

### C. 빅뱅 버튼 홀드 & 탭 동작 튜닝 (`src/components/omniwarp/BigBangButton.tsx`)
- **홀드 동작**:
  - `isHoldGesture` 발생 시, 현재 Lucy AI 화면에 있거나 다른 화면에 있을 때:
    - 현재 Lucy AI에 있다면 페이지 이동 없이 `prism:evolve_lucy_plus` 이벤트 발생 및 `isPlusMode` 활성화.
    - 다른 화면에 있다면 `/chat`으로 진입하면서 즉시 `isPlusMode` 활성화.
    - 햅틱 피드백('whitehole' / 골드 오라 사운드) 발동.
- **단일 탭 동작**:
  - Lucy AI 화면에서 `isPlusMode` 상태일 때 단일 탭 시:
    - 일반 Lucy AI 모드로 복귀 (`prism:revert_lucy_ai` 이벤트 디스패치).
    - 별빛 테마로 복귀 햅틱 및 알림.

### D. 메뉴 및 라우팅 정리 (`src/components/navigation/LeftSidebarNav.tsx`, `src/App.tsx`)
- 네비게이션 항목에서 '루시 채팅', '루시프로'의 중복 제거 $\rightarrow$ 단일 **'Lucy AI'** 탭으로 통일.
- `/chat/pro` 경로는 `/chat?mode=plus`로 자동 포워딩하여 기존 링크/북마크 호환성 유지.

### E. 프로젝트 버전 관리 및 규칙 준수 (`RULE[AGENTS_md]`)
1. `package.json` 패치 버전 업데이트 (`1.4.566` $\rightarrow$ `1.4.567`).
2. `public/version.json` 신규 버전 및 빌드 시간 동기화.
3. `public/changelog.json` 최상단에 변경 내역 기록.
4. `compile_applet` 및 `lint_applet`으로 빌드 무결성 검증.
5. Git commit 및 push (`git add .`, commit with version number, `git push`).

---

## 3. 검증 항목
- [ ] 사이드바 및 네비게이션에 단일 'Lucy AI'로 통합 표시되는지 확인
- [ ] 빅뱅 버튼을 길게 눌렀을 때 페이지 전환 없이 'Lucy +'로 진화하고 상단 뱃지가 전환되는지 확인
- [ ] 밤하늘 별빛 테마가 네잎클로버와 세잎클로버 및 골드 오라 테마로 자연스럽게 애니메이션되는지 확인
- [ ] 'Lucy +' 상태에서 빅뱅 버튼을 1회 가볍게 탭하면 다시 일반 Lucy AI(별빛 테마)로 복귀하는지 확인
- [ ] Lucy + 마스터 모드에서 7대 채널 올인원 답변이 정상 작동하는지 확인
