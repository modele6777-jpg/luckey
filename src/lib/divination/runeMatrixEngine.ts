/**
 * =========================================================================
 * LUCKEY 고대 노르딕 룬 동시성 매트릭스 엔진 (Elder Futhark Rune Matrix Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 고대 북유럽 바이킹과 켈트의 24대 엘더 푸타르크(Elder Futhark) 룬 상징 체계와
 * 3대 아에트(Aett: 프레이르·헤임달·티르의 군단)를 사주 일간 및 질의 시각의
 * 천문 수리와 결정론적으로 연동하여, 현재 사용자의 국면을 관통하는
 * 3대 룬 동시성 스프레드(본질·도전·초월)와 룬 파워 스코어(0~100)를 산출합니다.
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const RUNE_MATRIX_VERSION = 'LUCKEY-RUNE-v2.1.0';

export interface RuneDetail {
  id: number;                  // 1~24
  name: string;                // 영문 룬 명칭 (예: Fehu, Ansuz, Sowilo)
  symbol: string;              // 룬 문자 (예: ᚠ, ᚨ, ᛋ)
  aett: '프레이르(물질·창조)' | '헤임달(시련·변혁)' | '티르(승리·완성)';
  koreanMeaning: string;       // 한국어 상징 의미
  coreArchetype: string;       // 고유 아키타입
  oracleMessage: string;       // 신탁 전언
  prescribedAction: string;    // 상징적 액션 처방
}

export const ELDER_FUTHARK_RUNES: RuneDetail[] = [
  // Freyr's Aett (1~8)
  {
    id: 1, name: 'Fehu', symbol: 'ᚠ', aett: '프레이르(물질·창조)',
    koreanMeaning: '풍요와 재물', coreArchetype: '흐르는 번영',
    oracleMessage: '노력의 결실이 손에 잡히는 시기입니다. 들어온 자원을 고이게 두지 말고 새로운 가치를 위해 현명하게 순환시키세요.',
    prescribedAction: '나를 위한 작은 투자나 소중한 사람에게 작은 선물을 건네는 나눔 리추얼'
  },
  {
    id: 2, name: 'Uruz', symbol: 'ᚢ', aett: '프레이르(물질·창조)',
    koreanMeaning: '야성적 체력과 원초적 힘', coreArchetype: '야생 황소의 생명력',
    oracleMessage: '내면 깊은 곳에서 거대한 에너지가 솟구치고 있습니다. 두려움을 떨쳐내고 몸의 본능적인 활력을 믿으세요.',
    prescribedAction: '심장을 뛰게 만드는 고강도 인터벌 운동과 당당하고 굳건한 자세 유지'
  },
  {
    id: 3, name: 'Thurisaz', symbol: 'ᚦ', aett: '프레이르(물질·창조)',
    koreanMeaning: '토르의 망치와 가시', coreArchetype: '돌파적 방어막',
    oracleMessage: '경계선에 서 있습니다. 무모한 돌진보다는 침착하게 상황을 관찰하고, 나를 침범하려는 노이즈를 단호히 베어내세요.',
    prescribedAction: '경계가 불분명한 요청에 대해 정중하지만 단호한 거절(No) 선언'
  },
  {
    id: 4, name: 'Ansuz', symbol: 'ᚨ', aett: '프레이르(물질·창조)',
    koreanMeaning: '오딘의 지혜와 신성한 영감', coreArchetype: '통찰의 언어',
    oracleMessage: '우주의 직관과 번뜩이는 아이디어가 쏟아지는 국면입니다. 신뢰할 수 있는 멘토와의 대화나 번뜩이는 직관을 글과 코드로 기록하세요.',
    prescribedAction: '떠오르는 영감을 한 단어도 놓치지 않고 메모하는 브레인스톰 세션'
  },
  {
    id: 5, name: 'Raidho', symbol: 'ᚱ', aett: '프레이르(물질·창조)',
    koreanMeaning: '여정과 수레바퀴', coreArchetype: '올바른 길의 순환',
    oracleMessage: '삶의 방향키를 내가 쥐고 있습니다. 외부의 소음에 흔들리지 말고 내 원칙과 로드맵대로 흔들림 없이 나아가세요.',
    prescribedAction: '오늘의 최우선 우선순위 3가지를 명확히 재정렬하고 군더더기 동선 제거'
  },
  {
    id: 6, name: 'Kenaz', symbol: 'ᚲ', aett: '프레이르(물질·창조)',
    koreanMeaning: '횃불과 지적 조명', coreArchetype: '창조적 통찰의 불꽃',
    oracleMessage: '어둠 속에 횃불이 켜지듯 그동안 보이지 않던 문제의 실마리가 명쾌하게 드러납니다. 기술과 장인정신을 연마할 적기입니다.',
    prescribedAction: '복잡한 버그나 아키텍처의 근본 원인을 끝까지 파고들어 명쾌히 규명하기'
  },
  {
    id: 7, name: 'Gebo', symbol: 'ᚷ', aett: '프레이르(물질·창조)',
    koreanMeaning: '선물과 동등한 결속', coreArchetype: '상호 존중의 파트너십',
    oracleMessage: '일방적인 희생도 착취도 아닌, 서로의 가치를 인정하는 진정한 시너지가 열립니다. 신뢰를 기반으로 협력하세요.',
    prescribedAction: '핵심 동료에게 감사 표현을 전하거나 공정한 협업 조건 명문화'
  },
  {
    id: 8, name: 'Wunjo', symbol: 'ᚹ', aett: '프레이르(물질·창조)',
    koreanMeaning: '환희와 성취의 깃발', coreArchetype: '조화로운 승리',
    oracleMessage: '어려웠던 고비를 넘어 기쁨과 보람이 찾아오는 순간입니다. 성과를 온전히 축하하고 내적 평온을 만끽하세요.',
    prescribedAction: '작은 마일스톤 달성을 스스로에게 자축하고 충분한 휴식 보상 주기'
  },

  // Heimdall's Aett (9~16)
  {
    id: 9, name: 'Hagalaz', symbol: 'ᚺ', aett: '헤임달(시련·변혁)',
    koreanMeaning: '우박과 파괴적 정화', coreArchetype: '급진적 패러다임 전환',
    oracleMessage: '예상치 못한 급변이나 충격은 낡은 구조를 무너뜨리고 더 단단한 새 터전을 만들기 위한 우주적 대청소입니다.',
    prescribedAction: '과거의 레거시나 미련을 깨끗이 털어내고 백지에서 다시 시작하는 용기'
  },
  {
    id: 10, name: 'Nauthiz', symbol: 'ᚾ', aett: '헤임달(시련·변혁)',
    koreanMeaning: '결핍과 불꽃의 압박', coreArchetype: '제약 속의 독창성',
    oracleMessage: '자원의 부족이나 제약은 오히려 천재성을 자극하는 최고의 스승입니다. 결핍을 엔진 삼아 돌파구를 만드세요.',
    prescribedAction: '한정된 시간과 자원 안에서 가장 심플하고 본질적인 기능 하나만 먼저 완성하기'
  },
  {
    id: 11, name: 'Isa', symbol: 'ᛁ', aett: '헤임달(시련·변혁)',
    koreanMeaning: '얼음과 고요한 멈춤', coreArchetype: '내적 응축과 냉각',
    oracleMessage: '지금은 무리하게 움직일 때가 아니라 얼음처럼 단단히 중심을 지키며 내실을 다질 때입니다. 봄을 기다리는 침묵입니다.',
    prescribedAction: '충동적인 확장이나 계약을 일시 보류하고 기존 시스템 안정화에 집중'
  },
  {
    id: 12, name: 'Jera', symbol: 'ᛃ', aett: '헤임달(시련·변혁)',
    koreanMeaning: '수확과 계절의 순환', coreArchetype: '인과의 정당한 결실',
    oracleMessage: '봄에 씨를 뿌리고 여름을 견딘 자만이 가을의 풍요를 얻습니다. 하루아침의 요행을 바라지 말고 꾸준한 루틴을 믿으세요.',
    prescribedAction: '매일 반복하는 코어 습관과 커밋을 묵묵히 완수하며 복리의 힘 기다리기'
  },
  {
    id: 13, name: 'Eihwaz', symbol: 'ᛇ', aett: '헤임달(시련·변혁)',
    koreanMeaning: '주목나무와 불굴의 인내', coreArchetype: '뿌리 깊은 생명력',
    oracleMessage: '거친 비바람 속에서도 주목나무는 깊은 뿌리로 버텨냅니다. 일시적 난관에 흔들리지 않는 장기적 비전을 유지하세요.',
    prescribedAction: '단기 손익에 일희일비하지 않고 3년 뒤, 5년 뒤의 거대한 로드맵 상기'
  },
  {
    id: 14, name: 'Perthro', symbol: 'ᛈ', aett: '헤임달(시련·변혁)',
    koreanMeaning: '운명의 컵과 숨겨진 비의', coreArchetype: '우연을 가장한 필연',
    oracleMessage: '모든 패가 공개되지 않은 신비로운 안개 속입니다. 감춰진 진실과 직관의 암호가 곧 풀릴 것이니 예리한 감각을 곤두세우세요.',
    prescribedAction: '꿈이나 스쳐 지나가는 직관적 동시성(Synchronicity) 메모'
  },
  {
    id: 15, name: 'Algiz', symbol: 'ᛉ', aett: '헤임달(시련·변혁)',
    koreanMeaning: '엘크의 뿔과 신성한 수호', coreArchetype: '절대적 영적 방패',
    oracleMessage: '보이지 않는 거대한 수호의 빛이 당신을 감싸고 있습니다. 안전한 울타리 안에서 확신을 가지고 도전하세요.',
    prescribedAction: '부정적인 사람이나 에너지 흡혈귀와의 대화를 차단하고 나만의 성소 보호'
  },
  {
    id: 16, name: 'Sowilo', symbol: 'ᛋ', aett: '헤임달(시련·변혁)',
    koreanMeaning: '태양의 빛과 절대 승리', coreArchetype: '승리의 불멸성',
    oracleMessage: '태양이 먹구름을 뚫고 찬란하게 솟구칩니다. 온 우주가 당신의 승리와 성취를 응원하고 있으니 온 힘을 다해 완주하세요.',
    prescribedAction: '가장 자신 있는 핵심 무기를 전면에 내세우며 당당하게 결과물 발표'
  },

  // Tyr's Aett (17~24)
  {
    id: 17, name: 'Tiwaz', symbol: 'ᛏ', aett: '티르(승리·완성)',
    koreanMeaning: '정의의 신 티르의 검', coreArchetype: '원칙과 명예로운 용기',
    oracleMessage: '사리사욕을 넘어 대의명분과 높은 원칙을 세울 때 무적의 권능이 주어집니다. 올바른 신념을 당당히 수호하세요.',
    prescribedAction: '타협하지 않는 높은 퀄리티 기준을 선언하고 솔선수범하기'
  },
  {
    id: 18, name: 'Berkano', symbol: 'ᛒ', aett: '티르(승리·완성)',
    koreanMeaning: '자작나무와 새로운 탄생', coreArchetype: '비옥한 모성적 양육',
    oracleMessage: '새로운 프로젝트나 아이디어가 싹을 틔우고 있습니다. 조급해하지 말고 부드러운 인내로 성장을 돌보세요.',
    prescribedAction: '신규 기능의 뼈대를 부드럽게 세우고 초기 유저 피드백을 따뜻하게 수렴하기'
  },
  {
    id: 19, name: 'Ehwaz', symbol: 'ᛖ', aett: '티르(승리·완성)',
    koreanMeaning: '신마(神馬)와 조화로운 전진', coreArchetype: '역동적인 팀워크',
    oracleMessage: '말과 기수가 하나 되어 대지를 질주하듯, 완벽한 호흡과 도구의 조력으로 가속도가 붙는 국면입니다.',
    prescribedAction: '최신 자동화 툴이나 신뢰할 수 있는 파트너와의 협업 파이프라인 정비'
  },
  {
    id: 20, name: 'Mannaz', symbol: 'ᛗ', aett: '티르(승리·완성)',
    koreanMeaning: '인간과 자아의 성찰', coreArchetype: '성숙한 공감과 연대',
    oracleMessage: '모든 위대한 성취의 중심에는 사람이 있습니다. 진정성 있는 공감과 열린 마음으로 사람들의 마음을 얻으세요.',
    prescribedAction: '유저의 입장에서 진정으로 필요한 고통이 무엇인지 역지사지로 들여다보기'
  },
  {
    id: 21, name: 'Laguz', symbol: 'ᛚ', aett: '티르(승리·완성)',
    koreanMeaning: '물과 무의식의 강', coreArchetype: '거스를 수 없는 플로우',
    oracleMessage: '억지로 강물의 흐름을 거스르려 하지 말고 자연스러운 흐름에 몸을 맡기세요. 무의식의 직관이 가장 빠른 길을 안내합니다.',
    prescribedAction: '논리적 계산을 잠시 내려놓고 첫 느낌과 본능적인 끌림을 따라가기'
  },
  {
    id: 22, name: 'Ingwaz', symbol: 'ᛝ', aett: '티르(승리·완성)',
    koreanMeaning: '대지의 신 잉그와 씨앗', coreArchetype: '잠재력의 완벽한 잉태',
    oracleMessage: '씨앗이 땅속에서 완전한 형태를 갖추었으니 곧 껍질을 깨고 세상으로 도약할 준비가 끝났습니다. 마무리 정리에 집중하세요.',
    prescribedAction: '핵심 과업의 마지막 디테일을 마침표 찍고 다음 단계로의 이행 선언'
  },
  {
    id: 23, name: 'Dagaz', symbol: 'ᛞ', aett: '티르(승리·완성)',
    koreanMeaning: '여명과 거대한 패러다임 시프트', coreArchetype: '어둠을 뚫는 새날',
    oracleMessage: '밤이 끝나고 새벽의 첫 빛이 비칩니다. 과거의 한계가 단숨에 깨지고 완전히 새로운 차원으로 점프하는 순간입니다.',
    prescribedAction: '획기적인 신규 버전 배포나 인생의 새로운 챕터 열기'
  },
  {
    id: 24, name: 'Othala', symbol: 'ᛟ', aett: '티르(승리·완성)',
    koreanMeaning: '조상의 유산과 진정한 고향', coreArchetype: '뿌리 깊은 가문의 영광',
    oracleMessage: '수많은 시련을 거쳐 마침내 내가 진정으로 머물 나만의 견고한 영토와 본질적 유산을 확립했습니다.',
    prescribedAction: '나만의 오리지널리티와 독보적인 브랜드 아이덴티티 확립'
  }
];

export interface RuneSpreadResult {
  originRune: RuneDetail;       // 1. 기원/본질 룬
  challengeRune: RuneDetail;    // 2. 도전/열쇠 룬
  horizonRune: RuneDetail;      // 3. 초월/성취 룬
}

export interface RuneMatrixResult {
  engineVersion: string;
  calculatedAtIso: string;
  calculatedAtKst: string;

  spread: RuneSpreadResult;

  // 룬 신탁 종합 파워 스코어 (0~100)
  runePowerScore: number;
  oracleStateTitle: string;

  summary: string;
  runeSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  interpretiveBoundary: string;
}

function formatRuneKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} KST`;
}

/**
 * 룬 동시성 매트릭스 엔진 메인 연산
 */
