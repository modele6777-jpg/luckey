import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ALL_DCE_ENGINES,
  DCE_MASTER_CATALOG,
  runDeterministicEngine,
  formatDeterministicEnginePrompt,
  getFiredEngineBadges,
  isEngineDelivered,
  type DeterministicEngineReport,
  type DceEngineMeta,
} from '../src/lib/divination/deterministicEngine';
import type { UserProfile } from '../src/lib/sharedState';

const SAMPLE_PROFILE: UserProfile = {
  basic: {
    birthdate: '1990-05-15',
    birthtime: '14:30',
    gender: 'female',
    name: '지혜로운탐구자',
    birthCity: 'Seoul',
    isLunar: false,
  },
};

test('DCE Master Registry: catalog completeness and integrity', () => {
  assert.equal(ALL_DCE_ENGINES, DCE_MASTER_CATALOG);
  assert(ALL_DCE_ENGINES.length >= 189, `Expected at least 189 engines, got ${ALL_DCE_ENGINES.length}`);

  const keys = new Set<string>();
  const names = new Set<string>();

  for (const engine of ALL_DCE_ENGINES) {
    // 1. 필수 속성 존재성 검증
    assert(engine.key && engine.key.length > 0, `Engine missing key: ${JSON.stringify(engine)}`);
    assert(engine.nameKo && engine.nameKo.length > 0, `Engine missing nameKo: ${engine.key}`);
    assert(engine.icon && engine.icon.length > 0, `Engine missing icon: ${engine.key}`);
    assert(engine.category === 'foundational' || engine.category === 'deep_master', `Invalid category for ${engine.key}`);
    assert(
      engine.kind === 'calculation' || engine.kind === 'symbolic',
      `Engine ${engine.key} must be classified as 'calculation' or 'symbolic'`
    );

    // 2. 키 및 이름 중복 방지 검증
    assert(!keys.has(engine.key), `Duplicate engine key detected: ${engine.key}`);
    assert(!names.has(engine.nameKo), `Duplicate engine nameKo detected: ${engine.nameKo}`);
    keys.add(engine.key);
    names.add(engine.nameKo);

    // 3. 심층 마스터 도구의 리포트 프로퍼티 지정 검증
    if (engine.category === 'deep_master') {
      assert(engine.reportProperty && engine.reportProperty.length > 0, `Deep master engine missing reportProperty: ${engine.key}`);
    }
  }
});

test('DCE Master Registry: all divination engine files are connected in registry', () => {
  const dir = path.resolve(process.cwd(), 'src/lib/divination');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('Engine.ts') && f !== 'deterministicEngine.ts');

  // 제외 대상 (순수 수학 헬퍼 또는 기반 라이브러리)
  const allowedNonEngines = new Set<string>([]);

  const registeredKeys = new Set(ALL_DCE_ENGINES.map((e) => e.key.toLowerCase()));

  for (const file of files) {
    if (allowedNonEngines.has(file)) continue;
    const baseName = file.replace(/Engine\.ts$/, '').toLowerCase();
    
    // 파일명 접두/접미가 등록된 엔진 키 중 최소 하나와 매핑되는지 확인
    const hasMatch = Array.from(registeredKeys).some(
      (k) => baseName.includes(k) || k.includes(baseName) || file.toLowerCase().includes(k)
    );
    assert(
      hasMatch,
      `Divination file ${file} appears to be omitted from ALL_DCE_ENGINES registry!`
    );
  }
});

test('DCE Master Registry: accurate calculation vs symbolic classification & delivered tool counting', () => {
  const report = runDeterministicEngine({
    profile: SAMPLE_PROFILE,
    question: '제 직업적 미래와 인생의 방향을 알려주세요',
    forceAllTools: true,
  });

  const calcs = ALL_DCE_ENGINES.filter((e) => e.kind === 'calculation');
  const symbolics = ALL_DCE_ENGINES.filter((e) => e.kind === 'symbolic');

  assert.equal(report.summary.totalToolsSupported, ALL_DCE_ENGINES.length);
  assert.equal(report.summary.totalCalculationEngines, calcs.length);
  assert.equal(report.summary.totalSymbolicEngines, symbolics.length);
  assert.equal(
    report.summary.deliveredTotalCount,
    report.summary.deliveredCalculationCount + report.summary.deliveredSymbolicCount
  );

  const firedBadges = getFiredEngineBadges(report, { isMasterMobilization: true });
  assert.equal(firedBadges.length, report.summary.deliveredTotalCount);

  // 배지 목록에 누락된 엔진이 없는지 전수 검증
  for (const badge of firedBadges) {
    assert(ALL_DCE_ENGINES.some((e) => e.nameKo === badge), `Unknown badge in fired badges: ${badge}`);
  }

  // 프롬프트 포매터에 실측 전달 도구 요약이 정직하게 표기되는지 검증
  const prompt = formatDeterministicEnginePrompt(report, { isMasterMobilization: true });
  assert(prompt.includes(`실측 전달 도구: 총 ${report.summary.deliveredTotalCount}개`));
  assert(prompt.includes(`수리/천문 계산: ${report.summary.deliveredCalculationCount}개`));
  assert(prompt.includes(`상징/원형 가이드: ${report.summary.deliveredSymbolicCount}개`));
});

test('DCE Master Registry: safe failure handling & empty profile input resilience', () => {
  // 생년월일이 누락된 빈 프로필로 실행해도 전체 파이프라인이 크래시 없이 안전하게 실행되어야 함
  const emptyReport = runDeterministicEngine({
    profile: {} as unknown as UserProfile,
    question: '',
  });

  assert(emptyReport);
  assert.equal(emptyReport.engineVersion, 'LUCKEY-DCE-v1.1.0');
  assert(emptyReport.summary.deliveredTotalCount >= 0);

  // 빈 프로필 상태에서도 프롬프트 포매터가 예외 없이 텍스트를 생성해야 함
  const formattedEmptyPrompt = formatDeterministicEnginePrompt(emptyReport);
  assert(formattedEmptyPrompt.includes('결정론적 자체 계산 엔진'));
});

test('DCE Master Registry: selective intent mode only delivers matched & calculated engines', () => {
  const report = runDeterministicEngine({
    profile: SAMPLE_PROFILE,
    question: '취업 이직 전략 상담',
    forceAllTools: false,
  });

  const selectiveBadges = getFiredEngineBadges(report, {
    isMasterMobilization: false,
    intent: 'career_strategy',
  });

  // 선별 모드에서는 전체 엔진 수가 아니라 특화된 도구만 선별되어 전달되어야 함
  assert(selectiveBadges.length > 0 && selectiveBadges.length < ALL_DCE_ENGINES.length);
  assert(selectiveBadges.includes('사주명리'));
});
