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
 * 4. 미구현/상징적 도구(타로 등)는 명확히 상태를 분리 표기하여
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
import { calculateChronoTransit, formatChronoTransitPrompt, type ChronoTransitResult } from './chronoTransitEngine';
import { calculateLifeSeasonTiming, formatLifeSeasonTimingPrompt, type LifeSeasonTimingResult } from './lifeSeasonTimingEngine';
import { calculateEnergeticPrescription, formatEnergeticPrescriptionPrompt, type EnergeticPrescriptionResult } from './energeticPrescriptionEngine';
import { calculateContextualSynastry, formatContextualSynastryPrompt, type ContextualSynastryResult } from './contextualSynastryEngine';
import { calculateInstantDecision, formatInstantDecisionPrompt, type InstantDecisionResult } from './instantDecisionEngine';
import { calculateZiweiFlyingStars, formatZiweiFlyingStarsPrompt, type ZiweiFlyingStarsResult } from './ziweiFlyingStarsEngine';
import { calculateSpecialStarsMatrix, formatSpecialStarsPrompt, type SpecialStarsResult } from './specialStarsEngine';
import { calculateMonthlyFlow, formatMonthlyFlowPrompt, type MonthlyFlowResult } from './monthlyFlowEngine';
import { calculateSpatialFengshui, formatSpatialFengshuiPrompt, type SpatialFengshuiResult } from './spatialFengshuiEngine';
import { calculateVitalityCurve, formatVitalityCurvePrompt, type VitalityCurveResult } from './vitalityCurveEngine';
import { calculateTojeong, formatTojeongPrompt, type TojeongResult } from './tojeongEngine';
import { calculateKyusei, formatKyuseiPrompt, type KyuseiResult } from './kyuseiEngine';
import { calculateSamjaeGyoUn, formatSamjaeGyoUnPrompt, type SamjaeGyoUnResult } from './samjaeGyoUnEngine';
import { calculateAuspiciousStars, formatAuspiciousStarsPrompt, type AuspiciousStarsResult } from './auspiciousStarsEngine';
import { calculateTaiyi, formatTaiyiPrompt, type TaiyiResult, TAIYI_ENGINE_VERSION, TAIYI_METHOD } from './taiyiEngine';
import { calculateGeokguk, formatGeokgukPrompt, type GeokgukResult } from './geokgukEngine';
import { calculateTwentyEightMansions, formatTwentyEightMansionsPrompt, type TwentyEightMansionsResult } from './twentyEightMansionsEngine';
import { calculateMahabote, formatMahabotePrompt, type MahaboteResult, MAHABOTE_ENGINE_VERSION, MAHABOTE_METHOD } from './mahaboteEngine';
import { calculateSukuyoAdvanced, formatSukuyoPrompt, type SukuyoResult } from './sukuyoEngine';
import { calculateVedicAdvanced, formatVedicPrompt, type VedicResult } from './vedicEngine';
import { calculateKabbalah, formatKabbalahPrompt, type KabbalahResult, KABBALAH_ENGINE_VERSION, KABBALAH_METHOD } from './kabbalahEngine';
import { calculateThaiHorasat, formatThaiHorasatPrompt, type ThaiHorasatResult, THAI_HORASAT_METHOD } from './thaiHorasatEngine';
import { calculateHonggukQimen, formatHonggukQimenPrompt, type HonggukQimenResult, HONGGUK_QIMEN_ENGINE_VERSION, HONGGUK_QIMEN_METHOD } from './honggukQimenEngine';
import { calculateDeterministicCompatibility, formatCompatibilityPrompt, type CompatibilityAnalysisResult } from './deterministicCompatibility';
import { calculateLiurenMaster, formatLiurenMasterPrompt, type LiurenMasterResult, LIUREN_MASTER_ENGINE_VERSION, LIUREN_MASTER_METHOD } from './liurenMasterEngine';
import { calculateIchingMaster, formatIchingMasterPrompt, type IchingMasterResult, ICHING_MASTER_ENGINE_VERSION, ICHING_MASTER_METHOD } from './ichingMasterEngine';
import { calculateTarotMaster, formatTarotMasterPrompt, type TarotMasterResult, TAROT_MASTER_ENGINE_VERSION, TAROT_MASTER_METHOD } from './tarotMasterEngine';
import { calculateHeLuoLiShu, formatHeLuoLiShuPrompt, type HeLuoLiShuResult, HELUOLISHU_ENGINE_VERSION, HELUOLISHU_METHOD } from './heLuoLiShuEngine';
import { calculateDynamicClashTrigger, formatDynamicClashPrompt, type DynamicClashResult } from './dynamicClashTriggerEngine';
import { calculateTwelveSpiritsCycle, formatTwelveSpiritsPrompt, type TwelveSpiritsResult } from './twelveSpiritsCycleEngine';
import { calculatePythagoreanLifecycle, formatPythagoreanLifecyclePrompt, type PythagoreanLifecycleResult } from './pythagoreanLifecycleEngine';
import { calculateAstrologicalDecanSabian, formatAstrologicalDecanSabianPrompt, type AstrologicalDecanSabianResult } from './astrologicalDecanSabianEngine';
import { calculateMedicalBioMatrix, formatMedicalBioMatrixPrompt, type MedicalBioMatrixResult } from './medicalBioMatrixEngine';
import { calculateWealthPipeline, formatWealthPipelinePrompt, type WealthPipelineResult } from './wealthPipelineEngine';
import { calculateKarmicNodes, formatKarmicNodesPrompt, type KarmicNodesResult } from './karmicNodesEngine';
import { calculateMentalResilience, formatMentalResiliencePrompt, type MentalResilienceResult } from './mentalResilienceEngine';
import { calculateNobleNetwork, formatNobleNetworkPrompt, type NobleNetworkResult } from './nobleNetworkEngine';
import { calculateVoicePersona, formatVoicePersonaPrompt, type VoicePersonaResult } from './voicePersonaEngine';
import { calculateContractShield, formatContractShieldPrompt, type ContractShieldResult } from './contractShieldEngine';
import { calculateLifeDomainWheel, formatLifeDomainWheelPrompt, type LifeDomainWheelResult } from './lifeDomainWheelEngine';
import { calculateDeepWorkFlow, formatDeepWorkFlowPrompt, type DeepWorkFlowResult } from './deepWorkFlowEngine';
import { calculateSleepSubconscious, formatSleepSubconsciousPrompt, type SleepSubconsciousResult } from './sleepSubconsciousEngine';
import { calculateQuantumLeapTiming, formatQuantumLeapPrompt, type QuantumLeapResult } from './quantumLeapTimingEngine';

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
  specialStarsMatrix?: SpecialStarsResult | null;
  monthlyFlow?: MonthlyFlowResult | null;
  spatialFengshui?: SpatialFengshuiResult | null;
  vitalityCurve?: VitalityCurveResult | null;
  tojeongResult?: TojeongResult | null;
  kyuseiResult?: KyuseiResult | null;
  samjaeGyoUnResult?: SamjaeGyoUnResult | null;
  auspiciousStarsResult?: AuspiciousStarsResult | null;
  taiyiResult?: TaiyiResult | null;
  geokgukResult?: GeokgukResult | null;
  twentyEightMansionsResult?: TwentyEightMansionsResult | null;
  mahaboteResult?: MahaboteResult | null;
  sukuyoAdvancedResult?: SukuyoResult | null;
  vedicAdvancedResult?: VedicResult | null;
  kabbalahResult?: KabbalahResult | null;
  thaiHorasatResult?: ThaiHorasatResult | null;
  honggukQimenResult?: HonggukQimenResult | null;
  compatibilityResult?: CompatibilityAnalysisResult | null;
  liurenMasterResult?: LiurenMasterResult | null;
  ichingMasterResult?: IchingMasterResult | null;
  tarotMasterResult?: TarotMasterResult | null;
  heLuoLiShuResult?: HeLuoLiShuResult | null;
  dynamicClashResult?: DynamicClashResult | null;
  twelveSpiritsResult?: TwelveSpiritsResult | null;
  pythagoreanLifecycleResult?: PythagoreanLifecycleResult | null;
  astrologicalDecanSabianResult?: AstrologicalDecanSabianResult | null;
  medicalBioMatrixResult?: MedicalBioMatrixResult | null;
  wealthPipelineResult?: WealthPipelineResult | null;
  karmicNodesResult?: KarmicNodesResult | null;
  mentalResilienceResult?: MentalResilienceResult | null;
  nobleNetworkResult?: NobleNetworkResult | null;
  voicePersonaResult?: VoicePersonaResult | null;
  contractShieldResult?: ContractShieldResult | null;
  lifeDomainWheelResult?: LifeDomainWheelResult | null;
  deepWorkFlowResult?: DeepWorkFlowResult | null;
  sleepSubconsciousResult?: SleepSubconsciousResult | null;
  quantumLeapResult?: QuantumLeapResult | null;
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

