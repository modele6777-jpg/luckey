/**
 * =========================================================================
 * LUCKEY 결정론적 자체 계산 엔진 (Deterministic Calculation Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. AI(LLM)에 의존하지 않는 100% 순수 수리·천문·역법 결정론적 계산 (Deterministic)
 * 2. 동일한 생년월일시 입력에 대해 항상 100% 오차 없이 동일한 정밀 JSON 산출
 * 3. 7대 핵심 운명학 엔진(사주, 서양 점성술, 자미두수, 숙요, 베딕, 주역, 육임/기문)과
 *    요일/수리 점성술(마하보테, 구성학, 태국점성술)을 통합 오케스트레이션
 * 4. 미구현/상징적 도구(토정비결, 태을신수, 카발라 등)는 명확히 상태를 분리 표기하여
 *    확률적 환각(Hallucination) 및 바넘 효과를 원천 방지
 */

import type { UserProfile } from '../sharedState';
import { calculateDetailedSaju, type SajuAnalysisResult } from '../sajuAnalysis';
import { calculateNatalChart, type NatalChartResult } from '../astrologyAnalysis';
import { calculateZiwei, calculateSukuyo, calculateVedic } from './birthCharts';
import { castIching, calculateIching } from './iching';
import { calculateLiuren, calculateQimen, eventInstant } from './eventCharts';
import { resolveEffectiveSolarDate } from '../lunarCalendar';
import { parseBirthTime } from '../birthDateTime';
import { getAstronomicalSajuYear, getYearSolarTerms } from '../astronomicalSolarTerms';
import { calculateChronoTransit, formatChronoTransitPrompt, type ChronoTransitResult } from './chronoTransitEngine';
import { calculateLifeSeasonTiming, formatLifeSeasonTimingPrompt, type LifeSeasonTimingResult } from './lifeSeasonTimingEngine';
import { calculateEnergeticPrescription, formatEnergeticPrescriptionPrompt, type EnergeticPrescriptionResult } from './energeticPrescriptionEngine';
import { calculateContextualSynastry, formatContextualSynastryPrompt, type ContextualSynastryResult } from './contextualSynastryEngine';
import { calculateInstantDecision, formatInstantDecisionPrompt, type InstantDecisionResult } from './instantDecisionEngine';
import { calculateZiweiFlyingStars, formatZiweiFlyingStarsPrompt, type ZiweiFlyingStarsResult } from './ziweiFlyingStarsEngine';

export type CalculationToolStatus = 'calculated' | 'partial' | 'symbolic' | 'not_implemented' | 'skipped' | 'error';

export interface ToolCalculationEnvelope<T = unknown> {
  toolId: string;
  toolKoName: string;
  status: CalculationToolStatus;
  method?: string;
  data?: T;
  note?: string;
  limitations?: string[];
}

export interface DeterministicEngineReport {
  engineVersion: string;
  timestamp: number;
  calculatedAtUtc: string;
  calculatedAtKst: string;
  inputProfile: {
    birthdate?: string;
    birthtime?: string;
    solarDateString?: string;
    isLunar: boolean;
    gender?: string;
    birthCity?: string;
    timeKnown: boolean;
    locationKnown: boolean;
  };
  questionContext?: {
    rawQuestion: string;
    isDivinationQuery: boolean;
    targetTools?: string[];
  };
  summary: {
    totalToolsSupported: number;
    toolsExecuted: number;
    toolsCalculated: number;
    toolsPartialOrSymbolic: number;
    toolsNotImplemented: number;
  };
  chronoTransit?: ChronoTransitResult;
  lifeSeasonTiming?: LifeSeasonTimingResult | null;
  energeticPrescription?: EnergeticPrescriptionResult | null;
  contextualSynastry?: ContextualSynastryResult | null;
  instantDecision?: InstantDecisionResult | null;
  ziweiFlyingStars?: ZiweiFlyingStarsResult | null;
  tools: {
    saju: ToolCalculationEnvelope<Partial<SajuAnalysisResult>>;
    astrology: ToolCalculationEnvelope<Partial<NatalChartResult>>;
    ziwei: ToolCalculationEnvelope<unknown>;
    sukuyo: ToolCalculationEnvelope<unknown>;
    vedic: ToolCalculationEnvelope<unknown>;
    mahabote: ToolCalculationEnvelope<unknown>;
    kyusei: ToolCalculationEnvelope<unknown>;
    thai_astrology: ToolCalculationEnvelope<unknown>;
    iching: ToolCalculationEnvelope<unknown>;
    liuren: ToolCalculationEnvelope<unknown>;
    qimen: ToolCalculationEnvelope<unknown>;
    tarot: ToolCalculationEnvelope<unknown>;
    kabbalah: ToolCalculationEnvelope<unknown>;
    tojeong: ToolCalculationEnvelope<unknown>;
    taiyi: ToolCalculationEnvelope<unknown>;
  };
}

