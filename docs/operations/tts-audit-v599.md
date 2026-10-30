# TTS audit — v1.4.599

## Changes

- A paused session now has explicit state. Pause during request or decoding waits for resume; resume while idle does nothing.
- Automatic narration does not take over an active manual or paused reader. Retired session tokens cannot reclaim playback.
- All shared TTS uses one recoverable playback engine. Legacy PCM fallback no longer bypasses cancellation, pause and highlight timing.
- Playback failure evicts corrupt cached audio. Resume bookmarks must match both voice and exact chunk layout.
- Listener exceptions cannot break playback state updates.
- Missing API configuration is reported explicitly and is not retried as a transient outage. Authentication, quota and temporary limits remain distinct.
- Lucy voice mode no longer interprets pause as completion and starts listening over pending narration.
- Full conversation playback controls track the session, rather than a sentinel text replaced by each chunk.
- Muse metadata initialization stops only its own narration. Sedona and other completion subscribers distinguish pause from completion.
- Handbook rapid skip starts its new runner; failed segments remain available for retry rather than being skipped.
- Poem male/female selection is honored.
- Wake-lock acquisition/release races cannot leak a late sentinel or clear a newer one.
- Highlight state catches up after visibility restoration and centers the current sentence.

## Verification

Passed targeted automated suites:

- `node scripts/test-tts-interruption.mjs`
- `node scripts/test-audio-recovery.mjs`
- `node scripts/test-speech-highlight.mjs`
- `node scripts/test-tts-services.mjs`
- `node scripts/test-sites-tts-api.mjs`

These cover real reader/lifecycle source with controlled clocks, requests and audio nodes, plus server requests with mocked providers. No billable provider generation was performed. Type checking and production builds are required for both checkouts.

## Operational limit

The Sites runtime configuration inspected for this release contains no supported AI provider credential. Actual AI speech generation cannot succeed until an authorized provider key is configured and applied. No keys were invented, copied into source, or changed by this audit.

Physical-device output, iOS silent-mode/audio-focus behavior and locked-screen playback have not been verified in this environment. Provider audio has no sentence timestamps; highlights follow measured audio progress with estimated internal sentence boundaries.
