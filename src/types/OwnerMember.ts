/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { MemberInvitation } from "./Invitations";
import type { Links } from "./links";

/** Represents an iTwin owner member with their basic information */
export interface OwnerMember {
  /** Unique identifier for the owner member */
  id: string;
  /** Email address of the owner member */
  email: string;
  /** First name of the owner member */
  givenName: string;
  /** Last name of the owner member */
  surname: string;
  /** Organization the owner member belongs to */
  organization: string;
}

/** Response object when adding a new owner member to an iTwin */
export interface AddOwnerMemberResponse {
  /** The newly added owner member */
  member: OwnerMember;
  /** Invitation details for the new member */
  invitation: MemberInvitation;
}

/** Response object containing multiple owner members with pagination links */
export interface OwnerMemberMultiResponse {
  /** Array of owner members */
  members: OwnerMember[];
  /** Navigation links for pagination */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "_links": Links;
}