/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { IAccessControlClient } from "./accessControlClientInterfaces/accessControl";
import type { IGroupsClient } from "./accessControlClientInterfaces/GroupClient";
import type { IGroupMemberInvitationClient } from "./accessControlClientInterfaces/GroupMemberInvitationClient";
import type { IGroupMembersClient } from "./accessControlClientInterfaces/GroupMembersClient";
import type { IITwinJobsClient } from "./accessControlClientInterfaces/ITwinJobsClient";
import type { IITwinSharesClient } from "./accessControlClientInterfaces/ItwinSharesClient";
import type { IMemberInvitationsClient } from "./accessControlClientInterfaces/MemberInvitationsClient";
import type { IOwnerMembersClient } from "./accessControlClientInterfaces/OwnerMembersClient ";
import type { IPermissionsClient } from "./accessControlClientInterfaces/PermissionsClient";
import type { IRolesClient } from "./accessControlClientInterfaces/RolesClient";
import type { IUserMembersClient } from "./accessControlClientInterfaces/UserMembersClient";
import { GroupMemberInvitationClient } from './subClients/GroupMemberInvitationsClient';
import { GroupMembersClient } from "./subClients/GroupMembersClient";
import { GroupsClient } from "./subClients/GroupsClient";
import { ITwinJobsClient } from "./subClients/ITwinJobsClient";
import { ITwinSharesClient } from "./subClients/ItwinShares";
import { MemberInvitationsClient } from "./subClients/MemberInvitationsClient";
import { OwnerMembersClient } from "./subClients/OwnerMembersClient";
import { PermissionsClient } from "./subClients/PermissionsClient";
import { RolesClient } from "./subClients/RolesClient";
import { UserMembersClient } from "./subClients/UserMembersClient";

/** Client API to access the access control service.
 * @beta
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
