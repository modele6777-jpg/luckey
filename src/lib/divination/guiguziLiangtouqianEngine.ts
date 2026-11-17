/**
 * =========================================================================
 * LUCKEY 고대 중국 귀곡자(鬼谷子) 양구령(兩頭鉗) 72변화 명리 결단 엔진
 * (Guiguzi Liangtouqian Decision Matrix Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 중국 전국시대 종횡가(縱橫家)의 시조이자 병법·지략·성명학의 대가인
 * 귀곡자(鬼谷子) 찬 정통 명리학 《귀곡선생양두겸(鬼谷先生兩頭鉗)》 원전 기반.
 * 
 * 1. 양두(兩頭) 원리:
 *    - 앞머리(先): 선천 천명(先天 天命)을 상징하는 년간(年干)
 *    - 뒷머리(後): 후천 귀결(後天 歸結)을 상징하는 시간(時干, 미입력 시 일간)
 *    - 두 간지의 천간 배합(10천간 x 10천간 = 100국 중 72대 핵심 변화국)을 통해
 *      인생의 그릇, 성패의 타이밍, 은둔과 진격의 전술을 도출
 * 2. 선천 성수 (Fate Constellation Star):
 *    - 천록성(天祿星), 천권성(天權星), 천인성(天刃星), 천문성(天文星),
 *      천고성(天孤星), 천복성(天福星), 천귀성(天貴星), 천간성(天奸星), 천예성(天藝星) 등
 * 3. 3대 인생 국면 시경 (Three Phase Divination Verses):
 *    - 기반국 (基盤局): 초년의 터전, 타고난 그릇과 기질의 본바탕
 *    - 행장국 (行裝局): 중년의 처세, 위기 돌파와 출세·재물 축적의 전술
 *    - 결말국 (結末局): 만년의 수확, 인생의 최종 안식과 후세의 평가
 * 4. 전략적 결단 나침반 (Strategic Decision Matrix):
 *    - 종횡가의 지략으로 분석한 '공격 vs 수비', '합종(연대) vs 연횡(각개격파)' 의사결정 처방
 */

import type { UserProfile } from '../sharedState';

export const GUIGUZI_VERSION = 'LUCKEY-GUIGUZI-LIANGTOUQIAN-v2.3.0';

export interface GuiguziGuaStructure {
  yearStem: string;      // 년간 (선천 천명)
  hourStem: string;      // 시간 (후천 귀결)
  patternName: string;   // 괘명 (예: 감괘, 봉괘, 복괘, 가괘, 리괘 등)
  destinyGrade: string;  // 상화국(上和局), 대기국(大器局), 자수성가국, 개척국 등
  destinyStar: {
    starName: string;
    koreanTitle: string;
    influenceArea: string;
    fatefulAura: string;
  };
}

export interface ThreePhasesPoetry {
  foundationPhase: { // 기반국 (초년/기반)
    verseLine: string;
    modernInterpretation: string;
  };
  journeyPhase: {    // 행장국 (중년/처세)
    verseLine: string;
    modernInterpretation: string;
  };
  culminationPhase: { // 결말국 (만년/결실)
    verseLine: string;
    modernInterpretation: string;
  };
}

export interface StrategicDecisionMatrix {
  tacticalStance: 'AGGRESSIVE_EXPANSION' | 'CONSOLIDATION_DEFENSE' | 'STRATEGIC_ALLIANCE' | 'INDEPENDENT_BREAKTHROUGH';
  tacticalLabel: string;
  patienceVsActionRatio: {
    patiencePercentage: number; // 인내/수비율 (0 ~ 100)
    actionPercentage: number;   // 결단/진격율 (0 ~ 100)
  };
  alliedNetworkAdvice: string;  // 합종연횡 인맥 처방
  crisisAversionKey: string;    // 액운 회피 및 위험 관리 핵심
}

export interface GuiguziLiangtouqianReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  guaStructure: GuiguziGuaStructure;
  poetry: ThreePhasesPoetry;
  strategy: StrategicDecisionMatrix;
  situationalGuiguziAudit: {
    focusTheme: string;
    tacticalBalanceNote: string;
    diplomacyFocus: string;
  };
  temporalGuiguziRhythm: {
    kstTimeLabel: string;
    zonghengWatchWindow: string;
    seasonalCampaignTone: string;
    temporalGuidance: string;
  };
  guiguziSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  strategicClarityScore: number; // 0 ~ 100 결단 명료도 (내부 호환용, 프롬프트 비노출)
  synthesisMessage: string;
  reflectiveQuestion: string;
  ritualAction: string;
  reflectionFocus: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
}

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

const DESTINY_STARS = [
  { starName: '天祿星 (천록성)', koreanTitle: '천상의 녹봉과 재물의 별', influenceArea: '사업·재물·안정된 소득 기반', fatefulAura: '노력한 만큼 반드시 풍요로운 보상이 뒤따르는 복록' },
  { starName: '天權星 (천권성)', koreanTitle: '권위와 통솔력의 별', influenceArea: '리더십·조직 장악·결단력', fatefulAura: '뭇사람을 이끌고 중요한 결정을 주도하는 대장부의 기개' },
  { starName: '天文星 (천문성)', koreanTitle: '문장과 통찰 학문의 별', influenceArea: '기획·연구·문필·전략 수립', fatefulAura: '지혜가 깊고 통찰이 예리하여 전략으로 승리하는 지낭' },
  { starName: '天福星 (천복성)', koreanTitle: '우주적 가호와 인덕의 별', influenceArea: '귀인 조력·인복·위기 모면', fatefulAura: '험난한 파도 속에서도 결정적인 귀인의 손길이 닿는 은총' },
  { starName: '天藝星 (천예성)', koreanTitle: '창의와 독창적 기예의 별', influenceArea: '전문 기술·예술·독보적 영역', fatefulAura: '남들이 흉내 낼 수 없는 자신만의 독창적 칼자루를 쥐는 힘' },
  { starName: '天刃星 (천인성)', koreanTitle: '강인한 기개와 칼날의 별', influenceArea: '돌파력·승부사 기질·개척', fatefulAura: '가시밭길을 스스로 칼로 베어 길을 내는 불굴의 투지' },
  { starName: '天貴星 (천귀성)', koreanTitle: '고결한 품격과 명예의 별', influenceArea: '명성·신뢰·공적 인정', fatefulAura: '어려움 속에서도 자존과 품위를 잃지 않고 빛을 발하는 위상' },
];

function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getTemporalGuiguziRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const zonghengWatchWindow =
    hour >= 5 && hour < 11
      ? '귀곡(鬼谷) 아침 모책창 — 판세를 조용히 읽고 오늘의 우선순위를 가르는 시간'
      : hour >= 11 && hour < 17
        ? '합종연횡 정오 교섭창 — 명분과 실리를 맞물려 핵심 협상과 결단을 내리는 시간'
        : hour >= 17 && hour < 22
          ? '양두(兩頭) 황혼 점검창 — 오늘의 진격과 수비 결과를 복기하며 인맥을 다지는 시간'
          : '은인자중 심야 비책창 — 불필요한 노출을 닫고 다음 국면의 수를 깊이 가다듬는 시간';

  const seasonalCampaignTone =
    month >= 3 && month <= 5
      ? '봄 · 개국(開局) 포석기 (새 판을 짜고 동맹을 탐색하는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 승풍(乘風) 진격기 (모멘텀을 타고 주도권을 넓히는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 수렴(收斂) 결실기 (실속을 추리고 조건을 명문화하는 시기)'
          : '겨울 · 축력(蓄力) 수비기 (내실을 다지며 결정적 호기를 기다리는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm}:00 +09:00 KST`,
    zonghengWatchWindow,
    seasonalCampaignTone,
    temporalGuidance: `${zonghengWatchWindow} · ${seasonalCampaignTone}의 흐름에 맞추어 진격과 수비의 균형을 조율하십시오.`,
  };
}

