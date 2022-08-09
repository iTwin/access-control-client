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
      await accessControlClient.getPermissionsAsync(accessToken);

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
      await accessControlClient.getITwinPermissionsAsync(accessToken, iTwinId!);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.permissions).to.not.be.empty;
  });

  it("should get a 404 when getting permissions for a non-existant iTwin", async () => {
    // Arrange
    const notExistantITwinId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<PermissionsResponse> =
      await accessControlClient.getITwinPermissionsAsync(accessToken, notExistantITwinId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.data).to.be.undefined;
    chai.expect(iTwinsResponse.error!.code).to.be.eq("ItwinNotFound");
  });
});
