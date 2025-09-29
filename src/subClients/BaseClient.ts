/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type {
  AccessControlAPIResponse,
  AccessControlQueryArg,
  Error as ApimError,
} from "../accessControlTypes";

interface RequestConfig {
  method: Method;
  url: string;
  body?: string | Blob;
  headers: Record<string, string>;
}

// TODO : Caleb clean up this file and move these types when work starts on cleaning up this client
/**
 * Type guard to check if an object has a specific property and narrows the type to Record<string, unknown>
 * @param obj - Unknown object to check for property existence
 * @param prop - Property key name to check for
 * @returns True if the object has the specified property, false otherwise
 *
 * @example
 * ```typescript
 * const data: unknown = { name: "John", age: 30 };
 * if (hasProperty(data, "name")) {
 *   console.log(data.name); // ✅ Type-safe access
 * }
 * ```
 */
export function hasProperty(
  obj: unknown,
  prop: string
): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && prop in obj;
}

/**
 * Type guard to validate if an object is a valid Error structure
 * @param error - Unknown object to validate
 * @returns True if the object is a valid Error type
 */
function isValidError(error: unknown): error is ApimError {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const obj = error as Record<string, unknown>;
  return typeof obj.code === "string" && typeof obj.message === "string";
}

/**
 * Type guard to validate if response data contains an error
 * @param data - Unknown response data to validate
 * @returns True if the data contains a valid Error object
 */
function isErrorResponse(data: unknown): data is { error: ApimError } {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  return "error" in obj && isValidError(obj.error);
}

/**
 * Common HTTP methods used in API requests
 */
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

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
  ): Promise<AccessControlAPIResponse<any>> {
    // TODO: Change any response
    try {
      const requestOptions = this.createRequestOptions(
        accessToken,
        method,
        url,
        data,
        additionalHeaders
      );

      const response = await fetch(requestOptions.url, {
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: requestOptions.body,
      });
      const responseData =
        response.status !== 204 ? await response.json() : undefined;

      if (!response.ok) {
        if (isErrorResponse(responseData)) {
          return {
            status: response.status,
            error: responseData.error,
            headers: response.headers,
          };
        }
        throw new Error("An error occurred while processing the request");
      }
      return {
        status: response.status,
        data:
          responseData === undefined || responseData === ""
            ? undefined
            : property && hasProperty(responseData, property)
            ? responseData[property]
            : responseData,
        headers: response.headers,
      };
    } catch {
      // Return generic error for security - don't expose internal exception details
      return {
        status: 500,
        error: {
          code: "InternalServerError",
          message:
            "An internal exception happened while calling iTwins Service",
        },
        headers: additionalHeaders ?? {},
      };
    }
  }

  /**
   * Creates request configuration options with authentication headers.
   * Validates required parameters and sets up proper content type for JSON requests.
   *
   * @param accessTokenString - The client access token string for authorization
   * @param method - The HTTP method type (GET, POST, DELETE, etc.)
   * @param url - The complete URL of the request endpoint
   * @param data - Optional payload data to be JSON stringified for the request body
   * @param headers - Optional additional request headers to include
   * @returns RequestConfig object with method, URL, body, and headers configured
   * @throws Will throw an error if access token or URL are missing/invalid
   */
  protected createRequestOptions<TData>(
    accessTokenString: string,
    method: Method,
    url: string,
    data?: TData,
    headers: Record<string, string> = {}
  ): RequestConfig {
    if (!accessTokenString) {
      throw new Error("Access token is required");
    }

    if (!url) {
      throw new Error("URL is required");
    }
    let body: string | Blob | undefined;
    if (!(data instanceof Blob)) {
      body = JSON.stringify(data);
    } else {
      body = data;
    }
    return {
      method,
      url,
      body,
      headers: {
        ...headers,
        authorization: accessTokenString,
        "content-type":
          headers.contentType || headers["content-type"]
            ? headers.contentType || headers["content-type"]
            : "application/json",
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
    queryString.replace(/^&+/, "");

    return queryString;
  }
}
