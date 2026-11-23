import test from 'node:test';
import assert from 'node:assert/strict';
import { selectOptimalDivinationTools } from '../src/lib/fifteenDivinationTools';
import {
  formatDeterministicEnginePrompt,
  type DeterministicEngineReport,
  type ToolCalculationEnvelope,
} from '../src/lib/divination/deterministicEngine';
import type { TarotMasterResult } from '../src/lib/divination/tarotMasterEngine';

const profile = {
  basic: {
    name: '검사용',
    birthdate: '1990-05-17',
    birthtime: '14:30',
    gender: 'female' as const,
    birthCity: '서울',
    lunarSolar: 'solar' as const,
  },
};

const coreQueries = [
  ['saju', '사주로 이직운 봐줘'],
  ['astrology', '서양 점성술 출생 차트 풀이해줘'],
  ['ziwei', '자미두수 명반으로 직업운 봐줘'],
  ['tarot', '타로 생일카드로 내 성향을 봐줘'],
  ['sukuyo', '숙요경 27숙으로 내 본명숙 봐줘'],
  ['mahabote', '마하보테로 본명궁을 봐줘'],
  ['vedic', '베딕 점성술 나크샤트라와 다샤 봐줘'],
  ['liuren', '육임으로 이 질문의 흐름 봐줘'],
  ['qimen', '기문둔갑으로 지금 결정을 봐줘'],
  ['kabbalah', '카발라 생명나무로 내 생일 수리를 봐줘'],
  ['iching', '주역으로 이직운 봐줘'],
  ['thai_astrology', '태국 호라삿으로 8요일 대운을 봐줘'],
  ['tojeong', '토정비결로 올해 운세를 봐줘'],
  ['kyusei', '구성학으로 오늘 길한 방향을 봐줘'],
  ['taiyi', '태을신수로 올해 대세 흐름을 봐줘'],
] as const;

test('all 15 engines are selectable and calculated from Lucy, Lucy Plus, and Lucy Pro chats', () => {
  // Lucy and Lucy Plus share the same core chat route; Pro enables the richer route.
  const modes = [
    { name: 'Lucy', allowMaster: false },
    { name: 'Lucy Plus', allowMaster: false },
    { name: 'Lucy Pro', allowMaster: true },
  ];

  for (const mode of modes) {
    for (const [toolId, text] of coreQueries) {
      const routed = selectOptimalDivinationTools(text, [], profile, false, {
        requireBasicAndDeep: true,
        allowMaster: mode.allowMaster,
      });
      assert.ok(routed.selectedTools.some(tool => tool.id === toolId), `${mode.name} did not select ${toolId}`);
      assert.equal(
        routed.engineTools?.[toolId]?.status,
        'calculated',
        `${mode.name} did not calculate ${toolId} for a complete profile`,
      );
    }
  }
});

function makeReport(tool: ToolCalculationEnvelope): DeterministicEngineReport {
  return {
    engineVersion: 'test',
    timestamp: 0,
    calculatedAtUtc: '2026-01-01T00:00:00.000Z',
    calculatedAtKst: '2026-01-01 09:00 KST',
    inputProfile: { isLunar: false, timeKnown: true, locationKnown: true },
    summary: {
      totalToolsSupported: 1,
      toolsExecuted: 1,
      toolsCalculated: tool.status === 'calculated' ? 1 : 0,
      toolsPartialOrSymbolic: 0,
      toolsNotImplemented: 0,
    },
    tools: { [tool.toolId]: tool },
  } as unknown as DeterministicEngineReport;
}

test('engine interpretation references require calculated status and actual data', () => {
  for (const status of ['partial', 'symbolic', 'not_implemented', 'skipped', 'error'] as const) {
    const prompt = formatDeterministicEnginePrompt(makeReport({
      toolId: 'tarot',
      toolKoName: '타로',
      status,
      data: { privateMarker: 'UNAVAILABLE_PERSONAL_CARD_RESULT' },
    }), { focusTools: ['tarot'], isMasterMobilization: false });
    assert.doesNotMatch(prompt, /UNAVAILABLE_PERSONAL_CARD_RESULT/);
    assert.doesNotMatch(prompt, /\[엔진별 계산 결과 해석자료/);
  }

  const missingData = formatDeterministicEnginePrompt(makeReport({
    toolId: 'tarot',
    toolKoName: '타로',
    status: 'calculated',
  }), { focusTools: ['tarot'], isMasterMobilization: false });
  assert.doesNotMatch(missingData, /\[엔진별 계산 결과 해석자료/);
});

test('tarot prompt uses only calculated birth-card symbols, never a fabricated draw or timeline spread', () => {
  const tarot = {
    soulCard: { name: 'The Star', element: 'Air', keywords: ['hope', 'renewal'] },
    personalityCard: { name: 'The Hermit', element: 'Earth', coreMessage: 'reflection' },
    yearCard: { name: 'The Sun' },
    currentYear: 2026,
    interpretiveBoundary: '생일 수비학의 상징 참고이며 미래 예측이 아님',
  } as unknown as TarotMasterResult;
  const prompt = formatDeterministicEnginePrompt(makeReport({
    toolId: 'tarot',
    toolKoName: '타로',
    status: 'calculated',
    data: tarot,
  }), { focusTools: ['tarot'], isMasterMobilization: false });
  const section = prompt.slice(prompt.indexOf('[엔진별 계산 결과 해석자료'));
  assert.match(section, /생년월일 계산 소울 카드: The Star/);
  assert.match(section, /무작위 추첨 아님/);
  assert.match(section, /실제 무작위 카드 추첨이나 과거·현재·미래 스프레드가 아니다/);
  assert.doesNotMatch(section, /과거:|현재:|미래:/);
});
