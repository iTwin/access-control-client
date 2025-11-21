/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";
import type { IUserMembersClient } from "../accessControlClientInterfaces/UserMembersClient";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import type { AddUserMember, AddUserMemberResponse, MultipleUserMembersResponse, SingleUserMemberResponse } from "../types/UserMembers";
import { BaseClient } from "./BaseClient";

/** Client API to perform user members operations.
 */
export class UserMembersClient
  extends BaseClient
  implements IUserMembersClient {
  /** Create a new UserMembersClient instance
   * @param url Optional base URL for the access control service. If not provided, defaults to base url.
   */
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of iTwin user members and their roles assignments.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Array of members
   */
  public async queryITwinUserMembers(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<MultipleUserMembersResponse>> {
    let url = `${this._baseUrl}/${iTwinId}/members/users`;

    if (arg) {
      url += `?${this.getQueryString(UserMembersClient.paginationParamMapping, { top: arg.top, skip: arg.skip })}`;
    }

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined
    );
  }

  /** Retrieves a specific user member for a specified iTwin.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns Member
   */
  public async getITwinUserMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<SingleUserMemberResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/users/${memberId}`;
    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined
    );
  }

  /** Add new iTwin user members
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param newMembers The list of members to add or invite, along with their role
   * @param customMessage Send custom message in welcome email when adding new members
   * @returns AddUserMemberResponse -- the added or invited user members
   */
  public async addITwinUserMembers(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: AddUserMember[],
    customMessage?: string
  ): Promise<BentleyAPIResponse<AddUserMemberResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/users`;
    const body = {
      members: newMembers,
      customMessage,
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
  public async removeITwinUserMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>> {
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
  public async updateITwinUserMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<BentleyAPIResponse<SingleUserMemberResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/users/${memberId}`;
    const body = {
      roleIds,
    };
    return this.sendGenericAPIRequest(
      accessToken,
      "PATCH",
      url,
      body
    );
  }
}
