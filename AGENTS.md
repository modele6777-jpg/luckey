# AGENTS.md

## Persistent Project Rules

### 1. Mandatory Version & Upgrade Changelog Tracking
Every time a user request is completed or changes are made to the codebase:
1. **Increment Version Number**: Increment the patch version number in `package.json` by 0.0.1 (e.g. `1.8.0` -> `1.8.1`). User update 2026-11-20: numbering restarted at `1.8.0` after `1.7.1045`; never go back to a lower version.
2. **Update `public/version.json`**: Update with the new version string, current ISO timestamp, concise summary, and list of changes in `items`.
3. **Prepend `public/changelog.json`**: Add a new changelog object at the top of the array in `public/changelog.json` matching the new version, summary, builtAt, and bulleted items.
4. **Compile & Lint Verification**: Always run `npm run lint` and `npm run build` to ensure successful compilation after version bump and edits.
5. **Mandatory Git Commit & Push**: Always stage all changes (`git add .`), create a descriptive commit message with the version number, and push to remote repository (`git push`).

### 2. Permanent External Music Continuity
- Lucy chat TTS ends silently, for both automatic and manual playback. Legacy chat completion opt-ins must not enable a chime; preserve completion sounds for non-chat narration.
- External music (Apple Music, Spotify, Melon, etc.) must keep playing throughout the app, including while in-app BGM is explicitly enabled.
- BGM, effects, navigation and idle audio use nonexclusive `ambient`. User clarification on 2026-11-14 gives active TTS priority for screen-off/app-switch playback: TTS alone may use `playback`, returning to `ambient` on pause, stop or completion. External music may pause during TTS on iOS.
- BGM must not publish OS Media Session controls. Explicit TTS may publish speech pause/play/stop controls for background playback; remove them when TTS ends.
- Ordinary navigation, opening chat/music UI, registering a track, and text-only chat must not prime silent audio or wake audio contexts.
- Do not add automatic BGM, silent keep-alive loops, or focus-reclaim retries when no app audio was requested.
- Verify policy and playback entry points when changing audio. Browser/OS restrictions (especially microphone capture and cross-origin players) cannot be overridden by web code; describe physical-device verification limits honestly.

- User update 2026-11-21 (hybrid TTS): `playTTSInChunks` keeps ~180-character Gemini chunks, because Gemini TTS has a small rate limit and extra requests caused "음성 요청이 몰려" errors. With `fastLead`, only a long first chunk is split: its short lead sentence is synthesized by Edge Neural (`/api/ai/tts` with `provider:'edge'`, Render server only, separate quota) and the remainder by Gemini, so the Gemini request count never grows. If Edge fails or takes longer than 2.5s, the lead falls back to Gemini and Edge is skipped for 10 minutes. Sites/Vercel refuse `provider:'edge'` so they never spend an extra Gemini request. User update 2026-11-21: Edge answers HTTP 403 from the Render server, so the fast lead is switched off (`EDGE_LEAD_ENABLED = false`) and playback uses Gemini only.

- User update 2026-11-21 (backup voice): the user found Chirp 3 HD awkward. When AI Studio Gemini is out of quota, the backup reader is first the same Gemini voice through Cloud Text-to-Speech (`synthesizeCloudGeminiSpeech`, `voice.model_name`, candidates `gemini-3.8-flash-tts` then `gemini-2.5-flash-tts`, or `CLOUD_GEMINI_TTS_MODEL`; the first model that answers is remembered), and only then Chirp 3 HD. `CLOUD_GEMINI_TTS=off` skips it. Cloud Gemini-TTS refuses API keys (403 IAM_PERMISSION_DENIED), so it authenticates with a service account. The service-account JSON goes in `GOOGLE_CLOUD_TTS_CREDENTIALS`, and `googleServiceAccount.ts` (WebCrypto RS256 JWT → OAuth token, cached until expiry) handles the exchange. Without that JSON it is not attempted; 401/403 skip it for 10 minutes.
- User update 2026-11-21 (order): Gemini TTS reads first. If Gemini refuses (429 quota/rate) or fails, Chirp 3 HD reads the same text, and Gemini is skipped until Google's retry time. If both fail, the app gets Gemini's reason. The current Gemini key is refused by Cloud TTS (401 CREDENTIALS_MISSING), so Chirp needs its own `GOOGLE_CLOUD_TTS_API_KEY` from a project with the Text-to-Speech API and billing enabled.
- User update 2026-11-21: the Render server speaks with Google Cloud TTS Chirp 3 HD (`server/api-lib/googleCloudTts.ts`, voice `ko-KR-Chirp3-HD-<same name as the Gemini voice>`, mp3). It falls back to Gemini TTS through `preferredSpeech.ts`. Setup failures (disabled API, no billing, refused key) skip Cloud TTS for 10 minutes. `GET /api/ai/tts/status` shows which engine answers and the last failure code. Key: `GOOGLE_CLOUD_TTS_API_KEY`, else the existing Google key if its project has the Text-to-Speech API enabled. `TTS_PROVIDER=gemini` forces Gemini. Sites stays on Gemini.

