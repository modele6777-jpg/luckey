import type { UserProfile } from '../sharedState';

export interface SherpaSagarmathaResult {
  engineVersion: string;
  calculatedAtKst: string;
  ridgePrinciple: string;
  sagarmathaInsight: string;
  himalayanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PRINCIPLES = [
  { principle: '비스타레이(Bistari · 천천히, 그러나 멈추지 않고 고도에 적응함)', insight: '고산에서는 속도를 내는 것보다 내 몸과 마음의 호흡에 맞춰 꾸준히 오르는 편이 정상에 닿음', tone: '히말라야 쿰부 계곡의 맑은 새벽 공기와 눈 덮인 사거마타의 황금빛 능선' },
  { principle: '미욤라(Miyomla · 산과 자연의 허락을 구하는 겸손함)', insight: '내 힘만으로 모든 걸 정복하려 들기보다 상황의 기상과 흐름을 존중하며 때를 기다림', tone: '능선 마루의 바람에 펄럭이는 다섯 빛깔 룽다(Lungta) 기도 깃발' },
  { principle: '로프 파트너의 신뢰(Rope Team · 서로의 발걸음을 지탱하는 유대)', insight: '험한 구간일수록 혼자 앞서가는 영웅심보다 곁의 동료와 속도를 맞추는 배려가 모두를 살림', tone: '빙하 크레바스 앞에서 서로의 줄을 확인하며 건네는 따뜻한 미소' },
  { principle: '베이스캠프의 휴식(Acclimatization · 오르기 위해 내려와 머무는 지혜)', insight: '잠시 멈추거나 한 단계 물러서는 것은 후퇴가 아니라 더 높은 곳을 가기 위한 필수 적응임', tone: '남체 바자르의 따뜻한 야크 버터 차 한 잔이 주는 깊은 안도감' },
  { principle: '하산의 집중력(Safe Descent · 올라간 뒤 돌아오는 길까지가 완성)', insight: '목표에 닿았다고 긴장을 풀지 않고 안전한 일상으로 돌아올 때까지 차분함을 유지함', tone: '긴 산행을 마치고 돌담 마을 텡보체 사원으로 돌아오는 고요한 오후' },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00 (KST)');
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateSherpaSagarmathaRidgeHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SherpaSagarmathaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PRINCIPLES.length;
  const picked = PRINCIPLES[idx];

  return {
    engineVersion: 'LUCKEY-SHERPA-SAGARMATHA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    ridgePrinciple: picked.principle,
    sagarmathaInsight: picked.insight,
    himalayanTone: picked.tone,
    reflectionFocus: `셰르파 고산 지혜의 '${picked.principle}'처럼, 무리한 속도전 대신 내 호흡과 상황의 흐름에 맞춘 꾸준한 발걸음을 선택해 보세요.`,
    ritualAction: '오늘 숨이 가빠지는 일이 생길 때마다 속도를 절반으로 낮추고, 지금 내 페이스에 맞는 다음 한 걸음만 정해 보세요.',
    reflectiveQuestion: '지금 내가 너무 빨리 정상만 바라보느라, 정작 고도 적응과 쉼의 시간을 건너뛰고 있는 일은 무엇인가요?',
    interpretiveBoundary: '네팔 히말라야 셰르파(Sherpa)의 사거마타 존중·고산 적응(Bistari) 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSherpaSagarmathaPrompt(res: SherpaSagarmathaResult): string {
  return [
    `[셰르파 사거마타·능선 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 등반 지혜: ${res.ridgePrinciple} (${res.himalayanTone})`,
    `- 중심 통찰: ${res.sagarmathaInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
