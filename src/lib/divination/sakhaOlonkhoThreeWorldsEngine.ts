import type { UserProfile } from '../sharedState';

export interface SakhaOlonkhoResult {
  engineVersion: string;
  calculatedAtKst: string;
  worldPillar: string;
  olonkhoInsight: string;
  lenaTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const PILLARS = [
  { pillar: '아알 루욱 마스(Aal Luuk Mas · 세 세계를 잇는 거대한 자작나무)', insight: '과거의 뿌리와 현재의 줄기, 내일의 가지가 한 몸처럼 이어져 있음을 신뢰하는 안정감', tone: '레나 강변 설원 위에 뿌리를 내린 은빛 자작나무' },
  { pillar: '오르토 도이두(Orto Doidu · 지금 발 딛고 선 중간 세계)', insight: '먼 이상이나 두려움에 마음을 빼앗기지 않고 오늘 내 눈앞의 현실을 성실히 돌보는 감각', tone: '짧지만 찬란한 시베리아 여름 초원의 야생화 물결' },
  { pillar: '위뢰윙 아이으 토욘(Ürüng Aiyy Toyon · 맑은 빛과 질서의 원리)', insight: '어지러운 생각들을 억지로 싸워 이기기보다 밝고 정갈한 질서 하나로 정리하는 지혜', tone: '혹한을 뚫고 떠오르는 북극권 정오의 투명한 태양' },
  { pillar: '호무스(Khomus · 마음을 여는 구금의 울림)', insight: '굳어 있던 감정의 매듭이 작은 휴식과 음악 한 소절로 부드럽게 풀리는 전환점', tone: '겨울 밤 따뜻한 통나무 집 안에서 울리는 호무스의 공명' },
  { pillar: '이흐야흐(Yhyakh · 새해를 여는 둥근 원무)', insight: '지난 시간의 고단함을 털어내고 오늘부터 다시 시작할 수 있는 환대와 재생의 힘', tone: '백야의 밝은 하늘 아래 손을 맞잡고 도는 사람들의 원' },
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

export function calculateSakhaOlonkhoThreeWorlds(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): SakhaOlonkhoResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % PILLARS.length;
  const picked = PILLARS[idx];

  return {
    engineVersion: 'LUCKEY-SAKHA-OLONKHO-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    worldPillar: picked.pillar,
    olonkhoInsight: picked.insight,
    lenaTone: picked.tone,
    reflectionFocus: `시베리아 사하 올론호의 '${picked.pillar}'처럼, 뿌리(기반)와 가지(목표) 사이의 중심을 지금 내가 서 있는 오늘에 두어 보세요.`,
    ritualAction: '오늘 내 몸과 마음의 뿌리를 지탱해 줄 작은 돌봄(따뜻한 물, 짧은 스트레칭, 정돈) 한 가지를 먼저 해 주세요.',
    reflectiveQuestion: '지금 내가 미래의 가지에만 매달리느라 소홀히 하고 있는 오늘의 단단한 뿌리는 무엇인가요?',
    interpretiveBoundary: '시베리아 사하(야쿠트) 전통의 올론호(Olonkho) 세계수와 세 세계 균형 철학을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatSakhaOlonkhoPrompt(res: SakhaOlonkhoResult): string {
  return [
    `[사하 올론호 세 세계 균형 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 세계수 기둥: ${res.worldPillar} (${res.lenaTone})`,
    `- 중심 통찰: ${res.olonkhoInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