### 3. Identical Folded / Unfolded Lucky Channel Background
- Lucky channels render the same folded mobile sky inside `ChannelPage` using `AuroraBackground channel`, regardless of screen width or performance/device classification.
- Keep this background within the channel canvas, behind page content; never rely on a document-wide background behind split panes.
- Do not substitute Lucy day/night backgrounds or desktop nebula palettes for the Lucky channel sky. Keep star density, palette and channel-relative meteor geometry identical across folded/unfolded modes.
- Preserve Lucy and Key channel themes independently. Compare the channel background at equal content dimensions in both screen modes when editing it.

- User update 2026-11-21: entering a Lucky channel (the 7 prism channels and prologue aliases) from Lucy chat or the Key channel shows `LuckyChannelTransition`. It is a night-sky entry screen with the channel colour, label and clover, inside the content canvas, visual-only, shown for 0.95–2.4s. Lucky→Lucky, profile and library navigation do not show it.

- User update 2026-11-21: inside the app, Key's search/guide buttons are drawn by `CalmApp` at the pane's top-right (vertically centred on the iframe header; iOS mis-sizes the fixed iframe header). The in-iframe buttons are hidden via `html.luckey-parent-actions` and remain only for standalone Key. The app's buttons hide while Key's search or any Key dialog is open, so they never cover its close buttons.
- User update 2026-11-21: the Key channel (`public/calm`) has a search button in its top nav (`key-search.js`). It searches the 90 practices, healing teachings and Key screens together. A result opens the practice (`startPractice`), the teaching (`keyShowTeaching`) or the tab (`keySwitchTab`). Bump the calm asset `?v=` and the SW cache when changing Key files.

- User update 2026-11-21: every page has a top-right "가이드" button (`PageGuideButton`, data in `src/lib/pageGuides.ts`). Lucky channels and other content routes get it from `ChannelPage`, Lucy/Master in the Lucy header, and Key in its own top nav (it posts `LUCKEY_OPEN_GUIDE` to `CalmApp`). User update 2026-11-21: guides are per dApp, not per app. Content routes resolve the visible dApp at open time (`getCurrentOneStopPage` → `resolveDappGuide`, keys from `ONE_STOP_PAGE_TABS`), and Key sends its active tab (`resolveKeyTabGuide`). Add a guide whenever a dApp/tab is added. User update 2026-11-21: each guide has two separate tabs, "📖 사용 가이드" (numbered steps) and "💡 활용 팁" (icon tips). The listen button reads the visible tab (`playTTSInChunks`, stopped on tab switch/close). `tests/page-guides.test.ts` requires a guide for every dApp key. Keep tips accurate when features change.

### 4. Lucy Theme Isolation Across Channels
- Lucy's time-of-day palette and nested text renderers use `LucyThemeBoundary`, regardless of whether the other pane is Key (light) or Lucky (dark).
- Global channel theme selectors and Tailwind dark utilities must respect `.lucy-chat-shell`'s own daylight marker; never recolor its messages using the Key channel's document theme.
- Check Lucy header, message text/surfaces and composer in both root themes for morning, day and night.

### 5. Unfolded Rotation Layout
- Rotating an unfolded viewport must preserve the unfolded state: landscape is content left / Lucy right; portrait is content top / Lucy bottom / a horizontal menu at the very bottom.
- Use `isDuoUnfoldedState`/`resolveDuoViewport` consistently. Rotation and keyboard height changes must not turn an inner display into a folded cover.
- The portrait menu owns its safe-area inset; split only the space above it into equal canvases. Remove vertical-rail padding and footer minimum heights in portrait.

