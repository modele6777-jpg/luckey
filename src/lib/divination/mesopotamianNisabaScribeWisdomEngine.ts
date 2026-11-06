/**
 * 고대 메소포타미아 수메르 서기의 수호신 니사바(Nisaba) 청금석 서판 갈대첨필 천문수리 계측 엔진
 *
 * 서기전 2500년경 수메르 우르(Ur)·에레두·움마의 최고 지혜와 학문, 도량형, 별자리 측량의 여신 니사바(Nisaba) 원전 기반.
 * 1. 5대 천문·수리 측량 원칙:
 *    - GI.DUB (갈대 첨필 카라무스: 진실된 기록과 계산의 정밀도)
 *    - DUB.ZA.GIN (청금석 서판: 불변의 영적 질서와 운명 매트릭스)
 *    - É.DUB.BA.A (에두바 서당: 학습력과 지적 통찰의 성장률)
 *    - NINDAN (신성 도량형 척도: 관계와 재정의 공정한 분배와 균형)
 *    - MUL (성좌 관측 수리도: 하늘의 별자리 주기와 지상 운세의 조화)
 * 2. 7개 점토 서판 서기 품계 및 지혜의 쐐기문자 처방
 *
 * @version LUCKEY-MESOPOTAMIAN-NISABA-v1.0.0
 */

import type { UserProfile } from '../sharedState';

export const MESOPOTAMIAN_NISABA_VERSION = 'LUCKEY-MESOPOTAMIAN-NISABA-v1.0.0';

export interface NisabaScribeRank {
  rankLevel: number;
  rankSumerian: string;
  rankNameKo: string;
  astralDomain: string;
  celestialAttribute: string;
}

export interface MesopotamianNisabaResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 지표 (0~100)
  reedStylusPrecisionIndex: number; // 갈대 첨필(GI.DUB) 정밀 계산 및 기록력
  lapislazuliTabletClarityScore: number; // 청금석 서판(DUB.ZA.GIN) 질서 명료도
  edubbaIntellectualGrowth: number; // 에두바(É.DUB.BA.A) 지적 숙달 및 지혜 확장력
  sacredNindanMeasureBalance: number; // 닌단(NINDAN) 도량형 수리 균형 및 공정 배분율
  astralMulConstellationResonance: number; // 성좌 관측(MUL) 우주 리듬 일치율
  // 세부 명세
  activeScribeRank: NisabaScribeRank;
  primaryCuneiformVerdict: {
    sumerianWord: string;
    meaningKo: string;
    sacredGuidance: string;
  };
  lapislazuliDecree: {
    tabletSection: string;
    wisdomVerse: string;
  };
}

export type MesopotamianNisabaReport = MesopotamianNisabaResult;

const NISABA_RANKS: NisabaScribeRank[] = [
  { rankLevel: 1, rankSumerian: 'UM-MI-A (대스승)', rankNameKo: '우주의 법칙을 새기는 대학자', astralDomain: '천상과 지상의 궁극적 조화 및 천문력 계산', celestialAttribute: '순수 청금석의 빛나는 지혜' },
  { rankLevel: 2, rankSumerian: 'DUB-SAR MUL (천문 서기)', rankNameKo: '별자리를 관측하는 천문 서기', astralDomain: '행성 궤도 및 시간의 주기적 분기점 판독', celestialAttribute: '은빛 갈대첨필의 정밀성' },
  { rankLevel: 3, rankSumerian: 'DUB-SAR A-ŠÀ (토지 측량 서기)', rankNameKo: '경계를 확정하는 공정 측량관', astralDomain: '현실적 자산 및 기회의 공평무사한 배분', celestialAttribute: '황금 밧줄의 곧은 정의' },
  { rankLevel: 4, rankSumerian: 'DUB-SAR KÍD (지혜의 기록관)', rankNameKo: '진실을 문서화하는 공증관', astralDomain: '말과 계약의 신의 성실 보증', celestialAttribute: '구운 점토판의 영속성' },
  { rankLevel: 5, rankSumerian: 'DUB-SAR É-GAL (궁정 기록관)', rankNameKo: '전략과 계획을 수립하는 책사', astralDomain: '장기적 전략 실행 및 자원 조직화', celestialAttribute: '새벽별의 선명한 예지' },
  { rankLevel: 6, rankSumerian: 'ŠÀ-DUB-BA (회계 서기)', rankNameKo: '손익과 인연을 계측하는 감정관', astralDomain: '낭비 없는 에너지 집중 및 실리 추구', celestialAttribute: '정확한 수리적 균형' },
  { rankLevel: 7, rankSumerian: 'GAB-SAR (서당 수련자)', rankNameKo: '지혜를 탐구하는 순수 학습자', astralDomain: '기초 원리 습득 및 내면적 역량 축적', celestialAttribute: '젖은 점토의 유연한 가능성' },
];

