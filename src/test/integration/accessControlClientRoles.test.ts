/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
import type { AccessControlAPIResponse } from "../../access-control-client";
import { AccessControlClient } from "../../access-control-client";
import type { NewRole, Role, RoleResponse, RolesResponse } from "../../accessControlProps";
import { TestConfig } from "../TestConfig";

chai.should();
describe("AccessControlClient Roles", () => {
  const accessControlClient: AccessControlClient = new AccessControlClient();
  const iTwinId = process.env.IMJS_TEST_PROJECT_ID;
  let accessToken: AccessToken;

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of roles for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<RolesResponse> =
      await accessControlClient.queryITwinRolesAsync(accessToken, iTwinId!);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.roles).to.not.be.empty;
  });

  it("should get a list of roles for an iTwin when using top", async () => {
    // Arrange
    const numberOfRoles = 3;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<RolesResponse> =
      await accessControlClient.queryITwinRolesAsync(accessToken, iTwinId!, {top: numberOfRoles});

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.roles.length).to.be.eq(numberOfRoles);
  });

  it("should get a list of roles for an iTwin when using search", async () => {
    // Arrange
    const searchTerm = "Test Role";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<RolesResponse> =
      await accessControlClient.queryITwinRolesAsync(accessToken, iTwinId!, {search: searchTerm});

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    iTwinsResponse.data!.roles.forEach((role) => {
      chai.expect(role.displayName.includes(searchTerm) || role.description.includes(searchTerm)).to.be.true;
    });
  });

  it("should get a specific role for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Role> =
      await accessControlClient.getITwinRoleAsync(accessToken, iTwinId!, TestConfig.permanentRoleId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.id).to.be.eq(TestConfig.permanentRoleId);
    chai.expect(iTwinsResponse.data!.displayName).to.be.eq(TestConfig.permanentRoleName);
  });

  it("should get a 404 when trying to get a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Role> =
      await accessControlClient.getITwinRoleAsync(accessToken, iTwinId!, nonExistantRoleId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.error!.code).to.be.eq("RoleNotFound");
    chai.expect(iTwinsResponse.data).to.be.undefined;
  });

  it("should get a 404 when trying to update a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";
    const emptyUpdatedRole: NewRole = {
      displayName: "NonExistantRoleName",
      description: "NonExistantRoleDescription",
      permissions: [],
    };

    // Act
    const iTwinsResponse: AccessControlAPIResponse<RoleResponse> =
      await accessControlClient.updateITwinRoleAsync(accessToken, iTwinId!, nonExistantRoleId, emptyUpdatedRole);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.error!.code).to.be.eq("RoleNotFound");
    chai.expect(iTwinsResponse.data).to.be.undefined;
  });

  it("should get a 404 when trying to remove a non-existant role", async () => {
    // Arrange
    const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.removeITwinRoleAsync(accessToken, iTwinId!, nonExistantRoleId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.error!.code).to.be.eq("RoleNotFound");
    chai.expect(iTwinsResponse.data).to.be.undefined;
  });

  it("should get create, update, and remove a role", async () => {
    // --- CREATE ROLE ---
    // Arrange
    const newRoleName = `APIM Access Control Typescript Client Test Role 1 ${new Date().toISOString()}`;
    const newRoleDescription = "Integration test role - should not persist";
    const newRole: NewRole = {
      displayName: newRoleName,
      description: newRoleDescription,
      permissions: [],
    };

    // Act
    const createResponse: AccessControlAPIResponse<RoleResponse> =
      await accessControlClient.createITwinRoleAsync(accessToken, iTwinId!, newRole);

    // Assert
    chai.expect(createResponse.status).to.be.eq(201);
    chai.expect(createResponse.data!.role.displayName).to.be.eq(newRole.displayName);
    chai.expect(createResponse.data!.role.description).to.be.eq(newRole.description);

    // --- UPDATE ROLE ---
    // Arrange
    const updatedRole: NewRole = {
      displayName: newRoleName,
      description: "UPDATED ROLE DESCRIPTION" ,
      permissions: [],
    };

    // Act
    const updateResponse: AccessControlAPIResponse<RoleResponse> =
      await accessControlClient.updateITwinRoleAsync(accessToken, iTwinId!, createResponse.data!.role.id, updatedRole);

    // Assert
    chai.expect(updateResponse.status).to.be.eq(200);
    chai.expect(updateResponse.data!.role.displayName).to.be.eq(updatedRole.displayName);
    chai.expect(updateResponse.data!.role.description).to.be.eq(updatedRole.description);

    // --- REMOVE ROLE ---
    // Act
    const deleteResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.removeITwinRoleAsync(accessToken, iTwinId!, createResponse.data!.role.id);

    // Assert
    chai.expect(deleteResponse.status).to.be.eq(204);
    chai.expect(deleteResponse.data).to.be.undefined;
  });
});
