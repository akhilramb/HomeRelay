# HomeRelay

**A little help, right on time.** A household task coordinator for the moment an everyday plan falls through.

Create a responsibility, find an available replacement, explicitly request help, wait for acceptance, and record completion. A request never silently changes the owner.

Independent simulated Alexa+ experience for the Amazon Build, Ship, Shape hackathon. No Amazon affiliation or Alexa device connection is claimed.

![HomeRelay dashboard](docs/dashboard-preview.jpg)

## What works

- Persistent task creation, editing, cancellation, and member-confirmed completion.
- Candidate ranking from entered availability, category preference, open workload, and previous declines.
- Explicit request → accept/decline → completion with a responsibility timeline.
- Server checks for permissions, expiry, stale versions, duplicate completion, and changed availability.
- Dashboard, searchable task list/board, filters, assistant, household availability, activity, theme settings, and confirmed demo reset.
- Three labelled demo roles: Akhil, Priya, Ravi.
- Ten MCP tools using the same business logic as the web API.
- Callable connection diagnostics at `/diagnostics`.
- Stored assistant conversations and real task links. Scripted intent handling works without a paid model.

## Implementation choice

The original brief suggested FastAPI/SQLite and React/Vite. This deployable edition uses **React 19, TypeScript, Vinext/Vite, a Cloudflare Worker backend, and persistent D1 (SQLite)** because Sites hosts Workers rather than Python servers. There is one deployable app and one shared business layer; no dummy Python server is included.

For this small demo, each signed-in visitor owns an isolated fictional household stored as a versioned JSON aggregate in D1. A compare-and-swap update commits all task, handoff, and activity changes together. This is intentionally simple; it is not a normalized multi-household production schema.

## Windows PowerShell setup

Install Node.js 22.13 or later and Git first. From a new terminal:

```powershell
git clone https://github.com/akhilramb/HomeRelay.git
cd HomeRelay
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm build
corepack pnpm db:migrate
corepack pnpm dev
```

Open the local URL printed by the dev command (normally `http://localhost:5173`). Local development uses the fictional household without paid services. Apply `db:migrate` **once on a new local database**. Keep `.wrangler/state` to preserve the database across restarts. If the initial schema already exists, skip `db:migrate`.

If Corepack is unavailable, install pnpm from its official distribution, then replace `corepack pnpm` with `pnpm` in these commands. The pinned package manager version is in `package.json`.

The retained starter automatically selects the portable profile outside the managed Sites environment. All required scripts are included. The same app serves the frontend, API, and MCP endpoint; there are no separate Python or frontend terminals.

## Tests

```powershell
corepack pnpm test
corepack pnpm typecheck
corepack pnpm build
```

With your local development server running, optional HTTP integration tests use a disposable local test household. **Run only locally**, not against real hosted accounts:

```powershell
$env:TEST_ORIGIN = "http://localhost:5173"
corepack pnpm test:http
```

Open `/diagnostics` and click **Run connection checks** for database health, MCP discovery, initialization, tool invocation, and validation checks. See [actual validation results](docs/testing.md).

## Demo in 90 seconds

1. View as Akhil and open **Collect the parcel**.
2. Click **Find a helping hand**. Review Priya’s availability/workload explanation.
3. Click **Request help from Priya**. The owner stays Akhil.
4. Close details and switch the demo role to Priya.
5. Open the task; click **Accept handoff**. Ownership changes to Priya.
6. Add a completion note and click **Mark completed**.
7. Show the responsibility timeline. Reload and confirm the saved result.

Alternatively, start in Assistant with “I cannot collect the parcel”; open the returned task card to review and send the handoff.

## Optional AI

Default: **Demo assistant — scripted intent handling**. It reads real server data and proposes actions; explicit buttons execute mutations.

Optional: configure server-only `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL` using an OpenAI-compatible chat-completions endpoint. See `.env.example` and `.dev.vars.example`. Hosted secrets must be set through hosting configuration and applied with a deployment. The optional model rewrites checked tool results into a short summary; it does not choose arbitrary tools or perform mutations. Provider failures leave household data unchanged. Live provider access was not tested with a real credential.

## MCP

Endpoint: `POST /mcp`. Supports stateless JSON-RPC discovery, initialization for 2025-11-25 and 2026-07-28, tool listing, tool calls, ping, and notifications. The Sites integration also discovers tools with `server/discover`.

Tools: `list_tasks`, `get_task`, `create_task`, `update_task`, `get_household_availability`, `suggest_handoff_candidates`, `request_handoff`, `respond_to_handoff`, `complete_task`, `get_task_history`.

The server uses a small direct protocol handler rather than an MCP SDK. Discovery, initialization, and actual tool execution were tested; a full external-client conformance suite has not been run. See [MCP details](docs/mcp.md).

## Source map

| Feature | Files |
| --- | --- |
| App screens and navigation | `app/page.tsx` |
| Editable task form | `app/components/TaskForm.tsx` |
| Original vector illustration | `app/components/HouseArt.tsx` |
| Design tokens and responsive styles | `app/globals.css` |
| Client API and IST dates | `lib/homerelay/client.ts` |
| Domain types | `lib/homerelay/types.ts` |
| State transitions and candidate rules | `lib/homerelay/service.mjs` |
| D1 persistence, identity, atomic updates | `lib/homerelay/store.ts` |
| Optional AI adapter | `lib/homerelay/ai.mjs` |
| Web API | `app/api/relay/route.ts` |
| MCP schemas and transport | `lib/homerelay/tools.mjs`, `app/mcp/route.ts` |
| Database schema and migration | `db/schema.ts`, `drizzle/` |
| Health and connection tests | `app/api/health/route.ts`, `app/diagnostics/page.tsx` |
| Automated tests | `tests/` |

## Honest boundaries

Demo member switching is role simulation, not production authentication between family members. Hosted identity isolates visitor data through Sites sign-in. No SMS, email, calendar, voice, file uploads, purchasing, or IoT devices are connected. Completion is a member confirmation, not independent evidence. No performance or impact statistics are invented. The hosted site starts private; judges need appropriate access or a local run and demo video.

See [architecture](docs/architecture.md), [API](docs/api.md), [limitations](docs/limitations.md), [demo script](docs/demo-script.md), and [submission draft](docs/hackathon-submission.md).

## License

HomeRelay-authored code is MIT licensed. Retained starter and vendored package licenses remain applicable; see `vendor/` and notices in `scripts/vite/`.
