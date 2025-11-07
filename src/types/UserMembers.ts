/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { MemberInvitation } from "./Invitations";
import type { Links } from "./links";
import type { Role } from "./Role";

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
 *     { id: "admin-role", displayName: "Administrator" },
 *     { id: "viewer-role", displayName: "Project Viewer" }
 *   ]
 * };
 * ```
 */
export interface UserMember {
  /** Unique identifier for the user member */
  id: string;
  /** Email address of the user (used for identification and invitations) */
  email: string;
  /** First name of the user */
  givenName: string;
  /** Last name of the user */
  surname: string;
  /** Organization or company the user belongs to */
  organization: string;
  /** Array of roles assigned to this user member */
  roles: Omit<Role, "permissions">[];
}

/**
 * Request to add or invite a user member to an iTwin with role assignments.
 *
 *
 * @example
 * ```typescript
 * const newMember: AddUserMember = {
 *   email: "newuser@company.com",
 *   roleIds: ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]
 * };
 * ```
 */
export interface AddUserMember {
  /** Array of role IDs to assign to the user */
  roleIds: string[];
  /** Email address of the user to add or invite */
  email: string;
}

/**
 * Response from adding user members to an iTwin.
 *
 * @remarks
 * This response contains both members (users immediately added) and invitations
 * (external users who need to accept invitations). Internal users are automatically
 * added as members, while external users receive email invitations.
 *
 * @example
 * ```typescript
 * const response: AddUserMemberResponse = {
 *   members: [
 *     // Internal users added immediately
 *     { id: "123", email: "internal@company.com", givenName: "Jane", surname: "Doe", organization: "ACME Corp", roles: [...] }
 *   ],
 *   invitations: [
 *     // External users who received invitations
 *     { id: "inv456", email: "external@other.com", status: "Pending", roles: [...] }
 *   ]
 * };
 * ```
 */
export interface AddUserMemberResponse {
  /** Users that were immediately added as members (internal users) */
  members: UserMember[];
  /** Invitations sent to external users who need to accept them */
  invitations: MemberInvitation[];
}

/**
 * API response wrapper for a single user member operation.
 *
 * @remarks
 * This interface is used for API responses that return a single user member,
 * such as GET /members/{id} operations.
 */
export interface SingleUserMemberResponse {
  /** The user member data */
  member: UserMember;
}

/**
 * API response wrapper for multiple user members with pagination support.
 *
 * @remarks
 * This interface is used for API responses that return collections of user members,
 * such as GET /members operations. Includes HAL-style navigation links for pagination.
 */
export interface MultipleUserMembersResponse {
  /** Array of user members in the current page */
  members: UserMember[];
  /** HAL-style navigation links for pagination (first, next, prev, last) */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
}
