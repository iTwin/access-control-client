/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse, Group, IGroupsClient } from "../accessControlTypes";
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
  public async getITwinGroupsAsync(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<AccessControlAPIResponse<Group[]>>{
    const url = `${this._baseUrl}/${iTwinId}/groups`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "groups");
  }

  /** Retrieves the specified role for the specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Group
    */
  public async getITwinGroupAsync(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
  ): Promise<AccessControlAPIResponse<Group>>{
    const url = `${this._baseUrl}/${iTwinId}/groups/${groupId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "group");
  }

  /** Creates a new iTwin group
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param group The group to be created
    * @returns Group
    */
  public async createITwinGroupAsync(
    accessToken: AccessToken,
    iTwinId: string,
    group: Group
  ): Promise<AccessControlAPIResponse<Group>>{
    const url = `${this._baseUrl}/${iTwinId}/groups`;
    return this.sendGenericAPIRequest(accessToken, "POST", url, group, "group");
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
  ): Promise<AccessControlAPIResponse<undefined>>{
    const url = `${this._baseUrl}/${iTwinId}/groups/${groupId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }

  /** Update the specified iTwin group
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param groupId The id of the role to update
    * @param group The updated group
    * @returns Role
    */
  public async updateITwinGroupAsync(
    accessToken: AccessToken,
    iTwinId: string,
    groupId: string,
    group: Group
  ): Promise<AccessControlAPIResponse<Group>>{
    const url = `${this._baseUrl}/${iTwinId}/groups/${groupId}`;
    return this.sendGenericAPIRequest(accessToken, "PATCH", url, group, "group");
  }
}
