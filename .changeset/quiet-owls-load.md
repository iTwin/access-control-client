---
"@itwin/access-control-client": patch
---

Fix ESM entry point failing to load in Node.js with ERR_MODULE_NOT_FOUND

Relative imports in the ESM build now include `.js` extensions, and `lib/esm` ships a `package.json` with `"type": "module"`, so `import { AccessControlClient } from "@itwin/access-control-client"` works in native Node.js ESM. CommonJS and bundler consumers are unaffected. Fixes #81.
