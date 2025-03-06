import axiosClient from "@/interceptor";
import {
  IExam,
  IExamBank,
  IExamPayment,
  ILoginRequest,
  IQuestion,
  IRegist,
} from "@/models";

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

export const deleteQuestion = async (questionId: string) => {
  const res = await axiosClient.delete(`/api/question/${questionId}`);
  return res.data;
};

export const getExamBank = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get(`/api/testBank/paging`, {
    params: {
      pageIndex,
      pageSize,
    },
  });
  return res.data;
};
export const getExamBankAll = async () => {
  const res = await axiosClient.get(`/api/testBank`);
  return res.data;
};
export const createExamBank = async (body: IExamBank) => {
  const res = await axiosClient.post(`/api/testBank`, body);
  return res.data;
};

export const deleteExamBank = async (id: string) => {
  const res = await axiosClient.delete(`/api/testBank/${id}`);
  return res.data;
};
export const getExam = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get(`/api/test/paging`, {
    params: {
      pageIndex,
      pageSize,
    },
  });
  return res.data;
};
export const createExam = async (body: IExam) => {
  const res = await axiosClient.post(`/api/test`, body);
  return res.data;
};
export const updateExam = async (id: string | string[], body: IExam) => {
  const res = await axiosClient.put(`/api/test/${id}`, body);
  return res.data;
};

export const deleteExam = async (id: string) => {
  const res = await axiosClient.delete(`/api/test/${id}`);
  return res.data;
};
export const getExamDetail = async (
  id: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/test/${id}`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};

export const paymentExamCode = async (body: IExamPayment) => {
  const res = await axiosClient.post(`/create_exam_payment_link`, body);
  return res.data;
};

export const updateExamQuestion = async (
  id: string | string[],
  body: string[]
) => {
  const res = await axiosClient.put(`/api/test/${id}/updateQuestions`, body);
  return res.data;
};

export const getTransactionHistory = async () => {
  const res = await axiosClient.get(`/api/payment/payment_history`);
  return res.data;
};
