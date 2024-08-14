/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse, AccessControlQueryArg } from "../accessControlTypes";

export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

export class BaseClient {
  protected _baseUrl: string = "https://api.bentley.com/accesscontrol/itwins";

  public constructor(url?: string) {
    if (url !== undefined) {
      this._baseUrl = url;
    } else {
      const urlPrefix = process.env.IMJS_URL_PREFIX;
      if (urlPrefix) {
        const baseUrl = new URL(this._baseUrl);
        baseUrl.hostname = urlPrefix + baseUrl.hostname;
        this._baseUrl = baseUrl.href;
      }
    }
  }

  /**
    * Sends a basic API request
    * @param accessTokenString The client access token string
    * @param method The method type of the request (ex. GET, POST, DELETE, etc)
    * @param url The url of the request
    */
  protected async sendGenericAPIRequest(
    accessToken: AccessToken,
    method: Method,
    url: string,
    data?: any,
    property?: string,
    additionalHeaders?: { [key: string]: string }
  ): Promise<AccessControlAPIResponse<any>> { // TODO: Change any response
    const requestOptions = this.getRequestOptions(accessToken, method, url, data, additionalHeaders);
    console.log('LOG[54]: requestOptions ' + JSON.stringify(requestOptions, null, 2));

    try {
      const response = await fetch(requestOptions.url, requestOptions);
      console.log('LOG[58]: response ' + JSON.stringify(response, null, 2));
      console.log('LOG[58]: response.status ' + JSON.stringify(response.status, null, 2));

      const responseData = await response.json();
      console.log('LOG[58]: responseData ' + JSON.stringify(responseData, null, 2));

      return {
        status: response.status,
        data: responseData.error || responseData === "" ? undefined : property ? responseData[property] : responseData,
        error: responseData.error,
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
    * @param method The method type of the request (ex. GET, POST, DELETE, etc)
    * @param url The url of the request
    * @param data The data to be sent in the request body
    * @param additionalHeaders Additional headers to be included in the request
    */
  private getRequestOptions(
    accessToken: AccessToken,
    method: Method,
    url: string,
    data?: any,
    additionalHeaders?: { [key: string]: string }
  ): RequestInit & { url: string } {
    const headers: HeadersInit = {
      "Authorization": accessToken,
      "Content-Type": "application/json",
      "accept": "application/vnd.bentley.itwin-platform.v2+json",
      ...additionalHeaders,
    };

    const requestOptions: RequestInit & { url: string } = {
      method,
      headers,
      url
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    return requestOptions;
  }


  /**
    * Build a query to be appended to a URL
    * @param queryArg Object container queryable properties
    * @returns query string with AccessControlQueryArg applied, which should be appended to a url
    */
  protected getQueryString(queryArg: AccessControlQueryArg): string {
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
}