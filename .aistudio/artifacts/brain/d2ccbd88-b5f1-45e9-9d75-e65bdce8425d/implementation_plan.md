# 외부 음악 앱 및 내부 힐링 BGM과 TTS 동시 재생 (오디오 믹싱 & 더킹 아키텍처)

유튜브 뮤직, 멜론, 스포티파이, 애플 뮤직 등 외부 음악 앱으로 음악을 감상하는 도중에도 음악이 멈추지 않고 루시 및 도슨트 TTS 음성이 동시에 자연스럽게 믹싱되어 재생되도록 오디오 세션 및 재생 파이프라인을 개편합니다.

## User Review & Critical Decisions

> [!IMPORTANT]
> 사용자 답변을 바탕으로 확정된 오디오 믹싱 정책입니다.

- **외부 음악 앱과의 동시 재생 및 볼륨 더킹**: 외부 음악 앱의 재생을 강제로 중지시키지 않고 동시에 재생하며, 운영체제/브라우저가 지원하는 기기에서는 TTS 발화 중에만 외부 음악 볼륨을 살짝 줄여(Transient Ducking) 음성이 또렷하게 들리도록 처리합니다.
- **앱 내부 힐링 BGM과의 동시 재생**: TTS가 나올 때 앱 내부 배경음악(BGM)이 급격히 줄어들거나 끊기지 않고, 배경음악과 TTS 음성이 함께 자연스러운 밸런스로 어우러져 재생되도록 유지합니다.

---

## 1. Overview & Core Concept

- **What It Does**: 기존에는 TTS 재생 시 브라우저가 운영체제의 독점 미디어 포커스(Exclusive Audio Focus)를 가져가 외부 음악 앱이 일시정지되었으나, 이제 비독점 오디오 믹싱 파이프라인을 통해 외부 음악과 TTS가 끊김 없이 동시에 출력됩니다.
- **Target Audience / Persona**: 유튜브 뮤직·멜론·스포티파이 등으로 좋아하는 음악을 들으면서 동시에 타로 리딩, 루시 AI 대화, 1분 명상 및 도슨트 음성 안내를 함께 듣고자 하는 모바일·데스크톱 사용자.
- **Key Value**: 음악 감상의 흐름이 끊기지 않는 몰입감과 선명한 음성 전달력을 동시에 제공합니다.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. 사용자가 외부 음악 앱(유튜브 뮤직, 멜론, 스포티파이 등)에서 음악을 재생한 상태로 앱에 진입합니다.
  2. 루시 대화창이나 도슨트 안내에서 TTS 듣기 버튼을 누르거나 자동 음성 낭독이 시작됩니다.
  3. 외부 음악이 정지되지 않고 계속 흐르며(지원 기기에서는 외부 음악 볼륨이 부드럽게 살짝 낮아짐), 그 위로 루시의 음성이 또렷하게 겹쳐서 재생됩니다.
  4. 앱 내부 힐링 BGM을 켜둔 경우에도 BGM 볼륨이 급격히 꺼지지 않고 TTS 음성과 함께 자연스럽게 조화를 이루며 재생됩니다.
  5. TTS 낭독이 끝나면 외부 음악 볼륨이 즉시 원래대로 복원됩니다.
- **Visual Identity & Theme**:
  - 기존 UI 디자인과 금빛 빅뱅 버튼, 라이트/다크 테마를 그대로 유지하며, TTS 재생 중 문장 하이라이트 및 일시정지/재개/정지 컨트롤의 즉각적인 반응성을 보존합니다.
- **Interactive Feedback & Motion**:
  - TTS 일시정지(`pause`) 및 이어듣기(`resume`) 시 오디오 버퍼 오프셋을 정밀하게 추적하여, 외부 음악과 동시 재생 중에도 문장 중간부터 끊김 없이 즉시 재개됩니다.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: 독점 미디어 엘리먼트(`HTMLAudioElement`) 대신 Web Audio API 믹싱 버퍼 엔진을 주 재생기로 전환**
  - *Chosen Approach*: TTS 오디오(PCM 및 압축 MP3/WAV)를 공유 `AudioContext`의 `AudioBufferSourceNode` 및 전용 보이스 게인 버스를 통해 디코딩·재생하고, 외부 음악을 멈추게 하는 무음 `<audio>` 루프(`ttsKeepAliveEl`)와 독점 `<audio>` 재생을 비활성화합니다.
  - *Why*: 모바일 iOS 및 Android 운영체제는 `<audio>` 태그가 재생될 때 이를 '새로운 뮤직 플레이어 앱'으로 인식하여 기존에 켜져 있던 멜론·유튜브 뮤직·스포티파이를 강제로 일시정지시킵니다. 반면 Web Audio API는 시스템 오디오 믹서 위에서 효과음/보이스 레이어로 합성되므로 외부 음악 앱을 멈추지 않고 동시 재생이 가능합니다.
  - *Alternatives Considered*: `<audio>` 태그를 유지한 채 미디어 세션만 숨기는 방식은 Android Chrome과 iOS Safari의 OS 레벨 오디오 포커스 정책 때문에 여전히 외부 음악을 중지시키므로 제외했습니다.
