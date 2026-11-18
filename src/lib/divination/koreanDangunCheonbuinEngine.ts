/**
 * 고대 한국 삼국유사 단군 천부인(天符印) 3보 & 홍익인간 광명 엔진 (koreanDangunCheonbuinEngine.ts)
 *
 * 《삼국유사(三國遺事)》 기이편 고조선 원전 기반:
 * 환인(桓因)이 환웅(桓雄)에게 하강을 허락하며 전수한 세 가지 하늘의 징표인 '천부삼인(天符三印)'
 * 1. 거울 (명경지수·영적 지혜와 내면 자각)
 * 2. 칼 (벽사결단·부정함 척결과 단호한 실행력)
 * 3. 방울 (천지화합·영혼의 소통과 우주적 공명)
 *
 * 3대 천계 관직(풍백·우사·운사)의 기운 조율과 '홍익인간(弘益人間)·이화세계(理化世界)' 원리를 통해
 * 내담자의 현실적 번영 지수와 세상과의 상생 조화도를 100% 결정론적으로 도출합니다.
 */

import type { UserProfile } from '../sharedState';

export const KOREAN_DANGUN_CHEONBUIN_ENGINE_VERSION = '2.3.0';

export interface CheonbuTreasure {
  id: 'mirror' | 'sword' | 'bell';
  nameKo: string;
  hanja: string;
  archetype: string;
  symbolism: string;
  activationPower: number; // 0 ~ 100 (내부 정렬용, 프롬프트 비노출)
  divineDecree: string;
}

export interface HeavenlyMinister {
  id: 'wind_master' | 'rain_master' | 'cloud_master';
  nameKo: string;
  hanja: string;
  element: '풍(風)' | '우(雨)' | '운(雲)';
  role: string;
  guidance: string;
}

export interface KoreanDangunCheonbuinReport {
  engineVersion: string;
  timestamp: string;
  calculatedAtKst: string;
  hongikProsperityIndex: number; // 0 ~ 100 홍익인간 상생 번영 지수 (내부 호환용, 프롬프트 비노출)
  cosmicHarmonyIndex: number; // 0 ~ 100 천지인(天地人) 조화율 (내부 호환용, 프롬프트 비노출)
  treasures: {
    mirror: CheonbuTreasure;
    sword: CheonbuTreasure;
    bell: CheonbuTreasure;
    dominantTreasure: CheonbuTreasure;
  };
  activeMinister: HeavenlyMinister;
  situationalCheonbuinAudit: {
    focusTheme: string;
    treasureGuidance: string;
    ministerSupport: string;
  };
  temporalCheonbuinRhythm: {
    kstTimeLabel: string;
    shinsiSkyWindow: string;
    seasonalNatureTone: string;
    temporalGuidance: string;
  };
  cheonbuinSynthesisMatrix: {
    coreInsight: string;
    recommendedAction: string;
    cautionNotice: string;
  };
  ihwaSegyeRemedy: string; // 이화세계 개운 처방
  boundaryNotice: string;
  interpretiveBoundary: string;
  ritualAction: string;
  reflectionFocus: string;
  reflectiveQuestion: string;
}

const TREASURES_DEF: Record<'mirror' | 'sword' | 'bell', Omit<CheonbuTreasure, 'activationPower'>> = {
  mirror: {
    id: 'mirror',
    nameKo: '천부경의 거울 (명경/明鏡)',
    hanja: '鏡',
    archetype: '지혜와 자각의 거울',
    symbolism: '한 점의 왜곡 없이 사물의 본질과 자신의 무의식을 비추는 맑고 고요한 영적 통찰',
    divineDecree: '마음의 티끌을 닦아내면 세상의 모든 인연과 기회가 거울 속 달처럼 선명히 드러난다.',
  },
  sword: {
    id: 'sword',
    nameKo: '천부인의 칼 (벽사보검/寶劍)',
    hanja: '劍',
    archetype: '결단과 벽사의 보검',
    symbolism: '미련과 우유부단함, 부정적인 탁기를 일도양단으로 베어내는 단호한 결단력과 정의',
    divineDecree: '주저함을 칼집에 넣고 단호한 행동으로 나아가 사악한 장애를 베어 넘겨라.',
  },
  bell: {
    id: 'bell',
    nameKo: '천부인의 방울 (화합천령/天鈴)',
    hanja: '鈴',
    archetype: '소통과 화합의 영령',
    symbolism: '하늘과 땅, 인간의 마음을 진동으로 연결하여 적대감을 녹이고 깊은 화합을 부르는 영혼의 파동',
    divineDecree: '진심 어린 소통의 울림을 세상에 전파하면 닫힌 문이 스스로 열리고 귀인이 모여든다.',
  },
};

