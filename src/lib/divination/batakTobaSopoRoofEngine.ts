import type { UserProfile } from '../sharedState';

export interface BatakSopoInput {
  profile: UserProfile;
  now?: Date;
  question?: string;
}

export interface BatakSopoResult {
  engineVersion: string;
  calculatedAtKst: string;
  sopoMotif: string;
  companionMotif: string;
  ridgeCurveState: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  '안장형 용마루(Saddle Roof): 하늘을 향해 두 끝을 들어 올려 비를 흘려보내고 안쪽 공간을 넉넉히 품는 지붕 선',
  '소포 하부 쉼터(Open Sopo Hall): 위층은 곡식을 두고 아래층은 사방이 트여 누구나 잠시 쉬어 가는 열린 마루',
  '싱가 조각(Singa Carving): 처마 끝에 붉고 검고 흰 세 색으로 새겨 집안의 기운을 맑게 가다듬는 수호 문양',
  '못 없는 짜맞춤(Pegged Timber): 쇠못 하나 없이 나무끼리 맞물려 지진에도 흔들리며 버티는 유연한 결속',
] as const;

const RIDGE_STATES = [
  '양끝을 들어 올린 여유로운 곡선',
  '사방이 트인 아래층의 환기',
  '쇠못 없이 맞물린 단단한 짜임',
  '세 가지 원색처럼 분명한 기준',
] as const;

const RITUALS = [
  '비가 오면 흘러내리는 처마처럼, 지금 붙잡지 않아도 될 걱정은 자연스레 흘려보내세요.',
  '오늘 일정 사이사이에 누구든 잠깐 숨을 돌릴 수 있는 열린 15분을 비워 두세요.',
  '중요한 결정 기준 세 가지만 선명하게 적어 책상 앞에 붙여 두세요.',
  '억지로 조이지 않고 서로 맞물려 돌아가도록 역할이나 순서를 가볍게 재배치해 보세요.',
] as const;

const QUESTIONS = [
  '내 일상의 지붕은 빗물을 흘려보낼 만큼 넉넉한 곡선을 가지고 있나요?',
  '꽉 막힌 벽을 세우기보다 아래층 마루처럼 열어 두면 오히려 더 안전해지는 관계는 없을까요?',
  '오늘 나를 지켜 줄 가장 선명한 원칙 세 가지는 무엇인지 떠올려 볼까요?',
  '쇠못처럼 억지로 고정하느라 삐걱거리고 있는 계획은 무엇인가요?',
] as const;

function toKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function calculateBatakSopoRoof(input: BatakSopoInput): BatakSopoResult {
  const now = input.now ?? new Date();
  const fate = input.profile?.fate ?? {};
  const seedText = `${JSON.stringify(fate)}|${input.question ?? ''}|${now.toISOString().slice(0, 10)}|batak-sopo`;
  const h = stableHash(seedText);

  const motifIdx = h % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seedText}|companion`) % (MOTIFS.length - 1));
  const sopoMotif = MOTIFS[motifIdx];
  const companionMotif = MOTIFS[(motifIdx + companionOffset) % MOTIFS.length];
  const ridgeCurveState = RIDGE_STATES[(h >>> 3) % RIDGE_STATES.length];
  const ritualAction = RITUALS[motifIdx];
  const reflectiveQuestion = QUESTIONS[motifIdx];

  return {
    engineVersion: 'LUCKEY-BATAK-SOPO-v2.2.0',
    calculatedAtKst: toKstIso(now),
    sopoMotif,
    companionMotif,
    ridgeCurveState,
    reflectionFocus: `못 없이 나무를 짜맞추고 아래층을 열어 두는 바타크 토바 소포 가옥처럼, 주 모티프와 동반 모티프('${companionMotif}')가 어우러져 지금은 '${ridgeCurveState}'의 균형이 필요한 때입니다.`,
    ritualAction,
    reflectiveQuestion,
    interpretiveBoundary: '인도네시아 수마트라 토바 바타크 족의 전통 소포 건축 지혜를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBatakSopoPrompt(result: BatakSopoResult): string {
  return [
    `[바타크 토바 소포 가옥 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 상징 모티프: ${result.sopoMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 현재 결: ${result.ridgeCurveState}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
