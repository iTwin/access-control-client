/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";
import { IGroupsClient } from "./subClients/accessControlClientInterfaces/GroupClient";
import { ITwinJob, ITwinJobActions } from "./types/ITwinJob";

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
  getPermissionsAsync(
    accessToken: AccessToken
  ): Promise<BentleyAPIResponse<Permission[]>>;

  /** Retrieves a list of permissions the identity has for a specified iTwin */
  getITwinPermissionsAsync(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<BentleyAPIResponse<Permission[]>>;
}

export interface IUserMembersClient {
  /** Retrieves a list of user members and their roles assigned to a specified iTwin. */
  queryITwinUserMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<BentleyAPIResponse<UserMember[]>>;

  /** Retrieves a specific user member for a specified iTwin. */
  getITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<UserMember>>;

  /** Add or invite new iTwin user members */
  addITwinUserMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: AddUserMember[],
    customMessage?: string
  ): Promise<BentleyAPIResponse<AddUserMemberResponse>>;

  /**  Remove the specified iTwin user member */
  removeITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>>;

  /**  Update iTwin user member roles */
  updateITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<BentleyAPIResponse<UserMember>>;
}

export interface IOwnerMembersClient {
  /** Retrieves a list of owner members on a specified iTwin. */
  queryITwinOwnerMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<BentleyAPIResponse<OwnerMember[]>>;

  /** Add or invite new iTwin owner member */
  addITwinOwnerMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMember: OwnerMember
  ): Promise<BentleyAPIResponse<AddOwnerMemberResponse>>;

  /**  Remove the specified iTwin owner member */
  removeITwinOwnerMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>>;
}

export interface IGroupMembersClient {
  /** Retrieves a list of group members and their roles assigned to a specified iTwin. */
  queryITwinGroupMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<BentleyAPIResponse<GroupMember[]>>;

  /** Retrieves a specific group member for a specified iTwin. */
  getITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<GroupMember>>;

  /** Add new iTwin group members */
  addITwinGroupMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: AddGroupMember[]
  ): Promise<BentleyAPIResponse<GroupMember[]>>;

  /**  Remove the specified iTwin group member */
  removeITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>>;

  /**  Update iTwin group member roles */
  updateITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<BentleyAPIResponse<GroupMember>>;
}

export interface IRolesClient {
  /** Retrieves a list of roles the for a specified iTwin */
  getITwinRolesAsync(
    accessToken: AccessToken,
    iTwinId: string,
    additionalHeaders?: { [key: string]: string }
  ): Promise<BentleyAPIResponse<Role[]>>;

  /** Retrieves a role for a specified iTwin */
  getITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string
  ): Promise<BentleyAPIResponse<Role>>;

  /** Creates a new iTwin Role */
  createITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    role: Role
  ): Promise<BentleyAPIResponse<Role>>;

  /** Removes an existing iTwin Role */
  deleteITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string
  ): Promise<BentleyAPIResponse<undefined>>;

  /** Updates an existing iTwin Role */
  updateITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
    role: Role
  ): Promise<BentleyAPIResponse<Role>>;
}

export interface IMemberInvitationsClient {
  /** Retrieves a list of member invitations. */
  queryITwinMemberInvitationsAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<BentleyAPIResponse<MemberInvitation[]>>;

  /** Removes an existing member invitation. */
  deleteITwinMemberInvitationAsync(
    accessToken: AccessToken,
    iTwinId: string,
    invitationId: string
  ): Promise<BentleyAPIResponse<undefined>>;
}

export interface IITwinJobsClient {
  /** Creates a new iTwin Job */
  createITwinJobAsync(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobActions: ITwinJobActions
  ): Promise<BentleyAPIResponse<ITwinJob>>;

  /** Gets an iTwin Job. To see errors, pass in the `representation` result mode. */
  getITwinJobAsync<T extends AccessControlResultMode = "minimal">(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobId: string,
    resultMode?: T
  ): Promise<BentleyAPIResponse<T extends "representation" ? ITwinJob : Omit<ITwinJob, "error">>>;

  /** Gets the iTwin Job Actions for a specified iTwin Job. */
  getITwinJobActionsAsync(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobId?: string
  ): Promise<BentleyAPIResponse<ITwinJobActions>>;
}

//#endregion

//#region generic-responses

/**
 * Optional result mode. Minimal is the default, representation returns extra properties
 */
export type AccessControlResultMode = "minimal" | "representation";

export interface AccessControlQueryArg {
  top?: number;
  skip?: number;
  resultMode?: AccessControlResultMode;
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

export interface AddUserMemberResponse {
  members: UserMember[];
  invitations: MemberInvitation[];
}

//#endregion

//#region base object

export type Permission = string;

export interface UserMember {
  id?: string;
  email?: string;
  givenName?: string;
  surname?: string;
  organization?: string;
  roles?: Omit<Role, "permissions">[];
}

export interface AddUserMember {
  roleIds: string[];
  email: string;
}

export interface OwnerMember {
  id?: string;
  email?: string;
  givenName?: string;
  surname?: string;
  organization?: string;
}

export interface GroupMember {
  id?: string;
  groupName?: string;
  groupDescription?: string;
  roles?: Omit<Role, "permissions">[];
  imsGroupsCount?: number;
  membersCount?: number;
}

export interface AddGroupMember {
  groupId: string;
  roleIds: string[];
}

export interface Role {
  id?: string;
  displayName: string;
  description: string;
  permissions: Permission[];
}
export interface MemberInvitation {
  id: string;
  email: string;
  invitedByEmail: string;
  status: MemberInvitationStatus;
  createdDate: string;
  expirationDate: string;
  roles?: Omit<Role, "permissions"|"description">[];
}

export enum MemberInvitationStatus {
  Pending = "Pending",
  Accepted = "Accepted"
}

//#endregion

