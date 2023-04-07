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
