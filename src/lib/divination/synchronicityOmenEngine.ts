/**
 * =========================================================================
 * LUCKEY 칼 융 동시성 징조 해독 & 오멘 매트릭스 엔진 (Jungian Synchronicity Omen Decoding Engine)
 * =========================================================================
 * 
 * [엔진 개요]
 * 칼 구스타프 융(Carl G. Jung)의 동시성(Synchronicity: 비인과적 연관성 원리)과
 * 고대 전조·오멘(Omen) 상징학, 우주의 깜빡임(Cosmic Winks / Glitch in the Matrix) 현상을
 * 사주 4주 원국 및 현재 일진(Daily Pillar)의 공명장에 결합한 결정론적 우주 신호 해독 엔진입니다.
 * 
 * 1. 동시성 주 활성 채널: 엔젤 넘버(반복 숫자), 우연한 만남/대화, 상징적 동물, 공명하는 사물
 * 2. 우주적 신호성 판별: GREEN_ACCELERATE(과감한 추진/직진), AMBER_PAUSE_OBSERVE(잠시 멈춤/신중한 재점검), GOLDEN_QUANTUM_LEAP(퀀텀 도약/패러다임 전환)
 * 3. 향후 24시간 집중 주시해야 할 3대 우주적 징조 심볼 및 동시성 각성 리추얼 도출
 */

import type { UserProfile } from '../sharedState';
import {
  calculateDetailedSaju,
  type SajuAnalysisResult
} from '../sajuAnalysis';

export const SYNCHRONICITY_OMEN_VERSION = 'LUCKEY-SYNCHRONICITY-OMEN-v2.2.0';

function formatSynchronicityKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

export type ManifestationSignalType = 'GREEN_ACCELERATE' | 'AMBER_PAUSE_OBSERVE' | 'GOLDEN_QUANTUM_LEAP';

export interface SynchronicityChannelDetails {
  primaryChannelName: string;     // 주 활성 동시성 채널 (예: 엔젤 넘버, 우연한 청각 메시지 등)
  manifestationSignal: ManifestationSignalType; // 우주 신호 판별
  signalSummary: string;          // 신호 요약 (추진 / 관조 / 퀀텀 도약)
  cosmicWinkMeaning: string;      // 우주가 던지는 윙크의 영적 의미
  resonanceSensitivityScore: number; // 동시성 감응 지수 (0 ~ 100)
}

export interface SynchronicityOmenReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  dominantOmenTheme: string;      // 현재 공명하는 오멘 테마
  synchronicityChannel: SynchronicityChannelDetails;
  twentyFourHourWatchSymbols: string[]; // 향후 24시간 주목할 3대 상징
  matrixGlitchDecodingGuidance: string; // 현실의 틈새(Glitch) 해독 가이드
  synchronicityCaptureRitual: {
    ritualName: string;
    actionStep: string;
  };
  synthesisPromptGuidance: string;
  synchronicitySynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

