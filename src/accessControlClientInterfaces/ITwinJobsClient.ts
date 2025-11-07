/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import type { BentleyAPIResponse, ResultMode } from "../types/CommonApiTypes";
import type { ITwinJob, ITwinJobActions } from "../types/ITwinJob";

export interface IITwinJobsClient {
  /** Creates a new iTwin Job */
  createITwinJob(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobActions: ITwinJobActions
  ): Promise<BentleyAPIResponse<ITwinJob>>;

  /** Gets an iTwin Job. To see errors, pass in the `representation` result mode. */
  getITwinJob<T extends ResultMode = "minimal">(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobId: string,
    resultMode?: T
  ): Promise<BentleyAPIResponse<T extends "representation" ? ITwinJob : Omit<ITwinJob, "error">>>;

  /** Gets the iTwin Job Actions for a specified iTwin Job. */
  getITwinJobActions(
    accessToken: AccessToken,
    iTwinId: string,
    iTwinJobId?: string
  ): Promise<BentleyAPIResponse<ITwinJobActions>>;
}
