# Access Control Client Library

[![npm version](https://badge.fury.io/js/@itwin%2Faccess-control-client.svg)](https://badge.fury.io/js/@itwin%2Faccess-control-client)

A comprehensive TypeScript library for Bentley Systems' Access Control API, providing type-safe access to iTwin access management, roles, permissions, groups, and member operations.

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Documentation](#documentation)
- [API Reference](#api-reference)
- [About this Repository](#about-this-repository)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

Get up and running with Access Control Client in just a few steps:

```bash
npm install @itwin/access-control-client
```

```typescript
import { AccessControlClient } from "@itwin/access-control-client";

const client = new AccessControlClient();
const accessToken = "your-access-token-string";
const roles = await client.roles.getITwinRoles(accessToken, "itwin-id");
console.log(`Found ${roles.data!.length} roles`);
```

## Installation

```bash
# Using npm
npm install @itwin/access-control-client

# Using yarn
yarn add @itwin/access-control-client

# Using pnpm
pnpm add @itwin/access-control-client
```

## Basic Usage

### Authentication

All API methods require an access token string. See the [iTwin Platform documentation](https://developer.bentley.com/tutorials/create-and-query-itwins-guide/#1-register-an-application) for authentication setup.

### Environment Configuration

Configure different deployment environments using `globalThis.IMJS_URL_PREFIX`:

```typescript
// Development environment
globalThis.IMJS_URL_PREFIX = "dev-";

// QA environment
globalThis.IMJS_URL_PREFIX = "qa-";

// Production (default)
globalThis.IMJS_URL_PREFIX = undefined;
```

## Documentation

### Core Documentation

| Document | Purpose |
|----------|---------|
| **[Getting Started Guide](./GETTINGSTARTED.md)** | Complete setup and first steps |
| **[Migration Guide v3→v4](./MIGRATION-GUIDE-v3-to-v4.md)** | Upgrading from v3.x to v4.x |
| **[Contributing Guide](./CONTRIBUTING.md)** | Development and contribution workflow |

## API Reference

### Core Classes

- **`AccessControlClient`** - Main client for all access control operations
- **`IAccessControlClient`** - Interface defining the client API surface

### Sub-Clients

The `AccessControlClient` exposes the following specialized sub-clients:

#### Access Management

- **`permissions`** - Query permissions across the platform and iTwins
- **`roles`** - Manage iTwin roles (CRUD operations)

#### Group Management

- **`groups`** - Manage iTwin groups (CRUD operations)
- **`groupMembers`** - Manage members within groups
- **`groupMemberInvitations`** - Handle group member invitation lifecycle

#### User Management

- **`userMembers`** - Manage individual user members of iTwins
- **`ownerMembers`** - Manage iTwin owner memberships
- **`memberInvitations`** - Handle member invitation lifecycle

#### Advanced Operations

- **`itwinJobs`** - Bulk operations for member management
- **`itwinShares`** - Manage iTwin sharing and access tokens

### Key Features

- ✅ **Complete CRUD operations** for roles, groups, and members
- ✅ **Bulk operations** via iTwin Jobs
- ✅ **Invitation management** for users and groups
- ✅ **Sharing capabilities** for controlled iTwin access
- ✅ **Type-safe API** with full TypeScript support

### Quick Reference

```typescript
import { AccessControlClient } from "@itwin/access-control-client";
import type {
  BentleyAPIResponse,
  Role,
  MultipleUserMembersResponse
} from "@itwin/access-control-client";

const client = new AccessControlClient();
const accessToken = "your-access-token-string";
const iTwinId = "your-itwin-id";

// Get roles
const roles = await client.roles.getITwinRoles(accessToken, iTwinId);

// Create a role
const newRole = await client.roles.createITwinRole(accessToken, iTwinId, {
  displayName: "Project Manager",
  description: "Role for project management"
});

// Query user members
const members = await client.userMembers.queryITwinUserMembers(
  accessToken,
  iTwinId,
  { top: 10 }
);

// Add user members
const addedMembers = await client.userMembers.addITwinUserMembers(
  accessToken,
  iTwinId,
  [{
    email: "user@example.com",
    roleIds: ["role-id"]
  }],
  "Welcome message"
);
```

## About this Repository

The **@itwin/access-control-client** package provides a modern, type-safe interface to Bentley Systems' Access Control API. It manages iTwin access permissions, roles, groups, members, invitations, and sharing capabilities.

For more information about the iTwin platform and APIs, visit:

- [iTwin Developer Portal](https://developer.bentley.com/)
- [Access Control API Documentation](https://developer.bentley.com/apis/access-control/)
- [iTwin.js Platform](http://www.itwinjs.org)

## Development

### Prerequisites

- Node.js 16+ and pnpm
- TypeScript 4.5+
- Valid iTwin Platform credentials

### Building from Source

```bash
git clone https://github.com/iTwin/access-control-client.git
cd access-control-client
pnpm install
pnpm build
```

### Running Tests

.env file setup is required for tests. View [Getting Started](./GETTINGSTARTED.md) for more information.

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run linting
pnpm lint
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- How to submit issues and feature requests
- Development workflow and coding standards
- Pull request process and review guidelines
- Testing requirements and conventions
- How to use changesets for versioning

### Versioning

This project uses [Changesets](https://github.com/changesets/changesets) for version management. For more information view [Contributing Guide](./CONTRIBUTING.md).

## License

Copyright © Bentley Systems, Incorporated. All rights reserved.

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.

---
