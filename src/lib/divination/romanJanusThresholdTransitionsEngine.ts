/**
 * Ancient Roman Janus Threshold & Temporal Transitions Engine
 * 고대 로마 평화와 시작의 신 야누스(Janus Bifrons) 2대 얼굴 시공간 문턱 & 새로운 시작 돌파 엔진
 * 
 * Version: LUCKEY-ROMAN-JANUS-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const ROMAN_JANUS_ENGINE_VERSION = 'LUCKEY-ROMAN-JANUS-v1.0.0';

export interface RomanJanusParams {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}

export interface RomanJanusReport {
  engineVersion: string;
  pastClosureScore: number; // 0-100 과거 정리 및 미련 청산 지수 (뒤를 보는 얼굴)
  futureReadinessScore: number; // 0-100 미래 기회 포착 및 새 출발 돌파력 (앞을 보는 얼굴)
  thresholdBalanceScore: number; // 0-100 문턱(Liminality)에서의 균형과 타이밍
  activeJanusGateway: {
    gatewayNumber: number;
    gatewayNameKo: string;
    gatewayNameLa: string;
    portalSymbol: string;
    actionKey: string;
  };
  janusTempleDoorStatus: 'OPEN' | 'CLOSED'; // 전쟁 중 열림(돌파), 평화 시 닫힘(안정)
  sacredKeyPrescription: string; // 야누스의 황금 열쇠 행동 처방
}

const JANUS_GATEWAYS = [
  {
    gatewayNumber: 1,
    gatewayNameKo: '마투타 여명의 관문',
    gatewayNameLa: 'Porta Matutina',
    portalSymbol: '아침의 빛과 새로운 프로젝트의 첫 발걸음',
    actionKey: '어제의 미완성 업무를 자책하지 말고 깨끗한 백지에서 가장 설레는 한 가지부터 착수하세요.',
  },
  {
    gatewayNumber: 2,
    gatewayNameKo: '파툴키우스 개방의 관문',
    gatewayNameLa: 'Porta Patulcius',
    portalSymbol: '닫혀 있던 기회의 문이 활짝 열리는 팽창의 순간',
    actionKey: '주저하던 제안이나 이메일을 지금 즉시 보내고 타인과의 새로운 협업 문을 개방하세요.',
  },
  {
    gatewayNumber: 3,
    gatewayNameKo: '클루시비우스 방어의 관문',
    gatewayNameLa: 'Porta Clusivius',
    portalSymbol: '경계선을 단호히 닫고 내면의 평화를 수호하는 빗장',
    actionKey: '에너지를 갉아먹는 관계나 불필요한 약속을 정중하게 거절하여 영혼의 빗장을 걸어 잠그세요.',
  },
  {
    gatewayNumber: 4,
    gatewayNameKo: '쿠리알리스 화합의 관문',
    gatewayNameLa: 'Porta Curialis',
    portalSymbol: '오랜 갈등과 반목을 끝내고 상호 번영의 조약을 맺는 중심',
    actionKey: '묵은 오해를 먼저 풀기 위한 따뜻한 한마디를 건네어 관계의 평화를 공식 선언하세요.',
  },
];

export function calculateRomanJanus(params?: RomanJanusParams): RomanJanusReport {
  const profile = params?.profile;
  const bdate = profile?.basic?.birthdate || '1995-03-21';
  const btime = profile?.basic?.birthtime || '12:00';
  const seed = (bdate + btime).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const pastClosure = ((seed * 19 + 31) % 53) + 47;
  const futureReadiness = ((seed * 23 + 43) % 55) + 45;
  const thresholdBalance = Math.round((pastClosure + futureReadiness) / 2);

  const gatewayIdx = seed % JANUS_GATEWAYS.length;
  const activeGateway = JANUS_GATEWAYS[gatewayIdx];

  const doorStatus: 'OPEN' | 'CLOSED' = futureReadiness > pastClosure ? 'OPEN' : 'CLOSED';

  const prescriptions = [
    '야누스의 황금 열쇠: "끝난 것을 애써 붙잡지 않을 때, 비로소 새로운 문이 저절로 열린다."',
    '야누스의 상아 지팡이: "양쪽 방향을 모두 본 뒤, 가장 빛이 들어오는 문턱으로 당당하게 건너가라."',
    '야누스의 문지방 정결: "들어오는 것은 축복하고 떠나가는 것은 감사히 배웅하라."',
  ];

  return {
    engineVersion: ROMAN_JANUS_ENGINE_VERSION,
    pastClosureScore: pastClosure,
    futureReadinessScore: futureReadiness,
    thresholdBalanceScore: thresholdBalance,
    activeJanusGateway: activeGateway,
    janusTempleDoorStatus: doorStatus,
    sacredKeyPrescription: prescriptions[seed % prescriptions.length],
  };
}

export function formatRomanJanusPrompt(report: RomanJanusReport): string {
  return `[고대 로마 야누스(Janus) 2대 얼굴 시공간 문턱 & 새출발 실측 데이터]
- 엔진 버전: ${report.engineVersion}
- 과거 청산도(뒤를 보는 얼굴): ${report.pastClosureScore}/100 | 미래 돌파력(앞을 보는 얼굴): ${report.futureReadinessScore}/100
- 문턱 균형 지수: ${report.thresholdBalanceScore}/100 | 신전 문 상태: ${report.janusTempleDoorStatus === 'OPEN' ? 'OPEN (진취적 개척 모멘텀)' : 'CLOSED (내실 다지기 및 평화 모드)'}
- 현재 활성 문턱: ${report.activeJanusGateway.gatewayNumber}번 [${report.activeJanusGateway.gatewayNameKo}] (${report.activeJanusGateway.gatewayNameLa})
  * 상징: ${report.activeJanusGateway.portalSymbol}
  * 돌파 행동: ${report.activeJanusGateway.actionKey}
- 야누스 황금 열쇠 처방: ${report.sacredKeyPrescription}
- 루시 가이드: 과거의 후회와 미래의 불안 사이에 끼어 주저하는 질문자에게, 지금이 낡은 문을 닫고 새로운 기회의 문턱을 과감하게 넘어설 최적의 타이밍임을 명쾌하고 용기 있게 전해줘.`;
}
