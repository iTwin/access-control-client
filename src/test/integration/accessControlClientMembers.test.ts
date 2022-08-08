/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as chai from "chai";
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse} from "../../access-control-client";
import { AccessControlClient } from "../../access-control-client";
import { TestConfig } from "../TestConfig";
import type { MemberResponse, MembersResponse } from "../../accessControlProps";

chai.should();
describe("AccessControlClient Members", () => {
  const accessControlClient: AccessControlClient = new AccessControlClient();
  const iTwinId = process.env.IMJS_TEST_PROJECT_ID;
  let accessToken: AccessToken;

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of members for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<MembersResponse> =
      await accessControlClient.queryITwinMembersAsync(accessToken, iTwinId!);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.members).to.not.be.empty;
  });

  it("should get a specific member for an iTwin", async () => {
    // Arrange
    const userId = process.env.IMJS_TEST_REGULAR_USER_ID;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<MemberResponse> =
      await accessControlClient.getITwinMemberAsync(accessToken, iTwinId!, userId!);

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.member.id).to.be.eq(userId);
  });
});
