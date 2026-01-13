# Change Log - @itwin/access-control-client

## 4.1.0

### Minor Changes

### [4.1.0](https://www.npmjs.com/package/@itwin/access-control-client/v/4.1.0) - 2026-01-13

Added Hal links to get all groups endpoint only when paging params are present. Added new endpoint for getting member invite by ID.

## 4.0.0

### Major Changes

### [4.0.0](https://www.npmjs.com/package/@itwin/access-control-client/v/4.0.0) - 2025-11-25

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
- HAL specification compliance with \_links navigation
- Advanced mapped types for handling missing users in member responses

TECHNICAL IMPROVEMENTS:

- String unions over enums (zero runtime overhead, better tree shaking)
- Conditional types for type-safe result modes
- Self-documenting response wrappers with descriptive property names
- Reorganized type system into dedicated files under src/types/
- Enhanced error handling with proper null/undefined type safety

See MIGRATION-GUIDE-v3-to-v4.md for complete migration instructions.

## 3.7.0

### [3.7.0](https://www.npmjs.com/package/@itwin/access-control-client/v/3.7.0) - 2025-10-02

feat: refactor BaseClient to use fetch API and improve error handling; remove axios dependency

- Complete migration from axios to native fetch API
- Improved error handling and response parsing
- Reduced bundle size by removing axios dependency
- Enhanced type safety and modern JavaScript standards compliance

## 3.6.0

### [3.6.0](https://www.npmjs.com/package/@itwin/access-control-client/v/3.6.0) - 2025-07-23

feat: add optional data params 'membersCount' and 'imsGroupsCount' to Group and GroupMember types

- Enhanced type definitions to support additional metadata fields

## 3.5.0

### [3.5.0](https://www.npmjs.com/package/@itwin/access-control-client/v/3.5.0) - 2025-06-18

feat: allow sending additionalHeaders for getITwinGroupsAsync

- Added support for custom headers in `getITwinGroupsAsync` method

## 3.4.0

### [3.4.0](https://www.npmjs.com/package/@itwin/access-control-client/v/3.4.0) - 2025-05-15

feat: add optional customMessage parameter to addITwinUserMembersAsync function

- Added `customMessage` parameter to `addITwinUserMembersAsync` for personalized invitation messages

## 3.3.0

### [3.3.0](https://www.npmjs.com/package/@itwin/access-control-client/v/3.3.0) - 2025-04-01

feat: add deleteITwinMemberInvitationAsync method to MemberInvitationsClient

- Added `deleteITwinMemberInvitationAsync` method for invitation management

## 3.2.0

### [3.2.0](https://www.npmjs.com/package/@itwin/access-control-client/v/3.2.0) - 2025-03-01

feat: add iTwin jobs client

- Introduced iTwin jobs client for asynchronous operation management

## 3.1.0

### [3.1.0](https://www.npmjs.com/package/@itwin/access-control-client/v/3.1.0) - 2025-02-01

feat: add headers to the API response object

- Enhanced API response objects to include response headers
- Improved debugging and monitoring capabilities
- Added support for response metadata access

## 3.0.2

### [3.0.2](https://www.npmjs.com/package/@itwin/access-control-client/v/3.0.2) - 2024-12-15

chore: upgrade axios version to ^1.7.4

- Updated axios dependency to address security vulnerabilities

## 3.0.0

### [3.0.0](https://www.npmjs.com/package/@itwin/access-control-client/v/3.0.0) - 2024-11-01

- **Breaking** Adjusting add user & add owner schemas to include invitations
- **Breaking** Adjusting add user member and add group member schemas to support multiple roleIds
- Adding member invitations client

## 2.3.1

### [2.3.1](https://www.npmjs.com/package/@itwin/access-control-client/v/2.3.1) - 2024-10-15

chore: upgrade axios version to ^1.6.1

- Updated axios dependency to address security vulnerabilities
- Improved stability and compatibility

## 2.2.0

### [2.2.0](https://www.npmjs.com/package/@itwin/access-control-client/v/2.2.0) - 2024-09-15

feat: add owner member client

- Introduced dedicated owner member management client

## 2.1.0

### [2.1.0](https://www.npmjs.com/package/@itwin/access-control-client/v/2.1.0) - 2024-08-15

feat: enhance group member structure and type safety

- Changed the `users` property to `members` on the `Groups` object.
  - `members` property now accepts a `GroupUser[]` object instead of a `string[]`

## 2.0.0

### [2.0.0](https://www.npmjs.com/package/@itwin/access-control-client/v/2.0.0) - 2024-07-01

feat: restructure clients for better modularity

- Added groups client
- Added group member client
- Added user member client
- Removed members client

## 1.3.0

### [1.3.0](https://www.npmjs.com/package/@itwin/access-control-client/v/1.3.0) - 2024-05-15

feat: add support for accept header in BaseClient

- Added support for the `accept` header inside of `BaseClient`

## 1.2.0

### [1.2.0](https://www.npmjs.com/package/@itwin/access-control-client/v/1.2.0) - 2024-04-15

feat: return newly added members

- Enhanced member addition operations to return created member objects

## 1.1.1

### [1.1.1](https://www.npmjs.com/package/@itwin/access-control-client/v/1.1.1) - 2024-03-20

fix: resolve custom URL configuration bug

- Fixed custom URL bug affecting client initialization

## 1.1.0

### [1.1.0](https://www.npmjs.com/package/@itwin/access-control-client/v/1.1.0) - 2024-03-01

feat: add custom URL support to AccessControlClient

- Added constructor parameter to AccessControlClient for custom URL configuration

## 1.0.0

### [1.0.0](https://www.npmjs.com/package/@itwin/access-control-client/v/1.0.0) - 2024-02-01

feat: initial release of @itwin/access-control-client

- Initial commit with core access control functionality
