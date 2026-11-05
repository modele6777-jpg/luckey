/**
 * 고대 에트루리아 16천궁 분할 & 로마 아우구르(Augur) 조점(鳥占) 신탁 엔진
 * (Ancient Etruscan 16-Region Celestial Templum & Roman Augur Auspice Engine)
 *
 * 기원전 이탈리아 반도의 신비 문명 에트루리아의 《디스치플리나 에트루스카(Disciplina Etrusca)》 및
 * 고대 로마 공화정 신관단(Collegium Augurum)의 공식 점성 신탁 조점(Auspicium / Augury) 원전 기반:
 *
 * 1. 16대 천궁 템플룸(Templum Caeleste) 4분원 우주 분할:
 *    - 제1사분면 (북동·파르스 포스티카 시니스트라): 최고 주신 티니아(Tinia/유피테르)·우니(헤라)·멘르바의 영역 (지극히 길함)
 *    - 제2사분면 (남동·파르스 안티카 시니스트라): 대지·농경·풍요와 빛의 지상 신성 영역 (길함)
 *    - 제3사분면 (남서·파르스 안티카 덱스트라): 과도기적 변화와 지류 신들의 영역 (혼합·주의)
 *    - 제4사분면 (북서·파르스 포스티카 덱스트라): 운명과 명계의 주신 만투스(Mantus) 영역 (엄중한 경고)
 * 2. 아우구르 3대 신성 징표(Signa Auspicii):
 *    - 알리테스(Alites): 독수리·매 등 날개짓과 비행 궤적으로 길흉을 알리는 새
 *    - 오스키네스(Oscines): 갈까마귀·까마귀·올빼미 등 울음소리와 방향으로 신탁을 전하는 새
 *    - 풀구라토레스(Fulguratores): 번개의 번뜩임과 낙뢰 궤적으로 천의를 선포하는 징표
 * 3. 리투우스(Lituus) 지팡이의 천상 관측 및 신성한 승인(Admissio):
 *    - 파우스투스(Faustus) 길조 공명도 (0~100)
 *    - 신성한 결정 허가도(Admissio Index): 계획의 추진/보류 여부 판정
 */

import type { UserProfile } from '../sharedState';

export const ETRUSCAN_AUGUR_ENGINE_VERSION = 'LUCKEY-ETRUSCAN-AUGUR-v1.0.0';

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

export interface EtruscanAugurSixteenSkyReport {
  engineVersion: string;
  activeRegion: CelestialTemplumRegion;
  augurSign: AugurSignInfo;
  faustusScore: number;                 // 0 ~ 100 파우스투스 길조 점수
  admissioApprovalLevel: 'Plena Admissio (완전 승인)' | 'Cum Monitu (주의 조건부 승인)' | 'Prohibitio (보류 및 재검토)';
  lituusClarityIndex: number;           // 0 ~ 100 리투우스 시야 투명도
  cosmicSanctionStrength: number;       // 0 ~ 100 하늘의 재가 강도
  augurOracleGuidance: string;
  auspiceActionPrescription: string;
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

  // 1. 16 Celestial Templum Region Selection
  const regIdx = seed % SIXTEEN_TEMPLUM_REGIONS.length;
  const activeRegion = SIXTEEN_TEMPLUM_REGIONS[regIdx];

  // 2. Augur Sign Category & Interpretation
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

  // 3. Quantitative Indices
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

  // 4. Guidance Formulation
  const augurOracleGuidance = `고대 로마 최고 신관의 선언: "신들의 허가(Auspicia)가 내리지 않은 계획은 아무리 거대해도 모래성이다." 현재 하늘의 리투우스 템플룸 관측 구역은 [제${activeRegion.regionNumber}구역: ${activeRegion.quadrantKo}]이며, 주재신은 [${activeRegion.presidingDeity}]입니다. 징표는 [${augurSign.sacredDirection}]에서 나타난 [${augurSign.sacredSymbol}]입니다. 천상의 최종 판정은 [${admissioApprovalLevel}]입니다. 길조 공명도 ${faustusScore}점에 따라, ${activeRegion.cosmicSignificance}의 기운을 바탕으로 행보를 결정하십시오.`;

  const auspiceActionPrescription = `[아우구르 행동 지침] ${augurSign.signCategory}의 징조("${augurSign.omenInterpretation}")를 거울삼으십시오. ${
    admissioApprovalLevel === 'Plena Admissio (완전 승인)'
      ? '하늘의 전폭적인 지지가 있으므로 망설임 없이 결단을 실행에 옮기십시오.'
      : admissioApprovalLevel === 'Cum Monitu (주의 조건부 승인)'
      ? '방향은 옳으나 세부 조건과 일정을 한 번 더 점검하고 신중하게 착수하십시오.'
      : '지금은 무리하게 밀어붙일 때가 아닙니다. 내실을 다지고 다음 길조의 때를 기다리십시오.'
  }`;

  return {
    engineVersion: ETRUSCAN_AUGUR_ENGINE_VERSION,
    activeRegion,
    augurSign,
    faustusScore,
    admissioApprovalLevel,
    lituusClarityIndex,
    cosmicSanctionStrength,
    augurOracleGuidance,
    auspiceActionPrescription
  };
}

export function formatEtruscanAugurSixteenSkyPrompt(rep: EtruscanAugurSixteenSkyReport): string {
  return `[고대 에트루리아 16천궁 분할 & 아우구르 조점(Auspicium) 실측 리포트]
· 버전: ${rep.engineVersion}
· 활성 템플룸 구역: [제${rep.activeRegion.regionNumber}구역: ${rep.activeRegion.quadrantKo}] — 성격: ${rep.activeRegion.auspiciousNature}
  - 주재 신성: ${rep.activeRegion.presidingDeity}
  - 천상 의미: ${rep.activeRegion.cosmicSignificance}
· 관측 신성 징표: [${rep.augurSign.signCategory}] — 방향: ${rep.augurSign.sacredDirection}
  - 상징: ${rep.augurSign.sacredSymbol}
  - 징표 해석: ${rep.augurSign.omenInterpretation}
· 핵심 계측 지표:
  - 파우스투스(Faustus) 길조 지수: ${rep.faustusScore}/100
  - 신성한 결정 승인도(Admissio): ${rep.admissioApprovalLevel}
  - 리투우스 시야 투명도: ${rep.lituusClarityIndex}/100
  - 천상 재가(Sanction) 강도: ${rep.cosmicSanctionStrength}/100
· 아우구르 신관 오라클 지침: ${rep.augurOracleGuidance}
· 천의 부응 행동 처방: ${rep.auspiceActionPrescription}`;
}
