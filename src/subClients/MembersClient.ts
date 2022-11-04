/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse, AccessControlQueryArg, IMembersClient, Member } from "../accessControlTypes";
import { BaseClient } from "./BaseClient";

export class MembersClient extends BaseClient implements IMembersClient{
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of iTwin members and their roles assignments.
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Array of members
    */
  public async queryITwinMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<Member[]>>{
    let url = `${this._baseUrl}/${iTwinId}/members`;
    if (arg) url += `?${this.getQueryString(arg)}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "members"); // TODO: Consider how to handle paging
  }

  /** Retrieves a specific member for a specified iTwin.
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param memberId The id of the member
    * @returns Member
    */
  public async getITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<Member>>{
    const url = `${this._baseUrl}/${iTwinId}/members/${memberId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "member");
  }

  /** Add new iTwin members
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param newMembers The list of new members to be added along with their role
    * @returns Member[]
    */
  public async addITwinMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: Member[]
  ): Promise<AccessControlAPIResponse<Member[]>>{
    const url = `${this._baseUrl}/${iTwinId}/members`;
    const body = {
      members: newMembers,
    };
    return this.sendGenericAPIRequest(accessToken, "POST", url, body, "members");
  }

  /** Remove the specified member from the iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param memberId The id of the member
    * @returns No Content
    */
  public async removeITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/${memberId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }

  /** Update iTwin team member roles
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param memberId The id of the member
    * @param roleIds The ids of the roles to be assigned
    * @returns Member
    */
  public async updateITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<AccessControlAPIResponse<Member>> {
    const url = `${this._baseUrl}/${iTwinId}/members/${memberId}`;
    const body = {
      roleIds,
    };
    return this.sendGenericAPIRequest(accessToken, "PATCH", url, body, "member");
  }
}
