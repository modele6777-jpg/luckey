/**
 * 고대 마야 포폴 부(Popol Vuh) 쌍둥이 영웅 & 시발바 지하세계 돌파 엔진 (Popol Vuh Hero Twins Engine)
 *
 * 마야 키체 신화의 정수인 포폴 부에서 쌍둥이 영웅 후나푸(Hunahpu)와 슈발랑케(Xbalanque)가
 * 지하세계 시발바(Xibalba)의 6대 죽음의 시련의 집을 기지와 트릭스터 지혜로 극복하고 태양과 달로 부활한 신화를
 * 현대인의 절체절명의 위기 탈출, 트릭스터적 유연성, 고난 역전 승리력에 연동합니다.
 */

export const MESOAMERICAN_POPOL_VUH_ENGINE_VERSION = 'LUCKEY-POPOL-VUH-HERO-TWINS-v1.0.0';

export interface PopolVuhReport {
  engineVersion: string;
  calculatedAt: string;
  activeTrialHouse: {
    houseNumber: number;
    houseNameKo: string;
    houseNameMaya: string;
    coreHazard: string;
    heroicCounterStrategy: string;
  };
  tricksterResilienceScore: number; // 0 ~ 100
  heroicTransformationVerdict: string;
  underworldVictoryRule: string;
}

const XIBALBA_HOUSES = [
  {
    houseNumber: 1,
    houseNameKo: '흑암의 집',
    houseNameMaya: 'Quequma-ha (Dark House)',
    coreHazard: '완전한 칠흑의 어둠 속에서 방향을 잃고 공포에 휩싸이는 시험',
    heroicCounterStrategy: '빛이 없는 곳에서도 반딧불이의 날개와 내면의 직관으로 길을 비추는 지혜',
  },
  {
    houseNumber: 2,
    houseNameKo: '면도날의 집',
    houseNameMaya: 'Chayim-ha (Razor House)',
    coreHazard: '사방에서 날아드는 날카로운 칼날과 공격적인 비난에 베이는 고통',
    heroicCounterStrategy: '날들과 대화하여 날을 무디게 만들고 적의 공격을 부드럽게 흘려보내는 유연성',
  },
  {
    houseNumber: 3,
    houseNameKo: '혹한의 집',
    houseNameMaya: 'Xuxulim-ha (Cold House)',
    coreHazard: '뼛속까지 얼어붙는 차가운 외로움과 고립감의 냉기',
    heroicCounterStrategy: '내면의 솔방울 불씨를 지피고 체온을 나누며 끝까지 생명력을 지키는 온기',
  },
  {
    houseNumber: 4,
    houseNameKo: '재규어의 집',
    houseNameMaya: 'Balami-ha (Jaguar House)',
    coreHazard: '으르렁거리는 맹수들의 굶주린 이빨과 공격적인 경쟁자들의 압박',
    heroicCounterStrategy: '고기 대신 뼈다귀를 던져 맹수들의 주의를 돌리고 우아하게 통과하는 기지',
  },
  {
    houseNumber: 5,
    houseNameKo: '화염의 집',
    houseNameMaya: 'Ratinche-ha (Fire House)',
    coreHazard: '에고를 활활 태워버리는 격렬한 분노와 타오르는 화염의 열기',
    heroicCounterStrategy: '불에 타지 않는 영혼의 무결성으로 불꽃을 통과하여 금을 제련하는 연금술',
  },
  {
    houseNumber: 6,
    houseNameKo: '박쥐의 집',
    houseNameMaya: 'Zotzi-ha (Bat House)',
    coreHazard: '죽음의 박쥐 카마소츠의 기습적인 목 베기와 무자비한 습격',
    heroicCounterStrategy: '바람총의 거북 등껍질 속에 몸을 숨겨 폭풍우를 견디고 동이 틀 때 태양으로 솟구치는 인내',
  },
];

export function calculatePopolVuhHeroTwins(params: {
  profile?: any;
  question?: string;
  now?: Date;
}): PopolVuhReport {
  const now = params.now || new Date();
  const basic = params.profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '1994-01-24';
  const question = params.question || '';

  let seed = 0;
  for (let i = 0; i < birthdateStr.length; i++) {
    seed += birthdateStr.charCodeAt(i) * (i + 19);
  }
  for (let i = 0; i < question.length; i++) {
    seed += question.charCodeAt(i) * 41;
  }
  seed += now.getDate() * 31 + now.getMonth() * 71;

  const houseIdx = Math.abs(seed) % XIBALBA_HOUSES.length;
  const activeTrialHouse = XIBALBA_HOUSES[houseIdx];

  const tricksterResilienceScore = 68 + (Math.abs(seed * 7) % 31);
  const heroicTransformationVerdict = '시발바의 시험을 딛고 하늘의 찬란한 태양과 달로 승천하는 영웅적 불사신';
  const underworldVictoryRule = `지금 마주한 압박이나 난관에 정면으로 부딪혀 상처 입지 마세요. '${activeTrialHouse.houseNameKo}'의 위험을 뛰어넘는 쌍둥이 영웅의 지혜('${activeTrialHouse.heroicCounterStrategy}')를 본받아, 유쾌한 기지와 유연한 역발상으로 국면을 완벽히 반전시키세요.`;

  return {
    engineVersion: MESOAMERICAN_POPOL_VUH_ENGINE_VERSION,
    calculatedAt: now.toISOString(),
    activeTrialHouse,
    tricksterResilienceScore,
    heroicTransformationVerdict,
    underworldVictoryRule,
  };
}

export function formatPopolVuhHeroTwinsPrompt(report: PopolVuhReport): string {
  const h = report.activeTrialHouse;
  return `### 🐆 고대 마야 포폴 부(Popol Vuh) 쌍둥이 영웅 & 시발바 시련 돌파 실측 데이터 (${report.engineVersion})
- **현재 돌파 중인 시련의 방**: 제${h.houseNumber}관문 - ${h.houseNameKo} (${h.houseNameMaya})
- **직면한 핵심 위기 요인**: ${h.coreHazard}
- **영웅들의 트릭스터 돌파 전략**: ${h.heroicCounterStrategy}
- **트릭스터 위기 역전력 지수**: ${report.tricksterResilienceScore}점 / 100점
- **영혼의 변모 판정**: ${report.heroicTransformationVerdict}
- **지하세계 탈출 행동 지침**: ${report.underworldVictoryRule}`;
}
