/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { TestUsers } from "@itwin/oidc-signin-tool";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type {
  IAccessControlClient,
} from "../../accessControlTypes";
import type { BentleyAPIResponse } from "../../types/CommonApiTypes";
import { TestConfig } from "../TestConfig";
import { UserMember } from "src/types/UserMembers";

describe("AccessControlClient User Members", () => {
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

  it("should get a list of user members for an iTwin", async () => {
    // Act
    const iTwinsResponse =
      await accessControlClient.userMembers.queryITwinUserMembers(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.members.length).toBeGreaterThan(0);
    expect(iTwinsResponse.data?._links).toBeDefined();
  });

  it("should get a list of user members for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse =
      await customAccessControlClient.userMembers.queryITwinUserMembers(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.members.length).toBeGreaterThan(0);
  });

  it("should get a filtered list of user members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 5;

    // Act
    const iTwinsResponse =
      await accessControlClient.userMembers.queryITwinUserMembers(
        accessToken,
        TestConfig.itwinId,
        { top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.members.length).toBe(topAmount);
  });

  it("should get a filtered list of user members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList =
      await accessControlClient.userMembers.queryITwinUserMembers(
        accessToken,
        TestConfig.itwinId
      );
    const skipAmount = 5;
    const topAmount = 3;

    // Act
    const iTwinsResponse =
      await accessControlClient.userMembers.queryITwinUserMembers(
        accessToken,
        TestConfig.itwinId,
        { skip: skipAmount, top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.members.length).toBe(topAmount);
    unFilteredList.data?.members.slice(0, skipAmount).forEach((member) => {
      expect(iTwinsResponse.data?.members.includes(member)).toBe(false);
    });
  });

  it("should get a specific user member for an iTwin", async () => {
    // Act
    const iTwinsResponse =
      await accessControlClient.userMembers.getITwinUserMember(
        accessToken,
        TestConfig.itwinId,
        TestConfig.regularUserId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.member.id).toBe(TestConfig.regularUserId);
  });

  it("should get a 404 when trying to get a non-existant user member", async () => {
    // Arrange
    const notExistantUserId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse =
      await accessControlClient.userMembers.getITwinUserMember(
        accessToken,
        TestConfig.itwinId,
        notExistantUserId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.data).toBeUndefined();
    expect(iTwinsResponse.error?.code).toBe("TeamMemberNotFound");
  });

  it("should get add, get, update, and remove a user member", async () => {
    const regularEmail = TestUsers.regular.email ? TestUsers.regular.email : TestConfig.regularUserEmail;
    // --- Add Member ---
    // Act
    const addUserMemberResponse =
      await accessControlClient.userMembers.addITwinUserMembers(
        accessToken,
        TestConfig.itwinId,
        [
          {
            email: regularEmail,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
        ],
        "Test custom message"
      );

    // Assert
    expect(addUserMemberResponse.status).toBe(201);
    expect(addUserMemberResponse.data).toBeDefined();
    expect(addUserMemberResponse.data?.members.length).toBe(1);
    expect(addUserMemberResponse.data?.invitations.length).toBe(0);
    const newMember = addUserMemberResponse.data?.members[0] as UserMember;

    // --- Check member exists and has role ---
    // Act
    const getUserMemberResponse =
      await accessControlClient.userMembers.getITwinUserMember(
        accessToken,
        TestConfig.itwinId,
        newMember.id
      );

    expect(getUserMemberResponse.status).toBe(200);
    expect(getUserMemberResponse.data).toBeDefined();
    expect(getUserMemberResponse.data?.member.email).toBe(regularEmail);
    expect(getUserMemberResponse.data?.member.roles.length).toBe(2);
    expect(getUserMemberResponse.data?.member.roles[0].id).toBe(TestConfig.permanentRoleId1);

    // --- Update member's role ---
    // Act
    const updatedUserMemberResponse =
      await accessControlClient.userMembers.updateITwinUserMember(
        accessToken,
        TestConfig.itwinId,
        newMember.id,
        [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2]
      );

    expect(updatedUserMemberResponse.status).toBe(200);
    expect(updatedUserMemberResponse.data).toBeDefined();
    expect(updatedUserMemberResponse.data?.member.id).toBe(newMember.id);
    expect(updatedUserMemberResponse.data?.member.roles.length).toBe(2);
    expect(updatedUserMemberResponse.data?.member.roles.map((x) => x.id)).toContain(TestConfig.permanentRoleId1);
    expect(updatedUserMemberResponse.data?.member.roles.map((x) => x.id)).toContain(TestConfig.permanentRoleId2);

    // --- Remove member ---
    // Act
    const removeUserMemberResponse: BentleyAPIResponse<undefined> =
      await accessControlClient.userMembers.removeITwinUserMember(
        accessToken,
        TestConfig.itwinId,
        newMember.id
      );

    expect(removeUserMemberResponse.status).toBe(204);
    expect(removeUserMemberResponse.data).toBeUndefined();
  });
});
