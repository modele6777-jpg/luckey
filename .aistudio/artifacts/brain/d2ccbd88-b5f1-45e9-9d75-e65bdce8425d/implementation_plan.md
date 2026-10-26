# iPhone Duo Dual-Screen & 120Hz ProMotion Optimization

Adaptive responsive engine and performance tuning tailored specifically for the iPhone Duo form factor (5.4-inch outer cover screen and 7.6-inch unfolded inner screen) with seamless single/dual workspace transitions and 120Hz ProMotion GPU acceleration.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during the interactive interview and govern the implementation:

- **Target Screens**: Both the folded 5.4-inch outer screen (1398 × 2034) and the unfolded 7.6-inch inner screen (1878 × 2670) will be dynamically supported and automatically detected.
- **Inner Screen Layout**: When the 7.6-inch inner screen is active (or in landscape/unfolded state), the app automatically activates the 2-column dual split layout (`duo-dapp-workspace` with left interaction/input and right results/history).
- **Motion & Refresh Rate**: 120Hz ProMotion GPU hardware acceleration (`translate3d`, `will-change`, touch response zero-latency) enabled for ultra-smooth fluid transitions and instantaneous tactile haptics.

---

### 1. Overview & Core Concept

- **What It Does**: Optimizes the entire LucKey ecosystem for the iPhone Duo foldable dual-screen hardware. When folded on the 5.4-inch cover screen, it renders a sleek, thumb-friendly single-column view with touch targets $\ge 44\text{px}$. When unfolded to the 7.6-inch inner screen (aspect ratio ~1.05:1, 14cm × 13.3cm), it dynamically unlocks the dual-pane workspace across all 9 dApps.
- **Target Audience / Device**: iPhone Duo users switching between on-the-go quick one-handed check-ins (outer display) and immersive multi-tasking sessions (unfolded inner display).
- **Key Value**: Eradicates layout truncation, excessive vertical stacking on the wide inner screen, and sluggish touch latency, unlocking full 120Hz fluidity.

---

### 2. User Experience & Visual Design

#### A. 5.4-inch Outer Cover Screen (Compact Mobile Experience)
- **Viewport Dimension**: ~466 × 678 CSS pixels (1398 × 2034 @3x DPR).
- **Layout Rhythm**: Single-column continuous natural scroll (`max-w-md mx-auto`).
- **Thumb-Zone Ergonomics**:
  - Critical action CTAs pinned in the bottom 40% natural thumb reach zone.
  - Sticky surface cap strictly maintained under 15% of viewport height.
  - Generous touch hitboxes ($\ge 44\text{px}$) for all buttons, tabs, and Tarot wheel cards.
- **Tarot Wheel Optimization**: Calibrated wheel radius (310px) and vertical offset to ensure the full 78-card arc and active cards remain unobstructed above the bottom bezel.

#### B. 7.6-inch Unfolded Inner Screen (Wide Dual-Pane Workspace)
- **Viewport Dimension**: ~626 × 890 CSS pixels (or ~720–939px depending on scaling, 1878 × 2670 @ DPR).
- **Automatic Dual-Split Activation**:
  - Activates `.duo-dapp-workspace` via CSS rule: `html.dual-pane-active .duo-dapp-workspace`, `html.perf-duo .duo-dapp-workspace`, or `@media (min-width: 620px) and (min-aspect-ratio: 0.85/1)`.
  - **Left Column**: Interactive controls, question input form, draw decks, breathing spheres, meditation timers.
  - **Right Column**: Comprehensive AI readings, Lucy advice cards, historical logs, and reflection timelines.
- **Hinge & Margin Balance**: Automatic optical hinge gap padding (`var(--duo-hinge-gap, 1.25rem)`) preventing content from colliding in the fold zone.