export function calculateGuiguziLiangtouqian(params: {
  profile?: UserProfile;
  contextText?: string;
  referenceDate?: Date;
}): GuiguziLiangtouqianReport {
  const now = params.referenceDate || new Date();
  const birthdate = params.profile?.basic?.birthdate?.trim() || '1990-01-01';
  const birthtime = params.profile?.basic?.birthtime?.trim() || '';
  const name = params.profile?.basic?.name?.trim() || '주인공';
  const context = (params.contextText || '').trim();

  const seed = stringHash(`${birthdate}|${birthtime}|${name}|${now.toISOString().slice(0, 10)}|${context}`);

  // 년간 추출 (연도 끝자리 기반 간지 연산)
  const birthYear = parseInt(birthdate.slice(0, 4), 10) || 1990;
  const yearStemIdx = (birthYear - 4) >= 0 ? (birthYear - 4) % 10 : (10 + ((birthYear - 4) % 10)) % 10;
  const yearStem = HEAVENLY_STEMS[yearStemIdx];

  // 시간 추출 (시간 미입력 시 seed 및 월/일로 시간 천간 결정)
  let hourStemIdx = 0;
  if (birthtime && birthtime.includes(':')) {
    const hour = parseInt(birthtime.split(':')[0], 10) || 12;
    const timeBranchIdx = Math.floor(((hour + 1) % 24) / 2);
    hourStemIdx = ((yearStemIdx % 5) * 2 + timeBranchIdx) % 10;
  } else {
    hourStemIdx = (seed + birthYear) % 10;
  }
  const hourStem = HEAVENLY_STEMS[hourStemIdx];

  // 귀곡자 괘명 및 성수 산출
  const patternNames = [
    '천성복록괘 (天成福祿卦 - 스스로 길을 열어 녹을 쌓는 국)',
    '청운도약괘 (靑雲跳躍卦 - 시련 뒤에 비상하는 대기만성국)',
    '금옥만당괘 (金玉滿堂卦 - 지혜와 실속으로 내실을 채우는 국)',
    '용비봉무괘 (龍飛鳳舞卦 - 귀인의 조력으로 뜻을 떨치는 국)',
    '벽파투망괘 (劈波投網卦 - 거친 파도를 헤치고 큰 고기를 낚는 국)',
    '추풍낙엽괘 (秋風收獲卦 - 가을바람에 알곡을 가려 곡간에 들이는 국)',
    '한목봉춘괘 (寒木逢春卦 - 차가운 겨울을 지나 봄꽃을 피우는 국)',
    '벽해명주괘 (碧海明珠卦 - 깊은 바다 속에서 마침내 영롱히 빛나는 국)',
  ];
  const patternIdx = (yearStemIdx * 3 + hourStemIdx * 7 + (seed % 5)) % patternNames.length;
  const patternName = patternNames[patternIdx];

  const destinyGrades = [
    '대기만성자수성가국 (大器晩成 自手成家局)',
    '위기돌파개척영웅국 (危機突破 開拓英雄局)',
    '지모수완상화풍요국 (智謀手腕 上和豊饒局)',
    '명리쌍전귀인원조국 (名利雙全 貴人援助局)',
  ];
  const destinyGrade = destinyGrades[(seed >> 2) % destinyGrades.length];

  const starObj = DESTINY_STARS[(yearStemIdx + hourStemIdx + (seed >> 3)) % DESTINY_STARS.length];
  const destinyStar = {
    starName: starObj.starName,
    koreanTitle: starObj.koreanTitle,
    influenceArea: starObj.influenceArea,
    fatefulAura: starObj.fatefulAura,
  };

  const guaStructure: GuiguziGuaStructure = {
    yearStem,
    hourStem,
    patternName,
    destinyGrade,
    destinyStar,
  };

  // 3대 인생 국면 시경(詩境)
  const foundationVerses = [
    { verseLine: '根深葉茂經霜雪 (뿌리가 깊으니 서리와 눈보라 속에서도 잎이 마르지 않고)', modernInterpretation: '초년의 고난과 시행착오는 당신의 영혼을 강인하게 담금질하는 든든한 밑천입니다.' },
    { verseLine: '初年多蹇未爲凶 (초년의 험난함은 흉이 아니요 큰 그릇을 빚는 가마솥이라)', modernInterpretation: '일찍부터 자립심을 키워 남에게 의지하지 않고 독자적 실력을 쌓는 토대를 구축합니다.' },
    { verseLine: '幽谷名花待時發 (그윽한 골짜기의 꽃이 때를 기다려 남몰래 향기를 품으니)', modernInterpretation: '당장은 화려하게 드러나지 않아도 내면에 압도적인 잠재력을 축적하는 시기입니다.' },
  ];
  const journeyVerses = [
    { verseLine: '中途得遇乘風便 (중년의 노상에서 바람을 타는 귀인과 호기를 만나니)', modernInterpretation: '30~40대 전환기에 결정적인 기회와 동업자를 만나 사업과 커리어의 비약적 확장을 이룹니다.' },
    { verseLine: '智謀變化應機宜 (지혜와 계책이 변화무쌍하여 기미에 맞추어 적재적소에 응하니)', modernInterpretation: '고집을 버리고 유연하게 판세를 읽어 위기를 절호의 기회로 뒤집는 전략가로 부상합니다.' },
    { verseLine: '千重江水一帆過 (천 겹의 험한 물결도 순풍에 돛을 단 배처럼 단숨에 가로지른다)', modernInterpretation: '복잡하게 얽힌 문제들을 단칼에 해결하는 결단력으로 입지를 굳건히 다집니다.' },
  ];
  const culminationVerses = [
    { verseLine: '晩境優遊福祿全 (만년의 경계가 한가롭고 유유자적하여 복록이 온전하도다)', modernInterpretation: '피땀 흘려 가꾼 결실이 안정된 시스템과 자산으로 자리 잡아 평온과 존경을 누립니다.' },
    { verseLine: '黃金積玉子孫昌 (황금과 옥을 쌓아 곳간이 넉넉하고 그 지혜가 후대에 이어지니)', modernInterpretation: '물질적 안정뿐 아니라 당신이 남긴 지혜와 유산이 주변 사람들에게 귀감이 됩니다.' },
    { verseLine: '秋月高懸照碧霄 (가을 하늘에 높이 뜬 밝은 달이 푸른 밤하늘을 환히 비추도다)', modernInterpretation: '어지러운 세상의 풍파에서 벗어나 드높은 명예와 평정심으로 원만한 대미를 장식합니다.' },
  ];

  const poetry: ThreePhasesPoetry = {
    foundationPhase: foundationVerses[(seed >> 1) % foundationVerses.length],
    journeyPhase: journeyVerses[(seed >> 2) % journeyVerses.length],
    culminationPhase: culminationVerses[(seed >> 3) % culminationVerses.length],
  };

  // 전략적 결단 매트릭스
  const stances: Array<{
    code: StrategicDecisionMatrix['tacticalStance'];
    label: string;
    patience: number;
    action: number;
    network: string;
    crisis: string;
  }> = [
    {
      code: 'AGGRESSIVE_EXPANSION',
      label: '과감한 선제 진격 (적극적 외연 확장)',
      patience: 35,
      action: 65,
      network: '목표 지향적 전문가들과 연합하여 판을 키우고 주도권을 선점하세요.',
      crisis: '세부 조항과 계약서 검토를 소홀히 하지 말고 뒷문을 단단히 잠그세요.',
    },
    {
      code: 'CONSOLIDATION_DEFENSE',
      label: '내실 방어 및 은인자중 (수비 후 반격)',
      patience: 70,
      action: 30,
      network: '불필요한 대외 노출을 줄이고 핵심 신뢰자 1~2명과만 조용히 내실을 다지세요.',
      crisis: '조급한 확장은 함정이 될 수 있으니 체력과 현금 흐름을 비축하는 것이 상책입니다.',
    },
    {
      code: 'STRATEGIC_ALLIANCE',
      label: '합종연횡 지략 제휴 (외부 레버리지 극대화)',
      patience: 50,
      action: 50,
      network: '상대방의 가려운 곳을 긁어주는 윈-윈 구조를 제안하여 강력한 파트너십을 맺으세요.',
      crisis: '말만 앞세우는 무책임한 조력자를 가려내고 구체적인 역할 분담을 명문화하세요.',
    },
    {
      code: 'INDEPENDENT_BREAKTHROUGH',
      label: '독자 노선 돌파 (원맨 전략적 독주)',
      patience: 40,
      action: 60,
      network: '타인의 조언에 휘둘리지 말고 오직 자신의 직관과 축적된 데이터로 밀어붙이세요.',
      crisis: '주변의 시기와 잡음에 감정적으로 반응하지 말고 오직 결과물로 입증하세요.',
    },
  ];

  const stanceObj = stances[(seed + (now.getUTCDate() % 4)) % stances.length];
  const strategy: StrategicDecisionMatrix = {
    tacticalStance: stanceObj.code,
    tacticalLabel: stanceObj.label,
    patienceVsActionRatio: {
      patiencePercentage: stanceObj.patience,
      actionPercentage: stanceObj.action,
    },
    alliedNetworkAdvice: stanceObj.network,
    crisisAversionKey: stanceObj.crisis,
  };

  const strategicClarityScore = 70 + (seed % 28); // 70 ~ 97

  const temporalGuiguziRhythm = getTemporalGuiguziRhythm(now);
  const situationalGuiguziAudit = /협상|계약|동업|관계|인맥|사람/.test(context)
    ? {
        focusTheme: '합종연횡(合縱連橫)의 명분과 실리 균형',
        tacticalBalanceNote: '상대의 필요를 먼저 읽어 윈-윈 구조를 제시하되 핵심 조건은 문서로 못 박으십시오.',
        diplomacyFocus: strategy.alliedNetworkAdvice,
      }
    : /결정|이직|사업|투자|진로|승부/.test(context)
      ? {
          focusTheme: '선천 년간과 후천 시간의 양두(兩頭) 결단',
          tacticalBalanceNote: `${strategy.tacticalLabel} 기조 아래 무리한 과욕을 피하고 확실한 승부처에만 힘을 모으십시오.`,
          diplomacyFocus: strategy.crisisAversionKey,
        }
      : {
          focusTheme: '3대 국면(기반·행장·결말)의 흐름과 내실 관리',
          tacticalBalanceNote: `${destinyStar.starName}의 강점을 살리면서 수비와 진격의 완급을 조절하십시오.`,
          diplomacyFocus: strategy.alliedNetworkAdvice,
        };

  const guiguziSynthesisMatrix = {
    coreInsight: `[${guaStructure.yearStem}年 ${guaStructure.hourStem}時 · ${guaStructure.patternName}]와 수호성 [${destinyStar.starName}]가 ${situationalGuiguziAudit.focusTheme}을 비춥니다.`,
    recommendedAction: `${strategy.tacticalLabel} — ${strategy.alliedNetworkAdvice}`,
    cautionNotice: strategy.crisisAversionKey,
  };

  const synthesisMessage = `귀곡자 양두겸 분석 결과, 당신의 선천 천명과 후천 귀결은 [${guaStructure.yearStem}年 ${guaStructure.hourStem}時 / ${guaStructure.patternName}]에 해당합니다. 수호성 [${destinyStar.starName}]의 기운을 받아 지금은 [${strategy.tacticalLabel}]의 전술을 펼칠 때이며, "${strategy.crisisAversionKey}"를 명심할 때 필승의 활로가 열립니다.`;

  const reflectiveQuestion = context
    ? `"${context}"의 국면에서 ${guaStructure.destinyStar.starName}의 기운을 살려 지금 먼저 굳히거나 양보할 한 수는 무엇입니까?`
    : `${strategy.tacticalLabel}의 흐름 속에서 오늘 조용히 내실을 지키고 결단을 집중할 승부처는 어디입니까?`;

  const ritualAction = `[${guaStructure.patternName} · ${strategy.tacticalLabel}] 오늘 15분 동안 ${situationalGuiguziAudit.focusTheme}을 기준으로 지금 먼저 굳힐 조건과 양보할 선을 한 줄씩 적어 두세요.`;
  const reflectionFocus = reflectiveQuestion;

  return {
    engineVersion: GUIGUZI_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalGuiguziRhythm.kstTimeLabel,
    guaStructure,
    poetry,
    strategy,
    situationalGuiguziAudit,
    temporalGuiguziRhythm,
    guiguziSynthesisMatrix,
    strategicClarityScore,
    synthesisMessage,
    reflectiveQuestion,
    ritualAction,
    reflectionFocus,
    boundaryNotice: '본 결과는 《귀곡선생양두겸》의 고전 명리·전략 상징 체계에 기반한 정성적 성찰 안내이며, 확정적 승패 판정이 아닙니다.',
    interpretiveBoundary: '본 결과는 《귀곡선생양두겸》의 고전 명리·전략 상징 체계에 기반한 정성적 성찰 안내이며, 확정적 승패 판정이 아닙니다.',
  };
}

