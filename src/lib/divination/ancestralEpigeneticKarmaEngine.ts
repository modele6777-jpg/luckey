/**
 * =========================================================================
 * LUCKEY 조상 혈통 업력 & 후성유전학적 카르마 정화 엔진 (Ancestral Epigenetic Karma Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 현대 후성유전학(Epigenetics: 트라우마와 회복력이 세대를 건너 유전자에 각인된다는 과학)과
 * 사주 년주(조상·혈통 궁)·월주(가문·부모 환경 궁), 서양 점성술 4하우스(가문의 뿌리) 및 8하우스(영적 유산)를 결합한 엔진입니다.
 * 
 * 1. 가문 혈통 대물림 패턴(Generational Imprint): 결핍과 생존 불안, 관계 불신, 감정 억압 등 세대 간 반복되는 패턴 진단
 * 2. 조상의 숨겨진 영적 선물(Ancestral Super-Gift): 핏줄에 새겨진 불굴의 생존력, 예술적 감각, 통찰력 등
 * 3. 카르마 사슬 절단 및 해원 리추얼(Karma Clearing Ritual): 내 대에서 대물림을 끊고 자유를 획득하는 구체적 실천법
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const ANCESTRAL_KARMA_VERSION = 'LUCKEY-ANCESTRAL-v1.0.0';

export interface AncestralLineageImprint {
  generationTheme: string;        // 혈통을 관통하는 핵심 테마
  repressedShadow: string;        // 선대로부터 물려받은 무의식적 억압/결핍
  inheritedSuperGift: string;     // DNA 속에 각인된 조상의 위대한 재능과 잠재력
  clearingDegreePercent: number;  // 현재 내 대에서의 카르마 정화 및 자유도 (0 ~ 100%)
}

export interface AncestralEpigeneticKarmaReport {
  engineVersion: string;
  calculatedAt: string;
  lineageArchetype: string;       // 가문 혈통 아키타입
  ancestralImprint: AncestralLineageImprint;
  generationalChainToBreak: string; // 내 대에서 반드시 끊어내야 할 1순위 사슬
  liberationAffirmation: string;  // 혈통 해방 확언
  ancestralHonorRitual: {
    ritualName: string;
    actionGuide: string;
  };
  synthesisPromptGuidance: string;
}

export function runAncestralEpigeneticKarmaEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): AncestralEpigeneticKarmaReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const yearGan = sajuRes?.pillars?.year?.gan || '갑';
  const yearZhi = sajuRes?.pillars?.year?.zhi || '술';
  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const yearCode = yearGan.charCodeAt(0) + yearZhi.charCodeAt(0);
  const dayCode = dayMaster.charCodeAt(0);
  const seed = (yearCode * 7 + dayCode * 13 + targetDate.getDate() * 11) % 100;

  let lineageArchetype: string;
  let generationTheme: string;
  let repressedShadow: string;
  let inheritedSuperGift: string;
  let generationalChainToBreak: string;
  let ritualName: string;
  let actionGuide: string;

  if (element === '목') {
    lineageArchetype = '개척과 자수성가의 가문 (The Pioneer Clan)';
    generationTheme = '황무지를 일구며 살아남은 생존과 끝없는 전진의 역사';
    repressedShadow = '쉬면 도태된다는 강박, 멈추지 못하는 조급함과 만성 긴장감';
    inheritedSuperGift = '어떠한 척박한 토양에서도 기필코 싹을 틔워내는 불사조 같은 회복탄력성';
    generationalChainToBreak = '스스로를 끊임없이 채찍질해야만 인정받을 수 있다는 번아웃 생존 사슬';
    ritualName = '푸른 나무의 휴식 감사 리추얼 (Ritual of Rooted Peace)';
    actionGuide = '작은 화분이나 나무를 바라보며 "조상님들의 노고 덕분에 저는 이제 안전하며, 쉬어가도 괜찮습니다"라고 진심으로 읊조리기';
  } else if (element === '화') {
    lineageArchetype = '명예와 열정, 신념의 가문 (The Luminary Clan)';
    generationTheme = '세상에 뜻을 떨치고 당당하게 이름을 알리고자 했던 뜨거운 열망';
    repressedShadow = '체면과 타인의 시선에 갇혀 솔직한 슬픔이나 취약성을 감추었던 침묵';
    inheritedSuperGift = '주변을 환하게 밝히고 사람들의 마음을 움직이는 천부적인 카리스마와 표현력';
    generationalChainToBreak = '남들에게 약점을 보이면 안 된다는 완벽한 페르소나의 사슬';
    ritualName = '진실의 촛불 점화 리추얼 (Flame of Authenticity)';
    actionGuide = '저녁 무렵 촛불을 켜고 가문이 겪었던 보이지 않는 슬픔을 인정하며 자유로운 눈물을 온전히 허용하기';
  } else if (element === '토') {
    lineageArchetype = '터전과 가문의 보존, 신뢰의 가문 (The Guardian Clan)';
    generationTheme = '가족과 공동체를 지키기 위해 모든 짐을 홀로 짊어졌던 묵직한 희생';
    repressedShadow = '변화에 대한 두려움, 새로운 세계로 나아가지 못하고 억누른 개인의 꿈';
    inheritedSuperGift = '위기 상황에서도 결코 흔들리지 않고 대지를 지탱하는 굳건한 신의와 포용력';
    generationalChainToBreak = '모두를 내가 책임져야 한다는 과도한 죄책감과 희생양 사슬';
    ritualName = '대지와의 가벼운 작별 리추얼 (Unburdening Earth Walk)';
    actionGuide = '맨발로 흙이나 잔디를 밟으며 내가 짊어지지 않아도 될 타인의 짐을 대지에 온전히 반환하기';
  } else if (element === '금') {
    lineageArchetype = '원칙과 결기, 정의의 가문 (The Iron Sovereign Clan)';
    generationTheme = '어려운 시대의 풍파 속에서도 엄격한 규율과 꺾이지 않는 자존심을 지켜낸 역사';
    repressedShadow = '감정을 드러내는 것을 나약함으로 여겨 삭여온 차가운 외로움과 비판적 엄격함';
    inheritedSuperGift = '불의와 타협하지 않고 사리분별을 칼날처럼 해내는 정밀한 판단력과 결단력';
    generationalChainToBreak = '작은 실수도 용납하지 못하고 스스로와 가족을 재단하던 엄격한 평가의 사슬';
    ritualName = '황금빛 온기의 용서 리추얼 (Golden Forgiveness)';
    actionGuide = '손바닥을 비벼 따뜻해진 손으로 가슴을 감싸며 "불완전해도 우리는 사랑받기에 충분합니다"라고 선언하기';
  } else {
    // 수 (Water)
    lineageArchetype = '지혜와 심연, 치유의 가문 (The Mystic Healer Clan)';
    generationTheme = '세상의 파도를 온몸으로 겪어내며 마음 깊은 곳에 지혜를 축적한 역사';
    repressedShadow = '알 수 없는 깊은 불안과 결핍, 말하지 못하고 속으로 삼킨 슬픔의 잔여물';
    inheritedSuperGift = '말하지 않아도 상대방의 아픔을 꿰뚫어보는 신비로운 공감력과 직관의 샘';
    generationalChainToBreak = '이유를 알 수 없이 엄습하던 근원적 불안과 고립감의 사슬';
    ritualName = '맑은 생명수의 정화 리추얼 (Waters of Renewal)';
    actionGuide = '맑은 물 한 컵을 천천히 마시며 세포 하나하나에 깃든 선대의 트라우마가 맑게 씻겨 나감을 심상화하기';
  }

  const clearingDegreePercent = 75 + (seed % 23);
  const liberationAffirmation = `나는 선대의 모든 사랑과 지혜를 감사히 물려받되, 그분들의 아픔과 결핍의 사슬은 내 대에서 사랑으로 끊어냅니다. 나는 온전히 자유로운 새 운명의 창조자입니다.`;

  const ancestralImprint: AncestralLineageImprint = {
    generationTheme,
    repressedShadow,
    inheritedSuperGift,
    clearingDegreePercent
  };

  const synthesisPromptGuidance = `[LUCKEY 조상 혈통 업력 & 후성유전학적 카르마 정화 v1.0.0]
- 가문 혈통 아키타입: [${lineageArchetype}]
- 혈통 관통 테마: ${generationTheme}
- 세대 간 대물림 그림자: ${repressedShadow}
- DNA 각인 영적 선물(Super-Gift): ${inheritedSuperGift}
- 내 대에서 끊어낼 1순위 사슬: ${generationalChainToBreak} (카르마 정화 완성도: ${clearingDegreePercent}%)
- 가문 해원 의식: [${ritualName}] ${actionGuide}
- 혈통 해방 확언: "${liberationAffirmation}"`;

  return {
    engineVersion: ANCESTRAL_KARMA_VERSION,
    calculatedAt: targetDate.toISOString(),
    lineageArchetype,
    ancestralImprint,
    generationalChainToBreak,
    liberationAffirmation,
    ancestralHonorRitual: {
      ritualName,
      actionGuide
    },
    synthesisPromptGuidance
  };
}

export type AncestralEpigeneticKarmaResult = AncestralEpigeneticKarmaReport;

export function calculateAncestralEpigeneticKarma(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): AncestralEpigeneticKarmaResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runAncestralEpigeneticKarmaEngine(profile, targetDate);
}

export function formatAncestralEpigeneticKarmaPrompt(res: AncestralEpigeneticKarmaResult): string {
  return res.synthesisPromptGuidance;
}
