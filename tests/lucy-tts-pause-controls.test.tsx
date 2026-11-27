import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React, { act } from 'react';
import { Window } from 'happy-dom';
import { LucyTtsControlBar } from '../src/components/lucy/LucyTtsControlBar.tsx';

const ttsSource = readFileSync(new URL('../src/utils/tts.ts', import.meta.url), 'utf8');
const pageSource = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const bubbleSource = readFileSync(new URL('../src/components/chat/LucyKakaoBubbleGroup.tsx', import.meta.url), 'utf8');
const barSource = readFileSync(new URL('../src/components/lucy/LucyTtsControlBar.tsx', import.meta.url), 'utf8');

const chunkSequenceSource = ttsSource.slice(
  ttsSource.indexOf('export const playTTSInChunks'),
  ttsSource.indexOf('export const playConversation'),
);
const conversationSource = ttsSource.slice(
  ttsSource.indexOf('export const playConversation'),
  ttsSource.indexOf('export interface QAndAMessageItem'),
);
const qaSource = ttsSource.slice(
  ttsSource.indexOf('export const playQAndATTS'),
  ttsSource.indexOf('export const useTTSActive'),
);
const manualVoiceSource = pageSource.slice(
  pageSource.indexOf('const handleVoicePlay = async'),
  pageSource.indexOf('const handleTtsTogglePause'),
);
const pauseToggleSource = pageSource.slice(
  pageSource.indexOf('const handleTtsTogglePause'),
  pageSource.indexOf('// Export full conversation as Markdown'),
);

