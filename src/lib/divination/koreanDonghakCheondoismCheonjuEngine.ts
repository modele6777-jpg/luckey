/**
 * 동학(東學) 수운 최제우 시천주(侍天主) 주문 & 지기금지(至氣今至) 인내천 천지조화 엔진
 *
 * LUCKEY-DONGHAK-CHEONDOISM-CHEONJU-v1.0.0
 *
 * 1860년(경신년) 경주 용담정에서 수운(水雲) 최제우(崔濟愚) 선생이 창도한 동학(東學, 천도교)의
 * 핵심 경전 《동경대전(東經大全)》 및 《용담유사(龍潭遺詞)》에 기반한 우주론 및 심성 개벽 결정론 엔진.
 *
 * [핵심 교리 및 수리 체계]
 * 1. 21자 시천주(侍天主) 본주문 & 강령주문:
 *    - 강령주문 (降靈呪文): "至氣今至 願爲大降" (지기금지 원위대강 - 지극한 기운이 지금 이르렀으니 크게 내리기를 원하옵니다)
 *    - 본주문 (本呪文): "侍天主 造化定 永世不忘 萬事知" (시천주 조화정 영세불망 만사지 - 내 안에 한울님을 모셔 조화가 정해지니 영세토록 잊지 아니하면 만사를 알게 되리라)
 * 2. 모실 시(侍) 자의 3대 심성 층위 (三字義):
 *    - 내유신령 (內有神靈): 사람의 마음속에 이미 신령한 한울님의 성령이 깃들어 있음 (내재적 신성 자아)
 *    - 외유기화 (外有氣化): 온 우주 대자연의 기운이 밖에서 서로 감응하고 화생함 (외재적 우주 감응)
 *    - 각지불이 (各知不移): 세상 만물이 각기 스스로 이 이치를 깨달아 흔들리지 아니함 (부동심 및 영구적 자각)
 * 3. 인내천(人乃天) 및 사인여천(事人如天):
 *    - 사람이 곧 한울이니, 사람을 대할 때 한울님처럼 공경하여 섬김
 * 4. 다시 개벽(開闢):
 *    - 낡은 운기가 소멸하고 새로운 생명과 지혜의 문명이 열리는 대전환의 기운
 */

import type { UserProfile } from '../sharedState';

export const DONGHAK_CHEONDOISM_VERSION = '2.2.0';

export interface DonghakCheonjuReport {
  engineVersion: string;
  calculatedAt: string;
  calculatedAtKst: string;
  // 3대 시(侍) 심성 층위 (내부 호환용, 프롬프트 비노출)
  innerSpiritualityScore: number; // 내유신령 (內有神靈, 0~100)
  outerCosmicResonanceScore: number; // 외유기화 (外有氣化, 0~100)
  unshakableAwakeningScore: number; // 각지불이 (各知不移, 0~100)
  // 동학 종합 지표 (내부 호환용, 프롬프트 비노출)
  jigiUniversalEnergyAlignment: number; // 지기금지(至氣今至) 우주 기운 감응도 (0~100)
  gaebyeokTransformationIndex: number; // 다시 개벽(開闢) 운기 대전환 지수 (0~100)
  mansajiOmniscientWisdomScore: number; // 영세불망 만사지(萬事知) 통찰 지수 (0~100)
  // 수운 심법 처방
  primaryVirtue: {
    titleKo: string;
    hanja: string;
    meaning: string;
  };
  twentyOneWordsMantraFocus: {
    phraseHanja: string;
    phraseKo: string;
    spiritualApplication: string;
  };
  situationalDonghakAudit: {
    focusTheme: string;
    samjauiAlignmentNote: string;
    practiceFocus: string;
  };
  temporalDonghakRhythm: {
    kstTimeLabel: string;
    yongdamWatchWindow: string;
    seasonalGaebyeokTone: string;
    temporalGuidance: string;
  };
  donghakSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  sainyeocheonGuidance: string;
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
}

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const DONGHAK_VIRTUES = [
  {
    titleKo: '내유신령 (내면의 한울님 자각)',
    hanja: '內有神靈',
    meaning: '모든 답은 외부의 권위나 타인의 평가가 아닌, 그대 내면에 이미 온전히 모셔진 한울님의 영성에 있습니다.',
  },
  {
    titleKo: '외유기화 (우주 생명과의 호흡)',
    hanja: '外有氣化',
    meaning: '천지자연의 지극한 기운이 온몸을 감싸고 있으니, 억지 의지를 내려놓고 만물의 조화로운 흐름에 순응하십시오.',
  },
  {
    titleKo: '각지불이 (흔들리지 않는 자각)',
    hanja: '各知不移',
    meaning: '진리를 스스로 깨달아 어떠한 세속의 시련과 번뇌에도 중심을 잃지 않는 부동의 평정심을 회복하십시오.',
  },
  {
    titleKo: '사인여천 (사람을 하늘처럼 공경)',
    hanja: '事人如天',
    meaning: '마주하는 인연과 동료를 한울님 모시듯 정성껏 대할 때, 막혔던 운로가 스스로 활짝 열립니다.',
  },
  {
    titleKo: '동귀일체 (모두가 하나로 돌아감)',
    hanja: '同歸一體',
    meaning: '나와 타자, 인간과 우주가 근원적으로 둘이 아님을 통찰하여 대립을 해소하고 대화합의 조화를 이루십시오.',
  },
];

