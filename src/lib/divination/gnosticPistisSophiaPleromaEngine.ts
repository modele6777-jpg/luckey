/**
 * 고대 영지주의(Gnosticism) 피스티스 소피아 12에온 & 플레로마 영적 각성 엔진 (gnosticPistisSophiaPleromaEngine.ts)
 *
 * 2~3세기 알렉산드리아 나그 함마디 문서(Nag Hammadi library) 및 '피스티스 소피아(Pistis Sophia)' 원전 전승 기반:
 * 물질계의 결핍과 데미우르고스(Demiurge) 및 7대 아르콘(Archons)의 운명 통제망(Heimarmene)을 꿰뚫고,
 * 내면에 잠재된 신성한 영적 불꽃인 '프뉴마(Pneuma)'를 직관적 영지인 '그노시스(Gnosis)'로 점화하며,
 * 신성한 빛의 충만한 영역인 '플레로마(Pleroma)'와 12대 에온(Aeons)의 영적 방사체로 귀환하는 영혼 해방 엔진.
 *
 * 12대 신성 에온(Twelve Divine Aeons):
 * 1. 누스 (Nous) - 신성한 직관적 지성
 * 2. 알레테이아 (Aletheia) - 가면 없는 원초적 진리
 * 3. 로고스 (Logos) - 시공간을 정렬하는 살아있는 말씀
 * 4. 조에 (Zoe) - 마르지 않는 영원한 생명력
 * 5. 안트로포스 (Anthropos) - 태초의 순수한 영적 인간 원형
 * 6. 에클레시아 (Ecclesia) - 빛의 존재들의 거룩한 연대
 * 7. 비토스 (Bythos) - 모든 것의 근원인 무한한 신성 심연
 * 8. 시게 (Sige) - 소음을 잠재우는 원초적 거룩한 침묵
 * 9. 소피아 (Sophia) - 진리를 향해 하강했다 비상하는 신성 지혜
 * 10. 텔레토스 (Theletos) - 신성한 목적을 실현하는 절대 의지
 * 11. 아가페 (Agape) - 조건과 거래가 없는 우주적 순수 사랑
 * 12. 피스티스 (Pistis) - 흔들림 없는 내면의 빛에 대한 신뢰
 */

import type { UserProfile } from '../sharedState';

export const GNOSTIC_PISTIS_SOPHIA_PLEROMA_ENGINE_VERSION = '1.0.0';

export interface DivineAeon {
  id: string;
  nameKo: string;
  greekName: string;
  divineAttribute: string;
  illuminationGift: string;
  resonanceScore: number; // 0 ~ 100 공명도
}

export interface GnosticPistisSophiaPleromaReport {
  engineVersion: string;
  timestamp: string;
  pneumaSpiritualSparkScore: number; // 0 ~ 100 프뉴마(신성한 불꽃) 각성도
  gnosisLiberationIndex: number; // 0 ~ 100 그노시스(직관적 영지) 해방 지수
  archonMatrixDissolutionRate: number; // 0 ~ 100 아르콘 통제망 탈각율
  pleromaLightFullnessScore: number; // 0 ~ 100 플레로마(빛의 충만) 조화도
  primaryAeon: DivineAeon; // 가장 강력히 공명하는 주재 에온
  secondaryAeon: DivineAeon; // 보조 가이드 에온
  sophiaRepentanceStage: string; // 소피아의 13대 회개 관문 중 현재 단계
  gnosticAwakeningGuidance: string; // 영지주의 해방 지침
  pneumaIgnitionRitual: string; // 프뉴마 점화 명상 리추얼
}

