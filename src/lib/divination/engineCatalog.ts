import { ALL_DCE_ENGINES, type DceEngineMeta } from './deterministicEngine';
import { DEEP_PERSPECTIVE_RESEARCH, type DeepPerspectiveResearchEntry } from './deepPerspectiveResearch';
import {
  FIFTEEN_DIVINATION_TOOLS,
  type DivinationToolId,
  type SevenThemeChannel,
} from '../fifteenDivinationTools';
import { LUCY_PRO_CATALOG_DUPLICATE_KEYS } from './catalogDuplicateKeys';

/**
 * User-facing Lucy Pro catalog omits only confirmed duplicate entries from the runtime registry.
 */
export const LUCY_PRO_CATALOG_ENGINES = ALL_DCE_ENGINES.filter(
  engine => !LUCY_PRO_CATALOG_DUPLICATE_KEYS.has(engine.key),
);

export const ENGINE_CATALOG_COUNTS = LUCY_PRO_CATALOG_ENGINES.reduce(
  (counts, engine) => {
    counts[engine.category] += 1;
    return counts;
  },
  { foundational: 0, deep_master: 0 },
);

export const DEEP_PERSPECTIVE_RESEARCH_COUNTS = DEEP_PERSPECTIVE_RESEARCH.reduce(
  (counts, item) => {
    counts.total += 1;
    if (item.supported) counts.supported += 1;
    else counts.unsupported += 1;
    return counts;
  },
  { total: 0, supported: 0, unsupported: 0 },
);

export interface LucyProChannelTheme {
  id: SevenThemeChannel;
  label: string;
  route: string;
  description: string;
}

/** The app's seven actual channel themes, in the established app order. */
export const LUCY_PRO_CHANNEL_THEMES: readonly LucyProChannelTheme[] = [
  { id: 'prologue', label: '프롤로그', route: '/prologue', description: '삶의 시작·방향·목적' },
  { id: 'orange', label: '오렌지', route: '/orange', description: '감정·소원·마음 성찰' },
  { id: 'trinity', label: '트리니티', route: '/trinity', description: '운명·상징·선택' },
  { id: 'aura', label: '아우라', route: '/heal', description: '명상·웰니스·회복' },
  { id: 'bluebird', label: '파랑새', route: '/bluebird', description: '일상·관계·소통' },
  { id: 'muse', label: '뮤즈', route: '/muse', description: '예술·창작·영감' },
  { id: 'epilogue', label: '에필로그', route: '/epilogue', description: '기록·회고·정리' },
];

const themeById = new Map(LUCY_PRO_CHANNEL_THEMES.map(theme => [theme.id, theme] as const));

const researchByKey: ReadonlyMap<string, DeepPerspectiveResearchEntry> = new Map(
  DEEP_PERSPECTIVE_RESEARCH.map(item => [item.key, item] as const),
);

export function getEngineCatalogResearch(engine: DceEngineMeta): DeepPerspectiveResearchEntry | undefined {
  if (engine.category !== 'deep_master') return undefined;
  return researchByKey.get(engine.key);
}

export interface EngineCatalogSource {
  title: string;
  url: string;
}

export function getEngineCatalogSources(engine: DceEngineMeta): EngineCatalogSource[] {
  const research = getEngineCatalogResearch(engine);
  if (!research?.supported || !research.sourceUrl) return [];

  const urls = research.sourceUrl.split(/\s*;\s*(?=https?:\/\/)/i).filter(Boolean);
  const titles = urls.length > 1 ? research.sourceTitle.split(/\s*;\s*/) : [research.sourceTitle];

  return urls.flatMap((rawUrl, index) => {
    try {
      const parsed = new URL(rawUrl.trim());
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return [];
      const title = titles.length === urls.length ? titles[index] : research.sourceTitle;
      return [{ title: title?.trim() || '자료', url: parsed.toString() }];
    } catch {
      return [];
    }
  });
}

export function getEngineCatalogMeaning(engine: DceEngineMeta): string {
  if (engine.meaning?.trim()) return engine.meaning;

  if (engine.category === 'foundational') {
    const tool = FIFTEEN_DIVINATION_TOOLS[engine.key as DivinationToolId];
    return tool?.bestFor ?? tool?.coreEssence ?? '질문과 필요한 입력에 따라 실제 산출 여부가 달라집니다.';
  }

  const research = getEngineCatalogResearch(engine);
  if (research) return research.meaning;
  if (engine.summary?.trim()) return engine.summary;

  return `「${engine.nameKo}」에 담긴 전통과 핵심 주제를 빌려 질문을 비춰보는 심층 참고 관점입니다. 이 항목 자체가 개인별 계산·측정·예측 결과를 뜻하지는 않습니다.`;
}

