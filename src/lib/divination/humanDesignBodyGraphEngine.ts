/**
 * =========================================================================
 * LUCKEY 휴먼 디자인 9대 에너지 센터 & 바디그래프 오라 엔진 (Human Design BodyGraph Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 동양의 주역(I Ching 64괘), 카발라 생명나무, 차크라 시스템, 양자물리학 뉴트리노 흐름을 통합한
 * '휴먼 디자인(Human Design)' 시스템을 사주 4주 8자 십신 및 수리 역학에 결합한 엔진입니다.
 * 
 * 1. 4대 에너지 타입(Type & Aura): 제너레이터(천골 동력), 프로젝터(가이드 혜안), 매니페스터(개척자), 리플렉터(우주 거울)
 * 2. 9대 에너지 센터(Energy Centers): 두뇌(Head), 아즈나(Ajna), 목(Throat), 자아(G-Center), 
 *    심장/에고(Heart), 천골(Sacral), 태양신경총(Solar Plexus), 비장(Spleen), 뿌리(Root)
 *    각 센터의 정의(Defined: 고유 파동) vs 미정의/열림(Undefined: 외부 에너지 증폭 및 탈조건화 영역) 분석
 * 3. 내적 결정 권위(Inner Authority) 및 전략(Strategy): 머리가 아닌 몸의 고유 진동으로 선택하는 무패의 의사결정 나침반
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const HUMAN_DESIGN_BODYGRAPH_VERSION = 'LUCKEY-HUMANDESIGN-v1.0.0';

export type HumanDesignType = 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';

export interface CenterState {
  name: string;
  isDefined: boolean; // 정의(Defined: 일관된 에너지 방출) vs 미정의(Undefined: 감응 및 학습의 창)
  theme: string;
  wisdomInsight: string;
}

export interface HumanDesignBodyGraphReport {
  engineVersion: string;
  calculatedAt: string;
  designType: {
    type: HumanDesignType;
    koreanLabel: string;
    auraQuality: string;
    signatureEmotion: string; // 서명 감정 (평화, 만족, 성공, 놀라움)
    notSelfTheme: string;     // 비자아 주제 (분노, 좌절, 비통, 실망)
  };
  strategy: string;           // 삶의 전략 (반응하기, 초대 기다리기, 알리기, 음력 주기 기다리기)
  innerAuthority: string;     // 내적 결정 권위 (감정, 천골, 비장, 에고, 자아 투영, 멘탈/환경)
  definitionProfile: string;  // 프로파일 (예: 1/3 탐구자·실험가, 2/4 은둔자·네트워커 등)
  centers: Record<string, CenterState>;
  deconditioningAdvice: string; // 타인의 기대를 털어내고 본연의 에너지를 회복하는 탈조건화 행동 지침
  synthesisPromptGuidance: string;
}

export function runHumanDesignBodyGraphEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): HumanDesignBodyGraphReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 시드 수리 연산
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const seed = (ganCode * 7 + (targetDate.getMonth() + 1) * 13 + targetDate.getDate() * 19) % 100;

  // 1. 오행 및 지지 기운에 따른 4대 타입 및 오라 결정론적 분류
  let designType: HumanDesignBodyGraphReport['designType'];
  let strategy: string;
  let innerAuthority: string;

  if (element === '목') {
    // 진취적 생명력 -> 매니페스터 (Manifestor)
    designType = {
      type: 'Manifestor',
      koreanLabel: '매니페스터 (최초의 길을 여는 독보적 개척자)',
      auraQuality: '닫혀 있고 방어적이지만 강렬하게 공간을 장악하는 주도적 오라',
      signatureEmotion: '평화 (Peace - 자유롭게 시작할 때 오는 고요)',
      notSelfTheme: '분노 (Anger - 통제당하거나 가로막힐 때)'
    };
    strategy = '행동하기 전에 주변 사람들에게 명확히 먼저 알리기(Inform)';
    innerAuthority = '비장 직관 권위 (순간적인 동물적 육감과 번개 같은 촉)';
  } else if (element === '화') {
    // 폭발적 추진력 & 다재다능 -> 매니페스팅 제너레이터 (Manifesting Generator)
    designType = {
      type: 'Manifesting Generator',
      koreanLabel: '매니페스팅 제너레이터 (초고속 멀티태스킹 혁신가)',
      auraQuality: '개방적이고 끌어당기며 전광석화처럼 추진하는 역동적 오라',
      signatureEmotion: '만족과 성취 (Satisfaction & Thrill)',
      notSelfTheme: '좌절과 조급함 (Frustration & Impatience)'
    };
    strategy = '세상의 기회에 천골로 즉각 반응(Respond)한 뒤 비전을 공유하기';
    innerAuthority = '감정/태양신경총 권위 (감정의 파도가 가라앉은 후 맑은 clarity에서 결정)';
  } else if (element === '토') {
    // 끈기와 시스템 동력 -> 클래식 제너레이터 (Generator)
    designType = {
      type: 'Generator',
      koreanLabel: '제너레이터 (지치지 않는 우주 생명력의 마스터 빌더)',
      auraQuality: '주변 모든 기회와 사람을 자석처럼 끌어당기는 포근하고 거대한 오라',
      signatureEmotion: '깊은 충만과 만족 (Deep Satisfaction)',
      notSelfTheme: '좌절감과 무기력 (Frustration)'
    };
    strategy = '스스로 억지로 일을 벌이지 않고, 들어오는 제안에 배꼽 아래 천골 소리로 반응하기';
    innerAuthority = '천골(Sacral) 소리 권위 (즉각적인 몸의 흥분/울림 "응!" vs "싫어")';
  } else if (element === '금') {
    // 냉철한 통찰과 가이드 -> 프로젝터 (Projector)
    designType = {
      type: 'Projector',
      koreanLabel: '프로젝터 (타인의 에너지를 꿰뚫어보고 이끄는 현명한 가이드)',
      auraQuality: '상대방의 핵심 코어에 집중하여 초점을 맞추는 날카로운 레이저 오라',
      signatureEmotion: '성공과 인정 (Success - 올바른 사람에게 귀하게 쓰일 때)',
      notSelfTheme: '비통함과 억울함 (Bitterness - 인정받지 못하고 에너지를 낭비할 때)'
    };
    strategy = '에너지를 아끼며 자신의 마스터리를 갈고닦고, 진정한 초대를 기다리기(Wait for the Invitation)';
    innerAuthority = '자아 투영/G-Center 권위 (신뢰할 수 있는 사람과 대화하며 자신의 목소리를 듣고 깨닫기)';
  } else {
    // 수 (Water) -> 리플렉터 / 지혜로운 프로젝터 성향
    designType = {
      type: 'Reflector',
      koreanLabel: '리플렉터 (환경과 시대의 흐름을 비추는 영롱한 우주의 거울)',
      auraQuality: '주변 환경의 에너지를 맛보고 정화하며 그대로 비추는 투명한 오라',
      signatureEmotion: '놀라움과 경이 (Surprise - 우주의 완벽한 조화를 목격할 때)',
      notSelfTheme: '실망 (Disappointment - 무겁고 탁한 환경에 갇힐 때)'
    };
    strategy = '중대한 결정 시 달이 64괘를 한 바퀴 도는 음력 28일 주기를 충분히 기다리기';
    innerAuthority = '달 주기 권위 (Lunar Cycle - 시간을 들여 다양한 각도에서 비춰보고 결정)';
  }

  // 2. 프로파일 (Profile) 산출
  const profiles = [
    '1/3 (탐구자 / 실험가: 탄탄한 지식의 토대 위에 시행착오로 완성하는 실전가)',
    '2/4 (은둔자 / 기회주의자: 혼자만의 천재성을 기르다 지인의 결정적 초대로 세상에 나섬)',
    '3/5 (실험가 / 이단아: 실패를 두려워하지 않는 현장 검증으로 혁신적 솔루션을 전파함)',
    '4/6 (네트워커 / 롤모델: 신뢰의 공동체를 묶어내고 인생 후반부 지혜로운 멘토로 우뚝 섬)',
    '5/1 (이단아 / 탐구자: 위기 상황의 구원투수이자 실용적 해결책을 제시하는 카리스마)',
    '6/2 (롤모델 / 은둔자: 높은 고결함의 기준을 지키며 멀리서 세상을 관조하는 현자)'
  ];
  const definitionProfile = profiles[seed % profiles.length];

  // 3. 9대 에너지 센터 정의(Defined) vs 미정의(Undefined) 매핑
  const isHeadDefined = ((ganCode + 1) % 3) === 0;
  const isAjnaDefined = ((ganCode + 2) % 2) === 0;
  const isThroatDefined = true; // 소통 및 실행의 목 센터
  const isGDefined = element === '목' || element === '토';
  const isHeartDefined = element === '금' || element === '화';
  const isSacralDefined = designType.type.includes('Generator');
  const isSolarDefined = element === '화' || element === '수';
  const isSpleenDefined = element === '금' || element === '목';
  const isRootDefined = ((ganCode + 5) % 2) === 0;

  const centers: Record<string, CenterState> = {
    head: {
      name: '두뇌 센터 (Head - 영감과 질문)',
      isDefined: isHeadDefined,
      theme: isHeadDefined ? '자기만의 독창적 영감과 의문' : '외부의 수많은 생각과 의문을 흡수하는 안테나',
      wisdomInsight: isHeadDefined 
        ? '내부에서 솟아나는 영감을 세상의 언어로 번역하는 작업에 집중하세요.'
        : '떠오르는 모든 생각이 내 문제가 아닙니다. 타인의 고민에 에너지를 낭비하지 마세요.'
    },
    ajna: {
      name: '아즈나 센터 (Ajna - 개념화와 사고 처리)',
      isDefined: isAjnaDefined,
      theme: isAjnaDefined ? '확고한 관점과 일관된 논리 프레임워크' : '유연한 사고와 다각도 통찰력',
      wisdomInsight: isAjnaDefined
        ? '논리적 확실성을 무기로 쓰되, 타인의 유연한 견해를 포용할 때 영향력이 커집니다.'
        : '한 가지 고정관념에 얽매이지 않고, 세상의 다양한 아이디어를 비교 평가하는 혜안을 발휘하세요.'
    },
    throat: {
      name: '목 센터 (Throat - 발현과 현실 창조)',
      isDefined: isThroatDefined,
      theme: '생각과 에너지를 물리적 현실 및 행동으로 구현하는 허브',
      wisdomInsight: '내 말이 곧 현실이 됩니다. 타이밍에 맞춰 진실된 목소리를 낼 때 세상이 반응합니다.'
    },
    gCenter: {
      name: '자아 센터 (G-Center - 정체성과 사랑, 방향성)',
      isDefined: isGDefined,
      theme: isGDefined ? '확고한 나다움과 흔들리지 않는 인생의 나침반' : '어디서든 환경과 사람에 맞게 융합하는 카멜레온',
      wisdomInsight: isGDefined
        ? '남들이 뭐라 하든 내가 느끼는 내면의 올바른 길을 우직하게 걸어가면 됩니다.'
        : '내가 누구인지 억지로 규정하지 마세요. 올바른 장소에 머물면 올바른 인연과 기회가 절로 찾아옵니다.'
    },
    heart: {
      name: '심장/에고 센터 (Heart/Ego - 의지력과 자존감)',
      isDefined: isHeartDefined,
      theme: isHeartDefined ? '강철 같은 의지력과 약속 이행 파워' : '증명할 필요가 없는 자유로운 자존감',
      wisdomInsight: isHeartDefined
        ? '의지력을 가치 있는 일에 아껴 쓰고, 반드시 충분한 휴식을 통해 심장을 충전하세요.'
        : '남들에게 내 가치를 증명하려고 무리한 약속을 남발하지 마세요. 당신은 존재 자체로 온전합니다.'
    },
    sacral: {
      name: '천골 센터 (Sacral - 생명력과 지속적 노동력)',
      isDefined: isSacralDefined,
      theme: isSacralDefined ? '마르지 않는 창조적 실행 에너지의 발전기' : '지속 노동 대신 스마트한 시스템으로 지휘하는 혜안',
      wisdomInsight: isSacralDefined
        ? '사랑하는 일에 온몸의 에너지를 쏟아붓고 기분 좋게 곯아떨어질 때 최고의 잠재력이 폭발합니다.'
        : '남들처럼 밤샘 야근을 견디려 하지 마세요. 짧게 집중하고 위임하는 시스템 레버리지가 정답입니다.'
    },
    solarPlexus: {
      name: '태양신경총 센터 (Solar Plexus - 감정과 파동)',
      isDefined: isSolarDefined,
      theme: isSolarDefined ? '오르내리는 감정의 파도를 타는 깊은 감수성' : '타인의 감정을 있는 그대로 비추는 투명한 공감 거울',
      wisdomInsight: isSolarDefined
        ? '기분이 좋을 때 성급히 약속하지 말고, 우울할 때 비관하지 마세요. 감정 파도가 잔잔해질 때까지 기다리세요.'
        : '주변의 불안과 분노를 내 것으로 착각하지 마세요. 쿨하게 관찰하고 물리적 거리를 두는 연습이 핵심입니다.'
    },
    spleen: {
      name: '비장 센터 (Spleen - 신체 직관과 생존 면역)',
      isDefined: isSpleenDefined,
      theme: isSpleenDefined ? '즉각적이고 정확한 동물적 육감과 면역력' : '미세한 위험과 건강 상태를 기민하게 감지하는 촉',
      wisdomInsight: isSpleenDefined
        ? '순간적으로 "쎄하다"고 느껴지는 감각을 100% 신뢰하세요. 비장의 속삭임은 단 한 번만 울립니다.'
        : '나에게 더 이상 이롭지 않은 낡은 습관이나 사람을 두려움 때문에 붙잡고 있지 마세요. 과감히 놓아주어야 합니다.'
    },
    root: {
      name: '뿌리 센터 (Root - 아드레날린과 스트레스 압박)',
      isDefined: isRootDefined,
      theme: isRootDefined ? '마감 압박을 에너지로 전환하는 스트레스 내성' : '외부의 분주함과 조급함에 휩쓸리기 쉬운 민감함',
      wisdomInsight: isRootDefined
        ? '스트레스의 불꽃을 창의적 엔진으로 점화하되, 주변 사람에게 조급함을 강요하지 마세요.'
        : '남들의 조급함에 떠밀려 헐레벌떡 뛰지 마세요. 내 페이스대로 천천히 호흡할 때 실수가 사라집니다.'
    }
  };

  const deconditioningAdvice = `${designType.koreanLabel} 유형인 당신의 핵심 탈조건화 과제는 [${designType.notSelfTheme}]의 늪에서 벗어나는 것입니다. 머리로 따져서 억지로 계획을 짜지 말고, 오직 [${strategy}]의 원칙과 [${innerAuthority}]에 따라 몸이 보내는 신호에 맡길 때 자연스러운 [${designType.signatureEmotion}]의 흐름으로 복귀합니다.`;

  const synthesisPromptGuidance = `[LUCKEY 휴먼 디자인 9대 에너지 센터 & 바디그래프 오라 v1.0.0]
- 에너지 타입: ${designType.koreanLabel} (서명: ${designType.signatureEmotion} | 비자아: ${designType.notSelfTheme})
- 오라 특성: ${designType.auraQuality}
- 인생 전략(Strategy): ${strategy}
- 내적 결정 권위(Inner Authority): ${innerAuthority}
- 프로파일: ${definitionProfile}
- 9대 센터 핵심 상태:
  * 천골(Sacral): ${isSacralDefined ? '정의(Defined - 지속적 생명력 발전소)' : '미정의(Undefined - 위임과 효율 중심)'}
  * 태양신경총(Solar Plexus): ${isSolarDefined ? '정의(Defined - 감정 파도 통과 후 결정)' : '미정의(Undefined - 타인 감정 필터링 필요)'}
  * 비장(Spleen): ${isSpleenDefined ? '정의(Defined - 찰나의 순간 직관 신뢰)' : '미정의(Undefined - 미련 버리기 훈련)'}
  * 심장/에고(Heart): ${isHeartDefined ? '정의(Defined - 강철 의지력)' : '미정의(Undefined - 가치 증명 강박 탈피)'}
- 탈조건화(De-conditioning) 행동 처방: ${deconditioningAdvice}`;

  return {
    engineVersion: HUMAN_DESIGN_BODYGRAPH_VERSION,
    calculatedAt: targetDate.toISOString(),
    designType,
    strategy,
    innerAuthority,
    definitionProfile,
    centers,
    deconditioningAdvice,
    synthesisPromptGuidance
  };
}

export type HumanDesignBodyGraphResult = HumanDesignBodyGraphReport;

export function calculateHumanDesignBodyGraph(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): HumanDesignBodyGraphResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runHumanDesignBodyGraphEngine(profile, targetDate);
}

export function formatHumanDesignBodyGraphPrompt(res: HumanDesignBodyGraphResult): string {
  return res.synthesisPromptGuidance;
}
