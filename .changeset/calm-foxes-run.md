---
"@itwin/access-control-client": patch
---

Republish of the 4.4.2 ESM fix

4.4.2 was never published to npm because the release workflow failed on Node 20.12.1. This release ships the same fix: the ESM entry point now loads in native Node.js. Fixes #81.