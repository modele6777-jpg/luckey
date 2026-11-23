import type { UserProfile } from '../sharedState';

export interface GoguryeoSamjokoResult {
  engineVersion: string;
  calculatedAtKst: string;
  questionTopic: '기상·도약' | '방위·책임' | '이정표·신념' | '벽화 전반';
  muralMotif: string;
  companionMotif: string;
  samjokoMuralAxis: string;
  goguryeoInsight: string;
  spiritTone: string;
  reflectionFocus: string;
  ritualAction: string;
  shadowWarning: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '삼족오의 세 발(Three-Legged Crow · 천·지·인이 한 몸에서 균형을 이루며 날아오름)',
    insight: '높은 이상만 쫓아도 땅에서 멀어지고 현실만 쫓아도 답답해지니, 뜻과 발걸음을 함께 맞춰야 함',
    tone: '무용총 천장 벽화 붉은 해 한가운데에서 검은 날개를 힘차게 펼친 삼족오',
    action: '오늘 미루고 있던 작은 과제 하나를 골라 망설임을 접고 5분 안에 첫 손길을 대 보세요.',
    question: '지금 내가 현실의 조건만 보느라 접어 두고 있던, 나만의 기상과 시원한 포부는 무엇인가요?',
  },
  {
    motif: '수렵도의 활시위(Hunting Mural · 주저 없이 목표를 향해 내닫는 시원한 기상)',
    insight: '망설임이 길어질수록 시위에서 힘이 빠지니, 방향을 정했다면 한 번은 경쾌하게 내달려야 함',
    tone: '고구려 산맥을 가로지르며 말을 몰아 화살을 겨누는 생동감 넘치는 붓선',
    action: '머릿속에서 맴돌기만 하던 결정 하나에 기한을 정하고, 오늘 안에 가벼운 첫 시도부터 당겨 보세요.',
    question: '방향은 이미 정했는데 지나친 망설임 때문에 시위만 당긴 채 놓지 못하고 있는 일은 무엇인가요?',
  },
  {
    motif: '사신도의 방위(Four Guardians · 동서남북 각자의 자리가 모여 온전한 하늘을 이룸)',
    insight: '내가 모든 역할을 혼자 다 짊어질 필요 없이 지금 내 자리에서 맡은 방위만 지켜도 충분함',
    tone: '강서대묘 석실 네 벽을 굳건히 수호하는 청룡·백호·주작·현무의 힘찬 선',
    action: '내 몫이 아닌 걱정까지 한꺼번에 끌어안지 말고, 오늘 내가 지켜야 할 한 방위의 일만 또렷이 구분해 보세요.',
    question: '지금 내가 모든 방위를 혼자 맡으려 애쓰느라 정작 내 자리의 힘을 분산시키고 있는 부분은 어디인가요?',
  },
  {
    motif: '연꽃 화생의 기운(Lotus Rebirth · 진흙 속에서도 맑고 당당하게 꽃잎을 여는 힘)',
    insight: '여건이 완벽하지 않다고 움츠러들기보다 지금 처한 자리에서 나만의 빛깔을 피워 내야 함',
    tone: '고분 천장 모서리를 붉고 푸른 빛으로 환하게 수놓은 활짝 핀 연화문',
    action: '조건이 완벽해지기를 기다리지 말고, 지금 있는 자리에서 당장 피워 낼 수 있는 작은 결과 하나를 만들어 보세요.',
    question: '환경이 아직 덜 갖춰졌다는 이유로 꽃잎을 닫아 두고 있던 내 안의 가능성은 무엇인가요?',
  },
  {
    motif: '별자리와 북두칠성(Big Dipper · 밤길에서도 나아갈 좌표를 잃지 않는 밝은 이정표)',
    insight: '주변이 어둡고 길이 보이지 않을 때일수록 내 안의 가장 변치 않는 기준점을 올려다봐야 함',
    tone: '안악 고분 천장에 선명한 점과 선으로 이어진 북두칠성과 은하수의 빛',
    action: '복잡한 잡음을 잠깐 끄고, 어떤 상황에서도 흔들리지 않을 나의 기준 한 문장을 메모해 두세요.',
    question: '주변의 소음과 어둠 속에서도 내가 끝내 올려다보며 방향을 잡아야 할 북두칠성은 무엇인가요?',
  },
];

function formatKstIso(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function stableHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const GOGURYEO_SHADOWS = [
  '높은 이상과 도약을 꿈꾸느라 오늘 발밑에 놓인 작은 생활 루틴과 현실의 점검을 놓치지 마세요.',
  '망설임을 접고 시원하게 내달리는 기상 속에서도 과녁 주변의 안전과 맥락은 한 번 더 확인하세요.',
  '내 방위만 지킨다는 이유로 함께 하늘을 받치고 있는 곁의 흐름과 소통의 끈까지 닫아 두지 마세요.',
  '여건이 덜 갖춰졌다고 당장 피워 내기만 서두르다 뿌리가 자리 잡을 시간을 뺏지 않도록 살피세요.',
  '변치 않는 북두칠성의 기준을 세우되 작은 현실 변화에 맞춘 유연한 경로 수정까지 막아 버리지 마세요.',
];

function classifyGoguryeoTopic(q: string): GoguryeoSamjokoResult['questionTopic'] {
  if (/시야|도약|기상|시작|당당/.test(q)) return '기상·도약';
  if (/방위|책임|자리|역할|일/.test(q)) return '방위·책임';
  if (/방향|이정표|기준|별|어둠/.test(q)) return '이정표·신념';
  return '벽화 전반';
}

export function calculateGoguryeoSamjokoMuralSpirit(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GoguryeoSamjokoResult {
  const now = params.now ?? new Date();
  const q = (params.question ?? '').trim();
  const questionTopic = classifyGoguryeoTopic(q);
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${q}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];
  const samjokoMuralAxis = `${picked.motif.split('(')[0].trim()} ↔ ${companion.motif.split('(')[0].trim()} (${questionTopic})`;
  const shadowWarning = GOGURYEO_SHADOWS[idx];

  return {
    engineVersion: 'LUCKEY-GOGURYEO-SAMJOKO-v2.3.0',
    calculatedAtKst: formatKstIso(now),
    questionTopic,
    muralMotif: picked.motif,
    companionMotif: companion.motif,
    samjokoMuralAxis,
    goguryeoInsight: picked.insight,
    spiritTone: picked.tone,
    reflectionFocus: `고구려 벽화·삼족오 기상의 '${picked.motif}'처럼, 좁은 걱정 속에 움츠러들지 말고 시야를 넓혀 당당하고 경쾌한 한 걸음을 내디뎌 보세요. (동반 결: ${companion.motif.split('(')[0].trim()})`,
    ritualAction: picked.action,
    shadowWarning,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '한국 고구려 고분 벽화의 삼족오·사신도·수렵도 기상을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGoguryeoSamjokoPrompt(res: GoguryeoSamjokoResult): string {
  return [
    `[고구려 삼족오·벽화 기상 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 질문 맥락: ${res.questionTopic} | 벽화·삼족오 축: ${res.samjokoMuralAxis}`,
    `- 벽화 모티프: ${res.muralMotif} (${res.spiritTone})`,
    `- 동반 모티프: ${res.companionMotif}`,
    `- 중심 통찰: ${res.goguryeoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 과잉 경계: ${res.shadowWarning}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
