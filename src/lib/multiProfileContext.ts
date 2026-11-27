import type { ChatTargetProfile } from '../types/chatProfile';
import type { UserProfile } from './sharedState';
import { calculateDetailedSaju } from './sajuAnalysis';
import { buildUserNatalSummary } from './astrologyAnalysis';

/**
 * 개별 프로필의 사주팔자 및 서양 점성술 천문 데이터를 분석하여 텍스트로 요약합니다.
 */
export function formatProfileAnalysisContext(profile: ChatTargetProfile, index: number, userDisplayName?: string): string {
  const displayName = (profile.isMe || profile.relationship === '본인')
    ? (userDisplayName || profile.nickname || profile.name)
    : profile.name;

  const mockUserProfile: UserProfile = {
    basic: {
      name: displayName,
      nickname: displayName,
      birthdate: profile.birthdate,
      birthtime: profile.birthtime,
      gender: profile.gender,
      birthCity: profile.birthCity,
      lunarSolar: profile.lunarSolar || 'solar',
    }
  };

  const saju = calculateDetailedSaju(mockUserProfile);
  const astro = buildUserNatalSummary(mockUserProfile);

  const sajuPillars = saju 
    ? `년주(${saju.pillars.year.full}) 월주(${saju.pillars.month.full}) 일주(${saju.pillars.day.full}) ${saju.pillars.hour ? `시주(${saju.pillars.hour.full})` : '시주(시간미입력)'}`
    : '사주 산출 불가';

  const dayMaster = saju
    ? `${saju.dayMaster.korean} (${saju.dayMaster.element} 일간, ${saju.dayMaster.archetypeTitle})`
    : '일간 정보 없음';

  const elementCounts = saju?.elements?.counts
    ? `목(${saju.elements.counts['목'] || 0}), 화(${saju.elements.counts['화'] || 0}), 토(${saju.elements.counts['토'] || 0}), 금(${saju.elements.counts['금'] || 0}), 수(${saju.elements.counts['수'] || 0})`
    : '오행 데이터 없음';

  const digest = saju?.shortDigest ? ` · ${saju.shortDigest}` : '';

  return `[대상자 ${index + 1}: ${displayName} (${profile.relationship || (profile.isMe ? '본인' : '상담대상')})]
- 기본 정보: ${profile.gender === 'female' ? '여성' : profile.gender === 'male' ? '남성' : '기타'}, ${profile.birthdate} ${profile.birthtime ? profile.birthtime : '시간모름'} (${profile.lunarSolar === 'lunar' ? '음력' : '양력'}), 출생지: ${profile.birthCity || '미지정'}
- 사주 8자: ${sajuPillars}
- 일간(본원): ${dayMaster}${digest}
- 오행 분포: ${elementCounts}
- 서양 점성학: ${astro}`;
}

/**
 * 대화창에 등록된 1인~4인 프로필에 맞추어 루시 AI 시스템 프롬프트(extraSystemContext)를 동적 생성합니다.
 * activeProfileId가 전달되면 해당 인물을 메인 1순위 상담 대상으로 강력하게 지정합니다.
 */
