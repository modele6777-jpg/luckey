/**
 * 고대 마오리 하우오라 4대 기둥 & 마우리(Mauri) 생명력 영혼 수호 엔진 (maoriMauriHauoraEngine.ts)
 *
 * 뉴질랜드 정통 마오리(Māori) 웰빙 및 영혼 철학 '테 화레 타파 화(Te Whare Tapa Whā)' 원전 기반:
 * 집(Whare)을 지탱하는 네 개의 벽처럼 인간의 전인적 삶을 지탱하는 4대 하우오라(Hauora) 기둥
 * 1. 타하 티나나 (Taha Tinana) - 신체적 활력과 물질적 건강
 * 2. 타하 히넹가로 (Taha Hinengaro) - 정신적 명료함과 감정의 조율
 * 3. 타하 화나우 (Taha Whānau) - 가족, 혈통, 인간관계의 유대감
 * 4. 타하 와이루아 (Taha Wairua) - 영혼의 정체성과 우주적 연결감
 *
 * 생명의 본질적 불꽃 '마우리(Mauri)'와 영적 권능 '마나(Mana)'를 산출하여
 * 내담자의 현실적 생명력 지수와 대지 수호(Kaitiakitanga) 처방을 100% 결정론적으로 도출합니다.
 */

import { UserProfile } from '../../types';

export const MAORI_MAURI_HAUORA_ENGINE_VERSION = '1.0.0';

export interface HauoraPillar {
  id: 'taha_tinana' | 'taha_hinengaro' | 'taha_whanau' | 'taha_wairua';
  nameMaori: string;
  nameKo: string;
  domain: string;
  vitalityScore: number; // 0 ~ 100
  status: '강인함' | '조화로움' | '보살핌 필요';
  counsel: string;
}

export interface MaoriMauriHauoraReport {
  engineVersion: string;
  timestamp: string;
  mauriVitalityIndex: number; // 0 ~ 100 마우리(생명 에너지 불꽃) 지수
  manaSovereigntyScore: number; // 0 ~ 100 마나(영적 위엄 및 현실 권능) 지수
  pillars: {
    tahaTinana: HauoraPillar;
    tahaHinengaro: HauoraPillar;
    tahaWhanau: HauoraPillar;
    tahaWairua: HauoraPillar;
    dominantPillar: HauoraPillar;
    vulnerablePillar: HauoraPillar;
  };
  kaitiakitangaPrescription: string; // 대지 수호 및 관계 회복 실천 처방
}

