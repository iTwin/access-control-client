/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { beforeAll, describe, expect, it } from "vitest";
import { AccessControlClient } from "../../AccessControlClient";
import type { IAccessControlClient } from "../../accessControlClientInterfaces/accessControl";
import { TestConfig } from "../TestConfig";

describe("AccessControlClient Group Member Invitations", () => {
  let baseUrl: string = "https://api.bentley.com/accesscontrol/itwins";
  const urlPrefix = process.env.IMJS_URL_PREFIX;
  if (urlPrefix) {
    const url = new URL(baseUrl);
    url.hostname = urlPrefix + url.hostname;
    baseUrl = url.href;
  }
  const accessControlClient: IAccessControlClient = new AccessControlClient();

  let accessToken: AccessToken;

  beforeAll(async () => {
    accessToken = await TestConfig.getAccessToken();
  });

  it("should create group, manage invitations, and clean up", async () => {
    const createGroupResponse =
      await accessControlClient.groups.createITwinGroup(
        accessToken,
        TestConfig.itwinId,
        {
          name: "User invite test group",
          description: "User invite test group",
        }
      );
    try {
      expect(createGroupResponse.status).toBe(201);
      expect(createGroupResponse.data).toBeDefined();

      const updatedGroup = {
        members: [`${TestConfig.temporaryUserEmail}`],
      };

      const updateGroupResponse =
        await accessControlClient.groups.updateITwinGroup(
          accessToken,
          TestConfig.assetId,
          createGroupResponse.data!.group!.id!,
          updatedGroup
        );

      // Assert
      expect(updateGroupResponse.status).toBe(200);
      expect(updateGroupResponse.data).toBeDefined();
      expect(
        updateGroupResponse.data!.group!.members!.length
      ).toBeGreaterThanOrEqual(0);

      // --- GET LIST OF GROUP MEMBER INVITATIONS ---
      // Act
      const getInvitationsResponse =
        await accessControlClient.groupMemberInvitations.queryITwinGroupMemberInvitations(
          accessToken,
          TestConfig.itwinId,
          createGroupResponse.data!.group!.id!
        );

      // Assert
      expect(getInvitationsResponse.status).toBe(200);
      expect(getInvitationsResponse.data).toBeDefined();
      expect(getInvitationsResponse.data!.invitations).toBeDefined();
      expect(Array.isArray(getInvitationsResponse.data!.invitations)).toBe(
        true
      );
      expect(getInvitationsResponse.data!._links).toBeDefined();
    } finally {
        const groups = await accessControlClient.groups.getITwinGroups(
        accessToken,
        TestConfig.itwinId,
      );
      const groupId = groups.data?.groups.filter(group => group.name === "User invite test group" && group.description)[0].id!
      await accessControlClient.groups.updateITwinGroup(
        accessToken,
        TestConfig.itwinId,
        groupId,
        { members: [] }
      );
      await accessControlClient.groups.deleteITwinGroup(
        accessToken,
        TestConfig.itwinId,
        groupId
      );
    }
  });
});
