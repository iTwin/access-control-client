/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, IAccessControlClient, ITwinJob, ITwinJobAction, ITwinJobActions, Role } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

chai.should();
describe("AccessControlClient Jobs", () => {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  let accessToken: AccessToken;

  let testJob: ITwinJob;
  let testiTwinJobActions: ITwinJobActions;

  before(async function () {
    accessToken = await TestConfig.getAccessToken();
    testiTwinJobActions = { assignRoles : [{ email: TestConfig.temporaryUserEmail, roleIds: [TestConfig.permanentRoleId1]} ]};

    const testJobResponse = await accessControlClient.itwinJobs.createITwinJobAsync(accessToken, TestConfig.itwinId, testiTwinJobActions);
    testJob = testJobResponse.data!;
  });

  it("should get a specific iTwin Job", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.getITwinJobAsync(accessToken, TestConfig.itwinId, testJob.id);

    // Assert
    chai.expect(iTwinJobResponse.status).to.be.eq(200);
    chai.expect(iTwinJobResponse.data).to.not.be.empty;

    chai.expect(iTwinJobResponse.data!.id).to.be.eq(testJob.id);
    chai.expect(iTwinJobResponse.data!.itwinId).to.be.eq(TestConfig.itwinId);
  });

  it("should get a specific iTwin Job with minimal result mode", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.getITwinJobAsync(accessToken, TestConfig.itwinId, testJob.id, "minimal");

    // Assert
    chai.expect(iTwinJobResponse.status).to.be.eq(200);
    chai.expect(iTwinJobResponse.data).to.not.be.empty;

    chai.expect(iTwinJobResponse.data!.id).to.be.eq(testJob.id);
    chai.expect(iTwinJobResponse.data!.itwinId).to.be.eq(TestConfig.itwinId);

    chai.expect(iTwinJobResponse.data!.error).to.be.undefined;
  });

  it("should get a specific iTwin Job with representation return", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.getITwinJobAsync(accessToken, TestConfig.itwinId, testJob.id, "representation");

    // Assert
    chai.expect(iTwinJobResponse.status).to.be.eq(200);
    chai.expect(iTwinJobResponse.data).to.not.be.empty;

    chai.expect(iTwinJobResponse.data!.id).to.be.eq(testJob.id);
    chai.expect(iTwinJobResponse.data!.itwinId).to.be.eq(TestConfig.itwinId);

    chai.expect(iTwinJobResponse.data!.error).should.not.equal(undefined);
  });

  it("should get a 404 when trying to get a non-existant iTwin Job", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.getITwinJobAsync(accessToken, TestConfig.itwinId, "non-existant-job-id");

    // Assert
    chai.expect(iTwinJobResponse.status).to.be.eq(404);
  });

  it("should get a specific iTwin Job Actions", async () => {
    // Act
    const iTwinJobActionsResponse: AccessControlAPIResponse<ITwinJobActions> =
      await accessControlClient.itwinJobs.getITwinJobActionsAsync(accessToken, TestConfig.itwinId, testJob.id);

    // Assert
    chai.expect(iTwinJobActionsResponse.status).to.be.eq(200);
    chai.expect(iTwinJobActionsResponse.data).to.not.be.empty;

    chai.expect(iTwinJobActionsResponse.data!.assignRoles).to.be.not.empty;
    chai.expect(iTwinJobActionsResponse.data!.assignRoles!.length).to.be.eq(1);
    chai.expect(iTwinJobActionsResponse.data!.assignRoles![0].email).to.be.eq(TestConfig.temporaryUserEmail);
    chai.expect(iTwinJobActionsResponse.data!.assignRoles![0].roleIds).to.be.not.empty;
    chai.expect(iTwinJobActionsResponse.data!.assignRoles![0].roleIds.length).to.be.eq(1);
    chai.expect(iTwinJobActionsResponse.data!.assignRoles![0].roleIds[0]).to.be.eq(TestConfig.permanentRoleId1);
  });

  it("should get a 404 when trying to get a non-existant iTwin Job Actions", async () => {
    // Act
    const iTwinJobActionsResponse: AccessControlAPIResponse<ITwinJobActions> =
      await accessControlClient.itwinJobs.getITwinJobActionsAsync(accessToken, TestConfig.itwinId, "non-existant-job-id");

    // Assert
    chai.expect(iTwinJobActionsResponse.status).to.be.eq(404);
  });

  it("should create a iTwin Job", async () => {
    // Act
    const iTwinJobResponse: AccessControlAPIResponse<ITwinJob> =
      await accessControlClient.itwinJobs.createITwinJobAsync(accessToken, TestConfig.itwinId, { unassignRoles : [{ email: TestConfig.temporaryUserEmail, roleIds: [TestConfig.permanentRoleId1]} ]});

    // Assert
    chai.expect(iTwinJobResponse.status).to.be.eq(201);
    chai.expect(iTwinJobResponse.data).to.not.be.empty;

    chai.expect(iTwinJobResponse.data!.itwinId).to.be.eq(TestConfig.itwinId);
  });
});
