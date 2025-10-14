/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type {
  GroupMember,
  IAccessControlClient,
} from "../../accessControlTypes";
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
    const iTwinsResponse: BentleyAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of group members for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: BentleyAPIResponse<GroupMember[]> =
      await customAccessControlClient.groupMembers.queryITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a filtered list of group members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 2;

    // Act
    const iTwinsResponse: BentleyAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId,
        { top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!).toBeDefined();
    expect(iTwinsResponse.data!.length).toBe(topAmount);
  });

  it("should get a filtered list of group members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList: BentleyAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId
      );
    const skipAmmount = 1;
    const topAmount = 3;

    // Act
    const iTwinsResponse: BentleyAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId,
        { skip: skipAmmount, top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!).toBeDefined();
    expect(iTwinsResponse.data!.length).toBe(topAmount);
    unFilteredList.data!.slice(0, skipAmmount).forEach((member) => {
      expect(iTwinsResponse.data!.includes(member)).toBe(false);
    });
  });

  it("should get a specific group member for an iTwin", async () => {
    // Act
    const iTwinsResponse: BentleyAPIResponse<GroupMember> =
      await accessControlClient.groupMembers.getITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId1
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.id).toBe(TestConfig.permanentGroupId1);
  });

  it("should get a 404 when trying to get a non-existant group member", async () => {
    // Arrange
    const notExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: BentleyAPIResponse<GroupMember> =
      await accessControlClient.groupMembers.getITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        notExistantGroupId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.data).toBeUndefined();
    expect(iTwinsResponse.error!.code).toBe("TeamMemberNotFound");
  });

  it("should get add, get, update, and remove a group member", async () => {
    // --- Add Member ---
    // Act
    const addUserMemberResponse: BentleyAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.addITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId,
        [
          {
            groupId: TestConfig.permanentGroupId2,
            roleIds: [ TestConfig.permanentRoleId1, TestConfig.permanentRoleId2 ],
          },
        ]
      );

    // Assert
    expect(addUserMemberResponse.status).toBe(201);
    expect(addUserMemberResponse.data).toBeDefined();
    expect(addUserMemberResponse.data!.length).toBeGreaterThan(0);

    // --- Check member exists and has role ---
    // Act
    const getGroupMemberResponse: BentleyAPIResponse<GroupMember> =
      await accessControlClient.groupMembers.getITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId2
      );

    expect(getGroupMemberResponse.status).toBe(200);
    expect(getGroupMemberResponse.data).toBeDefined();
    expect(getGroupMemberResponse.data!.id).toBe(TestConfig.permanentGroupId2);
    expect(getGroupMemberResponse.data!.roles!.length).toBe(2);
    expect(getGroupMemberResponse.data!.roles![0].id).toBe(TestConfig.permanentRoleId1);

    // --- Update member's role ---
    // Act
    const updatedUserMemberResponse: BentleyAPIResponse<GroupMember> =
      await accessControlClient.groupMembers.updateITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId2,
        [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2]
      );

    expect(updatedUserMemberResponse.status).toBe(200);
    expect(updatedUserMemberResponse.data).toBeDefined();
    expect(updatedUserMemberResponse.data!.id).toBe(TestConfig.permanentGroupId2);
    expect(updatedUserMemberResponse.data!.roles!.length).toBe(2);
    expect(updatedUserMemberResponse.data!.roles!.map((x) => x.id)).toContain(TestConfig.permanentRoleId1);
    expect(updatedUserMemberResponse.data!.roles!.map((x) => x.id)).toContain(TestConfig.permanentRoleId2);

    // --- Remove member ---
    // Act
    const removeUserMemberResponse: BentleyAPIResponse<undefined> =
      await accessControlClient.groupMembers.removeITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId2
      );

    expect(removeUserMemberResponse.status).toBe(204);
    expect(removeUserMemberResponse.data).toBeUndefined();
  });
});
