import { useEffect, useState } from 'react';
import { safeLocalStorage } from '@/utils/safeStorage';
import { LUCY_PRO_CATALOG_ENGINES } from '@/lib/divination/engineCatalog';
import type { DivinationToolId } from '@/lib/fifteenDivinationTools';

/**
 * 🧰 루시 엔진함: 사용자가 직접 골라 둔 엔진(기초 도구 + 심층 관점)을 매 답변에 함께 쓴다.
 * 여러 개를 동시에 골라 쓸 수 있고, 맞춤 세팅(추천 묶음)으로 한 번에 담을 수도 있다.
 */
const STORAGE_KEY = 'lucy_selected_engines_v1';
export const LUCY_ENGINES_CHANGED_EVENT = 'prism:lucy_engines_changed';

const ENGINE_BY_KEY = new Map(LUCY_PRO_CATALOG_ENGINES.map(engine => [engine.key, engine] as const));

export interface EnginePreset {
  id: string;
  label: string;
  description: string;
  keys: string[];
}

/** 맞춤 세팅 추천: 고민 주제별로 잘 맞는 엔진 묶음 */
export const LUCY_ENGINE_PRESETS: EnginePreset[] = [
  {
    id: 'love',
    label: '💕 연애·인연',
    description: '사주·타로에 궁합과 인연의 흐름을 더해요',
    keys: ['saju', 'tarot', 'sukuyo', 'contextualSynastry', 'karmicSynastry', 'destinySynastryEcho'],
  },
  {
    id: 'career',
    label: '💼 이직·커리어',
    description: '자미두수·기문둔갑으로 시기와 전략을 봐요',
    keys: ['saju', 'ziwei', 'qimen', 'specialStarsMatrix', 'lifeSeasonTiming', 'strategicLeverage', 'ikigaiDestinyCompass'],
  },
  {
    id: 'wealth',
    label: '💰 재물·투자',
    description: '돈의 흐름과 계약·협상 타이밍을 봐요',
    keys: ['saju', 'ziwei', 'wealthPipeline', 'contractShield', 'monthlyFlow', 'auspiciousStars'],
  },
  {
    id: 'healing',
    label: '🌙 마음·치유',
    description: '타로와 심리 관점으로 마음을 들여다봐요',
    keys: ['saju', 'tarot', 'shadowArchetype', 'mentalResilience', 'sleepSubconscious', 'synchronicityOmen'],
  },
  {
    id: 'timing',
    label: '📅 타이밍·택일',
    description: '주역·월운·택일로 언제가 좋은지 봐요',
    keys: ['saju', 'iching', 'chronoTransit', 'monthlyFlow', 'twentyEightMansions', 'instantDecision', 'samjaeGyoUn'],
  },
];

export function getSelectedEngineKeys(): string[] {
  try {
    const raw = JSON.parse(safeLocalStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((k): k is string => typeof k === 'string' && ENGINE_BY_KEY.has(k)) : [];
  } catch {
    return [];
  }
}

export function setSelectedEngineKeys(keys: readonly string[]): void {
  const clean = [...new Set(keys)].filter(k => ENGINE_BY_KEY.has(k));
  try { safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(clean)); } catch { /* best effort */ }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LUCY_ENGINES_CHANGED_EVENT, { detail: { keys: clean } }));
  }
}

export function toggleSelectedEngine(key: string): void {
  const current = getSelectedEngineKeys();
  setSelectedEngineKeys(current.includes(key) ? current.filter(k => k !== key) : [...current, key]);
}

/** 프리셋의 엔진이 지금 선택과 정확히 같은지 (활성 표시용) */
export function isPresetActive(preset: EnginePreset, selected: readonly string[]): boolean {
  const keys = preset.keys.filter(k => ENGINE_BY_KEY.has(k));
  return keys.length === selected.length && keys.every(k => selected.includes(k));
}

