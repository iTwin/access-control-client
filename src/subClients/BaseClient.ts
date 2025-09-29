/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse, AccessControlQueryArg } from "../accessControlTypes";

// Custom types to replace axios types
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  headers?: Record<string, string>;
  validateStatus?: (status: number) => boolean;
}

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
    * @param accessToken The client access token
    * @param method The method type of the request (ex. GET, POST, DELETE, etc)
    * @param url The url of the request
    */
  protected async sendGenericAPIRequest(
    accessToken: AccessToken,
    method: HttpMethod,
    url: string,
    data?: any,
    property?: string,
    additionalHeaders?: { [key: string]: string }
  ): Promise<AccessControlAPIResponse<any>> { // TODO: Change any response
    const requestOptions = this.getRequestOptions(accessToken, method, url, data, additionalHeaders);
    try {
      const response = await fetch(requestOptions.url, {
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: requestOptions.data ? JSON.stringify(requestOptions.data) : undefined,
      });

      let responseData: any;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Convert Headers object to plain object for compatibility
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        status: response.status,
        data: responseData?.error || responseData === "" ? undefined : property ? responseData[property] : responseData,
        error: responseData?.error,
        headers,
      };
    } catch (err) {
      return {
        status: 500,
        error: {
          code: "InternalServerError",
          message:
            "An internal exception happened while calling iTwins Service",
        },
        headers: {},
      };
    }
  }

  /**
    * Build the request methods, headers, and other options
    * @param accessToken The client access token
    */
  protected getRequestOptions(accessToken: AccessToken, method: HttpMethod, url: string, data?: any, additionalHeaders?: { [key: string]: string }): RequestConfig {
    return {
      method,
      url,
      data,
      headers: {
        "authorization": accessToken,
        "content-type": "application/json",
        "accept": "application/vnd.bentley.itwin-platform.v2+json",
        ...additionalHeaders,
      },
      validateStatus(status: number) {
        return status < 500; // Resolve only if the status code is less than 500
      },
    };
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
    return queryString.replace(/^&+/, "");
  }
}
