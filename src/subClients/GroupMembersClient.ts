/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import type { AddGroupMembers, MultipleGroupMembersResponse, SingleGroupMemberResponse } from "../types/GroupMember";
import type { Links } from "../types/links";
import type { IGroupMembersClient } from "../accessControlClientInterfaces/GroupMembersClient";
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
  public async queryITwinGroupMembers(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<MultipleGroupMembersResponse &
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links
  }
  >> {
    let url = `${this._baseUrl}/${iTwinId}/members/groups`;

    if (arg) {
      url += `?${this.getQueryString(GroupMembersClient.paginationParamMapping, { top: arg.top, skip: arg.skip })}`;
    }

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
    );
  }

  /** Retrieves a specific group member for a specified iTwin.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns Member
   */
  public async getITwinGroupMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<SingleGroupMemberResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/members/groups/${memberId}`;
    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
    );
  }

  /** Add new iTwin group members
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param newMembers The list of new members to be added along with their role
   * @returns Member[]
   */
  public async addITwinGroupMembers(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: AddGroupMembers
  ): Promise<BentleyAPIResponse<MultipleGroupMembersResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/groups`;
    return this.sendGenericAPIRequest(
      accessToken,
      "POST",
      url,
      newMembers,
    );
  }

  /** Remove the specified group member from the iTwin
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns No Content
   */
  public async removeITwinGroupMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>> {
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
  public async updateITwinGroupMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<BentleyAPIResponse<SingleGroupMemberResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/groups/${memberId}`;
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