const TWELVE_AEONS_BASE: Omit<DivineAeon, 'resonanceScore'>[] = [
  {
    id: 'nous',
    nameKo: '누스',
    greekName: 'Nous',
    divineAttribute: '신성한 직관적 지성',
    illuminationGift: '물질계의 환영을 단번에 꿰뚫어 보는 본질적 혜안',
  },
  {
    id: 'aletheia',
    nameKo: '알레테이아',
    greekName: 'Aletheia',
    divineAttribute: '가면 없는 원초적 진리',
    illuminationGift: '자아를 속이는 모든 기만과 사회적 가식을 허무는 순수성',
  },
  {
    id: 'logos',
    nameKo: '로고스',
    greekName: 'Logos',
    divineAttribute: '시공간을 정렬하는 살아있는 말씀',
    illuminationGift: '혼돈 속에서 창조적 질서와 확고한 방향성을 세우는 언어력',
  },
  {
    id: 'zoe',
    nameKo: '조에',
    greekName: 'Zoe',
    divineAttribute: '마르지 않는 영원한 생명력',
    illuminationGift: '육체적 한계를 넘어 영혼 자체에서 솟아나는 활력과 회복력',
  },
  {
    id: 'anthropos',
    nameKo: '안트로포스',
    greekName: 'Anthropos',
    divineAttribute: '태초의 순수한 영적 인간 원형',
    illuminationGift: '물질에 갇힌 유한한 자아가 아닌 우주적 신성한 존재로서의 자각',
  },
  {
    id: 'ecclesia',
    nameKo: '에클레시아',
    greekName: 'Ecclesia',
    divineAttribute: '빛의 존재들의 거룩한 연대',
    illuminationGift: '고립된 고독을 깨고 같은 영적 주파수를 지닌 소울메이트와의 공명',
  },
  {
    id: 'bythos',
    nameKo: '비토스',
    greekName: 'Bythos',
    divineAttribute: '모든 것의 근원인 무한한 신성 심연',
    illuminationGift: '판단과 분별이 멈춘 태초의 평온 속에서 얻는 궁극의 안식',
  },
  {
    id: 'sige',
    nameKo: '시게',
    greekName: 'Sige',
    divineAttribute: '소음을 잠재우는 원초적 거룩한 침묵',
    illuminationGift: '마음의 분주한 독백을 꺼뜨리고 빛의 음성을 듣는 경청의 힘',
  },
  {
    id: 'sophia',
    nameKo: '소피아',
    greekName: 'Sophia',
    divineAttribute: '하강을 거쳐 빛으로 비상하는 신성 지혜',
    illuminationGift: '어둠과 방황의 경험을 지고한 영적 나침반으로 바꾸어내는 연금술',
  },
  {
    id: 'theletos',
    nameKo: '텔레토스',
    greekName: 'Theletos',
    divineAttribute: '신성한 목적을 실현하는 절대 의지',
    illuminationGift: '의심과 유혹 앞에서도 영혼의 사명을 끝까지 밀고 나가는 부동심',
  },
  {
    id: 'agape',
    nameKo: '아가페',
    greekName: 'Agape',
    divineAttribute: '조건과 거래가 없는 우주적 순수 사랑',
    illuminationGift: '타인의 허물과 결핍을 감싸 안는 편견 없는 온기',
  },
  {
    id: 'pistis',
    nameKo: '피스티스',
    greekName: 'Pistis',
    divineAttribute: '흔들림 없는 내면의 빛에 대한 신뢰',
    illuminationGift: '눈앞의 상황이 캄캄할 때조차 플레로마의 귀환을 의심치 않는 믿음',
  },
];

const SOPHIA_REPENTANCE_STAGES = [
  '제1회개: 혼돈의 깊은 물속에서 빛의 근원을 올려다보며 부르짖음',
  '제4회개: 어둠의 아르콘들이 가하는 시련 속에서 신성한 빛의 불꽃을 사수함',
  '제7회개: 거짓 지배자들의 환영을 꿰뚫고 본래의 순수한 영적 지위를 기억함',
  '제9회개: 자아의 교만을 내려놓고 플레로마의 참된 조화에 의식을 맡김',
  '제13회개: 모든 족쇄를 끊고 플레로마의 빛의 방주에 안착하여 대자유를 얻음',
];

export interface GnosticPistisSophiaPleromaOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateGnosticPistisSophiaPleroma(
  optionsOrProfile?: GnosticPistisSophiaPleromaOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): GnosticPistisSophiaPleromaReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as GnosticPistisSophiaPleromaOptions;
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

  let seed = 91237;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 31) % 1000003;

  const aeonsWithScores = TWELVE_AEONS_BASE.map((aeon, idx) => {
    const score = 48 + ((seed * (idx + 3) + idx * 19) % 50);
    return { ...aeon, resonanceScore: Math.min(98, Math.max(38, score)) };
  });

  aeonsWithScores.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const primaryAeon = aeonsWithScores[0];
  const secondaryAeon = aeonsWithScores[1];

  const pneumaSpiritualSparkScore = Math.min(100, Math.max(45, Math.floor((primaryAeon.resonanceScore + secondaryAeon.resonanceScore) / 2)));
  const gnosisLiberationIndex = Math.min(100, Math.max(40, 52 + ((seed * 23) % 45)));
  const archonMatrixDissolutionRate = Math.min(100, Math.max(42, 50 + ((seed * 29) % 47)));
  const pleromaLightFullnessScore = Math.min(100, Math.max(48, Math.floor((pneumaSpiritualSparkScore * 0.5 + gnosisLiberationIndex * 0.5))));

  const stageIdx = (seed + now.getUTCDate()) % SOPHIA_REPENTANCE_STAGES.length;
  const sophiaRepentanceStage = SOPHIA_REPENTANCE_STAGES[stageIdx];

  const gnosticAwakeningGuidance = `당신은 물질계의 결핍에 종속된 피조물이 아니라, 플레로마의 빛에서 발원한 순수한 '프뉴마(영적 불꽃)'입니다. 현재 주재 에온 [${primaryAeon.nameKo}(${primaryAeon.greekName})]이 부여하는 [${primaryAeon.illuminationGift}]을 가동할 때 아르콘의 망상이 해체됩니다.`;
  const pneumaIgnitionRitual = `가슴 한가운데 꺼지지 않는 황금빛 백색 불꽃을 관조하며 선언하십시오: "나는 이 세상에 속해 있으나 이 세상의 물질적 조건에 갇히지 않는다. 내 안의 프뉴마는 플레로마의 영원한 빛과 하나이다."`;

  return {
    engineVersion: GNOSTIC_PISTIS_SOPHIA_PLEROMA_ENGINE_VERSION,
    timestamp: now.toISOString(),
    pneumaSpiritualSparkScore,
    gnosisLiberationIndex,
    archonMatrixDissolutionRate,
    pleromaLightFullnessScore,
    primaryAeon,
    secondaryAeon,
    sophiaRepentanceStage,
    gnosticAwakeningGuidance,
    pneumaIgnitionRitual,
  };
}

export function formatGnosticPistisSophiaPleromaPrompt(rep: GnosticPistisSophiaPleromaReport): string {
  return `[고대 영지주의(Gnosticism) 피스티스 소피아 12에온 & 플레로마 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 프뉴마(영적 불꽃) 각성도: ${rep.pneumaSpiritualSparkScore}/100 | 그노시스(영지) 해방 지수: ${rep.gnosisLiberationIndex}/100
· 아르콘 통제망 탈각율: ${rep.archonMatrixDissolutionRate}/100 | 플레로마 빛의 충만도: ${rep.pleromaLightFullnessScore}/100
· 주재 공명 에온: [${rep.primaryAeon.nameKo} (${rep.primaryAeon.greekName})] — 공명도 ${rep.primaryAeon.resonanceScore}%
  - 신성한 속성: ${rep.primaryAeon.divineAttribute}
  - 영적 조명 은사: ${rep.primaryAeon.illuminationGift}
· 보조 에온: [${rep.secondaryAeon.nameKo} (${rep.secondaryAeon.greekName})] — 공명도 ${rep.secondaryAeon.resonanceScore}%
· 소피아의 영혼 정화 관문: ${rep.sophiaRepentanceStage}
· 영지주의 각성 지침: ${rep.gnosticAwakeningGuidance}
· 프뉴마 점화 명상 리추얼: ${rep.pneumaIgnitionRitual}`;
}
