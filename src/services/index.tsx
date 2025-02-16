import API from "@/constants/API";
import axiosClient from "@/interceptor";
import { ILoginRequest } from "@/models";

export const login = async (body: ILoginRequest) => {
  const res = await axiosClient.post(API.AUTH.LOGIN, body);
  return res.data;
};
export const getSubject = async () => {
  const res = await axiosClient.get("/api/subject");
  return res.data;
};
