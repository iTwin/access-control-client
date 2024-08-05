/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type {
  IAccessControlClient,
  IGroupMembersClient,
  IGroupsClient,
  IITwinJobsClient,
  IMemberInvitationsClient,
  IOwnerMembersClient,
  IPermissionsClient,
  IRolesClient,
  IUserMembersClient,
} from "./accessControlTypes";
import { PermissionsClient } from "./subClients/PermissionsClient";
import { RolesClient } from "./subClients/RolesClient";
import { GroupsClient } from "./subClients/GroupsClient";
import { UserMembersClient } from "./subClients/UserMembersClient";
import { GroupMembersClient } from "./subClients/GroupMembersClient";
import { OwnerMembersClient } from "./subClients/OwnerMembersClient";
import { MemberInvitationsClient } from "./subClients/MemberInvitationsClient";
import { ITwinJobsClient } from "./subClients/ITwinJobsClient";

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
