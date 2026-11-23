import type { GovernedKnowledgeCard } from './governance';
import { isConsultationEligibleCard } from './governance';

let approvedCards: GovernedKnowledgeCard[] = [];
export function setApprovedKnowledgeSnapshot(values: readonly unknown[]): void {
  approvedCards = values.filter(isConsultationEligibleCard).slice(0, 500);
}
export function getApprovedKnowledgeSnapshot(): readonly GovernedKnowledgeCard[] {
  return approvedCards;
}
export function clearApprovedKnowledgeSnapshot(): void {
  approvedCards = [];
}
