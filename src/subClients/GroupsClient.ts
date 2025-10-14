/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse } from "../types/CommonApiTypes";
import type { Group, MultipleGroupsResponse, SingleGroupResponse } from "../types/Groups";
import type { IGroupsClient } from "./accessControlClientInterfaces/GroupClient";
import { BaseClient } from "./BaseClient";


export class GroupsClient extends BaseClient implements IGroupsClient{
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of available user roles that are defined for a specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Group[]
    */
  public async getITwinGroups(
    accessToken: AccessToken,
    iTwinId: string,
    additionalHeaders?: Record<string, string>
  ): Promise<BentleyAPIResponse<MultipleGroupsResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/groups`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, undefined, additionalHeaders);
  }

  /** Retrieves the specified role for the specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Group
    */
  public async getITwinGroup(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
  ): Promise<BentleyAPIResponse<SingleGroupResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/groups/${groupId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

  /** Creates a new iTwin group
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param group The group to be created
    * @returns Group
    */
  public async createITwinGroup(
    accessToken: AccessToken,
    iTwinId: string,
    group: Group
  ): Promise<BentleyAPIResponse<SingleGroupResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/groups`;
    return this.sendGenericAPIRequest(accessToken, "POST", url, group);
  }

  /** Delete the specified iTwin group
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param groupId The id of the group to remove
    * @returns No Content
    */
  public async deleteITwinGroupAsync(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
  ): Promise<BentleyAPIResponse<undefined>>{
    const url = `${this._baseUrl}/${iTwinId}/groups/${groupId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }

  /** Update the specified iTwin group
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param groupId The id of the role to update
    * @param group The updated group
    * @returns Group that was updated
    */
  public async updateITwinGroup(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
    group: Partial<Pick<Group, "name" | "description"> & { members: string[]; imsGroups: string[] }>
  ): Promise<BentleyAPIResponse<SingleGroupResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/groups/${groupId}`;
    return this.sendGenericAPIRequest(accessToken, "PATCH", url, group);
  }
}
