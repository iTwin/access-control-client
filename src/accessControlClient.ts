/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { Method } from "axios";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { AccessControl, AccessControlAPIResponse, AccessControlQueryArg, MemberResponse, MembersResponse, NewMember, NewRole, PermissionsResponse, Role, RoleResponse, RolesResponse } from "./accessControlProps";

export class AccessControlClient implements AccessControl{
  private _baseUrl: string = "https://api.bentley.com/accesscontrol/itwins";

  public constructor() {
    const urlPrefix = process.env.IMJS_URL_PREFIX;
    if (urlPrefix) {
      const baseUrl = new URL(this._baseUrl);
      baseUrl.hostname = urlPrefix + baseUrl.hostname;
      this._baseUrl = baseUrl.href;
    }
  }

  // #region Permissions

  /** Retrieves the list of all available permissions
   * @param accessToken The client access token string
   * @returns Array of permissions
   */
  public async getPermissionsAsync(
    accessToken: AccessToken,
  ): Promise<AccessControlAPIResponse<PermissionsResponse>>{
    const url = `${this._baseUrl}/permissions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

  /** Retrieves a list of permissions the identity has for a specified iTwin
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Array of permissions
   */
  public async getITwinPermissionsAsync(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<AccessControlAPIResponse<PermissionsResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/permissions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

  // #endregion Permissions

  // #region Members

  /** Retrieves a list of iTwin members and their roles assignments.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Array of members
   */
  public async queryITwinMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    arg?: AccessControlQueryArg
  ): Promise<AccessControlAPIResponse<MembersResponse>>{
    let url = `${this._baseUrl}/${iTwinId}/members`;
    if (arg) url += `?${this.getQueryString(arg)}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url); // TODO: Consider how to handle paging
  }

  /** Retrieves a specific member for a specified iTwin.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns Member
   */
  public async getITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<MemberResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/members/${memberId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

  /** Add new iTwin members
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param newMembers The list of new members to be added along with their role
   * @returns No Content
   */
  public async addITwinMembersAsync(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: NewMember[]
  ): Promise<AccessControlAPIResponse<undefined>>{
    const url = `${this._baseUrl}/${iTwinId}/members`;
    const body = {
      members: newMembers,
    };
    return this.sendGenericAPIRequest(accessToken, "POST", url, body);
  }

  /** Remove the specified member from the iTwin
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns No Content
   */
  public async removeITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string
  ): Promise<AccessControlAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/members/${memberId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }

  /** Update iTwin team member roles
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @param roleIds The ids of the roles to be assigned
   * @returns Member
   */
  public async updateITwinMemberAsync(
    accessToken: AccessToken,
    iTwinId: string,
    memberId: string,
    roleIds: string[]
  ): Promise<AccessControlAPIResponse<MemberResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/members/${memberId}`;
    const body = {
      roleIds,
    };
    return this.sendGenericAPIRequest(accessToken, "PATCH", url, body);
  }

  // #endregion Members

  // #region Roles

  /** Retrieves a list of available user roles that are defined for a specified iTwin
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Roles
   */
  public async getITwinRolesAsync(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<AccessControlAPIResponse<RolesResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/roles`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
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
  ): Promise<AccessControlAPIResponse<RoleResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/roles`;
    return this.sendGenericAPIRequest(accessToken, "POST", url, role);
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
  ): Promise<AccessControlAPIResponse<RoleResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/roles/${roleId}`;
    return this.sendGenericAPIRequest(accessToken, "PATCH", url, role);
  }

  // #endregion Roles

  // #region Helper Methods

  /**
   * Sends a basic API request
   * @param accessTokenString The client access token string
   * @param method The method type of the request (ex. GET, POST, DELETE, etc)
   * @param url The url of the request
   */
  private async sendGenericAPIRequest(
    accessToken: AccessToken,
    method: Method,
    url: string,
    data?: any
  ): Promise<AccessControlAPIResponse<any>> { // TODO: Change any response
    const requestOptions = this.getRequestOptions(accessToken, method, url, data);

    try {
      const response = await axios(requestOptions);

      return {
        status: response.status,
        data: response.data.error || response.data === "" ? undefined : response.data,
        error: response.data.error,
      };
    } catch (err) {
      return {
        status: 500,
        error: {
          code: "InternalServerError",
          message:
            "An internal exception happened while calling iTwins Service",
        },
      };
    }
  }

  /**
   * Build the request methods, headers, and other options
   * @param accessTokenString The client access token string
   */
  private getRequestOptions(accessTokenString: string, method: Method, url: string, data?: any): AxiosRequestConfig {
    return {
      method,
      url,
      data,
      headers: {
        "authorization": accessTokenString,
        "content-type": "application/json",
      },
      validateStatus(status) {
        return status < 500; // Resolve only if the status code is less than 500
      },
    };
  }

  /**
   * Build a query to be appended to a URL
   * @param queryArg Object container queryable properties
   * @returns query string with AccessControlQueryArg applied, which should be appended to a url
   */
  private getQueryString(queryArg: AccessControlQueryArg): string {
    let queryString = "";

    if (queryArg.top) {
      queryString += `&$top=${queryArg.top}`;
    }

    if (queryArg.skip) {
      queryString += `&$skip=${queryArg.skip}`;
    }

    // trim & from start of string
    queryString.replace(/^&+/, "");

    return queryString;
  }

  // #endregion Helper Methods
}
