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
  public permissions: IPermissionsClient;
  public roles: IRolesClient;
  public members: IMembersClient;

  public constructor(url?: string){
    this.permissions = new PermissionsClient(url);
    this.roles = new RolesClient(url);
    this.members = new MembersClient(url);
  }
}
