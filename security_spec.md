# Security Specification for Lucy Universe

## Data Invariants
- Users can only access documents where the `{userId}` path variable matches their `request.auth.uid`.
- All `createdAt` and `updatedAt` fields must be set to `request.time`.
- History entries are immutable once created (only create/read/delete, or restricted update).
- `sharedState` is restricted to the owner for both read and write.

## The Dirty Dozen Payloads (Expected to be DENIED)

1. **Identity Spoofing**: Attempt to write to `/sharedState/victimUID` as `attackerUID`.
2. **Resource Exhaustion**: Create a history entry with a `content` string > 50,000 characters.
3. **Temporal Integrity (Create)**: Create a history entry with `createdAt: timestamp.date(2030, 1, 1)`.
4. **ID Poisoning**: Attempt to create a document with ID `../../passwords/vuln`.
5. **Privilege Escalation**: Non-admin user attempting to delete another user's profile.
6. **Shadow Update**: Adding `isPremium: true` to a history entry update.
7. **Query Scraping**: Attempting a collection group query or list on `/bluebird_history/` without a `where` clause matching UID.
8. **Schema Violation**: Writing a history entry where `createdAt` is a string instead of a timestamp.
9. **Temporal Integrity (Update)**: Updating `sharedState` with a manual client-side timestamp.
10. **Auth Bypass**: Reading `/sharedState/someUser` while unauthenticated.
11. **ID Size Attack**: Document ID with 10,000 characters.
12. **Immutable Field Attack**: Attempting to change `email` in a `sharedState` document after creation.

## Test Runner (firestore.rules.test.ts)
```typescript
// To be implemented in Phase 4
```
