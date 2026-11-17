/**
 * 발리 힌두교 트리 히타 카라나(3대 우주 조화) 및 트리 카야 파리수다 3업 정화 엔진 (balineseTriHitaKaranaHarmonyEngine.ts)
 *
 * 유네스코 인류무형문화유산 등재 발리 힌두 고유 철학 《트리 히타 카라나(Tri Hita Karana)》 원전 기반:
 * 행복과 번영(Sukham)을 이끄는 3대 우주적 조화의 축(신성 Parhyangan · 인간 Pawongan · 자연 Palemahan)과
 * 신체·언어·마음의 3대 업을 정화하는 《트리 카야 파리수다(Tri Kaya Parisudha)》 정성·시공간 모델링.
 */

import type { UserProfile } from '../sharedState';

export const BALINESE_TRI_HITA_KARANA_ENGINE_VERSION = 'LUCKEY-BALINESE-TRI-HITA-v2.2.0';

export interface BalineseSacredSanctuary {
  id: string;
  nameKo: string;
  balineseName: string;
  cardinalDirection: '북동 (Kaja-Kangin, 중심 영성)' | '동 (Kangin, 빛과 태양)' | '남 (Kelod, 바다와 번개)' | '서 (Kauh, 일몰과 안식)' | '중앙 (Center, 우주 축)';
  guardianAspect: string;
  spiritualResonanceVirtue: string;
  canangSariRitualOffering: string;
  sanctuaryResonanceScore: number; // 0 ~ 100 (내부 연산용)
}

export interface BalineseSituationalAudit {
  harmonyAxis: string;
  triKayaFocus: string;
  tatTwamAsiGuidance: string;
  warningBoundary: string;
}

export interface BalineseTemporalRhythm {
  kstHour: number;
  sandhyaPhase: string;
  subakSeasonFlow: string;
  rhythmGuidance: string;
  equilibriumState: '조화' | '정화' | '안식';
}

export interface BalineseSynthesisMatrix {
  trinityBalanceGrade: '원만' | '조율' | '정화필요';
  karmaPurificationNote: string;
  dailyOfferingDirective: string;
}

export interface BalineseTriHitaKaranaReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  parhyanganDivineHarmony: number;
  pawonganHumanityEmpathy: number;
  palemahanEcologyBalance: number;
  triKayaPurificationIndex: number;
  activeSanctuary: BalineseSacredSanctuary;
  situationalTriHitaAudit: BalineseSituationalAudit;
  temporalTriHitaRhythm: BalineseTemporalRhythm;
  triHitaSynthesisMatrix: BalineseSynthesisMatrix;
  balineseCosmicGuidance: string;
  tirtaHolyWaterBlessing: string;
  ritualAction: string;
  reflectionFocus: string;
  interpretiveBoundary: string;
}