export function runSynchronicityOmenEngine(
  profile?: UserProfile,
  targetDate: Date = new Date(),
  question?: string
): SynchronicityOmenReport {
  const sajuRes = calculateDetailedSaju(profile || null);

  const dayMaster = sajuRes?.pillars?.day?.gan || '경';
  const dayBranch = sajuRes?.pillars?.day?.zhi || '술';
  const element = sajuRes?.dayMaster?.element || '금';

  // 수리 연산 시드
  const ganCode = dayMaster.charCodeAt(0) + dayBranch.charCodeAt(0);
  const daySeed = targetDate.getFullYear() * 7 + (targetDate.getMonth() + 1) * 13 + targetDate.getDate() * 29;
  const seed = Math.abs((ganCode * 41 + daySeed) % 1000);

  let dominantOmenTheme: string;
  let primaryChannelName: string;
  let manifestationSignal: ManifestationSignalType;
  let signalSummary: string;
  let cosmicWinkMeaning: string;
  let twentyFourHourWatchSymbols: string[];
  let matrixGlitchDecodingGuidance: string;
  let ritualName: string;
  let actionStep: string;

  if (element === '화') {
    dominantOmenTheme = '불꽃의 영감과 돌발적 동기화 (Flash of Solar Synchronization)';
    primaryChannelName = '반복되는 강렬한 빛 또는 깜빡이는 숫자 (111, 777)';
    manifestationSignal = 'GREEN_ACCELERATE';
    signalSummary = '우주적 청신호: 주저하지 말고 가슴이 뛰는 즉시 직진하여 추진할 때';
    cosmicWinkMeaning = '우주가 당신의 아이디어에 불을 붙였습니다. 망설임은 의심을 낳으니 확신을 갖고 행동으로 옮기세요.';
    twentyFourHourWatchSymbols = ['111 또는 777 연속 숫자', '우연히 눈에 띄는 붉은색 깃털이나 단풍', '갑작스럽게 떠오른 옛 동료나 친구의 연락'];
    matrixGlitchDecodingGuidance = '길을 걷다 유난히 번쩍이는 불빛이나 눈길을 사로잡는 간판 문구를 발견한다면, 그것은 현재 고민 중인 질문에 대한 우주의 직접적인 즉답입니다.';
    ritualName = '불꽃 영감 포착 30초 메모 리추얼';
    actionStep = '문득 스치는 생각이나 직관이 들 때 미루지 말고 스마트폰 메모장에 단 한 줄이라도 즉각 기록하여 파동을 지상에 고정하기';
  } else if (element === '수') {
    dominantOmenTheme = '심연의 직관과 유기적 흐름 (Whispers of Oceanic Synchronicity)';
    primaryChannelName = '꿈의 잔상, 우연히 귓가를 스치는 노랫말이나 라디오 멘트';
    manifestationSignal = 'GOLDEN_QUANTUM_LEAP';
    signalSummary = '퀀텀 도약 신호: 보이지 않는 차원에서 거대한 의식 전환과 판도 변화가 일어나는 중';
    cosmicWinkMeaning = '당신이 애쓰지 않아도 모든 퍼즐 조각이 신성한 완벽함 속에서 스스로 제자리를 찾아가고 있습니다.';
    twentyFourHourWatchSymbols = ['물방울 또는 거울에 비친 우연한 반영', '222 또는 888 연속 숫자', '길에서 마주치는 푸른색 새나 고양이의 눈맞춤'];
    matrixGlitchDecodingGuidance = '무심코 튼 음악의 첫 소절이나 카페 옆 테이블에서 들려오는 단어가 마음에 꽂힌다면, 무의식이 당신에게 보내는 암호문입니다.';
    ritualName = '거울 앞 심연의 직관 응시 리추얼';
    actionStep = '외출 전 거울 속 자신의 눈동자를 5초간 가만히 바라보며 "우주여, 오늘 내게 보여줄 징조를 온전히 알아차리겠습니다"라고 마음속으로 말하기';
  } else if (element === '목') {
    dominantOmenTheme = '새로운 싹과 인연의 연결망 (Green Sprout Synchronicity Web)';
    primaryChannelName = '우연한 추천 도서, 뜻밖의 장소에서 마주친 낯익은 사람';
    manifestationSignal = 'GREEN_ACCELERATE';
    signalSummary = '성장 가속 신호: 새로운 인연과 기회의 문이 연쇄적으로 열리는 타이밍';
    cosmicWinkMeaning = '작은 우연 하나가 앞으로 몇 년을 좌우할 거대한 기회의 시작점입니다. 호기심을 따라 발걸음을 옮기세요.';
    twentyFourHourWatchSymbols = ['333 또는 444 연속 숫자', '보도블록 틈새에 피어난 푸른 풀잎이나 새싹', '갑자기 마주친 책의 목차나 서점의 첫 진열대'];
    matrixGlitchDecodingGuidance = '전혀 상관없다고 생각했던 두 개의 정보가 하나로 연결되는 "아하!"의 순간이 온다면 그것이 바로 퀀텀 게이트입니다.';
    ritualName = '푸른 연결 감사 리추얼';
    actionStep = '오늘 하루 마주친 기분 좋은 우연을 발견할 때마다 손가락을 가볍게 튕기며 우주의 배려에 내면으로 감사 표하기';
  } else if (element === '금') {
    dominantOmenTheme = '다이아몬드 질서와 정확한 타이밍 (Precision Clockwork Synchronicity)';
    primaryChannelName = '초 단위의 시계 일치(11:11, 22:22), 정확히 맞아떨어지는 우연한 일정';
    manifestationSignal = 'AMBER_PAUSE_OBSERVE';
    signalSummary = '신중한 관조 신호: 서두르지 말고 세부 조건을 꼼꼼히 점검하며 완벽한 타이밍을 기다릴 때';
    cosmicWinkMeaning = '서두르면 정밀함을 잃습니다. 우주의 시계추는 오차 없이 작동하고 있으니 조급함을 내려놓고 관찰하세요.';
    twentyFourHourWatchSymbols = ['11:11 또는 444 시각의 우연한 확인', '반짝이는 금속성 물건이나 흰색 깃털', '정확히 들어맞는 대중교통 도착 시간'];
    matrixGlitchDecodingGuidance = '기계나 전자기기에서 일시적인 멈춤이나 오류가 발생한다면, 그것은 속도를 늦추고 심호흡하라는 우주의 보호성 정지 신호입니다.';
    ritualName = '11:11 호흡 정렬 리추얼';
    actionStep = '시계에서 대칭 숫자를 보거나 정각을 마주칠 때 10초간 호흡을 멈추고 척추를 곧게 펴며 내면의 중심축을 재정렬하기';
  } else {
    // 토 (Earth)
    dominantOmenTheme = '황금 대지의 정박과 풍요의 전조 (Golden Earth Omen of Abundance)';
    primaryChannelName = '예상치 못한 소소한 물질적 선물, 길에서 발견한 동전이나 상징물';
    manifestationSignal = 'GOLDEN_QUANTUM_LEAP';
    signalSummary = '풍요의 퀀텀 도약: 오랫동안 묵묵히 다져온 기반 위에서 드디어 결실이 맺히는 징조';
    cosmicWinkMeaning = '우주가 당신의 헌신과 노고를 기억하고 있습니다. 이제 주어지는 풍요를 겸허하고 당당하게 수용하세요.';
    twentyFourHourWatchSymbols = ['555 또는 888 연속 숫자', '길에서 발견한 동전이나 독특한 모양의 돌멩이', '예상치 않게 건네받은 따뜻한 간식이나 음료'];
    matrixGlitchDecodingGuidance = '물건을 잃어버렸다가 엉뚱한 장소에서 되찾거나 예기치 않은 소식이 날아든다면 묵은 에너지가 청산되고 새로운 복이 들어오는 징후입니다.';
    ritualName = '대지 선물 수용 리추얼';
    actionStep = '우연히 작은 행운이나 친절을 받았을 때 "감사히 받겠습니다"라며 기쁘게 수용하고 내면의 결핍감을 즉시 지워내기';
  }

  const resonanceSensitivityScore = 85 + (seed % 15);
  const calculatedAtKst = formatSynchronicityKstTimestamp(targetDate);
  const q = (question || '').trim();
  const synchronicitySynthesisMatrix = {
    dominantTension: `${manifestationSignal} ↔ ${primaryChannelName}`,
    alignmentState: `오멘 테마: ${dominantOmenTheme} · 오행: ${element} (${dayMaster}${dayBranch})`,
    integratedAction: `${ritualName}: ${actionStep}${q ? ` [질문 맥락: ${q}]` : ''}`,
  };

  const interpretiveBoundary = '본 칼 융 동시성 징조 해독 리포트는 비인과적 상징 공명과 사주 오행 데이터를 결합한 성찰 안내이며, 일상적 우연의 확정적 예언이나 의학적·법적 판단을 대체하지 않습니다.';
  const reflectiveQuestion = q
    ? `'${q}'와 관련해 최근 자꾸 눈길이나 발길이 멈추는 ${primaryChannelName}의 반복 신호가 내게 건네려는 메시지는 무엇인가요?`
    : `오늘 하루 스쳐 지나가는 사소한 우연 속에서 내가 지금 가장 알아차려 주길 기다리는 내면의 신호는 무엇인가요?`;

  const synthesisPromptGuidance = `[LUCKEY 칼 융 동시성 징조 해독 & 오멘 매트릭스 ${SYNCHRONICITY_OMEN_VERSION} | ${calculatedAtKst}]
- 동시성 오멘 테마: [${dominantOmenTheme}]
- 주 활성 채널: ${primaryChannelName}
- 우주적 신호성 판별: [${manifestationSignal}] - ${signalSummary}
- 우주의 윙크(Cosmic Wink) 의미: "${cosmicWinkMeaning}"
- 24시간 집중 주시 상징 심볼 3선:
  1. ${twentyFourHourWatchSymbols[0]}
  2. ${twentyFourHourWatchSymbols[1]}
  3. ${twentyFourHourWatchSymbols[2]}
- 현실 틈새(Matrix Glitch) 해독 가이드: ${matrixGlitchDecodingGuidance}
- 동시성 각성 실천 리추얼: [${ritualName}] - ${actionStep}
- 교차 매트릭스: [핵심 긴장: ${synchronicitySynthesisMatrix.dominantTension} | 조율 상태: ${synchronicitySynthesisMatrix.alignmentState}]
  * 통합 실천: ${synchronicitySynthesisMatrix.integratedAction}
- 질문 맞춤 성찰 질문: ${reflectiveQuestion}
- 해석 경계: ${interpretiveBoundary}`;

  return {
    engineVersion: SYNCHRONICITY_OMEN_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst,
    dominantOmenTheme,
    synchronicityChannel: {
      primaryChannelName,
      manifestationSignal,
      signalSummary,
      cosmicWinkMeaning,
      resonanceSensitivityScore
    },
    twentyFourHourWatchSymbols,
    matrixGlitchDecodingGuidance,
    synchronicityCaptureRitual: {
      ritualName,
      actionStep
    },
    synthesisPromptGuidance,
    synchronicitySynthesisMatrix,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export type SynchronicityOmenResult = SynchronicityOmenReport;

export function calculateSynchronicityOmen(params?: {
  profile?: UserProfile | null;
  saju?: SajuAnalysisResult | null;
  targetDate?: Date;
  question?: string;
}): SynchronicityOmenResult {
  const profile = params?.profile || undefined;
  const targetDate = params?.targetDate || new Date();
  return runSynchronicityOmenEngine(profile, targetDate, params?.question);
}

export function formatSynchronicityOmenPrompt(res: SynchronicityOmenResult): string {
  return res.synthesisPromptGuidance;
}