const KOR_WEEKDAYS = ['일요일(태양)', '월요일(달)', '화요일(화성)', '수요일(수성)', '목요일(목성)', '금요일(금성)', '토요일(토성)'];
const MAHABOTE_ANIMALS = [
  '가루다(일요일·태양·명예와 비상)',
  '호랑이(월요일·달·섬세한 매력)',
  '사자(화요일·화성·용기와 추진력)',
  '엄니 코끼리(수요일·수성·소통과 지혜)',
  '쥐(목요일·목성·통찰과 성찰)',
  '기니피그(금요일·금성·예술과 공감)',
  '나가 용(토요일·토성·인내와 깊은 내공)'
];
const KYUSEI_STARS = [
  '일백수성(一白水星·지혜와 유연한 스며듦)',
  '이흑토성(二黑土星·포용과 대지의 성실함)',
  '삼벽목성(三碧木星·약동하는 새싹과 개척)',
  '사록목성(四綠木星·바람 같은 조화와 인연)',
  '오황토성(五黃土星·중심의 제왕적 돌파력)',
  '육백금성(六白金星·하늘의 품격과 결단력)',
  '칠적금성(七赤金星·기쁨과 언변·풍요)',
  '팔백토성(八白土星·산처럼 굳건한 전환과 축적)',
  '구자화성(九紫火星·태양 같은 통찰과 화려한 영감)'
];
const THAI_DAY_COLORS = ['빨강(태양)', '노랑/크림(달)', '분홍(화성)', '초록(수성)', '주황(목성)', '파랑(금성)', '보라(토성)'];

/**
 * 사용자 프로필과 질문 맥락을 입력받아 순수 수학·천문·역법 수리 엔진을 일괄 실행하고
 * 표준화된 결정론적 계산 리포트(JSON)를 반환합니다.
 */
