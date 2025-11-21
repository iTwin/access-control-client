/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import type { GroupMemberAssignment, MultipleGroupMembersResponse, SingleGroupMemberResponse } from "../types/GroupMember";
import type { Links } from "../types/links";

export interface IGroupMembersClient {
  /** Retrieves a list of group members and their roles assigned to a specified iTwin. */
  queryITwinGroupMembers(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ):  Promise<BentleyAPIResponse<MultipleGroupMembersResponse &
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
    _links: Links
    }
    >>;

  /** Retrieves a specific group member for a specified iTwin. */
  getITwinGroupMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<SingleGroupMemberResponse>>;

  /** Add new iTwin group members */
  addITwinGroupMembers(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: GroupMemberAssignment
  ): Promise<BentleyAPIResponse<MultipleGroupMembersResponse>>;

  /**  Remove the specified iTwin group member */
  removeITwinGroupMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>>;

  /**  Update iTwin group member roles */
  updateITwinGroupMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<BentleyAPIResponse<SingleGroupMemberResponse>>;
}