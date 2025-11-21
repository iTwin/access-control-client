/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Role } from "./Role";


interface UserBase {
  /** Unique identifier for the user */
  id: string;
  /** Email address of the user */
  email: string;
  /** First name of the user */
  givenName: string;
  /** Last name of the user */
  surname: string;
  /** Organization the user belongs to */
  organization: string;
}

/**
 * Represents a user within a group in the access control system.
 *
 * @example
 * ```typescript
 * const groupUser: GroupUser = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   email: "sarah.connor@techcorp.com",
 *   givenName: "Sarah",
 *   surname: "Connor",
 *   organization: "TechCorp Industries"
 * };
 * ```
 */
export type GroupUser = UserBase;

/**
 * Represents a user who is a member of an iTwin with associated roles and profile information.
 *
 * @remarks
 * User members are individuals who have been added to an iTwin and assigned specific roles.
 * This provides information about the user's identity, assigned roles, and organization.
 *
 * @example
 * ```typescript
 * const userMember: UserMember = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   email: "john.smith@company.com",
 *   givenName: "John",
 *   surname: "Smith",
 *   organization: "ACME Corporation",
 *   roles: [
 *     { id: "admin-role", displayName: "Administrator", description : "Has full access to all resources" },
 *     { id: "viewer-role", displayName: "Project Viewer", description : "Can view project details" }
 *   ]
 * };
 * ```
 */
export interface UserMember extends UserBase{
  /** Array of roles assigned to this user member */
  roles: Role[];
}

/**
 * Represents an iTwin owner member with their basic information.
 *
 * @example
 * ```typescript
 * const ownerMember: OwnerMember = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   email: "john.doe@company.com",
 *   givenName: "John",
 *   surname: "Doe",
 *   organization: "Acme Corporation"
 * };
 * ```
 */
export type OwnerMember = UserBase;