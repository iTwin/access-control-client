/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type {
  AccessControlQueryArg,
} from "../accessControlTypes";
import type { BentleyAPIResponse } from "../types/CommonApiTypes";
import { MultipleMemberInvitationResponse } from "../types/Invitations";
import { IMemberInvitationsClient } from "./accessControlClientInterfaces/IMemberInvitationsClient";
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
    arg?: Omit<AccessControlQueryArg, "result">
  ): Promise<BentleyAPIResponse<MultipleMemberInvitationResponse>> {
    let url = `${this._baseUrl}/${iTwinId}/members/invitations`;

    if (arg) {
      url += `?${this.getQueryString(MemberInvitationsClient.paginationParamMapping, { top: arg.top, skip: arg.skip })}`;
    }

    return this.sendGenericAPIRequest(
      accessToken,
      "GET",
      url,
      undefined,
    );
  }

  public async deleteITwinMemberInvitationAsync(
    accessToken: AccessToken,
    iTwinId: string,
    invitationId: string
  ): Promise<BentleyAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/invitations/${invitationId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }
}