const THEME_SIGNALS: Record<SevenThemeChannel, readonly RegExp[]> = {
  prologue: [
    /삶의\s*(?:의미|목적|방향|여정)|생애주기|생애의\s*흐름|정체성|자기.?발견|진로|기원|탄생|시작|창조론|이키가이|존재의\s*의미|미래\s*설계|성장\s*단계/i,
    /\b(?:purpose|identity|origin|creation|life\s*cycle|life\s*journey|ikigai|self.?discovery|beginning)\b/i,
  ],
  orange: [
    /감정|정서|마음|소원|욕망|애정|사랑|그리움|상처|애착|무의식|그림자|내면|심리|꿈|욕구|희망|용서|불안|슬픔|자기.?성찰/i,
    /\b(?:emotion|desire|wish|dream|love|grief|attachment|shadow|subconscious|heart|psychology|inner|forgiveness)\b/i,
  ],
  trinity: [
    /사주|점성|타로|오라클|점복|점술|예언|운세|주역|기문|자미두수|육임|명리|수비학|별자리|천궁도|점괘|괘상|풍수|길흉|신살|대운|세운|유년사화|역법/i,
    /\b(?:divination|astrology|tarot|oracle|horoscope|fortune|iching|i.ching|qimen|ziwei|numerology|geomancy|rune|zodiac|prophecy|hexagram)\b/i,
  ],
  aura: [
    /건강|치유|회복|신체|몸|심신|명상|웰니스|수면|생리|의학|바이오|호흡|차크라|요가|수련|기공|기력|스트레스|탄력성|소매틱|도샤|경락|프라나|운동|식이|신경|뇌파/i,
    /\b(?:health|healing|wellness|body|somatic|sleep|meditation|breath|chakra|yoga|prana|vitality|biorhythm|bioenergy|resilience|mindfulness|meridian)\b/i,
  ],
  bluebird: [
    /대화|소통|의사소통|인연|궁합|관계|우정|협력|공동체|네트워크|협상|계약|직업|진로|재물|부의|경제|일상|하루|습관|업무|리더십|사회|조직|정치|친구|가족|공감|갈등|파트너|동료|우호/i,
    /\b(?:communication|conversation|relationship|synastry|network|contract|career|wealth|finance|daily|habit|leadership|social|friendship|partner|collaboration|empathy)\b/i,
  ],
  muse: [
    /예술|창작|창의|시인|시학|문학|시|음악|미학|아름다움|작품|영감|상상|표현|예술가|롤모델|신화|서사|영웅|이야기|공연|그림|예술적|창조적/i,
    /\b(?:art|artist|creative|creativity|poetry|poet|literature|music|aesthetic|beauty|inspiration|imagination|myth|story|hero|role.?model)\b/i,
  ],
  epilogue: [
    /일기|기록|회고|기억|과거|역사|전기|자서전|유산|마무리|종결|고백|연대기|생애사|기억술|사후|죽음|애도|되돌아|회상|추억|역사서/i,
    /\b(?:diary|journal|memoir|memory|legacy|history|chronicle|retrospect|review|closure|afterlife|death|confession|biography)\b/i,
  ],
};

const AUTO_THEME_PRIORITY: readonly SevenThemeChannel[] = [
  'aura', 'muse', 'epilogue', 'bluebird', 'prologue', 'trinity', 'orange',
];

/**
 * Every catalog item receives one primary channel. Existing foundational tools keep
 * their authored primaryTheme; new entries can set primaryTheme explicitly, and all
 * other entries are assigned from their key/name/meaning by this deterministic fallback.
 */
export function getEngineCatalogTheme(engine: DceEngineMeta): SevenThemeChannel {
  if (engine.primaryTheme) return engine.primaryTheme;

  if (engine.category === 'foundational') {
    const tool = FIFTEEN_DIVINATION_TOOLS[engine.key as DivinationToolId];
    if (tool) return tool.primaryTheme;
  }

  const research = getEngineCatalogResearch(engine);
  const searchableText = [engine.key, engine.nameKo, engine.meaning ?? '', engine.summary ?? '', research?.meaning ?? ''].join(' ');
  const scores = AUTO_THEME_PRIORITY.map(theme => ({
    theme,
    score: THEME_SIGNALS[theme].reduce((score, signal) => score + Number(signal.test(searchableText)), 0),
  }));
  const best = scores.reduce((winner, candidate) => candidate.score > winner.score ? candidate : winner);
  return best.score > 0 ? best.theme : 'trinity';
}

export function getEngineCatalogThemeInfo(engine: DceEngineMeta): LucyProChannelTheme {
  return themeById.get(getEngineCatalogTheme(engine)) ?? LUCY_PRO_CHANNEL_THEMES[2];
}

export const ENGINE_CATALOG_THEME_COUNTS = LUCY_PRO_CATALOG_ENGINES.reduce(
  (counts, engine) => {
    counts[getEngineCatalogTheme(engine)] += 1;
    return counts;
  },
  { prologue: 0, orange: 0, trinity: 0, aura: 0, bluebird: 0, muse: 0, epilogue: 0 },
);
