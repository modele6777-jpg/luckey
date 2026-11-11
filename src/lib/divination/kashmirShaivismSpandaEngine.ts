/**
 * 카슈미르 시바파 스판다 우주 신성 맥동 & 프라티야비즈냐 본성 재인식 엔진 (kashmirShaivismSpandaEngine.ts)
 *
 * 9~10세기 고대 인도 카슈미르 시바파(Kashmir Shaivism) 트리카(Trika) 철학의 대성자 바수굽타(Vasugupta)와 아브히나바굽타(Abhinavagupta)의 원전 기반:
 * 우주 만물을 진동시키는 순수 의식의 원초적 맥동 스판다(Spanda)와,
 * 이미 본래 절대자 시바(Shiva)임을 직접 깨닫는 본성 재인식 프라티야비즈냐(Pratyabhijna) 체계.
 *
 * 트리카 5대 신성 행위와 현존 양상(Pancha Kritya & Spanda Manifestation):
 * 1. 아누그라하 (Anugraha - 신성한 은총과 해방): 자아의 모든 장벽을 녹이고 본래 자유로운 신성 자아를 회복하는 은총
 * 2. 스리스티 (Srishti - 신성한 현현과 창조): 순수 자각에서 만유의 아름다운 경험과 영감이 샘솟는 빛의 개화
 * 3. 스티티 (Sthiti - 조화로운 유지와 머묾): 삶의 모든 순간 속에서 고요한 균형과 중심을 잃지 않는 현존의 안정
 * 4. 삼하라 (Samhara - 용해와 회귀): 낡고 불필요한 번뇌와 고통을 근원적 빛의 바다 속으로 되돌려 정화함
 * 5. 티로바바 (Tirobhava - 신성한 유희와 은폐): 스스로를 감추어 다채로운 삶의 연극을 펼치며 진리를 찾아가는 위대한 유희(Lila)
 *
 * 프라카샤(Prakasha - 자각의 순수한 빛)와 비마르샤(Vimarsha - 역동적인 자기 성찰의 힘)가 하나로 춤추며,
 * 3대 불순(3대 말라: 아나바·마이야·카르마)을 일순간에 소멸시키는 절대 비이원성(Non-dual) 각성 엔진.
 */

import type { UserProfile } from '../sharedState';

export const KASHMIR_SHAIVISM_SPANDA_ENGINE_VERSION = '1.0.0';

export interface KashmirShaivismTattva {
  id: string;
  nameKo: string;
  sanskrit: string;
  divineAction: string; // 5대 신성 행위(Pancha Kritya)
  consciousnessDomain: string;
  transcendencePower: string;
  resonanceScore: number; // 0 ~ 100
}

export interface KashmirShaivismSpandaReport {
  engineVersion: string;
  timestamp: string;
  spandaCosmicPulsationScore: number; // 0 ~ 100 스판다 우주적 맥동 점수
  pratyabhijnaSelfRecognitionIndex: number; // 0 ~ 100 프라티야비즈냐 본성 재인식 완성도
  prakashaVimarshaUnityScore: number; // 0 ~ 100 프라카샤-비마르샤 합일률
  threeMalasPurificationRate: number; // 0 ~ 100 3대 말라(에고 불순) 정화율
  dominantTattva: KashmirShaivismTattva; // 현재 주재하는 트리카 신성 양상
  secondaryTattva: KashmirShaivismTattva; // 보조 양상
  kashmirShaivismGuidance: string; // 카슈미르 시바파 지혜 지침
  spandaPulsationMeditationRitual: string; // 스판다 맥동 명상 리추얼
}

const KASHMIR_TATTVAS_BASE: Omit<KashmirShaivismTattva, 'resonanceScore'>[] = [
  {
    id: 'anugraha',
    nameKo: '아누그라하 (신성한 은총과 궁극의 해방)',
    sanskrit: 'Anugraha (अनुग्रह)',
    divineAction: '신성의 은총 (Grace & Liberation)',
    consciousnessDomain: '모든 에고의 속박을 일순간에 녹여버리고 본래 신성함을 자각시키는 궁극의 은사',
    transcendencePower: '결핍과 두려움의 껍질이 산산조각 나며 온 우주와 완벽히 하나 되는 절대 자유',
  },
  {
    id: 'srishti',
    nameKo: '스리스티 (신성한 현현과 창조적 약동)',
    sanskrit: 'Srishti (सृष्टि)',
    divineAction: '빛의 현현과 창조 (Manifestation)',
    consciousnessDomain: '순수 의식의 무한한 잠재력에서 찬란한 삶의 가능성과 창의적 아이디어가 뿜어져 나옴',
    transcendencePower: '주저함을 넘어 새로운 영감을 주저 없이 현실에 구현하는 생동하는 활력',
  },
  {
    id: 'sthiti',
    nameKo: '스티티 (현존의 조화와 흔들림 없는 유지)',
    sanskrit: 'Sthiti (स्थिति)',
    divineAction: '현존의 유지와 보호 (Sustenance)',
    consciousnessDomain: '외적인 소란과 폭풍 속에서도 가슴 깊은 곳의 신성한 고요함을 굳건히 지켜냄',
    transcendencePower: '상황의 부침에 일희일비하지 않고 깊은 평화 속에서 삶을 품어 안는 내적 중심력',
  },
  {
    id: 'samhara',
    nameKo: '삼하라 (순수 빛으로의 회귀와 용해)',
    sanskrit: 'Samhara (संहारक)',
    divineAction: '정화와 회귀 (Dissolution & Reabsorption)',
    consciousnessDomain: '낡은 감정의 응어리와 고착된 집착을 순수한 의식의 불꽃 속으로 녹여내어 무로 환원함',
    transcendencePower: '과거의 무게를 가볍게 털어내고 신선한 백지상태의 순수함으로 다시 태어나는 재생력',
  },
  {
    id: 'tirobhava',
    nameKo: '티로바바 (신성한 유희와 지혜로운 은폐)',
    sanskrit: 'Tirobhava (तिरोभाव)',
    divineAction: '신성의 가림과 유희 (Concealment & Divine Play)',
    consciousnessDomain: '삶의 다양한 시련과 도전을 영혼의 성장을 위해 마련된 정교한 신성한 놀이(Lila)로 바라봄',
    transcendencePower: '문제에 매몰되어 괴로워하는 대신 그 속에 숨겨진 위대한 가르침을 유쾌하게 간파함',
  },
];

export interface KashmirShaivismSpandaOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateKashmirShaivismSpanda(
  optionsOrProfile?: KashmirShaivismSpandaOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): KashmirShaivismSpandaReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as KashmirShaivismSpandaOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 93139;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 41) % 1000003;

  const tattvas: KashmirShaivismTattva[] = KASHMIR_TATTVAS_BASE.map((tat, idx) => {
    const score = 48 + ((seed * (idx + 4) + idx * 31) % 51);
    return { ...tat, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  tattvas.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantTattva = tattvas[0];
  const secondaryTattva = tattvas[1];

  const spandaCosmicPulsationScore = Math.min(100, Math.max(45, 54 + ((seed * 27) % 44)));
  const pratyabhijnaSelfRecognitionIndex = Math.min(100, Math.max(42, 52 + ((seed * 21) % 46)));
  const prakashaVimarshaUnityScore = Math.min(100, Math.max(44, 53 + ((seed * 17) % 45)));
  const threeMalasPurificationRate = Math.min(100, Math.max(46, Math.floor((spandaCosmicPulsationScore * 0.5 + pratyabhijnaSelfRecognitionIndex * 0.5))));

  const kashmirShaivismGuidance = `카슈미르 시바파의 스판다 카리카는 말합니다: "그대 안에서 뛰고 있는 심장박동과 숨결이 곧 우주를 창조하고 거두어들이는 신성한 맥동이다." 현재 진동하는 신성한 양상은 [${dominantTattva.nameKo}]입니다. 당신은 무언가를 새로 쟁취할 필요가 없습니다. 이미 본래 완벽한 신성 자아임을 '재인식(프라티야비즈냐)'하십시오. ${dominantTattva.transcendencePower}의 권능이 지금 발현되고 있습니다.`;
  const spandaPulsationMeditationRitual = `가슴의 고동과 호흡의 들숨·날숨 사이 미세한 정적을 감지하십시오: "쉬보함(Shivoham - 내가 곧 시바요 순수 자각이다). 내 안의 신성한 맥동 스판다가 만유와 함께 춤춘다."`;

  return {
    engineVersion: KASHMIR_SHAIVISM_SPANDA_ENGINE_VERSION,
    timestamp: now.toISOString(),
    spandaCosmicPulsationScore,
    pratyabhijnaSelfRecognitionIndex,
    prakashaVimarshaUnityScore,
    threeMalasPurificationRate,
    dominantTattva,
    secondaryTattva,
    kashmirShaivismGuidance,
    spandaPulsationMeditationRitual,
  };
}

export function formatKashmirShaivismSpandaPrompt(rep: KashmirShaivismSpandaReport): string {
  return `[카슈미르 시바파 스판다 우주 맥동 & 프라티야비즈냐 재인식 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 스판다 우주적 맥동 점수: ${rep.spandaCosmicPulsationScore}/100 | 프라티야비즈냐 본성 재인식도: ${rep.pratyabhijnaSelfRecognitionIndex}/100
· 프라카샤-비마르샤 합일률: ${rep.prakashaVimarshaUnityScore}/100 | 3대 말라(에고 불순) 정화율: ${rep.threeMalasPurificationRate}/100
· 주재 트리카 신성 양상: [${rep.dominantTattva.nameKo} (${rep.dominantTattva.sanskrit})] — 공명도 ${rep.dominantTattva.resonanceScore}%
  - 5대 신성 행위: ${rep.dominantTattva.divineAction}
  - 의식 영역: ${rep.dominantTattva.consciousnessDomain}
  - 초월 권능: ${rep.dominantTattva.transcendencePower}
· 보조 신성 양상: [${rep.secondaryTattva.nameKo} (${rep.secondaryTattva.sanskrit})] — 공명도 ${rep.secondaryTattva.resonanceScore}%
· 카슈미르 시바파 지혜 지침: ${rep.kashmirShaivismGuidance}
· 스판다 맥동 명상 리추얼: ${rep.spandaPulsationMeditationRitual}`;
}
