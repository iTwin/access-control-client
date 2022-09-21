# Access Control Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the __@itwin/access-control-client__ package that wraps sending requests to the access control service. Visit the [Access Control API](https://developer.bentley.com/apis/access-control/) for more documentation on the Access Control service.

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
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  const iTwinsResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.roles.getITwinRoleAsync(accessToken, "2f981e83-47e4-4f36-8ee9-4264453688a1", "2d593231-db14-4c1f-9db4-96f2b91b0bde");
    
   const actualRole = iTwinsResponse.data!;
   console.log(actualRole.id, actualRole.displayName);
}
```

### Create, update, and delete a Role
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Role, NewRole, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a role. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  // Create role
  const createResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.roles.createITwinRoleAsync(accessToken, "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7", "d8215a6b-465d-44ff-910b-40d4541d1ebf");
    
  // Update role
  const updatedRole: NewRole = {
    displayName: "Some new role name",
    description: "UPDATED ROLE DESCRIPTION" ,
    permissions: [],
  };
  const updateResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.roles.updateITwinRoleAsync(accessToken, "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7", createResponse.data!.id, updatedRole);
    
  // Delete Role
  const deleteResponse: AccessControlAPIResponse<undefined> =
    await accessControlClient.roles.deleteITwinRoleAsync(accessToken, "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7", createResponse.data!.id);
}
```

### Get list of Members for an iTwin
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Member, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that queries all Members for a given iTwin and prints their ids to the console. */
async function printiTwinMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  const iTwinsResponse: AccessControlAPIResponse<Member[]> =
    await accessControlClient.members.queryITwinMembersAsync(accessToken, "9bd7d24d-1508-4dba-99ab-23b3166401a0");
    
   iTwinsResponse.data!.forEach((actualMember: Member) => {
    console.log(actualMember.id);
  });
}
```

### Get a filtered list of Members for an iTwin using $top/$skip
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Member, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that queries all Members for a given iTwin and prints their ids to the console. */
async function printiTwinMemberIds(): Promise<void> {
  const skipAmmount = 5;
  const topAmount = 3;
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  const iTwinsResponse: AccessControlAPIResponse<Member[]> =
    await accessControlClient.members.queryITwinMembersAsync(accessToken, "9bd7d24d-1508-4dba-99ab-23b3166401a0", {skip: skipAmmount, top: topAmount});
    
   iTwinsResponse.data!.forEach((actualMember: Member) => {
    console.log(actualMember.id);
  });
}
```

### Get a specific Member of an iTwin
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Member, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that gets a member of an iTwin prints the id and email to the console. */
async function printiTwinMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  const iTwinsResponse: AccessControlAPIResponse<Member> =
    await accessControlClient.members.getITwinMemberAsync(accessToken, "9bd7d24d-1508-4dba-99ab-23b3166401a0", "a083cc1c-f51a-4c52-8614-5774ab79eca1");
  
  const actualMember = iTwinsResponse.data!;
  console.log(actualMember.id, actualMember.email);
}
```

### Create, update, and delete a Member
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Member, NewMember, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a member. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  // Create member
  const createResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.members.addITwinMembersAsync(accessToken, "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7", "d8215a6b-465d-44ff-910b-40d4541d1ebf");
    
  // Update member's role
  const updatedMemberResponse: AccessControlAPIResponse<Member> =
    await accessControlClient.members.updateITwinMemberAsync(accessToken, "b1803a0c-d440-4902-b527-54bf7f72500f", "6401109c-75d7-46b8-8dbd-182d02155141", ["25162c0c-dce7-419e-bb51-fd13efd5b54a",  "10e3d778-0d35-4c4d-bf77-547bb366cb14"]);
    
  // Delete member
  const removeMemberResponse: AccessControlAPIResponse<undefined> =
    await accessControlClient.members.removeITwinMemberAsync(accessToken, "b1803a0c-d440-4902-b527-54bf7f72500f", "6401109c-75d7-46b8-8dbd-182d02155141");
}
```

### Get a list of Permissions
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Permission, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that queries all Permissions and prints the ids to the console. */
async function printiTwinPermissionIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  const iTwinsResponse: AccessControlAPIResponse<Permission[]> =
    await accessControlClient.permissions.getPermissionsAsync(accessToken);
    
   iTwinsResponse.data!.forEach((actualPermission: Permission) => {
    console.log(actualPermission.id);
  });
}
```

### Get a list of Permissions for an iTwin
```typescript
import type { AccessToken } from "@itwin/core-bentley";
import { AccessControlClient, IAccessControlClient, Permission, AccessControlAPIResponse } from "@itwin/access-control-client";

/** Function that queries Permissions for a given iTwin and prints the ids to the console. */
async function printiTwinPermissionIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };
  
  const iTwinsResponse: AccessControlAPIResponse<Permission[]> =
    await accessControlClient.permissions.getITwinPermissionsAsync(accessToken, "6c704296-9028-4a1e-ae67-c0104a11402a");
    
   iTwinsResponse.data!.forEach((actualPermission: Permission) => {
    console.log(actualPermission.id);
  });
}
```

## Contributing to this Repository

For information on how to contribute to this project, please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines, [GETTINGSTARTED.md](GETTINGSTARTED.md) for information on working with the documentation in this repository.
