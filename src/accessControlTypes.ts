/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";

export interface IAccessControlClient {
  permissions: IPermissionsClient;
  roles: IRolesClient;
  groups: IGroupsClient;
  userMembers: IUserMembersClient;
  groupMembers: IGroupMembersClient;
}

export interface IPermissionsClient {
  /** Retrieves the list of all available permissions **/
  getPermissionsAsync(
    accessToken: AccessToken
  ): Promise<AccessControlAPIResponse<Permission[]>>;

  /** Retrieves a list of permissions the identity has for a specified iTwin */
  getITwinPermissionsAsync(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<AccessControlAPIResponse<Permission[]>>;
}

export interface IUserMembersClient {
  /** Retrieves a list of user members and their roles assigned to a specified iTwin. */
  queryITwinUserMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<UserMember[]>>;

  /** Retrieves a specific user member for a specified iTwin. */
  getITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<UserMember>>;

  /** Add new iTwin user members */
  addITwinUserMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: UserMember[]
  ): Promise<AccessControlAPIResponse<UserMember[]>>;

  /**  Remove the specified iTwin user member */
  removeITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>>;

  /**  Update iTwin user member roles */
  updateITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<AccessControlAPIResponse<UserMember>>;
}

export interface IGroupMembersClient {
  /** Retrieves a list of group members and their roles assigned to a specified iTwin. */
  queryITwinGroupMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<GroupMember[]>>;

  /** Retrieves a specific group member for a specified iTwin. */
  getITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<GroupMember>>;

  /** Add new iTwin group members */
  addITwinGroupMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: GroupMember[]
  ): Promise<AccessControlAPIResponse<GroupMember[]>>;

  /**  Remove the specified iTwin group member */
  removeITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>>;

  /**  Update iTwin group member roles */
  updateITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<AccessControlAPIResponse<GroupMember>>;
}

export interface IRolesClient {
  /** Retrieves a list of roles the for a specified iTwin */
  getITwinRolesAsync(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<AccessControlAPIResponse<Role[]>>;

  /** Retrieves a role for a specified iTwin */
  getITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string
  ): Promise<AccessControlAPIResponse<Role>>;

  /** Creates a new iTwin Role */
  createITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    role: Role
  ): Promise<AccessControlAPIResponse<Role>>;

  /** Removes an existing iTwin Role */
  deleteITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string
  ): Promise<AccessControlAPIResponse<undefined>>;

  /** Updates an existing iTwin Role */
  updateITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
    role: Role
  ): Promise<AccessControlAPIResponse<Role>>;
}

export interface IGroupsClient {
  /** Retrieves a list of groups the for a specified iTwin */
  getITwinGroupsAsync(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<AccessControlAPIResponse<Group[]>>;

  /** Retrieves a group for a specified iTwin */
  getITwinGroupAsync(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string
  ): Promise<AccessControlAPIResponse<Group>>;

  /** Creates a new iTwin group */
  createITwinGroupAsync(
    accessToken: AccessToken,
    iTwinId: string,
    group: Group
  ): Promise<AccessControlAPIResponse<Group>>;

  /** Removes an existing iTwin group */
  deleteITwinGroupAsync(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string
  ): Promise<AccessControlAPIResponse<undefined>>;

  /** Updates an existing iTwin group */
  updateITwinGroupAsync(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
    group: GroupUpdate
  ): Promise<AccessControlAPIResponse<Group>>;
}

export interface AccessControlQueryArg {
  top?: number;
  skip?: number;
}

export interface AccessControlAPIResponse<T> {
  data?: T;
  status: number;
  error?: Error;
}

export interface Error {
  code: string;
  message: string;
  details?: ErrorDetail[];
  target?: string;
}

export interface ErrorDetail {
  code: string;
  message: string;
  target?: string;
}

export type Permission = string;

export interface UserMember {
  id?: string;
  roleid?: string;
  email?: string;
  givenName?: string;
  surname?: string;
  organization?: string;
  roles?: Omit<Role, "permissions">[];
}

export interface GroupMember {
  id?: string;
  groupName?: string;
  groupDescription?: string;
  roles?: Omit<Role, "permissions">[];
}

export interface Role {
  id?: string;
  displayName: string;
  description: string;
  permissions: Permission[];
}

export interface Group {
  id?: string;
  name?: string;
  description?: string;
  members?: GroupUser[];
  imsGroups?: string[];
}

export interface GroupUser {
  id?: string;
  email?: string;
  givenName?: string;
  surname?: string;
  organization?: string;
}

export interface GroupUpdate {
  id?: string;
  name?: string;
  description?: string;
  members?: string[];
  imsGroups?: string[];
}
