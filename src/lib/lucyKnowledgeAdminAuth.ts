import type { User } from 'firebase/auth';

/** Refresh the Firebase ID token before relying on the custom admin claim. */
export async function hasLucyKnowledgeAdminClaim(user: Pick<User, 'getIdTokenResult'>): Promise<boolean> {
  const token = await user.getIdTokenResult(true);
  return token.claims.knowledgeAdmin === true;
}
