import { getSymbolicPerspective } from './symbolicPerspective';
import { MASTER_REVIEW_BINDINGS } from './masterReviewBindings';
import type { CalculationAuditItem } from './calculationAudit';
/**
 * =========================================================================
 * LUCKEY 결정론적 자체 계산 엔진 (Deterministic Calculation Engine)
 * =========================================================================
 * 
 * [설계 철학 & 핵심 원칙]
 * 1. 구현된 천문·역법·전통 규칙 계산과 상징적 콘텐츠를 구분한다.
 * 2. 결정론은 동일 입력의 재현성을 뜻하며 정확성·예측력의 검증을 뜻하지 않는다.
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
import { calculateElementalResonance, formatElementalResonancePrompt, type ElementalResonanceResult } from './elementalResonanceEngine';
import { calculateYinYangPolarity, formatYinYangPolarityPrompt, type YinYangPolarityResult } from './yinYangPolarityEngine';
import { calculateRuneMatrix, formatRuneMatrixPrompt, type RuneMatrixResult } from './runeMatrixEngine';
import { calculateSoulJourneyTarot, formatSoulJourneyTarotPrompt, type SoulJourneyTarotResult } from './soulJourneyTarotEngine';
import { calculateTranscendentalMeditation, formatTranscendentalMeditationPrompt, type TranscendentalMeditationResult } from './transcendentalMeditationEngine';
import { calculateStrategicLeverage, formatStrategicLeveragePrompt, type StrategicLeverageResult } from './strategicLeverageEngine';
import { calculateShadowArchetype, formatShadowArchetypePrompt, type ShadowArchetypeResult } from './shadowArchetypeEngine';
import { calculateBiorhythmPeakFlow, formatBiorhythmPeakFlowPrompt, type BiorhythmPeakFlowResult } from './biorhythmPeakFlowEngine';
import { calculateDestinySynastryEcho, formatDestinySynastryEchoPrompt, type DestinySynastryEchoResult } from './destinySynastryEchoEngine';
import { calculateMicroHabitKarma, formatMicroHabitKarmaPrompt, type MicroHabitKarmaResult } from './microHabitKarmaEngine';
import { calculateIkigaiDestinyCompass, formatIkigaiDestinyCompassPrompt, type IkigaiDestinyCompassResult } from './ikigaiDestinyCompassEngine';
import { calculateSerendipitySynchronicity, formatSerendipitySynchronicityPrompt, type SerendipitySynchronicityResult } from './serendipitySynchronicityEngine';
import { calculateHumanDesignBodyGraph, formatHumanDesignBodyGraphPrompt, type HumanDesignBodyGraphResult } from './humanDesignBodyGraphEngine';
import { calculateChakraVibrationAlignment, formatChakraVibrationAlignmentPrompt, type ChakraVibrationAlignmentResult } from './chakraVibrationAlignmentEngine';
import { calculateEnneagramSoulIntegration, formatEnneagramSoulIntegrationPrompt, type EnneagramSoulIntegrationResult } from './enneagramSoulIntegrationEngine';
import { calculateAncestralEpigeneticKarma, formatAncestralEpigeneticKarmaPrompt, type AncestralEpigeneticKarmaResult } from './ancestralEpigeneticKarmaEngine';
import { calculateShamanicAnimalTotem, formatShamanicAnimalTotemPrompt, type ShamanicAnimalTotemResult } from './shamanicAnimalTotemEngine';
import { calculateHeroMythMonomyth, formatHeroMythMonomythPrompt, type HeroMythMonomythResult } from './heroMythMonomythEngine';
import { calculateAkashicRecordsOracle, formatAkashicRecordsOraclePrompt, type AkashicRecordsOracleResult } from './akashicRecordsOracleEngine';
import { calculateQuantumProbabilisticTimeline, formatQuantumProbabilisticTimelinePrompt, type QuantumProbabilisticTimelineResult } from './quantumProbabilisticTimelineEngine';
import { calculateSomaticBodyArmoring, formatSomaticBodyArmoringPrompt, type SomaticBodyArmoringResult } from './somaticBodyArmoringEngine';
import { calculateSupremeWisdomTrinity, formatSupremeWisdomTrinityPrompt, type SupremeWisdomTrinityResult } from './supremeWisdomTrinityEngine';
import { calculateSacredVortexGeometry, formatSacredVortexGeometryPrompt, type SacredVortexGeometryResult } from './sacredVortexGeometryEngine';
import { calculateTaoistNeidanMeridian, formatTaoistNeidanMeridianPrompt, type TaoistNeidanMeridianResult } from './taoistNeidanMeridianEngine';
import { calculateSynchronicityOmen, formatSynchronicityOmenPrompt, type SynchronicityOmenResult } from './synchronicityOmenEngine';
import { calculateSolfeggioHarmonic, formatSolfeggioHarmonicPrompt, type SolfeggioHarmonicResult } from './solfeggioHarmonicResonanceEngine';
import { calculateEthericAuraBiofield, formatEthericAuraBiofieldPrompt, type EthericAuraBiofieldResult } from './ethericAuraBiofieldEngine';
import { calculateSajuClassicYongshin, formatSajuClassicYongshinPrompt, type SajuClassicYongshinResult } from './sajuClassicYongshinPrescriptionEngine';
import { calculateTarotTreeOfLifeShadow, formatTarotTreeOfLifeShadowPrompt, type TarotTreeOfLifeShadowResult } from './tarotTreeOfLifeShadowEngine';
import { calculateHellenisticLots, formatHellenisticLotsPrompt, type HellenisticLotsReport, HELLENISTIC_LOTS_ENGINE_VERSION } from './hellenisticLotsEngine';
import { calculateIching384Yao, formatIching384YaoPrompt, type Iching384YaoReport, ICHING_384YAO_ENGINE_VERSION } from './iching384YaoEngine';
import { calculateSajuTwelveStagesTomb, formatSajuTwelveStagesTombPrompt, type SajuTwelveStagesTombReport, SAJU_12STAGES_TOMB_VERSION } from './sajuTwelveStagesTombUnlockEngine';
import { calculateTarotElementalCourt, formatTarotElementalCourtPrompt, type TarotElementalCourtReport, TAROT_ELEMENTAL_COURT_VERSION } from './tarotElementalCourtPersonaEngine';
import { calculateKarmicSynastry, formatKarmicSynastryPrompt, type KarmicSynastryReport, KARMIC_SYNASTRY_VERSION } from './karmicSynastryResonanceEngine';
import { calculateFiveEmotionsPulse, formatFiveEmotionsPulsePrompt, type FiveEmotionsPulseReport, FIVE_EMOTIONS_PULSE_VERSION } from './fiveEmotionsPulseEngine';
import { calculateHermeticKybalion, formatHermeticKybalionPrompt, type HermeticKybalionReport, HERMETIC_KYBALION_VERSION } from './hermeticKybalionEngine';
import { calculateVibrationalSoulQuest, formatVibrationalSoulQuestPrompt, type SoulQuestReport, VIBRATIONAL_SOUL_QUEST_VERSION } from './vibrationalSoulQuestEngine';
import { calculateAlchemicalTransmutation, formatAlchemicalTransmutationPrompt, type AlchemicalTransmutationReport, ALCHEMICAL_TRANSMUTATION_VERSION } from './alchemicalTransmutationEngine';
import { calculateZiweiHuaJiTransformation, formatZiweiHuaJiTransformationPrompt, type ZiweiHuaJiReport, ZIWEI_HUAJI_VERSION } from './ziweiHuaJiTransformationEngine';
import { calculateCelticTreeOgham, formatCelticTreeOghamPrompt, type CelticTreeOghamReport, CELTIC_OGHAM_VERSION } from './celticTreeOghamEngine';
import { calculateTaoistSanbaoInnerAlchemy, formatTaoistSanbaoInnerAlchemyPrompt, type TaoistSanbaoReport, TAOIST_SANBAO_VERSION } from './taoistSanbaoInnerAlchemyEngine';
import { calculateTibetanBardoNavigation, formatTibetanBardoNavigationPrompt, type TibetanBardoReport, TIBETAN_BARDO_VERSION } from './tibetanBardoNavigationEngine';
import { calculateMesopotamianSevenGates, formatMesopotamianSevenGatesPrompt, type MesopotamianSevenGatesReport, MESOPOTAMIAN_GATES_VERSION } from './mesopotamianSevenGatesEngine';
import { calculateEgyptianThirtySixDecans, formatEgyptianThirtySixDecansPrompt, type EgyptianThirtySixDecansReport, EGYPTIAN_DECANS_VERSION } from './egyptianThirtySixDecansEngine';
import { calculateSufiLataifSoulAscension, formatSufiLataifSoulAscensionPrompt, type SufiLataifReport, SUFI_LATAIF_VERSION } from './sufiLataifSoulAscensionEngine';
import { calculateMayanTzolkinSacredCalendar, formatMayanTzolkinSacredCalendarPrompt, type MayanTzolkinReport, MAYAN_TZOLKIN_VERSION } from './mayanTzolkinSacredCalendarEngine';
import { calculateNordicElderFutharkRunes, formatNordicElderFutharkRunesPrompt, type NordicElderFutharkRunesReport, NORDIC_RUNES_VERSION } from './nordicElderFutharkRunesEngine';
import { calculateDelphicMaximsOracle, formatDelphicMaximsOraclePrompt, type DelphicMaximsOracleReport, DELPHIC_MAXIMS_VERSION } from './delphicMaximsOracleEngine';
import { calculateAyurvedicTridoshaPrana, formatAyurvedicTridoshaPranaPrompt, type AyurvedicTridoshaReport, AYURVEDIC_TRIDOSHA_VERSION } from './ayurvedicTridoshaPranaEngine';
import { calculateHawaiianHunaHooponopono, formatHawaiianHunaHooponoponoPrompt, type HawaiianHunaReport, HAWAIIAN_HUNA_VERSION } from './hawaiianHunaHooponoponoEngine';
import { calculateFengShuiEightMansions, formatFengShuiEightMansionsPrompt, type FengShuiEightMansionsReport, FENG_SHUI_EIGHT_MANSIONS_VERSION } from './fengShuiEightMansionsEngine';
import { calculateZoroastrianAshaTruth, formatZoroastrianAshaTruthPrompt, type ZoroastrianAshaReport, ZOROASTRIAN_ASHA_VERSION } from './zoroastrianAshaTruthEngine';
import { calculateHinduTantricKundalini, formatHinduTantricKundaliniPrompt, type HinduTantricKundaliniReport, HINDU_KUNDALINI_VERSION } from './hinduTantricKundaliniEngine';
import { calculateGuiguziLiangtouqian, formatGuiguziLiangtouqianPrompt, type GuiguziLiangtouqianReport, GUIGUZI_VERSION } from './guiguziLiangtouqianEngine';
import { calculateSlavicSvarogCircle, formatSlavicSvarogCirclePrompt, type SlavicSvarogCircleReport, SLAVIC_SVAROG_VERSION } from './slavicSvarogCircleEngine';
import { calculateEsseneCommunion, formatEsseneCommunionPrompt, type EsseneCommunionReport, ESSENE_COMMUNION_VERSION } from './esseneCommunionTreeEngine';
import { calculateHuangdiFiveMovementsSixQi, formatHuangdiFiveMovementsSixQiPrompt, type HuangdiFiveMovementsSixQiReport, HUANGDI_YUNQI_VERSION } from './huangdiFiveMovementsSixQiEngine';
import { calculatePythagoreanTetraktys, formatPythagoreanTetraktysPrompt, type PythagoreanTetraktysReport, PYTHAGOREAN_TETRAKTYS_VERSION } from './pythagoreanTetraktysGematriaEngine';
import { calculateBabylonianEnumaElish, formatBabylonianEnumaElishPrompt, type BabylonianEnumaElishReport, BABYLONIAN_ENUMA_ELISH_VERSION } from './babylonianEnumaElishEngine';
import { calculateTaoistHuangtingJing, formatTaoistHuangtingJingPrompt, type TaoistHuangtingJingReport, TAOIST_HUANGTING_VERSION } from './taoistHuangtingJingEngine';
import { calculatePersianAmeshaSpenta, formatPersianAmeshaSpentaPrompt, type PersianAmeshaSpentaReport, PERSIAN_AMESHA_SPENTA_VERSION } from './persianAmeshaSpentaEngine';
import { calculateSumerianFiftyMes, formatSumerianFiftyMesPrompt, type SumerianMeReport, SUMERIAN_FIFTY_MES_VERSION } from './sumerianFiftyMesEngine';
import { calculateZhongLuInnerAlchemy, formatZhongLuInnerAlchemyPrompt, type ZhongLuAlchemyReport, ZHONG_LU_INNER_ALCHEMY_VERSION } from './zhongLuInnerAlchemyEngine';
import { calculateDruidMoonTrees, formatDruidMoonTreesPrompt, type DruidMoonTreesReport, DRUID_MOON_TREES_VERSION } from './druidThirteenMoonTreesEngine';
import { calculateTiebanShenshu, formatTiebanShenshuPrompt, type TiebanReport, TIEBAN_SHENSHU_VERSION } from './tiebanShenshuEngine';
import { calculateTibetanBonNineWays, formatTibetanBonNineWaysPrompt, type TibetanBonReport, TIBETAN_BON_NINE_WAYS_VERSION } from './tibetanBonNineWaysEngine';
import { calculateEleusinianMysteries, formatEleusinianMysteriesPrompt, type EleusinianReport, ELEUSINIAN_MYSTERIES_VERSION } from './eleusinianMysteriesEngine';
import { calculateVedicNakshatra108Pada, formatVedicNakshatra108PadaPrompt, type VedicNakshatra108PadaReport, VEDIC_NAKSHATRA_108_PADA_ENGINE_VERSION } from './vedicNakshatra108PadaEngine';
import { calculateEgyptianHermeticCartouche, formatEgyptianHermeticCartouchePrompt, type EgyptianHermeticCartoucheReport, EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION } from './egyptianHermeticCartoucheEngine';
import { calculateTaoistGongGuoGeKarma, formatTaoistGongGuoGeKarmaPrompt, type TaoistGongGuoGeKarmaReport, TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION } from './taoistGongGuoGeKarmaEngine';
import { calculateYorubaIfaOdu, formatYorubaIfaOduPrompt, type YorubaIfaOduReport, YORUBA_IFA_ODU_ENGINE_VERSION } from './yorubaIfaOduEngine';
import { calculateArabicIlmAlRaml, formatArabicIlmAlRamlPrompt, type ArabicIlmAlRamlReport, ARABIC_ILM_AL_RAML_ENGINE_VERSION } from './arabicIlmAlRamlEngine';
import { calculateHinduNadiAgastyaPalmLeaf, formatHinduNadiAgastyaPalmLeafPrompt, type HinduNadiAgastyaPalmLeafReport, HINDU_NADI_AGASTYA_PALM_LEAF_ENGINE_VERSION } from './hinduNadiAgastyaPalmLeafEngine';
import { calculateShintoKotodama, formatShintoKotodamaPrompt, type ShintoKotodamaReport, SHINTO_KOTODAMA_FOUR_SOULS_ENGINE_VERSION } from './shintoKotodamaFourSoulsEngine';
import { calculateAboriginalDreamtimeSonglines, formatAboriginalDreamtimeSonglinesPrompt, type DreamtimeSonglineReport, ABORIGINAL_DREAMTIME_SONGLINES_ENGINE_VERSION } from './aboriginalDreamtimeSonglinesEngine';
import { calculateFinnishKalevalaSampo, formatFinnishKalevalaSampoPrompt, type FinnishKalevalaSampoReport, FINNISH_KALEVALA_SAMPO_ENGINE_VERSION } from './finnishKalevalaSampoEngine';
import { calculateShanhaijingSacredBeasts, formatShanhaijingSacredBeastsPrompt, type ShanhaijingReport, SHANHAIJING_SACRED_BEASTS_ENGINE_VERSION } from './shanhaijingSacredBeastsEngine';
import { calculateJainGunasthanaKarma, formatJainGunasthanaKarmaPrompt, type JainGunasthanaReport, JAIN_GUNASTHANA_KARMA_ENGINE_VERSION } from './jainGunasthanaKarmaEngine';
import { calculateCelticAwenTaliesin, formatCelticAwenTaliesinPrompt, type CelticAwenTaliesinReport, CELTIC_AWEN_TALIESIN_ENGINE_VERSION } from './celticAwenTaliesinEngine';
import { calculateKoreanDangunCheonbuin, formatKoreanDangunCheonbuinPrompt, type KoreanDangunCheonbuinReport, KOREAN_DANGUN_CHEONBUIN_ENGINE_VERSION } from './koreanDangunCheonbuinEngine';
import { calculateMaoriMauriHauora, formatMaoriMauriHauoraPrompt, type MaoriMauriHauoraReport, MAORI_MAURI_HAUORA_ENGINE_VERSION } from './maoriMauriHauoraEngine';
import { calculateSlavicMokoshFateWeaving, formatSlavicMokoshFateWeavingPrompt, type SlavicMokoshFateWeavingReport, SLAVIC_MOKOSH_FATE_WEAVING_ENGINE_VERSION } from './slavicMokoshFateWeavingEngine';
import { calculateSumerianGilgameshTrials, formatSumerianGilgameshTrialsPrompt, type GilgameshTrialsReport, SUMERIAN_GILGAMESH_TRIALS_ENGINE_VERSION } from './sumerianGilgameshTwelveTrialsEngine';
import { calculateHawaiianKahunaThreeSelves, formatHawaiianKahunaThreeSelvesPrompt, type KahunaManaReport, HAWAIIAN_KAHUNA_THREE_SELVES_ENGINE_VERSION } from './hawaiianKahunaThreeSelvesManaEngine';
import { calculateNordicYggdrasilRealms, formatNordicYggdrasilRealmsPrompt, type YggdrasilRealmsReport, NORDIC_YGGDRASIL_NINE_REALMS_ENGINE_VERSION } from './nordicYggdrasilNineRealmsEngine';
import { calculateEgyptianMaatFeatherHeart, formatEgyptianMaatFeatherHeartPrompt, type MaatWeighingReport, EGYPTIAN_MAAT_FEATHER_ENGINE_VERSION } from './egyptianMaatFeatherHeartEngine';
import { calculatePersianMithraicSpheres, formatPersianMithraicSpheresPrompt, type MithraicSpheresReport, PERSIAN_MITHRAIC_SPHERES_ENGINE_VERSION } from './persianMithraicSevenSpheresEngine';
import { calculateOrpheicMysteries, formatOrpheicMysteriesPrompt, type OrphicMysteriesReport, ORPHEIC_MYSTERIES_ENGINE_VERSION } from './orpheicMysteriesDionysianEngine';
import { calculatePopolVuhHeroTwins, formatPopolVuhHeroTwinsPrompt, type PopolVuhReport, MESOAMERICAN_POPOL_VUH_ENGINE_VERSION } from './mesoamericanPopolVuhHeroTwinsEngine';
import { calculateAncientYarrowProbability, formatAncientYarrowProbabilityPrompt, type YarrowProbabilityReport, ANCIENT_YARROW_PROBABILITY_ENGINE_VERSION } from './ancientChineseYarrowIchingProbabilityEngine';
import { calculateVedicPanchaKosha, formatVedicPanchaKoshaPrompt, type PanchaKoshaReport, VEDIC_PANCHA_KOSHA_ENGINE_VERSION } from './vedicPanchaKoshaAlignmentEngine';
import { calculateRomanJanus, formatRomanJanusPrompt, type RomanJanusReport, ROMAN_JANUS_ENGINE_VERSION } from './romanJanusThresholdTransitionsEngine';
import { calculateBaopuziElixirs, formatBaopuziElixirsPrompt, type BaopuziElixirsReport, BAOPUZI_ELIXIRS_ENGINE_VERSION } from './ancientChineseBaopuziNineElixirsEngine';
import { calculateVedicMahavakya, formatVedicMahavakyaPrompt, type VedicMahavakyaReport, VEDIC_MAHAVAKYA_ENGINE_VERSION } from './vedicMahavakyaConsciousnessEngine';
import { calculateSumerianApkalluWisdom, formatSumerianApkalluWisdomPrompt, type SumerianApkalluWisdomReport, SUMERIAN_APKALLU_WISDOM_ENGINE_VERSION } from './sumerianApkalluWisdomEngine';
import { calculateCelticTuathaFourTreasures, formatCelticTuathaFourTreasuresPrompt, type CelticTuathaFourTreasuresReport, CELTIC_TUATHA_FOUR_TREASURES_ENGINE_VERSION } from './celticTuathaFourTreasuresEngine';
import { calculateTaoistShangqingTwentyFourSpirits, formatTaoistShangqingTwentyFourSpiritsPrompt, type TaoistShangqingTwentyFourSpiritsReport, TAOIST_SHANGQING_TWENTY_FOUR_SPIRITS_ENGINE_VERSION } from './taoistShangqingTwentyFourSpiritsEngine';
import { calculateTibetanPhowaRainbowBody, formatTibetanPhowaRainbowBodyPrompt, type TibetanPhowaRainbowBodyReport, TIBETAN_PHOWA_RAINBOW_BODY_ENGINE_VERSION } from './tibetanPhowaRainbowBodyEngine';
import { calculatePythagoreanHarmoniaSpheres, formatPythagoreanHarmoniaSpheresPrompt, type PythagoreanHarmoniaSpheresReport, PYTHAGOREAN_HARMONIA_SPHERES_ENGINE_VERSION } from './pythagoreanHarmoniaSpheresEngine';
import { calculatePlumBlossomMeihuaOracle, formatPlumBlossomMeihuaOraclePrompt, type PlumBlossomMeihuaReport, PLUM_BLOSSOM_MEIHUA_ORACLE_ENGINE_VERSION } from './plumBlossomMeihuaOracleEngine';
import { calculateGreekMoiraiAnankeFate, formatGreekMoiraiAnankeFatePrompt, type GreekMoiraiAnankeFateReport, GREEK_MOIRAI_ANANKE_FATE_ENGINE_VERSION } from './greekMoiraiAnankeFateEngine';
import { calculateEgyptianSphinxDreamOracle, formatEgyptianSphinxDreamOraclePrompt, type EgyptianSphinxDreamOracleReport, EGYPTIAN_SPHINX_DREAM_ORACLE_ENGINE_VERSION } from './egyptianSphinxDreamOracleEngine';
import { calculateChaldeanMulApinAstrology, formatChaldeanMulApinAstrologyPrompt, type ChaldeanMulApinAstrologyReport, CHALDEAN_MUL_APIN_ASTROLOGY_ENGINE_VERSION } from './chaldeanMulApinAstrologyEngine';
import { calculateToltecNagualDreaming, formatToltecNagualDreamingPrompt, type ToltecNagualDreamingReport, TOLTEC_NAGUAL_DREAMING_ENGINE_VERSION } from './toltecNagualDreamingEngine';
import { calculateShugendoYamabushiTenRealms, formatShugendoYamabushiTenRealmsPrompt, type ShugendoYamabushiTenRealmsReport, SHUGENDO_YAMABUSHI_TEN_REALMS_ENGINE_VERSION } from './shugendoYamabushiTenRealmsEngine';
import { calculateGnosticPistisSophiaPleroma, formatGnosticPistisSophiaPleromaPrompt, type GnosticPistisSophiaPleromaReport, GNOSTIC_PISTIS_SOPHIA_PLEROMA_ENGINE_VERSION } from './gnosticPistisSophiaPleromaEngine';
import { calculateSumerianInannaUnderworldDescent, formatSumerianInannaUnderworldDescentPrompt, type SumerianInannaUnderworldDescentReport, SUMERIAN_INANNA_UNDERWORLD_DESCENT_ENGINE_VERSION } from './sumerianInannaUnderworldDescentEngine';
import { calculateNorseVolvaSeidrNineRealms, formatNorseVolvaSeidrNineRealmsPrompt, type NorseVolvaSeidrNineRealmsReport, NORSE_VOLVA_SEIDR_NINE_REALMS_ENGINE_VERSION } from './norseVolvaSeidrNineRealmsEngine';
import { calculateZhuangziXiaoyaoyouButterfly, formatZhuangziXiaoyaoyouButterflyPrompt, type ZhuangziXiaoyaoyouButterflyReport, ZHUANGZI_XIAOYAOYOU_BUTTERFLY_ENGINE_VERSION } from './zhuangziXiaoyaoyouButterflyEngine';
import { calculateBuddhistYogacaraConsciousness, formatBuddhistYogacaraConsciousnessPrompt, type BuddhistYogacaraConsciousnessReport, BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION } from './buddhistYogacaraEightConsciousnessEngine';
import { calculateVedicMandukyaTuriya, formatVedicMandukyaTuriyaPrompt, type VedicMandukyaTuriyaReport, VEDIC_MANDUKYA_TURIYA_ENGINE_VERSION } from './vedicMandukyaTuriyaEngine';
import { calculateKabbalisticZoharSoul, formatKabbalisticZoharSoulPrompt, type KabbalisticZoharSoulReport, KABBALISTIC_ZOHAR_SOUL_ENGINE_VERSION } from './kabbalisticZoharFiveSoulLevelsEngine';
import { calculateRomanStoicProhairesis, formatRomanStoicProhairesisPrompt, type RomanStoicProhairesisReport, ROMAN_STOIC_PROHAIRESIS_ENGINE_VERSION } from './romanStoicProhairesisDichotomyEngine';
import { calculatePatanjaliAshtangaYoga, formatPatanjaliAshtangaYogaPrompt, type PatanjaliAshtangaYogaReport, PATANJALI_ASHTANGA_YOGA_ENGINE_VERSION } from './patanjaliAshtangaYogaSutraEngine';
import { calculateKoreanPungryudoHwarang, formatKoreanPungryudoHwarangPrompt, type KoreanPungryudoHwarangReport, KOREAN_PUNGRYUDO_HWARANG_ENGINE_VERSION } from './koreanPungryudoHwarangFivePreceptsEngine';
import { calculatePersianAttarSevenValleys, formatPersianAttarSevenValleysPrompt, type PersianAttarSevenValleysReport, ATTAR_SEVEN_VALLEYS_ENGINE_VERSION } from './persianAttarSevenValleysEngine';
import { calculateHermeticPoimandres, formatHermeticPoimandresPrompt, type HermeticPoimandresAscensionReport, HERMETIC_POIMANDRES_ENGINE_VERSION } from './hermeticPoimandresAscensionEngine';
import { calculateKashmirShaivismSpanda, formatKashmirShaivismSpandaPrompt, type KashmirShaivismSpandaReport, KASHMIR_SHAIVISM_SPANDA_ENGINE_VERSION } from './kashmirShaivismSpandaEngine';
import { calculateSumerianEnumaElishFiftyNames, formatSumerianEnumaElishFiftyNamesPrompt, type SumerianEnumaElishFiftyNamesReport, ENUMA_ELISH_ENGINE_VERSION } from './sumerianEnumaElishFiftyNamesEngine';
import { calculateAlexandrianDecanThirtySixGods, formatAlexandrianDecanThirtySixGodsPrompt, type AlexandrianDecanThirtySixGodsReport, ALEXANDRIAN_DECAN_ENGINE_VERSION } from './alexandrianDecanThirtySixGodsEngine';
import { calculateTaoistLieziWindRiding, formatTaoistLieziWindRidingPrompt, type TaoistLieziWindRidingReport, TAOIST_LIEZI_ENGINE_VERSION } from './taoistLieziWindRidingEngine';
import { calculateSamkhyaTwentyFiveTattvas, formatSamkhyaTwentyFiveTattvasPrompt, type SamkhyaTwentyFiveTattvasReport, SAMKHYA_TATTVAS_ENGINE_VERSION } from './samkhyaTwentyFiveTattvasEngine';
import { calculateNeoConfucianFourSevenLiQi, formatNeoConfucianFourSevenLiQiPrompt, type NeoConfucianFourSevenLiQiReport, NEO_CONFUCIAN_LIQI_ENGINE_VERSION } from './neoConfucianFourSevenLiQiEngine';
import { calculateEtruscanAugurSixteenSky, formatEtruscanAugurSixteenSkyPrompt, type EtruscanAugurSixteenSkyReport, ETRUSCAN_AUGUR_ENGINE_VERSION } from './etruscanAugurSixteenSkyDivinationEngine';
import { calculateRosicrucianChymicalWedding, formatRosicrucianChymicalWeddingPrompt, type RosicrucianChymicalWeddingReport, ROSICRUCIAN_CHYMICAL_WEDDING_ENGINE_VERSION } from './rosicrucianChymicalWeddingSevenDaysEngine';
import { calculateAztecTonalamatl, formatAztecTonalamatlPrompt, type AztecTonalamatlReport, AZTEC_TONALAMATL_ENGINE_VERSION } from './aztecTonalamatlSacredCalendarEngine';
import { calculateMongolianTengriHiimori, formatMongolianTengriHiimoriPrompt, type MongolianTengriHiimoriReport, MONGOLIAN_TENGRI_HIIMORI_ENGINE_VERSION } from './mongolianTengriHiimoriSoulEngine';
import { calculateGaelicWheelFireFestivals, formatGaelicWheelFireFestivalsPrompt, type GaelicWheelFireFestivalsReport, GAELIC_FIRE_FESTIVALS_ENGINE_VERSION } from './gaelicWheelFireFestivalsEngine';
import { calculateNorseHavamalEighteenGaldr, formatNorseHavamalEighteenGaldrPrompt, type NorseHavamalEighteenGaldrReport, NORSE_HAVAMAL_GALDR_ENGINE_VERSION } from './norseHavamalEighteenGaldrEngine';
import { calculateIbnArabiWahdatAlWujud, formatIbnArabiWahdatAlWujudPrompt, type IbnArabiWahdatAlWujudReport, IBN_ARABI_WAHDAT_ENGINE_VERSION } from './ibnArabiWahdatAlWujudWisdomEngine';
import { calculateChonggamnokTenSanctuaries, formatChonggamnokPrompt, type ChonggamnokReport, CHONGGAMNOK_SANCTUARIES_ENGINE_VERSION } from './koreanChonggamnokTenSanctuariesEngine';
import { calculateBalineseTriHitaKarana, formatBalineseTriHitaKaranaPrompt, type BalineseTriHitaKaranaReport, BALINESE_TRI_HITA_KARANA_ENGINE_VERSION } from './balineseTriHitaKaranaHarmonyEngine';
import { calculateHopiFourWorldsKachina, formatHopiFourWorldsPrompt, type HopiFourWorldsReport, HOPI_FOUR_WORLDS_ENGINE_VERSION } from './hopiFourWorldsKachinaProphecyEngine';
import { calculateDonghakCheondoismCheonju, formatDonghakCheondoismCheonjuPrompt, type DonghakCheonjuReport, DONGHAK_CHEONDOISM_VERSION } from './koreanDonghakCheondoismCheonjuEngine';
import { calculateIncaAndeanThreePachaAyni, formatIncaAndeanThreePachaAyniPrompt, type IncaAndeanPachaReport, INCA_ANDEAN_PACHA_VERSION } from './incaAndeanThreePachaAyniEngine';
import { calculateShangOracleBoneDivination, formatShangOracleBoneDivinationPrompt, type ShangOracleBoneReport, SHANG_ORACLE_BONE_VERSION } from './shangOracleBoneDivinationEngine';
import { calculateKoreanCheonbugyeongEightyOne, formatKoreanCheonbugyeongEightyOnePrompt, type CheonbugyeongEightyOneReport, CHEONBUGYEONG_ENGINE_VERSION } from './koreanCheonbugyeongEightyOneCosmicEngine';
import { calculateHinduSriYantraSacredGeometry, formatHinduSriYantraSacredGeometryPrompt, type SriYantraSacredGeometryReport, SRI_YANTRA_ENGINE_VERSION } from './hinduSriYantraSacredGeometryEngine';
import { calculateLakotaMedicineWheel, formatLakotaMedicineWheelPrompt, type LakotaMedicineWheelReport, LAKOTA_MEDICINE_WHEEL_ENGINE_VERSION } from './lakotaMedicineWheelWakanTankaEngine';
import { calculateGyeogamYurokProphecy, formatGyeogamYurokProphecyPrompt, type GyeogamYurokReport, GYEOGAM_YUROK_VERSION } from './koreanGyeogamYurokProphecyEngine';
import { calculateHeianOnmyodoSeimei, formatHeianOnmyodoSeimeiPrompt, type HeianOnmyodoSeimeiReport, HEIAN_ONMYODO_SEIMEI_VERSION } from './japaneseHeianOnmyodoSeimeiEngine';
import { calculatePolynesianWayfinding, formatPolynesianWayfindingPrompt, type PolynesianWayfindingReport, POLYNESIAN_WAYFINDING_VERSION } from './polynesianWayfindingStarCompassEngine';
import { calculateWonhyoHwajaeng, formatWonhyoHwajaengPrompt, type WonhyoHwajaengReport, WONHYO_HWAJAENG_VERSION } from './koreanWonhyoHwajaengOneMindEngine';
import { calculateMayiMianxiang, formatMayiMianxiangPrompt, type MayiMianxiangReport, MAYI_MIANXIANG_VERSION } from './chineseMayiMianxiangTwelvePalacesEngine';
import { calculateEgyptianAmduat, formatEgyptianAmduatPrompt, type EgyptianAmduatReport, EGYPTIAN_AMDUAT_VERSION } from './egyptianAmduatTwelveHoursRaEngine';
import { calculateCelticBrehonLaw, formatCelticBrehonLawPrompt, type CelticBrehonLawResult, CELTIC_BREHON_LAW_VERSION } from './celticDruidBrehonLawJusticeEngine';
import { calculateMesopotamianNisaba, formatMesopotamianNisabaPrompt, type MesopotamianNisabaResult, MESOPOTAMIAN_NISABA_VERSION } from './mesopotamianNisabaScribeWisdomEngine';
import { calculateSuunGasiHeon, formatSuunGasiHeonPrompt, type SuunGasiHeonResult, SUUN_GASI_HEON_VERSION } from './koreanSuunGasiHeonGyeongGwonEngine';
import { calculateEleusinianTriptolemos, formatEleusinianTriptolemosPrompt, type EleusinianTriptolemosResult, ELEUSINIAN_TRIPTOLEMOS_VERSION } from './ancientGreekEleusinianTriptolemosEngine';
import { calculateMixtecEightDeer, formatMixtecEightDeerPrompt, type MixtecEightDeerResult, MIXTEC_EIGHT_DEER_VERSION } from './mesoamericanMixtecEightDeerJaguarClawEngine';
import { calculateJeonBongjunNokdu, formatJeonBongjunNokduPrompt, type JeonBongjunNokduResult, JEON_BONGJUN_NOKDU_VERSION } from './koreanJeonBongjunNokduGeneralEngine';
import { calculateAtrahasisFlood, formatAtrahasisFloodPrompt, type AtrahasisFloodResult, ATRAHASIS_FLOOD_VERSION } from './mesopotamianAtrahasisFloodWisdomEngine';
import { calculateEddicYggdrasil, formatEddicYggdrasilPrompt, type EddicYggdrasilResult, EDDIC_YGGDRASIL_VERSION } from './scandinavianEddicYggdrasilNineRealmsEngine';
import { calculateYiSunSinNanjungIlgi, formatYiSunSinNanjungIlgiPrompt, type YiSunSinNanjungIlgiResult, YISUNSIN_NANJUNG_ILGI_VERSION } from './koreanYiSunSinNanjungIlgiStrategicEngine';
import { calculatePtahMemphite, formatPtahMemphitePrompt, type PtahMemphiteResult, PTAH_MEMPHITE_VERSION } from './ancientEgyptianPtahMemphiteTheologyEngine';
import { calculateLughSamildanach, formatLughSamildanachPrompt, type LughSamildanachResult, LUGH_SAMILDANACH_VERSION } from './celticTuathaDeDanannLughSamildanachEngine';
import { calculateChoeHyeonbaeGeulbon, formatChoeHyeonbaeGeulbonPrompt, type ChoeHyeonbaeGeulbonResult, CHOE_HYEONBAE_GEULBON_VERSION } from './koreanChoeHyeonbaeHangeulGeulbonEngine';
import { calculateZoroastrianAmeshaSpentas, formatZoroastrianAmeshaSpentasPrompt, type ZoroastrianAmeshaSpentasResult, ZOROASTRIAN_AMESHA_SPENTAS_VERSION } from './ancientPersianZoroastrianAmeshaSpentasEngine';
import { calculateDelphicChilon, formatDelphicChilonPrompt, type DelphicChilonResult, DELPHIC_CHILON_VERSION } from './ancientGreekDelphicChilonKnowThyselfEngine';
import { calculateJeongYakyongMongmin, formatJeongYakyongMongminPrompt, type JeongYakyongMongminResult, JEONG_YAKYONG_MONGMIN_VERSION } from './koreanJeongYakyongMongminSimseoEngine';
import { calculateHeraclitusPantaRhei, formatHeraclitusPantaRheiPrompt, type HeraclitusPantaRheiResult, HERACLITUS_PANTA_RHEI_VERSION } from './ancientGreekHeraclitusPantaRheiLogosEngine';
import { calculateMoziGyeomAe, formatMoziGyeomAePrompt, type MoziGyeomAeResult, MOZI_GYEOM_AE_VERSION } from './ancientChineseMoziGyeomAeUniversalLoveEngine';
import { calculateAureliusInnerCitadel, formatAureliusInnerCitadelPrompt, type AureliusInnerCitadelResult, AURELIUS_INNER_CITADEL_VERSION } from './romanAureliusInnerCitadelMeditationsEngine';
import { calculateLaoziDaodejing, formatLaoziDaodejingPrompt, type LaoziDaodejingResult, LAOZI_DAODEJING_VERSION } from './chineseLaoziDaodejingWaterWayEngine';
import { calculateEpicureanTetrapharmakos, formatEpicureanTetrapharmakosPrompt, type EpicureanTetrapharmakosResult, EPICUREAN_TETRAPHARMAKOS_VERSION } from './ancientGreekEpicureanTetrapharmakosEngine';
import { calculateYulgokGyeokmong, formatYulgokGyeokmongPrompt, type YulgokGyeokmongResult, YULGOK_GYEOKMONG_VERSION } from './koreanYulgokGyeokmongYogyeolEngine';
import { calculateAristotleMesotes, formatAristotleMesotesPrompt, type AristotleMesotesResult, ARISTOTLE_MESOTES_VERSION } from './ancientGreekAristotleMesotesEudaimoniaEngine';
import { calculateBhagavadGitaKarmaYoga, formatBhagavadGitaKarmaYogaPrompt, type BhagavadGitaKarmaYogaResult, BHAGAVAD_GITA_KARMA_YOGA_VERSION } from './ancientIndianBhagavadGitaKarmaYogaEngine';
import { calculateWangYangmingXinxue, formatWangYangmingXinxuePrompt, type WangYangmingXinxueResult, WANG_YANGMING_LIANGZHI_VERSION } from './chineseWangYangmingLiangzhiXinxueEngine';
import { calculateSocraticMaieuticDaimon, formatSocraticMaieuticDaimonPrompt, type SocraticMaieuticDaimonResult, SOCRATIC_MAIEUTIC_DAIMON_VERSION } from './ancientGreekSocraticMaieuticDaimonEngine';
import { calculateMenciusFourSproutsHoyeon, formatMenciusFourSproutsHoyeonPrompt, type MenciusFourSproutsHoyeonResult, MENCIUS_FOUR_SPROUTS_HOYEON_VERSION } from './chineseMenciusFourSproutsHoyeonJigiEngine';
import { calculateSenecaTimeSovereignty, formatSenecaTimeSovereigntyPrompt, type SenecaTimeSovereigntyResult, SENECA_TIME_SOVEREIGNTY_VERSION } from './romanSenecaTimeSovereigntyTranquilityEngine';
import { calculatePlatonicIdeaCave, formatPlatonicIdeaCavePrompt, type PlatonicIdeaCaveResult, PLATONIC_IDEA_CAVE_VERSION } from './ancientGreekPlatonicIdeaCaveEngine';
import { calculateToegyeSeonghakSipdo, formatToegyeSeonghakSipdoPrompt, type ToegyeSeonghakSipdoResult, TOEGYE_SEONGHAK_SIPDO_VERSION } from './koreanToegyeSeonghakSipdoEngine';
import { calculateCiceroDeOfficiis, formatCiceroDeOfficiisPrompt, type CiceroDeOfficiisResult, CICERO_DE_OFFICIIS_VERSION } from './romanCiceroDeOfficiisHonestumEngine';
import { calculateEpictetusDichotomyOfControl, formatEpictetusDichotomyOfControlPrompt, type EpictetusDichotomyOfControlResult, EPICTETUS_CONTROL_VERSION } from './ancientGreekEpictetusDichotomyOfControlEngine';
import { calculateConfuciusAnalectsZhitianming, formatConfuciusAnalectsZhitianmingPrompt, type ConfuciusAnalectsZhitianmingResult, CONFUCIUS_ZHITIANMING_VERSION } from './ancientChineseConfuciusAnalectsZhitianmingEngine';
import { calculateBaruchSpinozaEthicaConatus, formatBaruchSpinozaEthicaConatusPrompt, type BaruchSpinozaEthicaConatusResult, SPINOZA_CONATUS_AMORDEI_VERSION } from './baruchSpinozaEthicaConatusAmorDeiEngine';
import { calculateKantCategoricalImperative, formatKantCategoricalImperativePrompt, type KantCategoricalImperativeResult, KANT_CATEGORICAL_IMPERATIVE_VERSION } from './germanKantCategoricalImperativeSynthesisEngine';
import { calculateUpanishadicTatTvamAsi, formatUpanishadicTatTvamAsiPrompt, type UpanishadicTatTvamAsiResult, UPANISHADIC_TAT_TVAM_ASI_VERSION } from './indianUpanishadicTatTvamAsiEngine';
import { calculateChoeHangiGihakUnwha, formatChoeHangiGihakUnwhaPrompt, type ChoeHangiGihakUnwhaResult, CHOE_HANGI_GIHAK_UNWHA_VERSION } from './koreanChoeHangiGihakUnwhaEngine';
import { calculateSunTzuArtOfWarStrategy, formatSunTzuArtOfWarStrategyPrompt, type SunTzuArtOfWarStrategyResult, SUNTZU_STRATEGY_VERSION } from './ancientChineseSunTzuArtOfWarStrategyEngine';
import { calculateFrenchDescartesCogito, formatFrenchDescartesCogitoPrompt, type FrenchDescartesCogitoResult, DESCARTES_COGITO_VERSION } from './frenchDescartesCogitoClaraDistinctaEngine';
import { calculateAncientIndianFourNobleTruths, formatAncientIndianFourNobleTruthsPrompt, type AncientIndianFourNobleTruthsResult, FOUR_NOBLE_TRUTHS_VERSION } from './ancientIndianEarlyBuddhistFourNobleTruthsEngine';
import { calculateRumiMasnaviDivineLove, formatRumiMasnaviDivineLovePrompt, type RumiMasnaviDivineLoveResult, RUMI_MASNAVI_SUFI_VERSION } from './islamicSufiRumiMasnaviDivineLoveEngine';
import { calculateUisangHwaeomIlseungBeopgye, formatUisangHwaeomIlseungBeopgyePrompt, type UisangHwaeomIlseungBeopgyeResult, UISANG_HWAEOM_BEOPGYE_VERSION } from './koreanUisangHwaeomIlseungBeopgyeEngine';
import { calculateMontaigneEssaisWisdom, formatMontaigneEssaisWisdomPrompt, type MontaigneEssaisWisdomResult, MONTAIGNE_ESSAIS_WISDOM_VERSION } from './frenchMontaigneEssaisWisdomEngine';
import { calculateNagarjunaMadhyamakaSunyata, formatNagarjunaMadhyamakaSunyataPrompt, type NagarjunaMadhyamakaSunyataResult, NAGARJUNA_MADHYAMAKA_VERSION } from './ancientIndianNagarjunaMadhyamakaSunyataEngine';
import { calculateJinulJeonghyeSsangsu, formatJinulJeonghyeSsangsuPrompt, type JinulJeonghyeSsangsuResult, JINUL_JEONGHYE_SSANGSU_VERSION } from './koreanJinulJeonghyeSsangsuDonohJeomsuEngine';
import { calculateRenaissanceBrunoInfiniteUniverse, formatRenaissanceBrunoInfiniteUniversePrompt, type RenaissanceBrunoInfiniteUniverseResult, BRUNO_INFINITE_UNIVERSE_VERSION } from './renaissanceBrunoInfiniteUniverseHeroicFuroreEngine';
import { calculatePascalPenseesHeartReason, formatPascalPenseesHeartReasonPrompt, type PascalPenseesHeartReasonResult, PASCAL_PENSEES_HEART_REASON_VERSION } from './frenchPascalPenseesHeartReasonEngine';
import { calculateSchopenhauerWillRepresentation, formatSchopenhauerWillRepresentationPrompt, type SchopenhauerWillRepresentationResult, SCHOPENHAUER_WILL_REPRESENTATION_VERSION } from './germanSchopenhauerWillRepresentationEngine';
import { calculateChusaKimJeonghuiSehando, formatChusaKimJeonghuiSehandoPrompt, type ChusaKimJeonghuiSehandoResult, CHUSA_SEHANDO_WISDOM_VERSION } from './koreanChusaKimJeonghuiSehandoEngine';
import { calculateKierkegaardStagesOfLife, formatKierkegaardStagesOfLifePrompt, type KierkegaardStagesOfLifeResult, KIERKEGAARD_STAGES_OF_LIFE_VERSION } from './danishKierkegaardStagesOfLifeEngine';
import { calculateNietzscheZarathustraAmorFati, formatNietzscheZarathustraAmorFatiPrompt, type NietzscheZarathustraAmorFatiResult, NIETZSCHE_ZARATHUSTRA_AMOR_FATI_VERSION } from './germanNietzscheZarathustraAmorFatiEngine';
import { calculateSeosanHyujeongSeongaGwigam, formatSeosanHyujeongSeongaGwigamPrompt, type SeosanHyujeongSeongaGwigamResult, SEOSAN_SEONGA_GWIGAM_VERSION } from './koreanSeosanHyujeongSeongaGwigamEngine';
import { calculateJungIndividuationArchetype, formatJungIndividuationArchetypePrompt, type JungIndividuationArchetypeResult, SWISS_JUNG_INDIVIDUATION_VERSION } from './swissJungIndividuationArchetypeEngine';
import { calculateHegelDialecticalAufheben, formatHegelDialecticalAufhebenPrompt, type HegelDialecticalAufhebenResult, GERMAN_HEGEL_DIALECTICAL_VERSION } from './germanHegelDialecticalAufhebenEngine';
import { calculateDasanMokminSimseo, formatDasanMokminSimseoPrompt, type DasanMokminSimseoResult, KOREAN_DASAN_MOKMIN_SIMSEO_VERSION } from './koreanDasanJeongYagyongMokminSimseoEngine';
import { calculateAugustineConfessionesIlluminatio, formatAugustineConfessionesIlluminatioPrompt, type AugustineConfessionesIlluminatioResult, NORTH_AFRICAN_AUGUSTINE_VERSION } from './northAfricanAugustineConfessionesIlluminatioEngine';
import { calculateMachiavelliVirtuFortuna, formatMachiavelliVirtuFortunaPrompt, type MachiavelliVirtuFortunaResult, ITALIAN_MACHIAVELLI_VERSION } from './italianMachiavelliVirtuFortunaEngine';
import { calculateChoeChiwonPungryudo, formatChoeChiwonPungryudoPrompt, type ChoeChiwonPungryudoResult, KOREAN_CHOE_CHIWON_VERSION } from './koreanChoeChiwonPungryudoEngine';
import { calculateThomasAquinasSummaTheologiae, formatThomasAquinasSummaTheologiaePrompt, type ThomasAquinasSummaTheologiaeResult, ITALIAN_THOMAS_AQUINAS_VERSION } from './italianThomasAquinasSummaTheologiaeEngine';
import { calculateFrancisBaconNovumOrganum, formatFrancisBaconNovumOrganumPrompt, type FrancisBaconNovumOrganumResult, BRITISH_FRANCIS_BACON_VERSION } from './britishFrancisBaconNovumOrganumEngine';
import { calculateRyuSeongryongJingbirok, formatRyuSeongryongJingbirokPrompt, type RyuSeongryongJingbirokResult, KOREAN_RYU_SEONGRYONG_VERSION } from './koreanRyuSeongryongJingbirokEngine';
import { calculateKingSejongHunminjeongeumAemin, formatKingSejongHunminjeongeumAeminPrompt, type KingSejongHunminjeongeumAeminResult, KOREAN_KING_SEJONG_VERSION } from './koreanKingSejongHunminjeongeumAeminEngine';
import { calculateJangBogoCheonghaejinMaritimePioneer, formatJangBogoCheonghaejinMaritimePioneerPrompt, type JangBogoCheonghaejinMaritimePioneerResult, KOREAN_JANG_BOGO_VERSION } from './koreanJangBogoCheonghaejinMaritimePioneerEngine';
import { calculateJohnStuartMillOnLibertyIndividuality, formatJohnStuartMillOnLibertyIndividualityPrompt, type JohnStuartMillOnLibertyIndividualityResult, BRITISH_JS_MILL_VERSION } from './britishJohnStuartMillOnLibertyIndividualityEngine';
import { calculateFrenchJeanJacquesRousseauNatureAuthenticity, formatJeanJacquesRousseauNatureAuthenticityPrompt, type JeanJacquesRousseauNatureAuthenticityResult, FRENCH_JJ_ROUSSEAU_VERSION } from './frenchJeanJacquesRousseauNatureAuthenticityEngine';
import { calculateGermanJohannWolfgangGoetheFaustStriving, formatJohannWolfgangGoetheFaustStrivingPrompt, type JohannWolfgangGoetheFaustStrivingResult, GERMAN_GOETHE_FAUST_VERSION } from './germanJohannWolfgangGoetheFaustStrivingEngine';
import { calculateItalianDanteAlighieriDivineComedyAscent, formatDanteAlighieriDivineComedyAscentPrompt, type DanteAlighieriDivineComedyAscentResult, ITALIAN_DANTE_COMEDY_VERSION } from './italianDanteAlighieriDivineComedyAscentEngine';
import { calculateMarcusAureliusMeditationsCitadel, formatMarcusAureliusMeditationsCitadelPrompt, type MarcusAureliusMeditationsCitadelResult, ROMAN_MARCUS_AURELIUS_VERSION } from './romanMarcusAureliusMeditationsCitadelEngine';
import { calculateSuunChoeJeuDonghakSicheonju, formatSuunChoeJeuDonghakSicheonjuPrompt, type SuunChoeJeuDonghakSicheonjuResult, KOREAN_SUUN_CHOE_JEU_VERSION } from './koreanSuunChoeJeuDonghakSicheonjuEngine';
import { calculateRalphWaldoEmersonSelfReliance, formatRalphWaldoEmersonSelfReliancePrompt, type RalphWaldoEmersonSelfRelianceResult, AMERICAN_RALPH_WALDO_EMERSON_VERSION } from './americanRalphWaldoEmersonSelfRelianceEngine';


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
  masterReview?: boolean;
  supplementExecutions?: Record<string, 'returned' | 'error' | 'skipped'>;
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
  elementalResonanceResult?: ElementalResonanceResult | null;
  yinYangPolarityResult?: YinYangPolarityResult | null;
  runeMatrixResult?: RuneMatrixResult | null;
  soulJourneyTarotResult?: SoulJourneyTarotResult | null;
  transcendentalMeditationResult?: TranscendentalMeditationResult | null;
  strategicLeverageResult?: StrategicLeverageResult | null;
  shadowArchetypeResult?: ShadowArchetypeResult | null;
  biorhythmPeakFlowResult?: BiorhythmPeakFlowResult | null;
  destinySynastryEchoResult?: DestinySynastryEchoResult | null;
  microHabitKarmaResult?: MicroHabitKarmaResult | null;
  ikigaiDestinyCompassResult?: IkigaiDestinyCompassResult | null;
  serendipitySynchronicityResult?: SerendipitySynchronicityResult | null;
  humanDesignBodyGraphResult?: HumanDesignBodyGraphResult | null;
  chakraVibrationAlignmentResult?: ChakraVibrationAlignmentResult | null;
  enneagramSoulIntegrationResult?: EnneagramSoulIntegrationResult | null;
  ancestralEpigeneticKarmaResult?: AncestralEpigeneticKarmaResult | null;
  shamanicAnimalTotemResult?: ShamanicAnimalTotemResult | null;
  heroMythMonomythResult?: HeroMythMonomythResult | null;
  akashicRecordsOracleResult?: AkashicRecordsOracleResult | null;
  quantumProbabilisticTimelineResult?: QuantumProbabilisticTimelineResult | null;
  somaticBodyArmoringResult?: SomaticBodyArmoringResult | null;
  supremeWisdomTrinityResult?: SupremeWisdomTrinityResult | null;
  sacredVortexGeometryResult?: SacredVortexGeometryResult | null;
  taoistNeidanMeridianResult?: TaoistNeidanMeridianResult | null;
  synchronicityOmenResult?: SynchronicityOmenResult | null;
  solfeggioHarmonicResult?: SolfeggioHarmonicResult | null;
  ethericAuraBiofieldResult?: EthericAuraBiofieldResult | null;
  sajuClassicYongshinResult?: SajuClassicYongshinResult | null;
  tarotTreeOfLifeShadowResult?: TarotTreeOfLifeShadowResult | null;
  hellenisticLotsResult?: HellenisticLotsReport | null;
  iching384YaoResult?: Iching384YaoReport | null;
  sajuTwelveStagesTombResult?: SajuTwelveStagesTombReport | null;
  tarotElementalCourtResult?: TarotElementalCourtReport | null;
  karmicSynastryResult?: KarmicSynastryReport | null;
  fiveEmotionsPulseResult?: FiveEmotionsPulseReport | null;
  hermeticKybalionResult?: HermeticKybalionReport | null;
  vibrationalSoulQuestResult?: SoulQuestReport | null;
  alchemicalTransmutationResult?: AlchemicalTransmutationReport | null;
  ziweiHuaJiResult?: ZiweiHuaJiReport | null;
  celticTreeOghamResult?: CelticTreeOghamReport | null;
  taoistSanbaoResult?: TaoistSanbaoReport | null;
  tibetanBardoResult?: TibetanBardoReport | null;
  mesopotamianSevenGatesResult?: MesopotamianSevenGatesReport | null;
  egyptianDecansResult?: EgyptianThirtySixDecansReport | null;
  sufiLataifResult?: SufiLataifReport | null;
  mayanTzolkinResult?: MayanTzolkinReport | null;
  nordicRunesResult?: NordicElderFutharkRunesReport | null;
  delphicMaximsResult?: DelphicMaximsOracleReport | null;
  ayurvedicTridoshaResult?: AyurvedicTridoshaReport | null;
  hawaiianHunaResult?: HawaiianHunaReport | null;
  fengShuiEightMansionsResult?: FengShuiEightMansionsReport | null;
  zoroastrianAshaResult?: ZoroastrianAshaReport | null;
  hinduKundaliniResult?: HinduTantricKundaliniReport | null;
  guiguziLiangtouqianResult?: GuiguziLiangtouqianReport | null;
  slavicSvarogResult?: SlavicSvarogCircleReport | null;
  esseneCommunionResult?: EsseneCommunionReport | null;
  huangdiFiveMovementsSixQiResult?: HuangdiFiveMovementsSixQiReport | null;
  pythagoreanTetraktysResult?: PythagoreanTetraktysReport | null;
  babylonianEnumaElishResult?: BabylonianEnumaElishReport | null;
  taoistHuangtingJingResult?: TaoistHuangtingJingReport | null;
  persianAmeshaSpentaResult?: PersianAmeshaSpentaReport | null;
  sumerianFiftyMesResult?: SumerianMeReport | null;
  zhongLuAlchemyResult?: ZhongLuAlchemyReport | null;
  druidMoonTreesResult?: DruidMoonTreesReport | null;
  tiebanShenshuResult?: TiebanReport | null;
  tibetanBonResult?: TibetanBonReport | null;
  eleusinianMysteriesResult?: EleusinianReport | null;
  vedicNakshatra108PadaResult?: VedicNakshatra108PadaReport | null;
  egyptianHermeticCartoucheResult?: EgyptianHermeticCartoucheReport | null;
  taoistGongGuoGeKarmaResult?: TaoistGongGuoGeKarmaReport | null;
  yorubaIfaOduResult?: YorubaIfaOduReport | null;
  arabicIlmAlRamlResult?: ArabicIlmAlRamlReport | null;
  hinduNadiAgastyaPalmLeafResult?: HinduNadiAgastyaPalmLeafReport | null;
  shintoKotodamaFourSoulsResult?: ShintoKotodamaReport | null;
  aboriginalDreamtimeSonglinesResult?: DreamtimeSonglineReport | null;
  finnishKalevalaSampoResult?: FinnishKalevalaSampoReport | null;
  shanhaijingSacredBeastsResult?: ShanhaijingReport | null;
  jainGunasthanaKarmaResult?: JainGunasthanaReport | null;
  celticAwenTaliesinResult?: CelticAwenTaliesinReport | null;
  koreanDangunCheonbuinResult?: KoreanDangunCheonbuinReport | null;
  maoriMauriHauoraResult?: MaoriMauriHauoraReport | null;
  slavicMokoshFateWeavingResult?: SlavicMokoshFateWeavingReport | null;
  sumerianGilgameshTrialsResult?: GilgameshTrialsReport | null;
  hawaiianKahunaThreeSelvesResult?: KahunaManaReport | null;
  nordicYggdrasilRealmsResult?: YggdrasilRealmsReport | null;
  egyptianMaatFeatherHeartResult?: MaatWeighingReport | null;
  persianMithraicSpheresResult?: MithraicSpheresReport | null;
  orpheicMysteriesResult?: OrphicMysteriesReport | null;
  popolVuhHeroTwinsResult?: PopolVuhReport | null;
  ancientYarrowProbabilityResult?: YarrowProbabilityReport | null;
  vedicPanchaKoshaResult?: PanchaKoshaReport | null;
  romanJanusResult?: RomanJanusReport | null;
  baopuziElixirsResult?: BaopuziElixirsReport | null;
  vedicMahavakyaResult?: VedicMahavakyaReport | null;
  sumerianApkalluWisdomResult?: SumerianApkalluWisdomReport | null;
  celticTuathaFourTreasuresResult?: CelticTuathaFourTreasuresReport | null;
  taoistShangqingTwentyFourSpiritsResult?: TaoistShangqingTwentyFourSpiritsReport | null;
  tibetanPhowaRainbowBodyResult?: TibetanPhowaRainbowBodyReport | null;
  pythagoreanHarmoniaSpheresResult?: PythagoreanHarmoniaSpheresReport | null;
  plumBlossomMeihuaOracleResult?: PlumBlossomMeihuaReport | null;
  greekMoiraiAnankeFateResult?: GreekMoiraiAnankeFateReport | null;
  egyptianSphinxDreamOracleResult?: EgyptianSphinxDreamOracleReport | null;
  chaldeanMulApinAstrologyResult?: ChaldeanMulApinAstrologyReport | null;
  toltecNagualDreamingResult?: ToltecNagualDreamingReport | null;
  shugendoYamabushiTenRealmsResult?: ShugendoYamabushiTenRealmsReport | null;
  gnosticPistisSophiaPleromaResult?: GnosticPistisSophiaPleromaReport | null;
  sumerianInannaUnderworldDescentResult?: SumerianInannaUnderworldDescentReport | null;
  norseVolvaSeidrNineRealmsResult?: NorseVolvaSeidrNineRealmsReport | null;
  zhuangziXiaoyaoyouButterflyResult?: ZhuangziXiaoyaoyouButterflyReport | null;
  buddhistYogacaraConsciousnessResult?: BuddhistYogacaraConsciousnessReport | null;
  vedicMandukyaTuriyaResult?: VedicMandukyaTuriyaReport | null;
  kabbalisticZoharSoulResult?: KabbalisticZoharSoulReport | null;
  romanStoicProhairesisResult?: RomanStoicProhairesisReport | null;
  patanjaliAshtangaYogaResult?: PatanjaliAshtangaYogaReport | null;
  koreanPungryudoHwarangResult?: KoreanPungryudoHwarangReport | null;
  persianAttarSevenValleysResult?: PersianAttarSevenValleysReport | null;
  hermeticPoimandresResult?: HermeticPoimandresAscensionReport | null;
  kashmirShaivismSpandaResult?: KashmirShaivismSpandaReport | null;
  sumerianEnumaElishFiftyNamesResult?: SumerianEnumaElishFiftyNamesReport | null;
  alexandrianDecanThirtySixGodsResult?: AlexandrianDecanThirtySixGodsReport | null;
  taoistLieziWindRidingResult?: TaoistLieziWindRidingReport | null;
  samkhyaTwentyFiveTattvasResult?: SamkhyaTwentyFiveTattvasReport | null;
  neoConfucianFourSevenLiQiResult?: NeoConfucianFourSevenLiQiReport | null;
  etruscanAugurSixteenSkyResult?: EtruscanAugurSixteenSkyReport | null;
  rosicrucianChymicalWeddingResult?: RosicrucianChymicalWeddingReport | null;
  aztecTonalamatlResult?: AztecTonalamatlReport | null;
  mongolianTengriHiimoriResult?: MongolianTengriHiimoriReport | null;
  gaelicWheelFireFestivalsResult?: GaelicWheelFireFestivalsReport | null;
  norseHavamalEighteenGaldrResult?: NorseHavamalEighteenGaldrReport | null;
  ibnArabiWahdatAlWujudResult?: IbnArabiWahdatAlWujudReport | null;
  chonggamnokTenSanctuariesResult?: ChonggamnokReport | null;
  balineseTriHitaKaranaResult?: BalineseTriHitaKaranaReport | null;
  hopiFourWorldsKachinaResult?: HopiFourWorldsReport | null;
  donghakCheondoismCheonjuResult?: DonghakCheonjuReport | null;
  incaAndeanThreePachaAyniResult?: IncaAndeanPachaReport | null;
  shangOracleBoneDivinationResult?: ShangOracleBoneReport | null;
  cheonbugyeongEightyOneResult?: CheonbugyeongEightyOneReport | null;
  hinduSriYantraResult?: SriYantraSacredGeometryReport | null;
  lakotaMedicineWheelResult?: LakotaMedicineWheelReport | null;
  gyeogamYurokResult?: GyeogamYurokReport | null;
  heianOnmyodoSeimeiResult?: HeianOnmyodoSeimeiReport | null;
  polynesianWayfindingResult?: PolynesianWayfindingReport | null;
  wonhyoHwajaengResult?: WonhyoHwajaengReport | null;
  mayiMianxiangResult?: MayiMianxiangReport | null;
  egyptianAmduatResult?: EgyptianAmduatReport | null;
  celticDruidBrehonLawResult?: CelticBrehonLawResult | null;
  mesopotamianNisabaResult?: MesopotamianNisabaResult | null;
  suunGasiHeonResult?: SuunGasiHeonResult | null;
  eleusinianTriptolemosResult?: EleusinianTriptolemosResult | null;
  mixtecEightDeerResult?: MixtecEightDeerResult | null;
  jeonBongjunNokduResult?: JeonBongjunNokduResult | null;
  atrahasisFloodResult?: AtrahasisFloodResult | null;
  eddicYggdrasilResult?: EddicYggdrasilResult | null;
  yiSunSinNanjungIlgiResult?: YiSunSinNanjungIlgiResult | null;
  ptahMemphiteResult?: PtahMemphiteResult | null;
  lughSamildanachResult?: LughSamildanachResult | null;
  choeHyeonbaeGeulbonResult?: ChoeHyeonbaeGeulbonResult | null;
  zoroastrianAmeshaSpentasResult?: ZoroastrianAmeshaSpentasResult | null;
  delphicChilonResult?: DelphicChilonResult | null;
  jeongYakyongMongminResult?: JeongYakyongMongminResult | null;
  heraclitusPantaRheiResult?: HeraclitusPantaRheiResult | null;
  moziGyeomAeResult?: MoziGyeomAeResult | null;
  aureliusInnerCitadelResult?: AureliusInnerCitadelResult | null;
  laoziDaodejingResult?: LaoziDaodejingResult | null;
  epicureanTetrapharmakosResult?: EpicureanTetrapharmakosResult | null;
  yulgokGyeokmongResult?: YulgokGyeokmongResult | null;
  aristotleMesotesResult?: AristotleMesotesResult | null;
  bhagavadGitaKarmaYogaResult?: BhagavadGitaKarmaYogaResult | null;
  wangYangmingXinxueResult?: WangYangmingXinxueResult | null;
  socraticMaieuticDaimonResult?: SocraticMaieuticDaimonResult | null;
  menciusFourSproutsHoyeonResult?: MenciusFourSproutsHoyeonResult | null;
  senecaTimeSovereigntyResult?: SenecaTimeSovereigntyResult | null;
  platonicIdeaCaveResult?: PlatonicIdeaCaveResult | null;
  toegyeSeonghakSipdoResult?: ToegyeSeonghakSipdoResult | null;
  ciceroDeOfficiisResult?: CiceroDeOfficiisResult | null;
  epictetusDichotomyOfControlResult?: EpictetusDichotomyOfControlResult | null;
  confuciusAnalectsZhitianmingResult?: ConfuciusAnalectsZhitianmingResult | null;
  spinozaEthicaConatusResult?: BaruchSpinozaEthicaConatusResult | null;
  kantCategoricalImperativeResult?: KantCategoricalImperativeResult | null;
  upanishadicTatTvamAsiResult?: UpanishadicTatTvamAsiResult | null;
  choeHangiGihakUnwhaResult?: ChoeHangiGihakUnwhaResult | null;
  sunTzuArtOfWarStrategyResult?: SunTzuArtOfWarStrategyResult | null;
  frenchDescartesCogitoResult?: FrenchDescartesCogitoResult | null;
  fourNobleTruthsResult?: AncientIndianFourNobleTruthsResult | null;
  rumiMasnaviDivineLoveResult?: RumiMasnaviDivineLoveResult | null;
  uisangHwaeomIlseungBeopgyeResult?: UisangHwaeomIlseungBeopgyeResult | null;
  montaigneEssaisWisdomResult?: MontaigneEssaisWisdomResult | null;
  nagarjunaMadhyamakaSunyataResult?: NagarjunaMadhyamakaSunyataResult | null;
  jinulJeonghyeSsangsuResult?: JinulJeonghyeSsangsuResult | null;
  brunoInfiniteUniverseResult?: RenaissanceBrunoInfiniteUniverseResult | null;
  pascalPenseesHeartReasonResult?: PascalPenseesHeartReasonResult | null;
  schopenhauerWillRepresentationResult?: SchopenhauerWillRepresentationResult | null;
  chusaKimJeonghuiSehandoResult?: ChusaKimJeonghuiSehandoResult | null;
  kierkegaardStagesOfLifeResult?: KierkegaardStagesOfLifeResult | null;
  nietzscheZarathustraAmorFatiResult?: NietzscheZarathustraAmorFatiResult | null;
  seosanHyujeongSeongaGwigamResult?: SeosanHyujeongSeongaGwigamResult | null;
  jungIndividuationArchetypeResult?: JungIndividuationArchetypeResult | null;
  hegelDialecticalAufhebenResult?: HegelDialecticalAufhebenResult | null;
  dasanMokminSimseoResult?: DasanMokminSimseoResult | null;
  augustineConfessionesIlluminatioResult?: AugustineConfessionesIlluminatioResult | null;
  machiavelliVirtuFortunaResult?: MachiavelliVirtuFortunaResult | null;
  choeChiwonPungryudoResult?: ChoeChiwonPungryudoResult | null;
  thomasAquinasSummaTheologiaeResult?: ThomasAquinasSummaTheologiaeResult | null;
  francisBaconNovumOrganumResult?: FrancisBaconNovumOrganumResult | null;
  ryuSeongryongJingbirokResult?: RyuSeongryongJingbirokResult | null;
  kingSejongHunminjeongeumAeminResult?: KingSejongHunminjeongeumAeminResult | null;
  jangBogoCheonghaejinMaritimePioneerResult?: JangBogoCheonghaejinMaritimePioneerResult | null;
  johnStuartMillOnLibertyIndividualityResult?: JohnStuartMillOnLibertyIndividualityResult | null;
  frenchJeanJacquesRousseauNatureAuthenticityResult?: JeanJacquesRousseauNatureAuthenticityResult | null;
  germanJohannWolfgangGoetheFaustStrivingResult?: JohannWolfgangGoetheFaustStrivingResult | null;
  italianDanteAlighieriDivineComedyAscentResult?: DanteAlighieriDivineComedyAscentResult | null;
  marcusAureliusMeditationsCitadelResult?: MarcusAureliusMeditationsCitadelResult | null;
  suunChoeJeuDonghakSicheonjuResult?: SuunChoeJeuDonghakSicheonjuResult | null;
  ralphWaldoEmersonSelfRelianceResult?: RalphWaldoEmersonSelfRelianceResult | null;

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
  focusTools?: string[];
  coreOnly?: boolean;
  reviewAll?: boolean;
}): DeterministicEngineReport {
  const supplementExecutions: Record<string, 'returned' | 'error' | 'skipped'> = {};
  function calculateSupplement<T>(key: string, calculate: () => T): T | null {
    if ((params.coreOnly && !params.reviewAll) || (params.reviewAll && !solarDateStr)) {
      supplementExecutions[key] = 'skipped';
      return null;
    }
    try {
      const result = calculate();
      supplementExecutions[key] = result == null ? 'skipped' : 'returned';
      return result;
    } catch { supplementExecutions[key] = 'error'; return null; }
  }
  const now = new Date();
  const nowKst = new Date(now.getTime() + 9 * 3600000);
  const nowKstIso = nowKst.toISOString().replace('Z', '+09:00');
  const nowUtcIso = now.toISOString();

  const profile = params.profile;
  const partnerProfile = params.partnerProfile;
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
  if (params.focusTools?.length && !params.focusTools.includes('saju')) {
sajuEnvelope = {toolId:'saju', toolKoName:'사주명리', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 2. 서양 점성술 엔진 (astronomy-engine 기반 천문 물리 좌표 계산)
  let astroEnvelope: ToolCalculationEnvelope<Partial<NatalChartResult>>;
  if (params.focusTools?.length && !params.focusTools.includes('astrology')) {
astroEnvelope = {toolId:'astrology', toolKoName:'서양 점성술', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 3. 자미두수 엔진 (iztro 2.6.3 12궁 명반 배치)
  let ziweiEnvelope: ToolCalculationEnvelope<unknown>;
  if (params.focusTools?.length && !params.focusTools.includes('ziwei')) {
ziweiEnvelope = {toolId:'ziwei', toolKoName:'자미두수', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 4. 숙요경 (27숙 본명숙 계산)
  let sukuyoEnvelope: ToolCalculationEnvelope<unknown>;
  if (params.coreOnly && !params.reviewAll && (!params.focusTools?.length || params.focusTools.includes('sukuyo'))) {
sukuyoEnvelope = {toolId:'sukuyo', toolKoName:'숙요경', status:'symbolic', note:'계산 기준 재검토 중 — 수치 근거에서 제외하고 상징적 참고로만 사용'};
} else if (params.focusTools?.length && !params.focusTools.includes('sukuyo')) {
sukuyoEnvelope = {toolId:'sukuyo', toolKoName:'숙요경', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 5. 베딕 점성술 (Vedic Jyotish, J2000 Lahiri 항성황도 & 빔쇼타리 다샤)
  // 정통 27 나크샤트라 & 120년 빔쇼타리 다샤 확장 수리 (생시 없으면 정오 기준 null-safe)
  const vedicAdvancedResult = params.focusTools?.length && !params.focusTools.includes('vedic') ? null : (() => {
    try {
      return calculateVedicAdvanced({ profile });
    } catch (_) {
      return null;
    }
  })();
  let vedicEnvelope: ToolCalculationEnvelope<unknown>;
  if (params.focusTools?.length && !params.focusTools.includes('vedic')) {
vedicEnvelope = {toolId:'vedic', toolKoName:'베딕 점성술', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 6. 마하보테 (미얀마 7궁 명반 및 8요일 성좌 엔진)
  let mahaboteEnvelope: ToolCalculationEnvelope<MahaboteResult>;
  let mahaboteResult: MahaboteResult | null = null;
  if (params.coreOnly && !params.reviewAll && (!params.focusTools?.length || params.focusTools.includes('mahabote'))) {
mahaboteEnvelope = {toolId:'mahabote', toolKoName:'마하보테', status:'symbolic', note:'계산 기준 재검토 중 — 수치 근거에서 제외하고 상징적 참고로만 사용'};
} else if (params.focusTools?.length && !params.focusTools.includes('mahabote')) {
mahaboteEnvelope = {toolId:'mahabote', toolKoName:'마하보테', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 7. 구성학 (九星氣學 - 입춘 본명성·월명성·일성과 9궁 연·월·일반 포국, 길흉방위)
  let kyuseiEnvelope: ToolCalculationEnvelope<unknown>;
  if (params.focusTools?.length && !params.focusTools.includes('kyusei')) {
kyuseiEnvelope = {toolId:'kyusei', toolKoName:'구성학', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 8. 태국 점성술 (정통 호라삿 8요일 · 마하탁사 대운 · 4원소 신체 활력 엔진)
  let thaiEnvelope: ToolCalculationEnvelope<ThaiHorasatResult>;
  let thaiHorasatResult: ThaiHorasatResult | null = null;
  if (params.focusTools?.length && !params.focusTools.includes('thai_astrology')) {
thaiEnvelope = {toolId:'thai_astrology', toolKoName:'태국점성술', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 9. 주역 (周易) - 64괘 384효 4대 대칭 괘상 및 체용 결단 마스터 엔진
  let ichingEnvelope: ToolCalculationEnvelope<unknown>;
  let ichingMasterResult: IchingMasterResult | null = null;
  if (params.focusTools?.length && !params.focusTools.includes('iching')) {
ichingEnvelope = {toolId:'iching', toolKoName:'주역', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 10. 대육임 (大六壬) - 점시 기준 사과·삼전·12천장 결단 마스터 엔진
  let liurenEnvelope: ToolCalculationEnvelope<unknown>;
  let liurenMasterResult: LiurenMasterResult | null = null;
  if (params.focusTools?.length && !params.focusTools.includes('liuren')) {
liurenEnvelope = {toolId:'liuren', toolKoName:'육임', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 11. 기문둔갑 (奇門遁甲) - 조선 정통 홍국기문 4주 9궁 수리 포국 엔진 + 차보법(拆補) 점시 포국
  //     생년월일이 있으면 홍국기문 수리 포국(세효·응효·중궁·삼형·통기·팔문)이 계산되어 바인딩되고,
  //     점시 기반 차보법 포국은 전략/결단 질문일 때 보조로 병행된다.
  let qimenEnvelope: ToolCalculationEnvelope<unknown>;
  let honggukQimenResult: HonggukQimenResult | null = null;
  if (!params.coreOnly && (!params.focusTools?.length || params.focusTools.includes('qimen'))) {
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
  }
  const honggukCalculated = !params.coreOnly && honggukQimenResult?.status === 'calculated';
  if (params.focusTools?.length && !params.focusTools.includes('qimen')) {
qimenEnvelope = {toolId:'qimen', toolKoName:'홍국기문/기문둔갑', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
try {
    if (isDivinationQuery) {
      const qimenRes = calculateQimen(now);
      const data: Record<string, unknown> = {};
      if (honggukCalculated) data.honggukQimen = honggukQimenResult;
      data.chabopPointChart = qimenRes;
      qimenEnvelope = {
        toolId: 'qimen',
        toolKoName: params.coreOnly ? '기문둔갑(점시)' : '홍국기문/기문둔갑',
        status: 'calculated',
        method: honggukCalculated ? HONGGUK_QIMEN_METHOD : qimenRes.method,
        data,
        limitations: honggukCalculated ? undefined : qimenRes.limitations
      };
    } else {
      qimenEnvelope = {
        toolId: 'qimen',
        toolKoName: params.coreOnly ? '기문둔갑(점시)' : '홍국기문/기문둔갑',
        status: honggukCalculated ? 'calculated' : 'skipped',
        method: honggukCalculated ? HONGGUK_QIMEN_METHOD : undefined,
        data: honggukCalculated ? { honggukQimen: honggukQimenResult } : undefined,
        note: honggukCalculated ? '생년월일 프로필 기반 홍국기문 4주 9궁 수리 포국' : '전략/결단 질문 시 점시 포국이 실행되고, 생년월일 등록 시 홍국기문 수리 포국이 계산됩니다.'
      };
    }
  } catch (err: any) {
    qimenEnvelope = { toolId: 'qimen', toolKoName: '홍국기문/기문둔갑', status: 'error', note: err?.message || '기문둔갑 포국 실패' };
  }
}

  // 12. 타로 (78장 아르카나 수비학·원소 시나스트리 및 소울·퍼스널리티·연간 성장 카드 엔진)
  let tarotEnvelope: ToolCalculationEnvelope<unknown>;
  let tarotMasterResult: TarotMasterResult | null = null;
  if (!birthdateStr && (!params.focusTools?.length || params.focusTools.includes('tarot'))) {
    tarotEnvelope = { toolId: 'tarot', toolKoName: '타로 수비학', status: 'skipped', note: '생년월일 미입력으로 생일카드 계산 생략. 앱의 무작위 카드 추첨과는 별개입니다.' };
  } else if (params.focusTools?.length && !params.focusTools.includes('tarot')) {
tarotEnvelope = {toolId:'tarot', toolKoName:'타로', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 13. 카발라 (정통 생명나무 10 세피로트 · 3대 기둥 · 4개 세계 · 22 경로 & 생년월일 게마트리아 수리)
  let kabbalahEnvelope: ToolCalculationEnvelope<KabbalahResult>;
  let kabbalahResult: KabbalahResult | null = null;
  if (params.coreOnly && !params.reviewAll && (!params.focusTools?.length || params.focusTools.includes('kabbalah'))) {
kabbalahEnvelope = {toolId:'kabbalah', toolKoName:'카발라', status:'symbolic', note:'계산 기준 재검토 중 — 수치 근거에서 제외하고 상징적 참고로만 사용'};
} else if (params.focusTools?.length && !params.focusTools.includes('kabbalah')) {
kabbalahEnvelope = {toolId:'kabbalah', toolKoName:'카발라', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 14. 토정비결 (조선 정통 이지함 144괘문 수리 산법)
  let tojeongEnvelope: ToolCalculationEnvelope<unknown>;
  if (params.focusTools?.length && !params.focusTools.includes('tojeong')) {
tojeongEnvelope = {toolId:'tojeong', toolKoName:'토정비결', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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
}

  // 15. 태을신수 (태을 16궁 연국 적년 수리 산법 엔진)
  let taiyiEnvelope: ToolCalculationEnvelope<TaiyiResult>;
  let taiyiResult: TaiyiResult | null = null;
  if (params.focusTools?.length && !params.focusTools.includes('taiyi')) {
taiyiEnvelope = {toolId:'taiyi', toolKoName:'태을신수', status:'skipped', note:'이번 질문에서 선택하지 않은 도구'};
} else {
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

  const chronoTransitResult = calculateSupplement('chronoTransitResult', () => (calculateChronoTransit({ profile, targetDate: now })));
  const lifeSeasonTimingResult = calculateSupplement('lifeSeasonTimingResult', () => (calculateLifeSeasonTiming({ profile, targetYear: now.getFullYear() })));
  const energeticPrescriptionResult = calculateSupplement('energeticPrescriptionResult', () => (calculateEnergeticPrescription({ profile, currentDate: now })));
  const contextualSynastryResult = calculateSupplement('contextualSynastryResult', () => (calculateContextualSynastry({ questionText: question, myProfile: profile })));
  const instantDecisionResult = calculateSupplement('instantDecisionResult', () => (calculateInstantDecision({ instant: now, questionText: question })));
  const ziweiFlyingStarsResult = calculateSupplement('ziweiFlyingStarsResult', () => (calculateZiweiFlyingStars({ profile, targetYear: now.getFullYear() })));
  const specialStarsResult = calculateSupplement('specialStarsResult', () => (calculateSpecialStarsMatrix({ profile })));
  const monthlyFlowResult = calculateSupplement('monthlyFlowResult', () => (calculateMonthlyFlow({ profile, targetYear: now.getFullYear() })));
  const spatialFengshuiResult = calculateSupplement('spatialFengshuiResult', () => (calculateSpatialFengshui({ profile })));
  const vitalityCurveResult = calculateSupplement('vitalityCurveResult', () => (calculateVitalityCurve({ profile })));
  const tojeongResult = calculateSupplement('tojeongResult', () => (birthdateStr && profile
    ? (() => {
        try {
          const res = calculateTojeong({ profile, targetYear: now.getFullYear() });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null));
  const kyuseiResult = calculateSupplement('kyuseiResult', () => (birthdateStr && profile
    ? (() => {
        try {
          const res = calculateKyusei({ profile, targetDate: now });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null));
  const samjaeGyoUnResult = calculateSupplement('samjaeGyoUnResult', () => (birthdateStr && profile
    ? (() => {
        try {
          const res = calculateSamjaeGyoUn({ profile, targetYear: now.getFullYear() });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null));
  const auspiciousStarsResult = calculateSupplement('auspiciousStarsResult', () => (birthdateStr && profile
    ? (() => {
        try {
          const res = calculateAuspiciousStars({ profile, targetYear: now.getFullYear() });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null));
  // 16. 정통 격국 성격·파격 수리 판정 엔진 (자평진전 월령 사령·투간 수리)
  const geokgukResult = calculateSupplement('geokgukResult', () => (birthdateStr && profile
    ? (() => {
        try {
          const res = calculateGeokguk({ profile });
          return res.status === 'calculated' ? res : null;
        } catch (_) {
          return null;
        }
      })()
    : null));
  // 17. 천상열차분야지도 28수 일진·택일 엔진 (생년월일 무관 당일 일진 기준)
  const twentyEightMansionsResult = calculateSupplement('twentyEightMansionsResult', () => ((() => {
    try {
      return calculateTwentyEightMansions({ targetDate: now });
    } catch (_) {
      return null;
    }
  })()));
  // 18. 정통 밀교 숙요경 27숙 본명숙 & 6대 관계성 3거리 매트릭스 엔진
  const sukuyoAdvancedResult = calculateSupplement('sukuyoAdvancedResult', () => ((() => {
    try {
      return calculateSukuyoAdvanced({ profile });
    } catch (_) {
      return null;
    }
  })()));

  // 19. 5대 운명학 융합 궁합 마스터 엔진 (상대 프로필이 있을 때만 결정론 계산)
  const compatibilityResult = calculateSupplement('compatibilityResult', () => (params.partnerProfile && profile && birthdateStr
    ? (() => {
        try {
          return calculateDeterministicCompatibility(profile, params.partnerProfile);
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 19. 하락이수(河洛理數) 사주·주역 융합 선천괘·후천괘·원당효 엔진
  const heLuoLiShuResult = calculateSupplement('heLuoLiShuResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateHeLuoLiShu({ profile });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 20. 실시간 삼형·육충·파해 동적 트리거 엔진
  const dynamicClashResult = calculateSupplement('dynamicClashResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateDynamicClashTrigger({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 21. 사주 12신살(겁재천지년월망장반역육화) 완전 순환 엔진
  const twelveSpiritsResult = calculateSupplement('twelveSpiritsResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateTwelveSpiritsCycle({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 22. 피타고라스 4대 피너클 & 챌린지 생애 주기 엔진
  const pythagoreanLifecycleResult = calculateSupplement('pythagoreanLifecycleResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculatePythagoreanLifecycle({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 23. 점성술 36 데칸 & 사비안 심볼 360° 엔진
  const astrologicalDecanSabianResult = calculateSupplement('astrologicalDecanSabianResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateAstrologicalDecanSabian({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 24. 오행 한난조습 & 메디컬 점성술 바이오 매트릭스 엔진
  const medicalBioMatrixResult = calculateSupplement('medicalBioMatrixResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateMedicalBioMatrix({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 25. 재물·비즈니스 포춘 파이프라인 엔진
  const wealthPipelineResult = calculateSupplement('wealthPipelineResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateWealthPipeline({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 26. 카르믹 노드 & 영혼 진화 궤적 엔진
  const karmicNodesResult = calculateSupplement('karmicNodesResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateKarmicNodes({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 27. 위기 돌파 & 멘탈 리질리언스 지수 엔진
  const mentalResilienceResult = calculateSupplement('mentalResilienceResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateMentalResilience({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 28. 4대 귀인 & 인연 네트워크 시너지 엔진
  const nobleNetworkResult = calculateSupplement('nobleNetworkResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateNobleNetwork({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 29. 스피치 & 커뮤니케이션 페르소나 엔진
  const voicePersonaResult = calculateSupplement('voicePersonaResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateVoicePersona({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 30. 계약·분쟁 방어 & 관재구설 쉴드 엔진
  const contractShieldResult = calculateSupplement('contractShieldResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateContractShield({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 31. 라이프 12궁 밸런스 휠 엔진
  const lifeDomainWheelResult = calculateSupplement('lifeDomainWheelResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateLifeDomainWheel({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 32. 창작 아우라 & 딥워크 몰입 엔진
  const deepWorkFlowResult = calculateSupplement('deepWorkFlowResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateDeepWorkFlow({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 33. 수면 뇌파 & 무의식 직관 디코딩 엔진
  const sleepSubconsciousResult = calculateSupplement('sleepSubconsciousResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSleepSubconscious({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 34. 퀀텀 점프 & 승부수 모멘텀 타이밍 엔진
  const quantumLeapResult = calculateSupplement('quantumLeapResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateQuantumLeapTiming({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 35. 오행 생극 공명 & 순환 루프 증폭 엔진
  const elementalResonanceResult = calculateSupplement('elementalResonanceResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateElementalResonance({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 36. 음양 극성 밸런스 & 바이폴라 리듬 엔진
  const yinYangPolarityResult = calculateSupplement('yinYangPolarityResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateYinYangPolarity({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 37. 고대 노르딕 룬 동시성 매트릭스 엔진
  const runeMatrixResult = calculateSupplement('runeMatrixResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateRuneMatrix({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 38. 영혼의 타로 여정 & 4원소 연금술 엔진
  const soulJourneyTarotResult = calculateSupplement('soulJourneyTarotResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSoulJourneyTarot({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 39. 초월 명상 & 브레인웨이브 동조 엔진
  const transcendentalMeditationResult = calculateSupplement('transcendentalMeditationResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateTranscendentalMeditation({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 40. 전략적 협상 & 손자병법 기문 레버리지 엔진
  const strategicLeverageResult = calculateSupplement('strategicLeverageResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateStrategicLeverage({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 41. 융 심리학 그림자 자아 & 골든 섀도우 연금술 엔진
  const shadowArchetypeResult = calculateSupplement('shadowArchetypeResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateShadowArchetype({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 42. 3대 생체 바이오리듬 & 크로노타입 황금 피크 엔진
  const biorhythmPeakFlowResult = calculateSupplement('biorhythmPeakFlowResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateBiorhythmPeakFlow({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 43. 다차원 운명 공명 에코 & 카르마적 인연 중력 엔진
  const destinySynastryEchoResult = calculateSupplement('destinySynastryEchoResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateDestinySynastryEcho({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 44. 21일 카르마 리셋 & 오행 마이크로 해빗 엔진
  const microHabitKarmaResult = calculateSupplement('microHabitKarmaResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateMicroHabitKarma({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 45. 이키가이 천직 4대 교집합 & 소명 나침반 엔진
  const ikigaiDestinyCompassResult = calculateSupplement('ikigaiDestinyCompassResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateIkigaiDestinyCompass({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 46. 양자 동시성 & 세렌디피티 행운 가속 엔진
  const serendipitySynchronicityResult = calculateSupplement('serendipitySynchronicityResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSerendipitySynchronicity({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 47. 휴먼 디자인 9대 에너지 센터 & 바디그래프 오라 엔진
  const humanDesignBodyGraphResult = calculateSupplement('humanDesignBodyGraphResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateHumanDesignBodyGraph({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 48. 7대 차크라 파동 정렬 & 에너지 퀀텀 밸런싱 엔진
  const chakraVibrationAlignmentResult = calculateSupplement('chakraVibrationAlignmentResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateChakraVibrationAlignment({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 49. 에니어그램 영혼 성격 통합 & 의식 진화 엔진
  const enneagramSoulIntegrationResult = calculateSupplement('enneagramSoulIntegrationResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateEnneagramSoulIntegration({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 50. 조상 혈통 업력 & 후성유전학적 카르마 정화 엔진
  const ancestralEpigeneticKarmaResult = calculateSupplement('ancestralEpigeneticKarmaResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateAncestralEpigeneticKarma({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 51. 샤머니즘 파워 애니멀 & 12지지 스피릿 토템 가이드 엔진
  const shamanicAnimalTotemResult = calculateSupplement('shamanicAnimalTotemResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateShamanicAnimalTotem({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 52. 조셉 캠벨 영웅의 여정 12단계 & 운명 돌파 엔진
  const heroMythMonomythResult = calculateSupplement('heroMythMonomythResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateHeroMythMonomyth({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 53. 아카식 레코드 영혼 서약 & 카르믹 청사진 엔진
  const akashicRecordsOracleResult = calculateSupplement('akashicRecordsOracleResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateAkashicRecordsOracle({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 54. 양자 다중우주 타임라인 분기 & 퀀텀 점프 엔진
  const quantumProbabilisticTimelineResult = calculateSupplement('quantumProbabilisticTimelineResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateQuantumProbabilisticTimeline({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 55. 빌헬름 라이히 7대 신체 갑옷 해제 & 체성 감각 엔진
  const somaticBodyArmoringResult = calculateSupplement('somaticBodyArmoringResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSomaticBodyArmoring({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 56. 궁극의 영적 3위1체 마스터 지혜 엔진 (기적수업 × 초기불교 × 영지주의)
  const supremeWisdomTrinityResult = calculateSupplement('supremeWisdomTrinityResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSupremeWisdomTrinity({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 57. 황금비 영혼 수비학 & 보텍스 기하학 엔진
  const sacredVortexGeometryResult = calculateSupplement('sacredVortexGeometryResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSacredVortexGeometry({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 58. 도교 내단 양생 & 진기 순환 경락 시계 엔진
  const taoistNeidanMeridianResult = calculateSupplement('taoistNeidanMeridianResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateTaoistNeidanMeridian({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 59. 칼 융 동시성 징조 해독 & 오멘 매트릭스 엔진
  const synchronicityOmenResult = calculateSupplement('synchronicityOmenResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSynchronicityOmen({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 60. 솔페지오 주파수 사운드 힐링 & 뇌파 동조 엔진
  const solfeggioHarmonicResult = calculateSupplement('solfeggioHarmonicResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSolfeggioHarmonic({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 61. 에테르 오라 생체장 & 쉴딩 엔진
  const ethericAuraBiofieldResult = calculateSupplement('ethericAuraBiofieldResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateEthericAuraBiofield({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 62. 사주 정통 3대 원전(자평진전·궁통보감·적천수) 용신·조후·억부 심층 처방 엔진
  const sajuClassicYongshinResult = calculateSupplement('sajuClassicYongshinResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateSajuClassicYongshin({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 63. 타로 카발라 생명나무 22경로 & 섀도우 미러 심층 엔진
  const tarotTreeOfLifeShadowResult = calculateSupplement('tarotTreeOfLifeShadowResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateTarotTreeOfLifeShadow({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 64. 고대 헬레니즘 아라빅 랏 & 조디악 릴리싱 엔진
  const hellenisticLotsResult = calculateSupplement('hellenisticLotsResult', () => (birthdateStr && profile
    ? (() => {
        try {
          return calculateHellenisticLots({ profile, targetDate: now });
        } catch (_) {
          return null;
        }
      })()
    : null));

  // 65. 주역 384효 동효 & 착종복잡 4대 변괘 엔진
  const iching384YaoResult = calculateSupplement('iching384YaoResult', () => ((() => {
    try {
      return calculateIching384Yao({ profile, question, targetDate: now });
    } catch (_) {
      return null;
    }
  })()));

  // 66. 사주 12운성 포태법 & 4대 묘고지 개고 엔진
  const sajuTwelveStagesTombResult = calculateSupplement('sajuTwelveStagesTombResult', () => ((() => {
    try {
      return calculateSajuTwelveStagesTomb(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 67. 타로 4대 원소 & 16대 궁정 카드(Court Cards) 페르소나 엔진
  const tarotElementalCourtResult = calculateSupplement('tarotElementalCourtResult', () => ((() => {
    try {
      return calculateTarotElementalCourt(profile, question);
    } catch (_) {
      return null;
    }
  })()));

  // 68. 카르믹 시나스트리 & 인연 성간 공명 엔진
  const karmicSynastryResult = calculateSupplement('karmicSynastryResult', () => ((() => {
    try {
      return calculateKarmicSynastry(profile, partnerProfile, question);
    } catch (_) {
      return null;
    }
  })()));

  // 69. 오행 칠정(七情) 심신 맥파 & 기혈 조화 엔진
  const fiveEmotionsPulseResult = calculateSupplement('fiveEmotionsPulseResult', () => ((() => {
    try {
      return calculateFiveEmotionsPulse(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 70. 헤르메스 카이발리온 7대 우주 불변 법칙 진동 엔진
  const hermeticKybalionResult = calculateSupplement('hermeticKybalionResult', () => ((() => {
    try {
      return calculateHermeticKybalion(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 71. 고대 수비학 차크라 솔 울림 & 퍼스널 라이프 퀘스트 나침반 엔진
  const vibrationalSoulQuestResult = calculateSupplement('vibrationalSoulQuestResult', () => ((() => {
    try {
      return calculateVibrationalSoulQuest(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 72. 서양 정통 연금술 7단계 영혼 변환 & 심리적 승화 엔진
  const alchemicalTransmutationResult = calculateSupplement('alchemicalTransmutationResult', () => ((() => {
    try {
      return calculateAlchemicalTransmutation(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 73. 도교 자미두수 화기(化忌)·살성 정화 & 전화위복 해원 엔진
  const ziweiHuaJiResult = calculateSupplement('ziweiHuaJiResult', () => ((() => {
    try {
      return calculateZiweiHuaJiTransformation(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 74. 고대 켈트 오검(Ogham) 수목 신성 지혜 & 수호목 오라클 엔진
  const celticTreeOghamResult = calculateSupplement('celticTreeOghamResult', () => ((() => {
    try {
      return calculateCelticTreeOgham(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 75. 도교 내단학 삼보(정·기·신) 생체 에너지 순환 & 연정화기 엔진
  const taoistSanbaoResult = calculateSupplement('taoistSanbaoResult', () => ((() => {
    try {
      return calculateTaoistSanbaoInnerAlchemy(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 76. 티베트 불교 바르도 6대 환생 상태 & 전환기 의식 항해 엔진
  const tibetanBardoResult = calculateSupplement('tibetanBardoResult', () => ((() => {
    try {
      return calculateTibetanBardoNavigation(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 77. 고대 메소포타미아 7대 행성 관문 & 이슈타르 지하세계 하강·부활 엔진
  const mesopotamianSevenGatesResult = calculateSupplement('mesopotamianSevenGatesResult', () => ((() => {
    try {
      return calculateMesopotamianSevenGates(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 78. 고대 이집트 36 데칸 별자리 수호신 & 누트 천구 항해 엔진
  const egyptianDecansResult = calculateSupplement('egyptianDecansResult', () => ((() => {
    try {
      return calculateEgyptianThirtySixDecans({ profile, targetDate: now });
    } catch (_) {
      return null;
    }
  })()));

  // 79. 정통 수피즘 심장의 7대 라타이프 영혼 정화 & 미크라즈 상승 엔진
  const sufiLataifResult = calculateSupplement('sufiLataifResult', () => ((() => {
    try {
      return calculateSufiLataifSoulAscension({ profile, targetDate: now });
    } catch (_) {
      return null;
    }
  })()));

  // 80. 고대 마야 촐킨 260일 신성력 20 나왈 & 13 은하 톤 엔진
  const mayanTzolkinResult = calculateSupplement('mayanTzolkinResult', () => ((() => {
    try {
      return calculateMayanTzolkinSacredCalendar({ profile, targetDate: now });
    } catch (_) {
      return null;
    }
  })()));

  // 81. 북유럽 24 엘더 푸사르크 룬 문자 & 노른 운명 직조 엔진
  const nordicRunesResult = calculateSupplement('nordicRunesResult', () => ((() => {
    try {
      return calculateNordicElderFutharkRunes({ profile, targetDate: now });
    } catch (_) {
      return null;
    }
  })()));

  // 82. 고대 그리스 델포이 아폴론 신탁 & 147 델포이 잠언 신성 지혜 엔진
  const delphicMaximsResult = calculateSupplement('delphicMaximsResult', () => ((() => {
    try {
      return calculateDelphicMaximsOracle({ profile, targetDate: now });
    } catch (_) {
      return null;
    }
  })()));

  // 83. 인도 정통 아유르베다 3대 도샤(트리도샤) 체질 & 프라나 생명력 엔진
  const ayurvedicTridoshaResult = calculateSupplement('ayurvedicTridoshaResult', () => ((() => {
    try {
      return calculateAyurvedicTridoshaPrana({ profile, targetDate: now });
    } catch (_) {
      return null;
    }
  })()));

  // 84. 고대 하와이 호오포노포노 & 후나 7대 원리 치유 나침반 엔진
  const hawaiianHunaResult = calculateSupplement('hawaiianHunaResult', () => ((() => {
    try {
      return calculateHawaiianHunaHooponopono({ profile, contextText: question });
    } catch (_) {
      return null;
    }
  })()));

  // 85. 동양 정통 풍수 8택(八宅) 공간 에너지 & 24방위 길흉 엔진
  const fengShuiEightMansionsResult = calculateSupplement('fengShuiEightMansionsResult', () => ((() => {
    try {
      return calculateFengShuiEightMansions({ profile, contextText: question });
    } catch (_) {
      return null;
    }
  })()));

  // 86. 고대 조로아스터교 아샤(Asha) 신성 우주 질서 & 3대 선행 진실 엔진
  const zoroastrianAshaResult = calculateSupplement('zoroastrianAshaResult', () => ((() => {
    try {
      return calculateZoroastrianAshaTruth({ profile, contextText: question });
    } catch (_) {
      return null;
    }
  })()));

  // 87. 힌두 탄트라 쿤달리니 7대 차크라 나디 프라나야마 각성 엔진
  const hinduKundaliniResult = calculateSupplement('hinduKundaliniResult', () => ((() => {
    try {
      return calculateHinduTantricKundalini({ profile, contextText: question });
    } catch (_) {
      return null;
    }
  })()));

  // 88. 고대 중국 귀곡자(鬼谷子) 양구령(兩頭鉗) 72변화 명리 결단 엔진
  const guiguziLiangtouqianResult = calculateSupplement('guiguziLiangtouqianResult', () => ((() => {
    try {
      return calculateGuiguziLiangtouqian({ profile, contextText: question });
    } catch (_) {
      return null;
    }
  })()));

  // 89. 고대 슬라브 베다 신화 16 스바로그 체계 & 로드(Rod) 영혼 가계 카르마 엔진
  const slavicSvarogResult = calculateSupplement('slavicSvarogResult', () => ((() => {
    try {
      return calculateSlavicSvarogCircle({ profile, contextText: question });
    } catch (_) {
      return null;
    }
  })()));

  // 90. 고대 에세네파 14대 천사 교감 & 영혼 생명나무 조화 엔진
  const esseneCommunionResult = calculateSupplement('esseneCommunionResult', () => ((() => {
    try {
      return calculateEsseneCommunion(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 91. 황제명리(黃帝命理) & 오운육기(五運六氣) 천기대운 기상의학 엔진
  const huangdiFiveMovementsSixQiResult = calculateSupplement('huangdiFiveMovementsSixQiResult', () => ((() => {
    try {
      return calculateHuangdiFiveMovementsSixQi(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 92. 피타고라스 테트락티스(Tetraktys) 10대 신성기하 & 게마트리아 조화 엔진
  const pythagoreanTetraktysResult = calculateSupplement('pythagoreanTetraktysResult', () => ((() => {
    try {
      return calculatePythagoreanTetraktys(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 93. 고대 바빌로니아 에누마 엘리쉬 & 운명의 서판 천체 엔진
  const babylonianEnumaElishResult = calculateSupplement('babylonianEnumaElishResult', () => ((() => {
    try {
      return calculateBabylonianEnumaElish(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 94. 도교 상청파 황정경(黃庭經) 신체 오장 신성좌 & 존사(存思) 내경 엔진
  const taoistHuangtingJingResult = calculateSupplement('taoistHuangtingJingResult', () => ((() => {
    try {
      return calculateTaoistHuangtingJing(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 95. 고대 페르시아 바르숨(Baresman) & 6대 아메샤 스펜타 조화 엔진
  const persianAmeshaSpentaResult = calculateSupplement('persianAmeshaSpentaResult', () => ((() => {
    try {
      return calculatePersianAmeshaSpenta(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 96. 고대 수메르 에리두 창세력 & 50대 메(Me) 신성 문명 규범 엔진
  const sumerianFiftyMesResult = calculateSupplement('sumerianFiftyMesResult', () => ((() => {
    try {
      return calculateSumerianFiftyMes(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 97. 도교 종려권·여동빈 종여내단(鍾呂內丹) 3품 선도 & 환원 엔진
  const zhongLuAlchemyResult = calculateSupplement('zhongLuAlchemyResult', () => ((() => {
    try {
      return calculateZhongLuInnerAlchemy(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 98. 켈트 드루이드 13대 달나무(Moon Trees) & 오검 주술 엔진
  const druidMoonTreesResult = calculateSupplement('druidMoonTreesResult', () => ((() => {
    try {
      return calculateDruidMoonTrees(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 99. 고대 중국 철판신수(鐵板神數) 천기운명 조식 & 태현수비학 엔진
  const tiebanShenshuResult = calculateSupplement('tiebanShenshuResult', () => ((() => {
    try {
      return calculateTiebanShenshu(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 100. 티베트 정통 본교(Bon) 카르마 9승 & 5대 영혼 수호 융드룽 엔진
  const tibetanBonResult = calculateSupplement('tibetanBonResult', () => ((() => {
    try {
      return calculateTibetanBonNineWays(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 101. 고대 그리스 엘레우시스 신비주의(Eleusinian Mysteries) 영혼 입사의례 & 페르세포네 환원 엔진
  const eleusinianMysteriesResult = calculateSupplement('eleusinianMysteriesResult', () => ((() => {
    try {
      return calculateEleusinianMysteries(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 102. 인도 베다 27나크샤트라 & 108파다(Pada) 카르마 성좌 정밀 엔진
  const vedicNakshatra108PadaResult = calculateSupplement('vedicNakshatra108PadaResult', () => ((() => {
    try {
      return calculateVedicNakshatra108Pada(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 103. 고대 이집트 헤르메스 카르투슈 & 영혼 3위일체 오라클 엔진
  const egyptianHermeticCartoucheResult = calculateSupplement('egyptianHermeticCartoucheResult', () => ((() => {
    try {
      return calculateEgyptianHermeticCartouche(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 104. 도교 태상감응편 & 공과격 선악 카르마 적선개운 엔진
  const taoistGongGuoGeKarmaResult = calculateSupplement('taoistGongGuoGeKarmaResult', () => ((() => {
    try {
      return calculateTaoistGongGuoGeKarma(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 105. 서아프리카 요루바 이파(Ifá) 16 오두 & 오룬밀라 운명의 지혜 엔진
  const yorubaIfaOduResult = calculateSupplement('yorubaIfaOduResult', () => ((() => {
    try {
      return calculateYorubaIfaOdu({ profile, targetDate: now, question });
    } catch (_) {
      return null;
    }
  })()));

  // 106. 고대 아랍 일무 알-람말(‘Ilm al-Raml) 16 형상 & 지오맨시(Geomancy) 지혜 엔진
  const arabicIlmAlRamlResult = calculateSupplement('arabicIlmAlRamlResult', () => ((() => {
    try {
      return calculateArabicIlmAlRaml({ profile, targetDate: now, question });
    } catch (_) {
      return null;
    }
  })()));

  // 107. 남인도 정통 나디 점성술(Nadi Astrology) & 아가스티야 야자잎 14 칸담 카르마 신탁 엔진
  const hinduNadiAgastyaPalmLeafResult = calculateSupplement('hinduNadiAgastyaPalmLeafResult', () => ((() => {
    try {
      return calculateHinduNadiAgastyaPalmLeaf({ profile, targetDate: now, question });
    } catch (_) {
      return null;
    }
  })()));

  // 108. 고대 일본 신도 고토다마 50음령 & 4혼1생 영혼 조화 엔진
  const shintoKotodamaFourSoulsResult = calculateSupplement('shintoKotodamaFourSoulsResult', () => ((() => {
    try {
      return calculateShintoKotodama({ profile, targetInstantTime: now.toISOString() });
    } catch (_) {
      return null;
    }
  })()));

  // 109. 호주 원주민 드림타임(Dreamtime) 송라인 & 8대 토템 영혼 나침반 엔진
  const aboriginalDreamtimeSonglinesResult = calculateSupplement('aboriginalDreamtimeSonglinesResult', () => ((() => {
    try {
      return calculateAboriginalDreamtimeSonglines({ profile, targetInstantTime: now.toISOString() });
    } catch (_) {
      return null;
    }
  })()));

  // 110. 고대 핀란드 칼레발라(Kalevala) 삼포(Sampo) 9대 룬가 번영 엔진
  const finnishKalevalaSampoResult = calculateSupplement('finnishKalevalaSampoResult', () => ((() => {
    try {
      return calculateFinnishKalevalaSampo({ profile, targetInstantTime: now.toISOString() });
    } catch (_) {
      return null;
    }
  })()));

  // 111. 고대 동양 산해경(山海經) 8방위 신성 영수(神獸) & 오행 방호 나침반 엔진
  const shanhaijingSacredBeastsResult = calculateSupplement('shanhaijingSacredBeastsResult', () => ((() => {
    try {
      return calculateShanhaijingSacredBeasts({ profile, targetInstantTime: now.toISOString() });
    } catch (_) {
      return null;
    }
  })()));

  // 112. 고대 인도 자이나교(Jainism) 14 군아스타나 & 삼보(Ratnatraya) 카르마 엔진
  const jainGunasthanaKarmaResult = calculateSupplement('jainGunasthanaKarmaResult', () => ((() => {
    try {
      return calculateJainGunasthanaKarma({ profile, targetInstantTime: now.toISOString() });
    } catch (_) {
      return null;
    }
  })()));

  // 113. 고대 켈트 바드 탈리에신(Taliesin) 가마솥 & 아웬(Awen) 영감 엔진
  const celticAwenTaliesinResult = calculateSupplement('celticAwenTaliesinResult', () => ((() => {
    try {
      return calculateCelticAwenTaliesin({ profile, targetInstantTime: now.toISOString() });
    } catch (_) {
      return null;
    }
  })()));

  // 114. 고대 한국 삼국유사 단군 천부인(天符印) 3보 & 홍익인간 광명 엔진
  const koreanDangunCheonbuinResult = calculateSupplement('koreanDangunCheonbuinResult', () => ((() => {
    try {
      return calculateKoreanDangunCheonbuin({ profile, question });
    } catch (_) {
      return null;
    }
  })()));

  // 115. 고대 마오리 하우오라 4대 기둥 & 마우리(Mauri) 생명력 영혼 수호 엔진
  const maoriMauriHauoraResult = calculateSupplement('maoriMauriHauoraResult', () => ((() => {
    try {
      return calculateMaoriMauriHauora({ profile, question });
    } catch (_) {
      return null;
    }
  })()));

  // 116. 고대 슬라브 모코시(Mokosh) 운명의 실타래 & 대지 모성 직관 엔진
  const slavicMokoshFateWeavingResult = calculateSupplement('slavicMokoshFateWeavingResult', () => ((() => {
    try {
      return calculateSlavicMokoshFateWeaving({ profile, question });
    } catch (_) {
      return null;
    }
  })()));

  // 117. 고대 메소포타미아 길가메시 서사시 12관문 불멸 여정 엔진
  const sumerianGilgameshTrialsResult = calculateSupplement('sumerianGilgameshTrialsResult', () => ((() => {
    try {
      return calculateSumerianGilgameshTrials({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 118. 고대 하와이 카후나 3대 자아 & 마나 공명 엔진
  const hawaiianKahunaThreeSelvesResult = calculateSupplement('hawaiianKahunaThreeSelvesResult', () => ((() => {
    try {
      return calculateHawaiianKahunaThreeSelves({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 119. 고대 북유럽 세계수 위그드라실(Yggdrasil) 9대 영역 엔진
  const nordicYggdrasilRealmsResult = calculateSupplement('nordicYggdrasilRealmsResult', () => ((() => {
    try {
      return calculateNordicYggdrasilRealms({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 120. 고대 이집트 마아트(Ma'at) 진리의 깃털 & 심장 무게 측정 엔진
  const egyptianMaatFeatherHeartResult = calculateSupplement('egyptianMaatFeatherHeartResult', () => ((() => {
    try {
      return calculateEgyptianMaatFeatherHeart({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 121. 고대 페르시아 미트라(Mithra) 7대 행성 입문 천계 사다리 엔진
  const persianMithraicSpheresResult = calculateSupplement('persianMithraicSpheresResult', () => ((() => {
    try {
      return calculatePersianMithraicSpheres({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 122. 고대 그리스 오르페우스 신비주의 & 므네모시네 기억의 샘 엔진
  const orpheicMysteriesResult = calculateSupplement('orpheicMysteriesResult', () => ((() => {
    try {
      return calculateOrpheicMysteries({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 123. 고대 마야 포폴 부(Popol Vuh) 쌍둥이 영웅 & 시발바 시련 돌파 엔진
  const popolVuhHeroTwinsResult = calculateSupplement('popolVuhHeroTwinsResult', () => ((() => {
    try {
      return calculatePopolVuhHeroTwins({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 124. 고대 중국 주역 대연지수(大衍之數) 49책 시초점 확률 수리 엔진
  const ancientYarrowProbabilityResult = calculateSupplement('ancientYarrowProbabilityResult', () => ((() => {
    try {
      return calculateAncientYarrowProbability({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 125. 고대 인도 베단타 5대 코샤(Pancha Kosha) 층위별 정렬 & 아트만 해방 엔진
  const vedicPanchaKoshaResult = calculateSupplement('vedicPanchaKoshaResult', () => ((() => {
    try {
      return calculateVedicPanchaKosha({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 126. 고대 로마 야누스(Janus) 2대 얼굴 시공간 문턱 & 새출발 돌파 엔진
  const romanJanusResult = calculateSupplement('romanJanusResult', () => ((() => {
    try {
      return calculateRomanJanus({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 127. 고대 동양 도교 포박자(抱朴子) 갈홍 내편 구전환단(九轉還丹) 무병장수 선도 엔진
  const baopuziElixirsResult = calculateSupplement('baopuziElixirsResult', () => ((() => {
    try {
      return calculateBaopuziElixirs({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 128. 고대 인도 베다 우파니샤드 4대 마하바키야(Mahāvākya) 대선언 의식 각성 엔진
  const vedicMahavakyaResult = calculateSupplement('vedicMahavakyaResult', () => ((() => {
    try {
      return calculateVedicMahavakya({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 129. 고대 수메르 에리두 엔키(Enki) 7대 압갈루(Apkallu) 현자 & 신성 지혜 엔진
  const sumerianApkalluWisdomResult = calculateSupplement('sumerianApkalluWisdomResult', () => ((() => {
    try {
      return calculateSumerianApkalluWisdom({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 130. 고대 아일랜드 켈트 투아하 데 다난(Tuatha Dé Danann) 4대 보물 & 영웅 운명 엔진
  const celticTuathaFourTreasuresResult = calculateSupplement('celticTuathaFourTreasuresResult', () => ((() => {
    try {
      return calculateCelticTuathaFourTreasures({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 131. 고대 중국 도교 도홍경(陶弘景) 진고(眞誥) 상청파(上淸派) 24성도 & 존사(存思) 통령 엔진
  const taoistShangqingTwentyFourSpiritsResult = calculateSupplement('taoistShangqingTwentyFourSpiritsResult', () => ((() => {
    try {
      return calculateTaoistShangqingTwentyFourSpirits({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 132. 티베트 밀교 족첸(Dzogchen) 릭파(Rigpa) 본각 & 포와(Phowa) 의식 전이 & 5대 지혜 무지개체(Jalü) 정렬 엔진
  const tibetanPhowaRainbowBodyResult = calculateSupplement('tibetanPhowaRainbowBodyResult', () => ((() => {
    try {
      return calculateTibetanPhowaRainbowBody({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 133. 고대 그리스 피타고라스 천구의 조화(Musica Universalis) & 테트라코드 7대 행성 주파수 공명 엔진
  const pythagoreanHarmoniaSpheresResult = calculateSupplement('pythagoreanHarmoniaSpheresResult', () => ((() => {
    try {
      return calculatePythagoreanHarmoniaSpheres({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 134. 송대 소강절 선생의 매화역수(梅花易數) 심역(心易) 선천 작괘 & 체용생극(體用生克) 5대 동태 진단 엔진
  const plumBlossomMeihuaOracleResult = calculateSupplement('plumBlossomMeihuaOracleResult', () => ((() => {
    try {
      return calculatePlumBlossomMeihuaOracle({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 135. 고대 그리스 델포이 삼여신 모이라이(Moirai) 운명의 실타래 & 아낭케(Ananke) 필연 엔진
  const greekMoiraiAnankeFateResult = calculateSupplement('greekMoiraiAnankeFateResult', () => ((() => {
    try {
      return calculateGreekMoiraiAnankeFate({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 136. 고대 이집트 투트모세 4세 스핑크스 영혼 꿈신탁 & 태양신 레-호라크티 엔진
  const egyptianSphinxDreamOracleResult = calculateSupplement('egyptianSphinxDreamOracleResult', () => ((() => {
    try {
      return calculateEgyptianSphinxDreamOracle({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 137. 고대 메소포타미아 칼데아 12조디악 원형 & 바빌로니아 물핀(MUL.APIN) 천문 신탁 엔진
  const chaldeanMulApinAstrologyResult = calculateSupplement('chaldeanMulApinAstrologyResult', () => ((() => {
    try {
      return calculateChaldeanMulApinAstrology({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 138. 고대 멕시코 톨텍 나구알리즘 4대 약속 & 꿈의 제2주의 엔진
  const toltecNagualDreamingResult = calculateSupplement('toltecNagualDreamingResult', () => ((() => {
    try {
      return calculateToltecNagualDreaming({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 139. 고대 일본 슈겐도(修驗道) 야마부시 10계수행 & 6근청정 산악영력 엔진
  const shugendoYamabushiTenRealmsResult = calculateSupplement('shugendoYamabushiTenRealmsResult', () => ((() => {
    try {
      return calculateShugendoYamabushiTenRealms({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 140. 고대 영지주의(Gnosticism) 피스티스 소피아 12에온 & 플레로마 영적 각성 엔진
  const gnosticPistisSophiaPleromaResult = calculateSupplement('gnosticPistisSophiaPleromaResult', () => ((() => {
    try {
      return calculateGnosticPistisSophiaPleroma({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 141. 고대 수메르 이난나(Inanna) 명계 하강 7대 관문 & 영혼 부활 엔진
  const sumerianInannaUnderworldDescentResult = calculateSupplement('sumerianInannaUnderworldDescentResult', () => ((() => {
    try {
      return calculateSumerianInannaUnderworldDescent({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 142. 고대 북유럽 볼바(Völva) 세이드(Seiðr) 직관 & 위그드라실 9대 세계 예언 엔진
  const norseVolvaSeidrNineRealmsResult = calculateSupplement('norseVolvaSeidrNineRealmsResult', () => ((() => {
    try {
      return calculateNorseVolvaSeidrNineRealms({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 143. 고대 중국 도가 장자(莊子) 소요유(逍遙遊) 붕정만리 & 제물론(齊物論) 호접몽 초월 엔진
  const zhuangziXiaoyaoyouButterflyResult = calculateSupplement('zhuangziXiaoyaoyouButterflyResult', () => ((() => {
    try {
      return calculateZhuangziXiaoyaoyouButterfly({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 144. 불교 유식학 8식 정화 & 아뢰야식 전식득지(轉識得智) 엔진
  const buddhistYogacaraConsciousnessResult = calculateSupplement('buddhistYogacaraConsciousnessResult', () => ((() => {
    try {
      return calculateBuddhistYogacaraConsciousness({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 145. 고대 인도 만두키야 우파니샤드 4대 의식 & 투리야(Turiya) 순수의식 엔진
  const vedicMandukyaTuriyaResult = calculateSupplement('vedicMandukyaTuriyaResult', () => ((() => {
    try {
      return calculateVedicMandukyaTuriya({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 146. 카발라 조하르(Zohar) 5대 영혼 층위 & 에인 소프 신성 상승 엔진
  const kabbalisticZoharSoulResult = calculateSupplement('kabbalisticZoharSoulResult', () => ((() => {
    try {
      return calculateKabbalisticZoharSoul({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 147. 고대 로마 스토아학파 세네카·에픽테토스 아파테이아 & 프로하이레시스 통제이분법 엔진
  const romanStoicProhairesisResult = calculateSupplement('romanStoicProhairesisResult', () => ((() => {
    try {
      return calculateRomanStoicProhairesis({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 148. 고대 인도 요가 파탄잘리 요가 수트라 8지칙 & 치타 브리티 니로다 삼매 청정 엔진
  const patanjaliAshtangaYogaResult = calculateSupplement('patanjaliAshtangaYogaResult', () => ((() => {
    try {
      return calculatePatanjaliAshtangaYoga({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 149. 고대 한국 신라 최치원 난랑비서 풍류도 현묘지도 & 화랑도 세속오계 엔진
  const koreanPungryudoHwarangResult = calculateSupplement('koreanPungryudoHwarangResult', () => ((() => {
    try {
      return calculateKoreanPungryudoHwarang({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 150. 페르시아 수피즘 아타르 7대 계곡 & 시무르그 신성 자아 엔진
  const persianAttarSevenValleysResult = calculateSupplement('persianAttarSevenValleysResult', () => ((() => {
    try {
      return calculatePersianAttarSevenValleys({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 151. 고대 헤르메스주의 포이만드레스 7대 천계 탈각 & 옥도아드 누스 각성 엔진
  const hermeticPoimandresResult = calculateSupplement('hermeticPoimandresResult', () => ((() => {
    try {
      return calculateHermeticPoimandres({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 152. 카슈미르 시바파 스판다 우주 맥동 & 프라티야비즈냐 본성 재인식 엔진
  const kashmirShaivismSpandaResult = calculateSupplement('kashmirShaivismSpandaResult', () => ((() => {
    try {
      return calculateKashmirShaivismSpanda({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 153. 고대 메소포타미아 바빌로니아 에누마 엘리시 마르두크 50대 이름 & 4대 바람 정복 엔진
  const sumerianEnumaElishFiftyNamesResult = calculateSupplement('sumerianEnumaElishFiftyNamesResult', () => ((() => {
    try {
      return calculateSumerianEnumaElishFiftyNames({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 154. 고대 그리스 알렉산드리아 헤르메스주의 36대 데칸 천상 성령 & 시간의 지배자 엔진
  const alexandrianDecanThirtySixGodsResult = calculateSupplement('alexandrianDecanThirtySixGodsResult', () => ((() => {
    try {
      return calculateAlexandrianDecanThirtySixGods({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 155. 고대 중국 도가 열자 어풍동행 & 무하유지향 진인 유유자적 엔진
  const taoistLieziWindRidingResult = calculateSupplement('taoistLieziWindRidingResult', () => ((() => {
    try {
      return calculateTaoistLieziWindRiding({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 156. 고대 인도 상키야 철학 25타트바 & 푸루샤-프라크리티 분별지 해탈 엔진
  const samkhyaTwentyFiveTattvasResult = calculateSupplement('samkhyaTwentyFiveTattvasResult', () => ((() => {
    try {
      return calculateSamkhyaTwentyFiveTattvas({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 157. 동양 유학 정통 성리학 사칠이기 & 거경궁리 주일무적 수양 엔진
  const neoConfucianFourSevenLiQiResult = calculateSupplement('neoConfucianFourSevenLiQiResult', () => ((() => {
    try {
      return calculateNeoConfucianFourSevenLiQi({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 158. 고대 에트루리아 16천궁 분할 & 로마 아우구르 조점 신탁 엔진
  const etruscanAugurSixteenSkyResult = calculateSupplement('etruscanAugurSixteenSkyResult', () => ((() => {
    try {
      return calculateEtruscanAugurSixteenSky({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 159. 로젠크로이츠 화학적 결혼 7일 연금술 영혼 승화 엔진
  const rosicrucianChymicalWeddingResult = calculateSupplement('rosicrucianChymicalWeddingResult', () => ((() => {
    try {
      return calculateRosicrucianChymicalWedding({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 160. 고대 아즈텍 토날포왈리 20대 일진 & 13대 주천신 신성 역법 엔진
  const aztecTonalamatlResult = calculateSupplement('aztecTonalamatlResult', () => ((() => {
    try {
      return calculateAztecTonalamatl({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 161. 몽골 텡그리즘 99 텡그리 & 히모리 풍마 영혼 공명 엔진
  const mongolianTengriHiimoriResult = calculateSupplement('mongolianTengriHiimoriResult', () => ((() => {
    try {
      return calculateMongolianTengriHiimori({ profile, question, now });
    } catch (_) {
      return null;
    }
  })()));

  // 162. 고대 게일 4대 화제 축제 및 휠 오브 더 이어 계절 순환 엔진
  const gaelicWheelFireFestivalsResult = calculateSupplement('gaelicWheelFireFestivalsResult', () => ((() => {
    try {
      return calculateGaelicWheelFireFestivals(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 163. 고대 노르웨이 고에다 하바말 오딘의 18대 게알드르 룬 비전 주문 엔진
  const norseHavamalEighteenGaldrResult = calculateSupplement('norseHavamalEighteenGaldrResult', () => ((() => {
    try {
      return calculateNorseHavamalEighteenGaldr(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 164. 안달루시아 수피즘 이븐 아라비 존재의 단일성 및 28대 예언자 심장 영지 엔진
  const ibnArabiWahdatAlWujudResult = calculateSupplement('ibnArabiWahdatAlWujudResult', () => ((() => {
    try {
      return calculateIbnArabiWahdatAlWujud(profile, now);
    } catch (_) {
      return null;
    }
  })()));

  // 165. 조선 비전 정감록 10승지 영맥·궁궁을을 지기 보신 피난처 엔진
  const chonggamnokTenSanctuariesResult = calculateSupplement('chonggamnokTenSanctuariesResult', () => ((() => {
    try {
      return calculateChonggamnokTenSanctuaries(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 166. 발리 힌두교 트리 히타 카라나(3대 우주 조화) 및 트리 카야 파리수다 3업 정화 엔진
  const balineseTriHitaKaranaResult = calculateSupplement('balineseTriHitaKaranaResult', () => ((() => {
    try {
      return calculateBalineseTriHitaKarana(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 167. 아메리카 호피족 4대 우주 시대 순환·카치나 정령 지혜·코양니스카시 치유 엔진
  const hopiFourWorldsKachinaResult = calculateSupplement('hopiFourWorldsKachinaResult', () => ((() => {
    try {
      return calculateHopiFourWorldsKachina(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 168. 동학 수운 최제우 시천주(侍天主) 주문 & 지기금지 인내천 천지조화 엔진
  const donghakCheondoismCheonjuResult = calculateSupplement('donghakCheondoismCheonjuResult', () => ((() => {
    try {
      return calculateDonghakCheondoismCheonju(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 169. 고대 잉카 안데스 코스몰로지 3대 세계·신성 영수·파차마마 아이니(Ayni) 호혜 조화 엔진
  const incaAndeanThreePachaAyniResult = calculateSupplement('incaAndeanThreePachaAyniResult', () => ((() => {
    try {
      return calculateIncaAndeanThreePachaAyni(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 170. 고대 은나라 상(商) 갑골문(甲骨文) 신탁 복사(卜辭) & 정인 4단계 신의 균열 엔진
  const shangOracleBoneDivinationResult = calculateSupplement('shangOracleBoneDivinationResult', () => ((() => {
    try {
      return calculateShangOracleBoneDivination(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 171. 한국 고대 단군 단학 천부경(天符經) 81자 우주 매트릭스 & 삼일신고 3진3망 성통광명 엔진
  const cheonbugyeongEightyOneResult = calculateSupplement('cheonbugyeongEightyOneResult', () => ((() => {
    try {
      return calculateKoreanCheonbugyeongEightyOne(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 172. 고대 인도 탄트라 스리 얀트라 9대 나바요니 교차 삼각형 & 바인두 9단계 아바라나 엔진
  const hinduSriYantraResult = calculateSupplement('hinduSriYantraResult', () => ((() => {
    try {
      return calculateHinduSriYantraSacredGeometry(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 173. 북미 원주민 라코타 수족 와칸 탕카 & 4대 방향 성스러운 의약 휠(Medicine Wheel) 엔진
  const lakotaMedicineWheelResult = calculateSupplement('lakotaMedicineWheelResult', () => ((() => {
    try {
      return calculateLakotaMedicineWheel(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 174. 조선 명종 격암 남사고 《격암유록》 45편 비결 & 계룡백석 궁궁을을 사중구생 엔진
  const gyeogamYurokResult = calculateSupplement('gyeogamYurokResult', () => ((() => {
    try {
      return calculateGyeogamYurokProphecy(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 175. 일본 헤이안 음양도 아베노 세이메이 《점사략》 12천장 수호령 & 식신 사역 엔진
  const heianOnmyodoSeimeiResult = calculateSupplement('heianOnmyodoSeimeiResult', () => ((() => {
    try {
      return calculateHeianOnmyodoSeimei(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 176. 고대 폴리네시아 마우이 《웨이파인딩 32방위 스타 컴퍼스》 & 호쿠레아 신성 인도 엔진
  const polynesianWayfindingResult = calculateSupplement('polynesianWayfindingResult', () => ((() => {
    try {
      return calculatePolynesianWayfinding(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 177. 신라 원효대사 《십문화쟁론》 일심이문 화쟁 & 원융회통 엔진
  const wonhyoHwajaengResult = calculateSupplement('wonhyoHwajaengResult', () => ((() => {
    try {
      return calculateWonhyoHwajaeng(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 178. 동양 비전 마의도사 《마의상법》 12궁 관상 & 심상합일 기색 엔진
  const mayiMianxiangResult = calculateSupplement('mayiMianxiangResult', () => ((() => {
    try {
      return calculateMayiMianxiang(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 179. 고대 이집트 《암두아트의 서》 12시간 태양신 라 밤의 저승 항해 & 케프리 부활 엔진
  const egyptianAmduatResult = calculateSupplement('egyptianAmduatResult', () => ((() => {
    try {
      return calculateEgyptianAmduat(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 180. 고대 켈트 드루이드 《브레혼 법전》 4대 우주정의 & 에릭 명예균형 엔진
  const celticDruidBrehonLawResult = calculateSupplement('celticDruidBrehonLawResult', () => ((() => {
    try {
      return calculateCelticBrehonLaw(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 181. 수메르 서기 니사바 청금석 서판 갈대첨필 천문수리 계측 엔진
  const mesopotamianNisabaResult = calculateSupplement('mesopotamianNisabaResult', () => ((() => {
    try {
      return calculateMesopotamianNisaba(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 182. 동학 수운 최제우 《용담유사》 검결 심기수련 & 삼경사상 신탁 엔진
  const suunGasiHeonResult = calculateSupplement('suunGasiHeonResult', () => ((() => {
    try {
      return calculateSuunGasiHeon(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 183. 고대 그리스 엘레우시스 밀의 트리프톨레모스 황금 날개 용 전차 & 농경 문명 전파 3대 율법 엔진
  const eleusinianTriptolemosResult = calculateSupplement('eleusinianTriptolemosResult', () => ((() => {
    try {
      return calculateEleusinianTriptolemos(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 184. 메소아메리카 믹스테크 영웅 군주 8-사슴 재규어 발톱 연맹 결성 & 260일 성력 통일 엔진
  const mixtecEightDeerResult = calculateSupplement('mixtecEightDeerResult', () => ((() => {
    try {
      return calculateMixtecEightDeer(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 185. 한국 근대 동학농민혁명 녹두장군 전봉준 《사발통문》 & 백산 창의 4대 강령 의기 결집 엔진
  const jeonBongjunNokduResult = calculateSupplement('jeonBongjunNokduResult', () => ((() => {
    try {
      return calculateJeonBongjunNokdu(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 186. 고대 메소포타미아 서사시 《아트라하시스》 지혜의 방주 & 절제·균형 회복 엔진
  const atrahasisFloodResult = calculateSupplement('atrahasisFloodResult', () => ((() => {
    try {
      return calculateAtrahasisFlood(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 187. 고대 북유럽 고에다 《위그드라실》 9대 우주계 & 3대 영천 소생 엔진
  const eddicYggdrasilResult = calculateSupplement('eddicYggdrasilResult', () => ((() => {
    try {
      return calculateEddicYggdrasil(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 188. 충무공 이순신 장군 친필 《난중일기》 필사즉생 전략 & 명량 대역전 결의 엔진
  const yiSunSinNanjungIlgiResult = calculateSupplement('yiSunSinNanjungIlgiResult', () => ((() => {
    try {
      return calculateYiSunSinNanjungIlgi(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 189. 고대 이집트 멤피스 신학 프타 심장 구상 & 말씀 선포 엔진
  const ptahMemphiteResult = calculateSupplement('ptahMemphiteResult', () => ((() => {
    try {
      return calculatePtahMemphite(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 190. 아일랜드 켈트 신화 루 라바다 8대 만능 기예 & 마그 투이레드 승전 엔진
  const lughSamildanachResult = calculateSupplement('lughSamildanachResult', () => ((() => {
    try {
      return calculateLughSamildanach(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 191. 외솔 최현배 선생 《우리말본》 & 한글 말글 자주권 문화 얼 계승 엔진
  const choeHyeonbaeGeulbonResult = calculateSupplement('choeHyeonbaeGeulbonResult', () => ((() => {
    try {
      return calculateChoeHyeonbaeGeulbon(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 192. 고대 페르시아 조로아스터교 6대 신성 불멸자 아메샤 스펜타 빛의 조화 엔진
  const zoroastrianAmeshaSpentasResult = calculateSupplement('zoroastrianAmeshaSpentasResult', () => ((() => {
    try {
      return calculateZoroastrianAmeshaSpentas(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 193. 고대 그리스 델포이 아폴론 신전 스파르타의 킬론 자기성찰 & 절제 엔진
  const delphicChilonResult = calculateSupplement('delphicChilonResult', () => ((() => {
    try {
      return calculateDelphicChilon(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 194. 다산 정약용 선생 《목민심서》 율기수신 & 애민청렴 공평무사 엔진
  const jeongYakyongMongminResult = calculateSupplement('jeongYakyongMongminResult', () => ((() => {
    try {
      return calculateJeongYakyongMongmin(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 195. 고대 그리스 에페소스 헤라클레이토스 만물유전 & 로고스 대립물 조화 엔진
  const heraclitusPantaRheiResult = calculateSupplement('heraclitusPantaRheiResult', () => ((() => {
    try {
      return calculateHeraclitusPantaRhei(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 196. 춘추전국시대 묵가 묵자 겸애교리 & 비공절용 실천 엔진
  const moziGyeomAeResult = calculateSupplement('moziGyeomAeResult', () => ((() => {
    try {
      return calculateMoziGyeomAe(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 197. 고대 로마 철학 황제 마르쿠스 아우렐리우스 명상록 내면의 성채 엔진
  const aureliusInnerCitadelResult = calculateSupplement('aureliusInnerCitadelResult', () => ((() => {
    try {
      return calculateAureliusInnerCitadel(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 198. 고대 중국 노자 《도덕경》 81장 상선약수 & 무위자연 엔진
  const laoziDaodejingResult = calculateSupplement('laoziDaodejingResult', () => ((() => {
    try {
      return calculateLaoziDaodejing(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 199. 고대 그리스 에피쿠로스 《테트라파르마코스》 4대치유약 영혼평정 아타락시아 엔진
  const epicureanTetrapharmakosResult = calculateSupplement('epicureanTetrapharmakosResult', () => ((() => {
    try {
      return calculateEpicureanTetrapharmakos(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 200. 조선 율곡 이이 선생 《격몽요결》 입지·혁구습·구용구사 수신실천 엔진
  const yulgokGyeokmongResult = calculateSupplement('yulgokGyeokmongResult', () => ((() => {
    try {
      return calculateYulgokGyeokmong(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 201. 고대 그리스 아리스토텔레스 니코마코스 윤리학 중용 & 에우다이모니아 엔진
  const aristotleMesotesResult = calculateSupplement('aristotleMesotesResult', () => ((() => {
    try {
      return calculateAristotleMesotes(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 202. 고대 인도 바가바드 기타 카르마 요가 & 무집착 행동 엔진
  const bhagavadGitaKarmaYogaResult = calculateSupplement('bhagavadGitaKarmaYogaResult', () => ((() => {
    try {
      return calculateBhagavadGitaKarmaYoga(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 203. 명나라 양명학 왕양명 전습록 치양지 & 지행합일 심학 엔진
  const wangYangmingXinxueResult = calculateSupplement('wangYangmingXinxueResult', () => ((() => {
    try {
      return calculateWangYangmingXinxue(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 204. 고대 그리스 소크라테스 산파술 & 다이몬 영혼성찰 엔진
  const socraticMaieuticDaimonResult = calculateSupplement('socraticMaieuticDaimonResult', () => ((() => {
    try {
      return calculateSocraticMaieuticDaimon(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 205. 고대 중국 맹자 사단사덕 & 호연지기 양기 엔진
  const menciusFourSproutsHoyeonResult = calculateSupplement('menciusFourSproutsHoyeonResult', () => ((() => {
    try {
      return calculateMenciusFourSproutsHoyeon(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 206. 고대 로마 세네카 인생의 짧음에 대하여 & 시간 주권 평정 엔진
  const senecaTimeSovereigntyResult = calculateSupplement('senecaTimeSovereigntyResult', () => ((() => {
    try {
      return calculateSenecaTimeSovereignty(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 207. 고대 그리스 플라톤 동굴의 비유 & 이데아 4대 추덕 사유 엔진
  const platonicIdeaCaveResult = calculateSupplement('platonicIdeaCaveResult', () => ((() => {
    try {
      return calculatePlatonicIdeaCave(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 208. 한국 조선 성리학 퇴계 이황 성학십도 경(敬) 철학 & 거경궁리 심법 엔진
  const toegyeSeonghakSipdoResult = calculateSupplement('toegyeSeonghakSipdoResult', () => ((() => {
    try {
      return calculateToegyeSeonghakSipdo(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 209. 고대 로마 키케로 의무론 도덕적 선(Honestum) & 유용성(Utile) 조화 처세 엔진
  const ciceroDeOfficiisResult = calculateSupplement('ciceroDeOfficiisResult', () => ((() => {
    try {
      return calculateCiceroDeOfficiis(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 210. 고대 그리스 로마 스토아학파 에픽테토스 엥케이리디온 통제이분법 & 프로하이레시스 도덕의지 엔진
  const epictetusDichotomyOfControlResult = calculateSupplement('epictetusDichotomyOfControlResult', () => ((() => {
    try {
      return calculateEpictetusDichotomyOfControl(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 211. 고대 동양 유학 공자 논어 지천명 & 극기복례 군자도 수양 엔진
  const confuciusAnalectsZhitianmingResult = calculateSupplement('confuciusAnalectsZhitianmingResult', () => ((() => {
    try {
      return calculateConfuciusAnalectsZhitianming(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 212. 근대 네덜란드 바루흐 스피노자 에티카 코나투스 & 신즉자연 영원의 상 관조 엔진
  const spinozaEthicaConatusResult = calculateSupplement('spinozaEthicaConatusResult', () => ((() => {
    try {
      return calculateBaruchSpinozaEthicaConatus(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 213. 독일 계몽주의 이마누엘 칸트 정언명령 & 목적의 왕국 자율성 도덕법칙 엔진
  const kantCategoricalImperativeResult = calculateSupplement('kantCategoricalImperativeResult', () => ((() => {
    try {
      return calculateKantCategoricalImperative(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 214. 고대 인도 우파니샤드 타트 트밤 아시 & 범아일여 순수의식 엔진
  const upanishadicTatTvamAsiResult = calculateSupplement('upanishadicTatTvamAsiResult', () => ((() => {
    try {
      return calculateUpanishadicTatTvamAsi(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 215. 한국 조선 실학 혜강 최한기 기학 & 신기통 운화 지혜 엔진
  const choeHangiGihakUnwhaResult = calculateSupplement('choeHangiGihakUnwhaResult', () => ((() => {
    try {
      return calculateChoeHangiGihakUnwha(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 216. 고대 중국 춘추전국시대 손무 손자병법 오사칠계 & 부전승 피실격허 전략 엔진
  const sunTzuArtOfWarStrategyResult = calculateSupplement('sunTzuArtOfWarStrategyResult', () => ((() => {
    try {
      return calculateSunTzuArtOfWarStrategy(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 217. 근대 프랑스 르네 데카르트 방법서설 코기토 & 명석판명 지성 직관 엔진
  const frenchDescartesCogitoResult = calculateSupplement('frenchDescartesCogitoResult', () => ((() => {
    try {
      return calculateFrenchDescartesCogito(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 218. 고대 인도 초기불교 석가모니 붓다 사성제 & 팔정도 고집멸도 중도해탈 엔진
  const fourNobleTruthsResult = calculateSupplement('fourNobleTruthsResult', () => ((() => {
    try {
      return calculateAncientIndianFourNobleTruths(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 219. 중세 이슬람 수피즘 잘랄 앗 딘 루미 마스나비 & 신성한 사랑 지혜 엔진
  const rumiMasnaviDivineLoveResult = calculateSupplement('rumiMasnaviDivineLoveResult', () => ((() => {
    try {
      return calculateRumiMasnaviDivineLove(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 220. 한국 신라 의상대사 화엄일승법계도 & 법성게 원융무애 엔진
  const uisangHwaeomIlseungBeopgyeResult = calculateSupplement('uisangHwaeomIlseungBeopgyeResult', () => ((() => {
    try {
      return calculateUisangHwaeomIlseungBeopgye(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 221. 프랑스 르네상스 몽테뉴 수상록(Essais) 회의주의·자기성찰 지혜 엔진
  const montaigneEssaisWisdomResult = calculateSupplement('montaigneEssaisWisdomResult', () => ((() => {
    try {
      return calculateMontaigneEssaisWisdom(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 222. 고대 인도 용수 중론 팔불중도 & 공성(Śūnyatā) 통찰 엔진
  const nagarjunaMadhyamakaSunyataResult = calculateSupplement('nagarjunaMadhyamakaSunyataResult', () => ((() => {
    try {
      return calculateNagarjunaMadhyamakaSunyata(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 223. 한국 고려 보조국사 지눌 수심결 정혜쌍수 & 돈오점수 선학 지혜 엔진
  const jinulJeonghyeSsangsuResult = calculateSupplement('jinulJeonghyeSsangsuResult', () => ((() => {
    try {
      return calculateJinulJeonghyeSsangsu(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 224. 이탈리아 르네상스 조르다노 브루노 무한우주론 & 영웅적 열정(Eroico Furore) 비상 엔진
  const brunoInfiniteUniverseResult = calculateSupplement('brunoInfiniteUniverseResult', () => ((() => {
    try {
      return calculateRenaissanceBrunoInfiniteUniverse(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 225. 프랑스 블레즈 파스칼 팡세 사유하는 갈대 & 심장의 논리 엔진
  const pascalPenseesHeartReasonResult = calculateSupplement('pascalPenseesHeartReasonResult', () => ((() => {
    try {
      return calculatePascalPenseesHeartReason(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 226. 독일 아서 쇼펜하우어 의지와 표상으로서의 세계 맹목적 의지 초월 & 심미적 관조·자비 엔진
  const schopenhauerWillRepresentationResult = calculateSupplement('schopenhauerWillRepresentationResult', () => ((() => {
    try {
      return calculateSchopenhauerWillRepresentation(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 227. 조선 완당 추사 김정희 세한도 송백후조 & 문자향 서권기 품격 엔진
  const chusaKimJeonghuiSehandoResult = calculateSupplement('chusaKimJeonghuiSehandoResult', () => ((() => {
    try {
      return calculateChusaKimJeonghuiSehando(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 228. 덴마크 쇠렌 키르케고르 이것이냐 저것이냐 & 단독자 실존 3단계 도약 엔진
  const kierkegaardStagesOfLifeResult = calculateSupplement('kierkegaardStagesOfLifeResult', () => ((() => {
    try {
      return calculateKierkegaardStagesOfLife(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 229. 독일 프리드리히 니체 차라투스트라는 이렇게 말했다 초인 & 아모르 파티 엔진
  const nietzscheZarathustraAmorFatiResult = calculateSupplement('nietzscheZarathustraAmorFatiResult', () => ((() => {
    try {
      return calculateNietzscheZarathustraAmorFati(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 230. 조선 서산대사 휴정 선가귀감 일물영명 & 활구참선 선교원융 엔진
  const seosanHyujeongSeongaGwigamResult = calculateSupplement('seosanHyujeongSeongaGwigamResult', () => ((() => {
    try {
      return calculateSeosanHyujeongSeongaGwigam(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 231. 스위스 카를 융 개성화 & 그림자·아니마/아니무스 원형 통합 엔진
  const jungIndividuationArchetypeResult = calculateSupplement('jungIndividuationArchetypeResult', () => ((() => {
    try {
      return calculateJungIndividuationArchetype(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 232. 독일 G.W.F. 헤겔 정신현상학 변증법적 지양 & 인륜성 자유실현 엔진
  const hegelDialecticalAufhebenResult = calculateSupplement('hegelDialecticalAufhebenResult', () => ((() => {
    try {
      return calculateHegelDialecticalAufheben(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 233. 조선 다산 정약용 목민심서 여유당 율기·애민 실사구시 실학 지혜 엔진
  const dasanMokminSimseoResult = calculateSupplement('dasanMokminSimseoResult', () => ((() => {
    try {
      return calculateDasanMokminSimseo(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 234. 북아프리카 아우구스티누스 고백록 시간의 3중현존 & 내적조명 안식 평정심 엔진
  const augustineConfessionesIlluminatioResult = calculateSupplement('augustineConfessionesIlluminatioResult', () => ((() => {
    try {
      return calculateAugustineConfessionesIlluminatio(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 235. 이탈리아 르네상스 니콜로 마키아벨리 군주론 비르투 역량 & 포르투나 극복 엔진
  const machiavelliVirtuFortunaResult = calculateSupplement('machiavelliVirtuFortunaResult', () => ((() => {
    try {
      return calculateMachiavelliVirtuFortuna(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 236. 신라 고운 최치원 난랑비서 국유현묘지도 풍류도 & 포함삼교 접화군생 조화 엔진
  const choeChiwonPungryudoResult = calculateSupplement('choeChiwonPungryudoResult', () => ((() => {
    try {
      return calculateChoeChiwonPungryudo(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 237. 이탈리아 토마스 아퀴나스 신학대전 이성·신앙 조화 & 덕론 종합 엔진
  const thomasAquinasSummaTheologiaeResult = calculateSupplement('thomasAquinasSummaTheologiaeResult', () => ((() => {
    try {
      return calculateThomasAquinasSummaTheologiae(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 238. 영국 프랜시스 베이컨 신기관 4대 우상 타파 & 참된 귀납 사실 검증 지성 엔진
  const francisBaconNovumOrganumResult = calculateSupplement('francisBaconNovumOrganumResult', () => ((() => {
    try {
      return calculateFrancisBaconNovumOrganum(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 239. 조선 서애 류성룡 징비록 징전비후 성찰 & 유비무환 위기대응 실천 엔진
  const ryuSeongryongJingbirokResult = calculateSupplement('ryuSeongryongJingbirokResult', () => ((() => {
    try {
      return calculateRyuSeongryongJingbirok(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 240. 조선 세종대왕 훈민정음 어제서문 애민창조 & 여민락 실용 집현전 지혜 엔진
  const kingSejongHunminjeongeumAeminResult = calculateSupplement('kingSejongHunminjeongeumAeminResult', () => ((() => {
    try {
      return calculateKingSejongHunminjeongeumAemin(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 241. 신라 해상왕 장보고 청해진 글로벌 해상무역 & 신의 개척 실천 엔진
  const jangBogoCheonghaejinMaritimePioneerResult = calculateSupplement('jangBogoCheonghaejinMaritimePioneerResult', () => ((() => {
    try {
      return calculateJangBogoCheonghaejinMaritimePioneer(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 242. 영국 존 스튜어트 밀 자유론 개별성 자율성 & 해악 원칙 질적 공리 지혜 엔진
  const johnStuartMillOnLibertyIndividualityResult = calculateSupplement('johnStuartMillOnLibertyIndividualityResult', () => ((() => {
    try {
      return calculateJohnStuartMillOnLibertyIndividuality(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 243. 프랑스 장 자크 루소 에밀 & 사회계약론 인간 본성 자연 회복 & 진정성 지혜 엔진
  const frenchJeanJacquesRousseauNatureAuthenticityResult = calculateSupplement('frenchJeanJacquesRousseauNatureAuthenticityResult', () => ((() => {
    try {
      return calculateFrenchJeanJacquesRousseauNatureAuthenticity(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 244. 독일 요한 볼프강 폰 괴테 파우스트 영혼 구원 갈망 노력 & 현재 순간 몰입 지혜 엔진
  const germanJohannWolfgangGoetheFaustStrivingResult = calculateSupplement('germanJohannWolfgangGoetheFaustStrivingResult', () => ((() => {
    try {
      return calculateGermanJohannWolfgangGoetheFaustStriving(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 245. 이탈리아 단테 알리기에리 신곡 영혼 상승 지옥·연옥·천국 사랑 광명 지혜 엔진
  const italianDanteAlighieriDivineComedyAscentResult = calculateSupplement('italianDanteAlighieriDivineComedyAscentResult', () => ((() => {
    try {
      return calculateItalianDanteAlighieriDivineComedyAscent(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 246. 로마 마르쿠스 아우렐리우스 명상록 내면의 성채 & 스토아 실존 평정 지혜 엔진
  const marcusAureliusMeditationsCitadelResult = calculateSupplement('marcusAureliusMeditationsCitadelResult', () => ((() => {
    try {
      return calculateMarcusAureliusMeditationsCitadel(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 247. 한국 동학 수운 최제우 동경대전 시천주 & 사인여천 영성 존엄 및 후천개벽 엔진
  const suunChoeJeuDonghakSicheonjuResult = calculateSupplement('suunChoeJeuDonghakSicheonjuResult', () => ((() => {
    try {
      return calculateSuunChoeJeuDonghakSicheonju(profile);
    } catch (_) {
      return null;
    }
  })()));

  // 248. 미국 랠프 월도 에머슨 자기신뢰 & 자연 오버소울 비순응 자립 지혜 엔진
  const ralphWaldoEmersonSelfRelianceResult = calculateSupplement('ralphWaldoEmersonSelfRelianceResult', () => ((() => {
    try {
      return calculateRalphWaldoEmersonSelfReliance(profile);
    } catch (_) {
      return null;
    }
  })()));


  return {
    masterReview: Boolean(params.reviewAll),
    supplementExecutions,
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
    elementalResonanceResult,
    yinYangPolarityResult,
    runeMatrixResult,
    soulJourneyTarotResult,
    transcendentalMeditationResult,
    strategicLeverageResult,
    shadowArchetypeResult,
    biorhythmPeakFlowResult,
    destinySynastryEchoResult,
    microHabitKarmaResult,
    ikigaiDestinyCompassResult,
    serendipitySynchronicityResult,
    humanDesignBodyGraphResult,
    chakraVibrationAlignmentResult,
    enneagramSoulIntegrationResult,
    ancestralEpigeneticKarmaResult,
    shamanicAnimalTotemResult,
    heroMythMonomythResult,
    akashicRecordsOracleResult,
    quantumProbabilisticTimelineResult,
    somaticBodyArmoringResult,
    supremeWisdomTrinityResult,
    sacredVortexGeometryResult,
    taoistNeidanMeridianResult,
    synchronicityOmenResult,
    solfeggioHarmonicResult,
    ethericAuraBiofieldResult,
    sajuClassicYongshinResult,
    tarotTreeOfLifeShadowResult,
    hellenisticLotsResult,
    iching384YaoResult,
    sajuTwelveStagesTombResult,
    tarotElementalCourtResult,
    karmicSynastryResult,
    fiveEmotionsPulseResult,
    hermeticKybalionResult,
    vibrationalSoulQuestResult,
    alchemicalTransmutationResult,
    ziweiHuaJiResult,
    celticTreeOghamResult,
    taoistSanbaoResult,
    tibetanBardoResult,
    mesopotamianSevenGatesResult,
    egyptianDecansResult,
    sufiLataifResult,
    mayanTzolkinResult,
    nordicRunesResult,
    delphicMaximsResult,
    ayurvedicTridoshaResult,
    hawaiianHunaResult,
    fengShuiEightMansionsResult,
    zoroastrianAshaResult,
    hinduKundaliniResult,
    guiguziLiangtouqianResult,
    slavicSvarogResult,
    esseneCommunionResult,
    huangdiFiveMovementsSixQiResult,
    pythagoreanTetraktysResult,
    babylonianEnumaElishResult,
    taoistHuangtingJingResult,
    persianAmeshaSpentaResult,
    sumerianFiftyMesResult,
    zhongLuAlchemyResult,
    druidMoonTreesResult,
    tiebanShenshuResult,
    tibetanBonResult,
    eleusinianMysteriesResult,
    vedicNakshatra108PadaResult,
    egyptianHermeticCartoucheResult,
    taoistGongGuoGeKarmaResult,
    yorubaIfaOduResult,
    arabicIlmAlRamlResult,
    hinduNadiAgastyaPalmLeafResult,
    shintoKotodamaFourSoulsResult,
    aboriginalDreamtimeSonglinesResult,
    finnishKalevalaSampoResult,
    shanhaijingSacredBeastsResult,
    jainGunasthanaKarmaResult,
    celticAwenTaliesinResult,
    koreanDangunCheonbuinResult,
    maoriMauriHauoraResult,
    slavicMokoshFateWeavingResult,
    sumerianGilgameshTrialsResult,
    hawaiianKahunaThreeSelvesResult,
    nordicYggdrasilRealmsResult,
    egyptianMaatFeatherHeartResult,
    persianMithraicSpheresResult,
    orpheicMysteriesResult,
    popolVuhHeroTwinsResult,
    ancientYarrowProbabilityResult,
    vedicPanchaKoshaResult,
    romanJanusResult,
    baopuziElixirsResult,
    vedicMahavakyaResult,
    sumerianApkalluWisdomResult,
    celticTuathaFourTreasuresResult,
    taoistShangqingTwentyFourSpiritsResult,
    tibetanPhowaRainbowBodyResult,
    pythagoreanHarmoniaSpheresResult,
    plumBlossomMeihuaOracleResult,
    greekMoiraiAnankeFateResult,
    egyptianSphinxDreamOracleResult,
    chaldeanMulApinAstrologyResult,
    toltecNagualDreamingResult,
    shugendoYamabushiTenRealmsResult,
    gnosticPistisSophiaPleromaResult,
    sumerianInannaUnderworldDescentResult,
    norseVolvaSeidrNineRealmsResult,
    zhuangziXiaoyaoyouButterflyResult,
    buddhistYogacaraConsciousnessResult,
    vedicMandukyaTuriyaResult,
    kabbalisticZoharSoulResult,
    romanStoicProhairesisResult,
    patanjaliAshtangaYogaResult,
    koreanPungryudoHwarangResult,
    persianAttarSevenValleysResult,
    hermeticPoimandresResult,
    kashmirShaivismSpandaResult,
    sumerianEnumaElishFiftyNamesResult,
    alexandrianDecanThirtySixGodsResult,
    taoistLieziWindRidingResult,
    samkhyaTwentyFiveTattvasResult,
    neoConfucianFourSevenLiQiResult,
    etruscanAugurSixteenSkyResult,
    rosicrucianChymicalWeddingResult,
    aztecTonalamatlResult,
    mongolianTengriHiimoriResult,
    gaelicWheelFireFestivalsResult,
    norseHavamalEighteenGaldrResult,
    ibnArabiWahdatAlWujudResult,
    chonggamnokTenSanctuariesResult,
    balineseTriHitaKaranaResult,
    hopiFourWorldsKachinaResult,
    donghakCheondoismCheonjuResult,
    incaAndeanThreePachaAyniResult,
    shangOracleBoneDivinationResult,
    cheonbugyeongEightyOneResult,
    hinduSriYantraResult,
    lakotaMedicineWheelResult,
    gyeogamYurokResult,
    heianOnmyodoSeimeiResult,
    polynesianWayfindingResult,
    wonhyoHwajaengResult,
    mayiMianxiangResult,
    egyptianAmduatResult,
    celticDruidBrehonLawResult,
    mesopotamianNisabaResult,
    suunGasiHeonResult,
    eleusinianTriptolemosResult,
    mixtecEightDeerResult,
    jeonBongjunNokduResult,
    atrahasisFloodResult,
    eddicYggdrasilResult,
    yiSunSinNanjungIlgiResult,
    ptahMemphiteResult,
    lughSamildanachResult,
    choeHyeonbaeGeulbonResult,
    zoroastrianAmeshaSpentasResult,
    delphicChilonResult,
    jeongYakyongMongminResult,
    heraclitusPantaRheiResult,
    moziGyeomAeResult,
    aureliusInnerCitadelResult,
    laoziDaodejingResult,
    epicureanTetrapharmakosResult,
    yulgokGyeokmongResult,
    aristotleMesotesResult,
    bhagavadGitaKarmaYogaResult,
    wangYangmingXinxueResult,
    socraticMaieuticDaimonResult,
    menciusFourSproutsHoyeonResult,
    senecaTimeSovereigntyResult,
    platonicIdeaCaveResult,
    toegyeSeonghakSipdoResult,
    ciceroDeOfficiisResult,
    epictetusDichotomyOfControlResult,
    confuciusAnalectsZhitianmingResult,
    spinozaEthicaConatusResult,
    kantCategoricalImperativeResult,
    upanishadicTatTvamAsiResult,
    choeHangiGihakUnwhaResult,
    sunTzuArtOfWarStrategyResult,
    frenchDescartesCogitoResult,
    fourNobleTruthsResult,
    rumiMasnaviDivineLoveResult,
    uisangHwaeomIlseungBeopgyeResult,
    montaigneEssaisWisdomResult,
    nagarjunaMadhyamakaSunyataResult,
    jinulJeonghyeSsangsuResult,
    brunoInfiniteUniverseResult,
    pascalPenseesHeartReasonResult,
    schopenhauerWillRepresentationResult,
    chusaKimJeonghuiSehandoResult,
    kierkegaardStagesOfLifeResult,
    nietzscheZarathustraAmorFatiResult,
    seosanHyujeongSeongaGwigamResult,
    jungIndividuationArchetypeResult,
    hegelDialecticalAufhebenResult,
    dasanMokminSimseoResult,
    augustineConfessionesIlluminatioResult,
    machiavelliVirtuFortunaResult,
    choeChiwonPungryudoResult,
    thomasAquinasSummaTheologiaeResult,
    francisBaconNovumOrganumResult,
    ryuSeongryongJingbirokResult,
    kingSejongHunminjeongeumAeminResult,
    jangBogoCheonghaejinMaritimePioneerResult,
    johnStuartMillOnLibertyIndividualityResult,
    frenchJeanJacquesRousseauNatureAuthenticityResult,
    germanJohannWolfgangGoetheFaustStrivingResult,
    italianDanteAlighieriDivineComedyAscentResult,
    marcusAureliusMeditationsCitadelResult,
    suunChoeJeuDonghakSicheonjuResult,
    ralphWaldoEmersonSelfRelianceResult,
    tools: toolsMap,
  };
}

export interface FormatDeterministicEngineOptions {
  focusTools?: string[];
  intent?: string;
  isMasterMobilization?: boolean;
}

export interface DceEngineMeta {
  key: string;
  nameKo: string;
  icon: string;
  category: 'foundational' | 'deep_master';
  summary?: string;
}

export const ALL_DCE_ENGINES: DceEngineMeta[] = [
  // 15대 기초 운명학 도구
  { key: 'saju', nameKo: '사주명리', icon: '🔮', category: 'foundational' },
  { key: 'astrology', nameKo: '서양 점성술', icon: '♈', category: 'foundational' },
  { key: 'ziwei', nameKo: '자미두수', icon: '🌌', category: 'foundational' },
  { key: 'tarot', nameKo: '타로', icon: '🎴', category: 'foundational' },
  { key: 'sukuyo', nameKo: '숙요경(27숙)', icon: '🌙', category: 'foundational' },
  { key: 'mahabote', nameKo: '마하보테(8요일)', icon: '🇲🇲', category: 'foundational' },
  { key: 'vedic', nameKo: '베딕 점성술', icon: '🕉️', category: 'foundational' },
  { key: 'liuren', nameKo: '대육임', icon: '📜', category: 'foundational' },
  { key: 'qimen', nameKo: '기문둔갑', icon: '🛡️', category: 'foundational' },
  { key: 'kabbalah', nameKo: '카발라', icon: '🌳', category: 'foundational' },
  { key: 'iching', nameKo: '주역(64괘)', icon: '☯️', category: 'foundational' },
  { key: 'thai_astrology', nameKo: '태국점성술', icon: '🪷', category: 'foundational' },
  { key: 'tojeong', nameKo: '토정비결', icon: '🍂', category: 'foundational' },
  { key: 'kyusei', nameKo: '구성학', icon: '🧭', category: 'foundational' },
  { key: 'taiyi', nameKo: '태을신수', icon: '🏛️', category: 'foundational' },

  // 심층 마스터 백그라운드 엔진
  { key: 'chronoTransit', nameKo: '실시간 행성 트랜짓', icon: '🌌', category: 'deep_master' },
  { key: 'lifeSeasonTiming', nameKo: '10년대운 생애주기', icon: '⏳', category: 'deep_master' },
  { key: 'energeticPrescription', nameKo: '오행 바이오에너지', icon: '🧪', category: 'deep_master' },
  { key: 'contextualSynastry', nameKo: '대화 인연 동적궁합', icon: '👥', category: 'deep_master' },
  { key: 'instantDecision', nameKo: '시가팔문 즉시결단', icon: '⚡', category: 'deep_master' },
  { key: 'ziweiFlyingStars', nameKo: '자미두수 유년사화', icon: '🌌', category: 'deep_master' },
  { key: 'specialStarsMatrix', nameKo: '15대 신살 슈퍼파워', icon: '⭐', category: 'deep_master' },
  { key: 'monthlyFlow', nameKo: '12개월 월운 플로우', icon: '📅', category: 'deep_master' },
  { key: 'spatialFengshui', nameKo: '공간 길방위 풍수', icon: '🧭', category: 'deep_master' },
  { key: 'vitalityCurve', nameKo: '24시간 에너지곡선', icon: '🧬', category: 'deep_master' },
  { key: 'samjaeGyoUn', nameKo: '삼재·교운기 변곡점', icon: '🔄', category: 'deep_master' },
  { key: 'auspiciousStars', nameKo: '천을귀인·길성망', icon: '✨', category: 'deep_master' },
  { key: 'geokguk', nameKo: '정통 10대 격국', icon: '📜', category: 'deep_master' },
  { key: 'twentyEightMansions', nameKo: '28수 일진 택일', icon: '🌠', category: 'deep_master' },
  { key: 'sukuyoAdvanced', nameKo: '27숙 심층 매트릭스', icon: '🌙', category: 'deep_master' },
  { key: 'vedicAdvanced', nameKo: '베딕 120년 다샤', icon: '🕉️', category: 'deep_master' },
  { key: 'heLuoLiShu', nameKo: '하락이수 수리원당효', icon: '🔢', category: 'deep_master' },
  { key: 'dynamicClash', nameKo: '충형파해 동적트리거', icon: '💥', category: 'deep_master' },
  { key: 'twelveSpirits', nameKo: '12신살 주기', icon: '💫', category: 'deep_master' },
  { key: 'pythagoreanLifecycle', nameKo: '피타고라스 생애주기', icon: '📐', category: 'deep_master' },
  { key: 'astrologicalDecanSabian', nameKo: '사비안 심볼·데칸', icon: '🔮', category: 'deep_master' },
  { key: 'medicalBioMatrix', nameKo: '메디컬 바이오 매트릭스', icon: '🩺', category: 'deep_master' },
  { key: 'wealthPipeline', nameKo: '부의 파이프라인', icon: '💎', category: 'deep_master' },
  { key: 'karmicNodes', nameKo: '카르믹 노드', icon: '🪐', category: 'deep_master' },
  { key: 'mentalResilience', nameKo: '멘탈 리질리언스', icon: '🛡️', category: 'deep_master' },
  { key: 'nobleNetwork', nameKo: '귀인 네트워크', icon: '🤝', category: 'deep_master' },
  { key: 'contractShield', nameKo: '계약·협상 실드', icon: '📑', category: 'deep_master' },
  { key: 'deepWorkFlow', nameKo: '딥워크 몰입 리듬', icon: '🌊', category: 'deep_master' },
  { key: 'sleepSubconscious', nameKo: '수면 무의식 뇌파', icon: '💤', category: 'deep_master' },
  { key: 'quantumLeap', nameKo: '퀀텀 점프 가능성', icon: '🚀', category: 'deep_master' },
  { key: 'soulJourneyTarot', nameKo: '영혼 여정 타로', icon: '🎴', category: 'deep_master' },
  { key: 'transcendentalMeditation', nameKo: '초월 명상 주파수', icon: '🧘', category: 'deep_master' },
  { key: 'strategicLeverage', nameKo: '전략적 레버리지', icon: '🎯', category: 'deep_master' },
  { key: 'shadowArchetype', nameKo: '융 그림자 원형', icon: '🌑', category: 'deep_master' },
  { key: 'biorhythmPeakFlow', nameKo: '바이오리듬 피크', icon: '📈', category: 'deep_master' },
  { key: 'destinySynastryEcho', nameKo: '운명 공명 에코', icon: '🔔', category: 'deep_master' },
  { key: 'microHabitKarma', nameKo: '마이크로 해빗', icon: '🌱', category: 'deep_master' },
  { key: 'ikigaiDestinyCompass', nameKo: '이키가이 나침반', icon: '🧭', category: 'deep_master' },
  { key: 'serendipitySynchronicity', nameKo: '세렌디피티 레이더', icon: '🍀', category: 'deep_master' },
  { key: 'humanDesignBodyGraph', nameKo: '휴먼디자인 바디그래프', icon: '🧬', category: 'deep_master' },
  { key: 'chakraVibrationAlignment', nameKo: '차크라 진동 정렬', icon: '🌈', category: 'deep_master' },
  { key: 'enneagramSoulIntegration', nameKo: '에니어그램 영혼통합', icon: '⭐', category: 'deep_master' },
  { key: 'ancestralEpigeneticKarma', nameKo: '후성유전 카르마', icon: '🌳', category: 'deep_master' },
  { key: 'heroMythMonomyth', nameKo: '영웅의 여정 모노미스', icon: '⚔️', category: 'deep_master' },
  { key: 'akashicRecordsOracle', nameKo: '아카식 레코드', icon: '📖', category: 'deep_master' },
  { key: 'quantumProbabilisticTimeline', nameKo: '양자 확률 타임라인', icon: '🔮', category: 'deep_master' },
  { key: 'somaticBodyArmoring', nameKo: '소매틱 아머링', icon: '🧘', category: 'deep_master' },
  { key: 'supremeWisdomTrinity', nameKo: '3대 지혜 삼위일체', icon: '👑', category: 'deep_master' },
  { key: 'sacredVortexGeometry', nameKo: '황금비 영혼 수비학', icon: '🌀', category: 'deep_master' },
  { key: 'taoistNeidanMeridian', nameKo: '도교 내단 경락시계', icon: '☯️', category: 'deep_master' },
  { key: 'synchronicityOmen', nameKo: '칼 융 동시성 오멘', icon: '🕊️', category: 'deep_master' },
  { key: 'solfeggioHarmonic', nameKo: '솔페지오 하모닉', icon: '🎵', category: 'deep_master' },
  { key: 'ethericAuraBiofield', nameKo: '에테릭 오라 바이오필드', icon: '✨', category: 'deep_master' },
  { key: 'sajuClassicYongshin', nameKo: '사주 원전 억부용신', icon: '📜', category: 'deep_master' },
  { key: 'tarotTreeOfLifeShadow', nameKo: '타로 세피로트 그림자', icon: '🌳', category: 'deep_master' },
  { key: 'hellenisticLots', nameKo: '헬레니즘 포르투나 롯', icon: '🏛️', category: 'deep_master' },
  { key: 'iching384Yao', nameKo: '주역 384효 동효변괘', icon: '☯️', category: 'deep_master' },
  { key: 'sajuTwelveStagesTomb', nameKo: '12운성 묘고지 개고', icon: '🗝️', category: 'deep_master' },
  { key: 'tarotElementalCourt', nameKo: '타로 16 코트 페르소나', icon: '🎭', category: 'deep_master' },
  { key: 'karmicSynastry', nameKo: '카르믹 시나스트리', icon: '💫', category: 'deep_master' },
  { key: 'fiveEmotionsPulse', nameKo: '오행 칠정 심신맥파', icon: '💓', category: 'deep_master' },
  { key: 'hermeticKybalion', nameKo: '카이발리온 7대 우주법칙', icon: '📜', category: 'deep_master' },
  { key: 'vibrationalSoulQuest', nameKo: '차크라 솔 퀘스트', icon: '🧭', category: 'deep_master' },
  { key: 'alchemicalTransmutation', nameKo: '서양 연금술 7단계', icon: '⚗️', category: 'deep_master' },
  { key: 'ziweiHuaJi', nameKo: '자미두수 화기 전화위복', icon: '🌌', category: 'deep_master' },
  { key: 'celticTreeOgham', nameKo: '켈트 오검 수목지혜', icon: '🌲', category: 'deep_master' },
  { key: 'taoistSanbao', nameKo: '도교 삼보 내단에너지', icon: '☯️', category: 'deep_master' },
  { key: 'tibetanBardo', nameKo: '티베트 바르도 6환생', icon: '☸️', category: 'deep_master' },
  { key: 'mesopotamianSevenGates', nameKo: '메소포타미아 7관문', icon: '🏛️', category: 'deep_master' },
  { key: 'egyptianDecans', nameKo: '이집트 36데칸', icon: '🏺', category: 'deep_master' },
  { key: 'sufiLataif', nameKo: '수피 7라타이프', icon: '🕌', category: 'deep_master' },
  { key: 'mayanTzolkin', nameKo: '마야 촐킨 260일', icon: '☀️', category: 'deep_master' },
  { key: 'nordicRunes', nameKo: '북유럽 24룬 노른직조', icon: 'ᚱ', category: 'deep_master' },
  { key: 'delphicMaxims', nameKo: '그리스 델포이 147잠언', icon: '🏛️', category: 'deep_master' },
  { key: 'ayurvedicTridosha', nameKo: '인도 아유르베다 도샤', icon: '🌿', category: 'deep_master' },
  { key: 'hawaiianHuna', nameKo: '호오포노포노 7원리', icon: '🌺', category: 'deep_master' },
  { key: 'fengShuiEightMansions', nameKo: '풍수 8택 방위에너지', icon: '🧭', category: 'deep_master' },
  { key: 'zoroastrianAsha', nameKo: '조로아스터 아샤 진실', icon: '🔥', category: 'deep_master' },
  { key: 'hinduKundalini', nameKo: '힌두 쿤달리니 나디각성', icon: '🕉️', category: 'deep_master' },
  { key: 'guiguziLiangtouqian', nameKo: '귀곡자 양구령 72변화', icon: '📜', category: 'deep_master' },
  { key: 'slavicSvarog', nameKo: '슬라브 16스바로그 로드카르마', icon: '🌌', category: 'deep_master' },
  { key: 'esseneCommunion', nameKo: '에세네 14대 천사교감', icon: '🕊️', category: 'deep_master' },
  { key: 'huangdiFiveMovementsSixQi', nameKo: '황제내경 오운육기 기상의학', icon: '📜', category: 'deep_master' },
  { key: 'pythagoreanTetraktys', nameKo: '피타고라스 테트락티스 신성기하', icon: '📐', category: 'deep_master' },
  { key: 'babylonianEnumaElish', nameKo: '바빌로니아 운명의서판', icon: '🏛️', category: 'deep_master' },
  { key: 'taoistHuangtingJing', nameKo: '도교 황정경 오장존사', icon: '☯️', category: 'deep_master' },
  { key: 'persianAmeshaSpenta', nameKo: '페르시아 아메샤스펜타', icon: '🔥', category: 'deep_master' },
  { key: 'sumerianFiftyMes', nameKo: '수메르 50대메 신성문명', icon: '🏺', category: 'deep_master' },
  { key: 'zhongLuAlchemy', nameKo: '종여내단 3품선도 환원', icon: '☯️', category: 'deep_master' },
  { key: 'druidMoonTrees', nameKo: '켈트 드루이드 13달나무', icon: '🌲', category: 'deep_master' },
  { key: 'tiebanShenshu', nameKo: '철판신수 12000조식', icon: '📜', category: 'deep_master' },
  { key: 'tibetanBonNineWays', nameKo: '티베트 본교 9승 융드룽', icon: '卐', category: 'deep_master' },
  { key: 'eleusinianMysteries', nameKo: '엘레우시스 영혼입사의례', icon: '🌾', category: 'deep_master' },
  { key: 'vedicNakshatra108Pada', nameKo: '베다 108파다 카르마성좌', icon: '🕉️', category: 'deep_master' },
  { key: 'egyptianHermeticCartouche', nameKo: '이집트 헤르메스 카르투슈', icon: '𓋹', category: 'deep_master' },
  { key: 'taoistGongGuoGeKarma', nameKo: '도교 공과격 적선개운', icon: '☯️', category: 'deep_master' },
  { key: 'yorubaIfaOdu', nameKo: '요루바 이파 16오두 신탁', icon: '📿', category: 'deep_master' },
  { key: 'arabicIlmAlRaml', nameKo: '아랍 일무람말 지오맨시', icon: '🏜️', category: 'deep_master' },
  { key: 'hinduNadiAgastyaPalmLeaf', nameKo: '인도 나디 아가스티야 야자잎', icon: '📜', category: 'deep_master' },
  { key: 'shintoKotodamaFourSouls', nameKo: '신도 4혼1생 고토다마', icon: '⛩️', category: 'deep_master' },
  { key: 'aboriginalDreamtimeSonglines', nameKo: '호주 드림타임 송라인', icon: '🪃', category: 'deep_master' },
  { key: 'finnishKalevalaSampo', nameKo: '핀란드 칼레발라 삼포', icon: '🌾', category: 'deep_master' },
  { key: 'shanhaijingSacredBeasts', nameKo: '산해경 8방위 신성영수', icon: '🐉', category: 'deep_master' },
  { key: 'jainGunasthanaKarma', nameKo: '자이나 14군아스타나 카르마', icon: '🪷', category: 'deep_master' },
  { key: 'celticAwenTaliesin', nameKo: '켈트 탈리에신 아웬영감', icon: '🔮', category: 'deep_master' },
  { key: 'koreanDangunCheonbuin', nameKo: '단군 천부인 3보 홍익광명', icon: '🇰🇷', category: 'deep_master' },
  { key: 'maoriMauriHauora', nameKo: '마오리 하우오라 마우리생명력', icon: '🌿', category: 'deep_master' },
  { key: 'slavicMokoshFateWeaving', nameKo: '슬라브 모코시 운명실타래', icon: '🧶', category: 'deep_master' },
  { key: 'sumerianGilgameshTrials', nameKo: '길가메시 서사시 12관문', icon: '🏛️', category: 'deep_master' },
  { key: 'hawaiianKahunaThreeSelves', nameKo: '하와이 카후나 3대 자아 마나', icon: '🌺', category: 'deep_master' },
  { key: 'nordicYggdrasilRealms', nameKo: '북유럽 위그드라실 9대 영역', icon: '🌳', category: 'deep_master' },
  { key: 'egyptianMaatFeatherHeart', nameKo: '이집트 마아트 심장무게', icon: '🪶', category: 'deep_master' },
  { key: 'persianMithraicSpheres', nameKo: '페르시아 미트라 7천구', icon: '☀️', category: 'deep_master' },
  { key: 'orpheicMysteries', nameKo: '그리스 오르페우스 므네모시네', icon: '🎶', category: 'deep_master' },
  { key: 'popolVuhHeroTwins', nameKo: '마야 포폴부 쌍둥이영웅', icon: '🌽', category: 'deep_master' },
  { key: 'ancientYarrowProbability', nameKo: '주역 대연지수 49책 시초점', icon: '🌿', category: 'deep_master' },
  { key: 'vedicPanchaKosha', nameKo: '인도 베단타 5대 코샤', icon: '🧘', category: 'deep_master' },
  { key: 'romanJanus', nameKo: '로마 야누스 문턱전이', icon: '🚪', category: 'deep_master' },
  { key: 'baopuziElixirs', nameKo: '포박자 구전환단 선도', icon: '🍶', category: 'deep_master' },
  { key: 'vedicMahavakya', nameKo: '베다 4대 마하바키야 각성', icon: '🕉️', category: 'deep_master' },
  { key: 'sumerianApkalluWisdom', nameKo: '수메르 엔키 7압갈루 현자', icon: '🐟', category: 'deep_master' },
  { key: 'celticTuathaFourTreasures', nameKo: '켈트 투아하 4대 신성보물', icon: '🗡️', category: 'deep_master' },
  { key: 'taoistShangqingTwentyFourSpirits', nameKo: '도교 진고 상청 24성도', icon: '✨', category: 'deep_master' },
  { key: 'tibetanPhowaRainbowBody', nameKo: '티베트 족첸 릭파 무지개체', icon: '🌈', category: 'deep_master' },
  { key: 'pythagoreanHarmoniaSpheres', nameKo: '피타고라스 천구의 조화 주파수', icon: '🪐', category: 'deep_master' },
  { key: 'plumBlossomMeihuaOracle', nameKo: '소강절 매화역수 체용생극', icon: '🌸', category: 'deep_master' },
  { key: 'greekMoiraiAnankeFate', nameKo: '그리스 모이라이 운명실타래', icon: '🧶', category: 'deep_master' },
  { key: 'egyptianSphinxDreamOracle', nameKo: '이집트 스핑크스 꿈신탁', icon: '🦁', category: 'deep_master' },
  { key: 'chaldeanMulApinAstrology', nameKo: '칼데아 물핀 12조디악', icon: '✨', category: 'deep_master' },
  { key: 'toltecNagualDreaming', nameKo: '톨텍 나구알리즘 4대 약속', icon: '🦅', category: 'deep_master' },
  { key: 'shugendoYamabushiTenRealms', nameKo: '슈겐도 야마부시 10계수행', icon: '🏔️', category: 'deep_master' },
  { key: 'gnosticPistisSophiaPleroma', nameKo: '영지주의 소피아 플레로마', icon: '🕊️', category: 'deep_master' },
  { key: 'sumerianInannaUnderworldDescent', nameKo: '수메르 이난나 명계하강 7대관문', icon: '👑', category: 'deep_master' },
  { key: 'norseVolvaSeidrNineRealms', nameKo: '북유럽 볼바 세이드 9대세계', icon: '🌲', category: 'deep_master' },
  { key: 'zhuangziXiaoyaoyouButterfly', nameKo: '도가 장자 소요유 호접몽', icon: '🦋', category: 'deep_master' },
  { key: 'buddhistYogacaraConsciousness', nameKo: '불교 유식학 8식 전식득지', icon: '☸️', category: 'deep_master' },
  { key: 'vedicMandukyaTuriya', nameKo: '만두키야 우파니샤드 투리야 순수의식', icon: '🕉️', category: 'deep_master' },
  { key: 'kabbalisticZoharSoul', nameKo: '카발라 조하르 5대 영혼 층위', icon: '🕎', category: 'deep_master' },
  { key: 'romanStoicProhairesis', nameKo: '로마 스토아 통제이분법', icon: '🏛️', category: 'deep_master' },
  { key: 'patanjaliAshtangaYoga', nameKo: '파탄잘리 요가 8지칙', icon: '🧘', category: 'deep_master' },
  { key: 'koreanPungryudoHwarang', nameKo: '신라 풍류도 화랑오계', icon: '🌸', category: 'deep_master' },
  { key: 'persianAttarSevenValleys', nameKo: '페르시아 아타르 새들의 회의 7대 계곡', icon: '🕊️', category: 'deep_master' },
  { key: 'hermeticPoimandres', nameKo: '헤르메스주의 포이만드레스 8대 천계', icon: '🌟', category: 'deep_master' },
  { key: 'kashmirShaivismSpanda', nameKo: '카슈미르 시바파 스판다 우주 맥동', icon: '🔱', category: 'deep_master' },
  { key: 'sumerianEnumaElishFiftyNames', nameKo: '에누마 엘리시 50대 이름', icon: '⚔️', category: 'deep_master' },
  { key: 'alexandrianDecanThirtySixGods', nameKo: '알렉산드리아 36대 데칸', icon: '⌛', category: 'deep_master' },
  { key: 'taoistLieziWindRiding', nameKo: '열자 어풍동행 무하유지향', icon: '🍃', category: 'deep_master' },
  { key: 'samkhyaTwentyFiveTattvas', nameKo: '상키야 25타트바 분별지', icon: '🧘', category: 'deep_master' },
  { key: 'neoConfucianFourSevenLiQi', nameKo: '성리학 사칠이기 거경궁리', icon: '📜', category: 'deep_master' },
  { key: 'etruscanAugurSixteenSky', nameKo: '에트루리아 16천궁 아우구르', icon: '🦅', category: 'deep_master' },
  { key: 'rosicrucianChymicalWedding', nameKo: '로젠크로이츠 화학적 결혼 7일 연금술', icon: '🌹', category: 'deep_master' },
  { key: 'aztecTonalamatl', nameKo: '아즈텍 토날포왈리 20대 일진 성력', icon: '☀️', category: 'deep_master' },
  { key: 'mongolianTengriHiimori', nameKo: '몽골 텡그리즘 풍마 히모리 영혼', icon: '🐎', category: 'deep_master' },
  { key: 'gaelicWheelFireFestivals', nameKo: '게일 4대 화제 축제 휠 오브 더 이어', icon: '🔥', category: 'deep_master' },
  { key: 'norseHavamalEighteenGaldr', nameKo: '하바말 오딘 18대 게알드르 룬 비전', icon: 'ᚱ', category: 'deep_master' },
  { key: 'ibnArabiWahdatAlWujud', nameKo: '이븐 아라비 존재의 단일성 심장 영지', icon: '🪞', category: 'deep_master' },
  { key: 'chonggamnokTenSanctuaries', nameKo: '정감록 10승지 영맥 피난처', icon: '⛰️', category: 'deep_master' },
  { key: 'balineseTriHitaKarana', nameKo: '발리 트리 히타 카라나 3대 조화', icon: '🌺', category: 'deep_master' },
  { key: 'hopiFourWorldsKachina', nameKo: '호피 4대 세계 카치나 정령 지혜', icon: '🦅', category: 'deep_master' },
  { key: 'donghakCheondoismCheonju', nameKo: '동학 시천주 지기금지 인내천 조화', icon: '🕊️', category: 'deep_master' },
  { key: 'incaAndeanThreePachaAyni', nameKo: '잉카 안데스 3대 파차 아이니 호혜', icon: '🦙', category: 'deep_master' },
  { key: 'shangOracleBoneDivination', nameKo: '은나라 갑골문 신탁 복사 정인 균열', icon: '🐢', category: 'deep_master' },
  { key: 'cheonbugyeongEightyOne', nameKo: '단군 단학 천부경 81자 삼일신고 성통광명', icon: '☀️', category: 'deep_master' },
  { key: 'hinduSriYantra', nameKo: '힌두 탄트라 스리 얀트라 9나바요니 바인두', icon: '🔺', category: 'deep_master' },
  { key: 'lakotaMedicineWheel', nameKo: '라코타 수족 와칸 탕카 성스러운 메디슨 휠', icon: '🪶', category: 'deep_master' },
  { key: 'gyeogamYurok', nameKo: '격암 남사고 격암유록 궁궁을을 사중구생', icon: '📜', category: 'deep_master' },
  { key: 'heianOnmyodoSeimei', nameKo: '헤이안 음양도 아베노 세이메이 12천장 식신', icon: '⭐', category: 'deep_master' },
  { key: 'polynesianWayfinding', nameKo: '폴리네시아 마우이 웨이파인딩 32방위 스타컴퍼스', icon: '🧭', category: 'deep_master' },
  { key: 'wonhyoHwajaeng', nameKo: '신라 원효대사 십문화쟁론 일심이문 무애', icon: '🕊️', category: 'deep_master' },
  { key: 'mayiMianxiang', nameKo: '마의도사 마의상법 12궁 관상 심상합일', icon: '👤', category: 'deep_master' },
  { key: 'egyptianAmduat', nameKo: '이집트 암두아트 12시간 라 밤의항해 케프리부활', icon: '🌅', category: 'deep_master' },
  { key: 'celticDruidBrehonLawJustice', nameKo: '고대 켈트 브레혼 법전 4대 우주정의 에릭', icon: '⚖️', category: 'deep_master' },
  { key: 'mesopotamianNisabaScribe', nameKo: '수메르 서기 니사바 청금석 서판 갈대첨필 천문수리', icon: '📐', category: 'deep_master' },
  { key: 'koreanSuunGasiHeon', nameKo: '동학 수운 최제우 용담유사 검결 심기수련 삼경', icon: '🗡️', category: 'deep_master' },
  { key: 'eleusinianTriptolemosCivilization', nameKo: '엘레우시스 트리프톨레모스 황금전차 농경3대율법', icon: '🌾', category: 'deep_master' },
  { key: 'mixtecEightDeerJaguarClaw', nameKo: '믹스테크 8-사슴 재규어발톱 동맹결성 통일', icon: '🐆', category: 'deep_master' },
  { key: 'koreanJeonBongjunNokduGeneral', nameKo: '동학농민혁명 녹두장군 전봉준 사발통문 백산창의', icon: '📜', category: 'deep_master' },
  { key: 'atrahasisFloodWisdom', nameKo: '메소포타미아 아트라하시스 지혜의방주 대홍수정화 절제', icon: '🌊', category: 'deep_master' },
  { key: 'eddicYggdrasilNineRealms', nameKo: '북유럽 고에다 위그드라실 9대우주계 3대영천 소생', icon: '🌳', category: 'deep_master' },
  { key: 'yiSunSinNanjungIlgiStrategic', nameKo: '충무공 이순신 난중일기 필사즉생 명량대역전', icon: '⚔️', category: 'deep_master' },
  { key: 'ptahMemphiteHeartTongueCreation', nameKo: '이집트 멤피스신학 프타 심장구상 말씀선포 창조', icon: '🏛️', category: 'deep_master' },
  { key: 'celticLughSamildanachAllArts', nameKo: '켈트 투아하데다난 루 라바다 8대만능기예 마그투이레드', icon: '⚡', category: 'deep_master' },
  { key: 'koreanChoeHyeonbaeHangeulGeulbon', nameKo: '외솔 최현배 우리말본 한글 말글자주권 문화얼', icon: '📖', category: 'deep_master' },
  { key: 'zoroastrianAmeshaSpentasLight', nameKo: '페르시아 조로아스터교 6대 신성불멸자 빛의조화', icon: '🔥', category: 'deep_master' },
  { key: 'delphicChilonSpartanModeration', nameKo: '델포이 7현인 스파르타 킬론 너자신을알라 중용절제', icon: '🏛️', category: 'deep_master' },
  { key: 'koreanJeongYakyongMongminSimseo', nameKo: '다산 정약용 목민심서 율기수신 애민청렴 공평무사', icon: '📜', category: 'deep_master' },
  { key: 'heraclitusPantaRheiLogos', nameKo: '에페소스 헤라클레이토스 만물유전 로고스 대립물조화', icon: '🌊', category: 'deep_master' },
  { key: 'moziGyeomAeUniversalLove', nameKo: '묵가 묵자 겸애교리 비공절용 공평무사 평화수호', icon: '🛡️', category: 'deep_master' },
  { key: 'romanAureliusInnerCitadel', nameKo: '로마 철학황제 마르쿠스 아우렐리우스 명상록 내면의성채', icon: '🏛️', category: 'deep_master' },
  { key: 'laoziDaodejingWaterWay', nameKo: '노자 도덕경 81장 상선약수 화광동진 무위자연', icon: '☯️', category: 'deep_master' },
  { key: 'ancientGreekEpicureanTetrapharmakos', nameKo: '에피쿠로스 4대치유약 테트라파르마코스 아타락시아 영혼평정', icon: '🌿', category: 'deep_master' },
  { key: 'koreanYulgokGyeokmongYogyeol', nameKo: '율곡 이이 격몽요결 입지혁구습 구용구사 수신실천', icon: '📖', category: 'deep_master' },
  { key: 'ancientGreekAristotleMesotesEudaimonia', nameKo: '아리스토텔레스 니코마코스 윤리학 중용 에우다이모니아', icon: '⚖️', category: 'deep_master' },
  { key: 'ancientIndianBhagavadGitaKarmaYoga', nameKo: '바가바드 기타 카르마 요가 니슈카마 카르마 무집착', icon: '🕉️', category: 'deep_master' },
  { key: 'chineseWangYangmingLiangzhiXinxue', nameKo: '양명학 왕양명 전습록 치양지 지행합일 심학', icon: '📜', category: 'deep_master' },
  { key: 'ancientGreekSocraticMaieuticDaimon', nameKo: '소크라테스 산파술 다이몬 영혼성찰 무지의지', icon: '🏛️', category: 'deep_master' },
  { key: 'chineseMenciusFourSproutsHoyeon', nameKo: '맹자 사단사덕 호연지기 부동심 대장부', icon: '🌊', category: 'deep_master' },
  { key: 'romanSenecaTimeSovereignty', nameKo: '세네카 인생의짧음에대하여 시간주권 마음의평정', icon: '⏳', category: 'deep_master' },
  { key: 'ancientGreekPlatonicIdeaCave', nameKo: '플라톤 동굴의비유 이데아 상기설 4대추덕', icon: '🏛️', category: 'deep_master' },
  { key: 'koreanToegyeSeonghakSipdo', nameKo: '퇴계 이황 성학십도 거경궁리 상성성 경철학', icon: '📜', category: 'deep_master' },
  { key: 'romanCiceroDeOfficiisHonestum', nameKo: '키케로 의무론 도덕적선 유용성조화 신의품위', icon: '⚖️', category: 'deep_master' },
  { key: 'ancientGreekEpictetusDichotomyOfControl', nameKo: '에픽테토스 엥케이리디온 통제이분법 프로하이레시스 도덕의지', icon: '🏛️', category: 'deep_master' },
  { key: 'ancientChineseConfuciusAnalectsZhitianming', nameKo: '공자 논어 지천명 극기복례 군자도', icon: '📜', category: 'deep_master' },
  { key: 'baruchSpinozaEthicaConatusAmorDei', nameKo: '스피노자 에티카 코나투스 신즉자연 영원의상관조', icon: '✨', category: 'deep_master' },
  { key: 'germanKantCategoricalImperativeSynthesis', nameKo: '칸트 정언명령 목적의왕국 자율성 도덕법칙', icon: '⚖️', category: 'deep_master' },
  { key: 'indianUpanishadicTatTvamAsi', nameKo: '우파니샤드 타트트밤아시 범아일여 순수의식', icon: '🕉️', category: 'deep_master' },
  { key: 'koreanChoeHangiGihakUnwha', nameKo: '혜강 최한기 기학 신기통 운화기 추측지리', icon: '📜', category: 'deep_master' },
  { key: 'ancientChineseSunTzuArtOfWarStrategy', nameKo: '손자병법 오사칠계 부전승 피실격허 전략', icon: '⚔️', category: 'deep_master' },
  { key: 'frenchDescartesCogitoClaraDistincta', nameKo: '데카르트 방법서설 코기토 명석판명 지성직관', icon: '💡', category: 'deep_master' },
  { key: 'ancientIndianEarlyBuddhistFourNobleTruths', nameKo: '초기불교 사성제 팔정도 고집멸도 중도해탈', icon: '☸️', category: 'deep_master' },
  { key: 'islamicSufiRumiMasnaviDivineLove', nameKo: '루미 마스나비 수피즘 신성한사랑 영혼갈망', icon: '🕊️', category: 'deep_master' },
  { key: 'koreanUisangHwaeomIlseungBeopgye', nameKo: '신라 의상대사 화엄일승법계도 법성게 원융무애', icon: '☸️', category: 'deep_master' },
  { key: 'frenchMontaigneEssaisWisdom', nameKo: '몽테뉴 수상록 자기성찰 독단탈피 회의주의 중용', icon: '📖', category: 'deep_master' },
  { key: 'ancientIndianNagarjunaMadhyamakaSunyata', nameKo: '용수 중론 팔불중도 연기즉공 이제설 공성지혜', icon: '☸️', category: 'deep_master' },
  { key: 'koreanJinulJeonghyeSsangsuDonohJeomsu', nameKo: '보조국사 지눌 수심결 정혜쌍수 돈오점수 성적등지', icon: '📜', category: 'deep_master' },
  { key: 'renaissanceBrunoInfiniteUniverseHeroicFurore', nameKo: '조르다노 브루노 무한우주론 영웅적열정 정신주권', icon: '🌌', category: 'deep_master' },
  { key: 'frenchPascalPenseesHeartReason', nameKo: '블레즈 파스칼 팡세 사유하는갈대 심장의논리 파스칼의내기', icon: '🌾', category: 'deep_master' },
  { key: 'germanSchopenhauerWillRepresentation', nameKo: '쇼펜하우어 의지와표상 맹목적의지초월 심미적관조 동포애자비', icon: '🎼', category: 'deep_master' },
  { key: 'koreanChusaKimJeonghuiSehando', nameKo: '추사 김정희 세한도 송백후조 역경극복지조 문자향서권기', icon: '🌲', category: 'deep_master' },
  { key: 'danishKierkegaardStagesOfLife', nameKo: '쇠렌 키르케고르 단독자 실존3단계 이것이냐저것이냐 신앙도약', icon: '⚖️', category: 'deep_master' },
  { key: 'germanNietzscheZarathustraAmorFati', nameKo: '프리드리히 니체 차라투스트라 초인 아모르파티 영원회귀', icon: '🦅', category: 'deep_master' },
  { key: 'koreanSeosanHyujeongSeongaGwigam', nameKo: '서산대사 휴정 선가귀감 일물영명 활구참선 선교원융', icon: '📿', category: 'deep_master' },
  { key: 'swissJungIndividuationArchetype', nameKo: '카를 융 개성화 원형통합 그림자 아니마아니무스 동시성', icon: '🎭', category: 'deep_master' },
  { key: 'germanHegelDialecticalAufheben', nameKo: '헤겔 정신현상학 변증법적지양 정반합 인륜성 미네르바올빼미', icon: '🏛️', category: 'deep_master' },
  { key: 'koreanDasanJeongYagyongMokminSimseo', nameKo: '다산 정약용 목민심서 여유당신독 율기청렴 애민 실사구시', icon: '📜', category: 'deep_master' },
  { key: 'northAfricanAugustineConfessionesIlluminatio', nameKo: '아우구스티누스 고백록 시간의3중현존 내적조명 은총안식 평정심', icon: '🕯️', category: 'deep_master' },
  { key: 'italianMachiavelliVirtuFortuna', nameKo: '마키아벨리 군주론 비르투역량 포르투나극복 시대조화 여우와사자', icon: '🦁', category: 'deep_master' },
  { key: 'koreanChoeChiwonPungryudo', nameKo: '최치원 난랑비서 국유현묘지도 풍류도 포함삼교 접화군생 계원필경', icon: '🪶', category: 'deep_master' },
  { key: 'italianThomasAquinasSummaTheologiae', nameKo: '토마스 아퀴나스 신학대전 이성신앙조화 5대길 7대덕목 지복직관', icon: '⛪', category: 'deep_master' },
  { key: 'britishFrancisBaconNovumOrganum', nameKo: '프랜시스 베이컨 신기관 4대우상타파 참된귀납 아는것이힘이다 사실검증', icon: '🔬', category: 'deep_master' },
  { key: 'koreanRyuSeongryongJingbirok', nameKo: '서애 류성룡 징비록 징전비후 유비무환 거안사위 인재발탁 실사구시', icon: '🛡️', category: 'deep_master' },
  { key: 'koreanKingSejongHunminjeongeumAemin', nameKo: '세종대왕 훈민정음 어제서문 애민창조 여민락 집현전 실용실사', icon: '📜', category: 'deep_master', summary: '세종대왕의 훈민정음 어제서문과 애민 정신으로 장벽을 허물고 세상을 이롭게 하는 실천적 창의력을 발휘합니다.' },
  { key: 'koreanJangBogoCheonghaejinMaritimePioneer', nameKo: '장보고 해상왕 청해진 글로벌무역 신의개척 파도극복 자주국방', icon: '⚓', category: 'deep_master', summary: '장보고의 청해진 해상 네트워크와 신의의 개척 정신으로 거친 파도를 넘어 글로벌 시야의 새 항로를 엽니다.' },
  { key: 'britishJohnStuartMillOnLibertyIndividuality', nameKo: '존 스튜어트 밀 자유론 개별성존중 해악원칙 내면의자유 질적공리', icon: '🕊️', category: 'deep_master', summary: '존 스튜어트 밀의 자유론과 개별성 철학으로 획일성을 탈피하고 온전한 내면의 자주적 자율성을 확립합니다.' },
  { key: 'frenchJeanJacquesRousseauNatureAuthenticity', nameKo: '장 자크 루소 에밀 사회계약론 자연으로돌아가라 일반의지 진정성회복', icon: '🌿', category: 'deep_master', summary: '장 자크 루소의 자연 회복 철학으로 사회적 가식을 벗겨내고 내면의 자연적 진정성과 일반의지의 조화를 회복합니다.' },
  { key: 'germanJohannWolfgangGoetheFaustStriving', nameKo: '괴테 파우스트 끝없는노력과갈망 영혼의구원 현재순간몰입 질풍노도', icon: '⚡', category: 'deep_master', summary: '괴테의 파우스트 철학으로 방황을 딛고 끊임없이 갈망하며 노력하는 영혼의 구원과 현재 순간의 완전한 몰입을 이끕니다.' },
  { key: 'italianDanteAlighieriDivineComedyAscent', nameKo: '단테 신곡 지옥직면 연옥정화 천국상승 어두운숲탈출 태양과별을움직이는사랑', icon: '🌌', category: 'deep_master', summary: '단테의 신곡 철학으로 인생의 어두운 숲을 뚫고 지옥의 직면과 연옥의 정화를 거쳐 궁극의 사랑과 광명으로 비상합니다.' },
  { key: 'romanMarcusAureliusMeditationsCitadel', nameKo: '마르쿠스 아우렐리우스 명상록 내면의성채 로고스섭리순응 메멘토모리 아파테이아 평정심', icon: '🏛️', category: 'deep_master', summary: '마르쿠스 아우렐리우스의 명상록 철학으로 외부 자극에 흔들리지 않는 내면의 성채를 세우고 스토아 실존의 평정을 확립합니다.' },
  { key: 'koreanSuunChoeJeuDonghakSicheonju', nameKo: '수운 최제우 동학 동경대전 시천주 사인여천 인내천 오심즉여심 후천개벽', icon: '🕊️', category: 'deep_master', summary: '수운 최제우의 동학 사상으로 내 안의 한울 영성 존엄을 자각하고 사람을 하늘처럼 섬기며 새 시대를 여는 개벽의 지혜를 발휘합니다.' },
  { key: 'americanRalphWaldoEmersonSelfReliance', nameKo: '랠프 월도 에머슨 자기신뢰 자연 오버소울 비순응 독창성 투명한눈동자', icon: '🌲', category: 'deep_master', summary: '랠프 월도 에머슨의 자기신뢰와 초월주의 철학으로 사회적 순응을 탈피하고 내면의 신적 직관을 신뢰하는 온전한 주체성을 세웁니다.' },
];

export function getFiredEngineBadges(
  report: DeterministicEngineReport,
  options?: FormatDeterministicEngineOptions
): string[] {
  return getCalculationAudit(report, options).filter(item => item.sentToModel)
    .map(item => `${item.status === 'symbolic' ? '상징 참고' : '계산 근거'} · ${item.name}`);
}

const REVIEW_PENDING_CORE = new Set(['sukuyo', 'mahabote', 'kabbalah']);

export function getMasterSymbolicReview(report: DeterministicEngineReport, options?: FormatDeterministicEngineOptions) {
  if (!report.masterReview) return [];
  const engines = (options && options.isMasterMobilization === false)
    ? ALL_DCE_ENGINES.filter(engine => engine.category === 'deep_master' && shouldIncludeEngine(engine.key, options))
    : ALL_DCE_ENGINES.filter(engine => engine.category === 'deep_master');
  return engines.map(engine => {
    const binding = MASTER_REVIEW_BINDINGS[engine.key];
    const value = binding ? (report as unknown as Record<string, unknown>)[binding.field] : null;
    const execution = binding ? report.supplementExecutions?.[binding.traceKey] : undefined;
    const nestedStatus = (value as { status?: string } | null)?.status;
    const unavailable = value == null || ['error', 'skipped', 'not_implemented'].includes(nestedStatus || '');
    const perspectives = unavailable ? [] : getSymbolicPerspective(value);
    return {
      toolId: engine.key, name: engine.nameKo,
      status: execution === 'error' || nestedStatus === 'error' ? 'error' as const : perspectives.length ? 'symbolic' as const : 'skipped' as const,
      sentToModel: perspectives.length > 0,
      perspectives,
    };
  });
}

export function getCalculationAudit(report: DeterministicEngineReport, options?: FormatDeterministicEngineOptions): CalculationAuditItem[] {
  const core = getIncludedCalculationTools(report, options).map(tool => {
    const symbolic = report.masterReview && REVIEW_PENDING_CORE.has(tool.toolId);
    const perspectives = symbolic ? getSymbolicPerspective(tool.data) : [];
    return {
      toolId: tool.toolId, name: tool.toolKoName,
      status: symbolic && tool.data != null ? 'symbolic' as const : tool.status,
      sentToModel: symbolic ? perspectives.length > 0 : tool.status === 'calculated' && tool.data != null,
      ...((tool.note || tool.limitations?.length) ? { note: [tool.note, ...(tool.limitations || [])].filter(Boolean).join(' · ') } : {}),
      ...(tool.method ? { method: tool.method } : {}),
    };
  });
  return [...core, ...getMasterSymbolicReview(report).map(({ perspectives, ...item }) => item)];
}

function getIncludedCalculationTools(report: DeterministicEngineReport, options?: FormatDeterministicEngineOptions) {
  const focus = new Set(options?.focusTools || []);
  return Object.values(report.tools).filter(tool =>
    options?.isMasterMobilization !== false || focus.size === 0 || focus.has(tool.toolId));
}

const INTENT_SPECIALIZED_ENGINES: Record<string, string[]> = {
  career_strategy: [
    'americanRalphWaldoEmersonSelfReliance',
    'romanMarcusAureliusMeditationsCitadel',
    'koreanSuunChoeJeuDonghakSicheonju',
    'frenchJeanJacquesRousseauNatureAuthenticity',
    'germanJohannWolfgangGoetheFaustStriving',
    'italianDanteAlighieriDivineComedyAscent',
    'koreanKingSejongHunminjeongeumAemin',
    'koreanJangBogoCheonghaejinMaritimePioneer',
    'britishJohnStuartMillOnLibertyIndividuality',
    'italianMachiavelliVirtuFortuna',
    'koreanRyuSeongryongJingbirok',
    'swissJungIndividuationArchetype',
    'koreanDasanJeongYagyongMokminSimseo',
    'germanNietzscheZarathustraAmorFati',
    'britishFrancisBaconNovumOrganum',
    'germanHegelDialecticalAufheben',
    'koreanYulgokGyeokmongYogyeol',
    'laoziDaodejingWaterWay',
    'ancientGreekEpicureanTetrapharmakos',
    'romanAureliusInnerCitadel',
    'moziGyeomAeUniversalLove',
    'koreanJeongYakyongMongminSimseo',
    'delphicChilonSpartanModeration',
    'celticLughSamildanachAllArts',
    'ptahMemphiteHeartTongueCreation',
    'yiSunSinNanjungIlgiStrategic',
    'atrahasisFloodWisdom',
    'mixtecEightDeerJaguarClaw',
    'eleusinianTriptolemosCivilization',
    'celticDruidBrehonLawJustice',
    'mesopotamianNisabaScribe',
    'mayiMianxiang',
    'polynesianWayfinding',
    'celticTuathaFourTreasures',
    'sumerianApkalluWisdom',
    'romanJanus',
    'koreanDangunCheonbuin',
    'celticAwenTaliesin',
    'shanhaijingSacredBeasts',
    'shintoKotodamaFourSouls',
    'finnishKalevalaSampo',
    'yorubaIfaOdu',
    'arabicIlmAlRaml',
    'hinduNadiAgastyaPalmLeaf',
    'vedicNakshatra108Pada',
    'tiebanShenshu',
    'sumerianFiftyMes',
    'babylonianEnumaElish',
    'pythagoreanTetraktys',
    'sajuClassicYongshin',
    'sajuTwelveStagesTomb',
    'tarotElementalCourt',
    'geokguk',
    'ziweiFlyingStars',
    'specialStarsMatrix',
    'wealthPipeline',
    'contractShield',
    'strategicLeverage',
    'instantDecision',
    'honggukQimen',
    'ikigaiDestinyCompass',
    'hellenisticLots',
    'iching384Yao',
    'mesopotamianSevenGates',
    'egyptianDecans',
    'quantumLeap',
    'nordicRunes',
    'delphicMaxims',
  ],
  business_money: [
    'italianThomasAquinasSummaTheologiae',
    'britishFrancisBaconNovumOrganum',
    'koreanRyuSeongryongJingbirok',
    'northAfricanAugustineConfessionesIlluminatio',
    'italianMachiavelliVirtuFortuna',
    'koreanChoeChiwonPungryudo',
    'swissJungIndividuationArchetype',
    'germanHegelDialecticalAufheben',
    'koreanDasanJeongYagyongMokminSimseo',
    'danishKierkegaardStagesOfLife',
    'germanNietzscheZarathustraAmorFati',
    'koreanSeosanHyujeongSeongaGwigam',
    'frenchPascalPenseesHeartReason',
    'germanSchopenhauerWillRepresentation',
    'koreanChusaKimJeonghuiSehando',
    'ancientIndianNagarjunaMadhyamakaSunyata',
    'koreanJinulJeonghyeSsangsuDonohJeomsu',
    'renaissanceBrunoInfiniteUniverseHeroicFurore',
    'islamicSufiRumiMasnaviDivineLove',
    'koreanUisangHwaeomIlseungBeopgye',
    'frenchMontaigneEssaisWisdom',
    'ancientChineseSunTzuArtOfWarStrategy',
    'frenchDescartesCogitoClaraDistincta',
    'ancientIndianEarlyBuddhistFourNobleTruths',
    'germanKantCategoricalImperativeSynthesis',
    'indianUpanishadicTatTvamAsi',
    'koreanChoeHangiGihakUnwha',
    'ancientGreekEpictetusDichotomyOfControl',
    'ancientChineseConfuciusAnalectsZhitianming',
    'baruchSpinozaEthicaConatusAmorDei',
    'ancientGreekPlatonicIdeaCave',
    'koreanToegyeSeonghakSipdo',
    'romanCiceroDeOfficiisHonestum',
    'ancientGreekSocraticMaieuticDaimon',
    'chineseMenciusFourSproutsHoyeon',
    'romanSenecaTimeSovereignty',
    'ancientGreekAristotleMesotesEudaimonia',
    'ancientIndianBhagavadGitaKarmaYoga',
    'chineseWangYangmingLiangzhiXinxue',
    'koreanYulgokGyeokmongYogyeol',
    'laoziDaodejingWaterWay',
    'ancientGreekEpicureanTetrapharmakos',
    'moziGyeomAeUniversalLove',
    'heraclitusPantaRheiLogos',
    'koreanJeongYakyongMongminSimseo',
    'delphicChilonSpartanModeration',
    'ptahMemphiteHeartTongueCreation',
    'celticLughSamildanachAllArts',
    'atrahasisFloodWisdom',
    'yiSunSinNanjungIlgiStrategic',
    'eleusinianTriptolemosCivilization',
    'mixtecEightDeerJaguarClaw',
    'celticDruidBrehonLawJustice',
    'mesopotamianNisabaScribe',
    'pythagoreanTetraktys',
    'wealthPipeline',
    'sajuClassicYongshin',
    'sajuTwelveStagesTomb',
    'geokguk',
    'ziweiFlyingStars',
    'contractShield',
    'strategicLeverage',
    'kyusei',
    'honggukQimen',
    'instantDecision',
    'quantumLeap',
    'hermeticKybalion',
    'mayanTzolkin',
    'fengShuiEightMansions',
    'guiguziLiangtouqian',
  ],
  relationship_love: [
    'swissJungIndividuationArchetype',
    'koreanChusaKimJeonghuiSehando',
    'frenchPascalPenseesHeartReason',
    'islamicSufiRumiMasnaviDivineLove',
    'baruchSpinozaEthicaConatusAmorDei',
    'danishKierkegaardStagesOfLife',
    'egyptianHermeticCartouche',
    'tiebanShenshu',
    'druidMoonTrees',
    'persianAmeshaSpenta',
    'esseneCommunion',
    'karmicSynastry',
    'contextualSynastry',
    'destinySynastryEcho',
    'compatibility',
    'tarotElementalCourt',
    'sukuyoAdvanced',
    'tarotMaster',
    'tarotTreeOfLifeShadow',
    'soulJourneyTarot',
    'shadowArchetype',
    'ziweiHuaJi',
    'celticTreeOgham',
    'sufiLataif',
    'hawaiianHuna',
    'slavicSvarog',
  ],
  immediate_decision: [
    'italianThomasAquinasSummaTheologiae',
    'britishFrancisBaconNovumOrganum',
    'koreanRyuSeongryongJingbirok',
    'northAfricanAugustineConfessionesIlluminatio',
    'italianMachiavelliVirtuFortuna',
    'koreanChoeChiwonPungryudo',
    'swissJungIndividuationArchetype',
    'germanHegelDialecticalAufheben',
    'koreanDasanJeongYagyongMokminSimseo',
    'danishKierkegaardStagesOfLife',
    'germanNietzscheZarathustraAmorFati',
    'koreanSeosanHyujeongSeongaGwigam',
    'frenchPascalPenseesHeartReason',
    'germanSchopenhauerWillRepresentation',
    'koreanChusaKimJeonghuiSehando',
    'ancientIndianNagarjunaMadhyamakaSunyata',
    'koreanJinulJeonghyeSsangsuDonohJeomsu',
    'renaissanceBrunoInfiniteUniverseHeroicFurore',
    'islamicSufiRumiMasnaviDivineLove',
    'koreanUisangHwaeomIlseungBeopgye',
    'frenchMontaigneEssaisWisdom',
    'ancientChineseSunTzuArtOfWarStrategy',
    'frenchDescartesCogitoClaraDistincta',
    'ancientIndianEarlyBuddhistFourNobleTruths',
    'germanKantCategoricalImperativeSynthesis',
    'indianUpanishadicTatTvamAsi',
    'koreanChoeHangiGihakUnwha',
    'ancientGreekEpictetusDichotomyOfControl',
    'ancientChineseConfuciusAnalectsZhitianming',
    'baruchSpinozaEthicaConatusAmorDei',
    'ancientGreekPlatonicIdeaCave',
    'koreanToegyeSeonghakSipdo',
    'romanCiceroDeOfficiisHonestum',
    'ancientGreekSocraticMaieuticDaimon',
    'chineseMenciusFourSproutsHoyeon',
    'romanSenecaTimeSovereignty',
    'ancientGreekAristotleMesotesEudaimonia',
    'ancientIndianBhagavadGitaKarmaYoga',
    'chineseWangYangmingLiangzhiXinxue',
    'koreanYulgokGyeokmongYogyeol',
    'laoziDaodejingWaterWay',
    'ancientGreekEpicureanTetrapharmakos',
    'heraclitusPantaRheiLogos',
    'romanAureliusInnerCitadel',
    'delphicChilonSpartanModeration',
    'zoroastrianAmeshaSpentasLight',
    'celticLughSamildanachAllArts',
    'koreanChoeHyeonbaeHangeulGeulbon',
    'yiSunSinNanjungIlgiStrategic',
    'eddicYggdrasilNineRealms',
    'koreanJeonBongjunNokduGeneral',
    'mixtecEightDeerJaguarClaw',
    'koreanSuunGasiHeon',
    'celticDruidBrehonLawJustice',
    'wonhyoHwajaeng',
    'egyptianAmduat',
    'heianOnmyodoSeimei',
    'etruscanAugurSixteenSky',
    'sumerianEnumaElishFiftyNames',
    'alexandrianDecanThirtySixGods',
    'romanStoicProhairesis',
    'koreanPungryudoHwarang',
    'sumerianInannaUnderworldDescent',
    'toltecNagualDreaming',
    'greekMoiraiAnankeFate',
    'egyptianSphinxDreamOracle',
    'plumBlossomMeihuaOracle',
    'sumerianFiftyMes',
    'babylonianEnumaElish',
    'instantDecision',
    'tarotElementalCourt',
    'ichingMaster',
    'iching384Yao',
    'liurenMaster',
    'synchronicityOmen',
    'quantumProbabilisticTimeline',
    'honggukQimen',
    'mesopotamianSevenGates',
    'celticTreeOgham',
    'vibrationalSoulQuest',
    'nordicRunes',
    'delphicMaxims',
    'zoroastrianAsha',
    'guiguziLiangtouqian',
  ],
  daily_timing_transit: [
    'aztecTonalamatl',
    'mongolianTengriHiimori',
    'etruscanAugurSixteenSky',
    'alexandrianDecanThirtySixGods',
    'taoistLieziWindRiding',
    'patanjaliAshtangaYoga',
    'norseVolvaSeidrNineRealms',
    'chaldeanMulApinAstrology',
    'zhongLuAlchemy',
    'druidMoonTrees',
    'taoistHuangtingJing',
    'huangdiFiveMovementsSixQi',
    'chronoTransit',
    'vitalityCurve',
    'biorhythmPeakFlow',
    'synchronicityOmen',
    'specialStarsMatrix',
    'sajuClassicYongshin',
    'taoistNeidanMeridian',
    'fiveEmotionsPulse',
    'mayanTzolkin',
    'egyptianDecans',
    'ayurvedicTridosha',
  ],
  life_season_timing: [
    'gyeogamYurok',
    'greekMoiraiAnankeFate',
    'lifeSeasonTiming',
    'monthlyFlow',
    'samjaeGyoUn',
    'pythagoreanLifecycle',
    'astrologicalDecanSabian',
    'sajuClassicYongshin',
    'tibetanBardo',
    'egyptianDecans',
    'mayanTzolkin',
    'guiguziLiangtouqian',
  ],
  vitality_wellness: [
    'tibetanPhowaRainbowBody',
    'pythagoreanHarmoniaSpheres',
    'taoistShangqingTwentyFourSpirits',
    'baopuziElixirs',
    'tibetanBonNineWays',
    'zhongLuAlchemy',
    'druidMoonTrees',
    'taoistHuangtingJing',
    'huangdiFiveMovementsSixQi',
    'esseneCommunion',
    'energeticPrescription',
    'vitalityCurve',
    'medicalBioMatrix',
    'chakraVibrationAlignment',
    'somaticBodyArmoring',
    'taoistNeidanMeridian',
    'solfeggioHarmonic',
    'ethericAuraBiofield',
    'biorhythmPeakFlow',
    'taoistSanbao',
    'fiveEmotionsPulse',
    'sufiLataif',
    'alchemicalTransmutation',
    'ayurvedicTridosha',
    'hawaiianHuna',
    'fengShuiEightMansions',
    'hinduKundalini',
  ],
  creative_mind: [
    'mesopotamianNisabaScribe',
    'rosicrucianChymicalWedding',
    'samkhyaTwentyFiveTattvas',
    'etruscanAugurSixteenSky',
    'sumerianEnumaElishFiftyNames',
    'taoistLieziWindRiding',
    'persianAttarSevenValleys',
    'hermeticPoimandres',
    'kashmirShaivismSpanda',
    'koreanPungryudoHwarang',
    'buddhistYogacaraConsciousness',
    'vedicMandukyaTuriya',
    'kabbalisticZoharSoul',
    'zhuangziXiaoyaoyouButterfly',
    'egyptianSphinxDreamOracle',
    'eleusinianMysteries',
    'druidMoonTrees',
    'persianAmeshaSpenta',
    'pythagoreanTetraktys',
    'kabbalah',
    'tarotMaster',
    'tarotTreeOfLifeShadow',
    'sacredVortexGeometry',
    'akashicRecordsOracle',
    'soulJourneyTarot',
    'alchemicalTransmutation',
    'hermeticKybalion',
    'celticTreeOgham',
    'mayanTzolkin',
    'nordicRunes',
    'slavicSvarog',
  ],
  life_reflection: [
    'islamicSufiRumiMasnaviDivineLove',
    'koreanUisangHwaeomIlseungBeopgye',
    'frenchMontaigneEssaisWisdom',
    'ancientChineseSunTzuArtOfWarStrategy',
    'frenchDescartesCogitoClaraDistincta',
    'ancientIndianEarlyBuddhistFourNobleTruths',
    'germanKantCategoricalImperativeSynthesis',
    'indianUpanishadicTatTvamAsi',
    'koreanChoeHangiGihakUnwha',
    'ancientGreekEpictetusDichotomyOfControl',
    'ancientChineseConfuciusAnalectsZhitianming',
    'baruchSpinozaEthicaConatusAmorDei',
    'ancientGreekPlatonicIdeaCave',
    'koreanToegyeSeonghakSipdo',
    'romanCiceroDeOfficiisHonestum',
    'ancientGreekSocraticMaieuticDaimon',
    'chineseMenciusFourSproutsHoyeon',
    'romanSenecaTimeSovereignty',
    'ancientGreekAristotleMesotesEudaimonia',
    'ancientIndianBhagavadGitaKarmaYoga',
    'chineseWangYangmingLiangzhiXinxue',
    'laoziDaodejingWaterWay',
    'ancientGreekEpicureanTetrapharmakos',
    'koreanYulgokGyeokmongYogyeol',
    'heraclitusPantaRheiLogos',
    'moziGyeomAeUniversalLove',
    'romanAureliusInnerCitadel',
    'zoroastrianAmeshaSpentasLight',
    'delphicChilonSpartanModeration',
    'koreanJeongYakyongMongminSimseo',
    'koreanChoeHyeonbaeHangeulGeulbon',
    'ptahMemphiteHeartTongueCreation',
    'eddicYggdrasilNineRealms',
    'atrahasisFloodWisdom',
    'yiSunSinNanjungIlgiStrategic',
    'eleusinianTriptolemosCivilization',
    'koreanJeonBongjunNokduGeneral',
    'celticDruidBrehonLawJustice',
    'mesopotamianNisabaScribe',
    'koreanSuunGasiHeon',
    'wonhyoHwajaeng',
    'mayiMianxiang',
    'egyptianAmduat',
    'gyeogamYurok',
    'heianOnmyodoSeimei',
    'polynesianWayfinding',
    'cheonbugyeongEightyOne',
    'hinduSriYantra',
    'lakotaMedicineWheel',
    'rosicrucianChymicalWedding',
    'aztecTonalamatl',
    'mongolianTengriHiimori',
    'samkhyaTwentyFiveTattvas',
    'neoConfucianFourSevenLiQi',
    'sumerianEnumaElishFiftyNames',
    'alexandrianDecanThirtySixGods',
    'taoistLieziWindRiding',
    'persianAttarSevenValleys',
    'hermeticPoimandres',
    'kashmirShaivismSpanda',
    'romanStoicProhairesis',
    'patanjaliAshtangaYoga',
    'koreanPungryudoHwarang',
    'buddhistYogacaraConsciousness',
    'vedicMandukyaTuriya',
    'kabbalisticZoharSoul',
    'zhuangziXiaoyaoyouButterfly',
    'norseVolvaSeidrNineRealms',
    'sumerianInannaUnderworldDescent',
    'gnosticPistisSophiaPleroma',
    'shugendoYamabushiTenRealms',
    'toltecNagualDreaming',
    'greekMoiraiAnankeFate',
    'egyptianSphinxDreamOracle',
    'chaldeanMulApinAstrology',
    'plumBlossomMeihuaOracle',
    'pythagoreanHarmoniaSpheres',
    'tibetanPhowaRainbowBody',
    'celticTuathaFourTreasures',
    'sumerianApkalluWisdom',
    'taoistShangqingTwentyFourSpirits',
    'vedicMahavakya',
    'vedicPanchaKosha',
    'egyptianMaatFeatherHeart',
    'koreanDangunCheonbuin',
    'maoriMauriHauora',
    'slavicMokoshFateWeaving',
    'jainGunasthanaKarma',
    'celticAwenTaliesin',
    'shanhaijingSacredBeasts',
    'shintoKotodamaFourSouls',
    'aboriginalDreamtimeSonglines',
    'finnishKalevalaSampo',
    'yorubaIfaOdu',
    'arabicIlmAlRaml',
    'hinduNadiAgastyaPalmLeaf',
    'vedicNakshatra108Pada',
    'egyptianHermeticCartouche',
    'taoistGongGuoGeKarma',
    'tiebanShenshu',
    'tibetanBonNineWays',
    'eleusinianMysteries',
    'sumerianFiftyMes',
    'zhongLuAlchemy',
    'druidMoonTrees',
    'babylonianEnumaElish',
    'taoistHuangtingJing',
    'persianAmeshaSpenta',
    'esseneCommunion',
    'huangdiFiveMovementsSixQi',
    'pythagoreanTetraktys',
    'supremeWisdomTrinity',
    'ichingMaster',
    'heLuoLiShu',
    'vedicAdvanced',
    'karmicNodes',
    'heroMythMonomyth',
    'ancestralEpigeneticKarma',
    'tibetanBardo',
    'sufiLataif',
    'taoistSanbao',
    'alchemicalTransmutation',
    'delphicMaxims',
    'ayurvedicTridosha',
    'hawaiianHuna',
    'zoroastrianAsha',
    'hinduKundalini',
    'slavicSvarog',
  ],
};

function shouldIncludeEngine(engineKey: string, options?: FormatDeterministicEngineOptions): boolean {
  if (!options || options.isMasterMobilization !== false) {
    return true;
  }
  if (engineKey === 'chronoTransit') return true;

  const intent = options.intent;
  const allowedForIntent = intent ? INTENT_SPECIALIZED_ENGINES[intent] : undefined;
  if (allowedForIntent) {
    return allowedForIntent.includes(engineKey);
  }

  if (options.focusTools && options.focusTools.length > 0) {
    const focus = options.focusTools;
    if (focus.includes('saju') && ['sajuClassicYongshin', 'geokguk', 'specialStarsMatrix', 'vitalityCurve'].includes(engineKey)) return true;
    if (focus.includes('tarot') && ['tarotMaster', 'tarotTreeOfLifeShadow', 'soulJourneyTarot'].includes(engineKey)) return true;
    if (focus.includes('iching') && ['ichingMaster', 'instantDecision'].includes(engineKey)) return true;
    if (focus.includes('qimen') && ['honggukQimen', 'instantDecision'].includes(engineKey)) return true;
    if (focus.includes('ziwei') && ['ziweiFlyingStars'].includes(engineKey)) return true;
    if (focus.includes('sukuyo') && ['sukuyoAdvanced', 'destinySynastryEcho'].includes(engineKey)) return true;
    if (focus.includes('astrology') && ['astrologicalDecanSabian', 'contextualSynastry'].includes(engineKey)) return true;
  }

  return ['chronoTransit', 'sajuClassicYongshin', 'tarotTreeOfLifeShadow', 'supremeWisdomTrinity', 'vitalityCurve'].includes(engineKey);
}

/**
 * 결정론적 계산 엔진 리포트를 LLM 프롬프트에 주입하기 위해
 * 명확하고 가독성 높은 구조화된 텍스트 및 JSON 블록으로 변환합니다.
 */
