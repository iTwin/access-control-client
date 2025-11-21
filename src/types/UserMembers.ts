/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { MemberInvitation } from "./Invitations";
import type { Links } from "./links";
import type { UserMember } from "./Members";

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
 *
 * #### Missing Users
 * When users are removed from the Bentley Identity Management System, they are not automatically removed from the iTwin. Therefore, it is possible to have a situation where the user is no longer valid, yet they are still a user member of the iTwin. When this happens, the user member will be returned from this API endpoint with the follow values:
 * ```typescript
 * { member:
    {
      "id": <memberId>,
      "email": null,
      "givenName": null,
      "surname": null,
      "organization": null,
      ...
    }
  * }
 * ```
 *
 * #### Cleanup
 * The Access Control API will perform a once-a-week cleanup to remove these "Missing Users". You can rely on this automated clean-up if this timeline is sufficient.
 *
 * If not, you can use the Remove iTwin User Member API (use the memberId) to remove the user member from the iTwin.
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
 *
 * #### Missing Users
 * When users are removed from the Bentley Identity Management System, they are not automatically removed from the iTwin. Therefore, it is possible to have a situation where the user is no longer valid, yet they are still a user member of the iTwin. When this happens, the user members will be returned from this API endpoint with the following values:
 * ```typescript
 * { members: [
 *     {
 *       "id": <memberId>,
 *       "email": null,
 *       "givenName": null,
 *       "surname": null,
 *       "organization": null,
 *       ...
 *     }
 *   ]
 * }
 * ```
 *
 * #### Cleanup
 * The Access Control API will perform a once-a-week cleanup to remove these "Missing Users". You can rely on this automated clean-up if this timeline is sufficient.
 *
 * If not, you can use the Remove iTwin User Member API (use the memberId) to remove the user member from the iTwin.
 */
export interface MultipleUserMembersResponse {
  /** Array of user members in the current page */
  members: UserMember[];
  /** HAL-style navigation links for pagination (first, next, prev, last) */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
}
