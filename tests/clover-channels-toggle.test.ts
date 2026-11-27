/**
 * 🍀 네잎클로버 접기·펼치기 회귀 검사.
 * 사용자 지시(2026-11-27): "펼쳤을때도 네잎클로버 접기가능하게 바꿔주되 기본값을 펼친 상태로 해줘"
 * - 펼친 화면(데스크톱·듀오 펼침)도 네잎클로버를 눌러 하위 채널 목록을 접고 펼 수 있다.
 * - 기본값은 펼침: 접힘→펼침으로 넘어온 순간에는 목록이 펼쳐져 있다.
 * - 이미 펼친 화면에서 사용자가 접어 둔 상태는 경로 이동·화면 크기 변화로 다시 열리지 않는다.
 * - 접힌 화면의 기존 규칙(럭키 채널이면 펼침, 나가면 접힘)은 그대로다.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  cloverOpenAfterClick,
  cloverOpenAfterExit,
  cloverOpenAfterFoldOrPathChange,
  initialCloverOpen,
} from '../src/lib/cloverChannels';

const SIDEBAR = readFileSync(
  new URL('../src/components/navigation/LeftSidebarNav.tsx', import.meta.url),
  'utf8'
);
const MENU_CSS = readFileSync(
  new URL('../src/components/navigation/menu-refined.css', import.meta.url),
  'utf8'
);

test('펼친 화면의 기본값은 펼침이다', () => {
  assert.equal(initialCloverOpen(true, false), true);
  assert.equal(initialCloverOpen(true, true), true);
});

test('접힌 화면의 기본값은 럭키 채널에서만 펼침이다', () => {
  assert.equal(initialCloverOpen(false, true), true);
  assert.equal(initialCloverOpen(false, false), false);
});

test('접힘→펼침 진입은 펼침으로 시작하고, 이미 펼친 화면에서는 사용자 선택을 유지한다', () => {
  assert.equal(
    cloverOpenAfterFoldOrPathChange({ unfoldedBefore: false, unfolded: true, pathIsLucky: false }),
    true,
    '접힘→펼침 진입은 기본값(펼침)이다'
  );
  assert.equal(
    cloverOpenAfterFoldOrPathChange({ unfoldedBefore: true, unfolded: true, pathIsLucky: true }),
    null,
    '펼친 화면에서 직접 접어 둔 목록은 경로가 바뀌어도 다시 열지 않는다'
  );
  assert.equal(
    cloverOpenAfterFoldOrPathChange({ unfoldedBefore: true, unfolded: true, pathIsLucky: false }),
    null
  );
});

test('접힌 화면 규칙은 그대로다: 럭키 채널이면 펼치고, 나가면 접는다', () => {
  assert.equal(
    cloverOpenAfterFoldOrPathChange({ unfoldedBefore: false, unfolded: false, pathIsLucky: true }),
    true
  );
  assert.equal(
    cloverOpenAfterFoldOrPathChange({ unfoldedBefore: true, unfolded: false, pathIsLucky: false }),
    false
  );
});

test('네잎클로버 클릭은 펼친 화면에서도 접기/펼치기 토글이다', () => {
  assert.deepEqual(cloverOpenAfterClick(true), { open: false, navigate: false }, '펼쳐져 있으면 이동 없이 접는다');
  assert.deepEqual(cloverOpenAfterClick(false), { open: true, navigate: true }, '접혀 있으면 펼치며 럭키로 간다');
});

test('펼친 화면의 prism:close-lucky-channels는 사용자가 접어 둔 상태를 깨지 않는다', () => {
  assert.equal(cloverOpenAfterExit(true), null);
  assert.equal(cloverOpenAfterExit(false), false, '접힌 화면은 기존대로 접는다');
});

test('사이드바는 펼친 화면 강제 펼침 없이 사용자 상태를 그대로 보여 준다', () => {
  assert.match(SIDEBAR, /const channelsVisible = isChannelsOpen;/);
  assert.doesNotMatch(SIDEBAR, /screenUnfolded \|\| isChannelsOpen/);
  assert.doesNotMatch(SIDEBAR, /!screenUnfolded && channelsVisible/);
  assert.match(SIDEBAR, /initialCloverOpen\(isDualPaneLayout\(\)/);
  assert.match(SIDEBAR, /cloverOpenAfterClick\(channelsVisible\)/);
  assert.match(SIDEBAR, /cloverOpenAfterFoldOrPathChange\(\{ unfoldedBefore, unfolded: true, pathIsLucky: open \}\)/);
  assert.match(SIDEBAR, /cloverOpenAfterExit\(/);
});

test('펼친 화면에서도 클로버 목록을 상태와 상관없이 보이게 강제하지 않는다', () => {
  assert.doesNotMatch(MENU_CSS, /html\.duo-unfolded-mode \.refined-prism-icons/);
  assert.doesNotMatch(MENU_CSS, /html\.duo-unfolded-landscape \.refined-prism-icons/);
  assert.doesNotMatch(MENU_CSS, /html\.duo-unfolded-portrait \.refined-prism-icons/);
});
