/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { IAccessControlClient } from "./accessControlClientInterfaces/accessControl.js";
import type { IGroupsClient } from "./accessControlClientInterfaces/GroupClient.js";
import type { IGroupMemberInvitationClient } from "./accessControlClientInterfaces/GroupMemberInvitationClient.js";
import type { IGroupMembersClient } from "./accessControlClientInterfaces/GroupMembersClient.js";
import type { IITwinJobsClient } from "./accessControlClientInterfaces/ITwinJobsClient.js";
import type { IITwinSharesClient } from "./accessControlClientInterfaces/ItwinSharesClient.js";
import type { IMemberInvitationsClient } from "./accessControlClientInterfaces/MemberInvitationsClient.js";
import type { IOwnerMembersClient } from "./accessControlClientInterfaces/OwnerMembersClient .js";
import type { IPermissionsClient } from "./accessControlClientInterfaces/PermissionsClient.js";
import type { IRolesClient } from "./accessControlClientInterfaces/RolesClient.js";
import type { IUserMembersClient } from "./accessControlClientInterfaces/UserMembersClient.js";
import { GroupMemberInvitationClient } from './subClients/GroupMemberInvitationsClient.js';
import { GroupMembersClient } from "./subClients/GroupMembersClient.js";
import { GroupsClient } from "./subClients/GroupsClient.js";
import { ITwinJobsClient } from "./subClients/ITwinJobsClient.js";
import { ITwinSharesClient } from "./subClients/ItwinShares.js";
import { MemberInvitationsClient } from "./subClients/MemberInvitationsClient.js";
import { OwnerMembersClient } from "./subClients/OwnerMembersClient.js";
import { PermissionsClient } from "./subClients/PermissionsClient.js";
import { RolesClient } from "./subClients/RolesClient.js";
import { UserMembersClient } from "./subClients/UserMembersClient.js";

/** Client API to access the access control service.
 */
export class AccessControlClient implements IAccessControlClient {
  public readonly permissions: IPermissionsClient;
  public readonly roles: IRolesClient;
  public readonly groups: IGroupsClient;
  public readonly userMembers: IUserMembersClient;
  public readonly groupMembers: IGroupMembersClient;
  public readonly ownerMembers: IOwnerMembersClient;
  public readonly memberInvitations: IMemberInvitationsClient;
  public readonly itwinJobs: IITwinJobsClient;
  public readonly itwinShares: IITwinSharesClient;
  public readonly groupMemberInvitations: IGroupMemberInvitationClient;

  /** Create a new AccessControlClient instance
   * @param url Optional base URL for the access control service. If not provided, defaults to base url.
   */
  public constructor(url?: string) {
    this.permissions = new PermissionsClient(url);
    this.roles = new RolesClient(url);
    this.groups = new GroupsClient(url);
    this.userMembers = new UserMembersClient(url);
    this.groupMembers = new GroupMembersClient(url);
    this.ownerMembers = new OwnerMembersClient(url);
    this.memberInvitations = new MemberInvitationsClient(url);
    this.itwinJobs = new ITwinJobsClient(url);
    this.itwinShares = new ITwinSharesClient(url);
    this.groupMemberInvitations = new GroupMemberInvitationClient(url);
  }
}
