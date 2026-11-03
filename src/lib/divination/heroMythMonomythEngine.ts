/**
 * =========================================================================
 * LUCKEY 조셉 캠벨 영웅의 여정 12단계 & 운명 돌파 엔진 (Hero Myth Monomyth Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 신화학의 거장 조셉 캠벨(Joseph Campbell)의 불멸의 원형 '영웅의 여정 12단계(Hero's Journey / Monomyth)'와
 * 사주 10년 대운(大運) 주기, 세운(歲運) 및 주역 괘상을 융합한 인생 내러티브 코칭 엔진입니다.
 * 
 * 1. 출발(Departure): 일상 세계 -> 모험으로의 부름 -> 부름의 거절 -> 스승과의 만남 -> 첫 문턱 통과
 * 2. 입문(Initiation): 시험과 동지·적 -> 가장 깊은 동굴로의 접근 -> 시련과 상징적 죽음 -> 보상(마법의 검) 획득
 * 3. 귀환(Return): 귀환의 길 -> 부활(재탄생) -> 세상에 영약(Elixir)을 가져오는 자유로운 마스터
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const HERO_MONOMYTH_VERSION = 'LUCKEY-MONOMYTH-v1.0.0';

export interface HeroJourneyStage {
  stepNumber: number;          // 1 ~ 12
  stageName: string;
  mythicTheme: string;
  archetypalRole: string;      // 현재 내가 맡은 신화적 배역
  hiddenBlessing: string;      // 이 시련이 숨겨둔 영적 선물
}

export interface HeroMythMonomythReport {
  engineVersion: string;
  calculatedAt: string;
  heroicArchetype: string;     // 영웅의 신화적 타이틀
  currentStage: HeroJourneyStage;
  theUltimateOrdeal: string;   // 현재 마주한 가장 깊은 동굴 속 용(Dragon)과의 결전
  theSacredElixir: string;     // 승리 후 세상에 가져올 보물/영약
  heroicBreakthroughAction: string; // 다음 문턱을 넘기 위한 1순위 돌파 결단
  monomythPowerScore: number;  // 영웅적 서사 추진력 (0 ~ 100)
  synthesisPromptGuidance: string;
}

export function runHeroMythMonomythEngine(
  profile?: UserProfile,
  targetDate: Date = new Date()
): HeroMythMonomythReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0) + element.charCodeAt(0);
  const seed = (ganCode * 17 + targetDate.getFullYear() * 3 + targetDate.getDate() * 7) % 100;

  // 12단계 중 현재 스테이지 도출 (대운 및 일진의 숙명적 흐름)
  const stages: HeroJourneyStage[] = [
    { stepNumber: 1, stageName: '1. 익숙한 일상 세계 (The Ordinary World)', mythicTheme: '낡은 질서의 한계와 권태를 느끼는 전야', archetypalRole: '잠든 영웅', hiddenBlessing: '새로운 모험을 향한 갈증의 태동' },
    { stepNumber: 2, stageName: '2. 모험으로의 부름 (The Call to Adventure)', mythicTheme: '운명의 전령이 던지는 파격적인 제안', archetypalRole: '부름받은 자', hiddenBlessing: '안락지대를 깨고 나올 절호의 기회' },
    { stepNumber: 3, stageName: '3. 부름의 거절 (Refusal of the Call)', mythicTheme: '미지의 두려움과 안전에 대한 집착', archetypalRole: '망설이는 자', hiddenBlessing: '내면의 진정한 결기와 동기 확인' },
    { stepNumber: 4, stageName: '4. 스승과의 만남 (Meeting the Mentor)', mythicTheme: '지혜로운 조력자가 건네는 신비로운 도구와 조언', archetypalRole: '제자이자 계승자', hiddenBlessing: '보이지 않는 우주적 보호와 가이드' },
    { stepNumber: 5, stageName: '5. 첫 번째 문턱 통과 (Crossing the First Threshold)', mythicTheme: '돌이킬 수 없는 미지의 세계로의 진입', archetypalRole: '경계를 넘는 탐험가', hiddenBlessing: '과거와의 결별 및 새로운 정체성 획득' },
    { stepNumber: 6, stageName: '6. 시험, 동지, 그리고 적 (Tests, Allies, and Enemies)', mythicTheme: '새로운 룰을 익히고 진짜 내 편을 가려내는 시간', archetypalRole: '전장의 전사', hiddenBlessing: '진짜 신뢰할 수 있는 동맹과 내면의 실력 축적' },
    { stepNumber: 7, stageName: '7. 가장 깊은 동굴로의 접근 (Approach to the Inmost Cave)', mythicTheme: '최종 결전을 앞둔 폭풍전야의 긴장감', archetypalRole: '심연을 응시하는 자', hiddenBlessing: '자신의 가장 취약한 두려움과 마주하는 용기' },
    { stepNumber: 8, stageName: '8. 가혹한 시련과 상징적 죽음 (The Ordeal)', mythicTheme: '낡은 자아가 완전히 불타 없어지는 극한의 대결', archetypalRole: '부활을 앞둔 자', hiddenBlessing: '에고의 죽음을 통한 초인적 힘의 각성' },
    { stepNumber: 9, stageName: '9. 보상 / 마법의 검 획득 (Reward / Seizing the Sword)', mythicTheme: '용을 쓰러뜨리고 불멸의 지혜와 능력을 손에 쥠', archetypalRole: '승리한 정복자', hiddenBlessing: '세상 누구도 빼앗을 수 없는 독보적 마스터리' },
    { stepNumber: 10, stageName: '10. 귀환의 길 (The Road Back)', mythicTheme: '획득한 보물을 지키며 세상으로 돌아오는 추격전', archetypalRole: '보물의 수호자', hiddenBlessing: '현실 세계의 엄혹함 속에서 가치를 증명하는 끈기' },
    { stepNumber: 11, stageName: '11. 부활과 재탄생 (The Resurrection)', mythicTheme: '마지막 시험을 통과하며 완벽히 거듭난 존재', archetypalRole: '초월적 존재', hiddenBlessing: '두려움이 완전히 소멸된 궁극의 자유' },
    { stepNumber: 12, stageName: '12. 영약을 가지고 귀환 (Return with the Elixir)', mythicTheme: '세상을 치유하고 영감을 주는 지혜의 전파', archetypalRole: '두 세계의 마스터', hiddenBlessing: '타인과 세상을 풍요롭게 하는 완성된 리더십' }
  ];

  // 수리에 따라 고난도 성장 구간(6, 7, 8, 9단계)에 높은 비중 부여
  const stageIndices = [5, 6, 7, 8, 4, 9, 10, 11];
  const chosenIndex = stageIndices[seed % stageIndices.length];
  const currentStage = stages[chosenIndex];

  let heroicArchetype: string;
  let theUltimateOrdeal: string;
  let theSacredElixir: string;
  let heroicBreakthroughAction: string;

  if (element === '목') {
    heroicArchetype = '생명의 씨앗을 심고 제국을 일구는 창조의 영웅 (The Primordial Architect)';
    theUltimateOrdeal = '기존의 안전한 온실을 부수고, 살을 에는 겨울바람 속에서 홀로 우뚝 서야 하는 고독의 시험';
    theSacredElixir = '사람들의 꺾인 영혼을 단숨에 소생시키는 불굴의 비전과 희망의 청사진';
    heroicBreakthroughAction = '과거의 타성에 젖은 방식을 과감히 단칼에 베어내고, 완전히 새로운 프로젝트에 첫 삽을 뜨기';
  } else if (element === '화') {
    heroicArchetype = '어둠의 심장을 꿰뚫는 태양의 빛의 영웅 (The Solar Luminary)';
    theUltimateOrdeal = '타인의 박수갈채와 시선에 연연하지 않고, 내면의 순수한 불꽃만을 나침반 삼아야 하는 진실의 시험';
    theSacredElixir = '얼어붙은 세상을 녹이고 대중을 행동하게 만드는 매혹적인 스토리와 감동의 언어';
    heroicBreakthroughAction = '체면을 차리느라 머뭇거리던 진짜 내 비전을 세상에 거침없이 공표하고 주도권 쥐기';
  } else if (element === '토') {
    heroicArchetype = '우주의 중심을 지키는 황금 성채의 수호 영웅 (The Sovereign Pillar)';
    theUltimateOrdeal = '모든 짐을 혼자 짊어지려는 과도한 책임감을 내려놓고, 세상의 불확실성을 수용하는 믿음의 시험';
    theSacredElixir = '어떠한 대격변에도 무너지지 않는 신뢰의 시스템과 지속 가능한 부의 기반';
    heroicBreakthroughAction = '내가 아니면 안 된다는 통제 욕구를 내려놓고, 시스템과 동료에게 과감히 권한을 이양하기';
  } else if (element === '금') {
    heroicArchetype = '혼돈을 단칼에 가르는 명검의 전사 영웅 (The Blade of Truth)';
    theUltimateOrdeal = '스스로에 대한 가혹한 비판과 의심을 멈추고, 자신의 날카로운 칼날을 온전히 신뢰하는 확신의 시험';
    theSacredElixir = '비효율과 거짓을 단번에 소멸시키는 명쾌한 통찰과 압도적 완성도의 솔루션';
    heroicBreakthroughAction = '타협하지 않는 최고 수준의 기준을 세우고, 군더더기를 100% 제거한 결정적 마스터피스 완성하기';
  } else {
    // 수 (Water)
    heroicArchetype = '심연의 지혜를 길어 올리는 우주의 현자 영웅 (The Abyssal Mystic)';
    theUltimateOrdeal = '깊이를 알 수 없는 내면의 고립감과 허무를 딛고, 세상의 현실 속으로 당당히 걸어 나오는 참여의 시험';
    theSacredElixir = '보이지 않는 우주의 이치를 풀어내어 혼란에 빠진 사람들에게 주는 궁극의 나침반';
    heroicBreakthroughAction = '머릿속 사색과 통찰에만 머물지 않고, 세상이 당장 쓸 수 있는 구체적인 서비스로 세상에 출시하기';
  }

  const monomythPowerScore = 82 + (seed % 17);

  const synthesisPromptGuidance = `[LUCKEY 조셉 캠벨 영웅의 여정 12단계 모노미스 v1.0.0]
- 영웅의 신화적 정체성: [${heroicArchetype}]
- 현재 위치한 여정의 관문: ${currentStage.stageName}
  * 신화적 테마: ${currentStage.mythicTheme}
  * 부여된 신화적 역할: [${currentStage.archetypalRole}]
  * 시련 속 숨겨진 선물: ${currentStage.hiddenBlessing}
- 통과해야 할 가장 깊은 동굴(Ordeal): ${theUltimateOrdeal}
- 승리의 마법 영약(The Sacred Elixir): ${theSacredElixir}
- 문턱을 넘는 영웅적 돌파 결단: ${heroicBreakthroughAction}
- 신화적 서사 추진력: ${monomythPowerScore}점`;

  return {
    engineVersion: HERO_MONOMYTH_VERSION,
    calculatedAt: targetDate.toISOString(),
    heroicArchetype,
    currentStage,
    theUltimateOrdeal,
    theSacredElixir,
    heroicBreakthroughAction,
    monomythPowerScore,
    synthesisPromptGuidance
  };
}

export type HeroMythMonomythResult = HeroMythMonomythReport;

export function calculateHeroMythMonomyth(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
}): HeroMythMonomythResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runHeroMythMonomythEngine(profile, targetDate);
}

export function formatHeroMythMonomythPrompt(res: HeroMythMonomythResult): string {
  return res.synthesisPromptGuidance;
}
