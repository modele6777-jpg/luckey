/**
 * 아메리카 호피족 4대 우주 시대 순환·카치나 정령 지혜·코양니스카시 치유 엔진 (hopiFourWorldsKachinaProphecyEngine.ts)
 *
 * 북미 대륙 최고(最古)의 원주민 영성 호피(Hopi, '평화의 백성') 구전 원전 기반:
 * 태양령 타이오와(Taiowa)와 대지모신 거미할머니(Spider Grandmother, Kokyangwuti)가 이끈
 * 4대 우주 세계(Four Worlds: Tokpela · Tokpa · Kuskurza · Tuwaqachi)의 순환과
 * 균형을 잃은 삶(Koyaanisqatsi)을 치유하는 카치나(Katsina) 신성 정령 지혜 수리 모델링.
 *
 * 4대 세계 순환:
 * 1. Tokpela (끝없는 공간): 순수한 조화와 창조의 제1세계.
 * 2. Tokpa (암흑의 세계): 물질 축적과 분리의 제2세계.
 * 3. Kuskurza (파멸의 세계): 기술 만능과 오만의 제3세계.
 * 4. Tuwaqachi (완전한 세계): 겸허한 농경과 영적 현존을 시험받는 제4세계.
 */

import type { UserProfile } from '../sharedState';

export const HOPI_FOUR_WORLDS_ENGINE_VERSION = '2.0.0';

export interface HopiKachinaSpirit {
  id: string;
  nameKo: string;
  hopiName: string;
  spiritualDomain: string;
  healingMedicine: string;
  ceremonialSeason: string;
  kachinaBlessingAffirmation: string;
  spiritResonanceScore: number; // 0 ~ 100
}

export interface HopiFourWorldsReport {
  engineVersion: string;
  timestamp: string;
  fourWorldsEvolutionScore: number; // 내부 참조용 (프롬프트 비노출)
  koyaanisqatsiHealingPower: number; // 내부 참조용 (프롬프트 비노출)
  kivaSacredCenterAlignment: number; // 내부 참조용 (프롬프트 비노출)
  spiderGrandmotherWisdom: number; // 내부 참조용 (프롬프트 비노출)
  dominantKachina: HopiKachinaSpirit; // 현재 운명을 수호하는 카치나 정령
  situationalHopiAudit: {
    questionTheme: 'balance' | 'relationship' | 'decision' | 'renewal';
    activeWorldStage: string;
    koyaanisqatsiAlert: string;
    spiderWebInsight: string;
  };
  temporalHopiRhythm: {
    calculatedAtKst: string;
    kivaSolarWindow: string;
    ceremonialCycle: string;
    rhythmGuidance: string;
  };
  hopiSynthesisMatrix: {
    kachinaWorldNexus: string;
    groundingPosture: string;
    peaceDirective: string;
  };
  hopiProphecyGuidance: string; // 호피 평화 예언 처방
  pikiBreadSacredOffering: string; // 대지와 연결되는 소박한 평화 리추얼
  boundaryNotice: string;
}

