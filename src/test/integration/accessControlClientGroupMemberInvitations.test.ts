/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { IAccessControlClient } from "../../accessControlClientInterfaces/accessControl";
import { TestConfig } from "../TestConfig";

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

describe("AccessControlClient Group Member Invitations", () => {
  let baseUrl: string = "https://api.bentley.com/accesscontrol/itwins";
  const urlPrefix = process.env.IMJS_URL_PREFIX;
  if (urlPrefix) {
    const url = new URL(baseUrl);
    url.hostname = urlPrefix + url.hostname;
    baseUrl = url.href;
  }
  const accessControlClient: IAccessControlClient = new AccessControlClient();

  let accessToken: AccessToken;

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
  });

  it("should create group, manage invitations, and clean up", async () => {
    // Arrange
    const emails: string[] = [];
    for (let i = 0; i < 3; i++) {
      emails.push(
        `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`
      );
    }
    // --- CREATE GROUP ---
    // Act
    const createGroupResponse =
      await accessControlClient.groups.createITwinGroup(
        accessToken,
        TestConfig.accountId,
        {
          name: "User invite test group",
          description: "User invite test group",
        }
      );
    try {
      //Assert
      expect(createGroupResponse.status).toBe(201);
      expect(createGroupResponse.data).toBeDefined();

      // --- UPDATE GROUP WITH LIST OF GROUP MEMBER INVITATIONS ---
      // Arrange
      const updatedGroup = {
        members: [emails[0], emails[1], emails[2]],
      };

      // Act
      const updateGroupResponse =
        await accessControlClient.groups.updateITwinGroup(
          accessToken,
          TestConfig.accountId,
          createGroupResponse.data!.group.id,
          updatedGroup
        );

      // Assert
      expect(updateGroupResponse.status).toBe(200);
      expect(updateGroupResponse.data).toBeDefined();
      expect(
        updateGroupResponse.data!.group.members.length
      ).toBeGreaterThanOrEqual(0);

      // --- GET LIST OF GROUP MEMBER INVITATIONS ---
      // Act
      let getInvitationsResponse =
        await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
          accessToken,
          TestConfig.accountId,
          createGroupResponse.data!.group.id
        );

      // Assert
      expect(getInvitationsResponse.status).toBe(200);
      expect(getInvitationsResponse.data).toBeDefined();
      expect(getInvitationsResponse.data!.invitations).toBeDefined();
      expect(Array.isArray(getInvitationsResponse.data!.invitations)).toBe(
        true
      );
      expect(getInvitationsResponse.data!._links).toBeDefined();
      expect(getInvitationsResponse.data!.invitations.length).toBe(3);

      // --- DELETE LIST OF GROUP MEMBER INVITATIONS ---
      // Act
      const invites = getInvitationsResponse.data!.invitations;
      for (const invite of invites) {
        const deleteInvitesResp =
          await accessControlClient.groupMemberInvitations.deleteITwinGroupMemberInvitation(
            accessToken,
            TestConfig.accountId,
            createGroupResponse.data!.group.id,
            invite.id
          );
          // Assert
        expect(deleteInvitesResp.status).toBe(204);
      }

      // --- GET LIST OF GROUP MEMBER INVITATIONS EMPTY ---
      // Act
      getInvitationsResponse =
        await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
          accessToken,
          TestConfig.accountId,
          createGroupResponse.data!.group.id
        );

      // Assert
      expect(getInvitationsResponse.data!.invitations.length).toBe(0);
    } finally {
      // Clean up
      const groups = await accessControlClient.groups.getITwinGroups(
        accessToken,
        TestConfig.accountId
      );
      const groupId = groups.data!.groups.filter(
        (group) => group.name === "User invite test group" && group.description
      )[0].id;
      await accessControlClient.groups.updateITwinGroup(
        accessToken,
        TestConfig.accountId,
        groupId,
        { members: [] }
      );
      await accessControlClient.groups.deleteITwinGroup(
        accessToken,
        TestConfig.accountId,
        groupId
      );
    }
  });

  it("should return 404 errors for non-existent resources", async () => {
    // --- TEST 404 FOR NON-EXISTENT GROUP ---
    // Arrange
    const nonExistentGroupId = "22acf21e-0575-4faf-849b-bcd538718269";
    // Act
    const notFoundGroupResponse = await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
      accessToken,
      TestConfig.accountId,
      nonExistentGroupId
    );

    // Assert
    expect(notFoundGroupResponse.status).toBe(404);
    expect(notFoundGroupResponse.error).toBeDefined();
    expect(notFoundGroupResponse.data).toBeUndefined();

    // --- TEST 404 FOR NON-EXISTENT INVITATION ---
    // Create a temporary group for this test
    const tempGroupName = `Temp Group for 404 Test ${new Date().toISOString()}`;
    const tempGroup = {
      name: tempGroupName,
      description: "Temporary group for 404 testing",
    };

    const createTempGroupResponse = await accessControlClient.groups.createITwinGroup(
      accessToken,
      TestConfig.accountId,
      tempGroup
    );

    expect(createTempGroupResponse.status).toBe(201);
    const tempGroupId = createTempGroupResponse.data?.group!.id as string;

    try {
      // Arrange
      const nonExistentInvitationId = "22acf21e-0575-4faf-849b-bcd538718269";

      // Act
      const notFoundInvitationResponse = await accessControlClient.groupMemberInvitations.deleteITwinGroupMemberInvitation(
        accessToken,
        TestConfig.accountId,
        tempGroupId,
        nonExistentInvitationId
      );

      // Assert
      expect(notFoundInvitationResponse.status).toBe(404);
      expect(notFoundInvitationResponse.error).toBeDefined();
      expect(notFoundInvitationResponse.data).toBeUndefined();

      // --- TEST 404 FOR NON-EXISTENT ITWIN ---
      // Arrange
      const nonExistentITwinId = "22acf21e-0575-4faf-849b-bcd538718269";

      // Act
      const notFoundITwinResponse = await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
        accessToken,
        nonExistentITwinId,
        tempGroupId
      );

      // Assert
      expect(notFoundITwinResponse.status).toBe(404);
      expect(notFoundITwinResponse.error).toBeDefined();
      expect(notFoundITwinResponse.data).toBeUndefined();

    } finally {
      // Cleanup - delete the temporary group
      await accessControlClient.groups.deleteITwinGroup(
        accessToken,
        TestConfig.accountId,
        tempGroupId
      );
    }
  });

  it("should return 404 errors for invalid request formats", async () => {
    // Create a temporary group for this test
    const tempGroupName = `Temp Group for 422 Test ${new Date().toISOString()}`;
    const tempGroup = {
      name: tempGroupName,
      description: "Temporary group for 422 testing",
    };
    const createTempGroupResponse = await accessControlClient.groups.createITwinGroup(
      accessToken,
      TestConfig.accountId,
      tempGroup
    );

    expect(createTempGroupResponse.status).toBe(201);
    const tempGroupId = createTempGroupResponse.data?.group!.id as string;

    try {
      // --- TEST 404 FOR INVALID GROUP ID FORMAT ---
      // Arrange
      const invalidGroupId = "invalid-group-id-format";

      // Act
      const invalidGroupResponse = await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
        accessToken,
        TestConfig.accountId,
        invalidGroupId
      );

      // Assert
      expect(404).toBe(invalidGroupResponse.status);
      expect(invalidGroupResponse.error).toBeDefined();
      expect(invalidGroupResponse.data).toBeUndefined();

      // --- TEST 404 FOR INVALID INVITATION ID FORMAT ---
      // Arrange
      const invalidInvitationId = "invalid-invitation-id-format";

      // Act
      const invalidInvitationResponse = await accessControlClient.groupMemberInvitations.deleteITwinGroupMemberInvitation(
        accessToken,
        TestConfig.accountId,
        tempGroupId,
        invalidInvitationId
      );

      // Assert
      expect(404).toBe(invalidInvitationResponse.status);
      expect(invalidInvitationResponse.error).toBeDefined();
      expect(invalidInvitationResponse.data).toBeUndefined();

      // --- TEST 404 FOR INVALID ITWIN ID FORMAT ---
      // Arrange
      const invalidITwinId = "invalid-itwin-id-format";

      // Act
      const invalidITwinIdResponse = await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
        accessToken,
        invalidITwinId,
        tempGroupId
      );

      // Assert
      expect(404).toBe(invalidITwinIdResponse.status);
      expect(invalidITwinIdResponse.error).toBeDefined();
      expect(invalidITwinIdResponse.data).toBeUndefined();

    } finally {
      // Cleanup - delete the temporary group
      await accessControlClient.groups.deleteITwinGroup(
        accessToken,
        TestConfig.accountId,
        tempGroupId
      );
    }
  });
});