test('pause holds the audio element and resume continues it from the same position', () => {
  const pauseBlock = ttsSource.slice(ttsSource.indexOf('export const pauseTTS'), ttsSource.indexOf('export const resumeTTS'));
  const resumeBlock = ttsSource.slice(ttsSource.indexOf('export const resumeTTS'), ttsSource.indexOf('export const stopTTS'));

  // 일시정지: 세션을 유지한 채 isPaused만 세우고, 실제 오디오와 잠금화면 세션을 멈춘다.
  assert.match(pauseBlock, /if \(!ttsState\.activeSessionId \|\| ttsState\.isPaused\) return;/);
  assert.match(pauseBlock, /updateTTSState\(\{ isSpeaking: false, isLoading: false, isPaused: true \}\)/);
  assert.match(pauseBlock, /pauseTTSAudio\(\);/);
  assert.match(pauseBlock, /pauseTTSSession\(\);/);
  assert.doesNotMatch(pauseBlock, /stopTTS\(|activeSessionId: null/, 'a pause must not end the reading session');

  // 이어듣기: 세션은 그대로 두고 재생만 다시 건다.
  assert.match(resumeBlock, /if \(!ttsState\.activeSessionId \|\| !ttsState\.isPaused\) return;/);
  assert.match(resumeBlock, /resumeTTSAudio\(\);/);
  assert.match(resumeBlock, /updateTTSState\(\{ isPaused: false, isSpeaking: speaking, isLoading: !speaking \}\)/);
  assert.match(resumeBlock, /resumeTTSSession\(\);/);
});

test('the chunk loop waits out a pause instead of moving to the next chunk', () => {
  // 한 청크를 읽는 중에 멈추면 그 오디오가 끝나지 않으므로 다음 청크로 넘어가지 않는다.
  assert.match(
    chunkSequenceSource,
    /for \(let i = startChunkIndex; i < chunks\.length; i\+\+\) \{\s*if \(ttsState\.activeSessionId !== sequenceSessionId \|\| !isPlayingSequence\) \{\s*break;\s*\}\s*if \(!await waitForTTSResume\(sequenceSessionId\)\) break;/,
  );
  // 재생 직전에도 한 번 더 확인한다(요청 응답 대기 중에 눌린 일시정지).
  assert.match(ttsSource, /if \(!await waitForTTSResume\(sessionToVerify!\)\) return;/);
  // 대화 전체·질문/답변 연속 낭독도 일시정지 중에는 다음 발화를 시작하지 않는다.
  assert.match(conversationSource, /if \(!await waitForTTSResume\(mySessionId\)\) break;/);
  assert.equal([...qaSource.matchAll(/if \(!await waitForTTSResume\(sequenceSessionId\)\) break;/g)].length, 2);
});

test('Lucy chat treats a paused reading as still reading and keeps the controls reachable', () => {
  assert.match(pageSource, /import \{ playTTS, playTTSInChunks, playQAndATTS, pauseTTS, resumeTTS, stopTTS/);
  assert.match(pageSource, /isPaused: Boolean\(state\.isPaused\)/);
  assert.match(
    pageSource,
    /const ttsReading = Boolean\(playingMsgId\) \|\| ttsInfo\.isSpeaking \|\| ttsInfo\.isLoading \|\| ttsInfo\.isPaused;/,
  );
  assert.match(
    pageSource,
    /ttsBlocksAutoScrollRef\.current = ttsInfo\.isSpeaking \|\| ttsInfo\.isLoading \|\| ttsInfo\.isPaused \|\| ttsHoldsScrollRef\.current;/,
  );
  assert.match(
    pageSource,
    /const showTtsControlBar = ttsInfo\.isSpeaking \|\| ttsInfo\.isLoading \|\| ttsInfo\.isPaused \|\| Boolean\(playingMsgId\);/,
  );
  // 낭독이 끝난 뒤에만 말풍선 소유권을 놓는다.
  assert.match(pageSource, /if \(!state\.isSpeaking && !state\.isLoading && !state\.isPaused && !state\.activeSessionId\) \{\s*setPlayingMsgId\(null\);/);
});

test('the floating bar pauses, resumes and stops the reading', () => {
  const barUsage = pageSource.slice(pageSource.indexOf('<LucyTtsControlBar'), pageSource.indexOf('onStop={handleTtsStopAll}'));
  assert.match(barUsage, /visible=\{showTtsControlBar\}/);
  assert.match(barUsage, /isPaused=\{ttsInfo\.isPaused\}/);
  assert.match(barUsage, /onTogglePause=\{handleTtsTogglePause\}/);
  assert.match(barUsage, /bottomOffset=\{\(ttsBarFooterHeight \|\| 96\) \+ 8\}/, 'the pill floats right above the measured input bar');

  assert.match(pauseToggleSource, /if \(ttsInfo\.isPaused\) \{[\s\S]*?resumeTTS\(\);[\s\S]*?\} else \{\s*pauseTTS\(\);/);
  assert.match(pauseToggleSource, /manualTtsActiveRef\.current = false;\s*stopTTS\(\);\s*setPlayingMsgId\(null\);/);

  // 컴포넌트 자체: 두 버튼과 상태 표시.
  assert.match(barSource, /data-lucy-tts-toggle=\{isPaused \? 'resume' : 'pause'\}/);
  assert.match(barSource, /data-lucy-tts-stop="true"/);
  assert.match(barSource, /aria-label=\{isPaused \? '이어듣기' : '음성 일시정지'\}/);
  assert.match(barSource, /aria-label="음성 완전히 멈추기"/);
  assert.match(barSource, /isPaused \? '일시정지됨' : isLoading \? '음성 준비 중' : '낭독 중'/);
});

test('tapping the paused bubble resumes it instead of starting over', () => {
  assert.match(
    manualVoiceSource,
    /if \(playingMsgId === id && ttsInfo\.isPaused\) \{\s*resumeTTS\(\);\s*return;\s*\}/,
  );
  assert.match(bubbleSource, /isPaused\?: boolean;/);
  assert.match(bubbleSource, /Boolean\(ttsInfo\?\.isSpeaking \|\| ttsInfo\?\.isLoading \|\| ttsInfo\?\.isPaused\)/);
  assert.match(bubbleSource, /isThisMsgPlaying && ttsInfo\?\.isPaused \? \(/);
  assert.match(bubbleSource, /일시정지됨 · 이어듣기/);
});

test('the floating bar renders its state and hands pause/resume and stop to the caller', async () => {
  const win = new Window({ url: 'https://lucy-tts-pause.invalid' });
  const names = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'IS_REACT_ACT_ENVIRONMENT', 'requestAnimationFrame', 'cancelAnimationFrame'];
  const saved = new Map(names.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of names) {
    const value = key === 'window' ? win
      : key === 'document' ? win.document
        : key === 'getComputedStyle' ? win.getComputedStyle.bind(win)
          : key === 'requestAnimationFrame' ? win.requestAnimationFrame.bind(win)
            : key === 'cancelAnimationFrame' ? win.cancelAnimationFrame.bind(win)
              : key === 'IS_REACT_ACT_ENVIRONMENT' ? true
                : (win as any)[key];
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  try {
    const host = win.document.createElement('div');
    win.document.body.appendChild(host);
    const { createRoot } = await import('react-dom/client');
    const root = createRoot(host as any);
    let toggles = 0;
    let stops = 0;
    const renderBar = (paused: boolean) => root.render(
      <LucyTtsControlBar
        visible
        isLight={false}
        isSpeaking={!paused}
        isLoading={false}
        isPaused={paused}
        sentence="지금 읽고 있는 문장이에요"
        sentenceIndex={2}
        sentenceTotal={8}
        bottomOffset={120}
        onTogglePause={() => toggles++}
        onStop={() => stops++}
      />,
    );

    await act(async () => renderBar(true));
    const bar = host.querySelector('[data-lucy-tts-bar]');
    assert.ok(bar, 'a reading in progress shows the floating bar');
    assert.equal(bar!.getAttribute('data-lucy-tts-bar'), 'paused');
    assert.match(host.textContent || '', /일시정지됨/, 'the held reading is labelled as paused');
    assert.match(host.textContent || '', /지금 읽고 있는 문장/, 'the current sentence is shown in one line');

    const toggle = host.querySelector('[data-lucy-tts-toggle]')!;
    const stop = host.querySelector('[data-lucy-tts-stop]')!;
    assert.equal(toggle.getAttribute('data-lucy-tts-toggle'), 'resume', 'a paused reading offers resume');
    await act(async () => { toggle.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); });
    await act(async () => { stop.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); });
    assert.equal(toggles, 1);
    assert.equal(stops, 1);

    await act(async () => renderBar(false));
    const speakingToggle = host.querySelector('[data-lucy-tts-toggle]')!;
    assert.equal(speakingToggle.getAttribute('data-lucy-tts-toggle'), 'pause', 'a live reading offers pause');
    assert.equal(host.querySelector('[data-lucy-tts-bar]')!.getAttribute('data-lucy-tts-bar'), 'speaking');

    await act(async () => root.unmount());

    const idleHost = win.document.createElement('div');
    win.document.body.appendChild(idleHost);
    const idleRoot = createRoot(idleHost as any);
    await act(async () => idleRoot.render(
      <LucyTtsControlBar
        visible={false}
        isLight={false}
        isSpeaking={false}
        isLoading={false}
        isPaused={false}
        sentence={null}
        bottomOffset={120}
        onTogglePause={() => toggles++}
        onStop={() => stops++}
      />,
    ));
    assert.equal(idleHost.querySelector('[data-lucy-tts-bar]'), null, 'nothing floats when no reading is active');
    await act(async () => idleRoot.unmount());
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
  }
});
