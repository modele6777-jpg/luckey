import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateIching, castIching, hexagram } from '../src/lib/divination/iching';
import { calculateZiwei, calculateSukuyo, calculateVedic, sukuyoFromLunar, sukuyoRelationship } from '../src/lib/divination/birthCharts';
import { calculateLiuren, calculateQimen, eventInstant } from '../src/lib/divination/eventCharts';
import { getLiuRenByYueJiang } from 'liuren-ts-lib';
import { SearchSunLongitude } from 'astronomy-engine';
import { buildUserFifteenToolsDigest } from '../src/lib/fifteenDivinationTools';
import { calculateTojeong, formatTojeongPrompt } from '../src/lib/divination/tojeongEngine';
import { calculateKyusei, formatKyuseiPrompt, KYUSEI_ENGINE_VERSION } from '../src/lib/divination/kyuseiEngine';
import { calculateSamjaeGyoUn, formatSamjaeGyoUnPrompt, SAMJAE_GYOUN_ENGINE_VERSION } from '../src/lib/divination/samjaeGyoUnEngine';
import { calculateLiurenMaster, formatLiurenMasterPrompt, LIUREN_MASTER_ENGINE_VERSION } from '../src/lib/divination/liurenMasterEngine';
import { calculateIchingMaster, formatIchingMasterPrompt, ICHING_MASTER_ENGINE_VERSION } from '../src/lib/divination/ichingMasterEngine';
import { calculateTarotMaster, formatTarotMasterPrompt, TAROT_MASTER_ENGINE_VERSION } from '../src/lib/divination/tarotMasterEngine';
import { calculateHeLuoLiShu, formatHeLuoLiShuPrompt, HELUOLISHU_ENGINE_VERSION } from '../src/lib/divination/heLuoLiShuEngine';
import { calculateZiweiFlyingStars, formatZiweiFlyingStarsPrompt, ZIWEI_FLYING_STARS_ENGINE_VERSION } from '../src/lib/divination/ziweiFlyingStarsEngine';
import { calculateDynamicClashTrigger, formatDynamicClashPrompt, DYNAMIC_CLASH_ENGINE_VERSION } from '../src/lib/divination/dynamicClashTriggerEngine';
import { calculateTwelveSpiritsCycle, formatTwelveSpiritsPrompt, TWELVE_SPIRITS_ENGINE_VERSION } from '../src/lib/divination/twelveSpiritsCycleEngine';
import { calculatePythagoreanLifecycle, formatPythagoreanLifecyclePrompt, PYTHAGOREAN_LIFECYCLE_VERSION } from '../src/lib/divination/pythagoreanLifecycleEngine';
import { calculateAstrologicalDecanSabian, formatAstrologicalDecanSabianPrompt, ASTRO_DECAN_SABIAN_VERSION } from '../src/lib/divination/astrologicalDecanSabianEngine';
import { calculateMedicalBioMatrix, formatMedicalBioMatrixPrompt, MEDICAL_BIO_MATRIX_VERSION } from '../src/lib/divination/medicalBioMatrixEngine';
import { calculateLifeSeasonTiming, formatLifeSeasonTimingPrompt, LIFE_SEASON_ENGINE_VERSION } from '../src/lib/divination/lifeSeasonTimingEngine';
import { calculateWealthPipeline, formatWealthPipelinePrompt, WEALTH_PIPELINE_VERSION } from '../src/lib/divination/wealthPipelineEngine';
import { calculateKarmicNodes, formatKarmicNodesPrompt, KARMIC_NODES_ENGINE_VERSION } from '../src/lib/divination/karmicNodesEngine';
import { calculateMentalResilience, formatMentalResiliencePrompt, MENTAL_RESILIENCE_VERSION } from '../src/lib/divination/mentalResilienceEngine';
import { calculateNobleNetwork, formatNobleNetworkPrompt, NOBLE_NETWORK_VERSION } from '../src/lib/divination/nobleNetworkEngine';
import { calculateMonthlyFlow, formatMonthlyFlowPrompt, MONTHLY_FLOW_ENGINE_VERSION } from '../src/lib/divination/monthlyFlowEngine';
import { calculateVoicePersona, formatVoicePersonaPrompt, VOICE_PERSONA_VERSION } from '../src/lib/divination/voicePersonaEngine';
import { calculateContractShield, formatContractShieldPrompt, CONTRACT_SHIELD_VERSION } from '../src/lib/divination/contractShieldEngine';
import { calculateLifeDomainWheel, formatLifeDomainWheelPrompt, LIFE_DOMAIN_WHEEL_VERSION } from '../src/lib/divination/lifeDomainWheelEngine';
import { calculateEnergeticPrescription, formatEnergeticPrescriptionPrompt, ENERGETIC_PRESCRIPTION_ENGINE_VERSION } from '../src/lib/divination/energeticPrescriptionEngine';
import { calculateInstantDecision, formatInstantDecisionPrompt, INSTANT_DECISION_ENGINE_VERSION } from '../src/lib/divination/instantDecisionEngine';
import { calculateDeepWorkFlow, formatDeepWorkFlowPrompt, DEEP_WORK_FLOW_VERSION } from '../src/lib/divination/deepWorkFlowEngine';
import { calculateSleepSubconscious, formatSleepSubconsciousPrompt, SLEEP_SUBCONSCIOUS_VERSION } from '../src/lib/divination/sleepSubconsciousEngine';
import { calculateQuantumLeapTiming, formatQuantumLeapPrompt, QUANTUM_LEAP_VERSION } from '../src/lib/divination/quantumLeapTimingEngine';
import { calculateElementalResonance, formatElementalResonancePrompt, ELEMENTAL_RESONANCE_VERSION } from '../src/lib/divination/elementalResonanceEngine';
import { calculateYinYangPolarity, formatYinYangPolarityPrompt, YIN_YANG_POLARITY_VERSION } from '../src/lib/divination/yinYangPolarityEngine';
import { calculateRuneMatrix, formatRuneMatrixPrompt, RUNE_MATRIX_VERSION } from '../src/lib/divination/runeMatrixEngine';
import { calculateSoulJourneyTarot, formatSoulJourneyTarotPrompt, SOUL_JOURNEY_TAROT_VERSION } from '../src/lib/divination/soulJourneyTarotEngine';
import { calculateTranscendentalMeditation, formatTranscendentalMeditationPrompt, TRANSCENDENTAL_MEDITATION_VERSION } from '../src/lib/divination/transcendentalMeditationEngine';
import { formatSajuDestinyShareText, type SajuDestinyStoryData } from '../src/utils/sajuDestinyExporter';
import { calculateStrategicLeverage, formatStrategicLeveragePrompt, STRATEGIC_LEVERAGE_VERSION } from '../src/lib/divination/strategicLeverageEngine';
import { calculateSpatialFengshui, formatSpatialFengshuiPrompt, SPATIAL_FENGSHUI_VERSION } from '../src/lib/divination/spatialFengshuiEngine';
import { calculateSpecialStarsMatrix, formatSpecialStarsPrompt, SPECIAL_STARS_VERSION } from '../src/lib/divination/specialStarsEngine';
import { calculateShadowArchetype, formatShadowArchetypePrompt, SHADOW_ARCHETYPE_VERSION } from '../src/lib/divination/shadowArchetypeEngine';
import { calculateBiorhythmPeakFlow, formatBiorhythmPeakFlowPrompt, BIORHYTHM_PEAK_FLOW_VERSION } from '../src/lib/divination/biorhythmPeakFlowEngine';
import { calculateDestinySynastryEcho, formatDestinySynastryEchoPrompt, DESTINY_SYNASTRY_ECHO_VERSION } from '../src/lib/divination/destinySynastryEchoEngine';
import { calculateMicroHabitKarma, formatMicroHabitKarmaPrompt, MICRO_HABIT_KARMA_VERSION } from '../src/lib/divination/microHabitKarmaEngine';
import { calculateIkigaiDestinyCompass, formatIkigaiDestinyCompassPrompt, IKIGAI_DESTINY_COMPASS_VERSION } from '../src/lib/divination/ikigaiDestinyCompassEngine';
import { calculateSerendipitySynchronicity, formatSerendipitySynchronicityPrompt, SERENDIPITY_SYNCHRONICITY_VERSION } from '../src/lib/divination/serendipitySynchronicityEngine';
import { calculateHumanDesignBodyGraph, formatHumanDesignBodyGraphPrompt, HUMAN_DESIGN_BODYGRAPH_VERSION } from '../src/lib/divination/humanDesignBodyGraphEngine';
import { calculateChakraVibrationAlignment, formatChakraVibrationAlignmentPrompt, CHAKRA_ALIGNMENT_VERSION } from '../src/lib/divination/chakraVibrationAlignmentEngine';
import { calculateEnneagramSoulIntegration, formatEnneagramSoulIntegrationPrompt, ENNEAGRAM_INTEGRATION_VERSION } from '../src/lib/divination/enneagramSoulIntegrationEngine';
import { calculateAncestralEpigeneticKarma, formatAncestralEpigeneticKarmaPrompt, ANCESTRAL_KARMA_VERSION } from '../src/lib/divination/ancestralEpigeneticKarmaEngine';
import { calculateShamanicAnimalTotem, formatShamanicAnimalTotemPrompt, SHAMANIC_ANIMAL_TOTEM_VERSION } from '../src/lib/divination/shamanicAnimalTotemEngine';
import { calculateHeroMythMonomyth, formatHeroMythMonomythPrompt, HERO_MONOMYTH_VERSION } from '../src/lib/divination/heroMythMonomythEngine';
import { calculateAkashicRecordsOracle, formatAkashicRecordsOraclePrompt, AKASHIC_RECORDS_VERSION } from '../src/lib/divination/akashicRecordsOracleEngine';
import { calculateQuantumProbabilisticTimeline, formatQuantumProbabilisticTimelinePrompt, QUANTUM_TIMELINE_VERSION } from '../src/lib/divination/quantumProbabilisticTimelineEngine';
import { calculateSomaticBodyArmoring, formatSomaticBodyArmoringPrompt, SOMATIC_ARMORING_VERSION } from '../src/lib/divination/somaticBodyArmoringEngine';
import { calculateSupremeWisdomTrinity, formatSupremeWisdomTrinityPrompt, SUPREME_WISDOM_TRINITY_VERSION } from '../src/lib/divination/supremeWisdomTrinityEngine';
import { calculateSacredVortexGeometry, formatSacredVortexGeometryPrompt, SACRED_VORTEX_VERSION } from '../src/lib/divination/sacredVortexGeometryEngine';
import { calculateTaoistNeidanMeridian, formatTaoistNeidanMeridianPrompt, TAOIST_NEIDAN_VERSION } from '../src/lib/divination/taoistNeidanMeridianEngine';
import { calculateSynchronicityOmen, formatSynchronicityOmenPrompt, SYNCHRONICITY_OMEN_VERSION } from '../src/lib/divination/synchronicityOmenEngine';
import { calculateEthericAuraBiofield, formatEthericAuraBiofieldPrompt, ETHERIC_AURA_VERSION } from '../src/lib/divination/ethericAuraBiofieldEngine';
import { calculateSajuClassicYongshin, formatSajuClassicYongshinPrompt, SAJU_CLASSIC_YONGSHIN_VERSION } from '../src/lib/divination/sajuClassicYongshinPrescriptionEngine';
import { calculateTarotTreeOfLifeShadow, formatTarotTreeOfLifeShadowPrompt, TAROT_KABBALAH_SHADOW_VERSION } from '../src/lib/divination/tarotTreeOfLifeShadowEngine';
import { calculateHellenisticLots, formatHellenisticLotsPrompt, HELLENISTIC_LOTS_ENGINE_VERSION } from '../src/lib/divination/hellenisticLotsEngine';
import { calculateIching384Yao, formatIching384YaoPrompt, ICHING_384YAO_ENGINE_VERSION } from '../src/lib/divination/iching384YaoEngine';
import { calculateSajuTwelveStagesTomb, formatSajuTwelveStagesTombPrompt, SAJU_12STAGES_TOMB_VERSION } from '../src/lib/divination/sajuTwelveStagesTombUnlockEngine';
import { calculateTarotElementalCourt, formatTarotElementalCourtPrompt, TAROT_ELEMENTAL_COURT_VERSION } from '../src/lib/divination/tarotElementalCourtPersonaEngine';
import { calculateKarmicSynastry, formatKarmicSynastryPrompt, KARMIC_SYNASTRY_VERSION } from '../src/lib/divination/karmicSynastryResonanceEngine';
import { calculateFiveEmotionsPulse, formatFiveEmotionsPulsePrompt, FIVE_EMOTIONS_PULSE_VERSION } from '../src/lib/divination/fiveEmotionsPulseEngine';
import { calculateHermeticKybalion, formatHermeticKybalionPrompt, HERMETIC_KYBALION_VERSION } from '../src/lib/divination/hermeticKybalionEngine';
import { calculateVibrationalSoulQuest, formatVibrationalSoulQuestPrompt, VIBRATIONAL_SOUL_QUEST_VERSION } from '../src/lib/divination/vibrationalSoulQuestEngine';
import { calculateAlchemicalTransmutation, formatAlchemicalTransmutationPrompt, ALCHEMICAL_TRANSMUTATION_VERSION } from '../src/lib/divination/alchemicalTransmutationEngine';
import { calculateZiweiHuaJiTransformation, formatZiweiHuaJiTransformationPrompt, ZIWEI_HUAJI_VERSION } from '../src/lib/divination/ziweiHuaJiTransformationEngine';
import { calculateCelticTreeOgham, formatCelticTreeOghamPrompt, CELTIC_OGHAM_VERSION } from '../src/lib/divination/celticTreeOghamEngine';
import { calculateTaoistSanbaoInnerAlchemy, formatTaoistSanbaoInnerAlchemyPrompt, TAOIST_SANBAO_VERSION } from '../src/lib/divination/taoistSanbaoInnerAlchemyEngine';
import { calculateTibetanBardoNavigation, formatTibetanBardoNavigationPrompt, TIBETAN_BARDO_VERSION } from '../src/lib/divination/tibetanBardoNavigationEngine';
import { calculateMesopotamianSevenGates, formatMesopotamianSevenGatesPrompt, MESOPOTAMIAN_GATES_VERSION } from '../src/lib/divination/mesopotamianSevenGatesEngine';
import { calculateEgyptianThirtySixDecans, formatEgyptianThirtySixDecansPrompt, EGYPTIAN_DECANS_VERSION } from '../src/lib/divination/egyptianThirtySixDecansEngine';
import { calculateSufiLataifSoulAscension, formatSufiLataifSoulAscensionPrompt, SUFI_LATAIF_VERSION } from '../src/lib/divination/sufiLataifSoulAscensionEngine';
import { calculateMayanTzolkinSacredCalendar, formatMayanTzolkinSacredCalendarPrompt, MAYAN_TZOLKIN_VERSION } from '../src/lib/divination/mayanTzolkinSacredCalendarEngine';
import { calculateNordicElderFutharkRunes, formatNordicElderFutharkRunesPrompt, NORDIC_RUNES_VERSION } from '../src/lib/divination/nordicElderFutharkRunesEngine';
import { calculateDelphicMaximsOracle, formatDelphicMaximsOraclePrompt, DELPHIC_MAXIMS_VERSION } from '../src/lib/divination/delphicMaximsOracleEngine';
import { calculateAyurvedicTridoshaPrana, formatAyurvedicTridoshaPranaPrompt, AYURVEDIC_TRIDOSHA_VERSION } from '../src/lib/divination/ayurvedicTridoshaPranaEngine';
import { calculateHawaiianHunaHooponopono, formatHawaiianHunaHooponoponoPrompt, HAWAIIAN_HUNA_VERSION } from '../src/lib/divination/hawaiianHunaHooponoponoEngine';
import { calculateFengShuiEightMansions, formatFengShuiEightMansionsPrompt, FENG_SHUI_EIGHT_MANSIONS_VERSION } from '../src/lib/divination/fengShuiEightMansionsEngine';
import { calculateZoroastrianAshaTruth, formatZoroastrianAshaTruthPrompt, ZOROASTRIAN_ASHA_VERSION } from '../src/lib/divination/zoroastrianAshaTruthEngine';
import { calculateHinduTantricKundalini, formatHinduTantricKundaliniPrompt, HINDU_KUNDALINI_VERSION } from '../src/lib/divination/hinduTantricKundaliniEngine';
import { calculateGuiguziLiangtouqian, formatGuiguziLiangtouqianPrompt, GUIGUZI_VERSION } from '../src/lib/divination/guiguziLiangtouqianEngine';
import { calculateSlavicSvarogCircle, formatSlavicSvarogCirclePrompt, SLAVIC_SVAROG_VERSION } from '../src/lib/divination/slavicSvarogCircleEngine';
import { calculateEsseneCommunion, formatEsseneCommunionPrompt, ESSENE_COMMUNION_VERSION } from '../src/lib/divination/esseneCommunionTreeEngine';
import { calculateHuangdiFiveMovementsSixQi, formatHuangdiFiveMovementsSixQiPrompt, HUANGDI_YUNQI_VERSION } from '../src/lib/divination/huangdiFiveMovementsSixQiEngine';
import { calculatePythagoreanTetraktys, formatPythagoreanTetraktysPrompt, PYTHAGOREAN_TETRAKTYS_VERSION } from '../src/lib/divination/pythagoreanTetraktysGematriaEngine';
import { calculateBabylonianEnumaElish, formatBabylonianEnumaElishPrompt, BABYLONIAN_ENUMA_ELISH_VERSION } from '../src/lib/divination/babylonianEnumaElishEngine';
import { calculateTaoistHuangtingJing, formatTaoistHuangtingJingPrompt, TAOIST_HUANGTING_VERSION } from '../src/lib/divination/taoistHuangtingJingEngine';
import { calculatePersianAmeshaSpenta, formatPersianAmeshaSpentaPrompt, PERSIAN_AMESHA_SPENTA_VERSION } from '../src/lib/divination/persianAmeshaSpentaEngine';
import { calculateSumerianFiftyMes, formatSumerianFiftyMesPrompt, SUMERIAN_FIFTY_MES_VERSION } from '../src/lib/divination/sumerianFiftyMesEngine';
import { calculateZhongLuInnerAlchemy, formatZhongLuInnerAlchemyPrompt, ZHONG_LU_INNER_ALCHEMY_VERSION } from '../src/lib/divination/zhongLuInnerAlchemyEngine';
import { calculateDruidMoonTrees, formatDruidMoonTreesPrompt, DRUID_MOON_TREES_VERSION } from '../src/lib/divination/druidThirteenMoonTreesEngine';
import { calculateTiebanShenshu, formatTiebanShenshuPrompt, TIEBAN_SHENSHU_VERSION } from '../src/lib/divination/tiebanShenshuEngine';
import { calculateTibetanBonNineWays, formatTibetanBonNineWaysPrompt, TIBETAN_BON_NINE_WAYS_VERSION } from '../src/lib/divination/tibetanBonNineWaysEngine';
import { calculateEleusinianMysteries, formatEleusinianMysteriesPrompt, ELEUSINIAN_MYSTERIES_VERSION } from '../src/lib/divination/eleusinianMysteriesEngine';
import { calculateVedicNakshatra108Pada, formatVedicNakshatra108PadaPrompt, VEDIC_NAKSHATRA_108_PADA_ENGINE_VERSION } from '../src/lib/divination/vedicNakshatra108PadaEngine';
import { calculateVitalityCurve, formatVitalityCurvePrompt, VITALITY_CURVE_ENGINE_VERSION } from '../src/lib/divination/vitalityCurveEngine';
import { calculateEgyptianHermeticCartouche, formatEgyptianHermeticCartouchePrompt, EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION } from '../src/lib/divination/egyptianHermeticCartoucheEngine';
import { calculateTaoistGongGuoGeKarma, formatTaoistGongGuoGeKarmaPrompt, TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION } from '../src/lib/divination/taoistGongGuoGeKarmaEngine';
import { calculateYorubaIfaOdu, formatYorubaIfaOduPrompt, YORUBA_IFA_ODU_ENGINE_VERSION } from '../src/lib/divination/yorubaIfaOduEngine';
import { calculateArabicIlmAlRaml, formatArabicIlmAlRamlPrompt, ARABIC_ILM_AL_RAML_ENGINE_VERSION } from '../src/lib/divination/arabicIlmAlRamlEngine';
import { calculateHinduNadiAgastyaPalmLeaf, formatHinduNadiAgastyaPalmLeafPrompt, HINDU_NADI_AGASTYA_PALM_LEAF_ENGINE_VERSION } from '../src/lib/divination/hinduNadiAgastyaPalmLeafEngine';
import { calculateShintoKotodama, formatShintoKotodamaPrompt, SHINTO_KOTODAMA_FOUR_SOULS_ENGINE_VERSION } from '../src/lib/divination/shintoKotodamaFourSoulsEngine';
import { calculateAboriginalDreamtimeSonglines, formatAboriginalDreamtimeSonglinesPrompt, ABORIGINAL_DREAMTIME_SONGLINES_ENGINE_VERSION } from '../src/lib/divination/aboriginalDreamtimeSonglinesEngine';
import { calculateFinnishKalevalaSampo, formatFinnishKalevalaSampoPrompt, FINNISH_KALEVALA_SAMPO_ENGINE_VERSION } from '../src/lib/divination/finnishKalevalaSampoEngine';
import { calculateShanhaijingSacredBeasts, formatShanhaijingSacredBeastsPrompt, SHANHAIJING_SACRED_BEASTS_ENGINE_VERSION } from '../src/lib/divination/shanhaijingSacredBeastsEngine';
import { calculateJainGunasthanaKarma, formatJainGunasthanaKarmaPrompt, JAIN_GUNASTHANA_KARMA_ENGINE_VERSION } from '../src/lib/divination/jainGunasthanaKarmaEngine';
import { calculateCelticAwenTaliesin, formatCelticAwenTaliesinPrompt, CELTIC_AWEN_TALIESIN_ENGINE_VERSION } from '../src/lib/divination/celticAwenTaliesinEngine';
import { calculateKoreanDangunCheonbuin, formatKoreanDangunCheonbuinPrompt, KOREAN_DANGUN_CHEONBUIN_ENGINE_VERSION } from '../src/lib/divination/koreanDangunCheonbuinEngine';
import { calculateMaoriMauriHauora, formatMaoriMauriHauoraPrompt, MAORI_MAURI_HAUORA_ENGINE_VERSION } from '../src/lib/divination/maoriMauriHauoraEngine';
import { calculateSlavicMokoshFateWeaving, formatSlavicMokoshFateWeavingPrompt, SLAVIC_MOKOSH_FATE_WEAVING_ENGINE_VERSION } from '../src/lib/divination/slavicMokoshFateWeavingEngine';
import { calculateSumerianGilgameshTrials, formatSumerianGilgameshTrialsPrompt, SUMERIAN_GILGAMESH_TRIALS_ENGINE_VERSION } from '../src/lib/divination/sumerianGilgameshTwelveTrialsEngine';
import { calculateHawaiianKahunaThreeSelves, formatHawaiianKahunaThreeSelvesPrompt, HAWAIIAN_KAHUNA_THREE_SELVES_ENGINE_VERSION } from '../src/lib/divination/hawaiianKahunaThreeSelvesManaEngine';
import { calculateNordicYggdrasilRealms, formatNordicYggdrasilRealmsPrompt, NORDIC_YGGDRASIL_NINE_REALMS_ENGINE_VERSION } from '../src/lib/divination/nordicYggdrasilNineRealmsEngine';
import { calculateEgyptianMaatFeatherHeart, formatEgyptianMaatFeatherHeartPrompt, EGYPTIAN_MAAT_FEATHER_ENGINE_VERSION } from '../src/lib/divination/egyptianMaatFeatherHeartEngine';
import { calculatePersianMithraicSpheres, formatPersianMithraicSpheresPrompt, PERSIAN_MITHRAIC_SPHERES_ENGINE_VERSION } from '../src/lib/divination/persianMithraicSevenSpheresEngine';
import { calculateOrpheicMysteries, formatOrpheicMysteriesPrompt, ORPHEIC_MYSTERIES_ENGINE_VERSION } from '../src/lib/divination/orpheicMysteriesDionysianEngine';
import { calculatePopolVuhHeroTwins, formatPopolVuhHeroTwinsPrompt, MESOAMERICAN_POPOL_VUH_ENGINE_VERSION } from '../src/lib/divination/mesoamericanPopolVuhHeroTwinsEngine';
import { calculateAncientYarrowProbability, formatAncientYarrowProbabilityPrompt, ANCIENT_YARROW_PROBABILITY_ENGINE_VERSION } from '../src/lib/divination/ancientChineseYarrowIchingProbabilityEngine';
import { calculateVedicPanchaKosha, formatVedicPanchaKoshaPrompt, VEDIC_PANCHA_KOSHA_ENGINE_VERSION } from '../src/lib/divination/vedicPanchaKoshaAlignmentEngine';
import { calculateRomanJanus, formatRomanJanusPrompt, ROMAN_JANUS_ENGINE_VERSION } from '../src/lib/divination/romanJanusThresholdTransitionsEngine';
import { calculateBaopuziElixirs, formatBaopuziElixirsPrompt, BAOPUZI_ELIXIRS_ENGINE_VERSION } from '../src/lib/divination/ancientChineseBaopuziNineElixirsEngine';
import { calculateVedicMahavakya, formatVedicMahavakyaPrompt, VEDIC_MAHAVAKYA_ENGINE_VERSION } from '../src/lib/divination/vedicMahavakyaConsciousnessEngine';
import { calculateSumerianApkalluWisdom, formatSumerianApkalluWisdomPrompt, SUMERIAN_APKALLU_WISDOM_ENGINE_VERSION } from '../src/lib/divination/sumerianApkalluWisdomEngine';
import { calculateCelticTuathaFourTreasures, formatCelticTuathaFourTreasuresPrompt, CELTIC_TUATHA_FOUR_TREASURES_ENGINE_VERSION } from '../src/lib/divination/celticTuathaFourTreasuresEngine';
import { calculateTaoistShangqingTwentyFourSpirits, formatTaoistShangqingTwentyFourSpiritsPrompt, TAOIST_SHANGQING_TWENTY_FOUR_SPIRITS_ENGINE_VERSION } from '../src/lib/divination/taoistShangqingTwentyFourSpiritsEngine';
import { calculateTibetanPhowaRainbowBody, formatTibetanPhowaRainbowBodyPrompt, TIBETAN_PHOWA_RAINBOW_BODY_ENGINE_VERSION } from '../src/lib/divination/tibetanPhowaRainbowBodyEngine';
import { calculatePlumBlossomMeihuaOracle, formatPlumBlossomMeihuaOraclePrompt, PLUM_BLOSSOM_MEIHUA_ORACLE_ENGINE_VERSION } from '../src/lib/divination/plumBlossomMeihuaOracleEngine';
import { calculateGreekMoiraiAnankeFate, formatGreekMoiraiAnankeFatePrompt, GREEK_MOIRAI_ANANKE_FATE_ENGINE_VERSION } from '../src/lib/divination/greekMoiraiAnankeFateEngine';
import { calculateEgyptianSphinxDreamOracle, formatEgyptianSphinxDreamOraclePrompt, EGYPTIAN_SPHINX_DREAM_ORACLE_ENGINE_VERSION } from '../src/lib/divination/egyptianSphinxDreamOracleEngine';
import { calculateChaldeanMulApinAstrology, formatChaldeanMulApinAstrologyPrompt, CHALDEAN_MUL_APIN_ASTROLOGY_ENGINE_VERSION } from '../src/lib/divination/chaldeanMulApinAstrologyEngine';
import { calculateToltecNagualDreaming, formatToltecNagualDreamingPrompt, TOLTEC_NAGUAL_DREAMING_ENGINE_VERSION } from '../src/lib/divination/toltecNagualDreamingEngine';
import { calculateShugendoYamabushiTenRealms, formatShugendoYamabushiTenRealmsPrompt, SHUGENDO_YAMABUSHI_TEN_REALMS_ENGINE_VERSION } from '../src/lib/divination/shugendoYamabushiTenRealmsEngine';
import { calculateGnosticPistisSophiaPleroma, formatGnosticPistisSophiaPleromaPrompt, GNOSTIC_PISTIS_SOPHIA_PLEROMA_ENGINE_VERSION } from '../src/lib/divination/gnosticPistisSophiaPleromaEngine';
import { calculateSumerianInannaUnderworldDescent, formatSumerianInannaUnderworldDescentPrompt, SUMERIAN_INANNA_UNDERWORLD_DESCENT_ENGINE_VERSION } from '../src/lib/divination/sumerianInannaUnderworldDescentEngine';
import { calculateNorseVolvaSeidrNineRealms, formatNorseVolvaSeidrNineRealmsPrompt, NORSE_VOLVA_SEIDR_NINE_REALMS_ENGINE_VERSION } from '../src/lib/divination/norseVolvaSeidrNineRealmsEngine';
import { calculateZhuangziXiaoyaoyouButterfly, formatZhuangziXiaoyaoyouButterflyPrompt, ZHUANGZI_XIAOYAOYOU_BUTTERFLY_ENGINE_VERSION } from '../src/lib/divination/zhuangziXiaoyaoyouButterflyEngine';
import { calculateBuddhistYogacaraConsciousness, formatBuddhistYogacaraConsciousnessPrompt, BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION } from '../src/lib/divination/buddhistYogacaraEightConsciousnessEngine';
import { calculateVedicMandukyaTuriya, formatVedicMandukyaTuriyaPrompt, VEDIC_MANDUKYA_TURIYA_ENGINE_VERSION } from '../src/lib/divination/vedicMandukyaTuriyaEngine';
import { calculateKabbalisticZoharSoul, formatKabbalisticZoharSoulPrompt, KABBALISTIC_ZOHAR_SOUL_ENGINE_VERSION } from '../src/lib/divination/kabbalisticZoharFiveSoulLevelsEngine';
import { calculateRomanStoicProhairesis, formatRomanStoicProhairesisPrompt, ROMAN_STOIC_PROHAIRESIS_ENGINE_VERSION } from '../src/lib/divination/romanStoicProhairesisDichotomyEngine';
import { calculatePatanjaliAshtangaYoga, formatPatanjaliAshtangaYogaPrompt, PATANJALI_ASHTANGA_YOGA_ENGINE_VERSION } from '../src/lib/divination/patanjaliAshtangaYogaSutraEngine';
import { calculateKoreanPungryudoHwarang, formatKoreanPungryudoHwarangPrompt, KOREAN_PUNGRYUDO_HWARANG_ENGINE_VERSION } from '../src/lib/divination/koreanPungryudoHwarangFivePreceptsEngine';
import { calculatePersianAttarSevenValleys, formatPersianAttarSevenValleysPrompt, ATTAR_SEVEN_VALLEYS_ENGINE_VERSION } from '../src/lib/divination/persianAttarSevenValleysEngine';
import { calculateHermeticPoimandres, formatHermeticPoimandresPrompt, HERMETIC_POIMANDRES_ENGINE_VERSION } from '../src/lib/divination/hermeticPoimandresAscensionEngine';
import { calculateKashmirShaivismSpanda, formatKashmirShaivismSpandaPrompt, KASHMIR_SHAIVISM_SPANDA_ENGINE_VERSION } from '../src/lib/divination/kashmirShaivismSpandaEngine';
import { calculateSumerianEnumaElishFiftyNames, formatSumerianEnumaElishFiftyNamesPrompt, ENUMA_ELISH_ENGINE_VERSION } from '../src/lib/divination/sumerianEnumaElishFiftyNamesEngine';
import { calculateAlexandrianDecanThirtySixGods, formatAlexandrianDecanThirtySixGodsPrompt, ALEXANDRIAN_DECAN_ENGINE_VERSION } from '../src/lib/divination/alexandrianDecanThirtySixGodsEngine';
import { calculateTaoistLieziWindRiding, formatTaoistLieziWindRidingPrompt, TAOIST_LIEZI_ENGINE_VERSION } from '../src/lib/divination/taoistLieziWindRidingEngine';
import { calculateSamkhyaTwentyFiveTattvas, formatSamkhyaTwentyFiveTattvasPrompt, SAMKHYA_TATTVAS_ENGINE_VERSION } from '../src/lib/divination/samkhyaTwentyFiveTattvasEngine';
import { calculateNeoConfucianFourSevenLiQi, formatNeoConfucianFourSevenLiQiPrompt, NEO_CONFUCIAN_LIQI_ENGINE_VERSION } from '../src/lib/divination/neoConfucianFourSevenLiQiEngine';
import { calculateEtruscanAugurSixteenSky, formatEtruscanAugurSixteenSkyPrompt, ETRUSCAN_AUGUR_ENGINE_VERSION } from '../src/lib/divination/etruscanAugurSixteenSkyDivinationEngine';
import { calculateRosicrucianChymicalWedding, formatRosicrucianChymicalWeddingPrompt, ROSICRUCIAN_CHYMICAL_WEDDING_ENGINE_VERSION } from '../src/lib/divination/rosicrucianChymicalWeddingSevenDaysEngine';
import { calculateAztecTonalamatl, formatAztecTonalamatlPrompt, AZTEC_TONALAMATL_ENGINE_VERSION } from '../src/lib/divination/aztecTonalamatlSacredCalendarEngine';
import { calculateMongolianTengriHiimori, formatMongolianTengriHiimoriPrompt, MONGOLIAN_TENGRI_HIIMORI_ENGINE_VERSION } from '../src/lib/divination/mongolianTengriHiimoriSoulEngine';
import { calculateGaelicWheelFireFestivals, formatGaelicWheelFireFestivalsPrompt, GAELIC_FIRE_FESTIVALS_ENGINE_VERSION } from '../src/lib/divination/gaelicWheelFireFestivalsEngine';
import { calculateNorseHavamalEighteenGaldr, formatNorseHavamalEighteenGaldrPrompt, NORSE_HAVAMAL_GALDR_ENGINE_VERSION } from '../src/lib/divination/norseHavamalEighteenGaldrEngine';
import { calculateIbnArabiWahdatAlWujud, formatIbnArabiWahdatAlWujudPrompt, IBN_ARABI_WAHDAT_ENGINE_VERSION } from '../src/lib/divination/ibnArabiWahdatAlWujudWisdomEngine';
import { calculateChonggamnokTenSanctuaries, formatChonggamnokPrompt, CHONGGAMNOK_SANCTUARIES_ENGINE_VERSION } from '../src/lib/divination/koreanChonggamnokTenSanctuariesEngine';
import { calculateBalineseTriHitaKarana, formatBalineseTriHitaKaranaPrompt, BALINESE_TRI_HITA_KARANA_ENGINE_VERSION } from '../src/lib/divination/balineseTriHitaKaranaHarmonyEngine';
import { calculateHopiFourWorldsKachina, formatHopiFourWorldsPrompt, HOPI_FOUR_WORLDS_ENGINE_VERSION } from '../src/lib/divination/hopiFourWorldsKachinaProphecyEngine';
import { calculateDonghakCheondoismCheonju, formatDonghakCheondoismCheonjuPrompt, DONGHAK_CHEONDOISM_VERSION } from '../src/lib/divination/koreanDonghakCheondoismCheonjuEngine';
import { calculateIncaAndeanThreePachaAyni, formatIncaAndeanThreePachaAyniPrompt, INCA_ANDEAN_PACHA_VERSION } from '../src/lib/divination/incaAndeanThreePachaAyniEngine';
import { calculateShangOracleBoneDivination, formatShangOracleBoneDivinationPrompt, SHANG_ORACLE_BONE_VERSION } from '../src/lib/divination/shangOracleBoneDivinationEngine';
import { calculateKoreanCheonbugyeongEightyOne, formatKoreanCheonbugyeongEightyOnePrompt, CHEONBUGYEONG_ENGINE_VERSION } from '../src/lib/divination/koreanCheonbugyeongEightyOneCosmicEngine';
import { calculateHinduSriYantraSacredGeometry, formatHinduSriYantraSacredGeometryPrompt, SRI_YANTRA_ENGINE_VERSION } from '../src/lib/divination/hinduSriYantraSacredGeometryEngine';
import { calculateLakotaMedicineWheel, formatLakotaMedicineWheelPrompt, LAKOTA_MEDICINE_WHEEL_ENGINE_VERSION } from '../src/lib/divination/lakotaMedicineWheelWakanTankaEngine';
import { calculateGyeogamYurokProphecy, formatGyeogamYurokProphecyPrompt, GYEOGAM_YUROK_VERSION } from '../src/lib/divination/koreanGyeogamYurokProphecyEngine';
import { calculateHeianOnmyodoSeimei, formatHeianOnmyodoSeimeiPrompt, HEIAN_ONMYODO_SEIMEI_VERSION } from '../src/lib/divination/japaneseHeianOnmyodoSeimeiEngine';
import { calculatePolynesianWayfinding, formatPolynesianWayfindingPrompt, POLYNESIAN_WAYFINDING_VERSION } from '../src/lib/divination/polynesianWayfindingStarCompassEngine';
import { calculateWonhyoHwajaeng, formatWonhyoHwajaengPrompt, WONHYO_HWAJAENG_VERSION } from '../src/lib/divination/koreanWonhyoHwajaengOneMindEngine';
import { calculateMayiMianxiang, formatMayiMianxiangPrompt, MAYI_MIANXIANG_VERSION } from '../src/lib/divination/chineseMayiMianxiangTwelvePalacesEngine';
import { calculateEgyptianAmduat, formatEgyptianAmduatPrompt, EGYPTIAN_AMDUAT_VERSION } from '../src/lib/divination/egyptianAmduatTwelveHoursRaEngine';
import { calculateCelticBrehonLaw, formatCelticBrehonLawPrompt, CELTIC_BREHON_LAW_VERSION } from '../src/lib/divination/celticDruidBrehonLawJusticeEngine';
import { calculateMesopotamianNisaba, formatMesopotamianNisabaPrompt, MESOPOTAMIAN_NISABA_VERSION } from '../src/lib/divination/mesopotamianNisabaScribeWisdomEngine';
import { calculateSuunGasiHeon, formatSuunGasiHeonPrompt, SUUN_GASI_HEON_VERSION } from '../src/lib/divination/koreanSuunGasiHeonGyeongGwonEngine';
import { calculateEleusinianTriptolemos, formatEleusinianTriptolemosPrompt, ELEUSINIAN_TRIPTOLEMOS_VERSION } from '../src/lib/divination/ancientGreekEleusinianTriptolemosEngine';
import { calculateMixtecEightDeer, formatMixtecEightDeerPrompt, MIXTEC_EIGHT_DEER_VERSION } from '../src/lib/divination/mesoamericanMixtecEightDeerJaguarClawEngine';
import { calculateJeonBongjunNokdu, formatJeonBongjunNokduPrompt, JEON_BONGJUN_NOKDU_VERSION } from '../src/lib/divination/koreanJeonBongjunNokduGeneralEngine';
import { calculateAtrahasisFlood, formatAtrahasisFloodPrompt, ATRAHASIS_FLOOD_VERSION } from '../src/lib/divination/mesopotamianAtrahasisFloodWisdomEngine';
import { calculateEddicYggdrasil, formatEddicYggdrasilPrompt, EDDIC_YGGDRASIL_VERSION } from '../src/lib/divination/scandinavianEddicYggdrasilNineRealmsEngine';
import { calculateYiSunSinNanjungIlgi, formatYiSunSinNanjungIlgiPrompt, YISUNSIN_NANJUNG_ILGI_VERSION } from '../src/lib/divination/koreanYiSunSinNanjungIlgiStrategicEngine';
import { calculatePtahMemphite, formatPtahMemphitePrompt, PTAH_MEMPHITE_VERSION } from '../src/lib/divination/ancientEgyptianPtahMemphiteTheologyEngine';
import { calculateLughSamildanach, formatLughSamildanachPrompt, LUGH_SAMILDANACH_VERSION } from '../src/lib/divination/celticTuathaDeDanannLughSamildanachEngine';
import { calculateChoeHyeonbaeGeulbon, formatChoeHyeonbaeGeulbonPrompt, CHOE_HYEONBAE_GEULBON_VERSION } from '../src/lib/divination/koreanChoeHyeonbaeHangeulGeulbonEngine';
import { calculateZoroastrianAmeshaSpentas, formatZoroastrianAmeshaSpentasPrompt, ZOROASTRIAN_AMESHA_SPENTAS_VERSION } from '../src/lib/divination/ancientPersianZoroastrianAmeshaSpentasEngine';
import { calculateDelphicChilon, formatDelphicChilonPrompt, DELPHIC_CHILON_VERSION } from '../src/lib/divination/ancientGreekDelphicChilonKnowThyselfEngine';
import { calculateJeongYakyongMongmin, formatJeongYakyongMongminPrompt, JEONG_YAKYONG_MONGMIN_VERSION } from '../src/lib/divination/koreanJeongYakyongMongminSimseoEngine';
import { calculateHeraclitusPantaRhei, formatHeraclitusPantaRheiPrompt, HERACLITUS_PANTA_RHEI_VERSION } from '../src/lib/divination/ancientGreekHeraclitusPantaRheiLogosEngine';
import { calculateMoziGyeomAe, formatMoziGyeomAePrompt, MOZI_GYEOM_AE_VERSION } from '../src/lib/divination/ancientChineseMoziGyeomAeUniversalLoveEngine';
import { calculateAureliusInnerCitadel, formatAureliusInnerCitadelPrompt, AURELIUS_INNER_CITADEL_VERSION } from '../src/lib/divination/romanAureliusInnerCitadelMeditationsEngine';
import { calculateLaoziDaodejing, formatLaoziDaodejingPrompt, LAOZI_DAODEJING_VERSION } from '../src/lib/divination/chineseLaoziDaodejingWaterWayEngine';
import { calculateEpicureanTetrapharmakos, formatEpicureanTetrapharmakosPrompt, EPICUREAN_TETRAPHARMAKOS_VERSION } from '../src/lib/divination/ancientGreekEpicureanTetrapharmakosEngine';
import { calculateYulgokGyeokmong, formatYulgokGyeokmongPrompt, YULGOK_GYEOKMONG_VERSION } from '../src/lib/divination/koreanYulgokGyeokmongYogyeolEngine';
import { calculateAristotleMesotes, formatAristotleMesotesPrompt, ARISTOTLE_MESOTES_VERSION } from '../src/lib/divination/ancientGreekAristotleMesotesEudaimoniaEngine';
import { calculateBhagavadGitaKarmaYoga, formatBhagavadGitaKarmaYogaPrompt, BHAGAVAD_GITA_KARMA_YOGA_VERSION } from '../src/lib/divination/ancientIndianBhagavadGitaKarmaYogaEngine';
import { calculateWangYangmingXinxue, formatWangYangmingXinxuePrompt, WANG_YANGMING_LIANGZHI_VERSION } from '../src/lib/divination/chineseWangYangmingLiangzhiXinxueEngine';
import { calculateSocraticMaieuticDaimon, formatSocraticMaieuticDaimonPrompt, SOCRATIC_MAIEUTIC_DAIMON_VERSION } from '../src/lib/divination/ancientGreekSocraticMaieuticDaimonEngine';
import { calculateMenciusFourSproutsHoyeon, formatMenciusFourSproutsHoyeonPrompt, MENCIUS_FOUR_SPROUTS_HOYEON_VERSION } from '../src/lib/divination/chineseMenciusFourSproutsHoyeonJigiEngine';
import { calculateSenecaTimeSovereignty, formatSenecaTimeSovereigntyPrompt, SENECA_TIME_SOVEREIGNTY_VERSION } from '../src/lib/divination/romanSenecaTimeSovereigntyTranquilityEngine';
import { calculatePlatonicIdeaCave, formatPlatonicIdeaCavePrompt, PLATONIC_IDEA_CAVE_VERSION } from '../src/lib/divination/ancientGreekPlatonicIdeaCaveEngine';
import { calculateToegyeSeonghakSipdo, formatToegyeSeonghakSipdoPrompt, TOEGYE_SEONGHAK_SIPDO_VERSION } from '../src/lib/divination/koreanToegyeSeonghakSipdoEngine';
import { calculateCiceroDeOfficiis, formatCiceroDeOfficiisPrompt, CICERO_DE_OFFICIIS_VERSION } from '../src/lib/divination/romanCiceroDeOfficiisHonestumEngine';
import { calculateEpictetusDichotomyOfControl, formatEpictetusDichotomyOfControlPrompt, EPICTETUS_CONTROL_VERSION } from '../src/lib/divination/ancientGreekEpictetusDichotomyOfControlEngine';
import { calculateConfuciusAnalectsZhitianming, formatConfuciusAnalectsZhitianmingPrompt, CONFUCIUS_ZHITIANMING_VERSION } from '../src/lib/divination/ancientChineseConfuciusAnalectsZhitianmingEngine';
import { calculateBaruchSpinozaEthicaConatus, formatBaruchSpinozaEthicaConatusPrompt, SPINOZA_CONATUS_AMORDEI_VERSION } from '../src/lib/divination/baruchSpinozaEthicaConatusAmorDeiEngine';
import { calculateKantCategoricalImperative, formatKantCategoricalImperativePrompt, KANT_CATEGORICAL_IMPERATIVE_VERSION } from '../src/lib/divination/germanKantCategoricalImperativeSynthesisEngine';
import { calculateUpanishadicTatTvamAsi, formatUpanishadicTatTvamAsiPrompt, UPANISHADIC_TAT_TVAM_ASI_VERSION } from '../src/lib/divination/indianUpanishadicTatTvamAsiEngine';
import { calculateChoeHangiGihakUnwha, formatChoeHangiGihakUnwhaPrompt, CHOE_HANGI_GIHAK_UNWHA_VERSION } from '../src/lib/divination/koreanChoeHangiGihakUnwhaEngine';
import { calculateSunTzuArtOfWarStrategy, formatSunTzuArtOfWarStrategyPrompt, SUNTZU_STRATEGY_VERSION } from '../src/lib/divination/ancientChineseSunTzuArtOfWarStrategyEngine';
import { calculateFrenchDescartesCogito, formatFrenchDescartesCogitoPrompt, DESCARTES_COGITO_VERSION } from '../src/lib/divination/frenchDescartesCogitoClaraDistinctaEngine';
import { calculateAncientIndianFourNobleTruths, formatAncientIndianFourNobleTruthsPrompt, FOUR_NOBLE_TRUTHS_VERSION } from '../src/lib/divination/ancientIndianEarlyBuddhistFourNobleTruthsEngine';
import { calculateRumiMasnaviDivineLove, formatRumiMasnaviDivineLovePrompt, RUMI_MASNAVI_SUFI_VERSION } from '../src/lib/divination/islamicSufiRumiMasnaviDivineLoveEngine';
import { calculateUisangHwaeomIlseungBeopgye, formatUisangHwaeomIlseungBeopgyePrompt, UISANG_HWAEOM_BEOPGYE_VERSION } from '../src/lib/divination/koreanUisangHwaeomIlseungBeopgyeEngine';
import { calculateMontaigneEssaisWisdom, formatMontaigneEssaisWisdomPrompt, MONTAIGNE_ESSAIS_WISDOM_VERSION } from '../src/lib/divination/frenchMontaigneEssaisWisdomEngine';
import { calculateNagarjunaMadhyamakaSunyata, formatNagarjunaMadhyamakaSunyataPrompt, NAGARJUNA_MADHYAMAKA_VERSION } from '../src/lib/divination/ancientIndianNagarjunaMadhyamakaSunyataEngine';
import { calculateJinulJeonghyeSsangsu, formatJinulJeonghyeSsangsuPrompt, JINUL_JEONGHYE_SSANGSU_VERSION } from '../src/lib/divination/koreanJinulJeonghyeSsangsuDonohJeomsuEngine';
import { calculateRenaissanceBrunoInfiniteUniverse, formatRenaissanceBrunoInfiniteUniversePrompt, BRUNO_INFINITE_UNIVERSE_VERSION } from '../src/lib/divination/renaissanceBrunoInfiniteUniverseHeroicFuroreEngine';
import { calculatePascalPenseesHeartReason, formatPascalPenseesHeartReasonPrompt, PASCAL_PENSEES_HEART_REASON_VERSION } from '../src/lib/divination/frenchPascalPenseesHeartReasonEngine';
import { calculateSchopenhauerWillRepresentation, formatSchopenhauerWillRepresentationPrompt, SCHOPENHAUER_WILL_REPRESENTATION_VERSION } from '../src/lib/divination/germanSchopenhauerWillRepresentationEngine';
import { calculateChusaKimJeonghuiSehando, formatChusaKimJeonghuiSehandoPrompt, CHUSA_SEHANDO_WISDOM_VERSION } from '../src/lib/divination/koreanChusaKimJeonghuiSehandoEngine';
import { calculateKierkegaardStagesOfLife, formatKierkegaardStagesOfLifePrompt, KIERKEGAARD_STAGES_OF_LIFE_VERSION } from '../src/lib/divination/danishKierkegaardStagesOfLifeEngine';
import { calculateNietzscheZarathustraAmorFati, formatNietzscheZarathustraAmorFatiPrompt, NIETZSCHE_ZARATHUSTRA_AMOR_FATI_VERSION } from '../src/lib/divination/germanNietzscheZarathustraAmorFatiEngine';
import { calculateSeosanHyujeongSeongaGwigam, formatSeosanHyujeongSeongaGwigamPrompt, SEOSAN_SEONGA_GWIGAM_VERSION } from '../src/lib/divination/koreanSeosanHyujeongSeongaGwigamEngine';
import { calculateJungIndividuationArchetype, formatJungIndividuationArchetypePrompt, SWISS_JUNG_INDIVIDUATION_VERSION } from '../src/lib/divination/swissJungIndividuationArchetypeEngine';
import { calculateHegelDialecticalAufheben, formatHegelDialecticalAufhebenPrompt, GERMAN_HEGEL_DIALECTICAL_VERSION } from '../src/lib/divination/germanHegelDialecticalAufhebenEngine';
import { calculateDasanMokminSimseo, formatDasanMokminSimseoPrompt, KOREAN_DASAN_MOKMIN_SIMSEO_VERSION } from '../src/lib/divination/koreanDasanJeongYagyongMokminSimseoEngine';
import { calculateAugustineConfessionesIlluminatio, formatAugustineConfessionesIlluminatioPrompt, NORTH_AFRICAN_AUGUSTINE_VERSION } from '../src/lib/divination/northAfricanAugustineConfessionesIlluminatioEngine';
import { calculateMachiavelliVirtuFortuna, formatMachiavelliVirtuFortunaPrompt, ITALIAN_MACHIAVELLI_VERSION } from '../src/lib/divination/italianMachiavelliVirtuFortunaEngine';
import { calculateChoeChiwonPungryudo, formatChoeChiwonPungryudoPrompt, KOREAN_CHOE_CHIWON_VERSION } from '../src/lib/divination/koreanChoeChiwonPungryudoEngine';
import { calculateThomasAquinasSummaTheologiae, formatThomasAquinasSummaTheologiaePrompt, ITALIAN_THOMAS_AQUINAS_VERSION } from '../src/lib/divination/italianThomasAquinasSummaTheologiaeEngine';
import { calculateFrancisBaconNovumOrganum, formatFrancisBaconNovumOrganumPrompt, BRITISH_FRANCIS_BACON_VERSION } from '../src/lib/divination/britishFrancisBaconNovumOrganumEngine';
import { calculateRyuSeongryongJingbirok, formatRyuSeongryongJingbirokPrompt, KOREAN_RYU_SEONGRYONG_VERSION } from '../src/lib/divination/koreanRyuSeongryongJingbirokEngine';
import { calculateKingSejongHunminjeongeumAemin, formatKingSejongHunminjeongeumAeminPrompt, KOREAN_KING_SEJONG_VERSION } from '../src/lib/divination/koreanKingSejongHunminjeongeumAeminEngine';
import { calculateJangBogoCheonghaejinMaritimePioneer, formatJangBogoCheonghaejinMaritimePioneerPrompt, KOREAN_JANG_BOGO_VERSION } from '../src/lib/divination/koreanJangBogoCheonghaejinMaritimePioneerEngine';
import { calculateJohnStuartMillOnLibertyIndividuality, formatJohnStuartMillOnLibertyIndividualityPrompt, BRITISH_JS_MILL_VERSION } from '../src/lib/divination/britishJohnStuartMillOnLibertyIndividualityEngine';
import { calculateFrenchJeanJacquesRousseauNatureAuthenticity, formatJeanJacquesRousseauNatureAuthenticityPrompt, FRENCH_JJ_ROUSSEAU_VERSION } from '../src/lib/divination/frenchJeanJacquesRousseauNatureAuthenticityEngine';
import { calculateGermanJohannWolfgangGoetheFaustStriving, formatJohannWolfgangGoetheFaustStrivingPrompt, GERMAN_GOETHE_FAUST_VERSION } from '../src/lib/divination/germanJohannWolfgangGoetheFaustStrivingEngine';
import { calculateItalianDanteAlighieriDivineComedyAscent, formatDanteAlighieriDivineComedyAscentPrompt, ITALIAN_DANTE_COMEDY_VERSION } from '../src/lib/divination/italianDanteAlighieriDivineComedyAscentEngine';
import { calculateMarcusAureliusMeditationsCitadel, formatMarcusAureliusMeditationsCitadelPrompt, ROMAN_MARCUS_AURELIUS_VERSION } from '../src/lib/divination/romanMarcusAureliusMeditationsCitadelEngine';
import { calculateSuunChoeJeuDonghakSicheonju, formatSuunChoeJeuDonghakSicheonjuPrompt, KOREAN_SUUN_CHOE_JEU_VERSION } from '../src/lib/divination/koreanSuunChoeJeuDonghakSicheonjuEngine';
import { calculateRalphWaldoEmersonSelfReliance, formatRalphWaldoEmersonSelfReliancePrompt, AMERICAN_RALPH_WALDO_EMERSON_VERSION } from '../src/lib/divination/americanRalphWaldoEmersonSelfRelianceEngine';
import { calculateHenriBergsonElanVital, formatHenriBergsonElanVitalPrompt, FRENCH_HENRI_BERGSON_VERSION } from '../src/lib/divination/frenchHenriBergsonElanVitalEngine';
import { calculateAlbertCamusAbsurdRevolt, formatAlbertCamusAbsurdRevoltPrompt, FRENCH_ALBERT_CAMUS_VERSION } from '../src/lib/divination/frenchAlbertCamusAbsurdRevoltEngine';
import { calculateYeonamParkJiwonYeolhaIlgi, formatYeonamParkJiwonYeolhaIlgiPrompt, KOREAN_YEONAM_PARK_JIWON_VERSION } from '../src/lib/divination/koreanYeonamParkJiwonYeolhaIlgiEngine';
import { calculateJeanPaulSartreExistentialism, formatJeanPaulSartreExistentialismPrompt, FRENCH_JEAN_PAUL_SARTRE_VERSION } from '../src/lib/divination/frenchJeanPaulSartreExistentialismEngine';
import { calculateViktorFranklLogotherapy, formatViktorFranklLogotherapyPrompt, AUSTRIAN_VIKTOR_FRANKL_VERSION } from '../src/lib/divination/austrianViktorFranklLogotherapyEngine';
import { calculateBaekbeomKimGuMyDesireCulture, formatBaekbeomKimGuMyDesireCulturePrompt, KOREAN_BAEKBEOM_KIM_GU_VERSION } from '../src/lib/divination/koreanBaekbeomKimGuMyDesireCultureEngine';
import { calculateMartinHeideggerBeingAndTime, formatMartinHeideggerBeingAndTimePrompt, GERMAN_MARTIN_HEIDEGGER_VERSION } from '../src/lib/divination/germanMartinHeideggerBeingAndTimeEngine';
import { calculateHannahArendtVitaActiva, formatHannahArendtVitaActivaPrompt, AMERICAN_GERMAN_HANNAH_ARENDT_VERSION } from '../src/lib/divination/americanGermanHannahArendtVitaActivaEngine';
import { calculateDosanAhnChanghoMusilYeokhaeng, formatDosanAhnChanghoMusilYeokhaengPrompt, KOREAN_DOSAN_AHN_CHANGHO_VERSION } from '../src/lib/divination/koreanDosanAhnChanghoMusilYeokhaengEngine';
import { calculateHenryDavidThoreauWalden, formatHenryDavidThoreauWaldenPrompt, AMERICAN_HENRY_DAVID_THOREAU_VERSION } from '../src/lib/divination/americanHenryDavidThoreauWaldenEngine';
import { calculateDavidHumeTreatiseHumanNature, formatDavidHumeTreatiseHumanNaturePrompt, SCOTTISH_DAVID_HUME_VERSION } from '../src/lib/divination/scottishDavidHumeTreatiseHumanNatureEngine';
import { calculateManhaeHanYongunNimuiChimmuk, formatManhaeHanYongunNimuiChimmukPrompt, KOREAN_MANHAE_HAN_YONGUN_VERSION } from '../src/lib/divination/koreanManhaeHanYongunNimuiChimmukEngine';
import { calculateGottfriedLeibnizMonadologyHarmony, formatGottfriedLeibnizMonadologyHarmonyPrompt, GERMAN_GOTTFRIED_LEIBNIZ_VERSION } from '../src/lib/divination/germanGottfriedLeibnizMonadologyHarmonyEngine';
import { calculateJohnLockeHumanUnderstanding, formatJohnLockeHumanUnderstandingPrompt, BRITISH_JOHN_LOCKE_VERSION } from '../src/lib/divination/britishJohnLockeHumanUnderstandingEngine';
import { calculateHyechoWangOcheonchukgukjeon, formatHyechoWangOcheonchukgukjeonPrompt, KOREAN_HYECHO_VERSION } from '../src/lib/divination/koreanHyechoWangOcheonchukgukjeonEngine';
import { calculateAncientGreekPlotinusEnneadsHenosis, formatAncientGreekPlotinusEnneadsHenosisPrompt, ANCIENT_GREEK_PLOTINUS_VERSION } from '../src/lib/divination/ancientGreekPlotinusEnneadsHenosisEngine';
import { calculateScottishAdamSmithMoralSentiments, formatScottishAdamSmithMoralSentimentsPrompt, SCOTTISH_ADAM_SMITH_VERSION } from '../src/lib/divination/scottishAdamSmithMoralSentimentsEngine';
import { calculateKoreanYunDongJuSkyWindStarsPoetry, formatKoreanYunDongJuSkyWindStarsPoetryPrompt, KOREAN_YUN_DONG_JU_VERSION } from '../src/lib/divination/koreanYunDongJuSkyWindStarsPoetryEngine';
import { calculateRussianLeoTolstoyCalendarOfWisdom, formatRussianLeoTolstoyCalendarOfWisdomPrompt, RUSSIAN_LEO_TOLSTOY_VERSION } from '../src/lib/divination/russianLeoTolstoyCalendarOfWisdomEngine';
import { calculateIndianRabindranathTagoreGitanjali, formatIndianRabindranathTagoreGitanjaliPrompt, INDIAN_TAGORE_GITANJALI_VERSION } from '../src/lib/divination/indianRabindranathTagoreGitanjaliEngine';
import { calculateKoreanLeeYukSaGwangyaPeak, formatKoreanLeeYukSaGwangyaPeakPrompt, KOREAN_LEE_YUK_SA_VERSION } from '../src/lib/divination/koreanLeeYukSaGwangyaPeakEngine';
import { calculateGermanSwissHermannHesseDemianSiddhartha, formatGermanSwissHermannHesseDemianSiddharthaPrompt, GERMAN_HERMANN_HESSE_VERSION } from '../src/lib/divination/germanSwissHermannHesseDemianSiddharthaEngine';
import { calculateAustrianMartinBuberIAndThou, formatAustrianMartinBuberIAndThouPrompt, AUSTRIAN_MARTIN_BUBER_VERSION } from '../src/lib/divination/austrianMartinBuberIAndThouEngine';
import { calculateKoreanSambongJeongDoJeonMinbonReform, formatKoreanSambongJeongDoJeonMinbonReformPrompt, KOREAN_JEONG_DO_JEON_VERSION } from '../src/lib/divination/koreanSambongJeongDoJeonMinbonReformEngine';
import { calculateBritishBertrandRussellConquestOfHappiness, formatBritishBertrandRussellConquestOfHappinessPrompt, BRITISH_BERTRAND_RUSSELL_VERSION } from '../src/lib/divination/britishBertrandRussellConquestOfHappinessEngine';
import { calculateGermanKarlJaspersExistenzGrenzsituationen, formatGermanKarlJaspersExistenzGrenzsituationenPrompt, GERMAN_KARL_JASPERS_VERSION } from '../src/lib/divination/germanKarlJaspersExistenzGrenzsituationenEngine';
import { calculateKoreanMaewoldangKimSiSeupGeumoSinhwa, formatKoreanMaewoldangKimSiSeupGeumoSinhwaPrompt, KOREAN_KIM_SI_SEUP_VERSION } from '../src/lib/divination/koreanMaewoldangKimSiSeupGeumoSinhwaEngine';
import { calculateAmericanWilliamJamesPragmatism, formatAmericanWilliamJamesPragmatismPrompt, AMERICAN_WILLIAM_JAMES_VERSION } from '../src/lib/divination/americanWilliamJamesPragmatismWillToBelieveEngine';
import { calculateGermanErichFrommArtOfLovingBeing, formatGermanErichFrommArtOfLovingBeingPrompt, GERMAN_ERICH_FROMM_VERSION } from '../src/lib/divination/germanErichFrommArtOfLovingBeingEngine';
import { calculateKoreanDanjaeShinChaeHoJoseonSanggosa, formatKoreanDanjaeShinChaeHoJoseonSanggosaPrompt, KOREAN_DANJAE_SHIN_CHAE_HO_VERSION } from '../src/lib/divination/koreanDanjaeShinChaeHoJoseonSanggosaEngine';
import { calculateFrenchMontesquieuSpiritOfLaws, formatFrenchMontesquieuSpiritOfLawsPrompt, FRENCH_MONTESQUIEU_SPIRIT_OF_LAWS_VERSION } from '../src/lib/divination/frenchMontesquieuSpiritOfLawsEngine';
import { calculateFrenchGastonBachelardPoeticsOfSpace, formatFrenchGastonBachelardPoeticsOfSpacePrompt, FRENCH_GASTON_BACHELARD_POETICS_VERSION } from '../src/lib/divination/frenchGastonBachelardPoeticsOfSpaceEngine';
import { calculateKoreanNammyeongJoSikGyeongUi, formatKoreanNammyeongJoSikGyeongUiPrompt, KOREAN_NAMMYEONG_JO_SIK_VERSION } from '../src/lib/divination/koreanNammyeongJoSikGyeongUiEngine';
import { calculateGermanAlbertSchweitzerReverenceForLife, formatGermanAlbertSchweitzerReverenceForLifePrompt, GERMAN_ALBERT_SCHWEITZER_VERSION } from '../src/lib/divination/germanAlbertSchweitzerReverenceForLifeEngine';
import { calculateFrenchMichelDeMontaigneEssays, formatFrenchMichelDeMontaigneEssaysPrompt, FRENCH_MICHEL_DE_MONTAIGNE_VERSION } from '../src/lib/divination/frenchMichelDeMontaigneEssaysEngine';
import { calculateKoreanOhseongHaneumFriendshipGovernance, formatKoreanOhseongHaneumFriendshipGovernancePrompt, KOREAN_OHSEONG_HANEUM_VERSION } from '../src/lib/divination/koreanOhseongHaneumFriendshipGovernanceEngine';
import { calculateFrenchVoltaireCandideTolerance, formatFrenchVoltaireCandideTolerancePrompt, FRENCH_VOLTAIRE_CANDIDE_TOLERANCE_VERSION } from '../src/lib/divination/frenchVoltaireCandideToleranceEngine';
import { calculateAmericanWaltWhitmanLeavesOfGrass, formatAmericanWaltWhitmanLeavesOfGrassPrompt, AMERICAN_WALT_WHITMAN_VERSION } from '../src/lib/divination/americanWaltWhitmanLeavesOfGrassEngine';
import { calculateKoreanAhnJungGeunPeaceRighteousness, formatKoreanAhnJungGeunPeaceRighteousnessPrompt, KOREAN_AHN_JUNG_GEUN_VERSION } from '../src/lib/divination/koreanAhnJungGeunPeaceRighteousnessEngine';
import { calculateAustrianAlfredAdlerIndividualPsychology, formatAustrianAlfredAdlerIndividualPsychologyPrompt, AUSTRIAN_ALFRED_ADLER_INDIVIDUAL_PSYCHOLOGY_VERSION } from '../src/lib/divination/austrianAlfredAdlerIndividualPsychologyEngine';
import { calculateGermanFriedrichSchillerAestheticEducation, formatGermanFriedrichSchillerAestheticEducationPrompt, GERMAN_FRIEDRICH_SCHILLER_AESTHETIC_EDUCATION_VERSION } from '../src/lib/divination/germanFriedrichSchillerAestheticEducationEngine';
import { calculateKoreanDamheonHongDaeYongUisanMundap, formatKoreanDamheonHongDaeYongUisanMundapPrompt, KOREAN_DAMHEON_HONG_DAE_YONG_UISAN_MUNDAP_VERSION } from '../src/lib/divination/koreanDamheonHongDaeYongUisanMundapEngine';
import { calculateAustrianWittgensteinLanguageGameSilence, formatAustrianWittgensteinLanguageGameSilencePrompt, AUSTRIAN_WITTGENSTEIN_LANGUAGE_GAME_SILENCE_VERSION } from '../src/lib/divination/austrianWittgensteinLanguageGameSilenceEngine';
import { calculateFrenchGillesDeleuzeRhizomeBecoming, formatFrenchGillesDeleuzeRhizomeBecomingPrompt, FRENCH_GILLES_DELEUZE_RHIZOME_BECOMING_VERSION } from '../src/lib/divination/frenchGillesDeleuzeRhizomeBecomingEngine';
import { calculateKoreanHeoJunDonguiBogamYangsaeng, formatKoreanHeoJunDonguiBogamYangsaengPrompt, KOREAN_HEO_JUN_DONGUI_BOGAM_YANGSAENG_VERSION } from '../src/lib/divination/koreanHeoJunDonguiBogamYangsaengEngine';
import { calculateDutchDesideriusErasmusPraiseOfFolly, formatDutchDesideriusErasmusPraiseOfFollyPrompt, DUTCH_DESIDERIUS_ERASMUS_PRAISE_OF_FOLLY_VERSION } from '../src/lib/divination/dutchDesideriusErasmusPraiseOfFollyEngine';
import { calculateBritishThomasMoreUtopia, formatBritishThomasMoreUtopiaPrompt, BRITISH_THOMAS_MORE_UTOPIA_VERSION } from '../src/lib/divination/britishThomasMoreUtopiaEngine';
import { calculateKoreanGosanYoonSeonDoFiveFriends, formatKoreanGosanYoonSeonDoFiveFriendsPrompt, KOREAN_GOSAN_YOON_SEON_DO_FIVE_FRIENDS_VERSION } from '../src/lib/divination/koreanGosanYoonSeonDoFiveFriendsEngine';
import { calculateItalianPicoDellaMirandolaDignity, formatItalianPicoDellaMirandolaDignityPrompt, ITALIAN_PICO_DELLA_MIRANDOLA_DIGNITY_VERSION } from '../src/lib/divination/italianPicoDellaMirandolaDignityEngine';
import { calculateAustrianFranzKafkaExistentialTruth, formatAustrianFranzKafkaExistentialTruthPrompt, AUSTRIAN_FRANZ_KAFKA_EXISTENTIAL_TRUTH_VERSION } from '../src/lib/divination/austrianFranzKafkaExistentialTruthEngine';
import { calculateKoreanPoeunJeongMongJuDansimga, formatKoreanPoeunJeongMongJuDansimgaPrompt, KOREAN_POEUN_JEONG_MONG_JU_DANSIMGA_VERSION } from '../src/lib/divination/koreanPoeunJeongMongJuDansimgaEngine';
import { calculateFrenchSimoneDeBeauvoirAmbiguityFreedom, formatFrenchSimoneDeBeauvoirAmbiguityFreedomPrompt, FRENCH_SIMONE_DE_BEAUVOIR_AMBIGUITY_FREEDOM_VERSION } from '../src/lib/divination/frenchSimoneDeBeauvoirAmbiguityFreedomEngine';
import { calculateFrenchMauriceMerleauPontyEmbodiedPhenomenology, formatFrenchMauriceMerleauPontyEmbodiedPhenomenologyPrompt, FRENCH_MAURICE_MERLEAU_PONTY_EMBODIED_PHENOMENOLOGY_VERSION } from '../src/lib/divination/frenchMauriceMerleauPontyEmbodiedPhenomenologyEngine';
import { calculateKoreanSamyeongdaesaSongunYujeong, formatKoreanSamyeongdaesaSongunYujeongPrompt, KOREAN_SAMYEONGDAESA_SONGUN_YUJEONG_VERSION } from '../src/lib/divination/koreanSamyeongdaesaSongunYujeongEngine';
import { calculateKoreanShinSaimdangChochungdoArtVirtue, formatKoreanShinSaimdangChochungdoArtVirtuePrompt, KOREAN_SHIN_SAIMDANG_CHOCHUNGDO_ART_VIRTUE_VERSION } from '../src/lib/divination/koreanShinSaimdangChochungdoArtVirtueEngine';
import { calculateGermanEdmundHusserlPhenomenologicalReduction, formatGermanEdmundHusserlPhenomenologicalReductionPrompt, GERMAN_EDMUND_HUSSERL_PHENOMENOLOGY_VERSION } from '../src/lib/divination/germanEdmundHusserlPhenomenologicalReductionEngine';
import { calculateFrenchMichelFoucaultCareOfSelfAesthetics, formatFrenchMichelFoucaultCareOfSelfAestheticsPrompt, FRENCH_MICHEL_FOUCAULT_CARE_OF_SELF_VERSION } from '../src/lib/divination/frenchMichelFoucaultCareOfSelfAestheticsEngine';
import { calculateGermanWalterBenjaminAuraNowTime, formatGermanWalterBenjaminAuraNowTimePrompt, GERMAN_WALTER_BENJAMIN_AURA_NOWTIME_VERSION } from '../src/lib/divination/germanWalterBenjaminAuraNowTimeEngine';
import { calculateFrenchEmmanuelLevinasFaceOfOtherHospitality, formatFrenchEmmanuelLevinasFaceOfOtherHospitalityPrompt, FRENCH_EMMANUEL_LEVINAS_ETHICS_VERSION } from '../src/lib/divination/frenchEmmanuelLevinasFaceOfOtherHospitalityEngine';
import { calculateGermanTheodorAdornoNegativeDialecticsMinimaMoralia, formatGermanTheodorAdornoNegativeDialecticsMinimaMoraliaPrompt, GERMAN_THEODOR_ADORNO_NEGATIVE_DIALECTICS_VERSION } from '../src/lib/divination/germanTheodorAdornoNegativeDialecticsMinimaMoraliaEngine';
import { calculateFrenchJacquesDerridaDeconstructionDifferance, formatFrenchJacquesDerridaDeconstructionDifferancePrompt, FRENCH_JACQUES_DERRIDA_DECONSTRUCTION_DIFFERANCE_VERSION } from '../src/lib/divination/frenchJacquesDerridaDeconstructionDifferanceEngine';
import { calculateGermanJurgenHabermasCommunicativeAction, formatGermanJurgenHabermasCommunicativeActionPrompt, GERMAN_JURGEN_HABERMAS_COMMUNICATIVE_ACTION_VERSION } from '../src/lib/divination/germanJurgenHabermasCommunicativeActionEngine';
import { calculateFrenchRolandBarthesSemioticsPunctum, formatFrenchRolandBarthesSemioticsPunctumPrompt, FRENCH_ROLAND_BARTHES_SEMIOTICS_PUNCTUM_VERSION } from '../src/lib/divination/frenchRolandBarthesSemioticsPunctumEngine';
import { calculateAmericanJohnDeweyPragmaticInquiryGrowth, formatAmericanJohnDeweyPragmaticInquiryGrowthPrompt, AMERICAN_JOHN_DEWEY_PRAGMATIC_INQUIRY_GROWTH_VERSION } from '../src/lib/divination/americanJohnDeweyPragmaticInquiryGrowthEngine';
import { calculateRussianFyodorDostoevskyKaramazovSoulCompassion, formatRussianFyodorDostoevskyKaramazovSoulCompassionPrompt, RUSSIAN_FYODOR_DOSTOEVSKY_KARAMAZOV_SOUL_COMPASSION_VERSION } from '../src/lib/divination/russianFyodorDostoevskyKaramazovSoulCompassionEngine';
import { calculateKoreanBaekSeokDeerWhiteWallPoeticPurity, formatKoreanBaekSeokDeerWhiteWallPoeticPurityPrompt, KOREAN_BAEK_SEOK_DEER_WHITE_WALL_POETIC_PURITY_VERSION } from '../src/lib/divination/koreanBaekSeokDeerWhiteWallPoeticPurityEngine';
import { calculateFrenchPaulRicoeurNarrativeIdentityHealing, formatFrenchPaulRicoeurNarrativeIdentityHealingPrompt, FRENCH_PAUL_RICOEUR_NARRATIVE_IDENTITY_HEALING_VERSION } from '../src/lib/divination/frenchPaulRicoeurNarrativeIdentityHealingEngine';
import { calculateRussianAntonChekhovQuietEnduranceCompassion, formatRussianAntonChekhovQuietEnduranceCompassionPrompt, RUSSIAN_ANTON_CHEKHOV_QUIET_ENDURANCE_COMPASSION_VERSION } from '../src/lib/divination/russianAntonChekhovQuietEnduranceCompassionEngine';
import { calculateKoreanSeopoKimManJungGuunmongAwakening, formatKoreanSeopoKimManJungGuunmongAwakeningPrompt, KOREAN_SEOPO_KIM_MAN_JUNG_GUUNMONG_AWAKENING_VERSION } from '../src/lib/divination/koreanSeopoKimManJungGuunmongAwakeningEngine';
import { calculateBritishVirginiaWoolfRoomOfOnesOwn, formatBritishVirginiaWoolfRoomOfOnesOwnPrompt, BRITISH_VIRGINIA_WOOLF_ROOM_OF_ONES_OWN_VERSION } from '../src/lib/divination/britishVirginiaWoolfRoomOfOnesOwnEngine';
import { calculateFrenchVictorHugoLesMiserables, formatFrenchVictorHugoLesMiserablesPrompt, FRENCH_VICTOR_HUGO_LES_MISERABLES_VERSION } from '../src/lib/divination/frenchVictorHugoLesMiserablesEngine';
import { calculateKoreanHeoGyunHongGildongYuldoguk, formatKoreanHeoGyunHongGildongYuldogukPrompt, KOREAN_HEO_GYUN_HONG_GILDONG_YULDOGUK_VERSION } from '../src/lib/divination/koreanHeoGyunHongGildongYuldogukEngine';
import { calculateAustrianRainerMariaRilkeLetters, formatAustrianRainerMariaRilkeLettersPrompt, AUSTRIAN_RAINER_MARIA_RILKE_LETTERS_VERSION } from '../src/lib/divination/austrianRainerMariaRilkeLettersToYoungPoetEngine';
import { calculateSpanishMiguelDeCervantesDonQuixote, formatSpanishMiguelDeCervantesDonQuixotePrompt, SPANISH_MIGUEL_DE_CERVANTES_DON_QUIXOTE_VERSION } from '../src/lib/divination/spanishMiguelDeCervantesDonQuixoteEngine';
import { calculateKoreanIlyeonSamgukYusa, formatKoreanIlyeonSamgukYusaPrompt, KOREAN_ILYEON_SAMGUK_YUSA_VERSION } from '../src/lib/divination/koreanIlyeonSamgukYusaHeritageEngine';
import { calculateBritishWilliamShakespeareTragicWisdom, formatBritishWilliamShakespeareTragicWisdomPrompt, BRITISH_WILLIAM_SHAKESPEARE_TRAGIC_WISDOM_VERSION } from '../src/lib/divination/britishWilliamShakespeareTragicWisdomEngine';
import { calculateFrenchMarcelProustLostTimeRegained, formatFrenchMarcelProustLostTimeRegainedPrompt, FRENCH_MARCEL_PROUST_LOST_TIME_VERSION } from '../src/lib/divination/frenchMarcelProustLostTimeRegainedEngine';
import { calculateKoreanKimSoWolAzaleaFlowerPoeticGrace, formatKoreanKimSoWolAzaleaFlowerPoeticGracePrompt, KOREAN_KIM_SO_WOL_AZALEA_VERSION } from '../src/lib/divination/koreanKimSoWolAzaleaFlowerPoeticGraceEngine';
import { calculateIrishJamesJoyceUlyssesEpiphany, formatIrishJamesJoyceUlyssesEpiphanyPrompt, IRISH_JAMES_JOYCE_ULYSSES_EPIPHANY_VERSION } from '../src/lib/divination/irishJamesJoyceUlyssesEpiphanyEngine';
import { calculateGermanHermannHesseDemianSteppenwolf, formatGermanHermannHesseDemianSteppenwolfPrompt, GERMAN_HERMANN_HESSE_DEMIAN_STEPPENWOLF_VERSION } from '../src/lib/divination/germanHermannHesseDemianSteppenwolfEngine';
import { calculateKoreanHanYongUnSilenceOfNim, formatKoreanHanYongUnSilenceOfNimPrompt, KOREAN_HAN_YONG_UN_SILENCE_OF_NIM_VERSION } from '../src/lib/divination/koreanHanYongUnSilenceOfNimEngine';
import { calculateKoreanYutjeomFourStickOracle, formatKoreanYutjeomFourStickPrompt, KOREAN_YUTJEOM_FOUR_STICK_VERSION } from '../src/lib/divination/koreanYutjeomFourStickOracleEngine';
import { calculateTamilThirukkuralAramPorulKamam, formatTamilThirukkuralAramPorulKamamPrompt, TAMIL_THIRUKKURAL_ARAM_PORUL_KAMAM_VERSION } from '../src/lib/divination/tamilThirukkuralAramPorulKamamEngine';

import { extractEpisodicMemoryLedger, buildLucyEpisodicMemoryPrompt, LUCY_EPISODIC_MEMORY_ENGINE_VERSION } from '../src/lib/lucyEpisodicMemoryEngine';
const profile={basic:{birthdate:'2000-08-16',birthtime:'04:00',gender:'female' as const,birthCity:'서울'}};
test('King Wen enumeration covers each of 64 hexagrams exactly once',()=>{
  const numbers=Array.from({length:64},(_,n)=>hexagram(Array.from({length:6},(_,i)=>(n>>i)&1)).number);
  assert.equal(new Set(numbers).size,64);assert.equal(Math.min(...numbers),1);assert.equal(Math.max(...numbers),64);
  assert.equal(hexagram([1,1,1,1,1,1]).name,'건위천');assert.equal(hexagram([0,0,0,0,0,0]).name,'곤위지');
  assert.equal(hexagram([1,0,1,0,1,0]).number,63);assert.equal(hexagram([0,1,0,1,0,1]).number,64);
});
test('moving yin/yang produce the opposite changed lines; order is bottom to top',()=>{
  const a=calculateIching([6,6,6,9,9,9]);assert.equal(a.primary.number,12);assert.equal(a.changed.number,11);assert.deepEqual(a.movingLines,[1,2,3,4,5,6]);
  const staticLines=calculateIching([7,8,7,8,7,8]);assert.deepEqual(staticLines.movingLines,[]);assert.equal(staticLines.primary.number,staticLines.changed.number);
  for (const a of [[7],[7,7,7,7,7,10],[7,7,7,7,7,NaN]]) assert.throws(()=>calculateIching(a),RangeError);
});
test('three coin enumeration has 1:3:3:1 line probabilities, without biased modulo sampling',()=>{
  const counts=[0,0,0,0];
  for(let n=0;n<8;n++){const r=castIching(b=>{for(let i=0;i<18;i++)b[i]=(n>>(i%3))&1;return b;});counts[r.lines[0]-6]++;}
  assert.deepEqual(counts,[1,3,3,1]);
  const r=castIching();assert.equal(r.lines.length,6);assert(r.lines.every(n=>[6,7,8,9].includes(n)));
});
test('Ziwei documented 2000-8-16 female 寅-hour example has 午 soul / 戌 body and 14 major stars',()=>{
  const r=calculateZiwei(profile);assert.equal(r.soulPalace,'오');assert.equal(r.bodyPalace,'술');assert.equal(r.palaces.length,12);
  assert.equal(r.palaces.flatMap(p=>p.major).length,14);
  assert.equal(r.palaces.flatMap(p=>[...p.major,...p.minor]).filter(s=>s.mutagen).length,4);
  assert.deepEqual(r.palaces.find(p=>p.name==='재백')!.major.map(s=>s.name),['무곡','천상']);
  const lunar={basic:{...profile.basic,birthdate:'2000-07-17',lunarSolar:'lunar' as const}};
  assert.deepEqual(calculateZiwei(lunar).palaces,r.palaces);
});
test('Ziwei never supplies a made-up birth time or binary gender',()=>{
  assert.throws(()=>calculateZiwei({basic:{...profile.basic,birthtime:''}}),/출생시간/);
  assert.throws(()=>calculateZiwei({basic:{...profile.basic,gender:'other'}}),/성별/);
  assert.throws(()=>calculateZiwei({basic:{...profile.basic,birthdate:'2024-02-30'}}));
  assert.throws(()=>calculateZiwei({basic:{...profile.basic,birthdate:'1800-01-01'}}),/지원/);
});
test('Sukuyo month anchors, daily progression, and directed reciprocal relationships',()=>{
  const anchors=['室','奎','胃','畢','參','鬼','張','角','氐','心','斗','虚'];
  anchors.forEach((s,i)=>assert.equal(sukuyoFromLunar(i+1,1).mansion,s+'宿'));
  assert.equal(sukuyoFromLunar(1,28).mansion,sukuyoFromLunar(1,1).mansion);
  assert.throws(()=>sukuyoFromLunar(2,1,true),/윤달/);assert.throws(()=>sukuyoFromLunar(13,1));
  assert.equal(calculateSukuyo(profile).mansion,'奎宿');
  assert.equal(sukuyoRelationship(0,9).fromA,'업');assert.equal(sukuyoRelationship(0,9).fromB,'태');
  for(let i=0;i<27;i++)assert.equal(sukuyoRelationship(0,i).fromA,sukuyoRelationship(i,0).fromB);
});
test('Vedic reference values stay bounded and dasha periods are contiguous; limitations remain visible',()=>{
  const r=calculateVedic(profile);assert.match(r.method,/근사/);assert(r.ayanamsa>23&&r.ayanamsa<25);
  for(const x of Object.values(r.planets))assert(x>=0&&x<360);
  assert(r.nakshatra.index>=1&&r.nakshatra.index<=27);assert(r.nakshatra.pada>=1&&r.nakshatra.pada<=4);
  assert.equal(r.vimshottari.periods[0].endYearsAfterBirth,r.vimshottari.birthBalanceYears);
  for(let i=1;i<9;i++)assert.equal(r.vimshottari.periods[i].startYearsAfterBirth,r.vimshottari.periods[i-1].endYearsAfterBirth);
  assert.throws(()=>calculateVedic({basic:{...profile.basic,birthtime:''}}),/출생시간/);
});
test('event times convert supported zones and reject DST ambiguity/nonexistent times',()=>{
  assert.equal(eventInstant('2024-01-15','11:00','Asia/Seoul').toISOString(),'2024-01-15T02:00:00.000Z');
  assert.throws(()=>eventInstant('2024-03-10','02:30','America/New_York'));
  assert.throws(()=>eventInstant('2024-11-03','01:30','America/New_York'));
  assert.throws(()=>eventInstant('2024-01-15','24:00','Asia/Seoul'));
});
test('Liuren upstream ancient-case fixture uses the declared month general on the hour branch',()=>{
  const r=getLiuRenByYueJiang('亥','未','丁巳');assert.equal(r.tianDiPan.tianPan.wei,'亥');assert.equal(r.dateInfo.bazi,'-- -- 丁巳 丁未');
  const a=calculateLiuren(eventInstant('2024-01-15','11:00','Asia/Seoul'));assert.equal(a.monthGeneral,'丑');assert.equal(a.day,'戊寅');assert.equal(a.hour,'丁巳');
  assert.equal(Object.keys(a.board.tianPan).length,12);assert.equal(Object.keys(a.lessons).length,4);
  assert.equal(a.transmissions.chuChuan.length,4);
});
test('Liuren month general changes at the astronomical middle term, not at civil midnight',()=>{
  const t=SearchSunLongitude(330,new Date('2026-02-15T00:00:00Z'),10)!.date.getTime();
  assert.equal(calculateLiuren(new Date(t-120000)).monthGeneral,'子');
  assert.equal(calculateLiuren(new Date(t+120000)).monthGeneral,'亥');
});
test('Qimen upstream winter/summer/hour fixtures retain their school and timezone metadata',()=>{
  const a=calculateQimen(eventInstant('2024-01-15','11:00','Asia/Seoul'));
  assert.equal(a.chart['節氣'],'小寒');assert.equal(a.chart['三元'],'中元');assert.equal(a.chart['局數'],8);assert.equal(a.chart['陰陽'],'陽');
  assert.equal(a.calculatedUTC8Hour,'2024-01-15T10:00');assert.match(a.method,/홍국기문 4주 수리 포국과는 별개의 점시 포국/);
  const b=calculateQimen(eventInstant('2024-07-08','15:00','Asia/Seoul'));assert.equal(b.chart['陰陽'],'陰');
  assert.equal((a.chart['天盤'] as string[]).length,9);
});
test('event board results are independent of host timezone',()=>{
  const old=process.env.TZ;
  try {
    const date=new Date('2024-01-15T02:00:00Z');process.env.TZ='UTC';const a=calculateLiuren(date);const q=calculateQimen(date);
    process.env.TZ='America/New_York';assert.deepEqual(calculateLiuren(date),a);assert.deepEqual(calculateQimen(date),q);
  } finally {if(old===undefined)delete process.env.TZ;else process.env.TZ=old;}
});
test('chat receives actual birth outputs and no fake event casting',()=>{
  const digest=buildUserFifteenToolsDigest(profile);
  assert.match(digest,/자미두수 실제 산출/);assert.match(digest,/숙요 실제 산출/);assert.match(digest,/베딕 참고 계산 실제 산출/);assert.match(digest,/임의 포국·작괘 금지/);
});

test('Qimen refuses minute-level results after a solar-term transition within the hour',()=>{
  const t=SearchSunLongitude(315,new Date('2026-02-01T00:00:00Z'),10)!.date;
  assert.throws(()=>calculateQimen(new Date(t.getTime()+120000)),/분 단위/);
});

test('Tojeong reference example: lunar 1990-05-20 birth viewed in 丙午 2026 casts 551 with taese 16, wolgeon 18, iljin 17',()=>{
  const r=calculateTojeong({profile:{basic:{birthdate:'1990-05-20',lunarSolar:'lunar' as const}},targetYear:2026});
  assert.equal(r.status,'calculated');
  assert.equal(r.targetYearGanZhi,'병오');assert.equal(r.taeseCount,16);
  assert.equal(r.birthMonthGanZhi,'갑오');assert.equal(r.wolgeonCount,18);assert.equal(r.birthMonthLength,29);
  assert.equal(r.birthdayGanZhi,'기묘');assert.equal(r.iljinCount,17);
  assert.equal(r.ageKorean,37);
  assert.equal(r.upperGua,5);assert.equal(r.middleGua,5);assert.equal(r.lowerGua,1);
  assert.equal(r.hexagramCode,'551');assert.equal(r.hexagramName,'손위풍');
  assert.equal(r.monthlyFortunes.length,12);
  assert(r.monthlyFortunes.every(m=>m.fortune.length>10&&m.tip.length>5));
  assert(formatTojeongPrompt(r).includes('551괘'));
  const again=calculateTojeong({profile:{basic:{birthdate:'1990-05-20',lunarSolar:'lunar' as const}},targetYear:2026});
  assert.equal(again.hexagramCode,r.hexagramCode);assert.equal(again.annualSummary,r.annualSummary);
});

test('Tojeong converts solar births to lunar, clamps a 30th-day birthday missing in the target year, and skips without birthdate',()=>{
  // 양력 2000-01-01 = 음력 1999-11-25, 2023 계묘년 → 세는나이 25·태세수 15·월건수 18(갑자월·작은달)·일진수 16(기사일)
  const r=calculateTojeong({profile:{basic:{birthdate:'2000-01-01',lunarSolar:'solar' as const}},targetYear:2023});
  assert.deepEqual(r.lunarBirth,{year:1999,month:11,day:25,isLeapMonth:false});
  assert.equal(r.ageKorean,25);assert.equal(r.taeseCount,15);
  assert.equal(r.birthMonthGanZhi,'갑자');assert.equal(r.wolgeonCount,18);assert.equal(r.birthMonthLength,29);
  assert.equal(r.upperGua,8);assert.equal(r.middleGua,5);assert.equal(r.lowerGua,2);
  assert.equal(r.hexagramCode,'852');assert.equal(r.hexagramName,'지풍승');
  const skipped=calculateTojeong({profile:null,targetYear:2026});
  assert.equal(skipped.status,'skipped');assert.match(skipped.note||'',/생년월일/);
});

test('Kyusei reference example: 1990-05-17 solar birth is 一白水星 with 五黄 巳-month moon star in 丙午 2026',()=>{
  const r=calculateKyusei({profile:{basic:{birthdate:'1990-05-17',gender:'female' as const,birthCity:'서울'}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(r.status,'calculated');assert.equal(r.engineVersion,KYUSEI_ENGINE_VERSION);
  assert.equal(r.honmyosei.star,1);assert.equal(r.honmyosei.name,'일백수성(一白水星)');
  assert.equal(r.getmyosei.star,5);assert.equal(r.getmyosei.monthBranch,'사');
  assert.equal(r.targetYearGanZhi,'병오');
  // 연반 2026: 일백 입중궁 순행 비성 (오황=남, 암검·세파=북)
  assert.deepEqual(Object.fromEntries(r.annualChart.palaces.map(p=>[p.direction,p.star])),{북:6,북동:4,동:8,남동:9,남:5,남서:7,서:3,북서:2});
  // 월반 2026-11 (술월): 구자 입중궁
  assert.equal(r.monthlyChart.centerStar,9);
  assert.deepEqual(Object.fromEntries(r.monthlyChart.palaces.map(p=>[p.direction,p.star])),{북:5,북동:3,동:7,남동:8,남:4,남서:6,서:2,북서:1});
  const hz=Object.fromEntries(r.hazards.map(h=>[h.name,h.direction]));
  assert.equal(hz['오황살(五黃煞)'],'남');assert.equal(hz['암검살(暗劍煞)'],'북');
  assert.equal(hz['세파살(歲破煞)'],'북');assert.equal(hz['월파살(月破煞)'],'남동');
  // 본명성 일백은 연반 중궁이라 본명살 방위가 없다
  assert.ok(!('본명살(本命煞)' in hz));
  // 상생입(금생수) 방위 중 흉살 없는 남서가 최길
  assert.equal(r.topFortuneDirection!.direction,'남서');
  assert.ok(r.fortuneDirections.find(f=>f.direction==='북')!.clean===false);
  assert.equal(r.usageScenarios.length,3);
  const again=calculateKyusei({profile:{basic:{birthdate:'1990-05-17',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(JSON.stringify(again.annualChart),JSON.stringify(r.annualChart));
  const prompt=formatKyuseiPrompt(r);
  assert(prompt.includes(KYUSEI_ENGINE_VERSION)&&prompt.includes('오황살')&&prompt.includes('일백수성'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert.equal(formatKyuseiPrompt(calculateKyusei({profile:null})),'');
});

test('Kyusei year stars descend through the published table (2024 三碧 → 2026 一白) and 월반 재현',()=>{
  const starOf=(d:string)=>calculateKyusei({profile:{basic:{birthdate:d,gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')}).honmyosei.star;
  assert.equal(starOf('2024-06-01'),3);assert.equal(starOf('2025-06-01'),2);assert.equal(starOf('2026-06-01'),1);
  assert.equal(starOf('2000-06-01'),9);assert.equal(starOf('1995-06-01'),5);
  // 삼벽(목) 사람: 상생입 별(일백)은 중궁 → 비화 사록 북동이 최길
  const sam=calculateKyusei({profile:{basic:{birthdate:'2024-06-01',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(sam.topFortuneDirection!.direction,'북동');
});

test('Kyusei day star matches published 九星暦 tables including the leap-period (九星置閭) switch days',()=>{
  const dayStar=(date:string)=>calculateKyusei({profile:{basic:{birthdate:'1990-05-17',gender:'female' as const}},targetDate:new Date(date+'T00:00:00Z')}).ilmyosei;
  // 2014-12 kyusei.co3 실측표: 陰遁 끝에서 갑자일에 一白 이연 후 陽遁
  assert.equal(dayStar('2014-12-16').star,3);assert.equal(dayStar('2014-12-17').star,2);
  assert.equal(dayStar('2014-12-18').star,1);assert.equal(dayStar('2014-12-19').star,1);assert.equal(dayStar('2014-12-20').star,2);
  // 2015-06 하지 직전 구자 이연 후 음遁
  assert.equal(dayStar('2015-06-16').star,9);assert.equal(dayStar('2015-06-17').star,9);assert.equal(dayStar('2015-06-18').star,8);
  // 2008-12-31: 윤달 갑오일(12-20) 七赤 陽遁 시작 → 12-31 九紫
  assert.equal(dayStar('2008-12-31').star,9);
  // 2019-11-23 갑자 一白 陽遁 시작(윤달 보정), 2020-06-20 갑오 三碧 陰遁, 2031-12-20 갑오 七赤 陽遁
  assert.equal(dayStar('2019-11-23').star,1);assert.equal(dayStar('2020-06-20').star,3);assert.equal(dayStar('2031-12-20').star,7);
  // 일진: 2000-01-01 = 무오일, 2014-12-19 = 갑자일
  assert.equal(dayStar('2000-01-01').dayGanZhi,'무오');assert.equal(dayStar('2014-12-19').dayGanZhi,'갑자');
});

test('Kyusei keeps the Ipchun-day boundary honest and skips without birthdate',()=>{
  const skippedDay=calculateKyusei({profile:{basic:{birthdate:'2026-02-04',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(skippedDay.status,'skipped');assert.match(skippedDay.note||'',/입춘 당일 생시 미입력/);
  const before=calculateKyusei({profile:{basic:{birthdate:'2026-02-04',birthtime:'00:30',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  const after=calculateKyusei({profile:{basic:{birthdate:'2026-02-04',birthtime:'23:30',gender:'female' as const}},targetDate:new Date('2026-11-02T00:00:00Z')});
  assert.equal(before.status,'calculated');assert.equal(after.status,'calculated');
  assert.notEqual(before.honmyosei.star,after.honmyosei.star);
  const skipped=calculateKyusei({profile:null});
  assert.equal(skipped.status,'skipped');assert.match(skipped.note||'',/생년월일/);
});

const sgProfile={basic:{birthdate:'2000-08-16',birthtime:'04:00',gender:'female' as const,birthCity:'서울'}};

test('Samjae phases follow the published triple-harmony table (들·눌·날 per anchor group)',()=>{
  const sg=(d:string,y:number)=>calculateSamjaeGyoUn({profile:{basic:{birthdate:d,gender:'female' as const}},targetYear:y}).samjae;
  // 신자진군: 쥐(1996 병자)·원숭이(1992 임신)·용(1988 무진)띠 — 2022 임인년 들삼재, 2024 갑진년 날삼재
  assert.equal(sg('1996-05-01',2022).phase,'들삼재(入三災)');
  assert.equal(sg('1992-05-01',2022).phase,'들삼재(入三災)');
  assert.equal(sg('1988-05-01',2024).phase,'날삼재(出三災)');
  assert.equal(sg('1996-05-01',2023).phase,'눌삼재(臥三災)');
  assert.equal(sg('1996-05-01',2026).isSamjaeYear,false);
  // 인오술군: 말(1990 경오)띠 — 2028 무신년 들삼재
  assert.equal(sg('1990-05-01',2028).phase,'들삼재(入三災)');
  // 해묘미군: 돼지(1995 을해)띠 — 2025 을사년 들삼재, 2027 정미년 날삼재
  assert.equal(sg('1995-05-01',2025).phase,'들삼재(入三災)');
  assert.equal(sg('1995-05-01',2027).phase,'날삼재(出三災)');
  // 사유축군: 닭(1993 계유)띠 — 2021 신축년 날삼재
  assert.equal(sg('1993-05-01',2021).phase,'날삼재(出三災)');
  // 3개년 궤적은 들→눌→날 순서로 고정되고 당해년도에 표식이 찍힌다
  const arc=sg('1996-05-01',2022).threeYearArc;
  assert.deepEqual(arc.map(a=>a.year),[2022,2023,2024]);
  assert.deepEqual(arc.map(a=>a.phase),['들삼재(入三災)','눌삼재(臥三災)','날삼재(出三災)']);
  assert.equal(arc[0].year===2022,arc[0].phase==='들삼재(入三災)');
});

test('Samjae grading is deterministic, bounded, and carries 원국 interaction details',()=>{
  const a=calculateSamjaeGyoUn({profile:sgProfile,targetYear:2022});
  const b=calculateSamjaeGyoUn({profile:sgProfile,targetYear:2022});
  assert.equal(JSON.stringify(a.samjae),JSON.stringify(b.samjae));
  assert(a.samjae.isSamjaeYear); // 2000 경진 용띠 → 2022 임인년 들삼재
  assert(['복삼재(福三災)','평삼재(平三災)','악삼재(惡三災)'].includes(a.samjae.grade!));
  assert(a.samjae.gradeReason.length>5);
  assert(a.samjae.interactions.every(i=>i.detail.length>5));
  assert(a.samjae.wellnessPrescription!.foods.length>=3);
  // 삼재가 아닌 해는 처방이 비고 등급이 null
  const off=calculateSamjaeGyoUn({profile:sgProfile,targetYear:2026}).samjae;
  assert.equal(off.isSamjaeYear,false);assert.equal(off.grade,null);assert.equal(off.wellnessPrescription,null);
});

test('GyoUn detection brackets the daewoon switch within 2 years and reports remaining months to Ipchun',()=>{
  const at=(y:number)=>calculateSamjaeGyoUn({profile:sgProfile,targetYear:y}).gyoUn;
  const cur=at(2026);
  assert(cur.currentDaewoon&&cur.nextDaewoon);
  assert.equal(cur.isGyoUnPeriod,false);
  const switchYear=cur.nextDaewoon!.startYear;
  const d2=at(switchYear-2);
  assert.equal(d2.isGyoUnPeriod,true);assert.equal(d2.windowType,'교체 전 조정기 (D-2)');
  assert.equal(d2.yearsUntilSwitch,2);
  assert(d2.monthsUntilSwitch!==null&&d2.monthsUntilSwitch>24&&d2.monthsUntilSwitch<26.5);
  const peak=at(switchYear);
  assert.equal(peak.isGyoUnPeriod,true);assert.equal(peak.windowType,'교체 당해년도 (대환절기·판도 대전환)');
  assert(peak.monthsUntilSwitch!==null&&peak.monthsUntilSwitch>0&&peak.monthsUntilSwitch<2);
  const after=at(switchYear+1);
  assert.equal(after.isGyoUnPeriod,true);assert.equal(after.windowType,'교체 직후 안착기 (+1)');
  assert.equal(after.monthsUntilSwitch,0);
  assert(d2.tenGodShift!.cushionGuide.length>10);
  assert(d2.seasonShift!==null);
  assert(d2.riskBufferAdvice.length>10&&d2.opportunityTiming.length>10);
});

test('Samjae/GyoUn skips without birthdate, degrades without gender, and renders the full prompt',()=>{
  const skipped=calculateSamjaeGyoUn({profile:null,targetYear:2026});
  assert.equal(skipped.status,'skipped');assert.match(skipped.note||'',/생년월일/);
  const r=calculateSamjaeGyoUn({profile:sgProfile,targetYear:2026});
  assert.equal(r.status,'calculated');assert.equal(r.engineVersion,SAMJAE_GYOUN_ENGINE_VERSION);
  const prompt=formatSamjaeGyoUnPrompt(r);
  assert(prompt.includes(SAMJAE_GYOUN_ENGINE_VERSION)&&prompt.includes('삼재')&&prompt.includes('교운기')&&prompt.includes('바이오웰니스'));
  assert(prompt.includes('교차 매트릭스'));
  assert(Boolean(r.samjaeGyoUnSynthesisMatrix?.integratedAction));
  assert.equal(formatSamjaeGyoUnPrompt(skipped),'');
  const noGender=calculateSamjaeGyoUn({profile:{basic:{birthdate:'2000-08-16'}},targetYear:2026});
  assert.equal(noGender.status,'calculated');
  assert(noGender.samjae.isSamjaeYear===false||noGender.samjae.isSamjaeYear===true);
  assert.equal(noGender.gyoUn.isGyoUnPeriod,false);assert.match(noGender.gyoUn.note||'',/성별/);
});

import { calculateAuspiciousStars, formatAuspiciousStarsPrompt, AUSPICIOUS_STARS_ENGINE_VERSION } from '../src/lib/divination/auspiciousStarsEngine';
const asProfile={basic:{birthdate:'2000-01-01',birthtime:'12:00',gender:'female' as const,birthCity:'서울'}}; // 戊午日 丙子月 己卯年 戊午時 (입춘 전)
test('Auspicious stars: 천을귀인 via year stem, kongwang/chung/hyeong interference, noble timing',()=>{
  const r=calculateAuspiciousStars({profile:asProfile,targetYear:2026});
  assert.equal(r.status,'calculated');assert.equal(r.engineVersion,AUSPICIOUS_STARS_ENGINE_VERSION);
  const eul=r.nobleMatrix.cheonEul!;
  assert.equal(eul.foundChar,'子');assert.equal(eul.foundPillars[0].pillar,'월주');
  const types=eul.interference.map(i=>i.type);
  assert(types.some(t=>t.includes('공망'))&&types.some(t=>t.includes('충'))&&types.some(t=>t.includes('형')));
  assert(eul.strengthLevel>=1&&eul.strengthLevel<5);
  assert.equal(r.nobleMatrix.munChang,null);assert.equal(r.nobleMatrix.hakDang,null);
  assert.equal(r.nobleMatrix.munGok,null);assert.equal(r.nobleMatrix.cheonDeok,null);assert.equal(r.nobleMatrix.wolDeok,null);
  assert.equal(r.totalNoblesFound,1);
  const t=r.timing!;
  assert.equal(t.targetYearGanZhi,'丙午');assert.deepEqual(t.thisYearNobles,[]);
  assert.equal(t.upcomingYears[0].year,2027);assert.equal(t.upcomingYears[0].ganZhi,'丁未');
  assert(t.upcomingYears[0].arrivedNobles.includes('천을귀인'));
  const prompt=formatAuspiciousStarsPrompt(r);
  assert(prompt.includes(AUSPICIOUS_STARS_ENGINE_VERSION)&&prompt.includes('천을귀인')&&prompt.includes('공망')&&prompt.includes('해석 경계'));
  assert(r.interpretiveBoundary.length>0);
  assert(!prompt.includes('/100')&&!prompt.includes('%'));
});
test('Auspicious stars: resonance detects when the partner holds my noble branch; skips without profile',()=>{
  const r=calculateAuspiciousStars({profile:asProfile,targetYear:2026,partnerProfile:asProfile});
  assert(r.resonance&&r.resonance.partnerHoldsMyNoble&&!r.resonance.mutual);
  assert.equal(r.resonance.resonanceScore,70);assert(r.resonance.foundDetails.length>0);
  const skipped=calculateAuspiciousStars({profile:null,targetYear:2026});
  assert.equal(skipped.status,'skipped');assert.match(skipped.note||'',/생년월일/);
  const a=calculateAuspiciousStars({profile:asProfile,targetYear:2030});
  const b=calculateAuspiciousStars({profile:asProfile,targetYear:2030});
  assert.deepEqual(a.nobleMatrix,b.nobleMatrix);assert.deepEqual(a.timing&&a.timing.upcomingYears,b.timing&&b.timing.upcomingYears);
});

import { calculateTaiyi, formatTaiyiPrompt, TAIYI_ENGINE_VERSION } from '../src/lib/divination/taiyiEngine';
import { runDeterministicEngine, ALL_DCE_ENGINES, getFiredEngineBadges } from '../src/lib/divination/deterministicEngine';

test('Taiyi Shenshu: 16-palace calculation, 72 Ju, Jusan/Gaeksan and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateTaiyi({ profile, targetYear: 2026 });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, TAIYI_ENGINE_VERSION);
  assert.equal(r1.targetYear, 2026);
  assert.equal(r1.targetYearGanZhi, '병오');
  assert(r1.calculation !== null);
  assert(r1.calculation.juNumber >= 1 && r1.calculation.juNumber <= 72);
  assert(r1.calculation.taiyiPalace >= 1 && r1.calculation.taiyiPalace <= 16);
  assert(r1.calculation.wenChangPalace >= 1 && r1.calculation.wenChangPalace <= 16);
  assert(r1.calculation.shiJiPalace >= 1 && r1.calculation.shiJiPalace <= 16);
  assert(r1.calculation.juSan > 0);
  assert(r1.calculation.gaekSan > 0);
  assert(r1.palaces.length === 16);
  assert(r1.threeGi !== null);
  assert(r1.fiveBlessings !== null);

  // Determinism check
  const r2 = calculateTaiyi({ profile, targetYear: 2026 });
  assert.deepEqual(r1, r2);

  // Prompt formatting
  const prompt = formatTaiyiPrompt(r1);
  assert(prompt.includes(TAIYI_ENGINE_VERSION));
  assert(prompt.includes('태을신수'));
  assert(prompt.includes('주산'));
  assert(prompt.includes('객산'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));

  // Skipped without birthdate
  const skipped = calculateTaiyi({ profile: null, targetYear: 2026 });
  assert.equal(skipped.status, 'skipped');
  assert.equal(formatTaiyiPrompt(skipped), '[태을신수: 사용자 생년월일이 입력되지 않아 태을신수 개인화 감응 계산을 건너뜁니다.]');

  // Integration in runDeterministicEngine: all 15 tools implemented (0 not_implemented)
  const report = runDeterministicEngine({ profile, question: '올해 사업 운세와 거시 흐름' });
  assert.equal(report.tools.taiyi.status, 'calculated');
  assert.equal(Object.values(report.tools).filter((t) => t.status === 'not_implemented').length, 0);
  assert(report.taiyiResult !== null && report.taiyiResult !== undefined);
});

import { calculateSukuyoAdvanced, formatSukuyoPrompt, SUKUYO_ENGINE_VERSION, sukuyoIndexFromLunar, sukuyoMansionInfoByIndex, type SukuyoRelationDynamic } from '../src/lib/divination/sukuyoEngine';
import { formatDeterministicEnginePrompt } from '../src/lib/divination/deterministicEngine';

const MANSION_HANJA_27 = ['角', '亢', '氐', '房', '心', '尾', '箕', '斗', '女', '虛', '危', '室', '壁', '奎', '婁', '胃', '昴', '畢', '觜', '參', '井', '鬼', '柳', '星', '張', '翼', '軫'];
const RELATION_LABELS_27 = ['명', '영', '쇠', '안', '위', '성', '괴', '우', '친', '업', '영', '쇠', '안', '위', '성', '괴', '우', '친', '태', '영', '쇠', '안', '위', '성', '괴', '우', '친'];
const SHUKGUK_BY_INDEX = ['경질', '독현', '악해', '화선', '악해', '급맹', '화선', '안중', '강유', '독현', '경질', '안중', '급맹', '안중', '급맹', '경질', '안중', '독현', '화선', '급맹', '급맹', '독현', '악해', '화선', '강유', '안중', '경질'];
const SHUKGUK_META_KEYS = ['안중', '화선', '급맹', '악해', '독현', '경질', '강유'];

const syProfile = { basic: { birthdate: '2000-08-16', birthtime: '04:00', gender: 'female' as const, birthCity: '서울' } }; // calculateSukuyo 실측: 규(奎)宿

function relOf(from: number, to: number): SukuyoRelationDynamic {
  // calculateSukuyoAdvanced 내부 relationDynamic과 동일 수리를 검증용으로 재현
  const distance = ((to - from + 27) % 27 + 27) % 27;
  const band = distance <= 4 ? '근거리' : distance <= 13 ? '중거리' : '원거리';
  const base: Record<string, number> = { 명: 72, 업: 78, 태: 82, 영: 88, 쇠: 35, 안: 80, 위: 42, 성: 90, 괴: 30, 우: 84, 친: 86 };
  const score = Math.min(100, Math.max(5, base[RELATION_LABELS_27[distance]] + (band === '근거리' ? 4 : band === '중거리' ? 0 : -4)));
  return { key: (['명', '영쇠', '영쇠', '안위', '안위', '성괴', '성괴', '우친', '우친', '업태', '영쇠', '영쇠', '안위', '안위', '성괴', '성괴', '우친', '우친', '업태', '영쇠', '영쇠', '안위', '안위', '성괴', '성괴', '우친', '우친'] as const)[distance], label: RELATION_LABELS_27[distance], hanja: '', pairSummary: '', distance, band, bandDynamics: '', polarity: '긍정(相生)', score, description: '' };
}

test('Sukuyo engine: 본명숙 산출 및 7대 숙격 매핑 정확성', () => {
  const r = calculateSukuyoAdvanced({ profile: syProfile });
  assert.equal(r.status, 'calculated');
  assert.equal(r.engineVersion, SUKUYO_ENGINE_VERSION);
  assert.equal(r.mansion!.hanja, '奎'); // birthCharts.calculateSukuyo 실측 '奎宿'와 일치
  assert.equal(r.mansion!.index, 13);
  assert.equal(r.mansion!.shukguk, '안중'); // 규(奎)는 안중숙
  assert(r.mansion!.fullName.includes('규목랑'));
  assert(r.lunarDate && r.lunarDate.isLeapMonth === false);
  assert(r.selfDynamics!.includes('규'));

  // 27숙 전수 숙격 매핑 검증 (정통 분류: 안중·화선·급맹·악해·독현·경질·강유)
  for (let i = 0; i < 27; i++) {
    const info = sukuyoMansionInfoByIndex(i);
    assert.equal(info.index, i);
    assert.equal(info.shukguk, SHUKGUK_BY_INDEX[i], `index ${i}`);
    assert(SHUKGUK_META_KEYS.includes(info.shukguk));
    assert(info.shukgukTrait.length > 1);
  }
  // 7대 숙격 대표 숙 스포트 체크: 두·익·실·규·묘=안중 / 여·장=강유
  for (const [hanja, shukguk] of [['斗', '안중'], ['翼', '안중'], ['室', '안중'], ['奎', '안중'], ['昴', '안중'], ['女', '강유'], ['張', '강유'], ['亢', '독현'], ['鬼', '독현'], ['虛', '독현'], ['畢', '독현'], ['角', '경질'], ['軫', '경질'], ['危', '경질'], ['胃', '경질'], ['星', '화선'], ['房', '화선'], ['箕', '화선'], ['觜', '화선'], ['尾', '급맹'], ['井', '급맹'], ['婁', '급맹'], ['壁', '급맹'], ['參', '급맹'], ['氐', '악해'], ['心', '악해'], ['柳', '악해']] as const) {
    const info = sukuyoMansionInfoByIndex(MANSION_HANJA_27.indexOf(hanja));
    assert.equal(info.shukguk, shukguk, `${hanja} → ${shukguk}`);
  }
  // 월별 기숙표 기준일 본명숙: 음력 팔월 초하루 = 각(角)수
  assert.equal(sukuyoIndexFromLunar(8, 1), MANSION_HANJA_27.indexOf('角'));
  assert.equal(sukuyoIndexFromLunar(1, 15), (MANSION_HANJA_27.indexOf('室') + 14) % 27);
  assert.throws(() => sukuyoIndexFromLunar(13, 1), /음력/);
  assert.throws(() => sukuyoIndexFromLunar(1, 0), /음력/);
});

test('Sukuyo 6대 관계성: 방향별 수리 일치 및 역대칭 검증', () => {
  // 전수 쌍 검증: birthCharts.sukuyoRelationship와 동일 수리
  for (let a = 0; a < 27; a++) {
    for (let b = 0; b < 27; b++) {
      const d = (b - a + 27) % 27;
      assert.equal(relOf(a, b).label, RELATION_LABELS_27[d], `a=${a} b=${b}`);
      assert.equal(relOf(b, a).label, RELATION_LABELS_27[(27 - d) % 27], `reverse a=${a} b=${b}`);
      assert(relOf(a, b).score >= 5 && relOf(a, b).score <= 100);
    }
  }
  // 대표 픽스처: 9숙 차이는 나→상대 업(業), 상대→나 태(胎)
  assert.equal(relOf(0, 9).label, '업');
  assert.equal(relOf(9, 0).label, '태');
  // 명(命): 동일 숙
  assert.equal(relOf(5, 5).label, '명');
  assert.equal(relOf(5, 5).distance, 0);
  // 6대 관계성 키 분류
  const keyOf = (d: number) => relOf(0, d).key;
  assert.equal(keyOf(0), '명'); assert.equal(keyOf(9), '업태'); assert.equal(keyOf(18), '업태');
  assert.equal(keyOf(1), '영쇠'); assert.equal(keyOf(2), '영쇠'); assert.equal(keyOf(19), '영쇠'); assert.equal(keyOf(20), '영쇠');
  assert.equal(keyOf(3), '안위'); assert.equal(keyOf(4), '안위'); assert.equal(keyOf(21), '안위'); assert.equal(keyOf(22), '안위');
  assert.equal(keyOf(5), '성괴'); assert.equal(keyOf(6), '성괴'); assert.equal(keyOf(23), '성괴'); assert.equal(keyOf(24), '성괴');
  assert.equal(keyOf(7), '우친'); assert.equal(keyOf(8), '우친'); assert.equal(keyOf(25), '우친'); assert.equal(keyOf(26), '우친');
  // 영(榮)은 최상 시너지, 괴(壞)는 최저 — 결정론 스코어 경계
  assert(relOf(0, 1).score > relOf(0, 6).score);
  assert.equal(relOf(0, 6).score, 30); // 괴(壞) 원거리 보정 없음(6숙=중거리)
});

test('Sukuyo 3거리 판정 정확성', () => {
  const bandOf = (d: number) => relOf(0, d).band;
  assert.equal(bandOf(1), '근거리'); assert.equal(bandOf(4), '근거리');
  assert.equal(bandOf(5), '중거리'); assert.equal(bandOf(13), '중거리');
  assert.equal(bandOf(14), '원거리'); assert.equal(bandOf(26), '원거리');
  assert.equal(bandOf(0), '근거리'); // 명(命) 동일 숙은 근거리 특례
});

test('Sukuyo partner matrix: 양방향 궁합, 27숙 전수 매트릭스, 결정론 및 포맷터', () => {
  const partner = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateSukuyoAdvanced({ profile: syProfile, partnerProfile: partner });
  assert.equal(r1.status, 'calculated');
  assert(r1.partnerMatrix);
  const pm = r1.partnerMatrix!;
  assert.equal(pm.fullMatrix.length, 27);
  // 전수 매트릭스의 거리·라벨 수리 일치
  for (const row of pm.fullMatrix) {
    assert.equal(row.distance, (row.partnerIndex - r1.mansion!.index + 27) % 27);
    assert.equal(row.fromMe.label, RELATION_LABELS_27[row.distance]);
    assert.equal(row.fromPartner.label, RELATION_LABELS_27[(27 - row.distance) % 27]);
    assert(row.fromMe.score >= 5 && row.fromMe.score <= 100);
    assert(['근거리', '중거리', '원거리'].includes(row.fromMe.band));
  }
  assert(pm.compatibilityScore >= 5 && pm.compatibilityScore <= 100);
  assert(pm.partnerProfileSummary.length > 0);
  // 결정론: 동일 입력 동일 출력
  const r2 = calculateSukuyoAdvanced({ profile: syProfile, partnerProfile: partner });
  assert.deepEqual(JSON.stringify(r1), JSON.stringify(r2));
  // 상대 프로필이 없으면 매트릭스 생략
  const solo = calculateSukuyoAdvanced({ profile: syProfile });
  assert.equal(solo.partnerMatrix, null);
  // 프로필 누락 시 skipped
  const skipped = calculateSukuyoAdvanced({ profile: null });
  assert.equal(skipped.status, 'skipped');
  assert.match(skipped.note || '', /생년월일/);
  assert.equal(formatSukuyoPrompt(skipped), '');
  // 프롬프트 포맷터: 엔진 버전·핵심 수어 포함
  const prompt = formatSukuyoPrompt(r1);
  assert(prompt.includes(SUKUYO_ENGINE_VERSION));
  assert(r1.calculatedAtKst?.endsWith('KST'));
  assert(Boolean(r1.sukuyoSynthesisMatrix?.integratedAction));
  assert(prompt.includes('본명숙') && prompt.includes('숙격') && prompt.includes('6대 관계성') && prompt.includes('3거리'));
  assert(prompt.includes('규목랑(奎木狼)'));
  assert(prompt.includes('27숙 전수 양방향 매트릭스'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  // 결정론 엔진 통합 바인딩
  const report = runDeterministicEngine({ profile: syProfile, question: '내 본명숙과 궁합 알려줘' });
  assert(report.sukuyoAdvancedResult !== null && report.sukuyoAdvancedResult !== undefined);
  assert.equal(report.sukuyoAdvancedResult?.status, 'calculated');
  assert.equal(report.tools.sukuyo.status, 'calculated');
  const formatted = formatDeterministicEnginePrompt(report);
  assert(formatted.includes(SUKUYO_ENGINE_VERSION));
  const noProfile = runDeterministicEngine({ profile: null });
  assert.equal(noProfile.sukuyoAdvancedResult?.status, 'skipped');
});

import { calculateGeokguk, formatGeokgukPrompt, GEOKGUK_ENGINE_VERSION, decideGeokgukFromPillars } from '../src/lib/divination/geokgukEngine';

test('Geokguk engine: Zipyeong Jinjeon 10-geok judgment, seong/pa/gueung, determinism and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateGeokguk({ profile });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, GEOKGUK_ENGINE_VERSION);
  assert(r1.monthCommand !== null);
  assert.match(r1.monthCommand.branch, /[子丑寅卯辰巳午未申酉戌亥]/);
  assert(r1.monthCommand.stem.length >= 1);
  assert.match(r1.geokgukType, /格\)$/);
  assert(['성격(成格)', '구응(救應) 성공 · 성격(成格) 회복', '파격(破格)', '원격(原格) 성립'].includes(r1.verdict));
  assert(r1.yongMethod.length > 0);

  // 성격/파격/구응 판정 일관성
  if (r1.paGyeok.length > 0 && r1.guEung.length > 0) {
    assert.equal(r1.verdict, '구응(救應) 성공 · 성격(成格) 회복');
  } else if (r1.paGyeok.length > 0) {
    assert.equal(r1.verdict, '파격(破格)');
    assert.equal(r1.sangSin, null);
  } else if (r1.seongGyeok?.achieved) {
    assert.equal(r1.verdict, '성격(成格)');
    assert(r1.sangSin !== null);
  } else {
    assert.equal(r1.verdict, '원격(原格) 성립');
  }
  assert(r1.careerReport !== null && r1.careerReport.archetype.length > 0);
  assert(r1.careerReport.careers.length >= 3);

  // 대표 명식 수리: 성격(成格) — 정관격 재생관
  const seong = decideGeokgukFromPillars({ dayStem: '辛', monthBranch: '巳', stems: ['甲', '丙', '乙'], bodyLevel: '중화' });
  assert.equal(seong.geokgukName, '정관격');
  assert.equal(seong.verdict, '성격(成格)');
  assert.equal(seong.shinsalClass, '길신(善神) · 순용(順用)');
  assert(seong.seongGyeok !== null && seong.seongGyeok.title.includes('재생관'));

  // 대표 명식 수리: 파격(破格) + 구응(救應) — 상관견관을 인성제상으로 회복
  const gueung = decideGeokgukFromPillars({ dayStem: '辛', monthBranch: '巳', stems: ['壬', '丙', '戊'], bodyLevel: '중화' });
  assert.equal(gueung.geokgukName, '정관격');
  assert.equal(gueung.verdict, '구응(救應) 성공 · 성격(成格) 회복');
  assert(gueung.paGyeok.some((p) => p.type.includes('상관견관')));
  assert(gueung.guEung.some((g) => g.title.includes('인성제상')));

  // 대표 명식 수리: 파격(破格) — 상관견관 무구응
  const pa = decideGeokgukFromPillars({ dayStem: '辛', monthBranch: '巳', stems: ['壬', '丙', '丁'], bodyLevel: '중화' });
  assert.equal(pa.verdict, '파격(破格)');
  assert.equal(pa.guEung.length, 0);

  // 대표 명식 수리: 군겁쟁재 + 식상통관 구응
  const gun = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '丑', stems: ['乙', '乙', '丙'], bodyLevel: '중화' });
  assert.equal(gun.geokgukName, '정재격');
  assert.equal(gun.verdict, '구응(救應) 성공 · 성격(成格) 회복');

  // 대표 명식 수리: 도식(梟神奪食) + 재성제인 구응
  const tosik = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '巳', stems: ['壬', '丙', '戊'], bodyLevel: '중화' });
  assert.equal(tosik.geokgukName, '식신격');
  assert.equal(tosik.verdict, '구응(救應) 성공 · 성격(成格) 회복');

  // 대표 명식 수리: 신약살왕 무구응 파격 vs 살인상생 구원
  const sinYak = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '申', stems: ['庚', '庚', '辛'], bodyLevel: '극신약' });
  assert.equal(sinYak.geokgukName, '칠살격');
  assert.equal(sinYak.verdict, '파격(破格)');
  const salIn = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '申', stems: ['庚', '庚', '壬'], bodyLevel: '신약' });
  assert.equal(salIn.verdict, '성격(成格)');
  assert(salIn.seongGyeok !== null && salIn.seongGyeok.title.includes('살인상생'));

  // 월령 성립 원천: 건록/양인 직취
  const geonrok = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '寅', stems: ['癸', '丙', '癸'], bodyLevel: '신강' });
  assert.equal(geonrok.geokgukName, '건록격');
  const yangIn = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '卯', stems: ['辛', '癸', '辛'], bodyLevel: '신강' });
  assert.equal(yangIn.geokgukName, '양인격');
  assert.equal(yangIn.shinsalClass, '흉신(惡神) · 역용(逆用)');

  // 관살혼잡 구응: 합살류관(정관격)·재화상(상관격) 및 파격 시 상신 부재
  const ryuGwan = decideGeokgukFromPillars({ dayStem: '辛', monthBranch: '巳', stems: ['丙', '丁', '庚'], bodyLevel: '중화' });
  assert.equal(ryuGwan.verdict, '구응(救應) 성공 · 성격(成格) 회복');
  assert(ryuGwan.guEung.some((g) => g.title.includes('합살류관')));
  const jaeHwa = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '午', stems: ['己', '丁', '辛'], bodyLevel: '중화' });
  assert.equal(jaeHwa.verdict, '구응(救應) 성공 · 성격(成格) 회복');
  assert(jaeHwa.guEung.some((g) => g.title.includes('재화상')));
  const holJap = decideGeokgukFromPillars({ dayStem: '甲', monthBranch: '申', stems: ['辛', '庚', '壬'], bodyLevel: '신약' });
  assert.equal(holJap.verdict, '파격(破格)');
  assert.equal(holJap.sangSin, null);

  // 결정론성(동일 입력 동일 출력)
  const fixedNow = new Date('2026-11-15T07:45:00+09:00');
  const rFixed1 = calculateGeokguk({ profile, now: fixedNow, question: '내 격국과 적성 알려줘' });
  const rFixed2 = calculateGeokguk({ profile, now: fixedNow, question: '내 격국과 적성 알려줘' });
  assert.deepEqual(rFixed1, rFixed2);
  assert(rFixed1.calculatedAtKst?.includes('KST'));

  // 프롬프트 포맷터에 엔진 버전 및 시공간 리듬 포함
  const prompt = formatGeokgukPrompt(rFixed1);
  assert(prompt.includes(GEOKGUK_ENGINE_VERSION));
  assert(prompt.includes('격국'));
  assert(prompt.includes('KST'));
  assert(prompt.includes('상신(相神)') || r1.sangSin === null);
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));

  // 프로필 누락 시 skipped 처리
  const skipped = calculateGeokguk({ profile: null });
  assert.equal(skipped.status, 'skipped');
  assert.match(skipped.note || '', /생년월일/);

  // 결정론 엔진 통합 바인딩
  const report = runDeterministicEngine({ profile, question: '내 격국과 적성 알려줘' });
  assert(report.geokgukResult !== null && report.geokgukResult !== undefined);
  assert.equal(report.geokgukResult?.status, 'calculated');
  assert(report.geokgukResult?.monthCommand !== null && report.geokgukResult?.monthCommand !== undefined);
});

import { calculateTwentyEightMansions, formatTwentyEightMansionsPrompt, TWENTY_EIGHT_MANSIONS_ENGINE_VERSION } from '../src/lib/divination/twentyEightMansionsEngine';

test('28 Mansions: deterministic day-star with weekday-luminary 7-cycle alignment and reference fixtures', () => {
  const at = (iso: string) => calculateTwentyEightMansions({ targetDate: new Date(iso) });

  // 정통 실측표 픽스처: 2026-11-01(일) 묘수·흉, 2026-11-02(월) 필수·길, 기원점 1685-02-04(일) 성수
  const r1102 = at('2026-11-02T00:00:00+09:00');
  assert.equal(r1102.mansion.name, '필');
  assert.equal(r1102.mansion.hanja, '畢');
  assert.equal(r1102.mansion.group, '서방백호(西方白虎)');
  assert.equal(r1102.mansion.luminary, '월(月)');
  assert.equal(r1102.mansion.element, '수(水)'); // 월요 수는 태음진수
  assert.equal(r1102.weekday, '월요일');
  assert.equal(r1102.weekdayLuminary, '월(月)');
  assert.equal(r1102.luminaryWeekdayAligned, true); // 7원 4주기: 직성 칠요 = 요일 칠요
  assert.equal(r1102.dayGanZhi, '경진');
  const r1101 = at('2026-11-01T00:00:00+09:00');
  assert.equal(r1101.mansion.name, '묘');
  assert.equal(r1101.mansion.grade, '흉(凶)');
  assert.equal(r1101.mansion.luminary, '일(日)');
  const anchor = at('1685-02-04T00:00:00+09:00');
  assert.equal(anchor.mansion.name, '성');
  assert.equal(anchor.mansion.hanja, '星');
  assert.equal(anchor.julianDayNumber, 2336529);

  // 결정론: 동일 날짜 → 동일 직성·점수
  assert.deepEqual(r1102, at('2026-11-02T00:00:00+09:00'));
  // UTC 입력도 KST 일자로 정규화 (UTC 00:00 = KST 09:00 → 같은 날)
  assert.equal(at('2026-11-01T00:00:00Z').mansion.name, '묘');
  assert.equal(at('2026-11-01T15:00:00Z').mansion.name, '필'); // KST로 이미 다음 날

  // 28일 주기 순환: 28일 후 같은 직성이며 요일·칠요 일치는 84일(7원) 연속 성립
  for (const iso of ['2026-01-15', '2026-06-20', '2027-02-28']) {
    const t = at(iso + 'T00:00:00+09:00');
    const t28 = at(new Date(new Date(iso + 'T00:00:00+09:00').getTime() + 28 * 86400000).toISOString());
    assert.equal(t28.mansion.name, t.mansion.name);
    assert.equal(t28.mansion.index, t.mansion.index);
  }
  let base = new Date('2026-01-01T00:00:00+09:00').getTime();
  for (let k = 0; k < 84; k++) {
    const r = calculateTwentyEightMansions({ targetDate: new Date(base + k * 86400000) });
    assert.equal(r.luminaryWeekdayAligned, true, `day ${k}`);
    assert.equal(r.mansion.index, (r.julianDayNumber + 11) % 28);
  }
});

test('28 Mansions six-domain scoring: bounds, consistency, 28-day date selection, prompt and engine binding', () => {
  const r = calculateTwentyEightMansions({ targetDate: new Date('2026-11-02T00:00:00+09:00') });
  assert.equal(r.status, 'calculated');
  assert.equal(r.engineVersion, TWENTY_EIGHT_MANSIONS_ENGINE_VERSION);

  // 6대 영역 스코어링 정합성
  assert.equal(r.domainScores.length, 6);
  assert.deepEqual(r.domainScores.map((s) => s.domain), ['contract', 'businessLaunch', 'travel', 'finance', 'relationship', 'healing']);
  for (const s of r.domainScores) {
    assert(s.score >= 5 && s.score <= 98, `${s.domain} score ${s.score}`);
    assert(['대길', '길', '평', '흉', '대흉'].includes(s.grade));
    assert.equal(s.grade, s.score >= 85 ? '대길' : s.score >= 70 ? '길' : s.score >= 55 ? '평' : s.score >= 40 ? '흉' : '대흉');
    assert(s.reason.includes('결정론 수리'));
    assert(s.actionGuide.length > 30);
    assert(s.bestDates.length === 3);
    for (const b of s.bestDates) {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(b.date));
      assert(b.score >= 5 && b.score <= 98);
      assert(/.+\(.\)$/.test(b.mansionName));
    }
    // 최적 후보일은 점수 내림차순
    assert(s.bestDates[0].score >= s.bestDates[1].score && s.bestDates[1].score >= s.bestDates[2].score);
  }
  assert(r.overallVerdict.includes('직성') && r.overallVerdict.includes('7원 4주기'));
  assert(r.overallGuide.length > 30);

  // 프롬프트 포맷터에 엔진 버전·핵심 수어 포함
  const prompt = formatTwentyEightMansionsPrompt(r);
  assert(prompt.includes(TWENTY_EIGHT_MANSIONS_ENGINE_VERSION));
  assert(r.calculatedAtKst.endsWith('KST'));
  assert(Boolean(r.mansionsSynthesisMatrix?.integratedAction));
  assert(prompt.includes('천상열차분야지도') && prompt.includes('28수 직성'));
  assert(prompt.includes('필월오(畢月烏)') && prompt.includes('계약·협상') && prompt.includes('휴식·치유·내실'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
  // 천문 3원, 4방신 신수 조화, 28일 순환 국면 검증
  assert(r.threeEnclosuresResonance?.celestialCourt !== undefined);
  assert(r.threeEnclosuresResonance!.resonanceScore >= 40 && r.threeEnclosuresResonance!.resonanceScore <= 98);
  assert.equal(r.celestialBeastAlignment?.beastName, '백호(白虎)');
  assert(r.celestialBeastAlignment!.harmonyIndex >= 40 && r.celestialBeastAlignment!.harmonyIndex <= 98);
  assert.equal(r.quadrantTransition?.phaseName, '서방백호 결단수렴기');
  assert.equal(r.quadrantTransition?.cycleDay, 19);
  assert(prompt.includes('천문 3원(三垣) 공명'));
  assert(prompt.includes('4방신 신수 조화'));
  assert(prompt.includes('28일 순환 국면'));

  // 결정론 엔진 통합 바인딩 (생년월일 무관 당일 일진 기준 산출)
  const report = runDeterministicEngine({ profile: { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } }, question: '이사 날짜 알려줘' });
  assert(report.twentyEightMansionsResult !== null && report.twentyEightMansionsResult !== undefined);
  assert.equal(report.twentyEightMansionsResult?.status, 'calculated');
  assert(report.twentyEightMansionsResult?.luminaryWeekdayAligned === true);
  const noProfileReport = runDeterministicEngine({ profile: null });
  assert(noProfileReport.twentyEightMansionsResult?.status === 'calculated'); // 프로필 없이도 일진 산출
});

import { calculateMahabote, formatMahabotePrompt, MAHABOTE_ENGINE_VERSION } from '../src/lib/divination/mahaboteEngine';

test('Burmese Mahabote: 7-house chart calculation, root house, age transit, Rahu branching, determinism and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r1 = calculateMahabote({ profile, targetYear: 2026 });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, MAHABOTE_ENGINE_VERSION);
  assert.equal(r1.myanmarEra, 1357);
  assert.equal(r1.remainder, 6);
  assert.equal(r1.houses.length, 7);
  assert(r1.rootHouse !== null);
  assert(r1.houses.some((h) => h.isBirthRootHouse));
  assert(r1.currentAgeTransit !== null);
  assert(r1.remedies !== null);

  // Determinism check
  const r2 = calculateMahabote({ profile, targetYear: 2026 });
  assert.deepEqual(r1, r2);

  // Wednesday afternoon Rahu test (1995-03-22 was Wednesday)
  const wedMorning = calculateMahabote({ profile: { basic: { birthdate: '1995-03-22', birthtime: '09:00' } } });
  assert.equal(wedMorning.birthPlanet.planet, '수성(Mercury)');
  const wedAfternoon = calculateMahabote({ profile: { basic: { birthdate: '1995-03-22', birthtime: '15:00' } } });
  assert.equal(wedAfternoon.birthPlanet.planet, '라후(Rahu)');

  // Prompt formatting
  const prompt = formatMahabotePrompt(r1);
  assert(prompt.includes(MAHABOTE_ENGINE_VERSION));
  assert(prompt.includes('마하보테'));
  assert(prompt.includes('본명궁'));
  assert(r1.planetaryAffinity !== undefined);
  assert(r1.planetaryAffinity!.planetaryHarmonyScore >= 45 && r1.planetaryAffinity!.planetaryHarmonyScore <= 98);
  assert(r1.domainAffinities !== undefined);
  assert(r1.domainAffinities!.leadershipHonor >= 0 && r1.domainAffinities!.leadershipHonor <= 100);
  assert(r1.transitInteraction !== undefined);
  assert(r1.transitInteraction!.phase.length > 0);
  assert(prompt.includes('행성 조화도 및 친화수리'));
  assert(prompt.includes('4대 인생 영역 친화도'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(r1.calculatedAtKst?.endsWith('KST'));

  // Skipped without birthdate
  const skipped = calculateMahabote({ profile: null });
  assert.equal(skipped.status, 'skipped');
  assert.equal(formatMahabotePrompt(skipped), '[마하보테: 사용자 생년월일이 입력되지 않아 마하보테 7궁 명반 계산을 건너뜁니다.]');

  // Integration in runDeterministicEngine
  const report = runDeterministicEngine({ profile, question: '내 인생 본명궁과 마하보테 운세' });
  assert(report.mahaboteResult !== null && report.mahaboteResult !== undefined);
  assert.equal(report.mahaboteResult?.status, 'calculated');
  assert.equal(report.tools.mahabote.status, 'calculated');
});



import { calculateVedicAdvanced, formatVedicPrompt, VEDIC_ENGINE_VERSION, VEDIC_METHOD, vedicNakshatraByIndex, nakshatraFromSiderealLongitude, buildVimshottariTimeline, lahiriAyanamsaAt, siderealLongitude } from '../src/lib/divination/vedicEngine';
import { Body } from 'astronomy-engine';

const VEDIC_LORD_CYCLE = ['케투', '금성', '태양', '달', '화성', '라후', '목성', '토성', '수성'];
const NAK_WIDTH = 360 / 27;

test('Vedic 27 nakshatras: full data table, lords cycle, gana/tattva groups and navamsa pada lords', () => {
  for (let i = 0; i < 27; i++) {
    const n = vedicNakshatraByIndex(i);
    assert.equal(n.number, i + 1);
    assert.equal(n.lord, VEDIC_LORD_CYCLE[i % 9]); // 지배 행성은 빔쇼타리 순환
    assert(n.deity.length > 0 && n.symbol.length > 0 && n.meaning.length > 0);
    assert.equal(n.spanDegrees.start, i * NAK_WIDTH);
    assert(Math.abs(n.spanDegrees.end - (i + 1) * NAK_WIDTH) < 1e-9);
  }
  assert.deepEqual(vedicNakshatraByIndex(0), { ...vedicNakshatraByIndex(0), name: '아슈비니', deity: '아슈비니 쿠마라(쌍둥이 의신)', symbol: '말 머리', gana: '신성(Deva)', tattva: '지(土·Prithvi)' });
  // 군(Gana): 신/인/마 각 9개
  const ganas = Array.from({ length: 27 }, (_, i) => vedicNakshatraByIndex(i).gana);
  for (const g of ['신성(Deva)', '인간(Manushya)', '마성(Rakshasa)']) assert.equal(ganas.filter((x) => x === g).length, 9);
  // 원소(Tattva): 지(0~4) 수(5~10) 화(11~16) 풍(17~21) 공(22~26)
  const tattvaBands = ['지(土·Prithvi)', '수(水·Apas)', '화(火·Tejas)', '풍(風·Vayu)', '공(空·Akasha)'];
  const bandSizes = [5, 6, 6, 5, 5];
  let cursor = 0;
  tattvaBands.forEach((t, b) => {
    for (let k = 0; k < bandSizes[b]; k++) assert.equal(vedicNakshatraByIndex(cursor + k).tattva, t);
    cursor += bandSizes[b];
  });
  assert.equal(cursor, 27);
  // 나바암사 파다 주인: 푸르바팔구니=태양/수성/금성/화성, 레바티=목성/토성/토성/목성 (고전표)
  assert.deepEqual(vedicNakshatraByIndex(10).padaLords, ['태양', '수성', '금성', '화성']);
  assert.deepEqual(vedicNakshatraByIndex(26).padaLords, ['목성', '토성', '토성', '목성']);
  assert.throws(() => vedicNakshatraByIndex(27), RangeError);
  assert.throws(() => vedicNakshatraByIndex(0, 5), RangeError);
});

test('Vedic pada mapping: 108 padas of 3°20\' wrap the whole sidereal zodiac', () => {
  assert.deepEqual(nakshatraFromSiderealLongitude(0), { index: 0, pada: 1, fractionIntoNakshatra: 0 });
  assert.equal(nakshatraFromSiderealLongitude(NAK_WIDTH - 0.0001).pada, 4); // 아슈비니 끝자락
  const b = nakshatraFromSiderealLongitude(NAK_WIDTH + 0.0001);
  assert.equal(b.index, 1); assert.equal(b.pada, 1); // 바라니 시작
  const t = nakshatraFromSiderealLongitude(359.999);
  assert.equal(t.index, 26); assert.equal(t.pada, 4); // 레바티 끝자락
  assert.deepEqual(nakshatraFromSiderealLongitude(360.5), { index: 0, pada: 1, fractionIntoNakshatra: 0.0375 }); // 360° 순환
  for (const s of [0, 90, 180, 269.9, 305.79]) {
    const r = nakshatraFromSiderealLongitude(s);
    assert(r.fractionIntoNakshatra >= 0 && r.fractionIntoNakshatra < 1);
    assert(r.pada >= 1 && r.pada <= 4);
  }
});

test('Vimshottari: 7+20+6+10+7+18+16+19+17 = 120-year total, 81 antardasha intervals, contiguity', () => {
  assert.equal(VEDIC_LORD_CYCLE.reduce((a, _, i) => a + [7, 20, 6, 10, 7, 18, 16, 19, 17][i], 0), 120);
  const birthMs = Date.parse('2000-01-01T00:00:00Z');
  const tl = buildVimshottariTimeline(0, 7, birthMs); // 케투 만생(잔여 7년 전체)
  assert.equal(tl.antardashaCount, 81); // 마하다샤 9 × 안타르다샤 9
  assert.equal(tl.mahadashas.length, 9);
  const spanSum = tl.mahadashas.reduce((s, m) => s + (m.endYearsAfterBirth - m.startYearsAfterBirth), 0);
  assert(Math.abs(spanSum - 120) < 1e-9);
  tl.mahadashas.forEach((m, i) => {
    assert.equal(m.lord, VEDIC_LORD_CYCLE[(0 + i) % 9]);
    assert.equal(m.antardashas.length, 9);
    const subSum = m.antardashas.reduce((s, a) => s + a.years, 0);
    assert(Math.abs(subSum - (m.endYearsAfterBirth - m.startYearsAfterBirth)) < 1e-9);
    if (i > 0) assert.equal(m.startYearsAfterBirth, tl.mahadashas[i - 1].endYearsAfterBirth); // 연속성
    m.antardashas.forEach((a, j) => {
      assert.equal(a.lord, VEDIC_LORD_CYCLE[(i + j) % 9]); // 안타르다샤는 모 주인부터 같은 순서
      if (j > 0) assert.equal(a.startYearsAfterBirth, m.antardashas[j - 1].endYearsAfterBirth);
    });
  });
  // 고전 안타르다샤 수리: 케투 마하다샤 내 케투-케투 7×7/120, 케투-금성 7×20/120
  assert(Math.abs(tl.mahadashas[0].antardashas[0].years - 49 / 120) < 1e-9);
  assert(Math.abs(tl.mahadashas[0].antardashas[1].years - 140 / 120) < 1e-9);
  assert.throws(() => buildVimshottariTimeline(0, 0, birthMs), RangeError);
  assert.throws(() => buildVimshottariTimeline(0, 7.1, birthMs), RangeError);
  assert.throws(() => buildVimshottariTimeline(9, 7, birthMs), RangeError);
});

test('Vedic engine fixtures: moon sidereal positions match independent panchang records', () => {
  // J2000 기준 라히리 아얀암사 23°51'11"
  assert(Math.abs(lahiriAyanamsaAt(new Date('2000-01-01T12:00:00Z')) - 23.8531) < 1e-4);
  // 카리기리 나이야나 에페메리스 16.08.2000: 아얀암사 23°51'54", 달 305°32' (0시 IST)
  const sid0800 = siderealLongitude(Body.Moon, new Date('2000-08-15T18:30:00Z'));
  assert(Math.abs(sid0800 - 305.5336) < 0.1);
  const profile1 = { basic: { birthdate: '2000-08-16', birthtime: '04:00', gender: 'female' as const, birthCity: '서울' } };
  const r1 = calculateVedicAdvanced({ profile: profile1, targetDate: new Date('2026-11-02T00:00:00Z') });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, VEDIC_ENGINE_VERSION);
  // 04:00 KST(=00:30 IST)는 다니슈타 4파다 (샤타비샤 개시는 그날 새벽 뒤 — Jaipur 판창·카리기리 상호 일치)
  assert.equal(r1.nakshatra!.name, '다니슈타');
  assert.equal(r1.nakshatra!.pada, 4);
  assert.equal(r1.nakshatra!.lord, '화성');
  assert.equal(r1.rashi!.chandra.name, '쿰바'); // 항성황도 달 305.79° → 쿰바 (Jaipur 판창 Moonsign 일치)
  assert(Math.abs(r1.dashaBalance!.years - 7 * (1 - 0.9342785256829406)) < 1e-3); // 화성 잔여 다샤
  assert.equal(r1.antardashaCount, 81);
  assert.equal(r1.birthInstant!.assumedNoon, false);
  const profile2 = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r2 = calculateVedicAdvanced({ profile: profile2, targetDate: new Date('2026-11-02T00:00:00Z') });
  // askoracle 1995-03-25 판창: 찬드라 उत्तराषाढ़ा 1(우타라아샤다 파다1, 태양) — 05:30Z 기준 일치
  assert.equal(r2.nakshatra!.name, '우타라아샤다');
  assert.equal(r2.nakshatra!.pada, 1);
  assert.equal(r2.nakshatra!.lord, '태양');
  assert(Math.abs(r2.dashaBalance!.years - 6 * (1 - 0.12636674978685872)) < 1e-3);
  assert.equal(r2.rashi!.chandra.name, '다누'); // 268.35° → 다누(人馬)
  assert.equal(r2.rashi!.surya.name, '미나'); // 3월 말 항성황도 태양은 미나(雙魚)
  assert(r2.rashi!.lagna !== null); // 생시+지원 도시 → 라그나 라시 산출
  assert(r2.rashi!.lagna!.index >= 0 && r2.rashi!.lagna!.index <= 11);
});

test('Vedic current dasha: 1995-03-25 birth at 2026-11-02 falls in Rahu-Sukra antardasha', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r = calculateVedicAdvanced({ profile, targetDate: new Date('2026-11-02T00:00:00Z'), question: '다샤 흐름' });
  assert(r.calculatedAtKst?.endsWith('KST'));
  assert(Boolean(r.vedicSynthesisMatrix?.integratedAction));
  const vPrompt = formatVedicPrompt(r);
  assert(vPrompt.includes('교차 매트릭스'));
  assert(!vPrompt.includes('/100'));
  assert(!vPrompt.includes('%'));
  // 잔여 태양 5.24y → 달 10y → 화성 7y 후 라후 18y(22.24y~); 라후-수성 30.19y~32.74y
  assert.equal(r.currentDasha!.mahadasha.lord, '라후');
  assert.equal(r.currentDasha!.antardasha.lord, '수성');
  assert(r.currentDasha!.ageYears > 30 && r.currentDasha!.ageYears < 33);
  // targetYear로도 같은 결정론 식별 (2026년 중간 기준점)
  const byYear = calculateVedicAdvanced({ profile, targetYear: 2026 });
  assert.equal(byYear.currentDasha!.mahadasha.lord, '라후');
});

test('Vedic engine: determinism, null-safe noon fallback, safe skip and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const fixed = new Date('2026-11-02T00:00:00Z');
  const r1 = calculateVedicAdvanced({ profile, targetDate: fixed });
  const r2 = calculateVedicAdvanced({ profile, targetDate: fixed });
  assert.deepEqual(r1, r2); // 동일 입력 동일 출력

  // 생시 없음 → 정오(12:00) 기준 null-safe 산출, 라그나는 미산출
  const noon = calculateVedicAdvanced({ profile: { basic: { birthdate: '1995-03-25', gender: 'male' as const } } });
  assert.equal(noon.status, 'calculated');
  assert.equal(noon.birthInstant!.assumedNoon, true);
  assert(noon.nakshatra!.name.length > 0);
  assert.equal(noon.rashi!.lagna, null);

  // 프로필 누락 시 safe fallback
  const skipped = calculateVedicAdvanced({ profile: null });
  assert.equal(skipped.status, 'skipped');
  const bad = calculateVedicAdvanced({ profile: { basic: { birthdate: '1800-01-01' } } });
  assert(bad.status === 'error' || bad.status === 'skipped');

  // 프롬프트 포맷터
  const prompt = formatVedicPrompt(r1);
  assert(prompt.includes('정통 베딕 조티시'));
  // 나바그라하 다샤 행성 조화, 켄드라·트리코나 번영, 4대 푸루샤르타 검증
  assert(r1.dashaPlanetarySynergy !== null && r1.dashaPlanetarySynergy !== undefined);
  assert(r1.dashaPlanetarySynergy!.synergyScore >= 45 && r1.dashaPlanetarySynergy!.synergyScore <= 98);
  assert(r1.kendraTrikonaProsperity !== null && r1.kendraTrikonaProsperity !== undefined);
  assert(r1.kendraTrikonaProsperity!.dharmaProsperityScore >= 40 && r1.kendraTrikonaProsperity!.dharmaProsperityScore <= 98);
  assert(r1.purusharthaAlignment !== null && r1.purusharthaAlignment !== undefined);
  assert.equal(
    r1.purusharthaAlignment!.dharmaWeight +
      r1.purusharthaAlignment!.arthaWeight +
      r1.purusharthaAlignment!.kamaWeight +
      r1.purusharthaAlignment!.mokshaWeight,
    100
  );
  assert(prompt.includes('다샤 행성 조화'));
  assert(prompt.includes('켄드라·트리코나 번영'));
  assert(prompt.includes('4대 푸루샤르타 인생 목적'));
  assert(prompt.includes('LUCKEY-VD-v1.0.0'));
  assert(prompt.includes('빔쇼타리'));
  assert(prompt.includes('나크샤트라'));
  assert(prompt.includes('안타르다샤'));
  assert(prompt.includes('라후-수성'));
  assert.equal(formatVedicPrompt(skipped), '');
  assert(VEDIC_METHOD.length > 0);
});

test('Vedic engine binds into the deterministic engine report and prompt', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const report = runDeterministicEngine({ profile, question: '내 베딕 다샤 알려줘' });
  assert(report.vedicAdvancedResult !== null && report.vedicAdvancedResult !== undefined);
  assert.equal(report.vedicAdvancedResult!.status, 'calculated');
  assert.equal(report.vedicAdvancedResult!.nakshatra!.name, '우타라아샤다');
  assert.equal(report.tools.vedic.status, 'calculated');
  const prompt = formatDeterministicEnginePrompt(report);
  assert(prompt.includes('LUCKEY-VD-v1.0.0'));
  const noProfile = runDeterministicEngine({ profile: null });
  assert(noProfile.vedicAdvancedResult?.status === 'skipped');
});


import { calculateThaiHorasat, formatThaiHorasatPrompt, THAI_HORASAT_ENGINE_VERSION, THAI_HORASAT_METHOD, THAI_DAY_PLANETS_8, THAI_THAATS_4, THAI_DASHA_ATTRIBUTES_8, MAHA_THAKSA_ORDER, MAHA_THAKSA_TOTAL_YEARS, buildMahaThaksaTimeline, birthDayPlanetId, thaiDayPlanetById, thaiPlanetRelation, decideThaiDashaAttribute, thaatByMonth, thaatById } from '../src/lib/divination/thaiHorasatEngine';

test('Thai Horasat 8 planetary days: full guardian table and Wednesday day/night (Rahu) branching', () => {
  assert.equal(THAI_DAY_PLANETS_8.length, 8);
  const byId = (id: string) => thaiDayPlanetById(id as any);
  // 정통 8요일 전수: 행성·연수·색상·영수·방위 고정
  assert.equal(byId('sun').thaiName, '프라 아팃');
  assert.equal(byId('sun').planet, '태양');
  assert.deepEqual(byId('sun').colors, ['붉은색']);
  assert.equal(byId('sun').animal, '가루다(Garuda · 황금 날개의 신조)');
  assert.equal(byId('sun').direction, '북동');
  assert.equal(byId('moon').cycleYears, 15);
  assert.equal(byId('mars').planet, '화성');
  assert.equal(byId('mercury').colors.join(','), '녹색');
  assert.equal(byId('rahu').planet, '라후(암흑의 달)');
  assert.deepEqual(byId('rahu').colors, ['검은색', '회색']);
  assert.equal(byId('rahu').animal, '상아 없는 코끼리(Tuskless Elephant)');
  assert.equal(byId('jupiter').cycleYears, 19);
  assert.equal(byId('venus').cycleYears, 21);
  assert.equal(byId('saturn').cycleYears, 10);
  assert.equal(byId('saturn').animal, '나기·뱀(Nagi · 용왕의 여신)');
  // 수요일 분기: 낮 06:00~17:59 수성, 밤 18:00~05:59 라후, 생시 없으면 주간 fallback
  assert.equal(birthDayPlanetId(3, 6).id, 'mercury');
  assert.equal(birthDayPlanetId(3, 17).id, 'mercury');
  assert.equal(birthDayPlanetId(3, 18).id, 'rahu');
  assert.equal(birthDayPlanetId(3, 0).id, 'rahu');
  assert.equal(birthDayPlanetId(3, 5).id, 'rahu');
  assert.equal(birthDayPlanetId(3, null).id, 'mercury');
  assert.equal(birthDayPlanetId(3, null).usedFallback, true);
  assert.equal(birthDayPlanetId(3, 14).usedFallback, false);
  // 수요일 이외 요일은 생시와 무관하게 고정
  for (const [wd, id] of [[0, 'sun'], [1, 'moon'], [2, 'mars'], [4, 'jupiter'], [5, 'venus'], [6, 'saturn']] as const) {
    assert.equal(birthDayPlanetId(wd, null).id, id);
    assert.equal(birthDayPlanetId(wd, 23).id, id);
  }
  assert.throws(() => birthDayPlanetId(7, null), RangeError);
  assert.throws(() => birthDayPlanetId(-1, null), RangeError);
});

test('Maha Thaksa cycle: 8 lords sum to 108 years, birth-lord pivot rotation, current dasha and 8-attribute grading', () => {
  // 6+15+8+17+10+19+12+21 = 108
  assert.equal(MAHA_THAKSA_TOTAL_YEARS, 108);
  assert.equal(MAHA_THAKSA_ORDER.reduce((s, p) => s + p.years, 0), 108);
  assert.deepEqual(MAHA_THAKSA_ORDER.map((p) => p.id), ['sun', 'moon', 'mars', 'mercury', 'saturn', 'jupiter', 'rahu', 'venus']);
  assert.deepEqual(MAHA_THAKSA_ORDER.map((p) => p.years), [6, 15, 8, 17, 10, 19, 12, 21]);

  // 출생 행성 기점 순환: 월요일(달) 출생은 달로 시작해 태양으로 회귀
  const moonTimeline = buildMahaThaksaTimeline('moon');
  assert.deepEqual(moonTimeline.map((s) => s.planetId), ['moon', 'mars', 'mercury', 'saturn', 'jupiter', 'rahu', 'venus', 'sun']);
  assert.deepEqual(moonTimeline.map((s) => [s.startAge, s.endAge]), [[1, 15], [16, 23], [24, 40], [41, 50], [51, 69], [70, 81], [82, 102], [103, 108]]);
  assert.equal(moonTimeline.reduce((s, x) => s + x.years, 0), 108);

  // 현재 다샤: 남희 실측 프로필 (1967-08-25 금요일 출생 → 금성 기점)
  const r = calculateThaiHorasat({ profile: { basic: { birthdate: '1967-08-25' } }, targetYear: 2026, targetDate: new Date('2026-11-02T00:00:00+09:00') });
  assert.equal(r.status, 'calculated');
  assert.equal(r.engineVersion, THAI_HORASAT_ENGINE_VERSION);
  assert.equal(r.birthDayPlanet!.id, 'venus'); // 1967-08-25는 금요일 → 프라 숙(금성)
  assert.equal(r.birthInput!.weekday, '금요일');
  const m = r.mahaThaksa!;
  assert.equal(m.birthPlanetId, 'venus');
  assert.equal(m.totalYears, 108);
  assert.equal(m.ageCounting, 2026 - 1967 + 1); // 세는 나이 60
  // 금성 기점: 금성(21) → 태양(6) → 달(15) → 화성(8) → 수성(17) → 토성(10) → 목성(19) → 라후(12)
  assert.deepEqual(m.sequence.map((s) => s.planetId), ['venus', 'sun', 'moon', 'mars', 'mercury', 'saturn', 'jupiter', 'rahu']);
  assert.deepEqual(m.sequence.map((s) => [s.startAge, s.endAge]), [[1, 21], [22, 27], [28, 42], [43, 50], [51, 67], [68, 77], [78, 96], [97, 108]]);
  // 60세는 수성(51~67세) 구간, 출생 금성 기준 수성은 친화 → 데차(위광)
  assert.equal(m.current.planetId, 'mercury');
  assert.equal(m.current.startAge, 51);
  assert.equal(m.current.endAge, 67);
  assert.equal(m.current.yearsLeft, 7);
  assert.equal(m.current.attribute, THAI_DASHA_ATTRIBUTES_8.decha); // 51 % 3 = 0 → 데차
  assert(m.current.verdict.includes('데차') || m.current.verdict.includes('수성'));
  // 8대 속성 관계 판정 수리
  assert.equal(thaiPlanetRelation('rahu', 'rahu'), 'self');
  assert.equal(thaiPlanetRelation('rahu', 'venus'), 'friend');
  assert.equal(thaiPlanetRelation('rahu', 'sun'), 'enemy');
  assert.equal(thaiPlanetRelation('sun', 'moon'), 'friend');
  assert.equal(thaiPlanetRelation('moon', 'sun'), 'friend');
  assert.equal(thaiPlanetRelation('jupiter', 'mercury'), 'enemy');
  assert.equal(thaiPlanetRelation('venus', 'mars'), 'neutral');
  // 자기 행성 → 라차(왕), 친화 3종 순환, 적대 2종 순환 (결정론 규약)
  assert.equal(decideThaiDashaAttribute('rahu', 'rahu', 1).key, 'racha');
  assert.equal(decideThaiDashaAttribute('sun', 'moon', 1).key, 'si'); // 1 % 3 = 1 → 두 번째
  assert.equal(decideThaiDashaAttribute('sun', 'moon', 2).key, 'montri');
  assert.equal(decideThaiDashaAttribute('sun', 'moon', 3).key, 'decha');
  assert.equal(decideThaiDashaAttribute('rahu', 'sun', 1).key, 'kalakini');
  assert.equal(decideThaiDashaAttribute('rahu', 'sun', 2).key, 'satru');
  assert.equal(decideThaiDashaAttribute('venus', 'mars', 1).key, 'ussaha');
  assert.equal(decideThaiDashaAttribute('venus', 'mars', 2).key, 'mula');
  // 대운 속성 점수 경계
  for (const attr of Object.values(THAI_DASHA_ATTRIBUTES_8)) {
    assert(attr.score >= 0 && attr.score <= 100);
    assert(attr.meaning.length > 5);
  }
  // 108세 초과는 주기 재순환
  const r2 = calculateThaiHorasat({ profile: { basic: { birthdate: '1910-01-01' } }, targetYear: 2026 });
  assert.equal(r2.status, 'calculated');
  assert.equal(r2.mahaThaksa!.ageCounting, 117);
  assert(r2.mahaThaksa!.sequence.some((s) => s.startAge <= 10)); // 두 번째 주기도 같은 시간표
});

test('Thai 4 Thaat elements: month mapping, body systems, balance pairs and vitality index', () => {
  // 월 매핑 전수: 흙 10·11·12, 물 7·8·9, 바람 4·5·6, 불 1·2·3
  assert.deepEqual(THAI_THAATS_4.map((t) => t.id), ['din', 'nam', 'lom', 'fai']);
  assert.deepEqual(THAI_THAATS_4.map((t) => t.months), [[10, 11, 12], [7, 8, 9], [4, 5, 6], [1, 2, 3]]);
  for (let m = 1; m <= 12; m++) assert(thaatByMonth(m).id.length > 0, `month ${m}`);
  assert.equal(thaatByMonth(12).id, 'din');
  assert.equal(thaatByMonth(9).id, 'nam');
  assert.equal(thaatByMonth(6).id, 'lom');
  assert.equal(thaatByMonth(3).id, 'fai');
  assert.throws(() => thaatByMonth(0), RangeError);
  assert.throws(() => thaatByMonth(13), RangeError);
  // 신체 체계·과도 증상·상생 균형쌍 (흙↔물, 불↔바람)
  assert.equal(thaatById('din').bodySystems, '뼈·근육·소화기계');
  assert(thaatById('din').excessSigns.includes('피로'));
  assert.equal(thaatById('nam').bodySystems, '혈액·림프·신장·비뇨기계');
  assert(thaatById('nam').excessSigns.includes('부종'));
  assert.equal(thaatById('lom').bodySystems, '신경계·호흡기·관절');
  assert(thaatById('lom').excessSigns.includes('불안'));
  assert.equal(thaatById('fai').bodySystems, '체온·심장·혈압·염증');
  assert(thaatById('fai').excessSigns.includes('스트레스'));
  assert.equal(thaatById('din').balancedBy, 'nam');
  assert.equal(thaatById('nam').balancedBy, 'din');
  assert.equal(thaatById('lom').balancedBy, 'fai');
  assert.equal(thaatById('fai').balancedBy, 'lom');
  for (const t of THAI_THAATS_4) {
    assert(t.diet.length > 10 && t.herbs.length > 10 && t.rest.length > 10);
  }
  // 활력 지수: 같은 원소 계절은 -6, 상생 계절은 +8, 무관 계절은 보정 없음
  const nov = calculateThaiHorasat({ profile: { basic: { birthdate: '1967-08-25' } }, targetYear: 2026, targetDate: new Date('2026-11-02T00:00:00+09:00') });
  assert.equal(nov.fourElements!.birthThaat.id, 'nam'); // 8월 출생 = 물
  assert.equal(nov.fourElements!.currentThaat.id, 'din'); // 11월 = 흙 (물의 상생쌍)
  assert.equal(nov.fourElements!.vitalityIndex, 86); // 72 + 8 (상생 계절) + 6 (데차 대운 보정)
  assert(nov.fourElements!.balanceNote.includes('상생'));
  const dec = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-25' } }, targetYear: 2026, targetDate: new Date('2026-12-15T00:00:00+09:00') });
  assert.equal(dec.fourElements!.currentThaat.id, 'din'); // 12월 = 흙
  assert(dec.fourElements!.vitalityIndex >= 5 && dec.fourElements!.vitalityIndex <= 100);
  // 상생 계절 + 길한 대운에서 활력 지수 상승 확인
  const friendly = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-25' } }, targetYear: 2026, targetDate: new Date('2026-08-15T00:00:00+09:00') });
  const fe = friendly.fourElements!;
  assert.equal(fe.birthThaat.id, 'fai'); // 3월 = 불
  assert.equal(fe.currentThaat.id, 'nam'); // 8월 = 물 (불과 무관)
  assert(fe.vitalityIndex >= 5 && fe.vitalityIndex <= 100);
});

test('Thai Horasat engine: determinism, safe fallback, Wednesday-night note and prompt formatting', () => {
  const profile = { basic: { birthdate: '1967-08-25', birthtime: '21:40' } };
  const r1 = calculateThaiHorasat({ profile, targetYear: 2026, targetDate: new Date('2026-11-02T00:00:00+09:00') });
  const r2 = calculateThaiHorasat({ profile, targetYear: 2026, targetDate: new Date('2026-11-02T00:00:00+09:00') });
  assert.deepEqual(r1, r2); // 동일 입력 동일 출력

  // 수요일 낮 출생 (10:00) — fallback 없음 (1995-03-22은 수요일)
  const day = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-22', birthtime: '10:00' } }, targetYear: 2026 });
  assert.equal(day.mahaThaksa!.birthPlanetId, 'mercury');
  assert.equal(day.note, undefined);
  // 수요일 밤 출생 (23:00) — 라후
  const night = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-22', birthtime: '23:00' } }, targetYear: 2026 });
  assert.equal(night.mahaThaksa!.birthPlanetId, 'rahu');
  // 수요일 생시 없음 — 주간 수성 fallback + 안내 노트
  const noTime = calculateThaiHorasat({ profile: { basic: { birthdate: '1995-03-22' } }, targetYear: 2026 });
  assert.equal(noTime.mahaThaksa!.birthPlanetId, 'mercury');
  assert(noTime.note!.includes('fallback') || noTime.note!.includes('생시'));
  assert(noTime.note!.includes('프라 라후'));

  // 프로필 누락 시 safe fallback
  const skipped = calculateThaiHorasat({ profile: null });
  assert.equal(skipped.status, 'skipped');
  assert.match(skipped.note || '', /생년월일/);
  const empty = calculateThaiHorasat({ profile: { basic: { birthdate: '' } } });
  assert.equal(empty.status, 'skipped');
  const malformed = calculateThaiHorasat({ profile: { basic: { birthdate: 'not-a-date' } } });
  assert(malformed.status === 'error' || malformed.status === 'skipped');

  // 프롬프트 포맷터: 버전·수호신·대운·원소 포함
  const prompt = formatThaiHorasatPrompt(r1);
  assert(prompt.includes(THAI_HORASAT_ENGINE_VERSION));
  assert(prompt.includes('KST'));
  assert(prompt.includes('호라삿 교차 매트릭스'));
  assert(prompt.includes('호라삿') && prompt.includes('마하탁사') && prompt.includes('4대 원소'));
  assert(prompt.includes('프라 숙'));
  assert(prompt.includes('108년'));
  assert(prompt.includes('데차'));
  assert(prompt.includes('물(Nam)'));
  assert(prompt.includes('AI 해석 절대 지침'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
  assert(THAI_HORASAT_METHOD.length > 0);
  assert.equal(formatThaiHorasatPrompt(skipped), '');
});

test('Thai Horasat engine binds into the deterministic engine report and prompt', () => {
  const profile = { basic: { birthdate: '1967-08-25', birthtime: '21:40', gender: 'male' as const, birthCity: '서울' } };
  const report = runDeterministicEngine({ profile, question: '내 태국 호라삿 대운 알려줘' });
  assert(report.thaiHorasatResult !== null && report.thaiHorasatResult !== undefined);
  assert.equal(report.thaiHorasatResult!.status, 'calculated');
  assert.equal(report.thaiHorasatResult!.mahaThaksa!.totalYears, 108);
  assert.equal(report.thaiHorasatResult!.mahaThaksa!.birthPlanetId, 'venus');
  assert(report.thaiHorasatResult!.calculatedAtKst?.endsWith('KST'));
  assert(Boolean(report.thaiHorasatResult!.horasatSynthesisMatrix?.integratedAction));
  assert.equal(report.tools.thai_astrology.status, 'calculated'); // partial → calculated 승격
  const prompt = formatDeterministicEnginePrompt(report);
  assert(prompt.includes(THAI_HORASAT_ENGINE_VERSION));
  // 태국 호라삿 친우·원수 역학, 마하탁사 소운, 4원소 계절 결단 윈도우 검증
  assert(report.thaiHorasatResult!.planetaryFriendEnemyDynamic !== null && report.thaiHorasatResult!.planetaryFriendEnemyDynamic !== undefined);
  assert(report.thaiHorasatResult!.planetaryFriendEnemyDynamic!.affinityScore >= 40 && report.thaiHorasatResult!.planetaryFriendEnemyDynamic!.affinityScore <= 98);
  assert(report.thaiHorasatResult!.mahaThaksaAntardasha !== null && report.thaiHorasatResult!.mahaThaksaAntardasha !== undefined);
  assert.ok(report.thaiHorasatResult!.mahaThaksaAntardasha!.antardashaPlanetName.length > 0);
  assert(report.thaiHorasatResult!.seasonalThaatTactics !== null && report.thaiHorasatResult!.seasonalThaatTactics !== undefined);
  assert.ok(report.thaiHorasatResult!.seasonalThaatTactics!.peakActionSeason.length > 0);
  assert(prompt.includes('호라삿 행성 친우·원수 역학'));
  assert(prompt.includes('마하탁사 소운(Antardasha)'));
  assert(prompt.includes('4대 원소(Thaat) 계절 결단 윈도우'));
  const noProfile = runDeterministicEngine({ profile: null });
  assert(noProfile.thaiHorasatResult?.status === 'skipped');
  assert.equal(noProfile.tools.thai_astrology.status, 'skipped');
  // 프로필이 있으면 15개 도구 전부 calculated 이상 (not_implemented 0 유지)
  assert.equal(Object.values(report.tools).filter((t) => t.status === 'not_implemented').length, 0);
});

test('buildUserFifteenToolsDigest integrates Hongguk Qimen and Ziwei Flying Stars into synapse perception digest', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const digest = buildUserFifteenToolsDigest(profile);
  assert.match(digest, /홍국기문\(4주 9궁\): 세효/);
  assert.match(digest, /자미두수 유년 사화: 명궁/);
  assert.match(digest, /태국점성술 요일 상징/);
});

import { calculateKabbalah, formatKabbalahPrompt, KABBALAH_ENGINE_VERSION, KABBALAH_METHOD, SEPHIROTH_10, PATHS_22, FOUR_WORLDS, THREE_PILLARS, DAATH, kabbalahSephirahByNumber, kabbalahPathByNumber, reduceGematria, digitSum, soulPathNumberToPath } from '../src/lib/divination/kabbalahEngine';

test('Kabbalah 10 sephiroth: full table, 3-pillar classification and hidden Daath', () => {
  assert.equal(SEPHIROTH_10.length, 10);
  const expectedPillars = [
    '균형의 기둥', '자비의 기둥', '엄격의 기둥', // 1~3
    '자비의 기둥', '엄격의 기둥', '균형의 기둥', // 4~6
    '자비의 기둥', '엄격의 기둥', '균형의 기둥', // 7~9
    '균형의 기둥', // 10
  ];
  SEPHIROTH_10.forEach((s, i) => {
    assert.equal(s.number, i + 1);
    assert.equal(s.pillar, expectedPillars[i]);
    assert(s.name.length > 0 && s.hebrew.length > 0 && s.translit.length > 0 && s.title.length > 0 && s.planet.length > 0);
  });
  // 3대 기둥 전수 분류: 10 세피로트가 각각 정확히 하나의 기둥에 속한다
  const assignments = THREE_PILLARS.flatMap((p) => p.sephiroth).sort((a, b) => a - b);
  assert.deepEqual(assignments, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(THREE_PILLARS.find((p) => p.id === 'mercy')!.sephiroth.join(','), '2,4,7'); // 호크마·헤세드·네차크
  assert.equal(THREE_PILLARS.find((p) => p.id === 'severity')!.sephiroth.join(','), '3,5,8'); // 비나·게부라·호드
  assert.equal(THREE_PILLARS.find((p) => p.id === 'mildness')!.sephiroth.join(','), '1,6,9,10'); // 케테르·티페레트·예소드·말쿠트
  // 숨겨진 세피라 다트는 어느 기둥에도 속하지 않는다
  assert.equal(DAATH.number, 0);
  assert.equal(DAATH.name, '다트');
  // 4개 세계 전수
  assert.equal(FOUR_WORLDS.length, 4);
  assert.deepEqual(FOUR_WORLDS.map((w) => w.name), ['아칠루트', '베리아', '예치라', '아시야']);
  assert.deepEqual(FOUR_WORLDS.map((w) => w.element), ['불', '물', '바람', '흙']);
  assert.throws(() => kabbalahSephirahByNumber(0), RangeError);
  assert.throws(() => kabbalahSephirahByNumber(11), RangeError);
  assert.throws(() => kabbalahPathByNumber(10), RangeError);
  assert.throws(() => kabbalahPathByNumber(33), RangeError);
});

test('Kabbalah 22 paths: connectivity, hebrew letters, Golden Dawn attributions and tarot majors', () => {
  assert.equal(PATHS_22.length, 22);
  // 11번 알레프(케테르↔호크마, 바보) ~ 32번 타브(예소드↔말쿠트, 세계)
  const first = PATHS_22[0];
  const last = PATHS_22[21];
  assert.equal(first.number, 11);
  assert.equal(first.letterName, '알레프');
  assert.equal(first.hebrewLetter, 'א');
  assert.deepEqual([first.from, first.to].sort((a, b) => a - b), [1, 2]);
  assert.equal(first.tarotNumber, 0);
  assert.equal(first.tarotName, '바보');
  assert.equal(last.number, 32);
  assert.equal(last.letterName, '타브');
  assert.equal(last.hebrewLetter, 'ת');
  assert.deepEqual([last.from, last.to].sort((a, b) => a - b), [9, 10]);
  assert.equal(last.tarotNumber, 21);
  assert.equal(last.tarotName, '세계');
  // 히브리 22문자 순서(알레프→타브)와 타로 메이저 0~21 일대일 배속
  PATHS_22.forEach((p, i) => {
    assert.equal(p.number, i + 11);
    assert.equal(p.tarotNumber, i);
    [p.from, p.to].forEach((n) => {
      assert(n >= 1 && n <= 10, '경로는 1~10 세피로트만 연결해야 한다');
      assert.notEqual(p.from, p.to);
    });
    assert(p.hebrewLetter.length > 0 && p.letterName.length > 0 && p.spiritualTheme.length > 0);
    assert(['원소', '행성', '별자리'].includes(p.attribution.kind));
  });
  assert.equal(new Set(PATHS_22.map((p) => p.hebrewLetter)).size, 22); // 22문자 전부 상이
  assert.equal(new Set(PATHS_22.map((p) => `${p.from}-${p.to}`)).size, 22); // 연결 중복 없음
  assert.equal(new Set(PATHS_22.map((p) => p.tarotNumber)).size, 22); // 메이저 22장 일대일
  // 원소 3개(알레프=바람, 멤=물, 신=불), 행성 7개, 별자리 12개 = 22
  const byKind = { 원소: 0, 행성: 0, 별자리: 0 } as Record<string, number>;
  PATHS_22.forEach((p) => { byKind[p.attribution.kind] += 1; });
  assert.deepEqual(byKind, { 원소: 3, 행성: 7, 별자리: 12 });
  assert.equal(PATHS_22.find((p) => p.letterName === '멤')!.attribution.value, '물(Water)');
  assert.equal(PATHS_22.find((p) => p.letterName === '신')!.attribution.value, '불(Fire)');
  assert.equal(PATHS_22.find((p) => p.letterName === '알레프')!.attribution.value, '바람(Air)');
  assert.equal(PATHS_22.find((p) => p.letterName === '라메드')!.tarotName, '정의'); // 11 정의
});

test('Kabbalah gematria: digit sums, reduction to 1-10, master numbers 11/22/33 and boundaries', () => {
  assert.equal(digitSum(19950325), 34);
  assert.equal(digitSum(20220808), 22);
  // 1~10 축약 경계값
  assert.equal(reduceGematria(9, { keepMasters: true }), 9);
  assert.equal(reduceGematria(10, { keepMasters: true }), 10);
  assert.equal(reduceGematria(11, { keepMasters: true }), 11); // 마스터 보존
  assert.equal(reduceGematria(22, { keepMasters: true }), 22);
  assert.equal(reduceGematria(33, { keepMasters: true }), 33);
  assert.equal(reduceGematria(38, { keepMasters: true }), 11); // 38 → 11 (마스터 멈춤)
  assert.equal(reduceGematria(34, { keepMasters: true }), 7);
  // 마스터 미보존(퍼스널리티용): 10 이하로 계속 축약
  assert.equal(reduceGematria(11, { keepMasters: false, floor: 10 }), 2);
  assert.equal(reduceGematria(22, { keepMasters: false, floor: 10 }), 4);
  assert.equal(reduceGematria(33, { keepMasters: false, floor: 10 }), 6);
  assert.equal(reduceGematria(25, { keepMasters: false, floor: 10 }), 7);
  // 소울 패스 1~22 축약 및 경로 대응
  assert.equal(reduceGematria(34, { keepMasters: false, floor: 22 }), 7);
  assert.equal(reduceGematria(22, { keepMasters: false, floor: 22 }), 22);
  assert.equal(soulPathNumberToPath(1), 11);
  assert.equal(soulPathNumberToPath(22), 32);
  assert.throws(() => soulPathNumberToPath(0), RangeError);
  assert.throws(() => soulPathNumberToPath(23), RangeError);
});

test('Kabbalah engine fixtures: life path / personality / soul path and pillar balance', () => {
  const profile = { basic: { birthdate: '1995-03-25', gender: 'male' as const } };
  const r = calculateKabbalah({ profile });
  assert.equal(r.status, 'calculated');
  assert.equal(r.engineVersion, KABBALAH_ENGINE_VERSION);
  const n = r.numerology!;
  assert.equal(n.rawDigitSum, 34);
  assert.equal(n.lifePathNumber, 7);
  assert.equal(n.lifePathIsMaster, false);
  assert.equal(n.lifePathSephirah.name, '네차크'); // 7 = 네차크, 5 = 게부라
  assert.equal(n.personalityNumber, 7); // 25 → 7
  assert.equal(n.personalitySephirah.name, '네차크');
  assert.equal(n.soulPathNumber, 7);
  assert.equal(n.soulPath.number, 17); // 7번째 경로 = 17번 (자인)
  assert.equal(n.soulPath.tarotName, '연인');
  // 활성 세피로트 4개(7·7·3·6): 자비 2, 엄격 1, 균형 1 → 50/25/25
  assert.deepEqual(n.pillarBalance, { mercy: 50, severity: 25, mildness: 25 });
  assert.equal(n.dominantWorld.name, '예치라'); // 네차크(7)는 형성계
  // 마스터 넘버 11 → 케테르 특별 해석 (1987-11-29 = 38 → 11)
  const r11 = calculateKabbalah({ profile: { basic: { birthdate: '1987-11-29', gender: 'female' as const } } });
  assert.equal(r11.numerology!.lifePathNumber, 11);
  assert.equal(r11.numerology!.lifePathIsMaster, true);
  assert.equal(r11.numerology!.lifePathSephirah.name, '케테르');
  assert(r11.numerology!.lifePathInterpretation.includes('케테르'));
  // 마스터 넘버 22 → 다트 특별 해석 (2022-08-08 = 22)
  const r22 = calculateKabbalah({ profile: { basic: { birthdate: '2022-08-08' } } });
  assert.equal(r22.numerology!.lifePathNumber, 22);
  assert.equal(r22.numerology!.lifePathIsMaster, true);
  assert.equal(r22.numerology!.lifePathSephirah.number, 0);
  assert.equal(r22.numerology!.lifePathSephirah.name, '다트');
  assert(r22.numerology!.lifePathInterpretation.includes('다트'));
  assert.equal(r22.numerology!.soulPathNumber, 22);
  assert.equal(r22.numerology!.soulPath.number, 32); // 타브 예소드↔말쿠트
  // 다트는 기둥 없음 → 퍼스널리티(호드) + 경로 양끝(예소드·말쿠트)만 집계: 엄격 1, 균형 2
  assert.deepEqual(r22.numerology!.pillarBalance, { mercy: 0, severity: 33, mildness: 67 });
  // 마스터 넘버 33 → 케테르 전 나무 통합 해석 (1999-12-20 = 33)
  const r33 = calculateKabbalah({ profile: { basic: { birthdate: '1999-12-20' } } });
  assert.equal(r33.numerology!.rawDigitSum, 33);
  assert.equal(r33.numerology!.lifePathNumber, 33);
  assert.equal(r33.numerology!.lifePathSephirah.name, '케테르');
  assert(r33.numerology!.lifePathInterpretation.includes('전 나무'));
  // 음력 생일도 양력 환산 날짜로 결정론 계산
  const lunar = calculateKabbalah({ profile: { basic: { birthdate: '1995-03-25', lunarSolar: 'lunar' } } });
  assert.equal(lunar.status, 'calculated');
  assert.equal(lunar.birthInput!.isLunar, true);
  assert.equal(lunar.birthInput!.solarDateString, '1995-04-24');
  assert.equal(lunar.numerology!.rawDigitSum, 34); // 날짜가 달라도 각 자리 합은 우연히 같을 수 있다.
});

test('Kabbalah engine: determinism, null-safe fallback and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', gender: 'male' as const } };
  const fixedNow = new Date('2026-11-15T07:55:00+09:00');
  const r1 = calculateKabbalah({ profile, now: fixedNow, question: '내 카발라 생명나무 알려줘' });
  const r2 = calculateKabbalah({ profile, now: fixedNow, question: '내 카발라 생명나무 알려줘' });
  assert.deepEqual(r1, r2); // 동일 입력 동일 출력
  assert(r1.calculatedAtKst?.includes('KST'));
  // 프로필 누락 시 safe fallback
  const skipped = calculateKabbalah({ profile: null });
  assert.equal(skipped.status, 'skipped');
  const bad = calculateKabbalah({ profile: { basic: { birthdate: '' } } });
  assert.equal(bad.status, 'skipped');
  const malformed = calculateKabbalah({ profile: { basic: { birthdate: 'not-a-date' } } });
  assert(malformed.status === 'error' || malformed.status === 'skipped');
  // 프롬프트 포맷터
  const prompt = formatKabbalahPrompt(r1);
  assert(prompt.includes(KABBALAH_ENGINE_VERSION));
  assert(prompt.includes('네차크'));
  assert(!prompt.includes('라이프 패스 세피라: 7 → 게부라'));
  assert(prompt.includes('제17경로'));
  assert(prompt.includes('연인'));
  assert(prompt.includes('자비(확장) 균형'));
  assert(prompt.includes('예치라'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
  assert(prompt.includes('생년월일 게마트리아 수리로 산출된 확정 배속'));
  assert.equal(formatKabbalahPrompt(skipped), '');
  assert(KABBALAH_METHOD.length > 0);
});

test('Kabbalah engine binds into the deterministic engine report and prompt', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const report = runDeterministicEngine({ profile, question: '내 카발라 생명나무 알려줘' });
  assert(report.kabbalahResult !== null && report.kabbalahResult !== undefined);
  assert.equal(report.kabbalahResult!.status, 'calculated');
  assert.equal(report.kabbalahResult!.numerology!.lifePathSephirah.name, '네차크');
  assert.equal(report.tools.kabbalah.status, 'calculated'); // symbolic → calculated 승격
  const prompt = formatDeterministicEnginePrompt(report);
  assert(prompt.includes(KABBALAH_ENGINE_VERSION));
  const noProfile = runDeterministicEngine({ profile: null });
  assert(noProfile.kabbalahResult?.status === 'skipped');
  assert.equal(noProfile.tools.kabbalah.status, 'skipped');
});

import { calculateHonggukQimen, formatHonggukQimenPrompt, HONGGUK_QIMEN_ENGINE_VERSION, HONGGUK_QIMEN_METHOD, HONGGUK_NINE_PALACES, HONGGUK_EIGHT_GATES, HONGGUK_TONGGI_CYCLES, STEM_NUMBERS, BRANCH_NUMBERS } from '../src/lib/divination/honggukQimenEngine';

test('Hongguk Qimen: 4-pillar numeral casting, 9-palace flight, key points, determinism and prompt formatting', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const fixedNow = new Date('2026-11-15T08:05:00+09:00');
  const r1 = calculateHonggukQimen({ profile, targetYear: 2026, now: fixedNow, question: '이 계약 진행해도 될까' });
  assert.equal(r1.status, 'calculated');
  assert.equal(r1.engineVersion, HONGGUK_QIMEN_ENGINE_VERSION);
  assert.equal(r1.method, HONGGUK_QIMEN_METHOD);
  // 4주 수리: 하도 생성수(甲1~癸10)·후천 12진수(子1~亥12) 및 1~9 구성환원 궁수
  assert.equal(r1.numerals!.length, 4); // 생시 있음 → 4주
  assert(r1.fourPillars!.timeKnown);
  for (const n of r1.numerals!) {
    assert.equal(n.ganNumber, STEM_NUMBERS[n.gan]);
    assert.equal(n.zhiNumber, BRANCH_NUMBERS[n.zhi]);
    assert(n.ganPalace >= 1 && n.ganPalace <= 9);
    assert(n.zhiPalace >= 1 && n.zhiPalace <= 9);
  }
  // 지반수·천반수 중궁은 4주 궁수 합의 구성환원 (결정론 재계산 대조)
  const earthSum = r1.numerals!.reduce((s, n) => s + n.zhiPalace, 0);
  const heavenSum = r1.numerals!.reduce((s, n) => s + n.ganPalace, 0);
  assert.equal(r1.earthCenterNumber, ((earthSum - 1) % 9) + 1);
  assert.equal(r1.heavenCenterNumber, ((heavenSum - 1) % 9) + 1);
  // 9궁 포국: 9궁 전수, 비행 경로 상 인접 궁의 천반수는 정확히 1씩 역행
  assert.equal(r1.palaces!.length, 9);
  const byPalace = new Map(r1.palaces!.map((p) => [p.palace, p]));
  const path = [5, 6, 7, 8, 9, 1, 2, 3, 4];
  for (let i = 0; i < 8; i++) {
    const diff = (byPalace.get(path[i + 1])!.heavenStarNumber - byPalace.get(path[i])!.heavenStarNumber + 9) % 9;
    assert.equal(diff, 8, `비행 경로 ${path[i]}→${path[i+1]} 역행 1칸`);
  }
  // 중궁(5궁)에는 천반수 중궁이 그대로 입하고, 기궁 사문 표기 유지
  assert.equal(byPalace.get(5)!.heavenStarNumber, r1.heavenCenterNumber);
  assert.match(byPalace.get(5)!.gate || '', /기궁/);
  for (const p of r1.palaces!) {
    assert(p.heavenStarNumber >= 1 && p.heavenStarNumber <= 9);
    assert(p.earthStarNumber >= 1 && p.earthStarNumber <= 9);
    assert(HONGGUK_NINE_PALACES.some((b) => b.palace === p.palace && b.name === p.name));
  }
  // 3대 거점: 세효·응효·중궁 위치와 상생상극 3조 대조
  assert(r1.keyPoints!.seYao.palace >= 1 && r1.keyPoints!.seYao.palace <= 9);
  assert(r1.keyPoints!.eungYao.palace >= 1 && r1.keyPoints!.eungYao.palace <= 9);
  assert.equal(r1.keyPoints!.jungGung.palace, 5);
  assert.equal(r1.keyPointRelations!.length, 3);
  for (const rel of r1.keyPointRelations!) {
    assert(['상생', '상극', '비화'].includes(rel.relation));
    assert(rel.note.length > 0);
  }
  // 삼형·통기: 지수 범위와 간선 완전성
  assert(r1.samhyeong!.riskIndex >= 0 && r1.samhyeong!.riskIndex <= 100);
  assert(r1.tonggi!.score >= 0 && r1.tonggi!.score <= 100);
  assert.equal(r1.tonggi!.score, r1.tonggi!.activeCycles.length * 20);
  assert.equal(r1.tonggi!.activeCycles.length + r1.tonggi!.missingCycles.length, HONGGUK_TONGGI_CYCLES.length);
  assert.equal(Object.values(r1.tonggi!.elementCounts).reduce((s, c) => s + c, 0), 8); // 4주 8자 오행 분포
  // 8문 판정과 득문 일관성
  assert(r1.eightGatesVerdict!.pattern.length > 0);
  assert.equal(r1.eightGatesVerdict!.deukMun, r1.keyPoints!.seYao.deukMun);

  // 결정론성: 동일 입력 동일 출력
  const r2 = calculateHonggukQimen({ profile, targetYear: 2026, now: fixedNow, question: '이 계약 진행해도 될까' });
  assert.deepEqual(r1, r2);
  assert(r1.calculatedAtKst?.includes('KST'));

  // 프롬프트 포맷터
  const prompt = formatHonggukQimenPrompt(r1);
  assert(prompt.includes(HONGGUK_QIMEN_ENGINE_VERSION));
  assert(prompt.includes('세효(世爻'));
  assert(prompt.includes('응효(應爻'));
  assert(prompt.includes('중궁(中宮'));
  assert(prompt.includes('파극 위험도'));
  assert(prompt.includes('통기(通氣'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
  assert(prompt.includes(r1.eightGatesVerdict!.pattern));

  // 생시 없이도 산출 (3주 수리 safe fallback)
  const noTime = calculateHonggukQimen({ profile: { basic: { birthdate: '1995-03-25', gender: 'male' as const } } });
  assert.equal(noTime.status, 'calculated');
  assert.equal(noTime.fourPillars!.hour, null);
  assert(!noTime.fourPillars!.timeKnown);
  assert.equal(noTime.numerals!.length, 3);
  assert.equal(Object.values(noTime.tonggi!.elementCounts).reduce((s, c) => s + c, 0), 6);
  assert.match(formatHonggukQimenPrompt(noTime), /생시/);

  // 프로필 누락 시 safe fallback
  const skipped = calculateHonggukQimen({ profile: null });
  assert.equal(skipped.status, 'skipped');
  const empty = calculateHonggukQimen({ profile: { basic: { birthdate: '' } } });
  assert.equal(empty.status, 'skipped');
});

test('Hongguk Qimen: 삼형 살표와 통기 지수가 실제 지지 구성을 정확히 반영한다', () => {
  // 1995-03-25 14:30 원국의 지지로 삼형 성립 여부 재검증 (결정론 대조)
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r = calculateHonggukQimen({ profile });
  const zhis = r.numerals!.map((n) => n.zhi);
  const insasin = ['寅', '巳', '申'].filter((b) => zhis.includes(b)).length;
  const chukSulMi = ['丑', '戌', '未'].filter((b) => zhis.includes(b)).length;
  if (insasin === 3 || chukSulMi === 3) {
    assert(r.samhyeong!.formed);
    assert(r.samhyeong!.type !== null);
    assert(r.samhyeong!.riskIndex >= 70);
  } else {
    assert(!r.samhyeong!.formed);
    assert.equal(r.samhyeong!.riskIndex >= 70, false);
  }
  assert.equal(r.samhyeong!.partial, insasin === 2 || chukSulMi === 2);
});

test('Hongguk Qimen engine binds into the deterministic engine report and prompt (qimen calculated 승격)', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const report = runDeterministicEngine({ profile, question: '홍국기문으로 내 판세를 봐줘' });
  assert(report.honggukQimenResult !== null && report.honggukQimenResult !== undefined);
  assert.equal(report.honggukQimenResult!.status, 'calculated');
  assert.equal(report.honggukQimenResult!.engineVersion, HONGGUK_QIMEN_ENGINE_VERSION);
  assert.equal(report.tools.qimen.status, 'calculated'); // partial → calculated 승격
  const prompt = formatDeterministicEnginePrompt(report);
  assert(prompt.includes('LUCKEY-HQ-v1.0.0'));
  assert(prompt.includes('세효(世爻'));
  // 프로필 없이도 4주 수리는 skipped, 도구 상태는 점시 포국으로 calculated 유지
  const noProfile = runDeterministicEngine({ profile: null, question: '홍국기문으로 내 판세를 봐줘' });
  assert(noProfile.honggukQimenResult?.status === 'skipped');
});

// ─── 5대 운명학 융합 궁합 마스터 엔진 (LUCKEY-CS-v1.0.0) ───
import { calculateDeterministicCompatibility, formatCompatibilityPrompt, COMPATIBILITY_ENGINE_VERSION } from '../src/lib/divination/deterministicCompatibility';
import { CHEON_EUL_MAP } from '../src/lib/divination/auspiciousStarsEngine';
import { calculateDetailedSaju } from '../src/lib/sajuAnalysis';
import { buildChatDivinationContext } from '../src/lib/divination/chatContext';

const csA = { basic: { birthdate: '1990-05-15', birthtime: '10:30', gender: 'male' as const, birthCity: '서울', name: '민준' } };
const csB = { basic: { birthdate: '1992-11-03', birthtime: '14:00', gender: 'female' as const, birthCity: '서울', name: '서연' } };
const GRADES = ['천생연분', '상생길연', '화합동반', '보완노력', '자극성장'] as const;
const SUKUYO_TYPES = ['영친', '안괴', '우쇠', '성위', '업태', '명'] as const;

test('Unified Synastry: 5대 융합 궁합(천간합·천을귀인·숙요·점성술·3대 영역)이 전 차원 정상 산출된다', () => {
  const r = calculateDeterministicCompatibility(csA, csB);
  assert.equal(r.engineVersion, 'LUCKEY-CS-v1.0.0');
  assert.equal(r.engineVersion, COMPATIBILITY_ENGINE_VERSION);
  assert(Number.isInteger(r.score) && r.score >= 0 && r.score <= 100);
  assert(GRADES.includes(r.grade));
  // 1) 사주 원국 결합
  assert(r.saju.personA.dayMaster.length > 0 && r.saju.personA.dayBranch.length > 0);
  assert(r.saju.personB.dayMaster.length > 0 && r.saju.personB.dayBranch.length > 0);
  assert(r.saju.stemRelation.name.length > 0 && r.saju.branchRelation.name.length > 0);
  assert(r.saju.elementComplement.score >= 0 && r.saju.elementComplement.score <= 100);
  assert(r.saju.combinedScore >= 0 && r.saju.combinedScore <= 100);
  // 2) 천을귀인 매칭
  assert(r.mutualNobleman.aNobleBranches.length > 0 && r.mutualNobleman.bNobleBranches.length > 0);
  assert(r.mutualNobleman.score >= 0 && r.mutualNobleman.score <= 100);
  // 3) 숙요 27숙
  assert(SUKUYO_TYPES.includes(r.sukuyo.relationType));
  if (r.sukuyo.compatibilityScore !== null) assert(r.sukuyo.compatibilityScore >= 0 && r.sukuyo.compatibilityScore <= 100);
  assert(['근거리', '중거리', '원거리'].includes(r.sukuyo.distanceText));
  // 4) 점성술 시나스트리
  assert(['동원소', '상생', '갈등', '중립'].includes(r.astrology.elementRelation));
  assert(r.astrology.sunAspect.name.length > 0 && r.astrology.moonAspect.name.length > 0);
  assert(r.astrology.combinedScore >= 0 && r.astrology.combinedScore <= 100);
  // 5) 3대 영역 처방
  for (const d of [r.dimensions.romantic, r.dimensions.business, r.dimensions.friendship]) {
    assert(d.score >= 0 && d.score <= 100);
    assert(d.headline.length > 0 && d.detail.length > 0);
  }
  // 가중 브레이크다운
  for (const v of Object.values(r.breakdown)) assert(v >= 0 && v <= 100);
});

test('Unified Synastry: 천을귀인 상호 인연 성립 케이스 (庚辰×癸未) 원국 대조 픽스처', () => {
  const r = calculateDeterministicCompatibility(csA, csB);
  // 고전 천을귀인 규칙 대조: 庚→丑未, 癸→巳卯
  assert(CHEON_EUL_MAP['庚']!.includes('未'));
  assert(CHEON_EUL_MAP['癸']!.includes('巳'));
  const sajuA = calculateDetailedSaju(csA);
  const sajuB = calculateDetailedSaju(csB);
  const zhiOf = (s: ReturnType<typeof calculateDetailedSaju>) =>
    ['year', 'month', 'day', 'hour'].map((k) => (s!.pillars as any)[k]?.zhi).filter(Boolean);
  // A의 귀인 글자(未)가 B의 4주에, B의 귀인 글자(巳)가 A의 4주에 존재
  assert(zhiOf(sajuB).includes('未'));
  assert(zhiOf(sajuA).includes('巳'));
  assert(r.mutualNobleman.mutual === true);
  assert(r.mutualNobleman.aIsBNoble === true && r.mutualNobleman.bIsANoble === true);
  assert(r.mutualNobleman.score === 100);
  assert(r.mutualNobleman.aNobleInB.some((s) => s.startsWith('未')));
  assert(r.mutualNobleman.bNobleInA.some((s) => s.startsWith('巳')));
  // 대칭성: 인자 순서를 바꾸면 상호 귀인 판정은 동일해야 한다
  const rev = calculateDeterministicCompatibility(csB, csA);
  assert.equal(rev.mutualNobleman.mutual, true);
});

test('Unified Synastry: 태양 트라인 판정과 27숙 호환 지수·종합 점수 0~100 범위', () => {
  // 게자리×전갈자리(물 원소 동일 원소군) 120° 트라인 픽스처
  const tri = calculateDeterministicCompatibility(
    { basic: { birthdate: '1996-07-08', birthtime: '06:00', gender: 'male' as const, birthCity: '서울', name: '지훈' } },
    { basic: { birthdate: '1991-11-11', birthtime: '03:00', gender: 'female' as const, birthCity: '서울', name: '하은' } }
  );
  assert(tri.astrology.sunAspect.name.includes('트라인'));
  assert(tri.astrology.sunAspect.angle === 120);
  assert(tri.astrology.sunA === '게자리' && tri.astrology.sunB === '전갈자리');
  assert(tri.score >= 0 && tri.score <= 100);
  if (tri.sukuyo.compatibilityScore !== null) assert(tri.sukuyo.compatibilityScore >= 0 && tri.sukuyo.compatibilityScore <= 100);
  // 스퀘어(긴장) 픽스처: 양자리×게자리 90° 근방
  const sq = calculateDeterministicCompatibility(
    { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'female' as const, birthCity: '서울', name: '수아' } },
    { basic: { birthdate: '1996-07-08', birthtime: '06:00', gender: 'male' as const, birthCity: '서울', name: '지훈' } }
  );
  assert(sq.astrology.moonAspect.name.includes('스퀘어') || sq.astrology.sunAspect.name.includes('스퀘어'));
});

test('chatContext: 미구현 안내 문구가 프롬프트에서 완전히 제거되고 15대 운명학 정합 문구로 교정됐다', () => {
  const now = new Date('2026-11-02T08:00:00Z');
  const r = buildChatDivinationContext({ text: '주역으로 이직운 봐줘', selected: ['iching', 'liuren', 'qimen'], now });
  assert(r.prompt.length > 0);
  assert(!r.prompt.includes('미구현'));
  assert(r.prompt.includes('15대 운명학 도구의 계산된 결과'));
  assert(r.prompt.includes('추정 금지'));
  assert(r.prompt.includes('난수 동전법 작괘 존중'));
});

test('Unified Synastry: 결정론성(동일 입력 동일 출력)과 프롬프트 포맷터·결정론 엔진 바인딩', () => {
  const r1 = calculateDeterministicCompatibility(csA, csB);
  const r2 = calculateDeterministicCompatibility(csA, csB);
  assert.equal(JSON.stringify(r1), JSON.stringify(r2));
  const prompt = formatCompatibilityPrompt(r1);
  assert(prompt.includes('LUCKEY-CS-v1.0.0'));
  assert(prompt.includes('천을귀인'));
  assert(prompt.includes(`${r1.score}점`));
  assert(prompt.includes('연인·결혼') && prompt.includes('비즈니스·파트너십') && prompt.includes('소울메이트·우정'));
  // 결정론 엔진 바인딩: partnerProfile이 있을 때 compatibilityResult 바인딩 + 포맷터 연결
  const report = runDeterministicEngine({ profile: csA, partnerProfile: csB, question: '우리 궁합 봐줘' });
  assert(report.compatibilityResult !== null && report.compatibilityResult !== undefined);
  assert.equal(report.compatibilityResult!.engineVersion, 'LUCKEY-CS-v1.0.0');
  const enginePrompt = formatDeterministicEnginePrompt(report);
  assert(!enginePrompt.includes('5대 운명학 융합 궁합 리포트'));
  assert(enginePrompt.includes('이번 질문의 계산 근거 및 한계'));
  // partnerProfile이 없으면 미바인딩
  const solo = runDeterministicEngine({ profile: csA, question: '내 운세 봐줘' });
  assert(!solo.compatibilityResult);
});

test('Liuren Master Engine: 사과·삼전·12천장 정통 결단 산출 및 프롬프트 포맷터 검증', () => {
  const instant = new Date('2026-11-15T08:05:00+09:00');
  const res = calculateLiurenMaster(instant, '이 협업 진행해도 될까');
  assert.equal(res.status, 'calculated');
  assert.equal(res.engineVersion, LIUREN_MASTER_ENGINE_VERSION);
  assert(res.calculatedAtKst.includes('KST'));
  assert.equal(res.fourLessons.length, 4);
  assert(res.fourLessons[0].upper.length > 0 && res.fourLessons[0].lower.length > 0);
  assert.equal(res.threeTransmissions.length, 3);
  assert(res.threeTransmissions[0].stage.includes('초전'));
  assert(res.decisionScore >= 0 && res.decisionScore <= 100);
  assert(res.primaryGeneral.name.length > 0);
  assert(res.interpersonalDynamic !== undefined);
  assert(res.interpersonalDynamic.fourLessonsHarmonyScore >= 40 && res.interpersonalDynamic.fourLessonsHarmonyScore <= 98);
  assert(res.transmissionDynamics !== undefined);
  assert(res.transmissionDynamics.actionMomentumIndex >= 0 && res.transmissionDynamics.actionMomentumIndex <= 100);
  assert(res.transmissionDynamics.breakthroughStrategy.length > 0);
  assert(res.temporalLiurenRhythm.hourWatchWindow.length > 0);
  assert(res.liurenSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatLiurenMasterPrompt(res);
  assert(prompt.includes(LIUREN_MASTER_ENGINE_VERSION));
  assert(prompt.includes('KST'));
  assert(prompt.includes('사과(四課) 포국'));
  assert(prompt.includes('삼전(三傳) 타임라인'));
  assert(prompt.includes('결단 기조'));
  assert(prompt.includes('사과 생극 역학'));
  assert(prompt.includes('삼전 추진 역학'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Iching Master Engine: 64괘 4대 대칭 괘상(본·지·호·착·종) 및 체용 생극제화 검증', () => {
  const fixedNow = new Date('2026-11-15T07:55:00+09:00');
  const res = calculateIchingMaster([7, 8, 9, 8, 7, 8], '이 선택을 진행해도 될까', fixedNow); // 3효 양동효
  assert.equal(res.status, 'calculated');
  assert.equal(res.engineVersion, ICHING_MASTER_ENGINE_VERSION);
  assert(res.calculatedAtKst.includes('KST'));
  assert.deepEqual(res.movingLines, [3]);
  assert(res.primary.number >= 1 && res.primary.number <= 64);
  assert(res.changed.number >= 1 && res.changed.number <= 64);
  assert(res.nuclear.number >= 1 && res.nuclear.number <= 64);
  assert(res.opposite.number >= 1 && res.opposite.number <= 64);
  assert(res.reversed.number >= 1 && res.reversed.number <= 64);
  assert(res.decisionScore >= 0 && res.decisionScore <= 100);
  assert(res.tiYong.relationship.length > 0);
  assert.equal(res.yaoStages.length, 6);
  assert(res.dominantStage.position >= 1 && res.dominantStage.position <= 6);
  assert(res.hexagramDynamics.momentumScore >= 0 && res.hexagramDynamics.momentumScore <= 100);
  assert(res.palGongSeYing.seYao >= 1 && res.palGongSeYing.seYao <= 6);
  assert(res.palGongSeYing.yingYao >= 1 && res.palGongSeYing.yingYao <= 6);
  assert(res.temporalIchingRhythm.divinationWatchWindow.length > 0);
  assert(res.ichingSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatIchingMasterPrompt(res);
  assert(prompt.includes(ICHING_MASTER_ENGINE_VERSION));
  assert(prompt.includes('KST'));
  assert(prompt.includes('본괘(本卦)'));
  assert(prompt.includes('지괘(之卦/변괘)'));
  assert(prompt.includes('호괘(互卦/잠재)'));
  assert(prompt.includes('착괘(錯卦/그림자)'));
  assert(prompt.includes('종괘(綜卦/상대관점)'));
  assert(prompt.includes('체용(體用) 생극제화'));
  assert(prompt.includes('효위(爻位) 6단계 성장 역학'));
  assert(prompt.includes('경방 8궁(八宮) 및 세응(世應) 상호작용'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Tarot Master Engine: 78 아르카나 수비학 소울·퍼스널리티·연간 카드 및 4원소 밸런스 검증', () => {
  const res = calculateTarotMaster({ profile, targetYear: 2026, question: '올해의 방향' });
  assert.equal(res.status, 'calculated');
  assert.equal(res.engineVersion, TAROT_MASTER_ENGINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.tarotSynthesisMatrix?.integratedAction));
  assert(res.soulCard.number >= 1 && res.soulCard.number <= 9);
  assert(res.personalityCard.number >= 1 && res.personalityCard.number <= 21);
  assert(res.yearCard.number >= 1 && res.yearCard.number <= 21);
  assert.equal(res.timelineCards.length, 3);
  const totalPct = res.elementalBalance.fire + res.elementalBalance.water + res.elementalBalance.air + res.elementalBalance.earth;
  assert.equal(totalPct, 100);
  assert(res.tarotVitalityScore >= 0 && res.tarotVitalityScore <= 100);
  assert.equal(res.cardPolarities.length, 3);
  assert(res.sephiraMapping.soulSephira.sephiraName.length > 0);
  assert(res.suitManifestation.suitName.length > 0);
  const prompt = formatTarotMasterPrompt(res);
  assert(prompt.includes(TAROT_MASTER_ENGINE_VERSION));
  assert(prompt.includes('생애 소울 카드'));
  assert(prompt.includes('생애 퍼스널리티 카드'));
  assert(prompt.includes('올해의 성장 카드'));
  assert(prompt.includes('3카드 타임라인 스프레드'));
  assert(prompt.includes('카발라 생명나무 세피라 조응'));
  assert(prompt.includes('마이너 아르카나 수트 실천 지침'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ziwei Flying Stars Engine: 유년 사화 동적 비성 및 삼방사정 밸런스 검증', () => {
  const res = calculateZiweiFlyingStars({ profile, targetYear: 2026, question: '올해 재물과 커리어 방향' });
  assert.equal(res.engineVersion, ZIWEI_FLYING_STARS_ENGINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.ziweiFlyingSynthesisMatrix?.integratedAction));
  assert.equal(res.targetYear, 2026);
  assert(res.mutagens.lu.starName.length > 0);
  assert(res.mutagens.quan.starName.length > 0);
  assert(res.mutagens.ke.starName.length > 0);
  assert(res.mutagens.ji.starName.length > 0);
  assert(res.sanFangSiZhengBalance.breakthroughPowerScore >= 0 && res.sanFangSiZhengBalance.breakthroughPowerScore <= 100);
  assert(res.luJiConflictDynamics.relationType.length > 0);
  assert.equal(res.quarterlyPacing.length, 4);
  const prompt = formatZiweiFlyingStarsPrompt(res);
  assert(prompt.includes(ZIWEI_FLYING_STARS_ENGINE_VERSION));
  assert(prompt.includes('화록(化祿)'));
  assert(prompt.includes('화권(化權)'));
  assert(prompt.includes('화과(化科)'));
  assert(prompt.includes('화기(化忌)'));
  assert(prompt.includes('삼방사정(三方四正) 사화 집결도'));
  assert(prompt.includes('록기교충(祿忌交衝) 리스크 방어선'));
  assert(prompt.includes('유년 4분기 완급 조절 타임라인'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('HeLuoLiShu Engine: 사주·주역 융합 선천괘·후천괘·원당효 일생 마스터플랜 검증', () => {
  const res = calculateHeLuoLiShu({ profile, now: new Date('2026-11-15T07:15:00+09:00'), question: '직장과 진로의 도약' });
  assert.equal(res.status, 'calculated');
  assert.equal(res.engineVersion, HELUOLISHU_ENGINE_VERSION);
  assert(res.heavenNumber > 0 && res.earthNumber > 0);
  assert(res.innateHexagram.number >= 1 && res.innateHexagram.number <= 64);
  assert(res.acquiredHexagram.number >= 1 && res.acquiredHexagram.number <= 64);
  assert(res.yuanTangYao >= 1 && res.yuanTangYao <= 6);
  assert(res.lifeCycleBalance.earlyLifeScore >= 0 && res.lifeCycleBalance.earlyLifeScore <= 100);
  assert(res.lifeCycleBalance.matureLifeScore >= 0 && res.lifeCycleBalance.matureLifeScore <= 100);
  assert(res.yinYangBalance !== undefined);
  assert(res.yinYangBalance.yinYangBalanceIndex >= 0 && res.yinYangBalance.yinYangBalanceIndex <= 100);
  assert(res.yuanTangDetail !== undefined);
  assert(res.yuanTangDetail.potencyScore >= 50 && res.yuanTangDetail.potencyScore <= 98);
  assert.equal(res.decadeTrajectory.length, 5);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalHeLuoRhythm.hetuWatchWindow.length > 0);
  assert(res.heLuoSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatHeLuoLiShuPrompt(res);
  assert(prompt.includes(HELUOLISHU_ENGINE_VERSION));
  assert(prompt.includes('선천본괘'));
  assert(prompt.includes('원당효'));
  assert(prompt.includes('후천변괘'));
  assert(prompt.includes('음양 체질'));
  assert(prompt.includes('생애 대운별 주역 궤적'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Dynamic Clash Trigger Engine: 실시간 삼형·육충·파해 동적 격발 및 에너지 승화 검증', () => {
  const res = calculateDynamicClashTrigger({ profile, targetDate: new Date('2026-11-02T19:00:00+09:00'), question: '오늘 조심할 점' });
  assert.equal(res.engineVersion, DYNAMIC_CLASH_ENGINE_VERSION);
  assert(res.volatilityScore >= 0 && res.volatilityScore <= 100);
  assert(res.harmonyScore >= 0 && res.harmonyScore <= 100);
  assert(['explosive_change', 'high_tension', 'balanced_movement', 'peaceful_flow'].includes(res.netStatus));
  assert(res.todayActionMatrix.doNow.length > 0);
  assert(res.todayActionMatrix.avoidNow.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  const prompt = formatDynamicClashPrompt(res);
  assert(prompt.includes(DYNAMIC_CLASH_ENGINE_VERSION));
  assert(prompt.includes('오늘 일진'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Twelve Spirits Cycle Engine: 사주 12신살 완전 순환 궤도 및 일진 페르소나 검증', () => {
  const res = calculateTwelveSpiritsCycle({ profile, targetDate: new Date('2026-11-02T19:00:00+09:00'), question: '오늘의 행동 전략' });
  assert.equal(res.engineVersion, TWELVE_SPIRITS_ENGINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.twelveSpiritsSynthesisMatrix?.integratedAction));
  assert(res.todayDaySpirit.dayBase.name.length > 0);
  assert(res.todayDaySpirit.yearBase.name.length > 0);
  assert(res.todayStrategy.recommendedPersona.length > 0);
  assert(res.todayStrategy.superpowerToUse.length > 0);
  const prompt = formatTwelveSpiritsPrompt(res);
  assert(prompt.includes(TWELVE_SPIRITS_ENGINE_VERSION));
  assert(prompt.includes('오늘 일진'));
  assert(prompt.includes('추천 페르소나'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Pythagorean Lifecycle Engine: 피타고라스 4대 피너클 & 챌린지 생애 주기 검증', () => {
  const res = calculatePythagoreanLifecycle({ profile, targetDate: new Date('2026-11-02T19:00:00+09:00'), question: '인생 전환기' });
  assert.equal(res.engineVersion, PYTHAGOREAN_LIFECYCLE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.pythagoreanSynthesisMatrix?.integratedAction));
  assert.equal(res.pinnacles.length, 4);
  assert.equal(res.challenges.length, 4);
  assert(res.currentPersonalYear.yearNumber >= 1 && res.currentPersonalYear.yearNumber <= 9);
  assert(res.currentPinnacle.number >= 1 && res.currentPinnacle.number <= 9);
  assert(res.currentChallenge.number >= 0 && res.currentChallenge.number <= 8);
  const prompt = formatPythagoreanLifecyclePrompt(res);
  assert(prompt.includes(PYTHAGOREAN_LIFECYCLE_VERSION));
  assert(prompt.includes('4대 피너클'));
  assert(prompt.includes('4대 챌린지'));
  assert(prompt.includes('개인년도'));
  assert(prompt.includes('교차 매트릭스'));
});

test('Astrological Decan & Sabian Engine: 점성술 36 데칸 & 사비안 심볼 360° 영혼 메타포 검증', () => {
  const res = calculateAstrologicalDecanSabian({ profile, targetDate: new Date('2026-11-02T19:00:00+09:00'), question: '직장과 창의적 비전이 궁금합니다.' });
  assert.equal(res.engineVersion, ASTRO_DECAN_SABIAN_VERSION);
  assert(res.sun.decan.decanIndex >= 1 && res.sun.decan.decanIndex <= 3);
  assert(res.sun.sabian.degreeNumber >= 1 && res.sun.sabian.degreeNumber <= 30);
  assert(res.moon.decan.decanIndex >= 1 && res.moon.decan.decanIndex <= 3);
  assert(res.moon.sabian.degreeNumber >= 1 && res.moon.sabian.degreeNumber <= 30);
  assert(res.soulPoetics.coreIdentityMetaphor.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalSabianRhythm.planetaryHourTone.length > 0);
  assert(res.sabianSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatAstrologicalDecanSabianPrompt(res);
  assert(prompt.includes(ASTRO_DECAN_SABIAN_VERSION));
  assert(prompt.includes('사비안 심볼'));
  assert(prompt.includes('데칸 배속'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Medical Bio-Matrix Engine: 오행 한난조습 및 메디컬 점성술 장부 취약도 검증', () => {
  const res = calculateMedicalBioMatrix({ profile, targetDate: new Date('2026-11-02T19:00:00+09:00'), question: '체질 관리' });
  assert.equal(res.engineVersion, MEDICAL_BIO_MATRIX_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.bioMatrixSynthesisMatrix?.integratedAction));
  assert(res.temperament.coldScore >= 0 && res.temperament.coldScore <= 100);
  assert(res.temperament.heatScore >= 0 && res.temperament.heatScore <= 100);
  assert(res.vulnerableOrgans.length > 0);
  assert(res.vitalityScore >= 0 && res.vitalityScore <= 100);
  assert(res.prescriptions.recommendedFoods.length > 0);
  const prompt = formatMedicalBioMatrixPrompt(res);
  assert(prompt.includes(MEDICAL_BIO_MATRIX_VERSION));
  assert(prompt.includes('체질 기후 진단'));
  assert(prompt.includes('취약 장부'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Life Season Timing Engine: 10년 대운 및 교운기 타이밍 검증', () => {
  const res = calculateLifeSeasonTiming({ profile, targetYear: 2026, question: '올해의 계절' });
  assert(res !== null);
  assert.equal(res.engineVersion, LIFE_SEASON_ENGINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.lifeSeasonSynthesisMatrix?.integratedAction));
  const prompt = formatLifeSeasonTimingPrompt(res);
  assert(prompt.includes(LIFE_SEASON_ENGINE_VERSION));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('%'));
  assert(!prompt.includes('/100'));
});

test('Wealth Pipeline Engine: 재물 창출 아키타입 및 골든 윈도우 타이밍 검증', () => {
  const res = calculateWealthPipeline({ profile, targetDate: new Date('2026-11-02T19:00:00+09:00'), question: '재물 파이프라인 확장' });
  assert.equal(res.engineVersion, WEALTH_PIPELINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.wealthSynthesisMatrix?.integratedAction));
  assert(['builder', 'scaler', 'investor', 'optimizer'].includes(res.archetype.type));
  assert(res.timing.annualWealthScore >= 0 && res.timing.annualWealthScore <= 100);
  assert(res.timing.monthlyCashFlowScore >= 0 && res.timing.monthlyCashFlowScore <= 100);
  assert(res.actionGuide.immediatePriority.length > 0);
  const prompt = formatWealthPipelinePrompt(res);
  assert(prompt.includes(WEALTH_PIPELINE_VERSION));
  assert(prompt.includes('재물 아키타입'));
  assert(prompt.includes('골든 윈도우'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Karmic Nodes Engine: 카르믹 노드 축 및 영혼 진화 궤적 검증', () => {
  const res = calculateKarmicNodes({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00') });
  assert.equal(res.engineVersion, KARMIC_NODES_ENGINE_VERSION);
  assert(res.nodeAxis.northSign.length > 0);
  assert(res.nodeAxis.soulQuest.length > 0);
  assert(res.evolutionReadinessScore >= 0 && res.evolutionReadinessScore <= 100);
  assert(res.chiron.healerGift.length > 0);
  assert(res.lilith.rawPower.length > 0);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.karmicNodesSynthesisMatrix?.integratedAction));
  const prompt = formatKarmicNodesPrompt(res);
  assert(prompt.includes(KARMIC_NODES_ENGINE_VERSION));
  assert(prompt.includes('카르믹 노드 축'));
  assert(prompt.includes('키론'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Karmic Synastry Resonance Engine: 카르믹 시나스트리 및 인연 공명 검증', () => {
  const res = calculateKarmicSynastry(profile, null, '동반자 인연', new Date('2026-11-03T08:00:00+09:00'));
  assert.equal(res.engineVersion, KARMIC_SYNASTRY_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.synastrySynthesisMatrix?.integratedAction));
  const prompt = formatKarmicSynastryPrompt(res);
  assert(prompt.includes('카르믹 시나스트리'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Mental Resilience Engine: 위기 돌파 슈퍼파워 및 주역 난괘 탈출 검증', () => {
  const res = calculateMentalResilience({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00'), question: '돌파 전략' });
  assert.equal(res.engineVersion, MENTAL_RESILIENCE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.resilienceSynthesisMatrix?.integratedAction));
  assert(res.resilienceScore >= 0 && res.resilienceScore <= 100);
  assert(res.primaryBreakthroughPower.breakthroughGift.length > 0);
  assert(res.hexagramWisdom.escapeRoute.length > 0);
  assert(res.mentalShield.step1Detachment.length > 0);
  const prompt = formatMentalResiliencePrompt(res);
  assert(prompt.includes(MENTAL_RESILIENCE_VERSION));
  assert(prompt.includes('위기 돌파 슈퍼파워'));
  assert(prompt.includes('멘탈 쉴드'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Noble Network Engine: 4대 귀인 및 인연 네트워크 시너지 검증', () => {
  const res = calculateNobleNetwork({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00'), question: '귀인 인연' });
  assert.equal(res.engineVersion, NOBLE_NETWORK_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.nobleNetworkSynthesisMatrix?.integratedAction));
  assert(['catalyst', 'anchor', 'amplifier'].includes(res.primaryArchetype.type));
  assert(res.networkSynergyScore >= 0 && res.networkSynergyScore <= 100);
  assert(res.synergyZodiacAnimals.sixHarmony.length > 0);
  assert(res.synergyZodiacAnimals.tripleHarmony.length > 0);
  assert(res.nobleStars.heavenlyNoble.beneficialAnimals.length > 0);
  const prompt = formatNobleNetworkPrompt(res);
  assert(prompt.includes(NOBLE_NETWORK_VERSION));
  assert(prompt.includes('1순위 귀인 아키타입'));
  assert(prompt.includes('천을귀인'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Monthly Flow Engine: 12개월 월운 및 분기 타이밍 검증', () => {
  const res = calculateMonthlyFlow({ profile, targetYear: 2026, question: '이직 적기' });
  assert.equal(res.engineVersion, MONTHLY_FLOW_ENGINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.monthlyFlowSynthesisMatrix?.integratedAction));
  assert.equal(res.monthlyTimeline.length, 12);
  const prompt = formatMonthlyFlowPrompt(res);
  assert(prompt.includes(MONTHLY_FLOW_ENGINE_VERSION));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Voice Persona Engine: 스피치 페르소나 및 설득력 치트키 검증', () => {
  const res = calculateVoicePersona({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00'), question: '발표 화법' });
  assert.equal(res.engineVersion, VOICE_PERSONA_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.voiceSynthesisMatrix?.integratedAction));
  assert(res.persona.title.length > 0);
  assert(res.persuasionScore >= 0 && res.persuasionScore <= 100);
  assert(res.cheatsheet.negotiation.length > 0);
  assert(res.cheatsheet.presentation.length > 0);
  const prompt = formatVoicePersonaPrompt(res);
  assert(prompt.includes(VOICE_PERSONA_VERSION));
  assert(prompt.includes('1순위 화법 페르소나'));
  assert(prompt.includes('실전 스피치 치트키'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Contract Shield Engine: 계약 분쟁 리스크 및 5대 쉴드 체크리스트 검증', () => {
  const res = calculateContractShield({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00'), question: '새 외주 계약서 서명 전 점검' });
  assert.equal(res.engineVersion, CONTRACT_SHIELD_VERSION);
  assert(res.disputeRiskScore >= 0 && res.disputeRiskScore <= 100);
  assert(res.shieldChecklist.length === 5);
  assert(res.ichingSongWisdom.hexagram.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalShieldRhythm.negotiationWindow.length > 0);
  const prompt = formatContractShieldPrompt(res);
  assert(prompt.includes(CONTRACT_SHIELD_VERSION));
  assert(prompt.includes('계약 & 분쟁 경계 기조'));
  assert(prompt.includes('5대 계약 쉴드 체크리스트'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));

  const lugh = calculateLughSamildanach(profile, new Date('2026-11-15T08:25:00+09:00'), '새 프로젝트 시작');
  assert.equal(lugh.engineVersion, LUGH_SAMILDANACH_VERSION);
  assert(lugh.calculatedAtKst.includes('KST'));
  assert(lugh.temporalLughRhythm.taraWatchWindow.length > 0);
  const lughPrompt = formatLughSamildanachPrompt(lugh);
  assert(lughPrompt.includes('KST'));
  assert(!lughPrompt.includes('/100') && !lughPrompt.includes('%') && !lughPrompt.includes('점수'));
});

test('Life Domain Wheel Engine: 6대 핵심 라이프 도메인 밸런스 휠 검증', () => {
  const res = calculateLifeDomainWheel({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00'), question: '삶의 균형' });
  assert.equal(res.engineVersion, LIFE_DOMAIN_WHEEL_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.wheelSynthesisMatrix?.integratedAction));
  assert(res.wheelBalanceScore >= 0 && res.wheelBalanceScore <= 100);
  assert(res.primaryBreakthroughDomain.titleKo.length > 0);
  assert(res.rechargeDomain.titleKo.length > 0);
  assert(Object.keys(res.domains).length === 6);
  const prompt = formatLifeDomainWheelPrompt(res);
  assert(prompt.includes(LIFE_DOMAIN_WHEEL_VERSION));
  assert(prompt.includes('라이프 휠 균형도'));
  assert(prompt.includes('1순위 돌파 도메인'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Energetic Prescription Engine: 결핍 오행 바이오 에너지 맞춤 처방 검증', () => {
  const res = calculateEnergeticPrescription({ profile, currentDate: new Date('2026-11-16T06:00:00+09:00'), question: '활력 회복' });
  assert.equal(res.engineVersion, ENERGETIC_PRESCRIPTION_ENGINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.energeticSynthesisMatrix?.integratedAction));
  assert(res.interpretiveBoundary.length > 0);
  assert(res.microRituals.length > 0);
  const prompt = formatEnergeticPrescriptionPrompt(res);
  assert(prompt.includes(ENERGETIC_PRESCRIPTION_ENGINE_VERSION));
  assert(prompt.includes('교차 매트릭스') && prompt.includes('해석 경계'));
  assert(!prompt.includes('/100'));
});

test('Instant Decision Engine: 매화역수·기문둔갑 즉시 결단 검증', () => {
  const res = calculateInstantDecision({ instant: new Date('2026-11-16T06:00:00+09:00'), questionText: '지금 추진할까요' });
  assert.equal(res.engineVersion, INSTANT_DECISION_ENGINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.instantDecisionSynthesisMatrix?.integratedAction));
  assert(res.verdict.finalScore >= 0 && res.verdict.finalScore <= 100);
  const prompt = formatInstantDecisionPrompt(res);
  assert(prompt.includes(INSTANT_DECISION_ENGINE_VERSION));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Deep Work Flow Engine: 딥워크 몰입 아키타입 및 최적 환경 매트릭스 검증', () => {
  const res = calculateDeepWorkFlow({ profile, targetDate: new Date('2026-11-15T07:45:00+09:00'), question: '개발 작업 집중이 필요해' });
  assert.equal(res.engineVersion, DEEP_WORK_FLOW_VERSION);
  assert(res.archetype.title.length > 0);
  assert(res.flowFocusScore >= 0 && res.flowFocusScore <= 100);
  assert(res.environment.soundscape.length > 0);
  assert(res.archetype.optimalSprintMinutes > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalFlowRhythm.focusWatchWindow.length > 0);
  assert(res.flowSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatDeepWorkFlowPrompt(res);
  assert(prompt.includes(DEEP_WORK_FLOW_VERSION));
  assert(prompt.includes('1순위 몰입 아키타입'));
  assert(prompt.includes('최적 환경 매트릭스'));
  assert(prompt.includes('KST'));
  assert.doesNotMatch(prompt, /\bHz\b|Solfeggio|솔페지오|주파수/i);
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Sleep Subconscious Engine: 수면 사운드 안내 및 3단계 나이트 리셋 검증', () => {
  const res = calculateSleepSubconscious({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00'), question: '숙면과 꿈 해몽' });
  assert.equal(res.engineVersion, SLEEP_SUBCONSCIOUS_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.sleepSynthesisMatrix?.integratedAction));
  assert(res.sleepRecoveryScore >= 0 && res.sleepRecoveryScore <= 100);
  assert(res.soundscape.recommendedSounds.length > 0);
  assert(res.nightRitual.step1BrainDump.length > 0);
  assert(res.dreamDecoding.subconsciousMessage.length > 0);
  const prompt = formatSleepSubconsciousPrompt(res);
  assert(prompt.includes(SLEEP_SUBCONSCIOUS_VERSION));
  assert(prompt.includes('수면 회복 잠재력'));
  assert(prompt.includes('나이트 리셋 리추얼'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert.doesNotMatch(prompt, /\bHz\b|Solfeggio|솔페지오|델타파|세타파|뇌파|주파수/i);
});

test('Quantum Leap Timing Engine: 퀀텀 점프 준비도 및 골든 모멘텀 검증', () => {
  const res = calculateQuantumLeapTiming({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00'), question: '승부수 타이밍' });
  assert.equal(res.engineVersion, QUANTUM_LEAP_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.quantumLeapSynthesisMatrix?.integratedAction));
  assert(res.leapReadinessScore >= 0 && res.leapReadinessScore <= 100);
  assert(res.currentPhase.titleKo.length > 0);
  assert(res.goldenWindow.bestTimingDesc.length > 0);
  const prompt = formatQuantumLeapPrompt(res);
  assert(prompt.includes(QUANTUM_LEAP_VERSION));
  assert(prompt.includes('퀀텀 점프 준비 상태'));
  assert(prompt.includes('골든 모멘텀'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Elemental Resonance Engine: 오행 생극제화 및 상생 순환 루프 검증', () => {
  const res = calculateElementalResonance({ profile, targetDate: new Date('2026-11-15T07:35:00+09:00'), question: '일과 집중력 회복' });
  assert.equal(res.engineVersion, ELEMENTAL_RESONANCE_VERSION);
  assert(res.overallResonanceScore >= 0 && res.overallResonanceScore <= 100);
  assert(res.amplifier.primeElement.length > 0);
  assert(res.amplifier.amplifierColor.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalElementalRhythm.cycleWatchWindow.length > 0);
  assert(res.elementalSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatElementalResonancePrompt(res);
  assert(prompt.includes(ELEMENTAL_RESONANCE_VERSION));
  assert(prompt.includes('오행 생극제화'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Yin-Yang Polarity Engine: 음양 수리 분포 및 24시간 바이폴라 윈도우 검증', () => {
  const res = calculateYinYangPolarity({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00'), question: '오늘의 에너지 리듬' });
  assert.equal(res.engineVersion, YIN_YANG_POLARITY_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.polaritySynthesisMatrix?.integratedAction));
  assert.equal(res.distribution.yangCount + res.distribution.yinCount, 8);
  assert(res.balanceScore >= 0 && res.balanceScore <= 100);
  assert(res.timeSlots.yangActionWindow.length > 0);
  assert(res.timeSlots.yinFocusWindow.length > 0);
  const prompt = formatYinYangPolarityPrompt(res);
  assert(prompt.includes(YIN_YANG_POLARITY_VERSION));
  assert(prompt.includes('음양 극성 밸런스'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Rune Matrix Engine: 고대 노르딕 룬 동시성 3대 스프레드 검증', () => {
  const res = calculateRuneMatrix({ profile, targetDate: new Date('2026-11-03T08:00:00+09:00') });
  assert.equal(res.engineVersion, RUNE_MATRIX_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.runeSynthesisMatrix?.integratedAction));
  assert(res.runePowerScore >= 0 && res.runePowerScore <= 100);
  assert(res.spread.originRune.name.length > 0);
  assert(res.spread.challengeRune.name.length > 0);
  assert(res.spread.horizonRune.name.length > 0);
  const prompt = formatRuneMatrixPrompt(res);
  assert(prompt.includes(RUNE_MATRIX_VERSION));
  assert(prompt.includes('고대 노르딕 룬 동시성 매트릭스'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Soul Journey Tarot Engine: 영혼 연금술 3단계 및 4원소 균형 검증', () => {
  const res = calculateSoulJourneyTarot({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '영혼 여정' });
  assert.equal(res.engineVersion, SOUL_JOURNEY_TAROT_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.soulJourneySynthesisMatrix?.integratedAction));
  assert(res.currentArchetype.number >= 0 && res.currentArchetype.number <= 21);
  assert(res.elementalBalance.wands.score >= 0 && res.elementalBalance.wands.score <= 100);
  assert(res.riteOfPassage.alchemyScore >= 0 && res.riteOfPassage.alchemyScore <= 100);
  const prompt = formatSoulJourneyTarotPrompt(res);
  assert(prompt.includes('LUCKEY 영혼 타로 여정 지능'));
  assert(prompt.includes(res.currentArchetype.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('%'));
});

test('Transcendental Meditation Engine: 초월 명상 및 마음 안정 안내 검증', () => {
  const res = calculateTranscendentalMeditation({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '마음의 평정' });
  assert.equal(res.engineVersion, TRANSCENDENTAL_MEDITATION_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.zenSynthesisMatrix?.integratedAction));
  assert(res.equanimityScore >= 0 && res.equanimityScore <= 100);
  assert(res.prescription.intendedMindState.length > 0);
  assert(res.ichingZenState.mantraText.length > 0);
  const prompt = formatTranscendentalMeditationPrompt(res);
  assert(prompt.includes('LUCKEY 초월 명상 & 마음 안정 지능'));
  assert(prompt.includes(res.zenEnergyArchetype));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
  assert.doesNotMatch(prompt, /\bHz\b|Solfeggio|솔페지오|뇌파|주파수/i);
});

test('Strategic Leverage Engine: 전략 협상 및 손자병법 기문 레버리지 검증', () => {
  const res = calculateStrategicLeverage({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '중요 협상' });
  assert.equal(res.engineVersion, STRATEGIC_LEVERAGE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.leverageSynthesisMatrix?.integratedAction));
  assert(res.leverageScore >= 0 && res.leverageScore <= 100);
  assert(res.sunTzuTactic.coreMaxim.length > 0);
  assert(res.strategicActionPlan.openingMove.length > 0);
  const prompt = formatStrategicLeveragePrompt(res);
  assert(prompt.includes('LUCKEY 전략 협상 & 손자병법 기문 레버리지'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Spatial Fengshui Engine: 동양 풍수·점성술 공간 길방위 v2.0.0 교차 매트릭스 검증', () => {
  const res = calculateSpatialFengshui({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '작업실 방향' });
  assert.equal(res.engineVersion, SPATIAL_FENGSHUI_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.spatialSynthesisMatrix?.integratedAction));
  assert(res.allDirections.length === 8);
  const prompt = formatSpatialFengshuiPrompt(res);
  assert(prompt.includes('공간 교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Special Stars Matrix Engine: 15대 신살 슈퍼파워 치환 v2.0.0 교차 매트릭스 검증', () => {
  const res = calculateSpecialStarsMatrix({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '타고난 무기' });
  assert.equal(res.engineVersion, SPECIAL_STARS_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.specialStarsSynthesisMatrix?.integratedAction));
  const prompt = formatSpecialStarsPrompt(res);
  assert(prompt.includes('신살 교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Shadow Archetype Engine: 융 심리학 그림자 자아 & 골든 섀도우 연금술 검증', () => {
  const res = calculateShadowArchetype({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00') });
  assert.equal(res.engineVersion, SHADOW_ARCHETYPE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.shadowSynthesisMatrix?.integratedAction));
  assert(res.shadowIntegrationScore >= 0 && res.shadowIntegrationScore <= 100);
  assert(res.subconsciousDepth >= 0 && res.subconsciousDepth <= 100);
  assert(res.primaryShadow.coreWound.length > 0);
  assert(res.goldenShadow.goldenGift.length > 0);
  const prompt = formatShadowArchetypePrompt(res);
  assert(prompt.includes('LUCKEY 융 심리학 그림자 자아 & 골든 섀도우 연금술'));
  assert(prompt.includes(res.primaryShadow.archetype));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Biorhythm Peak Flow Engine: 3대 생체 바이오리듬 & 크로노타입 황금 피크 검증', () => {
  const res = calculateBiorhythmPeakFlow({ profile, targetDate: new Date('2026-11-15T07:45:00+09:00'), question: '오늘 집중할 시간대 알려줘' });
  assert.equal(res.engineVersion, BIORHYTHM_PEAK_FLOW_VERSION);
  assert(res.biorhythm.physical >= -100 && res.biorhythm.physical <= 100);
  assert(res.biorhythm.emotional >= -100 && res.biorhythm.emotional <= 100);
  assert(res.biorhythm.intellectual >= -100 && res.biorhythm.intellectual <= 100);
  assert(res.biorhythm.compositeVitality >= 0 && res.biorhythm.compositeVitality <= 100);
  assert(res.goldenWindows.deepWorkPeak.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalBioRhythm.currentPhaseWindow.length > 0);
  assert(res.bioSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatBiorhythmPeakFlowPrompt(res);
  assert(prompt.includes('LUCKEY 3대 생체 바이오리듬 & 크로노타입 황금 피크'));
  assert(prompt.includes(res.chronotype));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Destiny Synastry Echo Engine: 다차원 운명 공명 에코 & 카르마적 인연 중력 검증', () => {
  const res = calculateDestinySynastryEcho({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '상대와의 갈등 조율' });
  assert.equal(res.engineVersion, DESTINY_SYNASTRY_ECHO_VERSION);
  assert(res.karmicEchoScore >= 0 && res.karmicEchoScore <= 100);
  assert(res.soulConnectionDepth >= 0 && res.soulConnectionDepth <= 100);
  assert(res.relationshipDynamics.magneticPullFactor.length > 0);
  assert(res.goldenCommunicationCode.mindOpeningKeyword.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  const prompt = formatDestinySynastryEchoPrompt(res);
  assert(prompt.includes('LUCKEY 다차원 운명 공명 에코 & 카르마적 인연 중력'));
  assert(prompt.includes(res.gravityType));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Micro-Habit Karma Engine: 21일 카르마 리셋 & 오행 마이크로 해빗 검증', () => {
  const res = calculateMicroHabitKarma({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '루틴 안착' });
  assert.equal(res.engineVersion, MICRO_HABIT_KARMA_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.microHabitSynthesisMatrix?.integratedAction));
  assert(res.neuroplasticityScore >= 0 && res.neuroplasticityScore <= 100);
  assert(res.karmaStreakIndex >= 0 && res.karmaStreakIndex <= 100);
  assert(res.microHabit.twoMinuteAction.length > 0);
  assert(res.twentyOneDayMilestone.days1to7.length > 0);
  const prompt = formatMicroHabitKarmaPrompt(res);
  assert(prompt.includes('LUCKEY 21일 카르마 리셋 & 오행 마이크로 해빗'));
  assert(prompt.includes(res.archetype));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Ikigai Destiny Compass Engine: 이키가이 천직 4대 교집합 & 소명 나침반 검증', () => {
  const res = calculateIkigaiDestinyCompass({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00') });
  assert.equal(res.engineVersion, IKIGAI_DESTINY_COMPASS_VERSION);
  assert(res.ikigaiAlignmentScore >= 0 && res.ikigaiAlignmentScore <= 100);
  assert(res.quadrants.passion.score >= 0 && res.quadrants.passion.score <= 100);
  assert(res.soulCallingTitle.length > 0);
  assert(res.monetizationPath.phase1Validation.length > 0);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.ikigaiSynthesisMatrix?.integratedAction));
  const prompt = formatIkigaiDestinyCompassPrompt(res);
  assert(prompt.includes('LUCKEY 이키가이 천직 4대 교집합 & 소명 나침반'));
  assert(prompt.includes(res.soulCallingTitle));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Serendipity Synchronicity Engine: 양자 동시성 & 세렌디피티 행운 가속 검증', () => {
  const res = calculateSerendipitySynchronicity({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '오늘의 행운 신호' });
  assert.equal(res.engineVersion, SERENDIPITY_SYNCHRONICITY_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.serendipitySynthesisMatrix?.integratedAction));
  assert(res.synchronicityScore >= 0 && res.synchronicityScore <= 100);
  assert(res.serendipityVelocity >= 0 && res.serendipityVelocity <= 100);
  assert(res.angelNumberSign.numberCode.length > 0);
  assert(res.catalystAction.microShiftAction.length > 0);
  const prompt = formatSerendipitySynchronicityPrompt(res);
  assert(prompt.includes('LUCKEY 양자 동시성 & 세렌디피티 행운 가속'));
  assert(prompt.includes(res.activeLuckyPortal));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Human Design BodyGraph Engine: 휴먼 디자인 9대 에너지 센터 및 오라 검증', () => {
  const res = calculateHumanDesignBodyGraph({ profile, targetDate: new Date('2026-11-15T07:55:00+09:00'), question: '내 결정 방식이 궁금해' });
  assert.equal(res.engineVersion, HUMAN_DESIGN_BODYGRAPH_VERSION);
  assert(res.designType.type.length > 0);
  assert(res.strategy.length > 0);
  assert(res.innerAuthority.length > 0);
  assert(res.centers.sacral !== undefined);
  assert(res.deconditioningAdvice.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalHdRhythm.auraWatchWindow.length > 0);
  assert(res.hdSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatHumanDesignBodyGraphPrompt(res);
  assert(prompt.includes('LUCKEY 휴먼 디자인 9대 에너지 센터 & 바디그래프 오라'));
  assert(prompt.includes(res.designType.koreanLabel));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Chakra Vibration Alignment Engine: frequency-free chakra alignment and balance', () => {
  const res = calculateChakraVibrationAlignment({ profile, targetDate: new Date('2026-11-15T07:25:00+09:00'), question: '요즘 불안하고 지쳐서 회복이 필요해' });
  assert.equal(res.engineVersion, CHAKRA_ALIGNMENT_VERSION);
  assert.equal(res.chakras.length, 7);
  assert(res.overallChakraBalanceScore >= 0 && res.overallChakraBalanceScore <= 100);
  assert.equal('frequencyHz' in res.primaryFocusChakra, false);
  assert(res.chakras.every((chakra) => !('frequencyHz' in chakra)));
  assert(res.kundaliniBreathingPrescription.instruction.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalChakraRhythm.chakraWatchWindow.length > 0);
  assert(res.chakraSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatChakraVibrationAlignmentPrompt(res);
  assert(prompt.includes('LUCKEY 7대 차크라 파동 정렬 & 에너지 퀀텀 밸런싱'));
  assert(prompt.includes(res.primaryFocusChakra.name));
  assert(prompt.includes('KST'));
  assert.doesNotMatch(prompt, /\bHz\b|Solfeggio|솔페지오|주파수/);
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Enneagram Soul Integration Engine: 에니어그램 영혼 성격 통합 및 의식 진화 검증', () => {
  const res = calculateEnneagramSoulIntegration({ profile, targetDate: new Date('2026-11-15T07:35:00+09:00'), question: '관계에서 내 방어기제를 알고 싶어' });
  assert.equal(res.engineVersion, ENNEAGRAM_INTEGRATION_VERSION);
  assert(res.soulType.coreNumber >= 1 && res.soulType.coreNumber <= 9);
  assert(res.integrationScore >= 0 && res.integrationScore <= 100);
  assert(res.egoFixation.length > 0);
  assert(res.virtueAscension.length > 0);
  assert(res.soulLiberationTask.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalEnneagramRhythm.centerWatchWindow.length > 0);
  assert(res.enneagramSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatEnneagramSoulIntegrationPrompt(res);
  assert(prompt.includes('LUCKEY 에니어그램 영혼 성격 통합 & 의식 진화'));
  assert(prompt.includes(res.soulType.koreanTitle));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Ancestral Epigenetic Karma Engine: 조상 혈통 업력 & 후성유전학적 카르마 정화 검증', () => {
  const res = calculateAncestralEpigeneticKarma({ profile, targetDate: new Date('2026-11-15T07:35:00+09:00'), question: '가족 관계 패턴을 끊고 싶어' });
  assert.equal(res.engineVersion, ANCESTRAL_KARMA_VERSION);
  assert(res.lineageArchetype.length > 0);
  assert(res.ancestralImprint.clearingDegreePercent >= 0 && res.ancestralImprint.clearingDegreePercent <= 100);
  assert(res.generationalChainToBreak.length > 0);
  assert(res.liberationAffirmation.length > 0);
  assert(res.calculatedAtKst.includes('KST'));
  assert(res.temporalAncestralRhythm.lineageWatchWindow.length > 0);
  assert(res.ancestralSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatAncestralEpigeneticKarmaPrompt(res);
  assert(prompt.includes('LUCKEY 조상 혈통 업력 & 후성유전학적 카르마 정화'));
  assert(prompt.includes(res.lineageArchetype));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Shamanic Animal Totem Engine: 샤머니즘 파워 애니멀 & 12지지 스피릿 토템 검증', () => {
  const res = calculateShamanicAnimalTotem({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '내 수호 동물' });
  assert.equal(res.engineVersion, SHAMANIC_ANIMAL_TOTEM_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.totemSynthesisMatrix?.integratedAction));
  assert(res.primaryTotem.animalName.length > 0);
  assert(res.totemicResonanceScore >= 0 && res.totemicResonanceScore <= 100);
  assert(res.callOfTheWildRitual.length > 0);
  assert(res.tabooWarning.length > 0);
  const prompt = formatShamanicAnimalTotemPrompt(res);
  assert(prompt.includes('LUCKEY 샤머니즘 파워 애니멀 & 12지지 스피릿 토템'));
  assert(prompt.includes(res.primaryTotem.animalName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Hero Myth Monomyth Engine: 조셉 캠벨 영웅의 여정 12단계 & 운명 돌파 검증', () => {
  const res = calculateHeroMythMonomyth({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00') });
  assert.equal(res.engineVersion, HERO_MONOMYTH_VERSION);
  assert(res.currentStage.stepNumber >= 1 && res.currentStage.stepNumber <= 12);
  assert(res.theUltimateOrdeal.length > 0);
  assert(res.theSacredElixir.length > 0);
  assert(res.heroicBreakthroughAction.length > 0);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.monomythSynthesisMatrix?.integratedAction));
  const prompt = formatHeroMythMonomythPrompt(res);
  assert(prompt.includes('LUCKEY 조셉 캠벨 영웅의 여정 12단계 모노미스'));
  assert(prompt.includes(res.heroicArchetype));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Akashic Records Oracle Engine: 아카식 레코드 영혼 서약 & 카르믹 청사진 검증', () => {
  const res = calculateAkashicRecordsOracle({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00') });
  assert.equal(res.engineVersion, AKASHIC_RECORDS_VERSION);
  assert(res.soulOrigin.originSystem.length > 0);
  assert(res.soulContract.primaryLesson.length > 0);
  assert(res.akashicAccessMantra.length > 0);
  assert(res.soulClarityIndex >= 0 && res.soulClarityIndex <= 100);
  const prompt = formatAkashicRecordsOraclePrompt(res);
  assert(prompt.includes('LUCKEY 아카식 레코드 영혼 서약 & 카르믹 청사진'));
  assert(prompt.includes(res.soulOrigin.originSystem));
  assert(!prompt.includes('/100') && !prompt.includes('자각도:'));
});

test('Quantum Probabilistic Timeline Engine: 양자 다중우주 타임라인 분기 & 퀀텀 점프 검증', () => {
  const res = calculateQuantumProbabilisticTimeline({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '미래 분기' });
  assert.equal(res.engineVersion, QUANTUM_TIMELINE_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.quantumTimelineSynthesisMatrix?.integratedAction));
  assert(res.baselineTimeline.probabilityPercent + res.optimalQuantumTimeline.probabilityPercent === 100);
  assert(res.bifurcationWindow.criticalDateRange.length > 0);
  assert(res.quantumCollapseCatalyst.identityShift.length > 0);
  const prompt = formatQuantumProbabilisticTimelinePrompt(res);
  assert(prompt.includes('LUCKEY 양자 다중우주 타임라인 분기 & 퀀텀 점프'));
  assert(prompt.includes(res.optimalQuantumTimeline.projectedOutcome6Months));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('%'));
});

test('Somatic Body Armoring Engine: 빌헬름 라이히 7대 신체 갑옷 해제 & 체성 감각 검증', () => {
  const res = calculateSomaticBodyArmoring({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '신체 긴장 해소' });
  assert.equal(res.engineVersion, SOMATIC_ARMORING_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.somaticSynthesisMatrix?.integratedAction));
  assert(res.primaryArmorSegment.segmentName.length > 0);
  assert(res.primaryArmorSegment.tensionLevelScore >= 0 && res.primaryArmorSegment.tensionLevelScore <= 100);
  assert(res.lifeForceEnergyFlowScore >= 0 && res.lifeForceEnergyFlowScore <= 100);
  assert(res.vagusNerveResetPrescription.durationSeconds > 0);
  const prompt = formatSomaticBodyArmoringPrompt(res);
  assert(prompt.includes('LUCKEY 빌헬름 라이히 7대 신체 갑옷 해제 & 체성 감각'));
  assert(prompt.includes(res.primaryArmorSegment.segmentName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Supreme Wisdom Trinity Engine: 기적수업 × 초기불교 × 영지주의 3대 지혜 융합 검증', () => {
  const res = calculateSupremeWisdomTrinity({ profile, targetDate: new Date('2026-11-03T10:00:00+09:00'), question: '마음 평화' });
  assert.equal(res.engineVersion, SUPREME_WISDOM_TRINITY_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.trinitySynthesisMatrix?.integratedAction));
  assert(res.trinitySynthesisCore.length > 0);
  assert(res.acim.workbookLessonQuote.length > 0);
  assert(res.acim.holyInstantShift.length > 0);
  assert(res.buddhism.nikayaQuote.length > 0);
  assert(res.buddhism.secondArrowStop.length > 0);
  assert(res.gnosis.divineSparkPneuma.length > 0);
  assert(res.gnosis.nagHammadiQuote.length > 0);
  const prompt = formatSupremeWisdomTrinityPrompt(res);
  assert(prompt.includes('LUCKEY 궁극의 영적 3위1체 마스터 지혜'));
  assert(prompt.includes(res.trinitySynthesisCore));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Sacred Vortex Geometry Engine: 황금비 영혼 수비학 & 보텍스 기하학 검증', () => {
  const res = calculateSacredVortexGeometry({ profile, targetDate: new Date('2026-11-04T10:00:00+09:00'), question: '영혼 기하학' });
  assert.equal(res.engineVersion, SACRED_VORTEX_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.vortexSynthesisMatrix?.integratedAction));
  assert(res.soulGeometryTitle.length > 0);
  assert(res.platonicSolid.solidName.length > 0);
  assert.equal('geometricFrequencyHz' in res.platonicSolid, false);
  assert(res.vortexDynamics.phiRatioAlignmentScore >= 0 && res.vortexDynamics.phiRatioAlignmentScore <= 100);
  const prompt = formatSacredVortexGeometryPrompt(res);
  assert(prompt.includes('LUCKEY 황금비 영혼 수비학 & 보텍스 기하학'));
  assert(prompt.includes(res.platonicSolid.solidName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert.doesNotMatch(prompt, /\bHz\b|Solfeggio|솔페지오|주파수/i);
});

test('Taoist Neidan Meridian Engine: 도교 내단 양생 & 진기 순환 경락 시계 검증', () => {
  const res = calculateTaoistNeidanMeridian({ profile, targetDate: new Date('2026-11-04T10:00:00+09:00'), question: '기혈 순환' });
  assert.equal(res.engineVersion, TAOIST_NEIDAN_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.neidanSynthesisMatrix?.integratedAction));
  assert(res.dantianArchetype.length > 0);
  assert(res.threeTreasures.jingLevelScore >= 0 && res.threeTreasures.jingLevelScore <= 100);
  assert(res.threeTreasures.qiLevelScore >= 0 && res.threeTreasures.qiLevelScore <= 100);
  assert(res.threeTreasures.shenLevelScore >= 0 && res.threeTreasures.shenLevelScore <= 100);
  assert(res.meridianCirculation.activeMeridianName.length > 0);
  assert(res.neidanBreathingPrescription.practiceSteps.length > 0);
  const prompt = formatTaoistNeidanMeridianPrompt(res);
  assert(prompt.includes('LUCKEY 도교 내단 양생 & 진기 순환 경락 시계'));
  assert(prompt.includes(res.dantianArchetype));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Synchronicity Omen Engine: 칼 융 동시성 징조 해독 & 오멘 매트릭스 검증', () => {
  const res = calculateSynchronicityOmen({ profile, targetDate: new Date('2026-11-04T10:00:00+09:00'), question: '우주의 징조' });
  assert.equal(res.engineVersion, SYNCHRONICITY_OMEN_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.synchronicitySynthesisMatrix?.integratedAction));
  assert(res.dominantOmenTheme.length > 0);
  assert(res.synchronicityChannel.primaryChannelName.length > 0);
  assert(['GREEN_ACCELERATE', 'AMBER_PAUSE_OBSERVE', 'GOLDEN_QUANTUM_LEAP'].includes(res.synchronicityChannel.manifestationSignal));
  assert(res.twentyFourHourWatchSymbols.length === 3);
  assert(res.synchronicityCaptureRitual.actionStep.length > 0);
  const prompt = formatSynchronicityOmenPrompt(res);
  assert(prompt.includes('LUCKEY 칼 융 동시성 징조 해독 & 오멘 매트릭스'));
  assert(prompt.includes(res.dominantOmenTheme));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Etheric Aura Biofield Engine: 에테르 오라 생체장 & 쉴딩 결계 검증', () => {
  const res = calculateEthericAuraBiofield({ profile, targetDate: new Date('2026-11-04T14:00:00+09:00') });
  assert.equal(res.engineVersion, ETHERIC_AURA_VERSION);
  assert(res.calculatedAtKst.endsWith('+09:00'));
  assert(res.interpretiveBoundary.length > 0);
  assert(res.auraBiofieldTitle.length > 0);
  assert(res.spectrum.primaryColor.length > 0);
  assert(res.shielding.integrityScore >= 0 && res.shielding.integrityScore <= 100);
  assert(res.shielding.vulnerableZone.length > 0);
  const prompt = formatEthericAuraBiofieldPrompt(res);
  assert(prompt.includes('LUCKEY 에테르 오라 생체장 & 쉴딩'));
  assert(prompt.includes('+09:00') && prompt.includes('해석 경계'));
  assert(prompt.includes(res.spectrum.primaryColor));
  assert(!prompt.includes('/100') && !prompt.includes('%'));
});

test('Saju Classic Yongshin Prescription Engine: 사주 정통 3대 원전 용신·격국·조후 검증', () => {
  const res = calculateSajuClassicYongshin({ profile, targetDate: new Date('2026-11-04T14:00:00+09:00') });
  assert.equal(res.engineVersion, SAJU_CLASSIC_YONGSHIN_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.yongshinSynthesisMatrix?.integratedAction));
  assert(res.yongshinMasterTitle.length > 0);
  assert(res.geokguk.geokgukName.length > 0);
  assert(['성격 (成格)', '파격 (破格)', '패중유성 (敗中有成)'].includes(res.geokguk.formationStatus));
  assert(res.johuClimate.vitalityClimateScore >= 0 && res.johuClimate.vitalityClimateScore <= 100);
  assert(res.prescription.luckyColors.length > 0);
  const prompt = formatSajuClassicYongshinPrompt(res);
  assert(prompt.includes('LUCKEY 정통 사주 3대 원전 용신·격국·조후 심층'));
  assert(prompt.includes(res.geokguk.geokgukName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Tarot Tree of Life Shadow Engine: 타로 카발라 생명나무 22경로 & 섀도우 미러 검증', () => {
  const res = calculateTarotTreeOfLifeShadow({ profile, targetDate: new Date('2026-11-04T14:00:00+09:00'), question: '그림자 통합' });
  assert.equal(res.engineVersion, TAROT_KABBALAH_SHADOW_VERSION);
  assert(res.calculatedAtKst.endsWith('KST'));
  assert(Boolean(res.kabbalahShadowSynthesisMatrix?.integratedAction));
  assert(res.tarotEsotericTitle.length > 0);
  assert(res.ascensionPath.pathNumber >= 11 && res.ascensionPath.pathNumber <= 32);
  assert(res.shadowMirror.consciousLightCard.length > 0);
  assert(res.shadowMirror.shadowBlindSpotCard.length > 0);
  assert(res.shadowMirror.transmutedSuperpower.length > 0);
  const prompt = formatTarotTreeOfLifeShadowPrompt(res);
  assert(prompt.includes('LUCKEY 타로 카발라 생명나무 & 섀도우 미러 심층'));
  assert(prompt.includes(res.shadowMirror.consciousLightCard));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Deterministic Engine: 15대 운명학 도구 전원 calculated 완료 및 신설 마스터 엔진 바인딩 검증', () => {
  const report = runDeterministicEngine({ profile, question: '내 인생 전체 종합 운세 봐줘' });
  assert(report.liurenMasterResult !== null && report.liurenMasterResult !== undefined);
  assert(report.ichingMasterResult !== null && report.ichingMasterResult !== undefined);
  assert(report.tarotMasterResult !== null && report.tarotMasterResult !== undefined);
  assert(report.heLuoLiShuResult !== null && report.heLuoLiShuResult !== undefined);
  assert(report.dynamicClashResult !== null && report.dynamicClashResult !== undefined);
  assert(report.twelveSpiritsResult !== null && report.twelveSpiritsResult !== undefined);
  assert(report.pythagoreanLifecycleResult !== null && report.pythagoreanLifecycleResult !== undefined);
  assert(report.astrologicalDecanSabianResult !== null && report.astrologicalDecanSabianResult !== undefined);
  assert(report.medicalBioMatrixResult !== null && report.medicalBioMatrixResult !== undefined);
  assert(report.wealthPipelineResult !== null && report.wealthPipelineResult !== undefined);
  assert(report.karmicNodesResult !== null && report.karmicNodesResult !== undefined);
  assert(report.mentalResilienceResult !== null && report.mentalResilienceResult !== undefined);
  assert(report.nobleNetworkResult !== null && report.nobleNetworkResult !== undefined);
  assert(report.voicePersonaResult !== null && report.voicePersonaResult !== undefined);
  assert(report.contractShieldResult !== null && report.contractShieldResult !== undefined);
  assert(report.lifeDomainWheelResult !== null && report.lifeDomainWheelResult !== undefined);
  assert(report.deepWorkFlowResult !== null && report.deepWorkFlowResult !== undefined);
  assert(report.sleepSubconsciousResult !== null && report.sleepSubconsciousResult !== undefined);
  assert(report.quantumLeapResult !== null && report.quantumLeapResult !== undefined);
  assert(report.elementalResonanceResult !== null && report.elementalResonanceResult !== undefined);
  assert(report.yinYangPolarityResult !== null && report.yinYangPolarityResult !== undefined);
  assert(report.runeMatrixResult !== null && report.runeMatrixResult !== undefined);
  assert(report.soulJourneyTarotResult !== null && report.soulJourneyTarotResult !== undefined);
  assert(report.transcendentalMeditationResult !== null && report.transcendentalMeditationResult !== undefined);
  assert(report.strategicLeverageResult !== null && report.strategicLeverageResult !== undefined);
  assert(report.shadowArchetypeResult !== null && report.shadowArchetypeResult !== undefined);
  assert(report.biorhythmPeakFlowResult !== null && report.biorhythmPeakFlowResult !== undefined);
  assert(report.destinySynastryEchoResult !== null && report.destinySynastryEchoResult !== undefined);
  assert(report.microHabitKarmaResult !== null && report.microHabitKarmaResult !== undefined);
  assert(report.ikigaiDestinyCompassResult !== null && report.ikigaiDestinyCompassResult !== undefined);
  assert(report.serendipitySynchronicityResult !== null && report.serendipitySynchronicityResult !== undefined);
  assert(report.humanDesignBodyGraphResult !== null && report.humanDesignBodyGraphResult !== undefined);
  assert(report.chakraVibrationAlignmentResult !== null && report.chakraVibrationAlignmentResult !== undefined);
  assert(report.enneagramSoulIntegrationResult !== null && report.enneagramSoulIntegrationResult !== undefined);
  assert(report.ancestralEpigeneticKarmaResult !== null && report.ancestralEpigeneticKarmaResult !== undefined);
  assert(report.shamanicAnimalTotemResult !== null && report.shamanicAnimalTotemResult !== undefined);
  assert(report.heroMythMonomythResult !== null && report.heroMythMonomythResult !== undefined);
  assert(report.akashicRecordsOracleResult !== null && report.akashicRecordsOracleResult !== undefined);
  assert(report.quantumProbabilisticTimelineResult !== null && report.quantumProbabilisticTimelineResult !== undefined);
  assert(report.somaticBodyArmoringResult !== null && report.somaticBodyArmoringResult !== undefined);
  assert(report.supremeWisdomTrinityResult !== null && report.supremeWisdomTrinityResult !== undefined);
  assert.equal(report.tools.liuren.status, 'calculated');
  assert.equal(report.tools.iching.status, 'calculated');
  assert.equal(report.tools.tarot.status, 'calculated');
  const enginePrompt = formatDeterministicEnginePrompt(report);
  assert(enginePrompt.includes('이번 질문의 계산 근거 및 한계'));
  assert(!enginePrompt.includes('100% 확정 수치'));
  assert(!enginePrompt.includes('영적 방패율:'));

});

test('Deterministic Engine: selective prompts contain only selected successful tool data', () => {
  const report = runDeterministicEngine({ profile, question: '그 사람 속마음', forceAllTools: true });
  const prompt = formatDeterministicEnginePrompt(report, { isMasterMobilization: false, focusTools: ['saju'] });
  const data = JSON.parse(prompt.split('[계산 상태 및 데이터 JSON]')[1].split('[JSON 끝]')[0]);
  assert.equal(data.length, 1);
  assert.equal(data[0].tool, '사주명리');
  assert.equal(data[0].status, 'calculated');
  assert(!prompt.includes('gunggungEuleulSpiritualShieldScore'));
});

test('Hellenistic Lots Engine: calculates Fortune, Spirit, Eros, Nemesis lots deterministically', () => {
  const p = { basic: { birthdate: '1995-05-15', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const rep = calculateHellenisticLots({ profile: p, targetDate: new Date('2026-11-15T06:45:00+09:00'), question: '커리어와 재물의 흐름이 궁금합니다.' });
  assert.equal(rep.engineVersion, HELLENISTIC_LOTS_ENGINE_VERSION);
  assert.equal(rep.isDayChart, true);
  assert(rep.lots.fortune.degree >= 0 && rep.lots.fortune.degree <= 360);
  assert(rep.lots.spirit.degree >= 0 && rep.lots.spirit.degree <= 360);
  assert(rep.lots.eros.degree >= 0 && rep.lots.eros.degree <= 360);
  assert(rep.lots.nemesis.degree >= 0 && rep.lots.nemesis.degree <= 360);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalLotsRhythm.hellenisticSectWindow.length > 0);
  assert(rep.lotsSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatHellenisticLotsPrompt(rep);
  assert(prompt.includes(HELLENISTIC_LOTS_ENGINE_VERSION));
  assert(prompt.includes('포르투나의 랏'));
  assert(prompt.includes('스피릿의 랏'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('I Ching 384 Yao Engine: calculates changing yao and quad-transformation hexagrams', () => {
  const rep = calculateIching384Yao({ question: '새로운 프로젝트 이직 타이밍 어떨까' });
  assert.equal(rep.engineVersion, ICHING_384YAO_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.ichingSynthesisMatrix?.integratedAction));
  assert(rep.changingYao.yaoPosition >= 1 && rep.changingYao.yaoPosition <= 6);
  assert(rep.originalHexagram.nameKo.length > 0);
  assert(rep.transformedHexagram.nameKo.length > 0);
  assert(rep.inverseHexagram.nameKo.length > 0);
  assert(rep.reversedHexagram.nameKo.length > 0);
  assert(rep.nuclearHexagram.nameKo.length > 0);
  const prompt = formatIching384YaoPrompt(rep);
  assert(prompt.includes(ICHING_384YAO_ENGINE_VERSION));
  assert(prompt.includes('교차 매트릭스'));
  assert(prompt.includes('지괘'));
  assert(prompt.includes('착괘'));
  assert(prompt.includes('종괘'));
  assert(prompt.includes('호괘'));
});

test('Lucy Episodic Memory Engine: extracts active threads, key people, and open follow-ups', () => {
  const sampleMemories = [
    {
      date: '2026-11-02',
      timestamp: Date.now() - 172800000,
      dialogueCount: 5,
      summary: '이직과 프로젝트 고민',
      userTopics: [
        '다음 주에 팀장님이랑 면접 결과 나오면 퇴사 면담 할까 봐',
        '그 사람한테 주말에 먼저 연락해볼까 고민 중이야',
        '요즘 너무 피곤해서 번아웃 온 것 같아'
      ]
    }
  ];

  const ledger = extractEpisodicMemoryLedger(sampleMemories);
  assert.equal(ledger.version, LUCY_EPISODIC_MEMORY_ENGINE_VERSION);
  assert(ledger.activeThreads.some(t => t.category === 'career_project'));
  assert(ledger.activeThreads.some(t => t.category === 'relationship_love'));
  assert(ledger.keyPeople.some(p => p.nameOrRole === '팀장님/직장상사'));
  assert(ledger.openFollowUps.length > 0);

  const prompt = buildLucyEpisodicMemoryPrompt('testAccount', '제제');
  assert(typeof prompt === 'string');
});

test('Saju Destiny Exporter: formats 9:16 Instagram Story viral caption correctly', () => {
  const dummyData: SajuDestinyStoryData = {
    name: '제제',
    birthdate: '1994-01-24',
    gender: 'male',
    pillars: {
      year: { gan: '甲', zhi: '戌', full: '甲戌', twelveStage: '양', ganKr: '갑', zhiKr: '술', elGan: '목', elZhi: '토', yinYangGan: '양', yinYangZhi: '양', tenGodGan: { name: '비견' } as any, tenGodZhi: { name: '편재' } as any, animal: '개' },
      month: { gan: '丁', zhi: '丑', full: '丁丑', twelveStage: '묘', ganKr: '정', zhiKr: '축', elGan: '화', elZhi: '토', yinYangGan: '음', yinYangZhi: '음', tenGodGan: { name: '상관' } as any, tenGodZhi: { name: '정재' } as any, animal: '소' },
      day: { gan: '庚', zhi: '申', full: '庚申', twelveStage: '건록', ganKr: '경', zhiKr: '신', elGan: '금', elZhi: '금', yinYangGan: '양', yinYangZhi: '양', tenGodGan: { name: '본원' } as any, tenGodZhi: { name: '비견' } as any, animal: '원숭이' },
      hour: { gan: '丙', zhi: '子', full: '丙子', twelveStage: '사', ganKr: '병', zhiKr: '자', elGan: '화', elZhi: '수', yinYangGan: '양', yinYangZhi: '양', tenGodGan: { name: '편관' } as any, tenGodZhi: { name: '상관' } as any, animal: '쥐' },
    },
    dayMaster: {
      gan: '庚',
      yinYang: '양',
      symbolName: '경금(庚金)',
      archetypeTitle: '단단한 강철의 혁신가',
      personalityEssence: '결단력과 강직한 의지',
      coreKeywords: ['결단', '혁신', '추진'],
      spiritualMission: '세상의 혼란을 정돈하고 새로운 틀을 세우는 사명',
      element: '금',
      hanja: '庚',
      korean: '경',
      mindsetAdvice: '스스로에게 지나치게 엄격하지 않기',
      wellnessFocus: '호흡기와 대장 웰니스',
    },
    elements: {
      counts: { 목: 1, 화: 2, 토: 2, 금: 2, 수: 1 },
      percentages: { 목: 12, 화: 25, 토: 25, 금: 25, 수: 13 },
      dominant: { element: '화', count: 2, name: '화(火)', advice: '열정을 지혜롭게 다스리세요.' },
      lacking: { element: '수', count: 1, name: '수(水)', remedy: '충분한 수분 섭취', luckyColor: '블랙/네이비', luckyFood: '해조류', luckyPlace: '물가/바다' },
      summary: '오행이 비교적 고르게 분포되어 조화를 이룹니다.',
    },
    prescription: {
      luckyColor: '네이비 블루',
      luckyFood: '따뜻한 둥굴레차',
      breakthroughAction: '결정한 일을 주저 없이 행동으로 옮기기',
    },
  };

  const text = formatSajuDestinyShareText(dummyData);
  assert(text.includes('제제님의 사주 만세력 운명 설계도'));
  assert(text.includes('경금(庚金)'));
  assert(text.includes('단단한 강철의 혁신가'));
  assert(text.includes('네이비 블루'));
  assert(text.includes('luckey.app'));
});

test('Saju Twelve Stages & Tomb Unlock Engine: calculates lifecycle vitality and tomb storages', () => {
  const rep = calculateSajuTwelveStagesTomb(profile);
  assert.equal(rep.engineVersion, SAJU_12STAGES_TOMB_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.tombSynthesisMatrix?.integratedAction));
  assert(rep.pillarsVitality.length === 4);
  assert(rep.peakVitalityStage.length > 0);
  const prompt = formatSajuTwelveStagesTombPrompt(rep);
  assert(prompt.includes(rep.peakVitalityStage) || prompt.includes('사주 12운성'));
  assert(prompt.includes('2026 병오년'));
  assert(prompt.includes('교차 매트릭스'));
});

test('Tarot Elemental Court Persona Engine: maps 16 court cards and 4 elemental balance', () => {
  const rep = calculateTarotElementalCourt(profile, '커리어 이직과 결단');
  assert.equal(rep.engineVersion, TAROT_ELEMENTAL_COURT_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.courtSynthesisMatrix?.integratedAction));
  assert(rep.activePersonaCourt.nameKo.length > 0);
  assert(rep.subconsciousShadowCourt.nameKo.length > 0);
  assert(rep.elementalBalance.firePercentage >= 0);
  const prompt = formatTarotElementalCourtPrompt(rep);
  assert(prompt.includes('타로 4대 원소'));
  assert(prompt.includes(rep.activePersonaCourt.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Karmic Synastry Resonance Engine: calculates interpersonal bond score and soul contract', () => {
  const rep = calculateKarmicSynastry(profile, null, '인연과 동반자');
  assert.equal(rep.engineVersion, KARMIC_SYNASTRY_VERSION);
  assert(rep.soulContractScore >= 0 && rep.soulContractScore <= 100);
  assert(rep.relationshipArchetype.length > 0);
  assert(rep.karmicSoulMission.length > 0);
  const prompt = formatKarmicSynastryPrompt(rep);
  assert(prompt.includes('카르믹 시나스트리'));
  assert(prompt.includes(rep.relationshipArchetype));
});

test('Five Emotions Pulse Engine: calculates five elements emotional harmony and prescriptions', () => {
  const rep = calculateFiveEmotionsPulse(profile, new Date('2026-11-15T07:25:00+09:00'), '불안과 스트레스를 다스리고 싶어');
  assert.equal(rep.engineVersion, FIVE_EMOTIONS_PULSE_VERSION);
  assert(rep.emotionPulses.length === 5);
  assert(rep.harmonyScore >= 0 && rep.harmonyScore <= 100);
  assert(rep.vulnerableOrgan.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalPulseRhythm.organMeridianWindow.length > 0);
  assert(rep.pulseSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatFiveEmotionsPulsePrompt(rep);
  assert(prompt.includes('오행 칠정'));
  assert(prompt.includes(rep.dominantEmotion));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Hermetic Kybalion Engine: maps 7 cosmic principles and alchemical shift', () => {
  const rep = calculateHermeticKybalion(profile, new Date('2026-11-15T05:00:00Z'), '직장 결정을 앞두고 불안합니다');
  assert.equal(rep.engineVersion, HERMETIC_KYBALION_VERSION);
  assert(rep.cosmicPrinciples.length === 7);
  assert(rep.principleAlignmentScore >= 0 && rep.principleAlignmentScore <= 100);
  assert(rep.masterPrinciple.nameKo.length > 0);
  assert(rep.situationalKybalionAudit.kybalionMaxim.length > 0);
  assert(rep.temporalPendulumRhythm.pendulumWindow.length > 0);
  assert(rep.kybalionSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatHermeticKybalionPrompt(rep);
  assert(prompt.includes('헤르메스 카이발리온'));
  assert(prompt.includes(rep.masterPrinciple.nameKo));
  assert.doesNotMatch(prompt, /\bHz\b|주파수|frequency/i);
  assert(!prompt.includes('%'));
});

test('Vibrational Soul Quest Engine: derives 4 core soul numbers and personal year quest', () => {
  const rep = calculateVibrationalSoulQuest(profile, new Date(), '올해의 영혼 방향');
  assert.equal(rep.engineVersion, VIBRATIONAL_SOUL_QUEST_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.soulQuestSynthesisMatrix?.integratedAction));
  assert(rep.soulNumbers.lifePathNumber >= 1);
  assert(rep.soulNumbers.personalYear >= 1 && rep.soulNumbers.personalYear <= 9);
  assert(rep.questArchetype.length > 0);
  assert.equal('frequencyHz' in rep.focusChakra, false);
  const prompt = formatVibrationalSoulQuestPrompt(rep);
  assert(prompt.includes('고대 수비학 차크라 솔 울림'));
  assert(prompt.includes(rep.questArchetype));
  assert(prompt.includes('교차 매트릭스'));
  assert.doesNotMatch(prompt, /\bHz\b|Solfeggio|솔페지오|주파수/i);
});

test('Alchemical Transmutation Engine: calculates 7 stages and 4 opus phases', () => {
  const rep = calculateAlchemicalTransmutation(profile, new Date('2026-11-15T05:00:00Z'), '직장 이직 결정이 불안합니다');
  assert.equal(rep.engineVersion, ALCHEMICAL_TRANSMUTATION_VERSION);
  assert(rep.currentStage.stageNumber >= 1 && rep.currentStage.stageNumber <= 7);
  assert(rep.transmutationPower >= 0 && rep.transmutationPower <= 100);
  assert(rep.primaMateria.length > 0);
  assert(rep.lapisPhilosophorum.length > 0);
  assert(rep.situationalAlchemicalAudit.hermeticQuote.length > 0);
  assert(rep.temporalOpusRhythm.alchemicalHourWindow.length > 0);
  assert(rep.opusSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatAlchemicalTransmutationPrompt(rep);
  assert(prompt.includes('연금술 7단계 영혼 변환'));
  assert(prompt.includes(rep.currentStage.nameKo));
  assert(!prompt.includes('% / 100%'));
});

test('Ziwei HuaJi Transformation Engine: maps stem hua-ji and breakthrough gift', () => {
  const rep = calculateZiweiHuaJiTransformation(profile);
  assert.equal(rep.engineVersion, ZIWEI_HUAJI_VERSION);
  assert(rep.huaJiStar.starNameKo.length > 0);
  assert(rep.resilienceIndex >= 0 && rep.resilienceIndex <= 100);
  assert(rep.transmutationStrategy.length > 0);
  const prompt = formatZiweiHuaJiTransformationPrompt(rep);
  assert(prompt.includes('자미두수 화기'));
  assert(prompt.includes(rep.huaJiStar.starNameKo));
});

test('Celtic Tree Ogham Engine: derives birth guardian tree and seasonal oracle', () => {
  const rep = calculateCelticTreeOgham(profile);
  assert.equal(rep.engineVersion, CELTIC_OGHAM_VERSION);
  assert(rep.calculatedAtKst.endsWith('+09:00'));
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.birthGuardianTree.nameTreeKo.length > 0);
  assert(rep.druidWisdomScore >= 0 && rep.druidWisdomScore <= 100);
  assert(rep.treeMedicinePrescription.length > 0);
  const prompt = formatCelticTreeOghamPrompt(rep);
  assert(prompt.includes('켈트 오검'));
  assert(prompt.includes(rep.birthGuardianTree.nameTreeKo));
  assert(prompt.includes('+09:00') && prompt.includes('해석 경계'));
  assert(!prompt.includes('/100') && !prompt.includes('점수'));
});

test('Taoist Sanbao Inner Alchemy Engine: calculates Jing-Qi-Shen and alchemy phase', () => {
  const rep = calculateTaoistSanbaoInnerAlchemy(profile, new Date(), '삼보 균형');
  assert.equal(rep.engineVersion, TAOIST_SANBAO_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.sanbaoSynthesisMatrix?.integratedAction));
  assert(rep.energyLevels.jing >= 0 && rep.energyLevels.jing <= 100);
  assert(rep.energyLevels.qi >= 0 && rep.energyLevels.qi <= 100);
  assert(rep.energyLevels.shen >= 0 && rep.energyLevels.shen <= 100);
  assert(rep.overallHarmonyScore >= 0 && rep.overallHarmonyScore <= 100);
  const prompt = formatTaoistSanbaoInnerAlchemyPrompt(rep);
  assert(prompt.includes('도교 내단학'));
  assert(prompt.includes(rep.dominantTreasure));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Tibetan Bardo Navigation Engine: maps 6 bardo states and clear light insight', () => {
  const rep = calculateTibetanBardoNavigation(profile, new Date('2026-11-16T08:00:00+09:00'), '전환기 방향');
  assert.equal(rep.engineVersion, TIBETAN_BARDO_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.bardoSynthesisMatrix?.integratedAction));
  assert(rep.currentBardoState.stateNo >= 1 && rep.currentBardoState.stateNo <= 6);
  assert(rep.awarenessClarityScore >= 0 && rep.awarenessClarityScore <= 100);
  assert(rep.clearLightRecognition.length > 0);
  const prompt = formatTibetanBardoNavigationPrompt(rep);
  assert(prompt.includes('티베트 불교 바르도'));
  assert(prompt.includes(rep.currentBardoState.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Mesopotamian Seven Gates Engine: calculates planetary gate and resurrection power', () => {
  const rep = calculateMesopotamianSevenGates(profile);
  assert.equal(rep.engineVersion, MESOPOTAMIAN_GATES_VERSION);
  assert(rep.activeGate.gateNumber >= 1 && rep.activeGate.gateNumber <= 7);
  assert(rep.sovereigntyResurrectionPower >= 0 && rep.sovereigntyResurrectionPower <= 100);
  assert(rep.liberationTask.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.sevenGatesSynthesisMatrix?.integratedAction));
  const prompt = formatMesopotamianSevenGatesPrompt(rep);
  assert(prompt.includes('고대 메소포타미아 7대 행성 관문'));
  assert(prompt.includes(rep.activeGate.gateNameAkkadian));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Egyptian 36 Decans Engine: calculates birth decan and stellar resonance', () => {
  const rep = calculateEgyptianThirtySixDecans({ profile });
  assert.equal(rep.engineVersion, EGYPTIAN_DECANS_VERSION);
  assert(rep.birthDecan.decanNumber >= 1 && rep.birthDecan.decanNumber <= 36);
  assert(rep.stellarResonanceScore >= 0 && rep.stellarResonanceScore <= 100);
  assert(rep.spiritualNavigationGuidance.length > 0);
  const prompt = formatEgyptianThirtySixDecansPrompt(rep);
  assert(prompt.includes('고대 이집트 36 데칸'));
  assert(prompt.includes(rep.birthDecan.guardianDeity));
  assert(!prompt.includes('/100') && !prompt.includes('점수'));
});

test('Sufi Seven Lataif Soul Ascension Engine: calculates spiritual station and heart purity', () => {
  const rep = calculateSufiLataifSoulAscension({ profile });
  assert.equal(rep.engineVersion, SUFI_LATAIF_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.lataifSynthesisMatrix?.integratedAction));
  assert.equal(rep.lataifCenters.length, 7);
  assert(rep.spiritualHeartPurityScore >= 0 && rep.spiritualHeartPurityScore <= 100);
  assert(rep.currentSpiritualStation.stationName.length > 0);
  const prompt = formatSufiLataifSoulAscensionPrompt(rep);
  assert(prompt.includes('정통 수피즘 심장의 7대 라타이프'));
  assert(prompt.includes(rep.dominantActiveCenter.koreanName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Mayan Tzolkin Sacred Calendar Engine: calculates 260 Kin and galactic resonance', () => {
  const rep = calculateMayanTzolkinSacredCalendar({ profile });
  assert.equal(rep.engineVersion, MAYAN_TZOLKIN_VERSION);
  assert(rep.birthKin.kinNumber >= 1 && rep.birthKin.kinNumber <= 260);
  assert(rep.todayKin.kinNumber >= 1 && rep.todayKin.kinNumber <= 260);
  assert(rep.galacticHarmonicResonanceScore >= 0 && rep.galacticHarmonicResonanceScore <= 100);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.tzolkinSynthesisMatrix?.integratedAction));
  const prompt = formatMayanTzolkinSacredCalendarPrompt(rep);
  assert(prompt.includes('고대 마야 촐킨'));
  assert(prompt.includes(rep.todayKin.kinFullName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Nordic Elder Futhark Runes Engine: calculates birth rune, norns trio and bindrune', () => {
  const rep = calculateNordicElderFutharkRunes({ profile });
  assert.equal(rep.engineVersion, NORDIC_RUNES_VERSION);
  assert(rep.birthRune.runeNumber >= 1 && rep.birthRune.runeNumber <= 24);
  assert(rep.nornsTrio.urdPast.runeNumber >= 1 && rep.nornsTrio.urdPast.runeNumber <= 24);
  assert(rep.nornsTrio.verdandiPresent.runeNumber >= 1 && rep.nornsTrio.verdandiPresent.runeNumber <= 24);
  assert(rep.nornsTrio.skuldFuture.runeNumber >= 1 && rep.nornsTrio.skuldFuture.runeNumber <= 24);
  assert(rep.cosmicWyrdResonanceScore >= 0 && rep.cosmicWyrdResonanceScore <= 100);
  assert(rep.bindruneTalisman.combinedRunes.length >= 2);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.runesSynthesisMatrix?.integratedAction));
  const prompt = formatNordicElderFutharkRunesPrompt(rep);
  assert(prompt.includes('북유럽 24 엘더 푸사르크 룬'));
  assert(prompt.includes(rep.birthRune.koreanName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Delphic Maxims Oracle Engine: calculates soul maxim, situational oracle and clarity', () => {
  const rep = calculateDelphicMaximsOracle({ profile, question: '결정과 약속의 기준' });
  assert.equal(rep.engineVersion, DELPHIC_MAXIMS_VERSION);
  assert(rep.coreSoulMaxim.maximIndex >= 1);
  assert(rep.situationalOracleMaxim.maximIndex >= 1);
  assert(rep.apollonianClarityScore >= 0 && rep.apollonianClarityScore <= 100);
  assert(rep.pythianOracleInsight.length > 0);
  assert(rep.temporalDelphicRhythm.calculatedAtKst.includes('KST'));
  assert(rep.situationalDelphicAudit.questionFocus.length > 0);
  const prompt = formatDelphicMaximsOraclePrompt(rep);
  assert(prompt.includes('고대 그리스 델포이 아폴론 신탁'));
  assert(prompt.includes(rep.coreSoulMaxim.greekText));
  assert(!prompt.includes('/ 100점'));
});

test('Ayurvedic Tridosha & Prana Engine: calculates prakriti, vikriti and subtle energies', () => {
  const rep = calculateAyurvedicTridoshaPrana({ profile, targetDate: new Date('2026-11-15T05:00:00Z'), question: '요즘 피로하고 잠이 잘 안 와요' });
  assert.equal(rep.engineVersion, AYURVEDIC_TRIDOSHA_VERSION);
  assert.equal(rep.questionFocus, 'health');
  assert(rep.prakritiConstitution.vata >= 0 && rep.prakritiConstitution.pitta >= 0 && rep.prakritiConstitution.kapha >= 0);
  assert.equal(rep.prakritiConstitution.vata + rep.prakritiConstitution.pitta + rep.prakritiConstitution.kapha, 100);
  assert(rep.subtleEnergies.pranaScore >= 0 && rep.subtleEnergies.tejasScore >= 0 && rep.subtleEnergies.ojasScore >= 0);
  assert(rep.dinacharya.pranayamaBreathing.length > 0);
  assert(rep.situationalAyurvedaAudit.charakaSutra.length > 0);
  assert(rep.temporalDinacharyaRhythm.doshaClockWindow.length > 0);
  assert(rep.tridoshaSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatAyurvedicTridoshaPranaPrompt(rep);
  assert(prompt.includes('인도 정통 아유르베다 3대 도샤'));
  assert(prompt.includes(rep.prakritiConstitution.dominantDosha));
  assert(!prompt.includes('점 / 100점'));
  assert(!prompt.includes('%'));
});

test('Hawaiian Huna & Ho\'oponopono Engine: calculates active principle, three selves balance and cleansing mantra', () => {
  const rep = calculateHawaiianHunaHooponopono({ profile, contextText: '관계의 화해와 내면 평화' });
  assert.equal(rep.engineVersion, HAWAIIAN_HUNA_VERSION);
  assert(rep.activePrinciple.hawaiianName.length > 0);
  assert(rep.activePrinciple.resonanceScore >= 0 && rep.activePrinciple.resonanceScore <= 100);
  assert(rep.threeSelves.unihipiliScore >= 0 && rep.threeSelves.uhaneScore >= 0 && rep.threeSelves.aumakuaScore >= 0);
  assert(rep.hooponopono.cleansingFocusTheme.length > 0);
  assert(rep.temporalHunaRhythm.calculatedAtKst.includes('KST'));
  assert(rep.situationalHunaAudit.questionFocus.length > 0);
  const prompt = formatHawaiianHunaHooponoponoPrompt(rep);
  assert(prompt.includes('고대 하와이 호오포노포노 & 후나 7대 원리'));
  assert(prompt.includes(rep.activePrinciple.hawaiianName));
  assert(!prompt.includes('/ 100점'));
  assert(!prompt.includes('점'));
});

test('Feng Shui Eight Mansions Engine: calculates kua number, east/west mansion and spatial directions', () => {
  const rep = calculateFengShuiEightMansions({ profile, contextText: '책상 배치와 업무 집중', now: new Date('2026-11-15T07:25:00+09:00') });
  assert.equal(rep.engineVersion, FENG_SHUI_EIGHT_MANSIONS_VERSION);
  assert(rep.kuaNumber >= 1 && rep.kuaNumber <= 9);
  assert(rep.auspiciousDirections.shengChi.length > 0);
  assert(rep.inauspiciousDirections.chuehMing.length > 0);
  assert(rep.prescription.deskFacingDirection.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalFengShuiRhythm.sunDirectionWindow.length > 0);
  assert(rep.fengShuiSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatFengShuiEightMansionsPrompt(rep);
  assert(prompt.includes('동양 정통 풍수 8택(八宅) 공간 에너지'));
  assert(prompt.includes(rep.kuaTrigram));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Zoroastrian Asha Truth Engine: calculates threefold path, sacred atar fire and ethical discernment', () => {
  const rep = calculateZoroastrianAshaTruth({ profile });
  assert.equal(rep.engineVersion, ZOROASTRIAN_ASHA_VERSION);
  assert(rep.ashaAlignmentScore >= 0 && rep.ashaAlignmentScore <= 100);
  assert(rep.threefoldPillars.humataScore >= 0 && rep.threefoldPillars.hukhtaScore >= 0 && rep.threefoldPillars.hvarshtaScore >= 0);
  assert(rep.sacredAtar.firePurityScore >= 0 && rep.sacredAtar.firePurityScore <= 100);
  assert(rep.discernment.truthAshaPath.length > 0);
  const prompt = formatZoroastrianAshaTruthPrompt(rep);
  assert(prompt.includes('고대 조로아스터교 아샤(Asha) 신성 우주 질서'));
  assert(prompt.includes(rep.discernment.currentTrialTheme));
});

test('DCE catalogue size is never substituted for successful calculation evidence', () => {
  const rep = runDeterministicEngine({ profile, coreOnly: true, focusTools: ['saju'] });
  const badges = getFiredEngineBadges(rep, { isMasterMobilization: false });
  assert.deepEqual(badges, ['계산 근거 · 사주명리']);
  assert(badges.length < ALL_DCE_ENGINES.length);
  rep.tools.saju.status = 'error';
  assert.deepEqual(getFiredEngineBadges(rep, { isMasterMobilization: false }), []);
});

test('Hindu Tantric Kundalini & Nadi Awakening Engine: calculates nadis, chakras, granthis and pranayama', () => {
  const rep = calculateHinduTantricKundalini({ profile });
  assert.equal(rep.engineVersion, HINDU_KUNDALINI_VERSION);
  assert(rep.primaryNadi.sanskritName.length > 0);
  assert(rep.kundaliniVitalityLevel >= 0 && rep.kundaliniVitalityLevel <= 100);
  assert(rep.granthis.length === 3);
  assert(rep.pranayama.primaryBreathwork.length > 0);
  const prompt = formatHinduTantricKundaliniPrompt(rep);
  assert(prompt.includes('힌두 탄트라 쿤달리니 7대 차크라 나디 각성 엔진'));
  assert(prompt.includes(rep.primaryNadi.sanskritName));
});

test('Guiguzi Liangtouqian Decision Matrix Engine: calculates two heads gua, destiny star and strategic matrix', () => {
  const rep = calculateGuiguziLiangtouqian({ profile, contextText: '사업 협상과 결정', referenceDate: new Date('2026-11-15T07:05:00+09:00') });
  assert.equal(rep.engineVersion, GUIGUZI_VERSION);
  assert(rep.guaStructure.yearStem.length > 0 && rep.guaStructure.hourStem.length > 0);
  assert(rep.guaStructure.patternName.length > 0);
  assert(rep.strategy.tacticalLabel.length > 0);
  assert(rep.strategicClarityScore >= 0 && rep.strategicClarityScore <= 100);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalGuiguziRhythm.zonghengWatchWindow.length > 0);
  assert(rep.guiguziSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatGuiguziLiangtouqianPrompt(rep);
  assert(prompt.includes('고대 중국 귀곡자(鬼谷子) 양구령 72변화 명리 결단 엔진'));
  assert(prompt.includes(rep.guaStructure.patternName));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Slavic Svarog Circle & Rod Ancestral Karma Engine: calculates svarog hall, rod karma blessing and elements', () => {
  const rep = calculateSlavicSvarogCircle({ profile });
  assert.equal(rep.engineVersion, SLAVIC_SVAROG_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.svarogSynthesisMatrix?.integratedAction));
  assert(rep.svarogHall.koreanName.length > 0);
  assert(rep.ancestralKarma.rodProtectionScore >= 0 && rep.ancestralKarma.rodProtectionScore <= 100);
  assert(rep.elements.dominantElement.length > 0);
  assert(rep.sacredRuneSymbol.symbolName.length > 0);
  const prompt = formatSlavicSvarogCirclePrompt(rep);
  assert(prompt.includes('고대 슬라브 16 스바로그 체계 & 로드(Rod) 가계 카르마 엔진'));
  assert(prompt.includes(rep.svarogHall.koreanName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100') && !prompt.includes('%'));
});

test('Essene Communion Tree Engine: calculates morning/evening angels, tree trinity and guidance', () => {
  const rep = calculateEsseneCommunion(profile, new Date('2026-11-15T05:55:00Z'), '마음의 평화와 치유');
  assert.equal(rep.engineVersion, ESSENE_COMMUNION_VERSION);
  assert(rep.morningEarthlyAngel.koreanName.length > 0);
  assert(rep.eveningHeavenlyAngel.koreanName.length > 0);
  assert(rep.communionVibrationalScore >= 0 && rep.communionVibrationalScore <= 100);
  assert(rep.temporalEsseneRhythm.calculatedAtKst.includes('KST'));
  assert(rep.situationalEsseneAudit.questionFocus.length > 0);
  const prompt = formatEsseneCommunionPrompt(rep);
  assert(prompt.includes('에세네파 14대 천사 교감 & 영혼 생명나무 조화 엔진'));
  assert(prompt.includes(rep.morningEarthlyAngel.koreanName));
  assert(!prompt.includes('점'));
});

test('Huangdi Five Movements & Six Qi Engine: calculates movements, heaven/earth rulers and medicine rx', () => {
  const rep = calculateHuangdiFiveMovementsSixQi(profile, new Date('2026-11-15T08:05:00+09:00'), '요즘 몸 컨디션과 식단이 궁금해');
  assert.equal(rep.engineVersion, HUANGDI_YUNQI_VERSION);
  assert(rep.fiveMovement.movementName.length > 0);
  assert(rep.sixQi.heavenRulerSiTian.length > 0);
  assert(rep.medicineRx.susceptibleOrgans.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalYunqiRhythm.organWatchWindow.length > 0);
  assert(rep.yunqiSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatHuangdiFiveMovementsSixQiPrompt(rep);
  assert(prompt.includes('황제명리(黃帝命理) & 오운육기(五運六氣) 천기 기상의학 엔진'));
  assert(prompt.includes(rep.birthYearGanZhi));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Pythagorean Tetraktys & Gematria Harmonics Engine: calculates root, 4 tiers and manifestation index', () => {
  const rep = calculatePythagoreanTetraktys(profile);
  assert.equal(rep.engineVersion, PYTHAGOREAN_TETRAKTYS_VERSION);
  assert(rep.harmonicSignature.soulRootNumber >= 1);
  assert(rep.realityManifestationIndex >= 0 && rep.realityManifestationIndex <= 100);
  assert(rep.tetraktysDistribution.dominantTier.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.tetraktysSynthesisMatrix?.integratedAction));
  const prompt = formatPythagoreanTetraktysPrompt(rep);
  assert(prompt.includes('피타고라스 테트락티스 10대 신성기하 & 게마트리아 엔진'));
  assert(prompt.includes(rep.harmonicSignature.sacredRatioName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Babylonian Enuma Elish & Tablets of Destiny Engine: calculates patron deity, edict and ordering index', () => {
  const rep = calculateBabylonianEnumaElish(profile, new Date('2026-11-15T05:00:00Z'), '중요한 결정을 앞두고 질서를 잡고 싶습니다');
  assert.equal(rep.engineVersion, BABYLONIAN_ENUMA_ELISH_VERSION);
  assert(rep.patronDeity.koreanName.length > 0);
  assert(rep.destinyEdict.soulSovereigntyScore >= 0 && rep.destinyEdict.soulSovereigntyScore <= 100);
  assert(rep.orderingIndex >= 0 && rep.orderingIndex <= 100);
  assert(rep.situationalBabylonAudit.enumaElishTablet.length > 0);
  assert(rep.temporalBabylonRhythm.zigguratWatchWindow.length > 0);
  assert(rep.babylonSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatBabylonianEnumaElishPrompt(rep);
  assert(prompt.includes('고대 바빌로니아 에누마 엘리쉬 & 운명의 서판'));
  assert(prompt.includes(rep.patronDeity.koreanName));
  assert(!prompt.includes('%'));
  assert(!prompt.includes('/100'));
});

test('Taoist Huangting Jing Internal Palaces Engine: calculates palaces, guardian spirit and prescription', () => {
  const rep = calculateTaoistHuangtingJing(profile, { question: '내면 양생' });
  assert.equal(rep.engineVersion, TAOIST_HUANGTING_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.huangtingSynthesisMatrix?.integratedAction));
  assert(rep.palaces.dominantPalace.length > 0);
  assert(rep.guardianSpirit.spiritName.length > 0);
  assert(rep.illuminationScore >= 0 && rep.illuminationScore <= 100);
  const prompt = formatTaoistHuangtingJingPrompt(rep);
  assert(prompt.includes('도교 상청파 황정경(黃庭經) 신체 오장 신성좌 & 존사 엔진'));
  assert(prompt.includes(rep.guardianSpirit.spiritName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Persian Amesha Spenta & Baresman Engine: calculates immortal, baresman scores and avestan guidance', () => {
  const rep = calculatePersianAmeshaSpenta(profile);
  assert.equal(rep.engineVersion, PERSIAN_AMESHA_SPENTA_VERSION);
  assert(rep.patronImmortal.koreanName.length > 0);
  assert(rep.totalRadianceScore >= 0 && rep.totalRadianceScore <= 100);
  assert(rep.baresman.twigsHarmonicState.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.ameshaSynthesisMatrix?.integratedAction));
  const prompt = formatPersianAmeshaSpentaPrompt(rep);
  assert(prompt.includes('고대 페르시아 바르숨 & 6대 아메샤 스펜타 조화 엔진'));
  assert(prompt.includes(rep.patronImmortal.koreanName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Sumerian Fifty Mes & Civilization Engine: calculates primary me, creation index and decree', () => {
  const rep = calculateSumerianFiftyMes(profile);
  assert.equal(rep.engineVersion, SUMERIAN_FIFTY_MES_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.fiftyMesSynthesisMatrix?.integratedAction));
  assert(rep.primaryMe.koreanName.length > 0);
  assert(rep.creationIndex >= 0 && rep.creationIndex <= 100);
  const prompt = formatSumerianFiftyMesPrompt(rep);
  assert(prompt.includes('고대 수메르 에리두 50대 메(Me) 신성 문명 규범 엔진'));
  assert(prompt.includes(rep.primaryMe.koreanName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Zhong-Lu Inner Alchemy & Three Immortals Engine: calculates stages, tier and kan-li qualitative posture', () => {
  const rep = calculateZhongLuInnerAlchemy(profile, '요즘 너무 지쳐서 회복하고 싶어요');
  assert.equal(rep.engineVersion, ZHONG_LU_INNER_ALCHEMY_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.zhongLuSynthesisMatrix?.integratedAction));
  assert.equal(rep.questionTheme, 'healing');
  assert(rep.immortalityTier.koreanTitle.length > 0);
  assert(rep.kanLiPosture.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  const prompt = formatZhongLuInnerAlchemyPrompt(rep);
  assert(prompt.includes('도교 종려권·여동빈 종여내단(鍾呂內丹) 3품 선도 & 환원 엔진'));
  assert(prompt.includes(rep.immortalityTier.koreanTitle));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('조화도:'));
});

test('Druid Thirteen Moon Trees & Ogham Engine: calculates birth tree, active tree and resonance', () => {
  const rep = calculateDruidMoonTrees(profile);
  assert.equal(rep.engineVersion, DRUID_MOON_TREES_VERSION);
  assert(rep.calculatedAtKst.endsWith('+09:00'));
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.birthTree.koreanName.length > 0);
  assert(rep.activeCycleTree.koreanName.length > 0);
  assert(rep.resonanceScore >= 0 && rep.resonanceScore <= 100);
  const prompt = formatDruidMoonTreesPrompt(rep);
  assert(prompt.includes('켈트 드루이드 13대 달나무(Moon Trees) & 오검 주술 엔진'));
  assert(prompt.includes(rep.birthTree.koreanName));
  assert(prompt.includes('+09:00') && prompt.includes('해석 경계'));
  assert(!prompt.includes('/100') && !prompt.includes('점수'));
});

test('Tieban Shenshu & Tai Xuan Numerology Engine: calculates inherent clause, affinity clause and accord', () => {
  const rep = calculateTiebanShenshu(profile, { question: '선천 운명과 시기' });
  assert.equal(rep.engineVersion, TIEBAN_SHENSHU_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.tiebanSynthesisMatrix?.integratedAction));
  assert(rep.inherentPrimeNumber > 0);
  assert(rep.kuaName.length > 0);
  assert(rep.inherentClause.clauseNumber >= 1 && rep.inherentClause.clauseNumber <= 12000);
  assert(rep.heavenlyAccordIndex >= 0 && rep.heavenlyAccordIndex <= 100);
  // 황극경세서 원회운세, 12율려, 3대 결단 윈도우 검증
  assert(rep.yuanHuiYunShi?.currentEpoch && rep.yuanHuiYunShi.currentEpoch.length > 0);
  assert(['개창운(開創運)', '융성운(隆盛運)', '수렴운(收斂運)', '정화운(淨化運)'].includes(rep.yuanHuiYunShi!.cyclicalPhase));
  assert(rep.yuanHuiYunShi!.resonanceScore >= 45 && rep.yuanHuiYunShi!.resonanceScore <= 98);
  assert(rep.naYinRhythmHarmony?.dominantTone && rep.naYinRhythmHarmony.dominantTone.length > 0);
  assert(rep.naYinRhythmHarmony!.pitchHarmonicsScore >= 40 && rep.naYinRhythmHarmony!.pitchHarmonicsScore <= 98);
  assert(rep.tacticalWindows?.earlyBreakthrough && rep.tacticalWindows.earlyBreakthrough.length > 0);
  assert(rep.tacticalWindows?.masterMotto.includes('數在天地 運在人心'));
  const prompt = formatTiebanShenshuPrompt(rep);
  assert(prompt.includes('고대 중국 철판신수(鐵板神數) 천기운명 조식 & 태현수비학 엔진'));
  assert(prompt.includes(rep.kuaName));
  assert(prompt.includes('원회운세'));
  assert(prompt.includes('12율려'));
  assert(prompt.includes('결단 윈도우'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Tibetan Bon Nine Ways & Five Soul Vitalities Engine: calculates active way, vitalities and mantra', () => {
  const rep = calculateTibetanBonNineWays(profile, { question: '영혼 정화와 균형' });
  assert.equal(rep.engineVersion, TIBETAN_BON_NINE_WAYS_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.bonSynthesisMatrix?.integratedAction));
  assert(rep.activeWay.tibetanName.length > 0);
  assert.equal(rep.vitalities.length, 5);
  assert(rep.primordialPurityIndex >= 0 && rep.primordialPurityIndex <= 100);
  const prompt = formatTibetanBonNineWaysPrompt(rep);
  assert(prompt.includes('티베트 정통 본교(Bon) 카르마 9승 & 5대 영혼 수호 융드룽 엔진'));
  assert(prompt.includes(rep.activeWay.koreanName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Eleusinian Mysteries Initiation & Rebirth Engine: calculates grade, station and rebirth score', () => {
  const rep = calculateEleusinianMysteries(profile);
  assert.equal(rep.engineVersion, ELEUSINIAN_MYSTERIES_VERSION);
  assert(rep.currentGrade.gradeTitle.length > 0);
  assert(rep.activeStation.stationName.length > 0);
  assert(rep.epoptiaRebirthScore >= 0 && rep.epoptiaRebirthScore <= 100);
  const prompt = formatEleusinianMysteriesPrompt(rep);
  assert(prompt.includes('고대 그리스 엘레우시스 신비주의(Eleusinian Mysteries) 영혼 입사의례 & 페르세포네 환원 엔진'));
  assert(prompt.includes(rep.currentGrade.gradeTitle));
});

test('Vedic Nakshatra 108 Pada Engine: calculates nakshatra, pada and dharma path score', () => {
  const rep = calculateVedicNakshatra108Pada(profile, new Date(), '카르마 소명');
  assert.equal(rep.engineVersion, VEDIC_NAKSHATRA_108_PADA_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.nakshatra108SynthesisMatrix?.integratedAction));
  assert(rep.nakshatraIndex >= 1 && rep.nakshatraIndex <= 27);
  assert(rep.pada >= 1 && rep.pada <= 4);
  assert(rep.totalPadaIndex >= 1 && rep.totalPadaIndex <= 108);
  assert(rep.dharmaPathScore >= 0 && rep.dharmaPathScore <= 100);
  const prompt = formatVedicNakshatra108PadaPrompt(rep);
  assert(prompt.includes('베다 27나크샤트라 & 108파다(Pada) 카르마 성좌 정밀 실측 데이터'));
  assert(prompt.includes(rep.nakshatraNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Vitality Curve Engine: calculates 12-stage biorhythm curve and synthesis matrix', () => {
  const rep = calculateVitalityCurve({ profile, question: '오늘 집중 시간대' });
  assert.equal(rep.engineVersion, VITALITY_CURVE_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.vitalitySynthesisMatrix?.integratedAction));
  assert.equal(rep.hourlyTideCurve.length, 12);
  const prompt = formatVitalityCurvePrompt(rep);
  assert(prompt.includes('12운성 바이오리듬 에너지 곡선'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Egyptian Hermetic Cartouche Engine: calculates divine cartouche and qualitative soul triad', () => {
  const rep = calculateEgyptianHermeticCartouche(profile, new Date('2026-11-14T01:00:00Z'), '이직 결정이 고민됩니다');
  assert.equal(rep.engineVersion, EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION);
  assert.equal(rep.questionFocus, 'decision');
  assert(rep.primaryCartoucheName.length > 0);
  assert(rep.triadHarmonyState.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.includes('예측이 아닙니다'));
  assert(rep.soulTriad.kaVitalityIndex >= 0 && rep.soulTriad.kaVitalityIndex <= 100);
  assert(rep.soulTriad.baIndividualityIndex >= 0 && rep.soulTriad.baIndividualityIndex <= 100);
  assert(rep.soulTriad.akhLuminousPurity >= 0 && rep.soulTriad.akhLuminousPurity <= 100);
  assert(rep.temporalHermeticRhythm.nileWatchWindow.length > 0);
  assert(rep.hermeticSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatEgyptianHermeticCartouchePrompt(rep);
  assert(prompt.includes('고대 이집트 헤르메스 카르투슈 & 영혼 3위일체 오라클 실측 데이터'));
  assert(prompt.includes(rep.primaryCartoucheName));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Taoist Gong Guo Ge Karma Engine: calculates merit domain and qualitative guidance', () => {
  const rep = calculateTaoistGongGuoGeKarma(profile, new Date(), '이직 결정을 어떻게 해야 할까요?');
  assert.equal(rep.engineVersion, TAOIST_GONG_GUO_GE_KARMA_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.gongGuoGeSynthesisMatrix?.integratedAction));
  assert.equal(rep.questionTheme, 'decision');
  assert(rep.meritDomain.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  const prompt = formatTaoistGongGuoGeKarmaPrompt(rep);
  assert(prompt.includes('도교 태상감응편(太上感應篇) & 공과격(功過格) 적선개운 성찰 리포트'));
  assert(prompt.includes(rep.meritDomain));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('점**'));
});

test('Yoruba Ifa Odu Engine: calculates 16 Meji Odu and Ebo guidance', () => {
  const rep = calculateYorubaIfaOdu({ profile });
  assert.equal(rep.engineVersion, YORUBA_IFA_ODU_ENGINE_VERSION);
  assert(rep.oduName.length > 0);
  assert(rep.destinyAlignmentScore >= 0 && rep.destinyAlignmentScore <= 100);
  const prompt = formatYorubaIfaOduPrompt(rep);
  assert(prompt.includes('서아프리카 요루바 이파(Ifá) 16 오두 & 오룬밀라 운명의 지혜 실측 데이터'));
  assert(prompt.includes(rep.oduName));
});

test('Arabic Ilm al-Raml Engine: calculates 16 geomantic figures and Qadi verdict', () => {
  const rep = calculateArabicIlmAlRaml({ profile, targetDate: new Date('2026-11-15T08:15:00+09:00'), question: '이 계약 진행해도 될까요?' });
  assert.equal(rep.engineVersion, ARABIC_ILM_AL_RAML_ENGINE_VERSION);
  assert(rep.figureNameLatin.length > 0);
  assert(rep.earthResonanceIndex >= 0 && rep.earthResonanceIndex <= 100);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalRamlRhythm.geomanticWatchWindow.length > 0);
  assert(rep.ramlSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatArabicIlmAlRamlPrompt(rep);
  assert(prompt.includes('고대 아랍 일무 알-람말(‘Ilm al-Raml) 16 형상 & 지오맨시(Geomancy) 지혜 실측 데이터'));
  assert(prompt.includes(rep.figureNameLatin));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));

  const brehon = calculateCelticBrehonLaw(profile, new Date('2026-11-15T08:15:00+09:00'), '계약 분쟁을 어떻게 풀어야 할까요?');
  assert.equal(brehon.engineVersion, CELTIC_BREHON_LAW_VERSION);
  assert(brehon.calculatedAtKst.includes('KST'));
  assert(brehon.temporalBrehonRhythm.groveCourtWindow.length > 0);
  const brehonPrompt = formatCelticBrehonLawPrompt(brehon);
  assert(brehonPrompt.includes('KST'));
  assert(!brehonPrompt.includes('/100') && !brehonPrompt.includes('%') && !brehonPrompt.includes('점수'));
});

test('Hindu Nadi Agastya Palm Leaf Engine: calculates 14 Kandams and Shanti Parikharam', () => {
  const rep = calculateHinduNadiAgastyaPalmLeaf({ profile });
  assert.equal(rep.engineVersion, HINDU_NADI_AGASTYA_PALM_LEAF_ENGINE_VERSION);
  assert(rep.activeKandamNumber >= 1 && rep.activeKandamNumber <= 14);
  assert(rep.dharmaFulfillmentIndex >= 0 && rep.dharmaFulfillmentIndex <= 100);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.nadiSynthesisMatrix?.integratedAction));
  const prompt = formatHinduNadiAgastyaPalmLeafPrompt(rep);
  assert(prompt.includes('남인도 나디 점성술(Nadi Astrology) & 아가스티야 야자잎 14 칸담 실측 데이터'));
  assert(prompt.includes(rep.kandamName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Shinto Kotodama Four Souls Engine: calculates Ichirei Shikon balance and Kotodama chant', () => {
  const rep = calculateShintoKotodama({ profile });
  assert.equal(rep.engineVersion, SHINTO_KOTODAMA_FOUR_SOULS_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.shintoSynthesisMatrix?.integratedAction));
  assert(rep.naohiPurityIndex >= 0 && rep.naohiPurityIndex <= 100);
  assert(rep.fourSouls.dominantSoul.length > 0);
  const prompt = formatShintoKotodamaPrompt(rep);
  assert(prompt.includes('고대 일본 신도 고토다마(言霊) 50음령 & 4혼1생(四魂一志) 영혼 조화 실측 데이터'));
  assert(prompt.includes(rep.fourSouls.dominantSoul));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100') && !prompt.includes('100점'));
});

test('Aboriginal Dreamtime Songlines Engine: calculates ancestral totem and Kurunpa index', () => {
  const rep = calculateAboriginalDreamtimeSonglines({ profile });
  assert.equal(rep.engineVersion, ABORIGINAL_DREAMTIME_SONGLINES_ENGINE_VERSION);
  assert(rep.kurunpaLifeForceIndex >= 0 && rep.kurunpaLifeForceIndex <= 100);
  assert(rep.activeTotem.name.length > 0);
  const prompt = formatAboriginalDreamtimeSonglinesPrompt(rep);
  assert(prompt.includes('호주 원주민 드림타임(Dreamtime) 송라인 & 8대 토템 영혼 나침반'));
  assert(prompt.includes(rep.activeTotem.name));
  assert(!prompt.includes('/100') && !prompt.includes('점수'));
});

test('Finnish Kalevala Sampo Engine: calculates 3 Sampo wings and Sisu resilience index', () => {
  const rep = calculateFinnishKalevalaSampo({ profile });
  assert.equal(rep.engineVersion, FINNISH_KALEVALA_SAMPO_ENGINE_VERSION);
  assert(rep.sisuResilienceIndex >= 0 && rep.sisuResilienceIndex <= 100);
  assert(rep.sampoBalance.dominantWing.length > 0);
  const prompt = formatFinnishKalevalaSampoPrompt(rep);
  assert(prompt.includes('고대 핀란드 칼레발라(Kalevala) 삼포(Sampo) & 9대 룬가 실측 데이터'));
  assert(prompt.includes(rep.sampoBalance.dominantWing));
  assert(!prompt.includes('/ 100') && !prompt.includes('점수'));
});

test('Shanhaijing Sacred Beasts Engine: calculates directional beast and shielding index', () => {
  const rep = calculateShanhaijingSacredBeasts({ profile });
  assert.equal(rep.engineVersion, SHANHAIJING_SACRED_BEASTS_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.shanhaijingSynthesisMatrix?.integratedAction));
  assert(rep.spiritualShieldingIndex >= 0 && rep.spiritualShieldingIndex <= 100);
  assert(rep.activeBeast.name.length > 0);
  const prompt = formatShanhaijingSacredBeastsPrompt(rep);
  assert(prompt.includes('고대 동양 산해경(山海經) 8방위 신성 영수(神獸) & 오행 방호 실측 데이터'));
  assert(prompt.includes(rep.activeBeast.name));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100') && !prompt.includes('/ 100'));
});

test('Jain Gunasthana Karma Engine: calculates 14 Gunasthanas and Ratnatraya balance', () => {
  const rep = calculateJainGunasthanaKarma({ profile, question: '관계와 마음의 평화를 찾고 싶습니다.' });
  assert.equal(rep.engineVersion, JAIN_GUNASTHANA_KARMA_ENGINE_VERSION);
  assert(rep.ahimsaPeaceIndex >= 0 && rep.ahimsaPeaceIndex <= 100);
  assert(rep.ratnatraya.dominantTreasure.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalJainRhythm.samayikaWindow.length > 0);
  assert(rep.jainSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatJainGunasthanaKarmaPrompt(rep);
  assert(prompt.includes('고대 인도 자이나교 14 군아스타나 & 삼보(Ratnatraya) 카르마 실측 데이터'));
  assert(prompt.includes(rep.activeStage.stageNameKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/ 100') && !prompt.includes('점수') && !prompt.includes('점'));
});

test('Celtic Awen Taliesin Engine: calculates Awen 3 rays and metamorphosis phase', () => {
  const rep = calculateCelticAwenTaliesin({ profile });
  assert.equal(rep.engineVersion, CELTIC_AWEN_TALIESIN_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('+09:00'));
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.awenFlowIndex >= 0 && rep.awenFlowIndex <= 100);
  assert(rep.awenRays.dominantRay.length > 0);
  const prompt = formatCelticAwenTaliesinPrompt(rep);
  assert(prompt.includes('고대 켈트 바드 탈리에신(Taliesin) 가마솥 & 아웬(Awen) 영감 실측 데이터'));
  assert(prompt.includes(rep.activeMetamorphosis.animalTotem));
  assert(prompt.includes('+09:00') && prompt.includes('해석 경계'));
  assert(!prompt.includes('/ 100') && !prompt.includes('점수'));
});

test('Tarot Yes/No Verdict: correctly identifies NO when reading content is NO despite heading options', () => {
  const sampleReading = `[핵심 3줄 요약]
- [현재 에너지] 중요한 갈림길에 서 있으며 신중한 검토가 필요합니다.
- [방향과 결단] 최종 판정은 [NO]이며, 무리한 진행보다 변수 점검과 호흡 조율이 필요합니다.
- [실천 행동] 오늘 할 일을 목록으로 정리하고 우선순위를 다시 세우세요.

### 🎯 3. 트리니티 마스터의 직관적 결단과 최종 판정
**최종 판정: [NO]**
3번 카드는 역방향으로 놓여 있어 지금은 서두르지 말고 잠시 멈추어야 함을 가리킵니다.`;

  const lines = sampleReading.split('\n');
  const explicitVerdictRegex = /(?:최종\s*판정|마스터의\s*최종\s*결단|마스터의\s*최종\s*판정|방향과\s*결단)\s*(?:은|는|이|가|[:—\-])?\s*(?:\*\*)?\s*\[?\s*(조건부\s*YES|확실한\s*YES|YES|단호한\s*NO|NO)\s*\]?(?!\s*[\/|또는|or])/i;
  const matches: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') && (trimmed.includes('/') || trimmed.includes('또는') || trimmed.includes(' or '))) continue;
    const m = trimmed.match(explicitVerdictRegex);
    if (m && m[1]) matches.push(m[1].trim().toUpperCase());
  }

  assert(matches.includes('NO'), 'Must detect NO in explicit declarations');
  assert(!matches.includes('YES'), 'Must NOT detect YES when content is NO');
});

test('Korean Dangun Cheonbuin Engine: calculates 3 Sacred Treasures and Hongik prosperity index', () => {
  const rep = calculateKoreanDangunCheonbuin({ profile, question: '사업 결단과 조화', now: new Date('2026-11-15T06:55:00+09:00') });
  assert.equal(rep.engineVersion, KOREAN_DANGUN_CHEONBUIN_ENGINE_VERSION);
  assert(rep.hongikProsperityIndex >= 0 && rep.hongikProsperityIndex <= 100);
  assert(rep.cosmicHarmonyIndex >= 0 && rep.cosmicHarmonyIndex <= 100);
  assert(rep.treasures.dominantTreasure.nameKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalCheonbuinRhythm.shinsiSkyWindow.length > 0);
  assert(rep.cheonbuinSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatKoreanDangunCheonbuinPrompt(rep);
  assert(prompt.includes('고대 한국 삼국유사 단군 천부인(天符印) 3보 & 홍익인간 광명 실측 데이터'));
  assert(prompt.includes(rep.treasures.dominantTreasure.nameKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Maori Mauri Hauora Engine: calculates 4 Hauora pillars and Mauri vitality index', () => {
  const rep = calculateMaoriMauriHauora({ profile });
  assert.equal(rep.engineVersion, MAORI_MAURI_HAUORA_ENGINE_VERSION);
  assert(rep.mauriVitalityIndex >= 0 && rep.mauriVitalityIndex <= 100);
  assert(rep.manaSovereigntyScore >= 0 && rep.manaSovereigntyScore <= 100);
  assert(rep.pillars.dominantPillar.nameMaori.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.maoriSynthesisMatrix?.integratedAction));
  const prompt = formatMaoriMauriHauoraPrompt(rep);
  assert(prompt.includes('고대 마오리 하우오라 4대 기둥 & 마우리(Mauri) 생명력 실측 데이터'));
  assert(prompt.includes(rep.pillars.dominantPillar.nameMaori));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Slavic Mokosh Fate Weaving Engine: calculates Dolya/Nedolya fate threads and fertility index', () => {
  const rep = calculateSlavicMokoshFateWeaving({ profile });
  assert.equal(rep.engineVersion, SLAVIC_MOKOSH_FATE_WEAVING_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.mokoshSynthesisMatrix?.integratedAction));
  assert(rep.earthFertilityIndex >= 0 && rep.earthFertilityIndex <= 100);
  assert(rep.fateTensionScore >= 0 && rep.fateTensionScore <= 100);
  assert(rep.threads.dolya.strength > 0);
  const prompt = formatSlavicMokoshFateWeavingPrompt(rep);
  assert(prompt.includes('고대 슬라브 모코시(Mokosh) 운명의 실타래 & 대지 모성 실측 데이터'));
  assert(prompt.includes(rep.threads.dolya.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100') && !prompt.includes('%'));
});

test('Sumerian Gilgamesh Trials Engine: calculates 12 trials and heroic resilience score', () => {
  const rep = calculateSumerianGilgameshTrials({ profile });
  assert.equal(rep.engineVersion, SUMERIAN_GILGAMESH_TRIALS_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.gilgameshSynthesisMatrix?.integratedAction));
  assert(rep.heroicResilienceScore >= 0 && rep.heroicResilienceScore <= 100);
  assert(rep.immortalityWisdomIndex >= 0 && rep.immortalityWisdomIndex <= 100);
  assert(rep.activeTrial.nameKo.length > 0);
  const prompt = formatSumerianGilgameshTrialsPrompt(rep);
  assert(prompt.includes('고대 메소포타미아 길가메시 서사시 12관문 불멸 여정 실측 데이터'));
  assert(prompt.includes(rep.activeTrial.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Hawaiian Kahuna Three Selves Engine: calculates 3 selves harmony and mana resonance score', () => {
  const rep = calculateHawaiianKahunaThreeSelves({ profile, question: '마음의 안정과 실행' });
  assert.equal(rep.engineVersion, HAWAIIAN_KAHUNA_THREE_SELVES_ENGINE_VERSION);
  assert(rep.manaResonanceScore >= 0 && rep.manaResonanceScore <= 100);
  assert(rep.unihipili.currentVitality > 0);
  assert(rep.uhane.currentVitality > 0);
  assert(rep.aumakua.currentVitality > 0);
  assert(rep.temporalKahunaRhythm.calculatedAtKst.includes('KST'));
  assert(rep.situationalKahunaAudit.questionFocus.length > 0);
  const prompt = formatHawaiianKahunaThreeSelvesPrompt(rep);
  assert(prompt.includes('고대 하와이 카후나 3대 자아 & 마나 공명 실측 데이터'));
  assert(prompt.includes(rep.unihipili.dominantNeedOrBlock));
  assert(!prompt.includes('/ 100점'));
  assert(!prompt.includes('점 '));
});

test('Nordic Yggdrasil Nine Realms Engine: calculates dominant realm and Bifrost clearance', () => {
  const rep = calculateNordicYggdrasilRealms({ profile });
  assert.equal(rep.engineVersion, NORDIC_YGGDRASIL_NINE_REALMS_ENGINE_VERSION);
  assert(rep.yggdrasilAxisAlignmentScore >= 0 && rep.yggdrasilAxisAlignmentScore <= 100);
  assert(rep.bifrostBridgeClearance >= 0 && rep.bifrostBridgeClearance <= 100);
  assert(rep.dominantRealm.nameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.yggdrasilSynthesisMatrix?.integratedAction));
  const prompt = formatNordicYggdrasilRealmsPrompt(rep);
  assert(prompt.includes('고대 북유럽 세계수 위그드라실(Yggdrasil) 9대 영역 실측 데이터'));
  assert(prompt.includes(rep.dominantRealm.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Egyptian Maat Feather Heart Engine: calculates heart lightness and Maat verdict', () => {
  const rep = calculateEgyptianMaatFeatherHeart({ profile, question: '이직 결정을 앞두고 마음이 무거워요' });
  assert.equal(rep.engineVersion, EGYPTIAN_MAAT_FEATHER_ENGINE_VERSION);
  assert.equal(rep.questionTheme, 'decision');
  assert(rep.heartLightnessScore >= 0 && rep.heartLightnessScore <= 100);
  assert(rep.balanceState.length > 0);
  assert(rep.weighingVerdict.length > 0);
  assert(rep.activeNegativeConfessionVirtue.length > 0);
  assert(rep.symbolicGuard.anubisRole.length > 0 && rep.symbolicGuard.thothRole.length > 0);
  assert(rep.practiceGuidance.length > 0 && rep.ritualAction.length > 0 && rep.boundaryNotice.length > 0);
  const prompt = formatEgyptianMaatFeatherHeartPrompt(rep);
  assert(prompt.includes('고대 이집트 마아트(Ma\'at) 진리의 깃털 & 심장 무게 측정 실측 데이터'));
  assert(prompt.includes(rep.activeNegativeConfessionVirtue));
  assert(prompt.includes(rep.practiceGuidance));
  assert(!prompt.includes('/100') && !prompt.includes('점수'));
});

test('Persian Mithraic Seven Spheres Engine: calculates Mithraic grade and Sol Invictus score', () => {
  const rep = calculatePersianMithraicSpheres({ profile });
  assert.equal(rep.engineVersion, PERSIAN_MITHRAIC_SPHERES_ENGINE_VERSION);
  assert(rep.solInvictusScore >= 0 && rep.solInvictusScore <= 100);
  assert(rep.astralLadderAscensionRate >= 0 && rep.astralLadderAscensionRate <= 100);
  assert(rep.activeGrade.gradeLevel >= 1 && rep.activeGrade.gradeLevel <= 7);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.mithraicSynthesisMatrix?.integratedAction));
  const prompt = formatPersianMithraicSpheresPrompt(rep);
  assert(prompt.includes('고대 페르시아 미트라(Mithra) 7대 행성 입문 천계 사다리 실측 데이터'));
  assert(prompt.includes(rep.activeGrade.gradeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Orpheic Mysteries Engine: calculates memory well awakening and Dionysian ecstasy vitality', () => {
  const rep = calculateOrpheicMysteries({ profile, question: '연애 관계에서 내 중심을 잃지 않으려면 어떻게 해야 할까요?' });
  assert.equal(rep.engineVersion, ORPHEIC_MYSTERIES_ENGINE_VERSION);
  assert.equal(rep.questionTheme, 'relationship');
  assert(rep.memoryWellAwakeningScore >= 0 && rep.memoryWellAwakeningScore <= 100);
  assert(rep.dionysianEcstasyVitality >= 0 && rep.dionysianEcstasyVitality <= 100);
  assert(rep.thresholdState.length > 0);
  assert(rep.polarityArchetype.nameKo.length > 0);
  assert(rep.divineLineageDeclaration.length > 0);
  assert(rep.practiceGuidance.length > 0 && rep.ritualAction.length > 0 && rep.boundaryNotice.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.orphicSynthesisMatrix?.integratedAction));
  const prompt = formatOrpheicMysteriesPrompt(rep);
  assert(prompt.includes('고대 그리스 오르페우스 신비주의 & 므네모시네 기억의 샘 실측 데이터'));
  assert(prompt.includes(rep.goldTabletPassportCode));
  assert(prompt.includes(rep.practiceGuidance));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Popol Vuh Hero Twins Engine: calculates active trial house and qualitative transformation', () => {
  const rep = calculatePopolVuhHeroTwins({ profile, question: '연애 갈등을 어떻게 풀어야 할까요?' });
  assert.equal(rep.engineVersion, MESOAMERICAN_POPOL_VUH_ENGINE_VERSION);
  assert.equal(rep.questionTheme, 'relationship');
  assert(rep.activeTrialHouse.houseNumber >= 1 && rep.activeTrialHouse.houseNumber <= 6);
  assert(rep.activeTrialHouse.houseNameKo.length > 0);
  assert(rep.twinArchetype.twinName.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.popolVuhSynthesisMatrix?.integratedAction));
  const prompt = formatPopolVuhHeroTwinsPrompt(rep);
  assert(prompt.includes('고대 마야 포폴 부(Popol Vuh) 쌍둥이 영웅 & 시발바 시련 돌파 실측 데이터'));
  assert(prompt.includes(rep.activeTrialHouse.houseNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ancient Yarrow I Ching Probability Engine: calculates dominant yao and Dayan alignment score', () => {
  const rep = calculateAncientYarrowProbability({ profile, question: '요즘 너무 지치고 불안해서 쉬고 싶어요', now: new Date('2026-11-15T07:15:00+09:00') });
  assert.equal(rep.engineVersion, ANCIENT_YARROW_PROBABILITY_ENGINE_VERSION);
  assert.equal(rep.questionTheme, 'healing');
  assert([6, 7, 8, 9].includes(rep.dominantYaoValue));
  assert.equal(rep.remainingStalks, rep.dominantYaoValue * 4);
  assert.equal(rep.isChangingLine, rep.dominantYaoValue === 6 || rep.dominantYaoValue === 9);
  assert(rep.dayanAlignmentScore >= 0 && rep.dayanAlignmentScore <= 100);
  assert(rep.yaoNameKo.length > 0);
  assert(rep.timelinessPosture.length > 0);
  assert(rep.practiceGuidance.length > 0 && rep.ritualAction.length > 0 && rep.boundaryNotice.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalYarrowRhythm.dayanWatchWindow.length > 0);
  assert(rep.yarrowSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatAncientYarrowProbabilityPrompt(rep);
  assert(prompt.includes('고대 중국 주역 대연지수 49책 시초점 확률 실측 데이터'));
  assert(prompt.includes(rep.yaoNameKo));
  assert(prompt.includes(rep.practiceGuidance));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Vedic Pancha Kosha Engine: calculates 5 layers alignment and Atman realization index', () => {
  const rep = calculateVedicPanchaKosha({ profile });
  assert.equal(rep.engineVersion, VEDIC_PANCHA_KOSHA_ENGINE_VERSION);
  assert.equal(rep.layers.length, 5);
  assert(rep.atmanRealizationIndex >= 0 && rep.atmanRealizationIndex <= 100);
  assert(rep.lowestAlignedLayer.layerIndex >= 1 && rep.lowestAlignedLayer.layerIndex <= 5);
  const prompt = formatVedicPanchaKoshaPrompt(rep);
  assert(prompt.includes('고대 인도 베단타 5대 코샤(Pancha Kosha) 층위별 정렬 실측 데이터'));
  assert(prompt.includes(rep.lowestAlignedLayer.koshaNameKo));
});

test('Roman Janus Engine: calculates qualitative threshold balance and active gateway', () => {
  const rep = calculateRomanJanus({ profile, question: '새로운 시작을 선택해야 할까요?' });
  assert.equal(rep.engineVersion, ROMAN_JANUS_ENGINE_VERSION);
  assert.equal(rep.questionFocus, 'decision');
  assert(rep.pastClosureScore >= 0 && rep.pastClosureScore <= 100);
  assert(rep.futureReadinessScore >= 0 && rep.futureReadinessScore <= 100);
  assert(rep.activeJanusGateway.gatewayNumber >= 1 && rep.activeJanusGateway.gatewayNumber <= 4);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.boundaryNotice.includes('예측이 아닙니다'));
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.janusSynthesisMatrix?.integratedAction));
  const prompt = formatRomanJanusPrompt(rep);
  assert(prompt.includes('고대 로마 야누스(Janus) 2대 얼굴 시공간 문턱 & 새출발 실측 데이터'));
  assert(prompt.includes(rep.activeJanusGateway.gatewayNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Baopuzi Ge Hong Nine Turn Elixir Engine: calculates alchemy rank and vitality', () => {
  const rep = calculateBaopuziElixirs({ profile, question: '체력이 떨어지고 피곤해요', now: new Date('2026-11-15T05:00:00Z') });
  assert.equal(rep.engineVersion, BAOPUZI_ELIXIRS_ENGINE_VERSION);
  assert.equal(rep.questionFocus, 'health');
  assert(rep.alchemicalRefinementLevel >= 1 && rep.alchemicalRefinementLevel <= 9);
  assert(rep.vitalityPreservationScore >= 0 && rep.vitalityPreservationScore <= 100);
  assert(rep.activeElixirPhase.elixirNameKo.length > 0);
  assert(rep.situationalBaopuziAudit.baopuziVerse.length > 0);
  assert(rep.temporalElixirRhythm.shichenWindow.length > 0);
  assert(rep.baopuziSynthesisMatrix.synthesizedGuidance.length > 0);
  const prompt = formatBaopuziElixirsPrompt(rep);
  assert(prompt.includes('고대 도교 포박자(抱朴子) 갈홍 구전환단(九轉還丹) 무병장수 실측 데이터'));
  assert(prompt.includes(rep.activeElixirPhase.elixirNameKo));
  assert(!prompt.includes('/100'));
});

test('Vedic Mahavakya Consciousness Engine: calculates qualitative Brahman contemplation', () => {
  const rep = calculateVedicMahavakya({ profile, question: '가까운 사람과의 관계가 서운합니다' });
  assert.equal(rep.engineVersion, VEDIC_MAHAVAKYA_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.mahavakyaSynthesisMatrix?.integratedAction));
  assert.equal(rep.questionFocus, 'relationship');
  assert(rep.brahmanRealizationScore >= 0 && rep.brahmanRealizationScore <= 100);
  assert(rep.innerSohamResonance >= 0 && rep.innerSohamResonance <= 100);
  assert(rep.activeMahavakya.sanskritPhrase.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.boundaryNotice.includes('예측이 아닙니다'));
  const prompt = formatVedicMahavakyaPrompt(rep);
  assert(prompt.includes('고대 인도 베다 우파니샤드 4대 마하바키야(Mahāvākya) 대선언 실측 데이터'));
  assert(prompt.includes(rep.activeMahavakya.sanskritPhrase));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Sumerian Apkallu Wisdom Engine: calculates 7 sages resonance and Apsu clarity', () => {
  const rep = calculateSumerianApkalluWisdom({ profile });
  assert.equal(rep.engineVersion, SUMERIAN_APKALLU_WISDOM_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.apkalluSynthesisMatrix?.integratedAction));
  assert(rep.apkalluResonanceScore >= 0 && rep.apkalluResonanceScore <= 100);
  assert(rep.apsuClarityIndex >= 0 && rep.apsuClarityIndex <= 100);
  assert(rep.activeSage.nameKo.length > 0);
  const prompt = formatSumerianApkalluWisdomPrompt(rep);
  assert(prompt.includes('고대 수메르 에리두 엔키(Enki) 7대 압갈루(Apkallu) 현자 신성 지혜 실측 데이터'));
  assert(prompt.includes(rep.activeSage.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Celtic Tuatha Four Treasures Engine: calculates heroic destiny and dominant sacred treasure', () => {
  const rep = calculateCelticTuathaFourTreasures({ profile });
  assert.equal(rep.engineVersion, CELTIC_TUATHA_FOUR_TREASURES_ENGINE_VERSION);
  assert(rep.tuathaHeroResonance >= 0 && rep.tuathaHeroResonance <= 100);
  assert(rep.treasures.dominantTreasure.nameKo.length > 0);
  const prompt = formatCelticTuathaFourTreasuresPrompt(rep);
  assert(prompt.includes('고대 아일랜드 켈트 투아하 데 다난(Tuatha Dé Danann) 4대 보물 영웅 운명 실측 데이터'));
  assert(prompt.includes(rep.treasures.dominantTreasure.nameKo));
});

test('Taoist Shangqing 24 Spirits Engine: calculates three dantians and active true spirit', () => {
  const rep = calculateTaoistShangqingTwentyFourSpirits({ profile, question: '상청 존사' });
  assert.equal(rep.engineVersion, TAOIST_SHANGQING_TWENTY_FOUR_SPIRITS_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.shangqingSynthesisMatrix?.integratedAction));
  assert(rep.shangqingAttunementScore >= 0 && rep.shangqingAttunementScore <= 100);
  assert(rep.spiritualShieldRate >= 0 && rep.spiritualShieldRate <= 100);
  assert(rep.activeTrueSpirit.nameKo.length > 0);
  const prompt = formatTaoistShangqingTwentyFourSpiritsPrompt(rep);
  assert(prompt.includes('고대 중국 도홍경(陶弘景) 진고(眞誥) 상청파(上淸派) 24성도 존사(存思) 통령 실측 데이터'));
  assert(prompt.includes(rep.activeTrueSpirit.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Tibetan Phowa Rainbow Body Engine: calculates Rigpa clarity and 5 Buddha wisdoms', () => {
  const rep = calculateTibetanPhowaRainbowBody({ profile, question: '본각 정렬' });
  assert.equal(rep.engineVersion, TIBETAN_PHOWA_RAINBOW_BODY_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.phowaSynthesisMatrix?.integratedAction));
  assert(rep.rigpaClarityScore >= 0 && rep.rigpaClarityScore <= 100);
  assert(rep.phowaReadinessIndex >= 0 && rep.phowaReadinessIndex <= 100);
  assert(rep.rainbowBodyAlignmentScore >= 0 && rep.rainbowBodyAlignmentScore <= 100);
  assert(rep.primaryWisdom.nameKo.length > 0);
  const prompt = formatTibetanPhowaRainbowBodyPrompt(rep);
  assert(prompt.includes('티베트 족첸(Dzogchen) 릭파 본각 & 무지개체(Jalü) 5대 지혜 실측 데이터'));
  assert(prompt.includes(rep.primaryWisdom.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Plum Blossom Meihua Oracle Engine: calculates ben/hu/bian gua and ti-yong relations', () => {
  const rep = calculatePlumBlossomMeihuaOracle({ profile });
  assert.equal(rep.engineVersion, PLUM_BLOSSOM_MEIHUA_ORACLE_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.meihuaSynthesisMatrix?.integratedAction));
  assert(rep.movingLine >= 1 && rep.movingLine <= 6);
  assert(rep.auspiciousScore >= 0 && rep.auspiciousScore <= 100);
  assert(rep.benGua.fullName.length > 0);
  assert(rep.tiGua.name.length > 0);
  const prompt = formatPlumBlossomMeihuaOraclePrompt(rep);
  assert(prompt.includes('송대 소강절 선생 매화역수(梅花易數) 체용생극 선천 작괘 실측 데이터'));
  assert(prompt.includes(rep.tiYongRelation));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Greek Moirai Ananke Fate Engine: calculates Clotho, Lachesis, Atropos powers and necessity ratio', () => {
  const rep = calculateGreekMoiraiAnankeFate({ profile, question: '인생의 중대한 결단' });
  assert.equal(rep.engineVersion, GREEK_MOIRAI_ANANKE_FATE_ENGINE_VERSION);
  assert(rep.clotho.powerScore >= 0 && rep.clotho.powerScore <= 100);
  assert(rep.lachesis.powerScore >= 0 && rep.lachesis.powerScore <= 100);
  assert(rep.atropos.powerScore >= 0 && rep.atropos.powerScore <= 100);
  assert(rep.necessityRatio >= 0 && rep.necessityRatio <= 100);
  assert(rep.dominantGoddess.length > 0);
  assert(rep.temporalMoiraiRhythm.calculatedAtKst.includes('KST'));
  assert(rep.situationalMoiraiAudit.questionFocus.length > 0);
  const prompt = formatGreekMoiraiAnankeFatePrompt(rep);
  assert(prompt.includes('고대 그리스 델포이 삼여신 모이라이(Moirai)'));
  assert(prompt.includes(rep.dominantGoddess));
  assert(!prompt.includes('/100'));
});

test('Egyptian Sphinx Dream Oracle Engine: calculates tetramorph virtues and sand cleansing index', () => {
  const rep = calculateEgyptianSphinxDreamOracle({ profile, question: '미래의 왕권과 비전' });
  assert.equal(rep.engineVersion, EGYPTIAN_SPHINX_DREAM_ORACLE_ENGINE_VERSION);
  assert(rep.tetramorph.humanHead.score >= 0 && rep.tetramorph.humanHead.score <= 100);
  assert(rep.tetramorph.lionHeart.score >= 0 && rep.tetramorph.lionHeart.score <= 100);
  assert(rep.tetramorph.bullStrength.score >= 0 && rep.tetramorph.bullStrength.score <= 100);
  assert(rep.tetramorph.eagleVision.score >= 0 && rep.tetramorph.eagleVision.score <= 100);
  assert(rep.sandCleansingIndex >= 0 && rep.sandCleansingIndex <= 100);
  assert(rep.dominantVirtue.length > 0);
  const prompt = formatEgyptianSphinxDreamOraclePrompt(rep);
  assert(prompt.includes('고대 이집트 투트모세 4세 스핑크스 영혼 꿈신탁'));
  assert(prompt.includes(rep.dominantVirtue));
});

test('Chaldean Mul Apin Astrology Engine: calculates celestial paths, ruling planet and constellation', () => {
  const rep = calculateChaldeanMulApinAstrology({ profile, question: '천문학적 타이밍' });
  assert.equal(rep.engineVersion, CHALDEAN_MUL_APIN_ASTROLOGY_ENGINE_VERSION);
  assert(rep.pathAlignmentScore >= 0 && rep.pathAlignmentScore <= 100);
  assert(rep.rulingPlanet.resonanceScore >= 0 && rep.rulingPlanet.resonanceScore <= 100);
  assert(rep.celestialPath.length > 0);
  assert(rep.mulApinConstellation.length > 0);
  const prompt = formatChaldeanMulApinAstrologyPrompt(rep);
  assert(prompt.includes('고대 메소포타미아 칼데아 12조디악 원형 & 바빌로니아 물핀(MUL.APIN)'));
  assert(prompt.includes(rep.rulingPlanet.nameKo));
});

test('Toltec Nagual Dreaming Engine: calculates four agreements and second attention', () => {
  const rep = calculateToltecNagualDreaming({ profile, question: '현실 자각' });
  assert.equal(rep.engineVersion, TOLTEC_NAGUAL_DREAMING_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.toltecSynthesisMatrix?.integratedAction));
  assert.equal(rep.agreements.length, 4);
  assert(rep.secondAttentionIndex >= 0 && rep.secondAttentionIndex <= 100);
  assert(rep.mitoteClarityScore >= 0 && rep.mitoteClarityScore <= 100);
  assert(rep.tonalRatio + rep.nagualRatio === 100);
  assert(rep.primaryAgreement.nameKo.length > 0);
  const prompt = formatToltecNagualDreamingPrompt(rep);
  assert(prompt.includes('고대 톨텍 나구알리즘 4대 약속 & 꿈의 제2주의 실측 데이터'));
  assert(prompt.includes(rep.primaryAgreement.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Shugendo Yamabushi Ten Realms Engine: calculates ten realms purification and symbolic rebirth', () => {
  const rep = calculateShugendoYamabushiTenRealms({ profile });
  assert.equal(rep.engineVersion, SHUGENDO_YAMABUSHI_TEN_REALMS_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.shugendoSynthesisMatrix?.integratedAction));
  assert(rep.symbolicRebirthScore >= 0 && rep.symbolicRebirthScore <= 100);
  assert(rep.sixRootsPurificationScore >= 0 && rep.sixRootsPurificationScore <= 100);
  assert(rep.kujiKiriWardDefenseScore >= 0 && rep.kujiKiriWardDefenseScore <= 100);
  assert.equal('horagaiResonanceFrequency' in rep, false);
  assert(rep.currentInitiationRealm.nameKo.length > 0);
  const prompt = formatShugendoYamabushiTenRealmsPrompt(rep);
  assert(prompt.includes('고대 일본 슈겐도(修驗道) 야마부시 10계수행 & 6근청정 실측 데이터'));
  assert(prompt.includes(rep.currentInitiationRealm.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100') && !prompt.includes('%'));
  assert.doesNotMatch(prompt, /\bHz\b|Solfeggio|솔페지오|주파수/i);
});

test('Gnostic Pistis Sophia Pleroma Engine: calculates twelve aeons resonance and pneuma spark', () => {
  const rep = calculateGnosticPistisSophiaPleroma({ profile, question: '마음이 불안할 때 빛을 찾고 싶어요', now: new Date('2026-11-15T05:00:00Z') });
  assert.equal(rep.engineVersion, GNOSTIC_PISTIS_SOPHIA_PLEROMA_ENGINE_VERSION);
  assert.equal(rep.questionFocus, 'anxiety');
  assert(rep.pneumaSpiritualSparkScore >= 0 && rep.pneumaSpiritualSparkScore <= 100);
  assert(rep.gnosisLiberationIndex >= 0 && rep.gnosisLiberationIndex <= 100);
  assert(rep.archonMatrixDissolutionRate >= 0 && rep.archonMatrixDissolutionRate <= 100);
  assert(rep.pleromaLightFullnessScore >= 0 && rep.pleromaLightFullnessScore <= 100);
  assert(rep.primaryAeon.nameKo.length > 0);
  assert(rep.situationalGnosticAudit.pistisSophiaVerse.length > 0);
  assert(rep.temporalPleromaRhythm.pleromaHourWindow.length > 0);
  assert(rep.pleromaSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatGnosticPistisSophiaPleromaPrompt(rep);
  assert(prompt.includes('고대 영지주의(Gnosticism) 피스티스 소피아 12에온 & 플레로마 실측 데이터'));
  assert(prompt.includes(rep.primaryAeon.nameKo));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Sumerian Inanna Underworld Descent Engine: calculates seven gates stripping and resurrection vitality', () => {
  const rep = calculateSumerianInannaUnderworldDescent({ profile, question: '그림자와 영혼의 부활' });
  assert.equal(rep.engineVersion, SUMERIAN_INANNA_UNDERWORLD_DESCENT_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.inannaSynthesisMatrix?.integratedAction));
  assert.equal(rep.gates.length, 7);
  assert(rep.underworldSevenGatesPassRate >= 0 && rep.underworldSevenGatesPassRate <= 100);
  assert(rep.spiritualResurrectionVitality >= 0 && rep.spiritualResurrectionVitality <= 100);
  assert(rep.ereshkigalShadowReconciliation >= 0 && rep.ereshkigalShadowReconciliation <= 100);
  assert(rep.currentCrucialGate.gateName.length > 0);
  const prompt = formatSumerianInannaUnderworldDescentPrompt(rep);
  assert(prompt.includes('고대 수메르 이난나 명계 하강 7대 관문 & 부활 실측 데이터'));
  assert(prompt.includes(rep.currentCrucialGate.gateName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Norse Volva Seidr Nine Realms Engine: calculates nine realms resonance and huginn/munin scores', () => {
  const rep = calculateNorseVolvaSeidrNineRealms({ profile, question: '세계수의 운명과 예언' });
  assert.equal(rep.engineVersion, NORSE_VOLVA_SEIDR_NINE_REALMS_ENGINE_VERSION);
  assert(rep.seidrIntuitionClarity >= 0 && rep.seidrIntuitionClarity <= 100);
  assert(rep.huginnThoughtScore >= 0 && rep.huginnThoughtScore <= 100);
  assert(rep.muninMemoryScore >= 0 && rep.muninMemoryScore <= 100);
  assert(rep.yggdrasilSapShieldPower >= 0 && rep.yggdrasilSapShieldPower <= 100);
  assert(rep.dominantRealm.nameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.volvaSynthesisMatrix?.integratedAction));
  const prompt = formatNorseVolvaSeidrNineRealmsPrompt(rep);
  assert(prompt.includes('고대 북유럽 볼바 세이드 직관 & 위그드라실 9대 세계 실측 데이터'));
  assert(prompt.includes(rep.dominantRealm.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Zhuangzi Xiaoyaoyou Butterfly Engine: calculates absolute freedom, rocs flight and butterfly dream', () => {
  const rep = calculateZhuangziXiaoyaoyouButterfly({ profile, question: '붕정만리와 자유' });
  assert.equal(rep.engineVersion, ZHUANGZI_XIAOYAOYOU_BUTTERFLY_ENGINE_VERSION);
  assert(rep.xiaoyaoyouAbsoluteFreedomScore >= 0 && rep.xiaoyaoyouAbsoluteFreedomScore <= 100);
  assert(rep.rocAscendingWindResonance >= 0 && rep.rocAscendingWindResonance <= 100);
  assert(rep.qiwulunTranscendenceIndex >= 0 && rep.qiwulunTranscendenceIndex <= 100);
  assert(rep.butterflyDreamFluidityScore >= 0 && rep.butterflyDreamFluidityScore <= 100);
  assert(rep.dominantArchetype.nameKo.length > 0);
  const prompt = formatZhuangziXiaoyaoyouButterflyPrompt(rep);
  assert(prompt.includes('장자'));
  assert(prompt.includes(rep.dominantArchetype.nameKo));
});

test('Buddhist Yogacara Consciousness Engine: calculates eight consciousnesses purification and transformed wisdom', () => {
  const rep = calculateBuddhistYogacaraConsciousness({ profile, question: '아뢰야식과 전식득지' });
  assert.equal(rep.engineVersion, BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION);
  assert(rep.alayaPurificationScore >= 0 && rep.alayaPurificationScore <= 100);
  assert(rep.manasEgoTranscendenceRate >= 0 && rep.manasEgoTranscendenceRate <= 100);
  assert(rep.fourWisdomsHarmonizationIndex >= 0 && rep.fourWisdomsHarmonizationIndex <= 100);
  assert(rep.kleshaDefilementPurificationScore >= 0 && rep.kleshaDefilementPurificationScore <= 100);
  assert(rep.dominantWisdom.nameKo.length > 0);
  const prompt = formatBuddhistYogacaraConsciousnessPrompt(rep);
  assert(prompt.includes('불교 유식학 8식 정화 & 아뢰야식 전식득지(轉識得智) 실측 데이터'));
  assert(prompt.includes(rep.dominantWisdom.nameKo));
});

test('Vedic Mandukya Turiya Engine: calculates four consciousness states, AUM resonance and pure witness', () => {
  const rep = calculateVedicMandukyaTuriya({ profile, question: '투리야 순수의식' });
  assert.equal(rep.engineVersion, VEDIC_MANDUKYA_TURIYA_ENGINE_VERSION);
  assert(rep.turiyaPureConsciousnessScore >= 0 && rep.turiyaPureConsciousnessScore <= 100);
  assert(rep.aumSyllableResonanceIndex >= 0 && rep.aumSyllableResonanceIndex <= 100);
  assert(rep.sakshiWitnessPresenceScore >= 0 && rep.sakshiWitnessPresenceScore <= 100);
  assert(rep.mayaIllusionDissolutionRate >= 0 && rep.mayaIllusionDissolutionRate <= 100);
  assert(rep.dominantState.nameKo.length > 0);
  const prompt = formatVedicMandukyaTuriyaPrompt(rep);
  assert(prompt.includes('고대 인도 만두키야 우파니샤드 4대 의식 & 투리야(Turiya) 순수의식 실측 데이터'));
  assert(prompt.includes(rep.dominantState.nameKo));
});

test('Kabbalistic Zohar Five Soul Levels Engine: calculates five soul levels and Ein Sof spark', () => {
  const rep = calculateKabbalisticZoharSoul({ profile, question: '조하르 영혼의 불꽃' });
  assert.equal(rep.engineVersion, KABBALISTIC_ZOHAR_SOUL_ENGINE_VERSION);
  assert(rep.yechidahDivineSparkScore >= 0 && rep.yechidahDivineSparkScore <= 100);
  assert(rep.tikkunSoulCorrectionProgress >= 0 && rep.tikkunSoulCorrectionProgress <= 100);
  assert(rep.shekhinahDivinePresenceIndex >= 0 && rep.shekhinahDivinePresenceIndex <= 100);
  assert(rep.qlippothShellPurificationRate >= 0 && rep.qlippothShellPurificationRate <= 100);
  assert(rep.dominantSoulLevel.nameKo.length > 0);
  const prompt = formatKabbalisticZoharSoulPrompt(rep);
  assert(prompt.includes('카발라 조하르(Zohar) 5대 영혼 층위 & 에인 소프 신성 상승 실측 데이터'));
  assert(prompt.includes(rep.dominantSoulLevel.nameKo));
});

test('Roman Stoic Prohairesis Dichotomy Engine: calculates internal control focus and amor fati', () => {
  const rep = calculateRomanStoicProhairesis({ profile, question: '통제할 수 있는 것과 없는 것의 지혜' });
  assert.equal(rep.engineVersion, ROMAN_STOIC_PROHAIRESIS_ENGINE_VERSION);
  assert(rep.internalControlFocusScore >= 0 && rep.internalControlFocusScore <= 100);
  assert(rep.externalSurrenderScore >= 0 && rep.externalSurrenderScore <= 100);
  assert(rep.amorFatiScore >= 0 && rep.amorFatiScore <= 100);
  assert(rep.apatheiaInnerPeaceScore >= 0 && rep.apatheiaInnerPeaceScore <= 100);
  assert(rep.dominantVirtue.nameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.stoicSynthesisMatrix?.integratedAction));
  const prompt = formatRomanStoicProhairesisPrompt(rep);
  assert(prompt.includes('스토아학파'));
  assert(prompt.includes(rep.dominantVirtue.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Patanjali Ashtanga Yoga Sutra Engine: calculates citta vritti nirodha and klesha purification', () => {
  const rep = calculatePatanjaliAshtangaYoga({ profile, question: '마음의 소용돌이 진정과 삼매' });
  assert.equal(rep.engineVersion, PATANJALI_ASHTANGA_YOGA_ENGINE_VERSION);
  assert(rep.cittaVrittiNirodhaScore >= 0 && rep.cittaVrittiNirodhaScore <= 100);
  assert(rep.kleshaPurificationRate >= 0 && rep.kleshaPurificationRate <= 100);
  assert(rep.purushaConsciousnessAwakening >= 0 && rep.purushaConsciousnessAwakening <= 100);
  assert(rep.pranayamaVitalityBalance >= 0 && rep.pranayamaVitalityBalance <= 100);
  assert(rep.dominantYogaLimb.nameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.yogaSynthesisMatrix?.integratedAction));
  const prompt = formatPatanjaliAshtangaYogaPrompt(rep);
  assert(prompt.includes('요가 수트라'));
  assert(prompt.includes(rep.dominantYogaLimb.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Korean Pungryudo Hwarang Five Precepts Engine: calculates xuanmiao harmony and hoyounjigi', () => {
  const rep = calculateKoreanPungryudoHwarang({ profile, question: '호연지기와 화랑의 기개', now: new Date('2026-11-15T06:55:00+09:00') });
  assert.equal(rep.engineVersion, KOREAN_PUNGRYUDO_HWARANG_ENGINE_VERSION);
  assert(rep.pungryuXuanmiaoHarmonyScore >= 0 && rep.pungryuXuanmiaoHarmonyScore <= 100);
  assert(rep.hoyounjigiSpiritualCourageScore >= 0 && rep.hoyounjigiSpiritualCourageScore <= 100);
  assert(rep.socialFaithLoyaltyScore >= 0 && rep.socialFaithLoyaltyScore <= 100);
  assert(rep.gaAkSangYeolJoyVibration >= 0 && rep.gaAkSangYeolJoyVibration <= 100);
  assert(rep.dominantPrecept.nameKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalPungryuRhythm.hwarangWatchWindow.length > 0);
  assert(rep.pungryuSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatKoreanPungryudoHwarangPrompt(rep);
  assert(prompt.includes('풍류도'));
  assert(prompt.includes(rep.dominantPrecept.nameKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Persian Attar Seven Valleys Engine: calculates seven valleys passage, Simurgh mirror and Fana/Baqa', () => {
  const rep = calculatePersianAttarSevenValleys({ profile, question: '시무르그와 7대 계곡' });
  assert.equal(rep.engineVersion, ATTAR_SEVEN_VALLEYS_ENGINE_VERSION);
  assert(rep.simurghMirrorResonanceScore >= 0 && rep.simurghMirrorResonanceScore <= 100);
  assert(rep.sevenValleysPassageProgress >= 0 && rep.sevenValleysPassageProgress <= 100);
  assert(rep.fanaEgoDissolutionRate >= 0 && rep.fanaEgoDissolutionRate <= 100);
  assert(rep.baqaDivinePermanenceIndex >= 0 && rep.baqaDivinePermanenceIndex <= 100);
  assert(rep.dominantValley.nameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.attarSynthesisMatrix?.integratedAction));
  const prompt = formatPersianAttarSevenValleysPrompt(rep);
  assert(prompt.includes('페르시아 수피즘 아타르 \'새들의 회의\' 7대 계곡 & 시무르그 실측 데이터'));
  assert(prompt.includes(rep.dominantValley.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Hermetic Poimandres Ascension Engine: calculates seven spheres passions purification and Ogdoad Nous', () => {
  const rep = calculateHermeticPoimandres({ profile, question: '포이만드레스와 누스', now: new Date('2026-11-15T05:00:00Z') });
  assert.equal(rep.engineVersion, HERMETIC_POIMANDRES_ENGINE_VERSION);
  assert(rep.nousDivineIntellectResonanceScore >= 0 && rep.nousDivineIntellectResonanceScore <= 100);
  assert(rep.planetaryPassionsPurificationRate >= 0 && rep.planetaryPassionsPurificationRate <= 100);
  assert(rep.ogdoadAscensionReadinessIndex >= 0 && rep.ogdoadAscensionReadinessIndex <= 100);
  assert(rep.theosisDivineUnityScore >= 0 && rep.theosisDivineUnityScore <= 100);
  assert(rep.dominantSphere.nameKo.length > 0);
  assert(rep.situationalPoimandresAudit.corpusHermeticumVerse.length > 0);
  assert(rep.temporalOgdoadRhythm.ascensionWindow.length > 0);
  assert(rep.poimandresSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatHermeticPoimandresPrompt(rep);
  assert(prompt.includes('고대 헤르메스주의 포이만드레스 7대 천계 탈각 & 옥도아드 각성 실측 데이터'));
  assert(prompt.includes(rep.dominantSphere.nameKo));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Kashmir Shaivism Spanda Engine: calculates cosmic pulsation, Pratyabhijna self-recognition and Prakasha-Vimarsha', () => {
  const rep = calculateKashmirShaivismSpanda({ profile, question: '스판다 신성 맥동' });
  assert.equal(rep.engineVersion, KASHMIR_SHAIVISM_SPANDA_ENGINE_VERSION);
  assert(rep.spandaCosmicPulsationScore >= 0 && rep.spandaCosmicPulsationScore <= 100);
  assert(rep.pratyabhijnaSelfRecognitionIndex >= 0 && rep.pratyabhijnaSelfRecognitionIndex <= 100);
  assert(rep.prakashaVimarshaUnityScore >= 0 && rep.prakashaVimarshaUnityScore <= 100);
  assert(rep.threeMalasPurificationRate >= 0 && rep.threeMalasPurificationRate <= 100);
  assert(rep.dominantTattva.nameKo.length > 0);
  const prompt = formatKashmirShaivismSpandaPrompt(rep);
  assert(prompt.includes('카슈미르 시바파 스판다 우주 맥동 & 프라티야비즈냐 재인식 실측 데이터'));
  assert(prompt.includes(rep.dominantTattva.nameKo));
});

test('Sumerian Enuma Elish Fifty Names Engine: calculates Tiamat subjugation, four winds balance and Marduk sacred names', () => {
  const rep = calculateSumerianEnumaElishFiftyNames({ profile, question: '에누마 엘리시 마르두크 50대 이름' });
  assert.equal(rep.engineVersion, ENUMA_ELISH_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.enumaElishSynthesisMatrix?.integratedAction));
  assert(rep.tiamatSubjugationOrderScore >= 0 && rep.tiamatSubjugationOrderScore <= 100);
  assert(rep.fiftySacredNamesResonanceIndex >= 0 && rep.fiftySacredNamesResonanceIndex <= 100);
  assert(rep.cosmicSovereigntyScore >= 0 && rep.cosmicSovereigntyScore <= 100);
  assert(rep.fourWindsDominance.northWindDiscipline >= 0 && rep.fourWindsDominance.northWindDiscipline <= 100);
  assert(rep.fourWindsDominance.southWindPassion >= 0 && rep.fourWindsDominance.southWindPassion <= 100);
  assert(rep.dominantSacredName.nameKo.length > 0);
  const prompt = formatSumerianEnumaElishFiftyNamesPrompt(rep);
  assert(prompt.includes('바빌로니아 에누마 엘리시 마르두크 50대 이름 & 4대 바람 정복 실측 데이터'));
  assert(prompt.includes(rep.dominantSacredName.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Alexandrian Decan Thirty Six Gods Engine: provides qualitative Kairos posture, question context and hides raw scores', () => {
  const rep = calculateAlexandrianDecanThirtySixGods({ profile, question: '이직 결정을 내려도 될까요?' });
  assert.equal(rep.engineVersion, ALEXANDRIAN_DECAN_ENGINE_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert(rep.kairosPosture.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.dominantDecan.nameKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalDecanRhythm.hermeticWatchWindow.length > 0);
  assert(rep.decanSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatAlexandrianDecanThirtySixGodsPrompt(rep);
  assert(prompt.includes('알렉산드리아 헤르메스주의 36대 데칸 천상 성령 & 시간의 지배자 실측 데이터'));
  assert(prompt.includes(rep.dominantDecan.nameKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Taoist Liezi Wind Riding Engine: calculates wind riding unity, Muhayu rest index and tranquil emptiness', () => {
  const rep = calculateTaoistLieziWindRiding({ profile, question: '열자 어풍동행 무하유지향' });
  assert.equal(rep.engineVersion, TAOIST_LIEZI_ENGINE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.lieziSynthesisMatrix?.integratedAction));
  assert(rep.windRidingUnityScore >= 0 && rep.windRidingUnityScore <= 100);
  assert(rep.muhayuRestIndex >= 0 && rep.muhayuRestIndex <= 100);
  assert(rep.tranquilEmptinessScore >= 0 && rep.tranquilEmptinessScore <= 100);
  assert(rep.nonAttachmentFluidityRate >= 0 && rep.nonAttachmentFluidityRate <= 100);
  assert(rep.dominantStage.nameKo.length > 0);
  const prompt = formatTaoistLieziWindRidingPrompt(rep);
  assert(prompt.includes('도가 열자 어풍동행 & 무하유지향 진인 유유자적 실측 데이터'));
  assert(prompt.includes(rep.dominantStage.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Samkhya Twenty-Five Tattvas Engine: calculates Viveka discernment, Guna balance and Kaivalya liberation index', () => {
  const rep = calculateSamkhyaTwentyFiveTattvas({ profile, question: '상키야 25타트바 분별지' });
  assert.equal(rep.engineVersion, SAMKHYA_TATTVAS_ENGINE_VERSION);
  assert(rep.vivekaDiscernmentScore >= 0 && rep.vivekaDiscernmentScore <= 100);
  assert(rep.kaivalyaLiberationIndex >= 0 && rep.kaivalyaLiberationIndex <= 100);
  assert(rep.purushaWitnessPower >= 0 && rep.purushaWitnessPower <= 100);
  assert(rep.prakritiEntanglementRisk >= 0 && rep.prakritiEntanglementRisk <= 100);
  assert.equal(rep.gunaBalance.sattva + rep.gunaBalance.rajas + rep.gunaBalance.tamas, 100);
  assert(rep.dominantTattva.nameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.samkhyaSynthesisMatrix?.integratedAction));
  const prompt = formatSamkhyaTwentyFiveTattvasPrompt(rep);
  assert(prompt.includes('고대 인도 상키야(Samkhya) 25타트바 & 푸루샤-프라크리티 분별지 실측 리포트'));
  assert(prompt.includes(rep.dominantTattva.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Neo-Confucian Four-Seven Li-Qi Engine: calculates Sadan alignment, Chiljeong balance and Geogyeong concentration', () => {
  const rep = calculateNeoConfucianFourSevenLiQi({ profile, question: '성리학 사칠이기 거경궁리' });
  assert.equal(rep.engineVersion, NEO_CONFUCIAN_LIQI_ENGINE_VERSION);
  assert(rep.sadanAlignmentScore >= 0 && rep.sadanAlignmentScore <= 100);
  assert(rep.chiljeongBalanceScore >= 0 && rep.chiljeongBalanceScore <= 100);
  assert(rep.liQiHarmonyIndex >= 0 && rep.liQiHarmonyIndex <= 100);
  assert(rep.originalNaturePurityScore >= 0 && rep.originalNaturePurityScore <= 100);
  assert(rep.geogyeongConcentrationIndex >= 0 && rep.geogyeongConcentrationIndex <= 100);
  assert(rep.dominantSadan.nameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.liQiSynthesisMatrix?.integratedAction));
  const prompt = formatNeoConfucianFourSevenLiQiPrompt(rep);
  assert(prompt.includes('성리학 사칠이기(四七理氣) & 거경궁리 주일무적 수양 실측 리포트'));
  assert(prompt.includes(rep.dominantSadan.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Etruscan Augur Sixteen Sky Divination Engine: calculates Faustus auspice score, 16 Templum region and Admissio approval', () => {
  const rep = calculateEtruscanAugurSixteenSky({ profile, question: '에트루리아 16천궁 아우구르 조점' });
  assert.equal(rep.engineVersion, ETRUSCAN_AUGUR_ENGINE_VERSION);
  assert(rep.faustusScore >= 0 && rep.faustusScore <= 100);
  assert(rep.lituusClarityIndex >= 0 && rep.lituusClarityIndex <= 100);
  assert(rep.cosmicSanctionStrength >= 0 && rep.cosmicSanctionStrength <= 100);
  assert(rep.activeRegion.regionNumber >= 1 && rep.activeRegion.regionNumber <= 16);
  assert(rep.augurSign.sacredSymbol.length > 0);
  const prompt = formatEtruscanAugurSixteenSkyPrompt(rep);
  assert(prompt.includes('고대 에트루리아 16천궁 분할 & 아우구르 조점(Auspicium) 실측 리포트'));
  assert(prompt.includes(rep.activeRegion.quadrantKo));
});

test('Rosicrucian Chymical Wedding Engine: calculates seven days transmutation, chymical union and phoenix rebirth', () => {
  const rep = calculateRosicrucianChymicalWedding({ profile, question: '로젠크로이츠 화학적 결혼' });
  assert.equal(rep.engineVersion, ROSICRUCIAN_CHYMICAL_WEDDING_ENGINE_VERSION);
  assert(rep.chymicalUnionScore >= 0 && rep.chymicalUnionScore <= 100);
  assert(rep.philosophersStoneIndex >= 0 && rep.philosophersStoneIndex <= 100);
  assert(rep.sevenDaysTransmutationRate >= 0 && rep.sevenDaysTransmutationRate <= 100);
  assert(rep.phoenixRebirthVibration >= 0 && rep.phoenixRebirthVibration <= 100);
  assert(rep.dominantStage.dayName.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.rosicrucianSynthesisMatrix?.integratedAction));
  const prompt = formatRosicrucianChymicalWeddingPrompt(rep);
  assert(prompt.includes('장미십자회 《화학적 결혼》 7일 연금술 영혼 승화 실측 데이터'));
  assert(prompt.includes(rep.dominantStage.dayName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Aztec Tonalamatl Sacred Calendar Engine: calculates twenty day signs, tonalli solar vitality and ollin harmony', () => {
  const rep = calculateAztecTonalamatl({ profile, question: '아즈텍 토날포왈리 성력' });
  assert.equal(rep.engineVersion, AZTEC_TONALAMATL_ENGINE_VERSION);
  assert(rep.tonalliSolarVitalityScore >= 0 && rep.tonalliSolarVitalityScore <= 100);
  assert(rep.teyoliaHeartPurityIndex >= 0 && rep.teyoliaHeartPurityIndex <= 100);
  assert(rep.ihiyotlBreathPowerScore >= 0 && rep.ihiyotlBreathPowerScore <= 100);
  assert(rep.ollinCosmicMovementHarmony >= 0 && rep.ollinCosmicMovementHarmony <= 100);
  assert(rep.dominantDaySign.nameKo.length > 0);
  const prompt = formatAztecTonalamatlPrompt(rep);
  assert(prompt.includes('고대 아즈텍 토날포왈리 20대 일진 & 토날라마틀 성력 실측 데이터'));
  assert(prompt.includes(rep.dominantDaySign.nameKo));
});

test('Mongolian Tengrism Hiimori Soul Engine: calculates wind horse vitality, blue sky resonance and suld spirit power', () => {
  const rep = calculateMongolianTengriHiimori({ profile, question: '몽골 텡그리즘 풍마 히모리' });
  assert.equal(rep.engineVersion, MONGOLIAN_TENGRI_HIIMORI_ENGINE_VERSION);
  assert(rep.hiimoriWindHorseVitalityScore >= 0 && rep.hiimoriWindHorseVitalityScore <= 100);
  assert(rep.tengriBlueSkyResonanceIndex >= 0 && rep.tengriBlueSkyResonanceIndex <= 100);
  assert(rep.suldImmortalSpiritPower >= 0 && rep.suldImmortalSpiritPower <= 100);
  assert(rep.etugenMotherEarthRooting >= 0 && rep.etugenMotherEarthRooting <= 100);
  assert(rep.dominantAspect.nameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.tengriSynthesisMatrix?.integratedAction));
  const prompt = formatMongolianTengriHiimoriPrompt(rep);
  assert(prompt.includes('몽골 텡그리즘 99 텡그리 & 히모리 풍마 영혼 공명 실측 데이터'));
  assert(prompt.includes(rep.dominantAspect.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Gaelic Wheel Four Fire Festivals Engine: calculates fire festival stations, celtic hearthfire vibration and anam cara depth', () => {
  const rep = calculateGaelicWheelFireFestivals(profile);
  assert.equal(rep.engineVersion, GAELIC_FIRE_FESTIVALS_ENGINE_VERSION);
  assert(rep.wheelCycleHarmonyScore >= 0 && rep.wheelCycleHarmonyScore <= 100);
  assert(rep.celticFireVibration >= 0 && rep.celticFireVibration <= 100);
  assert(rep.tuathaDeDanannBlessing >= 0 && rep.tuathaDeDanannBlessing <= 100);
  assert(rep.anamCaraSoulDepth >= 0 && rep.anamCaraSoulDepth <= 100);
  assert(rep.activeStation.nameKo.length > 0);
  const prompt = formatGaelicWheelFireFestivalsPrompt(rep);
  assert(prompt.includes('휠 오브 더 이어 켈트 4대 화제 축제 실측 데이터'));
  assert(prompt.includes(rep.activeStation.nameKo));
  assert(!prompt.includes('/100') && !prompt.includes('%'));
});

test('Norse Havamal Eighteen Galdr Engine: calculates eighteen runic charms, yggdrasil depth and odin mastery', () => {
  const rep = calculateNorseHavamalEighteenGaldr(profile);
  assert.equal(rep.engineVersion, NORSE_HAVAMAL_GALDR_ENGINE_VERSION);
  assert(rep.yggdrasilWisdomDepth >= 0 && rep.yggdrasilWisdomDepth <= 100);
  assert(rep.odinRuneMasteryIndex >= 0 && rep.odinRuneMasteryIndex <= 100);
  assert(rep.valkyrieShieldIntegrity >= 0 && rep.valkyrieShieldIntegrity <= 100);
  assert(rep.fateWyrdResilience >= 0 && rep.fateWyrdResilience <= 100);
  assert(rep.dominantGaldrCharm.charmName.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.havamalSynthesisMatrix?.integratedAction));
  const prompt = formatNorseHavamalEighteenGaldrPrompt(rep);
  assert(prompt.includes('고에다 하바말 오딘의 18대 게알드르 룬 비전 주문 실측 데이터'));
  assert(prompt.includes(rep.dominantGaldrCharm.charmName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ibn Arabi Wahdat al-Wujud Heart Wisdom Engine: calculates prophetic heart facets, divine tajalli and mirror purity', () => {
  const rep = calculateIbnArabiWahdatAlWujud(profile);
  assert.equal(rep.engineVersion, IBN_ARABI_WAHDAT_ENGINE_VERSION);
  assert(rep.wahdatOnenessPerceptionScore >= 0 && rep.wahdatOnenessPerceptionScore <= 100);
  assert(rep.divineTajalliIllumination >= 0 && rep.divineTajalliIllumination <= 100);
  assert(rep.perfectHumanMirrorIndex >= 0 && rep.perfectHumanMirrorIndex <= 100);
  assert(rep.heartPurityBarakah >= 0 && rep.heartPurityBarakah <= 100);
  assert(rep.dominantWisdom.prophetName.length > 0);
  const prompt = formatIbnArabiWahdatAlWujudPrompt(rep);
  assert(prompt.includes('이븐 아라비 존재의 단일성(Wahdat al-Wujud) 심장 영지 실측 데이터'));
  assert(prompt.includes(rep.dominantWisdom.prophetName));
});

test('Chonggamnok Ten Sanctuaries Engine: calculates geomantic sanctuaries, gonggong-euleul virtue and sanctuary shield', () => {
  const rep = calculateChonggamnokTenSanctuaries(profile, '마음이 너무 불안하고 지쳐서 쉬고 싶어요', new Date('2026-11-15T05:00:00Z'));
  assert.equal(rep.engineVersion, CHONGGAMNOK_SANCTUARIES_ENGINE_VERSION);
  assert.equal(rep.questionTopic, 'healing');
  assert(rep.temporalSanctuaryRhythm.kstSlot.length > 0);
  assert(rep.gonggongEuleulVirtueScore >= 0 && rep.gonggongEuleulVirtueScore <= 100);
  assert(rep.threeCalamitiesImmunityScore >= 0 && rep.threeCalamitiesImmunityScore <= 100);
  assert(rep.geomanticVitalityIndex >= 0 && rep.geomanticVitalityIndex <= 100);
  assert(rep.spiritualSanctuaryShield >= 0 && rep.spiritualSanctuaryShield <= 100);
  assert(rep.dominantSanctuary.nameKo.length > 0);
  assert(rep.dailyPracticeRitual.length > 0);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.chonggamnokSynthesisMatrix?.integratedAction));
  const prompt = formatChonggamnokPrompt(rep);
  assert(prompt.includes('조선 비전 정감록 10승지 영맥 & 보신 피난처 실측 데이터'));
  assert(prompt.includes(rep.dominantSanctuary.nameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Balinese Tri Hita Karana Engine: calculates cosmic trinity harmony, tri kaya purification and sanctuary resonance', () => {
  const rep = calculateBalineseTriHitaKarana(profile);
  assert.equal(rep.engineVersion, BALINESE_TRI_HITA_KARANA_ENGINE_VERSION);
  assert(rep.parhyanganDivineHarmony >= 0 && rep.parhyanganDivineHarmony <= 100);
  assert(rep.pawonganHumanityEmpathy >= 0 && rep.pawonganHumanityEmpathy <= 100);
  assert(rep.palemahanEcologyBalance >= 0 && rep.palemahanEcologyBalance <= 100);
  assert(rep.triKayaPurificationIndex >= 0 && rep.triKayaPurificationIndex <= 100);
  assert(rep.activeSanctuary.nameKo.length > 0);
  const prompt = formatBalineseTriHitaKaranaPrompt(rep);
  assert(prompt.includes('발리 힌두교 트리 히타 카라나 3대 우주 조화 & 3업 정화 실측 데이터'));
  assert(prompt.includes(rep.activeSanctuary.nameKo));
});

test('Hopi Four Worlds Kachina Prophecy Engine: calculates four worlds evolution, koyaanisqatsi healing and kiva center alignment', () => {
  const rep = calculateHopiFourWorldsKachina(profile);
  assert.equal(rep.engineVersion, HOPI_FOUR_WORLDS_ENGINE_VERSION);
  assert(rep.fourWorldsEvolutionScore >= 0 && rep.fourWorldsEvolutionScore <= 100);
  assert(rep.koyaanisqatsiHealingPower >= 0 && rep.koyaanisqatsiHealingPower <= 100);
  assert(rep.kivaSacredCenterAlignment >= 0 && rep.kivaSacredCenterAlignment <= 100);
  assert(rep.spiderGrandmotherWisdom >= 0 && rep.spiderGrandmotherWisdom <= 100);
  assert(rep.dominantKachina.nameKo.length > 0);
  const prompt = formatHopiFourWorldsPrompt(rep);
  assert(prompt.includes('아메리카 호피족 4대 우주 시대 & 카치나 정령 지혜 실측 데이터'));
  assert(prompt.includes(rep.dominantKachina.nameKo));
});

test('Donghak Cheondoism Cheonju Engine: calculates inner spirituality, cosmic resonance and gaebyeok index', () => {
  const rep = calculateDonghakCheondoismCheonju(profile, new Date('2026-11-15T07:05:00+09:00'), '관계와 마음의 중심');
  assert.equal(rep.engineVersion, DONGHAK_CHEONDOISM_VERSION);
  assert(rep.innerSpiritualityScore >= 0 && rep.innerSpiritualityScore <= 100);
  assert(rep.outerCosmicResonanceScore >= 0 && rep.outerCosmicResonanceScore <= 100);
  assert(rep.unshakableAwakeningScore >= 0 && rep.unshakableAwakeningScore <= 100);
  assert(rep.jigiUniversalEnergyAlignment >= 0 && rep.jigiUniversalEnergyAlignment <= 100);
  assert(rep.gaebyeokTransformationIndex >= 0 && rep.gaebyeokTransformationIndex <= 100);
  assert(rep.mansajiOmniscientWisdomScore >= 0 && rep.mansajiOmniscientWisdomScore <= 100);
  assert(rep.primaryVirtue.titleKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalDonghakRhythm.yongdamWatchWindow.length > 0);
  assert(rep.donghakSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatDonghakCheondoismCheonjuPrompt(rep);
  assert(prompt.includes('동학 수운 최제우 시천주(侍天主) & 지기금지 인내천 천지조화'));
  assert(prompt.includes(rep.primaryVirtue.titleKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Inca Andean Three Pacha Ayni Engine: calculates three pachas, sacred reciprocity and totem medicine', () => {
  const rep = calculateIncaAndeanThreePachaAyni(profile, new Date('2026-11-15T06:35:00+09:00'), '직장과 재물의 균형이 궁금합니다.');
  assert.equal(rep.engineVersion, INCA_ANDEAN_PACHA_VERSION);
  assert(rep.hananPachaCelestialScore >= 0 && rep.hananPachaCelestialScore <= 100);
  assert(rep.kayPachaEarthlyPresenceScore >= 0 && rep.kayPachaEarthlyPresenceScore <= 100);
  assert(rep.ukuPachaSubconsciousDepthScore >= 0 && rep.ukuPachaSubconsciousDepthScore <= 100);
  assert(rep.ayniReciprocityBalanceScore >= 0 && rep.ayniReciprocityBalanceScore <= 100);
  assert(rep.samiLightEnergyPurity >= 0 && rep.samiLightEnergyPurity <= 100);
  assert(rep.huchaHeavyEnergyClearance >= 0 && rep.huchaHeavyEnergyClearance <= 100);
  assert(rep.sacredAnimalTotem.animalKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalPachaRhythm.intiSolarWindow.length > 0);
  assert(rep.pachaSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatIncaAndeanThreePachaAyniPrompt(rep);
  assert(prompt.includes('고대 잉카 안데스 코스몰로지 3대 파차 & 파차마마 아이니(Ayni) 호혜 조화'));
  assert(prompt.includes(rep.sacredAnimalTotem.animalKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Shang Oracle Bone Divination Engine: calculates oracle bone medium, diviner judgment and crack auspiciousness', () => {
  const rep = calculateShangOracleBoneDivination(profile);
  assert.equal(rep.engineVersion, SHANG_ORACLE_BONE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.shangOracleSynthesisMatrix?.integratedAction));
  assert(rep.divinationMedium.length > 0);
  assert(rep.divinerName.length > 0);
  assert(rep.shangdiDivineAlignmentScore >= 0 && rep.shangdiDivineAlignmentScore <= 100);
  assert(rep.ancestralProtectionScore >= 0 && rep.ancestralProtectionScore <= 100);
  assert(rep.crackAuspiciousnessIndex >= 0 && rep.crackAuspiciousnessIndex <= 100);
  assert(rep.manifestationEfficacyScore >= 0 && rep.manifestationEfficacyScore <= 100);
  const prompt = formatShangOracleBoneDivinationPrompt(rep);
  assert(prompt.includes('고대 은나라 상(商) 갑골문(甲骨文) 신탁 복사(卜辭) & 정인 4단계 신의 균열'));
  assert(prompt.includes(rep.divinerName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100') && !prompt.includes('%'));
});

test('Korean Cheonbugyeong Eighty One Cosmic Engine: calculates heaven earth human, 3jin 3mang and budongbon', () => {
  const rep = calculateKoreanCheonbugyeongEightyOne(profile, new Date('2026-11-15T06:55:00+09:00'), '직장과 내면의 중심');
  assert.equal(rep.engineVersion, CHEONBUGYEONG_ENGINE_VERSION);
  assert(rep.heavenCosmicAlignmentScore >= 0 && rep.heavenCosmicAlignmentScore <= 100);
  assert(rep.earthGroundingStabilityScore >= 0 && rep.earthGroundingStabilityScore <= 100);
  assert(rep.humanHarmonizingSovereigntyScore >= 0 && rep.humanHarmonizingSovereigntyScore <= 100);
  assert(rep.sungMyungJungTrueTrinityScore >= 0 && rep.sungMyungJungTrueTrinityScore <= 100);
  assert(rep.threeTrainingsMasteryScore >= 0 && rep.threeTrainingsMasteryScore <= 100);
  assert(rep.yongbyeonBudongbonIntegrity >= 0 && rep.yongbyeonBudongbonIntegrity <= 100);
  assert(rep.seongtongGwangmyeongIllumination >= 0 && rep.seongtongGwangmyeongIllumination <= 100);
  assert(rep.hongikInkanManifestationCapacity >= 0 && rep.hongikInkanManifestationCapacity <= 100);
  assert(rep.primaryHexagramGua.verseKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalCheonbuRhythm.samgeukWatchWindow.length > 0);
  assert(rep.cheonbuSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatKoreanCheonbugyeongEightyOnePrompt(rep);
  assert(prompt.includes('단군 단학 천부경(天符經) 81자 우주 매트릭스 & 삼일신고 3진3망 성통광명'));
  assert(prompt.includes(rep.primaryHexagramGua.verseHanja));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Hindu Sri Yantra Sacred Geometry Engine: calculates Shiva-Shakti polarities, Nava Yoni and Nava Avarana', () => {
  const rep = calculateHinduSriYantraSacredGeometry(profile, new Date('2026-11-15T06:05:00Z'), '사업 성취와 내면 조화');
  assert.equal(rep.engineVersion, SRI_YANTRA_ENGINE_VERSION);
  assert(rep.shivaAscendingConsciousnessScore >= 0 && rep.shivaAscendingConsciousnessScore <= 100);
  assert(rep.shaktiDescendingGraceScore >= 0 && rep.shaktiDescendingGraceScore <= 100);
  assert(rep.navaYoniInterlockingHarmony >= 0 && rep.navaYoniInterlockingHarmony <= 100);
  assert(rep.binduTranscendentalAwakeningScore >= 0 && rep.binduTranscendentalAwakeningScore <= 100);
  assert(rep.sarvaArthaManifestationIndex >= 0 && rep.sarvaArthaManifestationIndex <= 100);
  assert(rep.sarvaRogaharaHealingPower >= 0 && rep.sarvaRogaharaHealingPower <= 100);
  assert(rep.sarvaAnandamayaBlissAlignment >= 0 && rep.sarvaAnandamayaBlissAlignment <= 100);
  assert(rep.primaryAvaranaChakra.level >= 1 && rep.primaryAvaranaChakra.level <= 9);
  assert(rep.temporalSriYantraRhythm.calculatedAtKst.includes('KST'));
  assert(rep.situationalSriYantraAudit.questionFocus.length > 0);
  const prompt = formatHinduSriYantraSacredGeometryPrompt(rep);
  assert(prompt.includes('힌두 탄트라 스리 얀트라(Sri Yantra) 9대 나바요니 & 바인두 신성기하학'));
  assert(prompt.includes(rep.primaryAvaranaChakra.sanskritName));
  assert(!prompt.includes('%'));
  assert(!prompt.includes('점'));
});

test('Lakota Medicine Wheel Wakan Tanka Engine: calculates 4 sacred directions, balance index and Mitakuye Oyasin', () => {
  const rep = calculateLakotaMedicineWheel(profile);
  assert.equal(rep.engineVersion, LAKOTA_MEDICINE_WHEEL_ENGINE_VERSION);
  assert(rep.eastVisionClarityScore >= 0 && rep.eastVisionClarityScore <= 100);
  assert(rep.southPassionTrustScore >= 0 && rep.southPassionTrustScore <= 100);
  assert(rep.westIntrospectionHealingScore >= 0 && rep.westIntrospectionHealingScore <= 100);
  assert(rep.northEnduranceWisdomScore >= 0 && rep.northEnduranceWisdomScore <= 100);
  assert(rep.medicineWheelBalanceIndex >= 0 && rep.medicineWheelBalanceIndex <= 100);
  assert(rep.mitakuyeOyasinInterconnectedness >= 0 && rep.mitakuyeOyasinInterconnectedness <= 100);
  assert(rep.primarySacredDirection.lakotaTerm.length > 0);
  assert(rep.activeCardinalVirtue.lakotaName.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.lakotaSynthesisMatrix?.integratedAction));
  const prompt = formatLakotaMedicineWheelPrompt(rep);
  assert(prompt.includes('라코타 수(Lakota Sioux)족 와칸 탕카 & 4대 방향 성스러운 의약 휠(Medicine Wheel)'));
  assert(prompt.includes(rep.primarySacredDirection.lakotaTerm));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Korean Gyeogam Yurok Prophecy Engine: calculates Gunggung Euleul, Haein three bounties and crisis resilience', () => {
  const rep = calculateGyeogamYurokProphecy(profile, new Date('2026-11-15T07:05:00+09:00'), '위기와 마음의 중심');
  assert.equal(rep.engineVersion, GYEOGAM_YUROK_VERSION);
  assert(rep.gunggungEuleulSpiritualShieldScore >= 0 && rep.gunggungEuleulSpiritualShieldScore <= 100);
  assert(rep.haeinThreeBountiesGraceIndex >= 0 && rep.haeinThreeBountiesGraceIndex <= 100);
  assert(rep.gyeryongWhiteStonePurityScore >= 0 && rep.gyeryongWhiteStonePurityScore <= 100);
  assert(rep.tenSanctuariesAuspiciousResonance >= 0 && rep.tenSanctuariesAuspiciousResonance <= 100);
  assert(rep.crisisTranscendingResilience >= 0 && rep.crisisTranscendingResilience <= 100);
  assert(rep.sajungGusaengTransformationIndex >= 0 && rep.sajungGusaengTransformationIndex <= 100);
  assert(rep.primaryGyeogamChapter.titleKo.length > 0);
  assert(rep.haeinTalismanType.nameKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalGyeogamRhythm.sipseungWatchWindow.length > 0);
  assert(rep.gyeogamSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatGyeogamYurokProphecyPrompt(rep);
  assert(prompt.includes('조선 명종 격암 남사고 《격암유록(格菴遺錄)》 45편 비결 & 궁궁을을·해인 사중구생'));
  assert(prompt.includes(rep.primaryGyeogamChapter.titleKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Japanese Heian Onmyodo Seimei Engine: calculates 12 heavenly generals, Shikigami resonance and Seimei ward', () => {
  const rep = calculateHeianOnmyodoSeimei(profile, new Date('2026-11-15T06:35:00+09:00'), '사업 계약과 대인관계가 궁금합니다.');
  assert.equal(rep.engineVersion, HEIAN_ONMYODO_SEIMEI_VERSION);
  assert(rep.shikigamiCommandResonance >= 0 && rep.shikigamiCommandResonance <= 100);
  assert(rep.seimeiFivePointedStarWardStrength >= 0 && rep.seimeiFivePointedStarWardStrength <= 100);
  assert(rep.taishanGodDestinyReversalPower >= 0 && rep.taishanGodDestinyReversalPower <= 100);
  assert(rep.yinYangPolarityBalanceScore >= 0 && rep.yinYangPolarityBalanceScore <= 100);
  assert(rep.sixCoursesDivinationAccuracy >= 0 && rep.sixCoursesDivinationAccuracy <= 100);
  assert(rep.primaryGuardianGeneral.nameKo.length > 0);
  assert(rep.secondaryGuardianGeneral.nameKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalOnmyoRhythm.twelveBranchWindow.length > 0);
  assert(rep.onmyoSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatHeianOnmyodoSeimeiPrompt(rep);
  assert(prompt.includes('일본 헤이안 음양도 아베노 세이메이 《점사략》 12천장 & 식신 사역'));
  assert(prompt.includes(rep.primaryGuardianGeneral.nameKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/ 100') && !prompt.includes('점 /') && !prompt.includes('점수'));
});

test('Polynesian Wayfinding Star Compass Engine: calculates Star Compass houses, Zenith stars and Ocean Swell', () => {
  const rep = calculatePolynesianWayfinding(profile);
  assert.equal(rep.engineVersion, POLYNESIAN_WAYFINDING_VERSION);
  assert(rep.oceanSwellSensitivityIndex >= 0 && rep.oceanSwellSensitivityIndex <= 100);
  assert(rep.wayfinderNavigationClarityScore >= 0 && rep.wayfinderNavigationClarityScore <= 100);
  assert(rep.voyagingCanoeBalanceResilience >= 0 && rep.voyagingCanoeBalanceResilience <= 100);
  assert(rep.ancestralManaExplorationForce >= 0 && rep.ancestralManaExplorationForce <= 100);
  assert(rep.islandFindingArrivalCertainty >= 0 && rep.islandFindingArrivalCertainty <= 100);
  assert(rep.primaryStarHouse.hawaiianName.length > 0);
  assert(rep.guidingZenithStar.hawaiianName.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.wayfindingSynthesisMatrix?.integratedAction));
  const prompt = formatPolynesianWayfindingPrompt(rep);
  assert(prompt.includes('고대 폴리네시아 마우이 《웨이파인딩 32방위 스타 컴퍼스》 항해'));
  assert(prompt.includes(rep.primaryStarHouse.hawaiianName));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Korean Wonhyo Hwajaeng One Mind Engine: calculates One Mind Two Gates, Hwajaeng resolution and Mu-Ae freedom', () => {
  const rep = calculateWonhyoHwajaeng(profile);
  assert.equal(rep.engineVersion, WONHYO_HWAJAENG_VERSION);
  assert(rep.oneMindTwoGatesBalance >= 0 && rep.oneMindTwoGatesBalance <= 100);
  assert(rep.hwajaengContradictionResolution >= 0 && rep.hwajaengContradictionResolution <= 100);
  assert(rep.wonhyoMuAeFreedomScore >= 0 && rep.wonhyoMuAeFreedomScore <= 100);
  assert(rep.wonYungWheTongHarmonization >= 0 && rep.wonYungWheTongHarmonization <= 100);
  assert(rep.innerJinYeoPurityIndex >= 0 && rep.innerJinYeoPurityIndex <= 100);
  assert(rep.activeHwajaengGate.gateNameKo.length > 0);
  const prompt = formatWonhyoHwajaengPrompt(rep);
  assert(prompt.includes('신라 원효대사 《십문화쟁론》 일심이문 & 화쟁 원융회통'));
  assert(prompt.includes(rep.activeHwajaengGate.gateNameKo));
});

test('Chinese Mayi Mianxiang Twelve Palaces Engine: calculates 12 palaces, Qi aura luminosity and inner heart morphology', () => {
  const rep = calculateMayiMianxiang(profile, new Date('2026-11-15T07:15:00+09:00'), '관계와 소통의 기색');
  assert.equal(rep.engineVersion, MAYI_MIANXIANG_VERSION);
  assert(rep.innerHeartMorphologyResonance >= 0 && rep.innerHeartMorphologyResonance <= 100);
  assert(rep.qiAuraLuminosityScore >= 0 && rep.qiAuraLuminosityScore <= 100);
  assert(rep.twelvePalacesEquilibriumIndex >= 0 && rep.twelvePalacesEquilibriumIndex <= 100);
  assert(rep.fiveFeaturesVitalityForce >= 0 && rep.fiveFeaturesVitalityForce <= 100);
  assert(rep.yintangManifestationPower >= 0 && rep.yintangManifestationPower <= 100);
  assert(rep.primaryPalace.nameKo.length > 0);
  assert(rep.secondaryPalace.nameKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.temporalMayiRhythm.yintangWatchWindow.length > 0);
  assert(rep.mayiSynthesisMatrix.coreInsight.length > 0);
  const prompt = formatMayiMianxiangPrompt(rep);
  assert(prompt.includes('동양 비전 마의도사 《마의상법》 12궁 관상 & 심상합일 기색'));
  assert(prompt.includes(rep.primaryPalace.nameKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
});

test('Egyptian Amduat Twelve Hours Ra Engine: calculates 12 hours of underworld, Apophis dispelling and Khepri rebirth', () => {
  const rep = calculateEgyptianAmduat(profile);
  assert.equal(rep.engineVersion, EGYPTIAN_AMDUAT_VERSION);
  assert(rep.khepriRebirthLuminosityScore >= 0 && rep.khepriRebirthLuminosityScore <= 100);
  assert(rep.apophisChaosDispellingForce >= 0 && rep.apophisChaosDispellingForce <= 100);
  assert(rep.midnightRaOsirisUnionPower >= 0 && rep.midnightRaOsirisUnionPower <= 100);
  assert(rep.twelveUnderworldGatesMastery >= 0 && rep.twelveUnderworldGatesMastery <= 100);
  assert(rep.mesektetSolarBarqueSteadiness >= 0 && rep.mesektetSolarBarqueSteadiness <= 100);
  assert(rep.currentAmduatHour.hourNumber >= 1 && rep.currentAmduatHour.hourNumber <= 12);
  assert(rep.solarDeityGuardian.nameAncient.length > 0);
  const prompt = formatEgyptianAmduatPrompt(rep);
  assert(prompt.includes('고대 이집트 《암두아트의 서》 12시간 태양신 라의 밤의 저승 항해 & 케프리 부활'));
  assert(prompt.includes(rep.currentAmduatHour.hourNameAncient));
  assert(!prompt.includes('/ 100') && !prompt.includes('점수'));
});

test('Celtic Druid Brehon Law Justice Engine: calculates 4 cosmic justices, Cairde peace pact and Eric compensation', () => {
  const rep = calculateCelticBrehonLaw(profile);
  assert.equal(rep.engineVersion, CELTIC_BREHON_LAW_VERSION);
  assert(rep.cairdePeacePactHarmony >= 0 && rep.cairdePeacePactHarmony <= 100);
  assert(rep.ericCompensationRestoration >= 0 && rep.ericCompensationRestoration <= 100);
  assert(rep.logNEnechHonorFaceValueScore >= 0 && rep.logNEnechHonorFaceValueScore <= 100);
  assert(rep.firFlathaTruthSovereigntyIndex >= 0 && rep.firFlathaTruthSovereigntyIndex <= 100);
  assert(rep.brehonArbitrationClarityPower >= 0 && rep.brehonArbitrationClarityPower <= 100);
  assert(rep.activeJusticeRank.rankNameGaelic.length > 0);
  const prompt = formatCelticBrehonLawPrompt(rep);
  assert(prompt.includes('고대 켈트 드루이드 《브레혼 법전(Brehon Law)》'));
  assert(prompt.includes(rep.activeJusticeRank.rankNameKo));
});

test('Mesopotamian Nisaba Scribe Wisdom Engine: calculates reed stylus precision, lapislazuli tablet and astral mul resonance', () => {
  const rep = calculateMesopotamianNisaba(profile);
  assert.equal(rep.engineVersion, MESOPOTAMIAN_NISABA_VERSION);
  assert(rep.reedStylusPrecisionIndex >= 0 && rep.reedStylusPrecisionIndex <= 100);
  assert(rep.lapislazuliTabletClarityScore >= 0 && rep.lapislazuliTabletClarityScore <= 100);
  assert(rep.edubbaIntellectualGrowth >= 0 && rep.edubbaIntellectualGrowth <= 100);
  assert(rep.sacredNindanMeasureBalance >= 0 && rep.sacredNindanMeasureBalance <= 100);
  assert(rep.astralMulConstellationResonance >= 0 && rep.astralMulConstellationResonance <= 100);
  assert(rep.activeScribeRank.rankSumerian.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.nisabaSynthesisMatrix?.integratedAction));
  const prompt = formatMesopotamianNisabaPrompt(rep);
  assert(prompt.includes('수메르 서기의 수호신 《니사바(Nisaba)》'));
  assert(prompt.includes(rep.activeScribeRank.rankNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Korean Suun Gasi Heon Engine: calculates Yongcheon sword severance, Samgyeong reverence and Bu-Jae-Rae timing', () => {
  const rep = calculateSuunGasiHeon(profile);
  assert.equal(rep.engineVersion, SUUN_GASI_HEON_VERSION);
  assert(rep.yongcheonSwordSeverancePower >= 0 && rep.yongcheonSwordSeverancePower <= 100);
  assert(rep.samgyeongReverenceHarmony >= 0 && rep.samgyeongReverenceHarmony <= 100);
  assert(rep.buJaeRaeTimingAwakening >= 0 && rep.buJaeRaeTimingAwakening <= 100);
  assert(rep.jiGiGeumJiCosmicQiFlow >= 0 && rep.jiGiGeumJiCosmicQiFlow <= 100);
  assert(rep.sudeokHeartPurityIndex >= 0 && rep.sudeokHeartPurityIndex <= 100);
  assert(rep.activeCultivationStage.stageNameKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.suunGasiSynthesisMatrix?.integratedAction));
  const prompt = formatSuunGasiHeonPrompt(rep);
  assert(prompt.includes('동학 수운 최제우 《용담유사》 검결(劍訣)'));
  assert(prompt.includes(rep.activeCultivationStage.stageNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ancient Greek Eleusinian Triptolemos Engine: calculates dragon chariot, sacred wheat and 3 laws of Demeter', () => {
  const rep = calculateEleusinianTriptolemos(profile, '새로운 일을 시작하며 좋은 씨앗을 뿌리고 싶습니다', new Date('2026-11-15T05:00:00Z'));
  assert.equal(rep.engineVersion, ELEUSINIAN_TRIPTOLEMOS_VERSION);
  assert(rep.goldenChariotFlightIndex >= 0 && rep.goldenChariotFlightIndex <= 100);
  assert(rep.sacredWheatCivilizationForce >= 0 && rep.sacredWheatCivilizationForce <= 100);
  assert(rep.demeterBlessingPurityScore >= 0 && rep.demeterBlessingPurityScore <= 100);
  assert(rep.threeLawsHarmonyEquilibrium >= 0 && rep.threeLawsHarmonyEquilibrium <= 100);
  assert(rep.seedSowingAbundancePower >= 0 && rep.seedSowingAbundancePower <= 100);
  assert(rep.activeChariotStage.stageNameGreek.length > 0);
  assert(rep.situationalEleusisAudit.homericHymnCitation.length > 0);
  assert(rep.temporalEleusisRhythm.eleusisFlightWindow.length > 0);
  assert(rep.triptolemosSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatEleusinianTriptolemosPrompt(rep);
  assert(prompt.includes('고대 그리스 엘레우시스 밀의 《트리프톨레모스(Triptolemos)》'));
  assert(prompt.includes(rep.activeChariotStage.stageNameKo));
  assert(!prompt.includes('%'));
  assert(!prompt.includes('/100'));
});

test('Mesoamerican Mixtec Eight Deer Jaguar Claw Engine: calculates courage, sacred alliance, cave oracle and territorial balance', () => {
  const rep = calculateMixtecEightDeer(profile);
  assert.equal(rep.engineVersion, MIXTEC_EIGHT_DEER_VERSION);
  assert(rep.jaguarClawCourageForce >= 0 && rep.jaguarClawCourageForce <= 100);
  assert(rep.sacredAllianceUnificationScore >= 0 && rep.sacredAllianceUnificationScore <= 100);
  assert(rep.ancestralCaveOracleClarity >= 0 && rep.ancestralCaveOracleClarity <= 100);
  assert(rep.mountainCoastSynthesisBalance >= 0 && rep.mountainCoastSynthesisBalance <= 100);
  assert(rep.turquoiseNoseOrnamentHonor >= 0 && rep.turquoiseNoseOrnamentHonor <= 100);
  assert(rep.activeHeroRank.rankNameMixtec.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.mixtecSynthesisMatrix?.integratedAction));
  const prompt = formatMixtecEightDeerPrompt(rep);
  assert(prompt.includes('메소아메리카 믹스테크 《8-사슴 재규어 발톱(Eight Deer)》'));
  assert(prompt.includes(rep.activeHeroRank.rankNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Korean Jeon Bongjun Nokdu General Engine: calculates Sabal Tongmun solidarity, Baeksan righteous force and 4 manifestos', () => {
  const rep = calculateJeonBongjunNokdu(profile);
  assert.equal(rep.engineVersion, JEON_BONGJUN_NOKDU_VERSION);
  assert(rep.sabalTongmunHorizontalSolidarity >= 0 && rep.sabalTongmunHorizontalSolidarity <= 100);
  assert(rep.baeksanRighteousForce >= 0 && rep.baeksanRighteousForce <= 100);
  assert(rep.jepokGuminSalvationPower >= 0 && rep.jepokGuminSalvationPower <= 100);
  assert(rep.bogukAnminPeaceStabilityScore >= 0 && rep.bogukAnminPeaceStabilityScore <= 100);
  assert(rep.cheongpodoSpringResilience >= 0 && rep.cheongpodoSpringResilience <= 100);
  assert(rep.activeNokduStage.stageNameHanja.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.nokduSynthesisMatrix?.integratedAction));
  const prompt = formatJeonBongjunNokduPrompt(rep);
  assert(prompt.includes('한국 근대 동학농민혁명 《녹두장군 전봉준》'));
  assert(prompt.includes(rep.activeNokduStage.stageNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Mesopotamian Atrahasis Flood Wisdom Engine: calculates reed wall intuition, ark crafting resilience and equilibrium pact', () => {
  const rep = calculateAtrahasisFlood(profile);
  assert.equal(rep.engineVersion, ATRAHASIS_FLOOD_VERSION);
  assert(rep.reedWallIntuitionScore >= 0 && rep.reedWallIntuitionScore <= 100);
  assert(rep.arkCraftingResilienceForce >= 0 && rep.arkCraftingResilienceForce <= 100);
  assert(rep.sevenDayStormPurificationIndex >= 0 && rep.sevenDayStormPurificationIndex <= 100);
  assert(rep.seedPreservationWisdomPower >= 0 && rep.seedPreservationWisdomPower <= 100);
  assert(rep.sacredEquilibriumPactHarmony >= 0 && rep.sacredEquilibriumPactHarmony <= 100);
  assert(rep.activeWisdomRank.rankNameAkkadian.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.atrahasisSynthesisMatrix?.integratedAction));
  const prompt = formatAtrahasisFloodPrompt(rep);
  assert(prompt.includes('고대 메소포타미아 서사시 《아트라하시스(Atrahasis)》'));
  assert(prompt.includes(rep.activeWisdomRank.rankNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Scandinavian Eddic Yggdrasil Nine Realms Engine: calculates cosmic axis, Urðarbrunnr fate weaving, Mímir wisdom and Gimlé renewal', () => {
  const rep = calculateEddicYggdrasil(profile);
  assert.equal(rep.engineVersion, EDDIC_YGGDRASIL_VERSION);
  assert(rep.yggdrasilCosmicAxisStability >= 0 && rep.yggdrasilCosmicAxisStability <= 100);
  assert(rep.urdarbrunnrFateWeavingForce >= 0 && rep.urdarbrunnrFateWeavingForce <= 100);
  assert(rep.mimirSpringWisdomDepth >= 0 && rep.mimirSpringWisdomDepth <= 100);
  assert(rep.nineRealmsResonanceEquilibrium >= 0 && rep.nineRealmsResonanceEquilibrium <= 100);
  assert(rep.gimleGoldenRenewalPower >= 0 && rep.gimleGoldenRenewalPower <= 100);
  assert(rep.activeRealmStage.stageNameOldNorse.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.eddicSynthesisMatrix?.integratedAction));
  const prompt = formatEddicYggdrasilPrompt(rep);
  assert(prompt.includes('고대 북유럽 고에다 《위그드라실(Yggdrasil)》'));
  assert(prompt.includes(rep.activeRealmStage.stageNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Korean Yi Sun-sin Nanjung Ilgi Strategic Engine: calculates Pilsa Jeuksaeng resolution, chokepoint tactic and Hansando composure', () => {
  const rep = calculateYiSunSinNanjungIlgi(profile);
  assert.equal(rep.engineVersion, YISUNSIN_NANJUNG_ILGI_VERSION);
  assert(rep.pilsaJeuksaengResolutionForce >= 0 && rep.pilsaJeuksaengResolutionForce <= 100);
  assert(rep.ilbuDanggyeongNarrowChokepointPower >= 0 && rep.ilbuDanggyeongNarrowChokepointPower <= 100);
  assert(rep.hansandoMoonlitComposureScore >= 0 && rep.hansandoMoonlitComposureScore <= 100);
  assert(rep.reconnaissanceIntelClarityIndex >= 0 && rep.reconnaissanceIntelClarityIndex <= 100);
  assert(rep.geobukseonImpregnableShieldPower >= 0 && rep.geobukseonImpregnableShieldPower <= 100);
  assert(rep.activeStrategicStage.stageNameHanja.length > 0);
  assert(rep.secondaryStrategicStage.stageLevel !== rep.activeStrategicStage.stageLevel);
  assert(rep.secondaryChungmuVirtue.hanjaMotto !== rep.primaryChungmuVirtue.hanjaMotto);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.yiSunSinSynthesisMatrix?.integratedAction));
  const repQ = calculateYiSunSinNanjungIlgi(profile, '반드시 먼저 지켜야 할 좁은 길목');
  assert(repQ.reflectiveQuestion.includes('좁은 길목'));
  const prompt = formatYiSunSinNanjungIlgiPrompt(repQ);
  assert(prompt.includes('충무공 이순신 장군 친필 《난중일기(亂中日記)》'));
  assert(prompt.includes(repQ.activeStrategicStage.stageNameKo));
  assert(prompt.includes(repQ.secondaryStrategicStage.stageNameKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ancient Egyptian Ptah Memphite Theology Engine: calculates heart thought conceptualization, tongue utterance and Maat alignment', () => {
  const rep = calculatePtahMemphite(profile, '새 프로젝트를 구상하고 현실로 구현하고 싶습니다', new Date('2026-11-15T05:00:00Z'));
  assert.equal(rep.engineVersion, PTAH_MEMPHITE_VERSION);
  assert(rep.heartThoughtConceptualizationIndex >= 0 && rep.heartThoughtConceptualizationIndex <= 100);
  assert(rep.tongueUtteranceManifestationForce >= 0 && rep.tongueUtteranceManifestationForce <= 100);
  assert(rep.divineKaVitalityInfusionScore >= 0 && rep.divineKaVitalityInfusionScore <= 100);
  assert(rep.maatCosmicTruthAlignment >= 0 && rep.maatCosmicTruthAlignment <= 100);
  assert(rep.artisanMasteryPrecisionPower >= 0 && rep.artisanMasteryPrecisionPower <= 100);
  assert(rep.activeCreationStage.stageNameAncient.length > 0);
  assert(rep.situationalPtahAudit.shabakaInscription.length > 0);
  assert(rep.temporalPtahRhythm.workshopWindow.length > 0);
  assert(rep.ptahSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatPtahMemphitePrompt(rep);
  assert(prompt.includes('고대 이집트 멤피스 신학 《프타(Ptah)》'));
  assert(prompt.includes(rep.activeCreationStage.stageNameKo));
  assert(!prompt.includes('%'));
  assert(!prompt.includes('/100'));
});

test('Celtic Tuatha Dé Danann Lugh Samildánach Engine: calculates polymath integrity, spear precision, Tara hall admission and Mag Tuired victory', () => {
  const rep = calculateLughSamildanach(profile);
  assert.equal(rep.engineVersion, LUGH_SAMILDANACH_VERSION);
  assert(rep.samildanachPolymathIntegrityIndex >= 0 && rep.samildanachPolymathIntegrityIndex <= 100);
  assert(rep.areadbharSpearOfLightPrecision >= 0 && rep.areadbharSpearOfLightPrecision <= 100);
  assert(rep.taraHallAdmissionWorthiness >= 0 && rep.taraHallAdmissionWorthiness <= 100);
  assert(rep.magTuiredStrategicVictoryPower >= 0 && rep.magTuiredStrategicVictoryPower <= 100);
  assert(rep.eightArtsHarmoniousMastery >= 0 && rep.eightArtsHarmoniousMastery <= 100);
  assert(rep.activeCraftRank.rankNameOldIrish.length > 0);
  const prompt = formatLughSamildanachPrompt(rep);
  assert(prompt.includes('켈트 투아하 데 다난 《루 라바다(Lugh Samildánach)》'));
  assert(prompt.includes(rep.activeCraftRank.rankNameKo));
});

test('Korean Choe Hyeon-bae Hangeul Geulbon Engine: calculates Korean soul preservation, linguistic empowerment, plain words and prison resilience', () => {
  const rep = calculateChoeHyeonbaeGeulbon(profile);
  assert.equal(rep.engineVersion, CHOE_HYEONBAE_GEULBON_VERSION);
  assert(rep.koreanSoulPreservationIndex >= 0 && rep.koreanSoulPreservationIndex <= 100);
  assert(rep.geulbonLinguisticEmpowermentForce >= 0 && rep.geulbonLinguisticEmpowermentForce <= 100);
  assert(rep.plainWordsCommunicationClarity >= 0 && rep.plainWordsCommunicationClarity <= 100);
  assert(rep.prisonResilienceUnbendingFaith >= 0 && rep.prisonResilienceUnbendingFaith <= 100);
  assert(rep.hangulRevivalCivilizationPower >= 0 && rep.hangulRevivalCivilizationPower <= 100);
  assert(rep.activeGeulbonStage.stageNameHanja.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.geulbonSynthesisMatrix?.integratedAction));
  const prompt = formatChoeHyeonbaeGeulbonPrompt(rep);
  assert(prompt.includes('외솔 최현배 선생 《우리말본》'));
  assert(prompt.includes(rep.activeGeulbonStage.stageNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ancient Persian Zoroastrian Amesha Spentas Engine: calculates Vohu Manah, Asha Vahishta truth, Spenta Armaiti and Garothman light', () => {
  const rep = calculateZoroastrianAmeshaSpentas(profile, '갈등 상황에서 올바른 선택을 하고 싶습니다', new Date('2026-11-15T05:00:00Z'));
  assert.equal(rep.engineVersion, ZOROASTRIAN_AMESHA_SPENTAS_VERSION);
  assert(rep.vohuManahGoodMindIndex >= 0 && rep.vohuManahGoodMindIndex <= 100);
  assert(rep.ashaVahishtaCosmicTruthForce >= 0 && rep.ashaVahishtaCosmicTruthForce <= 100);
  assert(rep.spentaArmaitiHolyDevotionScore >= 0 && rep.spentaArmaitiHolyDevotionScore <= 100);
  assert(rep.haurvatatWholenessHealingPower >= 0 && rep.haurvatatWholenessHealingPower <= 100);
  assert(rep.ameretatImmortalityVitality >= 0 && rep.ameretatImmortalityVitality <= 100);
  assert(rep.activeSpentaStage.stageNameAvestan.length > 0);
  assert(rep.situationalAvestaAudit.gathasCitation.length > 0);
  assert(rep.temporalAtarRhythm.gahWatchWindow.length > 0);
  assert(rep.ameshaSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatZoroastrianAmeshaSpentasPrompt(rep);
  assert(prompt.includes('고대 페르시아 조로아스터교 《아베스타(Avesta)》'));
  assert(prompt.includes(rep.activeSpentaStage.stageNameKo));
  assert(!prompt.includes('%'));
  assert(!prompt.includes('/100'));
});

test('Ancient Greek Delphic Chilon Know Thyself Engine: calculates Gnothi Seauton self-knowledge, Meden Agan moderation and Spartan brevity', () => {
  const rep = calculateDelphicChilon(profile, '중요한 약속과 결정을 앞두고 조심스럽습니다', new Date('2026-11-15T05:00:00Z'));
  assert.equal(rep.engineVersion, DELPHIC_CHILON_VERSION);
  assert(rep.gnothiSeautonSelfKnowledgeIndex >= 0 && rep.gnothiSeautonSelfKnowledgeIndex <= 100);
  assert(rep.medenAganModerationEquilibrium >= 0 && rep.medenAganModerationEquilibrium <= 100);
  assert(rep.enguaPrudenceDiscretionForce >= 0 && rep.enguaPrudenceDiscretionForce <= 100);
  assert(rep.laconicBrevityClarityScore >= 0 && rep.laconicBrevityClarityScore <= 100);
  assert(rep.spartanEnduranceTemperancePower >= 0 && rep.spartanEnduranceTemperancePower <= 100);
  assert(rep.activeSageStage.stageNameGreek.length > 0);
  assert(rep.situationalChilonAudit.delphicInscription.length > 0);
  assert(rep.temporalDelphicRhythm.sanctuaryWindow.length > 0);
  assert(rep.chilonSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatDelphicChilonPrompt(rep);
  assert(prompt.includes('델포이 아폴론 신전 7현인 《스파르타의 킬론(Chilon)》'));
  assert(prompt.includes(rep.activeSageStage.stageNameKo));
  assert(!prompt.includes('%'));
  assert(!prompt.includes('/100'));
});

test('Korean Jeong Yak-yong Mongmin Simseo Engine: calculates Cheongnyeom integrity, Yulgi self-discipline and Aemin compassion', () => {
  const rep = calculateJeongYakyongMongmin(profile);
  assert.equal(rep.engineVersion, JEONG_YAKYONG_MONGMIN_VERSION);
  assert(rep.cheongnyeomIntegrityPurityScore >= 0 && rep.cheongnyeomIntegrityPurityScore <= 100);
  assert(rep.yulgiSelfDisciplineForce >= 0 && rep.yulgiSelfDisciplineForce <= 100);
  assert(rep.aeminCompassionWelfarePower >= 0 && rep.aeminCompassionWelfarePower <= 100);
  assert(rep.bonggongPublicDutyLoyaltyIndex >= 0 && rep.bonggongPublicDutyLoyaltyIndex <= 100);
  assert(rep.jinhwangCrisisManagementResilience >= 0 && rep.jinhwangCrisisManagementResilience <= 100);
  assert(rep.activeOfficialStage.stageNameHanja.length > 0);
  assert(rep.secondaryOfficialStage.stageLevel !== rep.activeOfficialStage.stageLevel);
  assert(rep.secondaryMongminVirtue.virtueNameKo !== rep.primaryMongminVirtue.virtueNameKo);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.mongminSynthesisMatrix?.integratedAction));
  const repQ = calculateJeongYakyongMongmin(profile, '사사로운 편의를 끊고 지켜야 할 원칙');
  assert(repQ.reflectiveQuestion.includes('지켜야 할 원칙'));
  const prompt = formatJeongYakyongMongminPrompt(repQ);
  assert(prompt.includes('다산 정약용 선생 《목민심서(牧民心書)》'));
  assert(prompt.includes(repQ.activeOfficialStage.stageNameKo));
  assert(prompt.includes(repQ.secondaryOfficialStage.stageNameKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ancient Greek Heraclitus Panta Rhei Engine: calculates flux index, Logos harmony, eternal fire and hidden harmonia', () => {
  const rep = calculateHeraclitusPantaRhei(profile, '이직과 새로운 변화 앞에서 갈등이 커서 불안해요', new Date('2026-11-14T00:00:00Z'));
  assert.equal(rep.engineVersion, HERACLITUS_PANTA_RHEI_VERSION);
  assert(rep.pantaRheiFluxIndex >= 0 && rep.pantaRheiFluxIndex <= 100);
  assert(rep.logosHarmoniaScore >= 0 && rep.logosHarmoniaScore <= 100);
  assert(rep.eternalFireVitality >= 0 && rep.eternalFireVitality <= 100);
  assert(rep.hiddenHarmoniaStrength >= 0 && rep.hiddenHarmoniaStrength <= 100);
  assert(rep.enantiodromiaBalance >= 0 && rep.enantiodromiaBalance <= 100);
  assert(rep.activeHeraclitusStage.stageNameGreek.length > 0);
  assert.equal(rep.situationalReflection.theme, 'transition_flux');
  assert(rep.situationalReflection.reflectionPrompt.length > 0);
  assert(rep.temporalFluxContext.dayPhaseKo.length > 0);
  assert(rep.dialecticPolarityMatrix.tensionHarmonyRatio >= 0 && rep.dialecticPolarityMatrix.tensionHarmonyRatio <= 100);
  const prompt = formatHeraclitusPantaRheiPrompt(rep);
  assert(prompt.includes('에페소스 헤라클레이토스 만물유전(Panta Rhei)'));
  assert(prompt.includes(rep.activeHeraclitusStage.stageNameKo));
  assert(prompt.includes(rep.situationalReflection.fragmentRef));
});

test('Ancient Chinese Mozi Gyeom-Ae Universal Love Engine: calculates Gyeom-Ae love, Gyo-Ri mutual benefit and Bi-Gong shield', () => {
  const rep = calculateMoziGyeomAe(profile);
  assert.equal(rep.engineVersion, MOZI_GYEOM_AE_VERSION);
  assert(rep.gyeomAeUniversalLoveScore >= 0 && rep.gyeomAeUniversalLoveScore <= 100);
  assert(rep.gyoRiMutualBenefitIndex >= 0 && rep.gyoRiMutualBenefitIndex <= 100);
  assert(rep.biGongPeaceShieldForce >= 0 && rep.biGongPeaceShieldForce <= 100);
  assert(rep.jeolYongSimplicityPurity >= 0 && rep.jeolYongSimplicityPurity <= 100);
  assert(rep.tianZhiCosmicJusticeScore >= 0 && rep.tianZhiCosmicJusticeScore <= 100);
  assert(rep.activeMohistStage.stageNameHanja.length > 0);
  const prompt = formatMoziGyeomAePrompt(rep);
  assert(prompt.includes('춘추전국시대 묵가(墨家) 묵자(墨子) 겸애교리'));
  assert(prompt.includes(rep.activeMohistStage.stageNameKo));
});

test('Roman Marcus Aurelius Inner Citadel Meditations Engine: calculates Inner Citadel score, Hic et nunc and Amor Fati', () => {
  const rep = calculateAureliusInnerCitadel(profile, '타인의 평가와 평판 때문에 마음이 흔들려요', new Date('2026-11-14T12:00:00Z'));
  assert.equal(rep.engineVersion, AURELIUS_INNER_CITADEL_VERSION);
  assert(rep.innerCitadelFortressScore >= 0 && rep.innerCitadelFortressScore <= 100);
  assert(rep.hicEtNuncPresentPresence >= 0 && rep.hicEtNuncPresentPresence <= 100);
  assert(rep.amorFatiCosmicAcceptance >= 0 && rep.amorFatiCosmicAcceptance <= 100);
  assert(rep.cosmopolisCommonGoodIndex >= 0 && rep.cosmopolisCommonGoodIndex <= 100);
  assert(rep.hegemonikonSovereignSoul >= 0 && rep.hegemonikonSovereignSoul <= 100);
  assert(rep.activeAureliusStage.stageNameLatin.length > 0);
  assert.equal(rep.controlDichotomy.theme, 'external_judgment');
  assert(rep.controlDichotomy.internalSovereigntyRatio >= 0 && rep.controlDichotomy.internalSovereigntyRatio <= 100);
  assert(rep.dailyStoicPractice.protocolDirective.length > 0);
  assert(rep.citadelResilienceMatrix.amorFatiConversionIndex >= 0 && rep.citadelResilienceMatrix.amorFatiConversionIndex <= 100);
  const prompt = formatAureliusInnerCitadelPrompt(rep);
  assert(prompt.includes('고대 로마 마르쿠스 아우렐리우스 《명상록(Meditations)》'));
  assert(prompt.includes(rep.activeAureliusStage.stageNameKo));
  assert(prompt.includes(rep.controlDichotomy.bookReference));
});

test('Chinese Laozi Daodejing Water Way Engine: calculates water yielding adaptability, wuwei action and contentment', () => {
  const rep = calculateLaoziDaodejing(profile, '치열한 경쟁 속에서 다툼 없이 현명하게 대처하고 싶어요', new Date('2026-11-14T06:00:00Z'));
  assert.equal(rep.engineVersion, LAOZI_DAODEJING_VERSION);
  assert(rep.waterYieldingAdaptabilityScore >= 0 && rep.waterYieldingAdaptabilityScore <= 100);
  assert(rep.wuweiEffortlessActionForce >= 0 && rep.wuweiEffortlessActionForce <= 100);
  assert(rep.harmoniousLightSofteningIndex >= 0 && rep.harmoniousLightSofteningIndex <= 100);
  assert(rep.contentmentNonGraspingPower >= 0 && rep.contentmentNonGraspingPower <= 100);
  assert(rep.greatVesselPatienceMaturity >= 0 && rep.greatVesselPatienceMaturity <= 100);
  assert(rep.activeDaodejingStage.stageNameHanja.length > 0);
  assert.equal(rep.chapterResonance.chapterNumber, 8);
  assert(rep.seasonalWaterFlow.waterPacingScore >= 0 && rep.seasonalWaterFlow.waterPacingScore <= 100);
  assert(rep.softStrengthMatrix.nonContentionHarmonyScore >= 0 && rep.softStrengthMatrix.nonContentionHarmonyScore <= 100);
  const prompt = formatLaoziDaodejingPrompt(rep);
  assert(prompt.includes('고대 중국 노자(老子) 《도덕경(道德經)》'));
  assert(prompt.includes(rep.activeDaodejingStage.stageNameKo));
  assert(prompt.includes(rep.chapterResonance.chapterTitle));
});

test('Ancient Greek Epicurean Tetrapharmakos Engine: calculates ataraxia tranquility, aponia ease and friendship', () => {
  const rep = calculateEpicureanTetrapharmakos(profile);
  assert.equal(rep.engineVersion, EPICUREAN_TETRAPHARMAKOS_VERSION);
  assert(rep.ataraxiaSoulTranquilityScore >= 0 && rep.ataraxiaSoulTranquilityScore <= 100);
  assert(rep.aponiaPhysicalEaseBalance >= 0 && rep.aponiaPhysicalEaseBalance <= 100);
  assert(rep.tetrapharmakosRemedyMastery >= 0 && rep.tetrapharmakosRemedyMastery <= 100);
  assert(rep.philiaGardenFriendshipForce >= 0 && rep.philiaGardenFriendshipForce <= 100);
  assert(rep.katastematicPleasureClarity >= 0 && rep.katastematicPleasureClarity <= 100);
  assert(rep.activeEpicureanStage.stageNameGreek.length > 0);
  const prompt = formatEpicureanTetrapharmakosPrompt(rep);
  assert(prompt.includes('고대 그리스 에피쿠로스 《테트라파르마코스》'));
  assert(prompt.includes(rep.activeEpicureanStage.stageNameKo));
});

test('Korean Yulgok Yi I Gyeokmong Yogyeol Engine: calculates noble aspiration ipji, habit reform and nine mindfulness manners', () => {
  const rep = calculateYulgokGyeokmong(profile);
  assert.equal(rep.engineVersion, YULGOK_GYEOKMONG_VERSION);
  assert(rep.ipjiNobleAspirationIndex >= 0 && rep.ipjiNobleAspirationIndex <= 100);
  assert(rep.hyeokguseupOldHabitReformForce >= 0 && rep.hyeokguseupOldHabitReformForce <= 100);
  assert(rep.guyongGusaComposureMindfulness >= 0 && rep.guyongGusaComposureMindfulness <= 100);
  assert(rep.dokseoInquiryPracticalWisdom >= 0 && rep.dokseoInquiryPracticalWisdom <= 100);
  assert(rep.jisinMoralDignitySincerity >= 0 && rep.jisinMoralDignitySincerity <= 100);
  assert(rep.activeScholarStage.stageNameHanja.length > 0);
  assert(rep.secondaryScholarStage.stageLevel !== rep.activeScholarStage.stageLevel);
  assert(rep.secondaryYulgokPrecept.hanjaMotto !== rep.primaryYulgokPrecept.hanjaMotto);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.yulgokSynthesisMatrix?.integratedAction));
  const repQ = calculateYulgokGyeokmong(profile, '미루던 옛 습관을 끊고 바로 세울 뜻');
  assert(repQ.reflectiveQuestion.includes('바로 세울 뜻'));
  const prompt = formatYulgokGyeokmongPrompt(repQ);
  assert(prompt.includes('조선 율곡 이이(栗谷 李珥) 《격몽요결(擊蒙要訣)》'));
  assert(prompt.includes(repQ.activeScholarStage.stageNameKo));
  assert(prompt.includes(repQ.secondaryScholarStage.stageNameKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('%'));
  assert(!prompt.includes('/100'));
});

test('Ancient Greek Aristotle Mesotes Eudaimonia Engine: calculates Golden Mean, Eudaimonia, Phronesis and Telos', () => {
  const rep = calculateAristotleMesotes(profile);
  assert.equal(rep.engineVersion, ARISTOTLE_MESOTES_VERSION);
  assert(rep.mesotesGoldenMeanScore >= 0 && rep.mesotesGoldenMeanScore <= 100);
  assert(rep.eudaimoniaFlourishingIndex >= 0 && rep.eudaimoniaFlourishingIndex <= 100);
  assert(rep.phronesisPracticalWisdom >= 0 && rep.phronesisPracticalWisdom <= 100);
  assert(rep.telosPurposeOrientation >= 0 && rep.telosPurposeOrientation <= 100);
  assert(rep.areteExcellenceIntegrity >= 0 && rep.areteExcellenceIntegrity <= 100);
  assert(rep.activeVirtueStage.virtueNameGreek.length > 0);
  const prompt = formatAristotleMesotesPrompt(rep);
  assert(prompt.includes('고대 그리스 아리스토텔레스 니코마코스 윤리학 중용(Mesotes)'));
  assert(prompt.includes(rep.activeVirtueStage.virtueNameKo));
});

test('Ancient Indian Bhagavad Gita Karma Yoga Engine: calculates Nishkama Karma, Swadharma, Samatvam and Yogastha', () => {
  const rep = calculateBhagavadGitaKarmaYoga(profile);
  assert.equal(rep.engineVersion, BHAGAVAD_GITA_KARMA_YOGA_VERSION);
  assert(rep.nishkamaKarmaDetachmentScore >= 0 && rep.nishkamaKarmaDetachmentScore <= 100);
  assert(rep.swadharmaCallingAlignment >= 0 && rep.swadharmaCallingAlignment <= 100);
  assert(rep.samatvamEquanimityIndex >= 0 && rep.samatvamEquanimityIndex <= 100);
  assert(rep.yogasthaSteadfastness >= 0 && rep.yogasthaSteadfastness <= 100);
  assert(rep.karmaphalaRenunciation >= 0 && rep.karmaphalaRenunciation <= 100);
  assert(rep.activeGitaStage.sanskritStage.length > 0);
  const prompt = formatBhagavadGitaKarmaYogaPrompt(rep);
  assert(prompt.includes('고대 인도 바가바드 기타(Bhagavad Gita) 카르마 요가'));
  assert(prompt.includes(rep.activeGitaStage.stageNameKo));
});

test('Chinese Wang Yangming Liangzhi Xinxue Engine: calculates Liangzhi intuition, Zhi-Xing unity and mind integrity', () => {
  const rep = calculateWangYangmingXinxue(profile);
  assert.equal(rep.engineVersion, WANG_YANGMING_LIANGZHI_VERSION);
  assert(rep.liangzhiIntuitionScore >= 0 && rep.liangzhiIntuitionScore <= 100);
  assert(rep.zhiXingUnityPower >= 0 && rep.zhiXingUnityPower <= 100);
  assert(rep.xinZhiLiMindCoreIntegrity >= 0 && rep.xinZhiLiMindCoreIntegrity <= 100);
  assert(rep.shiShangMoLianResilience >= 0 && rep.shiShangMoLianResilience <= 100);
  assert(rep.baBenSaiYuanSelflessPurity >= 0 && rep.baBenSaiYuanSelflessPurity <= 100);
  assert(rep.activeXinxueStage.stageNameHanja.length > 0);
  const prompt = formatWangYangmingXinxuePrompt(rep);
  assert(prompt.includes('명나라 양명학 왕양명(王陽明) 치양지(致良知)'));
  assert(prompt.includes(rep.activeXinxueStage.stageNameKo));
});

test('Ancient Greek Socratic Maieutic Daimon Engine: calculates dialogue, daimonion, docta ignorantia and soul care', () => {
  const rep = calculateSocraticMaieuticDaimon(profile);
  assert.equal(rep.engineVersion, SOCRATIC_MAIEUTIC_DAIMON_VERSION);
  assert(rep.maieuticDialogueScore >= 0 && rep.maieuticDialogueScore <= 100);
  assert(rep.daimonionWarningSensitivity >= 0 && rep.daimonionWarningSensitivity <= 100);
  assert(rep.doctaIgnorantiaHumility >= 0 && rep.doctaIgnorantiaHumility <= 100);
  assert(rep.elenchusRefutationClarity >= 0 && rep.elenchusRefutationClarity <= 100);
  assert(rep.epimeleiaSoulCareIntegrity >= 0 && rep.epimeleiaSoulCareIntegrity <= 100);
  assert(rep.activeSocraticStage.stageNameGreek.length > 0);
  const prompt = formatSocraticMaieuticDaimonPrompt(rep);
  assert(prompt.includes('고대 그리스 소크라테스 산파술 & 다이몬 영혼성찰 지표'));
  assert(prompt.includes(rep.activeSocraticStage.stageNameKo));
});

test('Chinese Mencius Four Sprouts Hoyeon Jigi Engine: calculates four sprouts, Hoyeon-jigi, Bu-dong-xin and moral accumulation', () => {
  const rep = calculateMenciusFourSproutsHoyeon(profile);
  assert.equal(rep.engineVersion, MENCIUS_FOUR_SPROUTS_HOYEON_VERSION);
  assert(rep.hoyeonJigiGreatVitalityScore >= 0 && rep.hoyeonJigiGreatVitalityScore <= 100);
  assert(rep.fourSproutsCultivationLevel >= 0 && rep.fourSproutsCultivationLevel <= 100);
  assert(rep.buDongXinSteadfastness >= 0 && rep.buDongXinSteadfastness <= 100);
  assert(rep.jiYiMoralAccumulation >= 0 && rep.jiYiMoralAccumulation <= 100);
  assert(rep.daejangbuNobility >= 0 && rep.daejangbuNobility <= 100);
  assert(rep.activeMenciusStage.stageNameHanja.length > 0);
  const prompt = formatMenciusFourSproutsHoyeonPrompt(rep);
  assert(prompt.includes('고대 중국 맹자 사단사덕(四端四德) & 호연지기(浩然之氣) 성찰'));
  assert(prompt.includes(rep.activeMenciusStage.stageNameKo));
});

test('Roman Seneca Time Sovereignty Tranquility Engine: calculates time sovereignty, tranquillitas and present living', () => {
  const rep = calculateSenecaTimeSovereignty(profile);
  assert.equal(rep.engineVersion, SENECA_TIME_SOVEREIGNTY_VERSION);
  assert(rep.timeSovereigntyReclaimScore >= 0 && rep.timeSovereigntyReclaimScore <= 100);
  assert(rep.tranquillitasInnerPeaceIndex >= 0 && rep.tranquillitasInnerPeaceIndex <= 100);
  assert(rep.presentMomentLivingPower >= 0 && rep.presentMomentLivingPower <= 100);
  assert(rep.stoicAutarkeiaResilience >= 0 && rep.stoicAutarkeiaResilience <= 100);
  assert(rep.animiFluctuatioRelief >= 0 && rep.animiFluctuatioRelief <= 100);
  assert(rep.activeSenecaStage.stageNameLatin.length > 0);
  const prompt = formatSenecaTimeSovereigntyPrompt(rep);
  assert(prompt.includes('고대 로마 세네카 인생의 짧음에 대하여 & 시간 주권 평정 지표'));
  assert(prompt.includes(rep.activeSenecaStage.stageNameKo));
});

test('Ancient Greek Platonic Idea Cave Engine: calculates Idea of Good, Cave liberation, Anamnesis and Cardinal Virtues', () => {
  const rep = calculatePlatonicIdeaCave(profile);
  assert.equal(rep.engineVersion, PLATONIC_IDEA_CAVE_VERSION);
  assert(rep.ideaTruthOrientationScore >= 0 && rep.ideaTruthOrientationScore <= 100);
  assert(rep.shadowIllusionLiberationScore >= 0 && rep.shadowIllusionLiberationScore <= 100);
  assert(rep.anamnesisSoulIntuitionScore >= 0 && rep.anamnesisSoulIntuitionScore <= 100);
  assert(rep.cardinalVirtuesHarmonyScore >= 0 && rep.cardinalVirtuesHarmonyScore <= 100);
  assert(rep.dialecticAscentPowerScore >= 0 && rep.dialecticAscentPowerScore <= 100);
  assert(rep.activeAscentStage.stageNameGreek.length > 0);
  const prompt = formatPlatonicIdeaCavePrompt(rep);
  assert(prompt.includes('고대 그리스 플라톤 동굴의 비유 & 이데아 4대 추덕 지표'));
  assert(prompt.includes(rep.activeAscentStage.stageNameKo));
});

test('Korean Joseon Toegye Seonghak Sipdo Engine: calculates Gyeong mindfulness, Geogyeong Gungri, Sangseongseong and Dignity', () => {
  const rep = calculateToegyeSeonghakSipdo(profile);
  assert.equal(rep.engineVersion, TOEGYE_SEONGHAK_SIPDO_VERSION);
  assert(rep.gyeongMindfulnessFocusScore >= 0 && rep.gyeongMindfulnessFocusScore <= 100);
  assert(rep.geogyeongGungriPrecisionScore >= 0 && rep.geogyeongGungriPrecisionScore <= 100);
  assert(rep.sangseongseongAwakeningScore >= 0 && rep.sangseongseongAwakeningScore <= 100);
  assert(rep.jeongjeEomsukDignityScore >= 0 && rep.jeongjeEomsukDignityScore <= 100);
  assert(rep.seonghakIntegrationPracticeScore >= 0 && rep.seonghakIntegrationPracticeScore <= 100);
  assert(rep.activeSeonghakDiagram.diagramTitleHanja.length > 0);
  assert(rep.secondarySeonghakDiagram.diagramNumber !== rep.activeSeonghakDiagram.diagramNumber);
  assert(rep.secondaryGyeongPractice.practiceHanja !== rep.focalGyeongPractice.practiceHanja);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.toegyeSynthesisMatrix?.integratedAction));
  const repQ = calculateToegyeSeonghakSipdo(profile, '흩어진 마음을 하나로 모으는 경의 태도');
  assert(repQ.reflectiveQuestion.includes('경의 태도'));
  const prompt = formatToegyeSeonghakSipdoPrompt(repQ);
  assert(prompt.includes('한국 조선 성리학 퇴계 이황 성학십도 경(敬) 심법 지표'));
  assert(prompt.includes(repQ.activeSeonghakDiagram.diagramTitleKo));
  assert(prompt.includes(repQ.secondarySeonghakDiagram.diagramTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Roman Cicero De Officiis Engine: calculates Honestum moral duty, Utile harmony, Fides and Decorum', () => {
  const rep = calculateCiceroDeOfficiis(profile);
  assert.equal(rep.engineVersion, CICERO_DE_OFFICIIS_VERSION);
  assert(rep.honestumMoralDutyScore >= 0 && rep.honestumMoralDutyScore <= 100);
  assert(rep.utileJustHarmonyScore >= 0 && rep.utileJustHarmonyScore <= 100);
  assert(rep.fidesPromiseFaithScore >= 0 && rep.fidesPromiseFaithScore <= 100);
  assert(rep.decorumCivicEleganceScore >= 0 && rep.decorumCivicEleganceScore <= 100);
  assert(rep.bonumCommuneActionScore >= 0 && rep.bonumCommuneActionScore <= 100);
  assert(rep.activeVirtueFoundation.foundationLatin.length > 0);
  const prompt = formatCiceroDeOfficiisPrompt(rep);
  assert(prompt.includes('고대 로마 키케로 의무론 도덕적 선 & 유용성 조화 지표'));
  assert(prompt.includes(rep.activeVirtueFoundation.foundationKo));
});

test('Epictetus Dichotomy of Control Engine: calculates Ta Eph hemin clarity, Prohairesis autonomy and Topoi balance', () => {
  const rep = calculateEpictetusDichotomyOfControl(profile);
  assert.equal(rep.engineVersion, EPICTETUS_CONTROL_VERSION);
  assert(rep.dichotomyClarityScore >= 0 && rep.dichotomyClarityScore <= 100);
  assert(rep.prohairesisAutonomyScore >= 0 && rep.prohairesisAutonomyScore <= 100);
  assert(rep.adiaphoraDetachmentScore >= 0 && rep.adiaphoraDetachmentScore <= 100);
  assert(rep.threeTopoiDisciplineScore >= 0 && rep.threeTopoiDisciplineScore <= 100);
  assert(rep.apatheiaEquanimityScore >= 0 && rep.apatheiaEquanimityScore <= 100);
  assert(rep.activeControlDomain.domainNameGreek.length > 0);
  const prompt = formatEpictetusDichotomyOfControlPrompt(rep);
  assert(prompt.includes('스토아학파 에픽테토스 통제이분법 & 프로하이레시스 지표'));
  assert(prompt.includes(rep.activeControlDomain.domainNameKo));
});

test('Confucius Analects Zhitianming Engine: calculates life stage wisdom, Ren, Li, and Junzi equanimity', () => {
  const rep = calculateConfuciusAnalectsZhitianming(profile);
  assert.equal(rep.engineVersion, CONFUCIUS_ZHITIANMING_VERSION);
  assert(rep.tianmingAttunementScore >= 0 && rep.tianmingAttunementScore <= 100);
  assert(rep.renBenevolenceCoreScore >= 0 && rep.renBenevolenceCoreScore <= 100);
  assert(rep.liDecorumHarmonyScore >= 0 && rep.liDecorumHarmonyScore <= 100);
  assert(rep.kejiFuliDisciplineScore >= 0 && rep.kejiFuliDisciplineScore <= 100);
  assert(rep.junziEquanimityScore >= 0 && rep.junziEquanimityScore <= 100);
  assert(rep.activeLifeStage.stageNameHanja.length > 0);
  const prompt = formatConfuciusAnalectsZhitianmingPrompt(rep);
  assert(prompt.includes('공자 논어 지천명 & 극기복례 군자도 성찰'));
  assert(prompt.includes(rep.activeLifeStage.stageNameKo));
});

test('Spinoza Ethica Conatus Engine: calculates Conatus vitality, Sub Specie Aeternitatis, and Amor Dei Intellectualis', () => {
  const rep = calculateBaruchSpinozaEthicaConatus(profile);
  assert.equal(rep.engineVersion, SPINOZA_CONATUS_AMORDEI_VERSION);
  assert(rep.conatusVitalityScore >= 0 && rep.conatusVitalityScore <= 100);
  assert(rep.subSpecieAeternitatisScore >= 0 && rep.subSpecieAeternitatisScore <= 100);
  assert(rep.affectJoyTransitionScore >= 0 && rep.affectJoyTransitionScore <= 100);
  assert(rep.adequateIdeaIntellectScore >= 0 && rep.adequateIdeaIntellectScore <= 100);
  assert(rep.amorDeiIntellectualisScore >= 0 && rep.amorDeiIntellectualisScore <= 100);
  assert(rep.activeAffectState.affectNameLatin.length > 0);
  const prompt = formatBaruchSpinozaEthicaConatusPrompt(rep);
  assert(prompt.includes('스피노자 에티카 코나투스 & 신즉자연 관조 지표'));
  assert(prompt.includes(rep.activeAffectState.affectNameKo));
});

test('Kant Categorical Imperative Engine: calculates universal law maxims, human dignity ends, and moral autonomy', () => {
  const rep = calculateKantCategoricalImperative(profile, '인간관계에서 원칙과 존엄성을 어떻게 지켜야 할까요?', new Date('2026-11-14T00:00:00Z'));
  assert.equal(rep.engineVersion, KANT_CATEGORICAL_IMPERATIVE_VERSION);
  assert(rep.universalLawMaximsScore >= 0 && rep.universalLawMaximsScore <= 100);
  assert(rep.humanDignityEndsScore >= 0 && rep.humanDignityEndsScore <= 100);
  assert(rep.autonomousWillSovereigntyScore >= 0 && rep.autonomousWillSovereigntyScore <= 100);
  assert(rep.transcendentalSynthesisScore >= 0 && rep.transcendentalSynthesisScore <= 100);
  assert(rep.summumBonumHarmonyScore >= 0 && rep.summumBonumHarmonyScore <= 100);
  assert(rep.activeImperativeFormula.formulaNameGerman.length > 0);
  assert(rep.situationalImperativeAudit.focusAxisKo.length > 0);
  assert(rep.temporalReasonRhythm.practicalReasonIndex >= 0 && rep.temporalReasonRhythm.practicalReasonIndex <= 100);
  assert(rep.kantSynthesisMatrix.overallKantGrade.length > 0);
  const prompt = formatKantCategoricalImperativePrompt(rep);
  assert(prompt.includes('칸트 정언명령 & 목적의 왕국 자율성 지표'));
  assert(prompt.includes(rep.activeImperativeFormula.formulaNameKo));
  assert(prompt.includes('질문 맥락 정식'));
});

test('Upanishadic Tat Tvam Asi Engine: calculates Brahman-Atman unity, Maya piercing, Neti Neti detachment, and Sat-Chit-Ananda', () => {
  const rep = calculateUpanishadicTatTvamAsi(profile);
  assert.equal(rep.engineVersion, UPANISHADIC_TAT_TVAM_ASI_VERSION);
  assert(rep.brahmanAtmanUnityScore >= 0 && rep.brahmanAtmanUnityScore <= 100);
  assert(rep.mayaIllusionPiercingScore >= 0 && rep.mayaIllusionPiercingScore <= 100);
  assert(rep.netiNetiDetachmentScore >= 0 && rep.netiNetiDetachmentScore <= 100);
  assert(rep.satChitAnandaPureConsciousnessScore >= 0 && rep.satChitAnandaPureConsciousnessScore <= 100);
  assert(rep.prajnaSpiritualWisdomScore >= 0 && rep.prajnaSpiritualWisdomScore <= 100);
  assert(rep.activeMahavakya.vakyaSanskrit.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.upanishadicSynthesisMatrix?.integratedAction));
  const prompt = formatUpanishadicTatTvamAsiPrompt(rep);
  assert(prompt.includes('우파니샤드 타트 트밤 아시 & 범아일여 순수의식 지표'));
  assert(prompt.includes(rep.activeMahavakya.vakyaNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Choe Han-gi Gihak Unwha Engine: calculates Unwhagi cosmic flow, Singitong perceptual mind, Chucheuk empirical insight, and Daedong harmony', () => {
  const rep = calculateChoeHangiGihakUnwha(profile);
  assert.equal(rep.engineVersion, CHOE_HANGI_GIHAK_UNWHA_VERSION);
  assert(rep.unwhagiCosmicFlowScore >= 0 && rep.unwhagiCosmicFlowScore <= 100);
  assert(rep.singitongPerceptualMindScore >= 0 && rep.singitongPerceptualMindScore <= 100);
  assert(rep.chucheukEmpiricalInsightScore >= 0 && rep.chucheukEmpiricalInsightScore <= 100);
  assert(rep.tongminPublicConnectionScore >= 0 && rep.tongminPublicConnectionScore <= 100);
  assert(rep.daedongUniversalHarmonyScore >= 0 && rep.daedongUniversalHarmonyScore <= 100);
  assert(rep.activeGihakPrinciple.sourceText.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.gihakSynthesisMatrix?.integratedAction));
  const prompt = formatChoeHangiGihakUnwhaPrompt(rep);
  assert(prompt.includes('혜강 최한기 기학(氣學) & 신기통(神氣通) 운화 지표'));
  assert(prompt.includes(rep.activeGihakPrinciple.principleNameKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Sun Tzu Art of War Strategy Engine: calculates Five Factors, unfought victory, and qualitative strategy', () => {
  const rep = calculateSunTzuArtOfWarStrategy(profile, new Date('2026-11-14T18:45:00+09:00'), '너무 지치고 소모적인 일을 멈춰야 할까요?');
  assert.equal(rep.engineVersion, SUNTZU_STRATEGY_VERSION);
  assert.equal(rep.questionTopic, 'healing');
  assert(rep.strategicPosture.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.counselNote.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.focalFiveFactor.factorHanja.length > 0);
  assert(rep.situationalStrategyAudit.artOfWarChapter.length > 0);
  assert(rep.temporalSunTzuRhythm.campaignWindow.length > 0);
  assert(rep.sunTzuSynthesisMatrix.synthesizedVerdict.length > 0);
  const prompt = formatSunTzuArtOfWarStrategyPrompt(rep);
  assert(prompt.includes('손자병법 오사칠계 & 부전승 피실격허 전략 지표'));
  assert(prompt.includes(rep.focalFiveFactor.factorHanja));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Descartes Cogito Clara Distincta Engine: calculates Cogito certainty, Clara et Distincta, and provisional moral resolve', () => {
  const rep = calculateFrenchDescartesCogito(profile, '중요한 이직 결정을 앞두고 있는데 어떻게 정리해야 할까요?', new Date('2026-11-15T01:30:00Z'));
  assert.equal(rep.engineVersion, DESCARTES_COGITO_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert(rep.temporalDescartesRhythm.kstDateLabel === '2026-11-15');
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.cogitoPresenceCertaintyScore >= 0 && rep.cogitoPresenceCertaintyScore <= 100);
  assert(rep.claraDistinctaClarityScore >= 0 && rep.claraDistinctaClarityScore <= 100);
  assert(rep.methodicDoubtPurificationScore >= 0 && rep.methodicDoubtPurificationScore <= 100);
  assert(rep.fourRulesReasoningScore >= 0 && rep.fourRulesReasoningScore <= 100);
  assert(rep.provisionalMoralResolveScore >= 0 && rep.provisionalMoralResolveScore <= 100);
  assert(rep.activeMethodRule.ruleNameFrench.length > 0);
  const prompt = formatFrenchDescartesCogitoPrompt(rep);
  assert(prompt.includes('데카르트 코기토 & 명석판명 방법서설 지표'));
  assert(prompt.includes(rep.activeMethodRule.ruleNameFrench));
  assert(prompt.includes('질문 맞춤 실천 가이드'));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Early Buddhist Four Noble Truths Engine: calculates Four Noble Truths, Eightfold Path, Nirodha, and Sati presence', () => {
  const rep = calculateAncientIndianFourNobleTruths(profile);
  assert.equal(rep.engineVersion, FOUR_NOBLE_TRUTHS_VERSION);
  assert(rep.fourNobleTruthsClarityScore >= 0 && rep.fourNobleTruthsClarityScore <= 100);
  assert(rep.eightfoldPathBalanceScore >= 0 && rep.eightfoldPathBalanceScore <= 100);
  assert(rep.cravingExtinctionNirodhaScore >= 0 && rep.cravingExtinctionNirodhaScore <= 100);
  assert(rep.satiMindfulnessPresenceScore >= 0 && rep.satiMindfulnessPresenceScore <= 100);
  assert(rep.middleWayMajjhimaScore >= 0 && rep.middleWayMajjhimaScore <= 100);
  assert(rep.activeNobleTruth.truthHanja.length > 0);
  const prompt = formatAncientIndianFourNobleTruthsPrompt(rep);
  assert(prompt.includes('초기불교 사성제 & 팔정도 고집멸도 지표'));
  assert(prompt.includes(rep.activeNobleTruth.truthHanja));
});

test('Rumi Masnavi Divine Love Engine: calculates Ishq divine love, Qalb purification, Fana ego dissolution, and Sama tranquility', () => {
  const rep = calculateRumiMasnaviDivineLove(profile);
  assert.equal(rep.engineVersion, RUMI_MASNAVI_SUFI_VERSION);
  assert(rep.ishqDivineLoveScore >= 0 && rep.ishqDivineLoveScore <= 100);
  assert(rep.qalbPurificationScore >= 0 && rep.qalbPurificationScore <= 100);
  assert(rep.fanaEgoDissolutionScore >= 0 && rep.fanaEgoDissolutionScore <= 100);
  assert(rep.samaWhirlingTranquilityScore >= 0 && rep.samaWhirlingTranquilityScore <= 100);
  assert(rep.woundLightWisdomScore >= 0 && rep.woundLightWisdomScore <= 100);
  assert(rep.activeSpiritualStation.stationNameArabic.length > 0);
  const prompt = formatRumiMasnaviDivineLovePrompt(rep);
  assert(prompt.includes('루미 마스나비 & 수피즘 신성한 사랑 지표'));
  assert(prompt.includes(rep.activeSpiritualStation.stationNameKo));
});

test('Uisang Hwaeom Ilseung Beopgyedo Engine: calculates Beopseong Wonnyung, Sangjeuk Sangip, Micro-Macro Cosmos, and First Mind Awakening', () => {
  const rep = calculateUisangHwaeomIlseungBeopgye(profile);
  assert.equal(rep.engineVersion, UISANG_HWAEOM_BEOPGYE_VERSION);
  assert(rep.beopseongWonnyungScore >= 0 && rep.beopseongWonnyungScore <= 100);
  assert(rep.sangjeukSangipInterpenetrationScore >= 0 && rep.sangjeukSangipInterpenetrationScore <= 100);
  assert(rep.microMacroCosmosScore >= 0 && rep.microMacroCosmosScore <= 100);
  assert(rep.firstMindAwakeningScore >= 0 && rep.firstMindAwakeningScore <= 100);
  assert(rep.ancientImmobilityBuddhaScore >= 0 && rep.ancientImmobilityBuddhaScore <= 100);
  assert(rep.activeBeopgyeVerse.hanjaVerse.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.uisangSynthesisMatrix?.integratedAction));
  const prompt = formatUisangHwaeomIlseungBeopgyePrompt(rep);
  assert(prompt.includes('의상대사 화엄일승법계도 & 법성게 원융무애 지표'));
  assert(prompt.includes(rep.activeBeopgyeVerse.hanjaVerse));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Montaigne Essais Wisdom Engine: calculates Que sais-je inquiry, Self-introspection honesty, Natural moderation, and Equanimity', () => {
  const rep = calculateMontaigneEssaisWisdom(profile);
  assert.equal(rep.engineVersion, MONTAIGNE_ESSAIS_WISDOM_VERSION);
  assert(rep.queSaisJeInquiryScore >= 0 && rep.queSaisJeInquiryScore <= 100);
  assert(rep.selfIntrospectionHonestyScore >= 0 && rep.selfIntrospectionHonestyScore <= 100);
  assert(rep.naturalModerationScore >= 0 && rep.naturalModerationScore <= 100);
  assert(rep.humanToleranceEmpathyScore >= 0 && rep.humanToleranceEmpathyScore <= 100);
  assert(rep.equanimityMortalityScore >= 0 && rep.equanimityMortalityScore <= 100);
  assert(rep.activeThematicEssay.essayTitleFrench.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.montaigneEssaisSynthesisMatrix?.integratedAction));
  const prompt = formatMontaigneEssaisWisdomPrompt(rep);
  assert(prompt.includes('몽테뉴 수상록(Essais) 회의주의·자기성찰 지표'));
  assert(prompt.includes(rep.activeThematicEssay.essayTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Nagarjuna Madhyamaka Sunyata Engine: calculates Sunyata wisdom, Eightfold negation, and Dependent origination', () => {
  const rep = calculateNagarjunaMadhyamakaSunyata(profile);
  assert.equal(rep.engineVersion, NAGARJUNA_MADHYAMAKA_VERSION);
  assert(rep.sunyataWisdomScore >= 0 && rep.sunyataWisdomScore <= 100);
  assert(rep.eightfoldNegationMiddleWayScore >= 0 && rep.eightfoldNegationMiddleWayScore <= 100);
  assert(rep.pratityasamutpadaGraspScore >= 0 && rep.pratityasamutpadaGraspScore <= 100);
  assert(rep.twoTruthsHarmonyScore >= 0 && rep.twoTruthsHarmonyScore <= 100);
  assert(rep.clingingDeconstructionScore >= 0 && rep.clingingDeconstructionScore <= 100);
  assert(rep.activeNegationAspect.aspectHanja.length > 0);
  const prompt = formatNagarjunaMadhyamakaSunyataPrompt(rep);
  assert(prompt.includes('용수 중론 & 팔불중도 공성(Śūnyatā) 지표'));
  assert(prompt.includes(rep.activeNegationAspect.aspectHanja));
});

test('Jinul Jeonghye Ssangsu Engine: calculates Donoh insight, Jeomsu cultivation, and Seongjeok equanimity', () => {
  const rep = calculateJinulJeonghyeSsangsu(profile);
  assert.equal(rep.engineVersion, JINUL_JEONGHYE_SSANGSU_VERSION);
  assert(rep.donohInsightScore >= 0 && rep.donohInsightScore <= 100);
  assert(rep.jeomsuCultivationScore >= 0 && rep.jeomsuCultivationScore <= 100);
  assert(rep.jeonghyeBalanceScore >= 0 && rep.jeonghyeBalanceScore <= 100);
  assert(rep.seongjeokEquanimityScore >= 0 && rep.seongjeokEquanimityScore <= 100);
  assert(rep.gongjeokYeongjiScore >= 0 && rep.gongjeokYeongjiScore <= 100);
  assert(rep.activeCorePrinciple.principleHanja.length > 0);
  assert(rep.secondaryCorePrinciple.principleKey !== rep.activeCorePrinciple.principleKey);
  assert(rep.secondaryZenMetaphor.metaphorKey !== rep.focalZenMetaphor.metaphorKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.jinulSynthesisMatrix?.integratedAction));
  const repQ = calculateJinulJeonghyeSsangsu(profile, '마음의 평정을 지키며 꾸준히 정진하는 법');
  assert(repQ.reflectiveQuestion.includes('마음의 평정'));
  const prompt = formatJinulJeonghyeSsangsuPrompt(repQ);
  assert(prompt.includes('보조국사 수심결 & 정혜쌍수·돈오점수 지표'));
  assert(prompt.includes(repQ.activeCorePrinciple.principleHanja));
  assert(prompt.includes(repQ.secondaryCorePrinciple.principleHanja));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Giordano Bruno Infinite Universe Engine: calculates Infinite cosmos vision, Heroic furore, and Sovereign conscience', () => {
  const rep = calculateRenaissanceBrunoInfiniteUniverse(profile);
  assert.equal(rep.engineVersion, BRUNO_INFINITE_UNIVERSE_VERSION);
  assert(rep.infiniteCosmosVisionScore >= 0 && rep.infiniteCosmosVisionScore <= 100);
  assert(rep.heroicFurorePassionScore >= 0 && rep.heroicFurorePassionScore <= 100);
  assert(rep.immanentDivineResonanceScore >= 0 && rep.immanentDivineResonanceScore <= 100);
  assert(rep.actaeonTransformationScore >= 0 && rep.actaeonTransformationScore <= 100);
  assert(rep.unboundedAutonomyScore >= 0 && rep.unboundedAutonomyScore <= 100);
  assert(rep.activeCosmicAspect.aspectLatinOrItalian.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.brunoSynthesisMatrix?.integratedAction));
  const prompt = formatRenaissanceBrunoInfiniteUniversePrompt(rep);
  assert(prompt.includes('브루노 무한우주론 & 영웅적 열정(Eroico Furore) 지표'));
  assert(prompt.includes(rep.activeCosmicAspect.aspectLatinOrItalian));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Blaise Pascal Pensees Engine: calculates Thinking reed dignity, Heart intuition, and Existential wager resolve', () => {
  const rep = calculatePascalPenseesHeartReason(profile, '중요한 결정을 앞두고 망설여져요', new Date('2026-11-15T01:00:00Z'));
  assert.equal(rep.engineVersion, PASCAL_PENSEES_HEART_REASON_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert(rep.temporalRhythm.kstSlot.length > 0);
  assert(rep.dailyPracticeRitual.length > 0);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.thinkingReedDignityScore >= 0 && rep.thinkingReedDignityScore <= 100);
  assert(rep.heartIntuitionFinesseScore >= 0 && rep.heartIntuitionFinesseScore <= 100);
  assert(rep.existentialWagerResolveScore >= 0 && rep.existentialWagerResolveScore <= 100);
  assert(rep.dualInfinitiesPerspectiveScore >= 0 && rep.dualInfinitiesPerspectiveScore <= 100);
  assert(rep.divertissementTranquilityScore >= 0 && rep.divertissementTranquilityScore <= 100);
  assert(rep.activeThematicThought.thoughtTitleFrench.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.pascalSynthesisMatrix?.integratedAction));
  const prompt = formatPascalPenseesHeartReasonPrompt(rep);
  assert(prompt.includes('블레즈 파스칼 팡세(Pensées) 사유하는 갈대 & 심장의 논리 지표'));
  assert(prompt.includes(rep.activeThematicThought.thoughtTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Arthur Schopenhauer Will Representation Engine: calculates Will transcendence, Aesthetic contemplation, and Mitleid compassion', () => {
  const rep = calculateSchopenhauerWillRepresentation(profile, '가까운 관계에서 거리 조절이 너무 어려워요', new Date('2026-11-14T08:00:00Z'));
  assert.equal(rep.engineVersion, SCHOPENHAUER_WILL_REPRESENTATION_VERSION);
  assert(rep.willTranscendenceClarityScore >= 0 && rep.willTranscendenceClarityScore <= 100);
  assert(rep.aestheticContemplationDepthScore >= 0 && rep.aestheticContemplationDepthScore <= 100);
  assert(rep.mitleidUniversalCompassionScore >= 0 && rep.mitleidUniversalCompassionScore <= 100);
  assert(rep.innerHeiterkeitSerenityScore >= 0 && rep.innerHeiterkeitSerenityScore <= 100);
  assert(rep.wiseRelationalDistanceScore >= 0 && rep.wiseRelationalDistanceScore <= 100);
  assert(rep.activeSchopenhauerTheme.themeTitleGerman.length > 0);
  assert(rep.situationalWillAudit.focusAxisKo.length > 0);
  assert(rep.temporalContemplationRhythm.heiterkeitSerenityIndex >= 0 && rep.temporalContemplationRhythm.heiterkeitSerenityIndex <= 100);
  assert(rep.schopenhauerSynthesisMatrix.overallSchopenhauerGrade.length > 0);
  const prompt = formatSchopenhauerWillRepresentationPrompt(rep);
  assert(prompt.includes('쇼펜하우어 의지와 표상(Wille und Vorstellung) & 자비(Mitleid) 지표'));
  assert(prompt.includes(rep.activeSchopenhauerTheme.themeTitleKo));
  assert(prompt.includes('질문 맥락 관조 렌즈'));
});

test('Chusa Kim Jeong-hui Sehando Engine: calculates Songbaek hudjo integrity, Enduring friendship, and Munjahyang seogwongi', () => {
  const rep = calculateChusaKimJeonghuiSehando(profile);
  assert.equal(rep.engineVersion, CHUSA_SEHANDO_WISDOM_VERSION);
  assert(rep.songbaekHudjoIntegrityScore >= 0 && rep.songbaekHudjoIntegrityScore <= 100);
  assert(rep.enduringFriendshipTrustScore >= 0 && rep.enduringFriendshipTrustScore <= 100);
  assert(rep.munjahyangScholarlyGraceScore >= 0 && rep.munjahyangScholarlyGraceScore <= 100);
  assert(rep.chusaBoldHarmonyFlexibilityScore >= 0 && rep.chusaBoldHarmonyFlexibilityScore <= 100);
  assert(rep.dambaekSimgyeongPurityScore >= 0 && rep.dambaekSimgyeongPurityScore <= 100);
  assert(rep.activeSehandoTheme.themeTitleHanja.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.sehandoSynthesisMatrix?.integratedAction));
  const prompt = formatChusaKimJeonghuiSehandoPrompt(rep);
  assert(prompt.includes('추사 김정희 세한도(歲寒圖) 송백후조 & 문자향 서권기 지표'));
  assert(prompt.includes(rep.activeSehandoTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Søren Kierkegaard Stages of Life Engine: calculates Den Enkelte authenticity, Leap of faith, and Anxiety possibility mastery', () => {
  const rep = calculateKierkegaardStagesOfLife(profile, '이직 선택과 불안 앞에서 어떻게 결단해야 할까요?', new Date('2026-11-14T06:00:00Z'));
  assert.equal(rep.engineVersion, KIERKEGAARD_STAGES_OF_LIFE_VERSION);
  assert(rep.existentialLeapCourageScore >= 0 && rep.existentialLeapCourageScore <= 100);
  assert(rep.denEnkelteAuthenticityScore >= 0 && rep.denEnkelteAuthenticityScore <= 100);
  assert(rep.angstPossibilityMasteryScore >= 0 && rep.angstPossibilityMasteryScore <= 100);
  assert(rep.ethicalSelfChoiceCommitmentScore >= 0 && rep.ethicalSelfChoiceCommitmentScore <= 100);
  assert(rep.spiritSynthesisWholenessScore >= 0 && rep.spiritSynthesisWholenessScore <= 100);
  assert(rep.activeKierkegaardTheme.themeTitleDanish.length > 0);
  assert(rep.situationalStageAudit.focusAxisKo.length > 0);
  assert(rep.temporalSolitudeRhythm.leapReadinessIndex >= 0 && rep.temporalSolitudeRhythm.leapReadinessIndex <= 100);
  assert(rep.kierkegaardSynthesisMatrix.overallExistentialGrade.length > 0);
  const prompt = formatKierkegaardStagesOfLifePrompt(rep);
  assert(prompt.includes('쇠렌 키르케고르 단독자(Den Enkelte) & 실존 3단계 지표'));
  assert(prompt.includes(rep.activeKierkegaardTheme.themeTitleKo));
  assert(prompt.includes('질문 맥락 실존 단계'));
});

test('Friedrich Nietzsche Zarathustra Amor Fati Engine: calculates Amor Fati radical affirmation, Three metamorphoses, and Übermensch overcoming', () => {
  const rep = calculateNietzscheZarathustraAmorFati(profile, '지나간 후회를 딛고 새로운 창조를 시작하고 싶어요', new Date('2026-11-14T03:00:00Z'));
  assert.equal(rep.engineVersion, NIETZSCHE_ZARATHUSTRA_AMOR_FATI_VERSION);
  assert(rep.amorFatiRadicalAffirmationScore >= 0 && rep.amorFatiRadicalAffirmationScore <= 100);
  assert(rep.threeMetamorphosesCreativeScore >= 0 && rep.threeMetamorphosesCreativeScore <= 100);
  assert(rep.uebermenschSelfOvercomingScore >= 0 && rep.uebermenschSelfOvercomingScore <= 100);
  assert(rep.eternalRecurrenceResolveScore >= 0 && rep.eternalRecurrenceResolveScore <= 100);
  assert(rep.dionysianVitalityDriveScore >= 0 && rep.dionysianVitalityDriveScore <= 100);
  assert(rep.activeNietzscheTheme.themeTitleGerman.length > 0);
  assert(rep.situationalMetamorphosis.focusAxisKo.length > 0);
  assert(rep.temporalZarathustraRhythm.dionysianPulseIndex >= 0 && rep.temporalZarathustraRhythm.dionysianPulseIndex <= 100);
  assert(rep.uebermenschSynthesisMatrix.overallZarathustraGrade.length > 0);
  const prompt = formatNietzscheZarathustraAmorFatiPrompt(rep);
  assert(prompt.includes('프리드리히 니체 차라투스트라 초인 & 아모르 파티(Amor Fati) 지표'));
  assert(prompt.includes(rep.activeNietzscheTheme.themeTitleKo));
  assert(prompt.includes('질문 맥락 변신 단계'));
});

test('Seosan Daesa Hyujeong Seonga Gwigam Engine: calculates Ilmul yeongmyeong, Hwalku chamseon, and Seon-Gyo integration', () => {
  const rep = calculateSeosanHyujeongSeongaGwigam(profile);
  assert.equal(rep.engineVersion, SEOSAN_SEONGA_GWIGAM_VERSION);
  assert(rep.ilmulYeongmyeongClarityScore >= 0 && rep.ilmulYeongmyeongClarityScore <= 100);
  assert(rep.hwalkuDirectPiercingScore >= 0 && rep.hwalkuDirectPiercingScore <= 100);
  assert(rep.seonGyoHarmoniousIntegrationScore >= 0 && rep.seonGyoHarmoniousIntegrationScore <= 100);
  assert(rep.samgaHoetongBreadthScore >= 0 && rep.samgaHoetongBreadthScore <= 100);
  assert(rep.daeseungBodhisattvaActionScore >= 0 && rep.daeseungBodhisattvaActionScore <= 100);
  assert(rep.activeSeosanTheme.themeTitleHanja.length > 0);
  assert(rep.secondarySeosanTheme.themeKey !== rep.activeSeosanTheme.themeKey);
  assert(rep.secondarySeosanMaxim.maximKey !== rep.focalSeosanMaxim.maximKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.seosanSynthesisMatrix?.integratedAction));
  const repQ = calculateSeosanHyujeongSeongaGwigam(profile, '죽은 분별을 끊고 본질로 바로 들어갈 화두');
  assert(repQ.reflectiveQuestion.includes('본질로 바로 들어갈 화두'));
  const prompt = formatSeosanHyujeongSeongaGwigamPrompt(repQ);
  assert(prompt.includes('서산대사 선가귀감(禪家龜鑑) 일물영명 & 활구참선 지표'));
  assert(prompt.includes(repQ.activeSeosanTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondarySeosanTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Carl Gustav Jung Individuation Archetype Engine: calculates Self realization, Shadow integration, and Anima/Animus syzygy', () => {
  const rep = calculateJungIndividuationArchetype(profile);
  assert.equal(rep.engineVersion, SWISS_JUNG_INDIVIDUATION_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.jungSynthesisMatrix?.integratedAction));
  assert(rep.individuationSelfRealizationScore >= 0 && rep.individuationSelfRealizationScore <= 100);
  assert(rep.shadowIntegrationCourageScore >= 0 && rep.shadowIntegrationCourageScore <= 100);
  assert(rep.animaAnimusHarmoniousBalanceScore >= 0 && rep.animaAnimusHarmoniousBalanceScore <= 100);
  assert(rep.personaFlexibilityWisdomScore >= 0 && rep.personaFlexibilityWisdomScore <= 100);
  assert(rep.synchronicityMeaningfulInsightScore >= 0 && rep.synchronicityMeaningfulInsightScore <= 100);
  assert(rep.activeJungTheme.themeTitleGerman.length > 0);
  const prompt = formatJungIndividuationArchetypePrompt(rep);
  assert(prompt.includes('카를 융 개성화(Individuation) & 원형 통합 지표'));
  assert(prompt.includes(rep.activeJungTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('G.W.F. Hegel Dialectical Aufheben Engine: calculates Dialectical synthesis, Mutual recognition, and Sittlichkeit harmony', () => {
  const rep = calculateHegelDialecticalAufheben(profile, '서로 다른 두 입장 사이의 갈등을 어떻게 풀어야 할까요?', new Date('2026-11-14T09:00:00Z'));
  assert.equal(rep.engineVersion, GERMAN_HEGEL_DIALECTICAL_VERSION);
  assert(rep.dialecticalAufhebenSynthesisScore >= 0 && rep.dialecticalAufhebenSynthesisScore <= 100);
  assert(rep.mutualAnerkennungMaturityScore >= 0 && rep.mutualAnerkennungMaturityScore <= 100);
  assert(rep.sittlichkeitEthicalLifeHarmonyScore >= 0 && rep.sittlichkeitEthicalLifeHarmonyScore <= 100);
  assert(rep.rationalRealityGraspScore >= 0 && rep.rationalRealityGraspScore <= 100);
  assert(rep.minervaReflectiveWisdomScore >= 0 && rep.minervaReflectiveWisdomScore <= 100);
  assert(rep.activeHegelTheme.themeTitleGerman.length > 0);
  assert(rep.situationalDialecticalAudit.focusAxisKo.length > 0);
  assert(rep.temporalMinervaRhythm.dialecticalMaturityIndex >= 0 && rep.temporalMinervaRhythm.dialecticalMaturityIndex <= 100);
  assert(rep.hegelSynthesisMatrix.overallHegelGrade.length > 0);
  const prompt = formatHegelDialecticalAufhebenPrompt(rep);
  assert(prompt.includes('G.W.F. 헤겔 변증법적 지양(Aufheben) & 인륜성 지표'));
  assert(prompt.includes(rep.activeHegelTheme.themeTitleKo));
  assert(prompt.includes('질문 맥락 변증법 계기'));
});

test('Dasan Jeong Yagyong Mokmin Simseo Silhak Engine: calculates Yeoyudang Sindok, Yulgi integrity, and Silsagusi practicality', () => {
  const rep = calculateDasanMokminSimseo(profile);
  assert.equal(rep.engineVersion, KOREAN_DASAN_MOKMIN_SIMSEO_VERSION);
  assert(rep.yeoyudangPrudentDiscretionScore >= 0 && rep.yeoyudangPrudentDiscretionScore <= 100);
  assert(rep.yulgiIntegrousSelfDisciplineScore >= 0 && rep.yulgiIntegrousSelfDisciplineScore <= 100);
  assert(rep.aeminCompassionatePublicGoodScore >= 0 && rep.aeminCompassionatePublicGoodScore <= 100);
  assert(rep.silsagusiPragmaticWisdomScore >= 0 && rep.silsagusiPragmaticWisdomScore <= 100);
  assert(rep.heumheumMeticulousTruthseekingScore >= 0 && rep.heumheumMeticulousTruthseekingScore <= 100);
  assert(rep.activeDasanTheme.themeTitleHanja.length > 0);
  const prompt = formatDasanMokminSimseoPrompt(rep);
  assert(prompt.includes('다산 정약용 목민심서(牧民心書) & 실사구시 실학 지표'));
  assert(prompt.includes(rep.activeDasanTheme.themeTitleKo));
});

test('Aurelius Augustine Confessiones Illuminatio Engine: calculates Interior Illuminatio, Distentio Animi, and Restful Peace', () => {
  const rep = calculateAugustineConfessionesIlluminatio(profile);
  assert.equal(rep.engineVersion, NORTH_AFRICAN_AUGUSTINE_VERSION);
  assert(rep.interiorIlluminationInsightScore >= 0 && rep.interiorIlluminationInsightScore <= 100);
  assert(rep.temporalPresenceHarmonizationScore >= 0 && rep.temporalPresenceHarmonizationScore <= 100);
  assert(rep.graceOvercomingPrideScore >= 0 && rep.graceOvercomingPrideScore <= 100);
  assert(rep.restfulPeaceOfHeartScore >= 0 && rep.restfulPeaceOfHeartScore <= 100);
  assert(rep.transcendentLoveOrientationScore >= 0 && rep.transcendentLoveOrientationScore <= 100);
  assert(rep.activeAugustineTheme.themeTitleLatin.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.augustineSynthesisMatrix?.integratedAction));
  const prompt = formatAugustineConfessionesIlluminatioPrompt(rep);
  assert(prompt.includes('아우구스티누스 《고백록》 내적 조명 & 안식 평정심 지표'));
  assert(prompt.includes(rep.activeAugustineTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Niccolo Machiavelli Virtu and Fortuna Engine: calculates Virtu decisiveness, Fortuna navigation, and Riscontro adaptability', () => {
  const rep = calculateMachiavelliVirtuFortuna(profile);
  assert.equal(rep.engineVersion, ITALIAN_MACHIAVELLI_VERSION);
  assert(rep.virtuDecisiveCompetenceScore >= 0 && rep.virtuDecisiveCompetenceScore <= 100);
  assert(rep.fortunaNavigationMasteryScore >= 0 && rep.fortunaNavigationMasteryScore <= 100);
  assert(rep.riscontroTemporalAdaptabilityScore >= 0 && rep.riscontroTemporalAdaptabilityScore <= 100);
  assert(rep.foxLionPrudentBalanceScore >= 0 && rep.foxLionPrudentBalanceScore <= 100);
  assert(rep.effectualTruthRealismScore >= 0 && rep.effectualTruthRealismScore <= 100);
  assert(rep.activeMachiavelliTheme.themeTitleItalian.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.machiavelliSynthesisMatrix?.integratedAction));
  const prompt = formatMachiavelliVirtuFortunaPrompt(rep);
  assert(prompt.includes('니콜로 마키아벨리 《군주론》 비르투 & 포르투나 지표'));
  assert(prompt.includes(rep.activeMachiavelliTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Choe Chiwon Pungryudo and Three Teachings Harmony Engine: calculates Mystic Vitality, Inclusion Balance, and Jeophwa Gunsaeng', () => {
  const rep = calculateChoeChiwonPungryudo(profile);
  assert.equal(rep.engineVersion, KOREAN_CHOE_CHIWON_VERSION);
  assert(rep.pungryuMysticVitalityScore >= 0 && rep.pungryuMysticVitalityScore <= 100);
  assert(rep.threeTeachingsInclusionBalanceScore >= 0 && rep.threeTeachingsInclusionBalanceScore <= 100);
  assert(rep.jeophwaGunsaengHarmoniousLoveScore >= 0 && rep.jeophwaGunsaengHarmoniousLoveScore <= 100);
  assert(rep.literaryIntellectualInsightScore >= 0 && rep.literaryIntellectualInsightScore <= 100);
  assert(rep.detachedTranscendentalPeaceScore >= 0 && rep.detachedTranscendentalPeaceScore <= 100);
  assert(rep.activeChoeChiwonTheme.themeTitleHanja.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.pungryudoSynthesisMatrix?.integratedAction));
  const prompt = formatChoeChiwonPungryudoPrompt(rep);
  assert(prompt.includes('고운 최치원 풍류도(風流道) & 접화군생(接化群生) 지표'));
  assert(prompt.includes(rep.activeChoeChiwonTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Thomas Aquinas Summa Theologiae Engine: calculates Reason and Faith Harmony, Quinque Viae, and Beatific Vision', () => {
  const rep = calculateThomasAquinasSummaTheologiae(profile);
  assert.equal(rep.engineVersion, ITALIAN_THOMAS_AQUINAS_VERSION);
  assert(rep.reasonFaithHarmonyScore >= 0 && rep.reasonFaithHarmonyScore <= 100);
  assert(rep.fiveWaysCausalInsightScore >= 0 && rep.fiveWaysCausalInsightScore <= 100);
  assert(rep.cardinalTheologicalVirtuesBalanceScore >= 0 && rep.cardinalTheologicalVirtuesBalanceScore <= 100);
  assert(rep.naturalMoralLawPrudenceScore >= 0 && rep.naturalMoralLawPrudenceScore <= 100);
  assert(rep.beatificVisionSupremeGoodScore >= 0 && rep.beatificVisionSupremeGoodScore <= 100);
  assert(rep.activeAquinasTheme.themeTitleLatin.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.aquinasSynthesisMatrix?.integratedAction));
  const prompt = formatThomasAquinasSummaTheologiaePrompt(rep);
  assert(prompt.includes('토마스 아퀴나스 《신학대전》 이성·신앙 조화 & 덕론 종합 지표'));
  assert(prompt.includes(rep.activeAquinasTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Francis Bacon Novum Organum Engine: calculates Four Idols overcoming, Inductio Vera, and Empirical Grounding', () => {
  const rep = calculateFrancisBaconNovumOrganum(profile, '이직 결정을 앞두고 냉정한 판단이 필요해요', new Date('2026-11-14T03:00:00Z'));
  assert.equal(rep.engineVersion, BRITISH_FRANCIS_BACON_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert(rep.temporalBaconRhythm.kstDateLabel === '2026-11-14');
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.idolsTribusSpeciesBiasOvercomingScore >= 0 && rep.idolsTribusSpeciesBiasOvercomingScore <= 100);
  assert(rep.idolsSpecusPersonalPrejudiceOvercomingScore >= 0 && rep.idolsSpecusPersonalPrejudiceOvercomingScore <= 100);
  assert(rep.idolsForiLinguisticClarityScore >= 0 && rep.idolsForiLinguisticClarityScore <= 100);
  assert(rep.idolsTheatriAuthorityDogmaOvercomingScore >= 0 && rep.idolsTheatriAuthorityDogmaOvercomingScore <= 100);
  assert(rep.trueInductionEmpiricalGroundedScore >= 0 && rep.trueInductionEmpiricalGroundedScore <= 100);
  assert(rep.activeBaconTheme.themeTitleLatin.length > 0);
  const prompt = formatFrancisBaconNovumOrganumPrompt(rep);
  assert(prompt.includes('프랜시스 베이컨 《신기관》 4대 우상 타파 & 실증 경험 지표'));
  assert(prompt.includes(rep.activeBaconTheme.themeTitleKo));
  assert(prompt.includes('질문 주제 맥락: decision'));
  assert(prompt.includes('KST 시공간 리듬:'));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Ryu Seong-ryong Jingbirok Engine: calculates Jingjeon Bihu past reflection, Yubimuhwan preparedness, and Public Devotion', () => {
  const rep = calculateRyuSeongryongJingbirok(profile);
  assert.equal(rep.engineVersion, KOREAN_RYU_SEONGRYONG_VERSION);
  assert(rep.jingjeonBihuPastReflectionScore >= 0 && rep.jingjeonBihuPastReflectionScore <= 100);
  assert(rep.yubimuhwanPreemptivePreparednessScore >= 0 && rep.yubimuhwanPreemptivePreparednessScore <= 100);
  assert(rep.daeseungTalentIntegrationScore >= 0 && rep.daeseungTalentIntegrationScore <= 100);
  assert(rep.selflessDevotionPublicGoodScore >= 0 && rep.selflessDevotionPublicGoodScore <= 100);
  assert(rep.practicalCrisisManagementExecutionScore >= 0 && rep.practicalCrisisManagementExecutionScore <= 100);
  assert(rep.activeJingbirokTheme.themeTitleHanja.length > 0);
  assert(rep.secondaryJingbirokTheme.themeKey !== rep.activeJingbirokTheme.themeKey);
  assert(rep.secondaryJingbirokAphorism.aphorismKey !== rep.focalJingbirokAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.jingbirokSynthesisMatrix?.integratedAction));
  const repQ = calculateRyuSeongryongJingbirok(profile, '평온할 때 미리 챙겨야 할 비상 계획');
  assert(repQ.reflectiveQuestion.includes('비상 계획'));
  const prompt = formatRyuSeongryongJingbirokPrompt(repQ);
  assert(prompt.includes('서애 류성룡 《징비록》 징전비후 성찰 & 유비무환 위기대응 지표'));
  assert(prompt.includes(repQ.activeJingbirokTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryJingbirokTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('King Sejong Hunminjeongeum Aemin Engine: calculates Aemin Creativity, Barrier Break, and Yeominrak', () => {
  const rep = calculateKingSejongHunminjeongeumAemin(profile);
  assert.equal(rep.engineVersion, KOREAN_KING_SEJONG_VERSION);
  assert(rep.aeminCreativityScore >= 0 && rep.aeminCreativityScore <= 100);
  assert(rep.pragmaticBarrierBreakScore >= 0 && rep.pragmaticBarrierBreakScore <= 100);
  assert(rep.yeominrakHarmonyQuotient >= 0 && rep.yeominrakHarmonyQuotient <= 100);
  assert(rep.jiphyeonjeonCollectiveWisdom >= 0 && rep.jiphyeonjeonCollectiveWisdom <= 100);
  assert(rep.saengsaengJirakVitalityScore >= 0 && rep.saengsaengJirakVitalityScore <= 100);
  assert(rep.activeHunminTheme.themeTitleHanja.length > 0);
  assert(rep.secondaryHunminTheme.themeKey !== rep.activeHunminTheme.themeKey);
  assert(rep.secondaryHunminAphorism.aphorismKey !== rep.focalHunminAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.sejongSynthesisMatrix?.integratedAction));
  const repQ = calculateKingSejongHunminjeongeumAemin(profile, '누구나 쉽게 쓰는 구조로 단순화하는 방법');
  assert(repQ.reflectiveQuestion.includes('단순화'));
  const prompt = formatKingSejongHunminjeongeumAeminPrompt(repQ);
  assert(prompt.includes('세종대왕 《훈민정음》 어제서문 애민창조 & 여민락 지혜 지표'));
  assert(prompt.includes(repQ.activeHunminTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryHunminTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Dasan Mokmin Simseo Engine: calculates Yeoyudang, Yulgi, and Silsagusi matrix', () => {
  const rep = calculateDasanMokminSimseo(profile);
  assert.equal(rep.engineVersion, KOREAN_DASAN_MOKMIN_SIMSEO_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.dasanSynthesisMatrix?.integratedAction));
  const prompt = formatDasanMokminSimseoPrompt(rep);
  assert(prompt.includes('다산 정약용 목민심서'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Jang Bogo Cheonghaejin Maritime Pioneer Engine: calculates Maritime Vision, Trust Network, and Wave Breaker Resilience', () => {
  const rep = calculateJangBogoCheonghaejinMaritimePioneer(profile);
  assert.equal(rep.engineVersion, KOREAN_JANG_BOGO_VERSION);
  assert(rep.maritimePioneerVisionScore >= 0 && rep.maritimePioneerVisionScore <= 100);
  assert(rep.trustNetworkCreditScore >= 0 && rep.trustNetworkCreditScore <= 100);
  assert(rep.waveBreakerResilienceScore >= 0 && rep.waveBreakerResilienceScore <= 100);
  assert(rep.globalTradeStrategicMindScore >= 0 && rep.globalTradeStrategicMindScore <= 100);
  assert(rep.independentStrongholdScore >= 0 && rep.independentStrongholdScore <= 100);
  assert(rep.activeCheonghaeTheme.themeTitleHanja.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.cheonghaeSynthesisMatrix?.integratedAction));
  const prompt = formatJangBogoCheonghaejinMaritimePioneerPrompt(rep);
  assert(prompt.includes('해상왕 장보고 《청해진》 글로벌 해상무역 & 신의 개척 지표'));
  assert(prompt.includes(rep.activeCheonghaeTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('John Stuart Mill On Liberty Individuality Engine: calculates Autonomy, Harm Principle, and Qualitative Growth', () => {
  const rep = calculateJohnStuartMillOnLibertyIndividuality(profile, '주변 시선 때문에 내 선택을 망설여요', new Date('2026-11-14T03:00:00Z'));
  assert.equal(rep.engineVersion, BRITISH_JS_MILL_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert(rep.temporalMillRhythm.kstDateLabel === '2026-11-14');
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.individualityAutonomyScore >= 0 && rep.individualityAutonomyScore <= 100);
  assert(rep.harmPrincipleClarityScore >= 0 && rep.harmPrincipleClarityScore <= 100);
  assert(rep.thoughtConscienceLibertyScore >= 0 && rep.thoughtConscienceLibertyScore <= 100);
  assert(rep.tyrannyResistanceCourageScore >= 0 && rep.tyrannyResistanceCourageScore <= 100);
  assert(rep.qualitativeGrowthPursuitScore >= 0 && rep.qualitativeGrowthPursuitScore <= 100);
  assert(rep.activeMillTheme.themeTitleEn.length > 0);
  const prompt = formatJohnStuartMillOnLibertyIndividualityPrompt(rep);
  assert(prompt.includes('존 스튜어트 밀 《자유론》 개별성 자율성 & 해악 원칙 지표'));
  assert(prompt.includes(rep.activeMillTheme.themeTitleKo));
  assert(prompt.includes('질문 주제 맥락: decision'));
  assert(prompt.includes('KST 시공간 리듬:'));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Jean-Jacques Rousseau Nature Authenticity Engine: calculates Inherent Goodness, Authenticity, and General Will', () => {
  const rep = calculateFrenchJeanJacquesRousseauNatureAuthenticity(profile, '요즘 너무 지치고 쉬고 싶어요', new Date('2026-11-15T10:00:00Z'));
  assert.equal(rep.engineVersion, FRENCH_JJ_ROUSSEAU_VERSION);
  assert.equal(rep.questionTopic, 'healing');
  assert(rep.temporalRhythm.kstSlot.length > 0);
  assert(rep.dailyPracticeRitual.length > 0);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.natureInherentGoodnessScore >= 0 && rep.natureInherentGoodnessScore <= 100);
  assert(rep.authenticityInnerVoiceScore >= 0 && rep.authenticityInnerVoiceScore <= 100);
  assert(rep.generalWillSolidarityScore >= 0 && rep.generalWillSolidarityScore <= 100);
  assert(rep.amourDeSoiSelfLoveScore >= 0 && rep.amourDeSoiSelfLoveScore <= 100);
  assert(rep.emileAutonomyEducationScore >= 0 && rep.emileAutonomyEducationScore <= 100);
  assert(rep.activeRousseauTheme.themeTitleKo.length > 0);
  const prompt = formatJeanJacquesRousseauNatureAuthenticityPrompt(rep);
  assert(prompt.includes('장 자크 루소 《에밀·사회계약론》 인간 본성 자연 회복 & 진정성 지표'));
  assert(prompt.includes(rep.activeRousseauTheme.themeTitleKo));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Johann Wolfgang von Goethe Faust Striving Engine: calculates Striving Salvation, Sacred Moment, and Creative Action', () => {
  const rep = calculateGermanJohannWolfgangGoetheFaustStriving(profile);
  assert.equal(rep.engineVersion, GERMAN_GOETHE_FAUST_VERSION);
  assert(rep.eternalStrivingEndeavorScore >= 0 && rep.eternalStrivingEndeavorScore <= 100);
  assert(rep.verweileDochMomentPresenceScore >= 0 && rep.verweileDochMomentPresenceScore <= 100);
  assert(rep.sturmUndDrangPassionDriveScore >= 0 && rep.sturmUndDrangPassionDriveScore <= 100);
  assert(rep.mephistoNegationOvercomeScore >= 0 && rep.mephistoNegationOvercomeScore <= 100);
  assert(rep.eternalFeminineUpliftScore >= 0 && rep.eternalFeminineUpliftScore <= 100);
  assert(rep.activeGoetheTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.goetheSynthesisMatrix?.integratedAction));
  const prompt = formatJohannWolfgangGoetheFaustStrivingPrompt(rep);
  assert(prompt.includes('괴테 《파우스트》 영혼 구원 갈망 노력 & 현재 순간 몰입 지표'));
  assert(prompt.includes(rep.activeGoetheTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Dante Alighieri Divine Comedy Ascent Engine: calculates Wayfinding, Inferno Shadow Confront, and Cosmic Love', () => {
  const rep = calculateItalianDanteAlighieriDivineComedyAscent(profile);
  assert.equal(rep.engineVersion, ITALIAN_DANTE_COMEDY_VERSION);
  assert(rep.selvaOscuraWayfindingScore >= 0 && rep.selvaOscuraWayfindingScore <= 100);
  assert(rep.infernoShadowConfrontScore >= 0 && rep.infernoShadowConfrontScore <= 100);
  assert(rep.purgatorioCleansingVirtueScore >= 0 && rep.purgatorioCleansingVirtueScore <= 100);
  assert(rep.paradisoLuminousClarityScore >= 0 && rep.paradisoLuminousClarityScore <= 100);
  assert(rep.cosmicLoveHarmonizingScore >= 0 && rep.cosmicLoveHarmonizingScore <= 100);
  assert(rep.activeDanteTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.danteSynthesisMatrix?.integratedAction));
  const prompt = formatDanteAlighieriDivineComedyAscentPrompt(rep);
  assert(prompt.includes('단테 알리기에리 《신곡》 영혼의 상승 & 지옥·연옥·천국 지혜 지표'));
  assert(prompt.includes(rep.activeDanteTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Marcus Aurelius Meditations Citadel Engine: calculates Inner Citadel, Logos Providence, and Apatheia Serenity', () => {
  const rep = calculateMarcusAureliusMeditationsCitadel(profile);
  assert.equal(rep.engineVersion, ROMAN_MARCUS_AURELIUS_VERSION);
  assert(rep.innerCitadelResilienceScore >= 0 && rep.innerCitadelResilienceScore <= 100);
  assert(rep.logosProvidenceAlignmentScore >= 0 && rep.logosProvidenceAlignmentScore <= 100);
  assert(rep.mementoMoriClarityQuotient >= 0 && rep.mementoMoriClarityQuotient <= 100);
  assert(rep.koinoniaCosmopolitanDutyScore >= 0 && rep.koinoniaCosmopolitanDutyScore <= 100);
  assert(rep.apatheiaSerenityIndex >= 0 && rep.apatheiaSerenityIndex <= 100);
  assert(rep.activeMeditationsTheme.themeTitleKo.length > 0);
  const prompt = formatMarcusAureliusMeditationsCitadelPrompt(rep);
  assert(prompt.includes('마르쿠스 아우렐리우스 《명상록》 내면의 성채 & 스토아 실존 평정 지표'));
  assert(prompt.includes(rep.activeMeditationsTheme.themeTitleKo));
});

test('Suun Choe Je-u Donghak Sicheonju Engine: calculates Sicheonju Dignity, Sainyeocheon Reverence, and Hucheon Gaebyeok', () => {
  const rep = calculateSuunChoeJeuDonghakSicheonju(profile);
  assert.equal(rep.engineVersion, KOREAN_SUUN_CHOE_JEU_VERSION);
  assert(rep.sicheonjuDignityScore >= 0 && rep.sicheonjuDignityScore <= 100);
  assert(rep.sainyeocheonReverenceQuotient >= 0 && rep.sainyeocheonReverenceQuotient <= 100);
  assert(rep.osimJeukYeosimEmpathyScore >= 0 && rep.osimJeukYeosimEmpathyScore <= 100);
  assert(rep.susimJeonggiEquanimityScore >= 0 && rep.susimJeonggiEquanimityScore <= 100);
  assert(rep.hucheonGaebyeokPioneerScore >= 0 && rep.hucheonGaebyeokPioneerScore <= 100);
  assert(rep.activeDonghakTheme.themeTitleKo.length > 0);
  assert(rep.secondaryDonghakTheme.themeKey !== rep.activeDonghakTheme.themeKey);
  assert(rep.secondaryDonghakAphorism.aphorismKey !== rep.focalDonghakAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.donghakSynthesisMatrix?.integratedAction));
  const repQ = calculateSuunChoeJeuDonghakSicheonju(profile, '스스로와 타인의 존엄을 세우는 선택');
  assert(repQ.reflectiveQuestion.includes('존엄을 세우는 선택'));
  const prompt = formatSuunChoeJeuDonghakSicheonjuPrompt(repQ);
  assert(prompt.includes('수운 최제우 《동경대전》 시천주 & 사인여천 영성 존엄 및 후천개벽 지표'));
  assert(prompt.includes(repQ.activeDonghakTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryDonghakTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ralph Waldo Emerson Self-Reliance Engine: calculates qualitative Self-Reliance and Over-Soul guidance', () => {
  const rep = calculateRalphWaldoEmersonSelfReliance(profile, new Date('2026-11-14T18:45:00+09:00'), '남들 눈치를 보지 않고 이직 결정을 내려도 될까요?');
  assert.equal(rep.engineVersion, AMERICAN_RALPH_WALDO_EMERSON_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert(rep.selfReliancePosture.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.counselNote.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.emersonSynthesisMatrix.coreInsight.length > 0);
  assert(rep.activeEmersonTheme.themeTitleKo.length > 0);
  const prompt = formatRalphWaldoEmersonSelfReliancePrompt(rep);
  assert(prompt.includes('랠프 월도 에머슨 《자기신뢰》 & 《자연》 오버소울 비순응 자립 지표'));
  assert(prompt.includes(rep.activeEmersonTheme.themeTitleKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100'));
});

test('Henri Bergson Elan Vital Engine: calculates Pure Duration, Elan Vital, and Creative Freedom', () => {
  const rep = calculateHenriBergsonElanVital(profile);
  assert.equal(rep.engineVersion, FRENCH_HENRI_BERGSON_VERSION);
  assert(rep.pureDurationContinuityScore >= 0 && rep.pureDurationContinuityScore <= 100);
  assert(rep.elanVitalCreativeImpulseScore >= 0 && rep.elanVitalCreativeImpulseScore <= 100);
  assert(rep.intuitiveSympathyInsightScore >= 0 && rep.intuitiveSympathyInsightScore <= 100);
  assert(rep.creativeFreedomUnfoldingScore >= 0 && rep.creativeFreedomUnfoldingScore <= 100);
  assert(rep.openSocietyVitalityIndex >= 0 && rep.openSocietyVitalityIndex <= 100);
  assert(rep.activeBergsonTheme.themeTitleKo.length > 0);
  const prompt = formatHenriBergsonElanVitalPrompt(rep);
  assert(prompt.includes('앙리 베르그송 《시간과 자유의지·창조적 진화》 순수 지속 & 생명의 도약 성찰 가이드'));
  assert(prompt.includes(rep.activeBergsonTheme.themeTitleKo));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Albert Camus Absurd Revolt Engine: calculates Absurd Lucidity, Unceasing Revolt, and Sisyphus Happiness', () => {
  const rep = calculateAlbertCamusAbsurdRevolt(profile);
  assert.equal(rep.engineVersion, FRENCH_ALBERT_CAMUS_VERSION);
  assert(rep.absurdLucidityAwakeningScore >= 0 && rep.absurdLucidityAwakeningScore <= 100);
  assert(rep.unceasingRevoltDignityScore >= 0 && rep.unceasingRevoltDignityScore <= 100);
  assert(rep.passionateVitalityIndex >= 0 && rep.passionateVitalityIndex <= 100);
  assert(rep.lucidFreedomAutonomyScore >= 0 && rep.lucidFreedomAutonomyScore <= 100);
  assert(rep.sisyphusHappinessResilienceScore >= 0 && rep.sisyphusHappinessResilienceScore <= 100);
  assert(rep.activeCamusTheme.themeTitleKo.length > 0);
  const prompt = formatAlbertCamusAbsurdRevoltPrompt(rep);
  assert(prompt.includes('알베르 카뮈 《시지프 신화》 부조리의 자각 & 실존적 반항 지표'));
  assert(prompt.includes(rep.activeCamusTheme.themeTitleKo));
});

test('Yeonam Park Jiwon Yeolha Ilgi Engine: calculates One-Night Nine Crossings, Beopgo Changsin, and Iyongs Husaeng', () => {
  const rep = calculateYeonamParkJiwonYeolhaIlgi(profile, '새 진로와 사업 방향을 어떻게 결정해야 할까요', new Date('2026-11-15T05:00:00Z'));
  assert.equal(rep.engineVersion, KOREAN_YEONAM_PARK_JIWON_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert(rep.temporalYeonamRhythm.kstSlot.length > 0);
  assert(rep.nightCrossingRiverSerenityScore >= 0 && rep.nightCrossingRiverSerenityScore <= 100);
  assert(rep.beopgoChangsinCreativeWisdomScore >= 0 && rep.beopgoChangsinCreativeWisdomScore <= 100);
  assert(rep.iyongHusaengPracticalCompetenceScore >= 0 && rep.iyongHusaengPracticalCompetenceScore <= 100);
  assert(rep.bukhakOpenMindedInsightScore >= 0 && rep.bukhakOpenMindedInsightScore <= 100);
  assert(rep.haehakSatiricalGenerosityQuotient >= 0 && rep.haehakSatiricalGenerosityQuotient <= 100);
  assert(rep.activeYeonamTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.yeonamSynthesisMatrix?.integratedAction));
  assert(rep.dailyPracticeRitual.length > 0);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  const prompt = formatYeonamParkJiwonYeolhaIlgiPrompt(rep);
  assert(prompt.includes('연암 박지원 《열하일기》 일야구도 & 이용후생·법고창신 실학 지표'));
  assert(prompt.includes(rep.activeYeonamTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Jean-Paul Sartre Existentialism Engine: calculates Existence Precedes Essence, Condemned to be Free, and Engagement', () => {
  const rep = calculateJeanPaulSartreExistentialism(profile);
  assert.equal(rep.engineVersion, FRENCH_JEAN_PAUL_SARTRE_VERSION);
  assert(rep.existencePrecedesEssenceScore >= 0 && rep.existencePrecedesEssenceScore <= 100);
  assert(rep.condemnedToBeFreeScore >= 0 && rep.condemnedToBeFreeScore <= 100);
  assert(rep.badFaithOvercomingAuthenticityScore >= 0 && rep.badFaithOvercomingAuthenticityScore <= 100);
  assert(rep.existentialAnguishLucidityScore >= 0 && rep.existentialAnguishLucidityScore <= 100);
  assert(rep.engagementSolidarityActionIndex >= 0 && rep.engagementSolidarityActionIndex <= 100);
  assert(rep.activeSartreTheme.themeTitleKo.length > 0);
  const prompt = formatJeanPaulSartreExistentialismPrompt(rep);
  assert(prompt.includes('장 폴 사르트르 《존재와 무》 실존적 자유 & 앙가주망 지표'));
  assert(prompt.includes(rep.activeSartreTheme.themeTitleKo));
});

test('Viktor Frankl Logotherapy Engine: calculates The Last Human Freedom, Will to Meaning, and Tragic Optimism', () => {
  const rep = calculateViktorFranklLogotherapy(profile);
  assert.equal(rep.engineVersion, AUSTRIAN_VIKTOR_FRANKL_VERSION);
  assert(rep.lastHumanFreedomAttitudeScore >= 0 && rep.lastHumanFreedomAttitudeScore <= 100);
  assert(rep.willToMeaningDriveScore >= 0 && rep.willToMeaningDriveScore <= 100);
  assert(rep.tragicOptimismResilienceScore >= 0 && rep.tragicOptimismResilienceScore <= 100);
  assert(rep.selfTranscendenceDedicationScore >= 0 && rep.selfTranscendenceDedicationScore <= 100);
  assert(rep.lifeResponsibilityIntegrityIndex >= 0 && rep.lifeResponsibilityIntegrityIndex <= 100);
  assert(rep.activeFranklTheme.themeTitleKo.length > 0);
  const prompt = formatViktorFranklLogotherapyPrompt(rep);
  assert(prompt.includes('빅터 프랭클 《죽음의 수용소에서》 시련 속 최후의 자유 & 의미치료 지표'));
  assert(prompt.includes(rep.activeFranklTheme.themeTitleKo));
});

test('Baekbeom Kim Gu My Desire Culture Engine: calculates High Power of Culture, Hongik Ingan, and Snow Field Guidance', () => {
  const rep = calculateBaekbeomKimGuMyDesireCulture(profile);
  assert.equal(rep.engineVersion, KOREAN_BAEKBEOM_KIM_GU_VERSION);
  assert(rep.highCulturalPowerSpiritualScore >= 0 && rep.highCulturalPowerSpiritualScore <= 100);
  assert(rep.hongikInganUniversalPeaceScore >= 0 && rep.hongikInganUniversalPeaceScore <= 100);
  assert(rep.snowFieldExemplaryGuidanceScore >= 0 && rep.snowFieldExemplaryGuidanceScore <= 100);
  assert(rep.selfReliantIndependenceWillScore >= 0 && rep.selfReliantIndependenceWillScore <= 100);
  assert(rep.baekbeomHumilityPublicLoveIndex >= 0 && rep.baekbeomHumilityPublicLoveIndex <= 100);
  assert(rep.activeKimGuTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.kimGuSynthesisMatrix?.integratedAction));
  const prompt = formatBaekbeomKimGuMyDesireCulturePrompt(rep);
  assert(prompt.includes('백범 김구 《백범일지》 높은 문화의 힘 & 자주독립 실천 지표'));
  assert(prompt.includes(rep.activeKimGuTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Martin Heidegger Being and Time Engine: calculates In-der-Welt-sein, Eigentlichkeit, and Sein-zum-Tode', () => {
  const rep = calculateMartinHeideggerBeingAndTime(profile, '남들 눈치 보지 않고 미래 계획을 세우고 싶어요', new Date('2026-11-14T00:00:00Z'));
  assert.equal(rep.engineVersion, GERMAN_MARTIN_HEIDEGGER_VERSION);
  assert(rep.inDerWeltSeinRelationalScore >= 0 && rep.inDerWeltSeinRelationalScore <= 100);
  assert(rep.dasManOvercomingAuthenticityScore >= 0 && rep.dasManOvercomingAuthenticityScore <= 100);
  assert(rep.geworfenheitEntwurfProjectScore >= 0 && rep.geworfenheitEntwurfProjectScore <= 100);
  assert(rep.seinZumTodeLucidityScore >= 0 && rep.seinZumTodeLucidityScore <= 100);
  assert(rep.sorgeCareTemporalIndex >= 0 && rep.sorgeCareTemporalIndex <= 100);
  assert(rep.activeHeideggerTheme.themeTitleKo.length > 0);
  assert(rep.situationalDaseinAudit.focusAxisKo.length > 0);
  assert(rep.temporalAugenblickRhythm.authenticityClarityIndex >= 0 && rep.temporalAugenblickRhythm.authenticityClarityIndex <= 100);
  assert(rep.daseinSynthesisMatrix.overallDaseinGrade.length > 0);
  const prompt = formatMartinHeideggerBeingAndTimePrompt(rep);
  assert(prompt.includes('마틴 하이데거 《존재와 시간》 현존재 & 본래성 지표'));
  assert(prompt.includes(rep.activeHeideggerTheme.themeTitleKo));
  assert(prompt.includes('질문 맥락 현존재 국면'));
});

test('Hannah Arendt Vita Activa Engine: provides qualitative Natality guidance, question context and hides raw scores', () => {
  const rep = calculateHannahArendtVitaActiva(profile, '인간관계 갈등을 어떻게 풀어야 할까요?');
  assert.equal(rep.engineVersion, AMERICAN_GERMAN_HANNAH_ARENDT_VERSION);
  assert.equal(rep.questionTopic, 'relationship');
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.activeArendtTheme.themeTitleKo.length > 0);
  const prompt = formatHannahArendtVitaActivaPrompt(rep);
  assert(prompt.includes('한나 아렌트 《인간의 조건》 활동적 삶 & 탄생성 지표'));
  assert(prompt.includes(rep.activeArendtTheme.themeTitleKo));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Dosan Ahn Chang-ho Musil Yeokhaeng Engine: calculates Musil, Yeokhaeng, and Owner Responsibility', () => {
  const rep = calculateDosanAhnChanghoMusilYeokhaeng(profile);
  assert.equal(rep.engineVersion, KOREAN_DOSAN_AHN_CHANGHO_VERSION);
  assert(rep.musilTruthfulnessScore >= 0 && rep.musilTruthfulnessScore <= 100);
  assert(rep.yeokhaengActionPowerScore >= 0 && rep.yeokhaengActionPowerScore <= 100);
  assert(rep.chunguiYonggamIntegrityScore >= 0 && rep.chunguiYonggamIntegrityScore <= 100);
  assert(rep.aegiAetaCharacterIndex >= 0 && rep.aegiAetaCharacterIndex <= 100);
  assert(rep.masterMindOwnerResponsibilityScore >= 0 && rep.masterMindOwnerResponsibilityScore <= 100);
  assert(rep.activeDosanTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.dosanSynthesisMatrix?.integratedAction));
  const prompt = formatDosanAhnChanghoMusilYeokhaengPrompt(rep);
  assert(prompt.includes('도산 안창호 《무실역행》 인격혁명 & 주인정신 지표'));
  assert(prompt.includes(rep.activeDosanTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Henry David Thoreau Walden Engine: provides qualitative Simplicity guidance, question context and hides raw scores', () => {
  const rep = calculateHenryDavidThoreauWalden(profile, '마음이 지치고 휴식이 필요해요');
  assert.equal(rep.engineVersion, AMERICAN_HENRY_DAVID_THOREAU_VERSION);
  assert.equal(rep.questionTopic, 'healing');
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.activeThoreauTheme.themeTitleKo.length > 0);
  const prompt = formatHenryDavidThoreauWaldenPrompt(rep);
  assert(prompt.includes('헨리 데이비드 소로 《월든》 단순함 & 양심 지표'));
  assert(prompt.includes(rep.activeThoreauTheme.themeTitleKo));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('David Hume Treatise of Human Nature Engine: calculates Mitigated Skepticism, Sympathy, and Gentle Composure', () => {
  const rep = calculateDavidHumeTreatiseHumanNature(profile);
  assert.equal(rep.engineVersion, SCOTTISH_DAVID_HUME_VERSION);
  assert(rep.mitigatedSkepticismScore >= 0 && rep.mitigatedSkepticismScore <= 100);
  assert(rep.sympathyBenevolenceEmpathyScore >= 0 && rep.sympathyBenevolenceEmpathyScore <= 100);
  assert(rep.passionsReasonHarmonyScore >= 0 && rep.passionsReasonHarmonyScore <= 100);
  assert(rep.customExperienceWisdomIndex >= 0 && rep.customExperienceWisdomIndex <= 100);
  assert(rep.gentleComposurePeaceScore >= 0 && rep.gentleComposurePeaceScore <= 100);
  assert(rep.activeHumeTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.humeSynthesisMatrix?.integratedAction));
  const prompt = formatDavidHumeTreatiseHumanNaturePrompt(rep);
  assert(prompt.includes('데이비드 흄 《인간 본성에 관한 논고》 온건한 회의주의 & 공감 지표'));
  assert(prompt.includes(rep.activeHumeTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Manhae Han Yong-un Nimui Chimmuk Engine: calculates Transcendent Love, Gongyak Samjang, and Lotus Integrity', () => {
  const rep = calculateManhaeHanYongunNimuiChimmuk(profile);
  assert.equal(rep.engineVersion, KOREAN_MANHAE_HAN_YONGUN_VERSION);
  assert(rep.nimuiChimmukTranscendentLoveScore >= 0 && rep.nimuiChimmukTranscendentLoveScore <= 100);
  assert(rep.gongyakSamjangIndependenceSovereigntyScore >= 0 && rep.gongyakSamjangIndependenceSovereigntyScore <= 100);
  assert(rep.buddhistYusinReformationEnergyScore >= 0 && rep.buddhistYusinReformationEnergyScore <= 100);
  assert(rep.unyieldingLotusIntegrityIndex >= 0 && rep.unyieldingLotusIntegrityIndex <= 100);
  assert(rep.hwaduGreatDoubtEnlightenmentScore >= 0 && rep.hwaduGreatDoubtEnlightenmentScore <= 100);
  assert(rep.activeHanYongunTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.manhaeSynthesisMatrix?.integratedAction));
  const prompt = formatManhaeHanYongunNimuiChimmukPrompt(rep);
  assert(prompt.includes('만해 한용운 《님의 침묵》 역설적 사랑 & 자주 지조 지표'));
  assert(prompt.includes(rep.activeHanYongunTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Gottfried Leibniz Monadology Engine: calculates Pre-established Harmony, Monad Vis Viva, and Apperception', () => {
  const rep = calculateGottfriedLeibnizMonadologyHarmony(profile);
  assert.equal(rep.engineVersion, GERMAN_GOTTFRIED_LEIBNIZ_VERSION);
  assert(rep.preEstablishedHarmonyScore >= 0 && rep.preEstablishedHarmonyScore <= 100);
  assert(rep.monadIntrinsicVitalityIndex >= 0 && rep.monadIntrinsicVitalityIndex <= 100);
  assert(rep.apperceptionClarityScore >= 0 && rep.apperceptionClarityScore <= 100);
  assert(rep.bestPossibleWorldOptimismIndex >= 0 && rep.bestPossibleWorldOptimismIndex <= 100);
  assert(rep.sufficientReasonInsightScore >= 0 && rep.sufficientReasonInsightScore <= 100);
  assert(rep.activeLeibnizTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.leibnizSynthesisMatrix?.integratedAction));
  const prompt = formatGottfriedLeibnizMonadologyHarmonyPrompt(rep);
  assert(prompt.includes('라이프니츠 《단자론》 예정조화 & 최선의 세계 지표'));
  assert(prompt.includes(rep.activeLeibnizTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('John Locke Human Understanding Engine: calculates Tabula Rasa, Sensation/Reflection, and Natural Rights', () => {
  const rep = calculateJohnLockeHumanUnderstanding(profile, '사람들과의 관계에서 내 경계를 지키고 싶어요', new Date('2026-11-14T03:00:00Z'));
  assert.equal(rep.engineVersion, BRITISH_JOHN_LOCKE_VERSION);
  assert.equal(rep.questionTopic, 'relationship');
  assert(rep.temporalLockeRhythm.kstDateLabel === '2026-11-14');
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.tabulaRasaOpenReceptivityScore >= 0 && rep.tabulaRasaOpenReceptivityScore <= 100);
  assert(rep.sensationReflectionBalanceIndex >= 0 && rep.sensationReflectionBalanceIndex <= 100);
  assert(rep.naturalRightsInviolabilityScore >= 0 && rep.naturalRightsInviolabilityScore <= 100);
  assert(rep.socialContractMutualTrustIndex >= 0 && rep.socialContractMutualTrustIndex <= 100);
  assert(rep.tolerantPrudenceWisdomScore >= 0 && rep.tolerantPrudenceWisdomScore <= 100);
  assert(rep.activeLockeTheme.themeTitleKo.length > 0);
  const prompt = formatJohnLockeHumanUnderstandingPrompt(rep);
  assert(prompt.includes('존 로크 《인간 오성론》 타불라 라사 & 천부인권 지표'));
  assert(prompt.includes(rep.activeLockeTheme.themeTitleKo));
  assert(prompt.includes('질문 주제 맥락: relationship'));
  assert(prompt.includes('KST 시공간 리듬:'));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Hyecho Wang Ocheonchukgukjeon Engine: calculates Pilgrimage Pioneer Spirit, Frontier Resilience, and Poetic Equanimity', () => {
  const rep = calculateHyechoWangOcheonchukgukjeon(profile);
  assert.equal(rep.engineVersion, KOREAN_HYECHO_VERSION);
  assert(rep.pilgrimagePioneerSpiritScore >= 0 && rep.pilgrimagePioneerSpiritScore <= 100);
  assert(rep.extremeFrontierResilienceIndex >= 0 && rep.extremeFrontierResilienceIndex <= 100);
  assert(rep.nostalgicPoeticEquanimityScore >= 0 && rep.nostalgicPoeticEquanimityScore <= 100);
  assert(rep.culturalOpennessCompassionIndex >= 0 && rep.culturalOpennessCompassionIndex <= 100);
  assert(rep.bodhisattvaFieldWisdomScore >= 0 && rep.bodhisattvaFieldWisdomScore <= 100);
  assert(rep.activeHyechoTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.hyechoSynthesisMatrix?.integratedAction));
  const prompt = formatHyechoWangOcheonchukgukjeonPrompt(rep);
  assert(prompt.includes('혜초 《왕오천축국전》 구도 순례 & 역경 극복 지표'));
  assert(prompt.includes(rep.activeHyechoTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Plotinus Enneads Henosis Engine: calculates The One, Nous, Psyche, Henosis, and Inner Beauty Sculpting', () => {
  const rep = calculateAncientGreekPlotinusEnneadsHenosis(profile);
  assert.equal(rep.engineVersion, ANCIENT_GREEK_PLOTINUS_VERSION);
  assert(rep.theOneSupremeSourceEmanationScore >= 0 && rep.theOneSupremeSourceEmanationScore <= 100);
  assert(rep.nousIntellectualContemplationIndex >= 0 && rep.nousIntellectualContemplationIndex <= 100);
  assert(rep.psycheSoulSelfCultivationScore >= 0 && rep.psycheSoulSelfCultivationScore <= 100);
  assert(rep.henosisMysticAscentUnionIndex >= 0 && rep.henosisMysticAscentUnionIndex <= 100);
  assert(rep.innerBeautySculptingVirtueScore >= 0 && rep.innerBeautySculptingVirtueScore <= 100);
  assert(rep.activePlotinusTheme.themeTitleKo.length > 0);
  const prompt = formatAncientGreekPlotinusEnneadsHenosisPrompt(rep);
  assert(prompt.includes('플로티노스 《엔네아데스》 일자유출설 & 영적 귀환 지표'));
  assert(prompt.includes(rep.activePlotinusTheme.themeTitleKo));
});

test('Adam Smith Moral Sentiments Engine: calculates Impartial Spectator, Sympathy, Self-Command, and Praiseworthiness', () => {
  const rep = calculateScottishAdamSmithMoralSentiments(profile);
  assert.equal(rep.engineVersion, SCOTTISH_ADAM_SMITH_VERSION);
  assert(rep.impartialSpectatorConscienceScore >= 0 && rep.impartialSpectatorConscienceScore <= 100);
  assert(rep.mutualSympathyFellowFeelingIndex >= 0 && rep.mutualSympathyFellowFeelingIndex <= 100);
  assert(rep.selfCommandEquanimityScore >= 0 && rep.selfCommandEquanimityScore <= 100);
  assert(rep.justiceBeneficenceHarmonyIndex >= 0 && rep.justiceBeneficenceHarmonyIndex <= 100);
  assert(rep.praiseworthinessIntegrityScore >= 0 && rep.praiseworthinessIntegrityScore <= 100);
  assert(rep.activeAdamSmithTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.adamSmithSynthesisMatrix?.integratedAction));
  const prompt = formatScottishAdamSmithMoralSentimentsPrompt(rep);
  assert(prompt.includes('아담 스미스 《도덕감정론》 공정한 관찰자 & 공감·자기통제 지표'));
  assert(prompt.includes(rep.activeAdamSmithTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Yun Dong-ju Sky Wind Stars Poetry Engine: calculates Pure Conscience, Wellspring Reflection, Compassion, and Lantern of Hope', () => {
  const rep = calculateKoreanYunDongJuSkyWindStarsPoetry(profile);
  assert.equal(rep.engineVersion, KOREAN_YUN_DONG_JU_VERSION);
  assert(rep.pureConscienceIntegrityScore >= 0 && rep.pureConscienceIntegrityScore <= 100);
  assert(rep.wellspringSelfReflectiveSincerityIndex >= 0 && rep.wellspringSelfReflectiveSincerityIndex <= 100);
  assert(rep.leafBreezeCompassionSensibilityScore >= 0 && rep.leafBreezeCompassionSensibilityScore <= 100);
  assert(rep.starCountingImmortalLoveIndex >= 0 && rep.starCountingImmortalLoveIndex <= 100);
  assert(rep.lanternHopeResilienceScore >= 0 && rep.lanternHopeResilienceScore <= 100);
  assert(rep.activeYunDongJuTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.yunDongJuSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanYunDongJuSkyWindStarsPoetryPrompt(rep);
  assert(prompt.includes('윤동주 《하늘과 바람과 별과 시》 순결한 양심 & 실존성찰 지표'));
  assert(prompt.includes(rep.activeYunDongJuTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Leo Tolstoy Calendar of Wisdom Engine: calculates Spiritual Awakening, Agape Love, Simplicity, and Conscience Integrity', () => {
  const rep = calculateRussianLeoTolstoyCalendarOfWisdom(profile);
  assert.equal(rep.engineVersion, RUSSIAN_LEO_TOLSTOY_VERSION);
  assert(rep.spiritualAwakeningScore >= 0 && rep.spiritualAwakeningScore <= 100);
  assert(rep.agapeLoveAltruismIndex >= 0 && rep.agapeLoveAltruismIndex <= 100);
  assert(rep.simpleLifeLaborHarmonyScore >= 0 && rep.simpleLifeLaborHarmonyScore <= 100);
  assert(rep.nonViolencePeaceEquanimityIndex >= 0 && rep.nonViolencePeaceEquanimityIndex <= 100);
  assert(rep.existentialConscienceIntegrityScore >= 0 && rep.existentialConscienceIntegrityScore <= 100);
  assert(rep.activeTolstoyTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.tolstoySynthesisMatrix?.integratedAction));
  const prompt = formatRussianLeoTolstoyCalendarOfWisdomPrompt(rep);
  assert(prompt.includes('레프 톨스토이 《인생독본·사람은 무엇으로 사는가》 영적 각성 & 아가페 사랑 지표'));
  assert(prompt.includes(rep.activeTolstoyTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Rabindranath Tagore Gitanjali Engine: calculates Cosmic Soul Communion, Bhakti Devotion, Fearless Freedom, and Lamp of the East', () => {
  const rep = calculateIndianRabindranathTagoreGitanjali(profile);
  assert.equal(rep.engineVersion, INDIAN_TAGORE_GITANJALI_VERSION);
  assert(rep.cosmicSoulCommunionScore >= 0 && rep.cosmicSoulCommunionScore <= 100);
  assert(rep.pureDevotionalBhaktiIndex >= 0 && rep.pureDevotionalBhaktiIndex <= 100);
  assert(rep.fearlessFreedomMindScore >= 0 && rep.fearlessFreedomMindScore <= 100);
  assert(rep.lyricNatureHarmonizationIndex >= 0 && rep.lyricNatureHarmonizationIndex <= 100);
  assert(rep.lampOfTheEastResilienceScore >= 0 && rep.lampOfTheEastResilienceScore <= 100);
  assert(rep.activeTagoreTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.tagoreSynthesisMatrix?.integratedAction));
  const prompt = formatIndianRabindranathTagoreGitanjaliPrompt(rep);
  assert(prompt.includes('타고르 《기탄잘리·동방의 등불》 우주적 영혼합일 & 두려움 없는 자유 지표'));
  assert(prompt.includes(rep.activeTagoreTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Lee Yuk-sa Gwangya Peak Engine: calculates Peak Resilience, Steel Rainbow, Hero Calling, Sowing Song Seed, and Pure Integrity', () => {
  const rep = calculateKoreanLeeYukSaGwangyaPeak(profile);
  assert.equal(rep.engineVersion, KOREAN_LEE_YUK_SA_VERSION);
  assert(rep.peakResilienceInBitterSeasonScore >= 0 && rep.peakResilienceInBitterSeasonScore <= 100);
  assert(rep.steelRainbowTranscendenceIndex >= 0 && rep.steelRainbowTranscendenceIndex <= 100);
  assert(rep.visionaryCallingOfHeroScore >= 0 && rep.visionaryCallingOfHeroScore <= 100);
  assert(rep.sowingPoorSongSeedVirtueIndex >= 0 && rep.sowingPoorSongSeedVirtueIndex <= 100);
  assert(rep.pureIntegrityCheongpodoScore >= 0 && rep.pureIntegrityCheongpodoScore <= 100);
  assert(rep.activeLeeYukSaTheme.themeTitleKo.length > 0);
  assert(rep.secondaryLeeYukSaTheme.themeKey !== rep.activeLeeYukSaTheme.themeKey);
  assert(rep.secondaryLeeYukSaAphorism.aphorismKey !== rep.focalLeeYukSaAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.leeYukSaSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanLeeYukSaGwangyaPeak(profile, '거친 환경 속에서도 꺾이지 않고 나아가는 법');
  assert(repQ.reflectiveQuestion.includes('거친 환경'));
  const prompt = formatKoreanLeeYukSaGwangyaPeakPrompt(repQ);
  assert(prompt.includes('이육사 《광야·절정·청포도》 강철 무지개 실존의지 & 선구자 지표'));
  assert(prompt.includes(repQ.activeLeeYukSaTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryLeeYukSaTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Hermann Hesse Demian Siddhartha Engine: calculates Abraxas Self-Actualization, Polarity Harmonization, and River Wisdom', () => {
  const rep = calculateGermanSwissHermannHesseDemianSiddhartha(profile);
  assert.equal(rep.engineVersion, GERMAN_HERMANN_HESSE_VERSION);
  assert(rep.abraxasSelfActualizationScore >= 0 && rep.abraxasSelfActualizationScore <= 100);
  assert(rep.innerPolarityHarmonizationIndex >= 0 && rep.innerPolarityHarmonizationIndex <= 100);
  assert(rep.siddharthaAutonomousQuestScore >= 0 && rep.siddharthaAutonomousQuestScore <= 100);
  assert(rep.riverWisdomUnityIndex >= 0 && rep.riverWisdomUnityIndex <= 100);
  assert(rep.innerCallingFidelityScore >= 0 && rep.innerCallingFidelityScore <= 100);
  assert(rep.activeHesseTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.hesseSynthesisMatrix?.integratedAction));
  const prompt = formatGermanSwissHermannHesseDemianSiddharthaPrompt(rep);
  assert(prompt.includes('헤르만 헤세 《데미안·싯다르타》 아브락사스 자아실현 & 내면의 길 지표'));
  assert(prompt.includes(rep.activeHesseTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Martin Buber I and Thou Dialogue Engine: calculates I-Thou Resonance, Authentic Dialogue, and Between-Sphere Meaning', () => {
  const rep = calculateAustrianMartinBuberIAndThou(profile);
  assert.equal(rep.engineVersion, AUSTRIAN_MARTIN_BUBER_VERSION);
  assert(rep.iThouRelationalResonanceScore >= 0 && rep.iThouRelationalResonanceScore <= 100);
  assert(rep.authenticDialoguePresenceIndex >= 0 && rep.authenticDialoguePresenceIndex <= 100);
  assert(rep.overcomingInstrumentalizationScore >= 0 && rep.overcomingInstrumentalizationScore <= 100);
  assert(rep.betweenSphereMeaningIndex >= 0 && rep.betweenSphereMeaningIndex <= 100);
  assert(rep.eternalThouCommunionTrustScore >= 0 && rep.eternalThouCommunionTrustScore <= 100);
  assert(rep.activeBuberTheme.themeTitleKo.length > 0);
  const prompt = formatAustrianMartinBuberIAndThouPrompt(rep);
  assert(prompt.includes('마틴 부버 《나와 너》 인격적 만남 & 진정한 대화(Dialogue) 실존 지표'));
  assert(prompt.includes(rep.activeBuberTheme.themeTitleKo));
});

test('Sambong Jeong Do-jeon Minbon Reform Engine: calculates Minbon Serving, Institutional Reform, Clean Governance, and Indomitable Tenacity', () => {
  const rep = calculateKoreanSambongJeongDoJeonMinbonReform(profile);
  assert.equal(rep.engineVersion, KOREAN_JEONG_DO_JEON_VERSION);
  assert(rep.minbonPeopleServingScore >= 0 && rep.minbonPeopleServingScore <= 100);
  assert(rep.jeongdoInstitutionalReformScore >= 0 && rep.jeongdoInstitutionalReformScore <= 100);
  assert(rep.cleanGovernanceIntegrityIndex >= 0 && rep.cleanGovernanceIntegrityIndex <= 100);
  assert(rep.architecturalForesightIndex >= 0 && rep.architecturalForesightIndex <= 100);
  assert(rep.indomitableReformTenacityScore >= 0 && rep.indomitableReformTenacityScore <= 100);
  assert(rep.activeSambongTheme.themeTitleKo.length > 0);
  assert(rep.secondarySambongTheme.themeKey !== rep.activeSambongTheme.themeKey);
  assert(rep.secondarySambongAphorism.aphorismKey !== rep.focalSambongAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.sambongSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanSambongJeongDoJeonMinbonReform(profile, '사람들에게 실질적으로 도움이 되는 새로운 규칙 설계');
  assert(repQ.reflectiveQuestion.includes('새로운 규칙'));
  const prompt = formatKoreanSambongJeongDoJeonMinbonReformPrompt(repQ);
  assert(prompt.includes('삼봉 정도전 《조선경국전·경제문감》 민본사상 & 정도(正道) 개혁 실천 지표'));
  assert(prompt.includes(repQ.activeSambongTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondarySambongTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Bertrand Russell Conquest of Happiness Engine: calculates Zest for Life, Overcoming Self-Absorption, Constructive Work, and Rational Equanimity', () => {
  const rep = calculateBritishBertrandRussellConquestOfHappiness(profile);
  assert.equal(rep.engineVersion, BRITISH_BERTRAND_RUSSELL_VERSION);
  assert(rep.zestForLifeIndex >= 0 && rep.zestForLifeIndex <= 100);
  assert(rep.overcomingSelfAbsorptionIndex >= 0 && rep.overcomingSelfAbsorptionIndex <= 100);
  assert(rep.constructiveWorkFulfillmentScore >= 0 && rep.constructiveWorkFulfillmentScore <= 100);
  assert(rep.impersonalInterestsVitalityIndex >= 0 && rep.impersonalInterestsVitalityIndex <= 100);
  assert(rep.rationalEquanimityResilienceScore >= 0 && rep.rationalEquanimityResilienceScore <= 100);
  assert(rep.activeRussellTheme.themeTitleKo.length > 0);
  const prompt = formatBritishBertrandRussellConquestOfHappinessPrompt(rep);
  assert(prompt.includes('버트런드 러셀 《행복의 정복》 열정적 관심 & 합리적 낙관 지표'));
  assert(prompt.includes(rep.activeRussellTheme.themeTitleKo));
});

test('Karl Jaspers Existenz Grenzsituationen Engine: calculates Grenzsituationen Acceptance, Existential Leap, Cipher Transcendence, and Loving Struggle Communication', () => {
  const rep = calculateGermanKarlJaspersExistenzGrenzsituationen(profile);
  assert.equal(rep.engineVersion, GERMAN_KARL_JASPERS_VERSION);
  assert(rep.grenzsituationenAcceptanceScore >= 0 && rep.grenzsituationenAcceptanceScore <= 100);
  assert(rep.existentialLeapFreedomScore >= 0 && rep.existentialLeapFreedomScore <= 100);
  assert(rep.cipherTranscendenceInsightIndex >= 0 && rep.cipherTranscendenceInsightIndex <= 100);
  assert(rep.lovingStruggleCommunicationScore >= 0 && rep.lovingStruggleCommunicationScore <= 100);
  assert(rep.reasonExistenzHarmonizationIndex >= 0 && rep.reasonExistenzHarmonizationIndex <= 100);
  assert(rep.activeJaspersTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.jaspersSynthesisMatrix?.integratedAction));
  const prompt = formatGermanKarlJaspersExistenzGrenzsituationenPrompt(rep);
  assert(prompt.includes('카를 야스퍼스 《철학》 한계상황 직시 & 초월자 암호·실존적 소통 지표'));
  assert(prompt.includes(rep.activeJaspersTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Maewoldang Kim Si-seup Geumo Sinhwa Engine: calculates Fangwairen Freedom, Clean Fidelity, Transcendent Love, and Three Teachings Harmony', () => {
  const rep = calculateKoreanMaewoldangKimSiSeupGeumoSinhwa(profile);
  assert.equal(rep.engineVersion, KOREAN_KIM_SI_SEUP_VERSION);
  assert(rep.fangwairenFreedomScore >= 0 && rep.fangwairenFreedomScore <= 100);
  assert(rep.indomitableFidelityConscienceScore >= 0 && rep.indomitableFidelityConscienceScore <= 100);
  assert(rep.transcendentLoveLiteraryIndex >= 0 && rep.transcendentLoveLiteraryIndex <= 100);
  assert(rep.threeTeachingsSyncreticHarmonyIndex >= 0 && rep.threeTeachingsSyncreticHarmonyIndex <= 100);
  assert(rep.cheonghanSolitudeTranscendenceScore >= 0 && rep.cheonghanSolitudeTranscendenceScore <= 100);
  assert(rep.activeMaewoldangTheme.themeTitleKo.length > 0);
  assert(rep.secondaryMaewoldangTheme.themeKey !== rep.activeMaewoldangTheme.themeKey);
  assert(rep.secondaryMaewoldangAphorism.aphorismKey !== rep.focalMaewoldangAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.maewoldangSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanMaewoldangKimSiSeupGeumoSinhwa(profile, '남의 시선에 흔들리지 않고 내 길을 지키는 법');
  assert(repQ.reflectiveQuestion.includes('남의 시선'));
  const prompt = formatKoreanMaewoldangKimSiSeupGeumoSinhwaPrompt(repQ);
  assert(prompt.includes('매월당 김시습 《금오신화》 방외인 자유혼 & 절의·삼교원융 지표'));
  assert(prompt.includes(repQ.activeMaewoldangTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryMaewoldangTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('William James Pragmatism Will to Believe Engine: calculates Cash-Value, Will to Believe, Stream of Consciousness, and Healthy-Mindedness', () => {
  const rep = calculateAmericanWilliamJamesPragmatism(profile);
  assert.equal(rep.engineVersion, AMERICAN_WILLIAM_JAMES_VERSION);
  assert(rep.practicalCashValueIndex >= 0 && rep.practicalCashValueIndex <= 100);
  assert(rep.willToBelieveConfidenceScore >= 0 && rep.willToBelieveConfidenceScore <= 100);
  assert(rep.streamOfConsciousnessVitalityIndex >= 0 && rep.streamOfConsciousnessVitalityIndex <= 100);
  assert(rep.pluralisticOpennessScore >= 0 && rep.pluralisticOpennessScore <= 100);
  assert(rep.healthyMindedResilienceIndex >= 0 && rep.healthyMindedResilienceIndex <= 100);
  assert(rep.activeJamesTheme.themeTitleKo.length > 0);
  const prompt = formatAmericanWilliamJamesPragmatismPrompt(rep);
  assert(prompt.includes('윌리엄 제임스 《실용주의》 & 《신념의 의지》 실천적 현금가치 지표'));
  assert(prompt.includes(rep.activeJamesTheme.themeTitleKo));
});

test('Erich Fromm Art of Loving Being Engine: calculates Active Care, Respect & Knowledge, Being Mode, and Positive Freedom', () => {
  const rep = calculateGermanErichFrommArtOfLovingBeing(profile);
  assert.equal(rep.engineVersion, GERMAN_ERICH_FROMM_VERSION);
  assert(rep.activeCareAndResponsibilityIndex >= 0 && rep.activeCareAndResponsibilityIndex <= 100);
  assert(rep.respectAndKnowledgeWisdomScore >= 0 && rep.respectAndKnowledgeWisdomScore <= 100);
  assert(rep.beingModeFulfillmentIndex >= 0 && rep.beingModeFulfillmentIndex <= 100);
  assert(rep.positiveFreedomAutonomyScore >= 0 && rep.positiveFreedomAutonomyScore <= 100);
  assert(rep.productiveOrientationVitalityScore >= 0 && rep.productiveOrientationVitalityScore <= 100);
  assert(rep.activeFrommTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.frommSynthesisMatrix?.integratedAction));
  const prompt = formatGermanErichFrommArtOfLovingBeingPrompt(rep);
  assert(prompt.includes('에리히 프롬 《사랑의 기술》 & 《소유냐 존재냐》 능동적 사랑과 존재 지표'));
  assert(prompt.includes(rep.activeFrommTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Danjae Shin Chae-ho Joseon Sanggosa Engine: calculates Ah vs Non-Ah Subjective Consciousness, Sovereign Integrity, and Nangga Spirit', () => {
  const rep = calculateKoreanDanjaeShinChaeHoJoseonSanggosa(profile);
  assert.equal(rep.engineVersion, KOREAN_DANJAE_SHIN_CHAE_HO_VERSION);
  assert(rep.ahSubjectiveConsciousnessIndex >= 0 && rep.ahSubjectiveConsciousnessIndex <= 100);
  assert(rep.uncompromisingIndependenceScore >= 0 && rep.uncompromisingIndependenceScore <= 100);
  assert(rep.historicalIdentityReclamationScore >= 0 && rep.historicalIdentityReclamationScore <= 100);
  assert(rep.peoplesDirectRevolutionDynamic >= 0 && rep.peoplesDirectRevolutionDynamic <= 100);
  assert(rep.indomitableDanjaeResilienceIndex >= 0 && rep.indomitableDanjaeResilienceIndex <= 100);
  assert(rep.activeDanjaeTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.danjaeSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanDanjaeShinChaeHoJoseonSanggosaPrompt(rep);
  assert(prompt.includes('단재 신채호 《조선상고사》 & 〈조선혁명선언〉 아(我)의 주체자각 & 자주독립 지표'));
  assert(prompt.includes(rep.activeDanjaeTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Charles de Montesquieu Spirit of Laws Engine: calculates Checks and Balances, Political Liberty, Contextual Prudence, and Civic Virtue', () => {
  const rep = calculateFrenchMontesquieuSpiritOfLaws(profile);
  assert.equal(rep.engineVersion, FRENCH_MONTESQUIEU_SPIRIT_OF_LAWS_VERSION);
  assert(rep.checksAndBalancesPrudenceIndex >= 0 && rep.checksAndBalancesPrudenceIndex <= 100);
  assert(rep.politicalLibertyTemperanceScore >= 0 && rep.politicalLibertyTemperanceScore <= 100);
  assert(rep.contextualSpiritOfLawsWisdomIndex >= 0 && rep.contextualSpiritOfLawsWisdomIndex <= 100);
  assert(rep.civicVirtuePublicSpiritScore >= 0 && rep.civicVirtuePublicSpiritScore <= 100);
  assert(rep.enlightenedPluralismToleranceIndex >= 0 && rep.enlightenedPluralismToleranceIndex <= 100);
  assert(rep.activeMontesquieuTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.montesquieuSynthesisMatrix?.integratedAction));
  const prompt = formatFrenchMontesquieuSpiritOfLawsPrompt(rep);
  assert(prompt.includes('샤를 드 몽테스키외 《법의 정신》 견제와 균형 & 권력분립 지표'));
  assert(prompt.includes(rep.activeMontesquieuTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Gaston Bachelard Poetics of Space Engine: calculates Material Imagination, House Sanctuary, Candle Meditation, and Dual Spiral', () => {
  const rep = calculateFrenchGastonBachelardPoeticsOfSpace(profile, '요즘 너무 지쳐서 마음의 휴식과 회복이 필요해요', new Date('2026-11-15T14:00:00Z'));
  assert.equal(rep.engineVersion, FRENCH_GASTON_BACHELARD_POETICS_VERSION);
  assert.equal(rep.questionTopic, 'healing');
  assert(rep.temporalBachelardRhythm.kstDateLabel === '2026-11-15');
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.materialImaginationVitalityIndex >= 0 && rep.materialImaginationVitalityIndex <= 100);
  assert(rep.poeticsOfHouseSanctuaryScore >= 0 && rep.poeticsOfHouseSanctuaryScore <= 100);
  assert(rep.solitaryCandleMeditationIndex >= 0 && rep.solitaryCandleMeditationIndex <= 100);
  assert(rep.dualSpiralReasonPoeticsScore >= 0 && rep.dualSpiralReasonPoeticsScore <= 100);
  assert(rep.cosmicIntimacyReverieResilience >= 0 && rep.cosmicIntimacyReverieResilience <= 100);
  assert(rep.activeBachelardTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchGastonBachelardPoeticsOfSpacePrompt(rep);
  assert(prompt.includes('가스통 바슐라르 《공간의 시학》 & 《촛불의 미학》 몽상의 시학 지표'));
  assert(prompt.includes(rep.activeBachelardTheme.themeTitleKo));
  assert(prompt.includes('질문 맞춤 실천 가이드'));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Nammyeong Jo Sik Gyeong-Ui Engine: calculates Inner Clarity Gyeong, Outer Decisive Ui, Seongseongja Vigilance, and Danseongso Integrity', () => {
  const rep = calculateKoreanNammyeongJoSikGyeongUi(profile);
  assert.equal(rep.engineVersion, KOREAN_NAMMYEONG_JO_SIK_VERSION);
  assert(rep.innerClarityGyeongScore >= 0 && rep.innerClarityGyeongScore <= 100);
  assert(rep.outerDecisiveUiScore >= 0 && rep.outerDecisiveUiScore <= 100);
  assert(rep.seongseongjaBellAwakeningIndex >= 0 && rep.seongseongjaBellAwakeningIndex <= 100);
  assert(rep.danseongsoUprightCourageScore >= 0 && rep.danseongsoUprightCourageScore <= 100);
  assert(rep.sancheonjaeActionScholarshipIndex >= 0 && rep.sancheonjaeActionScholarshipIndex <= 100);
  assert(rep.activeNammyeongTheme.themeTitleKo.length > 0);
  assert(rep.secondaryNammyeongTheme.themeKey !== rep.activeNammyeongTheme.themeKey);
  assert(rep.secondaryNammyeongAphorism.aphorismKey !== rep.focalNammyeongAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.nammyeongSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanNammyeongJoSikGyeongUi(profile, '망설임을 끊고 옳은 결단을 내리는 기준');
  assert(repQ.reflectiveQuestion.includes('옳은 결단'));
  const prompt = formatKoreanNammyeongJoSikGyeongUiPrompt(repQ);
  assert(prompt.includes('남명 조식 선생 《내명자경 외단자의》 경의검 & 성성자 실천 지표'));
  assert(prompt.includes(repQ.activeNammyeongTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryNammyeongTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Albert Schweitzer Reverence for Life Engine: calculates Reverence for Life, Altruistic Service, and Civilizational Renewal', () => {
  const rep = calculateGermanAlbertSchweitzerReverenceForLife(profile);
  assert.equal(rep.engineVersion, GERMAN_ALBERT_SCHWEITZER_VERSION);
  assert(rep.reverenceForLifeEthicalIndex >= 0 && rep.reverenceForLifeEthicalIndex <= 100);
  assert(rep.altruisticServiceDevotionScore >= 0 && rep.altruisticServiceDevotionScore <= 100);
  assert(rep.culturalMoralRenewalScore >= 0 && rep.culturalMoralRenewalScore <= 100);
  assert(rep.infiniteResponsibilityConscienceIndex >= 0 && rep.infiniteResponsibilityConscienceIndex <= 100);
  assert(rep.spiritualEquanimityHarmonyIndex >= 0 && rep.spiritualEquanimityHarmonyIndex <= 100);
  assert(rep.activeSchweitzerTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.schweitzerSynthesisMatrix?.integratedAction));
  const prompt = formatGermanAlbertSchweitzerReverenceForLifePrompt(rep);
  assert(prompt.includes('알베르트 슈바이처 《생명에 대한 경외》 & 《문화와 윤리》 생명외경 지표'));
  assert(prompt.includes(rep.activeSchweitzerTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Michel de Montaigne Essays Engine: calculates Epistemic Humility, Candid Self-Observation, and Inner Freedom Sanctuary', () => {
  const rep = calculateFrenchMichelDeMontaigneEssays(profile);
  assert.equal(rep.engineVersion, FRENCH_MICHEL_DE_MONTAIGNE_VERSION);
  assert(rep.epistemicHumilityQueSaisJeIndex >= 0 && rep.epistemicHumilityQueSaisJeIndex <= 100);
  assert(rep.candidSelfObservationIntrospectionScore >= 0 && rep.candidSelfObservationIntrospectionScore <= 100);
  assert(rep.toleranceMiddleWayPrudenceIndex >= 0 && rep.toleranceMiddleWayPrudenceIndex <= 100);
  assert(rep.humanConditionAcceptanceScore >= 0 && rep.humanConditionAcceptanceScore <= 100);
  assert(rep.innerFreedomSanctuaryIndex >= 0 && rep.innerFreedomSanctuaryIndex <= 100);
  assert(rep.activeMontaigneTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.montaigneSynthesisMatrix?.integratedAction));
  const prompt = formatFrenchMichelDeMontaigneEssaysPrompt(rep);
  assert(prompt.includes('미셸 드 몽테뉴 《수상록(Les Essais)》 "내가 무엇을 아는가" 지혜 지표'));
  assert(prompt.includes(rep.activeMontaigneTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ohseong and Haneum Friendship Governance Engine: calculates Lifelong Moral Friendship, Crisis Governance, and Humor Wit Magnanimity', () => {
  const rep = calculateKoreanOhseongHaneumFriendshipGovernance(profile, '친구와 동료 사이의 갈등을 어떻게 풀어야 할까요', new Date('2026-11-15T05:00:00Z'));
  assert.equal(rep.engineVersion, KOREAN_OHSEONG_HANEUM_VERSION);
  assert.equal(rep.questionTopic, 'relationship');
  assert(rep.temporalOhseongHaneumRhythm.kstSlot.length > 0);
  assert(rep.lifelongMoralFriendshipTrustIndex >= 0 && rep.lifelongMoralFriendshipTrustIndex <= 100);
  assert(rep.crisisGovernanceStatesmanshipScore >= 0 && rep.crisisGovernanceStatesmanshipScore <= 100);
  assert(rep.humorWitMagnanimityResilienceIndex >= 0 && rep.humorWitMagnanimityResilienceIndex <= 100);
  assert(rep.antiFactionalImpartialityScore >= 0 && rep.antiFactionalImpartialityScore <= 100);
  assert(rep.unyieldingFidelityGraceIndex >= 0 && rep.unyieldingFidelityGraceIndex <= 100);
  assert(rep.activeOhseongHaneumTheme.themeTitleKo.length > 0);
  assert(rep.dailyPracticeRitual.length > 0);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.ohseongHaneumSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanOhseongHaneumFriendshipGovernancePrompt(rep);
  assert(prompt.includes('오성과 한음(이항복·이덕형) 지기지우 & 경세제민 지혜 지표'));
  assert(prompt.includes(rep.activeOhseongHaneumTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Voltaire Candide and Tolerance Engine: calculates Cultivate Our Garden Devotion, Tolerance, and Satirical Wit', () => {
  const rep = calculateFrenchVoltaireCandideTolerance(profile, '사람들과의 갈등을 어떻게 풀어야 할까요', new Date('2026-11-15T05:00:00Z'));
  assert.equal(rep.engineVersion, FRENCH_VOLTAIRE_CANDIDE_TOLERANCE_VERSION);
  assert.equal(rep.questionTopic, 'relationship');
  assert(rep.temporalRhythm.kstSlot.length > 0);
  assert(rep.dailyPracticeRitual.length > 0);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.cultivateOurGardenPragmaticDevotionScore >= 0 && rep.cultivateOurGardenPragmaticDevotionScore <= 100);
  assert(rep.toleranceEnlightenedReasonIndex >= 0 && rep.toleranceEnlightenedReasonIndex <= 100);
  assert(rep.witSatiricalPiercingInsightScore >= 0 && rep.witSatiricalPiercingInsightScore <= 100);
  assert(rep.justiceAdvocacyConscienceScore >= 0 && rep.justiceAdvocacyConscienceScore <= 100);
  assert(rep.realisticDisillusionmentClarityIndex >= 0 && rep.realisticDisillusionmentClarityIndex <= 100);
  assert(rep.activeVoltaireTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.voltaireSynthesisMatrix?.integratedAction));
  const prompt = formatFrenchVoltaireCandideTolerancePrompt(rep);
  assert(prompt.includes('볼테르 《캉디드》 & 《관용론》 일상 실천 및 관용 지혜 지표'));
  assert(prompt.includes(rep.activeVoltaireTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Walt Whitman Leaves of Grass Engine: calculates Song of Myself, Multitudes Inclusivity, and Open Road Spirit', () => {
  const rep = calculateAmericanWaltWhitmanLeavesOfGrass(profile, '새로운 일을 시작할 때 두려움을 떨치고 싶어요', new Date('2026-11-14T03:00:00Z'));
  assert.equal(rep.engineVersion, AMERICAN_WALT_WHITMAN_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert.equal(rep.temporalWhitmanRhythm.kstDateLabel, '2026-11-14');
  assert(rep.songOfMyselfSelfCelebrationScore >= 0 && rep.songOfMyselfSelfCelebrationScore <= 100);
  assert(rep.embracingMultitudesInclusivityIndex >= 0 && rep.embracingMultitudesInclusivityIndex <= 100);
  assert(rep.leavesOfGrassWonderVitalityScore >= 0 && rep.leavesOfGrassWonderVitalityScore <= 100);
  assert(rep.democraticFreedomOpenRoadIndex >= 0 && rep.democraticFreedomOpenRoadIndex <= 100);
  assert(rep.cyclicalNatureOptimisticResilienceScore >= 0 && rep.cyclicalNatureOptimisticResilienceScore <= 100);
  assert(rep.activeWhitmanTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.whitmanSynthesisMatrix.coreInsight.length > 0);
  assert(rep.practiceGuidance.length > 0 && rep.ritualAction.length > 0 && rep.reflectionFocus.length > 0 && rep.boundaryNotice.length > 0);
  const prompt = formatAmericanWaltWhitmanLeavesOfGrassPrompt(rep);
  assert(prompt.includes('월트 휘트먼 《풀잎(Leaves of Grass)》 우주적 생명 찬가 지표'));
  assert(prompt.includes(rep.activeWhitmanTheme.themeTitleKo));
  assert(prompt.includes('2026-11-14'));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Ahn Jung-geun Peace and Righteousness Engine: calculates Moral Righteousness, Sovereign Peace, and Daily Reading', () => {
  const rep = calculateKoreanAhnJungGeunPeaceRighteousness(profile);
  assert.equal(rep.engineVersion, KOREAN_AHN_JUNG_GEUN_VERSION);
  assert(rep.moralRighteousnessOverGainScore >= 0 && rep.moralRighteousnessOverGainScore <= 100);
  assert(rep.sovereignPeaceCoexistenceIndex >= 0 && rep.sovereignPeaceCoexistenceIndex <= 100);
  assert(rep.courageousDevotionFortitudeScore >= 0 && rep.courageousDevotionFortitudeScore <= 100);
  assert(rep.intellectualCultivationReadingIndex >= 0 && rep.intellectualCultivationReadingIndex <= 100);
  assert(rep.sublimePatienceMagnanimousPeaceScore >= 0 && rep.sublimePatienceMagnanimousPeaceScore <= 100);
  assert(rep.activeAhnJungGeunTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.ahnJungGeunSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanAhnJungGeunPeaceRighteousnessPrompt(rep);
  assert(prompt.includes('안중근 의사 《동양평화론》 및 〈견리사의 견위수명〉 대의·평화 지표'));
  assert(prompt.includes(rep.activeAhnJungGeunTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Alfred Adler Individual Psychology Engine: calculates Inferiority Transcendence, Community Feeling, and Separation of Tasks', () => {
  const rep = calculateAustrianAlfredAdlerIndividualPsychology(profile);
  assert.equal(rep.engineVersion, AUSTRIAN_ALFRED_ADLER_INDIVIDUAL_PSYCHOLOGY_VERSION);
  assert(rep.inferiorityTranscendenceHealthyStrivingScore >= 0 && rep.inferiorityTranscendenceHealthyStrivingScore <= 100);
  assert(rep.communityFeelingContributionIndex >= 0 && rep.communityFeelingContributionIndex <= 100);
  assert(rep.separationOfTasksCourageScore >= 0 && rep.separationOfTasksCourageScore <= 100);
  assert(rep.teleologicalReframingCreationIndex >= 0 && rep.teleologicalReframingCreationIndex <= 100);
  assert(rep.courageToBeImperfectResilienceScore >= 0 && rep.courageToBeImperfectResilienceScore <= 100);
  assert(rep.activeAdlerTheme.themeTitleKo.length > 0);
  const prompt = formatAustrianAlfredAdlerIndividualPsychologyPrompt(rep);
  assert(prompt.includes('알프레트 아들러 《인간이해》 & 《삶의 의미》 열등감 극복 및 공동체 감각 지혜 지표'));
  assert(prompt.includes(rep.activeAdlerTheme.themeTitleKo));
});

test('Friedrich Schiller Aesthetic Education Engine: calculates Play Drive, Aesthetic Freedom, and Grace & Dignity', () => {
  const rep = calculateGermanFriedrichSchillerAestheticEducation(profile);
  assert.equal(rep.engineVersion, GERMAN_FRIEDRICH_SCHILLER_AESTHETIC_EDUCATION_VERSION);
  assert(rep.spieltriebPlayDriveHarmonyScore >= 0 && rep.spieltriebPlayDriveHarmonyScore <= 100);
  assert(rep.aestheticStateFreedomIndex >= 0 && rep.aestheticStateFreedomIndex <= 100);
  assert(rep.livingFormBeautyCreativityScore >= 0 && rep.livingFormBeautyCreativityScore <= 100);
  assert(rep.graceAndDignityIntegrityScore >= 0 && rep.graceAndDignityIntegrityScore <= 100);
  assert(rep.aestheticHealingWholenessResilienceScore >= 0 && rep.aestheticHealingWholenessResilienceScore <= 100);
  assert(rep.activeSchillerTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.schillerSynthesisMatrix?.integratedAction));
  const prompt = formatGermanFriedrichSchillerAestheticEducationPrompt(rep);
  assert(prompt.includes('프리드리히 실러 《인간의 미적 교육에 관한 편지》 놀이 충동 및 미적 자유 지표'));
  assert(prompt.includes(rep.activeSchillerTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Hong Dae-yong Uisan Mundap Engine: calculates Infinite Universe, Earth Rotation, and In-Mul-Gyun Equality', () => {
  const rep = calculateKoreanDamheonHongDaeYongUisanMundap(profile);
  assert.equal(rep.engineVersion, KOREAN_DAMHEON_HONG_DAE_YONG_UISAN_MUNDAP_VERSION);
  assert(rep.infiniteUniverseRotationCosmologicalInsightScore >= 0 && rep.infiniteUniverseRotationCosmologicalInsightScore <= 100);
  assert(rep.egalitarianHarmonyHumansNatureIndex >= 0 && rep.egalitarianHarmonyHumansNatureIndex <= 100);
  assert(rep.universalRelativismOpenMindednessScore >= 0 && rep.universalRelativismOpenMindednessScore <= 100);
  assert(rep.scientificEmpiricismDisillusionmentIndex >= 0 && rep.scientificEmpiricismDisillusionmentIndex <= 100);
  assert(rep.magnanimousGeomungoResilienceScore >= 0 && rep.magnanimousGeomungoResilienceScore <= 100);
  assert(rep.activeHongDaeYongTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.hongDaeYongSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanDamheonHongDaeYongUisanMundapPrompt(rep);
  assert(prompt.includes('담헌 홍대용 《의산문답》 지전설·무한우주론 및 인물균 지혜 지표'));
  assert(prompt.includes(rep.activeHongDaeYongTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Wittgenstein Language Game and Silence Engine: calculates Logical Clarity, Silence, and Meaning as Use', () => {
  const rep = calculateAustrianWittgensteinLanguageGameSilence(profile);
  assert.equal(rep.engineVersion, AUSTRIAN_WITTGENSTEIN_LANGUAGE_GAME_SILENCE_VERSION);
  assert(rep.logicalClarityTractatusPrecisionIndex >= 0 && rep.logicalClarityTractatusPrecisionIndex <= 100);
  assert(rep.mysticalSilenceReverenceScore >= 0 && rep.mysticalSilenceReverenceScore <= 100);
  assert(rep.languageGameContextualFlexibilityIndex >= 0 && rep.languageGameContextualFlexibilityIndex <= 100);
  assert(rep.meaningAsUsePragmaticActionScore >= 0 && rep.meaningAsUsePragmaticActionScore <= 100);
  assert(rep.therapeuticDissolutionClarityScore >= 0 && rep.therapeuticDissolutionClarityScore <= 100);
  assert(rep.activeWittgensteinTheme.themeTitleKo.length > 0);
  const prompt = formatAustrianWittgensteinLanguageGameSilencePrompt(rep);
  assert(prompt.includes('비트겐슈타인 《논리철학논고·철학적 탐구》 언어게임·침묵 지혜 지표'));
  assert(prompt.includes(rep.activeWittgensteinTheme.themeTitleKo));
});

test('Gilles Deleuze Rhizome and Becoming Engine: calculates Rhizomatic Connection, Deterritorialization, and Becoming', () => {
  const rep = calculateFrenchGillesDeleuzeRhizomeBecoming(profile);
  assert.equal(rep.engineVersion, FRENCH_GILLES_DELEUZE_RHIZOME_BECOMING_VERSION);
  assert(rep.rhizomaticHorizontalConnectionIndex >= 0 && rep.rhizomaticHorizontalConnectionIndex <= 100);
  assert(rep.deterritorializationNomadicFreedomScore >= 0 && rep.deterritorializationNomadicFreedomScore <= 100);
  assert(rep.affirmationOfDifferenceMultiplicityIndex >= 0 && rep.affirmationOfDifferenceMultiplicityIndex <= 100);
  assert(rep.creativeBecomingVitalityScore >= 0 && rep.creativeBecomingVitalityScore <= 100);
  assert(rep.desiringProductionLiberationResilienceScore >= 0 && rep.desiringProductionLiberationResilienceScore <= 100);
  assert(rep.activeDeleuzeTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchGillesDeleuzeRhizomeBecomingPrompt(rep);
  assert(prompt.includes('들뢰즈 《천 개의 고원·차이와 반복》 리좀·탈영토화·생성 성찰 가이드'));
  assert(prompt.includes(rep.activeDeleuzeTheme.themeTitleKo));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Heo Jun Dongui Bogam Yangsaeng Engine: calculates Tong-Jeuk-Bul-Tong, Cheon-In-Sang-Eung, and Chi-Mi-Byeong', () => {
  const rep = calculateKoreanHeoJunDonguiBogamYangsaeng(profile);
  assert.equal(rep.engineVersion, KOREAN_HEO_JUN_DONGUI_BOGAM_YANGSAENG_VERSION);
  assert(rep.tongJeukBulTongCirculationIndex >= 0 && rep.tongJeukBulTongCirculationIndex <= 100);
  assert(rep.bodyCosmosCorrespondenceHarmonyScore >= 0 && rep.bodyCosmosCorrespondenceHarmonyScore <= 100);
  assert(rep.preventiveChiMiByeongYangsaengIndex >= 0 && rep.preventiveChiMiByeongYangsaengIndex <= 100);
  assert(rep.essenceQiSpiritPreservationScore >= 0 && rep.essenceQiSpiritPreservationScore <= 100);
  assert(rep.beneficentCompassionHealingResilienceScore >= 0 && rep.beneficentCompassionHealingResilienceScore <= 100);
  assert(rep.activeHeoJunTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.heoJunSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanHeoJunDonguiBogamYangsaengPrompt(rep);
  assert(prompt.includes('구암 허준 《동의보감》 신형장부도·통즉불통 및 치미병 양생 지혜 지표'));
  assert(prompt.includes(rep.activeHeoJunTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Desiderius Erasmus Praise of Folly Engine: calculates Humorous Wisdom, Dogma Dissolution, and Humanistic Tolerance', () => {
  const rep = calculateDutchDesideriusErasmusPraiseOfFolly(profile, '사람들과의 갈등 속에서 마음을 넓히고 싶어요', new Date('2026-11-14T03:00:00Z'));
  assert.equal(rep.engineVersion, DUTCH_DESIDERIUS_ERASMUS_PRAISE_OF_FOLLY_VERSION);
  assert.equal(rep.questionTopic, 'relationship');
  assert.equal(rep.temporalErasmusRhythm.kstDateLabel, '2026-11-14');
  assert(rep.follyHumorousWisdomScore >= 0 && rep.follyHumorousWisdomScore <= 100);
  assert(rep.dogmaticPrejudiceDissolutionIndex >= 0 && rep.dogmaticPrejudiceDissolutionIndex <= 100);
  assert(rep.renaissanceHumanisticToleranceScore >= 0 && rep.renaissanceHumanisticToleranceScore <= 100);
  assert(rep.practicalSincereVirtueIndex >= 0 && rep.practicalSincereVirtueIndex <= 100);
  assert(rep.cheerfulResilienceScore >= 0 && rep.cheerfulResilienceScore <= 100);
  assert(rep.activeErasmusTheme.themeTitleKo.length > 0);
  assert(rep.practiceGuidance.length > 0 && rep.ritualAction.length > 0 && rep.reflectionFocus.length > 0 && rep.boundaryNotice.length > 0);
  const prompt = formatDutchDesideriusErasmusPraiseOfFollyPrompt(rep);
  assert(prompt.includes('데시데리우스 에라스무스 《우신예찬》 르네상스 휴머니즘 및 해학·관용 지혜 지표'));
  assert(prompt.includes(rep.activeErasmusTheme.themeTitleKo));
  assert(prompt.includes('2026-11-14'));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Thomas More Utopia Engine: calculates Communal Conscience, Labor-Leisure Balance, and Spiritual Integrity', () => {
  const rep = calculateBritishThomasMoreUtopia(profile, '일과 쉼의 균형을 지키며 지친 마음을 추스르고 싶어요', new Date('2026-11-14T03:00:00Z'));
  assert.equal(rep.engineVersion, BRITISH_THOMAS_MORE_UTOPIA_VERSION);
  assert.equal(rep.questionTopic, 'healing');
  assert.equal(rep.temporalMoreRhythm.kstDateLabel, '2026-11-14');
  assert(rep.communalConscienceJusticeScore >= 0 && rep.communalConscienceJusticeScore <= 100);
  assert(rep.laborOtiumBalancedHarmonyIndex >= 0 && rep.laborOtiumBalancedHarmonyIndex <= 100);
  assert(rep.spiritualIntegrityPurityScore >= 0 && rep.spiritualIntegrityPurityScore <= 100);
  assert(rep.visionarySocialReformIndex >= 0 && rep.visionarySocialReformIndex <= 100);
  assert(rep.steadfastMoralCourageResilienceScore >= 0 && rep.steadfastMoralCourageResilienceScore <= 100);
  assert(rep.activeMoreTheme.themeTitleKo.length > 0);
  assert(rep.practiceGuidance.length > 0 && rep.ritualAction.length > 0 && rep.reflectionFocus.length > 0 && rep.boundaryNotice.length > 0);
  const prompt = formatBritishThomasMoreUtopiaPrompt(rep);
  assert(prompt.includes('토머스 모어 《유토피아》 공동체 양심·삶의 균형 및 도덕적 용기 지표'));
  assert(prompt.includes(rep.activeMoreTheme.themeTitleKo));
  assert(prompt.includes('2026-11-14'));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Gosan Yoon Seon-do Five Friends Engine: calculates Five Friends Integrity, Four Seasons Equanimity, and Bamboo Humility', () => {
  const rep = calculateKoreanGosanYoonSeonDoFiveFriends(profile);
  assert.equal(rep.engineVersion, KOREAN_GOSAN_YOON_SEON_DO_FIVE_FRIENDS_VERSION);
  assert(rep.fiveFriendsIntegrityIndex >= 0 && rep.fiveFriendsIntegrityIndex <= 100);
  assert(rep.fourSeasonsAestheticEquanimityScore >= 0 && rep.fourSeasonsAestheticEquanimityScore <= 100);
  assert(rep.bambooHollowHumilityScore >= 0 && rep.bambooHollowHumilityScore <= 100);
  assert(rep.waterUnceasingPurityIndex >= 0 && rep.waterUnceasingPurityIndex <= 100);
  assert(rep.seyeonjeongSolitaryResilienceScore >= 0 && rep.seyeonjeongSolitaryResilienceScore <= 100);
  assert(rep.activeYoonTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.yoonSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanGosanYoonSeonDoFiveFriendsPrompt(rep);
  assert(prompt.includes('고산 윤선도 《오우가》 수석송죽월 5우 지조 및 《어부사시사》 심미적 안빈낙도 지표'));
  assert(prompt.includes(rep.activeYoonTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Giovanni Pico della Mirandola Dignity Engine: calculates Free Will Agency, Infinite Potential, and Syncretic Wisdom', () => {
  const rep = calculateItalianPicoDellaMirandolaDignity(profile);
  assert.equal(rep.engineVersion, ITALIAN_PICO_DELLA_MIRANDOLA_DIGNITY_VERSION);
  assert(rep.freeWillAgencyScore >= 0 && rep.freeWillAgencyScore <= 100);
  assert(rep.infinitePotentialIndex >= 0 && rep.infinitePotentialIndex <= 100);
  assert(rep.syncreticUniversalWisdomScore >= 0 && rep.syncreticUniversalWisdomScore <= 100);
  assert(rep.innerPurificationPeaceIndex >= 0 && rep.innerPurificationPeaceIndex <= 100);
  assert(rep.sovereignDignityResilienceScore >= 0 && rep.sovereignDignityResilienceScore <= 100);
  assert(rep.activePicoTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.picoSynthesisMatrix?.integratedAction));
  const prompt = formatItalianPicoDellaMirandolaDignityPrompt(rep);
  assert(prompt.includes('조반니 피코 델라 미란돌라 《인간의 존엄성에 관한 연설》 자유의지 및 주체적 존엄성 지표'));
  assert(prompt.includes(rep.activePicoTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Franz Kafka Existential Truth Engine: calculates Existential Honesty, Inner Sanctity, and Frozen Sea Piercing Insight', () => {
  const rep = calculateAustrianFranzKafkaExistentialTruth(profile);
  assert.equal(rep.engineVersion, AUSTRIAN_FRANZ_KAFKA_EXISTENTIAL_TRUTH_VERSION);
  assert(rep.existentialHonestyScore >= 0 && rep.existentialHonestyScore <= 100);
  assert(rep.innerSanctityInAlienationIndex >= 0 && rep.innerSanctityInAlienationIndex <= 100);
  assert(rep.persistentTruthSearchScore >= 0 && rep.persistentTruthSearchScore <= 100);
  assert(rep.frozenSeaPiercingInsightIndex >= 0 && rep.frozenSeaPiercingInsightIndex <= 100);
  assert(rep.transformativeSolitudeResilienceScore >= 0 && rep.transformativeSolitudeResilienceScore <= 100);
  assert(rep.activeKafkaTheme.themeTitleKo.length > 0);
  const prompt = formatAustrianFranzKafkaExistentialTruthPrompt(rep);
  assert(prompt.includes('프란츠 카프카 《변신·성》 부조리 직시와 실존적 정직성 및 내적 존엄성 지표'));
  assert(prompt.includes(rep.activeKafkaTheme.themeTitleKo));
});

test('Poeun Jeong Mong-ju Dansimga Engine: calculates Dansimga Moral Fidelity, Diplomatic Statesmanship, and Undaunted Integrity', () => {
  const rep = calculateKoreanPoeunJeongMongJuDansimga(profile);
  assert.equal(rep.engineVersion, KOREAN_POEUN_JEONG_MONG_JU_DANSIMGA_VERSION);
  assert(rep.dansimgaMoralFidelityScore >= 0 && rep.dansimgaMoralFidelityScore <= 100);
  assert(rep.righteousNobleResolutionIndex >= 0 && rep.righteousNobleResolutionIndex <= 100);
  assert(rep.diplomaticStatesmanshipScore >= 0 && rep.diplomaticStatesmanshipScore <= 100);
  assert(rep.foundationalScholarshipGovernanceIndex >= 0 && rep.foundationalScholarshipGovernanceIndex <= 100);
  assert(rep.undauntedIntegrityResilienceScore >= 0 && rep.undauntedIntegrityResilienceScore <= 100);
  assert(rep.activePoeunTheme.themeTitleKo.length > 0);
  assert(rep.secondaryPoeunTheme.themeKey !== rep.activePoeunTheme.themeKey);
  assert(rep.secondaryPoeunAphorism.aphorismKey !== rep.focalPoeunAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.poeunSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanPoeunJeongMongJuDansimga(profile, '흔들리는 상황 속에서 끝까지 지켜야 할 신의');
  assert(repQ.reflectiveQuestion.includes('지켜야 할 신의'));
  const prompt = formatKoreanPoeunJeongMongJuDansimgaPrompt(repQ);
  assert(prompt.includes('포은 정몽주 《단심가·포은집》 일편단심 지조 및 경세외교 지략 지표'));
  assert(prompt.includes(repQ.activePoeunTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryPoeunTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Simone de Beauvoir Ambiguity & Freedom Engine: calculates Self-Creation, Ethics of Ambiguity, and Mutual Freedom Solidarity', () => {
  const rep = calculateFrenchSimoneDeBeauvoirAmbiguityFreedom(profile);
  assert.equal(rep.engineVersion, FRENCH_SIMONE_DE_BEAUVOIR_AMBIGUITY_FREEDOM_VERSION);
  assert(rep.authenticSelfCreationScore >= 0 && rep.authenticSelfCreationScore <= 100);
  assert(rep.ethicsOfAmbiguityIndex >= 0 && rep.ethicsOfAmbiguityIndex <= 100);
  assert(rep.mutualFreedomSolidarityScore >= 0 && rep.mutualFreedomSolidarityScore <= 100);
  assert(rep.situationalAgencyIndex >= 0 && rep.situationalAgencyIndex <= 100);
  assert(rep.existentialCourageResilienceScore >= 0 && rep.existentialCourageResilienceScore <= 100);
  assert(rep.activeBeauvoirTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchSimoneDeBeauvoirAmbiguityFreedomPrompt(rep);
  assert(prompt.includes('시몬 드 보부아르 《애매성의 윤리학》 실존적 자기창조 및 상호자유 지표'));
  assert(prompt.includes(rep.activeBeauvoirTheme.themeTitleKo));
});

test('Maurice Merleau-Ponty Embodied Phenomenology Engine: calculates Body-Subject Embodiment, Primordial Perception, and Chiasmic Harmony', () => {
  const rep = calculateFrenchMauriceMerleauPontyEmbodiedPhenomenology(profile);
  assert.equal(rep.engineVersion, FRENCH_MAURICE_MERLEAU_PONTY_EMBODIED_PHENOMENOLOGY_VERSION);
  assert(rep.corpsSujetEmbodimentScore >= 0 && rep.corpsSujetEmbodimentScore <= 100);
  assert(rep.primordialPerceptionIndex >= 0 && rep.primordialPerceptionIndex <= 100);
  assert(rep.chiasmicIntercorporealityScore >= 0 && rep.chiasmicIntercorporealityScore <= 100);
  assert(rep.sensoryCreativeEyeScore >= 0 && rep.sensoryCreativeEyeScore <= 100);
  assert(rep.phenomenologicalGroundingResilienceScore >= 0 && rep.phenomenologicalGroundingResilienceScore <= 100);
  assert(rep.activePontyTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchMauriceMerleauPontyEmbodiedPhenomenologyPrompt(rep);
  assert(prompt.includes('모리스 메를로퐁티 《지각의 현상학·눈과 마음》 신체-주체 및 원초적 지각 성찰 가이드'));
  assert(prompt.includes(rep.activePontyTheme.themeTitleKo));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Samyeongdaesa Songun Yujeong Engine: calculates Righteous Devotion, Diplomatic Rescue, and Transcendent Compassion', () => {
  const rep = calculateKoreanSamyeongdaesaSongunYujeong(profile);
  assert.equal(rep.engineVersion, KOREAN_SAMYEONGDAESA_SONGUN_YUJEONG_VERSION);
  assert(rep.righteousDevotionScore >= 0 && rep.righteousDevotionScore <= 100);
  assert(rep.diplomaticRescueIndex >= 0 && rep.diplomaticRescueIndex <= 100);
  assert(rep.transcendentCompassionScore >= 0 && rep.transcendentCompassionScore <= 100);
  assert(rep.pragmaticBodhisattvaIndex >= 0 && rep.pragmaticBodhisattvaIndex <= 100);
  assert(rep.renunciationResilienceScore >= 0 && rep.renunciationResilienceScore <= 100);
  assert(rep.activeSamyeongTheme.themeTitleKo.length > 0);
  assert(rep.secondarySamyeongTheme.themeKey !== rep.activeSamyeongTheme.themeKey);
  assert(rep.secondarySamyeongAphorism.aphorismKey !== rep.focalSamyeongAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.samyeongSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanSamyeongdaesaSongunYujeong(profile, '사적인 안위를 넘어 지켜야 할 대의');
  assert(repQ.reflectiveQuestion.includes('지켜야 할 대의'));
  const prompt = formatKoreanSamyeongdaesaSongunYujeongPrompt(repQ);
  assert(prompt.includes('사명대사 송운 유정 《분충서난록》 호국대의 및 자비구제 지표'));
  assert(prompt.includes(repQ.activeSamyeongTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondarySamyeongTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Shin Saimdang Chochungdo Art Virtue Engine: calculates Nature Vitality, Filial Concord, and Sage Self-Realization', () => {
  const rep = calculateKoreanShinSaimdangChochungdoArtVirtue(profile);
  assert.equal(rep.engineVersion, KOREAN_SHIN_SAIMDANG_CHOCHUNGDO_ART_VIRTUE_VERSION);
  assert(rep.natureVitalityContemplationScore >= 0 && rep.natureVitalityContemplationScore <= 100);
  assert(rep.filialPietyAffectionIndex >= 0 && rep.filialPietyAffectionIndex <= 100);
  assert(rep.sageSelfRealizationScore >= 0 && rep.sageSelfRealizationScore <= 100);
  assert(rep.modestEleganceIndex >= 0 && rep.modestEleganceIndex <= 100);
  assert(rep.nurturingWisdomScore >= 0 && rep.nurturingWisdomScore <= 100);
  assert(rep.activeSaimdangTheme.themeTitleKo.length > 0);
  assert(rep.secondarySaimdangTheme.themeKey !== rep.activeSaimdangTheme.themeKey);
  assert(rep.secondarySaimdangAphorism.aphorismKey !== rep.focalSaimdangAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.saimdangSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanShinSaimdangChochungdoArtVirtue(profile, '지나치기 쉬운 작은 디테일과 진심');
  assert(repQ.reflectiveQuestion.includes('작은 디테일과 진심'));
  const prompt = formatKoreanShinSaimdangChochungdoArtVirtuePrompt(repQ);
  assert(prompt.includes('신사임당 《초충도》 자연관조 및 현철자아실현 지표'));
  assert(prompt.includes(repQ.activeSaimdangTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondarySaimdangTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Edmund Husserl Phenomenological Reduction Engine: calculates Epoché Suspension, Zu den Sachen selbst, and Wesensschau Insight', () => {
  const rep = calculateGermanEdmundHusserlPhenomenologicalReduction(profile);
  assert.equal(rep.engineVersion, GERMAN_EDMUND_HUSSERL_PHENOMENOLOGY_VERSION);
  assert(rep.phenomenologicalEpochéScore >= 0 && rep.phenomenologicalEpochéScore <= 100);
  assert(rep.returnToThingsThemselvesIndex >= 0 && rep.returnToThingsThemselvesIndex <= 100);
  assert(rep.essentialWesensschauScore >= 0 && rep.essentialWesensschauScore <= 100);
  assert(rep.intentionalityFocusIndex >= 0 && rep.intentionalityFocusIndex <= 100);
  assert(rep.lebensweltGroundingScore >= 0 && rep.lebensweltGroundingScore <= 100);
  assert(rep.activeHusserlTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.husserlSynthesisMatrix?.integratedAction));
  const prompt = formatGermanEdmundHusserlPhenomenologicalReductionPrompt(rep);
  assert(prompt.includes('에드문트 후설 《순수현상학의 이념들》 현상학적 환원 및 본질직관 지표'));
  assert(prompt.includes(rep.activeHusserlTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Michel Foucault Care of Self Aesthetics Engine: calculates Care of Self, Discipline Liberation, and Parrhesia Courage', () => {
  const rep = calculateFrenchMichelFoucaultCareOfSelfAesthetics(profile);
  assert.equal(rep.engineVersion, FRENCH_MICHEL_FOUCAULT_CARE_OF_SELF_VERSION);
  assert(rep.careOfSelfEpimeleiaScore >= 0 && rep.careOfSelfEpimeleiaScore <= 100);
  assert(rep.discourseDisciplineLiberationIndex >= 0 && rep.discourseDisciplineLiberationIndex <= 100);
  assert(rep.aestheticsOfExistenceScore >= 0 && rep.aestheticsOfExistenceScore <= 100);
  assert(rep.parrhesiaTruthCourageIndex >= 0 && rep.parrhesiaTruthCourageIndex <= 100);
  assert(rep.selfMasteryGovernanceScore >= 0 && rep.selfMasteryGovernanceScore <= 100);
  assert(rep.activeFoucaultTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchMichelFoucaultCareOfSelfAestheticsPrompt(rep);
  assert(prompt.includes('미셸 푸코 《주체의 해석학·자기 배려》 규율권력 탈피 및 존재의 미학 지표'));
  assert(prompt.includes(rep.activeFoucaultTheme.themeTitleKo));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Walter Benjamin Aura and Now-Time Engine: calculates Aura Authenticity, Angelus Novus, and Messianic Jetztzeit', () => {
  const rep = calculateGermanWalterBenjaminAuraNowTime(profile);
  assert.equal(rep.engineVersion, GERMAN_WALTER_BENJAMIN_AURA_NOWTIME_VERSION);
  assert(rep.auraAuthenticityResonanceScore >= 0 && rep.auraAuthenticityResonanceScore <= 100);
  assert(rep.angelusNovusHistoricalInsightIndex >= 0 && rep.angelusNovusHistoricalInsightIndex <= 100);
  assert(rep.jetztzeitMessianicMomentumScore >= 0 && rep.jetztzeitMessianicMomentumScore <= 100);
  assert(rep.flaneurDialecticalIlluminationIndex >= 0 && rep.flaneurDialecticalIlluminationIndex <= 100);
  assert(rep.allegoricalRedemptionScore >= 0 && rep.allegoricalRedemptionScore <= 100);
  assert(rep.activeBenjaminTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.benjaminSynthesisMatrix?.integratedAction));
  const prompt = formatGermanWalterBenjaminAuraNowTimePrompt(rep);
  assert(prompt.includes('발터 벤야민 《역사의 개념에 대하여》 아우라·지금-시간(Jetztzeit) 지표'));
  assert(prompt.includes(rep.activeBenjaminTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Emmanuel Levinas Face of the Other and Hospitality Engine: calculates Face Encounter, Infinite Responsibility, and Hospitality', () => {
  const rep = calculateFrenchEmmanuelLevinasFaceOfOtherHospitality(profile, '가까운 동료와의 갈등을 어떻게 화해로 풀어야 할까요?', new Date('2026-11-15T10:00:00Z'));
  assert.equal(rep.engineVersion, FRENCH_EMMANUEL_LEVINAS_ETHICS_VERSION);
  assert.equal(rep.questionTopic, 'relationship');
  assert(rep.temporalLevinasRhythm.kstDateLabel === '2026-11-15');
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.faceOfOtherEncounterScore >= 0 && rep.faceOfOtherEncounterScore <= 100);
  assert(rep.infiniteResponsibilityIndex >= 0 && rep.infiniteResponsibilityIndex <= 100);
  assert(rep.unconditionalHospitalityScore >= 0 && rep.unconditionalHospitalityScore <= 100);
  assert(rep.beyondTotalityInfinityIndex >= 0 && rep.beyondTotalityInfinityIndex <= 100);
  assert(rep.vulnerabilityProtectionScore >= 0 && rep.vulnerabilityProtectionScore <= 100);
  assert(rep.activeLevinasTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchEmmanuelLevinasFaceOfOtherHospitalityPrompt(rep);
  assert(prompt.includes('에마뉘엘 레비나스 《전체성과 무한》 타자의 얼굴·무한한 책임 지표'));
  assert(prompt.includes(rep.activeLevinasTheme.themeTitleKo));
  assert(prompt.includes('질문 맞춤 실천 가이드'));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Theodor Adorno Negative Dialectics and Minima Moralia Engine: calculates Non-Identical Safeguard, Damaged Life, and Dissonance Tolerance', () => {
  const rep = calculateGermanTheodorAdornoNegativeDialecticsMinimaMoralia(profile);
  assert.equal(rep.engineVersion, GERMAN_THEODOR_ADORNO_NEGATIVE_DIALECTICS_VERSION);
  assert(rep.nonIdenticalSafeguardScore >= 0 && rep.nonIdenticalSafeguardScore <= 100);
  assert(rep.damagedLifeCriticalReflectionIndex >= 0 && rep.damagedLifeCriticalReflectionIndex <= 100);
  assert(rep.instrumentalReasonTranscendenceScore >= 0 && rep.instrumentalReasonTranscendenceScore <= 100);
  assert(rep.dissonanceResilienceIndex >= 0 && rep.dissonanceResilienceIndex <= 100);
  assert(rep.constellationDialecticsScore >= 0 && rep.constellationDialecticsScore <= 100);
  assert(rep.activeAdornoTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.adornoSynthesisMatrix?.integratedAction));
  const prompt = formatGermanTheodorAdornoNegativeDialecticsMinimaMoraliaPrompt(rep);
  assert(prompt.includes('테오도어 아도르노 《부정변증법》 비동일자 수호·미니마 모랄리아 지표'));
  assert(prompt.includes(rep.activeAdornoTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Jacques Derrida Deconstruction and Differance Engine: calculates Differance, Binary Deconstruction, Aporia, and Hospitality', () => {
  const rep = calculateFrenchJacquesDerridaDeconstructionDifferance(profile);
  assert.equal(rep.engineVersion, FRENCH_JACQUES_DERRIDA_DECONSTRUCTION_DIFFERANCE_VERSION);
  assert(rep.differancePostponementSpacializationScore >= 0 && rep.differancePostponementSpacializationScore <= 100);
  assert(rep.binaryOppositionDeconstructionIndex >= 0 && rep.binaryOppositionDeconstructionIndex <= 100);
  assert(rep.aporiaBreakthroughResolutionScore >= 0 && rep.aporiaBreakthroughResolutionScore <= 100);
  assert(rep.unconditionalHospitalityEmpathyIndex >= 0 && rep.unconditionalHospitalityEmpathyIndex <= 100);
  assert(rep.pharmakonTransformativeHealingScore >= 0 && rep.pharmakonTransformativeHealingScore <= 100);
  assert(rep.activeDerridaTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchJacquesDerridaDeconstructionDifferancePrompt(rep);
  assert(prompt.includes('자크 데리다 《그라마톨로지》 해체(Deconstruction)·차연(Différance) 지표'));
  assert(prompt.includes(rep.activeDerridaTheme.themeTitleKo));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Jurgen Habermas Communicative Action and Public Sphere Engine: calculates Better Argument, Mutual Understanding, and Lifeworld Defense', () => {
  const rep = calculateGermanJurgenHabermasCommunicativeAction(profile);
  assert.equal(rep.engineVersion, GERMAN_JURGEN_HABERMAS_COMMUNICATIVE_ACTION_VERSION);
  assert(rep.betterArgumentUnforcedForceScore >= 0 && rep.betterArgumentUnforcedForceScore <= 100);
  assert(rep.mutualUnderstandingOrientationIndex >= 0 && rep.mutualUnderstandingOrientationIndex <= 100);
  assert(rep.idealSpeechSituationFairnessScore >= 0 && rep.idealSpeechSituationFairnessScore <= 100);
  assert(rep.lifeworldColonizationDefenseIndex >= 0 && rep.lifeworldColonizationDefenseIndex <= 100);
  assert(rep.deliberativeDemocraticConsensusScore >= 0 && rep.deliberativeDemocraticConsensusScore <= 100);
  assert(rep.activeHabermasTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.habermasSynthesisMatrix?.integratedAction));
  const prompt = formatGermanJurgenHabermasCommunicativeActionPrompt(rep);
  assert(prompt.includes('위르겐 하버마스 《의사소통행위이론》 더 나은 논증의 힘·공론장 지표'));
  assert(prompt.includes(rep.activeHabermasTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Roland Barthes Semiotics and Punctum Engine: calculates Punctum Intuition, Demythologization, and Death of Author', () => {
  const rep = calculateFrenchRolandBarthesSemioticsPunctum(profile);
  assert.equal(rep.engineVersion, FRENCH_ROLAND_BARTHES_SEMIOTICS_PUNCTUM_VERSION);
  assert(rep.punctumAffectiveIntuitionScore >= 0 && rep.punctumAffectiveIntuitionScore <= 100);
  assert(rep.mythologicalDemythologizationIndex >= 0 && rep.mythologicalDemythologizationIndex <= 100);
  assert(rep.deathOfAuthorScriptibleReaderScore >= 0 && rep.deathOfAuthorScriptibleReaderScore <= 100);
  assert(rep.plaisirDuTexteSensualDelightIndex >= 0 && rep.plaisirDuTexteSensualDelightIndex <= 100);
  assert(rep.polyphonicSignifierFluidityScore >= 0 && rep.polyphonicSignifierFluidityScore <= 100);
  assert(rep.activeBarthesTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.barthesSynthesisMatrix?.integratedAction));
  const prompt = formatFrenchRolandBarthesSemioticsPunctumPrompt(rep);
  assert(prompt.includes('롤랑 바르트 《신화론》·《밝은 방》 푼크툼(Punctum)·기호학 지표'));
  assert(prompt.includes(rep.activeBarthesTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
});

test('John Dewey Pragmatic Inquiry and Growth Engine: calculates qualitative Reflective Inquiry and Growth guidance', () => {
  const rep = calculateAmericanJohnDeweyPragmaticInquiryGrowth(profile, '동료와 대화가 어긋날 때 어떻게 풀어가야 할까요?', new Date('2026-11-14T18:45:00+09:00'));
  assert.equal(rep.engineVersion, AMERICAN_JOHN_DEWEY_PRAGMATIC_INQUIRY_GROWTH_VERSION);
  assert.equal(rep.questionTopic, 'relationship');
  assert(rep.inquiryPosture.length > 0);
  assert(rep.practiceGuidance.length > 0);
  assert(rep.ritualAction.length > 0);
  assert(rep.reflectionFocus.length > 0);
  assert(rep.counselNote.length > 0);
  assert(rep.boundaryNotice.length > 0);
  assert(rep.calculatedAtKst.includes('KST'));
  assert(rep.deweySynthesisMatrix.coreInsight.length > 0);
  assert(rep.activeDeweyTheme.themeTitleKo.length > 0);
  const prompt = formatAmericanJohnDeweyPragmaticInquiryGrowthPrompt(rep);
  assert(prompt.includes('존 듀이 《경험과 자연·민주주의와 교육》 반성적 사고(Reflective Inquiry)·성장 지표'));
  assert(prompt.includes(rep.activeDeweyTheme.themeTitleKo));
  assert(prompt.includes('KST'));
  assert(!prompt.includes('/100'));
});

test('Fyodor Dostoevsky Karamazov Soul Compassion Engine: calculates Soul Abyss Confrontation, Active Love, and Suffering Purification', () => {
  const rep = calculateRussianFyodorDostoevskyKaramazovSoulCompassion(profile);
  assert.equal(rep.engineVersion, RUSSIAN_FYODOR_DOSTOEVSKY_KARAMAZOV_SOUL_COMPASSION_VERSION);
  assert(rep.soulAbyssHonestConfrontationScore >= 0 && rep.soulAbyssHonestConfrontationScore <= 100);
  assert(rep.activeLoveCompassionIndex >= 0 && rep.activeLoveCompassionIndex <= 100);
  assert(rep.sufferingPurificationTranscendenceScore >= 0 && rep.sufferingPurificationTranscendenceScore <= 100);
  assert(rep.kissingTheEarthLivingVitalityIndex >= 0 && rep.kissingTheEarthLivingVitalityIndex <= 100);
  assert(rep.universalBrotherhoodSolidarityScore >= 0 && rep.universalBrotherhoodSolidarityScore <= 100);
  assert(rep.activeDostoevskyTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.dostoevskySynthesisMatrix?.integratedAction));
  const prompt = formatRussianFyodorDostoevskyKaramazovSoulCompassionPrompt(rep);
  assert(prompt.includes('도스토옙스키 《카라마조프 가의 형제들·죄와 벌》 심연 직시·대자비(Active Love) 지표'));
  assert(prompt.includes(rep.activeDostoevskyTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Baek Seok Deer and White Wall Poetic Purity Engine: calculates Noble Solitude, Folk Warmth, and Steadfast Resilience', () => {
  const rep = calculateKoreanBaekSeokDeerWhiteWallPoeticPurity(profile);
  assert.equal(rep.engineVersion, KOREAN_BAEK_SEOK_DEER_WHITE_WALL_POETIC_PURITY_VERSION);
  assert(rep.nobleSolitudePurityScore >= 0 && rep.nobleSolitudePurityScore <= 100);
  assert(rep.folkWarmthCommunityAffinityIndex >= 0 && rep.folkWarmthCommunityAffinityIndex <= 100);
  assert(rep.unyieldingPoeticIntegrityScore >= 0 && rep.unyieldingPoeticIntegrityScore <= 100);
  assert(rep.transcendentWhiteWallReflectionIndex >= 0 && rep.transcendentWhiteWallReflectionIndex <= 100);
  assert(rep.sereneSteadfastResilienceScore >= 0 && rep.sereneSteadfastResilienceScore <= 100);
  assert(rep.activeBaekSeokTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.baekSeokSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanBaekSeokDeerWhiteWallPoeticPurityPrompt(rep);
  assert(prompt.includes('백석 《사슴·흰 바람벽이 있어》 순수 고결성·맑은 존엄(Poetic Purity) 지표'));
  assert(prompt.includes(rep.activeBaekSeokTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Paul Ricoeur Narrative Identity and Healing Engine: calculates Emplotment, Ipso-Identity, and Forgiveness Resilience', () => {
  const rep = calculateFrenchPaulRicoeurNarrativeIdentityHealing(profile);
  assert.equal(rep.engineVersion, FRENCH_PAUL_RICOEUR_NARRATIVE_IDENTITY_HEALING_VERSION);
  assert(rep.narrativeIdentityEmplotmentScore >= 0 && rep.narrativeIdentityEmplotmentScore <= 100);
  assert(rep.ipsoIdentityEthicalAlterityIndex >= 0 && rep.ipsoIdentityEthicalAlterityIndex <= 100);
  assert(rep.hermeneuticHealingMemoryIndex >= 0 && rep.hermeneuticHealingMemoryIndex <= 100);
  assert(rep.metaphoricalInnovationHopeScore >= 0 && rep.metaphoricalInnovationHopeScore <= 100);
  assert(rep.reconciliationForgivenessResilience >= 0 && rep.reconciliationForgivenessResilience <= 100);
  assert(rep.activeRicoeurTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchPaulRicoeurNarrativeIdentityHealingPrompt(rep);
  assert(prompt.includes('폴 리쾨르 《시간과 이야기·자기 자신으로서의 타자》 서사적 정체성·치유 지표'));
  assert(prompt.includes(rep.activeRicoeurTheme.themeTitleKo));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Anton Chekhov Quiet Endurance and Compassion Engine: calculates Unpretentious Truthfulness, Diligence, and Fortitude', () => {
  const rep = calculateRussianAntonChekhovQuietEnduranceCompassion(profile);
  assert.equal(rep.engineVersion, RUSSIAN_ANTON_CHEKHOV_QUIET_ENDURANCE_COMPASSION_VERSION);
  assert(rep.unpretentiousTruthfulnessScore >= 0 && rep.unpretentiousTruthfulnessScore <= 100);
  assert(rep.quietEnduranceDiligenceIndex >= 0 && rep.quietEnduranceDiligenceIndex <= 100);
  assert(rep.subtleCompassionEmpathyIndex >= 0 && rep.subtleCompassionEmpathyIndex <= 100);
  assert(rep.innerDecencyIntegrityScore >= 0 && rep.innerDecencyIntegrityScore <= 100);
  assert(rep.gentleFortitudeHopeResilience >= 0 && rep.gentleFortitudeHopeResilience <= 100);
  assert(rep.activeChekhovTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.chekhovSynthesisMatrix?.integratedAction));
  const prompt = formatRussianAntonChekhovQuietEnduranceCompassionPrompt(rep);
  assert(prompt.includes('안톤 체호프 《바냐 아저씨·갈매기》 일상의 진실·묵묵한 인내 지표'));
  assert(prompt.includes(rep.activeChekhovTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Seopo Kim Man-jung Guunmong Illusory Awakening Engine: calculates Fame Penetration, Void True Self, and Equanimity', () => {
  const rep = calculateKoreanSeopoKimManJungGuunmongAwakening(profile);
  assert.equal(rep.engineVersion, KOREAN_SEOPO_KIM_MAN_JUNG_GUUNMONG_AWAKENING_VERSION);
  assert(rep.guunmongIllusoryFamePenetrationScore >= 0 && rep.guunmongIllusoryFamePenetrationScore <= 100);
  assert(rep.prajnaparamitaVoidTrueSelfIndex >= 0 && rep.prajnaparamitaVoidTrueSelfIndex <= 100);
  assert(rep.righteousIntegrityMoralFidelityIndex >= 0 && rep.righteousIntegrityMoralFidelityIndex <= 100);
  assert(rep.filialDevotionLiterarySublimationScore >= 0 && rep.filialDevotionLiterarySublimationScore <= 100);
  assert(rep.transcendentEquanimityResilience >= 0 && rep.transcendentEquanimityResilience <= 100);
  assert(rep.activeGuunmongTheme.themeTitleKo.length > 0);
  assert(rep.secondaryGuunmongTheme.themeKey !== rep.activeGuunmongTheme.themeKey);
  assert(rep.secondaryGuunmongAphorism.aphorismKey !== rep.focalGuunmongAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.guunmongSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanSeopoKimManJungGuunmongAwakening(profile, '덧없는 집착과 지켜야 할 본심');
  assert(repQ.reflectiveQuestion.includes('본심'));
  const prompt = formatKoreanSeopoKimManJungGuunmongAwakeningPrompt(repQ);
  assert(prompt.includes('서포 김만중 《구운몽·사씨남정기》 일장춘몽 각성·반야공관 지표'));
  assert(prompt.includes(repQ.activeGuunmongTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryGuunmongTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Virginia Woolf Room of One\'s Own Engine: calculates Autonomy, Moments of Being, and Androgynous Mind', () => {
  const rep = calculateBritishVirginiaWoolfRoomOfOnesOwn(profile);
  assert.equal(rep.engineVersion, BRITISH_VIRGINIA_WOOLF_ROOM_OF_ONES_OWN_VERSION);
  assert(rep.roomOfOnesOwnAutonomyScore >= 0 && rep.roomOfOnesOwnAutonomyScore <= 100);
  assert(rep.momentsOfBeingInsightIndex >= 0 && rep.momentsOfBeingInsightIndex <= 100);
  assert(rep.androgynousMindCreativityScore >= 0 && rep.androgynousMindCreativityScore <= 100);
  assert(rep.streamOfConsciousnessFlowIndex >= 0 && rep.streamOfConsciousnessFlowIndex <= 100);
  assert(rep.lighthouseResilienceScore >= 0 && rep.lighthouseResilienceScore <= 100);
  assert(rep.activeWoolfTheme.themeTitleKo.length > 0);
  const prompt = formatBritishVirginiaWoolfRoomOfOnesOwnPrompt(rep);
  assert(prompt.includes('버지니아 울프 《자기만의 방·등대로》 사유의 독립·존재의 순간들 지표'));
  assert(prompt.includes(rep.activeWoolfTheme.themeTitleKo));
});

test('Victor Hugo Les Miserables Engine: calculates Mercy, Conscience, and Humanitarian Solidarity', () => {
  const rep = calculateFrenchVictorHugoLesMiserables(profile);
  assert.equal(rep.engineVersion, FRENCH_VICTOR_HUGO_LES_MISERABLES_VERSION);
  assert(rep.mercyAndRedemptionScore >= 0 && rep.mercyAndRedemptionScore <= 100);
  assert(rep.moralConscienceDignityIndex >= 0 && rep.moralConscienceDignityIndex <= 100);
  assert(rep.humanitarianSolidarityScore >= 0 && rep.humanitarianSolidarityScore <= 100);
  assert(rep.cosmicJusticeIdealIndex >= 0 && rep.cosmicJusticeIdealIndex <= 100);
  assert(rep.indomitableHeroicResilience >= 0 && rep.indomitableHeroicResilience <= 100);
  assert(rep.activeHugoTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.hugoSynthesisMatrix?.integratedAction));
  const prompt = formatFrenchVictorHugoLesMiserablesPrompt(rep);
  assert(prompt.includes('빅토르 위고 《레 미제라블》 자비와 도덕적 양심·인도주의 지표'));
  assert(prompt.includes(rep.activeHugoTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Heo Gyun Hong Gildong & Yuldoguk Engine: calculates Talent Liberation, Homin Spirit, and Pioneer Agency', () => {
  const rep = calculateKoreanHeoGyunHongGildongYuldoguk(profile);
  assert.equal(rep.engineVersion, KOREAN_HEO_GYUN_HONG_GILDONG_YULDOGUK_VERSION);
  assert(rep.talentLiberationOvercomingPrejudiceScore >= 0 && rep.talentLiberationOvercomingPrejudiceScore <= 100);
  assert(rep.righteousCivicCourageHominIndex >= 0 && rep.righteousCivicCourageHominIndex <= 100);
  assert(rep.greatHarmonyJusticeHwalbindangScore >= 0 && rep.greatHarmonyJusticeHwalbindangScore <= 100);
  assert(rep.visionaryPioneerYuldogukIndex >= 0 && rep.visionaryPioneerYuldogukIndex <= 100);
  assert(rep.progressiveReformResilience >= 0 && rep.progressiveReformResilience <= 100);
  assert(rep.activeHeoGyunTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.heoGyunSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanHeoGyunHongGildongYuldogukPrompt(rep);
  assert(prompt.includes('교산 허균 《홍길동전·유재론·호민론》 인재 등용·호민 기개·율도국 지표'));
  assert(prompt.includes(rep.activeHeoGyunTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Rainer Maria Rilke Letters to a Young Poet Engine: calculates Loving Solitude, Living Questions, and Elegiac Sublimation', () => {
  const rep = calculateAustrianRainerMariaRilkeLetters(profile);
  assert.equal(rep.engineVersion, AUSTRIAN_RAINER_MARIA_RILKE_LETTERS_VERSION);
  assert(rep.lovingSolitudeInwardScore >= 0 && rep.lovingSolitudeInwardScore <= 100);
  assert(rep.livingTheQuestionsIndex >= 0 && rep.livingTheQuestionsIndex <= 100);
  assert(rep.contemplativeGazingIndex >= 0 && rep.contemplativeGazingIndex <= 100);
  assert(rep.elegiacSublimationScore >= 0 && rep.elegiacSublimationScore <= 100);
  assert(rep.openHorizonResilienceScore >= 0 && rep.openHorizonResilienceScore <= 100);
  assert(rep.activeRilkeTheme.themeTitleKo.length > 0);
  const prompt = formatAustrianRainerMariaRilkeLettersPrompt(rep);
  assert(prompt.includes('라이너 마리아 릴케 《젊은 시인에게 주는 편지·두이노의 비가》 고독 사랑·질문 품기 지표'));
  assert(prompt.includes(rep.activeRilkeTheme.themeTitleKo));
});

test('Miguel de Cervantes Don Quixote Engine: calculates Noble Idealism, Courage Against Windmills, and Humor Resilience', () => {
  const rep = calculateSpanishMiguelDeCervantesDonQuixote(profile);
  assert.equal(rep.engineVersion, SPANISH_MIGUEL_DE_CERVANTES_DON_QUIXOTE_VERSION);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.cervantesSynthesisMatrix?.integratedAction));
  assert(rep.nobleIdealismScore >= 0 && rep.nobleIdealismScore <= 100);
  assert(rep.courageAgainstWindmillsIndex >= 0 && rep.courageAgainstWindmillsIndex <= 100);
  assert(rep.quixoteSanchoBalanceScore >= 0 && rep.quixoteSanchoBalanceScore <= 100);
  assert(rep.compassionateHumorResilienceIndex >= 0 && rep.compassionateHumorResilienceIndex <= 100);
  assert(rep.autonomousSelfCreationScore >= 0 && rep.autonomousSelfCreationScore <= 100);
  assert(rep.activeCervantesTheme.themeTitleKo.length > 0);
  const prompt = formatSpanishMiguelDeCervantesDonQuixotePrompt(rep);
  assert(prompt.includes('미겔 데 세르반테스 《돈키호테》 고결한 이상주의·풍차 앞 불굴의 용기 지표'));
  assert(prompt.includes(rep.activeCervantesTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Ilyeon Samguk Yusa Engine: calculates Hongik Ingan Pride, Hyangga Healing, and Cheoyong Tolerance', () => {
  const rep = calculateKoreanIlyeonSamgukYusa(profile);
  assert.equal(rep.engineVersion, KOREAN_ILYEON_SAMGUK_YUSA_VERSION);
  assert(rep.hongikInganPrideScore >= 0 && rep.hongikInganPrideScore <= 100);
  assert(rep.hyanggaHealingIndex >= 0 && rep.hyanggaHealingIndex <= 100);
  assert(rep.cheoyongToleranceScore >= 0 && rep.cheoyongToleranceScore <= 100);
  assert(rep.grassrootsCompassionIndex >= 0 && rep.grassrootsCompassionIndex <= 100);
  assert(rep.culturalPreservationResilience >= 0 && rep.culturalPreservationResilience <= 100);
  assert(rep.activeIlyeonTheme.themeTitleKo.length > 0);
  assert(rep.calculatedAtKst.endsWith('KST'));
  assert(Boolean(rep.ilyeonSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanIlyeonSamgukYusaPrompt(rep);
  assert(prompt.includes('보각국사 일연 《삼국유사》 홍익인간 자주 자긍심·향가 치유·처용 관용 지표'));
  assert(prompt.includes(rep.activeIlyeonTheme.themeTitleKo));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('William Shakespeare Tragic Wisdom Engine: calculates Tragic Depth, Existential Action, and Readiness', () => {
  const rep = calculateBritishWilliamShakespeareTragicWisdom(profile);
  assert.equal(rep.engineVersion, BRITISH_WILLIAM_SHAKESPEARE_TRAGIC_WISDOM_VERSION);
  assert(rep.tragicDepthConfrontationScore >= 0 && rep.tragicDepthConfrontationScore <= 100);
  assert(rep.existentialActionResolveIndex >= 0 && rep.existentialActionResolveIndex <= 100);
  assert(rep.tempestForgivenessGraceScore >= 0 && rep.tempestForgivenessGraceScore <= 100);
  assert(rep.poeticImmortalityAestheticsIndex >= 0 && rep.poeticImmortalityAestheticsIndex <= 100);
  assert(rep.sereneFortitudeResilienceScore >= 0 && rep.sereneFortitudeResilienceScore <= 100);
  assert(rep.activeShakespeareTheme.themeTitleKo.length > 0);
  const prompt = formatBritishWilliamShakespeareTragicWisdomPrompt(rep);
  assert(prompt.includes('윌리엄 셰익스피어 《햄릿·템페스트》 비극적 통찰·실존적 결단 지표'));
  assert(prompt.includes(rep.activeShakespeareTheme.themeTitleKo));
});

test('Marcel Proust Lost Time Regained Engine: calculates Involuntary Memory, Time Regained, and Aesthetic Insight', () => {
  const rep = calculateFrenchMarcelProustLostTimeRegained(profile);
  assert.equal(rep.engineVersion, FRENCH_MARCEL_PROUST_LOST_TIME_VERSION);
  assert(rep.involuntaryMemoryDepthScore >= 0 && rep.involuntaryMemoryDepthScore <= 100);
  assert(rep.lostTimeRegainedWisdomIndex >= 0 && rep.lostTimeRegainedWisdomIndex <= 100);
  assert(rep.subtleSensoryAestheticsScore >= 0 && rep.subtleSensoryAestheticsScore <= 100);
  assert(rep.authenticSelfDiscoveryIndex >= 0 && rep.authenticSelfDiscoveryIndex <= 100);
  assert(rep.timeTranscendenceResilienceScore >= 0 && rep.timeTranscendenceResilienceScore <= 100);
  assert(rep.activeProustTheme.themeTitleKo.length > 0);
  const prompt = formatFrenchMarcelProustLostTimeRegainedPrompt(rep);
  assert(prompt.includes('마르셀 프루스트 《잃어버린 시간을 찾아서》 비자발적 기억·되찾은 시간 지표'));
  assert(prompt.includes(rep.activeProustTheme.themeTitleKo));
  assert.ok(rep.calculatedAtKst.includes('KST'));
  assert.ok(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
});

test('Kim So-wol Azalea Flower Poetic Grace Engine: calculates Devoted Love, Grief Sublimation, and Grassroots Resilience', () => {
  const rep = calculateKoreanKimSoWolAzaleaFlowerPoeticGrace(profile);
  assert.equal(rep.engineVersion, KOREAN_KIM_SO_WOL_AZALEA_VERSION);
  assert(rep.devotedLoveBlessingScore >= 0 && rep.devotedLoveBlessingScore <= 100);
  assert(rep.griefPoeticSublimationIndex >= 0 && rep.griefPoeticSublimationIndex <= 100);
  assert(rep.sanYuHwaNatureAttunementScore >= 0 && rep.sanYuHwaNatureAttunementScore <= 100);
  assert(rep.soulInvocationLongingIndex >= 0 && rep.soulInvocationLongingIndex <= 100);
  assert(rep.dauntlessGrassrootsResilienceScore >= 0 && rep.dauntlessGrassrootsResilienceScore <= 100);
  assert(rep.activeKimSoWolTheme.themeTitleKo.length > 0);
  assert(rep.secondaryKimSoWolTheme.themeKey !== rep.activeKimSoWolTheme.themeKey);
  assert(rep.secondaryKimSoWolAphorism.aphorismKey !== rep.focalKimSoWolAphorism.aphorismKey);
  assert(rep.reflectiveQuestion.length > 0);
  assert(rep.interpretiveBoundary.length > 0);
  assert(rep.calculatedAtKst.endsWith('+09:00 KST'));
  assert(Boolean(rep.kimSoWolSynthesisMatrix?.integratedAction));
  const repQ = calculateKoreanKimSoWolAzaleaFlowerPoeticGrace(profile, '이별의 마음을 차분히 정리하는 길');
  assert(repQ.reflectiveQuestion.includes('이별의 마음'));
  const prompt = formatKoreanKimSoWolAzaleaFlowerPoeticGracePrompt(repQ);
  assert(prompt.includes('소월 김소월 《진달래꽃·산유화·초혼》 지순한 헌신·슬픔의 승화 지표'));
  assert(prompt.includes(repQ.activeKimSoWolTheme.themeTitleKo));
  assert(prompt.includes(repQ.secondaryKimSoWolTheme.themeTitleKo));
  assert(prompt.includes('해석 경계'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('James Joyce engine selects a qualitative literary perspective from the question without fake scores or quotations', () => {
  const rep = calculateIrishJamesJoyceUlyssesEpiphany('창작과 독립적인 예술');
  assert.equal(rep.engineVersion, IRISH_JAMES_JOYCE_ULYSSES_EPIPHANY_VERSION);
  assert.equal(rep.activeJoyceTheme.themeKey, 'forgeInSoulSmithy');
  assert.equal(Object.hasOwn(rep, 'epiphanyEverydayRevelationScore'), false);
  assert.equal(Object.hasOwn(rep, 'calculatedAtKst'), false);
  assert(Boolean(rep.joyceSynthesisMatrix?.integratedAction));
  const prompt = formatIrishJamesJoyceUlyssesEpiphanyPrompt(rep);
  assert.match(prompt, /문학적 참고/);
  assert(prompt.includes('교차 매트릭스'));
  assert.doesNotMatch(prompt, /\/100|원전 명대사|길 잃은 고양이|A man of genius/);

  const epiphany = calculateIrishJamesJoyceUlyssesEpiphany('일상의 에피파니와 관찰');
  assert.match(epiphany.activeJoyceTheme.literaryInsight, /Stephen Hero/);

  const bloom = calculateIrishJamesJoyceUlyssesEpiphany('타인을 돕는 친절과 돌봄');
  assert.equal(bloom.activeJoyceTheme.themeKey, 'bloomCompassion');
  assert.match(bloom.activeJoyceTheme.literaryInsight, /집 안의 고양이/);
  assert.doesNotMatch(bloom.activeJoyceTheme.literaryInsight, /길 잃은/);
});

test('Hermann Hesse engine matches the question to a literary theme and omits mismatched quotations and fake metrics', () => {
  const rep = calculateGermanHermannHesseDemianSteppenwolf('강물의 흐름과 현재를 살피기');
  assert.equal(rep.engineVersion, GERMAN_HERMANN_HESSE_DEMIAN_STEPPENWOLF_VERSION);
  assert.equal(rep.activeHesseTheme.themeKey, 'siddharthaRiverOneness');
  assert.equal(Object.hasOwn(rep, 'siddharthaRiverEquanimityScore'), false);
  assert.equal(Object.hasOwn(rep, 'calculatedAtKst'), false);
  assert(Boolean(rep.hesseSteppenwolfSynthesisMatrix?.integratedAction));
  const prompt = formatGermanHermannHesseDemianSteppenwolfPrompt(rep);
  assert.match(prompt, /문학적 참고/);
  assert(prompt.includes('교차 매트릭스'));
  assert.doesNotMatch(prompt, /\/100|원문|원전|Das Wasser lief|Die Welt zu lieben|양극성 치유/);
});

test('Han Yong-un engine uses a verified literary theme, query matching, and no fabricated aphorisms or measures', () => {
  const rep = calculateKoreanHanYongUnSilenceOfNim('이별과 상실에서 희망을 찾기');
  assert.equal(rep.engineVersion, KOREAN_HAN_YONG_UN_SILENCE_OF_NIM_VERSION);
  assert.equal(rep.activeHanYongUnTheme.themeKey, 'silenceOfNimSublimation');
  assert.equal(Object.hasOwn(rep, 'paradoxicalLoveTranscendenceScore'), false);
  assert.equal(Object.hasOwn(rep, 'calculatedAtKst'), false);
  assert(Boolean(rep.hanYongUnSynthesisMatrix?.integratedAction));
  const prompt = formatKoreanHanYongUnSilenceOfNimPrompt(rep);
  assert.match(prompt, /문학적 참고/);
  assert(prompt.includes('교차 매트릭스'));
  assert.doesNotMatch(prompt, /\/100|마음은 본래 자유로운|님은 갔으나 반드시 다시 온다|원전 명구/);

  const integrity = calculateKoreanHanYongUnSilenceOfNim('자유와 양심, 자주와 존엄');
  assert.equal(integrity.activeHanYongUnTheme.themeKey, 'simWooJangUnbendingIntegrity');
});

test('Tojeong engine: enhanced trigram analysis, five-element relation, and seasonal flow weighting', () => {
  const r = calculateTojeong({ profile: { basic: { birthdate: '1990-05-20', lunarSolar: 'lunar' as const } }, targetYear: 2026, question: '올해의 신수' });
  assert.equal(r.status, 'calculated');
  assert(r.calculatedAtKst.endsWith('KST'));
  assert(Boolean(r.tojeongSynthesisMatrix?.integratedAction));
  assert.ok(r.trigramAnalysis);
  assert.equal(r.trigramAnalysis.upperElement, '목(木)');
  assert.equal(r.trigramAnalysis.lowerElement, '목(木)');
  assert.equal(r.trigramAnalysis.elementRelation, '비화(比和)');
  assert(r.trigramAnalysis.harmonyScore >= 40 && r.trigramAnalysis.harmonyScore <= 98);
  assert(r.trigramAnalysis.seasonalFlow.springScore >= 30 && r.trigramAnalysis.seasonalFlow.springScore <= 95);
  assert(r.trigramAnalysis.seasonalFlow.summerScore >= 30 && r.trigramAnalysis.seasonalFlow.summerScore <= 95);
  assert(r.trigramAnalysis.seasonalFlow.autumnScore >= 30 && r.trigramAnalysis.seasonalFlow.autumnScore <= 95);
  assert(r.trigramAnalysis.seasonalFlow.winterScore >= 30 && r.trigramAnalysis.seasonalFlow.winterScore <= 95);
  assert.ok(r.trigramAnalysis.seasonalFlow.peakSeason.length > 0);
  assert.ok(r.trigramAnalysis.hexagramEssenceAdvice.includes('손위풍'));
  const prompt = formatTojeongPrompt(r);
  assert(prompt.includes('오행 생극제화 및 사계절 순환 심층 분석'));
  assert(prompt.includes('비화(比和)'));
  assert(prompt.includes('교차 매트릭스'));
  assert(!prompt.includes('/100'));
  assert(!prompt.includes('%'));
});

test('Kyusei engine: enhanced 8-directional scores matrix and honmyosei annual star synergy', () => {
  const r = calculateKyusei({ profile: { basic: { birthdate: '1990-05-17', gender: 'female' as const, birthCity: '서울' } }, targetDate: new Date('2026-11-02T00:00:00Z') });
  assert.equal(r.status, 'calculated');
  assert.ok(r.directionalScores);
  assert.equal(r.directionalScores.length, 8);
  for (const dir of r.directionalScores) {
    assert(dir.score >= 0 && dir.score <= 100);
    assert(['최길', '길', '평', '주의', '대흉'].includes(dir.level));
    assert(dir.recommendedActivities.length > 0);
  }
  assert.ok(r.honmyoseiSynergy);
  assert.equal(r.honmyoseiSynergy.annualStarRelation, '비화(比和)');
  assert(r.honmyoseiSynergy.synergyScore >= 0 && r.honmyoseiSynergy.synergyScore <= 100);
  assert.ok(r.honmyoseiSynergy.annualThemeGuidance.length > 0);
  const prompt = formatKyuseiPrompt(r);
  assert(prompt.includes('8대 방위별 목적 적합도 매트릭스'));
  assert(prompt.includes('본명성-연성 조화도'));
});

test('Taiyi engine: enhanced macro strategic matrix, balance score, and decision window timing', () => {
  const profile = { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } };
  const r = calculateTaiyi({ profile, targetYear: 2026 });
  assert.equal(r.status, 'calculated');
  assert.ok(r.macroStrategicMatrix);
  assert(r.macroStrategicMatrix.juBalanceScore >= 0 && r.macroStrategicMatrix.juBalanceScore <= 100);
  assert(r.macroStrategicMatrix.initiativeIndex >= 0 && r.macroStrategicMatrix.initiativeIndex <= 100);
  assert(r.macroStrategicMatrix.defensiveIndex >= 0 && r.macroStrategicMatrix.defensiveIndex <= 100);
  assert.ok(r.macroStrategicMatrix.macroPhase.length > 0);
  assert.ok(r.macroStrategicMatrix.tacticalWindowAdvice.length > 0);
  const prompt = formatTaiyiPrompt(r);
  assert(prompt.includes('거시 전략 매트릭스'));
  assert(prompt.includes('공수 역학 밸런스 지수'));
  assert(prompt.includes('결단 실행 윈도우'));
});

test('Sukuyo, Kabbalah, and Hongguk Qimen engines: enhanced multi-dimensional numerical matrices and cross-verifications', () => {
  // 1. Sukuyo Enhanced
  const sy = calculateSukuyoAdvanced({ profile: { basic: { birthdate: '2000-08-16', gender: 'female' as const } } });
  assert.equal(sy.status, 'calculated');
  assert.ok(sy.planetaryGuard);
  assert(sy.planetaryGuard.guardScore >= 40 && sy.planetaryGuard.guardScore <= 98);
  assert.ok(sy.planetaryGuard.favorableWeekday.length > 0);
  assert.ok(sy.planetaryGuard.yearlyAdvice.length > 0);
  assert.ok(sy.celestialQuadrant);
  assert.ok(sy.celestialQuadrant.degreesSpan.length > 0);
  assert.ok(sy.celestialQuadrant.guardianSpirit.length > 0);
  assert.ok(sy.sanKyuCycle);
  assert([1, 2, 3].includes(sy.sanKyuCycle.cycleOrder));
  assert.ok(sy.sanKyuCycle.nineMansionPhase.length > 0);
  assert.ok(sy.sanKyuCycle.actionCompass.length > 0);
  const syPrompt = formatSukuyoPrompt(sy);
  assert(syPrompt.includes('칠요 행성 수호'));
  assert(syPrompt.includes('천구 사분면'));
  assert(syPrompt.includes('3구 비법(三九秘法)'));

  // 2. Kabbalah Enhanced
  const kb = calculateKabbalah({ profile: { basic: { birthdate: '1995-03-25', gender: 'male' as const } } });
  assert.equal(kb.status, 'calculated');
  assert.ok(kb.numerology?.lightningFlash);
  assert(kb.numerology!.lightningFlash.ascensionPotentialIndex >= 50 && kb.numerology!.lightningFlash.ascensionPotentialIndex <= 98);
  assert.ok(kb.numerology!.lightningFlash.stageTitle.length > 0);
  assert.ok(kb.numerology!.lightningFlash.spiritualLesson.length > 0);
  assert.ok(kb.numerology?.tipherethAlignment);
  assert(kb.numerology!.tipherethAlignment.harmonyScore >= 40 && kb.numerology!.tipherethAlignment.harmonyScore <= 98);
  assert.ok(kb.numerology!.tipherethAlignment.solarHeartGuidance.length > 0);
  assert.ok(kb.numerology?.fourWorldsSpectrum);
  assert.equal(
    kb.numerology!.fourWorldsSpectrum.atziluth +
    kb.numerology!.fourWorldsSpectrum.beriah +
    kb.numerology!.fourWorldsSpectrum.yetzirah +
    kb.numerology!.fourWorldsSpectrum.assiah,
    100
  );
  assert.ok(kb.numerology!.fourWorldsSpectrum.manifestationAdvice.length > 0);
  const kbPrompt = formatKabbalahPrompt(kb);
  assert(kbPrompt.includes('창조의 번개(Lightning Flash)'));
  assert(kbPrompt.includes('티페레트(태양·심장) 조화도'));
  assert(kbPrompt.includes('4대 세계 친화도'));

  // 3. Hongguk Qimen Enhanced
  const hq = calculateHonggukQimen({ profile: { basic: { birthdate: '1995-03-25', birthtime: '14:30', gender: 'male' as const, birthCity: '서울' } } });
  assert.equal(hq.status, 'calculated');
  assert.ok(hq.heavenEarthResonance);
  assert(hq.heavenEarthResonance.seYaoResonance.resonanceScore >= 40 && hq.heavenEarthResonance.seYaoResonance.resonanceScore <= 98);
  assert.ok(hq.heavenEarthResonance.seYaoResonance.interpretation.length > 0);
  assert.ok(hq.threeWondersAlliance);
  assert(hq.threeWondersAlliance.wondersEmpowermentIndex >= 45 && hq.threeWondersAlliance.wondersEmpowermentIndex <= 98);
  assert.ok(hq.threeWondersAlliance.nobleSponsorship.length > 0);
  assert.ok(hq.tacticalSeasonWindows);
  assert.ok(hq.tacticalSeasonWindows.peakActionSeason.length > 0);
  assert.ok(hq.tacticalSeasonWindows.strategicPacingAdvice.length > 0);
  const hqPrompt = formatHonggukQimenPrompt(hq);
  assert(hqPrompt.includes('천지반 홍국수 생극 공명'));
  assert(hqPrompt.includes('삼기(三奇) 득기 회합'));
  assert(hqPrompt.includes('4계절 거시 결단 윈도우'));
});

test('Inanna Underworld, Spinoza Ethica, and Plotinus Enneads v1.1.0 engines provide question-responsive qualitative synthesis without score exposure', () => {
  const testDate = new Date('2026-11-14T03:00:00Z');
  const testProfile = { basic: { birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' as const, name: '제제' } };

  const inanna = calculateSumerianInannaUnderworldDescent({
    profile: testProfile,
    question: '이직 결정을 앞두고 두려움이 커요',
    now: testDate,
  });
  assert.equal(inanna.questionTopic, 'decision');
  assert.ok(inanna.practiceGuidance.length > 10);
  assert.ok(inanna.ritualAction.length > 10);
  assert.ok(inanna.reflectionFocus.length > 10);
  assert.ok(inanna.boundaryNotice.length > 10);
  const inannaPrompt = formatSumerianInannaUnderworldDescentPrompt(inanna);
  assert(!inannaPrompt.includes('/100'));
  assert(!inannaPrompt.includes('%'));

  const spinoza = calculateBaruchSpinozaEthicaConatus(testProfile, testDate, '상대방과의 갈등으로 마음이 무거워요');
  assert.equal(spinoza.questionTopic, 'relationship');
  assert.ok(spinoza.practiceGuidance.length > 10);
  assert.ok(spinoza.ritualAction.length > 10);
  assert.ok(spinoza.reflectionFocus.length > 10);
  assert.ok(spinoza.boundaryNotice.length > 10);
  const spinozaPrompt = formatBaruchSpinozaEthicaConatusPrompt(spinoza);
  assert(!spinozaPrompt.includes('/100'));

  const plotinus = calculateAncientGreekPlotinusEnneadsHenosis(testProfile, testDate, '번아웃에서 벗어나 마음을 회복하고 싶어요');
  assert.equal(plotinus.questionTopic, 'healing');
  assert.ok(plotinus.practiceGuidance.length > 10);
  assert.ok(plotinus.ritualAction.length > 10);
  assert.ok(plotinus.reflectionFocus.length > 10);
  assert.ok(plotinus.boundaryNotice.length > 10);
  const plotinusPrompt = formatAncientGreekPlotinusEnneadsHenosisPrompt(plotinus);
  assert(!plotinusPrompt.includes('/100'));
  assert(!plotinusPrompt.includes('원전 출처'));
});

test('Dreamtime Songlines, Eleusinian Mysteries, and Babylonian Enuma Elish provide qualitative question-reactive guidance without score exposure', async () => {
  const { calculateAboriginalDreamtimeSonglines, formatAboriginalDreamtimeSonglinesPrompt } = await import('../src/lib/divination/aboriginalDreamtimeSonglinesEngine');
  const { calculateEleusinianMysteries, formatEleusinianMysteriesPrompt } = await import('../src/lib/divination/eleusinianMysteriesEngine');
  const { calculateBabylonianEnumaElish, formatBabylonianEnumaElishPrompt } = await import('../src/lib/divination/babylonianEnumaElishEngine');

  const testProfile = {
    id: 'test-user',
    name: '제제',
    basic: { birthdate: '1994-01-24', birthtime: '09:30', gender: 'male' as const, calendarType: 'solar' as const },
  };
  const testDate = new Date('2026-11-14T04:45:00Z');

  const dreamtime = calculateAboriginalDreamtimeSonglines({ profile: testProfile, targetInstantTime: testDate.toISOString(), question: '이직 결정을 앞두고 방향이 고민돼요' });
  assert.equal(dreamtime.questionTheme, 'decision');
  assert.ok(dreamtime.calculatedAtKst.endsWith('+09:00'));
  assert.ok(dreamtime.practiceGuidance.length > 10);
  assert.ok(dreamtime.ritualAction.length > 10);
  assert.ok(dreamtime.reflectionFocus.length > 10);
  assert.ok(dreamtime.boundaryNotice.length > 10);
  const dreamtimePrompt = formatAboriginalDreamtimeSonglinesPrompt(dreamtime);
  assert(!dreamtimePrompt.includes('/100'));
  assert(!dreamtimePrompt.includes('점)'));
  assert(dreamtimePrompt.includes('+09:00'));

  const eleusis = calculateEleusinianMysteries(testProfile, { now: testDate, question: '최근 관계 갈등 때문에 마음이 지쳤어요' });
  assert.equal(eleusis.questionTheme, 'relationship');
  assert.ok(eleusis.practiceGuidance.length > 10);
  assert.ok(eleusis.ritualAction.length > 10);
  assert.ok(eleusis.reflectionFocus.length > 10);
  assert.ok(eleusis.boundaryNotice.length > 10);
  const eleusisPrompt = formatEleusinianMysteriesPrompt(eleusis);
  assert(!eleusisPrompt.includes('100점'));
  assert(!eleusisPrompt.includes('/100'));

  const babylon = calculateBabylonianEnumaElish(testProfile, testDate, '요즘 번아웃이 와서 회복하고 싶어요');
  assert.equal(babylon.questionTheme, 'healing');
  assert.ok(babylon.practiceGuidance.length > 10);
  assert.ok(babylon.ritualAction.length > 10);
  assert.ok(babylon.reflectionFocus.length > 10);
  assert.ok(babylon.boundaryNotice.length > 10);
  const babylonPrompt = formatBabylonianEnumaElishPrompt(babylon);
  assert(!babylonPrompt.includes('점)'));
  assert(!babylonPrompt.includes('/100'));
});

test('Wonhyo Hwajaeng, Vedic Pancha Kosha, and Epicurean Tetrapharmakos v2.0.0 qualitative synthesis', () => {
  const testProfile = {
    basic: {
      name: '김유신',
      birthdate: '1988-05-15',
      birthtime: '09:30',
      gender: 'male' as const,
      birthCity: '서울',
    },
  };
  const now = new Date('2026-11-14T09:15:00Z');

  // 1. 원효대사 화쟁 엔진 v2.0.0
  const wonhyo = calculateWonhyoHwajaeng(testProfile, '직장 동료와의 갈등과 협상 문제로 고민이에요', now);
  assert.equal(wonhyo.engineVersion, WONHYO_HWAJAENG_VERSION);
  assert.equal(wonhyo.situationalHwajaeng.themeKey, 'assertion_refutation');
  assert.equal(wonhyo.temporalOneMindRhythm.jinYeoWeight + wonhyo.temporalOneMindRhythm.saengMyeolWeight, 100);
  assert.ok(wonhyo.dialecticHarmonizationMatrix.muAePracticeDirective.length > 10);
  const wonhyoPrompt = formatWonhyoHwajaengPrompt(wonhyo);
  assert.ok(wonhyoPrompt.includes('질문 맥락 화쟁 성찰'));
  assert.ok(wonhyoPrompt.includes('KST 일심이문 시공간 리듬'));

  // 2. 베단타 5대 코샤 엔진 v2.0.0
  const kosha = calculateVedicPanchaKosha({ profile: testProfile, question: '요즘 호흡이 얕고 무기력해서 지쳐요', now });
  assert.equal(kosha.engineVersion, VEDIC_PANCHA_KOSHA_ENGINE_VERSION);
  assert.equal(kosha.questionKoshaResonance.focusLayerIndex, 2);
  assert.ok(kosha.temporalPranaRhythm.recommendedPranayama.length > 5);
  assert.ok(kosha.koshaBridgeMatrix.integrationPrescription.length > 10);
  const koshaPrompt = formatVedicPanchaKoshaPrompt(kosha);
  assert.ok(koshaPrompt.includes('질문 맥락 코샤 공명'));
  assert.ok(koshaPrompt.includes('상하층 코샤 브리지 통합'));

  // 3. 에피쿠로스 테트라파르마코스 엔진 v2.0.0
  const epicurean = calculateEpicureanTetrapharmakos(testProfile, '돈과 성공에 대한 비교 때문에 마음이 초조해요', now);
  assert.equal(epicurean.engineVersion, EPICUREAN_TETRAPHARMAKOS_VERSION);
  assert.equal(epicurean.situationalRemedy.remedyIndex, 3);
  assert.equal(
    epicurean.desireTaxonomyMatrix.naturalNecessaryRatio +
      epicurean.desireTaxonomyMatrix.naturalUnnecessaryRatio +
      epicurean.desireTaxonomyMatrix.vainEmptyRatio,
    100,
  );
  assert.ok(epicurean.temporalGardenRhythm.practiceFocus.length > 10);
  const epicureanPrompt = formatEpicureanTetrapharmakosPrompt(epicurean);
  assert.ok(epicureanPrompt.includes('질문 맥락 처방'));
  assert.ok(epicureanPrompt.includes('에피쿠로스 욕망 3분류'));
});

test('Socratic Maieutic, Aristotle Mesotes, and Confucius Analects engines v2.0.0 qualitative synthesis and temporal cross-validation', () => {
  const testProfile = {
    basic: {
      name: '배남희',
      birthdate: '1967-08-25',
      birthtime: '08:30',
      gender: 'female' as const,
      birthCity: '서울',
    },
  };
  const now = new Date('2026-11-14T09:35:00.000Z'); // KST 18:35

  const socrates = calculateSocraticMaieuticDaimon(testProfile, '이직을 해야 할지 계속 남아야 할지 선택이 고민돼요', now);
  assert.equal(socrates.engineVersion, SOCRATIC_MAIEUTIC_DAIMON_VERSION);
  assert.ok(socrates.situationalElenchus.dialogueSource.includes('변론'));
  assert.ok(socrates.temporalDaimonionRhythm.daimonClarityIndex >= 45 && socrates.temporalDaimonionRhythm.daimonClarityIndex <= 99);
  assert.ok(socrates.dialecticSynthesisMatrix.aporiaCourage >= 50);
  const socratesPrompt = formatSocraticMaieuticDaimonPrompt(socrates);
  assert.ok(socratesPrompt.includes('핵심 엘렌코스 질문'));
  assert.ok(socratesPrompt.includes('변증 통합 매트릭스'));

  const aristotle = calculateAristotleMesotes(testProfile, '조급하고 불안해서 자꾸 일을 미루게 돼요', now);
  assert.equal(aristotle.engineVersion, ARISTOTLE_MESOTES_VERSION);
  assert(aristotle.calculatedAtKst.endsWith('KST'));
  assert(Boolean(aristotle.aristotleSynthesisMatrix?.integratedAction));
  assert.ok(aristotle.situationalMesotes.ethicsCitation.includes('니코마코스 윤리학'));
  assert.ok(aristotle.temporalPhronesisRhythm.phronesisReadiness >= 45 && aristotle.temporalPhronesisRhythm.phronesisReadiness <= 99);
  assert.ok(aristotle.eudaimoniaBalanceMatrix.goldenMeanStability >= 50);
  const aristotlePrompt = formatAristotleMesotesPrompt(aristotle);
  assert.ok(aristotlePrompt.includes('질문 맥락 불균형 축'));
  assert.ok(aristotlePrompt.includes('에우다이모니아 밸런스 매트릭스'));
  assert.ok(aristotlePrompt.includes('교차 매트릭스'));

  const confucius = calculateConfuciusAnalectsZhitianming(testProfile, '동료와의 관계와 믿음에 갈등이 생겼어요', now);
  assert.equal(confucius.engineVersion, CONFUCIUS_ZHITIANMING_VERSION);
  assert(confucius.calculatedAtKst.endsWith('KST'));
  assert(Boolean(confucius.confuciusSynthesisMatrix?.integratedAction));
  assert.ok(confucius.situationalAnalects.classicalQuote.includes('군자화이부동'));
  assert.ok(confucius.temporalJunziRhythm.liHarmonyIndex >= 45 && confucius.temporalJunziRhythm.liHarmonyIndex <= 99);
  assert.ok(confucius.junziCultivationMatrix.renLiCohesion >= 50);
  const confuciusPrompt = formatConfuciusAnalectsZhitianmingPrompt(confucius);
  assert.ok(confuciusPrompt.includes('질문 맥락 논어 처방'));
  assert.ok(confuciusPrompt.includes('교차 매트릭스'));
});

test('v2.0.0 qualitative/temporal/matrix deepening: Plato Cave, Epictetus Dichotomy, and Bhagavad Gita Karma Yoga', () => {
  const testProfile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-14T09:45:00.000Z'); // KST 18:45

  const plato = calculatePlatonicIdeaCave(testProfile, '선택의 갈림길에서 진로 고민이 깊어요', now);
  assert.equal(plato.engineVersion, PLATONIC_IDEA_CAVE_VERSION);
  assert.ok(plato.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(plato.platoSynthesisMatrix?.integratedAction));
  assert.ok(plato.situationalCaveAscent.dialogueSource.includes('국가'));
  assert.ok(plato.temporalDialecticRhythm.noeticClarityIndex >= 50 && plato.temporalDialecticRhythm.noeticClarityIndex <= 99);
  assert.ok(plato.ideaAscentMatrix.overallSynthesis >= 50);
  const platoPrompt = formatPlatonicIdeaCavePrompt(plato);
  assert.ok(platoPrompt.includes('질문 맥락 동굴 처방'));
  assert.ok(platoPrompt.includes('이데아 상승 매트릭스'));
  assert.ok(platoPrompt.includes('교차 매트릭스'));

  const epictetus = calculateEpictetusDichotomyOfControl(testProfile, '남의 시선과 평판 때문에 자꾸 위축돼요', now);
  assert.equal(epictetus.engineVersion, EPICTETUS_CONTROL_VERSION);
  assert(epictetus.calculatedAtKst.endsWith('KST'));
  assert(Boolean(epictetus.epictetusSynthesisMatrix?.integratedAction));
  assert.ok(epictetus.situationalControlAudit.sourceCitation.includes('엥케이리디온'));
  assert.ok(epictetus.temporalProhairesisRhythm.prohairesisClarityIndex >= 50 && epictetus.temporalProhairesisRhythm.prohairesisClarityIndex <= 99);
  assert.ok(epictetus.stoicAutonomyMatrix.overallSynthesis >= 50);
  const epictetusPrompt = formatEpictetusDichotomyOfControlPrompt(epictetus);
  assert.ok(epictetusPrompt.includes('질문 맥락 통제 감사'));
  assert.ok(epictetusPrompt.includes('스토아 자율 매트릭스'));
  assert.ok(epictetusPrompt.includes('교차 매트릭스'));

  const gita = calculateBhagavadGitaKarmaYoga(testProfile, '결과가 불안해서 도무지 집중이 안 돼요', now);
  assert.equal(gita.engineVersion, BHAGAVAD_GITA_KARMA_YOGA_VERSION);
  assert.ok(gita.situationalKarmaAudit.chapterVerse.includes('바가바드 기타'));
  assert.ok(gita.temporalGunaRhythm.sattvaEquanimityIndex >= 50 && gita.temporalGunaRhythm.sattvaEquanimityIndex <= 99);
  assert.ok(gita.karmaYogaMatrix.overallSynthesis >= 50);
  const gitaPrompt = formatBhagavadGitaKarmaYogaPrompt(gita);
  assert.ok(gitaPrompt.includes('질문 맥락 카르마 처방'));
  assert.ok(gitaPrompt.includes('카르마 요가 매트릭스'));
});

test('v2.0.0 qualitative/temporal/matrix deepening: Four Noble Truths, Nagarjuna Sunyata, and Viktor Frankl Logotherapy', () => {
  const testProfile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-14T09:55:00.000Z'); // KST 18:55

  const buddha = calculateAncientIndianFourNobleTruths(testProfile, '불안하고 걱정이 많아서 마음이 흔들려요', now);
  assert.equal(buddha.engineVersion, FOUR_NOBLE_TRUTHS_VERSION);
  assert.ok(buddha.situationalDharmaAudit.suttaCitation.includes('화살경'));
  assert.ok(buddha.temporalSatiRhythm.satiClarityIndex >= 50 && buddha.temporalSatiRhythm.satiClarityIndex <= 99);
  assert.ok(buddha.nobleEightfoldMatrix.overallSynthesis >= 50);
  const buddhaPrompt = formatAncientIndianFourNobleTruthsPrompt(buddha);
  assert.ok(buddhaPrompt.includes('질문 맥락 법문 처방'));
  assert.ok(buddhaPrompt.includes('사성제·팔정도 매트릭스'));

  const nagarjuna = calculateNagarjunaMadhyamakaSunyata(testProfile, '내 생각만 맞다는 고집 때문에 갈등이 생겼어요', now);
  assert.equal(nagarjuna.engineVersion, NAGARJUNA_MADHYAMAKA_VERSION);
  assert.ok(nagarjuna.situationalSunyataAudit.karikaChapter.includes('중론'));
  assert.ok(nagarjuna.temporalPratityaRhythm.sunyataClarityIndex >= 50 && nagarjuna.temporalPratityaRhythm.sunyataClarityIndex <= 99);
  assert.ok(nagarjuna.madhyamakaMatrix.overallSynthesis >= 50);
  const nagarjunaPrompt = formatNagarjunaMadhyamakaSunyataPrompt(nagarjuna);
  assert.ok(nagarjunaPrompt.includes('질문 맥락 공성 처방'));
  assert.ok(nagarjunaPrompt.includes('중관 매트릭스'));

  const frankl = calculateViktorFranklLogotherapy(testProfile, '요즘 너무 공허하고 삶의 의욕이 안 나요', now);
  assert.equal(frankl.engineVersion, AUSTRIAN_VIKTOR_FRANKL_VERSION);
  assert.ok(frankl.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(frankl.franklSynthesisMatrix?.integratedAction));
  assert.ok(frankl.situationalMeaningAudit.sourceCitation.includes('죽음의 수용소에서'));
  assert.ok(frankl.temporalMeaningRhythm.logotherapyClarityIndex >= 50 && frankl.temporalMeaningRhythm.logotherapyClarityIndex <= 99);
  assert.ok(frankl.logotherapyMatrix.overallSynthesis >= 50);
  const franklPrompt = formatViktorFranklLogotherapyPrompt(frankl);
  assert.ok(franklPrompt.includes('질문 맥락 의미 감사'));
  assert.ok(franklPrompt.includes('로고테라피 매트릭스'));
  assert.ok(franklPrompt.includes('+09:00') && franklPrompt.includes('교차 매트릭스'));
});

test('v2.0.0 qualitative/temporal/matrix deepening: Spinoza Ethica, Mencius Hoyeon, and Wang Yangming Liangzhi', () => {
  const testProfile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-14T10:05:00.000Z'); // KST 19:05

  const spinoza = calculateBaruchSpinozaEthicaConatus(testProfile, now, '상대방과의 갈등으로 마음이 무거워요');
  assert.equal(spinoza.engineVersion, SPINOZA_CONATUS_AMORDEI_VERSION);
  assert.ok(spinoza.temporalConatusRhythm.conatusClarityIndex >= 50 && spinoza.temporalConatusRhythm.conatusClarityIndex <= 99);
  assert.ok(spinoza.ethicaSynthesisMatrix.overallSynthesis >= 50);
  const spinozaPrompt = formatBaruchSpinozaEthicaConatusPrompt(spinoza);
  assert.ok(spinozaPrompt.includes('KST 코나투스 리듬'));
  assert.ok(spinozaPrompt.includes('에티카 매트릭스'));

  const mencius = calculateMenciusFourSproutsHoyeon(testProfile, '조급한 마음 때문에 빨리 결과를 내고 싶어요', now);
  assert.equal(mencius.engineVersion, MENCIUS_FOUR_SPROUTS_HOYEON_VERSION);
  assert.ok(mencius.situationalMoralAudit.menciusCitation.includes('맹자'));
  assert.ok(mencius.temporalHoyeonRhythm.hoyeonClarityIndex >= 50 && mencius.temporalHoyeonRhythm.hoyeonClarityIndex <= 99);
  assert.ok(mencius.menciusSynthesisMatrix.overallSynthesis >= 50);
  const menciusPrompt = formatMenciusFourSproutsHoyeonPrompt(mencius);
  assert.ok(menciusPrompt.includes('질문 맥락 도덕 감사'));
  assert.ok(menciusPrompt.includes('맹자 매트릭스'));

  const yangming = calculateWangYangmingXinxue(testProfile, '망설이느라 실행을 계속 미루고 있어요', now);
  assert.equal(yangming.engineVersion, WANG_YANGMING_LIANGZHI_VERSION);
  assert.ok(yangming.situationalXinxueAudit.chuanxiluCitation.includes('전습록'));
  assert.ok(yangming.temporalLiangzhiRhythm.liangzhiClarityIndex >= 50 && yangming.temporalLiangzhiRhythm.liangzhiClarityIndex <= 99);
  assert.ok(yangming.yangmingSynthesisMatrix.overallSynthesis >= 50);
  const yangmingPrompt = formatWangYangmingXinxuePrompt(yangming);
  assert.ok(yangmingPrompt.includes('질문 맥락 심학 처방'));
  assert.ok(yangmingPrompt.includes('양명학 매트릭스'));
});

test('v2.0.0 qualitative/temporal/matrix deepening: William James, Hannah Arendt, and Thoreau Walden', () => {
  const testProfile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-14T10:15:00.000Z'); // KST 19:15

  const james = calculateAmericanWilliamJamesPragmatism(testProfile, '확신이 서지 않아 결정을 망설이고 있어요', now);
  assert.equal(james.engineVersion, AMERICAN_WILLIAM_JAMES_VERSION);
  assert.ok(james.situationalPragmatismAudit.sourceCitation.includes('신념의 의지'));
  assert.ok(james.temporalPragmatismRhythm.pragmatismClarityIndex >= 50 && james.temporalPragmatismRhythm.pragmatismClarityIndex <= 99);
  assert.ok(james.jamesSynthesisMatrix.overallSynthesis >= 50);
  const jamesPrompt = formatAmericanWilliamJamesPragmatismPrompt(james);
  assert.ok(jamesPrompt.includes('질문 맥락 실용 감사'));
  assert.ok(jamesPrompt.includes('제임스 매트릭스'));

  const arendt = calculateHannahArendtVitaActiva(testProfile, '새로운 시작을 앞두고 고민이 돼요', now);
  assert.equal(arendt.engineVersion, AMERICAN_GERMAN_HANNAH_ARENDT_VERSION);
  assert.ok(arendt.temporalVitaActivaRhythm.natalityClarityIndex >= 50 && arendt.temporalVitaActivaRhythm.natalityClarityIndex <= 99);
  assert.ok(arendt.arendtSynthesisMatrix.overallSynthesis >= 50);
  const arendtPrompt = formatHannahArendtVitaActivaPrompt(arendt);
  assert.ok(arendtPrompt.includes('KST 활동적 삶 리듬'));
  assert.ok(arendtPrompt.includes('아렌트 매트릭스'));

  const thoreau = calculateHenryDavidThoreauWalden(testProfile, '마음이 복잡해서 단순하게 정리하고 싶어요', now);
  assert.equal(thoreau.engineVersion, AMERICAN_HENRY_DAVID_THOREAU_VERSION);
  assert.ok(thoreau.temporalWaldenRhythm.waldenClarityIndex >= 50 && thoreau.temporalWaldenRhythm.waldenClarityIndex <= 99);
  assert.ok(thoreau.thoreauSynthesisMatrix.overallSynthesis >= 50);
  const thoreauPrompt = formatHenryDavidThoreauWaldenPrompt(thoreau);
  assert.ok(thoreauPrompt.includes('KST 월든 리듬'));
  assert.ok(thoreauPrompt.includes('월든 매트릭스'));
});

test('v2.0.0 qualitative/temporal/matrix deepening: Camus Absurd, Sartre Existentialism, and Beauvoir Ambiguity', () => {
  const testProfile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-14T10:25:00.000Z'); // KST 19:25

  const camus = calculateAlbertCamusAbsurdRevolt(testProfile, '매일 같은 일상이 반복되어 허무하게 느껴져요', now);
  assert.equal(camus.engineVersion, FRENCH_ALBERT_CAMUS_VERSION);
  assert.ok(camus.situationalAbsurdAudit.sourceCitation.includes('시지프'));
  assert.ok(camus.temporalRevoltRhythm.lucidityClarityIndex >= 50 && camus.temporalRevoltRhythm.lucidityClarityIndex <= 99);
  assert.ok(camus.camusSynthesisMatrix.overallSynthesis >= 50);
  const camusPrompt = formatAlbertCamusAbsurdRevoltPrompt(camus);
  assert.ok(camusPrompt.includes('질문 맥락 부조리 감사'));
  assert.ok(camusPrompt.includes('카뮈 매트릭스'));

  const sartre = calculateJeanPaulSartreExistentialism(testProfile, '상황이 이래서 어쩔 수 없는 것 같아요', now);
  assert.equal(sartre.engineVersion, FRENCH_JEAN_PAUL_SARTRE_VERSION);
  assert.ok(sartre.situationalAuthenticityAudit.sourceCitation.includes('존재와 무'));
  assert.ok(sartre.temporalProjectRhythm.authenticityClarityIndex >= 50 && sartre.temporalProjectRhythm.authenticityClarityIndex <= 99);
  assert.ok(sartre.sartreSynthesisMatrix.overallSynthesis >= 50);
  const sartrePrompt = formatJeanPaulSartreExistentialismPrompt(sartre);
  assert.ok(sartrePrompt.includes('질문 맥락 진정성 감사'));
  assert.ok(sartrePrompt.includes('사르트르 매트릭스'));

  const beauvoir = calculateFrenchSimoneDeBeauvoirAmbiguityFreedom(testProfile, '미래가 너무 불확실하고 애매해서 고민이에요', now);
  assert.equal(beauvoir.engineVersion, FRENCH_SIMONE_DE_BEAUVOIR_AMBIGUITY_FREEDOM_VERSION);
  assert.ok(beauvoir.situationalAmbiguityAudit.sourceCitation.includes('애매성의 윤리학'));
  assert.ok(beauvoir.temporalSolidarityRhythm.ambiguityClarityIndex >= 50 && beauvoir.temporalSolidarityRhythm.ambiguityClarityIndex <= 99);
  assert.ok(beauvoir.beauvoirSynthesisMatrix.overallSynthesis >= 50);
  const beauvoirPrompt = formatFrenchSimoneDeBeauvoirAmbiguityFreedomPrompt(beauvoir);
  assert.ok(beauvoirPrompt.includes('질문 맥락 애매성 감사'));
  assert.ok(beauvoirPrompt.includes('보부아르 매트릭스'));
});

test('v1.1.0 qualitative/temporal deepening without score exposure: Kafka, Buber, and Rilke', () => {
  const testProfile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-14T10:40:00.000Z'); // KST 19:40

  const kafka = calculateAustrianFranzKafkaExistentialTruth(testProfile, '진로 결정을 앞두고 두렵고 망설여져요', now);
  assert.equal(kafka.questionTopic, 'decision');
  assert.ok(kafka.situationalKafkaAudit.practiceGuidance.length > 0);
  assert.ok(kafka.situationalKafkaAudit.ritualAction.length > 0);
  assert.ok(kafka.situationalKafkaAudit.reflectionFocus.length > 0);
  assert.ok(kafka.temporalKafkaRhythm.timeWindowKo.includes('가면을 벗는 시간'));
  const kafkaPrompt = formatAustrianFranzKafkaExistentialTruthPrompt(kafka);
  assert.ok(kafkaPrompt.includes('질문 맥락 초점(decision)'));
  assert.ok(kafka.calculatedAtKst.includes('KST'));
  assert.ok(kafkaPrompt.includes('교차 매트릭스'));
  assert.ok(!kafkaPrompt.includes('/100'));

  const buber = calculateAustrianMartinBuberIAndThou(testProfile, '소중한 사람과의 관계와 대화가 어긋난 것 같아요', now);
  assert.equal(buber.questionTopic, 'relationship');
  assert.ok(buber.situationalBuberAudit.practiceGuidance.length > 0);
  assert.ok(buber.situationalBuberAudit.ritualAction.length > 0);
  assert.ok(buber.temporalBuberRhythm.timeWindowKo.includes('저녁'));
  const buberPrompt = formatAustrianMartinBuberIAndThouPrompt(buber);
  assert.ok(buberPrompt.includes('질문 맥락 초점(relationship)'));
  assert.ok(buber.calculatedAtKst.includes('KST'));
  assert.ok(buberPrompt.includes('교차 매트릭스'));
  assert.ok(!buberPrompt.includes('/100'));

  const rilke = calculateAustrianRainerMariaRilkeLetters(testProfile, '마음이 너무 지치고 상처가 깊어서 위로가 필요해요', now);
  assert.equal(rilke.questionTopic, 'healing');
  assert.ok(rilke.situationalRilkeAudit.practiceGuidance.length > 0);
  assert.ok(rilke.situationalRilkeAudit.ritualAction.length > 0);
  assert.ok(rilke.temporalRilkeRhythm.timeWindowKo.includes('황혼'));
  const rilkePrompt = formatAustrianRainerMariaRilkeLettersPrompt(rilke);
  assert.ok(rilkePrompt.includes('질문 맥락 초점(healing)'));
  assert.ok(rilke.calculatedAtKst.includes('KST'));
  assert.ok(rilkePrompt.includes('교차 매트릭스'));
  assert.ok(!rilkePrompt.includes('/100'));
});

test('qualitative & temporal deepening: Adler Individual Psychology, Viktor Frankl Logotherapy, and Wittgenstein Language Game', () => {
  const testProfile = {
    basic: {
      name: '제제',
      birthdate: '1994-01-24',
      birthtime: '14:30',
      gender: 'male',
    },
  } as any;
  const now = new Date('2026-11-14T11:40:00Z'); // 20:40 KST (evening)

  const adler = calculateAustrianAlfredAdlerIndividualPsychology(testProfile, '가족과의 갈등에서 내 과제를 어떻게 분리할까요?', now);
  assert.equal(adler.engineVersion, AUSTRIAN_ALFRED_ADLER_INDIVIDUAL_PSYCHOLOGY_VERSION);
  assert.equal(adler.questionTopic, 'relationship');
  assert.ok(adler.temporalAdlerRhythm.kstDateLabel.includes('2026-11-14'));
  assert.ok(adler.practiceGuidance.length > 0 && adler.ritualAction.length > 0 && adler.boundaryNotice.length > 0);
  const adlerPrompt = formatAustrianAlfredAdlerIndividualPsychologyPrompt(adler);
  assert.ok(adlerPrompt.includes('질문 주제 맥락: relationship'));
  assert.ok(adler.calculatedAtKst.includes('KST'));
  assert.ok(adlerPrompt.includes('교차 매트릭스'));
  assert.ok(!adlerPrompt.includes('/100'));

  const frankl = calculateViktorFranklLogotherapy(testProfile, '요즘 너무 공허하고 힘든데 삶의 의미를 찾고 싶어요', now);
  assert.equal(frankl.engineVersion, AUSTRIAN_VIKTOR_FRANKL_VERSION);
  assert.equal(frankl.questionTopic, 'healing');
  assert.ok(frankl.ritualAction.length > 0 && frankl.reflectionFocus.length > 0 && frankl.boundaryNotice.length > 0);
  const franklPrompt = formatViktorFranklLogotherapyPrompt(frankl);
  assert.ok(franklPrompt.includes('질문 주제 맥락: healing'));
  assert.ok(!franklPrompt.includes('/100'));

  const witt = calculateAustrianWittgensteinLanguageGameSilence(testProfile, '계속 머릿속이 복잡하고 불안한 생각만 맴돌아요', now);
  assert.equal(witt.engineVersion, AUSTRIAN_WITTGENSTEIN_LANGUAGE_GAME_SILENCE_VERSION);
  assert.equal(witt.questionTopic, 'healing');
  assert.ok(witt.temporalWittgensteinRhythm.kstDateLabel.includes('2026-11-14'));
  assert.ok(witt.practiceGuidance.length > 0 && witt.ritualAction.length > 0 && witt.boundaryNotice.length > 0);
  const wittPrompt = formatAustrianWittgensteinLanguageGameSilencePrompt(witt);
  assert.ok(wittPrompt.includes('질문 주제 맥락: healing'));
  assert.ok(witt.calculatedAtKst.includes('KST'));
  assert.ok(wittPrompt.includes('교차 매트릭스'));
  assert.ok(!wittPrompt.includes('/100'));
});

test('qualitative & temporal deepening: Bertrand Russell, Virginia Woolf, and William Shakespeare', () => {
  const testProfile = {
    basic: {
      name: '제제',
      birthdate: '1994-01-24',
      birthtime: '14:30',
      gender: 'male',
    },
  } as any;
  const now = new Date('2026-11-14T12:40:00Z'); // 21:40 KST (evening)

  const russell = calculateBritishBertrandRussellConquestOfHappiness(testProfile, '새로운 진로 결정을 앞두고 불안이 커요', now);
  assert.equal(russell.engineVersion, BRITISH_BERTRAND_RUSSELL_VERSION);
  assert.equal(russell.questionTopic, 'decision');
  assert.ok(russell.temporalRussellRhythm.kstDateLabel.includes('2026-11-14'));
  assert.ok(russell.practiceGuidance.length > 0 && russell.ritualAction.length > 0 && russell.boundaryNotice.length > 0);
  const russellPrompt = formatBritishBertrandRussellConquestOfHappinessPrompt(russell);
  assert.ok(russellPrompt.includes('질문 주제 맥락: decision'));
  assert.ok(russell.calculatedAtKst.includes('KST'));
  assert.ok(russellPrompt.includes('교차 매트릭스'));
  assert.ok(!russellPrompt.includes('/100'));

  const woolf = calculateBritishVirginiaWoolfRoomOfOnesOwn(testProfile, '요즘 마음이 지치고 나만의 시간이 필요해요', now);
  assert.equal(woolf.engineVersion, BRITISH_VIRGINIA_WOOLF_ROOM_OF_ONES_OWN_VERSION);
  assert.equal(woolf.questionTopic, 'healing');
  assert.ok(woolf.temporalWoolfRhythm.kstDateLabel.includes('2026-11-14'));
  assert.ok(woolf.practiceGuidance.length > 0 && woolf.ritualAction.length > 0 && woolf.boundaryNotice.length > 0);
  const woolfPrompt = formatBritishVirginiaWoolfRoomOfOnesOwnPrompt(woolf);
  assert.ok(woolfPrompt.includes('질문 주제 맥락: healing'));
  assert.ok(woolf.calculatedAtKst.includes('KST'));
  assert.ok(woolfPrompt.includes('교차 매트릭스'));
  assert.ok(!woolfPrompt.includes('/100'));

  const shakespeare = calculateBritishWilliamShakespeareTragicWisdom(testProfile, '가족과의 갈등에서 용서와 화해가 어려워요', now);
  assert.equal(shakespeare.engineVersion, BRITISH_WILLIAM_SHAKESPEARE_TRAGIC_WISDOM_VERSION);
  assert.equal(shakespeare.questionTopic, 'relationship');
  assert.ok(shakespeare.temporalShakespeareRhythm.kstDateLabel.includes('2026-11-14'));
  assert.ok(shakespeare.practiceGuidance.length > 0 && shakespeare.ritualAction.length > 0 && shakespeare.boundaryNotice.length > 0);
  const shakespearePrompt = formatBritishWilliamShakespeareTragicWisdomPrompt(shakespeare);
  assert.ok(shakespearePrompt.includes('질문 주제 맥락: relationship'));
  assert.ok(shakespeare.calculatedAtKst.includes('KST'));
  assert.ok(shakespearePrompt.includes('교차 매트릭스'));
  assert.ok(!shakespearePrompt.includes('/100'));
});

test('v2.1.0 qualitative deepening without score exposure: Camus, Sartre, and Beauvoir', () => {
  const testProfile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-14T15:40:00.000Z'); // KST 2026-11-15 00:40

  const camus = calculateAlbertCamusAbsurdRevolt(testProfile, '부당한 갈등 속에서 존엄을 지키고 싶어요', now);
  assert.equal(camus.engineVersion, FRENCH_ALBERT_CAMUS_VERSION);
  assert.equal(camus.questionTopic, 'relationship');
  assert.ok(camus.dailyPracticeRitual.length > 0 && camus.reflectiveQuestion.length > 0 && camus.interpretiveBoundary.length > 0);
  const camusPrompt = formatAlbertCamusAbsurdRevoltPrompt(camus);
  assert.ok(camusPrompt.includes('오늘의 실천 의례(relationship)'));
  assert.ok(!camusPrompt.includes('/100') && !camusPrompt.includes('%'));

  const sartre = calculateJeanPaulSartreExistentialism(testProfile, '중요한 결정을 앞두고 망설여져요', now);
  assert.equal(sartre.engineVersion, FRENCH_JEAN_PAUL_SARTRE_VERSION);
  assert.equal(sartre.questionTopic, 'decision');
  assert.ok(sartre.dailyPracticeRitual.length > 0 && sartre.reflectiveQuestion.length > 0 && sartre.interpretiveBoundary.length > 0);
  const sartrePrompt = formatJeanPaulSartreExistentialismPrompt(sartre);
  assert.ok(sartrePrompt.includes('오늘의 실천 의례(decision)'));
  assert.ok(!sartrePrompt.includes('/100') && !sartrePrompt.includes('%'));

  const beauvoir = calculateFrenchSimoneDeBeauvoirAmbiguityFreedom(testProfile, '남들의 기대와 평가 때문에 지치고 불안해요', now);
  assert.equal(beauvoir.engineVersion, FRENCH_SIMONE_DE_BEAUVOIR_AMBIGUITY_FREEDOM_VERSION);
  assert.equal(beauvoir.questionTopic, 'healing');
  assert.ok(beauvoir.dailyPracticeRitual.length > 0 && beauvoir.reflectiveQuestion.length > 0 && beauvoir.interpretiveBoundary.length > 0);
  const beauvoirPrompt = formatFrenchSimoneDeBeauvoirAmbiguityFreedomPrompt(beauvoir);
  assert.ok(beauvoirPrompt.includes('오늘의 실천 의례(healing)'));
  assert.ok(!beauvoirPrompt.includes('/100') && !beauvoirPrompt.includes('%'));
});

test('v1.1.0 qualitative deepening without score exposure: Bergson, Deleuze, and Merleau-Ponty', () => {
  const testProfile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-14T17:40:00.000Z'); // KST 2026-11-15 02:40

  const bergson = calculateHenriBergsonElanVital(testProfile, '새로운 도전을 시작할지 결정하기 어려워요', now);
  assert.equal(bergson.engineVersion, FRENCH_HENRI_BERGSON_VERSION);
  assert.equal(bergson.questionTopic, 'decision');
  assert.ok(bergson.temporalBergsonRhythm.kstDateLabel.includes('2026-11-15'));
  assert.ok(bergson.dailyPracticeRitual.length > 0 && bergson.reflectiveQuestion.length > 0 && bergson.interpretiveBoundary.length > 0);
  const bergsonPrompt = formatHenriBergsonElanVitalPrompt(bergson);
  assert.ok(bergsonPrompt.includes('질문 주제 맥락: decision'));
  assert.ok(!bergsonPrompt.includes('/100') && !bergsonPrompt.includes('%'));

  const deleuze = calculateFrenchGillesDeleuzeRhizomeBecoming(testProfile, '사람들과의 관계에서 답답함이 느껴져요', now);
  assert.equal(deleuze.engineVersion, FRENCH_GILLES_DELEUZE_RHIZOME_BECOMING_VERSION);
  assert.equal(deleuze.questionTopic, 'relationship');
  assert.ok(deleuze.temporalDeleuzeRhythm.kstDateLabel.includes('2026-11-15'));
  assert.ok(deleuze.dailyPracticeRitual.length > 0 && deleuze.reflectiveQuestion.length > 0 && deleuze.interpretiveBoundary.length > 0);
  const deleuzePrompt = formatFrenchGillesDeleuzeRhizomeBecomingPrompt(deleuze);
  assert.ok(deleuzePrompt.includes('질문 주제 맥락: relationship'));
  assert.ok(!deleuzePrompt.includes('/100') && !deleuzePrompt.includes('%'));

  const ponty = calculateFrenchMauriceMerleauPontyEmbodiedPhenomenology(testProfile, '요즘 너무 지치고 불안해서 쉬고 싶어요', now);
  assert.equal(ponty.engineVersion, FRENCH_MAURICE_MERLEAU_PONTY_EMBODIED_PHENOMENOLOGY_VERSION);
  assert.equal(ponty.questionTopic, 'healing');
  assert.ok(ponty.temporalMerleauPontyRhythm.kstDateLabel.includes('2026-11-15'));
  assert.ok(ponty.dailyPracticeRitual.length > 0 && ponty.reflectiveQuestion.length > 0 && ponty.interpretiveBoundary.length > 0);
  const pontyPrompt = formatFrenchMauriceMerleauPontyEmbodiedPhenomenologyPrompt(ponty);
  assert.ok(pontyPrompt.includes('질문 주제 맥락: healing'));
  assert.ok(!pontyPrompt.includes('/100') && !pontyPrompt.includes('%'));
});

test('Plotinus Enneads, Mozi Gyeom-Ae, and Buddhist Yogacara v2.0.0 engines provide qualitative situational/temporal audit without score exposure', () => {
  const testDate = new Date('2026-11-15T04:05:00Z');
  const plotinus = calculateAncientGreekPlotinusEnneadsHenosis(profile, testDate, '이직을 선택해야 할지 방향이 고민돼요');
  assert.equal(plotinus.engineVersion, ANCIENT_GREEK_PLOTINUS_VERSION);
  assert.equal(plotinus.questionTopic, 'decision');
  assert.ok(plotinus.situationalEnneadsAudit.enneadsRef.length > 0);
  assert.ok(plotinus.temporalNousRhythm.kstWindowLabel.length > 0);
  assert.ok(plotinus.plotinusSynthesisMatrix.integrativeSummary.length > 0);
  const plotinusPrompt = formatAncientGreekPlotinusEnneadsHenosisPrompt(plotinus);
  assert.ok(plotinusPrompt.includes('질문 맥락 감사'));
  assert.ok(!plotinusPrompt.includes('/100') && !plotinusPrompt.includes('%'));

  const mozi = calculateMoziGyeomAe(profile, '동료와의 갈등과 신뢰 회복이 고민입니다', testDate);
  assert.equal(mozi.engineVersion, MOZI_GYEOM_AE_VERSION);
  assert.equal(mozi.questionTopic, 'relationship');
  assert.ok(mozi.situationalMohistAudit.moziTextRef.length > 0);
  assert.ok(mozi.temporalMohistRhythm.kstWindowLabel.length > 0);
  assert.ok(mozi.mohistSynthesisMatrix.integrativeSummary.length > 0);
  const moziPrompt = formatMoziGyeomAePrompt(mozi);
  assert.ok(moziPrompt.includes('질문 맥락 감사'));
  assert.ok(!moziPrompt.includes('/100') && !moziPrompt.includes('%'));

  const yogacara = calculateBuddhistYogacaraConsciousness({
    profile,
    question: '번아웃과 후회를 치유하고 마음을 비우고 싶어요',
    now: testDate,
  });
  assert.equal(yogacara.engineVersion, BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION);
  assert.equal(yogacara.questionTopic, 'healing');
  assert.ok(yogacara.situationalYogacaraAudit.scriptureRef.length > 0);
  assert.ok(yogacara.temporalAlayaRhythm.kstWindowLabel.length > 0);
  assert.ok(yogacara.yogacaraSynthesisMatrix.integrativeSummary.length > 0);
  const yogacaraPrompt = formatBuddhistYogacaraConsciousnessPrompt(yogacara);
  assert.ok(yogacaraPrompt.includes('질문 맥락 감사'));
  assert.ok(!yogacaraPrompt.includes('/100') && !yogacaraPrompt.includes('%'));
});

test('v2.1.0 pure qualitative deepening: Aristotle Mesotes, Plato Cave, and Epictetus Dichotomy remove /100 and % from prompt', () => {
  const testProfile = {
    basic: {
      name: '제제',
      birthdate: '1994-01-24',
      birthtime: '08:30',
      gender: 'male' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-15T04:40:00.000+09:00');

  const aristotle = calculateAristotleMesotes(testProfile, '조급함과 불안 사이에서 일의 균형을 잡고 싶어요', now);
  assert.equal(aristotle.engineVersion, 'LUCKEY-ARISTOTLE-MESOTES-EUDAIMONIA-v2.1.0');
  assert.ok(aristotle.dailyPracticeRitual.includes('헥시스'));
  assert.ok(aristotle.reflectiveQuestion.length > 10);
  assert.ok(aristotle.interpretiveBoundary.length > 10);
  const aristotlePrompt = formatAristotleMesotesPrompt(aristotle);
  assert.ok(!aristotlePrompt.includes('/100') && !aristotlePrompt.includes('%'));
  assert.ok(aristotlePrompt.includes('오늘의 실천 의례'));
  assert.ok(aristotlePrompt.includes('핵심 성찰 질문'));
  assert.ok(aristotlePrompt.includes('해석 경계'));

  const plato = calculatePlatonicIdeaCave(testProfile, '타인의 시선과 본질 사이에서 진로를 고민 중입니다', now);
  assert.equal(plato.engineVersion, 'LUCKEY-PLATONIC-IDEA-CAVE-v2.1.0');
  assert.ok(plato.dailyPracticeRitual.includes('카타바시스'));
  assert.ok(plato.reflectiveQuestion.length > 10);
  assert.ok(plato.interpretiveBoundary.length > 10);
  const platoPrompt = formatPlatonicIdeaCavePrompt(plato);
  assert.ok(!platoPrompt.includes('/100') && !platoPrompt.includes('%'));
  assert.ok(platoPrompt.includes('오늘의 실천 의례'));
  assert.ok(platoPrompt.includes('핵심 성찰 질문'));
  assert.ok(platoPrompt.includes('해석 경계'));

  const epictetus = calculateEpictetusDichotomyOfControl(testProfile, '내가 바꿀 수 없는 결과 때문에 마음이 흔들립니다', now);
  assert.equal(epictetus.engineVersion, 'LUCKEY-EPICTETUS-CONTROL-v2.1.0');
  assert.ok(epictetus.dailyPracticeRitual.includes('프로하이레시스'));
  assert.ok(epictetus.reflectiveQuestion.length > 10);
  assert.ok(epictetus.interpretiveBoundary.length > 10);
  const epictetusPrompt = formatEpictetusDichotomyOfControlPrompt(epictetus);
  assert.ok(!epictetusPrompt.includes('/100') && !epictetusPrompt.includes('%'));
  assert.ok(epictetusPrompt.includes('오늘의 실천 의례'));
  assert.ok(epictetusPrompt.includes('핵심 성찰 질문'));
  assert.ok(epictetusPrompt.includes('해석 경계'));
});

test('Aztec Tonalamatl, Balinese Tri Hita Karana, and Celtic Tuatha Four Treasures v2.0.0: qualitative/temporal audits without prompt score leaks', () => {
  const now = new Date('2026-11-15T04:55:00+09:00');

  const aztec = calculateAztecTonalamatl({ profile, question: '새로운 프로젝트를 시작하려는데 방향이 고민됩니다', now });
  assert.equal(aztec.engineVersion, AZTEC_TONALAMATL_ENGINE_VERSION);
  assert.ok(aztec.calculatedAtKst.endsWith('+09:00'));
  assert.ok(aztec.interpretiveBoundary.length > 0);
  assert.ok(aztec.situationalTonalamatlAudit.focusAxis.length > 0);
  assert.ok(aztec.temporalTonalamatlRhythm.sunPhase.length > 0);
  assert.ok(aztec.tonalamatlSynthesisMatrix.ollinActionDirective.length > 0);
  const aztecPrompt = formatAztecTonalamatlPrompt(aztec);
  assert.ok(!aztecPrompt.includes('/100') && !aztecPrompt.includes('%'));
  assert.ok(aztecPrompt.includes('+09:00') && aztecPrompt.includes('해석 경계'));

  const balinese = calculateBalineseTriHitaKarana(profile, '가족과의 관계에서 말의 온도를 조율하고 싶습니다', now);
  assert.equal(balinese.engineVersion, BALINESE_TRI_HITA_KARANA_ENGINE_VERSION);
  assert.ok(balinese.calculatedAtKst.endsWith('+09:00'));
  assert.ok(balinese.interpretiveBoundary.length > 0);
  assert.ok(balinese.situationalTriHitaAudit.harmonyAxis.length > 0);
  assert.ok(balinese.temporalTriHitaRhythm.sandhyaPhase.length > 0);
  assert.ok(balinese.triHitaSynthesisMatrix.dailyOfferingDirective.length > 0);
  const balinesePrompt = formatBalineseTriHitaKaranaPrompt(balinese);
  assert.ok(!balinesePrompt.includes('/100') && !balinesePrompt.includes('%'));
  assert.ok(balinesePrompt.includes('+09:00') && balinesePrompt.includes('해석 경계'));

  const celtic = calculateCelticTuathaFourTreasures({ profile, question: '중요한 결정을 앞두고 돌파력이 필요합니다', now });
  assert.equal(celtic.engineVersion, CELTIC_TUATHA_FOUR_TREASURES_ENGINE_VERSION);
  assert.ok(celtic.calculatedAtKst.endsWith('+09:00'));
  assert.ok(celtic.interpretiveBoundary.length > 0);
  assert.ok(celtic.situationalTuathaAudit.battlefieldTheme.length > 0);
  assert.ok(celtic.temporalTuathaRhythm.celticDayWindow.length > 0);
  assert.ok(celtic.tuathaSynthesisMatrix.nextHeroicStep.length > 0);
  const celticPrompt = formatCelticTuathaFourTreasuresPrompt(celtic);
  assert.ok(!celticPrompt.includes('/100') && !celticPrompt.includes('%'));
  assert.ok(celticPrompt.includes('+09:00') && celticPrompt.includes('해석 경계'));
});

test('Chaldean Mul Apin, Egyptian Sphinx Dream, and Etruscan Augur v2.0.0: qualitative/temporal audits without prompt score leaks', () => {
  const now = new Date('2026-11-15T05:05:00+09:00');

  const chaldean = calculateChaldeanMulApinAstrology({ profile, question: '새 프로젝트 계약을 앞두고 원칙을 점검하고 싶습니다', now });
  assert.equal(chaldean.engineVersion, CHALDEAN_MUL_APIN_ASTROLOGY_ENGINE_VERSION);
  assert.ok(chaldean.calculatedAtKst.endsWith('+09:00'));
  assert.ok(chaldean.interpretiveBoundary.length > 0);
  assert.ok(chaldean.situationalMulApinAudit.celestialFocus.length > 0);
  assert.ok(chaldean.temporalMulApinRhythm.zigguratWatch.length > 0);
  assert.ok(chaldean.mulApinSynthesisMatrix.nextAstronomicalStep.length > 0);
  const chaldeanPrompt = formatChaldeanMulApinAstrologyPrompt(chaldean);
  assert.ok(!chaldeanPrompt.includes('/100') && !chaldeanPrompt.includes('%'));
  assert.ok(chaldeanPrompt.includes('+09:00') && chaldeanPrompt.includes('해석 경계'));

  const sphinx = calculateEgyptianSphinxDreamOracle({ profile, question: '사소한 잡무와 불안을 걷어내고 싶습니다', now });
  assert.equal(sphinx.engineVersion, 'LUCKEY-EGYPTIAN-SPHINX-v2.0.0');
  assert.ok(sphinx.situationalSphinxAudit.sandObstacleType.length > 0);
  assert.ok(sphinx.temporalSphinxRhythm.solarBarqueStage.length > 0);
  assert.ok(sphinx.sphinxSynthesisMatrix.sovereignStep.length > 0);
  const sphinxPrompt = formatEgyptianSphinxDreamOraclePrompt(sphinx);
  assert.ok(!sphinxPrompt.includes('/100') && !sphinxPrompt.includes('%'));

  const etruscan = calculateEtruscanAugurSixteenSky({ profile, question: '중요한 결정의 타이밍을 살피고 싶습니다', now });
  assert.equal(etruscan.engineVersion, 'LUCKEY-ETRUSCAN-AUGUR-v2.0.0');
  assert.ok(etruscan.situationalAugurAudit.templumInquiryAxis.length > 0);
  assert.ok(etruscan.temporalAugurRhythm.auguryWatchWindow.length > 0);
  assert.ok(etruscan.augurSynthesisMatrix.nextAuspiceAction.length > 0);
  const etruscanPrompt = formatEtruscanAugurSixteenSkyPrompt(etruscan);
  assert.ok(!etruscanPrompt.includes('/100') && !etruscanPrompt.includes('%') && !etruscanPrompt.includes('점수'));
});

test('Eleusinian Mysteries, Hindu Kundalini, and Hopi Four Worlds v2.0.0 include KST temporal rhythm and qualitative matrix without score exposure', () => {
  const testDate = new Date('2026-11-15T06:15:00Z');

  const eleusis = calculateEleusinianMysteries(profile, {
    now: testDate,
    question: '새로운 전환 앞에서 마음이 복잡해요',
  });
  assert.equal(eleusis.engineVersion, 'LUCKEY-ELEUSINIAN-MYSTERIES-v2.0.0');
  assert.ok(eleusis.temporalEleusinianRhythm.calculatedAtKst.includes('KST'));
  assert.ok(eleusis.eleusinianSynthesisMatrix.gradeStationNexus.length > 0);
  const eleusisPrompt = formatEleusinianMysteriesPrompt(eleusis);
  assert.ok(!eleusisPrompt.includes('/100') && !eleusisPrompt.includes('%') && !eleusisPrompt.includes('점수'));

  const kundalini = calculateHinduTantricKundalini({
    profile,
    contextText: '일과 마음의 균형을 잡고 싶습니다',
    referenceDate: testDate,
  });
  assert.equal(kundalini.engineVersion, 'LUCKEY-HINDU-KUNDALINI-v2.0.0');
  assert.ok(kundalini.temporalKundaliniRhythm.calculatedAtKst.includes('KST'));
  assert.ok(kundalini.kundaliniSynthesisMatrix.nadiChakraNexus.length > 0);
  const kundaliniPrompt = formatHinduTantricKundaliniPrompt(kundalini);
  assert.ok(!kundaliniPrompt.includes('/ 100') && !kundaliniPrompt.includes('/100') && !kundaliniPrompt.includes('%') && !kundaliniPrompt.includes('점수'));

  const hopi = calculateHopiFourWorldsKachina(profile, '흔들리는 일상을 바로잡고 싶어요', testDate);
  assert.equal(hopi.engineVersion, '2.0.0');
  assert.ok(hopi.temporalHopiRhythm.calculatedAtKst.includes('KST'));
  assert.ok(hopi.hopiSynthesisMatrix.kachinaWorldNexus.length > 0);
  const hopiPrompt = formatHopiFourWorldsPrompt(hopi);
  assert.ok(!hopiPrompt.includes('/100') && !hopiPrompt.includes('%') && !hopiPrompt.includes('점수'));
});

test('Ibn Arabi Wahdat, Kabbalistic Zohar, and Kashmir Shaivism Spanda v2.0.0 include KST temporal rhythm and qualitative matrix without score exposure', () => {
  const testDate = new Date('2026-11-15T06:25:00Z');

  const arabi = calculateIbnArabiWahdatAlWujud(profile, testDate, '마음의 평화와 자비가 필요해요');
  assert.equal(arabi.engineVersion, '2.0.0');
  assert.ok(arabi.temporalWahdatRhythm.calculatedAtKst.includes('KST'));
  assert.ok(arabi.wahdatSynthesisMatrix.prophetVirtueNexus.length > 0);
  const arabiPrompt = formatIbnArabiWahdatAlWujudPrompt(arabi);
  assert.ok(!arabiPrompt.includes('/100') && !arabiPrompt.includes('%') && !arabiPrompt.includes('점수'));

  const zohar = calculateKabbalisticZoharSoul({
    profile,
    question: '영혼의 회복과 내면의 중심을 찾고 싶습니다',
    now: testDate,
  });
  assert.equal(zohar.engineVersion, '2.0.0');
  assert.ok(zohar.temporalZoharRhythm.calculatedAtKst.includes('KST'));
  assert.ok(zohar.zoharSynthesisMatrix.primarySecondaryNexus.length > 0);
  const zoharPrompt = formatKabbalisticZoharSoulPrompt(zohar);
  assert.ok(!zoharPrompt.includes('/100') && !zoharPrompt.includes('%') && !zoharPrompt.includes('점수'));

  const spanda = calculateKashmirShaivismSpanda({
    profile,
    question: '새로운 창조적 영감을 실행하고 싶어요',
    now: testDate,
  });
  assert.equal(spanda.engineVersion, '2.0.0');
  assert.ok(spanda.temporalSpandaRhythm.calculatedAtKst.includes('KST'));
  assert.ok(spanda.spandaSynthesisMatrix.primarySecondaryNexus.length > 0);
  const spandaPrompt = formatKashmirShaivismSpandaPrompt(spanda);
  assert.ok(!spandaPrompt.includes('/100') && !spandaPrompt.includes('%') && !spandaPrompt.includes('점수'));
});

test('v2.1.0 qualitative prompt reform: Hannah Arendt, Henry David Thoreau, and William James hide raw scores', () => {
  const profile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-15T06:40:00+09:00');

  const arendt = calculateHannahArendtVitaActiva(profile, '새로운 시작을 앞두고 결정을 망설이고 있어요', now);
  assert.equal(arendt.engineVersion, 'LUCKEY-HANNAH-ARENDT-VITA-ACTIVA-v2.1.0');
  const arendtPrompt = formatHannahArendtVitaActivaPrompt(arendt);
  assert.ok(!arendtPrompt.includes('/100') && !arendtPrompt.includes('%'));
  assert.ok(arendtPrompt.includes('아렌트 매트릭스'));

  const thoreau = calculateHenryDavidThoreauWalden(profile, '지치고 복잡해서 마음을 단순하게 비우고 싶어요', now);
  assert.equal(thoreau.engineVersion, 'LUCKEY-HENRY-DAVID-THOREAU-WALDEN-v2.1.0');
  const thoreauPrompt = formatHenryDavidThoreauWaldenPrompt(thoreau);
  assert.ok(!thoreauPrompt.includes('/100') && !thoreauPrompt.includes('%'));
  assert.ok(thoreauPrompt.includes('월든 매트릭스'));

  const james = calculateAmericanWilliamJamesPragmatism(profile, '불안하고 잡념이 많아 마음을 다잡고 싶어요', now);
  assert.equal(james.engineVersion, 'LUCKEY-WILLIAM-JAMES-PRAGMATISM-v2.1.0');
  assert.equal(james.questionTopic, 'healing');
  assert.ok(james.dailyPracticeRitual.length > 0);
  assert.ok(james.reflectiveQuestion.length > 0);
  assert.ok(james.interpretiveBoundary.length > 0);
  const jamesPrompt = formatAmericanWilliamJamesPragmatismPrompt(james);
  assert.ok(!jamesPrompt.includes('/100') && !jamesPrompt.includes('%'));
  assert.ok(jamesPrompt.includes('오늘의 실천 의례'));
  assert.ok(jamesPrompt.includes('해석 경계'));
});

test('Kant, Hegel, and Nietzsche engines (v2.1.0) expose pure qualitative reflection without /100 or %', () => {
  const now = new Date('2026-11-14T22:42:00Z');

  const kant = calculateKantCategoricalImperative(profile, '인간관계에서 원칙과 존엄성을 어떻게 지켜야 할까요?', now);
  assert.equal(kant.engineVersion, KANT_CATEGORICAL_IMPERATIVE_VERSION);
  assert.ok(kant.dailyPracticeRitual.length > 0);
  assert.ok(kant.interpretiveBoundary.length > 0);
  const kantPrompt = formatKantCategoricalImperativePrompt(kant);
  assert.ok(!kantPrompt.includes('/100') && !kantPrompt.includes('%'));
  assert.ok(kantPrompt.includes('일상 실천 의례'));
  assert.ok(kantPrompt.includes('해석 경계'));

  const hegel = calculateHegelDialecticalAufheben(profile, '서로 다른 두 입장 사이의 갈등을 어떻게 풀어야 할까요?', now);
  assert.equal(hegel.engineVersion, GERMAN_HEGEL_DIALECTICAL_VERSION);
  assert.ok(hegel.dailyPracticeRitual.length > 0);
  assert.ok(hegel.interpretiveBoundary.length > 0);
  const hegelPrompt = formatHegelDialecticalAufhebenPrompt(hegel);
  assert.ok(!hegelPrompt.includes('/100') && !hegelPrompt.includes('%'));
  assert.ok(hegelPrompt.includes('일상 실천 의례'));
  assert.ok(hegelPrompt.includes('해석 경계'));

  const nietzsche = calculateNietzscheZarathustraAmorFati(profile, '지나간 후회를 딛고 새로운 창조를 시작하고 싶어요', now);
  assert.equal(nietzsche.engineVersion, NIETZSCHE_ZARATHUSTRA_AMOR_FATI_VERSION);
  assert.ok(nietzsche.dailyPracticeRitual.length > 0);
  assert.ok(nietzsche.interpretiveBoundary.length > 0);
  const nietzschePrompt = formatNietzscheZarathustraAmorFatiPrompt(nietzsche);
  assert.ok(!nietzschePrompt.includes('/100') && !nietzschePrompt.includes('%'));
  assert.ok(nietzschePrompt.includes('일상 실천 의례'));
  assert.ok(nietzschePrompt.includes('해석 경계'));
});

test('v2.1.0 pure qualitative prompts (zero /100 or % exposure): Bhagavad Gita, Four Noble Truths, and Nagarjuna Sunyata', () => {
  const now = new Date('2026-11-15T00:00:00.000Z'); // KST 09:00

  const gita = calculateBhagavadGitaKarmaYoga(profile, '결과가 불안해서 도무지 집중이 안 돼요', now);
  assert.equal(gita.engineVersion, BHAGAVAD_GITA_KARMA_YOGA_VERSION);
  assert.ok(gita.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(gita.gitaSynthesisMatrix?.integratedAction));
  assert.ok(gita.dailyPracticeRitual.length > 0);
  assert.ok(gita.reflectiveQuestion.length > 0);
  assert.ok(gita.interpretiveBoundary.length > 0);
  const gitaPrompt = formatBhagavadGitaKarmaYogaPrompt(gita);
  assert.ok(!gitaPrompt.includes('/100') && !gitaPrompt.includes('%'));
  assert.ok(gitaPrompt.includes('오늘의 실천 의례'));
  assert.ok(gitaPrompt.includes('성찰 질문'));
  assert.ok(gitaPrompt.includes('해석 경계') && gitaPrompt.includes('+09:00') && gitaPrompt.includes('교차 매트릭스'));

  const buddha = calculateAncientIndianFourNobleTruths(profile, '불안하고 걱정이 많아서 마음이 흔들려요', now);
  assert.equal(buddha.engineVersion, FOUR_NOBLE_TRUTHS_VERSION);
  assert.ok(buddha.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(buddha.buddhistSynthesisMatrix?.integratedAction));
  assert.ok(buddha.dailyPracticeRitual.length > 0);
  assert.ok(buddha.reflectiveQuestion.length > 0);
  assert.ok(buddha.interpretiveBoundary.length > 0);
  const buddhaPrompt = formatAncientIndianFourNobleTruthsPrompt(buddha);
  assert.ok(!buddhaPrompt.includes('/100') && !buddhaPrompt.includes('%'));
  assert.ok(buddhaPrompt.includes('오늘의 실천 의례'));
  assert.ok(buddhaPrompt.includes('성찰 질문'));
  assert.ok(buddhaPrompt.includes('해석 경계') && buddhaPrompt.includes('+09:00') && buddhaPrompt.includes('교차 매트릭스'));

  const nagarjuna = calculateNagarjunaMadhyamakaSunyata(profile, '내 생각만 맞다는 고집 때문에 갈등이 생겼어요', now);
  assert.equal(nagarjuna.engineVersion, NAGARJUNA_MADHYAMAKA_VERSION);
  assert.ok(nagarjuna.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(nagarjuna.nagarjunaSynthesisMatrix?.integratedAction));
  assert.ok(nagarjuna.dailyPracticeRitual.length > 0);
  assert.ok(nagarjuna.reflectiveQuestion.length > 0);
  assert.ok(nagarjuna.interpretiveBoundary.length > 0);
  const nagarjunaPrompt = formatNagarjunaMadhyamakaSunyataPrompt(nagarjuna);
  assert.ok(!nagarjunaPrompt.includes('/100') && !nagarjunaPrompt.includes('%'));
  assert.ok(nagarjunaPrompt.includes('오늘의 실천 의례'));
  assert.ok(nagarjunaPrompt.includes('성찰 질문'));
  assert.ok(nagarjunaPrompt.includes('해석 경계') && nagarjunaPrompt.includes('+09:00') && nagarjunaPrompt.includes('교차 매트릭스'));
});

test('v2.1.0 pure qualitative prompts (no /100 or raw scores): Confucius, Mencius, and Wang Yangming', () => {
  const now = new Date('2026-11-15T01:40:00Z');
  const confucius = calculateConfuciusAnalectsZhitianming(profile, '동료와의 관계와 믿음에 갈등이 생겼어요', now);
  assert.equal(confucius.engineVersion, CONFUCIUS_ZHITIANMING_VERSION);
  assert.ok(confucius.dailyPracticeRitual.length > 0);
  assert.ok(confucius.reflectiveQuestion.length > 0);
  assert.ok(confucius.interpretiveBoundary.length > 0);
  const confuciusPrompt = formatConfuciusAnalectsZhitianmingPrompt(confucius);
  assert.ok(!confuciusPrompt.includes('/100') && !confuciusPrompt.includes('%'));
  assert.ok(confuciusPrompt.includes('일일 수양 의례'));
  assert.ok(confuciusPrompt.includes('해석 경계'));

  const mencius = calculateMenciusFourSproutsHoyeon(profile, '조급한 마음 때문에 빨리 결과를 내고 싶어요', now);
  assert.equal(mencius.engineVersion, MENCIUS_FOUR_SPROUTS_HOYEON_VERSION);
  assert.ok(mencius.dailyPracticeRitual.length > 0);
  assert.ok(mencius.reflectiveQuestion.length > 0);
  assert.ok(mencius.interpretiveBoundary.length > 0);
  const menciusPrompt = formatMenciusFourSproutsHoyeonPrompt(mencius);
  assert.ok(!menciusPrompt.includes('/100') && !menciusPrompt.includes('%'));
  assert.ok(menciusPrompt.includes('일일 집의(集義) 의례'));
  assert.ok(menciusPrompt.includes('성찰 질문'));
  assert.ok(menciusPrompt.includes('해석 경계'));

  const yangming = calculateWangYangmingXinxue(profile, '망설이느라 실행을 계속 미루고 있어요', now);
  assert.equal(yangming.engineVersion, WANG_YANGMING_LIANGZHI_VERSION);
  assert.ok(yangming.dailyPracticeRitual.length > 0);
  assert.ok(yangming.reflectiveQuestion.length > 0);
  assert.ok(yangming.interpretiveBoundary.length > 0);
  const yangmingPrompt = formatWangYangmingXinxuePrompt(yangming);
  assert.ok(!yangmingPrompt.includes('/100') && !yangmingPrompt.includes('%'));
  assert.ok(yangmingPrompt.includes('일일 사전마련 의례'));
  assert.ok(yangmingPrompt.includes('성찰 질문'));
  assert.ok(yangmingPrompt.includes('해석 경계'));
});

test('v2.1.0 qualitative prompt reform: Jacques Derrida, Michel Foucault, and Roland Barthes hide raw scores', () => {
  const profile = {
    basic: {
      name: '남희',
      birthdate: '1988-05-12',
      birthtime: '09:30',
      gender: 'female' as const,
      calendarType: 'solar' as const,
    },
  };
  const now = new Date('2026-11-15T11:40:00+09:00');

  const derrida = calculateFrenchJacquesDerridaDeconstructionDifferance(profile, '이분법적 선택 앞에서 막막해요', now);
  assert.equal(derrida.engineVersion, 'LUCKEY-JACQUES-DERRIDA-DECONSTRUCTION-DIFFERANCE-v2.1.0');
  assert.ok(derrida.dailyPracticeRitual.length > 0);
  assert.ok(derrida.reflectiveQuestion.length > 0);
  assert.ok(derrida.interpretiveBoundary.length > 0);
  const derridaPrompt = formatFrenchJacquesDerridaDeconstructionDifferancePrompt(derrida);
  assert.ok(!derridaPrompt.includes('/100') && !derridaPrompt.includes('%'));
  assert.ok(derridaPrompt.includes('일상 실천 의례'));
  assert.ok(derridaPrompt.includes('성찰 질문'));
  assert.ok(derridaPrompt.includes('해석 경계'));

  const foucault = calculateFrenchMichelFoucaultCareOfSelfAesthetics(profile, '남들 기준 말고 내 방식대로 살고 싶어요', now);
  assert.equal(foucault.engineVersion, 'LUCKEY-MICHEL-FOUCAULT-CARE-OF-SELF-v2.1.0');
  assert.ok(foucault.dailyPracticeRitual.length > 0);
  assert.ok(foucault.reflectiveQuestion.length > 0);
  assert.ok(foucault.interpretiveBoundary.length > 0);
  const foucaultPrompt = formatFrenchMichelFoucaultCareOfSelfAestheticsPrompt(foucault);
  assert.ok(!foucaultPrompt.includes('/100') && !foucaultPrompt.includes('%'));
  assert.ok(foucaultPrompt.includes('일상 실천 의례'));
  assert.ok(foucaultPrompt.includes('성찰 질문'));
  assert.ok(foucaultPrompt.includes('해석 경계'));

  const barthes = calculateFrenchRolandBarthesSemioticsPunctum(profile, '익숙한 일상에 새로운 의미를 찾고 싶어요', now);
  assert.equal(barthes.engineVersion, 'LUCKEY-ROLAND-BARTHES-SEMIOTICS-PUNCTUM-v2.1.0');
  assert.ok(barthes.dailyPracticeRitual.length > 0);
  assert.ok(barthes.reflectiveQuestion.length > 0);
  assert.ok(barthes.interpretiveBoundary.length > 0);
  const barthesPrompt = formatFrenchRolandBarthesSemioticsPunctumPrompt(barthes);
  assert.ok(!barthesPrompt.includes('/100') && !barthesPrompt.includes('%'));
  assert.ok(barthesPrompt.includes('일상 실천 의례'));
  assert.ok(barthesPrompt.includes('성찰 질문'));
  assert.ok(barthesPrompt.includes('해석 경계'));
});














test('Korean Yutjeom engine: five qualitative stances without raw scores or a claimed cast', () => {
  const rep = calculateKoreanYutjeomFourStickOracle(profile, '이직을 해야 할지 고민이에요', new Date('2026-11-15T03:00:00Z'));
  assert.equal(rep.engineVersion, KOREAN_YUTJEOM_FOUR_STICK_VERSION);
  assert.ok(rep.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(rep.yutjeomSynthesisMatrix?.integratedAction));
  assert.equal(rep.actualCastRecorded, false);
  assert.equal(rep.questionTopic, 'decision');
  assert.ok(rep.activeStanceTheme.stanceNameKo.length > 0);
  assert.ok(rep.dailyPracticeRitual.length > 0);
  assert.ok(rep.reflectiveQuestion.length > 0);
  assert.ok(rep.interpretiveBoundary.includes('실제 윷 던지기를 대신하지 않으며'));
  const prompt = formatKoreanYutjeomFourStickPrompt(rep);
  assert.ok(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
  assert.ok(prompt.includes('오늘의 실천 의례'));
  assert.ok(prompt.includes('성찰 질문'));
  assert.ok(prompt.includes('해석 경계'));
  assert.ok(prompt.includes('KST 시공간 리듬'));
  assert.ok(prompt.includes('낮 — 가락을 주고받는 시간'));
  assert.ok(prompt.includes('+09:00') && prompt.includes('교차 매트릭스'));

  const relationship = calculateKoreanYutjeomFourStickOracle(profile, '가족과 자꾸 다투어요');
  assert.equal(relationship.questionTopic, 'relationship');
  assert.ok(!formatKoreanYutjeomFourStickPrompt(relationship).includes('/100'));
});

test('Tamil Thirukkural engine: Aram, Porul and Kamam guidance stay qualitative and unattributed', () => {
  const rep = calculateTamilThirukkuralAramPorulKamam(profile, '연인과 자꾸 다투어요', new Date('2026-11-15T12:00:00Z'));
  assert.equal(rep.engineVersion, TAMIL_THIRUKKURAL_ARAM_PORUL_KAMAM_VERSION);
  assert.equal(rep.questionTopic, 'relationship');
  assert.ok(rep.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(rep.thirukkuralSynthesisMatrix?.integratedAction));
  assert.ok(rep.activeThirukkuralTheme.chapterReference.length > 0);
  assert.ok(rep.situationalThirukkuralAudit.questionMapping.length > 0);
  assert.ok(rep.interpretiveBoundary.includes('역본마다 문장 표현이 달라'));
  const prompt = formatTamilThirukkuralAramPorulKamamPrompt(rep);
  assert.ok(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
  assert.ok(prompt.includes('아람·포룰·카맘'));
  assert.ok(prompt.includes('오늘의 실천 의례'));
  assert.ok(prompt.includes('성찰 질문'));
  assert.ok(prompt.includes('해석 경계'));
  assert.ok(prompt.includes('+09:00') && prompt.includes('교차 매트릭스'));
  assert.doesNotMatch(prompt, /"[^"]{10,}"/);

  const decision = calculateTamilThirukkuralAramPorulKamam(profile, '창업을 시작해도 될까요');
  assert.equal(decision.questionTopic, 'decision');
  assert.ok(decision.situationalThirukkuralAudit.chapterReference.includes('포룰'));
});

test('reworked Heidegger engine exposes qualitative stages instead of raw scores', () => {
  const rep = calculateMartinHeideggerBeingAndTime(profile as any, '이직 시기를 고민하고 있어요', new Date('2026-11-14T00:00:00Z'));
  assert.equal(rep.engineVersion, GERMAN_MARTIN_HEIDEGGER_VERSION);
  assert.equal(rep.questionTopic, 'decision');
  assert.ok(rep.temporalAugenblickRhythm.clarityStageKo.length > 0);
  assert.ok(rep.dailyPracticeRitual.length > 0 && rep.reflectiveQuestion.length > 0 && rep.interpretiveBoundary.length > 0);
  const prompt = formatMartinHeideggerBeingAndTimePrompt(rep);
  assert.ok(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
  assert.ok(prompt.includes('일상 실천 의례'));
  assert.ok(prompt.includes('해석 경계'));
  assert.ok(prompt.includes(rep.temporalAugenblickRhythm.clarityStageKo));
});

test('reworked Rumi engine takes the question and KST rhythm without exposing raw scores', () => {
  const rep = calculateRumiMasnaviDivineLove(profile, '상처가 아직 아파요', new Date('2026-11-14T21:00:00Z'));
  assert.equal(rep.engineVersion, RUMI_MASNAVI_SUFI_VERSION);
  assert.ok(rep.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(rep.rumiSynthesisMatrix?.integratedAction));
  assert.equal(rep.questionTopic, 'healing');
  assert.ok(rep.temporalSamaRhythm.kstWindow.includes('새벽'));
  assert.ok(rep.dailyPracticeRitual.length > 0 && rep.reflectiveQuestion.length > 0 && rep.interpretiveBoundary.length > 0);
  const prompt = formatRumiMasnaviDivineLovePrompt(rep);
  assert.ok(!prompt.includes('/100') && !prompt.includes('%') && !prompt.includes('점수'));
  assert.ok(prompt.includes('KST 시공간 리듬'));
  assert.ok(prompt.includes('오늘의 실천 의례'));
  assert.ok(prompt.includes('+09:00') && prompt.includes('교차 매트릭스'));
  assert.ok(prompt.includes(rep.activeSpiritualStation.stationNameKo));
});

test('Socratic, Spinoza, and Kierkegaard v2.1.0 engines expose qualitative stages and KST without /100 or %', () => {
  const now = new Date('2026-11-15T12:40:00Z');
  const socrates = calculateSocraticMaieuticDaimon(profile, '이직과 선택 앞에서 무엇을 물어야 할까요?', now);
  assert.equal(socrates.engineVersion, 'LUCKEY-SOCRATIC-MAIEUTIC-DAIMON-v2.1.0');
  assert.ok(socrates.dailyPracticeRitual.length > 0 && socrates.reflectiveQuestion.length > 0 && socrates.interpretiveBoundary.length > 0);
  const socratesPrompt = formatSocraticMaieuticDaimonPrompt(socrates);
  assert.ok(!socratesPrompt.includes('/100') && !socratesPrompt.includes('%'));
  assert.ok(socratesPrompt.includes('해석 경계') && socratesPrompt.includes('+09:00'));

  const spinoza = calculateBaruchSpinozaEthicaConatus(profile, now, '상대방과의 갈등으로 마음이 무거워요');
  assert.equal(spinoza.engineVersion, 'LUCKEY-SPINOZA-CONATUS-AMORDEI-v2.1.0');
  assert.ok(spinoza.calculatedAtKst.endsWith('+09:00'));
  const spinozaPrompt = formatBaruchSpinozaEthicaConatusPrompt(spinoza);
  assert.ok(!spinozaPrompt.includes('/100') && !spinozaPrompt.includes('%'));
  assert.ok(spinozaPrompt.includes('에티카 매트릭스') && spinozaPrompt.includes('+09:00'));

  const kierkegaard = calculateKierkegaardStagesOfLife(profile, '불안 앞에서 단독자로서 어떻게 결단할까요?', now);
  assert.equal(kierkegaard.engineVersion, 'LUCKEY-KIERKEGAARD-STAGES-OF-LIFE-v2.1.0');
  assert.ok(kierkegaard.dailyPracticeRitual.length > 0 && kierkegaard.interpretiveBoundary.length > 0);
  const kierkegaardPrompt = formatKierkegaardStagesOfLifePrompt(kierkegaard);
  assert.ok(!kierkegaardPrompt.includes('/100') && !kierkegaardPrompt.includes('%'));
  assert.ok(kierkegaardPrompt.includes('일상 실천 의례') && kierkegaardPrompt.includes('해석 경계'));
});

test('Seneca, Cicero, and Marcus Aurelius v2.1.0 engines expose qualitative stages and KST without /100 or %', () => {
  const now = new Date('2026-11-15T18:40:00Z');
  const seneca = calculateSenecaTimeSovereignty(profile, '이직 결정을 계속 미루고만 있어서 불안해요', now);
  assert.equal(seneca.engineVersion, SENECA_TIME_SOVEREIGNTY_VERSION);
  assert.ok(seneca.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(seneca.senecaSynthesisMatrix?.integratedAction));
  assert.ok(seneca.dailyPracticeRitual.length > 0 && seneca.reflectiveQuestion.length > 0 && seneca.interpretiveBoundary.length > 0);
  const senecaPrompt = formatSenecaTimeSovereigntyPrompt(seneca);
  assert.ok(!senecaPrompt.includes('/100') && !senecaPrompt.includes('%'));
  assert.ok(senecaPrompt.includes('오늘의 실천 의례') && senecaPrompt.includes('해석 경계') && senecaPrompt.includes('+09:00') && senecaPrompt.includes('교차 매트릭스'));

  const cicero = calculateCiceroDeOfficiis(profile, '계약 조건과 신뢰 사이에서 어떤 선택이 옳을까요?', now);
  assert.equal(cicero.engineVersion, CICERO_DE_OFFICIIS_VERSION);
  assert.ok(cicero.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(cicero.ciceroSynthesisMatrix?.integratedAction));
  assert.ok(cicero.dailyPracticeRitual.length > 0 && cicero.reflectiveQuestion.length > 0 && cicero.interpretiveBoundary.length > 0);
  const ciceroPrompt = formatCiceroDeOfficiisPrompt(cicero);
  assert.ok(!ciceroPrompt.includes('/100') && !ciceroPrompt.includes('%'));
  assert.ok(ciceroPrompt.includes('오늘의 실천 의례') && ciceroPrompt.includes('해석 경계') && ciceroPrompt.includes('+09:00') && ciceroPrompt.includes('교차 매트릭스'));

  const aurelius = calculateMarcusAureliusMeditationsCitadel(profile, '타인의 비난 때문에 마음이 흔들려요', now);
  assert.equal(aurelius.engineVersion, ROMAN_MARCUS_AURELIUS_VERSION);
  assert.ok(aurelius.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(aurelius.marcusSynthesisMatrix?.integratedAction));
  assert.ok(aurelius.dailyPracticeRitual.length > 0 && aurelius.reflectiveQuestion.length > 0 && aurelius.interpretiveBoundary.length > 0);
  const aureliusPrompt = formatMarcusAureliusMeditationsCitadelPrompt(aurelius);
  assert.ok(!aureliusPrompt.includes('/100') && !aureliusPrompt.includes('%'));
  assert.ok(aureliusPrompt.includes('오늘의 실천 의례') && aureliusPrompt.includes('해석 경계') && aureliusPrompt.includes('+09:00') && aureliusPrompt.includes('교차 매트릭스'));
});

test('Schopenhauer v2.1.0, Mandukya Turiya v2.0.0, and Zhuangzi v2.0.0 engines output qualitative stages and KST without /100 or %', () => {
  const now = new Date('2026-11-15T23:35:00Z');
  const schopenhauer = calculateSchopenhauerWillRepresentation(profile, '관계에서 자꾸 상처받고 집착하게 돼요', now);
  assert.equal(schopenhauer.engineVersion, 'LUCKEY-SCHOPENHAUER-WILL-REPRESENTATION-v2.1.0');
  assert.ok(schopenhauer.calculatedAtKst.endsWith('+09:00'));
  const schopenhauerPrompt = formatSchopenhauerWillRepresentationPrompt(schopenhauer);
  assert.ok(!schopenhauerPrompt.includes('/100') && !schopenhauerPrompt.includes('%'));
  assert.ok(schopenhauerPrompt.includes('해석 경계') && schopenhauerPrompt.includes('+09:00'));

  const mandukya = calculateVedicMandukyaTuriya({ profile, question: '수면이 불안하고 마음이 자꾸 흔들려요', now });
  assert.equal(mandukya.engineVersion, VEDIC_MANDUKYA_TURIYA_ENGINE_VERSION);
  assert.ok(mandukya.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(mandukya.mandukyaSynthesisMatrix?.integratedAction));
  assert.ok(mandukya.dailyPracticeRitual.length > 0 && mandukya.reflectiveQuestion.length > 0 && mandukya.interpretiveBoundary.length > 0);
  const mandukyaPrompt = formatVedicMandukyaTuriyaPrompt(mandukya);
  assert.ok(!mandukyaPrompt.includes('/100') && !mandukyaPrompt.includes('%'));
  assert.ok(mandukyaPrompt.includes('일상 관조 실천') && mandukyaPrompt.includes('해석 경계') && mandukyaPrompt.includes('+09:00') && mandukyaPrompt.includes('교차 매트릭스'));

  const zhuangzi = calculateZhuangziXiaoyaoyouButterfly({ profile, question: '진로 선택 앞에서 남들 시선이 자꾸 신경 쓰여요', now });
  assert.equal(zhuangzi.engineVersion, ZHUANGZI_XIAOYAOYOU_BUTTERFLY_ENGINE_VERSION);
  assert.ok(zhuangzi.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(zhuangzi.zhuangziSynthesisMatrix?.integratedAction));
  assert.ok(zhuangzi.dailyPracticeRitual.length > 0 && zhuangzi.reflectiveQuestion.length > 0 && zhuangzi.interpretiveBoundary.length > 0);
  const zhuangziPrompt = formatZhuangziXiaoyaoyouButterflyPrompt(zhuangzi);
  assert.ok(!zhuangziPrompt.includes('/100') && !zhuangziPrompt.includes('%'));
  assert.ok(zhuangziPrompt.includes('일상 관조 실천') && zhuangziPrompt.includes('해석 경계') && zhuangziPrompt.includes('+09:00') && zhuangziPrompt.includes('교차 매트릭스'));
});

test('Ziwei HuaJi v2.1.0, Zoroastrian Asha v2.0.0, and Yoruba Ifa Odu v2.1.0 output qualitative stages and KST without /100 or %', () => {
  const now = new Date('2026-11-15T23:54:00Z');
  const huaji = calculateZiweiHuaJiTransformation(profile, now, '일과 커리어에서 자꾸 막히는 느낌이 들어요');
  assert.equal(huaji.engineVersion, ZIWEI_HUAJI_VERSION);
  assert.ok(huaji.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(huaji.huajiSynthesisMatrix?.integratedAction));
  const huajiPrompt = formatZiweiHuaJiTransformationPrompt(huaji);
  assert.ok(!huajiPrompt.includes('/100') && !huajiPrompt.includes('%') && !huajiPrompt.includes('점 /'));
  assert.ok(huajiPrompt.includes('해석 경계') && huajiPrompt.includes('+09:00') && huajiPrompt.includes('교차 매트릭스'));

  const asha = calculateZoroastrianAshaTruth({ profile, contextText: '관계에서 솔직하게 말해야 할지 고민돼요', now });
  assert.equal(asha.engineVersion, ZOROASTRIAN_ASHA_VERSION);
  assert.ok(asha.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(asha.ashaSynthesisMatrix?.integratedAction));
  const ashaPrompt = formatZoroastrianAshaTruthPrompt(asha);
  assert.ok(!ashaPrompt.includes('/100') && !ashaPrompt.includes('%') && !ashaPrompt.includes('점 /'));
  assert.ok(ashaPrompt.includes('해석 경계') && ashaPrompt.includes('+09:00') && ashaPrompt.includes('교차 매트릭스'));

  const ifa = calculateYorubaIfaOdu({ profile, targetDate: now, question: '새로운 선택 앞에서 어떤 태도를 가져야 할까요?' });
  assert.equal(ifa.engineVersion, YORUBA_IFA_ODU_ENGINE_VERSION);
  assert.ok(ifa.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(ifa.ifaSynthesisMatrix?.integratedAction));
  const ifaPrompt = formatYorubaIfaOduPrompt(ifa);
  assert.ok(!ifaPrompt.includes('/100') && !ifaPrompt.includes('%'));
  assert.ok(ifaPrompt.includes('해석 경계') && ifaPrompt.includes('+09:00') && ifaPrompt.includes('교차 매트릭스'));
});

test('Epicurus, Heraclitus, and Laozi v2.1.0 output qualitative stages and KST without /100 or %', () => {
  const now = new Date('2026-11-16T00:05:00Z');
  const ep = calculateEpicureanTetrapharmakos(profile, '미래에 대한 불안 때문에 마음이 조급해요', now);
  assert.equal(ep.engineVersion, EPICUREAN_TETRAPHARMAKOS_VERSION);
  assert.ok(ep.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(ep.epicureanSynthesisMatrix?.integratedAction));
  const epPrompt = formatEpicureanTetrapharmakosPrompt(ep);
  assert.ok(!epPrompt.includes('/100') && !epPrompt.includes('%'));
  assert.ok(epPrompt.includes('해석 경계') && epPrompt.includes('+09:00') && epPrompt.includes('교차 매트릭스'));

  const he = calculateHeraclitusPantaRhei(profile, '변화의 갈림길에서 중심을 잡고 싶어요', now);
  assert.equal(he.engineVersion, HERACLITUS_PANTA_RHEI_VERSION);
  assert.ok(he.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(he.heraclitusSynthesisMatrix?.integratedAction));
  const hePrompt = formatHeraclitusPantaRheiPrompt(he);
  assert.ok(!hePrompt.includes('/100') && !hePrompt.includes('%'));
  assert.ok(hePrompt.includes('해석 경계') && hePrompt.includes('+09:00') && hePrompt.includes('교차 매트릭스'));

  const la = calculateLaoziDaodejing(profile, '억지로 애쓰기보다 순리에 맞추고 싶어요', now);
  assert.equal(la.engineVersion, LAOZI_DAODEJING_VERSION);
  assert.ok(la.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(la.laoziSynthesisMatrix?.integratedAction));
  const laPrompt = formatLaoziDaodejingPrompt(la);
  assert.ok(!laPrompt.includes('/100') && !laPrompt.includes('%'));
  assert.ok(laPrompt.includes('해석 경계') && laPrompt.includes('+09:00') && laPrompt.includes('교차 매트릭스'));
});

test('Wonhyo, Aurelius Inner Citadel, and Vedic Pancha Kosha v2.1.0 output qualitative stages and KST without /100 or %', () => {
  const now = new Date('2026-11-16T00:15:00Z');
  const wo = calculateWonhyoHwajaeng(profile, '서로 다른 의견 사이에서 마음을 모으고 싶어요', now);
  assert.equal(wo.engineVersion, WONHYO_HWAJAENG_VERSION);
  assert.ok(wo.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(wo.wonhyoSynthesisMatrix?.integratedAction));
  const woPrompt = formatWonhyoHwajaengPrompt(wo);
  assert.ok(!woPrompt.includes('/100') && !woPrompt.includes('%') && !woPrompt.includes('점 '));
  assert.ok(woPrompt.includes('해석 경계') && woPrompt.includes('+09:00') && woPrompt.includes('교차 매트릭스'));

  const au = calculateAureliusInnerCitadel(profile, '외부 평가에 흔들리지 않고 중심을 지키고 싶어요', now);
  assert.equal(au.engineVersion, AURELIUS_INNER_CITADEL_VERSION);
  assert.ok(au.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(au.aureliusSynthesisMatrix?.integratedAction));
  const auPrompt = formatAureliusInnerCitadelPrompt(au);
  assert.ok(!auPrompt.includes('/100') && !auPrompt.includes('%'));
  assert.ok(auPrompt.includes('해석 경계') && auPrompt.includes('+09:00') && auPrompt.includes('교차 매트릭스'));

  const pk = calculateVedicPanchaKosha({ profile, question: '몸과 마음이 지쳐 호흡이 얕아진 느낌이에요', now });
  assert.equal(pk.engineVersion, VEDIC_PANCHA_KOSHA_ENGINE_VERSION);
  assert.ok(pk.calculatedAtKst.endsWith('+09:00'));
  assert.ok(Boolean(pk.panchaKoshaSynthesisMatrix?.integratedAction));
  const pkPrompt = formatVedicPanchaKoshaPrompt(pk);
  assert.ok(!pkPrompt.includes('/100') && !pkPrompt.includes('%') && !pkPrompt.includes('점)'));
  assert.ok(pkPrompt.includes('해석 경계') && pkPrompt.includes('+09:00') && pkPrompt.includes('교차 매트릭스'));
});

test('Akashic Records, Alchemical Transmutation, and Baopuzi Elixirs v2.1.0 include KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T00:25:00Z');
  const ak = calculateAkashicRecordsOracle({ profile, targetDate: now, question: '이직과 소명 사이에서 고민돼요' });
  assert.equal(ak.engineVersion, AKASHIC_RECORDS_VERSION);
  assert.ok(ak.calculatedAtKst.endsWith('+09:00'));
  const akPrompt = formatAkashicRecordsOraclePrompt(ak);
  assert.ok(akPrompt.includes('해석 경계') && akPrompt.includes('+09:00'));

  const al = calculateAlchemicalTransmutation(profile, now, '반복되는 시련의 의미를 알고 싶어요');
  assert.equal(al.engineVersion, ALCHEMICAL_TRANSMUTATION_VERSION);
  assert.ok(al.calculatedAtKst.endsWith('+09:00'));
  const alPrompt = formatAlchemicalTransmutationPrompt(al);
  assert.ok(alPrompt.includes('해석 경계') && alPrompt.includes('+09:00'));

  const ba = calculateBaopuziElixirs({ profile, question: '몸이 무겁고 기력이 부족해요', now });
  assert.equal(ba.engineVersion, BAOPUZI_ELIXIRS_ENGINE_VERSION);
  assert.ok(ba.calculatedAtKst.endsWith('+09:00'));
  const baPrompt = formatBaopuziElixirsPrompt(ba);
  assert.ok(baPrompt.includes('해석 경계') && baPrompt.includes('+09:00'));
});

test('Ayurveda, Gnostic Pistis Sophia, and Hermetic Kybalion v2.1.0 include KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T00:35:00Z');
  const ay = calculateAyurvedicTridoshaPrana({ profile, targetDate: now, question: '피로가 쌓이고 잠이 얕아요' });
  assert.equal(ay.engineVersion, AYURVEDIC_TRIDOSHA_VERSION);
  assert.ok(ay.calculatedAtKst.endsWith('+09:00'));
  const ayPrompt = formatAyurvedicTridoshaPranaPrompt(ay);
  assert.ok(ayPrompt.includes('해석 경계') && ayPrompt.includes('+09:00'));

  const gn = calculateGnosticPistisSophiaPleroma({ profile, question: '혼란 속에서 중심을 잡고 싶어요', now });
  assert.equal(gn.engineVersion, GNOSTIC_PISTIS_SOPHIA_PLEROMA_ENGINE_VERSION);
  assert.ok(gn.calculatedAtKst.endsWith('+09:00'));
  const gnPrompt = formatGnosticPistisSophiaPleromaPrompt(gn);
  assert.ok(gnPrompt.includes('해석 경계') && gnPrompt.includes('+09:00'));

  const ky = calculateHermeticKybalion(profile, now, '중요한 결정을 앞두고 마음이 흔들려요');
  assert.equal(ky.engineVersion, HERMETIC_KYBALION_VERSION);
  assert.ok(ky.calculatedAtKst.endsWith('+09:00'));
  const kyPrompt = formatHermeticKybalionPrompt(ky);
  assert.ok(kyPrompt.includes('해석 경계') && kyPrompt.includes('+09:00'));
});

test('Hermetic Poimandres, Hermann Hesse, and Han Yong-un v2.1.0 include KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T00:45:00Z');
  const po = calculateHermeticPoimandres({ profile, question: '일곱 천계의 정념을 내려놓고 싶어요', now });
  assert.equal(po.engineVersion, HERMETIC_POIMANDRES_ENGINE_VERSION);
  assert.ok(po.calculatedAtKst.endsWith('+09:00'));
  const poPrompt = formatHermeticPoimandresPrompt(po);
  assert.ok(poPrompt.includes('해석 경계') && poPrompt.includes('+09:00'));

  const he = calculateGermanHermannHesseDemianSteppenwolf('변화와 성장의 시기에 있어요', now);
  assert.equal(he.engineVersion, GERMAN_HERMANN_HESSE_DEMIAN_STEPPENWOLF_VERSION);
  assert.ok(he.calculatedAtKst.endsWith('+09:00'));
  const hePrompt = formatGermanHermannHesseDemianSteppenwolfPrompt(he);
  assert.ok(hePrompt.includes('해석 경계') && hePrompt.includes('+09:00'));

  const hy = calculateKoreanHanYongUnSilenceOfNim('이별의 아픔 속에서 희망을 찾고 싶어요', now);
  assert.equal(hy.engineVersion, KOREAN_HAN_YONG_UN_SILENCE_OF_NIM_VERSION);
  assert.ok(hy.calculatedAtKst.endsWith('+09:00'));
  const hyPrompt = formatKoreanHanYongUnSilenceOfNimPrompt(hy);
  assert.ok(hyPrompt.includes('해석 경계') && hyPrompt.includes('+09:00'));
});

test('James Joyce, Babylonian Enuma Elish, and Buddhist Yogacara v2.1.0 include KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T00:55:00Z');
  const jj = calculateIrishJamesJoyceUlyssesEpiphany('일상의 작은 순간을 살피고 싶어요', now);
  assert.equal(jj.engineVersion, IRISH_JAMES_JOYCE_ULYSSES_EPIPHANY_VERSION);
  assert.ok(jj.calculatedAtKst.endsWith('+09:00'));
  const jjPrompt = formatIrishJamesJoyceUlyssesEpiphanyPrompt(jj);
  assert.ok(jjPrompt.includes('해석 경계') && jjPrompt.includes('+09:00'));

  const ba = calculateBabylonianEnumaElish(profile, now, '혼돈을 정리하고 결단을 내리고 싶어요');
  assert.equal(ba.engineVersion, BABYLONIAN_ENUMA_ELISH_VERSION);
  assert.ok(ba.calculatedAtKst.endsWith('+09:00'));
  const baPrompt = formatBabylonianEnumaElishPrompt(ba);
  assert.ok(baPrompt.includes('해석 경계') && baPrompt.includes('+09:00'));

  const yo = calculateBuddhistYogacaraConsciousness({ profile, question: '마음의 분별과 집착을 내려놓고 싶어요', now });
  assert.equal(yo.engineVersion, BUDDHIST_YOGACARA_CONSCIOUSNESS_ENGINE_VERSION);
  assert.ok(yo.calculatedAtKst.endsWith('+09:00'));
  const yoPrompt = formatBuddhistYogacaraConsciousnessPrompt(yo);
  assert.ok(yoPrompt.includes('해석 경계') && yoPrompt.includes('+09:00'));
});

test('Yarrow I Ching, Ptah Memphite, and Delphic Chilon v2.1.0 include +09:00 KST, interpretive boundary, and no score leaks', () => {
  const now = new Date('2026-11-16T02:25:00Z');
  const yr = calculateAncientYarrowProbability({ profile, question: '결정 앞에서 시중의 때를 가늠하고 싶어요', now });
  assert.equal(yr.engineVersion, ANCIENT_YARROW_PROBABILITY_ENGINE_VERSION);
  assert.ok(yr.calculatedAtKst.includes('+09:00'));
  const yrPrompt = formatAncientYarrowProbabilityPrompt(yr);
  assert.ok(yrPrompt.includes('해석 경계') && yrPrompt.includes('+09:00') && !yrPrompt.includes('실측 데이터'));

  const pt = calculatePtahMemphite(profile, '새 프로젝트를 구상하고 현실로 구현하고 싶습니다', now);
  assert.equal(pt.engineVersion, PTAH_MEMPHITE_VERSION);
  assert.ok(pt.calculatedAtKst.includes('+09:00'));
  const ptPrompt = formatPtahMemphitePrompt(pt);
  assert.ok(ptPrompt.includes('해석 경계') && ptPrompt.includes('+09:00'));

  const ch = calculateDelphicChilon(profile, '중요한 약속과 결정을 앞두고 조심스럽습니다', now);
  assert.equal(ch.engineVersion, DELPHIC_CHILON_VERSION);
  assert.ok(ch.calculatedAtKst.includes('+09:00'));
  const chPrompt = formatDelphicChilonPrompt(ch);
  assert.ok(chPrompt.includes('해석 경계') && chPrompt.includes('+09:00'));
});

test('Eleusinian Triptolemos, Zoroastrian Amesha Spentas, and Egyptian Amduat v2.1.0 include +09:00 KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T02:35:00Z');
  const tr = calculateEleusinianTriptolemos(profile, '새로운 일을 시작하며 좋은 씨앗을 뿌리고 싶습니다', now);
  assert.equal(tr.engineVersion, ELEUSINIAN_TRIPTOLEMOS_VERSION);
  assert.ok(tr.calculatedAtKst.includes('+09:00'));
  const trPrompt = formatEleusinianTriptolemosPrompt(tr);
  assert.ok(trPrompt.includes('해석 경계') && trPrompt.includes('+09:00'));

  const am = calculateZoroastrianAmeshaSpentas(profile, '갈등 상황에서 올바른 선택을 하고 싶습니다', now);
  assert.equal(am.engineVersion, ZOROASTRIAN_AMESHA_SPENTAS_VERSION);
  assert.ok(am.calculatedAtKst.includes('+09:00'));
  const amPrompt = formatZoroastrianAmeshaSpentasPrompt(am);
  assert.ok(amPrompt.includes('해석 경계') && amPrompt.includes('+09:00'));

  const ad = calculateEgyptianAmduat(profile, now, '밤을 건너 새 출발을 준비하고 싶어요');
  assert.equal(ad.engineVersion, EGYPTIAN_AMDUAT_VERSION);
  assert.ok(ad.calculatedAtKst.includes('+09:00'));
  const adPrompt = formatEgyptianAmduatPrompt(ad);
  assert.ok(adPrompt.includes('해석 경계') && adPrompt.includes('+09:00'));
});

test('Delphic Maxims, Egyptian Maat Feather Heart, and Egyptian Sphinx Dream Oracle v2.1.0 include +09:00 KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T02:45:00Z');
  const dm = calculateDelphicMaximsOracle({ profile, targetDate: now, question: '결정과 약속의 기준' });
  assert.equal(dm.engineVersion, DELPHIC_MAXIMS_VERSION);
  assert.ok(dm.calculatedAtKst.includes('+09:00'));
  const dmPrompt = formatDelphicMaximsOraclePrompt(dm);
  assert.ok(dmPrompt.includes('해석 경계') && dmPrompt.includes('+09:00'));

  const mt = calculateEgyptianMaatFeatherHeart({ profile, now, question: '이직 결정을 앞두고 마음이 무거워요' });
  assert.equal(mt.engineVersion, EGYPTIAN_MAAT_FEATHER_ENGINE_VERSION);
  assert.ok(mt.calculatedAtKst.includes('+09:00'));
  const mtPrompt = formatEgyptianMaatFeatherHeartPrompt(mt);
  assert.ok(mtPrompt.includes('해석 경계') && mtPrompt.includes('+09:00') && !mtPrompt.includes('실측 데이터'));

  const sx = calculateEgyptianSphinxDreamOracle({ profile, now, question: '사소한 잡무와 불안을 걷어내고 싶습니다' });
  assert.equal(sx.engineVersion, EGYPTIAN_SPHINX_DREAM_ORACLE_ENGINE_VERSION);
  assert.ok(sx.calculatedAtKst.includes('+09:00'));
  const sxPrompt = formatEgyptianSphinxDreamOraclePrompt(sx);
  assert.ok(sxPrompt.includes('해석 경계') && sxPrompt.includes('+09:00') && !sxPrompt.includes('실측 데이터'));
});

test('Egyptian 36 Decans, Etruscan Augur, and Finnish Kalevala Sampo v2.1.0 include +09:00 KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T02:55:00Z');
  const dc = calculateEgyptianThirtySixDecans({ profile, targetDate: now, question: '오늘 천구 항해 방향이 궁금해요' });
  assert.equal(dc.engineVersion, EGYPTIAN_DECANS_VERSION);
  assert.ok(dc.calculatedAtKst.includes('+09:00'));
  const dcPrompt = formatEgyptianThirtySixDecansPrompt(dc);
  assert.ok(dcPrompt.includes('해석 경계') && dcPrompt.includes('+09:00'));

  const et = calculateEtruscanAugurSixteenSky({ profile, now, question: '중요한 결정의 타이밍을 살피고 싶습니다' });
  assert.equal(et.engineVersion, ETRUSCAN_AUGUR_ENGINE_VERSION);
  assert.ok(et.calculatedAtKst.includes('+09:00'));
  const etPrompt = formatEtruscanAugurSixteenSkyPrompt(et);
  assert.ok(etPrompt.includes('해석 경계') && etPrompt.includes('+09:00') && !etPrompt.includes('실측 리포트'));

  const fk = calculateFinnishKalevalaSampo({ profile, targetInstantTime: now.toISOString(), question: '지치지 않고 끝까지 해내고 싶어요' });
  assert.equal(fk.engineVersion, FINNISH_KALEVALA_SAMPO_ENGINE_VERSION);
  assert.ok(fk.calculatedAtKst.includes('+09:00'));
  const fkPrompt = formatFinnishKalevalaSampoPrompt(fk);
  assert.ok(fkPrompt.includes('해석 경계') && fkPrompt.includes('+09:00') && !fkPrompt.includes('실측 데이터'));
});

test('Marcel Proust, Montesquieu, and Paul Ricoeur v2.1.0 include +09:00 KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T03:05:00Z');
  const pr = calculateFrenchMarcelProustLostTimeRegained(profile, '지나간 기억의 의미를 되찾고 싶어요', now);
  assert.equal(pr.engineVersion, FRENCH_MARCEL_PROUST_LOST_TIME_VERSION);
  assert.ok(pr.calculatedAtKst.includes('+09:00'));
  const prPrompt = formatFrenchMarcelProustLostTimeRegainedPrompt(pr);
  assert.ok(prPrompt.includes('해석 경계') && prPrompt.includes('+09:00'));

  const mn = calculateFrenchMontesquieuSpiritOfLaws(profile, '균형 있는 결정을 내리고 싶어요', now);
  assert.equal(mn.engineVersion, FRENCH_MONTESQUIEU_SPIRIT_OF_LAWS_VERSION);
  assert.ok(mn.calculatedAtKst.includes('+09:00'));
  const mnPrompt = formatFrenchMontesquieuSpiritOfLawsPrompt(mn);
  assert.ok(mnPrompt.includes('해석 경계') && mnPrompt.includes('+09:00'));

  const rc = calculateFrenchPaulRicoeurNarrativeIdentityHealing(profile, '상처받은 마음을 이야기로 풀어내고 싶어요', now);
  assert.equal(rc.engineVersion, FRENCH_PAUL_RICOEUR_NARRATIVE_IDENTITY_HEALING_VERSION);
  assert.ok(rc.calculatedAtKst.includes('+09:00'));
  const rcPrompt = formatFrenchPaulRicoeurNarrativeIdentityHealingPrompt(rc);
  assert.ok(rcPrompt.includes('해석 경계') && rcPrompt.includes('+09:00'));
});

test('Victor Hugo, Gaelic Wheel Fire Festivals, and Albert Schweitzer v2.1.0 include +09:00 KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T03:15:00Z');
  const hg = calculateFrenchVictorHugoLesMiserables(profile, '양심과 연대의 결단을 내리고 싶어요', now);
  assert.equal(hg.engineVersion, FRENCH_VICTOR_HUGO_LES_MISERABLES_VERSION);
  assert.ok(hg.calculatedAtKst.includes('+09:00'));
  const hgPrompt = formatFrenchVictorHugoLesMiserablesPrompt(hg);
  assert.ok(hgPrompt.includes('해석 경계') && hgPrompt.includes('+09:00'));

  const gw = calculateGaelicWheelFireFestivals(profile, now, '계절의 전환점에서 방향을 잡고 싶어요');
  assert.equal(gw.engineVersion, GAELIC_FIRE_FESTIVALS_ENGINE_VERSION);
  assert.ok(gw.calculatedAtKst.includes('+09:00'));
  const gwPrompt = formatGaelicWheelFireFestivalsPrompt(gw);
  assert.ok(gwPrompt.includes('해석 경계') && gwPrompt.includes('+09:00') && !gwPrompt.includes('실측 데이터'));

  const sc = calculateGermanAlbertSchweitzerReverenceForLife(profile, '타인과의 관계에서 따뜻함을 지키고 싶어요', now);
  assert.equal(sc.engineVersion, GERMAN_ALBERT_SCHWEITZER_VERSION);
  assert.ok(sc.calculatedAtKst.includes('+09:00'));
  const scPrompt = formatGermanAlbertSchweitzerReverenceForLifePrompt(sc);
  assert.ok(scPrompt.includes('해석 경계') && scPrompt.includes('+09:00'));
});

test('Edmund Husserl, Erich Fromm, and Friedrich Schiller v2.1.0 include +09:00 KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T03:25:00Z');
  const hs = calculateGermanEdmundHusserlPhenomenologicalReduction(profile, '편견을 내려놓고 본질을 보고 싶어요', now);
  assert.equal(hs.engineVersion, GERMAN_EDMUND_HUSSERL_PHENOMENOLOGY_VERSION);
  assert.ok(hs.calculatedAtKst.includes('+09:00'));
  const hsPrompt = formatGermanEdmundHusserlPhenomenologicalReductionPrompt(hs);
  assert.ok(hsPrompt.includes('해석 경계') && hsPrompt.includes('+09:00'));

  const fr = calculateGermanErichFrommArtOfLovingBeing(profile, '건강한 사랑과 자립의 균형을 잡고 싶어요', now);
  assert.equal(fr.engineVersion, GERMAN_ERICH_FROMM_VERSION);
  assert.ok(fr.calculatedAtKst.includes('+09:00'));
  const frPrompt = formatGermanErichFrommArtOfLovingBeingPrompt(fr);
  assert.ok(frPrompt.includes('해석 경계') && frPrompt.includes('+09:00'));

  const sh = calculateGermanFriedrichSchillerAestheticEducation(profile, '마음의 여유와 품격을 지키고 싶어요', now);
  assert.equal(sh.engineVersion, GERMAN_FRIEDRICH_SCHILLER_AESTHETIC_EDUCATION_VERSION);
  assert.ok(sh.calculatedAtKst.includes('+09:00'));
  const shPrompt = formatGermanFriedrichSchillerAestheticEducationPrompt(sh);
  assert.ok(shPrompt.includes('해석 경계') && shPrompt.includes('+09:00'));
});

test('Dostoevsky, Tolstoy, and Chekhov v2.1.0 deepen with dual-source thesis, reflection question, +09:00 KST and interpretive boundary', () => {
  const now = new Date('2026-11-16T04:00:00Z');
  const question = '가족과의 오랜 갈등을 어떻게 풀어야 할까요';

  const ds = calculateRussianFyodorDostoevskyKaramazovSoulCompassion(profile, question, now);
  assert.equal(ds.engineVersion, RUSSIAN_FYODOR_DOSTOEVSKY_KARAMAZOV_SOUL_COMPASSION_VERSION);
  assert.match(ds.engineVersion, /v2\.1\.0$/);
  assert.ok(ds.calculatedAtKst.includes('+09:00'));
  assert.ok(ds.secondaryDostoevskyAphorism);
  assert.notEqual(ds.secondaryDostoevskyAphorism?.aphorismKey, ds.focalDostoevskyAphorism.aphorismKey);
  assert.ok(ds.reflectiveDostoevskyQuestion.includes(ds.activeDostoevskyTheme.themeTitleKo));
  assert.ok(ds.reflectiveDostoevskyQuestion.includes(question));
  assert.ok(ds.interpretiveBoundary.includes('정성적'));
  const dsPrompt = formatRussianFyodorDostoevskyKaramazovSoulCompassionPrompt(ds);
  assert.ok(dsPrompt.includes('+09:00'));
  assert.ok(dsPrompt.includes('보조 원전 테제') && dsPrompt.includes(ds.secondaryDostoevskyAphorism!.aphorismKo));
  assert.ok(dsPrompt.includes('성찰 질문') && dsPrompt.includes('해석 경계'));

  const tl = calculateRussianLeoTolstoyCalendarOfWisdom(profile, question, now);
  assert.equal(tl.engineVersion, RUSSIAN_LEO_TOLSTOY_VERSION);
  assert.match(tl.engineVersion, /v2\.1\.0$/);
  assert.ok(tl.calculatedAtKst.includes('+09:00'));
  assert.ok(tl.secondaryTolstoyAphorism);
  assert.notEqual(tl.secondaryTolstoyAphorism?.aphorismKey, tl.focalTolstoyAphorism.aphorismKey);
  assert.ok(tl.reflectiveTolstoyQuestion.includes(tl.activeTolstoyTheme.themeTitleKo));
  assert.ok(tl.reflectiveTolstoyQuestion.includes(question));
  assert.ok(tl.interpretiveBoundary.includes('정성적'));
  const tlPrompt = formatRussianLeoTolstoyCalendarOfWisdomPrompt(tl);
  assert.ok(tlPrompt.includes('+09:00'));
  assert.ok(tlPrompt.includes('보조 원전 테제') && tlPrompt.includes(tl.secondaryTolstoyAphorism!.aphorismKo));
  assert.ok(tlPrompt.includes('성찰 질문') && tlPrompt.includes('해석 경계'));

  const ck = calculateRussianAntonChekhovQuietEnduranceCompassion(profile, question, now);
  assert.equal(ck.engineVersion, RUSSIAN_ANTON_CHEKHOV_QUIET_ENDURANCE_COMPASSION_VERSION);
  assert.match(ck.engineVersion, /v2\.1\.0$/);
  assert.ok(ck.calculatedAtKst.includes('+09:00'));
  assert.ok(ck.secondaryChekhovAphorism);
  assert.notEqual(ck.secondaryChekhovAphorism?.aphorismKey, ck.focalChekhovAphorism.aphorismKey);
  assert.ok(ck.reflectiveChekhovQuestion.includes(ck.activeChekhovTheme.themeTitleKo));
  assert.ok(ck.reflectiveChekhovQuestion.includes(question));
  assert.ok(ck.interpretiveBoundary.includes('정성적'));
  const ckPrompt = formatRussianAntonChekhovQuietEnduranceCompassionPrompt(ck);
  assert.ok(ckPrompt.includes('+09:00'));
  assert.ok(ckPrompt.includes('보조 원전 테제') && ckPrompt.includes(ck.secondaryChekhovAphorism!.aphorismKo));
  assert.ok(ckPrompt.includes('성찰 질문') && ckPrompt.includes('해석 경계'));
});

test('Dostoevsky, Tolstoy, and Chekhov designs stay qualitative without numeric exposure in prompt text', () => {
  const now = new Date('2026-11-16T04:00:00Z');
  const dsPrompt = formatRussianFyodorDostoevskyKaramazovSoulCompassionPrompt(
    calculateRussianFyodorDostoevskyKaramazovSoulCompassion(profile, '', now),
  );
  const tlPrompt = formatRussianLeoTolstoyCalendarOfWisdomPrompt(
    calculateRussianLeoTolstoyCalendarOfWisdom(profile, '', now),
  );
  const ckPrompt = formatRussianAntonChekhovQuietEnduranceCompassionPrompt(
    calculateRussianAntonChekhovQuietEnduranceCompassion(profile, '', now),
  );
  for (const prompt of [dsPrompt, tlPrompt, ckPrompt]) {
    const body = prompt
      .split('\n')
      .filter((line) => !line.startsWith('- 연산 시각'))
      .join('\n');
    assert.doesNotMatch(body, /\d+\s*점|\d+\s*%|점수\s*\d/);
  }
});

test('Montaigne, Leibniz, and Goethe v2.1.0 include +09:00 KST, secondary aphorism cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T03:45:00Z');
  const query = '새로운 도전 앞에서 흔들리지 않는 기준을 잡고 싶습니다';

  const mt = calculateFrenchMichelDeMontaigneEssays(profile, query, now);
  assert.equal(mt.engineVersion, FRENCH_MICHEL_DE_MONTAIGNE_VERSION);
  assert.match(mt.calculatedAtKst, /\+09:00/);
  assert.notEqual(mt.secondaryMontaigneAphorism.aphorismKey, mt.focalMontaigneAphorism.aphorismKey);
  assert.ok(mt.reflectiveQuestion.includes(query));
  assert.ok(mt.interpretiveBoundary.includes('성찰'));
  const mtPrompt = formatFrenchMichelDeMontaigneEssaysPrompt(mt);
  assert.ok(mtPrompt.includes('+09:00') && mtPrompt.includes('보조 원전 테제') && mtPrompt.includes('성찰 질문') && mtPrompt.includes('해석 경계'));
  assert.doesNotMatch(mtPrompt.split('\n').filter((l) => !l.startsWith('- 엔진 버전')).join('\n'), /\d+\s*점|\d+\s*%|점수\s*\d/);

  const lb = calculateGottfriedLeibnizMonadologyHarmony(profile, query, now);
  assert.equal(lb.engineVersion, GERMAN_GOTTFRIED_LEIBNIZ_VERSION);
  assert.match(lb.calculatedAtKst, /\+09:00/);
  assert.notEqual(lb.secondaryLeibnizAphorism.aphorismKey, lb.focalLeibnizAphorism.aphorismKey);
  assert.ok(lb.reflectiveQuestion.includes(query));
  assert.ok(lb.interpretiveBoundary.includes('성찰'));
  const lbPrompt = formatGottfriedLeibnizMonadologyHarmonyPrompt(lb);
  assert.ok(lbPrompt.includes('+09:00') && lbPrompt.includes('보조 원전 테제') && lbPrompt.includes('성찰 질문') && lbPrompt.includes('해석 경계'));
  assert.doesNotMatch(lbPrompt.split('\n').filter((l) => !l.startsWith('- 엔진 버전')).join('\n'), /\d+\s*점|\d+\s*%|점수\s*\d/);

  const gt = calculateGermanJohannWolfgangGoetheFaustStriving(profile, query, now);
  assert.equal(gt.engineVersion, GERMAN_GOETHE_FAUST_VERSION);
  assert.match(gt.calculatedAtKst, /\+09:00/);
  assert.notEqual(gt.secondaryGoetheAphorism.aphorismKey, gt.focalGoetheAphorism.aphorismKey);
  assert.ok(gt.reflectiveQuestion.includes(query));
  assert.ok(gt.interpretiveBoundary.includes('성찰'));
  const gtPrompt = formatJohannWolfgangGoetheFaustStrivingPrompt(gt);
  assert.ok(gtPrompt.includes('+09:00') && gtPrompt.includes('보조 원전 테제') && gtPrompt.includes('성찰 질문') && gtPrompt.includes('해석 경계'));
  assert.doesNotMatch(gtPrompt.split('\n').filter((l) => !l.startsWith('- 엔진 버전')).join('\n'), /\d+\s*점|\d+\s*%|점수\s*\d/);
});

test('Habermas, Jaspers, and Benjamin v2.1.0 include +09:00 KST, secondary aphorism cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T03:55:00Z');
  const query = '복잡한 갈등 속에서도 진실한 대화와 나만의 기준을 세우고 싶습니다';

  const hb = calculateGermanJurgenHabermasCommunicativeAction(profile, query, now);
  assert.equal(hb.engineVersion, GERMAN_JURGEN_HABERMAS_COMMUNICATIVE_ACTION_VERSION);
  assert.match(hb.calculatedAtKst, /\+09:00/);
  assert.notEqual(hb.secondaryHabermasAphorism.aphorismKey, hb.focalHabermasAphorism.aphorismKey);
  assert.ok(hb.reflectiveQuestion.includes(query));
  assert.ok(hb.interpretiveBoundary.includes('성찰'));
  const hbPrompt = formatGermanJurgenHabermasCommunicativeActionPrompt(hb);
  assert.ok(hbPrompt.includes('+09:00') && hbPrompt.includes('보조 원전 테제') && hbPrompt.includes('성찰 질문') && hbPrompt.includes('해석 경계'));
  assert.doesNotMatch(hbPrompt.split('\n').filter((l) => !l.startsWith('- 엔진 버전')).join('\n'), /\d+\s*점|\d+\s*%|점수\s*\d/);

  const jp = calculateGermanKarlJaspersExistenzGrenzsituationen(profile, query, now);
  assert.equal(jp.engineVersion, GERMAN_KARL_JASPERS_VERSION);
  assert.match(jp.calculatedAtKst, /\+09:00/);
  assert.notEqual(jp.secondaryJaspersAphorism.aphorismKey, jp.focalJaspersAphorism.aphorismKey);
  assert.ok(jp.reflectiveQuestion.includes(query));
  assert.ok(jp.interpretiveBoundary.includes('성찰'));
  const jpPrompt = formatGermanKarlJaspersExistenzGrenzsituationenPrompt(jp);
  assert.ok(jpPrompt.includes('+09:00') && jpPrompt.includes('보조 원전 테제') && jpPrompt.includes('성찰 질문') && jpPrompt.includes('해석 경계'));
  assert.doesNotMatch(jpPrompt.split('\n').filter((l) => !l.startsWith('- 엔진 버전')).join('\n'), /\d+\s*점|\d+\s*%|점수\s*\d/);

  const bj = calculateGermanWalterBenjaminAuraNowTime(profile, query, now);
  assert.equal(bj.engineVersion, GERMAN_WALTER_BENJAMIN_AURA_NOWTIME_VERSION);
  assert.match(bj.calculatedAtKst, /\+09:00/);
  assert.notEqual(bj.secondaryBenjaminAphorism.aphorismKey, bj.focalBenjaminAphorism.aphorismKey);
  assert.ok(bj.reflectiveQuestion.includes(query));
  assert.ok(bj.interpretiveBoundary.includes('성찰'));
  const bjPrompt = formatGermanWalterBenjaminAuraNowTimePrompt(bj);
  assert.ok(bjPrompt.includes('+09:00') && bjPrompt.includes('보조 원전 테제') && bjPrompt.includes('성찰 질문') && bjPrompt.includes('해석 경계'));
  assert.doesNotMatch(bjPrompt.split('\n').filter((l) => !l.startsWith('- 엔진 버전')).join('\n'), /\d+\s*점|\d+\s*%|점수\s*\d/);
});

test('Adorno, Hawaiian Huna, and Kahuna Three Selves v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T04:05:00Z');
  const query = '복잡한 감정의 매듭을 풀고 나만의 중심을 지키고 싶습니다';

  const ad = calculateGermanTheodorAdornoNegativeDialecticsMinimaMoralia(profile, query, now);
  assert.equal(ad.engineVersion, GERMAN_THEODOR_ADORNO_NEGATIVE_DIALECTICS_VERSION);
  assert.match(ad.calculatedAtKst, /\+09:00/);
  assert.notEqual(ad.secondaryAdornoAphorism.aphorismKey, ad.focalAdornoAphorism.aphorismKey);
  assert.ok(ad.reflectiveQuestion.includes(query));
  assert.ok(ad.interpretiveBoundary.includes('성찰'));
  const adPrompt = formatGermanTheodorAdornoNegativeDialecticsMinimaMoraliaPrompt(ad);
  assert.ok(adPrompt.includes('+09:00') && adPrompt.includes('보조 원전 테제') && adPrompt.includes('성찰 질문') && adPrompt.includes('해석 경계'));

  const hu = calculateHawaiianHunaHooponopono({ profile, contextText: query });
  assert.equal(hu.engineVersion, HAWAIIAN_HUNA_VERSION);
  assert.match(hu.calculatedAtKst, /\+09:00/);
  assert.notEqual(hu.secondaryPrinciple.code, hu.activePrinciple.code);
  assert.ok(hu.hunaSynthesisMatrix.reflectiveQuestion.includes(query));
  assert.ok(hu.interpretiveBoundary.includes('성찰'));
  const huPrompt = formatHawaiianHunaHooponoponoPrompt(hu);
  assert.ok(huPrompt.includes('+09:00') && huPrompt.includes('보조 교차 원리') && huPrompt.includes('성찰 질문') && huPrompt.includes('해석 경계'));

  const kh = calculateHawaiianKahunaThreeSelves({ profile, question: query, now });
  assert.equal(kh.engineVersion, HAWAIIAN_KAHUNA_THREE_SELVES_ENGINE_VERSION);
  assert.match(kh.calculatedAtKst, /\+09:00/);
  assert.notEqual(kh.secondaryManaPikoState, kh.currentManaPikoState);
  assert.ok(kh.kahunaSynthesisMatrix.reflectiveQuestion.includes(query));
  assert.ok(kh.interpretiveBoundary.includes('성찰'));
  const khPrompt = formatHawaiianKahunaThreeSelvesPrompt(kh);
  assert.ok(khPrompt.includes('+09:00') && khPrompt.includes('보조 조율 축') && khPrompt.includes('성찰 질문') && khPrompt.includes('해석 경계'));
});

test('Egyptian Hermetic Cartouche, Essene Communion, and Greek Moirai v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T04:15:00Z');
  const query = '새로운 방향을 정하고 마음의 균형을 되찾고 싶습니다';

  const ca = calculateEgyptianHermeticCartouche(profile, now, query);
  assert.equal(ca.engineVersion, EGYPTIAN_HERMETIC_CARTOUCHE_ENGINE_VERSION);
  assert.match(ca.calculatedAtKst, /\+09:00/);
  assert.notEqual(ca.secondaryCartoucheName, ca.primaryCartoucheName);
  assert.ok(ca.hermeticSynthesisMatrix.reflectiveQuestion.includes(query));
  assert.ok(ca.interpretiveBoundary.includes('성찰'));
  const caPrompt = formatEgyptianHermeticCartouchePrompt(ca);
  assert.ok(caPrompt.includes('+09:00') && caPrompt.includes('보조 교차 카르투슈') && caPrompt.includes('성찰 질문') && caPrompt.includes('해석 경계'));

  const es = calculateEsseneCommunion(profile, now, query);
  assert.equal(es.engineVersion, ESSENE_COMMUNION_VERSION);
  assert.match(es.calculatedAtKst, /\+09:00/);
  assert.notEqual(es.secondaryEarthlyAngel.koreanName, es.morningEarthlyAngel.koreanName);
  assert.ok(es.esseneSynthesisMatrix.reflectiveQuestion.includes(query));
  assert.ok(es.interpretiveBoundary.includes('성찰'));
  const esPrompt = formatEsseneCommunionPrompt(es);
  assert.ok(esPrompt.includes('+09:00') && esPrompt.includes('보조 지상 교감 천사') && esPrompt.includes('성찰 질문') && esPrompt.includes('해석 경계'));

  const mo = calculateGreekMoiraiAnankeFate({ profile, question: query, now });
  assert.equal(mo.engineVersion, GREEK_MOIRAI_ANANKE_FATE_ENGINE_VERSION);
  assert.match(mo.calculatedAtKst, /\+09:00/);
  assert.ok(mo.secondaryGoddessNote.includes('보조 여신'));
  assert.ok(mo.moiraiSynthesisMatrix.reflectiveQuestion.includes(query));
  assert.ok(mo.interpretiveBoundary.includes('성찰'));
  const moPrompt = formatGreekMoiraiAnankeFatePrompt(mo);
  assert.ok(moPrompt.includes('+09:00') && moPrompt.includes('보조 여신') && moPrompt.includes('성찰 질문') && moPrompt.includes('해석 경계'));
});

test('Hindu Nadi Agastya, Sri Yantra, and Ikigai v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T04:25:00Z');
  const query = '내 일의 소명을 선명하게 세우고 균형을 잡고 싶습니다';

  const na = calculateHinduNadiAgastyaPalmLeaf({ profile, targetDate: now, question: query });
  assert.equal(na.engineVersion, HINDU_NADI_AGASTYA_PALM_LEAF_ENGINE_VERSION);
  assert.match(na.calculatedAtKst, /\+09:00/);
  assert.notEqual(na.secondaryKandamNumber, na.activeKandamNumber);
  assert.ok(na.reflectiveQuestion.includes(query));
  assert.ok(na.interpretiveBoundary.includes('성찰'));
  const naPrompt = formatHinduNadiAgastyaPalmLeafPrompt(na);
  assert.ok(naPrompt.includes('+09:00') && naPrompt.includes('보조 교차 칸담') && naPrompt.includes('성찰 질문') && naPrompt.includes('해석 경계'));

  const sy = calculateHinduSriYantraSacredGeometry(profile, now, query);
  assert.equal(sy.engineVersion, SRI_YANTRA_ENGINE_VERSION);
  assert.match(sy.calculatedAtKst, /\+09:00/);
  assert.notEqual(sy.secondaryAvaranaChakra.level, sy.primaryAvaranaChakra.level);
  assert.ok(sy.sriYantraSynthesisMatrix.reflectiveQuestion.includes(query));
  assert.ok(sy.interpretiveBoundary.includes('성찰'));
  const syPrompt = formatHinduSriYantraSacredGeometryPrompt(sy);
  assert.ok(syPrompt.includes('+09:00') && syPrompt.includes('보조 교차 회랑') && syPrompt.includes('성찰 질문') && syPrompt.includes('해석 경계'));

  const ik = calculateIkigaiDestinyCompass({ profile, targetDate: now, question: query });
  assert.equal(ik.engineVersion, IKIGAI_DESTINY_COMPASS_VERSION);
  assert.match(ik.calculatedAtKst, /\+09:00/);
  assert.ok(ik.reflectiveQuestion.includes(query));
  assert.ok(ik.interpretiveBoundary.includes('성찰'));
  const ikPrompt = formatIkigaiDestinyCompassPrompt(ik);
  assert.ok(ikPrompt.includes('+09:00') && ikPrompt.includes('성찰 질문') && ikPrompt.includes('해석 경계'));
});

test('Tagore Gitanjali, Upanishadic Tat Tvam Asi, and Dante Divine Comedy v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T04:35:00Z');
  const query = '두려움을 내려놓고 흔들리지 않는 내면의 길을 찾고 싶습니다';

  const tg = calculateIndianRabindranathTagoreGitanjali(profile, query, now);
  assert.equal(tg.engineVersion, INDIAN_TAGORE_GITANJALI_VERSION);
  assert.match(tg.calculatedAtKst, /\+09:00/);
  assert.notEqual(tg.secondaryTagoreAphorism.aphorismKey, tg.focalTagoreAphorism.aphorismKey);
  assert.ok(tg.reflectiveQuestion.includes(query));
  assert.ok(tg.interpretiveBoundary.includes('성찰'));
  const tgPrompt = formatIndianRabindranathTagoreGitanjaliPrompt(tg);
  assert.ok(tgPrompt.includes('+09:00') && tgPrompt.includes('보조 교차 명구') && tgPrompt.includes('성찰 질문') && tgPrompt.includes('해석 경계'));

  const up = calculateUpanishadicTatTvamAsi(profile, query, now);
  assert.equal(up.engineVersion, UPANISHADIC_TAT_TVAM_ASI_VERSION);
  assert.match(up.calculatedAtKst, /\+09:00/);
  assert.notEqual(up.secondaryMahavakya.vakyaKey, up.activeMahavakya.vakyaKey);
  assert.ok(up.reflectiveQuestion.includes(query));
  assert.ok(up.interpretiveBoundary.includes('명상'));
  const upPrompt = formatUpanishadicTatTvamAsiPrompt(up);
  assert.ok(upPrompt.includes('+09:00') && upPrompt.includes('보조 교차 대명제') && upPrompt.includes('성찰 질문') && upPrompt.includes('해석 경계'));

  const dn = calculateItalianDanteAlighieriDivineComedyAscent(profile, query, now);
  assert.equal(dn.engineVersion, ITALIAN_DANTE_COMEDY_VERSION);
  assert.match(dn.calculatedAtKst, /\+09:00/);
  assert.notEqual(dn.secondaryDanteAphorism.aphorismKey, dn.focalDanteAphorism.aphorismKey);
  assert.ok(dn.reflectiveQuestion.includes(query));
  assert.ok(dn.interpretiveBoundary.includes('성찰'));
  const dnPrompt = formatDanteAlighieriDivineComedyAscentPrompt(dn);
  assert.ok(dnPrompt.includes('+09:00') && dnPrompt.includes('보조 교차 경구') && dnPrompt.includes('성찰 질문') && dnPrompt.includes('해석 경계'));
});

test('Choe Chiwon Pungryudo, Chusa Sehando, and Dasan Mokmin Simseo v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T04:45:00Z');
  const query = '원칙을 지키면서도 유연하게 현실 문제를 풀고 싶습니다';

  const cc = calculateChoeChiwonPungryudo(profile, query, now);
  assert.equal(cc.engineVersion, KOREAN_CHOE_CHIWON_VERSION);
  assert.match(cc.calculatedAtKst, /\+09:00/);
  assert.notEqual(cc.secondaryChoeChiwonAphorism.aphorismKey, cc.focalChoeChiwonAphorism.aphorismKey);
  assert.ok(cc.reflectiveQuestion.includes(query));
  assert.ok(cc.interpretiveBoundary.includes('성찰'));
  const ccPrompt = formatChoeChiwonPungryudoPrompt(cc);
  assert.ok(ccPrompt.includes('+09:00') && ccPrompt.includes('보조 교차 명문') && ccPrompt.includes('성찰 질문') && ccPrompt.includes('해석 경계'));

  const cs = calculateChusaKimJeonghuiSehando(profile, query, now);
  assert.equal(cs.engineVersion, CHUSA_SEHANDO_WISDOM_VERSION);
  assert.match(cs.calculatedAtKst, /\+09:00/);
  assert.notEqual(cs.secondaryChusaMaxim.maximKey, cs.focalChusaMaxim.maximKey);
  assert.ok(cs.reflectiveQuestion.includes(query));
  assert.ok(cs.interpretiveBoundary.includes('성찰'));
  const csPrompt = formatChusaKimJeonghuiSehandoPrompt(cs);
  assert.ok(csPrompt.includes('+09:00') && csPrompt.includes('보조 교차 명훈') && csPrompt.includes('성찰 질문') && csPrompt.includes('해석 경계'));

  const ds = calculateDasanMokminSimseo(profile, query, now);
  assert.equal(ds.engineVersion, KOREAN_DASAN_MOKMIN_SIMSEO_VERSION);
  assert.match(ds.calculatedAtKst, /\+09:00/);
  assert.notEqual(ds.secondaryDasanAphorism.aphorismKey, ds.focalDasanAphorism.aphorismKey);
  assert.ok(ds.reflectiveQuestion.includes(query));
  assert.ok(ds.interpretiveBoundary.includes('성찰'));
  const dsPrompt = formatDasanMokminSimseoPrompt(ds);
  assert.ok(dsPrompt.includes('+09:00') && dsPrompt.includes('보조 교차 아포리즘') && dsPrompt.includes('성찰 질문') && dsPrompt.includes('해석 경계'));
});

test('Machiavelli Virtu Fortuna, Pico Dignity, and Thomas Aquinas Summa v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T04:55:00Z');
  const query = '불확실한 상황에서 주도권과 신의를 함께 지키고 싶습니다';

  const mv = calculateMachiavelliVirtuFortuna(profile, query, now);
  assert.equal(mv.engineVersion, ITALIAN_MACHIAVELLI_VERSION);
  assert.match(mv.calculatedAtKst, /\+09:00/);
  assert.notEqual(mv.secondaryMachiavelliAphorism.aphorismKey, mv.focalMachiavelliAphorism.aphorismKey);
  assert.ok(mv.reflectiveQuestion.includes(query));
  assert.ok(mv.interpretiveBoundary.includes('성찰'));
  const mvPrompt = formatMachiavelliVirtuFortunaPrompt(mv);
  assert.ok(mvPrompt.includes('+09:00') && mvPrompt.includes('보조 교차 경구') && mvPrompt.includes('성찰 질문') && mvPrompt.includes('해석 경계'));

  const pc = calculateItalianPicoDellaMirandolaDignity(profile, query, now);
  assert.equal(pc.engineVersion, ITALIAN_PICO_DELLA_MIRANDOLA_DIGNITY_VERSION);
  assert.match(pc.calculatedAtKst, /\+09:00/);
  assert.notEqual(pc.secondaryPicoAphorism.aphorismKey, pc.focalPicoAphorism.aphorismKey);
  assert.ok(pc.reflectiveQuestion.includes(query));
  assert.ok(pc.interpretiveBoundary.includes('성찰'));
  const pcPrompt = formatItalianPicoDellaMirandolaDignityPrompt(pc);
  assert.ok(pcPrompt.includes('+09:00') && pcPrompt.includes('보조 교차 명언') && pcPrompt.includes('성찰 질문') && pcPrompt.includes('해석 경계'));

  const aq = calculateThomasAquinasSummaTheologiae(profile, query, now);
  assert.equal(aq.engineVersion, ITALIAN_THOMAS_AQUINAS_VERSION);
  assert.match(aq.calculatedAtKst, /\+09:00/);
  assert.notEqual(aq.secondaryAquinasAphorism.aphorismKey, aq.focalAquinasAphorism.aphorismKey);
  assert.ok(aq.reflectiveQuestion.includes(query));
  assert.ok(aq.interpretiveBoundary.includes('성찰'));
  const aqPrompt = formatThomasAquinasSummaTheologiaePrompt(aq);
  assert.ok(aqPrompt.includes('+09:00') && aqPrompt.includes('보조 교차 경구') && aqPrompt.includes('성찰 질문') && aqPrompt.includes('해석 경계'));
});

test('Ahn Jung-geun, Baek Seok, and Baekbeom Kim Gu v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T05:05:00Z');
  const query = '흔들리지 않는 중심과 따뜻한 연대를 함께 세우고 싶습니다';

  const ag = calculateKoreanAhnJungGeunPeaceRighteousness(profile, query, now);
  assert.equal(ag.engineVersion, KOREAN_AHN_JUNG_GEUN_VERSION);
  assert.match(ag.calculatedAtKst, /\+09:00/);
  assert.notEqual(ag.secondaryAhnJungGeunAphorism.aphorismKey, ag.focalAhnJungGeunAphorism.aphorismKey);
  assert.ok(ag.reflectiveQuestion.includes(query));
  assert.ok(ag.interpretiveBoundary.includes('성찰'));
  const agPrompt = formatKoreanAhnJungGeunPeaceRighteousnessPrompt(ag);
  assert.ok(agPrompt.includes('+09:00') && agPrompt.includes('보조 교차 유묵') && agPrompt.includes('성찰 질문') && agPrompt.includes('해석 경계'));

  const bs = calculateKoreanBaekSeokDeerWhiteWallPoeticPurity(profile, query, now);
  assert.equal(bs.engineVersion, KOREAN_BAEK_SEOK_DEER_WHITE_WALL_POETIC_PURITY_VERSION);
  assert.match(bs.calculatedAtKst, /\+09:00/);
  assert.notEqual(bs.secondaryBaekSeokAphorism.aphorismKey, bs.focalBaekSeokAphorism.aphorismKey);
  assert.ok(bs.reflectiveQuestion.includes(query));
  assert.ok(bs.interpretiveBoundary.includes('성찰'));
  const bsPrompt = formatKoreanBaekSeokDeerWhiteWallPoeticPurityPrompt(bs);
  assert.ok(bsPrompt.includes('+09:00') && bsPrompt.includes('보조 교차 시구') && bsPrompt.includes('성찰 질문') && bsPrompt.includes('해석 경계'));

  const kg = calculateBaekbeomKimGuMyDesireCulture(profile, query, now);
  assert.equal(kg.engineVersion, KOREAN_BAEKBEOM_KIM_GU_VERSION);
  assert.match(kg.calculatedAtKst, /\+09:00/);
  assert.notEqual(kg.secondaryKimGuAphorism.aphorismKey, kg.focalKimGuAphorism.aphorismKey);
  assert.ok(kg.reflectiveQuestion.includes(query));
  assert.ok(kg.interpretiveBoundary.includes('성찰'));
  const kgPrompt = formatBaekbeomKimGuMyDesireCulturePrompt(kg);
  assert.ok(kgPrompt.includes('+09:00') && kgPrompt.includes('보조 교차 경구') && kgPrompt.includes('성찰 질문') && kgPrompt.includes('해석 경계'));
});

test('Choe Hangi Gihak, Danjae Shin Chae-ho, and Dosan Ahn Changho v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T05:15:00Z');
  const query = '흔들리지 않는 주체성과 성실한 실천으로 길을 열고 싶습니다';

  const ch = calculateChoeHangiGihakUnwha(profile, query, now);
  assert.equal(ch.engineVersion, CHOE_HANGI_GIHAK_UNWHA_VERSION);
  assert.match(ch.calculatedAtKst, /\+09:00/);
  assert.notEqual(ch.secondaryGihakPrinciple.principleKey, ch.activeGihakPrinciple.principleKey);
  assert.ok(ch.reflectiveQuestion.includes(query));
  assert.ok(ch.interpretiveBoundary.includes('성찰'));
  const chPrompt = formatChoeHangiGihakUnwhaPrompt(ch);
  assert.ok(chPrompt.includes('+09:00') && chPrompt.includes('보조 교차 원리') && chPrompt.includes('성찰 질문') && chPrompt.includes('해석 경계'));

  const dj = calculateKoreanDanjaeShinChaeHoJoseonSanggosa(profile, query, now);
  assert.equal(dj.engineVersion, KOREAN_DANJAE_SHIN_CHAE_HO_VERSION);
  assert.match(dj.calculatedAtKst, /\+09:00/);
  assert.notEqual(dj.secondaryDanjaeAphorism.aphorismKey, dj.focalDanjaeAphorism.aphorismKey);
  assert.ok(dj.reflectiveQuestion.includes(query));
  assert.ok(dj.interpretiveBoundary.includes('성찰'));
  const djPrompt = formatKoreanDanjaeShinChaeHoJoseonSanggosaPrompt(dj);
  assert.ok(djPrompt.includes('+09:00') && djPrompt.includes('보조 교차 명언') && djPrompt.includes('성찰 질문') && djPrompt.includes('해석 경계'));

  const ds = calculateDosanAhnChanghoMusilYeokhaeng(profile, query, now);
  assert.equal(ds.engineVersion, KOREAN_DOSAN_AHN_CHANGHO_VERSION);
  assert.match(ds.calculatedAtKst, /\+09:00/);
  assert.notEqual(ds.secondaryDosanAphorism.aphorismKey, ds.focalDosanAphorism.aphorismKey);
  assert.ok(ds.reflectiveQuestion.includes(query));
  assert.ok(ds.interpretiveBoundary.includes('성찰'));
  const dsPrompt = formatDosanAhnChanghoMusilYeokhaengPrompt(ds);
  assert.ok(dsPrompt.includes('+09:00') && dsPrompt.includes('보조 교차 경구') && dsPrompt.includes('성찰 질문') && dsPrompt.includes('해석 경계'));
});

test('Choe Hyeonbae Geulbon, Damheon Hong Dae-yong, and Gosan Yoon Seon-do v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T05:25:00Z');
  const query = '편견을 벗고 맑고 정직한 중심을 세우고 싶습니다';

  const ch = calculateChoeHyeonbaeGeulbon(profile, query, now);
  assert.equal(ch.engineVersion, CHOE_HYEONBAE_GEULBON_VERSION);
  assert.match(ch.calculatedAtKst, /\+09:00/);
  assert.notEqual(ch.secondaryOesolVirtue.koreanMotto, ch.primaryOesolVirtue.koreanMotto);
  assert.ok(ch.reflectiveQuestion.includes(query));
  assert.ok(ch.interpretiveBoundary.includes('성찰'));
  const chPrompt = formatChoeHyeonbaeGeulbonPrompt(ch);
  assert.ok(chPrompt.includes('+09:00') && chPrompt.includes('보조 교차 덕목') && chPrompt.includes('성찰 질문') && chPrompt.includes('해석 경계'));

  const hd = calculateKoreanDamheonHongDaeYongUisanMundap(profile, query, now);
  assert.equal(hd.engineVersion, KOREAN_DAMHEON_HONG_DAE_YONG_UISAN_MUNDAP_VERSION);
  assert.match(hd.calculatedAtKst, /\+09:00/);
  assert.notEqual(hd.secondaryHongDaeYongAphorism.aphorismKey, hd.focalHongDaeYongAphorism.aphorismKey);
  assert.ok(hd.reflectiveQuestion.includes(query));
  assert.ok(hd.interpretiveBoundary.includes('성찰'));
  const hdPrompt = formatKoreanDamheonHongDaeYongUisanMundapPrompt(hd);
  assert.ok(hdPrompt.includes('+09:00') && hdPrompt.includes('보조 교차 명언') && hdPrompt.includes('성찰 질문') && hdPrompt.includes('해석 경계'));

  const ys = calculateKoreanGosanYoonSeonDoFiveFriends(profile, query, now);
  assert.equal(ys.engineVersion, KOREAN_GOSAN_YOON_SEON_DO_FIVE_FRIENDS_VERSION);
  assert.match(ys.calculatedAtKst, /\+09:00/);
  assert.notEqual(ys.secondaryYoonAphorism.aphorismKey, ys.focalYoonAphorism.aphorismKey);
  assert.ok(ys.reflectiveQuestion.includes(query));
  assert.ok(ys.interpretiveBoundary.includes('성찰'));
  const ysPrompt = formatKoreanGosanYoonSeonDoFiveFriendsPrompt(ys);
  assert.ok(ysPrompt.includes('+09:00') && ysPrompt.includes('보조 교차 시가') && ysPrompt.includes('성찰 질문') && ysPrompt.includes('해석 경계'));
});

test('Heo Gyun, Heo Jun, and Hyecho v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T05:35:00Z');
  const query = '막힌 흐름을 뚫고 낯선 길을 개척하고 싶습니다';

  const hg = calculateKoreanHeoGyunHongGildongYuldoguk(profile, query, now);
  assert.equal(hg.engineVersion, KOREAN_HEO_GYUN_HONG_GILDONG_YULDOGUK_VERSION);
  assert.match(hg.calculatedAtKst, /\+09:00/);
  assert.notEqual(hg.secondaryHeoGyunAphorism.aphorismKey, hg.focalHeoGyunAphorism.aphorismKey);
  assert.ok(hg.reflectiveQuestion.includes(query));
  assert.ok(hg.interpretiveBoundary.includes('성찰'));
  const hgPrompt = formatKoreanHeoGyunHongGildongYuldogukPrompt(hg);
  assert.ok(hgPrompt.includes('+09:00') && hgPrompt.includes('보조 교차 테제') && hgPrompt.includes('성찰 질문') && hgPrompt.includes('해석 경계'));

  const hj = calculateKoreanHeoJunDonguiBogamYangsaeng(profile, query, now);
  assert.equal(hj.engineVersion, KOREAN_HEO_JUN_DONGUI_BOGAM_YANGSAENG_VERSION);
  assert.match(hj.calculatedAtKst, /\+09:00/);
  assert.notEqual(hj.secondaryHeoJunAphorism.aphorismKey, hj.focalHeoJunAphorism.aphorismKey);
  assert.ok(hj.reflectiveQuestion.includes(query));
  assert.ok(hj.interpretiveBoundary.includes('성찰'));
  const hjPrompt = formatKoreanHeoJunDonguiBogamYangsaengPrompt(hj);
  assert.ok(hjPrompt.includes('+09:00') && hjPrompt.includes('보조 교차 명언') && hjPrompt.includes('성찰 질문') && hjPrompt.includes('해석 경계'));

  const hc = calculateHyechoWangOcheonchukgukjeon(profile, query, now);
  assert.equal(hc.engineVersion, KOREAN_HYECHO_VERSION);
  assert.match(hc.calculatedAtKst, /\+09:00/);
  assert.notEqual(hc.secondaryHyechoAphorism.aphorismKey, hc.focalHyechoAphorism.aphorismKey);
  assert.ok(hc.reflectiveQuestion.includes(query));
  assert.ok(hc.interpretiveBoundary.includes('성찰'));
  const hcPrompt = formatHyechoWangOcheonchukgukjeonPrompt(hc);
  assert.ok(hcPrompt.includes('+09:00') && hcPrompt.includes('보조 교차 시구') && hcPrompt.includes('성찰 질문') && hcPrompt.includes('해석 경계'));
});

test('Ilyeon, Jang Bogo, and Jeon Bongjun v2.1.0 include +09:00 KST, dual cross-check, reflective question, and interpretive boundary', () => {
  const profile = { basic: { name: '제제', birthdate: '1994-01-24', birthtime: '12:00', gender: 'male' } } as any;
  const now = new Date('2026-11-16T05:45:00Z');
  const query = '거친 파도를 넘어 동료들과 새로운 길을 열고 싶습니다';

  const il = calculateKoreanIlyeonSamgukYusa(profile, query, now);
  assert.equal(il.engineVersion, KOREAN_ILYEON_SAMGUK_YUSA_VERSION);
  assert.match(il.calculatedAtKst, /\+09:00/);
  assert.notEqual(il.secondaryIlyeonAphorism.aphorismKey, il.focalIlyeonAphorism.aphorismKey);
  assert.ok(il.reflectiveQuestion.includes(query));
  assert.ok(il.interpretiveBoundary.includes('성찰'));
  const ilPrompt = formatKoreanIlyeonSamgukYusaPrompt(il);
  assert.ok(ilPrompt.includes('+09:00') && ilPrompt.includes('보조 교차 격언') && ilPrompt.includes('성찰 질문') && ilPrompt.includes('해석 경계'));

  const jb = calculateJangBogoCheonghaejinMaritimePioneer(profile, query, now);
  assert.equal(jb.engineVersion, KOREAN_JANG_BOGO_VERSION);
  assert.match(jb.calculatedAtKst, /\+09:00/);
  assert.notEqual(jb.secondaryCheonghaeAphorism.aphorismKey, jb.focalCheonghaeAphorism.aphorismKey);
  assert.ok(jb.reflectiveQuestion.includes(query));
  assert.ok(jb.interpretiveBoundary.includes('성찰'));
  const jbPrompt = formatJangBogoCheonghaejinMaritimePioneerPrompt(jb);
  assert.ok(jbPrompt.includes('+09:00') && jbPrompt.includes('보조 교차 경구') && jbPrompt.includes('성찰 질문') && jbPrompt.includes('해석 경계'));

  const jbj = calculateJeonBongjunNokdu(profile, query, now);
  assert.equal(jbj.engineVersion, JEON_BONGJUN_NOKDU_VERSION);
  assert.match(jbj.calculatedAtKst, /\+09:00/);
  assert.notEqual(jbj.secondaryRighteousManifesto.hanjaMotto, jbj.primaryRighteousManifesto.hanjaMotto);
  assert.ok(jbj.reflectiveQuestion.includes(query));
  assert.ok(jbj.interpretiveBoundary.includes('성찰'));
  const jbjPrompt = formatJeonBongjunNokduPrompt(jbj);
  assert.ok(jbjPrompt.includes('+09:00') && jbjPrompt.includes('보조 교차 강령') && jbjPrompt.includes('성찰 질문') && jbjPrompt.includes('해석 경계'));
});
