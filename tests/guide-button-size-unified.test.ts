/**
 * 📐 전체 채널 상단 가이드 아이콘 = 루시 채팅 헤더와 동일 (2026-11-28 사용자 지시)
 *  - "전체 페이지 가이드 아이콘 크기를 루시채팅에 나오는 크기로 동일시켜줘"
 *  - "전체 채널 상단 아이콘을 루시채팅과 동일하게 해줘 효과나 크기 전부"
 *
 * 루시 채팅 헤더의 가이드(책)·스마트 가이드(물음표) 버튼은 32px(h-8 w-8) 안에 17px 아이콘,
 * 테두리·배경 없는 투명 버튼이고, hover 시 opacity .7·누르면 scale .95다
 * (src/styles/lucy-starlight.css `.lucy-header-actions`).
 * 앱의 어느 화면도 이 크기·모양·반응을 넘기거나 줄이지 않도록 상수·사용처·Key 안쪽 버튼까지 한 번에 검사한다.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  GUIDE_BUTTON_HALF_HEIGHT,
  GUIDE_BUTTON_ICON_SIZE,
  GUIDE_BUTTON_INTERACTION_CLASS,
  GUIDE_BUTTON_SIZE_CLASS,
  GUIDE_BUTTON_TONE_TEXT,
} from '../src/components/guide/guideButtonLayout.ts';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

const pageGuideSource = read('../src/components/guide/PageGuide.tsx');
const settingsSource = read('../src/components/guide/SmartGuideSettings.tsx');
const calmSource = read('../src/pages/CalmApp.tsx');
const lucySource = read('../src/pages/LucyStandalonePage.tsx');
const appSource = read('../src/App.tsx');
const duoRoomSource = read('../src/components/duo/DuoCosmicAmbientRoom.tsx');
const orbSource = read('../src/components/lucy/LucyOrbCounsel.tsx');
const lucyCss = read('../src/styles/lucy-starlight.css');
const keyStyle = read('../public/calm/style.css');
const keyScript = read('../public/calm/key-search.js');

test('the shared guide button metrics match the Lucy chat header (32px button, 17px icon)', () => {
  assert.equal(GUIDE_BUTTON_SIZE_CLASS, 'h-8 w-8', '버튼은 32px(h-8 w-8)다');
  assert.equal(GUIDE_BUTTON_ICON_SIZE, 17, '아이콘은 17px이다');
  assert.equal(GUIDE_BUTTON_HALF_HEIGHT, 16, '32px 버튼의 절반 높이는 16px이다');
  // 루시 채팅 헤더가 실제로 32px·17px인 기준이다 (다른 화면이 이 값을 따라간다).
  assert.match(lucyCss, /\.lucy-header-actions svg \{ width: 17px; height: 17px;/, '루시 채팅 헤더 아이콘은 17px이다');
});

test('both guide buttons draw the shared size and never hard-code their own pixel size', () => {
  for (const [name, source, icon, marker] of [
    ['PageGuideButton', pageGuideSource, 'BookOpen', 'data-page-guide-button'],
    ['SmartGuideSettingsButton', settingsSource, 'HelpCircle', 'data-smart-guide-settings-button'],
  ] as const) {
    assert.match(source, /import \{ GUIDE_BUTTON_ICON_SIZE[^}]*GUIDE_BUTTON_SIZE_CLASS[^}]*\} from ['"]\.\/guideButtonLayout['"]/, `${name}는 공통 크기 상수를 가져온다`);
    assert.ok(source.includes('${GUIDE_BUTTON_SIZE_CLASS}'), `${name}는 공통 32px 버튼 클래스를 쓴다`);
    assert.ok(source.includes(`<${icon} size={GUIDE_BUTTON_ICON_SIZE}`), `${name}는 공통 17px 아이콘 크기를 쓴다`);
    assert.doesNotMatch(source, new RegExp(`<${icon} size=\\{1[0-9]\\}`), `${name}에 개별 아이콘 크기가 남지 않는다`);
    // 헤더 버튼 자체에는 32px(height/width)를 키우는 클래스가 없어야 한다.
    const start = source.lastIndexOf('<button', source.indexOf(marker));
    const buttonTag = source.slice(start, source.indexOf('>', source.indexOf(marker)) + 1);
    assert.doesNotMatch(buttonTag, /[hw]-1[0-2]\b/, `${name} 버튼 클래스가 크기를 키우지 않는다`);
  }
});

test('no page overrides the guide button size with its own className', () => {
  for (const [name, source] of [
    ['App.tsx', appSource],
    ['LucyStandalonePage.tsx', lucySource],
    ['DuoCosmicAmbientRoom.tsx', duoRoomSource],
    ['LucyOrbCounsel.tsx', orbSource],
    ['CalmApp.tsx', calmSource],
  ] as const) {
    assert.ok(source.includes('PageGuideButton') || source.includes('SmartGuideSettingsButton'), `${name}에 가이드 버튼이 있다`);
    const tags = source.match(/<(?:PageGuideButton|SmartGuideSettingsButton)\b[^>]*>/g) ?? [];
    for (const tag of tags) {
      assert.doesNotMatch(
        tag,
        /className=.*(?:h-\d|w-\d|size-\[)/,
        `${name}의 가이드 버튼 태그가 크기를 덮어쓰지 않는다: ${tag.replace(/\s+/g, ' ')}`,
      );
    }
  }
});

test('the Key header and the guide buttons inside the Key frame use the same 32px·17px', () => {
  // 부모 화면(앱)이 그리는 Key 헤더 버튼 3종
  assert.match(calmSource, /<SmartGuideSettingsButton tone="key" \/>/, 'Key 물음표 버튼은 크기 오버라이드가 없다');
  const guideButton = calmSource.slice(calmSource.indexOf('data-key-guide-parent'), calmSource.indexOf('data-key-search-parent'));
  assert.match(guideButton, /<BookOpen size=\{GUIDE_BUTTON_ICON_SIZE\}/, 'Key 가이드 아이콘은 17px 상수다');
  assert.match(guideButton, /\$\{GUIDE_BUTTON_SIZE_CLASS\} items-center justify-center rounded-full/, 'Key 가이드 버튼은 32px 원형이다');
  assert.match(calmSource, /rect\.top \+ rect\.height \/ 2 - GUIDE_BUTTON_HALF_HEIGHT/, '오버레이 버튼 줄은 32px 기준으로 세로 중앙을 맞춘다');

  // Key 안쪽(아이프레임)이 직접 그리는 검색·가이드 버튼
  for (const cls of ['key-guide-btn', 'key-search-btn']) {
    const start = keyStyle.indexOf(`.${cls} {`);
    assert.ok(start > 0, `${cls} 규칙이 있다`);
    const rule = keyStyle.slice(start, keyStyle.indexOf('}', start));
    assert.match(rule, /width: 32px;/, `${cls} 폭은 32px이다`);
    assert.match(rule, /height: 32px;/, `${cls} 높이는 32px이다`);
  }
  assert.match(keyStyle, /\.top-nav \.key-guide-btn \{ height: 32px; \}/, '상단 내비에서도 32px 높이를 유지한다');
  assert.match(keyScript, /guide\.innerHTML = '<svg width="17" height="17"/, 'Key 안쪽 가이드 아이콘은 17px이다');
  assert.match(keyScript, /btn\.innerHTML = '<svg width="17" height="17"/, 'Key 안쪽 검색 아이콘은 17px이다');
});

test('the orb header note sits at the same icon size as the guide button beside it', () => {
  assert.match(orbSource, /<Music size=\{GUIDE_BUTTON_ICON_SIZE\}/, '배경음 아이콘은 17px 음표다');
  const start = read('../src/components/lucy/lucy-orb-counsel.css').indexOf('.lucy-orb-header .lucy-orb-bed {');
  const rule = read('../src/components/lucy/lucy-orb-counsel.css').slice(start, read('../src/components/lucy/lucy-orb-counsel.css').indexOf('}', start));
  assert.match(rule, /width: 32px;/, '배경음 버튼은 가이드 버튼과 같은 32px다');
});

test('every channel header icon is the same transparent button as the Lucy chat header', () => {
  // 테마별 아이콘 글자색만 배경에 맞춘 대비이고, 버튼 자체는 테두리·배경이 없다.
  assert.deepEqual({ ...GUIDE_BUTTON_TONE_TEXT }, { dark: 'text-white/90', light: 'text-slate-700', key: 'text-[#c9805c]' });
  assert.match(GUIDE_BUTTON_INTERACTION_CLASS, /transition-all/, '색·투명도 전환이 있다');
  assert.match(GUIDE_BUTTON_INTERACTION_CLASS, /active:scale-95/, '누르면 살짝 줄어든다');
  assert.match(GUIDE_BUTTON_INTERACTION_CLASS, /hover:opacity-70/, 'hover하면 루시 채팅처럼 흐려진다');

  // 두 버튼 컴포넌트의 기본값이 루시 채팅과 같은 무박스 스타일이다.
  assert.match(pageGuideSource, /unboxed = true \}/, '가이드 버튼은 무박스가 기본이다');
  assert.match(settingsSource, /unboxed = true \}/, '물음표 버튼은 무박스가 기본이다');
  assert.ok(pageGuideSource.includes('border-0 bg-transparent'), '가이드 버튼은 테두리·배경이 없다');
  assert.ok(pageGuideSource.includes('GUIDE_BUTTON_INTERACTION_CLASS'), '가이드 버튼은 공통 hover·눌름 효과를 쓴다');
  assert.ok(settingsSource.includes('GUIDE_BUTTON_INTERACTION_CLASS'), '물음표 버튼은 공통 hover·눌름 효과를 쓴다');
  for (const source of [pageGuideSource, settingsSource]) {
    assert.ok(source.includes('border-0 bg-transparent'), '무박스 스타일로 그린다');
  }
  // 박스형으로 되돌리는 호출이 어느 페이지에도 없다 (기본값만 쓴다).
  for (const [name, source] of [
    ['App.tsx', appSource],
    ['LucyStandalonePage.tsx', lucySource],
    ['DuoCosmicAmbientRoom.tsx', duoRoomSource],
    ['LucyOrbCounsel.tsx', orbSource],
    ['CalmApp.tsx', calmSource],
  ] as const) {
    assert.doesNotMatch(source, /unboxed=\{false\}/, `${name}은 박스형 가이드 버튼을 쓰지 않는다`);
  }

  // Key 화면(부모 오버레이)의 책·검색 버튼도 투명 버튼이다.
  assert.match(calmSource, /\$\{GUIDE_BUTTON_TONE_TEXT\.key\}/, 'Key 헤더 아이콘은 구리색 글자색만 쓴다');
  assert.match(calmSource, /\$\{GUIDE_BUTTON_INTERACTION_CLASS\}/, 'Key 헤더 아이콘도 같은 hover·눌름 효과를 쓴다');
  const keyOverlay = calmSource.slice(calmSource.indexOf('data-key-guide-parent'), calmSource.indexOf('{guideOpen !== null'));
  assert.doesNotMatch(keyOverlay, /border border|bg-\[#fffdf9\]|shadow-sm/, 'Key 헤더 아이콘에 테두리·배경·그림자가 없다');

  // Key 아이프레임(단독 열기)의 검색·가이드 버튼도 투명 버튼이다.
  for (const cls of ['key-guide-btn', 'key-search-btn']) {
    const start = keyStyle.indexOf(`.${cls} {`);
    const rule = keyStyle.slice(start, keyStyle.indexOf('}', start));
    assert.match(rule, /border: 0;/, `${cls}에 테두리가 없다`);
    assert.match(rule, /background: transparent;/, `${cls}에 배경 상자가 없다`);
    assert.match(rule, /box-shadow: none;/, `${cls}에 그림자가 없다`);
  }
  assert.match(keyStyle, /\.key-guide-btn:hover \{ opacity: \.7; \}/, 'Key 아이프레임 가이드 버튼도 hover 시 흐려진다');

  // 오브 헤더의 배경음 버튼도 가이드 버튼과 같은 투명 버튼이다.
  const orbCss = read('../src/components/lucy/lucy-orb-counsel.css');
  const bedStart = orbCss.indexOf('.lucy-orb-header .lucy-orb-bed {');
  const bedRule = orbCss.slice(bedStart, orbCss.indexOf('}', bedStart));
  assert.match(bedRule, /border: 0;/, '오브 배경음 버튼에 테두리가 없다');
  assert.match(bedRule, /background: transparent;/, '오브 배경음 버튼에 배경 상자가 없다');
  assert.match(orbCss, /\.lucy-orb-header \.lucy-orb-bed:hover \{ background: transparent; opacity: \.7; \}/, 'hover 시 루시 채팅처럼 흐려진다');
});

test('the ON state turns the header icon yellow instead of drawing a ring', () => {
  const indexCss = read('../src/index.css');
  assert.match(
    indexCss,
    /\[data-page-guide-button\]\[aria-expanded='true'\],\s*\[data-smart-guide-settings-button\]\[aria-pressed='true'\] \{\s*border: 0;\s*color: #f5c542 !important;/,
    '켜짐 상태에서는 테두리 없이 아이콘만 노란색이다',
  );
  assert.match(lucyCss, /\.lucy-chat-shell \.lucy-header-actions > button:is\(\[aria-pressed='true'\], \[aria-expanded='true'\]\) \{ border: 0 !important; color: #f5c542 !important;/, '루시 채팅 헤더도 같은 노란색이다');
  assert.doesNotMatch(indexCss, /rgba\(120, 159, 139/, '세이지 테두리는 더 이상 쓰지 않는다');
});
