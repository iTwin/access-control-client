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
  IPermissionsClient,
  IRolesClient,
  IUserMembersClient,
} from "./accessControlTypes";
import { PermissionsClient } from "./subClients/PermissionsClient";
import { RolesClient } from "./subClients/RolesClient";
import { GroupsClient } from "./subClients/GroupsClient";
import { UserMembersClient } from "./subClients/UserMembersClient";
import { GroupMembersClient } from "./subClients/GroupMembersClient";

export class AccessControlClient implements IAccessControlClient {
  public permissions: IPermissionsClient;
  public roles: IRolesClient;
  public groups: IGroupsClient;
  public userMembers: IUserMembersClient;
  public groupMembers: IGroupMembersClient;

  public constructor(url?: string) {
    this.permissions = new PermissionsClient(url);
    this.roles = new RolesClient(url);
    this.groups = new GroupsClient(url);
    this.userMembers = new UserMembersClient(url);
    this.groupMembers = new GroupMembersClient(url);
  }
}