const CUNEIFORM_VERDICTS = [
  { sumerianWord: 'NÍG-SI-SÁ (정의와 정직)', meaningKo: '굽음 없는 올곧은 진실', sacredGuidance: '장부의 숫자를 속이지 않듯, 자신의 진실한 마음에 거짓을 섞지 마십시오.' },
  { sumerianWord: 'GIŠ-HUR (신성한 청사진)', meaningKo: '하늘이 정한 우주적 설계도', sacredGuidance: '혼란스러울 때는 첫 원형의 계획과 본질로 되돌아가 다시 선을 그으십시오.' },
  { sumerianWord: 'GÉŠTU (총명과 지성)', meaningKo: '귀 기울여 깨닫는 깊은 통찰', sacredGuidance: '말하기보다 먼저 경청하고, 관찰한 뒤에 첨필을 쥐면 실수가 없습니다.' },
  { sumerianWord: 'NAM-TÉŠ (상호 부끄러움 없는 존중)', meaningKo: '하늘과 사람 앞에 떳떳한 품격', sacredGuidance: '남이 보지 않는 은밀한 자리에서도 서판에 새기듯 단정함을 유지하십시오.' },
];

const LAPISLAZULI_DECREES = [
  { tabletSection: '지혜의 여신에게 바치는 찬가 제1장', wisdomVerse: '별들의 궤도를 수놓는 니사바 여신의 갈대첨필이 그대의 혼란을 정리하여 정갈한 승리의 서판으로 완성하리라.' },
  { tabletSection: '에두바의 규범 석판 제3조', wisdomVerse: '매일 한 글자씩 점토판에 진실을 새기는 자는 어떤 풍파 속에서도 영원히 허물어지지 않는 성채를 얻는다.' },
  { tabletSection: '니푸르의 신성한 도량형 서판 제7행', wisdomVerse: '손해 보는 것 같아도 바른 되와 저울을 지킬 때, 신들이 하늘의 창고를 열어 복을 내린다.' },
  { tabletSection: '새벽별의 서기 찬가 제9연', wisdomVerse: '지식은 자랑하는 무기가 아니라, 어둠 속에 헤매는 이를 위해 서판에 불을 밝히는 등불이다.' },
];

function getKstDateString(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60000);
  return kst.toISOString().replace('T', ' ').substring(0, 19) + ' KST';
}

function hashSeed(seedStr: string): number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function calculateMesopotamianNisaba(profile?: UserProfile): MesopotamianNisabaResult {
  const birthdate = profile?.basic?.birthdate || '1995-03-21';
  const birthtime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'Inquirer';
  const seed = hashSeed(`MESOPOTAMIAN-NISABA-${birthdate}-${birthtime}-${name}`);

  const reedStylusPrecisionIndex = (seed % 41) + 60; // 60~100
  const lapislazuliTabletClarityScore = ((seed >> 3) % 39) + 62; // 62~100
  const edubbaIntellectualGrowth = ((seed >> 5) % 43) + 58; // 58~100
  const sacredNindanMeasureBalance = ((seed >> 7) % 45) + 55; // 55~99
  const astralMulConstellationResonance = ((seed >> 9) % 38) + 63; // 63~100

  const rankIdx = (seed >> 2) % NISABA_RANKS.length;
  const activeScribeRank = NISABA_RANKS[rankIdx];

  const verdictIdx = (seed >> 4) % CUNEIFORM_VERDICTS.length;
  const primaryCuneiformVerdict = CUNEIFORM_VERDICTS[verdictIdx];

  const decreeIdx = (seed >> 6) % LAPISLAZULI_DECREES.length;
  const lapislazuliDecree = LAPISLAZULI_DECREES[decreeIdx];

  return {
    engineVersion: MESOPOTAMIAN_NISABA_VERSION,
    calculatedAtKst: getKstDateString(),
    reedStylusPrecisionIndex,
    lapislazuliTabletClarityScore,
    edubbaIntellectualGrowth,
    sacredNindanMeasureBalance,
    astralMulConstellationResonance,
    activeScribeRank,
    primaryCuneiformVerdict,
    lapislazuliDecree,
  };
}

export function formatMesopotamianNisabaPrompt(result: MesopotamianNisabaResult): string {
  return `[📐 수메르 서기의 수호신 《니사바(Nisaba)》 청금석 서판 갈대첨필 천문수리 계측 리포트]
- 엔진 버전: ${result.engineVersion}
- 갈대 첨필(GI.DUB) 정밀 계산 및 기록력: ${result.reedStylusPrecisionIndex}% (오차 없는 객관적 계측)
- 청금석 서판(DUB.ZA.GIN) 질서 명료도: ${result.lapislazuliTabletClarityScore}% (운명 매트릭스의 선명성)
- 에두바(É.DUB.BA.A) 지적 숙달 및 지혜 확장력: ${result.edubbaIntellectualGrowth}% (전문성 축적과 응용력)
- 신성 도량형 닌단(NINDAN) 수리 균형 배분율: ${result.sacredNindanMeasureBalance}% (공평무사한 자원과 기회 배분)
- 성좌 관측(MUL) 우주 천문 리듬 일치율: ${result.astralMulConstellationResonance}% (하늘의 시간표와의 공명)
- 현행 서기 지위: ${result.activeScribeRank.rankNameKo} (${result.activeScribeRank.rankSumerian})
- 관장 천문 영역: ${result.activeScribeRank.astralDomain} [속성: ${result.activeScribeRank.celestialAttribute}]
- 핵심 쐐기문자 명제: **[${result.primaryCuneiformVerdict.sumerianWord}]** - ${result.primaryCuneiformVerdict.meaningKo}
  → 서기의 지침: ${result.primaryCuneiformVerdict.sacredGuidance}
- 청금석 서판 신탁: 《${result.lapislazuliDecree.tabletSection}》
  → 고대 찬가: "${result.lapislazuliDecree.wisdomVerse}"`;
}