const MANTRA_FOCUS_LIST = [
  {
    phraseHanja: '至氣今至 願爲大降',
    phraseKo: '지기금지 원위대강',
    spiritualApplication: '우주 근원의 청정한 지기가 지금 이 순간 머리끝부터 발끝까지 크게 내리도록 심호흡하며 기운을 정화하십시오.',
  },
  {
    phraseHanja: '侍天主 造化定',
    phraseKo: '시천주 조화정',
    spiritualApplication: '내면의 존엄한 주체성을 바로 세울 때, 삶의 모든 혼란이 저절로 정연한 조화로 안정됩니다.',
  },
  {
    phraseHanja: '永世不忘 萬事知',
    phraseKo: '영세불망 만사지',
    spiritualApplication: '순수한 본성을 순간도 잊지 않고 늘 기억하면, 복잡한 현실의 가닥과 해법이 거울처럼 환히 드러납니다.',
  },
];

function getTemporalDonghakRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const yongdamWatchWindow =
    hour >= 5 && hour < 11
      ? '용담정 아침 청수창 — 지기금지(至氣今至)의 맑은 숨결로 하루의 첫 뜻을 여는 시간'
      : hour >= 11 && hour < 17
        ? '외유기화 정오 교류창 — 만물과 사람 사이에서 사인여천을 실천으로 옮기는 시간'
        : hour >= 17 && hour < 22
          ? '시천주 황혼 성찰창 — 하루의 분주함을 거두고 내유신령의 중심으로 돌아오는 시간'
          : '만사지 심야 고요창 — 영세불망의 고요 속에서 흔들리지 않는 각지불이를 세우는 시간';

  const seasonalGaebyeokTone =
    month >= 3 && month <= 5
      ? '봄 · 후천개벽 발아기 (낡은 틀을 벗고 새 생명의 기운을 맞이하는 시기)'
      : month >= 6 && month <= 8
        ? '여름 · 보국안민 발현기 (열정으로 주변과 상생하며 조화를 넓히는 시기)'
        : month >= 9 && month <= 11
          ? '가을 · 각지불이 수렴기 (흔들리지 않는 깨달음으로 결실을 갈무리하는 시기)'
          : '겨울 · 수심정기(守心正氣) 응축기 (마음을 지키고 기운을 바르게 기르는 시기)';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} KST`,
    yongdamWatchWindow,
    seasonalGaebyeokTone,
    temporalGuidance: `${yongdamWatchWindow} · ${seasonalGaebyeokTone}의 결에 맞추어 수심정기(守心正氣)의 태도를 유지하십시오.`,
  };
}

export function calculateDonghakCheondoismCheonju(
  profile?: UserProfile | null,
  nowArg?: Date,
  questionArg?: string
): DonghakCheonjuReport {
  const now = nowArg || new Date();
  const question = (questionArg || '').trim();
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_${question}_donghak_cheonju_v2`;
  const seed = djb2Hash(seedStr);

  const innerSpiritualityScore = 65 + (seed % 34);
  const outerCosmicResonanceScore = 60 + ((seed >> 2) % 39);
  const unshakableAwakeningScore = 62 + ((seed >> 4) % 37);

  const jigiUniversalEnergyAlignment = Math.round((innerSpiritualityScore * 0.4) + (outerCosmicResonanceScore * 0.6));
  const gaebyeokTransformationIndex = 63 + ((seed >> 6) % 36);
  const mansajiOmniscientWisdomScore = Math.round((unshakableAwakeningScore * 0.5) + (gaebyeokTransformationIndex * 0.5));

  const primaryVirtue = DONGHAK_VIRTUES[seed % DONGHAK_VIRTUES.length];
  const twentyOneWordsMantraFocus = MANTRA_FOCUS_LIST[(seed >> 3) % MANTRA_FOCUS_LIST.length];

  let sainyeocheonGuidance = '';
  if (innerSpiritualityScore >= 80) {
    sainyeocheonGuidance = '내면의 한울님 자성이 지극히 맑아 직관과 판단력이 최고조입니다. 스스로를 의심하지 말고 결단하십시오.';
  } else if (outerCosmicResonanceScore >= 80) {
    sainyeocheonGuidance = '천지자연과 주변 사람들과의 기운 조화가 탁월합니다. 협업과 대인관계에서 큰 은혜를 입게 됩니다.';
  } else {
    sainyeocheonGuidance = '지기금지(至氣今至)의 고요한 침묵을 취하며, 일상의 사소한 인연에도 공경의 예를 다할 때 개벽의 복운이 열립니다.';
  }

  const temporalDonghakRhythm = getTemporalDonghakRhythm(now);
  const situationalDonghakAudit = /관계|사람|가족|연애|동료|갈등/.test(question)
    ? {
        focusTheme: '사인여천(事人如天)과 동귀일체의 관계 공명',
        samjauiAlignmentNote: '상대를 내 안의 한울님처럼 공경할 때 대립의 벽이 자연히 허물어집니다.',
        practiceFocus: '먼저 부드러운 말과 경청으로 상대의 존엄을 세워주십시오.',
      }
    : /일|사업|직장|결정|변화|이직/.test(question)
      ? {
          focusTheme: '다시 개벽(開闢)과 각지불이의 주체적 전환',
          samjauiAlignmentNote: '외부의 흐름(외유기화)을 읽되 내면의 기준(각지불이)을 흔들림 없이 세우십시오.',
          practiceFocus: '21자 주문의 고요한 집중처럼 핵심 과업 하나를 정해 정성을 쏟으십시오.',
        }
      : {
          focusTheme: '내유신령(內有神靈)과 수심정기의 내면 조화',
          samjauiAlignmentNote: '수심정기(마음을 지키고 기운을 바르게 함)가 모든 판단의 출발점입니다.',
          practiceFocus: '잠시 숨을 고르며 오늘의 심법 덕목을 조용히 되새기십시오.',
        };

  const donghakSynthesisMatrix = {
    coreInsight: `[${primaryVirtue.titleKo}]와 주문 구절 [${twentyOneWordsMantraFocus.phraseKo}]가 ${situationalDonghakAudit.focusTheme}을 비춥니다.`,
    recommendedAction: `${sainyeocheonGuidance} (${situationalDonghakAudit.practiceFocus})`,
    cautionNotice: '조급함으로 외유기화의 흐름을 거스르거나 스스로의 내적 존엄을 가볍게 여기지 않도록 경계하십시오.',
  };

  const ritualAction = `[${primaryVirtue.titleKo} · ${twentyOneWordsMantraFocus.phraseKo}] ${situationalDonghakAudit.practiceFocus}`;
  const reflectionFocus = question
    ? `'${question}' 앞에서 내면의 한울님 자성(내유신령)을 지키며 오늘 사람을 대할 사인여천의 태도는 무엇인가요?`
    : `지금 내 마음을 맑히고 수심정기(守心正氣)로 흔들림 없이 지켜야 할 중심은 무엇인가요?`;

  return {
    engineVersion: DONGHAK_CHEONDOISM_VERSION,
    calculatedAt: now.toISOString(),
    calculatedAtKst: temporalDonghakRhythm.kstTimeLabel,
    innerSpiritualityScore,
    outerCosmicResonanceScore,
    unshakableAwakeningScore,
    jigiUniversalEnergyAlignment,
    gaebyeokTransformationIndex,
    mansajiOmniscientWisdomScore,
    primaryVirtue,
    twentyOneWordsMantraFocus,
    situationalDonghakAudit,
    temporalDonghakRhythm,
    donghakSynthesisMatrix,
    sainyeocheonGuidance,
    boundaryNotice: '본 결과는 《동경대전》 시천주·인내천 철학에 기반한 정성적 성찰 안내이며, 확정적 길흉 판정이 아닙니다.',
    interpretiveBoundary: '본 결과는 《동경대전》 시천주·인내천 철학에 기반한 정성적 성찰 안내이며, 확정적 길흉 판정이 아닙니다.',
    ritualAction,
    reflectionFocus,
  };
}

