/**
 * 🔮 오브의 단일 마스터 — '마스터 루시'.
 *
 * 예전에는 사주·타로·점성·마음 네 마스터 카드에서 하나를 골랐다.
 * 지금은 오브가 **사주와 타로만** 극한으로 파는 상담이므로, 고르는 단계 없이
 * 마스터 루시 한 명이 원국·대운·세운·월운·일진과 카드 세 장을 교차해 풀이한다.
 *
 * 구형 id(saju · tarot · astro · heart)는 저장된 상담 기록이나 옛 링크에서 들어와도
 * 모두 마스터 루시로 매핑된다.
 */
export const ORB_MASTER_ID = 'lucy' as const;

export const ORB_MASTERS = [
  {
    id: ORB_MASTER_ID,
    name: '마스터 루시',
    voice: 'Kore',
    tone: '차분하고 낮은 목소리',
    topic: '사주 원국과 타로 카드',
    specialty: ['사주 원국', '타로 3장', '대운·세운'],
    intro: '사주 원국과 대운으로 시기를 짚고, 손님이 뽑은 카드 세 장과 교차해 마음과 결정을 풀어 드려요.',
    style: '차분하고 낮게, 근거부터 차근차근',
    bestFor: '일·돈·관계·시기를 한 번에 깊이 볼 때',
    cardPick: true,
    focus: '사주명리와 타로만 쓰는 통합 상담가. 고민을 들으면 원국·십신·용신·대운·세운·월운·일진으로 시기를 먼저 짚고, 카드 세 장(과거·지금·앞으로)을 뽑아 그 흐름과 교차해 풀이합니다.',
    greet: '차분하고 낮은 존댓말. 사주 원국과 카드 한 장을 앞에 두고 앉은 느낌으로, "사주와 카드로 같이 끝까지 봐 드릴게요"처럼 두 문장 안으로 인사하세요.',
    prompts: [
      '올해 대운에서 열리는 일',
      '이번 달 흐름과 조심할 것',
      '그 사람과의 인연을 카드로',
      '돈이 풀리는 시기와 한 가지 행동',
    ],
  },
] as const;

export type OrbMaster = (typeof ORB_MASTERS)[number];

/** 통합 전 네 마스터 id. 저장된 기록·옛 링크에서 들어오면 마스터 루시로 본다. */
export const ORB_LEGACY_MASTER_IDS = ['saju', 'tarot', 'astro', 'heart'] as const;

const LEGACY_SET: ReadonlySet<string> = new Set<string>(ORB_LEGACY_MASTER_IDS);

/** 저장소·딥링크의 어떤 id든 실제로 상담할 마스터(마스터 루시) id로 바꾼다. */
export function normalizeOrbMasterId(id?: string | null): string {
  if (!id || id === 'lucy-voice') return ORB_MASTER_ID;
  if (id === ORB_MASTER_ID) return ORB_MASTER_ID;
  if (LEGACY_SET.has(id)) return ORB_MASTER_ID;
  return id;
}

/** 저장소·딥링크의 어떤 id든 실제로 상담할 마스터로 바꾼다. */
export function resolveOrbMaster(id?: string | null): OrbMaster {
  // 마스터는 한 명이다 — 구형 id(saju·tarot·astro·heart)도 모두 마스터 루시로 본다.
  void normalizeOrbMasterId(id);
  return ORB_MASTERS[0];
}

/** 지난 상담 기록에 남은 마스터 이름 (구형 이름이면 마스터 루시로 표시한다). */
export function orbMasterDisplayName(id?: string | null, storedName?: string | null): string {
  if (id && (id === ORB_MASTER_ID || LEGACY_SET.has(id))) return ORB_MASTERS[0].name;
  return storedName?.trim() || ORB_MASTERS[0].name;
}

const VOICES = new Set<string>(ORB_MASTERS.map(master => master.voice));

export function orbVoice(voice: string): string {
  return VOICES.has(voice) ? voice : 'Kore';
}
