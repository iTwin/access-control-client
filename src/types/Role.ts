/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Permission } from "./Permission";

export interface Role {
  id?: string;
  displayName: string;
  description: string;
  permissions: Permission[];
}