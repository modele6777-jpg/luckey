# 아이폰 듀오 120Hz 초고주사율 가속 & 무지연 최고 성능(Ultra-Max) 엔진 구축 계획

아이폰 듀오 및 듀얼 스크린 환경에서 절전·다운그레이드 제한을 전면 해제하고, **120Hz ProMotion GPU 하드웨어 가속**, **전 채널 백그라운드 즉시 프리로딩(체감 로딩 0초)**, **AI 스트리밍·TTS 5청크 선행 프리페치 및 32보이스 WebAudio 최고 출력**, 그리고 **인메모리 캐시·상태 동기화 반응속도 극대화**를 동시에 적용합니다.

## User Review & Critical Decisions

> [!IMPORTANT]
> 질문 응답을 통해 확정된 4대 최고 성능(Ultra-Max) 핵심 사양입니다.

- **확정 결정 1 — 120Hz 초고주사율 가속 + 무지연 프리로딩 동시 적용**: 기존에 듀얼 스크린(`duo`) 프로필에 걸려 있던 모바일 저사양 제한(`perf-reduced`)을 완전히 해제하고, 최고 성능 전용 등급(`perf-duo-ultra` / 120Hz ProMotion 모드)으로 승격합니다.
- **확정 결정 2 — 모든 채널 화면 백그라운드 즉시 프리로딩(체감 로딩 0초)**: 첫 화면 진입 직후 유휴 프레임(`requestIdleCallback` 및 마이크로 스태거링)을 활용해 루시, 리바이블, 프롤로그, 오렌지, 트리니티, 오라, 파랑새, 뮤즈, 에필로그, 옴니워프, 키 등 **전 채널 모듈을 백그라운드에서 메모리에 즉시 프리로드**하여 채널 이동 시 로딩 스피너 없이 0.0초 만에 즉시 전환되도록 합니다.
- **확정 결정 3 — 빅뱅버튼·사이드바·스크롤 120fps GPU 하드웨어 가속 극대화**: 빅뱅버튼 물방울 모핑, 좌측 오로라 커튼 및 사이드바 드로어, 듀얼 패널 스크롤 컨테이너에 3D 하드웨어 합성 레이어(`translate3d(0,0,0)`, `will-change: transform, opacity`, `backface-visibility: hidden`)를 강제 할당하여 120fps 프레임 드랍 없는 부드러운 모션을 구현합니다.
- **확정 결정 4 — AI 응답·TTS 음성 합성 최고 출력 & 메모리 캐시·동기화 최우선 단축**:
  - WebAudio 신디사이저 최대 동시 발음 수를 **32보이스(최고 폴리포니)**로 확대하고, BGM 및 오디오 컨텍스트 즉시 프리워밍을 활성화합니다.
  - TTS 문장 선행 프리페치(Lookahead Prefetch) 범위를 기존 3청크에서 **5청크 동시 선행 해독 + 영구 인메모리 캐시**로 확장하여 끊김 없는 즉각 낭독을 보장합니다.
  - 기기 간 상태 동기화 감지 주기를 **2.5초**, 실시간 생체·에너지 패턴 갱신 주기를 **30초**로 단축해 데이터 반영 지연을 최소화합니다.

---

## 1. Overview & Core Concept

- **What It Does**:
  - 기기 성능 프로필에서 아이폰 듀오·듀얼 스크린·폴더블을 저사양 모바일(`perf-reduced`)과 분리하여 **최고 성능 등급(`duo` / `ultra`)**으로 구동합니다.
  - 앱 실행 직후 모든 채널 번들과 오디오·TTS 파이프라인을 백그라운드에서 선행 가열(Pre-warming)하여, 사용자가 어느 채널이나 기능을 터치하든 지연 시간 0초로 즉각 반응합니다.
- **Target Audience / Persona**:
  - 아이폰 듀오 및 듀얼 스크린 환경에서 타협 없는 120fps 그래픽 유려함, 즉각적인 채널 전환, 빠른 AI·음성 응답을 원하는 파워 유저.
