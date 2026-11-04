/**
 * =========================================================================
 * LUCKEY 타로 카발라 생명나무 22경로 & 섀도우 미러 심층 엔진
 * (Tarot Tree of Life 22-Paths & Shadow Mirror Esoteric Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 서양 밀교(Hermetic Esotericism)의 카발라 생명나무(Tree of Life) 10대 세피로트를 잇는
 * 22개의 신성한 상승 경로(Paths 11~32)와 타로 22대 메이저 아르카나를 1:1로 결합하고,
 * 칼 융의 그림자 원형을 바탕으로 의식의 맹점(Blind Spot)을 영혼의 황금으로 변환하는
 * 결정론적 심층 타로 비의(Esoteric Tarot) 엔진입니다.
 * 
 * 1. 생명나무 22개 상승 경로(Tree of Life Path of Ascension) 및 영혼의 입문 관문
 * 2. 빛의 아르카나 vs 섀도우 미러(Shadow Mirror) 무의식 맹점 판별
 * 3. 그림자 변환의 열쇠(Transmutation Key) 및 180초 섀도우 통합 리추얼
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const TAROT_KABBALAH_SHADOW_VERSION = 'LUCKEY-TAROT-KABBALAH-SHADOW-v1.0.0';

export interface TreeOfLifePathMapping {
  pathNumber: number;            // 경로 번호 (11 ~ 32)
  connectingSephiroth: string;   // 연결하는 세피로트 (예: 말쿠트 <-> 예소드)
  majorCardNumber: number;       // 메이저 카드 번호 (0 ~ 21)
  majorCardName: string;         // 메이저 카드 명칭
  hebrewLetter: string;          // 히브리 문자 상징 (Aleph, Beth, Gimel 등)
  spiritualGatewayTheme: string; // 영혼의 입문 관문 테마
}

export interface TarotShadowMirrorAnalysis {
  consciousLightCard: string;    // 의식에서 빛나고 있는 카드
  shadowBlindSpotCard: string;   // 무의식이 억압하고 있는 그림자 맹점 카드
  blindSpotDefenseMechanism: string; // 무의식적 방어기제
  transmutedSuperpower: string;  // 그림자를 직면했을 때 해방되는 잠재 초능력
  shadowIntegrationRitual: string; // 180초 섀도우 통합 리추얼
}

export interface TarotTreeOfLifeShadowReport {
  engineVersion: string;
  calculatedAt: string;
  tarotEsotericTitle: string;
  ascensionPath: TreeOfLifePathMapping;
  shadowMirror: TarotShadowMirrorAnalysis;
  soulHermeticAffirmation: string;
  synthesisPromptGuidance: string;
}

export const TREE_OF_LIFE_PATHS: Record<number, {
  connecting: string;
  majorCard: number;
  cardName: string;
  hebrew: string;
  gateway: string;
}> = {
  11: { connecting: '케테르(왕관) <-> 호크마(지혜)', majorCard: 0, cardName: '바보 (The Fool)', hebrew: 'Aleph (황소/바람)', gateway: '순수한 무(無)에서 무한한 가능성의 시공간으로 대담하게 도약하는 첫 관문' },
  12: { connecting: '케테르(왕관) <-> 비나(이해)', majorCard: 1, cardName: '마법사 (The Magician)', hebrew: 'Beth (집/수성)', gateway: '천상의 신성한 뜻을 지상의 4원소 도구로 완벽하게 물질화하는 창조의 관문' },
  13: { connecting: '케테르(왕관) <-> 티페레트(아름다움)', majorCard: 2, cardName: '여사제 (The High Priestess)', hebrew: 'Gimel (낙타/달)', gateway: '환영의 베일을 젖히고 신성한 직관과 영원한 아카식 도서관으로 향하는 지혜의 관문' },
  14: { connecting: '호크마(지혜) <-> 비나(이해)', majorCard: 3, cardName: '여황제 (The Empress)', hebrew: 'Daleth (문/금성)', gateway: '우주의 사랑과 풍요가 만물을 잉태하고 아름다운 결실을 맺는 생명의 관문' },
  15: { connecting: '호크마(지혜) <-> 티페레트(아름다움)', majorCard: 4, cardName: '황제 (The Emperor)', hebrew: 'Heh (창/백양자리)', gateway: '신성한 질서와 구조를 세워 혼돈을 다스리고 흔들림 없는 왕국을 구축하는 주권의 관문' },
  25: { connecting: '예소드(기초) <-> 티페레트(아름다움)', majorCard: 14, cardName: '절제 (Temperance)', hebrew: 'Samekh (버팀목/사수자리)', gateway: '물과 불의 상극 에너지를 황금빛 생명수로 승화시키는 영혼의 연금술 관문' },
  32: { connecting: '말쿠트(물질왕국) <-> 예소드(달의 무의식)', majorCard: 21, cardName: '세계 (The World)', hebrew: 'Tav (표식/토성)', gateway: '물질 세계의 한계를 깨고 춤추는 영혼으로 다시 태어나는 대통합의 관문' }
};

export function runTarotTreeOfLifeShadowEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): TarotTreeOfLifeShadowReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayGan = sajuRes?.pillars?.day?.gan || '경';
  const dayZhi = sajuRes?.pillars?.day?.zhi || '신';

  const code = dayGan.charCodeAt(0) + dayZhi.charCodeAt(0) + targetDate.getDate() + targetDate.getMonth();
  const availablePaths = [11, 12, 13, 14, 15, 25, 32];
  const selectedPathNum = availablePaths[code % availablePaths.length];
  const pathInfo = TREE_OF_LIFE_PATHS[selectedPathNum] || TREE_OF_LIFE_PATHS[32];

  // 섀도우 미러 카드 도출 (상보적 반대편 축)
  const shadowCardNum = (pathInfo.majorCard + 11) % 22;
  const shadowCardMap: Record<number, { name: string; defense: string; superpower: string; ritual: string }> = {
    11: { name: '정의 (Justice)', defense: '완벽주의와 타인에 대한 냉혹한 잣대로 상처받지 않으려는 방어', defenseMechanism: '지적 합리화와 감정 차단', superpower: '어떤 혼란 속에서도 객관적 진실과 균형을 꿰뚫어 보는 절대 분별력', ritual: '마음속 법정에 세워둔 타인과 자신을 향해 "모든 것은 제자리에 있다"고 선언하기' },
    12: { name: '매달린 사람 (The Hanged Man)', defense: '주도권을 뺏길까 봐 상황을 통제하려 안달하는 저항', defenseMechanism: '통제 강박과 조급증', superpower: '기꺼이 에고의 고집을 내려놓을 때 쏟아져 들어오는 퀀텀적 발상의 전환', ritual: '바닥에 등을 대고 누워 5분간 아무것도 통제하지 않는 항복(Surrender) 명상' },
    13: { name: '죽음 (Death)', defense: '익숙한 과거와 낡은 관계를 잃을까 두려워 썩어가는 잔해를 붙잡는 미련', defenseMechanism: '변화에 대한 회피와 집착', superpower: '끝난 것을 담담하게 털어내고 새로운 우주를 시작시키는 불사조의 재생력', ritual: '더 이상 나를 키우지 못하는 낡은 습관 한 가지를 오늘부로 공식 파기하기' },
    14: { name: '절제 (Temperance)', defense: '극단적인 감정 기복과 충동적인 폭발로 내면의 고통을 잊으려는 도피', defenseMechanism: '과잉 행동과 극단주의', superpower: '상반된 두 의견이나 갈등을 평화로운 하나의 하모니로 조율하는 중재력', ritual: '따뜻한 차를 마시며 들숨과 날숨의 길이를 1:1로 맞추는 호흡 정렬' },
    15: { name: '악마 (The Devil)', defense: '물질, 쾌락, 타인의 인정에 대한 갈증을 영적이라 위장하며 부정하는 그림자', defenseMechanism: '도덕적 위선과 억압된 욕망', superpower: '내면의 가장 원초적이고 강력한 추진력(야성)을 창조적 에너지로 승화시키는 카리스마', ritual: '스스로 금기시했던 솔직한 욕망을 인정하고 건강한 목표로 재정의하기' },
    16: { name: '탑 (The Tower)', defense: '허상뿐인 모래성을 지키기 위해 진실을 외면하는 회피', defenseMechanism: '현실 부정과 타조 증후군', superpower: '위선의 껍데기가 부서져 나갈 때 솟구치는 거침없는 번개 같은 통찰력', ritual: '불안감의 근원이던 최악의 시나리오를 직접 글로 적어보고 객관적으로 마주하기' },
    17: { name: '별 (The Star)', defense: '절망감에 압도되어 미래에 대한 희망을 냉소적으로 비웃는 방어', defenseMechanism: '시니컬한 냉소와 체념', superpower: '가장 어두운 밤하늘 아래서도 길 잃은 영혼들을 인도하는 꺼지지 않는 희망의 빛', ritual: '밤하늘이나 창밖을 바라보며 나를 지켜주는 우주적 은총에 감사 인사 건네기' },
    21: { name: '세계 (The World)', defense: '완벽하지 않으면 시작조차 하지 않으려는 미완성의 두려움', defenseMechanism: '시작 지연과 자기 검열', superpower: '부족함마저 삶의 축제로 껴안으며 완벽한 마침표를 찍는 완성의 힘', ritual: '미뤄두었던 작은 작업 하나를 100% 완성 짓고 스스로를 칭찬하기' }
  };

  const shadowData = shadowCardMap[shadowCardNum] || shadowCardMap[21];

  const tarotEsotericTitle = `Path ${selectedPathNum} [${pathInfo.cardName}] × Shadow [${shadowData.name}]`;
  const soulHermeticAffirmation = `나는 생명나무의 신성한 경로를 따라 영혼을 상승시키며, 빛과 그림자를 모두 통합하여 온전한 존재로 거듭난다.`;

  const synthesisPromptGuidance = `[LUCKEY 타로 카발라 생명나무 & 섀도우 미러 심층 v1.0.0]
- 생명나무 상승 경로 (Path of Ascension):
  * 제${selectedPathNum}경로: ${pathInfo.connecting}
  * 주관 메이저 아르카나: [${pathInfo.cardName}] (히브리 문자: ${pathInfo.hebrew})
  * 영혼의 입문 관문: ${pathInfo.gateway}
- 타로 섀도우 미러 (무의식 맹점 & 그림자 통합):
  * 의식의 빛 아르카나: [${pathInfo.cardName}]
  * 무의식의 그림자 아르카나: [${shadowData.name}]
  * 숨은 방어기제: ${shadowData.defense}
  * 그림자 변환 초능력 (Transmuted Gold): ${shadowData.superpower}
  * 180초 섀도우 통합 리추얼: ${shadowData.ritual}
- 에소테릭 타로 확언: "${soulHermeticAffirmation}"`;

  return {
    engineVersion: TAROT_KABBALAH_SHADOW_VERSION,
    calculatedAt: targetDate.toISOString(),
    tarotEsotericTitle,
    ascensionPath: {
      pathNumber: selectedPathNum,
      connectingSephiroth: pathInfo.connecting,
      majorCardNumber: pathInfo.majorCard,
      majorCardName: pathInfo.cardName,
      hebrewLetter: pathInfo.hebrew,
      spiritualGatewayTheme: pathInfo.gateway
    },
    shadowMirror: {
      consciousLightCard: pathInfo.cardName,
      shadowBlindSpotCard: shadowData.name,
      blindSpotDefenseMechanism: shadowData.defense,
      transmutedSuperpower: shadowData.superpower,
      shadowIntegrationRitual: shadowData.ritual
    },
    soulHermeticAffirmation,
    synthesisPromptGuidance
  };
}

export type TarotTreeOfLifeShadowResult = TarotTreeOfLifeShadowReport;

export function calculateTarotTreeOfLifeShadow(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): TarotTreeOfLifeShadowResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runTarotTreeOfLifeShadowEngine(profile, targetDate);
}

export function formatTarotTreeOfLifeShadowPrompt(res: TarotTreeOfLifeShadowResult): string {
  return res.synthesisPromptGuidance;
}
