/**
 * 페르시아 수피즘 파리두딘 아타르 '새들의 회의' 7대 계곡 & 시무르그 신성 자아 투영 엔진 (persianAttarSevenValleysEngine.ts)
 *
 * 12세기 페르시아 수피 신비주의 시성 파리두딘 아타르(Farid ud-Din Attar)의 필생의 대작 《새들의 회의(Mantiq al-Tayr)》 원전 기반:
 * 후투티(Hudhud) 새의 인도를 받아 궁극의 왕 시무르그(Simurgh)를 찾아 떠나는 7대 영혼의 계곡(Seven Valleys / Haft Vadi) 순례 체계.
 *
 * 7대 계곡(The Seven Valleys):
 * 1. 탐구의 계곡 (Talab - Valley of Quest): 세속의 익숙함을 벗어던지고 진정한 진리를 갈망하는 영혼의 첫 발
 * 2. 사랑의 계곡 (Ishq - Valley of Love): 차가운 계산적 이성을 녹이고 가슴을 불태우는 헌신적인 사랑
 * 3. 지식의 계곡 (Ma'rifat - Valley of Insight/Gnosis): 만물의 이면에 깃든 신성한 신비를 직관으로 꿰뚫어 보는 지혜
 * 4. 초연의 계곡 (Istighna - Valley of Detachment): 우주의 광대함 속에서 모든 세속적 애착과 소유욕을 초월한 무집착
 * 5. 유일성의 계곡 (Tawhid - Valley of Unity): 만유의 다양성 속에서 오직 하나의 신성한 실재만을 보는 합일
 * 6. 경이의 계곡 (Hayrat - Valley of Bewilderment/Awe): 신비의 찬란함 앞에서 언어와 생각을 잃고 전율하는 거룩한 침묵
 * 7. 소멸과 영속의 계곡 (Faqr wa Fana - Valley of Poverty & Annihilation): 거짓된 자아(Ego)가 소멸되고 참된 신성 자아(Baqa)로 거듭남
 *
 * 30마리의 새(Si Murgh)가 마침내 도달하여 호수를 바라보았을 때,
 * 자신들이 찾아 헤매던 위대한 왕 시무르그가 곧 거울에 비친 그들 자신이었음을 깨닫는 신성 자아 각성 엔진.
 */

import type { UserProfile } from '../sharedState';

export const ATTAR_SEVEN_VALLEYS_ENGINE_VERSION = '2.1.0';

export interface AttarValley {
  id: string;
  nameKo: string;
  persian: string;
  valleyTheme: string;
  spiritualVirtue: string;
  transcendenceGuidance: string;
  resonanceScore: number; // 0 ~ 100
}

export interface PersianAttarSevenValleysReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  simurghMirrorResonanceScore: number; // 0 ~ 100 시무르그 신성 자아 거울 공명도
  sevenValleysPassageProgress: number; // 0 ~ 100 7대 계곡 통과 진척도
  fanaEgoDissolutionRate: number; // 0 ~ 100 파나(에고 한계 소멸) 해방도
  baqaDivinePermanenceIndex: number; // 0 ~ 100 바카(신성 안에서의 영원한 현존) 지수
  dominantValley: AttarValley; // 현재 주재하는 영혼의 계곡
  secondaryValley: AttarValley; // 보조 계곡
  attarSufiWisdomGuidance: string; // 아타르 수피 지혜 지침
  simurghMirrorMeditationRitual: string; // 시무르그 신성 거울 명상 리추얼
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  attarSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatAttarKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

function buildAttarReflectiveQuestion(valley: AttarValley, question: string): string {
  const focus = question.trim();
  if (focus) {
    return `'${focus}'라는 물음을 품고 ${valley.nameKo}을 건널 때, 바깥에서 찾던 답 중 사실 내 안에서 이미 알고 있던 것은 무엇인가요?`;
  }
  return `${valley.nameKo}의 순례자 입장에서 볼 때, 지금 가장 먼저 비워 내야 할 익숙한 집착이나 체면은 무엇인가요?`;
}

function describeAttarStage(score: number): string {
  if (score >= 82) return '시무르그 거울 합일(Simurgh Mirror) — 바깥에서 찾던 왕이 곧 내 안의 참된 자아임을 직관하는 각성기';
  if (score >= 66) return '후투티 순례 순항(Hudhud Passage) — 7대 계곡의 경계를 차분히 건너며 집착을 비우는 성숙기';
  return '탈라브 첫발(Talab Threshold) — 세속의 익숙함을 내려놓고 내면의 물음을 다시 세우는 입문기';
}

