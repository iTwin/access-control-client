/* eslint-disable spaced-comment */
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";

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

  /** Add or invite new iTwin user members */
  addITwinUserMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: AddUserMember[]
  ): Promise<AccessControlAPIResponse<AddUserMemberResponse>>;

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

export interface IOwnerMembersClient {
  /** Retrieves a list of owner members on a specified iTwin. */
  queryITwinOwnerMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<OwnerMember[]>>;

  /** Add or invite new iTwin owner member */
  addITwinOwnerMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMember: OwnerMember
  ): Promise<AccessControlAPIResponse<AddOwnerMemberResponse>>;

  /**  Remove the specified iTwin owner member */
  removeITwinOwnerMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>>;
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
    newMembers: AddGroupMember[]
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
    iTwinId: string,
    additionalHeaders?: { [key: string]: string }
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

export interface IMemberInvitationsClient {
  /** Retrieves a list of member invitations. */
  queryITwinMemberInvitationsAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<MemberInvitation[]>>;
}

export interface IITwinJobsClient {
  /** Creates a new iTwin Job */
  createITwinJobAsync(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinActions: ITwinJobActions
  ): Promise<AccessControlAPIResponse<ITwinJob>>;

  /** Gets an iTwin Job. To see errors, pass in the `representation` result mode. */
  getITwinJobAsync(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobId?: string,
    resultMode?: AccessControlResultMode
  ): Promise<AccessControlAPIResponse<ITwinJob>>;

  /** Gets the iTwin Job Actions for a specified iTwin Job. */
  getITwinJobActionsAsync(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobId?: string
  ): Promise<AccessControlAPIResponse<ITwinJobActions>>;
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

export enum ITwinJobStatus {
  Active = "Active",
  Complete = "Completed",
  PartialCompleted = "PartialCompleted",
  Failed = "Failed"
}

/** Contains extra properties with "representation" result mode.
 */
export interface ITwinJob {
  id: string;
  itwinId: string;
  status: ITwinJobStatus;

  // extra properties available with "representation" result mode:
  error?: ErrorDetail[];
}

export interface ITwinJobActions {
  assignRoles?: ITwinJobAction[];
  unassignRoles?: ITwinJobAction[];
  removeMembers?: Omit<ITwinJobAction, "roleIds">[];
  options?: any;
}

export interface ITwinJobAction {
  email: string;
  roleIds: string[];
}

//#endregion

