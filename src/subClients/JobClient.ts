/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import type { AccessControlAPIResponse, IJobsClient, ITwinJob, ITwinJobActions, AccessControlResultMode } from "../accessControlTypes";
import { BaseClient } from "./BaseClient";

export class JobsClient extends BaseClient implements IJobsClient {
    public constructor(url?: string) {
        super(url);
    }

    /** Create a new iTwin Job
     * @param accessToken The client access token string
     * @param iTwinId The id of the iTwin
     * @param iTwinActions The actions of the iTwin Job
     * @returns ITwin Job
     */
    public async createITwinJobAsync(
        accessToken: AccessToken,
        iTwinId: string,
        iTwinActions: ITwinJobActions
    ): Promise<AccessControlAPIResponse<ITwinJob>> {
        const url = `${this._baseUrl}/${iTwinId}/jobs`;
        return this.sendGenericAPIRequest(accessToken, "POST", url, iTwinActions, "actions");
    }

    /** Gets an iTwin Job.
     * @param accessToken The client access token string
     * @param iTwinId The id of the iTwin
     * @param iTwinJobId The id of the iTwin Job
     * @param resultMode (Optional) Access Control result mode: minimal or representation (defaults to minimal)
     * @returns ITwin Job
     */
    public async getITwinJobAsync(
        accessToken: AccessToken,
        iTwinId: string,
        iTwinJobId?: string,
        resultMode?: AccessControlResultMode
    ): Promise<AccessControlAPIResponse<ITwinJob>> {
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
    public async getITwinJobActionsAsync(
        accessToken: AccessToken,
        iTwinId: string,
        iTwinJobId?: string
    ): Promise<AccessControlAPIResponse<ITwinJobActions>> {
        const url = `${this._baseUrl}/${iTwinId}/jobs/${iTwinJobId}/actions`;
        return this.sendGenericAPIRequest(accessToken, "GET", url, undefined, "actions");
    }

  /**
   * Format result mode parameter into a headers entry
   * @param resultMode (Optional) Access Control result mode
   * @protected
   */
  protected getResultModeHeaders(resultMode: AccessControlResultMode = "minimal"): Record<string, string> {
    return {
      prefer: `return=${resultMode}`,
    };
  }
}