export function formatDeterministicEnginePrompt(
  report: DeterministicEngineReport,
  options?: FormatDeterministicEngineOptions
): string {
  const included = getIncludedCalculationTools(report, options);
  const evidence = included.map(tool => ({
    tool: tool.toolKoName, status: report.masterReview && REVIEW_PENDING_CORE.has(tool.toolId) && tool.data != null ? 'symbolic' : tool.status, method: tool.method,
    note: tool.note, limitations: tool.limitations,
    ...(report.masterReview && REVIEW_PENDING_CORE.has(tool.toolId)
      ? { perspectives: getSymbolicPerspective(tool.data) }
      : tool.status === 'calculated' && tool.data != null ? { data: tool.data } : {}),
  }));
  const calculated = included.filter(tool => tool.status === 'calculated' && tool.data != null && !(report.masterReview && REVIEW_PENDING_CORE.has(tool.toolId)));
  const symbolicReview = getMasterSymbolicReview(report, options);
  return `[이번 질문의 계산 근거 및 한계]
기준 시각: ${report.calculatedAtKst}
입력 생년월일: ${report.inputProfile.solarDateString || '미입력'} · 생시: ${report.inputProfile.birthtime || '미입력'}
답변에 전달한 계산 성공 도구: ${calculated.map(tool => tool.toolKoName).join(', ') || '없음'}

아래 상태표의 calculated와 실제 data가 함께 있는 항목만 계산 근거로 사용한다.
이 결과는 천문 위치 또는 구현된 전통 규칙의 산출값이며, 해석·미래 예측의 정확성을 입증한 실측값이 아니다.
skipped/error/partial/symbolic/not_implemented는 계산 성공으로 표현하거나 엔진 가동 수에 포함하지 않는다.
입력 부족·실패는 솔직하게 안내하고 필요한 생년월일·생시를 요청하되, 일반 조언과 대화는 계속한다.
출생시간을 모르면 정오 등 기본값으로 계산된 부분을 확정하지 말고 한계를 설명한다.
등록된 엔진 개수나 마스터 모드만으로 전체 엔진이 실행됐다고 말하지 않는다.
해시 기반 점수·영적 방패율·에너지 지수는 정밀 계산 및 측정값이 아니며 이번 답변의 수치 근거에서 제외했다.
철학·신화 관점을 사용하면 '상징적 참고'로 명시하고 실제 측정·의학·과학적 검증으로 표현하지 않는다.
타로 수비학·생일카드 계산은 무작위 카드 추첨이 아니다. 실제 추첨은 별도로 제공된 앱 추첨 기록만 인정한다.
응답에는 이번 질문에 실제 사용한 계산 근거와 필요한 한계만 짧게 알려준다.

[계산 상태 및 데이터 JSON]
${JSON.stringify(evidence, null, 2)}
[JSON 끝]
${report.masterReview ? `[마스터 전체 검토: ${getCalculationAudit(report, options).length}개 항목]
아래 항목은 모두 검토 대상으로 평가했다. symbolic은 실제 계산 성공이나 실측값이 아니라 상징적 조언으로만 전달한 것이다.
skipped/error는 입력 부족·실패·제공할 안전한 관점 없음으로 제외한 항목이다. 모두 사용했다고 주장하지 않는다.
사용 가능한 계산과 상징 관점을 빠짐없이 검토하고, 질문과 관련된 공통점·차이·충돌을 종합한다. 서로 모순되면 억지로 일치시켜 결론내리지 않는다.
상징은 상징이라고 밝히며 확률·건강 진단·미래 보장·영적 수치로 바꾸지 않는다.
${JSON.stringify(symbolicReview, null, 2)}` : ''}`;
}
