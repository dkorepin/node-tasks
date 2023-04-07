import { handleErrors } from "../api-helpers";
import { OnErrorHandler } from "../simple-alert";
import { TGroupResponse, TGroup } from "./group-types";

export const fetchGroups = async (
  callback: (groups: TGroup[]) => void,
  onError: OnErrorHandler
) => {
  try {
    const response: Response = await fetch(`http://localhost:3001/group`);
    const json: TGroupResponse = await response.json();
    handleErrors(response, json, onError);
    callback(json?.group || []);
    return json?.group || [];
  } catch (e) {
    console.error(e);
    callback([]);
  }
};

export const fetchCreateGroup = async (
  group: Partial<TGroup>,
  onError: OnErrorHandler
) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");

    const response = await fetch(`http://localhost:3001/group`, {
      method: "Post",
      headers,
      body: JSON.stringify(group),
    });
    const json = await response.json();

    handleErrors(response, json, onError);
  } catch (e) {
    console.error(e);
  }
};

export const fetchUpdateGroup = async (
  group: Partial<TGroup>,
  onError: OnErrorHandler
) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");

    const response = await fetch(`http://localhost:3001/group/${group.id}`, {
      method: "Put",
      headers,
      body: JSON.stringify({
        name: group.name,
        permissions: group.permissions,
      }),
    });
    const json = await response.json();

    handleErrors(response, json, onError);
  } catch (e) {
    console.error(e);
  }
};

export const fetchDeleteGroup = async (id: string, onError: OnErrorHandler) => {
  try {
    const response = await fetch(`http://localhost:3001/group/${id}`, {
      method: "Delete",
    });

    const json = await response.json();

    handleErrors(response, json, onError);
  } catch (e) {
    console.error(e);
  }
};
