---
"@itwin/access-control-client": major
---

Complete API redesign with enhanced TypeScript support and new functionality.

BREAKING CHANGES:

- Renamed AccessControlAPIResponse<T> to BentleyAPIResponse<T>
- Renamed Error to ApimError (avoids JS built-in conflict)
- Removed 'Async' suffix from all method names (e.g., getITwinRolesAsync → getITwinRoles)
- Converted all enums to string union types for better tree shaking
- Response structure changed: Direct arrays/objects → wrapped responses with HAL links
- Query parameters: AccessControlQueryArg → ODataQueryParams with OData v4 support

NEW FEATURES:

- iTwin Shares client with complete CRUD operations
- Group Member Invitations client for invitation management
- Enhanced type safety with conditional types for result modes
- HAL specification compliance with _links navigation
- Advanced mapped types for handling missing users in member responses

TECHNICAL IMPROVEMENTS:

- String unions over enums (zero runtime overhead, better tree shaking)
- Conditional types for type-safe result modes
- Self-documenting response wrappers with descriptive property names
- Reorganized type system into dedicated files under src/types/
- Enhanced error handling with proper null/undefined type safety

See MIGRATION-GUIDE-v3-to-v4.md for complete migration instructions.
