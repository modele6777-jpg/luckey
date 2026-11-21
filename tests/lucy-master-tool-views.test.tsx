import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { routeAndExecute, LUCY_MASTER_DEPTH3_TOOLS } from '../src/lib/divination/smartAgentRouter';
import { ToolDetailView } from '../src/components/duo/MasterToolViews';

const profile = { basic: { name: '검사', birthdate: '1990-05-17', birthtime: '14:30', gender: 'female', birthCity: '서울', lunarSolar: 'solar' } } as any;

test('every one of the 13 tools has a dedicated view drawn from computed data', () => {
  const r: any = routeAndExecute({ text: '이직 고민', profile, requireBasicAndDeep: true, divinationMode: { base: 'saju', depth: 3 } });
  for (const id of LUCY_MASTER_DEPTH3_TOOLS) {
    const html = renderToStaticMarkup(<ToolDetailView id={id} data={r.engineReport.tools[id]?.data} />);
    assert.ok(html.length > 200, `${id} view rendered`);
  }
});

test('views draw nothing when there is no computed data (no invented values)', () => {
  for (const id of ['qimen', 'ziwei', 'vedic', 'iching', 'liuren', 'taiyi', 'tojeong', 'kyusei', 'thai_astrology', 'astrology'] as const) {
    assert.equal(renderToStaticMarkup(<ToolDetailView id={id} data={null} />), '', id);
    assert.equal(renderToStaticMarkup(<ToolDetailView id={id} data={{}} />), '', `${id} empty object`);
  }
  // 재검토 중인 도구는 개인 값 없이 구조만
  assert.match(renderToStaticMarkup(<ToolDetailView id="kabbalah" data={null} />), /구조와 의미만/);
});
