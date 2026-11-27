/**
 * 카발라 조하르(Zohar) 5대 영혼 층위 & 에인 소프 신성 상승 엔진 (kabbalisticZoharFiveSoulLevelsEngine.ts)
 *
 * 유대 신비주의 카발라(Kabbalah)의 위대한 고전 《조하르(Zohar - 광명의 서)》 및 아리(Isaac Luria)의 루리아닉 카발라 원전 기반:
 * 인간 영혼이 물질계에서 무한자 에인 소프(Ein Sof)에 이르는 5대 신성 층위 체계.
 *
 * 5대 영혼 층위(Five Soul Levels / Nefesh to Yechidah):
 * 1. 네페쉬(Nefesh) - 아시야(행위계): 육체에 깃든 원초적 생명력, 신체적 활력과 지상의 접지력
 * 2. 루아흐(Ruach) - 예치라(형성계): 감정과 마음의 호흡, 도덕적 식견과 아름다운 정서적 조화
 * 3. 네샤마(Neshama) - 베리아(창조계): 직관적 지성과 신성한 지혜, 영혼의 순수한 통찰력
 * 4. 하야(Chayah) - 아칠루트(유출계): 보편적 생명의 숨결, 시공간을 초월한 신성과의 깊은 유대
 * 5. 예히다(Yechidah) - 에인 소프(무한자): 창조주와 하나 되는 영혼의 가장 깊은 신성한 단일성
 *
 * 영혼의 어두운 껍질인 클리포트(Qlippoth)를 벗겨내고,
 * 영혼의 교정(Tikkun)과 신성의 현존인 셰키나(Shekhinah)를 온전히 맞이하는 영적 진화 엔진.
 */

import type { UserProfile } from '../sharedState';

export const KABBALISTIC_ZOHAR_SOUL_ENGINE_VERSION = '2.4.0';

export interface KabbalisticSoulLevel {
  id: string;
  nameKo: string;
  hebrew: string;
  kabbalisticWorld: string; // 아시야, 예치라, 베리아, 아칠루트, 에인소프
  soulDomain: string;
  divineIllumination: string;
  resonanceScore: number; // 0 ~ 100 공명도
}

