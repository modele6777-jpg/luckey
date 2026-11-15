import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { shouldPreserveDuoSplitForLucyAction } from '../src/lib/duoLucyActionRouting.ts';

const appContextSource = readFileSync(new URL('../src/contexts/AppContext.tsx', import.meta.url), 'utf8');
const lucyPageSource = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const openLucyChatSource = appContextSource.slice(
  appContextSource.indexOf('const openLucyChat = useCallback'),
  appContextSource.indexOf('const openHandbook = useCallback'),
);

test('a Lucy action preserves the expanded split only while both panes are mounted', () => {
  assert.equal(shouldPreserveDuoSplitForLucyAction(true, true), true);
  assert.equal(shouldPreserveDuoSplitForLucyAction(true, false), false);
  assert.equal(shouldPreserveDuoSplitForLucyAction(false, true), false);
  assert.equal(shouldPreserveDuoSplitForLucyAction(false, false), false);
});

test('Lucy actions avoid navigation in the split while still updating persona and sending injected prompts', () => {
  assert.match(openLucyChatSource, /setActivePersona\(targetPersona\)/);
  assert.match(openLucyChatSource, /shouldPreserveDuoSplitForLucyAction\([\s\S]*?duo-content-viewport[\s\S]*?duo-lucy-viewport/);
  assert.match(openLucyChatSource, /if \(preserveDuoSplit\)[\s\S]*?\}\s*else\s*\{[\s\S]*?window\.dispatchEvent\(new CustomEvent\('prism-navigate'/);
  assert.match(openLucyChatSource, /if \(preserveDuoSplit\)[\s\S]*?new CustomEvent\('lucy-inject-message',[\s\S]*?channel: targetMode/);
  assert.match(openLucyChatSource, /options\?\.draftPrompt[\s\S]*?draftOnly: true/);
  assert.match(lucyPageSource, /const handleDynamicInject = \(e: Event\)[\s\S]*?setActiveChannels\(injectedChannels\);[\s\S]*?if \(!detail\.prompt\) return;[\s\S]*?if \(detail\.draftOnly\)[\s\S]*?setInput\(detail\.prompt\)/);
  assert.match(lucyPageSource, /handleSendRef\.current\(detail\.prompt, injectedChannels\)/);
});

test('the chat pane stays the same logical pane when CSS swaps its physical left/right position', () => {
  assert.match(appSource, /data-workspace-pane="content"/);
  assert.match(appSource, /data-workspace-pane="lucy"/);
  assert.match(appSource, /isDuoPanesSwapped \? 'flex-row-reverse' : 'flex-row'/);
  assert.match(appSource, /setDuoPanesSwapped\(\(previous\) => !previous\)/);
});
