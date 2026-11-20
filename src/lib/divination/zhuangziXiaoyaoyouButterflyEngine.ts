/**
 * 고대 중국 도가 장자(莊子) 소요유(逍遙遊) 붕정만리 & 제물론(齊物論) 호접몽 초월 엔진 (zhuangziXiaoyaoyouButterflyEngine.ts)
 *
 * 전국시대 도가 철학의 거장 장자(莊子)의 《장자(莊子)》 내편 제1편 〈소요유(逍遙遊)〉 및 제2편 〈제물론(齊物論)〉 원전 기반:
 * 북명(北冥)의 물고기 곤(鯤)이 화하여 구만 리 장공을 비상하는 거대한 대붕(大鵬)의 '붕정만리(鵬程萬里)',
 * 뱁새와 매미의 좁은 시야를 벗어나 절대적 자유로 노니는 '소요유(逍遙遊)',
 * 시비(是非)·미추(美醜)·득실(得失)의 상대적 분별을 잊고 천지자연과 하나 되는 '제물론(齊物論)'과 '호접지몽(胡蝶之夢)',
 * 그리고 나와 사물의 경계가 허물어지는 '물화(物化)'의 경지를 산출하는 궁극의 정신적 해방 엔진.
 *
 * 5대 장자 초월 심상(Five Zhuangzi Transcendent Archetypes):
 * 1. 곤화위붕(鯤化爲鵬) - 끝없는 심연의 내공이 폭발적 비상으로 전환되는 잠재력의 대도약
 * 2. 붕정만리(鵬程萬里) - 구만 리 바람을 타고 사소한 장애를 아득히 내려다보는 거시적 안목
 * 3. 오상아(吾喪我) - 인위적 에고와 고집을 깨끗이 잊고 본래의 순수 자연으로 돌아감
 * 4. 포정해우(庖丁解牛) - 억지로 힘쓰지 않고 사물의 자연스러운 빈틈(隙)을 타는 신묘한 유연성
 * 5. 호접지몽(胡蝶之夢) - 꿈과 현실, 주체와 객체의 분별을 초월하여 유유자적 노니는 물화의 자유
 */

import type { UserProfile } from '../sharedState';

export const ZHUANGZI_XIAOYAOYOU_BUTTERFLY_ENGINE_VERSION = '2.3.0';

export interface ZhuangziArchetype {
  id: string;
  nameKo: string;
  hanja: string;
  transcendentPrinciple: string;
  spiritualLiberationGift: string;
  affinityScore: number; // 0 ~ 100 친화도
}

export interface ZhuangziXiaoyaoyouButterflyReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  xiaoyaoyouAbsoluteFreedomScore: number; // 0 ~ 100 소요유(절대 자유) 지수
  rocAscendingWindResonance: number; // 0 ~ 100 대붕(大鵬) 상승 기류 공명도
  qiwulunTranscendenceIndex: number; // 0 ~ 100 제물론(시비·득실 초월) 지수
  butterflyDreamFluidityScore: number; // 0 ~ 100 호접몽(물화·유연성) 흐름도
  dominantArchetype: ZhuangziArchetype; // 가장 강력히 작동하는 장자 원형
  secondaryArchetype: ZhuangziArchetype; // 보조 조율 원형
  situationalZhuangziFocus: string;
  zhuangziFreedomGuidance: string; // 장자의 대자유 지침
  wuSangWoEmptyRoomRitual: string; // 허실생백(虛室生白) 마음비움 리추얼
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  zhuangziSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

