/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { TestUsers } from "@itwin/oidc-signin-tool/lib/cjs/frontend";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type {
  AccessControlAPIResponse,
  AddOwnerMemberResponse,
  IAccessControlClient,
  OwnerMember,
} from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

describe("AccessControlClient Owner Members", () => {
  let baseUrl: string = "https://api.bentley.com/accesscontrol/itwins";
  const urlPrefix = process.env.IMJS_URL_PREFIX;
  if (urlPrefix) {
    const url = new URL(baseUrl);
    url.hostname = urlPrefix + url.hostname;
    baseUrl = url.href;
  }
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  const customAccessControlClient: IAccessControlClient =
    new AccessControlClient(baseUrl);
  let accessToken: AccessToken;

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
  }, 30000);

  it("should get a list of owner members for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a list of owner members for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
      await customAccessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.itwinId,
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.length).toBeGreaterThan(0);
  });

  it("should get a filtered list of owner members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 1;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.itwinId,
        { top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!).toBeDefined();
    expect(iTwinsResponse.data!.length).toBe(topAmount);
  });

  it("should get a filtered list of owner members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.itwinId
      );
    const skipAmmount = 1;
    const topAmount = 1;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.itwinId,
        { skip: skipAmmount, top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!).toBeDefined();
    expect(iTwinsResponse.data!.length).toBe(topAmount);
    unFilteredList.data!.slice(0, skipAmmount).forEach((member) => {
      expect(iTwinsResponse.data!.includes(member)).toBe(false);
    });
  });

  it("should get add, get, and remove a owner member", async () => {
    // --- Add Owner ---
    const managerEmail = TestUsers.manager.email ? TestUsers.manager.email : TestConfig.managerUserEmail;
    // Act
    const addOwnerMemberResponse: AccessControlAPIResponse<AddOwnerMemberResponse> =
      await accessControlClient.ownerMembers.addITwinOwnerMemberAsync(
        accessToken,
        TestConfig.itwinId,
        {
          email: managerEmail,
        },
      );
    // Assert
    expect(addOwnerMemberResponse.status).toBe(201);
    expect(addOwnerMemberResponse.data).toBeDefined();
    expect(addOwnerMemberResponse.data!.member).toBeDefined();
    expect(addOwnerMemberResponse.data!.member!.email).toBe(managerEmail);

    // --- Check owner exists ---
    // Act
    const queryOwnerMemberResponse: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.itwinId
      );

    expect(queryOwnerMemberResponse.status).toBe(200);
    expect(queryOwnerMemberResponse.data).toBeDefined();
    const newOwner = queryOwnerMemberResponse.data!.filter((member) => member.email === managerEmail)[0];
    expect(newOwner).toBeDefined();
    expect(newOwner.email).toBe(managerEmail);

    // --- Remove owner ---
    // Act
    const removeOwnerMemberResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.ownerMembers.removeITwinOwnerMemberAsync(
        accessToken,
        TestConfig.itwinId,
        newOwner.id!
      );

    expect(removeOwnerMemberResponse.status).toBe(204);
    expect(removeOwnerMemberResponse.data).toBeUndefined();
  });
});
