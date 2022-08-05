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
import type { AccessControlAPIResponse, MemberResponse, MembersResponse, NewMember, PermissionsResponse } from "./accessControlProps";

export class AccessControlClient { // Need interface
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
  public async getPermissions(
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
  public async getITwinPermissions(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<AccessControlAPIResponse<PermissionsResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/permissions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

  // #endregion Permissions

  // #region Members

  /** Retrieves a list of team members and their roles assigned to a specified iTwin.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @returns Array of members
   */
  public async getITwinMembers(
    accessToken: AccessToken,
    iTwinId: string
  ): Promise<AccessControlAPIResponse<MembersResponse>>{
    const url = `${this._baseUrl}/${iTwinId}/members`;
    return this.sendGenericAPIRequest(accessToken, "GET", url); // TODO: Consider how to handle paging
  }

  /** Retrieves a specific member for a specified iTwin.
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns Member
   */
  public async getITwinMember(
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
   * @returns // TODO: What to put here if nothing is returned
   */
  public async addITwinMembers(
    accessToken: AccessToken,
    iTwinId: string,
    newMembers: NewMember[]
  ): Promise<AccessControlAPIResponse<undefined>>{  // TODO: Probably not used undefined, maybe another Response object?
    const url = `${this._baseUrl}/${iTwinId}/members`;
    const body = {
      members: newMembers,
    };
    return this.sendGenericAPIRequest(accessToken, "POST", url, body);
  }

  /** Remove the specified iTwin member
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param memberId The id of the member
   * @returns // TODO: What to put here if nothing is returned
   */
  public async removeITwinMember(
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
  public async updateITwinMember(
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

  /**
   * Sends a basic API request
   * @param accessTokenString The client access token string
   * @param method The method type of the request (ex. GET, POST, etc)
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
        data: response.data,
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
}
