# 좌측 하단 플로팅 네비게이션 버튼(FAB) 배치 및 하단 위젯 레이아웃 최적화

사이드바를 여는 진입 버튼을 기존 화면 좌측 중앙(`top-1/2`)에서 **화면 좌측 하단(Bottom-Left)**으로 이동하고, 사용자가 선택한 **둥근 플로팅 FAB(Floating Action Button)** 스타일로 개선합니다. 또한 좌측 하단에 위치한 배경음악(BGM) 위젯을 버튼의 우측으로 자연스럽게 배치하여 시각적 간섭을 해소합니다.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> 사전 질의응답을 통해 사용자가 선택한 사양이 확정되었습니다.

- **확정 결정 1 (버튼 형태)**: 좌측 하단에 상시 고정되는 **둥근 플로팅 FAB(Floating Action Button)** 디자인 적용 (코스믹 글래스모피즘 + 앰비언트 활성 채널 글로우).
- **확정 결정 2 (BGM 위젯 조율)**: 네비게이션 FAB을 **최좌측 하단(`left-3.5`)**에 고정하고, 배경음악(BGM) 플레이어 위젯을 그 **우측(`left-[4.75rem]`)**으로 이격 배치하여 원터치 조작성과 심미성을 동시에 확보.

---

## 1. Overview & Core Concept

- **What It Does**:
  - 한 손 모바일 조작 및 데스크톱 환경 모두에서 가장 엄지손가락/마우스 동선이 편안한 화면 좌측 하단 모서리에 네비게이션 메뉴 버튼을 배치합니다.
  - 둥근 글래스 FAB 버튼을 탭하면 현재 활성화된 채널 색상의 빛과 함께 좌측 드로어 패널이 부드럽게 펼쳐집니다.
  - 배경음악 위젯과의 중첩을 원천 차단하여 두 기능 모두 깔끔하게 독립 동작합니다.
- **Key Value**:
  - **모바일 한 손 조작 최적화**: 화면 중앙부까지 손을 뻗을 필요 없이 화면 하단에서 즉시 메뉴 열람 가능.
  - **시각적 일체감**: 하단 우측(또는 중앙)의 BigBang 버튼과 함께 균형 잡힌 하단 독(Dock) 감성 연출.

---

## 2. User Experience & Visual Design

### 화면 하단 레이아웃 구조

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                  본문 콘텐츠 영역                      │
│                                                        │
├────────────────────────────────────────────────────────┤
│ [ 🧭 ]  [ ♫ BGM 도크 ]       [ 🪐 BigBang ]   [ ★ FAB ]│
│  (좌측)   (우측 이격)           (중앙)          (우측) │
│ ────────────────────────────────────────────────────── │
│           하단 세이프 에리어 (safe-area-inset-bottom)    │
└────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **좌측 하단 FAB 버튼**:
  - 위치: `fixed left-3.5 sm:left-5 z-[400]`, 하단 높이 `bottom: calc(var(--sab) + 1.25rem)`.
  - 형태: 지름 46px~48px의 완벽한 원형 플로팅 글래스 FAB (`w-11 h-11 sm:w-12 sm:h-12 rounded-full`).
  - 질감: `bg-neutral-950/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.65)]`.
  - 아이콘 & 인디케이터:
    - 센터에 세련된 나침반(`Compass`) 또는 메뉴(`Menu`) 아이콘.
    - 테두리 주변에 현재 활성 채널(루시, 프롤로그, 타로 등)의 고유 테마 컬러를 띤 펄스 링(Pulse Ring) 앰비언트 글로우.
    - 탭할 때 자연스러운 스케일 바운스 피드백 (`active:scale-90 transition-transform`).
- **배경음악(BGM) 위젯 연동**:
  - CSS `.bottom-safe-music`의 `left` 위치를 네비게이션 버튼 우측인 `calc(var(--sal) + 4.75rem)`로 오프셋 조정.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: 둥근 플로팅 FAB 채택**
  - *이유*: 엣지 탭 형태보다 모바일에서 탭 타깃(`48px`)이 확실하고, 화면 바깥으로 손가락이 미끄러지지 않는 명확한 누름 영역 제공.
- **Decision 2: BGM 도크 수평 이격**
  - *이유*: 위젯을 세로로 겹쳐 쌓으면 본문 하단 콘텐츠를 너무 많이 가리게 되므로, 수평 축 상에 나란히 배치하여 본문 가림을 최소화함.

---

## 4. Technical Architecture & File Changes

### File Changes Checklist

1. **`src/components/navigation/LeftSidebarNav.tsx` (수정)**
   - 미니 탭 핸들을 `fixed left-3.5 bottom-safe-nav-fab` 형태의 둥근 플로팅 FAB 버튼으로 변경.
   - 활성 채널 컬러 글로우 링 및 호버 툴팁 적용.
2. **`src/index.css` (수정)**
   - `.bottom-safe-nav-fab` 신규 유틸리티 클래스 정의 (`bottom: calc(var(--sab) + 1.25rem); left: calc(var(--sal) + 0.875rem);`).
   - `.bottom-safe-music`의 `left` 위치를 `calc(var(--sal) + 4.75rem)`로 업데이트하여 네비게이션 FAB 우측에 정렬.
3. **버전 및 변경 로그 규정 준수**
   - `package.json` 버전 패치 범프 (`1.4.258` -> `1.4.259`).
   - `public/version.json` 및 `public/changelog.json` 업데이트.
   - `npm run lint` 및 `npm run build` 검증.

---

## 5. Verification Plan

- [ ] 사이드바 열기 버튼이 화면 좌측 하단에 둥근 FAB 형태로 미려하게 고정되는지 확인.
- [ ] 버튼 클릭 시 좌측 사이드바 드로어가 매끄럽게 열리고 닫히는지 확인.
- [ ] 배경음악(BGM) 플레이어 위젯이 네비게이션 FAB 우측에 겹침 없이 나란히 배치되는지 확인.
- [ ] iOS 및 안드로이드 하단 세이프 에리어(`--sab`) 위로 안전하게 안착하는지 확인.
- [ ] `npm run lint` 및 `npm run build` 정상 통과 확인.
