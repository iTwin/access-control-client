/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
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

chai.should();
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

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();

    const getMemberInvitationsResponse: AccessControlAPIResponse<MemberInvitation[]> =
      await accessControlClient.memberInvitations.queryITwinMemberInvitationsAsync(
        accessToken,
        TestConfig.itwinId
      );
    chai.expect(getMemberInvitationsResponse.status).to.be.eq(200);
    chai.expect(getMemberInvitationsResponse.data).to.not.be.null;

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

      chai.expect(addUserMemberResponse.status).to.be.eq(201, `received error: ${JSON.stringify(addUserMemberResponse.error)}`);
      chai.expect(addUserMemberResponse.data).to.not.be.empty;
      chai.expect(addUserMemberResponse.data!.members.length).to.be.eq(0);
      chai.expect(addUserMemberResponse.data!.invitations.length).to.be.eq(8);
    }
  });

  it("should get a list of member invitations for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<MemberInvitation[]> =
      await accessControlClient.memberInvitations.queryITwinMemberInvitationsAsync(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(7);
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
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.eq(topAmount);
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
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.eq(topAmount);
    unFilteredList.data!.slice(0, skipAmmount).forEach((member) => {
      chai.expect(iTwinsResponse.data!.includes(member)).to.be.false;
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

      chai.expect(addUserMemberResponse.status).to.be.eq(201, `received error: ${JSON.stringify(addUserMemberResponse.error)}`);
      chai.expect(addUserMemberResponse.data).to.not.be.empty;
      chai.expect(addUserMemberResponse.data!.members.length).to.be.eq(0);
      chai.expect(addUserMemberResponse.data!.invitations.length).to.be.eq(1);

    const deleteUserMemberInvitationResponse = await accessControlClient.memberInvitations.deleteITwinMemberInvitationAsync(accessToken, TestConfig.itwinId, addUserMemberResponse.data!.invitations[0].id);

    chai.expect(deleteUserMemberInvitationResponse.status).to.be.eq(204);
  });
});