/** 답변 요청에 넘길 형태: 기초 도구와 심층 관점으로 나눈다 */
export function splitSelectedEngines(keys: readonly string[] = getSelectedEngineKeys()): {
  pinnedTools: DivinationToolId[];
  pinnedDeepKeys: string[];
} {
  const pinnedTools: DivinationToolId[] = [];
  const pinnedDeepKeys: string[] = [];
  for (const key of keys) {
    const engine = ENGINE_BY_KEY.get(key);
    if (!engine) continue;
    if (engine.category === 'foundational') pinnedTools.push(key as DivinationToolId);
    else pinnedDeepKeys.push(key);
  }
  return { pinnedTools, pinnedDeepKeys };
}

export function useSelectedEngines(): string[] {
  const [keys, setKeys] = useState<string[]>(() => getSelectedEngineKeys());
  useEffect(() => {
    const handle = () => setKeys(getSelectedEngineKeys());
    window.addEventListener(LUCY_ENGINES_CHANGED_EVENT, handle);
    window.addEventListener('storage', handle);
    return () => {
      window.removeEventListener(LUCY_ENGINES_CHANGED_EVENT, handle);
      window.removeEventListener('storage', handle);
    };
  }, []);
  return keys;
}

/* ───────────── 🔗 추천질문 라이브러리 ↔ 엔진함 연동 ───────────── */
export interface PromptLike {
  id?: string;
  category?: string;
  title: string;
  body: string;
}

const KEYWORD_ENGINES: [RegExp, string[]][] = [
  [/타로|카드/, ['tarot']],
  [/사주|명리|일주|대운|오행/, ['saju']],
  [/점성술|트랜짓|행성|출생\s*차트|별자리/, ['astrology', 'chronoTransit']],
  [/자미두수/, ['ziwei']],
  [/주역|괘/, ['iching']],
  [/기문/, ['qimen']],
  [/숙요|27숙/, ['sukuyo']],
  [/베딕|인도\s*점성/, ['vedic']],
  [/카발라|생명의\s*나무/, ['kabbalah']],
  [/토정/, ['tojeong']],
  [/구성학/, ['kyusei']],
];

/** 질문에 가장 잘 맞는 맞춤 세팅 */
export function recommendPresetForPrompt(prompt: PromptLike): EnginePreset {
  const text = `${prompt.title} ${prompt.body}`;
  const byId = (id: string) => LUCY_ENGINE_PRESETS.find(p => p.id === id)!;
  if (/재회|연애|궁합|인연|짝사랑|결혼|애인|그\s*사람/.test(text) || prompt.category === 'relationship') return byId('love');
  if (/돈|재물|투자|금전|수입|부자|재테크|월급/.test(text)) return byId('wealth');
  if (/이직|취업|커리어|직장|사업|승진|진로|적성|합격|시험/.test(text) || prompt.category === 'success') return byId('career');
  if (/언제|시기|타이밍|택일|올해|이번\s*달|흐름/.test(text) || prompt.category === 'fortune') return byId('timing');
  return byId('healing');
}

/** 질문 하나에 추천하는 엔진: 맞춤 세팅 + 질문에 직접 언급된 도구 */
export function recommendedEnginesForPrompt(prompt: PromptLike): string[] {
  const text = `${prompt.title} ${prompt.body}`;
  const extra = KEYWORD_ENGINES.filter(([re]) => re.test(text)).flatMap(([, keys]) => keys);
  return [...new Set([...recommendPresetForPrompt(prompt).keys, ...extra])].filter(k => ENGINE_BY_KEY.has(k));
}

/** 지금 담긴 엔진과 잘 맞는 추천 질문 (활성 세팅 우선, 아니면 겹치는 엔진 수) */
export function recommendPromptsForEngines<T extends PromptLike>(prompts: readonly T[], selected: readonly string[], limit = 3): T[] {
  if (!selected.length) return [];
  const activePreset = LUCY_ENGINE_PRESETS.find(p => isPresetActive(p, selected));
  const scored = prompts.map((prompt, index) => {
    const recommended = recommendedEnginesForPrompt(prompt);
    const overlap = recommended.filter(k => selected.includes(k)).length;
    const presetMatch = activePreset && recommendPresetForPrompt(prompt).id === activePreset.id ? 100 : 0;
    return { prompt, index, score: presetMatch + overlap };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);
  return scored.slice(0, limit).map(item => item.prompt);
}
