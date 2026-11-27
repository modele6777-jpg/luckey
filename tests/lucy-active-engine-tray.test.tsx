import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { selectOptimalDivinationTools } from '../src/lib/fifteenDivinationTools';
import { routeAndExecute, LUCY_PRO_TOOLS } from '../src/lib/divination/smartAgentRouter';
import {
  EMPTY_ACTIVE_ENGINE_TRAY_GUIDE,
  activeEngineTrayIsEmpty,
  buildActiveEngineTray,
} from '../src/lib/lucyActiveEngineTray';
import { isLightConcern, resolveLucyToolBudget, LUCY_TOOL_BUDGETS } from '../src/lib/divination/lucyToolBudget';
import { buildToolBoard } from '../src/lib/lucyMasterToolBoard';
import { DivinationTableBody, MasterTableSheetBody } from '../src/components/duo/MasterTableSheet';
import { MasterToolTabPanel } from '../src/components/duo/MasterToolTabPanel';
import { DivinationToolTabBar, LOCKED_TOOL_TAB_NOTE, resolveToolTabViews } from '../src/components/duo/MasterToolTabs';
import { DIVINATION_TOOL_TABS } from '../src/lib/divination/trayTabs';
import type { LucyTableState } from '../src/lib/lucyTableBus';
import type { CalculationAuditItem } from '../src/lib/divination/calculationAudit';

const profile = {
  basic: {
    name: '검사용',
    birthdate: '1990-05-17',
    birthtime: '14:30',
    gender: 'female' as const,
    birthCity: '서울',
    lunarSolar: 'solar' as const,
  },
} as any;

const proSelection = (text: string, deep = false) => selectOptimalDivinationTools(text, [], profile, false, {
  allowMaster: false,
  requireBasicAndDeep: true,
  divinationMode: { base: 'saju', deep },
});

const emptyTable = (): LucyTableState => ({
  saju: null, lastAnswer: '', lastAnswerHasTarot: false, answerVersion: 0,
  tools: [], concern: '', facts: {}, toolData: {}, cards: [],
  activeEngines: { foundational: [], deep: [], total: 0 },
});

const audit = (items: Array<Partial<CalculationAuditItem> & { toolId: string }>): CalculationAuditItem[] =>
  items.map(item => ({ name: item.toolId, status: 'calculated', sentToModel: true, ...item } as CalculationAuditItem));

/* ───────────────── 절제: 질문마다 필요한 소수만 고른다 ───────────────── */

test('a light turn uses the smallest budget, a normal worry a few tools, and a deep request only widens perspectives', () => {
  assert.equal(isLightConcern('안녕'), true);
  assert.equal(isLightConcern('오늘 너무 우울해'), true);
  assert.equal(isLightConcern('요즘 너무 지쳐서 몸이 안 좋아'), false);
  assert.equal(isLightConcern('이직을 해야 할까 지금 회사에 남아야 할까'), false);

  assert.deepEqual(resolveLucyToolBudget({ question: '안녕' }), { tier: 'light', ...LUCY_TOOL_BUDGETS.light });
  assert.deepEqual(resolveLucyToolBudget({ question: '그 사람 마음이 궁금해' }), { tier: 'standard', ...LUCY_TOOL_BUDGETS.standard });
  assert.deepEqual(resolveLucyToolBudget({ question: '그 사람 마음이 궁금해', deepRequested: true }), { tier: 'deep', ...LUCY_TOOL_BUDGETS.deep });

  for (const budget of Object.values(LUCY_TOOL_BUDGETS)) {
    assert.ok(budget.maxBasic <= 3, `basic cap ${budget.maxBasic}`);
    assert.ok(budget.maxDeep <= 3, `deep cap ${budget.maxDeep}`);
  }
});

test('divination mode never dumps the whole catalog: basic tools <= 3 and perspectives <= 2 per question', () => {
  const questions = [
    '안녕',
    '그 사람이 나를 어떻게 생각할까',
    '이직을 해야 할까 지금 회사에 남아야 할까',
    '요즘 너무 지쳐서 몸이 안 좋아',
    '돈이 자꾸 새는데 어떻게 해야 할까',
    '창작 작업이 막혔어',
    '올해 내 운세 알려줘',
  ];
  for (const question of questions) {
    const routed = routeAndExecute({ text: question, profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });
    const basic = routed.routePlan.targetTools;
    const deep = routed.routePlan.deepEngineKeys ?? [];
    assert.equal(routed.routePlan.isMasterMobilization, false, question);
    assert.ok(basic.length >= 1 && basic.length <= 3, `${question}: basic ${basic.join(',')}`);
    assert.equal(basic[0], 'saju', question);
    assert.ok(deep.length >= 1 && deep.length <= 2, `${question}: deep ${deep.join(',')}`);
    assert.ok(LUCY_PRO_TOOLS.filter(id => basic.includes(id)).length <= 2, question);
  }
});