const BALINESE_SANCTUARIES_BASE: Omit<BalineseSacredSanctuary, 'sanctuaryResonanceScore'>[] = [
  {
    id: 'pura-besakih',
    nameKo: '푸라 베사키 (아궁산 대어머니 사원, 우주 영성의 최고 정점)',
    balineseName: 'Pura Besakih',
    cardinalDirection: '북동 (Kaja-Kangin, 중심 영성)',
    guardianAspect: '발리의 성산 아궁(Agung) 화산 중턱에 솟은 모든 사원의 어머니이자 시바·비슈누·브라흐마 삼신 일체 성소',
    spiritualResonanceVirtue: '세속의 번잡함을 단숨에 정화하는 장엄한 우주적 근원의 빛과 완전한 내면 평정심',
    canangSariRitualOffering: '흰 연꽃잎과 향기로운 프란지파니 꽃을 올리며 절대적 신성 앞에 에고를 낮추는 기도를 바치십시오.',
  },
  {
    id: 'pura-lempuyang',
    nameKo: '푸라 렘푸양 루후르 (천국의 문과 동쪽 여명의 찬란한 계시)',
    balineseName: 'Pura Lempuyang Luhur',
    cardinalDirection: '동 (Kangin, 빛과 태양)',
    guardianAspect: '태양의 신 이스바라(Iswara)가 주재하며 빛의 문을 통해 내면의 무명을 몰아내는 여명의 성소',
    spiritualResonanceVirtue: '새로운 시대를 여는 맑은 영감, 투명한 영적 직관 및 진실을 똑바로 응시하는 용기',
    canangSariRitualOffering: '동쪽을 향해 아침 첫 햇살을 손바닥에 모아 가슴 중앙 아나하타 차크라로 이끄십시오.',
  },
  {
    id: 'pura-uluwatu',
    nameKo: '푸라 울루와투 (남쪽 해안 절벽 바다의 수호 성역)',
    balineseName: 'Pura Luhur Uluwatu',
    cardinalDirection: '남 (Kelod, 바다와 번개)',
    guardianAspect: '인도양의 파도가 부서지는 70미터 석회암 절벽 위에서 해양의 신 루드라(Rudra)가 주재하는 수호 성소',
    spiritualResonanceVirtue: '거센 감정의 폭풍 속에서도 흔들리지 않는 굳건한 영적 방패와 직관적 분별력',
    canangSariRitualOffering: '밀려오는 파도의 숨결에 맞춰 날숨으로 깊은 독소를 토해내고 바다의 무한한 회복력을 들이마시십시오.',
  },
  {
    id: 'pura-tanah-lot',
    nameKo: '푸라 타나 롯 (바다 암초 위 조석의 신비로운 성채)',
    balineseName: 'Pura Tanah Lot',
    cardinalDirection: '서 (Kauh, 일몰과 안식)',
    guardianAspect: '밀물에는 섬이 되고 썰물에는 육지가 되는 조석의 리듬 속에서 바다 신 바루나(Baruna)의 서기가 감도는 성소',
    spiritualResonanceVirtue: '변화무쌍한 삶의 기복 속에서 중심을 잃지 않는 적응력과 유연한 지혜',
    canangSariRitualOffering: '황혼의 붉은 노을을 바라보며 지나간 하루의 모든 인연과 감정에 깊은 감사의 합장을 올리십시오.',
  },
  {
    id: 'pura-batukaru',
    nameKo: '푸라 바투카루 (원시 밀림 속 대지모신의 고요한 치유처)',
    balineseName: 'Pura Luhur Batukaru',
    cardinalDirection: '서 (Kauh, 일몰과 안식)',
    guardianAspect: '바투카루 화산 기슭의 깊은 열대 원시림에 둘러싸여 대지와 숲의 정령 마하데와(Mahadewa)가 주재하는 치유 성소',
    spiritualResonanceVirtue: '뿌리 깊은 고요함, 지친 신경계의 전면적 이완과 자연 생명력과의 깊은 세포적 합일',
    canangSariRitualOffering: '맨발로 대지를 딛고 서서 푸른 나무들의 뿌리가 당신의 발바닥을 통해 온몸을 회복시키는 감각을 느끼십시오.',
  },
  {
    id: 'pura-ulun-danu-bratan',
    nameKo: '푸라 울룬 다누 브라탄 (호수 위 물의 여신 다누의 풍요 성소)',
    balineseName: 'Pura Ulun Danu Bratan',
    cardinalDirection: '중앙 (Center, 우주 축)',
    guardianAspect: '안개 낀 브라탄 칼데라 호수 위에 떠 있는 수상 사원으로 물의 여신 데위 다누(Dewi Danu)가 관장하는 생명수 성소',
    spiritualResonanceVirtue: '모든 막힌 흐름을 부드럽게 틔워주는 풍요로운 감수성과 자비로운 치유 에너지',
    canangSariRitualOffering: '맑은 생수를 손등에 세 번 적시며 생각·말·행동의 세 가지 업장이 눈 녹듯 정화됨을 선언하십시오.',
  },
];

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

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