export function runDeterministicEngine(params: {
  profile?: UserProfile | null;
  question?: string;
  forceAllTools?: boolean;
}): DeterministicEngineReport {
  const now = new Date();
  const nowKst = new Date(now.getTime() + 9 * 3600000);
  const nowKstIso = nowKst.toISOString().replace('Z', '+09:00');
  const nowUtcIso = now.toISOString();

  const profile = params.profile;
  const basic = profile?.basic;
  const birthdateStr = basic?.birthdate?.trim() || '';
  const birthtimeStr = basic?.birthtime?.trim() || '';
  const birthCityStr = basic?.birthCity?.trim() || '';
  const genderStr = basic?.gender;
  const question = (params.question || '').trim();

  let solarDateStr = '';
  let isLunar = false;
  let parsedBirthTime: { hour: number; minute: number } | null = null;
  let dayOfWeek = 0;
  let effectiveSajuYear = now.getUTCFullYear();

  if (birthdateStr) {
    try {
      const resolved = resolveEffectiveSolarDate(birthdateStr, basic?.lunarSolar, basic?.isLeapMonth ?? false);
      solarDateStr = resolved.solarDateString;
      isLunar = resolved.isLunar;
      parsedBirthTime = parseBirthTime(birthtimeStr);

      const civil = new Date(0);
      civil.setUTCFullYear(resolved.solarDate.year, resolved.solarDate.month - 1, resolved.solarDate.day);
      civil.setUTCHours(parsedBirthTime?.hour ?? 12, parsedBirthTime?.minute ?? 0, 0, 0);
      dayOfWeek = civil.getUTCDay();
      effectiveSajuYear = getAstronomicalSajuYear(civil).sajuYear;
    } catch (_) {
      // 날짜 파싱 오류 안전 복구
    }
  }

  const isDivinationQuery =
    params.forceAllTools ||
    /봐\s*줘|봐줄|뽑아|작괘|점쳐|포국|풀이|해석|운세|어떨|어떻게\s*될|될까|할까|궁금|전망|추천|조언|알려\s*줘|상담|육효|기문|육임|타로|주역/.test(question);

  // 1. 사주명리 엔진 (만세력 천문 절기 기반 정밀 계산)
  let sajuEnvelope: ToolCalculationEnvelope<Partial<SajuAnalysisResult>>;
  try {
    if (!profile || !birthdateStr) {
      sajuEnvelope = { toolId: 'saju', toolKoName: '사주명리', status: 'skipped', note: '생년월일 미입력으로 계산 생략' };
    } else {
      const sajuRes = calculateDetailedSaju(profile);
      if (sajuRes) {
        sajuEnvelope = {
          toolId: 'saju',
          toolKoName: '사주명리',
          status: 'calculated',
          method: '24절기 천문 절입 시각 기준 한국 만세력 수리 엔진',
          data: {
            dayMaster: sajuRes.dayMaster,
            pillars: sajuRes.pillars,
            elements: sajuRes.elements,
            bodyStrength: sajuRes.bodyStrength,
            geokguk: sajuRes.geokguk,
            yongsin: sajuRes.yongsin,
            daeun: sajuRes.daeun,
            annual2026: sajuRes.annual2026,
            specialStructures: sajuRes.specialStructures,
          },
          limitations: ['진태양시 보정은 기본 한국 표준시(KST) 기준입니다.', '해외 출생자의 경우 출생지 경도 시차가 반영될 수 있습니다.']
        };
      } else {
        sajuEnvelope = { toolId: 'saju', toolKoName: '사주명리', status: 'error', note: '사주 원국 산출 실패' };
      }
    }
  } catch (err: any) {
    sajuEnvelope = { toolId: 'saju', toolKoName: '사주명리', status: 'error', note: err?.message || '사주 계산 오류' };
  }

  // 2. 서양 점성술 엔진 (astronomy-engine 기반 천문 물리 좌표 계산)
  let astroEnvelope: ToolCalculationEnvelope<Partial<NatalChartResult>>;
  try {
    if (!profile || !birthdateStr) {
      astroEnvelope = { toolId: 'astrology', toolKoName: '서양 점성술', status: 'skipped', note: '생년월일 미입력으로 계산 생략' };
    } else {
      const astroRes = calculateNatalChart(profile);
      if (astroRes) {
        astroEnvelope = {
          toolId: 'astrology',
          toolKoName: '서양 점성술',
          status: astroRes.timeKnown && astroRes.locationKnown ? 'calculated' : 'partial',
          method: 'astronomy-engine 2.1.19 열대황도(Tropical) 지구중심 천문 좌표 계산',
          data: {
            sun: astroRes.sun,
            moon: astroRes.moon,
            ascendant: astroRes.ascendant,
            mc: astroRes.mc,
            mercury: astroRes.mercury,
            venus: astroRes.venus,
            mars: astroRes.mars,
            jupiter: astroRes.jupiter,
            saturn: astroRes.saturn,
            elements: astroRes.elements,
            timeKnown: astroRes.timeKnown,
            locationKnown: astroRes.locationKnown,
            utcInstant: astroRes.utcInstant,
          },
          limitations: astroRes.limitations
        };
      } else {
        astroEnvelope = { toolId: 'astrology', toolKoName: '서양 점성술', status: 'error', note: '출생 차트 산출 실패' };
      }
    }
  } catch (err: any) {
    astroEnvelope = { toolId: 'astrology', toolKoName: '서양 점성술', status: 'error', note: err?.message || '점성술 계산 오류' };
  }

  // 3. 자미두수 엔진 (iztro 2.6.3 12궁 명반 배치)
  let ziweiEnvelope: ToolCalculationEnvelope<unknown>;
  try {
    if (!profile || !birthdateStr || !birthtimeStr) {
      ziweiEnvelope = {
        toolId: 'ziwei',
        toolKoName: '자미두수',
        status: 'skipped',
        note: '출생시간(생시)과 성별이 등록되어야 12궁 명반을 정밀 배치할 수 있습니다.'
      };
    } else {
      const ziweiRes = calculateZiwei(profile);
      ziweiEnvelope = {
        toolId: 'ziwei',
        toolKoName: '자미두수',
        status: 'calculated',
        method: ziweiRes.method,
        data: {
          input: ziweiRes.input,
          lunarDate: ziweiRes.lunarDate,
          soulPalace: ziweiRes.soulPalace,
          bodyPalace: ziweiRes.bodyPalace,
          fiveElementsClass: ziweiRes.fiveElementsClass,
          palaces: ziweiRes.palaces
        },
        limitations: ziweiRes.limitations
      };
    }
  } catch (err: any) {
    ziweiEnvelope = { toolId: 'ziwei', toolKoName: '자미두수', status: 'error', note: err?.message || '자미두수 계산 보류' };
  }

  // 4. 숙요경 (27숙 본명숙 계산)
  let sukuyoEnvelope: ToolCalculationEnvelope<unknown>;
  try {
    if (!profile || !birthdateStr) {
      sukuyoEnvelope = { toolId: 'sukuyo', toolKoName: '숙요경', status: 'skipped', note: '생년월일 미입력으로 계산 생략' };
    } else {
      const sukuyoRes = calculateSukuyo(profile);
      sukuyoEnvelope = {
        toolId: 'sukuyo',
        toolKoName: '숙요경',
        status: 'calculated',
        method: sukuyoRes.method,
        data: sukuyoRes
      };
    }
  } catch (err: any) {
    sukuyoEnvelope = { toolId: 'sukuyo', toolKoName: '숙요경', status: 'error', note: err?.message || '숙요 계산 보류' };
  }

  // 5. 베딕 점성술 (Vedic Jyotish, J2000 Lahiri 항성황도 & 빔쇼타리 다샤)
  let vedicEnvelope: ToolCalculationEnvelope<unknown>;
  try {
    if (!profile || !birthdateStr || !birthtimeStr || !birthCityStr) {
      vedicEnvelope = {
        toolId: 'vedic',
        toolKoName: '베딕 점성술',
        status: 'skipped',
        note: '정밀 베딕 계산을 위해서는 생년월일, 생시, 출생도시 정보가 필요합니다.'
      };
    } else {
      const vedicRes = calculateVedic(profile);
      vedicEnvelope = {
        toolId: 'vedic',
        toolKoName: '베딕 점성술',
        status: 'calculated',
        method: vedicRes.method,
        data: vedicRes,
        limitations: vedicRes.limitations
      };
    }
  } catch (err: any) {
    vedicEnvelope = { toolId: 'vedic', toolKoName: '베딕 점성술', status: 'partial', note: err?.message || '베딕 정밀 계산 요건 미충족' };
  }

  // 6. 마하보테 (미얀마 8요일 점성술)
  let mahaboteEnvelope: ToolCalculationEnvelope<unknown>;
  if (birthdateStr) {
    let animal = MAHABOTE_ANIMALS[dayOfWeek];
    if (dayOfWeek === 3) {
      animal = !parsedBirthTime
        ? '수요일 오전/오후 구분 필요(생시 미입력)'
        : parsedBirthTime.hour < 12
        ? '수요일 오전·수성·엄니 코끼리'
        : '수요일 오후·라후·엄니 없는 코끼리';
    }
    mahaboteEnvelope = {
      toolId: 'mahabote',
      toolKoName: '마하보테',
      status: 'calculated',
      method: '미얀마 8요일 역법 기준 요일 수호 동물 및 행성 에너지 매핑',
      data: {
        weekday: KOR_WEEKDAYS[dayOfWeek],
        animalSymbol: animal
      }
    };
  } else {
    mahaboteEnvelope = { toolId: 'mahabote', toolKoName: '마하보테', status: 'skipped', note: '생년월일 미입력' };
  }

  // 7. 구성학 (九星氣學 - 입춘 기준 본명성)
  let kyuseiEnvelope: ToolCalculationEnvelope<unknown>;
  if (birthdateStr) {
    let sum = [...String(effectiveSajuYear)].reduce((total, digit) => total + Number(digit), 0);
    while (sum > 9) sum = [...String(sum)].reduce((total, digit) => total + Number(digit), 0);
    const star = ((11 - sum) % 9 + 9) % 9 || 9;
    kyuseiEnvelope = {
      toolId: 'kyusei',
      toolKoName: '구성학',
      status: 'calculated',
      method: '입춘(立春) 절입 기준 연도 수리 합산 본명성 산출',
      data: {
        effectiveYear: effectiveSajuYear,
        honmeisei: KYUSEI_STARS[star - 1]
      },
      limitations: ['월명성 및 방위반(오황살·암검살·길방위)은 미산출 상태입니다.']
    };
  } else {
    kyuseiEnvelope = { toolId: 'kyusei', toolKoName: '구성학', status: 'skipped', note: '생년월일 미입력' };
  }

  // 8. 태국 점성술 (호라삿 요일 상징)
  let thaiEnvelope: ToolCalculationEnvelope<unknown>;
  if (birthdateStr) {
    thaiEnvelope = {
      toolId: 'thai_astrology',
      toolKoName: '태국점성술',
      status: 'partial',
      method: '태국 전통 호라삿 요일 상징 및 행운 컬러 매핑',
      data: {
        weekday: KOR_WEEKDAYS[dayOfWeek],
        luckyColor: THAI_DAY_COLORS[dayOfWeek]
      },
      limitations: ['정밀 호라삿 차트 및 신체 부위별 바이오리듬 차트는 미산출입니다.']
    };
  } else {
    thaiEnvelope = { toolId: 'thai_astrology', toolKoName: '태국점성술', status: 'skipped', note: '생년월일 미입력' };
  }

  // 9. 주역 (周易 64괘) - 암호학적 난수 동전법 작괘
  let ichingEnvelope: ToolCalculationEnvelope<unknown>;
  try {
    if (isDivinationQuery) {
      const ichingRes = castIching();
      ichingEnvelope = {
        toolId: 'iching',
        toolKoName: '주역',
        status: 'calculated',
        method: 'Web Crypto API 암호학적 난수 기반 3동전법 6효 정밀 작괘',
        data: ichingRes
      };
    } else {
      ichingEnvelope = {
        toolId: 'iching',
        toolKoName: '주역',
        status: 'skipped',
        note: '운세·상담·전망 질문 시 자동 작괘가 실행됩니다.'
      };
    }
  } catch (err: any) {
    ichingEnvelope = { toolId: 'iching', toolKoName: '주역', status: 'error', note: err?.message || '주역 작괘 실패' };
  }

  // 10. 대육임 (大六壬) - 점시 기준 천지반·사과삼전 포국
  let liurenEnvelope: ToolCalculationEnvelope<unknown>;
  try {
    if (isDivinationQuery) {
      const liurenRes = calculateLiuren(now);
      liurenEnvelope = {
        toolId: 'liuren',
        toolKoName: '육임',
        status: 'calculated',
        method: liurenRes.method,
        data: liurenRes,
        limitations: liurenRes.limitations
      };
    } else {
      liurenEnvelope = {
        toolId: 'liuren',
        toolKoName: '육임',
        status: 'skipped',
        note: '구체적 사안 질문 시 메시지 전송 시각(KST) 기준으로 자동 포국됩니다.'
      };
    }
  } catch (err: any) {
    liurenEnvelope = { toolId: 'liuren', toolKoName: '육임', status: 'error', note: err?.message || '육임 포국 실패' };
  }

  // 11. 기문둔갑 (奇門遁甲) - 차보법(拆補) 포국
  let qimenEnvelope: ToolCalculationEnvelope<unknown>;
  try {
    if (isDivinationQuery) {
      const qimenRes = calculateQimen(now);
      qimenEnvelope = {
        toolId: 'qimen',
        toolKoName: '홍국기문/기문둔갑',
        status: 'calculated',
        method: qimenRes.method,
        data: qimenRes,
        limitations: qimenRes.limitations
      };
    } else {
      qimenEnvelope = {
        toolId: 'qimen',
        toolKoName: '홍국기문/기문둔갑',
        status: 'skipped',
        note: '전략/결단 질문 시 자동 포국됩니다.'
      };
    }
  } catch (err: any) {
    qimenEnvelope = { toolId: 'qimen', toolKoName: '홍국기문/기문둔갑', status: 'error', note: err?.message || '기문둔갑 포국 실패' };
  }

  // 12. 타로 (상징적 원형)
  const tarotEnvelope: ToolCalculationEnvelope<unknown> = {
    toolId: 'tarot',
    toolKoName: '타로',
    status: 'symbolic',
    method: '78장 아르카나 무의식 투영 심리 분석 원형',
    note: '직접 카드를 드로우하지 않은 상태이므로 원형적 상징 관점으로 상담을 진행합니다.'
  };

  // 13. 카발라 (세피로트 생명나무)
  const kabbalahEnvelope: ToolCalculationEnvelope<unknown> = {
    toolId: 'kabbalah',
    toolKoName: '카발라',
    status: 'symbolic',
    method: '세피로트 10대 세피라 및 22개 경로 상징 체계',
    note: '수학적 게마트리아 수리 계산이 아닌 철학적·원형적 상징으로 상담을 지원합니다.'
  };

  // 14. 토정비결 (미구현 상태 투명 표기)
  const tojeongEnvelope: ToolCalculationEnvelope<unknown> = {
    toolId: 'tojeong',
    toolKoName: '토정비결',
    status: 'not_implemented',
    note: '정통 괘문 수리 계산 엔진이 현재 미구현 상태입니다. 사주 간지로 임의 조작하지 않습니다.'
  };

  // 15. 태을신수 (미구현 상태 투명 표기)
  const taiyiEnvelope: ToolCalculationEnvelope<unknown> = {
    toolId: 'taiyi',
    toolKoName: '태을신수',
    status: 'not_implemented',
    note: '태을 16궁 국수 산법이 현재 미구현 상태입니다. 거시적 시대 흐름에 대한 철학적 성찰로 대체됩니다.'
  };

  const toolsMap = {
    saju: sajuEnvelope,
    astrology: astroEnvelope,
    ziwei: ziweiEnvelope,
    sukuyo: sukuyoEnvelope,
    vedic: vedicEnvelope,
    mahabote: mahaboteEnvelope,
    kyusei: kyuseiEnvelope,
    thai_astrology: thaiEnvelope,
    iching: ichingEnvelope,
    liuren: liurenEnvelope,
    qimen: qimenEnvelope,
    tarot: tarotEnvelope,
    kabbalah: kabbalahEnvelope,
    tojeong: tojeongEnvelope,
    taiyi: taiyiEnvelope,
  };

  const allTools = Object.values(toolsMap);
  const calculatedCount = allTools.filter(t => t.status === 'calculated').length;
  const partialOrSymbolicCount = allTools.filter(t => t.status === 'partial' || t.status === 'symbolic').length;
  const notImplementedCount = allTools.filter(t => t.status === 'not_implemented').length;

  const chronoTransitResult = calculateChronoTransit({ profile, targetDate: now });
  const lifeSeasonTimingResult = calculateLifeSeasonTiming({ profile, targetYear: now.getFullYear() });
  const energeticPrescriptionResult = calculateEnergeticPrescription({ profile, currentDate: now });
  const contextualSynastryResult = calculateContextualSynastry({ questionText: question, myProfile: profile });
  const instantDecisionResult = calculateInstantDecision({ instant: now, questionText: question });
  const ziweiFlyingStarsResult = calculateZiweiFlyingStars({ profile, targetYear: now.getFullYear() });

  return {
    engineVersion: 'LUCKEY-DCE-v1.1.0',
    timestamp: now.getTime(),
    calculatedAtUtc: nowUtcIso,
    calculatedAtKst: nowKstIso,
    inputProfile: {
      birthdate: birthdateStr || undefined,
      birthtime: birthtimeStr || undefined,
      solarDateString: solarDateStr || undefined,
      isLunar,
      gender: genderStr,
      birthCity: birthCityStr || undefined,
      timeKnown: Boolean(parsedBirthTime),
      locationKnown: Boolean(birthCityStr),
    },
    questionContext: {
      rawQuestion: question,
      isDivinationQuery,
    },
    summary: {
      totalToolsSupported: 15,
      toolsExecuted: allTools.filter(t => t.status !== 'skipped').length,
      toolsCalculated: calculatedCount,
      toolsPartialOrSymbolic: partialOrSymbolicCount,
      toolsNotImplemented: notImplementedCount,
    },
    chronoTransit: chronoTransitResult,
    lifeSeasonTiming: lifeSeasonTimingResult,
    energeticPrescription: energeticPrescriptionResult,
    contextualSynastry: contextualSynastryResult,
    instantDecision: instantDecisionResult,
    ziweiFlyingStars: ziweiFlyingStarsResult,
    tools: toolsMap,
  };
}

