# Form overflow audit — 1.7.202

## Findings and fixes

- Located 24 explicit date/time field usages in 10 TSX files (including reusable InputField calls). All now receive shared native-control width constraints in app and portal contexts.
- Marked 11 related form grids for available-width auto-fit. Each keeps its original maximum column count, collapses on narrow cards, and resets old column spans to avoid creating implicit tracks on small layouts.
- Standard inputs, selects and textareas use border-box sizing, minimum width zero and a 100% maximum width. Wrappers and grid items can shrink. Native date/time/month/week controls retain their types and values; WebKit inner padding/alignment is normalized.
- ProfilePage and ProfileModal field helpers now have explicit width constraints. The Epilogue-only workaround is replaced by shared rules.
- The additional-question timeline no longer requires a 200px minimum text column. The 3D visualizer footer and mode buttons can wrap.
- Horizontal prompt lists, card selection wheels and their intended scroll behavior were preserved. No blanket overflow-hiding rule was added.

## Source coverage

ProfileModal, ChatProfileModal, DivinationLab, TrinityDestinyReportView, TrinityOracleSection, BluebirdApp, EpilogueApp, HealApp, ProfilePage, TrinityApp.

Run `node scripts/audit-form-layout.mjs` to find native date/time grids missing the shared available-width layout marker. `--json` also prints field inventory. This is a source audit, not a screenshot validator.

## Validation

- Shared CSS parsed for Safari 15.4 targets with Lightning CSS.
- Temporary Happy DOM style/value checks: five native-control types, three app/popup contexts and four containing widths (60 cases), plus select/textarea constraints and preservation of explicit slider widths.
- TypeScript, production build, and the existing workspace-width, viewport-recovery and overlay-order tests.

Real native WebKit widgets and every authenticated page have not been visually exercised on physical devices. The computed-style checks do not measure real browser geometry; device-specific rendering can require further adjustment.
