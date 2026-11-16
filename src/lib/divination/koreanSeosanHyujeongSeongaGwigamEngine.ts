/**
 * 조선 서산대사 휴정(西山大師 休靜) 《선가귀감(禪家龜鑑)》 일물영명(一物靈明) & 활구참선(活句參禪) 선교원융 엔진
 *
 * 조선 중기 불교의 중흥조이자 살신성인의 구국성사 청허당 서산대사 휴정(1520~1604) 선생의 대표 명저 《선가귀감(禪家龜鑑)》 및 《삼가귀감(三家龜鑑)》 원전 기반:
 * 1. 일물영명(有一物於此, 本來靈明, 不曾生不曾滅): "여기 한 물건이 있으니, 본래부터 신령하고 밝아 일찍이 생겨난 적도 없고 사라진 적도 없으며, 이름 붙일 수도 없고 모양을 그릴 수도 없다." 모든 현상과 분별 이전의 본래 청정한 불성(佛性) 자각.
 * 2. 활구참선(活句參禪)과 사구(死句) 타파: 말과 문자에 매여 사량분별로 따지는 죽은 글귀(사구)를 과감히 내던지고, 단박에 의정(疑情)을 폭발시켜 생명력을 되살리는 살아있는 글귀(활구)의 직관적 결단.
 * 3. 선교원융(禪敎圓融): 선(禪)은 부처님의 마음(佛心)이요 교(敎)는 부처님의 말씀(佛語)이니, 말로써 뜻을 드러내되 뜻을 얻고 나면 말을 잊어 근본 마음으로 돌아가는 원융회통의 지혜.
 * 4. 삼가회통(三家會通): 유교의 인(仁)과 예(禮), 도교의 무위청정(無爲淸淨), 불교의 자비와 해탈이 궁극적으로 한마음(一心)의 다른 표현임을 밝히는 포용적 통찰.
 * 5. 살신구세(殺身救世)의 보살행: 산중의 적막한 선정에만 안주하지 않고, 임진왜란 국난 속에서 팔도 의승군을 이끌어 백성을 지켜낸 자비와 대의(大義)의 거룩한 실천.
 *
 * @version LUCKEY-SEOSAN-SEONGA-GWIGAM-v2.1.0
 */

import type { UserProfile } from '../sharedState';

export const SEOSAN_SEONGA_GWIGAM_VERSION = 'LUCKEY-SEOSAN-SEONGA-GWIGAM-v2.1.0';

export interface SeosanTheme {
  themeKey: string;
  themeTitleHanja: string;
  themeTitleKo: string;
  philosophicalInsight: string;
  meditativeCounsel: string;
}

export interface SeosanMaxim {
  maximKey: string;
  maximKo: string;
  maximHanja: string;
  dharmaDimension: string;
  mindDirective: string;
}

export interface SeosanHyujeongSeongaGwigamResult {
  engineVersion: string;
  calculatedAtKst: string;
  // 5대 핵심 선지 지표 (0~100)
  ilmulYeongmyeongClarityScore: number;       // 일물영명(一物靈明) 본래 마음의 청정 지혜도
  hwalkuDirectPiercingScore: number;          // 활구참선(活句參禪) 사변 탈피 본질 관통력
  seonGyoHarmoniousIntegrationScore: number;  // 선교원융(禪敎圓融) 원리와 실천의 조화도
  samgaHoetongBreadthScore: number;           // 삼가회통(三家會通) 다원적 시각 포용력
  daeseungBodhisattvaActionScore: number;     // 대승적 구세(救世) 결단 및 자비 실천행
  // 세부 체계
  activeSeosanTheme: SeosanTheme;
  secondarySeosanTheme: SeosanTheme;
  focalSeosanMaxim: SeosanMaxim;
  secondarySeosanMaxim: SeosanMaxim;
  reflectiveQuestion: string;
  interpretiveBoundary: string;
  seosanPersonalCounsel: {
    counselTitle: string;
    philosophicalGuidance: string;
  };
  seosanSynthesisMatrix?: {
    dominantTension: string;
    alignmentState: string;
    integratedAction: string;
  };
}

