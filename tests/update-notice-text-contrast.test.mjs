import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

function ruleFor(selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `Missing CSS rule: ${selector}`);
  const end = css.indexOf('}', start);
  assert.notEqual(end, -1, `Unclosed CSS rule: ${selector}`);
  return css.slice(start, end + 1);
}

test('update notice summary and item copy have explicit WebKit text fill in both themes', () => {
  const lightSummary = ruleFor('.update-notice-modal .update-notice-summary,\n.update-notice-modal .update-notice-note');
  const lightItem = ruleFor('.update-notice-modal .update-notice-item > span:not(.text-amber-500)');
  const darkSummary = ruleFor('html.dark .update-notice-modal .update-notice-summary,\nhtml.dark .update-notice-modal .update-notice-note');
  const darkItem = ruleFor('html.dark .update-notice-modal .update-notice-item > span:not(.text-amber-500)');

  assert.match(lightSummary, /color:\s*#0f172a\s*!important/);
  assert.match(lightSummary, /-webkit-text-fill-color:\s*#0f172a\s*!important/);
  assert.match(lightItem, /-webkit-text-fill-color:\s*#334155\s*!important/);
  assert.match(darkSummary, /-webkit-text-fill-color:\s*#f8fafc\s*!important/);
  assert.match(darkItem, /-webkit-text-fill-color:\s*#cbd5e1\s*!important/);
});