const MINISTERS_DEF: HeavenlyMinister[] = [
  {
    id: 'wind_master',
    nameKo: '풍백(風伯)',
    hanja: '風伯',
    element: '풍(風)',
    role: '정체된 기운을 흩고 새로운 변화의 바람을 불어넣는 창조의 주재자',
    guidance: '과거의 관성에 머무르지 말고 변화의 기류에 몸을 실어 유연하고 민첩하게 전진하십시오.',
  },
  {
    id: 'rain_master',
    nameKo: '우사(雨師)',
    hanja: '雨師',
    element: '우(雨)',
    role: '메마른 현실에 생명의 자양분을 적셔 결실을 촉진하는 풍요의 주재자',
    guidance: '서두르는 조급함을 가라앉히고, 목표하는 일의 토양에 정성과 자원을 꾸준히 공급하십시오.',
  },
  {
    id: 'cloud_master',
    nameKo: '운사(雲師)',
    hanja: '雲師',
    element: '운(雲)',
    role: '드넓은 지평을 감싸 안아 위험을 차폐하고 도약의 기회를 품는 포용의 주재자',
    guidance: '시야를 넓게 열어 전모를 조망하고, 중요한 때가 무르익을 때까지 내실을 은밀히 품으십시오.',
  },
];

function getTemporalCheonbuinRhythm(now: Date) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  const mm = String(kst.getUTCMinutes()).padStart(2, '0');
  const hour = kst.getUTCHours();
  const month = kst.getUTCMonth() + 1;

  const shinsiSkyWindow =
    hour >= 5 && hour < 11
      ? '신시(神市) 아침 여명창 — 거울(明鏡)처럼 맑은 시야로 하루의 큰 뜻을 비추는 시간'
      : hour >= 11 && hour < 17
        ? '단군 정오 결단창 — 보검(寶劍)의 실행력으로 미루던 과제를 단호히 처리하는 시간'
        : hour >= 17 && hour < 22
          ? '홍익 황혼 공명창 — 천령(天鈴)의 울림으로 주변 인연과 조화롭게 소통하는 시간'
          : '백두 심야 침잠창 — 풍백·우사·운사의 기운을 고요히 가라앉히고 내일을 품는 시간';

  const seasonalNatureTone =
    month >= 3 && month <= 5
      ? '춘풍(春風 · 풍백) — 새로운 변화의 바람을 타고 과감히 발을 떼는 시기'
      : month >= 6 && month <= 8
        ? '하운(夏雲 · 운사) — 뜨거운 열기 속에서도 큰 그림을 품고 속도를 조율하는 시기'
        : month >= 9 && month <= 11
          ? '추우(秋雨 · 우사) — 들인 정성이 단단한 결실로 여물어 수확을 거두는 시기'
          : '동정(冬靜 · 신단수) — 뿌리를 깊게 내리며 내실과 지혜를 축적하는 시기';

  return {
    kstTimeLabel: `${y}-${m}-${d} ${hh}:${mm} +09:00 (KST)`,
    shinsiSkyWindow,
    seasonalNatureTone,
    temporalGuidance: `${shinsiSkyWindow} · ${seasonalNatureTone}의 흐름에 맞추어 천부삼인의 균형을 살피십시오.`,
  };
}