test('a "go deeper" request widens perspectives but stays inside the cap', () => {
  const light = routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });
  const deep = routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju', deep: true } });
  assert.deepEqual(deep.routePlan.targetTools, light.routePlan.targetTools);
  assert.ok((deep.routePlan.deepEngineKeys ?? []).length >= (light.routePlan.deepEngineKeys ?? []).length);
  assert.ok((deep.routePlan.deepEngineKeys ?? []).length <= 3);
});

test('different worries pick different tools and perspectives for the same person', () => {
  const love = routeAndExecute({ text: '그 사람이 나를 어떻게 생각할까', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });
  const career = routeAndExecute({ text: '이직을 해야 할까 지금 회사에 남아야 할까', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });
  const money = routeAndExecute({ text: '돈이 자꾸 새는데 어떻게 해야 할까', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju' } });

  assert.notDeepEqual(love.routePlan.targetTools, career.routePlan.targetTools);
  assert.notDeepEqual(career.routePlan.targetTools, money.routePlan.targetTools);
  assert.notDeepEqual(love.routePlan.deepEngineKeys, career.routePlan.deepEngineKeys);
  assert.notDeepEqual(career.routePlan.deepEngineKeys, money.routePlan.deepEngineKeys);
  assert.ok(love.routePlan.targetTools.includes('sukuyo'));
  assert.ok(career.routePlan.targetTools.includes('qimen'));
  assert.ok(money.routePlan.targetTools.includes('kyusei'));
});

/* ───────────────── 두 모드의 분기: 일반 채팅 vs 점술모드 ───────────────── */

test('general Lucy chat uses deep perspectives only and never the 15 foundational tools', () => {
  const chat = selectOptimalDivinationTools('이직을 해야 할까 회사에서 계속 버텨야 할까', [], profile, false, { allowMaster: false, deepOnly: true });
  assert.equal(chat.isCasualMessage, false);
  assert.deepEqual(chat.selectedTools, [], '기초 도구 15종은 일반 채팅에서 쓰지 않는다');
  assert.deepEqual(chat.calculationAudit, []);
  assert.ok((chat.deepPerspectiveKeys ?? []).length >= 1);
  assert.ok((chat.deepPerspectiveKeys ?? []).length <= 2);
  assert.match(chat.promptInjection, /이번 이야기에 고른 심층 관점/);
  assert.doesNotMatch(chat.promptInjection, /\[계산 상태 및 데이터 JSON\]/);
  assert.ok((chat.firedEngineBadges ?? []).every(badge => badge.startsWith('상징 참고 · ')));

  const hello = selectOptimalDivinationTools('안녕', [], profile, false, { allowMaster: false, deepOnly: true });
  assert.ok((hello.deepPerspectiveKeys ?? []).length <= 1);
  assert.equal(hello.promptInjection, '');
});

test('divination mode draws on the 15 foundational tools plus deep perspectives, still within the caps', () => {
  const pro = proSelection('이직을 해야 할까 지금 회사에 남아야 할까');
  const basicIds = (pro.calculationAudit ?? []).filter(item => item.status !== 'symbolic').map(item => item.toolId);
  assert.ok(basicIds.length >= 1 && basicIds.length <= 3, basicIds.join(','));
  assert.ok(basicIds.includes('saju'), '사주는 기초 도구로 늘 포함된다');
  assert.ok((pro.deepPerspectiveKeys ?? []).length <= 2);
  for (const key of pro.deepPerspectiveKeys ?? []) {
    const item = pro.calculationAudit?.find(entry => entry.toolId === key);
    if (item) assert.equal(item.status, 'symbolic', key);
  }

  const withCards = selectOptimalDivinationTools('이 카드들로 봐줘', [], profile, false, {
    allowMaster: false, requireBasicAndDeep: true, divinationMode: { base: 'tarot_saju' },
  });
  assert.ok((withCards.calculationAudit ?? []).some(item => item.toolId === 'tarot'), '뽑은 카드는 함께 본다');
});

/* ───────────────── 도구함: 점술 15탭(활성/잠금) + 일반 채팅 엔진함 ───────────────── */

test('the divination tray shows 15 tool tabs and no engine box / recommended / parchment tabs', () => {
  assert.equal(DIVINATION_TOOL_TABS.length, 15);
  assert.deepEqual(DIVINATION_TOOL_TABS.slice(0, 2).map(tab => tab.id), ['saju', 'tarot']);
  assert.ok(DIVINATION_TOOL_TABS.every(tab => !['engines', 'recommended', 'scrolls'].includes(tab.id as string)));

  const html = renderToStaticMarkup(<DivinationTableBody table={emptyTable()} />);
  assert.match(html, /data-tool-sheet-variant="divination"/);
  for (const tab of DIVINATION_TOOL_TABS) assert.match(html, new RegExp(`data-table-face="${tab.id}"`), tab.id);
  assert.doesNotMatch(html, /data-table-face="engines"/);
  assert.doesNotMatch(html, /data-table-face="recommended"/);
  assert.doesNotMatch(html, /data-table-face="scrolls"/);
  assert.doesNotMatch(html, /엔진함/);
  assert.doesNotMatch(html, /추천 도구/);
  assert.doesNotMatch(html, /양피지/);
});

test('only the tools Lucy used this turn stay open; the rest are locked tabs', () => {
  const table: LucyTableState = {
    ...emptyTable(),
    concern: '이직을 해야 할까',
    tools: audit([
      { toolId: 'saju' },
      { toolId: 'ziwei' },
      { toolId: 'qimen' },
      { toolId: 'tarot', status: 'skipped', sentToModel: false },
    ]),
    activeEngines: buildActiveEngineTray({
      audit: audit([{ toolId: 'saju' }, { toolId: 'ziwei' }, { toolId: 'qimen' }]),
      insightKeys: ['italianMachiavelliVirtuFortuna'],
      concern: '이직을 해야 할까',
    }),
  };
  const views = resolveToolTabViews(table);
  const active = views.filter(view => view.active).map(view => view.id);
  const locked = views.filter(view => view.locked).map(view => view.id);
  assert.deepEqual(active, ['saju', 'ziwei', 'qimen'], '이번 질문에 쓴 도구만 활성');
  assert.equal(locked.length, 12);
  assert.ok(locked.includes('tarot') && locked.includes('sukuyo') && locked.includes('astrology'));
  // 활성 도구가 탭 앞쪽에 모인다.
  assert.deepEqual(views.slice(0, 3).map(view => view.id), ['saju', 'ziwei', 'qimen']);

  const html = renderToStaticMarkup(<DivinationToolTabBar table={table} activeTab="saju" onSelect={() => {}} />);
  assert.match(html, /data-table-face="ziwei" data-tool-tab-active="true" data-locked="false"/);
  assert.match(html, /aria-disabled="true" disabled=""[^>]*data-table-face="sukuyo" data-tool-tab-active="false" data-locked="true"/);
  assert.match(html, /이번 질문에서는 활용되지 않아 잠겨 있어요/);
});

test('before any question the basic table is open and the other tools wait locked', () => {
  const views = resolveToolTabViews(emptyTable());
  assert.deepEqual(views.filter(view => !view.locked).map(view => view.id).sort(), ['saju', 'tarot']);
  assert.equal(views.filter(view => view.locked).length, 13);
});

test('Cosmic Pro opens all 13 additional tools without changing their calculation state', () => {
  const table = emptyTable();
  const views = resolveToolTabViews(table, true);
  assert.equal(views.length, 15);
  assert.equal(views.filter(view => view.locked).length, 0);
  assert.deepEqual(views.map(view => view.id).sort(), [
    'astrology', 'iching', 'kabbalah', 'kyusei', 'liuren', 'mahabote', 'qimen',
    'saju', 'sukuyo', 'taiyi', 'tarot', 'thai_astrology', 'tojeong', 'vedic', 'ziwei',
  ]);
  assert.equal(views.find(view => view.id === 'ziwei')?.state, 'unused');
  assert.equal(views.find(view => view.id === 'ziwei')?.active, false);
});

test('a tool tab shows the tool’s own explanation and never invents a result', () => {
  const table: LucyTableState = {
    ...emptyTable(),
    activeEngines: buildActiveEngineTray({ audit: audit([{ toolId: 'saju' }, { toolId: 'sukuyo' }]), concern: '그 사람 마음' }),
    tools: audit([{ toolId: 'saju' }, { toolId: 'sukuyo' }]),
  };
  const suk = renderToStaticMarkup(<MasterToolTabPanel toolId="sukuyo" table={table} />);
  assert.match(suk, /data-tool-tab-panel="sukuyo"/);
  assert.match(suk, /data-tool-tab-state="calculated"/);
  assert.match(suk, /숙요점성술/);
  assert.match(suk, /잘 보는 것 · /);
  assert.match(suk, /data-tool-tab-badge/);

  const unused = renderToStaticMarkup(<MasterToolTabPanel toolId="kabbalah" table={table} />);
  assert.match(unused, /data-tool-tab-state="unused"/);
  assert.match(unused, /이번 질문엔 쓰지 않았어요/);
  assert.doesNotMatch(unused, /data-tool-tab-detail="true"/, '계산하지 않은 결과를 그리지 않는다');
});

test('the general chat tool sheet opens the engine box only', () => {
  const html = renderToStaticMarkup(<MasterTableSheetBody table={emptyTable()} variant="chat" />);
  assert.match(html, /data-tool-sheet-variant="chat"/);
  assert.match(html, /data-lucy-engine-panel-deep-only="true"/);
  assert.match(html, /data-lucy-engine-panel/);
  assert.doesNotMatch(html, /data-tool-tab-bar/, '일반 채팅 도구함에는 도구 탭이 없다');
  assert.doesNotMatch(html, /사주 원국/);
  assert.doesNotMatch(html, /타로/);
});

test('the header pencil button is rendered in both modes', () => {
  const page = readFileSync(new URL('../src/pages/LucyStandalonePage.tsx', import.meta.url), 'utf8');
  assert.match(page, /<MasterTableSheetButton tone=\{isLight \? 'light' : 'dark'\} isMasterMode=\{isMasterMode\} \/>/);
  assert.doesNotMatch(page, /\{isMasterMode && <MasterTableSheetButton/, '점술모드에만 있던 예전 조건이 남아 있으면 안 된다');
  const sheet = readFileSync(new URL('../src/components/duo/MasterTableSheet.tsx', import.meta.url), 'utf8');
  assert.match(sheet, /aria-label=\{isMasterMode \? '점술 도구 보기' : '엔진함 보기'\}/);
});

/* ───────────────── 도구함 상태·13대 도구 판 ───────────────── */

test('the engine tray keeps only what was actually used and hides inactive tools', () => {
  const tray = buildActiveEngineTray({
    audit: audit([
      { toolId: 'saju' },
      { toolId: 'ziwei' },
      { toolId: 'tarot', status: 'skipped', sentToModel: false },
      { toolId: 'iching', status: 'error', sentToModel: false },
      { toolId: 'astrology', status: 'calculated', sentToModel: false },
      { toolId: 'contextualSynastry', status: 'symbolic' },
    ]),
    insightKeys: ['contextualSynastry', 'koreanChusaKimJeonghuiSehando', 'notARealKey'],
    concern: '그 사람이 나를 어떻게 생각할까',
  });

  assert.deepEqual(tray.foundational.map(item => item.key), ['ziwei', 'saju']);
  assert.deepEqual(tray.deep.map(item => item.key), ['contextualSynastry', 'koreanChusaKimJeonghuiSehando']);
  assert.equal(tray.total, 4);
  const keys = [...tray.foundational, ...tray.deep].map(item => item.key);
  for (const inactive of ['tarot', 'iching', 'astrology', 'notARealKey']) {
    assert.ok(!keys.includes(inactive), `${inactive} must stay hidden`);
  }
  assert.equal(tray.deep.find(item => item.key === 'koreanChusaKimJeonghuiSehando')!.status, 'symbolic');
  assert.ok(tray.foundational.every(item => item.meaning.length > 0));
});

test('an empty selection yields an empty tray and the guidance wording stays', () => {
  const tray = buildActiveEngineTray({ audit: [] });
  assert.equal(activeEngineTrayIsEmpty(tray), true);
  assert.equal(tray.total, 0);
  assert.match(EMPTY_ACTIVE_ENGINE_TRAY_GUIDE, /질문을 보내면 루시가 이 고민에 맞춰 고른 도구와 관점/);
  assert.match(LOCKED_TOOL_TAB_NOTE, /잠겨 있어요/);
});

test('the 13-tool board marks tools Lucy did not use this turn instead of inventing results', () => {
  const selection = proSelection('이직을 해야 할까 지금 회사에 남아야 할까');
  const board = buildToolBoard({ audit: selection.calculationAudit ?? [], concern: '이직을 해야 할까', answer: '' });
  assert.equal(board.hasResults, true);
  const unused = ['sukuyo', 'vedic', 'mahabote'].filter(id => !selection.calculationAudit?.some(a => a.toolId === id));
  for (const id of unused) {
    const item = board.others.find(entry => entry.id === id) ?? (board.recommended.id === id ? board.recommended : undefined);
    assert.ok(item, `${id} still listed as parchment`);
    assert.equal(item!.status, 'unused', id);
    assert.equal(item!.facts.length, 0, id);
  }
  assert.notEqual(board.recommended.status, 'unused');
});
