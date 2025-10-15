/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ResultMode } from "../types/CommonApiTypes";
import type { ITwinJob, ITwinJobActions } from "../types/ITwinJob";
import { BaseClient } from "./BaseClient";
import type { IITwinJobsClient } from "./accessControlClientInterfaces/ITwinJobsClient";

export class ITwinJobsClient extends BaseClient implements IITwinJobsClient {
  public constructor(url?: string) {
    super(url);
  }

  /** Create a new iTwin Job
     * @param accessToken The client access token string
     * @param iTwinId The id of the iTwin
     * @param iTwinActions The actions of the iTwin Job
     * @returns ITwin Job
     */
  public async createITwinJob(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobActions: ITwinJobActions
  ): Promise<BentleyAPIResponse<ITwinJob>> {
    const url = `${this._baseUrl}/${iTwinId}/jobs`;
    return this.sendGenericAPIRequest(accessToken, "POST", url, { actions: iTwinJobActions });
  }

  /** Gets an iTwin Job.
     * @param accessToken The client access token string
     * @param iTwinId The id of the iTwin
     * @param iTwinJobId The id of the iTwin Job
     * @param resultMode (Optional) Access Control result mode: minimal or representation (defaults to minimal)
     * @returns ITwin Job
     */
  public async getITwinJob<T extends ResultMode = "minimal">(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobId: string,
    resultMode?: T
  ): Promise<BentleyAPIResponse<T extends "representation" ? ITwinJob : Omit<ITwinJob, "error">>> {
    const headers = this.getResultModeHeaders(resultMode);
    const url = `${this._baseUrl}/${iTwinId}/jobs/${iTwinJobId}`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, undefined, headers);
  }

  /** Gets an iTwin Job.
     * @param accessToken The client access token string
     * @param iTwinId The id of the iTwin
     * @param iTwinJobId The id of the iTwin Job
     * @returns ITwin Job Actions
     */
  public async getITwinJobActions(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobId?: string
  ): Promise<BentleyAPIResponse<ITwinJobActions>> {
    const url = `${this._baseUrl}/${iTwinId}/jobs/${iTwinJobId}/actions`;
    return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "actions");
  }

  /**
   * Format result mode parameter into a headers entry
   * @param resultMode (Optional) Access Control result mode
   * @protected
   */
  protected getResultModeHeaders(resultMode: ResultMode = "minimal"): Record<string, string> {
    return {
      prefer: `return=${resultMode}`,
    };
  }
}
