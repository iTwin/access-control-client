/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { GroupUser } from "./Users";

/**
 * Represents an access control group within an iTwin.
 *
 * @remarks
 * Access Control groups provide the ability to manage groups of users at one time.
 * You can create groups on the Account iTwin to manage access across iTwins or
 * create a group for an individual iTwin. Groups created on an individual iTwin
 * are available only on that iTwin.
 *
 * Groups can contain individual users. Groups can also reference Bentley Identity
 * Management System (IMS) groups. By referencing an IMS group, you can manage
 * groups of individuals in your Active Directory, while providing them access to
 * iTwin Platform using role assignments.
 *
 * @example
 * ```typescript
 * const projectGroup: Group = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   name: "Project Managers",
 *   description: "Users with project management responsibilities",
 *   members: [
 *     { id: "user123", email: "manager@company.com", firstName: "John", lastName: "Smith" }
 *   ],
 *   imsGroups: ["COMPANY_ADMINS", "PROJECT_LEADS"]
 * };
 * ```
 */
export interface Group {
  /** The Group id */
  id: string;
  /** The name of your Group */
  name: string;
  /** A description of your Group */
  description: string;
  /** List of members assigned to the Group. Max size of 50 */
  members: GroupUser[];
  /** List of IMS Groups assigned to the Group. Max size of 50 */
  imsGroups: string[];
}

/**
 * API response wrapper for a single group operation.
 *
 * @remarks
 * This interface is used for API responses that return a single group,
 * such as GET /groups/{id}, POST /groups, and PATCH /groups/{id} operations.
 */
export interface SingleGroupResponse {
  /** The group data returned by the API */
  group: Group;
}

/**
 * API response wrapper for multiple groups operations.
 *
 * @remarks
 * This interface is used for API responses that return multiple groups,
 * such as GET /groups operations. The array may be empty if no groups
 * match the query criteria or if the iTwin has no groups defined.
 */
export interface MultipleGroupsResponse {
  /** Array of groups returned by the API */
  groups: Group[];
}
