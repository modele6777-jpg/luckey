/**
 * =========================================================================
 * LUCKEY 오행 칠정(七情) 심신 맥파 & 기혈 조화 엔진 (Five Elements Pulse & Seven Emotions Engine)
 * =========================================================================
 * 
 * [학술적 배경]
 * 황제내경(黃帝內經) 소문(素問) 음양응상대론(陰陽應象大論)과 동의보감(東醫寶鑑) 칠정상(七情傷)에
 * 근거하여, 사주 4주 8자의 오행 분포(목·화·토·금·수)와 현재 일진의 오행 기운을 결합하여
 * 개인의 심신 감정 파동(희·노·우·사·비·공·경)과 기혈(氣血)의 과유불급을 0ms 순수 수리로 진단합니다.
 * 
 * 1. 5대 장부 및 칠정 에너지 균형 분석 (목-간-노, 화-심-희, 토-비-사, 금-폐-비/우, 수-신-공/경)
 * 2. 기(氣)의 5대 운행 편차(기상·기완·기결·기소·기하) 진단
 * 3. 심신 과열/냉각 지수 및 오행 맞춤 평정 처방(호흡·식생·색채) 산출
 */

import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju, type SajuAnalysisResult } from '../sajuAnalysis';

export const FIVE_EMOTIONS_PULSE_VERSION = 'LUCKEY-FIVE-EMOTIONS-v2.3.0';

export type TraditionalEmotion = '노(怒-분노/추진)' | '희(喜-환희/산만)' | '사(思-사색/번민)' | '비우(悲憂-슬픔/위축)' | '공경(恐驚-공포/불안)';

export interface EmotionPulseItem {
  element: '목(木)' | '화(火)' | '토(土)' | '금(金)' | '수(水)';
  organ: string;            // 주관 장부 (간/심/비/폐/신)
  emotion: TraditionalEmotion;
  qiMovement: string;       // 기의 흐름 (기상 氣上, 기완 氣緩, 기결 氣結, 기소 氣消, 기하 氣下)
  score: number;            // 0 ~ 100 (내부 호환용, 프롬프트 비노출)
  status: '과다(태과)' | '적정' | '결핍(불급)';
  symptomSign: string;      // 신체 및 심리적 징후
}

export interface FiveEmotionsPulseReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  dominantEmotion: TraditionalEmotion;
  vulnerableOrgan: string;
  qiDynamicState: string;     // 기혈 전체 동역학 상태
  heatCoolIndex: number;      // 심신 열냉 지수 (-50: 극냉/위축 ~ +50: 극열/과열)
  harmonyScore: number;       // 오행 칠정 조화도 (내부 호환용 0 ~ 100)
  emotionPulses: EmotionPulseItem[];
  elementalDeficiency: string; // 가장 보충이 시급한 오행
  balancingPrescription: {
    colorTherapy: string;     // 색채 개운
    breathingMethod: string;  // 호흡법
    dietaryAdvice: string;    // 식생 처방
    mindDirectives: string;   // 심신 평정 행동 강령
  };
  situationalPulseAudit: {
    focusTheme: string;
    emotionNote: string;
    calmingPractice: string;
  };
  temporalPulseRhythm: {
    kstTimeLabel: string;
    organMeridianWindow: string;
    seasonalEmotionTone: string;
    temporalGuidance: string;
  };
  pulseSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

function getTemporalPulseRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const organMeridianWindow =
    hour >= 5 && hour < 11
      ? '비위(脾胃)·폐(肺) 아침 순환창 — 가벼운 아침 호흡과 따뜻한 음식으로 기혈을 깨우는 시간'
      : hour >= 11 && hour < 17
        ? '심(心)·소장(小腸) 정오 활력창 — 치솟는 열기를 고르게 분산하며 명료하게 소통하는 시간'
        : hour >= 17 && hour < 22
          ? '신(腎)·심포(心包) 황혼 이완창 — 하루의 긴장을 풀고 마음의 열냉 균형을 되찾는 시간'
          : '담(膽)·간(肝) 심야 회복창 — 생각을 멈추고 깊은 수면으로 칠정을 가라앉히는 시간';

  const seasonalEmotionTone =
    month >= 3 && month <= 5
      ? '봄 · 간목(肝木) 서발기 (감정과 의욕이 뻗어나가므로 유연한 이완이 필요한 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 심화(心火) 왕성기 (열정이 높아지므로 수분과 여유로 과열을 식히는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 폐금(肺金) 수렴기 (사색이 깊어지므로 맑은 호흡으로 쓸쓸함을 달래는 시기)'
          : '겨울 · 신수(腎水) 저장기 (불안을 내려놓고 따뜻한 휴식으로 정기를 비축하는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d}T${hh}:${mm}:00+09:00 (KST)`,
    organMeridianWindow,
    seasonalEmotionTone,
    temporalGuidance: `${organMeridianWindow} · ${seasonalEmotionTone}의 흐름에 맞추어 칠정의 중화(中和)를 살피십시오.`,
  };
}

