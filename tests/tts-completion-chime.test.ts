import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import {
  COMPLETION_BOWL_ATTACK_TAU,
  COMPLETION_BOWL_BEATING_HZ,
  COMPLETION_BOWL_DURATION,
  COMPLETION_BOWL_FUNDAMENTAL_HZ,
  COMPLETION_BOWL_PEAK,
  completionBowlPartials,
  renderCompletionBowl,
} from '../src/lib/completionBowl';

const ttsSource = readFileSync(new URL('../src/utils/tts.ts', import.meta.url), 'utf8');
const hapticsSource = readFileSync(new URL('../src/lib/audioHaptics.ts', import.meta.url), 'utf8');
const bowlSource = readFileSync(new URL('../src/lib/completionBowl.ts', import.meta.url), 'utf8');

const chunkedTtsSource = ttsSource.slice(
  ttsSource.indexOf('export const playTTSInChunks'),
  ttsSource.indexOf('export const playConversation'),
);
const singleTtsSource = ttsSource.slice(
  ttsSource.indexOf('export const playTTS = async'),
  ttsSource.indexOf('export function splitSpeechIntoSentences'),
);

const SAMPLE_RATE = 48000;
const samples = renderCompletionBowl(SAMPLE_RATE);

/** 오일러 공식 없이 한 주파수의 진폭만 재는 Goertzel 크기(정규화 전). */
function toneMagnitude(signal: Float32Array, frequency: number, sampleRate = SAMPLE_RATE): number {
  const omega = (2 * Math.PI * frequency) / sampleRate;
  const coeff = 2 * Math.cos(omega);
  let s1 = 0;
  let s2 = 0;
  for (let index = 0; index < signal.length; index++) {
    const s0 = signal[index] + coeff * s1 - s2;
    s2 = s1;
    s1 = s0;
  }
  return Math.sqrt(s1 * s1 + s2 * s2 - coeff * s1 * s2) / signal.length;
}

function rmsBetween(signal: Float32Array, startSeconds: number, endSeconds: number, sampleRate = SAMPLE_RATE): number {
  const start = Math.floor(startSeconds * sampleRate);
  const end = Math.min(signal.length, Math.floor(endSeconds * sampleRate));
  let sum = 0;
  for (let index = start; index < end; index++) sum += signal[index] * signal[index];
  return Math.sqrt(sum / Math.max(1, end - start));
}

test('the completion bowl is a warm 2.8s Tibetan bowl: low fundamental, gentle beating, no brittle highs', () => {
  assert.equal(COMPLETION_BOWL_DURATION, 2.8);
  assert.equal(COMPLETION_BOWL_PEAK, 0.42);
  assert.ok(COMPLETION_BOWL_FUNDAMENTAL_HZ >= 240 && COMPLETION_BOWL_FUNDAMENTAL_HZ <= 300);
  assert.equal(COMPLETION_BOWL_BEATING_HZ, 1.4);

  const partials = completionBowlPartials();
  const fundamental = partials[0];
  const beating = partials[1];
  assert.equal(fundamental.frequency, COMPLETION_BOWL_FUNDAMENTAL_HZ);
  assert.ok(Math.abs(beating.frequency - fundamental.frequency - COMPLETION_BOWL_BEATING_HZ) < 1e-9);
  assert.ok(Math.abs(beating.amplitude - 0.32) < 1e-9, 'near partial should add the beating at 0.32');
  // 귀에 거슬리는 3kHz 이상 배음은 없다.
  for (const partial of partials) {
    assert.ok(partial.frequency < 3000, `partial ${partial.frequency}Hz should stay below 3kHz`);
  }
  const mids = partials.slice(2);
  assert.equal(mids.length, 2);
  assert.ok(Math.abs(mids[0].frequency / fundamental.frequency - 2.72) < 1e-9);
  assert.ok(Math.abs(mids[0].amplitude - 0.1) < 1e-9);
  assert.ok(Math.abs(mids[1].frequency / fundamental.frequency - 5.1) < 1e-9);
  assert.ok(mids[1].amplitude > 0 && mids[1].amplitude <= 0.02);

  // 예전 쇠를 때리는 듯한 587Hz/1597Hz/3159Hz 구성은 사라졌다.
  assert.doesNotMatch(bowlSource, /587\.33|589\.15|1597\.54|3159\.84/);
});

