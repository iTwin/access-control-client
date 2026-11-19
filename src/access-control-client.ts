/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

/** @docs-package-description
 * The access-control-client package provides a means of interfacing with services relating to access control for iTwins.
 */

/**
 * @docs-group-description iTwinsClient
 * Classes for communicating with the access control service.
 */

// Main client export
export * from "./AccessControlClient.js";

// Types exports
export * from "./types/CommonApiTypes.js";
export * from "./types/GroupMember.js";
export * from "./types/Groups.js";
export * from "./types/Invitations.js";
export * from "./types/ITwinJob.js";
export * from "./types/links.js";
export * from "./types/OwnerMember.js";
export * from "./types/Permission.js";
export * from "./types/Role.js";
export * from "./types/UserMembers.js";
export * from "./types/Members.js";
export * from "./types/ShareContract.js";

// Client interfaces exports
export * from "./accessControlClientInterfaces/accessControl.js";
export * from "./accessControlClientInterfaces/GroupClient.js";
export * from "./accessControlClientInterfaces/GroupMembersClient.js";
export * from "./accessControlClientInterfaces/ITwinJobsClient.js";
export * from "./accessControlClientInterfaces/MemberInvitationsClient.js";
export * from "./accessControlClientInterfaces/OwnerMembersClient .js";
export * from "./accessControlClientInterfaces/PermissionsClient.js";
export * from "./accessControlClientInterfaces/RolesClient.js";
export * from "./accessControlClientInterfaces/UserMembersClient.js";
export * from "./accessControlClientInterfaces/ItwinSharesClient.js";
export * from "./accessControlClientInterfaces/GroupMemberInvitationClient.js"