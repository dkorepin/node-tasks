import { TUser } from "./user-types";

export const userFields: (keyof Omit<TUser, "groups">)[] = [
  "login",
  "password",
  "age",
];
