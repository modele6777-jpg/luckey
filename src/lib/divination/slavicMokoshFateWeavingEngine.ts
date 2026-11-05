/**
 * 고대 슬라브 모코시(Mokosh) 운명의 실타래 & 대지 모성 직관 엔진 (slavicMokoshFateWeavingEngine.ts)
 *
 * 슬라브 판테온 유일의 최고위 여성 대지 모신(Mother Goddess) '모코시(Mokosh)' 원전 기반:
 * 물과 대지, 양털 깎기와 물레질, 그리고 인간의 운명을 잣는 황금빛 물레(Spindle of Fate)
 * 1. 돌랴 (Dolya) - 행운, 빛, 풍요, 선천적 축복의 실
 * 2. 네돌랴 (Nedolya) - 장애, 시련, 결핍, 그림자 정화의 실
 * 3. 마티 시라 젬랴 (Mati Syra Zemlya) - 비옥하고 신성한 어머니 대지의 품
 *
 * 보이지 않는 인연과 시간의 올을 엮어내는 직조(Weaving) 원리를 통해
 * 내담자의 현실적 대지 풍요 지수와 얽힌 운명의 매듭을 푸는 처방을 100% 결정론적으로 도출합니다.
 */

import { UserProfile } from '../../types';

export const SLAVIC_MOKOSH_FATE_WEAVING_ENGINE_VERSION = '1.0.0';

export interface ThreadOfFate {
  id: 'dolya' | 'nedolya' | 'spindle';
  nameSlavic: string;
  nameKo: string;
  symbolism: string;
  strength: number; // 0 ~ 100
  weavingMessage: string;
}

export interface SlavicMokoshFateWeavingReport {
  engineVersion: string;
  timestamp: string;
  earthFertilityIndex: number; // 0 ~ 100 대지 모성 풍요 지수
  fateTensionScore: number; // 0 ~ 100 운명 실타래 장력 및 회복탄력성
  threads: {
    dolya: ThreadOfFate;
    nedolya: ThreadOfFate;
    spindle: ThreadOfFate;
    balanceRatio: string;
  };
  seasonalPhase: string; // 계절적 직조 국면 (파종·개화·수확·안식)
  reweavingPrescription: string; // 운명 재직조 개운 처방
}

