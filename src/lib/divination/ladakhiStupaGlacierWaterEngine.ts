import type { UserProfile } from '../sharedState';

export interface LadakhiChortenResult {
  engineVersion: string;
  calculatedAtKst: string;
  glacierWisdom: string;
  companionWisdom: string;
  chortenInsight: string;
  transHimalayanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const WISDOMS = [
  {
    wisdom: '아이스 스투파(Ice Stupa · 겨울의 남는 물을 얼려 봄의 갈증을 채움)',
    insight: '여유가 있을 때 조금씩 모아 둔 작은 준비가 메마른 계절을 건너는 가장 큰 힘이 됨',
    tone: '라다크 메마른 고원 계곡에 햇빛을 받아 반짝이며 우뚝 솟은 하얀 얼음 탑',
    ritual: '오늘 지금 당장 급하지 않더라도, 다음 계절의 나를 편하게 해 줄 작은 준비 하나를 차분히 챙겨 두세요.',
    question: '지금 내가 흘려보내고 있는 시간이나 에너지 가운데, 얼음 스투파처럼 잘 모아 두면 봄날에 큰 도움이 될 것은 무엇인가요?',
  },
  {
    wisdom: '추르폰(Churpon · 고원의 한정된 물길을 공평하게 나누는 지혜)',
    insight: '자원이 부족할수록 독점하려 하기보다 투명한 순서와 배려로 나눌 때 모두가 살아남음',
    tone: '보리밭을 적시며 돌담 수로를 따라 맑게 흘러내리는 빙하 녹은 물',
    ritual: '오늘 시간이나 자원이 빠듯할수록 나만의 순서를 억지로 밀기보다 함께 쓰는 흐름을 한 번 살피고 배려해 보세요.',
    question: '자원이 한정적일수록 내가 혼자 끌어안으려 하기보다, 추르폰처럼 투명한 순서와 배려로 나누면 모두가 편해질 일은 무엇인가요?',
  },
  {
    wisdom: '줄레이(Julley · 만남과 고마움, 작별을 하나로 품은 인사)',
    insight: '복잡한 수식어 없이 상대를 반기고 고마워하는 따뜻한 인사 한 마디가 마음을 엶',
    tone: '레(Leh)의 파란 하늘 아래 마니차(Mani Wheel)를 돌리며 건네는 맑은 미소',
    ritual: '오늘 마주친 사람이나 메시지를 주고받는 상대 한 명에게 짧더라도 진심이 담긴 고마움의 인사를 건네 보세요.',
    question: '긴 설명보다 ‘줄레이’ 같은 담백하고 따뜻한 인사 한마디로 먼저 마음을 열 수 있는 관계는 누구인가요?',
  },
  {
    wisdom: '초르텐(Chorten · 험한 고갯길마다 세워진 쉼과 기원의 이정표)',
    insight: '먼 길을 갈수록 중간중간 잠시 숨을 고르고 방향을 확인하는 작은 매듭이 필요함',
    tone: '해발 사천 미터 고갯마루에 서 있는 단정한 백색 석탑과 푸른 하늘',
    ritual: '일정 사이 2분만 멈춰 서서 지금 내가 어느 고갯마루를 지나고 있는지 숨을 고르며 확인해 보세요.',
    question: '먼 길을 가느라 쉼 없이 달리기보다, 초르텐 앞에서 잠시 멈춰 방향을 다시 짚어 보아야 할 지점은 어디인가요?',
  },
  {
    wisdom: '파슈미나(Pashmina · 혹독한 고산의 추위를 견뎌 낸 가장 부드러운 결)',
    insight: '거친 시간과 추위를 지나온 마음일수록 오히려 타인을 감싸는 부드러운 온기가 깊음',
    tone: '창탕 고원의 맑은 바람 속에서 천천히 빗어 모은 가볍고 따뜻한 직조',
    ritual: '스스로를 몰아세우던 말투를 오늘 하루만 가장 부드럽고 따뜻한 말투로 바꾸어 건네 보세요.',
    question: '거친 시간을 지나오며 단단해진 내 안에서, 오히려 나 자신과 타인을 부드럽게 감싸 줄 수 있는 온기는 무엇인가요?',
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

export function calculateLadakhiStupaGlacierWater(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): LadakhiChortenResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % WISDOMS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (WISDOMS.length - 1));
  const picked = WISDOMS[idx];
  const companion = WISDOMS[(idx + companionOffset) % WISDOMS.length];

  return {
    engineVersion: 'LUCKEY-LADAKHI-CHORTEN-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    glacierWisdom: picked.wisdom,
    companionWisdom: companion.wisdom,
    chortenInsight: `${picked.insight} (동반 지혜: ${companion.wisdom})`,
    transHimalayanTone: picked.tone,
    reflectionFocus: `라다크 고원 지혜의 '${picked.wisdom}'와 동반 지혜 '${companion.wisdom}'처럼, 지금 내게 주어진 자원과 시간을 알뜰히 아껴 쓰며 필요한 때를 위해 고요히 모아 두세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '인도 북부 라다크(Ladakh)의 아이스 스투파·추르폰 물 나눔·줄레이 공동체 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatLadakhiChortenPrompt(res: LadakhiChortenResult): string {
  return [
    `[라다크 스투파·고원 물길 조화 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 고원 지혜: ${res.glacierWisdom} (${res.transHimalayanTone})`,
    `- 동반 지혜: ${res.companionWisdom}`,
    `- 중심 통찰: ${res.chortenInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
