# Auto-Hiding Sidebar with Gesture/Hover Peek & Screen Ratio Recalibration

Enhance the navigation sidebar into an intelligent auto-hiding floating drawer that stays hidden during focused app interaction, smoothly slides in on edge hover or swipe gestures, displays a subtle translucent hint handle on the right edge, auto-collapses after 3 seconds of inactivity, and restores 100% full-screen canvas width across all viewports.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during interactive clarification and serve as core requirements for this implementation:

- **Confirmed Decision 1 (Overlay & Ratio)**: The sidebar operates as a floating slim overlay (`z-[480]`) rather than pushing or shrinking main app content. Main content width expands to a true 100% (`padding-right: 0`), preventing canvas compression or asymmetrical shifts.
- **Confirmed Decision 2 (Edge Indicator)**: When the sidebar is collapsed, a slim translucent vertical hint handle (`w-2.5` to `w-3` glass pill) remains visible along the right edge to afford discovery without obstructing UI elements.
- **Confirmed Decision 3 (Interaction & Auto-Hide Timing)**: The sidebar automatically slides out upon hovering the right edge or swiping left from the edge. It automatically dismisses after **3 seconds of inactivity** or when the pointer moves outside the sidebar. Users can also swipe right or tap outside to collapse immediately.

---

## 1. Overview & Core Concept

### What It Does
1. **Intelligent Auto-Hiding**: Collapses the persistent 70px sidebar into a subtle edge tab by default, freeing up horizontal real estate on mobile devices (e.g., iPhone Duo cover and inner screens), tablets, and desktop displays.
2. **Gesture & Pointer Peek**:
   - **Desktop**: Hovering within 16px of the right edge (or hovering the handle) immediately expands the sidebar into view. Moving the mouse away or remaining idle for 3 seconds smoothly collapses it back.
   - **Touch / Mobile**: Swiping leftwards from the right edge triggers the sidebar to slide in smoothly with tactile haptic feedback. Swiping rightwards or tapping the backdrop dismisses it.
3. **Screen Aspect Ratio Recalibration**: Removes the hardcoded `--sites-sidebar-width: 70px` gutter from the main app layout (`sites-pinned-main`), allowing tarot wheels, dual-split columns, universe portals, and canvas charts to center themselves symmetrically across the true device viewport.

---

## 2. User Experience & Visual Design

### Key User Flows
```
+------------------------------------------------------------------+
| Normal State (100% Full Viewport)                                |
|                                                                  |
| [ Main App Canvas / Dual Split DApp Workspace / Tarot Wheel ]    |
|                                                                  |
|                                                       [|] Edge   |
|                                                           Handle |
+------------------------------------------------------------------+
                                 │
           (Hover right edge or swipe left from handle)
                                 ▼
+------------------------------------------------------------------+
| Peek State (Slim Floating Overlay)                               |
|                                              +-----------------+ |
| [ Main App Canvas remains 100% visible]      | 70px Floating   | |
|                                              | Aurora Drawer   | |
|                                              | [LUCY / KEY]    | |
|                                              | [7 Channels]    | |
|                                              | [LP Player]     | |
|                                              +-----------------+ |
+------------------------------------------------------------------+
                                 │
     (3s inactivity / pointer leaves / swipe right / backdrop tap)
                                 ▼
+------------------------------------------------------------------+
| Returns smoothly to Collapsed State                              |
+------------------------------------------------------------------+
```

### Visual Specifications
- **Hint Handle**: `fixed right-0 top-1/2 -translate-y-1/2 h-20 w-3 rounded-l-xl bg-white/10 dark:bg-white/15 border border-r-0 border-white/20 backdrop-blur-md shadow-[-4px_0_16px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer transition-all hover:w-4 hover:bg-white/25 active:scale-95`.
- **Sidebar Motion**: Framer Motion spring physics (`type: 'spring', stiffness: 380, damping: 32`) animating `x: 0` (visible) to `x: '100%'` (hidden) for zero-layout-shift 120Hz compositor-accelerated performance.
- **Main Viewport Recalibration**:
  - `--sites-sidebar-width: 0px` globally so `.sites-pinned-main` has `padding-right: 0`.
  - Update `TarotSpread.tsx` and `.duo-dapp-workspace` centering calculations so that cards, dual panes, and control buttons align with true screen center (`left: 50% -translate-x-1/2`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Floating Overlay vs. Canvas Shift**
  - *Chosen Approach*: Floating overlay with zero layout compression (`padding-right: 0`).
  - *Why*: Shifting the main canvas on hover causes jarring layout reflows, re-measuring of card wheel geometry, and stutter. A hardware-accelerated overlay preserves layout stability.
- **Decision 2: Edge Hover Trigger Zone & 3-Second Inactivity Timer**
  - *Chosen Approach*: 18px invisible trigger zone on the right edge + visual handle, accompanied by a 3000ms idle timer reset on any interaction inside the sidebar.
  - *Why*: Allows effortless desktop hover access without requiring pixel-perfect clicks, while touch users get an intuitive swipe target.

---

## 4. Technical Architecture & Component Interaction

```
┌────────────────────────────────────────────────────────────────────────┐
│ DOM Viewport (100vw x 100dvh)                                          │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ <main className="sites-pinned-main">                               │ │
│ │   - Width: 100% (padding-right: 0px)                               │ │
│ │   - Fully centered aspect ratios for 5.4" cover & 7.6" landscape   │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌──────────────────────┐   ┌─────────────────────────────────────────┐ │
│ │ Edge Gesture Handler │──▶│ <LeftSidebarNav />                      │ │
│ │ - Right 18px trigger │   │ - state: isSidebarVisible (boolean)     │ │
│ │ - Visual hint handle │   │ - 3000ms auto-dismiss inactivity timer  │ │
│ │ - Touch start/move   │   │ - motion.aside: x: 0 <-> x: '100%'      │ │
│ └──────────────────────┘   └─────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Affected Files & Scope
1. `src/components/navigation/LeftSidebarNav.tsx`:
   - Replace static `isOpen = true` with responsive visibility state (`isSidebarVisible`).
   - Implement edge hover detector, touch swipe handler (`onTouchStart`, `onTouchMove`, `onTouchEnd`), and 3000ms inactivity timer with cleanup.
   - Render the subtle translucent hint handle button when collapsed.
2. `src/index.css`:
   - Update `:root { --sites-sidebar-width: 0px; }` and `.sites-pinned-main { padding-right: 0; }`.
   - Update dependent centered positioning rules (`calc((100vw - var(--sites-sidebar-width)) / 2)` -> `50%`).
3. `src/components/trinity/TarotSpread.tsx`:
   - Ensure the card wheel container centers cleanly without subtracting sidebar width.
4. `package.json`, `public/version.json`, `public/changelog.json`:
   - Bump version to `v1.4.472` in compliance with `AGENTS.md`.