- **Decision 2: W3C AudioSession API 기반 스마트 더킹(`transient` / `ambient`) 적용**
  - *Chosen Approach*: `navigator.audioSession`을 지원하는 환경에서 TTS 발화 시작 시 세션을 `'transient'`(외부 음악 동시 재생 + 일시적 볼륨 더킹)로 우선 설정하고, 미지원 시 `'ambient'`(외부 음악 동시 재생)로 폴백하며, 발화 종료 시 즉시 `'ambient'`로 복원합니다. 또한 `navigator.mediaSession.playbackState = 'playing'` 독점 선언을 제거하여 외부 음악 앱의 잠금화면 컨트롤러를 빼앗지 않도록 합니다.
  - *Why*: 외부 음악 앱의 재생 상태를 보호하면서도, 지원 기기에서는 음성 안내 동안 외부 음악 볼륨만 살짝 낮춰 가청성을 높일 수 있습니다.
- **Decision 3: 앱 내부 힐링 BGM 자연스러운 동시 재생 및 보이스 명료도 보정**
  - *Chosen Approach*: TTS 시작 시 내부 BGM을 25%로 대폭 줄이던 기존 강제 더킹을 해제하여 내부 BGM이 자연스러운 볼륨(90%~100%)을 유지하도록 하고, TTS 출력 버스에는 보이스 대역이 선명하게 들리도록 마스터 버스 연결을 최적화합니다.
  - *Why*: 사용자가 요청한 "앱 내부 배경음악도 함께 자연스럽게 재생" 경험을 충실히 구현합니다.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────┐
│                   OS System Audio Mixer (iOS / Android)              │
│  ┌────────────────────────────┐    ┌──────────────────────────────┐  │
│  │ External Music Apps        │    │ PRISM Web Audio Engine       │  │
│  │ (YouTube Music / Melon /   │    │ (Non-Exclusive Mixing Layer) │  │
│  │  Spotify / Apple Music)    │    └──────────────┬───────────────┘  │
│  └─────────────▲──────────────┘                   │                  │
└────────────────┼──────────────────────────────────┼──────────────────┘
                 │                                  │
   AudioSession: 'transient' / 'ambient'            ▼
   (Ducks external music gently;        ┌───────────────────────────┐
    never claims exclusive focus)       │ Shared AudioContext       │
                                        │  ├─ Voice Bus (TTS Audio) │
                                        │  │   └─ BufferSourceNode  │
                                        │  │      (Pause/Resume     │
                                        │  │       Offset Tracker)  │
                                        │  └─ Ambient Bus (In-App   │
                                        │      Healing BGM - 95%    │
                                        │      Natural Co-Playback) │
                                        └───────────────────────────┘
```

- **Data Model & State**:
  - **Web Audio TTS Playback Controller**: 현재 재생 중인 `AudioBuffer`, 시작 타임스탬프(`startedAtContextTime`), 일시정지 누적 오프셋(`pausedOffsetSec`), 재생 상태(`playing` | `paused` | `stopped`)를 관리하여 `AudioBufferSourceNode` 기반에서도 정확한 일시정지(`pauseTTSAudio`)와 이어듣기(`resumeTTSAudio`)를 지원합니다.
  - **Audio Session Coordinator**: TTS 발화 시작 시 `configureTransientDuckingAudioSession()`을 호출해 `'transient'`(실패 시 `'ambient'`) 모드를 활성화하고, 발화 완료/정지 시 `configureAmbientAudioSession()`으로 복귀합니다.
- **Interactive Component & State Mapping**:
  - **TTS 발화 시작 (`playTTS` / `playTTSInChunks` / `playTTSAudio`)**:
    1. `configureTransientDuckingAudioSession()`으로 외부 음악 앱 중단 방지 및 볼륨 더킹 힌트 전달.
    2. 수신된 PCM 또는 MP3/WAV 오디오 데이터를 공유 `AudioContext`의 `AudioBuffer`로 디코딩하여 보이스 버스로 즉시 출력.
    3. 앱 내부 BGM은 급격한 볼륨 감쇄 없이 자연스러운 밸런스로 동시 유지.
  - **TTS 일시정지 / 재개 / 정지 (`pauseTTS` / `resumeTTS` / `stopTTS`)**:
    1. 일시정지 시 현재 재생 오프셋을 기록하고 보이스 소스만 정지하여, 앱 내부 BGM과 외부 음악은 끊김 없이 계속 재생되도록 유지(전체 `AudioContext.suspend()` 호출 제거).
    2. 재개 시 저장된 오프셋(`pausedOffsetSec`)부터 새로운 `AudioBufferSourceNode`를 즉시 연결해 자연스럽게 이어서 발화.
    3. 정지 또는 완독 시 오디오 세션을 `'ambient'`로 복원하여 외부 음악 볼륨을 원래대로 되돌림.
