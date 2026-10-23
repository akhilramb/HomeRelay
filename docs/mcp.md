# MCP transport

`POST /mcp` uses the same identity, active demo role, and services as the browser API. Headers and authentication are provided by Sites. No arbitrary actor or household ID can be supplied in tool arguments.

JSON-RPC example:

```json
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_tasks","arguments":{}}}
```

Results contain a JSON-serialized result in a text content block and `isError`. Tool errors return `isError: true` without reporting success. Read `tools/list` for the ten input schemas. Suggestion tools do not create handoff requests. Mutation tools require a current task version, and the invited role must respond to acceptance.

Supported methods: `server/discover`, `initialize`, `notifications/*`, `ping`, `tools/list`, `tools/call`. Supported initialization versions: 2025-11-25 and 2026-07-28. Transport is stateless HTTP JSON responses; no SSE subscription is offered. GET returns 405. This is a direct handler, not an SDK implementation or a claim of complete protocol conformance.

For the hosted personal plugin, Sites provides an authenticated caller and makes tools discoverable upon publication. Calls without a browser role cookie use Akhil. For independent external deployment, replace trusted-proxy identity with real OAuth/session verification and add rate limits, origin configuration, monitoring, and production membership management. Never expose a backend that accepts arbitrary identity headers from the internet.

Actual local browser diagnostics verified discovery, 2025-11-25 initialization, all ten tool definitions, live list_tasks invocation, REST/MCP record equality, actor-argument rejection, and unknown-task rejection. Full Alexa hardware integration and external SDK conformance were not tested.
