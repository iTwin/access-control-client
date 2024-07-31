# Access Control Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the **@itwin/access-control-client** package that wraps sending requests to the access control service. Visit the [Access Control API](https://developer.bentley.com/apis/access-control/) for more documentation on the Access Control service.

## Usage examples

### Get list of Roles for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Role,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Roles for a given iTwin and prints their ids to the console. */
async function printiTwinRoleIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<Role[]> =
    await accessControlClient.roles.getITwinRolesAsync(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1"
    );

  iTwinsResponse.data!.forEach((actualRole: Role) => {
    console.log(actualRole.id);
  });
}
```

### Get list of Roles for an iTwin (with custom url)

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Role,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Roles for a given iTwin and prints their ids to the console. */
async function printiTwinRoleIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient(
    "https://api.bentley.com/accesscontrol/itwins"
  );
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<Role[]> =
    await accessControlClient.roles.getITwinRolesAsync(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1"
    );

  iTwinsResponse.data!.forEach((actualRole: Role) => {
    console.log(actualRole.id);
  });
}
```

### Get specific role for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Role,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets a specific role for an iTwin and then prints the id and displayName to the console. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.roles.getITwinRoleAsync(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "2d593231-db14-4c1f-9db4-96f2b91b0bde"
    );

  const actualRole = iTwinsResponse.data!;
  console.log(actualRole.id, actualRole.displayName);
}
```

### Create, update, and delete a Role

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Role,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a role. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create role
  const createResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.roles.createITwinRoleAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf"
    );

  // Update role
  const updatedRole: Role = {
    displayName: "Some new role name",
    description: "UPDATED ROLE DESCRIPTION",
    permissions: [],
  };
  const updateResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.roles.updateITwinRoleAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      createResponse.data!.id,
      updatedRole
    );

  // Delete Role
  const deleteResponse: AccessControlAPIResponse<undefined> =
    await accessControlClient.roles.deleteITwinRoleAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      createResponse.data!.id
    );
}
```

### Get list of User Members for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Member,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all User Members for a given iTwin and prints their ids to the console. */
async function printiTwinUserMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<UserMember[]> =
    await accessControlClient.userMembers.queryITwinUserMembersAsync(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0"
    );

  iTwinsResponse.data!.forEach((actualUserMember: UserMember) => {
    console.log(actualUserMember.id);
  });
}
```

### Get a filtered list of User Members for an iTwin using $top/$skip

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Member,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all User Members for a given iTwin and prints their ids to the console. */
async function printiTwinUserMemberIds(): Promise<void> {
  const skipAmmount = 5;
  const topAmount = 3;
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<UserMember[]> =
    await accessControlClient.userMembers.queryITwinUserMembersAsync(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0",
      { skip: skipAmmount, top: topAmount }
    );

  iTwinsResponse.data!.forEach((actualUserMember: UserMember) => {
    console.log(actualUserMember.id);
  });
}
```

### Get a specific User Member of an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Member,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets a member of an iTwin prints the id and email to the console. */
async function printiTwinUserMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<UserMember> =
    await accessControlClient.userMembers.getITwinUserMemberAsync(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0",
      "a083cc1c-f51a-4c52-8614-5774ab79eca1"
    );

  const actualUserMember = iTwinsResponse.data!;
  console.log(actualUserMember.id, actualUserMember.email);
}
```

### Create, update, and delete an User Member

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Member,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a user member. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create user member
  const createResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.userMembers.addITwinUserMembersAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf"
    );

  // Update user member's role
  const updatedUserMemberResponse: AccessControlAPIResponse<UserMember> =
    await accessControlClient.userMembers.updateITwinUserMemberAsync(
      accessToken,
      "b1803a0c-d440-4902-b527-54bf7f72500f",
      "6401109c-75d7-46b8-8dbd-182d02155141",
      [
        "25162c0c-dce7-419e-bb51-fd13efd5b54a",
        "10e3d778-0d35-4c4d-bf77-547bb366cb14",
      ]
    );

  // Delete user member
  const removeUserMemberResponse: AccessControlAPIResponse<undefined> =
    await accessControlClient.userMembers.removeITwinUserMemberAsync(
      accessToken,
      "b1803a0c-d440-4902-b527-54bf7f72500f",
      "6401109c-75d7-46b8-8dbd-182d02155141"
    );
}
```

