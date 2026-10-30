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

function makeDeck(mode: OracleDeckMode): TarotCard[] {
  return assets.filter(a => a.mode === mode).map(asset => {
    const number = Number(asset.id.split('_')[1]);
    const symbol = mode === 'money' ? moneySymbols[number - 1] : null;
    const original = mode === 'money' ? null : TAROT_DECK.find(c => c.id === asset.id);
    if (!symbol && !original) throw new Error(`Unknown historical card ${asset.id}`);
    return {
      ...(original || { id: asset.id, name: asset.title.replace(/^File:\d+ /, '').split(' - ')[0], nameKo: symbol![0], type: 'major' as const, keywords: symbol![1] }),
      deckId: mode, imageUrl: asset.imageUrl, sourceUrl: asset.sourceUrl,
      historicalTitle: asset.title.replace(/^File:/, ''),
      ...(symbol ? { readingHint: symbol[2] } : {}),
    };
  });
}

export const ORACLE_DECKS = {
  healing: { name: '라이더–웨이트–스미스 1909', edition: 'Roses & Lilies 원본', cards: makeDeck('healing'), reason: '감정과 관계를 표현한 장면을 통해 마음을 돌아보는 힐링', source: 'https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck_(Roses_%26_Lilies)' },
  miracle: { name: '오스왈드 비르트 1889', edition: '메이저 아르카나 22장', cards: makeDeck('miracle'), reason: '상징을 통해 내면을 성찰하고 두려움에서 평화로 관점을 바꾸는 리딩', source: 'https://commons.wikimedia.org/wiki/Category:Oswald_Wirth_tarot_deck' },
  growth: { name: '장 도달 마르세유', edition: '약 1701년 · 메이저 22장', cards: makeDeck('growth'), reason: '선택·의지·균형·변화의 원형을 오늘의 실행으로 연결하는 리딩', source: 'https://commons.wikimedia.org/wiki/Category:Tarot_de_Marseille_-_Jean_Dodal' },
  money: { name: '그랑 에테이야 I', edition: 'H. Pussey 판본 · 주요 카드 21장', cards: makeDeck('money'), reason: '오래된 점술 상징을 풍요의 관점과 현실적인 금전 습관으로 읽는 머니룰', source: 'https://commons.wikimedia.org/wiki/Category:Etteilla_I_tarot_deck' },
};

export function oracleDeckPrompt(mode: OracleDeckMode, cards?: readonly TarotCard[]): string {
  const d = cards?.length && !cards[0].deckId ? ORACLE_DECKS.healing : ORACLE_DECKS[mode];
  return `[사용 덱] ${d.name}, ${d.edition}, ${d.cards.length}장. ${d.reason}. 이 덱은 해당 상담 모드에 맞춰 현대적으로 해석한 것으로 원래부터 해당 모드 전용으로 제작된 덱이 아니다. 그림을 본 것처럼 도상을 지어내지 말고 카드명과 제공된 상징을 중심으로 해석한다. 마르세유·비르트는 정의 VIII / 힘 XI이며 내부 카드 ID는 의미 기준으로 매핑되어 있다. 오늘의 별도 데일리 카드와 이번 오라클 덱을 혼동하지 않는다.`;
}