const ZHUANGZI_ARCHETYPES_BASE: Omit<ZhuangziArchetype, 'affinityScore'>[] = [
  {
    id: 'kun_to_peng',
    nameKo: '곤화위붕',
    hanja: '鯤化爲鵬',
    transcendentPrinciple: '심연의 응축된 힘이 폭발적 비상으로 전환되는 임계점 돌파',
    spiritualLiberationGift: '그동안 축적해 온 보이지 않는 노력이 거대한 도약의 날갯짓으로 화하는 순간',
  },
  {
    id: 'peng_cheng_wan_li',
    nameKo: '붕정만리',
    hanja: '鵬程萬里',
    transcendentPrinciple: '구만 리 높은 곳에서 구름을 밟고 푸른 하늘만을 벗 삼는 거시적 조망',
    spiritualLiberationGift: '사소한 시비와 일상의 자잘한 마찰을 발아래 두고 본질적 대업에 집중하는 호연지기',
  },
  {
    id: 'wu_sang_wo',
    nameKo: '오상아',
    hanja: '吾喪我',
    transcendentPrinciple: '인위적 자아(에고)를 잊고 텅 빈 방에 신령한 빛이 차오르는 허실생백',
    spiritualLiberationGift: '체면과 평가에 매달리던 긴장을 완전히 내려놓고 순수한 자연의 리듬을 회복함',
  },
  {
    id: 'pao_ding_jie_niu',
    nameKo: '포정해우',
    hanja: '庖丁解牛',
    transcendentPrinciple: '칼날을 상하지 않고 뼈와 살의 자연스러운 결을 따라 유유히 유영함',
    spiritualLiberationGift: '어려운 인간관계나 복잡한 난제를 억지 힘이 아닌 지혜로운 빈틈 공략으로 풀어냄',
  },
  {
    id: 'hu_die_zhi_meng',
    nameKo: '호접지몽',
    hanja: '胡蝶之夢',
    transcendentPrinciple: '내가 나비인지 나비가 나인지 분별을 잊고 유유자적 노니는 물화의 자유',
    spiritualLiberationGift: '성패와 득실의 무게에 짓눌리지 않고 인생 자체를 한 편의 아름다운 놀이로 유희함',
  },
];

export interface ZhuangziXiaoyaoyouButterflyOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

function buildSituationalZhuangziFocus(question: string): {
  situationalZhuangziFocus: string;
  dailyPracticeRitual: string;
  reflectiveQuestion: string;
} {
  const q = question.trim();
  if (/관계|사람|갈등|시비|비교|연애|이별/.test(q)) {
    return {
      situationalZhuangziFocus: '누가 옳고 그른지 따지는 시비(是非)의 좁은 울타리를 넘어 포정해우처럼 관계의 빈틈(隙)을 여유롭게 통과하기',
      dailyPracticeRitual: '상대의 말에 맞서 힘을 주기보다, 지금 상황에서 굳이 부딪치지 않아도 되는 빈틈을 먼저 찾아 한 걸음 비켜서 보십시오.',
      reflectiveQuestion: '지금 붙잡고 있는 "내가 맞다"는 기준을 내려놓으면 이 관계는 어떻게 훨씬 가벼워집니까?',
    };
  }
  if (/선택|결정|진로|이직|일|사업|돈|시험/.test(q)) {
    return {
      situationalZhuangziFocus: '뱁새의 짧은 눈금이 아니라 구만 리 바람을 타는 대붕(大鵬)의 거시적 시야로 현재의 갈림길을 조망하기',
      dailyPracticeRitual: '당장의 작은 득실 목록을 한 번 덮고, 3년 뒤의 내가 지금의 고민을 내려다본다면 무엇이 남을지 적어 보십시오.',
      reflectiveQuestion: '지금 망설이는 이유는 본질의 길이 어두워서가 아니라, 남들의 잣대에 맞추려 하기 때문은 아닙니까?',
    };
  }
  if (/불안|압박|지침|스트레스|완벽|부담/.test(q)) {
    return {
      situationalZhuangziFocus: '애써 꾸미는 오상아(吾喪我)의 긴장을 풀고 허실생백(虛室生白)의 빈 공간에서 자연스러운 리듬 회복하기',
      dailyPracticeRitual: '오늘 해야 할 일 중 억지로 힘으로 밀어붙이는 한 가지를 골라, 힘을 빼고 물 흐르듯 처리할 작은 틈을 찾으십시오.',
      reflectiveQuestion: '체면이나 완벽주의를 잠시 내려놓는다면 지금 당장 가장 자유롭게 숨 쉴 수 있는 부분은 어디입니까?',
    };
  }
  return {
    situationalZhuangziFocus: '고정된 틀과 득실의 계산을 가볍게 비우고 구만 리 바람과 호접몽의 유연한 물화(物化) 감각 깨우기',
    dailyPracticeRitual: '하루 중 5분만이라도 목적이나 평가 없이 산책하거나 숨을 고르며 마음의 방을 비워 두십시오.',
    reflectiveQuestion: '오늘의 문제를 무거운 숙제가 아니라 한 번 노닐어 볼 흐름으로 본다면 첫걸음이 어떻게 달라집니까?',
  };
}

