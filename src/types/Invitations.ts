/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Links } from "./links";
import type { Role } from "./Role";

export interface MemberInvitation {
  id: string;
  email: string;
  invitedByEmail: string;
  status: MemberInvitationStatus;
  createdDate: string;
  expirationDate: string;
  roles?: Omit<Role, "permissions" | "description">[];
}

export type MemberInvitationStatus = "Pending" | "Accepted";

export interface MultipleMemberInvitationResponse {
  invitations: MemberInvitation[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  _links: Links;
}
