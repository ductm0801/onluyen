import axiosClient from "@/interceptor";
import {
  ICourse,
  IExam,
  IExamBank,
  IExamPayment,
  ILoginRequest,
  IQuestion,
  IQuestionBank,
  IRegist,
  IUSer,
  Subject,
} from "@/models";

export const login = async (body: ILoginRequest) => {
  const res = await axiosClient.post("/api/accounts/login", body);
  return res.data;
};
export const getSubject = async () => {
  const res = await axiosClient.get("/api/subject", {
    params: { isSortByCourse: false },
  });
  return res.data;
};
export const getSubjectPaging = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get("/api/subject/paging", {
    params: { pageIndex, pageSize },
  });
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
  pageSize: number,
  filter?: any
) => {
  const res = await axiosClient.get(
    `/api/question/questionBank/${questionBankId}`,
    {
      params: {
        pageIndex,
        pageSize,
        difficulty: filter.difficulty,
        type: filter.type,
        searchTerm: filter.search,
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
export const getExamBankAll = async (subjectId?: string) => {
  const res = await axiosClient.get(`/api/testBank`, { params: { subjectId } });
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

export const getTransactionHistory = async (
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/payment/payment_history/paging`, {
    params: {
      pageIndex,
      pageSize,
      SortAscending: false,
      SortBy: "string",
    },
  });
  return res.data;
};

export const getExamPending = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get(`/api/test/contributedList`, {
    params: {
      pageIndex,
      pageSize,
    },
  });
  return res.data;
};

export const updateTestStatus = async (body: any, id: string | string[]) => {
  const res = await axiosClient.patch(`/api/test/updateTestStatus/${id}`, body);
  return res.data;
};
export const reviewreviewTestStatus = async (body: any, id: string) => {
  const res = await axiosClient.patch(`/api/test/approveTest/${id}`, body);
  return res.data;
};
export const takeExam = async (id: string | string[], examCode: string) => {
  const res = await axiosClient.post(
    `/api/exam/takeExam/${id}?examCode=${examCode}`
  );

  return res.data;
};
export const getTest = async (
  id: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(
    `/api/exam/studentOnGoingTestAttempt/${id}`,
    {
      params: {
        pageIndex,
        pageSize,
      },
    }
  );
  return res.data;
};

export const uploadImg = async (formData: FormData) => {
  const res = await axiosClient.post(`/api/image/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const createCourse = async (body: ICourse) => {
  const res = await axiosClient.post(`/api/courses`, body);
  return res.data;
};

export const saveExam = async (body: any, id: string | string[]) => {
  const res = await axiosClient.put(`/api/exam/saveExam/${id}`, body);
  return res.data;
};
export const submitExam = async (id: string | string[]) => {
  const res = await axiosClient.post(`/api/exam/submitExam/${id}`);
  return res.data;
};
export const examResult = async (
  id: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(
    `/api/exam/studentFinishedTestAttempt/${id}`,
    {
      params: {
        pageIndex,
        pageSize,
      },
    }
  );
  return res.data;
};
export const getExamCode = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get(`/api/examcode/get_list_examcode`, {
    params: {
      pageIndex,
      pageSize,
      SortAscending: false,
      SortBy: "string",
    },
  });
  return res.data;
};
export const getCourse = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get(`/api/courses`, {
    params: {
      pageIndex,
      pageSize,
    },
  });
  return res.data;
};
export const getCourseByInstructor = async (
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/courses/instructor`, {
    params: {
      pageIndex,
      pageSize,
    },
  });
  return res.data;
};

export const getCourseDetail = async (
  id: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/courses/guest/${id}`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const getQuestionNotInExam = async (
  questionBankId: string,
  testId: string | string[],
  pageIndex: number,
  pageSize: number,
  filter?: any
) => {
  const res = await axiosClient.get(
    `/api/question/questionBank/${questionBankId}/${testId}`,
    {
      params: {
        pageIndex,
        pageSize,
        difficulty: filter.difficulty,
        type: filter.type,
        searchTerm: filter.search,
      },
    }
  );

  return res.data;
};
export const updateCourse = async (body: ICourse, id: string | string[]) => {
  const res = await axiosClient.put(`/api/courses/${id}`, body);
  return res.data;
};
export const instructorRegist = async (body: ICourse) => {
  const res = await axiosClient.post(`/api/instructors/regist`, body);
  return res.data;
};
export const getExamList = async (
  pageIndex: number,
  pageSize: number,
  filter: any
) => {
  const res = await axiosClient.get(`/api/exam/paging`, {
    params: {
      pageIndex,
      pageSize,
      searchTerm: filter.searchTerm,
      // haveFreeAttempts: filter.haveFreeAttempts,
    },
  });
  return res.data;
};
export const getChat = async (receiver: string | string[]) => {
  const res = await axiosClient.get(`/api/chat/messages`, {
    params: {
      receiver,
    },
  });
  return res.data;
};
export const sendMessage = async (body: any) => {
  const res = await axiosClient.post(`/api/chat/send_chat`, body);
  return res.data;
};
export const createQuestionBank = async (body: IQuestionBank) => {
  const res = await axiosClient.post(`/api/questionBank`, body);
  return res.data;
};
export const createTest = async (body: any) => {
  const res = await axiosClient.post(`/api/exam`, body);
  return res.data;
};
export const createLesson = async (body: any) => {
  const res = await axiosClient.post(`/api/lessons`, body);
  return res.data;
};
export const updateLesson = async (body: any, id: string | string[]) => {
  const res = await axiosClient.put(`/api/lessons/${id}`, body);
  return res.data;
};
export const updateTest = async (body: any, id: string) => {
  const res = await axiosClient.put(`/api/exam/${id}`, body);
  return res.data;
};
export const getAllInstructor = async () => {
  const res = await axiosClient.get(`/api/instructors/get_list_instructor`);
  return res.data;
};

export const getExamByTestBank = async (
  id: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/test/testBank/${id}`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const downloadExcelTemplate = async () => {
  const res = await axiosClient.get(
    `/api/question/DownloadAddQuestionTemplate`,
    { responseType: "blob" }
  );
  return res.data;
};
export const previewExcelTemplate = async (formData: FormData) => {
  const res = await axiosClient.post(
    `/api/question/previewQuestionsFromExcel`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};
export const createBulkQuestion = async (body: any, id: string | string[]) => {
  const res = await axiosClient.post(
    `/api/question/AddBulkQuestionsFromExcel/${id}`,
    body
  );
  return res.data;
};
export const getExamResults = async (
  pageIndex: number,
  pageSize: number,
  sortType: boolean
) => {
  const res = await axiosClient.get(`/api/exam/studentTaken`, {
    params: { pageIndex, pageSize, isSortByHighestGrade: sortType },
  });
  return res.data;
};
export const getCourseByStudent = async (
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/courses/guest`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const publishCourse = async (id: string | string[]) => {
  const res = await axiosClient.put(`/api/courses/status/${id}`, { status: 2 });
  return res.data;
};
export const getListChat = async () => {
  const res = await axiosClient.get(`/api/chat/chat_list`);
  return res.data;
};
export const getInstructorDetail = async (id: string | string[]) => {
  const res = await axiosClient.get(`/api/instructors/${id}`);
  return res.data;
};
export const getUserProfile = async () => {
  const res = await axiosClient.get(`/api/users/get_user`);
  return res.data;
};
export const updateUserProfile = async (body: IUSer) => {
  const res = await axiosClient.put(`/api/users/update_user`, body);
  return res.data;
};
export const updateSubject = async (body: Subject, id: string) => {
  const res = await axiosClient.put(`/api/subject/${id}`, body);
  return res.data;
};
export const paymentCourse = async (body: any) => {
  const res = await axiosClient.post(`/create_course_payment_link`, body);
  return res.data;
};
