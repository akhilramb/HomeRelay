# HomeRelay — submission draft

## Tagline
When plans change, responsibility does not disappear.

## Inspiration
A reminder can say a parcel is due, but it cannot establish who has actually agreed to collect it. Household work often gets lost between a suggestion and an accepted commitment. HomeRelay closes that gap.

## What it does
HomeRelay coordinates tasks through explicit request, acceptance, and member-confirmed completion. A recovery desk highlights deadlines and unresolved handoffs. The assistant prepares reviewable actions; users confirm them, and the original owner stays responsible until a replacement accepts. Separate signed-in household members join with expiring one-use codes. A private practice space supports a complete demo without impersonating real members. Outcome counters, a responsibility timeline, browser alerts while open, and calendar exports make follow-through visible.

## How it was built
React/TypeScript frontend, Vinext/Vite server routes, Cloudflare Worker runtime, and D1 SQLite. The web API and eleven MCP tools share business rules. Atomic revision checks prevent conflicting updates. Membership rows bind accounts to shared members; invite hashes are consumed in a transactional batch. Assistant previews expire, are scoped to their actor, and revalidate permissions/state at confirmation. Guided intent rules run without model credentials; an optional model adapter translates language into constrained proposals.

## Track and demonstration
Alexa+ simulated-experience path. Independent simulation, not an official Alexa add-on or device integration. The in-app assistant currently runs guided rules; live model-provider access has not been configured. An authenticated connected MCP client can invoke the same household tools. The repository contains the simulation source, migrations, tests, and setup instructions.

## Challenges and learning
The original FastAPI proposal was adapted to a Worker-compatible TypeScript backend for hosting. The hardest problem was preserving the difference between a suggestion, a request, acceptance, and completion while task details or availability can change. Safety is enforced in the server, not trusted to generated prose.

## What is next
Live provider evaluation, hosted two-account user testing, member departure/removal, background push, and more complete external MCP conformance testing. No measured adoption or time savings are claimed.

## Product feedback — personalize before submitting
Use only your actual experience. Explain each tool's purpose, onboarding, what worked, a specific failure/workaround, and whether you would use it again. Useful observations to verify and describe in your own words: Worker deployment required adapting the backend; browser QA caught HTTP crypto compatibility; migrations needed safe handling for existing databases; direct MCP invocation and shared business rules simplified validation. Do not claim you used unavailable Amazon preview tooling, AWS services, or a live model provider.

## Submission checklist
- Repository: https://github.com/akhilramb/HomeRelay
- Hosted app: https://homerelay-akhil.bussaakhilram.chatgpt.site
- Add public English demo video under three minutes (YouTube/Vimeo).
- Add personal developer-tool feedback and team details.
- Select Alexa+ and disclose the simulated-experience path.
- Test judge access; sign-in is required for household operations.
- Review all required fields and submit on Devpost yourself.

Official rules: https://amazonappdev2026.devpost.com/rules . No submission has been made automatically.
