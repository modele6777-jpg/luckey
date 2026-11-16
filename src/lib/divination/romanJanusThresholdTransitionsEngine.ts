/**
 * Ancient Roman Janus Threshold & Temporal Transitions Engine
 * 고대 로마 평화와 시작의 신 야누스(Janus Bifrons) 2대 얼굴 시공간 문턱 & 전환기 성찰 엔진
 *
 * Version: LUCKEY-ROMAN-JANUS-v1.1.0
 */

import type { UserProfile } from '../sharedState';

export const ROMAN_JANUS_ENGINE_VERSION = 'LUCKEY-ROMAN-JANUS-v2.1.0';

export type JanusQuestionFocus = 'relationship' | 'decision' | 'healing' | 'reflection';
export type JanusLiminalPhase = 'THRESHOLD_CLOSURE' | 'PASSAGE_OPENING' | 'BOUNDARY_GUARD' | 'COVENANT_BRIDGE';

export interface RomanJanusParams {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}

export interface RomanJanusReport {
  engineVersion: string;
  calculatedAtKst: string;
  questionFocus: JanusQuestionFocus;
  pastClosureScore: number; // 내부 정렬용 (프롬프트 비노출)
  futureReadinessScore: number; // 내부 정렬용 (프롬프트 비노출)
  thresholdBalanceScore: number; // 내부 정렬용 (프롬프트 비노출)
  liminalPhase: JanusLiminalPhase;
  retrospectInsight: string; // 뒤를 보는 얼굴(과거 정리)
  prospectMomentum: string; // 앞을 보는 얼굴(미래 전망)
  activeJanusGateway: {
    gatewayNumber: number;
    gatewayNameKo: string;
    gatewayNameLa: string;
    portalSymbol: string;
    actionKey: string;
  };
  secondaryJanusGateway: {
    gatewayNumber: number;
    gatewayNameKo: string;
    gatewayNameLa: string;
    portalSymbol: string;
    actionKey: string;
  };
  janusTempleDoorStatus: 'OPEN' | 'CLOSED';
  sacredKeyPrescription: string;
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  counselNote: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  janusSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatJanusKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function buildJanusReflectiveQuestion(gatewayNameKo: string, reflectionFocus: string, question?: string): string {
  const focus = question?.trim();
  if (focus) {
    return `'${focus}'라는 문턱 앞에서 ${gatewayNameKo}을 지날 때, 과거에 감사히 두고 갈 것과 앞으로 가져갈 한 가지는 각각 무엇인가요?`;
  }
  return reflectionFocus;
}

function describeJanusStage(score: number, doorStatus: 'OPEN' | 'CLOSED'): string {
  if (doorStatus === 'OPEN' && score >= 75) {
    return '개방 전환기(Porta Patulcius) — 지나온 경험이 정돈되어 새 문턱 너머로 힘차게 발걸음을 옮길 수 있는 시기';
  }
  if (doorStatus === 'OPEN') {
    return '여명 시동기(Porta Matutina) — 미련을 가볍게 털어내고 작지만 분명한 첫 실행을 열어야 하는 시기';
  }
  return '성문 수호기(Porta Clusivius) — 외연 확장보다 내면의 경계와 평화를 먼저 단단히 지키는 정비기';
}

const JANUS_GATEWAYS = [
  {
    gatewayNumber: 1,
    gatewayNameKo: '마투타 여명의 관문',
    gatewayNameLa: 'Porta Matutina',
    portalSymbol: '아침의 빛과 새로운 흐름의 첫 발걸음',
    actionKey: '어제의 미완성 과제를 자책하지 말고 가장 명료한 첫 단계부터 가볍게 착수하세요.',
    phase: 'PASSAGE_OPENING' as JanusLiminalPhase,
  },
  {
    gatewayNumber: 2,
    gatewayNameKo: '파툴키우스 개방의 관문',
    gatewayNameLa: 'Porta Patulcius',
    portalSymbol: '닫혀 있던 대화와 기회의 문이 열리는 확장 국면',
    actionKey: '망설이던 연락이나 제안을 지금 정리해 건네고 협업의 문을 열어 두세요.',
    phase: 'PASSAGE_OPENING' as JanusLiminalPhase,
  },
  {
    gatewayNumber: 3,
    gatewayNameKo: '클루시비우스 방어의 관문',
    gatewayNameLa: 'Porta Clusivius',
    portalSymbol: '경계선을 단호히 닫고 내면의 평화를 지키는 빗장',
    actionKey: '에너지를 소모시키는 일정이나 무리한 요청을 정중히 거절하여 중심을 보호하세요.',
    phase: 'BOUNDARY_GUARD' as JanusLiminalPhase,
  },
  {
    gatewayNumber: 4,
    gatewayNameKo: '쿠리알리스 화합의 관문',
    gatewayNameLa: 'Porta Curialis',
    portalSymbol: '오랜 엇갈림을 매듭짓고 상호 존중의 질서를 세우는 중심',
    actionKey: '묵은 오해를 풀기 위한 담백한 한마디나 조건 정리를 통해 관계의 균형을 맞추세요.',
    phase: 'COVENANT_BRIDGE' as JanusLiminalPhase,
  },
];

const JANUS_PRESCRIPTIONS = [
  '야누스의 황금 열쇠: 끝난 것을 억지로 붙잡지 않을 때, 비로소 다음 문턱이 자연스럽게 열립니다.',
  '야누스의 상아 지팡이: 지나온 길과 다가올 길을 함께 살핀 뒤, 지금 발걸음을 옮길 한 방향을 고르세요.',
  '야누스의 문지방 정결: 떠나보낼 것은 감사히 배웅하고, 맞이할 것은 차분히 자리를 내어주세요.',
];

function classifyJanusQuestion(question?: string): JanusQuestionFocus {
  const q = (question || '').toLowerCase();
  if (/관계|사람|연애|가족|친구|동료|화해|이별|약속|대화/.test(q)) {
    return 'relationship';
  }
  if (/결정|선택|시작|이직|계약|창업|도전|방향|변경|전환/.test(q)) {
    return 'decision';
  }
  if (/휴식|피로|정리|불안|지침|치유|회복|마음|슬픔|비움/.test(q)) {
    return 'healing';
  }
  return 'reflection';
}

function buildJanusGuidance(
  gatewayNumber: number,
  focus: JanusQuestionFocus
): {
  practiceGuidance: string;
  ritualAction: string;
  reflectionFocus: string;
  counselNote: string;
} {
  const byGateway: Record<number, Record<JanusQuestionFocus, { practice: string; ritual: string; reflection: string; counsel: string }>> = {
    1: {
      relationship: {
        practice: '지난 서운함을 다시 꺼내기보다 오늘부터 새롭게 쌓을 대화의 규칙을 가볍게 제안해 보세요.',
        ritual: '상대와 나누고 싶은 긍정적인 태도 1가지만 짧게 메모하고 오늘 만남에 적용해 보세요.',
        reflection: '과거의 기억을 잠시 접어둔다면, 오늘 이 사람과 새로 시작할 수 있는 지점은 어디인가요?',
        counsel: '여명의 관문은 묵은 감정을 털어내고 담백한 첫 인사를 건넬 때 열립니다.',
      },
      decision: {
        practice: '완벽한 계획을 기다리기보다 15분 안에 끝낼 수 있는 가장 작은 첫 실행부터 떼어 보세요.',
        ritual: '책상 위나 메모장을 비우고 오늘 새로 시작할 과제 단 하나의 이름만 크게 적어 보세요.',
        reflection: '지금 이 문턱에서 미루고 있던 첫 단추는 무엇이며, 오늘 당장 끼울 수 있는 것은 무엇인가요?',
        counsel: '새 출발의 추진력은 거창한 결심이 아니라 작고 분명한 첫 행동에서 나옵니다.',
      },
      healing: {
        practice: '어제의 피로를 오늘까지 끌고 오지 말고, 아침의 맑은 공기와 함께 하루를 새로 구획해 보세요.',
        ritual: '아침이나 휴식 시간 시작 전에 창문을 열어 환기하며 "지금부터 새로운 리듬이다"라고 되뇌어 보세요.',
        reflection: '어제까지의 무거움 중 오늘 문지방 바깥에 내려놓고 들어와도 되는 짐은 무엇인가요?',
        counsel: '시간의 매듭을 새로 지어 주는 것만으로도 마음의 피로가 한결 가벼워집니다.',
      },
      reflection: {
        practice: '지나간 아쉬움에 머무르기보다 오늘 내 앞에 놓인 빈 여백에 무엇을 채울지 그려 보세요.',
        ritual: '오늘 새롭게 시도해 보고 싶은 사소한 습관이나 시선 하나를 정해 실천해 보세요.',
        reflection: '지금 내 삶의 문턱 너머에서 가장 반갑게 맞이하고 싶은 변화는 무엇인가요?',
        counsel: '여명의 빛은 뒤를 돌아보는 눈보다 앞을 여는 손끝에 먼저 닿습니다.',
      },
    },
    2: {
      relationship: {
        practice: '닫아 두었던 마음의 문을 조금 열어 상대의 의도를 먼저 묻고 경청하는 시간을 가져 보세요.',
        ritual: '오래 연락이 뜸했거나 고마움을 전하지 못한 한 사람에게 가벼운 안부를 건네보세요.',
        reflection: '내가 상처를 피하려 닫아 둔 문 뒤에 혹시 좋은 연결의 기회가 기다리고 있지는 않나요?',
        counsel: '적절한 개방은 고립을 깨고 뜻밖의 호의와 협력을 불러옵니다.',
      },
      decision: {
        practice: '혼자 고민하며 시야를 좁히기보다 외부의 제안·피드백·새 경로를 적극적으로 검토해 보세요.',
        ritual: '보류 중이던 지원서·문의·제안 중 하나를 오늘 안에 실제 발송 가능한 초안으로 완성해 보세요.',
        reflection: '지금 두드려 볼 수 있는데도 지레 포기하고 있던 기회의 문은 무엇인가요?',
        counsel: '개방의 관문에서는 먼저 손을 내미는 쪽이 흐름의 주도권을 잡습니다.',
      },
      healing: {
        practice: '혼자 끙끙 앓기보다 신뢰할 수 있는 사람이나 환경에 현재 상태를 솔직하게 나누어 보세요.',
        ritual: '답답한 실내에서 벗어나 햇빛이 드는 산책길을 15분 이상 걸으며 시야를 넓혀 보세요.',
        reflection: '내 마음을 조금 열어 환기시켰을 때 가장 먼저 들어왔으면 하는 온기는 무엇인가요?',
        counsel: '닫힌 방에 창을 내듯 작은 소통이 답답한 정체를 풀어 줍니다.',
      },
      reflection: {
        practice: '익숙한 방식만 고집하지 말고 낯선 관점이나 새로운 배움에 호기심을 열어 두세요.',
        ritual: '평소 보지 않던 분야의 글이나 이야기 하나를 읽고 영감이 된 문장을 남겨 보세요.',
        reflection: '내가 당연하다고 믿어 온 울타리 밖에는 어떤 가능성이 펼쳐져 있을까요?',
        counsel: '열린 태도는 평범한 하루 속에서도 새로운 전환점을 발견하게 해 줍니다.',
      },
    },
    3: {
      relationship: {
        practice: '모든 부탁을 다 들어주려다 지치지 않도록, 내가 감당할 수 있는 선을 부드럽지만 분명히 알리세요.',
        ritual: '무리한 요청이나 불편한 대화에는 하루의 말미를 두고 정중히 거절하는 문장을 연습해 보세요.',
        reflection: '관계를 잃을까 봐 내 평화를 희생시키면서까지 열어 둔 문은 어디인가요?',
        counsel: '건강한 빗장은 관계를 끊는 벽이 아니라 오래 함께 가기 위한 보호막입니다.',
      },
      decision: {
        practice: '지금은 무리하게 벌리기보다 이미 진행 중인 핵심 과제를 지키고 불필요한 가지를 쳐낼 때입니다.',
        ritual: '할 일 목록에서 당장 중요하지 않은 항목 2개를 과감히 보류 또는 삭제해 보세요.',
        reflection: '새로운 선택을 더하는 것보다 지금 반드시 지켜내야 할 내 에너지와 기준은 무엇인가요?',
        counsel: '단호한 선택적 집중이 흔들리는 판을 안정시키는 가장 빠른 길입니다.',
      },
      healing: {
        practice: '외부의 자극과 소식을 잠시 차단하고 나만의 고요한 회복 구역을 확보해 주세요.',
        ritual: '오늘 저녁 1시간 동안 알림을 끄고 방해를 받지 않는 온전한 휴식 시간을 선언하세요.',
        reflection: '지금 내 마음의 평화를 가장 많이 갉아먹고 있는 외부 소음은 무엇인가요?',
        counsel: '문을 잠시 닫아 걸어야 내면의 체력과 고요함이 온전히 채워집니다.',
      },
      reflection: {
        practice: '남들의 속도에 휩쓸리지 말고 나만의 기준과 리듬을 지키는 내면의 빗장을 점검하세요.',
        ritual: '타인의 기대 때문에 억지로 유지하던 습관이나 의무 하나를 오늘 하루 쉬어 보세요.',
        reflection: '내가 끝까지 타협하지 않고 지켜야 할 나만의 중심 가치는 무엇인가요?',
        counsel: '방어의 관문은 수성이 곧 다음 도약을 위한 힘의 축적임을 일깨워 줍니다.',
      },
    },
    4: {
      relationship: {
        practice: '누가 옳고 그른지 따지기보다 서로가 편안해질 수 있는 공통의 합의점을 먼저 찾아보세요.',
        ritual: '어긋났던 상대와 마주한다면 비판 대신 "우리가 바라는 좋은 상태"를 먼저 언급해 보세요.',
        reflection: '갈등의 껍질을 한 겹 벗겨 내면 상대와 내가 공통으로 지키고 싶은 마음은 무엇인가요?',
        counsel: '화합의 관문은 양쪽의 입장을 모두 비추는 야누스의 시선에서 열립니다.',
      },
      decision: {
        practice: '대립하는 두 선택지 중 하나를 버리기보다, 두 장점을 절충해 균형을 잡는 제3의 해법을 모색하세요.',
        ritual: '고민 중인 두 안건의 장단점을 나란히 놓고 서로 보완할 수 있는 지점을 표시해 보세요.',
        reflection: '양극단 사이에서 지금 가장 현실적이고 지속 가능한 조율 지점은 어디인가요?',
        counsel: '균형 잡힌 조율은 갈등 비용을 줄이고 오래 가는 합의를 만들어 줍니다.',
      },
      healing: {
        practice: '스스로를 책망하던 마음과 화해하고, 애써 온 자신에게 너그러운 조약을 맺어 주세요.',
        ritual: '실수나 후회로 남았던 기억 하나를 떠올리며 "그때의 나도 최선을 다했다"고 인정해 주세요.',
        reflection: '내 안에서 서로 다투고 있던 의무감과 휴식 욕구를 어떻게 화해시킬 수 있을까요?',
        counsel: '자기 자신과의 평화가 자리 잡을 때 비로소 외부의 변화도 편안해집니다.',
      },
      reflection: {
        practice: '과거의 경험과 미래의 바람을 대립시키지 말고 하나의 이어진 이야기로 연결해 보세요.',
        ritual: '지나온 시련 하나가 지금의 나에게 남겨 준 지혜 한 줄을 감사히 기록해 보세요.',
        reflection: '과거와 현재, 나와 타인이 한 문턱 위에서 만나 화해한다면 어떤 풍경일까요?',
        counsel: '쿠리알리스의 중심은 모든 엇갈림이 제자리를 찾아가는 성숙한 조화입니다.',
      },
    },
  };

  const entry = byGateway[gatewayNumber][focus];
  return {
    practiceGuidance: entry.practice,
    ritualAction: entry.ritual,
    reflectionFocus: entry.reflection,
    counselNote: entry.counsel,
  };
}

export function calculateRomanJanus(params?: RomanJanusParams): RomanJanusReport {
  const profile = params?.profile;
  const question = params?.question || '';
  const now = params?.now || new Date();
  const kst = new Date(now.getTime() + 9 * 3600000);

  const bdate = profile?.basic?.birthdate || '1995-03-21';
  const btime = profile?.basic?.birthtime || '12:00';
  const baseSeed = (bdate + btime).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const questionSeed = question.split('').reduce((acc, c, idx) => acc + c.charCodeAt(0) * (idx + 5), 0);
  const dateSeed = kst.getUTCFullYear() * 11 + (kst.getUTCMonth() + 1) * 29 + kst.getUTCDate() * 19;
  const seed = baseSeed + questionSeed + dateSeed;

  const pastClosure = ((seed * 19 + 31) % 53) + 47;
  const futureReadiness = ((seed * 23 + 43) % 55) + 45;
  const thresholdBalance = Math.round((pastClosure + futureReadiness) / 2);

  const gatewayIdx = Math.abs(seed) % JANUS_GATEWAYS.length;
  const activeGateway = JANUS_GATEWAYS[gatewayIdx];
  const secondaryGatewayIdx = (gatewayIdx + 1 + (Math.abs(seed) % (JANUS_GATEWAYS.length - 1))) % JANUS_GATEWAYS.length;
  const secondaryGateway = JANUS_GATEWAYS[secondaryGatewayIdx];
  const questionFocus = classifyJanusQuestion(question);

  const doorStatus: 'OPEN' | 'CLOSED' = futureReadiness > pastClosure ? 'OPEN' : 'CLOSED';
  const liminalPhase: JanusLiminalPhase =
    doorStatus === 'CLOSED' && activeGateway.phase === 'PASSAGE_OPENING'
      ? 'THRESHOLD_CLOSURE'
      : activeGateway.phase;

  const retrospectInsight =
    pastClosure >= 75
      ? '지나온 시기의 경험에서 핵심 교훈을 추려내고 불필요한 미련을 정리할 준비가 된 상태'
      : '아직 매듭짓지 못한 과거의 여운이나 아쉬움을 차분히 점검하고 배웅해야 하는 상태';

  const prospectMomentum =
    doorStatus === 'OPEN'
      ? '신전 문 개방(OPEN) — 새로운 제안·시작·연결을 향해 앞으로 한 걸음 내딛는 전환 흐름'
      : '신전 문 닫힘(CLOSED) — 외연 확장보다 내실 정비·경계 보호·평화 정착을 우선하는 흐름';

  const guidance = buildJanusGuidance(activeGateway.gatewayNumber, questionFocus);
  const calculatedAtKst = formatJanusKstTimestamp(now);
  const reflectiveQuestion = buildJanusReflectiveQuestion(activeGateway.gatewayNameKo, guidance.reflectionFocus, question);
  const boundaryNotice = '이는 로마 야누스 문턱 상징에 기반한 전환기 성찰 참고일 뿐, 개인 점수·심리 진단·미래 예측이 아닙니다.';
  const janusSynthesisMatrix = {
    dominantTension: `${activeGateway.gatewayNameKo} ↔ ${secondaryGateway.gatewayNameKo} (${doorStatus})`,
    alignmentState: describeJanusStage(thresholdBalance, doorStatus),
    integratedAction: `${guidance.practiceGuidance}${question.trim() ? ` [질문 맥락: ${question.trim()}]` : ''}`,
  };

  return {
    engineVersion: ROMAN_JANUS_ENGINE_VERSION,
    calculatedAtKst,
    questionFocus,
    pastClosureScore: pastClosure,
    futureReadinessScore: futureReadiness,
    thresholdBalanceScore: thresholdBalance,
    liminalPhase,
    retrospectInsight,
    prospectMomentum,
    activeJanusGateway: {
      gatewayNumber: activeGateway.gatewayNumber,
      gatewayNameKo: activeGateway.gatewayNameKo,
      gatewayNameLa: activeGateway.gatewayNameLa,
      portalSymbol: activeGateway.portalSymbol,
      actionKey: activeGateway.actionKey,
    },
    secondaryJanusGateway: {
      gatewayNumber: secondaryGateway.gatewayNumber,
      gatewayNameKo: secondaryGateway.gatewayNameKo,
      gatewayNameLa: secondaryGateway.gatewayNameLa,
      portalSymbol: secondaryGateway.portalSymbol,
      actionKey: secondaryGateway.actionKey,
    },
    janusTempleDoorStatus: doorStatus,
    sacredKeyPrescription: JANUS_PRESCRIPTIONS[Math.abs(seed) % JANUS_PRESCRIPTIONS.length],
    practiceGuidance: guidance.practiceGuidance,
    ritualAction: guidance.ritualAction,
    reflectionFocus: guidance.reflectionFocus,
    reflectiveQuestion,
    counselNote: guidance.counselNote,
    boundaryNotice,
    interpretiveBoundary: boundaryNotice,
    janusSynthesisMatrix,
  };
}

export function formatRomanJanusPrompt(report: RomanJanusReport): string {
  const lines = [
    `[고대 로마 야누스(Janus) 2대 얼굴 시공간 문턱 & 새출발 실측 데이터]`,
    `- 연산 시각: ${report.calculatedAtKst} | 엔진 버전: ${report.engineVersion} | 질문 맥락: ${report.questionFocus} | 임계 국면: ${report.liminalPhase}`,
    `- 뒤를 보는 얼굴(과거 성찰): ${report.retrospectInsight}`,
    `- 앞을 보는 얼굴(전환 방향): ${report.prospectMomentum}`,
    `- 현재 활성 문턱: ${report.activeJanusGateway.gatewayNumber}번 [${report.activeJanusGateway.gatewayNameKo}] (${report.activeJanusGateway.gatewayNameLa})`,
    `  * 상징: ${report.activeJanusGateway.portalSymbol}`,
    `  * 핵심 행동: ${report.activeJanusGateway.actionKey}`,
    `- 보조 교차 문턱: ${report.secondaryJanusGateway.gatewayNumber}번 [${report.secondaryJanusGateway.gatewayNameKo}] (${report.secondaryJanusGateway.gatewayNameLa}) — ${report.secondaryJanusGateway.portalSymbol}`,
    `- 야누스 열쇠 처방: ${report.sacredKeyPrescription}`,
    `- 실천 조언: ${report.practiceGuidance}`,
    `- 일상 의례: ${report.ritualAction}`,
    `- 성찰 질문: ${report.reflectiveQuestion}`,
    `- 조언 요약: ${report.counselNote}`,
    `- 해석 경계: ${report.interpretiveBoundary}`,
  ];
  if (report.janusSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${report.janusSynthesisMatrix.dominantTension} | 조율 상태: ${report.janusSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${report.janusSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
