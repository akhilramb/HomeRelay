# Known limitations

- Fictional demo members and manually entered availability; no real family invitations or secure member-level login.
- Private hosted access; each authenticated visitor has a separate seeded household. The app does not synchronize one shared household across different visitor accounts.
- Default assistant uses scripted intent matching. Optional AI only summarizes grounded results; live credentials have not been exercised.
- No external calendars, messaging, Alexa devices, voice, payments, uploads, or independent completion verification.
- Stateless direct MCP JSON-RPC handler, not the requested maintained MCP SDK. No comprehensive external-client conformance validation yet.
- One JSON aggregate per household, maximum 500 tasks. Appropriate for a small demonstration, not a high-volume production architecture.
- Expiry is derived/recorded on access; no background alert scheduler.
- Declined members remain excluded for that task. Update another member's availability or keep the original owner if nobody qualifies.
- Optimistic conflicts return 409 and require a refresh. No hidden retry of mutations.
- Local Windows setup is documented but has not been executed on Windows in this Linux environment.
- Responsive styles are implemented. Desktop browser workflows were exercised; a real mobile-device session was not available.
- No application can be guaranteed entirely glitch-free. Verification performed is recorded in testing.md.