#### C. 120Hz ProMotion & Interaction Latency
- Native 120fps hardware acceleration via compositor-only properties (`transform: translate3d(0,0,0)`, `opacity`, `will-change: transform`).
- Removal of any 300ms mobile touch delay via `touch-action: manipulation`.
- Elimination of iOS overscroll rubber-banding glitches during card picking and horizontal wheel drag.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Breakpoint Strategy for Dual-Split Activation**
  - *Chosen Approach*: Update `isDualPaneLayout()` in `src/lib/perfMode.ts` and `.duo-dapp-workspace` in `src/index.css` to trigger not just on `@media (min-width: 1024px)`, but also when `html.dual-pane-active` or `html.perf-duo` is present, or when viewport width is $\ge 620\text{px}$ with a foldable aspect ratio ($\ge 0.82$).
  - *Why*: The iPhone Duo inner screen is 7.6 inches with 1878 × 2670 resolution, which yields a CSS width around 626px to 890px. A rigid `min-width: 1024px` check leaves this wide foldable screen stranded in a stretched single-column layout.
  - *Alternatives Considered*: Manual user toggle only. (Rejected: automatic dynamic response on screen fold/unfold is far more seamless).

- **Decision 2: Device Profile & 120Hz Unlocking**
  - *Chosen Approach*: Treat iPhone Duo as a tier-1 high-performance device (`perf-duo-ultra`), stripping all legacy low-power throttling (`perf-reduced`, `perf-legacy`) and setting GPU compositing flags.
  - *Why*: Both outer and inner screens feature 120Hz refresh rates and modern Apple silicon, capable of rendering rich 3D card flips and particles at native 120fps.

- **Decision 3: Safe Area Insets & Top Bar Geometry**
  - *Chosen Approach*: Dynamically clamp Safe Area Insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) with max boundaries to avoid excessive blank headers on compact outer screen while keeping the notch/dynamic island clear.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        iPhone Duo Device Engine                        │
│                                                                        │
│   ┌─────────────────────────────┐    ┌─────────────────────────────┐   │
│   │  5.4" Outer Screen (Folded) │    │  7.6" Inner Screen (Unfolded)│  │
│   │   1398 × 2034 (~466px CSS)  │    │   1878 × 2670 (~626-890px)  │   │
│   └──────────────┬──────────────┘    └──────────────┬──────────────┘   │
│                  │                                  │                  │
│                  ▼                                  ▼                  │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │              Responsive Detection (perfMode.ts)                │   │
│   │  • isSurfaceDuoOrDualScreen() / isDualPaneLayout()             │   │
│   │  • Fold aspect ratio & DPR calculation                         │   │
│   │  • Unlocks 120Hz ProMotion (html.perf-duo-ultra)               │   │
│   └──────────────────────────────┬─────────────────────────────────┘   │
│                                  │                                     │
│                  ┌───────────────┴───────────────┐                     │
│                  ▼                               ▼                     │
│   ┌─────────────────────────────┐ ┌─────────────────────────────┐     │
│   │  Single-Column Mobile Flow  │ │   Dual-Pane Workspace Grid  │     │
│   │   - 100% natural stack      │ │   - Left: Controls & Input  │     │
│   │   - Thumb reach ergonomics  │ │   - Right: Insights & Feeds │     │
│   │   - Optimized Tarot wheel   │ │   - Balanced 1:1 split      │     │
│   └─────────────────────────────┘ └─────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────┘
```

#### Key Files to Modify:
1. `src/lib/perfMode.ts`:
   - Enhance `isSurfaceDuoOrDualScreen()` and `isDualPaneLayout()` to recognize iPhone Duo geometry (5.4" outer ~440–480px, 7.6" inner ~620–890px with aspect ratio $\ge 0.82$).
   - Ensure dynamic resize/orientation change listeners update `html.dual-pane-active` and `html.perf-duo` in real time.
2. `src/index.css`:
   - Extend `.duo-dapp-workspace` so that `html.dual-pane-active .duo-dapp-workspace` and `html.perf-duo .duo-dapp-workspace` render 2 columns on $\ge 620\text{px}$ aspect ratio screens.
   - Add 120Hz ProMotion GPU transform and touch-action optimization classes.
3. `src/components/trinity/TarotSpread.tsx`:
   - Fine-tune card wheel radius and offset for 5.4-inch outer screen vs 7.6-inch inner screen to prevent card slot collision and improve selection accuracy.
4. Versioning & Changelog (per AGENTS.md rule):
   - Bump version to `1.4.469` in `package.json`, update `public/version.json`, prepend `public/changelog.json`.