function buildSituationalAudit(question: string): BalineseSituationalAudit {
  const q = question.toLowerCase();
  if (/관계|사랑|가족|동료|친구|갈등|화해|인간/.test(q)) {
    return {
      harmonyAxis: '파웡안(Pawongan — 인간 상호 자비와 타트 트밤 아시)',
      triKayaFocus: '와치카(Wacika — 상처 주지 않는 바른 언어)',
      tatTwamAsiGuidance: '"네가 곧 나이다(Tat Twam Asi)"라는 자각으로 상대의 두려움과 입장을 먼저 헤아리면 대립이 풀립니다.',
      warningBoundary: '자기 정당성을 증명하려는 날 선 말투가 관계의 물길을 막지 않게 조심하십시오.',
    };
  }
  if (/일|사업|직업|재물|성과|프로젝트|공부|결정/.test(q)) {
    return {
      harmonyAxis: '파르향안(Parhyangan — 신성한 목적의식과 소명 정렬)',
      triKayaFocus: '카야카(Kayika — 성실하고 정직한 행위)',
      tatTwamAsiGuidance: '당장의 이해득실보다 이 일이 공동체와 스스로에게 어떤 선한 순환(Dharma)을 남기는지 먼저 세우십시오.',
      warningBoundary: '조급한 탐욕이 일의 품격과 균형을 무너뜨리지 않도록 경계하십시오.',
    };
  }
  if (/건강|휴식|피로|자연|환경|이사|공간|마음/.test(q)) {
    return {
      harmonyAxis: '팔레마한(Palemahan — 자연·공간과의 생태적 균형)',
      triKayaFocus: '마나치카(Manacika — 고요하고 맑은 생각)',
      tatTwamAsiGuidance: '몸과 생활 공간을 정돈하고 물·빛·공기의 순환을 열어두면 막혔던 생명력이 자연스레 회복됩니다.',
      warningBoundary: '자연의 리듬을 거스르는 과로와 무리한 일정 강행을 멈추십시오.',
    };
  }
  return {
    harmonyAxis: '파르향안·파웡안·팔레마한 삼위일체 조화',
    triKayaFocus: '마나치카·와치카·카야카 3업 청정 정렬',
    tatTwamAsiGuidance: '생각·말·행동이 한 결로 이어질 때 외부의 혼란 속에서도 흔들리지 않는 수캄(Sukham)이 깃듭니다.',
    warningBoundary: '마음의 불안과 말의 과잉이 불필요한 업을 쌓지 않도록 호흡을 고르십시오.',
  };
}

function buildTemporalRhythm(now: Date): BalineseTemporalRhythm {
  const { hour, month } = getKstParts(now);

  let sandhyaPhase = '정오 마디안나(Madhyahna) 수리야 찬가 창';
  let equilibriumState: BalineseTemporalRhythm['equilibriumState'] = '조화';
  let rhythmGuidance = '낮의 태양 빛이 가장 밝은 시간이므로 명쾌한 대화와 현실적 봉사를 실천하기 좋습니다.';

  if (hour >= 4 && hour < 9) {
    sandhyaPhase = '여명 프라타흐(Pratah) 트리 산디아 정화 창';
    equilibriumState = '정화';
    rhythmGuidance = '새벽 첫 햇살 아래 차낭 사리(Canang Sari)를 올리듯 하루의 생각과 마음을 맑게 씻어내십시오.';
  } else if (hour >= 9 && hour < 16) {
    sandhyaPhase = '주간 마디안나(Madhyahna) 생명 순환 창';
    equilibriumState = '조화';
    rhythmGuidance = '수박(Subak) 물길이 논을 적시듯 사람과 일 사이에 막힘없는 협력을 흐르게 할 시간입니다.';
  } else if (hour >= 16 && hour < 20) {
    sandhyaPhase = '황혼 사얌(Sayam) 트리 산디아 감사 창';
    equilibriumState = '정화';
    rhythmGuidance = '해가 지는 서쪽을 바라보며 오늘 하루의 수고와 인연에 감사의 합장을 올리십시오.';
  } else {
    sandhyaPhase = '심야 녱피(Nyepi) 침묵 안식 창';
    equilibriumState = '안식';
    rhythmGuidance = '모든 외부 활동을 멈추고 침묵 속에서 내면의 신성과 깊은 휴식을 회복할 시간입니다.';
  }

  let subakSeasonFlow = '수박(Subak) 물길의 균형 순환기';
  if (month >= 3 && month <= 5) subakSeasonFlow = '봄 싹틔움과 생명의 물길 개방기';
  else if (month >= 6 && month <= 8) subakSeasonFlow = '풍성한 생장과 햇살의 결실 준비기';
  else if (month >= 9 && month <= 11) subakSeasonFlow = '수확 감사제 오달란(Odalan) 은총기';
  else subakSeasonFlow = '우기의 대지 정화와 내면 성찰기';

  return {
    kstHour: hour,
    sandhyaPhase,
    subakSeasonFlow,
    rhythmGuidance,
    equilibriumState,
  };
}

