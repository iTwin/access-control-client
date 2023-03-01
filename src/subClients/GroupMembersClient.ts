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
  GroupMember,
  IGroupMembersClient,
} from "../accessControlTypes";
import { BaseClient } from "./BaseClient";

export class GroupMembersClient
  extends BaseClient
  implements IGroupMembersClient {
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of iTwin group members and their roles assignments.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Array of members
   */
  public async queryITwinGroupMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<GroupMember[]>> {
    let url = `${this._baseUrl}/${iTwinId}/members/groups`;

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

  /** Retrieves a specific group member for a specified iTwin.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns Member
   */
  public async getITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<GroupMember>> {
    const url = `${this._baseUrl}/${iTwinId}/members/groups/${memberId}`;
    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
      "member"
    );
  }

  /** Add new iTwin group members
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param newMembers The list of new members to be added along with their role
   * @returns Member[]
   */
  public async addITwinGroupMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: GroupMember[]
  ): Promise<AccessControlAPIResponse<GroupMember[]>> {
    const url = `${this._baseUrl}/${iTwinId}/members/groups`;
    const body = {
      members: newMembers,
    };
    return this.sendGenericAPIRequest(
      accessToken,
      "POST",
      url,
      body,
      "members"
    );
  }

  /** Remove the specified group member from the iTwin
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns No Content
   */
  public async removeITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/groups/${memberId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }

  /** Update iTwin group member roles
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @param roleIds The ids of the roles to be assigned
   * @returns Member
   */
  public async updateITwinGroupMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<AccessControlAPIResponse<GroupMember>> {
    const url = `${this._baseUrl}/${iTwinId}/members/groups/${memberId}`;
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
