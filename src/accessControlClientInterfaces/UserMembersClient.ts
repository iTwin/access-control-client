/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import type { AddUserMember, AddUserMemberResponse, MultipleUserMembersResponse, SingleUserMemberResponse } from "../types/UserMembers";


export interface IUserMembersClient {
  /** Retrieves a list of user members and their roles assigned to a specified iTwin. */
  queryITwinUserMembers(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: Pick<ODataQueryParams, "top" | "skip">
  ): Promise<BentleyAPIResponse<MultipleUserMembersResponse>>;

  /** Retrieves a specific user member for a specified iTwin. */
  getITwinUserMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<SingleUserMemberResponse>>

  /** Add or invite new iTwin user members */
  addITwinUserMembers(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: AddUserMember[],
    customMessage?: string
  ): Promise<BentleyAPIResponse<AddUserMemberResponse>>;

  /**  Remove the specified iTwin user member */
  removeITwinUserMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<BentleyAPIResponse<undefined>>;

  /**  Update iTwin user member roles */
  updateITwinUserMember(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<BentleyAPIResponse<SingleUserMemberResponse>>;
}
