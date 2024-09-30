/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
import { AccessControlClient } from "../../AccessControlClient";
import type {
  AccessControlAPIResponse,
  GroupMember,
  IAccessControlClient,
} from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

chai.should();
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

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of group members for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a list of group members for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<GroupMember[]> =
      await customAccessControlClient.groupMembers.queryITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a filtered list of group members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 2;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
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

  it("should get a filtered list of group members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList: AccessControlAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
        accessToken,
        TestConfig.itwinId
      );
    const skipAmmount = 1;
    const topAmount = 3;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<GroupMember[]> =
      await accessControlClient.groupMembers.queryITwinGroupMembersAsync(
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

  it("should get a specific group member for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<GroupMember> =
      await accessControlClient.groupMembers.getITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId1
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.id).to.be.eq(TestConfig.permanentGroupId1);
  });

  it("should get a 404 when trying to get a non-existant group member", async () => {
    // Arrange
    const notExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<GroupMember> =
      await accessControlClient.groupMembers.getITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        notExistantGroupId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.data).to.be.undefined;
    chai.expect(iTwinsResponse.error!.code).to.be.eq("TeamMemberNotFound");
  });

  it("should get add, get, update, and remove a group member", async () => {
    // --- Add Member ---
    // Act
    const addUserMemberResponse: AccessControlAPIResponse<GroupMember[]> =
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
    chai.expect(addUserMemberResponse.status).to.be.eq(201);
    chai.expect(addUserMemberResponse.data).to.not.be.empty;
    chai.expect(addUserMemberResponse.data!.length).to.be.greaterThan(0);

    // --- Check member exists and has role ---
    // Act
    const getGroupMemberResponse: AccessControlAPIResponse<GroupMember> =
      await accessControlClient.groupMembers.getITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId2
      );

    chai.expect(getGroupMemberResponse.status).to.be.eq(200);
    chai.expect(getGroupMemberResponse.data).to.not.be.undefined;
    chai
      .expect(getGroupMemberResponse.data!.id)
      .to.be.eq(TestConfig.permanentGroupId2);
    chai.expect(getGroupMemberResponse.data!.roles!.length).to.be.eq(2);
    chai
      .expect(getGroupMemberResponse.data!.roles![0].id)
      .to.be.eq(TestConfig.permanentRoleId1);

    // --- Update member's role ---
    // Act
    const updatedUserMemberResponse: AccessControlAPIResponse<GroupMember> =
      await accessControlClient.groupMembers.updateITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId2,
        [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2]
      );

    chai.expect(updatedUserMemberResponse.status).to.be.eq(200);
    chai.expect(updatedUserMemberResponse.data).to.not.be.undefined;
    chai
      .expect(updatedUserMemberResponse.data!.id)
      .to.be.eq(TestConfig.permanentGroupId2);
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
      await accessControlClient.groupMembers.removeITwinGroupMemberAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId2
      );

    chai.expect(removeUserMemberResponse.status).to.be.eq(204);
    chai.expect(removeUserMemberResponse.data).to.be.undefined;
  });
});
