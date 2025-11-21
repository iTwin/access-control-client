---
"@itwin/access-control-client": major
---

\## 🚨 BREAKING CHANGES

Complete redesign with enhanced functionality. See `MIGRATION-GUIDE-v3-to-v4.md` for migration instructions.

\### API Changes

\- \*\*Response Type\*\*: `AccessControlAPIResponse<T>` → `BentleyAPIResponse<T>`

\- \*\*Error Type\*\*: `Error` → `ApimError` (avoids JS built-in conflict)

\- \*\*Method Names\*\*: Removed 'Async' suffix (e.g., `getITwinRolesAsync` → `getITwinRoles`)

\- \*\*Type System\*\*: All enums → string union types for better tree shaking

\- \*\*Response Structure\*\*: Direct arrays/objects → wrapped responses with HAL links

\- \*\*Query Parameters\*\*: `AccessControlQueryArg` → `ODataQueryParams`

\## ✨ NEW FEATURES

\### iTwin Shares Client

\- `createITwinShare()`, `getITwinShares()`, `getITwinShare()`, `updateITwinShare()`, `deleteITwinShare()`

\### Group Member Invitations Client

\- `queryITwinGroupMemberInvitations()`, `deleteITwinGroupMemberInvitation()`

\### Enhanced Type Safety

\- Conditional types: `getITwinJob<T extends ResultMode>()` automatically infers return type

\- `"minimal"` mode: Returns `Omit<ITwinJob, "error">`

\- `"representation"` mode: Returns full `ITwinJob`

\- Zero type casting required

\### HAL Compliance

All collections include `\_links` for navigation (`self`, `next`, `prev`)

\## 🔧 TECHNICAL IMPROVEMENTS

\- \*\*String Unions\*\*: Zero runtime overhead, better tree shaking, JSON compatibility

\- \*\*Conditional Types\*\*: Type-safe result modes

\- \*\*Response Wrappers\*\*: Self-documenting structures

\- \*\*File Structure\*\*: Reorganized types into `src/types/`

\- \*\*Performance\*\*: Smaller bundles, native fetch API, type elimination

\## 📝 MIGRATION

\*\*Key Steps:\*\*

1\. `AccessControlAPIResponse` → `BentleyAPIResponse`

2\. `Error` → `ApimError`

3\. Remove 'Async' suffix from methods

4\. Update response access: `response.data.userMembers`

5\. Convert enums to string unions

6\. Use `import type` for types

\*\*Benefits:\*\*

\- Smaller bundles via tree-shaking

\- Better type safety with conditional types

\- Enhanced developer experience

\- Modern patterns (string unions, HAL, OData)

See \[`MIGRATION-GUIDE-v3-to-v4.md`](MIGRATION-GUIDE-v3-to-v4.md) for complete examples.

\## 🎯 TESTING \& DEPLOYMENT

\- All integration tests updated for new patterns

\- \*\*Major version release\*\* (v4.0.0) - not backward compatible

\- Migration guide required for v3.x users

\## Addresses issues :

\- #38

\- #9
