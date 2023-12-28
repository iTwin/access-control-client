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
  UserMember,
} from "../../accessControlTypes";
import { TestUsers } from "@itwin/oidc-signin-tool/lib/cjs/frontend";
import { TestConfig } from "../TestConfig";

chai.should();
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

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of user members for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<UserMember[]> =
      await accessControlClient.userMembers.queryITwinUserMembersAsync(
        accessToken,
        TestConfig.projectId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a list of user members for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<UserMember[]> =
      await customAccessControlClient.userMembers.queryITwinUserMembersAsync(
        accessToken,
        TestConfig.projectId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a filtered list of user members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 5;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<UserMember[]> =
      await accessControlClient.userMembers.queryITwinUserMembersAsync(
        accessToken,
        TestConfig.projectId,
        { top: topAmount }
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.eq(topAmount);
  });

  it("should get a filtered list of user members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList: AccessControlAPIResponse<UserMember[]> =
      await accessControlClient.userMembers.queryITwinUserMembersAsync(
        accessToken,
        TestConfig.projectId
      );
    const skipAmmount = 5;
    const topAmount = 3;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<UserMember[]> =
      await accessControlClient.userMembers.queryITwinUserMembersAsync(
        accessToken,
        TestConfig.projectId,
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

  it("should get a specific user member for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<UserMember> =
      await accessControlClient.userMembers.getITwinUserMemberAsync(
        accessToken,
        TestConfig.projectId,
        TestConfig.regularUserId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.id).to.be.eq(TestConfig.regularUserId);
  });

  it("should get a 404 when trying to get a non-existant user member", async () => {
    // Arrange
    const notExistantUserId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<UserMember> =
      await accessControlClient.userMembers.getITwinUserMemberAsync(
        accessToken,
        TestConfig.projectId,
        notExistantUserId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.data).to.be.undefined;
    chai.expect(iTwinsResponse.error!.code).to.be.eq("TeamMemberNotFound");
  });

  it("should get add, get, update, and remove a user member", async () => {
    // --- Add Member ---
    // Act
    const addUserMemberResponse: AccessControlAPIResponse<AddUserMemberResponse> =
      await accessControlClient.userMembers.addITwinUserMembersAsync(
        accessToken,
        TestConfig.projectId,
        [
          {
            email: TestUsers.regular.email,
            roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
          },
        ]
      );

    // Assert
    chai.expect(addUserMemberResponse.status).to.be.eq(201, `received error: ${JSON.stringify(addUserMemberResponse.error)}`);
    chai.expect(addUserMemberResponse.data).to.not.be.empty;
    chai.expect(addUserMemberResponse.data!.members.length).to.be.eq(1);
    chai.expect(addUserMemberResponse.data!.invitations.length).to.be.eq(0);
    const newMember = addUserMemberResponse.data!.members[0];

    // --- Check member exists and has role ---
    // Act
    const getUserMemberResponse: AccessControlAPIResponse<UserMember> =
      await accessControlClient.userMembers.getITwinUserMemberAsync(
        accessToken,
        TestConfig.projectId,
        newMember.id!
      );

    chai.expect(getUserMemberResponse.status).to.be.eq(200);
    chai.expect(getUserMemberResponse.data).to.not.be.undefined;
    chai
      .expect(getUserMemberResponse.data!.email)
      .to.be.eq(TestUsers.regular.email);
    chai.expect(getUserMemberResponse.data!.roles!.length).to.be.eq(1);
    chai
      .expect(getUserMemberResponse.data!.roles![0].id)
      .to.be.eq(TestConfig.permanentRoleId1);

    // --- Update member's role ---
    // Act
    const updatedUserMemberResponse: AccessControlAPIResponse<UserMember> =
      await accessControlClient.userMembers.updateITwinUserMemberAsync(
        accessToken,
        TestConfig.projectId,
        newMember.id!,
        [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2]
      );

    chai.expect(updatedUserMemberResponse.status).to.be.eq(200);
    chai.expect(updatedUserMemberResponse.data).to.not.be.undefined;
    chai
      .expect(updatedUserMemberResponse.data!.id)
      .to.be.eq(newMember.id!);
    chai.expect(updatedUserMemberResponse.data!.roles!.length).to.be.eq(2);
    chai
      .expect(updatedUserMemberResponse.data!.roles!.map((x) => x.id))
      .to.include(TestConfig.permanentRoleId1);
    chai
      .expect(updatedUserMemberResponse.data!.roles!.map((x) => x.id))
      .to.include(TestConfig.permanentRoleId2);

    // --- Remove member ---
    // Act
    const removeUserMemberResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.userMembers.removeITwinUserMemberAsync(
        accessToken,
        TestConfig.projectId,
        newMember.id!
      );

    chai.expect(removeUserMemberResponse.status).to.be.eq(204);
    chai.expect(removeUserMemberResponse.data).to.be.undefined;
  });
});