export function calculateKoreanDangunCheonbuin(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): KoreanDangunCheonbuinReport {
  const now = options?.now || new Date();
  const profile = options?.profile;
  const question = (options?.question || '').trim();

  let seed = 777;
  const bdate = profile?.basic?.birthdate || '1990-01-01';
  const btime = profile?.basic?.birthtime || '12:00';
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 17 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 19 + question.charCodeAt(i)) % 1000003;

  const mirrorPower = 40 + ((seed * 7) % 56);
  const swordPower = 40 + ((seed * 13) % 56);
  const bellPower = 40 + ((seed * 23) % 56);

  const mirrorObj: CheonbuTreasure = { ...TREASURES_DEF.mirror, activationPower: mirrorPower };
  const swordObj: CheonbuTreasure = { ...TREASURES_DEF.sword, activationPower: swordPower };
  const bellObj: CheonbuTreasure = { ...TREASURES_DEF.bell, activationPower: bellPower };

  let dominant: CheonbuTreasure = mirrorObj;
  if (swordPower >= mirrorPower && swordPower >= bellPower) dominant = swordObj;
  else if (bellPower >= mirrorPower && bellPower >= swordPower) dominant = bellObj;

  const hongikProsperityIndex = Math.min(100, Math.max(30, Math.floor((mirrorPower + swordPower + bellPower) / 3)));
  const cosmicHarmonyIndex = Math.min(100, Math.max(35, 100 - Math.abs(mirrorPower - swordPower) - Math.abs(swordPower - bellPower)));

  const ministerIdx = seed % 3;
  const activeMinister = MINISTERS_DEF[ministerIdx];

  let ihwaSegyeRemedy = '';
  if (dominant.id === 'mirror') {
    ihwaSegyeRemedy = '혼란스러운 외부에 휘둘리지 말고 아침마다 3분간 내면의 고요한 관찰자(거울) 상태를 유지하여 최선의 판단을 직관적으로 내리십시오.';
  } else if (dominant.id === 'sword') {
    ihwaSegyeRemedy = '미뤄왔던 관계나 불필요한 지출, 우유부단한 타협을 보검처럼 단칼에 정리하여 새 운이 유입될 맑은 통로를 확보하십시오.';
  } else {
    ihwaSegyeRemedy = '자신의 이익만을 주장하기보다 상대방의 입장을 먼저 수용하고 부드러운 소통(방울)으로 주변 귀인의 조력을 이끌어내십시오.';
  }

  const temporalCheonbuinRhythm = getTemporalCheonbuinRhythm(now);
  const situationalCheonbuinAudit = /결정|이직|사업|일|선택/.test(question)
    ? {
        focusTheme: '결단(보검)과 본질 자각(거울)의 실행 조화',
        treasureGuidance: `${dominant.nameKo}의 기운을 중심으로 불필요한 선택지를 덜어내십시오.`,
        ministerSupport: `${activeMinister.nameKo}(${activeMinister.element})의 조력: ${activeMinister.guidance}`,
      }
    : /관계|연애|사람|소통|화해/.test(question)
      ? {
          focusTheme: '화합(방울)과 홍익인간의 상생 소통',
          treasureGuidance: '방울의 공명처럼 먼저 열린 마음으로 진심을 전할 때 관계의 물꼬가 트입니다.',
          ministerSupport: `${activeMinister.nameKo}(${activeMinister.element})의 조력: ${activeMinister.guidance}`,
        }
      : {
          focusTheme: '천부삼인(거울·칼·방울)의 균형과 이화세계',
          treasureGuidance: `${dominant.nameKo}이 비추는 ${dominant.archetype}을 오늘의 나침반으로 삼으십시오.`,
          ministerSupport: `${activeMinister.nameKo}(${activeMinister.element})의 조력: ${activeMinister.guidance}`,
        };

  const cheonbuinSynthesisMatrix = {
    coreInsight: `주재 천부보물 [${dominant.nameKo}]와 천계 관직 [${activeMinister.nameKo}]가 만나 ${situationalCheonbuinAudit.focusTheme}을 이끕니다.`,
    recommendedAction: ihwaSegyeRemedy,
    cautionNotice: '거울의 성찰 없는 칼의 결단이나, 칼의 경계 없는 방울의 타협에 빠지지 않도록 삼인의 균형을 살피십시오.',
  };

  const ritualAction = `[${dominant.nameKo} · ${activeMinister.nameKo}] ${ihwaSegyeRemedy}`;
  const reflectionFocus = question
    ? `'${question}'의 자리에서 거울의 자각, 칼의 결단, 방울의 화합 가운데 지금 가장 보탤 기운은 무엇인가요?`
    : `오늘 ${dominant.nameKo}의 뜻과 ${activeMinister.nameKo}의 기류 속에서 내가 먼저 정리하거나 이어 줄 인연은 무엇인가요?`;
  const reflectiveQuestion = question
    ? `지금 "${question}" 앞에서 ${dominant.nameKo}와 ${activeMinister.nameKo}의 기운을 살려 내가 먼저 실행할 한 가지는 무엇인가요?`
    : reflectionFocus;

  return {
    engineVersion: KOREAN_DANGUN_CHEONBUIN_ENGINE_VERSION,
    timestamp: now.toISOString(),
    calculatedAtKst: temporalCheonbuinRhythm.kstTimeLabel,
    hongikProsperityIndex,
    cosmicHarmonyIndex,
    treasures: {
      mirror: mirrorObj,
      sword: swordObj,
      bell: bellObj,
      dominantTreasure: dominant,
    },
    activeMinister,
    situationalCheonbuinAudit,
    temporalCheonbuinRhythm,
    cheonbuinSynthesisMatrix,
    ihwaSegyeRemedy,
    boundaryNotice: '본 결과는 《삼국유사》 단군 천부삼인과 홍익인간 상징 체계에 따른 정성적 성찰 안내이며, 확정적 길흉 판정이 아닙니다.',
    interpretiveBoundary: '본 결과는 《삼국유사》 단군 천부삼인과 홍익인간 상징 체계에 따른 정성적 성찰 안내이며, 확정적 길흉 판정이 아닙니다.',
    ritualAction,
    reflectionFocus,
    reflectiveQuestion,
  };
}

