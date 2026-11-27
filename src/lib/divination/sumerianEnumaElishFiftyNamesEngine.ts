/**
 * 고대 메소포타미아 바빌로니아 에누마 엘리시(Enuma Elish) 마르두크 50대 이름 & 4대 바람 정복 엔진 (sumerianEnumaElishFiftyNamesEngine.ts)
 *
 * 기원전 메소포타미아 바빌로니아 창세 서사시 《에누마 엘리시(Enûma Eliš)》 원전 기반:
 * 원초적 혼돈의 심연 티아마트(Tiamat)를 제압하고 우주적 질서와 문명을 수립하며
 * 신들의 회합에서 부여받은 마르두크(Marduk)의 50대 신성 칭호(Fifty Sacred Names)와 4대 바람(Shar Urbi) 지배 체계.
 *
 * 7대 핵심 신성 칭호 원형:
 * 1. 마르두크 (Marduk - 순수한 빛의 주권): 혼돈을 평정하고 삶의 명확한 주권을 바로세우는 불패의 승리
 * 2. 아사룰루두 (Asaruludu - 신성한 치유의 빛): 어둠과 번뇌의 주술을 파쇄하고 생명력을 소생시키는 광휘
 * 3. 남틸라 (Namtilla - 불멸의 생명 유지자): 위기와 고난 속에서도 생명의 불씨를 지키고 재생을 이끄는 힘
 * 4. 아사르알림 (Asaralim - 신비의 지혜 창고): 어떤 전략가도 생각지 못한 최선의 수와 지혜로운 결단을 부여함
 * 5. 투투 (Tutu - 창조적 재생과 변용): 낡고 부서진 상황을 새롭게 빚어내어 더 높은 차원으로 승화시키는 섭리
 * 6. 샤주 (Shazu - 마음의 심연을 통찰하는 자): 상대의 숨은 의도와 상황의 본질을 꿰뚫어 오판을 막는 심안
 * 7. 에피시슈 (Ephishish - 대지와 토대의 안정자): 요동치는 풍파 속에서도 흔들리지 않는 굳건한 기반을 다짐
 *
 * 4대 바람(Shar Urbi) 지배력:
 * - 북풍(절제와 냉철), 남풍(열정과 정복), 동풍(새벽의 서광과 창의), 서풍(황혼의 수용과 정화)
 */

import type { UserProfile } from '../sharedState';

export const ENUMA_ELISH_ENGINE_VERSION = '2.4.0';

export interface MardukSacredName {
  id: string;
  nameAkkadian: string;
  nameKo: string;
  domain: string;
  tiamatSubjugationPower: string;
  actionVirtue: string;
  resonanceScore: number; // 0 ~ 100
}

export interface EnumaElishFourWindsBalance {
  northWindDiscipline: number; // 북풍(냉철·절제) 0~100
  southWindPassion: number; // 남풍(열정·정복) 0~100
  eastWindDawnInspiration: number; // 동풍(창의·서광) 0~100
  westWindTwilightPurification: number; // 서풍(수용·정화) 0~100
}

export interface SumerianEnumaElishFiftyNamesReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  tiamatSubjugationOrderScore: number; // 0 ~ 100 혼돈 속 신성 질서 회복 지수
  fiftySacredNamesResonanceIndex: number; // 0 ~ 100 50대 이름 영적 공명 지수
  cosmicSovereigntyScore: number; // 0 ~ 100 우주적 주권 및 통제력
  fourWindsDominance: EnumaElishFourWindsBalance;
  dominantSacredName: MardukSacredName;
  secondarySacredName: MardukSacredName;
  enumaElishVictoryDecree: string; // 승리와 주권 선언 지침
  tabletOfDestinyGuidance: string; // 운명의 서판(Tablet of Destinies) 행동 지침
  enumaElishSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
    enumaCrossAxis: string;
  };
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
}

function formatEnumaElishKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`;
}

const MARDUK_SACRED_NAMES_BASE: Omit<MardukSacredName, 'resonanceScore'>[] = [
  {
    id: 'marduk',
    nameAkkadian: 'Marduk (마르두크)',
    nameKo: '순수한 빛의 주권자',
    domain: '모든 혼란과 갈등을 평정하고 당당한 삶의 주권을 쟁취하는 불패의 리더십',
    tiamatSubjugationPower: '내외의 두려움과 카오스를 일순간에 굴복시키는 결단력',
    actionVirtue: '자신의 선택에 확신을 가지고 당당히 상황을 주도하십시오.',
  },
  {
    id: 'asaruludu',
    nameAkkadian: 'Asaruludu (아사룰루두)',
    nameKo: '신성한 치유와 빛의 수호자',
    domain: '독소와 부정적 기운을 몰아내고 심신의 활력을 즉각 소생시키는 정화의 권능',
    tiamatSubjugationPower: '상처와 번뇌의 어둠을 태워버리고 맑은 생기를 불어넣음',
    actionVirtue: '마음의 앙금과 피로를 먼저 씻어내어 맑은 에너지를 회복하십시오.',
  },
  {
    id: 'namtilla',
    nameAkkadian: 'Namtilla (남틸라)',
    nameKo: '생명 보존과 불멸의 재생자',
    domain: '절체절명의 위기에서도 실마리를 찾아내어 다시 일어서는 회복탄력성',
    tiamatSubjugationPower: '무너진 기반 속에서도 새로운 생명의 싹을 틔워내는 재생력',
    actionVirtue: '단기적 후퇴에 실망하지 마십시오. 역전의 반등이 준비되어 있습니다.',
  },
  {
    id: 'asaralim',
    nameAkkadian: 'Asaralim (아사르알림)',
    nameKo: '비밀 지혜와 전략적 혜안의 보고',
    domain: '복잡하게 얽힌 이해관계의 매듭을 단숨에 푸는 신묘한 지혜와 조언',
    tiamatSubjugationPower: '적의 허를 찌르고 문제의 핵심 급소를 관통하는 전략적 통찰',
    actionVirtue: '감정적으로 서두르지 말고 한 수 앞을 내다보는 전략을 택하십시오.',
  },
  {
    id: 'tutu',
    nameAkkadian: 'Tutu (투투)',
    nameKo: '창조적 변용과 재창조의 주',
    domain: '낡은 관습과 한계를 부수고 전혀 새로운 질서와 패러다임을 세우는 창조성',
    tiamatSubjugationPower: '파괴된 카오스의 파편을 우주적 별자리와 문명으로 재조합함',
    actionVirtue: '익숙함에 머물지 말고 과감한 혁신과 쇄신을 시작하십시오.',
  },
  {
    id: 'shazu',
    nameAkkadian: 'Shazu (샤주)',
    nameKo: '마음의 심연을 꿰뚫는 심안',
    domain: '타인의 숨은 동기와 상황의 이면을 꿰뚫어보아 속임수와 실수를 원천 차단함',
    tiamatSubjugationPower: '어둠 속에 감춰진 진실을 대낮의 햇빛처럼 밝혀내는 직관',
    actionVirtue: '겉으로 드러난 말보다 상대방의 진심과 상황의 맥락을 읽으십시오.',
  },
  {
    id: 'ephishish',
    nameAkkadian: 'Ephishish (에피시슈)',
    nameKo: '대지 토대의 굳건한 안정자',
    domain: '어떤 격변에도 흔들리지 않는 뿌리 깊은 안정성과 지속 가능한 번영 구축',
    tiamatSubjugationPower: '요동치는 대양의 파도를 잠재우고 단단한 대륙을 세움',
    actionVirtue: '눈앞의 요행을 피하고 기본과 원칙을 지키며 굳건한 토대를 다지십시오.',
  },
];

export interface SumerianEnumaElishFiftyNamesOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateSumerianEnumaElishFiftyNames(
  optionsOrProfile?: SumerianEnumaElishFiftyNamesOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): SumerianEnumaElishFiftyNamesReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as SumerianEnumaElishFiftyNamesOptions;
    profile = opts.profile;
    question = opts.question || '';
    now = opts.now || (opts.currentTime ? new Date(opts.currentTime) : new Date());
  } else {
    profile = optionsOrProfile as UserProfile | null | undefined;
    question = legacyContext?.question || '';
    now = legacyContext?.currentTime ? new Date(legacyContext.currentTime) : new Date();
  }

  const bdate = profile?.basic?.birthdate || (profile as unknown as { birthdate?: string; birthDate?: string })?.birthdate || (profile as unknown as { birthDate?: string })?.birthDate || '1994-01-24';
  const btime = profile?.basic?.birthtime || (profile as unknown as { birthtime?: string; birthTime?: string })?.birthtime || (profile as unknown as { birthTime?: string })?.birthTime || '12:00';

  let seed = 81923;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 37) % 1000003;

  const names: MardukSacredName[] = MARDUK_SACRED_NAMES_BASE.map((item, idx) => {
    const score = 48 + ((seed * (idx + 3) + idx * 29) % 52);
    return { ...item, resonanceScore: Math.min(99, Math.max(40, score)) };
  });

  names.sort((a, b) => b.resonanceScore - a.resonanceScore);
  const dominantSacredName = names[0];
  const secondarySacredName = names[1];

  const northWindDiscipline = Math.min(99, Math.max(45, 52 + ((seed * 11) % 46)));
  const southWindPassion = Math.min(99, Math.max(45, 54 + ((seed * 13) % 45)));
  const eastWindDawnInspiration = Math.min(99, Math.max(45, 53 + ((seed * 17) % 46)));
  const westWindTwilightPurification = Math.min(99, Math.max(45, 50 + ((seed * 19) % 48)));

  const fourWindsDominance: EnumaElishFourWindsBalance = {
    northWindDiscipline,
    southWindPassion,
    eastWindDawnInspiration,
    westWindTwilightPurification,
  };

  const tiamatSubjugationOrderScore = Math.min(100, Math.max(45, 55 + ((seed * 23) % 44)));
  const fiftySacredNamesResonanceIndex = Math.min(100, Math.max(42, 53 + ((seed * 29) % 46)));
  const cosmicSovereigntyScore = Math.min(100, Math.max(46, Math.floor((tiamatSubjugationOrderScore * 0.6 + fiftySacredNamesResonanceIndex * 0.4))));

  const enumaElishVictoryDecree = `바빌로니아 창세 서사시 에누마 엘리시는 노래합니다: "혼돈의 물결이 아무리 거셀지라도, 신성한 빛의 주권자는 4대 바람을 부려 우주의 질서를 세운다." 현재 당신에게 임재하는 마르두크의 칭호는 [${dominantSacredName.nameAkkadian} - ${dominantSacredName.nameKo}]입니다. ${dominantSacredName.actionVirtue}`;
  const tabletOfDestinyGuidance = `운명의 서판(Tablet of Destinies)을 가슴에 품으십시오: 당신의 선택이 곧 세상의 질서가 됩니다. ${dominantSacredName.tiamatSubjugationPower}의 권능으로 내외의 소란을 잠재우고 당당히 주권을 확립하십시오.`;

  const calculatedAtKst = formatEnumaElishKstTimestamp(now);
  const winds = [
    { label: '북풍(절제)', score: northWindDiscipline },
    { label: '남풍(열정)', score: southWindPassion },
    { label: '동풍(창의)', score: eastWindDawnInspiration },
    { label: '서풍(정화)', score: westWindTwilightPurification },
  ].sort((a, b) => b.score - a.score);
  const enumaCrossAxis = `[${dominantSacredName.nameAkkadian}] × [${secondarySacredName.nameAkkadian}] × [${winds[0].label}] × [${question.trim() || '전반적 주권 조율'}]`;
  const enumaElishSynthesisMatrix = {
    dominantTension: `${dominantSacredName.nameAkkadian} ↔ ${secondarySacredName.nameAkkadian}`,
    alignmentState: `${dominantSacredName.nameKo} · 4대 바람(북·남·동·서풍) 조율`,
    integratedAction: `${dominantSacredName.actionVirtue}${question ? ` [질문 맥락: ${question}]` : ''}`,
    enumaCrossAxis,
  };

  const interpretiveBoundary = '본 에누마 엘리시 마르두크 50대 이름 리포트는 고대 메소포타미아 서사시 원전과 수리 시드에 기반한 상징적 결단 안내이며, 절대적 예언이 아닙니다.';
  const ritualAction = `[${dominantSacredName.nameAkkadian}] ${dominantSacredName.actionVirtue}`;
  const reflectionFocus = `에누마 엘리시(${dominantSacredName.nameKo}) — 4대 바람 주권 조율`;
  const trimmedQ = question.trim();
  const reflectiveQuestion = trimmedQ
    ? `'${trimmedQ}'의 혼돈을 잠재우고 ${dominantSacredName.nameKo}의 주권을 세우기 위해 오늘 가장 먼저 끊어낼 모호함은 무엇인가요?`
    : `지금 내 삶의 4대 바람(절제·열정·창의·정화) 중 가장 먼저 균형을 되찾아야 할 방향은 어디인가요?`;

  return {
    engineVersion: ENUMA_ELISH_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst,
    tiamatSubjugationOrderScore,
    fiftySacredNamesResonanceIndex,
    cosmicSovereigntyScore,
    fourWindsDominance,
    dominantSacredName,
    secondarySacredName,
    enumaElishVictoryDecree,
    tabletOfDestinyGuidance,
    enumaElishSynthesisMatrix,
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
    interpretiveBoundary,
  };
}

export function formatSumerianEnumaElishFiftyNamesPrompt(rep: SumerianEnumaElishFiftyNamesReport): string {
  const lines = [
    `[바빌로니아 에누마 엘리시 마르두크 50대 이름 & 4대 바람 정복 실측 데이터]`,
    `· 엔진 버전: v${rep.engineVersion} | 연산 시각: ${rep.calculatedAtKst}`,
    `· 주재 마르두크 신성 칭호: [${rep.dominantSacredName.nameAkkadian} - ${rep.dominantSacredName.nameKo}]`,
    `  - 영역: ${rep.dominantSacredName.domain}`,
    `  - 혼돈 정복 권능: ${rep.dominantSacredName.tiamatSubjugationPower}`,
    `  - 행동 덕목: ${rep.dominantSacredName.actionVirtue}`,
    `· 보조 신성 칭호: [${rep.secondarySacredName.nameAkkadian} - ${rep.secondarySacredName.nameKo}]`,
    `· 에누마 엘리시 승리 선언: ${rep.enumaElishVictoryDecree}`,
    `· 운명의 서판(Tablet of Destinies) 지침: ${rep.tabletOfDestinyGuidance}`,
  ];
  if (rep.enumaElishSynthesisMatrix) {
    lines.push(
      `· 교차 매트릭스: [핵심 긴장: ${rep.enumaElishSynthesisMatrix.dominantTension} | 조율 상태: ${rep.enumaElishSynthesisMatrix.alignmentState}]`,
      `  - 4중 교차 축: ${rep.enumaElishSynthesisMatrix.enumaCrossAxis}`,
      `  - 통합 실천: ${rep.enumaElishSynthesisMatrix.integratedAction}`,
    );
  }
  lines.push(`· 실천 의례: ${rep.ritualAction}`);
  lines.push(`· 성찰 초점: ${rep.reflectionFocus}`);
  lines.push(`· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}`);
  lines.push(`· 해석 경계: ${rep.interpretiveBoundary}`);
  return lines.join('\n');
}
