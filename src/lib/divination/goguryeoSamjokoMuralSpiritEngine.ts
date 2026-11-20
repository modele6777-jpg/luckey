import type { UserProfile } from '../sharedState';

export interface GoguryeoSamjokoResult {
  engineVersion: string;
  calculatedAtKst: string;
  muralMotif: string;
  goguryeoInsight: string;
  spiritTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '삼족오의 세 발(Three-Legged Crow · 천·지·인이 한 몸에서 균형을 이루며 날아오름)', insight: '높은 이상만 쫓아도 땅에서 멀어지고 현실만 쫓아도 답답해지니, 뜻과 발걸음을 함께 맞춰야 함', tone: '무용총 천장 벽화 붉은 해 한가운데에서 검은 날개를 힘차게 펼친 삼족오' },
  { motif: '수렵도의 활시위(Hunting Mural · 주저 없이 목표를 향해 내닫는 시원한 기상)', insight: '망설임이 길어질수록 시위에서 힘이 빠지니, 방향을 정했다면 한 번은 경쾌하게 내달려야 함', tone: '고구려 산맥을 가로지르며 말을 몰아 화살을 겨누는 생동감 넘치는 붓선' },
  { motif: '사신도의 방위(Four Guardians · 동서남북 각자의 자리가 모여 온전한 하늘을 이룸)', insight: '내가 모든 역할을 혼자 다 짊어질 필요 없이 지금 내 자리에서 맡은 방위만 지켜도 충분함', tone: '강서대묘 석실 네 벽을 굳건히 수호하는 청룡·백호·주작·현무의 힘찬 선' },
  { motif: '연꽃 화생의 기운(Lotus Rebirth · 진흙 속에서도 맑고 당당하게 꽃잎을 여는 힘)', insight: '여건이 완벽하지 않다고 움츠러들기보다 지금 처한 자리에서 나만의 빛깔을 피워 내야 함', tone: '고분 천장 모서리를 붉고 푸른 빛으로 환하게 수놓은 활짝 핀 연화문' },
  { motif: '별자리와 북두칠성(Big Dipper · 밤길에서도 나아갈 좌표를 잃지 않는 밝은 이정표)', insight: '주변이 어둡고 길이 보이지 않을 때일수록 내 안의 가장 변치 않는 기준점을 올려다봐야 함', tone: '안악 고분 천장에 선명한 점과 선으로 이어진 북두칠성과 은하수의 빛' },
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

export function calculateGoguryeoSamjokoMuralSpirit(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GoguryeoSamjokoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-GOGURYEO-SAMJOKO-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    muralMotif: picked.motif,
    goguryeoInsight: picked.insight,
    spiritTone: picked.tone,
    reflectionFocus: `고구려 벽화·삼족오 기상의 '${picked.motif}'처럼, 좁은 걱정 속에 움츠러들지 말고 시야를 넓혀 당당하고 경쾌한 한 걸음을 내디뎌 보세요.`,
    ritualAction: '오늘 미루고 있던 작은 과제 하나를 골라 망설임을 접고 5분 안에 첫 손길을 대 보세요.',
    reflectiveQuestion: '지금 내가 현실의 조건만 보느라 접어 두고 있던, 나만의 기상과 시원한 포부는 무엇인가요?',
    interpretiveBoundary: '한국 고구려 고분 벽화의 삼족오·사신도·수렵도 기상을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGoguryeoSamjokoPrompt(res: GoguryeoSamjokoResult): string {
  return [
    `[고구려 삼족오·벽화 기상 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 벽화 모티프: ${res.muralMotif} (${res.spiritTone})`,
    `- 중심 통찰: ${res.goguryeoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
