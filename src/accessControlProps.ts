/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";

export interface AccessControl {
  /** Retrieves the list of all available permissions **/
  queryPermissionsAsync(
    accessToken: AccessToken,
  ): Promise<AccessControlAPIResponse<PermissionsResponse>>;

  /** Retrieves a list of permissions the identity has for a specified iTwin */
  queryITwinPermissionsAsync(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<AccessControlAPIResponse<PermissionsResponse>>;

  /** Retrieves a list of team members and their roles assigned to a specified iTwin. */
  queryITwinMembersAsync(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<AccessControlAPIResponse<MembersResponse>>;

  /** Retrieves a specific member for a specified iTwin. */
  getITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<MemberResponse>>;

  /** Add new iTwin members */
  addITwinMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: NewMember[]
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
  ): Promise<AccessControlAPIResponse<MemberResponse>>;

  /** Retrieves a list of roles the for a specified iTwin */
  queryITwinRolesAsync(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<AccessControlAPIResponse<RolesResponse>>;

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
    role: NewRole
  ): Promise<AccessControlAPIResponse<RoleResponse>>;

  /** Removes an existing iTwin Role */
  removeITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
  ): Promise<AccessControlAPIResponse<undefined>>;

  /** Updates an existing iTwin Role */
  updateITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
    role: NewRole
  ): Promise<AccessControlAPIResponse<RoleResponse>>;
}

// TODO: Expand these options
export interface AccessControlQueryArg {
  top?: number;
  skip?: number;
  search?: string;
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

type Permission = string;

export interface PermissionsResponse {
  permissions: Permission[];
}

interface Member {
  id: string;
  email: string;
  givenName: string;
  surname: string;
  organization: string;
  roles: Omit<Role, "permissions">[];
}

export interface NewMember {
  email: string;
  roleId: string;
}

export interface MembersResponse {
  members: Member[];
}

export interface MemberResponse {
  member: Member;
}

export interface Role {
  id: string;
  displayName: string;
  description: string;
  permissions: Permission[];
}

export type NewRole = Omit<Role, "id">;

export interface RolesResponse {
  roles: Role[];
}

export interface RoleResponse {
  role: Role;
}
