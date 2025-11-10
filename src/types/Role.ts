/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Permission } from "./Permission";

/**
 * Represents a role that defines a set of permissions for iTwin access control.
 * Roles are assigned to users to grant them specific capabilities within an iTwin.
 *
 * @example
 * ```typescript
 * const projectManagerRole: Role = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   displayName: "Project Manager",
 *   description: "Full access to manage project resources, users, and settings",
 *   permissions: [
 *     "itwins_read",
 *     "itwins_modify",
 *     "itwins_members_read",
 *     "itwins_members_modify",
 *     "imodels_read",
 *     "imodels_write"
 *   ]
 * };
 * ```
 */
export interface Role {
  /** Unique identifier for the role. Optional when creating a new role. */
  id: string;
  /** Human-readable name for the role */
  displayName: string;
  /** Detailed description of what this role provides */
  description: string;
  /** Array of permissions associated with this role */
  permissions: Permission[];
}
