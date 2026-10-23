# Verified scope and remaining limits

- Real shared membership, single-use invitations, and separate practice mode are implemented. Two-account membership, invitation consumption, expiry, and isolation are tested against SQLite; a real second hosted account has not been used for end-to-end onboarding validation.
- Guided rules are the in-app default. Optional model intent planning is implemented and failure/invalid-output behavior is tested with fixtures. No real provider credential is configured, so no live in-app LLM quality claim is made.
- The existing connected MCP plugin supports model-client access to real tools. Full external-client protocol conformance is not yet established; the server remains a small direct handler.
- Availability/preferences are manually entered. Browser alerts require permission and an open tab. Calendar export is a snapshot; no background push, automatic calendar sync, email, SMS, voice device, or purchasing integration.
- Shared households support up to 12 members, one shared household per account, and 500 tasks. Leaving, removing members, and transferring household ownership require a future account-management flow.
- Completion is a member statement, not independent evidence. Outcome counters use actual recorded events and do not claim time saved.
- The task/household aggregate uses optimistic concurrency. 409 conflicts ask users to refresh; writes are not silently retried.
- Declined members remain excluded for that task. Deadline edits invalidate pending requests.
- Local Windows instructions have not been executed on Windows in this Linux environment. A real mobile-device session and browser push delivery have not been validated.
