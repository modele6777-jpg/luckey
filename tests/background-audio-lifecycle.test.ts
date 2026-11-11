import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { buildNextShuffleOrder } from '../src/lib/backgroundMixSelection';
import { MOOD_PRESETS, NATURE_MOOD_IDS, pickRandomNatureMood } from '../src/lib/moodSoundEngine';
import { getVisualRhythmBeatConfig } from '../src/lib/visualRhythmBinaural';

const source = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), 'utf8');

test('background start independently shuffles the BGM queue and chooses a nature sound', () => {
  const order = buildNextShuffleOrder(5, 2, () => 0);
  assert.deepEqual([...order].sort((a, b) => a - b), [0, 1, 2, 3, 4]);
  assert.notEqual(order[0], 2);
  assert.equal(pickRandomNatureMood(() => 0), 'rain');
  assert.equal(pickRandomNatureMood(() => 0.999999), 'night');
  assert.ok(NATURE_MOOD_IDS.includes('stream'));
  assert.ok(NATURE_MOOD_IDS.includes('wind'));
  assert.ok(NATURE_MOOD_IDS.includes('night'));
  assert.ok(!NATURE_MOOD_IDS.includes('whitenoise'));
  assert.ok(MOOD_PRESETS.some((preset) => preset.id === 'stream'));
  assert.ok(MOOD_PRESETS.some((preset) => preset.id === 'wind'));
  assert.ok(MOOD_PRESETS.some((preset) => preset.id === 'night'));
});

test('the BGM user-start path starts one random nature layer and every BGM pause stops it', () => {
  const bgm = source('../src/components/trinity/BgMusicPlayer.tsx');
  const startIndex = bgm.indexOf('const handlePlayToggle =');
  const startEnd = bgm.indexOf('\n  };', startIndex);
  const startHandler = bgm.slice(startIndex, startEnd);
  assert.match(startHandler, /buildNextShuffleOrder\(trackCount, activeTrackIndexRef\.current\)/);
  assert.match(startHandler, /if \(userGesture\)[\s\S]*startMoodSound\(pickRandomNatureMood\(\)\)/);

  const pauseIndex = bgm.indexOf('const pausePlayback = () =>');
  const pauseEnd = bgm.indexOf('\n  };', pauseIndex);
  assert.match(bgm.slice(pauseIndex, pauseEnd), /stopMoodSound\(\)/);

  const cleanupIndex = bgm.indexOf('useEffect(() => () => {', bgm.indexOf('setBgmPlaybackSessionActive(isPlaying)'));
  const cleanupEnd = bgm.indexOf('}, []);', cleanupIndex);
  const cleanup = bgm.slice(cleanupIndex, cleanupEnd);
  assert.match(cleanup, /playbackGenerationRef\.current \+= 1/);
  assert.match(cleanup, /audioRef\.current\?\.pause\(\)/);
  assert.match(cleanup, /stopProceduralSynth\(\)/);
  assert.match(cleanup, /stopMoodSound\(\)/);
});

test('nature and Visual Rhythm audio use the shared nonexclusive ambient bus', () => {
  const mood = source('../src/lib/moodSoundEngine.ts');
  const binaural = source('../src/lib/visualRhythmBinaural.ts');
  assert.match(mood, /gainNode\.connect\(getAmbientAudioBus\(\)\)/);
  assert.doesNotMatch(mood, /gainNode\.connect\(ctx\.destination\)/);
  assert.match(mood, /if \(generation !== this\.playbackGeneration\) return/);
  assert.match(binaural, /getAmbientAudioBus/);
  assert.doesNotMatch(binaural, /new AudioContext\(/);
  assert.doesNotMatch(binaural, /\.close\(\)/);
  assert.deepEqual(getVisualRhythmBeatConfig(60), { beatHz: 4.5, carrierHz: 216, waveLabel: '4.5 Hz' });
  assert.deepEqual(getVisualRhythmBeatConfig(90), { beatHz: 10, carrierHz: 220, waveLabel: '10 Hz' });
  assert.deepEqual(getVisualRhythmBeatConfig(120), { beatHz: 15, carrierHz: 240, waveLabel: '15 Hz' });
});