export interface BalineseTriHitaOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}

export function calculateBalineseTriHitaKarana(
  profileOrOptions?: UserProfile | BalineseTriHitaOptions | null,
  questionArg = '',
  nowArg = new Date()
): BalineseTriHitaKaranaReport {
  let profile: UserProfile | null | undefined;
  let question = questionArg;
  let now = nowArg;

  if (profileOrOptions && ('profile' in profileOrOptions || 'question' in profileOrOptions || 'now' in profileOrOptions)) {
    const opts = profileOrOptions as BalineseTriHitaOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || new Date();
  } else {
    profile = profileOrOptions as UserProfile | null | undefined;
  }

  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_${question}_balinese_tri_hita_v2`;
  const seed = djb2Hash(seedStr);

  const parhyanganDivineHarmony = 62 + (seed % 37);
  const pawonganHumanityEmpathy = 59 + ((seed >> 2) % 40);
  const palemahanEcologyBalance = 63 + ((seed >> 4) % 36);
  const triKayaPurificationIndex = 65 + ((seed >> 6) % 34);

  const sanctuaryIdx = seed % BALINESE_SANCTUARIES_BASE.length;
  const base = BALINESE_SANCTUARIES_BASE[sanctuaryIdx];
  const sanctuaryResonanceScore = 67 + ((seed >> 8) % 32);

  const activeSanctuary: BalineseSacredSanctuary = {
    ...base,
    sanctuaryResonanceScore,
  };

  const situationalTriHitaAudit = buildSituationalAudit(question);
  const temporalTriHitaRhythm = buildTemporalRhythm(now);

  const avg = (parhyanganDivineHarmony + pawonganHumanityEmpathy + palemahanEcologyBalance) / 3;
  const trinityBalanceGrade: BalineseSynthesisMatrix['trinityBalanceGrade'] =
    avg >= 78 ? '원만' : avg >= 68 ? '조율' : '정화필요';

  const karmaPurificationNote =
    triKayaPurificationIndex >= 78
      ? '생각·말·행동 3업이 맑게 정렬되어 성수(Tirta)의 서기가 막힘없이 흐르는 상태입니다.'
      : '감정의 잔여와 말의 날카로움을 먼저 비워내면 3업의 균형이 빠르게 회복됩니다.';

  const dailyOfferingDirective = `[${activeSanctuary.balineseName}]의 서기를 받아 ${temporalTriHitaRhythm.sandhyaPhase}에 맞춰 ${situationalTriHitaAudit.triKayaFocus}을 실천하십시오.`;

  const triHitaSynthesisMatrix: BalineseSynthesisMatrix = {
    trinityBalanceGrade,
    karmaPurificationNote,
    dailyOfferingDirective,
  };

  const balineseCosmicGuidance = `발리 힌두 《트리 히타 카라나》의 법도는 우주 신성(Parhyangan), 인간 이웃(Pawongan), 자연 대지(Palemahan)의 삼위일체가 균형을 이룰 때 진정한 행복(Sukham)이 꽃핀다고 가르칩니다. 현재 [${activeSanctuary.nameKo}]의 수호 서기와 공명하여 바른 생각(Manacika), 바른 말(Wacika), 바른 행동(Kayika)의 3업을 정화하십시오.`;

  const tirtaHolyWaterBlessing = `손에 깨끗한 물을 담아 이마(마음의 정화), 입술(말의 정화), 가슴(행위의 정화)에 세 방울씩 가볍게 얹으며 '티르타(Tirta, 성스러운 생명수)'가 모든 해묵은 피로와 부정적 에너지를 말끔히 씻어냄을 명상하십시오.`;

  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const calculatedAtKst = `${kst.toISOString().slice(0, 19)}+09:00`;
  const interpretiveBoundary = '본 발리 트리 히타 카라나 리포트는 신성·인간·자연의 조화를 비추는 정성적 성찰 안내이며, 확정적 길흉 예단이 아닙니다.';

  return {
    engineVersion: BALINESE_TRI_HITA_KARANA_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    parhyanganDivineHarmony,
    pawonganHumanityEmpathy,
    palemahanEcologyBalance,
    triKayaPurificationIndex,
    activeSanctuary,
    situationalTriHitaAudit,
    temporalTriHitaRhythm,
    triHitaSynthesisMatrix,
    balineseCosmicGuidance,
    tirtaHolyWaterBlessing,
    ritualAction: tirtaHolyWaterBlessing,
    reflectionFocus: `${situationalTriHitaAudit.harmonyAxis}의 관점에서 오늘 생각·말·행동(3업) 중 가장 먼저 맑게 정화할 한 가지는 무엇인가요?`,
    interpretiveBoundary,
  };
}

export function formatBalineseTriHitaKaranaPrompt(report: BalineseTriHitaKaranaReport): string {
  const s = report.activeSanctuary;
  return `[발리 힌두교 트리 히타 카라나 3대 우주 조화 & 3업 정화 실측 데이터]
- 엔진 버전: v${report.engineVersion} | 기준 시각(KST): ${report.calculatedAtKst}
- 주재 공명 발리 대성소: ${s.nameKo} (${s.balineseName} / ${s.cardinalDirection})
  * 수호 서기: ${s.guardianAspect}
  * 영적 공명 미덕: ${s.spiritualResonanceVirtue}
  * 차낭 사리(Canang Sari) 봉헌 리추얼: ${s.canangSariRitualOffering}
- 질문 맥락 감사: ${report.situationalTriHitaAudit.harmonyAxis} · 초점(${report.situationalTriHitaAudit.triKayaFocus})
  * 타트 트밤 아시 지침: ${report.situationalTriHitaAudit.tatTwamAsiGuidance}
  * 경계할 점: ${report.situationalTriHitaAudit.warningBoundary}
- KST 시공간 리듬 (${report.temporalTriHitaRhythm.kstHour}시): ${report.temporalTriHitaRhythm.sandhyaPhase} · ${report.temporalTriHitaRhythm.subakSeasonFlow} (${report.temporalTriHitaRhythm.equilibriumState})
  * 리듬 처방: ${report.temporalTriHitaRhythm.rhythmGuidance}
- 삼위일체 교차 매트릭스: 조화 등급(${report.triHitaSynthesisMatrix.trinityBalanceGrade}) · ${report.triHitaSynthesisMatrix.karmaPurificationNote}
  * 오늘의 실천: ${report.triHitaSynthesisMatrix.dailyOfferingDirective}
- 트리 히타 카라나 우주 지혜 지침: ${report.balineseCosmicGuidance}
- 티르타(Tirta) 성수 정화 명상: ${report.tirtaHolyWaterBlessing}
- 해석 경계: ${report.interpretiveBoundary}`;
}
