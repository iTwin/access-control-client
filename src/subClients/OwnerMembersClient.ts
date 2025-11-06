/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import type { AddOwnerMemberResponse, OwnerMember, OwnerMemberMultiResponse } from "../types/OwnerMember";
import type { IOwnerMembersClient } from "../accessControlClientInterfaces/OwnerMembersClient ";
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
   * @param arg Optional query parameters for pagination (top, skip)
   * @returns Array of owner members, including any "missing users" with null profile data
   * @remarks
   * **Missing Users**
   *
   * When members are removed from the Bentley Identity Management System, they are not
   * automatically removed from the iTwin. Therefore, it is possible to have a situation
   * where the user is no longer valid, yet they are still a member of the iTwin. When
   * this happens, the user member will be returned from this API endpoint with the
   * following values:
   *
   * ```json
   * {
   *     "id": "<memberId>",
   *     "email": null,
   *     "givenName": null,
   *     "surname": null,
   *     "organization": null,
   *     ...
   * }
   * ```
   *
   * You should account for this in your software if you do not want to show these users.
   *
   * **Cleanup**
   *
   * The Access Control API will perform a once-a-week cleanup to remove these "Missing Users".
   * You can rely on this automated clean-up if this timeline is sufficient.
   *
   * If not, you can use the Remove iTwin Owner Member API (use the memberId) to remove
   * the owner member from the iTwin.
   *
   */
  public async queryITwinOwnerMembers(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<OwnerMemberMultiResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/owners${
      arg ? `?${this.getQueryString(OwnerMembersClient.paginationParamMapping, { top: arg.top, skip: arg.skip })}` : ''
    }`;

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
    );
  }

  /** Add new iTwin owner member.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param newMember The new owner member to add or invite
   * @returns AddOwnerMemberResponse -- the added or invited owner
   */
  public async addITwinOwnerMember(
    accessToken: AccessToken,
    iTwinId: string,
    newMember: Pick<OwnerMember, "email">
  ): Promise<BentleyAPIResponse<AddOwnerMemberResponse>> {
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
  public async removeITwinOwnerMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/owners/${memberId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }
}
