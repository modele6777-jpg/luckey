import assert from 'node:assert/strict';
import test from 'node:test';
import { isEditableFocused } from '../src/lib/visualViewportBox.ts';

const el = (tagName: string, extra: Record<string, unknown> = {}) => ({ tagName, isContentEditable: false, ...extra });
const doc = (active: unknown) => ({ activeElement: active }) as unknown as Document;

test('a text field inside the Key iframe counts as typing in the parent', () => {
  const inner = doc(el('TEXTAREA'));
  const frame = el('IFRAME', { contentDocument: inner });
  assert.equal(isEditableFocused(doc(frame)), true);
  assert.equal(isEditableFocused(doc(el('IFRAME', { contentDocument: doc(el('INPUT', { type: 'text' })) }))), true);
});

test('an iframe without a focused field, sliders and buttons are not typing', () => {
  assert.equal(isEditableFocused(doc(el('IFRAME', { contentDocument: doc(el('BODY')) }))), false);
  assert.equal(isEditableFocused(doc(el('INPUT', { type: 'range' }))), false);
  assert.equal(isEditableFocused(doc(el('BUTTON'))), false);
  assert.equal(isEditableFocused(doc(null)), false);
});

test('a cross-origin iframe that throws is treated as not typing', () => {
  const frame = { tagName: 'IFRAME', get contentDocument(): Document { throw new Error('blocked'); } };
  assert.equal(isEditableFocused(doc(frame)), false);
});
