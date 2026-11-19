/**
 * 고대 에트루리아 16천궁 분할 & 로마 아우구르(Augur) 조점(鳥占) 신탁 엔진
 * (Ancient Etruscan 16-Region Celestial Templum & Roman Augur Auspice Engine)
 *
 * 《디스치플리나 에트루스카(Disciplina Etrusca)》 및 고대 로마 아우구르 신관단 조점 원전 기반:
 * 16천궁 템플룸 분할, 아우구르 3대 신성 징표, 질문 맥락 감사, KST 리투우스 시공간 리듬을 교차 해독합니다.
 */

import type { UserProfile } from '../sharedState';

export const ETRUSCAN_AUGUR_ENGINE_VERSION = 'LUCKEY-ETRUSCAN-AUGUR-v2.5.0';

export interface CelestialTemplumRegion {
  regionNumber: number; // 1 ~ 16
  quadrantName: string;
  quadrantKo: string;
  presidingDeity: string;
  auspiciousNature: 'Summe Faustum (최고의 대길)' | 'Faustum (길조)' | 'Dubium (신중 관망)' | 'Infamum (경고·금기)';
  cosmicSignificance: string;
}

export interface AugurSignInfo {
  signCategory: 'Alites (신성 비행조)' | 'Oscines (신성 음성조)' | 'Fulguratores (천둥 번개 신탁)';
  sacredSymbol: string;
  sacredDirection: 'Sinistra (좌측/동쪽 - 상서로움)' | 'Dextra (우측/서쪽 - 신중함)';
  omenInterpretation: string;
}

export interface EtruscanSituationalAudit {
  templumInquiryAxis: string;
  augurFocusVirtue: string;
  disciplinaPrescription: string;
  prohibitioCaution: string;
}

export interface EtruscanTemporalRhythm {
  kstHour: number;
  auguryWatchWindow: string;
  etruscanSeasonCycle: string;
  observationDirective: string;
  sanctionTempo: '승인개방' | '신중관측' | '침묵대기';
}

export interface EtruscanSynthesisMatrix {
  templumVerdictSummary: string;
  signDirectionHarmony: string;
  nextAuspiceAction: string;
}