export function formatKoreanDangunCheonbuinPrompt(rep: KoreanDangunCheonbuinReport): string {
  return `[고대 한국 삼국유사 단군 천부인(天符印) 3보 & 홍익인간 광명 실측 데이터]
· 엔진 버전: v${rep.engineVersion} | 연산 시각: ${rep.calculatedAtKst}
· 핵심 지배 천부보물: ${rep.treasures.dominantTreasure.nameKo} (${rep.treasures.dominantTreasure.hanja})
  - 상징 원형: ${rep.treasures.dominantTreasure.archetype} (${rep.treasures.dominantTreasure.symbolism})
  - 천부 비전 칙령: "${rep.treasures.dominantTreasure.divineDecree}"
· 감응 천계 관직: ${rep.activeMinister.nameKo} (${rep.activeMinister.element}) — ${rep.activeMinister.role}
  - 주재자 조언: ${rep.activeMinister.guidance}
· 질문 맥락 감사 (${rep.situationalCheonbuinAudit.focusTheme}): ${rep.situationalCheonbuinAudit.treasureGuidance} | ${rep.situationalCheonbuinAudit.ministerSupport}
· KST 시공간 신시 리듬: ${rep.temporalCheonbuinRhythm.shinsiSkyWindow} / ${rep.temporalCheonbuinRhythm.seasonalNatureTone}
  - 시공간 지침: ${rep.temporalCheonbuinRhythm.temporalGuidance}
· 천부인 교차 매트릭스:
  - 핵심 통찰: ${rep.cheonbuinSynthesisMatrix.coreInsight}
  - 권고 실행: ${rep.cheonbuinSynthesisMatrix.recommendedAction}
  - 주의 경계: ${rep.cheonbuinSynthesisMatrix.cautionNotice}
· 이화세계(理化世界) 현실 개운 처방: ${rep.ihwaSegyeRemedy}
· 실천 의례(Ritual Action): ${rep.ritualAction}
· 성찰 초점(Reflection Focus): ${rep.reflectionFocus}
· 질문 맞춤 성찰 질문: ${rep.reflectiveQuestion}
· 해석 경계: ${rep.boundaryNotice}`;
}
