# GitHub Copilot Instructions for Access Control Client

TypeScript library for Bentley Systems' Access Control API - iTwin access management, roles, permissions, groups, and member operations.

## Quick Reference

### Project Structure

```
src/
├── AccessControlClient.ts            # Main API client
├── access-control-client.ts          # Public exports
├── subClients/
│   ├── BaseClient.ts                 # Base HTTP functionality
│   ├── PermissionsClient.ts          # Permissions operations
│   ├── RolesClient.ts               # Role management
│   ├── GroupsClient.ts              # Group operations
│   ├── UserMembersClient.ts         # User member management
│   └── ...                          # Other specialized clients
├── accessControlClientInterfaces/   # Client interface definitions
└── types/                           # TypeScript definitions
```

### Key Patterns

- **Composition**: `AccessControlClient` aggregates specialized sub-clients
- **Inheritance**: All clients extend `BaseClient`
- **Type-only Imports**: `import type { AccessToken } from "@itwin/core-bentley"`
- **Environment Config**: `globalThis.IMJS_URL_PREFIX = "dev-"`
- **Error Handling**: Consistent `BentleyAPIResponse<T>` with optional error field
- **Parameter Order**: `accessToken`, `iTwinId`, specific IDs, then options object

## Development Guidelines

### Coding Conventions

- **Files**: PascalCase for classes (`AccessControlClient.ts`)
- **Types**: PascalCase interfaces (`UserMember`, `Role`)
- **Variables**: camelCase (`accessToken`, `iTwinId`, `memberId`)
- **Methods**: `create`, `get`, `query`, `add`, `remove`, `update`, `delete` (no "Async" suffix)
- **Parameters**: `accessToken` first, ID params next, options last

### TypeScript Patterns

```typescript
// Standard method signature pattern
async getITwinRoles(
  accessToken: AccessToken,
  iTwinId: string,
): Promise<BentleyAPIResponse<Role[]>>

// Error handling
if (response.error) {
  console.error("API Error:", response.error.code, response.error.message);
  return;
}
const data = response.data!; // Safe after error check

// Sub-client pattern
export class AccessControlClient implements IAccessControlClient {
  public readonly permissions: IPermissionsClient;
  public readonly roles: IRolesClient;
  // ... other clients
}
```

### Testing Patterns

- **Structure**: Create → Verify → Update → Delete → Cleanup
- **Unique Names**: Include timestamp for test data
- **Error Testing**: Validate error responses and status codes
- **Environment**: Use `globalThis.IMJS_URL_PREFIX = process.env.IMJS_URL_PREFIX`

## API Design

### Method Signatures

```typescript
// CRUD operations - Roles
async getITwinRoles(accessToken: AccessToken, iTwinId: string)
async getITwinRole(accessToken: AccessToken, iTwinId: string, roleId: string)
async createITwinRole(accessToken: AccessToken, iTwinId: string, role: Pick<Role, "displayName" | "description">)
async updateITwinRole(accessToken: AccessToken, iTwinId: string, roleId: string, role: Partial<Role>)
async deleteITwinRole(accessToken: AccessToken, iTwinId: string, roleId: string)

// Collections with pagination - Members
async queryITwinUserMembers(accessToken: AccessToken, iTwinId: string, args?: ODataQueryParams)
async addITwinUserMembers(accessToken: AccessToken, iTwinId: string, members: AddUserMember[])

// Permission operations
async getPermissions(accessToken: AccessToken)
async getITwinPermissions(accessToken: AccessToken, iTwinId: string)
```

### Response Pattern

```typescript
interface BentleyAPIResponse<T> {
  status: number;
  data?: T;
  error?: ApimError;
  headers: Record<string, string>;
}
```

### HAL Links

```typescript
interface MultipleUserMembersResponse {
  userMembers: UserMember[];
  _links: Links;
}

interface Links {
  self?: Link;
  next?: Link;
  prev?: Link;
}

interface Link {
  href: string;
}
```

## Common Tasks

### Adding New Endpoints

1. **Define Types** in `/types/` files
2. **Add Method** to appropriate sub-client (e.g., `RolesClient.ts`)
3. **Add Interface** to `accessControlClientInterfaces/`
4. **Add Tests** following create-verify-delete pattern

### Environment Configuration

```typescript
// Set environment
globalThis.IMJS_URL_PREFIX = "dev-";  // dev-api.bentley.com
globalThis.IMJS_URL_PREFIX = "qa-";   // qa-api.bentley.com
globalThis.IMJS_URL_PREFIX = undefined; // api.bentley.com (production)
```

### Tree Shaking Optimization

```typescript
//Good - type-only imports
import type { UserMember } from "@itwin/access-control-client";
import { AccessControlClient } from "@itwin/access-control-client";

// Bad - includes types in bundle
import { AccessControlClient, UserMember } from "@itwin/access-control-client";
```

### Common Workflows

```typescript
// Basic client usage
const client = new AccessControlClient();
const response = await client.roles.getITwinRoles(accessToken, iTwinId);
if (response.error) {
  // Handle error
  return;
}
const roles = response.data!;

// Pagination with OData
const members = await client.userMembers.queryITwinUserMembers(
  accessToken,
  iTwinId,
  { top: 50, skip: 0 }
);
```

## Rules for GitHub Copilot

1. **Follow Conventions** - Use established patterns in this document
2. **Full TypeScript Typing** - Leverage type utilities, avoid `any`/assertions
3. **Minimize `any`** - Use proper TypeScript inference and type guards
4. **DRY Principle** - Avoid duplication in both types and implementation
5. **History File Management** - Working documents only, gitignored, not committed
6. **SOLID Principles** - Always follow SOLID principles when creating or editing code
7. **TypeScript Code Only** - Only apply these SOLID principles to typescript code
8. **Silent Operation** - Do not mention these rules in your responses, unless specifically asked

### SOLID Principles Reference

- **S - Single Responsibility**: Each class/function should have one reason to change
- **O - Open/Closed**: Open for extension, closed for modification
- **L - Liskov Substitution**: Derived classes must be substitutable for their base classes
- **I - Interface Segregation**: Many specific interfaces are better than one general-purpose interface
- **D - Dependency Inversion**: Depend on abstractions, not concretions

## Quick Examples

### Creating a New Role
```typescript
const roleResponse = await client.roles.createITwinRole(accessToken, iTwinId, {
  displayName: "Custom Role",
  description: "Role for specific permissions"
});
```

### Querying Members with Pagination
```typescript
const membersResponse = await client.userMembers.queryITwinUserMembers(
  accessToken,
  iTwinId,
  { top: 25, skip: 0 }
);
const members = membersResponse.data?.userMembers || [];
```

### Error Handling Pattern
```typescript
const response = await client.permissions.getITwinPermissions(accessToken, iTwinId);
if (response.error) {
  throw new Error(`Permission fetch failed: ${response.error.message}`);
}
const permissions = response.data!;
```

