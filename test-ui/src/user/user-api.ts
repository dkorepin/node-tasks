import {
  TSearchParams,
  fetchData,
  fetchDelete,
  postData,
} from "../api-helpers";
import { OnErrorHandler } from "../simple-alert";
import { TUser } from "./user-types";

export const fetchUsers = (
  { search, limit }: TSearchParams,
  token: string,
  callback: (users: {}) => void,
  onError: OnErrorHandler
) =>
  fetchData(`users?search=${search}&limit=${limit}`, token, callback, onError);

export const fetchCreateUser = (
  user: Partial<TUser>,
  token: string,
  onError: OnErrorHandler
) => postData("users", "Post", user, token, onError);

export const fetchUpdateUser = (
  user: Partial<TUser>,
  token: string,
  onError: OnErrorHandler
) =>
  postData(
    `users/${user.id}`,
    "Put",
    {
      login: user.login,
      password: user.password,
      age: user.age,
    },
    token,
    onError
  );

export const fetchDeleteUser = (
  id: string,
  token: string,
  onError: OnErrorHandler
) => fetchDelete(`users/${id}`, token, onError);

export const fetchAddGroup = (
  data: Partial<{ userId: string; groupId: string }>,
  token: string,
  onError: OnErrorHandler
) =>
  postData(
    `users/addToGroup/${data.userId}`,
    "Post",
    { id: data.groupId },
    token,
    onError
  );
