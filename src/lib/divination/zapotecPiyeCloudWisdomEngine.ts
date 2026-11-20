import type { UserProfile } from '../sharedState';

export interface ZapotecPiyeResult {
  engineVersion: string;
  calculatedAtKst: string;
  piyeGlyph: string;
  cloudInsight: string;
  monteAlbanTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const GLYPHS = [
  { glyph: '베네(Bene · 구름 위의 밝은 시야)', insight: '발밑의 자잘한 얽힘에서 한 걸음 물러나 전체 산맥의 윤곽을 조망할 때 열리는 해결책', tone: '오악사카 몬테 알반 계단 위로 흐르는 하얀 아침 구름' },
  { glyph: '코시오(Cocijo · 대지를 깨우는 번개와 비)', insight: '오래 망설이며 미뤄 둔 일에 작지만 단호한 첫 불꽃을 일으킬 때 흐름이 트이는 기운', tone: '마른 계곡을 적시며 내려오는 여름 소나기의 맑은 냄새' },
  { glyph: '피타오(Pitao · 보이지 않는 숨결의 순환)', insight: '내가 쏟은 정성과 쉼의 숨결이 돌고 돌아 다시 나를 지탱해 주는 자연스러운 균형', tone: '고대 석조 안뜰 돌기둥 사이를 스치는 선선한 바람' },
  { glyph: '겔라게차(Guelaguetza · 조건 없이 건네는 나눔)', insight: '상대의 호의를 계산하기보다 먼저 내 안의 여유를 한 줌 나눌 때 넓어지는 인연의 폭', tone: '계단식 옥수수 밭 언덕에 모인 사람들의 다정한 장터' },
  { glyph: '라니(Lani · 오늘을 기록하는 돌의 기억)', insight: '지나가는 기분에만 맡기지 않고 오늘 깨달은 기준을 또렷이 새겨 두는 성실함', tone: '해 질 녘 붉은 석양을 머금은 사포텍 석판의 단단한 결' },
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

export function calculateZapotecPiyeCloudWisdom(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ZapotecPiyeResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % GLYPHS.length;
  const picked = GLYPHS[idx];

  return {
    engineVersion: 'LUCKEY-ZAPOTEC-PIYE-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    piyeGlyph: picked.glyph,
    cloudInsight: picked.insight,
    monteAlbanTone: picked.tone,
    reflectionFocus: `메소아메리카 사포텍의 '${picked.glyph}'처럼, 눈앞의 작은 소음보다 높은 언덕 위에서 전체 흐름을 먼저 바라보세요.`,
    ritualAction: '지금 고민 중인 사안을 "일주일 뒤의 나" 시선에서 한 문장으로 다시 적어 보세요.',
    reflectiveQuestion: '한 걸음 물러나 구름 위에서 내려다본다면, 지금 가장 먼저 내려놓아도 괜찮은 걱정은 무엇인가요?',
    interpretiveBoundary: '멕시코 오악사카 사포텍(Zapotec) 전통의 피예(Piye) 주기·구름 사람(Be’ena’ Za’a) 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatZapotecPiyePrompt(res: ZapotecPiyeResult): string {
  return [
    `[사포텍 피예·구름 지혜 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 피예 상징: ${res.piyeGlyph} (${res.monteAlbanTone})`,
    `- 중심 통찰: ${res.cloudInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
