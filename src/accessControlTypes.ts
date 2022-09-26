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
  members: IMembersClient;
}

export interface IPermissionsClient {
  /** Retrieves the list of all available permissions **/
  getPermissionsAsync(
    accessToken: AccessToken,
  ): Promise<AccessControlAPIResponse<Permission[]>>;

  /** Retrieves a list of permissions the identity has for a specified iTwin */
  getITwinPermissionsAsync(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<AccessControlAPIResponse<Permission[]>>;
}

export interface IMembersClient{
  /** Retrieves a list of team members and their roles assigned to a specified iTwin. */
  queryITwinMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<Member[]>>;

  /** Retrieves a specific member for a specified iTwin. */
  getITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<Member>>;

  /** Add new iTwin members */
  addITwinMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: Member[]
  ): Promise<AccessControlAPIResponse<undefined>>;

  /**  Remove the specified iTwin member */
  removeITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>>;

  /**  Update iTwin team member roles */
  updateITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<AccessControlAPIResponse<Member>>;
}

export interface IRolesClient {
  /** Retrieves a list of roles the for a specified iTwin */
  getITwinRolesAsync(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<AccessControlAPIResponse<Role[]>>;

  /** Retrieves a role for a specified iTwin */
  getITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
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
    roleId: string,
  ): Promise<AccessControlAPIResponse<undefined>>;

  /** Updates an existing iTwin Role */
  updateITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
    role: Role
  ): Promise<AccessControlAPIResponse<Role>>;
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

export interface Member {
  id?: string;
  roleid?: string;
  email?: string;
  givenName?: string;
  surname?: string;
  organization?: string;
  roles?: Omit<Role, "permissions">[];
}

export interface Role {
  id?: string;
  displayName: string;
  description: string;
  permissions: Permission[];
}
