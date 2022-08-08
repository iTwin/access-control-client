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
  public static readonly iTwinProjectNumber: string = "APIM-Test-Project-20210204T00-58";

  public static readonly permanentRoleName: string =  process.env.IMJS_TEST_PERMANENT_ROLE_NAME!;
  public static readonly permanentRoleId: string = process.env.IMJS_TEST_PERMANENT_ROLE_ID!;

  /** Login the specified user and return the AuthorizationToken */
  public static async getAccessToken(
    user: TestUserCredentials = TestUsers.regular
  ): Promise<AccessToken> {
    return getAccessTokenFromBackend(user);
  }
}
