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
import type { AccessControlAPIResponse } from "./accessControlProps";

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

  /** Retrieves the list of all available permissions
   * @param accessToken The client access token string
   * @returns Array of permissions
   */
  public async getPermissions(
    accessToken: AccessToken,
  ): Promise<AccessControlAPIResponse<Permissions>>{
    const url = `${this._baseUrl}/permissions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

  /**
   * Sends a basic API request
   * @param accessTokenString The client access token string
   * @param method The method type of the request (ex. GET, POST, etc)
   * @param url The url of the request
   */
  private async sendGenericAPIRequest(
    accessToken: AccessToken,
    method: Method,
    url: string
  ): Promise<AccessControlAPIResponse<any>> { // TODO: Change any response
    const requestOptions = this.getRequestOptions(accessToken, method, url);

    try {
      const response = await axios(requestOptions);

      return {
        status: response.status,
        data: response.data.iTwin,
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
  private getRequestOptions(accessTokenString: string, method: Method, url: string): AxiosRequestConfig {
    return {
      method,
      url,
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
