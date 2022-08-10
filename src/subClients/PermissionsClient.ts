/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse, IPermissionsClient, Permission } from "../accessControlTypes";
import { BaseClient } from "./BaseClient";

export class PermissionsClient extends BaseClient implements IPermissionsClient{
  /** Retrieves the list of all available permissions
    * @param accessToken The client access token string
    * @returns Array of permissions
    */
  public async getPermissionsAsync(
    accessToken: AccessToken,
  ): Promise<AccessControlAPIResponse<Permission[]>>{
    const url = `${this._baseUrl}/permissions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "permissions");
  }

  /** Retrieves a list of permissions the identity has for a specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Array of permissions
    */
  public async getITwinPermissionsAsync(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<AccessControlAPIResponse<Permission[]>>{
    const url = `${this._baseUrl}/${iTwinId}/permissions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "permissions");
  }
}
