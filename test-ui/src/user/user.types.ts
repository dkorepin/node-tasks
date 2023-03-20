export type TUser = {
  id: string;
  login: string;
  password: string;
  age: number;
};

export type TUserResponse = {
    users: TUser[];
}

export type TSearchParams = {
  search?: string;
  limit?: number;
};