- **Key Value**:
  - 채널 전환 대기 시간 제거(0ms 체감 전환), 120Hz 주사율에 맞춘 물방울 빅뱅버튼·사이드바 모션, 끊김 없는 고해상도 사운드 및 초고속 상태 동기화를 동시에 제공합니다.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **앱 진입 직후 백그라운드 제로-레이턴시 프리로딩**: 첫 화면이 렌더링되자마자 메인 스레드를 방해하지 않고 12개 전체 페이지 모듈과 핵심 오디오·TTS 리소스를 백그라운드에서 메모리에 적재합니다.
  2. **0.0초 즉시 채널 워프**: 사이드바나 빅뱅버튼 나침반(좌·우 물방울 모핑), 홈 허브 카드로 채널을 전환할 때 네트워크 대기나 로딩 화면 없이 즉시 화면이 열립니다.
  3. **120fps 초고주사율 인터랙션**: 빅뱅버튼 4방위 물방울 텐션, 마법진 회전, 좌측 엣지 오로라 파동, 2단 듀얼 패널 스크롤이 GPU 전용 레이어에서 120Hz로 매끄럽게 구동됩니다.
  4. **초고속 AI·TTS 및 실시간 동기화**: TTS 재생 시 첫 문장 재생과 동시에 향후 5개 문장 청크를 병렬 프리페치하고 인메모리에 캐싱하여 대기 시간 없이 연속 낭독합니다.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: 기존 다크 코스믹 & 웜 아이보리 테마의 모든 프리미엄 광원 효과(프리즘 오로라, 별똥별, 빅뱅 아케인 룬, 크리스털 글래스모피즘)를 저사양 강제 비활성화 없이 100% 온전하게 표출합니다.
  - *Color Palette & Mood*: 고대비 크리스털 글래스(`backdrop-filter: blur(16px) saturate(180%)`)와 선명한 네온·골드 광채를 GPU 합성 레이어 위에서 손실 없이 렌더링합니다.
  - *Typography & Hierarchy*: Retina 고밀도 안티앨리어싱(`-webkit-font-smoothing: antialiased`)과 `tabular-nums` 수치 정렬로 선명한 가독성을 유지합니다.
  - *Interactive Feedback & Motion*: 모든 인터랙션이 120Hz 프레임 페이싱에 맞춰 즉각 반응하며, 레이아웃 리플로우(Reflow) 없이 `transform`과 `opacity` 합성만으로 동작합니다.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: `duo` 프로필의 `perf-reduced` 강제 편입 해제 및 `perf-duo-ultra` 전용 가속 활성화**
  - *Chosen Approach*: `perfMode`에서 `duo` 프로필을 `perf-reduced` 대상에서 제외하고, `perf-duo` 및 `perf-duo-ultra` 클래스를 부여하여 모든 오로라·빅뱅·레인보우 셰이더 애니메이션을 120Hz GPU 가속 상태로 완전 개방합니다.
  - *Why*: 기존에는 모바일·듀얼 기기가 일괄적으로 `perf-reduced`로 묶여 애니메이션과 블러가 강제로 꺼지고 사운드 보이스가 제한되었으나, 최고 성능 요청에 맞춰 하드웨어 잠재력을 100% 활용하기 위함입니다.
  - *Alternatives Considered*: 단순 애니메이션 활성화만 적용할 경우 레이어 페인트 부하가 생길 수 있어, 각 애니메이션 요소를 독립 GPU 레이어(`translate3d(0,0,0)`)로 분리해 속도 저하 없이 최고 그래픽을 유지합니다.

