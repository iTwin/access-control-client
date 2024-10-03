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
  IMemberInvitationsClient,
  MemberInvitation,
} from "../accessControlTypes";
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
  public async queryITwinMemberInvitationsAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<MemberInvitation[]>> {
    let url = `${this._baseUrl}/${iTwinId}/members/invitations`;

    if (arg) {
      url += `?${this.getQueryString(arg)}`;
    }

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
      "invitations"
    );
  }

  public async deleteITwinMemberInvitationAsync(
    accessToken: AccessToken,
    iTwinId: string,
    invitationId: string
  ): Promise<AccessControlAPIResponse<undefined>> {
    let url = `${this._baseUrl}/${iTwinId}/members/invitations/${invitationId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }
}
