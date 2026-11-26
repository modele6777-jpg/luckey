/**
 * 📱 접힘 = 루시 채팅, 펼침 = 루시 점술모드 기본 화면 회귀 검사.
 * 사용자 지시: "접혔을때는 루시채팅, 펼쳤을때는 루시점술이 기본화면이 되게해줘"
 *
 * - 앱을 처음 열었을 때 접힌 화면이면 일반 루시 채팅이, 펼친 화면이면 루시 점술모드가 기본이다.
 * - 접힘 → 펼침 전환은 점술모드를 기본으로 켜고, 펼침 → 접힘 전환은 일반 루시로 되돌린다.
 * - 이미 그 모드면 인사말을 다시 예약하지 않는다.
 * - 빅뱅 버튼·사이드바로 직접 켜고 끈 선택은 그 화면에 머무는 동안 유지된다.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyLucyMasterModeForFoldChange,
  consumeTarotHouseGreetingPending,
  defaultLucyMasterModeForFold,
  initializeLucyMasterModeForFold,
  isLucyMasterModeOn,
  isTarotHouseGreetingPending,
  lucyMasterModeForFoldChange,
  resetLucyMasterModeForTests,
  resolveLucyMasterModeForFold,
  setLucyMasterFoldReaderForTests,
  setLucyMasterMode,
} from '../src/lib/lucyMasterMode.ts';
import { readFileSync } from 'node:fs';

function useFold(unfolded: boolean) {
  setLucyMasterFoldReaderForTests(() => unfolded);
}

function freshLoad(unfolded: boolean) {
  resetLucyMasterModeForTests();
  useFold(unfolded);
}

test('default screen: folded = Lucy chat, unfolded = Lucy divination', () => {
  assert.equal(defaultLucyMasterModeForFold(false), false);
  assert.equal(defaultLucyMasterModeForFold(true), true);
});

test('a record only applies to the screen it was made on', () => {
  const onFolded = { on: true, unfolded: false, explicit: true };
  assert.equal(resolveLucyMasterModeForFold(false, onFolded), true, 'same screen keeps the choice');
  assert.equal(resolveLucyMasterModeForFold(true, onFolded), true, 'other screen falls back to its own default (unfolded)');
  assert.equal(resolveLucyMasterModeForFold(false, null), false);
  assert.equal(resolveLucyMasterModeForFold(true, null), true);
});

test('only a real fold/unfold is a screen change', () => {
  assert.equal(lucyMasterModeForFoldChange(false, false), null);
  assert.equal(lucyMasterModeForFoldChange(true, true), null);
  assert.equal(lucyMasterModeForFoldChange(false, true), true, 'fold → unfold shows divination');
  assert.equal(lucyMasterModeForFoldChange(true, false), false, 'unfold → fold shows Lucy chat');
});

test('opening the app folded starts in Lucy chat without a tarot-house greeting', () => {
  freshLoad(false);
  assert.equal(initializeLucyMasterModeForFold(), false);
  assert.equal(isLucyMasterModeOn(), false);
  assert.equal(isTarotHouseGreetingPending(), false);
});

test('opening the app unfolded starts in Lucy divination and greets once', () => {
  freshLoad(true);
  assert.equal(initializeLucyMasterModeForFold(), true);
  assert.equal(isLucyMasterModeOn(), true);
  assert.equal(isTarotHouseGreetingPending(), true, 'entering divination greets like a manual entry');
  assert.equal(consumeTarotHouseGreetingPending(), true);
  assert.equal(isTarotHouseGreetingPending(), false);
});

test('same screen on reload keeps the screen record instead of re-greeting', () => {
  freshLoad(false);
  initializeLucyMasterModeForFold();

  freshLoad(true);
  initializeLucyMasterModeForFold();
  consumeTarotHouseGreetingPending();
  resetLucyMasterModeForTests({ keepStorage: true });
  useFold(true);
  assert.equal(initializeLucyMasterModeForFold(), true);
  assert.equal(isTarotHouseGreetingPending(), false, 'a reload in the same screen does not re-greet');
});

test('folding and unfolding switch the default screen', () => {
  freshLoad(false);
  initializeLucyMasterModeForFold();
  assert.equal(isLucyMasterModeOn(), false);

  useFold(true);
  assert.equal(applyLucyMasterModeForFoldChange(false, true), true);
  assert.equal(isLucyMasterModeOn(), true);
  assert.equal(isTarotHouseGreetingPending(), true, 'entering divination by unfolding greets');
  consumeTarotHouseGreetingPending();

  useFold(false);
  assert.equal(applyLucyMasterModeForFoldChange(true, false), false);
  assert.equal(isLucyMasterModeOn(), false);
  assert.equal(isTarotHouseGreetingPending(), false);
});

test('unfolding while already in divination keeps it without a duplicate greeting', () => {
  freshLoad(false);
  initializeLucyMasterModeForFold();
  setLucyMasterMode(true); // 사용자가 접힌 화면에서 빅뱅 버튼으로 점술모드에 들어감
  assert.equal(consumeTarotHouseGreetingPending(), true);

  useFold(true);
  assert.equal(applyLucyMasterModeForFoldChange(false, true), true);
  assert.equal(isLucyMasterModeOn(), true);
  assert.equal(isTarotHouseGreetingPending(), false, 'no doubled greeting pending');
});

test('a manual choice stays on its screen, and unfolding resets to the divination default', () => {
  freshLoad(true);
  initializeLucyMasterModeForFold();
  consumeTarotHouseGreetingPending();

  setLucyMasterMode(false); // 펼친 화면에서 빅뱅 버튼으로 코스믹룸(일반 루시)으로 나감
  assert.equal(isLucyMasterModeOn(), false);

  resetLucyMasterModeForTests({ keepStorage: true });
  useFold(true);
  assert.equal(initializeLucyMasterModeForFold(), false, 'same screen reload keeps the manual choice');

  useFold(false);
  applyLucyMasterModeForFoldChange(true, false);
  useFold(true);
  assert.equal(applyLucyMasterModeForFoldChange(false, true), true, 'unfolding again brings divination back');
  assert.equal(isLucyMasterModeOn(), true);
});

test('a manual choice made while folded survives the same folded screen', () => {
  freshLoad(false);
  initializeLucyMasterModeForFold();
  setLucyMasterMode(true);
  assert.equal(isLucyMasterModeOn(), true);

  resetLucyMasterModeForTests({ keepStorage: true });
  useFold(false);
  assert.equal(initializeLucyMasterModeForFold(), true);
});

test('opening unfolded shows divination in App through the shared fold store', () => {
  const main = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  assert.match(main, /initializeLucyMasterModeForFold\(\)/, 'app start applies the fold default screen before the first render');
  assert.match(app, /applyLucyMasterModeForFoldChange\(wasUnfolded, isNowUnfolded\)/, 'fold transitions switch the default screen');
  assert.match(app, /subscribeFoldState\(/, 'the switch rides the one shared fold store');
});
