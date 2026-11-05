/**
 * 고대 중국 도가 장자(莊子) 소요유(逍遙遊) 붕정만리 & 제물론(齊物論) 호접몽 초월 엔진 (zhuangziXiaoyaoyouButterflyEngine.ts)
 *
 * 전국시대 도가 철학의 거장 장자(莊子)의 《장자(莊子)》 내편 제1편 〈소요유(逍遙遊)〉 및 제2편 〈제물론(齊物論)〉 원전 기반:
 * 북명(北冥)의 물고기 곤(鯤)이 화하여 구만 리 장공을 비상하는 거대한 대붕(大鵬)의 '붕정만리(鵬程萬里)',
 * 뱁새와 매미의 좁은 시야를 벗어나 절대적 자유로 노니는 '소요유(逍遙遊)',
 * 시비(是非)·미추(美醜)·득실(得失)의 상대적 분별을 잊고 천지자연과 하나 되는 '제물론(齊物論)'과 '호접지몽(胡蝶之夢)',
 * 그리고 나와 사물의 경계가 허물어지는 '물화(物化)'의 경지를 산출하는 궁극의 정신적 해방 엔진.
 *
 * 5대 장자 초월 심상(Five Zhuangzi Transcendent Archetypes):
 * 1. 곤화위붕(鯤化爲鵬) - 끝없는 심연의 내공이 폭발적 비상으로 전환되는 잠재력의 대도약
 * 2. 붕정만리(鵬程萬里) - 구만 리 바람을 타고 사소한 장애를 아득히 내려다보는 거시적 안목
 * 3. 오상아(吾喪我) - 인위적 에고와 고집을 깨끗이 잊고 본래의 순수 자연으로 돌아감
 * 4. 포정해우(庖丁解牛) - 억지로 힘쓰지 않고 사물의 자연스러운 빈틈(隙)을 타는 신묘한 유연성
 * 5. 호접지몽(胡蝶之夢) - 꿈과 현실, 주체와 객체의 분별을 초월하여 유유자적 노니는 물화의 자유
 */

import type { UserProfile } from '../sharedState';

export const ZHUANGZI_XIAOYAOYOU_BUTTERFLY_ENGINE_VERSION = '1.0.0';

export interface ZhuangziArchetype {
  id: string;
  nameKo: string;
  hanja: string;
  transcendentPrinciple: string;
  spiritualLiberationGift: string;
  affinityScore: number; // 0 ~ 100 친화도
}

export interface ZhuangziXiaoyaoyouButterflyReport {
  engineVersion: string;
  timestamp: string;
  xiaoyaoyouAbsoluteFreedomScore: number; // 0 ~ 100 소요유(절대 자유) 지수
  rocAscendingWindResonance: number; // 0 ~ 100 대붕(大鵬) 상승 기류 공명도
  qiwulunTranscendenceIndex: number; // 0 ~ 100 제물론(시비·득실 초월) 지수
  butterflyDreamFluidityScore: number; // 0 ~ 100 호접몽(물화·유연성) 흐름도
  dominantArchetype: ZhuangziArchetype; // 가장 강력히 작동하는 장자 원형
  secondaryArchetype: ZhuangziArchetype; // 보조 조율 원형
  zhuangziFreedomGuidance: string; // 장자의 대자유 지침
  wuSangWoEmptyRoomRitual: string; // 허실생백(虛室生白) 마음비움 리추얼
}

const ZHUANGZI_ARCHETYPES_BASE: Omit<ZhuangziArchetype, 'affinityScore'>[] = [
  {
    id: 'kun_to_peng',
    nameKo: '곤화위붕',
    hanja: '鯤化爲鵬',
    transcendentPrinciple: '심연의 응축된 힘이 폭발적 비상으로 전환되는 임계점 돌파',
    spiritualLiberationGift: '그동안 축적해 온 보이지 않는 노력이 거대한 도약의 날갯짓으로 화하는 순간',
  },
  {
    id: 'peng_cheng_wan_li',
    nameKo: '붕정만리',
    hanja: '鵬程萬里',
    transcendentPrinciple: '구만 리 높은 곳에서 구름을 밟고 푸른 하늘만을 벗 삼는 거시적 조망',
    spiritualLiberationGift: '사소한 시비와 일상의 자잘한 마찰을 발아래 두고 본질적 대업에 집중하는 호연지기',
  },
  {
    id: 'wu_sang_wo',
    nameKo: '오상아',
    hanja: '吾喪我',
    transcendentPrinciple: '인위적 자아(에고)를 잊고 텅 빈 방에 신령한 빛이 차오르는 허실생백',
    spiritualLiberationGift: '체면과 평가에 매달리던 긴장을 완전히 내려놓고 순수한 자연의 리듬을 회복함',
  },
  {
    id: 'pao_ding_jie_niu',
    nameKo: '포정해우',
    hanja: '庖丁解牛',
    transcendentPrinciple: '칼날을 상하지 않고 뼈와 살의 자연스러운 결을 따라 유유히 유영함',
    spiritualLiberationGift: '어려운 인간관계나 복잡한 난제를 억지 힘이 아닌 지혜로운 빈틈 공략으로 풀어냄',
  },
  {
    id: 'hu_die_zhi_meng',
    nameKo: '호접지몽',
    hanja: '胡蝶之夢',
    transcendentPrinciple: '내가 나비인지 나비가 나인지 분별을 잊고 유유자적 노니는 물화의 자유',
    spiritualLiberationGift: '성패와 득실의 무게에 짓눌리지 않고 인생 자체를 한 편의 아름다운 놀이로 유희함',
  },
];

