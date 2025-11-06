/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { MemberInvitation } from "./Invitations";
import { Links } from "./links";

export interface OwnerMember {
  id: string;
  email: string;
  givenName: string;
  surname: string;
  organization: string;
}

export interface AddOwnerMemberResponse {
  member: OwnerMember;
  invitation: MemberInvitation;
}

export interface OwnerMemberMultiResponse {
  members: OwnerMember[];
  "_links": Links;
}