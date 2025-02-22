export type ILoginRequest = {
  username: string;
  password: string;
};

export type User = {
  UserId: string;
  FullName: string;
  Role: string;
  Gender: string;
  exp: number;
};
export type Subject = {
  id: string;
  subjectName: string;
  subjectDescription: string;
};

export type IAccount = {
  address: string;
  dateOfBirth: string;
  email: string;
  fullName: string;
  gender: string;
  imageUrl?: string;
  phoneNumber: string;
  role: string;
};
