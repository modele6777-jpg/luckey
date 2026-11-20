import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles/lucy-starlight.css', import.meta.url), 'utf8');

test('typing in the composer no longer runs live AI mode detection or shows its badge', () => {
  // Removed at the user's request (2026-11-20); mode routing happens only on send.
  assert.doesNotMatch(page, /shouldShowAutoDetectionBadge/);
  assert.doesNotMatch(page, /lucy-auto-detect-badge/);
  assert.doesNotMatch(page, /liveDetection/);
});

test('Lucy footer grows with its content instead of clipping the composer at a fixed height', () => {
  const footerStyles = styles.slice(styles.indexOf('/* Fill the usable canvas up to the rail. */'));
  const footerRule = footerStyles.match(/\.lucy-chat-footer\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(footerRule, /height:\s*auto\s*!important/);
  assert.match(footerRule, /max-height:\s*none\s*!important/);
  assert.match(footerRule, /min-height:\s*calc\(74px \+ max\(2px, env\(safe-area-inset-bottom, 0px\)\)\)/);
  assert.doesNotMatch(page, /height:\s*'calc\(74px \+ max\(2px, env\(safe-area-inset-bottom/);
});
