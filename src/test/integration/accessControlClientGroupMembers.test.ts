/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { IAccessControlClient } from "../../accessControlClientInterfaces/accessControl";
import type { BentleyAPIResponse } from "../../types/CommonApiTypes";
import { TestConfig } from "../TestConfig";

describe("AccessControlClient Group Members", () => {
  let baseUrl: string = "https://api.bentley.com/accesscontrol/itwins";
  const urlPrefix = process.env.IMJS_URL_PREFIX;
  if (urlPrefix) {
    const url = new URL(baseUrl);
    url.hostname = urlPrefix + url.hostname;
    baseUrl = url.href;
  }
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const customAccessControlClient: IAccessControlClient =
    new AccessControlClient(baseUrl);
  let accessToken: AccessToken;

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
  }, 30000);

  it("should get a list of group members for an iTwin", async () => {
    // Act
    const iTwinsResponse =
      await accessControlClient.groupMembers.queryITwinGroupMembers(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.members?.length).toBeGreaterThan(0);
    expect(iTwinsResponse.data?._links).toBeDefined();
  });

  it("should get a list of group members for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse =
      await customAccessControlClient.groupMembers.queryITwinGroupMembers(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.members?.length).toBeGreaterThan(0);
  });

  it("should get a filtered list of group members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 2;

    // Act
    const iTwinsResponse =
      await accessControlClient.groupMembers.queryITwinGroupMembers(
        accessToken,
        TestConfig.itwinId,
        { top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.members?.length).toBe(topAmount);
  });

  it("should get a filtered list of group members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList =
      await accessControlClient.groupMembers.queryITwinGroupMembers(
        accessToken,
        TestConfig.itwinId
      );
    const skipAmount = 1;
    const topAmount = 3;

    // Act
    const iTwinsResponse =
      await accessControlClient.groupMembers.queryITwinGroupMembers(
        accessToken,
        TestConfig.itwinId,
        { skip: skipAmount, top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.members?.length).toBe(topAmount);
    // Get the IDs of skipped members
    const skippedMemberIds =
      unFilteredList.data?.members?.slice(0, skipAmount).map((m) => m.id) || [];

    // Get the IDs of returned members
    const returnedMemberIds =
      iTwinsResponse.data?.members?.map((m) => m.id) || [];

    // Check that none of the skipped members appear in the returned results
    skippedMemberIds.forEach((skippedId) => {
      expect(returnedMemberIds).not.toContain(skippedId);
    });
  });

  it("should get a specific group member for an iTwin", async () => {
    // Act
    const iTwinsResponse =
      await accessControlClient.groupMembers.getITwinGroupMember(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId1
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.member.id).toBe(TestConfig.permanentGroupId1);
  });

  it("should get a 404 when trying to get a non-existant group member", async () => {
    // Arrange
    const notExistentGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse =
      await accessControlClient.groupMembers.getITwinGroupMember(
        accessToken,
        TestConfig.itwinId,
        notExistentGroupId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.data).toBeUndefined();
    expect(iTwinsResponse.error?.code).toBe("TeamMemberNotFound");
  });

  it("should get add, get, update, and remove a group member", async () => {

    try {
    // --- Add Member ---
    // Act
    const addUserMemberResponse =
      await accessControlClient.groupMembers.addITwinGroupMembers(
        accessToken,
        TestConfig.itwinId,
        {
          members: [
            {
              groupId: TestConfig.permanentGroupId2,
              roleIds: [
                TestConfig.permanentRoleId1,
                TestConfig.permanentRoleId2,
              ],
            },
          ],
        }
      );

    // Assert
    expect(addUserMemberResponse.status).toBe(201);
    expect(addUserMemberResponse.data).toBeDefined();
    expect(addUserMemberResponse.data?.members?.length).toBeGreaterThan(0);
      // --- Check member exists and has role ---
      // Act
      const getGroupMemberResponse =
        await accessControlClient.groupMembers.getITwinGroupMember(
          accessToken,
          TestConfig.itwinId,
          TestConfig.permanentGroupId2
        );

      expect(getGroupMemberResponse.status).toBe(200);
      expect(getGroupMemberResponse.data).toBeDefined();
      expect(getGroupMemberResponse.data?.member?.id).toBe(
        TestConfig.permanentGroupId2
      );
      expect(getGroupMemberResponse.data?.member?.roles?.length).toBe(2);
      expect(getGroupMemberResponse.data?.member?.roles[0].id).toBe(
        TestConfig.permanentRoleId1
      );

      // --- Update member's role ---
      // Act
      const updatedUserMemberResponse =
        await accessControlClient.groupMembers.updateITwinGroupMember(
          accessToken,
          TestConfig.itwinId,
          TestConfig.permanentGroupId2,
          [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2]
        );

      expect(updatedUserMemberResponse.status).toBe(200);
      expect(updatedUserMemberResponse.data).toBeDefined();
      expect(updatedUserMemberResponse.data?.member.id).toBe(
        TestConfig.permanentGroupId2
      );
      expect(updatedUserMemberResponse.data?.member.roles.length).toBe(2);
      expect(
        updatedUserMemberResponse.data?.member.roles.map((x) => x.id)
      ).toContain(TestConfig.permanentRoleId1);
      expect(
        updatedUserMemberResponse.data?.member.roles.map((x) => x.id)
      ).toContain(TestConfig.permanentRoleId2);
    } finally {
      // --- Remove member (cleanup) ---
      // Ensure member is removed even if test fails
      const removeUserMemberResponse: BentleyAPIResponse<undefined> =
        await accessControlClient.groupMembers.removeITwinGroupMember(
          accessToken,
          TestConfig.itwinId,
          TestConfig.permanentGroupId2
        );

      expect(removeUserMemberResponse.status).toBe(204);
      expect(removeUserMemberResponse.data).toBeUndefined();
    }
  });
});
