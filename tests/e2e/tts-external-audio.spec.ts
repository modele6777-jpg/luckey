import { expect, test } from '@playwright/test';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

test('TTS keeps a separate continuous audio track playing and resumes after a simulated return', async ({ page }) => {
  await page.route('https://**', (route) => route.abort());
  await page.route('**/api/sync/**', (route) => route.abort());
  const runtimePath = '/__playwright__/audio-mixing.mjs';
  const runtime = await build({
    stdin: {
      contents: "export * as speech from './src/lib/speechMedia'; export * as policy from './src/lib/audioMixingPolicy';",
      resolveDir: fileURLToPath(new URL('../../', import.meta.url)),
    },
    bundle: true,
    format: 'esm',
    write: false,
  });
  await page.route(`**${runtimePath}`, route => route.fulfill({
    contentType: 'application/javascript',
    body: runtime.outputFiles[0].text,
  }));
  await page.goto('/');
  await page.setContent('<!doctype html><html><body><button type="button" data-audio-mix-test-start="true">Start isolated audio regression</button></body></html>');

  await page.evaluate(async path => {
    const { speech, policy } = await import(path);
    const requestedModes: string[] = [];
    let audioSessionType = 'ambient';
    Object.defineProperty(navigator, 'audioSession', {
      configurable: true,
      value: {
        get type() { return audioSessionType; },
        set type(value: string) { requestedModes.push(value); audioSessionType = value; },
      },
    });
    let mediaPlaybackState = 'none';
    let mediaMetadata: unknown = null;
    let mediaActionAssignments = 0;
    Object.defineProperty(navigator, 'mediaSession', {
      configurable: true,
      value: {
        get playbackState() { return mediaPlaybackState; },
        set playbackState(value: string) { mediaPlaybackState = value; },
        get metadata() { return mediaMetadata; },
        set metadata(value: unknown) { mediaMetadata = value; },
        setActionHandler() { mediaActionAssignments++; },
      },
    });
    policy.applyAudioMixingPolicy();

    const makeToneWav = (frequency: number, seconds: number) => {
      const sampleRate = 24_000;
      const samples = Math.floor(sampleRate * seconds);
      const buffer = new ArrayBuffer(44 + samples * 2);
      const view = new DataView(buffer);
      const writeAscii = (offset: number, text: string) => {
        for (let index = 0; index < text.length; index++) view.setUint8(offset + index, text.charCodeAt(index));
      };
      writeAscii(0, 'RIFF'); view.setUint32(4, 36 + samples * 2, true); writeAscii(8, 'WAVE');
      writeAscii(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
      view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeAscii(36, 'data'); view.setUint32(40, samples * 2, true);
      for (let index = 0; index < samples; index++) {
        const envelope = Math.min(1, index / 240, (samples - index) / 240);
        view.setInt16(44 + index * 2, Math.round(Math.sin(2 * Math.PI * frequency * index / sampleRate) * 3_200 * envelope), true);
      }
      return new Uint8Array(buffer);
    };

    const musicBytes = makeToneWav(261.63, 1);
    const ttsBytes = makeToneWav(440, 3);
    const musicUrl = URL.createObjectURL(new Blob([musicBytes], { type: 'audio/wav' }));
    const music = new Audio(musicUrl);
    music.loop = true;
    music.volume = 0.65;
    const musicProgressSince = (start: number) => (music.currentTime - start + music.duration) % music.duration;

    const button = document.querySelector<HTMLButtonElement>('[data-audio-mix-test-start="true"]');
    if (!button) throw new Error('Missing isolated audio test control');
    (window as any).__audioMixResult = null;
    button.addEventListener('click', () => {
      (window as any).__audioMixResult = (async () => {
        await music.play();
        const ttsElement = speech.getSpeechMediaElement();
        const started = new Promise<void>((resolve) => ttsElement.addEventListener('playing', () => resolve(), { once: true }));
        const speechDone = speech.playSpeechMedia(ttsBytes, 'wav', 24_000);
        speechDone.catch(() => {});
        await started;

        const musicAtStart = music.currentTime;
        await new Promise((resolve) => setTimeout(resolve, 300));
        const during = {
          musicPaused: music.paused,
          musicVolume: music.volume,
          musicAdvanced: musicProgressSince(musicAtStart),
          ttsPaused: ttsElement.paused,
          audioSessionType: audioSessionType,
          requestedModes: [...requestedModes],
          mediaPlaybackState,
          mediaMetadata,
          mediaActionAssignments,
        };

        speech.handleSpeechPageVisibility(false);
        const interruptedAt = ttsElement.currentTime;
        ttsElement.pause();
        speech.handleSpeechPageVisibility(true);
        const musicAtReturn = music.currentTime;
        await new Promise((resolve) => setTimeout(resolve, 200));
        const afterReturn = {
          musicPaused: music.paused,
          musicVolume: music.volume,
          musicAdvanced: musicProgressSince(musicAtReturn),
          ttsPaused: ttsElement.paused,
          ttsResumedFromPosition: ttsElement.currentTime >= interruptedAt,
          audioSessionType: audioSessionType,
          requestedModes: [...requestedModes],
          mediaPlaybackState,
          mediaMetadata,
          mediaActionAssignments,
        };

        speech.stopSpeechMedia();
        music.pause();
        URL.revokeObjectURL(musicUrl);
        await speechDone;
        return { during, afterReturn };
      })();
    });
    document.body.appendChild(button);
  }, runtimePath);

  await page.locator('[data-audio-mix-test-start="true"]').click();
  await expect.poll(() => page.evaluate(() => (window as any).__audioMixResult), { timeout: 12_000 }).not.toBeNull();
  const result = await page.evaluate(() => (window as any).__audioMixResult);

  expect(result.during.musicPaused).toBe(false);
  expect(result.during.musicVolume).toBeCloseTo(0.65, 3);
  expect(result.during.musicAdvanced).toBeGreaterThan(0.1);
  expect(result.during.ttsPaused).toBe(false);
  expect(result.during.audioSessionType).toBe('ambient');
  expect(result.during.requestedModes).not.toContain('playback');
  expect(result.during.mediaPlaybackState).toBe('none');
  expect(result.during.mediaMetadata).toBeNull();
  expect(result.during.mediaActionAssignments).toBe(0);
  expect(result.afterReturn.musicPaused).toBe(false);
  expect(result.afterReturn.musicVolume).toBeCloseTo(0.65, 3);
  expect(result.afterReturn.musicAdvanced).toBeGreaterThan(0.05);
  expect(result.afterReturn.ttsPaused).toBe(false);
  expect(result.afterReturn.ttsResumedFromPosition).toBe(true);
  expect(result.afterReturn.audioSessionType).toBe('ambient');
  expect(result.afterReturn.requestedModes).not.toContain('playback');
  expect(result.afterReturn.mediaPlaybackState).toBe('none');
  expect(result.afterReturn.mediaMetadata).toBeNull();
  expect(result.afterReturn.mediaActionAssignments).toBe(0);
});
