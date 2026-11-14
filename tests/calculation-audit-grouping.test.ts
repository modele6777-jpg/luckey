import assert from 'node:assert/strict';
import test from 'node:test';
import { groupActuallyUsedCalculationAudit } from '../src/lib/divination/calculationAudit';

test('per-answer actual engine evidence is grouped by recorded result category only', () => {
  const groups = groupActuallyUsedCalculationAudit([
    { toolId: 'saju', name: '사주명리', status: 'calculated', sentToModel: true },
    { toolId: 'astrology', name: '서양 점성술', status: 'calculated', sentToModel: true },
    { toolId: 'ikigai', name: '이키가이 나침반', status: 'partial', sentToModel: true },
    { toolId: 'myth', name: '신화', status: 'symbolic', sentToModel: true },
    { toolId: 'selected', name: '선택만 된 엔진', status: 'calculated', sentToModel: false },
    { toolId: 'skipped', name: '건너뛴 엔진', status: 'skipped', sentToModel: true },
    { toolId: 'failed', name: '실패한 엔진', status: 'error', sentToModel: true },
  ]);

  assert.deepEqual(groups.map(group => ({
    label: group.label,
    engines: group.engines.map(engine => engine.name),
  })), [
    { label: '계산 결과', engines: ['사주명리', '서양 점성술'] },
    { label: '부분 계산', engines: ['이키가이 나침반'] },
    { label: '상징 참고', engines: ['신화'] },
  ]);
});
