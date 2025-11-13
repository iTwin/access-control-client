/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { TestUsers } from "@itwin/oidc-signin-tool";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type {
  IAccessControlClient,
} from "../../accessControlClientInterfaces/accessControl";
import type { BentleyAPIResponse } from "../../types/CommonApiTypes";
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
    const iTwinsResponse =
      await accessControlClient.ownerMembers.queryITwinOwnerMembers(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.members.length).toBeGreaterThan(0);
    expect(iTwinsResponse.data!._links).toBeDefined();
  });

  it("should get a list of owner members for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse =
      await customAccessControlClient.ownerMembers.queryITwinOwnerMembers(
        accessToken,
        TestConfig.itwinId,
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!.members.length).toBeGreaterThan(0);
  });

  it("should get a filtered list of owner members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 1;

    // Act
    const iTwinsResponse =
      await accessControlClient.ownerMembers.queryITwinOwnerMembers(
        accessToken,
        TestConfig.itwinId,
        { top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!).toBeDefined();
    expect(iTwinsResponse.data!.members.length).toBe(topAmount);
  });

  it("should get a filtered list of owner members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList =
      await accessControlClient.ownerMembers.queryITwinOwnerMembers(
        accessToken,
        TestConfig.itwinId
      );
    const skipAmmount = 1;
    const topAmount = 1;

    // Act
    const iTwinsResponse =
      await accessControlClient.ownerMembers.queryITwinOwnerMembers(
        accessToken,
        TestConfig.itwinId,
        { skip: skipAmmount, top: topAmount }
      );

    // Assert
    expect(iTwinsResponse.status).toBe(200);
    expect(iTwinsResponse.data).toBeDefined();
    expect(iTwinsResponse.data!).toBeDefined();
    expect(iTwinsResponse.data!.members.length).toBe(topAmount);
    unFilteredList.data!.members.slice(0, skipAmmount).forEach((member) => {
      expect(iTwinsResponse.data!.members.includes(member)).toBe(false);
    });
  });

  it("should get add, get, and remove a owner member", async () => {
    // --- Add Owner ---
    const managerEmail = TestUsers.manager.email ? TestUsers.manager.email : TestConfig.managerUserEmail;
    // Act
    const addOwnerMemberResponse =
      await accessControlClient.ownerMembers.addITwinOwnerMember(
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
    expect(addOwnerMemberResponse.data!.member.email).toBe(managerEmail);

    let newOwner: NonNullable<Awaited<ReturnType<typeof accessControlClient.ownerMembers.queryITwinOwnerMembers>>["data"]>["members"][0] | undefined;
    try {
      // --- Check owner exists ---
      // Act
      const queryOwnerMemberResponse =
        await accessControlClient.ownerMembers.queryITwinOwnerMembers(
          accessToken,
          TestConfig.itwinId
        );

      expect(queryOwnerMemberResponse.status).toBe(200);
      expect(queryOwnerMemberResponse.data).toBeDefined();
      newOwner = queryOwnerMemberResponse.data!.members.filter((member) => member.email === managerEmail)[0];
      expect(newOwner).toBeDefined();
      expect(newOwner.email).toBe(managerEmail);
    } finally {
      // --- Remove owner (cleanup) ---
      // Ensure owner is removed even if test fails
      if (newOwner?.id) {
        const removeOwnerMemberResponse: BentleyAPIResponse<undefined> =
          await accessControlClient.ownerMembers.removeITwinOwnerMember(
            accessToken,
            TestConfig.itwinId,
            newOwner.id
          );

        expect(removeOwnerMemberResponse.status).toBe(204);
        expect(removeOwnerMemberResponse.data).toBeUndefined();
      } else {
        // Fallback: if we don't have the owner ID, try to find and remove by email
        const queryResponse = await accessControlClient.ownerMembers.queryITwinOwnerMembers(
          accessToken,
          TestConfig.itwinId
        );
        const ownerToRemove = queryResponse.data?.members.find((member) => member.email === managerEmail);
        if (ownerToRemove?.id) {
          const removeOwnerMemberResponse: BentleyAPIResponse<undefined> =
            await accessControlClient.ownerMembers.removeITwinOwnerMember(
              accessToken,
              TestConfig.itwinId,
              ownerToRemove.id
            );

          expect(removeOwnerMemberResponse.status).toBe(204);
          expect(removeOwnerMemberResponse.data).toBeUndefined();
        }
      }
    }
  });
});