### 6. Lucy / Lucy Plus Name
- User update 2026-11-19: folded layouts use Lucy; every Lucy chat in the unfolded dual screen is Lucy Plus (Plus marker in the header), regardless of the content pane route, in landscape and portrait.
- Entering Lucy Plus (unfolding) shows the Lucy Plus entry screen; folding back, or a folded screen entering Lucy from another channel, shows the Lucy entry screen. Both stay inside the Lucy pane, are visual-only and follow Lucy's day/night palette.
- Preserve Pro markers and mode transition popups; do not add Plus when Pro is active.

### 7. Popup Bounds Exclude Navigation
- ScreenPortal and WorkspacePortal dialogs/backdrops always exclude sidebar/bottom navigation. In unfolded mode, scope them to the initiating content/Lucy pane, including swapped and portrait layouts; folded mode uses visible main bounds.
- Preserve the initiating pane across nested/async dialogs, and recapture it whenever a persistent global portal reopens. Independent pane popups must not block each other.
- Keep portal layers outside route transforms while giving fixed descendants a main-sized containing block. Nested dialogs must keep their stacking/focus behavior.
- Folding/unfolding changes pane visibility and geometry, never the mounted page/portal ancestry. Open dialogs, nested layers, draft/search/filter state and scroll must survive both directions. Lazily mount unused panes, then retain them.
- Library open state is owned by isolated triggers/hosts, never the full conversation component. Paint the dialog shell before progressive engine batches; keep every engine accessible and restore scroll only after entries are ready.
- Engine/question library open state, filters, search, page and scroll also survive Safari page/pane restoration within the current tab. Persist changes synchronously; explicit close must clear the open state and account scopes stay separate.
- Safari touch dialog triggers must work without a compatibility click; guard duplicate activation and never dismiss a new dialog from the opening gesture. Test touch and backdrop behavior in WebKit.
- Engine/question libraries size cards and chrome from the dialog container, not device media breakpoints. Keep controls and results in a usable scroll area on short panes, with close/pagination reachable and no horizontal clipping.
- Recompute bounds on rotation, sidebar resize and visual viewport/keyboard changes. Never dim or intercept navigation with a dialog backdrop.

### 8. Big Bang Effects Exclude Lucy
- Big Bang navigation/commit, horizon and trail effects use the content pane bounds in unfolded mode, including swapped landscape and portrait layouts. Never paint across Lucy or navigation.
- Keep effect layers visual-only and separate from popup/focus stacking. Folded effects use main bounds; the Big Bang button itself remains usable in its existing location.

- User exception 2026-11-20: the Lucy Master entry suction (Big Bang hold) is centred on the button and covers the pane that holds it (Lucy or content when unfolded, main when folded), never navigation; visual-only. User update 2026-11-21: leaving Lucy Master (Big Bang hold or the return-to-Lucy card) plays the same effect in reverse (`playLucyMasterSuction('out')`), pouring back out of the button.
- User exception: clover wind/breeze effects cover the entire display, including Lucy and navigation, in folded and unfolded layouts. They stay visual-only and never intercept input.

### 9. Latest Lucy Conversation on Entry
- Entering/revealing Lucy, returning from background/BFCache and layout changes while following the bottom must show the newest available messages. Reconcile saved/current history by content/identity, never just message count; retain active streamed content.
- Delayed history, fonts/images and viewport changes are layout events, not manual scrolling. Preserve explicit reading of older messages and the header-to-top/recent controls.

### 10. TTS Sentence Scroll Ownership
- While TTS is speaking/loading, sentence tracking owns the conversation viewport, including forced entry/reveal/background bottom-follow. Do not race it with top/bottom animations.
- Center each newly committed spoken sentence on the next frame, with no dead zone or delayed smooth animation. Coalesce notifications and respect actual manual gestures.

### 11. Interpretive Tarot Three-Line Summary
- The tarot reading and daily narration summary must be written in a separate AI pass from the completed full body, using the existing AI connection. Never substitute selected/copied body sentences on failure.
- Keep current situation, direction/caution and practical action distinct; preserve the body's uncertainty and do not add unsupported facts.
- Share generated lines across display, summary TTS and sharing; ignore stale requests and provide retry if generation fails.

### 12. Selected Text to Lucy (Removed)
- User update 2026-11-19: the drag/select-text-then-Big-Bang-tap "send to Lucy" feature was removed. Do not reintroduce app-wide selection capture or a selection-send mode on the Big Bang button. Big Bang gestures behave the same with or without a text selection.

