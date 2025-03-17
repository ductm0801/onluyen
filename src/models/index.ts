import {
  difficultyEnum,
  examEnum,
  pendingExamEnum,
  questionEnum,
  statusEnum,
} from "@/constants/enum";

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
  isDelete: boolean;
};
export type IRegist = {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  gender: string;
  username: string;
  role: string;
};
export type IQuestion = {
  id: string;
  title: string;
  imageUrl: string;
  difficulty: keyof typeof difficultyEnum;
  type: keyof typeof questionEnum;
  testId: string;
  testName: string;
  isDeleted: boolean;
  answerText?: string;
  answers: IAnswers[];
};

export type IQuestionBank = {
  id: string;
  questionBankName: string;
  subjectId: string;
  description: string;
  subjectName: string;
  isDeleted: boolean;
};
export type IAnswers = {
  content: string;
  id: string;
  imageUrl?: string;
  isCorrect: boolean;
  questionId: string;
  isSelected: boolean;
};
export type IExamBank = {
  id: string;
  testBankName: string;
  description: string;
  subjectId: string;
  subjectName: string;
  isDeleted: boolean;
};
export type IExam = {
  id: string;
  testName: string;
  description: string;
  testDate: Date;
  length: number;
  testBankId: string;
  testBankName: string;
  testType: keyof typeof examEnum;
  testApprovalStatus: keyof typeof pendingExamEnum;
  totalGrade: number;
  isDeleted: boolean;
  questions: IQuestion[];
  studentGrade: number;
  studentCorrectAnswers: number;
};

export type IExamPayment = {
  examEnrollmentId: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  cancelUrl: string;
  returnUrl: string;
};
export type IPayment = {
  paymentType: string;
  id: string;
  description: string;
  orderCode: string;
  method: string;
  transactionAmount: number;
  status: keyof typeof statusEnum;
  creationDate: Date;
};
export type ICourse = {
  courseId: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  imageUrl: string;
  coursePrice: number;
  courseStatus: string;
  instructorId: string;
  instructorName: string;
  lessons: ILessons;
};
export type ILessons = {
  totalItemsCount: number;
  pageSize: number;
  totalPageCount: number;
  pageIndex: number;
  next: boolean;
  previous: boolean;
  items: ILesson[];
};
export type ILesson = {
  lessonId: string;
  order: number;
  title: string;
  description: string;
  videoUrl: string;
  content: string;
  imageUrl: string;
  courseId: string;
  courseName: string;
};

export type ITest = {
  id: string;
  examName: string;
  description: string;
  freeAttempts: number;
  price: number;
  subjectId: string;
  subjectName: string;
  testBankId: string;
  testBankName: string;
  testSkills: number;
  examDate: Date;
  isDeleted: boolean;
  isEnrolled: boolean;
  enrollmentId: string;
  hasOngoingAttempt: boolean;
};
