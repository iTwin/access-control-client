/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Links } from "./links";
import type { Role } from "./Role";

/**
 * Represents an invitation sent to a user to join an iTwin as a member.
 *
 * @remarks
 * Member invitations are created when external users (not in the same organization as the iTwin)
 * are invited to join an iTwin. The invited user receives an email invitation and must accept it
 * to become a member. Invitations have expiration dates and can be in various states.
 *
 * @example
 * ```typescript
 * const invitation: MemberInvitation = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   email: "external.user@othercompany.com",
 *   invitedByEmail: "admin@mycompany.com",
 *   status: "Pending",
 *   createdDate: "2023-10-15T10:30:00Z",
 *   expirationDate: "2023-11-15T10:30:00Z",
 *   roles: [
 *     { id: "viewer-role", displayName: "Project Viewer" }
 *   ]
 * };
 * ```
 */
export interface MemberInvitation {
  /** Unique identifier for the invitation */
  id: string;
  /** Email address of the invited user */
  email: string;
  /** Email address of the user who sent the invitation */
  invitedByEmail: string;
  /** Current status of the invitation */
  status: MemberInvitationStatus;
  /** ISO 8601 timestamp when the invitation was created */
  createdDate: string;
  /** ISO 8601 timestamp when the invitation expires */
  expirationDate: string;
  /** Optional array of roles that will be assigned upon acceptance (excludes permissions and descriptions) */
  roles?: Omit<Role, "permissions" | "description">[];
}

/**
 * Represents the current state of a member invitation.
 *
 * @remarks
 * Invitations start as "Pending" when first sent and transition to "Accepted"
 * when the invited user accepts the invitation.
 */
export type MemberInvitationStatus = "Pending" | "Accepted";

/**
 * API response wrapper for multiple member invitations with pagination support.
 *
 * @remarks
 * This interface is used for API responses that return collections of member invitations,
 * such as GET /invitations operations. Includes HAL-style navigation links for pagination
 * to handle large numbers of invitations efficiently.
 *
 * @example
 * ```typescript
 * const response: MultipleMemberInvitationResponse = {
 *   invitations: [
 *     { id: "inv1", email: "user1@external.com", status: "Pending", ... },
 *     { id: "inv2", email: "user2@external.com", status: "Accepted", ... }
 *   ],
 *   _links: {
 *     self: { href: "/invitations?page=1" },
 *     next: { href: "/invitations?page=2" },
 *     prev: { href: "/invitations?page=0" }
 *   }
 * };
 * ```
 */
export interface MultipleMemberInvitationResponse {
  /** Array of member invitations in the current page */
  invitations: MemberInvitation[];
  /** HAL-style navigation links for pagination (first, next, prev, last) */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
}
