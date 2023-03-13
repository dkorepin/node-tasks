import { User } from "./user-types.js";

const usersList: User[] = [
  {
    id: "f76db0a5-c8b2-4cf9-b1e3-f86a8d2ea8cf",
    login: "JamieNorman",
    password: "4dfTj*Er",
    age: 34,
    isDeleted: false,
  },
  {
    id: "a96db0a5-c8b2-4cf9-b1e3-f86a8d2ea8cc",
    login: "AlexCagel",
    password: "l68gg!op",
    age: 29,
    isDeleted: false,
  },
  {
    id: "1b00207a-93dc-4e47-9eac-0c4cb165db31",
    login: "BorisEltsin",
    password: "7@iudT4j",
    age: 70,
    isDeleted: false,
  }
];

export const usersData: Map<String, User> = new Map();

usersList.forEach((user) => usersData.set(user.id, user));