export interface ZhuangziXiaoyaoyouButterflyOptions {
  profile?: UserProfile | null;
  question?: string;
  now?: Date;
  currentTime?: string;
}

export function calculateZhuangziXiaoyaoyouButterfly(
  optionsOrProfile?: ZhuangziXiaoyaoyouButterflyOptions | UserProfile | null,
  legacyContext?: { question?: string; currentTime?: string }
): ZhuangziXiaoyaoyouButterflyReport {
  let profile: UserProfile | null | undefined;
  let question = '';
  let now = new Date();

  if (optionsOrProfile && ('profile' in optionsOrProfile || 'question' in optionsOrProfile || 'now' in optionsOrProfile)) {
    const opts = optionsOrProfile as ZhuangziXiaoyaoyouButterflyOptions;
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

  let seed = 84503;
  for (let i = 0; i < bdate.length; i++) seed = (seed * 31 + bdate.charCodeAt(i)) % 1000003;
  for (let i = 0; i < btime.length; i++) seed = (seed * 19 + btime.charCodeAt(i)) % 1000003;
  for (let i = 0; i < question.length; i++) seed = (seed * 17 + question.charCodeAt(i)) % 1000003;
  seed = (seed + now.getUTCHours() * 41) % 1000003;

  const archetypes: ZhuangziArchetype[] = ZHUANGZI_ARCHETYPES_BASE.map((arch, idx) => {
    const score = 45 + ((seed * (idx + 3) + idx * 31) % 53);
    return { ...arch, affinityScore: Math.min(99, Math.max(38, score)) };
  });

  archetypes.sort((a, b) => b.affinityScore - a.affinityScore);
  const dominantArchetype = archetypes[0];
  const secondaryArchetype = archetypes[1];

  const xiaoyaoyouAbsoluteFreedomScore = Math.min(100, Math.max(45, 55 + ((seed * 17) % 43)));
  const rocAscendingWindResonance = Math.min(100, Math.max(40, 52 + ((seed * 23) % 46)));
  const qiwulunTranscendenceIndex = Math.min(100, Math.max(42, 50 + ((seed * 29) % 48)));
  const butterflyDreamFluidityScore = Math.min(100, Math.max(46, Math.floor((xiaoyaoyouAbsoluteFreedomScore * 0.5 + qiwulunTranscendenceIndex * 0.5))));

  const zhuangziFreedomGuidance = `뱁새와 매미의 좁은 가지 다툼에 얽매이지 마십시오. 현재 당신에게 깃든 기운은 [${dominantArchetype.nameKo}(${dominantArchetype.hanja})]의 기상입니다. ${dominantArchetype.spiritualLiberationGift}의 태도를 지닐 때, 사소한 시비는 사라지고 구만 리 장공의 자유로운 바람이 펼쳐집니다.`;
  const wuSangWoEmptyRoomRitual = `어깨의 긴장을 풀고 가슴 속 모든 분별과 계산을 허공으로 내쉬며 속삭이십시오: "허실생백(虛室生白), 방을 비우면 저절로 신령한 빛이 차오르듯 나를 비우고 천지의 큰 흐름에 몸을 맡긴다."`;

  return {
    engineVersion: ZHUANGZI_XIAOYAOYOU_BUTTERFLY_ENGINE_VERSION,
    timestamp: now.toISOString(),
    xiaoyaoyouAbsoluteFreedomScore,
    rocAscendingWindResonance,
    qiwulunTranscendenceIndex,
    butterflyDreamFluidityScore,
    dominantArchetype,
    secondaryArchetype,
    zhuangziFreedomGuidance,
    wuSangWoEmptyRoomRitual,
  };
}

export function formatZhuangziXiaoyaoyouButterflyPrompt(rep: ZhuangziXiaoyaoyouButterflyReport): string {
  return `[고대 도가 장자 소요유 붕정만리 & 제물론 호접몽 실측 데이터]
· 엔진 버전: v${rep.engineVersion}
· 소요유(대자유) 지수: ${rep.xiaoyaoyouAbsoluteFreedomScore}/100 | 대붕 상승 기류 공명도: ${rep.rocAscendingWindResonance}/100
· 제물론(시비·득실 초월) 지수: ${rep.qiwulunTranscendenceIndex}/100 | 호접몽 물화 유연성: ${rep.butterflyDreamFluidityScore}/100
· 주재 장자 원형: [${rep.dominantArchetype.nameKo} (${rep.dominantArchetype.hanja})] — 친화도 ${rep.dominantArchetype.affinityScore}%
  - 초월 원리: ${rep.dominantArchetype.transcendentPrinciple}
  - 영적 해방 은사: ${rep.dominantArchetype.spiritualLiberationGift}
· 보조 원형: [${rep.secondaryArchetype.nameKo} (${rep.secondaryArchetype.hanja})] — 친화도 ${rep.secondaryArchetype.affinityScore}%
· 장자의 대자유 지침: ${rep.zhuangziFreedomGuidance}
· 허실생백(虛室生白) 마음비움 리추얼: ${rep.wuSangWoEmptyRoomRitual}`;
}
