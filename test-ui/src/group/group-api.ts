import { fetchData, fetchDelete, postData } from "../api-helpers";
import { OnErrorHandler } from "../simple-alert";
import { TGroup } from "./group-types";

export const fetchGroups = async (
  token: string,
  callback: (groups: {}) => void,
  onError: OnErrorHandler
) => fetchData("group", token, callback, onError);

export const fetchCreateGroup = async (
  group: Partial<TGroup>,
  token: string,
  onError: OnErrorHandler
) => postData("group", "Post", group, token, onError);

export const fetchUpdateGroup = async (
  group: Partial<TGroup>,
  token: string,
  onError: OnErrorHandler
) =>
  postData(
    `group/${group.id}`,
    "Put",
    {
      name: group.name,
      permissions: group.permissions,
    },
    token,
    onError
  );

export const fetchDeleteGroup = async (
  id: string,
  token: string,
  onError: OnErrorHandler
) => fetchDelete(`group/${id}`, token, onError);