### Get list of Owner Members for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  OwnerMember,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Owner Members for a given iTwin and prints their ids to the console. */
async function printiTwinOwnerMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
    await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0"
    );

  iTwinsResponse.data!.forEach((actualOwnerMember: OwnerMember) => {
    console.log(actualOwnerMember.id);
  });
}
```

### Create, and delete an Owner Member

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  OwnerMember,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, and deletes an owner member. */
async function createAndRemoveOwnerMember(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create owner member
  const createOwnerMemberResponse: AccessControlAPIResponse<OwnerMember> =
    await accessControlClient.ownerMembers.addITwinOwnerMemberAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      {
        email: "test.user@bentley.com",
      }
    );

  // Delete owner member
  const removeOwnerMemberResponse: AccessControlAPIResponse<undefined> =
    await accessControlClient.ownerMembers.removeITwinOwnerMemberAsync(
      accessToken,
      "b1803a0c-d440-4902-b527-54bf7f72500f",
      "6401109c-75d7-46b8-8dbd-182d02155141"
    );
}
```

### Get list of Groups for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Group,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Groups for a given iTwin and prints their ids to the console. */
async function printiTwinGroupIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<Group[]> =
    await accessControlClient.groups.getITwinGroupsAsync(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1"
    );

  iTwinsResponse.data!.forEach((actualGroup: Group) => {
    console.log(actualGroup.id);
  });
}
```

### Get list of Groups for an iTwin (with custom url)

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Group,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Groups for a given iTwin and prints their ids to the console. */
async function printiTwinGroupIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient(
    "https://api.bentley.com/accesscontrol/itwins"
  );
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<Group[]> =
    await accessControlClient.groups.getITwinGroupsAsync(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1"
    );

  iTwinsResponse.data!.forEach((actualGroup: Group) => {
    console.log(actualGroup.id);
  });
}
```

### Get specific Group for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Group,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets a specific role for an iTwin and then prints the id and displayName to the console. */
async function printiTwinGroup(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<Group> =
    await accessControlClient.groups.getITwinGroupAsync(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "2d593231-db14-4c1f-9db4-96f2b91b0bde"
    );

  const actualGroup = iTwinsResponse.data!;
  console.log(actualGroup.id, actualGroup.displayName);
}
```

### Create, update, and delete a Group

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Group,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a role. */
async function printiTwinGroup(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create role
  const createResponse: AccessControlAPIResponse<Group> =
    await accessControlClient.groups.createITwinGroupAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf"
    );

  // Update role
  const updatedGroup: Group = {
    name: "Some new group name",
    description: "UPDATED GROUP DESCRIPTION",
    user: ["John.Johnson@example.com"],
    imsGroups: ["Sample IMS Group"],
  };
  const updateResponse: AccessControlAPIResponse<Group> =
    await accessControlClient.groups.updateITwinGroupAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      createResponse.data!.id,
      updatedGroup
    );

  // Delete Group
  const deleteResponse: AccessControlAPIResponse<undefined> =
    await accessControlClient.groups.deleteITwinGRoupAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      createResponse.data!.id
    );
}
```

### Get list of Group Members for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Member,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all User Members for a given iTwin and prints their ids to the console. */
async function printiTwinGroupMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<GroupMember[]> =
    await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0"
    );

  iTwinsResponse.data!.forEach((actualGroupMember: GroupMember) => {
    console.log(actualGroupMember.id);
  });
}
```

### Get a filtered list of Group Members for an iTwin using $top/$skip

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Member,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all User Members for a given iTwin and prints their ids to the console. */
async function printiTwinGroupMemberIds(): Promise<void> {
  const skipAmmount = 5;
  const topAmount = 3;
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<GroupMember[]> =
    await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0",
      { skip: skipAmmount, top: topAmount }
    );

  iTwinsResponse.data!.forEach((actualGroupMember: GroupMember) => {
    console.log(actualGroupMember.id);
  });
}
```

