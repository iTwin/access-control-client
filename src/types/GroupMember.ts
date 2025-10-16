/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { Role } from "./Role";

export interface GroupMember {
  id: string;
  groupName: string;
  groupDescription: string;
  roles: Omit<Role, "permissions">[];
  imsGroupsCount: number;
  membersCount: number;
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
export interface AddGroupMembers {
  /** Array of groups to add as members with their assigned roles */
  members: {
    /** The ID of the group to add as a member */
    groupId: string;
    /** Array of role IDs to assign to this group member */
    roleIds: string[];
  }[];
}

export interface SingleGroupMemberResponse {
  member: Omit<GroupMember, "membersCount" | "imsGroupsCount">;
}

export interface MultipleGroupMembersResponse {
  members: Omit<GroupMember, "membersCount" | "imsGroupsCount">[];
}