export function calculateMaoriMauriHauora(options?: {
  profile?: UserProfile | null;
  question?: string;
}): MaoriMauriHauoraReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();

  let seed = 888;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 23 + question.charCodeAt(i)) % 1000003;

  const tinanaScore = 40 + ((seed * 7) % 58);
  const hinengaroScore = 40 + ((seed * 11) % 58);
  const whanauScore = 40 + ((seed * 17) % 58);
  const wairuaScore = 40 + ((seed * 29) % 58);

  const getStatus = (score: number): '강인함' | '조화로움' | '보살핌 필요' => {
    if (score >= 80) return '강인함';
    if (score >= 60) return '조화로움';
    return '보살핌 필요';
  };

  const tahaTinana: HauoraPillar = {
    id: 'taha_tinana',
    nameMaori: 'Taha Tinana',
    nameKo: '육체적 기둥 (몸과 물질)',
    domain: '체력, 수면, 식습관, 현실적 안정감',
    vitalityScore: tinanaScore,
    status: getStatus(tinanaScore),
    counsel: tinanaScore >= 70 ? '신체적 에너지가 충만하여 적극적인 행동과 목표 실행에 최적입니다.' : '과로를 멈추고 몸의 피로 신호에 귀를 기울이며 수면과 휴식을 우선 보충하십시오.',
  };

  const tahaHinengaro: HauoraPillar = {
    id: 'taha_hinengaro',
    nameMaori: 'Taha Hinengaro',
    nameKo: '정신·감정적 기둥 (마음과 생각)',
    domain: '명료한 사고, 감정 표현, 내면의 평정',
    vitalityScore: hinengaroScore,
    status: getStatus(hinengaroScore),
    counsel: hinengaroScore >= 70 ? '직관과 지적 분별력이 명쾌하여 복잡한 결정을 내리기에 유리합니다.' : '머릿속 생각의 과부하를 털어내기 위해 감정을 억누르지 말고 솔직하게 기록하거나 환기하십시오.',
  };

  const tahaWhanau: HauoraPillar = {
    id: 'taha_whanau',
    nameMaori: 'Taha Whānau',
    nameKo: '관계·가족적 기둥 (사회적 유대)',
    domain: '가족, 동료, 소속감, 상호 신뢰',
    vitalityScore: whanauScore,
    status: getStatus(whanauScore),
    counsel: whanauScore >= 70 ? '주변인들의 든든한 지지와 상호 신뢰가 성취를 강력하게 밀어주고 있습니다.' : '고립감을 경계하고, 진심으로 자신을 믿어주는 사람들과 따뜻한 교감을 먼저 나누십시오.',
  };

  const tahaWairua: HauoraPillar = {
    id: 'taha_wairua',
    nameMaori: 'Taha Wairua',
    nameKo: '영적 기둥 (영혼과 사명)',
    domain: '삶의 목적의식, 가치관, 우주적 연결',
    vitalityScore: wairuaScore,
    status: getStatus(wairuaScore),
    counsel: wairuaScore >= 70 ? '영혼의 사명감이 뚜렷하여 어떤 외부 풍파에도 흔들리지 않는 신념을 품고 있습니다.' : '일상의 잡음에 가려진 삶의 진정한 의미를 되새기고 자연 속에서 영적 호흡을 되찾으십시오.',
  };

  const allPillars = [tahaTinana, tahaHinengaro, tahaWhanau, tahaWairua];
  const dominantPillar = [...allPillars].sort((a, b) => b.vitalityScore - a.vitalityScore)[0];
  const vulnerablePillar = [...allPillars].sort((a, b) => a.vitalityScore - b.vitalityScore)[0];

  const mauriVitalityIndex = Math.min(100, Math.max(30, Math.floor((tinanaScore + hinengaroScore + whanauScore + wairuaScore) / 4)));
  const manaSovereigntyScore = Math.min(100, Math.max(35, Math.floor((dominantPillar.vitalityScore * 0.6) + (mauriVitalityIndex * 0.4))));

  let kaitiakitangaPrescription = '';
  if (vulnerablePillar.id === 'taha_tinana') {
    kaitiakitangaPrescription = '오늘 하루는 대지를 맨발로 딛거나 20분간 산책하며 굳어 있던 근육을 깨우고 깨끗한 물을 충분히 섭취하여 몸의 마우리(생명력)를 회복하세요.';
  } else if (vulnerablePillar.id === 'taha_hinengaro') {
    kaitiakitangaPrescription = '디지털 기기를 1시간 동안 끄고 마음속 혼란스러운 생각들을 흰 종이에 쏟아내어 감정의 호수를 맑게 정돈하십시오.';
  } else if (vulnerablePillar.id === 'taha_whanau') {
    kaitiakitangaPrescription = '가장 편안한 가족이나 신뢰하는 지인에게 따뜻한 안부 한마디를 건네며 관계의 벽을 부드럽게 보강하세요.';
  } else {
    kaitiakitangaPrescription = '밤하늘의 별을 바라보며 깊은 호흡으로 자신이 우주 전체와 긴밀히 연결되어 있음을 묵상하고 영혼의 평화를 확언하십시오.';
  }

  return {
    engineVersion: MAORI_MAURI_HAUORA_ENGINE_VERSION,
    timestamp: new Date().toISOString(),
    mauriVitalityIndex,
    manaSovereigntyScore,
    pillars: {
      tahaTinana,
      tahaHinengaro,
      tahaWhanau,
      tahaWairua,
      dominantPillar,
      vulnerablePillar,
    },
    kaitiakitangaPrescription,
  };
}

export function formatMaoriMauriHauoraPrompt(rep: MaoriMauriHauoraReport): string {
  return `[고대 마오리 하우오라 4대 기둥 & 마우리(Mauri) 생명력 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 마우리(Mauri 생명 불꽃) 지수: ${rep.mauriVitalityIndex}/100 | 마나(Mana 영적 위엄) 주권도: ${rep.manaSovereigntyScore}%
· 테 화레 타파 화(Te Whare Tapa Whā) 4대 웰빙 기둥:
  1) 육체적 기둥 (Taha Tinana): ${rep.pillars.tahaTinana.vitalityScore}% [${rep.pillars.tahaTinana.status}] — ${rep.pillars.tahaTinana.counsel}
  2) 정신·감정적 기둥 (Taha Hinengaro): ${rep.pillars.tahaHinengaro.vitalityScore}% [${rep.pillars.tahaHinengaro.status}] — ${rep.pillars.tahaHinengaro.counsel}
  3) 관계·가족적 기둥 (Taha Whānau): ${rep.pillars.tahaWhanau.vitalityScore}% [${rep.pillars.tahaWhanau.status}] — ${rep.pillars.tahaWhanau.counsel}
  4) 영적 기둥 (Taha Wairua): ${rep.pillars.tahaWairua.vitalityScore}% [${rep.pillars.tahaWairua.status}] — ${rep.pillars.tahaWairua.counsel}
· 핵심 강점 기둥: ${rep.pillars.dominantPillar.nameKo} (${rep.pillars.dominantPillar.nameMaori}) — ${rep.pillars.dominantPillar.vitalityScore}%
· 우선 보살핌 기둥: ${rep.pillars.vulnerablePillar.nameKo} (${rep.pillars.vulnerablePillar.nameMaori}) — ${rep.pillars.vulnerablePillar.vitalityScore}%
· 카이티아키탕가(Kaitiakitanga) 전인적 회복 처방: ${rep.kaitiakitangaPrescription}`;
}
