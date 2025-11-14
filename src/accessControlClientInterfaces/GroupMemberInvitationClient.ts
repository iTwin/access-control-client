/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import type { MultipleMemberInvitationResponse } from "../types/Invitations";

export interface IGroupMemberInvitationClient {
  /** Retrieves a list of iTwin group member invitations.
   * @beta
  */
  queryITwinGroupMemberInvitations(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<MultipleMemberInvitationResponse>>;

  /** Removes an existing iTwin group member invitation.
   * @beta
  */
  deleteITwinGroupMemberInvitation(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
    invitationId: string
  ): Promise<BentleyAPIResponse<undefined>>;
}