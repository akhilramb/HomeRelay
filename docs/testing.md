# Validation record — 23 October 2026

## Executed successfully

- 32 automated Node domain/adapter/validation tests (`pnpm test`): task creation/serialization, pending ownership, acceptance once, decline, expiry, duplicate completion, no available member, completion withdrawing requests, foreign task IDs, ambiguous requests, mutation-free suggestions, changed availability, authorization, duplicate invitations, MCP argument schemas, invalid inputs, cancellation history, AI failure leaving state unchanged, read-only model adapter, and stale task versions.
- TypeScript type check (`pnpm typecheck`).
- Production Vinext/Vite build.
- Local browser end-to-end: created “Collect the library books”, requested Priya, verified Akhil still owned it, switched to Priya, accepted, verified ownership transfer, added completion note, completed, and checked the full activity timeline.
- Browser reload: completed task remained saved with the completion note/history.
- Scripted assistant: “I cannot collect the parcel” returned an available-member explanation, tool trace, real task link, and a clearly labelled not-yet-requested suggestion.
- Eight live local browser diagnostics: database health, MCP discovery, 2025-11-25 initialization, eleven tool definitions, actual list_tasks call, REST/MCP record equality, model-supplied actor rejection, foreign-task rejection.

## Verification boundaries

The standalone `test:http` harness could not connect from the shell to the supervised preview network; its HTTP suite is included for a normal local development server but is **not reported as passing here**. The running endpoints were instead exercised through the actual browser and the read-only diagnostics page.

No real AI provider credential, Alexa device, Windows computer, full external MCP SDK conformance suite, or real mobile device was used. Responsive CSS is included; desktop screenshots and interactions were reviewed. Production publication is checked through the Sites deployment result. Do not equate these checks with a guarantee of zero defects.

## Improvement verification

- Added regression coverage for overdue candidate exclusion, owner-only withdrawal, fresh requests after withdrawal, edit-triggered invalidation, invalid edits preserving state, duplicate creation prevention, request-key conflict detection, minimum MCP versions, invalid JSON/envelopes, oversize bodies, actor impersonation, and HTTP browser request-key compatibility.
- Browser-verified: withdraw request → send another request → switch role → accept directly in the incoming inbox.
- Browser-verified: edit pending task details → saved changes → old invitation withdrawn with a visible timeline event.
- Browser-verified: new task creation still works on HTTP preview after fixing the missing browser randomUUID API.
- Automatic refresh pauses while a dialog is open or a mutation is running. Older refresh responses are ignored after a newer action starts. Read operations avoid unnecessary database writes.
