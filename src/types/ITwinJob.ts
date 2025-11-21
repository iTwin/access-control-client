/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ErrorDetail } from "./CommonApiTypes";

/**
 * Represents the current status of an iTwin job operation.
 * Jobs progress through these states as they are processed by the system.
 */
export type ITwinJobStatus =
  | "Active"      // Job is currently being processed
  | "Completed"   // Job has finished successfully
  | "PartialCompleted"  // Job completed with some failures
  | "Failed";     // Job failed to complete

/**
 * This interface represents a job that manages user access control operations
 * such as assigning roles, removing members, etc.
 */
export interface ITwinJob {
  /** Unique identifier for the job */
  id: string;
  /** The iTwin ID this job operates on */
  itwinId: string;
  /** Current status of the job */
  status: ITwinJobStatus;
  /** Error details if the job encountered issues, empty array if no errors */
  error: ErrorDetail[];
}

/**
 * Available action types that can be performed in an iTwin job.
 * These represent the different operations that can be batched together.
 */
export type ItwinJobActions = "assignRoles" | "unassignRoles" | "removeMembers";

/**
 * Defines the structure for iTwin job actions with type-safe action payloads.
 *
 * @remarks
 * - `assignRoles` and `unassignRoles` actions include both email and roleIds
 * - `removeMembers` actions only include email (roleIds are omitted)
 * - Additional options can be provided for job configuration
 *
 * @example
 * ```typescript
 * const jobActions: ITwinJobActions = {
 *   assignRoles: [
 *     { email: "user@example.com", roleIds: ["admin", "viewer"] }
 *   ],
 *   removeMembers: [
 *     { email: "former-user@example.com" } // No roleIds needed
 *   ],
 *   options: {
 *     timeout: 30000,
 *     retries: 3
 *   }
 * };
 * ```
 */
export type ITwinJobActions = {
  [K in ItwinJobActions]?: K extends "removeMembers"
    ? Omit<ITwinJobAction, "roleIds">[]
    : ITwinJobAction[];
} & {
  /** Additional configuration options for the job */
  options?: Record<string, unknown>;
};

/**
 * Represents a single action within an iTwin job that affects a user's access.
 *
 * @remarks
 * This interface defines the core structure for user-related operations.
 * When used with `removeMembers` actions, the `roleIds` property should be
 * omitted.
 */
export interface ITwinJobAction {
  /** Email address of the user to be affected by this action */
  email: string;
  /** Array of role IDs to assign or unassign (not used for removeMembers) */
  roleIds: string[];
}