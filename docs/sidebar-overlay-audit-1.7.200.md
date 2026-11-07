# Sidebar and overlay audit — 1.7.200

## Confirmed issues and changes

- The permanent sidebar is portaled to `body`; fixed dialogs rendered inside `#root` can remain behind it regardless of their local z-index. Full-screen dialogs and inline overlays now use `ScreenPortal`; existing `WorkspacePortal` dialogs share the same layer manager.
- The tarot drawing stage previously used z-index 300, below the sidebar's 398. Tarot drawing and 3D visualization now participate in the shared overlay ordering.
- `.duo-portal > .fixed` forced anchored popovers to full width. Only full-screen roots now receive viewport sizing, and anchored widths are preserved.
- Overlay opening order can differ from JSX declaration order. Occupied portal layers receive priority on opening, including reopening and simultaneous parent/child mounting. Empty portal wrappers cannot intercept input. Existing deliberate pointer pass-through is preserved.
- Workspace dialog Escape/focus handling acts only on the top occupied layer. The visualizer's Escape handler observes the same priority.
- Fixed main-page feature buttons, narration resume controls, the handbook audio widget, update notices, and the install banner now account for the permanent rail's width. Dialog controls retain their own full-screen geometry.

## Coverage

Shared wrappers cover profile/help/notice/share dialogs, chat configuration and image previews, tarot selection/zoom/physical input/narration, ReBible dialogs, meditation, and inline channel overlays in Muse, Orange, Heal, Calm, Hub, and Lucy. Existing `WorkspacePortal` consumers automatically receive the shared fix.

## Validation

- TypeScript (`npm run lint`) and production build.
- Node regression tests for overlay priority, workspace width, and visual viewport recovery.
- React DOM checks in a temporary Happy DOM harness: portals escape a transformed app host; opening/reopening order; empty layers; WorkspacePortal interoperability; simultaneous nested opening; Escape; unmount cleanup.
- Computed-style checks: anchored popover width; nonblocking empty wrapper; deliberate pointer pass-through.
- Rechecked visualizer close click, hidden controls, Escape and cleanup without WebGL.

These are code, DOM and computed-style checks. Real device rendering, every service's authenticated data flow, and WebGL output were not visually verified.
