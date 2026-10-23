# Architecture

React UI → same-origin API / MCP transport → shared domain service → revision-checked D1 persistence.

`service.mjs` owns all task transitions, candidate eligibility, and events. It is independent of UI and storage. REST and MCP both call `dispatch` in `store.ts`; neither writes arbitrary task state. The model only summarizes checked read results. Mutations require explicit UI actions or an authorized MCP tool call.

D1 stores one JSON household aggregate per Sites-authenticated user ID, with an integer revision. Initial creation uses INSERT OR IGNORE. Each mutation loads a snapshot and commits all changes with UPDATE WHERE revision = previous_revision. A conflicting request returns 409; no partial task/handoff/event changes are stored. Domain validation is completed before persistence. Reads derive overdue state; request expiry is recorded when the household is read or operated on. No cron or outbound notification service is implied.

The aggregate contains members, preferences, availability windows, tasks, handoffs, events, and messages. Timestamps are ISO UTC; display/input explicitly uses Asia/Kolkata. Demo data is seeded relative to first use, and reset generates new deadlines.

Hosted isolation uses the stable `oai-authenticated-user-id` header supplied by Sites. Local dev uses `local-demo` if that header is absent. Never trust arbitrary identity headers when self-hosting; place a real authentication layer in front of this worker. The HTTP-only demo-member cookie selects a fictional role inside that visitor's household. MCP never accepts model-provided actor IDs.

This implementation adapts the original Python proposal to TypeScript Workers to make the app fully hostable here. UI styles remain separate from domain rules so a later redesign can preserve behavior.