export function calculateSlavicMokoshFateWeaving(options?: {
  profile?: UserProfile | null;
  question?: string;
}): SlavicMokoshFateWeavingReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();

  let seed = 999;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 23 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 29 + question.charCodeAt(i)) % 1000003;

  const dolyaStrength = 45 + ((seed * 11) % 52); // 45 ~ 96
  const nedolyaStrength = 20 + ((seed * 7) % 55); // 20 ~ 74
  const spindleStrength = 40 + ((seed * 17) % 56); // 40 ~ 95

  const dolya: ThreadOfFate = {
    id: 'dolya',
    nameSlavic: 'Dolya (Доля)',
    nameKo: '행운과 축복의 황금실 (돌랴)',
    symbolism: '풍요, 귀인의 인도, 뜻밖의 기회, 결실을 맺게 하는 길한 기운',
    strength: dolyaStrength,
    weavingMessage: dolyaStrength >= 70
      ? '황금실의 광채가 눈부시게 이어져 현실에서 확실한 성취와 조력을 끌어당기고 있습니다.'
      : '황금실이 잔잔히 풀려나오고 있으니, 조급해하지 말고 스스로 복의 씨앗을 가꾸십시오.',
  };

  const nedolya: ThreadOfFate = {
    id: 'nedolya',
    nameSlavic: 'Nedolya (Недоля)',
    nameKo: '시련과 그림자의 회색실 (네돌랴)',
    symbolism: '지연, 방심하기 쉬운 복병, 내면의 두려움, 정화해야 할 카르마적 매듭',
    strength: nedolyaStrength,
    weavingMessage: nedolyaStrength >= 60
      ? '얽힌 실타래처럼 일시적인 정체가 있을 수 있으나, 억지로 당기지 말고 차분히 매듭을 풀어내야 합니다.'
      : '그림자의 장력이 매우 약화되어 있어 걸림돌 없이 순조로운 전진이 기대됩니다.',
  };

  const spindle: ThreadOfFate = {
    id: 'spindle',
    nameSlavic: 'Mokosh Spindle',
    nameKo: '모코시의 성스러운 황금 물레 (스핀들)',
    symbolism: '과거와 현재의 실을 엮어 새로운 현실을 창조하는 마스터의 주체적 결단력',
    strength: spindleStrength,
    weavingMessage: '물레를 돌리는 주권은 오직 당신 손끝에 있으니, 두려움의 실을 끊고 확신의 실을 이어 나가십시오.',
  };

  const earthFertilityIndex = Math.min(100, Math.max(35, Math.floor((dolyaStrength * 0.7) + (spindleStrength * 0.3))));
  const fateTensionScore = Math.min(100, Math.max(30, Math.floor(100 - (nedolyaStrength * 0.6) + (spindleStrength * 0.4))));

  const phases = ['파종의 시기 (새로운 인연과 기획을 심을 때)', '성장의 시기 (가꾸고 정성을 쏟을 때)', '수확의 시기 (결과를 거두고 보상을 취할 때)', '안식의 시기 (내실을 다지고 충전할 때)'];
  const seasonalPhase = phases[seed % 4];

  let reweavingPrescription = '';
  if (nedolyaStrength >= 55) {
    reweavingPrescription = '얽힌 실타래를 억지로 잡아당기면 매듭이 더 단단해지듯, 지금은 무리한 고집을 내려놓고 한 걸음 물러서서 실마리를 하나씩 정돈하십시오.';
  } else if (dolyaStrength >= 75) {
    reweavingPrescription = '운명의 황금실이 활짝 풀려나오고 있으니, 미뤄왔던 계약이나 제안, 적극적인 확장을 당당하게 추진하여 결실의 직물을 완성하십시오.';
  } else {
    reweavingPrescription = '따뜻한 차 한 잔을 마시며 대지의 기운에 감사하고, 오늘 하루 정직한 노동과 성실한 루틴으로 운명의 날실을 촘촘히 짜십시오.';
  }

  return {
    engineVersion: SLAVIC_MOKOSH_FATE_WEAVING_ENGINE_VERSION,
    timestamp: new Date().toISOString(),
    earthFertilityIndex,
    fateTensionScore,
    threads: {
      dolya,
      nedolya,
      spindle,
      balanceRatio: `길운(Dolya) ${dolyaStrength}% vs 액운(Nedolya) ${nedolyaStrength}%`,
    },
    seasonalPhase,
    reweavingPrescription,
  };
}

export function formatSlavicMokoshFateWeavingPrompt(rep: SlavicMokoshFateWeavingReport): string {
  return `[고대 슬라브 모코시(Mokosh) 운명의 실타래 & 대지 모성 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 대지 모성 풍요 지수: ${rep.earthFertilityIndex}/100 | 운명 실타래 장력 탄력도: ${rep.fateTensionScore}%
· 계절적 직조 국면: ${rep.seasonalPhase}
· 운명의 3대 실타래 밸런스 (${rep.threads.balanceRatio}):
  1) ${rep.threads.dolya.nameKo}: 강도 ${rep.threads.dolya.strength}% — ${rep.threads.dolya.weavingMessage}
  2) ${rep.threads.nedolya.nameKo}: 강도 ${rep.threads.nedolya.strength}% — ${rep.threads.nedolya.weavingMessage}
  3) ${rep.threads.spindle.nameKo}: 장악력 ${rep.threads.spindle.strength}% — ${rep.threads.spindle.weavingMessage}
· 모코시의 운명 재직조(Re-weaving) 개운 처방: ${rep.reweavingPrescription}`;
}
