/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";
import type { IMemberInvitationsClient } from "../accessControlClientInterfaces/MemberInvitationsClient";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import type { MultipleMemberInvitationResponse, SingleMemberInvitationResponse } from "../types/Invitations";
import { BaseClient } from "./BaseClient";

/** Client API to perform iTwin member invitation operations.
 */
export class MemberInvitationsClient
  extends BaseClient
  implements IMemberInvitationsClient {
  /** Create a new MemberInvitationsClient instance
   * @param url Optional base URL for the access control service. If not provided, defaults to base url.
   */
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

  /** Deletes a member invitations.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param invitationId The id of the invitation id
   * @returns No Content
   */
  public async deleteITwinMemberInvitation(
    accessToken: AccessToken,
    iTwinId: string,
    invitationId: string
  ): Promise<BentleyAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/invitations/${invitationId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }

  /** Accepts a member invitation.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param invitationId The id of the invitation id
   * @returns No Content
   * @beta
   * @remarks On success, the invited user is added as an iTwin member with the roles from all pending invitations for that user. After acceptance, all of that user’s pending invitations for the iTwin are consumed and can no longer be accessed.
   * If the invited user is already a member of the iTwin, the request is treated as a success. Only the invited user can accept this invitation through this API. The invited user must already exist as a member in IMS.
   */
  public async acceptITwinMemberInvitation(
    accessToken: AccessToken,
    iTwinId: string,
    invitationId: string
  ): Promise<BentleyAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/invitations/${invitationId}/accept`;
    return this.sendGenericAPIRequest(accessToken, "POST", url);
  }

    /** Deletes a member invitations.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param invitationId The id of the invitation id
   * @returns A member invitation or error object
   */
  public async getITwinMemberInvitation(accessToken: AccessToken, iTwinId: string, invitationId: string): Promise<BentleyAPIResponse<SingleMemberInvitationResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/invitations/${invitationId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

}
