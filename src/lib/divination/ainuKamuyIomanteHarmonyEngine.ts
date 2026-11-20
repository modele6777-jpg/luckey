import type { UserProfile } from '../sharedState';

export interface AinuKamuyAspect {
  name: string;
  koreanLabel: string;
  circulationPrinciple: string;
  coreInsight: string;
  practicalRespect: string;
  reflectiveQuestion: string;
}

export interface AinuKamuyResult {
  engineVersion: 'LUCKEY-AINU-KAMUY-v2.2.0';
  calculatedAtKst: string;
  questionFocus: string;
  primaryAspect: AinuKamuyAspect;
  companionAspect: AinuKamuyAspect;
  kamuyCircleTheme: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const AINU_ASPECTS: AinuKamuyAspect[] = [
  {
    name: '아페 후치 카무이 (불의 수호)',
    koreanLabel: '중심의 온기와 일상의 경계',
    circulationPrinciple: '집의 중심인 화로를 돌보며 삶의 온도를 지키는 원리',
    coreInsight: '밖으로 시선을 쏟기 전에 내 안의 따뜻한 중심과 기초 생활 리듬을 먼저 돌봐야 합니다.',
    practicalRespect: '오늘 내가 가장 자주 쓰는 책상이나 공간 한 곳을 3분만 정돈하며 마음을 가라앉히세요.',
    reflectiveQuestion: '지금 내 일상의 화로(아페 후치)에서 가장 먼저 온기를 되살려야 할 기초 리듬은 무엇인가요?',
  },
  {
    name: '시리 코르 카무이 (대지의 숨)',
    koreanLabel: '버텨 준 바탕에 대한 감사',
    circulationPrinciple: '발 딛고 선 자리의 고마움을 먼저 알아보는 원리',
    coreInsight: '부족한 점만 세기보다 지금까지 나를 지탱해 온 환경과 사람 한 가지를 먼저 알아줄 때 힘이 돌아옵니다.',
    practicalRespect: '오늘 고마웠던 일이나 도구, 사람 한 가지를 마음속으로 정확히 이름 불러 인사해 보세요.',
    reflectiveQuestion: '지금까지 나를 조용히 지탱해 주었지만 당연하게 여기며 지나치고 있던 바탕은 무엇인가요?',
  },
  {
    name: '이오만테 순환 (비움과 보내기)',
    koreanLabel: '역할을 다한 것의 온전한 배웅',
    circulationPrinciple: '머물던 것을 억지로 붙잡지 않고 감사히 보내 새 흐름을 여는 원리',
    coreInsight: '이미 끝난 걱정이나 역할이 다한 습관을 정중히 놓아주어야 다음 계절이 들어옵니다.',
    practicalRespect: '오늘 붙잡고 있던 미련이나 불필요한 걱정 하나를 메모지에 적어 접어 두세요.',
    reflectiveQuestion: '역할을 다했는데도 놓지 못해 새 계절의 자리를 막고 있는 미련이나 습관은 무엇인가요?',
  },
  {
    name: '코탄 모시르 (함께 숨 쉬는 마을)',
    koreanLabel: '서로를 해치지 않는 공존 거리',
    circulationPrinciple: '자연과 이웃이 서로의 자리를 침범하지 않고 어우러지는 원리',
    coreInsight: '좋은 관계는 모든 것을 맞춰 주는 게 아니라 서로의 숨 쉴 자리를 지켜 주는 데서 자랍니다.',
    practicalRespect: '상대의 반응에 즉각 흔들리지 말고 반 박자 숨을 고른 뒤 차분히 응답하세요.',
    reflectiveQuestion: '가까운 관계 속에서 서로의 숨 쉴 자리를 지키기 위해 반 박자 여유를 둘 지점은 어디인가요?',
  },
];

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateAinuKamuyIomanteHarmony(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): AinuKamuyResult {
  const now = params.now ?? new Date();
  const questionFocus = (params.question ?? '').trim() || '존중과 감사의 순환 리듬';
  const seedBase = `${JSON.stringify(params.profile.fate ?? {})}|${now.toISOString().slice(0, 13)}|${questionFocus}|ainu-kamuy`;
  const seed = stableHash(seedBase);
  const companionSeed = stableHash(`${seedBase}|companion`);

  const primaryIdx = seed % AINU_ASPECTS.length;
  const companionOffset = 1 + (companionSeed % (AINU_ASPECTS.length - 1));
  const companionIdx = (primaryIdx + companionOffset) % AINU_ASPECTS.length;
  const primaryAspect = AINU_ASPECTS[primaryIdx];
  const companionAspect = AINU_ASPECTS[companionIdx];

  return {
    engineVersion: 'LUCKEY-AINU-KAMUY-v2.2.0',
    calculatedAtKst: formatKstTimestamp(now),
    questionFocus,
    primaryAspect,
    companionAspect,
    kamuyCircleTheme: `${primaryAspect.koreanLabel}에서 ${companionAspect.koreanLabel}으로 이어지는 존중의 순환`,
    ritualAction: primaryAspect.practicalRespect,
    reflectionFocus: `${primaryAspect.name}의 시선(${primaryAspect.circulationPrinciple})과 ${companionAspect.koreanLabel}의 여운으로 오늘의 소모와 감사를 되짚습니다.`,
    reflectiveQuestion: primaryAspect.reflectiveQuestion,
    interpretiveBoundary:
      '아이누 카무이·이오만테 관점은 존중과 순환을 비유적으로 성찰하는 상징 도구이며, 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatAinuKamuyPrompt(result: AinuKamuyResult): string {
  return [
    `[아이누 카무이·이오만테 존중과 순환 엔진 ${result.engineVersion}]`,
    `- 연산 시각: ${result.calculatedAtKst}`,
    `- 질문 초점: ${result.questionFocus}`,
    `- 중심 결: ${result.primaryAspect.name} (${result.primaryAspect.koreanLabel}) — ${result.primaryAspect.coreInsight}`,
    `- 이어지는 결: ${result.companionAspect.name} (${result.companionAspect.koreanLabel})`,
    `- 순환 주제: ${result.kamuyCircleTheme}`,
    `- 실천 제안: ${result.ritualAction}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 되묻는 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
