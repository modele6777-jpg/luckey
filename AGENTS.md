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
- Apply the shared nonexclusive `ambient` audio policy before any playback. Never select `playback`, `play-and-record`, `solo-ambient`, or ducking to take priority over external music.
- Never publish app Media Session metadata, playback state, or OS transport handlers that replace external music controls. App BGM/TTS use their own UI controls.
- Ordinary navigation, opening chat/music UI, registering a track, and text-only chat must not prime silent audio or wake audio contexts.
- Do not add automatic BGM, silent keep-alive loops, or focus-reclaim retries when no app audio was requested.
- Verify policy and playback entry points when changing audio. Browser/OS restrictions (especially microphone capture and cross-origin players) cannot be overridden by web code; describe physical-device verification limits honestly.

### 3. Identical Folded / Unfolded Lucky Channel Background
- Lucky channels render the same folded mobile sky inside `ChannelPage` using `AuroraBackground channel`, regardless of screen width or performance/device classification.
- Keep this background within the channel canvas, behind page content; never rely on a document-wide background behind split panes.
- Do not substitute Lucy day/night backgrounds or desktop nebula palettes for the Lucky channel sky. Keep star density, palette and channel-relative meteor geometry identical across folded/unfolded modes.
- Preserve Lucy and Key channel themes independently. Compare the channel background at equal content dimensions in both screen modes when editing it.
