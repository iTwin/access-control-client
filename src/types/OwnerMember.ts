/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { MemberInvitation } from "./Invitations";
import type { Links } from "./links";
import { OwnerMember } from "./Members";

/**
 * Response object when adding a new owner member to an iTwin.
 *
 * @remarks
 * Add new iTwin owner members. iTwin Owners are users which have full control over the iTwin.
 * Each owner is granted all permissions on the iTwin, allowing them to perform any action on the iTwin they own.
 *
 * Users which are external (i.e. not in the same organization as the iTwin) are not automatically added to the iTwin.
 * Instead, they're invited. Users which are not external, are immediately added as members on the iTwin.
 *
 * Invited individuals will receive an invitation via Email, where they'll be prompted to accept the invitation.
 * Upon accepting, they'll then become a member of the iTwin.
 *
 * @example
 * ```typescript
 * const addResponse: AddOwnerMemberResponse = {
 *   member: {
 *     id: "550e8400-e29b-41d4-a716-446655440000",
 *     email: "new.owner@company.com",
 *     givenName: "Jane",
 *     surname: "Smith",
 *     organization: "Tech Solutions Inc"
 *   },
 *   invitation: {
 *     id: "inv-550e8400-e29b-41d4-a716-446655440001",
 *     email: "new.owner@company.com",
 *     invitedByEmail: "admin@company.com",
 *     status: "Pending",
 *     createdDate: "2023-10-15T10:30:00Z",
 *     expirationDate: "2023-11-15T10:30:00Z"
 *   }
 * };
 * ```
 */
export interface AddOwnerMemberResponse {
  /** The newly added owner member */
  member: OwnerMember;
  /** Invitation details for the new member */
  invitation: MemberInvitation | null;
}

/**
 * Response object containing multiple owner members with pagination links.
 *
 * @example
 * ```typescript
 * const multiResponse: OwnerMemberMultiResponse = {
 *   members: [
 *     {
 *       id: "owner1-550e8400-e29b-41d4-a716-446655440000",
 *       email: "owner1@company.com",
 *       givenName: "Alice",
 *       surname: "Johnson",
 *       organization: "Primary Corp"
 *     },
 *     {
 *       id: "owner2-550e8400-e29b-41d4-a716-446655440001",
 *       email: "owner2@company.com",
 *       givenName: "Bob",
 *       surname: "Wilson",
 *       organization: "Secondary LLC"
 *     }
 *   ],
 *   _links: {
 *     self: { href: "/members/owners?$skip=0&$top=100 },
 *     next: { href: "/members/owners?$skip=100&$top=100" },
 *     prev: { href: "/members/owners?$skip=0&$top=100" }
 *   }
 * };
 * ```
 *
 * @remarks
 * This interface is used for API responses that return collections of owner members,
 * such as GET /members/owners operations. Includes HAL-style navigation links for pagination.
 *
 * #### Missing Users
 * When users are removed from the Bentley Identity Management System, they are not automatically removed from the iTwin. Therefore, it is possible to have a situation where the user is no longer valid, yet they are still an owner member of the iTwin. When this happens, the owner members will be returned from this API endpoint with the following values:
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
 * If not, you can use the Remove iTwin Owner Member API (use the memberId) to remove the owner member from the iTwin.
 */
export interface OwnerMemberMultiResponse {
  /** Array of owner members */
  members: OwnerMember[];
  /** Navigation links for pagination */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "_links": Links;
}