/**
 * 루시프로(점술모드) 통합 회귀 검사.
 * 사용자 지시: "루시프로 3단계를 하나로 통합시켜줘 아이콘은 루시채팅 말풍선에 점하나 박아줘"
 *            + "루시일반채팅은 아이콘에 말풍선안을 비워줘"
 * - 단계(1·2·3) 순환은 없어지고 일반 루시 ↔ 루시프로 두 상태만 남는다.
 * - 루시프로는 사주 원국·타로·13대 도구·12대 양피지·엔진함을 처음부터 모두 연다.
 * - 아이콘: 일반 루시 = 속이 빈 말풍선, 루시프로 = 말풍선 안 점 하나.
 * - 빅뱅 버튼 좌·우 탭: 어느 쪽을 눌러도 루시프로 켜기·끄기(사용자: "루시일반채팅에서 좌측 빅뱅버튼 눌러도 점술모드로 가게 해줘").
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
const GUIDE = read('src/lib/pageGuides.ts');
const PANE = read('src/components/duo/DuoDivinationTarotPane.tsx');
const SHEET = read('src/components/duo/MasterTableSheet.tsx');
const ICON = read('src/components/icons/LucyProBubbleDotIcon.tsx');
const PAGE = read('src/pages/LucyStandalonePage.tsx');
const MODE_NAME = read('src/components/chat/LucyModeName.tsx');
const SHEET_BUTTON = SHEET.slice(SHEET.indexOf('export function MasterTableSheetButton'));

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

test('the pro header shows no unified badge — only the Lucy Pro name', () => {
  // 사용자 지시: "루시프로 상단 통합배지 없애주고" (2026-11-26)
  assert.doesNotMatch(PAGE, /data-lucy-pro-badge/, 'no pro badge element');
  assert.doesNotMatch(PAGE, />\s*통합\s*<\/span>/, 'no 통합 badge label');
  assert.doesNotMatch(PAGE, /data-lucy-master-depth=/, 'no depth badge marker');
});

test('the Pro wordmark is a straight sans-serif, not an italic serif', () => {
  // 사용자 지시: "Pro 글씨체 바꿔줘" (2026-11-26)
  assert.match(MODE_NAME, /<span className="font-sans font-extrabold tracking-wide" style=\{style\}>Pro<\/span>/);
  assert.doesNotMatch(MODE_NAME, /font-serif[^"`]*italic[^`]*>Pro</, 'the Pro word is no longer an italic serif');
});

test('the divination tool button is a pencil-only round icon', () => {
  // 사용자 지시: "도구버튼도 연필모양 아이콘으로 바꿔줘" (2026-11-26)
  assert.match(SHEET, /import \{[^}]*\bPencil\b[^}]*\} from 'lucide-react'/);
  assert.match(SHEET_BUTTON, /<Pencil size=\{15\}/);
  assert.match(SHEET_BUTTON, /h-8 w-8 shrink-0 items-center justify-center rounded-full/, 'round 32px icon button');
  assert.doesNotMatch(SHEET_BUTTON, /🔮/, 'no crystal ball emoji');
  assert.doesNotMatch(SHEET_BUTTON, />\s*도구\s*</, 'no 도구 text label');
  // 접근성·동작·색상 톤은 그대로
  assert.match(SHEET_BUTTON, /data-master-table-sheet-button/);
  assert.match(SHEET_BUTTON, /aria-label="점술 도구 보기"/);
  assert.match(SHEET_BUTTON, /title="점술 도구"/);
  assert.match(SHEET_BUTTON, /tone === 'light'/);
  assert.match(SHEET_BUTTON, /requestLucyTableFace\('engines'\)/);
});

test('the pro greeting no longer carries the 💡 integration hint paragraph', () => {
  // 사용자 지시: "점술모드 인사말에 💡 지금은 루시프로 통합 상담이야… 없애줘" (2026-11-26)
  for (const layout of ['folded', 'unfolded'] as const) {
    for (const askToLink of [false, true]) {
      const content = String(createTarotHouseGreeting('쭈', layout, askToLink).content);
      assert.doesNotMatch(content, /💡/);
      assert.doesNotMatch(content, /지금은 루시프로 통합 상담이야/);
      assert.doesNotMatch(content, /빅뱅 버튼을 한 번 탭하거나/);
      assert.doesNotMatch(content, /처음부터 다 열려 있어/);
      assert.ok(!/\n{3,}/.test(content), 'no leftover blank lines where the hint was');
    }
  }
  // 인사말 본문 다음에 빈 줄 하나를 두고 바로 고민 질문이 붙는다
  const content = String(createTarotHouseGreeting('쭈', 'unfolded').content);
  assert.match(content, /뽑아보자\.\n\n오늘은 어떤 고민이나 궁금한 게 있어\?/);
  // 소스 어디에도 안내 문구가 남아 있지 않다
  assert.doesNotMatch(read('src/lib/lucyMasterMode.ts'), /지금은 루시프로 통합 상담이야/);
});

test('no stage wording is left in the pro greeting, guide or page guides', () => {
  const greeting = String(createTarotHouseGreeting('쭈', 'unfolded').content);
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

test('a left (west) tap in the regular Lucy chat enters the pro mode, same as the right (east) tap', () => {
  const start = BIGBANG.indexOf('루시 채팅 화면에서 좌·우 탭');
  assert.ok(start >= 0, 'chat-view west/east handling block exists');
  const end = BIGBANG.indexOf('Key 채널에서 좌·우 탭', start);
  assert.ok(end > start, 'the chat-view block ends before the Key channel block');
  const block = BIGBANG.slice(start, end);

  // 좌·우를 한 분기에서 같이 받는다
  assert.match(block, /targetDir === 'west' \|\| targetDir === 'east'/);
  // 왼쪽만 다르게 처리하거나 왼쪽 동작을 제한하는 분기가 남아 있으면 실패
  assert.doesNotMatch(block, /if \(targetDir === 'east'\)/, 'east-only branch is gone');
  assert.doesNotMatch(block, /else if \(masterNow\)/, 'left tap is no longer limited to turning the mode off');
  // 일반 루시에서 누르면 켜기, 루시프로에서 누르면 끄기 — 좌·우 공통 토글
  assert.match(
    block,
    /if \(!masterNow\) \{\s*setLucyMasterMode\(true\);\s*playLucyMasterSuction\('in'\);\s*if \(isLucyMasterBgmPreferred\(\)\) void startLucyMasterBgm\(\);\s*\} else \{\s*playLucyMasterSuction\('out'\);\s*setLucyMasterMode\(false\);\s*\}/,
    'both directions run the same on/off toggle',
  );
});

test('the page guide explains both directions as the pro toggle', () => {
  assert.match(GUIDE, /빅뱅 버튼 왼쪽·오른쪽 어느 쪽을 눌러도 루시프로가 켜지고/);
  assert.doesNotMatch(GUIDE, /왼쪽을 누르면 언제든 일반 루시로 돌아와요/);
});
