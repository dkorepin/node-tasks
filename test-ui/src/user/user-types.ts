import { TGroup } from "../group/group-types";

export type TUser = {
  id: string;
  login: string;
  password: string;
  age: number;
  groups: TGroup[];
};

export type TUserResponse = {
  users: TUser[];
};
