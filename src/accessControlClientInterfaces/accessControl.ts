/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IGroupsClient } from "./GroupClient.js";
import type { IGroupMemberInvitationClient } from "./GroupMemberInvitationClient.js";
import type { IGroupMembersClient } from "./GroupMembersClient.js";
import type { IITwinJobsClient } from "./ITwinJobsClient.js";
import type { IITwinSharesClient } from "./ItwinSharesClient.js";
import type { IMemberInvitationsClient } from "./MemberInvitationsClient.js";
import type { IOwnerMembersClient } from "./OwnerMembersClient .js";
import type { IPermissionsClient } from "./PermissionsClient.js";
import type { IRolesClient } from "./RolesClient.js";
import type { IUserMembersClient } from "./UserMembersClient.js";

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
  groupMemberInvitations: IGroupMemberInvitationClient
}
