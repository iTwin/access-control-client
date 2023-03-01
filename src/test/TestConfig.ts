/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { AccessToken } from "@itwin/core-bentley";
import type { TestUserCredentials } from "@itwin/oidc-signin-tool/lib/cjs/frontend";
import {
  getAccessTokenFromBackend,
  TestUsers,
} from "@itwin/oidc-signin-tool/lib/cjs/frontend";

/** Basic configuration used by all tests
 */
export class TestConfig {
  public static readonly permanentRoleName1: string =  process.env.IMJS_TEST_PERMANENT_ROLE_NAME1!;
  public static readonly permanentRoleId1: string = process.env.IMJS_TEST_PERMANENT_ROLE_ID1!;

  public static readonly permanentRoleName2: string =  process.env.IMJS_TEST_PERMANENT_ROLE_NAME2!;
  public static readonly permanentRoleId2: string = process.env.IMJS_TEST_PERMANENT_ROLE_ID2!;

  public static readonly permanentGroupName1: string =  process.env.IMJS_TEST_PERMANENT_GROUP_NAME1!;
  public static readonly permanentGroupId1: string = process.env.IMJS_TEST_PERMANENT_GROUP_ID1!;

  public static readonly permanentGroupName2: string =  process.env.IMJS_TEST_PERMANENT_GROUP_NAME2!;
  public static readonly permanentGroupId2: string = process.env.IMJS_TEST_PERMANENT_GROUP_ID2!;

  public static readonly permanentImsGroupName: string = process.env.IMJS_TEST_PERMANENT_IMSGROUP_NAME!;

  public static readonly temporaryUserEmail: string = process.env.IMJS_TEST_TEMP_USER_EMAIL!;
  public static readonly temporaryUserId: string = process.env.IMJS_TEST_TEMP_USER_ID!;

  public static readonly regularUserId: string = process.env.IMJS_TEST_REGULAR_USER_ID!;

  public static readonly projectId: string = process.env.IMJS_TEST_PROJECT_ID!;

  /** Login the specified user and return the AuthorizationToken */
  public static async getAccessToken(
    user: TestUserCredentials = TestUsers.super
  ): Promise<AccessToken> {
    return getAccessTokenFromBackend(user);
  }
}
