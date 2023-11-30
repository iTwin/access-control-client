/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import { TestUsers } from "@itwin/oidc-signin-tool/lib/cjs/frontend";
import * as chai from "chai";
import { AccessControlClient } from "../../AccessControlClient";
import type {
  AccessControlAPIResponse,
  AddOwnerMemberResponse,
  IAccessControlClient,
  OwnerMember,
} from "../../accessControlTypes";
import { TestConfig } from "../TestConfig";

chai.should();
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

  before(async function () {
    this.timeout(0);
    accessToken = await TestConfig.getAccessToken();
  });

  it("should get a list of owner members for an iTwin", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.projectId
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a list of owner members for an iTwin with custom url", async () => {
    // Act
    const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
      await customAccessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.projectId,
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.greaterThan(0);
  });

  it("should get a filtered list of owner members for an iTwin using $top", async () => {
    // Arrange
    const topAmount = 1;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.projectId,
        { top: topAmount }
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.eq(topAmount);
  });

  it("should get a filtered list of owner members for an iTwin using $skip", async () => {
    // Arrange
    const unFilteredList: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.projectId
      );
    const skipAmmount = 1;
    const topAmount = 1;

    // Act
    const iTwinsResponse: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.projectId,
        { skip: skipAmmount, top: topAmount }
      );

    // Assert
    chai.expect(iTwinsResponse.status).to.be.eq(200);
    chai.expect(iTwinsResponse.data).to.not.be.empty;
    chai.expect(iTwinsResponse.data!).to.not.be.empty;
    chai.expect(iTwinsResponse.data!.length).to.be.eq(topAmount);
    unFilteredList.data!.slice(0, skipAmmount).forEach((member) => {
      chai.expect(iTwinsResponse.data!.includes(member)).to.be.false;
    });
  });

  it("should get add, get, and remove a owner member", async () => {
    // --- Add Owner ---
    // Act

    // eslint-disable-next-line no-console
    console.log(`calling addITwinOwnerMember with ${TestUsers.manager.email} and project ${TestConfig.projectId} and token ${accessToken}`);
    const addOwnerMemberResponse: AccessControlAPIResponse<AddOwnerMemberResponse> =
      await accessControlClient.ownerMembers.addITwinOwnerMemberAsync(
        accessToken,
        TestConfig.projectId,
        {
          email: TestUsers.manager.email,
        },
      );
    // Assert
    chai.expect(addOwnerMemberResponse.status).to.be.eq(201, `received error: ${JSON.stringify(addOwnerMemberResponse.error)}`);
    chai.expect(addOwnerMemberResponse.data).to.not.be.empty;
    chai.expect(addOwnerMemberResponse.data!.member).to.not.be.empty;
    chai.expect(addOwnerMemberResponse.data!.member!.email).to.be.eq(TestConfig.temporaryUserEmail);

    // --- Check owner exists ---
    // Act
    const queryOwnerMemberResponse: AccessControlAPIResponse<OwnerMember[]> =
      await accessControlClient.ownerMembers.queryITwinOwnerMembersAsync(
        accessToken,
        TestConfig.projectId
      );

    chai.expect(queryOwnerMemberResponse.status).to.be.eq(200);
    chai.expect(queryOwnerMemberResponse.data).to.not.be.undefined;
    chai.expect(queryOwnerMemberResponse.data![1]).to.not.be.undefined;
    const newOwner = queryOwnerMemberResponse.data![1];
    chai.expect(newOwner).to.not.be.undefined;
    chai
      .expect(newOwner.email)
      .to.be.eq(TestConfig.temporaryUserEmail);

    // --- Remove owner ---
    // Act
    const removeOwnerMemberResponse: AccessControlAPIResponse<undefined> =
      await accessControlClient.ownerMembers.removeITwinOwnerMemberAsync(
        accessToken,
        TestConfig.projectId,
        TestConfig.temporaryUserId
      );

    chai.expect(removeOwnerMemberResponse.status).to.be.eq(204);
    chai.expect(removeOwnerMemberResponse.data).to.be.undefined;
  });
});
