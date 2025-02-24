import API from "@/constants/API";
import axiosClient from "@/interceptor";
import { ILoginRequest, IRegist } from "@/models";

export const login = async (body: ILoginRequest) => {
  const res = await axiosClient.post(API.AUTH.LOGIN, body);
  return res.data;
};
export const getSubject = async () => {
  const res = await axiosClient.get("/api/subject");
  return res.data;
};
export const studentRegist = async (body: IRegist) => {
  const res = await axiosClient.post("/api/students/regist", body);
  return res.data;
};
export const getUser = async () => {
  const res = await axiosClient.get("/api/users");
  return res.data;
};
export const updateUserStatus = async (id: string) => {
  const res = await axiosClient.put(`/api/user-registration/status/${id}`);
  return res.data;
};
