import { OnErrorHandler } from "./simple-alert";

export const getErrors = (resp: any): string => {
  console.log(resp.message);
  if (resp.message) return resp.message;

  const messages: string[] =
    resp.errors?.map((err: { message: string }) => err?.message || "") || [];
  return messages.length > 0 ? messages.join(", ") : "Unknown Error";
};

export const handleErrors = (
  response: Response,
  json: any,
  onError: OnErrorHandler
) => {
  if (response.status !== 200) return onError(getErrors(json));
};

export type TSearchParams = {
  search?: string;
  limit?: number;
};

export const fetchData = async (
  url: string,
  token: string,
  callback: (users: any) => void,
  onError: OnErrorHandler
) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");
    headers.set("x-access-token", token);

    const response: Response = await fetch(`http://localhost:3001/${url}`, {
      method: "Get",
      headers,
    });
    const json: any = await response.json();
    handleErrors(response, json, onError);
    callback(json || {});
  } catch (e) {
    console.error(e);
    callback([]);
  }
};

export const fetchDelete = async (
  url: string,
  token: string,
  onError: OnErrorHandler
) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");
    headers.set("x-access-token", token);

    const response: Response = await fetch(`http://localhost:3001/${url}`, {
      method: "Delete",
      headers,
    });
    const json: any = await response.json();
    handleErrors(response, json, onError);
  } catch (e) {
    console.error(e);
  }
};

export const postData = async (
  url: string,
  method: string,
  data: any,
  token: string,
  onError: OnErrorHandler
) => {
  try {
    const headers = new Headers();
    headers.set("content-type", "application/json");
    headers.set("x-access-token", token);

    const response: Response = await fetch(`http://localhost:3001/${url}`, {
      method,
      headers,
      body: JSON.stringify(data),
    });
    const json: any = await response.json();
    handleErrors(response, json, onError);
    return json || {};
  } catch (e) {
    console.error(e);
    return {};
  }
};
