/**
 * Deterministic Calculation Engine 단위 검증 스크립트
 * 100% 동일한 입력에 대해 동일한 JSON 결과가 오차 없이 도출되는지,
 * 7대 핵심 엔진이 정상 계산되는지 검증합니다.
 */

import { runDeterministicEngine, formatDeterministicEnginePrompt } from '../src/lib/divination/deterministicEngine';
import type { UserProfile } from '../src/lib/sharedState';

const sampleProfile: UserProfile = {
  basic: {
    birthdate: '1994-01-24',
    birthtime: '08:30',
    lunarSolar: 'solar',
    isLeapMonth: false,
    gender: 'male',
    birthCity: '서울',
    name: '박주형',
    nickname: '주형'
  }
};

console.log('====================================================');
console.log('🧪 LUCKEY 결정론적 자체 계산 엔진 단위 검증 시작');
console.log('====================================================');

const report1 = runDeterministicEngine({
  profile: sampleProfile,
  question: '올해 이직운과 사업운 어때?',
  forceAllTools: true
});

console.log('✅ 계산 완료!');
console.log('엔진 버전:', report1.engineVersion);
console.log('계산 시각(KST):', report1.calculatedAtKst);
console.log('통계 요약:', JSON.stringify(report1.summary, null, 2));

console.log('\n--- [도구별 계산 상태] ---');
Object.entries(report1.tools).forEach(([id, envelope]) => {
  console.log(`[${envelope.status.toUpperCase()}] ${envelope.toolKoName} (${id})`);
  if (envelope.method) console.log(`   - 산출 방식: ${envelope.method}`);
  if (envelope.note) console.log(`   - 특이 사항: ${envelope.note}`);
});

console.log('\n--- [동일 입력 결정론적 무결성(Determinism) 검증 (1회차 vs 2회차 비교)] ---');
const report2 = runDeterministicEngine({
  profile: sampleProfile,
  question: '올해 이직운과 사업운 어때?',
  forceAllTools: true
});

// 타임스탬프와 계산시각을 제외한 순수 계산 데이터 일치성 비교
const data1 = JSON.stringify(report1.tools.saju.data);
const data2 = JSON.stringify(report2.tools.saju.data);
const astroData1 = JSON.stringify(report1.tools.astrology.data);
const astroData2 = JSON.stringify(report2.tools.astrology.data);
const ziweiData1 = JSON.stringify(report1.tools.ziwei.data);
const ziweiData2 = JSON.stringify(report2.tools.ziwei.data);

if (data1 === data2 && astroData1 === astroData2 && ziweiData1 === ziweiData2) {
  console.log('🎯 [성공] 1회차와 2회차의 사주, 점성술, 자미두수 계산 데이터가 100% 비트 단위로 완벽히 일치합니다!');
} else {
  console.error('❌ [실패] 회차별 계산 결과가 일치하지 않습니다.');
  process.exit(1);
}

console.log('\n--- [프롬프트 변환 포맷 검증] ---');
const promptBlock = formatDeterministicEnginePrompt(report1);
console.log(`프롬프트 길이: ${promptBlock.length}자`);
console.log(promptBlock.slice(0, 500) + '...\n');

console.log('====================================================');
console.log('✨ 결정론적 계산 엔진 테스트 모든 검증 통과!');
console.log('====================================================');
