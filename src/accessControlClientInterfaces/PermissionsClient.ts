/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse } from "../types/CommonApiTypes";
import type { Permission } from "../types/Permission";

export interface IPermissionsClient {
  /** Retrieves the list of all available permissions **/
  getPermissions(
    accessToken: AccessToken
  ): Promise<BentleyAPIResponse<Permission[]>>;

  /** Retrieves a list of permissions the identity has for a specified iTwin */
  getITwinPermissions(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<BentleyAPIResponse<Permission[]>>;
}