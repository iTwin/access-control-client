/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, Group, GroupUpdate, IAccessControlClient } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

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

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
  }, 30000);

  it("should get a list of groups for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group[]> =
      await accessControlClient.groups.getITwinGroupsAsync(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of groups for an iTwin with additional headers", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group[]> =
      await customAccessControlClient.groups.getITwinGroupsAsync(accessToken, TestConfig.itwinId, { "test-custom-header": "custom-value:xyz-123-abc" });

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of groups for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group[]> =
      await customAccessControlClient.groups.getITwinGroupsAsync(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a specific groups for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.getITwinGroupAsync(accessToken, TestConfig.itwinId, TestConfig.permanentGroupId1);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.id).toBe(TestConfig.permanentGroupId1);
    expect(iTwinsResponse.data!.name).toBe(TestConfig.permanentGroupName1);
  });

  it("should get a 404 when trying to get a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Group> =
      await accessControlClient.groups.getITwinGroupAsync(accessToken, TestConfig.itwinId, nonExistantGroupId);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("GroupNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
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
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("GroupNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to remove a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.groups.deleteITwinGroupAsync(accessToken, TestConfig.itwinId, nonExistantGroupId);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("GroupNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
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
    expect(createResponse.status).toBe(201);
    expect(createResponse.data!.name).toBe(newGroup.name);
    expect(createResponse.data!.description).toBe(newGroup.description);

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
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data!.name).toBe(updatedGroup.name);
    expect(updateResponse.data!.description).toBe(updatedGroup.description);
    expect(updateResponse.data!.members!.map((x) => x.email!)).toContain(TestConfig.temporaryUserEmail);
    expect(updateResponse.data!.imsGroups!.map((x) => x)).toContain(TestConfig.permanentImsGroupName);

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
    expect(updateEmptyResponse.status).toBe(200);
    expect(updateEmptyResponse.data!.name).toBe(updatedGroup.name);
    expect(updateEmptyResponse.data!.description).toBe(updatedGroup.description);
    expect(updateEmptyResponse.data!.members!.length).toBe(0);
    expect(updateEmptyResponse.data!.imsGroups!.length).toBe(0);

    // --- DELETE GROUP ---
    // Act
    const deleteResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.groups.deleteITwinGroupAsync(accessToken, TestConfig.itwinId, createResponse.data!.id as string);

    // Assert
    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.data).toBeUndefined();
  });
});
