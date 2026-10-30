import { TAROT_DECK, type TarotCard } from './tarotData';
import assets from './oracleDeckAssets.json';

export type OracleDeckMode = 'healing' | 'miracle' | 'growth' | 'money';
const moneySymbols: [string, string[], string][] = [
  ['혼돈', ['시작', '정리', '가능성'], '불분명한 돈의 흐름을 기록하고 수입과 지출을 구분하세요.'],
  ['빛', ['명료함', '이해', '발견'], '금액·수수료·기한을 확인해 모르는 조건을 명확히 하세요.'],
  ['식물', ['성장', '양육', '시간'], '단번의 대박보다 꾸준히 기를 수 있는 기술과 습관에 집중하세요.'],
  ['하늘', ['시야', '질서', '전망'], '멀리 보고 계획하되 지금 감당할 수 있는 예산부터 정하세요.'],
  ['사람과 동물', ['협력', '생활', '균형'], '관계 속 금전 경계를 정하고 서로 공정한 보상을 확인하세요.'],
  ['별들', ['방향', '주기', '희망'], '목표를 작게 나누고 수입 변동에 대비할 여유를 점검하세요.'],
  ['새와 물고기', ['이동', '탐색', '교류'], '새로운 기회를 탐색하되 검증되지 않은 소문에 돈을 맡기지 마세요.'],
  ['휴식', ['멈춤', '회복', '정돈'], '조급한 결정을 잠시 멈추고 생활비와 비상 지출을 점검하세요.'],
  ['정의', ['정산', '공정', '책임'], '미수금·계약·세금과 정산 기록을 확인하세요.'],
  ['절제', ['균형', '조절', '절약'], '현재의 필요와 미래의 저축 사이에서 유지 가능한 기준을 정하세요.'],
  ['힘', ['인내', '절제력', '지속'], '충동구매와 만회 심리를 가라앉히고 정한 원칙을 지키세요.'],
  ['신중함', ['분별', '검토', '보호'], '조건을 비교하고 이해하지 못한 금융 상품은 서둘러 선택하지 마세요.'],
  ['대사제', ['배움', '신뢰', '원칙'], '공식 자료로 금융 지식을 배우고 필요하면 자격 있는 전문가에게 물어보세요.'],
  ['악마', ['욕망', '집착', '구속'], '과시 소비·과도한 빚·수익 보장 유혹과 거리를 두세요.'],
  ['마술사', ['기술', '창의', '실행'], '가진 기술로 제공할 수 있는 가치를 적고 비용 없는 작은 실험부터 하세요.'],
  ['최후의 심판', ['점검', '결단', '재출발'], '과거의 금전 결정을 돌아보고 반복하지 않을 실수를 정리하세요.'],
  ['죽음', ['종료', '전환', '정리'], '더 이상 쓰지 않는 구독과 손실을 반복하는 습관을 정리하세요.'],
  ['수도자', ['성찰', '절제', '본질'], '타인과 비교하지 않고 자신에게 충분한 생활의 기준을 정하세요.'],
  ['무너진 신전', ['변화', '불안정', '재건'], '예상 밖 지출에 대비하고 무리한 차입이나 몰아넣기를 피하세요.'],
  ['운명의 수레바퀴', ['순환', '변동', '기회'], '운의 변화를 단정하지 말고 기회와 위험을 함께 살펴보세요.'],
  ['지배자', ['권한', '통제', '경계'], '돈의 주도권을 점검하고 불공정한 요구에는 분명한 경계를 세우세요.'],
];

function etteillaBase(number: number): TarotCard {
  if (number <= 21) {
    const symbol = moneySymbols[number - 1];
    return { id: `etteilla_${number}`, name: `Etteilla ${number}`, nameKo: symbol[0], type: 'major', keywords: symbol[1], readingHint: symbol[2] };
  }
  if (number === 78) return { ...TAROT_DECK[0], id: 'etteilla_78', name: 'La Folie', nameKo: '광기', keywords: ['자유', '무모함', '출발'], readingHint: '새로운 시도를 하되 확인 없이 돈을 걸거나 충동적으로 지출하지 마세요.' };
  const suitIndex = Math.floor((number - 22) / 14);
  const position = (number - 22) % 14;
  const rank = position < 4 ? [14, 13, 12, 11][position] : 14 - position;
  const prefix = ['wands', 'cups', 'swords', 'pent'][suitIndex];
  const original = TAROT_DECK.find(c => c.id === `${prefix}_${rank}`)!;
  const hint = [
    '아이디어를 수입으로 연결할 작은 실험을 정하고 시간과 비용의 상한을 지키세요.',
    '관계와 감정에 따른 소비를 돌아보고 서로 편안한 금전 경계를 세우세요.',
    '계약·수수료·기한을 문서로 확인하고 불명확한 조건을 먼저 질문하세요.',
    '현금 흐름과 저축·생활비를 기록하고 유지할 수 있는 관리 습관을 정하세요.',
  ][suitIndex];
  return { ...original, id: `etteilla_${number}`, name: `Etteilla ${number} · ${original.name}`, readingHint: `${original.keywords.slice(0, 2).join('·')}의 관점에서 ${hint}` };
}

