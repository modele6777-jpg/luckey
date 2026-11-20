import type { UserProfile } from '../sharedState';

export interface ChampaMySonResult {
  engineVersion: string;
  calculatedAtKst: string;
  brickMotif: string;
  companionMotif: string;
  mySonInsight: string;
  monsoonTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  {
    motif: '미선의 붉은 벽돌(Mỹ Sơn Brick · 억지 접착제 없이 서로의 무게로 버티는 탑)',
    insight: '과장된 포장이나 무리한 결속이 없어도 기본기 하나하나가 잘 맞춰져 있으면 오래 버팀',
    tone: '베트남 중부 푸른 계곡 안개 속에 조용히 서 있는 고대 참파의 붉은 벽돌 성소',
    ritual: '오늘 내가 맡은 일 중 가장 기본적인 절차 하나를, 어깨의 힘을 빼고 차분히 정돈해 보세요.',
    question: '지금 내가 억지 접착제처럼 무리해서 붙잡고 있는 것 대신, 기본기만 반듯하면 자연히 서 있을 일은 무엇인가요?',
  },
  {
    motif: '투본 강의 뱃길(Thu Bồn · 내륙의 산과 넓은 바다를 잇는 물길)',
    insight: '좁은 자리에만 머물기보다 내가 가진 재능을 바깥세상과 연결할 통로를 열어 두는 편이 좋음',
    tone: '등불이 비치는 호이안 강어귀를 따라 잔잔히 흘러가는 저녁 물결',
    ritual: '혼자만 쌓아 두던 작업이나 생각을 오늘 신뢰하는 한 사람이나 외부 채널에 가볍게 연결해 보세요.',
    question: '내 안에만 고여 있던 경험이나 재능을 바깥과 잇는 투본 강 같은 물길은 어디로 열려 있나요?',
  },
  {
    motif: '칼란 탑의 문턱(Kalan · 밖의 소란을 두고 안으로 드는 단정한 쉼)',
    insight: '하루 종일 바깥일을 치른 뒤에는 나만의 조용한 성소에 들어가 숨을 고르는 시간이 필요함',
    tone: '열대 나뭇잎 그림자가 드리운 고대 석조 문턱 앞의 서늘한 그늘',
    ritual: '오늘 일을 마친 뒤 10분간은 바깥 소식과 화면을 닫고 내 안의 고요한 문턱을 넘어 쉬어 보세요.',
    question: '하루의 소란을 바깥에 두고 칼란 탑의 문턱을 넘듯 온전히 나 자신에게 돌아가 쉬어야 할 시간은 언제인가요?',
  },
  {
    motif: '아프사라의 손짓(Apsara · 힘들이지 않고 유연하게 흐르는 균형)',
    insight: '어깨에 과한 힘을 주면 금세 지치지만, 리듬에 몸을 맡기면 같은 일도 훨씬 가벼워짐',
    tone: '사암 부조 위에서 천 년을 이어 온 고요하고 우아한 곡선의 춤',
    ritual: '오늘 긴장이 들어간 어깨와 손목의 힘을 빼고, 가장 자연스러운 순서대로 한 가지 일을 이어가 보세요.',
    question: '굳이 어깨에 과한 힘을 주며 버티느라 무거워졌지만, 리듬에 맡기면 훨씬 가벼워질 일은 무엇인가요?',
  },
  {
    motif: '바다와 산의 경계(Hai Van · 구름이 산을 넘다 비를 내리고 개는 고개)',
    insight: '지금 마음이 흐린 것도 잠시 고개를 넘는 구름일 뿐, 곧 다른 쪽 하늘이 맑게 열림',
    tone: '구름이 걸린 푸른 산능선 너머로 시원하게 트이는 동해안의 수평선',
    ritual: '답답한 기분이 들 때는 지금 이 순간도 고개를 넘어가는 중이라고 적으며 시선을 한 뼘 넓혀 보세요.',
    question: '지금 내 마음을 덮은 구름이 잠시 고개를 넘는 과정일 뿐이라면, 그 너머에서 기다리는 맑은 수평선은 무엇인가요?',
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

export function calculateChampaMySonBrickSanctuary(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): ChampaMySonResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const companionOffset = 1 + (stableHash(`${seed}|companion`) % (MOTIFS.length - 1));
  const picked = MOTIFS[idx];
  const companion = MOTIFS[(idx + companionOffset) % MOTIFS.length];

  return {
    engineVersion: 'LUCKEY-CHAMPA-MYSON-v2.2.0',
    calculatedAtKst: formatKstIso(now),
    brickMotif: picked.motif,
    companionMotif: companion.motif,
    mySonInsight: `${picked.insight} (동반 결: ${companion.motif})`,
    monsoonTone: picked.tone,
    reflectionFocus: `참파 미선 성소 지혜의 '${picked.motif}'와 동반 결 '${companion.motif}'처럼, 겉을 요란하게 꾸미기보다 오늘 내 기본기 한 장을 빈틈없이 반듯하게 올려 보세요.`,
    ritualAction: picked.ritual,
    reflectiveQuestion: picked.question,
    interpretiveBoundary: '베트남 중부 참파(Champa) 미선 성소의 붉은 벽돌 건축과 투본 강 조화 지혜를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatChampaMySonPrompt(res: ChampaMySonResult): string {
  return [
    `[참파 미선·붉은 벽돌 성소 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 성소 상징: ${res.brickMotif} (${res.monsoonTone})`,
    `- 동반 결: ${res.companionMotif}`,
    `- 중심 통찰: ${res.mySonInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
