# Web API

`GET /api/relay` reads the current visitor's complete demo snapshot. `POST /api/relay` accepts JSON `{ "command": "...", "args": {...} }` and returns `{ "result": ... }`. Errors return `{ "error": "helpful message" }` with HTTP 400, 401, 403, 404, 409, 502, or 503 as appropriate. Responses are not cached.

| Command | Important arguments |
| --- | --- |
| create_task | optional requestId for retry safety; title, description, owner, category, priority, due (UTC ISO) |
| get_task / get_task_history / suggest_handoff_candidates | taskId |
| list_tasks / get_household_availability | none |
| update_task | taskId, version, title, description, category, priority, due |
| request_handoff | taskId, version, memberId, optional reason |
| withdraw_handoff | taskId, version, handoffId |
| respond_to_handoff | taskId, version, handoffId, response: accepted or declined |
| complete_task | taskId, version, optional note |
| cancel_task | taskId, version |
| set_availability | memberId, windows: [{start,end}] (UTC ISO); empty means unavailable |
| switch_member | memberId; sets an HTTP-only demo-role cookie |
| assistant | message (maximum 2000 characters) |
| reset | confirm: true |

State mutations use backend membership/ownership checks and an optimistic household revision update. For task mutations, use the latest task `version` from the snapshot. On 409, refresh before retrying. The same-origin browser API does not enable CORS.

`GET /api/health` checks the DB binding with SELECT 1 and returns status/database connection state; it does not expose records.

A creation request ID is scoped to its creator. Repeating the identical create payload with that ID returns the existing task without another creation event. Reusing it with different details returns 409. Invalid envelopes and JSON produce 400 errors; bodies over 20 KB return 413. An edited task withdraws any pending invitation so a fresh request can be reviewed.

## Shared households and assistant actions
All routes require the signed-in Sites identity in production. `create_household {name,displayName}` creates one shared home; `join_household {code,displayName}` consumes an unexpired one-use code. `invite_member {}` and `revoke_invite {}` require the household creator. `switch_space {mode:"demo"|"shared"}` selects an existing space with an HTTP-only cookie. Shared actors always come from membership rows; `switch_member` is rejected in shared mode.

`assistant {message,taskId?}` returns a grounded read result or action preview. An ambiguous task can be selected by resending the message with its task ID. `confirm_assistant {messageId}` executes the stored preview after revalidation. `dismiss_assistant {messageId}` dismisses it. Callers cannot provide an arbitrary command to confirmation. Previews expire after ten minutes and execute once.

`set_preferences {preferences:string[]}` edits only the active member's preferences. `snapshot` adds `mode`, `hasHousehold`, `ownerId` for shared homes, and derived `insights`.