const HOPI_KACHINAS_BASE: Omit<HopiKachinaSpirit, 'spiritResonanceScore'>[] = [
  {
    id: 'soyal-kachina',
    nameKo: '소얄 카치나 (동지 태양 부활과 신성한 새해 점화)',
    hopiName: 'Soyal Katsina',
    spiritualDomain: '가장 긴 어둠의 밤을 지나 다시 떠오르는 태양의 첫 숨결과 영적 갱신',
    healingMedicine: '절망의 끝에서 희망의 불씨를 지피고 새로운 시작을 축복하는 불사조 의식',
    ceremonialSeason: '동지 제의 (Soyalangw)',
    kachinaBlessingAffirmation: '가장 어두운 순간이 바로 가장 찬란한 빛이 잉태되는 순간임을 굳게 믿으십시오.',
  },
  {
    id: 'eototo-chief',
    nameKo: '에오토토 (모든 카치나의 최고 영적 추장 정령)',
    hopiName: 'Eototo Katsina',
    spiritualDomain: '고대 지혜의 최고 수호자이자 우주의 근원적 질서와 대지의 영원한 법칙 관장',
    healingMedicine: '복잡한 갈등을 단숨에 꿰뚫는 원숙한 통찰력과 공동체를 화합시키는 자애로운 리더십',
    ceremonialSeason: '파와무 축제 (Powamuya, 콩 싹트기 의식)',
    kachinaBlessingAffirmation: '우주의 근원적 법칙은 언제나 당신을 지지하고 있으니 흔들림 없이 바른 도리를 지키십시오.',
  },
  {
    id: 'hemis-abundance',
    nameKo: '헤미스 카치나 (한여름 옥수수 수확과 축복의 단비)',
    hopiName: 'Hemis Katsina',
    spiritualDomain: '구름과 단비를 몰고 와 메마른 대지를 적시고 영혼의 열매를 풍성하게 익히는 정령',
    healingMedicine: '결핍에 대한 두려움을 씻어내고 온 존재로 풍요의 순환을 신뢰하는 대지의 은총',
    ceremonialSeason: '니만 제의 (Niman, 카치나 고향 귀환제)',
    kachinaBlessingAffirmation: '성실히 땀 흘려 심은 영혼의 씨앗은 때가 되면 반드시 풍성한 열매로 당신을 찾아옵니다.',
  },
  {
    id: 'kokopelli-flute',
    nameKo: '코코펠리 (생명의 피리를 부는 기쁨과 다산의 전령)',
    hopiName: 'Kokopelli Katsina',
    spiritualDomain: '등 뒤에 온갖 씨앗을 짊어지고 피리를 불며 생명력과 웃음을 퍼뜨리는 유쾌한 방랑자',
    healingMedicine: '굳어버린 심장을 말랑말랑하게 녹이고 삶에 생기와 창의적 유머를 되찾아주는 음악 의식',
    ceremonialSeason: '봄날 파종 제의',
    kachinaBlessingAffirmation: '삶을 너무 심각하게 쥐려 하지 말고 한 곡의 아름다운 춤과 피리 소리처럼 가볍게 즐기십시오.',
  },
  {
    id: 'angwusnasomtaka-crow-mother',
    nameKo: '까마귀 어머니 (모든 카치나의 자비로운 어머니이자 영적 입문관)',
    hopiName: 'Angwusnasomtaka (Crow Mother)',
    spiritualDomain: '어린 영혼을 영적 성인으로 도약시키는 자비로운 훈육과 깊은 모성적 카르마 정화',
    healingMedicine: '과거의 상처와 두려운 기억을 지혜의 양분으로 승화시키는 근본적 영혼 치유력',
    ceremonialSeason: '파와무 입문 의식 (Powamuya)',
    kachinaBlessingAffirmation: '당신이 겪은 모든 시련은 당신을 더 깊고 강인한 영혼으로 빚어내기 위한 성스러운 입문이었습니다.',
  },
  {
    id: 'mastop-death-rebirth',
    nameKo: '마스톱 카치나 (지하 세계의 신비와 대지 다산의 씨앗)',
    hopiName: 'Mastop Katsina',
    spiritualDomain: '보이지 않는 땅속 깊은 곳에서 생명의 씨앗을 일깨우는 신비로운 잠재력의 수호자',
    healingMedicine: '무의식의 깊은 그림자를 수용하고 내면의 잠자던 거대한 잠재의식을 깨우는 힘',
    ceremonialSeason: '소얄랑우 비밀 의식',
    kachinaBlessingAffirmation: '어둠을 두려워하지 마십시오. 가장 위대한 생명의 싹은 아무도 보지 않는 땅속 어둠에서 움틉니다.',
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

export function calculateHopiFourWorldsKachina(
  profile?: UserProfile | null,
  questionArg?: string,
  nowArg?: Date,
): HopiFourWorldsReport {
  const now = nowArg ?? new Date();
  const question = (questionArg || '').trim();
  const bdate = profile?.basic?.birthdate || '1994-01-24';
  const btime = profile?.basic?.birthtime || '12:00';
  const name = profile?.basic?.name || 'zeZE';
  const seedStr = `${bdate}_${btime}_${name}_${question}_hopi_kachina_v2`;
  const seed = djb2Hash(seedStr);

  const fourWorldsEvolutionScore = 61 + (seed % 38);
  const koyaanisqatsiHealingPower = 64 + ((seed >> 2) % 35);
  const kivaSacredCenterAlignment = 59 + ((seed >> 4) % 41);
  const spiderGrandmotherWisdom = 66 + ((seed >> 6) % 33);

  const kachinaIdx = seed % HOPI_KACHINAS_BASE.length;
  const base = HOPI_KACHINAS_BASE[kachinaIdx];
  const spiritResonanceScore = 68 + ((seed >> 8) % 31);

  const dominantKachina: HopiKachinaSpirit = {
    ...base,
    spiritResonanceScore,
  };

  const qLower = question.toLowerCase();
  const questionTheme: 'balance' | 'relationship' | 'decision' | 'renewal' =
    /관계|연애|사람|가족|친구|갈등|이별/.test(qLower)
      ? 'relationship'
      : /선택|결정|진로|일|직장|사업|방향/.test(qLower)
        ? 'decision'
        : /시작|새로|변화|도전|전환/.test(qLower)
          ? 'renewal'
          : 'balance';

  const WORLD_STAGES = [
    '제1세계 토크펠라(Tokpela) — 본래의 순수한 조화와 첫 호흡 회복',
    '제2세계 토크파(Tokpa) — 물질·소유의 집착을 비우고 균형 회복',
    '제3세계 쿠스쿠르자(Kuskurza) — 속도와 조급함을 멈추고 겸허히 성찰',
    '제4세계 투와카치(Tuwaqachi) — 대지와의 겸허한 동행 및 현존 실천',
  ];
  const activeWorldStage = WORLD_STAGES[seed % WORLD_STAGES.length];

  const situationalHopiAudit = {
    questionTheme,
    activeWorldStage,
    koyaanisqatsiAlert: questionTheme === 'decision'
      ? '조급한 확장보다 삶의 리듬이 무너지지 않는 단순한 길을 우선 점검하세요.'
      : '일상의 속도가 너무 빨라져 내면의 중심(Kiva)을 놓치고 있지 않은지 살피는 시점입니다.',
    spiderWebInsight: '거미할머니의 그물처럼 모든 인연과 선택은 눈에 보이지 않는 실로 이어져 있으니, 작은 친절과 성실함이 전체 흐름을 바로 세웁니다.',
  };

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstMonth = kstDate.getUTCMonth() + 1;
  const calculatedAtKst = kstDate.toISOString().replace('T', ' ').slice(0, 16) + ' KST';

  const kivaSolarWindow = kstHour >= 5 && kstHour < 10
    ? '동쪽 지평선 태양 맞이창 (새 날의 감사와 옥수수가루 봉헌)'
    : kstHour >= 10 && kstHour < 17
      ? '메사(Mesa) 고원 한낮창 (성실한 노동과 현실 접지)'
      : kstHour >= 17 && kstHour < 22
        ? '석양 귀환창 (하루의 불균형을 내려놓는 정화)'
        : '키바(Kiva) 지하 성소 심야창 (대지모신과의 고요한 내면 대화)';

  const ceremonialCycle = kstMonth >= 12 || kstMonth <= 2
    ? '소얄랑우 동지 순환절 (빛의 귀환과 새 서약)'
    : kstMonth >= 3 && kstMonth <= 5
      ? '파와무 봄 파종절 (씨앗 싹틔우기와 인내)'
      : kstMonth >= 6 && kstMonth <= 8
        ? '니만 여름 단비절 (결실과 감사의 회향)'
        : '가을 수확 정리절 (겨울을 대비한 소박한 갈무리)';

  const temporalHopiRhythm = {
    calculatedAtKst,
    kivaSolarWindow,
    ceremonialCycle,
    rhythmGuidance: `${kivaSolarWindow}과 ${ceremonialCycle}이 맞물려 있습니다. 거창한 계획보다 오늘 발딛고 선 자리의 평화부터 돌보세요.`,
  };

  const hopiSynthesisMatrix = {
    kachinaWorldNexus: `${dominantKachina.nameKo} × ${activeWorldStage.split(' — ')[0]}`,
    groundingPosture: koyaanisqatsiHealingPower >= 78
      ? '일상의 흔들림을 스스로 다잡고 대지의 중심에 단단히 뿌리내리는 국면'
      : '복잡한 소음을 잠시 끄고 키바의 고요함 속으로 돌아가 숨을 고르는 회복 국면',
    peaceDirective: dominantKachina.kachinaBlessingAffirmation,
  };

  const hopiProphecyGuidance = `호피족의 평화 예언은 세상이 균형을 잃고 요동치는 '코양니스카시(Koyaanisqatsi)'의 시기일수록, 대지와 겸허히 소통하는 소박한 영혼만이 제4세계(Tuwaqachi)의 안식을 누린다고 전합니다. 현재 [${dominantKachina.nameKo}]의 성스러운 가호를 받아 내면의 중심을 바로잡으십시오.`;

  const pikiBreadSacredOffering = `신발을 벗고 잠시 조용히 서서 발바닥 아래 흙과 대지모신의 호흡을 느껴보십시오. 심장에서부터 어머니 대지의 심장까지 굵고 따뜻한 붉은 뿌리가 뻗어나가 당신을 든든하게 받쳐주고 있음을 자각하십시오.`;

  return {
    engineVersion: HOPI_FOUR_WORLDS_ENGINE_VERSION,
    timestamp: now.toISOString(),
    fourWorldsEvolutionScore,
    koyaanisqatsiHealingPower,
    kivaSacredCenterAlignment,
    spiderGrandmotherWisdom,
    dominantKachina,
    situationalHopiAudit,
    temporalHopiRhythm,
    hopiSynthesisMatrix,
    hopiProphecyGuidance,
    pikiBreadSacredOffering,
    boundaryNotice: '아메리카 호피족 구전 지혜와 카치나 상징을 빌려 온 정성적 성찰 관점이며, 확정적 예언이나 의학적·재정적 처방이 아닙니다.',
  };
}

export function formatHopiFourWorldsPrompt(report: HopiFourWorldsReport): string {
  const k = report.dominantKachina;
  return `[아메리카 호피족 4대 우주 시대 & 카치나 정령 지혜 실측 데이터 (${report.engineVersion})]
- 질문 맥락 감사: 테마(${report.situationalHopiAudit.questionTheme}) · 세계 순환(${report.situationalHopiAudit.activeWorldStage})
  * 코양니스카시 점검: ${report.situationalHopiAudit.koyaanisqatsiAlert}
  * 거미할머니 통찰: ${report.situationalHopiAudit.spiderWebInsight}
- 시공간 키바 리듬 (${report.temporalHopiRhythm.calculatedAtKst}): ${report.temporalHopiRhythm.kivaSolarWindow} / ${report.temporalHopiRhythm.ceremonialCycle}
  * 리듬 지침: ${report.temporalHopiRhythm.rhythmGuidance}
- 주재 수호 카치나 정령: ${k.nameKo} (${k.hopiName} / ${k.ceremonialSeason})
  * 영적 영역: ${k.spiritualDomain}
  * 치유의 약성: ${k.healingMedicine}
  * 축복 확언: ${k.kachinaBlessingAffirmation}
- 카치나 교차 매트릭스: ${report.hopiSynthesisMatrix.kachinaWorldNexus} — ${report.hopiSynthesisMatrix.groundingPosture}
- 호피 평화 예언 지혜 지침: ${report.hopiProphecyGuidance}
- 대지모신 연결 평화 리추얼: ${report.pikiBreadSacredOffering}
- 해석 경계: ${report.boundaryNotice}`;
}