export function formatDonghakCheondoismCheonjuPrompt(report: DonghakCheonjuReport): string {
  return [
    `[동학 수운 최제우 시천주(侍天主) & 지기금지 인내천 천지조화 (v${report.engineVersion})]`,
    `- 연산 시각: ${report.calculatedAtKst}`,
    `- 핵심 심법 덕목: ${report.primaryVirtue.titleKo} (${report.primaryVirtue.hanja}) - ${report.primaryVirtue.meaning}`,
    `- 21자 주문 집중 명상: ${report.twentyOneWordsMantraFocus.phraseHanja} (${report.twentyOneWordsMantraFocus.phraseKo}) -> ${report.twentyOneWordsMantraFocus.spiritualApplication}`,
    `- 질문 맥락 감사 (${report.situationalDonghakAudit.focusTheme}): ${report.situationalDonghakAudit.samjauiAlignmentNote} / 실천: ${report.situationalDonghakAudit.practiceFocus}`,
    `- KST 시공간 용담 리듬: ${report.temporalDonghakRhythm.yongdamWatchWindow} / ${report.temporalDonghakRhythm.seasonalGaebyeokTone}`,
    `  • 시공간 지침: ${report.temporalDonghakRhythm.temporalGuidance}`,
    `- 동학 교차 매트릭스: 핵심(${report.donghakSynthesisMatrix.coreInsight}) | 실행(${report.donghakSynthesisMatrix.recommendedAction}) | 주의(${report.donghakSynthesisMatrix.cautionNotice})`,
    `- 사인여천(事人如天) 실천 지침: ${report.sainyeocheonGuidance}`,
    `- 실천 의례(Ritual Action): ${report.ritualAction}`,
    `- 성찰 초점(Reflection Focus): ${report.reflectionFocus}`,
    `- 해석 경계: ${report.boundaryNotice}`,
  ].join('\n');
}