export function calculateRuneMatrix(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): RuneMatrixResult {
  const now = params?.targetDate || new Date();
  const q = params?.question?.trim() || '';
  const saju = params?.saju || calculateDetailedSaju(params?.profile || null);

  // 결정론적 시드 산출 (생년월일 + 일간 + 당일 날짜)
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dayGanCode = saju.pillars.day.gan.charCodeAt(0);
  const dayZhiCode = saju.pillars.day.zhi.charCodeAt(0);

  const baseSeed = year * 10000 + month * 100 + day + dayGanCode + dayZhiCode;

  // 3개 룬 결정론적 선택
  const idx1 = Math.abs(baseSeed) % 24;
  const idx2 = Math.abs(baseSeed * 7 + 13) % 24;
  const idx3 = Math.abs(baseSeed * 13 + 37) % 24;

  const originRune = ELDER_FUTHARK_RUNES[idx1];
  const challengeRune = ELDER_FUTHARK_RUNES[idx2 !== idx1 ? idx2 : (idx2 + 1) % 24];
  const horizonRune = ELDER_FUTHARK_RUNES[idx3 !== idx1 && idx3 !== idx2 ? idx3 : (idx3 + 2) % 24];

  // 파워 스코어 산출
  let runePowerScore = 85;
  if (horizonRune.name === 'Sowilo' || horizonRune.name === 'Dagaz' || horizonRune.name === 'Wunjo') {
    runePowerScore += 10;
  } else if (horizonRune.name === 'Tiwaz' || horizonRune.name === 'Ansuz') {
    runePowerScore += 8;
  }
  runePowerScore = Math.min(99, runePowerScore);

  let oracleStateTitle = '오딘의 신성한 지혜 공명 (Sacred Rune Resonance)';
  if (runePowerScore >= 92) oracleStateTitle = '절대 승리의 태양 신탁 (Solar Triumph Oracle)';
  else if (runePowerScore >= 80) oracleStateTitle = '단단한 성취의 수호 신탁 (Guardian Fortune Oracle)';
  else oracleStateTitle = '내적 성찰과 시련 극복기 (Initiation Oracle)';

  const summary = `[룬 매트릭스] 본질: ${originRune.name}(${originRune.symbol}) / ` +
    `도전: ${challengeRune.name}(${challengeRune.symbol}) / ` +
    `초월: ${horizonRune.name}(${horizonRune.symbol}). ` +
    `상태: [${oracleStateTitle}].`;

  const calculatedAtKst = formatRuneKstTimestamp(now);
  const runeSynthesisMatrix = {
    dominantTension: `${originRune.name}(${originRune.symbol}) ↔ ${challengeRune.name}(${challengeRune.symbol})`,
    alignmentState: `${oracleStateTitle} · ${horizonRune.name}(${horizonRune.symbol})`,
    integratedAction: `${challengeRune.prescribedAction}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  return {
    engineVersion: RUNE_MATRIX_VERSION,
    calculatedAtIso: now.toISOString(),
    calculatedAtKst,
    spread: {
      originRune,
      challengeRune,
      horizonRune
    },
    runePowerScore,
    oracleStateTitle,
    summary,
    runeSynthesisMatrix,
    interpretiveBoundary: '본 엘더 푸타르크 룬 동시성 리포트는 북유럽 룬 상징 체계에 기반한 정성적 성찰 안내이며, 확정적 미래 예언이 아닙니다.',
  };
}

/**
 * 프롬프트 주입용 포맷터
 */
export function formatRuneMatrixPrompt(res: RuneMatrixResult): string {
  const { originRune, challengeRune, horizonRune } = res.spread;
  const lines = [
    `[고대 노르딕 룬 동시성 매트릭스 엔진 리포트 (엔진: ${res.engineVersion} | 연산 시각: ${res.calculatedAtKst})]`,
    `- 3대 룬 동시성 스프레드:`,
    `  1. **기원/본질 룬**: [${originRune.symbol} **${originRune.name}**] (${originRune.koreanMeaning}) - ${originRune.aett}`,
    `     • 아키타입: ${originRune.coreArchetype}`,
    `     • 신탁: ${originRune.oracleMessage}`,
    `  2. **도전/열쇠 룬**: [${challengeRune.symbol} **${challengeRune.name}**] (${challengeRune.koreanMeaning}) - ${challengeRune.aett}`,
    `     • 아키타입: ${challengeRune.coreArchetype}`,
    `     • 극복 열쇠: ${challengeRune.oracleMessage}`,
    `     • 액션 처방: ${challengeRune.prescribedAction}`,
    `  3. **초월/성취 룬**: [${horizonRune.symbol} **${horizonRune.name}**] (${horizonRune.koreanMeaning}) - ${horizonRune.aett}`,
    `     • 아키타입: ${horizonRune.coreArchetype}`,
    `     • 궁극적 미래: ${horizonRune.oracleMessage}`,
    `- 룬 오라클 위상: [${res.oracleStateTitle}]`,
  ];
  if (res.runeSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.runeSynthesisMatrix.dominantTension} | 조율 상태: ${res.runeSynthesisMatrix.alignmentState}]`,
      `  • 통합 실천: ${res.runeSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`- 해석 경계: ${res.interpretiveBoundary}`);
  lines.push(
    `※ 루시 지침: 룬 문자는 거친 북해를 건너던 바이킹들이 자연의 법칙과 운명의 신비를 새겨 넣은 강력한 수호 상징입니다. 오늘 사용자의 무의식을 관통하는 3개의 룬 상징을 통해, 지금 마주한 도전 과제를 돌파하고 찬란한 성취(Sowilo/Dagaz)로 나아갈 수 있도록 북유럽 신화의 용기와 지혜를 담아 대화에 융합해 주세요.`,
  );
  return lines.join('\n');
}
