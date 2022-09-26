/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, IAccessControlClient, Member } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

chai.should();
describe("AccessControlClient Members", () => {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  let accessToken: AccessToken;

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of members for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Member[]> =
      await accessControlClient.members.queryITwinMembersAsync(accessToken, TestConfig.projectId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a filtered list of members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 5;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Member[]> =
      await accessControlClient.members.queryITwinMembersAsync(accessToken, TestConfig.projectId, {top: topAmount});

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.eq(topAmount);
  });

  it("should get a filtered list of members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList: AccessControlAPIResponse<Member[]> =
      await accessControlClient.members.queryITwinMembersAsync(accessToken, TestConfig.projectId);
    const skipAmmount = 5;
    const topAmount = 3;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Member[]> =
      await accessControlClient.members.queryITwinMembersAsync(accessToken, TestConfig.projectId, {skip: skipAmmount, top: topAmount});

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.eq(topAmount);
    unFilteredList.data!.slice(0, skipAmmount).forEach((member) => {
      chai.expect(iTwinsResponse.data!.includes(member)).to.be.false;
    });
  });

  it("should get a specific member for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Member> =
      await accessControlClient.members.getITwinMemberAsync(accessToken, TestConfig.projectId, TestConfig.regularUserId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.id).to.be.eq(TestConfig.regularUserId);
  });

  it("should get a 404 when trying to get a non-existant member", async () => {
    // Arrange
    const notExistantUserId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Member> =
      await accessControlClient.members.getITwinMemberAsync(accessToken, TestConfig.projectId, notExistantUserId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.data).to.be.undefined;
    chai.expect(iTwinsResponse.error!.code).to.be.eq("TeamMemberNotFound");
  });

  it("should get add, get, update, and remove a member", async () => {
    // --- Add Member ---
    // Act
    const addMemberResponse: AccessControlAPIResponse<undefined> = await accessControlClient.members.addITwinMembersAsync(accessToken, TestConfig.projectId, [{
      email: TestConfig.temporaryUserEmail,
      roleid: TestConfig.permanentRoleId1,
    }]);

    // Assert
    chai.expect(addMemberResponse.status).to.be.eq(201);
    chai.expect(addMemberResponse.data).to.be.undefined;

    // --- Check member exists and has role ---
    // Act
    const getMemberResponse: AccessControlAPIResponse<Member> =
    await accessControlClient.members.getITwinMemberAsync(accessToken, TestConfig.projectId, TestConfig.temporaryUserId);

    chai.expect(getMemberResponse.status).to.be.eq(200);
    chai.expect(getMemberResponse.data!).to.not.be.undefined;
    chai.expect(getMemberResponse.data!.email).to.be.eq(TestConfig.temporaryUserEmail);
    chai.expect(getMemberResponse.data!.roles!.length).to.be.eq(1);
    chai.expect(getMemberResponse.data!.roles![0].id).to.be.eq(TestConfig.permanentRoleId1);

    // --- Update member's role ---
    // Act
    const updatedMemberResponse: AccessControlAPIResponse<Member> =
    await accessControlClient.members.updateITwinMemberAsync(accessToken, TestConfig.projectId, TestConfig.temporaryUserId, [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2]);

    chai.expect(updatedMemberResponse.status).to.be.eq(200);
    chai.expect(updatedMemberResponse.data!).to.not.be.undefined;
    chai.expect(updatedMemberResponse.data!.id).to.be.eq(TestConfig.temporaryUserId);
    chai.expect(updatedMemberResponse.data!.roles!.length).to.be.eq(2);
    chai.expect(updatedMemberResponse.data!.roles!.map((x) => x.id)).to.include(TestConfig.permanentRoleId1);
    chai.expect(updatedMemberResponse.data!.roles!.map((x) => x.id)).to.include(TestConfig.permanentRoleId2);
    // --- Remove member ---
    // Act
    const removeMemberResponse: AccessControlAPIResponse<undefined> =
    await accessControlClient.members.removeITwinMemberAsync(accessToken, TestConfig.projectId, TestConfig.temporaryUserId);

    chai.expect(removeMemberResponse.status).to.be.eq(204);
    chai.expect(removeMemberResponse.data).to.be.undefined;
  });

});
