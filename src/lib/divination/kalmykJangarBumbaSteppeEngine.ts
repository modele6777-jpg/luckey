import type { UserProfile } from '../sharedState';

export interface KalmykJangarResult {
  engineVersion: string;
  calculatedAtKst: string;
  bumbaMotif: string;
  jangarInsight: string;
  caspianTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '붐바(Bumba · 모두가 평화롭게 공존하는 초원의 낙원)', insight: '누군가를 꺾어야만 내가 이기는 것이 아니라 모두가 함께 숨 쉴 수 있는 넉넉한 여백을 그리는 시선', tone: '카스피해 북쪽 초원 위로 끝없이 펼쳐진 연꽃 핀 습지' },
  { motif: '쟌가르(Jangar)의 맹세 · 흔들리지 않는 신의와 우정', insight: '말을 번복하지 않고 한 번 맺은 약속을 소중히 여길 때 저절로 모이는 단단한 신뢰', tone: '둥근 게르 천막 안에서 나누는 따뜻한 짭짤한 차(좀바)' },
  { motif: '쟌가르치(Jangarchi · 서사를 노래하는 음유시인)', insight: '지금의 고단한 하루도 먼 훗날 내가 들려줄 멋진 이야기의 한 장으로 바라보는 여유', tone: '밤바람 속에서 고요히 울려 퍼지는 돔브라 현악기의 장단' },
  { motif: '아란잘(Aranzal · 바람처럼 달리는 준마의 기백)', insight: '주저하며 제자리에 맴돌기보다 마음이 가리키는 바른 방향을 향해 시원하게 내달리는 추진력', tone: '붉은 야생 튤립이 핀 봄 초원을 가르는 상쾌한 바람' },
  { motif: '줄(Zul · 겨울 한가운데 밝히는 천 개의 등불)', insight: '계절이 가장 춥고 어두워 보일 때도 내 안의 희망의 불씨 하나는 꺼뜨리지 않는 따뜻함', tone: '겨울 저녁 집집마다 밝힌 작은 버터 등불의 포근한 빛' },
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

export function calculateKalmykJangarBumbaSteppe(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): KalmykJangarResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-KALMYK-JANGAR-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    bumbaMotif: picked.motif,
    jangarInsight: picked.insight,
    caspianTone: picked.tone,
    reflectionFocus: `칼미크 《쟌가르》 서사시의 '${picked.motif}'처럼, 조급한 경쟁심을 내려놓고 넓은 초원의 넉넉한 시야와 신의를 지켜 보세요.`,
    ritualAction: '오늘 내가 지킨 작은 약속 하나를 돌아보며, 그 약속이 만들어 준 신뢰의 온기를 느껴 보세요.',
    reflectiveQuestion: '눈앞의 작은 이득을 다투기보다 모두가 숨 쉴 수 있는 붐바의 시선으로 본다면, 지금 어떤 선택이 가장 넉넉할까요?',
    interpretiveBoundary: '칼미크(Kalmyk) 민족 서사시 《쟌가르》의 붐바 이상향과 초원 신의 문화를 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatKalmykJangarPrompt(res: KalmykJangarResult): string {
  return [
    `[칼미크 쟌가르·붐바 초원 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 초원 상징: ${res.bumbaMotif} (${res.caspianTone})`,
    `- 중심 통찰: ${res.jangarInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