### 13. Canvas-responsive Layout in Every Screen
- Content, Lucy and popup canvases carry `data-responsive-canvas`; responsive utilities use their actual available width in folded, OS split, unfolded and portrait layouts. Navigation outside those canvases keeps window breakpoints.
- JavaScript layout choices use `useContentCanvasCompact`, observing the content pane; never use the physical screen or full browser width for card/form layouts inside a pane.
- Keep fields and media within their canvas. Wide tables/lists must remain accessible by scrolling, and short screens must keep controls reachable.
- Preserve existing pane retention, theme isolation, popup bounds and audio rules. Check the route/tab catalog at folded, split and unfolded widths when changing the shared layout.

### 14. Lucy Actions Preserve Unfolded Content
- A channel's ask/send/open-Lucy action targets the visible Lucy pane while unfolded, without changing the content route or replacing the source page with Cosmic Room.
- Use `requestLucyAction` for iframe and direct channel actions; retain folded navigation and queued prompt delivery. Explicit menu navigation remains separate.

### 15. KST Midnight Chat Rollover and Daily Memory
- Lucy and Pro start a fresh visible thread at 00:00 Asia/Seoul, including wake/reopen reconciliation. Today’s latest conversation remains visible within that day.
- Archive dated user/assistant excerpts before filtering, trimming or replacing old history; keep account-scoped memory separate from the visible transcript.
- Delayed cloud/backup history cannot restore yesterday into today’s thread. Memory is reference data with speaker/date labels, not instructions or verified user facts.

