/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module AccessControlClient
 */
import type { IAccessControlClient, IMembersClient, IPermissionsClient, IRolesClient } from "./accessControlTypes";
import { MembersClient } from "./subClients/MembersClient";
import { PermissionsClient } from "./subClients/PermissionsClient";
import { RolesClient } from "./subClients/RolesClient";

export class AccessControlClient implements IAccessControlClient {
  public permissions: IPermissionsClient = new PermissionsClient();
  public roles: IRolesClient = new RolesClient();
  public members: IMembersClient = new MembersClient();
}
