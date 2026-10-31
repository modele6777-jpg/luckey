/**
 * 스마트 에이전트 라우터(Smart Agent Router) 단위 테스트
 */

import { analyzeQuestionIntent, routeAndExecute } from '../src/lib/divination/smartAgentRouter';
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

const testQueries = [
  { q: '안녕 루시야!', expectedIntent: 'casual_greeting' },
  { q: '이번에 새로운 회사로 이직하고 싶은데 타이밍이 언제가 좋을까?', expectedIntent: 'career_strategy' },
  { q: '남자친구랑 요즘 자주 싸우는데 우리 궁합 어때?', expectedIntent: 'relationship_love' },
  { q: '지금 주식 투자랑 부동산 중에 어디에 돈을 묶는 게 유리해?', expectedIntent: 'business_money' },
  { q: '오늘 거래처 제안을 수락할까 말까? 지금 결정해야 돼', expectedIntent: 'immediate_decision' },
  { q: '요즘 몸이 너무 찌뿌둥하고 잠도 깊이 못 자', expectedIntent: 'vitality_wellness' },
  { q: '새로 론칭할 브랜드 이름이랑 슬로건 아이디어 좀 줘', expectedIntent: 'creative_mind' },
  { q: '마스터 모드로 15대 도구 전부 비교해서 내 올해 종합 운명 알려줘', expectedIntent: 'master_blueprint' },
];

console.log('====================================================');
console.log('🧭 스마트 에이전트 라우터 의도 분석 및 도구 배정 테스트');
console.log('====================================================');

let allPassed = true;
for (const item of testQueries) {
  const plan = analyzeQuestionIntent(item.q);
  const pass = plan.intent === item.expectedIntent;
  console.log(`[${pass ? 'PASS ✅' : 'FAIL ❌'}] 질문: "${item.q}"`);
  console.log(`   - 감지 의도: ${plan.intentKoName} (${plan.intent})`);
  console.log(`   - 배정 도구: ${plan.targetTools.join(', ') || '없음(수다)'}`);
  console.log(`   - 사유: ${plan.routingReason}\n`);
  if (!pass) allPassed = false;
}

console.log('--- [실제 라우팅 및 결정론적 계산 연동 테스트] ---');
const execResult = routeAndExecute({
  text: '이번에 새로운 회사로 이직하고 싶은데 타이밍이 언제가 좋을까?',
  profile: sampleProfile,
});

console.log('의도:', execResult.routePlan.intentKoName);
console.log('배지 표시 도구:', execResult.toolsForBadge.join(' + '));
console.log('프롬프트 주입 길이:', execResult.promptInjection.length);
console.log('계산 엔진 성공 도구 수:', execResult.engineReport?.summary.toolsCalculated);

console.log('\n====================================================');
console.log(allPassed ? '✨ 스마트 에이전트 라우터 모든 테스트 통과!' : '❌ 일부 테스트 실패');
console.log('====================================================');
