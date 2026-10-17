# 하단 3개 버튼 플로팅 상향 배치 및 본명(실명) 일관 표기 구현 계획

하단 글로벌 네비게이션 3종 버튼(메뉴, 빅뱅 코스믹 오브, 배경음 LP)을 하단 채팅 입력창 바로 위에 자연스럽게 플로팅으로 띄워 대화 입력 영역과의 간섭을 원천 차단하고, 프로필 추가 창 및 대화창 프로필 칩 전체에서 닉네임 대신 본명(실명)을 기본이자 단독 기준으로 명확하게 표시하도록 인터페이스를 전면 정비합니다.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> 사전 질의응답을 통해 사용자가 직접 선택한 두 가지 핵심 사양을 엄격히 반영하여 구축합니다.

- **확정 결정 1 (버튼 3종 배치)**: 하단 3개 버튼(메뉴 버튼, 중앙 빅뱅 코스믹 오브, 우측 배경음 LP 플레이어)을 하단 고정 채팅 입력창(`footer`) 바로 위에 안정적인 간격(`bottom: calc(var(--lucy-chat-bar-height) + 12px)`)으로 띄워, 타이핑 및 프로필 독 조작을 전혀 가리지 않으면서도 엄지손가락으로 쉽게 누를 수 있는 플로팅 독 구조를 확립합니다.
- **확정 결정 2 (본명 표기 통일)**: 프로필 추가/수정 모달뿐만 아니라 하단 대화창 프로필 독 칩, 내 프로필 기본값 등 대화창의 모든 프로필 UI에서 닉네임('제제' 등) 대신 실제 본명('박주형' 또는 등록된 실명)을 일관되게 단독 표기합니다.

---

## 1. Overview & Core Concept

- **What It Does**:
  1. **플로팅 3버튼 하단 채팅란 상향 연동**:
     - 기존 화면 맨 하단에 위치하여 채팅 입력창(프로필 독, 추천질문 바, 텍스트 입력창)과 겹치거나 가리던 메뉴 버튼, 빅뱅 버튼, 배경음 LP 버튼을 채팅 입력창의 실제 렌더링 높이를 실시간 감지하여 그 바로 위로 부드럽게 띄웁니다.
     - 키보드 등장이나 프로필 독 확장 등으로 하단 입력바 높이가 동적으로 변하더라도 ResizeObserver와 CSS 커스텀 변수(`--lucy-chat-bar-height`)를 통해 정확한 상단 오프셋을 유지합니다.
  2. **프로필 추가 및 대화창 칩 본명(실명) 통일**:
     - 대화창 내 프로필 추가/수정 모달(`ChatProfileModal`)에서 "닉네임" 용어 및 플레이스홀더를 완전히 제거하고 "본명 (실명)"으로 단일화합니다.
     - 기본 프로필(`activeProfiles[0]`, `myProfile`)의 이름이 닉네임('제제')으로 표시되던 현상을 수정하여 사용자 본명(`basic.name` 또는 저장된 실명, 기본값 '박주형')으로 정확히 표기합니다.
     - 대화창 상단/하단 프로필 독 칩(`ChatProfileDock`)에서도 닉네임 대신 본명이 표시되어, 사주 명리학 및 대화 분석의 주체가 누구인지 명확히 전달합니다.
- **Target Audience / Persona**: 루시와 1:1 및 다자간 사주·운명 상담을 나누는 모든 사용자. 특히 모바일 및 좁은 화면에서 채팅 입력 시 버튼 간섭 없이 쾌적하게 조작하길 원하는 사용자.
- **Key Value**: 채팅창 입력 영역 100% 가독성 및 클릭성 보장, 사주 분석 대상자의 실명 확인 직관성 극대화.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **대화창 진입 및 하단 3버튼 조작**:
   - 대화창 진입 시 하단 3개 버튼이 채팅 입력창 윗선(추천 질문 및 입력 바 상단)에서 약 10~14px 떠 있는 상태로 부드럽게 자리잡습니다.
   - 좌측: 메뉴 버튼 (`LeftSidebarNav`)
   - 중앙: 웅장한 코스믹 크리스털 빅뱅 버튼 (`BigBangButton`)
   - 우측: 음악 재생 및 롱프레스 퀵메뉴를 제공하는 회전 LP 디스크 (`BgMusicPlayer`)
   - 채팅창 스크롤이나 타이핑 시 입력바와 버튼이 서로를 침범하지 않아 터치 미스가 발생하지 않습니다.
2. **프로필 추가 및 본명 입력**:
   - 대화창 프로필 독에서 `+ 프로필 추가` 클릭 시 모달이 오픈됩니다.
   - 첫 번째 입력 필드가 "이름 (본명)"으로 명확히 표기되며, 실명(예: 김철수, 박주형) 입력 안내가 안내됩니다.
   - 저장 시 프로필 독 칩에 등록된 본명이 즉시 나타납니다.
   - 본인 단독 1인 프로필 상태에서도 닉네임('제제')이 아닌 본인 실명이 단정한 폰트로 표출됩니다.

### Visual Identity & Theme
- **스모키 크리스털 글래스모피즘**:
  - 버튼 3종에 적용된 `prism-glass-fab` 스타일(`bg-slate-900/60`, `backdrop-blur-xl`, `border-white/30`, `shadow-[0_8px_32px_rgba(0,0,0,0.35)]`)을 일관되게 유지합니다.
  - 대화창 배경 위에 반투명하게 부유하여 하단 대화 흐름을 시각적으로 단절하지 않습니다.
