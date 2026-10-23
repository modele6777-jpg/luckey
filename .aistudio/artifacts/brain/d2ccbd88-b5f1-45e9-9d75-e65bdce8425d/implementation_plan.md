# 좌측 엣지 호버 & 스와이프 사이드바 오토 피크(Auto-Peek) 네비게이션

PC에서는 마우스를 화면 좌측 끝으로 이동할 때, 모바일에서는 화면 좌측 끝에서 안쪽으로 스와이프할 때 사이드바가 부드럽게 펼쳐지고, 사용자의 조작이 끝나면 약 2.5초 후 자동으로 다시 접히는 스마트 오토 피크(Auto-Peek) 네비게이션 경험을 구현합니다.

### User Review & Critical Decisions

> [!IMPORTANT]
> 사전 질의를 통해 확정된 사용자 인터페이스 및 자동 접힘 동작 사양입니다.

- **자동 접힘 대기 시간 (확정)**: 마우스가 사이드바 영역을 벗어나거나 모바일 터치 조작이 종료된 시점부터 **약 2.5초(2,500ms) 후** 자동으로 부드럽게 접힙니다.
- **조작 중 열린 상태 유지 (확정)**: 사이드바 내부에 마우스를 올려두거나 메뉴·배경음 컨트롤 등을 터치하여 조작하는 동안에는 자동 접힘 타이머가 일시정지되어 열린 상태를 안정적으로 유지하며, 손을 떼거나 마우스가 이탈하면 카운트다운이 시작됩니다.
- **좌측 가장자리 빛 줄기 힌트 및 슬라이드 오픈 (확정)**: 사이드바가 닫혀 있을 때 화면 좌측 끝에 은은한 빛 줄기(Edge Glow Hint) 감지 영역을 표시하여 반응성을 직관적으로 알리고, 트리거 시 가볍고 매끄럽게 슬라이드 오픈합니다.

---

### 1. Overview & Core Concept

