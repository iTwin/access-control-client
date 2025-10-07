/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as crypto from "crypto";
import type { AccessToken } from "@itwin/core-bentley";
import type { TestUserCredentials } from "@itwin/oidc-signin-tool/lib/cjs/frontend";
import {
  getAccessTokenFromBackend,
  TestUsers,
} from "@itwin/oidc-signin-tool/lib/cjs/frontend";

/** Basic configuration used by all tests
 */
export class TestConfig {
  // Encryption settings
  private static readonly ENCRYPTION_KEY = process.env.IMJS_ENCRYPTION_KEY;
  private static readonly ALGORITHM = "aes-256-cbc";

  public static readonly permanentRoleName1: string = process.env.IMJS_TEST_PERMANENT_ROLE_NAME1!;
  public static readonly permanentRoleId1: string = process.env.IMJS_TEST_PERMANENT_ROLE_ID1!;

  public static readonly permanentRoleName2: string = process.env.IMJS_TEST_PERMANENT_ROLE_NAME2!;
  public static readonly permanentRoleId2: string = process.env.IMJS_TEST_PERMANENT_ROLE_ID2!;

  public static readonly permanentGroupName1: string = process.env.IMJS_TEST_PERMANENT_GROUP_NAME1!;
  public static readonly permanentGroupId1: string = process.env.IMJS_TEST_PERMANENT_GROUP_ID1!;

  public static readonly permanentGroupName2: string = process.env.IMJS_TEST_PERMANENT_GROUP_NAME2!;
  public static readonly permanentGroupId2: string = process.env.IMJS_TEST_PERMANENT_GROUP_ID2!;

  public static readonly permanentImsGroupName: string = process.env.IMJS_TEST_PERMANENT_IMSGROUP_NAME!;

  public static readonly temporaryUserEmail: string = process.env.IMJS_TEST_TEMP_USER_EMAIL!;
  public static readonly temporaryUserId: string = process.env.IMJS_TEST_TEMP_USER_ID!;

  public static readonly regularUserId: string = process.env.IMJS_TEST_REGULAR_USER_ID!;

  public static readonly itwinId: string = process.env.IMJS_TEST_ITWIN_ID!;

  /**
   * Encrypts sensitive data using AES-256-CBC
   */
  private static encrypt(text: string): string {
    if (!this.ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not defined in environment variables.");
    }
    const key = crypto.createHash('sha256').update(this.ENCRYPTION_KEY).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypts data encrypted with the encrypt method
   * Usage: TestConfig.decrypt("encrypted_string_from_logs")
   */
  public static decrypt(encryptedText: string): string {
    if (!this.ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not defined in environment variables.");
    }
    const key = crypto.createHash('sha256').update(this.ENCRYPTION_KEY).digest();
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Logs encrypted sensitive data
   */
  private static logEncrypted(label: string, data: any): void {
    const dataString = JSON.stringify(data, null, 2);
    const encrypted = this.encrypt(dataString);
    console.log(`${label}: ${encrypted}`);
  }

  /** Login the specified user and return the AuthorizationToken */
  public static async getAccessToken(
    user: TestUserCredentials = TestUsers.super
  ): Promise<AccessToken> {
    this.logEncrypted('LOG[41]: user', user);
    return getAccessTokenFromBackend(user);
  }
}