- **타이포그래피 및 칩 렌더링**:
  - 프로필 칩의 텍스트가 줄바꿈 없이 깔끔하게 표시되도록 `truncate` 및 적절한 최대 너비를 지정합니다.

---

## 3. Key Product Decisions & Trade-Offs

- **결정 1: CSS 변수 + ResizeObserver를 통한 동적 하단 상향 배치**
  - *선택한 접근*: `LucyStandalonePage`의 `footerRef` 높이를 실시간 측정하여 `--lucy-chat-bar-height` 변수에 주입하고, `index.css`에서 `.in-lucy-chat` 클래스 하의 FAB 위치를 `bottom: calc(var(--lucy-chat-bar-height, 120px) + 0.75rem)`로 일괄 상향 적용.
  - *이유*: 프로필 독 유무, 실시간 음성 바 표출 여부, 추천 질문 바 유무에 따라 하단 바 높이가 80px~170px까지 유동적이므로, 고정 px 하드코딩 시 겹침 현상이 재발함.
  - *대안 검토*: 버튼들을 `footer` 내부에 직접 DOM 요소로 집어넣는 방식은 전역 라우트 상태(다른 페이지 이동 시 유지) 및 `App.tsx`의 오버레이/포털 시스템과 결합도를 비정상적으로 높이므로 기각.
- **결정 2: 대화창 프로필 데이터 소스에서 본명(Real Name) 우선 정책 강화**
  - *선택한 접근*: `activeProfiles` 초기화 및 `getPersistentUserProfile()` 조회 시, `basic.name`이 유효하면 무조건 본명을 `profile.name`으로 할당하고, 닉네임('제제', '여행자' 등)으로 치환되지 않도록 가드 추가.
  - *이유*: 사용자가 요청한 "프로필 추가 창에서는 닉네임 말고 본명으로 나오게 해줘"는 사주 만세력 계산 및 인물 식별에서 닉네임보다 본명이 갖는 신뢰성을 확보하기 위함.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LucKey App Shell (App.tsx)                      │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ LucyStandalonePage (Route: /)                                  │   │
│   │                                                                │   │
│   │   [ Chat Message Stream Container (flex-1 overflow-y-auto) ]   │   │
│   │                                                                │   │
│   │   ┌── Dynamic Height Measuring Footer (footerRef) ─────────┐   │   │
│   │   │ • Live Auto-TTS Voice Bar                              │   │   │
│   │   │ • ChatProfileDock (Chips display Real Name: '박주형')   │   │   │
│   │   │ • Recommendation Prompt Chips (13P Library)            │   │   │
│   │   │ • Text Input / Camera / STT / Send Action              │   │   │
│   │   └────────────────────────────────────────────────────────┘   │   │
│   │           │ (ResizeObserver -> --lucy-chat-bar-height)         │   │
│   └───────────┼────────────────────────────────────────────────────┘   │
│               ▼                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Fixed Floating Control Layer (z-[400], above footer)           │   │
│   │ bottom: calc(var(--lucy-chat-bar-height) + 12px)               │   │
│   │                                                                │   │
│   │  [ LeftSidebarNav ]      [ BigBangButton ]     [ BgMusicPlayer ]   │   │
│   │     (메뉴 버튼)          (중앙 빅뱅 구체)         (우측 LP판)       │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Components to Update
1. **`src/index.css`**:
   - `.in-lucy-chat .bottom-safe-nav-fab`, `.in-lucy-chat .bottom-safe-fab-center`, `.in-lucy-chat .bottom-safe-music-lp`의 bottom 오프셋을 `calc(var(--lucy-chat-bar-height, 120px) + 0.75rem)`로 최적화하고 z-index를 보장하여 클릭 간섭 방지.
   - LP 롱프레스 퀵메뉴(`.bottom-safe-music-menu`) 역시 해당 LP 위치에 맞추어 `calc(var(--lucy-chat-bar-height, 120px) + 5rem)`로 동기화.
2. **`src/components/chat/ChatProfileModal.tsx`**:
   - 모달 타이틀 및 라벨/플레이스홀더에서 "닉네임" 단어를 완전히 배제하고 "본명 (실명)"으로 고정.
   - 단독 1인 프로필 추가 또는 신규 프로필 추가 시, 기본값으로 닉네임('제제') 대신 영구 프로필의 실명(`persistentProfile?.name` 또는 기본 '박주형')을 주입.
3. **`src/pages/LucyStandalonePage.tsx`**:
   - `activeProfiles` 초기화 로직에서 `rawRealName`을 최우선으로 취합하여 첫 번째 프로필의 이름을 본명으로 확실하게 설정.
   - 다자간 프로필 독 칩 렌더링 시에도 실명이 안정적으로 표출되도록 보장.
   - footer 높이 측정 시 여백(`paddingBottom`, safe area)까지 완벽히 감지되도록 ResizeObserver 튜닝.
4. **버전 및 품질 검증**:
   - `package.json`, `public/version.json`, `public/changelog.json` 버전 패치 번호 증가 (1.4.319 -> 1.4.320).
   - `npm run lint` 및 `npm run build`를 통한 빌드 성공 검증.
