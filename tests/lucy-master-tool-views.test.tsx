import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { routeAndExecute, LUCY_PRO_TOOLS } from '../src/lib/divination/smartAgentRouter';
import { ToolDetailView } from '../src/components/duo/MasterToolViews';

const profile = { basic: { name: '검사', birthdate: '1990-05-17', birthtime: '14:30', gender: 'female', birthCity: '서울', lunarSolar: 'solar' } } as any;

test('every one of the 13 tools has a dedicated view drawn from computed data', () => {
  // 13대 도구가 한 번에 계산되는 것은 올인원(전수 비교를 명시한) 요청뿐이다.
  const r: any = routeAndExecute({ text: '올인원 종합 인생 분석', profile, isMasterRequested: true });
  for (const id of LUCY_PRO_TOOLS) {
    const html = renderToStaticMarkup(<ToolDetailView id={id} data={r.engineReport.tools[id]?.data} />);
    assert.ok(html.length > 200, `${id} view rendered`);
  }
});

test('views draw nothing when there is no computed data (no invented values)', () => {
  for (const id of ['qimen', 'ziwei', 'vedic', 'iching', 'liuren', 'taiyi', 'tojeong', 'kyusei', 'thai_astrology', 'astrology'] as const) {
    assert.equal(renderToStaticMarkup(<ToolDetailView id={id} data={null} />), '', id);
    assert.equal(renderToStaticMarkup(<ToolDetailView id={id} data={{}} />), '', `${id} empty object`);
  }
  // 숙요·마하보테·카발라는 값이 없으면 구조만 (개인 값 없이)
  for (const id of ['sukuyo', 'mahabote', 'kabbalah'] as const) {
    const html = renderToStaticMarkup(<ToolDetailView id={id} data={null} />);
    assert.ok(html.length > 100 && !/본명궁|라이프 패스 /.test(html), id);
  }
});
