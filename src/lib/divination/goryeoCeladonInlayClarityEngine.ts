import type { UserProfile } from '../sharedState';

export interface GoryeoCeladonResult {
  engineVersion: string;
  calculatedAtKst: string;
  celadonCraft: string;
  goryeoInsight: string;
  jadeTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const CRAFTS = [
  { craft: '상감 기법(Inlay · 먼저 나를 비워 홈을 파야 비로소 다른 빛이 스며듦)', insight: '새 것을 덧칠하기만 하면 들뜨고 마니, 내 안에 작은 여백을 먼저 파내는 절제가 아름다움을 만듦', tone: '맑은 비색 바탕 위로 백토와 흑토의 학이 고요히 날아오르는 고려 청자 매병' },
  { craft: '비색 유약(Jade Glaze · 억지 화려함 대신 맑은 물빛의 깊이를 빚음)', insight: '남의 시선을 단번에 끌려는 과장보다 오래 볼수록 마음이 편안해지는 진정성이 오래감', tone: '비 갠 뒤 가을 하늘을 그대로 담아낸 듯 은은하고 투명한 청자의 푸른빛' },
  { craft: '강진 가마의 기다림(Kiln Patience · 불을 끈 뒤 식어 내리는 밤을 견딤)', insight: '일을 마쳤다고 바로 열어 보며 조바심내기보다 열기가 자연스레 식어 굳기를 기다려야 함', tone: '남해 바닷바람이 스치는 강진 도요지 가마 밖의 고요한 새벽 공기' },
  { craft: '표주박의 곡선(Gourd Curve · 모나지 않고 둥글게 품어 안는 선)', insight: '원칙을 지키되 타인과 나를 대하는 태도에는 둥근 여백을 남겨야 부딪힘이 줄어듦', tone: '어깨에서 허리까지 물 흐르듯 부드럽게 이어지는 청자 주전자의 유려한 선' },
  { craft: '투각의 바람구멍(Openwork · 뚫어 놓은 빈틈 사이로 향기와 빛이 통함)', insight: '빈틈없이 꽉 채운 계획보다 숨이 드나들 수 있는 구멍 하나가 전체를 살려 냄', tone: '연꽃 잎 사이사이 섬세하게 뚫린 틈새로 은은한 향이 피어오르는 향로 뚜껑' },
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

export function calculateGoryeoCeladonInlayClarity(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): GoryeoCeladonResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % CRAFTS.length;
  const picked = CRAFTS[idx];

  return {
    engineVersion: 'LUCKEY-GORYEO-CELADON-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    celadonCraft: picked.craft,
    goryeoInsight: picked.insight,
    jadeTone: picked.tone,
    reflectionFocus: `고려 청자 비색·상감 지혜의 '${picked.craft}'처럼, 억지로 더 채우기보다 마음의 홈을 비워 여백과 숨구멍을 먼저 마련해 보세요.`,
    ritualAction: '오늘 꽉 차 있는 일정이나 생각 중에서 딱 한 칸만 비워 두고, 아무것도 채우지 않는 여백의 시간을 허락해 주세요.',
    reflectiveQuestion: '지금 내 삶에 새로운 것을 덧칠하려 들기 전에, 상감 기법처럼 먼저 비워 내야 더 빛이 날 자리는 어디인가요?',
    interpretiveBoundary: '한국 고려 청자의 비색·상감 여백 미학과 도공의 기다림을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatGoryeoCeladonPrompt(res: GoryeoCeladonResult): string {
  return [
    `[고려 청자·비색 상감 여백 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 청자 기법: ${res.celadonCraft} (${res.jadeTone})`,
    `- 중심 통찰: ${res.goryeoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
