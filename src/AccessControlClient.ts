/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { IAccessControlClient } from "./accessControlClientInterfaces/accessControl";
import type { IGroupsClient } from "./accessControlClientInterfaces/GroupClient";
import type { IGroupMembersClient } from "./accessControlClientInterfaces/GroupMembersClient";
import type { IITwinJobsClient } from "./accessControlClientInterfaces/ITwinJobsClient";
import type { IITwinSharesClient } from "./accessControlClientInterfaces/ItwinSharesClient";
import type { IMemberInvitationsClient } from "./accessControlClientInterfaces/MemberInvitationsClient";
import type { IOwnerMembersClient } from "./accessControlClientInterfaces/OwnerMembersClient ";
import type { IPermissionsClient } from "./accessControlClientInterfaces/PermissionsClient";
import type { IRolesClient } from "./accessControlClientInterfaces/RolesClient";
import type { IUserMembersClient } from "./accessControlClientInterfaces/UserMembersClient";
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
  public permissions: IPermissionsClient;
  public roles: IRolesClient;
  public groups: IGroupsClient;
  public userMembers: IUserMembersClient;
  public groupMembers: IGroupMembersClient;
  public ownerMembers: IOwnerMembersClient;
  public memberInvitations: IMemberInvitationsClient;
  public itwinJobs: IITwinJobsClient;
  public itwinShares: IITwinSharesClient;

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
  }
}
