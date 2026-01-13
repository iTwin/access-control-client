/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ODataQueryParams } from "../types/CommonApiTypes";
import type { Group, GroupsResponseWithConditionalLinks, SingleGroupResponse } from "../types/Groups";

export interface IGroupsClient {
  /** Retrieves a list of groups the for a specified iTwin */
  getITwinGroups<T extends Pick<ODataQueryParams, "top" | "skip"> | undefined = undefined>(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: T
  ): Promise<BentleyAPIResponse<GroupsResponseWithConditionalLinks<T>>>;

  /** Retrieves a group for a specified iTwin */
  getITwinGroup(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string
  ): Promise<BentleyAPIResponse<SingleGroupResponse>>;

  /** Creates a new iTwin group */
  createITwinGroup(
    accessToken: AccessToken,
    iTwinId: string,
    group: Pick<Group, "name" | "description">
  ): Promise<BentleyAPIResponse<SingleGroupResponse>>;

  /** Removes an existing iTwin group */
  deleteITwinGroup(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string
  ): Promise<BentleyAPIResponse<undefined>>;

  /** Updates an existing iTwin group */
  updateITwinGroup(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
    group: Partial<Pick<Group, "name" | "description"> & { members: string[]; imsGroups: string[] }>
  ): Promise<BentleyAPIResponse<SingleGroupResponse>>;
}