export function calculateFiveEmotionsPulse(
  profile?: UserProfile | null,
  targetDate: Date = new Date(),
  question?: string
): FiveEmotionsPulseReport {
  let sajuRes: SajuAnalysisResult | null = null;
  try {
    sajuRes = calculateDetailedSaju(profile || null);
  } catch (_) {
    sajuRes = null;
  }

  // 기본 오행 가중치 (프로필 없을 경우 균등 분배)
  let wood = 20;
  let fire = 20;
  let earth = 20;
  let metal = 20;
  let water = 20;

  if (sajuRes && sajuRes.elements) {
    const p = sajuRes.elements.percentages || { 목: 20, 화: 20, 토: 20, 금: 20, 수: 20 };
    wood = p['목'] ?? 20;
    fire = p['화'] ?? 20;
    earth = p['토'] ?? 20;
    metal = p['금'] ?? 20;
    water = p['수'] ?? 20;
  }

  // 타겟 일자의 오행 기운 보정 (일진 간지 주기 반영)
  const dayFactor = targetDate.getDate() % 5;
  if (dayFactor === 0) wood += 5;
  else if (dayFactor === 1) fire += 5;
  else if (dayFactor === 2) earth += 5;
  else if (dayFactor === 3) metal += 5;
  else water += 5;

  const classifyStatus = (val: number): '과다(태과)' | '적정' | '결핍(불급)' => {
    if (val >= 35) return '과다(태과)';
    if (val <= 12) return '결핍(불급)';
    return '적정';
  };

  const pulses: EmotionPulseItem[] = [
    {
      element: '목(木)',
      organ: '간(肝)·담(膽)',
      emotion: '노(怒-분노/추진)',
      qiMovement: '기상(氣上: 에너지가 치솟아 추진 또는 조급함 유발)',
      score: wood,
      status: classifyStatus(wood),
      symptomSign: wood >= 35 ? '목과 어깨 결림, 두통, 성급한 추진력' : wood <= 12 ? '시작 동력 부족, 우유부단, 피로감' : '진취적이고 유연한 리더십'
    },
    {
      element: '화(火)',
      organ: '심(心)·소장(小腸)',
      emotion: '희(喜-환희/산만)',
      qiMovement: '기완(氣緩: 기운이 풀어져 환희 또는 집중 분산)',
      score: fire,
      status: classifyStatus(fire),
      symptomSign: fire >= 35 ? '가슴 두근거림, 수면 장애, 충동적 열정' : fire <= 12 ? '감정의 냉각, 무기력, 열정 저하' : '명석한 분별력과 따뜻한 공감'
    },
    {
      element: '토(土)',
      organ: '비(脾)·위(胃)',
      emotion: '사(思-사색/번민)',
      qiMovement: '기결(氣結: 기운이 뭉쳐 소화 장애 또는 지나친 생각)',
      score: earth,
      status: classifyStatus(earth),
      symptomSign: earth >= 35 ? '과도한 반추와 걱정, 식체, 결단 지연' : earth <= 12 ? '중심 상실, 불안정한 기반, 조급함' : '신중하고 흔들림 없는 안정감'
    },
    {
      element: '금(金)',
      organ: '폐(肺)·대장(大腸)',
      emotion: '비우(悲憂-슬픔/위축)',
      qiMovement: '기소(氣消: 기운이 소모되어 감상적 또는 완벽주의)',
      score: metal,
      status: classifyStatus(metal),
      symptomSign: metal >= 35 ? '엄격한 자기검열, 호흡 얕음, 비판적 시각' : metal <= 12 ? '결단력 부족, 맺고 끊음의 어려움' : '단호한 결단력과 명료한 질서'
    },
    {
      element: '수(水)',
      organ: '신(腎)·방광(膀胱)',
      emotion: '공경(恐驚-공포/불안)',
      qiMovement: '기하(氣下: 기운이 가라앉아 두려움 또는 깊은 통찰)',
      score: water,
      status: classifyStatus(water),
      symptomSign: water >= 35 ? '미래에 대한 근원적 불안, 허리 시림, 고립감' : water <= 12 ? '생명력 고갈, 조급한 두려움, 건조함' : '깊은 지혜와 유연한 적응력'
    }
  ];

  // 주도 감정 및 취약 장부 선정
  pulses.sort((a, b) => b.score - a.score);
  const dominant = pulses[0];
  const deficient = pulses[pulses.length - 1];

  // 열냉 지수 계산 (화/목은 양(열), 금/수는 음(냉))
  const heatScore = (wood + fire * 1.2) - (metal + water * 1.2);
  const heatCoolIndex = Math.max(-50, Math.min(50, Math.round(heatScore * 0.5)));

  // 오행 균형 조화도 (편차 기반)
  const avg = 20;
  const variance = pulses.reduce((acc, cur) => acc + Math.pow(cur.score - avg, 2), 0) / 5;
  const harmonyScore = Math.max(30, Math.min(98, Math.round(100 - Math.sqrt(variance) * 2.5)));

  // 기혈 동역학 상태 판정
  let qiDynamicState = '오행 순환 중화(中和) 상태';
  if (heatCoolIndex >= 25) qiDynamicState = '양기 과열형 (심신 과열 및 급진적 기운 분출)';
  else if (heatCoolIndex <= -25) qiDynamicState = '음기 울체형 (기혈 위축 및 내면 번민 침잠)';
  else if (dominant.status === '과다(태과)') qiDynamicState = `${dominant.element} 기운 편중 독주 상태 (${dominant.qiMovement.split(':')[0]})`;

  // 보충 처방 생성
  let colorTherapy = '청록색(목) & 에메랄드';
  let breathingMethod = '복식 심호흡 (4초 들숨, 4초 정지, 6초 날숨)';
  let dietaryAdvice = '녹색 채소와 신선한 산나물';
  let mindDirectives = '새로운 계획을 펼치고 신체를 가볍게 스트레칭하세요.';

  if (deficient.element.includes('목')) {
    colorTherapy = '싱그러운 포레스트 그린 & 숲빛';
    breathingMethod = '간기(肝氣) 정화 조식 호흡 (길게 내쉬며 긴장 이완)';
    dietaryAdvice = '미나리, 케일, 신선한 모닝 그린티';
    mindDirectives = '억누른 감정을 인정하고 새로운 도전을 작게 시작하세요.';
  } else if (deficient.element.includes('화')) {
    colorTherapy = '따뜻한 로즈 레드 & 웜 코랄';
    breathingMethod = '심장 화기 회복 햇살 호흡 (가슴을 활짝 열고 호흡)';
    dietaryAdvice = '대추차, 토마토, 붉은 베리류';
    mindDirectives = '웃음과 가벼운 담소를 통해 마음의 온기를 충전하세요.';
  } else if (deficient.element.includes('토')) {
    colorTherapy = '안정감 있는 테라코타 & 옐로 오커';
    breathingMethod = '비위(脾胃) 중심 복식 단전 호흡 (배꼽 아래 단전에 집중)';
    dietaryAdvice = '단호박, 따뜻한 잡곡죽, 생강차';
    mindDirectives = '지나친 생각을 멈추고 현재 발을 딛고 선 땅의 감각을 느끼세요.';
  } else if (deficient.element.includes('금')) {
    colorTherapy = '명료한 화이트 & 크리스털 실버';
    breathingMethod = '폐기(肺氣) 쇄신 청기(淸氣) 흡입 호흡 (맑은 공기를 깊이 마심)';
    dietaryAdvice = '배, 도라지, 백목이버섯, 무';
    mindDirectives = '미련을 버리고 불필요한 일정을 단호히 정리(비움)하세요.';
  } else {
    colorTherapy = '깊은 미드나잇 블루 & 딥 네이비';
    breathingMethod = '수기(水氣) 축적 심연 호흡 (천천히 가라앉히는 차분한 날숨)';
    dietaryAdvice = '검은콩, 미역, 흑임자, 충분한 온수';
    mindDirectives = '조급함을 내려놓고 깊은 수면과 침묵 속에서 기력을 비축하세요.';
  }

  const temporalPulseRhythm = getTemporalPulseRhythm(targetDate);
  const q = (question || '').trim();
  const situationalPulseAudit = /불안|걱정|스트레스|지침|우울|화/.test(q)
    ? {
        focusTheme: '칠정상(七情傷) 기혈 순환 완화와 심신 열냉 조율',
        emotionNote: `현재 [${dominant.emotion}] 맥파가 도드라져 [${dominant.organ}] 계통의 긴장을 먼저 풀어주는 것이 좋습니다.`,
        calmingPractice: breathingMethod,
      }
    : /일|결정|관계|소통/.test(q)
      ? {
          focusTheme: '중화(中和)의 감정 리듬 유지와 현실 대처',
          emotionNote: '한쪽으로 치우친 감정 기운을 다스리고 결핍된 오행을 보충하면 판단이 한결 또렷해집니다.',
          calmingPractice: mindDirectives,
        }
      : {
          focusTheme: `${dominant.emotion} 중심 오행 칠정 균형 조율`,
          emotionNote: qiDynamicState,
          calmingPractice: `${breathingMethod} · ${mindDirectives}`,
        };

  const pulseSynthesisMatrix = {
    coreInsight: `주도 맥파 [${dominant.emotion}]와 보충 오행 [${deficient.element}]의 균형을 맞추는 것이 핵심입니다.`,
    recommendedAction: `${breathingMethod} + ${colorTherapy} + ${mindDirectives}`,
    cautionNotice: '특정 장부나 감정의 태과·불급을 질병으로 단정하지 말고 일상 리듬을 돌보는 신호로 참고하십시오.',
  };

  const ritualAction = pulseSynthesisMatrix.recommendedAction;
  const reflectionFocus = q
    ? `‘${q}’ 속에서 올라오는 [${dominant.emotion}] 기운을 가라앉히고 부족한 [${deficient.element}]을 채우기 위해 지금 바로 쉴 호흡 한 번은 어떤 느낌입니까?`
    : `오늘 [${dominant.organ}]과 [${deficient.element}]의 균형을 위해 내 몸이 가장 먼저 보내는 작은 신호는 무엇입니까?`;

  return {
    engineVersion: FIVE_EMOTIONS_PULSE_VERSION,
    calculatedAt: targetDate.toISOString(),
    calculatedAtKst: temporalPulseRhythm.kstTimeLabel,
    dominantEmotion: dominant.emotion,
    vulnerableOrgan: dominant.organ,
    qiDynamicState,
    heatCoolIndex,
    harmonyScore,
    emotionPulses: pulses,
    elementalDeficiency: `${deficient.element} (${deficient.organ})`,
    balancingPrescription: {
      colorTherapy,
      breathingMethod,
      dietaryAdvice,
      mindDirectives
    },
    situationalPulseAudit,
    temporalPulseRhythm,
    pulseSynthesisMatrix,
    boundaryNotice: '본 결과는 한의학 황제내경의 오행·칠정 상징 이론을 활용한 정성적 심신 성찰 안내이며, 의학적 진단이 아닙니다.',
    interpretiveBoundary: '본 결과는 한의학 황제내경의 오행·칠정 상징 이론을 활용한 정성적 심신 성찰 안내이며, 의학적 진단이 아닙니다.',
    ritualAction,
    reflectionFocus,
    reflectiveQuestion: reflectionFocus,
  };
}

