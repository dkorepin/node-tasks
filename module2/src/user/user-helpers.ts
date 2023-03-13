import { v4 } from "uuid";
import { User } from "./user-types.js";

export const filterAndSortUsers = (users: User[], search: string, limit: string): User[] =>
  users
    .filter(({ isDeleted, login }) => {
        if (isDeleted) return false

        console.log('search and limit',search, search.length, limit, limit.length);
        return search.length > 0 ? login.toLowerCase().includes(String(search).toLowerCase()) : true;
    })
    .sort((aUser, bUser) => {
      if (aUser.login < bUser.login) return -1;
      if (aUser.login > bUser.login) return 1;
      return 0;
    }).slice(0, limit.length > 0  ? Number(limit) : 100);

export const makeNewUserByBody = (body: Partial<User>): User => ({
  id: v4(),
  login: body.login,
  password: body.password,
  age: body.age,
  isDeleted: false,
});
