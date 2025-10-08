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
  AddOwnerMemberResponse,
  IOwnerMembersClient,
  OwnerMember,
} from "../accessControlTypes";
import { BaseClient } from "./BaseClient";

export class OwnerMembersClient
  extends BaseClient
  implements IOwnerMembersClient {
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of iTwin owner members on an iTwin.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Array of members
   */
  public async queryITwinOwnerMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<OwnerMember[]>> {
    let url = `${this._baseUrl}/${iTwinId}/members/owners`;

    if (arg) {
      url += `?${this.getQueryString(OwnerMembersClient.PAGINATION_PARAM_MAPPING, { top: arg.top, skip: arg.skip })}`;
    }

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
      "members"
    ); // TODO: Consider how to handle paging
  }

  /** Add new iTwin owner member
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param newMember The new owner member to add or invite
   * @returns AddOwnerMemberResponse -- the added or invited owner
   */
  public async addITwinOwnerMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMember: OwnerMember
  ): Promise<AccessControlAPIResponse<AddOwnerMemberResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/owners`;
    return this.sendGenericAPIRequest(
      accessToken,
      "POST",
      url,
      newMember
    );
  }

  /** Remove the specified owner member from the iTwin
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns No Content
   */
  public async removeITwinOwnerMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/owners/${memberId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }
}
