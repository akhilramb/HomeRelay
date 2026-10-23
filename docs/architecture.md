# Architecture

React UI → same-origin API / MCP transport → domain rules → revision-checked D1 storage.

## Identity and persistence
Sites supplies the signed-in user ID. Production requests without it receive 401 and the UI offers a top-level sign-in link. Local development falls back to `local-demo` only. Do not self-host behind untrusted identity headers; provide real authentication first.

`memberships` maps a signed-in account to a shared household ID and member ID. In shared mode the actor always comes from this row, never from the demo cookie, request arguments, or model output. In demo mode the user's own seeded household and HTTP-only demo role cookie are used. Switching modes never merges or overwrites those datasets.

`households` stores a JSON aggregate and integer revision. Mutations save with `UPDATE WHERE revision = previous_revision`. Conflicts return 409; no automatic mutation replay. Members, tasks, handoffs, events, and assistant messages commit together.

`invitations` stores SHA-256 hashes of random 128-bit codes, household ID, and expiry. Only the creator can issue or revoke them. A new code replaces any unused code. Joining uses a transactional D1 batch with conditional household update, membership insertion, and invite consumption. One code admits one signed-in account; member count is capped at 12. New members can access shared tasks and history, as disclosed in the invitation UI.

## Assistant
`assistant.mjs` interprets a request using guided rules or an optional configured model. It grounds IDs in the current household, checks candidate eligibility, asks for clarification, and dry-runs the proposed command on a clone. The result is a stored preview, not a mutation. Confirmation looks up that actor's preview, checks its ten-minute lifetime and unused status, and executes domain rules again. The change and confirmed flag commit together. An outage falls back visibly. Model prose never becomes executable code or arbitrary tool names.

External authenticated MCP clients use the same service permissions and persistence. Eleven tool schemas no longer hardcode the demo member IDs; shared members are discovered through the household availability tool.

## Recovery and reminders
The recovery desk derives overdue/due-soon/pending risks from real task data. Metrics count accepted handoffs, completed tasks after handoff, and on-time completions. They do not estimate time savings. Browser notifications run while the app is open after explicit browser permission. Calendar exports are escaped and line-folded ICS snapshots. No background scheduler or email service is implied.

## Scale and constraints
One shared household per account, twelve members per household, 500 tasks. The aggregate model suits a small pilot, not high-volume collaboration. Membership departure/removal and transfer of household ownership are not implemented. Dates are ISO UTC with explicit IST display/input.
