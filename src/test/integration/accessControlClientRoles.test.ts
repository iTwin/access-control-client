/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, IAccessControlClient, Role } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

chai.should();
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

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  // it("should get a list of roles for an iTwin", async () => {
  //   // Act
  //   const iTwinsResponse: AccessControlAPIResponse<Role[]> =
  //     await accessControlClient.roles.getITwinRolesAsync(accessToken, TestConfig.itwinId);

  //   // Assert
  //   chai.expect(iTwinsResponse.status).to.be.eq(200);
  //   chai.expect(iTwinsResponse.data).to.not.be.empty;
  //   chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  // });

  // it("should get a list of roles for an iTwin with custom url", async () => {
  //   // Act
  //   const iTwinsResponse: AccessControlAPIResponse<Role[]> =
  //     await customAccessControlClient.roles.getITwinRolesAsync(accessToken, TestConfig.itwinId);

  //   // Assert
  //   chai.expect(iTwinsResponse.status).to.be.eq(200);
  //   chai.expect(iTwinsResponse.data).to.not.be.empty;
  //   chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  // });

  // it("should get a list of roles for an iTwin with additional headers", async () => {
  //   // Act
  //   const iTwinsResponse: AccessControlAPIResponse<Role[]> =
  //     await customAccessControlClient.roles.getITwinRolesAsync(accessToken, TestConfig.itwinId, { "test-custom-header": "custom-value:xyz-123-abc" });

  //   // Assert
  //   chai.expect(iTwinsResponse.status).to.be.eq(200);
  //   chai.expect(iTwinsResponse.data).to.not.be.empty;
  //   chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  // });

  // it("should get a specific role for an iTwin", async () => {
  //   // Act
  //   const iTwinsResponse: AccessControlAPIResponse<Role> =
  //     await accessControlClient.roles.getITwinRoleAsync(accessToken, TestConfig.itwinId, TestConfig.permanentRoleId1);

  //   // Assert
  //   chai.expect(iTwinsResponse.status).to.be.eq(200);
  //   chai.expect(iTwinsResponse.data).to.not.be.empty;
  //   chai.expect(iTwinsResponse.data!.id).to.be.eq(TestConfig.permanentRoleId1);
  //   chai.expect(iTwinsResponse.data!.displayName).to.be.eq(TestConfig.permanentRoleName1);
  // });

  // it("should get a 404 when trying to get a non-existant role", async () => {
  //   // Arrange
  //   const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";

  //   // Act
  //   const iTwinsResponse: AccessControlAPIResponse<Role> =
  //     await accessControlClient.roles.getITwinRoleAsync(accessToken, TestConfig.itwinId, nonExistantRoleId);

  //   // Assert
  //   chai.expect(iTwinsResponse.status).to.be.eq(404);
  //   chai.expect(iTwinsResponse.error!.code).to.be.eq("RoleNotFound");
  //   chai.expect(iTwinsResponse.data).to.be.undefined;
  // });

  // it("should get a 404 when trying to update a non-existant role", async () => {
  //   // Arrange
  //   const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";
  //   const emptyUpdatedRole: Role = {
  //     displayName: "NonExistantRoleName",
  //     description: "NonExistantRoleDescription",
  //     permissions: [],
  //   };

  //   // Act
  //   const iTwinsResponse: AccessControlAPIResponse<Role> =
  //     await accessControlClient.roles.updateITwinRoleAsync(accessToken, TestConfig.itwinId, nonExistantRoleId, emptyUpdatedRole);

  //   // Assert
  //   chai.expect(iTwinsResponse.status).to.be.eq(404);
  //   chai.expect(iTwinsResponse.error!.code).to.be.eq("RoleNotFound");
  //   chai.expect(iTwinsResponse.data).to.be.undefined;
  // });

  // it("should get a 404 when trying to remove a non-existant role", async () => {
  //   // Arrange
  //   const nonExistantRoleId = "22acf21e-0575-4faf-849b-bcd538718269";

  //   // Act
  //   const iTwinsResponse: AccessControlAPIResponse<undefined> =
  //     await accessControlClient.roles.deleteITwinRoleAsync(accessToken, TestConfig.itwinId, nonExistantRoleId);

  //   // Assert
  //   chai.expect(iTwinsResponse.status).to.be.eq(404);
  //   chai.expect(iTwinsResponse.error!.code).to.be.eq("RoleNotFound");
  //   chai.expect(iTwinsResponse.data).to.be.undefined;
  // });

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
    chai.expect(createResponse.status).to.be.eq(201);
    chai.expect(createResponse.data!.displayName).to.be.eq(newRole.displayName);
    chai.expect(createResponse.data!.description).to.be.eq(newRole.description);

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
    chai.expect(updateResponse.status).to.be.eq(200);
    chai.expect(updateResponse.data!.displayName).to.be.eq(updatedRole.displayName);
    chai.expect(updateResponse.data!.description).to.be.eq(updatedRole.description);

    // --- DELETE ROLE ---
    // Act
    const deleteResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.roles.deleteITwinRoleAsync(accessToken, TestConfig.itwinId, createResponse.data!.id!);

    // Assert
    chai.expect(deleteResponse.status).to.be.eq(204);
    chai.expect(deleteResponse.data).to.be.undefined;
  });
});
