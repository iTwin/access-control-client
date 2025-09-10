/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, AddUserMemberResponse, Group, GroupInvitation, GroupUpdate, IAccessControlClient } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

chai.should();
describe.skip("AccessControlClient Groups", () => {
  let baseUrl: string = "https://api.bentley.com/accesscontrol/itwins";
  const urlPrefix = process.env.IMJS_URL_PREFIX;
  if (urlPrefix) {
    const url = new URL(baseUrl);
    url.hostname = urlPrefix + url.hostname;
    baseUrl = url.href;
  }
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const customAccessControlClient: IAccessControlClient = new AccessControlClient(baseUrl);
  let accessToken: AccessToken;

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of groups for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group[]> =
      await accessControlClient.groups.getITwinGroupsAsync(accessToken, TestConfig.itwinId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a list of groups for an iTwin with additional headers", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group[]> =
      await customAccessControlClient.groups.getITwinGroupsAsync(accessToken, TestConfig.itwinId, { "test-custom-header": "custom-value:xyz-123-abc" });

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a list of groups for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group[]> =
      await customAccessControlClient.groups.getITwinGroupsAsync(accessToken, TestConfig.itwinId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a specific groups for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.getITwinGroupAsync(accessToken, TestConfig.itwinId, TestConfig.permanentGroupId1);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.id).to.be.eq(TestConfig.permanentGroupId1);
    chai.expect(iTwinsResponse.data!.name).to.be.eq(TestConfig.permanentGroupName1);
  });

  it("should get a 404 when trying to get a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.getITwinGroupAsync(accessToken, TestConfig.itwinId, nonExistantGroupId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.error!.code).to.be.eq("GroupNotFound");
    chai.expect(iTwinsResponse.data).to.be.undefined;
  });

  it("should get a 404 when trying to update a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";
    const emptyUpdatedGroup: GroupUpdate = {
      name: "NonExistantGroupName",
      description: "NonExistantRoleDescription",
    };

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.updateITwinGroupAsync(accessToken, TestConfig.itwinId, nonExistantGroupId, emptyUpdatedGroup);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.error!.code).to.be.eq("GroupNotFound");
    chai.expect(iTwinsResponse.data).to.be.undefined;
  });

  it("should get a 404 when trying to remove a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.groups.deleteITwinGroupAsync(accessToken, TestConfig.itwinId, nonExistantGroupId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.error!.code).to.be.eq("GroupNotFound");
    chai.expect(iTwinsResponse.data).to.be.undefined;
  });

  it("should create, update, and delete a group", async () => {
    // --- CREATE GROUP ---
    // Arrange
    const newGroupName = `APIM Access Control Typescript Client Test Group 1 ${new Date().toISOString()}`;
    const newGroupDescription = "Integration test group - should not persist";
    const newGroup: Group = {
      name: newGroupName,
      description: newGroupDescription,
    };

    // Act
    const createResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.createITwinGroupAsync(accessToken, TestConfig.itwinId, newGroup);

    // Assert
    chai.expect(createResponse.status).to.be.eq(201);
    chai.expect(createResponse.data!.name).to.be.eq(newGroup.name);
    chai.expect(createResponse.data!.description).to.be.eq(newGroup.description);

    // --- UPDATE GROUP ---
    // Arrange
    const updatedGroup: GroupUpdate = {
      name: `${newGroupName} Updated Name`,
      description: `${newGroupDescription} Updated Description`,
      members: [TestConfig.temporaryUserEmail],
      imsGroups: [TestConfig.permanentImsGroupName],
    };

    // Act
    const updateResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.updateITwinGroupAsync(accessToken, TestConfig.itwinId, createResponse.data!.id as string, updatedGroup);

    // Assert
    chai.expect(updateResponse.status).to.be.eq(200);
    chai.expect(updateResponse.data!.name).to.be.eq(updatedGroup.name);
    chai.expect(updateResponse.data!.description).to.be.eq(updatedGroup.description);
    chai
      .expect(updateResponse.data!.members!.map((x) => x.email!))
      .to.include(TestConfig.temporaryUserEmail);
    chai
      .expect(updateResponse.data!.imsGroups!.map((x) => x))
      .to.include(TestConfig.permanentImsGroupName);

    // --- UPDATE GROUP BACK TO EMPTY---
    // Arrange
    const updatedEmptyGroup: GroupUpdate = {
      members: [],
      imsGroups: [],
    };

    // Act
    const updateEmptyResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.updateITwinGroupAsync(accessToken, TestConfig.itwinId, createResponse.data!.id as string, updatedEmptyGroup);

    // Assert
    chai.expect(updateEmptyResponse.status).to.be.eq(200);
    chai.expect(updateEmptyResponse.data!.name).to.be.eq(updatedGroup.name);
    chai.expect(updateEmptyResponse.data!.description).to.be.eq(updatedGroup.description);
    chai.expect(updateEmptyResponse.data!.members!.length).to.be.eq(0);
    chai.expect(updateEmptyResponse.data!.imsGroups!.length).to.be.eq(0);

    // --- DELETE GROUP ---
    // Act
    const deleteResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.groups.deleteITwinGroupAsync(accessToken, TestConfig.itwinId, createResponse.data!.id as string);

    // Assert
    chai.expect(deleteResponse.status).to.be.eq(204);
    chai.expect(deleteResponse.data).to.be.undefined;
  });
});

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
  let invitationIdToDelete = "";

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();

    const getGroupInvitationsResponse: AccessControlAPIResponse<GroupInvitation[]> =
      await accessControlClient.groups.getITwinGroupMemberInvitationsAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId1
      );
    chai.expect(getGroupInvitationsResponse.status).to.be.eq(200);
    chai.expect(getGroupInvitationsResponse.data).to.not.be.null;

    if (getGroupInvitationsResponse.data!.length < 8) {
      const updateGroupMemberResponse: AccessControlAPIResponse<Group> =
        await accessControlClient.groups.updateITwinGroupAsync(
          accessToken,
          TestConfig.itwinId,
          TestConfig.permanentGroupId1,
          {
            members: [
              `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
              `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
              `access-control-client-${randomIntFromInterval(0, 10000)}@example.com`,
            ],
          }
        );

      chai.expect(updateGroupMemberResponse.status).to.be.eq(201, `received error: ${JSON.stringify(updateGroupMemberResponse.error)}`);
      chai.expect(updateGroupMemberResponse.data).to.not.be.empty;
      chai.expect(updateGroupMemberResponse.data?.members?.length).to.be.eq(0);
      chai.expect(updateGroupMemberResponse.data?.invitations?.length).to.be.eq(3);
    }
  });

  it("should get a list of member invitations for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<GroupInvitation[]> =
      await accessControlClient.groups.getITwinGroupMemberInvitationsAsync(
        accessToken,
        TestConfig.itwinId,
        TestConfig.permanentGroupId1
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(2);
    invitationIdToDelete = iTwinsResponse.data![0].id;
  });

  it("delete the temporary member invitation", async () => {
    // const addUserMemberResponse: AccessControlAPIResponse<AddUserMemberResponse> =
    //   await accessControlClient.userMembers.addITwinUserMembersAsync(
    //     accessToken,
    //     TestConfig.itwinId,
    //     [
    //       {
    //         email: `access-control-client-${randomIntFromInterval(0, 10000)}-temp@example.com`,
    //         roleIds: [TestConfig.permanentRoleId1, TestConfig.permanentRoleId2],
    //       },
    //     ]
    //   );

    // chai.expect(addUserMemberResponse.status).to.be.eq(201, `received error: ${JSON.stringify(addUserMemberResponse.error)}`);
    // chai.expect(addUserMemberResponse.data).to.not.be.empty;
    // chai.expect(addUserMemberResponse.data.members.length).to.be.eq(0);
    // chai.expect(addUserMemberResponse.data.invitations.length).to.be.eq(1);

    const deleteUserGroupInvitationResponse = await accessControlClient.groups.deleteITwinGroupInvitationAsync(accessToken, TestConfig.itwinId, TestConfig.permanentGroupId1, invitationIdToDelete);

    chai.expect(deleteUserGroupInvitationResponse.status).to.be.eq(204);
  });
});

