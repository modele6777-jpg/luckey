# AGENTS.md

## Persistent Project Rules

### 1. Mandatory Version & Upgrade Changelog Tracking
Every time a user request is completed or changes are made to the codebase:
1. **Increment Version Number**: Increment the patch version number in `package.json` (e.g. `1.2.459` -> `1.2.460`).
2. **Update `public/version.json`**: Update with the new version string, current ISO timestamp, concise summary, and list of changes in `items`.
3. **Prepend `public/changelog.json`**: Add a new changelog object at the top of the array in `public/changelog.json` matching the new version, summary, builtAt, and bulleted items.
4. **Compile & Lint Verification**: Always run `npm run lint` and `npm run build` to ensure successful compilation after version bump and edits.
5. **Mandatory Git Commit & Push**: Always stage all changes (`git add .`), create a descriptive commit message with the version number, and push to remote repository (`git push`).

### 2. Permanent External Music Continuity
- External music (Apple Music, Spotify, Melon, etc.) must keep playing throughout the app, including while in-app BGM is explicitly enabled.
- BGM, effects, navigation and idle audio use nonexclusive `ambient`. User clarification on 2026-11-14 gives active TTS priority for screen-off/app-switch playback: TTS alone may use `playback`, returning to `ambient` on pause, stop or completion. External music may pause during TTS on iOS.
- BGM must not publish OS Media Session controls. Explicit TTS may publish speech pause/play/stop controls for background playback; remove them when TTS ends.
- Ordinary navigation, opening chat/music UI, registering a track, and text-only chat must not prime silent audio or wake audio contexts.
- Do not add automatic BGM, silent keep-alive loops, or focus-reclaim retries when no app audio was requested.
- Verify policy and playback entry points when changing audio. Browser/OS restrictions (especially microphone capture and cross-origin players) cannot be overridden by web code; describe physical-device verification limits honestly.

### 3. Identical Folded / Unfolded Lucky Channel Background
- Lucky channels render the same folded mobile sky inside `ChannelPage` using `AuroraBackground channel`, regardless of screen width or performance/device classification.
- Keep this background within the channel canvas, behind page content; never rely on a document-wide background behind split panes.
- Do not substitute Lucy day/night backgrounds or desktop nebula palettes for the Lucky channel sky. Keep star density, palette and channel-relative meteor geometry identical across folded/unfolded modes.
- Preserve Lucy and Key channel themes independently. Compare the channel background at equal content dimensions in both screen modes when editing it.

### 4. Lucy Theme Isolation Across Channels
- Lucy's time-of-day palette and nested text renderers use `LucyThemeBoundary`, regardless of whether the other pane is Key (light) or Lucky (dark).
- Global channel theme selectors and Tailwind dark utilities must respect `.lucy-chat-shell`'s own daylight marker; never recolor its messages using the Key channel's document theme.
- Check Lucy header, message text/surfaces and composer in both root themes for morning, day and night.

### 5. Unfolded Rotation Layout
- Rotating an unfolded viewport must preserve the unfolded state: landscape is content left / Lucy right; portrait is content top / Lucy bottom / a horizontal menu at the very bottom.
- Use `isDuoUnfoldedState`/`resolveDuoViewport` consistently. Rotation and keyboard height changes must not turn an inner display into a folded cover.
- The portrait menu owns its safe-area inset; split only the space above it into equal canvases. Remove vertical-rail padding and footer minimum heights in portrait.

### 6. Independent Lucy Plus / Pro Markers
- Lucy+ → Lucy+ Pro and its reverse must keep the existing `+` marker visible and stable. Only the Pro marker changes.
- Do not derive the transition's Plus appearance solely from `lucyTier === 'plus'`, since Pro is a separate tier value. Preserve the unfolded Plus appearance while Pro is active.
- Folded Lucy Pro must not gain a Plus marker.

### 7. Popup Bounds Exclude Navigation
- ScreenPortal and WorkspacePortal dialogs/backdrops always exclude sidebar/bottom navigation. In unfolded mode, scope them to the initiating content/Lucy pane, including swapped and portrait layouts; folded mode uses visible main bounds.
- Preserve the initiating pane across nested/async dialogs, and recapture it whenever a persistent global portal reopens. Independent pane popups must not block each other.
- Keep portal layers outside route transforms while giving fixed descendants a main-sized containing block. Nested dialogs must keep their stacking/focus behavior.
- Folding/unfolding changes pane visibility and geometry, never the mounted page/portal ancestry. Open dialogs, nested layers, draft/search/filter state and scroll must survive both directions. Lazily mount unused panes, then retain them.
- Safari touch dialog triggers must work without a compatibility click; guard duplicate activation and never dismiss a new dialog from the opening gesture. Test touch and backdrop behavior in WebKit.
- Engine/question libraries size cards and chrome from the dialog container, not device media breakpoints. Keep controls and results in a usable scroll area on short panes, with close/pagination reachable and no horizontal clipping.
- Recompute bounds on rotation, sidebar resize and visual viewport/keyboard changes. Never dim or intercept navigation with a dialog backdrop.

### 8. Big Bang Effects Exclude Lucy
- Big Bang navigation/commit, horizon and trail effects use the content pane bounds in unfolded mode, including swapped landscape and portrait layouts. Never paint across Lucy or navigation.
- Keep effect layers visual-only and separate from popup/focus stacking. Folded effects use main bounds; the Big Bang button itself remains usable in its existing location.

- User exception: clover wind/breeze effects cover the entire display, including Lucy and navigation, in folded and unfolded layouts. They stay visual-only and never intercept input.
