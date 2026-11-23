/**
 * 📚 숙요(宿曜) 해석 카드: 7종 숙격 + 6가지 인연 관계(三九).
 *
 * 숙격 소속은 『숙요경』 7종(七種) 분류, 관계 이름은 본명숙에서의 거리로 정하는 삼구법(三九秘法)의
 * 통용 명칭(명·업태·영친·우쇠·안괴·위성)이다. 성향 문장은 상징적 참고이며 사람을 단정하지 않는다.
 */
export interface SukuyoTypeCard { key: string; hanja: string; members: string; core: string; use: string; caution: string }
export interface SukuyoRelationCard { key: string; hanja: string; core: string; use: string; caution: string }

export const SUKUYO_TYPE_CARDS: readonly SukuyoTypeCard[] = [
  { key: '안주', hanja: '安重宿', members: '두·벽·필·익', core: '안정되고 무게 있는 별, 오래 가는 일을 맡음', use: '기반을 다지는 일·장기 계획·신뢰 쌓기', caution: '변화가 필요할 때 늦게 움직이는 것' },
  { key: '화선', hanja: '和善宿', members: '각·방·규·자', core: '온화하고 조화로운 별, 사람과 배움을 잇는 힘', use: '학문·예술·중재·관계 맺기', caution: '좋은 사람이려다 자기 뜻을 잃는 것' },
  { key: '독해', hanja: '毒害宿', members: '심·미·삼·류', core: '강렬하고 날카로운 별, 남이 꺼리는 길도 뚫는 힘', use: '개척·위기 대응·깊이 파고드는 일', caution: '그 힘이 사람을 향해 상처가 되는 것' },
  { key: '급속', hanja: '急速宿', members: '루·위(胃)·귀·진', core: '빠르고 기민한 별, 움직임과 연결의 힘', use: '이동·거래·빠른 판단이 필요한 일', caution: '마무리를 놓치고 다음으로 넘어가는 것' },
  { key: '맹악', hanja: '猛惡宿', members: '기·실·성·장', core: '강인하고 물러서지 않는 별, 승부의 힘', use: '결단·경쟁·밀어붙여야 하는 일', caution: '관계에서도 이기려 드는 것' },
  { key: '경조', hanja: '輕躁宿', members: '항·여·허·위(危)·정', core: '가볍고 재빠른 별, 변화와 사교의 감각', use: '새 흐름 열기·사람 모으기·기획', caution: '한 가지를 끝까지 이어 가지 못하는 것' },
  { key: '강유', hanja: '剛柔宿', members: '저·묘', core: '강함과 부드러움을 함께 지닌 별', use: '밀고 당기는 균형이 필요한 협상·조율', caution: '상황마다 태도가 바뀌어 보이는 것' },
];

export const SUKUYO_RELATION_CARDS: readonly SukuyoRelationCard[] = [
  { key: '명', hanja: '命', core: '같은 본명숙, 거울 같은 사이', use: '서로를 비추며 자신을 돌아보기', caution: '같은 약점이 겹쳐 함께 무너지는 것' },
  { key: '업태', hanja: '業胎', core: '깊은 인연(업·태), 오래 이어지는 끈', use: '오래 함께할 일과 관계', caution: '이유 없는 집착이나 무거움' },
  { key: '영친', hanja: '榮親', core: '서로 북돋우는 좋은 사이', use: '협력·동업·함께 성장하기', caution: '편안함에 기대어 노력을 멈추는 것' },
  { key: '우쇠', hanja: '友衰', core: '편한 친구 같지만 기운을 빼기 쉬운 사이', use: '가벼운 우정·휴식 같은 관계', caution: '함께 게을러지거나 서로 소모되는 것' },
  { key: '안괴', hanja: '安壞', core: '강하게 끌리지만 한쪽이 무너지기 쉬운 사이', use: '자극과 변화를 주는 관계로 짧게', caution: '거리 조절 없이 깊이 얽히는 것' },
  { key: '위성', hanja: '危成', core: '서로 다른 세계, 맞추면 이루지만 불안정한 사이', use: '다름을 살린 역할 분담', caution: '차이를 무시하고 같아지길 바라는 것' },
];

const TYPE_BY_KEY = new Map(SUKUYO_TYPE_CARDS.map(card => [card.key, card]));

export function findSukuyoTypeCard(key: string | undefined | null): SukuyoTypeCard | null {
  return key ? TYPE_BY_KEY.get(key) ?? null : null;
}

export function formatSukuyoTypeCard(card: SukuyoTypeCard, mansionLabel: string): string {
  return `숙요 본명숙 ${mansionLabel} · ${card.key}숙(${card.hanja}, 동료 숙 ${card.members}) — 뜻: ${card.core} · 쓰임: ${card.use} · 주의: ${card.caution}`;
}

export function formatSukuyoRelationGuide(): string {
  return `숙요 인연 관계(상대 숙이 주어질 때만 사용): ${SUKUYO_RELATION_CARDS.map(card => `${card.key}(${card.hanja}) ${card.core}`).join(' / ')}`;
}