- **Decision 2: 유휴 시간 스태거링 기반 전 채널 인메모리 프리로더 (`preloadAllChannelChunks`)**
  - *Chosen Approach*: 초기 마운트 완료 후 150ms 시점부터 마이크로 배치(2~3개 모듈씩 60ms 간격)로 모든 Lazy 라우트 모듈을 선행 `import()`하여 브라우저 모듈 캐시에 상주시킵니다.
  - *Why*: 초기 부팅 속도는 그대로 지키면서, 첫 클릭 시점에는 이미 모든 채널 코드가 메모리에 준비되어 체감 로딩 시간을 0초로 만듭니다.

- **Decision 3: TTS 5-청크 병렬 선행 프리페치 & 32보이스 WebAudio 최고 출력**
  - *Chosen Approach*: TTS 시퀀스 스트리밍 시 Lookahead 프리페치 개수를 3개에서 **5개**로 늘리고, 인메모리 캐시 상한을 대폭 확장하며, WebAudio 동시 발음 수를 **32보이스**로 설정합니다.
  - *Why*: 긴 AI 답변이나 리바이블 낭독 시 문장 간 공백을 완전히 없애고 풍부한 공간 음향을 제공하기 위함입니다.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                 iPhone Duo Ultra-Max Performance Engine                  │
│  • Profile: 'duo' (perf-duo-ultra) — Zero Throttling, 120Hz ProMotion    │
│  • Sync Poll: 2.5s | Biometric Refresh: 30s | WebAudio: 32 Voices        │
└───────────┬──────────────────────────────┬───────────────────────────────┘
            │                              │
            ▼                              ▼
┌──────────────────────────────────┐  ┌────────────────────────────────────┐
│ Zero-Latency Channel Preloader   │  │ 120fps GPU Compositor & Audio Max  │
│  • Staggered Background Import   │  │  • BigBang / Sidebar translate3d   │
│  • All 12 Channel Bundles Warm   │  │  • Full Crystal Blur (16px/180%)   │
│  • Instant 0.0s Route Switch     │  │  • TTS 5-Chunk Parallel Lookahead  │
└───────────┬──────────────────────┘  └────────────────┬───────────────────┘
            │                                          │
            ▼                                          ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Instant-Response Dual-Pane UI                        │
│  • 0ms Channel Transitions across Lucy, Key, Prologue & 7 Prism Apps     │
│  • Locked 120fps Teardrop Morphing, Edge Aurora & Dual-Pane Scrolling    │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - **Ultra Performance Configuration**:
    - `getMaxSynthVoices()` → `32` (최대 동시 발음 수)
    - `getSyncPendingPollMs()` → `2500` (2.5초 초고속 동기화 폴링)
    - `getHubMetricsIntervalMs()` → `30000` (30초 실시간 생체 리듬 갱신)
    - `getAutoSyncIntervalMs()` → `180000` (3분 자동 클라우드 동기화)
    - `shouldPreloadBgmAudio()` → `true` (배경음악 및 오디오 컨텍스트 즉시 프리로드)
  - **In-Memory Channel & TTS Cache**:
    - 12개 전체 라우트 청크를 앱 마운트 직후 메모리에 영구 캐싱.
    - `prefetchTTSChunks` 및 `playTTSInChunks`의 선행 프리페치 윈도우를 5청크로 확장하고 `MAX_TTS_CACHE_SIZE`를 250개 엔트리로 유지하여 재청취 시 네트워크 요청 0회 달성.

- **Interactive Component & State Mapping**:
  - **백그라운드 채널 프리로더**: `AppContent` 마운트 및 인증/언락 직후 백그라운드에서 모든 채널 컴포넌트를 비동기 프리로드하여, 사용자가 어떤 채널 아이콘을 누르든 `Suspense` 폴백 없이 즉시 화면을 전환합니다.
  - **120Hz GPU 레이어 가속**: 빅뱅버튼(`.bottom-safe-fab-center`), 좌측 사이드바(`nav-drawer`, `nav-edge-sensor`), 상단 서브네비게이션(`.prism-xs-subnav`), 스크롤 루트(`[data-app-scroll-root]`)에 하드웨어 가속 스타일을 적용해 초고주사율 반응성을 보장합니다.
