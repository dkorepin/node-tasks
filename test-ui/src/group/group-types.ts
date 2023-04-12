import { TUser } from "../user/user-types";

export type Permission = "READ" | "WRITE" | "DELETE" | "SHARE" | "UPLOAD_FILES";

export const allPermissions: Permission[] = [
  "READ",
  "WRITE",
  "DELETE",
  "SHARE",
  "UPLOAD_FILES",
];
export type TGroup = {
  id: string;
  name: string;
  permissions: Permission[];
  users: TUser[];
};

export type TGroupResponse = {
  group: TGroup[];
};
