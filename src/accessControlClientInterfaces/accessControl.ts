/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IGroupsClient } from "./GroupClient";
import type { IGroupMembersClient } from "./GroupMembersClient";
import type { IMemberInvitationsClient } from "./MemberInvitationsClient";
import type { IITwinJobsClient } from "./ITwinJobsClient";
import { IUserMembersClient } from "./UserMembersClient";
import { IOwnerMembersClient } from "./OwnerMembersClient ";
import { IPermissionsClient } from "./PermissionsClient";
import { IRolesClient } from "./RolesClient";

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
