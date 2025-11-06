/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import { MultipleMemberInvitationResponse } from "../types/Invitations";
import { IMemberInvitationsClient } from "../accessControlClientInterfaces/MemberInvitationsClient";
import { BaseClient } from "./BaseClient";

export class MemberInvitationsClient
  extends BaseClient
  implements IMemberInvitationsClient {
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of iTwin member invitations.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Array of member invitations
   */
  public async queryITwinMemberInvitations(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<MultipleMemberInvitationResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/invitations${
      arg ? `?${this.getQueryString(MemberInvitationsClient.paginationParamMapping, { top: arg.top, skip: arg.skip })}` : ''
    }`;

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
    );
  }

  public async deleteITwinMemberInvitation(
    accessToken: AccessToken,
    iTwinId: string,
    invitationId: string
  ): Promise<BentleyAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/invitations/${invitationId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }
}
