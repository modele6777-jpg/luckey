import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles/lucy-starlight.css', import.meta.url), 'utf8');

test('live AI detection waits for an active, non-casual detection result', () => {
  assert.match(page, /shouldShowAutoDetectionBadge\(isAutoDetect, isInputFocused, input, liveDetection\)/);
  assert.match(page, /showAutoDetectBadge && autoDetectedTitle && liveDetection/);
});

test('Lucy footer grows with its content instead of clipping the composer at a fixed height', () => {
  const footerStyles = styles.slice(styles.indexOf('/* Fill the usable canvas up to the rail. */'));
  const footerRule = footerStyles.match(/\.lucy-chat-footer\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(footerRule, /height:\s*auto\s*!important/);
  assert.match(footerRule, /max-height:\s*none\s*!important/);
  assert.match(footerRule, /min-height:\s*calc\(74px \+ max\(2px, env\(safe-area-inset-bottom, 0px\)\)\)/);
  assert.doesNotMatch(page, /height:\s*'calc\(74px \+ max\(2px, env\(safe-area-inset-bottom/);
});