export interface KabbalisticZoharSoulReport {
  engineVersion: string;
  timestamp: string;
  yechidahDivineSparkScore: number; // 내부 참조용 (프롬프트 비노출)
  tikkunSoulCorrectionProgress: number; // 내부 참조용 (프롬프트 비노출)
  shekhinahDivinePresenceIndex: number; // 내부 참조용 (프롬프트 비노출)
  qlippothShellPurificationRate: number; // 내부 참조용 (프롬프트 비노출)
  dominantSoulLevel: KabbalisticSoulLevel; // 현재 주재하는 영혼 층위
  secondarySoulLevel: KabbalisticSoulLevel; // 보조 영혼 층위
  situationalZoharAudit: {
    questionTheme: 'grounding' | 'emotion' | 'insight' | 'calling';
    tikkunTask: string;
    qlippothBarrier: string;
    kelimGuidance: string;
  };
  temporalZoharRhythm: {
    calculatedAtKst: string;
    sephirothWatchWindow: string;
    shabbatCycle: string;
    rhythmGuidance: string;
  };
  zoharSynthesisMatrix: {
    primarySecondaryNexus: string;
    ascensionPosture: string;
    tikkunDirective: string;
    zoharCrossAxis: string;
  };
  zoharKabbalahGuidance: string; // 조하르 지혜 지침
  einSofLightAscensionRitual: string; // 에인 소프 무한의 빛 상승 리추얼
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

const ZOHAR_SOUL_LEVELS_BASE: Omit<KabbalisticSoulLevel, 'resonanceScore'>[] = [
  {
    id: 'yechidah',
    nameKo: '예히다 (신성한 단일성)',
    hebrew: 'Yechidah (יְחִידָה)',
    kabbalisticWorld: '에인 소프 (Ein Sof - 무한자)',
    soulDomain: '영혼의 가장 깊은 신성한 핵이자 창조주와의 절대적 일체감',
    divineIllumination: '어떤 물질적 한계나 트라우마도 침범할 수 없는 영혼의 불멸하는 신성한 순수성',
  },
  {
    id: 'chayah',
    nameKo: '하야 (보편적 생명체)',
    hebrew: 'Chayah (חַיָּה)',
    kabbalisticWorld: '아칠루트 (Atziluth - 유출계)',
    soulDomain: '우주 전체의 거대한 생명 그물망과 온전히 공명하는 초의식적 활력',
    divineIllumination: '개인의 고립감을 벗어나 만인과 만물을 향해 뿜어져 나오는 지극한 자비와 축복',
  },
  {
    id: 'neshama',
    nameKo: '네샤마 (직관적 영적 지성)',
    hebrew: 'Neshama (נְשָׁמָה)',
    kabbalisticWorld: '베리아 (Beriah - 창조계)',
    soulDomain: '신성한 통찰과 진리를 꿰뚫어 보는 고차원적 영혼의 오성',
    divineIllumination: '혼란스러운 세상 속에서 삶의 깊은 의미와 영적 소명을 명확히 분별하는 혜안',
  },
  {
    id: 'ruach',
    nameKo: '루아흐 (정서적 마음의 숨결)',
    hebrew: 'Ruach (רוּחַ)',
    kabbalisticWorld: '예치라 (Yetzirah - 형성계)',
    soulDomain: '가슴의 정서, 도덕적 지향, 따뜻한 인간애와 생동하는 열정',
    divineIllumination: '거친 분노와 불안을 극복하고 타인과 조화로운 관계를 엮어내는 마음의 아름다움',
  },
  {
    id: 'nefesh',
    nameKo: '네페쉬 (생명력과 물질적 접지)',
    hebrew: 'Nefesh (נֶפֶשׁ)',
    kabbalisticWorld: '아시야 (Asiyah - 행위계)',
    soulDomain: '육체적 생명 유지, 지구 대지와의 연결, 현실적 의지력과 행동력',
    divineIllumination: '현실의 삶을 건강하고 풍요롭게 가꾸며 구체적인 열매를 맺게 하는 강인한 생명력',
  },
];

export interface KabbalisticZoharSoulOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateKabbalisticZoharSoul(
  optionsOrProfile?: KabbalisticZoharSoulOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): KabbalisticZoharSoulReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as KabbalisticZoharSoulOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 95231;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 53) % 1000003;

  const soulLevels: KabbalisticSoulLevel[] = ZOHAR_SOUL_LEVELS_BASE.map((lvl, idx) => {
    const score = 47 + ((seed * (idx + 4) + idx * 33) % 52);
    return { ...lvl, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  soulLevels.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantSoulLevel = soulLevels[0];
  const secondarySoulLevel = soulLevels[1];

  const yechidahDivineSparkScore = Math.min(100, Math.max(45, 53 + ((seed * 29) % 45)));
  const tikkunSoulCorrectionProgress = Math.min(100, Math.max(42, 51 + ((seed * 23) % 47)));
  const shekhinahDivinePresenceIndex = Math.min(100, Math.max(44, 52 + ((seed * 19) % 46)));
  const qlippothShellPurificationRate = Math.min(100, Math.max(46, Math.floor((tikkunSoulCorrectionProgress * 0.5 + yechidahDivineSparkScore * 0.5))));

  const qLower = question.toLowerCase();
  const questionTheme: 'grounding' | 'emotion' | 'insight' | 'calling' =
    /일|직장|돈|건강|생활|현실|실행/.test(qLower)
      ? 'grounding'
      : /관계|연애|감정|마음|사랑|가족|이별/.test(qLower)
        ? 'emotion'
        : /선택|결정|방향|진로|고민|의미/.test(qLower)
          ? 'insight'
          : 'calling';

  const situationalZoharAudit = {
    questionTheme,
    tikkunTask: `${dominantSoulLevel.nameKo}의 빛을 일상 속 작은 행동과 태도로 연결하는 티쿤(회복)`,
    qlippothBarrier: questionTheme === 'emotion'
      ? '과거의 서운함이나 방어심이 만든 감정적 껍질(클리포트)'
      : '결과를 미리 통제하려는 조급함과 두려움의 껍질(클리포트)',
    kelimGuidance: '빛이 머물 수 있는 고요하고 단단한 마음의 그릇(Kelim)을 먼저 비워 두세요.',
  };

  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const kstHour = kstDate.getUTCHours();
  const kstDay = kstDate.getUTCDay();
  const calculatedAtKst = kstDate.toISOString().replace('T', ' ').slice(0, 16) + ' +09:00 (KST)';

  const sephirothWatchWindow = kstHour >= 5 && kstHour < 11
    ? '헤세드(자비) 아침 파수창 (네샤마의 맑은 통찰과 선한 의도 점화)'
    : kstHour >= 11 && kstHour < 17
      ? '티페레트(조화) 한낮 파수창 (루아흐와 네페쉬의 현실적 균형)'
      : kstHour >= 17 && kstHour < 22
        ? '게부라(절제) 저녁 파수창 (하루의 껍질을 벗겨내는 성찰)'
        : '비나·예히다 심야 파수창 (티쿤 하초트·고요한 영혼의 회복)';

  const shabbatCycle = kstDay === 5 || kstDay === 6
    ? '셰키나 안식 순환 (비움과 쉼을 통한 빛의 충전)'
    : '아시야 행위 순환 (작은 성실함으로 빛의 그릇을 빚는 주간)';

  const temporalZoharRhythm = {
    calculatedAtKst,
    sephirothWatchWindow,
    shabbatCycle,
    rhythmGuidance: `${sephirothWatchWindow}과 ${shabbatCycle}이 교차합니다. 거창한 도약보다 오늘 마음의 그릇을 맑게 닦는 한 걸음에 집중하세요.`,
  };

  const zoharCrossAxis = `[${dominantSoulLevel.nameKo}] × [${secondarySoulLevel.nameKo}] × [${questionTheme}] × [${sephirothWatchWindow.split('(')[0].trim()}]`;
  const zoharSynthesisMatrix = {
    primarySecondaryNexus: `${dominantSoulLevel.nameKo} × ${secondarySoulLevel.nameKo}`,
    ascensionPosture: tikkunSoulCorrectionProgress >= 75
      ? '내면의 그림자 껍질이 얇아져 높은 영혼 층위의 직관이 일상과 자연스럽게 이어지는 국면'
      : '네페쉬·루아흐의 생활 리듬을 다지며 티쿤의 기반을 차분히 회복하는 국면',
    tikkunDirective: dominantSoulLevel.divineIllumination,
    zoharCrossAxis,
  };

  const zoharKabbalahGuidance = `당신의 영혼은 단순한 육체적 한계를 넘어 거룩한 신성의 빛줄기로 연결되어 있습니다. 현재 강력히 진동하는 층위는 [${dominantSoulLevel.nameKo}]입니다. ${dominantSoulLevel.divineIllumination}의 은총을 자각하십시오. 껍질(클리포트)의 두려움을 벗어던질 때 영혼의 참된 그릇(Kelim)이 완성됩니다.`;
  const einSofLightAscensionRitual = `정수리 위로 찬란한 무한의 백색광이 쏟아져 온몸의 차크라를 정화하는 모습을 그리십시오: "에인 소프 오르(Ein Sof Or), 무한한 신성의 빛이 내 영혼을 회복시키며 거룩한 셰키나의 평화가 깃든다."`;

  const ritualAction = `[${dominantSoulLevel.nameKo}] ${einSofLightAscensionRitual}`;
  const reflectionFocus = `오늘 '${situationalZoharAudit.questionTheme}' 영역에서 마음의 그릇(Kelim)을 맑게 비우기 위해 내려놓을 껍질(클리포트)은 무엇인가요?`;
  const qClean = question.trim();
  const reflectiveQuestion = qClean
    ? `지금 "${qClean}" 앞에서 ${dominantSoulLevel.nameKo}의 빛이 머물 수 있도록 오늘 비워 낼 마음의 껍질(클리포트) 하나는 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: KABBALISTIC_ZOHAR_SOUL_ENGINE_VERSION,
    timestamp: now.toISOString(),
    yechidahDivineSparkScore,
    tikkunSoulCorrectionProgress,
    shekhinahDivinePresenceIndex,
    qlippothShellPurificationRate,
    dominantSoulLevel,
    secondarySoulLevel,
    situationalZoharAudit,
    temporalZoharRhythm,
    zoharSynthesisMatrix,
    zoharKabbalahGuidance,
    einSofLightAscensionRitual,
    boundaryNotice: '카발라 《조하르》의 5대 영혼 층위 상징을 빌려 온 정성적 성찰 관점이며, 확정적 예언이나 의학적·재정적 처방이 아닙니다.',
    interpretiveBoundary: '카발라 《조하르》의 5대 영혼 층위 상징을 빌려 온 정성적 성찰 관점이며, 확정적 예언이나 의학적·재정적 처방이 아닙니다.',
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
  };
}

export function formatKabbalisticZoharSoulPrompt(rep: KabbalisticZoharSoulReport): string {
  return `[카발라 조하르(Zohar) 5대 영혼 층위 & 에인 소프 신성 상승 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 주재 영혼 층위: [${rep.dominantSoulLevel.nameKo} (${rep.dominantSoulLevel.hebrew})]
  - 카발라 세계: ${rep.dominantSoulLevel.kabbalisticWorld}
  - 영혼 영역: ${rep.dominantSoulLevel.soulDomain}
  - 신성 조명 은사: ${rep.dominantSoulLevel.divineIllumination}
· 보조 영혼 층위: [${rep.secondarySoulLevel.nameKo} (${rep.secondarySoulLevel.hebrew})]
· 질문 맥락 감사: 테마(${rep.situationalZoharAudit.questionTheme}) · 티쿤 과제: ${rep.situationalZoharAudit.tikkunTask}
  - 정화할 껍질: ${rep.situationalZoharAudit.qlippothBarrier} | 그릇 지침: ${rep.situationalZoharAudit.kelimGuidance}
· 시공간 세피로트 리듬 (${rep.temporalZoharRhythm.calculatedAtKst}): ${rep.temporalZoharRhythm.sephirothWatchWindow} / ${rep.temporalZoharRhythm.shabbatCycle}
  - 리듬 지침: ${rep.temporalZoharRhythm.rhythmGuidance}
· 영혼 교차 매트릭스: ${rep.zoharSynthesisMatrix.primarySecondaryNexus} — ${rep.zoharSynthesisMatrix.ascensionPosture}
· 4중 교차 축: ${rep.zoharSynthesisMatrix.zoharCrossAxis}
· 조하르 카발라 지혜 지침: ${rep.zoharKabbalahGuidance}
· 에인 소프 빛의 상승 리추얼: ${rep.einSofLightAscensionRitual}
· 실천 의례(Ritual Action): ${rep.ritualAction}
· 성찰 초점(Reflection Focus): ${rep.reflectionFocus}
· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: ${rep.boundaryNotice}`;
}
