export type ILoginRequest = {
  username: string;
  password: string;
};

export type User = {
  UserId: string;
  UserName: string;
  Role: string;
  exp: number;
};
