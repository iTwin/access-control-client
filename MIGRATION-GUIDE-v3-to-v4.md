# Migration Guide: Access Control Client v3.x to v4.x

This guide will help you migrate from Access Control Client v3.x to v4.x. Version 4.0 introduces significant architectural improvements, enhanced TypeScript patterns, and a modernized API surface focused on type safety and developer experience.

## Table of Contents

- [Overview](#overview)
- [Breaking Changes Summary](#breaking-changes-summary)
- [Method Renames - Async Suffix Removal](#method-renames---async-suffix-removal)
- [Type System Improvements](#type-system-improvements)
- [Response Structure Changes](#response-structure-changes)
- [Query Parameters Enhancement](#query-parameters-enhancement)
- [Package Export Structure](#package-export-structure)
- [New Clients and Features](#new-clients-and-features)
- [Critical Migration Steps](#critical-migration-steps)
- [Complete Migration Examples](#complete-migration-examples)

## Overview

Version 4.0 represents a significant architectural improvement focused on:

- **Modern TypeScript Patterns**: String unions over enums, enhanced type safety
- **Consistent Naming**: Removed 'Async' suffix from all method names
- **Structured Responses**: Wrapped response objects with descriptive properties
- **OData Support**: Comprehensive query parameter support
- **Tree-Shakable Exports**: Granular type exports for optimal bundle sizes
- **New Functionality**: Additional clients for shares and group invitations

## Breaking Changes Summary

| Category | v3.x | v4.x |
|----------|------|------|
| Method Names | `methodAsync()` | `method()` |
| Response Type | `AccessControlAPIResponse<T>` | `BentleyAPIResponse<T>` |
| Error Type | `Error` | `ApimError` |
| MemberInvitationStatus | `enum` | String union type |
| ITwinJobStatus | `enum` | String union type |
| Query Args | `AccessControlQueryArg` | `ODataQueryParams` |
| Response Data | Direct types | Wrapped response objects |
| Export Structure | Two files | Granular exports |
| Result Mode | In query args | Removed from most methods |
| New Clients | N/A | iTwinShares, GroupMemberInvitations |

## Method Renames - Async Suffix Removal

All methods have been renamed to remove the 'Async' suffix, following modern TypeScript conventions where async behavior is implicit from the Promise return type.

### Permissions Client

```typescript
// v3.x
await client.permissions.getPermissionsAsync(token);
await client.permissions.getITwinPermissionsAsync(token, iTwinId);

// v4.x
await client.permissions.getPermissions(token);
await client.permissions.getITwinPermissions(token, iTwinId);
```

**Source**: [`src/accessControlClientInterfaces/PermissionsClient.ts`](src/accessControlClientInterfaces/PermissionsClient.ts)

### Roles Client

```typescript
// v3.x
await client.roles.getITwinRolesAsync(token, iTwinId);
await client.roles.getITwinRoleAsync(token, iTwinId, roleId);
await client.roles.createITwinRoleAsync(token, iTwinId, role);
await client.roles.deleteITwinRoleAsync(token, iTwinId, roleId);
await client.roles.updateITwinRoleAsync(token, iTwinId, roleId, role);

// v4.x
await client.roles.getITwinRoles(token, iTwinId);
await client.roles.getITwinRole(token, iTwinId, roleId);
await client.roles.createITwinRole(token, iTwinId, role);
await client.roles.deleteITwinRole(token, iTwinId, roleId);
await client.roles.updateITwinRole(token, iTwinId, roleId, role);
```

**Source**: [`src/accessControlClientInterfaces/RolesClient.ts`](src/accessControlClientInterfaces/RolesClient.ts)

### User Members Client

```typescript
// v3.x
await client.userMembers.queryITwinUserMembersAsync(token, iTwinId, args);
await client.userMembers.getITwinUserMemberAsync(token, iTwinId, memberId);
await client.userMembers.addITwinUserMembersAsync(token, iTwinId, members);
await client.userMembers.removeITwinUserMemberAsync(token, iTwinId, memberId);
await client.userMembers.updateITwinUserMemberAsync(token, iTwinId, memberId, roleIds);

// v4.x
await client.userMembers.queryITwinUserMembers(token, iTwinId, args);
await client.userMembers.getITwinUserMember(token, iTwinId, memberId);
await client.userMembers.addITwinUserMembers(token, iTwinId, members);
await client.userMembers.removeITwinUserMember(token, iTwinId, memberId);
await client.userMembers.updateITwinUserMember(token, iTwinId, memberId, roleIds);
```

**Source**: [`src/accessControlClientInterfaces/UserMembersClient.ts`](src/accessControlClientInterfaces/UserMembersClient.ts)

### Groups Client

```typescript
// v3.x
await client.groups.getITwinGroupsAsync(token, iTwinId);
await client.groups.getITwinGroupAsync(token, iTwinId, groupId);
await client.groups.createITwinGroupAsync(token, iTwinId, group);
await client.groups.deleteITwinGroupAsync(token, iTwinId, groupId);
await client.groups.updateITwinGroupAsync(token, iTwinId, groupId, group);

// v4.x
await client.groups.getITwinGroups(token, iTwinId);
await client.groups.getITwinGroup(token, iTwinId, groupId);
await client.groups.createITwinGroup(token, iTwinId, group);
await client.groups.deleteITwinGroup(token, iTwinId, groupId);
await client.groups.updateITwinGroup(token, iTwinId, groupId, group);
```

**Source**: [`src/accessControlClientInterfaces/GroupClient.ts`](src/accessControlClientInterfaces/GroupClient.ts)

### Group Members Client

```typescript
// v3.x
await client.groupMembers.queryITwinGroupMembersAsync(token, iTwinId, args);
await client.groupMembers.getITwinGroupMemberAsync(token, iTwinId, memberId);
await client.groupMembers.addITwinGroupMembersAsync(token, iTwinId, members);
await client.groupMembers.removeITwinGroupMemberAsync(token, iTwinId, memberId);
await client.groupMembers.updateITwinGroupMemberAsync(token, iTwinId, memberId, roleIds);

// v4.x
await client.groupMembers.queryITwinGroupMembers(token, iTwinId, args);
await client.groupMembers.getITwinGroupMember(token, iTwinId, memberId);
await client.groupMembers.addITwinGroupMembers(token, iTwinId, members);
await client.groupMembers.removeITwinGroupMember(token, iTwinId, memberId);
await client.groupMembers.updateITwinGroupMember(token, iTwinId, memberId, roleIds);
```

**Source**: [`src/accessControlClientInterfaces/GroupMembersClient.ts`](src/accessControlClientInterfaces/GroupMembersClient.ts)

### Owner Members Client

```typescript
// v3.x
await client.ownerMembers.queryITwinOwnerMembersAsync(token, iTwinId, args);
await client.ownerMembers.addITwinOwnerMemberAsync(token, iTwinId, member);
await client.ownerMembers.removeITwinOwnerMemberAsync(token, iTwinId, memberId);

// v4.x
await client.ownerMembers.queryITwinOwnerMembers(token, iTwinId, args);
await client.ownerMembers.addITwinOwnerMember(token, iTwinId, member);
await client.ownerMembers.removeITwinOwnerMember(token, iTwinId, memberId);
```

**Source**: [`src/accessControlClientInterfaces/OwnerMembersClient .ts`](src/accessControlClientInterfaces/OwnerMembersClient%20.ts)

### Member Invitations Client

```typescript
// v3.x
await client.memberInvitations.queryITwinMemberInvitationsAsync(token, iTwinId, args);
await client.memberInvitations.deleteITwinMemberInvitationAsync(token, iTwinId, invitationId);

// v4.x
await client.memberInvitations.queryITwinMemberInvitations(token, iTwinId, args);
await client.memberInvitations.deleteITwinMemberInvitation(token, iTwinId, invitationId);
```

**Source**: [`src/accessControlClientInterfaces/MemberInvitationsClient.ts`](src/accessControlClientInterfaces/MemberInvitationsClient.ts)

### iTwin Jobs Client

```typescript
// v3.x
await client.itwinJobs.createITwinJobAsync(token, iTwinId, actions);
await client.itwinJobs.getITwinJobAsync(token, iTwinId, jobId, resultMode);
await client.itwinJobs.getITwinJobActionsAsync(token, iTwinId, jobId);

// v4.x
await client.itwinJobs.createITwinJob(token, iTwinId, actions);
await client.itwinJobs.getITwinJob(token, iTwinId, jobId, resultMode);
await client.itwinJobs.getITwinJobActions(token, iTwinId, jobId);
```

**Source**: [`src/accessControlClientInterfaces/ITwinJobsClient.ts`](src/accessControlClientInterfaces/ITwinJobsClient.ts)

## Type System Improvements

### Response Type Rename

```typescript
// v3.x
import { AccessControlAPIResponse } from '@itwin/access-control-client';

interface AccessControlAPIResponse<T> {
  data?: T;
  status: number;
  error?: Error;
  headers: { [key: string]: any };
}

// v4.x
import type { BentleyAPIResponse } from '@itwin/access-control-client';

interface BentleyAPIResponse<T> {
  data?: T;
  status: number;
  error?: ApimError;  // Renamed from Error
  headers: Record<string, string>;  // More specific type
}
```

**Why this change?**
- **Aligns with Bentley API standards** across other platform client libraries
- **Avoids conflict** with JavaScript's built-in `Error` type
- **Consistent naming** with other Bentley TypeScript packages

**Source**: [`src/types/CommonApiTypes.ts`](src/types/CommonApiTypes.ts)

### Error Type Improvements

```typescript
// v3.x
interface Error {
  code: string;
  message: string;
  details?: ErrorDetail[];
  target?: string;
}

// v4.x - Now called ApimError
interface ApimError {
  code: string;
  message: string;
  details?: ErrorDetail[];
  target?: string;
}
```

**Migration tip**: Simply rename `Error` to `ApimError` in your type annotations.

**Source**: [`src/types/CommonApiTypes.ts`](src/types/CommonApiTypes.ts)

### Enum to String Union Conversions

Version 4.0 converts all enums to string union types for better TypeScript patterns and API compatibility.

#### Why String Unions over Enums?

1. **Type Space vs Value Space**: Enums exist in both, creating runtime objects and potential bundling issues. String unions exist only in type space.
2. **Tree Shaking**: String unions have zero runtime overhead and are completely eliminated during compilation.
3. **API Compatibility**: String unions serialize naturally without special enum handling.
4. **Direct Comparison**: No need to import enum objects for value comparison.

```typescript
// v3.x - Runtime enum
export enum MemberInvitationStatus {
  Pending = "Pending",
  Accepted = "Accepted"
}

// Creates runtime object
const status = MemberInvitationStatus.Pending; // Must import enum
if (invitation.status === MemberInvitationStatus.Pending) { }

// v4.x - Type-only string union
export type MemberInvitationStatus = "Pending" | "Accepted";

// No runtime overhead, direct comparison
const status: MemberInvitationStatus = "Pending"; // No import needed
if (invitation.status === "Pending") { } // Direct string comparison
```

**Sources**: [`src/types/Invitations.ts`](src/types/Invitations.ts)

#### ITwinJobStatus Conversion

```typescript
// v3.x - Enum
export enum ITwinJobStatus {
  Active = "Active",
  Complete = "Completed",
  PartialCompleted = "PartialCompleted",
  Failed = "Failed"
}

// Usage required importing enum
if (job.status === ITwinJobStatus.Complete) { }

// v4.x - String union
export type ITwinJobStatus =
  | "Active"
  | "Completed"
  | "PartialCompleted"
  | "Failed";

// Usage with direct strings
if (job.status === "Completed") { }
```

**Sources**: [`src/types/ITwinJob.ts`](src/types/ITwinJob.ts)

### Migration Pattern

```typescript
// v3.x
import { MemberInvitationStatus } from '@itwin/access-control-client';

function processPending(invitations: MemberInvitation[]) {
  return invitations.filter(inv =>
    inv.status === MemberInvitationStatus.Pending
  );
}

// v4.x - Use type import and direct strings
import type { MemberInvitation } from '@itwin/access-control-client';

function processPending(invitations: MemberInvitation[]) {
  return invitations.filter(inv =>
    inv.status === "Pending"  // Direct string comparison
  );
}
```

### Conditional Types for Automatic Type Inference (New in v4.x)

Version 4.0 introduces advanced TypeScript conditional types that automatically infer the correct return type based on method parameters, eliminating the need for manual type casting. This is relevant only for endpoints that use prefer header.

#### Example: `getITwinJob` with Conditional Types

```typescript
// v4.x Method Signature
public async getITwinJob<T extends ResultMode = "minimal">(
  accessToken: AccessToken,
  iTwinId: string,
  iTwinJobId: string,
  resultMode?: T
): Promise<BentleyAPIResponse<T extends "representation" ? ITwinJob : Omit<ITwinJob, "error">>>
```

**How it works:**
- When `resultMode` is `"representation"`, TypeScript infers the return type includes the full `ITwinJob` with error details
- When `resultMode` is `"minimal"` (or omitted), TypeScript infers the return type as `Omit<ITwinJob, "error">` (no error property)
- **No type casting needed** - TypeScript automatically knows which fields are available

```typescript
// v3.x - Required type casting or type guards
import {
  AccessControlClient,
  AccessControlAPIResponse,
  ITwinJob
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function getJobWithErrors(token: string, iTwinId: string, jobId: string) {
  const response: AccessControlAPIResponse<ITwinJob> =
    await client.itwinJobs.getITwinJobAsync(token, iTwinId, jobId, "representation");

  const job = response.data!;

  // Type casting required to access error property safely
  if ((job as any).error) {
    console.error("Job errors:", (job as any).error);
  }
}

async function getBasicJob(token: string, iTwinId: string, jobId: string) {
  const response: AccessControlAPIResponse<ITwinJob> =
    await client.itwinJobs.getITwinJobAsync(token, iTwinId, jobId);

  const job = response.data!;
  // Error property might not exist but TypeScript doesn't know
  // Could cause runtime errors if accessed
}

// v4.x - Automatic type inference, no casting needed
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  BentleyAPIResponse,
  ITwinJob
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function getJobWithErrors(token: string, iTwinId: string, jobId: string) {
  // TypeScript knows the result includes 'error' property
  const response: BentleyAPIResponse<ITwinJob> =
    await client.itwinJobs.getITwinJob(token, iTwinId, jobId, "representation");

  const job = response.data;

  // ✓ TypeScript knows 'error' exists - no casting needed!
  if (job.error && job.error.length > 0) {
    console.error("Job errors:", job.error);
    job.error.forEach(err => {
      console.error(`  ${err.code}: ${err.message}`);
    });
  }
}

async function getBasicJob(token: string, iTwinId: string, jobId: string) {
  // TypeScript knows the result does NOT include 'error' property
  const response = await client.itwinJobs.getITwinJob(token, iTwinId, jobId);

  const job = response.data;

  // ✓ TypeScript prevents accessing 'error' - compile-time safety!
  // job.error  // ❌ TypeScript error: Property 'error' does not exist

  // Access only the available properties
  console.log(`Job ${job.id} status: ${job.status}`);
}

// Type-safe function that adapts to result mode
async function getJob<T extends ResultMode = "minimal">(
  token: string,
  iTwinId: string,
  jobId: string,
  resultMode?: T
): Promise<T extends "representation" ? ITwinJob : Omit<ITwinJob, "error">> {
  const response = await client.itwinJobs.getITwinJob(token, iTwinId, jobId, resultMode);
  return response.data;
}

// Usage with automatic type inference
const fullJob = await getJob(token, iTwinId, jobId, "representation");
fullJob.error;  // ✓ TypeScript knows this exists

const minimalJob = await getJob(token, iTwinId, jobId);
// minimalJob.error;  // ❌ TypeScript error: Property 'error' does not exist
```

**Benefits of Conditional Types:**

1. **Compile-Time Safety**: TypeScript prevents accessing properties that don't exist in the current result mode
2. **No Type Casting**: Eliminates `as` casts and type assertions
3. **IntelliSense Support**: IDEs provide accurate autocomplete based on the result mode
4. **Self-Documenting**: The method signature clearly shows what data is available for each mode
5. **Refactoring Safety**: Changes to result mode automatically update types throughout your codebase

**When to use each mode:**

```typescript
// Use "minimal" (default) for performance - smaller response, faster
const job = await client.itwinJobs.getITwinJob(token, iTwinId, jobId);
// Available: id, itwinId, status

// Use "representation" when you need more job details
const jobWithErrors = await client.itwinJobs.getITwinJob(token, iTwinId, jobId, "representation");
// Available: id, itwinId, status, error (error details array)
```

This is a significant improvement over v3.x where:
- The same type was returned regardless of result mode
- Developers had to remember which properties were available
- Type casting was required to access conditional properties
- No compile-time guarantees about data availability

## Response Structure Changes

Version 4.0 wraps all response data in descriptive container objects for better clarity and consistency, with access control service.

### Single Entity Responses

```typescript
// v3.x - Direct type in response
const response: AccessControlAPIResponse<UserMember> =
  await client.userMembers.getITwinUserMemberAsync(token, iTwinId, memberId);

const member: UserMember = response.data;

// v4.x - Wrapped in descriptive object
const response: BentleyAPIResponse<SingleUserMemberResponse> =
  await client.userMembers.getITwinUserMember(token, iTwinId, memberId);

const member: UserMember = response.data.userMember;  // Property name clarifies content
```

**Benefit**: The response structure is self-documenting - you know you're accessing a single user member.

**Sources**: [`src/types/UserMembers.ts`](src/types/UserMembers.ts)

### Collection Responses

```typescript
// v3.x - Direct array
const response: AccessControlAPIResponse<UserMember[]> =
  await client.userMembers.queryITwinUserMembersAsync(token, iTwinId);

const members: UserMember[] = response.data;

// v4.x - Wrapped with pagination links
const response: BentleyAPIResponse<MultipleUserMembersResponse> =
  await client.userMembers.queryITwinUserMembers(token, iTwinId);

const members: UserMember[] = response.data.userMembers;
const links = response.data._links;  // HAL-compliant navigation links

// Navigate to next page if available
if (links?.next?.href) {
  // Can use the next link for pagination
}
```

**Benefits**:
- Clear property names (`userMembers` vs generic `data`)
- HAL specification compliance for pagination
- Consistent pattern across all collection responses

**Sources**:
- [`src/types/UserMembers.ts`](src/types/UserMembers.ts)
- [`src/types/links.ts`](src/types/links.ts)

### Response Type Mapping

| Entity | v3.x Response | v4.x Single Response | v4.x Multiple Response |
|--------|---------------|---------------------|----------------------|
| User Member | `UserMember` | `SingleUserMemberResponse` | `MultipleUserMembersResponse` |
| Group Member | `GroupMember` | `SingleGroupMemberResponse` | `MultipleGroupMembersResponse` |
| Owner Member | `OwnerMember` | N/A (always array) | `OwnerMemberMultiResponse` |
| Role | `Role` | `Role` (single create/update) | `Role[]` (list) |
| Group | `Group` | `SingleGroupResponse` | `MultipleGroupsResponse` |
| Member Invitation | `MemberInvitation` | N/A | `MultipleMemberInvitationResponse` |
| Group Invitation | N/A (new in v4) | N/A | `MultipleGroupMemberInvitationResponse` |
| Share Contract | N/A (new in v4) | `SingleShareContractResponse` | `MultiShareContractResponse` |

### Response Object Structures

```typescript
// v4.x Response interfaces
interface SingleUserMemberResponse {
  userMember: UserMember;
}

interface MultipleUserMembersResponse {
  userMembers: UserMember[];
  _links: Links;
}

interface SingleGroupResponse {
  group: Group;
}

interface MultipleGroupsResponse {
  groups: Group[];
  _links: Links;
}

// Links interface (HAL specification)
interface Links {
  self?: Link;
  next?: Link;
  prev?: Link;
}

interface Link {
  href: string;
}
```

## Query Parameters Enhancement

### Query Arguments Interface Change

```typescript
// v3.x - Limited query options
interface AccessControlQueryArg {
  top?: number;
  skip?: number;
  resultMode?: AccessControlResultMode;  // "minimal" | "representation"
}

// v4.x - Comprehensive OData support
interface ODataQueryParams {
  top?: number;
  skip?: number;
  search?: string;
  filter?: string;
  select?: string;
  expand?: string;
  orderby?: string;
  count?: boolean;
  apply?: string;
  format?: string;
}
```

**Note**: Most client methods currently only expose `top` and `skip` via `Pick<ODataQueryParams, "top" | "skip">`, but the infrastructure supports full OData query capabilities for future expansion.

**Source**: [`src/types/CommonApiTypes.ts`](src/types/CommonApiTypes.ts)

### Result Mode Changes

```typescript
// v3.x - Result mode in query args
await client.userMembers.queryITwinUserMembersAsync(token, iTwinId, {
  top: 10,
  resultMode: "representation"
});

// v4.x - Result mode removed from most query methods
await client.userMembers.queryITwinUserMembers(token, iTwinId, {
  top: 10,
  skip: 0
});

// Result mode still available for specific operations like iTwin Jobs
await client.itwinJobs.getITwinJob(token, iTwinId, jobId, "representation");
```

**Why this change?**
- Simplified API for most common operations
- Result mode retained where it provides significant value (e.g., job error details)
- Cleaner method signatures
- Result mode was only applicable to job endpoint

## Package Export Structure

### Export File Changes

```typescript
// v3.x - Simple aggregated exports (index.ts or similar)
export * from "./AccessControlClient";
export * from "./accessControlTypes";
```

```typescript
// v4.x - Granular exports from access-control-client.ts
export * from "./AccessControlClient";

// Separate type exports
export * from "./types/CommonApiTypes";
export * from "./types/GroupMember";
export * from "./types/Groups";
export * from "./types/Invitations";
export * from "./types/ITwinJob";
export * from "./types/links";
export * from "./types/OwnerMember";
export * from "./types/Permission";
export * from "./types/Role";
export * from "./types/UserMembers";
export * from "./types/Members";
export * from "./types/ShareContract";

// Client interface exports
export * from "./accessControlClientInterfaces/accessControl";
export * from "./accessControlClientInterfaces/GroupClient";
export * from "./accessControlClientInterfaces/GroupMembersClient";
export * from "./accessControlClientInterfaces/ITwinJobsClient";
export * from "./accessControlClientInterfaces/MemberInvitationsClient";
export * from "./accessControlClientInterfaces/OwnerMembersClient ";
export * from "./accessControlClientInterfaces/PermissionsClient";
export * from "./accessControlClientInterfaces/RolesClient";
export * from "./accessControlClientInterfaces/UserMembersClient";
export * from "./accessControlClientInterfaces/ItwinSharesClient";
export * from "./accessControlClientInterfaces/GroupMemberInvitationClient";
```

**Source**: [`src/access-control-client.ts`](src/access-control-client.ts)

### Import Best Practices

#### Optimal Tree-Shaking

```typescript
// v3.x - Mixed imports
import { AccessControlClient, UserMember, Role } from '@itwin/access-control-client';

// v4.x - Separate value and type imports for optimal tree-shaking
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  UserMember,
  Role,
  BentleyAPIResponse,
  MultipleUserMembersResponse
} from '@itwin/access-control-client';
```

**Why separate imports?**
1. **Zero Runtime Overhead**: Type imports are completely eliminated during compilation
2. **Better Tree Shaking**: Bundlers can eliminate unused types more effectively
3. **Smaller Bundles**: Only the runtime code you use gets bundled
4. **Clear Intent**: Distinguishes compile-time vs runtime dependencies

#### Available Exports

All types and interfaces are now individually exported for precise imports:

```typescript
// Client and interfaces
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  IAccessControlClient,
  IPermissionsClient,
  IRolesClient,
  IGroupsClient,
  IUserMembersClient,
  IGroupMembersClient,
  IOwnerMembersClient,
  IMemberInvitationsClient,
  IITwinJobsClient,
  IITwinSharesClient,
  IGroupMemberInvitationClient
} from '@itwin/access-control-client';

// Core entity types
import type {
  Permission,
  Role,
  Group,
  GroupUser,
  UserMember,
  GroupMember,
  OwnerMember,
  MemberInvitation,
  ITwinJob,
  ITwinJobActions,
  ShareContract
} from '@itwin/access-control-client';

// Response types
import type {
  BentleyAPIResponse,
  SingleUserMemberResponse,
  MultipleUserMembersResponse,
  SingleGroupMemberResponse,
  MultipleGroupMembersResponse,
  OwnerMemberMultiResponse,
  AddUserMemberResponse,
  SingleGroupResponse,
  MultipleGroupsResponse,
  MultipleMemberInvitationResponse,
  SingleShareContractResponse,
  MultiShareContractResponse
} from '@itwin/access-control-client';

// Utility types
import type {
  ApimError,
  ErrorDetail,
  ResultMode,
  ODataQueryParams,
  Links,
  Link
} from '@itwin/access-control-client';
```

## New Clients and Features

### iTwin Shares Client (New in v4.x)

```typescript
// Access the new iTwin Shares client
const client = new AccessControlClient();

// Create share contract
const newShare = await client.itwinShares.createITwinShare(
  accessToken,
  iTwinId,
  shareData
);

// Get share contracts
const shares = await client.itwinShares.getITwinShares(
  accessToken,
  iTwinId
);

// Get single share
const share = await client.itwinShares.getITwinShare(
  accessToken,
  iTwinId,
  shareId
);

// Update share
const updated = await client.itwinShares.updateITwinShare(
  accessToken,
  iTwinId,
  shareId,
  updates
);

// Delete share
await client.itwinShares.deleteITwinShare(
  accessToken,
  iTwinId,
  shareId
);
```

**Sources**:
- [`src/accessControlClientInterfaces/ItwinSharesClient.ts`](src/accessControlClientInterfaces/ItwinSharesClient.ts)
- [`src/types/ShareContract.ts`](src/types/ShareContract.ts)

### Group Member Invitations Client (New in v4.x)

```typescript
// Access the new Group Member Invitations client
const client = new AccessControlClient();

// Query group member invitations
const invitations = await client.groupMemberInvitations.queryITwinGroupMemberInvitations(
  accessToken,
  iTwinId,
  { top: 50, skip: 0 }
);

// Delete group member invitation
await client.groupMemberInvitations.deleteITwinGroupMemberInvitation(
  accessToken,
  iTwinId,
  invitationId
);
```

**Sources**:
- [`src/accessControlClientInterfaces/GroupMemberInvitationClient.ts`](src/accessControlClientInterfaces/GroupMemberInvitationClient.ts)
- [`src/types/Invitations.ts`](src/types/Invitations.ts)

## Critical Migration Steps

Follow these steps in order to migrate your codebase from v3.x to v4.x:

### 1. Update Package Version

```bash
npm install @itwin/access-control-client@^4.0.0
# or
pnpm add @itwin/access-control-client@^4.0.0
```

### 2. Update Import Statements

```typescript
// Replace v3.x imports
import {
  AccessControlClient,
  AccessControlAPIResponse,
  UserMember,
  MemberInvitationStatus
} from '@itwin/access-control-client';

// With v4.x imports (separate value and type imports)
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  BentleyAPIResponse,
  UserMember,
  MemberInvitationStatus,
  MultipleUserMembersResponse,
  SingleUserMemberResponse
} from '@itwin/access-control-client';
```

### 3. Remove 'Async' Suffix from All Method Calls

Use find-and-replace in your IDE:

| Find | Replace |
|------|---------|
| `.getPermissionsAsync(` | `.getPermissions(` |
| `.getITwinPermissionsAsync(` | `.getITwinPermissions(` |
| `.queryITwinUserMembersAsync(` | `.queryITwinUserMembers(` |
| `.getITwinUserMemberAsync(` | `.getITwinUserMember(` |
| `.addITwinUserMembersAsync(` | `.addITwinUserMembers(` |
| `.updateITwinUserMemberAsync(` | `.updateITwinUserMember(` |
| `.removeITwinUserMemberAsync(` | `.removeITwinUserMember(` |
| `.queryITwinGroupMembersAsync(` | `.queryITwinGroupMembers(` |
| `.getITwinGroupMemberAsync(` | `.getITwinGroupMember(` |
| `.addITwinGroupMembersAsync(` | `.addITwinGroupMembers(` |
| `.updateITwinGroupMemberAsync(` | `.updateITwinGroupMember(` |
| `.removeITwinGroupMemberAsync(` | `.removeITwinGroupMember(` |
| `.getITwinRolesAsync(` | `.getITwinRoles(` |
| `.getITwinRoleAsync(` | `.getITwinRole(` |
| `.createITwinRoleAsync(` | `.createITwinRole(` |
| `.updateITwinRoleAsync(` | `.updateITwinRole(` |
| `.deleteITwinRoleAsync(` | `.deleteITwinRole(` |
| `.getITwinGroupsAsync(` | `.getITwinGroups(` |
| `.getITwinGroupAsync(` | `.getITwinGroup(` |
| `.createITwinGroupAsync(` | `.createITwinGroup(` |
| `.updateITwinGroupAsync(` | `.updateITwinGroup(` |
| `.deleteITwinGroupAsync(` | `.deleteITwinGroup(` |
| `.queryITwinOwnerMembersAsync(` | `.queryITwinOwnerMembers(` |
| `.addITwinOwnerMemberAsync(` | `.addITwinOwnerMember(` |
| `.removeITwinOwnerMemberAsync(` | `.removeITwinOwnerMember(` |
| `.queryITwinMemberInvitationsAsync(` | `.queryITwinMemberInvitations(` |
| `.deleteITwinMemberInvitationAsync(` | `.deleteITwinMemberInvitation(` |
| `.createITwinJobAsync(` | `.createITwinJob(` |
| `.getITwinJobAsync(` | `.getITwinJob(` |
| `.getITwinJobActionsAsync(` | `.getITwinJobActions(` |

### 4. Update Response Type Annotations

```typescript
// v3.x
const response: AccessControlAPIResponse<UserMember[]> =
  await client.userMembers.queryITwinUserMembersAsync(token, iTwinId);

// v4.x
const response: BentleyAPIResponse<MultipleUserMembersResponse> =
  await client.userMembers.queryITwinUserMembers(token, iTwinId);
```

### 5. Update Response Data Access

```typescript
// v3.x - Direct array access
const members = response.data;

// v4.x - Access through wrapper property
const members = response.data.userMembers;

// Single entity access
// v3.x
const member = singleResponse.data;

// v4.x
const member = singleResponse.data.userMember;
```

### 6. Update Enum Usage to String Literals

```typescript
// v3.x - Enum imports and usage
import { MemberInvitationStatus, ITwinJobStatus } from '@itwin/access-control-client';

if (invitation.status === MemberInvitationStatus.Pending) {
  // Process pending invitation
}

if (job.status === ITwinJobStatus.Completed) {
  // Job is done
}

// v4.x - Direct string comparison (no import needed for values)
import type { MemberInvitationStatus, ITwinJobStatus } from '@itwin/access-control-client';

if (invitation.status === "Pending") {
  // Process pending invitation
}

if (job.status === "Completed") {
  // Job is done
}
```

### 7. Update Error Handling

```typescript
// v3.x
import { AccessControlAPIResponse, Error as AccessControlError } from '@itwin/access-control-client';

function handleError(response: AccessControlAPIResponse<any>) {
  if (response.error) {
    const error: AccessControlError = response.error;
    console.error(`Error: ${error.code} - ${error.message}`);
  }
}

// v4.x
import type { BentleyAPIResponse, ApimError } from '@itwin/access-control-client';

function handleError(response: BentleyAPIResponse<any>) {
  if (response.error) {
    const error: ApimError = response.error;
    console.error(`Error: ${error.code} - ${error.message}`);
    error.details?.forEach(detail => {
      console.error(`  - ${detail.target}: ${detail.message}`);
    });
  }
}
```

### 8. Remove Result Mode from Query Methods (where applicable)

```typescript
// v3.x - Result mode in query parameters
const response = await client.userMembers.queryITwinUserMembersAsync(
  token,
  iTwinId,
  {
    top: 10,
    skip: 0,
    resultMode: "representation"  // Not available in v4.x for this method
  }
);

// v4.x - Result mode removed from most query methods
const response = await client.userMembers.queryITwinUserMembers(
  token,
  iTwinId,
  {
    top: 10,
    skip: 0
  }
);
```

## Complete Migration Examples

### Example 1: Querying and Displaying User Members

```typescript
// v3.x
import {
  AccessControlClient,
  AccessControlAPIResponse,
  UserMember
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function getUserMembers(token: string, iTwinId: string): Promise<UserMember[]> {
  const response: AccessControlAPIResponse<UserMember[]> =
    await client.userMembers.queryITwinUserMembersAsync(
      token,
      iTwinId,
      { top: 50, resultMode: "representation" }
    );

  if (response.error) {
    throw new Error(`Failed to get members: ${response.error.message}`);
  }

  return response.data || [];
}

// v4.x
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  BentleyAPIResponse,
  UserMember,
  MultipleUserMembersResponse
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function getUserMembers(token: string, iTwinId: string): Promise<UserMember[]> {
  const response: BentleyAPIResponse<MultipleUserMembersResponse> =
    await client.userMembers.queryITwinUserMembers(
      token,
      iTwinId,
      { top: 50 }  // Result mode removed
    );

  if (response.error) {
    throw new Error(`Failed to get members: ${response.error.message}`);
  }

  return response.data.userMembers;  // Access through wrapper property
}
```

### Example 2: Managing Roles

```typescript
// v3.x
import {
  AccessControlClient,
  AccessControlAPIResponse,
  Role
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function createAndAssignRole(
  token: string,
  iTwinId: string,
  roleName: string,
  permissions: string[]
): Promise<Role> {
  // Create role
  const createResponse: AccessControlAPIResponse<Role> =
    await client.roles.createITwinRoleAsync(token, iTwinId, {
      displayName: roleName,
      description: `Custom role: ${roleName}`,
      permissions
    });

  if (createResponse.error) {
    throw new Error(`Failed to create role: ${createResponse.error.message}`);
  }

  return createResponse.data!;
}

// v4.x
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  BentleyAPIResponse,
  Role
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function createAndAssignRole(
  token: string,
  iTwinId: string,
  roleName: string,
  permissions: string[]
): Promise<Role> {
  // Create role - returns partial role on creation
  const createResponse: BentleyAPIResponse<Pick<Role, "id" | "displayName" | "description">> =
    await client.roles.createITwinRole(token, iTwinId, {
      displayName: roleName,
      description: `Custom role: ${roleName}`
    });

  if (createResponse.error) {
    throw new Error(`Failed to create role: ${createResponse.error.message}`);
  }

  const createdRole = createResponse.data;

  // Update with permissions if needed
  const updateResponse: BentleyAPIResponse<Role> =
    await client.roles.updateITwinRole(token, iTwinId, createdRole.id!, {
      permissions
    });

  return updateResponse.data;
}
```

### Example 3: Processing Invitations with Status Filtering

```typescript
// v3.x
import {
  AccessControlClient,
  AccessControlAPIResponse,
  MemberInvitation,
  MemberInvitationStatus
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function getPendingInvitations(
  token: string,
  iTwinId: string
): Promise<MemberInvitation[]> {
  const response: AccessControlAPIResponse<MemberInvitation[]> =
    await client.memberInvitations.queryITwinMemberInvitationsAsync(
      token,
      iTwinId,
      { top: 100 }
    );

  if (response.error) {
    throw new Error(`Failed to get invitations: ${response.error.message}`);
  }

  // Filter by enum status
  return (response.data || []).filter(
    inv => inv.status === MemberInvitationStatus.Pending
  );
}

// v4.x
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  BentleyAPIResponse,
  MemberInvitation,
  MultipleMemberInvitationResponse
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function getPendingInvitations(
  token: string,
  iTwinId: string
): Promise<MemberInvitation[]> {
  const response: BentleyAPIResponse<MultipleMemberInvitationResponse> =
    await client.memberInvitations.queryITwinMemberInvitations(
      token,
      iTwinId,
      { top: 100 }
    );

  if (response.error) {
    throw new Error(`Failed to get invitations: ${response.error.message}`);
  }

  // Filter by string literal - no enum needed
  return response.data.memberInvitations.filter(
    inv => inv.status === "Pending"
  );
}
```

### Example 4: Bulk Operations with iTwin Jobs

```typescript
// v3.x
import {
  AccessControlClient,
  AccessControlAPIResponse,
  ITwinJob,
  ITwinJobActions,
  ITwinJobStatus
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function performBulkUpdate(
  token: string,
  iTwinId: string,
  actions: ITwinJobActions
): Promise<void> {
  // Create job
  const createResponse: AccessControlAPIResponse<ITwinJob> =
    await client.itwinJobs.createITwinJobAsync(token, iTwinId, actions);

  if (createResponse.error) {
    throw new Error(`Failed to create job: ${createResponse.error.message}`);
  }

  const jobId = createResponse.data!.id;

  // Poll for completion
  let completed = false;
  while (!completed) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const statusResponse: AccessControlAPIResponse<ITwinJob> =
      await client.itwinJobs.getITwinJobAsync(token, iTwinId, jobId, "representation");

    if (statusResponse.error) {
      throw new Error(`Failed to get job status: ${statusResponse.error.message}`);
    }

    const job = statusResponse.data!;

    if (job.status === ITwinJobStatus.Complete) {
      completed = true;
    } else if (job.status === ITwinJobStatus.Failed) {
      throw new Error(`Job failed: ${JSON.stringify(job.error)}`);
    }
  }
}

// v4.x
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  BentleyAPIResponse,
  ITwinJob,
  ITwinJobActions
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function performBulkUpdate(
  token: string,
  iTwinId: string,
  actions: ITwinJobActions
): Promise<void> {
  // Create job
  const createResponse: BentleyAPIResponse<ITwinJob> =
    await client.itwinJobs.createITwinJob(token, iTwinId, actions);

  if (createResponse.error) {
    throw new Error(`Failed to create job: ${createResponse.error.message}`);
  }

  const jobId = createResponse.data.id;

  // Poll for completion
  let completed = false;
  while (!completed) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const statusResponse: BentleyAPIResponse<ITwinJob> =
      await client.itwinJobs.getITwinJob(token, iTwinId, jobId, "representation");

    if (statusResponse.error) {
      throw new Error(`Failed to get job status: ${statusResponse.error.message}`);
    }

    const job = statusResponse.data;

    // Use string literal comparison instead of enum
    if (job.status === "Completed") {
      completed = true;
    } else if (job.status === "Failed") {
      const errorDetails = job.error?.map(e => `${e.code}: ${e.message}`).join(', ');
      throw new Error(`Job failed: ${errorDetails}`);
    }
  }
}
```

### Example 5: Working with Groups and Group Members

```typescript
// v3.x
import {
  AccessControlClient,
  AccessControlAPIResponse,
  Group,
  GroupMember
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function setupProjectGroup(
  token: string,
  iTwinId: string,
  groupName: string,
  members: { groupId: string, roleId: string }[]
): Promise<Group> {
  // Create group
  const createResponse: AccessControlAPIResponse<Group> =
    await client.groups.createITwinGroupAsync(token, iTwinId, {
      name: groupName,
      description: "Project team group"
    });

  if (createResponse.error) {
    throw new Error(`Failed to create group: ${createResponse.error.message}`);
  }

  // Add group members - v3.x uses roleId (string)
  const addResponse: AccessControlAPIResponse<GroupMember[]> =
    await client.groupMembers.addITwinGroupMembersAsync(token, iTwinId, members);

  if (addResponse.error) {
    throw new Error(`Failed to add members: ${addResponse.error.message}`);
  }

  return createResponse.data!;
}

// v4.x
import { AccessControlClient } from '@itwin/access-control-client';
import type {
  BentleyAPIResponse,
  Group,
  GroupMember,
  SingleGroupResponse,
  AddGroupMembers
} from '@itwin/access-control-client';

const client = new AccessControlClient();

async function setupProjectGroup(
  token: string,
  iTwinId: string,
  groupName: string,
  members: { groupId: string, roleIds: string[] }[]  // v4.x uses roleIds (array)
): Promise<Group> {
  // Create group
  const createResponse: BentleyAPIResponse<SingleGroupResponse> =
    await client.groups.createITwinGroup(token, iTwinId, {
      name: groupName,
      description: "Project team group"
    });

  if (createResponse.error) {
    throw new Error(`Failed to create group: ${createResponse.error.message}`);
  }

  // Add group members - v4.x response is wrapped
  const addMembersRequest: AddGroupMembers = { groups: members };
  const addResponse: BentleyAPIResponse<GroupMember[]> =
    await client.groupMembers.addITwinGroupMembers(token, iTwinId, addMembersRequest);

  if (addResponse.error) {
    throw new Error(`Failed to add members: ${addResponse.error.message}`);
  }

  return createResponse.data.group;  // Access through wrapper property
}
```

## Best Practices for v4.x

1. **Always Use Type Imports**: Separate value and type imports for optimal tree-shaking
   ```typescript
   import { AccessControlClient } from '@itwin/access-control-client';
   import type { UserMember, Role, BentleyAPIResponse } from '@itwin/access-control-client';
   ```

2. **Direct String Comparisons**: Use string literals instead of enum values
   ```typescript
   if (invitation.status === "Pending") { }  // ✓ Good
   // Not: if (invitation.status === MemberInvitationStatus.Pending) { }  // ✗ v3.x only
   ```

3. **Access Response Data Through Wrappers**: Use descriptive property names
   ```typescript
   const members = response.data.userMembers;  // ✓ Clear and descriptive
   // Not: const members = response.data;  // ✗ v3.x pattern
   ```

4. **Handle Errors Consistently**: Use ApimError type
   ```typescript
   if (response.error) {
     const error: ApimError = response.error;
     console.error(error.message);
     error.details?.forEach(detail => console.error(detail.message));
   }
   ```

5. **Leverage HAL Links for Pagination**: Use _links for navigation
   ```typescript
   const response = await client.userMembers.queryITwinUserMembers(token, iTwinId, { top: 50 });
   const members = response.data.userMembers;
   const nextLink = response.data._links?.next?.href;

   if (nextLink) {
     // Can use next link for pagination
   }
   ```

6. **Type Annotations**: Be explicit with response types
   ```typescript
   const response: BentleyAPIResponse<MultipleUserMembersResponse> =
     await client.userMembers.queryITwinUserMembers(token, iTwinId);
   ```

## Additional Resources

- **Main Export File**: [`src/access-control-client.ts`](src/access-control-client.ts)
- **Main Client**: [`src/AccessControlClient.ts`](src/AccessControlClient.ts)
- **Type Definitions**: [`src/types/`](src/types/)
- **Client Interfaces**: [`src/accessControlClientInterfaces/`](src/accessControlClientInterfaces/)
- **Sub-Clients**: [`src/subClients/`](src/subClients/)
- **CHANGELOG**: [`CHANGELOG.md`](CHANGELOG.md)

## Summary

Version 4.0 of the Access Control Client represents a significant architectural improvement that brings:

- **Better TypeScript Support**: String unions, precise types, clear response structures
- **Smaller Bundles**: Tree-shakable exports and zero-runtime-cost types
- **Cleaner API**: Removed 'Async' suffix, simplified method signatures
- **Enhanced Developer Experience**: Self-documenting response structures, HAL-compliant pagination
- **New Capabilities**: iTwin Shares and Group Member Invitations clients

The migration requires updating method names, response handling, and type imports, but the improved type safety and developer experience make it worthwhile. All changes are mechanical and can be performed systematically using find-and-replace operations combined with TypeScript's type checking to ensure correctness.
