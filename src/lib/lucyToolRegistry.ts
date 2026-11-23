export type DivinationToolId =
  | 'saju'           // 1. 사주 (四柱命理)
  | 'astrology'      // 2. 점성술 (Western Astrology)
  | 'ziwei'          // 3. 자미두수 (紫微斗數)
  | 'tarot'          // 4. 타로 (Tarot)
  | 'sukuyo'         // 5. 숙요 (宿曜經 / 27숙)
  | 'mahabote'       // 6. 마하보테 (Mahabote 미얀마 8요일 점성술)
  | 'vedic'          // 7. 베딕 (Vedic Jyotish 인도점성술)
  | 'liuren'         // 8. 육임 (大六壬)
  | 'qimen'          // 9. 홍국기문 (洪局奇門 / 기문둔갑)
  | 'kabbalah'       // 10. 카발라 (Kabbalah 세피로트 생명나무)
  | 'iching'         // 11. 주역 (周易 64괘)
  | 'thai_astrology' // 12. 태국점성술 (Thai Horasat)
  | 'tojeong'        // 13. 토정비결 (土亭秘訣)
  | 'kyusei'         // 14. 구성학 (九星氣學)
  | 'taiyi';         // 15. 태을신수 (太乙神數)

export type LucyToolNeed = 'birthdate' | 'none';

export interface LucyToolMeta {
  id: DivinationToolId;
  name: string;
  /** 마스터가 도구를 고를 때 보는 한 줄 설명 (해석 문장 아님). */
  about: string;
  needs: LucyToolNeed;
  /** 생시가 있으면 더 정확해지는 도구. */
  betterWithTime?: boolean;
  voicePick?: boolean;
}

/** Chat, divination and live voice use this list for the same underlying tools. */
export const LUCY_TOOL_REGISTRY: readonly LucyToolMeta[] = [
  { id: 'saju', name: '사주명리', about: '생년월일시의 네 기둥과 오행, 대운으로 타고난 기질과 시기의 흐름', needs: 'birthdate', betterWithTime: true },
  { id: 'tarot', name: '타로', about: '손님이 선택한 카드와 자리로 지금의 고민을 풀어 보기', needs: 'none', voicePick: true },
  { id: 'astrology', name: '서양 점성술', about: '태어난 때의 행성 위치와 각도로 성향과 관계의 결', needs: 'birthdate', betterWithTime: true },
  { id: 'ziwei', name: '자미두수', about: '명궁의 별과 열두 궁으로 삶의 영역별 그릇 (연애·재물·일)', needs: 'birthdate', betterWithTime: true },
  { id: 'vedic', name: '베딕 점성술', about: '달의 별자리와 다샤(지금 흐르는 행성 시기)로 마음과 시기', needs: 'birthdate', betterWithTime: true },
  { id: 'sukuyo', name: '숙요', about: '태어난 날의 27숙으로 기질과 사람 사이의 인연 관계', needs: 'birthdate' },
  { id: 'kyusei', name: '구성학', about: '본명성(아홉 별)으로 기질과 올해·이달의 방위 흐름', needs: 'birthdate' },
  { id: 'tojeong', name: '토정비결', about: '올해 한 해의 괘와 열두 달 흐름', needs: 'birthdate' },
  { id: 'mahabote', name: '마하보테', about: '미얀마 요일 점성으로 태어난 요일의 별과 집', needs: 'birthdate' },
  { id: 'thai_astrology', name: '태국 점성술', about: '태어난 요일의 수호신과 나이별 시기 흐름', needs: 'birthdate' },
  { id: 'kabbalah', name: '카발라 수비학', about: '생년월일 숫자로 생명나무의 자리 (현대 헤르메스 전통의 상징 대응)', needs: 'birthdate' },
  { id: 'iching', name: '주역', about: '지금 시각으로 세운 괘 하나로 이번 물음의 상(象). 사람마다 같은 시각의 판', needs: 'none' },
  { id: 'liuren', name: '육임', about: '지금 시각의 판으로 이번 일의 진행과 사람 관계의 흐름', needs: 'none' },
  { id: 'qimen', name: '기문둔갑', about: '지금 시각의 판으로 방향과 때, 움직일지 기다릴지', needs: 'none' },
  { id: 'taiyi', name: '태을수', about: '올해의 연국으로 큰 시대 흐름 (개인 운명 아님)', needs: 'none' },
];

const LUCY_TOOL_IDS: ReadonlySet<string> = new Set(LUCY_TOOL_REGISTRY.map(tool => tool.id));

const SHARED_CHART_SCOPE: Partial<Record<string, string>> = {
  iching: '지금 시각의 괘 · 같은 시각에 물으면 누구나 같은 괘 · 개인 운명이 아니라 이번 물음의 상(象)으로만 풀 것',
  liuren: '지금 시각의 판 · 같은 시각이면 누구나 같음 · 이번 일의 흐름으로만 풀고 타고난 운명처럼 말하지 말 것',
  qimen: '지금 시각의 기문 판(점시) · 누구나 같음 · 생년월일 기반 홍국기문이 아님',
  taiyi: '올해의 연국 · 올해 모든 사람에게 같은 시대 흐름 · 개인 운명처럼 말하지 말 것',
};

export function getLucyToolScope(id: string): string | undefined {
  return Object.hasOwn(SHARED_CHART_SCOPE, id) ? SHARED_CHART_SCOPE[id] : undefined;
}

export function isLucyToolId(id: string): id is DivinationToolId {
  return LUCY_TOOL_IDS.has(id);
}