const ATTAR_VALLEYS_BASE: Omit<AttarValley, 'resonanceScore'>[] = [
  {
    id: 'talab',
    nameKo: '탈라브 (탐구와 갈망의 계곡)',
    persian: 'Vadi-ye Talab (وادی طلب)',
    valleyTheme: '익숙한 안주를 깨부수고 미지의 진리를 찾아 나서는 진실한 열망',
    spiritualVirtue: '과거의 선입견과 집착을 기꺼이 내려놓고 새로운 앎을 향해 열려 있는 순수한 겸허',
    transcendenceGuidance: '마음속의 의심을 두려워하지 말고, 참된 답을 향해 한 걸음 내딛는 용기를 내십시오.',
  },
  {
    id: 'ishq',
    nameKo: '이쉬크 (신성한 사랑의 계곡)',
    persian: 'Vadi-ye Ishq (وادی عشق)',
    valleyTheme: '타산적 계산과 두려움을 녹여버리는 불타는 열정적 헌신',
    spiritualVirtue: '조건 없는 사랑 속에서 자아의 작은 이익을 잊고 기꺼이 온 존재를 내던지는 불꽃',
    transcendenceGuidance: '머리로 손익을 따지는 대신 가슴의 심장박동을 믿고 그 사랑의 불길에 몸을 맡기십시오.',
  },
  {
    id: 'marifat',
    nameKo: '마리파트 (직관적 영지와 통찰의 계곡)',
    persian: 'Vadi-ye Ma\'rifat (وادی معرفت)',
    valleyTheme: '겉모습의 환영을 뚫고 만물 속에 숨겨진 신성한 보물을 발견하는 눈',
    spiritualVirtue: '단순한 지식의 암기를 넘어 삶의 매 순간 숨은 뜻을 직관적으로 감지하는 맑은 영안',
    transcendenceGuidance: '보이는 현상 너머의 보이지 않는 인연의 섭리를 조용히 바라보십시오.',
  },
  {
    id: 'istighna',
    nameKo: '이스티그나 (초연과 무집착의 계곡)',
    persian: 'Vadi-ye Istighna (وادی استغنا)',
    valleyTheme: '우주의 무한한 웅장함 앞에서 세상의 부귀영화에 휘둘리지 않는 고결한 자유',
    spiritualVirtue: '칭찬에도 비난에도 흔들리지 않으며, 얻음과 잃음에 태연자약한 숭고한 평정',
    transcendenceGuidance: '잡으려 애태우던 손을 놓으십시오. 손을 비울 때 온 우주가 당신의 품에 들어옵니다.',
  },
  {
    id: 'tawhid',
    nameKo: '타우히드 (절대적 유일성과 합일의 계곡)',
    persian: 'Vadi-ye Tawhid (وادی توحید)',
    valleyTheme: '너와 나, 안과 밖의 분별을 지우고 모든 존재가 하나로 연결되어 있음을 보는 지혜',
    spiritualVirtue: '차별과 갈등의 고리를 끊고 만유가 하나의 신성한 춤을 추고 있음을 아는 일체감',
    transcendenceGuidance: '타인을 바라볼 때 남이 아닌 또 다른 나를 보고 있음을 온 마음으로 기억하십시오.',
  },
  {
    id: 'hayrat',
    nameKo: '하이라트 (경이와 거룩한 홀림의 계곡)',
    persian: 'Vadi-ye Hayrat (وادی حیرت)',
    valleyTheme: '인간의 언어와 논리를 훌쩍 뛰어넘는 신비의 광휘 앞에서 침묵하는 전율',
    spiritualVirtue: '모든 것을 안다는 착각을 내려놓고 어린아이와 같은 순수한 경외감으로 세계를 맞이함',
    transcendenceGuidance: '설명하려 하지 말고 다만 느끼십시오. 그 거룩한 침묵 속에 진리가 머뭅니다.',
  },
  {
    id: 'fana',
    nameKo: '파크르 와 파나 (소멸과 영속의 계곡)',
    persian: 'Vadi-ye Faqr wa Fana (وادی فقر و فنا)',
    valleyTheme: '거짓된 자아의 껍질이 햇살 아래 눈송이처럼 녹아내리고 참된 신성 자아로 영속함',
    spiritualVirtue: '에고의 종말이 곧 진정한 생명의 탄생임을 체현하는 최고의 영적 해탈과 불멸',
    transcendenceGuidance: '물방울이 대양 속으로 떨어져 마침내 대양 자체가 되는 궁극의 합일을 누리십시오.',
  },
];

export interface PersianAttarSevenValleysOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculatePersianAttarSevenValleys(
  optionsOrProfile?: PersianAttarSevenValleysOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): PersianAttarSevenValleysReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as PersianAttarSevenValleysOptions;
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

  let seed = 88417;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 47) % 1000003;

  const valleys: AttarValley[] = ATTAR_VALLEYS_BASE.map((v, idx) => {
    const score = 45 + ((seed * (idx + 3) + idx * 37) % 54);
    return { ...v, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  valleys.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantValley = valleys[0];
  const secondaryValley = valleys[1];

  const simurghMirrorResonanceScore = Math.min(100, Math.max(45, 54 + ((seed * 23) % 44)));
  const sevenValleysPassageProgress = Math.min(100, Math.max(42, 52 + ((seed * 19) % 46)));
  const fanaEgoDissolutionRate = Math.min(100, Math.max(40, 50 + ((seed * 29) % 48)));
  const baqaDivinePermanenceIndex = Math.min(100, Math.max(46, Math.floor((simurghMirrorResonanceScore * 0.5 + sevenValleysPassageProgress * 0.5))));

  const attarSufiWisdomGuidance = `당신이 평생 찾아 헤매던 참된 보물은 바깥 세상에 있지 않습니다. 당신의 영혼은 지금 [${dominantValley.nameKo}]을 건너며 성숙하고 있습니다. ${dominantValley.transcendenceGuidance} 서른 마리의 새가 카프산 정상 호수에서 마침내 마주한 왕이 바로 그들 자신이었듯, 당신의 참된 영혼 자체가 곧 눈부신 시무르그입니다.`;
  const simurghMirrorMeditationRitual = `가슴 한가운데 잔잔한 거울 같은 호수를 떠올리십시오. 그 호수 위로 찬란한 무지개 깃털을 가진 영조(靈鳥) 시무르그가 비칩니다: "내가 찾는 진리가 곧 나 자신이며, 내 안의 에고가 고요히 녹아내릴 때 영원한 신성의 숨결이 피어난다."`;

  const calculatedAtKst = formatAttarKstTimestamp(now);
  const reflectiveQuestion = buildAttarReflectiveQuestion(dominantValley, question);
  const interpretiveBoundary = '아타르 《새들의 회의》 7대 계곡과 시무르그 상징은 내면 성찰을 돕는 수피 문학적 비유로만 활용하며, 확정적 미래 예언이나 현실적 의사결정의 단독 근거로 쓰지 않습니다.';
  const composite = Math.round(
    (simurghMirrorResonanceScore + sevenValleysPassageProgress + fanaEgoDissolutionRate + baqaDivinePermanenceIndex) / 4
  );
  const attarSynthesisMatrix = {
    dominantTension: `${dominantValley.nameKo} ↔ ${secondaryValley.nameKo}`,
    alignmentState: describeAttarStage(composite),
    integratedAction: `${dominantValley.transcendenceGuidance}${question.trim() ? ` [질문 맥락: ${question.trim()}]` : ''}`,
  };

  return {
    engineVersion: ATTAR_SEVEN_VALLEYS_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    simurghMirrorResonanceScore,
    sevenValleysPassageProgress,
    fanaEgoDissolutionRate,
    baqaDivinePermanenceIndex,
    dominantValley,
    secondaryValley,
    attarSufiWisdomGuidance,
    simurghMirrorMeditationRitual,
    reflectiveQuestion,
    interpretiveBoundary,
    attarSynthesisMatrix,
  };
}

export function formatPersianAttarSevenValleysPrompt(rep: PersianAttarSevenValleysReport): string {
  const composite = Math.round(
    (rep.simurghMirrorResonanceScore + rep.sevenValleysPassageProgress + rep.fanaEgoDissolutionRate + rep.baqaDivinePermanenceIndex) / 4
  );
  const lines = [
    `[페르시아 수피즘 아타르 '새들의 회의' 7대 계곡 & 시무르그 실측 데이터]`,
    `· 연산 시각: ${rep.calculatedAtKst} | 엔진 버전: v${rep.engineVersion}`,
    `· 수피 순례 국면: ${describeAttarStage(composite)}`,
    `· 주재 영혼의 계곡: [${rep.dominantValley.nameKo} (${rep.dominantValley.persian})]`,
    `  - 계곡 테마: ${rep.dominantValley.valleyTheme}`,
    `  - 영적 덕목: ${rep.dominantValley.spiritualVirtue}`,
    `  - 초월 지침: ${rep.dominantValley.transcendenceGuidance}`,
    `· 보조 계곡: [${rep.secondaryValley.nameKo} (${rep.secondaryValley.persian})] — ${rep.secondaryValley.valleyTheme}`,
    `· 아타르 수피 지혜 지침: ${rep.attarSufiWisdomGuidance}`,
    `· 시무르그 신성 거울 명상 리추얼: ${rep.simurghMirrorMeditationRitual}`,
  ];
  if (rep.attarSynthesisMatrix) {
    lines.push(
      `· 교차 매트릭스: [핵심 긴장: ${rep.attarSynthesisMatrix.dominantTension} | 조율 상태: ${rep.attarSynthesisMatrix.alignmentState}]`,
      `· 통합 실천: ${rep.attarSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(
    `· 성찰 질문: ${rep.reflectiveQuestion}`,
    `· 해석 경계: ${rep.interpretiveBoundary}`,
  );
  return lines.join('\n');
}
