# HomeRelay — submission draft

## Inspiration

A shared responsibility can become nobody's responsibility when the original person becomes unavailable. We wanted to make “someone should do it” become an explicit, accepted handoff.

## What it does

HomeRelay organizes household tasks and helps recover from changed plans. It suggests available members, explains its ranking, sends an explicit request, waits for acceptance, and records member-confirmed completion in a responsibility timeline. The original owner remains responsible until the replacement accepts.

## How it was built

React/TypeScript frontend, Vinext/Vite server routes, Cloudflare Worker runtime, and persistent D1 SQLite storage. A shared service enforces business rules for the web API and eleven callable MCP tools. Atomic revision-checked household updates prevent conflicting writes. A scripted assistant reads real task data; an optional model adapter can summarize checked results.

## Demonstration

Independent simulated Alexa+ experience. No official Amazon relationship, Alexa hardware connection, or real external notifications are claimed. The repository includes the simulation source and setup instructions.

## Challenges

The requested FastAPI backend could not run on the chosen Sites Worker host, so this edition uses a TypeScript backend with D1. Preserving the difference between proposal, request, acceptance, and completion shaped both the server and interface. Direct MCP discovery/initialization and tool calls were exercised in local browser diagnostics; complete external-client conformance remains future validation.

## What we learned

Reliable status transitions matter more than a persuasive chatbot response. Candidate suggestions should explain known availability and workload without inventing facts. A visible “waiting for acceptance” state communicates an unresolved handoff clearly.

## Next steps

Real household invitations, member authentication, external notifications, broader language understanding, and additional MCP client validation.

## Submission checklist for Akhil

- Supply the GitHub repository URL.
- Record and upload your public demo video (under three minutes).
- Ensure judges can run the local app or access an appropriately shared hosted version.
- Select the simulated Alexa+ track path and describe implemented features honestly.
- Add your actual product feedback and tool onboarding experience; do not invent feedback.
- Complete the Devpost fields and press Submit yourself.

Official rules checked on 23 October 2026: https://amazonappdev2026.devpost.com/rules . The rules explicitly allow a simulated Alexa+ experience using any AI/agentic tool, and require its source and functioning demo. No submission has been made by this build workflow.
