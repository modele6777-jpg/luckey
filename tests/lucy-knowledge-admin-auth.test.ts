import assert from 'node:assert/strict';
import test from 'node:test';
import type { User } from 'firebase/auth';
import { hasLucyKnowledgeAdminClaim } from '../src/lib/lucyKnowledgeAdminAuth.ts';

type TokenResult = Awaited<ReturnType<User['getIdTokenResult']>>;
function userWithClaims(claims: Record<string, unknown>, refreshCalls: boolean[] = []): Pick<User, 'getIdTokenResult'> {
  return {
    getIdTokenResult: async (forceRefresh?: boolean) => {
      refreshCalls.push(forceRefresh === true);
      return { claims } as unknown as TokenResult;
    },
  };
}

test('forces an ID-token refresh before accepting the latest knowledgeAdmin claim', async () => {
  const refreshCalls: boolean[] = [];
  const user: Pick<User, 'getIdTokenResult'> = {
    getIdTokenResult: async (forceRefresh?: boolean) => {
      refreshCalls.push(forceRefresh === true);
      return { claims: forceRefresh ? { knowledgeAdmin: true } : {} } as unknown as TokenResult;
    },
  };

  assert.equal(await hasLucyKnowledgeAdminClaim(user), true);
  assert.deepEqual(refreshCalls, [true]);
});

test('accepts only the literal boolean true admin claim', async () => {
  for (const claim of [false, 'true', 1, null, undefined]) {
    assert.equal(await hasLucyKnowledgeAdminClaim(userWithClaims({ knowledgeAdmin: claim })), false);
  }
});
