/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { AddOwnerMemberResponse, OwnerMember, OwnerMemberMultiResponse } from "../../types/OwnerMember";
import type { BentleyAPIResponse, ODataQueryParams } from "../../types/CommonApiTypes";


export interface IOwnerMembersClient {
  /** Retrieves a list of owner members on a specified iTwin. */
  queryITwinOwnerMembers(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<OwnerMemberMultiResponse>>;

  /** Add or invite new iTwin owner member */
  addITwinOwnerMember(
    accessToken: AccessToken,
    iTwinId: string,
    newMember : Pick<OwnerMember, "email">
  ): Promise<BentleyAPIResponse<AddOwnerMemberResponse>>;

  /**  Remove the specified iTwin owner member */
  removeITwinOwnerMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>>;
}