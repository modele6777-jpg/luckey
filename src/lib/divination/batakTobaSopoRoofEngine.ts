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
  sopoPhase: string;
  ridgeCurveState: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  shadowWarning: string;
  interpretiveBoundary: string;
}

const SOPO_PHASES = [
  '빗물 흘려보내기(부담을 고이게 두지 않고 처마 밖으로 보내는 국면)',
  '아래층 열어두기(일정과 대화에 숨 쉴 여백을 비우는 국면)',
  '짜맞춤 점검하기(억지 고정 대신 맞물림을 조정하는 국면)',
  '세 색 기준 세우기(핵심 원칙 몇 가지를 선명히 세우는 국면)',
] as const;

const SHADOW_WARNINGS = [
  '흘려보내야 할 것과 끝까지 책임져야 할 것까지 한꺼번에 놓아 버리는 경계',
  '열어 두기만 하다가 정작 핵심 일의 마감선이 흐려지는 과잉 개방 경계',
  '짜맞춤을 고치느라 정작 지금 당장 시작할 첫 단계를 미루는 경계',
  '원칙을 세우려다 유연한 탄력마저 잃어 삐걱거리는 경직 경계',
] as const;

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
  const seedText = `${JSON.stringify(fate)}|${input.question ?? ''}|${now.toISOString().slice(0, 13)}|batak-sopo`;
  const h = stableHash(seedText);

  const motifIdx = h % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seedText}|companion`) % (MOTIFS.length - 1));
  const phaseIdx = stableHash(`${seedText}|phase`) % SOPO_PHASES.length;
  const sopoMotif = MOTIFS[motifIdx];
  const companionMotif = MOTIFS[(motifIdx + companionOffset) % MOTIFS.length];
  const sopoPhase = SOPO_PHASES[phaseIdx];
  const ridgeCurveState = RIDGE_STATES[(h >>> 3) % RIDGE_STATES.length];
  const shadowWarning = SHADOW_WARNINGS[(motifIdx + phaseIdx) % SHADOW_WARNINGS.length];
  const shortCompanion = companionMotif.split(':')[0].trim();
  const shortPhase = sopoPhase.split('(')[0].trim();
  const ritualAction = `${RITUALS[motifIdx]} (${shortPhase} 흐름에 맞춰 '${shortCompanion}'의 구조 감각도 함께 살펴보세요.)`;
  const reflectiveQuestion = `${QUESTIONS[motifIdx]} (동반 모티프 '${shortCompanion}'과 겹쳐 보면 어떤 틈이 보이나요?)`;

  return {
    engineVersion: 'LUCKEY-BATAK-SOPO-v2.3.0',
    calculatedAtKst: toKstIso(now),
    sopoMotif,
    companionMotif,
    sopoPhase,
    ridgeCurveState,
    reflectionFocus: `못 없이 나무를 짜맞추고 아래층을 열어 두는 바타크 토바 소포 가옥처럼, 주 모티프와 동반 모티프('${companionMotif}')가 '${sopoPhase}'에서 어우러져 지금은 '${ridgeCurveState}'의 균형이 필요한 때입니다.`,
    ritualAction,
    reflectiveQuestion,
    shadowWarning,
    interpretiveBoundary: '인도네시아 수마트라 토바 바타크 족의 전통 소포 건축 지혜를 빌린 상징적 성찰 관점입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBatakSopoPrompt(result: BatakSopoResult): string {
  return [
    `[바타크 토바 소포 가옥 (${result.engineVersion}) · ${result.calculatedAtKst}]`,
    `- 상징 모티프: ${result.sopoMotif}`,
    `- 동반 모티프: ${result.companionMotif}`,
    `- 소포 국면: ${result.sopoPhase}`,
    `- 현재 결: ${result.ridgeCurveState}`,
    `- 성찰 초점: ${result.reflectionFocus}`,
    `- 작은 실천: ${result.ritualAction}`,
    `- 성찰 질문: ${result.reflectiveQuestion}`,
    `- 과잉·경직 경계: ${result.shadowWarning}`,
    `- 해석 경계: ${result.interpretiveBoundary}`,
  ].join('\n');
}
