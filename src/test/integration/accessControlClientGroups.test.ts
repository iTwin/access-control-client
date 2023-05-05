/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, Group, IAccessControlClient } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

chai.should();
describe("AccessControlClient Groups", () => {
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
      await accessControlClient.groups.getITwinGroupsAsync(accessToken, TestConfig.projectId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a list of groups for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group[]> =
      await customAccessControlClient.groups.getITwinGroupsAsync(accessToken, TestConfig.projectId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a specific groups for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.getITwinGroupAsync(accessToken, TestConfig.projectId, TestConfig.permanentGroupId1);

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
      await accessControlClient.groups.getITwinGroupAsync(accessToken, TestConfig.projectId, nonExistantGroupId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.error!.code).to.be.eq("GroupNotFound");
    chai.expect(iTwinsResponse.data).to.be.undefined;
  });

  it("should get a 404 when trying to update a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";
    const emptyUpdatedGroup: Group = {
      name: "NonExistantGroupName",
      description: "NonExistantRoleDescription",
    };

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.updateITwinGroupAsync(accessToken, TestConfig.projectId, nonExistantGroupId, emptyUpdatedGroup);

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
      await accessControlClient.groups.deleteITwinGroupAsync(accessToken, TestConfig.projectId, nonExistantGroupId);

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
      await accessControlClient.groups.createITwinGroupAsync(accessToken, TestConfig.projectId, newGroup);

    // Assert
    chai.expect(createResponse.status).to.be.eq(201);
    chai.expect(createResponse.data!.name).to.be.eq(newGroup.name);
    chai.expect(createResponse.data!.description).to.be.eq(newGroup.description);

    // --- UPDATE GROUP ---
    // Arrange
    const updatedGroup: {
      id?: string;
      name?: string;
      description?: string;
      users?: string[];
      imsGroups?: string[];
    } = {
      name: `${newGroupName} Updated Name`,
      description: `${newGroupDescription} Updated Description`,
      users: [TestConfig.temporaryUserEmail],
      imsGroups: [TestConfig.permanentImsGroupName],
    };

    // Act
    const updateResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.updateITwinGroupAsync(accessToken, TestConfig.projectId, createResponse.data!.id as string, updatedGroup);

    // Assert
    chai.expect(updateResponse.status).to.be.eq(200);
    chai.expect(updateResponse.data!.name).to.be.eq(updatedGroup.name);
    chai.expect(updateResponse.data!.description).to.be.eq(updatedGroup.description);
    chai
      .expect(updateResponse.data!.members!.map((x) => x))
      .to.include(TestConfig.temporaryUserEmail);
    chai
      .expect(updateResponse.data!.imsGroups!.map((x) => x))
      .to.include(TestConfig.permanentImsGroupName);

    // --- UPDATE GROUP BACK TO EMPTY---
    // Arrange
    const updatedEmptyGroup: Group = {
      members: [],
      imsGroups: [],
    };

    // Act
    const updateEmptyResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.updateITwinGroupAsync(accessToken, TestConfig.projectId, createResponse.data!.id as string, updatedEmptyGroup);

    // Assert
    chai.expect(updateEmptyResponse.status).to.be.eq(200);
    chai.expect(updateEmptyResponse.data!.name).to.be.eq(updatedGroup.name);
    chai.expect(updateEmptyResponse.data!.description).to.be.eq(updatedGroup.description);
    chai.expect(updateEmptyResponse.data!.members!.length).to.be.eq(0);
    chai.expect(updateEmptyResponse.data!.imsGroups!.length).to.be.eq(0);

    // --- DELETE GROUP ---
    // Act
    const deleteResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.groups.deleteITwinGroupAsync(accessToken, TestConfig.projectId, createResponse.data!.id as string);

    // Assert
    chai.expect(deleteResponse.status).to.be.eq(204);
    chai.expect(deleteResponse.data).to.be.undefined;
  });
});