### Get a specific Group Member of an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Member,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets a member of an iTwin prints the id and email to the console. */
async function printiTwinGroupMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<GroupMember> =
    await accessControlClient.groupMembers.getITwinGroupMemberAsync(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0",
      "a083cc1c-f51a-4c52-8614-5774ab79eca1"
    );

  const actualGroupMember = iTwinsResponse.data!;
  console.log(actualGroupMember.id, actualGroupMember.email);
}
```

### Create, update, and delete a Group Member

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Member,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a user member. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create user member
  const createResponse: AccessControlAPIResponse<Role> =
    await accessControlClient.groupMembers.addITwinGroupMembersAsync(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf"
    );

  // Update user member's role
  const updatedGroupMemberResponse: AccessControlAPIResponse<GroupMember> =
    await accessControlClient.groupMembers.updateITwinGroupMemberAsync(
      accessToken,
      "b1803a0c-d440-4902-b527-54bf7f72500f",
      "6401109c-75d7-46b8-8dbd-182d02155141",
      [
        "25162c0c-dce7-419e-bb51-fd13efd5b54a",
        "10e3d778-0d35-4c4d-bf77-547bb366cb14",
      ]
    );

  // Delete user member
  const removeGroupMemberResponse: AccessControlAPIResponse<undefined> =
    await accessControlClient.groupMembers.removeITwinGroupMemberAsync(
      accessToken,
      "b1803a0c-d440-4902-b527-54bf7f72500f",
      "6401109c-75d7-46b8-8dbd-182d02155141"
    );
}
```

### Get a list of Permissions

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Permission,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

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
import {
  AccessControlClient,
  IAccessControlClient,
  Permission,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries Permissions for a given iTwin and prints the ids to the console. */
async function printiTwinPermissionIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: AccessControlAPIResponse<Permission[]> =
    await accessControlClient.permissions.getITwinPermissionsAsync(
      accessToken,
      "6c704296-9028-4a1e-ae67-c0104a11402a"
    );

  iTwinsResponse.data!.forEach((actualPermission: Permission) => {
    console.log(actualPermission.id);
  });
}
```

### Create and get iTwin job and related actions

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  ITwinJob,
  ITwinJobActions,
  AccessControlAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a user member. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const itwinJobActions = {
    assignRoles: [
      {
        email: "John.Johnson@example.com",
        roleIds: ["65819672-962d-4386-8667-136125bcb7b2"],
      },
    ],
    unassignRoles: [
      {
        email: "Maria.Miller@example.com",
        roleIds: ["d6a62e34-5016-4bac-a9a0-a6522583698e"],
      },
    ],
    removeMembers: [
      {
        email: "Jobby.McJobface@example.com",
      },
    ],
  };

  // Create iTwin job
  const createResponse: AccessControlAPIResponse<ITwinJob> =
    await accessControlClient.itwinJobs.createITwinJobAsync(
      accessToken,
      "d7d82799-3f0c-4175-acbe-cc2573e99359",
      itwinJobActions
    );

  // Get the created iTwin job
  const getiTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
    await accessControlClient.itwinJobs.getITwinJobAsync(
      accessToken,
      "d7d82799-3f0c-4175-acbe-cc2573e99359",
      createResponse.data.id
    );

  // Get the created iTwin job with errors
  const getiTwinJobResponseWithErrors: AccessControlAPIResponse<ITwinJob> =
    await accessControlClient.itwinJobs.getITwinJobAsync(
      accessToken,
      "d7d82799-3f0c-4175-acbe-cc2573e99359",
      createResponse.data.id,
      "representation"
    );

  // Get the created iTwin job's actions
  const getiTwinJobActionaResponse: AccessControlAPIResponse<ITwinJobActions> =
    await accessControlClient.itwinJobs.getITwinJobActionsAsync(
      accessToken,
      "d7d82799-3f0c-4175-acbe-cc2573e99359",
      createResponse.data.id
    );
}
```

## Contributing to this Repository

For information on how to contribute to this project, please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines, [GETTINGSTARTED.md](GETTINGSTARTED.md) for information on working with the documentation in this repository.
