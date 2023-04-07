import { TSearchParams, handleErrors } from "../api-helpers";
import { OnErrorHandler } from "../simple-alert";
import { TUser, TUserResponse } from "./user-types";

export const fetchUsers = async (
  { search, limit }: TSearchParams,
  callback: (users: TUser[]) => void,
  onError: OnErrorHandler
) => {
  try {
    const response: Response = await fetch(
      `http://localhost:3001/users?search=${search}&limit=${limit}`
    );
    const json: TUserResponse = await response.json();
    handleErrors(response, json, onError);
    callback(json?.users || []);
  } catch (e) {
    console.error(e);
    callback([]);
  }
};

export const fetchCreateUser = async (
  user: Partial<TUser>,
  onError: OnErrorHandler
) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");

    const response = await fetch(`http://localhost:3001/users`, {
      method: "Post",
      headers,
      body: JSON.stringify(user),
    });
    const json = await response.json();

    handleErrors(response, json, onError);
  } catch (e) {
    console.error(e);
  }
};

export const fetchUpdateUser = async (
  user: Partial<TUser>,
  onError: OnErrorHandler
) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");

    const response = await fetch(`http://localhost:3001/users/${user.id}`, {
      method: "Put",
      headers,
      body: JSON.stringify({
        login: user.login,
        password: user.password,
        age: user.age,
      }),
    });
    const json = await response.json();

    handleErrors(response, json, onError);
  } catch (e) {
    console.error(e);
  }
};

export const fetchDeleteUser = async (id: string, onError: OnErrorHandler) => {
  try {
    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "Delete",
    });

    const json = await response.json();

    handleErrors(response, json, onError);
  } catch (e) {
    console.error(e);
  }
};

export const fetchAddGroup = async (
  data: Partial<{userId: string, groupId: string}>,
  onError: OnErrorHandler
) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");

    const response = await fetch(`http://localhost:3001/users/addToGroup/${data.userId}`, {
      method: "Post",
      headers,
      body: JSON.stringify({id: data.groupId}),
    });
    const json = await response.json();

    handleErrors(response, json, onError);
  } catch (e) {
    console.error(e);
  }
};