export function formatFiveEmotionsPulsePrompt(rep: FiveEmotionsPulseReport): string {
  const pulsesStr = rep.emotionPulses
    .map(p => `• [${p.element} / ${p.organ}] ${p.emotion} (${p.status}) - ${p.symptomSign}`)
    .join('\n');

  const thermalTone =
    rep.heatCoolIndex >= 20
      ? '양기 상승 · 열감 과잉 경향'
      : rep.heatCoolIndex <= -20
        ? '음기 침잠 · 냉감 위축 경향'
        : '열냉 중화(中和) 안정권';

  return `[오행 칠정(七情) 심신 맥파 & 기혈 조화 리포트 (Five Elements Emotion Pulse)]
- 엔진 버전: ${rep.engineVersion}
- 연산 시각: ${rep.calculatedAtKst}
- 심신 기혈 동역학: ${rep.qiDynamicState} (열냉 경향: ${thermalTone})
- 주도 감정 맥파: ${rep.dominantEmotion} (주의 장부: ${rep.vulnerableOrgan})
- 결핍 보충 오행: ${rep.elementalDeficiency}
- 질문 맥락 감사 (${rep.situationalPulseAudit.focusTheme}): ${rep.situationalPulseAudit.emotionNote} / 처방: ${rep.situationalPulseAudit.calmingPractice}
- KST 시공간 장부 리듬: ${rep.temporalPulseRhythm.organMeridianWindow} / ${rep.temporalPulseRhythm.seasonalEmotionTone}
  • 시공간 지침: ${rep.temporalPulseRhythm.temporalGuidance}
- 칠정 교차 매트릭스: 핵심(${rep.pulseSynthesisMatrix.coreInsight}) | 실행(${rep.pulseSynthesisMatrix.recommendedAction}) | 주의(${rep.pulseSynthesisMatrix.cautionNotice})
- 5대 감정 맥파 분석:
${pulsesStr}
- 맞춤형 심신 평정 처방:
  • 색채 테라피: ${rep.balancingPrescription.colorTherapy}
  • 호흡법: ${rep.balancingPrescription.breathingMethod}
  • 식생 권장: ${rep.balancingPrescription.dietaryAdvice}
  • 행동 강령: ${rep.balancingPrescription.mindDirectives}
- 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}
- 해석 경계: ${rep.boundaryNotice}
※ 상담 시 내담자의 말투와 감정 기복이 위 기혈 맥파(${rep.dominantEmotion})와 어떻게 공명하는지 짚어주고, 현실적인 심신 이완 조언을 부드럽게 곁들여주세요.`;
}
