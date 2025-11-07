/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { IITwinSharesClient } from "../accessControlClientInterfaces/ItwinSharesClient";
import type { BentleyAPIResponse, ResultMode } from "../types/CommonApiTypes";
import type { MultiShareContractResponse, ShareContract, SingleShareContractResponse } from "../types/ShareContract";
import { BaseClient } from "./BaseClient";

export class ITwinSharesClient
  extends BaseClient
  implements IITwinSharesClient
{
  public constructor(url?: string) {
    super(url);
  }

  /** Create a new iTwin share
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param iTwinShare The details of the iTwin share to be created
   * @remarks
   * #### Create
   * Creating an iTwin Share allows your iTwin to be publicly accessible, enabling anyone with the `shareKey` to view its data without needing to sign in. To use a share, take the value of the `shareKey` property and prepend it with the `Basic` prefix in the authorization header of your request.
   *
   * #### Share Contract
   * Each share is governed by a share contract that specifies the APIs available for the share and its associated iTwin.
   * Only an iTwin admin can create iTwin Shares, and only a maximum of 10 shares can be active at a time per application that created it.
   * The share contract expires after 90 days unless a shorter expiration is specified in the request body, with 90 days being the maximum duration. If the expiration property in the request body is left empty, it will default to the maximum duration from the moment of creation.
   * A share can be revoked at any time using the Revoke iTwin Share endpoint.
   * @returns ITwin Share
   * @beta
   */
  public async createITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinShare: Partial<Pick<ShareContract, "shareContract"> & { expiration: string | null }>
  ): Promise<BentleyAPIResponse<SingleShareContractResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/shares`;
    return this.sendGenericAPIRequest(accessToken, "POST", url, iTwinShare);
  }

    /** Get iTwin share
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param sharedId The id of the iTwin share to be retrieved
   * @returns The iTwin share details
   * @beta
   */
  public async getITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    sharedId: string,
  ): Promise<BentleyAPIResponse<SingleShareContractResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/shares/${sharedId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

  /** Get iTwin shares
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param sharedId The id of the iTwin share to be retrieved
   * @returns The iTwin share details
   * @beta
   */
  public async getITwinShares(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<BentleyAPIResponse<MultiShareContractResponse>> {
    const url = `${this._baseUrl}/${iTwinId}/shares`;
    return this.sendGenericAPIRequest(accessToken, "GET", url);
  }

    /** Revoke iTwin share
   * @param accessToken The client access token string
   * @param iTwinId The id of the iTwin
   * @param sharedId The id of the iTwin share to be revoked
   * @returns No Content
   * @beta
   */
  public async revokeITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    sharedId: string,
  ): Promise<BentleyAPIResponse<undefined>> {
    const url = `${this._baseUrl}/${iTwinId}/shares/${sharedId}`;
    return this.sendGenericAPIRequest(accessToken, "DELETE", url);
  }
  
}
