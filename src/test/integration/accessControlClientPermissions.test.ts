/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse} from "../../access-control-client";
import { AccessControlClient } from "../../access-control-client";
import { TestConfig } from "../TestConfig";
import type { PermissionsResponse } from "../../accessControlProps";

chai.should();
describe("AccessControlClient Permissions", () => {
  const accessControlClient: AccessControlClient = new AccessControlClient();
  let accessToken: AccessToken;

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of permissions", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<PermissionsResponse> =
      await accessControlClient.queryPermissionsAsync(accessToken);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.permissions).to.not.be.empty;

  });

  it("should get a list of permissions for an iTwin", async () => {
    // Arrange
    const iTwinId = process.env.IMJS_TEST_PROJECT_ID;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<PermissionsResponse> =
      await accessControlClient.queryITwinPermissionsAsync(accessToken, iTwinId!);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.permissions).to.not.be.empty;
  });
});
