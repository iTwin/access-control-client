/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import * as chai from "chai";
import { AccessControlClient } from "../../AccessControlClient";
import type { AccessControlAPIResponse, IAccessControlClient, Permission } from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

chai.should();
describe("AccessControlClient Permissions", () => {
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

  it("should get a list of permissions", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Permission[]> =
      await accessControlClient.permissions.getPermissionsAsync(accessToken);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a list of permissions with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Permission[]> =
      await customAccessControlClient.permissions.getPermissionsAsync(accessToken);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a list of permissions for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<Permission[]> =
      await accessControlClient.permissions.getITwinPermissionsAsync(accessToken, TestConfig.itwinId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a 404 when getting permissions for a non-existant iTwin", async () => {
    // Arrange
    const notExistantITwinId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: AccessControlAPIResponse<Permission[]> =
      await accessControlClient.permissions.getITwinPermissionsAsync(accessToken, notExistantITwinId);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(404);
    chai.expect(iTwinsResponse.data).to.be.undefined;
    chai.expect(iTwinsResponse.error!.code).to.be.eq("ItwinNotFound");
  });
});
