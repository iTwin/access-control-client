/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Role } from "./Role";

/**
 * Represents a group that is a member of an iTwin with associated roles and metadata.
 *
 * @remarks
 * Group members are groups that have been added to an iTwin and assigned specific roles.
 * This provides information about the group's identity, assigned roles, and aggregate
 * counts of its nested membership structure.
 *
 * @example
 * ```typescript
 * const groupMember: GroupMember = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   groupName: "Engineering Team",
 *   groupDescription: "Software engineering team members",
 *   roles: [
 *     { id: "admin-role", displayName: "Administrator" },
 *     { id: "viewer-role", displayName: "Viewer" }
 *   ],
 * };
 * ```
 */
export interface GroupMember {
  /** Unique identifier for the group member */
  id: string;
  /** Display name of the group */
  groupName: string;
  /** Human-readable description of the group's purpose */
  groupDescription: string;
  /** Array of roles assigned to this group member (excludes permissions for security) */
  roles: Role[];
}

/**
 * Request to add group members to an iTwin with role assignments.
 *
 * @remarks
 * The total number of roles assigned in this request must not exceed 50.
 * This can be achieved with many different configurations. For example,
 * 1 role can be assigned to 50 groups, or 5 roles can be assigned to 10 groups,
 * both resulting in 50 role assignments.
 *
 * @example
 * ```typescript
 * const request: AddGroupMembers = {
 *   members: [{
 *     groupId: "6abbfcea-0eab-472a-b5f5-5c5a43df34b4",
 *     roleIds: ["5abbfcef-0eab-472a-b5f5-5c5a43df34b1", "83ee0d80-dea3-495a-b6c0-7bb102ebbcc3"]
 *   }]
 * };
 * ```
 */
export interface GroupMemberAssignment {
  /** Array of groups to add as members with their assigned roles */
  members: {
    /** The ID of the group to add as a member */
    groupId: string;
    /** Array of role IDs to assign to this group member */
    roleIds: string[];
  }[];
}

/**
 * API response wrapper for a single group member operation.
 */
export interface SingleGroupMemberResponse {
  /** The group member data returned by the API */
  member: GroupMember;
}

/**
 * API response wrapper for multiple group members operations.
 */
export interface MultipleGroupMembersResponse {
  /** Array of group members returned by the API */
  members: GroupMember[];
}