test('the rendered bowl starts softly, stays at the intended level and fades out smoothly', () => {
  assert.equal(samples.length, Math.ceil(SAMPLE_RATE * 2.8));
  const peak = samples.reduce((max, value) => Math.max(max, Math.abs(value)), 0);
  assert.ok(Math.abs(peak - COMPLETION_BOWL_PEAK) < 1e-3, `peak should be ${COMPLETION_BOWL_PEAK}, got ${peak}`);

  // 펠트 말렛 어택: 첫 표본은 0에 가깝고, 첫 5ms는 전체 피크의 아주 일부만 찬다(틱/클릭 없음).
  assert.ok(Math.abs(samples[0]) < 1e-6);
  const attackWindow = rmsBetween(samples, 0, 0.005);
  const bodyWindow = rmsBetween(samples, 0.1, 0.5);
  assert.ok(attackWindow < bodyWindow * 0.35, 'the bowl should swell in, not snap in');
  assert.ok(Math.abs(COMPLETION_BOWL_ATTACK_TAU - 0.045) < 1e-9);

  // 사인 배음만 더한 파형이므로 표본 간 도약 자체가 없다(고주파 클릭 없음).
  let maxStep = 0;
  for (let index = 1; index < samples.length; index++) {
    maxStep = Math.max(maxStep, Math.abs(samples[index] - samples[index - 1]));
  }
  assert.ok(maxStep < 0.05, `waveform should not contain sharp jumps, got ${maxStep}`);

  // 마지막 테일은 매끄럽게 0으로 사라진다.
  const tailStart = rmsBetween(samples, 2.2, 2.3);
  const tailEnd = rmsBetween(samples, 2.78, 2.8);
  assert.ok(tailStart > 0.001, 'the bowl should still ring through the 2.2s mark');
  assert.ok(tailEnd < tailStart * 0.05, 'the tail should be nearly silent at the end');
  assert.ok(Math.abs(samples[samples.length - 1]) < 1e-4);
});

test('the bowl is a single warm fundamental with audible midrange and a slow beating breath', () => {
  const fundamentalHz = COMPLETION_BOWL_FUNDAMENTAL_HZ;
  const magnitudeAt = (hz: number) => toneMagnitude(samples, hz);

  const fundamental = magnitudeAt(fundamentalHz) + magnitudeAt(fundamentalHz + 1.4);
  const mid = magnitudeAt(fundamentalHz * 2.72);
  const upperMid = magnitudeAt(fundamentalHz * 5.1);

  assert.ok(fundamental > mid * 5, 'the fundamental must dominate the midrange');
  assert.ok(mid > upperMid * 2, 'the midrange overtone should be gentle, not brittle');
  // 3kHz 이상은 사실상 무음.
  assert.ok(magnitudeAt(3159.84) < fundamental * 0.01);
  assert.ok(magnitudeAt(5000) < fundamental * 0.01);

  // 근접 배음(1.4Hz 맥놀이) 때문에 숨쉬듯 음량이 천천히 오르내린다.
  const windows: number[] = [];
  for (let start = 0.3; start < 2.0; start += 0.09) windows.push(rmsBetween(samples, start, start + 0.09));
  const loudest = Math.max(...windows);
  const quietest = Math.min(...windows);
  assert.ok(loudest / quietest > 1.15, `expected audible beating, got ${(loudest / quietest).toFixed(3)}`);
});

test('TTS completion plays the soft singing bowl instead of the message-send MP3', () => {
  assert.match(hapticsSource, /import \{ playCompletionBowl \} from '\.\/completionBowl';/);
  assert.match(
    hapticsSource,
    /case 'ai_result_chime':\s*\{[\s\S]*?playCompletionBowl\(ctx, bus, volScale\);[\s\S]*?\n\s*break;/,
  );
  assert.doesNotMatch(hapticsSource, /completionChime|playCompletionChime/);
  assert.match(hapticsSource, /label: 'TTS 완료 싱잉볼'/);

  assert.match(ttsSource, /import \{ preloadCompletionBowl \} from '\.\.\/lib\/completionBowl';/);
  assert.match(singleTtsSource, /preloadCompletionBowl\(getSharedAudioContext\(\)\)/);
  assert.match(chunkedTtsSource, /preloadCompletionBowl\(ctx\)/);
  assert.doesNotMatch(ttsSource, /completionChime|preloadCompletionChime/);

  // 완료음은 네트워크 MP3를 받지 않는다 — 합성 버퍼를 미리 데워 두기만 한다.
  assert.doesNotMatch(bowlSource, /fetch\(|decodeAudioData|\.mp3/);
  assert.match(bowlSource, /export function preloadCompletionBowl/);
  assert.equal(existsSync(new URL('../src/lib/completionChime.ts', import.meta.url)), false);
});

test('a chunked reading plays one completion bowl only after its final chunk and leaves ambient music alone', () => {
  assert.match(chunkedTtsSource, /const isLastChunk = i === chunks\.length - 1;/);
  assert.match(chunkedTtsSource, /await playTTS\(currentChunkText,[\s\S]*?sequenceSessionId, true/);
  assert.match(chunkedTtsSource, /if \(isLastChunk\)\s*\{[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
  assert.match(singleTtsSource, /ttsState\.activeSessionId === sessionToVerify && !isSequenceChunk[\s\S]*?if \(shouldPlayTTSCompletionChime\(options\)\)[\s\S]*?playAiResultNotification\(\)/);
  assert.match(hapticsSource, /const bus = getHapticBus\(ctx\)/);
  assert.match(ttsSource, /configureSpeechAudioSession\(\);[\s\S]*?duckAmbientAudio\(true/);
  assert.match(ttsSource, /duckAmbientAudio\(false, 1\.2\);[\s\S]*?configureAmbientAudioSession\(\)/);
});
