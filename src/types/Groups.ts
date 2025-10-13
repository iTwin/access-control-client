import { GroupUser } from "./Users";

export interface Group {
  id: string;
  name: string;
  description: string;
  members: GroupUser[];
  imsGroups: string[];
}

export interface SingleGroupResponse {
  group: Group;
}

export interface MultipleGroupsResponse {
  groups: Group[];
}
