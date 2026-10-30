import ts from 'typescript';
import { transformSync } from 'esbuild';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = readFileSync('src/components/trinity/TrinityOracleSection.tsx', 'utf8');
const ast = ts.createSourceFile('oracle.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const callbacks = new Map();
function visit(n) {
  if (ts.isVariableDeclaration(n) && ['handleModeSwitch', 'handleResetToModeSelection', 'handleCardsComplete'].includes(n.name.getText(ast))) callbacks.set(n.name.getText(ast), n.initializer.getText(ast));
  ts.forEachChild(n, visit);
}
visit(ast);
const saved = { mode: 'healing', healingResult: { message: 'saved' }, drawnCards: [1, 2, 3] };
const changes = {};
const state = {
  freshOracleDrawRef: { current: false }, oracleAnalysisInFlightRef: { current: false },
  localStorage: { setItem() {} }, STORAGE_ORACLE_MODE: '', STORAGE_ORACLE_MODE_SELECTED: '',
  todayDateKey: '2026-10-30', sharedState: {}, oracleMode: 'healing', inquiryText: '',
  loadTodayOracleSession: () => saved, findAnyTodayOracleSession: () => saved,
  useCallback: fn => fn, stopTTS() {},
};
for (const name of ['OracleMode', 'IsModeChosen', 'TodayDailySession', 'SelectedCardIdx', 'ShowAllCardsTogether', 'Stage', 'DrawnCards', 'HealingResult', 'GrowthResult', 'MiracleResult', 'IsHealingCompleted', 'IsGrowthCompleted', 'IsMiracleCompleted', 'InquiryText']) state['set' + name] = value => { changes[name] = value; };
const context = vm.createContext(state);
for (const [name, expression] of callbacks) vm.runInContext(transformSync(`globalThis.${name} = ${expression}`, { loader: 'ts', format: 'cjs' }).code, context);
for (const mode of ['healing', 'miracle', 'growth']) {
  context.handleModeSwitch(mode);
  assert.equal(changes.OracleMode, mode);
  assert.equal(changes.Stage, 'spread');
  assert.equal(changes.IsModeChosen, true);
  assert.equal(changes.HealingResult, null);
  assert(context.freshOracleDrawRef.current);
}
context.handleResetToModeSelection();
assert.equal(changes.IsModeChosen, false);
assert.equal(changes.Stage, 'spread');
context.oracleAnalysisInFlightRef.current = true;
changes.Stage = 'result';
context.handleModeSwitch('growth');
assert.equal(changes.Stage, 'result', 'cannot change mode during analysis');
context.oracleAnalysisInFlightRef.current = false;
context.setDrawnCards = () => { throw new Error('REACHED_NEW_ANALYSIS'); };
await assert.rejects(() => context.handleCardsComplete([1, 2, 3]), /REACHED_NEW_ANALYSIS/);
assert(context.oracleAnalysisInFlightRef.current, 'new analysis retains duplicate-request protection');
console.log('All three modes can redraw despite saved results; mode selection and in-flight guard passed.');
