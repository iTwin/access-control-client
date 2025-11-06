/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse } from "../types/CommonApiTypes";
import type { Role } from "../types/Role";
import { BaseClient } from "./BaseClient";
import { IRolesClient } from "./accessControlClientInterfaces/RolesClient";


export class RolesClient extends BaseClient implements IRolesClient {
  public constructor(url?: string) {
    super(url);
  }

  /** Retrieves a list of available user roles that are defined for a specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Roles
    */
  public async getITwinRoles(
    accessToken: AccessToken,
    iTwinId: string,
    additionalHeaders?: Record<string, string>
  ): Promise<BentleyAPIResponse<Role[]>> {
    const url = `${this._baseUrl}/${iTwinId}/roles`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "roles", additionalHeaders);
  }

  /** Retrieves the specified role for the specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Role
    */
  public async getITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
  ): Promise<BentleyAPIResponse<Role>> {
    const url = `${this._baseUrl}/${iTwinId}/roles/${roleId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "role");
  }

  /** Creates a new iTwin Role
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param role The role to be created
    * @returns Role
    */
  public async createITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    role: Role
  ): Promise<BentleyAPIResponse<Role>> {
    const url = `${this._baseUrl}/${iTwinId}/roles`;
    return this.sendGenericAPIRequest(accessToken, "POST", url, role, "role");
  }

  /** Delete the specified iTwin role
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param roleId The id of the role to remove
    * @returns No Content
    */
  public async deleteITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
  ): Promise<BentleyAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/roles/${roleId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }

  /** Update the specified iTwin role
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param roleId The id of the role to update
    * @param role The updated role
    * @returns Role
    */
  public async updateITwinRole(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
    role: Role
  ): Promise<BentleyAPIResponse<Role>> {
    const url = `${this._baseUrl}/${iTwinId}/roles/${roleId}`;
    return this.sendGenericAPIRequest(accessToken, "PATCH", url, role, "role");
  }
}
