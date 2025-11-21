/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/**
 * Represents an iTwin share contract that allows public access to iTwin data.
 * Share contracts enable external users to access iTwin resources without authentication.
 *
 * @example
 * ```typescript
 * const shareContract: ShareContract = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   iTwinId: "a1b2c3d4-e5f6-4789-0123-456789abcdef",
 *   shareKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   shareContract: "Default",
 *   expiration: "2024-12-31T23:59:59.999Z"
 * };
 *
 * // Usage in authorization header:
 * const authHeader = `Basic ${shareContract.shareKey}`;
 * ```
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

/**
 * Response object containing a single share contract.
 *
 * @example
 * ```typescript
 * const response: SingleShareContractResponse = {
 *   share: {
 *     id: "550e8400-e29b-41d4-a716-446655440000",
 *     iTwinId: "a1b2c3d4-e5f6-4789-0123-456789abcdef",
 *     shareKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     shareContract: "Default",
 *     expiration: "2024-12-31T23:59:59.999Z"
 *   }
 * };
 * ```
 */
export interface SingleShareContractResponse {
  /** The share contract data */
  share:  ShareContract;
}

/**
 * Response object containing multiple share contracts.
 *
 * @example
 * ```typescript
 * const response: MultiShareContractResponse = {
 *   shares: [
 *     {
 *       id: "share1-550e8400-e29b-41d4-a716-446655440000",
 *       iTwinId: "a1b2c3d4-e5f6-4789-0123-456789abcdef",
 *       shareKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       shareContract: "Default",
 *       expiration: "2024-12-31T23:59:59.999Z"
 *     },
 *     {
 *       id: "share2-550e8400-e29b-41d4-a716-446655440001",
 *       iTwinId: "a1b2c3d4-e5f6-4789-0123-456789abcdef",
 *       shareKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       shareContract: "Premium",
 *       expiration: "2025-06-30T23:59:59.999Z"
 *     }
 *   ]
 * };
 * ```
 */
export interface MultiShareContractResponse {
  /** Array of share contracts */
  shares: ShareContract[];
}
