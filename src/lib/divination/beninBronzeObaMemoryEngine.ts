import type { UserProfile } from '../sharedState';

export interface BeninBronzeObaResult {
  engineVersion: string;
  calculatedAtKst: string;
  edoMotif: string;
  beninInsight: string;
  guildTone: string;
  reflectionFocus: string;
  ritualAction: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

const MOTIFS = [
  { motif: '이군 에론몬 청동 주조(Igun Eronmwon · 밀랍을 녹이고 쇳물을 부어 한 번에 형태를 굳히는 장인의 몰입)', insight: '오랜 준비가 쌓인 순간에는 망설임을 덜고 온전한 집중으로 형태를 드러내는 용기가 필요함', tone: '베냉 성벽 안 장인 거리의 화덕에서 붉은 쇳물이 흙 거푸집 속으로 고요히 흘러드는 밤' },
  { motif: '청동 부조판의 기억(Bronze Plaque · 지나온 발자취와 계보를 선명한 부조로 새겨 잊지 않음)', insight: '오늘의 선택은 공중에서 생겨난 것이 아니라, 그동안 내가 지켜 온 성실한 기록 위에 놓여 있음', tone: '회랑 기둥을 따라 줄지어 걸린 청동판들이 햇빛을 받아 묵직하게 빛나는 궁정 뜰' },
  { motif: '오바의 산호 목걸이(Coral Regalia · 바다 건너온 산호처럼 귀한 인연과 책임을 조심스레 두름)', insight: '맡은 역할의 무게가 느껴질수록 거칠게 다루지 말고, 소중한 것을 다루듯 정갈하게 돌보아야 함', tone: '붉은 산호알이 고른 매듭으로 이어져 단정한 품격을 드러내는 예복의 결' },
  { motif: '이요 성벽의 이중 해자(Benin Earthworks · 안의 질서를 지키기 위해 넉넉한 완충 공간을 두름)', insight: '마음을 지키는 경계는 남을 밀어내는 벽이 아니라, 소중한 일상을 보호하는 넉넉한 여백임', tone: '울창한 열대 숲의 그늘을 따라 길고 완만하게 이어진 흙 성벽과 잔잔한 물길' },
  { motif: '진흙과 놋쇠의 호흡(Clay & Brass · 겉의 거푸집이 부서져야 안의 온전한 형상이 모습을 드러냄)', insight: '익숙한 방식이 깨지는 듯한 불편함은 본래의 단단한 모습이 드러나기 직전의 자연스러운 과정임', tone: '식은 거푸집을 조심스레 두드려 떼어내자 매끈한 청동 조각이 햇살을 받는 아침' },
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

export function calculateBeninBronzeObaMemory(params: {
  profile: UserProfile;
  now?: Date;
  question?: string;
}): BeninBronzeObaResult {
  const now = params.now ?? new Date();
  const seed = `${JSON.stringify(params.profile.fate ?? {})}|${params.question ?? ''}|${now.toISOString().slice(0, 13)}`;
  const idx = stableHash(seed) % MOTIFS.length;
  const picked = MOTIFS[idx];

  return {
    engineVersion: 'LUCKEY-BENIN-OBA-v2.1.0',
    calculatedAtKst: formatKstIso(now),
    edoMotif: picked.motif,
    beninInsight: picked.insight,
    guildTone: picked.tone,
    reflectionFocus: `베냉 브론즈·오바 궁정 기억의 '${picked.motif}'처럼, 그동안 쌓아 온 경험의 부조를 믿고 차분한 장인의 손길로 오늘의 한 매듭을 지어 보세요.`,
    ritualAction: '오늘 내가 이미 잘 해내 온 일 한 가지를 노트에 한 줄로 적어 두며 스스로의 기억을 선명히 남겨 보세요.',
    reflectiveQuestion: '앞으로의 불확실함에만 시선을 두느라, 이미 내 손끝에 배어 있는 숙련과 경험을 과소평가하고 있지는 않나요?',
    interpretiveBoundary: '서아프리카 에도(베냉) 청동 주조 장인 길드·기억의 부조 전통을 바탕으로 한 상징적 성찰 프레임입니다. 개인 점수·심리 진단·미래 예측이 아닙니다.',
  };
}

export function formatBeninBronzeObaPrompt(res: BeninBronzeObaResult): string {
  return [
    `[베냉 브론즈·오바 궁정 기억 성찰 · ${res.engineVersion}]`,
    `- 기준 시각: ${res.calculatedAtKst}`,
    `- 에도 모티프: ${res.edoMotif} (${res.guildTone})`,
    `- 중심 통찰: ${res.beninInsight}`,
    `- 성찰 초점: ${res.reflectionFocus}`,
    `- 오늘의 작은 실천: ${res.ritualAction}`,
    `- 스스로에게 묻기: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
  ].join('\n');
}
