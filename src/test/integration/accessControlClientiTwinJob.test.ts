/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, IAccessControlClient, ITwinJob, ITwinJobActions } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

describe("AccessControlClient iTwin Jobs", () => {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  let accessToken: AccessToken;

  let testJob: ITwinJob;
  let testiTwinJobActions: ITwinJobActions;

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
    testiTwinJobActions = { assignRoles : [{ email: TestConfig.temporaryUserEmail, roleIds: [TestConfig.permanentRoleId1]} ]};

    const testJobResponse = await accessControlClient.itwinJobs.createITwinJobAsync(accessToken, TestConfig.itwinId, testiTwinJobActions);
    testJob = testJobResponse.data!;
  }, 30000);

  it("should get a specific iTwin Job", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.getITwinJobAsync(accessToken, TestConfig.itwinId, testJob.id);

    // Assert
    expect(iTwinJobResponse.status).toBe(200);
    expect(iTwinJobResponse.data).toBeDefined();

    expect(iTwinJobResponse.data!.id).toBe(testJob.id);
    expect(iTwinJobResponse.data!.itwinId).toBe(TestConfig.itwinId);
  });

  it("should get a specific iTwin Job with minimal result mode", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.getITwinJobAsync(accessToken, TestConfig.itwinId, testJob.id, "minimal");

    // Assert
    expect(iTwinJobResponse.status).toBe(200);
    expect(iTwinJobResponse.data).toBeDefined();

    expect(iTwinJobResponse.data!.id).toBe(testJob.id);
    expect(iTwinJobResponse.data!.itwinId).toBe(TestConfig.itwinId);

    expect(iTwinJobResponse.data!.error).toBeUndefined();
  });

  it("should get a specific iTwin Job with representation return", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.getITwinJobAsync(accessToken, TestConfig.itwinId, testJob.id, "representation");

    // Assert
    expect(iTwinJobResponse.status).toBe(200);
    expect(iTwinJobResponse.data).toBeDefined();

    expect(iTwinJobResponse.data!.id).toBe(testJob.id);
    expect(iTwinJobResponse.data!.itwinId).toBe(TestConfig.itwinId);

    expect(iTwinJobResponse.data!.error).not.toEqual(undefined);
  });

  it("should get a 404 when trying to get a non-existant iTwin Job", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.getITwinJobAsync(accessToken, TestConfig.itwinId, "non-existant-job-id");

    // Assert
    expect(iTwinJobResponse.status).toBe(404);
  });

  it("should get a specific iTwin Job Actions", async () => {
    // Act
    const iTwinJobActionsResponse: AccessControlAPIResponse<ITwinJobActions> =
      await accessControlClient.itwinJobs.getITwinJobActionsAsync(accessToken, TestConfig.itwinId, testJob.id);

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
    const iTwinJobActionsResponse: AccessControlAPIResponse<ITwinJobActions> =
      await accessControlClient.itwinJobs.getITwinJobActionsAsync(accessToken, TestConfig.itwinId, "non-existant-job-id");

    // Assert
    expect(iTwinJobActionsResponse.status).toBe(404);
  });

  it("should create a iTwin Job", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.createITwinJobAsync(accessToken, TestConfig.itwinId, { unassignRoles : [{ email: TestConfig.temporaryUserEmail, roleIds: [TestConfig.permanentRoleId1]} ]});

    // Assert
    expect(iTwinJobResponse.status).toBe(201);
    expect(iTwinJobResponse.data).toBeDefined();

    expect(iTwinJobResponse.data!.itwinId).toBe(TestConfig.itwinId);
  });
});
