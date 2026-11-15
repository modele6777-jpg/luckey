import assert from 'node:assert/strict';
import test from 'node:test';
import {
  HEADER_TAP_MIN_BAND,
  isLucyChatPath,
  isLucyChatScreen,
  notchBandBottom,
  resolvePaneHeaderTap,
  type PaneBox,
} from '../src/lib/duoPaneFocus';

/**
 * Folded iPhone Duo (cover screen, 466px wide) while a lucky channel is open.
 * The channel app title sits at `--page-header-top + 2.1rem` = 59 + 33.6 ≈ 92.6px,
 * below the fixed notch band (max(76, 59+28) = 87px) — the band alone missed it.
 */
const FOLDED_SAFE_AREA_TOP = 59;
const FOLDED_TITLE = { left: 150, top: 92.6, right: 216, bottom: 103.6, width: 66, height: 11 };

const foldedContentPane: PaneBox = {
  pane: 'content',
  visible: true,
  left: 0,
  top: 0,
  right: 466,
  bottom: 640,
  width: 466,
  height: 640,
  title: FOLDED_TITLE,
};

const foldedHiddenLucyPane: PaneBox = {
  pane: 'lucy',
  visible: false,
  left: 0,
  top: 0,
  right: 466,
  bottom: 640,
  width: 466,
  height: 640,
  title: null,
};

const foldedLucyPane: PaneBox = {
  pane: 'lucy',
  visible: true,
  left: 0,
  top: 0,
  right: 466,
  bottom: 640,
  width: 466,
  height: 640,
  title: null,
};

test('notch band clears the device inset but never drops below the status bar band', () => {
  assert.equal(notchBandBottom(0), HEADER_TAP_MIN_BAND);
  assert.equal(notchBandBottom(FOLDED_SAFE_AREA_TOP), FOLDED_SAFE_AREA_TOP + 28);
  assert(notchBandBottom(FOLDED_SAFE_AREA_TOP) < FOLDED_TITLE.top, 'the title sits below the band');
  assert.equal(notchBandBottom(FOLDED_SAFE_AREA_TOP), 87);
});

test('folded channel: pressing the app title scrolls that channel, not the hidden Lucy chat', () => {
  const panes = [foldedContentPane, foldedHiddenLucyPane];
  // A press on the title text itself, below the 87px notch band.
  const titlePress = resolvePaneHeaderTap(183, 98, panes, FOLDED_SAFE_AREA_TOP);
  assert.equal(titlePress?.pane, 'content');

  // The whole title is a tap target, including its top and bottom edges plus slack.
  for (const y of [FOLDED_TITLE.top - 4, FOLDED_TITLE.top + 1, FOLDED_TITLE.bottom - 1, FOLDED_TITLE.bottom + 12]) {
    assert.equal(resolvePaneHeaderTap(183, y, panes, FOLDED_SAFE_AREA_TOP)?.pane, 'content', `y=${y}`);
  }
  for (const x of [FOLDED_TITLE.left - 10, FOLDED_TITLE.right + 10]) {
    assert.equal(resolvePaneHeaderTap(x, 98, panes, FOLDED_SAFE_AREA_TOP)?.pane, 'content', `x=${x}`);
  }
});

test('folded channel: the notch band still works and content taps are left alone', () => {
  const panes = [foldedContentPane, foldedHiddenLucyPane];
  assert.equal(resolvePaneHeaderTap(183, 40, panes, FOLDED_SAFE_AREA_TOP)?.pane, 'content');
  assert.equal(resolvePaneHeaderTap(183, 86, panes, FOLDED_SAFE_AREA_TOP)?.pane, 'content');
  // Body taps, the left logo gutter, and the right gutter never scroll.
  assert.equal(resolvePaneHeaderTap(183, 300, panes, FOLDED_SAFE_AREA_TOP), null);
  assert.equal(resolvePaneHeaderTap(183, FOLDED_TITLE.bottom + 40, panes, FOLDED_SAFE_AREA_TOP), null);
  assert.equal(resolvePaneHeaderTap(20, 98, panes, FOLDED_SAFE_AREA_TOP), null);
  assert.equal(resolvePaneHeaderTap(450, 98, panes, FOLDED_SAFE_AREA_TOP), null);
});

