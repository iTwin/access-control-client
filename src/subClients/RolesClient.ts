/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse, IRolesClient, NewRole, Role } from "../accessControlTypes";
import { BaseClient } from "./BaseClient";

export class RolesClient extends BaseClient implements IRolesClient{
  /** Retrieves a list of available user roles that are defined for a specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Roles
    */
  public async getITwinRolesAsync(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<AccessControlAPIResponse<Role[]>>{
    const url = `${this._baseUrl}/${iTwinId}/roles`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "roles");
  }

  /** Retrieves the specified role for the specified iTwin
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @returns Role
    */
  public async getITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
  ): Promise<AccessControlAPIResponse<Role>>{
    const url = `${this._baseUrl}/${iTwinId}/roles/${roleId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

  /** Creates a new iTwin Role
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param role The role to be created
    * @returns Role
    */
  public async createITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    role: NewRole
  ): Promise<AccessControlAPIResponse<Role>>{
    const url = `${this._baseUrl}/${iTwinId}/roles`;
    return this.sendGenericAPIRequest(accessToken, "POST", url, role, "role");
  }

  /** Delete the specified iTwin role
    * @param accessToken The client access token string
    * @param iTwinId The id of the iTwin
    * @param roleId The id of the role to remove
    * @returns No Content
    */
  public async deleteITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
  ): Promise<AccessControlAPIResponse<undefined>>{
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
  public async updateITwinRoleAsync(
    accessToken: AccessToken,
    iTwinId: string,
    roleId: string,
    role: NewRole
  ): Promise<AccessControlAPIResponse<Role>>{
    const url = `${this._baseUrl}/${iTwinId}/roles/${roleId}`;
    return this.sendGenericAPIRequest(accessToken, "PATCH", url, role, "role");
  }
}
