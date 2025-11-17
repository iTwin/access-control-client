# Access Control Client Library

Copyright © Bentley Systems, Incorporated. All rights reserved. See [LICENSE.md](./LICENSE.md) for license terms and full copyright notice.

[iTwin.js](http://www.itwinjs.org) is an open source platform for creating, querying, modifying, and displaying Infrastructure Digital Twins. To learn more about the iTwin Platform and its APIs, visit the [iTwin developer portal](https://developer.bentley.com/).

If you have questions, or wish to contribute to iTwin.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

Contains the **@itwin/access-control-client** package that wraps sending requests to the access control service. Visit the [Access Control API](https://developer.bentley.com/apis/access-control/) for more documentation on the Access Control service.

## Migration from v3.x

If you're upgrading from v3.x, please see the [Migration Guide](./MIGRATION-GUIDE-v3-to-v4.md) for detailed information about breaking changes and how to update your code.

## Usage examples

### Get list of Roles for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  Role,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Roles for a given iTwin and prints their ids to the console. */
async function printiTwinRoleIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<Role[]> =
    await accessControlClient.roles.getITwinRoles(
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
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Roles for a given iTwin and prints their ids to the console. */
async function printiTwinRoleIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient(
    "https://api.bentley.com/accesscontrol/itwins"
  );
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<Role[]> =
    await accessControlClient.roles.getITwinRoles(
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
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets a specific role for an iTwin and then prints the id and displayName to the console. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<Role> =
    await accessControlClient.roles.getITwinRole(
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
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a role. */
async function printiTwinRole(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create role
  const createResponse: BentleyAPIResponse<Pick<Role, "id" | "displayName" | "description">> =
    await accessControlClient.roles.createITwinRole(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      {
        displayName: "Project Manager",
        description: "Role for project management"
      }
    );

  // Update role
  const updateResponse: BentleyAPIResponse<Role> =
    await accessControlClient.roles.updateITwinRole(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      createResponse.data!.id,
      {
        displayName: "Updated Project Manager",
        description: "UPDATED ROLE DESCRIPTION"
      }
    );

  // Delete Role
  const deleteResponse: BentleyAPIResponse<undefined> =
    await accessControlClient.roles.deleteITwinRole(
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
  MultipleUserMembersResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all User Members for a given iTwin and prints their ids to the console. */
async function printiTwinUserMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleUserMembersResponse> =
    await accessControlClient.userMembers.queryITwinUserMembers(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0"
    );

  iTwinsResponse.data!.userMembers!.forEach((actualUserMember) => {
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
  MultipleUserMembersResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all User Members for a given iTwin and prints their ids to the console. */
async function printiTwinUserMemberIds(): Promise<void> {
  const skipAmount = 5;
  const topAmount = 3;
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleUserMembersResponse> =
    await accessControlClient.userMembers.queryITwinUserMembers(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0",
      { skip: skipAmount, top: topAmount }
    );

  iTwinsResponse.data!.userMembers!.forEach((actualUserMember) => {
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
  SingleUserMemberResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets a member of an iTwin prints the id and email to the console. */
async function printiTwinUserMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<SingleUserMemberResponse> =
    await accessControlClient.userMembers.getITwinUserMember(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0",
      "a083cc1c-f51a-4c52-8614-5774ab79eca1"
    );

  const actualUserMember = iTwinsResponse.data!.userMember!;
  console.log(actualUserMember.id, actualUserMember.email);
}
```

### Create, update, and delete an User Member

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  AddUserMemberResponse,
  SingleUserMemberResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a user member. */
async function manageUserMember(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create user member
  const createResponse: BentleyAPIResponse<AddUserMemberResponse> =
    await accessControlClient.userMembers.addITwinUserMembers(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      [
        {
          email: "user@example.com",
          roleIds: ["d8215a6b-465d-44ff-910b-40d4541d1ebf"],
        },
      ],
      "Example custom message"
    );

  // Update user member's role
  const updatedUserMemberResponse: BentleyAPIResponse<SingleUserMemberResponse> =
    await accessControlClient.userMembers.updateITwinUserMember(
      accessToken,
      "b1803a0c-d440-4902-b527-54bf7f72500f",
      "6401109c-75d7-46b8-8dbd-182d02155141",
      [
        "25162c0c-dce7-419e-bb51-fd13efd5b54a",
        "10e3d778-0d35-4c4d-bf77-547bb366cb14",
      ]
    );

  // Delete user member
  const removeUserMemberResponse: BentleyAPIResponse<undefined> =
    await accessControlClient.userMembers.removeITwinUserMember(
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
  OwnerMemberMultiResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Owner Members for a given iTwin and prints their ids to the console. */
async function printiTwinOwnerMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<OwnerMemberMultiResponse> =
    await accessControlClient.ownerMembers.queryITwinOwnerMembers(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0"
    );

  iTwinsResponse.data!.members!.forEach((actualOwnerMember) => {
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
  AddOwnerMemberResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, and deletes an owner member. */
async function createAndRemoveOwnerMember(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create owner member
  const createOwnerMemberResponse: BentleyAPIResponse<AddOwnerMemberResponse> =
    await accessControlClient.ownerMembers.addITwinOwnerMember(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      {
        email: "test.user@bentley.com",
      }
    );

  // Delete owner member
  const removeOwnerMemberResponse: BentleyAPIResponse<undefined> =
    await accessControlClient.ownerMembers.removeITwinOwnerMember(
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
  MultipleGroupsResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Groups for a given iTwin and prints their ids to the console. */
async function printiTwinGroupIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleGroupsResponse> =
    await accessControlClient.groups.getITwinGroups(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1"
    );

  iTwinsResponse.data!.groups!.forEach((actualGroup) => {
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
  MultipleGroupsResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Groups for a given iTwin and prints their ids to the console. */
async function printiTwinGroupIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient(
    "https://api.bentley.com/accesscontrol/itwins"
  );
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleGroupsResponse> =
    await accessControlClient.groups.getITwinGroups(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1"
    );

  iTwinsResponse.data!.groups!.forEach((actualGroup) => {
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
  SingleGroupResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets a specific role for an iTwin and then prints the id and displayName to the console. */
async function printiTwinGroup(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<SingleGroupResponse> =
    await accessControlClient.groups.getITwinGroup(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "2d593231-db14-4c1f-9db4-96f2b91b0bde"
    );

  const actualGroup = iTwinsResponse.data!.group!;
  console.log(actualGroup.id, actualGroup.displayName);
}
```

### Create, update, and delete a Group

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  CreateGroup,
  UpdateGroup,
  SingleGroupResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a group. */
async function printiTwinGroup(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create group
  const createGroupEntity: CreateGroup = {
    displayName: "TestGroup",
    description: "Test group description",
  };

  const createResponse: BentleyAPIResponse<SingleGroupResponse> =
    await accessControlClient.groups.createITwinGroup(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      createGroupEntity
    );

  // Update group
  const updateGroupEntity: UpdateGroup = {
    displayName: "TestGroupUpdated",
    description: "Updated test group description",
  };

  const updateResponse: BentleyAPIResponse<SingleGroupResponse> =
    await accessControlClient.groups.updateITwinGroup(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      createResponse.data!.group!.id!,
      updateGroupEntity
    );

  // Delete Group
  const deleteResponse: BentleyAPIResponse<undefined> =
    await accessControlClient.groups.deleteITwinGroup(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      createResponse.data!.group!.id!
    );
}
```

### Get list of Group Members for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  MultipleGroupMembersResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all User Members for a given iTwin and prints their ids to the console. */
async function printiTwinGroupMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleGroupMembersResponse> =
    await accessControlClient.groupMembers.queryITwinGroupMembers(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0"
    );

  iTwinsResponse.data!.members!.forEach((actualGroupMember) => {
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
  MultipleGroupMembersResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all User Members for a given iTwin and prints their ids to the console. */
async function printiTwinGroupMemberIds(): Promise<void> {
  const skipAmount = 5;
  const topAmount = 3;
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleGroupMembersResponse> =
    await accessControlClient.groupMembers.queryITwinGroupMembers(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0",
      { skip: skipAmount, top: topAmount }
    );

  iTwinsResponse.data!.members!.forEach((actualGroupMember) => {
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
  SingleGroupMemberResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets a member of an iTwin prints the id and email to the console. */
async function printiTwinGroupMemberIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<SingleGroupMemberResponse> =
    await accessControlClient.groupMembers.getITwinGroupMember(
      accessToken,
      "9bd7d24d-1508-4dba-99ab-23b3166401a0",
      "a083cc1c-f51a-4c52-8614-5774ab79eca1"
    );

  const actualGroupMember = iTwinsResponse.data!.member!;
  console.log(actualGroupMember.id, actualGroupMember.email);
}
```

### Create, update, and delete a Group Member

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  MultipleGroupMembersResponse,
  SingleGroupMemberResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates, updates, and deletes a group member. */
async function manageGroupMember(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  // Create group member
  const createResponse: BentleyAPIResponse<MultipleGroupMembersResponse> =
    await accessControlClient.groupMembers.addITwinGroupMembers(
      accessToken,
      "71fd32ed-5ee4-4e22-bc4d-b8e973e0b7b7",
      {
        members: [
          {
            groupId: "d8215a6b-465d-44ff-910b-40d4541d1ebf",
            roleIds: [
              "25162c0c-dce7-419e-bb51-fd13efd5b54a",
              "10e3d778-0d35-4c4d-bf77-547bb366cb14",
            ],
          },
        ],
      }
    );

  // Update group member's role
  const updatedGroupMemberResponse: BentleyAPIResponse<SingleGroupMemberResponse> =
    await accessControlClient.groupMembers.updateITwinGroupMember(
      accessToken,
      "b1803a0c-d440-4902-b527-54bf7f72500f",
      "6401109c-75d7-46b8-8dbd-182d02155141",
      [
        "25162c0c-dce7-419e-bb51-fd13efd5b54a",
        "10e3d778-0d35-4c4d-bf77-547bb366cb14",
      ]
    );

  // Delete group member
  const removeGroupMemberResponse: BentleyAPIResponse<undefined> =
    await accessControlClient.groupMembers.removeITwinGroupMember(
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
  MultiplePermissionsResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Permissions and prints the ids to the console. */
async function printiTwinPermissionIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultiplePermissionsResponse> =
    await accessControlClient.permissions.getPermissions(accessToken);

  iTwinsResponse.data!.permissions!.forEach((actualPermission) => {
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
  MultiplePermissionsResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries Permissions for a given iTwin and prints the ids to the console. */
async function printiTwinPermissionIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultiplePermissionsResponse> =
    await accessControlClient.permissions.getITwinPermissions(
      accessToken,
      "6c704296-9028-4a1e-ae67-c0104a11402a"
    );

  iTwinsResponse.data!.permissions!.forEach((actualPermission) => {
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
  BentleyAPIResponse,
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
  const createResponse: BentleyAPIResponse<ITwinJob> =
    await accessControlClient.itwinJobs.createITwinJob(
      accessToken,
      "d7d82799-3f0c-4175-acbe-cc2573e99359",
      itwinJobActions
    );

  // Get the created iTwin job
  const getiTwinJobResponse: BentleyAPIResponse<ITwinJob> =
    await accessControlClient.itwinJobs.getITwinJob(
      accessToken,
      "d7d82799-3f0c-4175-acbe-cc2573e99359",
      createResponse.data.id
    );

  // Get the created iTwin job with errors
  const getiTwinJobResponseWithErrors: BentleyAPIResponse<ITwinJob> =
    await accessControlClient.itwinJobs.getITwinJob(
      accessToken,
      "d7d82799-3f0c-4175-acbe-cc2573e99359",
      createResponse.data.id,
      "representation"
    );

  // Get the created iTwin job's actions
  const getiTwinJobActionaResponse: BentleyAPIResponse<ITwinJobActions> =
    await accessControlClient.itwinJobs.getITwinJobActions(
      accessToken,
      "d7d82799-3f0c-4175-acbe-cc2573e99359",
      createResponse.data.id
    );
}
}
```

### Get list of Member Invitations for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  MultipleMemberInvitationResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Member Invitations for a given iTwin and prints their ids to the console. */
async function printiTwinMemberInvitationIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleMemberInvitationResponse> =
    await accessControlClient.memberInvitations.queryITwinMemberInvitations(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1"
    );

  iTwinsResponse.data!.invitations!.forEach((invitation) => {
    console.log(invitation.id, invitation.email, invitation.status);
  });
}
```

### Get filtered list of Member Invitations with pagination

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  MultipleMemberInvitationResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries Member Invitations with pagination for a given iTwin. */
async function printiTwinMemberInvitationIds(): Promise<void> {
  const skipAmount = 5;
  const topAmount = 10;
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleMemberInvitationResponse> =
    await accessControlClient.memberInvitations.queryITwinMemberInvitations(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      { skip: skipAmount, top: topAmount }
    );

  iTwinsResponse.data!.invitations!.forEach((invitation) => {
    console.log(invitation.id, invitation.email, invitation.status);
  });
}
```

### Delete a Member Invitation

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that deletes a specific member invitation. */
async function deleteMemberInvitation(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const deleteResponse: BentleyAPIResponse<undefined> =
    await accessControlClient.memberInvitations.deleteITwinMemberInvitation(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "a083cc1c-f51a-4c52-8614-5774ab79eca1"
    );

  console.log("Member invitation deleted successfully");
}
```

### Get list of Group Member Invitations for an iTwin

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  MultipleGroupMemberInvitationResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries all Group Member Invitations for a given iTwin group and prints their ids to the console. */
async function printiTwinGroupMemberInvitationIds(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleGroupMemberInvitationResponse> =
    await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf"
    );

  iTwinsResponse.data!.invitations!.forEach((invitation) => {
    console.log(invitation.id);
  });
}
```

### Get filtered list of Group Member Invitations with pagination

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  MultipleGroupMemberInvitationResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that queries Group Member Invitations with pagination for a given iTwin group. */
async function printiTwinGroupMemberInvitationIds(): Promise<void> {
  const skipAmount = 5;
  const topAmount = 10;
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const iTwinsResponse: BentleyAPIResponse<MultipleGroupMemberInvitationResponse> =
    await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf",
      { skip: skipAmount, top: topAmount }
    );

  iTwinsResponse.data!.invitations!.forEach((invitation) => {
    console.log(invitation.id, invitation.email);
  });
}
```

### Delete a Group Member Invitation

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that deletes a specific group member invitation. */
async function deleteGroupMemberInvitation(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const deleteResponse: BentleyAPIResponse<undefined> =
    await accessControlClient.groupMemberInvitations.deleteITwinGroupMemberInvitation(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf",
      "a083cc1c-f51a-4c52-8614-5774ab79eca1"
    );

  console.log("Group member invitation deleted successfully");
}
```

### Create an iTwin Share

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  SingleShareContractResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that creates a new iTwin share. */
async function createiTwinShare(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const shareDetails = {
    shareContract: ["imodels:read", "reality-data:read"],
    expiration: "2024-12-31T23:59:59Z" // Optional: defaults to 90 days if not specified
  };

  const createResponse: BentleyAPIResponse<SingleShareContractResponse> =
    await accessControlClient.itwinShares.createITwinShare(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      shareDetails
    );

  const share = createResponse.data!.share!;
  console.log(`Share created with ID: ${share.id}`);
  console.log(`Share key: ${share.shareKey}`);
}
```

### Get specific iTwin Share

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  SingleShareContractResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets details of a specific iTwin share. */
async function getiTwinShare(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const shareResponse: BentleyAPIResponse<SingleShareContractResponse> =
    await accessControlClient.itwinShares.getITwinShare(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf"
    );

  const share = shareResponse.data!.share!;
  console.log(`Share ID: ${share.id}`);
  console.log(`Share contract: ${share.shareContract.join(", ")}`);
  console.log(`Expires at: ${share.expiration}`);
}
```

### Get all iTwin Shares

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  MultiShareContractResponse,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that gets all iTwin shares and prints their details. */
async function getiTwinShares(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const sharesResponse: BentleyAPIResponse<MultiShareContractResponse> =
    await accessControlClient.itwinShares.getITwinShares(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1"
    );

  sharesResponse.data!.shares!.forEach((share) => {
    console.log(`Share ID: ${share.id}, Contract: ${share.shareContract.join(", ")}`);
  });
}
```

### Revoke an iTwin Share

```typescript
import type { AccessToken } from "@itwin/core-bentley";
import {
  AccessControlClient,
  IAccessControlClient,
  BentleyAPIResponse,
} from "@itwin/access-control-client";

/** Function that revokes a specific iTwin share. */
async function revokeiTwinShare(): Promise<void> {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const accessToken: AccessToken = { get_access_token_logic_here };

  const revokeResponse: BentleyAPIResponse<undefined> =
    await accessControlClient.itwinShares.revokeITwinShare(
      accessToken,
      "2f981e83-47e4-4f36-8ee9-4264453688a1",
      "d8215a6b-465d-44ff-910b-40d4541d1ebf"
    );

  console.log("iTwin share revoked successfully");
}
```

## Contributing to this Repository

For information on how to contribute to this project, please read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines, [GETTINGSTARTED.md](GETTINGSTARTED.md) for information on working with the documentation in this repository.
