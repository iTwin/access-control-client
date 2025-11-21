/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";
import type { IPermissionsClient } from "../accessControlClientInterfaces/PermissionsClient";
import type { BentleyAPIResponse } from "../types/CommonApiTypes";
import type { Permission } from "../types/Permission";
import { BaseClient } from "./BaseClient";

/** Client API to perform iTwin permission operations.
 */
export class PermissionsClient extends BaseClient implements IPermissionsClient{
  /** Create a new PermissionsClient instance
   * @param url Optional base URL for the access control service. If not provided, defaults to base url.
   */
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves the list of all available permissions
    * @param accessToken The client access token string
    * @returns Array of permissions
    */
  public async getPermissions(
    accessToken: AccessToken,
  ): Promise<BentleyAPIResponse<Permission[]>>{
    const url = `${this._baseUrl}/permissions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "permissions");
  }

  /** Retrieves a list of permissions the identity has for a specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Array of permissions
    */
  public async getITwinPermissions(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<BentleyAPIResponse<Permission[]>>{
    const url = `${this._baseUrl}/${iTwinId}/permissions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "permissions");
  }
}
