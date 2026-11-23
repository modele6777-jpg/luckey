import { getServiceAccountToken, readServiceAccount } from '../api-lib/googleServiceAccount.js';
import { CONTROL_DOCUMENT, firestoreDocumentUrl, firestoreGet, typedValue } from '../api-lib/lucyKnowledgeFirestore.js';
import { searchKnowledgeMetadata } from '../api-lib/lucyKnowledgeSources.js';
import { runScheduledResearch, SCHEDULED_SOURCE_COLLECTION } from '../api-lib/lucyScheduledResearch.js';

async function main() {
  const account = readServiceAccount(process.env.LUCY_KNOWLEDGE_SCHEDULER_CREDENTIALS);
  if (!account) throw new Error('Missing scheduler credentials');
  const token = await getServiceAccountToken(account, (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(7000) }));
  const result = await runScheduledResearch({
    readSettings: () => firestoreGet(CONTROL_DOCUMENT, token),
    search: searchKnowledgeMetadata,
    async createCandidate(id, candidate) {
      const url = new URL(firestoreDocumentUrl(SCHEDULED_SOURCE_COLLECTION));
      url.searchParams.set('documentId', id);
      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: Object.fromEntries(Object.entries(candidate).map(([key, value]) => [key, typedValue(value)])) }),
        signal: AbortSignal.timeout(7000),
      });
      if (response.status === 409 && (await response.json())?.error?.status === 'ALREADY_EXISTS') return false;
      if (!response.ok) throw new Error('Candidate storage failed');
      return true;
    },
  });
  console.log(result.enabled ? `Scheduled knowledge research: ${result.added} new candidates.` : 'Scheduled knowledge research is off.');
}

main().catch(() => {
  console.error('Scheduled knowledge research failed. Check worker credentials, Firestore access and Crossref availability.');
  process.exitCode = 1;
});
