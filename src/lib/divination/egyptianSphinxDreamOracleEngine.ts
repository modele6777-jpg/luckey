/**
 * 고대 이집트 투트모세 4세 스핑크스 영혼 꿈신탁 & 태양신 레-호라크티 엔진 (egyptianSphinxDreamOracleEngine.ts)
 *
 * 기원전 1401년 이집트 신왕국 제18왕조 투트모세 4세의 '꿈의 비석(Dream Stele)' 정통 원전:
 * 기자의 대스핑크스 발치에 세워진 신성한 비문에 새겨진 역사적 신탁.
 * 왕자 투트모세가 사냥 도중 모래에 파묻힌 스핑크스 그늘 아래 잠들었을 때,
 * 지평선의 태양신 '호르-엠-아케트(Hor-em-akhet / 레-호라크티)'가 꿈에 나타나
 * 자신을 덮고 있는 무거운 사막 모래를 치워주면 상하 이집트의 영원한 왕권을 주겠노라 약조한 영적 해방의 원형.
 *
 * 스핑크스 4대 신성 테트라모르프(Tetramorph) 권능:
 * 1. 인간의 머리(Man) - 사유의 명료함과 지혜 (Wisdom)
 * 2. 사자의 가슴(Lion) - 불굴의 기개와 결단력 (Courage)
 * 3. 황소의 하체(Bull) - 침묵의 인내와 지구력 (Endurance)
 * 4. 독수리의 날개(Eagle) - 높은 곳에서 내려다보는 원대한 조망 (Vision)
 */

import type { UserProfile } from '../sharedState';

export const EGYPTIAN_SPHINX_DREAM_ORACLE_ENGINE_VERSION = '1.0.0';

export interface SphinxVirtue {
  nameKo: string;
  symbol: string;
  score: number; // 0 ~ 100
  powerDesc: string;
}

export interface SphinxTetramorphAspects {
  humanHead: SphinxVirtue; // 인간의 머리: 지혜와 명석함
  lionHeart: SphinxVirtue; // 사자의 심장: 용기와 돌파
  bullStrength: SphinxVirtue; // 황소의 힘: 끈기와 인내
  eagleVision: SphinxVirtue; // 독수리의 시야: 높은 조망과 영적 통찰
}