function formatSeosanKstTimestamp(now: Date = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm} +09:00 KST`;
}

function describeSeosanStage(score: number): string {
  if (score >= 88) return '일물영명(一物靈明) — 본래 맑은 마음과 대승적 실천이 하나로 통하는 경지';
  if (score >= 78) return '선교원융(禪敎圓融) — 직관의 깊이와 현실의 법도가 조화를 이루는 국면';
  return '활구참선(活句參禪) — 복잡한 사량분별을 내려놓고 본질을 단박에 살피는 시기';
}

export type SeosanHyujeongSeongaGwigamReport = SeosanHyujeongSeongaGwigamResult;

const SEOSAN_THEMES: SeosanTheme[] = [
  {
    themeKey: 'IlmulYeongmyeong',
    themeTitleHanja: '有一物於此 本來靈明',
    themeTitleKo: '일물영명 (본래 밝고 신령한 본마음의 자각)',
    philosophicalInsight: '외부의 온갖 소음과 시비에 가려져 있어도, 당신 안에는 본래부터 물들지 않는 밝고 신령한 등불(한 물건)이 언제나 빛나고 있습니다. 밖에서 구하지 말고 내면의 맑은 거울을 비추십시오.',
    meditativeCounsel: '타인의 비난이나 순간의 실패에 주눅 들지 마십시오. 당신의 참된 본질은 상처 입거나 훼손될 수 없는 고결한 평정 그 자체입니다. 본래 마음에 의지하십시오.',
  },
  {
    themeKey: 'HwalkuChamseon',
    themeTitleHanja: '活句參禪 絶學無爲',
    themeTitleKo: '활구참선 (알음알이를 깨고 핵심을 꿰뚫기)',
    philosophicalInsight: '책 속의 문장이나 머릿속의 복잡한 계산(사구)에만 매달리면 결코 살아 숨 쉬는 현실의 답을 얻을 수 없습니다. 번뇌를 단칼에 베어내고 본질을 꿰뚫는 활구(活句)의 결단이 필요합니다.',
    meditativeCounsel: '과도한 생각의 꼬리를 자르십시오. 머리로만 고민하지 말고, 가장 핵심적인 화두 하나를 단단히 쥐고 정면으로 돌파하십시오. 직관의 문이 열립니다.',
  },
  {
    themeKey: 'SeonGyoWonYung',
    themeTitleHanja: '禪是佛心 敎是佛語',
    themeTitleKo: '선교원융 (원리의 깊이와 실천의 유연함)',
    philosophicalInsight: '원칙(교)만 고집하면 옹졸해지고, 자유(선)만 내세우면 방종에 빠집니다. 마음의 깊은 근본을 잡으면서도 현실의 법도와 상식을 유연하게 포용할 때 완전한 원융이 이뤄집니다.',
    meditativeCounsel: '이론과 실천의 균형을 잡으십시오. 당신이 지닌 통찰을 현실적인 실행 방안으로 꼼꼼히 정리하여 구현할 때 주위 사람들도 신뢰하고 따르게 됩니다.',
  },
  {
    themeKey: 'SamgaHoetong',
    themeTitleHanja: '儒釋道 三家會通',
    themeTitleKo: '삼가회통 (다른 관점을 품어 안는 큰 바다)',
    philosophicalInsight: '강물은 바다로 흘러가면 모두 같은 한 맛(소금맛)이 됩니다. 유교의 인의, 도교의 청정, 불교의 자비는 겉모습만 다를 뿐 인간을 살리는 한 뿌리에서 나왔습니다.',
    meditativeCounsel: '나와 다른 생각이나 반대파의 의견을 적대시하지 마십시오. 서로 다른 주장 속에 담긴 공통의 선의를 꿰뚫어 보고 더 큰 차원에서 통합하는 큰 그릇이 되십시오.',
  },
  {
    themeKey: 'BodhisattvaSalvation',
    themeTitleHanja: '慈悲救世 殺身成仁',
    themeTitleKo: '자비구세 (세상의 고통을 외면하지 않는 실천)',
    philosophicalInsight: '참된 도는 산속의 고요에만 있지 않고 고통받는 세상을 구하는 뜨거운 자비의 현장에 있습니다. 국난 앞에서 칼을 들고 백성을 지켰듯, 필요한 순간에는 온몸을 던지는 결단이 참선입니다.',
    meditativeCounsel: '자신만의 안락함에 안주하지 마십시오. 당신의 역량과 지혜가 주변 사람들과 공동체에 실질적인 도움을 줄 수 있도록 용기 있게 손을 내밀고 행동하십시오.',
  },
];

const SEOSAN_MAXIMS: SeosanMaxim[] = [
  {
    maximKey: 'SteppingSnowGrounded',
    maximKo: '눈 덮인 들판을 걸어갈 때 어지러이 걷지 마라, 오늘 내가 남긴 발자국은 뒷사람의 이정표가 된다',
    maximHanja: '踏雪野中去 不須胡亂行 今日我行跡 遂作後人程',
    dharmaDimension: '행동의 책임감과 선구자적 지조',
    mindDirective: '사소한 언행 하나에도 신중을 기하여, 다른 이들에게 모범이 되는 올곧은 길을 걸어가십시오.',
  },
  {
    maximKey: 'DropSpoonSeeStar',
    maximKo: '숟가락을 놓는 순간에도 마음을 챙기지 못하면 천 갈래 만 갈래 번뇌가 일어난다',
    maximHanja: '一念不在 萬念俱起',
    dharmaDimension: '순간의 알아차림과 정념(正念)',
    mindDirective: '일상의 일거수일투족 속에서 흐트러짐 없이 지금-여기의 마음에 온전히 머무르십시오.',
  },
  {
    maximKey: 'ForgetWordGetMeaning',
    maximKo: '말을 잊고 뜻을 얻으면 온 천지가 한마음의 거울이다',
    maximHanja: '忘言得旨 乾坤一鏡',
    dharmaDimension: '형식의 초월과 본질 획득',
    mindDirective: '문서나 격식의 작은 시비에 얽매이지 말고, 상대방이 전하고자 하는 본뜻을 헤아리십시오.',
  },
  {
    maximKey: 'TrueRepentanceEmpty',
    maximKo: '죄와 허물도 본래 자성이 없으니, 마음이 비워지면 업장도 안개처럼 사라진다',
    maximHanja: '罪從心起將心懺 心若滅時罪亦亡',
    dharmaDimension: '과거의 정화와 마음의 해방',
    mindDirective: '지나간 실수나 죄책감에 짓눌려 있지 말고, 마음을 맑게 비워 새로운 발걸음을 내딛으십시오.',
  },
];

export function calculateSeosanHyujeongSeongaGwigam(
  profile: UserProfile,
  query?: string,
  now: Date = new Date(),
): SeosanHyujeongSeongaGwigamResult {
  const seedString =
    (profile?.basic?.birthdate ?? (profile as any)?.birthdate ?? '1990-01-01') +
    (profile?.basic?.name ?? (profile as any)?.name ?? 'User') +
    (profile?.basic?.birthtime ?? (profile as any)?.birthtime ?? '12:00') +
    (query ?? '') +
    'SeosanHyujeongSeongaGwigam';

  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const ilmulYeongmyeongClarityScore = 71 + (absHash % 28);
  const hwalkuDirectPiercingScore = 69 + ((absHash >> 3) % 30);
  const seonGyoHarmoniousIntegrationScore = 68 + ((absHash >> 6) % 31);
  const samgaHoetongBreadthScore = 70 + ((absHash >> 9) % 29);
  const daeseungBodhisattvaActionScore = 67 + ((absHash >> 12) % 32);

  const themeIndex = (absHash >> 4) % SEOSAN_THEMES.length;
  const secondaryThemeIndex = (themeIndex + 1 + ((absHash >> 6) % (SEOSAN_THEMES.length - 1))) % SEOSAN_THEMES.length;
  const maximIndex = (absHash >> 7) % SEOSAN_MAXIMS.length;
  const secondaryMaximIndex = (maximIndex + 1 + ((absHash >> 10) % (SEOSAN_MAXIMS.length - 1))) % SEOSAN_MAXIMS.length;

  const activeSeosanTheme = SEOSAN_THEMES[themeIndex];
  const secondarySeosanTheme = SEOSAN_THEMES[secondaryThemeIndex];
  const focalSeosanMaxim = SEOSAN_MAXIMS[maximIndex];
  const secondarySeosanMaxim = SEOSAN_MAXIMS[secondaryMaximIndex];

  const trimmedQuery = query?.trim();
  const reflectiveQuestion = trimmedQuery
    ? `서산대사의 '${activeSeosanTheme.themeTitleKo}'와 '${secondarySeosanTheme.themeTitleKo}'를 비추어 볼 때, "${trimmedQuery}"에서 죽은 글귀(사구)의 분별을 끊고 본질로 바로 들어갈 활구(活句)는 무엇인가요?`
    : `지금 머릿속을 맴도는 번민 앞에서, '${activeSeosanTheme.themeTitleKo}'의 밝음과 '${secondarySeosanTheme.themeTitleKo}'의 조화를 함께 살리려면 어떤 껍질 같은 생각을 내려놓아야 할까요?`;

  const interpretiveBoundary = '이 지표는 서산대사 휴정의 《선가귀감》·《삼가귀감》에 담긴 일물영명·활구참선·선교원융·자비구제 사상을 마음과 선택을 비추는 정성적 수행 거울로 해석한 것이며, 현실의 구체적 사건이나 인과를 단정하는 점술적 예언이 아닙니다.';

  const counselTitle = `서산대사 선가귀감(禪家龜鑑) 법어: ${activeSeosanTheme.themeTitleKo}`;
  const philosophicalGuidance = `청허당 서산대사의 선가귀감은 알음알이를 부수고 본래 밝고 신령한 한 물건을 자각하여 대승적 자비의 길을 걷도록 이끕니다. ` +
    `현재 당신에게 필요한 선지(禪旨)는 '${activeSeosanTheme.themeTitleKo}'의 가르침과 직결되어 있습니다. ` +
    `${activeSeosanTheme.meditativeCounsel} 또한 서산대사의 명구인 '${focalSeosanMaxim.maximKo}'(${focalSeosanMaxim.dharmaDimension})을 마음에 새겨, ` +
    `${focalSeosanMaxim.mindDirective}`;

  const calculatedAtKst = formatSeosanKstTimestamp(now);
  const avgScore = Math.round(
    (ilmulYeongmyeongClarityScore +
      hwalkuDirectPiercingScore +
      seonGyoHarmoniousIntegrationScore +
      samgaHoetongBreadthScore +
      daeseungBodhisattvaActionScore) /
      5,
  );
  const seosanSynthesisMatrix = {
    dominantTension: `${activeSeosanTheme.themeTitleKo} ↔ ${focalSeosanMaxim.dharmaDimension}`,
    alignmentState: describeSeosanStage(avgScore),
    integratedAction: `${focalSeosanMaxim.mindDirective}${query?.trim() ? ` [질문 맥락: ${query.trim()}]` : ''}`,
  };

  return {
    engineVersion: SEOSAN_SEONGA_GWIGAM_VERSION,
    calculatedAtKst,
    ilmulYeongmyeongClarityScore,
    hwalkuDirectPiercingScore,
    seonGyoHarmoniousIntegrationScore,
    samgaHoetongBreadthScore,
    daeseungBodhisattvaActionScore,
    activeSeosanTheme,
    secondarySeosanTheme,
    focalSeosanMaxim,
    secondarySeosanMaxim,
    reflectiveQuestion,
    interpretiveBoundary,
    seosanPersonalCounsel: {
      counselTitle,
      philosophicalGuidance,
    },
    seosanSynthesisMatrix,
  };
}

export function formatSeosanHyujeongSeongaGwigamPrompt(res: SeosanHyujeongSeongaGwigamResult): string {
  const avgScore = Math.round(
    (res.ilmulYeongmyeongClarityScore +
      res.hwalkuDirectPiercingScore +
      res.seonGyoHarmoniousIntegrationScore +
      res.samgaHoetongBreadthScore +
      res.daeseungBodhisattvaActionScore) /
      5,
  );
  const lines = [
    `【서산대사 선가귀감(禪家龜鑑) 일물영명 & 활구참선 지표】`,
    `- 연산 시각: ${res.calculatedAtKst} | 엔진: ${res.engineVersion}`,
    `- 선교원융 국면: ${describeSeosanStage(avgScore)}`,
    `- 핵심 선지 테마: ${res.activeSeosanTheme.themeTitleKo} [${res.activeSeosanTheme.themeTitleHanja}]`,
    `- 보조 교차 테마: ${res.secondarySeosanTheme.themeTitleKo} [${res.secondarySeosanTheme.themeTitleHanja}]`,
    `- 선학적 통찰: ${res.activeSeosanTheme.philosophicalInsight}`,
    `- 관조적 조언: ${res.activeSeosanTheme.meditativeCounsel}`,
    `- 선가 핵심 명구: "${res.focalSeosanMaxim.maximKo}"`,
    `- 보조 교차 명구: "${res.secondarySeosanMaxim.maximKo}"`,
    `- 한문 원문: "${res.focalSeosanMaxim.maximHanja}" [${res.focalSeosanMaxim.dharmaDimension}]`,
    `- 마음가짐 실천 지침: ${res.focalSeosanMaxim.mindDirective}`,
    `- 성찰 질문: ${res.reflectiveQuestion}`,
    `- 해석 경계: ${res.interpretiveBoundary}`,
    `- 통합 선지 처방: ${res.seosanPersonalCounsel.philosophicalGuidance}`,
  ];
  if (res.seosanSynthesisMatrix) {
    lines.push(
      `- 교차 매트릭스 [핵심 긴장: ${res.seosanSynthesisMatrix.dominantTension} | 조율 상태: ${res.seosanSynthesisMatrix.alignmentState}]`,
      `- 통합 실천: ${res.seosanSynthesisMatrix.integratedAction}`,
    );
  }
  return lines.join('\n');
}