export function formatGuiguziLiangtouqianPrompt(report: GuiguziLiangtouqianReport): string {
  const stanceTone =
    report.strategy.patienceVsActionRatio.actionPercentage > report.strategy.patienceVsActionRatio.patiencePercentage
      ? '결단·진격 우위(선제적 움직임과 주도권 확보)'
      : report.strategy.patienceVsActionRatio.patiencePercentage > report.strategy.patienceVsActionRatio.actionPercentage
        ? '인내·수비 우위(내실 비축과 신중한 관망)'
        : '진격·수비 균형(상황에 따른 유연한 합종연횡)';

  return `### 📜 고대 중국 귀곡자(鬼谷子) 양구령 72변화 명리 결단 엔진 (${GUIGUZI_VERSION})
- **연산 시각**: ${report.calculatedAtKst}
- **양두(兩頭) 구조 및 괘명**: [년간 ${report.guaStructure.yearStem} / 시간 ${report.guaStructure.hourStem}] ➔ **${report.guaStructure.patternName}** (${report.guaStructure.destinyGrade})
- **주재 선천 성수**: ${report.guaStructure.destinyStar.starName} [${report.guaStructure.destinyStar.koreanTitle}]
  - 영향 영역: ${report.guaStructure.destinyStar.influenceArea}
  - 운명적 기운: ${report.guaStructure.destinyStar.fatefulAura}
- **귀곡자 3대 국면 시경(詩境)**:
  - 기반국 (초년/기반): "${report.poetry.foundationPhase.verseLine}" ➔ ${report.poetry.foundationPhase.modernInterpretation}
  - 행장국 (중년/처세): "${report.poetry.journeyPhase.verseLine}" ➔ ${report.poetry.journeyPhase.modernInterpretation}
  - 결말국 (만년/결실): "${report.poetry.culminationPhase.verseLine}" ➔ ${report.poetry.culminationPhase.modernInterpretation}
- **종횡가 전략 결단 나침반**:
  - 권고 전술: **${report.strategy.tacticalLabel}** (${stanceTone})
  - 합종연횡 인맥: ${report.strategy.alliedNetworkAdvice}
  - 위험 관리 핵심: ${report.strategy.crisisAversionKey}
- **질문 맥락 감사 (${report.situationalGuiguziAudit.focusTheme})**: ${report.situationalGuiguziAudit.tacticalBalanceNote}
- **KST 시공간 종횡 리듬**: ${report.temporalGuiguziRhythm.zonghengWatchWindow} / ${report.temporalGuiguziRhythm.seasonalCampaignTone}
  - 시공간 지침: ${report.temporalGuiguziRhythm.temporalGuidance}
- **귀곡자 교차 매트릭스**: 핵심(${report.guiguziSynthesisMatrix.coreInsight}) | 실행(${report.guiguziSynthesisMatrix.recommendedAction}) | 주의(${report.guiguziSynthesisMatrix.cautionNotice})
- **귀곡자 통합 나침반**: ${report.synthesisMessage}
- **실천 의례(Ritual Action)**: ${report.ritualAction}
- **질문 맞춤 성찰 질문**: ${report.reflectionFocus}
- **해석 경계**: ${report.boundaryNotice}`;
}
