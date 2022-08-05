/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */

export interface AccessControlAPIResponse<T> {
  data?: T;
  status: number;
  error?: Error;
}

type Permission = string;

export interface PermissionsResponse {
  permissions: Permission[];
}

export interface Error {
  code: string;
  message: string;
  details?: ErrorDetail[];
  target?: string;
}

export interface ErrorDetail {
  code: string;
  message: string;
  target?: string;
}

export interface MembersResponse {
  members: Member[];
}

export interface MemberResponse {
  member: Member;
}

interface Member {
  id: string;
  email: string;
  givenName: string;
  surname: string;
  organization: string;
  roles: Role[];
}

interface Role {
  id: string;
  displayName: string;
  description: string;
}

export interface NewMember {
  email: string;
  roleId: string;
}