- **What It Does**: 별도의 메뉴 버튼을 찾아 클릭하지 않아도, 화면 왼쪽 끝으로 마우스를 가져가거나(PC) 왼쪽 가장자리를 쓸어 넘기는(모바일) 자연스러운 동작만으로 사이드바를 즉시 호출하고, 용무가 끝나면 스스로 정리되어 화면 몰입도를 높입니다.
- **Target Audience / Persona**: 대화창(루시/키), 타로·오라클 리딩, 7대 프리즘 채널을 오가며 넓은 화면 몰입감과 빠른 채널 전환을 동시에 원하는 PC 및 모바일 사용자.
- **Key Value**: 화면 상단·하단 고정 버튼의 시각적 간섭을 최소화하면서도, 한 손 엄지 스와이프나 마우스 엣지 이동만으로 즉시 네비게이션과 LP 배경음 컨트롤에 접근할 수 있는 무마찰(Zero-Friction) 탐색 환경을 제공합니다.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **대기 상태 (Edge Glow Hint)**: 사이드바가 닫혀 있을 때 화면 좌측 가장자리(`left: 0`)를 따라 얇고 은은한 프리즘 빛 줄기 인디케이터가 호흡하듯 미세하게 빛나며 상호작용 가능 영역임을 암시합니다.
  2. **PC 좌측 끝 마우스 호버 오픈**: 사용자가 마우스 커서를 화면 좌측 끝 감지 영역(폭 약 14px~18px)으로 옮기면, 빛 줄기가 밝아지며 슬림 아이콘 사이드바가 즉시 오른쪽으로 미끄러지듯 펼쳐집니다.
  3. **모바일 좌측 끝 인워드 스와이프 오픈**: 모바일 화면 좌측 가장자리(좌측 끝 ~28px 이내)에서 안쪽(우측 방향, $\Delta x \ge 36\text{px}$, 수평 이동이 수직 스크롤보다 우세할 때)으로 스와이프하면 사이드바가 펼쳐지고, 타이머 카운트다운(2.5초)이 예약됩니다.
  4. **조작 중 열림 유지 (Interactive Hold)**:
     - PC에서 마우스 커서가 사이드바 내부에 머물러 있거나 7대 채널 아코디언·LP 플레이어 버튼을 조작하는 동안에는 자동 접힘 타이머가 멈추고 열린 상태를 유지합니다.
     - 모바일에서 사이드바 내부를 터치하거나 스크롤·롱프레스하는 동안에도 타이머가 초기화되며, LP 상세 설정 팝업이 열려 있는 동안에도 사이드바가 닫히지 않도록 보호합니다.
  5. **자동 접힘 (2.5초 카운트다운) 및 수동 닫기**:
     - PC에서 마우스가 사이드바 밖으로 벗어나거나, 모바일에서 터치가 끝난 뒤 아무 조작 없이 2.5초가 경과하면 사이드바가 좌측으로 부드럽게 슬라이드 아웃되며 접힙니다.
     - 사이드바 내부에서 반대 방향(좌측)으로 스와이프하거나 배경 영역을 탭하면 2.5초를 기다리지 않고 즉시 닫을 수 있습니다.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: 몰입형 다크/라이트 캔버스를 해치지 않는 유리질(Glassmorphic) 슬림 도크와 프리즘 광채 엣지 라인.
  - *Color Palette & Mood*:
    - 다크 모드: `bg-neutral-950/95` 슬림 레일과 현재 활성 채널의 테마 컬러(또는 골드/에메랄드/퍼플 프리즘 그라데이션)가 반영된 좌측 엣지 발광 라인.
    - 라이트 모드: 따뜻한 아이보리(`bg-[#fdfaf5]/95`) 레일과 은은한 앰버 골드 빛 줄기 힌트.
  - *Component Styling & Layout*:
    - 엣지 힌트 라인은 화면 전체 높이가 아닌 중앙~하단 엄지 도달 영역(Thumb Zone)을 중심으로 세련된 수직 그라데이션 광선 형태로 배치하여 시각적 피로도를 줄이고 터치 유도성을 높입니다.
    - 오토 피크 시 화면 본문 가독성을 유지하면서도 사이드바 아이콘에 시선이 집중되도록 부드러운 스프링 물리 애니메이션(`stiffness: 360, damping: 32`)을 적용합니다.

- **Interactive Feedback & Motion**:
  - 모든 열림/닫힘 전환은 레이아웃 리플로우 없이 `transform`과 `opacity`만을 사용하여 60fps의 매끄러운 모션을 보장합니다.
  - 자동 접힘 카운트다운이 진행될 때 상단 인디케이터 바에 미세한 잔여 시간 피드백을 더해 사용자가 닫히는 타이밍을 직관적으로 인지할 수 있게 합니다.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: 인터랙션 감지 기반의 스마트 2.5초 디바운스 타이머**
  - *Chosen Approach*: 단순 오픈 후 무조건 2.5초 뒤 닫히는 고정 타이머가 아니라, `isPointerInside`(PC 호버) 및 `isTouchingSidebar`(모바일 터치) 상태와 연동되어 **조작이 멈춘 시점부터 2.5초를 카운트**하는 스마트 유휴 타이머를 적용합니다.
  - *Why*: 사용자가 7대 프리즘 채널을 펼쳐서 둘러보거나 LP 배경음 버튼을 길게 눌러 설정할 때 도중에 사이드바가 닫혀버리는 불편을 완벽히 방지합니다.
  - *Alternatives Considered*: 열린 직후 무조건 일정 시간 뒤 닫히는 방식은 메뉴 선택 중 오작동을 유발하므로 배제했습니다.

