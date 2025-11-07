/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Represents a user within a group in the access control system.
 */
export interface GroupUser {
  /** Unique identifier for the user */
  id?: string;
  /** Email address of the user */
  email?: string;
  /** First name of the user */
  givenName?: string;
  /** Last name of the user */
  surname?: string;
  /** Organization the user belongs to */
  organization?: string;
}