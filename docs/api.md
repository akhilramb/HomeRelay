# Web API

`GET /api/relay` reads the current visitor's complete demo snapshot. `POST /api/relay` accepts JSON `{ "command": "...", "args": {...} }` and returns `{ "result": ... }`. Errors return `{ "error": "helpful message" }` with HTTP 400, 401, 403, 404, 409, 502, or 503 as appropriate. Responses are not cached.

| Command | Important arguments |
| --- | --- |
| create_task | title, description, owner, category, priority, due (UTC ISO) |
| get_task / get_task_history / suggest_handoff_candidates | taskId |
| list_tasks / get_household_availability | none |
| update_task | taskId, version, title, description, category, priority, due |
| request_handoff | taskId, version, memberId, optional reason |
| respond_to_handoff | taskId, version, handoffId, response: accepted or declined |
| complete_task | taskId, version, optional note |
| cancel_task | taskId, version |
| set_availability | memberId, windows: [{start,end}] (UTC ISO); empty means unavailable |
| switch_member | memberId; sets an HTTP-only demo-role cookie |
| assistant | message (maximum 2000 characters) |
| reset | confirm: true |

State mutations use backend membership/ownership checks and an optimistic household revision update. For task mutations, use the latest task `version` from the snapshot. On 409, refresh before retrying. The same-origin browser API does not enable CORS.

`GET /api/health` checks the DB binding with SELECT 1 and returns status/database connection state; it does not expose records.
