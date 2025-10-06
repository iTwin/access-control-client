/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type {
  AccessControlAPIResponse,
  AddUserMemberResponse,
  IAccessControlClient,
  MemberInvitation,
} from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

describe("AccessControlClient Member Invitations", () => {
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

    const getMemberInvitationsResponse: AccessControlAPIResponse<MemberInvitation[]> =
      await accessControlClient.memberInvitations.queryITwinMemberInvitationsAsync(
        accessToken,
        TestConfig.itwinId
      );
    expect(getMemberInvitationsResponse.status).toBe(200);
    expect(getMemberInvitationsResponse.data).not.toBeNull();

    if (getMemberInvitationsResponse.data!.length < 8) {
      const addUserMemberResponse: AccessControlAPIResponse<AddUserMemberResponse> =
      await accessControlClient.userMembers.addITwinUserMembersAsync(
        accessToken,
        TestConfig.itwinId,
        [
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
        ]
      );

      expect(addUserMemberResponse.status).toBe(201);
      expect(addUserMemberResponse.data).toBeDefined();
      expect(addUserMemberResponse.data!.members.length).toBe(0);
      expect(addUserMemberResponse.data!.invitations.length).toBe(8);
    }
  }, 60000);

  it("should get a list of member invitations for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<MemberInvitation[]> =
      await accessControlClient.memberInvitations.queryITwinMemberInvitationsAsync(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(7);
  });

  it("should get a filtered list of member invitations for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 5;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<MemberInvitation[]> =
    await accessControlClient.memberInvitations.queryITwinMemberInvitationsAsync(
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

  it("should get a filtered list of member invitations for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList: AccessControlAPIResponse<MemberInvitation[]> =
    await accessControlClient.memberInvitations.queryITwinMemberInvitationsAsync(
      accessToken,
      TestConfig.itwinId
    );
    const skipAmmount = 5;
    const topAmount = 3;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<MemberInvitation[]> =
    await accessControlClient.memberInvitations.queryITwinMemberInvitationsAsync(
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

  it("delete the temporary member invitation", async () => {
    const addUserMemberResponse: AccessControlAPIResponse<AddUserMemberResponse> =
      await accessControlClient.userMembers.addITwinUserMembersAsync(
        accessToken,
        TestConfig.itwinId,
        [
          {
            email: `access-control-client-${randomIntFromInterval(0, 10000)}-temp@example.com`,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
        ]
      );

    expect(addUserMemberResponse.status).toBe(201);
    expect(addUserMemberResponse.data).toBeDefined();
    expect(addUserMemberResponse.data!.members.length).toBe(0);
    expect(addUserMemberResponse.data!.invitations.length).toBe(1);

    const deleteUserMemberInvitationResponse = await accessControlClient.memberInvitations.deleteITwinMemberInvitationAsync(accessToken, TestConfig.itwinId, addUserMemberResponse.data!.invitations[0].id);

    expect(deleteUserMemberInvitationResponse.status).toBe(204);
  });
});
