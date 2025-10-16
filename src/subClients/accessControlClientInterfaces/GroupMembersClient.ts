/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlQueryArg } from "src/accessControlTypes";
import type { BentleyAPIResponse } from "src/types/CommonApiTypes";
import type { AddGroupMembers, MultipleGroupMembersResponse, SingleGroupMemberResponse } from "src/types/GroupMember";
import type { Links } from "src/types/links";

export interface IGroupMembersClient {
  /** Retrieves a list of group members and their roles assigned to a specified iTwin. */
  queryITwinGroupMembers(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
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
    newMembers: AddGroupMembers
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