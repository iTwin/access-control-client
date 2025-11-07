/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse } from "../types/CommonApiTypes";
import type { MultiShareContractResponse, ShareContract, SingleShareContractResponse } from "../types/ShareContract";

export interface IITwinSharesClient {
  /** Create a new iTwin Share */
  createITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinShare: Partial<Pick<ShareContract, "shareContract"> & { expiration: string | null }>,
  ): Promise<BentleyAPIResponse<SingleShareContractResponse>>;

  /** get a iTwin Share */
  getITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    sharedId: string,
  ): Promise<BentleyAPIResponse<SingleShareContractResponse>>;

    /** get a iTwin Share */
  getITwinShares(
    accessToken: AccessToken,
    iTwinId: string,
  ): Promise<BentleyAPIResponse<MultiShareContractResponse>>;

  /** delete a iTwin Share */
  revokeITwinShare(
    accessToken: AccessToken,
    iTwinId: string,
    sharedId: string,
  ): Promise<BentleyAPIResponse<undefined>>;
}
