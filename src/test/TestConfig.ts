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
  // Encryption settings
  private static readonly ENCRYPTION_KEY = process.env.IMJS_ENCRYPTION_KEY;

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
   * Encrypts sensitive data using Web Crypto API (browser compatible)
   */
  private static async encrypt(text: string): Promise<string> {
    if (!this.ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not defined in environment variables.");
    }

    // Create key from encryption key string
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.ENCRYPTION_KEY.padEnd(32, '0').substring(0, 32));
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const data = encoder.encode(text);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);

    // Convert to hex string
    return Array.from(result)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Decrypts data encrypted with the encrypt method
   * Usage: TestConfig.decrypt("encrypted_string_from_logs")
   */
  public static async decrypt(encryptedHex: string): Promise<string> {
    if (!this.ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY is not defined in environment variables.");
    }

    // Convert hex string back to bytes
    const encryptedData = new Uint8Array(
      encryptedHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16))
    );

    // Extract IV and encrypted data
    const iv = encryptedData.slice(0, 12);
    const data = encryptedData.slice(12);

    // Create key from encryption key string
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.ENCRYPTION_KEY.padEnd(32, '0').substring(0, 32));
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  /**
   * Logs encrypted sensitive data
   */
  private static async logEncrypted(label: string, data: any): Promise<void> {
    try {
      const dataString = JSON.stringify(data, null, 2);
      const encrypted = await this.encrypt(dataString);
      console.log(`${label}: ${encrypted}`);
    } catch (error) {
      // Fallback to simple masking if encryption fails
      console.log(`${label}: [ENCRYPTED_DATA_ERROR - ${error}]`);
    }
  }

  /** Login the specified user and return the AuthorizationToken */
  public static async getAccessToken(
    user: TestUserCredentials = TestUsers.super
  ): Promise<AccessToken> {
    await this.logEncrypted('LOG[41]: user', user);
    return getAccessTokenFromBackend(user);
  }
}
