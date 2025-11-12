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
export * from "./AccessControlClient";

// Types exports
export * from "./types/CommonApiTypes";
export * from "./types/GroupMember";
export * from "./types/Groups";
export * from "./types/Invitations";
export * from "./types/ITwinJob";
export * from "./types/links";
export * from "./types/OwnerMember";
export * from "./types/Permission";
export * from "./types/Role";
export * from "./types/UserMembers";
export * from "./types/Members";
export * from "./types/ShareContract";

// Client interfaces exports
export * from "./accessControlClientInterfaces/accessControl";
export * from "./accessControlClientInterfaces/GroupClient";
export * from "./accessControlClientInterfaces/GroupMembersClient";
export * from "./accessControlClientInterfaces/ITwinJobsClient";
export * from "./accessControlClientInterfaces/MemberInvitationsClient";
export * from "./accessControlClientInterfaces/OwnerMembersClient ";
export * from "./accessControlClientInterfaces/PermissionsClient";
export * from "./accessControlClientInterfaces/RolesClient";
export * from "./accessControlClientInterfaces/UserMembersClient";
export * from "./accessControlClientInterfaces/ItwinSharesClient";