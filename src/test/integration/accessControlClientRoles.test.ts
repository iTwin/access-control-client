/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, IAccessControlClient, Role } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

describe("AccessControlClient Roles", () => {
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

  it("should get a list of roles for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Role[]> =
      await accessControlClient.roles.getITwinRolesAsync(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of roles for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Role[]> =
      await customAccessControlClient.roles.getITwinRolesAsync(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of roles for an iTwin with additional headers", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Role[]> =
      await customAccessControlClient.roles.getITwinRolesAsync(accessToken, TestConfig.itwinId, { "test-custom-header": "custom-value:xyz-123-abc" });

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a specific role for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Role> =
      await accessControlClient.roles.getITwinRoleAsync(accessToken, TestConfig.itwinId, TestConfig.permanentRoleId1);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.id).toBe(TestConfig.permanentRoleId1);
    expect(iTwinsResponse.data!.displayName).toBe(TestConfig.permanentRoleName1);
  });

  it("should get a 404 when trying to get a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Role> =
      await accessControlClient.roles.getITwinRoleAsync(accessToken, TestConfig.itwinId, nonExistantRoleId);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("RoleNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to update a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";
    const emptyUpdatedRole: Role = {
      displayName: "NonExistantRoleName",
      description: "NonExistantRoleDescription",
      permissions: [],
    };

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Role> =
      await accessControlClient.roles.updateITwinRoleAsync(accessToken, TestConfig.itwinId, nonExistantRoleId, emptyUpdatedRole);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("RoleNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to remove a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.roles.deleteITwinRoleAsync(accessToken, TestConfig.itwinId, nonExistantRoleId);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("RoleNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should create, update, and delete a role", async () => {
    // --- CREATE ROLE ---
    // Arrange
    const newRoleName = `APIM Access Control Typescript Client Test Role 1 ${new Date().toISOString()}`;
    const newRoleDescription = "Integration test role - should not persist";
    const newRole: Role = {
      displayName: newRoleName,
      description: newRoleDescription,
      permissions: [],
    };

    // Act
    const createResponse: AccessControlAPIResponse<Role> =
      await accessControlClient.roles.createITwinRoleAsync(accessToken, TestConfig.itwinId, newRole);

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.data!.displayName).toBe(newRole.displayName);
    expect(createResponse.data!.description).toBe(newRole.description);

    // --- UPDATE ROLE ---
    // Arrange
    const updatedRole: Role = {
      displayName: newRoleName,
      description: "UPDATED ROLE DESCRIPTION",
      permissions: [],
    };

    // Act
    const updateResponse: AccessControlAPIResponse<Role> =
      await accessControlClient.roles.updateITwinRoleAsync(accessToken, TestConfig.itwinId, createResponse.data!.id!, updatedRole);

    // Assert
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data!.displayName).toBe(updatedRole.displayName);
    expect(updateResponse.data!.description).toBe(updatedRole.description);

    // --- DELETE ROLE ---
    // Act
    const deleteResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.roles.deleteITwinRoleAsync(accessToken, TestConfig.itwinId, createResponse.data!.id!);

    // Assert
    expect(deleteResponse.status).toBe(204);
    expect(deleteResponse.data).toBeUndefined();
  });
});
