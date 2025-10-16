/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";
import type { IGroupsClient } from "./subClients/accessControlClientInterfaces/GroupClient";
import type { IGroupMembersClient } from "./subClients/accessControlClientInterfaces/GroupMembersClient";
import type { IMemberInvitationsClient } from "./subClients/accessControlClientInterfaces/IMemberInvitationsClient";
import type { IITwinJobsClient } from "./subClients/accessControlClientInterfaces/ITwinJobsClient";
import type { BentleyAPIResponse, ResultMode } from "./types/CommonApiTypes";
import type { MemberInvitation } from "./types/Invitations";
import type { Role } from "./types/Role";
import type { AddUserMember, AddUserMemberResponse, MultipleUserMembersResponse, SingleUserMemberResponse } from "./types/UserMembers";

//#region clients

export interface IAccessControlClient {
  permissions: IPermissionsClient;
  roles: IRolesClient;
  groups: IGroupsClient;
  userMembers: IUserMembersClient;
  groupMembers: IGroupMembersClient;
  ownerMembers: IOwnerMembersClient;
  memberInvitations: IMemberInvitationsClient;
  itwinJobs: IITwinJobsClient;
}

export interface IPermissionsClient {
  /** Retrieves the list of all available permissions **/
  getPermissions(
    accessToken: AccessToken
  ): Promise<BentleyAPIResponse<string[]>>;

  /** Retrieves a list of permissions the identity has for a specified iTwin */
  getITwinPermissions(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<BentleyAPIResponse<string[]>>;
}

export interface IOwnerMembersClient {
  /** Retrieves a list of owner members on a specified iTwin. */
  queryITwinOwnerMembers(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<BentleyAPIResponse<OwnerMember[]>>;

  /** Add or invite new iTwin owner member */
  addITwinOwnerMember(
    accessToken: AccessToken,
    iTwinId: string,
    newMember: OwnerMember
  ): Promise<BentleyAPIResponse<AddOwnerMemberResponse>>;

  /**  Remove the specified iTwin owner member */
  removeITwinOwnerMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>>;
}

export interface IRolesClient {
  /** Retrieves a list of roles the for a specified iTwin */
  getITwinRoles(
    accessToken: AccessToken,
    iTwinId: string,
    additionalHeaders?: { [key: string]: string }
  ): Promise<BentleyAPIResponse<Role[]>>;

  /** Retrieves a role for a specified iTwin */
  getITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string
  ): Promise<BentleyAPIResponse<Role>>;

  /** Creates a new iTwin Role */
  createITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    role: Role
  ): Promise<BentleyAPIResponse<Role>>;

  /** Removes an existing iTwin Role */
  deleteITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string
  ): Promise<BentleyAPIResponse<undefined>>;

  /** Updates an existing iTwin Role */
  updateITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
    role: Role
  ): Promise<BentleyAPIResponse<Role>>;
}

//#endregion

//#region generic-responses

export interface AccessControlQueryArg {
  top?: number;
  skip?: number;
  resultMode?: ResultMode;
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

//#endregion

//#region custom responses

export interface AddOwnerMemberResponse {
  member?: OwnerMember;
  invitation?: MemberInvitation;
}

//#endregion

//#region base object
export interface OwnerMember {
  id?: string;
  email?: string;
  givenName?: string;
  surname?: string;
  organization?: string;
}

//#endregion