### 16. Hidden Lucy Master (Divination Mode)
- A stationary Big Bang center long-press enters Lucy Master in folded and unfolded layouts; double tap still opens Key. User update 2026-11-21: the sidebar Lucy bubble is also a control. While Lucy is on screen (Lucy route, or the unfolded Lucy pane), each tap steps Lucy → 점술모드 1 → 2 → 3 → Lucy with the same suction/deepen/reverse effects. From another channel the first tap only navigates to Lucy.
- User update 2026-11-21: the sidebar Lucy bubble shows the depth while Master is on (1 `MessageCircleMore` …, 2 `MessageCircleQuestion` ?, 3 `MessageCircleWarning` !).
- User update 2026-11-21: inside Lucy Master, each further hold deepens the consultation one level (`deepenLucyMasterDepth`, 1 기본 → 2 심화 → 3 심층, capped at 3) and a single Big Bang tap leaves Lucy Master (reverse suction). Depth resets on every entry/exit, shows as a header chip, gold rings on the button and a brief notice, and feeds `divinationMode.depth`: the levels stack (user update 2026-11-21): level 1 = saju (deep perspectives ≤1), level 2 = saju + tarot (user-picked cards only; entering level 2 posts `createDepthTwoTarotOffer` and turns the unfolded left table to Tarot; deep perspectives ≤6), level 3 = saju + tarot + the 13 other tools (`LUCY_MASTER_DEPTH3_TOOLS`; Lucy weaves the 3–4 signals most tools share, summarises the rest briefly and says when a tool could not be computed; deep perspectives ≤24). A verbal "더 깊게" request adds concern-related tools/perspectives to that answer only. More engines never license claiming uncomputed results.
- User update 2026-11-21: regular Lucy reads recent user turns (`lucyMasterOffer`) and, when counselling seems needed, shows an in-chat card offering to enter Lucy Master; the user chooses. Accepting plays the suction effect and carries the conversation (link = linked, no 이어서/새로 question); declining pauses offers for 45 minutes. Symmetrically, in Lucy Master a closing turn (thanks/resolved, not a new question) after real back-and-forth shows an in-chat card offering to return to regular Lucy; declining pauses it for 20 minutes.
- User update 2026-11-21: unfolding during Lucy Master sends no tarot offer message. The left table follows the depth: level 1 shows only the ☯ Saju chart (no Tarot tab, no auto-spread from typed concerns; an explicit card request still opens the pick and shows those cards), level 2+ adds the 🃏 Tarot face and switches to it on entry, level 3 adds the 🧭 13대 도구 face (`MasterToolBoard`, data from `publishTableTools`) and switches to it on entry and on non-card answers. The board is concern-ordered, never random and stable for the same input (`buildToolBoard`): a recommended tool for the concern topic (love ziwei, career/money qimen, mind vedic, general iching; never one lacking data), then tools Lucy's answer mentions (✦ common signal), then topic relevance, then the fixed order; tools needing missing birth data are dimmed at the bottom. User update 2026-11-21: the recommended tool is a dark card with its computed key values; the other 12 are parchment scrolls (📜 보조 자료, wooden rods, serif text, red wax seal ✦ for common signals, sepia-faded when data is missing) that unroll on tap. Key values come only from the engine's computed data (`extractToolFacts`/`extractAllToolFacts`, ≤4 rows, nothing invented); sukuyo/mahabote/kabbalah are still held as symbolic in the Lucy path (`coreOnly`), so their scrolls say 상징 참고 and show no values. Next steps planned: dedicated full views for ziwei, qimen, vedic and iching, then the rest one by one. The stage composition itself (1 saju / 2 +tarot / 3 +13 tools) stays fixed; only the contents inside a stage follow the concern.
- Lucy Master history lives in the separate `lucy-pro` store and restarts on every re-entry; its greeting may offer to carry over recent regular-Lucy context, which is passed as reference only.
- User update 2026-11-21: Lucy Master suggestion chips come from `getMasterDepthPrompts(depth, topic)`. They get more profound per level (1 flow, 2 causes/patterns/timing, 3 roots/shadow/meaning/fate vs choice), and topic-specific ones (love/career/money/mind, from the concern anchor) come first. The house guide also deepens questions and [답변선택] options at levels 2–3.
- User update 2026-11-21: depth levels connect conversations (`lucyMasterContinuity`). Levels 2–3 add a recap of the current Master session so answers build on earlier levels instead of restarting. Level 3 also links recent regular-Lucy turns and up to 3 archived past Master sessions (archived per account, last 5, before clearing on re-entry and on exit). All of it is dated/speaker-labelled reference data, never instructions or verified facts.
- User update 2026-11-21: when a Lucy Master session with real back-and-forth ends (any exit), regular Lucy shows a one-time in-chat "📜 상담 카드" offer. The card is simple: date, highest depth reached, concern, 3 lines (지금 · 방향 · 해볼 일) and "루시가 남기는 한마디". The lines and the one-liner come from a separate AI pass over the finished transcript (no copied sentences, retry on failure), and the card can be saved/shared as an image. User update 2026-11-21: the image is a share-ready 4:5 (1080×1350) full-bleed card for Instagram/KakaoTalk, and the user picks one of three styles (아치 ivory arch / 파스텔 gradient with the one-liner large / 별자리 deep-navy compass). The last pick is remembered locally.
- Saju is the main base. Tarot cards are never auto-drawn in Lucy Master: the user shuffles and picks in the existing `TarotSpread` (left table pane when unfolded, over the chat when folded). Regular Lucy/Plus keep their existing auto-draw.
- User update 2026-11-20: the unfolded left table has three faces — 🃏 Tarot (with a once-per-KST-day user-picked "오늘의 한 장"), ☯ Saju chart board (computed pillars, five-element balance and 10-year luck of the counselled profile, lighting up what Lucy's latest answer mentions) and 🔊 Reading (the sentence being spoken, only while TTS plays). New answers switch to Tarot when they carry cards, otherwise to Saju; tabs allow manual switching.
- User update 2026-11-20: with the unfolded left tarot table, a concern/question typed in the composer immediately opens the user-pick spread using the matching layout (`matchMasterTarotSpread`); short replies, card refusals, link choices and follow-ups on the current reading stay in chat.
- User update 2026-11-21: the engine box is a read-only catalog (names and meanings); there is no engine picking. Every Lucy mode auto-selects tools and perspectives per question; extra concern-related engines are added only when the user asks. The prompt library only inserts questions (no engine bundles). User update 2026-11-21: the engine box and prompt library triggers/dialogs appear only in Lucy Master; regular Lucy/Plus do not show them. Never claim a symbolic perspective was a computed result.
- Per-message mode/engine badges stay removed in Lucy, Plus and Master; TTS controls remain.
- Lucy Master BGM is opt-in (default off), routed through the shared ambient bus with nonexclusive audio, and stops when the mode ends or the page is hidden. User update 2026-11-21: the track never switches per depth; `setLucyMasterBgmDepth` crossfades extra synthesized layers (level 2 low drone + shimmer, level 3 distant choir and lower bell) over ~3s while keeping overall loudness about the same, and never starts BGM by itself.