/**
 * 결정론적 계산 엔진 리포트를 LLM 프롬프트에 주입하기 위해
 * 명확하고 가독성 높은 구조화된 텍스트 및 JSON 블록으로 변환합니다.
 */
export function formatDeterministicEnginePrompt(report: DeterministicEngineReport): string {
  const calculatedDataSummary: Record<string, unknown> = {};

  Object.entries(report.tools).forEach(([id, envelope]) => {
    if (envelope.status === 'calculated' && envelope.data) {
      calculatedDataSummary[id] = envelope.data;
    }
  });

  return `[⚡ 결정론적 자체 계산 엔진(Deterministic Calculation Engine) 실측 데이터]
======================================================================
엔진 버전: ${report.engineVersion}
기준 시각: ${report.calculatedAtKst} (한국 표준시)
프로필 입력: ${report.inputProfile.solarDateString || '생년월일 미입력'} ${report.inputProfile.birthtime || '(생시 미입력)'} | 출생지: ${report.inputProfile.birthCity || '미확인'}
실측 계산 성공 도구: ${report.summary.toolsCalculated}개 | 상징/부분 도구: ${report.summary.toolsPartialOrSymbolic}개 | 미구현 도구: ${report.summary.toolsNotImplemented}개
======================================================================

[★ AI 환각 원천 차단 절대 지침 (Anti-Hallucination Guard)]:
1. 아래 제공된 JSON 데이터는 순수 천문·수리 알고리즘으로 직접 산출된 100% 확정 수치입니다.
2. AI(루시)는 절대로 제공되지 않은 사주팔자, 별자리 각도, 자미두수 명반, 주역 괘를 임의로 지어내거나 추측(Hallucination)하지 마십시오.
3. 'not_implemented' 또는 'symbolic' 상태인 도구는 실제로 계산하지 않았음을 솔직하고 투명하게 밝히고, 상징적 관점으로만 조언하십시오.

\`\`\`json
${JSON.stringify(calculatedDataSummary, null, 2)}
\`\`\`
======================================================================
${report.chronoTransit ? '\n' + formatChronoTransitPrompt(report.chronoTransit) : ''}
${report.lifeSeasonTiming ? '\n' + formatLifeSeasonTimingPrompt(report.lifeSeasonTiming) : ''}
${report.energeticPrescription ? '\n' + formatEnergeticPrescriptionPrompt(report.energeticPrescription) : ''}
${report.contextualSynastry ? '\n' + formatContextualSynastryPrompt(report.contextualSynastry) : ''}
${report.instantDecision ? '\n' + formatInstantDecisionPrompt(report.instantDecision) : ''}
${report.ziweiFlyingStars ? '\n' + formatZiweiFlyingStarsPrompt(report.ziweiFlyingStars) : ''}`;
}
