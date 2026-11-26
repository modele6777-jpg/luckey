/**
 * 루시프로(점술모드) 통합 회귀 검사.
 * 사용자 지시: "루시프로 3단계를 하나로 통합시켜줘 아이콘은 루시채팅 말풍선에 점하나 박아줘"
 *            + "루시일반채팅은 아이콘에 말풍선안을 비워줘"
 * - 단계(1·2·3) 순환은 없어지고 일반 루시 ↔ 루시프로 두 상태만 남는다.
 * - 루시프로는 사주 원국·타로·13대 도구·12대 양피지·엔진함을 처음부터 모두 연다.
 * - 아이콘: 일반 루시 = 속이 빈 말풍선, 루시프로 = 말풍선 안 점 하나.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  LUCY_MASTER_MAX_DEPTH,
  LUCY_MASTER_DEPTH_INFO,
  buildTarotHouseGuide,
  createTarotHouseGreeting,
  deepenLucyMasterDepth,
  getLucyMasterDepth,
  shallowLucyMasterDepth,
} from '../src/lib/lucyMasterMode';
import { LUCY_PRO_TOOLS, LUCY_MASTER_DEPTH3_TOOLS } from '../src/lib/divination/smartAgentRouter';
import { allPageGuides } from '../src/lib/pageGuides';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const SIDEBAR = read('src/components/navigation/LeftSidebarNav.tsx');
const BIGBANG = read('src/components/omniwarp/BigBangButton.tsx');
const PANE = read('src/components/duo/DuoDivinationTarotPane.tsx');
const SHEET = read('src/components/duo/MasterTableSheet.tsx');
const ICON = read('src/components/icons/LucyProBubbleDotIcon.tsx');

test('the pro mode is a single unified state, not three stages', () => {
  assert.equal(LUCY_MASTER_MAX_DEPTH, 1);
  assert.equal(getLucyMasterDepth(), 1);
  assert.deepEqual(deepenLucyMasterDepth(), { depth: 1, changed: false });
  assert.deepEqual(shallowLucyMasterDepth(), { depth: 1, changed: false });
  assert.ok(LUCY_MASTER_DEPTH_INFO[1].note.includes('13대 도구'));
  assert.equal(LUCY_MASTER_DEPTH3_TOOLS.length, 13);
  assert.deepEqual(LUCY_MASTER_DEPTH3_TOOLS, LUCY_PRO_TOOLS);
});

test('every face of the divination table is open from the start', () => {
  for (const face of ['saju', 'tarot', 'recommended', 'scrolls', 'engines']) {
    assert.ok(PANE.includes(`id: '${face}'`), `unfolded pane face ${face}`);
    assert.ok(SHEET.includes(`id: '${face}'`), `folded sheet face ${face}`);
  }
  for (const source of [PANE, SHEET]) {
    assert.doesNotMatch(source, /stage <= depth|toolsAvailable|tarotAvailable/, 'no stage gating');
    assert.doesNotMatch(source, /단계<\/span>/, 'no stage sub-label');
  }
});

test('the pro bubble is an empty outline with one dot inside', () => {
  assert.match(ICON, /createLucideIcon/);
  // MessageCircleMinus·Plus와 같은 말풍선 윤곽선
  assert.match(ICON, /M2\.992 16\.342/);
  assert.match(ICON, /cx: '12', cy: '12', r: '2', fill: 'currentColor', stroke: 'none'/);
});

test('regular Lucy shows an empty bubble, only the pro mode shows the dot', () => {
  for (const source of [SIDEBAR, BIGBANG]) {
    assert.match(source, /LucyProBubbleDotIcon/, 'pro icon imported');
    assert.doesNotMatch(source, /MessageCircleMore|MessageCircleQuestion|MessageCircleWarning/);
    assert.doesNotMatch(source, /MessageCirclePlus|MessageCircleMinus/);
    // 일반 루시 = 속이 빈 MessageCircle, 루시프로 = 점 말풍선
    assert.match(source, /isLucyMaster \? LucyProBubbleDotIcon : MessageCircle|masterOn \? LucyProBubbleDotIcon : MessageCircle/);
  }
});

test('no stage wording is left in the pro greeting, guide or page guides', () => {
  const greeting = String(createTarotHouseGreeting('쭈', 'unfolded').content);
  assert.match(greeting, /루시프로/);
  assert.doesNotMatch(greeting, /3단계|한 단계씩/);
  const guide = buildTarotHouseGuide('unfolded', false);
  assert.match(guide, /통합 상담/);
  assert.doesNotMatch(guide, /상담 깊이 3단계|상담 깊이 2단계/);

  const masterGuide = allPageGuides().find(item => item.id === 'master')!;
  const text = [...masterGuide.steps, ...masterGuide.tips.map(tip => `${tip.icon} ${tip.text}`)].join('\n');
  assert.match(masterGuide.title, /루시프로/);
  assert.doesNotMatch(text, /1단계|2단계|3단계|… \? !|한 단계씩|한 단계 깊게/);
  assert.match(text, /13대 추천 도구|13대 도구|13개 도구/);
});
