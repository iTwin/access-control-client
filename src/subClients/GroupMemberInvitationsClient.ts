/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";
import type { MultipleGroupMemberInvitationResponse } from "../access-control-client";
import type { IGroupMemberInvitationClient } from "../accessControlClientInterfaces/GroupMemberInvitationClient";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import { BaseClient } from "./BaseClient";

/** Client API to perform iTwin group members operations.
 * @beta
 */
export class GroupMemberInvitationClient
  extends BaseClient
  implements IGroupMemberInvitationClient {
  /** Create a new GroupMembersClient instance
   * @param url Optional base URL for the access control service. If not provided, defaults to base url.
   */
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of iTwin group members and their roles assignments.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @beta
   * @returns Array of members
   */
  public async queryITwinGroupMemberInvitations(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<MultipleGroupMemberInvitationResponse>> {
    let url = `${this._baseUrl}/${iTwinId}/groups/${groupId}/invitations`;

    if (arg) {
      url += `?${this.getQueryString(GroupMemberInvitationClient.paginationParamMapping, { top: arg.top, skip: arg.skip })}`;
    }

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
    );
  }

    /** Deletes a member invitations.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param invitationId The id of the invitation id
   * @beta
   * @returns Array of member invitations
   */
  public async deleteITwinGroupMemberInvitation(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
    invitationId: string
  ): Promise<BentleyAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/groups/${groupId}/invitations/${invitationId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }
}
