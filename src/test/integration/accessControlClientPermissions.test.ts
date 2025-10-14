/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { IAccessControlClient, Permission } from "../../accessControlTypes";
import type { BentleyAPIResponse } from "../../types/CommonApiTypes";
import { TestConfig } from "../TestConfig";

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

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
  }, 30000);

  it("should get a list of permissions", async () => {
    // Act
    const iTwinsResponse: BentleyAPIResponse<Permission[]> =
      await accessControlClient.permissions.getPermissionsAsync(accessToken);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of permissions with custom url", async () => {
    // Act
    const iTwinsResponse: BentleyAPIResponse<Permission[]> =
      await customAccessControlClient.permissions.getPermissionsAsync(accessToken);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of permissions for an iTwin", async () => {
    // Act
    const iTwinsResponse: BentleyAPIResponse<Permission[]> =
      await accessControlClient.permissions.getITwinPermissionsAsync(accessToken, TestConfig.itwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a 404 when getting permissions for a non-existant iTwin", async () => {
    // Arrange
    const notExistantITwinId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const iTwinsResponse: BentleyAPIResponse<Permission[]> =
      await accessControlClient.permissions.getITwinPermissionsAsync(accessToken, notExistantITwinId);

    // Assert
    expect(iTwinsResponse.status).toBe(404);
    expect(iTwinsResponse.data).toBeUndefined();
    expect(iTwinsResponse.error!.code).toBe("ItwinNotFound");
  });
});
