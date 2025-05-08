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
import { message } from "antd";

export const login = async (body: ILoginRequest) => {
  const res = await axiosClient.post("/api/accounts/login", body);
  return res.data;
};
export const getSubject = async (showGeneralSubject?: boolean) => {
  const res = await axiosClient.get("/api/subject", {
    params: {
      isSortByCourse: false,
      showGeneralSubject: showGeneralSubject || false,
    },
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
export const getUser = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get("/api/users", {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const updateUserStatus = async (
  id: string,
  reason: string,
  status: string
) => {
  const res = await axiosClient.post(`/api/users/status/${id}`, {
    reason,
    status,
  });
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

export const getExamBank = async (
  pageIndex: number,
  pageSize: number,
  filter: any
) => {
  const res = await axiosClient.get(`/api/testBank/paging`, {
    params: {
      pageIndex,
      pageSize,
      universityId: filter.universityId,
      subjectId: filter.subjectId,
      searchTerm: filter.searchTerm,
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
export const getExam = async (
  pageIndex: number,
  pageSize: number,
  filter: any
) => {
  const res = await axiosClient.get(`/api/test/paging`, {
    params: {
      pageIndex,
      pageSize,
      searchTerm: filter.search,
      testApprovalStatus: filter.status,
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
export const uploadVideo = async (formData: FormData) => {
  const res = await axiosClient.post(`/api/image/upload-video`, formData, {
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
export const getInstructorCourseDetail = async (
  id: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/courses/${id}`, {
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
        subjectId: filter.subjectId,
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
export const getNoti = async () => {
  const res = await axiosClient.get(`/api/chat/get_noti`);
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
  pageSize: number,
  subjectId?: string | string[]
) => {
  const res = await axiosClient.get(`/api/courses/guest`, {
    params: { pageIndex, pageSize, subjectId },
  });
  return res.data;
};
export const publishCourse = async (id: string | string[]) => {
  const res = await axiosClient.put(`/api/courses/status/${id}`, { status: 1 });
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
  const res = await axiosClient.get(`/api/users/get_userDetail`);
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
export const getHistoryExamDetail = async (
  id: string,
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/exam/studentExamResult/${id}`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const insstructorRegist = async (body: any) => {
  const res = await axiosClient.post(`/api/instructors/regist`, body);
  return res.data;
};
export const updateLessonProgress = async (id: string) => {
  const res = await axiosClient.put(`/api/progress/complete/${id}`);
  return res.data;
};
export const startCourse = async (id: string) => {
  const res = await axiosClient.put(`/api/student-course/start/${id}`);
  return res.data;
};
export const getStudentCourseProgress = async () => {
  const res = await axiosClient.get(`/api/student-course/student-paging`);
  return res.data;
};
export const getStudentCourse = async () => {
  const res = await axiosClient.get(`/api/student-course/student-paging`);
  return res.data;
};
export const getStudentSchedule = async (
  startDate: string,
  endDate: string
) => {
  const res = await axiosClient.get(`/api/schedules/timeSlotToStudy`, {
    params: {
      startDate,
      endDate,
    },
  });
  return res.data;
};
export const getTransactionList = async (
  pageIndex: number,
  pageSize: number,
  status?: number
) => {
  const res = await axiosClient.get(
    `/api/instructor_transaction/get_list_pending`,
    {
      params: {
        pageIndex,
        pageSize,
        SortBy: "string",
        Status: status,
        SortAscending: false,
      },
    }
  );
  return res.data;
};

export const getExamAnalyze = async (id: string, year: number) => {
  const res = await axiosClient.get(`/api/exam/analyse/${id}`, {
    params: {
      year,
    },
  });
  return res.data;
};
export const getAIRecommendation = async () => {
  const res = await axiosClient.post(`/api/students/getRecommendationFromAI`);
  return res.data;
};
export const revokeTest = async (id: string, reason: string) => {
  const res = await axiosClient.patch(`/api/test/revokeTest/${id}`, {
    params: { reason },
  });
  return res.data;
};
export const updateBankAccount = async (body: any) => {
  const res = await axiosClient.put(`/api/instructors/update_instructor`, body);
  return res.data;
};
export const getInstructorDashboard = async (filterType: string) => {
  const res = await axiosClient.get(
    `/api/instructor_transaction/get_list_monthly_revenue`,
    { params: { filterType } }
  );
  return res.data;
};
export const getInstructorTransactionHistory = async (
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(
    `/api/instructor_transaction/get_all_instructor_transaction`,
    {
      params: {
        SortBy: "string",
        SortAscending: false,
        pageIndex,
        pageSize,
      },
    }
  );
  return res.data;
};
export const instructorWithdraw = async (amount: number) => {
  const res = await axiosClient.post(
    `/api/instructor_transaction/create_withdraw_order`,
    { amount }
  );
  return res.data;
};
export const adminUpdatePendingTransaction = async (
  id: string,
  status: number,
  amount: number
) => {
  const res = await axiosClient.put(
    `/api/instructor_transaction/confirm_withdrawal_order`,

    {
      instructorTransactionId: id,
      status,
      amount,
    }
  );
  return res.data;
};
export const getInstructorTransaction = async (
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(
    `/api/instructor_transaction/get_all_instructor_transaction`,
    {
      params: {
        SortBy: "string",
        SortAscending: false,
        pageIndex,
        pageSize,
      },
    }
  );
  return res.data;
};
export const getInstructorPending = async () => {
  const res = await axiosClient.get(`/api/users/get_userInactiveStatus`);
  return res.data;
};
export const updateInstructorPending = async (id: string, status: string) => {
  const res = await axiosClient.post(`/api/user-registration/status/${id}`, {
    status,
  });
  return res.data;
};
export const getAdminTransactionDashboard = async (filter: string) => {
  const res = await axiosClient.get(
    `/api/instructor_transaction/get_all_bymonth_and_byday_revenue`,
    { params: { filter } }
  );
  return res.data;
};
export const getAdminRevenue = async () => {
  const res = await axiosClient.get(
    `/api/instructor_transaction/get_all_revenue`
  );
  return res.data;
};
export const getExamAIAnalyze = async (id: string | string[]) => {
  const res = await axiosClient.get(`/api/exam/analyseWeakness/${id}`);
  return res.data;
};
export const getUniversity = async () => {
  const res = await axiosClient.get(`/api/university`);
  return res.data;
};
export const handleTrialCourse = async (id: string | string[]) => {
  const res = await axiosClient.post(`/api/student-course/student-trial/${id}`);
  return res.data;
};
export const postConsultRequest = async (
  message: string,
  testAttemptId: string | string[]
) => {
  const res = await axiosClient.post(`/api/consultRequest`, {
    message,
    testAttemptId,
  });
  return res.data;
};
export const getConsultRequest = async (
  pageIndex: number,
  pageSize: number,
  status?: number
) => {
  const res = await axiosClient.get(`/api/consultRequest/paging`, {
    params: { pageIndex, pageSize, consultRequestStatus: status },
  });
  return res.data;
};
export const getConsultRequestDetail = async (id: string | string[]) => {
  const res = await axiosClient.get(`/api/consultRequest/${id}`);
  return res.data;
};
export const getCourseLearning = async (
  id: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/student-course/student/${id}`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const getCoursePending = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get(`/api/courses/approval-required`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const getCoursePendingDetail = async (
  id: string | string[],
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/courses/${id}`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const adminUpdatePendingCourse = async (
  id: string | string[],
  status: number
) => {
  const res = await axiosClient.put(`/api/courses/approval/${id}`, {
    status,
  });
  return res.data;
};
export const getUniversityPaging = async (
  pageIndex: number,
  pageSize: number
) => {
  const res = await axiosClient.get(`/api/university/paging`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const createUniversity = async (body: any) => {
  const res = await axiosClient.post(`/api/university`, body);
  return res.data;
};
export const updateUniversity = async (body: any, id: string) => {
  const res = await axiosClient.put(`/api/university/${id}`, body);
  return res.data;
};
export const deleteUniversity = async (id: string) => {
  const res = await axiosClient.delete(`/api/university/${id}`);
  return res.data;
};
export const updateConsultRequest = async (
  status: number,
  id: string | string[]
) => {
  const res = await axiosClient.patch(`/api/consultRequest/${id}`, { status });
  return res.data;
};
export const createSchedule = async (body: any) => {
  const res = await axiosClient.post(`/api/schedules`, body);
  return res.data;
};
export const getSchedule = async (
  pageIndex: number,

  pageSize: number,
  courseId: string | string[]
) => {
  const res = await axiosClient.get(`/api/schedules/course/${courseId}`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};

export const updateSchedule = async (body: any, id: string | string[]) => {
  const res = await axiosClient.put(`/api/schedules/${id}`, body);
  return res.data;
};
export const getUserDetail = async (id: string | string[]) => {
  const res = await axiosClient.get(`/api/users/get_userDetail/${id}`);
  return res.data;
};
export const updateInstructorRate = async (
  id: string | string[],
  rate: number
) => {
  const res = await axiosClient.put(`/api/instructors/update_instructor_rate`, {
    id,
    rate,
  });
  return res.data;
};
export const sendConsultantRequestMessage = async (body: any) => {
  const res = await axiosClient.post(
    `/api/chat/send_chat_consultant_request`,
    body
  );
  return res.data;
};
export const getConsultantRequestChat = async (
  receiverId: string | string[],
  consultantRequesstId: string | string[]
) => {
  const res = await axiosClient.get(`/api/chat/get_messages_consultant`, {
    params: {
      receiverId,
      consultantRequesstId,
    },
  });
  return res.data;
};
export const getMeetLink = async (timeSlotId: string) => {
  const res = await axiosClient.get(`/api/schedules/meetlink/${timeSlotId}`);
  return res.data;
};
export const getInstructorSchedule = async (
  startDate: string,
  endDate: string
) => {
  const res = await axiosClient.get(`/api/schedules/timeSlotToTeach`, {
    params: { startDate, endDate },
  });
  return res.data;
};
export const updateNoti = async (notiId: string) => {
  const res = await axiosClient.put(`/api/chat/update_isread/${notiId}`);
  return res.data;
};
export const updatePassword = async (body: any) => {
  const res = await axiosClient.put(`/api/accounts/updatePassword`, body);
  return res.data;
};
export const resetPassword = async (body: any) => {
  const res = await axiosClient.put(`/api/accounts/forgotPassword`, body);
  return res.data;
};
export const getNewsPaging = async (pageIndex: number, pageSize: number) => {
  const res = await axiosClient.get(`/api/article`, {
    params: { pageIndex, pageSize },
  });
  return res.data;
};
export const createNews = async (body: any) => {
  const res = await axiosClient.post(`/api/article`, body);
  return res.data;
};
export const createFeedback = async (
  body: any,
  courseId: string | string[]
) => {
  const res = await axiosClient.post(`/api/feedback/${courseId}`, body);
  return res.data;
};
export const updateNews = async (newsId: string | string[], body: any) => {
  const res = await axiosClient.put(`/api/article/${newsId}`, body);
  return res.data;
};
export const hideNews = async (newsId: string | string[]) => {
  const res = await axiosClient.put(`/api/article/delete/${newsId}`);
  return res.data;
};
export const changeTimeSlot = async (
  learningSlotId: string | string[],
  body: any
) => {
  const res = await axiosClient.post(
    `/api/schedules/cancelAndRescheduleSlotAsync/${learningSlotId}`,
    body
  );
  return res.data;
};
export const getGeneralExam = async (
  pageIndex: number,
  pageSize: number,
  universityId?: string
) => {
  const res = await axiosClient.get(`/api/exam/GeneralPaging`, {
    params: {
      pageIndex,
      pageSize,
      universityId,
    },
  });
  return res.data;
};