function describeZhuangziStage(score: number): string {
  if (score >= 82) return '구만 리 바람을 타듯 유유히 열림';
  if (score >= 65) return '자연스러운 결을 따라 조화롭게 흐름';
  return '긴장을 풀고 여백을 비울 여지가 있음';
}

export function calculateZhuangziXiaoyaoyouButterfly(
  optionsOrProfile?: ZhuangziXiaoyaoyouButterflyOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): ZhuangziXiaoyaoyouButterflyReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as ZhuangziXiaoyaoyouButterflyOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 84503;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 41) % 1000003;

  const archetypes: ZhuangziArchetype[] = ZHUANGZI_ARCHETYPES_BASE.map((arch, idx) => {
    const score = 45 + ((seed * (idx + 3) + idx * 31) % 53);
    return { ...arch, affinityScore: Math.min(99, Math.max(38, score)) };
  });

  archetypes.sort((a, b) => b.affinityScore - a.affinityScore);
  const dominantArchetype = archetypes[0];
  const secondaryArchetype = archetypes[1];

  const xiaoyaoyouAbsoluteFreedomScore = Math.min(100, Math.max(45, 55 + ((seed * 17) % 43)));
  const rocAscendingWindResonance = Math.min(100, Math.max(40, 52 + ((seed * 23) % 46)));
  const qiwulunTranscendenceIndex = Math.min(100, Math.max(42, 50 + ((seed * 29) % 48)));
  const butterflyDreamFluidityScore = Math.min(100, Math.max(46, Math.floor((xiaoyaoyouAbsoluteFreedomScore * 0.5 + qiwulunTranscendenceIndex * 0.5))));

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kstDate.getUTCFullYear();
  const m = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kstDate.getUTCDate()).padStart(2, '0');
  const hh = String(kstDate.getUTCHours()).padStart(2, '0');
  const mm = String(kstDate.getUTCMinutes()).padStart(2, '0');
  const calculatedAtKst = `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
  const { situationalZhuangziFocus, dailyPracticeRitual, reflectiveQuestion } = buildSituationalZhuangziFocus(question);
  const interpretiveBoundary = '이 관점은 《장자》의 소요유·제물론 비유를 통해 시야를 넓히는 상징적 프레임이며, 확정 예언이 아닙니다.';
  const ritualAction = dailyPracticeRitual;
  const reflectionFocus = `${dominantArchetype.nameKo}(${dominantArchetype.hanja}) · ${situationalZhuangziFocus}`;

  const zhuangziFreedomGuidance = `뱁새와 매미의 좁은 가지 다툼에 얽매이지 마십시오. 현재 당신에게 깃든 기운은 [${dominantArchetype.nameKo}(${dominantArchetype.hanja})]의 기상입니다. ${dominantArchetype.spiritualLiberationGift}의 태도를 지닐 때, 사소한 시비는 사라지고 구만 리 장공의 자유로운 바람이 펼쳐집니다. (${situationalZhuangziFocus})`;
  const wuSangWoEmptyRoomRitual = `어깨의 긴장을 풀고 가슴 속 모든 분별과 계산을 허공으로 내쉬며 속삭이십시오: "허실생백(虛室生白), 방을 비우면 저절로 신령한 빛이 차오르듯 나를 비우고 천지의 큰 흐름에 몸을 맡긴다."`;

  const trimmedQ = question.trim();
  const zhuangziSynthesisMatrix = {
    dominantTension: `${dominantArchetype.nameKo}(${dominantArchetype.hanja}) ↔ ${secondaryArchetype.nameKo}(${secondaryArchetype.hanja})`,
    alignmentState: `${describeZhuangziStage(xiaoyaoyouAbsoluteFreedomScore)} · ${describeZhuangziStage(butterflyDreamFluidityScore)}`,
    integratedAction: `${dailyPracticeRitual}${trimmedQ ? ` [질문 맥락: ${trimmedQ}]` : ''}`,
  };

  return {
    engineVersion: ZHUANGZI_XIAOYAOYOU_BUTTERFLY_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    xiaoyaoyouAbsoluteFreedomScore,
    rocAscendingWindResonance,
    qiwulunTranscendenceIndex,
    butterflyDreamFluidityScore,
    dominantArchetype,
    secondaryArchetype,
    situationalZhuangziFocus,
    zhuangziFreedomGuidance,
    wuSangWoEmptyRoomRitual,
    dailyPracticeRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    ritualAction,
    reflectionFocus,
    zhuangziSynthesisMatrix,
  };
}

export function formatZhuangziXiaoyaoyouButterflyPrompt(rep: ZhuangziXiaoyaoyouButterflyReport): string {
  const matrixLine = rep.zhuangziSynthesisMatrix
    ? `\n· 장자 교차 매트릭스: 핵심 긴장(${rep.zhuangziSynthesisMatrix.dominantTension}) · 조율 상태(${rep.zhuangziSynthesisMatrix.alignmentState}) · 통합 실천(${rep.zhuangziSynthesisMatrix.integratedAction})`
    : '';
  return `[고대 도가 장자 소요유 붕정만리 & 제물론 호접몽 정성 관조]