export interface EtruscanAugurSixteenSkyReport {
  engineVersion: string;
  calculatedAtKst: string;
  activeRegion: CelestialTemplumRegion;
  augurSign: AugurSignInfo;
  faustusScore: number;
  admissioApprovalLevel: 'Plena Admissio (완전 승인)' | 'Cum Monitu (주의 조건부 승인)' | 'Prohibitio (보류 및 재검토)';
  lituusClarityIndex: number;
  cosmicSanctionStrength: number;
  situationalAugurAudit: EtruscanSituationalAudit;
  temporalAugurRhythm: EtruscanTemporalRhythm;
  augurSynthesisMatrix: EtruscanSynthesisMatrix;
  augurOracleGuidance: string;
  auspiceActionPrescription: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

const SIXTEEN_TEMPLUM_REGIONS: CelestialTemplumRegion[] = [
  { regionNumber: 1, quadrantName: 'Pars Postica Sinistra', quadrantKo: '북동 1구역 (극존 길상)', presidingDeity: '티니아(Tinia / 최고 천신)', auspiciousNature: 'Summe Faustum (최고의 대길)', cosmicSignificance: '최고신의 절대적 은총과 새로운 왕국적 결단의 성공 약속' },
  { regionNumber: 2, quadrantName: 'Pars Postica Sinistra', quadrantKo: '북동 2구역 (천상 주권)', presidingDeity: '우니(Uni / 최고 여신)', auspiciousNature: 'Summe Faustum (최고의 대길)', cosmicSignificance: '가정과 관계의 굳건한 결합 및 흔들리지 않는 보호력 발현' },
  { regionNumber: 3, quadrantName: 'Pars Postica Sinistra', quadrantKo: '북동 3구역 (지혜 명찰)', presidingDeity: '멘르바(Menrva / 전략과 지혜의 여신)', auspiciousNature: 'Summe Faustum (최고의 대길)', cosmicSignificance: '정교한 지적 계책과 창의적 기술의 결정적 돌파구 마련' },
  { regionNumber: 4, quadrantName: 'Pars Postica Sinistra', quadrantKo: '북동 4구역 (천문 조화)', presidingDeity: '라란(Laran / 수호와 정의의 신)', auspiciousNature: 'Faustum (길조)', cosmicSignificance: '용기 있는 행동과 명분 있는 결단의 확실한 승리' },
  { regionNumber: 5, quadrantName: 'Pars Antica Sinistra', quadrantKo: '남동 5구역 (광명 태양)', presidingDeity: '우실(Usil / 태양신)', auspiciousNature: 'Faustum (길조)', cosmicSignificance: '어둠을 몰아내는 명료한 조망과 세상의 공적인 인정 획득' },
  { regionNumber: 6, quadrantName: 'Pars Antica Sinistra', quadrantKo: '남동 6구역 (대지 풍요)', presidingDeity: '셀반스(Selvans / 숲과 경계의 수호신)', auspiciousNature: 'Faustum (길조)', cosmicSignificance: '물질적 토대의 비옥함과 불필요한 침입자 차단' },
  { regionNumber: 7, quadrantName: 'Pars Antica Sinistra', quadrantKo: '남동 7구역 (생명 감로)', presidingDeity: '푸플룬스(Fufluns / 환희와 성장의 신)', auspiciousNature: 'Faustum (길조)', cosmicSignificance: '창조적 활력의 폭발과 메마른 일상의 생기 회복' },
  { regionNumber: 8, quadrantName: 'Pars Antica Sinistra', quadrantKo: '남동 8구역 (해양 조류)', presidingDeity: '네툰스(Nethuns / 물과 바다의 신)', auspiciousNature: 'Faustum (길조)', cosmicSignificance: '감정의 막힘이 해소되고 유연한 소통의 흐름 개통' },
  { regionNumber: 9, quadrantName: 'Pars Antica Dextra', quadrantKo: '남서 9구역 (변화 관문)', presidingDeity: '투란(Turan / 사랑과 열정의 여신)', auspiciousNature: 'Dubium (신중 관망)', cosmicSignificance: '매혹과 유혹 사이에서 마음의 중심을 잃지 않는 절제 요구' },
  { regionNumber: 10, quadrantName: 'Pars Antica Dextra', quadrantKo: '남서 10구역 (황혼 전이)', presidingDeity: '카우타(Cath / 태양의 딸·여명과 황혼)', auspiciousNature: 'Dubium (신중 관망)', cosmicSignificance: '낮과 밤이 바뀌는 전환기, 서두르지 말고 다음 주기를 관찰' },
  { regionNumber: 11, quadrantName: 'Pars Antica Dextra', quadrantKo: '남서 11구역 (심연 접경)', presidingDeity: '테산(Thesan / 새벽의 여신)', auspiciousNature: 'Faustum (길조)', cosmicSignificance: '어둠의 터널 끝에서 비쳐오는 새로운 희망의 실마리' },
  { regionNumber: 12, quadrantName: 'Pars Antica Dextra', quadrantKo: '남서 12구역 (숙고의 터)', presidingDeity: '수리스(Suri / 정화와 예언의 지하 태양신)', auspiciousNature: 'Dubium (신중 관망)', cosmicSignificance: '숨은 의도를 정화하고 과거의 허물을 털어내야 할 시점' },
  { regionNumber: 13, quadrantName: 'Pars Postica Dextra', quadrantKo: '북서 13구역 (운명의 철퇴)', presidingDeity: '베이비스(Veivis / 보복과 심판의 신)', auspiciousNature: 'Infamum (경고·금기)', cosmicSignificance: '오만과 경솔함에 대한 경고, 무리한 확장 중단 요구' },
  { regionNumber: 14, quadrantName: 'Pars Postica Dextra', quadrantKo: '북서 14구역 (영혼의 거울)', presidingDeity: '만투스(Mantus / 명계와 영혼의 지배자)', auspiciousNature: 'Infamum (경고·금기)', cosmicSignificance: '보이지 않는 위험에 대비하고 내면의 에고를 낮추는 경건함' },
  { regionNumber: 15, quadrantName: 'Pars Postica Dextra', quadrantKo: '북서 15구역 (침묵의 심연)', presidingDeity: '마니아(Mania / 영혼의 어머니 신)', auspiciousNature: 'Infamum (경고·금기)', cosmicSignificance: '말을 아끼고 침묵 속에서 결속력을 다져야 할 시기' },
  { regionNumber: 16, quadrantName: 'Pars Postica Dextra', quadrantKo: '북서 16구역 (운명의 실타래)', presidingDeity: '노르티아(Nortia / 운명에 못을 박는 불변의 여신)', auspiciousNature: 'Infamum (경고·금기)', cosmicSignificance: '피할 수 없는 인과의 매듭 앞에서의 겸허한 수용과 결단' }
];

function getKstParts(now: Date): { hour: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    month: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  return {
    hour: Number(parts.find((p) => p.type === 'hour')?.value || '12') % 24,
    month: Number(parts.find((p) => p.type === 'month')?.value || '1'),
  };
}

function buildSituationalAudit(question: string, region: CelestialTemplumRegion): EtruscanSituationalAudit {
  const q = question.toLowerCase();
  if (/계약|일|사업|투자|결정|이직|시험|프로젝트/.test(q)) {
    return {
      templumInquiryAxis: '공적 결단과 실행 허가(Auspicium Publicum) 검토',
      augurFocusVirtue: `${region.presidingDeity}의 경계 수호와 명분 점검`,
      disciplinaPrescription: '모든 조건이 완전히 확인되기 전에는 구두 약속을 확정으로 착각하지 말고 서류와 기한을 먼저 점검하십시오.',
      prohibitioCaution: '징조가 완전히 열리기 전에 조급히 도장을 찍거나 판을 키우는 모험은 피하십시오.',
    };
  }
  if (/관계|사랑|결혼|사람|갈등|화해|이별/.test(q)) {
    return {
      templumInquiryAxis: '사적 인연과 신뢰 경계(Templum Privatum) 살핌',
      augurFocusVirtue: '감정의 과잉을 가라앉히고 상대의 실제 행동을 읽는 시야',
      disciplinaPrescription: '추측으로 상대를 재단하기보다, 담백하고 명확한 한두 문장으로 서로의 입장을 확인하십시오.',
      prohibitioCaution: '서운함을 방치한 채 침묵으로 상대의 마음을 시험하지 마십시오.',
    };
  }
  if (/건강|휴식|피로|마음|치유|불안/.test(q)) {
    return {
      templumInquiryAxis: '심신 정화와 안식 성소(Sanctum) 회복',
      augurFocusVirtue: '불필요한 경계를 풀고 호흡을 가다듬는 고요함',
      disciplinaPrescription: '하늘의 징조를 쫓느라 몸을 혹사하지 말고, 오늘은 의도적으로 자극을 줄여 회복에 집중하십시오.',
      prohibitioCaution: '피로가 누적된 상태에서 내리는 성급한 자기 비판을 멈추십시오.',
    };
  }
  return {
    templumInquiryAxis: `${region.quadrantKo} 하늘의 방향성과 균형 점검`,
    augurFocusVirtue: region.cosmicSignificance,
    disciplinaPrescription: '리투우스 지팡이로 하늘의 구역을 나누듯, 오늘 내가 통제할 수 있는 일과 기다려야 할 일을 명확히 가르고 움직이십시오.',
    prohibitioCaution: '작은 징후 하나에 전체 계획을 성급히 뒤집지 마십시오.',
  };
}

function buildTemporalRhythm(now: Date): EtruscanTemporalRhythm {
  const { hour, month } = getKstParts(now);

  let auguryWatchWindow = '새벽 아우구르(Augur) 템플룸 개방 창';
  let sanctionTempo: EtruscanTemporalRhythm['sanctionTempo'] = '승인개방';
  let observationDirective = '하늘이 가장 맑게 열리는 새벽~오전 창으로 새로운 착수와 판단에 적합합니다.';

  if (hour >= 4 && hour < 10) {
    auguryWatchWindow = '새벽 테산(Thesan) 리투우스 관측 창';
    sanctionTempo = '승인개방';
    observationDirective = '고대 아우구르가 동쪽을 향해 첫 징조를 살피던 시간대로, 핵심 결정을 선명하게 세우기 좋습니다.';
  } else if (hour >= 10 && hour < 16) {
    auguryWatchWindow = '정오 우실(Usil) 공적 집행 창';
    sanctionTempo = '승인개방';
    observationDirective = '이미 확인된 원칙을 바탕으로 실무를 추진하고 합의를 이끌어내기 좋은 시간입니다.';
  } else if (hour >= 16 && hour < 20) {
    auguryWatchWindow = '황혼 카우타(Cath) 경계 점검 창';
    sanctionTempo = '신중관측';
    observationDirective = '새로운 일을 벌이기보다 진행 중인 일의 빈틈을 살피고 속도를 조절할 시간입니다.';
  } else {
    auguryWatchWindow = '심야 만투스(Mantus) 침묵 대기 창';
    sanctionTempo = '침묵대기';
    observationDirective = '밤의 성소를 닫고 내면의 소리를 가라앉히며 다음 날의 길조를 기다리는 시간입니다.';
  }

  let etruscanSeasonCycle = '봄 춘분(Ver) 개방 주기';
  if (month >= 3 && month <= 5) etruscanSeasonCycle = '봄(Ver) · 성소 개방과 토대 다지기';
  else if (month >= 6 && month <= 8) etruscanSeasonCycle = '여름(Aestas) · 태양 절정과 결실 가꾸기';
  else if (month >= 9 && month <= 11) etruscanSeasonCycle = '가을(Autumnus) · 수확과 경계 점검';
  else etruscanSeasonCycle = '겨울(Hiems) · 침묵 수호와 내실 응축';

  return {
    kstHour: hour,
    auguryWatchWindow,
    etruscanSeasonCycle,
    observationDirective,
    sanctionTempo,
  };
}

export function calculateEtruscanAugurSixteenSky(params: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): EtruscanAugurSixteenSkyReport {
  const { profile, question = '', now = new Date() } = params;

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthdate?: string; birthDate?: string })?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1990-11-20';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthtime?: string; birthTime?: string })?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '14:30';

  const dateParts = bdate.split('-').map(p => parseInt(p, 10) || 0);
  const year = dateParts[0] || 1990;
  const month = dateParts[1] || 11;
  const day = dateParts[2] || 20;

  const timeParts = btime.split(':').map(p => parseInt(p, 10) || 0);
  const hour = timeParts[0] || 14;
  const minute = timeParts[1] || 30;

  let qHash = 0;
  for (let i = 0; i < question.length; i++) {
    qHash = (qHash * 31 + question.charCodeAt(i)) & 0xffffffff;
  }
  const qSeed = Math.abs(qHash);

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();
  const nowHour = now.getHours();

  const seed = (year * 365 + month * 31 + day + hour * 23 + minute * 7 + qSeed + nowYear * 12 + nowMonth * 30 + nowDay + nowHour) >>> 0;

  const regIdx = seed % SIXTEEN_TEMPLUM_REGIONS.length;
  const activeRegion = SIXTEEN_TEMPLUM_REGIONS[regIdx];

  const signTypeIdx = (seed * 11 + day * 3) % 3;
  let signCategory: AugurSignInfo['signCategory'] = 'Alites (신성 비행조)';
  let sacredSymbol = '신성한 황금 독수리 (Aquila)의 높은 활공';
  let omenInterpretation = '드넓은 시야와 결단력 있는 비상으로 장애물을 뛰어넘는 길조';

  if (signTypeIdx === 1) {
    signCategory = 'Oscines (신성 음성조)';
    sacredSymbol = '동틀 녘 까마귀 (Corvus)의 명료한 세 번의 지저귐';
    omenInterpretation = '가까운 곳에서 올 중요한 소식과 직관적 정보에 귀 기울이라는 신호';
  } else if (signTypeIdx === 2) {
    signCategory = 'Fulguratores (천둥 번개 신탁)';
    sacredSymbol = '북동쪽 하늘을 가르는 맑은 은빛 섬광 (Fulgur)';
    omenInterpretation = '미망과 주저함을 한순간에 베어버리는 천상의 단호한 허가';
  }

  const isSinistra = activeRegion.regionNumber <= 8;
  const sacredDirection: AugurSignInfo['sacredDirection'] = isSinistra
    ? 'Sinistra (좌측/동쪽 - 상서로움)'
    : 'Dextra (우측/서쪽 - 신중함)';

  const augurSign: AugurSignInfo = {
    signCategory,
    sacredSymbol,
    sacredDirection,
    omenInterpretation
  };

  let baseFaustus = 60;
  if (activeRegion.auspiciousNature === 'Summe Faustum (최고의 대길)') baseFaustus = 88;
  else if (activeRegion.auspiciousNature === 'Faustum (길조)') baseFaustus = 75;
  else if (activeRegion.auspiciousNature === 'Dubium (신중 관망)') baseFaustus = 58;
  else baseFaustus = 46;

  const faustusScore = Math.min(100, Math.max(38, baseFaustus + ((seed % 17) - 8)));
  const lituusClarityIndex = Math.min(100, Math.max(50, 65 + ((seed * 13) % 35)));
  const cosmicSanctionStrength = Math.min(100, Math.max(45, Math.round(faustusScore * 0.7 + lituusClarityIndex * 0.3)));

  let admissioApprovalLevel: EtruscanAugurSixteenSkyReport['admissioApprovalLevel'] = 'Plena Admissio (완전 승인)';
  if (faustusScore < 52) {
    admissioApprovalLevel = 'Prohibitio (보류 및 재검토)';
  } else if (faustusScore < 70) {
    admissioApprovalLevel = 'Cum Monitu (주의 조건부 승인)';
  }

  const situationalAugurAudit = buildSituationalAudit(question, activeRegion);
  const temporalAugurRhythm = buildTemporalRhythm(now);

  const templumVerdictSummary = `[제${activeRegion.regionNumber}구역 ${activeRegion.quadrantKo}]의 ${activeRegion.auspiciousNature} 기운과 [${admissioApprovalLevel}] 판정이 결합되어 있습니다.`;
  const signDirectionHarmony = `${augurSign.sacredDirection}에서 포착된 ${augurSign.signCategory} 징표가 ${temporalAugurRhythm.sanctionTempo} 리듬과 조응합니다.`;
  const nextAuspiceAction = `${temporalAugurRhythm.auguryWatchWindow} 흐름에 맞춰 ${situationalAugurAudit.templumInquiryAxis}을 우선 처리하십시오.`;

  const augurSynthesisMatrix: EtruscanSynthesisMatrix = {
    templumVerdictSummary,
    signDirectionHarmony,
    nextAuspiceAction,
  };

  const augurOracleGuidance = `고대 로마 최고 신관의 선언: "신들의 허가(Auspicia)가 내리지 않은 계획은 아무리 거대해도 모래성이다." 현재 하늘의 리투우스 템플룸 관측 구역은 [제${activeRegion.regionNumber}구역: ${activeRegion.quadrantKo}]이며, 주재신은 [${activeRegion.presidingDeity}]입니다. 징표는 [${augurSign.sacredDirection}]에서 나타난 [${augurSign.sacredSymbol}]입니다. 천상의 최종 판정은 [${admissioApprovalLevel}]입니다.`;

  const auspiceActionPrescription = `[아우구르 행동 지침] ${augurSign.signCategory}의 징조("${augurSign.omenInterpretation}")를 거울삼으십시오. ${
    admissioApprovalLevel === 'Plena Admissio (완전 승인)'
      ? '하늘의 전폭적인 지지가 있으므로 망설임 없이 결단을 실행에 옮기십시오.'
      : admissioApprovalLevel === 'Cum Monitu (주의 조건부 승인)'
      ? '방향은 옳으나 세부 조건과 일정을 한 번 더 점검하고 신중하게 착수하십시오.'
      : '지금은 무리하게 밀어붙일 때가 아닙니다. 내실을 다지고 다음 길조의 때를 기다리십시오.'
  }`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00 (KST)`;

  const ritualAction = `${augurSynthesisMatrix.nextAuspiceAction} · ${situationalAugurAudit.disciplinaPrescription}`;
  const reflectionFocus = question.trim()
    ? `‘${question.trim()}’ 앞에서 [${activeRegion.quadrantKo} · ${admissioApprovalLevel}]의 조짐을 따라 지금 확정하거나 보류해야 할 한 가지는 무엇입니까?`
    : `오늘 제${activeRegion.regionNumber}구역 [${activeRegion.presidingDeity}]의 하늘 구역 아래서 가장 신중하게 살필 징표는 무엇입니까?`;

  return {
    engineVersion: ETRUSCAN_AUGUR_ENGINE_VERSION,
    calculatedAtKst,
    activeRegion,
    augurSign,
    faustusScore,
    admissioApprovalLevel,
    lituusClarityIndex,
    cosmicSanctionStrength,
    situationalAugurAudit,
    temporalAugurRhythm,
    augurSynthesisMatrix,
    augurOracleGuidance,
    auspiceActionPrescription,
    interpretiveBoundary: '디스치플리나 에트루스카 16천궁 조점 상징을 빌린 정성적 결단 참고 관점이며, 개인 점수나 확정 예언이 아닙니다.',
    ritualAction,
    reflectionFocus,
    reflectiveQuestion: reflectionFocus,
  };
}

export function formatEtruscanAugurSixteenSkyPrompt(rep: EtruscanAugurSixteenSkyReport): string {
  return `[고대 에트루리아 16천궁 분할 & 아우구르 조점(Auspicium) 상징 관점]
