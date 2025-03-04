import { difficultyEnum, questionEnum } from "@/constants/enum";

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
};
