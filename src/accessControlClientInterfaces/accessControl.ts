/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IGroupsClient } from "./GroupClient";
import type { IGroupMembersClient } from "./GroupMembersClient";
import type { IITwinJobsClient } from "./ITwinJobsClient";
import type { IITwinSharesClient } from "./ItwinSharesClient";
import type { IMemberInvitationsClient } from "./MemberInvitationsClient";
import type { IOwnerMembersClient } from "./OwnerMembersClient ";
import type { IPermissionsClient } from "./PermissionsClient";
import type { IRolesClient } from "./RolesClient";
import type { IUserMembersClient } from "./UserMembersClient";

export interface IAccessControlClient {
  permissions: IPermissionsClient;
  roles: IRolesClient;
  groups: IGroupsClient;
  userMembers: IUserMembersClient;
  groupMembers: IGroupMembersClient;
  ownerMembers: IOwnerMembersClient;
  memberInvitations: IMemberInvitationsClient;
  itwinJobs: IITwinJobsClient;
  itwinShares: IITwinSharesClient;
}
