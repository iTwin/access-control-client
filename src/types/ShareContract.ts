/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Represents an iTwin share contract that allows public access to iTwin data.
 * Share contracts enable external users to access iTwin resources without authentication.
 */
export interface ShareContract {
  /** Unique identifier for the share contract */
  id: string;
  /** The iTwin ID that this share contract applies to */
  iTwinId: string;
  /** The share key used for authentication. Prepend with 'Basic' in authorization headers. */
  shareKey: string;
  /** The type of share contract (e.g., "Default") that defines available APIs */
  shareContract: string;
  /** ISO date string when the share contract expires */
  expiration: string;
}

/** Response object containing a single share contract */
export interface SingleShareContractResponse {
  /** The share contract data */
  share:  ShareContract;
}

/** Response object containing multiple share contracts */
export interface MultiShareContractResponse {
  /** Array of share contracts */
  shares: ShareContract[];
}
