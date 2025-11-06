/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ODataQueryParams } from "../../types/CommonApiTypes";
import type { MultipleMemberInvitationResponse } from "../../types/Invitations";

export interface IMemberInvitationsClient {
  /** Retrieves a list of member invitations. */
  queryITwinMemberInvitations(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<MultipleMemberInvitationResponse>>;

  /** Removes an existing member invitation. */
  deleteITwinMemberInvitation(
    accessToken: AccessToken,
    iTwinId: string,
    invitationId: string
  ): Promise<BentleyAPIResponse<undefined>>;
}