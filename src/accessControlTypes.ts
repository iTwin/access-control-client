/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IGroupsClient } from "./subClients/accessControlClientInterfaces/GroupClient";
import type { IGroupMembersClient } from "./subClients/accessControlClientInterfaces/GroupMembersClient";
import type { IMemberInvitationsClient } from "./subClients/accessControlClientInterfaces/IMemberInvitationsClient";
import type { IITwinJobsClient } from "./subClients/accessControlClientInterfaces/ITwinJobsClient";
import { IUserMembersClient } from "./subClients/accessControlClientInterfaces/UserMembersClient";
import { IOwnerMembersClient } from "./subClients/accessControlClientInterfaces/OwnerMembersClient ";
import { IPermissionsClient } from "./subClients/accessControlClientInterfaces/PermissionsClient";
import { IRolesClient } from "./subClients/accessControlClientInterfaces/RolesClient";

export interface IAccessControlClient {
  permissions: IPermissionsClient;
  roles: IRolesClient;
  groups: IGroupsClient;
  userMembers: IUserMembersClient;
  groupMembers: IGroupMembersClient;
  ownerMembers: IOwnerMembersClient;
  memberInvitations: IMemberInvitationsClient;
  itwinJobs: IITwinJobsClient;
}