/**
 * 사용자 프로필과 질문 맥락을 입력받아 순수 수학·천문·역법 수리 엔진을 일괄 실행하고
 * 표준화된 결정론적 계산 리포트(JSON)를 반환합니다.
 */
export function runDeterministicEngine(params: {
  profile?: UserProfile | null;
  partnerProfile?: UserProfile | null;
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
      const sukuyoAdvanced = calculateSukuyoAdvanced({ profile });
      sukuyoEnvelope = {
        toolId: 'sukuyo',
        toolKoName: '숙요경',
        status: 'calculated',
        method: sukuyoRes.method,
        data: { ...sukuyoRes, advanced: sukuyoAdvanced }
      };
    }
  } catch (err: any) {
    sukuyoEnvelope = { toolId: 'sukuyo', toolKoName: '숙요경', status: 'error', note: err?.message || '숙요 계산 보류' };
  }

  // 5. 베딕 점성술 (Vedic Jyotish, J2000 Lahiri 항성황도 & 빔쇼타리 다샤)
  // 정통 27 나크샤트라 & 120년 빔쇼타리 다샤 확장 수리 (생시 없으면 정오 기준 null-safe)
  const vedicAdvancedResult = (() => {
    try {
      return calculateVedicAdvanced({ profile });
    } catch (_) {
      return null;
    }
  })();
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
        data: { ...vedicRes, advanced: vedicAdvancedResult },
        limitations: [...vedicRes.limitations, '나크샤트라·다샤 확장 수리는 vedicAdvancedResult(vedicEngine)가 별도 산출합니다.'],
      };
    }
  } catch (err: any) {
    vedicEnvelope = { toolId: 'vedic', toolKoName: '베딕 점성술', status: 'partial', note: err?.message || '베딕 정밀 계산 요건 미충족' };
  }

  // 6. 마하보테 (미얀마 7궁 명반 및 8요일 성좌 엔진)
  let mahaboteEnvelope: ToolCalculationEnvelope<MahaboteResult>;
  let mahaboteResult: MahaboteResult | null = null;
  try {
    mahaboteResult = calculateMahabote({ profile, targetYear: now.getFullYear() });
    if (mahaboteResult.status === 'calculated') {
      mahaboteEnvelope = {
        toolId: 'mahabote',
        toolKoName: '마하보테',
        status: 'calculated',
        method: MAHABOTE_METHOD,
        data: mahaboteResult,
      };
    } else {
      mahaboteEnvelope = {
        toolId: 'mahabote',
        toolKoName: '마하보테',
        status: 'skipped',
        note: mahaboteResult.note || '생년월일 미입력',
      };
    }
  } catch (err: any) {
    mahaboteEnvelope = {
      toolId: 'mahabote',
      toolKoName: '마하보테',
      status: 'error',
      note: err?.message || '마하보테 7궁 명반 산출 실패',
    };
  }

  // 7. 구성학 (九星氣學 - 입춘 본명성·월명성·일성과 9궁 연·월·일반 포국, 길흉방위)
  let kyuseiEnvelope: ToolCalculationEnvelope<unknown>;
  try {
    if (!profile || !birthdateStr) {
      kyuseiEnvelope = { toolId: 'kyusei', toolKoName: '구성학', status: 'skipped', note: '생년월일 미입력' };
    } else {
      const kyuseiRes = calculateKyusei({ profile, targetDate: now });
      if (kyuseiRes.status === 'calculated') {
        kyuseiEnvelope = {
          toolId: 'kyusei',
          toolKoName: '구성학',
          status: 'calculated',
          method: kyuseiRes.method,
          data: kyuseiRes
        };
      } else {
        kyuseiEnvelope = { toolId: 'kyusei', toolKoName: '구성학', status: kyuseiRes.status, note: kyuseiRes.note || '생년월일 미입력' };
      }
    }
  } catch (err: any) {
    kyuseiEnvelope = { toolId: 'kyusei', toolKoName: '구성학', status: 'error', note: err?.message || '구성학 9궁 포국 실패' };
  }

  // 8. 태국 점성술 (정통 호라삿 8요일 · 마하탁사 대운 · 4원소 신체 활력 엔진)
  let thaiEnvelope: ToolCalculationEnvelope<ThaiHorasatResult>;
  let thaiHorasatResult: ThaiHorasatResult | null = null;
  try {
    thaiHorasatResult = calculateThaiHorasat({ profile, targetYear: now.getFullYear(), targetDate: now });
    if (thaiHorasatResult.status === 'calculated') {
      thaiEnvelope = {
        toolId: 'thai_astrology',
        toolKoName: '태국점성술',
        status: 'calculated',
        method: THAI_HORASAT_METHOD,
        data: thaiHorasatResult,
      };
    } else {
      thaiEnvelope = {
        toolId: 'thai_astrology',
        toolKoName: '태국점성술',
        status: 'skipped',
        method: THAI_HORASAT_METHOD,
        note: thaiHorasatResult.note || '생년월일 미입력으로 호라삿 계산 생략',
      };
    }
  } catch (err: any) {
    thaiEnvelope = {
      toolId: 'thai_astrology',
      toolKoName: '태국점성술',
      status: 'error',
      note: err?.message || '호라삿 8요일 계산 실패',
    };
  }

  // 9. 주역 (周易) - 64괘 384효 4대 대칭 괘상 및 체용 결단 마스터 엔진
  let ichingEnvelope: ToolCalculationEnvelope<unknown>;
  let ichingMasterResult: IchingMasterResult | null = null;
  try {
    ichingMasterResult = calculateIchingMaster(now);
    ichingEnvelope = {
      toolId: 'iching',
      toolKoName: '주역',
      status: 'calculated',
      method: ichingMasterResult.method,
      data: ichingMasterResult
    };
  } catch (err: any) {
    ichingEnvelope = { toolId: 'iching', toolKoName: '주역', status: 'error', note: err?.message || '주역 작괘 실패' };
  }

  // 10. 대육임 (大六壬) - 점시 기준 사과·삼전·12천장 결단 마스터 엔진
  let liurenEnvelope: ToolCalculationEnvelope<unknown>;
  let liurenMasterResult: LiurenMasterResult | null = null;
  try {
    liurenMasterResult = calculateLiurenMaster(now);
    liurenEnvelope = {
      toolId: 'liuren',
      toolKoName: '육임',
      status: 'calculated',
      method: liurenMasterResult.method,
      data: liurenMasterResult,
    };
  } catch (err: any) {
    liurenEnvelope = { toolId: 'liuren', toolKoName: '육임', status: 'error', note: err?.message || '육임 포국 실패' };
  }

  // 11. 기문둔갑 (奇門遁甲) - 조선 정통 홍국기문 4주 9궁 수리 포국 엔진 + 차보법(拆補) 점시 포국
  //     생년월일이 있으면 홍국기문 수리 포국(세효·응효·중궁·삼형·통기·팔문)이 계산되어 바인딩되고,
  //     점시 기반 차보법 포국은 전략/결단 질문일 때 보조로 병행된다.
  let qimenEnvelope: ToolCalculationEnvelope<unknown>;
  let honggukQimenResult: HonggukQimenResult | null = null;
  try {
    honggukQimenResult = calculateHonggukQimen({ profile, targetYear: now.getFullYear() });
  } catch (err: any) {
    honggukQimenResult = {
      status: 'error',
      engineVersion: HONGGUK_QIMEN_ENGINE_VERSION,
      method: HONGGUK_QIMEN_METHOD,
      note: err?.message || '홍국기문 9궁 수리 포국 실패',
    };
  }
  const honggukCalculated = honggukQimenResult.status === 'calculated';
  try {
    if (isDivinationQuery) {
      const qimenRes = calculateQimen(now);
      const data: Record<string, unknown> = {};
      if (honggukCalculated) data.honggukQimen = honggukQimenResult;
      data.chabopPointChart = qimenRes;
      qimenEnvelope = {
        toolId: 'qimen',
        toolKoName: '홍국기문/기문둔갑',
        status: 'calculated',
        method: honggukCalculated ? HONGGUK_QIMEN_METHOD : qimenRes.method,
        data,
        limitations: honggukCalculated ? undefined : qimenRes.limitations
      };
    } else {
      qimenEnvelope = {
        toolId: 'qimen',
        toolKoName: '홍국기문/기문둔갑',
        status: honggukCalculated ? 'calculated' : 'skipped',
        method: honggukCalculated ? HONGGUK_QIMEN_METHOD : undefined,
        data: honggukCalculated ? { honggukQimen: honggukQimenResult } : undefined,
        note: honggukCalculated ? '생년월일 프로필 기반 홍국기문 4주 9궁 수리 포국' : '전략/결단 질문 시 점시 포국이 실행되고, 생년월일 등록 시 홍국기문 수리 포국이 계산됩니다.'
      };
    }
  } catch (err: any) {
    qimenEnvelope = { toolId: 'qimen', toolKoName: '홍국기문/기문둔갑', status: 'error', note: err?.message || '기문둔갑 포국 실패' };
  }

  // 12. 타로 (78장 아르카나 수비학·원소 시나스트리 및 소울·퍼스널리티·연간 성장 카드 엔진)
  let tarotEnvelope: ToolCalculationEnvelope<unknown>;
  let tarotMasterResult: TarotMasterResult | null = null;
  try {
    tarotMasterResult = calculateTarotMaster({ profile, now });
    tarotEnvelope = {
      toolId: 'tarot',
      toolKoName: '타로',
      status: 'calculated',
      method: tarotMasterResult.method,
      data: tarotMasterResult
    };
  } catch (err: any) {
    tarotEnvelope = { toolId: 'tarot', toolKoName: '타로', status: 'error', note: err?.message || '타로 계산 실패' };
  }

  // 13. 카발라 (정통 생명나무 10 세피로트 · 3대 기둥 · 4개 세계 · 22 경로 & 생년월일 게마트리아 수리)
  let kabbalahEnvelope: ToolCalculationEnvelope<KabbalahResult>;
  let kabbalahResult: KabbalahResult | null = null;
  try {
    kabbalahResult = calculateKabbalah({ profile });
    if (kabbalahResult.status === 'calculated') {
      kabbalahEnvelope = {
        toolId: 'kabbalah',
        toolKoName: '카발라',
        status: 'calculated',
        method: KABBALAH_METHOD,
        data: kabbalahResult,
      };
    } else {
      kabbalahEnvelope = {
        toolId: 'kabbalah',
        toolKoName: '카발라',
        status: 'skipped',
        method: KABBALAH_METHOD,
        note: kabbalahResult.note || '생년월일 미입력으로 게마트리아 계산 생략',
      };
    }
  } catch (err: any) {
    kabbalahEnvelope = {
      toolId: 'kabbalah',
      toolKoName: '카발라',
      status: 'error',
      note: err?.message || '카발라 생명나무 계산 실패',
    };
  }

  // 14. 토정비결 (조선 정통 이지함 144괘문 수리 산법)
  let tojeongEnvelope: ToolCalculationEnvelope<unknown>;
  try {
    if (!profile || !birthdateStr) {
      tojeongEnvelope = { toolId: 'tojeong', toolKoName: '토정비결', status: 'skipped', note: '생년월일 미입력으로 계산 생략' };
    } else {
      const tojeongRes = calculateTojeong({ profile, targetYear: now.getFullYear() });
      if (tojeongRes.status === 'calculated') {
        tojeongEnvelope = {
          toolId: 'tojeong',
          toolKoName: '토정비결',
          status: 'calculated',
          method: tojeongRes.method,
          data: tojeongRes
        };
      } else {
        tojeongEnvelope = { toolId: 'tojeong', toolKoName: '토정비결', status: 'skipped', note: tojeongRes.note || '생년월일 미입력' };
      }
    }
  } catch (err: any) {
    tojeongEnvelope = { toolId: 'tojeong', toolKoName: '토정비결', status: 'error', note: err?.message || '토정비결 작괘 실패' };
  }

  // 15. 태을신수 (태을 16궁 연국 적년 수리 산법 엔진)
  let taiyiEnvelope: ToolCalculationEnvelope<TaiyiResult>;
  let taiyiResult: TaiyiResult | null = null;
  try {
    taiyiResult = calculateTaiyi({ profile, targetYear: now.getFullYear(), targetDate: now });
    if (taiyiResult.status === 'calculated') {
      taiyiEnvelope = {
        toolId: 'taiyi',
        toolKoName: '태을신수',
        status: 'calculated',
        method: TAIYI_METHOD,
        data: taiyiResult,
      };
    } else {
      taiyiEnvelope = {
        toolId: 'taiyi',
        toolKoName: '태을신수',
        status: 'skipped',
        note: taiyiResult.note || '생년월일 미입력',
      };
    }
  } catch (err: any) {
    taiyiEnvelope = {
      toolId: 'taiyi',
      toolKoName: '태을신수',
      status: 'error',
      note: err?.message || '태을신수 16궁 계산 실패',
    };
  }

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
    kabbalah: kabbalahEnvelope as ToolCalculationEnvelope<unknown>,
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
  const specialStarsResult = calculateSpecialStarsMatrix({ profile });
  const monthlyFlowResult = calculateMonthlyFlow({ profile, targetYear: now.getFullYear() });
  const spatialFengshuiResult = calculateSpatialFengshui({ profile });
  const vitalityCurveResult = calculateVitalityCurve({ profile });
  const tojeongResult = birthdateStr && profile
    ? (() => {
        try {
          const res = calculateTojeong({ profile, targetYear: now.getFullYear() });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null;
  const kyuseiResult = birthdateStr && profile
    ? (() => {
        try {
          const res = calculateKyusei({ profile, targetDate: now });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null;
  const samjaeGyoUnResult = birthdateStr && profile
    ? (() => {
        try {
          const res = calculateSamjaeGyoUn({ profile, targetYear: now.getFullYear() });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null;
  const auspiciousStarsResult = birthdateStr && profile
    ? (() => {
        try {
          const res = calculateAuspiciousStars({ profile, targetYear: now.getFullYear() });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null;
  // 16. 정통 격국 성격·파격 수리 판정 엔진 (자평진전 월령 사령·투간 수리)
  const geokgukResult = birthdateStr && profile
    ? (() => {
        try {
          const res = calculateGeokguk({ profile });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null;
  // 17. 천상열차분야지도 28수 일진·택일 엔진 (생년월일 무관 당일 일진 기준)
  const twentyEightMansionsResult = (() => {
    try {
      return calculateTwentyEightMansions({ targetDate: now });
    } catch (_) {
      return null;
    }
  })();
  // 18. 정통 밀교 숙요경 27숙 본명숙 & 6대 관계성 3거리 매트릭스 엔진
  const sukuyoAdvancedResult = (() => {
    try {
      return calculateSukuyoAdvanced({ profile });
    } catch (_) {
      return null;
    }
  })();

  // 19. 5대 운명학 융합 궁합 마스터 엔진 (상대 프로필이 있을 때만 결정론 계산)
  const compatibilityResult = params.partnerProfile && profile && birthdateStr
    ? (() => {
        try {
          return calculateDeterministicCompatibility(profile, params.partnerProfile);
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 19. 하락이수(河洛理數) 사주·주역 융합 선천괘·후천괘·원당효 엔진
  const heLuoLiShuResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateHeLuoLiShu({ profile });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 20. 실시간 삼형·육충·파해 동적 트리거 엔진
  const dynamicClashResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateDynamicClashTrigger({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 21. 사주 12신살(겁재천지년월망장반역육화) 완전 순환 엔진
  const twelveSpiritsResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateTwelveSpiritsCycle({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 22. 피타고라스 4대 피너클 & 챌린지 생애 주기 엔진
  const pythagoreanLifecycleResult = birthdateStr && profile
    ? (() => {
        try {
          return calculatePythagoreanLifecycle({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 23. 점성술 36 데칸 & 사비안 심볼 360° 엔진
  const astrologicalDecanSabianResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateAstrologicalDecanSabian({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 24. 오행 한난조습 & 메디컬 점성술 바이오 매트릭스 엔진
  const medicalBioMatrixResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateMedicalBioMatrix({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 25. 재물·비즈니스 포춘 파이프라인 엔진
  const wealthPipelineResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateWealthPipeline({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 26. 카르믹 노드 & 영혼 진화 궤적 엔진
  const karmicNodesResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateKarmicNodes({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 27. 위기 돌파 & 멘탈 리질리언스 지수 엔진
  const mentalResilienceResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateMentalResilience({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 28. 4대 귀인 & 인연 네트워크 시너지 엔진
  const nobleNetworkResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateNobleNetwork({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 29. 스피치 & 커뮤니케이션 페르소나 엔진
  const voicePersonaResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateVoicePersona({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 30. 계약·분쟁 방어 & 관재구설 쉴드 엔진
  const contractShieldResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateContractShield({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 31. 라이프 12궁 밸런스 휠 엔진
  const lifeDomainWheelResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateLifeDomainWheel({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 32. 창작 아우라 & 딥워크 몰입 엔진
  const deepWorkFlowResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateDeepWorkFlow({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 33. 수면 뇌파 & 무의식 직관 디코딩 엔진
  const sleepSubconsciousResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateSleepSubconscious({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

  // 34. 퀀텀 점프 & 승부수 모멘텀 타이밍 엔진
  const quantumLeapResult = birthdateStr && profile
    ? (() => {
        try {
          return calculateQuantumLeapTiming({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null;

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
    specialStarsMatrix: specialStarsResult,
    monthlyFlow: monthlyFlowResult,
    spatialFengshui: spatialFengshuiResult,
    vitalityCurve: vitalityCurveResult,
    tojeongResult,
    kyuseiResult,
    samjaeGyoUnResult,
    auspiciousStarsResult,
    taiyiResult,
    geokgukResult,
    twentyEightMansionsResult,
    mahaboteResult,
    sukuyoAdvancedResult,
    vedicAdvancedResult,
    kabbalahResult,
    thaiHorasatResult,
    honggukQimenResult,
    compatibilityResult,
    liurenMasterResult,
    ichingMasterResult,
    tarotMasterResult,
    heLuoLiShuResult,
    dynamicClashResult,
    twelveSpiritsResult,
    pythagoreanLifecycleResult,
    astrologicalDecanSabianResult,
    medicalBioMatrixResult,
    wealthPipelineResult,
    karmicNodesResult,
    mentalResilienceResult,
    nobleNetworkResult,
    voicePersonaResult,
    contractShieldResult,
    lifeDomainWheelResult,
    deepWorkFlowResult,
    sleepSubconsciousResult,
    quantumLeapResult,
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
${report.ziweiFlyingStars ? '\n' + formatZiweiFlyingStarsPrompt(report.ziweiFlyingStars) : ''}
${report.specialStarsMatrix ? '\n' + formatSpecialStarsPrompt(report.specialStarsMatrix) : ''}
${report.monthlyFlow ? '\n' + formatMonthlyFlowPrompt(report.monthlyFlow) : ''}
${report.spatialFengshui ? '\n' + formatSpatialFengshuiPrompt(report.spatialFengshui) : ''}
${report.vitalityCurve ? '\n' + formatVitalityCurvePrompt(report.vitalityCurve) : ''}
${report.tojeongResult ? '\n' + formatTojeongPrompt(report.tojeongResult) : ''}
${report.kyuseiResult ? '\n' + formatKyuseiPrompt(report.kyuseiResult) : ''}
${report.samjaeGyoUnResult ? '\n' + formatSamjaeGyoUnPrompt(report.samjaeGyoUnResult) : ''}
${report.auspiciousStarsResult ? '\n' + formatAuspiciousStarsPrompt(report.auspiciousStarsResult) : ''}
${report.taiyiResult ? '\n' + formatTaiyiPrompt(report.taiyiResult) : ''}
${report.geokgukResult ? '\n' + formatGeokgukPrompt(report.geokgukResult) : ''}
${report.twentyEightMansionsResult ? '\n' + formatTwentyEightMansionsPrompt(report.twentyEightMansionsResult) : ''}
${report.mahaboteResult ? '\n' + formatMahabotePrompt(report.mahaboteResult) : ''}
${report.sukuyoAdvancedResult ? '\n' + formatSukuyoPrompt(report.sukuyoAdvancedResult) : ''}
${report.vedicAdvancedResult ? '\n' + formatVedicPrompt(report.vedicAdvancedResult) : ''}
${report.kabbalahResult ? '\n' + formatKabbalahPrompt(report.kabbalahResult) : ''}
${report.thaiHorasatResult ? '\n' + formatThaiHorasatPrompt(report.thaiHorasatResult) : ''}
${report.honggukQimenResult ? '\n' + formatHonggukQimenPrompt(report.honggukQimenResult) : ''}
${report.compatibilityResult ? '\n' + formatCompatibilityPrompt(report.compatibilityResult) : ''}
${report.liurenMasterResult ? '\n' + formatLiurenMasterPrompt(report.liurenMasterResult) : ''}
${report.ichingMasterResult ? '\n' + formatIchingMasterPrompt(report.ichingMasterResult) : ''}
${report.tarotMasterResult ? '\n' + formatTarotMasterPrompt(report.tarotMasterResult) : ''}
${report.heLuoLiShuResult ? '\n' + formatHeLuoLiShuPrompt(report.heLuoLiShuResult) : ''}
${report.dynamicClashResult ? '\n' + formatDynamicClashPrompt(report.dynamicClashResult) : ''}
${report.twelveSpiritsResult ? '\n' + formatTwelveSpiritsPrompt(report.twelveSpiritsResult) : ''}
${report.pythagoreanLifecycleResult ? '\n' + formatPythagoreanLifecyclePrompt(report.pythagoreanLifecycleResult) : ''}
${report.astrologicalDecanSabianResult ? '\n' + formatAstrologicalDecanSabianPrompt(report.astrologicalDecanSabianResult) : ''}
${report.medicalBioMatrixResult ? '\n' + formatMedicalBioMatrixPrompt(report.medicalBioMatrixResult) : ''}
${report.wealthPipelineResult ? '\n' + formatWealthPipelinePrompt(report.wealthPipelineResult) : ''}
${report.karmicNodesResult ? '\n' + formatKarmicNodesPrompt(report.karmicNodesResult) : ''}
${report.mentalResilienceResult ? '\n' + formatMentalResiliencePrompt(report.mentalResilienceResult) : ''}
${report.nobleNetworkResult ? '\n' + formatNobleNetworkPrompt(report.nobleNetworkResult) : ''}
${report.voicePersonaResult ? '\n' + formatVoicePersonaPrompt(report.voicePersonaResult) : ''}
${report.contractShieldResult ? '\n' + formatContractShieldPrompt(report.contractShieldResult) : ''}
${report.lifeDomainWheelResult ? '\n' + formatLifeDomainWheelPrompt(report.lifeDomainWheelResult) : ''}
${report.deepWorkFlowResult ? '\n' + formatDeepWorkFlowPrompt(report.deepWorkFlowResult) : ''}
${report.sleepSubconsciousResult ? '\n' + formatSleepSubconsciousPrompt(report.sleepSubconsciousResult) : ''}
${report.quantumLeapResult ? '\n' + formatQuantumLeapPrompt(report.quantumLeapResult) : ''}`;
}
