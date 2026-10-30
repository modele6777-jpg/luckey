import { ORACLE_DECKS } from '@/data/oracleDecks';
import { TAROT_DECK, getEffectiveTarotKeywords, type TarotCard } from '@/data/tarotData';

export interface MoneyRuleSession { version: 1; createdAt: number; question: string; cards: TarotCard[] }
export const MONEY_RULE_POSITIONS = ['돈을 바라보는 마음', '풍요가 들어오는 통로', '재물을 지키는 머니룰'];
const majorActions = [
  '새 수입 아이디어를 적고 비용을 들이지 않는 작은 실험부터 시작하세요.',
  '이미 가진 기술 하나를 골라 제공할 서비스와 가격의 초안을 적어 보세요.',
  '조건이 불분명한 제안은 바로 결정하지 말고 계약과 수수료부터 확인하세요.',
  '자신이 만든 가치를 정리하고 적절한 보상을 요청할 기회를 찾아보세요.',
  '고정 지출·생활비·저축의 기준을 나누어 예산을 세워 보세요.',
  '금융 용어 하나를 공식 자료로 배우고 모르는 계약 조건을 확인하세요.',
  '돈을 쓰는 이유가 자신의 가치와 맞는지 살펴보세요.',
  '이번 주 달성 가능한 수입 또는 지출 목표 하나에 집중하세요.',
  '충동구매를 하루 미루고 필요한 소비인지 다시 판단하세요.',
  '최근 한 달 거래 내역을 조용히 돌아보고 반복 지출을 찾아보세요.',
  '수입 변동에 대비해 여유 자금과 지출 우선순위를 점검하세요.',
  '미수금·수수료·정산 내역을 확인하고 공정한 대가의 기준을 세우세요.',
  '답답한 수익 방식을 다른 관점에서 검토하되 조급한 결정을 미루세요.',
  '더 이상 쓰지 않는 구독이나 손해가 반복되는 습관 하나를 정리하세요.',
  '현재 생활과 미래 저축 사이에서 유지 가능한 균형을 정하세요.',
  '과시 소비·과도한 빚·한 번에 만회하려는 선택에서 거리를 두세요.',
  '예상 밖 지출에 대비하고 무리한 차입이나 몰아넣기를 피하세요.',
  '장기 목표를 작게 나누고 지금 지킬 수 있는 저축 습관을 적으세요.',
  '소문과 기대를 사실과 구분하고 수익 보장 문구를 검증하세요.',
  '성과를 구체적으로 기록하고 자신 있게 보상을 협의할 준비를 하세요.',
  '과거 금전 결정을 돌아보고 반복하지 않을 원칙을 하나 정하세요.',
  '완료한 일의 정산을 챙기고 다음 목표를 무리 없이 계획하세요.',
];
const suitActions: Record<string, string> = {
  wands: '아이디어를 실제 제안으로 바꾸되 시간과 비용의 상한을 정하세요.',
  cups: '감정적 소비와 관계의 지출을 구분하고 편안한 금전 경계를 세우세요.',
  swords: '금액·기한·계약 조건을 문서로 확인하고 서두르지 마세요.',
  pentacles: '수입과 지출을 기록하고 유지할 수 있는 저축·관리 습관을 정하세요.',
};
export function isMoneyRuleSession(value: unknown): value is MoneyRuleSession {
  const s = value as MoneyRuleSession | null;
  return Boolean(s && s.version === 1 && Number.isFinite(s.createdAt) && typeof s.question === 'string' && Array.isArray(s.cards) && s.cards.length === 3 && s.cards.every(c => c && [...TAROT_DECK, ...ORACLE_DECKS.money.cards].some(d => d.id === c.id && d.type === c.type && d.nameKo === c.nameKo) && typeof c.reversed === 'boolean') && new Set(s.cards.map(c => c.id)).size === 3);
}
export function moneyRuleReading(card: TarotCard, index: number) {
  const keywords = (card.deckId === 'money' ? card.keywords : getEffectiveTarotKeywords(card)).slice(0, 3).join(' · ');
  const action = card.readingHint || (card.type === 'major' ? majorActions[Number(card.id.split('_')[1])] : suitActions[card.type]);
  const lens = ['돈에 대한 현재의 믿음을 알아차리는 자리입니다.', '내가 가진 가치와 현실의 기회를 연결하는 자리입니다.', '들어온 돈을 지키고 꾸준히 쌓는 기준을 만드는 자리입니다.'][index];
  return `${lens} ${card.nameKo}의 ${keywords} 상징을 살펴보세요. ${card.reversed ? '역방향은 이 주제가 막히거나 지나쳐 있지 않은지 점검하라는 관점으로 읽습니다. ' : ''}${action}`;
}
export function moneyRuleNarration(session: MoneyRuleSession) {
  return `머니룰 타로. ${session.question ? `나의 질문. ${session.question}. ` : ''}${session.cards.map((card, i) => `${MONEY_RULE_POSITIONS[i]}. ${card.nameKo}. ${moneyRuleReading(card, i)}`).join('\n')}\n오늘의 풍요 선언. 나는 내가 만드는 가치를 존중하고, 기회를 살피며, 들어온 돈을 지혜롭게 관리합니다.`;
}
