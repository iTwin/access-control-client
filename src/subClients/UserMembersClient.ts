/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type {
  AccessControlAPIResponse,
  AccessControlQueryArg,
  AddUserMember,
  AddUserMemberResponse,
  IUserMembersClient,
  UserMember,
} from "../accessControlTypes";
import { BaseClient } from "./BaseClient";

export class UserMembersClient
  extends BaseClient
  implements IUserMembersClient {
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of iTwin user members and their roles assignments.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Array of members
   */
  public async queryITwinUserMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<UserMember[]>> {
    let url = `${this._baseUrl}/${iTwinId}/members/users`;

    if (arg) {
      url += `?${this.getQueryString(arg)}`;
    }

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
      "members"
    ); // TODO: Consider how to handle paging
  }

  /** Retrieves a specific user member for a specified iTwin.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns Member
   */
  public async getITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<UserMember>> {
    const url = `${this._baseUrl}/${iTwinId}/members/users/${memberId}`;
    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
      "member"
    );
  }

  /** Add new iTwin user members
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param newMembers The list of members to add or invite, along with their role
   * @returns AddUserMemberResponse -- the added or invited user members
   */
  public async addITwinUserMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: AddUserMember[]
  ): Promise<AccessControlAPIResponse<AddUserMemberResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/users`;
    const body = {
      members: newMembers,
    };
    return this.sendGenericAPIRequest(
      accessToken,
      "POST",
      url,
      body
    );
  }

  /** Remove the specified user member from the iTwin
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns No Content
   */
  public async removeITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/users/${memberId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }

  /** Update iTwin user member roles
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @param roleIds The ids of the roles to be assigned
   * @returns Member
   */
  public async updateITwinUserMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<AccessControlAPIResponse<UserMember>> {
    const url = `${this._baseUrl}/${iTwinId}/members/users/${memberId}`;
    const body = {
      roleIds,
    };
    return this.sendGenericAPIRequest(
      accessToken,
      "PATCH",
      url,
      body,
      "member"
    );
  }
}