· 엔진 버전: v${rep.engineVersion} | 기준 시각(KST): ${rep.calculatedAtKst}
· 소요유(대자유) 흐름: ${describeZhuangziStage(rep.xiaoyaoyouAbsoluteFreedomScore)} | 대붕 상승 기류: ${describeZhuangziStage(rep.rocAscendingWindResonance)}
· 제물론(시비 초월) 흐름: ${describeZhuangziStage(rep.qiwulunTranscendenceIndex)} | 호접몽 물화 유연성: ${describeZhuangziStage(rep.butterflyDreamFluidityScore)}
· 주재 장자 원형: [${rep.dominantArchetype.nameKo} (${rep.dominantArchetype.hanja})] — ${describeZhuangziStage(rep.dominantArchetype.affinityScore)}
  - 초월 원리: ${rep.dominantArchetype.transcendentPrinciple}
  - 영적 해방 은사: ${rep.dominantArchetype.spiritualLiberationGift}
· 보조 원형: [${rep.secondaryArchetype.nameKo} (${rep.secondaryArchetype.hanja})] — ${describeZhuangziStage(rep.secondaryArchetype.affinityScore)}
· 질문 맥락 초점: ${rep.situationalZhuangziFocus}
· 장자의 대자유 지침: ${rep.zhuangziFreedomGuidance}
· 일상 관조 실천: ${rep.dailyPracticeRitual}
· 실천 의례: ${rep.ritualAction}
· 성찰 초점: ${rep.reflectionFocus}
· 성찰 질문: ${rep.reflectiveQuestion}
· 허실생백(虛室生白) 마음비움 리추얼: ${rep.wuSangWoEmptyRoomRitual}
· 해석 경계: ${rep.interpretiveBoundary}${matrixLine}`;
}
