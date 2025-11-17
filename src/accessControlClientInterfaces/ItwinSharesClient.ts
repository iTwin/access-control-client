/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse } from "../types/CommonApiTypes";
import type { MultiShareContractResponse, ShareContract, SingleShareContractResponse } from "../types/ShareContract";

/** @beta */
export interface IITwinSharesClient {
  /** Create a new iTwin Share
   * @beta
   */
  createITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinShare: Partial<Pick<ShareContract, "shareContract"> & { expiration: string | null }>,
  ): Promise<BentleyAPIResponse<SingleShareContractResponse>>;

  /** get a iTwin Share
   * @beta
  */
  getITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    sharedId: string,
  ): Promise<BentleyAPIResponse<SingleShareContractResponse>>;

    /** get a iTwin Share
     * @beta
     */
  getITwinShares(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<BentleyAPIResponse<MultiShareContractResponse>>;

  /** delete a iTwin Share
   * @beta
  */
  revokeITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    sharedId: string,
  ): Promise<BentleyAPIResponse<undefined>>;
}
