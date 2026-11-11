import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const component = readFileSync(new URL('../src/components/UpdateNoticeModal.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');

test('update notice content has explicit contrast-safe colors in light and dark themes', () => {
  assert.match(component, /className="update-notice-modal/);
  assert.match(component, /className="update-notice-entry/);
  assert.match(component, /className="update-notice-summary/);
  assert.match(component, /className="update-notice-item/);
  assert.match(styles, /\.update-notice-modal\s*\{[^}]*background-color:\s*#ffffff !important/);
  assert.match(styles, /\.update-notice-modal \.update-notice-summary\s*\{[^}]*color:\s*#0f172a !important/);
  assert.match(styles, /\.update-notice-modal \.update-notice-item,\s*\.update-notice-modal \.update-notice-note\s*\{[^}]*color:\s*#334155 !important/);
  assert.match(styles, /html\.dark \.update-notice-modal\s*\{[^}]*background-color:\s*#0f172a !important/);
  assert.match(styles, /html\.dark \.update-notice-modal \.update-notice-summary\s*\{[^}]*color:\s*#f8fafc !important/);
  assert.match(styles, /html\.dark \.update-notice-modal \.update-notice-item,\s*html\.dark \.update-notice-modal \.update-notice-note\s*\{[^}]*color:\s*#cbd5e1 !important/);
});