export interface EgyptianSphinxDreamOracleReport {
  engineVersion: string;
  timestamp: string;
  tetramorph: SphinxTetramorphAspects;
  dominantVirtue: string;
  sandCleansingIndex: number; // 0 ~ 100 영혼의 모래 정화율 (무거운 잡념과 장애의 제거도)
  thutmosePromise: string; // 투트모세 4세에게 내린 신성한 약조의 현대적 투영
  sphinxRiddleInsight: string; // 스핑크스의 수수께끼를 푸는 지혜로운 통찰
  reHorakhtyDawnCommand: string; // 지평선의 태양신 레-호라크티의 여명 행동 명령
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function calculateEgyptianSphinxDreamOracle(options?: {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
}): EgyptianSphinxDreamOracleReport {
  const profile = options?.profile;
  const question = (options?.question || '').trim();
  const now = options?.now || new Date();

  const bdate = profile?.basic?.birthdate || (profile as any)?.birthDate || (profile as any)?.birthdate || '1985-05-15';
  const btime = profile?.basic?.birthtime || (profile as any)?.birthTime || (profile as any)?.birthtime || '06:00';
  const seedStr = `${bdate}_${btime}_${question || 'sphinx'}_${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const seed = simpleHash(seedStr);

  const humanScore = 45 + (seed % 53);
  const lionScore = 45 + ((seed >> 2) % 53);
  const bullScore = 45 + ((seed >> 4) % 53);
  const eagleScore = 45 + ((seed >> 6) % 53);

  const tetramorph: SphinxTetramorphAspects = {
    humanHead: {
      nameKo: '인간의 지혜 (Human Wisdom)',
      symbol: '🧠',
      score: humanScore,
      powerDesc: humanScore >= 70
        ? '감정에 휘둘리지 않고 본질을 꿰뚫어 보는 이성적 통찰과 분별력이 극에 달해 있습니다.'
        : '복잡한 상황 속에서 논리적 인과관계를 냉철하게 재정립해야 할 때입니다.',
    },
    lionHeart: {
      nameKo: '사자의 용맹 (Lion Courage)',
      symbol: '🦁',
      score: lionScore,
      powerDesc: lionScore >= 70
        ? '두려움을 넘어서 당당히 영역을 개척하는 왕자다운 담대함이 가득합니다.'
        : '정면 돌파를 망설이지 말고 정당한 자기주장을 세상에 드러내십시오.',
    },
    bullStrength: {
      nameKo: '황소의 인내 (Bull Endurance)',
      symbol: '🐂',
      score: bullScore,
      powerDesc: bullScore >= 70
        ? '사막의 풍파에도 결코 흔들리지 않는 묵직한 하중과 완강한 지구력을 발휘합니다.'
        : '조급함을 버리고 기본기를 다지며 바닥부터 단단히 다져야 승기를 잡습니다.',
    },
    eagleVision: {
      nameKo: '독수리의 조망 (Eagle Vision)',
      symbol: '🦅',
      score: eagleScore,
      powerDesc: eagleScore >= 70
        ? '당장의 눈앞을 넘어 10년 뒤의 큰 흐름을 내려다보는 영적 혜안이 열려 있습니다.'
        : '지엽적인 손익에 얽매이지 말고 전체 판세를 조망하는 시야를 확보하십시오.',
    },
  };

  const scores = [
    { name: '인간의 지혜(명석한 판단)', score: humanScore },
    { name: '사자의 용맹(과감한 돌파)', score: lionScore },
    { name: '황소의 인내(흔들림 없는 끈기)', score: bullScore },
    { name: '독수리의 조망(거시적 비전)', score: eagleScore },
  ];
  scores.sort((a, b) => b.score - a.score);
  const dominantVirtue = scores[0].name;

  const sandCleansingIndex = Math.round((humanScore * 0.25 + lionScore * 0.25 + bullScore * 0.25 + eagleScore * 0.25));

  const thutmosePromise = sandCleansingIndex >= 70
    ? '오랜 세월 당신의 본질을 덮고 있던 혼란과 번민의 모래가 말끔히 걷히고 있습니다. 진정한 당신의 왕권(주도권)을 되찾을 때입니다.'
    : '주변의 잡음과 사소한 걱정이라는 모래를 스스로 털어내야 비로소 당신의 온전한 위엄이 빛을 발합니다.';

  const sphinxRiddleInsight = `스핑크스가 던지는 영혼의 수수께끼: "당신을 구속하는 것은 환경인가, 스스로 만든 두려움인가?" ` +
    `현재 당신이 지닌 가장 날카로운 무기는 [${dominantVirtue}]입니다. 이를 온전히 긍정할 때 모든 문이 열립니다.`;

  const reHorakhtyDawnCommand = `지평선에서 솟구치는 아침 태양 레-호라크티의 빛이 당신을 비춥니다. ` +
    `어둠과 나태를 떨치고 오늘 가장 먼저 매듭지어야 할 핵심 과업을 향해 한 치의 망설임 없이 전진하십시오.`;

  return {
    engineVersion: EGYPTIAN_SPHINX_DREAM_ORACLE_ENGINE_VERSION,
    timestamp: now.toISOString(),
    tetramorph,
    dominantVirtue,
    sandCleansingIndex,
    thutmosePromise,
    sphinxRiddleInsight,
    reHorakhtyDawnCommand,
  };
}

export function formatEgyptianSphinxDreamOraclePrompt(rep: EgyptianSphinxDreamOracleReport): string {
  return `[고대 이집트 투트모세 4세 스핑크스 영혼 꿈신탁 & 태양신 레-호라크티 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 스핑크스 지배적 신성 원형: ${rep.dominantVirtue} (영혼의 모래 정화율: ${rep.sandCleansingIndex}/100)
· 인간의 머리(지혜): 위력 ${rep.tetramorph.humanHead.score}/100 - ${rep.tetramorph.humanHead.powerDesc}
· 사자의 심장(용기): 위력 ${rep.tetramorph.lionHeart.score}/100 - ${rep.tetramorph.lionHeart.powerDesc}
· 황소의 힘(인내): 위력 ${rep.tetramorph.bullStrength.score}/100 - ${rep.tetramorph.bullStrength.powerDesc}
· 독수리의 시야(조망): 위력 ${rep.tetramorph.eagleVision.score}/100 - ${rep.tetramorph.eagleVision.powerDesc}
· 꿈의 비석 신성 약조: ${rep.thutmosePromise}
· 스핑크스 수수께끼 해법: ${rep.sphinxRiddleInsight}
· 레-호라크티 여명 행동 명령: ${rep.reHorakhtyDawnCommand}`;
}