- **Decision 2: 모바일 수직 스크롤과 좌측 엣지 수평 스와이프의 정밀 분리**
  - *Chosen Approach*: 터치 시작점(`clientX <= 28px`)을 검사하고, 이동 거리에서 수평 변위($\Delta x > 36\text{px}$)가 수직 변위($|\Delta y| \times 1.4$)보다 명확히 클 때만 사이드바 오픈으로 판정합니다.
  - *Why*: 모바일 웹에서 채팅창이나 카드를 위아래로 스크롤할 때 의도치 않게 사이드바가 열리는 현상을 방지하기 위함입니다.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     Viewport Left Edge Gesture Layer                     │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐  │
│  │   Desktop Edge Hover Sensor    │  │  Mobile Edge Touch Recognizer  │  │
│  │ (Left 0~16px Pointer Enter +   │  │ (TouchStart x<=28px -> Swipe   │  │
│  │  Prismatic Glow Line Hint)     │  │  Right Δx>=36px, Δx > |Δy|*1.4)│  │
│  └───────────────┬────────────────┘  └───────────────┬────────────────┘  │
└──────────────────┼───────────────────────────────────┼───────────────────┘
                   │                                   │
                   ▼                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                Sidebar Auto-Peek & Idle Timer Controller                 │
│  • States: isOpen, isHoveringSidebar, isTouchingSidebar, isAutoCounting  │
│  • Pause Conditions: Pointer inside rail | Active touch | LP Hold/Modal  │
│  • Resume Condition: Pointer leave / Touch end -> 2,500ms Auto-Collapse  │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       Slide-In Left Slim Icon Rail                       │
│  • Top Progress/Indicator Pill (Visualizes active hold vs auto-collapse) │
│  • Core Sanctuary & 7 Prism Channels Accordion                           │
│  • LP BGM Mini Vinyl Control & User Profile Action                       │
│  • Leftward Swipe-to-Close & Backdrop Tap-to-Close                       │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `isOpen` (`boolean`): 사이드바 현재 열림/닫힘 상태.
  - `isInteracting` (`boolean`): 마우스가 사이드바 위에 있거나(`onMouseEnter`/`onMouseLeave`), 모바일 터치가 진행 중이거나(`onTouchStart`/`onTouchEnd`), LP 롱프레스/상세 팝업이 활성화된 상태인지 추적.
  - `autoCloseTimerRef` (`Timeout Ref`): 조작이 해제된 순간부터 2,500ms 후 `setIsOpen(false)`를 실행하는 타이머 참조.
  - `edgeSwipeRef` (`{ startX, startY, startTime, isEdgeSwipe }`): 모바일 좌측 끝 인워드 스와이프 및 열린 상태에서의 좌측 아웃워드 스와이프 닫기 제스처 좌표 상태.

- **Interactive Component & State Mapping**:
  - **좌측 엣지 호버 감지 영역 (PC)**: 닫힌 상태에서 화면 좌측 끝(`w-4`) 영역에 마우스가 진입하면 80ms의 짧은 의도 확인 딜레이 후 `setIsOpen(true)`를 호출하여 스쳐 지나가는 마우스 오작동을 줄이고 자연스럽게 오픈합니다.
  - **글로벌 좌측 엣지 터치 리스너 (모바일)**: `window` 레벨의 패시브 터치 이벤트(`touchstart`, `touchmove`, `touchend`)를 통해 좌측 가장자리 밖에서 안쪽으로 쓸어 넘기는 동작을 감지하여 어느 화면에서든 즉시 사이드바를 펼칩니다.
  - **자동 접힘 타이머 동기화**:
    - 사이드바가 열릴 때 마우스가 사이드바 외부에 있거나 모바일 스와이프로 열린 경우 즉시 2.5초 타이머가 가동됩니다.
    - 사용자가 사이드바 위에 마우스를 올리거나 메뉴를 터치하면 타이머가 즉시 클리어(`clearTimeout`)됩니다.
    - 마우스가 사이드바를 떠나거나(`onMouseLeave`) 터치가 끝나면(`onTouchEnd`) 다시 2.5초 카운트다운이 시작되어 만료 시 자동으로 접힙니다.
