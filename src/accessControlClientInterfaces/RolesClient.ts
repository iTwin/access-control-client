/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse } from "../types/CommonApiTypes";
import type { Role } from "../types/Role";


export interface IRolesClient {
  /** Retrieves a list of roles the for a specified iTwin */
  getITwinRoles(
    accessToken: AccessToken,
    iTwinId: string,
    additionalHeaders?: Record<string, string>
  ): Promise<BentleyAPIResponse<Role[]>>;

  /** Retrieves a role for a specified iTwin */
  getITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string
  ): Promise<BentleyAPIResponse<Role>>;

  /** Creates a new iTwin Role */
  createITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    role: Role
  ): Promise<BentleyAPIResponse<Role>>;

  /** Removes an existing iTwin Role */
  deleteITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string
  ): Promise<BentleyAPIResponse<undefined>>;

  /** Updates an existing iTwin Role */
  updateITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
    role: Role
  ): Promise<BentleyAPIResponse<Role>>;
}