/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { IAccessControlClient } from "../../accessControlClientInterfaces/accessControl";
import type { BentleyAPIResponse } from "../../types/CommonApiTypes";
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
    const iTwinsResponse =
      await accessControlClient.groups.getITwinGroups(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.groups!.length).toBeGreaterThan(0);
  });

  it("should get a list of groups for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse =
      await customAccessControlClient.groups.getITwinGroups(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.groups!.length).toBeGreaterThan(0);
  });

  it("should get a specific groups for an iTwin", async () => {
    // Act
    const iTwinsResponse =
      await accessControlClient.groups.getITwinGroup(accessToken, TestConfig.itwinId, TestConfig.permanentGroupId1);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data?.group!.id).toBe(TestConfig.permanentGroupId1);
    expect(iTwinsResponse.data?.group!.name).toBe(TestConfig.permanentGroupName1);
  });

  it("should get a 404 when trying to get a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse =
      await accessControlClient.groups.getITwinGroup(accessToken, TestConfig.itwinId, nonExistantGroupId);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("GroupNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to update a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";
    const emptyUpdatedGroup = {
      name: "NonExistantGroupName",
      description: "NonExistantRoleDescription",
    };

    // Act
    const iTwinsResponse =
      await accessControlClient.groups.updateITwinGroup(accessToken, TestConfig.itwinId, nonExistantGroupId, emptyUpdatedGroup);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("GroupNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to remove a non-existant group", async () => {
    // Arrange
    const nonExistantGroupId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse =
      await accessControlClient.groups.deleteITwinGroup(accessToken, TestConfig.itwinId, nonExistantGroupId);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("GroupNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should get a 422 when trying to create a group with invalid name", async () => {
    // Arrange
    const invalidGroup = {
      name: "", // Empty name should trigger validation error
      description: "Valid description",
    };

    // Act
    const createResponse =
      await accessControlClient.groups.createITwinGroup(accessToken, TestConfig.itwinId, invalidGroup);

    // Assert
    expect(createResponse.status).toBe(422);
    expect(createResponse.error!.code).toBe("InvalidiTwinsGroupRequest");
    expect(createResponse.data).toBeUndefined();
  });

  // todo re-enable when access control client releases fix
  it.skip("should get a 422 when trying to create a group with name that's too long", async () => {
    // Arrange
    const veryLongName = "A".repeat(256); // Assuming there's a character limit
    const invalidGroup = {
      name: veryLongName,
      description: "Valid description",
    };

    // Act
    const createResponse =
      await accessControlClient.groups.createITwinGroup(accessToken, TestConfig.itwinId, invalidGroup);

    // Assert
    expect(createResponse.status).toBe(422);
    expect(createResponse.error!.code).toBe("InvalidiTwinsGroupRequest");
    expect(createResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to update a group with invalid email format", async () => {
    // First create a group to update
    const newGroup = {
      name: `Test Group ${new Date().toISOString()}`,
      description: "Test group for validation",
    };

    const createResponse =
      await accessControlClient.groups.createITwinGroup(accessToken, TestConfig.itwinId, newGroup);

    expect(createResponse.status).toBe(201);

    // Arrange - invalid email format
    const invalidUpdateGroup = {
      members: ["invalid-email-format"], // Invalid email format
    };

    try {
      // Act
      const updateResponse =
        await accessControlClient.groups.updateITwinGroup(accessToken, TestConfig.itwinId, createResponse.data?.group!.id as string, invalidUpdateGroup);

      // Assert
      expect(updateResponse.status).toBe(404);
      expect(updateResponse.error!.code).toBe("TeamMemberNotFound");
      expect(updateResponse.data).toBeUndefined();
    } finally {
      // Cleanup - delete the test group
      await accessControlClient.groups.deleteITwinGroup(accessToken, TestConfig.itwinId, createResponse.data?.group!.id as string);
    }
  });

  it("should get a 404 when trying to update a group with non-existent user email", async () => {
    // First create a group to update
    const newGroup = {
      name: `Test Group ${new Date().toISOString()}`,
      description: "Test group for validation",
    };

    const createResponse =
      await accessControlClient.groups.createITwinGroup(accessToken, TestConfig.itwinId, newGroup);

    expect(createResponse.status).toBe(201);

    // Arrange - non-existent user email
    const invalidUpdateGroup = {
      members: ["nonexistent.user@example.com"], // Valid format but user doesn't exist
    };

    try {
      // Act
      const updateResponse =
        await accessControlClient.groups.updateITwinGroup(accessToken, TestConfig.itwinId, createResponse.data?.group!.id as string, invalidUpdateGroup);

      // Assert
      expect(404).toBe(updateResponse.status); // Could be 404 depending on API implementation
      expect(updateResponse.error).toBeDefined();
      expect(updateResponse.data).toBeUndefined();
    } finally {
      // Cleanup - delete the test group
      await accessControlClient.groups.deleteITwinGroup(accessToken, TestConfig.itwinId, createResponse.data?.group!.id as string);
    }
  });

  it("should get a 422 when trying to create a group with duplicate name", async () => {
    // First create a group
    const originalGroup = {
      name: `Unique Test Group ${new Date().toISOString()}`,
      description: "Original group",
    };

    const firstCreateResponse =
      await accessControlClient.groups.createITwinGroup(accessToken, TestConfig.itwinId, originalGroup);

    expect(firstCreateResponse.status).toBe(201);

    try {
      // Arrange - try to create another group with the same name
      const duplicateGroup = {
        name: originalGroup.name, // Same name as first group
        description: "Duplicate name group",
      };

      // Act
      const duplicateCreateResponse =
        await accessControlClient.groups.createITwinGroup(accessToken, TestConfig.itwinId, duplicateGroup);

      // Assert
      expect([422, 409]).toContain(duplicateCreateResponse.status); // Could be 422 (validation) or 409 (conflict)
      expect(duplicateCreateResponse.error).toBeDefined();
      expect(duplicateCreateResponse.data).toBeUndefined();
    } finally {
      // Cleanup - delete the original group
      await accessControlClient.groups.deleteITwinGroup(accessToken, TestConfig.itwinId, firstCreateResponse.data?.group!.id as string);
    }
  });

  it("should create, update, and delete a group", async () => {
    // --- CREATE GROUP ---
    // Arrange
    const newGroupName = `APIM Access Control Typescript Client Test Group 1 ${new Date().toISOString()}`;
    const newGroupDescription = "Integration test group - should not persist";
    const newGroup = {
      name: newGroupName,
      description: newGroupDescription,
    };

    // Act
    const createResponse =
      await accessControlClient.groups.createITwinGroup(accessToken, TestConfig.itwinId, newGroup);

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.data?.group!.name).toBe(newGroup.name);
    expect(createResponse.data?.group!.description).toBe(newGroup.description);

    try {
      // --- UPDATE GROUP ---
      // Arrange
      const updatedGroup = {
        name: `${newGroupName} Updated Name`,
        description: `${newGroupDescription} Updated Description`,
        members: [TestConfig.temporaryUserEmail],
        imsGroups: [TestConfig.permanentImsGroupName],
      };

      // Act
      const updateResponse =
        await accessControlClient.groups.updateITwinGroup(accessToken, TestConfig.itwinId, createResponse.data?.group!.id as string, updatedGroup);

      // Assert
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data?.group!.name).toBe(updatedGroup.name);
      expect(updateResponse.data?.group!.description).toBe(updatedGroup.description);
      expect(updateResponse.data?.group!.members.map((x) => x.email)).toContain(TestConfig.temporaryUserEmail);
      expect(updateResponse.data?.group!.imsGroups.map((x) => x)).toContain(TestConfig.permanentImsGroupName);

      // --- UPDATE GROUP BACK TO EMPTY---
      // Arrange
      const updatedEmptyGroup = {
        members: [],
        imsGroups: [],
      };

      // Act
      const updateEmptyResponse =
        await accessControlClient.groups.updateITwinGroup(accessToken, TestConfig.itwinId, createResponse.data?.group!.id as string, updatedEmptyGroup);

      // Assert
      expect(updateEmptyResponse.status).toBe(200);
      expect(updateEmptyResponse.data?.group!.name).toBe(updatedGroup.name);
      expect(updateEmptyResponse.data?.group!.description).toBe(updatedGroup.description);
      expect(updateEmptyResponse.data?.group!.members!.length).toBe(0);
      expect(updateEmptyResponse.data?.group!.imsGroups!.length).toBe(0);
    } finally {
      // --- DELETE GROUP (cleanup) ---
      // Ensure group is deleted even if test fails
      const deleteResponse: BentleyAPIResponse<undefined> =
        await accessControlClient.groups.deleteITwinGroup(accessToken, TestConfig.itwinId, createResponse.data?.group!.id as string);

      // Assert cleanup was successful
      expect(deleteResponse.status).toBe(204);
      expect(deleteResponse.data).toBeUndefined();
    }
  });
});
