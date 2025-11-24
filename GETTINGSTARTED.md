# Getting Started with Access Control Client

This guide will help you get up and running with the Access Control Client library, from installation through your first API calls.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Authentication Setup](#authentication-setup)
- [Your First API Call](#your-first-api-call)
- [Environment Configuration](#environment-configuration)
- [Development Setup](#development-setup)
- [Testing Setup](#testing-setup)
- [Next Steps](#next-steps)

## Prerequisites

Before getting started, ensure you have:

- **Node.js 16+** and a package manager (npm, yarn, or pnpm)
- **TypeScript 4.5+** (if using TypeScript)
- **Valid iTwin Platform credentials** - see [iTwin Developer Portal](https://developer.bentley.com/tutorials/create-and-query-itwins-guide/#1-register-an-application)

## Installation

Install the Access Control Client:

```bash
# Using npm
npm install @itwin/access-control-client

# Using yarn
yarn add @itwin/access-control-client

# Using pnpm
pnpm add @itwin/access-control-client
```

## Authentication Setup

The Access Control Client requires an access token string. You'll need to set up authentication with the iTwin Platform:

1. **Register your application** at the [iTwin Developer Portal](https://developer.bentley.com/tutorials/create-and-query-itwins-guide/#1-register-an-application)
2. **Get your client credentials** (client ID, client secret, redirect URIs)
3. **Implement authentication flow** using one of the iTwin.js authentication packages

### Basic Authentication Example

```typescript
import { TestUsers, TestUtility } from "@itwin/oidc-signin-tool";
import type { AccessToken } from "@itwin/core-bentley";

// For testing/development - use appropriate auth for production
const userCredentials = {
  email: "your-test-email@example.com",
  password: "your-password",
};

const accessToken: AccessToken = await TestUtility.getAccessToken(TestUsers.super || userCredentials);
```

## Your First API Call

Once you have authentication set up, making your first API call is straightforward:

```typescript
import { AccessControlClient } from "@itwin/access-control-client";
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, Role } from "@itwin/access-control-client";

async function getMyRoles(): Promise<void> {
  // Initialize the client
  const client = new AccessControlClient();

  // Get your access token (implementation depends on your auth setup)
  const accessToken: AccessToken = await getAccessToken(); // Your auth implementation

  // Make your first API call
  const response: BentleyAPIResponse<Role[]> =
    await client.roles.getITwinRoles(
      accessToken,
      "your-itwin-id"
    );

  // Check for errors
  if (response.error) {
    console.error("API Error:", response.error.message);
    return;
  }

  // Success! Use the data
  const roles = response.data!;
  console.log(`Found ${roles.length} roles:`);

  roles.forEach(role => {
    console.log(`- ${role.displayName} (${role.id})`);
  });
}

// Run your first query
getMyRoles().catch(console.error);
```

## Environment Configuration

The Access Control Client supports different deployment environments (development, QA, production):

### Using Global Configuration

```typescript
// Development environment
globalThis.IMJS_URL_PREFIX = "dev-";

// QA environment
globalThis.IMJS_URL_PREFIX = "qa-";

// Production (default)
globalThis.IMJS_URL_PREFIX = undefined;

// Now all client instances will use the configured environment
const client = new AccessControlClient();
```

### Using Custom URLs

```typescript
// Custom base URL for specific deployments
const client = new AccessControlClient(
  "https://your-custom-api.bentley.com/accesscontrol/itwins"
);
```

### Environment Variables (Node.js)

```typescript
// Bridge from process.env in Node.js applications
globalThis.IMJS_URL_PREFIX = process.env.IMJS_URL_PREFIX;
```

## Development Setup

If you're contributing to the Access Control Client or building from source:

### Clone and Build

```bash
git clone https://github.com/iTwin/access-control-client.git
cd access-control-client
pnpm install
pnpm build
```

### Development Commands

```bash
# Build the library
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run linting
pnpm lint

# Type checking
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## Testing Setup

For integration testing, you'll need to configure test credentials and environments.

### Environment File Setup For Bentley Developers

```bash
az login  # Authenticate with Azure CLI

./setup-env.ps1 # Set up .env file with required variables
```

### Environment File Setup For Non-Bentley Developers

Create a `.env` file in the root directory with the following variables:

```bash
# Environment Configuration
IMJS_URL_PREFIX=""                    # Leave empty for production
IMJS_AUTH_AUTHORITY="https://ims.bentley.com"

# OIDC Configuration (required for authentication)
IMJS_OIDC_BROWSER_TEST_CLIENT_ID="spa-your-client-id-here"
IMJS_OIDC_BROWSER_TEST_REDIRECT_URI="http://localhost:3000/signin-callback"
IMJS_OIDC_BROWSER_TEST_SCOPES="itwin-platform"
IMJS_OIDC_AUTHING_BROWSER_TEST_AUTHORITY="https://ims.bentley.com"
IMJS_OIDC_AUTHING_BROWSER_TEST_SCOPES="itwin-platform"

# Test User Authentication (for testing only)
IMJS_TEST_REGULAR_USER_NAME="your-test-email@example.com"
IMJS_TEST_REGULAR_USER_PASSWORD="your-test-password"
IMJS_TEST_REGULAR_USER_ID="your-user-id"

# Test Data (required for integration tests)
IMJS_TEST_ITWIN_ID="your-test-itwin-id"
IMJS_TEST_QA_ACCOUNT="your-test-account-id"
IMJS_TEST_PROJECT_ID="your-test-project-itwin-id"
IMJS_TEST_ASSET_ID="your-test-asset-itwin-id"
IMJS_TEST_IMODEL_ID="your-test-imodel-id"

# Test Roles (required for role tests)
IMJS_TEST_PERMANENT_ROLE_ID1="permanent-role-id-1"
IMJS_TEST_PERMANENT_ROLE_NAME1="Permanent Role Name 1"
IMJS_TEST_PERMANENT_ROLE_ID2="permanent-role-id-2"
IMJS_TEST_PERMANENT_ROLE_NAME2="Permanent Role Name 2"

# Test Groups (required for group tests)
IMJS_TEST_PERMANENT_GROUP_ID1="permanent-group-id-1"
IMJS_TEST_PERMANENT_GROUP_NAME1="Permanent Group Name 1"
IMJS_TEST_PERMANENT_GROUP_ID2="permanent-group-id-2"
IMJS_TEST_PERMANENT_GROUP_NAME2="Permanent Group Name 2"
IMJS_TEST_PERMANENT_IMSGROUP_NAME="permanent-ims-group-name"

# Test Users (for member management tests)
IMJS_TEST_TEMP_USER_EMAIL="temp-test-user@example.com"
IMJS_TEST_TEMP_USER_ID="temp-user-id"
IMJS_TEST_REGULAR_USER_EMAIL="regular-test-user@example.com"
IMJS_TEST_REGULAR_USER_ID="regular-user-id"
IMJS_TEST_MANAGER_USER_EMAIL="manager-test-user@example.com"
```

### Test User Requirements

Your test user must have appropriate permissions:

- **Project Administrator** or **iTwin Owner** role on test iTwins
- **Connect Services Admin** role for creating iTwins (if testing CRUD operations)
- Access to both **Project** and **Asset** level iTwins for comprehensive testing

### Running Tests

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run integration tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

## Next Steps

Now that you have the basics working, explore these areas:

### Documentation

- **[Migration Guide](./MIGRATION-GUIDE-v3-to-v4.md)** - If upgrading from v3.x

### Learn More

Explore the different sub-clients:

- **Permissions** - Query available permissions
- **Roles** - Create and manage custom roles
- **Groups** - Organize users into groups
- **User Members** - Manage individual user access
- **Group Members** - Manage group-based access
- **Owner Members** - Manage iTwin ownership
- **Invitations** - Handle member and group invitations
- **iTwin Jobs** - Perform bulk member operations
- **iTwin Shares** - Create and manage access sharing

### Additional Resources

- [iTwin Developer Portal](https://developer.bentley.com/) - Platform documentation
- [Access Control API Reference](https://developer.bentley.com/apis/access-control/) - REST API details
- [iTwin.js Platform](https://www.itwinjs.org/) - Complete iTwin ecosystem
- [GitHub Repository](https://github.com/iTwin/access-control-client) - Source code and issues

---

## Troubleshooting

### Common Issues

#### Authentication Errors (401)

- Verify your access token is valid and not expired
- Check that your application has the correct scopes
- Ensure you're using the right environment (dev/qa/prod)

#### Not Found Errors (404)

- Verify iTwin IDs are correct and accessible to your user
- Check that you have permissions to access the requested resources
- Ensure you're targeting the correct environment

#### Forbidden Errors (403)

- Verify your user has the required roles (e.g., Project Administrator)
- Check that the iTwin exists and you have access to it
- Some operations require specific platform roles

#### Validation Errors (422)

- Review the `error.details` array for specific validation failures
- Check required fields and data types in your requests
- Verify enum values match the expected API constants

#### Network/Timeout Issues

- Check your internet connection and firewall settings
- Verify the API endpoint URLs are accessible
- Consider implementing retry logic for transient failures

### Getting Help

- **Check the [GitHub Issues](https://github.com/iTwin/access-control-client/issues)** for known problems
- **See the [Contributing Guide](./CONTRIBUTING.md)** for support resources
- **Visit the [iTwin Developer Portal](https://developer.bentley.com/)** for platform support

---
