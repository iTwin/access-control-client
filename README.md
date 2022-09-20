# Access Control Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the __@itwin/access-control-client__ package that wraps sending requests to the access control service. Visit the [iTwins API](https://developer.bentley.com/apis/access-control/) for more documentation on the iTwins service.

## Usage examples

### Get list of Roles for an iTwin
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Role, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that queries all Roles for a given iTwin and prints their ids to the console. */
async function printiTwinRoleIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  const iTwinsResponse: AccessControlAPIResponse<Role[]> =
    await accessControlClient.roles.getITwinRolesAsync(accessToken, "2f981e83-47e4-4f36-8ee9-4264453688a1");
    
   iTwinsResponse.data!.forEach((actualRole: Role) => {
    console.log(actualRole.id);
  });
}
```

### Get specific role for an iTwin
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Role, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that gets a specific role for an iTwin and then prints the id and displayName to the console. */
async function printiTwinRoleIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  const iTwinsResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.roles.getITwinRoleAsync(accessToken, "2f981e83-47e4-4f36-8ee9-4264453688a1", "2d593231-db14-4c1f-9db4-96f2b91b0bde");
    
   const actualRole = iTwinsResponse.data!;
   console.log(actualRole.id, actualRole.displayName);
}
```

## Contributing to this Repository

For information on how to contribute to this project, please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines, [GETTINGSTARTED.md](GETTINGSTARTED.md) for information on working with the documentation in this repository.