function makeDeck(deckId: NonNullable<TarotCard['deckId']>): TarotCard[] {
  return assets.filter(a => a.mode === deckId).map(asset => {
    const number = Number(asset.id.split('_')[1]);
    const original = deckId.startsWith('money') ? etteillaBase(number) : TAROT_DECK.find(c => c.id === asset.id);
    if (!original) throw new Error(`Unknown historical card ${asset.id}`);
    return {
      ...original, deckId, imageUrl: asset.imageUrl, sourceUrl: asset.sourceUrl,
      historicalTitle: ('label' in asset ? `${asset.label} · ` : '') + asset.title.replace(/^File:/, ''),
    };
  });
}

export const ORACLE_DECKS = {
  healing: { name: '라이더–웨이트–스미스 1909', edition: 'Roses & Lilies 원본 · 78장 풀덱', cards: makeDeck('healing'), reason: '감정과 관계를 표현한 장면을 통해 마음을 돌아보는 힐링', source: 'https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)' },
  miracle: { name: '자크 비에빌', edition: '약 1650년 · 78장 풀덱', cards: makeDeck('miracle_vieville'), reason: '삶의 다양한 장면과 고전 상징을 통해 내면을 성찰하고 평화로 관점을 바꾸는 리딩', source: 'https://commons.wikimedia.org/wiki/Category:Vi%C3%A9ville_tarot' },
  growth: { name: '장 도달 마르세유', edition: '약 1701년 · 78장 풀덱', cards: makeDeck('growth'), reason: '메이저의 선택·의지와 네 수트의 현실 과제를 오늘의 실행으로 연결하는 리딩', source: 'https://commons.wikimedia.org/wiki/Category:Tarot_de_Marseille_-_Jean_Dodal' },
  money: { name: '그랑 에테이야 I', edition: '그리모 원화를 그림 카드로 재단 · 78장', cards: makeDeck('money_grimaud'), reason: '고전 점술의 78가지 상징을 풍요의 관점과 현실적인 금전 습관으로 읽는 머니룰', source: 'https://commons.wikimedia.org/wiki/Category:Jeu_de_tarot_divinatoire_dit_%22Grand_Etteilla%22_ou_%22tarot_%C3%A9gyptien%22_-_jeu_de_cartes,_estampe_-_btv1b10543181f' },
};

export const LEGACY_ORACLE_DECKS = {
  miracle: { name: '오스왈드 비르트 1889', edition: '이전 리딩 · 메이저 22장', cards: makeDeck('miracle'), reason: '이전에 저장된 비르트 원본 리딩', source: 'https://commons.wikimedia.org/wiki/Category:Oswald_Wirth_tarot_deck' },
  money: { name: '그랑 에테이야 I', edition: '이전 H. Pussey 주요 카드 21장', cards: makeDeck('money'), reason: '이전에 저장된 에테이야 선택 덱 리딩', source: 'https://commons.wikimedia.org/wiki/Category:Etteilla_I_tarot_deck' },
};

export function getOracleReadingDeck(mode: OracleDeckMode, cards?: readonly TarotCard[]) {
  if (cards?.length) {
    if (!cards[0].deckId) return { ...ORACLE_DECKS.healing, name: '기존 웨이트', cards: TAROT_DECK };
    if (cards[0].deckId === 'miracle') return LEGACY_ORACLE_DECKS.miracle;
    if (cards[0].deckId === 'money') return LEGACY_ORACLE_DECKS.money;
  }
  return ORACLE_DECKS[mode];
}

export function oracleDeckPrompt(mode: OracleDeckMode, cards?: readonly TarotCard[]): string {
  const d = getOracleReadingDeck(mode, cards);
  return `[사용 덱] ${d.name}, ${d.edition}, ${d.cards.length}장. ${d.reason}. 이 덱은 상담 모드에 맞춰 현대적으로 해석한 것으로 원래부터 해당 모드 전용으로 제작된 덱이 아니다. 그림을 본 것처럼 도상을 지어내지 말고 카드명과 제공된 상징을 중심으로 해석한다. 덱마다 인쇄 순서가 다르며 내부 카드 ID는 의미 기준으로 매핑되어 있다. 비에빌은 정의 VII, 전차 VIII, 힘 IX, 은둔자 XI이다. 오늘의 별도 데일리 카드와 이번 오라클 덱을 혼동하지 않는다.`;
}
