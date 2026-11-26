import { FIFTEEN_DIVINATION_TOOLS, type DivinationToolId } from '../fifteenDivinationTools';
import type { LucyActiveEngineTray, LucyTrayEngineStatus } from '../lucyActiveEngineTray';

/**
 * 🔮 점술모드 도구함의 탭 = 사주 원국 + 타로 + 나머지 13개 기초 도구 (총 15개).
 * 탭을 누르면 그 도구가 무엇을 보는지, 이번 상담에서 계산된 결과가 무엇인지 바로 보인다.
 */
export interface DivinationToolTabMeta {
  id: DivinationToolId;
  icon: string;
  /** 좁은 탭에 들어가는 짧은 이름 */
  label: string;
  nameKo: string;
}

const TAB_META: Record<DivinationToolId, { icon: string; label: string }> = {
  saju: { icon: '☯', label: '사주' },
  tarot: { icon: '🃏', label: '타로' },
  astrology: { icon: '✨', label: '점성' },
  ziwei: { icon: '🌟', label: '자미' },
  sukuyo: { icon: '🌙', label: '숙요' },
  mahabote: { icon: '🪐', label: '마하' },
  vedic: { icon: '🕉', label: '베딕' },
  liuren: { icon: '🧭', label: '육임' },
  qimen: { icon: '🚪', label: '기문' },
  kabbalah: { icon: '🌳', label: '카발' },
  iching: { icon: '☰', label: '주역' },
  thai_astrology: { icon: '🐘', label: '태국' },
  tojeong: { icon: '📅', label: '토정' },
  kyusei: { icon: '🧮', label: '구성' },
  taiyi: { icon: '🎯', label: '태을' },
};

/** 사주·타로가 앞, 나머지 13개 기초 도구가 뒤 (앱의 기존 순서). */
export const DIVINATION_TOOL_TAB_ORDER: readonly DivinationToolId[] = [
  'saju', 'tarot',
  'astrology', 'ziwei', 'sukuyo', 'mahabote', 'vedic', 'liuren', 'qimen',
  'kabbalah', 'iching', 'thai_astrology', 'tojeong', 'kyusei', 'taiyi',
];

export const DIVINATION_TOOL_TABS: readonly DivinationToolTabMeta[] = DIVINATION_TOOL_TAB_ORDER.map(id => ({
  id,
  icon: TAB_META[id].icon,
  label: TAB_META[id].label,
  nameKo: FIFTEEN_DIVINATION_TOOLS[id].koName,
}));

/** 이번 상담에서 실제로 쓰인 도구·관점 (도구함 탭 배지와 엔진함 강조에 같이 쓴다). */
export function findTrayEngine(
  tray: LucyActiveEngineTray | null | undefined,
  key: string,
): { status: LucyTrayEngineStatus } | undefined {
  if (!tray) return undefined;
  return tray.foundational.find(item => item.key === key) ?? tray.deep.find(item => item.key === key);
}

/** 탭 배지에 쓸 짧은 상태 말 (쓰지 않은 도구는 배지를 달지 않는다). */
export const TRAY_STATUS_SHORT: Record<LucyTrayEngineStatus, string> = {
  calculated: '계산',
  partial: '부분',
  symbolic: '상징',
};
