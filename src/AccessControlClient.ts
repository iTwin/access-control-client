/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type {
  IAccessControlClient,
  IOwnerMembersClient,
  IPermissionsClient,
  IRolesClient,
  IUserMembersClient,
} from "./accessControlTypes";
import { GroupMembersClient } from "./subClients/GroupMembersClient";
import { GroupsClient } from "./subClients/GroupsClient";
import { ITwinJobsClient } from "./subClients/ITwinJobsClient";
import { MemberInvitationsClient } from "./subClients/MemberInvitationsClient";
import { OwnerMembersClient } from "./subClients/OwnerMembersClient";
import { PermissionsClient } from "./subClients/PermissionsClient";
import { RolesClient } from "./subClients/RolesClient";
import { UserMembersClient } from "./subClients/UserMembersClient";
import type { IGroupsClient } from "./subClients/accessControlClientInterfaces/GroupClient";
import type { IGroupMembersClient } from "./subClients/accessControlClientInterfaces/GroupMembersClient";
import { IMemberInvitationsClient } from "./subClients/accessControlClientInterfaces/IMemberInvitationsClient";
import type { IITwinJobsClient } from "./subClients/accessControlClientInterfaces/ITwinJobsClient";

export class AccessControlClient implements IAccessControlClient {
  public permissions: IPermissionsClient;
  public roles: IRolesClient;
  public groups: IGroupsClient;
  public userMembers: IUserMembersClient;
  public groupMembers: IGroupMembersClient;
  public ownerMembers: IOwnerMembersClient;
  public memberInvitations: IMemberInvitationsClient;
  public itwinJobs: IITwinJobsClient;

  public constructor(url?: string) {
    this.permissions = new PermissionsClient(url);
    this.roles = new RolesClient(url);
    this.groups = new GroupsClient(url);
    this.userMembers = new UserMembersClient(url);
    this.groupMembers = new GroupMembersClient(url);
    this.ownerMembers = new OwnerMembersClient(url);
    this.memberInvitations = new MemberInvitationsClient(url);
    this.itwinJobs = new ITwinJobsClient(url);
  }
}
