/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { IAccessControlClient } from "../../accessControlTypes";
import type { BentleyAPIResponse } from "../../types/CommonApiTypes";
import type { ITwinJob, ITwinJobActions } from "../../types/ITwinJob";
import { TestConfig } from "../TestConfig";

describe("AccessControlClient iTwin Jobs", () => {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  let accessToken: AccessToken;

  let testJob: ITwinJob;
  let testiTwinJobActions: ITwinJobActions;

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
    testiTwinJobActions = { assignRoles : [{ email: TestConfig.temporaryUserEmail, roleIds: [TestConfig.permanentRoleId1]} ]};

    const testJobResponse = await accessControlClient.itwinJobs.createITwinJob(accessToken, TestConfig.itwinId, testiTwinJobActions);
    testJob = testJobResponse.data!;
  }, 30000);

  it("should get a specific iTwin Job", async () => {
    // Act
    const iTwinJobResponse =
      await accessControlClient.itwinJobs.getITwinJob(accessToken, TestConfig.itwinId, testJob.id);

    // Assert
    expect(iTwinJobResponse.status).toBe(200);
    expect(iTwinJobResponse.data).toBeDefined();

    expect(iTwinJobResponse.data!.id).toBe(testJob.id);
    expect(iTwinJobResponse.data!.itwinId).toBe(TestConfig.itwinId);
  });

  it("should get a specific iTwin Job with minimal result mode", async () => {
    // Act
    const iTwinJobResponse =
      await accessControlClient.itwinJobs.getITwinJob(accessToken, TestConfig.itwinId, testJob.id, "minimal");

    // Assert
    expect(iTwinJobResponse.status).toBe(200);
    expect(iTwinJobResponse.data).toBeDefined();

    expect(iTwinJobResponse.data!.id).toBe(testJob.id);
    expect(iTwinJobResponse.data!.itwinId).toBe(TestConfig.itwinId);

  });

  it("should get a specific iTwin Job with representation return", async () => {
    // Act
    const iTwinJobResponse =
      await accessControlClient.itwinJobs.getITwinJob(accessToken, TestConfig.itwinId, testJob.id, "representation");

    // Assert
    expect(iTwinJobResponse.status).toBe(200);
    expect(iTwinJobResponse.data).toBeDefined();

    expect(iTwinJobResponse.data!.id).toBe(testJob.id);
    expect(iTwinJobResponse.data!.itwinId).toBe(TestConfig.itwinId);

    expect(iTwinJobResponse.data!.error).toEqual(undefined);
  });

  it("should get a 404 when trying to get a non-existant iTwin Job", async () => {
    // Act
    const iTwinJobResponse =
      await accessControlClient.itwinJobs.getITwinJob(accessToken, TestConfig.itwinId, "non-existant-job-id");

    // Assert
    expect(iTwinJobResponse.status).toBe(404);
  });

  it("should get a specific iTwin Job Actions", async () => {
    // Act
    const iTwinJobActionsResponse: BentleyAPIResponse<ITwinJobActions> =
      await accessControlClient.itwinJobs.getITwinJobActions(accessToken, TestConfig.itwinId, testJob.id);

    // Assert
    expect(iTwinJobActionsResponse.status).toBe(200);
    expect(iTwinJobActionsResponse.data).toBeDefined();

    expect(iTwinJobActionsResponse.data!.assignRoles).toBeDefined();
    expect(iTwinJobActionsResponse.data!.assignRoles!.length).toBe(1);
    expect(iTwinJobActionsResponse.data!.assignRoles![0].email).toBe(TestConfig.temporaryUserEmail);
    expect(iTwinJobActionsResponse.data!.assignRoles![0].roleIds).toBeDefined();
    expect(iTwinJobActionsResponse.data!.assignRoles![0].roleIds.length).toBe(1);
    expect(iTwinJobActionsResponse.data!.assignRoles![0].roleIds[0]).toBe(TestConfig.permanentRoleId1);
  });

  it("should get a 404 when trying to get a non-existant iTwin Job Actions", async () => {
    // Act
    const iTwinJobActionsResponse: BentleyAPIResponse<ITwinJobActions> =
      await accessControlClient.itwinJobs.getITwinJobActions(accessToken, TestConfig.itwinId, "non-existant-job-id");

    // Assert
    expect(iTwinJobActionsResponse.status).toBe(404);
  });

  it("should get a 422 when trying to create a job with invalid email format", async () => {
    // Arrange
    const invalidJobActions: ITwinJobActions = {
      assignRoles: [{ email: "invalid-email-format", roleIds: [TestConfig.permanentRoleId1] }]
    };

    // Act
    const iTwinJobResponse: BentleyAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.createITwinJob(accessToken, TestConfig.itwinId, invalidJobActions);

    // Assert
    expect(iTwinJobResponse.status).toBe(422);
    expect(iTwinJobResponse.error).toBeDefined();
    expect(iTwinJobResponse.data).toBeUndefined();
  });

  it("should get a 422 when trying to create a job with invalid role ID", async () => {
    // Arrange
    const invalidJobActions: ITwinJobActions = {
      assignRoles: [{ email: TestConfig.temporaryUserEmail, roleIds: ["invalid-role-id-format"] }]
    };

    // Act
    const iTwinJobResponse: BentleyAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.createITwinJob(accessToken, TestConfig.itwinId, invalidJobActions);

    // Assert
    expect([422, 400]).toContain(iTwinJobResponse.status); // Could be 422 or 400 depending on validation
    expect(iTwinJobResponse.error).toBeDefined();
    expect(iTwinJobResponse.data).toBeUndefined();
  });

  it("should get a 422 when trying to create a job with empty email", async () => {
    // Arrange
    const invalidJobActions: ITwinJobActions = {
      assignRoles: [{ email: "", roleIds: [TestConfig.permanentRoleId1] }]
    };

    // Act
    const iTwinJobResponse: BentleyAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.createITwinJob(accessToken, TestConfig.itwinId, invalidJobActions);

    // Assert
    expect(iTwinJobResponse.status).toBe(422);
    expect(iTwinJobResponse.error).toBeDefined();
    expect(iTwinJobResponse.data).toBeUndefined();
  });

  it("should get a 422 when trying to create a job with empty roleIds array", async () => {
    // Arrange
    const invalidJobActions: ITwinJobActions = {
      assignRoles: [{ email: TestConfig.temporaryUserEmail, roleIds: [] }]
    };

    // Act
    const iTwinJobResponse: BentleyAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.createITwinJob(accessToken, TestConfig.itwinId, invalidJobActions);

    // Assert
    expect(iTwinJobResponse.status).toBe(422);
    expect(iTwinJobResponse.error).toBeDefined();
    expect(iTwinJobResponse.data).toBeUndefined();
  });

  it("should get a 422 when trying to create a job with empty actions object", async () => {
    // Arrange
    const invalidJobActions: ITwinJobActions = {};

    // Act
    const iTwinJobResponse: BentleyAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.createITwinJob(accessToken, TestConfig.itwinId, invalidJobActions);

    // Assert
    expect(iTwinJobResponse.status).toBe(422);
    expect(iTwinJobResponse.error).toBeDefined();
    expect(iTwinJobResponse.data).toBeUndefined();
  });

  it("should create a iTwin Job", async () => {
    // Act
    const iTwinJobResponse: BentleyAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.createITwinJob(accessToken, TestConfig.itwinId, { unassignRoles : [{ email: TestConfig.temporaryUserEmail, roleIds: [TestConfig.permanentRoleId1]} ]});

    // Assert
    expect(iTwinJobResponse.status).toBe(201);
    expect(iTwinJobResponse.data).toBeDefined();

    expect(iTwinJobResponse.data!.itwinId).toBe(TestConfig.itwinId);
  });
});
