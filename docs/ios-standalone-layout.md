# Installed Safari layout

The iPhone Duo trace from 2026-11-08 reports a 669px-wide document with:

- `documentElement.clientHeight`, `innerHeight`, and visual viewport: 869px
- CSS `100lvh`: 951px
- top safe-area inset: 82px
- `screen`: 457 × 678, so it describes a different display geometry

A fixed 951px app root clipped the composer and sidebar. Reducing it to 869px
made a permanent 82px bottom strip. These are separate failures; checking only
that the composer bottom equals `clientHeight` does not verify full-screen fill.

The installed Safari path now uses a normal-flow `html`, `body`, and `#root`,
with an absolutely positioned sidebar. It restores the CSS full height only
when the difference from the document viewport equals the top safe-area inset
(within 2px). Other disagreements retain the document height. Keyboard mode
retains the existing fixed visual-viewport geometry and returns to normal flow
on dismissal. Browser tabs retain their existing positioning.

Regression coverage must check both dimensions and positioning:

1. 869px document + 951px lvh + 82px top inset -> 951px normal-flow app.
2. Root and sidebar must not use `position: fixed` in this non-keyboard mode.
3. A different or absent safe-area delta must not expand the app.
4. Keyboard opening shrinks the controls, and dismissal restores normal flow.
5. Reload must preserve these invariants.

Chromium simulation verifies these structural invariants; it cannot prove how
an actual iOS WebKit compositor paints the region beyond `clientHeight`.
Keep on-device confirmation separate from simulation results.

Related observations:
- https://bugs.webkit.org/show_bug.cgi?id=313800
- https://github.com/cjnova/piclaw-monaco/blob/main/docs/PWA.md


## Rotation update (1.7.239)

The on-device landscape trace reports 951×587, CSS full height 669, and a
**zero** top safe-area inset. Comparing the shortfall to the current top inset
misses this case. The normal-flow canvas now uses paired CSS viewport width
and height when they agree with the current width and orientation. A stale
portrait CSS measurement must be rejected both for layout and keyboard checks.
The diagnostic screen records both CSS dimensions and orientation for this.

## Rotation latency update (1.7.241)

For installed Safari with supported paired viewport units, normal geometry now
sets `--app-height: 100lvh` instead of freezing the measured pixel height. CSS
therefore follows the next viewport size without waiting for JS resize events.
The resolver remains useful for aliases and keyboard decisions; keyboard mode
still writes the visible pixel height. Orientation events also run one coalesced,
short animation-frame measurement loop to catch staged WebKit updates. This
removes application-added waits, not the OS rotation animation itself.
