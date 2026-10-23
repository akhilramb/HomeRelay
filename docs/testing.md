# Verification

## Automated checks
`pnpm test` runs domain and upgrade suites against deterministic fixtures and an in-memory SQLite adapter for the D1 operations. Coverage includes task state transitions, stale revisions, unauthorized actors, request withdrawal, edits invalidating requests, retry-safe creation, input validation, household account mapping, invite reuse/expiry/revocation, atomic joins, separate household isolation, assistant clarification/confirmation/expiry, provider failure and invalid IDs, outcome counters, preference validation, and ICS escaping.

Provider tests use mocked responses, not real paid model calls. SQLite tests execute real SQL but do not replace hosted multi-account sign-in testing.

## Browser and production checks
Desktop browser QA exercises natural-language create/confirm, shared-household setup, locked member identity, invitation generation/revocation, demo/shared separation, preferences, and core handoff workflows. `/diagnostics` reads the actual preview database and MCP endpoint. Build/typecheck and deployment status are checked before release.

Browser notifications depend on browser permissions/OS delivery; background push is not implemented. Calendar contents have automated validation. A real second hosted account and a mobile device are unavailable to this test session; those flows are not claimed as fully end-to-end verified.

The optional HTTP harness is for disposable local data only; do not run it against real accounts. Do not infer external MCP protocol conformance from the smaller connection-diagnostics checks.

## Upgrade release evidence (23 October 2026)
- 51 automated cases passed before packaging (original and upgrade suites).
- TypeScript passed.
- Browser verified create preview → confirmation, shared home creation with locked identity, invite generation/revocation, return to independent demo, assistant handoff to named recipient → inbox acceptance → assistant completion → persisted responsibility timeline.
- See `confirmed-flow-preview.jpg` for the actual tested completion history.
- All eight browser connection diagnostics passed: database health, discovery, initialization, tool listing, actual tool invocation, REST/MCP consistency, actor rejection, and foreign-task rejection.
- The calendar export UI responded, but the cloud browser's download event did not return a file before timeout. ICS generation is unit-tested; downloaded-file delivery is not claimed as verified. Browser notification permission was blocked in this QA browser.
