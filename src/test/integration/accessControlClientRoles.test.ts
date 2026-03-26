/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { IAccessControlClient } from "../../accessControlClientInterfaces/accessControl";
import type { BentleyAPIResponse } from "../../types/CommonApiTypes";
import type { Role } from "../../types/Role";
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
    const iTwinsResponse: BentleyAPIResponse<Role[]> =
      await accessControlClient.roles.getITwinRoles(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of roles for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: BentleyAPIResponse<Role[]> =
      await customAccessControlClient.roles.getITwinRoles(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a specific role for an iTwin", async () => {
    // Act
    const iTwinsResponse =
      await accessControlClient.roles.getITwinRole(accessToken, TestConfig.itwinId, TestConfig.permanentRoleId1);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.id).toBe(TestConfig.permanentRoleId1);
    expect(iTwinsResponse.data!.displayName).toBe(TestConfig.permanentRoleName1);
    expect(iTwinsResponse.data!.type).toBeDefined();
  });

  it("should get a created custom role with type Custom", async () => {
    // --- CREATE ROLE ---
    const newRole = {
      displayName: `APIM Access Control Typescript Client Test Get Role ${new Date().toISOString()}`,
      description: "Integration test role for get operation",
      permissions: [],
    };

    const createResponse =
      await accessControlClient.roles.createITwinRole(accessToken, TestConfig.itwinId, newRole);

    expect(createResponse.status).toBe(201);
    expect(createResponse.data).toBeDefined();
    expect(createResponse.data!.type).toBe("Custom");

    try {
      // --- GET CREATED ROLE ---
      const getResponse =
        await accessControlClient.roles.getITwinRole(accessToken, TestConfig.itwinId, createResponse.data!.id);

      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toBeDefined();
      expect(getResponse.data!.id).toBe(createResponse.data!.id);
      expect(getResponse.data!.displayName).toBe(newRole.displayName);
      expect(getResponse.data!.description).toBe(newRole.description);
      expect(getResponse.data!.type).toBe("Custom");
    } finally {
      // --- DELETE ROLE (cleanup) ---
      const deleteResponse: BentleyAPIResponse<undefined> =
        await accessControlClient.roles.deleteITwinRole(accessToken, TestConfig.itwinId, createResponse.data!.id);

      expect(deleteResponse.status).toBe(204);
      expect(deleteResponse.data).toBeUndefined();
    }
  });

  it("should get a 404 when trying to get a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse =
      await accessControlClient.roles.getITwinRole(accessToken, TestConfig.itwinId, nonExistantRoleId);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("RoleNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to update a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";
    const emptyUpdatedRole = {
      displayName: "NonExistantRoleName",
      description: "NonExistantRoleDescription",
      permissions: [],
    };

    // Act
    const iTwinsResponse =
      await accessControlClient.roles.updateITwinRole(accessToken, TestConfig.itwinId, nonExistantRoleId, emptyUpdatedRole);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.error!.code).toBe("RoleNotFound");
    expect(iTwinsResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to remove a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: BentleyAPIResponse<undefined> =
      await accessControlClient.roles.deleteITwinRole(accessToken, TestConfig.itwinId, nonExistantRoleId);

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
    const newRole = {
      displayName: newRoleName,
      description: newRoleDescription,
      permissions: [],
    };

    // Act
    const createResponse =
      await accessControlClient.roles.createITwinRole(accessToken, TestConfig.itwinId, newRole);

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.data!.displayName).toBe(newRole.displayName);
    expect(createResponse.data!.description).toBe(newRole.description);
    expect(createResponse.data!.type).toBe("Custom");

    try {
      // --- UPDATE ROLE ---
      // Arrange
      const updatedRole = {
        displayName: newRoleName,
        description: "UPDATED ROLE DESCRIPTION",
        permissions: [],
      };

      // Act
      const updateResponse =
        await accessControlClient.roles.updateITwinRole(accessToken, TestConfig.itwinId, createResponse.data!.id, updatedRole);

      // Assert
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data!.displayName).toBe(updatedRole.displayName);
      expect(updateResponse.data!.description).toBe(updatedRole.description);
      expect(updateResponse.data!.type).toBe("Custom");
    } finally {
      // --- DELETE ROLE (cleanup) ---
      // Ensure role is deleted even if test fails
      const deleteResponse: BentleyAPIResponse<undefined> =
        await accessControlClient.roles.deleteITwinRole(accessToken, TestConfig.itwinId, createResponse.data!.id);

      // Assert cleanup was successful
      expect(deleteResponse.status).toBe(204);
      expect(deleteResponse.data).toBeUndefined();
    }
  });
});
