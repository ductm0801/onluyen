import axiosClient from "@/interceptor";
import { ILoginRequest, IQuestion, IRegist } from "@/models";

export const login = async (body: ILoginRequest) => {
  const res = await axiosClient.post("/api/accounts/login", body);
  return res.data;
};
export const getSubject = async () => {
  const res = await axiosClient.get("/api/subject");
  return res.data;
};
export const getExamBySubjectId = async (
  id: string,
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/exam/subject/${id}`, {
    params: {
      pageIndex,
      pageSize,
    },
  });
  return res.data;
};
export const enrollExam = async (id: string) => {
  const res = await axiosClient.post(`/api/exam/enrollExam/${id}`);
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

export const getQuestionBank = async () => {
  const res = await axiosClient.get("/api/questionBank");
  return res.data;
};
export const getQuestionByBank = async (
  questionBankId: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(
    `/api/question/questionBank/${questionBankId}`,
    {
      params: {
        pageIndex,
        pageSize,
      },
    }
  );
  return res.data;
};
export const getQuestionDetail = async (id: string | string[]) => {
  const res = await axiosClient.get(`/api/question/${id}`);
  return res.data;
};

export const createQuestion = async (
  body: IQuestion,
  bankId: string | string[]
) => {
  const res = await axiosClient.post(`/api/question/full/${bankId}`, body);
  return res.data;
};

export const updateQuestion = async (body: IQuestion, questionId: string) => {
  const res = await axiosClient.put(`/api/question/full/${questionId}`, body);
  return res.data;
};
