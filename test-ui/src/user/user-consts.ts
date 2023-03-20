import { TUser } from "./user.types";

export const userFields: (keyof TUser)[] = ["login", "password", "age"];
