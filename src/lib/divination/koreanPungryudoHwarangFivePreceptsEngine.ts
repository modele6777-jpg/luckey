/**
 * 고대 한국 신라 최치원 난랑비서 풍류도(風流道) 현묘지도 & 화랑도 세속오계 엔진 (koreanPungryudoHwarangFivePreceptsEngine.ts)
 *
 * 신라 말의 대석학 고운 최치원(崔致遠)의 《난랑비서(鸞郞碑序)》 및 원광법사(圓光法師)의 《세속오계(世俗五戒)》 원전 기반:
 * "國有玄妙之道 曰風流 設敎之源 備詳仙史 實乃包含三敎 接化群生"
 * (나라에 현묘한 도가 있으니 풍류라 한다. 가르침을 베푼 근원은 선사(仙史)에 자세히 실려 있으니,
 *  실로 유(儒)·불(佛)·선(仙) 삼교를 포괄하여 뭇 생명을 조화롭게 감화시킨다.)
 * 도의로써 서로 연마하고(道義相磨), 노래와 춤으로 기쁨을 나누며(歌樂相悅),
 * 명산대천을 유람하며 호연지기를 기르는(山水遊覽) 한민족 고유의 신령한 선도(仙道) 영성,
 * 그리고 결단의 순간에 흔들리지 않는 중심을 세워주는 화랑도의 '세속오계(世俗五戒)'를
 * 현대인의 삶과 대인관계, 결단력에 투영하는 결정론적 조화·기개 계산 엔진.
 *
 * 화랑도 5대 세속오계(Five Hwarang Secular Precepts):
 * 1. 사군이충(事君以忠 / 충의) - 대의명분과 자신이 맡은 사명에 대한 한결같은 충직함과 책임의식
 * 2. 사친이효(事親以孝 / 효도) - 삶의 뿌리와 스승, 은혜를 베푼 인연에 진심 어린 도리를 다함
 * 3. 교우이신(交友以信 / 신의) - 동료와 파트너를 대할 때 약속을 무겁게 여기고 한결같은 신의를 지킴
 * 4. 임전무퇴(臨戰無退 / 용맹) - 인생의 결정적 승부처와 시련 앞에서 도망치지 않는 불굴의 기개
 * 5. 살생유택(殺生有擇 / 자비) - 함부로 살기를 품지 않고 생명을 존중하며 분별 있게 힘을 절제함
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_PUNGRYUDO_HWARANG_ENGINE_VERSION = '2.3.0';

export interface HwarangPrecept {
  id: string;
  nameKo: string;
  hanja: string;
  coreSpirit: string;
  guidanceAction: string;
  preceptScore: number; // 0 ~ 100 (내부 정렬용, 프롬프트 비노출)
}

export interface KoreanPungryudoHwarangReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  pungryuXuanmiaoHarmonyScore: number; // 0 ~ 100 (내부 호환용, 프롬프트 비노출)
  hoyounjigiSpiritualCourageScore: number; // 0 ~ 100 (내부 호환용, 프롬프트 비노출)
  socialFaithLoyaltyScore: number; // 0 ~ 100 (내부 호환용, 프롬프트 비노출)
  gaAkSangYeolJoyVibration: number; // 0 ~ 100 (내부 호환용, 프롬프트 비노출)
  dominantPrecept: HwarangPrecept; // 현재 가장 크게 발동하는 화랑 오계
  secondaryPrecept: HwarangPrecept; // 보조 지원 오계
  situationalPungryuAudit: {
    focusTheme: string;
    preceptAlignmentNote: string;
    cultivationTone: string;
  };
  temporalPungryuRhythm: {
    kstTimeLabel: string;
    hwarangWatchWindow: string;
    seasonalMountainTone: string;
    temporalGuidance: string;
  };
  pungryuSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  pungryudoLifeCultivation: string; // 풍류도 도의상마 심신수련 처방
  hwarangCourageGuidance: string; // 화랑도 기개 및 결단 지침
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

const HWARANG_PRECEPTS_BASE: Omit<HwarangPrecept, 'preceptScore'>[] = [
  {
    id: 'sa_gun_i_chung',
    nameKo: '사군이충 (사명과 대의의 충정)',
    hanja: '事君以忠',
    coreSpirit: '내가 맡은 직분과 목표에 진심 어린 정성을 다하고 공적 대의를 지키는 충직함',
    guidanceAction: '사적인 유불리를 떠나 본연의 사명과 원칙에 집중할 때 확고한 권위와 신망이 바로 섭니다.',
  },
  {
    id: 'sa_chin_i_hyo',
    nameKo: '사친이효 (근본과 은혜의 도리)',
    hanja: '事親以孝',
    coreSpirit: '나를 있게 해 준 근본과 후원해 준 귀인들의 은혜를 잊지 않고 보답하는 따뜻한 도리',
    guidanceAction: '뿌리가 단단해야 가지가 번성하듯, 가족과 핵심 인연에 온정을 베풀 때 복록이 샘솟습니다.',
  },
  {
    id: 'gyo_woo_i_sin',
    nameKo: '교우이신 (동료와 파트너의 신의)',
    hanja: '交友以信',
    coreSpirit: '벗과 협력자 간의 약속을 천금처럼 무겁게 여기고 한결같이 믿음을 지키는 덕목',
    guidanceAction: '단기적 이익보다 사람과의 약속을 우선하십시오. 굳건한 신의가 인생 최고의 귀인을 끌어당깁니다.',
  },
  {
    id: 'im_jeon_mu_toe',
    nameKo: '임전무퇴 (승부처의 불굴 기개)',
    hanja: '臨戰無退',
    coreSpirit: '마주한 도전과 시련 앞에서 물러서지 않고 온 힘을 다해 정면 돌파하는 당당한 기백',
    guidanceAction: '지금은 주저하거나 뒤로 물러설 때가 아닙니다. 가슴을 펴고 당당하게 첫발을 내딛으십시오.',
  },
  {
    id: 'sal_saeng_yu_taek',
    nameKo: '살생유택 (절제와 상생의 자비)',
    hanja: '殺生有擇',
    coreSpirit: '힘을 가졌더라도 함부로 휘두르지 않고, 타인의 상처를 배려하며 상생을 도모하는 절제',
    guidanceAction: '상대를 제압하려 들지 말고 품어 안으십시오. 불필요한 적을 만들지 않는 너그러움이 진정한 승리입니다.',
  },
];

export interface KoreanPungryudoHwarangOptions {
  profile?: UserProfile | null;
  question?: string;
  contextText?: string;
  now?: Date;
  targetDate?: Date;
}

function getTemporalPungryuRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const hwarangWatchWindow =
    hour >= 5 && hour < 11
      ? '남산 아침 수련창 — 사군이충의 맑은 뜻과 오늘의 기개를 세우는 시간'
      : hour >= 11 && hour < 17
        ? '임전무퇴 정오 돌파창 — 망설임을 접고 핵심 과업을 당당히 돌파하는 시간'
        : hour >= 17 && hour < 22
          ? '가악상열 황혼 풍류창 — 교우이신의 신의를 나누고 마음의 여백을 즐기는 시간'
          : '도의상마 심야 성찰창 — 하루의 언행을 살생유택의 절제로 돌아보는 시간';

  const seasonalMountainTone =
    month >= 3 && month <= 5
      ? '봄 · 금강산 산수유람기 (새 기운을 들이마시며 시야를 넓히는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 지리산 호연지기 (열정을 품되 절도와 품격을 잃지 않는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 경주 도의상마기 (신의와 책임을 다져 결실을 맺는 시기)'
          : '겨울 · 선도 응축기 (내면의 기백을 조용히 갈고닦는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
    hwarangWatchWindow,
    seasonalMountainTone,
    temporalGuidance: `${hwarangWatchWindow} · ${seasonalMountainTone}의 호흡에 맞추어 풍류의 여유와 오계의 중심을 함께 지키십시오.`,
  };
}

export function calculateKoreanPungryudoHwarang(
  options?: KoreanPungryudoHwarangOptions
): KoreanPungryudoHwarangReport {
  const profile = options?.profile;
  const contextText = options?.question || options?.contextText || '';
  const now = options?.now || options?.targetDate || new Date();

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthdate?: string; birthDate?: string })?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthtime?: string; birthTime?: string })?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '';

  let seed = 97;
  if (bdate) {
    const digits = bdate.replace(/\D/g, '');
    for (let i = 0; i < digits.length; i++) {
      seed = (seed * 41 + Number(digits[i])) % 10007;
    }
  }
  if (btime) {
    const tDigits = btime.replace(/\D/g, '');
    for (let i = 0; i < tDigits.length; i++) {
      seed = (seed * 29 + Number(tDigits[i])) % 10007;
    }
  }
  if (contextText) {
    for (let i = 0; i < contextText.length; i++) {
      seed = (seed * 23 + contextText.charCodeAt(i)) % 10007;
    }
  }
  const dayFactor = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  seed = (seed * 17 + (dayFactor % 1000)) % 10007;

  const pungryuXuanmiaoHarmonyScore = 58 + (seed % 41); // 58 ~ 98
  const hoyounjigiSpiritualCourageScore = 55 + ((seed * 7) % 43); // 55 ~ 97
  const socialFaithLoyaltyScore = 56 + ((seed * 11) % 42); // 56 ~ 97
  const gaAkSangYeolJoyVibration = 52 + ((seed * 13) % 46); // 52 ~ 97

  const preceptScores = HWARANG_PRECEPTS_BASE.map((p, idx) => {
    const pSeed = (seed + idx * 277) % 10007;
    const preceptScore = 50 + (pSeed % 48);
    return { ...p, preceptScore };
  });

  preceptScores.sort((a, b) => b.preceptScore - a.preceptScore);
  const dominantPrecept = preceptScores[0];
  const secondaryPrecept = preceptScores[1];

  let pungryudoLifeCultivation: string;
  const culMod = seed % 3;
  if (culMod === 0) {
    pungryudoLifeCultivation = '도의상마(道義相磨): 뜻이 통하는 사람들과 지혜와 실천을 나누며 내면의 칼날을 정교하게 벼릴 때입니다.';
  } else if (culMod === 1) {
    pungryudoLifeCultivation = '산수유람(山水遊覽): 탁 트인 자연과 바람을 쐬며 답답한 가슴을 열고 호연지기(浩然之氣)를 충전하십시오.';
  } else {
    pungryudoLifeCultivation = '가악상열(歌樂相悅): 경직된 긴장을 풀고 마음을 편안하게 해 주는 음악과 예술의 즐거움으로 기운을 북돋우십시오.';
  }

  let hwarangCourageGuidance: string;
  if (dominantPrecept.id === 'im_jeon_mu_toe') {
    hwarangCourageGuidance = `임전무퇴의 당당한 기백이 발동하는 시기입니다. 시련이나 경쟁을 두려워하지 말고, 오랜 시간 갈고닦은 실력을 믿고 정면으로 맞서십시오.`;
  } else if (dominantPrecept.id === 'gyo_woo_i_sin') {
    hwarangCourageGuidance = `교우이신의 한결같은 신의가 대성공의 열쇠입니다. 약속과 투명한 소통을 철저히 지키면 동료와 협력자가 천군만마가 되어 줄 것입니다.`;
  } else {
    hwarangCourageGuidance = `${dominantPrecept.nameKo}의 가치를 나침반 삼아, 유·불·선을 아우르는 풍류도의 유연하고 현묘한 조화로 난관을 슬기롭게 돌파하십시오.`;
  }

  const temporalPungryuRhythm = getTemporalPungryuRhythm(now);
  const situationalPungryuAudit = /관계|친구|동료|연애|사랑|약속|갈등/.test(contextText)
    ? {
        focusTheme: '교우이신(신의)과 살생유택(상생 절제)',
        preceptAlignmentNote: '관계에서는 약속의 무게를 지키되 상대를 몰아세우지 않는 너그러움이 가장 큰 힘이 됩니다.',
        cultivationTone: '도의상마 — 진실한 대화로 서로의 품격을 지켜주는 태도',
      }
    : /도전|시험|이직|사업|일|결단|승부/.test(contextText)
      ? {
          focusTheme: '임전무퇴(기개)와 사군이충(사명감)',
          preceptAlignmentNote: '물러서지 않는 당당함 위에 맡은 바 책임을 끝까지 완수하는 진정성이 더해질 때 승부가 갈립니다.',
          cultivationTone: '호연지기 — 작은 이해득실에 흔들리지 않는 큰 시야',
        }
      : {
          focusTheme: '유·불·선 삼교융합 풍류도의 균형',
          preceptAlignmentNote: `${dominantPrecept.nameKo}와 ${secondaryPrecept.nameKo}을 아울러 유연함과 단단함을 함께 갖추십시오.`,
          cultivationTone: pungryudoLifeCultivation,
        };

  const pungryuSynthesisMatrix = {
    coreInsight: `주재 오계 [${dominantPrecept.nameKo}]와 보조 [${secondaryPrecept.nameKo}]가 ${situationalPungryuAudit.focusTheme}을 비춥니다.`,
    recommendedAction: `${hwarangCourageGuidance} (${dominantPrecept.guidanceAction})`,
    cautionNotice: '기개만 앞서 살생유택의 절제를 잃거나, 풍류에 치우쳐 임전무퇴의 결단을 미루지 않도록 경계하십시오.',
  };

  const ritualAction = `[${dominantPrecept.nameKo.split(' ')[0]}] ${dominantPrecept.guidanceAction}`;
  const reflectionFocus = contextText.trim()
    ? `"${contextText.trim()}" 앞에서 나는 ${dominantPrecept.nameKo}의 중심을 어떻게 지킬 수 있는가?`
    : `오늘 마주한 선택에서 풍류도의 유연함과 ${dominantPrecept.nameKo}의 기개는 어떻게 만나는가?`;
  const reflectiveQuestion = contextText.trim()
    ? `지금 "${contextText.trim()}" 앞에서 ${dominantPrecept.nameKo}(${dominantPrecept.hanja})의 기개와 풍류도의 유연함을 살려 내가 먼저 실행할 한 가지는 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: KOREAN_PUNGRYUDO_HWARANG_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst: temporalPungryuRhythm.kstTimeLabel,
    pungryuXuanmiaoHarmonyScore,
    hoyounjigiSpiritualCourageScore,
    socialFaithLoyaltyScore,
    gaAkSangYeolJoyVibration,
    dominantPrecept,
    secondaryPrecept,
    situationalPungryuAudit,
    temporalPungryuRhythm,
    pungryuSynthesisMatrix,
    pungryudoLifeCultivation,
    hwarangCourageGuidance,
    boundaryNotice: '본 결과는 최치원 《난랑비서》 풍류도와 원광법사 《세속오계》의 인문·정신 철학에 기반한 정성적 성찰 안내이며, 확정적 길흉 판정이 아닙니다.',
    interpretiveBoundary: '본 결과는 최치원 《난랑비서》 풍류도와 원광법사 《세속오계》의 인문·정신 철학에 기반한 정성적 성찰 안내이며, 확정적 길흉 판정이 아닙니다.',
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
  };
}

export function formatKoreanPungryudoHwarangPrompt(
  report: KoreanPungryudoHwarangReport
): string {
  return [
    `### 🌸 고대 한국 신라 최치원 난랑비서 풍류도 현묘지도 & 화랑도 세속오계 리포트`,
    `- 엔진 버전: v${report.engineVersion} | 연산 시각: ${report.calculatedAtKst}`,
    `- 핵심 화랑 세속오계: ${report.dominantPrecept.nameKo} (${report.dominantPrecept.hanja}) — ${report.dominantPrecept.coreSpirit}`,
    `- 보조 화랑 세속오계: ${report.secondaryPrecept.nameKo} (${report.secondaryPrecept.hanja}) — ${report.secondaryPrecept.coreSpirit}`,
    `- 질문 맥락 감사 (${report.situationalPungryuAudit.focusTheme}): ${report.situationalPungryuAudit.preceptAlignmentNote} (${report.situationalPungryuAudit.cultivationTone})`,
    `- KST 시공간 풍류 리듬: ${report.temporalPungryuRhythm.hwarangWatchWindow} / ${report.temporalPungryuRhythm.seasonalMountainTone}`,
    `  • 시공간 지침: ${report.temporalPungryuRhythm.temporalGuidance}`,
    `- 풍류 교차 매트릭스: 핵심(${report.pungryuSynthesisMatrix.coreInsight}) | 실행(${report.pungryuSynthesisMatrix.recommendedAction}) | 주의(${report.pungryuSynthesisMatrix.cautionNotice})`,
    `- 풍류도 심신수련 처방: ${report.pungryudoLifeCultivation}`,
    `- 화랑도 기개·결단 지침: ${report.hwarangCourageGuidance}`,
    `- 실천 의례(Ritual Action): ${report.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${report.reflectionFocus}`,
    `- 질문 맞춤 성찰 질문: ${report.reflectiveQuestion}`,
    `- 해석 경계: ${report.boundaryNotice}`,
  ].join('\n');
}
