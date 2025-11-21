/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { IAccessControlClient } from "../../accessControlClientInterfaces/accessControl";
import { TestConfig } from "../TestConfig";

describe("AccessControlClient iTwin Jobs", () => {
  const accessControlClient: IAccessControlClient = new AccessControlClient();
  let accessToken: AccessToken;

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
  }, 30000);

  it("should create and return a iTwin Share", async () => {
    // Act
    const createResponse =
      await accessControlClient.itwinShares.createITwinShare(
        accessToken,
        TestConfig.itwinId,
        {
          shareContract: "Default",
          expiration: null,
        }
      );

    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.data).toBeDefined();
    expect(createResponse.data!.share.iTwinId).toBe(TestConfig.itwinId);
    expect(createResponse.data!.share.id).toBeDefined();
    expect(createResponse.data!.share.shareContract).toBe("Default");
    expect(createResponse.data!.share.expiration).toBeDefined();

    const shareId = createResponse.data!.share.id;
    try {
      // Additional assertions can be added here
    } finally {
      // Clean up - ensure share is revoked even if test fails
      const iTwinDeleteResponse =
        await accessControlClient.itwinShares.revokeITwinShare(
          accessToken,
          TestConfig.itwinId,
          shareId
        );
      expect(iTwinDeleteResponse.status).toBe(204);
    }
  });

    it("should create an itwin share with defaults when trying to create a share no properties", async () => {
    // Act
    const createResponse =
      await accessControlClient.itwinShares.createITwinShare(
        accessToken,
        TestConfig.itwinId,
        {}
      );
    // Assert
    expect(createResponse.status).toBe(201);
    expect(createResponse.data).toBeDefined();
    expect(createResponse.data!.share.iTwinId).toBe(TestConfig.itwinId);
    expect(createResponse.data!.share.id).toBeDefined();
    expect(createResponse.data!.share.shareContract).toBe("Default");
    expect(createResponse.data!.share.expiration).toBeDefined();

    const shareId = createResponse.data!.share.id;
    try {
      // Additional assertions can be added here
    } finally {
      // Clean up - ensure share is revoked even if test fails
      const iTwinDeleteResponse =
        await accessControlClient.itwinShares.revokeITwinShare(
          accessToken,
          TestConfig.itwinId,
          shareId
        );
      expect(iTwinDeleteResponse.status).toBe(204);
    }
  });

  it("should create, get, and revoke a iTwin Share", async () => {
    // --- CREATE SHARE ---
    const createResponse =
      await accessControlClient.itwinShares.createITwinShare(
        accessToken,
        TestConfig.itwinId,
        {
          shareContract: "Default",
          expiration: null,
        }
      );

    // Assert creation
    expect(createResponse.status).toBe(201);
    expect(createResponse.data).toBeDefined();
    expect(createResponse.data!.share.iTwinId).toBe(TestConfig.itwinId);
    expect(createResponse.data!.share.id).toBeDefined();
    expect(createResponse.data!.share.shareContract).toBe("Default");
    expect(createResponse.data!.share.expiration).toBeDefined();

    const shareId = createResponse.data!.share.id;

    try {
      // --- GET SHARE ---
      const getResponse =
        await accessControlClient.itwinShares.getITwinShare(
          accessToken,
          TestConfig.itwinId,
          shareId
        );

      // Assert retrieval
      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toBeDefined();
      expect(getResponse.data!.share.id).toBe(shareId);
      expect(getResponse.data!.share.iTwinId).toBe(TestConfig.itwinId);
      expect(getResponse.data!.share.shareContract).toBe("Default");
      expect(getResponse.data!.share.expiration).toBeDefined();
      expect(getResponse.data!.share.shareKey).toBeDefined();
    } finally {
      // --- REVOKE SHARE (cleanup) ---
      // Ensure share is revoked even if test fails
      const revokeResponse =
        await accessControlClient.itwinShares.revokeITwinShare(
          accessToken,
          TestConfig.itwinId,
          shareId
        );
      expect(revokeResponse.status).toBe(204);
    }
  });

  it("should get a 404 when trying to get a non-existent share", async () => {
    // Arrange
    const nonExistentShareId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const getResponse =
      await accessControlClient.itwinShares.getITwinShare(
        accessToken,
        TestConfig.itwinId,
        nonExistentShareId
      );

    // Assert
    expect(getResponse.status).toBe(404);
    expect(getResponse.error).toBeDefined();
    expect(getResponse.error!.code).toBe("ShareNotFound");
    expect(getResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to get a share with invalid shareId format", async () => {
    // Arrange
    const invalidShareId = "invalid-share-id-format";

    // Act
    const getResponse =
      await accessControlClient.itwinShares.getITwinShare(
        accessToken,
        TestConfig.itwinId,
        invalidShareId
      );

    // Assert
    expect(getResponse.status).toBe(404);
    expect(getResponse.error).toBeDefined();
    expect(getResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to get a share for non-existent iTwin", async () => {
    // Arrange
    const nonExistentITwinId = "22acf21e-0575-4faf-849b-bcd538718269";
    const shareId = "11bcf21e-0575-4faf-849b-bcd538718268";

    // Act
    const getResponse =
      await accessControlClient.itwinShares.getITwinShare(
        accessToken,
        nonExistentITwinId,
        shareId
      );

    // Assert
    expect(getResponse.status).toBe(404);
    expect(getResponse.error).toBeDefined();
    expect(getResponse.data).toBeUndefined();
  });

  it("should get a list of iTwin shares", async () => {
    // Act
    const getSharesResponse =
      await accessControlClient.itwinShares.getITwinShares(
        accessToken,
        TestConfig.itwinId
      );

    // Assert
    expect(getSharesResponse.status).toBe(200);
    expect(getSharesResponse.data).toBeDefined();
    expect(getSharesResponse.data!.shares).toBeDefined();
    expect(Array.isArray(getSharesResponse.data!.shares)).toBe(true);
    // Note: shares array might be empty if no shares exist, which is valid
  });

  it("should get a list of iTwin shares including created share", async () => {
    // First create a share to ensure we have at least one
    const createResponse =
      await accessControlClient.itwinShares.createITwinShare(
        accessToken,
        TestConfig.itwinId,
        {
          shareContract: "Default",
          expiration: null,
        }
      );

    expect(createResponse.status).toBe(201);
    const shareId = createResponse.data!.share.id;

    try {
      // Act - Get all shares
      const getSharesResponse =
        await accessControlClient.itwinShares.getITwinShares(
          accessToken,
          TestConfig.itwinId
        );

      // Assert
      expect(getSharesResponse.status).toBe(200);
      expect(getSharesResponse.data).toBeDefined();
      expect(getSharesResponse.data!.shares).toBeDefined();
      expect(Array.isArray(getSharesResponse.data!.shares)).toBe(true);
      expect(getSharesResponse.data!.shares.length).toBeGreaterThan(0);

      // Verify our created share is in the list
      const createdShare = getSharesResponse.data!.shares.find(share => share.id === shareId);
      expect(createdShare).toBeDefined();
      expect(createdShare!.id).toBe(shareId);
      expect(createdShare!.iTwinId).toBe(TestConfig.itwinId);
      expect(createdShare!.shareContract).toBe("Default");
      expect(createdShare!.expiration).toBeDefined();
      expect(createdShare!.shareKey).toBeDefined();
    } finally {
      // Clean up - ensure share is revoked
      await accessControlClient.itwinShares.revokeITwinShare(
        accessToken,
        TestConfig.itwinId,
        shareId
      );
    }
  });

  it("should get a 404 when trying to get shares for non-existent iTwin", async () => {
    // Arrange
    const nonExistentITwinId = "22acf21e-0575-4faf-849b-bcd538718269";

    // Act
    const getSharesResponse =
      await accessControlClient.itwinShares.getITwinShares(
        accessToken,
        nonExistentITwinId
      );

    // Assert
    expect(getSharesResponse.status).toBe(404);
    expect(getSharesResponse.error).toBeDefined();
    expect(getSharesResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to get shares with invalid iTwin ID format", async () => {
    // Arrange
    const invalidITwinId = "invalid-itwin-id-format";

    // Act
    const getSharesResponse =
      await accessControlClient.itwinShares.getITwinShares(
        accessToken,
        invalidITwinId
      );

    // Assert
    expect(getSharesResponse.status).toBe(404);
    expect(getSharesResponse.error).toBeDefined();
    expect(getSharesResponse.data).toBeUndefined();
  });

  it("should get a 404 when trying to create a share with invalid shareContract", async () => {
    // Arrange
    const invalidShare = {
      shareContract: "InvalidContract", // Invalid contract type
      expiration: null,
    };

    // Act
    const createResponse =
      await accessControlClient.itwinShares.createITwinShare(
        accessToken,
        TestConfig.itwinId,
        invalidShare
      );

    // Assert
    expect(createResponse.status).toBe(404);
    expect(createResponse.error).toBeDefined();
    expect(createResponse.error!.message).toBe("Requested share contract is not available.");
    expect(createResponse.error!.code).toBe("ShareContractNotFound");
    expect(createResponse.data).toBeUndefined();
  });

  it("should get a 422 when trying to create a share with past expiration date", async () => {
    // Arrange
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    const invalidShare = {
      shareContract: "Default",
      expiration: pastDate.toISOString(),
    };

    // Act
    const createResponse =
      await accessControlClient.itwinShares.createITwinShare(
        accessToken,
        TestConfig.itwinId,
        invalidShare
      );

    // Assert
    expect(createResponse.status).toBe(422);
    expect(createResponse.error).toBeDefined();
    expect(createResponse.data).toBeUndefined();
  });

  it("should get a 422 when trying to create a share with malformed expiration date", async () => {
    // Arrange
    const invalidShare = {
      shareContract: "Default",
      expiration: "invalid-date-format", // Malformed date
    };

    // Act
    const createResponse =
      await accessControlClient.itwinShares.createITwinShare(
        accessToken,
        TestConfig.itwinId,
        invalidShare as any
      );

    // Assert
    expect(createResponse.status).toBe(422);
    expect(createResponse.error).toBeDefined();
    expect(createResponse.data).toBeUndefined();
  });

});
