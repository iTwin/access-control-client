/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

import type { AccessToken } from "@itwin/core-bentley";
import type {
  ApimError,
  BentleyAPIResponse,
  Method,
  ODataQueryParams,
  RequestConfig,
} from "../types/CommonApiTypes";
import { hasProperty, ParameterMapping } from "../types/typeUtils";

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
 * Base client class providing common functionality for Access Control API requests.
 * Handles authentication, request configuration, and query string building, and error validation.
 */
export class BaseClient {
  protected _baseUrl: string = "https://api.bentley.com/accesscontrol/itwins";

    /**
   * Creates a new BaseClient instance for Access Control API operations
   * @param url - Optional custom base URL, defaults to production iTwins API URL
   *
   * @example
   * ```typescript
   * // Use default production URL
   * const client = new BaseClient();
   *
   * // Use custom URL for development/testing
   * const client = new ITwinsAccessClient("https://api.bentley.com/accesscontrol/itwins");
   * ```
   */
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
   * Maps the some properties of {@link ODataQueryParams} to their corresponding query parameter names.
   *
   * @remarks
   * This mapping is used to translate internal property names to the expected parameter names
   * when constructing requests. Properties mapped to empty strings are excluded from
   * the query string as they should be sent as headers instead.
   *
   * The mapping includes OData query parameters (prefixed with $) for pagination.
   *
   * @readonly
   */
  protected static readonly paginationParamMapping: ParameterMapping<Pick<ODataQueryParams, "top" | "skip">> =
    {
      top: "$top",
      skip: "$skip",
    } as const;

  /**
   * Sends a basic API request to the specified URL with the given method and data.
   * @param accessToken The client access token
   * @param method The HTTP method of the request (GET, POST, DELETE, etc)
   * @param url The URL of the request
   * @param data Optional request body data
   * @param property Optional property name to extract from response data
   * @param additionalHeaders Optional additional headers to include in the request
   * @returns Promise resolving to a BentleyAPIResponse containing the response data or error
   */
  protected async sendGenericAPIRequest<TResponse = unknown, TData = unknown>(
    accessToken: AccessToken,
    method: Method,
    url: string,
    data?: TData,
    property?: string,
    additionalHeaders?: { [key: string]: string }
  ): Promise<BentleyAPIResponse<TResponse>> {
    const requestOptions = this.getRequestOptions(
      accessToken,
      method,
      url,
      data,
      additionalHeaders
    );
    try {
      const response = await fetch(requestOptions.url, {
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: requestOptions.body,
      });
      // Convert Headers object to plain object for compatibility
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      const responseData =
        response.status !== 204 ? await response.json() : undefined;

      if (!response.ok) {
        if (isErrorResponse(responseData)) {
          return {
            status: response.status,
            error: responseData.error,
            headers,
          };
        }
        throw new Error("An error occurred while processing the request");
      }
      return {
        status: response.status,
        data:
          (responseData === "" || responseData === undefined
            ? undefined
            : property && hasProperty(responseData, property)
            ? responseData[property]
            : responseData) as TResponse,
        headers,
      };
    } catch {
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
   * Build the request configuration including method, headers, and body
   * @param accessTokenString The client access token
   * @param method The HTTP method of the request
   * @param url The URL of the request
   * @param data Optional request body data
   * @param additionalHeaders Optional additional headers to include in the request
   * @returns RequestConfig object with method, url, body, and headers
   */
  protected getRequestOptions<TData>(
    accessTokenString: AccessToken,
    method: Method,
    url: string,
    data?: TData,
    additionalHeaders?: { [key: string]: string }
  ): RequestConfig {
    if (!accessTokenString) {
      throw new Error("Access token is required");
    }

    if (!url) {
      throw new Error("URL is required");
    }
    const body: string | undefined = JSON.stringify(data);

    return {
      method,
      url,
      body,
      headers: {
        authorization: accessTokenString,
        "content-type": "application/json",
        accept: "application/vnd.bentley.itwin-platform.v2+json",
        ...additionalHeaders,
      },
    };
  }

    /**
   * Builds a query string to be appended to a URL from query arguments
   * @param parameterMapping - Parameter mapping configuration that maps object properties to query parameter names
   * @param queryArg - Object containing queryable properties for filtering
   * @returns Query string with parameters applied, ready to append to a URL
   *
   * @example
   * ```typescript
   * const queryString = this.getQueryString(
   *   BaseClient.paginationParamMapping,
   *   {
   *     top: 10,
   *     skip: 5,
   *   }
   * );
   * // Returns: "$top=10&$skip=5"
   * ```
   */
  protected getQueryString<T>(
    parameterMapping: ParameterMapping<NonNullable<T>>,
    queryArg?: T
  ): string {
    if (!queryArg) return "";

    const params = this.buildQueryParams(queryArg, parameterMapping);
    return params.join("&");
  }

  /**
   * Helper method to build query parameter array from mapping.
   * Uses exhaustive parameter mapping to ensure type safety and prevent missing parameters.
   * Automatically handles URL encoding and filters out excluded parameters.
   *
   * @param queryArg - Object containing queryable properties
   * @param mapping - Parameter mapping configuration that maps object properties to query parameter names
   * @returns Array of formatted query parameter strings ready for URL construction
   *
   * @example
   * ```typescript
   * const params = this.buildQueryParams(
   *   { top: 10, skip: 5 },
   *   { top: "$top", skip: "$skip" }
   * );
   * // Returns: ["$top=10", "$skip=5"]
   * ```
   */
  private buildQueryParams<T>(
    queryArg: T,
    mapping: ParameterMapping<T>
  ): string[] {
    const params: string[] = [];
    // Type assertion constrains paramKey to actual property names and mappedValue to the specific strings from the mapping
    // Narrows from set of all strings to only valid keys/values
    for (const [paramKey, mappedValue] of Object.entries(mapping) as [
      keyof T,
      ParameterMapping<T>[keyof T]
    ][]) {
      if (mappedValue === "") continue;
      const queryArgValue = queryArg[paramKey];
      if (queryArgValue !== undefined && queryArgValue !== null) {
        const stringValue = String(queryArgValue);
        params.push(`${mappedValue}=${encodeURIComponent(stringValue)}`);
      }
    }
    return params;
  }
}