test('folded Lucy screen: only the visible Lucy pane can be scrolled to top', () => {
  const hiddenContentPane: PaneBox = { ...foldedContentPane, visible: false };
  const panes = [hiddenContentPane, foldedLucyPane];
  assert.equal(resolvePaneHeaderTap(200, 60, panes, FOLDED_SAFE_AREA_TOP)?.pane, 'lucy');
  // The hidden channel title position must not resolve to the content pane.
  assert.equal(resolvePaneHeaderTap(183, 98, panes, FOLDED_SAFE_AREA_TOP), null);
});

test('unfolded landscape keeps its per-pane split and title press', () => {
  const safeAreaTop = 0;
  const content: PaneBox = {
    pane: 'content',
    visible: true,
    left: 0,
    top: 0,
    right: 400,
    bottom: 640,
    width: 400,
    height: 640,
    title: { left: 168, top: 47.6, right: 232, bottom: 58.6, width: 64, height: 11 },
  };
  const lucy: PaneBox = {
    pane: 'lucy',
    visible: true,
    left: 400,
    top: 0,
    right: 800,
    bottom: 640,
    width: 400,
    height: 640,
    title: null,
  };
  const panes = [content, lucy];
  assert.equal(resolvePaneHeaderTap(200, 30, panes, safeAreaTop)?.pane, 'content');
  assert.equal(resolvePaneHeaderTap(200, 55, panes, safeAreaTop)?.pane, 'content');
  assert.equal(resolvePaneHeaderTap(200, 66, panes, safeAreaTop)?.pane, 'content', 'still inside the 76px notch band');
  assert.equal(resolvePaneHeaderTap(20, 30, panes, safeAreaTop), null, 'content logo gutter');
  assert.equal(resolvePaneHeaderTap(600, 30, panes, safeAreaTop)?.pane, 'lucy');
  assert.equal(resolvePaneHeaderTap(420, 30, panes, safeAreaTop), null, 'Lucy logo gutter');
});

test('unfolded portrait stacked panes keep the top and bottom header bands apart', () => {
  const safeAreaTop = FOLDED_SAFE_AREA_TOP;
  const content: PaneBox = {
    pane: 'content',
    visible: true,
    left: 0,
    top: 0,
    right: 626,
    bottom: 445,
    width: 626,
    height: 445,
    title: { left: 271, top: 92.6, right: 355, bottom: 103.6, width: 84, height: 11 },
  };
  const lucy: PaneBox = {
    pane: 'lucy',
    visible: true,
    left: 0,
    top: 445,
    right: 626,
    bottom: 890,
    width: 626,
    height: 445,
    title: null,
  };
  const panes = [content, lucy];
  assert.equal(resolvePaneHeaderTap(313, 40, panes, safeAreaTop)?.pane, 'content');
  assert.equal(resolvePaneHeaderTap(313, 98, panes, safeAreaTop)?.pane, 'content', 'content title press');
  assert.equal(resolvePaneHeaderTap(313, 470, panes, safeAreaTop)?.pane, 'lucy');
  assert.equal(resolvePaneHeaderTap(313, 300, panes, safeAreaTop), null);
  assert.equal(resolvePaneHeaderTap(313, 600, panes, safeAreaTop), null, 'bottom pane body');
});

test('a channel route is never the Lucy chat, even with the chat mounted behind it', () => {
  assert.equal(isLucyChatPath('/'), true);
  assert.equal(isLucyChatPath('/chat'), true);
  assert.equal(isLucyChatPath('/chat?mode=ai'), true);
  assert.equal(isLucyChatPath('/lucy'), true);
  assert.equal(isLucyChatPath('/chat/pro'), true);
  assert.equal(isLucyChatPath('/prologue?tab=universe'), false);
  assert.equal(isLucyChatPath('/trinity?tab=tarot'), false);
  assert.equal(isLucyChatPath('/orange'), false);
  assert.equal(isLucyChatPath('/epilogue'), false);
  assert.equal(isLucyChatPath('/key'), false);

  // Folded on /trinity while the Lucy chat is mounted-but-hidden: left/right must stay live.
  assert.equal(isLucyChatScreen('/trinity', '/trinity', false), false);
  assert.equal(isLucyChatScreen('/trinity?tab=oracle', '/trinity', false), false);
  // Folded Lucy chat, and any Lucy route in the open dual layout.
  assert.equal(isLucyChatScreen('/', '/', true), true);
  assert.equal(isLucyChatScreen('/chat', '/chat?mode=ai', false), true);
  assert.equal(isLucyChatScreen('/trinity', '/trinity', true), true);
});