export function buildMultiProfileSystemContext(profiles: ChatTargetProfile[], activeProfileId?: string, userDisplayName?: string): string {
  if (!profiles || profiles.length === 0) return '';

  const primary = activeProfileId 
    ? (profiles.find(p => p.id === activeProfileId) || profiles[0])
    : profiles[0];

  const formattedProfiles = profiles.map((p, idx) => {
    const isTarget = p.id === primary.id;
    const prefix = isTarget ? '★ [현재 메인 상담 분석 대상자]' : `[대상자 ${idx + 1}]`;
    return `${prefix}\n${formatProfileAnalysisContext(p, idx, userDisplayName)}`;
  }).join('\n\n');

  if (profiles.length === 1) {
    const single = profiles[0];
    const targetName = (single.isMe || single.relationship === '본인') ? (userDisplayName || single.name) : single.name;
    return `[대화창 활성 상담 대상자 1인 전용 만세력·사주 데이터]
${formattedProfiles}
- 핵심 지침: 위 대상자 '${targetName}'(${single.relationship || '본인'})님의 만세력(사주 4주 8자)과 점성학적 천문 데이터를 기반으로 질문자의 고민에 맞춘 정밀하고 현실적인 맞춤 점괘와 운명 통찰을 제공하십시오.
- 사용자 호칭 원칙: 사용자를 부를 때는 본명이나 실명을 절대 부르지 말고, 오직 닉네임인 '${targetName}'(으)로만 다정하게 부르십시오.`;
  }

  const names = profiles.map(p => p.name).join(' · ');
  return `[대화창 2인 이상 다자간 궁합/인연/시너지 통합 점괘 데이터 (${profiles.length}명: ${names})]
${formattedProfiles}

[★ 메인 상담 분석 기준 인물 전면 전환 지침]:
- 현재 질문자가 메인 분석 기준으로 지정한 대상자: '${primary.name}' (관계: ${primary.relationship || (primary.isMe ? '본인' : '상담대상')})
- 지침: 기존 사용자 본인 기준이 아니라, 사용자가 명시적으로 선택한 '${primary.name}'님의 사주와 만세력(일간, 오행, 신살, 대운)을 메인 제1 분석 기준으로 전면 전환하여 질문자의 질문을 집중 풀이하십시오.

[★ 다자간 궁합 및 인연 점괘 핵심 가이드]:
1. [상호 오행 및 일간 조화 분석]: 각 대상자의 일간(본원)과 오행(목화토금수) 분포의 상생(相生)·상극(相克)을 비교하여, 서로의 기운이 어떻게 상호 보완되거나 마찰이 일어나는지 명확히 짚어주십시오.
2. [궁합 및 관계 역동성]: 두 사람(혹은 다자간)의 연애/결혼 궁합, 친구 간의 케미, 동업/비즈니스 파트너십 시너지 측면에서 최고의 강점과 시너지 포인트를 통찰하십시오.
3. [갈등 예방 및 소통 처방]: 성향 차이나 사주 충(沖)/원진 등에서 기인할 수 있는 주의점과, 이를 지혜롭게 극복할 수 있는 실천적 배려 팁을 제공하십시오.
4. [정확한 대상자 호칭]: 답변 시 각 대상자의 이름(${names})을 명확히 구분하여 호칭하고, 질문자가 물어본 관계 질문에 즉각적이고 신뢰감 높은 맞춤 해답을 제시하십시오.`;
}

/**
 * 2인 이상 프로필이 활성화되었을 때, 두 사람(다자간)의 이름을 결합한 맞춤형 예시 고민 질문 리스트를 생성합니다.
 */
export function generateMultiProfilePrompts(profiles: ChatTargetProfile[]): string[] {
  if (!profiles || profiles.length < 2) return [];

  const nameA = profiles[0].name;
  const nameB = profiles[1].name;

  if (profiles.length === 2) {
    return [
      `${nameA}님과 ${nameB}님의 사주 궁합과 인연의 깊이는 어떨까요?`,
      `${nameA}님과 ${nameB}님의 연애 성향 차이와 갈등 해결법을 알려줘.`,
      `${nameA}님과 ${nameB}님이 함께 일할 때 비즈니스 시너지가 좋을까요?`,
      `두 사람의 사주 오행(목화토금수) 조화와 서로에게 주는 운의 영향은?`,
      `${nameA}님과 ${nameB}님의 속마음과 관계 발전 최적의 타이밍은?`,
      `두 사람의 결혼운과 장기적인 미래 인연 흐름이 궁금해요.`,
      `${nameA}님과 ${nameB}님의 성격상 부딪히기 쉬운 점과 배려 팁은?`,
      `두 사람의 금전·재물운이 합쳐졌을 때 어떤 시너지가 날까요?`,
      `서로의 인생에서 어떤 소울메이트적 역할을 해줄 수 있을까요?`,
      `두 사람 사이에 오해가 생겼을 때 먼저 손 내밀기 좋은 방법은?`,
      `${nameA}님과 ${nameB}님 사이의 전생 인연과 카르마적 연결고리는?`,
      `두 사람이 여행을 가거나 새로운 도전을 함께하기에 좋은 시기는?`
    ];
  }

  // 3~4인 프로필
  const allNames = profiles.map(p => p.name).join('·');
  return [
    `${allNames} 구성원들의 사주 오행 조화와 팀워크 시너지는 어떨까요?`,
    `우리 ${profiles.length}명의 성향 차이와 조화로운 협력 소통법을 알려줘.`,
    `함께 일하거나 가족으로 지낼 때 기운 흐름과 갈등 완화 처방은?`,
    `${allNames} 함께 모였을 때 가장 폭발적인 시너지가 나는 영역은?`,
    `서로의 부족한 오행 에너지를 채워주는 상생 관계 분석해줘.`,
    `우리 모임의 향후 운세 흐름과 주의해야 할 타이밍은 언제일까요?`
  ];
}