· 버전: ${rep.engineVersion} | 기준 시각: ${rep.calculatedAtKst}
· 활성 템플룸 구역: [제${rep.activeRegion.regionNumber}구역: ${rep.activeRegion.quadrantKo}] — 성격: ${rep.activeRegion.auspiciousNature}
  - 주재 신성: ${rep.activeRegion.presidingDeity}
  - 천상 의미: ${rep.activeRegion.cosmicSignificance}
· 관측 신성 징표: [${rep.augurSign.signCategory}] — 방향: ${rep.augurSign.sacredDirection}
  - 상징: ${rep.augurSign.sacredSymbol}
  - 징표 해석: ${rep.augurSign.omenInterpretation}
· 신성한 결정 승인도(Admissio): ${rep.admissioApprovalLevel}
· 질문 맥락 감사: ${rep.situationalAugurAudit.templumInquiryAxis} · 초점(${rep.situationalAugurAudit.augurFocusVirtue})
  - 에트루스카 처방: ${rep.situationalAugurAudit.disciplinaPrescription}
  - 보류 경계: ${rep.situationalAugurAudit.prohibitioCaution}
· KST 시공간 리듬 (${rep.temporalAugurRhythm.kstHour}시): ${rep.temporalAugurRhythm.auguryWatchWindow} · ${rep.temporalAugurRhythm.etruscanSeasonCycle} (${rep.temporalAugurRhythm.sanctionTempo})
  - 관측 지침: ${rep.temporalAugurRhythm.observationDirective}
· 템플룸 교차 매트릭스: ${rep.augurSynthesisMatrix.templumVerdictSummary} · ${rep.augurSynthesisMatrix.signDirectionHarmony}
  - 다음 행동: ${rep.augurSynthesisMatrix.nextAuspiceAction}
· 아우구르 신관 오라클 지침: ${rep.augurOracleGuidance}
· 천의 부응 행동 처방: ${rep.auspiceActionPrescription}
· 성찰 초점: ${rep.reflectionFocus}
· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: 디스치플리나 에트루스카 16천궁 조점 상징을 빌린 정성적 결단 참고 관점이며, 개인 점수나 확정 예언이 아닙니다.`;
}
