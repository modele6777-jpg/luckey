# CODEX HANDOFF: Luckey divination engine accuracy

Updated: 2026-10-25
Repository: modele6777-jpg/luckey
Production: https://luckey-flame.vercel.app/
Baseline: main (read latest HEAD before changing code)

## Mission and strict scope

The user's priority is **accuracy, reproducibility and reliability of the divination engines**: Korean saju/manseryeok, tarot and astrology, plus their integration with AI interpretation. The previous assistant drifted into unrelated art recommendations. **Do not continue work on art, music, visual design, or unrelated features unless explicitly requested.** Preserve existing product behavior.

Distinguish objective software and astronomical/calendar calculation correctness from claims about the predictive validity of divination. Never claim a fortune-telling interpretation has empirically proven accuracy.

## Relevant completed work

These PRs were previously merged (verify details against repository history; the summary is a handoff, not a substitute for inspecting code):
- #10: timezone/lunar leap and boundary handling.
- #11: day-pillar regression.
- #12: AI chat proxy history.
- #14: MCP `get_saju_fortune` uses real saju calculation instead of a hardcoded year.
- #15: saju/MCP regression tests, including `tests/mcp-saju.test.ts`.
- #16: lazy TTS import to restore API health.
- #17: MCP routing and ESM imports.
- #18: daily tarot MCP ESM import.
- #19: TTS ESM imports and deployment bundling.
- #20: unrelated art recommendation variety.
- #21: unrelated emotion-aware art recommendation and exclusions.
- #22: unrelated art endpoint ESM import corrections, merged as `2bb622f81a3c2dfdfa24184334ffbe7c4bfd9799`.

Previously confirmed: production `/api/health` and `/api/mcp` responded successfully; MCP POST `tools/list`, `get_daily_tarot`, `get_saju_fortune`, `consult_oracle`, and TTS had successful smoke tests at the time. These checks do **not** prove full computational accuracy.

## Starting code locations (verify paths and actual implementations)

- `src/lib/sajuAnalysis.ts`: detailed saju calculations.
- `server/api-lib/mcpHandler.ts`: MCP tools and JSON-RPC handling.
- `src/data/tarotData.ts`: tarot deck data.
- `src/lib/dailyTarotOracle.ts`: daily tarot guidance.
- `tests/mcp-saju.test.ts`: existing MCP/saju tests.
- `api/index.ts`: Vercel API routes.
- Locate the **actual** astrology calculation and chart rendering modules by searching the repository; do not assume a working astronomical ephemeris exists.

## Recommended next work

1. **Read the code and test setup first.** Produce a concise inventory of saju/tarot/astrology engine files, algorithm sources, test coverage, and high-risk assumptions.
2. **Saju audit first.** Verify sexagenary year/month/day/hour pillars against independently sourced, reproducible reference cases. Cover ipchun (立春), solar-term boundaries, late-night `자시` and date turnover, time zones/DST where applicable, leap lunar months, leap years, Korean standard time versus true solar time and birthplace longitude. Be explicit about competing conventions; do not silently choose one.
3. Write regression tests **before** each bug fix. Record reference data, source and convention in test comments.
4. Tarot: verify full deck, unique card identifiers, draw without replacement where appropriate, upright/reversed handling and correct mapping to interpretations. Do not present pseudorandomness as proof of metaphysical accuracy.
5. Astrology: identify whether chart/planet/house positions are truly calculated. Validate ephemeris, date, timezone, coordinates, zodiac system and house-system assumptions against trusted reference values. Flag any placeholders.
6. Integration: prevent fabricated calculated values in AI explanations; separate numerical/calendrical outputs from interpretations.

## Workflow

- Branch from current `main`; make **small, reviewable PRs** with narrowly scoped changes.
- Prefer deterministic tests and independent expected values. Run project lint/typecheck/test/build commands as documented in `package.json` and CI.
- Do not modify unrelated art recommendation code.
- Confirm CI and preview status before proposing merge. Avoid pushing directly to `main` for feature/logic changes.
- Provide a Korean summary of: verified facts, exact bugs, test evidence, changed files, and any unverified assumptions.
- If deploying, verify actual API behavior after production READY; do not confuse `/api/health` with validation of computational correctness.
- Do not expose credentials, personal data, or private configuration in PRs.

## Immediate instruction for Codex

"Start with a read-only audit of the saju engine and its existing tests. Report the three highest-impact correctness risks with exact file paths, evidence, and suggested reproducible test cases. Do not edit unrelated files. After the audit, implement only the top validated fix on a new branch and open a PR."
